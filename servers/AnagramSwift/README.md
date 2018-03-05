# AnagramSwift

A Swift Server Demo for a High Performance Anagram Solution

# Build & Run

If Swift 4.0+ has installed on your computer, `swift run` in the project directory can immediately start an anagram solution server on port 8181.

If using docker:

```
docker run -it -v $PWD:/home -w /home -p 8181:8181 rockywei/swift:4.0 /bin/bash -c "swift run"
```

# Test


```
$ curl http://localhost:8181/?anagram=eat
{"solution":["eta","tea","ate"],"error":""}
```