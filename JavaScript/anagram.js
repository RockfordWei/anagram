/*
Anagram Solution Class in JavaScript
by Rockford Wei, March 7th, 2018
*/
class Anagram {

	/**
	* convert a string to a frequency table
	* for example, if input is "weed", then the result should be
	* ["d": 1, "e": 2, "w": 1]
	* @param word a text string to input
	* @return a HashMap indexed by the alphabetic ASCII with value of its frequency
	*/
	static freqChar(word) {
		var freq = {};
		for(var i = 0; i < word.length; i++) {
			let ch = word.charAt(i);
			freq[ch] ? freq[ch] += 1 : freq[ch]=1;
		}
		return freq;
	}

	/** 
	* compare two words for a pair of anagram
	* @param word text to input
	* @param candidate another string to compare with
	* @return true for anagram. **Note**: a word cannot be the anagram itself
	*/
	static compare(word, candidate) {
		if (word == candidate) return false;
		let a = Anagram.freqChar(word);
		let b = Anagram.freqChar(candidate);
		let x = Object.keys(a).sort();
		let y = Object.keys(b).sort();
		let m = x.join('');
		let n = y.join('');
		if (m != n) return false;
		for(var i in x) {
			let j = x[i];
			if (a[j] != b[j]) return false;
		}
		return true;
	}

	/**
	* calculate the "weight" of a string, for faster comparison purpose
	* a "weight" is the ascii code sum of the input string
	* @param word the word input to calculate with
	* @return sum of the input word's ascii codes
	*/
	static weight(word) {
		var sum = 0;
		for(var i = 0; i < word.length; i++) {
			let ch = word.charCodeAt(i);
			sum += ch;
		}
		return sum;
	}

	/** 
	* append a word to the indexed storage
	* this is the key to speed up an anagram puzzle solution.
	* all words are grouped by size and weight,
	* for example, "dog" and "cow" both belong to a group of size 3,
	* but "horse" belongs to a group of size 5.
	* in each group, all words are again categorized by weight.
	* for example, "dog" is in group 3 and in weight list of
	* sum = "d" + "o" + "g" (ASCII code)
	* and "horse" is in group 5 but also in a weight list of
	* sum = "h" + "o" + "r" + "s" + "e"
	* @param word the word to append
	*/
	append(word) {
		let w = word.toLowerCase();
		let size = w.length;
		let weight = Anagram.weight(w);
		if (this.storage[size]) {
			var sameSize = this.storage[size];
			if (sameSize[weight]) {
				var sameWeight = sameSize[weight];
				sameWeight.push(w);
				sameSize[weight] = sameWeight;
			} else {
				sameSize[weight] = [w];
			}
			this.storage[size] = sameSize;
		} else {
			var sameSize = {};
			sameSize[weight] = [w];
			this.storage[size] = sameSize;
		}
	}

	/**
	* solve all the anagrams for a word
	* @param word a text to input
	* @return a set of string as the solution
	*/
	solve(word) {
		var result = [];
		let w = word.toLowerCase();
		let size = w.length;
		let weight = Anagram.weight(w);
		if (this.storage[size]) {
			let sameSize = this.storage[size];
			if (sameSize[weight]) {
				let sameWeight = sameSize[weight];
				for(var i in sameWeight) {
					let v = sameWeight[i];
					if (Anagram.compare(w, v)) {
		 				result.push(v)
					}
				}
			}
		}
		return result;
	}
	
	constructor(wordlist) {
		this.storage = {};	
		for(var i in wordlist) {
			this.append(wordlist[i]);
		}
	}
}

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

