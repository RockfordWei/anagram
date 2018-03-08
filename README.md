# Anagram Solution Server in Different Languages/Frameworks

- [Swift (Powered by Perfect)](Swift/)
- [Python](Python/)
- [PHP](PHP/)
- [Java](Java/)
- [JavaScript (Powered by NodeJS)](JavaScript/)

# Algorithm

All standalone servers are using the same workflow: 

1. Download a word list, i.e., words separated by line.
2. Turn the list into groups by size. For example, `['eat', 'god']` are in the same size of 3 but `['wood', 'fine']` are in group of size 4.
3. In each group, split the group into hash tables by "word sum". The sum means to add all letter ascii code in a word. For example, `sum("bad")` will be `(b = 98) + (a = 97) + (d = 100) => 295`. 
4. Once these two simple hash indexes were built, the solution would be very easy, which is just pick up the same-size-same-sum word list, and perform a for-loop to compare the frequency tables to figure out the matches.
5. Start an http server to provide a solution JSON api. For example, `$ curl http://localhost:8181/?anagram=eat` should return `["tea","ate","eta"]` if nothing wrong.

## Why?

Such an algorithm is applying a balance between memory and cpu. 

Firstly, two integer indices are light enough and can scope down the search quickly enough.

Secondly, the final frequency table match is only happening in a very narrow scope.

Last but not the least, frequency tables are calculated intermediately in the solution so it would never accumulate or waste too much cpu or memory.

# Acknowledgement

All above servers are using a word list from [https://github.com/first20hours/google-10000-english](https://github.com/first20hours/google-10000-english)

# More Info

Please visit [Perfect](https://github.com/PerfectlySoft) for more information, if using Swift.

