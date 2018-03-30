/*
Anagram Solution Class in NodeJS with Addon
by Rockford Wei, March 29th, 2018
*/

/**
 * This is a demo class for a high performance anagram solution in NodeJS + C++ Addon
 * @author Rockford Wei
 */
let anagramLib = require('./anagram/build/Release/anagram');
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
		let anagram = anagramLib.Anagram(body);
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

