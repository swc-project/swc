(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[390],{

/***/ 9996:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);} //= =======================================================================================
// Globals
//= =======================================================================================
var _require = __webpack_require__(1876),Buffer = _require.Buffer;
var vm = __webpack_require__(22);

var Context = (__webpack_require__(2961)/* .Context */ ._);
var Long = __webpack_require__(3720);

if (typeof window !== "undefined") window.Buffer = Buffer;
if (typeof self !== "undefined") self.Buffer = Buffer; // this is for webworker, and also is not an elseif to avoid window polyfills in webworker

var PRIMITIVE_TYPES = {
  UInt8: 1,
  UInt16LE: 2,
  UInt16BE: 2,
  UInt32LE: 4,
  UInt32BE: 4,
  Int8: 1,
  Int16LE: 2,
  Int16BE: 2,
  Int32LE: 4,
  Int32BE: 4,
  FloatLE: 4,
  FloatBE: 4,
  DoubleLE: 8,
  DoubleBE: 8,
  UInt64: 8,
  Int64: 8 };


var SPECIAL_TYPES = {
  String: null,
  Buffer: null,
  Array: null,
  Skip: null,
  Choice: null,
  Nest: null,
  Bit: null,
  Itf8: null,
  Ltf8: null };


var aliasRegistry = {};
var FUNCTION_PREFIX = "___parser_";

var BIT_RANGE = [];
(function () {
  var i;
  for (i = 1; i <= 32; i++) {
    BIT_RANGE.push(i);
  }
})();

// Converts Parser's method names to internal type names
var NAME_MAP = {};
Object.keys(PRIMITIVE_TYPES).
concat(Object.keys(SPECIAL_TYPES)).
forEach(function (type) {
  NAME_MAP[type.toLowerCase()] = type;
});

//= =======================================================================================
// class Parser
//= =======================================================================================

//----------------------------------------------------------------------------------------
// constructor
//----------------------------------------------------------------------------------------

var Parser = function Parser() {
  this.varName = "";
  this.type = "";
  this.options = {};
  this.next = null;
  this.head = null;
  this.compiled = null;
  this.endian = "le";
  this.constructorFn = null;
  this.alias = null;
};

//----------------------------------------------------------------------------------------
// public methods
//----------------------------------------------------------------------------------------

Parser.start = function () {
  return new Parser();
};

Object.keys(PRIMITIVE_TYPES).forEach(function (type) {
  Parser.prototype[type.toLowerCase()] = function (varName, options) {
    return this.setNextParser(type.toLowerCase(), varName, options);
  };

  var typeWithoutEndian = type.replace(/BE|LE/, "").toLowerCase();
  if (!(typeWithoutEndian in Parser.prototype)) {
    Parser.prototype[typeWithoutEndian] = function (varName, options) {
      return this[typeWithoutEndian + this.endian](varName, options);
    };
  }
});

BIT_RANGE.forEach(function (i) {
  Parser.prototype["bit".concat(i.toString())] = function (varName, options) {
    if (!options) {
      options = {};
    }
    options.length = i;
    return this.setNextParser("bit", varName, options);
  };
});

Parser.prototype.namely = function (alias) {
  aliasRegistry[alias] = this;
  this.alias = alias;
  return this;
};

Parser.prototype.skip = function (length, options) {
  if (options && options.assert) {
    throw new Error("assert option on skip is not allowed.");
  }

  return this.setNextParser("skip", "", { length: length });
};

Parser.prototype.string = function (varName, options) {
  if (!options.zeroTerminated && !options.length && !options.greedy) {
    throw new Error(
    "Neither length, zeroTerminated, nor greedy is defined for string.");

  }
  if ((options.zeroTerminated || options.length) && options.greedy) {
    throw new Error(
    "greedy is mutually exclusive with length and zeroTerminated for string.");

  }
  if (options.stripNull && !(options.length || options.greedy)) {
    throw new Error(
    "Length or greedy must be defined if stripNull is defined.");

  }
  options.encoding = options.encoding || "utf8";

  return this.setNextParser("string", varName, options);
};

Parser.prototype.buffer = function (varName, options) {
  if (!options.length && !options.readUntil) {
    throw new Error("Length nor readUntil is defined in buffer parser");
  }

  return this.setNextParser("buffer", varName, options);
};

Parser.prototype.array = function (varName, options) {
  if (!options.readUntil && !options.length && !options.lengthInBytes) {
    throw new Error("Length option of array is not defined.");
  }
  if (!options.type) {
    throw new Error("Type option of array is not defined.");
  }
  if (
  typeof options.type === "string" &&
  !aliasRegistry[options.type] &&
  Object.keys(PRIMITIVE_TYPES).indexOf(NAME_MAP[options.type]) < 0)
  {
    throw new Error("Specified primitive type \"".concat(
    options.type, "\" is not supported."));

  }

  return this.setNextParser("array", varName, options);
};

Parser.prototype.choice = function (varName, options) {
  if (arguments.length === 1 && _typeof(varName) === "object") {
    options = varName;
    varName = null;
  }

  if (!options.tag) {
    throw new Error("Tag option of array is not defined.");
  }
  if (!options.choices) {
    throw new Error("Choices option of array is not defined.");
  }

  Object.keys(options.choices).forEach(function (key) {
    // if (isNaN(parseInt(key, 10))) {
    //   throw new Error("Key of choices must be a number.");
    // }
    if (!options.choices[key]) {
      throw new Error("Choice Case ".concat(key, " of ").concat(varName, " is not valid."));
    }

    if (
    typeof options.choices[key] === "string" &&
    !aliasRegistry[options.choices[key]] &&
    Object.keys(PRIMITIVE_TYPES).indexOf(NAME_MAP[options.choices[key]]) < 0)
    {
      throw new Error("Specified primitive type \"".concat(
      options.choices[key], "\" is not supported."));

    }
  }, this);

  return this.setNextParser("choice", varName, options);
};

Parser.prototype.nest = function (varName, options) {
  if (arguments.length === 1 && _typeof(varName) === "object") {
    options = varName;
    varName = null;
  }

  if (!options.type) {
    throw new Error("Type option of nest is not defined.");
  }
  if (!(options.type instanceof Parser) && !aliasRegistry[options.type]) {
    throw new Error("Type option of nest must be a Parser object.");
  }
  if (!(options.type instanceof Parser) && !varName) {
    throw new Error(
    "options.type must be a object if variable name is omitted.");

  }

  return this.setNextParser("nest", varName, options);
};

Parser.prototype.endianess = function (endianess) {
  switch (endianess.toLowerCase()) {
    case "little":
      this.endian = "le";
      break;
    case "big":
      this.endian = "be";
      break;
    default:
      throw new Error("Invalid endianess: ".concat(endianess));}


  return this;
};

Parser.prototype.create = function (constructorFn) {
  if (!(constructorFn instanceof Function)) {
    throw new Error("Constructor must be a Function object.");
  }

  this.constructorFn = constructorFn;

  return this;
};

Parser.prototype.getCode = function () {
  var ctx = new Context();

  ctx.pushCode("if (!Buffer.isBuffer(buffer)) {");
  ctx.generateError('"argument buffer is not a Buffer object"');
  ctx.pushCode("}");

  if (!this.alias) {
    this.addRawCode(ctx);
  } else {
    this.addAliasedCode(ctx);
  }

  if (this.alias) {
    ctx.pushCode("return {0}(0)", FUNCTION_PREFIX + this.alias);
  } else {
    ctx.pushCode("return { offset: offset, result: vars };");
  }

  return ctx.code;
};

Parser.prototype.addRawCode = function (ctx) {
  ctx.pushCode("var offset = 0;");

  if (this.constructorFn) {
    ctx.pushCode("var vars = new constructorFn();");
  } else {
    ctx.pushCode("var vars = {};");
  }

  this.generate(ctx);

  this.resolveReferences(ctx);

  ctx.pushCode("return { offset: offset, result: vars };");
};

Parser.prototype.addAliasedCode = function (ctx) {
  ctx.pushCode("function {0}(offset) {", FUNCTION_PREFIX + this.alias);

  if (this.constructorFn) {
    ctx.pushCode("var vars = new constructorFn();");
  } else {
    ctx.pushCode("var vars = {};");
  }

  this.generate(ctx);

  ctx.markResolved(this.alias);
  this.resolveReferences(ctx);

  ctx.pushCode("return { offset: offset, result: vars };");
  ctx.pushCode("}");

  return ctx;
};

Parser.prototype.resolveReferences = function (ctx) {
  var references = ctx.getUnresolvedReferences();
  ctx.markRequested(references);
  references.forEach(function (alias) {
    var parser = aliasRegistry[alias];
    parser.addAliasedCode(ctx);
  });
};

Parser.prototype.compile = function () {
  var src = "(function(buffer, constructorFn, Long) { ".concat(this.getCode(), " })");
  this.compiled = vm.runInThisContext(src);
};

Parser.prototype.sizeOf = function () {
  var size = NaN;

  if (Object.keys(PRIMITIVE_TYPES).indexOf(this.type) >= 0) {
    size = PRIMITIVE_TYPES[this.type];

    // if this is a fixed length string
  } else if (
  this.type === "String" &&
  typeof this.options.length === "number")
  {
    size = this.options.length;

    // if this is a fixed length buffer
  } else if (
  this.type === "Buffer" &&
  typeof this.options.length === "number")
  {
    size = this.options.length;

    // if this is a fixed length array
  } else if (this.type === "Array" && typeof this.options.length === "number") {
    var elementSize = NaN;
    if (typeof this.options.type === "string") {
      elementSize = PRIMITIVE_TYPES[NAME_MAP[this.options.type]];
    } else if (this.options.type instanceof Parser) {
      elementSize = this.options.type.sizeOf();
    }
    size = this.options.length * elementSize;

    // if this a skip
  } else if (this.type === "Skip") {
    size = this.options.length;

    // if this is a nested parser
  } else if (this.type === "Nest") {
    size = this.options.type.sizeOf();
  } else if (!this.type) {
    size = 0;
  }

  if (this.next) {
    size += this.next.sizeOf();
  }

  return size;
};

// Follow the parser chain till the root and start parsing from there
Parser.prototype.parse = function (buffer) {
  if (!this.compiled) {
    this.compile();
  }

  return this.compiled(buffer, this.constructorFn, Long);
};

//----------------------------------------------------------------------------------------
// private methods
//----------------------------------------------------------------------------------------

Parser.prototype.setNextParser = function (type, varName, options) {
  var parser = new Parser();

  parser.type = NAME_MAP[type];
  parser.varName = varName;
  parser.options = options || parser.options;
  parser.endian = this.endian;

  if (this.head) {
    this.head.next = parser;
  } else {
    this.next = parser;
  }
  this.head = parser;

  return this;
};

// Call code generator for this parser
Parser.prototype.generate = function (ctx) {
  if (this.type) {
    this["generate".concat(this.type)](ctx);
    this.generateAssert(ctx);
  }

  var varName = ctx.generateVariable(this.varName);
  if (this.options.formatter) {
    this.generateFormatter(ctx, varName, this.options.formatter);
  }

  return this.generateNext(ctx);
};

Parser.prototype.generateAssert = function (ctx) {
  if (!this.options.assert) {
    return;
  }

  var varName = ctx.generateVariable(this.varName);

  switch (_typeof(this.options.assert)) {
    case "function":
      ctx.pushCode(
      "if (!({0}).call(vars, {1})) {",
      this.options.assert,
      varName);

      break;
    case "number":
      ctx.pushCode("if ({0} !== {1}) {", this.options.assert, varName);
      break;
    case "string":
      ctx.pushCode('if ("{0}" !== {1}) {', this.options.assert, varName);
      break;
    default:
      throw new Error(
      "Assert option supports only strings, numbers and assert functions.");}


  ctx.generateError('"Assert error: {0} is " + {0}', varName);
  ctx.pushCode("}");
};

