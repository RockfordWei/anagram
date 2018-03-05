/*
 Anagram Server in Swift
 by Rockford Wei, March 5th, 2018
 */
import Dispatch
import Foundation
import PerfectLib
import PerfectHTTP
import PerfectHTTPServer

// download a word list
guard let u = URL(string: "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt") else {
  fatalError("url() failed")
}
let config = URLSessionConfiguration.default
let session = URLSession(configuration: config)
let waitGroup = DispatchGroup()
var urlError: Error? = nil
var downloaded: Data? = nil
waitGroup.enter()
let task = session.dataTask(with: u) { data, code, err in
  if let error = err {
    urlError = error
    waitGroup.leave()
    return
  }
  downloaded = data
  waitGroup.leave()
}
task.resume()
waitGroup.wait()
if let error = urlError {
  fatalError("\(error)")
}
guard let data = downloaded,
  let text = String(bytes: data, encoding: .utf8)
  else {
    fatalError("text is malformed")
}

// indexing the word list
let _global_anagram = Anagram(dictionary: text)
let _global_json = JSONEncoder()

struct AnagramResponse: Encodable {
  public var error = ""
  public var solution: [String] = []
}

// handle the http request
func handler(request: HTTPRequest, response: HTTPResponse) {
	response.setHeader(.contentType, value: "text/json")
  do {
    var resp = AnagramResponse()
    if let input = request.param(name: "anagram") {
      resp.solution = try _global_anagram.solve(word: input).map { $0 }
    } else {
      resp.error = "input is missing"
    }
    let json = try _global_json.encode(resp)
    response.appendBody(bytes: (json.map { $0 }))
  } catch {
    response.appendBody(string: "{\"error\": \"\(error)\"}")
  }
	response.completed()
}

// configure the server to 8181 port
let _global_confData = [
	"servers": [
		[
			"name":"localhost",
			"port":8181,
			"routes":[
				["method":"get", "uri":"/", "handler":handler],
			]
		]
	]
]

// run the server
do {
  try HTTPServer.launch(configurationData: _global_confData)
} catch {
	fatalError("\(error)") 
}
