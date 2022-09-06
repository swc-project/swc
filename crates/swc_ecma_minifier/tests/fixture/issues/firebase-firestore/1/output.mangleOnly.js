"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        16
    ],
    {
        19: function(e, t, n) {
            n.d(t, {
                hJ: function() {
                    return oZ;
                },
                PL: function() {
                    return cI;
                }
            });
            var r = n(2238);
            var s = n(8463);
            var i = n(3333);
            var o = n(4444);
            var a = n(3510);
            var c = n(4155);
            const u = "@firebase/firestore";
            class h {
                constructor(e){
                    this.uid = e;
                }
                isAuthenticated() {
                    return null != this.uid;
                }
                toKey() {
                    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
                }
                isEqual(e) {
                    return e.uid === this.uid;
                }
            }
            (h.UNAUTHENTICATED = new h(null)), (h.GOOGLE_CREDENTIALS = new h("google-credentials-uid")), (h.FIRST_PARTY = new h("first-party-uid")), (h.MOCK_USER = new h("mock-user"));
            let l = "9.4.0";
            const d = new i.Yd("@firebase/firestore");
            function f() {
                return d.logLevel;
            }
            function m(e) {
                d.setLogLevel(e);
            }
            function g(e, ...t) {
                if (d.logLevel <= i["in"].DEBUG) {
                    const n = t.map(w);
                    d.debug(`Firestore (${l}): ${e}`, ...n);
                }
            }
            function p(e, ...t) {
                if (d.logLevel <= i["in"].ERROR) {
                    const n = t.map(w);
                    d.error(`Firestore (${l}): ${e}`, ...n);
                }
            }
            function y(e, ...t) {
                if (d.logLevel <= i["in"].WARN) {
                    const n = t.map(w);
                    d.warn(`Firestore (${l}): ${e}`, ...n);
                }
            }
            function w(e) {
                if ("string" == typeof e) return e;
                try {
                    return (n = e), JSON.stringify(n);
                } catch (t) {
                    return e;
                }
                var n;
            }
            function I(e = "Unexpected state") {
                const t = `FIRESTORE (${l}) INTERNAL ASSERTION FAILED: ` + e;
                throw (p(t), new Error(t));
            }
            function v(e, t) {
                e || I();
            }
            function E(e, t) {
                e || I();
            }
            function T(e, t) {
                return e;
            }
            const b = {
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
                constructor(e, t){
                    super(t), (this.code = e), (this.message = t), (this.name = "FirebaseError"), (this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`);
                }
            }
            class N {
                constructor(){
                    this.promise = new Promise((e, t)=>{
                        (this.resolve = e), (this.reject = t);
                    });
                }
            }
            class $ {
                constructor(e, t){
                    (this.user = t), (this.type = "OAuth"), (this.authHeaders = {}), (this.authHeaders.Authorization = `Bearer ${e}`);
                }
            }
            class A {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(e, t) {
                    e.enqueueRetryable(()=>t(h.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class D {
                constructor(e){
                    (this.token = e), (this.changeListener = null);
                }
                getToken() {
                    return Promise.resolve(this.token);
                }
                invalidateToken() {}
                start(e, t) {
                    (this.changeListener = t), e.enqueueRetryable(()=>t(this.token.user));
                }
                shutdown() {
                    this.changeListener = null;
                }
            }
            class k {
                constructor(e){
                    (this.t = e), (this.currentUser = h.UNAUTHENTICATED), (this.i = 0), (this.forceRefresh = !1), (this.auth = null);
                }
                start(e, t) {
                    let n = this.i;
                    const r = (e)=>this.i !== n ? ((n = this.i), t(e)) : Promise.resolve();
                    let s = new N();
                    this.o = ()=>{
                        this.i++, (this.currentUser = this.u()), s.resolve(), (s = new N()), e.enqueueRetryable(()=>r(this.currentUser));
                    };
                    const i = ()=>{
                        const t = s;
                        e.enqueueRetryable(async ()=>{
                            await t.promise, await r(this.currentUser);
                        });
                    }, o = (e)=>{
                        g("FirebaseCredentialsProvider", "Auth detected"), (this.auth = e), this.auth.addAuthTokenListener(this.o), i();
                    };
                    this.t.onInit((e)=>o(e)), setTimeout(()=>{
                        if (!this.auth) {
                            const e = this.t.getImmediate({
                                optional: !0
                            });
                            e ? o(e) : (g("FirebaseCredentialsProvider", "Auth not yet detected"), s.resolve(), (s = new N()));
                        }
                    }, 0), i();
                }
                getToken() {
                    const e = this.i, t = this.forceRefresh;
                    return ((this.forceRefresh = !1), this.auth ? this.auth.getToken(t).then((t)=>this.i !== e ? (g("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t ? (v("string" == typeof t.accessToken), new $(t.accessToken, this.currentUser)) : null) : Promise.resolve(null));
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const e = this.auth && this.auth.getUid();
                    return v(null === e || "string" == typeof e), new h(e);
                }
            }
            class x {
                constructor(e, t, n){
                    (this.h = e), (this.l = t), (this.m = n), (this.type = "FirstParty"), (this.user = h.FIRST_PARTY);
                }
                get authHeaders() {
                    const e = {
                        "X-Goog-AuthUser": this.l
                    }, t = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return (t && (e.Authorization = t), this.m && (e["X-Goog-Iam-Authorization-Token"] = this.m), e);
                }
            }
            class C {
                constructor(e, t, n){
                    (this.h = e), (this.l = t), (this.m = n);
                }
                getToken() {
                    return Promise.resolve(new x(this.h, this.l, this.m));
                }
                start(e, t) {
                    e.enqueueRetryable(()=>t(h.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class L {
                constructor(e, t){
                    (this.previousValue = e), t && ((t.sequenceNumberHandler = (e)=>this.g(e)), (this.p = (e)=>t.writeSequenceNumber(e)));
                }
                g(e) {
                    return ((this.previousValue = Math.max(e, this.previousValue)), this.previousValue);
                }
                next() {
                    const e = ++this.previousValue;
                    return this.p && this.p(e), e;
                }
            }
            function R(e) {
                const t = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(e);
                if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
                else for(let r = 0; r < e; r++)n[r] = Math.floor(256 * Math.random());
                return n;
            }
            L.T = -1;
            class M {
                static I() {
                    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
                    let n = "";
                    for(; n.length < 20;){
                        const r = R(40);
                        for(let s = 0; s < r.length; ++s)n.length < 20 && r[s] < t && (n += e.charAt(r[s] % e.length));
                    }
                    return n;
                }
            }
            function F(e, t) {
                return e < t ? -1 : e > t ? 1 : 0;
            }
            function O(e, t, n) {
                return (e.length === t.length && e.every((e, r)=>n(e, t[r])));
            }
            function P(e) {
                return e + "\0";
            }
            class V {
                constructor(e, t){
                    if (((this.seconds = e), (this.nanoseconds = t), t < 0)) throw new S(b.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
                    if (t >= 1e9) throw new S(b.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
                    if (e < -62135596800) throw new S(b.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
                    if (e >= 253402300800) throw new S(b.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
                }
                static now() {
                    return V.fromMillis(Date.now());
                }
                static fromDate(e) {
                    return V.fromMillis(e.getTime());
                }
                static fromMillis(e) {
                    const t = Math.floor(e / 1e3), n = Math.floor(1e6 * (e - 1e3 * t));
                    return new V(t, n);
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(e) {
                    return this.seconds === e.seconds ? F(this.nanoseconds, e.nanoseconds) : F(this.seconds, e.seconds);
                }
                isEqual(e) {
                    return (e.seconds === this.seconds && e.nanoseconds === this.nanoseconds);
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
                    const e = this.seconds - -62135596800;
                    return (String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0"));
                }
            }
            class U {
                constructor(e){
                    this.timestamp = e;
                }
                static fromTimestamp(e) {
                    return new U(e);
                }
                static min() {
                    return new U(new V(0, 0));
                }
                compareTo(e) {
                    return this.timestamp._compareTo(e.timestamp);
                }
                isEqual(e) {
                    return this.timestamp.isEqual(e.timestamp);
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
            function q(e) {
                let t = 0;
                for(const n in e)Object.prototype.hasOwnProperty.call(e, n) && t++;
                return t;
            }
            function B(e, t) {
                for(const n in e)Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
            }
            function K(e) {
                for(const t in e)if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
                return !0;
            }
            class _ {
                constructor(e, t, n){
                    void 0 === t ? (t = 0) : t > e.length && I(), void 0 === n ? (n = e.length - t) : n > e.length - t && I(), (this.segments = e), (this.offset = t), (this.len = n);
                }
                get length() {
                    return this.len;
                }
                isEqual(e) {
                    return 0 === _.comparator(this, e);
                }
                child(e) {
                    const t = this.segments.slice(this.offset, this.limit());
                    return (e instanceof _ ? e.forEach((e)=>{
                        t.push(e);
                    }) : t.push(e), this.construct(t));
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(e) {
                    return ((e = void 0 === e ? 1 : e), this.construct(this.segments, this.offset + e, this.length - e));
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
                get(e) {
                    return this.segments[this.offset + e];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(e) {
                    if (e.length < this.length) return !1;
                    for(let t = 0; t < this.length; t++)if (this.get(t) !== e.get(t)) return !1;
                    return !0;
                }
                isImmediateParentOf(e) {
                    if (this.length + 1 !== e.length) return !1;
                    for(let t = 0; t < this.length; t++)if (this.get(t) !== e.get(t)) return !1;
                    return !0;
                }
                forEach(e) {
                    for(let t = this.offset, n = this.limit(); t < n; t++)e(this.segments[t]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(e, t) {
                    const n = Math.min(e.length, t.length);
                    for(let r = 0; r < n; r++){
                        const s = e.get(r), i = t.get(r);
                        if (s < i) return -1;
                        if (s > i) return 1;
                    }
                    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
                }
            }
            class z extends _ {
                construct(e, t, n) {
                    return new z(e, t, n);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...e) {
                    const t = [];
                    for (const n of e){
                        if (n.indexOf("//") >= 0) throw new S(b.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
                        t.push(...n.split("/").filter((e)=>e.length > 0));
                    }
                    return new z(t);
                }
                static emptyPath() {
                    return new z([]);
                }
            }
            const j = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class G extends _ {
                construct(e, t, n) {
                    return new G(e, t, n);
                }
                static isValidIdentifier(e) {
                    return j.test(e);
                }
                canonicalString() {
                    return this.toArray().map((e)=>((e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`")), G.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
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
                static fromServerFormat(e) {
                    const t = [];
                    let n = "", r = 0;
                    const s = ()=>{
                        if (0 === n.length) throw new S(b.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        t.push(n), (n = "");
                    };
                    let i = !1;
                    for(; r < e.length;){
                        const o = e[r];
                        if ("\\" === o) {
                            if (r + 1 === e.length) throw new S(b.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
                            const a = e[r + 1];
                            if ("\\" !== a && "." !== a && "`" !== a) throw new S(b.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
                            (n += a), (r += 2);
                        } else "`" === o ? ((i = !i), r++) : "." !== o || i ? ((n += o), r++) : (s(), r++);
                    }
                    if ((s(), i)) throw new S(b.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
                    return new G(t);
                }
                static emptyPath() {
                    return new G([]);
                }
            }
            class Q {
                constructor(e){
                    (this.fields = e), e.sort(G.comparator);
                }
                covers(e) {
                    for (const t of this.fields)if (t.isPrefixOf(e)) return !0;
                    return !1;
                }
                isEqual(e) {
                    return O(this.fields, e.fields, (e, t)=>e.isEqual(t));
                }
            }
            function H() {
                return "undefined" != typeof atob;
            }
            class W {
                constructor(e){
                    this.binaryString = e;
                }
                static fromBase64String(e) {
                    const t = atob(e);
                    return new W(t);
                }
                static fromUint8Array(e) {
                    const t = (function(e) {
                        let t = "";
                        for(let n = 0; n < e.length; ++n)t += String.fromCharCode(e[n]);
                        return t;
                    })(e);
                    return new W(t);
                }
                toBase64() {
                    return (e = this.binaryString), btoa(e);
                    var e;
                }
                toUint8Array() {
                    return (function(e) {
                        const t = new Uint8Array(e.length);
                        for(let n = 0; n < e.length; n++)t[n] = e.charCodeAt(n);
                        return t;
                    })(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(e) {
                    return F(this.binaryString, e.binaryString);
                }
                isEqual(e) {
                    return this.binaryString === e.binaryString;
                }
            }
            W.EMPTY_BYTE_STRING = new W("");
            const Y = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function J(e) {
                if ((v(!!e), "string" == typeof e)) {
                    let t = 0;
                    const n = Y.exec(e);
                    if ((v(!!n), n[1])) {
                        let r = n[1];
                        (r = (r + "000000000").substr(0, 9)), (t = Number(r));
                    }
                    const s = new Date(e);
                    return {
                        seconds: Math.floor(s.getTime() / 1e3),
                        nanos: t
                    };
                }
                return {
                    seconds: X(e.seconds),
                    nanos: X(e.nanos)
                };
            }
            function X(e) {
                return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
            }
            function Z(e) {
                return "string" == typeof e ? W.fromBase64String(e) : W.fromUint8Array(e);
            }
            function ee(e) {
                var t, n;
                return ("server_timestamp" === (null === (n = ((null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue));
            }
            function et(e) {
                const t = e.mapValue.fields.__previous_value__;
                return ee(t) ? et(t) : t;
            }
            function en(e) {
                const t = J(e.mapValue.fields.__local_write_time__.timestampValue);
                return new V(t.seconds, t.nanos);
            }
            function er(e) {
                return null == e;
            }
            function es(e) {
                return 0 === e && 1 / e == -1 / 0;
            }
            function ei(e) {
                return ("number" == typeof e && Number.isInteger(e) && !es(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER);
            }
            class eo {
                constructor(e){
                    this.path = e;
                }
                static fromPath(e) {
                    return new eo(z.fromString(e));
                }
                static fromName(e) {
                    return new eo(z.fromString(e).popFirst(5));
                }
                hasCollectionId(e) {
                    return (this.path.length >= 2 && this.path.get(this.path.length - 2) === e);
                }
                isEqual(e) {
                    return (null !== e && 0 === z.comparator(this.path, e.path));
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(e, t) {
                    return z.comparator(e.path, t.path);
                }
                static isDocumentKey(e) {
                    return e.length % 2 == 0;
                }
                static fromSegments(e) {
                    return new eo(new z(e.slice()));
                }
            }
            function ea(e) {
                return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? ee(e) ? 4 : 10 : I();
            }
            function ec(e, t) {
                const n = ea(e);
                if (n !== ea(t)) return !1;
                switch(n){
                    case 0:
                        return !0;
                    case 1:
                        return e.booleanValue === t.booleanValue;
                    case 4:
                        return en(e).isEqual(en(t));
                    case 3:
                        return (function(e, t) {
                            if ("string" == typeof e.timestampValue && "string" == typeof t.timestampValue && e.timestampValue.length === t.timestampValue.length) return (e.timestampValue === t.timestampValue);
                            const n = J(e.timestampValue), r = J(t.timestampValue);
                            return (n.seconds === r.seconds && n.nanos === r.nanos);
                        })(e, t);
                    case 5:
                        return e.stringValue === t.stringValue;
                    case 6:
                        return (function(e, t) {
                            return Z(e.bytesValue).isEqual(Z(t.bytesValue));
                        })(e, t);
                    case 7:
                        return e.referenceValue === t.referenceValue;
                    case 8:
                        return (function(e, t) {
                            return (X(e.geoPointValue.latitude) === X(t.geoPointValue.latitude) && X(e.geoPointValue.longitude) === X(t.geoPointValue.longitude));
                        })(e, t);
                    case 2:
                        return (function(e, t) {
                            if ("integerValue" in e && "integerValue" in t) return (X(e.integerValue) === X(t.integerValue));
                            if ("doubleValue" in e && "doubleValue" in t) {
                                const n = X(e.doubleValue), r = X(t.doubleValue);
                                return n === r ? es(n) === es(r) : isNaN(n) && isNaN(r);
                            }
                            return !1;
                        })(e, t);
                    case 9:
                        return O(e.arrayValue.values || [], t.arrayValue.values || [], ec);
                    case 10:
                        return (function(e, t) {
                            const n = e.mapValue.fields || {}, r = t.mapValue.fields || {};
                            if (q(n) !== q(r)) return !1;
                            for(const s in n)if (n.hasOwnProperty(s) && (void 0 === r[s] || !ec(n[s], r[s]))) return !1;
                            return !0;
                        })(e, t);
                    default:
                        return I();
                }
            }
            function eu(e, t) {
                return void 0 !== (e.values || []).find((e)=>ec(e, t));
            }
            function eh(e, t) {
                const n = ea(e), r = ea(t);
                if (n !== r) return F(n, r);
                switch(n){
                    case 0:
                        return 0;
                    case 1:
                        return F(e.booleanValue, t.booleanValue);
                    case 2:
                        return (function(e, t) {
                            const n = X(e.integerValue || e.doubleValue), r = X(t.integerValue || t.doubleValue);
                            return n < r ? -1 : n > r ? 1 : n === r ? 0 : isNaN(n) ? isNaN(r) ? 0 : -1 : 1;
                        })(e, t);
                    case 3:
                        return el(e.timestampValue, t.timestampValue);
                    case 4:
                        return el(en(e), en(t));
                    case 5:
                        return F(e.stringValue, t.stringValue);
                    case 6:
                        return (function(e, t) {
                            const n = Z(e), r = Z(t);
                            return n.compareTo(r);
                        })(e.bytesValue, t.bytesValue);
                    case 7:
                        return (function(e, t) {
                            const n = e.split("/"), r = t.split("/");
                            for(let s = 0; s < n.length && s < r.length; s++){
                                const i = F(n[s], r[s]);
                                if (0 !== i) return i;
                            }
                            return F(n.length, r.length);
                        })(e.referenceValue, t.referenceValue);
                    case 8:
                        return (function(e, t) {
                            const n = F(X(e.latitude), X(t.latitude));
                            if (0 !== n) return n;
                            return F(X(e.longitude), X(t.longitude));
                        })(e.geoPointValue, t.geoPointValue);
                    case 9:
                        return (function(e, t) {
                            const n = e.values || [], r = t.values || [];
                            for(let s = 0; s < n.length && s < r.length; ++s){
                                const i = eh(n[s], r[s]);
                                if (i) return i;
                            }
                            return F(n.length, r.length);
                        })(e.arrayValue, t.arrayValue);
                    case 10:
                        return (function(e, t) {
                            const n = e.fields || {}, r = Object.keys(n), s = t.fields || {}, i = Object.keys(s);
                            r.sort(), i.sort();
                            for(let o = 0; o < r.length && o < i.length; ++o){
                                const a = F(r[o], i[o]);
                                if (0 !== a) return a;
                                const c = eh(n[r[o]], s[i[o]]);
                                if (0 !== c) return c;
                            }
                            return F(r.length, i.length);
                        })(e.mapValue, t.mapValue);
                    default:
                        throw I();
                }
            }
            function el(e, t) {
                if ("string" == typeof e && "string" == typeof t && e.length === t.length) return F(e, t);
                const n = J(e), r = J(t), s = F(n.seconds, r.seconds);
                return 0 !== s ? s : F(n.nanos, r.nanos);
            }
            function ed(e) {
                return ef(e);
            }
            function ef(e) {
                return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? (function(e) {
                    const t = J(e);
                    return `time(${t.seconds},${t.nanos})`;
                })(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? Z(e.bytesValue).toBase64() : "referenceValue" in e ? ((n = e.referenceValue), eo.fromName(n).toString()) : "geoPointValue" in e ? `geo(${(t = e.geoPointValue).latitude},${t.longitude})` : "arrayValue" in e ? (function(e) {
                    let t = "[", n = !0;
                    for (const r of e.values || [])n ? (n = !1) : (t += ","), (t += ef(r));
                    return t + "]";
                })(e.arrayValue) : "mapValue" in e ? (function(e) {
                    const t = Object.keys(e.fields || {}).sort();
                    let n = "{", r = !0;
                    for (const s of t)r ? (r = !1) : (n += ","), (n += `${s}:${ef(e.fields[s])}`);
                    return n + "}";
                })(e.mapValue) : I();
                var t, n;
            }
            function em(e, t) {
                return {
                    referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
                };
            }
            function eg(e) {
                return !!e && "integerValue" in e;
            }
            function ep(e) {
                return !!e && "arrayValue" in e;
            }
            function ey(e) {
                return !!e && "nullValue" in e;
            }
            function ew(e) {
                return (!!e && "doubleValue" in e && isNaN(Number(e.doubleValue)));
            }
            function eI(e) {
                return !!e && "mapValue" in e;
            }
            function ev(e) {
                if (e.geoPointValue) return {
                    geoPointValue: Object.assign({}, e.geoPointValue)
                };
                if (e.timestampValue && "object" == typeof e.timestampValue) return {
                    timestampValue: Object.assign({}, e.timestampValue)
                };
                if (e.mapValue) {
                    const t = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return (B(e.mapValue.fields, (e, n)=>(t.mapValue.fields[e] = ev(n))), t);
                }
                if (e.arrayValue) {
                    const n = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let r = 0; r < (e.arrayValue.values || []).length; ++r)n.arrayValue.values[r] = ev(e.arrayValue.values[r]);
                    return n;
                }
                return Object.assign({}, e);
            }
            class eE {
                constructor(e){
                    this.value = e;
                }
                static empty() {
                    return new eE({
                        mapValue: {}
                    });
                }
                field(e) {
                    if (e.isEmpty()) return this.value;
                    {
                        let t = this.value;
                        for(let n = 0; n < e.length - 1; ++n)if (((t = (t.mapValue.fields || {})[e.get(n)]), !eI(t))) return null;
                        return ((t = (t.mapValue.fields || {})[e.lastSegment()]), t || null);
                    }
                }
                set(e, t) {
                    this.getFieldsMap(e.popLast())[e.lastSegment()] = ev(t);
                }
                setAll(e) {
                    let t = G.emptyPath(), n = {}, r = [];
                    e.forEach((e, s)=>{
                        if (!t.isImmediateParentOf(s)) {
                            const i = this.getFieldsMap(t);
                            this.applyChanges(i, n, r), (n = {}), (r = []), (t = s.popLast());
                        }
                        e ? (n[s.lastSegment()] = ev(e)) : r.push(s.lastSegment());
                    });
                    const s = this.getFieldsMap(t);
                    this.applyChanges(s, n, r);
                }
                delete(e) {
                    const t = this.field(e.popLast());
                    eI(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
                }
                isEqual(e) {
                    return ec(this.value, e.value);
                }
                getFieldsMap(e) {
                    let t = this.value;
                    t.mapValue.fields || (t.mapValue = {
                        fields: {}
                    });
                    for(let n = 0; n < e.length; ++n){
                        let r = t.mapValue.fields[e.get(n)];
                        (eI(r) && r.mapValue.fields) || ((r = {
                            mapValue: {
                                fields: {}
                            }
                        }), (t.mapValue.fields[e.get(n)] = r)), (t = r);
                    }
                    return t.mapValue.fields;
                }
                applyChanges(e, t, n) {
                    B(t, (t, n)=>(e[t] = n));
                    for (const r of n)delete e[r];
                }
                clone() {
                    return new eE(ev(this.value));
                }
            }
            function eT(e) {
                const t = [];
                return (B(e.fields, (e, n)=>{
                    const r = new G([
                        e
                    ]);
                    if (eI(n)) {
                        const s = eT(n.mapValue).fields;
                        if (0 === s.length) t.push(r);
                        else for (const i of s)t.push(r.child(i));
                    } else t.push(r);
                }), new Q(t));
            }
            class eb {
                constructor(e, t, n, r, s){
                    (this.key = e), (this.documentType = t), (this.version = n), (this.data = r), (this.documentState = s);
                }
                static newInvalidDocument(e) {
                    return new eb(e, 0, U.min(), eE.empty(), 0);
                }
                static newFoundDocument(e, t, n) {
                    return new eb(e, 1, t, n, 0);
                }
                static newNoDocument(e, t) {
                    return new eb(e, 2, t, eE.empty(), 0);
                }
                static newUnknownDocument(e, t) {
                    return new eb(e, 3, t, eE.empty(), 2);
                }
                convertToFoundDocument(e, t) {
                    return ((this.version = e), (this.documentType = 1), (this.data = t), (this.documentState = 0), this);
                }
                convertToNoDocument(e) {
                    return ((this.version = e), (this.documentType = 2), (this.data = eE.empty()), (this.documentState = 0), this);
                }
                convertToUnknownDocument(e) {
                    return ((this.version = e), (this.documentType = 3), (this.data = eE.empty()), (this.documentState = 2), this);
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
                isEqual(e) {
                    return (e instanceof eb && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data));
                }
                clone() {
                    return new eb(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class eS {
                constructor(e, t = null, n = [], r = [], s = null, i = null, o = null){
                    (this.path = e), (this.collectionGroup = t), (this.orderBy = n), (this.filters = r), (this.limit = s), (this.startAt = i), (this.endAt = o), (this.A = null);
                }
            }
            function eN(e, t = null, n = [], r = [], s = null, i = null, o = null) {
                return new eS(e, t, n, r, s, i, o);
            }
            function e$(e) {
                const t = T(e);
                if (null === t.A) {
                    let n = t.path.canonicalString();
                    null !== t.collectionGroup && (n += "|cg:" + t.collectionGroup), (n += "|f:"), (n += t.filters.map((e)=>eC(e)).join(",")), (n += "|ob:"), (n += t.orderBy.map((e)=>(function(e) {
                            return (e.field.canonicalString() + e.dir);
                        })(e)).join(",")), er(t.limit) || ((n += "|l:"), (n += t.limit)), t.startAt && ((n += "|lb:"), (n += eB(t.startAt))), t.endAt && ((n += "|ub:"), (n += eB(t.endAt))), (t.A = n);
                }
                return t.A;
            }
            function eA(e) {
                let t = e.path.canonicalString();
                return (null !== e.collectionGroup && (t += " collectionGroup=" + e.collectionGroup), e.filters.length > 0 && (t += `, filters: [${e.filters.map((e)=>{
                    return `${(t = e).field.canonicalString()} ${t.op} ${ed(t.value)}`;
                    var t;
                }).join(", ")}]`), er(e.limit) || (t += ", limit: " + e.limit), e.orderBy.length > 0 && (t += `, orderBy: [${e.orderBy.map((e)=>(function(e) {
                        return `${e.field.canonicalString()} (${e.dir})`;
                    })(e)).join(", ")}]`), e.startAt && (t += ", startAt: " + eB(e.startAt)), e.endAt && (t += ", endAt: " + eB(e.endAt)), `Target(${t})`);
            }
            function eD(e, t) {
                if (e.limit !== t.limit) return !1;
                if (e.orderBy.length !== t.orderBy.length) return !1;
                for(let n = 0; n < e.orderBy.length; n++)if (!e_(e.orderBy[n], t.orderBy[n])) return !1;
                if (e.filters.length !== t.filters.length) return !1;
                for(let r = 0; r < e.filters.length; r++)if (((s = e.filters[r]), (i = t.filters[r]), s.op !== i.op || !s.field.isEqual(i.field) || !ec(s.value, i.value))) return !1;
                var s, i;
                return (e.collectionGroup === t.collectionGroup && !!e.path.isEqual(t.path) && !!ej(e.startAt, t.startAt) && ej(e.endAt, t.endAt));
            }
            function ek(e) {
                return (eo.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length);
            }
            class ex extends class {
            } {
                constructor(e, t, n){
                    super(), (this.field = e), (this.op = t), (this.value = n);
                }
                static create(e, t, n) {
                    return e.isKeyField() ? "in" === t || "not-in" === t ? this.R(e, t, n) : new eL(e, t, n) : "array-contains" === t ? new eO(e, n) : "in" === t ? new eP(e, n) : "not-in" === t ? new eV(e, n) : "array-contains-any" === t ? new eU(e, n) : new ex(e, t, n);
                }
                static R(e, t, n) {
                    return "in" === t ? new eR(e, n) : new eM(e, n);
                }
                matches(e) {
                    const t = e.data.field(this.field);
                    return "!=" === this.op ? null !== t && this.P(eh(t, this.value)) : null !== t && ea(this.value) === ea(t) && this.P(eh(t, this.value));
                }
                P(e) {
                    switch(this.op){
                        case "<":
                            return e < 0;
                        case "<=":
                            return e <= 0;
                        case "==":
                            return 0 === e;
                        case "!=":
                            return 0 !== e;
                        case ">":
                            return e > 0;
                        case ">=":
                            return e >= 0;
                        default:
                            return I();
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
            function eC(e) {
                return (e.field.canonicalString() + e.op.toString() + ed(e.value));
            }
            class eL extends ex {
                constructor(e, t, n){
                    super(e, t, n), (this.key = eo.fromName(n.referenceValue));
                }
                matches(e) {
                    const t = eo.comparator(e.key, this.key);
                    return this.P(t);
                }
            }
            class eR extends ex {
                constructor(e, t){
                    super(e, "in", t), (this.keys = eF("in", t));
                }
                matches(e) {
                    return this.keys.some((t)=>t.isEqual(e.key));
                }
            }
            class eM extends ex {
                constructor(e, t){
                    super(e, "not-in", t), (this.keys = eF("not-in", t));
                }
                matches(e) {
                    return !this.keys.some((t)=>t.isEqual(e.key));
                }
            }
            function eF(e, t) {
                var n;
                return ((null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((e)=>eo.fromName(e.referenceValue));
            }
            class eO extends ex {
                constructor(e, t){
                    super(e, "array-contains", t);
                }
                matches(e) {
                    const t = e.data.field(this.field);
                    return ep(t) && eu(t.arrayValue, this.value);
                }
            }
            class eP extends ex {
                constructor(e, t){
                    super(e, "in", t);
                }
                matches(e) {
                    const t = e.data.field(this.field);
                    return null !== t && eu(this.value.arrayValue, t);
                }
            }
            class eV extends ex {
                constructor(e, t){
                    super(e, "not-in", t);
                }
                matches(e) {
                    if (eu(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const t = e.data.field(this.field);
                    return null !== t && !eu(this.value.arrayValue, t);
                }
            }
            class eU extends ex {
                constructor(e, t){
                    super(e, "array-contains-any", t);
                }
                matches(e) {
                    const t = e.data.field(this.field);
                    return (!(!ep(t) || !t.arrayValue.values) && t.arrayValue.values.some((e)=>eu(this.value.arrayValue, e)));
                }
            }
            class eq {
                constructor(e, t){
                    (this.position = e), (this.before = t);
                }
            }
            function eB(e) {
                return `${e.before ? "b" : "a"}:${e.position.map((e)=>ed(e)).join(",")}`;
            }
            class eK {
                constructor(e, t = "asc"){
                    (this.field = e), (this.dir = t);
                }
            }
            function e_(e, t) {
                return e.dir === t.dir && e.field.isEqual(t.field);
            }
            function ez(e, t, n) {
                let r = 0;
                for(let s = 0; s < e.position.length; s++){
                    const i = t[s], o = e.position[s];
                    if (i.field.isKeyField()) r = eo.comparator(eo.fromName(o.referenceValue), n.key);
                    else {
                        r = eh(o, n.data.field(i.field));
                    }
                    if (("desc" === i.dir && (r *= -1), 0 !== r)) break;
                }
                return e.before ? r <= 0 : r < 0;
            }
            function ej(e, t) {
                if (null === e) return null === t;
                if (null === t) return !1;
                if (e.before !== t.before || e.position.length !== t.position.length) return !1;
                for(let n = 0; n < e.position.length; n++){
                    if (!ec(e.position[n], t.position[n])) return !1;
                }
                return !0;
            }
            class eG {
                constructor(e, t = null, n = [], r = [], s = null, i = "F", o = null, a = null){
                    (this.path = e), (this.collectionGroup = t), (this.explicitOrderBy = n), (this.filters = r), (this.limit = s), (this.limitType = i), (this.startAt = o), (this.endAt = a), (this.V = null), (this.S = null), this.startAt, this.endAt;
                }
            }
            function eQ(e, t, n, r, s, i, o, a) {
                return new eG(e, t, n, r, s, i, o, a);
            }
            function eH(e) {
                return new eG(e);
            }
            function eW(e) {
                return !er(e.limit) && "F" === e.limitType;
            }
            function eY(e) {
                return !er(e.limit) && "L" === e.limitType;
            }
            function eJ(e) {
                return e.explicitOrderBy.length > 0 ? e.explicitOrderBy[0].field : null;
            }
            function eX(e) {
                for (const t of e.filters)if (t.v()) return t.field;
                return null;
            }
            function eZ(e) {
                return null !== e.collectionGroup;
            }
            function e0(e) {
                const t = T(e);
                if (null === t.V) {
                    t.V = [];
                    const n = eX(t), r = eJ(t);
                    if (null !== n && null === r) n.isKeyField() || t.V.push(new eK(n)), t.V.push(new eK(G.keyField(), "asc"));
                    else {
                        let s = !1;
                        for (const i of t.explicitOrderBy)t.V.push(i), i.field.isKeyField() && (s = !0);
                        if (!s) {
                            const o = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc";
                            t.V.push(new eK(G.keyField(), o));
                        }
                    }
                }
                return t.V;
            }
            function e1(e) {
                const t = T(e);
                if (!t.S) if ("F" === t.limitType) t.S = eN(t.path, t.collectionGroup, e0(t), t.filters, t.limit, t.startAt, t.endAt);
                else {
                    const n = [];
                    for (const r of e0(t)){
                        const s = "desc" === r.dir ? "asc" : "desc";
                        n.push(new eK(r.field, s));
                    }
                    const i = t.endAt ? new eq(t.endAt.position, !t.endAt.before) : null, o = t.startAt ? new eq(t.startAt.position, !t.startAt.before) : null;
                    t.S = eN(t.path, t.collectionGroup, n, t.filters, t.limit, i, o);
                }
                return t.S;
            }
            function e2(e, t, n) {
                return new eG(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
            }
            function e4(e, t) {
                return eD(e1(e), e1(t)) && e.limitType === t.limitType;
            }
            function e3(e) {
                return `${e$(e1(e))}|lt:${e.limitType}`;
            }
            function e6(e) {
                return `Query(target=${eA(e1(e))}; limitType=${e.limitType})`;
            }
            function e5(e, t) {
                return (t.isFoundDocument() && (function(e, t) {
                    const n = t.key.path;
                    return null !== e.collectionGroup ? t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n) : eo.isDocumentKey(e.path) ? e.path.isEqual(n) : e.path.isImmediateParentOf(n);
                })(e, t) && (function(e, t) {
                    for (const n of e.explicitOrderBy)if (!n.field.isKeyField() && null === t.data.field(n.field)) return !1;
                    return !0;
                })(e, t) && (function(e, t) {
                    for (const n of e.filters)if (!n.matches(t)) return !1;
                    return !0;
                })(e, t) && (function(e, t) {
                    if (e.startAt && !ez(e.startAt, e0(e), t)) return !1;
                    if (e.endAt && ez(e.endAt, e0(e), t)) return !1;
                    return !0;
                })(e, t));
            }
            function e8(e) {
                return (t, n)=>{
                    let r = !1;
                    for (const s of e0(e)){
                        const i = e9(s, t, n);
                        if (0 !== i) return i;
                        r = r || s.field.isKeyField();
                    }
                    return 0;
                };
            }
            function e9(e, t, n) {
                const r = e.field.isKeyField() ? eo.comparator(t.key, n.key) : (function(e, t, n) {
                    const r = t.data.field(e), s = n.data.field(e);
                    return null !== r && null !== s ? eh(r, s) : I();
                })(e.field, t, n);
                switch(e.dir){
                    case "asc":
                        return r;
                    case "desc":
                        return -1 * r;
                    default:
                        return I();
                }
            }
            function e7(e, t) {
                if (e.D) {
                    if (isNaN(t)) return {
                        doubleValue: "NaN"
                    };
                    if (t === 1 / 0) return {
                        doubleValue: "Infinity"
                    };
                    if (t === -1 / 0) return {
                        doubleValue: "-Infinity"
                    };
                }
                return {
                    doubleValue: es(t) ? "-0" : t
                };
            }
            function te(e) {
                return {
                    integerValue: "" + e
                };
            }
            function tt(e, t) {
                return ei(t) ? te(t) : e7(e, t);
            }
            class tn {
                constructor(){
                    this._ = void 0;
                }
            }
            function tr(e, t, n) {
                return e instanceof to ? (function(e, t) {
                    const n = {
                        fields: {
                            __type__: {
                                stringValue: "server_timestamp"
                            },
                            __local_write_time__: {
                                timestampValue: {
                                    seconds: e.seconds,
                                    nanos: e.nanoseconds
                                }
                            }
                        }
                    };
                    return (t && (n.fields.__previous_value__ = t), {
                        mapValue: n
                    });
                })(n, t) : e instanceof ta ? tc(e, t) : e instanceof tu ? th(e, t) : (function(e, t) {
                    const n = ti(e, t), r = td(n) + td(e.C);
                    return eg(n) && eg(e.C) ? te(r) : e7(e.N, r);
                })(e, t);
            }
            function ts(e, t, n) {
                return e instanceof ta ? tc(e, t) : e instanceof tu ? th(e, t) : n;
            }
            function ti(e, t) {
                return e instanceof tl ? eg((n = t)) || (function(e) {
                    return !!e && "doubleValue" in e;
                })(n) ? t : {
                    integerValue: 0
                } : null;
                var n;
            }
            class to extends tn {
            }
            class ta extends tn {
                constructor(e){
                    super(), (this.elements = e);
                }
            }
            function tc(e, t) {
                const n = tf(t);
                for (const r of e.elements)n.some((e)=>ec(e, r)) || n.push(r);
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class tu extends tn {
                constructor(e){
                    super(), (this.elements = e);
                }
            }
            function th(e, t) {
                let n = tf(t);
                for (const r of e.elements)n = n.filter((e)=>!ec(e, r));
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class tl extends tn {
                constructor(e, t){
                    super(), (this.N = e), (this.C = t);
                }
            }
            function td(e) {
                return X(e.integerValue || e.doubleValue);
            }
            function tf(e) {
                return ep(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
            }
            class tm {
                constructor(e, t){
                    (this.field = e), (this.transform = t);
                }
            }
            function tg(e, t) {
                return (e.field.isEqual(t.field) && (function(e, t) {
                    return (e instanceof ta && t instanceof ta) || (e instanceof tu && t instanceof tu) ? O(e.elements, t.elements, ec) : e instanceof tl && t instanceof tl ? ec(e.C, t.C) : e instanceof to && t instanceof to;
                })(e.transform, t.transform));
            }
            class tp {
                constructor(e, t){
                    (this.version = e), (this.transformResults = t);
                }
            }
            class ty {
                constructor(e, t){
                    (this.updateTime = e), (this.exists = t);
                }
                static none() {
                    return new ty();
                }
                static exists(e) {
                    return new ty(void 0, e);
                }
                static updateTime(e) {
                    return new ty(e);
                }
                get isNone() {
                    return (void 0 === this.updateTime && void 0 === this.exists);
                }
                isEqual(e) {
                    return (this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime));
                }
            }
            function tw(e, t) {
                return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
            }
            class tI {
            }
            function tv(e, t, n) {
                e instanceof tN ? (function(e, t, n) {
                    const r = e.value.clone(), s = tD(e.fieldTransforms, t, n.transformResults);
                    r.setAll(s), t.convertToFoundDocument(n.version, r).setHasCommittedMutations();
                })(e, t, n) : e instanceof t$ ? (function(e, t, n) {
                    if (!tw(e.precondition, t)) return void t.convertToUnknownDocument(n.version);
                    const r = tD(e.fieldTransforms, t, n.transformResults), s = t.data;
                    s.setAll(tA(e)), s.setAll(r), t.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                })(e, t, n) : (function(e, t, n) {
                    t.convertToNoDocument(n.version).setHasCommittedMutations();
                })(0, t, n);
            }
            function tE(e, t, n) {
                e instanceof tN ? (function(e, t, n) {
                    if (!tw(e.precondition, t)) return;
                    const r = e.value.clone(), s = tk(e.fieldTransforms, n, t);
                    r.setAll(s), t.convertToFoundDocument(tS(t), r).setHasLocalMutations();
                })(e, t, n) : e instanceof t$ ? (function(e, t, n) {
                    if (!tw(e.precondition, t)) return;
                    const r = tk(e.fieldTransforms, n, t), s = t.data;
                    s.setAll(tA(e)), s.setAll(r), t.convertToFoundDocument(tS(t), s).setHasLocalMutations();
                })(e, t, n) : (function(e, t) {
                    tw(e.precondition, t) && t.convertToNoDocument(U.min());
                })(e, t);
            }
            function tT(e, t) {
                let n = null;
                for (const r of e.fieldTransforms){
                    const s = t.data.field(r.field), i = ti(r.transform, s || null);
                    null != i && (null == n && (n = eE.empty()), n.set(r.field, i));
                }
                return n || null;
            }
            function tb(e, t) {
                return (e.type === t.type && !!e.key.isEqual(t.key) && !!e.precondition.isEqual(t.precondition) && !!(function(e, t) {
                    return ((void 0 === e && void 0 === t) || (!(!e || !t) && O(e, t, (e, t)=>tg(e, t))));
                })(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || (e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask))));
            }
            function tS(e) {
                return e.isFoundDocument() ? e.version : U.min();
            }
            class tN extends tI {
                constructor(e, t, n, r = []){
                    super(), (this.key = e), (this.value = t), (this.precondition = n), (this.fieldTransforms = r), (this.type = 0);
                }
            }
            class t$ extends tI {
                constructor(e, t, n, r, s = []){
                    super(), (this.key = e), (this.data = t), (this.fieldMask = n), (this.precondition = r), (this.fieldTransforms = s), (this.type = 1);
                }
            }
            function tA(e) {
                const t = new Map();
                return (e.fieldMask.fields.forEach((n)=>{
                    if (!n.isEmpty()) {
                        const r = e.data.field(n);
                        t.set(n, r);
                    }
                }), t);
            }
            function tD(e, t, n) {
                const r = new Map();
                v(e.length === n.length);
                for(let s = 0; s < n.length; s++){
                    const i = e[s], o = i.transform, a = t.data.field(i.field);
                    r.set(i.field, ts(o, a, n[s]));
                }
                return r;
            }
            function tk(e, t, n) {
                const r = new Map();
                for (const s of e){
                    const i = s.transform, o = n.data.field(s.field);
                    r.set(s.field, tr(i, o, t));
                }
                return r;
            }
            class tx extends (null && tI) {
                constructor(e, t){
                    super(), (this.key = e), (this.precondition = t), (this.type = 2), (this.fieldTransforms = []);
                }
            }
            class tC extends (null && tI) {
                constructor(e, t){
                    super(), (this.key = e), (this.precondition = t), (this.type = 3), (this.fieldTransforms = []);
                }
            }
            class tL {
                constructor(e){
                    this.count = e;
                }
            }
            var tR, tM;
            function tF(e) {
                switch(e){
                    default:
                        return I();
                    case b.CANCELLED:
                    case b.UNKNOWN:
                    case b.DEADLINE_EXCEEDED:
                    case b.RESOURCE_EXHAUSTED:
                    case b.INTERNAL:
                    case b.UNAVAILABLE:
                    case b.UNAUTHENTICATED:
                        return !1;
                    case b.INVALID_ARGUMENT:
                    case b.NOT_FOUND:
                    case b.ALREADY_EXISTS:
                    case b.PERMISSION_DENIED:
                    case b.FAILED_PRECONDITION:
                    case b.ABORTED:
                    case b.OUT_OF_RANGE:
                    case b.UNIMPLEMENTED:
                    case b.DATA_LOSS:
                        return !0;
                }
            }
            function tO(e) {
                if (void 0 === e) return p("GRPC error has no .code"), b.UNKNOWN;
                switch(e){
                    case tR.OK:
                        return b.OK;
                    case tR.CANCELLED:
                        return b.CANCELLED;
                    case tR.UNKNOWN:
                        return b.UNKNOWN;
                    case tR.DEADLINE_EXCEEDED:
                        return b.DEADLINE_EXCEEDED;
                    case tR.RESOURCE_EXHAUSTED:
                        return b.RESOURCE_EXHAUSTED;
                    case tR.INTERNAL:
                        return b.INTERNAL;
                    case tR.UNAVAILABLE:
                        return b.UNAVAILABLE;
                    case tR.UNAUTHENTICATED:
                        return b.UNAUTHENTICATED;
                    case tR.INVALID_ARGUMENT:
                        return b.INVALID_ARGUMENT;
                    case tR.NOT_FOUND:
                        return b.NOT_FOUND;
                    case tR.ALREADY_EXISTS:
                        return b.ALREADY_EXISTS;
                    case tR.PERMISSION_DENIED:
                        return b.PERMISSION_DENIED;
                    case tR.FAILED_PRECONDITION:
                        return b.FAILED_PRECONDITION;
                    case tR.ABORTED:
                        return b.ABORTED;
                    case tR.OUT_OF_RANGE:
                        return b.OUT_OF_RANGE;
                    case tR.UNIMPLEMENTED:
                        return b.UNIMPLEMENTED;
                    case tR.DATA_LOSS:
                        return b.DATA_LOSS;
                    default:
                        return I();
                }
            }
            ((tM = tR || (tR = {}))[(tM.OK = 0)] = "OK"), (tM[(tM.CANCELLED = 1)] = "CANCELLED"), (tM[(tM.UNKNOWN = 2)] = "UNKNOWN"), (tM[(tM.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"), (tM[(tM.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"), (tM[(tM.NOT_FOUND = 5)] = "NOT_FOUND"), (tM[(tM.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"), (tM[(tM.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"), (tM[(tM.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"), (tM[(tM.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"), (tM[(tM.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"), (tM[(tM.ABORTED = 10)] = "ABORTED"), (tM[(tM.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"), (tM[(tM.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"), (tM[(tM.INTERNAL = 13)] = "INTERNAL"), (tM[(tM.UNAVAILABLE = 14)] = "UNAVAILABLE"), (tM[(tM.DATA_LOSS = 15)] = "DATA_LOSS");
            class tP {
                constructor(e, t){
                    (this.comparator = e), (this.root = t || tU.EMPTY);
                }
                insert(e, t) {
                    return new tP(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, tU.BLACK, null, null));
                }
                remove(e) {
                    return new tP(this.comparator, this.root.remove(e, this.comparator).copy(null, null, tU.BLACK, null, null));
                }
                get(e) {
                    let t = this.root;
                    for(; !t.isEmpty();){
                        const n = this.comparator(e, t.key);
                        if (0 === n) return t.value;
                        n < 0 ? (t = t.left) : n > 0 && (t = t.right);
                    }
                    return null;
                }
                indexOf(e) {
                    let t = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const r = this.comparator(e, n.key);
                        if (0 === r) return t + n.left.size;
                        r < 0 ? (n = n.left) : ((t += n.left.size + 1), (n = n.right));
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
                inorderTraversal(e) {
                    return this.root.inorderTraversal(e);
                }
                forEach(e) {
                    this.inorderTraversal((t, n)=>(e(t, n), !1));
                }
                toString() {
                    const e = [];
                    return (this.inorderTraversal((t, n)=>(e.push(`${t}:${n}`), !1)), `{${e.join(", ")}}`);
                }
                reverseTraversal(e) {
                    return this.root.reverseTraversal(e);
                }
                getIterator() {
                    return new tV(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(e) {
                    return new tV(this.root, e, this.comparator, !1);
                }
                getReverseIterator() {
                    return new tV(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(e) {
                    return new tV(this.root, e, this.comparator, !0);
                }
            }
            class tV {
                constructor(e, t, n, r){
                    (this.isReverse = r), (this.nodeStack = []);
                    let s = 1;
                    for(; !e.isEmpty();)if (((s = t ? n(e.key, t) : 1), r && (s *= -1), s < 0)) e = this.isReverse ? e.left : e.right;
                    else {
                        if (0 === s) {
                            this.nodeStack.push(e);
                            break;
                        }
                        this.nodeStack.push(e), (e = this.isReverse ? e.right : e.left);
                    }
                }
                getNext() {
                    let e = this.nodeStack.pop();
                    const t = {
                        key: e.key,
                        value: e.value
                    };
                    if (this.isReverse) for(e = e.left; !e.isEmpty();)this.nodeStack.push(e), (e = e.right);
                    else for(e = e.right; !e.isEmpty();)this.nodeStack.push(e), (e = e.left);
                    return t;
                }
                hasNext() {
                    return this.nodeStack.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack.length) return null;
                    const e = this.nodeStack[this.nodeStack.length - 1];
                    return {
                        key: e.key,
                        value: e.value
                    };
                }
            }
            class tU {
                constructor(e, t, n, r, s){
                    (this.key = e), (this.value = t), (this.color = null != n ? n : tU.RED), (this.left = null != r ? r : tU.EMPTY), (this.right = null != s ? s : tU.EMPTY), (this.size = this.left.size + 1 + this.right.size);
                }
                copy(e, t, n, r, s) {
                    return new tU(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != s ? s : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(e) {
                    return (this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e));
                }
                reverseTraversal(e) {
                    return (this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e));
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
                insert(e, t, n) {
                    let r = this;
                    const s = n(e, r.key);
                    return ((r = s < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === s ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n))), r.fixUp());
                }
                removeMin() {
                    if (this.left.isEmpty()) return tU.EMPTY;
                    let e = this;
                    return (e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), (e = e.copy(null, null, null, e.left.removeMin(), null)), e.fixUp());
                }
                remove(e, t) {
                    let n, r = this;
                    if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), (r = r.copy(null, null, null, r.left.remove(e, t), null));
                    else {
                        if ((r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === t(e, r.key))) {
                            if (r.right.isEmpty()) return tU.EMPTY;
                            (n = r.right.min()), (r = r.copy(n.key, n.value, null, null, r.right.removeMin()));
                        }
                        r = r.copy(null, null, null, null, r.right.remove(e, t));
                    }
                    return r.fixUp();
                }
                isRed() {
                    return this.color;
                }
                fixUp() {
                    let e = this;
                    return (e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e);
                }
                moveRedLeft() {
                    let e = this.colorFlip();
                    return (e.right.left.isRed() && ((e = e.copy(null, null, null, null, e.right.rotateRight())), (e = e.rotateLeft()), (e = e.colorFlip())), e);
                }
                moveRedRight() {
                    let e = this.colorFlip();
                    return (e.left.left.isRed() && ((e = e.rotateRight()), (e = e.colorFlip())), e);
                }
                rotateLeft() {
                    const e = this.copy(null, null, tU.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, e, null);
                }
                rotateRight() {
                    const e = this.copy(null, null, tU.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, e);
                }
                colorFlip() {
                    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, e, t);
                }
                checkMaxDepth() {
                    const e = this.check();
                    return Math.pow(2, e) <= this.size + 1;
                }
                check() {
                    if (this.isRed() && this.left.isRed()) throw I();
                    if (this.right.isRed()) throw I();
                    const e = this.left.check();
                    if (e !== this.right.check()) throw I();
                    return e + (this.isRed() ? 0 : 1);
                }
            }
            (tU.EMPTY = null), (tU.RED = !0), (tU.BLACK = !1);
            tU.EMPTY = new (class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw I();
                }
                get value() {
                    throw I();
                }
                get color() {
                    throw I();
                }
                get left() {
                    throw I();
                }
                get right() {
                    throw I();
                }
                copy(e, t, n, r, s) {
                    return this;
                }
                insert(e, t, n) {
                    return new tU(e, t);
                }
                remove(e, t) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(e) {
                    return !1;
                }
                reverseTraversal(e) {
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
            class tq {
                constructor(e){
                    (this.comparator = e), (this.data = new tP(this.comparator));
                }
                has(e) {
                    return null !== this.data.get(e);
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
                indexOf(e) {
                    return this.data.indexOf(e);
                }
                forEach(e) {
                    this.data.inorderTraversal((t, n)=>(e(t), !1));
                }
                forEachInRange(e, t) {
                    const n = this.data.getIteratorFrom(e[0]);
                    for(; n.hasNext();){
                        const r = n.getNext();
                        if (this.comparator(r.key, e[1]) >= 0) return;
                        t(r.key);
                    }
                }
                forEachWhile(e, t) {
                    let n;
                    for(n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext();){
                        if (!e(n.getNext().key)) return;
                    }
                }
                firstAfterOrEqual(e) {
                    const t = this.data.getIteratorFrom(e);
                    return t.hasNext() ? t.getNext().key : null;
                }
                getIterator() {
                    return new tB(this.data.getIterator());
                }
                getIteratorFrom(e) {
                    return new tB(this.data.getIteratorFrom(e));
                }
                add(e) {
                    return this.copy(this.data.remove(e).insert(e, !0));
                }
                delete(e) {
                    return this.has(e) ? this.copy(this.data.remove(e)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(e) {
                    let t = this;
                    return (t.size < e.size && ((t = e), (e = this)), e.forEach((e)=>{
                        t = t.add(e);
                    }), t);
                }
                isEqual(e) {
                    if (!(e instanceof tq)) return !1;
                    if (this.size !== e.size) return !1;
                    const t = this.data.getIterator(), n = e.data.getIterator();
                    for(; t.hasNext();){
                        const r = t.getNext().key, s = n.getNext().key;
                        if (0 !== this.comparator(r, s)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const e = [];
                    return (this.forEach((t)=>{
                        e.push(t);
                    }), e);
                }
                toString() {
                    const e = [];
                    return (this.forEach((t)=>e.push(t)), "SortedSet(" + e.toString() + ")");
                }
                copy(e) {
                    const t = new tq(this.comparator);
                    return (t.data = e), t;
                }
            }
            class tB {
                constructor(e){
                    this.iter = e;
                }
                getNext() {
                    return this.iter.getNext().key;
                }
                hasNext() {
                    return this.iter.hasNext();
                }
            }
            const tK = new tP(eo.comparator);
            function t_() {
                return tK;
            }
            const tz = new tP(eo.comparator);
            function tj() {
                return tz;
            }
            const tG = new tP(eo.comparator);
            function tQ() {
                return tG;
            }
            const tH = new tq(eo.comparator);
            function tW(...e) {
                let t = tH;
                for (const n of e)t = t.add(n);
                return t;
            }
            const tY = new tq(F);
            function tJ() {
                return tY;
            }
            class tX {
                constructor(e, t, n, r, s){
                    (this.snapshotVersion = e), (this.targetChanges = t), (this.targetMismatches = n), (this.documentUpdates = r), (this.resolvedLimboDocuments = s);
                }
                static createSynthesizedRemoteEventForCurrentChange(e, t) {
                    const n = new Map();
                    return (n.set(e, tZ.createSynthesizedTargetChangeForCurrentChange(e, t)), new tX(U.min(), n, tJ(), t_(), tW()));
                }
            }
            class tZ {
                constructor(e, t, n, r, s){
                    (this.resumeToken = e), (this.current = t), (this.addedDocuments = n), (this.modifiedDocuments = r), (this.removedDocuments = s);
                }
                static createSynthesizedTargetChangeForCurrentChange(e, t) {
                    return new tZ(W.EMPTY_BYTE_STRING, t, tW(), tW(), tW());
                }
            }
            class t0 {
                constructor(e, t, n, r){
                    (this.k = e), (this.removedTargetIds = t), (this.key = n), (this.$ = r);
                }
            }
            class t1 {
                constructor(e, t){
                    (this.targetId = e), (this.O = t);
                }
            }
            class t2 {
                constructor(e, t, n = W.EMPTY_BYTE_STRING, r = null){
                    (this.state = e), (this.targetIds = t), (this.resumeToken = n), (this.cause = r);
                }
            }
            class t4 {
                constructor(){
                    (this.F = 0), (this.M = t5()), (this.L = W.EMPTY_BYTE_STRING), (this.B = !1), (this.U = !0);
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
                j(e) {
                    e.approximateByteSize() > 0 && ((this.U = !0), (this.L = e));
                }
                W() {
                    let e = tW(), t = tW(), n = tW();
                    return (this.M.forEach((r, s)=>{
                        switch(s){
                            case 0:
                                e = e.add(r);
                                break;
                            case 2:
                                t = t.add(r);
                                break;
                            case 1:
                                n = n.add(r);
                                break;
                            default:
                                I();
                        }
                    }), new tZ(this.L, this.B, e, t, n));
                }
                G() {
                    (this.U = !1), (this.M = t5());
                }
                H(e, t) {
                    (this.U = !0), (this.M = this.M.insert(e, t));
                }
                J(e) {
                    (this.U = !0), (this.M = this.M.remove(e));
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
            class t3 {
                constructor(e){
                    (this.tt = e), (this.et = new Map()), (this.nt = t_()), (this.st = t6()), (this.it = new tq(F));
                }
                rt(e) {
                    for (const t of e.k)e.$ && e.$.isFoundDocument() ? this.ot(t, e.$) : this.ct(t, e.key, e.$);
                    for (const n of e.removedTargetIds)this.ct(n, e.key, e.$);
                }
                at(e) {
                    this.forEachTarget(e, (t)=>{
                        const n = this.ut(t);
                        switch(e.state){
                            case 0:
                                this.ht(t) && n.j(e.resumeToken);
                                break;
                            case 1:
                                n.X(), n.q || n.G(), n.j(e.resumeToken);
                                break;
                            case 2:
                                n.X(), n.q || this.removeTarget(t);
                                break;
                            case 3:
                                this.ht(t) && (n.Z(), n.j(e.resumeToken));
                                break;
                            case 4:
                                this.ht(t) && (this.lt(t), n.j(e.resumeToken));
                                break;
                            default:
                                I();
                        }
                    });
                }
                forEachTarget(e, t) {
                    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.et.forEach((e, n)=>{
                        this.ht(n) && t(n);
                    });
                }
                ft(e) {
                    const t = e.targetId, n = e.O.count, r = this.dt(t);
                    if (r) {
                        const s = r.target;
                        if (ek(s)) if (0 === n) {
                            const i = new eo(s.path);
                            this.ct(t, i, eb.newNoDocument(i, U.min()));
                        } else v(1 === n);
                        else {
                            this.wt(t) !== n && (this.lt(t), (this.it = this.it.add(t)));
                        }
                    }
                }
                _t(e) {
                    const t = new Map();
                    this.et.forEach((n, r)=>{
                        const s = this.dt(r);
                        if (s) {
                            if (n.current && ek(s.target)) {
                                const i = new eo(s.target.path);
                                null !== this.nt.get(i) || this.gt(r, i) || this.ct(r, i, eb.newNoDocument(i, e));
                            }
                            n.K && (t.set(r, n.W()), n.G());
                        }
                    });
                    let n = tW();
                    this.st.forEach((e, t)=>{
                        let r = !0;
                        t.forEachWhile((e)=>{
                            const t = this.dt(e);
                            return (!t || 2 === t.purpose || ((r = !1), !1));
                        }), r && (n = n.add(e));
                    });
                    const r = new tX(e, t, this.it, this.nt, n);
                    return ((this.nt = t_()), (this.st = t6()), (this.it = new tq(F)), r);
                }
                ot(e, t) {
                    if (!this.ht(e)) return;
                    const n = this.gt(e, t.key) ? 2 : 0;
                    this.ut(e).H(t.key, n), (this.nt = this.nt.insert(t.key, t)), (this.st = this.st.insert(t.key, this.yt(t.key).add(e)));
                }
                ct(e, t, n) {
                    if (!this.ht(e)) return;
                    const r = this.ut(e);
                    this.gt(e, t) ? r.H(t, 1) : r.J(t), (this.st = this.st.insert(t, this.yt(t).delete(e))), n && (this.nt = this.nt.insert(t, n));
                }
                removeTarget(e) {
                    this.et.delete(e);
                }
                wt(e) {
                    const t = this.ut(e).W();
                    return (this.tt.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size);
                }
                Y(e) {
                    this.ut(e).Y();
                }
                ut(e) {
                    let t = this.et.get(e);
                    return t || ((t = new t4()), this.et.set(e, t)), t;
                }
                yt(e) {
                    let t = this.st.get(e);
                    return (t || ((t = new tq(F)), (this.st = this.st.insert(e, t))), t);
                }
                ht(e) {
                    const t = null !== this.dt(e);
                    return (t || g("WatchChangeAggregator", "Detected inactive target", e), t);
                }
                dt(e) {
                    const t = this.et.get(e);
                    return t && t.q ? null : this.tt.Tt(e);
                }
                lt(e) {
                    this.et.set(e, new t4());
                    this.tt.getRemoteKeysForTarget(e).forEach((t)=>{
                        this.ct(e, t, null);
                    });
                }
                gt(e, t) {
                    return this.tt.getRemoteKeysForTarget(e).has(t);
                }
            }
            function t6() {
                return new tP(eo.comparator);
            }
            function t5() {
                return new tP(eo.comparator);
            }
            const t8 = (()=>{
                const e = {
                    asc: "ASCENDING",
                    desc: "DESCENDING"
                };
                return e;
            })(), t9 = (()=>{
                const e = {
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
                return e;
            })();
            class t7 {
                constructor(e, t){
                    (this.databaseId = e), (this.D = t);
                }
            }
            function ne(e, t) {
                if (e.D) {
                    return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
                }
                return {
                    seconds: "" + t.seconds,
                    nanos: t.nanoseconds
                };
            }
            function nt(e, t) {
                return e.D ? t.toBase64() : t.toUint8Array();
            }
            function nn(e, t) {
                return ne(e, t.toTimestamp());
            }
            function nr(e) {
                return (v(!!e), U.fromTimestamp((function(e) {
                    const t = J(e);
                    return new V(t.seconds, t.nanos);
                })(e)));
            }
            function ns(e, t) {
                return (function(e) {
                    return new z([
                        "projects",
                        e.projectId,
                        "databases",
                        e.database, 
                    ]);
                })(e).child("documents").child(t).canonicalString();
            }
            function ni(e) {
                const t = z.fromString(e);
                return v(nR(t)), t;
            }
            function no(e, t) {
                return ns(e.databaseId, t.path);
            }
            function na(e, t) {
                const n = ni(t);
                if (n.get(1) !== e.databaseId.projectId) throw new S(b.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
                if (n.get(3) !== e.databaseId.database) throw new S(b.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
                return new eo(nl(n));
            }
            function nc(e, t) {
                return ns(e.databaseId, t);
            }
            function nu(e) {
                const t = ni(e);
                return 4 === t.length ? z.emptyPath() : nl(t);
            }
            function nh(e) {
                return new z([
                    "projects",
                    e.databaseId.projectId,
                    "databases",
                    e.databaseId.database, 
                ]).canonicalString();
            }
            function nl(e) {
                return (v(e.length > 4 && "documents" === e.get(4)), e.popFirst(5));
            }
            function nd(e, t, n) {
                return {
                    name: no(e, t),
                    fields: n.value.mapValue.fields
                };
            }
            function nf(e, t, n) {
                const r = na(e, t.name), s = nr(t.updateTime), i = new eE({
                    mapValue: {
                        fields: t.fields
                    }
                }), o = eb.newFoundDocument(r, s, i);
                return (n && o.setHasCommittedMutations(), n ? o.setHasCommittedMutations() : o);
            }
            function nm(e, t) {
                return "found" in t ? (function(e, t) {
                    v(!!t.found), t.found.name, t.found.updateTime;
                    const n = na(e, t.found.name), r = nr(t.found.updateTime), s = new eE({
                        mapValue: {
                            fields: t.found.fields
                        }
                    });
                    return eb.newFoundDocument(n, r, s);
                })(e, t) : "missing" in t ? (function(e, t) {
                    v(!!t.missing), v(!!t.readTime);
                    const n = na(e, t.missing), r = nr(t.readTime);
                    return eb.newNoDocument(n, r);
                })(e, t) : I();
            }
            function ng(e, t) {
                let n;
                if ("targetChange" in t) {
                    t.targetChange;
                    const r = (function(e) {
                        return "NO_CHANGE" === e ? 0 : "ADD" === e ? 1 : "REMOVE" === e ? 2 : "CURRENT" === e ? 3 : "RESET" === e ? 4 : I();
                    })(t.targetChange.targetChangeType || "NO_CHANGE"), s = t.targetChange.targetIds || [], i = (function(e, t) {
                        return e.D ? (v(void 0 === t || "string" == typeof t), W.fromBase64String(t || "")) : (v(void 0 === t || t instanceof Uint8Array), W.fromUint8Array(t || new Uint8Array()));
                    })(e, t.targetChange.resumeToken), o = t.targetChange.cause, a = o && (function(e) {
                        const t = void 0 === e.code ? b.UNKNOWN : tO(e.code);
                        return new S(t, e.message || "");
                    })(o);
                    n = new t2(r, s, i, a || null);
                } else if ("documentChange" in t) {
                    t.documentChange;
                    const c = t.documentChange;
                    c.document, c.document.name, c.document.updateTime;
                    const u = na(e, c.document.name), h = nr(c.document.updateTime), l = new eE({
                        mapValue: {
                            fields: c.document.fields
                        }
                    }), d = eb.newFoundDocument(u, h, l), f = c.targetIds || [], m = c.removedTargetIds || [];
                    n = new t0(f, m, d.key, d);
                } else if ("documentDelete" in t) {
                    t.documentDelete;
                    const g = t.documentDelete;
                    g.document;
                    const p = na(e, g.document), y = g.readTime ? nr(g.readTime) : U.min(), w = eb.newNoDocument(p, y), E = g.removedTargetIds || [];
                    n = new t0([], E, w.key, w);
                } else if ("documentRemove" in t) {
                    t.documentRemove;
                    const T = t.documentRemove;
                    T.document;
                    const N = na(e, T.document), $ = T.removedTargetIds || [];
                    n = new t0([], $, N, null);
                } else {
                    if (!("filter" in t)) return I();
                    {
                        t.filter;
                        const A = t.filter;
                        A.targetId;
                        const D = A.count || 0, k = new tL(D), x = A.targetId;
                        n = new t1(x, k);
                    }
                }
                return n;
            }
            function np(e, t) {
                let n;
                if (t instanceof tN) n = {
                    update: nd(e, t.key, t.value)
                };
                else if (t instanceof tx) n = {
                    delete: no(e, t.key)
                };
                else if (t instanceof t$) n = {
                    update: nd(e, t.key, t.data),
                    updateMask: nL(t.fieldMask)
                };
                else {
                    if (!(t instanceof tC)) return I();
                    n = {
                        verify: no(e, t.key)
                    };
                }
                return (t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map((e)=>(function(e, t) {
                        const n = t.transform;
                        if (n instanceof to) return {
                            fieldPath: t.field.canonicalString(),
                            setToServerValue: "REQUEST_TIME"
                        };
                        if (n instanceof ta) return {
                            fieldPath: t.field.canonicalString(),
                            appendMissingElements: {
                                values: n.elements
                            }
                        };
                        if (n instanceof tu) return {
                            fieldPath: t.field.canonicalString(),
                            removeAllFromArray: {
                                values: n.elements
                            }
                        };
                        if (n instanceof tl) return {
                            fieldPath: t.field.canonicalString(),
                            increment: n.C
                        };
                        throw I();
                    })(0, e))), t.precondition.isNone || (n.currentDocument = (function(e, t) {
                    return void 0 !== t.updateTime ? {
                        updateTime: nn(e, t.updateTime)
                    } : void 0 !== t.exists ? {
                        exists: t.exists
                    } : I();
                })(e, t.precondition)), n);
            }
            function ny(e, t) {
                const n = t.currentDocument ? (function(e) {
                    return void 0 !== e.updateTime ? ty.updateTime(nr(e.updateTime)) : void 0 !== e.exists ? ty.exists(e.exists) : ty.none();
                })(t.currentDocument) : ty.none(), r = t.updateTransforms ? t.updateTransforms.map((t)=>(function(e, t) {
                        let n = null;
                        if ("setToServerValue" in t) v("REQUEST_TIME" === t.setToServerValue), (n = new to());
                        else if ("appendMissingElements" in t) {
                            const r = t.appendMissingElements.values || [];
                            n = new ta(r);
                        } else if ("removeAllFromArray" in t) {
                            const s = t.removeAllFromArray.values || [];
                            n = new tu(s);
                        } else "increment" in t ? (n = new tl(e, t.increment)) : I();
                        const i = G.fromServerFormat(t.fieldPath);
                        return new tm(i, n);
                    })(e, t)) : [];
                if (t.update) {
                    t.update.name;
                    const s = na(e, t.update.name), i = new eE({
                        mapValue: {
                            fields: t.update.fields
                        }
                    });
                    if (t.updateMask) {
                        const o = (function(e) {
                            const t = e.fieldPaths || [];
                            return new Q(t.map((e)=>G.fromServerFormat(e)));
                        })(t.updateMask);
                        return new t$(s, i, o, n, r);
                    }
                    return new tN(s, i, n, r);
                }
                if (t.delete) {
                    const a = na(e, t.delete);
                    return new tx(a, n);
                }
                if (t.verify) {
                    const c = na(e, t.verify);
                    return new tC(c, n);
                }
                return I();
            }
            function nw(e, t) {
                return e && e.length > 0 ? (v(void 0 !== t), e.map((e)=>(function(e, t) {
                        let n = e.updateTime ? nr(e.updateTime) : nr(t);
                        return (n.isEqual(U.min()) && (n = nr(t)), new tp(n, e.transformResults || []));
                    })(e, t))) : [];
            }
            function nI(e, t) {
                return {
                    documents: [
                        nc(e, t.path)
                    ]
                };
            }
            function nv(e, t) {
                const n = {
                    structuredQuery: {}
                }, r = t.path;
                null !== t.collectionGroup ? ((n.parent = nc(e, r)), (n.structuredQuery.from = [
                    {
                        collectionId: t.collectionGroup,
                        allDescendants: !0
                    }, 
                ])) : ((n.parent = nc(e, r.popLast())), (n.structuredQuery.from = [
                    {
                        collectionId: r.lastSegment()
                    }, 
                ]));
                const s = (function(e) {
                    if (0 === e.length) return;
                    const t = e.map((e)=>(function(e) {
                            if ("==" === e.op) {
                                if (ew(e.value)) return {
                                    unaryFilter: {
                                        field: nD(e.field),
                                        op: "IS_NAN"
                                    }
                                };
                                if (ey(e.value)) return {
                                    unaryFilter: {
                                        field: nD(e.field),
                                        op: "IS_NULL"
                                    }
                                };
                            } else if ("!=" === e.op) {
                                if (ew(e.value)) return {
                                    unaryFilter: {
                                        field: nD(e.field),
                                        op: "IS_NOT_NAN"
                                    }
                                };
                                if (ey(e.value)) return {
                                    unaryFilter: {
                                        field: nD(e.field),
                                        op: "IS_NOT_NULL"
                                    }
                                };
                            }
                            return {
                                fieldFilter: {
                                    field: nD(e.field),
                                    op: nA(e.op),
                                    value: e.value
                                }
                            };
                        })(e));
                    if (1 === t.length) return t[0];
                    return {
                        compositeFilter: {
                            op: "AND",
                            filters: t
                        }
                    };
                })(t.filters);
                s && (n.structuredQuery.where = s);
                const i = (function(e) {
                    if (0 === e.length) return;
                    return e.map((e)=>(function(e) {
                            return {
                                field: nD(e.field),
                                direction: n$(e.dir)
                            };
                        })(e));
                })(t.orderBy);
                i && (n.structuredQuery.orderBy = i);
                const o = (function(e, t) {
                    return e.D || er(t) ? t : {
                        value: t
                    };
                })(e, t.limit);
                return (null !== o && (n.structuredQuery.limit = o), t.startAt && (n.structuredQuery.startAt = nS(t.startAt)), t.endAt && (n.structuredQuery.endAt = nS(t.endAt)), n);
            }
            function nE(e) {
                let t = nu(e.parent);
                const n = e.structuredQuery, r = n.from ? n.from.length : 0;
                let s = null;
                if (r > 0) {
                    v(1 === r);
                    const i = n.from[0];
                    i.allDescendants ? (s = i.collectionId) : (t = t.child(i.collectionId));
                }
                let o = [];
                n.where && (o = nb(n.where));
                let a = [];
                n.orderBy && (a = n.orderBy.map((e)=>(function(e) {
                        return new eK(nk(e.field), (function(e) {
                            switch(e){
                                case "ASCENDING":
                                    return "asc";
                                case "DESCENDING":
                                    return "desc";
                                default:
                                    return;
                            }
                        })(e.direction));
                    })(e)));
                let c = null;
                n.limit && (c = (function(e) {
                    let t;
                    return ((t = "object" == typeof e ? e.value : e), er(t) ? null : t);
                })(n.limit));
                let u = null;
                n.startAt && (u = nN(n.startAt));
                let h = null;
                return (n.endAt && (h = nN(n.endAt)), eQ(t, s, a, o, c, "F", u, h));
            }
            function nT(e, t) {
                const n = (function(e, t) {
                    switch(t){
                        case 0:
                            return null;
                        case 1:
                            return "existence-filter-mismatch";
                        case 2:
                            return "limbo-document";
                        default:
                            return I();
                    }
                })(0, t.purpose);
                return null == n ? null : {
                    "goog-listen-tags": n
                };
            }
            function nb(e) {
                return e ? void 0 !== e.unaryFilter ? [
                    nC(e)
                ] : void 0 !== e.fieldFilter ? [
                    nx(e)
                ] : void 0 !== e.compositeFilter ? e.compositeFilter.filters.map((e)=>nb(e)).reduce((e, t)=>e.concat(t)) : I() : [];
            }
            function nS(e) {
                return {
                    before: e.before,
                    values: e.position
                };
            }
            function nN(e) {
                const t = !!e.before, n = e.values || [];
                return new eq(n, t);
            }
            function n$(e) {
                return t8[e];
            }
            function nA(e) {
                return t9[e];
            }
            function nD(e) {
                return {
                    fieldPath: e.canonicalString()
                };
            }
            function nk(e) {
                return G.fromServerFormat(e.fieldPath);
            }
            function nx(e) {
                return ex.create(nk(e.fieldFilter.field), (function(e) {
                    switch(e){
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
                            return I();
                    }
                })(e.fieldFilter.op), e.fieldFilter.value);
            }
            function nC(e) {
                switch(e.unaryFilter.op){
                    case "IS_NAN":
                        const t = nk(e.unaryFilter.field);
                        return ex.create(t, "==", {
                            doubleValue: NaN
                        });
                    case "IS_NULL":
                        const n = nk(e.unaryFilter.field);
                        return ex.create(n, "==", {
                            nullValue: "NULL_VALUE"
                        });
                    case "IS_NOT_NAN":
                        const r = nk(e.unaryFilter.field);
                        return ex.create(r, "!=", {
                            doubleValue: NaN
                        });
                    case "IS_NOT_NULL":
                        const s = nk(e.unaryFilter.field);
                        return ex.create(s, "!=", {
                            nullValue: "NULL_VALUE"
                        });
                    default:
                        return I();
                }
            }
            function nL(e) {
                const t = [];
                return (e.fields.forEach((e)=>t.push(e.canonicalString())), {
                    fieldPaths: t
                });
            }
            function nR(e) {
                return (e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2));
            }
            function nM(e) {
                let t = "";
                for(let n = 0; n < e.length; n++)t.length > 0 && (t = nO(t)), (t = nF(e.get(n), t));
                return nO(t);
            }
            function nF(e, t) {
                let n = t;
                const r = e.length;
                for(let s = 0; s < r; s++){
                    const i = e.charAt(s);
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
            function nO(e) {
                return e + "";
            }
            function nP(e) {
                const t = e.length;
                if ((v(t >= 2), 2 === t)) return (v("" === e.charAt(0) && "" === e.charAt(1)), z.emptyPath());
                const n = t - 2, r = [];
                let s = "";
                for(let i = 0; i < t;){
                    const o = e.indexOf("", i);
                    (o < 0 || o > n) && I();
                    switch(e.charAt(o + 1)){
                        case "":
                            const a = e.substring(i, o);
                            let c;
                            0 === s.length ? (c = a) : ((s += a), (c = s), (s = "")), r.push(c);
                            break;
                        case "":
                            (s += e.substring(i, o)), (s += "\0");
                            break;
                        case "":
                            s += e.substring(i, o + 1);
                            break;
                        default:
                            I();
                    }
                    i = o + 2;
                }
                return new z(r);
            }
            class nV {
                constructor(e, t){
                    (this.seconds = e), (this.nanoseconds = t);
                }
            }
            class nU {
                constructor(e, t, n){
                    (this.ownerId = e), (this.allowTabSynchronization = t), (this.leaseTimestampMs = n);
                }
            }
            (nU.store = "owner"), (nU.key = "owner");
            class nq {
                constructor(e, t, n){
                    (this.userId = e), (this.lastAcknowledgedBatchId = t), (this.lastStreamToken = n);
                }
            }
            (nq.store = "mutationQueues"), (nq.keyPath = "userId");
            class nB {
                constructor(e, t, n, r, s){
                    (this.userId = e), (this.batchId = t), (this.localWriteTimeMs = n), (this.baseMutations = r), (this.mutations = s);
                }
            }
            (nB.store = "mutations"), (nB.keyPath = "batchId"), (nB.userMutationsIndex = "userMutationsIndex"), (nB.userMutationsKeyPath = [
                "userId",
                "batchId"
            ]);
            class nK {
                constructor(){}
                static prefixForUser(e) {
                    return [
                        e
                    ];
                }
                static prefixForPath(e, t) {
                    return [
                        e,
                        nM(t)
                    ];
                }
                static key(e, t, n) {
                    return [
                        e,
                        nM(t),
                        n
                    ];
                }
            }
            (nK.store = "documentMutations"), (nK.PLACEHOLDER = new nK());
            class n_ {
                constructor(e, t){
                    (this.path = e), (this.readTime = t);
                }
            }
            class nz {
                constructor(e, t){
                    (this.path = e), (this.version = t);
                }
            }
            class nj {
                constructor(e, t, n, r, s, i){
                    (this.unknownDocument = e), (this.noDocument = t), (this.document = n), (this.hasCommittedMutations = r), (this.readTime = s), (this.parentPath = i);
                }
            }
            (nj.store = "remoteDocuments"), (nj.readTimeIndex = "readTimeIndex"), (nj.readTimeIndexPath = "readTime"), (nj.collectionReadTimeIndex = "collectionReadTimeIndex"), (nj.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime", 
            ]);
            class nG {
                constructor(e){
                    this.byteSize = e;
                }
            }
            (nG.store = "remoteDocumentGlobal"), (nG.key = "remoteDocumentGlobalKey");
            class nQ {
                constructor(e, t, n, r, s, i, o){
                    (this.targetId = e), (this.canonicalId = t), (this.readTime = n), (this.resumeToken = r), (this.lastListenSequenceNumber = s), (this.lastLimboFreeSnapshotVersion = i), (this.query = o);
                }
            }
            (nQ.store = "targets"), (nQ.keyPath = "targetId"), (nQ.queryTargetsIndexName = "queryTargetsIndex"), (nQ.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ]);
            class nH {
                constructor(e, t, n){
                    (this.targetId = e), (this.path = t), (this.sequenceNumber = n);
                }
            }
            (nH.store = "targetDocuments"), (nH.keyPath = [
                "targetId",
                "path"
            ]), (nH.documentTargetsIndex = "documentTargetsIndex"), (nH.documentTargetsKeyPath = [
                "path",
                "targetId"
            ]);
            class nW {
                constructor(e, t, n, r){
                    (this.highestTargetId = e), (this.highestListenSequenceNumber = t), (this.lastRemoteSnapshotVersion = n), (this.targetCount = r);
                }
            }
            (nW.key = "targetGlobalKey"), (nW.store = "targetGlobal");
            class nY {
                constructor(e, t){
                    (this.collectionId = e), (this.parent = t);
                }
            }
            (nY.store = "collectionParents"), (nY.keyPath = [
                "collectionId",
                "parent"
            ]);
            class nJ {
                constructor(e, t, n, r){
                    (this.clientId = e), (this.updateTimeMs = t), (this.networkEnabled = n), (this.inForeground = r);
                }
            }
            (nJ.store = "clientMetadata"), (nJ.keyPath = "clientId");
            class nX {
                constructor(e, t, n){
                    (this.bundleId = e), (this.createTime = t), (this.version = n);
                }
            }
            (nX.store = "bundles"), (nX.keyPath = "bundleId");
            class nZ {
                constructor(e, t, n){
                    (this.name = e), (this.readTime = t), (this.bundledQuery = n);
                }
            }
            (nZ.store = "namedQueries"), (nZ.keyPath = "name");
            const n0 = [
                ...[
                    ...[
                        ...[
                            ...[
                                nq.store,
                                nB.store,
                                nK.store,
                                nj.store,
                                nQ.store,
                                nU.store,
                                nW.store,
                                nH.store, 
                            ],
                            nJ.store, 
                        ],
                        nG.store, 
                    ],
                    nY.store, 
                ],
                nX.store,
                nZ.store, 
            ], n1 = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
            class n2 {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(e) {
                    this.onCommittedListeners.push(e);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((e)=>e());
                }
            }
            class n4 {
                constructor(e){
                    (this.nextCallback = null), (this.catchCallback = null), (this.result = void 0), (this.error = void 0), (this.isDone = !1), (this.callbackAttached = !1), e((e)=>{
                        (this.isDone = !0), (this.result = e), this.nextCallback && this.nextCallback(e);
                    }, (e)=>{
                        (this.isDone = !0), (this.error = e), this.catchCallback && this.catchCallback(e);
                    });
                }
                catch(e) {
                    return this.next(void 0, e);
                }
                next(e, t) {
                    return (this.callbackAttached && I(), (this.callbackAttached = !0), this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new n4((n, r)=>{
                        (this.nextCallback = (t)=>{
                            this.wrapSuccess(e, t).next(n, r);
                        }), (this.catchCallback = (e)=>{
                            this.wrapFailure(t, e).next(n, r);
                        });
                    }));
                }
                toPromise() {
                    return new Promise((e, t)=>{
                        this.next(e, t);
                    });
                }
                wrapUserFunction(e) {
                    try {
                        const t = e();
                        return t instanceof n4 ? t : n4.resolve(t);
                    } catch (n) {
                        return n4.reject(n);
                    }
                }
                wrapSuccess(e, t) {
                    return e ? this.wrapUserFunction(()=>e(t)) : n4.resolve(t);
                }
                wrapFailure(e, t) {
                    return e ? this.wrapUserFunction(()=>e(t)) : n4.reject(t);
                }
                static resolve(e) {
                    return new n4((t, n)=>{
                        t(e);
                    });
                }
                static reject(e) {
                    return new n4((t, n)=>{
                        n(e);
                    });
                }
                static waitFor(e) {
                    return new n4((t, n)=>{
                        let r = 0, s = 0, i = !1;
                        e.forEach((e)=>{
                            ++r, e.next(()=>{
                                ++s, i && s === r && t();
                            }, (e)=>n(e));
                        }), (i = !0), s === r && t();
                    });
                }
                static or(e) {
                    let t = n4.resolve(!1);
                    for (const n of e)t = t.next((e)=>(e ? n4.resolve(e) : n()));
                    return t;
                }
                static forEach(e, t) {
                    const n = [];
                    return (e.forEach((e, r)=>{
                        n.push(t.call(this, e, r));
                    }), this.waitFor(n));
                }
            }
            class n3 {
                constructor(e, t){
                    (this.action = e), (this.transaction = t), (this.aborted = !1), (this.Et = new N()), (this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }), (this.transaction.onabort = ()=>{
                        t.error ? this.Et.reject(new n8(e, t.error)) : this.Et.resolve();
                    }), (this.transaction.onerror = (t)=>{
                        const n = rn(t.target.error);
                        this.Et.reject(new n8(e, n));
                    });
                }
                static open(e, t, n, r) {
                    try {
                        return new n3(t, e.transaction(r, n));
                    } catch (s) {
                        throw new n8(t, s);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(e) {
                    e && this.Et.reject(e), this.aborted || (g("SimpleDb", "Aborting transaction:", e ? e.message : "Client-initiated abort"), (this.aborted = !0), this.transaction.abort());
                }
                store(e) {
                    const t = this.transaction.objectStore(e);
                    return new n7(t);
                }
            }
            class n6 {
                constructor(e, t, n){
                    (this.name = e), (this.version = t), (this.At = n);
                    12.2 === n6.Rt(getUA()) && p("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(e) {
                    return (g("SimpleDb", "Removing database:", e), re(window.indexedDB.deleteDatabase(e)).toPromise());
                }
                static bt() {
                    if (!isIndexedDBAvailable()) return !1;
                    if (n6.Pt()) return !0;
                    const e = getUA(), t = n6.Rt(e), n = 0 < t && t < 10, r = n6.vt(e), s = 0 < r && r < 4.5;
                    return !(e.indexOf("MSIE ") > 0 || e.indexOf("Trident/") > 0 || e.indexOf("Edge/") > 0 || n || s);
                }
                static Pt() {
                    var e;
                    return ("undefined" != typeof c && "YES" === (null === (e = c.env) || void 0 === e ? void 0 : e.Vt));
                }
                static St(e, t) {
                    return e.store(t);
                }
                static Rt(e) {
                    const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = t ? t[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                static vt(e) {
                    const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                async Dt(e) {
                    return (this.db || (g("SimpleDb", "Opening database:", this.name), (this.db = await new Promise((t, n)=>{
                        const r = indexedDB.open(this.name, this.version);
                        (r.onsuccess = (e)=>{
                            const n = e.target.result;
                            t(n);
                        }), (r.onblocked = ()=>{
                            n(new n8(e, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }), (r.onerror = (t)=>{
                            const r = t.target.error;
                            "VersionError" === r.name ? n(new S(b.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === r.name ? n(new S(b.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + r)) : n(new n8(e, r));
                        }), (r.onupgradeneeded = (e)=>{
                            g("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', e.oldVersion);
                            const t = e.target.result;
                            this.At.Ct(t, r.transaction, e.oldVersion, this.version).next(()=>{
                                g("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        });
                    }))), this.Nt && (this.db.onversionchange = (e)=>this.Nt(e)), this.db);
                }
                xt(e) {
                    (this.Nt = e), this.db && (this.db.onversionchange = (t)=>e(t));
                }
                async runTransaction(e, t, n, r) {
                    const s = "readonly" === t;
                    let i = 0;
                    for(;;){
                        ++i;
                        try {
                            this.db = await this.Dt(e);
                            const o = n3.open(this.db, e, s ? "readonly" : "readwrite", n), a = r(o).catch((e)=>(o.abort(e), n4.reject(e))).toPromise();
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
            class n5 {
                constructor(e){
                    (this.kt = e), (this.$t = !1), (this.Ot = null);
                }
                get isDone() {
                    return this.$t;
                }
                get Ft() {
                    return this.Ot;
                }
                set cursor(e) {
                    this.kt = e;
                }
                done() {
                    this.$t = !0;
                }
                Mt(e) {
                    this.Ot = e;
                }
                delete() {
                    return re(this.kt.delete());
                }
            }
            class n8 extends (null && S) {
                constructor(e, t){
                    super(b.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`), (this.name = "IndexedDbTransactionError");
                }
            }
            function n9(e) {
                return "IndexedDbTransactionError" === e.name;
            }
            class n7 {
                constructor(e){
                    this.store = e;
                }
                put(e, t) {
                    let n;
                    return (void 0 !== t ? (g("SimpleDb", "PUT", this.store.name, e, t), (n = this.store.put(t, e))) : (g("SimpleDb", "PUT", this.store.name, "<auto-key>", e), (n = this.store.put(e))), re(n));
                }
                add(e) {
                    g("SimpleDb", "ADD", this.store.name, e, e);
                    return re(this.store.add(e));
                }
                get(e) {
                    return re(this.store.get(e)).next((t)=>(void 0 === t && (t = null), g("SimpleDb", "GET", this.store.name, e, t), t));
                }
                delete(e) {
                    g("SimpleDb", "DELETE", this.store.name, e);
                    return re(this.store.delete(e));
                }
                count() {
                    g("SimpleDb", "COUNT", this.store.name);
                    return re(this.store.count());
                }
                Lt(e, t) {
                    const n = this.cursor(this.options(e, t)), r = [];
                    return this.Bt(n, (e, t)=>{
                        r.push(t);
                    }).next(()=>r);
                }
                Ut(e, t) {
                    g("SimpleDb", "DELETE ALL", this.store.name);
                    const n = this.options(e, t);
                    n.qt = !1;
                    const r = this.cursor(n);
                    return this.Bt(r, (e, t, n)=>n.delete());
                }
                Kt(e, t) {
                    let n;
                    t ? (n = e) : ((n = {}), (t = e));
                    const r = this.cursor(n);
                    return this.Bt(r, t);
                }
                jt(e) {
                    const t = this.cursor({});
                    return new n4((n, r)=>{
                        (t.onerror = (e)=>{
                            const t = rn(e.target.error);
                            r(t);
                        }), (t.onsuccess = (t)=>{
                            const r = t.target.result;
                            r ? e(r.primaryKey, r.value).next((e)=>{
                                e ? r.continue() : n();
                            }) : n();
                        });
                    });
                }
                Bt(e, t) {
                    const n = [];
                    return new n4((r, s)=>{
                        (e.onerror = (e)=>{
                            s(e.target.error);
                        }), (e.onsuccess = (e)=>{
                            const s = e.target.result;
                            if (!s) return void r();
                            const i = new n5(s), o = t(s.primaryKey, s.value, i);
                            if (o instanceof n4) {
                                const a = o.catch((e)=>(i.done(), n4.reject(e)));
                                n.push(a);
                            }
                            i.isDone ? r() : null === i.Ft ? s.continue() : s.continue(i.Ft);
                        });
                    }).next(()=>n4.waitFor(n));
                }
                options(e, t) {
                    let n;
                    return (void 0 !== e && ("string" == typeof e ? (n = e) : (t = e)), {
                        index: n,
                        range: t
                    });
                }
                cursor(e) {
                    let t = "next";
                    if ((e.reverse && (t = "prev"), e.index)) {
                        const n = this.store.index(e.index);
                        return e.qt ? n.openKeyCursor(e.range, t) : n.openCursor(e.range, t);
                    }
                    return this.store.openCursor(e.range, t);
                }
            }
            function re(e) {
                return new n4((t, n)=>{
                    (e.onsuccess = (e)=>{
                        const n = e.target.result;
                        t(n);
                    }), (e.onerror = (e)=>{
                        const t = rn(e.target.error);
                        n(t);
                    });
                });
            }
            let rt = null && !1;
            function rn(e) {
                const t = n6.Rt(getUA());
                if (t >= 12.2 && t < 13) {
                    const n = "An internal error was encountered in the Indexed Database server";
                    if (e.message.indexOf(n) >= 0) {
                        const r = new S("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return (rt || ((rt = !0), setTimeout(()=>{
                            throw r;
                        }, 0)), r);
                    }
                }
                return e;
            }
            class rr extends (null && n2) {
                constructor(e, t){
                    super(), (this.Qt = e), (this.currentSequenceNumber = t);
                }
            }
            function rs(e, t) {
                const n = T(e);
                return n6.St(n.Qt, t);
            }
            class ri {
                constructor(e, t, n, r){
                    (this.batchId = e), (this.localWriteTime = t), (this.baseMutations = n), (this.mutations = r);
                }
                applyToRemoteDocument(e, t) {
                    const n = t.mutationResults;
                    for(let r = 0; r < this.mutations.length; r++){
                        const s = this.mutations[r];
                        if (s.key.isEqual(e.key)) {
                            tv(s, e, n[r]);
                        }
                    }
                }
                applyToLocalView(e) {
                    for (const t of this.baseMutations)t.key.isEqual(e.key) && tE(t, e, this.localWriteTime);
                    for (const n of this.mutations)n.key.isEqual(e.key) && tE(n, e, this.localWriteTime);
                }
                applyToLocalDocumentSet(e) {
                    this.mutations.forEach((t)=>{
                        const n = e.get(t.key), r = n;
                        this.applyToLocalView(r), n.isValidDocument() || r.convertToNoDocument(U.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((e, t)=>e.add(t.key), tW());
                }
                isEqual(e) {
                    return (this.batchId === e.batchId && O(this.mutations, e.mutations, (e, t)=>tb(e, t)) && O(this.baseMutations, e.baseMutations, (e, t)=>tb(e, t)));
                }
            }
            class ro {
                constructor(e, t, n, r){
                    (this.batch = e), (this.commitVersion = t), (this.mutationResults = n), (this.docVersions = r);
                }
                static from(e, t, n) {
                    v(e.mutations.length === n.length);
                    let r = tQ();
                    const s = e.mutations;
                    for(let i = 0; i < s.length; i++)r = r.insert(s[i].key, n[i].version);
                    return new ro(e, t, n, r);
                }
            }
            class ra {
                constructor(e, t, n, r, s = U.min(), i = U.min(), o = W.EMPTY_BYTE_STRING){
                    (this.target = e), (this.targetId = t), (this.purpose = n), (this.sequenceNumber = r), (this.snapshotVersion = s), (this.lastLimboFreeSnapshotVersion = i), (this.resumeToken = o);
                }
                withSequenceNumber(e) {
                    return new ra(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(e, t) {
                    return new ra(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e);
                }
                withLastLimboFreeSnapshotVersion(e) {
                    return new ra(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken);
                }
            }
            class rc {
                constructor(e){
                    this.Wt = e;
                }
            }
            function ru(e, t) {
                if (t.document) return nf(e.Wt, t.document, !!t.hasCommittedMutations);
                if (t.noDocument) {
                    const n = eo.fromSegments(t.noDocument.path), r = rm(t.noDocument.readTime), s = eb.newNoDocument(n, r);
                    return t.hasCommittedMutations ? s.setHasCommittedMutations() : s;
                }
                if (t.unknownDocument) {
                    const i = eo.fromSegments(t.unknownDocument.path), o = rm(t.unknownDocument.version);
                    return eb.newUnknownDocument(i, o);
                }
                return I();
            }
            function rh(e, t, n) {
                const r = rl(n), s = t.key.path.popLast().toArray();
                if (t.isFoundDocument()) {
                    const i = (function(e, t) {
                        return {
                            name: no(e, t.key),
                            fields: t.data.value.mapValue.fields,
                            updateTime: ne(e, t.version.toTimestamp())
                        };
                    })(e.Wt, t), o = t.hasCommittedMutations;
                    return new nj(null, null, i, o, r, s);
                }
                if (t.isNoDocument()) {
                    const a = t.key.path.toArray(), c = rf(t.version), u = t.hasCommittedMutations;
                    return new nj(null, new n_(a, c), null, u, r, s);
                }
                if (t.isUnknownDocument()) {
                    const h = t.key.path.toArray(), l = rf(t.version);
                    return new nj(new nz(h, l), null, null, !0, r, s);
                }
                return I();
            }
            function rl(e) {
                const t = e.toTimestamp();
                return [
                    t.seconds,
                    t.nanoseconds
                ];
            }
            function rd(e) {
                const t = new V(e[0], e[1]);
                return U.fromTimestamp(t);
            }
            function rf(e) {
                const t = e.toTimestamp();
                return new nV(t.seconds, t.nanoseconds);
            }
            function rm(e) {
                const t = new V(e.seconds, e.nanoseconds);
                return U.fromTimestamp(t);
            }
            function rg(e, t) {
                const n = (t.baseMutations || []).map((t)=>ny(e.Wt, t));
                for(let r = 0; r < t.mutations.length - 1; ++r){
                    const s = t.mutations[r];
                    if (r + 1 < t.mutations.length && void 0 !== t.mutations[r + 1].transform) {
                        const i = t.mutations[r + 1];
                        (s.updateTransforms = i.transform.fieldTransforms), t.mutations.splice(r + 1, 1), ++r;
                    }
                }
                const o = t.mutations.map((t)=>ny(e.Wt, t)), a = V.fromMillis(t.localWriteTimeMs);
                return new ri(t.batchId, a, n, o);
            }
            function rp(e) {
                const t = rm(e.readTime), n = void 0 !== e.lastLimboFreeSnapshotVersion ? rm(e.lastLimboFreeSnapshotVersion) : U.min();
                let r;
                var s;
                return (void 0 !== e.query.documents ? (v(1 === (s = e.query).documents.length), (r = e1(eH(nu(s.documents[0]))))) : (r = (function(e) {
                    return e1(nE(e));
                })(e.query)), new ra(r, e.targetId, 0, e.lastListenSequenceNumber, t, n, W.fromBase64String(e.resumeToken)));
            }
            function ry(e, t) {
                const n = rf(t.snapshotVersion), r = rf(t.lastLimboFreeSnapshotVersion);
                let s;
                s = ek(t.target) ? nI(e.Wt, t.target) : nv(e.Wt, t.target);
                const i = t.resumeToken.toBase64();
                return new nQ(t.targetId, e$(t.target), n, i, t.sequenceNumber, r, s);
            }
            function rw(e) {
                const t = nE({
                    parent: e.parent,
                    structuredQuery: e.structuredQuery
                });
                return "LAST" === e.limitType ? e2(t, t.limit, "L") : t;
            }
            class rI {
                getBundleMetadata(e, t) {
                    return rv(e).get(t).next((e)=>{
                        if (e) return {
                            id: (t = e).bundleId,
                            createTime: rm(t.createTime),
                            version: t.version
                        };
                        var t;
                    });
                }
                saveBundleMetadata(e, t) {
                    return rv(e).put({
                        bundleId: (n = t).id,
                        createTime: rf(nr(n.createTime)),
                        version: n.version
                    });
                    var n;
                }
                getNamedQuery(e, t) {
                    return rE(e).get(t).next((e)=>{
                        if (e) return {
                            name: (t = e).name,
                            query: rw(t.bundledQuery),
                            readTime: rm(t.readTime)
                        };
                        var t;
                    });
                }
                saveNamedQuery(e, t) {
                    return rE(e).put((function(e) {
                        return {
                            name: e.name,
                            readTime: rf(nr(e.readTime)),
                            bundledQuery: e.bundledQuery
                        };
                    })(t));
                }
            }
            function rv(e) {
                return rs(e, nX.store);
            }
            function rE(e) {
                return rs(e, nZ.store);
            }
            class rT {
                constructor(){
                    this.Gt = new rb();
                }
                addToCollectionParentIndex(e, t) {
                    return this.Gt.add(t), n4.resolve();
                }
                getCollectionParents(e, t) {
                    return n4.resolve(this.Gt.getEntries(t));
                }
            }
            class rb {
                constructor(){
                    this.index = {};
                }
                add(e) {
                    const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new tq(z.comparator), s = !r.has(n);
                    return (this.index[t] = r.add(n)), s;
                }
                has(e) {
                    const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
                    return r && r.has(n);
                }
                getEntries(e) {
                    return (this.index[e] || new tq(z.comparator)).toArray();
                }
            }
            class rS {
                constructor(){
                    this.zt = new rb();
                }
                addToCollectionParentIndex(e, t) {
                    if (!this.zt.has(t)) {
                        const n = t.lastSegment(), r = t.popLast();
                        e.addOnCommittedListener(()=>{
                            this.zt.add(t);
                        });
                        const s = {
                            collectionId: n,
                            parent: nM(r)
                        };
                        return rN(e).put(s);
                    }
                    return n4.resolve();
                }
                getCollectionParents(e, t) {
                    const n = [], r = IDBKeyRange.bound([
                        t,
                        ""
                    ], [
                        P(t),
                        ""
                    ], !1, !0);
                    return rN(e).Lt(r).next((e)=>{
                        for (const r of e){
                            if (r.collectionId !== t) break;
                            n.push(nP(r.parent));
                        }
                        return n;
                    });
                }
            }
            function rN(e) {
                return rs(e, nY.store);
            }
            const r$ = {
                didRun: !1,
                sequenceNumbersCollected: 0,
                targetsRemoved: 0,
                documentsRemoved: 0
            };
            class rA {
                constructor(e, t, n){
                    (this.cacheSizeCollectionThreshold = e), (this.percentileToCollect = t), (this.maximumSequenceNumbersToCollect = n);
                }
                static withCacheSize(e) {
                    return new rA(e, rA.DEFAULT_COLLECTION_PERCENTILE, rA.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            function rD(e, t, n) {
                const r = e.store(nB.store), s = e.store(nK.store), i = [], o = IDBKeyRange.only(n.batchId);
                let a = 0;
                const c = r.Kt({
                    range: o
                }, (e, t, n)=>(a++, n.delete()));
                i.push(c.next(()=>{
                    v(1 === a);
                }));
                const u = [];
                for (const h of n.mutations){
                    const l = nK.key(t, h.key.path, n.batchId);
                    i.push(s.delete(l)), u.push(h.key);
                }
                return n4.waitFor(i).next(()=>u);
            }
            function rk(e) {
                if (!e) return 0;
                let t;
                if (e.document) t = e.document;
                else if (e.unknownDocument) t = e.unknownDocument;
                else {
                    if (!e.noDocument) throw I();
                    t = e.noDocument;
                }
                return JSON.stringify(t).length;
            }
            (rA.DEFAULT_COLLECTION_PERCENTILE = 10), (rA.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3), (rA.DEFAULT = new rA(41943040, rA.DEFAULT_COLLECTION_PERCENTILE, rA.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)), (rA.DISABLED = new rA(-1, 0, 0));
            class rx {
                constructor(e, t, n, r){
                    (this.userId = e), (this.N = t), (this.Ht = n), (this.referenceDelegate = r), (this.Jt = {});
                }
                static Yt(e, t, n, r) {
                    v("" !== e.uid);
                    const s = e.isAuthenticated() ? e.uid : "";
                    return new rx(s, t, n, r);
                }
                checkEmpty(e) {
                    let t = !0;
                    const n = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return rL(e).Kt({
                        index: nB.userMutationsIndex,
                        range: n
                    }, (e, n, r)=>{
                        (t = !1), r.done();
                    }).next(()=>t);
                }
                addMutationBatch(e, t, n, r) {
                    const s = rR(e), i = rL(e);
                    return i.add({}).next((o)=>{
                        v("number" == typeof o);
                        const a = new ri(o, t, n, r), c = (function(e, t, n) {
                            const r = n.baseMutations.map((t)=>np(e.Wt, t)), s = n.mutations.map((t)=>np(e.Wt, t));
                            return new nB(t, n.batchId, n.localWriteTime.toMillis(), r, s);
                        })(this.N, this.userId, a), u = [];
                        let h = new tq((e, t)=>F(e.canonicalString(), t.canonicalString()));
                        for (const l of r){
                            const d = nK.key(this.userId, l.key.path, o);
                            (h = h.add(l.key.path.popLast())), u.push(i.put(c)), u.push(s.put(d, nK.PLACEHOLDER));
                        }
                        return (h.forEach((t)=>{
                            u.push(this.Ht.addToCollectionParentIndex(e, t));
                        }), e.addOnCommittedListener(()=>{
                            this.Jt[o] = a.keys();
                        }), n4.waitFor(u).next(()=>a));
                    });
                }
                lookupMutationBatch(e, t) {
                    return rL(e).get(t).next((e)=>e ? (v(e.userId === this.userId), rg(this.N, e)) : null);
                }
                Xt(e, t) {
                    return this.Jt[t] ? n4.resolve(this.Jt[t]) : this.lookupMutationBatch(e, t).next((e)=>{
                        if (e) {
                            const n = e.keys();
                            return (this.Jt[t] = n), n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(e, t) {
                    const n = t + 1, r = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let s = null;
                    return rL(e).Kt({
                        index: nB.userMutationsIndex,
                        range: r
                    }, (e, t, r)=>{
                        t.userId === this.userId && (v(t.batchId >= n), (s = rg(this.N, t))), r.done();
                    }).next(()=>s);
                }
                getHighestUnacknowledgedBatchId(e) {
                    const t = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY, 
                    ]);
                    let n = -1;
                    return rL(e).Kt({
                        index: nB.userMutationsIndex,
                        range: t,
                        reverse: !0
                    }, (e, t, r)=>{
                        (n = t.batchId), r.done();
                    }).next(()=>n);
                }
                getAllMutationBatches(e) {
                    const t = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return rL(e).Lt(nB.userMutationsIndex, t).next((e)=>e.map((e)=>rg(this.N, e)));
                }
                getAllMutationBatchesAffectingDocumentKey(e, t) {
                    const n = nK.prefixForPath(this.userId, t.path), r = IDBKeyRange.lowerBound(n), s = [];
                    return rR(e).Kt({
                        range: r
                    }, (n, r, i)=>{
                        const [o, a, c] = n, u = nP(a);
                        if (o === this.userId && t.path.isEqual(u)) return rL(e).get(c).next((e)=>{
                            if (!e) throw I();
                            v(e.userId === this.userId), s.push(rg(this.N, e));
                        });
                        i.done();
                    }).next(()=>s);
                }
                getAllMutationBatchesAffectingDocumentKeys(e, t) {
                    let n = new tq(F);
                    const r = [];
                    return (t.forEach((t)=>{
                        const s = nK.prefixForPath(this.userId, t.path), i = IDBKeyRange.lowerBound(s), o = rR(e).Kt({
                            range: i
                        }, (e, r, s)=>{
                            const [i, o, a] = e, c = nP(o);
                            i === this.userId && t.path.isEqual(c) ? (n = n.add(a)) : s.done();
                        });
                        r.push(o);
                    }), n4.waitFor(r).next(()=>this.Zt(e, n)));
                }
                getAllMutationBatchesAffectingQuery(e, t) {
                    const n = t.path, r = n.length + 1, s = nK.prefixForPath(this.userId, n), i = IDBKeyRange.lowerBound(s);
                    let o = new tq(F);
                    return rR(e).Kt({
                        range: i
                    }, (e, t, s)=>{
                        const [i, a, c] = e, u = nP(a);
                        i === this.userId && n.isPrefixOf(u) ? u.length === r && (o = o.add(c)) : s.done();
                    }).next(()=>this.Zt(e, o));
                }
                Zt(e, t) {
                    const n = [], r = [];
                    return (t.forEach((t)=>{
                        r.push(rL(e).get(t).next((e)=>{
                            if (null === e) throw I();
                            v(e.userId === this.userId), n.push(rg(this.N, e));
                        }));
                    }), n4.waitFor(r).next(()=>n));
                }
                removeMutationBatch(e, t) {
                    return rD(e.Qt, this.userId, t).next((n)=>(e.addOnCommittedListener(()=>{
                            this.te(t.batchId);
                        }), n4.forEach(n, (t)=>this.referenceDelegate.markPotentiallyOrphaned(e, t))));
                }
                te(e) {
                    delete this.Jt[e];
                }
                performConsistencyCheck(e) {
                    return this.checkEmpty(e).next((t)=>{
                        if (!t) return n4.resolve();
                        const n = IDBKeyRange.lowerBound(nK.prefixForUser(this.userId)), r = [];
                        return rR(e).Kt({
                            range: n
                        }, (e, t, n)=>{
                            if (e[0] === this.userId) {
                                const s = nP(e[1]);
                                r.push(s);
                            } else n.done();
                        }).next(()=>{
                            v(0 === r.length);
                        });
                    });
                }
                containsKey(e, t) {
                    return rC(e, this.userId, t);
                }
                ee(e) {
                    return rM(e).get(this.userId).next((e)=>e || new nq(this.userId, -1, ""));
                }
            }
            function rC(e, t, n) {
                const r = nK.prefixForPath(t, n.path), s = r[1], i = IDBKeyRange.lowerBound(r);
                let o = !1;
                return rR(e).Kt({
                    range: i,
                    qt: !0
                }, (e, n, r)=>{
                    const [i, a, c] = e;
                    i === t && a === s && (o = !0), r.done();
                }).next(()=>o);
            }
            function rL(e) {
                return rs(e, nB.store);
            }
            function rR(e) {
                return rs(e, nK.store);
            }
            function rM(e) {
                return rs(e, nq.store);
            }
            class rF {
                constructor(e){
                    this.ne = e;
                }
                next() {
                    return (this.ne += 2), this.ne;
                }
                static se() {
                    return new rF(0);
                }
                static ie() {
                    return new rF(-1);
                }
            }
            class rO {
                constructor(e, t){
                    (this.referenceDelegate = e), (this.N = t);
                }
                allocateTargetId(e) {
                    return this.re(e).next((t)=>{
                        const n = new rF(t.highestTargetId);
                        return ((t.highestTargetId = n.next()), this.oe(e, t).next(()=>t.highestTargetId));
                    });
                }
                getLastRemoteSnapshotVersion(e) {
                    return this.re(e).next((e)=>U.fromTimestamp(new V(e.lastRemoteSnapshotVersion.seconds, e.lastRemoteSnapshotVersion.nanoseconds)));
                }
                getHighestSequenceNumber(e) {
                    return this.re(e).next((e)=>e.highestListenSequenceNumber);
                }
                setTargetsMetadata(e, t, n) {
                    return this.re(e).next((r)=>((r.highestListenSequenceNumber = t), n && (r.lastRemoteSnapshotVersion = n.toTimestamp()), t > r.highestListenSequenceNumber && (r.highestListenSequenceNumber = t), this.oe(e, r)));
                }
                addTargetData(e, t) {
                    return this.ce(e, t).next(()=>this.re(e).next((n)=>((n.targetCount += 1), this.ae(t, n), this.oe(e, n))));
                }
                updateTargetData(e, t) {
                    return this.ce(e, t);
                }
                removeTargetData(e, t) {
                    return this.removeMatchingKeysForTargetId(e, t.targetId).next(()=>rP(e).delete(t.targetId)).next(()=>this.re(e)).next((t)=>(v(t.targetCount > 0), (t.targetCount -= 1), this.oe(e, t)));
                }
                removeTargets(e, t, n) {
                    let r = 0;
                    const s = [];
                    return rP(e).Kt((i, o)=>{
                        const a = rp(o);
                        a.sequenceNumber <= t && null === n.get(a.targetId) && (r++, s.push(this.removeTargetData(e, a)));
                    }).next(()=>n4.waitFor(s)).next(()=>r);
                }
                forEachTarget(e, t) {
                    return rP(e).Kt((e, n)=>{
                        const r = rp(n);
                        t(r);
                    });
                }
                re(e) {
                    return rV(e).get(nW.key).next((e)=>(v(null !== e), e));
                }
                oe(e, t) {
                    return rV(e).put(nW.key, t);
                }
                ce(e, t) {
                    return rP(e).put(ry(this.N, t));
                }
                ae(e, t) {
                    let n = !1;
                    return (e.targetId > t.highestTargetId && ((t.highestTargetId = e.targetId), (n = !0)), e.sequenceNumber > t.highestListenSequenceNumber && ((t.highestListenSequenceNumber = e.sequenceNumber), (n = !0)), n);
                }
                getTargetCount(e) {
                    return this.re(e).next((e)=>e.targetCount);
                }
                getTargetData(e, t) {
                    const n = e$(t), r = IDBKeyRange.bound([
                        n,
                        Number.NEGATIVE_INFINITY
                    ], [
                        n,
                        Number.POSITIVE_INFINITY
                    ]);
                    let s = null;
                    return rP(e).Kt({
                        range: r,
                        index: nQ.queryTargetsIndexName
                    }, (e, n, r)=>{
                        const i = rp(n);
                        eD(t, i.target) && ((s = i), r.done());
                    }).next(()=>s);
                }
                addMatchingKeys(e, t, n) {
                    const r = [], s = rU(e);
                    return (t.forEach((t)=>{
                        const i = nM(t.path);
                        r.push(s.put(new nH(n, i))), r.push(this.referenceDelegate.addReference(e, n, t));
                    }), n4.waitFor(r));
                }
                removeMatchingKeys(e, t, n) {
                    const r = rU(e);
                    return n4.forEach(t, (t)=>{
                        const s = nM(t.path);
                        return n4.waitFor([
                            r.delete([
                                n,
                                s
                            ]),
                            this.referenceDelegate.removeReference(e, n, t), 
                        ]);
                    });
                }
                removeMatchingKeysForTargetId(e, t) {
                    const n = rU(e), r = IDBKeyRange.bound([
                        t
                    ], [
                        t + 1
                    ], !1, !0);
                    return n.delete(r);
                }
                getMatchingKeysForTargetId(e, t) {
                    const n = IDBKeyRange.bound([
                        t
                    ], [
                        t + 1
                    ], !1, !0), r = rU(e);
                    let s = tW();
                    return r.Kt({
                        range: n,
                        qt: !0
                    }, (e, t, n)=>{
                        const r = nP(e[1]), i = new eo(r);
                        s = s.add(i);
                    }).next(()=>s);
                }
                containsKey(e, t) {
                    const n = nM(t.path), r = IDBKeyRange.bound([
                        n
                    ], [
                        P(n)
                    ], !1, !0);
                    let s = 0;
                    return rU(e).Kt({
                        index: nH.documentTargetsIndex,
                        qt: !0,
                        range: r
                    }, ([e, t], n, r)=>{
                        0 !== e && (s++, r.done());
                    }).next(()=>s > 0);
                }
                Tt(e, t) {
                    return rP(e).get(t).next((e)=>(e ? rp(e) : null));
                }
            }
            function rP(e) {
                return rs(e, nQ.store);
            }
            function rV(e) {
                return rs(e, nW.store);
            }
            function rU(e) {
                return rs(e, nH.store);
            }
            async function rq(e) {
                if (e.code !== b.FAILED_PRECONDITION || e.message !== n1) throw e;
                g("LocalStore", "Unexpectedly lost primary lease");
            }
            function rB([e, t], [n, r]) {
                const s = F(e, n);
                return 0 === s ? F(t, r) : s;
            }
            class rK {
                constructor(e){
                    (this.ue = e), (this.buffer = new tq(rB)), (this.he = 0);
                }
                le() {
                    return ++this.he;
                }
                fe(e) {
                    const t = [
                        e,
                        this.le()
                    ];
                    if (this.buffer.size < this.ue) this.buffer = this.buffer.add(t);
                    else {
                        const n = this.buffer.last();
                        rB(t, n) < 0 && (this.buffer = this.buffer.delete(n).add(t));
                    }
                }
                get maxValue() {
                    return this.buffer.last()[0];
                }
            }
            class r_ {
                constructor(e, t){
                    (this.garbageCollector = e), (this.asyncQueue = t), (this.de = !1), (this.we = null);
                }
                start(e) {
                    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this._e(e);
                }
                stop() {
                    this.we && (this.we.cancel(), (this.we = null));
                }
                get started() {
                    return null !== this.we;
                }
                _e(e) {
                    const t = this.de ? 3e5 : 6e4;
                    g("LruGarbageCollector", `Garbage collection scheduled in ${t}ms`), (this.we = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", t, async ()=>{
                        (this.we = null), (this.de = !0);
                        try {
                            await e.collectGarbage(this.garbageCollector);
                        } catch (t) {
                            n9(t) ? g("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", t) : await rq(t);
                        }
                        await this._e(e);
                    }));
                }
            }
            class rz {
                constructor(e, t){
                    (this.me = e), (this.params = t);
                }
                calculateTargetCount(e, t) {
                    return this.me.ge(e).next((e)=>Math.floor((t / 100) * e));
                }
                nthSequenceNumber(e, t) {
                    if (0 === t) return n4.resolve(L.T);
                    const n = new rK(t);
                    return this.me.forEachTarget(e, (e)=>n.fe(e.sequenceNumber)).next(()=>this.me.ye(e, (e)=>n.fe(e))).next(()=>n.maxValue);
                }
                removeTargets(e, t, n) {
                    return this.me.removeTargets(e, t, n);
                }
                removeOrphanedDocuments(e, t) {
                    return this.me.removeOrphanedDocuments(e, t);
                }
                collect(e, t) {
                    return -1 === this.params.cacheSizeCollectionThreshold ? (g("LruGarbageCollector", "Garbage collection skipped; disabled"), n4.resolve(r$)) : this.getCacheSize(e).next((n)=>n < this.params.cacheSizeCollectionThreshold ? (g("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), r$) : this.pe(e, t));
                }
                getCacheSize(e) {
                    return this.me.getCacheSize(e);
                }
                pe(e, t) {
                    let n, r, s, i, o, a, c;
                    const u = Date.now();
                    return this.calculateTargetCount(e, this.params.percentileToCollect).next((t)=>(t > this.params.maximumSequenceNumbersToCollect ? (g("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`), (r = this.params.maximumSequenceNumbersToCollect)) : (r = t), (i = Date.now()), this.nthSequenceNumber(e, r))).next((r)=>((n = r), (o = Date.now()), this.removeTargets(e, n, t))).next((t)=>((s = t), (a = Date.now()), this.removeOrphanedDocuments(e, n))).next((e)=>{
                        if (((c = Date.now()), f() <= LogLevel.DEBUG)) {
                            g("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${i - u}ms\n\tDetermined least recently used ${r} in ` + (o - i) + "ms\n" + `\tRemoved ${s} targets in ` + (a - o) + "ms\n" + `\tRemoved ${e} documents in ` + (c - a) + "ms\n" + `Total Duration: ${c - u}ms`);
                        }
                        return n4.resolve({
                            didRun: !0,
                            sequenceNumbersCollected: r,
                            targetsRemoved: s,
                            documentsRemoved: e
                        });
                    });
                }
            }
            class rj {
                constructor(e, t){
                    (this.db = e), (this.garbageCollector = (function(e, t) {
                        return new rz(e, t);
                    })(this, t));
                }
                ge(e) {
                    const t = this.Te(e);
                    return this.db.getTargetCache().getTargetCount(e).next((e)=>t.next((t)=>e + t));
                }
                Te(e) {
                    let t = 0;
                    return this.ye(e, (e)=>{
                        t++;
                    }).next(()=>t);
                }
                forEachTarget(e, t) {
                    return this.db.getTargetCache().forEachTarget(e, t);
                }
                ye(e, t) {
                    return this.Ee(e, (e, n)=>t(n));
                }
                addReference(e, t, n) {
                    return rG(e, n);
                }
                removeReference(e, t, n) {
                    return rG(e, n);
                }
                removeTargets(e, t, n) {
                    return this.db.getTargetCache().removeTargets(e, t, n);
                }
                markPotentiallyOrphaned(e, t) {
                    return rG(e, t);
                }
                Ie(e, t) {
                    return (function(e, t) {
                        let n = !1;
                        return rM(e).jt((r)=>rC(e, r, t).next((e)=>(e && (n = !0), n4.resolve(!e)))).next(()=>n);
                    })(e, t);
                }
                removeOrphanedDocuments(e, t) {
                    const n = this.db.getRemoteDocumentCache().newChangeBuffer(), r = [];
                    let s = 0;
                    return this.Ee(e, (i, o)=>{
                        if (o <= t) {
                            const a = this.Ie(e, i).next((t)=>{
                                if (!t) return (s++, n.getEntry(e, i).next(()=>(n.removeEntry(i), rU(e).delete([
                                        0,
                                        nM(i.path), 
                                    ]))));
                            });
                            r.push(a);
                        }
                    }).next(()=>n4.waitFor(r)).next(()=>n.apply(e)).next(()=>s);
                }
                removeTarget(e, t) {
                    const n = t.withSequenceNumber(e.currentSequenceNumber);
                    return this.db.getTargetCache().updateTargetData(e, n);
                }
                updateLimboDocument(e, t) {
                    return rG(e, t);
                }
                Ee(e, t) {
                    const n = rU(e);
                    let r, s = L.T;
                    return n.Kt({
                        index: nH.documentTargetsIndex
                    }, ([e, n], { path: i , sequenceNumber: o  })=>{
                        0 === e ? (s !== L.T && t(new eo(nP(r)), s), (s = o), (r = i)) : (s = L.T);
                    }).next(()=>{
                        s !== L.T && t(new eo(nP(r)), s);
                    });
                }
                getCacheSize(e) {
                    return this.db.getRemoteDocumentCache().getSize(e);
                }
            }
            function rG(e, t) {
                return rU(e).put((function(e, t) {
                    return new nH(0, nM(e.path), t);
                })(t, e.currentSequenceNumber));
            }
            class rQ {
                constructor(e, t){
                    (this.mapKeyFn = e), (this.equalsFn = t), (this.inner = {});
                }
                get(e) {
                    const t = this.mapKeyFn(e), n = this.inner[t];
                    if (void 0 !== n) for (const [r, s] of n)if (this.equalsFn(r, e)) return s;
                }
                has(e) {
                    return void 0 !== this.get(e);
                }
                set(e, t) {
                    const n = this.mapKeyFn(e), r = this.inner[n];
                    if (void 0 !== r) {
                        for(let s = 0; s < r.length; s++)if (this.equalsFn(r[s][0], e)) return void (r[s] = [
                            e,
                            t
                        ]);
                        r.push([
                            e,
                            t
                        ]);
                    } else this.inner[n] = [
                        [
                            e,
                            t
                        ]
                    ];
                }
                delete(e) {
                    const t = this.mapKeyFn(e), n = this.inner[t];
                    if (void 0 === n) return !1;
                    for(let r = 0; r < n.length; r++)if (this.equalsFn(n[r][0], e)) return (1 === n.length ? delete this.inner[t] : n.splice(r, 1), !0);
                    return !1;
                }
                forEach(e) {
                    B(this.inner, (t, n)=>{
                        for (const [r, s] of n)e(r, s);
                    });
                }
                isEmpty() {
                    return K(this.inner);
                }
            }
            class rH {
                constructor(){
                    (this.changes = new rQ((e)=>e.toString(), (e, t)=>e.isEqual(t))), (this.changesApplied = !1);
                }
                getReadTime(e) {
                    const t = this.changes.get(e);
                    return t ? t.readTime : U.min();
                }
                addEntry(e, t) {
                    this.assertNotApplied(), this.changes.set(e.key, {
                        document: e,
                        readTime: t
                    });
                }
                removeEntry(e, t = null) {
                    this.assertNotApplied(), this.changes.set(e, {
                        document: eb.newInvalidDocument(e),
                        readTime: t
                    });
                }
                getEntry(e, t) {
                    this.assertNotApplied();
                    const n = this.changes.get(t);
                    return void 0 !== n ? n4.resolve(n.document) : this.getFromCache(e, t);
                }
                getEntries(e, t) {
                    return this.getAllFromCache(e, t);
                }
                apply(e) {
                    return (this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(e));
                }
                assertNotApplied() {}
            }
            class rW {
                constructor(e, t){
                    (this.N = e), (this.Ht = t);
                }
                addEntry(e, t, n) {
                    return rX(e).put(rZ(t), n);
                }
                removeEntry(e, t) {
                    const n = rX(e), r = rZ(t);
                    return n.delete(r);
                }
                updateMetadata(e, t) {
                    return this.getMetadata(e).next((n)=>((n.byteSize += t), this.Ae(e, n)));
                }
                getEntry(e, t) {
                    return rX(e).get(rZ(t)).next((e)=>this.Re(t, e));
                }
                be(e, t) {
                    return rX(e).get(rZ(t)).next((e)=>({
                            document: this.Re(t, e),
                            size: rk(e)
                        }));
                }
                getEntries(e, t) {
                    let n = t_();
                    return this.Pe(e, t, (e, t)=>{
                        const r = this.Re(e, t);
                        n = n.insert(e, r);
                    }).next(()=>n);
                }
                ve(e, t) {
                    let n = t_(), r = new tP(eo.comparator);
                    return this.Pe(e, t, (e, t)=>{
                        const s = this.Re(e, t);
                        (n = n.insert(e, s)), (r = r.insert(e, rk(t)));
                    }).next(()=>({
                            documents: n,
                            Ve: r
                        }));
                }
                Pe(e, t, n) {
                    if (t.isEmpty()) return n4.resolve();
                    const r = IDBKeyRange.bound(t.first().path.toArray(), t.last().path.toArray()), s = t.getIterator();
                    let i = s.getNext();
                    return rX(e).Kt({
                        range: r
                    }, (e, t, r)=>{
                        const o = eo.fromSegments(e);
                        for(; i && eo.comparator(i, o) < 0;)n(i, null), (i = s.getNext());
                        i && i.isEqual(o) && (n(i, t), (i = s.hasNext() ? s.getNext() : null)), i ? r.Mt(i.path.toArray()) : r.done();
                    }).next(()=>{
                        for(; i;)n(i, null), (i = s.hasNext() ? s.getNext() : null);
                    });
                }
                getDocumentsMatchingQuery(e, t, n) {
                    let r = t_();
                    const s = t.path.length + 1, i = {};
                    if (n.isEqual(U.min())) {
                        const o = t.path.toArray();
                        i.range = IDBKeyRange.lowerBound(o);
                    } else {
                        const a = t.path.toArray(), c = rl(n);
                        (i.range = IDBKeyRange.lowerBound([
                            a,
                            c
                        ], !0)), (i.index = nj.collectionReadTimeIndex);
                    }
                    return rX(e).Kt(i, (e, n, i)=>{
                        if (e.length !== s) return;
                        const o = ru(this.N, n);
                        t.path.isPrefixOf(o.key.path) ? e5(t, o) && (r = r.insert(o.key, o)) : i.done();
                    }).next(()=>r);
                }
                newChangeBuffer(e) {
                    return new rY(this, !!e && e.trackRemovals);
                }
                getSize(e) {
                    return this.getMetadata(e).next((e)=>e.byteSize);
                }
                getMetadata(e) {
                    return rJ(e).get(nG.key).next((e)=>(v(!!e), e));
                }
                Ae(e, t) {
                    return rJ(e).put(nG.key, t);
                }
                Re(e, t) {
                    if (t) {
                        const n = ru(this.N, t);
                        if (!(n.isNoDocument() && n.version.isEqual(U.min()))) return n;
                    }
                    return eb.newInvalidDocument(e);
                }
            }
            class rY extends (null && rH) {
                constructor(e, t){
                    super(), (this.Se = e), (this.trackRemovals = t), (this.De = new rQ((e)=>e.toString(), (e, t)=>e.isEqual(t)));
                }
                applyChanges(e) {
                    const t = [];
                    let n = 0, r = new tq((e, t)=>F(e.canonicalString(), t.canonicalString()));
                    return (this.changes.forEach((s, i)=>{
                        const o = this.De.get(s);
                        if (i.document.isValidDocument()) {
                            const a = rh(this.Se.N, i.document, this.getReadTime(s));
                            r = r.add(s.path.popLast());
                            const c = rk(a);
                            (n += c - o), t.push(this.Se.addEntry(e, s, a));
                        } else if (((n -= o), this.trackRemovals)) {
                            const u = rh(this.Se.N, eb.newNoDocument(s, U.min()), this.getReadTime(s));
                            t.push(this.Se.addEntry(e, s, u));
                        } else t.push(this.Se.removeEntry(e, s));
                    }), r.forEach((n)=>{
                        t.push(this.Se.Ht.addToCollectionParentIndex(e, n));
                    }), t.push(this.Se.updateMetadata(e, n)), n4.waitFor(t));
                }
                getFromCache(e, t) {
                    return this.Se.be(e, t).next((e)=>(this.De.set(t, e.size), e.document));
                }
                getAllFromCache(e, t) {
                    return this.Se.ve(e, t).next(({ documents: e , Ve: t  })=>(t.forEach((e, t)=>{
                            this.De.set(e, t);
                        }), e));
                }
            }
            function rJ(e) {
                return rs(e, nG.store);
            }
            function rX(e) {
                return rs(e, nj.store);
            }
            function rZ(e) {
                return e.path.toArray();
            }
            class r0 {
                constructor(e){
                    this.N = e;
                }
                Ct(e, t, n, r) {
                    v(n < r && n >= 0 && r <= 11);
                    const s = new n3("createOrUpgrade", t);
                    n < 1 && r >= 1 && ((function(e) {
                        e.createObjectStore(nU.store);
                    })(e), (function(e) {
                        e.createObjectStore(nq.store, {
                            keyPath: nq.keyPath
                        });
                        e.createObjectStore(nB.store, {
                            keyPath: nB.keyPath,
                            autoIncrement: !0
                        }).createIndex(nB.userMutationsIndex, nB.userMutationsKeyPath, {
                            unique: !0
                        }), e.createObjectStore(nK.store);
                    })(e), r1(e), (function(e) {
                        e.createObjectStore(nj.store);
                    })(e));
                    let i = n4.resolve();
                    return (n < 3 && r >= 3 && (0 !== n && (!(function(e) {
                        e.deleteObjectStore(nH.store), e.deleteObjectStore(nQ.store), e.deleteObjectStore(nW.store);
                    })(e), r1(e)), (i = i.next(()=>(function(e) {
                            const t = e.store(nW.store), n = new nW(0, 0, U.min().toTimestamp(), 0);
                            return t.put(nW.key, n);
                        })(s)))), n < 4 && r >= 4 && (0 !== n && (i = i.next(()=>(function(e, t) {
                            return t.store(nB.store).Lt().next((n)=>{
                                e.deleteObjectStore(nB.store);
                                e.createObjectStore(nB.store, {
                                    keyPath: nB.keyPath,
                                    autoIncrement: !0
                                }).createIndex(nB.userMutationsIndex, nB.userMutationsKeyPath, {
                                    unique: !0
                                });
                                const r = t.store(nB.store), s = n.map((e)=>r.put(e));
                                return n4.waitFor(s);
                            });
                        })(e, s))), (i = i.next(()=>{
                        !(function(e) {
                            e.createObjectStore(nJ.store, {
                                keyPath: nJ.keyPath
                            });
                        })(e);
                    }))), n < 5 && r >= 5 && (i = i.next(()=>this.Ce(s))), n < 6 && r >= 6 && (i = i.next(()=>((function(e) {
                            e.createObjectStore(nG.store);
                        })(e), this.Ne(s)))), n < 7 && r >= 7 && (i = i.next(()=>this.xe(s))), n < 8 && r >= 8 && (i = i.next(()=>this.ke(e, s))), n < 9 && r >= 9 && (i = i.next(()=>{
                        !(function(e) {
                            e.objectStoreNames.contains("remoteDocumentChanges") && e.deleteObjectStore("remoteDocumentChanges");
                        })(e), (function(e) {
                            const t = e.objectStore(nj.store);
                            t.createIndex(nj.readTimeIndex, nj.readTimeIndexPath, {
                                unique: !1
                            }), t.createIndex(nj.collectionReadTimeIndex, nj.collectionReadTimeIndexPath, {
                                unique: !1
                            });
                        })(t);
                    })), n < 10 && r >= 10 && (i = i.next(()=>this.$e(s))), n < 11 && r >= 11 && (i = i.next(()=>{
                        !(function(e) {
                            e.createObjectStore(nX.store, {
                                keyPath: nX.keyPath
                            });
                        })(e), (function(e) {
                            e.createObjectStore(nZ.store, {
                                keyPath: nZ.keyPath
                            });
                        })(e);
                    })), i);
                }
                Ne(e) {
                    let t = 0;
                    return e.store(nj.store).Kt((e, n)=>{
                        t += rk(n);
                    }).next(()=>{
                        const n = new nG(t);
                        return e.store(nG.store).put(nG.key, n);
                    });
                }
                Ce(e) {
                    const t = e.store(nq.store), n = e.store(nB.store);
                    return t.Lt().next((t)=>n4.forEach(t, (t)=>{
                            const r = IDBKeyRange.bound([
                                t.userId,
                                -1
                            ], [
                                t.userId,
                                t.lastAcknowledgedBatchId
                            ]);
                            return n.Lt(nB.userMutationsIndex, r).next((n)=>n4.forEach(n, (n)=>{
                                    v(n.userId === t.userId);
                                    const r = rg(this.N, n);
                                    return rD(e, t.userId, r).next(()=>{});
                                }));
                        }));
                }
                xe(e) {
                    const t = e.store(nH.store), n = e.store(nj.store);
                    return e.store(nW.store).get(nW.key).next((e)=>{
                        const r = [];
                        return n.Kt((n, s)=>{
                            const i = new z(n), o = (function(e) {
                                return [
                                    0,
                                    nM(e)
                                ];
                            })(i);
                            r.push(t.get(o).next((n)=>n ? n4.resolve() : ((n)=>t.put(new nH(0, nM(n), e.highestListenSequenceNumber)))(i)));
                        }).next(()=>n4.waitFor(r));
                    });
                }
                ke(e, t) {
                    e.createObjectStore(nY.store, {
                        keyPath: nY.keyPath
                    });
                    const n = t.store(nY.store), r = new rb(), s = (e)=>{
                        if (r.add(e)) {
                            const t = e.lastSegment(), s = e.popLast();
                            return n.put({
                                collectionId: t,
                                parent: nM(s)
                            });
                        }
                    };
                    return t.store(nj.store).Kt({
                        qt: !0
                    }, (e, t)=>{
                        const n = new z(e);
                        return s(n.popLast());
                    }).next(()=>t.store(nK.store).Kt({
                            qt: !0
                        }, ([e, t, n], r)=>{
                            const i = nP(t);
                            return s(i.popLast());
                        }));
                }
                $e(e) {
                    const t = e.store(nQ.store);
                    return t.Kt((e, n)=>{
                        const r = rp(n), s = ry(this.N, r);
                        return t.put(s);
                    });
                }
            }
            function r1(e) {
                e.createObjectStore(nH.store, {
                    keyPath: nH.keyPath
                }).createIndex(nH.documentTargetsIndex, nH.documentTargetsKeyPath, {
                    unique: !0
                });
                e.createObjectStore(nQ.store, {
                    keyPath: nQ.keyPath
                }).createIndex(nQ.queryTargetsIndexName, nQ.queryTargetsKeyPath, {
                    unique: !0
                }), e.createObjectStore(nW.store);
            }
            const r2 = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
            class r4 {
                constructor(e, t, n, r, s, i, o, a, c, u){
                    if (((this.allowTabSynchronization = e), (this.persistenceKey = t), (this.clientId = n), (this.Oe = s), (this.window = i), (this.document = o), (this.Fe = c), (this.Me = u), (this.Le = null), (this.Be = !1), (this.isPrimary = !1), (this.networkEnabled = !0), (this.Ue = null), (this.inForeground = !1), (this.qe = null), (this.Ke = null), (this.je = Number.NEGATIVE_INFINITY), (this.Qe = (e)=>Promise.resolve()), !r4.bt())) throw new S(b.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
                    (this.referenceDelegate = new rj(this, r)), (this.We = t + "main"), (this.N = new rc(a)), (this.Ge = new n6(this.We, 11, new r0(this.N))), (this.ze = new rO(this.referenceDelegate, this.N)), (this.Ht = new rS()), (this.He = (function(e, t) {
                        return new rW(e, t);
                    })(this.N, this.Ht)), (this.Je = new rI()), this.window && this.window.localStorage ? (this.Ye = this.window.localStorage) : ((this.Ye = null), !1 === u && p("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
                }
                start() {
                    return this.Xe().then(()=>{
                        if (!this.isPrimary && !this.allowTabSynchronization) throw new S(b.FAILED_PRECONDITION, r2);
                        return (this.Ze(), this.tn(), this.en(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (e)=>this.ze.getHighestSequenceNumber(e)));
                    }).then((e)=>{
                        this.Le = new L(e, this.Fe);
                    }).then(()=>{
                        this.Be = !0;
                    }).catch((e)=>(this.Ge && this.Ge.close(), Promise.reject(e)));
                }
                nn(e) {
                    return ((this.Qe = async (t)=>{
                        if (this.started) return e(t);
                    }), e(this.isPrimary));
                }
                setDatabaseDeletedListener(e) {
                    this.Ge.xt(async (t)=>{
                        null === t.newVersion && (await e());
                    });
                }
                setNetworkEnabled(e) {
                    this.networkEnabled !== e && ((this.networkEnabled = e), this.Oe.enqueueAndForget(async ()=>{
                        this.started && (await this.Xe());
                    }));
                }
                Xe() {
                    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (e)=>r6(e).put(new nJ(this.clientId, Date.now(), this.networkEnabled, this.inForeground)).next(()=>{
                            if (this.isPrimary) return this.sn(e).next((e)=>{
                                e || ((this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)));
                            });
                        }).next(()=>this.rn(e)).next((t)=>this.isPrimary && !t ? this.on(e).next(()=>!1) : !!t && this.cn(e).next(()=>!0))).catch((e)=>{
                        if (n9(e)) return (g("IndexedDbPersistence", "Failed to extend owner lease: ", e), this.isPrimary);
                        if (!this.allowTabSynchronization) throw e;
                        return (g("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", e), !1);
                    }).then((e)=>{
                        this.isPrimary !== e && this.Oe.enqueueRetryable(()=>this.Qe(e)), (this.isPrimary = e);
                    });
                }
                sn(e) {
                    return r3(e).get(nU.key).next((e)=>n4.resolve(this.an(e)));
                }
                un(e) {
                    return r6(e).delete(this.clientId);
                }
                async hn() {
                    if (this.isPrimary && !this.ln(this.je, 18e5)) {
                        this.je = Date.now();
                        const e = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (e)=>{
                            const t = rs(e, nJ.store);
                            return t.Lt().next((e)=>{
                                const n = this.fn(e, 18e5), r = e.filter((e)=>-1 === n.indexOf(e));
                                return n4.forEach(r, (e)=>t.delete(e.clientId)).next(()=>r);
                            });
                        }).catch(()=>[]);
                        if (this.Ye) for (const t of e)this.Ye.removeItem(this.dn(t.clientId));
                    }
                }
                en() {
                    this.Ke = this.Oe.enqueueAfterDelay("client_metadata_refresh", 4e3, ()=>this.Xe().then(()=>this.hn()).then(()=>this.en()));
                }
                an(e) {
                    return !!e && e.ownerId === this.clientId;
                }
                rn(e) {
                    if (this.Me) return n4.resolve(!0);
                    return r3(e).get(nU.key).next((t)=>{
                        if (null !== t && this.ln(t.leaseTimestampMs, 5e3) && !this.wn(t.ownerId)) {
                            if (this.an(t) && this.networkEnabled) return !0;
                            if (!this.an(t)) {
                                if (!t.allowTabSynchronization) throw new S(b.FAILED_PRECONDITION, r2);
                                return !1;
                            }
                        }
                        return (!(!this.networkEnabled || !this.inForeground) || r6(e).Lt().next((e)=>void 0 === this.fn(e, 5e3).find((e)=>{
                                if (this.clientId !== e.clientId) {
                                    const t = !this.networkEnabled && e.networkEnabled, n = !this.inForeground && e.inForeground, r = this.networkEnabled === e.networkEnabled;
                                    if (t || (n && r)) return !0;
                                }
                                return !1;
                            })));
                    }).next((e)=>(this.isPrimary !== e && g("IndexedDbPersistence", `Client ${e ? "is" : "is not"} eligible for a primary lease.`), e));
                }
                async shutdown() {
                    (this.Be = !1), this._n(), this.Ke && (this.Ke.cancel(), (this.Ke = null)), this.mn(), this.gn(), await this.Ge.runTransaction("shutdown", "readwrite", [
                        nU.store,
                        nJ.store
                    ], (e)=>{
                        const t = new rr(e, L.T);
                        return this.on(t).next(()=>this.un(t));
                    }), this.Ge.close(), this.yn();
                }
                fn(e, t) {
                    return e.filter((e)=>this.ln(e.updateTimeMs, t) && !this.wn(e.clientId));
                }
                pn() {
                    return this.runTransaction("getActiveClients", "readonly", (e)=>r6(e).Lt().next((e)=>this.fn(e, 18e5).map((e)=>e.clientId)));
                }
                get started() {
                    return this.Be;
                }
                getMutationQueue(e) {
                    return rx.Yt(e, this.N, this.Ht, this.referenceDelegate);
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
                runTransaction(e, t, n) {
                    g("IndexedDbPersistence", "Starting transaction:", e);
                    const r = "readonly" === t ? "readonly" : "readwrite";
                    let s;
                    return this.Ge.runTransaction(e, r, n0, (r)=>((s = new rr(r, this.Le ? this.Le.next() : L.T)), "readwrite-primary" === t ? this.sn(s).next((e)=>!!e || this.rn(s)).next((t)=>{
                            if (!t) throw ((p(`Failed to obtain primary lease for action '${e}'.`), (this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)), new S(b.FAILED_PRECONDITION, n1)));
                            return n(s);
                        }).next((e)=>this.cn(s).next(()=>e)) : this.Tn(s).next(()=>n(s)))).then((e)=>(s.raiseOnCommittedEvent(), e));
                }
                Tn(e) {
                    return r3(e).get(nU.key).next((e)=>{
                        if (null !== e && this.ln(e.leaseTimestampMs, 5e3) && !this.wn(e.ownerId) && !this.an(e) && !(this.Me || (this.allowTabSynchronization && e.allowTabSynchronization))) throw new S(b.FAILED_PRECONDITION, r2);
                    });
                }
                cn(e) {
                    const t = new nU(this.clientId, this.allowTabSynchronization, Date.now());
                    return r3(e).put(nU.key, t);
                }
                static bt() {
                    return n6.bt();
                }
                on(e) {
                    const t = r3(e);
                    return t.get(nU.key).next((e)=>this.an(e) ? (g("IndexedDbPersistence", "Releasing primary lease."), t.delete(nU.key)) : n4.resolve());
                }
                ln(e, t) {
                    const n = Date.now();
                    return (!(e < n - t) && (!(e > n) || (p(`Detected an update time that is in the future: ${e} > ${n}`), !1)));
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
                    var e;
                    "function" == typeof (null === (e = this.window) || void 0 === e ? void 0 : e.addEventListener) && ((this.Ue = ()=>{
                        this._n(), isSafari() && navigator.appVersion.match("Version/14") && this.Oe.enterRestrictedMode(!0), this.Oe.enqueueAndForget(()=>this.shutdown());
                    }), this.window.addEventListener("pagehide", this.Ue));
                }
                gn() {
                    this.Ue && (this.window.removeEventListener("pagehide", this.Ue), (this.Ue = null));
                }
                wn(e) {
                    var t;
                    try {
                        const n = null !== (null === (t = this.Ye) || void 0 === t ? void 0 : t.getItem(this.dn(e)));
                        return (g("IndexedDbPersistence", `Client '${e}' ${n ? "is" : "is not"} zombied in LocalStorage`), n);
                    } catch (r) {
                        return (p("IndexedDbPersistence", "Failed to get zombied client id.", r), !1);
                    }
                }
                _n() {
                    if (this.Ye) try {
                        this.Ye.setItem(this.dn(this.clientId), String(Date.now()));
                    } catch (e) {
                        p("Failed to set zombie client id.", e);
                    }
                }
                yn() {
                    if (this.Ye) try {
                        this.Ye.removeItem(this.dn(this.clientId));
                    } catch (e) {}
                }
                dn(e) {
                    return `firestore_zombie_${this.persistenceKey}_${e}`;
                }
            }
            function r3(e) {
                return rs(e, nU.store);
            }
            function r6(e) {
                return rs(e, nJ.store);
            }
            function r5(e, t) {
                let n = e.projectId;
                return (e.isDefaultDatabase || (n += "." + e.database), "firestore/" + t + "/" + n + "/");
            }
            class r8 {
                constructor(e, t){
                    (this.progress = e), (this.En = t);
                }
            }
            class r9 {
                constructor(e, t, n){
                    (this.He = e), (this.In = t), (this.Ht = n);
                }
                An(e, t) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(e, t).next((n)=>this.Rn(e, t, n));
                }
                Rn(e, t, n) {
                    return this.He.getEntry(e, t).next((e)=>{
                        for (const t of n)t.applyToLocalView(e);
                        return e;
                    });
                }
                bn(e, t) {
                    e.forEach((e, n)=>{
                        for (const r of t)r.applyToLocalView(n);
                    });
                }
                Pn(e, t) {
                    return this.He.getEntries(e, t).next((t)=>this.vn(e, t).next(()=>t));
                }
                vn(e, t) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e)=>this.bn(t, e));
                }
                getDocumentsMatchingQuery(e, t, n) {
                    return (function(e) {
                        return (eo.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length);
                    })(t) ? this.Vn(e, t.path) : eZ(t) ? this.Sn(e, t, n) : this.Dn(e, t, n);
                }
                Vn(e, t) {
                    return this.An(e, new eo(t)).next((e)=>{
                        let t = tj();
                        return (e.isFoundDocument() && (t = t.insert(e.key, e)), t);
                    });
                }
                Sn(e, t, n) {
                    const r = t.collectionGroup;
                    let s = tj();
                    return this.Ht.getCollectionParents(e, r).next((i)=>n4.forEach(i, (i)=>{
                            const o = (function(e, t) {
                                return new eG(t, null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
                            })(t, i.child(r));
                            return this.Dn(e, o, n).next((e)=>{
                                e.forEach((e, t)=>{
                                    s = s.insert(e, t);
                                });
                            });
                        }).next(()=>s));
                }
                Dn(e, t, n) {
                    let r, s;
                    return this.He.getDocumentsMatchingQuery(e, t, n).next((n)=>((r = n), this.In.getAllMutationBatchesAffectingQuery(e, t))).next((t)=>((s = t), this.Cn(e, s, r).next((e)=>{
                            r = e;
                            for (const t of s)for (const n of t.mutations){
                                const i = n.key;
                                let o = r.get(i);
                                null == o && ((o = eb.newInvalidDocument(i)), (r = r.insert(i, o))), tE(n, o, t.localWriteTime), o.isFoundDocument() || (r = r.remove(i));
                            }
                        }))).next(()=>(r.forEach((e, n)=>{
                            e5(t, n) || (r = r.remove(e));
                        }), r));
                }
                Cn(e, t, n) {
                    let r = tW();
                    for (const s of t)for (const i of s.mutations)i instanceof t$ && null === n.get(i.key) && (r = r.add(i.key));
                    let o = n;
                    return this.He.getEntries(e, r).next((e)=>(e.forEach((e, t)=>{
                            t.isFoundDocument() && (o = o.insert(e, t));
                        }), o));
                }
            }
            class r7 {
                constructor(e, t, n, r){
                    (this.targetId = e), (this.fromCache = t), (this.Nn = n), (this.xn = r);
                }
                static kn(e, t) {
                    let n = tW(), r = tW();
                    for (const s of t.docChanges)switch(s.type){
                        case 0:
                            n = n.add(s.doc.key);
                            break;
                        case 1:
                            r = r.add(s.doc.key);
                    }
                    return new r7(e, t.fromCache, n, r);
                }
            }
            class se {
                $n(e) {
                    this.On = e;
                }
                getDocumentsMatchingQuery(e, t, n, r) {
                    return (function(e) {
                        return (0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || (1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField())));
                    })(t) || n.isEqual(U.min()) ? this.Fn(e, t) : this.On.Pn(e, r).next((s)=>{
                        const o = this.Mn(t, s);
                        return (eW(t) || eY(t)) && this.Ln(t.limitType, o, r, n) ? this.Fn(e, t) : (f() <= i["in"].DEBUG && g("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), e6(t)), this.On.getDocumentsMatchingQuery(e, t, n).next((e)=>(o.forEach((t)=>{
                                e = e.insert(t.key, t);
                            }), e)));
                    });
                }
                Mn(e, t) {
                    let n = new tq(e8(e));
                    return (t.forEach((t, r)=>{
                        e5(e, r) && (n = n.add(r));
                    }), n);
                }
                Ln(e, t, n, r) {
                    if (n.size !== t.size) return !0;
                    const s = "F" === e ? t.last() : t.first();
                    return (!!s && (s.hasPendingWrites || s.version.compareTo(r) > 0));
                }
                Fn(e, t) {
                    return (f() <= i["in"].DEBUG && g("QueryEngine", "Using full collection scan to execute query:", e6(t)), this.On.getDocumentsMatchingQuery(e, t, U.min()));
                }
            }
            class st {
                constructor(e, t, n, r){
                    (this.persistence = e), (this.Bn = t), (this.N = r), (this.Un = new tP(F)), (this.qn = new rQ((e)=>e$(e), eD)), (this.Kn = U.min()), (this.In = e.getMutationQueue(n)), (this.jn = e.getRemoteDocumentCache()), (this.ze = e.getTargetCache()), (this.Qn = new r9(this.jn, this.In, this.persistence.getIndexManager())), (this.Je = e.getBundleCache()), this.Bn.$n(this.Qn);
                }
                collectGarbage(e) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t)=>e.collect(t, this.Un));
                }
            }
            function sn(e, t, n, r) {
                return new st(e, t, n, r);
            }
            async function sr(e, t) {
                const n = T(e);
                let r = n.In, s = n.Qn;
                const i = await n.persistence.runTransaction("Handle user change", "readonly", (e)=>{
                    let i;
                    return n.In.getAllMutationBatches(e).next((o)=>((i = o), (r = n.persistence.getMutationQueue(t)), (s = new r9(n.jn, r, n.persistence.getIndexManager())), r.getAllMutationBatches(e))).next((t)=>{
                        const n = [], r = [];
                        let o = tW();
                        for (const a of i){
                            n.push(a.batchId);
                            for (const c of a.mutations)o = o.add(c.key);
                        }
                        for (const u of t){
                            r.push(u.batchId);
                            for (const h of u.mutations)o = o.add(h.key);
                        }
                        return s.Pn(e, o).next((e)=>({
                                Wn: e,
                                removedBatchIds: n,
                                addedBatchIds: r
                            }));
                    });
                });
                return (n.In = r), (n.Qn = s), n.Bn.$n(n.Qn), i;
            }
            function ss(e, t) {
                const n = T(e);
                return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e)=>{
                    const r = t.batch.keys(), s = n.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    return (function(e, t, n, r) {
                        const s = n.batch, i = s.keys();
                        let o = n4.resolve();
                        return (i.forEach((e)=>{
                            o = o.next(()=>r.getEntry(t, e)).next((t)=>{
                                const i = n.docVersions.get(e);
                                v(null !== i), t.version.compareTo(i) < 0 && (s.applyToRemoteDocument(t, n), t.isValidDocument() && r.addEntry(t, n.commitVersion));
                            });
                        }), o.next(()=>e.In.removeMutationBatch(t, s)));
                    })(n, e, t, s).next(()=>s.apply(e)).next(()=>n.In.performConsistencyCheck(e)).next(()=>n.Qn.Pn(e, r));
                });
            }
            function si(e) {
                const t = T(e);
                return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e)=>t.ze.getLastRemoteSnapshotVersion(e));
            }
            function so(e, t) {
                const n = T(e), r = t.snapshotVersion;
                let s = n.Un;
                return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e)=>{
                    const i = n.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    s = n.Un;
                    const o = [];
                    t.targetChanges.forEach((t, i)=>{
                        const a = s.get(i);
                        if (!a) return;
                        o.push(n.ze.removeMatchingKeys(e, t.removedDocuments, i).next(()=>n.ze.addMatchingKeys(e, t.addedDocuments, i)));
                        const c = t.resumeToken;
                        if (c.approximateByteSize() > 0) {
                            const u = a.withResumeToken(c, r).withSequenceNumber(e.currentSequenceNumber);
                            (s = s.insert(i, u)), (function(e, t, n) {
                                if ((v(t.resumeToken.approximateByteSize() > 0), 0 === e.resumeToken.approximateByteSize())) return !0;
                                if (t.snapshotVersion.toMicroseconds() - e.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                                return (n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0);
                            })(a, u, t) && o.push(n.ze.updateTargetData(e, u));
                        }
                    });
                    let a = t_();
                    if ((t.documentUpdates.forEach((r, s)=>{
                        t.resolvedLimboDocuments.has(r) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e, r));
                    }), o.push(sa(e, i, t.documentUpdates, r, void 0).next((e)=>{
                        a = e;
                    })), !r.isEqual(U.min()))) {
                        const c = n.ze.getLastRemoteSnapshotVersion(e).next((t)=>n.ze.setTargetsMetadata(e, e.currentSequenceNumber, r));
                        o.push(c);
                    }
                    return n4.waitFor(o).next(()=>i.apply(e)).next(()=>n.Qn.vn(e, a)).next(()=>a);
                }).then((e)=>((n.Un = s), e));
            }
            function sa(e, t, n, r, s) {
                let i = tW();
                return (n.forEach((e)=>(i = i.add(e))), t.getEntries(e, i).next((e)=>{
                    let i = t_();
                    return (n.forEach((n, o)=>{
                        const a = e.get(n), c = (null == s ? void 0 : s.get(n)) || r;
                        o.isNoDocument() && o.version.isEqual(U.min()) ? (t.removeEntry(n, c), (i = i.insert(n, o))) : !a.isValidDocument() || o.version.compareTo(a.version) > 0 || (0 === o.version.compareTo(a.version) && a.hasPendingWrites) ? (t.addEntry(o, c), (i = i.insert(n, o))) : g("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", a.version, " Watch version:", o.version);
                    }), i);
                }));
            }
            function sc(e, t) {
                const n = T(e);
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (e)=>(void 0 === t && (t = -1), n.In.getNextMutationBatchAfterBatchId(e, t)));
            }
            function su(e, t) {
                const n = T(e);
                return n.persistence.runTransaction("Allocate target", "readwrite", (e)=>{
                    let r;
                    return n.ze.getTargetData(e, t).next((s)=>s ? ((r = s), n4.resolve(r)) : n.ze.allocateTargetId(e).next((s)=>((r = new ra(t, s, 0, e.currentSequenceNumber)), n.ze.addTargetData(e, r).next(()=>r))));
                }).then((e)=>{
                    const r = n.Un.get(e.targetId);
                    return ((null === r || e.snapshotVersion.compareTo(r.snapshotVersion) > 0) && ((n.Un = n.Un.insert(e.targetId, e)), n.qn.set(t, e.targetId)), e);
                });
            }
            async function sh(e, t, n) {
                const r = T(e), s = r.Un.get(t), i = n ? "readwrite" : "readwrite-primary";
                try {
                    n || (await r.persistence.runTransaction("Release target", i, (e)=>r.persistence.referenceDelegate.removeTarget(e, s)));
                } catch (o) {
                    if (!n9(o)) throw o;
                    g("LocalStore", `Failed to update sequence numbers for target ${t}: ${o}`);
                }
                (r.Un = r.Un.remove(t)), r.qn.delete(s.target);
            }
            function sl(e, t, n) {
                const r = T(e);
                let s = U.min(), i = tW();
                return r.persistence.runTransaction("Execute query", "readonly", (e)=>(function(e, t, n) {
                        const r = T(e), s = r.qn.get(n);
                        return void 0 !== s ? n4.resolve(r.Un.get(s)) : r.ze.getTargetData(t, n);
                    })(r, e, e1(t)).next((t)=>{
                        if (t) return ((s = t.lastLimboFreeSnapshotVersion), r.ze.getMatchingKeysForTargetId(e, t.targetId).next((e)=>{
                            i = e;
                        }));
                    }).next(()=>r.Bn.getDocumentsMatchingQuery(e, t, n ? s : U.min(), n ? i : tW())).next((e)=>({
                            documents: e,
                            Gn: i
                        })));
            }
            function sd(e, t) {
                const n = T(e), r = T(n.ze), s = n.Un.get(t);
                return s ? Promise.resolve(s.target) : n.persistence.runTransaction("Get target data", "readonly", (e)=>r.Tt(e, t).next((e)=>(e ? e.target : null)));
            }
            function sf(e) {
                const t = T(e);
                return t.persistence.runTransaction("Get new document changes", "readonly", (e)=>(function(e, t, n) {
                        const r = T(e);
                        let s = t_(), i = rl(n);
                        const o = rX(t), a = IDBKeyRange.lowerBound(i, !0);
                        return o.Kt({
                            index: nj.readTimeIndex,
                            range: a
                        }, (e, t)=>{
                            const n = ru(r.N, t);
                            (s = s.insert(n.key, n)), (i = t.readTime);
                        }).next(()=>({
                                En: s,
                                readTime: rd(i)
                            }));
                    })(t.jn, e, t.Kn)).then(({ En: e , readTime: n  })=>((t.Kn = n), e));
            }
            async function sm(e) {
                const t = T(e);
                return t.persistence.runTransaction("Synchronize last document change read time", "readonly", (e)=>(function(e) {
                        const t = rX(e);
                        let n = U.min();
                        return t.Kt({
                            index: nj.readTimeIndex,
                            reverse: !0
                        }, (e, t, r)=>{
                            t.readTime && (n = rd(t.readTime)), r.done();
                        }).next(()=>n);
                    })(e)).then((e)=>{
                    t.Kn = e;
                });
            }
            async function sg(e, t, n, r) {
                const s = T(e);
                let i = tW(), o = t_(), a = tQ();
                for (const c of n){
                    const u = t.zn(c.metadata.name);
                    c.document && (i = i.add(u)), (o = o.insert(u, t.Hn(c))), (a = a.insert(u, t.Jn(c.metadata.readTime)));
                }
                const h = s.jn.newChangeBuffer({
                    trackRemovals: !0
                }), l = await su(s, (function(e) {
                    return e1(eH(z.fromString(`__bundle__/docs/${e}`)));
                })(r));
                return s.persistence.runTransaction("Apply bundle documents", "readwrite", (e)=>sa(e, h, o, U.min(), a).next((t)=>(h.apply(e), t)).next((t)=>s.ze.removeMatchingKeysForTargetId(e, l.targetId).next(()=>s.ze.addMatchingKeys(e, i, l.targetId)).next(()=>s.Qn.vn(e, t)).next(()=>t)));
            }
            async function sp(e, t, n = tW()) {
                const r = await su(e, e1(rw(t.bundledQuery))), s = T(e);
                return s.persistence.runTransaction("Save named query", "readwrite", (e)=>{
                    const i = nr(t.readTime);
                    if (r.snapshotVersion.compareTo(i) >= 0) return s.Je.saveNamedQuery(e, t);
                    const o = r.withResumeToken(W.EMPTY_BYTE_STRING, i);
                    return ((s.Un = s.Un.insert(o.targetId, o)), s.ze.updateTargetData(e, o).next(()=>s.ze.removeMatchingKeysForTargetId(e, r.targetId)).next(()=>s.ze.addMatchingKeys(e, n, r.targetId)).next(()=>s.Je.saveNamedQuery(e, t)));
                });
            }
            class sy {
                constructor(e){
                    (this.N = e), (this.Yn = new Map()), (this.Xn = new Map());
                }
                getBundleMetadata(e, t) {
                    return n4.resolve(this.Yn.get(t));
                }
                saveBundleMetadata(e, t) {
                    var n;
                    return (this.Yn.set(t.id, {
                        id: (n = t).id,
                        version: n.version,
                        createTime: nr(n.createTime)
                    }), n4.resolve());
                }
                getNamedQuery(e, t) {
                    return n4.resolve(this.Xn.get(t));
                }
                saveNamedQuery(e, t) {
                    return (this.Xn.set(t.name, (function(e) {
                        return {
                            name: e.name,
                            query: rw(e.bundledQuery),
                            readTime: nr(e.readTime)
                        };
                    })(t)), n4.resolve());
                }
            }
            class sw {
                constructor(){
                    (this.Zn = new tq(sI.ts)), (this.es = new tq(sI.ns));
                }
                isEmpty() {
                    return this.Zn.isEmpty();
                }
                addReference(e, t) {
                    const n = new sI(e, t);
                    (this.Zn = this.Zn.add(n)), (this.es = this.es.add(n));
                }
                ss(e, t) {
                    e.forEach((e)=>this.addReference(e, t));
                }
                removeReference(e, t) {
                    this.rs(new sI(e, t));
                }
                os(e, t) {
                    e.forEach((e)=>this.removeReference(e, t));
                }
                cs(e) {
                    const t = new eo(new z([])), n = new sI(t, e), r = new sI(t, e + 1), s = [];
                    return (this.es.forEachInRange([
                        n,
                        r
                    ], (e)=>{
                        this.rs(e), s.push(e.key);
                    }), s);
                }
                us() {
                    this.Zn.forEach((e)=>this.rs(e));
                }
                rs(e) {
                    (this.Zn = this.Zn.delete(e)), (this.es = this.es.delete(e));
                }
                hs(e) {
                    const t = new eo(new z([])), n = new sI(t, e), r = new sI(t, e + 1);
                    let s = tW();
                    return (this.es.forEachInRange([
                        n,
                        r
                    ], (e)=>{
                        s = s.add(e.key);
                    }), s);
                }
                containsKey(e) {
                    const t = new sI(e, 0), n = this.Zn.firstAfterOrEqual(t);
                    return null !== n && e.isEqual(n.key);
                }
            }
            class sI {
                constructor(e, t){
                    (this.key = e), (this.ls = t);
                }
                static ts(e, t) {
                    return eo.comparator(e.key, t.key) || F(e.ls, t.ls);
                }
                static ns(e, t) {
                    return F(e.ls, t.ls) || eo.comparator(e.key, t.key);
                }
            }
            class sv {
                constructor(e, t){
                    (this.Ht = e), (this.referenceDelegate = t), (this.In = []), (this.fs = 1), (this.ds = new tq(sI.ts));
                }
                checkEmpty(e) {
                    return n4.resolve(0 === this.In.length);
                }
                addMutationBatch(e, t, n, r) {
                    const s = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const i = new ri(s, t, n, r);
                    this.In.push(i);
                    for (const o of r)(this.ds = this.ds.add(new sI(o.key, s))), this.Ht.addToCollectionParentIndex(e, o.key.path.popLast());
                    return n4.resolve(i);
                }
                lookupMutationBatch(e, t) {
                    return n4.resolve(this.ws(t));
                }
                getNextMutationBatchAfterBatchId(e, t) {
                    const n = t + 1, r = this._s(n), s = r < 0 ? 0 : r;
                    return n4.resolve(this.In.length > s ? this.In[s] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return n4.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(e) {
                    return n4.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(e, t) {
                    const n = new sI(t, 0), r = new sI(t, Number.POSITIVE_INFINITY), s = [];
                    return (this.ds.forEachInRange([
                        n,
                        r
                    ], (e)=>{
                        const t = this.ws(e.ls);
                        s.push(t);
                    }), n4.resolve(s));
                }
                getAllMutationBatchesAffectingDocumentKeys(e, t) {
                    let n = new tq(F);
                    return (t.forEach((e)=>{
                        const t = new sI(e, 0), r = new sI(e, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            t,
                            r
                        ], (e)=>{
                            n = n.add(e.ls);
                        });
                    }), n4.resolve(this.gs(n)));
                }
                getAllMutationBatchesAffectingQuery(e, t) {
                    const n = t.path, r = n.length + 1;
                    let s = n;
                    eo.isDocumentKey(s) || (s = s.child(""));
                    const i = new sI(new eo(s), 0);
                    let o = new tq(F);
                    return (this.ds.forEachWhile((e)=>{
                        const t = e.key.path;
                        return (!!n.isPrefixOf(t) && (t.length === r && (o = o.add(e.ls)), !0));
                    }, i), n4.resolve(this.gs(o)));
                }
                gs(e) {
                    const t = [];
                    return (e.forEach((e)=>{
                        const n = this.ws(e);
                        null !== n && t.push(n);
                    }), t);
                }
                removeMutationBatch(e, t) {
                    v(0 === this.ys(t.batchId, "removed")), this.In.shift();
                    let n = this.ds;
                    return n4.forEach(t.mutations, (r)=>{
                        const s = new sI(r.key, t.batchId);
                        return ((n = n.delete(s)), this.referenceDelegate.markPotentiallyOrphaned(e, r.key));
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(e) {}
                containsKey(e, t) {
                    const n = new sI(t, 0), r = this.ds.firstAfterOrEqual(n);
                    return n4.resolve(t.isEqual(r && r.key));
                }
                performConsistencyCheck(e) {
                    return this.In.length, n4.resolve();
                }
                ys(e, t) {
                    return this._s(e);
                }
                _s(e) {
                    if (0 === this.In.length) return 0;
                    return e - this.In[0].batchId;
                }
                ws(e) {
                    const t = this._s(e);
                    if (t < 0 || t >= this.In.length) return null;
                    return this.In[t];
                }
            }
            class sE {
                constructor(e, t){
                    (this.Ht = e), (this.ps = t), (this.docs = new tP(eo.comparator)), (this.size = 0);
                }
                addEntry(e, t, n) {
                    const r = t.key, s = this.docs.get(r), i = s ? s.size : 0, o = this.ps(t);
                    return ((this.docs = this.docs.insert(r, {
                        document: t.clone(),
                        size: o,
                        readTime: n
                    })), (this.size += o - i), this.Ht.addToCollectionParentIndex(e, r.path.popLast()));
                }
                removeEntry(e) {
                    const t = this.docs.get(e);
                    t && ((this.docs = this.docs.remove(e)), (this.size -= t.size));
                }
                getEntry(e, t) {
                    const n = this.docs.get(t);
                    return n4.resolve(n ? n.document.clone() : eb.newInvalidDocument(t));
                }
                getEntries(e, t) {
                    let n = t_();
                    return (t.forEach((e)=>{
                        const t = this.docs.get(e);
                        n = n.insert(e, t ? t.document.clone() : eb.newInvalidDocument(e));
                    }), n4.resolve(n));
                }
                getDocumentsMatchingQuery(e, t, n) {
                    let r = t_();
                    const s = new eo(t.path.child("")), i = this.docs.getIteratorFrom(s);
                    for(; i.hasNext();){
                        const { key: o , value: { document: a , readTime: c  } ,  } = i.getNext();
                        if (!t.path.isPrefixOf(o.path)) break;
                        c.compareTo(n) <= 0 || (e5(t, a) && (r = r.insert(a.key, a.clone())));
                    }
                    return n4.resolve(r);
                }
                Ts(e, t) {
                    return n4.forEach(this.docs, (e)=>t(e));
                }
                newChangeBuffer(e) {
                    return new sT(this);
                }
                getSize(e) {
                    return n4.resolve(this.size);
                }
            }
            class sT extends rH {
                constructor(e){
                    super(), (this.Se = e);
                }
                applyChanges(e) {
                    const t = [];
                    return (this.changes.forEach((n, r)=>{
                        r.document.isValidDocument() ? t.push(this.Se.addEntry(e, r.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), n4.waitFor(t));
                }
                getFromCache(e, t) {
                    return this.Se.getEntry(e, t);
                }
                getAllFromCache(e, t) {
                    return this.Se.getEntries(e, t);
                }
            }
            class sb {
                constructor(e){
                    (this.persistence = e), (this.Es = new rQ((e)=>e$(e), eD)), (this.lastRemoteSnapshotVersion = U.min()), (this.highestTargetId = 0), (this.Is = 0), (this.As = new sw()), (this.targetCount = 0), (this.Rs = rF.se());
                }
                forEachTarget(e, t) {
                    return this.Es.forEach((e, n)=>t(n)), n4.resolve();
                }
                getLastRemoteSnapshotVersion(e) {
                    return n4.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(e) {
                    return n4.resolve(this.Is);
                }
                allocateTargetId(e) {
                    return ((this.highestTargetId = this.Rs.next()), n4.resolve(this.highestTargetId));
                }
                setTargetsMetadata(e, t, n) {
                    return (n && (this.lastRemoteSnapshotVersion = n), t > this.Is && (this.Is = t), n4.resolve());
                }
                ce(e) {
                    this.Es.set(e.target, e);
                    const t = e.targetId;
                    t > this.highestTargetId && ((this.Rs = new rF(t)), (this.highestTargetId = t)), e.sequenceNumber > this.Is && (this.Is = e.sequenceNumber);
                }
                addTargetData(e, t) {
                    return (this.ce(t), (this.targetCount += 1), n4.resolve());
                }
                updateTargetData(e, t) {
                    return this.ce(t), n4.resolve();
                }
                removeTargetData(e, t) {
                    return (this.Es.delete(t.target), this.As.cs(t.targetId), (this.targetCount -= 1), n4.resolve());
                }
                removeTargets(e, t, n) {
                    let r = 0;
                    const s = [];
                    return (this.Es.forEach((i, o)=>{
                        o.sequenceNumber <= t && null === n.get(o.targetId) && (this.Es.delete(i), s.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
                    }), n4.waitFor(s).next(()=>r));
                }
                getTargetCount(e) {
                    return n4.resolve(this.targetCount);
                }
                getTargetData(e, t) {
                    const n = this.Es.get(t) || null;
                    return n4.resolve(n);
                }
                addMatchingKeys(e, t, n) {
                    return this.As.ss(t, n), n4.resolve();
                }
                removeMatchingKeys(e, t, n) {
                    this.As.os(t, n);
                    const r = this.persistence.referenceDelegate, s = [];
                    return (r && t.forEach((t)=>{
                        s.push(r.markPotentiallyOrphaned(e, t));
                    }), n4.waitFor(s));
                }
                removeMatchingKeysForTargetId(e, t) {
                    return this.As.cs(t), n4.resolve();
                }
                getMatchingKeysForTargetId(e, t) {
                    const n = this.As.hs(t);
                    return n4.resolve(n);
                }
                containsKey(e, t) {
                    return n4.resolve(this.As.containsKey(t));
                }
            }
            class sS {
                constructor(e, t){
                    (this.bs = {}), (this.Le = new L(0)), (this.Be = !1), (this.Be = !0), (this.referenceDelegate = e(this)), (this.ze = new sb(this));
                    (this.Ht = new rT()), (this.He = (function(e, t) {
                        return new sE(e, t);
                    })(this.Ht, (e)=>this.referenceDelegate.Ps(e))), (this.N = new rc(t)), (this.Je = new sy(this.N));
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
                getMutationQueue(e) {
                    let t = this.bs[e.toKey()];
                    return (t || ((t = new sv(this.Ht, this.referenceDelegate)), (this.bs[e.toKey()] = t)), t);
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
                runTransaction(e, t, n) {
                    g("MemoryPersistence", "Starting transaction:", e);
                    const r = new sN(this.Le.next());
                    return (this.referenceDelegate.vs(), n(r).next((e)=>this.referenceDelegate.Vs(r).next(()=>e)).toPromise().then((e)=>(r.raiseOnCommittedEvent(), e)));
                }
                Ss(e, t) {
                    return n4.or(Object.values(this.bs).map((n)=>()=>n.containsKey(e, t)));
                }
            }
            class sN extends n2 {
                constructor(e){
                    super(), (this.currentSequenceNumber = e);
                }
            }
            class s$ {
                constructor(e){
                    (this.persistence = e), (this.Ds = new sw()), (this.Cs = null);
                }
                static Ns(e) {
                    return new s$(e);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw I();
                }
                addReference(e, t, n) {
                    return (this.Ds.addReference(n, t), this.xs.delete(n.toString()), n4.resolve());
                }
                removeReference(e, t, n) {
                    return (this.Ds.removeReference(n, t), this.xs.add(n.toString()), n4.resolve());
                }
                markPotentiallyOrphaned(e, t) {
                    return this.xs.add(t.toString()), n4.resolve();
                }
                removeTarget(e, t) {
                    this.Ds.cs(t.targetId).forEach((e)=>this.xs.add(e.toString()));
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(e, t.targetId).next((e)=>{
                        e.forEach((e)=>this.xs.add(e.toString()));
                    }).next(()=>n.removeTargetData(e, t));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(e) {
                    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return n4.forEach(this.xs, (n)=>{
                        const r = eo.fromPath(n);
                        return this.ks(e, r).next((e)=>{
                            e || t.removeEntry(r);
                        });
                    }).next(()=>((this.Cs = null), t.apply(e)));
                }
                updateLimboDocument(e, t) {
                    return this.ks(e, t).next((e)=>{
                        e ? this.xs.delete(t.toString()) : this.xs.add(t.toString());
                    });
                }
                Ps(e) {
                    return 0;
                }
                ks(e, t) {
                    return n4.or([
                        ()=>n4.resolve(this.Ds.containsKey(t)),
                        ()=>this.persistence.getTargetCache().containsKey(e, t),
                        ()=>this.persistence.Ss(e, t), 
                    ]);
                }
            }
            function sA(e, t) {
                return `firestore_clients_${e}_${t}`;
            }
            function sD(e, t, n) {
                let r = `firestore_mutations_${e}_${n}`;
                return t.isAuthenticated() && (r += `_${t.uid}`), r;
            }
            function sk(e, t) {
                return `firestore_targets_${e}_${t}`;
            }
            class sx {
                constructor(e, t, n, r){
                    (this.user = e), (this.batchId = t), (this.state = n), (this.error = r);
                }
                static $s(e, t, n) {
                    const r = JSON.parse(n);
                    let s, i = "object" == typeof r && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected", 
                    ].indexOf(r.state) && (void 0 === r.error || "object" == typeof r.error);
                    return (i && r.error && ((i = "string" == typeof r.error.message && "string" == typeof r.error.code), i && (s = new S(r.error.code, r.error.message))), i ? new sx(e, t, r.state, s) : (p("SharedClientState", `Failed to parse mutation state for ID '${t}': ${n}`), null));
                }
                Os() {
                    const e = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (e.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(e));
                }
            }
            class sC {
                constructor(e, t, n){
                    (this.targetId = e), (this.state = t), (this.error = n);
                }
                static $s(e, t) {
                    const n = JSON.parse(t);
                    let r, s = "object" == typeof n && -1 !== [
                        "not-current",
                        "current",
                        "rejected", 
                    ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
                    return (s && n.error && ((s = "string" == typeof n.error.message && "string" == typeof n.error.code), s && (r = new S(n.error.code, n.error.message))), s ? new sC(e, n.state, r) : (p("SharedClientState", `Failed to parse target state for ID '${e}': ${t}`), null));
                }
                Os() {
                    const e = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (e.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(e));
                }
            }
            class sL {
                constructor(e, t){
                    (this.clientId = e), (this.activeTargetIds = t);
                }
                static $s(e, t) {
                    const n = JSON.parse(t);
                    let r = "object" == typeof n && n.activeTargetIds instanceof Array, s = tJ();
                    for(let i = 0; r && i < n.activeTargetIds.length; ++i)(r = ei(n.activeTargetIds[i])), (s = s.add(n.activeTargetIds[i]));
                    return r ? new sL(e, s) : (p("SharedClientState", `Failed to parse client data for instance '${e}': ${t}`), null);
                }
            }
            class sR {
                constructor(e, t){
                    (this.clientId = e), (this.onlineState = t);
                }
                static $s(e) {
                    const t = JSON.parse(e);
                    return "object" == typeof t && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(t.onlineState) && "string" == typeof t.clientId ? new sR(t.clientId, t.onlineState) : (p("SharedClientState", `Failed to parse online state: ${e}`), null);
                }
            }
            class sM {
                constructor(){
                    this.activeTargetIds = tJ();
                }
                Fs(e) {
                    this.activeTargetIds = this.activeTargetIds.add(e);
                }
                Ms(e) {
                    this.activeTargetIds = this.activeTargetIds.delete(e);
                }
                Os() {
                    const e = {
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    };
                    return JSON.stringify(e);
                }
            }
            class sF {
                constructor(e, t, n, r, s){
                    (this.window = e), (this.Oe = t), (this.persistenceKey = n), (this.Ls = r), (this.syncEngine = null), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null), (this.Bs = this.Us.bind(this)), (this.qs = new tP(F)), (this.started = !1), (this.Ks = []);
                    const i = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    (this.storage = this.window.localStorage), (this.currentUser = s), (this.js = sA(this.persistenceKey, this.Ls)), (this.Qs = (function(e) {
                        return `firestore_sequence_number_${e}`;
                    })(this.persistenceKey)), (this.qs = this.qs.insert(this.Ls, new sM())), (this.Ws = new RegExp(`^firestore_clients_${i}_([^_]*)$`)), (this.Gs = new RegExp(`^firestore_mutations_${i}_(\\d+)(?:_(.*))?$`)), (this.zs = new RegExp(`^firestore_targets_${i}_(\\d+)$`)), (this.Hs = (function(e) {
                        return `firestore_online_state_${e}`;
                    })(this.persistenceKey)), (this.Js = (function(e) {
                        return `firestore_bundle_loaded_${e}`;
                    })(this.persistenceKey)), this.window.addEventListener("storage", this.Bs);
                }
                static bt(e) {
                    return !(!e || !e.localStorage);
                }
                async start() {
                    const e = await this.syncEngine.pn();
                    for (const t of e){
                        if (t === this.Ls) continue;
                        const n = this.getItem(sA(this.persistenceKey, t));
                        if (n) {
                            const r = sL.$s(t, n);
                            r && (this.qs = this.qs.insert(r.clientId, r));
                        }
                    }
                    this.Ys();
                    const s = this.storage.getItem(this.Hs);
                    if (s) {
                        const i = this.Xs(s);
                        i && this.Zs(i);
                    }
                    for (const o of this.Ks)this.Us(o);
                    (this.Ks = []), this.window.addEventListener("pagehide", ()=>this.shutdown()), (this.started = !0);
                }
                writeSequenceNumber(e) {
                    this.setItem(this.Qs, JSON.stringify(e));
                }
                getAllActiveQueryTargets() {
                    return this.ti(this.qs);
                }
                isActiveQueryTarget(e) {
                    let t = !1;
                    return (this.qs.forEach((n, r)=>{
                        r.activeTargetIds.has(e) && (t = !0);
                    }), t);
                }
                addPendingMutation(e) {
                    this.ei(e, "pending");
                }
                updateMutationState(e, t, n) {
                    this.ei(e, t, n), this.ni(e);
                }
                addLocalQueryTarget(e) {
                    let t = "not-current";
                    if (this.isActiveQueryTarget(e)) {
                        const n = this.storage.getItem(sk(this.persistenceKey, e));
                        if (n) {
                            const r = sC.$s(e, n);
                            r && (t = r.state);
                        }
                    }
                    return this.si.Fs(e), this.Ys(), t;
                }
                removeLocalQueryTarget(e) {
                    this.si.Ms(e), this.Ys();
                }
                isLocalQueryTarget(e) {
                    return this.si.activeTargetIds.has(e);
                }
                clearQueryState(e) {
                    this.removeItem(sk(this.persistenceKey, e));
                }
                updateQueryState(e, t, n) {
                    this.ii(e, t, n);
                }
                handleUserChange(e, t, n) {
                    t.forEach((e)=>{
                        this.ni(e);
                    }), (this.currentUser = e), n.forEach((e)=>{
                        this.addPendingMutation(e);
                    });
                }
                setOnlineState(e) {
                    this.ri(e);
                }
                notifyBundleLoaded() {
                    this.oi();
                }
                shutdown() {
                    this.started && (this.window.removeEventListener("storage", this.Bs), this.removeItem(this.js), (this.started = !1));
                }
                getItem(e) {
                    const t = this.storage.getItem(e);
                    return g("SharedClientState", "READ", e, t), t;
                }
                setItem(e, t) {
                    g("SharedClientState", "SET", e, t), this.storage.setItem(e, t);
                }
                removeItem(e) {
                    g("SharedClientState", "REMOVE", e), this.storage.removeItem(e);
                }
                Us(e) {
                    const t = e;
                    if (t.storageArea === this.storage) {
                        if ((g("SharedClientState", "EVENT", t.key, t.newValue), t.key === this.js)) return void p("Received WebStorage notification for local change. Another client might have garbage-collected our state");
                        this.Oe.enqueueRetryable(async ()=>{
                            if (this.started) {
                                if (null !== t.key) if (this.Ws.test(t.key)) {
                                    if (null == t.newValue) {
                                        const e = this.ci(t.key);
                                        return this.ai(e, null);
                                    }
                                    {
                                        const n = this.ui(t.key, t.newValue);
                                        if (n) return this.ai(n.clientId, n);
                                    }
                                } else if (this.Gs.test(t.key)) {
                                    if (null !== t.newValue) {
                                        const r = this.hi(t.key, t.newValue);
                                        if (r) return this.li(r);
                                    }
                                } else if (this.zs.test(t.key)) {
                                    if (null !== t.newValue) {
                                        const s = this.fi(t.key, t.newValue);
                                        if (s) return this.di(s);
                                    }
                                } else if (t.key === this.Hs) {
                                    if (null !== t.newValue) {
                                        const i = this.Xs(t.newValue);
                                        if (i) return this.Zs(i);
                                    }
                                } else if (t.key === this.Qs) {
                                    const o = (function(e) {
                                        let t = L.T;
                                        if (null != e) try {
                                            const n = JSON.parse(e);
                                            v("number" == typeof n), (t = n);
                                        } catch (r) {
                                            p("SharedClientState", "Failed to read sequence number from WebStorage", r);
                                        }
                                        return t;
                                    })(t.newValue);
                                    o !== L.T && this.sequenceNumberHandler(o);
                                } else if (t.key === this.Js) return this.syncEngine.wi();
                            } else this.Ks.push(t);
                        });
                    }
                }
                get si() {
                    return this.qs.get(this.Ls);
                }
                Ys() {
                    this.setItem(this.js, this.si.Os());
                }
                ei(e, t, n) {
                    const r = new sx(this.currentUser, e, t, n), s = sD(this.persistenceKey, this.currentUser, e);
                    this.setItem(s, r.Os());
                }
                ni(e) {
                    const t = sD(this.persistenceKey, this.currentUser, e);
                    this.removeItem(t);
                }
                ri(e) {
                    const t = {
                        clientId: this.Ls,
                        onlineState: e
                    };
                    this.storage.setItem(this.Hs, JSON.stringify(t));
                }
                ii(e, t, n) {
                    const r = sk(this.persistenceKey, e), s = new sC(e, t, n);
                    this.setItem(r, s.Os());
                }
                oi() {
                    this.setItem(this.Js, "value-not-used");
                }
                ci(e) {
                    const t = this.Ws.exec(e);
                    return t ? t[1] : null;
                }
                ui(e, t) {
                    const n = this.ci(e);
                    return sL.$s(n, t);
                }
                hi(e, t) {
                    const n = this.Gs.exec(e), r = Number(n[1]), s = void 0 !== n[2] ? n[2] : null;
                    return sx.$s(new h(s), r, t);
                }
                fi(e, t) {
                    const n = this.zs.exec(e), r = Number(n[1]);
                    return sC.$s(r, t);
                }
                Xs(e) {
                    return sR.$s(e);
                }
                async li(e) {
                    if (e.user.uid === this.currentUser.uid) return this.syncEngine._i(e.batchId, e.state, e.error);
                    g("SharedClientState", `Ignoring mutation for non-active user ${e.user.uid}`);
                }
                di(e) {
                    return this.syncEngine.mi(e.targetId, e.state, e.error);
                }
                ai(e, t) {
                    const n = t ? this.qs.insert(e, t) : this.qs.remove(e), r = this.ti(this.qs), s = this.ti(n), i = [], o = [];
                    return (s.forEach((e)=>{
                        r.has(e) || i.push(e);
                    }), r.forEach((e)=>{
                        s.has(e) || o.push(e);
                    }), this.syncEngine.gi(i, o).then(()=>{
                        this.qs = n;
                    }));
                }
                Zs(e) {
                    this.qs.get(e.clientId) && this.onlineStateHandler(e.onlineState);
                }
                ti(e) {
                    let t = tJ();
                    return (e.forEach((e, n)=>{
                        t = t.unionWith(n.activeTargetIds);
                    }), t);
                }
            }
            class sO {
                constructor(){
                    (this.yi = new sM()), (this.pi = {}), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null);
                }
                addPendingMutation(e) {}
                updateMutationState(e, t, n) {}
                addLocalQueryTarget(e) {
                    return this.yi.Fs(e), this.pi[e] || "not-current";
                }
                updateQueryState(e, t, n) {
                    this.pi[e] = t;
                }
                removeLocalQueryTarget(e) {
                    this.yi.Ms(e);
                }
                isLocalQueryTarget(e) {
                    return this.yi.activeTargetIds.has(e);
                }
                clearQueryState(e) {
                    delete this.pi[e];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(e) {
                    return this.yi.activeTargetIds.has(e);
                }
                start() {
                    return (this.yi = new sM()), Promise.resolve();
                }
                handleUserChange(e, t, n) {}
                setOnlineState(e) {}
                shutdown() {}
                writeSequenceNumber(e) {}
                notifyBundleLoaded() {}
            }
            class sP {
                Ti(e) {}
                shutdown() {}
            }
            class sV {
                constructor(){
                    (this.Ei = ()=>this.Ii()), (this.Ai = ()=>this.Ri()), (this.bi = []), this.Pi();
                }
                Ti(e) {
                    this.bi.push(e);
                }
                shutdown() {
                    window.removeEventListener("online", this.Ei), window.removeEventListener("offline", this.Ai);
                }
                Pi() {
                    window.addEventListener("online", this.Ei), window.addEventListener("offline", this.Ai);
                }
                Ii() {
                    g("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
                    for (const e of this.bi)e(0);
                }
                Ri() {
                    g("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
                    for (const e of this.bi)e(1);
                }
                static bt() {
                    return ("undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener);
                }
            }
            const sU = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            class sq {
                constructor(e){
                    (this.vi = e.vi), (this.Vi = e.Vi);
                }
                Si(e) {
                    this.Di = e;
                }
                Ci(e) {
                    this.Ni = e;
                }
                onMessage(e) {
                    this.xi = e;
                }
                close() {
                    this.Vi();
                }
                send(e) {
                    this.vi(e);
                }
                ki() {
                    this.Di();
                }
                $i(e) {
                    this.Ni(e);
                }
                Oi(e) {
                    this.xi(e);
                }
            }
            class sB extends class {
                constructor(e){
                    (this.databaseInfo = e), (this.databaseId = e.databaseId);
                    const t = e.ssl ? "https" : "http";
                    (this.Fi = t + "://" + e.host), (this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents");
                }
                Li(e, t, n, r) {
                    const s = this.Bi(e, t);
                    g("RestConnection", "Sending: ", s, n);
                    const i = {};
                    return (this.Ui(i, r), this.qi(e, s, i, n).then((e)=>(g("RestConnection", "Received: ", e), e), (t)=>{
                        throw ((y("RestConnection", `${e} failed with error: `, t, "url: ", s, "request:", n), t));
                    }));
                }
                Ki(e, t, n, r) {
                    return this.Li(e, t, n, r);
                }
                Ui(e, t) {
                    if (((e["X-Goog-Api-Client"] = "gl-js/ fire/" + l), (e["Content-Type"] = "text/plain"), this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t)) for(const n in t.authHeaders)t.authHeaders.hasOwnProperty(n) && (e[n] = t.authHeaders[n]);
                }
                Bi(e, t) {
                    const n = sU[e];
                    return `${this.Fi}/v1/${t}:${n}`;
                }
            } {
                constructor(e){
                    super(e), (this.forceLongPolling = e.forceLongPolling), (this.autoDetectLongPolling = e.autoDetectLongPolling), (this.useFetchStreams = e.useFetchStreams);
                }
                qi(e, t, n, r) {
                    return new Promise((s, i)=>{
                        const o = new a.JJ();
                        o.listenOnce(a.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case a.jK.NO_ERROR:
                                        const t = o.getResponseJson();
                                        g("Connection", "XHR received:", JSON.stringify(t)), s(t);
                                        break;
                                    case a.jK.TIMEOUT:
                                        g("Connection", 'RPC "' + e + '" timed out'), i(new S(b.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case a.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ((g("Connection", 'RPC "' + e + '" failed with status:', n, "response text:", o.getResponseText()), n > 0)) {
                                            const r = o.getResponseJson().error;
                                            if (r && r.status && r.message) {
                                                const c = (function(e) {
                                                    const t = e.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(b).indexOf(t) >= 0 ? t : b.UNKNOWN;
                                                })(r.status);
                                                i(new S(c, r.message));
                                            } else i(new S(b.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else i(new S(b.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        I();
                                }
                            } finally{
                                g("Connection", 'RPC "' + e + '" completed.');
                            }
                        });
                        const c = JSON.stringify(r);
                        o.send(t, "POST", c, n, 15);
                    });
                }
                ji(e, t) {
                    const n = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        e,
                        "/channel", 
                    ], r = (0, a.UE)(), s = (0, a.FJ)(), i = {
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
                    this.useFetchStreams && (i.xmlHttpFactory = new a.zI({})), this.Ui(i.initMessageHeaders, t), (0, o.uI)() || (0, o.b$)() || (0, o.d)() || (0, o.w1)() || (0, o.Mn)() || (0, o.ru)() || (i.httpHeadersOverwriteParam = "$httpHeaders");
                    const c = n.join("");
                    g("Connection", "Creating WebChannel: " + c, i);
                    const u = r.createWebChannel(c, i);
                    let h = !1, l = !1;
                    const d = new sq({
                        vi: (e)=>{
                            l ? g("Connection", "Not sending because WebChannel is closed:", e) : (h || (g("Connection", "Opening WebChannel transport."), u.open(), (h = !0)), g("Connection", "WebChannel sending:", e), u.send(e));
                        },
                        Vi: ()=>u.close()
                    }), f = (e, t, n)=>{
                        e.listen(t, (e)=>{
                            try {
                                n(e);
                            } catch (t) {
                                setTimeout(()=>{
                                    throw t;
                                }, 0);
                            }
                        });
                    };
                    return (f(u, a.ii.EventType.OPEN, ()=>{
                        l || g("Connection", "WebChannel transport opened.");
                    }), f(u, a.ii.EventType.CLOSE, ()=>{
                        l || ((l = !0), g("Connection", "WebChannel transport closed"), d.$i());
                    }), f(u, a.ii.EventType.ERROR, (e)=>{
                        l || ((l = !0), y("Connection", "WebChannel transport errored:", e), d.$i(new S(b.UNAVAILABLE, "The operation could not be completed")));
                    }), f(u, a.ii.EventType.MESSAGE, (e)=>{
                        var t;
                        if (!l) {
                            const n = e.data[0];
                            v(!!n);
                            const r = n, s = r.error || (null === (t = r[0]) || void 0 === t ? void 0 : t.error);
                            if (s) {
                                g("Connection", "WebChannel received error:", s);
                                const i = s.status;
                                let o = (function(e) {
                                    const t = tR[e];
                                    if (void 0 !== t) return tO(t);
                                })(i), a = s.message;
                                void 0 === o && ((o = b.INTERNAL), (a = "Unknown error status: " + i + " with message " + s.message)), (l = !0), d.$i(new S(o, a)), u.close();
                            } else g("Connection", "WebChannel received:", n), d.Oi(n);
                        }
                    }), f(s, a.ju.STAT_EVENT, (e)=>{
                        e.stat === a.kN.PROXY ? g("Connection", "Detected buffering proxy") : e.stat === a.kN.NOPROXY && g("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        d.ki();
                    }, 0), d);
                }
            }
            function sK() {
                return "undefined" != typeof window ? window : null;
            }
            function s_() {
                return "undefined" != typeof document ? document : null;
            }
            function sz(e) {
                return new t7(e, !0);
            }
            class sj {
                constructor(e, t, n = 1e3, r = 1.5, s = 6e4){
                    (this.Oe = e), (this.timerId = t), (this.Qi = n), (this.Wi = r), (this.Gi = s), (this.zi = 0), (this.Hi = null), (this.Ji = Date.now()), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(e) {
                    this.cancel();
                    const t = Math.floor(this.zi + this.Zi()), n = Math.max(0, Date.now() - this.Ji), r = Math.max(0, t - n);
                    r > 0 && g("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.zi} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), (this.Hi = this.Oe.enqueueAfterDelay(this.timerId, r, ()=>((this.Ji = Date.now()), e()))), (this.zi *= this.Wi), this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
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
            class sG {
                constructor(e, t, n, r, s, i, o){
                    (this.Oe = e), (this.er = n), (this.nr = r), (this.sr = s), (this.credentialsProvider = i), (this.listener = o), (this.state = 0), (this.ir = 0), (this.rr = null), (this.cr = null), (this.stream = null), (this.ar = new sj(e, t));
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
                mr(e) {
                    this.gr(), this.stream.send(e);
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
                async close(e, t) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== e ? this.ar.reset() : t && t.code === b.RESOURCE_EXHAUSTED ? (p(t.toString()), p("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : t && t.code === b.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), (this.stream = null)), (this.state = e), await this.listener.Ci(t);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const e = this.Tr(this.ir), t = this.ir;
                    this.credentialsProvider.getToken().then((e)=>{
                        this.ir === t && this.Er(e);
                    }, (t)=>{
                        e(()=>{
                            const e = new S(b.UNKNOWN, "Fetching auth token failed: " + t.message);
                            return this.Ir(e);
                        });
                    });
                }
                Er(e) {
                    const t = this.Tr(this.ir);
                    (this.stream = this.Ar(e)), this.stream.Si(()=>{
                        t(()=>((this.state = 2), (this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve()))), this.listener.Si()));
                    }), this.stream.Ci((e)=>{
                        t(()=>this.Ir(e));
                    }), this.stream.onMessage((e)=>{
                        t(()=>this.onMessage(e));
                    });
                }
                lr() {
                    (this.state = 5), this.ar.Xi(async ()=>{
                        (this.state = 0), this.start();
                    });
                }
                Ir(e) {
                    return (g("PersistentStream", `close with error: ${e}`), (this.stream = null), this.close(4, e));
                }
                Tr(e) {
                    return (t)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === e ? t() : (g("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class sQ extends sG {
                constructor(e, t, n, r, s){
                    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, s), (this.N = r);
                }
                Ar(e) {
                    return this.sr.ji("Listen", e);
                }
                onMessage(e) {
                    this.ar.reset();
                    const t = ng(this.N, e), n = (function(e) {
                        if (!("targetChange" in e)) return U.min();
                        const t = e.targetChange;
                        return t.targetIds && t.targetIds.length ? U.min() : t.readTime ? nr(t.readTime) : U.min();
                    })(e);
                    return this.listener.Rr(t, n);
                }
                br(e) {
                    const t = {};
                    (t.database = nh(this.N)), (t.addTarget = (function(e, t) {
                        let n;
                        const r = t.target;
                        return ((n = ek(r) ? {
                            documents: nI(e, r)
                        } : {
                            query: nv(e, r)
                        }), (n.targetId = t.targetId), t.resumeToken.approximateByteSize() > 0 ? (n.resumeToken = nt(e, t.resumeToken)) : t.snapshotVersion.compareTo(U.min()) > 0 && (n.readTime = ne(e, t.snapshotVersion.toTimestamp())), n);
                    })(this.N, e));
                    const n = nT(this.N, e);
                    n && (t.labels = n), this.mr(t);
                }
                Pr(e) {
                    const t = {};
                    (t.database = nh(this.N)), (t.removeTarget = e), this.mr(t);
                }
            }
            class sH extends (null && sG) {
                constructor(e, t, n, r, s){
                    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, s), (this.N = r), (this.vr = !1);
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
                Ar(e) {
                    return this.sr.ji("Write", e);
                }
                onMessage(e) {
                    if ((v(!!e.streamToken), (this.lastStreamToken = e.streamToken), this.vr)) {
                        this.ar.reset();
                        const t = nw(e.writeResults, e.commitTime), n = nr(e.commitTime);
                        return this.listener.Dr(n, t);
                    }
                    return (v(!e.writeResults || 0 === e.writeResults.length), (this.vr = !0), this.listener.Cr());
                }
                Nr() {
                    const e = {};
                    (e.database = nh(this.N)), this.mr(e);
                }
                Sr(e) {
                    const t = {
                        streamToken: this.lastStreamToken,
                        writes: e.map((e)=>np(this.N, e))
                    };
                    this.mr(t);
                }
            }
            class sW extends class {
            } {
                constructor(e, t, n){
                    super(), (this.credentials = e), (this.sr = t), (this.N = n), (this.kr = !1);
                }
                $r() {
                    if (this.kr) throw new S(b.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(e, t, n) {
                    return (this.$r(), this.credentials.getToken().then((r)=>this.sr.Li(e, t, n, r)).catch((e)=>{
                        throw "FirebaseError" === e.name ? (e.code === b.UNAUTHENTICATED && this.credentials.invalidateToken(), e) : new S(b.UNKNOWN, e.toString());
                    }));
                }
                Ki(e, t, n) {
                    return (this.$r(), this.credentials.getToken().then((r)=>this.sr.Ki(e, t, n, r)).catch((e)=>{
                        throw "FirebaseError" === e.name ? (e.code === b.UNAUTHENTICATED && this.credentials.invalidateToken(), e) : new S(b.UNKNOWN, e.toString());
                    }));
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class sY {
                constructor(e, t){
                    (this.asyncQueue = e), (this.onlineStateHandler = t), (this.state = "Unknown"), (this.Or = 0), (this.Fr = null), (this.Mr = !0);
                }
                Lr() {
                    0 === this.Or && (this.Br("Unknown"), (this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, ()=>((this.Fr = null), this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve()))));
                }
                qr(e) {
                    "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.Br("Offline")));
                }
                set(e) {
                    this.Kr(), (this.Or = 0), "Online" === e && (this.Mr = !1), this.Br(e);
                }
                Br(e) {
                    e !== this.state && ((this.state = e), this.onlineStateHandler(e));
                }
                Ur(e) {
                    const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (p(t), (this.Mr = !1)) : g("OnlineStateTracker", t);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), (this.Fr = null));
                }
            }
            class sJ {
                constructor(e, t, n, r, s){
                    (this.localStore = e), (this.datastore = t), (this.asyncQueue = n), (this.remoteSyncer = {}), (this.jr = []), (this.Qr = new Map()), (this.Wr = new Set()), (this.Gr = []), (this.zr = s), this.zr.Ti((e)=>{
                        n.enqueueAndForget(async ()=>{
                            s5(this) && (g("RemoteStore", "Restarting streams for network reachability change."), await (async function(e) {
                                const t = T(e);
                                t.Wr.add(4), await sZ(t), t.Hr.set("Unknown"), t.Wr.delete(4), await sX(t);
                            })(this));
                        });
                    }), (this.Hr = new sY(n, r));
                }
            }
            async function sX(e) {
                if (s5(e)) for (const t of e.Gr)await t(!0);
            }
            async function sZ(e) {
                for (const t of e.Gr)await t(!1);
            }
            function s0(e, t) {
                const n = T(e);
                n.Qr.has(t.targetId) || (n.Qr.set(t.targetId, t), s6(n) ? s3(n) : ig(n).hr() && s2(n, t));
            }
            function s1(e, t) {
                const n = T(e), r = ig(n);
                n.Qr.delete(t), r.hr() && s4(n, t), 0 === n.Qr.size && (r.hr() ? r.wr() : s5(n) && n.Hr.set("Unknown"));
            }
            function s2(e, t) {
                e.Jr.Y(t.targetId), ig(e).br(t);
            }
            function s4(e, t) {
                e.Jr.Y(t), ig(e).Pr(t);
            }
            function s3(e) {
                (e.Jr = new t3({
                    getRemoteKeysForTarget: (t)=>e.remoteSyncer.getRemoteKeysForTarget(t),
                    Tt: (t)=>e.Qr.get(t) || null
                })), ig(e).start(), e.Hr.Lr();
            }
            function s6(e) {
                return s5(e) && !ig(e).ur() && e.Qr.size > 0;
            }
            function s5(e) {
                return 0 === T(e).Wr.size;
            }
            function s8(e) {
                e.Jr = void 0;
            }
            async function s9(e) {
                e.Qr.forEach((t, n)=>{
                    s2(e, t);
                });
            }
            async function s7(e, t) {
                s8(e), s6(e) ? (e.Hr.qr(t), s3(e)) : e.Hr.set("Unknown");
            }
            async function ie(e, t, n) {
                if ((e.Hr.set("Online"), t instanceof t2 && 2 === t.state && t.cause)) try {
                    await (async function(e, t) {
                        const n = t.cause;
                        for (const r of t.targetIds)e.Qr.has(r) && (await e.remoteSyncer.rejectListen(r, n), e.Qr.delete(r), e.Jr.removeTarget(r));
                    })(e, t);
                } catch (r) {
                    g("RemoteStore", "Failed to remove targets %s: %s ", t.targetIds.join(","), r), await it(e, r);
                }
                else if ((t instanceof t0 ? e.Jr.rt(t) : t instanceof t1 ? e.Jr.ft(t) : e.Jr.at(t), !n.isEqual(U.min()))) try {
                    const s = await si(e.localStore);
                    n.compareTo(s) >= 0 && (await (function(e, t) {
                        const n = e.Jr._t(t);
                        return (n.targetChanges.forEach((n, r)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const s = e.Qr.get(r);
                                s && e.Qr.set(r, s.withResumeToken(n.resumeToken, t));
                            }
                        }), n.targetMismatches.forEach((t)=>{
                            const n = e.Qr.get(t);
                            if (!n) return;
                            e.Qr.set(t, n.withResumeToken(W.EMPTY_BYTE_STRING, n.snapshotVersion)), s4(e, t);
                            const r = new ra(n.target, t, 1, n.sequenceNumber);
                            s2(e, r);
                        }), e.remoteSyncer.applyRemoteEvent(n));
                    })(e, n));
                } catch (i) {
                    g("RemoteStore", "Failed to raise snapshot:", i), await it(e, i);
                }
            }
            async function it(e, t, n) {
                if (!n9(t)) throw t;
                e.Wr.add(1), await sZ(e), e.Hr.set("Offline"), n || (n = ()=>si(e.localStore)), e.asyncQueue.enqueueRetryable(async ()=>{
                    g("RemoteStore", "Retrying IndexedDB access"), await n(), e.Wr.delete(1), await sX(e);
                });
            }
            function ir(e, t) {
                return t().catch((n)=>it(e, n, t));
            }
            async function is(e) {
                const t = T(e), n = ip(t);
                let r = t.jr.length > 0 ? t.jr[t.jr.length - 1].batchId : -1;
                for(; ii(t);)try {
                    const s = await sc(t.localStore, r);
                    if (null === s) {
                        0 === t.jr.length && n.wr();
                        break;
                    }
                    (r = s.batchId), io(t, s);
                } catch (i) {
                    await it(t, i);
                }
                ia(t) && ic(t);
            }
            function ii(e) {
                return s5(e) && e.jr.length < 10;
            }
            function io(e, t) {
                e.jr.push(t);
                const n = ip(e);
                n.hr() && n.Vr && n.Sr(t.mutations);
            }
            function ia(e) {
                return s5(e) && !ip(e).ur() && e.jr.length > 0;
            }
            function ic(e) {
                ip(e).start();
            }
            async function iu(e) {
                ip(e).Nr();
            }
            async function ih(e) {
                const t = ip(e);
                for (const n of e.jr)t.Sr(n.mutations);
            }
            async function il(e, t, n) {
                const r = e.jr.shift(), s = ro.from(r, t, n);
                await ir(e, ()=>e.remoteSyncer.applySuccessfulWrite(s)), await is(e);
            }
            async function id(e, t) {
                t && ip(e).Vr && (await (async function(e, t) {
                    if (((r = t.code), tF(r) && r !== b.ABORTED)) {
                        const n = e.jr.shift();
                        ip(e).dr(), await ir(e, ()=>e.remoteSyncer.rejectFailedWrite(n.batchId, t)), await is(e);
                    }
                    var r;
                })(e, t)), ia(e) && ic(e);
            }
            async function im(e, t) {
                const n = T(e);
                t ? (n.Wr.delete(2), await sX(n)) : t || (n.Wr.add(2), await sZ(n), n.Hr.set("Unknown"));
            }
            function ig(e) {
                return (e.Yr || ((e.Yr = (function(e, t, n) {
                    const r = T(e);
                    return (r.$r(), new sQ(t, r.sr, r.credentials, r.N, n));
                })(e.datastore, e.asyncQueue, {
                    Si: s9.bind(null, e),
                    Ci: s7.bind(null, e),
                    Rr: ie.bind(null, e)
                })), e.Gr.push(async (t)=>{
                    t ? (e.Yr.dr(), s6(e) ? s3(e) : e.Hr.set("Unknown")) : (await e.Yr.stop(), s8(e));
                })), e.Yr);
            }
            function ip(e) {
                return (e.Xr || ((e.Xr = (function(e, t, n) {
                    const r = T(e);
                    return (r.$r(), new sH(t, r.sr, r.credentials, r.N, n));
                })(e.datastore, e.asyncQueue, {
                    Si: iu.bind(null, e),
                    Ci: id.bind(null, e),
                    Cr: ih.bind(null, e),
                    Dr: il.bind(null, e)
                })), e.Gr.push(async (t)=>{
                    t ? (e.Xr.dr(), await is(e)) : (await e.Xr.stop(), e.jr.length > 0 && (g("RemoteStore", `Stopping write stream with ${e.jr.length} pending writes`), (e.jr = [])));
                })), e.Xr);
            }
            class iy {
                constructor(e, t, n, r, s){
                    (this.asyncQueue = e), (this.timerId = t), (this.targetTimeMs = n), (this.op = r), (this.removalCallback = s), (this.deferred = new N()), (this.then = this.deferred.promise.then.bind(this.deferred.promise)), this.deferred.promise.catch((e)=>{});
                }
                static createAndSchedule(e, t, n, r, s) {
                    const i = Date.now() + n, o = new iy(e, t, i, r, s);
                    return o.start(n), o;
                }
                start(e) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), e);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(e) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new S(b.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((e)=>this.deferred.resolve(e))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), (this.timerHandle = null));
                }
            }
            function iw(e, t) {
                if ((p("AsyncQueue", `${t}: ${e}`), n9(e))) return new S(b.UNAVAILABLE, `${t}: ${e}`);
                throw e;
            }
            class iI {
                constructor(e){
                    (this.comparator = e ? (t, n)=>e(t, n) || eo.comparator(t.key, n.key) : (e, t)=>eo.comparator(e.key, t.key)), (this.keyedMap = tj()), (this.sortedSet = new tP(this.comparator));
                }
                static emptySet(e) {
                    return new iI(e.comparator);
                }
                has(e) {
                    return null != this.keyedMap.get(e);
                }
                get(e) {
                    return this.keyedMap.get(e);
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
                indexOf(e) {
                    const t = this.keyedMap.get(e);
                    return t ? this.sortedSet.indexOf(t) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(e) {
                    this.sortedSet.inorderTraversal((t, n)=>(e(t), !1));
                }
                add(e) {
                    const t = this.delete(e.key);
                    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
                }
                delete(e) {
                    const t = this.get(e);
                    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
                }
                isEqual(e) {
                    if (!(e instanceof iI)) return !1;
                    if (this.size !== e.size) return !1;
                    const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
                    for(; t.hasNext();){
                        const r = t.getNext().key, s = n.getNext().key;
                        if (!r.isEqual(s)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const e = [];
                    return (this.forEach((t)=>{
                        e.push(t.toString());
                    }), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)");
                }
                copy(e, t) {
                    const n = new iI();
                    return ((n.comparator = this.comparator), (n.keyedMap = e), (n.sortedSet = t), n);
                }
            }
            class iv {
                constructor(){
                    this.Zr = new tP(eo.comparator);
                }
                track(e) {
                    const t = e.doc.key, n = this.Zr.get(t);
                    n ? 0 !== e.type && 3 === n.type ? (this.Zr = this.Zr.insert(t, e)) : 3 === e.type && 1 !== n.type ? (this.Zr = this.Zr.insert(t, {
                        type: n.type,
                        doc: e.doc
                    })) : 2 === e.type && 2 === n.type ? (this.Zr = this.Zr.insert(t, {
                        type: 2,
                        doc: e.doc
                    })) : 2 === e.type && 0 === n.type ? (this.Zr = this.Zr.insert(t, {
                        type: 0,
                        doc: e.doc
                    })) : 1 === e.type && 0 === n.type ? (this.Zr = this.Zr.remove(t)) : 1 === e.type && 2 === n.type ? (this.Zr = this.Zr.insert(t, {
                        type: 1,
                        doc: n.doc
                    })) : 0 === e.type && 1 === n.type ? (this.Zr = this.Zr.insert(t, {
                        type: 2,
                        doc: e.doc
                    })) : I() : (this.Zr = this.Zr.insert(t, e));
                }
                eo() {
                    const e = [];
                    return (this.Zr.inorderTraversal((t, n)=>{
                        e.push(n);
                    }), e);
                }
            }
            class iE {
                constructor(e, t, n, r, s, i, o, a){
                    (this.query = e), (this.docs = t), (this.oldDocs = n), (this.docChanges = r), (this.mutatedKeys = s), (this.fromCache = i), (this.syncStateChanged = o), (this.excludesMetadataChanges = a);
                }
                static fromInitialDocuments(e, t, n, r) {
                    const s = [];
                    return (t.forEach((e)=>{
                        s.push({
                            type: 0,
                            doc: e
                        });
                    }), new iE(e, t, iI.emptySet(t), s, n, r, !0, !1));
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(e) {
                    if (!(this.fromCache === e.fromCache && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && e4(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return !1;
                    const t = this.docChanges, n = e.docChanges;
                    if (t.length !== n.length) return !1;
                    for(let r = 0; r < t.length; r++)if (t[r].type !== n[r].type || !t[r].doc.isEqual(n[r].doc)) return !1;
                    return !0;
                }
            }
            class iT {
                constructor(){
                    (this.no = void 0), (this.listeners = []);
                }
            }
            class ib {
                constructor(){
                    (this.queries = new rQ((e)=>e3(e), e4)), (this.onlineState = "Unknown"), (this.so = new Set());
                }
            }
            async function iS(e, t) {
                const n = T(e), r = t.query;
                let s = !1, i = n.queries.get(r);
                if ((i || ((s = !0), (i = new iT())), s)) try {
                    i.no = await n.onListen(r);
                } catch (o) {
                    const a = iw(o, `Initialization of query '${e6(t.query)}' failed`);
                    return void t.onError(a);
                }
                if ((n.queries.set(r, i), i.listeners.push(t), t.io(n.onlineState), i.no)) {
                    t.ro(i.no) && iD(n);
                }
            }
            async function iN(e, t) {
                const n = T(e), r = t.query;
                let s = !1;
                const i = n.queries.get(r);
                if (i) {
                    const o = i.listeners.indexOf(t);
                    o >= 0 && (i.listeners.splice(o, 1), (s = 0 === i.listeners.length));
                }
                if (s) return n.queries.delete(r), n.onUnlisten(r);
            }
            function i$(e, t) {
                const n = T(e);
                let r = !1;
                for (const s of t){
                    const i = s.query, o = n.queries.get(i);
                    if (o) {
                        for (const a of o.listeners)a.ro(s) && (r = !0);
                        o.no = s;
                    }
                }
                r && iD(n);
            }
            function iA(e, t, n) {
                const r = T(e), s = r.queries.get(t);
                if (s) for (const i of s.listeners)i.onError(n);
                r.queries.delete(t);
            }
            function iD(e) {
                e.so.forEach((e)=>{
                    e.next();
                });
            }
            class ik {
                constructor(e, t, n){
                    (this.query = e), (this.oo = t), (this.co = !1), (this.ao = null), (this.onlineState = "Unknown"), (this.options = n || {});
                }
                ro(e) {
                    if (!this.options.includeMetadataChanges) {
                        const t = [];
                        for (const n of e.docChanges)3 !== n.type && t.push(n);
                        e = new iE(e.query, e.docs, e.oldDocs, t, e.mutatedKeys, e.fromCache, e.syncStateChanged, !0);
                    }
                    let r = !1;
                    return (this.co ? this.uo(e) && (this.oo.next(e), (r = !0)) : this.ho(e, this.onlineState) && (this.lo(e), (r = !0)), (this.ao = e), r);
                }
                onError(e) {
                    this.oo.error(e);
                }
                io(e) {
                    this.onlineState = e;
                    let t = !1;
                    return (this.ao && !this.co && this.ho(this.ao, e) && (this.lo(this.ao), (t = !0)), t);
                }
                ho(e, t) {
                    if (!e.fromCache) return !0;
                    const n = "Offline" !== t;
                    return ((!this.options.fo || !n) && (!e.docs.isEmpty() || "Offline" === t));
                }
                uo(e) {
                    if (e.docChanges.length > 0) return !0;
                    const t = this.ao && this.ao.hasPendingWrites !== e.hasPendingWrites;
                    return (!(!e.syncStateChanged && !t) && !0 === this.options.includeMetadataChanges);
                }
                lo(e) {
                    (e = iE.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache)), (this.co = !0), this.oo.next(e);
                }
            }
            class ix {
                constructor(e, t){
                    (this.payload = e), (this.byteLength = t);
                }
                wo() {
                    return "metadata" in this.payload;
                }
            }
            class iC {
                constructor(e){
                    this.N = e;
                }
                zn(e) {
                    return na(this.N, e);
                }
                Hn(e) {
                    return e.metadata.exists ? nf(this.N, e.document, !1) : eb.newNoDocument(this.zn(e.metadata.name), this.Jn(e.metadata.readTime));
                }
                Jn(e) {
                    return nr(e);
                }
            }
            class iL {
                constructor(e, t, n){
                    (this._o = e), (this.localStore = t), (this.N = n), (this.queries = []), (this.documents = []), (this.progress = iR(e));
                }
                mo(e) {
                    this.progress.bytesLoaded += e.byteLength;
                    let t = this.progress.documentsLoaded;
                    return (e.payload.namedQuery ? this.queries.push(e.payload.namedQuery) : e.payload.documentMetadata ? (this.documents.push({
                        metadata: e.payload.documentMetadata
                    }), e.payload.documentMetadata.exists || ++t) : e.payload.document && ((this.documents[this.documents.length - 1].document = e.payload.document), ++t), t !== this.progress.documentsLoaded ? ((this.progress.documentsLoaded = t), Object.assign({}, this.progress)) : null);
                }
                yo(e) {
                    const t = new Map(), n = new iC(this.N);
                    for (const r of e)if (r.metadata.queries) {
                        const s = n.zn(r.metadata.name);
                        for (const i of r.metadata.queries){
                            const o = (t.get(i) || tW()).add(s);
                            t.set(i, o);
                        }
                    }
                    return t;
                }
                async complete() {
                    const e = await sg(this.localStore, new iC(this.N), this.documents, this._o.id), t = this.yo(this.documents);
                    for (const n of this.queries)await sp(this.localStore, n, t.get(n.name));
                    return ((this.progress.taskState = "Success"), new r8(Object.assign({}, this.progress), e));
                }
            }
            function iR(e) {
                return {
                    taskState: "Running",
                    documentsLoaded: 0,
                    bytesLoaded: 0,
                    totalDocuments: e.totalDocuments,
                    totalBytes: e.totalBytes
                };
            }
            class iM {
                constructor(e){
                    this.key = e;
                }
            }
            class iF {
                constructor(e){
                    this.key = e;
                }
            }
            class iO {
                constructor(e, t){
                    (this.query = e), (this.po = t), (this.To = null), (this.current = !1), (this.Eo = tW()), (this.mutatedKeys = tW()), (this.Io = e8(e)), (this.Ao = new iI(this.Io));
                }
                get Ro() {
                    return this.po;
                }
                bo(e, t) {
                    const n = t ? t.Po : new iv(), r = t ? t.Ao : this.Ao;
                    let s = t ? t.mutatedKeys : this.mutatedKeys, i = r, o = !1;
                    const a = eW(this.query) && r.size === this.query.limit ? r.last() : null, c = eY(this.query) && r.size === this.query.limit ? r.first() : null;
                    if ((e.inorderTraversal((e, t)=>{
                        const u = r.get(e), h = e5(this.query, t) ? t : null, l = !!u && this.mutatedKeys.has(u.key), d = !!h && (h.hasLocalMutations || (this.mutatedKeys.has(h.key) && h.hasCommittedMutations));
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
                        f && (h ? ((i = i.add(h)), (s = d ? s.add(e) : s.delete(e))) : ((i = i.delete(e)), (s = s.delete(e))));
                    }), eW(this.query) || eY(this.query))) for(; i.size > this.query.limit;){
                        const u = eW(this.query) ? i.last() : i.first();
                        (i = i.delete(u.key)), (s = s.delete(u.key)), n.track({
                            type: 1,
                            doc: u
                        });
                    }
                    return {
                        Ao: i,
                        Po: n,
                        Ln: o,
                        mutatedKeys: s
                    };
                }
                vo(e, t) {
                    return (e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations);
                }
                applyChanges(e, t, n) {
                    const r = this.Ao;
                    (this.Ao = e.Ao), (this.mutatedKeys = e.mutatedKeys);
                    const s = e.Po.eo();
                    s.sort((e, t)=>(function(e, t) {
                            const n = (e)=>{
                                switch(e){
                                    case 0:
                                        return 1;
                                    case 2:
                                    case 3:
                                        return 2;
                                    case 1:
                                        return 0;
                                    default:
                                        return I();
                                }
                            };
                            return n(e) - n(t);
                        })(e.type, t.type) || this.Io(e.doc, t.doc)), this.Vo(n);
                    const i = t ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, a = o !== this.To;
                    if (((this.To = o), 0 !== s.length || a)) {
                        return {
                            snapshot: new iE(this.query, e.Ao, r, s, e.mutatedKeys, 0 === o, a, !1),
                            Do: i
                        };
                    }
                    return {
                        Do: i
                    };
                }
                io(e) {
                    return this.current && "Offline" === e ? ((this.current = !1), this.applyChanges({
                        Ao: this.Ao,
                        Po: new iv(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(e) {
                    return (!this.po.has(e) && !!this.Ao.has(e) && !this.Ao.get(e).hasLocalMutations);
                }
                Vo(e) {
                    e && (e.addedDocuments.forEach((e)=>(this.po = this.po.add(e))), e.modifiedDocuments.forEach((e)=>{}), e.removedDocuments.forEach((e)=>(this.po = this.po.delete(e))), (this.current = e.current));
                }
                So() {
                    if (!this.current) return [];
                    const e = this.Eo;
                    (this.Eo = tW()), this.Ao.forEach((e)=>{
                        this.Co(e.key) && (this.Eo = this.Eo.add(e.key));
                    });
                    const t = [];
                    return (e.forEach((e)=>{
                        this.Eo.has(e) || t.push(new iF(e));
                    }), this.Eo.forEach((n)=>{
                        e.has(n) || t.push(new iM(n));
                    }), t);
                }
                No(e) {
                    (this.po = e.Gn), (this.Eo = tW());
                    const t = this.bo(e.documents);
                    return this.applyChanges(t, !0);
                }
                xo() {
                    return iE.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class iP {
                constructor(e, t, n){
                    (this.query = e), (this.targetId = t), (this.view = n);
                }
            }
            class iV {
                constructor(e){
                    (this.key = e), (this.ko = !1);
                }
            }
            class iU {
                constructor(e, t, n, r, s, i){
                    (this.localStore = e), (this.remoteStore = t), (this.eventManager = n), (this.sharedClientState = r), (this.currentUser = s), (this.maxConcurrentLimboResolutions = i), (this.$o = {}), (this.Oo = new rQ((e)=>e3(e), e4)), (this.Fo = new Map()), (this.Mo = new Set()), (this.Lo = new tP(eo.comparator)), (this.Bo = new Map()), (this.Uo = new sw()), (this.qo = {}), (this.Ko = new Map()), (this.jo = rF.ie()), (this.onlineState = "Unknown"), (this.Qo = void 0);
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function iq(e, t) {
                const n = oi(e);
                let r, s;
                const i = n.Oo.get(t);
                if (i) (r = i.targetId), n.sharedClientState.addLocalQueryTarget(r), (s = i.view.xo());
                else {
                    const o = await su(n.localStore, e1(t)), a = n.sharedClientState.addLocalQueryTarget(o.targetId);
                    (r = o.targetId), (s = await iB(n, t, r, "current" === a)), n.isPrimaryClient && s0(n.remoteStore, o);
                }
                return s;
            }
            async function iB(e, t, n, r) {
                e.Wo = (t, n, r)=>(async function(e, t, n, r) {
                        let s = t.view.bo(n);
                        s.Ln && (s = await sl(e.localStore, t.query, !1).then(({ documents: e  })=>t.view.bo(e, s)));
                        const i = r && r.targetChanges.get(t.targetId), o = t.view.applyChanges(s, e.isPrimaryClient, i);
                        return i0(e, t.targetId, o.Do), o.snapshot;
                    })(e, t, n, r);
                const s = await sl(e.localStore, t, !0), i = new iO(t, s.Gn), o = i.bo(s.documents), a = tZ.createSynthesizedTargetChangeForCurrentChange(n, r && "Offline" !== e.onlineState), c = i.applyChanges(o, e.isPrimaryClient, a);
                i0(e, n, c.Do);
                const u = new iP(t, n, i);
                return (e.Oo.set(t, u), e.Fo.has(n) ? e.Fo.get(n).push(t) : e.Fo.set(n, [
                    t
                ]), c.snapshot);
            }
            async function iK(e, t) {
                const n = T(e), r = n.Oo.get(t), s = n.Fo.get(r.targetId);
                if (s.length > 1) return (n.Fo.set(r.targetId, s.filter((e)=>!e4(e, t))), void n.Oo.delete(t));
                if (n.isPrimaryClient) {
                    n.sharedClientState.removeLocalQueryTarget(r.targetId);
                    n.sharedClientState.isActiveQueryTarget(r.targetId) || (await sh(n.localStore, r.targetId, !1).then(()=>{
                        n.sharedClientState.clearQueryState(r.targetId), s1(n.remoteStore, r.targetId), iX(n, r.targetId);
                    }).catch(rq));
                } else iX(n, r.targetId), await sh(n.localStore, r.targetId, !0);
            }
            async function i_(e, t, n) {
                const r = oo(e);
                try {
                    const s = await (function(e, t) {
                        const n = T(e), r = V.now(), s = t.reduce((e, t)=>e.add(t.key), tW());
                        let i;
                        return n.persistence.runTransaction("Locally write mutations", "readwrite", (e)=>n.Qn.Pn(e, s).next((s)=>{
                                i = s;
                                const o = [];
                                for (const a of t){
                                    const c = tT(a, i.get(a.key));
                                    null != c && o.push(new t$(a.key, c, eT(c.value.mapValue), ty.exists(!0)));
                                }
                                return n.In.addMutationBatch(e, r, o, t);
                            })).then((e)=>(e.applyToLocalDocumentSet(i), {
                                batchId: e.batchId,
                                changes: i
                            }));
                    })(r.localStore, t);
                    r.sharedClientState.addPendingMutation(s.batchId), (function(e, t, n) {
                        let r = e.qo[e.currentUser.toKey()];
                        r || (r = new tP(F));
                        (r = r.insert(t, n)), (e.qo[e.currentUser.toKey()] = r);
                    })(r, s.batchId, n), await i4(r, s.changes), await is(r.remoteStore);
                } catch (i) {
                    const o = iw(i, "Failed to persist write");
                    n.reject(o);
                }
            }
            async function iz(e, t) {
                const n = T(e);
                try {
                    const r = await so(n.localStore, t);
                    t.targetChanges.forEach((e, t)=>{
                        const r = n.Bo.get(t);
                        r && (v(e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size <= 1), e.addedDocuments.size > 0 ? (r.ko = !0) : e.modifiedDocuments.size > 0 ? v(r.ko) : e.removedDocuments.size > 0 && (v(r.ko), (r.ko = !1)));
                    }), await i4(n, r, t);
                } catch (s) {
                    await rq(s);
                }
            }
            function ij(e, t, n) {
                const r = T(e);
                if ((r.isPrimaryClient && 0 === n) || (!r.isPrimaryClient && 1 === n)) {
                    const s = [];
                    r.Oo.forEach((e, n)=>{
                        const r = n.view.io(t);
                        r.snapshot && s.push(r.snapshot);
                    }), (function(e, t) {
                        const n = T(e);
                        n.onlineState = t;
                        let r = !1;
                        n.queries.forEach((e, n)=>{
                            for (const s of n.listeners)s.io(t) && (r = !0);
                        }), r && iD(n);
                    })(r.eventManager, t), s.length && r.$o.Rr(s), (r.onlineState = t), r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
                }
            }
            async function iG(e, t, n) {
                const r = T(e);
                r.sharedClientState.updateQueryState(t, "rejected", n);
                const s = r.Bo.get(t), i = s && s.key;
                if (i) {
                    let o = new tP(eo.comparator);
                    o = o.insert(i, eb.newNoDocument(i, U.min()));
                    const a = tW().add(i), c = new tX(U.min(), new Map(), new tq(F), o, a);
                    await iz(r, c), (r.Lo = r.Lo.remove(i)), r.Bo.delete(t), i2(r);
                } else await sh(r.localStore, t, !1).then(()=>iX(r, t, n)).catch(rq);
            }
            async function iQ(e, t) {
                const n = T(e), r = t.batch.batchId;
                try {
                    const s = await ss(n.localStore, t);
                    iJ(n, r, null), iY(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await i4(n, s);
                } catch (i) {
                    await rq(i);
                }
            }
            async function iH(e, t, n) {
                const r = T(e);
                try {
                    const s = await (function(e, t) {
                        const n = T(e);
                        return n.persistence.runTransaction("Reject batch", "readwrite-primary", (e)=>{
                            let r;
                            return n.In.lookupMutationBatch(e, t).next((t)=>(v(null !== t), (r = t.keys()), n.In.removeMutationBatch(e, t))).next(()=>n.In.performConsistencyCheck(e)).next(()=>n.Qn.Pn(e, r));
                        });
                    })(r.localStore, t);
                    iJ(r, t, n), iY(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await i4(r, s);
                } catch (i) {
                    await rq(i);
                }
            }
            async function iW(e, t) {
                const n = T(e);
                s5(n.remoteStore) || g("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
                try {
                    const r = await (function(e) {
                        const t = T(e);
                        return t.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (e)=>t.In.getHighestUnacknowledgedBatchId(e));
                    })(n.localStore);
                    if (-1 === r) return void t.resolve();
                    const s = n.Ko.get(r) || [];
                    s.push(t), n.Ko.set(r, s);
                } catch (i) {
                    const o = iw(i, "Initialization of waitForPendingWrites() operation failed");
                    t.reject(o);
                }
            }
            function iY(e, t) {
                (e.Ko.get(t) || []).forEach((e)=>{
                    e.resolve();
                }), e.Ko.delete(t);
            }
            function iJ(e, t, n) {
                const r = T(e);
                let s = r.qo[r.currentUser.toKey()];
                if (s) {
                    const i = s.get(t);
                    i && (n ? i.reject(n) : i.resolve(), (s = s.remove(t))), (r.qo[r.currentUser.toKey()] = s);
                }
            }
            function iX(e, t, n = null) {
                e.sharedClientState.removeLocalQueryTarget(t);
                for (const r of e.Fo.get(t))e.Oo.delete(r), n && e.$o.Go(r, n);
                if ((e.Fo.delete(t), e.isPrimaryClient)) {
                    e.Uo.cs(t).forEach((t)=>{
                        e.Uo.containsKey(t) || iZ(e, t);
                    });
                }
            }
            function iZ(e, t) {
                e.Mo.delete(t.path.canonicalString());
                const n = e.Lo.get(t);
                null !== n && (s1(e.remoteStore, n), (e.Lo = e.Lo.remove(t)), e.Bo.delete(n), i2(e));
            }
            function i0(e, t, n) {
                for (const r of n)if (r instanceof iM) e.Uo.addReference(r.key, t), i1(e, r);
                else if (r instanceof iF) {
                    g("SyncEngine", "Document no longer in limbo: " + r.key), e.Uo.removeReference(r.key, t);
                    e.Uo.containsKey(r.key) || iZ(e, r.key);
                } else I();
            }
            function i1(e, t) {
                const n = t.key, r = n.path.canonicalString();
                e.Lo.get(n) || e.Mo.has(r) || (g("SyncEngine", "New document in limbo: " + n), e.Mo.add(r), i2(e));
            }
            function i2(e) {
                for(; e.Mo.size > 0 && e.Lo.size < e.maxConcurrentLimboResolutions;){
                    const t = e.Mo.values().next().value;
                    e.Mo.delete(t);
                    const n = new eo(z.fromString(t)), r = e.jo.next();
                    e.Bo.set(r, new iV(n)), (e.Lo = e.Lo.insert(n, r)), s0(e.remoteStore, new ra(e1(eH(n.path)), r, 2, L.T));
                }
            }
            async function i4(e, t, n) {
                const r = T(e), s = [], i = [], o = [];
                r.Oo.isEmpty() || (r.Oo.forEach((e, a)=>{
                    o.push(r.Wo(a, t, n).then((e)=>{
                        if (e) {
                            r.isPrimaryClient && r.sharedClientState.updateQueryState(a.targetId, e.fromCache ? "not-current" : "current"), s.push(e);
                            const t = r7.kn(a.targetId, e);
                            i.push(t);
                        }
                    }));
                }), await Promise.all(o), r.$o.Rr(s), await (async function(e, t) {
                    const n = T(e);
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e)=>n4.forEach(t, (t)=>n4.forEach(t.Nn, (r)=>n.persistence.referenceDelegate.addReference(e, t.targetId, r)).next(()=>n4.forEach(t.xn, (r)=>n.persistence.referenceDelegate.removeReference(e, t.targetId, r)))));
                    } catch (r) {
                        if (!n9(r)) throw r;
                        g("LocalStore", "Failed to update sequence numbers: " + r);
                    }
                    for (const s of t){
                        const i = s.targetId;
                        if (!s.fromCache) {
                            const o = n.Un.get(i), a = o.snapshotVersion, c = o.withLastLimboFreeSnapshotVersion(a);
                            n.Un = n.Un.insert(i, c);
                        }
                    }
                })(r.localStore, i));
            }
            async function i3(e, t) {
                const n = T(e);
                if (!n.currentUser.isEqual(t)) {
                    g("SyncEngine", "User change. New user:", t.toKey());
                    const r = await sr(n.localStore, t);
                    (n.currentUser = t), (function(e, t) {
                        e.Ko.forEach((e)=>{
                            e.forEach((e)=>{
                                e.reject(new S(b.CANCELLED, t));
                            });
                        }), e.Ko.clear();
                    })(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(t, r.removedBatchIds, r.addedBatchIds), await i4(n, r.Wn);
                }
            }
            function i6(e, t) {
                const n = T(e), r = n.Bo.get(t);
                if (r && r.ko) return tW().add(r.key);
                {
                    let s = tW();
                    const i = n.Fo.get(t);
                    if (!i) return s;
                    for (const o of i){
                        const a = n.Oo.get(o);
                        s = s.unionWith(a.view.Ro);
                    }
                    return s;
                }
            }
            async function i5(e, t) {
                const n = T(e), r = await sl(n.localStore, t.query, !0), s = t.view.No(r);
                return n.isPrimaryClient && i0(n, t.targetId, s.Do), s;
            }
            async function i8(e) {
                const t = T(e);
                return sf(t.localStore).then((e)=>i4(t, e));
            }
            async function i9(e, t, n, r) {
                const s = T(e), i = await (function(e, t) {
                    const n = T(e), r = T(n.In);
                    return n.persistence.runTransaction("Lookup mutation documents", "readonly", (e)=>r.Xt(e, t).next((t)=>t ? n.Qn.Pn(e, t) : n4.resolve(null)));
                })(s.localStore, t);
                null !== i ? ("pending" === n ? await is(s.remoteStore) : "acknowledged" === n || "rejected" === n ? (iJ(s, t, r || null), iY(s, t), (function(e, t) {
                    T(T(e).In).te(t);
                })(s.localStore, t)) : I(), await i4(s, i)) : g("SyncEngine", "Cannot apply mutation batch with id: " + t);
            }
            async function i7(e, t) {
                const n = T(e);
                if ((oi(n), oo(n), !0 === t && !0 !== n.Qo)) {
                    const r = n.sharedClientState.getAllActiveQueryTargets(), s = await oe(n, r.toArray());
                    (n.Qo = !0), await im(n.remoteStore, !0);
                    for (const i of s)s0(n.remoteStore, i);
                } else if (!1 === t && !1 !== n.Qo) {
                    const o = [];
                    let a = Promise.resolve();
                    n.Fo.forEach((e, t)=>{
                        n.sharedClientState.isLocalQueryTarget(t) ? o.push(t) : (a = a.then(()=>(iX(n, t), sh(n.localStore, t, !0)))), s1(n.remoteStore, t);
                    }), await a, await oe(n, o), (function(e) {
                        const t = T(e);
                        t.Bo.forEach((e, n)=>{
                            s1(t.remoteStore, n);
                        }), t.Uo.us(), (t.Bo = new Map()), (t.Lo = new tP(eo.comparator));
                    })(n), (n.Qo = !1), await im(n.remoteStore, !1);
                }
            }
            async function oe(e, t, n) {
                const r = T(e), s = [], i = [];
                for (const o of t){
                    let a;
                    const c = r.Fo.get(o);
                    if (c && 0 !== c.length) {
                        a = await su(r.localStore, e1(c[0]));
                        for (const u of c){
                            const h = r.Oo.get(u), l = await i5(r, h);
                            l.snapshot && i.push(l.snapshot);
                        }
                    } else {
                        const d = await sd(r.localStore, o);
                        (a = await su(r.localStore, d)), await iB(r, ot(d), o, !1);
                    }
                    s.push(a);
                }
                return r.$o.Rr(i), s;
            }
            function ot(e) {
                return eQ(e.path, e.collectionGroup, e.orderBy, e.filters, e.limit, "F", e.startAt, e.endAt);
            }
            function on(e) {
                const t = T(e);
                return T(T(t.localStore).persistence).pn();
            }
            async function or(e, t, n, r) {
                const s = T(e);
                if (s.Qo) g("SyncEngine", "Ignoring unexpected query state notification.");
                else if (s.Fo.has(t)) switch(n){
                    case "current":
                    case "not-current":
                        {
                            const i = await sf(s.localStore), o = tX.createSynthesizedRemoteEventForCurrentChange(t, "current" === n);
                            await i4(s, i, o);
                            break;
                        }
                    case "rejected":
                        await sh(s.localStore, t, !0), iX(s, t, r);
                        break;
                    default:
                        I();
                }
            }
            async function os(e, t, n) {
                const r = oi(e);
                if (r.Qo) {
                    for (const s of t){
                        if (r.Fo.has(s)) {
                            g("SyncEngine", "Adding an already active target " + s);
                            continue;
                        }
                        const i = await sd(r.localStore, s), o = await su(r.localStore, i);
                        await iB(r, ot(i), o.targetId, !1), s0(r.remoteStore, o);
                    }
                    for (const a of n)r.Fo.has(a) && (await sh(r.localStore, a, !1).then(()=>{
                        s1(r.remoteStore, a), iX(r, a);
                    }).catch(rq));
                }
            }
            function oi(e) {
                const t = T(e);
                return ((t.remoteStore.remoteSyncer.applyRemoteEvent = iz.bind(null, t)), (t.remoteStore.remoteSyncer.getRemoteKeysForTarget = i6.bind(null, t)), (t.remoteStore.remoteSyncer.rejectListen = iG.bind(null, t)), (t.$o.Rr = i$.bind(null, t.eventManager)), (t.$o.Go = iA.bind(null, t.eventManager)), t);
            }
            function oo(e) {
                const t = T(e);
                return ((t.remoteStore.remoteSyncer.applySuccessfulWrite = iQ.bind(null, t)), (t.remoteStore.remoteSyncer.rejectFailedWrite = iH.bind(null, t)), t);
            }
            function oa(e, t, n) {
                const r = T(e);
                (async function(e, t, n) {
                    try {
                        const r = await t.getMetadata();
                        if (await (function(e, t) {
                            const n = T(e), r = nr(t.createTime);
                            return n.persistence.runTransaction("hasNewerBundle", "readonly", (e)=>n.Je.getBundleMetadata(e, t.id)).then((e)=>!!e && e.createTime.compareTo(r) >= 0);
                        })(e.localStore, r)) return (await t.close(), void n._completeWith((function(e) {
                            return {
                                taskState: "Success",
                                documentsLoaded: e.totalDocuments,
                                bytesLoaded: e.totalBytes,
                                totalDocuments: e.totalDocuments,
                                totalBytes: e.totalBytes
                            };
                        })(r)));
                        n._updateProgress(iR(r));
                        const s = new iL(r, e.localStore, t.N);
                        let i = await t.zo();
                        for(; i;){
                            const o = await s.mo(i);
                            o && n._updateProgress(o), (i = await t.zo());
                        }
                        const a = await s.complete();
                        await i4(e, a.En, void 0), await (function(e, t) {
                            const n = T(e);
                            return n.persistence.runTransaction("Save bundle", "readwrite", (e)=>n.Je.saveBundleMetadata(e, t));
                        })(e.localStore, r), n._completeWith(a.progress);
                    } catch (c) {
                        y("SyncEngine", `Loading bundle failed with ${c}`), n._failWith(c);
                    }
                })(r, t, n).then(()=>{
                    r.sharedClientState.notifyBundleLoaded();
                });
            }
            class oc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(e) {
                    (this.N = sz(e.databaseInfo.databaseId)), (this.sharedClientState = this.Ho(e)), (this.persistence = this.Jo(e)), await this.persistence.start(), (this.gcScheduler = this.Yo(e)), (this.localStore = this.Xo(e));
                }
                Yo(e) {
                    return null;
                }
                Xo(e) {
                    return sn(this.persistence, new se(), e.initialUser, this.N);
                }
                Jo(e) {
                    return new sS(s$.Ns, this.N);
                }
                Ho(e) {
                    return new sO();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class ou extends (null && oc) {
                constructor(e, t, n){
                    super(), (this.Zo = e), (this.cacheSizeBytes = t), (this.forceOwnership = n), (this.synchronizeTabs = !1);
                }
                async initialize(e) {
                    await super.initialize(e), await sm(this.localStore), await this.Zo.initialize(this, e), await oo(this.Zo.syncEngine), await is(this.Zo.remoteStore), await this.persistence.nn(()=>(this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(this.localStore), Promise.resolve()));
                }
                Xo(e) {
                    return sn(this.persistence, new se(), e.initialUser, this.N);
                }
                Yo(e) {
                    const t = this.persistence.referenceDelegate.garbageCollector;
                    return new r_(t, e.asyncQueue);
                }
                Jo(e) {
                    const t = r5(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey), n = void 0 !== this.cacheSizeBytes ? rA.withCacheSize(this.cacheSizeBytes) : rA.DEFAULT;
                    return new r4(this.synchronizeTabs, t, e.clientId, n, e.asyncQueue, sK(), s_(), this.N, this.sharedClientState, !!this.forceOwnership);
                }
                Ho(e) {
                    return new sO();
                }
            }
            class oh extends (null && ou) {
                constructor(e, t){
                    super(e, t, !1), (this.Zo = e), (this.cacheSizeBytes = t), (this.synchronizeTabs = !0);
                }
                async initialize(e) {
                    await super.initialize(e);
                    const t = this.Zo.syncEngine;
                    this.sharedClientState instanceof sF && ((this.sharedClientState.syncEngine = {
                        _i: i9.bind(null, t),
                        mi: or.bind(null, t),
                        gi: os.bind(null, t),
                        pn: on.bind(null, t),
                        wi: i8.bind(null, t)
                    }), await this.sharedClientState.start()), await this.persistence.nn(async (e)=>{
                        await i7(this.Zo.syncEngine, e), this.gcScheduler && (e && !this.gcScheduler.started ? this.gcScheduler.start(this.localStore) : e || this.gcScheduler.stop());
                    });
                }
                Ho(e) {
                    const t = sK();
                    if (!sF.bt(t)) throw new S(b.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
                    const n = r5(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey);
                    return new sF(t, e.asyncQueue, n, e.clientId, e.initialUser);
                }
            }
            class ol {
                async initialize(e, t) {
                    this.localStore || ((this.localStore = e.localStore), (this.sharedClientState = e.sharedClientState), (this.datastore = this.createDatastore(t)), (this.remoteStore = this.createRemoteStore(t)), (this.eventManager = this.createEventManager(t)), (this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs)), (this.sharedClientState.onlineStateHandler = (e)=>ij(this.syncEngine, e, 1)), (this.remoteStore.remoteSyncer.handleCredentialChange = i3.bind(null, this.syncEngine)), await im(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(e) {
                    return new ib();
                }
                createDatastore(e) {
                    const t = sz(e.databaseInfo.databaseId), n = ((r = e.databaseInfo), new sB(r));
                    var r;
                    return (function(e, t, n) {
                        return new sW(e, t, n);
                    })(e.credentials, n, t);
                }
                createRemoteStore(e) {
                    return ((t = this.localStore), (n = this.datastore), (r = e.asyncQueue), (s = (e)=>ij(this.syncEngine, e, 0)), (i = sV.bt() ? new sV() : new sP()), new sJ(t, n, r, s, i));
                    var t, n, r, s, i;
                }
                createSyncEngine(e, t) {
                    return (function(e, t, n, r, s, i, o) {
                        const a = new iU(e, t, n, r, s, i);
                        return o && (a.Qo = !0), a;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
                }
                terminate() {
                    return (async function(e) {
                        const t = T(e);
                        g("RemoteStore", "RemoteStore shutting down."), t.Wr.add(5), await sZ(t), t.zr.shutdown(), t.Hr.set("Unknown");
                    })(this.remoteStore);
                }
            }
            function od(e, t = 10240) {
                let n = 0;
                return {
                    async read () {
                        if (n < e.byteLength) {
                            const r = {
                                value: e.slice(n, n + t),
                                done: !1
                            };
                            return (n += t), r;
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
                constructor(e){
                    (this.observer = e), (this.muted = !1);
                }
                next(e) {
                    this.observer.next && this.tc(this.observer.next, e);
                }
                error(e) {
                    this.observer.error ? this.tc(this.observer.error, e) : console.error("Uncaught Error in snapshot listener:", e);
                }
                ec() {
                    this.muted = !0;
                }
                tc(e, t) {
                    this.muted || setTimeout(()=>{
                        this.muted || e(t);
                    }, 0);
                }
            }
            class om {
                constructor(e, t){
                    (this.nc = e), (this.N = t), (this.metadata = new N()), (this.buffer = new Uint8Array()), (this.sc = new TextDecoder("utf-8")), this.ic().then((e)=>{
                        e && e.wo() ? this.metadata.resolve(e.payload.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null == e ? void 0 : e.payload)}`));
                    }, (e)=>this.metadata.reject(e));
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
                    const e = await this.rc();
                    if (null === e) return null;
                    const t = this.sc.decode(e), n = Number(t);
                    isNaN(n) && this.oc(`length string (${t}) is not valid number`);
                    const r = await this.cc(n);
                    return new ix(JSON.parse(r), e.length + n);
                }
                ac() {
                    return this.buffer.findIndex((e)=>e === "{".charCodeAt(0));
                }
                async rc() {
                    for(; this.ac() < 0;){
                        if (await this.uc()) break;
                    }
                    if (0 === this.buffer.length) return null;
                    const e = this.ac();
                    e < 0 && this.oc("Reached the end of bundle when a length string is expected.");
                    const t = this.buffer.slice(0, e);
                    return (this.buffer = this.buffer.slice(e)), t;
                }
                async cc(e) {
                    for(; this.buffer.length < e;){
                        (await this.uc()) && this.oc("Reached the end of bundle when more is expected.");
                    }
                    const t = this.sc.decode(this.buffer.slice(0, e));
                    return (this.buffer = this.buffer.slice(e)), t;
                }
                oc(e) {
                    throw ((this.nc.cancel(), new Error(`Invalid bundle format: ${e}`)));
                }
                async uc() {
                    const e = await this.nc.read();
                    if (!e.done) {
                        const t = new Uint8Array(this.buffer.length + e.value.length);
                        t.set(this.buffer), t.set(e.value, this.buffer.length), (this.buffer = t);
                    }
                    return e.done;
                }
            }
            class og {
                constructor(e){
                    (this.datastore = e), (this.readVersions = new Map()), (this.mutations = []), (this.committed = !1), (this.lastWriteError = null), (this.writtenDocs = new Set());
                }
                async lookup(e) {
                    if ((this.ensureCommitNotCalled(), this.mutations.length > 0)) throw new S(b.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
                    const t = await (async function(e, t) {
                        const n = T(e), r = nh(n.N) + "/documents", s = {
                            documents: t.map((e)=>no(n.N, e))
                        }, i = await n.Ki("BatchGetDocuments", r, s), o = new Map();
                        i.forEach((e)=>{
                            const t = nm(n.N, e);
                            o.set(t.key.toString(), t);
                        });
                        const a = [];
                        return (t.forEach((e)=>{
                            const t = o.get(e.toString());
                            v(!!t), a.push(t);
                        }), a);
                    })(this.datastore, e);
                    return t.forEach((e)=>this.recordVersion(e)), t;
                }
                set(e, t) {
                    this.write(t.toMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
                }
                update(e, t) {
                    try {
                        this.write(t.toMutation(e, this.preconditionForUpdate(e)));
                    } catch (n) {
                        this.lastWriteError = n;
                    }
                    this.writtenDocs.add(e.toString());
                }
                delete(e) {
                    this.write(new tx(e, this.precondition(e))), this.writtenDocs.add(e.toString());
                }
                async commit() {
                    if ((this.ensureCommitNotCalled(), this.lastWriteError)) throw this.lastWriteError;
                    const e = this.readVersions;
                    this.mutations.forEach((t)=>{
                        e.delete(t.key.toString());
                    }), e.forEach((e, t)=>{
                        const n = eo.fromPath(t);
                        this.mutations.push(new tC(n, this.precondition(n)));
                    }), await (async function(e, t) {
                        const n = T(e), r = nh(n.N) + "/documents", s = {
                            writes: t.map((e)=>np(n.N, e))
                        };
                        await n.Li("Commit", r, s);
                    })(this.datastore, this.mutations), (this.committed = !0);
                }
                recordVersion(e) {
                    let t;
                    if (e.isFoundDocument()) t = e.version;
                    else {
                        if (!e.isNoDocument()) throw I();
                        t = U.min();
                    }
                    const n = this.readVersions.get(e.key.toString());
                    if (n) {
                        if (!t.isEqual(n)) throw new S(b.ABORTED, "Document version changed between two reads.");
                    } else this.readVersions.set(e.key.toString(), t);
                }
                precondition(e) {
                    const t = this.readVersions.get(e.toString());
                    return !this.writtenDocs.has(e.toString()) && t ? ty.updateTime(t) : ty.none();
                }
                preconditionForUpdate(e) {
                    const t = this.readVersions.get(e.toString());
                    if (!this.writtenDocs.has(e.toString()) && t) {
                        if (t.isEqual(U.min())) throw new S(b.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
                        return ty.updateTime(t);
                    }
                    return ty.exists(!0);
                }
                write(e) {
                    this.ensureCommitNotCalled(), this.mutations.push(e);
                }
                ensureCommitNotCalled() {}
            }
            class op {
                constructor(e, t, n, r){
                    (this.asyncQueue = e), (this.datastore = t), (this.updateFunction = n), (this.deferred = r), (this.hc = 5), (this.ar = new sj(this.asyncQueue, "transaction_retry"));
                }
                run() {
                    (this.hc -= 1), this.lc();
                }
                lc() {
                    this.ar.Xi(async ()=>{
                        const e = new og(this.datastore), t = this.fc(e);
                        t && t.then((t)=>{
                            this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{
                                    this.deferred.resolve(t);
                                }).catch((e)=>{
                                    this.dc(e);
                                }));
                        }).catch((e)=>{
                            this.dc(e);
                        });
                    });
                }
                fc(e) {
                    try {
                        const t = this.updateFunction(e);
                        return !er(t) && t.catch && t.then ? t : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
                    } catch (n) {
                        return this.deferred.reject(n), null;
                    }
                }
                dc(e) {
                    this.hc > 0 && this.wc(e) ? ((this.hc -= 1), this.asyncQueue.enqueueAndForget(()=>(this.lc(), Promise.resolve()))) : this.deferred.reject(e);
                }
                wc(e) {
                    if ("FirebaseError" === e.name) {
                        const t = e.code;
                        return ("aborted" === t || "failed-precondition" === t || !tF(t));
                    }
                    return !1;
                }
            }
            class oy {
                constructor(e, t, n){
                    (this.credentials = e), (this.asyncQueue = t), (this.databaseInfo = n), (this.user = h.UNAUTHENTICATED), (this.clientId = M.I()), (this.credentialListener = ()=>Promise.resolve()), this.credentials.start(t, async (e)=>{
                        g("FirestoreClient", "Received user=", e.uid), await this.credentialListener(e), (this.user = e);
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
                setCredentialChangeListener(e) {
                    this.credentialListener = e;
                }
                verifyNotTerminated() {
                    if (this.asyncQueue.isShuttingDown) throw new S(b.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const e = new N();
                    return (this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && (await this.onlineComponents.terminate()), this.offlineComponents && (await this.offlineComponents.terminate()), this.credentials.shutdown(), e.resolve();
                        } catch (t) {
                            const n = iw(t, "Failed to shutdown persistence");
                            e.reject(n);
                        }
                    }), e.promise);
                }
            }
            async function ow(e, t) {
                e.asyncQueue.verifyOperationInProgress(), g("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await e.getConfiguration();
                await t.initialize(n);
                let r = n.initialUser;
                e.setCredentialChangeListener(async (e)=>{
                    r.isEqual(e) || (await sr(t.localStore, e), (r = e));
                }), t.persistence.setDatabaseDeletedListener(()=>e.terminate()), (e.offlineComponents = t);
            }
            async function oI(e, t) {
                e.asyncQueue.verifyOperationInProgress();
                const n = await ov(e);
                g("FirestoreClient", "Initializing OnlineComponentProvider");
                const r = await e.getConfiguration();
                await t.initialize(n, r), e.setCredentialChangeListener((e)=>(async function(e, t) {
                        const n = T(e);
                        n.asyncQueue.verifyOperationInProgress(), g("RemoteStore", "RemoteStore received new credentials");
                        const r = s5(n);
                        n.Wr.add(3), await sZ(n), r && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(t), n.Wr.delete(3), await sX(n);
                    })(t.remoteStore, e)), (e.onlineComponents = t);
            }
            async function ov(e) {
                return (e.offlineComponents || (g("FirestoreClient", "Using default OfflineComponentProvider"), await ow(e, new oc())), e.offlineComponents);
            }
            async function oE(e) {
                return (e.onlineComponents || (g("FirestoreClient", "Using default OnlineComponentProvider"), await oI(e, new ol())), e.onlineComponents);
            }
            function oT(e) {
                return ov(e).then((e)=>e.persistence);
            }
            function ob(e) {
                return ov(e).then((e)=>e.localStore);
            }
            function oS(e) {
                return oE(e).then((e)=>e.remoteStore);
            }
            function oN(e) {
                return oE(e).then((e)=>e.syncEngine);
            }
            async function o$(e) {
                const t = await oE(e), n = t.eventManager;
                return ((n.onListen = iq.bind(null, t.syncEngine)), (n.onUnlisten = iK.bind(null, t.syncEngine)), n);
            }
            function oA(e) {
                return e.asyncQueue.enqueue(async ()=>{
                    const t = await oT(e), n = await oS(e);
                    return (t.setNetworkEnabled(!0), (function(e) {
                        const t = T(e);
                        return t.Wr.delete(0), sX(t);
                    })(n));
                });
            }
            function oD(e) {
                return e.asyncQueue.enqueue(async ()=>{
                    const t = await oT(e), n = await oS(e);
                    return (t.setNetworkEnabled(!1), (async function(e) {
                        const t = T(e);
                        t.Wr.add(0), await sZ(t), t.Hr.set("Offline");
                    })(n));
                });
            }
            function ok(e, t) {
                const n = new N();
                return (e.asyncQueue.enqueueAndForget(async ()=>(async function(e, t, n) {
                        try {
                            const r = await (function(e, t) {
                                const n = T(e);
                                return n.persistence.runTransaction("read document", "readonly", (e)=>n.Qn.An(e, t));
                            })(e, t);
                            r.isFoundDocument() ? n.resolve(r) : r.isNoDocument() ? n.resolve(null) : n.reject(new S(b.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
                        } catch (s) {
                            const i = iw(s, `Failed to get document '${t} from cache`);
                            n.reject(i);
                        }
                    })(await ob(e), t, n)), n.promise);
            }
            function ox(e, t, n = {}) {
                const r = new N();
                return (e.asyncQueue.enqueueAndForget(async ()=>(function(e, t, n, r, s) {
                        const i = new of({
                            next: (i)=>{
                                t.enqueueAndForget(()=>iN(e, o));
                                const a = i.docs.has(n);
                                !a && i.fromCache ? s.reject(new S(b.UNAVAILABLE, "Failed to get document because the client is offline.")) : a && i.fromCache && r && "server" === r.source ? s.reject(new S(b.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : s.resolve(i);
                            },
                            error: (e)=>s.reject(e)
                        }), o = new ik(eH(n.path), i, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return iS(e, o);
                    })(await o$(e), e.asyncQueue, t, n, r)), r.promise);
            }
            function oC(e, t) {
                const n = new N();
                return (e.asyncQueue.enqueueAndForget(async ()=>(async function(e, t, n) {
                        try {
                            const r = await sl(e, t, !0), s = new iO(t, r.Gn), i = s.bo(r.documents), o = s.applyChanges(i, !1);
                            n.resolve(o.snapshot);
                        } catch (a) {
                            const c = iw(a, `Failed to execute query '${t} against cache`);
                            n.reject(c);
                        }
                    })(await ob(e), t, n)), n.promise);
            }
            function oL(e, t, n = {}) {
                const r = new N();
                return (e.asyncQueue.enqueueAndForget(async ()=>(function(e, t, n, r, s) {
                        const i = new of({
                            next: (n)=>{
                                t.enqueueAndForget(()=>iN(e, o)), n.fromCache && "server" === r.source ? s.reject(new S(b.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : s.resolve(n);
                            },
                            error: (e)=>s.reject(e)
                        }), o = new ik(n, i, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return iS(e, o);
                    })(await o$(e), e.asyncQueue, t, n, r)), r.promise);
            }
            function oR(e, t) {
                const n = new of(t);
                return (e.asyncQueue.enqueueAndForget(async ()=>(function(e, t) {
                        T(e).so.add(t), t.next();
                    })(await o$(e), n)), ()=>{
                    n.ec(), e.asyncQueue.enqueueAndForget(async ()=>(function(e, t) {
                            T(e).so.delete(t);
                        })(await o$(e), n));
                });
            }
            function oM(e, t) {
                const n = new N();
                return (e.asyncQueue.enqueueAndForget(async ()=>{
                    const r = await (function(e) {
                        return oE(e).then((e)=>e.datastore);
                    })(e);
                    new op(e.asyncQueue, r, t, n).run();
                }), n.promise);
            }
            function oF(e, t, n, r) {
                const s = (function(e, t) {
                    let n;
                    n = "string" == typeof e ? new TextEncoder().encode(e) : e;
                    return (function(e, t) {
                        return new om(e, t);
                    })((function(e, t) {
                        if (e instanceof Uint8Array) return od(e, t);
                        if (e instanceof ArrayBuffer) return od(new Uint8Array(e), t);
                        if (e instanceof ReadableStream) return e.getReader();
                        throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
                    })(n), t);
                })(n, sz(t));
                e.asyncQueue.enqueueAndForget(async ()=>{
                    oa(await oN(e), s, r);
                });
            }
            function oO(e, t) {
                return e.asyncQueue.enqueue(async ()=>(function(e, t) {
                        const n = T(e);
                        return n.persistence.runTransaction("Get named query", "readonly", (e)=>n.Je.getNamedQuery(e, t));
                    })(await ob(e), t));
            }
            class oP {
                constructor(e, t, n, r, s, i, o, a){
                    (this.databaseId = e), (this.appId = t), (this.persistenceKey = n), (this.host = r), (this.ssl = s), (this.forceLongPolling = i), (this.autoDetectLongPolling = o), (this.useFetchStreams = a);
                }
            }
            class oV {
                constructor(e, t){
                    (this.projectId = e), (this.database = t || "(default)");
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(e) {
                    return (e instanceof oV && e.projectId === this.projectId && e.database === this.database);
                }
            }
            const oU = new Map();
            function oq(e, t, n) {
                if (!n) throw new S(b.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
            }
            function oB(e, t, n, r) {
                if (!0 === t && !0 === r) throw new S(b.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
            }
            function oK(e) {
                if (!eo.isDocumentKey(e)) throw new S(b.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
            }
            function o_(e) {
                if (eo.isDocumentKey(e)) throw new S(b.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
            }
            function oz(e) {
                if (void 0 === e) return "undefined";
                if (null === e) return "null";
                if ("string" == typeof e) return (e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e));
                if ("number" == typeof e || "boolean" == typeof e) return "" + e;
                if ("object" == typeof e) {
                    if (e instanceof Array) return "an array";
                    {
                        const t = (function(e) {
                            if (e.constructor) return e.constructor.name;
                            return null;
                        })(e);
                        return t ? `a custom ${t} object` : "an object";
                    }
                }
                return "function" == typeof e ? "a function" : I();
            }
            function oj(e, t) {
                if (("_delegate" in e && (e = e._delegate), !(e instanceof t))) {
                    if (t.name === e.constructor.name) throw new S(b.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n = oz(e);
                        throw new S(b.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
                    }
                }
                return e;
            }
            function oG(e, t) {
                if (t <= 0) throw new S(b.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
            }
            class oQ {
                constructor(e){
                    var t;
                    if (void 0 === e.host) {
                        if (void 0 !== e.ssl) throw new S(b.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        (this.host = "firestore.googleapis.com"), (this.ssl = true);
                    } else (this.host = e.host), (this.ssl = null === (t = e.ssl) || void 0 === t || t);
                    if (((this.credentials = e.credentials), (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties), void 0 === e.cacheSizeBytes)) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576) throw new S(b.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = e.cacheSizeBytes;
                    }
                    (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling), (this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling), (this.useFetchStreams = !!e.useFetchStreams), oB("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling);
                }
                isEqual(e) {
                    return (this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams);
                }
            }
            class oH {
                constructor(e, t){
                    (this._credentials = t), (this.type = "firestore-lite"), (this._persistenceKey = "(lite)"), (this._settings = new oQ({})), (this._settingsFrozen = !1), e instanceof oV ? (this._databaseId = e) : ((this._app = e), (this._databaseId = (function(e) {
                        if (!Object.prototype.hasOwnProperty.apply(e.options, [
                            "projectId"
                        ])) throw new S(b.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new oV(e.options.projectId);
                    })(e)));
                }
                get app() {
                    if (!this._app) throw new S(b.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(e) {
                    if (this._settingsFrozen) throw new S(b.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    (this._settings = new oQ(e)), void 0 !== e.credentials && (this._credentials = (function(e) {
                        if (!e) return new A();
                        switch(e.type){
                            case "gapi":
                                const t = e.client;
                                return (v(!("object" != typeof t || null === t || !t.auth || !t.auth.getAuthHeaderValueForFirstParty)), new C(t, e.sessionIndex || "0", e.iamToken || null));
                            case "provider":
                                return e.client;
                            default:
                                throw new S(b.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    })(e.credentials));
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
                    return ((function(e) {
                        const t = oU.get(e);
                        t && (g("ComponentProvider", "Removing Datastore"), oU.delete(e), t.terminate());
                    })(this), Promise.resolve());
                }
            }
            function oW(e, t, n, r = {}) {
                var s;
                const i = (e = oj(e, oH))._getSettings();
                if (("firestore.googleapis.com" !== i.host && i.host !== t && y("Host has been set in both settings() and useEmulator(), emulator host will be used"), e._setSettings(Object.assign(Object.assign({}, i), {
                    host: `${t}:${n}`,
                    ssl: !1
                })), r.mockUserToken)) {
                    let o, a;
                    if ("string" == typeof r.mockUserToken) (o = r.mockUserToken), (a = h.MOCK_USER);
                    else {
                        o = createMockUserToken(r.mockUserToken, null === (s = e._app) || void 0 === s ? void 0 : s.options.projectId);
                        const c = r.mockUserToken.sub || r.mockUserToken.user_id;
                        if (!c) throw new S(b.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
                        a = new h(c);
                    }
                    e._credentials = new D(new $(o, a));
                }
            }
            class oY {
                constructor(e, t, n){
                    (this.converter = t), (this._key = n), (this.type = "document"), (this.firestore = e);
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
                    return new oX(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(e) {
                    return new oY(this.firestore, e, this._key);
                }
            }
            class oJ {
                constructor(e, t, n){
                    (this.converter = t), (this._query = n), (this.type = "query"), (this.firestore = e);
                }
                withConverter(e) {
                    return new oJ(this.firestore, e, this._query);
                }
            }
            class oX extends oJ {
                constructor(e, t, n){
                    super(e, t, eH(n)), (this._path = n), (this.type = "collection");
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const e = this._path.popLast();
                    return e.isEmpty() ? null : new oY(this.firestore, null, new eo(e));
                }
                withConverter(e) {
                    return new oX(this.firestore, e, this._path);
                }
            }
            function oZ(e, t, ...n) {
                if (((e = (0, o.m9)(e)), oq("collection", "path", t), e instanceof oH)) {
                    const r = z.fromString(t, ...n);
                    return o_(r), new oX(e, null, r);
                }
                {
                    if (!(e instanceof oY || e instanceof oX)) throw new S(b.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = e._path.child(z.fromString(t, ...n));
                    return (o_(s), new oX(e.firestore, null, s));
                }
            }
            function o0(e, t) {
                if (((e = oj(e, oH)), oq("collectionGroup", "collection id", t), t.indexOf("/") >= 0)) throw new S(b.INVALID_ARGUMENT, `Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
                return new oJ(e, null, (function(e) {
                    return new eG(z.emptyPath(), e);
                })(t));
            }
            function o1(e, t, ...n) {
                if (((e = getModularInstance(e)), 1 === arguments.length && (t = M.I()), oq("doc", "path", t), e instanceof oH)) {
                    const r = z.fromString(t, ...n);
                    return (oK(r), new oY(e, null, new eo(r)));
                }
                {
                    if (!(e instanceof oY || e instanceof oX)) throw new S(b.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = e._path.child(z.fromString(t, ...n));
                    return (oK(s), new oY(e.firestore, e instanceof oX ? e.converter : null, new eo(s)));
                }
            }
            function o2(e, t) {
                return ((e = getModularInstance(e)), (t = getModularInstance(t)), (e instanceof oY || e instanceof oX) && (t instanceof oY || t instanceof oX) && e.firestore === t.firestore && e.path === t.path && e.converter === t.converter);
            }
            function o4(e, t) {
                return ((e = getModularInstance(e)), (t = getModularInstance(t)), e instanceof oJ && t instanceof oJ && e.firestore === t.firestore && e4(e._query, t._query) && e.converter === t.converter);
            }
            class o3 {
                constructor(){
                    (this._c = Promise.resolve()), (this.mc = []), (this.gc = !1), (this.yc = []), (this.Tc = null), (this.Ec = !1), (this.Ic = !1), (this.Ac = []), (this.ar = new sj(this, "async_queue_retry")), (this.Rc = ()=>{
                        const e = s_();
                        e && g("AsyncQueue", "Visibility state changed to " + e.visibilityState), this.ar.tr();
                    });
                    const e = s_();
                    e && "function" == typeof e.addEventListener && e.addEventListener("visibilitychange", this.Rc);
                }
                get isShuttingDown() {
                    return this.gc;
                }
                enqueueAndForget(e) {
                    this.enqueue(e);
                }
                enqueueAndForgetEvenWhileRestricted(e) {
                    this.bc(), this.Pc(e);
                }
                enterRestrictedMode(e) {
                    if (!this.gc) {
                        (this.gc = !0), (this.Ic = e || !1);
                        const t = s_();
                        t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(e) {
                    if ((this.bc(), this.gc)) return new Promise(()=>{});
                    const t = new N();
                    return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(()=>t.promise);
                }
                enqueueRetryable(e) {
                    this.enqueueAndForget(()=>(this.mc.push(e), this.vc()));
                }
                async vc() {
                    if (0 !== this.mc.length) {
                        try {
                            await this.mc[0](), this.mc.shift(), this.ar.reset();
                        } catch (e) {
                            if (!n9(e)) throw e;
                            g("AsyncQueue", "Operation failed with retryable error: " + e);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(e) {
                    const t = this._c.then(()=>((this.Ec = !0), e().catch((e)=>{
                            (this.Tc = e), (this.Ec = !1);
                            const t = (function(e) {
                                let t = e.message || "";
                                e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack);
                                return t;
                            })(e);
                            throw ((p("INTERNAL UNHANDLED ERROR: ", t), e));
                        }).then((e)=>((this.Ec = !1), e))));
                    return (this._c = t), t;
                }
                enqueueAfterDelay(e, t, n) {
                    this.bc(), this.Ac.indexOf(e) > -1 && (t = 0);
                    const r = iy.createAndSchedule(this, e, t, n, (e)=>this.Vc(e));
                    return this.yc.push(r), r;
                }
                bc() {
                    this.Tc && I();
                }
                verifyOperationInProgress() {}
                async Sc() {
                    let e;
                    do {
                        (e = this._c), await e;
                    }while (e !== this._c)
                }
                Dc(e) {
                    for (const t of this.yc)if (t.timerId === e) return !0;
                    return !1;
                }
                Cc(e) {
                    return this.Sc().then(()=>{
                        this.yc.sort((e, t)=>e.targetTimeMs - t.targetTimeMs);
                        for (const t of this.yc)if ((t.skipDelay(), "all" !== e && t.timerId === e)) break;
                        return this.Sc();
                    });
                }
                Nc(e) {
                    this.Ac.push(e);
                }
                Vc(e) {
                    const t = this.yc.indexOf(e);
                    this.yc.splice(t, 1);
                }
            }
            function o6(e) {
                return (function(e, t) {
                    if ("object" != typeof e || null === e) return !1;
                    const n = e;
                    for (const r of t)if (r in n && "function" == typeof n[r]) return !0;
                    return !1;
                })(e, [
                    "next",
                    "error",
                    "complete"
                ]);
            }
            class o5 {
                constructor(){
                    (this._progressObserver = {}), (this._taskCompletionResolver = new N()), (this._lastProgress = {
                        taskState: "Running",
                        totalBytes: 0,
                        totalDocuments: 0,
                        bytesLoaded: 0,
                        documentsLoaded: 0
                    });
                }
                onProgress(e, t, n) {
                    this._progressObserver = {
                        next: e,
                        error: t,
                        complete: n
                    };
                }
                catch(e) {
                    return this._taskCompletionResolver.promise.catch(e);
                }
                then(e, t) {
                    return this._taskCompletionResolver.promise.then(e, t);
                }
                _completeWith(e) {
                    this._updateProgress(e), this._progressObserver.complete && this._progressObserver.complete(), this._taskCompletionResolver.resolve(e);
                }
                _failWith(e) {
                    (this._lastProgress.taskState = "Error"), this._progressObserver.next && this._progressObserver.next(this._lastProgress), this._progressObserver.error && this._progressObserver.error(e), this._taskCompletionResolver.reject(e);
                }
                _updateProgress(e) {
                    (this._lastProgress = e), this._progressObserver.next && this._progressObserver.next(e);
                }
            }
            const o8 = null && -1;
            class o9 extends oH {
                constructor(e, t){
                    super(e, t), (this.type = "firestore"), (this._queue = new o3()), (this._persistenceKey = "name" in e ? e.name : "[DEFAULT]");
                }
                _terminate() {
                    return (this._firestoreClient || an(this), this._firestoreClient.terminate());
                }
            }
            function o7(e, t) {
                const n = _getProvider(e, "firestore");
                if (n.isInitialized()) {
                    const r = n.getImmediate(), s = n.getOptions();
                    if (deepEqual(s, t)) return r;
                    throw new S(b.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
                }
                if (void 0 !== t.cacheSizeBytes && -1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new S(b.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                return n.initialize({
                    options: t
                });
            }
            function ae(e = getApp()) {
                return _getProvider(e, "firestore").getImmediate();
            }
            function at(e) {
                return (e._firestoreClient || an(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient);
            }
            function an(e) {
                var t;
                const n = e._freezeSettings(), r = (function(e, t, n, r) {
                    return new oP(e, t, n, r.host, r.ssl, r.experimentalForceLongPolling, r.experimentalAutoDetectLongPolling, r.useFetchStreams);
                })(e._databaseId, (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) || "", e._persistenceKey, n);
                e._firestoreClient = new oy(e._credentials, e._queue, r);
            }
            function ar(e, t) {
                af((e = oj(e, o9)));
                const n = at(e), r = e._freezeSettings(), s = new ol();
                return ai(n, s, new ou(s, r.cacheSizeBytes, null == t ? void 0 : t.forceOwnership));
            }
            function as(e) {
                af((e = oj(e, o9)));
                const t = at(e), n = e._freezeSettings(), r = new ol();
                return ai(t, r, new oh(r, n.cacheSizeBytes));
            }
            function ai(e, t, n) {
                const r = new N();
                return e.asyncQueue.enqueue(async ()=>{
                    try {
                        await ow(e, n), await oI(e, t), r.resolve();
                    } catch (s) {
                        if (!((function(e) {
                            if ("FirebaseError" === e.name) return (e.code === b.FAILED_PRECONDITION || e.code === b.UNIMPLEMENTED);
                            if ("undefined" != typeof DOMException && e instanceof DOMException) return (22 === e.code || 20 === e.code || 11 === e.code);
                            return !0;
                        })(s))) throw s;
                        console.warn("Error enabling offline persistence. Falling back to persistence disabled: " + s), r.reject(s);
                    }
                }).then(()=>r.promise);
            }
            function ao(e) {
                if (e._initialized && !e._terminated) throw new S(b.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
                const t = new N();
                return (e._queue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                    try {
                        await (async function(e) {
                            if (!n6.bt()) return Promise.resolve();
                            const t = e + "main";
                            await n6.delete(t);
                        })(r5(e._databaseId, e._persistenceKey)), t.resolve();
                    } catch (n) {
                        t.reject(n);
                    }
                }), t.promise);
            }
            function aa(e) {
                return (function(e) {
                    const t = new N();
                    return (e.asyncQueue.enqueueAndForget(async ()=>iW(await oN(e), t)), t.promise);
                })(at((e = oj(e, o9))));
            }
            function ac(e) {
                return oA(at((e = oj(e, o9))));
            }
            function au(e) {
                return oD(at((e = oj(e, o9))));
            }
            function ah(e) {
                return (_removeServiceInstance(e.app, "firestore"), e._delete());
            }
            function al(e, t) {
                const n = at((e = oj(e, o9))), r = new o5();
                return oF(n, e._databaseId, t, r), r;
            }
            function ad(e, t) {
                return oO(at((e = oj(e, o9))), t).then((t)=>t ? new oJ(e, null, t.query) : null);
            }
            function af(e) {
                if (e._initialized || e._terminated) throw new S(b.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
            }
            class am {
                constructor(...e){
                    for(let t = 0; t < e.length; ++t)if (0 === e[t].length) throw new S(b.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new G(e);
                }
                isEqual(e) {
                    return this._internalPath.isEqual(e._internalPath);
                }
            }
            function ag() {
                return new am("__name__");
            }
            class ap {
                constructor(e){
                    this._byteString = e;
                }
                static fromBase64String(e) {
                    try {
                        return new ap(W.fromBase64String(e));
                    } catch (t) {
                        throw new S(b.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
                    }
                }
                static fromUint8Array(e) {
                    return new ap(W.fromUint8Array(e));
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
                isEqual(e) {
                    return this._byteString.isEqual(e._byteString);
                }
            }
            class ay {
                constructor(e){
                    this._methodName = e;
                }
            }
            class aw {
                constructor(e, t){
                    if (!isFinite(e) || e < -90 || e > 90) throw new S(b.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
                    if (!isFinite(t) || t < -180 || t > 180) throw new S(b.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
                    (this._lat = e), (this._long = t);
                }
                get latitude() {
                    return this._lat;
                }
                get longitude() {
                    return this._long;
                }
                isEqual(e) {
                    return this._lat === e._lat && this._long === e._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(e) {
                    return F(this._lat, e._lat) || F(this._long, e._long);
                }
            }
            const aI = /^__.*__$/;
            class av {
                constructor(e, t, n){
                    (this.data = e), (this.fieldMask = t), (this.fieldTransforms = n);
                }
                toMutation(e, t) {
                    return null !== this.fieldMask ? new t$(e, this.data, this.fieldMask, t, this.fieldTransforms) : new tN(e, this.data, t, this.fieldTransforms);
                }
            }
            class aE {
                constructor(e, t, n){
                    (this.data = e), (this.fieldMask = t), (this.fieldTransforms = n);
                }
                toMutation(e, t) {
                    return new t$(e, this.data, this.fieldMask, t, this.fieldTransforms);
                }
            }
            function aT(e) {
                switch(e){
                    case 0:
                    case 2:
                    case 1:
                        return !0;
                    case 3:
                    case 4:
                        return !1;
                    default:
                        throw I();
                }
            }
            class ab {
                constructor(e, t, n, r, s, i){
                    (this.settings = e), (this.databaseId = t), (this.N = n), (this.ignoreUndefinedProperties = r), void 0 === s && this.xc(), (this.fieldTransforms = s || []), (this.fieldMask = i || []);
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(e) {
                    return new ab(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(e) {
                    var t;
                    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return r.Mc(e), r;
                }
                Lc(e) {
                    var t;
                    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return r.xc(), r;
                }
                Bc(e) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(e) {
                    return a_(e, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(e) {
                    return (void 0 !== this.fieldMask.find((t)=>e.isPrefixOf(t)) || void 0 !== this.fieldTransforms.find((t)=>e.isPrefixOf(t.field)));
                }
                xc() {
                    if (this.path) for(let e = 0; e < this.path.length; e++)this.Mc(this.path.get(e));
                }
                Mc(e) {
                    if (0 === e.length) throw this.Uc("Document fields must not be empty");
                    if (aT(this.kc) && aI.test(e)) throw this.Uc('Document fields cannot begin and end with "__"');
                }
            }
            class aS {
                constructor(e, t, n){
                    (this.databaseId = e), (this.ignoreUndefinedProperties = t), (this.N = n || sz(e));
                }
                jc(e, t, n, r = !1) {
                    return new ab({
                        kc: e,
                        methodName: t,
                        Kc: n,
                        path: G.emptyPath(),
                        Fc: !1,
                        qc: r
                    }, this.databaseId, this.N, this.ignoreUndefinedProperties);
                }
            }
            function aN(e) {
                const t = e._freezeSettings(), n = sz(e._databaseId);
                return new aS(e._databaseId, !!t.ignoreUndefinedProperties, n);
            }
            function a$(e, t, n, r, s, i = {}) {
                const o = e.jc(i.merge || i.mergeFields ? 2 : 0, t, n, s);
                aU("Data must be an object, but it was:", o, r);
                const a = aP(r, o);
                let c, u;
                if (i.merge) (c = new Q(o.fieldMask)), (u = o.fieldTransforms);
                else if (i.mergeFields) {
                    const h = [];
                    for (const l of i.mergeFields){
                        const d = aq(t, l, n);
                        if (!o.contains(d)) throw new S(b.INVALID_ARGUMENT, `Field '${d}' is specified in your field mask but missing from your input data.`);
                        az(h, d) || h.push(d);
                    }
                    (c = new Q(h)), (u = o.fieldTransforms.filter((e)=>c.covers(e.field)));
                } else (c = null), (u = o.fieldTransforms);
                return new av(new eE(a), c, u);
            }
            class aA extends (null && ay) {
                _toFieldTransform(e) {
                    if (2 !== e.kc) throw 1 === e.kc ? e.Uc(`${this._methodName}() can only appear at the top level of your update data`) : e.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return e.fieldMask.push(e.path), null;
                }
                isEqual(e) {
                    return e instanceof aA;
                }
            }
            function aD(e, t, n) {
                return new ab({
                    kc: 3,
                    Kc: t.settings.Kc,
                    methodName: e._methodName,
                    Fc: n
                }, t.databaseId, t.N, t.ignoreUndefinedProperties);
            }
            class ak extends (null && ay) {
                _toFieldTransform(e) {
                    return new tm(e.path, new to());
                }
                isEqual(e) {
                    return e instanceof ak;
                }
            }
            class ax extends (null && ay) {
                constructor(e, t){
                    super(e), (this.Qc = t);
                }
                _toFieldTransform(e) {
                    const t = aD(this, e, !0), n = this.Qc.map((e)=>aO(e, t)), r = new ta(n);
                    return new tm(e.path, r);
                }
                isEqual(e) {
                    return this === e;
                }
            }
            class aC extends (null && ay) {
                constructor(e, t){
                    super(e), (this.Qc = t);
                }
                _toFieldTransform(e) {
                    const t = aD(this, e, !0), n = this.Qc.map((e)=>aO(e, t)), r = new tu(n);
                    return new tm(e.path, r);
                }
                isEqual(e) {
                    return this === e;
                }
            }
            class aL extends (null && ay) {
                constructor(e, t){
                    super(e), (this.Wc = t);
                }
                _toFieldTransform(e) {
                    const t = new tl(e.N, tt(e.N, this.Wc));
                    return new tm(e.path, t);
                }
                isEqual(e) {
                    return this === e;
                }
            }
            function aR(e, t, n, r) {
                const s = e.jc(1, t, n);
                aU("Data must be an object, but it was:", s, r);
                const i = [], o = eE.empty();
                B(r, (e, r)=>{
                    const a = aK(t, e, n);
                    r = getModularInstance(r);
                    const c = s.Lc(a);
                    if (r instanceof aA) i.push(a);
                    else {
                        const u = aO(r, c);
                        null != u && (i.push(a), o.set(a, u));
                    }
                });
                const a = new Q(i);
                return new aE(o, a, s.fieldTransforms);
            }
            function aM(e, t, n, r, s, i) {
                const o = e.jc(1, t, n), a = [
                    aq(t, r, n)
                ], c = [
                    s
                ];
                if (i.length % 2 != 0) throw new S(b.INVALID_ARGUMENT, `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);
                for(let u = 0; u < i.length; u += 2)a.push(aq(t, i[u])), c.push(i[u + 1]);
                const h = [], l = eE.empty();
                for(let d = a.length - 1; d >= 0; --d)if (!az(h, a[d])) {
                    const f = a[d];
                    let m = c[d];
                    m = getModularInstance(m);
                    const g = o.Lc(f);
                    if (m instanceof aA) h.push(f);
                    else {
                        const p = aO(m, g);
                        null != p && (h.push(f), l.set(f, p));
                    }
                }
                const y = new Q(h);
                return new aE(l, y, o.fieldTransforms);
            }
            function aF(e, t, n, r = !1) {
                return aO(n, e.jc(r ? 4 : 3, t));
            }
            function aO(e, t) {
                if (aV((e = getModularInstance(e)))) return aU("Unsupported field value:", t, e), aP(e, t);
                if (e instanceof ay) return ((function(e, t) {
                    if (!aT(t.kc)) throw t.Uc(`${e._methodName}() can only be used with update() and set()`);
                    if (!t.path) throw t.Uc(`${e._methodName}() is not currently supported inside arrays`);
                    const n = e._toFieldTransform(t);
                    n && t.fieldTransforms.push(n);
                })(e, t), null);
                if (void 0 === e && t.ignoreUndefinedProperties) return null;
                if ((t.path && t.fieldMask.push(t.path), e instanceof Array)) {
                    if (t.settings.Fc && 4 !== t.kc) throw t.Uc("Nested arrays are not supported");
                    return (function(e, t) {
                        const n = [];
                        let r = 0;
                        for (const s of e){
                            let i = aO(s, t.Bc(r));
                            null == i && (i = {
                                nullValue: "NULL_VALUE"
                            }), n.push(i), r++;
                        }
                        return {
                            arrayValue: {
                                values: n
                            }
                        };
                    })(e, t);
                }
                return (function(e, t) {
                    if (null === (e = getModularInstance(e))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof e) return tt(t.N, e);
                    if ("boolean" == typeof e) return {
                        booleanValue: e
                    };
                    if ("string" == typeof e) return {
                        stringValue: e
                    };
                    if (e instanceof Date) {
                        const n = V.fromDate(e);
                        return {
                            timestampValue: ne(t.N, n)
                        };
                    }
                    if (e instanceof V) {
                        const r = new V(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
                        return {
                            timestampValue: ne(t.N, r)
                        };
                    }
                    if (e instanceof aw) return {
                        geoPointValue: {
                            latitude: e.latitude,
                            longitude: e.longitude
                        }
                    };
                    if (e instanceof ap) return {
                        bytesValue: nt(t.N, e._byteString)
                    };
                    if (e instanceof oY) {
                        const s = t.databaseId, i = e.firestore._databaseId;
                        if (!i.isEqual(s)) throw t.Uc(`Document reference is for database ${i.projectId}/${i.database} but should be for database ${s.projectId}/${s.database}`);
                        return {
                            referenceValue: ns(e.firestore._databaseId || t.databaseId, e._key.path)
                        };
                    }
                    throw t.Uc(`Unsupported field value: ${oz(e)}`);
                })(e, t);
            }
            function aP(e, t) {
                const n = {};
                return (K(e) ? t.path && t.path.length > 0 && t.fieldMask.push(t.path) : B(e, (e, r)=>{
                    const s = aO(r, t.Oc(e));
                    null != s && (n[e] = s);
                }), {
                    mapValue: {
                        fields: n
                    }
                });
            }
            function aV(e) {
                return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof V || e instanceof aw || e instanceof ap || e instanceof oY || e instanceof ay);
            }
            function aU(e, t, n) {
                if (!aV(n) || !(function(e) {
                    return ("object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e)));
                })(n)) {
                    const r = oz(n);
                    throw "an object" === r ? t.Uc(e + " a custom object") : t.Uc(e + " " + r);
                }
            }
            function aq(e, t, n) {
                if ((t = getModularInstance(t)) instanceof am) return t._internalPath;
                if ("string" == typeof t) return aK(e, t);
                throw a_("Field path arguments must be of type string or FieldPath.", e, !1, void 0, n);
            }
            const aB = new RegExp("[~\\*/\\[\\]]");
            function aK(e, t, n) {
                if (t.search(aB) >= 0) throw a_(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, !1, void 0, n);
                try {
                    return new am(...t.split("."))._internalPath;
                } catch (r) {
                    throw a_(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, !1, void 0, n);
                }
            }
            function a_(e, t, n, r, s) {
                const i = r && !r.isEmpty(), o = void 0 !== s;
                let a = `Function ${t}() called with invalid data`;
                n && (a += " (via `toFirestore()`)"), (a += ". ");
                let c = "";
                return ((i || o) && ((c += " (found"), i && (c += ` in field ${r}`), o && (c += ` in document ${s}`), (c += ")")), new S(b.INVALID_ARGUMENT, a + e + c));
            }
            function az(e, t) {
                return e.some((e)=>e.isEqual(t));
            }
            class aj {
                constructor(e, t, n, r, s){
                    (this._firestore = e), (this._userDataWriter = t), (this._key = n), (this._document = r), (this._converter = s);
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get ref() {
                    return new oY(this._firestore, this._converter, this._key);
                }
                exists() {
                    return null !== this._document;
                }
                data() {
                    if (this._document) {
                        if (this._converter) {
                            const e = new aG(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(e);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(e) {
                    if (this._document) {
                        const t = this._document.data.field(aQ("DocumentSnapshot.get", e));
                        if (null !== t) return this._userDataWriter.convertValue(t);
                    }
                }
            }
            class aG extends aj {
                data() {
                    return super.data();
                }
            }
            function aQ(e, t) {
                return "string" == typeof t ? aK(e, t) : t instanceof am ? t._internalPath : t._delegate._internalPath;
            }
            class aH {
                constructor(e, t){
                    (this.hasPendingWrites = e), (this.fromCache = t);
                }
                isEqual(e) {
                    return (this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache);
                }
            }
            class aW extends aj {
                constructor(e, t, n, r, s, i){
                    super(e, t, n, r, i), (this._firestore = e), (this._firestoreImpl = e), (this.metadata = s);
                }
                exists() {
                    return super.exists();
                }
                data(e = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const t = new aY(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(t, e);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
                    }
                }
                get(e, t = {}) {
                    if (this._document) {
                        const n = this._document.data.field(aQ("DocumentSnapshot.get", e));
                        if (null !== n) return this._userDataWriter.convertValue(n, t.serverTimestamps);
                    }
                }
            }
            class aY extends aW {
                data(e = {}) {
                    return super.data(e);
                }
            }
            class aJ {
                constructor(e, t, n, r){
                    (this._firestore = e), (this._userDataWriter = t), (this._snapshot = r), (this.metadata = new aH(r.hasPendingWrites, r.fromCache)), (this.query = n);
                }
                get docs() {
                    const e = [];
                    return this.forEach((t)=>e.push(t)), e;
                }
                get size() {
                    return this._snapshot.docs.size;
                }
                get empty() {
                    return 0 === this.size;
                }
                forEach(e, t) {
                    this._snapshot.docs.forEach((n)=>{
                        e.call(t, new aY(this._firestore, this._userDataWriter, n.key, n, new aH(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(e = {}) {
                    const t = !!e.includeMetadataChanges;
                    if (t && this._snapshot.excludesMetadataChanges) throw new S(b.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return ((this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t) || ((this._cachedChanges = (function(e, t) {
                        if (e._snapshot.oldDocs.isEmpty()) {
                            let n = 0;
                            return e._snapshot.docChanges.map((t)=>({
                                    type: "added",
                                    doc: new aY(e._firestore, e._userDataWriter, t.doc.key, t.doc, new aH(e._snapshot.mutatedKeys.has(t.doc.key), e._snapshot.fromCache), e.query.converter),
                                    oldIndex: -1,
                                    newIndex: n++
                                }));
                        }
                        {
                            let r = e._snapshot.oldDocs;
                            return e._snapshot.docChanges.filter((e)=>t || 3 !== e.type).map((t)=>{
                                const n = new aY(e._firestore, e._userDataWriter, t.doc.key, t.doc, new aH(e._snapshot.mutatedKeys.has(t.doc.key), e._snapshot.fromCache), e.query.converter);
                                let s = -1, i = -1;
                                return (0 !== t.type && ((s = r.indexOf(t.doc.key)), (r = r.delete(t.doc.key))), 1 !== t.type && ((r = r.add(t.doc)), (i = r.indexOf(t.doc.key))), {
                                    type: aX(t.type),
                                    doc: n,
                                    oldIndex: s,
                                    newIndex: i
                                });
                            });
                        }
                    })(this, t)), (this._cachedChangesIncludeMetadataChanges = t)), this._cachedChanges);
                }
            }
            function aX(e) {
                switch(e){
                    case 0:
                        return "added";
                    case 2:
                    case 3:
                        return "modified";
                    case 1:
                        return "removed";
                    default:
                        return I();
                }
            }
            function aZ(e, t) {
                return e instanceof aW && t instanceof aW ? e._firestore === t._firestore && e._key.isEqual(t._key) && (null === e._document ? null === t._document : e._document.isEqual(t._document)) && e._converter === t._converter : e instanceof aJ && t instanceof aJ && e._firestore === t._firestore && o4(e.query, t.query) && e.metadata.isEqual(t.metadata) && e._snapshot.isEqual(t._snapshot);
            }
            function a0(e) {
                if (eY(e) && 0 === e.explicitOrderBy.length) throw new S(b.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
            }
            class a1 {
            }
            function a2(e, ...t) {
                for (const n of t)e = n._apply(e);
                return e;
            }
            class a4 extends (null && a1) {
                constructor(e, t, n){
                    super(), (this.Gc = e), (this.zc = t), (this.Hc = n), (this.type = "where");
                }
                _apply(e) {
                    const t = aN(e.firestore), n = (function(e, t, n, r, s, i, o) {
                        let a;
                        if (s.isKeyField()) {
                            if ("array-contains" === i || "array-contains-any" === i) throw new S(b.INVALID_ARGUMENT, `Invalid Query. You can't perform '${i}' queries on FieldPath.documentId().`);
                            if ("in" === i || "not-in" === i) {
                                cc(o, i);
                                const c = [];
                                for (const u of o)c.push(ca(r, e, u));
                                a = {
                                    arrayValue: {
                                        values: c
                                    }
                                };
                            } else a = ca(r, e, o);
                        } else ("in" !== i && "not-in" !== i && "array-contains-any" !== i) || cc(o, i), (a = aF(n, t, o, "in" === i || "not-in" === i));
                        const h = ex.create(s, i, a);
                        return ((function(e, t) {
                            if (t.v()) {
                                const n = eX(e);
                                if (null !== n && !n.isEqual(t.field)) throw new S(b.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${n.toString()}' and '${t.field.toString()}'`);
                                const r = eJ(e);
                                null !== r && cu(e, t.field, r);
                            }
                            const s = (function(e, t) {
                                for (const n of e.filters)if (t.indexOf(n.op) >= 0) return n.op;
                                return null;
                            })(e, (function(e) {
                                switch(e){
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
                            })(t.op));
                            if (null !== s) throw s === t.op ? new S(b.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new S(b.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${s.toString()}' filters.`);
                        })(e, h), h);
                    })(e._query, "where", t, e.firestore._databaseId, this.Gc, this.zc, this.Hc);
                    return new oJ(e.firestore, e.converter, (function(e, t) {
                        const n = e.filters.concat([
                            t
                        ]);
                        return new eG(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
                    })(e._query, n));
                }
            }
            function a3(e, t, n) {
                const r = t, s = aQ("where", e);
                return new a4(s, r, n);
            }
            class a6 extends (null && a1) {
                constructor(e, t){
                    super(), (this.Gc = e), (this.Jc = t), (this.type = "orderBy");
                }
                _apply(e) {
                    const t = (function(e, t, n) {
                        if (null !== e.startAt) throw new S(b.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
                        if (null !== e.endAt) throw new S(b.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
                        const r = new eK(t, n);
                        return ((function(e, t) {
                            if (null === eJ(e)) {
                                const n = eX(e);
                                null !== n && cu(e, n, t.field);
                            }
                        })(e, r), r);
                    })(e._query, this.Gc, this.Jc);
                    return new oJ(e.firestore, e.converter, (function(e, t) {
                        const n = e.explicitOrderBy.concat([
                            t
                        ]);
                        return new eG(e.path, e.collectionGroup, n, e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
                    })(e._query, t));
                }
            }
            function a5(e, t = "asc") {
                const n = t, r = aQ("orderBy", e);
                return new a6(r, n);
            }
            class a8 extends (null && a1) {
                constructor(e, t, n){
                    super(), (this.type = e), (this.Yc = t), (this.Xc = n);
                }
                _apply(e) {
                    return new oJ(e.firestore, e.converter, e2(e._query, this.Yc, this.Xc));
                }
            }
            function a9(e) {
                return oG("limit", e), new a8("limit", e, "F");
            }
            function a7(e) {
                return (oG("limitToLast", e), new a8("limitToLast", e, "L"));
            }
            class ce extends (null && a1) {
                constructor(e, t, n){
                    super(), (this.type = e), (this.Zc = t), (this.ta = n);
                }
                _apply(e) {
                    const t = co(e, this.type, this.Zc, this.ta);
                    return new oJ(e.firestore, e.converter, (function(e, t) {
                        return new eG(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, t, e.endAt);
                    })(e._query, t));
                }
            }
            function ct(...e) {
                return new ce("startAt", e, !0);
            }
            function cn(...e) {
                return new ce("startAfter", e, !1);
            }
            class cr extends (null && a1) {
                constructor(e, t, n){
                    super(), (this.type = e), (this.Zc = t), (this.ta = n);
                }
                _apply(e) {
                    const t = co(e, this.type, this.Zc, this.ta);
                    return new oJ(e.firestore, e.converter, (function(e, t) {
                        return new eG(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, t);
                    })(e._query, t));
                }
            }
            function cs(...e) {
                return new cr("endBefore", e, !0);
            }
            function ci(...e) {
                return new cr("endAt", e, !1);
            }
            function co(e, t, n, r) {
                if (((n[0] = getModularInstance(n[0])), n[0] instanceof aj)) return (function(e, t, n, r, s) {
                    if (!r) throw new S(b.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n}().`);
                    const i = [];
                    for (const o of e0(e))if (o.field.isKeyField()) i.push(em(t, r.key));
                    else {
                        const a = r.data.field(o.field);
                        if (ee(a)) throw new S(b.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + o.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
                        if (null === a) {
                            const c = o.field.canonicalString();
                            throw new S(b.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${c}' (used as the orderBy) does not exist.`);
                        }
                        i.push(a);
                    }
                    return new eq(i, s);
                })(e._query, e.firestore._databaseId, t, n[0]._document, r);
                {
                    const s = aN(e.firestore);
                    return (function(e, t, n, r, s, i) {
                        const o = e.explicitOrderBy;
                        if (s.length > o.length) throw new S(b.INVALID_ARGUMENT, `Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
                        const a = [];
                        for(let c = 0; c < s.length; c++){
                            const u = s[c];
                            if (o[c].field.isKeyField()) {
                                if ("string" != typeof u) throw new S(b.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof u}`);
                                if (!eZ(e) && -1 !== u.indexOf("/")) throw new S(b.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to ${r}() must be a plain document ID, but '${u}' contains a slash.`);
                                const h = e.path.child(z.fromString(u));
                                if (!eo.isDocumentKey(h)) throw new S(b.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to ${r}() must result in a valid document path, but '${h}' is not because it contains an odd number of segments.`);
                                const l = new eo(h);
                                a.push(em(t, l));
                            } else {
                                const d = aF(n, r, u);
                                a.push(d);
                            }
                        }
                        return new eq(a, i);
                    })(e._query, e.firestore._databaseId, s, t, n, r);
                }
            }
            function ca(e, t, n) {
                if ("string" == typeof (n = getModularInstance(n))) {
                    if ("" === n) throw new S(b.INVALID_ARGUMENT, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");
                    if (!eZ(t) && -1 !== n.indexOf("/")) throw new S(b.INVALID_ARGUMENT, `Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
                    const r = t.path.child(z.fromString(n));
                    if (!eo.isDocumentKey(r)) throw new S(b.INVALID_ARGUMENT, `Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
                    return em(e, new eo(r));
                }
                if (n instanceof oY) return em(e, n._key);
                throw new S(b.INVALID_ARGUMENT, `Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: ${oz(n)}.`);
            }
            function cc(e, t) {
                if (!Array.isArray(e) || 0 === e.length) throw new S(b.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
                if (e.length > 10) throw new S(b.INVALID_ARGUMENT, `Invalid Query. '${t.toString()}' filters support a maximum of 10 elements in the value array.`);
            }
            function cu(e, t, n) {
                if (!n.isEqual(t)) throw new S(b.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${t.toString()}' and so you must also use '${t.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`);
            }
            class ch {
                convertValue(e, t = "none") {
                    switch(ea(e)){
                        case 0:
                            return null;
                        case 1:
                            return e.booleanValue;
                        case 2:
                            return X(e.integerValue || e.doubleValue);
                        case 3:
                            return this.convertTimestamp(e.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(e, t);
                        case 5:
                            return e.stringValue;
                        case 6:
                            return this.convertBytes(Z(e.bytesValue));
                        case 7:
                            return this.convertReference(e.referenceValue);
                        case 8:
                            return this.convertGeoPoint(e.geoPointValue);
                        case 9:
                            return this.convertArray(e.arrayValue, t);
                        case 10:
                            return this.convertObject(e.mapValue, t);
                        default:
                            throw I();
                    }
                }
                convertObject(e, t) {
                    const n = {};
                    return (B(e.fields, (e, r)=>{
                        n[e] = this.convertValue(r, t);
                    }), n);
                }
                convertGeoPoint(e) {
                    return new aw(X(e.latitude), X(e.longitude));
                }
                convertArray(e, t) {
                    return (e.values || []).map((e)=>this.convertValue(e, t));
                }
                convertServerTimestamp(e, t) {
                    switch(t){
                        case "previous":
                            const n = et(e);
                            return null == n ? null : this.convertValue(n, t);
                        case "estimate":
                            return this.convertTimestamp(en(e));
                        default:
                            return null;
                    }
                }
                convertTimestamp(e) {
                    const t = J(e);
                    return new V(t.seconds, t.nanos);
                }
                convertDocumentKey(e, t) {
                    const n = z.fromString(e);
                    v(nR(n));
                    const r = new oV(n.get(1), n.get(3)), s = new eo(n.popFirst(5));
                    return (r.isEqual(t) || p(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), s);
                }
            }
            function cl(e, t, n) {
                let r;
                return ((r = e ? n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t) : t), r);
            }
            class cd extends (null && ch) {
                constructor(e){
                    super(), (this.firestore = e);
                }
                convertBytes(e) {
                    return new ap(e);
                }
                convertReference(e) {
                    const t = this.convertDocumentKey(e, this.firestore._databaseId);
                    return new oY(this.firestore, null, t);
                }
            }
            class cf {
                constructor(e, t){
                    (this._firestore = e), (this._commitHandler = t), (this._mutations = []), (this._committed = !1), (this._dataReader = aN(e));
                }
                set(e, t, n) {
                    this._verifyNotCommitted();
                    const r = cm(e, this._firestore), s = cl(r.converter, t, n), i = a$(this._dataReader, "WriteBatch.set", r._key, s, null !== r.converter, n);
                    return (this._mutations.push(i.toMutation(r._key, ty.none())), this);
                }
                update(e, t, n, ...r) {
                    this._verifyNotCommitted();
                    const s = cm(e, this._firestore);
                    let i;
                    return ((i = "string" == typeof (t = getModularInstance(t)) || t instanceof am ? aM(this._dataReader, "WriteBatch.update", s._key, t, n, r) : aR(this._dataReader, "WriteBatch.update", s._key, t)), this._mutations.push(i.toMutation(s._key, ty.exists(!0))), this);
                }
                delete(e) {
                    this._verifyNotCommitted();
                    const t = cm(e, this._firestore);
                    return ((this._mutations = this._mutations.concat(new tx(t._key, ty.none()))), this);
                }
                commit() {
                    return (this._verifyNotCommitted(), (this._committed = !0), this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve());
                }
                _verifyNotCommitted() {
                    if (this._committed) throw new S(b.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
                }
            }
            function cm(e, t) {
                if ((e = getModularInstance(e)).firestore !== t) throw new S(b.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
                return e;
            }
            function cg(e) {
                e = oj(e, oY);
                const t = oj(e.firestore, o9);
                return ox(at(t), e._key).then((n)=>ck(t, e, n));
            }
            class cp extends ch {
                constructor(e){
                    super(), (this.firestore = e);
                }
                convertBytes(e) {
                    return new ap(e);
                }
                convertReference(e) {
                    const t = this.convertDocumentKey(e, this.firestore._databaseId);
                    return new oY(this.firestore, null, t);
                }
            }
            function cy(e) {
                e = oj(e, oY);
                const t = oj(e.firestore, o9), n = at(t), r = new cp(t);
                return ok(n, e._key).then((n)=>new aW(t, r, e._key, n, new aH(null !== n && n.hasLocalMutations, !0), e.converter));
            }
            function cw(e) {
                e = oj(e, oY);
                const t = oj(e.firestore, o9);
                return ox(at(t), e._key, {
                    source: "server"
                }).then((n)=>ck(t, e, n));
            }
            function cI(e) {
                e = oj(e, oJ);
                const t = oj(e.firestore, o9), n = at(t), r = new cp(t);
                return (a0(e._query), oL(n, e._query).then((n)=>new aJ(t, r, e, n)));
            }
            function cv(e) {
                e = oj(e, oJ);
                const t = oj(e.firestore, o9), n = at(t), r = new cp(t);
                return oC(n, e._query).then((n)=>new aJ(t, r, e, n));
            }
            function cE(e) {
                e = oj(e, oJ);
                const t = oj(e.firestore, o9), n = at(t), r = new cp(t);
                return oL(n, e._query, {
                    source: "server"
                }).then((n)=>new aJ(t, r, e, n));
            }
            function cT(e, t, n) {
                e = oj(e, oY);
                const r = oj(e.firestore, o9), s = cl(e.converter, t, n);
                return cD(r, [
                    a$(aN(r), "setDoc", e._key, s, null !== e.converter, n).toMutation(e._key, ty.none()), 
                ]);
            }
            function cb(e, t, n, ...r) {
                e = oj(e, oY);
                const s = oj(e.firestore, o9), i = aN(s);
                let o;
                o = "string" == typeof ((t = getModularInstance(t))) || t instanceof am ? aM(i, "updateDoc", e._key, t, n, r) : aR(i, "updateDoc", e._key, t);
                return cD(s, [
                    o.toMutation(e._key, ty.exists(!0))
                ]);
            }
            function cS(e) {
                return cD(oj(e.firestore, o9), [
                    new tx(e._key, ty.none())
                ]);
            }
            function cN(e, t) {
                const n = oj(e.firestore, o9), r = o1(e), s = cl(e.converter, t);
                return cD(n, [
                    a$(aN(e.firestore), "addDoc", r._key, s, null !== e.converter, {}).toMutation(r._key, ty.exists(!1)), 
                ]).then(()=>r);
            }
            function c$(e, ...t) {
                var n, r, s;
                e = getModularInstance(e);
                let i = {
                    includeMetadataChanges: !1
                }, o = 0;
                "object" != typeof t[o] || o6(t[o]) || ((i = t[o]), o++);
                const a = {
                    includeMetadataChanges: i.includeMetadataChanges
                };
                if (o6(t[o])) {
                    const c = t[o];
                    (t[o] = null === (n = c.next) || void 0 === n ? void 0 : n.bind(c)), (t[o + 1] = null === (r = c.error) || void 0 === r ? void 0 : r.bind(c)), (t[o + 2] = null === (s = c.complete) || void 0 === s ? void 0 : s.bind(c));
                }
                let u, h, l;
                if (e instanceof oY) (h = oj(e.firestore, o9)), (l = eH(e._key.path)), (u = {
                    next: (n)=>{
                        t[o] && t[o](ck(h, e, n));
                    },
                    error: t[o + 1],
                    complete: t[o + 2]
                });
                else {
                    const d = oj(e, oJ);
                    (h = oj(d.firestore, o9)), (l = d._query);
                    const f = new cp(h);
                    (u = {
                        next: (e)=>{
                            t[o] && t[o](new aJ(h, f, d, e));
                        },
                        error: t[o + 1],
                        complete: t[o + 2]
                    }), a0(e._query);
                }
                return (function(e, t, n, r) {
                    const s = new of(r), i = new ik(t, s, n);
                    return (e.asyncQueue.enqueueAndForget(async ()=>iS(await o$(e), i)), ()=>{
                        s.ec(), e.asyncQueue.enqueueAndForget(async ()=>iN(await o$(e), i));
                    });
                })(at(h), l, a, u);
            }
            function cA(e, t) {
                return oR(at((e = oj(e, o9))), o6(t) ? t : {
                    next: t
                });
            }
            function cD(e, t) {
                return (function(e, t) {
                    const n = new N();
                    return (e.asyncQueue.enqueueAndForget(async ()=>i_(await oN(e), t, n)), n.promise);
                })(at(e), t);
            }
            function ck(e, t, n) {
                const r = n.docs.get(t._key), s = new cp(e);
                return new aW(e, s, t._key, r, new aH(n.hasPendingWrites, n.fromCache), t.converter);
            }
            class cx extends (null && class {
                constructor(e, t){
                    (this._firestore = e), (this._transaction = t), (this._dataReader = aN(e));
                }
                get(e) {
                    const t = cm(e, this._firestore), n = new cd(this._firestore);
                    return this._transaction.lookup([
                        t._key
                    ]).then((e)=>{
                        if (!e || 1 !== e.length) return I();
                        const r = e[0];
                        if (r.isFoundDocument()) return new aj(this._firestore, n, r.key, r, t.converter);
                        if (r.isNoDocument()) return new aj(this._firestore, n, t._key, null, t.converter);
                        throw I();
                    });
                }
                set(e, t, n) {
                    const r = cm(e, this._firestore), s = cl(r.converter, t, n), i = a$(this._dataReader, "Transaction.set", r._key, s, null !== r.converter, n);
                    return this._transaction.set(r._key, i), this;
                }
                update(e, t, n, ...r) {
                    const s = cm(e, this._firestore);
                    let i;
                    return ((i = "string" == typeof (t = getModularInstance(t)) || t instanceof am ? aM(this._dataReader, "Transaction.update", s._key, t, n, r) : aR(this._dataReader, "Transaction.update", s._key, t)), this._transaction.update(s._key, i), this);
                }
                delete(e) {
                    const t = cm(e, this._firestore);
                    return this._transaction.delete(t._key), this;
                }
            }) {
                constructor(e, t){
                    super(e, t), (this._firestore = e);
                }
                get(e) {
                    const t = cm(e, this._firestore), n = new cp(this._firestore);
                    return super.get(e).then((e)=>new aW(this._firestore, n, t._key, e._document, new aH(!1, !1), t.converter));
                }
            }
            function cC(e, t) {
                return oM(at((e = oj(e, o9))), (n)=>t(new cx(e, n)));
            }
            function cL() {
                return new aA("deleteField");
            }
            function cR() {
                return new ak("serverTimestamp");
            }
            function cM(...e) {
                return new ax("arrayUnion", e);
            }
            function cF(...e) {
                return new aC("arrayRemove", e);
            }
            function cO(e) {
                return new aL("increment", e);
            }
            function cP(e) {
                return at((e = oj(e, o9))), new cf(e, (t)=>cD(e, t));
            }
            !(function(e, t = !0) {
                !(function(e) {
                    l = e;
                })(r.Jn), (0, r.Xd)(new s.wA("firestore", (e, { options: n  })=>{
                    const r = e.getProvider("app").getImmediate(), s = new o9(r, new k(e.getProvider("auth-internal")));
                    return ((n = Object.assign({
                        useFetchStreams: t
                    }, n)), s._setSettings(n), s);
                }, "PUBLIC")), (0, r.KN)(u, "3.3.0", e), (0, r.KN)(u, "3.3.0", "esm2017");
            })();
        }
    }, 
]);
