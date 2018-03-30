//
//  anagram.h
//  anagram
//
//  Created by Rocky Wei on 2018-03-29.
//  Copyright © 2018 Rocky Wei. All rights reserved.
//
#ifndef ANAGRAM_H
#define ANAGRAM_H
#include <algorithm>
#include <iostream>
#include <map>
#include <sstream>
#include <vector>
#include <node.h>
#include <node_object_wrap.h>

namespace anagram {

class Anagram : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  // a two layer tree, every word would be stored by its length and weight
  std::map<int, std::map<int, std::vector<std::string>>> storage;

  // calculate the ascii sum of each character in a word
  int weight(const std::string word);

  // initialize a solution class by giving a word list, each word in a line
  explicit Anagram(std::string& text);

  // solve the puzzle - return all anagrams except the word itself;
  std::vector<std::string> solve(std::string& word); 

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void Solve(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Persistent<v8::Function> constructor;
};

}  // namespace anagram

#endif
