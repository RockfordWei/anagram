/*
 Anagram Solution Class in Swift
 by Rockford Wei, March 5th, 2018
 */
import Foundation

/// This is a demo class for a high performance anagram solution in Swift
public class Anagram {

  public enum Exception: Error {
    case notAnEnglishWord
  }
  /// convert a string to a frequency table
  /// for example, if input is "weed", then the result should be
  /// ["d": 1, "e": 2, "w": 1]
  /// - parameter word: a text string to input
  /// - returns: a dictionary indexed by the alphabetic ascii with value of its frequency
  public static func freqChar(word: String) -> [UInt8: Int] {

    // prepare an empty frequency table
    var freq: [UInt8: Int] = [:]

    // map the word characters into an ascii code array
    let characters:[UInt8] = word.utf8.map { $0 }

    // build the frequency by each character
    for c in characters {
      if let f = freq[c] {
        freq[c] = f + 1
      } else {
        freq[c] = 1
      }
    }
    return freq
  }

  /// compare two words for a pair of anagram
  /// - parameter word: text to input
  /// - parameter with: another string to compare with
  /// - returns: true for anagram. **Note**: a word cannot be the anagram itself
  public static func compare(word: String, with: String) -> Bool {

    // a word cannot be the anagram itself
    if word == with {
      return false
    }
    // get the frequency tables for the both word
    let a = freqChar(word: word)
    let b = freqChar(word: with)

    // at least both word should have the same character set in general
    guard a.keys == b.keys else {
      return false
    }

    // compare the frequency for each character
    for i in a.keys {
      guard a[i] == b[i] else {
        return false
      }
    }
    return true
  }

  /// solve all the anagrams for a word
  /// - parameter word: a text to input
  /// - returns: a set of string as the solution
  /// - throws: will yield an error if the word is not a valid English word
  public func solve(word: String) throws -> Set<String> {
    let low = word.lowercased()
    let w = Anagram.weight(word: low)
    guard let sameSized = self.wordGroups[low.count],
      let list = sameSized[w],
      list.contains(low) else {
        throw Exception.notAnEnglishWord
    }
    var result: Set<String> = []
    for candidate in list {
      if Anagram.compare(word: low, with: candidate) {
        result.insert(candidate)
      }
    }
    return result
  }

  /// calculate the "weight" of a string, for faster comparison purpose
  /// a "weight" is the ascii code sum of the input string
  /// - parameter word: the word input to calculate with
  /// - returns: sum of the input word's ascii codes
  public static func weight(word: String) -> Int {
    let characters:[Int] = word.utf8.map { Int($0) }
    return characters.reduce(0) { $0 + $1 }
  }

  /// build an indexed word groups from a word list
  /// this is the key to speed up an anagram puzzle solution.
  /// all words are grouped by size and weight,
  /// for example, "dog" and "cow" both belong to a group of size 3,
  /// but "horse" belongs to a group of size 5.
  /// in each group, all words are again categorized by weigh.
  /// for example, "dog" is in group 3 and in weight list of
  /// sum = "d" + "o" + "g" (ascii code)
  /// and "horse" is in group 5 but also in a weight list of
  /// sum = "h" + "o" + "r" + "s" + "e"
  /// - parameter words: an array of word
  /// - returns: a dictionary first indexed by the word size then second indexed by the word weight
  public static func buildIndex(from: [String]) -> [Int:[Int: Set<String>]] {
    var storage: [Int: [Int: Set<String>]] = [:]
    for word in from {
      let w = word.lowercased()
      let size = w.count
      let weight = Anagram.weight(word: w)
      if var sameSized = storage[size] {
        if var sameWeight = sameSized[weight] {
          sameWeight.insert(w)
          sameSized[weight] = sameWeight
        } else {
          let list: Set<String> = [w]
          sameSized[weight] = list
        }
        storage[size] = sameSized
      } else {
        let list: Set<String> = [w]
        let sameWeight: [Int: Set<String>] = [weight: list]
        storage[size] = sameWeight
      }
    }
    return storage
  }

  /// an indexed word groups for the anagram solution, see [buildIndex()](#buildIndex)
  private let wordGroups: [Int: [Int: Set<String>]]

  /// constructor of the anagram class
  /// - parameter dictionary: a text with each word in a separated line.
  public init (dictionary: String) {
    let lines:[String] = dictionary.split(separator: "\n").map(String.init)
    wordGroups = Anagram.buildIndex(from: lines)
  }
}
