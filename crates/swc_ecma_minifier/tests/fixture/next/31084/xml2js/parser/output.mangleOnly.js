(function() {
    "use strict";
    var t, r, s, e, i, n, o, a, h = function(t, r) {
        return function() {
            return t.apply(r, arguments);
        };
    }, p = function(t, r) {
        for(var s in r){
            if (u.call(r, s)) t[s] = r[s];
        }
        function e() {
            this.constructor = t;
        }
        e.prototype = r.prototype;
        t.prototype = new e();
        t.__super__ = r.prototype;
        return t;
    }, u = {}.hasOwnProperty;
    o = require("sax");
    s = require("events");
    t = require("./bom");
    n = require("./processors");
    a = require("timers").setImmediate;
    r = require("./defaults").defaults;
    e = function(t) {
        return (typeof t === "object" && t != null && Object.keys(t).length === 0);
    };
    i = function(t, r, s) {
        var e, i, n;
        for(e = 0, i = t.length; e < i; e++){
            n = t[e];
            r = n(r, s);
        }
        return r;
    };
    exports.Parser = (function(s) {
        p(c, s);
        function c(t) {
            this.parseStringPromise = h(this.parseStringPromise, this);
            this.parseString = h(this.parseString, this);
            this.reset = h(this.reset, this);
            this.assignOrPush = h(this.assignOrPush, this);
            this.processAsync = h(this.processAsync, this);
            var s, e, i;
            if (!(this instanceof exports.Parser)) {
                return new exports.Parser(t);
            }
            this.options = {};
            e = r["0.2"];
            for(s in e){
                if (!u.call(e, s)) continue;
                i = e[s];
                this.options[s] = i;
            }
            for(s in t){
                if (!u.call(t, s)) continue;
                i = t[s];
                this.options[s] = i;
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
            } catch (s) {
                r = s;
                if (!this.saxParser.errThrown) {
                    this.saxParser.errThrown = true;
                    return this.emit(r);
                }
            }
        };
        c.prototype.assignOrPush = function(t, r, s) {
            if (!(r in t)) {
                if (!this.options.explicitArray) {
                    return (t[r] = s);
                } else {
                    return (t[r] = [
                        s
                    ]);
                }
            } else {
                if (!(t[r] instanceof Array)) {
                    t[r] = [
                        t[r]
                    ];
                }
                return t[r].push(s);
            }
        };
        c.prototype.reset = function() {
            var t, r, s, n;
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
            this.saxParser.onopentag = (function(s) {
                return function(e) {
                    var o, a, h, p, c;
                    h = {};
                    h[r] = "";
                    if (!s.options.ignoreAttrs) {
                        c = e.attributes;
                        for(o in c){
                            if (!u.call(c, o)) continue;
                            if (!(t in h) && !s.options.mergeAttrs) {
                                h[t] = {};
                            }
                            a = s.options.attrValueProcessors ? i(s.options.attrValueProcessors, e.attributes[o], o) : e.attributes[o];
                            p = s.options.attrNameProcessors ? i(s.options.attrNameProcessors, o) : o;
                            if (s.options.mergeAttrs) {
                                s.assignOrPush(h, p, a);
                            } else {
                                h[t][p] = a;
                            }
                        }
                    }
                    h["#name"] = s.options.tagNameProcessors ? i(s.options.tagNameProcessors, e.name) : e.name;
                    if (s.options.xmlns) {
                        h[s.options.xmlnskey] = {
                            uri: e.uri,
                            local: e.local
                        };
                    }
                    return n.push(h);
                };
            })(this);
            this.saxParser.onclosetag = (function(t) {
                return function() {
                    var s, o, a, h, p, c, l, f, m, P;
                    c = n.pop();
                    p = c["#name"];
                    if (!t.options.explicitChildren || !t.options.preserveChildrenOrder) {
                        delete c["#name"];
                    }
                    if (c.cdata === true) {
                        s = c.cdata;
                        delete c.cdata;
                    }
                    m = n[n.length - 1];
                    if (c[r].match(/^\s*$/) && !s) {
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
                    if (e(c)) {
                        c = t.options.emptyTag !== "" ? t.options.emptyTag : o;
                    }
                    if (t.options.validator != null) {
                        P = "/" + (function() {
                            var t, r, s;
                            s = [];
                            for(t = 0, r = n.length; t < r; t++){
                                h = n[t];
                                s.push(h["#name"]);
                            }
                            return s;
                        })().concat(p).join("/");
                        (function() {
                            var r;
                            try {
                                return (c = t.options.validator(P, m && m[p], c));
                            } catch (s) {
                                r = s;
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
            s = (function(t) {
                return function(s) {
                    var e, i;
                    i = n[n.length - 1];
                    if (i) {
                        i[r] += s;
                        if (t.options.explicitChildren && t.options.preserveChildrenOrder && t.options.charsAsChildren && (t.options.includeWhiteChars || s.replace(/\\n/g, "").trim() !== "")) {
                            i[t.options.childkey] = i[t.options.childkey] || [];
                            e = {
                                "#name": "__text__"
                            };
                            e[r] = s;
                            if (t.options.normalize) {
                                e[r] = e[r].replace(/\s{2,}/g, " ").trim();
                            }
                            i[t.options.childkey].push(e);
                        }
                        return i;
                    }
                };
            })(this);
            this.saxParser.ontext = s;
            return (this.saxParser.oncdata = (function(t) {
                return function(t) {
                    var r;
                    r = s(t);
                    if (r) {
                        return (r.cdata = true);
                    }
                };
            })(this));
        };
        c.prototype.parseString = function(r, s) {
            var e;
            if (s != null && typeof s === "function") {
                this.on("end", function(t) {
                    this.reset();
                    return s(null, t);
                });
                this.on("error", function(t) {
                    this.reset();
                    return s(t);
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
                e = i;
                if (!(this.saxParser.errThrown || this.saxParser.ended)) {
                    this.emit("error", e);
                    return (this.saxParser.errThrown = true);
                } else if (this.saxParser.ended) {
                    throw e;
                }
            }
        };
        c.prototype.parseStringPromise = function(t) {
            return new Promise((function(r) {
                return function(s, e) {
                    return r.parseString(t, function(t, r) {
                        if (t) {
                            return e(t);
                        } else {
                            return s(r);
                        }
                    });
                };
            })(this));
        };
        return c;
    })(s);
    exports.parseString = function(t, r, s) {
        var e, i, n;
        if (s != null) {
            if (typeof s === "function") {
                e = s;
            }
            if (typeof r === "object") {
                i = r;
            }
        } else {
            if (typeof r === "function") {
                e = r;
            }
            i = {};
        }
        n = new exports.Parser(i);
        return n.parseString(t, e);
    };
    exports.parseStringPromise = function(t, r) {
        var s, e;
        if (typeof r === "object") {
            s = r;
        }
        e = new exports.Parser(s);
        return e.parseStringPromise(t);
    };
}.call(this));
