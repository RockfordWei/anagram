//
//  anagram.cc
//  anagram
//
//  Created by Rocky Wei on 2018-03-29.
//  Copyright © 2018 Rocky Wei. All rights reserved.
//
#include "anagram.h"
namespace anagram {
	
using namespace std;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;

v8::Persistent<v8::Function> Anagram::constructor;
	
// an alphabetic frequency table
class Freq {
private:
  char data[26];
public:

  // initialize from a word
  Freq(const string word);

  // compare two frequency table, return true if equal
  bool operator == (const Freq &);
};

Freq::Freq(const string word) {
  memset(data, 0, 26);
  for(auto& ch: word) {
    if (ch >= 'a' && ch <= 'z') {
      data[ch - 'a']++;
    }
  }
}
bool Freq::operator == (const Freq & other) {
  return memcmp(this->data, other.data, 26) == 0;
}

std::vector<string> Anagram::solve(string& word) {
  std::transform(word.begin(), word.end(), word.begin(), ::tolower);
  auto freq = Freq(word);
  int size = (int)word.length();
  int weight = this->weight(word);
  std::vector<string> solution = {};
  auto same_size = storage.find(size);
  if (same_size == storage.end()) return solution;
  auto same_weight = same_size->second.find(weight);
  if (same_weight == same_size->second.end()) return solution;
  for(auto candidate: same_weight->second) {
    if (candidate == word) continue;
    auto f = Freq(candidate);
    if (f == freq) {
      solution.push_back(candidate);
    }
  }
  return solution;
}

Anagram::Anagram(string& text) {
  std::transform(text.begin(), text.end(), text.begin(), ::tolower);
  stringstream lines(text);
  string word;
  while(getline(lines, word, '\n')) {
    auto size = (int)word.length();
    auto weight = this->weight(word);
    auto same_size = storage.find(size);
    if (same_size == storage.end()) {
      std::vector<string> list = {};
      list.push_back(word);
      std::map<int, std::vector<string>> same_weight = {};
      same_weight[weight] = list;
      storage[size] = same_weight;
    } else {
      auto same_weight = same_size->second.find(weight);
      if (same_weight == same_size->second.end()) {
        std::vector<string> list = {};
        list.push_back(word);
        same_size->second[weight] = list;
      } else {
        same_weight->second.push_back(word);
      }
    }
  }
}
int Anagram::weight(const string word) {
  int sum = 0;
  for(auto c: word) {
    sum += (int)c;
  }
  return sum;
}

void Anagram::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "Anagram"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "solve", Solve);

  constructor.Reset(isolate, tpl->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "Anagram"),
               tpl->GetFunction());
}

void Anagram::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new Anagram(...)`
		v8::String::Utf8Value param1(args[0]->ToString());
		string text = std::string(*param1);
    Anagram* obj = new Anagram(text);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `Anagram(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Context> context = isolate->GetCurrentContext();
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}
	
void Anagram::Solve(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();

	Anagram* obj = ObjectWrap::Unwrap<Anagram>(args.Holder());
	v8::String::Utf8Value param1(args[0]->ToString());
	string word = std::string(*param1);
	auto solution = obj->solve(word);

	Local<v8::Array> list = v8::Array::New(isolate);
	for(int i = 0; i < (int)solution.size(); i++) {
		Local<v8::String> w = String::NewFromUtf8(isolate, solution[i].c_str());
		list->Set(i, w);
	}
  args.GetReturnValue().Set(list);
}

}//namespace anagram
