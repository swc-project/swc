(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        390
    ],
    {
        9996: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            function _typeof(obj) {
                return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            var Buffer = __webpack_require__(1876).Buffer, vm = __webpack_require__(22), Context = __webpack_require__(2961)._, Long = __webpack_require__(3720);
            "undefined" != typeof window && (window.Buffer = Buffer), "undefined" != typeof self && (self.Buffer = Buffer);
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
                Int64: 8
            }, aliasRegistry = {}, FUNCTION_PREFIX = "___parser_", BIT_RANGE = [];
            !function() {
                var i;
                for(i = 1; i <= 32; i++)BIT_RANGE.push(i);
            }();
            var NAME_MAP = {};
            Object.keys(PRIMITIVE_TYPES).concat([
                "String",
                "Buffer",
                "Array",
                "Skip",
                "Choice",
                "Nest",
                "Bit",
                "Itf8",
                "Ltf8"
            ]).forEach(function(type) {
                NAME_MAP[type.toLowerCase()] = type;
            });
            var Parser = function() {
                this.varName = "", this.type = "", this.options = {}, this.next = null, this.head = null, this.compiled = null, this.endian = "le", this.constructorFn = null, this.alias = null;
            };
            Parser.start = function() {
                return new Parser();
            }, Object.keys(PRIMITIVE_TYPES).forEach(function(type) {
                Parser.prototype[type.toLowerCase()] = function(varName, options) {
                    return this.setNextParser(type.toLowerCase(), varName, options);
                };
                var typeWithoutEndian = type.replace(/BE|LE/, "").toLowerCase();
                typeWithoutEndian in Parser.prototype || (Parser.prototype[typeWithoutEndian] = function(varName, options) {
                    return this[typeWithoutEndian + this.endian](varName, options);
                });
            }), BIT_RANGE.forEach(function(i) {
                Parser.prototype["bit".concat(i.toString())] = function(varName, options) {
                    return options || (options = {}), options.length = i, this.setNextParser("bit", varName, options);
                };
            }), Parser.prototype.namely = function(alias) {
                return aliasRegistry[alias] = this, this.alias = alias, this;
            }, Parser.prototype.skip = function(length, options) {
                if (options && options.assert) throw Error("assert option on skip is not allowed.");
                return this.setNextParser("skip", "", {
                    length: length
                });
            }, Parser.prototype.string = function(varName, options) {
                if (!options.zeroTerminated && !options.length && !options.greedy) throw Error("Neither length, zeroTerminated, nor greedy is defined for string.");
                if ((options.zeroTerminated || options.length) && options.greedy) throw Error("greedy is mutually exclusive with length and zeroTerminated for string.");
                if (options.stripNull && !(options.length || options.greedy)) throw Error("Length or greedy must be defined if stripNull is defined.");
                return options.encoding = options.encoding || "utf8", this.setNextParser("string", varName, options);
            }, Parser.prototype.buffer = function(varName, options) {
                if (!options.length && !options.readUntil) throw Error("Length nor readUntil is defined in buffer parser");
                return this.setNextParser("buffer", varName, options);
            }, Parser.prototype.array = function(varName, options) {
                if (!options.readUntil && !options.length && !options.lengthInBytes) throw Error("Length option of array is not defined.");
                if (!options.type) throw Error("Type option of array is not defined.");
                if ("string" == typeof options.type && !aliasRegistry[options.type] && 0 > Object.keys(PRIMITIVE_TYPES).indexOf(NAME_MAP[options.type])) throw Error("Specified primitive type \"".concat(options.type, "\" is not supported."));
                return this.setNextParser("array", varName, options);
            }, Parser.prototype.choice = function(varName, options) {
                if (1 == arguments.length && "object" === _typeof(varName) && (options = varName, varName = null), !options.tag) throw Error("Tag option of array is not defined.");
                if (!options.choices) throw Error("Choices option of array is not defined.");
                return Object.keys(options.choices).forEach(function(key) {
                    if (!options.choices[key]) throw Error("Choice Case ".concat(key, " of ").concat(varName, " is not valid."));
                    if ("string" == typeof options.choices[key] && !aliasRegistry[options.choices[key]] && 0 > Object.keys(PRIMITIVE_TYPES).indexOf(NAME_MAP[options.choices[key]])) throw Error("Specified primitive type \"".concat(options.choices[key], "\" is not supported."));
                }, this), this.setNextParser("choice", varName, options);
            }, Parser.prototype.nest = function(varName, options) {
                if (1 == arguments.length && "object" === _typeof(varName) && (options = varName, varName = null), !options.type) throw Error("Type option of nest is not defined.");
                if (!(options.type instanceof Parser) && !aliasRegistry[options.type]) throw Error("Type option of nest must be a Parser object.");
                if (!(options.type instanceof Parser) && !varName) throw Error("options.type must be a object if variable name is omitted.");
                return this.setNextParser("nest", varName, options);
            }, Parser.prototype.endianess = function(endianess) {
                switch(endianess.toLowerCase()){
                    case "little":
                        this.endian = "le";
                        break;
                    case "big":
                        this.endian = "be";
                        break;
                    default:
                        throw Error("Invalid endianess: ".concat(endianess));
                }
                return this;
            }, Parser.prototype.create = function(constructorFn) {
                if (!(constructorFn instanceof Function)) throw Error("Constructor must be a Function object.");
                return this.constructorFn = constructorFn, this;
            }, Parser.prototype.getCode = function() {
                var ctx = new Context();
                return ctx.pushCode("if (!Buffer.isBuffer(buffer)) {"), ctx.generateError('"argument buffer is not a Buffer object"'), ctx.pushCode("}"), this.alias ? this.addAliasedCode(ctx) : this.addRawCode(ctx), this.alias ? ctx.pushCode("return {0}(0)", FUNCTION_PREFIX + this.alias) : ctx.pushCode("return { offset: offset, result: vars };"), ctx.code;
            }, Parser.prototype.addRawCode = function(ctx) {
                ctx.pushCode("var offset = 0;"), this.constructorFn ? ctx.pushCode("var vars = new constructorFn();") : ctx.pushCode("var vars = {};"), this.generate(ctx), this.resolveReferences(ctx), ctx.pushCode("return { offset: offset, result: vars };");
            }, Parser.prototype.addAliasedCode = function(ctx) {
                return ctx.pushCode("function {0}(offset) {", FUNCTION_PREFIX + this.alias), this.constructorFn ? ctx.pushCode("var vars = new constructorFn();") : ctx.pushCode("var vars = {};"), this.generate(ctx), ctx.markResolved(this.alias), this.resolveReferences(ctx), ctx.pushCode("return { offset: offset, result: vars };"), ctx.pushCode("}"), ctx;
            }, Parser.prototype.resolveReferences = function(ctx) {
                var references = ctx.getUnresolvedReferences();
                ctx.markRequested(references), references.forEach(function(alias) {
                    aliasRegistry[alias].addAliasedCode(ctx);
                });
            }, Parser.prototype.compile = function() {
                var src = "(function(buffer, constructorFn, Long) { ".concat(this.getCode(), " })");
                this.compiled = vm.runInThisContext(src);
            }, Parser.prototype.sizeOf = function() {
                var size = NaN;
                if (Object.keys(PRIMITIVE_TYPES).indexOf(this.type) >= 0) size = PRIMITIVE_TYPES[this.type];
                else if ("String" === this.type && "number" == typeof this.options.length) size = this.options.length;
                else if ("Buffer" === this.type && "number" == typeof this.options.length) size = this.options.length;
                else if ("Array" === this.type && "number" == typeof this.options.length) {
                    var elementSize = NaN;
                    "string" == typeof this.options.type ? elementSize = PRIMITIVE_TYPES[NAME_MAP[this.options.type]] : this.options.type instanceof Parser && (elementSize = this.options.type.sizeOf()), size = this.options.length * elementSize;
                } else "Skip" === this.type ? size = this.options.length : "Nest" === this.type ? size = this.options.type.sizeOf() : this.type || (size = 0);
                return this.next && (size += this.next.sizeOf()), size;
            }, Parser.prototype.parse = function(buffer) {
                return this.compiled || this.compile(), this.compiled(buffer, this.constructorFn, Long);
            }, Parser.prototype.setNextParser = function(type, varName, options) {
                var parser = new Parser();
                return parser.type = NAME_MAP[type], parser.varName = varName, parser.options = options || parser.options, parser.endian = this.endian, this.head ? this.head.next = parser : this.next = parser, this.head = parser, this;
            }, Parser.prototype.generate = function(ctx) {
                this.type && (this["generate".concat(this.type)](ctx), this.generateAssert(ctx));
                var varName = ctx.generateVariable(this.varName);
                return this.options.formatter && this.generateFormatter(ctx, varName, this.options.formatter), this.generateNext(ctx);
            }, Parser.prototype.generateAssert = function(ctx) {
                if (this.options.assert) {
                    var varName = ctx.generateVariable(this.varName);
                    switch(_typeof(this.options.assert)){
                        case "function":
                            ctx.pushCode("if (!({0}).call(vars, {1})) {", this.options.assert, varName);
                            break;
                        case "number":
                            ctx.pushCode("if ({0} !== {1}) {", this.options.assert, varName);
                            break;
                        case "string":
                            ctx.pushCode('if ("{0}" !== {1}) {', this.options.assert, varName);
                            break;
                        default:
                            throw Error("Assert option supports only strings, numbers and assert functions.");
                    }
                    ctx.generateError('"Assert error: {0} is " + {0}', varName), ctx.pushCode("}");
                }
            }, Parser.prototype.generateNext = function(ctx) {
                return this.next && (ctx = this.next.generate(ctx)), ctx;
            }, Object.keys(PRIMITIVE_TYPES).forEach(function(type) {
                Parser.prototype["generate".concat(type)] = function(ctx) {
                    "UInt64" === type ? ctx.pushCode("{0} = Long.fromBytes(buffer.slice(offset,offset+8), true, this.endian === 'le').toNumber();", ctx.generateVariable(this.varName), type) : "Int64" === type ? ctx.pushCode("{0} = Long.fromBytes(buffer.slice(offset,offset+8), false, this.endian === 'le').toNumber();", ctx.generateVariable(this.varName), type) : ctx.pushCode("{0} = buffer.read{1}(offset);", ctx.generateVariable(this.varName), type), ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[type]);
                };
            }), Parser.prototype.generateBit = function(ctx) {
                var parser = JSON.parse(JSON.stringify(this));
                if (parser.varName = ctx.generateVariable(parser.varName), ctx.bitFields.push(parser), !this.next || this.next && 0 > [
                    "Bit",
                    "Nest"
                ].indexOf(this.next.type)) {
                    var sum = 0;
                    ctx.bitFields.forEach(function(p) {
                        sum += p.options.length;
                    });
                    var val = ctx.generateTmpVariable();
                    if (sum <= 8) ctx.pushCode("var {0} = buffer.readUInt8(offset);", val), sum = 8;
                    else if (sum <= 16) ctx.pushCode("var {0} = buffer.readUInt16BE(offset);", val), sum = 16;
                    else if (sum <= 24) {
                        var val1 = ctx.generateTmpVariable(), val2 = ctx.generateTmpVariable();
                        ctx.pushCode("var {0} = buffer.readUInt16BE(offset);", val1), ctx.pushCode("var {0} = buffer.readUInt8(offset + 2);", val2), ctx.pushCode("var {2} = ({0} << 8) | {1};", val1, val2, val), sum = 24;
                    } else if (sum <= 32) ctx.pushCode("var {0} = buffer.readUInt32BE(offset);", val), sum = 32;
                    else throw Error("Currently, bit field sequence longer than 4-bytes is not supported.");
                    ctx.pushCode("offset += {0};", sum / 8);
                    var bitOffset = 0, isBigEndian = "be" === this.endian;
                    ctx.bitFields.forEach(function(p) {
                        ctx.pushCode("{0} = {1} >> {2} & {3};", p.varName, val, isBigEndian ? sum - bitOffset - p.options.length : bitOffset, (1 << p.options.length) - 1), bitOffset += p.options.length;
                    }), ctx.bitFields = [];
                }
            }, Parser.prototype.generateSkip = function(ctx) {
                var length = ctx.generateOption(this.options.length);
                ctx.pushCode("offset += {0};", length);
            }, Parser.prototype.generateString = function(ctx) {
                var name = ctx.generateVariable(this.varName), start = ctx.generateTmpVariable();
                this.options.length && this.options.zeroTerminated ? (ctx.pushCode("var {0} = offset;", start), ctx.pushCode("while(buffer.readUInt8(offset++) !== 0 && offset - {0}  < {1});", start, this.options.length), ctx.pushCode("{0} = buffer.toString('{1}', {2}, offset - {2} < {3} ? offset - 1 : offset);", name, this.options.encoding, start, this.options.length)) : this.options.length ? (ctx.pushCode("{0} = buffer.toString('{1}', offset, offset + {2});", name, this.options.encoding, ctx.generateOption(this.options.length)), ctx.pushCode("offset += {0};", ctx.generateOption(this.options.length))) : this.options.zeroTerminated ? (ctx.pushCode("var {0} = offset;", start), ctx.pushCode("while(buffer.readUInt8(offset++) !== 0);"), ctx.pushCode("{0} = buffer.toString('{1}', {2}, offset - 1);", name, this.options.encoding, start)) : this.options.greedy && (ctx.pushCode("var {0} = offset;", start), ctx.pushCode("while(buffer.length > offset++);"), ctx.pushCode("{0} = buffer.toString('{1}', {2}, offset);", name, this.options.encoding, start)), this.options.stripNull && ctx.pushCode("{0} = {0}.replace(/\\x00+$/g, '')", name);
            }, Parser.prototype.generateBuffer = function(ctx) {
                "eof" === this.options.readUntil ? ctx.pushCode("{0} = buffer.slice(offset);", ctx.generateVariable(this.varName)) : (ctx.pushCode("{0} = buffer.slice(offset, offset + {1});", ctx.generateVariable(this.varName), ctx.generateOption(this.options.length)), ctx.pushCode("offset += {0};", ctx.generateOption(this.options.length))), this.options.clone && ctx.pushCode("{0} = Buffer.from({0});", ctx.generateVariable(this.varName));
            }, Parser.prototype.generateArray = function(ctx) {
                var length = ctx.generateOption(this.options.length), lengthInBytes = ctx.generateOption(this.options.lengthInBytes), type = this.options.type, counter = ctx.generateTmpVariable(), lhs = ctx.generateVariable(this.varName), item = ctx.generateTmpVariable(), key = this.options.key, isHash = "string" == typeof key;
                if (isHash ? ctx.pushCode("{0} = {};", lhs) : ctx.pushCode("{0} = [];", lhs), "function" == typeof this.options.readUntil ? ctx.pushCode("do {") : "eof" === this.options.readUntil ? ctx.pushCode("for (var {0} = 0; offset < buffer.length; {0}++) {", counter) : void 0 !== lengthInBytes ? ctx.pushCode("for (var {0} = offset; offset - {0} < {1}; ) {", counter, lengthInBytes) : ctx.pushCode("for (var {0} = 0; {0} < {1}; {0}++) {", counter, length), "string" == typeof type) {
                    if (aliasRegistry[type]) {
                        var tempVar = ctx.generateTmpVariable();
                        ctx.pushCode("var {0} = {1}(offset);", tempVar, FUNCTION_PREFIX + type), ctx.pushCode("var {0} = {1}.result; offset = {1}.offset;", item, tempVar), type !== this.alias && ctx.addReference(type);
                    } else ctx.pushCode("var {0} = buffer.read{1}(offset);", item, NAME_MAP[type]), ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[NAME_MAP[type]]);
                } else type instanceof Parser && (ctx.pushCode("var {0} = {};", item), ctx.pushScope(item), type.generate(ctx), ctx.popScope());
                isHash ? ctx.pushCode("{0}[{2}.{1}] = {2};", lhs, key, item) : ctx.pushCode("{0}.push({1});", lhs, item), ctx.pushCode("}"), "function" == typeof this.options.readUntil && ctx.pushCode(" while (!({0}).call(this, {1}, buffer.slice(offset)));", this.options.readUntil, item);
            }, Parser.prototype.generateChoiceCase = function(ctx, varName, type) {
                if ("string" == typeof type) {
                    if (aliasRegistry[type]) {
                        var tempVar = ctx.generateTmpVariable();
                        ctx.pushCode("var {0} = {1}(offset);", tempVar, FUNCTION_PREFIX + type), ctx.pushCode("{0} = {1}.result; offset = {1}.offset;", ctx.generateVariable(this.varName), tempVar), type !== this.alias && ctx.addReference(type);
                    } else ctx.pushCode("{0} = buffer.read{1}(offset);", ctx.generateVariable(this.varName), NAME_MAP[type]), ctx.pushCode("offset += {0};", PRIMITIVE_TYPES[NAME_MAP[type]]);
                } else type instanceof Parser && (ctx.pushPath(varName), type.generate(ctx), ctx.popPath(varName));
            }, Parser.prototype.generateChoice = function(ctx) {
                var tag = ctx.generateOption(this.options.tag);
                this.varName && ctx.pushCode("{0} = {};", ctx.generateVariable(this.varName)), ctx.pushCode("switch({0}) {", tag), Object.keys(this.options.choices).forEach(function(t) {
                    var type = this.options.choices[t];
                    Number.isNaN(parseInt(t, 10)) ? ctx.pushCode("case '{0}':", t) : ctx.pushCode("case {0}:", t), this.generateChoiceCase(ctx, this.varName, type), ctx.pushCode("break;");
                }, this), ctx.pushCode("default:"), this.options.defaultChoice ? this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice) : ctx.generateError('"Met undefined tag value " + {0} + " at choice"', tag), ctx.pushCode("}");
            }, Parser.prototype.generateNest = function(ctx) {
                var nestVar = ctx.generateVariable(this.varName);
                if (this.options.type instanceof Parser) this.varName && ctx.pushCode("{0} = {};", nestVar), ctx.pushPath(this.varName), this.options.type.generate(ctx), ctx.popPath(this.varName);
                else if (aliasRegistry[this.options.type]) {
                    var tempVar = ctx.generateTmpVariable();
                    ctx.pushCode("var {0} = {1}(offset);", tempVar, FUNCTION_PREFIX + this.options.type), ctx.pushCode("{0} = {1}.result; offset = {1}.offset;", nestVar, tempVar), this.options.type !== this.alias && ctx.addReference(this.options.type);
                }
            }, Parser.prototype.generateFormatter = function(ctx, varName, formatter) {
                "function" == typeof formatter && ctx.pushCode("{0} = ({1}).call(this, {0});", varName, formatter);
            }, Parser.prototype.isInteger = function() {
                return !!this.type.match(/U?Int[8|16|32][BE|LE]?|Bit\d+/);
            }, Parser.prototype.itf8 = function(varName, options) {
                return this.setNextParser("itf8", varName, options);
            }, Parser.prototype.itf8 = function(varName, options) {
                return this.setNextParser("itf8", varName, options);
            }, Parser.prototype.generateItf8 = function(ctx) {
                var name = ctx.generateVariable(this.varName), countFlags = ctx.generateTmpVariable();
                ctx.pushCode("\n    var ".concat(countFlags, " = buffer[offset];\n    if (").concat(countFlags, " < 0x80) {\n      ").concat(name, " = ").concat(countFlags, ";\n      offset += 1;\n    } else if (").concat(countFlags, " < 0xc0) {\n      ").concat(name, " = ((").concat(countFlags, "<<8) | buffer[offset+1]) & 0x3fff;\n      offset += 2;\n    } else if (").concat(countFlags, " < 0xe0) {\n      ").concat(name, " = ((").concat(countFlags, "<<16) | (buffer[offset+1]<< 8) |  buffer[offset+2]) & 0x1fffff;\n      offset += 3;\n    } else if (").concat(countFlags, " < 0xf0) {\n      ").concat(name, " = ((").concat(countFlags, "<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;\n      offset += 4\n    } else {\n      ").concat(name, " = ((").concat(countFlags, " & 0x0f)<<28) | (buffer[offset+1]<<20) | (buffer[offset+2]<<12) | (buffer[offset+3]<<4) | (buffer[offset+4] & 0x0f);\n      // x=((0xff & 0x0f)<<28) | (0xff<<20) | (0xff<<12) | (0xff<<4) | (0x0f & 0x0f);\n      // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;\n      offset += 5\n    }\n  "));
            }, Parser.prototype.ltf8 = function(varName, options) {
                return this.setNextParser("ltf8", varName, options);
            }, Parser.prototype.generateLtf8 = function(ctx) {
                var name = ctx.generateVariable(this.varName), countFlags = ctx.generateTmpVariable();
                ctx.pushCode("\n  var ".concat(countFlags, " = buffer[offset];\n  if (").concat(countFlags, " < 0x80) {\n    ").concat(name, " = ").concat(countFlags, ";\n    offset += 1;\n  } else if (").concat(countFlags, " < 0xc0) {\n    ").concat(name, " = ((buffer[offset]<<8) | buffer[offset+1]) & 0x3fff;\n    offset += 2;\n  } else if (").concat(countFlags, " < 0xe0) {\n    ").concat(name, " = ((buffer[offset]<<16) | (buffer[offset+1]<<8) | buffer[offset+2]) & 0x1fffff;\n    ").concat(name, " = (((").concat(countFlags, " & 63) << 16) | buffer.readUInt16LE(offset + 1));\n    offset += 3;\n  } else if (").concat(countFlags, " < 0xf0) {\n    ").concat(name, " = ((buffer[offset]<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;\n    offset += 4;\n  } else if (").concat(countFlags, " < 0xf8) {\n    ").concat(name, " = (((buffer[offset] & 15) * Math.pow(2,32))) +\n      (buffer[offset+1]<<24) | (buffer[offset+2]<<16 | buffer[offset+3]<<8 | buffer[offset+4])\n    // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;\n    offset += 5;\n  } else if (").concat(countFlags, " < 0xfc) {\n    ").concat(name, " = ((((buffer[offset] & 7) << 8) | buffer[offset+1] )) * Math.pow(2,32) +\n      (buffer[offset+2]<<24) | (buffer[offset+3]<<16 | buffer[offset+4]<<8 | buffer[offset+5])\n    offset += 6;\n  } else if (").concat(countFlags, " < 0xfe) {\n    ").concat(name, " = ((((buffer[offset] & 3) << 16) | buffer[offset+1]<<8 | buffer[offset+2])) * Math.pow(2,32) +\n      (buffer[offset+3]<<24) | (buffer[offset+4]<<16 | buffer[offset+5]<<8 | buffer[offset+6])\n    offset += 7;\n  } else if (").concat(countFlags, " < 0xff) {\n    ").concat(name, " = Long.fromBytesBE(buffer.slice(offset+1,offset+8));\n    if (").concat(name, ".greaterThan(Number.MAX_SAFE_INTEGER) || ").concat(name, ".lessThan(Number.MIN_SAFE_INTEGER))\n      throw new Error('integer overflow')\n    ").concat(name, " = ").concat(name, ".toNumber()\n    offset += 8;\n  } else {\n    ").concat(name, " = Long.fromBytesBE(buffer.slice(offset+1,offset+9));\n    if (").concat(name, ".greaterThan(Number.MAX_SAFE_INTEGER) || ").concat(name, ".lessThan(Number.MIN_SAFE_INTEGER))\n      throw new Error('integer overflow')\n    ").concat(name, " = ").concat(name, ".toNumber()\n    offset += 9;\n  }\n  "));
            }, exports._ = Parser;
        },
        2961: function(__unused_webpack_module, exports) {
            "use strict";
            function _typeof(obj) {
                return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            var Context = function() {
                this.code = "", this.scopes = [
                    [
                        "vars"
                    ]
                ], this.isAsync = !1, this.bitFields = [], this.tmpVariableCount = 0, this.references = {};
            };
            Context.prototype.generateVariable = function(name) {
                var arr = [];
                for(Array.prototype.push.apply(arr, this.scopes[this.scopes.length - 1]); /^\$parent\./.test(name);)arr.pop(), name = name.replace(/^\$parent\./, "");
                return name && arr.push(name), arr.join(".");
            }, Context.prototype.generateOption = function(val) {
                switch(_typeof(val)){
                    case "number":
                        return val.toString();
                    case "string":
                        return this.generateVariable(val);
                    case "function":
                        return "(".concat(val, ").call(").concat(this.generateVariable(), ", vars)");
                    default:
                        return;
                }
            }, Context.prototype.generateError = function() {
                var args = Array.prototype.slice.call(arguments), err = Context.interpolate.apply(this, args);
                this.isAsync ? this.pushCode("return process.nextTick(function() { callback(new Error(".concat(err, "), vars); });")) : this.pushCode("throw new Error(".concat(err, ");"));
            }, Context.prototype.generateTmpVariable = function() {
                return "$tmp".concat(this.tmpVariableCount++);
            }, Context.prototype.pushCode = function() {
                var args = Array.prototype.slice.call(arguments);
                this.code += "".concat(Context.interpolate.apply(this, args), "\n");
            }, Context.prototype.pushPath = function(name) {
                name && this.scopes[this.scopes.length - 1].push(name);
            }, Context.prototype.popPath = function(name) {
                name && this.scopes[this.scopes.length - 1].pop();
            }, Context.prototype.pushScope = function(name) {
                this.scopes.push([
                    name
                ]);
            }, Context.prototype.popScope = function() {
                this.scopes.pop();
            }, Context.prototype.addReference = function(alias) {
                this.references[alias] || (this.references[alias] = {
                    resolved: !1,
                    requested: !1
                });
            }, Context.prototype.markResolved = function(alias) {
                this.references[alias].resolved = !0;
            }, Context.prototype.markRequested = function(aliasList) {
                aliasList.forEach((function(alias) {
                    this.references[alias].requested = !0;
                }).bind(this));
            }, Context.prototype.getUnresolvedReferences = function() {
                var references = this.references;
                return Object.keys(this.references).filter(function(alias) {
                    return !references[alias].resolved && !references[alias].requested;
                });
            }, Context.interpolate = function(s) {
                var matches = s.match(/{\d+}/g), params = Array.prototype.slice.call(arguments, 1);
                return matches && matches.forEach(function(match) {
                    var index = parseInt(match.substr(1, match.length - 2), 10);
                    s = s.replace(match, params[index].toString());
                }), s;
            }, exports._ = Context;
        },
        22: function(module) {
            module.exports.runInThisContext = function(code) {
                const fn = Function('code', 'return eval(code);');
                return fn.call(globalThis, code);
            };
        },
        3720: function(module) {
            module.exports = Long;
            var wasm = null;
            try {
                wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
                    0,
                    97,
                    115,
                    109,
                    1,
                    0,
                    0,
                    0,
                    1,
                    13,
                    2,
                    96,
                    0,
                    1,
                    127,
                    96,
                    4,
                    127,
                    127,
                    127,
                    127,
                    1,
                    127,
                    3,
                    7,
                    6,
                    0,
                    1,
                    1,
                    1,
                    1,
                    1,
                    6,
                    6,
                    1,
                    127,
                    1,
                    65,
                    0,
                    11,
                    7,
                    50,
                    6,
                    3,
                    109,
                    117,
                    108,
                    0,
                    1,
                    5,
                    100,
                    105,
                    118,
                    95,
                    115,
                    0,
                    2,
                    5,
                    100,
                    105,
                    118,
                    95,
                    117,
                    0,
                    3,
                    5,
                    114,
                    101,
                    109,
                    95,
                    115,
                    0,
                    4,
                    5,
                    114,
                    101,
                    109,
                    95,
                    117,
                    0,
                    5,
                    8,
                    103,
                    101,
                    116,
                    95,
                    104,
                    105,
                    103,
                    104,
                    0,
                    0,
                    10,
                    191,
                    1,
                    6,
                    4,
                    0,
                    35,
                    0,
                    11,
                    36,
                    1,
                    1,
                    126,
                    32,
                    0,
                    173,
                    32,
                    1,
                    173,
                    66,
                    32,
                    134,
                    132,
                    32,
                    2,
                    173,
                    32,
                    3,
                    173,
                    66,
                    32,
                    134,
                    132,
                    126,
                    34,
                    4,
                    66,
                    32,
                    135,
                    167,
                    36,
                    0,
                    32,
                    4,
                    167,
                    11,
                    36,
                    1,
                    1,
                    126,
                    32,
                    0,
                    173,
                    32,
                    1,
                    173,
                    66,
                    32,
                    134,
                    132,
                    32,
                    2,
                    173,
                    32,
                    3,
                    173,
                    66,
                    32,
                    134,
                    132,
                    127,
                    34,
                    4,
                    66,
                    32,
                    135,
                    167,
                    36,
                    0,
                    32,
                    4,
                    167,
                    11,
                    36,
                    1,
                    1,
                    126,
                    32,
                    0,
                    173,
                    32,
                    1,
                    173,
                    66,
                    32,
                    134,
                    132,
                    32,
                    2,
                    173,
                    32,
                    3,
                    173,
                    66,
                    32,
                    134,
                    132,
                    128,
                    34,
                    4,
                    66,
                    32,
                    135,
                    167,
                    36,
                    0,
                    32,
                    4,
                    167,
                    11,
                    36,
                    1,
                    1,
                    126,
                    32,
                    0,
                    173,
                    32,
                    1,
                    173,
                    66,
                    32,
                    134,
                    132,
                    32,
                    2,
                    173,
                    32,
                    3,
                    173,
                    66,
                    32,
                    134,
                    132,
                    129,
                    34,
                    4,
                    66,
                    32,
                    135,
                    167,
                    36,
                    0,
                    32,
                    4,
                    167,
                    11,
                    36,
                    1,
                    1,
                    126,
                    32,
                    0,
                    173,
                    32,
                    1,
                    173,
                    66,
                    32,
                    134,
                    132,
                    32,
                    2,
                    173,
                    32,
                    3,
                    173,
                    66,
                    32,
                    134,
                    132,
                    130,
                    34,
                    4,
                    66,
                    32,
                    135,
                    167,
                    36,
                    0,
                    32,
                    4,
                    167,
                    11
                ])), {}).exports;
            } catch (e) {}
            function Long(low, high, unsigned) {
                this.low = 0 | low, this.high = 0 | high, this.unsigned = !!unsigned;
            }
            function isLong(obj) {
                return !0 === (obj && obj.__isLong__);
            }
            Long.prototype.__isLong__, Object.defineProperty(Long.prototype, "__isLong__", {
                value: !0
            }), Long.isLong = isLong;
            var INT_CACHE = {}, UINT_CACHE = {};
            function fromInt(value, unsigned) {
                var obj, cachedObj, cache;
                return unsigned ? (value >>>= 0, (cache = 0 <= value && value < 256) && (cachedObj = UINT_CACHE[value])) ? cachedObj : (obj = fromBits(value, (0 | value) < 0 ? -1 : 0, !0), cache && (UINT_CACHE[value] = obj), obj) : (value |= 0, (cache = -128 <= value && value < 128) && (cachedObj = INT_CACHE[value])) ? cachedObj : (obj = fromBits(value, value < 0 ? -1 : 0, !1), cache && (INT_CACHE[value] = obj), obj);
            }
            function fromNumber(value, unsigned) {
                if (isNaN(value)) return unsigned ? UZERO : ZERO;
                if (unsigned) {
                    if (value < 0) return UZERO;
                    if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
                } else {
                    if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
                    if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
                }
                return value < 0 ? fromNumber(-value, unsigned).neg() : fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
            }
            function fromBits(lowBits, highBits, unsigned) {
                return new Long(lowBits, highBits, unsigned);
            }
            Long.fromInt = fromInt, Long.fromNumber = fromNumber, Long.fromBits = fromBits;
            var pow_dbl = Math.pow;
            function fromString(str, unsigned, radix) {
                if (0 === str.length) throw Error('empty string');
                if ("NaN" === str || "Infinity" === str || "+Infinity" === str || "-Infinity" === str) return ZERO;
                if ('number' == typeof unsigned ? (radix = unsigned, unsigned = !1) : unsigned = !!unsigned, (radix = radix || 10) < 2 || 36 < radix) throw RangeError('radix');
                if ((p = str.indexOf('-')) > 0) throw Error('interior hyphen');
                if (0 === p) return fromString(str.substring(1), unsigned, radix).neg();
                for(var p, radixToPower = fromNumber(pow_dbl(radix, 8)), result = ZERO, i = 0; i < str.length; i += 8){
                    var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
                    if (size < 8) {
                        var power = fromNumber(pow_dbl(radix, size));
                        result = result.mul(power).add(fromNumber(value));
                    } else result = (result = result.mul(radixToPower)).add(fromNumber(value));
                }
                return result.unsigned = unsigned, result;
            }
            function fromValue(val, unsigned) {
                return 'number' == typeof val ? fromNumber(val, unsigned) : 'string' == typeof val ? fromString(val, unsigned) : fromBits(val.low, val.high, 'boolean' == typeof unsigned ? unsigned : val.unsigned);
            }
            Long.fromString = fromString, Long.fromValue = fromValue;
            var TWO_PWR_32_DBL = 4294967296, TWO_PWR_64_DBL = 18446744073709552000, TWO_PWR_63_DBL = 9223372036854776000, TWO_PWR_24 = fromInt(16777216), ZERO = fromInt(0);
            Long.ZERO = ZERO;
            var UZERO = fromInt(0, !0);
            Long.UZERO = UZERO;
            var ONE = fromInt(1);
            Long.ONE = ONE;
            var UONE = fromInt(1, !0);
            Long.UONE = UONE;
            var NEG_ONE = fromInt(-1);
            Long.NEG_ONE = NEG_ONE;
            var MAX_VALUE = fromBits(-1, 2147483647, !1);
            Long.MAX_VALUE = MAX_VALUE;
            var MAX_UNSIGNED_VALUE = fromBits(-1, -1, !0);
            Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
            var MIN_VALUE = fromBits(0, -2147483648, !1);
            Long.MIN_VALUE = MIN_VALUE;
            var LongPrototype = Long.prototype;
            LongPrototype.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low;
            }, LongPrototype.toNumber = function() {
                return this.unsigned ? (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0) : this.high * TWO_PWR_32_DBL + (this.low >>> 0);
            }, LongPrototype.toString = function(radix) {
                if ((radix = radix || 10) < 2 || 36 < radix) throw RangeError('radix');
                if (this.isZero()) return '0';
                if (this.isNegative()) {
                    if (!this.eq(MIN_VALUE)) return '-' + this.neg().toString(radix);
                    var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                    return div.toString(radix) + rem1.toInt().toString(radix);
                }
                for(var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this, result = '';;){
                    var remDiv = rem.div(radixToPower), digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
                    if ((rem = remDiv).isZero()) return digits + result;
                    for(; digits.length < 6;)digits = '0' + digits;
                    result = '' + digits + result;
                }
            }, LongPrototype.getHighBits = function() {
                return this.high;
            }, LongPrototype.getHighBitsUnsigned = function() {
                return this.high >>> 0;
            }, LongPrototype.getLowBits = function() {
                return this.low;
            }, LongPrototype.getLowBitsUnsigned = function() {
                return this.low >>> 0;
            }, LongPrototype.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
                for(var val = 0 != this.high ? this.high : this.low, bit = 31; bit > 0 && (val & 1 << bit) == 0; bit--);
                return 0 != this.high ? bit + 33 : bit + 1;
            }, LongPrototype.isZero = function() {
                return 0 === this.high && 0 === this.low;
            }, LongPrototype.eqz = LongPrototype.isZero, LongPrototype.isNegative = function() {
                return !this.unsigned && this.high < 0;
            }, LongPrototype.isPositive = function() {
                return this.unsigned || this.high >= 0;
            }, LongPrototype.isOdd = function() {
                return (1 & this.low) == 1;
            }, LongPrototype.isEven = function() {
                return (1 & this.low) == 0;
            }, LongPrototype.equals = function(other) {
                return isLong(other) || (other = fromValue(other)), (this.unsigned === other.unsigned || this.high >>> 31 != 1 || other.high >>> 31 != 1) && this.high === other.high && this.low === other.low;
            }, LongPrototype.eq = LongPrototype.equals, LongPrototype.notEquals = function(other) {
                return !this.eq(other);
            }, LongPrototype.neq = LongPrototype.notEquals, LongPrototype.ne = LongPrototype.notEquals, LongPrototype.lessThan = function(other) {
                return 0 > this.comp(other);
            }, LongPrototype.lt = LongPrototype.lessThan, LongPrototype.lessThanOrEqual = function(other) {
                return 0 >= this.comp(other);
            }, LongPrototype.lte = LongPrototype.lessThanOrEqual, LongPrototype.le = LongPrototype.lessThanOrEqual, LongPrototype.greaterThan = function(other) {
                return this.comp(other) > 0;
            }, LongPrototype.gt = LongPrototype.greaterThan, LongPrototype.greaterThanOrEqual = function(other) {
                return this.comp(other) >= 0;
            }, LongPrototype.gte = LongPrototype.greaterThanOrEqual, LongPrototype.ge = LongPrototype.greaterThanOrEqual, LongPrototype.compare = function(other) {
                if (isLong(other) || (other = fromValue(other)), this.eq(other)) return 0;
                var thisNeg = this.isNegative(), otherNeg = other.isNegative();
                return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : this.unsigned ? other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(other).isNegative() ? -1 : 1;
            }, LongPrototype.comp = LongPrototype.compare, LongPrototype.negate = function() {
                return !this.unsigned && this.eq(MIN_VALUE) ? MIN_VALUE : this.not().add(ONE);
            }, LongPrototype.neg = LongPrototype.negate, LongPrototype.add = function(addend) {
                isLong(addend) || (addend = fromValue(addend));
                var c16, c00, a48 = this.high >>> 16, a32 = 0xFFFF & this.high, a16 = this.low >>> 16, a00 = 0xFFFF & this.low, b48 = addend.high >>> 16, b32 = 0xFFFF & addend.high, b16 = addend.low >>> 16, b00 = 0xFFFF & addend.low, c48 = 0, c32 = 0;
                return c16 = 0 + ((c00 = 0 + (a00 + b00)) >>> 16), c00 &= 0xFFFF, c16 += a16 + b16, c32 += c16 >>> 16, c16 &= 0xFFFF, c32 += a32 + b32, c48 += c32 >>> 16, c32 &= 0xFFFF, c48 += a48 + b48, fromBits(c16 << 16 | c00, (c48 &= 0xFFFF) << 16 | c32, this.unsigned);
            }, LongPrototype.subtract = function(subtrahend) {
                return isLong(subtrahend) || (subtrahend = fromValue(subtrahend)), this.add(subtrahend.neg());
            }, LongPrototype.sub = LongPrototype.subtract, LongPrototype.multiply = function(multiplier) {
                if (this.isZero()) return ZERO;
                if (isLong(multiplier) || (multiplier = fromValue(multiplier)), wasm) return fromBits(wasm.mul(this.low, this.high, multiplier.low, multiplier.high), wasm.get_high(), this.unsigned);
                if (multiplier.isZero()) return ZERO;
                if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
                if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
                if (this.isNegative()) return multiplier.isNegative() ? this.neg().mul(multiplier.neg()) : this.neg().mul(multiplier).neg();
                if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
                if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
                var c16, c00, a48 = this.high >>> 16, a32 = 0xFFFF & this.high, a16 = this.low >>> 16, a00 = 0xFFFF & this.low, b48 = multiplier.high >>> 16, b32 = 0xFFFF & multiplier.high, b16 = multiplier.low >>> 16, b00 = 0xFFFF & multiplier.low, c48 = 0, c32 = 0;
                return c16 = 0 + ((c00 = 0 + a00 * b00) >>> 16), c00 &= 0xFFFF, c16 += a16 * b00, c32 += c16 >>> 16, c16 &= 0xFFFF, c16 += a00 * b16, c32 += c16 >>> 16, c16 &= 0xFFFF, c32 += a32 * b00, c48 += c32 >>> 16, c32 &= 0xFFFF, c32 += a16 * b16, c48 += c32 >>> 16, c32 &= 0xFFFF, c32 += a00 * b32, c48 += c32 >>> 16, c32 &= 0xFFFF, c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48, fromBits(c16 << 16 | c00, (c48 &= 0xFFFF) << 16 | c32, this.unsigned);
            }, LongPrototype.mul = LongPrototype.multiply, LongPrototype.divide = function(divisor) {
                if (isLong(divisor) || (divisor = fromValue(divisor)), divisor.isZero()) throw Error('division by zero');
                if (wasm) {
                    var approx, rem, res;
                    return this.unsigned || -2147483648 !== this.high || -1 !== divisor.low || -1 !== divisor.high ? fromBits((this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high), wasm.get_high(), this.unsigned) : this;
                }
                if (this.isZero()) return this.unsigned ? UZERO : ZERO;
                if (this.unsigned) {
                    if (divisor.unsigned || (divisor = divisor.toUnsigned()), divisor.gt(this)) return UZERO;
                    if (divisor.gt(this.shru(1))) return UONE;
                    res = UZERO;
                } else {
                    if (this.eq(MIN_VALUE)) return divisor.eq(ONE) || divisor.eq(NEG_ONE) ? MIN_VALUE : divisor.eq(MIN_VALUE) ? ONE : (approx = this.shr(1).div(divisor).shl(1)).eq(ZERO) ? divisor.isNegative() ? ONE : NEG_ONE : (rem = this.sub(divisor.mul(approx)), res = approx.add(rem.div(divisor)));
                    if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
                    if (this.isNegative()) return divisor.isNegative() ? this.neg().div(divisor.neg()) : this.neg().div(divisor).neg();
                    if (divisor.isNegative()) return this.div(divisor.neg()).neg();
                    res = ZERO;
                }
                for(rem = this; rem.gte(divisor);){
                    for(var log2 = Math.ceil(Math.log(approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()))) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor); approxRem.isNegative() || approxRem.gt(rem);)approx -= delta, approxRem = (approxRes = fromNumber(approx, this.unsigned)).mul(divisor);
                    approxRes.isZero() && (approxRes = ONE), res = res.add(approxRes), rem = rem.sub(approxRem);
                }
                return res;
            }, LongPrototype.div = LongPrototype.divide, LongPrototype.modulo = function(divisor) {
                return (isLong(divisor) || (divisor = fromValue(divisor)), wasm) ? fromBits((this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high), wasm.get_high(), this.unsigned) : this.sub(this.div(divisor).mul(divisor));
            }, LongPrototype.mod = LongPrototype.modulo, LongPrototype.rem = LongPrototype.modulo, LongPrototype.not = function() {
                return fromBits(~this.low, ~this.high, this.unsigned);
            }, LongPrototype.and = function(other) {
                return isLong(other) || (other = fromValue(other)), fromBits(this.low & other.low, this.high & other.high, this.unsigned);
            }, LongPrototype.or = function(other) {
                return isLong(other) || (other = fromValue(other)), fromBits(this.low | other.low, this.high | other.high, this.unsigned);
            }, LongPrototype.xor = function(other) {
                return isLong(other) || (other = fromValue(other)), fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
            }, LongPrototype.shiftLeft = function(numBits) {
                return (isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63)) ? this : numBits < 32 ? fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned) : fromBits(0, this.low << numBits - 32, this.unsigned);
            }, LongPrototype.shl = LongPrototype.shiftLeft, LongPrototype.shiftRight = function(numBits) {
                return (isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63)) ? this : numBits < 32 ? fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned) : fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
            }, LongPrototype.shr = LongPrototype.shiftRight, LongPrototype.shiftRightUnsigned = function(numBits) {
                if (isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63)) return this;
                var high = this.high;
                return numBits < 32 ? fromBits(this.low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned) : 32 === numBits ? fromBits(high, 0, this.unsigned) : fromBits(high >>> numBits - 32, 0, this.unsigned);
            }, LongPrototype.shru = LongPrototype.shiftRightUnsigned, LongPrototype.shr_u = LongPrototype.shiftRightUnsigned, LongPrototype.toSigned = function() {
                return this.unsigned ? fromBits(this.low, this.high, !1) : this;
            }, LongPrototype.toUnsigned = function() {
                return this.unsigned ? this : fromBits(this.low, this.high, !0);
            }, LongPrototype.toBytes = function(le) {
                return le ? this.toBytesLE() : this.toBytesBE();
            }, LongPrototype.toBytesLE = function() {
                var hi = this.high, lo = this.low;
                return [
                    0xff & lo,
                    lo >>> 8 & 0xff,
                    lo >>> 16 & 0xff,
                    lo >>> 24,
                    0xff & hi,
                    hi >>> 8 & 0xff,
                    hi >>> 16 & 0xff,
                    hi >>> 24
                ];
            }, LongPrototype.toBytesBE = function() {
                var hi = this.high, lo = this.low;
                return [
                    hi >>> 24,
                    hi >>> 16 & 0xff,
                    hi >>> 8 & 0xff,
                    0xff & hi,
                    lo >>> 24,
                    lo >>> 16 & 0xff,
                    lo >>> 8 & 0xff,
                    0xff & lo
                ];
            }, Long.fromBytes = function(bytes, unsigned, le) {
                return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
            }, Long.fromBytesLE = function(bytes, unsigned) {
                return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
            }, Long.fromBytesBE = function(bytes, unsigned) {
                return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
            };
        },
        1876: function(module) {
            !function() {
                var e = {
                    675: function(e, r) {
                        "use strict";
                        r.byteLength = function(e) {
                            var r = getLens(e), t = r[0], f = r[1];
                            return (t + f) * 3 / 4 - f;
                        }, r.toByteArray = function(e) {
                            var r, h, t = getLens(e), i = t[0], o = t[1], u = new n((i + o) * 3 / 4 - o), a = 0, s = o > 0 ? i - 4 : i;
                            for(h = 0; h < s; h += 4)r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)], u[a++] = r >> 16 & 255, u[a++] = r >> 8 & 255, u[a++] = 255 & r;
                            return 2 === o && (r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4, u[a++] = 255 & r), 1 === o && (r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2, u[a++] = r >> 8 & 255, u[a++] = 255 & r), u;
                        }, r.fromByteArray = function(e) {
                            for(var r, f = e.length, n = f % 3, i = [], u = 0, a = f - n; u < a; u += 16383)i.push(function(e, r, t1) {
                                for(var f, n = [], i = r; i < t1; i += 3)n.push(t[(f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (255 & e[i + 2])) >> 18 & 63] + t[f >> 12 & 63] + t[f >> 6 & 63] + t[63 & f]);
                                return n.join("");
                            }(e, u, u + 16383 > a ? a : u + 16383));
                            return 1 === n ? i.push(t[(r = e[f - 1]) >> 2] + t[r << 4 & 63] + "==") : 2 === n && i.push(t[(r = (e[f - 2] << 8) + e[f - 1]) >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "="), i.join("");
                        };
                        for(var t = [], f = [], n = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, u = i.length; o < u; ++o)t[o] = i[o], f[i.charCodeAt(o)] = o;
                        function getLens(e) {
                            var r = e.length;
                            if (r % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
                            var t = e.indexOf("=");
                            -1 === t && (t = r);
                            var f = t === r ? 0 : 4 - t % 4;
                            return [
                                t,
                                f
                            ];
                        }
                        f["-".charCodeAt(0)] = 62, f["_".charCodeAt(0)] = 63;
                    },
                    72: function(e, r, t) {
                        "use strict";
                        var f = t(675), n = t(783), i = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
                        function createBuffer(e) {
                            if (e > 2147483647) throw RangeError('The value "' + e + '" is invalid for option "size"');
                            var r = new Uint8Array(e);
                            return Object.setPrototypeOf(r, Buffer.prototype), r;
                        }
                        function Buffer(e, r, t) {
                            if ("number" == typeof e) {
                                if ("string" == typeof r) throw TypeError('The "string" argument must be of type string. Received type number');
                                return allocUnsafe(e);
                            }
                            return from(e, r, t);
                        }
                        function from(e, r, t) {
                            if ("string" == typeof e) return function(e, r) {
                                if (("string" != typeof r || "" === r) && (r = "utf8"), !Buffer.isEncoding(r)) throw TypeError("Unknown encoding: " + r);
                                var t = 0 | byteLength(e, r), f = createBuffer(t), n = f.write(e, r);
                                return n !== t && (f = f.slice(0, n)), f;
                            }(e, r);
                            if (ArrayBuffer.isView(e)) return fromArrayLike(e);
                            if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                            if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer) || "undefined" != typeof SharedArrayBuffer && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) return function(e, r, t) {
                                var f;
                                if (r < 0 || e.byteLength < r) throw RangeError('"offset" is outside of buffer bounds');
                                if (e.byteLength < r + (t || 0)) throw RangeError('"length" is outside of buffer bounds');
                                return Object.setPrototypeOf(f = void 0 === r && void 0 === t ? new Uint8Array(e) : void 0 === t ? new Uint8Array(e, r) : new Uint8Array(e, r, t), Buffer.prototype), f;
                            }(e, r, t);
                            if ("number" == typeof e) throw TypeError('The "value" argument must not be of type number. Received type number');
                            var f = e.valueOf && e.valueOf();
                            if (null != f && f !== e) return Buffer.from(f, r, t);
                            var n = function(e) {
                                if (Buffer.isBuffer(e)) {
                                    var e1, r = 0 | checked(e.length), t = createBuffer(r);
                                    return 0 === t.length || e.copy(t, 0, 0, r), t;
                                }
                                return void 0 !== e.length ? "number" != typeof e.length || (e1 = e.length) != e1 ? createBuffer(0) : fromArrayLike(e) : "Buffer" === e.type && Array.isArray(e.data) ? fromArrayLike(e.data) : void 0;
                            }(e);
                            if (n) return n;
                            if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                            throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                        }
                        function assertSize(e) {
                            if ("number" != typeof e) throw TypeError('"size" argument must be of type number');
                            if (e < 0) throw RangeError('The value "' + e + '" is invalid for option "size"');
                        }
                        function allocUnsafe(e) {
                            return assertSize(e), createBuffer(e < 0 ? 0 : 0 | checked(e));
                        }
                        function fromArrayLike(e) {
                            for(var r = e.length < 0 ? 0 : 0 | checked(e.length), t = createBuffer(r), f = 0; f < r; f += 1)t[f] = 255 & e[f];
                            return t;
                        }
                        function checked(e) {
                            if (e >= 2147483647) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");
                            return 0 | e;
                        }
                        function byteLength(e, r) {
                            if (Buffer.isBuffer(e)) return e.length;
                            if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) return e.byteLength;
                            if ("string" != typeof e) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                            var t = e.length, f = arguments.length > 2 && !0 === arguments[2];
                            if (!f && 0 === t) return 0;
                            for(var n = !1;;)switch(r){
                                case "ascii":
                                case "latin1":
                                case "binary":
                                    return t;
                                case "utf8":
                                case "utf-8":
                                    return utf8ToBytes(e).length;
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return 2 * t;
                                case "hex":
                                    return t >>> 1;
                                case "base64":
                                    return base64ToBytes(e).length;
                                default:
                                    if (n) return f ? -1 : utf8ToBytes(e).length;
                                    r = ("" + r).toLowerCase(), n = !0;
                            }
                        }
                        function slowToString(e, r, t) {
                            var r1, t1, f1 = !1;
                            if ((void 0 === r || r < 0) && (r = 0), r > this.length || ((void 0 === t || t > this.length) && (t = this.length), t <= 0 || (t >>>= 0) <= (r >>>= 0))) return "";
                            for(e || (e = "utf8");;)switch(e){
                                case "hex":
                                    return function(e, r, t) {
                                        var f = e.length;
                                        (!r || r < 0) && (r = 0), (!t || t < 0 || t > f) && (t = f);
                                        for(var n = "", i = r; i < t; ++i)n += s[e[i]];
                                        return n;
                                    }(this, r, t);
                                case "utf8":
                                case "utf-8":
                                    return utf8Slice(this, r, t);
                                case "ascii":
                                    return function(e, r, t) {
                                        var f = "";
                                        t = Math.min(e.length, t);
                                        for(var n = r; n < t; ++n)f += String.fromCharCode(127 & e[n]);
                                        return f;
                                    }(this, r, t);
                                case "latin1":
                                case "binary":
                                    return function(e, r, t) {
                                        var f = "";
                                        t = Math.min(e.length, t);
                                        for(var n = r; n < t; ++n)f += String.fromCharCode(e[n]);
                                        return f;
                                    }(this, r, t);
                                case "base64":
                                    return r1 = r, t1 = t, 0 === r1 && t1 === this.length ? f.fromByteArray(this) : f.fromByteArray(this.slice(r1, t1));
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return function(e, r, t) {
                                        for(var f = e.slice(r, t), n = "", i = 0; i < f.length; i += 2)n += String.fromCharCode(f[i] + 256 * f[i + 1]);
                                        return n;
                                    }(this, r, t);
                                default:
                                    if (f1) throw TypeError("Unknown encoding: " + e);
                                    e = (e + "").toLowerCase(), f1 = !0;
                            }
                        }
                        function swap(e, r, t) {
                            var f = e[r];
                            e[r] = e[t], e[t] = f;
                        }
                        function bidirectionalIndexOf(e, r, t, f, n) {
                            var e1;
                            if (0 === e.length) return -1;
                            if ("string" == typeof t ? (f = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), (e1 = t = +t) != e1 && (t = n ? 0 : e.length - 1), t < 0 && (t = e.length + t), t >= e.length) {
                                if (n) return -1;
                                t = e.length - 1;
                            } else if (t < 0) {
                                if (!n) return -1;
                                t = 0;
                            }
                            if ("string" == typeof r && (r = Buffer.from(r, f)), Buffer.isBuffer(r)) return 0 === r.length ? -1 : arrayIndexOf(e, r, t, f, n);
                            if ("number" == typeof r) return (r &= 255, "function" == typeof Uint8Array.prototype.indexOf) ? n ? Uint8Array.prototype.indexOf.call(e, r, t) : Uint8Array.prototype.lastIndexOf.call(e, r, t) : arrayIndexOf(e, [
                                r
                            ], t, f, n);
                            throw TypeError("val must be string, number or Buffer");
                        }
                        function arrayIndexOf(e, r, t, f, n) {
                            var a, i = 1, o = e.length, u = r.length;
                            if (void 0 !== f && ("ucs2" === (f = String(f).toLowerCase()) || "ucs-2" === f || "utf16le" === f || "utf-16le" === f)) {
                                if (e.length < 2 || r.length < 2) return -1;
                                i = 2, o /= 2, u /= 2, t /= 2;
                            }
                            function read(e, r) {
                                return 1 === i ? e[r] : e.readUInt16BE(r * i);
                            }
                            if (n) {
                                var s = -1;
                                for(a = t; a < o; a++)if (read(e, a) === read(r, -1 === s ? 0 : a - s)) {
                                    if (-1 === s && (s = a), a - s + 1 === u) return s * i;
                                } else -1 !== s && (a -= a - s), s = -1;
                            } else for(t + u > o && (t = o - u), a = t; a >= 0; a--){
                                for(var h = !0, c = 0; c < u; c++)if (read(e, a + c) !== read(r, c)) {
                                    h = !1;
                                    break;
                                }
                                if (h) return a;
                            }
                            return -1;
                        }
                        function utf8Slice(e, r, t) {
                            t = Math.min(e.length, t);
                            for(var f = [], n = r; n < t;){
                                var a, s, h, c, i = e[n], o = null, u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                                if (n + u <= t) switch(u){
                                    case 1:
                                        i < 128 && (o = i);
                                        break;
                                    case 2:
                                        (192 & (a = e[n + 1])) == 128 && (c = (31 & i) << 6 | 63 & a) > 127 && (o = c);
                                        break;
                                    case 3:
                                        a = e[n + 1], s = e[n + 2], (192 & a) == 128 && (192 & s) == 128 && (c = (15 & i) << 12 | (63 & a) << 6 | 63 & s) > 2047 && (c < 55296 || c > 57343) && (o = c);
                                        break;
                                    case 4:
                                        a = e[n + 1], s = e[n + 2], h = e[n + 3], (192 & a) == 128 && (192 & s) == 128 && (192 & h) == 128 && (c = (15 & i) << 18 | (63 & a) << 12 | (63 & s) << 6 | 63 & h) > 65535 && c < 1114112 && (o = c);
                                }
                                null === o ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, f.push(o >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), f.push(o), n += u;
                            }
                            return function(e) {
                                var r = e.length;
                                if (r <= 4096) return String.fromCharCode.apply(String, e);
                                for(var t = "", f = 0; f < r;)t += String.fromCharCode.apply(String, e.slice(f, f += 4096));
                                return t;
                            }(f);
                        }
                        function checkOffset(e, r, t) {
                            if (e % 1 != 0 || e < 0) throw RangeError("offset is not uint");
                            if (e + r > t) throw RangeError("Trying to access beyond buffer length");
                        }
                        function checkInt(e, r, t, f, n, i) {
                            if (!Buffer.isBuffer(e)) throw TypeError('"buffer" argument must be a Buffer instance');
                            if (r > n || r < i) throw RangeError('"value" argument is out of bounds');
                            if (t + f > e.length) throw RangeError("Index out of range");
                        }
                        function checkIEEE754(e, r, t, f, n, i) {
                            if (t + f > e.length || t < 0) throw RangeError("Index out of range");
                        }
                        function writeFloat(e, r, t, f, i) {
                            return r = +r, t >>>= 0, i || checkIEEE754(e, r, t, 4, 34028234663852886e22, -340282346638528860000000000000000000000), n.write(e, r, t, f, 23, 4), t + 4;
                        }
                        function writeDouble(e, r, t, f, i) {
                            return r = +r, t >>>= 0, i || checkIEEE754(e, r, t, 8, 17976931348623157e292, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), n.write(e, r, t, f, 52, 8), t + 8;
                        }
                        r.Buffer = Buffer, r.SlowBuffer = function(e) {
                            return +e != e && (e = 0), Buffer.alloc(+e);
                        }, r.INSPECT_MAX_BYTES = 50, r.kMaxLength = 2147483647, Buffer.TYPED_ARRAY_SUPPORT = function() {
                            try {
                                var e = new Uint8Array(1), r = {
                                    foo: function() {
                                        return 42;
                                    }
                                };
                                return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(e, r), 42 === e.foo();
                            } catch (e1) {
                                return !1;
                            }
                        }(), Buffer.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer.prototype, "parent", {
                            enumerable: !0,
                            get: function() {
                                if (Buffer.isBuffer(this)) return this.buffer;
                            }
                        }), Object.defineProperty(Buffer.prototype, "offset", {
                            enumerable: !0,
                            get: function() {
                                if (Buffer.isBuffer(this)) return this.byteOffset;
                            }
                        }), Buffer.poolSize = 8192, Buffer.from = function(e, r, t) {
                            return from(e, r, t);
                        }, Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer, Uint8Array), Buffer.alloc = function(e, r, t) {
                            return (assertSize(e), e <= 0) ? createBuffer(e) : void 0 !== r ? "string" == typeof t ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r) : createBuffer(e);
                        }, Buffer.allocUnsafe = function(e) {
                            return allocUnsafe(e);
                        }, Buffer.allocUnsafeSlow = function(e) {
                            return allocUnsafe(e);
                        }, Buffer.isBuffer = function(e) {
                            return null != e && !0 === e._isBuffer && e !== Buffer.prototype;
                        }, Buffer.compare = function(e, r) {
                            if (isInstance(e, Uint8Array) && (e = Buffer.from(e, e.offset, e.byteLength)), isInstance(r, Uint8Array) && (r = Buffer.from(r, r.offset, r.byteLength)), !Buffer.isBuffer(e) || !Buffer.isBuffer(r)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                            if (e === r) return 0;
                            for(var t = e.length, f = r.length, n = 0, i = Math.min(t, f); n < i; ++n)if (e[n] !== r[n]) {
                                t = e[n], f = r[n];
                                break;
                            }
                            return t < f ? -1 : f < t ? 1 : 0;
                        }, Buffer.isEncoding = function(e) {
                            switch(String(e).toLowerCase()){
                                case "hex":
                                case "utf8":
                                case "utf-8":
                                case "ascii":
                                case "latin1":
                                case "binary":
                                case "base64":
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return !0;
                                default:
                                    return !1;
                            }
                        }, Buffer.concat = function(e, r) {
                            if (!Array.isArray(e)) throw TypeError('"list" argument must be an Array of Buffers');
                            if (0 === e.length) return Buffer.alloc(0);
                            if (void 0 === r) for(t = 0, r = 0; t < e.length; ++t)r += e[t].length;
                            var t, f = Buffer.allocUnsafe(r), n = 0;
                            for(t = 0; t < e.length; ++t){
                                var i = e[t];
                                if (isInstance(i, Uint8Array) && (i = Buffer.from(i)), !Buffer.isBuffer(i)) throw TypeError('"list" argument must be an Array of Buffers');
                                i.copy(f, n), n += i.length;
                            }
                            return f;
                        }, Buffer.byteLength = byteLength, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
                            var e = this.length;
                            if (e % 2 != 0) throw RangeError("Buffer size must be a multiple of 16-bits");
                            for(var r = 0; r < e; r += 2)swap(this, r, r + 1);
                            return this;
                        }, Buffer.prototype.swap32 = function() {
                            var e = this.length;
                            if (e % 4 != 0) throw RangeError("Buffer size must be a multiple of 32-bits");
                            for(var r = 0; r < e; r += 4)swap(this, r, r + 3), swap(this, r + 1, r + 2);
                            return this;
                        }, Buffer.prototype.swap64 = function() {
                            var e = this.length;
                            if (e % 8 != 0) throw RangeError("Buffer size must be a multiple of 64-bits");
                            for(var r = 0; r < e; r += 8)swap(this, r, r + 7), swap(this, r + 1, r + 6), swap(this, r + 2, r + 5), swap(this, r + 3, r + 4);
                            return this;
                        }, Buffer.prototype.toString = function() {
                            var e = this.length;
                            return 0 === e ? "" : 0 == arguments.length ? utf8Slice(this, 0, e) : slowToString.apply(this, arguments);
                        }, Buffer.prototype.toLocaleString = Buffer.prototype.toString, Buffer.prototype.equals = function(e) {
                            if (!Buffer.isBuffer(e)) throw TypeError("Argument must be a Buffer");
                            return this === e || 0 === Buffer.compare(this, e);
                        }, Buffer.prototype.inspect = function() {
                            var e = "", t = r.INSPECT_MAX_BYTES;
                            return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
                        }, i && (Buffer.prototype[i] = Buffer.prototype.inspect), Buffer.prototype.compare = function(e, r, t, f, n) {
                            if (isInstance(e, Uint8Array) && (e = Buffer.from(e, e.offset, e.byteLength)), !Buffer.isBuffer(e)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                            if (void 0 === r && (r = 0), void 0 === t && (t = e ? e.length : 0), void 0 === f && (f = 0), void 0 === n && (n = this.length), r < 0 || t > e.length || f < 0 || n > this.length) throw RangeError("out of range index");
                            if (f >= n && r >= t) return 0;
                            if (f >= n) return -1;
                            if (r >= t) return 1;
                            if (r >>>= 0, t >>>= 0, f >>>= 0, n >>>= 0, this === e) return 0;
                            for(var i = n - f, o = t - r, u = Math.min(i, o), a = this.slice(f, n), s = e.slice(r, t), h = 0; h < u; ++h)if (a[h] !== s[h]) {
                                i = a[h], o = s[h];
                                break;
                            }
                            return i < o ? -1 : o < i ? 1 : 0;
                        }, Buffer.prototype.includes = function(e, r, t) {
                            return -1 !== this.indexOf(e, r, t);
                        }, Buffer.prototype.indexOf = function(e, r, t) {
                            return bidirectionalIndexOf(this, e, r, t, !0);
                        }, Buffer.prototype.lastIndexOf = function(e, r, t) {
                            return bidirectionalIndexOf(this, e, r, t, !1);
                        }, Buffer.prototype.write = function(e, r, t, f) {
                            if (void 0 === r) f = "utf8", t = this.length, r = 0;
                            else if (void 0 === t && "string" == typeof r) f = r, t = this.length, r = 0;
                            else if (isFinite(r)) r >>>= 0, isFinite(t) ? (t >>>= 0, void 0 === f && (f = "utf8")) : (f = t, t = void 0);
                            else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                            var t1, f1, t2, f2, t3, f3, t4, f4, t5, f5, n = this.length - r;
                            if ((void 0 === t || t > n) && (t = n), e.length > 0 && (t < 0 || r < 0) || r > this.length) throw RangeError("Attempt to write outside buffer bounds");
                            f || (f = "utf8");
                            for(var i = !1;;)switch(f){
                                case "hex":
                                    return function(e, r, t, f) {
                                        t = Number(t) || 0;
                                        var n = e.length - t;
                                        f ? (f = Number(f)) > n && (f = n) : f = n;
                                        var i = r.length;
                                        f > i / 2 && (f = i / 2);
                                        for(var o = 0; o < f; ++o){
                                            var u = parseInt(r.substr(2 * o, 2), 16);
                                            if (u != u) break;
                                            e[t + o] = u;
                                        }
                                        return o;
                                    }(this, e, r, t);
                                case "utf8":
                                case "utf-8":
                                    return t2 = r, f2 = t, blitBuffer(utf8ToBytes(e, this.length - t2), this, t2, f2);
                                case "ascii":
                                    return t3 = r, f3 = t, blitBuffer(asciiToBytes(e), this, t3, f3);
                                case "latin1":
                                case "binary":
                                    return t1 = r, f1 = t, blitBuffer(asciiToBytes(e), this, t1, f1);
                                case "base64":
                                    return t4 = r, f4 = t, blitBuffer(base64ToBytes(e), this, t4, f4);
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return t5 = r, f5 = t, blitBuffer(function(e, r) {
                                        for(var t, f, i = [], o = 0; o < e.length && !((r -= 2) < 0); ++o)f = (t = e.charCodeAt(o)) >> 8, i.push(t % 256), i.push(f);
                                        return i;
                                    }(e, this.length - t5), this, t5, f5);
                                default:
                                    if (i) throw TypeError("Unknown encoding: " + f);
                                    f = ("" + f).toLowerCase(), i = !0;
                            }
                        }, Buffer.prototype.toJSON = function() {
                            return {
                                type: "Buffer",
                                data: Array.prototype.slice.call(this._arr || this, 0)
                            };
                        }, Buffer.prototype.slice = function(e, r) {
                            var t = this.length;
                            e = ~~e, r = void 0 === r ? t : ~~r, e < 0 ? (e += t) < 0 && (e = 0) : e > t && (e = t), r < 0 ? (r += t) < 0 && (r = 0) : r > t && (r = t), r < e && (r = e);
                            var f = this.subarray(e, r);
                            return Object.setPrototypeOf(f, Buffer.prototype), f;
                        }, Buffer.prototype.readUIntLE = function(e, r, t) {
                            e >>>= 0, r >>>= 0, t || checkOffset(e, r, this.length);
                            for(var f = this[e], n = 1, i = 0; ++i < r && (n *= 256);)f += this[e + i] * n;
                            return f;
                        }, Buffer.prototype.readUIntBE = function(e, r, t) {
                            e >>>= 0, r >>>= 0, t || checkOffset(e, r, this.length);
                            for(var f = this[e + --r], n = 1; r > 0 && (n *= 256);)f += this[e + --r] * n;
                            return f;
                        }, Buffer.prototype.readUInt8 = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 1, this.length), this[e];
                        }, Buffer.prototype.readUInt16LE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 2, this.length), this[e] | this[e + 1] << 8;
                        }, Buffer.prototype.readUInt16BE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 2, this.length), this[e] << 8 | this[e + 1];
                        }, Buffer.prototype.readUInt32LE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
                        }, Buffer.prototype.readUInt32BE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
                        }, Buffer.prototype.readIntLE = function(e, r, t) {
                            e >>>= 0, r >>>= 0, t || checkOffset(e, r, this.length);
                            for(var f = this[e], n = 1, i = 0; ++i < r && (n *= 256);)f += this[e + i] * n;
                            return f >= (n *= 128) && (f -= Math.pow(2, 8 * r)), f;
                        }, Buffer.prototype.readIntBE = function(e, r, t) {
                            e >>>= 0, r >>>= 0, t || checkOffset(e, r, this.length);
                            for(var f = r, n = 1, i = this[e + --f]; f > 0 && (n *= 256);)i += this[e + --f] * n;
                            return i >= (n *= 128) && (i -= Math.pow(2, 8 * r)), i;
                        }, Buffer.prototype.readInt8 = function(e, r) {
                            return (e >>>= 0, r || checkOffset(e, 1, this.length), 128 & this[e]) ? -((255 - this[e] + 1) * 1) : this[e];
                        }, Buffer.prototype.readInt16LE = function(e, r) {
                            e >>>= 0, r || checkOffset(e, 2, this.length);
                            var t = this[e] | this[e + 1] << 8;
                            return 32768 & t ? 4294901760 | t : t;
                        }, Buffer.prototype.readInt16BE = function(e, r) {
                            e >>>= 0, r || checkOffset(e, 2, this.length);
                            var t = this[e + 1] | this[e] << 8;
                            return 32768 & t ? 4294901760 | t : t;
                        }, Buffer.prototype.readInt32LE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
                        }, Buffer.prototype.readInt32BE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
                        }, Buffer.prototype.readFloatLE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), n.read(this, e, !0, 23, 4);
                        }, Buffer.prototype.readFloatBE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 4, this.length), n.read(this, e, !1, 23, 4);
                        }, Buffer.prototype.readDoubleLE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 8, this.length), n.read(this, e, !0, 52, 8);
                        }, Buffer.prototype.readDoubleBE = function(e, r) {
                            return e >>>= 0, r || checkOffset(e, 8, this.length), n.read(this, e, !1, 52, 8);
                        }, Buffer.prototype.writeUIntLE = function(e, r, t, f) {
                            if (e = +e, r >>>= 0, t >>>= 0, !f) {
                                var n = Math.pow(2, 8 * t) - 1;
                                checkInt(this, e, r, t, n, 0);
                            }
                            var i = 1, o = 0;
                            for(this[r] = 255 & e; ++o < t && (i *= 256);)this[r + o] = e / i & 255;
                            return r + t;
                        }, Buffer.prototype.writeUIntBE = function(e, r, t, f) {
                            if (e = +e, r >>>= 0, t >>>= 0, !f) {
                                var n = Math.pow(2, 8 * t) - 1;
                                checkInt(this, e, r, t, n, 0);
                            }
                            var i = t - 1, o = 1;
                            for(this[r + i] = 255 & e; --i >= 0 && (o *= 256);)this[r + i] = e / o & 255;
                            return r + t;
                        }, Buffer.prototype.writeUInt8 = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 1, 255, 0), this[r] = 255 & e, r + 1;
                        }, Buffer.prototype.writeUInt16LE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 2, 65535, 0), this[r] = 255 & e, this[r + 1] = e >>> 8, r + 2;
                        }, Buffer.prototype.writeUInt16BE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 2, 65535, 0), this[r] = e >>> 8, this[r + 1] = 255 & e, r + 2;
                        }, Buffer.prototype.writeUInt32LE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 4, 4294967295, 0), this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = 255 & e, r + 4;
                        }, Buffer.prototype.writeUInt32BE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 4, 4294967295, 0), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = 255 & e, r + 4;
                        }, Buffer.prototype.writeIntLE = function(e, r, t, f) {
                            if (e = +e, r >>>= 0, !f) {
                                var n = Math.pow(2, 8 * t - 1);
                                checkInt(this, e, r, t, n - 1, -n);
                            }
                            var i = 0, o = 1, u = 0;
                            for(this[r] = 255 & e; ++i < t && (o *= 256);)e < 0 && 0 === u && 0 !== this[r + i - 1] && (u = 1), this[r + i] = (e / o >> 0) - u & 255;
                            return r + t;
                        }, Buffer.prototype.writeIntBE = function(e, r, t, f) {
                            if (e = +e, r >>>= 0, !f) {
                                var n = Math.pow(2, 8 * t - 1);
                                checkInt(this, e, r, t, n - 1, -n);
                            }
                            var i = t - 1, o = 1, u = 0;
                            for(this[r + i] = 255 & e; --i >= 0 && (o *= 256);)e < 0 && 0 === u && 0 !== this[r + i + 1] && (u = 1), this[r + i] = (e / o >> 0) - u & 255;
                            return r + t;
                        }, Buffer.prototype.writeInt8 = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[r] = 255 & e, r + 1;
                        }, Buffer.prototype.writeInt16LE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 2, 32767, -32768), this[r] = 255 & e, this[r + 1] = e >>> 8, r + 2;
                        }, Buffer.prototype.writeInt16BE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 2, 32767, -32768), this[r] = e >>> 8, this[r + 1] = 255 & e, r + 2;
                        }, Buffer.prototype.writeInt32LE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 4, 2147483647, -2147483648), this[r] = 255 & e, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24, r + 4;
                        }, Buffer.prototype.writeInt32BE = function(e, r, t) {
                            return e = +e, r >>>= 0, t || checkInt(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = 255 & e, r + 4;
                        }, Buffer.prototype.writeFloatLE = function(e, r, t) {
                            return writeFloat(this, e, r, !0, t);
                        }, Buffer.prototype.writeFloatBE = function(e, r, t) {
                            return writeFloat(this, e, r, !1, t);
                        }, Buffer.prototype.writeDoubleLE = function(e, r, t) {
                            return writeDouble(this, e, r, !0, t);
                        }, Buffer.prototype.writeDoubleBE = function(e, r, t) {
                            return writeDouble(this, e, r, !1, t);
                        }, Buffer.prototype.copy = function(e, r, t, f) {
                            if (!Buffer.isBuffer(e)) throw TypeError("argument should be a Buffer");
                            if (t || (t = 0), f || 0 === f || (f = this.length), r >= e.length && (r = e.length), r || (r = 0), f > 0 && f < t && (f = t), f === t || 0 === e.length || 0 === this.length) return 0;
                            if (r < 0) throw RangeError("targetStart out of bounds");
                            if (t < 0 || t >= this.length) throw RangeError("Index out of range");
                            if (f < 0) throw RangeError("sourceEnd out of bounds");
                            f > this.length && (f = this.length), e.length - r < f - t && (f = e.length - r + t);
                            var n = f - t;
                            if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(r, t, f);
                            else if (this === e && t < r && r < f) for(var i = n - 1; i >= 0; --i)e[i + r] = this[i + t];
                            else Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                            return n;
                        }, Buffer.prototype.fill = function(e, r, t, f) {
                            if ("string" == typeof e) {
                                if ("string" == typeof r ? (f = r, r = 0, t = this.length) : "string" == typeof t && (f = t, t = this.length), void 0 !== f && "string" != typeof f) throw TypeError("encoding must be a string");
                                if ("string" == typeof f && !Buffer.isEncoding(f)) throw TypeError("Unknown encoding: " + f);
                                if (1 === e.length) {
                                    var i, n = e.charCodeAt(0);
                                    ("utf8" === f && n < 128 || "latin1" === f) && (e = n);
                                }
                            } else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
                            if (r < 0 || this.length < r || this.length < t) throw RangeError("Out of range index");
                            if (t <= r) return this;
                            if (r >>>= 0, t = void 0 === t ? this.length : t >>> 0, e || (e = 0), "number" == typeof e) for(i = r; i < t; ++i)this[i] = e;
                            else {
                                var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f), u = o.length;
                                if (0 === u) throw TypeError('The value "' + e + '" is invalid for argument "value"');
                                for(i = 0; i < t - r; ++i)this[i + r] = o[i % u];
                            }
                            return this;
                        };
                        var a = /[^+/0-9A-Za-z-_]/g;
                        function utf8ToBytes(e, r) {
                            r = r || 1 / 0;
                            for(var t, f = e.length, n = null, i = [], o = 0; o < f; ++o){
                                if ((t = e.charCodeAt(o)) > 55295 && t < 57344) {
                                    if (!n) {
                                        if (t > 56319 || o + 1 === f) {
                                            (r -= 3) > -1 && i.push(239, 191, 189);
                                            continue;
                                        }
                                        n = t;
                                        continue;
                                    }
                                    if (t < 56320) {
                                        (r -= 3) > -1 && i.push(239, 191, 189), n = t;
                                        continue;
                                    }
                                    t = (n - 55296 << 10 | t - 56320) + 65536;
                                } else n && (r -= 3) > -1 && i.push(239, 191, 189);
                                if (n = null, t < 128) {
                                    if ((r -= 1) < 0) break;
                                    i.push(t);
                                } else if (t < 2048) {
                                    if ((r -= 2) < 0) break;
                                    i.push(t >> 6 | 192, 63 & t | 128);
                                } else if (t < 65536) {
                                    if ((r -= 3) < 0) break;
                                    i.push(t >> 12 | 224, t >> 6 & 63 | 128, 63 & t | 128);
                                } else if (t < 1114112) {
                                    if ((r -= 4) < 0) break;
                                    i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, 63 & t | 128);
                                } else throw Error("Invalid code point");
                            }
                            return i;
                        }
                        function asciiToBytes(e) {
                            for(var r = [], t = 0; t < e.length; ++t)r.push(255 & e.charCodeAt(t));
                            return r;
                        }
                        function base64ToBytes(e) {
                            return f.toByteArray(function(e) {
                                if ((e = (e = e.split("=")[0]).trim().replace(a, "")).length < 2) return "";
                                for(; e.length % 4 != 0;)e += "=";
                                return e;
                            }(e));
                        }
                        function blitBuffer(e, r, t, f) {
                            for(var n = 0; n < f && !(n + t >= r.length) && !(n >= e.length); ++n)r[n + t] = e[n];
                            return n;
                        }
                        function isInstance(e, r) {
                            return e instanceof r || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === r.name;
                        }
                        var s = function() {
                            for(var e = "0123456789abcdef", r = Array(256), t = 0; t < 16; ++t)for(var f = 16 * t, n = 0; n < 16; ++n)r[f + n] = e[t] + e[n];
                            return r;
                        }();
                    },
                    783: function(e, r) {
                        r.read = function(e, r, t, f, n) {
                            var i, o, u = 8 * n - f - 1, a = (1 << u) - 1, s = a >> 1, h = -7, c = t ? n - 1 : 0, l = t ? -1 : 1, p = e[r + c];
                            for(c += l, i = p & (1 << -h) - 1, p >>= -h, h += u; h > 0; i = 256 * i + e[r + c], c += l, h -= 8);
                            for(o = i & (1 << -h) - 1, i >>= -h, h += f; h > 0; o = 256 * o + e[r + c], c += l, h -= 8);
                            if (0 === i) i = 1 - s;
                            else {
                                if (i === a) return o ? NaN : (p ? -1 : 1) * (1 / 0);
                                o += Math.pow(2, f), i -= s;
                            }
                            return (p ? -1 : 1) * o * Math.pow(2, i - f);
                        }, r.write = function(e, r, t, f, n, i) {
                            var o, u, a, s = 8 * i - n - 1, h = (1 << s) - 1, c = h >> 1, l = 23 === n ? 0.00000005960464477539062 : 0, p = f ? 0 : i - 1, y = f ? 1 : -1, g = r < 0 || 0 === r && 1 / r < 0 ? 1 : 0;
                            for(isNaN(r = Math.abs(r)) || r === 1 / 0 ? (u = isNaN(r) ? 1 : 0, o = h) : (o = Math.floor(Math.log(r) / Math.LN2), r * (a = Math.pow(2, -o)) < 1 && (o--, a *= 2), o + c >= 1 ? r += l / a : r += l * Math.pow(2, 1 - c), r * a >= 2 && (o++, a /= 2), o + c >= h ? (u = 0, o = h) : o + c >= 1 ? (u = (r * a - 1) * Math.pow(2, n), o += c) : (u = r * Math.pow(2, c - 1) * Math.pow(2, n), o = 0)); n >= 8; e[t + p] = 255 & u, p += y, u /= 256, n -= 8);
                            for(o = o << n | u, s += n; s > 0; e[t + p] = 255 & o, p += y, o /= 256, s -= 8);
                            e[t + p - y] |= 128 * g;
                        };
                    }
                }, r = {};
                function __nccwpck_require__(t) {
                    var f = r[t];
                    if (void 0 !== f) return f.exports;
                    var n = r[t] = {
                        exports: {}
                    }, i = !0;
                    try {
                        e[t](n, n.exports, __nccwpck_require__), i = !1;
                    } finally{
                        i && delete r[t];
                    }
                    return n.exports;
                }
                __nccwpck_require__.ab = "//";
                var t = __nccwpck_require__(72);
                module.exports = t;
            }();
        },
        9567: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                _: function() {
                    return Parser;
                }
            });
            class Context {
                constructor(importPath, useContextVariables){
                    this.code = "", this.scopes = [
                        [
                            "vars"
                        ]
                    ], this.bitFields = [], this.tmpVariableCount = 0, this.references = new Map(), this.imports = [], this.reverseImports = new Map(), this.useContextVariables = !1, this.importPath = importPath, this.useContextVariables = useContextVariables;
                }
                generateVariable(name) {
                    const scopes = [
                        ...this.scopes[this.scopes.length - 1]
                    ];
                    return name && scopes.push(name), scopes.join(".");
                }
                generateOption(val) {
                    switch(typeof val){
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
                    name && this.scopes[this.scopes.length - 1].push(name);
                }
                popPath(name) {
                    name && this.scopes[this.scopes.length - 1].pop();
                }
                pushScope(name) {
                    this.scopes.push([
                        name
                    ]);
                }
                popScope() {
                    this.scopes.pop();
                }
                addImport(im) {
                    if (!this.importPath) return `(${im})`;
                    let id = this.reverseImports.get(im);
                    return id || (id = this.imports.push(im) - 1, this.reverseImports.set(im, id)), `${this.importPath}[${id}]`;
                }
                addReference(alias) {
                    this.references.has(alias) || this.references.set(alias, {
                        resolved: !1,
                        requested: !1
                    });
                }
                markResolved(alias) {
                    const reference = this.references.get(alias);
                    reference && (reference.resolved = !0);
                }
                markRequested(aliasList) {
                    aliasList.forEach((alias)=>{
                        const reference = this.references.get(alias);
                        reference && (reference.requested = !0);
                    });
                }
                getUnresolvedReferences() {
                    return Array.from(this.references).filter(([_, reference])=>!reference.resolved && !reference.requested).map(([alias, _])=>alias);
                }
            }
            const aliasRegistry = new Map(), FUNCTION_PREFIX = "___parser_", PRIMITIVE_SIZES = {
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
                doublebe: 8
            }, PRIMITIVE_NAMES = {
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
                doublebe: "Float64"
            }, PRIMITIVE_LITTLE_ENDIANS = {
                uint8: !1,
                uint16le: !0,
                uint16be: !1,
                uint32le: !0,
                uint32be: !1,
                int8: !1,
                int16le: !0,
                int16be: !1,
                int32le: !0,
                int32be: !1,
                int64be: !1,
                int64le: !0,
                uint64be: !1,
                uint64le: !0,
                floatle: !0,
                floatbe: !1,
                doublele: !0,
                doublebe: !1
            };
            class Parser {
                constructor(){
                    this.varName = "", this.type = "", this.options = {}, this.endian = "be", this.useContextVariables = !1;
                }
                static start() {
                    return new Parser();
                }
                primitiveGenerateN(type, ctx) {
                    const typeName = PRIMITIVE_NAMES[type], littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                    ctx.pushCode(`${ctx.generateVariable(this.varName)} = dataView.get${typeName}(offset, ${littleEndian});`), ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
                }
                primitiveN(type, varName, options) {
                    return this.setNextParser(type, varName, options);
                }
                useThisEndian(type) {
                    return type + this.endian.toLowerCase();
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
                    if (!DataView.prototype.getBigInt64) throw Error("BigInt64 is unsupported on this runtime");
                }
                int64(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN(this.useThisEndian("int64"), varName, options);
                }
                int64be(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN("int64be", varName, options);
                }
                int64le(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN("int64le", varName, options);
                }
                uint64(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN(this.useThisEndian("uint64"), varName, options);
                }
                uint64be(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN("uint64be", varName, options);
                }
                uint64le(varName, options = {}) {
                    return this.bigIntVersionCheck(), this.primitiveN("uint64le", varName, options);
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
                    return options.length = size, this.setNextParser("bit", varName, options);
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
                    return aliasRegistry.set(alias, this), this.alias = alias, this;
                }
                skip(length, options = {}) {
                    return this.seek(length, options);
                }
                seek(relOffset, options = {}) {
                    if (options.assert) throw Error("assert option on seek is not allowed.");
                    return this.setNextParser("seek", "", {
                        length: relOffset
                    });
                }
                string(varName, options) {
                    if (!options.zeroTerminated && !options.length && !options.greedy) throw Error("One of length, zeroTerminated, or greedy must be defined for string.");
                    if ((options.zeroTerminated || options.length) && options.greedy) throw Error("greedy is mutually exclusive with length and zeroTerminated for string.");
                    if (options.stripNull && !(options.length || options.greedy)) throw Error("length or greedy must be defined if stripNull is enabled.");
                    return options.encoding = options.encoding || "utf8", this.setNextParser("string", varName, options);
                }
                buffer(varName, options) {
                    if (!options.length && !options.readUntil) throw Error("length or readUntil must be defined for buffer.");
                    return this.setNextParser("buffer", varName, options);
                }
                wrapped(varName, options) {
                    if ("object" != typeof options && "object" == typeof varName && (options = varName, varName = ""), !options || !options.wrapper || !options.type) throw Error("Both wrapper and type must be defined for wrapped.");
                    if (!options.length && !options.readUntil) throw Error("length or readUntil must be defined for wrapped.");
                    return this.setNextParser("wrapper", varName, options);
                }
                array(varName, options) {
                    if (!options.readUntil && !options.length && !options.lengthInBytes) throw Error("One of readUntil, length and lengthInBytes must be defined for array.");
                    if (!options.type) throw Error("type is required for array.");
                    if ("string" == typeof options.type && !aliasRegistry.has(options.type) && !(options.type in PRIMITIVE_SIZES)) throw Error(`Array element type "${options.type}" is unkown.`);
                    return this.setNextParser("array", varName, options);
                }
                choice(varName, options) {
                    if ("object" != typeof options && "object" == typeof varName && (options = varName, varName = ""), !options) throw Error("tag and choices are are required for choice.");
                    if (!options.tag) throw Error("tag is requird for choice.");
                    if (!options.choices) throw Error("choices is required for choice.");
                    for(const keyString in options.choices){
                        const key = parseInt(keyString, 10), value = options.choices[key];
                        if (isNaN(key)) throw Error(`Choice key "${keyString}" is not a number.`);
                        if ("string" == typeof value && !aliasRegistry.has(value) && !(value in PRIMITIVE_SIZES)) throw Error(`Choice type "${value}" is unkown.`);
                    }
                    return this.setNextParser("choice", varName, options);
                }
                nest(varName, options) {
                    if ("object" != typeof options && "object" == typeof varName && (options = varName, varName = ""), !options || !options.type) throw Error("type is required for nest.");
                    if (!(options.type instanceof Parser) && !aliasRegistry.has(options.type)) throw Error("type must be a known parser name or a Parser object.");
                    if (!(options.type instanceof Parser) && !varName) throw Error("type must be a Parser object if the variable name is omitted.");
                    return this.setNextParser("nest", varName, options);
                }
                pointer(varName, options) {
                    if (!options.offset) throw Error("offset is required for pointer.");
                    if (!options.type) throw Error("type is required for pointer.");
                    if ("string" == typeof options.type && !(options.type in PRIMITIVE_SIZES) && !aliasRegistry.has(options.type)) throw Error(`Pointer type "${options.type}" is unkown.`);
                    return this.setNextParser("pointer", varName, options);
                }
                saveOffset(varName, options = {}) {
                    return this.setNextParser("saveOffset", varName, options);
                }
                endianness(endianness) {
                    switch(endianness.toLowerCase()){
                        case "little":
                            this.endian = "le";
                            break;
                        case "big":
                            this.endian = "be";
                            break;
                        default:
                            throw Error('endianness must be one of "little" or "big"');
                    }
                    return this;
                }
                endianess(endianess) {
                    return this.endianness(endianess);
                }
                useContextVars(useContextVariables = !0) {
                    return this.useContextVariables = useContextVariables, this;
                }
                create(constructorFn) {
                    if (!(constructorFn instanceof Function)) throw Error("Constructor must be a Function object.");
                    return this.constructorFn = constructorFn, this;
                }
                getContext(importPath) {
                    const ctx = new Context(importPath, this.useContextVariables);
                    return ctx.pushCode("var dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);"), this.alias ? (this.addAliasedCode(ctx), ctx.pushCode(`return ${FUNCTION_PREFIX + this.alias}(0).result;`)) : this.addRawCode(ctx), ctx;
                }
                getCode() {
                    return this.getContext("imports").code;
                }
                addRawCode(ctx) {
                    ctx.pushCode("var offset = 0;"), ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`), ctx.pushCode("vars.$parent = null;"), ctx.pushCode("vars.$root = vars;"), this.generate(ctx), this.resolveReferences(ctx), ctx.pushCode("delete vars.$parent;"), ctx.pushCode("delete vars.$root;"), ctx.pushCode("return vars;");
                }
                addAliasedCode(ctx) {
                    return ctx.pushCode(`function ${FUNCTION_PREFIX + this.alias}(offset, context) {`), ctx.pushCode(`var vars = ${this.constructorFn ? "new constructorFn()" : "{}"};`), ctx.pushCode("var ctx = Object.assign({$parent: null, $root: vars}, context || {});"), ctx.pushCode("vars = Object.assign(vars, ctx);"), this.generate(ctx), ctx.markResolved(this.alias), this.resolveReferences(ctx), ctx.pushCode("Object.keys(ctx).forEach(function (item) { delete vars[item]; });"), ctx.pushCode("return { offset: offset, result: vars };"), ctx.pushCode("}"), ctx;
                }
                resolveReferences(ctx) {
                    const references = ctx.getUnresolvedReferences();
                    ctx.markRequested(references), references.forEach((alias)=>{
                        var _a;
                        null === (_a = aliasRegistry.get(alias)) || void 0 === _a || _a.addAliasedCode(ctx);
                    });
                }
                compile() {
                    const importPath = "imports", ctx = this.getContext(importPath);
                    this.compiled = Function(importPath, "TextDecoder", `return function (buffer, constructorFn) { ${ctx.code} };`)(ctx.imports, TextDecoder);
                }
                sizeOf() {
                    let size = NaN;
                    if (Object.keys(PRIMITIVE_SIZES).indexOf(this.type) >= 0) size = PRIMITIVE_SIZES[this.type];
                    else if ("string" === this.type && "number" == typeof this.options.length) size = this.options.length;
                    else if ("buffer" === this.type && "number" == typeof this.options.length) size = this.options.length;
                    else if ("array" === this.type && "number" == typeof this.options.length) {
                        let elementSize = NaN;
                        "string" == typeof this.options.type ? elementSize = PRIMITIVE_SIZES[this.options.type] : this.options.type instanceof Parser && (elementSize = this.options.type.sizeOf()), size = this.options.length * elementSize;
                    } else "seek" === this.type ? size = this.options.length : "nest" === this.type ? size = this.options.type.sizeOf() : this.type || (size = 0);
                    return this.next && (size += this.next.sizeOf()), size;
                }
                parse(buffer) {
                    return this.compiled || this.compile(), this.compiled(buffer, this.constructorFn);
                }
                setNextParser(type, varName, options) {
                    const parser = new Parser();
                    return parser.type = type, parser.varName = varName, parser.options = options, parser.endian = this.endian, this.head ? this.head.next = parser : this.next = parser, this.head = parser, this;
                }
                generate(ctx) {
                    if (this.type) {
                        switch(this.type){
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
                        }
                        "bit" !== this.type && this.generateAssert(ctx);
                    }
                    const varName = ctx.generateVariable(this.varName);
                    return this.options.formatter && "bit" !== this.type && this.generateFormatter(ctx, varName, this.options.formatter), this.generateNext(ctx);
                }
                generateAssert(ctx) {
                    if (!this.options.assert) return;
                    const varName = ctx.generateVariable(this.varName);
                    switch(typeof this.options.assert){
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
                            throw Error("assert option must be a string, number or a function.");
                    }
                    ctx.generateError(`"Assertion error: ${varName} is " + ${JSON.stringify(this.options.assert.toString())}`), ctx.pushCode("}");
                }
                generateNext(ctx) {
                    return this.next && (ctx = this.next.generate(ctx)), ctx;
                }
                generateBit(ctx) {
                    const parser = JSON.parse(JSON.stringify(this));
                    if (parser.options = this.options, parser.generateAssert = this.generateAssert.bind(this), parser.generateFormatter = this.generateFormatter.bind(this), parser.varName = ctx.generateVariable(parser.varName), ctx.bitFields.push(parser), !this.next || this.next && 0 > [
                        "bit",
                        "nest"
                    ].indexOf(this.next.type)) {
                        const val = ctx.generateTmpVariable();
                        ctx.pushCode(`var ${val} = 0;`);
                        const getMaxBits = (from = 0)=>{
                            let sum = 0;
                            for(let i = from; i < ctx.bitFields.length; i++){
                                const length = ctx.bitFields[i].options.length;
                                if (sum + length > 32) break;
                                sum += length;
                            }
                            return sum;
                        }, getBytes = (sum)=>{
                            return sum <= 8 ? (ctx.pushCode(`${val} = dataView.getUint8(offset);`), sum = 8) : sum <= 16 ? (ctx.pushCode(`${val} = dataView.getUint16(offset);`), sum = 16) : sum <= 24 ? (ctx.pushCode(`${val} = (dataView.getUint16(offset) << 8) | dataView.getUint8(offset + 2);`), sum = 24) : (ctx.pushCode(`${val} = dataView.getUint32(offset);`), sum = 32), ctx.pushCode(`offset += ${sum / 8};`), sum;
                        };
                        let bitOffset = 0;
                        const isBigEndian = "be" === this.endian;
                        let sum = 0, rem = 0;
                        ctx.bitFields.forEach((parser, i)=>{
                            let length = parser.options.length;
                            if (length > rem) {
                                if (rem) {
                                    const mask = -1 >>> 32 - rem;
                                    ctx.pushCode(`${parser.varName} = (${val} & 0x${mask.toString(16)}) << ${length - rem};`), length -= rem;
                                }
                                bitOffset = 0, rem = sum = getBytes(getMaxBits(i) - rem);
                            }
                            const offset = isBigEndian ? sum - bitOffset - length : bitOffset, mask1 = -1 >>> 32 - length;
                            ctx.pushCode(`${parser.varName} ${length < parser.options.length ? "|=" : "="} ${val} >> ${offset} & 0x${mask1.toString(16)};`), 32 === parser.options.length && ctx.pushCode(`${parser.varName} >>>= 0`), parser.options.assert && parser.generateAssert(ctx), parser.options.formatter && parser.generateFormatter(ctx, parser.varName, parser.options.formatter), bitOffset += length, rem -= length;
                        }), ctx.bitFields = [];
                    }
                }
                generateSeek(ctx) {
                    const length = ctx.generateOption(this.options.length);
                    ctx.pushCode(`offset += ${length};`);
                }
                generateString(ctx) {
                    const name = ctx.generateVariable(this.varName), start = ctx.generateTmpVariable(), encoding = this.options.encoding, isHex = "hex" === encoding.toLowerCase(), toHex = 'b => b.toString(16).padStart(2, "0")';
                    if (this.options.length && this.options.zeroTerminated) {
                        const len = this.options.length;
                        ctx.pushCode(`var ${start} = offset;`), ctx.pushCode(`while(dataView.getUint8(offset++) !== 0 && offset - ${start} < ${len});`);
                        const end = `offset - ${start} < ${len} ? offset - 1 : offset`;
                        ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, ${end}), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, ${end}));`);
                    } else if (this.options.length) {
                        const len1 = ctx.generateOption(this.options.length);
                        ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(offset, offset + ${len1}), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(offset, offset + ${len1}));`), ctx.pushCode(`offset += ${len1};`);
                    } else this.options.zeroTerminated ? (ctx.pushCode(`var ${start} = offset;`), ctx.pushCode("while(dataView.getUint8(offset++) !== 0);"), ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, offset - 1), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset - 1));`)) : this.options.greedy && (ctx.pushCode(`var ${start} = offset;`), ctx.pushCode("while(buffer.length > offset++);"), ctx.pushCode(isHex ? `${name} = Array.from(buffer.subarray(${start}, offset), ${toHex}).join('');` : `${name} = new TextDecoder('${encoding}').decode(buffer.subarray(${start}, offset));`));
                    this.options.stripNull && ctx.pushCode(`${name} = ${name}.replace(/\\x00+$/g, '')`);
                }
                generateBuffer(ctx) {
                    const varName = ctx.generateVariable(this.varName);
                    if ("function" == typeof this.options.readUntil) {
                        const pred = this.options.readUntil, start = ctx.generateTmpVariable(), cur = ctx.generateTmpVariable();
                        ctx.pushCode(`var ${start} = offset;`), ctx.pushCode(`var ${cur} = 0;`), ctx.pushCode("while (offset < buffer.length) {"), ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
                        const func = ctx.addImport(pred);
                        ctx.pushCode(`if (${func}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`), ctx.pushCode("offset += 1;"), ctx.pushCode("}"), ctx.pushCode(`${varName} = buffer.subarray(${start}, offset);`);
                    } else if ("eof" === this.options.readUntil) ctx.pushCode(`${varName} = buffer.subarray(offset);`);
                    else {
                        const len = ctx.generateOption(this.options.length);
                        ctx.pushCode(`${varName} = buffer.subarray(offset, offset + ${len});`), ctx.pushCode(`offset += ${len};`);
                    }
                    this.options.clone && ctx.pushCode(`${varName} = buffer.constructor.from(${varName});`);
                }
                generateArray(ctx) {
                    const length = ctx.generateOption(this.options.length), lengthInBytes = ctx.generateOption(this.options.lengthInBytes), type = this.options.type, counter = ctx.generateTmpVariable(), lhs = ctx.generateVariable(this.varName), item = ctx.generateTmpVariable(), key = this.options.key, isHash = "string" == typeof key;
                    if (isHash ? ctx.pushCode(`${lhs} = {};`) : ctx.pushCode(`${lhs} = [];`), "function" == typeof this.options.readUntil ? ctx.pushCode("do {") : "eof" === this.options.readUntil ? ctx.pushCode(`for (var ${counter} = 0; offset < buffer.length; ${counter}++) {`) : void 0 !== lengthInBytes ? ctx.pushCode(`for (var ${counter} = offset + ${lengthInBytes}; offset < ${counter}; ) {`) : ctx.pushCode(`for (var ${counter} = ${length}; ${counter} > 0; ${counter}--) {`), "string" == typeof type) {
                        if (aliasRegistry.get(type)) {
                            const tempVar = ctx.generateTmpVariable();
                            if (ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`), ctx.useContextVariables) {
                                const parentVar = ctx.generateVariable();
                                ctx.pushCode(`$parent: ${parentVar},`), ctx.pushCode(`$root: ${parentVar}.$root,`), this.options.readUntil || void 0 !== lengthInBytes || ctx.pushCode(`$index: ${length} - ${counter},`);
                            }
                            ctx.pushCode("});"), ctx.pushCode(`var ${item} = ${tempVar}.result; offset = ${tempVar}.offset;`), type !== this.alias && ctx.addReference(type);
                        } else {
                            const typeName = PRIMITIVE_NAMES[type], littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                            ctx.pushCode(`var ${item} = dataView.get${typeName}(offset, ${littleEndian});`), ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
                        }
                    } else if (type instanceof Parser) {
                        ctx.pushCode(`var ${item} = {};`);
                        const parentVar1 = ctx.generateVariable();
                        ctx.pushScope(item), ctx.useContextVariables && (ctx.pushCode(`${item}.$parent = ${parentVar1};`), ctx.pushCode(`${item}.$root = ${parentVar1}.$root;`), this.options.readUntil || void 0 !== lengthInBytes || ctx.pushCode(`${item}.$index = ${length} - ${counter};`)), type.generate(ctx), ctx.useContextVariables && (ctx.pushCode(`delete ${item}.$parent;`), ctx.pushCode(`delete ${item}.$root;`), ctx.pushCode(`delete ${item}.$index;`)), ctx.popScope();
                    }
                    if (isHash ? ctx.pushCode(`${lhs}[${item}.${key}] = ${item};`) : ctx.pushCode(`${lhs}.push(${item});`), ctx.pushCode("}"), "function" == typeof this.options.readUntil) {
                        const pred = this.options.readUntil, func = ctx.addImport(pred);
                        ctx.pushCode(`while (!${func}.call(${ctx.generateVariable()}, ${item}, buffer.subarray(offset)));`);
                    }
                }
                generateChoiceCase(ctx, varName, type) {
                    if ("string" == typeof type) {
                        const varName1 = ctx.generateVariable(this.varName);
                        if (aliasRegistry.has(type)) {
                            const tempVar = ctx.generateTmpVariable();
                            ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + type}(offset, {`), ctx.useContextVariables && (ctx.pushCode(`$parent: ${varName1}.$parent,`), ctx.pushCode(`$root: ${varName1}.$root,`)), ctx.pushCode("});"), ctx.pushCode(`${varName1} = ${tempVar}.result; offset = ${tempVar}.offset;`), type !== this.alias && ctx.addReference(type);
                        } else {
                            const typeName = PRIMITIVE_NAMES[type], littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                            ctx.pushCode(`${varName1} = dataView.get${typeName}(offset, ${littleEndian});`), ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]}`);
                        }
                    } else type instanceof Parser && (ctx.pushPath(varName), type.generate(ctx), ctx.popPath(varName));
                }
                generateChoice(ctx) {
                    const tag = ctx.generateOption(this.options.tag), nestVar = ctx.generateVariable(this.varName);
                    if (this.varName && (ctx.pushCode(`${nestVar} = {};`), ctx.useContextVariables)) {
                        const parentVar = ctx.generateVariable();
                        ctx.pushCode(`${nestVar}.$parent = ${parentVar};`), ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
                    }
                    for(const tagString in ctx.pushCode(`switch(${tag}) {`), this.options.choices){
                        const tag1 = parseInt(tagString, 10), type = this.options.choices[tag1];
                        ctx.pushCode(`case ${tag1}:`), this.generateChoiceCase(ctx, this.varName, type), ctx.pushCode("break;");
                    }
                    ctx.pushCode("default:"), this.options.defaultChoice ? this.generateChoiceCase(ctx, this.varName, this.options.defaultChoice) : ctx.generateError(`"Met undefined tag value " + ${tag} + " at choice"`), ctx.pushCode("}"), this.varName && ctx.useContextVariables && (ctx.pushCode(`delete ${nestVar}.$parent;`), ctx.pushCode(`delete ${nestVar}.$root;`));
                }
                generateNest(ctx) {
                    const nestVar = ctx.generateVariable(this.varName);
                    if (this.options.type instanceof Parser) {
                        if (this.varName && (ctx.pushCode(`${nestVar} = {};`), ctx.useContextVariables)) {
                            const parentVar = ctx.generateVariable();
                            ctx.pushCode(`${nestVar}.$parent = ${parentVar};`), ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
                        }
                        ctx.pushPath(this.varName), this.options.type.generate(ctx), ctx.popPath(this.varName), this.varName && ctx.useContextVariables && ctx.useContextVariables && (ctx.pushCode(`delete ${nestVar}.$parent;`), ctx.pushCode(`delete ${nestVar}.$root;`));
                    } else if (aliasRegistry.has(this.options.type)) {
                        const tempVar = ctx.generateTmpVariable();
                        if (ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(offset, {`), ctx.useContextVariables) {
                            const parentVar1 = ctx.generateVariable();
                            ctx.pushCode(`$parent: ${parentVar1},`), ctx.pushCode(`$root: ${parentVar1}.$root,`);
                        }
                        ctx.pushCode("});"), ctx.pushCode(`${nestVar} = ${tempVar}.result; offset = ${tempVar}.offset;`), this.options.type !== this.alias && ctx.addReference(this.options.type);
                    }
                }
                generateWrapper(ctx) {
                    const wrapperVar = ctx.generateVariable(this.varName), wrappedBuf = ctx.generateTmpVariable();
                    if ("function" == typeof this.options.readUntil) {
                        const pred = this.options.readUntil, start = ctx.generateTmpVariable(), cur = ctx.generateTmpVariable();
                        ctx.pushCode(`var ${start} = offset;`), ctx.pushCode(`var ${cur} = 0;`), ctx.pushCode("while (offset < buffer.length) {"), ctx.pushCode(`${cur} = dataView.getUint8(offset);`);
                        const func = ctx.addImport(pred);
                        ctx.pushCode(`if (${func}.call(${ctx.generateVariable()}, ${cur}, buffer.subarray(offset))) break;`), ctx.pushCode("offset += 1;"), ctx.pushCode("}"), ctx.pushCode(`${wrappedBuf} = buffer.subarray(${start}, offset);`);
                    } else if ("eof" === this.options.readUntil) ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset);`);
                    else {
                        const len = ctx.generateOption(this.options.length);
                        ctx.pushCode(`${wrappedBuf} = buffer.subarray(offset, offset + ${len});`), ctx.pushCode(`offset += ${len};`);
                    }
                    this.options.clone && ctx.pushCode(`${wrappedBuf} = buffer.constructor.from(${wrappedBuf});`);
                    const tempBuf = ctx.generateTmpVariable(), tempOff = ctx.generateTmpVariable(), tempView = ctx.generateTmpVariable(), func1 = ctx.addImport(this.options.wrapper);
                    if (ctx.pushCode(`${wrappedBuf} = ${func1}.call(this, ${wrappedBuf}).subarray(0);`), ctx.pushCode(`var ${tempBuf} = buffer;`), ctx.pushCode(`var ${tempOff} = offset;`), ctx.pushCode(`var ${tempView} = dataView;`), ctx.pushCode(`buffer = ${wrappedBuf};`), ctx.pushCode("offset = 0;"), ctx.pushCode("dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);"), this.options.type instanceof Parser) this.varName && ctx.pushCode(`${wrapperVar} = {};`), ctx.pushPath(this.varName), this.options.type.generate(ctx), ctx.popPath(this.varName);
                    else if (aliasRegistry.has(this.options.type)) {
                        const tempVar = ctx.generateTmpVariable();
                        ctx.pushCode(`var ${tempVar} = ${FUNCTION_PREFIX + this.options.type}(0);`), ctx.pushCode(`${wrapperVar} = ${tempVar}.result;`), this.options.type !== this.alias && ctx.addReference(this.options.type);
                    }
                    ctx.pushCode(`buffer = ${tempBuf};`), ctx.pushCode(`dataView = ${tempView};`), ctx.pushCode(`offset = ${tempOff};`);
                }
                generateFormatter(ctx, varName, formatter) {
                    if ("function" == typeof formatter) {
                        const func = ctx.addImport(formatter);
                        ctx.pushCode(`${varName} = ${func}.call(${ctx.generateVariable()}, ${varName});`);
                    }
                }
                generatePointer(ctx) {
                    const type = this.options.type, offset = ctx.generateOption(this.options.offset), tempVar = ctx.generateTmpVariable(), nestVar = ctx.generateVariable(this.varName);
                    if (ctx.pushCode(`var ${tempVar} = offset;`), ctx.pushCode(`offset = ${offset};`), this.options.type instanceof Parser) {
                        if (ctx.pushCode(`${nestVar} = {};`), ctx.useContextVariables) {
                            const parentVar = ctx.generateVariable();
                            ctx.pushCode(`${nestVar}.$parent = ${parentVar};`), ctx.pushCode(`${nestVar}.$root = ${parentVar}.$root;`);
                        }
                        ctx.pushPath(this.varName), this.options.type.generate(ctx), ctx.popPath(this.varName), ctx.useContextVariables && (ctx.pushCode(`delete ${nestVar}.$parent;`), ctx.pushCode(`delete ${nestVar}.$root;`));
                    } else if (aliasRegistry.has(this.options.type)) {
                        const tempVar1 = ctx.generateTmpVariable();
                        if (ctx.pushCode(`var ${tempVar1} = ${FUNCTION_PREFIX + this.options.type}(offset, {`), ctx.useContextVariables) {
                            const parentVar1 = ctx.generateVariable();
                            ctx.pushCode(`$parent: ${parentVar1},`), ctx.pushCode(`$root: ${parentVar1}.$root,`);
                        }
                        ctx.pushCode("});"), ctx.pushCode(`${nestVar} = ${tempVar1}.result; offset = ${tempVar1}.offset;`), this.options.type !== this.alias && ctx.addReference(this.options.type);
                    } else if (Object.keys(PRIMITIVE_SIZES).indexOf(this.options.type) >= 0) {
                        const typeName = PRIMITIVE_NAMES[type], littleEndian = PRIMITIVE_LITTLE_ENDIANS[type];
                        ctx.pushCode(`${nestVar} = dataView.get${typeName}(offset, ${littleEndian});`), ctx.pushCode(`offset += ${PRIMITIVE_SIZES[type]};`);
                    }
                    ctx.pushCode(`offset = ${tempVar};`);
                }
                generateSaveOffset(ctx) {
                    const varName = ctx.generateVariable(this.varName);
                    ctx.pushCode(`${varName} = offset`);
                }
            }
        }
    }
]);