// Recursively call code generators and append results
Parser.prototype.generateNext = function (ctx) {
  if (this.next) {
    ctx = this.next.generate(ctx);
  }

  return ctx;
};

Object.keys(PRIMITIVE_TYPES).forEach(function (type) {
  Parser.prototype["generate".concat(type)] = function (ctx) {
    if (type === "UInt64") {
      ctx.pushCode(
      "{0} = Long.fromBytes(buffer.slice(offset,offset+8), true, this.endian === 'le').toNumber();",
      ctx.generateVariable(this.varName),
      type);

    } else if (type === "Int64") {
      ctx.pushCode(
      "{0} = Long.fromBytes(buffer.slice(offset,offset+8), false, this.endian === 'le').toNumber();",
      ctx.generateVariable(this.varName),
      type);

    } else {
      ctx.pushCode(
      "{0} = buffer.read{1}(offset);",
      ctx.generateVariable(this.varName),
      type);

    }
    ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[type]);
  };
});

Parser.prototype.generateBit = function (ctx) {
  // TODO find better method to handle nested bit fields
  var parser = JSON.parse(JSON.stringify(this));
  parser.varName = ctx.generateVariable(parser.varName);
  ctx.bitFields.push(parser);

  if (
  !this.next ||
  this.next && ["Bit", "Nest"].indexOf(this.next.type) < 0)
  {
    var sum = 0;
    ctx.bitFields.forEach(function (p) {
      sum += p.options.length;
    });

    var val = ctx.generateTmpVariable();

    if (sum <= 8) {
      ctx.pushCode("var {0} = buffer.readUInt8(offset);", val);
      sum = 8;
    } else if (sum <= 16) {
      ctx.pushCode("var {0} = buffer.readUInt16BE(offset);", val);
      sum = 16;
    } else if (sum <= 24) {
      var val1 = ctx.generateTmpVariable();
      var val2 = ctx.generateTmpVariable();
      ctx.pushCode("var {0} = buffer.readUInt16BE(offset);", val1);
      ctx.pushCode("var {0} = buffer.readUInt8(offset + 2);", val2);
      ctx.pushCode("var {2} = ({0} << 8) | {1};", val1, val2, val);
      sum = 24;
    } else if (sum <= 32) {
      ctx.pushCode("var {0} = buffer.readUInt32BE(offset);", val);
      sum = 32;
    } else {
      throw new Error(
      "Currently, bit field sequence longer than 4-bytes is not supported.");

    }
    ctx.pushCode("offset += {0};", sum / 8);

    var bitOffset = 0;
    var isBigEndian = this.endian === "be";
    ctx.bitFields.forEach(function (p) {
      ctx.pushCode(
      "{0} = {1} >> {2} & {3};",
      p.varName,
      val,
      isBigEndian ? sum - bitOffset - p.options.length : bitOffset,
      (1 << p.options.length) - 1);

      bitOffset += p.options.length;
    });

    ctx.bitFields = [];
  }
};

Parser.prototype.generateSkip = function (ctx) {
  var length = ctx.generateOption(this.options.length);
  ctx.pushCode("offset += {0};", length);
};

Parser.prototype.generateString = function (ctx) {
  var name = ctx.generateVariable(this.varName);
  var start = ctx.generateTmpVariable();

  if (this.options.length && this.options.zeroTerminated) {
    ctx.pushCode("var {0} = offset;", start);
    ctx.pushCode(
    "while(buffer.readUInt8(offset++) !== 0 && offset - {0}  < {1});",
    start,
    this.options.length);

    ctx.pushCode(
    "{0} = buffer.toString('{1}', {2}, offset - {2} < {3} ? offset - 1 : offset);",
    name,
    this.options.encoding,
    start,
    this.options.length);

  } else if (this.options.length) {
    ctx.pushCode(
    "{0} = buffer.toString('{1}', offset, offset + {2});",
    name,
    this.options.encoding,
    ctx.generateOption(this.options.length));

    ctx.pushCode("offset += {0};", ctx.generateOption(this.options.length));
  } else if (this.options.zeroTerminated) {
    ctx.pushCode("var {0} = offset;", start);
    ctx.pushCode("while(buffer.readUInt8(offset++) !== 0);");
    ctx.pushCode(
    "{0} = buffer.toString('{1}', {2}, offset - 1);",
    name,
    this.options.encoding,
    start);

  } else if (this.options.greedy) {
    ctx.pushCode("var {0} = offset;", start);
    ctx.pushCode("while(buffer.length > offset++);");
    ctx.pushCode(
    "{0} = buffer.toString('{1}', {2}, offset);",
    name,
    this.options.encoding,
    start);

  }
  if (this.options.stripNull) {
    ctx.pushCode("{0} = {0}.replace(/\\x00+$/g, '')", name);
  }
};

Parser.prototype.generateBuffer = function (ctx) {
  if (this.options.readUntil === "eof") {
    ctx.pushCode(
    "{0} = buffer.slice(offset);",
    ctx.generateVariable(this.varName));

  } else {
    ctx.pushCode(
    "{0} = buffer.slice(offset, offset + {1});",
    ctx.generateVariable(this.varName),
    ctx.generateOption(this.options.length));

    ctx.pushCode("offset += {0};", ctx.generateOption(this.options.length));
  }

  if (this.options.clone) {
    ctx.pushCode("{0} = Buffer.from({0});", ctx.generateVariable(this.varName));
  }
};

Parser.prototype.generateArray = function (ctx) {
  var length = ctx.generateOption(this.options.length);
  var lengthInBytes = ctx.generateOption(this.options.lengthInBytes);
  var type = this.options.type;
  var counter = ctx.generateTmpVariable();
  var lhs = ctx.generateVariable(this.varName);
  var item = ctx.generateTmpVariable();
  var key = this.options.key;
  var isHash = typeof key === "string";

  if (isHash) {
    ctx.pushCode("{0} = {};", lhs);
  } else {
    ctx.pushCode("{0} = [];", lhs);
  }
  if (typeof this.options.readUntil === "function") {
    ctx.pushCode("do {");
  } else if (this.options.readUntil === "eof") {
    ctx.pushCode("for (var {0} = 0; offset < buffer.length; {0}++) {", counter);
  } else if (lengthInBytes !== undefined) {
    ctx.pushCode(
    "for (var {0} = offset; offset - {0} < {1}; ) {",
    counter,
    lengthInBytes);

  } else {
    ctx.pushCode("for (var {0} = 0; {0} < {1}; {0}++) {", counter, length);
  }

  if (typeof type === "string") {
    if (!aliasRegistry[type]) {
      ctx.pushCode("var {0} = buffer.read{1}(offset);", item, NAME_MAP[type]);
      ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[NAME_MAP[type]]);
    } else {
      var tempVar = ctx.generateTmpVariable();
      ctx.pushCode("var {0} = {1}(offset);", tempVar, FUNCTION_PREFIX + type);
      ctx.pushCode("var {0} = {1}.result; offset = {1}.offset;", item, tempVar);
      if (type !== this.alias) ctx.addReference(type);
    }
  } else if (type instanceof Parser) {
    ctx.pushCode("var {0} = {};", item);

    ctx.pushScope(item);
    type.generate(ctx);
    ctx.popScope();
  }

  if (isHash) {
    ctx.pushCode("{0}[{2}.{1}] = {2};", lhs, key, item);
  } else {
    ctx.pushCode("{0}.push({1});", lhs, item);
  }

  ctx.pushCode("}");

  if (typeof this.options.readUntil === "function") {
    ctx.pushCode(
    " while (!({0}).call(this, {1}, buffer.slice(offset)));",
    this.options.readUntil,
    item);

  }
};

Parser.prototype.generateChoiceCase = function (ctx, varName, type) {
  if (typeof type === "string") {
    if (!aliasRegistry[type]) {
      ctx.pushCode(
      "{0} = buffer.read{1}(offset);",
      ctx.generateVariable(this.varName),
      NAME_MAP[type]);

      ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[NAME_MAP[type]]);
    } else {
      var tempVar = ctx.generateTmpVariable();
      ctx.pushCode("var {0} = {1}(offset);", tempVar, FUNCTION_PREFIX + type);
      ctx.pushCode(
      "{0} = {1}.result; offset = {1}.offset;",
      ctx.generateVariable(this.varName),
      tempVar);

      if (type !== this.alias) ctx.addReference(type);
    }
  } else if (type instanceof Parser) {
    ctx.pushPath(varName);
    type.generate(ctx);
    ctx.popPath(varName);
  }
};

Parser.prototype.generateChoice = function (ctx) {
  var tag = ctx.generateOption(this.options.tag);
  if (this.varName) {
    ctx.pushCode("{0} = {};", ctx.generateVariable(this.varName));
  }
  ctx.pushCode("switch({0}) {", tag);
  Object.keys(this.options.choices).forEach(function (t) {
    var type = this.options.choices[t];
    if (Number.isNaN(parseInt(t, 10))) {
      ctx.pushCode("case '{0}':", t);
    } else {
      ctx.pushCode("case {0}:", t);
    }
    this.generateChoiceCase(ctx, this.varName, type);
    ctx.pushCode("break;");
  }, this);
  ctx.pushCode("default:");
  if (this.options.defaultChoice) {
    this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice);
  } else {
    ctx.generateError('"Met undefined tag value " + {0} + " at choice"', tag);
  }
  ctx.pushCode("}");
};

Parser.prototype.generateNest = function (ctx) {
  var nestVar = ctx.generateVariable(this.varName);

  if (this.options.type instanceof Parser) {
    if (this.varName) {
      ctx.pushCode("{0} = {};", nestVar);
    }
    ctx.pushPath(this.varName);
    this.options.type.generate(ctx);
    ctx.popPath(this.varName);
  } else if (aliasRegistry[this.options.type]) {
    var tempVar = ctx.generateTmpVariable();
    ctx.pushCode(
    "var {0} = {1}(offset);",
    tempVar,
    FUNCTION_PREFIX + this.options.type);

    ctx.pushCode("{0} = {1}.result; offset = {1}.offset;", nestVar, tempVar);
    if (this.options.type !== this.alias) ctx.addReference(this.options.type);
  }
};

Parser.prototype.generateFormatter = function (ctx, varName, formatter) {
  if (typeof formatter === "function") {
    ctx.pushCode("{0} = ({1}).call(this, {0});", varName, formatter);
  }
};

Parser.prototype.isInteger = function () {
  return !!this.type.match(/U?Int[8|16|32][BE|LE]?|Bit\d+/);
};

// /////////////////// CRAM-specific types //////////////////////////
//
Parser.prototype.itf8 = function (varName, options) {
  return this.setNextParser("itf8", varName, options);
};
Parser.prototype.itf8 = function (varName, options) {
  return this.setNextParser("itf8", varName, options);
};

Parser.prototype.generateItf8 = function (ctx) {
  var name = ctx.generateVariable(this.varName);
  var countFlags = ctx.generateTmpVariable();
  ctx.pushCode("\n    var ".concat(
  countFlags, " = buffer[offset];\n    if (").concat(
  countFlags, " < 0x80) {\n      ").concat(
  name, " = ").concat(countFlags, ";\n      offset += 1;\n    } else if (").concat(

  countFlags, " < 0xc0) {\n      ").concat(
  name, " = ((").concat(countFlags, "<<8) | buffer[offset+1]) & 0x3fff;\n      offset += 2;\n    } else if (").concat(

  countFlags, " < 0xe0) {\n      ").concat(
  name, " = ((").concat(countFlags, "<<16) | (buffer[offset+1]<< 8) |  buffer[offset+2]) & 0x1fffff;\n      offset += 3;\n    } else if (").concat(

  countFlags, " < 0xf0) {\n      ").concat(
  name, " = ((").concat(countFlags, "<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;\n      offset += 4\n    } else {\n      ").concat(


  name, " = ((").concat(countFlags, " & 0x0f)<<28) | (buffer[offset+1]<<20) | (buffer[offset+2]<<12) | (buffer[offset+3]<<4) | (buffer[offset+4] & 0x0f);\n      // x=((0xff & 0x0f)<<28) | (0xff<<20) | (0xff<<12) | (0xff<<4) | (0x0f & 0x0f);\n      // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;\n      offset += 5\n    }\n  "));





};

