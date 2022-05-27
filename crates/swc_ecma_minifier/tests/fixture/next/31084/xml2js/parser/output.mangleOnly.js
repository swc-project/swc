(function() {
    "use strict";
    var b, c, a, d, e, f, g, h, i = function(a, b) {
        return function() {
            return a.apply(b, arguments);
        };
    }, j = function(b, a) {
        for(var c in a){
            if (k.call(a, c)) b[c] = a[c];
        }
        function d() {
            this.constructor = b;
        }
        d.prototype = a.prototype;
        b.prototype = new d();
        b.__super__ = a.prototype;
        return b;
    }, k = {}.hasOwnProperty;
    g = require("sax");
    a = require("events");
    b = require("./bom");
    f = require("./processors");
    h = require("timers").setImmediate;
    c = require("./defaults").defaults;
    d = function(a) {
        return (typeof a === "object" && a != null && Object.keys(a).length === 0);
    };
    e = function(c, b, f) {
        var a, d, e;
        for(a = 0, d = c.length; a < d; a++){
            e = c[a];
            b = e(b, f);
        }
        return b;
    };
    exports.Parser = (function(l) {
        j(a, l);
        function a(b) {
            this.parseStringPromise = i(this.parseStringPromise, this);
            this.parseString = i(this.parseString, this);
            this.reset = i(this.reset, this);
            this.assignOrPush = i(this.assignOrPush, this);
            this.processAsync = i(this.processAsync, this);
            var a, d, e;
            if (!(this instanceof exports.Parser)) {
                return new exports.Parser(b);
            }
            this.options = {};
            d = c["0.2"];
            for(a in d){
                if (!k.call(d, a)) continue;
                e = d[a];
                this.options[a] = e;
            }
            for(a in b){
                if (!k.call(b, a)) continue;
                e = b[a];
                this.options[a] = e;
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
        a.prototype.processAsync = function() {
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
        a.prototype.assignOrPush = function(a, b, c) {
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
        a.prototype.reset = function() {
            var b, c, a, f;
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
            b = this.options.attrkey;
            c = this.options.charkey;
            this.saxParser.onopentag = (function(a) {
                return function(g) {
                    var h, i, d, j, l;
                    d = {};
                    d[c] = "";
                    if (!a.options.ignoreAttrs) {
                        l = g.attributes;
                        for(h in l){
                            if (!k.call(l, h)) continue;
                            if (!(b in d) && !a.options.mergeAttrs) {
                                d[b] = {};
                            }
                            i = a.options.attrValueProcessors ? e(a.options.attrValueProcessors, g.attributes[h], h) : g.attributes[h];
                            j = a.options.attrNameProcessors ? e(a.options.attrNameProcessors, h) : h;
                            if (a.options.mergeAttrs) {
                                a.assignOrPush(d, j, i);
                            } else {
                                d[b][j] = i;
                            }
                        }
                    }
                    d["#name"] = a.options.tagNameProcessors ? e(a.options.tagNameProcessors, g.name) : g.name;
                    if (a.options.xmlns) {
                        d[a.options.xmlnskey] = {
                            uri: g.uri,
                            local: g.local
                        };
                    }
                    return f.push(d);
                };
            })(this);
            this.saxParser.onclosetag = (function(a) {
                return function() {
                    var m, n, j, h, i, b, l, o, g, p;
                    b = f.pop();
                    i = b["#name"];
                    if (!a.options.explicitChildren || !a.options.preserveChildrenOrder) {
                        delete b["#name"];
                    }
                    if (b.cdata === true) {
                        m = b.cdata;
                        delete b.cdata;
                    }
                    g = f[f.length - 1];
                    if (b[c].match(/^\s*$/) && !m) {
                        n = b[c];
                        delete b[c];
                    } else {
                        if (a.options.trim) {
                            b[c] = b[c].trim();
                        }
                        if (a.options.normalize) {
                            b[c] = b[c].replace(/\s{2,}/g, " ").trim();
                        }
                        b[c] = a.options.valueProcessors ? e(a.options.valueProcessors, b[c], i) : b[c];
                        if (Object.keys(b).length === 1 && c in b && !a.EXPLICIT_CHARKEY) {
                            b = b[c];
                        }
                    }
                    if (d(b)) {
                        b = a.options.emptyTag !== "" ? a.options.emptyTag : n;
                    }
                    if (a.options.validator != null) {
                        p = "/" + (function() {
                            var a, c, b;
                            b = [];
                            for(a = 0, c = f.length; a < c; a++){
                                h = f[a];
                                b.push(h["#name"]);
                            }
                            return b;
                        })().concat(i).join("/");
                        (function() {
                            var c;
                            try {
                                return (b = a.options.validator(p, g && g[i], b));
                            } catch (d) {
                                c = d;
                                return a.emit("error", c);
                            }
                        })();
                    }
                    if (a.options.explicitChildren && !a.options.mergeAttrs && typeof b === "object") {
                        if (!a.options.preserveChildrenOrder) {
                            h = {};
                            if (a.options.attrkey in b) {
                                h[a.options.attrkey] = b[a.options.attrkey];
                                delete b[a.options.attrkey];
                            }
                            if (!a.options.charsAsChildren && a.options.charkey in b) {
                                h[a.options.charkey] = b[a.options.charkey];
                                delete b[a.options.charkey];
                            }
                            if (Object.getOwnPropertyNames(b).length > 0) {
                                h[a.options.childkey] = b;
                            }
                            b = h;
                        } else if (g) {
                            g[a.options.childkey] = g[a.options.childkey] || [];
                            l = {};
                            for(j in b){
                                if (!k.call(b, j)) continue;
                                l[j] = b[j];
                            }
                            g[a.options.childkey].push(l);
                            delete b["#name"];
                            if (Object.keys(b).length === 1 && c in b && !a.EXPLICIT_CHARKEY) {
                                b = b[c];
                            }
                        }
                    }
                    if (f.length > 0) {
                        return a.assignOrPush(g, i, b);
                    } else {
                        if (a.options.explicitRoot) {
                            o = b;
                            b = {};
                            b[i] = o;
                        }
                        a.resultObject = b;
                        a.saxParser.ended = true;
                        return a.emit("end", a.resultObject);
                    }
                };
            })(this);
            a = (function(a) {
                return function(e) {
                    var d, b;
                    b = f[f.length - 1];
                    if (b) {
                        b[c] += e;
                        if (a.options.explicitChildren && a.options.preserveChildrenOrder && a.options.charsAsChildren && (a.options.includeWhiteChars || e.replace(/\\n/g, "").trim() !== "")) {
                            b[a.options.childkey] = b[a.options.childkey] || [];
                            d = {
                                "#name": "__text__"
                            };
                            d[c] = e;
                            if (a.options.normalize) {
                                d[c] = d[c].replace(/\s{2,}/g, " ").trim();
                            }
                            b[a.options.childkey].push(d);
                        }
                        return b;
                    }
                };
            })(this);
            this.saxParser.ontext = a;
            return (this.saxParser.oncdata = (function(b) {
                return function(c) {
                    var b;
                    b = a(c);
                    if (b) {
                        return (b.cdata = true);
                    }
                };
            })(this));
        };
        a.prototype.parseString = function(a, d) {
            var c;
            if (d != null && typeof d === "function") {
                this.on("end", function(a) {
                    this.reset();
                    return d(null, a);
                });
                this.on("error", function(a) {
                    this.reset();
                    return d(a);
                });
            }
            try {
                a = a.toString();
                if (a.trim() === "") {
                    this.emit("end", null);
                    return true;
                }
                a = b.stripBOM(a);
                if (this.options.async) {
                    this.remaining = a;
                    h(this.processAsync);
                    return this.saxParser;
                }
                return this.saxParser.write(a).close();
            } catch (e) {
                c = e;
                if (!(this.saxParser.errThrown || this.saxParser.ended)) {
                    this.emit("error", c);
                    return (this.saxParser.errThrown = true);
                } else if (this.saxParser.ended) {
                    throw c;
                }
            }
        };
        a.prototype.parseStringPromise = function(a) {
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
        return a;
    })(a);
    exports.parseString = function(f, a, b) {
        var c, d, e;
        if (b != null) {
            if (typeof b === "function") {
                c = b;
            }
            if (typeof a === "object") {
                d = a;
            }
        } else {
            if (typeof a === "function") {
                c = a;
            }
            d = {};
        }
        e = new exports.Parser(d);
        return e.parseString(f, c);
    };
    exports.parseStringPromise = function(d, a) {
        var b, c;
        if (typeof a === "object") {
            b = a;
        }
        c = new exports.Parser(b);
        return c.parseStringPromise(d);
    };
}.call(this));
