/*
Anagram Solution Class in JavaScript
by Rockford Wei, March 7th, 2018
*/

let Anagram = require("./index.js")
let url = require("url");
let https = require('https');
let source = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt";
https.get(source, res => {
	res.setEncoding("utf8");
	let body = "";
	res.on("data", data => {
		body += data;
	});
	res.on("end", () => {
		let anagram = new Anagram(body.split('\n'));
		let http = require('http');
		let server = http.createServer((request, response) => {
			let uri = url.parse(request.url, true).query;
			response.statusCode = 200;
			response.setHeader('Content-Type', 'text/json');
			if (uri.anagram) {
				let solution = anagram.solve(uri.anagram);
				response.end(JSON.stringify(solution));
			} else {
				response.end("[]");
			}
		});
		console.log('trying http server on 8181');
		server.listen(8181);
	});
});