Parser.prototype.ltf8 = function (varName, options) {
  return this.setNextParser("ltf8", varName, options);
};

Parser.prototype.generateLtf8 = function (ctx) {
  var name = ctx.generateVariable(this.varName);
  var countFlags = ctx.generateTmpVariable();
  ctx.pushCode("\n  var ".concat(
  countFlags, " = buffer[offset];\n  if (").concat(
  countFlags, " < 0x80) {\n    ").concat(
  name, " = ").concat(countFlags, ";\n    offset += 1;\n  } else if (").concat(

  countFlags, " < 0xc0) {\n    ").concat(
  name, " = ((buffer[offset]<<8) | buffer[offset+1]) & 0x3fff;\n    offset += 2;\n  } else if (").concat(

  countFlags, " < 0xe0) {\n    ").concat(
  name, " = ((buffer[offset]<<16) | (buffer[offset+1]<<8) | buffer[offset+2]) & 0x1fffff;\n    ").concat(
  name, " = (((").concat(countFlags, " & 63) << 16) | buffer.readUInt16LE(offset + 1));\n    offset += 3;\n  } else if (").concat(

  countFlags, " < 0xf0) {\n    ").concat(
  name, " = ((buffer[offset]<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;\n    offset += 4;\n  } else if (").concat(

  countFlags, " < 0xf8) {\n    ").concat(
  name, " = (((buffer[offset] & 15) * Math.pow(2,32))) +\n      (buffer[offset+1]<<24) | (buffer[offset+2]<<16 | buffer[offset+3]<<8 | buffer[offset+4])\n    // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;\n    offset += 5;\n  } else if (").concat(



  countFlags, " < 0xfc) {\n    ").concat(
  name, " = ((((buffer[offset] & 7) << 8) | buffer[offset+1] )) * Math.pow(2,32) +\n      (buffer[offset+2]<<24) | (buffer[offset+3]<<16 | buffer[offset+4]<<8 | buffer[offset+5])\n    offset += 6;\n  } else if (").concat(


  countFlags, " < 0xfe) {\n    ").concat(
  name, " = ((((buffer[offset] & 3) << 16) | buffer[offset+1]<<8 | buffer[offset+2])) * Math.pow(2,32) +\n      (buffer[offset+3]<<24) | (buffer[offset+4]<<16 | buffer[offset+5]<<8 | buffer[offset+6])\n    offset += 7;\n  } else if (").concat(


  countFlags, " < 0xff) {\n    ").concat(
  name, " = Long.fromBytesBE(buffer.slice(offset+1,offset+8));\n    if (").concat(
  name, ".greaterThan(Number.MAX_SAFE_INTEGER) || ").concat(name, ".lessThan(Number.MIN_SAFE_INTEGER))\n      throw new Error('integer overflow')\n    ").concat(

  name, " = ").concat(name, ".toNumber()\n    offset += 8;\n  } else {\n    ").concat(


  name, " = Long.fromBytesBE(buffer.slice(offset+1,offset+9));\n    if (").concat(
  name, ".greaterThan(Number.MAX_SAFE_INTEGER) || ").concat(name, ".lessThan(Number.MIN_SAFE_INTEGER))\n      throw new Error('integer overflow')\n    ").concat(

  name, " = ").concat(name, ".toNumber()\n    offset += 9;\n  }\n  "));



};

//= =======================================================================================
// Exports
//= =======================================================================================

exports._ = Parser;

/***/ }),

/***/ 2961:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);} //= =======================================================================================
// class Context
//= =======================================================================================

//----------------------------------------------------------------------------------------
// constructor
//----------------------------------------------------------------------------------------

var Context = function Context() {
  this.code = "";
  this.scopes = [["vars"]];
  this.isAsync = false;
  this.bitFields = [];
  this.tmpVariableCount = 0;
  this.references = {};
};

//----------------------------------------------------------------------------------------
// public methods
//----------------------------------------------------------------------------------------

Context.prototype.generateVariable = function (name) {
  var arr = [];

  Array.prototype.push.apply(arr, this.scopes[this.scopes.length - 1]);

  // $parent. prefixes allow sub-parsers to access values of their parent parsers
  while (/^\$parent\./.test(name)) {
    arr.pop();
    name = name.replace(/^\$parent\./, "");
  }

  if (name) {
    arr.push(name);
  }

  return arr.join(".");
};

Context.prototype.generateOption = function (val) {
  switch (_typeof(val)) {
    case "number":
      return val.toString();
    case "string":
      return this.generateVariable(val);
    case "function":
      return "(".concat(val, ").call(").concat(this.generateVariable(), ", vars)");
    default:
      return undefined;}

};

Context.prototype.generateError = function () {
  var args = Array.prototype.slice.call(arguments);
  var err = Context.interpolate.apply(this, args);

  if (this.isAsync) {
    this.pushCode("return process.nextTick(function() { callback(new Error(".concat(
    err, "), vars); });"));

  } else {
    this.pushCode("throw new Error(".concat(err, ");"));
  }
};

Context.prototype.generateTmpVariable = function () {
  return "$tmp".concat(this.tmpVariableCount++);
};

Context.prototype.pushCode = function () {
  var args = Array.prototype.slice.call(arguments);

  this.code += "".concat(Context.interpolate.apply(this, args), "\n");
};

Context.prototype.pushPath = function (name) {
  if (name) {
    this.scopes[this.scopes.length - 1].push(name);
  }
};

Context.prototype.popPath = function (name) {
  if (name) {
    this.scopes[this.scopes.length - 1].pop();
  }
};

Context.prototype.pushScope = function (name) {
  this.scopes.push([name]);
};

Context.prototype.popScope = function () {
  this.scopes.pop();
};

Context.prototype.addReference = function (alias) {
  if (this.references[alias]) return;
  this.references[alias] = { resolved: false, requested: false };
};

Context.prototype.markResolved = function (alias) {
  this.references[alias].resolved = true;
};

Context.prototype.markRequested = function (aliasList) {
  aliasList.forEach(
  function (alias) {
    this.references[alias].requested = true;
  }.bind(this));

};

Context.prototype.getUnresolvedReferences = function () {
  var references = this.references;
  return Object.keys(this.references).filter(function (alias) {
    return !references[alias].resolved && !references[alias].requested;
  });
};

//----------------------------------------------------------------------------------------
// private methods
//----------------------------------------------------------------------------------------

Context.interpolate = function (s) {
  var re = /{\d+}/g;
  var matches = s.match(re);
  var params = Array.prototype.slice.call(arguments, 1);

  if (matches) {
    matches.forEach(function (match) {
      var index = parseInt(match.substr(1, match.length - 2), 10);
      s = s.replace(match, params[index].toString());
    });
  }

  return s;
};

exports._ = Context;

/***/ }),

/***/ 22:
/***/ (function(module) {

// https://github.com/ionic-team/rollup-plugin-node-polyfills/blob/9b5fe1a9cafffd4871e6d65613ed224f807ea251/polyfills/vm.js#L129-L132
function runInThisContext(code) {
  const fn = new Function('code', 'return eval(code);');
  return fn.call(globalThis, code);
}

module.exports.runInThisContext = runInThisContext;


/***/ }),

/***/ 3720:
/***/ (function(module) {

module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};


/***/ }),

