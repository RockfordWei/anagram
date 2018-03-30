# Anagram NodeJS with C++ Add on

A NodeJS Server with C++ Add on Demo for a High Performance Anagram Solution

# Build 

This repo requires NodeJS 8+

```
$ pushd .
$ cd anagram
$ npm install -g node-gyp
$ node-gyp configure
$ node-gyp build
$ popd
```

# Run

If NodeJS 8+ has installed on your computer, `node anagram.js` in the project directory can immediately start an anagram solution server on port 8181.

# Test


```
$ curl http://localhost:8181/?anagram=eat
["eta","tea","ate"]
```
