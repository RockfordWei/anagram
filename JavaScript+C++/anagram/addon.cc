//
//  addon.cc
//  anagram
//
//  Created by Rockford Wei on 2018-03-29.
//  Copyright © 2018 Rockford Wei. All rights reserved.
//
#include <node.h>
#include "anagram.h"

namespace anagram {

using v8::Local;
using v8::Object;

void InitObj(Local<Object> exports) {
  Anagram::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitObj)

}  // namespace anagram