/***/ 1876:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={675:function(e,r){"use strict";r.byteLength=byteLength;r.toByteArray=toByteArray;r.fromByteArray=fromByteArray;var t=[];var f=[];var n=typeof Uint8Array!=="undefined"?Uint8Array:Array;var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var o=0,u=i.length;o<u;++o){t[o]=i[o];f[i.charCodeAt(o)]=o}f["-".charCodeAt(0)]=62;f["_".charCodeAt(0)]=63;function getLens(e){var r=e.length;if(r%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var t=e.indexOf("=");if(t===-1)t=r;var f=t===r?0:4-t%4;return[t,f]}function byteLength(e){var r=getLens(e);var t=r[0];var f=r[1];return(t+f)*3/4-f}function _byteLength(e,r,t){return(r+t)*3/4-t}function toByteArray(e){var r;var t=getLens(e);var i=t[0];var o=t[1];var u=new n(_byteLength(e,i,o));var a=0;var s=o>0?i-4:i;var h;for(h=0;h<s;h+=4){r=f[e.charCodeAt(h)]<<18|f[e.charCodeAt(h+1)]<<12|f[e.charCodeAt(h+2)]<<6|f[e.charCodeAt(h+3)];u[a++]=r>>16&255;u[a++]=r>>8&255;u[a++]=r&255}if(o===2){r=f[e.charCodeAt(h)]<<2|f[e.charCodeAt(h+1)]>>4;u[a++]=r&255}if(o===1){r=f[e.charCodeAt(h)]<<10|f[e.charCodeAt(h+1)]<<4|f[e.charCodeAt(h+2)]>>2;u[a++]=r>>8&255;u[a++]=r&255}return u}function tripletToBase64(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[e&63]}function encodeChunk(e,r,t){var f;var n=[];for(var i=r;i<t;i+=3){f=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(e[i+2]&255);n.push(tripletToBase64(f))}return n.join("")}function fromByteArray(e){var r;var f=e.length;var n=f%3;var i=[];var o=16383;for(var u=0,a=f-n;u<a;u+=o){i.push(encodeChunk(e,u,u+o>a?a:u+o))}if(n===1){r=e[f-1];i.push(t[r>>2]+t[r<<4&63]+"==")}else if(n===2){r=(e[f-2]<<8)+e[f-1];i.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")}return i.join("")}},72:function(e,r,t){"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var f=t(675);var n=t(783);var i=typeof Symbol==="function"&&typeof Symbol.for==="function"?Symbol.for("nodejs.util.inspect.custom"):null;r.Buffer=Buffer;r.SlowBuffer=SlowBuffer;r.INSPECT_MAX_BYTES=50;var o=2147483647;r.kMaxLength=o;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var e=new Uint8Array(1);var r={foo:function(){return 42}};Object.setPrototypeOf(r,Uint8Array.prototype);Object.setPrototypeOf(e,r);return e.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(e){if(e>o){throw new RangeError('The value "'+e+'" is invalid for option "size"')}var r=new Uint8Array(e);Object.setPrototypeOf(r,Buffer.prototype);return r}function Buffer(e,r,t){if(typeof e==="number"){if(typeof r==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(e)}return from(e,r,t)}Buffer.poolSize=8192;function from(e,r,t){if(typeof e==="string"){return fromString(e,r)}if(ArrayBuffer.isView(e)){return fromArrayLike(e)}if(e==null){throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)){return fromArrayBuffer(e,r,t)}if(typeof SharedArrayBuffer!=="undefined"&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer))){return fromArrayBuffer(e,r,t)}if(typeof e==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var f=e.valueOf&&e.valueOf();if(f!=null&&f!==e){return Buffer.from(f,r,t)}var n=fromObject(e);if(n)return n;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]==="function"){return Buffer.from(e[Symbol.toPrimitive]("string"),r,t)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}Buffer.from=function(e,r,t){return from(e,r,t)};Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype);Object.setPrototypeOf(Buffer,Uint8Array);function assertSize(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be of type number')}else if(e<0){throw new RangeError('The value "'+e+'" is invalid for option "size"')}}function alloc(e,r,t){assertSize(e);if(e<=0){return createBuffer(e)}if(r!==undefined){return typeof t==="string"?createBuffer(e).fill(r,t):createBuffer(e).fill(r)}return createBuffer(e)}Buffer.alloc=function(e,r,t){return alloc(e,r,t)};function allocUnsafe(e){assertSize(e);return createBuffer(e<0?0:checked(e)|0)}Buffer.allocUnsafe=function(e){return allocUnsafe(e)};Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)};function fromString(e,r){if(typeof r!=="string"||r===""){r="utf8"}if(!Buffer.isEncoding(r)){throw new TypeError("Unknown encoding: "+r)}var t=byteLength(e,r)|0;var f=createBuffer(t);var n=f.write(e,r);if(n!==t){f=f.slice(0,n)}return f}function fromArrayLike(e){var r=e.length<0?0:checked(e.length)|0;var t=createBuffer(r);for(var f=0;f<r;f+=1){t[f]=e[f]&255}return t}function fromArrayBuffer(e,r,t){if(r<0||e.byteLength<r){throw new RangeError('"offset" is outside of buffer bounds')}if(e.byteLength<r+(t||0)){throw new RangeError('"length" is outside of buffer bounds')}var f;if(r===undefined&&t===undefined){f=new Uint8Array(e)}else if(t===undefined){f=new Uint8Array(e,r)}else{f=new Uint8Array(e,r,t)}Object.setPrototypeOf(f,Buffer.prototype);return f}function fromObject(e){if(Buffer.isBuffer(e)){var r=checked(e.length)|0;var t=createBuffer(r);if(t.length===0){return t}e.copy(t,0,0,r);return t}if(e.length!==undefined){if(typeof e.length!=="number"||numberIsNaN(e.length)){return createBuffer(0)}return fromArrayLike(e)}if(e.type==="Buffer"&&Array.isArray(e.data)){return fromArrayLike(e.data)}}function checked(e){if(e>=o){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+o.toString(16)+" bytes")}return e|0}function SlowBuffer(e){if(+e!=e){e=0}return Buffer.alloc(+e)}Buffer.isBuffer=function isBuffer(e){return e!=null&&e._isBuffer===true&&e!==Buffer.prototype};Buffer.compare=function compare(e,r){if(isInstance(e,Uint8Array))e=Buffer.from(e,e.offset,e.byteLength);if(isInstance(r,Uint8Array))r=Buffer.from(r,r.offset,r.byteLength);if(!Buffer.isBuffer(e)||!Buffer.isBuffer(r)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(e===r)return 0;var t=e.length;var f=r.length;for(var n=0,i=Math.min(t,f);n<i;++n){if(e[n]!==r[n]){t=e[n];f=r[n];break}}if(t<f)return-1;if(f<t)return 1;return 0};Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(e,r){if(!Array.isArray(e)){throw new TypeError('"list" argument must be an Array of Buffers')}if(e.length===0){return Buffer.alloc(0)}var t;if(r===undefined){r=0;for(t=0;t<e.length;++t){r+=e[t].length}}var f=Buffer.allocUnsafe(r);var n=0;for(t=0;t<e.length;++t){var i=e[t];if(isInstance(i,Uint8Array)){i=Buffer.from(i)}if(!Buffer.isBuffer(i)){throw new TypeError('"list" argument must be an Array of Buffers')}i.copy(f,n);n+=i.length}return f};function byteLength(e,r){if(Buffer.isBuffer(e)){return e.length}if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof e)}var t=e.length;var f=arguments.length>2&&arguments[2]===true;if(!f&&t===0)return 0;var n=false;for(;;){switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return base64ToBytes(e).length;default:if(n){return f?-1:utf8ToBytes(e).length}r=(""+r).toLowerCase();n=true}}}Buffer.byteLength=byteLength;function slowToString(e,r,t){var f=false;if(r===undefined||r<0){r=0}if(r>this.length){return""}if(t===undefined||t>this.length){t=this.length}if(t<=0){return""}t>>>=0;r>>>=0;if(t<=r){return""}if(!e)e="utf8";while(true){switch(e){case"hex":return hexSlice(this,r,t);case"utf8":case"utf-8":return utf8Slice(this,r,t);case"ascii":return asciiSlice(this,r,t);case"latin1":case"binary":return latin1Slice(this,r,t);case"base64":return base64Slice(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,r,t);default:if(f)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase();f=true}}}Buffer.prototype._isBuffer=true;function swap(e,r,t){var f=e[r];e[r]=e[t];e[t]=f}Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<e;r+=2){swap(this,r,r+1)}return this};Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<e;r+=4){swap(this,r,r+3);swap(this,r+1,r+2)}return this};Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<e;r+=8){swap(this,r,r+7);swap(this,r+1,r+6);swap(this,r+2,r+5);swap(this,r+3,r+4)}return this};Buffer.prototype.toString=function toString(){var e=this.length;if(e===0)return"";if(arguments.length===0)return utf8Slice(this,0,e);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(this===e)return true;return Buffer.compare(this,e)===0};Buffer.prototype.inspect=function inspect(){var e="";var t=r.INSPECT_MAX_BYTES;e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim();if(this.length>t)e+=" ... ";return"<Buffer "+e+">"};if(i){Buffer.prototype[i]=Buffer.prototype.inspect}Buffer.prototype.compare=function compare(e,r,t,f,n){if(isInstance(e,Uint8Array)){e=Buffer.from(e,e.offset,e.byteLength)}if(!Buffer.isBuffer(e)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof e)}if(r===undefined){r=0}if(t===undefined){t=e?e.length:0}if(f===undefined){f=0}if(n===undefined){n=this.length}if(r<0||t>e.length||f<0||n>this.length){throw new RangeError("out of range index")}if(f>=n&&r>=t){return 0}if(f>=n){return-1}if(r>=t){return 1}r>>>=0;t>>>=0;f>>>=0;n>>>=0;if(this===e)return 0;var i=n-f;var o=t-r;var u=Math.min(i,o);var a=this.slice(f,n);var s=e.slice(r,t);for(var h=0;h<u;++h){if(a[h]!==s[h]){i=a[h];o=s[h];break}}if(i<o)return-1;if(o<i)return 1;return 0};function bidirectionalIndexOf(e,r,t,f,n){if(e.length===0)return-1;if(typeof t==="string"){f=t;t=0}else if(t>2147483647){t=2147483647}else if(t<-2147483648){t=-2147483648}t=+t;if(numberIsNaN(t)){t=n?0:e.length-1}if(t<0)t=e.length+t;if(t>=e.length){if(n)return-1;else t=e.length-1}else if(t<0){if(n)t=0;else return-1}if(typeof r==="string"){r=Buffer.from(r,f)}if(Buffer.isBuffer(r)){if(r.length===0){return-1}return arrayIndexOf(e,r,t,f,n)}else if(typeof r==="number"){r=r&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(n){return Uint8Array.prototype.indexOf.call(e,r,t)}else{return Uint8Array.prototype.lastIndexOf.call(e,r,t)}}return arrayIndexOf(e,[r],t,f,n)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,r,t,f,n){var i=1;var o=e.length;var u=r.length;if(f!==undefined){f=String(f).toLowerCase();if(f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le"){if(e.length<2||r.length<2){return-1}i=2;o/=2;u/=2;t/=2}}function read(e,r){if(i===1){return e[r]}else{return e.readUInt16BE(r*i)}}var a;if(n){var s=-1;for(a=t;a<o;a++){if(read(e,a)===read(r,s===-1?0:a-s)){if(s===-1)s=a;if(a-s+1===u)return s*i}else{if(s!==-1)a-=a-s;s=-1}}}else{if(t+u>o)t=o-u;for(a=t;a>=0;a--){var h=true;for(var c=0;c<u;c++){if(read(e,a+c)!==read(r,c)){h=false;break}}if(h)return a}}return-1}Buffer.prototype.includes=function includes(e,r,t){return this.indexOf(e,r,t)!==-1};Buffer.prototype.indexOf=function indexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,false)};function hexWrite(e,r,t,f){t=Number(t)||0;var n=e.length-t;if(!f){f=n}else{f=Number(f);if(f>n){f=n}}var i=r.length;if(f>i/2){f=i/2}for(var o=0;o<f;++o){var u=parseInt(r.substr(o*2,2),16);if(numberIsNaN(u))return o;e[t+o]=u}return o}function utf8Write(e,r,t,f){return blitBuffer(utf8ToBytes(r,e.length-t),e,t,f)}function asciiWrite(e,r,t,f){return blitBuffer(asciiToBytes(r),e,t,f)}function latin1Write(e,r,t,f){return asciiWrite(e,r,t,f)}function base64Write(e,r,t,f){return blitBuffer(base64ToBytes(r),e,t,f)}function ucs2Write(e,r,t,f){return blitBuffer(utf16leToBytes(r,e.length-t),e,t,f)}Buffer.prototype.write=function write(e,r,t,f){if(r===undefined){f="utf8";t=this.length;r=0}else if(t===undefined&&typeof r==="string"){f=r;t=this.length;r=0}else if(isFinite(r)){r=r>>>0;if(isFinite(t)){t=t>>>0;if(f===undefined)f="utf8"}else{f=t;t=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var n=this.length-r;if(t===undefined||t>n)t=n;if(e.length>0&&(t<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!f)f="utf8";var i=false;for(;;){switch(f){case"hex":return hexWrite(this,e,r,t);case"utf8":case"utf-8":return utf8Write(this,e,r,t);case"ascii":return asciiWrite(this,e,r,t);case"latin1":case"binary":return latin1Write(this,e,r,t);case"base64":return base64Write(this,e,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,r,t);default:if(i)throw new TypeError("Unknown encoding: "+f);f=(""+f).toLowerCase();i=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(e,r,t){if(r===0&&t===e.length){return f.fromByteArray(e)}else{return f.fromByteArray(e.slice(r,t))}}function utf8Slice(e,r,t){t=Math.min(e.length,t);var f=[];var n=r;while(n<t){var i=e[n];var o=null;var u=i>239?4:i>223?3:i>191?2:1;if(n+u<=t){var a,s,h,c;switch(u){case 1:if(i<128){o=i}break;case 2:a=e[n+1];if((a&192)===128){c=(i&31)<<6|a&63;if(c>127){o=c}}break;case 3:a=e[n+1];s=e[n+2];if((a&192)===128&&(s&192)===128){c=(i&15)<<12|(a&63)<<6|s&63;if(c>2047&&(c<55296||c>57343)){o=c}}break;case 4:a=e[n+1];s=e[n+2];h=e[n+3];if((a&192)===128&&(s&192)===128&&(h&192)===128){c=(i&15)<<18|(a&63)<<12|(s&63)<<6|h&63;if(c>65535&&c<1114112){o=c}}}}if(o===null){o=65533;u=1}else if(o>65535){o-=65536;f.push(o>>>10&1023|55296);o=56320|o&1023}f.push(o);n+=u}return decodeCodePointsArray(f)}var u=4096;function decodeCodePointsArray(e){var r=e.length;if(r<=u){return String.fromCharCode.apply(String,e)}var t="";var f=0;while(f<r){t+=String.fromCharCode.apply(String,e.slice(f,f+=u))}return t}function asciiSlice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n]&127)}return f}function latin1Slice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n])}return f}function hexSlice(e,r,t){var f=e.length;if(!r||r<0)r=0;if(!t||t<0||t>f)t=f;var n="";for(var i=r;i<t;++i){n+=s[e[i]]}return n}function utf16leSlice(e,r,t){var f=e.slice(r,t);var n="";for(var i=0;i<f.length;i+=2){n+=String.fromCharCode(f[i]+f[i+1]*256)}return n}Buffer.prototype.slice=function slice(e,r){var t=this.length;e=~~e;r=r===undefined?t:~~r;if(e<0){e+=t;if(e<0)e=0}else if(e>t){e=t}if(r<0){r+=t;if(r<0)r=0}else if(r>t){r=t}if(r<e)r=e;var f=this.subarray(e,r);Object.setPrototypeOf(f,Buffer.prototype);return f};function checkOffset(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}return f};Buffer.prototype.readUIntBE=function readUIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t){checkOffset(e,r,this.length)}var f=this[e+--r];var n=1;while(r>0&&(n*=256)){f+=this[e+--r]*n}return f};Buffer.prototype.readUInt8=function readUInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);return this[e]};Buffer.prototype.readUInt16LE=function readUInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]|this[e+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]<<8|this[e+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};Buffer.prototype.readIntLE=function readIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}n*=128;if(f>=n)f-=Math.pow(2,8*r);return f};Buffer.prototype.readIntBE=function readIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=r;var n=1;var i=this[e+--f];while(f>0&&(n*=256)){i+=this[e+--f]*n}n*=128;if(i>=n)i-=Math.pow(2,8*r);return i};Buffer.prototype.readInt8=function readInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);if(!(this[e]&128))return this[e];return(255-this[e]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt16BE=function readInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt32LE=function readInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};Buffer.prototype.readFloatLE=function readFloatLE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,false,52,8)};function checkInt(e,r,t,f,n,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>n||r<i)throw new RangeError('"value" argument is out of bounds');if(t+f>e.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=1;var o=0;this[r]=e&255;while(++o<t&&(i*=256)){this[r+o]=e/i&255}return r+t};Buffer.prototype.writeUIntBE=function writeUIntBE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=t-1;var o=1;this[r+i]=e&255;while(--i>=0&&(o*=256)){this[r+i]=e/o&255}return r+t};Buffer.prototype.writeUInt8=function writeUInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,255,0);this[r]=e&255;return r+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r+3]=e>>>24;this[r+2]=e>>>16;this[r+1]=e>>>8;this[r]=e&255;return r+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};Buffer.prototype.writeIntLE=function writeIntLE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=0;var o=1;var u=0;this[r]=e&255;while(++i<t&&(o*=256)){if(e<0&&u===0&&this[r+i-1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeIntBE=function writeIntBE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=t-1;var o=1;var u=0;this[r+i]=e&255;while(--i>=0&&(o*=256)){if(e<0&&u===0&&this[r+i+1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeInt8=function writeInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,127,-128);if(e<0)e=255+e+1;this[r]=e&255;return r+1};Buffer.prototype.writeInt16LE=function writeInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeInt16BE=function writeInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeInt32LE=function writeInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);this[r]=e&255;this[r+1]=e>>>8;this[r+2]=e>>>16;this[r+3]=e>>>24;return r+4};Buffer.prototype.writeInt32BE=function writeInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);if(e<0)e=4294967295+e+1;this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};function checkIEEE754(e,r,t,f,n,i){if(t+f>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function writeFloat(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,4,34028234663852886e22,-34028234663852886e22)}n.write(e,r,t,f,23,4);return t+4}Buffer.prototype.writeFloatLE=function writeFloatLE(e,r,t){return writeFloat(this,e,r,true,t)};Buffer.prototype.writeFloatBE=function writeFloatBE(e,r,t){return writeFloat(this,e,r,false,t)};function writeDouble(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,8,17976931348623157e292,-17976931348623157e292)}n.write(e,r,t,f,52,8);return t+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,r,t){return writeDouble(this,e,r,true,t)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,r,t){return writeDouble(this,e,r,false,t)};Buffer.prototype.copy=function copy(e,r,t,f){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(!t)t=0;if(!f&&f!==0)f=this.length;if(r>=e.length)r=e.length;if(!r)r=0;if(f>0&&f<t)f=t;if(f===t)return 0;if(e.length===0||this.length===0)return 0;if(r<0){throw new RangeError("targetStart out of bounds")}if(t<0||t>=this.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("sourceEnd out of bounds");if(f>this.length)f=this.length;if(e.length-r<f-t){f=e.length-r+t}var n=f-t;if(this===e&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(r,t,f)}else if(this===e&&t<r&&r<f){for(var i=n-1;i>=0;--i){e[i+r]=this[i+t]}}else{Uint8Array.prototype.set.call(e,this.subarray(t,f),r)}return n};Buffer.prototype.fill=function fill(e,r,t,f){if(typeof e==="string"){if(typeof r==="string"){f=r;r=0;t=this.length}else if(typeof t==="string"){f=t;t=this.length}if(f!==undefined&&typeof f!=="string"){throw new TypeError("encoding must be a string")}if(typeof f==="string"&&!Buffer.isEncoding(f)){throw new TypeError("Unknown encoding: "+f)}if(e.length===1){var n=e.charCodeAt(0);if(f==="utf8"&&n<128||f==="latin1"){e=n}}}else if(typeof e==="number"){e=e&255}else if(typeof e==="boolean"){e=Number(e)}if(r<0||this.length<r||this.length<t){throw new RangeError("Out of range index")}if(t<=r){return this}r=r>>>0;t=t===undefined?this.length:t>>>0;if(!e)e=0;var i;if(typeof e==="number"){for(i=r;i<t;++i){this[i]=e}}else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,f);var u=o.length;if(u===0){throw new TypeError('The value "'+e+'" is invalid for argument "value"')}for(i=0;i<t-r;++i){this[i+r]=o[i%u]}}return this};var a=/[^+/0-9A-Za-z-_]/g;function base64clean(e){e=e.split("=")[0];e=e.trim().replace(a,"");if(e.length<2)return"";while(e.length%4!==0){e=e+"="}return e}function utf8ToBytes(e,r){r=r||Infinity;var t;var f=e.length;var n=null;var i=[];for(var o=0;o<f;++o){t=e.charCodeAt(o);if(t>55295&&t<57344){if(!n){if(t>56319){if((r-=3)>-1)i.push(239,191,189);continue}else if(o+1===f){if((r-=3)>-1)i.push(239,191,189);continue}n=t;continue}if(t<56320){if((r-=3)>-1)i.push(239,191,189);n=t;continue}t=(n-55296<<10|t-56320)+65536}else if(n){if((r-=3)>-1)i.push(239,191,189)}n=null;if(t<128){if((r-=1)<0)break;i.push(t)}else if(t<2048){if((r-=2)<0)break;i.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;i.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;i.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else{throw new Error("Invalid code point")}}return i}function asciiToBytes(e){var r=[];for(var t=0;t<e.length;++t){r.push(e.charCodeAt(t)&255)}return r}function utf16leToBytes(e,r){var t,f,n;var i=[];for(var o=0;o<e.length;++o){if((r-=2)<0)break;t=e.charCodeAt(o);f=t>>8;n=t%256;i.push(n);i.push(f)}return i}function base64ToBytes(e){return f.toByteArray(base64clean(e))}function blitBuffer(e,r,t,f){for(var n=0;n<f;++n){if(n+t>=r.length||n>=e.length)break;r[n+t]=e[n]}return n}function isInstance(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function numberIsNaN(e){return e!==e}var s=function(){var e="0123456789abcdef";var r=new Array(256);for(var t=0;t<16;++t){var f=t*16;for(var n=0;n<16;++n){r[f+n]=e[t]+e[n]}}return r}()},783:function(e,r){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
r.read=function(e,r,t,f,n){var i,o;var u=n*8-f-1;var a=(1<<u)-1;var s=a>>1;var h=-7;var c=t?n-1:0;var l=t?-1:1;var p=e[r+c];c+=l;i=p&(1<<-h)-1;p>>=-h;h+=u;for(;h>0;i=i*256+e[r+c],c+=l,h-=8){}o=i&(1<<-h)-1;i>>=-h;h+=f;for(;h>0;o=o*256+e[r+c],c+=l,h-=8){}if(i===0){i=1-s}else if(i===a){return o?NaN:(p?-1:1)*Infinity}else{o=o+Math.pow(2,f);i=i-s}return(p?-1:1)*o*Math.pow(2,i-f)};r.write=function(e,r,t,f,n,i){var o,u,a;var s=i*8-n-1;var h=(1<<s)-1;var c=h>>1;var l=n===23?Math.pow(2,-24)-Math.pow(2,-77):0;var p=f?0:i-1;var y=f?1:-1;var g=r<0||r===0&&1/r<0?1:0;r=Math.abs(r);if(isNaN(r)||r===Infinity){u=isNaN(r)?1:0;o=h}else{o=Math.floor(Math.log(r)/Math.LN2);if(r*(a=Math.pow(2,-o))<1){o--;a*=2}if(o+c>=1){r+=l/a}else{r+=l*Math.pow(2,1-c)}if(r*a>=2){o++;a/=2}if(o+c>=h){u=0;o=h}else if(o+c>=1){u=(r*a-1)*Math.pow(2,n);o=o+c}else{u=r*Math.pow(2,c-1)*Math.pow(2,n);o=0}}for(;n>=8;e[t+p]=u&255,p+=y,u/=256,n-=8){}o=o<<n|u;s+=n;for(;s>0;e[t+p]=o&255,p+=y,o/=256,s-=8){}e[t+p-y]|=g*128}}};var r={};function __nccwpck_require__(t){var f=r[t];if(f!==undefined){return f.exports}var n=r[t]={exports:{}};var i=true;try{e[t](n,n.exports,__nccwpck_require__);i=false}finally{if(i)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(72);module.exports=t})();

