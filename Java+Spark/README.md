# Anagram Java+Spark

A Java Server Demo for a High Performance Anagram Solution, powered by Spark.

# Build & Run

Assuming:

- hadoop is running and there is a word list file on `hdfs://localhost:9000/input/20k.txt`.
- Java 8 with Maven installed properly.

```
$ mvn clean install
$ mvn "-Dexec.args=-classpath %classpath com.cologmag.anagram.Anagram" -Dexec.executable=java org.codehaus.mojo:exec-maven-plugin:1.2.1:exec
```

Then it should immediately start an anagram solution server on port 8181.

# Test


```
$ curl http://localhost:8181/?anagram=eat
["eta","tea","ate"]
```
