/*
Anagram Solution Class in JavaScript
by Rockford Wei, March 7th, 2018
*/
'use strict';
/**
 * This is a demo class for a high performance anagram solution in JavaScript
 * @author Rockford Wei
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
	* compare two frequency tables
	* @param a target to test
	* @param b candidate to test
	* @return true for anagram.
	*/
	static compare(a, b) {
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
		let f = Anagram.freqChar(w);
		if (this.storage[size]) {
			let sameSize = this.storage[size];
			if (sameSize[weight]) {
				let sameWeight = sameSize[weight];
				for(var i in sameWeight) {
					let u = sameWeight[i];
					if (w == u) continue;
					let v = Anagram.freqChar(u);
					if (Anagram.compare(f, v)) {
		 				result.push(u)
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
exports = module.exports = Anagram;