/***/ }),

/***/ 9567:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": function() { return /* binding */ Parser; }
/* harmony export */ });
class Context {
    constructor(importPath, useContextVariables) {
        this.code = "";
        this.scopes = [["vars"]];
        this.bitFields = [];
        this.tmpVariableCount = 0;
        this.references = new Map();
        this.imports = [];
        this.reverseImports = new Map();
        this.useContextVariables = false;
        this.importPath = importPath;
        this.useContextVariables = useContextVariables;
    }
    generateVariable(name) {
        const scopes = [...this.scopes[this.scopes.length - 1]];
        if (name) {
            scopes.push(name);
        }
        return scopes.join(".");
    }
    generateOption(val) {
        switch (typeof val) {
            case "number":
                return val.toString();
            case "string":
                return this.generateVariable(val);
            case "function":
                return `${this.addImport(val)}.call(${this.generateVariable()}, vars)`;
        }
    }
    generateError(err) {
        this.pushCode(`throw new Error(${err});`);
    }
    generateTmpVariable() {
        return "$tmp" + this.tmpVariableCount++;
    }
    pushCode(code) {
        this.code += code + "\n";
    }
    pushPath(name) {
        if (name) {
            this.scopes[this.scopes.length - 1].push(name);
        }
    }
    popPath(name) {
        if (name) {
            this.scopes[this.scopes.length - 1].pop();
        }
    }
    pushScope(name) {
        this.scopes.push([name]);
    }
    popScope() {
        this.scopes.pop();
    }
    addImport(im) {
        if (!this.importPath)
            return `(${im})`;
        let id = this.reverseImports.get(im);
        if (!id) {
            id = this.imports.push(im) - 1;
            this.reverseImports.set(im, id);
        }
        return `${this.importPath}[${id}]`;
    }
    addReference(alias) {
        if (!this.references.has(alias)) {
            this.references.set(alias, { resolved: false, requested: false });
        }
    }
    markResolved(alias) {
        const reference = this.references.get(alias);
        if (reference) {
            reference.resolved = true;
        }
    }
    markRequested(aliasList) {
        aliasList.forEach((alias) => {
            const reference = this.references.get(alias);
            if (reference) {
                reference.requested = true;
            }
        });
    }
    getUnresolvedReferences() {
        return Array.from(this.references)
            .filter(([_, reference]) => !reference.resolved && !reference.requested)
            .map(([alias, _]) => alias);
    }
}
const aliasRegistry = new Map();
const FUNCTION_PREFIX = "___parser_";
const PRIMITIVE_SIZES = {
    uint8: 1,
    uint16le: 2,
    uint16be: 2,
    uint32le: 4,
    uint32be: 4,
    int8: 1,
    int16le: 2,
    int16be: 2,
    int32le: 4,
    int32be: 4,
    int64be: 8,
    int64le: 8,
    uint64be: 8,
    uint64le: 8,
    floatle: 4,
    floatbe: 4,
    doublele: 8,
    doublebe: 8,
};
const PRIMITIVE_NAMES = {
    uint8: "Uint8",
    uint16le: "Uint16",
    uint16be: "Uint16",
    uint32le: "Uint32",
    uint32be: "Uint32",
    int8: "Int8",
    int16le: "Int16",
    int16be: "Int16",
    int32le: "Int32",
    int32be: "Int32",
    int64be: "BigInt64",
    int64le: "BigInt64",
    uint64be: "BigUint64",
    uint64le: "BigUint64",
    floatle: "Float32",
    floatbe: "Float32",
    doublele: "Float64",
    doublebe: "Float64",
};
const PRIMITIVE_LITTLE_ENDIANS = {
    uint8: false,
    uint16le: true,
    uint16be: false,
    uint32le: true,
    uint32be: false,
    int8: false,
    int16le: true,
    int16be: false,
    int32le: true,
    int32be: false,
    int64be: false,
    int64le: true,
    uint64be: false,
    uint64le: true,
    floatle: true,
    floatbe: false,
    doublele: true,
    doublebe: false,
};
class Parser {
    constructor() {
        this.varName = "";
        this.type = "";
        this.options = {};
        this.endian = "be";
        this.useContextVariables = false;
    }
    static start() {
        return new Parser();
    }
    primitiveGenerateN(type, ctx) {
        const typeName = PRIMITIVE_NAMES[type];
        const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
        ctx.pushCode(`${ctx.generateVariable(this.varName)} = dataView.get${typeName}(offset, ${littleEndian});`);
        ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
    }
    primitiveN(type, varName, options) {
        return this.setNextParser(type, varName, options);
    }
    useThisEndian(type) {
        return (type + this.endian.toLowerCase());
    }
    uint8(varName, options = {}) {
        return this.primitiveN("uint8", varName, options);
    }
    uint16(varName, options = {}) {
        return this.primitiveN(this.useThisEndian("uint16"), varName, options);
    }
    uint16le(varName, options = {}) {
        return this.primitiveN("uint16le", varName, options);
    }
    uint16be(varName, options = {}) {
        return this.primitiveN("uint16be", varName, options);
    }
    uint32(varName, options = {}) {
        return this.primitiveN(this.useThisEndian("uint32"), varName, options);
    }
    uint32le(varName, options = {}) {
        return this.primitiveN("uint32le", varName, options);
    }
    uint32be(varName, options = {}) {
        return this.primitiveN("uint32be", varName, options);
    }
    int8(varName, options = {}) {
        return this.primitiveN("int8", varName, options);
    }
    int16(varName, options = {}) {
        return this.primitiveN(this.useThisEndian("int16"), varName, options);
    }
    int16le(varName, options = {}) {
        return this.primitiveN("int16le", varName, options);
    }
    int16be(varName, options = {}) {
        return this.primitiveN("int16be", varName, options);
    }
    int32(varName, options = {}) {
        return this.primitiveN(this.useThisEndian("int32"), varName, options);
    }
    int32le(varName, options = {}) {
        return this.primitiveN("int32le", varName, options);
    }
    int32be(varName, options = {}) {
        return this.primitiveN("int32be", varName, options);
    }
    bigIntVersionCheck() {
        if (!DataView.prototype.getBigInt64)
            throw new Error("BigInt64 is unsupported on this runtime");
    }
    int64(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN(this.useThisEndian("int64"), varName, options);
    }
    int64be(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN("int64be", varName, options);
    }
    int64le(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN("int64le", varName, options);
    }
    uint64(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN(this.useThisEndian("uint64"), varName, options);
    }
    uint64be(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN("uint64be", varName, options);
    }
    uint64le(varName, options = {}) {
        this.bigIntVersionCheck();
        return this.primitiveN("uint64le", varName, options);
    }
    floatle(varName, options = {}) {
        return this.primitiveN("floatle", varName, options);
    }
    floatbe(varName, options = {}) {
        return this.primitiveN("floatbe", varName, options);
    }
    doublele(varName, options = {}) {
        return this.primitiveN("doublele", varName, options);
    }
    doublebe(varName, options = {}) {
        return this.primitiveN("doublebe", varName, options);
    }
    bitN(size, varName, options) {
        options.length = size;
        return this.setNextParser("bit", varName, options);
    }
    bit1(varName, options = {}) {
        return this.bitN(1, varName, options);
    }
    bit2(varName, options = {}) {
        return this.bitN(2, varName, options);
    }
    bit3(varName, options = {}) {
        return this.bitN(3, varName, options);
    }
    bit4(varName, options = {}) {
        return this.bitN(4, varName, options);
    }
    bit5(varName, options = {}) {
        return this.bitN(5, varName, options);
    }
    bit6(varName, options = {}) {
        return this.bitN(6, varName, options);
    }
    bit7(varName, options = {}) {
        return this.bitN(7, varName, options);
    }
    bit8(varName, options = {}) {
        return this.bitN(8, varName, options);
    }
    bit9(varName, options = {}) {
        return this.bitN(9, varName, options);
    }
    bit10(varName, options = {}) {
        return this.bitN(10, varName, options);
    }
    bit11(varName, options = {}) {
        return this.bitN(11, varName, options);
    }
    bit12(varName, options = {}) {
        return this.bitN(12, varName, options);
    }
    bit13(varName, options = {}) {
        return this.bitN(13, varName, options);
    }
    bit14(varName, options = {}) {
        return this.bitN(14, varName, options);
    }
    bit15(varName, options = {}) {
        return this.bitN(15, varName, options);
    }
    bit16(varName, options = {}) {
        return this.bitN(16, varName, options);
    }
    bit17(varName, options = {}) {
        return this.bitN(17, varName, options);
    }
    bit18(varName, options = {}) {
        return this.bitN(18, varName, options);
    }
    bit19(varName, options = {}) {
        return this.bitN(19, varName, options);
    }
    bit20(varName, options = {}) {
        return this.bitN(20, varName, options);
    }
    bit21(varName, options = {}) {
        return this.bitN(21, varName, options);
    }
    bit22(varName, options = {}) {
        return this.bitN(22, varName, options);
    }
    bit23(varName, options = {}) {
        return this.bitN(23, varName, options);
    }
    bit24(varName, options = {}) {
        return this.bitN(24, varName, options);
    }
    bit25(varName, options = {}) {
        return this.bitN(25, varName, options);
    }
    bit26(varName, options = {}) {
        return this.bitN(26, varName, options);
    }
    bit27(varName, options = {}) {
        return this.bitN(27, varName, options);
    }
    bit28(varName, options = {}) {
        return this.bitN(28, varName, options);
    }
    bit29(varName, options = {}) {
        return this.bitN(29, varName, options);
    }
    bit30(varName, options = {}) {
        return this.bitN(30, varName, options);
    }
    bit31(varName, options = {}) {
        return this.bitN(31, varName, options);
    }
    bit32(varName, options = {}) {
        return this.bitN(32, varName, options);
    }
    namely(alias) {
        aliasRegistry.set(alias, this);
        this.alias = alias;
        return this;
    }
    skip(length, options = {}) {
        return this.seek(length, options);
    }
    seek(relOffset, options = {}) {
        if (options.assert) {
            throw new Error("assert option on seek is not allowed.");
        }
        return this.setNextParser("seek", "", { length: relOffset });
    }
    string(varName, options) {
        if (!options.zeroTerminated && !options.length && !options.greedy) {
            throw new Error("One of length, zeroTerminated, or greedy must be defined for string.");
        }
        if ((options.zeroTerminated || options.length) && options.greedy) {
            throw new Error("greedy is mutually exclusive with length and zeroTerminated for string.");
        }
        if (options.stripNull && !(options.length || options.greedy)) {
            throw new Error("length or greedy must be defined if stripNull is enabled.");
        }
        options.encoding = options.encoding || "utf8";
        return this.setNextParser("string", varName, options);
    }
    buffer(varName, options) {
        if (!options.length && !options.readUntil) {
            throw new Error("length or readUntil must be defined for buffer.");
        }
        return this.setNextParser("buffer", varName, options);
    }
    wrapped(varName, options) {
        if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
        }
        if (!options || !options.wrapper || !options.type) {
            throw new Error("Both wrapper and type must be defined for wrapped.");
        }
        if (!options.length && !options.readUntil) {
            throw new Error("length or readUntil must be defined for wrapped.");
        }
        return this.setNextParser("wrapper", varName, options);
    }
    array(varName, options) {
        if (!options.readUntil && !options.length && !options.lengthInBytes) {
            throw new Error("One of readUntil, length and lengthInBytes must be defined for array.");
        }
        if (!options.type) {
            throw new Error("type is required for array.");
        }
        if (typeof options.type === "string" &&
            !aliasRegistry.has(options.type) &&
            !(options.type in PRIMITIVE_SIZES)) {
            throw new Error(`Array element type "${options.type}" is unkown.`);
        }
        return this.setNextParser("array", varName, options);
    }
    choice(varName, options) {
        if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
        }
        if (!options) {
            throw new Error("tag and choices are are required for choice.");
        }
        if (!options.tag) {
            throw new Error("tag is requird for choice.");
        }
        if (!options.choices) {
            throw new Error("choices is required for choice.");
        }
        for (const keyString in options.choices) {
            const key = parseInt(keyString, 10);
            const value = options.choices[key];
            if (isNaN(key)) {
                throw new Error(`Choice key "${keyString}" is not a number.`);
            }
            if (typeof value === "string" &&
                !aliasRegistry.has(value) &&
                !(value in PRIMITIVE_SIZES)) {
                throw new Error(`Choice type "${value}" is unkown.`);
            }
        }
        return this.setNextParser("choice", varName, options);
    }
    nest(varName, options) {
        if (typeof options !== "object" && typeof varName === "object") {
            options = varName;
            varName = "";
        }
        if (!options || !options.type) {
            throw new Error("type is required for nest.");
        }
        if (!(options.type instanceof Parser) && !aliasRegistry.has(options.type)) {
            throw new Error("type must be a known parser name or a Parser object.");
        }
        if (!(options.type instanceof Parser) && !varName) {
            throw new Error("type must be a Parser object if the variable name is omitted.");
        }
        return this.setNextParser("nest", varName, options);
    }
    pointer(varName, options) {
        if (!options.offset) {
            throw new Error("offset is required for pointer.");
        }
        if (!options.type) {
            throw new Error("type is required for pointer.");
        }
        if (typeof options.type === "string" &&
            !(options.type in PRIMITIVE_SIZES) &&
            !aliasRegistry.has(options.type)) {
            throw new Error(`Pointer type "${options.type}" is unkown.`);
        }
        return this.setNextParser("pointer", varName, options);
    }
    saveOffset(varName, options = {}) {
        return this.setNextParser("saveOffset", varName, options);
    }
    endianness(endianness) {
        switch (endianness.toLowerCase()) {
            case "little":
                this.endian = "le";
                break;
            case "big":
                this.endian = "be";
                break;
            default:
                throw new Error('endianness must be one of "little" or "big"');
        }
        return this;
    }
    endianess(endianess) {
        return this.endianness(endianess);
    }
    useContextVars(useContextVariables = true) {
        this.useContextVariables = useContextVariables;
        return this;
    }
    create(constructorFn) {
        if (!(constructorFn instanceof Function)) {
            throw new Error("Constructor must be a Function object.");
        }
        this.constructorFn = constructorFn;
        return this;
    }
    getContext(importPath) {
        const ctx = new Context(importPath, this.useContextVariables);
        ctx.pushCode("var dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);");
        if (!this.alias) {
            this.addRawCode(ctx);
        }
        else {
            this.addAliasedCode(ctx);
            ctx.pushCode(`return ${FUNCTION_PREFIX + this.alias}(0).result;`);
        }
        return ctx;
    }
    getCode() {
        const importPath = "imports";
        return this.getContext(importPath).code;
    }
    addRawCode(ctx) {
        ctx.pushCode("var offset = 0;");
        ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`);
        ctx.pushCode("vars.$parent = null;");
        ctx.pushCode("vars.$root = vars;");
        this.generate(ctx);
        this.resolveReferences(ctx);
        ctx.pushCode("delete vars.$parent;");
        ctx.pushCode("delete vars.$root;");
        ctx.pushCode("return vars;");
    }
    addAliasedCode(ctx) {
        ctx.pushCode(`function ${FUNCTION_PREFIX + this.alias}(offset, context) {`);
        ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`);
        ctx.pushCode("var ctx = Object.assign({$parent: null, $root: vars}, context || {});");
        ctx.pushCode(`vars = Object.assign(vars, ctx);`);
        this.generate(ctx);
        ctx.markResolved(this.alias);
        this.resolveReferences(ctx);
        ctx.pushCode("Object.keys(ctx).forEach(function (item) { delete vars[item]; });");
        ctx.pushCode("return { offset: offset, result: vars };");
        ctx.pushCode("}");
        return ctx;
    }
    resolveReferences(ctx) {
        const references = ctx.getUnresolvedReferences();
        ctx.markRequested(references);
        references.forEach((alias) => {
            var _a;
            (_a = aliasRegistry.get(alias)) === null || _a === void 0 ? void 0 : _a.addAliasedCode(ctx);
        });
    }
    compile() {
        const importPath = "imports";
        const ctx = this.getContext(importPath);
        this.compiled = new Function(importPath, "TextDecoder", `return function (buffer, constructorFn) { ${ctx.code} };`)(ctx.imports, TextDecoder);
    }
    sizeOf() {
        let size = NaN;
        if (Object.keys(PRIMITIVE_SIZES).indexOf(this.type) >= 0) {
            size = PRIMITIVE_SIZES[this.type];
            // if this is a fixed length string
        }
        else if (this.type === "string" &&
            typeof this.options.length === "number") {
            size = this.options.length;
            // if this is a fixed length buffer
        }
        else if (this.type === "buffer" &&
            typeof this.options.length === "number") {
            size = this.options.length;
            // if this is a fixed length array
        }
        else if (this.type === "array" &&
            typeof this.options.length === "number") {
            let elementSize = NaN;
            if (typeof this.options.type === "string") {
                elementSize = PRIMITIVE_SIZES[this.options.type];
            }
            else if (this.options.type instanceof Parser) {
                elementSize = this.options.type.sizeOf();
            }
            size = this.options.length * elementSize;
            // if this a skip
        }
        else if (this.type === "seek") {
            size = this.options.length;
            // if this is a nested parser
        }
        else if (this.type === "nest") {
            size = this.options.type.sizeOf();
        }
        else if (!this.type) {
            size = 0;
        }
        if (this.next) {
            size += this.next.sizeOf();
        }
        return size;
    }
    // Follow the parser chain till the root and start parsing from there
    parse(buffer) {
        if (!this.compiled) {
            this.compile();
        }
        return this.compiled(buffer, this.constructorFn);
    }
    setNextParser(type, varName, options) {
        const parser = new Parser();
        parser.type = type;
        parser.varName = varName;
        parser.options = options;
        parser.endian = this.endian;
        if (this.head) {
            this.head.next = parser;
        }
        else {
            this.next = parser;
        }
        this.head = parser;
        return this;
    }
    // Call code generator for this parser
    generate(ctx) {
        if (this.type) {
            switch (this.type) {
                case "uint8":
                case "uint16le":
                case "uint16be":
                case "uint32le":
                case "uint32be":
                case "int8":
                case "int16le":
                case "int16be":
                case "int32le":
                case "int32be":
                case "int64be":
                case "int64le":
                case "uint64be":
                case "uint64le":
                case "floatle":
                case "floatbe":
                case "doublele":
                case "doublebe":
                    this.primitiveGenerateN(this.type, ctx);
                    break;
                case "bit":
                    this.generateBit(ctx);
                    break;
                case "string":
                    this.generateString(ctx);
                    break;
                case "buffer":
                    this.generateBuffer(ctx);
                    break;
                case "seek":
                    this.generateSeek(ctx);
                    break;
                case "nest":
                    this.generateNest(ctx);
                    break;
                case "array":
                    this.generateArray(ctx);
                    break;
                case "choice":
                    this.generateChoice(ctx);
                    break;
                case "pointer":
                    this.generatePointer(ctx);
                    break;
                case "saveOffset":
                    this.generateSaveOffset(ctx);
                    break;
                case "wrapper":
                    this.generateWrapper(ctx);
                    break;
            }
            if (this.type !== "bit")
                this.generateAssert(ctx);
        }
        const varName = ctx.generateVariable(this.varName);
        if (this.options.formatter && this.type !== "bit") {
            this.generateFormatter(ctx, varName, this.options.formatter);
        }
        return this.generateNext(ctx);
    }
    generateAssert(ctx) {
        if (!this.options.assert) {
            return;
        }
        const varName = ctx.generateVariable(this.varName);
        switch (typeof this.options.assert) {
            case "function":
                {
                    const func = ctx.addImport(this.options.assert);
                    ctx.pushCode(`if (!${func}.call(vars, ${varName})) {`);
                }
                break;
            case "number":
                ctx.pushCode(`if (${this.options.assert} !== ${varName}) {`);
                break;
            case "string":
                ctx.pushCode(`if (${JSON.stringify(this.options.assert)} !== ${varName}) {`);
                break;
            default:
                throw new Error("assert option must be a string, number or a function.");
        }
        ctx.generateError(`"Assertion error: ${varName} is " + ${JSON.stringify(this.options.assert.toString())}`);
        ctx.pushCode("}");
    }
    // Recursively call code generators and append results
    generateNext(ctx) {
        if (this.next) {
            ctx = this.next.generate(ctx);
        }
        return ctx;
    }
    generateBit(ctx) {
        // TODO find better method to handle nested bit fields
        const parser = JSON.parse(JSON.stringify(this));
        parser.options = this.options;
        parser.generateAssert = this.generateAssert.bind(this);
        parser.generateFormatter = this.generateFormatter.bind(this);
        parser.varName = ctx.generateVariable(parser.varName);
        ctx.bitFields.push(parser);
        if (!this.next ||
            (this.next && ["bit", "nest"].indexOf(this.next.type) < 0)) {
            const val = ctx.generateTmpVariable();
            ctx.pushCode(`var ${val} = 0;`);
            const getMaxBits = (from = 0) => {
                let sum = 0;
                for (let i = from; i < ctx.bitFields.length; i++) {
                    const length = ctx.bitFields[i].options.length;
                    if (sum + length > 32)
                        break;
                    sum += length;
                }
                return sum;
            };
            const getBytes = (sum) => {
                if (sum <= 8) {
                    ctx.pushCode(`${val} = dataView.getUint8(offset);`);
                    sum = 8;
                }
                else if (sum <= 16) {
                    ctx.pushCode(`${val} = dataView.getUint16(offset);`);
                    sum = 16;
                }
                else if (sum <= 24) {
                    ctx.pushCode(`${val} = (dataView.getUint16(offset) << 8) | dataView.getUint8(offset + 2);`);
                    sum = 24;
                }
                else {
                    ctx.pushCode(`${val} = dataView.getUint32(offset);`);
                    sum = 32;
                }
                ctx.pushCode(`offset += ${sum / 8};`);
                return sum;
            };
            let bitOffset = 0;
            const isBigEndian = this.endian === "be";
            let sum = 0;
            let rem = 0;
            ctx.bitFields.forEach((parser, i) => {
                let length = parser.options.length;
                if (length > rem) {
                    if (rem) {
                        const mask = -1 >>> (32 - rem);
                        ctx.pushCode(`${parser.varName} = (${val} & 0x${mask.toString(16)}) << ${length - rem};`);
                        length -= rem;
                    }
                    bitOffset = 0;
                    rem = sum = getBytes(getMaxBits(i) - rem);
                }
                const offset = isBigEndian ? sum - bitOffset - length : bitOffset;
                const mask = -1 >>> (32 - length);
                ctx.pushCode(`${parser.varName} ${length < parser.options.length ? "|=" : "="} ${val} >> ${offset} & 0x${mask.toString(16)};`);
                // Ensure value is unsigned
                if (parser.options.length === 32) {
                    ctx.pushCode(`${parser.varName} >>>= 0`);
                }
                if (parser.options.assert) {
                    parser.generateAssert(ctx);
                }
                if (parser.options.formatter) {
                    parser.generateFormatter(ctx, parser.varName, parser.options.formatter);
                }
                bitOffset += length;
                rem -= length;
            });
            ctx.bitFields = [];
        }
    }
    generateSeek(ctx) {
        const length = ctx.generateOption(this.options.length);
        ctx.pushCode(`offset += ${length};`);
    }
    generateString(ctx) {
        const name = ctx.generateVariable(this.varName);
        const start = ctx.generateTmpVariable();
        const encoding = this.options.encoding;
        const isHex = encoding.toLowerCase() === "hex";
        const toHex = 'b => b.toString(16).padStart(2, "0")';
        if (this.options.length && this.options.zeroTerminated) {
            const len = this.options.length;
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`while(dataView.getUint8(offset++) !== 0 && offset - ${start} < ${len});`);
            const end = `offset - ${start} < ${len} ? offset - 1 : offset`;
            ctx.pushCode(isHex
                ? `${name} = Array.from(buffer.subarray(${start}, ${end}), ${toHex}).join('');`
                : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, ${end}));`);
        }
        else if (this.options.length) {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(isHex
                ? `${name} = Array.from(buffer.subarray(offset, offset + ${len}), ${toHex}).join('');`
                : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(offset, offset + ${len}));`);
            ctx.pushCode(`offset += ${len};`);
        }
        else if (this.options.zeroTerminated) {
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode("while(dataView.getUint8(offset++) !== 0);");
            ctx.pushCode(isHex
                ? `${name} = Array.from(buffer.subarray(${start}, offset - 1), ${toHex}).join('');`
                : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset - 1));`);
        }
        else if (this.options.greedy) {
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode("while(buffer.length > offset++);");
            ctx.pushCode(isHex
                ? `${name} = Array.from(buffer.subarray(${start}, offset), ${toHex}).join('');`
                : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset));`);
        }
        if (this.options.stripNull) {
            ctx.pushCode(`${name} = ${name}.replace(/\\x00+$/g, '')`);
        }
    }
    generateBuffer(ctx) {
        const varName = ctx.generateVariable(this.varName);
        if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const start = ctx.generateTmpVariable();
            const cur = ctx.generateTmpVariable();
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`var ${cur} = 0;`);
            ctx.pushCode(`while (offset < buffer.length) {`);
            ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
            const func = ctx.addImport(pred);
            ctx.pushCode(`if (${func}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`);
            ctx.pushCode(`offset += 1;`);
            ctx.pushCode(`}`);
            ctx.pushCode(`${varName} = buffer.subarray(${start}, offset);`);
        }
        else if (this.options.readUntil === "eof") {
            ctx.pushCode(`${varName} = buffer.subarray(offset);`);
        }
        else {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(`${varName} = buffer.subarray(offset, offset + ${len});`);
            ctx.pushCode(`offset += ${len};`);
        }
        if (this.options.clone) {
            ctx.pushCode(`${varName} = buffer.constructor.from(${varName});`);
        }
    }
    generateArray(ctx) {
        const length = ctx.generateOption(this.options.length);
        const lengthInBytes = ctx.generateOption(this.options.lengthInBytes);
        const type = this.options.type;
        const counter = ctx.generateTmpVariable();
        const lhs = ctx.generateVariable(this.varName);
        const item = ctx.generateTmpVariable();
        const key = this.options.key;
        const isHash = typeof key === "string";
        if (isHash) {
            ctx.pushCode(`${lhs} = {};`);
        }
        else {
            ctx.pushCode(`${lhs} = [];`);
        }
        if (typeof this.options.readUntil === "function") {
            ctx.pushCode("do {");
        }
        else if (this.options.readUntil === "eof") {
            ctx.pushCode(`for (var ${counter} = 0; offset < buffer.length; ${counter}++) {`);
        }
        else if (lengthInBytes !== undefined) {
            ctx.pushCode(`for (var ${counter} = offset + ${lengthInBytes}; offset < ${counter}; ) {`);
        }
        else {
            ctx.pushCode(`for (var ${counter} = ${length}; ${counter} > 0; ${counter}--) {`);
        }
        if (typeof type === "string") {
            if (!aliasRegistry.get(type)) {
                const typeName = PRIMITIVE_NAMES[type];
                const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                ctx.pushCode(`var ${item} = dataView.get${typeName}(offset, ${littleEndian});`);
                ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
            }
            else {
                const tempVar = ctx.generateTmpVariable();
                ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`);
                if (ctx.useContextVariables) {
                    const parentVar = ctx.generateVariable();
                    ctx.pushCode(`$parent: ${parentVar},`);
                    ctx.pushCode(`$root: ${parentVar}.$root,`);
                    if (!this.options.readUntil && lengthInBytes === undefined) {
                        ctx.pushCode(`$index: ${length} - ${counter},`);
                    }
                }
                ctx.pushCode(`});`);
                ctx.pushCode(`var ${item} = ${tempVar}.result; offset = ${tempVar}.offset;`);
                if (type !== this.alias)
                    ctx.addReference(type);
            }
        }
        else if (type instanceof Parser) {
            ctx.pushCode(`var ${item} = {};`);
            const parentVar = ctx.generateVariable();
            ctx.pushScope(item);
            if (ctx.useContextVariables) {
                ctx.pushCode(`${item}.$parent = ${parentVar};`);
                ctx.pushCode(`${item}.$root = ${parentVar}.$root;`);
                if (!this.options.readUntil && lengthInBytes === undefined) {
                    ctx.pushCode(`${item}.$index = ${length} - ${counter};`);
                }
            }
            type.generate(ctx);
            if (ctx.useContextVariables) {
                ctx.pushCode(`delete ${item}.$parent;`);
                ctx.pushCode(`delete ${item}.$root;`);
                ctx.pushCode(`delete ${item}.$index;`);
            }
            ctx.popScope();
        }
        if (isHash) {
            ctx.pushCode(`${lhs}[${item}.${key}] = ${item};`);
        }
        else {
            ctx.pushCode(`${lhs}.push(${item});`);
        }
        ctx.pushCode("}");
        if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const func = ctx.addImport(pred);
            ctx.pushCode(`while (!${func}.call(${ctx.generateVariable()}, ${item}, buffer.subarray(offset)));`);
        }
    }
    generateChoiceCase(ctx, varName, type) {
        if (typeof type === "string") {
            const varName = ctx.generateVariable(this.varName);
            if (!aliasRegistry.has(type)) {
                const typeName = PRIMITIVE_NAMES[type];
                const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                ctx.pushCode(`${varName} = dataView.get${typeName}(offset, ${littleEndian});`);
                ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]}`);
            }
            else {
                const tempVar = ctx.generateTmpVariable();
                ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`);
                if (ctx.useContextVariables) {
                    ctx.pushCode(`$parent: ${varName}.$parent,`);
                    ctx.pushCode(`$root: ${varName}.$root,`);
                }
                ctx.pushCode(`});`);
                ctx.pushCode(`${varName} = ${tempVar}.result; offset = ${tempVar}.offset;`);
                if (type !== this.alias)
                    ctx.addReference(type);
            }
        }
        else if (type instanceof Parser) {
            ctx.pushPath(varName);
            type.generate(ctx);
            ctx.popPath(varName);
        }
    }
    generateChoice(ctx) {
        const tag = ctx.generateOption(this.options.tag);
        const nestVar = ctx.generateVariable(this.varName);
        if (this.varName) {
            ctx.pushCode(`${nestVar} = {};`);
            if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
                ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
            }
        }
        ctx.pushCode(`switch(${tag}) {`);
        for (const tagString in this.options.choices) {
            const tag = parseInt(tagString, 10);
            const type = this.options.choices[tag];
            ctx.pushCode(`case ${tag}:`);
            this.generateChoiceCase(ctx, this.varName, type);
            ctx.pushCode("break;");
        }
        ctx.pushCode("default:");
        if (this.options.defaultChoice) {
            this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice);
        }
        else {
            ctx.generateError(`"Met undefined tag value " + ${tag} + " at choice"`);
        }
        ctx.pushCode("}");
        if (this.varName && ctx.useContextVariables) {
            ctx.pushCode(`delete ${nestVar}.$parent;`);
            ctx.pushCode(`delete ${nestVar}.$root;`);
        }
    }
    generateNest(ctx) {
        const nestVar = ctx.generateVariable(this.varName);
        if (this.options.type instanceof Parser) {
            if (this.varName) {
                ctx.pushCode(`${nestVar} = {};`);
                if (ctx.useContextVariables) {
                    const parentVar = ctx.generateVariable();
                    ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
                    ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
                }
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
            if (this.varName && ctx.useContextVariables) {
                if (ctx.useContextVariables) {
                    ctx.pushCode(`delete ${nestVar}.$parent;`);
                    ctx.pushCode(`delete ${nestVar}.$root;`);
                }
            }
        }
        else if (aliasRegistry.has(this.options.type)) {
            const tempVar = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(offset, {`);
            if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`$parent: ${parentVar},`);
                ctx.pushCode(`$root: ${parentVar}.$root,`);
            }
            ctx.pushCode(`});`);
            ctx.pushCode(`${nestVar} = ${tempVar}.result; offset = ${tempVar}.offset;`);
            if (this.options.type !== this.alias) {
                ctx.addReference(this.options.type);
            }
        }
    }
    generateWrapper(ctx) {
        const wrapperVar = ctx.generateVariable(this.varName);
        const wrappedBuf = ctx.generateTmpVariable();
        if (typeof this.options.readUntil === "function") {
            const pred = this.options.readUntil;
            const start = ctx.generateTmpVariable();
            const cur = ctx.generateTmpVariable();
            ctx.pushCode(`var ${start} = offset;`);
            ctx.pushCode(`var ${cur} = 0;`);
            ctx.pushCode(`while (offset < buffer.length) {`);
            ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
            const func = ctx.addImport(pred);
            ctx.pushCode(`if (${func}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`);
            ctx.pushCode(`offset += 1;`);
            ctx.pushCode(`}`);
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(${start}, offset);`);
        }
        else if (this.options.readUntil === "eof") {
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset);`);
        }
        else {
            const len = ctx.generateOption(this.options.length);
            ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset, offset + ${len});`);
            ctx.pushCode(`offset += ${len};`);
        }
        if (this.options.clone) {
            ctx.pushCode(`${wrappedBuf} = buffer.constructor.from(${wrappedBuf});`);
        }
        const tempBuf = ctx.generateTmpVariable();
        const tempOff = ctx.generateTmpVariable();
        const tempView = ctx.generateTmpVariable();
        const func = ctx.addImport(this.options.wrapper);
        ctx.pushCode(`${wrappedBuf} = ${func}.call(this, ${wrappedBuf}).subarray(0);`);
        ctx.pushCode(`var ${tempBuf} = buffer;`);
        ctx.pushCode(`var ${tempOff} = offset;`);
        ctx.pushCode(`var ${tempView} = dataView;`);
        ctx.pushCode(`buffer = ${wrappedBuf};`);
        ctx.pushCode(`offset = 0;`);
        ctx.pushCode(`dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);`);
        if (this.options.type instanceof Parser) {
            if (this.varName) {
                ctx.pushCode(`${wrapperVar} = {};`);
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
        }
        else if (aliasRegistry.has(this.options.type)) {
            const tempVar = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(0);`);
            ctx.pushCode(`${wrapperVar} = ${tempVar}.result;`);
            if (this.options.type !== this.alias) {
                ctx.addReference(this.options.type);
            }
        }
        ctx.pushCode(`buffer = ${tempBuf};`);
        ctx.pushCode(`dataView = ${tempView};`);
        ctx.pushCode(`offset = ${tempOff};`);
    }
    generateFormatter(ctx, varName, formatter) {
        if (typeof formatter === "function") {
            const func = ctx.addImport(formatter);
            ctx.pushCode(`${varName} = ${func}.call(${ctx.generateVariable()}, ${varName});`);
        }
    }
    generatePointer(ctx) {
        const type = this.options.type;
        const offset = ctx.generateOption(this.options.offset);
        const tempVar = ctx.generateTmpVariable();
        const nestVar = ctx.generateVariable(this.varName);
        // Save current offset
        ctx.pushCode(`var ${tempVar} = offset;`);
        // Move offset
        ctx.pushCode(`offset = ${offset};`);
        if (this.options.type instanceof Parser) {
            ctx.pushCode(`${nestVar} = {};`);
            if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`${nestVar}.$parent = ${parentVar};`);
                ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
            }
            ctx.pushPath(this.varName);
            this.options.type.generate(ctx);
            ctx.popPath(this.varName);
            if (ctx.useContextVariables) {
                ctx.pushCode(`delete ${nestVar}.$parent;`);
                ctx.pushCode(`delete ${nestVar}.$root;`);
            }
        }
        else if (aliasRegistry.has(this.options.type)) {
            const tempVar = ctx.generateTmpVariable();
            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(offset, {`);
            if (ctx.useContextVariables) {
                const parentVar = ctx.generateVariable();
                ctx.pushCode(`$parent: ${parentVar},`);
                ctx.pushCode(`$root: ${parentVar}.$root,`);
            }
            ctx.pushCode(`});`);
            ctx.pushCode(`${nestVar} = ${tempVar}.result; offset = ${tempVar}.offset;`);
            if (this.options.type !== this.alias) {
                ctx.addReference(this.options.type);
            }
        }
        else if (Object.keys(PRIMITIVE_SIZES).indexOf(this.options.type) >= 0) {
            const typeName = PRIMITIVE_NAMES[type];
            const littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
            ctx.pushCode(`${nestVar} = dataView.get${typeName}(offset, ${littleEndian});`);
            ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
        }
        // Restore offset
        ctx.pushCode(`offset = ${tempVar};`);
    }
    generateSaveOffset(ctx) {
        const varName = ctx.generateVariable(this.varName);
        ctx.pushCode(`${varName} = offset`);
    }
}
//# sourceMappingURL=binary_parser.js.map

/***/ })

}]);