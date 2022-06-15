(function() {
    "use strict";
    var a, b, c, d, e, f, g, h, i = function(a, b) {
        return function() {
            return a.apply(b, arguments);
        };
    }, j = function(a, b) {
        for(var c in b){
            if (k.call(b, c)) a[c] = b[c];
        }
        function d() {
            this.constructor = a;
        }
        d.prototype = b.prototype;
        a.prototype = new d();
        a.__super__ = b.prototype;
        return a;
    }, k = {}.hasOwnProperty;
    g = require("sax");
    c = require("events");
    a = require("./bom");
    f = require("./processors");
    h = require("timers").setImmediate;
    b = require("./defaults").defaults;
    d = function(a) {
        return (typeof a === "object" && a != null && Object.keys(a).length === 0);
    };
    e = function(a, b, c) {
        var d, e, f;
        for(d = 0, e = a.length; d < e; d++){
            f = a[d];
            b = f(b, c);
        }
        return b;
    };
    exports.Parser = (function(c) {
        j(l, c);
        function l(a) {
            this.parseStringPromise = i(this.parseStringPromise, this);
            this.parseString = i(this.parseString, this);
            this.reset = i(this.reset, this);
            this.assignOrPush = i(this.assignOrPush, this);
            this.processAsync = i(this.processAsync, this);
            var c, d, e;
            if (!(this instanceof exports.Parser)) {
                return new exports.Parser(a);
            }
            this.options = {};
            d = b["0.2"];
            for(c in d){
                if (!k.call(d, c)) continue;
                e = d[c];
                this.options[c] = e;
            }
            for(c in a){
                if (!k.call(a, c)) continue;
                e = a[c];
                this.options[c] = e;
            }
            if (this.options.xmlns) {
                this.options.xmlnskey = this.options.attrkey + "ns";
            }
            if (this.options.normalizeTags) {
                if (!this.options.tagNameProcessors) {
                    this.options.tagNameProcessors = [];
                }
                this.options.tagNameProcessors.unshift(f.normalize);
            }
            this.reset();
        }
        l.prototype.processAsync = function() {
            var a, b;
            try {
                if (this.remaining.length <= this.options.chunkSize) {
                    a = this.remaining;
                    this.remaining = "";
                    this.saxParser = this.saxParser.write(a);
                    return this.saxParser.close();
                } else {
                    a = this.remaining.substr(0, this.options.chunkSize);
                    this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
                    this.saxParser = this.saxParser.write(a);
                    return h(this.processAsync);
                }
            } catch (c) {
                b = c;
                if (!this.saxParser.errThrown) {
                    this.saxParser.errThrown = true;
                    return this.emit(b);
                }
            }
        };
        l.prototype.assignOrPush = function(a, b, c) {
            if (!(b in a)) {
                if (!this.options.explicitArray) {
                    return (a[b] = c);
                } else {
                    return (a[b] = [
                        c
                    ]);
                }
            } else {
                if (!(a[b] instanceof Array)) {
                    a[b] = [
                        a[b]
                    ];
                }
                return a[b].push(c);
            }
        };
        l.prototype.reset = function() {
            var a, b, c, f;
            this.removeAllListeners();
            this.saxParser = g.parser(this.options.strict, {
                trim: false,
                normalize: false,
                xmlns: this.options.xmlns
            });
            this.saxParser.errThrown = false;
            this.saxParser.onerror = (function(a) {
                return function(b) {
                    a.saxParser.resume();
                    if (!a.saxParser.errThrown) {
                        a.saxParser.errThrown = true;
                        return a.emit("error", b);
                    }
                };
            })(this);
            this.saxParser.onend = (function(a) {
                return function() {
                    if (!a.saxParser.ended) {
                        a.saxParser.ended = true;
                        return a.emit("end", a.resultObject);
                    }
                };
            })(this);
            this.saxParser.ended = false;
            this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
            this.resultObject = null;
            f = [];
            a = this.options.attrkey;
            b = this.options.charkey;
            this.saxParser.onopentag = (function(c) {
                return function(d) {
                    var g, h, i, j, l;
                    i = {};
                    i[b] = "";
                    if (!c.options.ignoreAttrs) {
                        l = d.attributes;
                        for(g in l){
                            if (!k.call(l, g)) continue;
                            if (!(a in i) && !c.options.mergeAttrs) {
                                i[a] = {};
                            }
                            h = c.options.attrValueProcessors ? e(c.options.attrValueProcessors, d.attributes[g], g) : d.attributes[g];
                            j = c.options.attrNameProcessors ? e(c.options.attrNameProcessors, g) : g;
                            if (c.options.mergeAttrs) {
                                c.assignOrPush(i, j, h);
                            } else {
                                i[a][j] = h;
                            }
                        }
                    }
                    i["#name"] = c.options.tagNameProcessors ? e(c.options.tagNameProcessors, d.name) : d.name;
                    if (c.options.xmlns) {
                        i[c.options.xmlnskey] = {
                            uri: d.uri,
                            local: d.local
                        };
                    }
                    return f.push(i);
                };
            })(this);
            this.saxParser.onclosetag = (function(a) {
                return function() {
                    var c, g, h, i, j, l, m, n, o, p;
                    l = f.pop();
                    j = l["#name"];
                    if (!a.options.explicitChildren || !a.options.preserveChildrenOrder) {
                        delete l["#name"];
                    }
                    if (l.cdata === true) {
                        c = l.cdata;
                        delete l.cdata;
                    }
                    o = f[f.length - 1];
                    if (l[b].match(/^\s*$/) && !c) {
                        g = l[b];
                        delete l[b];
                    } else {
                        if (a.options.trim) {
                            l[b] = l[b].trim();
                        }
                        if (a.options.normalize) {
                            l[b] = l[b].replace(/\s{2,}/g, " ").trim();
                        }
                        l[b] = a.options.valueProcessors ? e(a.options.valueProcessors, l[b], j) : l[b];
                        if (Object.keys(l).length === 1 && b in l && !a.EXPLICIT_CHARKEY) {
                            l = l[b];
                        }
                    }
                    if (d(l)) {
                        l = a.options.emptyTag !== "" ? a.options.emptyTag : g;
                    }
                    if (a.options.validator != null) {
                        p = "/" + (function() {
                            var a, b, c;
                            c = [];
                            for(a = 0, b = f.length; a < b; a++){
                                i = f[a];
                                c.push(i["#name"]);
                            }
                            return c;
                        })().concat(j).join("/");
                        (function() {
                            var b;
                            try {
                                return (l = a.options.validator(p, o && o[j], l));
                            } catch (c) {
                                b = c;
                                return a.emit("error", b);
                            }
                        })();
                    }
                    if (a.options.explicitChildren && !a.options.mergeAttrs && typeof l === "object") {
                        if (!a.options.preserveChildrenOrder) {
                            i = {};
                            if (a.options.attrkey in l) {
                                i[a.options.attrkey] = l[a.options.attrkey];
                                delete l[a.options.attrkey];
                            }
                            if (!a.options.charsAsChildren && a.options.charkey in l) {
                                i[a.options.charkey] = l[a.options.charkey];
                                delete l[a.options.charkey];
                            }
                            if (Object.getOwnPropertyNames(l).length > 0) {
                                i[a.options.childkey] = l;
                            }
                            l = i;
                        } else if (o) {
                            o[a.options.childkey] = o[a.options.childkey] || [];
                            m = {};
                            for(h in l){
                                if (!k.call(l, h)) continue;
                                m[h] = l[h];
                            }
                            o[a.options.childkey].push(m);
                            delete l["#name"];
                            if (Object.keys(l).length === 1 && b in l && !a.EXPLICIT_CHARKEY) {
                                l = l[b];
                            }
                        }
                    }
                    if (f.length > 0) {
                        return a.assignOrPush(o, j, l);
                    } else {
                        if (a.options.explicitRoot) {
                            n = l;
                            l = {};
                            l[j] = n;
                        }
                        a.resultObject = l;
                        a.saxParser.ended = true;
                        return a.emit("end", a.resultObject);
                    }
                };
            })(this);
            c = (function(a) {
                return function(c) {
                    var d, e;
                    e = f[f.length - 1];
                    if (e) {
                        e[b] += c;
                        if (a.options.explicitChildren && a.options.preserveChildrenOrder && a.options.charsAsChildren && (a.options.includeWhiteChars || c.replace(/\\n/g, "").trim() !== "")) {
                            e[a.options.childkey] = e[a.options.childkey] || [];
                            d = {
                                "#name": "__text__"
                            };
                            d[b] = c;
                            if (a.options.normalize) {
                                d[b] = d[b].replace(/\s{2,}/g, " ").trim();
                            }
                            e[a.options.childkey].push(d);
                        }
                        return e;
                    }
                };
            })(this);
            this.saxParser.ontext = c;
            return (this.saxParser.oncdata = (function(a) {
                return function(a) {
                    var b;
                    b = c(a);
                    if (b) {
                        return (b.cdata = true);
                    }
                };
            })(this));
        };
        l.prototype.parseString = function(b, c) {
            var d;
            if (c != null && typeof c === "function") {
                this.on("end", function(a) {
                    this.reset();
                    return c(null, a);
                });
                this.on("error", function(a) {
                    this.reset();
                    return c(a);
                });
            }
            try {
                b = b.toString();
                if (b.trim() === "") {
                    this.emit("end", null);
                    return true;
                }
                b = a.stripBOM(b);
                if (this.options.async) {
                    this.remaining = b;
                    h(this.processAsync);
                    return this.saxParser;
                }
                return this.saxParser.write(b).close();
            } catch (e) {
                d = e;
                if (!(this.saxParser.errThrown || this.saxParser.ended)) {
                    this.emit("error", d);
                    return (this.saxParser.errThrown = true);
                } else if (this.saxParser.ended) {
                    throw d;
                }
            }
        };
        l.prototype.parseStringPromise = function(a) {
            return new Promise((function(b) {
                return function(c, d) {
                    return b.parseString(a, function(a, b) {
                        if (a) {
                            return d(a);
                        } else {
                            return c(b);
                        }
                    });
                };
            })(this));
        };
        return l;
    })(c);
    exports.parseString = function(a, b, c) {
        var d, e, f;
        if (c != null) {
            if (typeof c === "function") {
                d = c;
            }
            if (typeof b === "object") {
                e = b;
            }
        } else {
            if (typeof b === "function") {
                d = b;
            }
            e = {};
        }
        f = new exports.Parser(e);
        return f.parseString(a, d);
    };
    exports.parseStringPromise = function(a, b) {
        var c, d;
        if (typeof b === "object") {
            c = b;
        }
        d = new exports.Parser(c);
        return d.parseStringPromise(a);
    };
}.call(this));
