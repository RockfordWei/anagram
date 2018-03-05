#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Anagram Solution Class in Python
# by Rockford Wei, March 5th, 2018

# This is a demo class for a high performance anagram solution in Python
class Anagram:    
    
    #an indexed word groups for the anagram solution, see [build()](#build)
    wordGroups = {}
    
    # convert a string to a frequency table
    # for example, if input is "weed", then the result should be
    # ["d": 1, "e": 2, "w": 1]
    # - parameter word: a text string to input
    # - returns: a dictionary indexed by the alphabetic ascii with value of its frequency
    @staticmethod
    def freqChar(word):
        freq = {}
        for letter in 'abcdefghijklmnopqrstuvwxyz':
            freq[letter] = 0
            
        for letter in word:
            freq[letter] += 1
            
        return freq
    
    # compare two words for a pair of anagram
    # - parameter a: text to input
    # - parameter b: another string to compare with
    # - returns: true for anagram. **Note**: a word cannot be the anagram itself
    @staticmethod
    def compare(a, b):
        if a == b: 
            return False
            
        x = Anagram.freqChar(a)
        y = Anagram.freqChar(b)
        result = x == y
        del x
        del y
        return result
    
    # calculate the "weight" of a string, for faster comparison purpose
    # a "weight" is the ascii code sum of the input string
    # - parameter word: the word input to calculate with
    # - returns: sum of the input word's ascii codes
    @staticmethod
    def weight(word): 
        sum = 0
        for letter in word:
            ascii = ord(letter)
            sum += ascii
            
        return sum
        
    # build an indexed word groups from a word list
    # this is the key to speed up an anagram puzzle solution.
    # all words are grouped by size and weight,
    # for example, "dog" and "cow" both belong to a group of size 3,
    # but "horse" belongs to a group of size 5.
    # in each group, all words are again categorized by weigh.
    # for example, "dog" is in group 3 and in weight list of
    # sum = "d" + "o" + "g" (ascii code)
    # and "horse" is in group 5 but also in a weight list of
    # sum = "h" + "o" + "r" + "s" + "e"
    # - parameter words: an array of word
    # - returns: a dictionary first indexed by the word size then second indexed by the word weight
    @staticmethod
    def build(words):
        storage = {}
        for word in words:
            w = word.lower()
            size = len(w)
            weight = Anagram.weight(w)
            if storage.has_key(size):
                same_sized = storage[size]
                if same_sized.has_key(weight):
                    same_weighted = same_sized[weight]
                    same_weighted.append(w)
                    same_sized[weight] = same_weighted
                    storage[size] = same_sized
                else:
                    same_sized[weight] = [w]
                    storage[size] = same_sized                    
            else:
                storage[size] = {weight: [w]}
            
        
        return storage
            
    # constructor of the anagram class
    # - parameter text: a text with each word in a separated line.
    def __init__(self, text):
        self.wordGroups = Anagram.build(text.split('\n'))
        
        
a = '''dog
eat
horse
cat
food
god
tea'''
b = Anagram(a)
print(b.wordGroups)