"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        16
    ],
    {
        19: function(t, e, n) {
            n.d(e, {
                hJ: function() {
                    return oY;
                },
                PL: function() {
                    return cv;
                }
            });
            var s = n(2238);
            var r = n(8463);
            var i = n(3333);
            var o = n(4444);
            var a = n(3510);
            var c = n(4155);
            const u = "@firebase/firestore";
            class h {
                constructor(t){
                    this.uid = t;
                }
                isAuthenticated() {
                    return null != this.uid;
                }
                toKey() {
                    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
                }
                isEqual(t) {
                    return t.uid === this.uid;
                }
            }
            (h.UNAUTHENTICATED = new h(null)), (h.GOOGLE_CREDENTIALS = new h("google-credentials-uid")), (h.FIRST_PARTY = new h("first-party-uid")), (h.MOCK_USER = new h("mock-user"));
            let l = "9.4.0";
            const d = new i.Yd("@firebase/firestore");
            function f() {
                return d.logLevel;
            }
            function m(t) {
                d.setLogLevel(t);
            }
            function g(t, ...e) {
                if (d.logLevel <= i["in"].DEBUG) {
                    const n = e.map(w);
                    d.debug(`Firestore (${l}): ${t}`, ...n);
                }
            }
            function p(t, ...e) {
                if (d.logLevel <= i["in"].ERROR) {
                    const n = e.map(w);
                    d.error(`Firestore (${l}): ${t}`, ...n);
                }
            }
            function y(t, ...e) {
                if (d.logLevel <= i["in"].WARN) {
                    const n = e.map(w);
                    d.warn(`Firestore (${l}): ${t}`, ...n);
                }
            }
            function w(t) {
                if ("string" == typeof t) return t;
                try {
                    return (n = t), JSON.stringify(n);
                } catch (e) {
                    return t;
                }
                var n;
            }
            function v(t = "Unexpected state") {
                const e = `FIRESTORE (${l}) INTERNAL ASSERTION FAILED: ` + t;
                throw (p(e), new Error(e));
            }
            function I(t, e) {
                t || v();
            }
            function T(t, e) {
                t || v();
            }
            function E(t, e) {
                return t;
            }
            const $ = {
                OK: "ok",
                CANCELLED: "cancelled",
                UNKNOWN: "unknown",
                INVALID_ARGUMENT: "invalid-argument",
                DEADLINE_EXCEEDED: "deadline-exceeded",
                NOT_FOUND: "not-found",
                ALREADY_EXISTS: "already-exists",
                PERMISSION_DENIED: "permission-denied",
                UNAUTHENTICATED: "unauthenticated",
                RESOURCE_EXHAUSTED: "resource-exhausted",
                FAILED_PRECONDITION: "failed-precondition",
                ABORTED: "aborted",
                OUT_OF_RANGE: "out-of-range",
                UNIMPLEMENTED: "unimplemented",
                INTERNAL: "internal",
                UNAVAILABLE: "unavailable",
                DATA_LOSS: "data-loss"
            };
            class S extends Error {
                constructor(t, e){
                    super(e), (this.code = t), (this.message = e), (this.name = "FirebaseError"), (this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`);
                }
            }
            class N {
                constructor(){
                    this.promise = new Promise((t, e)=>{
                        (this.resolve = t), (this.reject = e);
                    });
                }
            }
            class b {
                constructor(t, e){
                    (this.user = e), (this.type = "OAuth"), (this.authHeaders = {}), (this.authHeaders.Authorization = `Bearer ${t}`);
                }
            }
            class A {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(t, e) {
                    t.enqueueRetryable(()=>e(h.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class k {
                constructor(t){
                    (this.token = t), (this.changeListener = null);
                }
                getToken() {
                    return Promise.resolve(this.token);
                }
                invalidateToken() {}
                start(t, e) {
                    (this.changeListener = e), t.enqueueRetryable(()=>e(this.token.user));
                }
                shutdown() {
                    this.changeListener = null;
                }
            }
            class D {
                constructor(t){
                    (this.t = t), (this.currentUser = h.UNAUTHENTICATED), (this.i = 0), (this.forceRefresh = !1), (this.auth = null);
                }
                start(t, e) {
                    let n = this.i;
                    const s = (t)=>this.i !== n ? ((n = this.i), e(t)) : Promise.resolve();
                    let r = new N();
                    this.o = ()=>{
                        this.i++, (this.currentUser = this.u()), r.resolve(), (r = new N()), t.enqueueRetryable(()=>s(this.currentUser));
                    };
                    const i = ()=>{
                        const e = r;
                        t.enqueueRetryable(async ()=>{
                            await e.promise, await s(this.currentUser);
                        });
                    }, o = (t)=>{
                        g("FirebaseCredentialsProvider", "Auth detected"), (this.auth = t), this.auth.addAuthTokenListener(this.o), i();
                    };
                    this.t.onInit((t)=>o(t)), setTimeout(()=>{
                        if (!this.auth) {
                            const t = this.t.getImmediate({
                                optional: !0
                            });
                            t ? o(t) : (g("FirebaseCredentialsProvider", "Auth not yet detected"), r.resolve(), (r = new N()));
                        }
                    }, 0), i();
                }
                getToken() {
                    const t = this.i, e = this.forceRefresh;
                    return ((this.forceRefresh = !1), this.auth ? this.auth.getToken(e).then((e)=>this.i !== t ? (g("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? (I("string" == typeof e.accessToken), new b(e.accessToken, this.currentUser)) : null) : Promise.resolve(null));
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const t = this.auth && this.auth.getUid();
                    return I(null === t || "string" == typeof t), new h(t);
                }
            }
            class x {
                constructor(t, e, n){
                    (this.h = t), (this.l = e), (this.m = n), (this.type = "FirstParty"), (this.user = h.FIRST_PARTY);
                }
                get authHeaders() {
                    const t = {
                        "X-Goog-AuthUser": this.l
                    }, e = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return (e && (t.Authorization = e), this.m && (t["X-Goog-Iam-Authorization-Token"] = this.m), t);
                }
            }
            class C {
                constructor(t, e, n){
                    (this.h = t), (this.l = e), (this.m = n);
                }
                getToken() {
                    return Promise.resolve(new x(this.h, this.l, this.m));
                }
                start(t, e) {
                    t.enqueueRetryable(()=>e(h.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class L {
                constructor(t, e){
                    (this.previousValue = t), e && ((e.sequenceNumberHandler = (t)=>this.g(t)), (this.p = (t)=>e.writeSequenceNumber(t)));
                }
                g(t) {
                    return ((this.previousValue = Math.max(t, this.previousValue)), this.previousValue);
                }
                next() {
                    const t = ++this.previousValue;
                    return this.p && this.p(t), t;
                }
            }
            function _(t) {
                const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
                if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                else for(let s = 0; s < t; s++)n[s] = Math.floor(256 * Math.random());
                return n;
            }
            L.T = -1;
            class M {
                static I() {
                    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
                    let n = "";
                    for(; n.length < 20;){
                        const s = _(40);
                        for(let r = 0; r < s.length; ++r)n.length < 20 && s[r] < e && (n += t.charAt(s[r] % t.length));
                    }
                    return n;
                }
            }
            function R(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function F(t, e, n) {
                return (t.length === e.length && t.every((t, s)=>n(t, e[s])));
            }
            function V(t) {
                return t + "\0";
            }
            class q {
                constructor(t, e){
                    if (((this.seconds = t), (this.nanoseconds = e), e < 0)) throw new S($.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (e >= 1e9) throw new S($.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (t < -62135596800) throw new S($.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                    if (t >= 253402300800) throw new S($.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                }
                static now() {
                    return q.fromMillis(Date.now());
                }
                static fromDate(t) {
                    return q.fromMillis(t.getTime());
                }
                static fromMillis(t) {
                    const e = Math.floor(t / 1e3), n = Math.floor(1e6 * (t - 1e3 * e));
                    return new q(e, n);
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(t) {
                    return this.seconds === t.seconds ? R(this.nanoseconds, t.nanoseconds) : R(this.seconds, t.seconds);
                }
                isEqual(t) {
                    return (t.seconds === this.seconds && t.nanoseconds === this.nanoseconds);
                }
                toString() {
                    return ("Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")");
                }
                toJSON() {
                    return {
                        seconds: this.seconds,
                        nanoseconds: this.nanoseconds
                    };
                }
                valueOf() {
                    const t = this.seconds - -62135596800;
                    return (String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0"));
                }
            }
            class O {
                constructor(t){
                    this.timestamp = t;
                }
                static fromTimestamp(t) {
                    return new O(t);
                }
                static min() {
                    return new O(new q(0, 0));
                }
                compareTo(t) {
                    return this.timestamp._compareTo(t.timestamp);
                }
                isEqual(t) {
                    return this.timestamp.isEqual(t.timestamp);
                }
                toMicroseconds() {
                    return (1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3);
                }
                toString() {
                    return ("SnapshotVersion(" + this.timestamp.toString() + ")");
                }
                toTimestamp() {
                    return this.timestamp;
                }
            }
            function P(t) {
                let e = 0;
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e++;
                return e;
            }
            function U(t, e) {
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
            }
            function B(t) {
                for(const e in t)if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
                return !0;
            }
            class K {
                constructor(t, e, n){
                    void 0 === e ? (e = 0) : e > t.length && v(), void 0 === n ? (n = t.length - e) : n > t.length - e && v(), (this.segments = t), (this.offset = e), (this.len = n);
                }
                get length() {
                    return this.len;
                }
                isEqual(t) {
                    return 0 === K.comparator(this, t);
                }
                child(t) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return (t instanceof K ? t.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t), this.construct(e));
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(t) {
                    return ((t = void 0 === t ? 1 : t), this.construct(this.segments, this.offset + t, this.length - t));
                }
                popLast() {
                    return this.construct(this.segments, this.offset, this.length - 1);
                }
                firstSegment() {
                    return this.segments[this.offset];
                }
                lastSegment() {
                    return this.get(this.length - 1);
                }
                get(t) {
                    return this.segments[this.offset + t];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(t) {
                    if (t.length < this.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t.get(e)) return !1;
                    return !0;
                }
                isImmediateParentOf(t) {
                    if (this.length + 1 !== t.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t.get(e)) return !1;
                    return !0;
                }
                forEach(t) {
                    for(let e = this.offset, n = this.limit(); e < n; e++)t(this.segments[e]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(t, e) {
                    const n = Math.min(t.length, e.length);
                    for(let s = 0; s < n; s++){
                        const r = t.get(s), i = e.get(s);
                        if (r < i) return -1;
                        if (r > i) return 1;
                    }
                    return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
                }
            }
            class z extends K {
                construct(t, e, n) {
                    return new z(t, e, n);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...t) {
                    const e = [];
                    for (const n of t){
                        if (n.indexOf("//") >= 0) throw new S($.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
                        e.push(...n.split("/").filter((t)=>t.length > 0));
                    }
                    return new z(e);
                }
                static emptyPath() {
                    return new z([]);
                }
            }
            const Q = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class G extends K {
                construct(t, e, n) {
                    return new G(t, e, n);
                }
                static isValidIdentifier(t) {
                    return Q.test(t);
                }
                canonicalString() {
                    return this.toArray().map((t)=>((t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`")), G.isValidIdentifier(t) || (t = "`" + t + "`"), t)).join(".");
                }
                toString() {
                    return this.canonicalString();
                }
                isKeyField() {
                    return 1 === this.length && "__name__" === this.get(0);
                }
                static keyField() {
                    return new G([
                        "__name__"
                    ]);
                }
                static fromServerFormat(t) {
                    const e = [];
                    let n = "", s = 0;
                    const r = ()=>{
                        if (0 === n.length) throw new S($.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n), (n = "");
                    };
                    let i = !1;
                    for(; s < t.length;){
                        const o = t[s];
                        if ("\\" === o) {
                            if (s + 1 === t.length) throw new S($.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
                            const a = t[s + 1];
                            if ("\\" !== a && "." !== a && "`" !== a) throw new S($.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
                            (n += a), (s += 2);
                        } else "`" === o ? ((i = !i), s++) : "." !== o || i ? ((n += o), s++) : (r(), s++);
                    }
                    if ((r(), i)) throw new S($.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
                    return new G(e);
                }
                static emptyPath() {
                    return new G([]);
                }
            }
            class j {
                constructor(t){
                    (this.fields = t), t.sort(G.comparator);
                }
                covers(t) {
                    for (const e of this.fields)if (e.isPrefixOf(t)) return !0;
                    return !1;
                }
                isEqual(t) {
                    return F(this.fields, t.fields, (t, e)=>t.isEqual(e));
                }
            }
            function H() {
                return "undefined" != typeof atob;
            }
            class W {
                constructor(t){
                    this.binaryString = t;
                }
                static fromBase64String(t) {
                    const e = atob(t);
                    return new W(e);
                }
                static fromUint8Array(t) {
                    const e = (function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    })(t);
                    return new W(e);
                }
                toBase64() {
                    return (t = this.binaryString), btoa(t);
                    var t;
                }
                toUint8Array() {
                    return (function(t) {
                        const e = new Uint8Array(t.length);
                        for(let n = 0; n < t.length; n++)e[n] = t.charCodeAt(n);
                        return e;
                    })(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(t) {
                    return R(this.binaryString, t.binaryString);
                }
                isEqual(t) {
                    return this.binaryString === t.binaryString;
                }
            }
            W.EMPTY_BYTE_STRING = new W("");
            const Y = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function X(t) {
                if ((I(!!t), "string" == typeof t)) {
                    let e = 0;
                    const n = Y.exec(t);
                    if ((I(!!n), n[1])) {
                        let s = n[1];
                        (s = (s + "000000000").substr(0, 9)), (e = Number(s));
                    }
                    const r = new Date(t);
                    return {
                        seconds: Math.floor(r.getTime() / 1e3),
                        nanos: e
                    };
                }
                return {
                    seconds: Z(t.seconds),
                    nanos: Z(t.nanos)
                };
            }
            function Z(t) {
                return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
            }
            function J(t) {
                return "string" == typeof t ? W.fromBase64String(t) : W.fromUint8Array(t);
            }
            function tt(t) {
                var e, n;
                return ("server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue));
            }
            function te(t) {
                const e = t.mapValue.fields.__previous_value__;
                return tt(e) ? te(e) : e;
            }
            function tn(t) {
                const e = X(t.mapValue.fields.__local_write_time__.timestampValue);
                return new q(e.seconds, e.nanos);
            }
            function ts(t) {
                return null == t;
            }
            function tr(t) {
                return 0 === t && 1 / t == -1 / 0;
            }
            function ti(t) {
                return ("number" == typeof t && Number.isInteger(t) && !tr(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER);
            }
            class to {
                constructor(t){
                    this.path = t;
                }
                static fromPath(t) {
                    return new to(z.fromString(t));
                }
                static fromName(t) {
                    return new to(z.fromString(t).popFirst(5));
                }
                hasCollectionId(t) {
                    return (this.path.length >= 2 && this.path.get(this.path.length - 2) === t);
                }
                isEqual(t) {
                    return (null !== t && 0 === z.comparator(this.path, t.path));
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t, e) {
                    return z.comparator(t.path, e.path);
                }
                static isDocumentKey(t) {
                    return t.length % 2 == 0;
                }
                static fromSegments(t) {
                    return new to(new z(t.slice()));
                }
            }
            function ta(t) {
                return "nullValue" in t ? 0 : "booleanValue" in t ? 1 : "integerValue" in t || "doubleValue" in t ? 2 : "timestampValue" in t ? 3 : "stringValue" in t ? 5 : "bytesValue" in t ? 6 : "referenceValue" in t ? 7 : "geoPointValue" in t ? 8 : "arrayValue" in t ? 9 : "mapValue" in t ? tt(t) ? 4 : 10 : v();
            }
            function tc(t, e) {
                const n = ta(t);
                if (n !== ta(e)) return !1;
                switch(n){
                    case 0:
                        return !0;
                    case 1:
                        return t.booleanValue === e.booleanValue;
                    case 4:
                        return tn(t).isEqual(tn(e));
                    case 3:
                        return (function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) return (t.timestampValue === e.timestampValue);
                            const n = X(t.timestampValue), s = X(e.timestampValue);
                            return (n.seconds === s.seconds && n.nanos === s.nanos);
                        })(t, e);
                    case 5:
                        return t.stringValue === e.stringValue;
                    case 6:
                        return (function(t, e) {
                            return J(t.bytesValue).isEqual(J(e.bytesValue));
                        })(t, e);
                    case 7:
                        return t.referenceValue === e.referenceValue;
                    case 8:
                        return (function(t, e) {
                            return (Z(t.geoPointValue.latitude) === Z(e.geoPointValue.latitude) && Z(t.geoPointValue.longitude) === Z(e.geoPointValue.longitude));
                        })(t, e);
                    case 2:
                        return (function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return (Z(t.integerValue) === Z(e.integerValue));
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = Z(t.doubleValue), s = Z(e.doubleValue);
                                return n === s ? tr(n) === tr(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        })(t, e);
                    case 9:
                        return F(t.arrayValue.values || [], e.arrayValue.values || [], tc);
                    case 10:
                        return (function(t, e) {
                            const n = t.mapValue.fields || {}, s = e.mapValue.fields || {};
                            if (P(n) !== P(s)) return !1;
                            for(const r in n)if (n.hasOwnProperty(r) && (void 0 === s[r] || !tc(n[r], s[r]))) return !1;
                            return !0;
                        })(t, e);
                    default:
                        return v();
                }
            }
            function tu(t, e) {
                return void 0 !== (t.values || []).find((t)=>tc(t, e));
            }
            function th(t, e) {
                const n = ta(t), s = ta(e);
                if (n !== s) return R(n, s);
                switch(n){
                    case 0:
                        return 0;
                    case 1:
                        return R(t.booleanValue, e.booleanValue);
                    case 2:
                        return (function(t, e) {
                            const n = Z(t.integerValue || t.doubleValue), s = Z(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        })(t, e);
                    case 3:
                        return tl(t.timestampValue, e.timestampValue);
                    case 4:
                        return tl(tn(t), tn(e));
                    case 5:
                        return R(t.stringValue, e.stringValue);
                    case 6:
                        return (function(t, e) {
                            const n = J(t), s = J(e);
                            return n.compareTo(s);
                        })(t.bytesValue, e.bytesValue);
                    case 7:
                        return (function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let r = 0; r < n.length && r < s.length; r++){
                                const i = R(n[r], s[r]);
                                if (0 !== i) return i;
                            }
                            return R(n.length, s.length);
                        })(t.referenceValue, e.referenceValue);
                    case 8:
                        return (function(t, e) {
                            const n = R(Z(t.latitude), Z(e.latitude));
                            if (0 !== n) return n;
                            return R(Z(t.longitude), Z(e.longitude));
                        })(t.geoPointValue, e.geoPointValue);
                    case 9:
                        return (function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let r = 0; r < n.length && r < s.length; ++r){
                                const i = th(n[r], s[r]);
                                if (i) return i;
                            }
                            return R(n.length, s.length);
                        })(t.arrayValue, e.arrayValue);
                    case 10:
                        return (function(t, e) {
                            const n = t.fields || {}, s = Object.keys(n), r = e.fields || {}, i = Object.keys(r);
                            s.sort(), i.sort();
                            for(let o = 0; o < s.length && o < i.length; ++o){
                                const a = R(s[o], i[o]);
                                if (0 !== a) return a;
                                const c = th(n[s[o]], r[i[o]]);
                                if (0 !== c) return c;
                            }
                            return R(s.length, i.length);
                        })(t.mapValue, e.mapValue);
                    default:
                        throw v();
                }
            }
            function tl(t, e) {
                if ("string" == typeof t && "string" == typeof e && t.length === e.length) return R(t, e);
                const n = X(t), s = X(e), r = R(n.seconds, s.seconds);
                return 0 !== r ? r : R(n.nanos, s.nanos);
            }
            function td(t) {
                return tf(t);
            }
            function tf(t) {
                return "nullValue" in t ? "null" : "booleanValue" in t ? "" + t.booleanValue : "integerValue" in t ? "" + t.integerValue : "doubleValue" in t ? "" + t.doubleValue : "timestampValue" in t ? (function(t) {
                    const e = X(t);
                    return `time(${e.seconds},${e.nanos})`;
                })(t.timestampValue) : "stringValue" in t ? t.stringValue : "bytesValue" in t ? J(t.bytesValue).toBase64() : "referenceValue" in t ? ((n = t.referenceValue), to.fromName(n).toString()) : "geoPointValue" in t ? `geo(${(e = t.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t ? (function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? (n = !1) : (e += ","), (e += tf(s));
                    return e + "]";
                })(t.arrayValue) : "mapValue" in t ? (function(t) {
                    const e = Object.keys(t.fields || {}).sort();
                    let n = "{", s = !0;
                    for (const r of e)s ? (s = !1) : (n += ","), (n += `${r}:${tf(t.fields[r])}`);
                    return n + "}";
                })(t.mapValue) : v();
                var e, n;
            }
            function tm(t, e) {
                return {
                    referenceValue: `projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`
                };
            }
            function tg(t) {
                return !!t && "integerValue" in t;
            }
            function tp(t) {
                return !!t && "arrayValue" in t;
            }
            function ty(t) {
                return !!t && "nullValue" in t;
            }
            function tw(t) {
                return (!!t && "doubleValue" in t && isNaN(Number(t.doubleValue)));
            }
            function tv(t) {
                return !!t && "mapValue" in t;
            }
            function tI(t) {
                if (t.geoPointValue) return {
                    geoPointValue: Object.assign({}, t.geoPointValue)
                };
                if (t.timestampValue && "object" == typeof t.timestampValue) return {
                    timestampValue: Object.assign({}, t.timestampValue)
                };
                if (t.mapValue) {
                    const e = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return (U(t.mapValue.fields, (t, n)=>(e.mapValue.fields[t] = tI(n))), e);
                }
                if (t.arrayValue) {
                    const n = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let s = 0; s < (t.arrayValue.values || []).length; ++s)n.arrayValue.values[s] = tI(t.arrayValue.values[s]);
                    return n;
                }
                return Object.assign({}, t);
            }
            class tT {
                constructor(t){
                    this.value = t;
                }
                static empty() {
                    return new tT({
                        mapValue: {}
                    });
                }
                field(t) {
                    if (t.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n = 0; n < t.length - 1; ++n)if (((e = (e.mapValue.fields || {})[t.get(n)]), !tv(e))) return null;
                        return ((e = (e.mapValue.fields || {})[t.lastSegment()]), e || null);
                    }
                }
                set(t, e) {
                    this.getFieldsMap(t.popLast())[t.lastSegment()] = tI(e);
                }
                setAll(t) {
                    let e = G.emptyPath(), n = {}, s = [];
                    t.forEach((t, r)=>{
                        if (!e.isImmediateParentOf(r)) {
                            const i = this.getFieldsMap(e);
                            this.applyChanges(i, n, s), (n = {}), (s = []), (e = r.popLast());
                        }
                        t ? (n[r.lastSegment()] = tI(t)) : s.push(r.lastSegment());
                    });
                    const r = this.getFieldsMap(e);
                    this.applyChanges(r, n, s);
                }
                delete(t) {
                    const e = this.field(t.popLast());
                    tv(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
                }
                isEqual(t) {
                    return tc(this.value, t.value);
                }
                getFieldsMap(t) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {}
                    });
                    for(let n = 0; n < t.length; ++n){
                        let s = e.mapValue.fields[t.get(n)];
                        (tv(s) && s.mapValue.fields) || ((s = {
                            mapValue: {
                                fields: {}
                            }
                        }), (e.mapValue.fields[t.get(n)] = s)), (e = s);
                    }
                    return e.mapValue.fields;
                }
                applyChanges(t, e, n) {
                    U(e, (e, n)=>(t[e] = n));
                    for (const s of n)delete t[s];
                }
                clone() {
                    return new tT(tI(this.value));
                }
            }
            function tE(t) {
                const e = [];
                return (U(t.fields, (t, n)=>{
                    const s = new G([
                        t
                    ]);
                    if (tv(n)) {
                        const r = tE(n.mapValue).fields;
                        if (0 === r.length) e.push(s);
                        else for (const i of r)e.push(s.child(i));
                    } else e.push(s);
                }), new j(e));
            }
            class t$ {
                constructor(t, e, n, s, r){
                    (this.key = t), (this.documentType = e), (this.version = n), (this.data = s), (this.documentState = r);
                }
                static newInvalidDocument(t) {
                    return new t$(t, 0, O.min(), tT.empty(), 0);
                }
                static newFoundDocument(t, e, n) {
                    return new t$(t, 1, e, n, 0);
                }
                static newNoDocument(t, e) {
                    return new t$(t, 2, e, tT.empty(), 0);
                }
                static newUnknownDocument(t, e) {
                    return new t$(t, 3, e, tT.empty(), 2);
                }
                convertToFoundDocument(t, e) {
                    return ((this.version = t), (this.documentType = 1), (this.data = e), (this.documentState = 0), this);
                }
                convertToNoDocument(t) {
                    return ((this.version = t), (this.documentType = 2), (this.data = tT.empty()), (this.documentState = 0), this);
                }
                convertToUnknownDocument(t) {
                    return ((this.version = t), (this.documentType = 3), (this.data = tT.empty()), (this.documentState = 2), this);
                }
                setHasCommittedMutations() {
                    return ((this.documentState = 2), this);
                }
                setHasLocalMutations() {
                    return ((this.documentState = 1), this);
                }
                get hasLocalMutations() {
                    return (1 === this.documentState);
                }
                get hasCommittedMutations() {
                    return (2 === this.documentState);
                }
                get hasPendingWrites() {
                    return (this.hasLocalMutations || this.hasCommittedMutations);
                }
                isValidDocument() {
                    return 0 !== this.documentType;
                }
                isFoundDocument() {
                    return 1 === this.documentType;
                }
                isNoDocument() {
                    return 2 === this.documentType;
                }
                isUnknownDocument() {
                    return 3 === this.documentType;
                }
                isEqual(t) {
                    return (t instanceof t$ && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data));
                }
                clone() {
                    return new t$(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class tS {
                constructor(t, e = null, n = [], s = [], r = null, i = null, o = null){
                    (this.path = t), (this.collectionGroup = e), (this.orderBy = n), (this.filters = s), (this.limit = r), (this.startAt = i), (this.endAt = o), (this.A = null);
                }
            }
            function t8(t, e = null, n = [], s = [], r = null, i = null, o = null) {
                return new tS(t, e, n, s, r, i, o);
            }
            function tN(t) {
                const e = E(t);
                if (null === e.A) {
                    let n = e.path.canonicalString();
                    null !== e.collectionGroup && (n += "|cg:" + e.collectionGroup), (n += "|f:"), (n += e.filters.map((t)=>tx(t)).join(",")), (n += "|ob:"), (n += e.orderBy.map((t)=>(function(t) {
                            return (t.field.canonicalString() + t.dir);
                        })(t)).join(",")), ts(e.limit) || ((n += "|l:"), (n += e.limit)), e.startAt && ((n += "|lb:"), (n += tP(e.startAt))), e.endAt && ((n += "|ub:"), (n += tP(e.endAt))), (e.A = n);
                }
                return e.A;
            }
            function tb(t) {
                let e = t.path.canonicalString();
                return (null !== t.collectionGroup && (e += " collectionGroup=" + t.collectionGroup), t.filters.length > 0 && (e += `, filters: [${t.filters.map((t)=>{
                    return `${(e = t).field.canonicalString()} ${e.op} ${td(e.value)}`;
                    var e;
                }).join(", ")}]`), ts(t.limit) || (e += ", limit: " + t.limit), t.orderBy.length > 0 && (e += `, orderBy: [${t.orderBy.map((t)=>(function(t) {
                        return `${t.field.canonicalString()} (${t.dir})`;
                    })(t)).join(", ")}]`), t.startAt && (e += ", startAt: " + tP(t.startAt)), t.endAt && (e += ", endAt: " + tP(t.endAt)), `Target(${e})`);
            }
            function tA(t, e) {
                if (t.limit !== e.limit) return !1;
                if (t.orderBy.length !== e.orderBy.length) return !1;
                for(let n = 0; n < t.orderBy.length; n++)if (!tB(t.orderBy[n], e.orderBy[n])) return !1;
                if (t.filters.length !== e.filters.length) return !1;
                for(let s = 0; s < t.filters.length; s++)if (((r = t.filters[s]), (i = e.filters[s]), r.op !== i.op || !r.field.isEqual(i.field) || !tc(r.value, i.value))) return !1;
                var r, i;
                return (t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!tK(t.startAt, e.startAt) && tK(t.endAt, e.endAt));
            }
            function tk(t) {
                return (to.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length);
            }
            class tD extends class {
            } {
                constructor(t, e, n){
                    super(), (this.field = t), (this.op = e), (this.value = n);
                }
                static create(t, e, n) {
                    return t.isKeyField() ? "in" === e || "not-in" === e ? this.R(t, e, n) : new tC(t, e, n) : "array-contains" === e ? new tR(t, n) : "in" === e ? new tF(t, n) : "not-in" === e ? new tV(t, n) : "array-contains-any" === e ? new tq(t, n) : new tD(t, e, n);
                }
                static R(t, e, n) {
                    return "in" === e ? new tL(t, n) : new t_(t, n);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return "!=" === this.op ? null !== e && this.P(th(e, this.value)) : null !== e && ta(this.value) === ta(e) && this.P(th(e, this.value));
                }
                P(t) {
                    switch(this.op){
                        case "<":
                            return t < 0;
                        case "<=":
                            return t <= 0;
                        case "==":
                            return 0 === t;
                        case "!=":
                            return 0 !== t;
                        case ">":
                            return t > 0;
                        case ">=":
                            return t >= 0;
                        default:
                            return v();
                    }
                }
                v() {
                    return ([
                        "<",
                        "<=",
                        ">",
                        ">=",
                        "!=",
                        "not-in", 
                    ].indexOf(this.op) >= 0);
                }
            }
            function tx(t) {
                return (t.field.canonicalString() + t.op.toString() + td(t.value));
            }
            class tC extends tD {
                constructor(t, e, n){
                    super(t, e, n), (this.key = to.fromName(n.referenceValue));
                }
                matches(t) {
                    const e = to.comparator(t.key, this.key);
                    return this.P(e);
                }
            }
            class tL extends tD {
                constructor(t, e){
                    super(t, "in", e), (this.keys = tM("in", e));
                }
                matches(t) {
                    return this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            class t_ extends tD {
                constructor(t, e){
                    super(t, "not-in", e), (this.keys = tM("not-in", e));
                }
                matches(t) {
                    return !this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            function tM(t, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>to.fromName(t.referenceValue));
            }
            class tR extends tD {
                constructor(t, e){
                    super(t, "array-contains", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return tp(e) && tu(e.arrayValue, this.value);
                }
            }
            class tF extends tD {
                constructor(t, e){
                    super(t, "in", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return null !== e && tu(this.value.arrayValue, e);
                }
            }
            class tV extends tD {
                constructor(t, e){
                    super(t, "not-in", e);
                }
                matches(t) {
                    if (tu(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t.data.field(this.field);
                    return null !== e && !tu(this.value.arrayValue, e);
                }
            }
            class tq extends tD {
                constructor(t, e){
                    super(t, "array-contains-any", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return (!(!tp(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>tu(this.value.arrayValue, t)));
                }
            }
            class tO {
                constructor(t, e){
                    (this.position = t), (this.before = e);
                }
            }
            function tP(t) {
                return `${t.before ? "b" : "a"}:${t.position.map((t)=>td(t)).join(",")}`;
            }
            class tU {
                constructor(t, e = "asc"){
                    (this.field = t), (this.dir = e);
                }
            }
            function tB(t, e) {
                return t.dir === e.dir && t.field.isEqual(e.field);
            }
            function t9(t, e, n) {
                let s = 0;
                for(let r = 0; r < t.position.length; r++){
                    const i = e[r], o = t.position[r];
                    if (i.field.isKeyField()) s = to.comparator(to.fromName(o.referenceValue), n.key);
                    else {
                        s = th(o, n.data.field(i.field));
                    }
                    if (("desc" === i.dir && (s *= -1), 0 !== s)) break;
                }
                return t.before ? s <= 0 : s < 0;
            }
            function tK(t, e) {
                if (null === t) return null === e;
                if (null === e) return !1;
                if (t.before !== e.before || t.position.length !== e.position.length) return !1;
                for(let n = 0; n < t.position.length; n++){
                    if (!tc(t.position[n], e.position[n])) return !1;
                }
                return !0;
            }
            class tz {
                constructor(t, e = null, n = [], s = [], r = null, i = "F", o = null, a = null){
                    (this.path = t), (this.collectionGroup = e), (this.explicitOrderBy = n), (this.filters = s), (this.limit = r), (this.limitType = i), (this.startAt = o), (this.endAt = a), (this.V = null), (this.S = null), this.startAt, this.endAt;
                }
            }
            function tQ(t, e, n, s, r, i, o, a) {
                return new tz(t, e, n, s, r, i, o, a);
            }
            function tG(t) {
                return new tz(t);
            }
            function tj(t) {
                return !ts(t.limit) && "F" === t.limitType;
            }
            function tH(t) {
                return !ts(t.limit) && "L" === t.limitType;
            }
            function tW(t) {
                return t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
            }
            function t0(t) {
                for (const e of t.filters)if (e.v()) return e.field;
                return null;
            }
            function tY(t) {
                return null !== t.collectionGroup;
            }
            function t1(t) {
                const e = E(t);
                if (null === e.V) {
                    e.V = [];
                    const n = t0(e), s = tW(e);
                    if (null !== n && null === s) n.isKeyField() || e.V.push(new tU(n)), e.V.push(new tU(G.keyField(), "asc"));
                    else {
                        let r = !1;
                        for (const i of e.explicitOrderBy)e.V.push(i), i.field.isKeyField() && (r = !0);
                        if (!r) {
                            const o = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
                            e.V.push(new tU(G.keyField(), o));
                        }
                    }
                }
                return e.V;
            }
            function t2(t) {
                const e = E(t);
                if (!e.S) if ("F" === e.limitType) e.S = t8(e.path, e.collectionGroup, t1(e), e.filters, e.limit, e.startAt, e.endAt);
                else {
                    const n = [];
                    for (const s of t1(e)){
                        const r = "desc" === s.dir ? "asc" : "desc";
                        n.push(new tU(s.field, r));
                    }
                    const i = e.endAt ? new tO(e.endAt.position, !e.endAt.before) : null, o = e.startAt ? new tO(e.startAt.position, !e.startAt.before) : null;
                    e.S = t8(e.path, e.collectionGroup, n, e.filters, e.limit, i, o);
                }
                return e.S;
            }
            function tX(t, e, n) {
                return new tz(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), e, n, t.startAt, t.endAt);
            }
            function tZ(t, e) {
                return tA(t2(t), t2(e)) && t.limitType === e.limitType;
            }
            function tJ(t) {
                return `${tN(t2(t))}|lt:${t.limitType}`;
            }
            function t3(t) {
                return `Query(target=${tb(t2(t))}; limitType=${t.limitType})`;
            }
            function t4(t, e) {
                return (e.isFoundDocument() && (function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : to.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                })(t, e) && (function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                })(t, e) && (function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                })(t, e) && (function(t, e) {
                    if (t.startAt && !t9(t.startAt, t1(t), e)) return !1;
                    if (t.endAt && t9(t.endAt, t1(t), e)) return !1;
                    return !0;
                })(t, e));
            }
            function t6(t) {
                return (e, n)=>{
                    let s = !1;
                    for (const r of t1(t)){
                        const i = t7(r, e, n);
                        if (0 !== i) return i;
                        s = s || r.field.isKeyField();
                    }
                    return 0;
                };
            }
            function t7(t, e, n) {
                const s = t.field.isKeyField() ? to.comparator(e.key, n.key) : (function(t, e, n) {
                    const s = e.data.field(t), r = n.data.field(t);
                    return null !== s && null !== r ? th(s, r) : v();
                })(t.field, e, n);
                switch(t.dir){
                    case "asc":
                        return s;
                    case "desc":
                        return -1 * s;
                    default:
                        return v();
                }
            }
            function t5(t, e) {
                if (t.D) {
                    if (isNaN(e)) return {
                        doubleValue: "NaN"
                    };
                    if (e === 1 / 0) return {
                        doubleValue: "Infinity"
                    };
                    if (e === -1 / 0) return {
                        doubleValue: "-Infinity"
                    };
                }
                return {
                    doubleValue: tr(e) ? "-0" : e
                };
            }
            function et(t) {
                return {
                    integerValue: "" + t
                };
            }
            function ee(t, e) {
                return ti(e) ? et(e) : t5(t, e);
            }
            class en {
                constructor(){
                    this._ = void 0;
                }
            }
            function es(t, e, n) {
                return t instanceof eo ? (function(t, e) {
                    const n = {
                        fields: {
                            __type__: {
                                stringValue: "server_timestamp"
                            },
                            __local_write_time__: {
                                timestampValue: {
                                    seconds: t.seconds,
                                    nanos: t.nanoseconds
                                }
                            }
                        }
                    };
                    return (e && (n.fields.__previous_value__ = e), {
                        mapValue: n
                    });
                })(n, e) : t instanceof ea ? ec(t, e) : t instanceof eu ? eh(t, e) : (function(t, e) {
                    const n = ei(t, e), s = ed(n) + ed(t.C);
                    return tg(n) && tg(t.C) ? et(s) : t5(t.N, s);
                })(t, e);
            }
            function er(t, e, n) {
                return t instanceof ea ? ec(t, e) : t instanceof eu ? eh(t, e) : n;
            }
            function ei(t, e) {
                return t instanceof el ? tg((n = e)) || (function(t) {
                    return !!t && "doubleValue" in t;
                })(n) ? e : {
                    integerValue: 0
                } : null;
                var n;
            }
            class eo extends en {
            }
            class ea extends en {
                constructor(t){
                    super(), (this.elements = t);
                }
            }
            function ec(t, e) {
                const n = ef(e);
                for (const s of t.elements)n.some((t)=>tc(t, s)) || n.push(s);
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class eu extends en {
                constructor(t){
                    super(), (this.elements = t);
                }
            }
            function eh(t, e) {
                let n = ef(e);
                for (const s of t.elements)n = n.filter((t)=>!tc(t, s));
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class el extends en {
                constructor(t, e){
                    super(), (this.N = t), (this.C = e);
                }
            }
            function ed(t) {
                return Z(t.integerValue || t.doubleValue);
            }
            function ef(t) {
                return tp(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
            }
            class em {
                constructor(t, e){
                    (this.field = t), (this.transform = e);
                }
            }
            function eg(t, e) {
                return (t.field.isEqual(e.field) && (function(t, e) {
                    return (t instanceof ea && e instanceof ea) || (t instanceof eu && e instanceof eu) ? F(t.elements, e.elements, tc) : t instanceof el && e instanceof el ? tc(t.C, e.C) : t instanceof eo && e instanceof eo;
                })(t.transform, e.transform));
            }
            class ep {
                constructor(t, e){
                    (this.version = t), (this.transformResults = e);
                }
            }
            class ey {
                constructor(t, e){
                    (this.updateTime = t), (this.exists = e);
                }
                static none() {
                    return new ey();
                }
                static exists(t) {
                    return new ey(void 0, t);
                }
                static updateTime(t) {
                    return new ey(t);
                }
                get isNone() {
                    return (void 0 === this.updateTime && void 0 === this.exists);
                }
                isEqual(t) {
                    return (this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime));
                }
            }
            function ew(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            class ev {
            }
            function eI(t, e, n) {
                t instanceof e8 ? (function(t, e, n) {
                    const s = t.value.clone(), r = eA(t.fieldTransforms, e, n.transformResults);
                    s.setAll(r), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                })(t, e, n) : t instanceof eN ? (function(t, e, n) {
                    if (!ew(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                    const s = eA(t.fieldTransforms, e, n.transformResults), r = e.data;
                    r.setAll(eb(t)), r.setAll(s), e.convertToFoundDocument(n.version, r).setHasCommittedMutations();
                })(t, e, n) : (function(t, e, n) {
                    e.convertToNoDocument(n.version).setHasCommittedMutations();
                })(0, e, n);
            }
            function eT(t, e, n) {
                t instanceof e8 ? (function(t, e, n) {
                    if (!ew(t.precondition, e)) return;
                    const s = t.value.clone(), r = ek(t.fieldTransforms, n, e);
                    s.setAll(r), e.convertToFoundDocument(eS(e), s).setHasLocalMutations();
                })(t, e, n) : t instanceof eN ? (function(t, e, n) {
                    if (!ew(t.precondition, e)) return;
                    const s = ek(t.fieldTransforms, n, e), r = e.data;
                    r.setAll(eb(t)), r.setAll(s), e.convertToFoundDocument(eS(e), r).setHasLocalMutations();
                })(t, e, n) : (function(t, e) {
                    ew(t.precondition, e) && e.convertToNoDocument(O.min());
                })(t, e);
            }
            function eE(t, e) {
                let n = null;
                for (const s of t.fieldTransforms){
                    const r = e.data.field(s.field), i = ei(s.transform, r || null);
                    null != i && (null == n && (n = tT.empty()), n.set(s.field, i));
                }
                return n || null;
            }
            function e$(t, e) {
                return (t.type === e.type && !!t.key.isEqual(e.key) && !!t.precondition.isEqual(e.precondition) && !!(function(t, e) {
                    return ((void 0 === t && void 0 === e) || (!(!t || !e) && F(t, e, (t, e)=>eg(t, e))));
                })(t.fieldTransforms, e.fieldTransforms) && (0 === t.type ? t.value.isEqual(e.value) : 1 !== t.type || (t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask))));
            }
            function eS(t) {
                return t.isFoundDocument() ? t.version : O.min();
            }
            class e8 extends ev {
                constructor(t, e, n, s = []){
                    super(), (this.key = t), (this.value = e), (this.precondition = n), (this.fieldTransforms = s), (this.type = 0);
                }
            }
            class eN extends ev {
                constructor(t, e, n, s, r = []){
                    super(), (this.key = t), (this.data = e), (this.fieldMask = n), (this.precondition = s), (this.fieldTransforms = r), (this.type = 1);
                }
            }
            function eb(t) {
                const e = new Map();
                return (t.fieldMask.fields.forEach((n)=>{
                    if (!n.isEmpty()) {
                        const s = t.data.field(n);
                        e.set(n, s);
                    }
                }), e);
            }
            function eA(t, e, n) {
                const s = new Map();
                I(t.length === n.length);
                for(let r = 0; r < n.length; r++){
                    const i = t[r], o = i.transform, a = e.data.field(i.field);
                    s.set(i.field, er(o, a, n[r]));
                }
                return s;
            }
            function ek(t, e, n) {
                const s = new Map();
                for (const r of t){
                    const i = r.transform, o = n.data.field(r.field);
                    s.set(r.field, es(i, o, e));
                }
                return s;
            }
            class eD extends (null && ev) {
                constructor(t, e){
                    super(), (this.key = t), (this.precondition = e), (this.type = 2), (this.fieldTransforms = []);
                }
            }
            class ex extends (null && ev) {
                constructor(t, e){
                    super(), (this.key = t), (this.precondition = e), (this.type = 3), (this.fieldTransforms = []);
                }
            }
            class eC {
                constructor(t){
                    this.count = t;
                }
            }
            var eL, e_;
            function eM(t) {
                switch(t){
                    default:
                        return v();
                    case $.CANCELLED:
                    case $.UNKNOWN:
                    case $.DEADLINE_EXCEEDED:
                    case $.RESOURCE_EXHAUSTED:
                    case $.INTERNAL:
                    case $.UNAVAILABLE:
                    case $.UNAUTHENTICATED:
                        return !1;
                    case $.INVALID_ARGUMENT:
                    case $.NOT_FOUND:
                    case $.ALREADY_EXISTS:
                    case $.PERMISSION_DENIED:
                    case $.FAILED_PRECONDITION:
                    case $.ABORTED:
                    case $.OUT_OF_RANGE:
                    case $.UNIMPLEMENTED:
                    case $.DATA_LOSS:
                        return !0;
                }
            }
            function eR(t) {
                if (void 0 === t) return p("GRPC error has no .code"), $.UNKNOWN;
                switch(t){
                    case eL.OK:
                        return $.OK;
                    case eL.CANCELLED:
                        return $.CANCELLED;
                    case eL.UNKNOWN:
                        return $.UNKNOWN;
                    case eL.DEADLINE_EXCEEDED:
                        return $.DEADLINE_EXCEEDED;
                    case eL.RESOURCE_EXHAUSTED:
                        return $.RESOURCE_EXHAUSTED;
                    case eL.INTERNAL:
                        return $.INTERNAL;
                    case eL.UNAVAILABLE:
                        return $.UNAVAILABLE;
                    case eL.UNAUTHENTICATED:
                        return $.UNAUTHENTICATED;
                    case eL.INVALID_ARGUMENT:
                        return $.INVALID_ARGUMENT;
                    case eL.NOT_FOUND:
                        return $.NOT_FOUND;
                    case eL.ALREADY_EXISTS:
                        return $.ALREADY_EXISTS;
                    case eL.PERMISSION_DENIED:
                        return $.PERMISSION_DENIED;
                    case eL.FAILED_PRECONDITION:
                        return $.FAILED_PRECONDITION;
                    case eL.ABORTED:
                        return $.ABORTED;
                    case eL.OUT_OF_RANGE:
                        return $.OUT_OF_RANGE;
                    case eL.UNIMPLEMENTED:
                        return $.UNIMPLEMENTED;
                    case eL.DATA_LOSS:
                        return $.DATA_LOSS;
                    default:
                        return v();
                }
            }
            ((e_ = eL || (eL = {}))[(e_.OK = 0)] = "OK"), (e_[(e_.CANCELLED = 1)] = "CANCELLED"), (e_[(e_.UNKNOWN = 2)] = "UNKNOWN"), (e_[(e_.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"), (e_[(e_.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"), (e_[(e_.NOT_FOUND = 5)] = "NOT_FOUND"), (e_[(e_.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"), (e_[(e_.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"), (e_[(e_.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"), (e_[(e_.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"), (e_[(e_.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"), (e_[(e_.ABORTED = 10)] = "ABORTED"), (e_[(e_.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"), (e_[(e_.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"), (e_[(e_.INTERNAL = 13)] = "INTERNAL"), (e_[(e_.UNAVAILABLE = 14)] = "UNAVAILABLE"), (e_[(e_.DATA_LOSS = 15)] = "DATA_LOSS");
            class eF {
                constructor(t, e){
                    (this.comparator = t), (this.root = e || eq.EMPTY);
                }
                insert(t, e) {
                    return new eF(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, eq.BLACK, null, null));
                }
                remove(t) {
                    return new eF(this.comparator, this.root.remove(t, this.comparator).copy(null, null, eq.BLACK, null, null));
                }
                get(t) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n = this.comparator(t, e.key);
                        if (0 === n) return e.value;
                        n < 0 ? (e = e.left) : n > 0 && (e = e.right);
                    }
                    return null;
                }
                indexOf(t) {
                    let e = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const s = this.comparator(t, n.key);
                        if (0 === s) return e + n.left.size;
                        s < 0 ? (n = n.left) : ((e += n.left.size + 1), (n = n.right));
                    }
                    return -1;
                }
                isEmpty() {
                    return this.root.isEmpty();
                }
                get size() {
                    return this.root.size;
                }
                minKey() {
                    return this.root.minKey();
                }
                maxKey() {
                    return this.root.maxKey();
                }
                inorderTraversal(t) {
                    return this.root.inorderTraversal(t);
                }
                forEach(t) {
                    this.inorderTraversal((e, n)=>(t(e, n), !1));
                }
                toString() {
                    const t = [];
                    return (this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)), `{${t.join(", ")}}`);
                }
                reverseTraversal(t) {
                    return this.root.reverseTraversal(t);
                }
                getIterator() {
                    return new eV(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t) {
                    return new eV(this.root, t, this.comparator, !1);
                }
                getReverseIterator() {
                    return new eV(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t) {
                    return new eV(this.root, t, this.comparator, !0);
                }
            }
            class eV {
                constructor(t, e, n, s){
                    (this.isReverse = s), (this.nodeStack = []);
                    let r = 1;
                    for(; !t.isEmpty();)if (((r = e ? n(t.key, e) : 1), s && (r *= -1), r < 0)) t = this.isReverse ? t.left : t.right;
                    else {
                        if (0 === r) {
                            this.nodeStack.push(t);
                            break;
                        }
                        this.nodeStack.push(t), (t = this.isReverse ? t.right : t.left);
                    }
                }
                getNext() {
                    let t = this.nodeStack.pop();
                    const e = {
                        key: t.key,
                        value: t.value
                    };
                    if (this.isReverse) for(t = t.left; !t.isEmpty();)this.nodeStack.push(t), (t = t.right);
                    else for(t = t.right; !t.isEmpty();)this.nodeStack.push(t), (t = t.left);
                    return e;
                }
                hasNext() {
                    return this.nodeStack.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack.length) return null;
                    const t = this.nodeStack[this.nodeStack.length - 1];
                    return {
                        key: t.key,
                        value: t.value
                    };
                }
            }
            class eq {
                constructor(t, e, n, s, r){
                    (this.key = t), (this.value = e), (this.color = null != n ? n : eq.RED), (this.left = null != s ? s : eq.EMPTY), (this.right = null != r ? r : eq.EMPTY), (this.size = this.left.size + 1 + this.right.size);
                }
                copy(t, e, n, s, r) {
                    return new eq(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != s ? s : this.left, null != r ? r : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(t) {
                    return (this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t));
                }
                reverseTraversal(t) {
                    return (this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t));
                }
                min() {
                    return this.left.isEmpty() ? this : this.left.min();
                }
                minKey() {
                    return this.min().key;
                }
                maxKey() {
                    return this.right.isEmpty() ? this.key : this.right.maxKey();
                }
                insert(t, e, n) {
                    let s = this;
                    const r = n(t, s.key);
                    return ((s = r < 0 ? s.copy(null, null, null, s.left.insert(t, e, n), null) : 0 === r ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t, e, n))), s.fixUp());
                }
                removeMin() {
                    if (this.left.isEmpty()) return eq.EMPTY;
                    let t = this;
                    return (t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), (t = t.copy(null, null, null, t.left.removeMin(), null)), t.fixUp());
                }
                remove(t, e) {
                    let n, s = this;
                    if (e(t, s.key) < 0) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), (s = s.copy(null, null, null, s.left.remove(t, e), null));
                    else {
                        if ((s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e(t, s.key))) {
                            if (s.right.isEmpty()) return eq.EMPTY;
                            (n = s.right.min()), (s = s.copy(n.key, n.value, null, null, s.right.removeMin()));
                        }
                        s = s.copy(null, null, null, null, s.right.remove(t, e));
                    }
                    return s.fixUp();
                }
                isRed() {
                    return this.color;
                }
                fixUp() {
                    let t = this;
                    return (t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t);
                }
                moveRedLeft() {
                    let t = this.colorFlip();
                    return (t.right.left.isRed() && ((t = t.copy(null, null, null, null, t.right.rotateRight())), (t = t.rotateLeft()), (t = t.colorFlip())), t);
                }
                moveRedRight() {
                    let t = this.colorFlip();
                    return (t.left.left.isRed() && ((t = t.rotateRight()), (t = t.colorFlip())), t);
                }
                rotateLeft() {
                    const t = this.copy(null, null, eq.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, t, null);
                }
                rotateRight() {
                    const t = this.copy(null, null, eq.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, t);
                }
                colorFlip() {
                    const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, t, e);
                }
                checkMaxDepth() {
                    const t = this.check();
                    return Math.pow(2, t) <= this.size + 1;
                }
                check() {
                    if (this.isRed() && this.left.isRed()) throw v();
                    if (this.right.isRed()) throw v();
                    const t = this.left.check();
                    if (t !== this.right.check()) throw v();
                    return t + (this.isRed() ? 0 : 1);
                }
            }
            (eq.EMPTY = null), (eq.RED = !0), (eq.BLACK = !1);
            eq.EMPTY = new (class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw v();
                }
                get value() {
                    throw v();
                }
                get color() {
                    throw v();
                }
                get left() {
                    throw v();
                }
                get right() {
                    throw v();
                }
                copy(t, e, n, s, r) {
                    return this;
                }
                insert(t, e, n) {
                    return new eq(t, e);
                }
                remove(t, e) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(t) {
                    return !1;
                }
                reverseTraversal(t) {
                    return !1;
                }
                minKey() {
                    return null;
                }
                maxKey() {
                    return null;
                }
                isRed() {
                    return !1;
                }
                checkMaxDepth() {
                    return !0;
                }
                check() {
                    return 0;
                }
            })();
            class eO {
                constructor(t){
                    (this.comparator = t), (this.data = new eF(this.comparator));
                }
                has(t) {
                    return null !== this.data.get(t);
                }
                first() {
                    return this.data.minKey();
                }
                last() {
                    return this.data.maxKey();
                }
                get size() {
                    return this.data.size;
                }
                indexOf(t) {
                    return this.data.indexOf(t);
                }
                forEach(t) {
                    this.data.inorderTraversal((e, n)=>(t(e), !1));
                }
                forEachInRange(t, e) {
                    const n = this.data.getIteratorFrom(t[0]);
                    for(; n.hasNext();){
                        const s = n.getNext();
                        if (this.comparator(s.key, t[1]) >= 0) return;
                        e(s.key);
                    }
                }
                forEachWhile(t, e) {
                    let n;
                    for(n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext();){
                        if (!t(n.getNext().key)) return;
                    }
                }
                firstAfterOrEqual(t) {
                    const e = this.data.getIteratorFrom(t);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new eP(this.data.getIterator());
                }
                getIteratorFrom(t) {
                    return new eP(this.data.getIteratorFrom(t));
                }
                add(t) {
                    return this.copy(this.data.remove(t).insert(t, !0));
                }
                delete(t) {
                    return this.has(t) ? this.copy(this.data.remove(t)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(t) {
                    let e = this;
                    return (e.size < t.size && ((e = t), (t = this)), t.forEach((t)=>{
                        e = e.add(t);
                    }), e);
                }
                isEqual(t) {
                    if (!(t instanceof eO)) return !1;
                    if (this.size !== t.size) return !1;
                    const e = this.data.getIterator(), n = t.data.getIterator();
                    for(; e.hasNext();){
                        const s = e.getNext().key, r = n.getNext().key;
                        if (0 !== this.comparator(s, r)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const t = [];
                    return (this.forEach((e)=>{
                        t.push(e);
                    }), t);
                }
                toString() {
                    const t = [];
                    return (this.forEach((e)=>t.push(e)), "SortedSet(" + t.toString() + ")");
                }
                copy(t) {
                    const e = new eO(this.comparator);
                    return (e.data = t), e;
                }
            }
            class eP {
                constructor(t){
                    this.iter = t;
                }
                getNext() {
                    return this.iter.getNext().key;
                }
                hasNext() {
                    return this.iter.hasNext();
                }
            }
            const eU = new eF(to.comparator);
            function eB() {
                return eU;
            }
            const e9 = new eF(to.comparator);
            function eK() {
                return e9;
            }
            const ez = new eF(to.comparator);
            function eQ() {
                return ez;
            }
            const eG = new eO(to.comparator);
            function ej(...t) {
                let e = eG;
                for (const n of t)e = e.add(n);
                return e;
            }
            const eH = new eO(R);
            function eW() {
                return eH;
            }
            class e0 {
                constructor(t, e, n, s, r){
                    (this.snapshotVersion = t), (this.targetChanges = e), (this.targetMismatches = n), (this.documentUpdates = s), (this.resolvedLimboDocuments = r);
                }
                static createSynthesizedRemoteEventForCurrentChange(t, e) {
                    const n = new Map();
                    return (n.set(t, eY.createSynthesizedTargetChangeForCurrentChange(t, e)), new e0(O.min(), n, eW(), eB(), ej()));
                }
            }
            class eY {
                constructor(t, e, n, s, r){
                    (this.resumeToken = t), (this.current = e), (this.addedDocuments = n), (this.modifiedDocuments = s), (this.removedDocuments = r);
                }
                static createSynthesizedTargetChangeForCurrentChange(t, e) {
                    return new eY(W.EMPTY_BYTE_STRING, e, ej(), ej(), ej());
                }
            }
            class e1 {
                constructor(t, e, n, s){
                    (this.k = t), (this.removedTargetIds = e), (this.key = n), (this.$ = s);
                }
            }
            class e2 {
                constructor(t, e){
                    (this.targetId = t), (this.O = e);
                }
            }
            class eX {
                constructor(t, e, n = W.EMPTY_BYTE_STRING, s = null){
                    (this.state = t), (this.targetIds = e), (this.resumeToken = n), (this.cause = s);
                }
            }
            class eZ {
                constructor(){
                    (this.F = 0), (this.M = e4()), (this.L = W.EMPTY_BYTE_STRING), (this.B = !1), (this.U = !0);
                }
                get current() {
                    return this.B;
                }
                get resumeToken() {
                    return this.L;
                }
                get q() {
                    return 0 !== this.F;
                }
                get K() {
                    return this.U;
                }
                j(t) {
                    t.approximateByteSize() > 0 && ((this.U = !0), (this.L = t));
                }
                W() {
                    let t = ej(), e = ej(), n = ej();
                    return (this.M.forEach((s, r)=>{
                        switch(r){
                            case 0:
                                t = t.add(s);
                                break;
                            case 2:
                                e = e.add(s);
                                break;
                            case 1:
                                n = n.add(s);
                                break;
                            default:
                                v();
                        }
                    }), new eY(this.L, this.B, t, e, n));
                }
                G() {
                    (this.U = !1), (this.M = e4());
                }
                H(t, e) {
                    (this.U = !0), (this.M = this.M.insert(t, e));
                }
                J(t) {
                    (this.U = !0), (this.M = this.M.remove(t));
                }
                Y() {
                    this.F += 1;
                }
                X() {
                    this.F -= 1;
                }
                Z() {
                    (this.U = !0), (this.B = !0);
                }
            }
            class eJ {
                constructor(t){
                    (this.tt = t), (this.et = new Map()), (this.nt = eB()), (this.st = e3()), (this.it = new eO(R));
                }
                rt(t) {
                    for (const e of t.k)t.$ && t.$.isFoundDocument() ? this.ot(e, t.$) : this.ct(e, t.key, t.$);
                    for (const n of t.removedTargetIds)this.ct(n, t.key, t.$);
                }
                at(t) {
                    this.forEachTarget(t, (e)=>{
                        const n = this.ut(e);
                        switch(t.state){
                            case 0:
                                this.ht(e) && n.j(t.resumeToken);
                                break;
                            case 1:
                                n.X(), n.q || n.G(), n.j(t.resumeToken);
                                break;
                            case 2:
                                n.X(), n.q || this.removeTarget(e);
                                break;
                            case 3:
                                this.ht(e) && (n.Z(), n.j(t.resumeToken));
                                break;
                            case 4:
                                this.ht(e) && (this.lt(e), n.j(t.resumeToken));
                                break;
                            default:
                                v();
                        }
                    });
                }
                forEachTarget(t, e) {
                    t.targetIds.length > 0 ? t.targetIds.forEach(e) : this.et.forEach((t, n)=>{
                        this.ht(n) && e(n);
                    });
                }
                ft(t) {
                    const e = t.targetId, n = t.O.count, s = this.dt(e);
                    if (s) {
                        const r = s.target;
                        if (tk(r)) if (0 === n) {
                            const i = new to(r.path);
                            this.ct(e, i, t$.newNoDocument(i, O.min()));
                        } else I(1 === n);
                        else {
                            this.wt(e) !== n && (this.lt(e), (this.it = this.it.add(e)));
                        }
                    }
                }
                _t(t) {
                    const e = new Map();
                    this.et.forEach((n, s)=>{
                        const r = this.dt(s);
                        if (r) {
                            if (n.current && tk(r.target)) {
                                const i = new to(r.target.path);
                                null !== this.nt.get(i) || this.gt(s, i) || this.ct(s, i, t$.newNoDocument(i, t));
                            }
                            n.K && (e.set(s, n.W()), n.G());
                        }
                    });
                    let n = ej();
                    this.st.forEach((t, e)=>{
                        let s = !0;
                        e.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return (!e || 2 === e.purpose || ((s = !1), !1));
                        }), s && (n = n.add(t));
                    });
                    const s = new e0(t, e, this.it, this.nt, n);
                    return ((this.nt = eB()), (this.st = e3()), (this.it = new eO(R)), s);
                }
                ot(t, e) {
                    if (!this.ht(t)) return;
                    const n = this.gt(t, e.key) ? 2 : 0;
                    this.ut(t).H(e.key, n), (this.nt = this.nt.insert(e.key, e)), (this.st = this.st.insert(e.key, this.yt(e.key).add(t)));
                }
                ct(t, e, n) {
                    if (!this.ht(t)) return;
                    const s = this.ut(t);
                    this.gt(t, e) ? s.H(e, 1) : s.J(e), (this.st = this.st.insert(e, this.yt(e).delete(t))), n && (this.nt = this.nt.insert(e, n));
                }
                removeTarget(t) {
                    this.et.delete(t);
                }
                wt(t) {
                    const e = this.ut(t).W();
                    return (this.tt.getRemoteKeysForTarget(t).size + e.addedDocuments.size - e.removedDocuments.size);
                }
                Y(t) {
                    this.ut(t).Y();
                }
                ut(t) {
                    let e = this.et.get(t);
                    return e || ((e = new eZ()), this.et.set(t, e)), e;
                }
                yt(t) {
                    let e = this.st.get(t);
                    return (e || ((e = new eO(R)), (this.st = this.st.insert(t, e))), e);
                }
                ht(t) {
                    const e = null !== this.dt(t);
                    return (e || g("WatchChangeAggregator", "Detected inactive target", t), e);
                }
                dt(t) {
                    const e = this.et.get(t);
                    return e && e.q ? null : this.tt.Tt(t);
                }
                lt(t) {
                    this.et.set(t, new eZ());
                    this.tt.getRemoteKeysForTarget(t).forEach((e)=>{
                        this.ct(t, e, null);
                    });
                }
                gt(t, e) {
                    return this.tt.getRemoteKeysForTarget(t).has(e);
                }
            }
            function e3() {
                return new eF(to.comparator);
            }
            function e4() {
                return new eF(to.comparator);
            }
            const e6 = (()=>{
                const t = {
                    asc: "ASCENDING",
                    desc: "DESCENDING"
                };
                return t;
            })(), e7 = (()=>{
                const t = {
                    "<": "LESS_THAN",
                    "<=": "LESS_THAN_OR_EQUAL",
                    ">": "GREATER_THAN",
                    ">=": "GREATER_THAN_OR_EQUAL",
                    "==": "EQUAL",
                    "!=": "NOT_EQUAL",
                    "array-contains": "ARRAY_CONTAINS",
                    in: "IN",
                    "not-in": "NOT_IN",
                    "array-contains-any": "ARRAY_CONTAINS_ANY"
                };
                return t;
            })();
            class e5 {
                constructor(t, e){
                    (this.databaseId = t), (this.D = e);
                }
            }
            function nt(t, e) {
                if (t.D) {
                    return `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
                }
                return {
                    seconds: "" + e.seconds,
                    nanos: e.nanoseconds
                };
            }
            function ne(t, e) {
                return t.D ? e.toBase64() : e.toUint8Array();
            }
            function nn(t, e) {
                return nt(t, e.toTimestamp());
            }
            function ns(t) {
                return (I(!!t), O.fromTimestamp((function(t) {
                    const e = X(t);
                    return new q(e.seconds, e.nanos);
                })(t)));
            }
            function nr(t, e) {
                return (function(t) {
                    return new z([
                        "projects",
                        t.projectId,
                        "databases",
                        t.database, 
                    ]);
                })(t).child("documents").child(e).canonicalString();
            }
            function ni(t) {
                const e = z.fromString(t);
                return I(nL(e)), e;
            }
            function no(t, e) {
                return nr(t.databaseId, e.path);
            }
            function na(t, e) {
                const n = ni(e);
                if (n.get(1) !== t.databaseId.projectId) throw new S($.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
                if (n.get(3) !== t.databaseId.database) throw new S($.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
                return new to(nl(n));
            }
            function nc(t, e) {
                return nr(t.databaseId, e);
            }
            function nu(t) {
                const e = ni(t);
                return 4 === e.length ? z.emptyPath() : nl(e);
            }
            function nh(t) {
                return new z([
                    "projects",
                    t.databaseId.projectId,
                    "databases",
                    t.databaseId.database, 
                ]).canonicalString();
            }
            function nl(t) {
                return (I(t.length > 4 && "documents" === t.get(4)), t.popFirst(5));
            }
            function nd(t, e, n) {
                return {
                    name: no(t, e),
                    fields: n.value.mapValue.fields
                };
            }
            function nf(t, e, n) {
                const s = na(t, e.name), r = ns(e.updateTime), i = new tT({
                    mapValue: {
                        fields: e.fields
                    }
                }), o = t$.newFoundDocument(s, r, i);
                return (n && o.setHasCommittedMutations(), n ? o.setHasCommittedMutations() : o);
            }
            function nm(t, e) {
                return "found" in e ? (function(t, e) {
                    I(!!e.found), e.found.name, e.found.updateTime;
                    const n = na(t, e.found.name), s = ns(e.found.updateTime), r = new tT({
                        mapValue: {
                            fields: e.found.fields
                        }
                    });
                    return t$.newFoundDocument(n, s, r);
                })(t, e) : "missing" in e ? (function(t, e) {
                    I(!!e.missing), I(!!e.readTime);
                    const n = na(t, e.missing), s = ns(e.readTime);
                    return t$.newNoDocument(n, s);
                })(t, e) : v();
            }
            function ng(t, e) {
                let n;
                if ("targetChange" in e) {
                    e.targetChange;
                    const s = (function(t) {
                        return "NO_CHANGE" === t ? 0 : "ADD" === t ? 1 : "REMOVE" === t ? 2 : "CURRENT" === t ? 3 : "RESET" === t ? 4 : v();
                    })(e.targetChange.targetChangeType || "NO_CHANGE"), r = e.targetChange.targetIds || [], i = (function(t, e) {
                        return t.D ? (I(void 0 === e || "string" == typeof e), W.fromBase64String(e || "")) : (I(void 0 === e || e instanceof Uint8Array), W.fromUint8Array(e || new Uint8Array()));
                    })(t, e.targetChange.resumeToken), o = e.targetChange.cause, a = o && (function(t) {
                        const e = void 0 === t.code ? $.UNKNOWN : eR(t.code);
                        return new S(e, t.message || "");
                    })(o);
                    n = new eX(s, r, i, a || null);
                } else if ("documentChange" in e) {
                    e.documentChange;
                    const c = e.documentChange;
                    c.document, c.document.name, c.document.updateTime;
                    const u = na(t, c.document.name), h = ns(c.document.updateTime), l = new tT({
                        mapValue: {
                            fields: c.document.fields
                        }
                    }), d = t$.newFoundDocument(u, h, l), f = c.targetIds || [], m = c.removedTargetIds || [];
                    n = new e1(f, m, d.key, d);
                } else if ("documentDelete" in e) {
                    e.documentDelete;
                    const g = e.documentDelete;
                    g.document;
                    const p = na(t, g.document), y = g.readTime ? ns(g.readTime) : O.min(), w = t$.newNoDocument(p, y), T = g.removedTargetIds || [];
                    n = new e1([], T, w.key, w);
                } else if ("documentRemove" in e) {
                    e.documentRemove;
                    const E = e.documentRemove;
                    E.document;
                    const N = na(t, E.document), b = E.removedTargetIds || [];
                    n = new e1([], b, N, null);
                } else {
                    if (!("filter" in e)) return v();
                    {
                        e.filter;
                        const A = e.filter;
                        A.targetId;
                        const k = A.count || 0, D = new eC(k), x = A.targetId;
                        n = new e2(x, D);
                    }
                }
                return n;
            }
            function np(t, e) {
                let n;
                if (e instanceof e8) n = {
                    update: nd(t, e.key, e.value)
                };
                else if (e instanceof eD) n = {
                    delete: no(t, e.key)
                };
                else if (e instanceof eN) n = {
                    update: nd(t, e.key, e.data),
                    updateMask: nC(e.fieldMask)
                };
                else {
                    if (!(e instanceof ex)) return v();
                    n = {
                        verify: no(t, e.key)
                    };
                }
                return (e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t)=>(function(t, e) {
                        const n = e.transform;
                        if (n instanceof eo) return {
                            fieldPath: e.field.canonicalString(),
                            setToServerValue: "REQUEST_TIME"
                        };
                        if (n instanceof ea) return {
                            fieldPath: e.field.canonicalString(),
                            appendMissingElements: {
                                values: n.elements
                            }
                        };
                        if (n instanceof eu) return {
                            fieldPath: e.field.canonicalString(),
                            removeAllFromArray: {
                                values: n.elements
                            }
                        };
                        if (n instanceof el) return {
                            fieldPath: e.field.canonicalString(),
                            increment: n.C
                        };
                        throw v();
                    })(0, t))), e.precondition.isNone || (n.currentDocument = (function(t, e) {
                    return void 0 !== e.updateTime ? {
                        updateTime: nn(t, e.updateTime)
                    } : void 0 !== e.exists ? {
                        exists: e.exists
                    } : v();
                })(t, e.precondition)), n);
            }
            function ny(t, e) {
                const n = e.currentDocument ? (function(t) {
                    return void 0 !== t.updateTime ? ey.updateTime(ns(t.updateTime)) : void 0 !== t.exists ? ey.exists(t.exists) : ey.none();
                })(e.currentDocument) : ey.none(), s = e.updateTransforms ? e.updateTransforms.map((e)=>(function(t, e) {
                        let n = null;
                        if ("setToServerValue" in e) I("REQUEST_TIME" === e.setToServerValue), (n = new eo());
                        else if ("appendMissingElements" in e) {
                            const s = e.appendMissingElements.values || [];
                            n = new ea(s);
                        } else if ("removeAllFromArray" in e) {
                            const r = e.removeAllFromArray.values || [];
                            n = new eu(r);
                        } else "increment" in e ? (n = new el(t, e.increment)) : v();
                        const i = G.fromServerFormat(e.fieldPath);
                        return new em(i, n);
                    })(t, e)) : [];
                if (e.update) {
                    e.update.name;
                    const r = na(t, e.update.name), i = new tT({
                        mapValue: {
                            fields: e.update.fields
                        }
                    });
                    if (e.updateMask) {
                        const o = (function(t) {
                            const e = t.fieldPaths || [];
                            return new j(e.map((t)=>G.fromServerFormat(t)));
                        })(e.updateMask);
                        return new eN(r, i, o, n, s);
                    }
                    return new e8(r, i, n, s);
                }
                if (e.delete) {
                    const a = na(t, e.delete);
                    return new eD(a, n);
                }
                if (e.verify) {
                    const c = na(t, e.verify);
                    return new ex(c, n);
                }
                return v();
            }
            function nw(t, e) {
                return t && t.length > 0 ? (I(void 0 !== e), t.map((t)=>(function(t, e) {
                        let n = t.updateTime ? ns(t.updateTime) : ns(e);
                        return (n.isEqual(O.min()) && (n = ns(e)), new ep(n, t.transformResults || []));
                    })(t, e))) : [];
            }
            function nv(t, e) {
                return {
                    documents: [
                        nc(t, e.path)
                    ]
                };
            }
            function nI(t, e) {
                const n = {
                    structuredQuery: {}
                }, s = e.path;
                null !== e.collectionGroup ? ((n.parent = nc(t, s)), (n.structuredQuery.from = [
                    {
                        collectionId: e.collectionGroup,
                        allDescendants: !0
                    }, 
                ])) : ((n.parent = nc(t, s.popLast())), (n.structuredQuery.from = [
                    {
                        collectionId: s.lastSegment()
                    }, 
                ]));
                const r = (function(t) {
                    if (0 === t.length) return;
                    const e = t.map((t)=>(function(t) {
                            if ("==" === t.op) {
                                if (tw(t.value)) return {
                                    unaryFilter: {
                                        field: nA(t.field),
                                        op: "IS_NAN"
                                    }
                                };
                                if (ty(t.value)) return {
                                    unaryFilter: {
                                        field: nA(t.field),
                                        op: "IS_NULL"
                                    }
                                };
                            } else if ("!=" === t.op) {
                                if (tw(t.value)) return {
                                    unaryFilter: {
                                        field: nA(t.field),
                                        op: "IS_NOT_NAN"
                                    }
                                };
                                if (ty(t.value)) return {
                                    unaryFilter: {
                                        field: nA(t.field),
                                        op: "IS_NOT_NULL"
                                    }
                                };
                            }
                            return {
                                fieldFilter: {
                                    field: nA(t.field),
                                    op: nb(t.op),
                                    value: t.value
                                }
                            };
                        })(t));
                    if (1 === e.length) return e[0];
                    return {
                        compositeFilter: {
                            op: "AND",
                            filters: e
                        }
                    };
                })(e.filters);
                r && (n.structuredQuery.where = r);
                const i = (function(t) {
                    if (0 === t.length) return;
                    return t.map((t)=>(function(t) {
                            return {
                                field: nA(t.field),
                                direction: nN(t.dir)
                            };
                        })(t));
                })(e.orderBy);
                i && (n.structuredQuery.orderBy = i);
                const o = (function(t, e) {
                    return t.D || ts(e) ? e : {
                        value: e
                    };
                })(t, e.limit);
                return (null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = nS(e.startAt)), e.endAt && (n.structuredQuery.endAt = nS(e.endAt)), n);
            }
            function nT(t) {
                let e = nu(t.parent);
                const n = t.structuredQuery, s = n.from ? n.from.length : 0;
                let r = null;
                if (s > 0) {
                    I(1 === s);
                    const i = n.from[0];
                    i.allDescendants ? (r = i.collectionId) : (e = e.child(i.collectionId));
                }
                let o = [];
                n.where && (o = n$(n.where));
                let a = [];
                n.orderBy && (a = n.orderBy.map((t)=>(function(t) {
                        return new tU(nk(t.field), (function(t) {
                            switch(t){
                                case "ASCENDING":
                                    return "asc";
                                case "DESCENDING":
                                    return "desc";
                                default:
                                    return;
                            }
                        })(t.direction));
                    })(t)));
                let c = null;
                n.limit && (c = (function(t) {
                    let e;
                    return ((e = "object" == typeof t ? t.value : t), ts(e) ? null : e);
                })(n.limit));
                let u = null;
                n.startAt && (u = n8(n.startAt));
                let h = null;
                return (n.endAt && (h = n8(n.endAt)), tQ(e, r, a, o, c, "F", u, h));
            }
            function nE(t, e) {
                const n = (function(t, e) {
                    switch(e){
                        case 0:
                            return null;
                        case 1:
                            return "existence-filter-mismatch";
                        case 2:
                            return "limbo-document";
                        default:
                            return v();
                    }
                })(0, e.purpose);
                return null == n ? null : {
                    "goog-listen-tags": n
                };
            }
            function n$(t) {
                return t ? void 0 !== t.unaryFilter ? [
                    nx(t)
                ] : void 0 !== t.fieldFilter ? [
                    nD(t)
                ] : void 0 !== t.compositeFilter ? t.compositeFilter.filters.map((t)=>n$(t)).reduce((t, e)=>t.concat(e)) : v() : [];
            }
            function nS(t) {
                return {
                    before: t.before,
                    values: t.position
                };
            }
            function n8(t) {
                const e = !!t.before, n = t.values || [];
                return new tO(n, e);
            }
            function nN(t) {
                return e6[t];
            }
            function nb(t) {
                return e7[t];
            }
            function nA(t) {
                return {
                    fieldPath: t.canonicalString()
                };
            }
            function nk(t) {
                return G.fromServerFormat(t.fieldPath);
            }
            function nD(t) {
                return tD.create(nk(t.fieldFilter.field), (function(t) {
                    switch(t){
                        case "EQUAL":
                            return "==";
                        case "NOT_EQUAL":
                            return "!=";
                        case "GREATER_THAN":
                            return ">";
                        case "GREATER_THAN_OR_EQUAL":
                            return ">=";
                        case "LESS_THAN":
                            return "<";
                        case "LESS_THAN_OR_EQUAL":
                            return "<=";
                        case "ARRAY_CONTAINS":
                            return "array-contains";
                        case "IN":
                            return "in";
                        case "NOT_IN":
                            return "not-in";
                        case "ARRAY_CONTAINS_ANY":
                            return "array-contains-any";
                        default:
                            return v();
                    }
                })(t.fieldFilter.op), t.fieldFilter.value);
            }
            function nx(t) {
                switch(t.unaryFilter.op){
                    case "IS_NAN":
                        const e = nk(t.unaryFilter.field);
                        return tD.create(e, "==", {
                            doubleValue: NaN
                        });
                    case "IS_NULL":
                        const n = nk(t.unaryFilter.field);
                        return tD.create(n, "==", {
                            nullValue: "NULL_VALUE"
                        });
                    case "IS_NOT_NAN":
                        const s = nk(t.unaryFilter.field);
                        return tD.create(s, "!=", {
                            doubleValue: NaN
                        });
                    case "IS_NOT_NULL":
                        const r = nk(t.unaryFilter.field);
                        return tD.create(r, "!=", {
                            nullValue: "NULL_VALUE"
                        });
                    default:
                        return v();
                }
            }
            function nC(t) {
                const e = [];
                return (t.fields.forEach((t)=>e.push(t.canonicalString())), {
                    fieldPaths: e
                });
            }
            function nL(t) {
                return (t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2));
            }
            function n_(t) {
                let e = "";
                for(let n = 0; n < t.length; n++)e.length > 0 && (e = nR(e)), (e = nM(t.get(n), e));
                return nR(e);
            }
            function nM(t, e) {
                let n = e;
                const s = t.length;
                for(let r = 0; r < s; r++){
                    const i = t.charAt(r);
                    switch(i){
                        case "\0":
                            n += "";
                            break;
                        case "":
                            n += "";
                            break;
                        default:
                            n += i;
                    }
                }
                return n;
            }
            function nR(t) {
                return t + "";
            }
            function nF(t) {
                const e = t.length;
                if ((I(e >= 2), 2 === e)) return (I("" === t.charAt(0) && "" === t.charAt(1)), z.emptyPath());
                const n = e - 2, s = [];
                let r = "";
                for(let i = 0; i < e;){
                    const o = t.indexOf("", i);
                    (o < 0 || o > n) && v();
                    switch(t.charAt(o + 1)){
                        case "":
                            const a = t.substring(i, o);
                            let c;
                            0 === r.length ? (c = a) : ((r += a), (c = r), (r = "")), s.push(c);
                            break;
                        case "":
                            (r += t.substring(i, o)), (r += "\0");
                            break;
                        case "":
                            r += t.substring(i, o + 1);
                            break;
                        default:
                            v();
                    }
                    i = o + 2;
                }
                return new z(s);
            }
            class nV {
                constructor(t, e){
                    (this.seconds = t), (this.nanoseconds = e);
                }
            }
            class nq {
                constructor(t, e, n){
                    (this.ownerId = t), (this.allowTabSynchronization = e), (this.leaseTimestampMs = n);
                }
            }
            (nq.store = "owner"), (nq.key = "owner");
            class nO {
                constructor(t, e, n){
                    (this.userId = t), (this.lastAcknowledgedBatchId = e), (this.lastStreamToken = n);
                }
            }
            (nO.store = "mutationQueues"), (nO.keyPath = "userId");
            class nP {
                constructor(t, e, n, s, r){
                    (this.userId = t), (this.batchId = e), (this.localWriteTimeMs = n), (this.baseMutations = s), (this.mutations = r);
                }
            }
            (nP.store = "mutations"), (nP.keyPath = "batchId"), (nP.userMutationsIndex = "userMutationsIndex"), (nP.userMutationsKeyPath = [
                "userId",
                "batchId"
            ]);
            class nU {
                constructor(){}
                static prefixForUser(t) {
                    return [
                        t
                    ];
                }
                static prefixForPath(t, e) {
                    return [
                        t,
                        n_(e)
                    ];
                }
                static key(t, e, n) {
                    return [
                        t,
                        n_(e),
                        n
                    ];
                }
            }
            (nU.store = "documentMutations"), (nU.PLACEHOLDER = new nU());
            class nB {
                constructor(t, e){
                    (this.path = t), (this.readTime = e);
                }
            }
            class n9 {
                constructor(t, e){
                    (this.path = t), (this.version = e);
                }
            }
            class nK {
                constructor(t, e, n, s, r, i){
                    (this.unknownDocument = t), (this.noDocument = e), (this.document = n), (this.hasCommittedMutations = s), (this.readTime = r), (this.parentPath = i);
                }
            }
            (nK.store = "remoteDocuments"), (nK.readTimeIndex = "readTimeIndex"), (nK.readTimeIndexPath = "readTime"), (nK.collectionReadTimeIndex = "collectionReadTimeIndex"), (nK.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime", 
            ]);
            class nz {
                constructor(t){
                    this.byteSize = t;
                }
            }
            (nz.store = "remoteDocumentGlobal"), (nz.key = "remoteDocumentGlobalKey");
            class nQ {
                constructor(t, e, n, s, r, i, o){
                    (this.targetId = t), (this.canonicalId = e), (this.readTime = n), (this.resumeToken = s), (this.lastListenSequenceNumber = r), (this.lastLimboFreeSnapshotVersion = i), (this.query = o);
                }
            }
            (nQ.store = "targets"), (nQ.keyPath = "targetId"), (nQ.queryTargetsIndexName = "queryTargetsIndex"), (nQ.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ]);
            class nG {
                constructor(t, e, n){
                    (this.targetId = t), (this.path = e), (this.sequenceNumber = n);
                }
            }
            (nG.store = "targetDocuments"), (nG.keyPath = [
                "targetId",
                "path"
            ]), (nG.documentTargetsIndex = "documentTargetsIndex"), (nG.documentTargetsKeyPath = [
                "path",
                "targetId"
            ]);
            class nj {
                constructor(t, e, n, s){
                    (this.highestTargetId = t), (this.highestListenSequenceNumber = e), (this.lastRemoteSnapshotVersion = n), (this.targetCount = s);
                }
            }
            (nj.key = "targetGlobalKey"), (nj.store = "targetGlobal");
            class nH {
                constructor(t, e){
                    (this.collectionId = t), (this.parent = e);
                }
            }
            (nH.store = "collectionParents"), (nH.keyPath = [
                "collectionId",
                "parent"
            ]);
            class nW {
                constructor(t, e, n, s){
                    (this.clientId = t), (this.updateTimeMs = e), (this.networkEnabled = n), (this.inForeground = s);
                }
            }
            (nW.store = "clientMetadata"), (nW.keyPath = "clientId");
            class n0 {
                constructor(t, e, n){
                    (this.bundleId = t), (this.createTime = e), (this.version = n);
                }
            }
            (n0.store = "bundles"), (n0.keyPath = "bundleId");
            class nY {
                constructor(t, e, n){
                    (this.name = t), (this.readTime = e), (this.bundledQuery = n);
                }
            }
            (nY.store = "namedQueries"), (nY.keyPath = "name");
            const n1 = [
                ...[
                    ...[
                        ...[
                            ...[
                                nO.store,
                                nP.store,
                                nU.store,
                                nK.store,
                                nQ.store,
                                nq.store,
                                nj.store,
                                nG.store, 
                            ],
                            nW.store, 
                        ],
                        nz.store, 
                    ],
                    nH.store, 
                ],
                n0.store,
                nY.store, 
            ], n2 = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
            class nX {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(t) {
                    this.onCommittedListeners.push(t);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((t)=>t());
                }
            }
            class nZ {
                constructor(t){
                    (this.nextCallback = null), (this.catchCallback = null), (this.result = void 0), (this.error = void 0), (this.isDone = !1), (this.callbackAttached = !1), t((t)=>{
                        (this.isDone = !0), (this.result = t), this.nextCallback && this.nextCallback(t);
                    }, (t)=>{
                        (this.isDone = !0), (this.error = t), this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t) {
                    return this.next(void 0, t);
                }
                next(t, e) {
                    return (this.callbackAttached && v(), (this.callbackAttached = !0), this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t, this.result) : new nZ((n, s)=>{
                        (this.nextCallback = (e)=>{
                            this.wrapSuccess(t, e).next(n, s);
                        }), (this.catchCallback = (t)=>{
                            this.wrapFailure(e, t).next(n, s);
                        });
                    }));
                }
                toPromise() {
                    return new Promise((t, e)=>{
                        this.next(t, e);
                    });
                }
                wrapUserFunction(t) {
                    try {
                        const e = t();
                        return e instanceof nZ ? e : nZ.resolve(e);
                    } catch (n) {
                        return nZ.reject(n);
                    }
                }
                wrapSuccess(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : nZ.resolve(e);
                }
                wrapFailure(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : nZ.reject(e);
                }
                static resolve(t) {
                    return new nZ((e, n)=>{
                        e(t);
                    });
                }
                static reject(t) {
                    return new nZ((e, n)=>{
                        n(t);
                    });
                }
                static waitFor(t) {
                    return new nZ((e, n)=>{
                        let s = 0, r = 0, i = !1;
                        t.forEach((t)=>{
                            ++s, t.next(()=>{
                                ++r, i && r === s && e();
                            }, (t)=>n(t));
                        }), (i = !0), r === s && e();
                    });
                }
                static or(t) {
                    let e = nZ.resolve(!1);
                    for (const n of t)e = e.next((t)=>(t ? nZ.resolve(t) : n()));
                    return e;
                }
                static forEach(t, e) {
                    const n = [];
                    return (t.forEach((t, s)=>{
                        n.push(e.call(this, t, s));
                    }), this.waitFor(n));
                }
            }
            class nJ {
                constructor(t, e){
                    (this.action = t), (this.transaction = e), (this.aborted = !1), (this.Et = new N()), (this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }), (this.transaction.onabort = ()=>{
                        e.error ? this.Et.reject(new n6(t, e.error)) : this.Et.resolve();
                    }), (this.transaction.onerror = (e)=>{
                        const n = sn(e.target.error);
                        this.Et.reject(new n6(t, n));
                    });
                }
                static open(t, e, n, s) {
                    try {
                        return new nJ(e, t.transaction(s, n));
                    } catch (r) {
                        throw new n6(e, r);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(t) {
                    t && this.Et.reject(t), this.aborted || (g("SimpleDb", "Aborting transaction:", t ? t.message : "Client-initiated abort"), (this.aborted = !0), this.transaction.abort());
                }
                store(t) {
                    const e = this.transaction.objectStore(t);
                    return new n5(e);
                }
            }
            class n3 {
                constructor(t, e, n){
                    (this.name = t), (this.version = e), (this.At = n);
                    12.2 === n3.Rt(getUA()) && p("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(t) {
                    return (g("SimpleDb", "Removing database:", t), st(window.indexedDB.deleteDatabase(t)).toPromise());
                }
                static bt() {
                    if (!isIndexedDBAvailable()) return !1;
                    if (n3.Pt()) return !0;
                    const t = getUA(), e = n3.Rt(t), n = 0 < e && e < 10, s = n3.vt(t), r = 0 < s && s < 4.5;
                    return !(t.indexOf("MSIE ") > 0 || t.indexOf("Trident/") > 0 || t.indexOf("Edge/") > 0 || n || r);
                }
                static Pt() {
                    var t;
                    return ("undefined" != typeof c && "YES" === (null === (t = c.env) || void 0 === t ? void 0 : t.Vt));
                }
                static St(t, e) {
                    return t.store(e);
                }
                static Rt(t) {
                    const e = t.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = e ? e[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                static vt(t) {
                    const e = t.match(/Android ([\d.]+)/i), n = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                async Dt(t) {
                    return (this.db || (g("SimpleDb", "Opening database:", this.name), (this.db = await new Promise((e, n)=>{
                        const s = indexedDB.open(this.name, this.version);
                        (s.onsuccess = (t)=>{
                            const n = t.target.result;
                            e(n);
                        }), (s.onblocked = ()=>{
                            n(new n6(t, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }), (s.onerror = (e)=>{
                            const s = e.target.error;
                            "VersionError" === s.name ? n(new S($.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n(new S($.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n(new n6(t, s));
                        }), (s.onupgradeneeded = (t)=>{
                            g("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', t.oldVersion);
                            const e = t.target.result;
                            this.At.Ct(e, s.transaction, t.oldVersion, this.version).next(()=>{
                                g("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        });
                    }))), this.Nt && (this.db.onversionchange = (t)=>this.Nt(t)), this.db);
                }
                xt(t) {
                    (this.Nt = t), this.db && (this.db.onversionchange = (e)=>t(e));
                }
                async runTransaction(t, e, n, s) {
                    const r = "readonly" === e;
                    let i = 0;
                    for(;;){
                        ++i;
                        try {
                            this.db = await this.Dt(t);
                            const o = nJ.open(this.db, t, r ? "readonly" : "readwrite", n), a = s(o).catch((t)=>(o.abort(t), nZ.reject(t))).toPromise();
                            return (a.catch(()=>{}), await o.It, a);
                        } catch (c) {
                            const u = "FirebaseError" !== c.name && i < 3;
                            if ((g("SimpleDb", "Transaction failed with error:", c.message, "Retrying:", u), this.close(), !u)) return Promise.reject(c);
                        }
                    }
                }
                close() {
                    this.db && this.db.close(), (this.db = void 0);
                }
            }
            class n4 {
                constructor(t){
                    (this.kt = t), (this.$t = !1), (this.Ot = null);
                }
                get isDone() {
                    return this.$t;
                }
                get Ft() {
                    return this.Ot;
                }
                set cursor(t) {
                    this.kt = t;
                }
                done() {
                    this.$t = !0;
                }
                Mt(t) {
                    this.Ot = t;
                }
                delete() {
                    return st(this.kt.delete());
                }
            }
            class n6 extends (null && S) {
                constructor(t, e){
                    super($.UNAVAILABLE, `IndexedDB transaction '${t}' failed: ${e}`), (this.name = "IndexedDbTransactionError");
                }
            }
            function n7(t) {
                return "IndexedDbTransactionError" === t.name;
            }
            class n5 {
                constructor(t){
                    this.store = t;
                }
                put(t, e) {
                    let n;
                    return (void 0 !== e ? (g("SimpleDb", "PUT", this.store.name, t, e), (n = this.store.put(e, t))) : (g("SimpleDb", "PUT", this.store.name, "<auto-key>", t), (n = this.store.put(t))), st(n));
                }
                add(t) {
                    g("SimpleDb", "ADD", this.store.name, t, t);
                    return st(this.store.add(t));
                }
                get(t) {
                    return st(this.store.get(t)).next((e)=>(void 0 === e && (e = null), g("SimpleDb", "GET", this.store.name, t, e), e));
                }
                delete(t) {
                    g("SimpleDb", "DELETE", this.store.name, t);
                    return st(this.store.delete(t));
                }
                count() {
                    g("SimpleDb", "COUNT", this.store.name);
                    return st(this.store.count());
                }
                Lt(t, e) {
                    const n = this.cursor(this.options(t, e)), s = [];
                    return this.Bt(n, (t, e)=>{
                        s.push(e);
                    }).next(()=>s);
                }
                Ut(t, e) {
                    g("SimpleDb", "DELETE ALL", this.store.name);
                    const n = this.options(t, e);
                    n.qt = !1;
                    const s = this.cursor(n);
                    return this.Bt(s, (t, e, n)=>n.delete());
                }
                Kt(t, e) {
                    let n;
                    e ? (n = t) : ((n = {}), (e = t));
                    const s = this.cursor(n);
                    return this.Bt(s, e);
                }
                jt(t) {
                    const e = this.cursor({});
                    return new nZ((n, s)=>{
                        (e.onerror = (t)=>{
                            const e = sn(t.target.error);
                            s(e);
                        }), (e.onsuccess = (e)=>{
                            const s = e.target.result;
                            s ? t(s.primaryKey, s.value).next((t)=>{
                                t ? s.continue() : n();
                            }) : n();
                        });
                    });
                }
                Bt(t, e) {
                    const n = [];
                    return new nZ((s, r)=>{
                        (t.onerror = (t)=>{
                            r(t.target.error);
                        }), (t.onsuccess = (t)=>{
                            const r = t.target.result;
                            if (!r) return void s();
                            const i = new n4(r), o = e(r.primaryKey, r.value, i);
                            if (o instanceof nZ) {
                                const a = o.catch((t)=>(i.done(), nZ.reject(t)));
                                n.push(a);
                            }
                            i.isDone ? s() : null === i.Ft ? r.continue() : r.continue(i.Ft);
                        });
                    }).next(()=>nZ.waitFor(n));
                }
                options(t, e) {
                    let n;
                    return (void 0 !== t && ("string" == typeof t ? (n = t) : (e = t)), {
                        index: n,
                        range: e
                    });
                }
                cursor(t) {
                    let e = "next";
                    if ((t.reverse && (e = "prev"), t.index)) {
                        const n = this.store.index(t.index);
                        return t.qt ? n.openKeyCursor(t.range, e) : n.openCursor(t.range, e);
                    }
                    return this.store.openCursor(t.range, e);
                }
            }
            function st(t) {
                return new nZ((e, n)=>{
                    (t.onsuccess = (t)=>{
                        const n = t.target.result;
                        e(n);
                    }), (t.onerror = (t)=>{
                        const e = sn(t.target.error);
                        n(e);
                    });
                });
            }
            let se = null && !1;
            function sn(t) {
                const e = n3.Rt(getUA());
                if (e >= 12.2 && e < 13) {
                    const n = "An internal error was encountered in the Indexed Database server";
                    if (t.message.indexOf(n) >= 0) {
                        const s = new S("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return (se || ((se = !0), setTimeout(()=>{
                            throw s;
                        }, 0)), s);
                    }
                }
                return t;
            }
            class ss extends (null && nX) {
                constructor(t, e){
                    super(), (this.Qt = t), (this.currentSequenceNumber = e);
                }
            }
            function sr(t, e) {
                const n = E(t);
                return n3.St(n.Qt, e);
            }
            class si {
                constructor(t, e, n, s){
                    (this.batchId = t), (this.localWriteTime = e), (this.baseMutations = n), (this.mutations = s);
                }
                applyToRemoteDocument(t, e) {
                    const n = e.mutationResults;
                    for(let s = 0; s < this.mutations.length; s++){
                        const r = this.mutations[s];
                        if (r.key.isEqual(t.key)) {
                            eI(r, t, n[s]);
                        }
                    }
                }
                applyToLocalView(t) {
                    for (const e of this.baseMutations)e.key.isEqual(t.key) && eT(e, t, this.localWriteTime);
                    for (const n of this.mutations)n.key.isEqual(t.key) && eT(n, t, this.localWriteTime);
                }
                applyToLocalDocumentSet(t) {
                    this.mutations.forEach((e)=>{
                        const n = t.get(e.key), s = n;
                        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(O.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key), ej());
                }
                isEqual(t) {
                    return (this.batchId === t.batchId && F(this.mutations, t.mutations, (t, e)=>e$(t, e)) && F(this.baseMutations, t.baseMutations, (t, e)=>e$(t, e)));
                }
            }
            class so {
                constructor(t, e, n, s){
                    (this.batch = t), (this.commitVersion = e), (this.mutationResults = n), (this.docVersions = s);
                }
                static from(t, e, n) {
                    I(t.mutations.length === n.length);
                    let s = eQ();
                    const r = t.mutations;
                    for(let i = 0; i < r.length; i++)s = s.insert(r[i].key, n[i].version);
                    return new so(t, e, n, s);
                }
            }
            class sa {
                constructor(t, e, n, s, r = O.min(), i = O.min(), o = W.EMPTY_BYTE_STRING){
                    (this.target = t), (this.targetId = e), (this.purpose = n), (this.sequenceNumber = s), (this.snapshotVersion = r), (this.lastLimboFreeSnapshotVersion = i), (this.resumeToken = o);
                }
                withSequenceNumber(t) {
                    return new sa(this.target, this.targetId, this.purpose, t, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(t, e) {
                    return new sa(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t);
                }
                withLastLimboFreeSnapshotVersion(t) {
                    return new sa(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t, this.resumeToken);
                }
            }
            class sc {
                constructor(t){
                    this.Wt = t;
                }
            }
            function su(t, e) {
                if (e.document) return nf(t.Wt, e.document, !!e.hasCommittedMutations);
                if (e.noDocument) {
                    const n = to.fromSegments(e.noDocument.path), s = sm(e.noDocument.readTime), r = t$.newNoDocument(n, s);
                    return e.hasCommittedMutations ? r.setHasCommittedMutations() : r;
                }
                if (e.unknownDocument) {
                    const i = to.fromSegments(e.unknownDocument.path), o = sm(e.unknownDocument.version);
                    return t$.newUnknownDocument(i, o);
                }
                return v();
            }
            function sh(t, e, n) {
                const s = sl(n), r = e.key.path.popLast().toArray();
                if (e.isFoundDocument()) {
                    const i = (function(t, e) {
                        return {
                            name: no(t, e.key),
                            fields: e.data.value.mapValue.fields,
                            updateTime: nt(t, e.version.toTimestamp())
                        };
                    })(t.Wt, e), o = e.hasCommittedMutations;
                    return new nK(null, null, i, o, s, r);
                }
                if (e.isNoDocument()) {
                    const a = e.key.path.toArray(), c = sf(e.version), u = e.hasCommittedMutations;
                    return new nK(null, new nB(a, c), null, u, s, r);
                }
                if (e.isUnknownDocument()) {
                    const h = e.key.path.toArray(), l = sf(e.version);
                    return new nK(new n9(h, l), null, null, !0, s, r);
                }
                return v();
            }
            function sl(t) {
                const e = t.toTimestamp();
                return [
                    e.seconds,
                    e.nanoseconds
                ];
            }
            function sd(t) {
                const e = new q(t[0], t[1]);
                return O.fromTimestamp(e);
            }
            function sf(t) {
                const e = t.toTimestamp();
                return new nV(e.seconds, e.nanoseconds);
            }
            function sm(t) {
                const e = new q(t.seconds, t.nanoseconds);
                return O.fromTimestamp(e);
            }
            function sg(t, e) {
                const n = (e.baseMutations || []).map((e)=>ny(t.Wt, e));
                for(let s = 0; s < e.mutations.length - 1; ++s){
                    const r = e.mutations[s];
                    if (s + 1 < e.mutations.length && void 0 !== e.mutations[s + 1].transform) {
                        const i = e.mutations[s + 1];
                        (r.updateTransforms = i.transform.fieldTransforms), e.mutations.splice(s + 1, 1), ++s;
                    }
                }
                const o = e.mutations.map((e)=>ny(t.Wt, e)), a = q.fromMillis(e.localWriteTimeMs);
                return new si(e.batchId, a, n, o);
            }
            function sp(t) {
                const e = sm(t.readTime), n = void 0 !== t.lastLimboFreeSnapshotVersion ? sm(t.lastLimboFreeSnapshotVersion) : O.min();
                let s;
                var r;
                return (void 0 !== t.query.documents ? (I(1 === (r = t.query).documents.length), (s = t2(tG(nu(r.documents[0]))))) : (s = (function(t) {
                    return t2(nT(t));
                })(t.query)), new sa(s, t.targetId, 0, t.lastListenSequenceNumber, e, n, W.fromBase64String(t.resumeToken)));
            }
            function sy(t, e) {
                const n = sf(e.snapshotVersion), s = sf(e.lastLimboFreeSnapshotVersion);
                let r;
                r = tk(e.target) ? nv(t.Wt, e.target) : nI(t.Wt, e.target);
                const i = e.resumeToken.toBase64();
                return new nQ(e.targetId, tN(e.target), n, i, e.sequenceNumber, s, r);
            }
            function sw(t) {
                const e = nT({
                    parent: t.parent,
                    structuredQuery: t.structuredQuery
                });
                return "LAST" === t.limitType ? tX(e, e.limit, "L") : e;
            }
            class sv {
                getBundleMetadata(t, e) {
                    return sI(t).get(e).next((t)=>{
                        if (t) return {
                            id: (e = t).bundleId,
                            createTime: sm(e.createTime),
                            version: e.version
                        };
                        var e;
                    });
                }
                saveBundleMetadata(t, e) {
                    return sI(t).put({
                        bundleId: (n = e).id,
                        createTime: sf(ns(n.createTime)),
                        version: n.version
                    });
                    var n;
                }
                getNamedQuery(t, e) {
                    return sT(t).get(e).next((t)=>{
                        if (t) return {
                            name: (e = t).name,
                            query: sw(e.bundledQuery),
                            readTime: sm(e.readTime)
                        };
                        var e;
                    });
                }
                saveNamedQuery(t, e) {
                    return sT(t).put((function(t) {
                        return {
                            name: t.name,
                            readTime: sf(ns(t.readTime)),
                            bundledQuery: t.bundledQuery
                        };
                    })(e));
                }
            }
            function sI(t) {
                return sr(t, n0.store);
            }
            function sT(t) {
                return sr(t, nY.store);
            }
            class sE {
                constructor(){
                    this.Gt = new s$();
                }
                addToCollectionParentIndex(t, e) {
                    return this.Gt.add(e), nZ.resolve();
                }
                getCollectionParents(t, e) {
                    return nZ.resolve(this.Gt.getEntries(e));
                }
            }
            class s$ {
                constructor(){
                    this.index = {};
                }
                add(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new eO(z.comparator), r = !s.has(n);
                    return (this.index[e] = s.add(n)), r;
                }
                has(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e];
                    return s && s.has(n);
                }
                getEntries(t) {
                    return (this.index[t] || new eO(z.comparator)).toArray();
                }
            }
            class sS {
                constructor(){
                    this.zt = new s$();
                }
                addToCollectionParentIndex(t, e) {
                    if (!this.zt.has(e)) {
                        const n = e.lastSegment(), s = e.popLast();
                        t.addOnCommittedListener(()=>{
                            this.zt.add(e);
                        });
                        const r = {
                            collectionId: n,
                            parent: n_(s)
                        };
                        return s8(t).put(r);
                    }
                    return nZ.resolve();
                }
                getCollectionParents(t, e) {
                    const n = [], s = IDBKeyRange.bound([
                        e,
                        ""
                    ], [
                        V(e),
                        ""
                    ], !1, !0);
                    return s8(t).Lt(s).next((t)=>{
                        for (const s of t){
                            if (s.collectionId !== e) break;
                            n.push(nF(s.parent));
                        }
                        return n;
                    });
                }
            }
            function s8(t) {
                return sr(t, nH.store);
            }
            const sN = {
                didRun: !1,
                sequenceNumbersCollected: 0,
                targetsRemoved: 0,
                documentsRemoved: 0
            };
            class sb {
                constructor(t, e, n){
                    (this.cacheSizeCollectionThreshold = t), (this.percentileToCollect = e), (this.maximumSequenceNumbersToCollect = n);
                }
                static withCacheSize(t) {
                    return new sb(t, sb.DEFAULT_COLLECTION_PERCENTILE, sb.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            function sA(t, e, n) {
                const s = t.store(nP.store), r = t.store(nU.store), i = [], o = IDBKeyRange.only(n.batchId);
                let a = 0;
                const c = s.Kt({
                    range: o
                }, (t, e, n)=>(a++, n.delete()));
                i.push(c.next(()=>{
                    I(1 === a);
                }));
                const u = [];
                for (const h of n.mutations){
                    const l = nU.key(e, h.key.path, n.batchId);
                    i.push(r.delete(l)), u.push(h.key);
                }
                return nZ.waitFor(i).next(()=>u);
            }
            function sk(t) {
                if (!t) return 0;
                let e;
                if (t.document) e = t.document;
                else if (t.unknownDocument) e = t.unknownDocument;
                else {
                    if (!t.noDocument) throw v();
                    e = t.noDocument;
                }
                return JSON.stringify(e).length;
            }
            (sb.DEFAULT_COLLECTION_PERCENTILE = 10), (sb.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3), (sb.DEFAULT = new sb(41943040, sb.DEFAULT_COLLECTION_PERCENTILE, sb.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)), (sb.DISABLED = new sb(-1, 0, 0));
            class sD {
                constructor(t, e, n, s){
                    (this.userId = t), (this.N = e), (this.Ht = n), (this.referenceDelegate = s), (this.Jt = {});
                }
                static Yt(t, e, n, s) {
                    I("" !== t.uid);
                    const r = t.isAuthenticated() ? t.uid : "";
                    return new sD(r, e, n, s);
                }
                checkEmpty(t) {
                    let e = !0;
                    const n = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return sC(t).Kt({
                        index: nP.userMutationsIndex,
                        range: n
                    }, (t, n, s)=>{
                        (e = !1), s.done();
                    }).next(()=>e);
                }
                addMutationBatch(t, e, n, s) {
                    const r = sL(t), i = sC(t);
                    return i.add({}).next((o)=>{
                        I("number" == typeof o);
                        const a = new si(o, e, n, s), c = (function(t, e, n) {
                            const s = n.baseMutations.map((e)=>np(t.Wt, e)), r = n.mutations.map((e)=>np(t.Wt, e));
                            return new nP(e, n.batchId, n.localWriteTime.toMillis(), s, r);
                        })(this.N, this.userId, a), u = [];
                        let h = new eO((t, e)=>R(t.canonicalString(), e.canonicalString()));
                        for (const l of s){
                            const d = nU.key(this.userId, l.key.path, o);
                            (h = h.add(l.key.path.popLast())), u.push(i.put(c)), u.push(r.put(d, nU.PLACEHOLDER));
                        }
                        return (h.forEach((e)=>{
                            u.push(this.Ht.addToCollectionParentIndex(t, e));
                        }), t.addOnCommittedListener(()=>{
                            this.Jt[o] = a.keys();
                        }), nZ.waitFor(u).next(()=>a));
                    });
                }
                lookupMutationBatch(t, e) {
                    return sC(t).get(e).next((t)=>t ? (I(t.userId === this.userId), sg(this.N, t)) : null);
                }
                Xt(t, e) {
                    return this.Jt[e] ? nZ.resolve(this.Jt[e]) : this.lookupMutationBatch(t, e).next((t)=>{
                        if (t) {
                            const n = t.keys();
                            return (this.Jt[e] = n), n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(t, e) {
                    const n = e + 1, s = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let r = null;
                    return sC(t).Kt({
                        index: nP.userMutationsIndex,
                        range: s
                    }, (t, e, s)=>{
                        e.userId === this.userId && (I(e.batchId >= n), (r = sg(this.N, e))), s.done();
                    }).next(()=>r);
                }
                getHighestUnacknowledgedBatchId(t) {
                    const e = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY, 
                    ]);
                    let n = -1;
                    return sC(t).Kt({
                        index: nP.userMutationsIndex,
                        range: e,
                        reverse: !0
                    }, (t, e, s)=>{
                        (n = e.batchId), s.done();
                    }).next(()=>n);
                }
                getAllMutationBatches(t) {
                    const e = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return sC(t).Lt(nP.userMutationsIndex, e).next((t)=>t.map((t)=>sg(this.N, t)));
                }
                getAllMutationBatchesAffectingDocumentKey(t, e) {
                    const n = nU.prefixForPath(this.userId, e.path), s = IDBKeyRange.lowerBound(n), r = [];
                    return sL(t).Kt({
                        range: s
                    }, (n, s, i)=>{
                        const [o, a, c] = n, u = nF(a);
                        if (o === this.userId && e.path.isEqual(u)) return sC(t).get(c).next((t)=>{
                            if (!t) throw v();
                            I(t.userId === this.userId), r.push(sg(this.N, t));
                        });
                        i.done();
                    }).next(()=>r);
                }
                getAllMutationBatchesAffectingDocumentKeys(t, e) {
                    let n = new eO(R);
                    const s = [];
                    return (e.forEach((e)=>{
                        const r = nU.prefixForPath(this.userId, e.path), i = IDBKeyRange.lowerBound(r), o = sL(t).Kt({
                            range: i
                        }, (t, s, r)=>{
                            const [i, o, a] = t, c = nF(o);
                            i === this.userId && e.path.isEqual(c) ? (n = n.add(a)) : r.done();
                        });
                        s.push(o);
                    }), nZ.waitFor(s).next(()=>this.Zt(t, n)));
                }
                getAllMutationBatchesAffectingQuery(t, e) {
                    const n = e.path, s = n.length + 1, r = nU.prefixForPath(this.userId, n), i = IDBKeyRange.lowerBound(r);
                    let o = new eO(R);
                    return sL(t).Kt({
                        range: i
                    }, (t, e, r)=>{
                        const [i, a, c] = t, u = nF(a);
                        i === this.userId && n.isPrefixOf(u) ? u.length === s && (o = o.add(c)) : r.done();
                    }).next(()=>this.Zt(t, o));
                }
                Zt(t, e) {
                    const n = [], s = [];
                    return (e.forEach((e)=>{
                        s.push(sC(t).get(e).next((t)=>{
                            if (null === t) throw v();
                            I(t.userId === this.userId), n.push(sg(this.N, t));
                        }));
                    }), nZ.waitFor(s).next(()=>n));
                }
                removeMutationBatch(t, e) {
                    return sA(t.Qt, this.userId, e).next((n)=>(t.addOnCommittedListener(()=>{
                            this.te(e.batchId);
                        }), nZ.forEach(n, (e)=>this.referenceDelegate.markPotentiallyOrphaned(t, e))));
                }
                te(t) {
                    delete this.Jt[t];
                }
                performConsistencyCheck(t) {
                    return this.checkEmpty(t).next((e)=>{
                        if (!e) return nZ.resolve();
                        const n = IDBKeyRange.lowerBound(nU.prefixForUser(this.userId)), s = [];
                        return sL(t).Kt({
                            range: n
                        }, (t, e, n)=>{
                            if (t[0] === this.userId) {
                                const r = nF(t[1]);
                                s.push(r);
                            } else n.done();
                        }).next(()=>{
                            I(0 === s.length);
                        });
                    });
                }
                containsKey(t, e) {
                    return sx(t, this.userId, e);
                }
                ee(t) {
                    return s_(t).get(this.userId).next((t)=>t || new nO(this.userId, -1, ""));
                }
            }
            function sx(t, e, n) {
                const s = nU.prefixForPath(e, n.path), r = s[1], i = IDBKeyRange.lowerBound(s);
                let o = !1;
                return sL(t).Kt({
                    range: i,
                    qt: !0
                }, (t, n, s)=>{
                    const [i, a, c] = t;
                    i === e && a === r && (o = !0), s.done();
                }).next(()=>o);
            }
            function sC(t) {
                return sr(t, nP.store);
            }
            function sL(t) {
                return sr(t, nU.store);
            }
            function s_(t) {
                return sr(t, nO.store);
            }
            class sM {
                constructor(t){
                    this.ne = t;
                }
                next() {
                    return (this.ne += 2), this.ne;
                }
                static se() {
                    return new sM(0);
                }
                static ie() {
                    return new sM(-1);
                }
            }
            class sR {
                constructor(t, e){
                    (this.referenceDelegate = t), (this.N = e);
                }
                allocateTargetId(t) {
                    return this.re(t).next((e)=>{
                        const n = new sM(e.highestTargetId);
                        return ((e.highestTargetId = n.next()), this.oe(t, e).next(()=>e.highestTargetId));
                    });
                }
                getLastRemoteSnapshotVersion(t) {
                    return this.re(t).next((t)=>O.fromTimestamp(new q(t.lastRemoteSnapshotVersion.seconds, t.lastRemoteSnapshotVersion.nanoseconds)));
                }
                getHighestSequenceNumber(t) {
                    return this.re(t).next((t)=>t.highestListenSequenceNumber);
                }
                setTargetsMetadata(t, e, n) {
                    return this.re(t).next((s)=>((s.highestListenSequenceNumber = e), n && (s.lastRemoteSnapshotVersion = n.toTimestamp()), e > s.highestListenSequenceNumber && (s.highestListenSequenceNumber = e), this.oe(t, s)));
                }
                addTargetData(t, e) {
                    return this.ce(t, e).next(()=>this.re(t).next((n)=>((n.targetCount += 1), this.ae(e, n), this.oe(t, n))));
                }
                updateTargetData(t, e) {
                    return this.ce(t, e);
                }
                removeTargetData(t, e) {
                    return this.removeMatchingKeysForTargetId(t, e.targetId).next(()=>sF(t).delete(e.targetId)).next(()=>this.re(t)).next((e)=>(I(e.targetCount > 0), (e.targetCount -= 1), this.oe(t, e)));
                }
                removeTargets(t, e, n) {
                    let s = 0;
                    const r = [];
                    return sF(t).Kt((i, o)=>{
                        const a = sp(o);
                        a.sequenceNumber <= e && null === n.get(a.targetId) && (s++, r.push(this.removeTargetData(t, a)));
                    }).next(()=>nZ.waitFor(r)).next(()=>s);
                }
                forEachTarget(t, e) {
                    return sF(t).Kt((t, n)=>{
                        const s = sp(n);
                        e(s);
                    });
                }
                re(t) {
                    return sV(t).get(nj.key).next((t)=>(I(null !== t), t));
                }
                oe(t, e) {
                    return sV(t).put(nj.key, e);
                }
                ce(t, e) {
                    return sF(t).put(sy(this.N, e));
                }
                ae(t, e) {
                    let n = !1;
                    return (t.targetId > e.highestTargetId && ((e.highestTargetId = t.targetId), (n = !0)), t.sequenceNumber > e.highestListenSequenceNumber && ((e.highestListenSequenceNumber = t.sequenceNumber), (n = !0)), n);
                }
                getTargetCount(t) {
                    return this.re(t).next((t)=>t.targetCount);
                }
                getTargetData(t, e) {
                    const n = tN(e), s = IDBKeyRange.bound([
                        n,
                        Number.NEGATIVE_INFINITY
                    ], [
                        n,
                        Number.POSITIVE_INFINITY
                    ]);
                    let r = null;
                    return sF(t).Kt({
                        range: s,
                        index: nQ.queryTargetsIndexName
                    }, (t, n, s)=>{
                        const i = sp(n);
                        tA(e, i.target) && ((r = i), s.done());
                    }).next(()=>r);
                }
                addMatchingKeys(t, e, n) {
                    const s = [], r = sq(t);
                    return (e.forEach((e)=>{
                        const i = n_(e.path);
                        s.push(r.put(new nG(n, i))), s.push(this.referenceDelegate.addReference(t, n, e));
                    }), nZ.waitFor(s));
                }
                removeMatchingKeys(t, e, n) {
                    const s = sq(t);
                    return nZ.forEach(e, (e)=>{
                        const r = n_(e.path);
                        return nZ.waitFor([
                            s.delete([
                                n,
                                r
                            ]),
                            this.referenceDelegate.removeReference(t, n, e), 
                        ]);
                    });
                }
                removeMatchingKeysForTargetId(t, e) {
                    const n = sq(t), s = IDBKeyRange.bound([
                        e
                    ], [
                        e + 1
                    ], !1, !0);
                    return n.delete(s);
                }
                getMatchingKeysForTargetId(t, e) {
                    const n = IDBKeyRange.bound([
                        e
                    ], [
                        e + 1
                    ], !1, !0), s = sq(t);
                    let r = ej();
                    return s.Kt({
                        range: n,
                        qt: !0
                    }, (t, e, n)=>{
                        const s = nF(t[1]), i = new to(s);
                        r = r.add(i);
                    }).next(()=>r);
                }
                containsKey(t, e) {
                    const n = n_(e.path), s = IDBKeyRange.bound([
                        n
                    ], [
                        V(n)
                    ], !1, !0);
                    let r = 0;
                    return sq(t).Kt({
                        index: nG.documentTargetsIndex,
                        qt: !0,
                        range: s
                    }, ([t, e], n, s)=>{
                        0 !== t && (r++, s.done());
                    }).next(()=>r > 0);
                }
                Tt(t, e) {
                    return sF(t).get(e).next((t)=>(t ? sp(t) : null));
                }
            }
            function sF(t) {
                return sr(t, nQ.store);
            }
            function sV(t) {
                return sr(t, nj.store);
            }
            function sq(t) {
                return sr(t, nG.store);
            }
            async function sO(t) {
                if (t.code !== $.FAILED_PRECONDITION || t.message !== n2) throw t;
                g("LocalStore", "Unexpectedly lost primary lease");
            }
            function sP([t, e], [n, s]) {
                const r = R(t, n);
                return 0 === r ? R(e, s) : r;
            }
            class sU {
                constructor(t){
                    (this.ue = t), (this.buffer = new eO(sP)), (this.he = 0);
                }
                le() {
                    return ++this.he;
                }
                fe(t) {
                    const e = [
                        t,
                        this.le()
                    ];
                    if (this.buffer.size < this.ue) this.buffer = this.buffer.add(e);
                    else {
                        const n = this.buffer.last();
                        sP(e, n) < 0 && (this.buffer = this.buffer.delete(n).add(e));
                    }
                }
                get maxValue() {
                    return this.buffer.last()[0];
                }
            }
            class sB {
                constructor(t, e){
                    (this.garbageCollector = t), (this.asyncQueue = e), (this.de = !1), (this.we = null);
                }
                start(t) {
                    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this._e(t);
                }
                stop() {
                    this.we && (this.we.cancel(), (this.we = null));
                }
                get started() {
                    return null !== this.we;
                }
                _e(t) {
                    const e = this.de ? 3e5 : 6e4;
                    g("LruGarbageCollector", `Garbage collection scheduled in ${e}ms`), (this.we = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async ()=>{
                        (this.we = null), (this.de = !0);
                        try {
                            await t.collectGarbage(this.garbageCollector);
                        } catch (e) {
                            n7(e) ? g("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", e) : await sO(e);
                        }
                        await this._e(t);
                    }));
                }
            }
            class s9 {
                constructor(t, e){
                    (this.me = t), (this.params = e);
                }
                calculateTargetCount(t, e) {
                    return this.me.ge(t).next((t)=>Math.floor((e / 100) * t));
                }
                nthSequenceNumber(t, e) {
                    if (0 === e) return nZ.resolve(L.T);
                    const n = new sU(e);
                    return this.me.forEachTarget(t, (t)=>n.fe(t.sequenceNumber)).next(()=>this.me.ye(t, (t)=>n.fe(t))).next(()=>n.maxValue);
                }
                removeTargets(t, e, n) {
                    return this.me.removeTargets(t, e, n);
                }
                removeOrphanedDocuments(t, e) {
                    return this.me.removeOrphanedDocuments(t, e);
                }
                collect(t, e) {
                    return -1 === this.params.cacheSizeCollectionThreshold ? (g("LruGarbageCollector", "Garbage collection skipped; disabled"), nZ.resolve(sN)) : this.getCacheSize(t).next((n)=>n < this.params.cacheSizeCollectionThreshold ? (g("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), sN) : this.pe(t, e));
                }
                getCacheSize(t) {
                    return this.me.getCacheSize(t);
                }
                pe(t, e) {
                    let n, s, r, i, o, a, c;
                    const u = Date.now();
                    return this.calculateTargetCount(t, this.params.percentileToCollect).next((e)=>(e > this.params.maximumSequenceNumbersToCollect ? (g("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${e}`), (s = this.params.maximumSequenceNumbersToCollect)) : (s = e), (i = Date.now()), this.nthSequenceNumber(t, s))).next((s)=>((n = s), (o = Date.now()), this.removeTargets(t, n, e))).next((e)=>((r = e), (a = Date.now()), this.removeOrphanedDocuments(t, n))).next((t)=>{
                        if (((c = Date.now()), f() <= LogLevel.DEBUG)) {
                            g("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${i - u}ms\n\tDetermined least recently used ${s} in ` + (o - i) + "ms\n" + `\tRemoved ${r} targets in ` + (a - o) + "ms\n" + `\tRemoved ${t} documents in ` + (c - a) + "ms\n" + `Total Duration: ${c - u}ms`);
                        }
                        return nZ.resolve({
                            didRun: !0,
                            sequenceNumbersCollected: s,
                            targetsRemoved: r,
                            documentsRemoved: t
                        });
                    });
                }
            }
            class sK {
                constructor(t, e){
                    (this.db = t), (this.garbageCollector = (function(t, e) {
                        return new s9(t, e);
                    })(this, e));
                }
                ge(t) {
                    const e = this.Te(t);
                    return this.db.getTargetCache().getTargetCount(t).next((t)=>e.next((e)=>t + e));
                }
                Te(t) {
                    let e = 0;
                    return this.ye(t, (t)=>{
                        e++;
                    }).next(()=>e);
                }
                forEachTarget(t, e) {
                    return this.db.getTargetCache().forEachTarget(t, e);
                }
                ye(t, e) {
                    return this.Ee(t, (t, n)=>e(n));
                }
                addReference(t, e, n) {
                    return sz(t, n);
                }
                removeReference(t, e, n) {
                    return sz(t, n);
                }
                removeTargets(t, e, n) {
                    return this.db.getTargetCache().removeTargets(t, e, n);
                }
                markPotentiallyOrphaned(t, e) {
                    return sz(t, e);
                }
                Ie(t, e) {
                    return (function(t, e) {
                        let n = !1;
                        return s_(t).jt((s)=>sx(t, s, e).next((t)=>(t && (n = !0), nZ.resolve(!t)))).next(()=>n);
                    })(t, e);
                }
                removeOrphanedDocuments(t, e) {
                    const n = this.db.getRemoteDocumentCache().newChangeBuffer(), s = [];
                    let r = 0;
                    return this.Ee(t, (i, o)=>{
                        if (o <= e) {
                            const a = this.Ie(t, i).next((e)=>{
                                if (!e) return (r++, n.getEntry(t, i).next(()=>(n.removeEntry(i), sq(t).delete([
                                        0,
                                        n_(i.path), 
                                    ]))));
                            });
                            s.push(a);
                        }
                    }).next(()=>nZ.waitFor(s)).next(()=>n.apply(t)).next(()=>r);
                }
                removeTarget(t, e) {
                    const n = e.withSequenceNumber(t.currentSequenceNumber);
                    return this.db.getTargetCache().updateTargetData(t, n);
                }
                updateLimboDocument(t, e) {
                    return sz(t, e);
                }
                Ee(t, e) {
                    const n = sq(t);
                    let s, r = L.T;
                    return n.Kt({
                        index: nG.documentTargetsIndex
                    }, ([t, n], { path: i , sequenceNumber: o  })=>{
                        0 === t ? (r !== L.T && e(new to(nF(s)), r), (r = o), (s = i)) : (r = L.T);
                    }).next(()=>{
                        r !== L.T && e(new to(nF(s)), r);
                    });
                }
                getCacheSize(t) {
                    return this.db.getRemoteDocumentCache().getSize(t);
                }
            }
            function sz(t, e) {
                return sq(t).put((function(t, e) {
                    return new nG(0, n_(t.path), e);
                })(e, t.currentSequenceNumber));
            }
            class sQ {
                constructor(t, e){
                    (this.mapKeyFn = t), (this.equalsFn = e), (this.inner = {});
                }
                get(t) {
                    const e = this.mapKeyFn(t), n = this.inner[e];
                    if (void 0 !== n) for (const [s, r] of n)if (this.equalsFn(s, t)) return r;
                }
                has(t) {
                    return void 0 !== this.get(t);
                }
                set(t, e) {
                    const n = this.mapKeyFn(t), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let r = 0; r < s.length; r++)if (this.equalsFn(s[r][0], t)) return void (s[r] = [
                            t,
                            e
                        ]);
                        s.push([
                            t,
                            e
                        ]);
                    } else this.inner[n] = [
                        [
                            t,
                            e
                        ]
                    ];
                }
                delete(t) {
                    const e = this.mapKeyFn(t), n = this.inner[e];
                    if (void 0 === n) return !1;
                    for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t)) return (1 === n.length ? delete this.inner[e] : n.splice(s, 1), !0);
                    return !1;
                }
                forEach(t) {
                    U(this.inner, (e, n)=>{
                        for (const [s, r] of n)t(s, r);
                    });
                }
                isEmpty() {
                    return B(this.inner);
                }
            }
            class sG {
                constructor(){
                    (this.changes = new sQ((t)=>t.toString(), (t, e)=>t.isEqual(e))), (this.changesApplied = !1);
                }
                getReadTime(t) {
                    const e = this.changes.get(t);
                    return e ? e.readTime : O.min();
                }
                addEntry(t, e) {
                    this.assertNotApplied(), this.changes.set(t.key, {
                        document: t,
                        readTime: e
                    });
                }
                removeEntry(t, e = null) {
                    this.assertNotApplied(), this.changes.set(t, {
                        document: t$.newInvalidDocument(t),
                        readTime: e
                    });
                }
                getEntry(t, e) {
                    this.assertNotApplied();
                    const n = this.changes.get(e);
                    return void 0 !== n ? nZ.resolve(n.document) : this.getFromCache(t, e);
                }
                getEntries(t, e) {
                    return this.getAllFromCache(t, e);
                }
                apply(t) {
                    return (this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(t));
                }
                assertNotApplied() {}
            }
            class sj {
                constructor(t, e){
                    (this.N = t), (this.Ht = e);
                }
                addEntry(t, e, n) {
                    return s0(t).put(sY(e), n);
                }
                removeEntry(t, e) {
                    const n = s0(t), s = sY(e);
                    return n.delete(s);
                }
                updateMetadata(t, e) {
                    return this.getMetadata(t).next((n)=>((n.byteSize += e), this.Ae(t, n)));
                }
                getEntry(t, e) {
                    return s0(t).get(sY(e)).next((t)=>this.Re(e, t));
                }
                be(t, e) {
                    return s0(t).get(sY(e)).next((t)=>({
                            document: this.Re(e, t),
                            size: sk(t)
                        }));
                }
                getEntries(t, e) {
                    let n = eB();
                    return this.Pe(t, e, (t, e)=>{
                        const s = this.Re(t, e);
                        n = n.insert(t, s);
                    }).next(()=>n);
                }
                ve(t, e) {
                    let n = eB(), s = new eF(to.comparator);
                    return this.Pe(t, e, (t, e)=>{
                        const r = this.Re(t, e);
                        (n = n.insert(t, r)), (s = s.insert(t, sk(e)));
                    }).next(()=>({
                            documents: n,
                            Ve: s
                        }));
                }
                Pe(t, e, n) {
                    if (e.isEmpty()) return nZ.resolve();
                    const s = IDBKeyRange.bound(e.first().path.toArray(), e.last().path.toArray()), r = e.getIterator();
                    let i = r.getNext();
                    return s0(t).Kt({
                        range: s
                    }, (t, e, s)=>{
                        const o = to.fromSegments(t);
                        for(; i && to.comparator(i, o) < 0;)n(i, null), (i = r.getNext());
                        i && i.isEqual(o) && (n(i, e), (i = r.hasNext() ? r.getNext() : null)), i ? s.Mt(i.path.toArray()) : s.done();
                    }).next(()=>{
                        for(; i;)n(i, null), (i = r.hasNext() ? r.getNext() : null);
                    });
                }
                getDocumentsMatchingQuery(t, e, n) {
                    let s = eB();
                    const r = e.path.length + 1, i = {};
                    if (n.isEqual(O.min())) {
                        const o = e.path.toArray();
                        i.range = IDBKeyRange.lowerBound(o);
                    } else {
                        const a = e.path.toArray(), c = sl(n);
                        (i.range = IDBKeyRange.lowerBound([
                            a,
                            c
                        ], !0)), (i.index = nK.collectionReadTimeIndex);
                    }
                    return s0(t).Kt(i, (t, n, i)=>{
                        if (t.length !== r) return;
                        const o = su(this.N, n);
                        e.path.isPrefixOf(o.key.path) ? t4(e, o) && (s = s.insert(o.key, o)) : i.done();
                    }).next(()=>s);
                }
                newChangeBuffer(t) {
                    return new sH(this, !!t && t.trackRemovals);
                }
                getSize(t) {
                    return this.getMetadata(t).next((t)=>t.byteSize);
                }
                getMetadata(t) {
                    return sW(t).get(nz.key).next((t)=>(I(!!t), t));
                }
                Ae(t, e) {
                    return sW(t).put(nz.key, e);
                }
                Re(t, e) {
                    if (e) {
                        const n = su(this.N, e);
                        if (!(n.isNoDocument() && n.version.isEqual(O.min()))) return n;
                    }
                    return t$.newInvalidDocument(t);
                }
            }
            class sH extends (null && sG) {
                constructor(t, e){
                    super(), (this.Se = t), (this.trackRemovals = e), (this.De = new sQ((t)=>t.toString(), (t, e)=>t.isEqual(e)));
                }
                applyChanges(t) {
                    const e = [];
                    let n = 0, s = new eO((t, e)=>R(t.canonicalString(), e.canonicalString()));
                    return (this.changes.forEach((r, i)=>{
                        const o = this.De.get(r);
                        if (i.document.isValidDocument()) {
                            const a = sh(this.Se.N, i.document, this.getReadTime(r));
                            s = s.add(r.path.popLast());
                            const c = sk(a);
                            (n += c - o), e.push(this.Se.addEntry(t, r, a));
                        } else if (((n -= o), this.trackRemovals)) {
                            const u = sh(this.Se.N, t$.newNoDocument(r, O.min()), this.getReadTime(r));
                            e.push(this.Se.addEntry(t, r, u));
                        } else e.push(this.Se.removeEntry(t, r));
                    }), s.forEach((n)=>{
                        e.push(this.Se.Ht.addToCollectionParentIndex(t, n));
                    }), e.push(this.Se.updateMetadata(t, n)), nZ.waitFor(e));
                }
                getFromCache(t, e) {
                    return this.Se.be(t, e).next((t)=>(this.De.set(e, t.size), t.document));
                }
                getAllFromCache(t, e) {
                    return this.Se.ve(t, e).next(({ documents: t , Ve: e  })=>(e.forEach((t, e)=>{
                            this.De.set(t, e);
                        }), t));
                }
            }
            function sW(t) {
                return sr(t, nz.store);
            }
            function s0(t) {
                return sr(t, nK.store);
            }
            function sY(t) {
                return t.path.toArray();
            }
            class s1 {
                constructor(t){
                    this.N = t;
                }
                Ct(t, e, n, s) {
                    I(n < s && n >= 0 && s <= 11);
                    const r = new nJ("createOrUpgrade", e);
                    n < 1 && s >= 1 && ((function(t) {
                        t.createObjectStore(nq.store);
                    })(t), (function(t) {
                        t.createObjectStore(nO.store, {
                            keyPath: nO.keyPath
                        });
                        t.createObjectStore(nP.store, {
                            keyPath: nP.keyPath,
                            autoIncrement: !0
                        }).createIndex(nP.userMutationsIndex, nP.userMutationsKeyPath, {
                            unique: !0
                        }), t.createObjectStore(nU.store);
                    })(t), s2(t), (function(t) {
                        t.createObjectStore(nK.store);
                    })(t));
                    let i = nZ.resolve();
                    return (n < 3 && s >= 3 && (0 !== n && (!(function(t) {
                        t.deleteObjectStore(nG.store), t.deleteObjectStore(nQ.store), t.deleteObjectStore(nj.store);
                    })(t), s2(t)), (i = i.next(()=>(function(t) {
                            const e = t.store(nj.store), n = new nj(0, 0, O.min().toTimestamp(), 0);
                            return e.put(nj.key, n);
                        })(r)))), n < 4 && s >= 4 && (0 !== n && (i = i.next(()=>(function(t, e) {
                            return e.store(nP.store).Lt().next((n)=>{
                                t.deleteObjectStore(nP.store);
                                t.createObjectStore(nP.store, {
                                    keyPath: nP.keyPath,
                                    autoIncrement: !0
                                }).createIndex(nP.userMutationsIndex, nP.userMutationsKeyPath, {
                                    unique: !0
                                });
                                const s = e.store(nP.store), r = n.map((t)=>s.put(t));
                                return nZ.waitFor(r);
                            });
                        })(t, r))), (i = i.next(()=>{
                        !(function(t) {
                            t.createObjectStore(nW.store, {
                                keyPath: nW.keyPath
                            });
                        })(t);
                    }))), n < 5 && s >= 5 && (i = i.next(()=>this.Ce(r))), n < 6 && s >= 6 && (i = i.next(()=>((function(t) {
                            t.createObjectStore(nz.store);
                        })(t), this.Ne(r)))), n < 7 && s >= 7 && (i = i.next(()=>this.xe(r))), n < 8 && s >= 8 && (i = i.next(()=>this.ke(t, r))), n < 9 && s >= 9 && (i = i.next(()=>{
                        !(function(t) {
                            t.objectStoreNames.contains("remoteDocumentChanges") && t.deleteObjectStore("remoteDocumentChanges");
                        })(t), (function(t) {
                            const e = t.objectStore(nK.store);
                            e.createIndex(nK.readTimeIndex, nK.readTimeIndexPath, {
                                unique: !1
                            }), e.createIndex(nK.collectionReadTimeIndex, nK.collectionReadTimeIndexPath, {
                                unique: !1
                            });
                        })(e);
                    })), n < 10 && s >= 10 && (i = i.next(()=>this.$e(r))), n < 11 && s >= 11 && (i = i.next(()=>{
                        !(function(t) {
                            t.createObjectStore(n0.store, {
                                keyPath: n0.keyPath
                            });
                        })(t), (function(t) {
                            t.createObjectStore(nY.store, {
                                keyPath: nY.keyPath
                            });
                        })(t);
                    })), i);
                }
                Ne(t) {
                    let e = 0;
                    return t.store(nK.store).Kt((t, n)=>{
                        e += sk(n);
                    }).next(()=>{
                        const n = new nz(e);
                        return t.store(nz.store).put(nz.key, n);
                    });
                }
                Ce(t) {
                    const e = t.store(nO.store), n = t.store(nP.store);
                    return e.Lt().next((e)=>nZ.forEach(e, (e)=>{
                            const s = IDBKeyRange.bound([
                                e.userId,
                                -1
                            ], [
                                e.userId,
                                e.lastAcknowledgedBatchId
                            ]);
                            return n.Lt(nP.userMutationsIndex, s).next((n)=>nZ.forEach(n, (n)=>{
                                    I(n.userId === e.userId);
                                    const s = sg(this.N, n);
                                    return sA(t, e.userId, s).next(()=>{});
                                }));
                        }));
                }
                xe(t) {
                    const e = t.store(nG.store), n = t.store(nK.store);
                    return t.store(nj.store).get(nj.key).next((t)=>{
                        const s = [];
                        return n.Kt((n, r)=>{
                            const i = new z(n), o = (function(t) {
                                return [
                                    0,
                                    n_(t)
                                ];
                            })(i);
                            s.push(e.get(o).next((n)=>n ? nZ.resolve() : ((n)=>e.put(new nG(0, n_(n), t.highestListenSequenceNumber)))(i)));
                        }).next(()=>nZ.waitFor(s));
                    });
                }
                ke(t, e) {
                    t.createObjectStore(nH.store, {
                        keyPath: nH.keyPath
                    });
                    const n = e.store(nH.store), s = new s$(), r = (t)=>{
                        if (s.add(t)) {
                            const e = t.lastSegment(), r = t.popLast();
                            return n.put({
                                collectionId: e,
                                parent: n_(r)
                            });
                        }
                    };
                    return e.store(nK.store).Kt({
                        qt: !0
                    }, (t, e)=>{
                        const n = new z(t);
                        return r(n.popLast());
                    }).next(()=>e.store(nU.store).Kt({
                            qt: !0
                        }, ([t, e, n], s)=>{
                            const i = nF(e);
                            return r(i.popLast());
                        }));
                }
                $e(t) {
                    const e = t.store(nQ.store);
                    return e.Kt((t, n)=>{
                        const s = sp(n), r = sy(this.N, s);
                        return e.put(r);
                    });
                }
            }
            function s2(t) {
                t.createObjectStore(nG.store, {
                    keyPath: nG.keyPath
                }).createIndex(nG.documentTargetsIndex, nG.documentTargetsKeyPath, {
                    unique: !0
                });
                t.createObjectStore(nQ.store, {
                    keyPath: nQ.keyPath
                }).createIndex(nQ.queryTargetsIndexName, nQ.queryTargetsKeyPath, {
                    unique: !0
                }), t.createObjectStore(nj.store);
            }
            const sX = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
            class sZ {
                constructor(t, e, n, s, r, i, o, a, c, u){
                    if (((this.allowTabSynchronization = t), (this.persistenceKey = e), (this.clientId = n), (this.Oe = r), (this.window = i), (this.document = o), (this.Fe = c), (this.Me = u), (this.Le = null), (this.Be = !1), (this.isPrimary = !1), (this.networkEnabled = !0), (this.Ue = null), (this.inForeground = !1), (this.qe = null), (this.Ke = null), (this.je = Number.NEGATIVE_INFINITY), (this.Qe = (t)=>Promise.resolve()), !sZ.bt())) throw new S($.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
                    (this.referenceDelegate = new sK(this, s)), (this.We = e + "main"), (this.N = new sc(a)), (this.Ge = new n3(this.We, 11, new s1(this.N))), (this.ze = new sR(this.referenceDelegate, this.N)), (this.Ht = new sS()), (this.He = (function(t, e) {
                        return new sj(t, e);
                    })(this.N, this.Ht)), (this.Je = new sv()), this.window && this.window.localStorage ? (this.Ye = this.window.localStorage) : ((this.Ye = null), !1 === u && p("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
                }
                start() {
                    return this.Xe().then(()=>{
                        if (!this.isPrimary && !this.allowTabSynchronization) throw new S($.FAILED_PRECONDITION, sX);
                        return (this.Ze(), this.tn(), this.en(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (t)=>this.ze.getHighestSequenceNumber(t)));
                    }).then((t)=>{
                        this.Le = new L(t, this.Fe);
                    }).then(()=>{
                        this.Be = !0;
                    }).catch((t)=>(this.Ge && this.Ge.close(), Promise.reject(t)));
                }
                nn(t) {
                    return ((this.Qe = async (e)=>{
                        if (this.started) return t(e);
                    }), t(this.isPrimary));
                }
                setDatabaseDeletedListener(t) {
                    this.Ge.xt(async (e)=>{
                        null === e.newVersion && (await t());
                    });
                }
                setNetworkEnabled(t) {
                    this.networkEnabled !== t && ((this.networkEnabled = t), this.Oe.enqueueAndForget(async ()=>{
                        this.started && (await this.Xe());
                    }));
                }
                Xe() {
                    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (t)=>s3(t).put(new nW(this.clientId, Date.now(), this.networkEnabled, this.inForeground)).next(()=>{
                            if (this.isPrimary) return this.sn(t).next((t)=>{
                                t || ((this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)));
                            });
                        }).next(()=>this.rn(t)).next((e)=>this.isPrimary && !e ? this.on(t).next(()=>!1) : !!e && this.cn(t).next(()=>!0))).catch((t)=>{
                        if (n7(t)) return (g("IndexedDbPersistence", "Failed to extend owner lease: ", t), this.isPrimary);
                        if (!this.allowTabSynchronization) throw t;
                        return (g("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", t), !1);
                    }).then((t)=>{
                        this.isPrimary !== t && this.Oe.enqueueRetryable(()=>this.Qe(t)), (this.isPrimary = t);
                    });
                }
                sn(t) {
                    return sJ(t).get(nq.key).next((t)=>nZ.resolve(this.an(t)));
                }
                un(t) {
                    return s3(t).delete(this.clientId);
                }
                async hn() {
                    if (this.isPrimary && !this.ln(this.je, 18e5)) {
                        this.je = Date.now();
                        const t = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (t)=>{
                            const e = sr(t, nW.store);
                            return e.Lt().next((t)=>{
                                const n = this.fn(t, 18e5), s = t.filter((t)=>-1 === n.indexOf(t));
                                return nZ.forEach(s, (t)=>e.delete(t.clientId)).next(()=>s);
                            });
                        }).catch(()=>[]);
                        if (this.Ye) for (const e of t)this.Ye.removeItem(this.dn(e.clientId));
                    }
                }
                en() {
                    this.Ke = this.Oe.enqueueAfterDelay("client_metadata_refresh", 4e3, ()=>this.Xe().then(()=>this.hn()).then(()=>this.en()));
                }
                an(t) {
                    return !!t && t.ownerId === this.clientId;
                }
                rn(t) {
                    if (this.Me) return nZ.resolve(!0);
                    return sJ(t).get(nq.key).next((e)=>{
                        if (null !== e && this.ln(e.leaseTimestampMs, 5e3) && !this.wn(e.ownerId)) {
                            if (this.an(e) && this.networkEnabled) return !0;
                            if (!this.an(e)) {
                                if (!e.allowTabSynchronization) throw new S($.FAILED_PRECONDITION, sX);
                                return !1;
                            }
                        }
                        return (!(!this.networkEnabled || !this.inForeground) || s3(t).Lt().next((t)=>void 0 === this.fn(t, 5e3).find((t)=>{
                                if (this.clientId !== t.clientId) {
                                    const e = !this.networkEnabled && t.networkEnabled, n = !this.inForeground && t.inForeground, s = this.networkEnabled === t.networkEnabled;
                                    if (e || (n && s)) return !0;
                                }
                                return !1;
                            })));
                    }).next((t)=>(this.isPrimary !== t && g("IndexedDbPersistence", `Client ${t ? "is" : "is not"} eligible for a primary lease.`), t));
                }
                async shutdown() {
                    (this.Be = !1), this._n(), this.Ke && (this.Ke.cancel(), (this.Ke = null)), this.mn(), this.gn(), await this.Ge.runTransaction("shutdown", "readwrite", [
                        nq.store,
                        nW.store
                    ], (t)=>{
                        const e = new ss(t, L.T);
                        return this.on(e).next(()=>this.un(e));
                    }), this.Ge.close(), this.yn();
                }
                fn(t, e) {
                    return t.filter((t)=>this.ln(t.updateTimeMs, e) && !this.wn(t.clientId));
                }
                pn() {
                    return this.runTransaction("getActiveClients", "readonly", (t)=>s3(t).Lt().next((t)=>this.fn(t, 18e5).map((t)=>t.clientId)));
                }
                get started() {
                    return this.Be;
                }
                getMutationQueue(t) {
                    return sD.Yt(t, this.N, this.Ht, this.referenceDelegate);
                }
                getTargetCache() {
                    return this.ze;
                }
                getRemoteDocumentCache() {
                    return this.He;
                }
                getIndexManager() {
                    return this.Ht;
                }
                getBundleCache() {
                    return this.Je;
                }
                runTransaction(t, e, n) {
                    g("IndexedDbPersistence", "Starting transaction:", t);
                    const s = "readonly" === e ? "readonly" : "readwrite";
                    let r;
                    return this.Ge.runTransaction(t, s, n1, (s)=>((r = new ss(s, this.Le ? this.Le.next() : L.T)), "readwrite-primary" === e ? this.sn(r).next((t)=>!!t || this.rn(r)).next((e)=>{
                            if (!e) throw ((p(`Failed to obtain primary lease for action '${t}'.`), (this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)), new S($.FAILED_PRECONDITION, n2)));
                            return n(r);
                        }).next((t)=>this.cn(r).next(()=>t)) : this.Tn(r).next(()=>n(r)))).then((t)=>(r.raiseOnCommittedEvent(), t));
                }
                Tn(t) {
                    return sJ(t).get(nq.key).next((t)=>{
                        if (null !== t && this.ln(t.leaseTimestampMs, 5e3) && !this.wn(t.ownerId) && !this.an(t) && !(this.Me || (this.allowTabSynchronization && t.allowTabSynchronization))) throw new S($.FAILED_PRECONDITION, sX);
                    });
                }
                cn(t) {
                    const e = new nq(this.clientId, this.allowTabSynchronization, Date.now());
                    return sJ(t).put(nq.key, e);
                }
                static bt() {
                    return n3.bt();
                }
                on(t) {
                    const e = sJ(t);
                    return e.get(nq.key).next((t)=>this.an(t) ? (g("IndexedDbPersistence", "Releasing primary lease."), e.delete(nq.key)) : nZ.resolve());
                }
                ln(t, e) {
                    const n = Date.now();
                    return (!(t < n - e) && (!(t > n) || (p(`Detected an update time that is in the future: ${t} > ${n}`), !1)));
                }
                Ze() {
                    null !== this.document && "function" == typeof this.document.addEventListener && ((this.qe = ()=>{
                        this.Oe.enqueueAndForget(()=>((this.inForeground = "visible" === this.document.visibilityState), this.Xe()));
                    }), this.document.addEventListener("visibilitychange", this.qe), (this.inForeground = "visible" === this.document.visibilityState));
                }
                mn() {
                    this.qe && (this.document.removeEventListener("visibilitychange", this.qe), (this.qe = null));
                }
                tn() {
                    var t;
                    "function" == typeof (null === (t = this.window) || void 0 === t ? void 0 : t.addEventListener) && ((this.Ue = ()=>{
                        this._n(), isSafari() && navigator.appVersion.match("Version/14") && this.Oe.enterRestrictedMode(!0), this.Oe.enqueueAndForget(()=>this.shutdown());
                    }), this.window.addEventListener("pagehide", this.Ue));
                }
                gn() {
                    this.Ue && (this.window.removeEventListener("pagehide", this.Ue), (this.Ue = null));
                }
                wn(t) {
                    var e;
                    try {
                        const n = null !== (null === (e = this.Ye) || void 0 === e ? void 0 : e.getItem(this.dn(t)));
                        return (g("IndexedDbPersistence", `Client '${t}' ${n ? "is" : "is not"} zombied in LocalStorage`), n);
                    } catch (s) {
                        return (p("IndexedDbPersistence", "Failed to get zombied client id.", s), !1);
                    }
                }
                _n() {
                    if (this.Ye) try {
                        this.Ye.setItem(this.dn(this.clientId), String(Date.now()));
                    } catch (t) {
                        p("Failed to set zombie client id.", t);
                    }
                }
                yn() {
                    if (this.Ye) try {
                        this.Ye.removeItem(this.dn(this.clientId));
                    } catch (t) {}
                }
                dn(t) {
                    return `firestore_zombie_${this.persistenceKey}_${t}`;
                }
            }
            function sJ(t) {
                return sr(t, nq.store);
            }
            function s3(t) {
                return sr(t, nW.store);
            }
            function s4(t, e) {
                let n = t.projectId;
                return (t.isDefaultDatabase || (n += "." + t.database), "firestore/" + e + "/" + n + "/");
            }
            class s6 {
                constructor(t, e){
                    (this.progress = t), (this.En = e);
                }
            }
            class s7 {
                constructor(t, e, n){
                    (this.He = t), (this.In = e), (this.Ht = n);
                }
                An(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t, e).next((n)=>this.Rn(t, e, n));
                }
                Rn(t, e, n) {
                    return this.He.getEntry(t, e).next((t)=>{
                        for (const e of n)e.applyToLocalView(t);
                        return t;
                    });
                }
                bn(t, e) {
                    t.forEach((t, n)=>{
                        for (const s of e)s.applyToLocalView(n);
                    });
                }
                Pn(t, e) {
                    return this.He.getEntries(t, e).next((e)=>this.vn(t, e).next(()=>e));
                }
                vn(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t)=>this.bn(e, t));
                }
                getDocumentsMatchingQuery(t, e, n) {
                    return (function(t) {
                        return (to.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length);
                    })(e) ? this.Vn(t, e.path) : tY(e) ? this.Sn(t, e, n) : this.Dn(t, e, n);
                }
                Vn(t, e) {
                    return this.An(t, new to(e)).next((t)=>{
                        let e = eK();
                        return (t.isFoundDocument() && (e = e.insert(t.key, t)), e);
                    });
                }
                Sn(t, e, n) {
                    const s = e.collectionGroup;
                    let r = eK();
                    return this.Ht.getCollectionParents(t, s).next((i)=>nZ.forEach(i, (i)=>{
                            const o = (function(t, e) {
                                return new tz(e, null, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
                            })(e, i.child(s));
                            return this.Dn(t, o, n).next((t)=>{
                                t.forEach((t, e)=>{
                                    r = r.insert(t, e);
                                });
                            });
                        }).next(()=>r));
                }
                Dn(t, e, n) {
                    let s, r;
                    return this.He.getDocumentsMatchingQuery(t, e, n).next((n)=>((s = n), this.In.getAllMutationBatchesAffectingQuery(t, e))).next((e)=>((r = e), this.Cn(t, r, s).next((t)=>{
                            s = t;
                            for (const e of r)for (const n of e.mutations){
                                const i = n.key;
                                let o = s.get(i);
                                null == o && ((o = t$.newInvalidDocument(i)), (s = s.insert(i, o))), eT(n, o, e.localWriteTime), o.isFoundDocument() || (s = s.remove(i));
                            }
                        }))).next(()=>(s.forEach((t, n)=>{
                            t4(e, n) || (s = s.remove(t));
                        }), s));
                }
                Cn(t, e, n) {
                    let s = ej();
                    for (const r of e)for (const i of r.mutations)i instanceof eN && null === n.get(i.key) && (s = s.add(i.key));
                    let o = n;
                    return this.He.getEntries(t, s).next((t)=>(t.forEach((t, e)=>{
                            e.isFoundDocument() && (o = o.insert(t, e));
                        }), o));
                }
            }
            class s5 {
                constructor(t, e, n, s){
                    (this.targetId = t), (this.fromCache = e), (this.Nn = n), (this.xn = s);
                }
                static kn(t, e) {
                    let n = ej(), s = ej();
                    for (const r of e.docChanges)switch(r.type){
                        case 0:
                            n = n.add(r.doc.key);
                            break;
                        case 1:
                            s = s.add(r.doc.key);
                    }
                    return new s5(t, e.fromCache, n, s);
                }
            }
            class rt {
                $n(t) {
                    this.On = t;
                }
                getDocumentsMatchingQuery(t, e, n, s) {
                    return (function(t) {
                        return (0 === t.filters.length && null === t.limit && null == t.startAt && null == t.endAt && (0 === t.explicitOrderBy.length || (1 === t.explicitOrderBy.length && t.explicitOrderBy[0].field.isKeyField())));
                    })(e) || n.isEqual(O.min()) ? this.Fn(t, e) : this.On.Pn(t, s).next((r)=>{
                        const o = this.Mn(e, r);
                        return (tj(e) || tH(e)) && this.Ln(e.limitType, o, s, n) ? this.Fn(t, e) : (f() <= i["in"].DEBUG && g("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), t3(e)), this.On.getDocumentsMatchingQuery(t, e, n).next((t)=>(o.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)));
                    });
                }
                Mn(t, e) {
                    let n = new eO(t6(t));
                    return (e.forEach((e, s)=>{
                        t4(t, s) && (n = n.add(s));
                    }), n);
                }
                Ln(t, e, n, s) {
                    if (n.size !== e.size) return !0;
                    const r = "F" === t ? e.last() : e.first();
                    return (!!r && (r.hasPendingWrites || r.version.compareTo(s) > 0));
                }
                Fn(t, e) {
                    return (f() <= i["in"].DEBUG && g("QueryEngine", "Using full collection scan to execute query:", t3(e)), this.On.getDocumentsMatchingQuery(t, e, O.min()));
                }
            }
            class re {
                constructor(t, e, n, s){
                    (this.persistence = t), (this.Bn = e), (this.N = s), (this.Un = new eF(R)), (this.qn = new sQ((t)=>tN(t), tA)), (this.Kn = O.min()), (this.In = t.getMutationQueue(n)), (this.jn = t.getRemoteDocumentCache()), (this.ze = t.getTargetCache()), (this.Qn = new s7(this.jn, this.In, this.persistence.getIndexManager())), (this.Je = t.getBundleCache()), this.Bn.$n(this.Qn);
                }
                collectGarbage(t) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t.collect(e, this.Un));
                }
            }
            function rn(t, e, n, s) {
                return new re(t, e, n, s);
            }
            async function rs(t, e) {
                const n = E(t);
                let s = n.In, r = n.Qn;
                const i = await n.persistence.runTransaction("Handle user change", "readonly", (t)=>{
                    let i;
                    return n.In.getAllMutationBatches(t).next((o)=>((i = o), (s = n.persistence.getMutationQueue(e)), (r = new s7(n.jn, s, n.persistence.getIndexManager())), s.getAllMutationBatches(t))).next((e)=>{
                        const n = [], s = [];
                        let o = ej();
                        for (const a of i){
                            n.push(a.batchId);
                            for (const c of a.mutations)o = o.add(c.key);
                        }
                        for (const u of e){
                            s.push(u.batchId);
                            for (const h of u.mutations)o = o.add(h.key);
                        }
                        return r.Pn(t, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            }));
                    });
                });
                return (n.In = s), (n.Qn = r), n.Bn.$n(n.Qn), i;
            }
            function rr(t, e) {
                const n = E(t);
                return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (t)=>{
                    const s = e.batch.keys(), r = n.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    return (function(t, e, n, s) {
                        const r = n.batch, i = r.keys();
                        let o = nZ.resolve();
                        return (i.forEach((t)=>{
                            o = o.next(()=>s.getEntry(e, t)).next((e)=>{
                                const i = n.docVersions.get(t);
                                I(null !== i), e.version.compareTo(i) < 0 && (r.applyToRemoteDocument(e, n), e.isValidDocument() && s.addEntry(e, n.commitVersion));
                            });
                        }), o.next(()=>t.In.removeMutationBatch(e, r)));
                    })(n, t, e, r).next(()=>r.apply(t)).next(()=>n.In.performConsistencyCheck(t)).next(()=>n.Qn.Pn(t, s));
                });
            }
            function ri(t) {
                const e = E(t);
                return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t)=>e.ze.getLastRemoteSnapshotVersion(t));
            }
            function ro(t, e) {
                const n = E(t), s = e.snapshotVersion;
                let r = n.Un;
                return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t)=>{
                    const i = n.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    r = n.Un;
                    const o = [];
                    e.targetChanges.forEach((e, i)=>{
                        const a = r.get(i);
                        if (!a) return;
                        o.push(n.ze.removeMatchingKeys(t, e.removedDocuments, i).next(()=>n.ze.addMatchingKeys(t, e.addedDocuments, i)));
                        const c = e.resumeToken;
                        if (c.approximateByteSize() > 0) {
                            const u = a.withResumeToken(c, s).withSequenceNumber(t.currentSequenceNumber);
                            (r = r.insert(i, u)), (function(t, e, n) {
                                if ((I(e.resumeToken.approximateByteSize() > 0), 0 === t.resumeToken.approximateByteSize())) return !0;
                                if (e.snapshotVersion.toMicroseconds() - t.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                                return (n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0);
                            })(a, u, e) && o.push(n.ze.updateTargetData(t, u));
                        }
                    });
                    let a = eB();
                    if ((e.documentUpdates.forEach((s, r)=>{
                        e.resolvedLimboDocuments.has(s) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t, s));
                    }), o.push(ra(t, i, e.documentUpdates, s, void 0).next((t)=>{
                        a = t;
                    })), !s.isEqual(O.min()))) {
                        const c = n.ze.getLastRemoteSnapshotVersion(t).next((e)=>n.ze.setTargetsMetadata(t, t.currentSequenceNumber, s));
                        o.push(c);
                    }
                    return nZ.waitFor(o).next(()=>i.apply(t)).next(()=>n.Qn.vn(t, a)).next(()=>a);
                }).then((t)=>((n.Un = r), t));
            }
            function ra(t, e, n, s, r) {
                let i = ej();
                return (n.forEach((t)=>(i = i.add(t))), e.getEntries(t, i).next((t)=>{
                    let i = eB();
                    return (n.forEach((n, o)=>{
                        const a = t.get(n), c = (null == r ? void 0 : r.get(n)) || s;
                        o.isNoDocument() && o.version.isEqual(O.min()) ? (e.removeEntry(n, c), (i = i.insert(n, o))) : !a.isValidDocument() || o.version.compareTo(a.version) > 0 || (0 === o.version.compareTo(a.version) && a.hasPendingWrites) ? (e.addEntry(o, c), (i = i.insert(n, o))) : g("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", a.version, " Watch version:", o.version);
                    }), i);
                }));
            }
            function rc(t, e) {
                const n = E(t);
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (t)=>(void 0 === e && (e = -1), n.In.getNextMutationBatchAfterBatchId(t, e)));
            }
            function ru(t, e) {
                const n = E(t);
                return n.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                    let s;
                    return n.ze.getTargetData(t, e).next((r)=>r ? ((s = r), nZ.resolve(s)) : n.ze.allocateTargetId(t).next((r)=>((s = new sa(e, r, 0, t.currentSequenceNumber)), n.ze.addTargetData(t, s).next(()=>s))));
                }).then((t)=>{
                    const s = n.Un.get(t.targetId);
                    return ((null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && ((n.Un = n.Un.insert(t.targetId, t)), n.qn.set(e, t.targetId)), t);
                });
            }
            async function rh(t, e, n) {
                const s = E(t), r = s.Un.get(e), i = n ? "readwrite" : "readwrite-primary";
                try {
                    n || (await s.persistence.runTransaction("Release target", i, (t)=>s.persistence.referenceDelegate.removeTarget(t, r)));
                } catch (o) {
                    if (!n7(o)) throw o;
                    g("LocalStore", `Failed to update sequence numbers for target ${e}: ${o}`);
                }
                (s.Un = s.Un.remove(e)), s.qn.delete(r.target);
            }
            function rl(t, e, n) {
                const s = E(t);
                let r = O.min(), i = ej();
                return s.persistence.runTransaction("Execute query", "readonly", (t)=>(function(t, e, n) {
                        const s = E(t), r = s.qn.get(n);
                        return void 0 !== r ? nZ.resolve(s.Un.get(r)) : s.ze.getTargetData(e, n);
                    })(s, t, t2(e)).next((e)=>{
                        if (e) return ((r = e.lastLimboFreeSnapshotVersion), s.ze.getMatchingKeysForTargetId(t, e.targetId).next((t)=>{
                            i = t;
                        }));
                    }).next(()=>s.Bn.getDocumentsMatchingQuery(t, e, n ? r : O.min(), n ? i : ej())).next((t)=>({
                            documents: t,
                            Gn: i
                        })));
            }
            function rd(t, e) {
                const n = E(t), s = E(n.ze), r = n.Un.get(e);
                return r ? Promise.resolve(r.target) : n.persistence.runTransaction("Get target data", "readonly", (t)=>s.Tt(t, e).next((t)=>(t ? t.target : null)));
            }
            function rf(t) {
                const e = E(t);
                return e.persistence.runTransaction("Get new document changes", "readonly", (t)=>(function(t, e, n) {
                        const s = E(t);
                        let r = eB(), i = sl(n);
                        const o = s0(e), a = IDBKeyRange.lowerBound(i, !0);
                        return o.Kt({
                            index: nK.readTimeIndex,
                            range: a
                        }, (t, e)=>{
                            const n = su(s.N, e);
                            (r = r.insert(n.key, n)), (i = e.readTime);
                        }).next(()=>({
                                En: r,
                                readTime: sd(i)
                            }));
                    })(e.jn, t, e.Kn)).then(({ En: t , readTime: n  })=>((e.Kn = n), t));
            }
            async function rm(t) {
                const e = E(t);
                return e.persistence.runTransaction("Synchronize last document change read time", "readonly", (t)=>(function(t) {
                        const e = s0(t);
                        let n = O.min();
                        return e.Kt({
                            index: nK.readTimeIndex,
                            reverse: !0
                        }, (t, e, s)=>{
                            e.readTime && (n = sd(e.readTime)), s.done();
                        }).next(()=>n);
                    })(t)).then((t)=>{
                    e.Kn = t;
                });
            }
            async function rg(t, e, n, s) {
                const r = E(t);
                let i = ej(), o = eB(), a = eQ();
                for (const c of n){
                    const u = e.zn(c.metadata.name);
                    c.document && (i = i.add(u)), (o = o.insert(u, e.Hn(c))), (a = a.insert(u, e.Jn(c.metadata.readTime)));
                }
                const h = r.jn.newChangeBuffer({
                    trackRemovals: !0
                }), l = await ru(r, (function(t) {
                    return t2(tG(z.fromString(`__bundle__/docs/${t}`)));
                })(s));
                return r.persistence.runTransaction("Apply bundle documents", "readwrite", (t)=>ra(t, h, o, O.min(), a).next((e)=>(h.apply(t), e)).next((e)=>r.ze.removeMatchingKeysForTargetId(t, l.targetId).next(()=>r.ze.addMatchingKeys(t, i, l.targetId)).next(()=>r.Qn.vn(t, e)).next(()=>e)));
            }
            async function rp(t, e, n = ej()) {
                const s = await ru(t, t2(sw(e.bundledQuery))), r = E(t);
                return r.persistence.runTransaction("Save named query", "readwrite", (t)=>{
                    const i = ns(e.readTime);
                    if (s.snapshotVersion.compareTo(i) >= 0) return r.Je.saveNamedQuery(t, e);
                    const o = s.withResumeToken(W.EMPTY_BYTE_STRING, i);
                    return ((r.Un = r.Un.insert(o.targetId, o)), r.ze.updateTargetData(t, o).next(()=>r.ze.removeMatchingKeysForTargetId(t, s.targetId)).next(()=>r.ze.addMatchingKeys(t, n, s.targetId)).next(()=>r.Je.saveNamedQuery(t, e)));
                });
            }
            class ry {
                constructor(t){
                    (this.N = t), (this.Yn = new Map()), (this.Xn = new Map());
                }
                getBundleMetadata(t, e) {
                    return nZ.resolve(this.Yn.get(e));
                }
                saveBundleMetadata(t, e) {
                    var n;
                    return (this.Yn.set(e.id, {
                        id: (n = e).id,
                        version: n.version,
                        createTime: ns(n.createTime)
                    }), nZ.resolve());
                }
                getNamedQuery(t, e) {
                    return nZ.resolve(this.Xn.get(e));
                }
                saveNamedQuery(t, e) {
                    return (this.Xn.set(e.name, (function(t) {
                        return {
                            name: t.name,
                            query: sw(t.bundledQuery),
                            readTime: ns(t.readTime)
                        };
                    })(e)), nZ.resolve());
                }
            }
            class rw {
                constructor(){
                    (this.Zn = new eO(rv.ts)), (this.es = new eO(rv.ns));
                }
                isEmpty() {
                    return this.Zn.isEmpty();
                }
                addReference(t, e) {
                    const n = new rv(t, e);
                    (this.Zn = this.Zn.add(n)), (this.es = this.es.add(n));
                }
                ss(t, e) {
                    t.forEach((t)=>this.addReference(t, e));
                }
                removeReference(t, e) {
                    this.rs(new rv(t, e));
                }
                os(t, e) {
                    t.forEach((t)=>this.removeReference(t, e));
                }
                cs(t) {
                    const e = new to(new z([])), n = new rv(e, t), s = new rv(e, t + 1), r = [];
                    return (this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        this.rs(t), r.push(t.key);
                    }), r);
                }
                us() {
                    this.Zn.forEach((t)=>this.rs(t));
                }
                rs(t) {
                    (this.Zn = this.Zn.delete(t)), (this.es = this.es.delete(t));
                }
                hs(t) {
                    const e = new to(new z([])), n = new rv(e, t), s = new rv(e, t + 1);
                    let r = ej();
                    return (this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        r = r.add(t.key);
                    }), r);
                }
                containsKey(t) {
                    const e = new rv(t, 0), n = this.Zn.firstAfterOrEqual(e);
                    return null !== n && t.isEqual(n.key);
                }
            }
            class rv {
                constructor(t, e){
                    (this.key = t), (this.ls = e);
                }
                static ts(t, e) {
                    return to.comparator(t.key, e.key) || R(t.ls, e.ls);
                }
                static ns(t, e) {
                    return R(t.ls, e.ls) || to.comparator(t.key, e.key);
                }
            }
            class rI {
                constructor(t, e){
                    (this.Ht = t), (this.referenceDelegate = e), (this.In = []), (this.fs = 1), (this.ds = new eO(rv.ts));
                }
                checkEmpty(t) {
                    return nZ.resolve(0 === this.In.length);
                }
                addMutationBatch(t, e, n, s) {
                    const r = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const i = new si(r, e, n, s);
                    this.In.push(i);
                    for (const o of s)(this.ds = this.ds.add(new rv(o.key, r))), this.Ht.addToCollectionParentIndex(t, o.key.path.popLast());
                    return nZ.resolve(i);
                }
                lookupMutationBatch(t, e) {
                    return nZ.resolve(this.ws(e));
                }
                getNextMutationBatchAfterBatchId(t, e) {
                    const n = e + 1, s = this._s(n), r = s < 0 ? 0 : s;
                    return nZ.resolve(this.In.length > r ? this.In[r] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return nZ.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t) {
                    return nZ.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t, e) {
                    const n = new rv(e, 0), s = new rv(e, Number.POSITIVE_INFINITY), r = [];
                    return (this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        r.push(e);
                    }), nZ.resolve(r));
                }
                getAllMutationBatchesAffectingDocumentKeys(t, e) {
                    let n = new eO(R);
                    return (e.forEach((t)=>{
                        const e = new rv(t, 0), s = new rv(t, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), nZ.resolve(this.gs(n)));
                }
                getAllMutationBatchesAffectingQuery(t, e) {
                    const n = e.path, s = n.length + 1;
                    let r = n;
                    to.isDocumentKey(r) || (r = r.child(""));
                    const i = new rv(new to(r), 0);
                    let o = new eO(R);
                    return (this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return (!!n.isPrefixOf(e) && (e.length === s && (o = o.add(t.ls)), !0));
                    }, i), nZ.resolve(this.gs(o)));
                }
                gs(t) {
                    const e = [];
                    return (t.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e);
                }
                removeMutationBatch(t, e) {
                    I(0 === this.ys(e.batchId, "removed")), this.In.shift();
                    let n = this.ds;
                    return nZ.forEach(e.mutations, (s)=>{
                        const r = new rv(s.key, e.batchId);
                        return ((n = n.delete(r)), this.referenceDelegate.markPotentiallyOrphaned(t, s.key));
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(t) {}
                containsKey(t, e) {
                    const n = new rv(e, 0), s = this.ds.firstAfterOrEqual(n);
                    return nZ.resolve(e.isEqual(s && s.key));
                }
                performConsistencyCheck(t) {
                    return this.In.length, nZ.resolve();
                }
                ys(t, e) {
                    return this._s(t);
                }
                _s(t) {
                    if (0 === this.In.length) return 0;
                    return t - this.In[0].batchId;
                }
                ws(t) {
                    const e = this._s(t);
                    if (e < 0 || e >= this.In.length) return null;
                    return this.In[e];
                }
            }
            class rT {
                constructor(t, e){
                    (this.Ht = t), (this.ps = e), (this.docs = new eF(to.comparator)), (this.size = 0);
                }
                addEntry(t, e, n) {
                    const s = e.key, r = this.docs.get(s), i = r ? r.size : 0, o = this.ps(e);
                    return ((this.docs = this.docs.insert(s, {
                        document: e.clone(),
                        size: o,
                        readTime: n
                    })), (this.size += o - i), this.Ht.addToCollectionParentIndex(t, s.path.popLast()));
                }
                removeEntry(t) {
                    const e = this.docs.get(t);
                    e && ((this.docs = this.docs.remove(t)), (this.size -= e.size));
                }
                getEntry(t, e) {
                    const n = this.docs.get(e);
                    return nZ.resolve(n ? n.document.clone() : t$.newInvalidDocument(e));
                }
                getEntries(t, e) {
                    let n = eB();
                    return (e.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : t$.newInvalidDocument(t));
                    }), nZ.resolve(n));
                }
                getDocumentsMatchingQuery(t, e, n) {
                    let s = eB();
                    const r = new to(e.path.child("")), i = this.docs.getIteratorFrom(r);
                    for(; i.hasNext();){
                        const { key: o , value: { document: a , readTime: c  } ,  } = i.getNext();
                        if (!e.path.isPrefixOf(o.path)) break;
                        c.compareTo(n) <= 0 || (t4(e, a) && (s = s.insert(a.key, a.clone())));
                    }
                    return nZ.resolve(s);
                }
                Ts(t, e) {
                    return nZ.forEach(this.docs, (t)=>e(t));
                }
                newChangeBuffer(t) {
                    return new rE(this);
                }
                getSize(t) {
                    return nZ.resolve(this.size);
                }
            }
            class rE extends sG {
                constructor(t){
                    super(), (this.Se = t);
                }
                applyChanges(t) {
                    const e = [];
                    return (this.changes.forEach((n, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t, s.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), nZ.waitFor(e));
                }
                getFromCache(t, e) {
                    return this.Se.getEntry(t, e);
                }
                getAllFromCache(t, e) {
                    return this.Se.getEntries(t, e);
                }
            }
            class r$ {
                constructor(t){
                    (this.persistence = t), (this.Es = new sQ((t)=>tN(t), tA)), (this.lastRemoteSnapshotVersion = O.min()), (this.highestTargetId = 0), (this.Is = 0), (this.As = new rw()), (this.targetCount = 0), (this.Rs = sM.se());
                }
                forEachTarget(t, e) {
                    return this.Es.forEach((t, n)=>e(n)), nZ.resolve();
                }
                getLastRemoteSnapshotVersion(t) {
                    return nZ.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(t) {
                    return nZ.resolve(this.Is);
                }
                allocateTargetId(t) {
                    return ((this.highestTargetId = this.Rs.next()), nZ.resolve(this.highestTargetId));
                }
                setTargetsMetadata(t, e, n) {
                    return (n && (this.lastRemoteSnapshotVersion = n), e > this.Is && (this.Is = e), nZ.resolve());
                }
                ce(t) {
                    this.Es.set(t.target, t);
                    const e = t.targetId;
                    e > this.highestTargetId && ((this.Rs = new sM(e)), (this.highestTargetId = e)), t.sequenceNumber > this.Is && (this.Is = t.sequenceNumber);
                }
                addTargetData(t, e) {
                    return (this.ce(e), (this.targetCount += 1), nZ.resolve());
                }
                updateTargetData(t, e) {
                    return this.ce(e), nZ.resolve();
                }
                removeTargetData(t, e) {
                    return (this.Es.delete(e.target), this.As.cs(e.targetId), (this.targetCount -= 1), nZ.resolve());
                }
                removeTargets(t, e, n) {
                    let s = 0;
                    const r = [];
                    return (this.Es.forEach((i, o)=>{
                        o.sequenceNumber <= e && null === n.get(o.targetId) && (this.Es.delete(i), r.push(this.removeMatchingKeysForTargetId(t, o.targetId)), s++);
                    }), nZ.waitFor(r).next(()=>s));
                }
                getTargetCount(t) {
                    return nZ.resolve(this.targetCount);
                }
                getTargetData(t, e) {
                    const n = this.Es.get(e) || null;
                    return nZ.resolve(n);
                }
                addMatchingKeys(t, e, n) {
                    return this.As.ss(e, n), nZ.resolve();
                }
                removeMatchingKeys(t, e, n) {
                    this.As.os(e, n);
                    const s = this.persistence.referenceDelegate, r = [];
                    return (s && e.forEach((e)=>{
                        r.push(s.markPotentiallyOrphaned(t, e));
                    }), nZ.waitFor(r));
                }
                removeMatchingKeysForTargetId(t, e) {
                    return this.As.cs(e), nZ.resolve();
                }
                getMatchingKeysForTargetId(t, e) {
                    const n = this.As.hs(e);
                    return nZ.resolve(n);
                }
                containsKey(t, e) {
                    return nZ.resolve(this.As.containsKey(e));
                }
            }
            class rS {
                constructor(t, e){
                    (this.bs = {}), (this.Le = new L(0)), (this.Be = !1), (this.Be = !0), (this.referenceDelegate = t(this)), (this.ze = new r$(this));
                    (this.Ht = new sE()), (this.He = (function(t, e) {
                        return new rT(t, e);
                    })(this.Ht, (t)=>this.referenceDelegate.Ps(t))), (this.N = new sc(e)), (this.Je = new ry(this.N));
                }
                start() {
                    return Promise.resolve();
                }
                shutdown() {
                    return (this.Be = !1), Promise.resolve();
                }
                get started() {
                    return this.Be;
                }
                setDatabaseDeletedListener() {}
                setNetworkEnabled() {}
                getIndexManager() {
                    return this.Ht;
                }
                getMutationQueue(t) {
                    let e = this.bs[t.toKey()];
                    return (e || ((e = new rI(this.Ht, this.referenceDelegate)), (this.bs[t.toKey()] = e)), e);
                }
                getTargetCache() {
                    return this.ze;
                }
                getRemoteDocumentCache() {
                    return this.He;
                }
                getBundleCache() {
                    return this.Je;
                }
                runTransaction(t, e, n) {
                    g("MemoryPersistence", "Starting transaction:", t);
                    const s = new r8(this.Le.next());
                    return (this.referenceDelegate.vs(), n(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t)).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t)));
                }
                Ss(t, e) {
                    return nZ.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t, e)));
                }
            }
            class r8 extends nX {
                constructor(t){
                    super(), (this.currentSequenceNumber = t);
                }
            }
            class rN {
                constructor(t){
                    (this.persistence = t), (this.Ds = new rw()), (this.Cs = null);
                }
                static Ns(t) {
                    return new rN(t);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw v();
                }
                addReference(t, e, n) {
                    return (this.Ds.addReference(n, e), this.xs.delete(n.toString()), nZ.resolve());
                }
                removeReference(t, e, n) {
                    return (this.Ds.removeReference(n, e), this.xs.add(n.toString()), nZ.resolve());
                }
                markPotentiallyOrphaned(t, e) {
                    return this.xs.add(e.toString()), nZ.resolve();
                }
                removeTarget(t, e) {
                    this.Ds.cs(e.targetId).forEach((t)=>this.xs.add(t.toString()));
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(t, e.targetId).next((t)=>{
                        t.forEach((t)=>this.xs.add(t.toString()));
                    }).next(()=>n.removeTargetData(t, e));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(t) {
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return nZ.forEach(this.xs, (n)=>{
                        const s = to.fromPath(n);
                        return this.ks(t, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>((this.Cs = null), e.apply(t)));
                }
                updateLimboDocument(t, e) {
                    return this.ks(t, e).next((t)=>{
                        t ? this.xs.delete(e.toString()) : this.xs.add(e.toString());
                    });
                }
                Ps(t) {
                    return 0;
                }
                ks(t, e) {
                    return nZ.or([
                        ()=>nZ.resolve(this.Ds.containsKey(e)),
                        ()=>this.persistence.getTargetCache().containsKey(t, e),
                        ()=>this.persistence.Ss(t, e), 
                    ]);
                }
            }
            function rb(t, e) {
                return `firestore_clients_${t}_${e}`;
            }
            function rA(t, e, n) {
                let s = `firestore_mutations_${t}_${n}`;
                return e.isAuthenticated() && (s += `_${e.uid}`), s;
            }
            function rk(t, e) {
                return `firestore_targets_${t}_${e}`;
            }
            class rD {
                constructor(t, e, n, s){
                    (this.user = t), (this.batchId = e), (this.state = n), (this.error = s);
                }
                static $s(t, e, n) {
                    const s = JSON.parse(n);
                    let r, i = "object" == typeof s && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected", 
                    ].indexOf(s.state) && (void 0 === s.error || "object" == typeof s.error);
                    return (i && s.error && ((i = "string" == typeof s.error.message && "string" == typeof s.error.code), i && (r = new S(s.error.code, s.error.message))), i ? new rD(t, e, s.state, r) : (p("SharedClientState", `Failed to parse mutation state for ID '${e}': ${n}`), null));
                }
                Os() {
                    const t = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (t.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(t));
                }
            }
            class rx {
                constructor(t, e, n){
                    (this.targetId = t), (this.state = e), (this.error = n);
                }
                static $s(t, e) {
                    const n = JSON.parse(e);
                    let s, r = "object" == typeof n && -1 !== [
                        "not-current",
                        "current",
                        "rejected", 
                    ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
                    return (r && n.error && ((r = "string" == typeof n.error.message && "string" == typeof n.error.code), r && (s = new S(n.error.code, n.error.message))), r ? new rx(t, n.state, s) : (p("SharedClientState", `Failed to parse target state for ID '${t}': ${e}`), null));
                }
                Os() {
                    const t = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (t.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(t));
                }
            }
            class rC {
                constructor(t, e){
                    (this.clientId = t), (this.activeTargetIds = e);
                }
                static $s(t, e) {
                    const n = JSON.parse(e);
                    let s = "object" == typeof n && n.activeTargetIds instanceof Array, r = eW();
                    for(let i = 0; s && i < n.activeTargetIds.length; ++i)(s = ti(n.activeTargetIds[i])), (r = r.add(n.activeTargetIds[i]));
                    return s ? new rC(t, r) : (p("SharedClientState", `Failed to parse client data for instance '${t}': ${e}`), null);
                }
            }
            class rL {
                constructor(t, e){
                    (this.clientId = t), (this.onlineState = e);
                }
                static $s(t) {
                    const e = JSON.parse(t);
                    return "object" == typeof e && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(e.onlineState) && "string" == typeof e.clientId ? new rL(e.clientId, e.onlineState) : (p("SharedClientState", `Failed to parse online state: ${t}`), null);
                }
            }
            class r_ {
                constructor(){
                    this.activeTargetIds = eW();
                }
                Fs(t) {
                    this.activeTargetIds = this.activeTargetIds.add(t);
                }
                Ms(t) {
                    this.activeTargetIds = this.activeTargetIds.delete(t);
                }
                Os() {
                    const t = {
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    };
                    return JSON.stringify(t);
                }
            }
            class rM {
                constructor(t, e, n, s, r){
                    (this.window = t), (this.Oe = e), (this.persistenceKey = n), (this.Ls = s), (this.syncEngine = null), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null), (this.Bs = this.Us.bind(this)), (this.qs = new eF(R)), (this.started = !1), (this.Ks = []);
                    const i = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    (this.storage = this.window.localStorage), (this.currentUser = r), (this.js = rb(this.persistenceKey, this.Ls)), (this.Qs = (function(t) {
                        return `firestore_sequence_number_${t}`;
                    })(this.persistenceKey)), (this.qs = this.qs.insert(this.Ls, new r_())), (this.Ws = new RegExp(`^firestore_clients_${i}_([^_]*)$`)), (this.Gs = new RegExp(`^firestore_mutations_${i}_(\\d+)(?:_(.*))?$`)), (this.zs = new RegExp(`^firestore_targets_${i}_(\\d+)$`)), (this.Hs = (function(t) {
                        return `firestore_online_state_${t}`;
                    })(this.persistenceKey)), (this.Js = (function(t) {
                        return `firestore_bundle_loaded_${t}`;
                    })(this.persistenceKey)), this.window.addEventListener("storage", this.Bs);
                }
                static bt(t) {
                    return !(!t || !t.localStorage);
                }
                async start() {
                    const t = await this.syncEngine.pn();
                    for (const e of t){
                        if (e === this.Ls) continue;
                        const n = this.getItem(rb(this.persistenceKey, e));
                        if (n) {
                            const s = rC.$s(e, n);
                            s && (this.qs = this.qs.insert(s.clientId, s));
                        }
                    }
                    this.Ys();
                    const r = this.storage.getItem(this.Hs);
                    if (r) {
                        const i = this.Xs(r);
                        i && this.Zs(i);
                    }
                    for (const o of this.Ks)this.Us(o);
                    (this.Ks = []), this.window.addEventListener("pagehide", ()=>this.shutdown()), (this.started = !0);
                }
                writeSequenceNumber(t) {
                    this.setItem(this.Qs, JSON.stringify(t));
                }
                getAllActiveQueryTargets() {
                    return this.ti(this.qs);
                }
                isActiveQueryTarget(t) {
                    let e = !1;
                    return (this.qs.forEach((n, s)=>{
                        s.activeTargetIds.has(t) && (e = !0);
                    }), e);
                }
                addPendingMutation(t) {
                    this.ei(t, "pending");
                }
                updateMutationState(t, e, n) {
                    this.ei(t, e, n), this.ni(t);
                }
                addLocalQueryTarget(t) {
                    let e = "not-current";
                    if (this.isActiveQueryTarget(t)) {
                        const n = this.storage.getItem(rk(this.persistenceKey, t));
                        if (n) {
                            const s = rx.$s(t, n);
                            s && (e = s.state);
                        }
                    }
                    return this.si.Fs(t), this.Ys(), e;
                }
                removeLocalQueryTarget(t) {
                    this.si.Ms(t), this.Ys();
                }
                isLocalQueryTarget(t) {
                    return this.si.activeTargetIds.has(t);
                }
                clearQueryState(t) {
                    this.removeItem(rk(this.persistenceKey, t));
                }
                updateQueryState(t, e, n) {
                    this.ii(t, e, n);
                }
                handleUserChange(t, e, n) {
                    e.forEach((t)=>{
                        this.ni(t);
                    }), (this.currentUser = t), n.forEach((t)=>{
                        this.addPendingMutation(t);
                    });
                }
                setOnlineState(t) {
                    this.ri(t);
                }
                notifyBundleLoaded() {
                    this.oi();
                }
                shutdown() {
                    this.started && (this.window.removeEventListener("storage", this.Bs), this.removeItem(this.js), (this.started = !1));
                }
                getItem(t) {
                    const e = this.storage.getItem(t);
                    return g("SharedClientState", "READ", t, e), e;
                }
                setItem(t, e) {
                    g("SharedClientState", "SET", t, e), this.storage.setItem(t, e);
                }
                removeItem(t) {
                    g("SharedClientState", "REMOVE", t), this.storage.removeItem(t);
                }
                Us(t) {
                    const e = t;
                    if (e.storageArea === this.storage) {
                        if ((g("SharedClientState", "EVENT", e.key, e.newValue), e.key === this.js)) return void p("Received WebStorage notification for local change. Another client might have garbage-collected our state");
                        this.Oe.enqueueRetryable(async ()=>{
                            if (this.started) {
                                if (null !== e.key) if (this.Ws.test(e.key)) {
                                    if (null == e.newValue) {
                                        const t = this.ci(e.key);
                                        return this.ai(t, null);
                                    }
                                    {
                                        const n = this.ui(e.key, e.newValue);
                                        if (n) return this.ai(n.clientId, n);
                                    }
                                } else if (this.Gs.test(e.key)) {
                                    if (null !== e.newValue) {
                                        const s = this.hi(e.key, e.newValue);
                                        if (s) return this.li(s);
                                    }
                                } else if (this.zs.test(e.key)) {
                                    if (null !== e.newValue) {
                                        const r = this.fi(e.key, e.newValue);
                                        if (r) return this.di(r);
                                    }
                                } else if (e.key === this.Hs) {
                                    if (null !== e.newValue) {
                                        const i = this.Xs(e.newValue);
                                        if (i) return this.Zs(i);
                                    }
                                } else if (e.key === this.Qs) {
                                    const o = (function(t) {
                                        let e = L.T;
                                        if (null != t) try {
                                            const n = JSON.parse(t);
                                            I("number" == typeof n), (e = n);
                                        } catch (s) {
                                            p("SharedClientState", "Failed to read sequence number from WebStorage", s);
                                        }
                                        return e;
                                    })(e.newValue);
                                    o !== L.T && this.sequenceNumberHandler(o);
                                } else if (e.key === this.Js) return this.syncEngine.wi();
                            } else this.Ks.push(e);
                        });
                    }
                }
                get si() {
                    return this.qs.get(this.Ls);
                }
                Ys() {
                    this.setItem(this.js, this.si.Os());
                }
                ei(t, e, n) {
                    const s = new rD(this.currentUser, t, e, n), r = rA(this.persistenceKey, this.currentUser, t);
                    this.setItem(r, s.Os());
                }
                ni(t) {
                    const e = rA(this.persistenceKey, this.currentUser, t);
                    this.removeItem(e);
                }
                ri(t) {
                    const e = {
                        clientId: this.Ls,
                        onlineState: t
                    };
                    this.storage.setItem(this.Hs, JSON.stringify(e));
                }
                ii(t, e, n) {
                    const s = rk(this.persistenceKey, t), r = new rx(t, e, n);
                    this.setItem(s, r.Os());
                }
                oi() {
                    this.setItem(this.Js, "value-not-used");
                }
                ci(t) {
                    const e = this.Ws.exec(t);
                    return e ? e[1] : null;
                }
                ui(t, e) {
                    const n = this.ci(t);
                    return rC.$s(n, e);
                }
                hi(t, e) {
                    const n = this.Gs.exec(t), s = Number(n[1]), r = void 0 !== n[2] ? n[2] : null;
                    return rD.$s(new h(r), s, e);
                }
                fi(t, e) {
                    const n = this.zs.exec(t), s = Number(n[1]);
                    return rx.$s(s, e);
                }
                Xs(t) {
                    return rL.$s(t);
                }
                async li(t) {
                    if (t.user.uid === this.currentUser.uid) return this.syncEngine._i(t.batchId, t.state, t.error);
                    g("SharedClientState", `Ignoring mutation for non-active user ${t.user.uid}`);
                }
                di(t) {
                    return this.syncEngine.mi(t.targetId, t.state, t.error);
                }
                ai(t, e) {
                    const n = e ? this.qs.insert(t, e) : this.qs.remove(t), s = this.ti(this.qs), r = this.ti(n), i = [], o = [];
                    return (r.forEach((t)=>{
                        s.has(t) || i.push(t);
                    }), s.forEach((t)=>{
                        r.has(t) || o.push(t);
                    }), this.syncEngine.gi(i, o).then(()=>{
                        this.qs = n;
                    }));
                }
                Zs(t) {
                    this.qs.get(t.clientId) && this.onlineStateHandler(t.onlineState);
                }
                ti(t) {
                    let e = eW();
                    return (t.forEach((t, n)=>{
                        e = e.unionWith(n.activeTargetIds);
                    }), e);
                }
            }
            class rR {
                constructor(){
                    (this.yi = new r_()), (this.pi = {}), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null);
                }
                addPendingMutation(t) {}
                updateMutationState(t, e, n) {}
                addLocalQueryTarget(t) {
                    return this.yi.Fs(t), this.pi[t] || "not-current";
                }
                updateQueryState(t, e, n) {
                    this.pi[t] = e;
                }
                removeLocalQueryTarget(t) {
                    this.yi.Ms(t);
                }
                isLocalQueryTarget(t) {
                    return this.yi.activeTargetIds.has(t);
                }
                clearQueryState(t) {
                    delete this.pi[t];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(t) {
                    return this.yi.activeTargetIds.has(t);
                }
                start() {
                    return (this.yi = new r_()), Promise.resolve();
                }
                handleUserChange(t, e, n) {}
                setOnlineState(t) {}
                shutdown() {}
                writeSequenceNumber(t) {}
                notifyBundleLoaded() {}
            }
            class rF {
                Ti(t) {}
                shutdown() {}
            }
            class rV {
                constructor(){
                    (this.Ei = ()=>this.Ii()), (this.Ai = ()=>this.Ri()), (this.bi = []), this.Pi();
                }
                Ti(t) {
                    this.bi.push(t);
                }
                shutdown() {
                    window.removeEventListener("online", this.Ei), window.removeEventListener("offline", this.Ai);
                }
                Pi() {
                    window.addEventListener("online", this.Ei), window.addEventListener("offline", this.Ai);
                }
                Ii() {
                    g("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
                    for (const t of this.bi)t(0);
                }
                Ri() {
                    g("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
                    for (const t of this.bi)t(1);
                }
                static bt() {
                    return ("undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener);
                }
            }
            const rq = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            class rO {
                constructor(t){
                    (this.vi = t.vi), (this.Vi = t.Vi);
                }
                Si(t) {
                    this.Di = t;
                }
                Ci(t) {
                    this.Ni = t;
                }
                onMessage(t) {
                    this.xi = t;
                }
                close() {
                    this.Vi();
                }
                send(t) {
                    this.vi(t);
                }
                ki() {
                    this.Di();
                }
                $i(t) {
                    this.Ni(t);
                }
                Oi(t) {
                    this.xi(t);
                }
            }
            class rP extends class {
                constructor(t){
                    (this.databaseInfo = t), (this.databaseId = t.databaseId);
                    const e = t.ssl ? "https" : "http";
                    (this.Fi = e + "://" + t.host), (this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents");
                }
                Li(t, e, n, s) {
                    const r = this.Bi(t, e);
                    g("RestConnection", "Sending: ", r, n);
                    const i = {};
                    return (this.Ui(i, s), this.qi(t, r, i, n).then((t)=>(g("RestConnection", "Received: ", t), t), (e)=>{
                        throw ((y("RestConnection", `${t} failed with error: `, e, "url: ", r, "request:", n), e));
                    }));
                }
                Ki(t, e, n, s) {
                    return this.Li(t, e, n, s);
                }
                Ui(t, e) {
                    if (((t["X-Goog-Api-Client"] = "gl-js/ fire/" + l), (t["Content-Type"] = "text/plain"), this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), e)) for(const n in e.authHeaders)e.authHeaders.hasOwnProperty(n) && (t[n] = e.authHeaders[n]);
                }
                Bi(t, e) {
                    const n = rq[t];
                    return `${this.Fi}/v1/${e}:${n}`;
                }
            } {
                constructor(t){
                    super(t), (this.forceLongPolling = t.forceLongPolling), (this.autoDetectLongPolling = t.autoDetectLongPolling), (this.useFetchStreams = t.useFetchStreams);
                }
                qi(t, e, n, s) {
                    return new Promise((r, i)=>{
                        const o = new a.JJ();
                        o.listenOnce(a.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case a.jK.NO_ERROR:
                                        const e = o.getResponseJson();
                                        g("Connection", "XHR received:", JSON.stringify(e)), r(e);
                                        break;
                                    case a.jK.TIMEOUT:
                                        g("Connection", 'RPC "' + t + '" timed out'), i(new S($.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case a.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ((g("Connection", 'RPC "' + t + '" failed with status:', n, "response text:", o.getResponseText()), n > 0)) {
                                            const s = o.getResponseJson().error;
                                            if (s && s.status && s.message) {
                                                const c = (function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values($).indexOf(e) >= 0 ? e : $.UNKNOWN;
                                                })(s.status);
                                                i(new S(c, s.message));
                                            } else i(new S($.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else i(new S($.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        v();
                                }
                            } finally{
                                g("Connection", 'RPC "' + t + '" completed.');
                            }
                        });
                        const c = JSON.stringify(s);
                        o.send(e, "POST", c, n, 15);
                    });
                }
                ji(t, e) {
                    const n = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t,
                        "/channel", 
                    ], s = (0, a.UE)(), r = (0, a.FJ)(), i = {
                        httpSessionIdParam: "gsessionid",
                        initMessageHeaders: {},
                        messageUrlParams: {
                            database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
                        },
                        sendRawJson: !0,
                        supportsCrossDomainXhr: !0,
                        internalChannelParams: {
                            forwardChannelRequestTimeoutMs: 6e5
                        },
                        forceLongPolling: this.forceLongPolling,
                        detectBufferingProxy: this.autoDetectLongPolling
                    };
                    this.useFetchStreams && (i.xmlHttpFactory = new a.zI({})), this.Ui(i.initMessageHeaders, e), (0, o.uI)() || (0, o.b$)() || (0, o.d)() || (0, o.w1)() || (0, o.Mn)() || (0, o.ru)() || (i.httpHeadersOverwriteParam = "$httpHeaders");
                    const c = n.join("");
                    g("Connection", "Creating WebChannel: " + c, i);
                    const u = s.createWebChannel(c, i);
                    let h = !1, l = !1;
                    const d = new rO({
                        vi: (t)=>{
                            l ? g("Connection", "Not sending because WebChannel is closed:", t) : (h || (g("Connection", "Opening WebChannel transport."), u.open(), (h = !0)), g("Connection", "WebChannel sending:", t), u.send(t));
                        },
                        Vi: ()=>u.close()
                    }), f = (t, e, n)=>{
                        t.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (e) {
                                setTimeout(()=>{
                                    throw e;
                                }, 0);
                            }
                        });
                    };
                    return (f(u, a.ii.EventType.OPEN, ()=>{
                        l || g("Connection", "WebChannel transport opened.");
                    }), f(u, a.ii.EventType.CLOSE, ()=>{
                        l || ((l = !0), g("Connection", "WebChannel transport closed"), d.$i());
                    }), f(u, a.ii.EventType.ERROR, (t)=>{
                        l || ((l = !0), y("Connection", "WebChannel transport errored:", t), d.$i(new S($.UNAVAILABLE, "The operation could not be completed")));
                    }), f(u, a.ii.EventType.MESSAGE, (t)=>{
                        var e;
                        if (!l) {
                            const n = t.data[0];
                            I(!!n);
                            const s = n, r = s.error || (null === (e = s[0]) || void 0 === e ? void 0 : e.error);
                            if (r) {
                                g("Connection", "WebChannel received error:", r);
                                const i = r.status;
                                let o = (function(t) {
                                    const e = eL[t];
                                    if (void 0 !== e) return eR(e);
                                })(i), a = r.message;
                                void 0 === o && ((o = $.INTERNAL), (a = "Unknown error status: " + i + " with message " + r.message)), (l = !0), d.$i(new S(o, a)), u.close();
                            } else g("Connection", "WebChannel received:", n), d.Oi(n);
                        }
                    }), f(r, a.ju.STAT_EVENT, (t)=>{
                        t.stat === a.kN.PROXY ? g("Connection", "Detected buffering proxy") : t.stat === a.kN.NOPROXY && g("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        d.ki();
                    }, 0), d);
                }
            }
            function rU() {
                return "undefined" != typeof window ? window : null;
            }
            function rB() {
                return "undefined" != typeof document ? document : null;
            }
            function r9(t) {
                return new e5(t, !0);
            }
            class rK {
                constructor(t, e, n = 1e3, s = 1.5, r = 6e4){
                    (this.Oe = t), (this.timerId = e), (this.Qi = n), (this.Wi = s), (this.Gi = r), (this.zi = 0), (this.Hi = null), (this.Ji = Date.now()), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(t) {
                    this.cancel();
                    const e = Math.floor(this.zi + this.Zi()), n = Math.max(0, Date.now() - this.Ji), s = Math.max(0, e - n);
                    s > 0 && g("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), (this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>((this.Ji = Date.now()), t()))), (this.zi *= this.Wi), this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
                }
                tr() {
                    null !== this.Hi && (this.Hi.skipDelay(), (this.Hi = null));
                }
                cancel() {
                    null !== this.Hi && (this.Hi.cancel(), (this.Hi = null));
                }
                Zi() {
                    return (Math.random() - 0.5) * this.zi;
                }
            }
            class rz {
                constructor(t, e, n, s, r, i, o){
                    (this.Oe = t), (this.er = n), (this.nr = s), (this.sr = r), (this.credentialsProvider = i), (this.listener = o), (this.state = 0), (this.ir = 0), (this.rr = null), (this.cr = null), (this.stream = null), (this.ar = new rK(t, e));
                }
                ur() {
                    return (1 === this.state || 5 === this.state || this.hr());
                }
                hr() {
                    return (2 === this.state || 3 === this.state);
                }
                start() {
                    4 !== this.state ? this.auth() : this.lr();
                }
                async stop() {
                    this.ur() && (await this.close(0));
                }
                dr() {
                    (this.state = 0), this.ar.reset();
                }
                wr() {
                    this.hr() && null === this.rr && (this.rr = this.Oe.enqueueAfterDelay(this.er, 6e4, ()=>this._r()));
                }
                mr(t) {
                    this.gr(), this.stream.send(t);
                }
                async _r() {
                    if (this.hr()) return this.close(0);
                }
                gr() {
                    this.rr && (this.rr.cancel(), (this.rr = null));
                }
                yr() {
                    this.cr && (this.cr.cancel(), (this.cr = null));
                }
                async close(t, e) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== t ? this.ar.reset() : e && e.code === $.RESOURCE_EXHAUSTED ? (p(e.toString()), p("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e && e.code === $.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), (this.stream = null)), (this.state = t), await this.listener.Ci(e);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const t = this.Tr(this.ir), e = this.ir;
                    this.credentialsProvider.getToken().then((t)=>{
                        this.ir === e && this.Er(t);
                    }, (e)=>{
                        t(()=>{
                            const t = new S($.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t) {
                    const e = this.Tr(this.ir);
                    (this.stream = this.Ar(t)), this.stream.Si(()=>{
                        e(()=>((this.state = 2), (this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve()))), this.listener.Si()));
                    }), this.stream.Ci((t)=>{
                        e(()=>this.Ir(t));
                    }), this.stream.onMessage((t)=>{
                        e(()=>this.onMessage(t));
                    });
                }
                lr() {
                    (this.state = 5), this.ar.Xi(async ()=>{
                        (this.state = 0), this.start();
                    });
                }
                Ir(t) {
                    return (g("PersistentStream", `close with error: ${t}`), (this.stream = null), this.close(4, t));
                }
                Tr(t) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t ? e() : (g("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class rQ extends rz {
                constructor(t, e, n, s, r){
                    super(t, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, r), (this.N = s);
                }
                Ar(t) {
                    return this.sr.ji("Listen", t);
                }
                onMessage(t) {
                    this.ar.reset();
                    const e = ng(this.N, t), n = (function(t) {
                        if (!("targetChange" in t)) return O.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? O.min() : e.readTime ? ns(e.readTime) : O.min();
                    })(t);
                    return this.listener.Rr(e, n);
                }
                br(t) {
                    const e = {};
                    (e.database = nh(this.N)), (e.addTarget = (function(t, e) {
                        let n;
                        const s = e.target;
                        return ((n = tk(s) ? {
                            documents: nv(t, s)
                        } : {
                            query: nI(t, s)
                        }), (n.targetId = e.targetId), e.resumeToken.approximateByteSize() > 0 ? (n.resumeToken = ne(t, e.resumeToken)) : e.snapshotVersion.compareTo(O.min()) > 0 && (n.readTime = nt(t, e.snapshotVersion.toTimestamp())), n);
                    })(this.N, t));
                    const n = nE(this.N, t);
                    n && (e.labels = n), this.mr(e);
                }
                Pr(t) {
                    const e = {};
                    (e.database = nh(this.N)), (e.removeTarget = t), this.mr(e);
                }
            }
            class rG extends (null && rz) {
                constructor(t, e, n, s, r){
                    super(t, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", e, n, r), (this.N = s), (this.vr = !1);
                }
                get Vr() {
                    return this.vr;
                }
                start() {
                    (this.vr = !1), (this.lastStreamToken = void 0), super.start();
                }
                pr() {
                    this.vr && this.Sr([]);
                }
                Ar(t) {
                    return this.sr.ji("Write", t);
                }
                onMessage(t) {
                    if ((I(!!t.streamToken), (this.lastStreamToken = t.streamToken), this.vr)) {
                        this.ar.reset();
                        const e = nw(t.writeResults, t.commitTime), n = ns(t.commitTime);
                        return this.listener.Dr(n, e);
                    }
                    return (I(!t.writeResults || 0 === t.writeResults.length), (this.vr = !0), this.listener.Cr());
                }
                Nr() {
                    const t = {};
                    (t.database = nh(this.N)), this.mr(t);
                }
                Sr(t) {
                    const e = {
                        streamToken: this.lastStreamToken,
                        writes: t.map((t)=>np(this.N, t))
                    };
                    this.mr(e);
                }
            }
            class rj extends class {
            } {
                constructor(t, e, n){
                    super(), (this.credentials = t), (this.sr = e), (this.N = n), (this.kr = !1);
                }
                $r() {
                    if (this.kr) throw new S($.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(t, e, n) {
                    return (this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === $.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new S($.UNKNOWN, t.toString());
                    }));
                }
                Ki(t, e, n) {
                    return (this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === $.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new S($.UNKNOWN, t.toString());
                    }));
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class rH {
                constructor(t, e){
                    (this.asyncQueue = t), (this.onlineStateHandler = e), (this.state = "Unknown"), (this.Or = 0), (this.Fr = null), (this.Mr = !0);
                }
                Lr() {
                    0 === this.Or && (this.Br("Unknown"), (this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, ()=>((this.Fr = null), this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve()))));
                }
                qr(t) {
                    "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${t.toString()}`), this.Br("Offline")));
                }
                set(t) {
                    this.Kr(), (this.Or = 0), "Online" === t && (this.Mr = !1), this.Br(t);
                }
                Br(t) {
                    t !== this.state && ((this.state = t), this.onlineStateHandler(t));
                }
                Ur(t) {
                    const e = `Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (p(e), (this.Mr = !1)) : g("OnlineStateTracker", e);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), (this.Fr = null));
                }
            }
            class rW {
                constructor(t, e, n, s, r){
                    (this.localStore = t), (this.datastore = e), (this.asyncQueue = n), (this.remoteSyncer = {}), (this.jr = []), (this.Qr = new Map()), (this.Wr = new Set()), (this.Gr = []), (this.zr = r), this.zr.Ti((t)=>{
                        n.enqueueAndForget(async ()=>{
                            r4(this) && (g("RemoteStore", "Restarting streams for network reachability change."), await (async function(t) {
                                const e = E(t);
                                e.Wr.add(4), await rY(e), e.Hr.set("Unknown"), e.Wr.delete(4), await r0(e);
                            })(this));
                        });
                    }), (this.Hr = new rH(n, s));
                }
            }
            async function r0(t) {
                if (r4(t)) for (const e of t.Gr)await e(!0);
            }
            async function rY(t) {
                for (const e of t.Gr)await e(!1);
            }
            function r1(t, e) {
                const n = E(t);
                n.Qr.has(e.targetId) || (n.Qr.set(e.targetId, e), r3(n) ? rJ(n) : ig(n).hr() && rX(n, e));
            }
            function r2(t, e) {
                const n = E(t), s = ig(n);
                n.Qr.delete(e), s.hr() && rZ(n, e), 0 === n.Qr.size && (s.hr() ? s.wr() : r4(n) && n.Hr.set("Unknown"));
            }
            function rX(t, e) {
                t.Jr.Y(e.targetId), ig(t).br(e);
            }
            function rZ(t, e) {
                t.Jr.Y(e), ig(t).Pr(e);
            }
            function rJ(t) {
                (t.Jr = new eJ({
                    getRemoteKeysForTarget: (e)=>t.remoteSyncer.getRemoteKeysForTarget(e),
                    Tt: (e)=>t.Qr.get(e) || null
                })), ig(t).start(), t.Hr.Lr();
            }
            function r3(t) {
                return r4(t) && !ig(t).ur() && t.Qr.size > 0;
            }
            function r4(t) {
                return 0 === E(t).Wr.size;
            }
            function r6(t) {
                t.Jr = void 0;
            }
            async function r7(t) {
                t.Qr.forEach((e, n)=>{
                    rX(t, e);
                });
            }
            async function r5(t, e) {
                r6(t), r3(t) ? (t.Hr.qr(e), rJ(t)) : t.Hr.set("Unknown");
            }
            async function it(t, e, n) {
                if ((t.Hr.set("Online"), e instanceof eX && 2 === e.state && e.cause)) try {
                    await (async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    })(t, e);
                } catch (s) {
                    g("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), s), await ie(t, s);
                }
                else if ((e instanceof e1 ? t.Jr.rt(e) : e instanceof e2 ? t.Jr.ft(e) : t.Jr.at(e), !n.isEqual(O.min()))) try {
                    const r = await ri(t.localStore);
                    n.compareTo(r) >= 0 && (await (function(t, e) {
                        const n = t.Jr._t(e);
                        return (n.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const r = t.Qr.get(s);
                                r && t.Qr.set(s, r.withResumeToken(n.resumeToken, e));
                            }
                        }), n.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (!n) return;
                            t.Qr.set(e, n.withResumeToken(W.EMPTY_BYTE_STRING, n.snapshotVersion)), rZ(t, e);
                            const s = new sa(n.target, e, 1, n.sequenceNumber);
                            rX(t, s);
                        }), t.remoteSyncer.applyRemoteEvent(n));
                    })(t, n));
                } catch (i) {
                    g("RemoteStore", "Failed to raise snapshot:", i), await ie(t, i);
                }
            }
            async function ie(t, e, n) {
                if (!n7(e)) throw e;
                t.Wr.add(1), await rY(t), t.Hr.set("Offline"), n || (n = ()=>ri(t.localStore)), t.asyncQueue.enqueueRetryable(async ()=>{
                    g("RemoteStore", "Retrying IndexedDB access"), await n(), t.Wr.delete(1), await r0(t);
                });
            }
            function is(t, e) {
                return e().catch((n)=>ie(t, n, e));
            }
            async function ir(t) {
                const e = E(t), n = ip(e);
                let s = e.jr.length > 0 ? e.jr[e.jr.length - 1].batchId : -1;
                for(; ii(e);)try {
                    const r = await rc(e.localStore, s);
                    if (null === r) {
                        0 === e.jr.length && n.wr();
                        break;
                    }
                    (s = r.batchId), io(e, r);
                } catch (i) {
                    await ie(e, i);
                }
                ia(e) && ic(e);
            }
            function ii(t) {
                return r4(t) && t.jr.length < 10;
            }
            function io(t, e) {
                t.jr.push(e);
                const n = ip(t);
                n.hr() && n.Vr && n.Sr(e.mutations);
            }
            function ia(t) {
                return r4(t) && !ip(t).ur() && t.jr.length > 0;
            }
            function ic(t) {
                ip(t).start();
            }
            async function iu(t) {
                ip(t).Nr();
            }
            async function ih(t) {
                const e = ip(t);
                for (const n of t.jr)e.Sr(n.mutations);
            }
            async function il(t, e, n) {
                const s = t.jr.shift(), r = so.from(s, e, n);
                await is(t, ()=>t.remoteSyncer.applySuccessfulWrite(r)), await ir(t);
            }
            async function id(t, e) {
                e && ip(t).Vr && (await (async function(t, e) {
                    if (((s = e.code), eM(s) && s !== $.ABORTED)) {
                        const n = t.jr.shift();
                        ip(t).dr(), await is(t, ()=>t.remoteSyncer.rejectFailedWrite(n.batchId, e)), await ir(t);
                    }
                    var s;
                })(t, e)), ia(t) && ic(t);
            }
            async function im(t, e) {
                const n = E(t);
                e ? (n.Wr.delete(2), await r0(n)) : e || (n.Wr.add(2), await rY(n), n.Hr.set("Unknown"));
            }
            function ig(t) {
                return (t.Yr || ((t.Yr = (function(t, e, n) {
                    const s = E(t);
                    return (s.$r(), new rQ(e, s.sr, s.credentials, s.N, n));
                })(t.datastore, t.asyncQueue, {
                    Si: r7.bind(null, t),
                    Ci: r5.bind(null, t),
                    Rr: it.bind(null, t)
                })), t.Gr.push(async (e)=>{
                    e ? (t.Yr.dr(), r3(t) ? rJ(t) : t.Hr.set("Unknown")) : (await t.Yr.stop(), r6(t));
                })), t.Yr);
            }
            function ip(t) {
                return (t.Xr || ((t.Xr = (function(t, e, n) {
                    const s = E(t);
                    return (s.$r(), new rG(e, s.sr, s.credentials, s.N, n));
                })(t.datastore, t.asyncQueue, {
                    Si: iu.bind(null, t),
                    Ci: id.bind(null, t),
                    Cr: ih.bind(null, t),
                    Dr: il.bind(null, t)
                })), t.Gr.push(async (e)=>{
                    e ? (t.Xr.dr(), await ir(t)) : (await t.Xr.stop(), t.jr.length > 0 && (g("RemoteStore", `Stopping write stream with ${t.jr.length} pending writes`), (t.jr = [])));
                })), t.Xr);
            }
            class iy {
                constructor(t, e, n, s, r){
                    (this.asyncQueue = t), (this.timerId = e), (this.targetTimeMs = n), (this.op = s), (this.removalCallback = r), (this.deferred = new N()), (this.then = this.deferred.promise.then.bind(this.deferred.promise)), this.deferred.promise.catch((t)=>{});
                }
                static createAndSchedule(t, e, n, s, r) {
                    const i = Date.now() + n, o = new iy(t, e, i, s, r);
                    return o.start(n), o;
                }
                start(t) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), t);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new S($.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((t)=>this.deferred.resolve(t))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), (this.timerHandle = null));
                }
            }
            function iw(t, e) {
                if ((p("AsyncQueue", `${e}: ${t}`), n7(t))) return new S($.UNAVAILABLE, `${e}: ${t}`);
                throw t;
            }
            class iv {
                constructor(t){
                    (this.comparator = t ? (e, n)=>t(e, n) || to.comparator(e.key, n.key) : (t, e)=>to.comparator(t.key, e.key)), (this.keyedMap = eK()), (this.sortedSet = new eF(this.comparator));
                }
                static emptySet(t) {
                    return new iv(t.comparator);
                }
                has(t) {
                    return null != this.keyedMap.get(t);
                }
                get(t) {
                    return this.keyedMap.get(t);
                }
                first() {
                    return this.sortedSet.minKey();
                }
                last() {
                    return this.sortedSet.maxKey();
                }
                isEmpty() {
                    return this.sortedSet.isEmpty();
                }
                indexOf(t) {
                    const e = this.keyedMap.get(t);
                    return e ? this.sortedSet.indexOf(e) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(t) {
                    this.sortedSet.inorderTraversal((e, n)=>(t(e), !1));
                }
                add(t) {
                    const e = this.delete(t.key);
                    return e.copy(e.keyedMap.insert(t.key, t), e.sortedSet.insert(t, null));
                }
                delete(t) {
                    const e = this.get(t);
                    return e ? this.copy(this.keyedMap.remove(t), this.sortedSet.remove(e)) : this;
                }
                isEqual(t) {
                    if (!(t instanceof iv)) return !1;
                    if (this.size !== t.size) return !1;
                    const e = this.sortedSet.getIterator(), n = t.sortedSet.getIterator();
                    for(; e.hasNext();){
                        const s = e.getNext().key, r = n.getNext().key;
                        if (!s.isEqual(r)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const t = [];
                    return (this.forEach((e)=>{
                        t.push(e.toString());
                    }), 0 === t.length ? "DocumentSet ()" : "DocumentSet (\n  " + t.join("  \n") + "\n)");
                }
                copy(t, e) {
                    const n = new iv();
                    return ((n.comparator = this.comparator), (n.keyedMap = t), (n.sortedSet = e), n);
                }
            }
            class iI {
                constructor(){
                    this.Zr = new eF(to.comparator);
                }
                track(t) {
                    const e = t.doc.key, n = this.Zr.get(e);
                    n ? 0 !== t.type && 3 === n.type ? (this.Zr = this.Zr.insert(e, t)) : 3 === t.type && 1 !== n.type ? (this.Zr = this.Zr.insert(e, {
                        type: n.type,
                        doc: t.doc
                    })) : 2 === t.type && 2 === n.type ? (this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t.doc
                    })) : 2 === t.type && 0 === n.type ? (this.Zr = this.Zr.insert(e, {
                        type: 0,
                        doc: t.doc
                    })) : 1 === t.type && 0 === n.type ? (this.Zr = this.Zr.remove(e)) : 1 === t.type && 2 === n.type ? (this.Zr = this.Zr.insert(e, {
                        type: 1,
                        doc: n.doc
                    })) : 0 === t.type && 1 === n.type ? (this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t.doc
                    })) : v() : (this.Zr = this.Zr.insert(e, t));
                }
                eo() {
                    const t = [];
                    return (this.Zr.inorderTraversal((e, n)=>{
                        t.push(n);
                    }), t);
                }
            }
            class iT {
                constructor(t, e, n, s, r, i, o, a){
                    (this.query = t), (this.docs = e), (this.oldDocs = n), (this.docChanges = s), (this.mutatedKeys = r), (this.fromCache = i), (this.syncStateChanged = o), (this.excludesMetadataChanges = a);
                }
                static fromInitialDocuments(t, e, n, s) {
                    const r = [];
                    return (e.forEach((t)=>{
                        r.push({
                            type: 0,
                            doc: t
                        });
                    }), new iT(t, e, iv.emptySet(e), r, n, s, !0, !1));
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t) {
                    if (!(this.fromCache === t.fromCache && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && tZ(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs))) return !1;
                    const e = this.docChanges, n = t.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let s = 0; s < e.length; s++)if (e[s].type !== n[s].type || !e[s].doc.isEqual(n[s].doc)) return !1;
                    return !0;
                }
            }
            class iE {
                constructor(){
                    (this.no = void 0), (this.listeners = []);
                }
            }
            class i$ {
                constructor(){
                    (this.queries = new sQ((t)=>tJ(t), tZ)), (this.onlineState = "Unknown"), (this.so = new Set());
                }
            }
            async function iS(t, e) {
                const n = E(t), s = e.query;
                let r = !1, i = n.queries.get(s);
                if ((i || ((r = !0), (i = new iE())), r)) try {
                    i.no = await n.onListen(s);
                } catch (o) {
                    const a = iw(o, `Initialization of query '${t3(e.query)}' failed`);
                    return void e.onError(a);
                }
                if ((n.queries.set(s, i), i.listeners.push(e), e.io(n.onlineState), i.no)) {
                    e.ro(i.no) && iA(n);
                }
            }
            async function i8(t, e) {
                const n = E(t), s = e.query;
                let r = !1;
                const i = n.queries.get(s);
                if (i) {
                    const o = i.listeners.indexOf(e);
                    o >= 0 && (i.listeners.splice(o, 1), (r = 0 === i.listeners.length));
                }
                if (r) return n.queries.delete(s), n.onUnlisten(s);
            }
            function iN(t, e) {
                const n = E(t);
                let s = !1;
                for (const r of e){
                    const i = r.query, o = n.queries.get(i);
                    if (o) {
                        for (const a of o.listeners)a.ro(r) && (s = !0);
                        o.no = r;
                    }
                }
                s && iA(n);
            }
            function ib(t, e, n) {
                const s = E(t), r = s.queries.get(e);
                if (r) for (const i of r.listeners)i.onError(n);
                s.queries.delete(e);
            }
            function iA(t) {
                t.so.forEach((t)=>{
                    t.next();
                });
            }
            class ik {
                constructor(t, e, n){
                    (this.query = t), (this.oo = e), (this.co = !1), (this.ao = null), (this.onlineState = "Unknown"), (this.options = n || {});
                }
                ro(t) {
                    if (!this.options.includeMetadataChanges) {
                        const e = [];
                        for (const n of t.docChanges)3 !== n.type && e.push(n);
                        t = new iT(t.query, t.docs, t.oldDocs, e, t.mutatedKeys, t.fromCache, t.syncStateChanged, !0);
                    }
                    let s = !1;
                    return (this.co ? this.uo(t) && (this.oo.next(t), (s = !0)) : this.ho(t, this.onlineState) && (this.lo(t), (s = !0)), (this.ao = t), s);
                }
                onError(t) {
                    this.oo.error(t);
                }
                io(t) {
                    this.onlineState = t;
                    let e = !1;
                    return (this.ao && !this.co && this.ho(this.ao, t) && (this.lo(this.ao), (e = !0)), e);
                }
                ho(t, e) {
                    if (!t.fromCache) return !0;
                    const n = "Offline" !== e;
                    return ((!this.options.fo || !n) && (!t.docs.isEmpty() || "Offline" === e));
                }
                uo(t) {
                    if (t.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t.hasPendingWrites;
                    return (!(!t.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges);
                }
                lo(t) {
                    (t = iT.fromInitialDocuments(t.query, t.docs, t.mutatedKeys, t.fromCache)), (this.co = !0), this.oo.next(t);
                }
            }
            class iD {
                constructor(t, e){
                    (this.payload = t), (this.byteLength = e);
                }
                wo() {
                    return "metadata" in this.payload;
                }
            }
            class ix {
                constructor(t){
                    this.N = t;
                }
                zn(t) {
                    return na(this.N, t);
                }
                Hn(t) {
                    return t.metadata.exists ? nf(this.N, t.document, !1) : t$.newNoDocument(this.zn(t.metadata.name), this.Jn(t.metadata.readTime));
                }
                Jn(t) {
                    return ns(t);
                }
            }
            class iC {
                constructor(t, e, n){
                    (this._o = t), (this.localStore = e), (this.N = n), (this.queries = []), (this.documents = []), (this.progress = iL(t));
                }
                mo(t) {
                    this.progress.bytesLoaded += t.byteLength;
                    let e = this.progress.documentsLoaded;
                    return (t.payload.namedQuery ? this.queries.push(t.payload.namedQuery) : t.payload.documentMetadata ? (this.documents.push({
                        metadata: t.payload.documentMetadata
                    }), t.payload.documentMetadata.exists || ++e) : t.payload.document && ((this.documents[this.documents.length - 1].document = t.payload.document), ++e), e !== this.progress.documentsLoaded ? ((this.progress.documentsLoaded = e), Object.assign({}, this.progress)) : null);
                }
                yo(t) {
                    const e = new Map(), n = new ix(this.N);
                    for (const s of t)if (s.metadata.queries) {
                        const r = n.zn(s.metadata.name);
                        for (const i of s.metadata.queries){
                            const o = (e.get(i) || ej()).add(r);
                            e.set(i, o);
                        }
                    }
                    return e;
                }
                async complete() {
                    const t = await rg(this.localStore, new ix(this.N), this.documents, this._o.id), e = this.yo(this.documents);
                    for (const n of this.queries)await rp(this.localStore, n, e.get(n.name));
                    return ((this.progress.taskState = "Success"), new s6(Object.assign({}, this.progress), t));
                }
            }
            function iL(t) {
                return {
                    taskState: "Running",
                    documentsLoaded: 0,
                    bytesLoaded: 0,
                    totalDocuments: t.totalDocuments,
                    totalBytes: t.totalBytes
                };
            }
            class i_ {
                constructor(t){
                    this.key = t;
                }
            }
            class iM {
                constructor(t){
                    this.key = t;
                }
            }
            class iR {
                constructor(t, e){
                    (this.query = t), (this.po = e), (this.To = null), (this.current = !1), (this.Eo = ej()), (this.mutatedKeys = ej()), (this.Io = t6(t)), (this.Ao = new iv(this.Io));
                }
                get Ro() {
                    return this.po;
                }
                bo(t, e) {
                    const n = e ? e.Po : new iI(), s = e ? e.Ao : this.Ao;
                    let r = e ? e.mutatedKeys : this.mutatedKeys, i = s, o = !1;
                    const a = tj(this.query) && s.size === this.query.limit ? s.last() : null, c = tH(this.query) && s.size === this.query.limit ? s.first() : null;
                    if ((t.inorderTraversal((t, e)=>{
                        const u = s.get(t), h = t4(this.query, e) ? e : null, l = !!u && this.mutatedKeys.has(u.key), d = !!h && (h.hasLocalMutations || (this.mutatedKeys.has(h.key) && h.hasCommittedMutations));
                        let f = !1;
                        if (u && h) {
                            u.data.isEqual(h.data) ? l !== d && (n.track({
                                type: 3,
                                doc: h
                            }), (f = !0)) : this.vo(u, h) || (n.track({
                                type: 2,
                                doc: h
                            }), (f = !0), ((a && this.Io(h, a) > 0) || (c && this.Io(h, c) < 0)) && (o = !0));
                        } else !u && h ? (n.track({
                            type: 0,
                            doc: h
                        }), (f = !0)) : u && !h && (n.track({
                            type: 1,
                            doc: u
                        }), (f = !0), (a || c) && (o = !0));
                        f && (h ? ((i = i.add(h)), (r = d ? r.add(t) : r.delete(t))) : ((i = i.delete(t)), (r = r.delete(t))));
                    }), tj(this.query) || tH(this.query))) for(; i.size > this.query.limit;){
                        const u = tj(this.query) ? i.last() : i.first();
                        (i = i.delete(u.key)), (r = r.delete(u.key)), n.track({
                            type: 1,
                            doc: u
                        });
                    }
                    return {
                        Ao: i,
                        Po: n,
                        Ln: o,
                        mutatedKeys: r
                    };
                }
                vo(t, e) {
                    return (t.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations);
                }
                applyChanges(t, e, n) {
                    const s = this.Ao;
                    (this.Ao = t.Ao), (this.mutatedKeys = t.mutatedKeys);
                    const r = t.Po.eo();
                    r.sort((t, e)=>(function(t, e) {
                            const n = (t)=>{
                                switch(t){
                                    case 0:
                                        return 1;
                                    case 2:
                                    case 3:
                                        return 2;
                                    case 1:
                                        return 0;
                                    default:
                                        return v();
                                }
                            };
                            return n(t) - n(e);
                        })(t.type, e.type) || this.Io(t.doc, e.doc)), this.Vo(n);
                    const i = e ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, a = o !== this.To;
                    if (((this.To = o), 0 !== r.length || a)) {
                        return {
                            snapshot: new iT(this.query, t.Ao, s, r, t.mutatedKeys, 0 === o, a, !1),
                            Do: i
                        };
                    }
                    return {
                        Do: i
                    };
                }
                io(t) {
                    return this.current && "Offline" === t ? ((this.current = !1), this.applyChanges({
                        Ao: this.Ao,
                        Po: new iI(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t) {
                    return (!this.po.has(t) && !!this.Ao.has(t) && !this.Ao.get(t).hasLocalMutations);
                }
                Vo(t) {
                    t && (t.addedDocuments.forEach((t)=>(this.po = this.po.add(t))), t.modifiedDocuments.forEach((t)=>{}), t.removedDocuments.forEach((t)=>(this.po = this.po.delete(t))), (this.current = t.current));
                }
                So() {
                    if (!this.current) return [];
                    const t = this.Eo;
                    (this.Eo = ej()), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    const e = [];
                    return (t.forEach((t)=>{
                        this.Eo.has(t) || e.push(new iM(t));
                    }), this.Eo.forEach((n)=>{
                        t.has(n) || e.push(new i_(n));
                    }), e);
                }
                No(t) {
                    (this.po = t.Gn), (this.Eo = ej());
                    const e = this.bo(t.documents);
                    return this.applyChanges(e, !0);
                }
                xo() {
                    return iT.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class iF {
                constructor(t, e, n){
                    (this.query = t), (this.targetId = e), (this.view = n);
                }
            }
            class iV {
                constructor(t){
                    (this.key = t), (this.ko = !1);
                }
            }
            class iq {
                constructor(t, e, n, s, r, i){
                    (this.localStore = t), (this.remoteStore = e), (this.eventManager = n), (this.sharedClientState = s), (this.currentUser = r), (this.maxConcurrentLimboResolutions = i), (this.$o = {}), (this.Oo = new sQ((t)=>tJ(t), tZ)), (this.Fo = new Map()), (this.Mo = new Set()), (this.Lo = new eF(to.comparator)), (this.Bo = new Map()), (this.Uo = new rw()), (this.qo = {}), (this.Ko = new Map()), (this.jo = sM.ie()), (this.onlineState = "Unknown"), (this.Qo = void 0);
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function iO(t, e) {
                const n = oi(t);
                let s, r;
                const i = n.Oo.get(e);
                if (i) (s = i.targetId), n.sharedClientState.addLocalQueryTarget(s), (r = i.view.xo());
                else {
                    const o = await ru(n.localStore, t2(e)), a = n.sharedClientState.addLocalQueryTarget(o.targetId);
                    (s = o.targetId), (r = await iP(n, e, s, "current" === a)), n.isPrimaryClient && r1(n.remoteStore, o);
                }
                return r;
            }
            async function iP(t, e, n, s) {
                t.Wo = (e, n, s)=>(async function(t, e, n, s) {
                        let r = e.view.bo(n);
                        r.Ln && (r = await rl(t.localStore, e.query, !1).then(({ documents: t  })=>e.view.bo(t, r)));
                        const i = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(r, t.isPrimaryClient, i);
                        return i1(t, e.targetId, o.Do), o.snapshot;
                    })(t, e, n, s);
                const r = await rl(t.localStore, e, !0), i = new iR(e, r.Gn), o = i.bo(r.documents), a = eY.createSynthesizedTargetChangeForCurrentChange(n, s && "Offline" !== t.onlineState), c = i.applyChanges(o, t.isPrimaryClient, a);
                i1(t, n, c.Do);
                const u = new iF(e, n, i);
                return (t.Oo.set(e, u), t.Fo.has(n) ? t.Fo.get(n).push(e) : t.Fo.set(n, [
                    e
                ]), c.snapshot);
            }
            async function iU(t, e) {
                const n = E(t), s = n.Oo.get(e), r = n.Fo.get(s.targetId);
                if (r.length > 1) return (n.Fo.set(s.targetId, r.filter((t)=>!tZ(t, e))), void n.Oo.delete(e));
                if (n.isPrimaryClient) {
                    n.sharedClientState.removeLocalQueryTarget(s.targetId);
                    n.sharedClientState.isActiveQueryTarget(s.targetId) || (await rh(n.localStore, s.targetId, !1).then(()=>{
                        n.sharedClientState.clearQueryState(s.targetId), r2(n.remoteStore, s.targetId), i0(n, s.targetId);
                    }).catch(sO));
                } else i0(n, s.targetId), await rh(n.localStore, s.targetId, !0);
            }
            async function iB(t, e, n) {
                const s = oo(t);
                try {
                    const r = await (function(t, e) {
                        const n = E(t), s = q.now(), r = e.reduce((t, e)=>t.add(e.key), ej());
                        let i;
                        return n.persistence.runTransaction("Locally write mutations", "readwrite", (t)=>n.Qn.Pn(t, r).next((r)=>{
                                i = r;
                                const o = [];
                                for (const a of e){
                                    const c = eE(a, i.get(a.key));
                                    null != c && o.push(new eN(a.key, c, tE(c.value.mapValue), ey.exists(!0)));
                                }
                                return n.In.addMutationBatch(t, s, o, e);
                            })).then((t)=>(t.applyToLocalDocumentSet(i), {
                                batchId: t.batchId,
                                changes: i
                            }));
                    })(s.localStore, e);
                    s.sharedClientState.addPendingMutation(r.batchId), (function(t, e, n) {
                        let s = t.qo[t.currentUser.toKey()];
                        s || (s = new eF(R));
                        (s = s.insert(e, n)), (t.qo[t.currentUser.toKey()] = s);
                    })(s, r.batchId, n), await iZ(s, r.changes), await ir(s.remoteStore);
                } catch (i) {
                    const o = iw(i, "Failed to persist write");
                    n.reject(o);
                }
            }
            async function i9(t, e) {
                const n = E(t);
                try {
                    const s = await ro(n.localStore, e);
                    e.targetChanges.forEach((t, e)=>{
                        const s = n.Bo.get(e);
                        s && (I(t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1), t.addedDocuments.size > 0 ? (s.ko = !0) : t.modifiedDocuments.size > 0 ? I(s.ko) : t.removedDocuments.size > 0 && (I(s.ko), (s.ko = !1)));
                    }), await iZ(n, s, e);
                } catch (r) {
                    await sO(r);
                }
            }
            function iK(t, e, n) {
                const s = E(t);
                if ((s.isPrimaryClient && 0 === n) || (!s.isPrimaryClient && 1 === n)) {
                    const r = [];
                    s.Oo.forEach((t, n)=>{
                        const s = n.view.io(e);
                        s.snapshot && r.push(s.snapshot);
                    }), (function(t, e) {
                        const n = E(t);
                        n.onlineState = e;
                        let s = !1;
                        n.queries.forEach((t, n)=>{
                            for (const r of n.listeners)r.io(e) && (s = !0);
                        }), s && iA(n);
                    })(s.eventManager, e), r.length && s.$o.Rr(r), (s.onlineState = e), s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
                }
            }
            async function iz(t, e, n) {
                const s = E(t);
                s.sharedClientState.updateQueryState(e, "rejected", n);
                const r = s.Bo.get(e), i = r && r.key;
                if (i) {
                    let o = new eF(to.comparator);
                    o = o.insert(i, t$.newNoDocument(i, O.min()));
                    const a = ej().add(i), c = new e0(O.min(), new Map(), new eO(R), o, a);
                    await i9(s, c), (s.Lo = s.Lo.remove(i)), s.Bo.delete(e), iX(s);
                } else await rh(s.localStore, e, !1).then(()=>i0(s, e, n)).catch(sO);
            }
            async function iQ(t, e) {
                const n = E(t), s = e.batch.batchId;
                try {
                    const r = await rr(n.localStore, e);
                    iW(n, s, null), iH(n, s), n.sharedClientState.updateMutationState(s, "acknowledged"), await iZ(n, r);
                } catch (i) {
                    await sO(i);
                }
            }
            async function iG(t, e, n) {
                const s = E(t);
                try {
                    const r = await (function(t, e) {
                        const n = E(t);
                        return n.persistence.runTransaction("Reject batch", "readwrite-primary", (t)=>{
                            let s;
                            return n.In.lookupMutationBatch(t, e).next((e)=>(I(null !== e), (s = e.keys()), n.In.removeMutationBatch(t, e))).next(()=>n.In.performConsistencyCheck(t)).next(()=>n.Qn.Pn(t, s));
                        });
                    })(s.localStore, e);
                    iW(s, e, n), iH(s, e), s.sharedClientState.updateMutationState(e, "rejected", n), await iZ(s, r);
                } catch (i) {
                    await sO(i);
                }
            }
            async function ij(t, e) {
                const n = E(t);
                r4(n.remoteStore) || g("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
                try {
                    const s = await (function(t) {
                        const e = E(t);
                        return e.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (t)=>e.In.getHighestUnacknowledgedBatchId(t));
                    })(n.localStore);
                    if (-1 === s) return void e.resolve();
                    const r = n.Ko.get(s) || [];
                    r.push(e), n.Ko.set(s, r);
                } catch (i) {
                    const o = iw(i, "Initialization of waitForPendingWrites() operation failed");
                    e.reject(o);
                }
            }
            function iH(t, e) {
                (t.Ko.get(e) || []).forEach((t)=>{
                    t.resolve();
                }), t.Ko.delete(e);
            }
            function iW(t, e, n) {
                const s = E(t);
                let r = s.qo[s.currentUser.toKey()];
                if (r) {
                    const i = r.get(e);
                    i && (n ? i.reject(n) : i.resolve(), (r = r.remove(e))), (s.qo[s.currentUser.toKey()] = r);
                }
            }
            function i0(t, e, n = null) {
                t.sharedClientState.removeLocalQueryTarget(e);
                for (const s of t.Fo.get(e))t.Oo.delete(s), n && t.$o.Go(s, n);
                if ((t.Fo.delete(e), t.isPrimaryClient)) {
                    t.Uo.cs(e).forEach((e)=>{
                        t.Uo.containsKey(e) || iY(t, e);
                    });
                }
            }
            function iY(t, e) {
                t.Mo.delete(e.path.canonicalString());
                const n = t.Lo.get(e);
                null !== n && (r2(t.remoteStore, n), (t.Lo = t.Lo.remove(e)), t.Bo.delete(n), iX(t));
            }
            function i1(t, e, n) {
                for (const s of n)if (s instanceof i_) t.Uo.addReference(s.key, e), i2(t, s);
                else if (s instanceof iM) {
                    g("SyncEngine", "Document no longer in limbo: " + s.key), t.Uo.removeReference(s.key, e);
                    t.Uo.containsKey(s.key) || iY(t, s.key);
                } else v();
            }
            function i2(t, e) {
                const n = e.key, s = n.path.canonicalString();
                t.Lo.get(n) || t.Mo.has(s) || (g("SyncEngine", "New document in limbo: " + n), t.Mo.add(s), iX(t));
            }
            function iX(t) {
                for(; t.Mo.size > 0 && t.Lo.size < t.maxConcurrentLimboResolutions;){
                    const e = t.Mo.values().next().value;
                    t.Mo.delete(e);
                    const n = new to(z.fromString(e)), s = t.jo.next();
                    t.Bo.set(s, new iV(n)), (t.Lo = t.Lo.insert(n, s)), r1(t.remoteStore, new sa(t2(tG(n.path)), s, 2, L.T));
                }
            }
            async function iZ(t, e, n) {
                const s = E(t), r = [], i = [], o = [];
                s.Oo.isEmpty() || (s.Oo.forEach((t, a)=>{
                    o.push(s.Wo(a, e, n).then((t)=>{
                        if (t) {
                            s.isPrimaryClient && s.sharedClientState.updateQueryState(a.targetId, t.fromCache ? "not-current" : "current"), r.push(t);
                            const e = s5.kn(a.targetId, t);
                            i.push(e);
                        }
                    }));
                }), await Promise.all(o), s.$o.Rr(r), await (async function(t, e) {
                    const n = E(t);
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t)=>nZ.forEach(e, (e)=>nZ.forEach(e.Nn, (s)=>n.persistence.referenceDelegate.addReference(t, e.targetId, s)).next(()=>nZ.forEach(e.xn, (s)=>n.persistence.referenceDelegate.removeReference(t, e.targetId, s)))));
                    } catch (s) {
                        if (!n7(s)) throw s;
                        g("LocalStore", "Failed to update sequence numbers: " + s);
                    }
                    for (const r of e){
                        const i = r.targetId;
                        if (!r.fromCache) {
                            const o = n.Un.get(i), a = o.snapshotVersion, c = o.withLastLimboFreeSnapshotVersion(a);
                            n.Un = n.Un.insert(i, c);
                        }
                    }
                })(s.localStore, i));
            }
            async function iJ(t, e) {
                const n = E(t);
                if (!n.currentUser.isEqual(e)) {
                    g("SyncEngine", "User change. New user:", e.toKey());
                    const s = await rs(n.localStore, e);
                    (n.currentUser = e), (function(t, e) {
                        t.Ko.forEach((t)=>{
                            t.forEach((t)=>{
                                t.reject(new S($.CANCELLED, e));
                            });
                        }), t.Ko.clear();
                    })(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(e, s.removedBatchIds, s.addedBatchIds), await iZ(n, s.Wn);
                }
            }
            function i3(t, e) {
                const n = E(t), s = n.Bo.get(e);
                if (s && s.ko) return ej().add(s.key);
                {
                    let r = ej();
                    const i = n.Fo.get(e);
                    if (!i) return r;
                    for (const o of i){
                        const a = n.Oo.get(o);
                        r = r.unionWith(a.view.Ro);
                    }
                    return r;
                }
            }
            async function i4(t, e) {
                const n = E(t), s = await rl(n.localStore, e.query, !0), r = e.view.No(s);
                return n.isPrimaryClient && i1(n, e.targetId, r.Do), r;
            }
            async function i6(t) {
                const e = E(t);
                return rf(e.localStore).then((t)=>iZ(e, t));
            }
            async function i7(t, e, n, s) {
                const r = E(t), i = await (function(t, e) {
                    const n = E(t), s = E(n.In);
                    return n.persistence.runTransaction("Lookup mutation documents", "readonly", (t)=>s.Xt(t, e).next((e)=>e ? n.Qn.Pn(t, e) : nZ.resolve(null)));
                })(r.localStore, e);
                null !== i ? ("pending" === n ? await ir(r.remoteStore) : "acknowledged" === n || "rejected" === n ? (iW(r, e, s || null), iH(r, e), (function(t, e) {
                    E(E(t).In).te(e);
                })(r.localStore, e)) : v(), await iZ(r, i)) : g("SyncEngine", "Cannot apply mutation batch with id: " + e);
            }
            async function i5(t, e) {
                const n = E(t);
                if ((oi(n), oo(n), !0 === e && !0 !== n.Qo)) {
                    const s = n.sharedClientState.getAllActiveQueryTargets(), r = await ot(n, s.toArray());
                    (n.Qo = !0), await im(n.remoteStore, !0);
                    for (const i of r)r1(n.remoteStore, i);
                } else if (!1 === e && !1 !== n.Qo) {
                    const o = [];
                    let a = Promise.resolve();
                    n.Fo.forEach((t, e)=>{
                        n.sharedClientState.isLocalQueryTarget(e) ? o.push(e) : (a = a.then(()=>(i0(n, e), rh(n.localStore, e, !0)))), r2(n.remoteStore, e);
                    }), await a, await ot(n, o), (function(t) {
                        const e = E(t);
                        e.Bo.forEach((t, n)=>{
                            r2(e.remoteStore, n);
                        }), e.Uo.us(), (e.Bo = new Map()), (e.Lo = new eF(to.comparator));
                    })(n), (n.Qo = !1), await im(n.remoteStore, !1);
                }
            }
            async function ot(t, e, n) {
                const s = E(t), r = [], i = [];
                for (const o of e){
                    let a;
                    const c = s.Fo.get(o);
                    if (c && 0 !== c.length) {
                        a = await ru(s.localStore, t2(c[0]));
                        for (const u of c){
                            const h = s.Oo.get(u), l = await i4(s, h);
                            l.snapshot && i.push(l.snapshot);
                        }
                    } else {
                        const d = await rd(s.localStore, o);
                        (a = await ru(s.localStore, d)), await iP(s, oe(d), o, !1);
                    }
                    r.push(a);
                }
                return s.$o.Rr(i), r;
            }
            function oe(t) {
                return tQ(t.path, t.collectionGroup, t.orderBy, t.filters, t.limit, "F", t.startAt, t.endAt);
            }
            function on(t) {
                const e = E(t);
                return E(E(e.localStore).persistence).pn();
            }
            async function os(t, e, n, s) {
                const r = E(t);
                if (r.Qo) g("SyncEngine", "Ignoring unexpected query state notification.");
                else if (r.Fo.has(e)) switch(n){
                    case "current":
                    case "not-current":
                        {
                            const i = await rf(r.localStore), o = e0.createSynthesizedRemoteEventForCurrentChange(e, "current" === n);
                            await iZ(r, i, o);
                            break;
                        }
                    case "rejected":
                        await rh(r.localStore, e, !0), i0(r, e, s);
                        break;
                    default:
                        v();
                }
            }
            async function or(t, e, n) {
                const s = oi(t);
                if (s.Qo) {
                    for (const r of e){
                        if (s.Fo.has(r)) {
                            g("SyncEngine", "Adding an already active target " + r);
                            continue;
                        }
                        const i = await rd(s.localStore, r), o = await ru(s.localStore, i);
                        await iP(s, oe(i), o.targetId, !1), r1(s.remoteStore, o);
                    }
                    for (const a of n)s.Fo.has(a) && (await rh(s.localStore, a, !1).then(()=>{
                        r2(s.remoteStore, a), i0(s, a);
                    }).catch(sO));
                }
            }
            function oi(t) {
                const e = E(t);
                return ((e.remoteStore.remoteSyncer.applyRemoteEvent = i9.bind(null, e)), (e.remoteStore.remoteSyncer.getRemoteKeysForTarget = i3.bind(null, e)), (e.remoteStore.remoteSyncer.rejectListen = iz.bind(null, e)), (e.$o.Rr = iN.bind(null, e.eventManager)), (e.$o.Go = ib.bind(null, e.eventManager)), e);
            }
            function oo(t) {
                const e = E(t);
                return ((e.remoteStore.remoteSyncer.applySuccessfulWrite = iQ.bind(null, e)), (e.remoteStore.remoteSyncer.rejectFailedWrite = iG.bind(null, e)), e);
            }
            function oa(t, e, n) {
                const s = E(t);
                (async function(t, e, n) {
                    try {
                        const s = await e.getMetadata();
                        if (await (function(t, e) {
                            const n = E(t), s = ns(e.createTime);
                            return n.persistence.runTransaction("hasNewerBundle", "readonly", (t)=>n.Je.getBundleMetadata(t, e.id)).then((t)=>!!t && t.createTime.compareTo(s) >= 0);
                        })(t.localStore, s)) return (await e.close(), void n._completeWith((function(t) {
                            return {
                                taskState: "Success",
                                documentsLoaded: t.totalDocuments,
                                bytesLoaded: t.totalBytes,
                                totalDocuments: t.totalDocuments,
                                totalBytes: t.totalBytes
                            };
                        })(s)));
                        n._updateProgress(iL(s));
                        const r = new iC(s, t.localStore, e.N);
                        let i = await e.zo();
                        for(; i;){
                            const o = await r.mo(i);
                            o && n._updateProgress(o), (i = await e.zo());
                        }
                        const a = await r.complete();
                        await iZ(t, a.En, void 0), await (function(t, e) {
                            const n = E(t);
                            return n.persistence.runTransaction("Save bundle", "readwrite", (t)=>n.Je.saveBundleMetadata(t, e));
                        })(t.localStore, s), n._completeWith(a.progress);
                    } catch (c) {
                        y("SyncEngine", `Loading bundle failed with ${c}`), n._failWith(c);
                    }
                })(s, e, n).then(()=>{
                    s.sharedClientState.notifyBundleLoaded();
                });
            }
            class oc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(t) {
                    (this.N = r9(t.databaseInfo.databaseId)), (this.sharedClientState = this.Ho(t)), (this.persistence = this.Jo(t)), await this.persistence.start(), (this.gcScheduler = this.Yo(t)), (this.localStore = this.Xo(t));
                }
                Yo(t) {
                    return null;
                }
                Xo(t) {
                    return rn(this.persistence, new rt(), t.initialUser, this.N);
                }
                Jo(t) {
                    return new rS(rN.Ns, this.N);
                }
                Ho(t) {
                    return new rR();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class ou extends (null && oc) {
                constructor(t, e, n){
                    super(), (this.Zo = t), (this.cacheSizeBytes = e), (this.forceOwnership = n), (this.synchronizeTabs = !1);
                }
                async initialize(t) {
                    await super.initialize(t), await rm(this.localStore), await this.Zo.initialize(this, t), await oo(this.Zo.syncEngine), await ir(this.Zo.remoteStore), await this.persistence.nn(()=>(this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(this.localStore), Promise.resolve()));
                }
                Xo(t) {
                    return rn(this.persistence, new rt(), t.initialUser, this.N);
                }
                Yo(t) {
                    const e = this.persistence.referenceDelegate.garbageCollector;
                    return new sB(e, t.asyncQueue);
                }
                Jo(t) {
                    const e = s4(t.databaseInfo.databaseId, t.databaseInfo.persistenceKey), n = void 0 !== this.cacheSizeBytes ? sb.withCacheSize(this.cacheSizeBytes) : sb.DEFAULT;
                    return new sZ(this.synchronizeTabs, e, t.clientId, n, t.asyncQueue, rU(), rB(), this.N, this.sharedClientState, !!this.forceOwnership);
                }
                Ho(t) {
                    return new rR();
                }
            }
            class oh extends (null && ou) {
                constructor(t, e){
                    super(t, e, !1), (this.Zo = t), (this.cacheSizeBytes = e), (this.synchronizeTabs = !0);
                }
                async initialize(t) {
                    await super.initialize(t);
                    const e = this.Zo.syncEngine;
                    this.sharedClientState instanceof rM && ((this.sharedClientState.syncEngine = {
                        _i: i7.bind(null, e),
                        mi: os.bind(null, e),
                        gi: or.bind(null, e),
                        pn: on.bind(null, e),
                        wi: i6.bind(null, e)
                    }), await this.sharedClientState.start()), await this.persistence.nn(async (t)=>{
                        await i5(this.Zo.syncEngine, t), this.gcScheduler && (t && !this.gcScheduler.started ? this.gcScheduler.start(this.localStore) : t || this.gcScheduler.stop());
                    });
                }
                Ho(t) {
                    const e = rU();
                    if (!rM.bt(e)) throw new S($.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
                    const n = s4(t.databaseInfo.databaseId, t.databaseInfo.persistenceKey);
                    return new rM(e, t.asyncQueue, n, t.clientId, t.initialUser);
                }
            }
            class ol {
                async initialize(t, e) {
                    this.localStore || ((this.localStore = t.localStore), (this.sharedClientState = t.sharedClientState), (this.datastore = this.createDatastore(e)), (this.remoteStore = this.createRemoteStore(e)), (this.eventManager = this.createEventManager(e)), (this.syncEngine = this.createSyncEngine(e, !t.synchronizeTabs)), (this.sharedClientState.onlineStateHandler = (t)=>iK(this.syncEngine, t, 1)), (this.remoteStore.remoteSyncer.handleCredentialChange = iJ.bind(null, this.syncEngine)), await im(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t) {
                    return new i$();
                }
                createDatastore(t) {
                    const e = r9(t.databaseInfo.databaseId), n = ((s = t.databaseInfo), new rP(s));
                    var s;
                    return (function(t, e, n) {
                        return new rj(t, e, n);
                    })(t.credentials, n, e);
                }
                createRemoteStore(t) {
                    return ((e = this.localStore), (n = this.datastore), (s = t.asyncQueue), (r = (t)=>iK(this.syncEngine, t, 0)), (i = rV.bt() ? new rV() : new rF()), new rW(e, n, s, r, i));
                    var e, n, s, r, i;
                }
                createSyncEngine(t, e) {
                    return (function(t, e, n, s, r, i, o) {
                        const a = new iq(t, e, n, s, r, i);
                        return o && (a.Qo = !0), a;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
                }
                terminate() {
                    return (async function(t) {
                        const e = E(t);
                        g("RemoteStore", "RemoteStore shutting down."), e.Wr.add(5), await rY(e), e.zr.shutdown(), e.Hr.set("Unknown");
                    })(this.remoteStore);
                }
            }
            function od(t, e = 10240) {
                let n = 0;
                return {
                    async read () {
                        if (n < t.byteLength) {
                            const s = {
                                value: t.slice(n, n + e),
                                done: !1
                            };
                            return (n += e), s;
                        }
                        return {
                            done: !0
                        };
                    },
                    async cancel () {},
                    releaseLock () {},
                    closed: Promise.reject("unimplemented")
                };
            }
            class of {
                constructor(t){
                    (this.observer = t), (this.muted = !1);
                }
                next(t) {
                    this.observer.next && this.tc(this.observer.next, t);
                }
                error(t) {
                    this.observer.error ? this.tc(this.observer.error, t) : console.error("Uncaught Error in snapshot listener:", t);
                }
                ec() {
                    this.muted = !0;
                }
                tc(t, e) {
                    this.muted || setTimeout(()=>{
                        this.muted || t(e);
                    }, 0);
                }
            }
            class om {
                constructor(t, e){
                    (this.nc = t), (this.N = e), (this.metadata = new N()), (this.buffer = new Uint8Array()), (this.sc = new TextDecoder("utf-8")), this.ic().then((t)=>{
                        t && t.wo() ? this.metadata.resolve(t.payload.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null == t ? void 0 : t.payload)}`));
                    }, (t)=>this.metadata.reject(t));
                }
                close() {
                    return this.nc.cancel();
                }
                async getMetadata() {
                    return this.metadata.promise;
                }
                async zo() {
                    return await this.getMetadata(), this.ic();
                }
                async ic() {
                    const t = await this.rc();
                    if (null === t) return null;
                    const e = this.sc.decode(t), n = Number(e);
                    isNaN(n) && this.oc(`length string (${e}) is not valid number`);
                    const s = await this.cc(n);
                    return new iD(JSON.parse(s), t.length + n);
                }
                ac() {
                    return this.buffer.findIndex((t)=>t === "{".charCodeAt(0));
                }
                async rc() {
                    for(; this.ac() < 0;){
                        if (await this.uc()) break;
                    }
                    if (0 === this.buffer.length) return null;
                    const t = this.ac();
                    t < 0 && this.oc("Reached the end of bundle when a length string is expected.");
                    const e = this.buffer.slice(0, t);
                    return (this.buffer = this.buffer.slice(t)), e;
                }
                async cc(t) {
                    for(; this.buffer.length < t;){
                        (await this.uc()) && this.oc("Reached the end of bundle when more is expected.");
                    }
                    const e = this.sc.decode(this.buffer.slice(0, t));
                    return (this.buffer = this.buffer.slice(t)), e;
                }
                oc(t) {
                    throw ((this.nc.cancel(), new Error(`Invalid bundle format: ${t}`)));
                }
                async uc() {
                    const t = await this.nc.read();
                    if (!t.done) {
                        const e = new Uint8Array(this.buffer.length + t.value.length);
                        e.set(this.buffer), e.set(t.value, this.buffer.length), (this.buffer = e);
                    }
                    return t.done;
                }
            }
            class og {
                constructor(t){
                    (this.datastore = t), (this.readVersions = new Map()), (this.mutations = []), (this.committed = !1), (this.lastWriteError = null), (this.writtenDocs = new Set());
                }
                async lookup(t) {
                    if ((this.ensureCommitNotCalled(), this.mutations.length > 0)) throw new S($.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
                    const e = await (async function(t, e) {
                        const n = E(t), s = nh(n.N) + "/documents", r = {
                            documents: e.map((t)=>no(n.N, t))
                        }, i = await n.Ki("BatchGetDocuments", s, r), o = new Map();
                        i.forEach((t)=>{
                            const e = nm(n.N, t);
                            o.set(e.key.toString(), e);
                        });
                        const a = [];
                        return (e.forEach((t)=>{
                            const e = o.get(t.toString());
                            I(!!e), a.push(e);
                        }), a);
                    })(this.datastore, t);
                    return e.forEach((t)=>this.recordVersion(t)), e;
                }
                set(t, e) {
                    this.write(e.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
                }
                update(t, e) {
                    try {
                        this.write(e.toMutation(t, this.preconditionForUpdate(t)));
                    } catch (n) {
                        this.lastWriteError = n;
                    }
                    this.writtenDocs.add(t.toString());
                }
                delete(t) {
                    this.write(new eD(t, this.precondition(t))), this.writtenDocs.add(t.toString());
                }
                async commit() {
                    if ((this.ensureCommitNotCalled(), this.lastWriteError)) throw this.lastWriteError;
                    const t = this.readVersions;
                    this.mutations.forEach((e)=>{
                        t.delete(e.key.toString());
                    }), t.forEach((t, e)=>{
                        const n = to.fromPath(e);
                        this.mutations.push(new ex(n, this.precondition(n)));
                    }), await (async function(t, e) {
                        const n = E(t), s = nh(n.N) + "/documents", r = {
                            writes: e.map((t)=>np(n.N, t))
                        };
                        await n.Li("Commit", s, r);
                    })(this.datastore, this.mutations), (this.committed = !0);
                }
                recordVersion(t) {
                    let e;
                    if (t.isFoundDocument()) e = t.version;
                    else {
                        if (!t.isNoDocument()) throw v();
                        e = O.min();
                    }
                    const n = this.readVersions.get(t.key.toString());
                    if (n) {
                        if (!e.isEqual(n)) throw new S($.ABORTED, "Document version changed between two reads.");
                    } else this.readVersions.set(t.key.toString(), e);
                }
                precondition(t) {
                    const e = this.readVersions.get(t.toString());
                    return !this.writtenDocs.has(t.toString()) && e ? ey.updateTime(e) : ey.none();
                }
                preconditionForUpdate(t) {
                    const e = this.readVersions.get(t.toString());
                    if (!this.writtenDocs.has(t.toString()) && e) {
                        if (e.isEqual(O.min())) throw new S($.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
                        return ey.updateTime(e);
                    }
                    return ey.exists(!0);
                }
                write(t) {
                    this.ensureCommitNotCalled(), this.mutations.push(t);
                }
                ensureCommitNotCalled() {}
            }
            class op {
                constructor(t, e, n, s){
                    (this.asyncQueue = t), (this.datastore = e), (this.updateFunction = n), (this.deferred = s), (this.hc = 5), (this.ar = new rK(this.asyncQueue, "transaction_retry"));
                }
                run() {
                    (this.hc -= 1), this.lc();
                }
                lc() {
                    this.ar.Xi(async ()=>{
                        const t = new og(this.datastore), e = this.fc(t);
                        e && e.then((e)=>{
                            this.asyncQueue.enqueueAndForget(()=>t.commit().then(()=>{
                                    this.deferred.resolve(e);
                                }).catch((t)=>{
                                    this.dc(t);
                                }));
                        }).catch((t)=>{
                            this.dc(t);
                        });
                    });
                }
                fc(t) {
                    try {
                        const e = this.updateFunction(t);
                        return !ts(e) && e.catch && e.then ? e : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
                    } catch (n) {
                        return this.deferred.reject(n), null;
                    }
                }
                dc(t) {
                    this.hc > 0 && this.wc(t) ? ((this.hc -= 1), this.asyncQueue.enqueueAndForget(()=>(this.lc(), Promise.resolve()))) : this.deferred.reject(t);
                }
                wc(t) {
                    if ("FirebaseError" === t.name) {
                        const e = t.code;
                        return ("aborted" === e || "failed-precondition" === e || !eM(e));
                    }
                    return !1;
                }
            }
            class oy {
                constructor(t, e, n){
                    (this.credentials = t), (this.asyncQueue = e), (this.databaseInfo = n), (this.user = h.UNAUTHENTICATED), (this.clientId = M.I()), (this.credentialListener = ()=>Promise.resolve()), this.credentials.start(e, async (t)=>{
                        g("FirestoreClient", "Received user=", t.uid), await this.credentialListener(t), (this.user = t);
                    });
                }
                async getConfiguration() {
                    return {
                        asyncQueue: this.asyncQueue,
                        databaseInfo: this.databaseInfo,
                        clientId: this.clientId,
                        credentials: this.credentials,
                        initialUser: this.user,
                        maxConcurrentLimboResolutions: 100
                    };
                }
                setCredentialChangeListener(t) {
                    this.credentialListener = t;
                }
                verifyNotTerminated() {
                    if (this.asyncQueue.isShuttingDown) throw new S($.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const t = new N();
                    return (this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && (await this.onlineComponents.terminate()), this.offlineComponents && (await this.offlineComponents.terminate()), this.credentials.shutdown(), t.resolve();
                        } catch (e) {
                            const n = iw(e, "Failed to shutdown persistence");
                            t.reject(n);
                        }
                    }), t.promise);
                }
            }
            async function ow(t, e) {
                t.asyncQueue.verifyOperationInProgress(), g("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await rs(e.localStore, t), (s = t));
                }), e.persistence.setDatabaseDeletedListener(()=>t.terminate()), (t.offlineComponents = e);
            }
            async function ov(t, e) {
                t.asyncQueue.verifyOperationInProgress();
                const n = await oI(t);
                g("FirestoreClient", "Initializing OnlineComponentProvider");
                const s = await t.getConfiguration();
                await e.initialize(n, s), t.setCredentialChangeListener((t)=>(async function(t, e) {
                        const n = E(t);
                        n.asyncQueue.verifyOperationInProgress(), g("RemoteStore", "RemoteStore received new credentials");
                        const s = r4(n);
                        n.Wr.add(3), await rY(n), s && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.Wr.delete(3), await r0(n);
                    })(e.remoteStore, t)), (t.onlineComponents = e);
            }
            async function oI(t) {
                return (t.offlineComponents || (g("FirestoreClient", "Using default OfflineComponentProvider"), await ow(t, new oc())), t.offlineComponents);
            }
            async function oT(t) {
                return (t.onlineComponents || (g("FirestoreClient", "Using default OnlineComponentProvider"), await ov(t, new ol())), t.onlineComponents);
            }
            function oE(t) {
                return oI(t).then((t)=>t.persistence);
            }
            function o$(t) {
                return oI(t).then((t)=>t.localStore);
            }
            function oS(t) {
                return oT(t).then((t)=>t.remoteStore);
            }
            function o8(t) {
                return oT(t).then((t)=>t.syncEngine);
            }
            async function oN(t) {
                const e = await oT(t), n = e.eventManager;
                return ((n.onListen = iO.bind(null, e.syncEngine)), (n.onUnlisten = iU.bind(null, e.syncEngine)), n);
            }
            function ob(t) {
                return t.asyncQueue.enqueue(async ()=>{
                    const e = await oE(t), n = await oS(t);
                    return (e.setNetworkEnabled(!0), (function(t) {
                        const e = E(t);
                        return e.Wr.delete(0), r0(e);
                    })(n));
                });
            }
            function oA(t) {
                return t.asyncQueue.enqueue(async ()=>{
                    const e = await oE(t), n = await oS(t);
                    return (e.setNetworkEnabled(!1), (async function(t) {
                        const e = E(t);
                        e.Wr.add(0), await rY(e), e.Hr.set("Offline");
                    })(n));
                });
            }
            function ok(t, e) {
                const n = new N();
                return (t.asyncQueue.enqueueAndForget(async ()=>(async function(t, e, n) {
                        try {
                            const s = await (function(t, e) {
                                const n = E(t);
                                return n.persistence.runTransaction("read document", "readonly", (t)=>n.Qn.An(t, e));
                            })(t, e);
                            s.isFoundDocument() ? n.resolve(s) : s.isNoDocument() ? n.resolve(null) : n.reject(new S($.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
                        } catch (r) {
                            const i = iw(r, `Failed to get document '${e} from cache`);
                            n.reject(i);
                        }
                    })(await o$(t), e, n)), n.promise);
            }
            function oD(t, e, n = {}) {
                const s = new N();
                return (t.asyncQueue.enqueueAndForget(async ()=>(function(t, e, n, s, r) {
                        const i = new of({
                            next: (i)=>{
                                e.enqueueAndForget(()=>i8(t, o));
                                const a = i.docs.has(n);
                                !a && i.fromCache ? r.reject(new S($.UNAVAILABLE, "Failed to get document because the client is offline.")) : a && i.fromCache && s && "server" === s.source ? r.reject(new S($.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : r.resolve(i);
                            },
                            error: (t)=>r.reject(t)
                        }), o = new ik(tG(n.path), i, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return iS(t, o);
                    })(await oN(t), t.asyncQueue, e, n, s)), s.promise);
            }
            function ox(t, e) {
                const n = new N();
                return (t.asyncQueue.enqueueAndForget(async ()=>(async function(t, e, n) {
                        try {
                            const s = await rl(t, e, !0), r = new iR(e, s.Gn), i = r.bo(s.documents), o = r.applyChanges(i, !1);
                            n.resolve(o.snapshot);
                        } catch (a) {
                            const c = iw(a, `Failed to execute query '${e} against cache`);
                            n.reject(c);
                        }
                    })(await o$(t), e, n)), n.promise);
            }
            function oC(t, e, n = {}) {
                const s = new N();
                return (t.asyncQueue.enqueueAndForget(async ()=>(function(t, e, n, s, r) {
                        const i = new of({
                            next: (n)=>{
                                e.enqueueAndForget(()=>i8(t, o)), n.fromCache && "server" === s.source ? r.reject(new S($.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : r.resolve(n);
                            },
                            error: (t)=>r.reject(t)
                        }), o = new ik(n, i, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return iS(t, o);
                    })(await oN(t), t.asyncQueue, e, n, s)), s.promise);
            }
            function oL(t, e) {
                const n = new of(e);
                return (t.asyncQueue.enqueueAndForget(async ()=>(function(t, e) {
                        E(t).so.add(e), e.next();
                    })(await oN(t), n)), ()=>{
                    n.ec(), t.asyncQueue.enqueueAndForget(async ()=>(function(t, e) {
                            E(t).so.delete(e);
                        })(await oN(t), n));
                });
            }
            function o_(t, e) {
                const n = new N();
                return (t.asyncQueue.enqueueAndForget(async ()=>{
                    const s = await (function(t) {
                        return oT(t).then((t)=>t.datastore);
                    })(t);
                    new op(t.asyncQueue, s, e, n).run();
                }), n.promise);
            }
            function oM(t, e, n, s) {
                const r = (function(t, e) {
                    let n;
                    n = "string" == typeof t ? new TextEncoder().encode(t) : t;
                    return (function(t, e) {
                        return new om(t, e);
                    })((function(t, e) {
                        if (t instanceof Uint8Array) return od(t, e);
                        if (t instanceof ArrayBuffer) return od(new Uint8Array(t), e);
                        if (t instanceof ReadableStream) return t.getReader();
                        throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
                    })(n), e);
                })(n, r9(e));
                t.asyncQueue.enqueueAndForget(async ()=>{
                    oa(await o8(t), r, s);
                });
            }
            function oR(t, e) {
                return t.asyncQueue.enqueue(async ()=>(function(t, e) {
                        const n = E(t);
                        return n.persistence.runTransaction("Get named query", "readonly", (t)=>n.Je.getNamedQuery(t, e));
                    })(await o$(t), e));
            }
            class oF {
                constructor(t, e, n, s, r, i, o, a){
                    (this.databaseId = t), (this.appId = e), (this.persistenceKey = n), (this.host = s), (this.ssl = r), (this.forceLongPolling = i), (this.autoDetectLongPolling = o), (this.useFetchStreams = a);
                }
            }
            class oV {
                constructor(t, e){
                    (this.projectId = t), (this.database = e || "(default)");
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(t) {
                    return (t instanceof oV && t.projectId === this.projectId && t.database === this.database);
                }
            }
            const oq = new Map();
            function oO(t, e, n) {
                if (!n) throw new S($.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
            }
            function oP(t, e, n, s) {
                if (!0 === e && !0 === s) throw new S($.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
            }
            function oU(t) {
                if (!to.isDocumentKey(t)) throw new S($.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`);
            }
            function oB(t) {
                if (to.isDocumentKey(t)) throw new S($.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
            }
            function o9(t) {
                if (void 0 === t) return "undefined";
                if (null === t) return "null";
                if ("string" == typeof t) return (t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t));
                if ("number" == typeof t || "boolean" == typeof t) return "" + t;
                if ("object" == typeof t) {
                    if (t instanceof Array) return "an array";
                    {
                        const e = (function(t) {
                            if (t.constructor) return t.constructor.name;
                            return null;
                        })(t);
                        return e ? `a custom ${e} object` : "an object";
                    }
                }
                return "function" == typeof t ? "a function" : v();
            }
            function oK(t, e) {
                if (("_delegate" in t && (t = t._delegate), !(t instanceof e))) {
                    if (e.name === t.constructor.name) throw new S($.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n = o9(t);
                        throw new S($.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
                    }
                }
                return t;
            }
            function oz(t, e) {
                if (e <= 0) throw new S($.INVALID_ARGUMENT, `Function ${t}() requires a positive number, but it was: ${e}.`);
            }
            class oQ {
                constructor(t){
                    var e;
                    if (void 0 === t.host) {
                        if (void 0 !== t.ssl) throw new S($.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        (this.host = "firestore.googleapis.com"), (this.ssl = true);
                    } else (this.host = t.host), (this.ssl = null === (e = t.ssl) || void 0 === e || e);
                    if (((this.credentials = t.credentials), (this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties), void 0 === t.cacheSizeBytes)) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new S($.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t.cacheSizeBytes;
                    }
                    (this.experimentalForceLongPolling = !!t.experimentalForceLongPolling), (this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling), (this.useFetchStreams = !!t.useFetchStreams), oP("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
                }
                isEqual(t) {
                    return (this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams);
                }
            }
            class oG {
                constructor(t, e){
                    (this._credentials = e), (this.type = "firestore-lite"), (this._persistenceKey = "(lite)"), (this._settings = new oQ({})), (this._settingsFrozen = !1), t instanceof oV ? (this._databaseId = t) : ((this._app = t), (this._databaseId = (function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new S($.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new oV(t.options.projectId);
                    })(t)));
                }
                get app() {
                    if (!this._app) throw new S($.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(t) {
                    if (this._settingsFrozen) throw new S($.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    (this._settings = new oQ(t)), void 0 !== t.credentials && (this._credentials = (function(t) {
                        if (!t) return new A();
                        switch(t.type){
                            case "gapi":
                                const e = t.client;
                                return (I(!("object" != typeof e || null === e || !e.auth || !e.auth.getAuthHeaderValueForFirstParty)), new C(e, t.sessionIndex || "0", t.iamToken || null));
                            case "provider":
                                return t.client;
                            default:
                                throw new S($.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    })(t.credentials));
                }
                _getSettings() {
                    return this._settings;
                }
                _freezeSettings() {
                    return (this._settingsFrozen = !0), this._settings;
                }
                _delete() {
                    return (this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask);
                }
                toJSON() {
                    return {
                        app: this._app,
                        databaseId: this._databaseId,
                        settings: this._settings
                    };
                }
                _terminate() {
                    return ((function(t) {
                        const e = oq.get(t);
                        e && (g("ComponentProvider", "Removing Datastore"), oq.delete(t), e.terminate());
                    })(this), Promise.resolve());
                }
            }
            function oj(t, e, n, s = {}) {
                var r;
                const i = (t = oK(t, oG))._getSettings();
                if (("firestore.googleapis.com" !== i.host && i.host !== e && y("Host has been set in both settings() and useEmulator(), emulator host will be used"), t._setSettings(Object.assign(Object.assign({}, i), {
                    host: `${e}:${n}`,
                    ssl: !1
                })), s.mockUserToken)) {
                    let o, a;
                    if ("string" == typeof s.mockUserToken) (o = s.mockUserToken), (a = h.MOCK_USER);
                    else {
                        o = createMockUserToken(s.mockUserToken, null === (r = t._app) || void 0 === r ? void 0 : r.options.projectId);
                        const c = s.mockUserToken.sub || s.mockUserToken.user_id;
                        if (!c) throw new S($.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
                        a = new h(c);
                    }
                    t._credentials = new k(new b(o, a));
                }
            }
            class oH {
                constructor(t, e, n){
                    (this.converter = e), (this._key = n), (this.type = "document"), (this.firestore = t);
                }
                get _path() {
                    return this._key.path;
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get path() {
                    return this._key.path.canonicalString();
                }
                get parent() {
                    return new o0(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(t) {
                    return new oH(this.firestore, t, this._key);
                }
            }
            class oW {
                constructor(t, e, n){
                    (this.converter = e), (this._query = n), (this.type = "query"), (this.firestore = t);
                }
                withConverter(t) {
                    return new oW(this.firestore, t, this._query);
                }
            }
            class o0 extends oW {
                constructor(t, e, n){
                    super(t, e, tG(n)), (this._path = n), (this.type = "collection");
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const t = this._path.popLast();
                    return t.isEmpty() ? null : new oH(this.firestore, null, new to(t));
                }
                withConverter(t) {
                    return new o0(this.firestore, t, this._path);
                }
            }
            function oY(t, e, ...n) {
                if (((t = (0, o.m9)(t)), oO("collection", "path", e), t instanceof oG)) {
                    const s = z.fromString(e, ...n);
                    return oB(s), new o0(t, null, s);
                }
                {
                    if (!(t instanceof oH || t instanceof o0)) throw new S($.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const r = t._path.child(z.fromString(e, ...n));
                    return (oB(r), new o0(t.firestore, null, r));
                }
            }
            function o1(t, e) {
                if (((t = oK(t, oG)), oO("collectionGroup", "collection id", e), e.indexOf("/") >= 0)) throw new S($.INVALID_ARGUMENT, `Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
                return new oW(t, null, (function(t) {
                    return new tz(z.emptyPath(), t);
                })(e));
            }
            function o2(t, e, ...n) {
                if (((t = getModularInstance(t)), 1 === arguments.length && (e = M.I()), oO("doc", "path", e), t instanceof oG)) {
                    const s = z.fromString(e, ...n);
                    return (oU(s), new oH(t, null, new to(s)));
                }
                {
                    if (!(t instanceof oH || t instanceof o0)) throw new S($.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const r = t._path.child(z.fromString(e, ...n));
                    return (oU(r), new oH(t.firestore, t instanceof o0 ? t.converter : null, new to(r)));
                }
            }
            function oX(t, e) {
                return ((t = getModularInstance(t)), (e = getModularInstance(e)), (t instanceof oH || t instanceof o0) && (e instanceof oH || e instanceof o0) && t.firestore === e.firestore && t.path === e.path && t.converter === e.converter);
            }
            function oZ(t, e) {
                return ((t = getModularInstance(t)), (e = getModularInstance(e)), t instanceof oW && e instanceof oW && t.firestore === e.firestore && tZ(t._query, e._query) && t.converter === e.converter);
            }
            class oJ {
                constructor(){
                    (this._c = Promise.resolve()), (this.mc = []), (this.gc = !1), (this.yc = []), (this.Tc = null), (this.Ec = !1), (this.Ic = !1), (this.Ac = []), (this.ar = new rK(this, "async_queue_retry")), (this.Rc = ()=>{
                        const t = rB();
                        t && g("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                    });
                    const t = rB();
                    t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.Rc);
                }
                get isShuttingDown() {
                    return this.gc;
                }
                enqueueAndForget(t) {
                    this.enqueue(t);
                }
                enqueueAndForgetEvenWhileRestricted(t) {
                    this.bc(), this.Pc(t);
                }
                enterRestrictedMode(t) {
                    if (!this.gc) {
                        (this.gc = !0), (this.Ic = t || !1);
                        const e = rB();
                        e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(t) {
                    if ((this.bc(), this.gc)) return new Promise(()=>{});
                    const e = new N();
                    return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t().then(e.resolve, e.reject), e.promise)).then(()=>e.promise);
                }
                enqueueRetryable(t) {
                    this.enqueueAndForget(()=>(this.mc.push(t), this.vc()));
                }
                async vc() {
                    if (0 !== this.mc.length) {
                        try {
                            await this.mc[0](), this.mc.shift(), this.ar.reset();
                        } catch (t) {
                            if (!n7(t)) throw t;
                            g("AsyncQueue", "Operation failed with retryable error: " + t);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(t) {
                    const e = this._c.then(()=>((this.Ec = !0), t().catch((t)=>{
                            (this.Tc = t), (this.Ec = !1);
                            const e = (function(t) {
                                let e = t.message || "";
                                t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack);
                                return e;
                            })(t);
                            throw ((p("INTERNAL UNHANDLED ERROR: ", e), t));
                        }).then((t)=>((this.Ec = !1), t))));
                    return (this._c = e), e;
                }
                enqueueAfterDelay(t, e, n) {
                    this.bc(), this.Ac.indexOf(t) > -1 && (e = 0);
                    const s = iy.createAndSchedule(this, t, e, n, (t)=>this.Vc(t));
                    return this.yc.push(s), s;
                }
                bc() {
                    this.Tc && v();
                }
                verifyOperationInProgress() {}
                async Sc() {
                    let t;
                    do {
                        (t = this._c), await t;
                    }while (t !== this._c)
                }
                Dc(t) {
                    for (const e of this.yc)if (e.timerId === t) return !0;
                    return !1;
                }
                Cc(t) {
                    return this.Sc().then(()=>{
                        this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs);
                        for (const e of this.yc)if ((e.skipDelay(), "all" !== t && e.timerId === t)) break;
                        return this.Sc();
                    });
                }
                Nc(t) {
                    this.Ac.push(t);
                }
                Vc(t) {
                    const e = this.yc.indexOf(t);
                    this.yc.splice(e, 1);
                }
            }
            function o3(t) {
                return (function(t, e) {
                    if ("object" != typeof t || null === t) return !1;
                    const n = t;
                    for (const s of e)if (s in n && "function" == typeof n[s]) return !0;
                    return !1;
                })(t, [
                    "next",
                    "error",
                    "complete"
                ]);
            }
            class o4 {
                constructor(){
                    (this._progressObserver = {}), (this._taskCompletionResolver = new N()), (this._lastProgress = {
                        taskState: "Running",
                        totalBytes: 0,
                        totalDocuments: 0,
                        bytesLoaded: 0,
                        documentsLoaded: 0
                    });
                }
                onProgress(t, e, n) {
                    this._progressObserver = {
                        next: t,
                        error: e,
                        complete: n
                    };
                }
                catch(t) {
                    return this._taskCompletionResolver.promise.catch(t);
                }
                then(t, e) {
                    return this._taskCompletionResolver.promise.then(t, e);
                }
                _completeWith(t) {
                    this._updateProgress(t), this._progressObserver.complete && this._progressObserver.complete(), this._taskCompletionResolver.resolve(t);
                }
                _failWith(t) {
                    (this._lastProgress.taskState = "Error"), this._progressObserver.next && this._progressObserver.next(this._lastProgress), this._progressObserver.error && this._progressObserver.error(t), this._taskCompletionResolver.reject(t);
                }
                _updateProgress(t) {
                    (this._lastProgress = t), this._progressObserver.next && this._progressObserver.next(t);
                }
            }
            const o6 = null && -1;
            class o7 extends oG {
                constructor(t, e){
                    super(t, e), (this.type = "firestore"), (this._queue = new oJ()), (this._persistenceKey = "name" in t ? t.name : "[DEFAULT]");
                }
                _terminate() {
                    return (this._firestoreClient || an(this), this._firestoreClient.terminate());
                }
            }
            function o5(t, e) {
                const n = _getProvider(t, "firestore");
                if (n.isInitialized()) {
                    const s = n.getImmediate(), r = n.getOptions();
                    if (deepEqual(r, e)) return s;
                    throw new S($.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
                }
                if (void 0 !== e.cacheSizeBytes && -1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576) throw new S($.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                return n.initialize({
                    options: e
                });
            }
            function at(t = getApp()) {
                return _getProvider(t, "firestore").getImmediate();
            }
            function ae(t) {
                return (t._firestoreClient || an(t), t._firestoreClient.verifyNotTerminated(), t._firestoreClient);
            }
            function an(t) {
                var e;
                const n = t._freezeSettings(), s = (function(t, e, n, s) {
                    return new oF(t, e, n, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams);
                })(t._databaseId, (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, n);
                t._firestoreClient = new oy(t._credentials, t._queue, s);
            }
            function as(t, e) {
                af((t = oK(t, o7)));
                const n = ae(t), s = t._freezeSettings(), r = new ol();
                return ai(n, r, new ou(r, s.cacheSizeBytes, null == e ? void 0 : e.forceOwnership));
            }
            function ar(t) {
                af((t = oK(t, o7)));
                const e = ae(t), n = t._freezeSettings(), s = new ol();
                return ai(e, s, new oh(s, n.cacheSizeBytes));
            }
            function ai(t, e, n) {
                const s = new N();
                return t.asyncQueue.enqueue(async ()=>{
                    try {
                        await ow(t, n), await ov(t, e), s.resolve();
                    } catch (r) {
                        if (!((function(t) {
                            if ("FirebaseError" === t.name) return (t.code === $.FAILED_PRECONDITION || t.code === $.UNIMPLEMENTED);
                            if ("undefined" != typeof DOMException && t instanceof DOMException) return (22 === t.code || 20 === t.code || 11 === t.code);
                            return !0;
                        })(r))) throw r;
                        console.warn("Error enabling offline persistence. Falling back to persistence disabled: " + r), s.reject(r);
                    }
                }).then(()=>s.promise);
            }
            function ao(t) {
                if (t._initialized && !t._terminated) throw new S($.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
                const e = new N();
                return (t._queue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                    try {
                        await (async function(t) {
                            if (!n3.bt()) return Promise.resolve();
                            const e = t + "main";
                            await n3.delete(e);
                        })(s4(t._databaseId, t._persistenceKey)), e.resolve();
                    } catch (n) {
                        e.reject(n);
                    }
                }), e.promise);
            }
            function aa(t) {
                return (function(t) {
                    const e = new N();
                    return (t.asyncQueue.enqueueAndForget(async ()=>ij(await o8(t), e)), e.promise);
                })(ae((t = oK(t, o7))));
            }
            function ac(t) {
                return ob(ae((t = oK(t, o7))));
            }
            function au(t) {
                return oA(ae((t = oK(t, o7))));
            }
            function ah(t) {
                return (_removeServiceInstance(t.app, "firestore"), t._delete());
            }
            function al(t, e) {
                const n = ae((t = oK(t, o7))), s = new o4();
                return oM(n, t._databaseId, e, s), s;
            }
            function ad(t, e) {
                return oR(ae((t = oK(t, o7))), e).then((e)=>e ? new oW(t, null, e.query) : null);
            }
            function af(t) {
                if (t._initialized || t._terminated) throw new S($.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
            }
            class am {
                constructor(...t){
                    for(let e = 0; e < t.length; ++e)if (0 === t[e].length) throw new S($.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new G(t);
                }
                isEqual(t) {
                    return this._internalPath.isEqual(t._internalPath);
                }
            }
            function ag() {
                return new am("__name__");
            }
            class ap {
                constructor(t){
                    this._byteString = t;
                }
                static fromBase64String(t) {
                    try {
                        return new ap(W.fromBase64String(t));
                    } catch (e) {
                        throw new S($.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e);
                    }
                }
                static fromUint8Array(t) {
                    return new ap(W.fromUint8Array(t));
                }
                toBase64() {
                    return this._byteString.toBase64();
                }
                toUint8Array() {
                    return this._byteString.toUint8Array();
                }
                toString() {
                    return "Bytes(base64: " + this.toBase64() + ")";
                }
                isEqual(t) {
                    return this._byteString.isEqual(t._byteString);
                }
            }
            class ay {
                constructor(t){
                    this._methodName = t;
                }
            }
            class aw {
                constructor(t, e){
                    if (!isFinite(t) || t < -90 || t > 90) throw new S($.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t);
                    if (!isFinite(e) || e < -180 || e > 180) throw new S($.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
                    (this._lat = t), (this._long = e);
                }
                get latitude() {
                    return this._lat;
                }
                get longitude() {
                    return this._long;
                }
                isEqual(t) {
                    return this._lat === t._lat && this._long === t._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(t) {
                    return R(this._lat, t._lat) || R(this._long, t._long);
                }
            }
            const av = /^__.*__$/;
            class aI {
                constructor(t, e, n){
                    (this.data = t), (this.fieldMask = e), (this.fieldTransforms = n);
                }
                toMutation(t, e) {
                    return null !== this.fieldMask ? new eN(t, this.data, this.fieldMask, e, this.fieldTransforms) : new e8(t, this.data, e, this.fieldTransforms);
                }
            }
            class aT {
                constructor(t, e, n){
                    (this.data = t), (this.fieldMask = e), (this.fieldTransforms = n);
                }
                toMutation(t, e) {
                    return new eN(t, this.data, this.fieldMask, e, this.fieldTransforms);
                }
            }
            function aE(t) {
                switch(t){
                    case 0:
                    case 2:
                    case 1:
                        return !0;
                    case 3:
                    case 4:
                        return !1;
                    default:
                        throw v();
                }
            }
            class a$ {
                constructor(t, e, n, s, r, i){
                    (this.settings = t), (this.databaseId = e), (this.N = n), (this.ignoreUndefinedProperties = s), void 0 === r && this.xc(), (this.fieldTransforms = r || []), (this.fieldMask = i || []);
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(t) {
                    return new a$(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(t) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.Mc(t), s;
                }
                Lc(t) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.xc(), s;
                }
                Bc(t) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(t) {
                    return aB(t, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(t) {
                    return (void 0 !== this.fieldMask.find((e)=>t.isPrefixOf(e)) || void 0 !== this.fieldTransforms.find((e)=>t.isPrefixOf(e.field)));
                }
                xc() {
                    if (this.path) for(let t = 0; t < this.path.length; t++)this.Mc(this.path.get(t));
                }
                Mc(t) {
                    if (0 === t.length) throw this.Uc("Document fields must not be empty");
                    if (aE(this.kc) && av.test(t)) throw this.Uc('Document fields cannot begin and end with "__"');
                }
            }
            class aS {
                constructor(t, e, n){
                    (this.databaseId = t), (this.ignoreUndefinedProperties = e), (this.N = n || r9(t));
                }
                jc(t, e, n, s = !1) {
                    return new a$({
                        kc: t,
                        methodName: e,
                        Kc: n,
                        path: G.emptyPath(),
                        Fc: !1,
                        qc: s
                    }, this.databaseId, this.N, this.ignoreUndefinedProperties);
                }
            }
            function a8(t) {
                const e = t._freezeSettings(), n = r9(t._databaseId);
                return new aS(t._databaseId, !!e.ignoreUndefinedProperties, n);
            }
            function aN(t, e, n, s, r, i = {}) {
                const o = t.jc(i.merge || i.mergeFields ? 2 : 0, e, n, r);
                aq("Data must be an object, but it was:", o, s);
                const a = aF(s, o);
                let c, u;
                if (i.merge) (c = new j(o.fieldMask)), (u = o.fieldTransforms);
                else if (i.mergeFields) {
                    const h = [];
                    for (const l of i.mergeFields){
                        const d = aO(e, l, n);
                        if (!o.contains(d)) throw new S($.INVALID_ARGUMENT, `Field '${d}' is specified in your field mask but missing from your input data.`);
                        a9(h, d) || h.push(d);
                    }
                    (c = new j(h)), (u = o.fieldTransforms.filter((t)=>c.covers(t.field)));
                } else (c = null), (u = o.fieldTransforms);
                return new aI(new tT(a), c, u);
            }
            class ab extends (null && ay) {
                _toFieldTransform(t) {
                    if (2 !== t.kc) throw 1 === t.kc ? t.Uc(`${this._methodName}() can only appear at the top level of your update data`) : t.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return t.fieldMask.push(t.path), null;
                }
                isEqual(t) {
                    return t instanceof ab;
                }
            }
            function aA(t, e, n) {
                return new a$({
                    kc: 3,
                    Kc: e.settings.Kc,
                    methodName: t._methodName,
                    Fc: n
                }, e.databaseId, e.N, e.ignoreUndefinedProperties);
            }
            class ak extends (null && ay) {
                _toFieldTransform(t) {
                    return new em(t.path, new eo());
                }
                isEqual(t) {
                    return t instanceof ak;
                }
            }
            class aD extends (null && ay) {
                constructor(t, e){
                    super(t), (this.Qc = e);
                }
                _toFieldTransform(t) {
                    const e = aA(this, t, !0), n = this.Qc.map((t)=>aR(t, e)), s = new ea(n);
                    return new em(t.path, s);
                }
                isEqual(t) {
                    return this === t;
                }
            }
            class ax extends (null && ay) {
                constructor(t, e){
                    super(t), (this.Qc = e);
                }
                _toFieldTransform(t) {
                    const e = aA(this, t, !0), n = this.Qc.map((t)=>aR(t, e)), s = new eu(n);
                    return new em(t.path, s);
                }
                isEqual(t) {
                    return this === t;
                }
            }
            class aC extends (null && ay) {
                constructor(t, e){
                    super(t), (this.Wc = e);
                }
                _toFieldTransform(t) {
                    const e = new el(t.N, ee(t.N, this.Wc));
                    return new em(t.path, e);
                }
                isEqual(t) {
                    return this === t;
                }
            }
            function aL(t, e, n, s) {
                const r = t.jc(1, e, n);
                aq("Data must be an object, but it was:", r, s);
                const i = [], o = tT.empty();
                U(s, (t, s)=>{
                    const a = aU(e, t, n);
                    s = getModularInstance(s);
                    const c = r.Lc(a);
                    if (s instanceof ab) i.push(a);
                    else {
                        const u = aR(s, c);
                        null != u && (i.push(a), o.set(a, u));
                    }
                });
                const a = new j(i);
                return new aT(o, a, r.fieldTransforms);
            }
            function a_(t, e, n, s, r, i) {
                const o = t.jc(1, e, n), a = [
                    aO(e, s, n)
                ], c = [
                    r
                ];
                if (i.length % 2 != 0) throw new S($.INVALID_ARGUMENT, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
                for(let u = 0; u < i.length; u += 2)a.push(aO(e, i[u])), c.push(i[u + 1]);
                const h = [], l = tT.empty();
                for(let d = a.length - 1; d >= 0; --d)if (!a9(h, a[d])) {
                    const f = a[d];
                    let m = c[d];
                    m = getModularInstance(m);
                    const g = o.Lc(f);
                    if (m instanceof ab) h.push(f);
                    else {
                        const p = aR(m, g);
                        null != p && (h.push(f), l.set(f, p));
                    }
                }
                const y = new j(h);
                return new aT(l, y, o.fieldTransforms);
            }
            function aM(t, e, n, s = !1) {
                return aR(n, t.jc(s ? 4 : 3, e));
            }
            function aR(t, e) {
                if (aV((t = getModularInstance(t)))) return aq("Unsupported field value:", e, t), aF(t, e);
                if (t instanceof ay) return ((function(t, e) {
                    if (!aE(e.kc)) throw e.Uc(`${t._methodName}() can only be used with update() and set()`);
                    if (!e.path) throw e.Uc(`${t._methodName}() is not currently supported inside arrays`);
                    const n = t._toFieldTransform(e);
                    n && e.fieldTransforms.push(n);
                })(t, e), null);
                if (void 0 === t && e.ignoreUndefinedProperties) return null;
                if ((e.path && e.fieldMask.push(e.path), t instanceof Array)) {
                    if (e.settings.Fc && 4 !== e.kc) throw e.Uc("Nested arrays are not supported");
                    return (function(t, e) {
                        const n = [];
                        let s = 0;
                        for (const r of t){
                            let i = aR(r, e.Bc(s));
                            null == i && (i = {
                                nullValue: "NULL_VALUE"
                            }), n.push(i), s++;
                        }
                        return {
                            arrayValue: {
                                values: n
                            }
                        };
                    })(t, e);
                }
                return (function(t, e) {
                    if (null === (t = getModularInstance(t))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof t) return ee(e.N, t);
                    if ("boolean" == typeof t) return {
                        booleanValue: t
                    };
                    if ("string" == typeof t) return {
                        stringValue: t
                    };
                    if (t instanceof Date) {
                        const n = q.fromDate(t);
                        return {
                            timestampValue: nt(e.N, n)
                        };
                    }
                    if (t instanceof q) {
                        const s = new q(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));
                        return {
                            timestampValue: nt(e.N, s)
                        };
                    }
                    if (t instanceof aw) return {
                        geoPointValue: {
                            latitude: t.latitude,
                            longitude: t.longitude
                        }
                    };
                    if (t instanceof ap) return {
                        bytesValue: ne(e.N, t._byteString)
                    };
                    if (t instanceof oH) {
                        const r = e.databaseId, i = t.firestore._databaseId;
                        if (!i.isEqual(r)) throw e.Uc(`Document reference is for database ${i.projectId}/${i.database} but should be for database ${r.projectId}/${r.database}`);
                        return {
                            referenceValue: nr(t.firestore._databaseId || e.databaseId, t._key.path)
                        };
                    }
                    throw e.Uc(`Unsupported field value: ${o9(t)}`);
                })(t, e);
            }
            function aF(t, e) {
                const n = {};
                return (B(t) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : U(t, (t, s)=>{
                    const r = aR(s, e.Oc(t));
                    null != r && (n[t] = r);
                }), {
                    mapValue: {
                        fields: n
                    }
                });
            }
            function aV(t) {
                return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof q || t instanceof aw || t instanceof ap || t instanceof oH || t instanceof ay);
            }
            function aq(t, e, n) {
                if (!aV(n) || !(function(t) {
                    return ("object" == typeof t && null !== t && (Object.getPrototypeOf(t) === Object.prototype || null === Object.getPrototypeOf(t)));
                })(n)) {
                    const s = o9(n);
                    throw "an object" === s ? e.Uc(t + " a custom object") : e.Uc(t + " " + s);
                }
            }
            function aO(t, e, n) {
                if ((e = getModularInstance(e)) instanceof am) return e._internalPath;
                if ("string" == typeof e) return aU(t, e);
                throw aB("Field path arguments must be of type string or FieldPath.", t, !1, void 0, n);
            }
            const aP = new RegExp("[~\\*/\\[\\]]");
            function aU(t, e, n) {
                if (e.search(aP) >= 0) throw aB(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, n);
                try {
                    return new am(...e.split("."))._internalPath;
                } catch (s) {
                    throw aB(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, n);
                }
            }
            function aB(t, e, n, s, r) {
                const i = s && !s.isEmpty(), o = void 0 !== r;
                let a = `Function ${e}() called with invalid data`;
                n && (a += " (via `toFirestore()`)"), (a += ". ");
                let c = "";
                return ((i || o) && ((c += " (found"), i && (c += ` in field ${s}`), o && (c += ` in document ${r}`), (c += ")")), new S($.INVALID_ARGUMENT, a + t + c));
            }
            function a9(t, e) {
                return t.some((t)=>t.isEqual(e));
            }
            class aK {
                constructor(t, e, n, s, r){
                    (this._firestore = t), (this._userDataWriter = e), (this._key = n), (this._document = s), (this._converter = r);
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get ref() {
                    return new oH(this._firestore, this._converter, this._key);
                }
                exists() {
                    return null !== this._document;
                }
                data() {
                    if (this._document) {
                        if (this._converter) {
                            const t = new az(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(t) {
                    if (this._document) {
                        const e = this._document.data.field(aQ("DocumentSnapshot.get", t));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            class az extends aK {
                data() {
                    return super.data();
                }
            }
            function aQ(t, e) {
                return "string" == typeof e ? aU(t, e) : e instanceof am ? e._internalPath : e._delegate._internalPath;
            }
            class aG {
                constructor(t, e){
                    (this.hasPendingWrites = t), (this.fromCache = e);
                }
                isEqual(t) {
                    return (this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache);
                }
            }
            class aj extends aK {
                constructor(t, e, n, s, r, i){
                    super(t, e, n, s, i), (this._firestore = t), (this._firestoreImpl = t), (this.metadata = r);
                }
                exists() {
                    return super.exists();
                }
                data(t = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const e = new aH(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(e, t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
                    }
                }
                get(t, e = {}) {
                    if (this._document) {
                        const n = this._document.data.field(aQ("DocumentSnapshot.get", t));
                        if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
                    }
                }
            }
            class aH extends aj {
                data(t = {}) {
                    return super.data(t);
                }
            }
            class aW {
                constructor(t, e, n, s){
                    (this._firestore = t), (this._userDataWriter = e), (this._snapshot = s), (this.metadata = new aG(s.hasPendingWrites, s.fromCache)), (this.query = n);
                }
                get docs() {
                    const t = [];
                    return this.forEach((e)=>t.push(e)), t;
                }
                get size() {
                    return this._snapshot.docs.size;
                }
                get empty() {
                    return 0 === this.size;
                }
                forEach(t, e) {
                    this._snapshot.docs.forEach((n)=>{
                        t.call(e, new aH(this._firestore, this._userDataWriter, n.key, n, new aG(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(t = {}) {
                    const e = !!t.includeMetadataChanges;
                    if (e && this._snapshot.excludesMetadataChanges) throw new S($.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return ((this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e) || ((this._cachedChanges = (function(t, e) {
                        if (t._snapshot.oldDocs.isEmpty()) {
                            let n = 0;
                            return t._snapshot.docChanges.map((e)=>({
                                    type: "added",
                                    doc: new aH(t._firestore, t._userDataWriter, e.doc.key, e.doc, new aG(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter),
                                    oldIndex: -1,
                                    newIndex: n++
                                }));
                        }
                        {
                            let s = t._snapshot.oldDocs;
                            return t._snapshot.docChanges.filter((t)=>e || 3 !== t.type).map((e)=>{
                                const n = new aH(t._firestore, t._userDataWriter, e.doc.key, e.doc, new aG(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                                let r = -1, i = -1;
                                return (0 !== e.type && ((r = s.indexOf(e.doc.key)), (s = s.delete(e.doc.key))), 1 !== e.type && ((s = s.add(e.doc)), (i = s.indexOf(e.doc.key))), {
                                    type: a0(e.type),
                                    doc: n,
                                    oldIndex: r,
                                    newIndex: i
                                });
                            });
                        }
                    })(this, e)), (this._cachedChangesIncludeMetadataChanges = e)), this._cachedChanges);
                }
            }
            function a0(t) {
                switch(t){
                    case 0:
                        return "added";
                    case 2:
                    case 3:
                        return "modified";
                    case 1:
                        return "removed";
                    default:
                        return v();
                }
            }
            function aY(t, e) {
                return t instanceof aj && e instanceof aj ? t._firestore === e._firestore && t._key.isEqual(e._key) && (null === t._document ? null === e._document : t._document.isEqual(e._document)) && t._converter === e._converter : t instanceof aW && e instanceof aW && t._firestore === e._firestore && oZ(t.query, e.query) && t.metadata.isEqual(e.metadata) && t._snapshot.isEqual(e._snapshot);
            }
            function a1(t) {
                if (tH(t) && 0 === t.explicitOrderBy.length) throw new S($.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
            }
            class a2 {
            }
            function aX(t, ...e) {
                for (const n of e)t = n._apply(t);
                return t;
            }
            class aZ extends (null && a2) {
                constructor(t, e, n){
                    super(), (this.Gc = t), (this.zc = e), (this.Hc = n), (this.type = "where");
                }
                _apply(t) {
                    const e = a8(t.firestore), n = (function(t, e, n, s, r, i, o) {
                        let a;
                        if (r.isKeyField()) {
                            if ("array-contains" === i || "array-contains-any" === i) throw new S($.INVALID_ARGUMENT, `Invalid Query. You can't perform '${i}' queries on FieldPath.documentId().`);
                            if ("in" === i || "not-in" === i) {
                                cc(o, i);
                                const c = [];
                                for (const u of o)c.push(ca(s, t, u));
                                a = {
                                    arrayValue: {
                                        values: c
                                    }
                                };
                            } else a = ca(s, t, o);
                        } else ("in" !== i && "not-in" !== i && "array-contains-any" !== i) || cc(o, i), (a = aM(n, e, o, "in" === i || "not-in" === i));
                        const h = tD.create(r, i, a);
                        return ((function(t, e) {
                            if (e.v()) {
                                const n = t0(t);
                                if (null !== n && !n.isEqual(e.field)) throw new S($.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${n.toString()}' and '${e.field.toString()}'`);
                                const s = tW(t);
                                null !== s && cu(t, e.field, s);
                            }
                            const r = (function(t, e) {
                                for (const n of t.filters)if (e.indexOf(n.op) >= 0) return n.op;
                                return null;
                            })(t, (function(t) {
                                switch(t){
                                    case "!=":
                                        return [
                                            "!=",
                                            "not-in", 
                                        ];
                                    case "array-contains":
                                        return [
                                            "array-contains",
                                            "array-contains-any",
                                            "not-in", 
                                        ];
                                    case "in":
                                        return [
                                            "array-contains-any",
                                            "in",
                                            "not-in", 
                                        ];
                                    case "array-contains-any":
                                        return [
                                            "array-contains",
                                            "array-contains-any",
                                            "in",
                                            "not-in", 
                                        ];
                                    case "not-in":
                                        return [
                                            "array-contains",
                                            "array-contains-any",
                                            "in",
                                            "not-in",
                                            "!=", 
                                        ];
                                    default:
                                        return [];
                                }
                            })(e.op));
                            if (null !== r) throw r === e.op ? new S($.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new S($.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${r.toString()}' filters.`);
                        })(t, h), h);
                    })(t._query, "where", e, t.firestore._databaseId, this.Gc, this.zc, this.Hc);
                    return new oW(t.firestore, t.converter, (function(t, e) {
                        const n = t.filters.concat([
                            e
                        ]);
                        return new tz(t.path, t.collectionGroup, t.explicitOrderBy.slice(), n, t.limit, t.limitType, t.startAt, t.endAt);
                    })(t._query, n));
                }
            }
            function aJ(t, e, n) {
                const s = e, r = aQ("where", t);
                return new aZ(r, s, n);
            }
            class a3 extends (null && a2) {
                constructor(t, e){
                    super(), (this.Gc = t), (this.Jc = e), (this.type = "orderBy");
                }
                _apply(t) {
                    const e = (function(t, e, n) {
                        if (null !== t.startAt) throw new S($.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
                        if (null !== t.endAt) throw new S($.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
                        const s = new tU(e, n);
                        return ((function(t, e) {
                            if (null === tW(t)) {
                                const n = t0(t);
                                null !== n && cu(t, n, e.field);
                            }
                        })(t, s), s);
                    })(t._query, this.Gc, this.Jc);
                    return new oW(t.firestore, t.converter, (function(t, e) {
                        const n = t.explicitOrderBy.concat([
                            e
                        ]);
                        return new tz(t.path, t.collectionGroup, n, t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
                    })(t._query, e));
                }
            }
            function a4(t, e = "asc") {
                const n = e, s = aQ("orderBy", t);
                return new a3(s, n);
            }
            class a6 extends (null && a2) {
                constructor(t, e, n){
                    super(), (this.type = t), (this.Yc = e), (this.Xc = n);
                }
                _apply(t) {
                    return new oW(t.firestore, t.converter, tX(t._query, this.Yc, this.Xc));
                }
            }
            function a7(t) {
                return oz("limit", t), new a6("limit", t, "F");
            }
            function a5(t) {
                return (oz("limitToLast", t), new a6("limitToLast", t, "L"));
            }
            class ct extends (null && a2) {
                constructor(t, e, n){
                    super(), (this.type = t), (this.Zc = e), (this.ta = n);
                }
                _apply(t) {
                    const e = co(t, this.type, this.Zc, this.ta);
                    return new oW(t.firestore, t.converter, (function(t, e) {
                        return new tz(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, e, t.endAt);
                    })(t._query, e));
                }
            }
            function ce(...t) {
                return new ct("startAt", t, !0);
            }
            function cn(...t) {
                return new ct("startAfter", t, !1);
            }
            class cs extends (null && a2) {
                constructor(t, e, n){
                    super(), (this.type = t), (this.Zc = e), (this.ta = n);
                }
                _apply(t) {
                    const e = co(t, this.type, this.Zc, this.ta);
                    return new oW(t.firestore, t.converter, (function(t, e) {
                        return new tz(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, e);
                    })(t._query, e));
                }
            }
            function cr(...t) {
                return new cs("endBefore", t, !0);
            }
            function ci(...t) {
                return new cs("endAt", t, !1);
            }
            function co(t, e, n, s) {
                if (((n[0] = getModularInstance(n[0])), n[0] instanceof aK)) return (function(t, e, n, s, r) {
                    if (!s) throw new S($.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n}().`);
                    const i = [];
                    for (const o of t1(t))if (o.field.isKeyField()) i.push(tm(e, s.key));
                    else {
                        const a = s.data.field(o.field);
                        if (tt(a)) throw new S($.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + o.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
                        if (null === a) {
                            const c = o.field.canonicalString();
                            throw new S($.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${c}' (used as the orderBy) does not exist.`);
                        }
                        i.push(a);
                    }
                    return new tO(i, r);
                })(t._query, t.firestore._databaseId, e, n[0]._document, s);
                {
                    const r = a8(t.firestore);
                    return (function(t, e, n, s, r, i) {
                        const o = t.explicitOrderBy;
                        if (r.length > o.length) throw new S($.INVALID_ARGUMENT, `Too many arguments provided to ${s}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
                        const a = [];
                        for(let c = 0; c < r.length; c++){
                            const u = r[c];
                            if (o[c].field.isKeyField()) {
                                if ("string" != typeof u) throw new S($.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${s}(), but got a ${typeof u}`);
                                if (!tY(t) && -1 !== u.indexOf("/")) throw new S($.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to ${s}() must be a plain document ID, but '${u}' contains a slash.`);
                                const h = t.path.child(z.fromString(u));
                                if (!to.isDocumentKey(h)) throw new S($.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to ${s}() must result in a valid document path, but '${h}' is not because it contains an odd number of segments.`);
                                const l = new to(h);
                                a.push(tm(e, l));
                            } else {
                                const d = aM(n, s, u);
                                a.push(d);
                            }
                        }
                        return new tO(a, i);
                    })(t._query, t.firestore._databaseId, r, e, n, s);
                }
            }
            function ca(t, e, n) {
                if ("string" == typeof (n = getModularInstance(n))) {
                    if ("" === n) throw new S($.INVALID_ARGUMENT, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");
                    if (!tY(e) && -1 !== n.indexOf("/")) throw new S($.INVALID_ARGUMENT, `Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
                    const s = e.path.child(z.fromString(n));
                    if (!to.isDocumentKey(s)) throw new S($.INVALID_ARGUMENT, `Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);
                    return tm(t, new to(s));
                }
                if (n instanceof oH) return tm(t, n._key);
                throw new S($.INVALID_ARGUMENT, `Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: ${o9(n)}.`);
            }
            function cc(t, e) {
                if (!Array.isArray(t) || 0 === t.length) throw new S($.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
                if (t.length > 10) throw new S($.INVALID_ARGUMENT, `Invalid Query. '${e.toString()}' filters support a maximum of 10 elements in the value array.`);
            }
            function cu(t, e, n) {
                if (!n.isEqual(e)) throw new S($.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`);
            }
            class ch {
                convertValue(t, e = "none") {
                    switch(ta(t)){
                        case 0:
                            return null;
                        case 1:
                            return t.booleanValue;
                        case 2:
                            return Z(t.integerValue || t.doubleValue);
                        case 3:
                            return this.convertTimestamp(t.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(t, e);
                        case 5:
                            return t.stringValue;
                        case 6:
                            return this.convertBytes(J(t.bytesValue));
                        case 7:
                            return this.convertReference(t.referenceValue);
                        case 8:
                            return this.convertGeoPoint(t.geoPointValue);
                        case 9:
                            return this.convertArray(t.arrayValue, e);
                        case 10:
                            return this.convertObject(t.mapValue, e);
                        default:
                            throw v();
                    }
                }
                convertObject(t, e) {
                    const n = {};
                    return (U(t.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e);
                    }), n);
                }
                convertGeoPoint(t) {
                    return new aw(Z(t.latitude), Z(t.longitude));
                }
                convertArray(t, e) {
                    return (t.values || []).map((t)=>this.convertValue(t, e));
                }
                convertServerTimestamp(t, e) {
                    switch(e){
                        case "previous":
                            const n = te(t);
                            return null == n ? null : this.convertValue(n, e);
                        case "estimate":
                            return this.convertTimestamp(tn(t));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t) {
                    const e = X(t);
                    return new q(e.seconds, e.nanos);
                }
                convertDocumentKey(t, e) {
                    const n = z.fromString(t);
                    I(nL(n));
                    const s = new oV(n.get(1), n.get(3)), r = new to(n.popFirst(5));
                    return (s.isEqual(e) || p(`Document ${r} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), r);
                }
            }
            function cl(t, e, n) {
                let s;
                return ((s = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e), s);
            }
            class cd extends (null && ch) {
                constructor(t){
                    super(), (this.firestore = t);
                }
                convertBytes(t) {
                    return new ap(t);
                }
                convertReference(t) {
                    const e = this.convertDocumentKey(t, this.firestore._databaseId);
                    return new oH(this.firestore, null, e);
                }
            }
            class cf {
                constructor(t, e){
                    (this._firestore = t), (this._commitHandler = e), (this._mutations = []), (this._committed = !1), (this._dataReader = a8(t));
                }
                set(t, e, n) {
                    this._verifyNotCommitted();
                    const s = cm(t, this._firestore), r = cl(s.converter, e, n), i = aN(this._dataReader, "WriteBatch.set", s._key, r, null !== s.converter, n);
                    return (this._mutations.push(i.toMutation(s._key, ey.none())), this);
                }
                update(t, e, n, ...s) {
                    this._verifyNotCommitted();
                    const r = cm(t, this._firestore);
                    let i;
                    return ((i = "string" == typeof (e = getModularInstance(e)) || e instanceof am ? a_(this._dataReader, "WriteBatch.update", r._key, e, n, s) : aL(this._dataReader, "WriteBatch.update", r._key, e)), this._mutations.push(i.toMutation(r._key, ey.exists(!0))), this);
                }
                delete(t) {
                    this._verifyNotCommitted();
                    const e = cm(t, this._firestore);
                    return ((this._mutations = this._mutations.concat(new eD(e._key, ey.none()))), this);
                }
                commit() {
                    return (this._verifyNotCommitted(), (this._committed = !0), this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve());
                }
                _verifyNotCommitted() {
                    if (this._committed) throw new S($.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
                }
            }
            function cm(t, e) {
                if ((t = getModularInstance(t)).firestore !== e) throw new S($.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
                return t;
            }
            function cg(t) {
                t = oK(t, oH);
                const e = oK(t.firestore, o7);
                return oD(ae(e), t._key).then((n)=>ck(e, t, n));
            }
            class cp extends ch {
                constructor(t){
                    super(), (this.firestore = t);
                }
                convertBytes(t) {
                    return new ap(t);
                }
                convertReference(t) {
                    const e = this.convertDocumentKey(t, this.firestore._databaseId);
                    return new oH(this.firestore, null, e);
                }
            }
            function cy(t) {
                t = oK(t, oH);
                const e = oK(t.firestore, o7), n = ae(e), s = new cp(e);
                return ok(n, t._key).then((n)=>new aj(e, s, t._key, n, new aG(null !== n && n.hasLocalMutations, !0), t.converter));
            }
            function cw(t) {
                t = oK(t, oH);
                const e = oK(t.firestore, o7);
                return oD(ae(e), t._key, {
                    source: "server"
                }).then((n)=>ck(e, t, n));
            }
            function cv(t) {
                t = oK(t, oW);
                const e = oK(t.firestore, o7), n = ae(e), s = new cp(e);
                return (a1(t._query), oC(n, t._query).then((n)=>new aW(e, s, t, n)));
            }
            function cI(t) {
                t = oK(t, oW);
                const e = oK(t.firestore, o7), n = ae(e), s = new cp(e);
                return ox(n, t._query).then((n)=>new aW(e, s, t, n));
            }
            function cT(t) {
                t = oK(t, oW);
                const e = oK(t.firestore, o7), n = ae(e), s = new cp(e);
                return oC(n, t._query, {
                    source: "server"
                }).then((n)=>new aW(e, s, t, n));
            }
            function cE(t, e, n) {
                t = oK(t, oH);
                const s = oK(t.firestore, o7), r = cl(t.converter, e, n);
                return cA(s, [
                    aN(a8(s), "setDoc", t._key, r, null !== t.converter, n).toMutation(t._key, ey.none()), 
                ]);
            }
            function c$(t, e, n, ...s) {
                t = oK(t, oH);
                const r = oK(t.firestore, o7), i = a8(r);
                let o;
                o = "string" == typeof ((e = getModularInstance(e))) || e instanceof am ? a_(i, "updateDoc", t._key, e, n, s) : aL(i, "updateDoc", t._key, e);
                return cA(r, [
                    o.toMutation(t._key, ey.exists(!0))
                ]);
            }
            function cS(t) {
                return cA(oK(t.firestore, o7), [
                    new eD(t._key, ey.none())
                ]);
            }
            function c8(t, e) {
                const n = oK(t.firestore, o7), s = o2(t), r = cl(t.converter, e);
                return cA(n, [
                    aN(a8(t.firestore), "addDoc", s._key, r, null !== t.converter, {}).toMutation(s._key, ey.exists(!1)), 
                ]).then(()=>s);
            }
            function cN(t, ...e) {
                var n, s, r;
                t = getModularInstance(t);
                let i = {
                    includeMetadataChanges: !1
                }, o = 0;
                "object" != typeof e[o] || o3(e[o]) || ((i = e[o]), o++);
                const a = {
                    includeMetadataChanges: i.includeMetadataChanges
                };
                if (o3(e[o])) {
                    const c = e[o];
                    (e[o] = null === (n = c.next) || void 0 === n ? void 0 : n.bind(c)), (e[o + 1] = null === (s = c.error) || void 0 === s ? void 0 : s.bind(c)), (e[o + 2] = null === (r = c.complete) || void 0 === r ? void 0 : r.bind(c));
                }
                let u, h, l;
                if (t instanceof oH) (h = oK(t.firestore, o7)), (l = tG(t._key.path)), (u = {
                    next: (n)=>{
                        e[o] && e[o](ck(h, t, n));
                    },
                    error: e[o + 1],
                    complete: e[o + 2]
                });
                else {
                    const d = oK(t, oW);
                    (h = oK(d.firestore, o7)), (l = d._query);
                    const f = new cp(h);
                    (u = {
                        next: (t)=>{
                            e[o] && e[o](new aW(h, f, d, t));
                        },
                        error: e[o + 1],
                        complete: e[o + 2]
                    }), a1(t._query);
                }
                return (function(t, e, n, s) {
                    const r = new of(s), i = new ik(e, r, n);
                    return (t.asyncQueue.enqueueAndForget(async ()=>iS(await oN(t), i)), ()=>{
                        r.ec(), t.asyncQueue.enqueueAndForget(async ()=>i8(await oN(t), i));
                    });
                })(ae(h), l, a, u);
            }
            function cb(t, e) {
                return oL(ae((t = oK(t, o7))), o3(e) ? e : {
                    next: e
                });
            }
            function cA(t, e) {
                return (function(t, e) {
                    const n = new N();
                    return (t.asyncQueue.enqueueAndForget(async ()=>iB(await o8(t), e, n)), n.promise);
                })(ae(t), e);
            }
            function ck(t, e, n) {
                const s = n.docs.get(e._key), r = new cp(t);
                return new aj(t, r, e._key, s, new aG(n.hasPendingWrites, n.fromCache), e.converter);
            }
            class cD extends (null && class {
                constructor(t, e){
                    (this._firestore = t), (this._transaction = e), (this._dataReader = a8(t));
                }
                get(t) {
                    const e = cm(t, this._firestore), n = new cd(this._firestore);
                    return this._transaction.lookup([
                        e._key
                    ]).then((t)=>{
                        if (!t || 1 !== t.length) return v();
                        const s = t[0];
                        if (s.isFoundDocument()) return new aK(this._firestore, n, s.key, s, e.converter);
                        if (s.isNoDocument()) return new aK(this._firestore, n, e._key, null, e.converter);
                        throw v();
                    });
                }
                set(t, e, n) {
                    const s = cm(t, this._firestore), r = cl(s.converter, e, n), i = aN(this._dataReader, "Transaction.set", s._key, r, null !== s.converter, n);
                    return this._transaction.set(s._key, i), this;
                }
                update(t, e, n, ...s) {
                    const r = cm(t, this._firestore);
                    let i;
                    return ((i = "string" == typeof (e = getModularInstance(e)) || e instanceof am ? a_(this._dataReader, "Transaction.update", r._key, e, n, s) : aL(this._dataReader, "Transaction.update", r._key, e)), this._transaction.update(r._key, i), this);
                }
                delete(t) {
                    const e = cm(t, this._firestore);
                    return this._transaction.delete(e._key), this;
                }
            }) {
                constructor(t, e){
                    super(t, e), (this._firestore = t);
                }
                get(t) {
                    const e = cm(t, this._firestore), n = new cp(this._firestore);
                    return super.get(t).then((t)=>new aj(this._firestore, n, e._key, t._document, new aG(!1, !1), e.converter));
                }
            }
            function cx(t, e) {
                return o_(ae((t = oK(t, o7))), (n)=>e(new cD(t, n)));
            }
            function cC() {
                return new ab("deleteField");
            }
            function cL() {
                return new ak("serverTimestamp");
            }
            function c_(...t) {
                return new aD("arrayUnion", t);
            }
            function cM(...t) {
                return new ax("arrayRemove", t);
            }
            function cR(t) {
                return new aC("increment", t);
            }
            function cF(t) {
                return ae((t = oK(t, o7))), new cf(t, (e)=>cA(t, e));
            }
            !(function(t, e = !0) {
                !(function(t) {
                    l = t;
                })(s.Jn), (0, s.Xd)(new r.wA("firestore", (t, { options: n  })=>{
                    const s = t.getProvider("app").getImmediate(), r = new o7(s, new D(t.getProvider("auth-internal")));
                    return ((n = Object.assign({
                        useFetchStreams: e
                    }, n)), r._setSettings(n), r);
                }, "PUBLIC")), (0, s.KN)(u, "3.3.0", t), (0, s.KN)(u, "3.3.0", "esm2017");
            })();
        }
    }, 
]);
