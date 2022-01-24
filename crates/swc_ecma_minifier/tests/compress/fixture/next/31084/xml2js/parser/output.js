(function() {
    "use strict";
    var bom, defaults, events, isEmpty, processItem, processors1, sax, setImmediate, bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    }, extend = function(child, parent) {
        for(var key in parent)hasProp.call(parent, key) && (child[key] = parent[key]);
        function ctor() {
            this.constructor = child;
        }
        return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, child;
    }, hasProp = {}.hasOwnProperty;
    sax = require("sax"), events = require("events"), bom = require("./bom"), processors1 = require("./processors"), setImmediate = require("timers").setImmediate, defaults = require("./defaults").defaults, isEmpty = function(thing) {
        return "object" == typeof thing && null != thing && 0 === Object.keys(thing).length;
    }, processItem = function(processors, item, key) {
        var i, len;
        for(i = 0, len = processors.length; i < len; i++)item = processors[i](item, key);
        return item;
    }, exports.Parser = (function(superClass) {
        function Parser(opts) {
            var key, ref, value;
            if (this.parseStringPromise = bind(this.parseStringPromise, this), this.parseString = bind(this.parseString, this), this.reset = bind(this.reset, this), this.assignOrPush = bind(this.assignOrPush, this), this.processAsync = bind(this.processAsync, this), !(this instanceof exports.Parser)) return new exports.Parser(opts);
            for(key in this.options = {}, ref = defaults["0.2"])hasProp.call(ref, key) && (value = ref[key], this.options[key] = value);
            for(key in opts)hasProp.call(opts, key) && (value = opts[key], this.options[key] = value);
            this.options.xmlns && (this.options.xmlnskey = this.options.attrkey + "ns"), this.options.normalizeTags && (this.options.tagNameProcessors || (this.options.tagNameProcessors = []), this.options.tagNameProcessors.unshift(processors1.normalize)), this.reset();
        }
        return extend(Parser, superClass), Parser.prototype.processAsync = function() {
            var chunk, err;
            try {
                if (this.remaining.length <= this.options.chunkSize) return chunk = this.remaining, this.remaining = "", this.saxParser = this.saxParser.write(chunk), this.saxParser.close();
                return chunk = this.remaining.substr(0, this.options.chunkSize), this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length), this.saxParser = this.saxParser.write(chunk), setImmediate(this.processAsync);
            } catch (error1) {
                if (err = error1, !this.saxParser.errThrown) return this.saxParser.errThrown = !0, this.emit(err);
            }
        }, Parser.prototype.assignOrPush = function(obj, key, newValue) {
            return key in obj ? (obj[key] instanceof Array || (obj[key] = [
                obj[key]
            ]), obj[key].push(newValue)) : this.options.explicitArray ? obj[key] = [
                newValue
            ] : obj[key] = newValue;
        }, Parser.prototype.reset = function() {
            var attrkey, charkey, ontext, stack, _this, _this1, _this2, _this3, _this4;
            return this.removeAllListeners(), this.saxParser = sax.parser(this.options.strict, {
                trim: !1,
                normalize: !1,
                xmlns: this.options.xmlns
            }), this.saxParser.errThrown = !1, _this = this, this.saxParser.onerror = function(error) {
                if (_this.saxParser.resume(), !_this.saxParser.errThrown) return _this.saxParser.errThrown = !0, _this.emit("error", error);
            }, _this1 = this, this.saxParser.onend = function() {
                if (!_this1.saxParser.ended) return _this1.saxParser.ended = !0, _this1.emit("end", _this1.resultObject);
            }, this.saxParser.ended = !1, this.EXPLICIT_CHARKEY = this.options.explicitCharkey, this.resultObject = null, stack = [], attrkey = this.options.attrkey, charkey = this.options.charkey, _this2 = this, this.saxParser.onopentag = function(node) {
                var key, newValue, obj, processedKey, ref;
                if ((obj = {})[charkey] = "", !_this2.options.ignoreAttrs) for(key in ref = node.attributes)hasProp.call(ref, key) && (attrkey in obj || _this2.options.mergeAttrs || (obj[attrkey] = {}), newValue = _this2.options.attrValueProcessors ? processItem(_this2.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key], processedKey = _this2.options.attrNameProcessors ? processItem(_this2.options.attrNameProcessors, key) : key, _this2.options.mergeAttrs ? _this2.assignOrPush(obj, processedKey, newValue) : obj[attrkey][processedKey] = newValue);
                return obj["#name"] = _this2.options.tagNameProcessors ? processItem(_this2.options.tagNameProcessors, node.name) : node.name, _this2.options.xmlns && (obj[_this2.options.xmlnskey] = {
                    uri: node.uri,
                    local: node.local
                }), stack.push(obj);
            }, _this3 = this, this.saxParser.onclosetag = function() {
                var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
                if (nodeName = (obj = stack.pop())["#name"], _this3.options.explicitChildren && _this3.options.preserveChildrenOrder || delete obj["#name"], !0 === obj.cdata && (cdata = obj.cdata, delete obj.cdata), s = stack[stack.length - 1], obj[charkey].match(/^\s*$/) && !cdata ? (emptyStr = obj[charkey], delete obj[charkey]) : (_this3.options.trim && (obj[charkey] = obj[charkey].trim()), _this3.options.normalize && (obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim()), obj[charkey] = _this3.options.valueProcessors ? processItem(_this3.options.valueProcessors, obj[charkey], nodeName) : obj[charkey], 1 === Object.keys(obj).length && charkey in obj && !_this3.EXPLICIT_CHARKEY && (obj = obj[charkey])), isEmpty(obj) && (obj = "" !== _this3.options.emptyTag ? _this3.options.emptyTag : emptyStr), null != _this3.options.validator && (xpath = "/" + (function() {
                    var i, len, results;
                    for(i = 0, results = [], len = stack.length; i < len; i++)node = stack[i], results.push(node["#name"]);
                    return results;
                })().concat(nodeName).join("/"), (function() {
                    var err;
                    try {
                        obj = _this3.options.validator(xpath, s && s[nodeName], obj);
                    } catch (error1) {
                        return err = error1, _this3.emit("error", err);
                    }
                })()), _this3.options.explicitChildren && !_this3.options.mergeAttrs && "object" == typeof obj) if (_this3.options.preserveChildrenOrder) {
                    if (s) {
                        for(key in s[_this3.options.childkey] = s[_this3.options.childkey] || [], objClone = {}, obj)hasProp.call(obj, key) && (objClone[key] = obj[key]);
                        s[_this3.options.childkey].push(objClone), delete obj["#name"], 1 === Object.keys(obj).length && charkey in obj && !_this3.EXPLICIT_CHARKEY && (obj = obj[charkey]);
                    }
                } else node = {}, _this3.options.attrkey in obj && (node[_this3.options.attrkey] = obj[_this3.options.attrkey], delete obj[_this3.options.attrkey]), !_this3.options.charsAsChildren && _this3.options.charkey in obj && (node[_this3.options.charkey] = obj[_this3.options.charkey], delete obj[_this3.options.charkey]), Object.getOwnPropertyNames(obj).length > 0 && (node[_this3.options.childkey] = obj), obj = node;
                return stack.length > 0 ? _this3.assignOrPush(s, nodeName, obj) : (_this3.options.explicitRoot && (old = obj, (obj = {})[nodeName] = old), _this3.resultObject = obj, _this3.saxParser.ended = !0, _this3.emit("end", _this3.resultObject));
            }, _this4 = this, ontext = function(text) {
                var charChild, s;
                if (s = stack[stack.length - 1]) return s[charkey] += text, _this4.options.explicitChildren && _this4.options.preserveChildrenOrder && _this4.options.charsAsChildren && (_this4.options.includeWhiteChars || "" !== text.replace(/\\n/g, "").trim()) && (s[_this4.options.childkey] = s[_this4.options.childkey] || [], (charChild = {
                    "#name": "__text__"
                })[charkey] = text, _this4.options.normalize && (charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim()), s[_this4.options.childkey].push(charChild)), s;
            }, this.saxParser.ontext = ontext, this.saxParser.oncdata = function(text) {
                var s;
                if (s = ontext(text)) return s.cdata = !0;
            };
        }, Parser.prototype.parseString = function(str, cb) {
            var err1;
            null != cb && "function" == typeof cb && (this.on("end", function(result) {
                return this.reset(), cb(null, result);
            }), this.on("error", function(err) {
                return this.reset(), cb(err);
            }));
            try {
                if (str = str.toString(), "" === str.trim()) return this.emit("end", null), !0;
                if (str = bom.stripBOM(str), this.options.async) return this.remaining = str, setImmediate(this.processAsync), this.saxParser;
                return this.saxParser.write(str).close();
            } catch (error1) {
                if (err1 = error1, !(this.saxParser.errThrown || this.saxParser.ended)) return this.emit("error", err1), this.saxParser.errThrown = !0;
                if (this.saxParser.ended) throw err1;
            }
        }, Parser.prototype.parseStringPromise = function(str) {
            var _this;
            return new Promise((_this = this, function(resolve, reject) {
                return _this.parseString(str, function(err, value) {
                    return err ? reject(err) : resolve(value);
                });
            }));
        }, Parser;
    })(events), exports.parseString = function(str, a, b) {
        var cb, options;
        return null != b ? ("function" == typeof b && (cb = b), "object" == typeof a && (options = a)) : ("function" == typeof a && (cb = a), options = {}), new exports.Parser(options).parseString(str, cb);
    }, exports.parseStringPromise = function(str, a) {
        var options;
        return "object" == typeof a && (options = a), new exports.Parser(options).parseStringPromise(str);
    };
}).call(this);
