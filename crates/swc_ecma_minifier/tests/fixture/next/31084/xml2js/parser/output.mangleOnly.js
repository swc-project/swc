(function() {
    "use strict";
    var t, r, e, s, i, n, o, a, h = function(t, r) {
        return function() {
            return t.apply(r, arguments);
        };
    }, p = function(t, r) {
        for(var e in r){
            if (u.call(r, e)) t[e] = r[e];
        }
        function s() {
            this.constructor = t;
        }
        s.prototype = r.prototype;
        t.prototype = new s();
        t.__super__ = r.prototype;
        return t;
    }, u = {}.hasOwnProperty;
    o = require("sax");
    e = require("events");
    t = require("./bom");
    n = require("./processors");
    a = require("timers").setImmediate;
    r = require("./defaults").defaults;
    s = function(t) {
        return (typeof t === "object" && t != null && Object.keys(t).length === 0);
    };
    i = function(t, r, e) {
        var s, i, n;
        for(s = 0, i = t.length; s < i; s++){
            n = t[s];
            r = n(r, e);
        }
        return r;
    };
    exports.Parser = (function(e) {
        p(c, e);
        function c(t) {
            this.parseStringPromise = h(this.parseStringPromise, this);
            this.parseString = h(this.parseString, this);
            this.reset = h(this.reset, this);
            this.assignOrPush = h(this.assignOrPush, this);
            this.processAsync = h(this.processAsync, this);
            var e, s, i;
            if (!(this instanceof exports.Parser)) {
                return new exports.Parser(t);
            }
            this.options = {};
            s = r["0.2"];
            for(e in s){
                if (!u.call(s, e)) continue;
                i = s[e];
                this.options[e] = i;
            }
            for(e in t){
                if (!u.call(t, e)) continue;
                i = t[e];
                this.options[e] = i;
            }
            if (this.options.xmlns) {
                this.options.xmlnskey = this.options.attrkey + "ns";
            }
            if (this.options.normalizeTags) {
                if (!this.options.tagNameProcessors) {
                    this.options.tagNameProcessors = [];
                }
                this.options.tagNameProcessors.unshift(n.normalize);
            }
            this.reset();
        }
        c.prototype.processAsync = function() {
            var t, r;
            try {
                if (this.remaining.length <= this.options.chunkSize) {
                    t = this.remaining;
                    this.remaining = "";
                    this.saxParser = this.saxParser.write(t);
                    return this.saxParser.close();
                } else {
                    t = this.remaining.substr(0, this.options.chunkSize);
                    this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
                    this.saxParser = this.saxParser.write(t);
                    return a(this.processAsync);
                }
            } catch (e) {
                r = e;
                if (!this.saxParser.errThrown) {
                    this.saxParser.errThrown = true;
                    return this.emit(r);
                }
            }
        };
        c.prototype.assignOrPush = function(t, r, e) {
            if (!(r in t)) {
                if (!this.options.explicitArray) {
                    return (t[r] = e);
                } else {
                    return (t[r] = [
                        e
                    ]);
                }
            } else {
                if (!(t[r] instanceof Array)) {
                    t[r] = [
                        t[r]
                    ];
                }
                return t[r].push(e);
            }
        };
        c.prototype.reset = function() {
            var t, r, e, n;
            this.removeAllListeners();
            this.saxParser = o.parser(this.options.strict, {
                trim: false,
                normalize: false,
                xmlns: this.options.xmlns
            });
            this.saxParser.errThrown = false;
            this.saxParser.onerror = (function(t) {
                return function(r) {
                    t.saxParser.resume();
                    if (!t.saxParser.errThrown) {
                        t.saxParser.errThrown = true;
                        return t.emit("error", r);
                    }
                };
            })(this);
            this.saxParser.onend = (function(t) {
                return function() {
                    if (!t.saxParser.ended) {
                        t.saxParser.ended = true;
                        return t.emit("end", t.resultObject);
                    }
                };
            })(this);
            this.saxParser.ended = false;
            this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
            this.resultObject = null;
            n = [];
            t = this.options.attrkey;
            r = this.options.charkey;
            this.saxParser.onopentag = (function(e) {
                return function(s) {
                    var o, a, h, p, c;
                    h = {};
                    h[r] = "";
                    if (!e.options.ignoreAttrs) {
                        c = s.attributes;
                        for(o in c){
                            if (!u.call(c, o)) continue;
                            if (!(t in h) && !e.options.mergeAttrs) {
                                h[t] = {};
                            }
                            a = e.options.attrValueProcessors ? i(e.options.attrValueProcessors, s.attributes[o], o) : s.attributes[o];
                            p = e.options.attrNameProcessors ? i(e.options.attrNameProcessors, o) : o;
                            if (e.options.mergeAttrs) {
                                e.assignOrPush(h, p, a);
                            } else {
                                h[t][p] = a;
                            }
                        }
                    }
                    h["#name"] = e.options.tagNameProcessors ? i(e.options.tagNameProcessors, s.name) : s.name;
                    if (e.options.xmlns) {
                        h[e.options.xmlnskey] = {
                            uri: s.uri,
                            local: s.local
                        };
                    }
                    return n.push(h);
                };
            })(this);
            this.saxParser.onclosetag = (function(t) {
                return function() {
                    var e, o, a, h, p, c, l, f, m, P;
                    c = n.pop();
                    p = c["#name"];
                    if (!t.options.explicitChildren || !t.options.preserveChildrenOrder) {
                        delete c["#name"];
                    }
                    if (c.cdata === true) {
                        e = c.cdata;
                        delete c.cdata;
                    }
                    m = n[n.length - 1];
                    if (c[r].match(/^\s*$/) && !e) {
                        o = c[r];
                        delete c[r];
                    } else {
                        if (t.options.trim) {
                            c[r] = c[r].trim();
                        }
                        if (t.options.normalize) {
                            c[r] = c[r].replace(/\s{2,}/g, " ").trim();
                        }
                        c[r] = t.options.valueProcessors ? i(t.options.valueProcessors, c[r], p) : c[r];
                        if (Object.keys(c).length === 1 && r in c && !t.EXPLICIT_CHARKEY) {
                            c = c[r];
                        }
                    }
                    if (s(c)) {
                        c = t.options.emptyTag !== "" ? t.options.emptyTag : o;
                    }
                    if (t.options.validator != null) {
                        P = "/" + (function() {
                            var t, r, e;
                            e = [];
                            for(t = 0, r = n.length; t < r; t++){
                                h = n[t];
                                e.push(h["#name"]);
                            }
                            return e;
                        })().concat(p).join("/");
                        (function() {
                            var r;
                            try {
                                return (c = t.options.validator(P, m && m[p], c));
                            } catch (e) {
                                r = e;
                                return t.emit("error", r);
                            }
                        })();
                    }
                    if (t.options.explicitChildren && !t.options.mergeAttrs && typeof c === "object") {
                        if (!t.options.preserveChildrenOrder) {
                            h = {};
                            if (t.options.attrkey in c) {
                                h[t.options.attrkey] = c[t.options.attrkey];
                                delete c[t.options.attrkey];
                            }
                            if (!t.options.charsAsChildren && t.options.charkey in c) {
                                h[t.options.charkey] = c[t.options.charkey];
                                delete c[t.options.charkey];
                            }
                            if (Object.getOwnPropertyNames(c).length > 0) {
                                h[t.options.childkey] = c;
                            }
                            c = h;
                        } else if (m) {
                            m[t.options.childkey] = m[t.options.childkey] || [];
                            l = {};
                            for(a in c){
                                if (!u.call(c, a)) continue;
                                l[a] = c[a];
                            }
                            m[t.options.childkey].push(l);
                            delete c["#name"];
                            if (Object.keys(c).length === 1 && r in c && !t.EXPLICIT_CHARKEY) {
                                c = c[r];
                            }
                        }
                    }
                    if (n.length > 0) {
                        return t.assignOrPush(m, p, c);
                    } else {
                        if (t.options.explicitRoot) {
                            f = c;
                            c = {};
                            c[p] = f;
                        }
                        t.resultObject = c;
                        t.saxParser.ended = true;
                        return t.emit("end", t.resultObject);
                    }
                };
            })(this);
            e = (function(t) {
                return function(e) {
                    var s, i;
                    i = n[n.length - 1];
                    if (i) {
                        i[r] += e;
                        if (t.options.explicitChildren && t.options.preserveChildrenOrder && t.options.charsAsChildren && (t.options.includeWhiteChars || e.replace(/\\n/g, "").trim() !== "")) {
                            i[t.options.childkey] = i[t.options.childkey] || [];
                            s = {
                                "#name": "__text__"
                            };
                            s[r] = e;
                            if (t.options.normalize) {
                                s[r] = s[r].replace(/\s{2,}/g, " ").trim();
                            }
                            i[t.options.childkey].push(s);
                        }
                        return i;
                    }
                };
            })(this);
            this.saxParser.ontext = e;
            return (this.saxParser.oncdata = (function(t) {
                return function(t) {
                    var r;
                    r = e(t);
                    if (r) {
                        return (r.cdata = true);
                    }
                };
            })(this));
        };
        c.prototype.parseString = function(r, e) {
            var s;
            if (e != null && typeof e === "function") {
                this.on("end", function(t) {
                    this.reset();
                    return e(null, t);
                });
                this.on("error", function(t) {
                    this.reset();
                    return e(t);
                });
            }
            try {
                r = r.toString();
                if (r.trim() === "") {
                    this.emit("end", null);
                    return true;
                }
                r = t.stripBOM(r);
                if (this.options.async) {
                    this.remaining = r;
                    a(this.processAsync);
                    return this.saxParser;
                }
                return this.saxParser.write(r).close();
            } catch (i) {
                s = i;
                if (!(this.saxParser.errThrown || this.saxParser.ended)) {
                    this.emit("error", s);
                    return (this.saxParser.errThrown = true);
                } else if (this.saxParser.ended) {
                    throw s;
                }
            }
        };
        c.prototype.parseStringPromise = function(t) {
            return new Promise((function(r) {
                return function(e, s) {
                    return r.parseString(t, function(t, r) {
                        if (t) {
                            return s(t);
                        } else {
                            return e(r);
                        }
                    });
                };
            })(this));
        };
        return c;
    })(e);
    exports.parseString = function(t, r, e) {
        var s, i, n;
        if (e != null) {
            if (typeof e === "function") {
                s = e;
            }
            if (typeof r === "object") {
                i = r;
            }
        } else {
            if (typeof r === "function") {
                s = r;
            }
            i = {};
        }
        n = new exports.Parser(i);
        return n.parseString(t, s);
    };
    exports.parseStringPromise = function(t, r) {
        var e, s;
        if (typeof r === "object") {
            e = r;
        }
        s = new exports.Parser(e);
        return s.parseStringPromise(t);
    };
}.call(this));
