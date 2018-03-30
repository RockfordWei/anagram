let Anagram = require("./index.js")
let anagram = new Anagram(['ate','tea', 'eat', 'god', 'good', 'dog']);

function test(input, expectation) {
	let result = JSON.stringify(anagram.solve(input))==JSON.stringify(expectation);
	console.log("look up", input, "expect", expectation, "result:", result);
	return result; 
}

let a = test('tea', ['ate', 'eat']);
let b = test('dog', ['god']);

if (a && b) {
	console.log("All Tests Passed");
} else {
	console.log("Failure");
}