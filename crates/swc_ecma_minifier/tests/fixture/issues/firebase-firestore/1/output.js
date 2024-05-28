"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        16
    ],
    {
        19: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                hJ: function() {
                    return ba;
                },
                PL: function() {
                    return lh;
                }
            });
            var hn, ln, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2238), _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8463), _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3333), _firebase_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4444), _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3510);
            __webpack_require__(4155);
            const S = "@firebase/firestore";
            class D {
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
            D.UNAUTHENTICATED = new D(null), D.GOOGLE_CREDENTIALS = new D("google-credentials-uid"), D.FIRST_PARTY = new D("first-party-uid"), D.MOCK_USER = new D("mock-user");
            let C = "9.4.0";
            const N = new _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.Yd("@firebase/firestore");
            function x() {
                return N.logLevel;
            }
            function $(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG) {
                    const n = e.map(M);
                    N.debug(`Firestore (${C}): ${t}`, ...n);
                }
            }
            function O(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.ERROR) {
                    const n = e.map(M);
                    N.error(`Firestore (${C}): ${t}`, ...n);
                }
            }
            function F(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.WARN) {
                    const n = e.map(M);
                    N.warn(`Firestore (${C}): ${t}`, ...n);
                }
            }
            function M(t) {
                if ("string" == typeof t) return t;
                try {
                    return JSON.stringify(t);
                } catch (e) {
                    return t;
                }
            }
            function L(t = "Unexpected state") {
                const e = `FIRESTORE (${C}) INTERNAL ASSERTION FAILED: ` + t;
                throw O(e), Error(e);
            }
            const K = {
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
            class j extends Error {
                constructor(t, e){
                    super(e), this.code = t, this.message = e, this.name = "FirebaseError", this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`;
                }
            }
            class Q {
                constructor(){
                    this.promise = new Promise((t, e)=>{
                        this.resolve = t, this.reject = e;
                    });
                }
            }
            class W {
                constructor(t, e){
                    this.user = e, this.type = "OAuth", this.authHeaders = {}, this.authHeaders.Authorization = `Bearer ${t}`;
                }
            }
            class G {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(t, e) {
                    t.enqueueRetryable(()=>e(D.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class H {
                constructor(t){
                    this.t = t, this.currentUser = D.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t, e) {
                    let n = this.i;
                    const s = (t)=>this.i !== n ? (n = this.i, e(t)) : Promise.resolve();
                    let i = new Q();
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q(), t.enqueueRetryable(()=>s(this.currentUser));
                    };
                    const r = ()=>{
                        const e = i;
                        t.enqueueRetryable(async ()=>{
                            await e.promise, await s(this.currentUser);
                        });
                    }, o = (t)=>{
                        $("FirebaseCredentialsProvider", "Auth detected"), this.auth = t, this.auth.addAuthTokenListener(this.o), r();
                    };
                    this.t.onInit((t)=>o(t)), setTimeout(()=>{
                        if (!this.auth) {
                            const t = this.t.getImmediate({
                                optional: !0
                            });
                            t ? o(t) : ($("FirebaseCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Q());
                        }
                    }, 0), r();
                }
                getToken() {
                    const t = this.i, e = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e).then((e)=>this.i !== t ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? ("string" == typeof e.accessToken || L(), new W(e.accessToken, this.currentUser)) : null) : Promise.resolve(null);
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const t = this.auth && this.auth.getUid();
                    return null === t || "string" == typeof t || L(), new D(t);
                }
            }
            class J {
                constructor(t, e, n){
                    this.h = t, this.l = e, this.m = n, this.type = "FirstParty", this.user = D.FIRST_PARTY;
                }
                get authHeaders() {
                    const t = {
                        "X-Goog-AuthUser": this.l
                    }, e = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return e && (t.Authorization = e), this.m && (t["X-Goog-Iam-Authorization-Token"] = this.m), t;
                }
            }
            class Y {
                constructor(t, e, n){
                    this.h = t, this.l = e, this.m = n;
                }
                getToken() {
                    return Promise.resolve(new J(this.h, this.l, this.m));
                }
                start(t, e) {
                    t.enqueueRetryable(()=>e(D.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class X {
                constructor(t, e){
                    this.previousValue = t, e && (e.sequenceNumberHandler = (t)=>this.g(t), this.p = (t)=>e.writeSequenceNumber(t));
                }
                g(t) {
                    return this.previousValue = Math.max(t, this.previousValue), this.previousValue;
                }
                next() {
                    const t = ++this.previousValue;
                    return this.p && this.p(t), t;
                }
            }
            X.T = -1;
            class tt {
                static I() {
                    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
                    let n = "";
                    for(; n.length < 20;){
                        const s = function(t) {
                            const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(40);
                            if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                            else for(let e = 0; e < 40; e++)n[e] = Math.floor(256 * Math.random());
                            return n;
                        }(0);
                        for(let i = 0; i < s.length; ++i)n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
                    }
                    return n;
                }
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function nt(t, e, n) {
                return t.length === e.length && t.every((t, s)=>n(t, e[s]));
            }
            class it {
                constructor(t, e){
                    if (this.seconds = t, this.nanoseconds = e, e < 0 || e >= 1e9) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (t < -62135596800 || t >= 253402300800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                }
                static now() {
                    return it.fromMillis(Date.now());
                }
                static fromDate(t) {
                    return it.fromMillis(t.getTime());
                }
                static fromMillis(t) {
                    const e = Math.floor(t / 1e3), n = Math.floor(1e6 * (t - 1e3 * e));
                    return new it(e, n);
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(t) {
                    return this.seconds === t.seconds ? et(this.nanoseconds, t.nanoseconds) : et(this.seconds, t.seconds);
                }
                isEqual(t) {
                    return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
                }
                toString() {
                    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
                }
                toJSON() {
                    return {
                        seconds: this.seconds,
                        nanoseconds: this.nanoseconds
                    };
                }
                valueOf() {
                    return String(this.seconds - -62135596800).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
                }
            }
            class rt {
                constructor(t){
                    this.timestamp = t;
                }
                static fromTimestamp(t) {
                    return new rt(t);
                }
                static min() {
                    return new rt(new it(0, 0));
                }
                compareTo(t) {
                    return this.timestamp._compareTo(t.timestamp);
                }
                isEqual(t) {
                    return this.timestamp.isEqual(t.timestamp);
                }
                toMicroseconds() {
                    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
                }
                toString() {
                    return "SnapshotVersion(" + this.timestamp.toString() + ")";
                }
                toTimestamp() {
                    return this.timestamp;
                }
            }
            function ot(t) {
                let e = 0;
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e++;
                return e;
            }
            function ct(t, e) {
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
            }
            class ut {
                constructor(t, e, n){
                    void 0 === e ? e = 0 : e > t.length && L(), void 0 === n ? n = t.length - e : n > t.length - e && L(), this.segments = t, this.offset = e, this.len = n;
                }
                get length() {
                    return this.len;
                }
                isEqual(t) {
                    return 0 === ut.comparator(this, t);
                }
                child(t) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t instanceof ut ? t.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t), this.construct(e);
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(t) {
                    return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
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
                        const n = t.get(s), i = e.get(s);
                        if (n < i) return -1;
                        if (n > i) return 1;
                    }
                    return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
                }
            }
            class ht extends ut {
                construct(t, e, n) {
                    return new ht(t, e, n);
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
                        if (n.indexOf("//") >= 0) throw new j(K.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
                        e.push(...n.split("/").filter((t)=>t.length > 0));
                    }
                    return new ht(e);
                }
                static emptyPath() {
                    return new ht([]);
                }
            }
            const lt = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class ft extends ut {
                construct(t, e, n) {
                    return new ft(t, e, n);
                }
                static isValidIdentifier(t) {
                    return lt.test(t);
                }
                canonicalString() {
                    return this.toArray().map((t)=>(t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), ft.isValidIdentifier(t) || (t = "`" + t + "`"), t)).join(".");
                }
                toString() {
                    return this.canonicalString();
                }
                isKeyField() {
                    return 1 === this.length && "__name__" === this.get(0);
                }
                static keyField() {
                    return new ft([
                        "__name__"
                    ]);
                }
                static fromServerFormat(t) {
                    const e = [];
                    let n = "", s = 0;
                    const i = ()=>{
                        if (0 === n.length) throw new j(K.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n), n = "";
                    };
                    let r = !1;
                    for(; s < t.length;){
                        const e = t[s];
                        if ("\\" === e) {
                            if (s + 1 === t.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
                            const e = t[s + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
                            n += e, s += 2;
                        } else "`" === e ? r = !r : "." !== e || r ? n += e : i(), s++;
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
                    return new ft(e);
                }
                static emptyPath() {
                    return new ft([]);
                }
            }
            class _t {
                constructor(t){
                    this.binaryString = t;
                }
                static fromBase64String(t) {
                    return new _t(atob(t));
                }
                static fromUint8Array(t) {
                    return new _t(function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(t));
                }
                toBase64() {
                    return btoa(this.binaryString);
                }
                toUint8Array() {
                    return function(t) {
                        const e = new Uint8Array(t.length);
                        for(let n = 0; n < t.length; n++)e[n] = t.charCodeAt(n);
                        return e;
                    }(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(t) {
                    return et(this.binaryString, t.binaryString);
                }
                isEqual(t) {
                    return this.binaryString === t.binaryString;
                }
            }
            _t.EMPTY_BYTE_STRING = new _t("");
            const mt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function gt(t) {
                if (t || L(), "string" == typeof t) {
                    let e = 0;
                    const n = mt.exec(t);
                    if (n || L(), n[1]) {
                        let t = n[1];
                        e = Number(t = (t + "000000000").substr(0, 9));
                    }
                    return {
                        seconds: Math.floor(new Date(t).getTime() / 1e3),
                        nanos: e
                    };
                }
                return {
                    seconds: yt(t.seconds),
                    nanos: yt(t.nanos)
                };
            }
            function yt(t) {
                return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
            }
            function pt(t) {
                return "string" == typeof t ? _t.fromBase64String(t) : _t.fromUint8Array(t);
            }
            function Tt(t) {
                var e, n;
                return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
            }
            function It(t) {
                const e = gt(t.mapValue.fields.__local_write_time__.timestampValue);
                return new it(e.seconds, e.nanos);
            }
            function At(t) {
                return null == t;
            }
            function Rt(t) {
                return 0 === t && 1 / t == -1 / 0;
            }
            class Pt {
                constructor(t){
                    this.path = t;
                }
                static fromPath(t) {
                    return new Pt(ht.fromString(t));
                }
                static fromName(t) {
                    return new Pt(ht.fromString(t).popFirst(5));
                }
                hasCollectionId(t) {
                    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
                }
                isEqual(t) {
                    return null !== t && 0 === ht.comparator(this.path, t.path);
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t, e) {
                    return ht.comparator(t.path, e.path);
                }
                static isDocumentKey(t) {
                    return t.length % 2 == 0;
                }
                static fromSegments(t) {
                    return new Pt(new ht(t.slice()));
                }
            }
            function vt(t) {
                return "nullValue" in t ? 0 : "booleanValue" in t ? 1 : "integerValue" in t || "doubleValue" in t ? 2 : "timestampValue" in t ? 3 : "stringValue" in t ? 5 : "bytesValue" in t ? 6 : "referenceValue" in t ? 7 : "geoPointValue" in t ? 8 : "arrayValue" in t ? 9 : "mapValue" in t ? Tt(t) ? 4 : 10 : L();
            }
            function Vt(t, e) {
                const n = vt(t);
                if (n !== vt(e)) return !1;
                switch(n){
                    case 0:
                        return !0;
                    case 1:
                        return t.booleanValue === e.booleanValue;
                    case 4:
                        return It(t).isEqual(It(e));
                    case 3:
                        return function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) return t.timestampValue === e.timestampValue;
                            const n = gt(t.timestampValue), s = gt(e.timestampValue);
                            return n.seconds === s.seconds && n.nanos === s.nanos;
                        }(t, e);
                    case 5:
                        return t.stringValue === e.stringValue;
                    case 6:
                        return pt(t.bytesValue).isEqual(pt(e.bytesValue));
                    case 7:
                        return t.referenceValue === e.referenceValue;
                    case 8:
                        return yt(t.geoPointValue.latitude) === yt(e.geoPointValue.latitude) && yt(t.geoPointValue.longitude) === yt(e.geoPointValue.longitude);
                    case 2:
                        return function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return yt(t.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = yt(t.doubleValue), s = yt(e.doubleValue);
                                return n === s ? Rt(n) === Rt(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        }(t, e);
                    case 9:
                        return nt(t.arrayValue.values || [], e.arrayValue.values || [], Vt);
                    case 10:
                        return function(t, e) {
                            const n = t.mapValue.fields || {}, s = e.mapValue.fields || {};
                            if (ot(n) !== ot(s)) return !1;
                            for(const t in n)if (n.hasOwnProperty(t) && (void 0 === s[t] || !Vt(n[t], s[t]))) return !1;
                            return !0;
                        }(t, e);
                    default:
                        return L();
                }
            }
            function St(t, e) {
                return void 0 !== (t.values || []).find((t)=>Vt(t, e));
            }
            function Dt(t, e) {
                const n = vt(t), s = vt(e);
                if (n !== s) return et(n, s);
                switch(n){
                    case 0:
                        return 0;
                    case 1:
                        return et(t.booleanValue, e.booleanValue);
                    case 2:
                        return function(t, e) {
                            const n = yt(t.integerValue || t.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        }(t, e);
                    case 3:
                        return Ct(t.timestampValue, e.timestampValue);
                    case 4:
                        return Ct(It(t), It(e));
                    case 5:
                        return et(t.stringValue, e.stringValue);
                    case 6:
                        return function(t, e) {
                            const n = pt(t), s = pt(e);
                            return n.compareTo(s);
                        }(t.bytesValue, e.bytesValue);
                    case 7:
                        return function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let t = 0; t < n.length && t < s.length; t++){
                                const e = et(n[t], s[t]);
                                if (0 !== e) return e;
                            }
                            return et(n.length, s.length);
                        }(t.referenceValue, e.referenceValue);
                    case 8:
                        return function(t, e) {
                            const n = et(yt(t.latitude), yt(e.latitude));
                            return 0 !== n ? n : et(yt(t.longitude), yt(e.longitude));
                        }(t.geoPointValue, e.geoPointValue);
                    case 9:
                        return function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let t = 0; t < n.length && t < s.length; ++t){
                                const e = Dt(n[t], s[t]);
                                if (e) return e;
                            }
                            return et(n.length, s.length);
                        }(t.arrayValue, e.arrayValue);
                    case 10:
                        return function(t, e) {
                            const n = t.fields || {}, s = Object.keys(n), i = e.fields || {}, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t = 0; t < s.length && t < r.length; ++t){
                                const e = et(s[t], r[t]);
                                if (0 !== e) return e;
                                const o = Dt(n[s[t]], i[r[t]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        }(t.mapValue, e.mapValue);
                    default:
                        throw L();
                }
            }
            function Ct(t, e) {
                if ("string" == typeof t && "string" == typeof e && t.length === e.length) return et(t, e);
                const n = gt(t), s = gt(e), i = et(n.seconds, s.seconds);
                return 0 !== i ? i : et(n.nanos, s.nanos);
            }
            function xt(t) {
                var e, n;
                return "nullValue" in t ? "null" : "booleanValue" in t ? "" + t.booleanValue : "integerValue" in t ? "" + t.integerValue : "doubleValue" in t ? "" + t.doubleValue : "timestampValue" in t ? function(t) {
                    const e = gt(t);
                    return `time(${e.seconds},${e.nanos})`;
                }(t.timestampValue) : "stringValue" in t ? t.stringValue : "bytesValue" in t ? pt(t.bytesValue).toBase64() : "referenceValue" in t ? (n = t.referenceValue, Pt.fromName(n).toString()) : "geoPointValue" in t ? `geo(${(e = t.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t ? function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? n = !1 : e += ",", e += xt(s);
                    return e + "]";
                }(t.arrayValue) : "mapValue" in t ? function(t) {
                    const e = Object.keys(t.fields || {}).sort();
                    let n = "{", s = !0;
                    for (const i of e)s ? s = !1 : n += ",", n += `${i}:${xt(t.fields[i])}`;
                    return n + "}";
                }(t.mapValue) : L();
            }
            function $t(t) {
                return !!t && "integerValue" in t;
            }
            function Ot(t) {
                return !!t && "arrayValue" in t;
            }
            function Ft(t) {
                return !!t && "nullValue" in t;
            }
            function Mt(t) {
                return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
            }
            function Lt(t) {
                return !!t && "mapValue" in t;
            }
            function Bt(t) {
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
                    return ct(t.mapValue.fields, (t, n)=>e.mapValue.fields[t] = Bt(n)), e;
                }
                if (t.arrayValue) {
                    const e = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let n = 0; n < (t.arrayValue.values || []).length; ++n)e.arrayValue.values[n] = Bt(t.arrayValue.values[n]);
                    return e;
                }
                return Object.assign({}, t);
            }
            class Ut {
                constructor(t){
                    this.value = t;
                }
                static empty() {
                    return new Ut({
                        mapValue: {}
                    });
                }
                field(t) {
                    if (t.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n = 0; n < t.length - 1; ++n)if (!Lt(e = (e.mapValue.fields || {})[t.get(n)])) return null;
                        return (e = (e.mapValue.fields || {})[t.lastSegment()]) || null;
                    }
                }
                set(t, e) {
                    this.getFieldsMap(t.popLast())[t.lastSegment()] = Bt(e);
                }
                setAll(t) {
                    let e = ft.emptyPath(), n = {}, s = [];
                    t.forEach((t, i)=>{
                        if (!e.isImmediateParentOf(i)) {
                            const t = this.getFieldsMap(e);
                            this.applyChanges(t, n, s), n = {}, s = [], e = i.popLast();
                        }
                        t ? n[i.lastSegment()] = Bt(t) : s.push(i.lastSegment());
                    });
                    const i = this.getFieldsMap(e);
                    this.applyChanges(i, n, s);
                }
                delete(t) {
                    const e = this.field(t.popLast());
                    Lt(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
                }
                isEqual(t) {
                    return Vt(this.value, t.value);
                }
                getFieldsMap(t) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {}
                    });
                    for(let n = 0; n < t.length; ++n){
                        let s = e.mapValue.fields[t.get(n)];
                        Lt(s) && s.mapValue.fields || (s = {
                            mapValue: {
                                fields: {}
                            }
                        }, e.mapValue.fields[t.get(n)] = s), e = s;
                    }
                    return e.mapValue.fields;
                }
                applyChanges(t, e, n) {
                    for (const e1 of (ct(e, (e, n)=>t[e] = n), n))delete t[e1];
                }
                clone() {
                    return new Ut(Bt(this.value));
                }
            }
            class Kt {
                constructor(t, e, n, s, i){
                    this.key = t, this.documentType = e, this.version = n, this.data = s, this.documentState = i;
                }
                static newInvalidDocument(t) {
                    return new Kt(t, 0, rt.min(), Ut.empty(), 0);
                }
                static newFoundDocument(t, e, n) {
                    return new Kt(t, 1, e, n, 0);
                }
                static newNoDocument(t, e) {
                    return new Kt(t, 2, e, Ut.empty(), 0);
                }
                static newUnknownDocument(t, e) {
                    return new Kt(t, 3, e, Ut.empty(), 2);
                }
                convertToFoundDocument(t, e) {
                    return this.version = t, this.documentType = 1, this.data = e, this.documentState = 0, this;
                }
                convertToNoDocument(t) {
                    return this.version = t, this.documentType = 2, this.data = Ut.empty(), this.documentState = 0, this;
                }
                convertToUnknownDocument(t) {
                    return this.version = t, this.documentType = 3, this.data = Ut.empty(), this.documentState = 2, this;
                }
                setHasCommittedMutations() {
                    return this.documentState = 2, this;
                }
                setHasLocalMutations() {
                    return this.documentState = 1, this;
                }
                get hasLocalMutations() {
                    return 1 === this.documentState;
                }
                get hasCommittedMutations() {
                    return 2 === this.documentState;
                }
                get hasPendingWrites() {
                    return this.hasLocalMutations || this.hasCommittedMutations;
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
                    return t instanceof Kt && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
                }
                clone() {
                    return new Kt(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class jt {
                constructor(t, e = null, n = [], s = [], i = null, r = null, o = null){
                    this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, this.startAt = r, this.endAt = o, this.A = null;
                }
            }
            function Qt(t, e = null, n = [], s = [], i = null, r = null, o = null) {
                return new jt(t, e, n, s, i, r, o);
            }
            function Wt(t) {
                if (null === t.A) {
                    let t1 = t.path.canonicalString();
                    null !== t.collectionGroup && (t1 += "|cg:" + t.collectionGroup), t1 += "|f:" + t.filters.map((t)=>t.field.canonicalString() + t.op.toString() + xt(t.value)).join(",") + "|ob:" + t.orderBy.map((t)=>t.field.canonicalString() + t.dir).join(","), At(t.limit) || (t1 += "|l:" + t.limit), t.startAt && (t1 += "|lb:" + ce(t.startAt)), t.endAt && (t1 += "|ub:" + ce(t.endAt)), t.A = t1;
                }
                return t.A;
            }
            function zt(t, e) {
                var n, s, t1, e1;
                if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1;
                for(let n = 0; n < t.orderBy.length; n++)if (t1 = t.orderBy[n], e1 = e.orderBy[n], !(t1.dir === e1.dir && t1.field.isEqual(e1.field))) return !1;
                if (t.filters.length !== e.filters.length) return !1;
                for(let i = 0; i < t.filters.length; i++)if (n = t.filters[i], s = e.filters[i], n.op !== s.op || !n.field.isEqual(s.field) || !Vt(n.value, s.value)) return !1;
                return t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!le(t.startAt, e.startAt) && le(t.endAt, e.endAt);
            }
            function Ht(t) {
                return Pt.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length;
            }
            class Jt extends class {
            } {
                constructor(t, e, n){
                    super(), this.field = t, this.op = e, this.value = n;
                }
                static create(t, e, n) {
                    return t.isKeyField() ? "in" === e || "not-in" === e ? this.R(t, e, n) : new Xt(t, e, n) : "array-contains" === e ? new ne(t, n) : "in" === e ? new se(t, n) : "not-in" === e ? new ie(t, n) : "array-contains-any" === e ? new re(t, n) : new Jt(t, e, n);
                }
                static R(t, e, n) {
                    return "in" === e ? new Zt(t, n) : new te(t, n);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return "!=" === this.op ? null !== e && this.P(Dt(e, this.value)) : null !== e && vt(this.value) === vt(e) && this.P(Dt(e, this.value));
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
                            return L();
                    }
                }
                v() {
                    return [
                        "<",
                        "<=",
                        ">",
                        ">=",
                        "!=",
                        "not-in"
                    ].indexOf(this.op) >= 0;
                }
            }
            class Xt extends Jt {
                constructor(t, e, n){
                    super(t, e, n), this.key = Pt.fromName(n.referenceValue);
                }
                matches(t) {
                    const e = Pt.comparator(t.key, this.key);
                    return this.P(e);
                }
            }
            class Zt extends Jt {
                constructor(t, e){
                    super(t, "in", e), this.keys = ee("in", e);
                }
                matches(t) {
                    return this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            class te extends Jt {
                constructor(t, e){
                    super(t, "not-in", e), this.keys = ee("not-in", e);
                }
                matches(t) {
                    return !this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            function ee(t, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>Pt.fromName(t.referenceValue));
            }
            class ne extends Jt {
                constructor(t, e){
                    super(t, "array-contains", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return Ot(e) && St(e.arrayValue, this.value);
                }
            }
            class se extends Jt {
                constructor(t, e){
                    super(t, "in", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return null !== e && St(this.value.arrayValue, e);
                }
            }
            class ie extends Jt {
                constructor(t, e){
                    super(t, "not-in", e);
                }
                matches(t) {
                    if (St(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t.data.field(this.field);
                    return null !== e && !St(this.value.arrayValue, e);
                }
            }
            class re extends Jt {
                constructor(t, e){
                    super(t, "array-contains-any", e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>St(this.value.arrayValue, t));
                }
            }
            class oe {
                constructor(t, e){
                    this.position = t, this.before = e;
                }
            }
            function ce(t) {
                return `${t.before ? "b" : "a"}:${t.position.map((t)=>xt(t)).join(",")}`;
            }
            class ae {
                constructor(t, e = "asc"){
                    this.field = t, this.dir = e;
                }
            }
            function he(t, e, n) {
                let s = 0;
                for(let i = 0; i < t.position.length; i++){
                    const r = e[i], o = t.position[i];
                    if (s = r.field.isKeyField() ? Pt.comparator(Pt.fromName(o.referenceValue), n.key) : Dt(o, n.data.field(r.field)), "desc" === r.dir && (s *= -1), 0 !== s) break;
                }
                return t.before ? s <= 0 : s < 0;
            }
            function le(t, e) {
                if (null === t) return null === e;
                if (null === e || t.before !== e.before || t.position.length !== e.position.length) return !1;
                for(let n = 0; n < t.position.length; n++)if (!Vt(t.position[n], e.position[n])) return !1;
                return !0;
            }
            class fe {
                constructor(t, e = null, n = [], s = [], i = null, r = "F", o = null, c = null){
                    this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, this.limit = i, this.limitType = r, this.startAt = o, this.endAt = c, this.V = null, this.S = null, this.startAt, this.endAt;
                }
            }
            function _e(t) {
                return !At(t.limit) && "F" === t.limitType;
            }
            function me(t) {
                return !At(t.limit) && "L" === t.limitType;
            }
            function Te(t) {
                if (null === t.V) {
                    t.V = [];
                    const t1 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(t), n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
                    if (null !== t1 && null === n) t1.isKeyField() || t.V.push(new ae(t1)), t.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t1 = !1;
                        for (const n of t.explicitOrderBy)t.V.push(n), n.field.isKeyField() && (t1 = !0);
                        if (!t1) {
                            const t1 = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc";
                            t.V.push(new ae(ft.keyField(), t1));
                        }
                    }
                }
                return t.V;
            }
            function Ee(t) {
                if (!t.S) {
                    if ("F" === t.limitType) t.S = Qt(t.path, t.collectionGroup, Te(t), t.filters, t.limit, t.startAt, t.endAt);
                    else {
                        const t1 = [];
                        for (const n of Te(t)){
                            const e = "desc" === n.dir ? "asc" : "desc";
                            t1.push(new ae(n.field, e));
                        }
                        const n = t.endAt ? new oe(t.endAt.position, !t.endAt.before) : null, s = t.startAt ? new oe(t.startAt.position, !t.startAt.before) : null;
                        t.S = Qt(t.path, t.collectionGroup, t1, t.filters, t.limit, n, s);
                    }
                }
                return t.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t) {
                var t1;
                let e;
                return `Query(target=${e = (t1 = Ee(t)).path.canonicalString(), null !== t1.collectionGroup && (e += " collectionGroup=" + t1.collectionGroup), t1.filters.length > 0 && (e += `, filters: [${t1.filters.map((t)=>`${t.field.canonicalString()} ${t.op} ${xt(t.value)}`).join(", ")}]`), At(t1.limit) || (e += ", limit: " + t1.limit), t1.orderBy.length > 0 && (e += `, orderBy: [${t1.orderBy.map((t)=>`${t.field.canonicalString()} (${t.dir})`).join(", ")}]`), t1.startAt && (e += ", startAt: " + ce(t1.startAt)), t1.endAt && (e += ", endAt: " + ce(t1.endAt)), `Target(${e})`}; limitType=${t.limitType})`;
            }
            function Pe(t, e) {
                return e.isFoundDocument() && function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                }(t, e) && function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                }(t, e) && function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                }(t, e) && !(t.startAt && !he(t.startAt, Te(t), e) || t.endAt && he(t.endAt, Te(t), e));
            }
            function ve(t) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t)){
                        const t = function(t, e, n) {
                            const s = t.field.isKeyField() ? Pt.comparator(e.key, n.key) : function(t, e, n) {
                                const s = e.data.field(t), i = n.data.field(t);
                                return null !== s && null !== i ? Dt(s, i) : L();
                            }(t.field, e, n);
                            switch(t.dir){
                                case "asc":
                                    return s;
                                case "desc":
                                    return -1 * s;
                                default:
                                    return L();
                            }
                        }(i, e, n);
                        if (0 !== t) return t;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            class Ne {
                constructor(){
                    this._ = void 0;
                }
            }
            class Oe extends Ne {
            }
            class Fe extends Ne {
                constructor(t){
                    super(), this.elements = t;
                }
            }
            function Me(t, e) {
                const n = Ke(e);
                for (const e of t.elements)n.some((t)=>Vt(t, e)) || n.push(e);
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class Le extends Ne {
                constructor(t){
                    super(), this.elements = t;
                }
            }
            function Be(t, e) {
                let n = Ke(e);
                for (const e of t.elements)n = n.filter((t)=>!Vt(t, e));
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class Ue extends Ne {
                constructor(t, e){
                    super(), this.N = t, this.C = e;
                }
            }
            function qe(t) {
                return yt(t.integerValue || t.doubleValue);
            }
            function Ke(t) {
                return Ot(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
            }
            function ze(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            class He {
            }
            function Ye(t, e, n) {
                t instanceof en ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                    s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                }(t, e, n) : t instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = on(t.fieldTransforms, n, e), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                }(t, e, n) : ze(t.precondition, e) && e.convertToNoDocument(rt.min());
            }
            function Ze(t, e) {
                var t1, e1;
                return t.type === e.type && !!t.key.isEqual(e.key) && !!t.precondition.isEqual(e.precondition) && (t1 = t.fieldTransforms, e1 = e.fieldTransforms, !!(void 0 === t1 && void 0 === e1 || !(!t1 || !e1) && nt(t1, e1, (t, e)=>{
                    var t1, e1;
                    return t.field.isEqual(e.field) && (t1 = t.transform, e1 = e.transform, t1 instanceof Fe && e1 instanceof Fe || t1 instanceof Le && e1 instanceof Le ? nt(t1.elements, e1.elements, Vt) : t1 instanceof Ue && e1 instanceof Ue ? Vt(t1.C, e1.C) : t1 instanceof Oe && e1 instanceof Oe);
                }))) && (0 === t.type ? t.value.isEqual(e.value) : 1 !== t.type || t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask));
            }
            function tn(t) {
                return t.isFoundDocument() ? t.version : rt.min();
            }
            class en extends He {
                constructor(t, e, n, s = []){
                    super(), this.key = t, this.value = e, this.precondition = n, this.fieldTransforms = s, this.type = 0;
                }
            }
            class nn extends He {
                constructor(t, e, n, s, i = []){
                    super(), this.key = t, this.data = e, this.fieldMask = n, this.precondition = s, this.fieldTransforms = i, this.type = 1;
                }
            }
            function sn(t) {
                const e = new Map();
                return t.fieldMask.fields.forEach((n)=>{
                    if (!n.isEmpty()) {
                        const s = t.data.field(n);
                        e.set(n, s);
                    }
                }), e;
            }
            function rn(t, e, n) {
                var n1;
                const s = new Map();
                t.length === n.length || L();
                for(let i = 0; i < n.length; i++){
                    const r = t[i], o = r.transform, c = e.data.field(r.field);
                    s.set(r.field, (n1 = n[i], o instanceof Fe ? Me(o, c) : o instanceof Le ? Be(o, c) : n1));
                }
                return s;
            }
            function on(t, e, n) {
                const s = new Map();
                for (const i of t){
                    const t = i.transform, r = n.data.field(i.field);
                    s.set(i.field, t instanceof Oe ? function(t, e) {
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
                        return e && (n.fields.__previous_value__ = e), {
                            mapValue: n
                        };
                    }(e, r) : t instanceof Fe ? Me(t, r) : t instanceof Le ? Be(t, r) : function(t, e) {
                        const n = t instanceof Ue ? $t(e) || e && "doubleValue" in e ? e : {
                            integerValue: 0
                        } : null, s = qe(n) + qe(t.C);
                        return $t(n) && $t(t.C) ? {
                            integerValue: "" + s
                        } : function(t, e) {
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
                                doubleValue: Rt(e) ? "-0" : e
                            };
                        }(t.N, s);
                    }(t, r));
                }
                return s;
            }
            class un {
                constructor(t){
                    this.count = t;
                }
            }
            function dn(t) {
                if (void 0 === t) return O("GRPC error has no .code"), K.UNKNOWN;
                switch(t){
                    case hn.OK:
                        return K.OK;
                    case hn.CANCELLED:
                        return K.CANCELLED;
                    case hn.UNKNOWN:
                        return K.UNKNOWN;
                    case hn.DEADLINE_EXCEEDED:
                        return K.DEADLINE_EXCEEDED;
                    case hn.RESOURCE_EXHAUSTED:
                        return K.RESOURCE_EXHAUSTED;
                    case hn.INTERNAL:
                        return K.INTERNAL;
                    case hn.UNAVAILABLE:
                        return K.UNAVAILABLE;
                    case hn.UNAUTHENTICATED:
                        return K.UNAUTHENTICATED;
                    case hn.INVALID_ARGUMENT:
                        return K.INVALID_ARGUMENT;
                    case hn.NOT_FOUND:
                        return K.NOT_FOUND;
                    case hn.ALREADY_EXISTS:
                        return K.ALREADY_EXISTS;
                    case hn.PERMISSION_DENIED:
                        return K.PERMISSION_DENIED;
                    case hn.FAILED_PRECONDITION:
                        return K.FAILED_PRECONDITION;
                    case hn.ABORTED:
                        return K.ABORTED;
                    case hn.OUT_OF_RANGE:
                        return K.OUT_OF_RANGE;
                    case hn.UNIMPLEMENTED:
                        return K.UNIMPLEMENTED;
                    case hn.DATA_LOSS:
                        return K.DATA_LOSS;
                    default:
                        return L();
                }
            }
            (ln = hn = {})[ln.OK = 0] = "OK", ln[ln.CANCELLED = 1] = "CANCELLED", ln[ln.UNKNOWN = 2] = "UNKNOWN", ln[ln.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ln[ln.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ln[ln.NOT_FOUND = 5] = "NOT_FOUND", ln[ln.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ln[ln.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ln[ln.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ln[ln.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ln[ln.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ln[ln.ABORTED = 10] = "ABORTED", ln[ln.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ln[ln.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ln[ln.INTERNAL = 13] = "INTERNAL", ln[ln.UNAVAILABLE = 14] = "UNAVAILABLE", ln[ln.DATA_LOSS = 15] = "DATA_LOSS";
            class wn {
                constructor(t, e){
                    this.comparator = t, this.root = e || mn.EMPTY;
                }
                insert(t, e) {
                    return new wn(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                remove(t) {
                    return new wn(this.comparator, this.root.remove(t, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                get(t) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n = this.comparator(t, e.key);
                        if (0 === n) return e.value;
                        n < 0 ? e = e.left : n > 0 && (e = e.right);
                    }
                    return null;
                }
                indexOf(t) {
                    let e = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const s = this.comparator(t, n.key);
                        if (0 === s) return e + n.left.size;
                        s < 0 ? n = n.left : (e += n.left.size + 1, n = n.right);
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
                    return this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)), `{${t.join(", ")}}`;
                }
                reverseTraversal(t) {
                    return this.root.reverseTraversal(t);
                }
                getIterator() {
                    return new _n(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t) {
                    return new _n(this.root, t, this.comparator, !1);
                }
                getReverseIterator() {
                    return new _n(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t) {
                    return new _n(this.root, t, this.comparator, !0);
                }
            }
            class _n {
                constructor(t, e, n, s){
                    this.isReverse = s, this.nodeStack = [];
                    let i = 1;
                    for(; !t.isEmpty();)if (i = e ? n(t.key, e) : 1, s && (i *= -1), i < 0) t = this.isReverse ? t.left : t.right;
                    else {
                        if (0 === i) {
                            this.nodeStack.push(t);
                            break;
                        }
                        this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
                    }
                }
                getNext() {
                    let t = this.nodeStack.pop();
                    const e = {
                        key: t.key,
                        value: t.value
                    };
                    if (this.isReverse) for(t = t.left; !t.isEmpty();)this.nodeStack.push(t), t = t.right;
                    else for(t = t.right; !t.isEmpty();)this.nodeStack.push(t), t = t.left;
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
            class mn {
                constructor(t, e, n, s, i){
                    this.key = t, this.value = e, this.color = null != n ? n : mn.RED, this.left = null != s ? s : mn.EMPTY, this.right = null != i ? i : mn.EMPTY, this.size = this.left.size + 1 + this.right.size;
                }
                copy(t, e, n, s, i) {
                    return new mn(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != s ? s : this.left, null != i ? i : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(t) {
                    return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
                }
                reverseTraversal(t) {
                    return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
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
                    const i = n(t, s.key);
                    return (s = i < 0 ? s.copy(null, null, null, s.left.insert(t, e, n), null) : 0 === i ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t, e, n))).fixUp();
                }
                removeMin() {
                    if (this.left.isEmpty()) return mn.EMPTY;
                    let t = this;
                    return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), (t = t.copy(null, null, null, t.left.removeMin(), null)).fixUp();
                }
                remove(t, e) {
                    let n, s = this;
                    if (0 > e(t, s.key)) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t, e), null);
                    else {
                        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e(t, s.key)) {
                            if (s.right.isEmpty()) return mn.EMPTY;
                            n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
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
                    return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
                }
                moveRedLeft() {
                    let t = this.colorFlip();
                    return t.right.left.isRed() && (t = (t = (t = t.copy(null, null, null, null, t.right.rotateRight())).rotateLeft()).colorFlip()), t;
                }
                moveRedRight() {
                    let t = this.colorFlip();
                    return t.left.left.isRed() && (t = (t = t.rotateRight()).colorFlip()), t;
                }
                rotateLeft() {
                    const t = this.copy(null, null, mn.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, t, null);
                }
                rotateRight() {
                    const t = this.copy(null, null, mn.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, t);
                }
                colorFlip() {
                    const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, t, e);
                }
                checkMaxDepth() {
                    return Math.pow(2, this.check()) <= this.size + 1;
                }
                check() {
                    if (this.isRed() && this.left.isRed() || this.right.isRed()) throw L();
                    const t = this.left.check();
                    if (t !== this.right.check()) throw L();
                    return t + (this.isRed() ? 0 : 1);
                }
            }
            mn.EMPTY = null, mn.RED = !0, mn.BLACK = !1, mn.EMPTY = new class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw L();
                }
                get value() {
                    throw L();
                }
                get color() {
                    throw L();
                }
                get left() {
                    throw L();
                }
                get right() {
                    throw L();
                }
                copy(t, e, n, s, i) {
                    return this;
                }
                insert(t, e, n) {
                    return new mn(t, e);
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
            }();
            class gn {
                constructor(t){
                    this.comparator = t, this.data = new wn(this.comparator);
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
                    for(n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext();)if (!t(n.getNext().key)) return;
                }
                firstAfterOrEqual(t) {
                    const e = this.data.getIteratorFrom(t);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new yn(this.data.getIterator());
                }
                getIteratorFrom(t) {
                    return new yn(this.data.getIteratorFrom(t));
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
                    return e.size < t.size && (e = t, t = this), t.forEach((t)=>{
                        e = e.add(t);
                    }), e;
                }
                isEqual(t) {
                    if (!(t instanceof gn) || this.size !== t.size) return !1;
                    const e = this.data.getIterator(), n = t.data.getIterator();
                    for(; e.hasNext();){
                        const t = e.getNext().key, s = n.getNext().key;
                        if (0 !== this.comparator(t, s)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const t = [];
                    return this.forEach((e)=>{
                        t.push(e);
                    }), t;
                }
                toString() {
                    const t = [];
                    return this.forEach((e)=>t.push(e)), "SortedSet(" + t.toString() + ")";
                }
                copy(t) {
                    const e = new gn(this.comparator);
                    return e.data = t, e;
                }
            }
            class yn {
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
            const pn = new wn(Pt.comparator), En = new wn(Pt.comparator);
            new wn(Pt.comparator);
            const bn = new gn(Pt.comparator);
            function Pn(...t) {
                let e = bn;
                for (const n of t)e = e.add(n);
                return e;
            }
            const vn = new gn(et);
            class Sn {
                constructor(t, e, n, s, i){
                    this.snapshotVersion = t, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
                }
                static createSynthesizedRemoteEventForCurrentChange(t, e) {
                    const n = new Map();
                    return n.set(t, Dn.createSynthesizedTargetChangeForCurrentChange(t, e)), new Sn(rt.min(), n, vn, pn, Pn());
                }
            }
            class Dn {
                constructor(t, e, n, s, i){
                    this.resumeToken = t, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
                }
                static createSynthesizedTargetChangeForCurrentChange(t, e) {
                    return new Dn(_t.EMPTY_BYTE_STRING, e, Pn(), Pn(), Pn());
                }
            }
            class Cn {
                constructor(t, e, n, s){
                    this.k = t, this.removedTargetIds = e, this.key = n, this.$ = s;
                }
            }
            class Nn {
                constructor(t, e){
                    this.targetId = t, this.O = e;
                }
            }
            class xn {
                constructor(t, e, n = _t.EMPTY_BYTE_STRING, s = null){
                    this.state = t, this.targetIds = e, this.resumeToken = n, this.cause = s;
                }
            }
            class kn {
                constructor(){
                    this.F = 0, this.M = Fn(), this.L = _t.EMPTY_BYTE_STRING, this.B = !1, this.U = !0;
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
                    t.approximateByteSize() > 0 && (this.U = !0, this.L = t);
                }
                W() {
                    let t = Pn(), e = Pn(), n = Pn();
                    return this.M.forEach((s, i)=>{
                        switch(i){
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
                                L();
                        }
                    }), new Dn(this.L, this.B, t, e, n);
                }
                G() {
                    this.U = !1, this.M = Fn();
                }
                H(t, e) {
                    this.U = !0, this.M = this.M.insert(t, e);
                }
                J(t) {
                    this.U = !0, this.M = this.M.remove(t);
                }
                Y() {
                    this.F += 1;
                }
                X() {
                    this.F -= 1;
                }
                Z() {
                    this.U = !0, this.B = !0;
                }
            }
            class $n {
                constructor(t){
                    this.tt = t, this.et = new Map(), this.nt = pn, this.st = On(), this.it = new gn(et);
                }
                rt(t) {
                    for (const e of t.k)t.$ && t.$.isFoundDocument() ? this.ot(e, t.$) : this.ct(e, t.key, t.$);
                    for (const e of t.removedTargetIds)this.ct(e, t.key, t.$);
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
                                L();
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
                        const t = s.target;
                        if (Ht(t)) {
                            if (0 === n) {
                                const n = new Pt(t.path);
                                this.ct(e, n, Kt.newNoDocument(n, rt.min()));
                            } else 1 === n || L();
                        } else this.wt(e) !== n && (this.lt(e), this.it = this.it.add(e));
                    }
                }
                _t(t) {
                    const e = new Map();
                    this.et.forEach((n, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n.current && Ht(i.target)) {
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t));
                            }
                            n.K && (e.set(s, n.W()), n.G());
                        }
                    });
                    let n = Pn();
                    this.st.forEach((t, e)=>{
                        let s = !0;
                        e.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return !e || 2 === e.purpose || (s = !1, !1);
                        }), s && (n = n.add(t));
                    });
                    const s = new Sn(t, e, this.it, this.nt, n);
                    return this.nt = pn, this.st = On(), this.it = new gn(et), s;
                }
                ot(t, e) {
                    if (!this.ht(t)) return;
                    const n = this.gt(t, e.key) ? 2 : 0;
                    this.ut(t).H(e.key, n), this.nt = this.nt.insert(e.key, e), this.st = this.st.insert(e.key, this.yt(e.key).add(t));
                }
                ct(t, e, n) {
                    if (!this.ht(t)) return;
                    const s = this.ut(t);
                    this.gt(t, e) ? s.H(e, 1) : s.J(e), this.st = this.st.insert(e, this.yt(e).delete(t)), n && (this.nt = this.nt.insert(e, n));
                }
                removeTarget(t) {
                    this.et.delete(t);
                }
                wt(t) {
                    const e = this.ut(t).W();
                    return this.tt.getRemoteKeysForTarget(t).size + e.addedDocuments.size - e.removedDocuments.size;
                }
                Y(t) {
                    this.ut(t).Y();
                }
                ut(t) {
                    let e = this.et.get(t);
                    return e || (e = new kn(), this.et.set(t, e)), e;
                }
                yt(t) {
                    let e = this.st.get(t);
                    return e || (e = new gn(et), this.st = this.st.insert(t, e)), e;
                }
                ht(t) {
                    const e = null !== this.dt(t);
                    return e || $("WatchChangeAggregator", "Detected inactive target", t), e;
                }
                dt(t) {
                    const e = this.et.get(t);
                    return e && e.q ? null : this.tt.Tt(t);
                }
                lt(t) {
                    this.et.set(t, new kn()), this.tt.getRemoteKeysForTarget(t).forEach((e)=>{
                        this.ct(t, e, null);
                    });
                }
                gt(t, e) {
                    return this.tt.getRemoteKeysForTarget(t).has(e);
                }
            }
            function On() {
                return new wn(Pt.comparator);
            }
            function Fn() {
                return new wn(Pt.comparator);
            }
            const Mn = {
                asc: "ASCENDING",
                desc: "DESCENDING"
            }, Ln = {
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
            class Bn {
                constructor(t, e){
                    this.databaseId = t, this.D = e;
                }
            }
            function jn(t) {
                return t || L(), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t));
            }
            function Wn(t) {
                const e = ht.fromString(t);
                return Ts(e) || L(), e;
            }
            function zn(t, e) {
                const n = Wn(e);
                if (n.get(1) !== t.databaseId.projectId) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
                if (n.get(3) !== t.databaseId.database) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
                return new Pt(Xn(n));
            }
            function Hn(t, e) {
                var t1;
                return new ht([
                    "projects",
                    (t1 = t.databaseId).projectId,
                    "databases",
                    t1.database
                ]).child("documents").child(e).canonicalString();
            }
            function Yn(t) {
                return new ht([
                    "projects",
                    t.databaseId.projectId,
                    "databases",
                    t.databaseId.database
                ]).canonicalString();
            }
            function Xn(t) {
                return t.length > 4 && "documents" === t.get(4) || L(), t.popFirst(5);
            }
            function ls(t) {
                return {
                    before: t.before,
                    values: t.position
                };
            }
            function fs(t) {
                const e = !!t.before;
                return new oe(t.values || [], e);
            }
            function _s(t) {
                return {
                    fieldPath: t.canonicalString()
                };
            }
            function ms(t) {
                return ft.fromServerFormat(t.fieldPath);
            }
            function Ts(t) {
                return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
            }
            function Es(t) {
                let e = "";
                for(let n = 0; n < t.length; n++)e.length > 0 && (e += ""), e = function(t, e) {
                    let n = e;
                    const s = t.length;
                    for(let e = 0; e < s; e++){
                        const s = t.charAt(e);
                        switch(s){
                            case "\0":
                                n += "";
                                break;
                            case "":
                                n += "";
                                break;
                            default:
                                n += s;
                        }
                    }
                    return n;
                }(t.get(n), e);
                return e + "";
            }
            class Ps {
                constructor(t, e, n){
                    this.ownerId = t, this.allowTabSynchronization = e, this.leaseTimestampMs = n;
                }
            }
            Ps.store = "owner", Ps.key = "owner";
            class vs {
                constructor(t, e, n){
                    this.userId = t, this.lastAcknowledgedBatchId = e, this.lastStreamToken = n;
                }
            }
            vs.store = "mutationQueues", vs.keyPath = "userId";
            class Vs {
                constructor(t, e, n, s, i){
                    this.userId = t, this.batchId = e, this.localWriteTimeMs = n, this.baseMutations = s, this.mutations = i;
                }
            }
            Vs.store = "mutations", Vs.keyPath = "batchId", Vs.userMutationsIndex = "userMutationsIndex", Vs.userMutationsKeyPath = [
                "userId",
                "batchId"
            ];
            class Ss {
                constructor(){}
                static prefixForUser(t) {
                    return [
                        t
                    ];
                }
                static prefixForPath(t, e) {
                    return [
                        t,
                        Es(e)
                    ];
                }
                static key(t, e, n) {
                    return [
                        t,
                        Es(e),
                        n
                    ];
                }
            }
            Ss.store = "documentMutations", Ss.PLACEHOLDER = new Ss();
            class Ns {
                constructor(t, e, n, s, i, r){
                    this.unknownDocument = t, this.noDocument = e, this.document = n, this.hasCommittedMutations = s, this.readTime = i, this.parentPath = r;
                }
            }
            Ns.store = "remoteDocuments", Ns.readTimeIndex = "readTimeIndex", Ns.readTimeIndexPath = "readTime", Ns.collectionReadTimeIndex = "collectionReadTimeIndex", Ns.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime"
            ];
            class xs {
                constructor(t){
                    this.byteSize = t;
                }
            }
            xs.store = "remoteDocumentGlobal", xs.key = "remoteDocumentGlobalKey";
            class ks {
                constructor(t, e, n, s, i, r, o){
                    this.targetId = t, this.canonicalId = e, this.readTime = n, this.resumeToken = s, this.lastListenSequenceNumber = i, this.lastLimboFreeSnapshotVersion = r, this.query = o;
                }
            }
            ks.store = "targets", ks.keyPath = "targetId", ks.queryTargetsIndexName = "queryTargetsIndex", ks.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ];
            class $s {
                constructor(t, e, n){
                    this.targetId = t, this.path = e, this.sequenceNumber = n;
                }
            }
            $s.store = "targetDocuments", $s.keyPath = [
                "targetId",
                "path"
            ], $s.documentTargetsIndex = "documentTargetsIndex", $s.documentTargetsKeyPath = [
                "path",
                "targetId"
            ];
            class Os {
                constructor(t, e, n, s){
                    this.highestTargetId = t, this.highestListenSequenceNumber = e, this.lastRemoteSnapshotVersion = n, this.targetCount = s;
                }
            }
            Os.key = "targetGlobalKey", Os.store = "targetGlobal";
            class Fs {
                constructor(t, e){
                    this.collectionId = t, this.parent = e;
                }
            }
            Fs.store = "collectionParents", Fs.keyPath = [
                "collectionId",
                "parent"
            ];
            class Ms {
                constructor(t, e, n, s){
                    this.clientId = t, this.updateTimeMs = e, this.networkEnabled = n, this.inForeground = s;
                }
            }
            Ms.store = "clientMetadata", Ms.keyPath = "clientId";
            class Ls {
                constructor(t, e, n){
                    this.bundleId = t, this.createTime = e, this.version = n;
                }
            }
            Ls.store = "bundles", Ls.keyPath = "bundleId";
            class Bs {
                constructor(t, e, n){
                    this.name = t, this.readTime = e, this.bundledQuery = n;
                }
            }
            Bs.store = "namedQueries", Bs.keyPath = "name", vs.store, Vs.store, Ss.store, Ns.store, ks.store, Ps.store, Os.store, $s.store, Ms.store, xs.store, Fs.store, Ls.store, Bs.store;
            class Ks {
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
            class js {
                constructor(t){
                    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, t((t)=>{
                        this.isDone = !0, this.result = t, this.nextCallback && this.nextCallback(t);
                    }, (t)=>{
                        this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t) {
                    return this.next(void 0, t);
                }
                next(t, e) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t, this.result) : new js((n, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t, e).next(n, s);
                        }, this.catchCallback = (t)=>{
                            this.wrapFailure(e, t).next(n, s);
                        };
                    });
                }
                toPromise() {
                    return new Promise((t, e)=>{
                        this.next(t, e);
                    });
                }
                wrapUserFunction(t) {
                    try {
                        const e = t();
                        return e instanceof js ? e : js.resolve(e);
                    } catch (t) {
                        return js.reject(t);
                    }
                }
                wrapSuccess(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : js.resolve(e);
                }
                wrapFailure(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : js.reject(e);
                }
                static resolve(t) {
                    return new js((e, n)=>{
                        e(t);
                    });
                }
                static reject(t) {
                    return new js((e, n)=>{
                        n(t);
                    });
                }
                static waitFor(t) {
                    return new js((e, n)=>{
                        let s = 0, i = 0, r = !1;
                        t.forEach((t)=>{
                            ++s, t.next(()=>{
                                ++i, r && i === s && e();
                            }, (t)=>n(t));
                        }), r = !0, i === s && e();
                    });
                }
                static or(t) {
                    let e = js.resolve(!1);
                    for (const n of t)e = e.next((t)=>t ? js.resolve(t) : n());
                    return e;
                }
                static forEach(t, e) {
                    const n = [];
                    return t.forEach((t, s)=>{
                        n.push(e.call(this, t, s));
                    }), this.waitFor(n);
                }
            }
            function Hs(t) {
                return "IndexedDbTransactionError" === t.name;
            }
            class ni {
                constructor(t, e, n, s){
                    this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
                }
                applyToRemoteDocument(t, e) {
                    const n = e.mutationResults;
                    for(let e = 0; e < this.mutations.length; e++){
                        const s = this.mutations[e];
                        if (s.key.isEqual(t.key)) {
                            var n1;
                            n1 = n[e], s instanceof en ? function(t, e, n) {
                                const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                                s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                            }(s, t, n1) : s instanceof nn ? function(t, e, n) {
                                if (!ze(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                                const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                                i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                            }(s, t, n1) : function(t, e, n) {
                                e.convertToNoDocument(n.version).setHasCommittedMutations();
                            }(0, t, n1);
                        }
                    }
                }
                applyToLocalView(t) {
                    for (const e of this.baseMutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                    for (const e of this.mutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                }
                applyToLocalDocumentSet(t) {
                    this.mutations.forEach((e)=>{
                        const n = t.get(e.key);
                        this.applyToLocalView(n), n.isValidDocument() || n.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key), Pn());
                }
                isEqual(t) {
                    return this.batchId === t.batchId && nt(this.mutations, t.mutations, (t, e)=>Ze(t, e)) && nt(this.baseMutations, t.baseMutations, (t, e)=>Ze(t, e));
                }
            }
            class ii {
                constructor(t, e, n, s, i = rt.min(), r = rt.min(), o = _t.EMPTY_BYTE_STRING){
                    this.target = t, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
                }
                withSequenceNumber(t) {
                    return new ii(this.target, this.targetId, this.purpose, t, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(t, e) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t);
                }
                withLastLimboFreeSnapshotVersion(t) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t, this.resumeToken);
                }
            }
            class ri {
                constructor(t){
                    this.Wt = t;
                }
            }
            class pi {
                constructor(){
                    this.Gt = new Ti();
                }
                addToCollectionParentIndex(t, e) {
                    return this.Gt.add(e), js.resolve();
                }
                getCollectionParents(t, e) {
                    return js.resolve(this.Gt.getEntries(e));
                }
            }
            class Ti {
                constructor(){
                    this.index = {};
                }
                add(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new gn(ht.comparator), i = !s.has(n);
                    return this.index[e] = s.add(n), i;
                }
                has(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e];
                    return s && s.has(n);
                }
                getEntries(t) {
                    return (this.index[t] || new gn(ht.comparator)).toArray();
                }
            }
            class Ri {
                constructor(t, e, n){
                    this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
                }
                static withCacheSize(t) {
                    return new Ri(t, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            class Ni {
                constructor(t){
                    this.ne = t;
                }
                next() {
                    return this.ne += 2, this.ne;
                }
                static se() {
                    return new Ni(0);
                }
                static ie() {
                    return new Ni(-1);
                }
            }
            async function Fi(t) {
                if (t.code !== K.FAILED_PRECONDITION || "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab." !== t.message) throw t;
                $("LocalStore", "Unexpectedly lost primary lease");
            }
            class ji {
                constructor(t, e){
                    this.mapKeyFn = t, this.equalsFn = e, this.inner = {};
                }
                get(t) {
                    const e = this.mapKeyFn(t), n = this.inner[e];
                    if (void 0 !== n) {
                        for (const [e, s] of n)if (this.equalsFn(e, t)) return s;
                    }
                }
                has(t) {
                    return void 0 !== this.get(t);
                }
                set(t, e) {
                    const n = this.mapKeyFn(t), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let n = 0; n < s.length; n++)if (this.equalsFn(s[n][0], t)) return void (s[n] = [
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
                    for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t)) return 1 === n.length ? delete this.inner[e] : n.splice(s, 1), !0;
                    return !1;
                }
                forEach(t) {
                    ct(this.inner, (e, n)=>{
                        for (const [e, s] of n)t(e, s);
                    });
                }
                isEmpty() {
                    return function(t) {
                        for(const e in t)if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
                        return !0;
                    }(this.inner);
                }
            }
            class Qi {
                constructor(){
                    this.changes = new ji((t)=>t.toString(), (t, e)=>t.isEqual(e)), this.changesApplied = !1;
                }
                getReadTime(t) {
                    const e = this.changes.get(t);
                    return e ? e.readTime : rt.min();
                }
                addEntry(t, e) {
                    this.assertNotApplied(), this.changes.set(t.key, {
                        document: t,
                        readTime: e
                    });
                }
                removeEntry(t, e = null) {
                    this.assertNotApplied(), this.changes.set(t, {
                        document: Kt.newInvalidDocument(t),
                        readTime: e
                    });
                }
                getEntry(t, e) {
                    this.assertNotApplied();
                    const n = this.changes.get(e);
                    return void 0 !== n ? js.resolve(n.document) : this.getFromCache(t, e);
                }
                getEntries(t, e) {
                    return this.getAllFromCache(t, e);
                }
                apply(t) {
                    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t);
                }
                assertNotApplied() {}
            }
            class rr {
                constructor(t, e, n){
                    this.He = t, this.In = e, this.Ht = n;
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
                        for (const t of e)t.applyToLocalView(n);
                    });
                }
                Pn(t, e) {
                    return this.He.getEntries(t, e).next((e)=>this.vn(t, e).next(()=>e));
                }
                vn(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t)=>this.bn(e, t));
                }
                getDocumentsMatchingQuery(t, e, n) {
                    return Pt.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length ? this.Vn(t, e.path) : null !== e.collectionGroup ? this.Sn(t, e, n) : this.Dn(t, e, n);
                }
                Vn(t, e) {
                    return this.An(t, new Pt(e)).next((t)=>{
                        let e = En;
                        return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
                    });
                }
                Sn(t, e, n) {
                    const s = e.collectionGroup;
                    let i = En;
                    return this.Ht.getCollectionParents(t, s).next((r)=>js.forEach(r, (r)=>{
                            const o = new fe(r.child(s), null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
                            return this.Dn(t, o, n).next((t)=>{
                                t.forEach((t, e)=>{
                                    i = i.insert(t, e);
                                });
                            });
                        }).next(()=>i));
                }
                Dn(t, e, n) {
                    let s, i;
                    return this.He.getDocumentsMatchingQuery(t, e, n).next((n)=>(s = n, this.In.getAllMutationBatchesAffectingQuery(t, e))).next((e)=>(i = e, this.Cn(t, i, s).next((t)=>{
                            for (const t1 of (s = t, i))for (const e of t1.mutations){
                                const n = e.key;
                                let i = s.get(n);
                                null == i && (i = Kt.newInvalidDocument(n), s = s.insert(n, i)), Ye(e, i, t1.localWriteTime), i.isFoundDocument() || (s = s.remove(n));
                            }
                        }))).next(()=>(s.forEach((t, n)=>{
                            Pe(e, n) || (s = s.remove(t));
                        }), s));
                }
                Cn(t, e, n) {
                    let s = Pn();
                    for (const t of e)for (const e of t.mutations)e instanceof nn && null === n.get(e.key) && (s = s.add(e.key));
                    let i = n;
                    return this.He.getEntries(t, s).next((t)=>(t.forEach((t, e)=>{
                            e.isFoundDocument() && (i = i.insert(t, e));
                        }), i));
                }
            }
            class or {
                constructor(t, e, n, s){
                    this.targetId = t, this.fromCache = e, this.Nn = n, this.xn = s;
                }
                static kn(t, e) {
                    let n = Pn(), s = Pn();
                    for (const t of e.docChanges)switch(t.type){
                        case 0:
                            n = n.add(t.doc.key);
                            break;
                        case 1:
                            s = s.add(t.doc.key);
                    }
                    return new or(t, e.fromCache, n, s);
                }
            }
            class cr {
                $n(t) {
                    this.On = t;
                }
                getDocumentsMatchingQuery(t, e, n, s) {
                    return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField()) || n.isEqual(rt.min()) ? this.Fn(t, e) : this.On.Pn(t, s).next((i)=>{
                        const r = this.Mn(e, i);
                        return (_e(e) || me(e)) && this.Ln(e.limitType, r, s, n) ? this.Fn(t, e) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), be(e)), this.On.getDocumentsMatchingQuery(t, e, n).next((t)=>(r.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)));
                    });
                }
                Mn(t, e) {
                    let n = new gn(ve(t));
                    return e.forEach((e, s)=>{
                        Pe(t, s) && (n = n.add(s));
                    }), n;
                }
                Ln(t, e, n, s) {
                    if (n.size !== e.size) return !0;
                    const i = "F" === t ? e.last() : e.first();
                    return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
                }
                Fn(t, e) {
                    return x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Using full collection scan to execute query:", be(e)), this.On.getDocumentsMatchingQuery(t, e, rt.min());
                }
            }
            class ar {
                constructor(t, e, n, s){
                    this.persistence = t, this.Bn = e, this.N = s, this.Un = new wn(et), this.qn = new ji((t)=>Wt(t), zt), this.Kn = rt.min(), this.In = t.getMutationQueue(n), this.jn = t.getRemoteDocumentCache(), this.ze = t.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t.collect(e, this.Un));
                }
            }
            async function hr(t, e) {
                let s = t.In, i = t.Qn;
                const r = await t.persistence.runTransaction("Handle user change", "readonly", (t1)=>{
                    let r;
                    return t.In.getAllMutationBatches(t1).next((o)=>(r = o, s = t.persistence.getMutationQueue(e), i = new rr(t.jn, s, t.persistence.getIndexManager()), s.getAllMutationBatches(t1))).next((e)=>{
                        const n = [], s = [];
                        let o = Pn();
                        for (const t of r)for (const e of (n.push(t.batchId), t.mutations))o = o.add(e.key);
                        for (const t of e)for (const e of (s.push(t.batchId), t.mutations))o = o.add(e.key);
                        return i.Pn(t1, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            }));
                    });
                });
                return t.In = s, t.Qn = i, t.Bn.$n(t.Qn), r;
            }
            function fr(t) {
                return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (t1)=>t.ze.getLastRemoteSnapshotVersion(t1));
            }
            async function gr(t, e, n) {
                const i = t.Un.get(e);
                try {
                    n || await t.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t1)=>t.persistence.referenceDelegate.removeTarget(t1, i));
                } catch (t) {
                    if (!Hs(t)) throw t;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
                }
                t.Un = t.Un.remove(e), t.qn.delete(i.target);
            }
            function yr(t, e, n) {
                let i = rt.min(), r = Pn();
                return t.persistence.runTransaction("Execute query", "readonly", (t1)=>(function(t, e, n) {
                        const i = t.qn.get(n);
                        return void 0 !== i ? js.resolve(t.Un.get(i)) : t.ze.getTargetData(e, n);
                    })(t, t1, Ee(e)).next((e)=>{
                        if (e) return i = e.lastLimboFreeSnapshotVersion, t.ze.getMatchingKeysForTargetId(t1, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>t.Bn.getDocumentsMatchingQuery(t1, e, n ? i : rt.min(), n ? r : Pn())).next((t)=>({
                            documents: t,
                            Gn: r
                        })));
            }
            class Rr {
                constructor(t){
                    this.N = t, this.Yn = new Map(), this.Xn = new Map();
                }
                getBundleMetadata(t, e) {
                    return js.resolve(this.Yn.get(e));
                }
                saveBundleMetadata(t, e) {
                    return this.Yn.set(e.id, {
                        id: e.id,
                        version: e.version,
                        createTime: jn(e.createTime)
                    }), js.resolve();
                }
                getNamedQuery(t, e) {
                    return js.resolve(this.Xn.get(e));
                }
                saveNamedQuery(t, e) {
                    return this.Xn.set(e.name, {
                        name: e.name,
                        query: function(t) {
                            var e;
                            const e1 = function(t) {
                                var t1;
                                let e, e1 = function(t) {
                                    const e = Wn(t);
                                    return 4 === e.length ? ht.emptyPath() : Xn(e);
                                }(t.parent);
                                const n = t.structuredQuery, s = n.from ? n.from.length : 0;
                                let i = null;
                                if (s > 0) {
                                    1 === s || L();
                                    const t = n.from[0];
                                    t.allDescendants ? i = t.collectionId : e1 = e1.child(t.collectionId);
                                }
                                let r = [];
                                n.where && (r = function hs(t) {
                                    return t ? void 0 !== t.unaryFilter ? [
                                        function(t) {
                                            switch(t.unaryFilter.op){
                                                case "IS_NAN":
                                                    const e = ms(t.unaryFilter.field);
                                                    return Jt.create(e, "==", {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NULL":
                                                    const n = ms(t.unaryFilter.field);
                                                    return Jt.create(n, "==", {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                case "IS_NOT_NAN":
                                                    const s = ms(t.unaryFilter.field);
                                                    return Jt.create(s, "!=", {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NOT_NULL":
                                                    const i = ms(t.unaryFilter.field);
                                                    return Jt.create(i, "!=", {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                default:
                                                    return L();
                                            }
                                        }(t)
                                    ] : void 0 !== t.fieldFilter ? [
                                        Jt.create(ms(t.fieldFilter.field), function(t) {
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
                                                    return L();
                                            }
                                        }(t.fieldFilter.op), t.fieldFilter.value)
                                    ] : void 0 !== t.compositeFilter ? t.compositeFilter.filters.map((t)=>hs(t)).reduce((t, e)=>t.concat(e)) : L() : [];
                                }(n.where));
                                let o = [];
                                n.orderBy && (o = n.orderBy.map((t)=>new ae(ms(t.field), function(t) {
                                        switch(t){
                                            case "ASCENDING":
                                                return "asc";
                                            case "DESCENDING":
                                                return "desc";
                                            default:
                                                return;
                                        }
                                    }(t.direction))));
                                let c = null;
                                n.limit && (c = At(e = "object" == typeof (t1 = n.limit) ? t1.value : t1) ? null : e);
                                let a = null;
                                n.startAt && (a = fs(n.startAt));
                                let u = null;
                                return n.endAt && (u = fs(n.endAt)), new fe(e1, i, o, r, c, "F", a, u);
                            }({
                                parent: t.parent,
                                structuredQuery: t.structuredQuery
                            });
                            return "LAST" === t.limitType ? (e = e1.limit, new fe(e1.path, e1.collectionGroup, e1.explicitOrderBy.slice(), e1.filters.slice(), e, "L", e1.startAt, e1.endAt)) : e1;
                        }(e.bundledQuery),
                        readTime: jn(e.readTime)
                    }), js.resolve();
                }
            }
            class br {
                constructor(){
                    this.Zn = new gn(Pr.ts), this.es = new gn(Pr.ns);
                }
                isEmpty() {
                    return this.Zn.isEmpty();
                }
                addReference(t, e) {
                    const n = new Pr(t, e);
                    this.Zn = this.Zn.add(n), this.es = this.es.add(n);
                }
                ss(t, e) {
                    t.forEach((t)=>this.addReference(t, e));
                }
                removeReference(t, e) {
                    this.rs(new Pr(t, e));
                }
                os(t, e) {
                    t.forEach((t)=>this.removeReference(t, e));
                }
                cs(t) {
                    const e = new Pt(new ht([])), n = new Pr(e, t), s = new Pr(e, t + 1), i = [];
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        this.rs(t), i.push(t.key);
                    }), i;
                }
                us() {
                    this.Zn.forEach((t)=>this.rs(t));
                }
                rs(t) {
                    this.Zn = this.Zn.delete(t), this.es = this.es.delete(t);
                }
                hs(t) {
                    const e = new Pt(new ht([])), n = new Pr(e, t), s = new Pr(e, t + 1);
                    let i = Pn();
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        i = i.add(t.key);
                    }), i;
                }
                containsKey(t) {
                    const e = new Pr(t, 0), n = this.Zn.firstAfterOrEqual(e);
                    return null !== n && t.isEqual(n.key);
                }
            }
            class Pr {
                constructor(t, e){
                    this.key = t, this.ls = e;
                }
                static ts(t, e) {
                    return Pt.comparator(t.key, e.key) || et(t.ls, e.ls);
                }
                static ns(t, e) {
                    return et(t.ls, e.ls) || Pt.comparator(t.key, e.key);
                }
            }
            class vr {
                constructor(t, e){
                    this.Ht = t, this.referenceDelegate = e, this.In = [], this.fs = 1, this.ds = new gn(Pr.ts);
                }
                checkEmpty(t) {
                    return js.resolve(0 === this.In.length);
                }
                addMutationBatch(t, e, n, s) {
                    const i = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const r = new ni(i, e, n, s);
                    for (const e of (this.In.push(r), s))this.ds = this.ds.add(new Pr(e.key, i)), this.Ht.addToCollectionParentIndex(t, e.key.path.popLast());
                    return js.resolve(r);
                }
                lookupMutationBatch(t, e) {
                    return js.resolve(this.ws(e));
                }
                getNextMutationBatchAfterBatchId(t, e) {
                    const s = this._s(e + 1), i = s < 0 ? 0 : s;
                    return js.resolve(this.In.length > i ? this.In[i] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return js.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t) {
                    return js.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t, e) {
                    const n = new Pr(e, 0), s = new Pr(e, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t, e) {
                    let n = new gn(et);
                    return e.forEach((t)=>{
                        const e = new Pr(t, 0), s = new Pr(t, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), js.resolve(this.gs(n));
                }
                getAllMutationBatchesAffectingQuery(t, e) {
                    const n = e.path, s = n.length + 1;
                    let i = n;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    let o = new gn(et);
                    return this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return !!n.isPrefixOf(e) && (e.length === s && (o = o.add(t.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t) {
                    const e = [];
                    return t.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e;
                }
                removeMutationBatch(t, e) {
                    0 === this.ys(e.batchId, "removed") || L(), this.In.shift();
                    let n = this.ds;
                    return js.forEach(e.mutations, (s)=>{
                        const i = new Pr(s.key, e.batchId);
                        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t, s.key);
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(t) {}
                containsKey(t, e) {
                    const n = new Pr(e, 0), s = this.ds.firstAfterOrEqual(n);
                    return js.resolve(e.isEqual(s && s.key));
                }
                performConsistencyCheck(t) {
                    return this.In.length, js.resolve();
                }
                ys(t, e) {
                    return this._s(t);
                }
                _s(t) {
                    return 0 === this.In.length ? 0 : t - this.In[0].batchId;
                }
                ws(t) {
                    const e = this._s(t);
                    return e < 0 || e >= this.In.length ? null : this.In[e];
                }
            }
            class Vr {
                constructor(t, e){
                    this.Ht = t, this.ps = e, this.docs = new wn(Pt.comparator), this.size = 0;
                }
                addEntry(t, e, n) {
                    const s = e.key, i = this.docs.get(s), r = i ? i.size : 0, o = this.ps(e);
                    return this.docs = this.docs.insert(s, {
                        document: e.clone(),
                        size: o,
                        readTime: n
                    }), this.size += o - r, this.Ht.addToCollectionParentIndex(t, s.path.popLast());
                }
                removeEntry(t) {
                    const e = this.docs.get(t);
                    e && (this.docs = this.docs.remove(t), this.size -= e.size);
                }
                getEntry(t, e) {
                    const n = this.docs.get(e);
                    return js.resolve(n ? n.document.clone() : Kt.newInvalidDocument(e));
                }
                getEntries(t, e) {
                    let n = pn;
                    return e.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : Kt.newInvalidDocument(t));
                    }), js.resolve(n);
                }
                getDocumentsMatchingQuery(t, e, n) {
                    let s = pn;
                    const i = new Pt(e.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t, value: { document: i, readTime: o } } = r.getNext();
                        if (!e.path.isPrefixOf(t.path)) break;
                        0 >= o.compareTo(n) || Pe(e, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t, e) {
                    return js.forEach(this.docs, (t)=>e(t));
                }
                newChangeBuffer(t) {
                    return new Sr(this);
                }
                getSize(t) {
                    return js.resolve(this.size);
                }
            }
            class Sr extends Qi {
                constructor(t){
                    super(), this.Se = t;
                }
                applyChanges(t) {
                    const e = [];
                    return this.changes.forEach((n, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t, s.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), js.waitFor(e);
                }
                getFromCache(t, e) {
                    return this.Se.getEntry(t, e);
                }
                getAllFromCache(t, e) {
                    return this.Se.getEntries(t, e);
                }
            }
            class Dr {
                constructor(t){
                    this.persistence = t, this.Es = new ji((t)=>Wt(t), zt), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Is = 0, this.As = new br(), this.targetCount = 0, this.Rs = Ni.se();
                }
                forEachTarget(t, e) {
                    return this.Es.forEach((t, n)=>e(n)), js.resolve();
                }
                getLastRemoteSnapshotVersion(t) {
                    return js.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(t) {
                    return js.resolve(this.Is);
                }
                allocateTargetId(t) {
                    return this.highestTargetId = this.Rs.next(), js.resolve(this.highestTargetId);
                }
                setTargetsMetadata(t, e, n) {
                    return n && (this.lastRemoteSnapshotVersion = n), e > this.Is && (this.Is = e), js.resolve();
                }
                ce(t) {
                    this.Es.set(t.target, t);
                    const e = t.targetId;
                    e > this.highestTargetId && (this.Rs = new Ni(e), this.highestTargetId = e), t.sequenceNumber > this.Is && (this.Is = t.sequenceNumber);
                }
                addTargetData(t, e) {
                    return this.ce(e), this.targetCount += 1, js.resolve();
                }
                updateTargetData(t, e) {
                    return this.ce(e), js.resolve();
                }
                removeTargetData(t, e) {
                    return this.Es.delete(e.target), this.As.cs(e.targetId), this.targetCount -= 1, js.resolve();
                }
                removeTargets(t, e, n) {
                    let s = 0;
                    const i = [];
                    return this.Es.forEach((r, o)=>{
                        o.sequenceNumber <= e && null === n.get(o.targetId) && (this.Es.delete(r), i.push(this.removeMatchingKeysForTargetId(t, o.targetId)), s++);
                    }), js.waitFor(i).next(()=>s);
                }
                getTargetCount(t) {
                    return js.resolve(this.targetCount);
                }
                getTargetData(t, e) {
                    const n = this.Es.get(e) || null;
                    return js.resolve(n);
                }
                addMatchingKeys(t, e, n) {
                    return this.As.ss(e, n), js.resolve();
                }
                removeMatchingKeys(t, e, n) {
                    this.As.os(e, n);
                    const s = this.persistence.referenceDelegate, i = [];
                    return s && e.forEach((e)=>{
                        i.push(s.markPotentiallyOrphaned(t, e));
                    }), js.waitFor(i);
                }
                removeMatchingKeysForTargetId(t, e) {
                    return this.As.cs(e), js.resolve();
                }
                getMatchingKeysForTargetId(t, e) {
                    const n = this.As.hs(e);
                    return js.resolve(n);
                }
                containsKey(t, e) {
                    return js.resolve(this.As.containsKey(e));
                }
            }
            class Cr {
                constructor(t, e){
                    this.bs = {}, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t(this), this.ze = new Dr(this), this.Ht = new pi(), this.He = new Vr(this.Ht, (t)=>this.referenceDelegate.Ps(t)), this.N = new ri(e), this.Je = new Rr(this.N);
                }
                start() {
                    return Promise.resolve();
                }
                shutdown() {
                    return this.Be = !1, Promise.resolve();
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
                    return e || (e = new vr(this.Ht, this.referenceDelegate), this.bs[t.toKey()] = e), e;
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
                    $("MemoryPersistence", "Starting transaction:", t);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t)).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t));
                }
                Ss(t, e) {
                    return js.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t, e)));
                }
            }
            class Nr extends Ks {
                constructor(t){
                    super(), this.currentSequenceNumber = t;
                }
            }
            class xr {
                constructor(t){
                    this.persistence = t, this.Ds = new br(), this.Cs = null;
                }
                static Ns(t) {
                    return new xr(t);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw L();
                }
                addReference(t, e, n) {
                    return this.Ds.addReference(n, e), this.xs.delete(n.toString()), js.resolve();
                }
                removeReference(t, e, n) {
                    return this.Ds.removeReference(n, e), this.xs.add(n.toString()), js.resolve();
                }
                markPotentiallyOrphaned(t, e) {
                    return this.xs.add(e.toString()), js.resolve();
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
                    return js.forEach(this.xs, (n)=>{
                        const s = Pt.fromPath(n);
                        return this.ks(t, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t)));
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
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e)),
                        ()=>this.persistence.getTargetCache().containsKey(t, e),
                        ()=>this.persistence.Ss(t, e)
                    ]);
                }
            }
            class Ur {
                constructor(){
                    this.activeTargetIds = vn;
                }
                Fs(t) {
                    this.activeTargetIds = this.activeTargetIds.add(t);
                }
                Ms(t) {
                    this.activeTargetIds = this.activeTargetIds.delete(t);
                }
                Os() {
                    return JSON.stringify({
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    });
                }
            }
            class Kr {
                constructor(){
                    this.yi = new Ur(), this.pi = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
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
                    return this.yi = new Ur(), Promise.resolve();
                }
                handleUserChange(t, e, n) {}
                setOnlineState(t) {}
                shutdown() {}
                writeSequenceNumber(t) {}
                notifyBundleLoaded() {}
            }
            class jr {
                Ti(t) {}
                shutdown() {}
            }
            class Qr {
                constructor(){
                    this.Ei = ()=>this.Ii(), this.Ai = ()=>this.Ri(), this.bi = [], this.Pi();
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
                    for (const t of ($("ConnectivityMonitor", "Network connectivity changed: AVAILABLE"), this.bi))t(0);
                }
                Ri() {
                    for (const t of ($("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE"), this.bi))t(1);
                }
                static bt() {
                    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
                }
            }
            const Wr = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            class Gr {
                constructor(t){
                    this.vi = t.vi, this.Vi = t.Vi;
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
            class zr extends class {
                constructor(t){
                    this.databaseInfo = t, this.databaseId = t.databaseId;
                    const e = t.ssl ? "https" : "http";
                    this.Fi = e + "://" + t.host, this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
                }
                Li(t, e, n, s) {
                    const i = this.Bi(t, e);
                    $("RestConnection", "Sending: ", i, n);
                    const r = {};
                    return this.Ui(r, s), this.qi(t, i, r, n).then((t)=>($("RestConnection", "Received: ", t), t), (e)=>{
                        throw F("RestConnection", `${t} failed with error: `, e, "url: ", i, "request:", n), e;
                    });
                }
                Ki(t, e, n, s) {
                    return this.Li(t, e, n, s);
                }
                Ui(t, e) {
                    if (t["X-Goog-Api-Client"] = "gl-js/ fire/" + C, t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), e) for(const n in e.authHeaders)e.authHeaders.hasOwnProperty(n) && (t[n] = e.authHeaders[n]);
                }
                Bi(t, e) {
                    const n = Wr[t];
                    return `${this.Fi}/v1/${e}:${n}`;
                }
            } {
                constructor(t){
                    super(t), this.forceLongPolling = t.forceLongPolling, this.autoDetectLongPolling = t.autoDetectLongPolling, this.useFetchStreams = t.useFetchStreams;
                }
                qi(t, e, n, s) {
                    return new Promise((i, r)=>{
                        const o = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.JJ();
                        o.listenOnce(_firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.NO_ERROR:
                                        const e = o.getResponseJson();
                                        $("Connection", "XHR received:", JSON.stringify(e)), i(e);
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.TIMEOUT:
                                        $("Connection", 'RPC "' + t + '" timed out'), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ($("Connection", 'RPC "' + t + '" failed with status:', n, "response text:", o.getResponseText()), n > 0) {
                                            const t = o.getResponseJson().error;
                                            if (t && t.status && t.message) {
                                                const e = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t.status);
                                                r(new j(e, t.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", 'RPC "' + t + '" completed.');
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
                        "/channel"
                    ], s = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.UE)(), i = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.FJ)(), r = {
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
                    this.useFetchStreams && (r.xmlHttpFactory = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.zI({})), this.Ui(r.initMessageHeaders, e), (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.uI)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.b$)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.d)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.w1)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.Mn)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.ru)() || (r.httpHeadersOverwriteParam = "$httpHeaders");
                    const o = n.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s.createWebChannel(o, r);
                    let a = !1, u = !1;
                    const h = new Gr({
                        vi: (t)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t, e, n)=>{
                        t.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t) {
                                setTimeout(()=>{
                                    throw t;
                                }, 0);
                            }
                        });
                    };
                    return g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.OPEN, ()=>{
                        u || $("Connection", "WebChannel transport opened.");
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.CLOSE, ()=>{
                        u || (u = !0, $("Connection", "WebChannel transport closed"), h.$i());
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.ERROR, (t)=>{
                        u || (u = !0, F("Connection", "WebChannel transport errored:", t), h.$i(new j(K.UNAVAILABLE, "The operation could not be completed")));
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.MESSAGE, (t)=>{
                        var e;
                        if (!u) {
                            const n = t.data[0];
                            n || L();
                            const i = n.error || (null === (e = n[0]) || void 0 === e ? void 0 : e.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t = i.status;
                                let e = function(t) {
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t), n = i.message;
                                void 0 === e && (e = K.INTERNAL, n = "Unknown error status: " + t + " with message " + i.message), u = !0, h.$i(new j(e, n)), c.close();
                            } else $("Connection", "WebChannel received:", n), h.Oi(n);
                        }
                    }), g(i, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ju.STAT_EVENT, (t)=>{
                        t.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.kN.PROXY ? $("Connection", "Detected buffering proxy") : t.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.kN.NOPROXY && $("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        h.ki();
                    }, 0), h;
                }
            }
            function Jr() {
                return "undefined" != typeof document ? document : null;
            }
            class Xr {
                constructor(t, e, n = 1e3, s = 1.5, i = 6e4){
                    this.Oe = t, this.timerId = e, this.Qi = n, this.Wi = s, this.Gi = i, this.zi = 0, this.Hi = null, this.Ji = Date.now(), this.reset();
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
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t())), this.zi *= this.Wi, this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
                }
                tr() {
                    null !== this.Hi && (this.Hi.skipDelay(), this.Hi = null);
                }
                cancel() {
                    null !== this.Hi && (this.Hi.cancel(), this.Hi = null);
                }
                Zi() {
                    return (Math.random() - 0.5) * this.zi;
                }
            }
            class Zr {
                constructor(t, e, n, s, i, r, o){
                    this.Oe = t, this.er = n, this.nr = s, this.sr = i, this.credentialsProvider = r, this.listener = o, this.state = 0, this.ir = 0, this.rr = null, this.cr = null, this.stream = null, this.ar = new Xr(t, e);
                }
                ur() {
                    return 1 === this.state || 5 === this.state || this.hr();
                }
                hr() {
                    return 2 === this.state || 3 === this.state;
                }
                start() {
                    4 !== this.state ? this.auth() : this.lr();
                }
                async stop() {
                    this.ur() && await this.close(0);
                }
                dr() {
                    this.state = 0, this.ar.reset();
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
                    this.rr && (this.rr.cancel(), this.rr = null);
                }
                yr() {
                    this.cr && (this.cr.cancel(), this.cr = null);
                }
                async close(t, e) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== t ? this.ar.reset() : e && e.code === K.RESOURCE_EXHAUSTED ? (O(e.toString()), O("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e && e.code === K.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), this.stream = null), this.state = t, await this.listener.Ci(e);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const t = this.Tr(this.ir), e = this.ir;
                    this.credentialsProvider.getToken().then((t)=>{
                        this.ir === e && this.Er(t);
                    }, (e)=>{
                        t(()=>{
                            const t = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t), this.stream.Si(()=>{
                        e(()=>(this.state = 2, this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve())), this.listener.Si()));
                    }), this.stream.Ci((t)=>{
                        e(()=>this.Ir(t));
                    }), this.stream.onMessage((t)=>{
                        e(()=>this.onMessage(t));
                    });
                }
                lr() {
                    this.state = 5, this.ar.Xi(async ()=>{
                        this.state = 0, this.start();
                    });
                }
                Ir(t) {
                    return $("PersistentStream", `close with error: ${t}`), this.stream = null, this.close(4, t);
                }
                Tr(t) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class to extends Zr {
                constructor(t, e, n, s, i){
                    super(t, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, i), this.N = s;
                }
                Ar(t) {
                    return this.sr.ji("Listen", t);
                }
                onMessage(t) {
                    this.ar.reset();
                    const e = function(t, e) {
                        let n;
                        if ("targetChange" in e) {
                            var t1, e1;
                            e.targetChange;
                            const s = "NO_CHANGE" === (t1 = e.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t1 ? 1 : "REMOVE" === t1 ? 2 : "CURRENT" === t1 ? 3 : "RESET" === t1 ? 4 : L(), i = e.targetChange.targetIds || [], r = (e1 = e.targetChange.resumeToken, t.D ? (void 0 === e1 || "string" == typeof e1 || L(), _t.fromBase64String(e1 || "")) : (void 0 === e1 || e1 instanceof Uint8Array || L(), _t.fromUint8Array(e1 || new Uint8Array()))), o = e.targetChange.cause;
                            n = new xn(s, i, r, o && new j(void 0 === o.code ? K.UNKNOWN : dn(o.code), o.message || "") || null);
                        } else if ("documentChange" in e) {
                            e.documentChange;
                            const s = e.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o);
                            n = new Cn(s.targetIds || [], s.removedTargetIds || [], c.key, c);
                        } else if ("documentDelete" in e) {
                            e.documentDelete;
                            const s = e.documentDelete;
                            s.document;
                            const i = zn(t, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r);
                            n = new Cn([], s.removedTargetIds || [], o.key, o);
                        } else if ("documentRemove" in e) {
                            e.documentRemove;
                            const s = e.documentRemove;
                            s.document;
                            const i = zn(t, s.document);
                            n = new Cn([], s.removedTargetIds || [], i, null);
                        } else {
                            if (!("filter" in e)) return L();
                            {
                                e.filter;
                                const t = e.filter;
                                t.targetId;
                                const i = new un(t.count || 0);
                                n = new Nn(t.targetId, i);
                            }
                        }
                        return n;
                    }(this.N, t), n = function(t) {
                        if (!("targetChange" in t)) return rt.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t);
                    return this.listener.Rr(e, n);
                }
                br(t) {
                    const e = {};
                    e.database = Yn(this.N), e.addTarget = function(t, e) {
                        var e1, e2;
                        let n;
                        const s = e.target;
                        return (n = Ht(s) ? {
                            documents: {
                                documents: [
                                    Hn(t, s.path)
                                ]
                            }
                        } : {
                            query: function(t, e) {
                                var e1;
                                const n = {
                                    structuredQuery: {}
                                }, s = e.path;
                                null !== e.collectionGroup ? (n.parent = Hn(t, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n.parent = Hn(t, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t) {
                                    if (0 === t.length) return;
                                    const e = t.map((t)=>(function(t) {
                                            if ("==" === t.op) {
                                                if (Mt(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NAN"
                                                    }
                                                };
                                                if (Ft(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NULL"
                                                    }
                                                };
                                            } else if ("!=" === t.op) {
                                                if (Mt(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NOT_NAN"
                                                    }
                                                };
                                                if (Ft(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NOT_NULL"
                                                    }
                                                };
                                            }
                                            return {
                                                fieldFilter: {
                                                    field: _s(t.field),
                                                    op: Ln[t.op],
                                                    value: t.value
                                                }
                                            };
                                        })(t));
                                    return 1 === e.length ? e[0] : {
                                        compositeFilter: {
                                            op: "AND",
                                            filters: e
                                        }
                                    };
                                }(e.filters);
                                i && (n.structuredQuery.where = i);
                                const r = function(t) {
                                    if (0 !== t.length) return t.map((t)=>({
                                            field: _s(t.field),
                                            direction: Mn[t.dir]
                                        }));
                                }(e.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (e1 = e.limit, t.D || At(e1) ? e1 : {
                                    value: e1
                                });
                                return null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = ls(e.startAt)), e.endAt && (n.structuredQuery.endAt = ls(e.endAt)), n;
                            }(t, s)
                        }).targetId = e.targetId, e.resumeToken.approximateByteSize() > 0 ? n.resumeToken = (e1 = e.resumeToken, t.D ? e1.toBase64() : e1.toUint8Array()) : e.snapshotVersion.compareTo(rt.min()) > 0 && (n.readTime = (e2 = e.snapshotVersion.toTimestamp(), t.D ? `${new Date(1e3 * e2.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e2.nanoseconds).slice(-9)}Z` : {
                            seconds: "" + e2.seconds,
                            nanos: e2.nanoseconds
                        })), n;
                    }(this.N, t);
                    const n = function(t, e) {
                        const n = function(t, e) {
                            switch(e){
                                case 0:
                                    return null;
                                case 1:
                                    return "existence-filter-mismatch";
                                case 2:
                                    return "limbo-document";
                                default:
                                    return L();
                            }
                        }(0, e.purpose);
                        return null == n ? null : {
                            "goog-listen-tags": n
                        };
                    }(this.N, t);
                    n && (e.labels = n), this.mr(e);
                }
                Pr(t) {
                    const e = {};
                    e.database = Yn(this.N), e.removeTarget = t, this.mr(e);
                }
            }
            class no extends class {
            } {
                constructor(t, e, n){
                    super(), this.credentials = t, this.sr = e, this.N = n, this.kr = !1;
                }
                $r() {
                    if (this.kr) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(t, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                Ki(t, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class so {
                constructor(t, e){
                    this.asyncQueue = t, this.onlineStateHandler = e, this.state = "Unknown", this.Or = 0, this.Fr = null, this.Mr = !0;
                }
                Lr() {
                    0 === this.Or && (this.Br("Unknown"), this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, ()=>(this.Fr = null, this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve())));
                }
                qr(t) {
                    "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${t.toString()}`), this.Br("Offline")));
                }
                set(t) {
                    this.Kr(), this.Or = 0, "Online" === t && (this.Mr = !1), this.Br(t);
                }
                Br(t) {
                    t !== this.state && (this.state = t, this.onlineStateHandler(t));
                }
                Ur(t) {
                    const e = `Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (O(e), this.Mr = !1) : $("OnlineStateTracker", e);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), this.Fr = null);
                }
            }
            class io {
                constructor(t, e, n, s, i){
                    this.localStore = t, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, this.jr = [], this.Qr = new Map(), this.Wr = new Set(), this.Gr = [], this.zr = i, this.zr.Ti((t)=>{
                        n.enqueueAndForget(async ()=>{
                            wo(this) && ($("RemoteStore", "Restarting streams for network reachability change."), await async function(t) {
                                t.Wr.add(4), await oo(t), t.Hr.set("Unknown"), t.Wr.delete(4), await ro(t);
                            }(this));
                        });
                    }), this.Hr = new so(n, s);
                }
            }
            async function ro(t) {
                if (wo(t)) for (const e of t.Gr)await e(!0);
            }
            async function oo(t) {
                for (const e of t.Gr)await e(!1);
            }
            function co(t, e) {
                t.Qr.has(e.targetId) || (t.Qr.set(e.targetId, e), fo(t) ? lo(t) : Co(t).hr() && uo(t, e));
            }
            function ao(t, e) {
                const s = Co(t);
                t.Qr.delete(e), s.hr() && ho(t, e), 0 === t.Qr.size && (s.hr() ? s.wr() : wo(t) && t.Hr.set("Unknown"));
            }
            function uo(t, e) {
                t.Jr.Y(e.targetId), Co(t).br(e);
            }
            function ho(t, e) {
                t.Jr.Y(e), Co(t).Pr(e);
            }
            function lo(t) {
                t.Jr = new $n({
                    getRemoteKeysForTarget: (e)=>t.remoteSyncer.getRemoteKeysForTarget(e),
                    Tt: (e)=>t.Qr.get(e) || null
                }), Co(t).start(), t.Hr.Lr();
            }
            function fo(t) {
                return wo(t) && !Co(t).ur() && t.Qr.size > 0;
            }
            function wo(t) {
                return 0 === t.Wr.size;
            }
            async function mo(t) {
                t.Qr.forEach((e, n)=>{
                    uo(t, e);
                });
            }
            async function go(t, e) {
                t.Jr = void 0, fo(t) ? (t.Hr.qr(e), lo(t)) : t.Hr.set("Unknown");
            }
            async function yo(t, e, n) {
                if (t.Hr.set("Online"), e instanceof xn && 2 === e.state && e.cause) try {
                    await async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(t, e);
                } catch (n) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n), await po(t, n);
                }
                else if (e instanceof Cn ? t.Jr.rt(e) : e instanceof Nn ? t.Jr.ft(e) : t.Jr.at(e), !n.isEqual(rt.min())) try {
                    const e = await fr(t.localStore);
                    n.compareTo(e) >= 0 && await function(t, e) {
                        const n = t.Jr._t(e);
                        return n.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const i = t.Qr.get(s);
                                i && t.Qr.set(s, i.withResumeToken(n.resumeToken, e));
                            }
                        }), n.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (!n) return;
                            t.Qr.set(e, n.withResumeToken(_t.EMPTY_BYTE_STRING, n.snapshotVersion)), ho(t, e);
                            const s = new ii(n.target, e, 1, n.sequenceNumber);
                            uo(t, s);
                        }), t.remoteSyncer.applyRemoteEvent(n);
                    }(t, n);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t, e);
                }
            }
            async function po(t, e, n) {
                if (!Hs(e)) throw e;
                t.Wr.add(1), await oo(t), t.Hr.set("Offline"), n || (n = ()=>fr(t.localStore)), t.asyncQueue.enqueueRetryable(async ()=>{
                    $("RemoteStore", "Retrying IndexedDB access"), await n(), t.Wr.delete(1), await ro(t);
                });
            }
            async function Do(t, e) {
                e ? (t.Wr.delete(2), await ro(t)) : e || (t.Wr.add(2), await oo(t), t.Hr.set("Unknown"));
            }
            function Co(t) {
                var t1, e, n;
                return t.Yr || (t.Yr = (t1 = t.datastore, e = t.asyncQueue, n = {
                    Si: mo.bind(null, t),
                    Ci: go.bind(null, t),
                    Rr: yo.bind(null, t)
                }, t1.$r(), new to(e, t1.sr, t1.credentials, t1.N, n)), t.Gr.push(async (e)=>{
                    e ? (t.Yr.dr(), fo(t) ? lo(t) : t.Hr.set("Unknown")) : (await t.Yr.stop(), t.Jr = void 0);
                })), t.Yr;
            }
            class xo {
                constructor(t, e, n, s, i){
                    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new Q(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t)=>{});
                }
                static createAndSchedule(t, e, n, s, i) {
                    const o = new xo(t, e, Date.now() + n, s, i);
                    return o.start(n), o;
                }
                start(t) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), t);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((t)=>this.deferred.resolve(t))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
                }
            }
            function ko(t, e) {
                if (O("AsyncQueue", `${e}: ${t}`), Hs(t)) return new j(K.UNAVAILABLE, `${e}: ${t}`);
                throw t;
            }
            class $o {
                constructor(t){
                    this.comparator = t ? (e, n)=>t(e, n) || Pt.comparator(e.key, n.key) : (t, e)=>Pt.comparator(t.key, e.key), this.keyedMap = En, this.sortedSet = new wn(this.comparator);
                }
                static emptySet(t) {
                    return new $o(t.comparator);
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
                    if (!(t instanceof $o) || this.size !== t.size) return !1;
                    const e = this.sortedSet.getIterator(), n = t.sortedSet.getIterator();
                    for(; e.hasNext();){
                        const t = e.getNext().key, s = n.getNext().key;
                        if (!t.isEqual(s)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const t = [];
                    return this.forEach((e)=>{
                        t.push(e.toString());
                    }), 0 === t.length ? "DocumentSet ()" : "DocumentSet (\n  " + t.join("  \n") + "\n)";
                }
                copy(t, e) {
                    const n = new $o();
                    return n.comparator = this.comparator, n.keyedMap = t, n.sortedSet = e, n;
                }
            }
            class Oo {
                constructor(){
                    this.Zr = new wn(Pt.comparator);
                }
                track(t) {
                    const e = t.doc.key, n = this.Zr.get(e);
                    n ? 0 !== t.type && 3 === n.type ? this.Zr = this.Zr.insert(e, t) : 3 === t.type && 1 !== n.type ? this.Zr = this.Zr.insert(e, {
                        type: n.type,
                        doc: t.doc
                    }) : 2 === t.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t.doc
                    }) : 2 === t.type && 0 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 0,
                        doc: t.doc
                    }) : 1 === t.type && 0 === n.type ? this.Zr = this.Zr.remove(e) : 1 === t.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 1,
                        doc: n.doc
                    }) : 0 === t.type && 1 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t.doc
                    }) : L() : this.Zr = this.Zr.insert(e, t);
                }
                eo() {
                    const t = [];
                    return this.Zr.inorderTraversal((e, n)=>{
                        t.push(n);
                    }), t;
                }
            }
            class Fo {
                constructor(t, e, n, s, i, r, o, c){
                    this.query = t, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = c;
                }
                static fromInitialDocuments(t, e, n, s) {
                    const i = [];
                    return e.forEach((t)=>{
                        i.push({
                            type: 0,
                            doc: t
                        });
                    }), new Fo(t, e, $o.emptySet(e), i, n, s, !0, !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t) {
                    if (!(this.fromCache === t.fromCache && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && Ae(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs))) return !1;
                    const e = this.docChanges, n = t.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let t = 0; t < e.length; t++)if (e[t].type !== n[t].type || !e[t].doc.isEqual(n[t].doc)) return !1;
                    return !0;
                }
            }
            class Mo {
                constructor(){
                    this.no = void 0, this.listeners = [];
                }
            }
            class Lo {
                constructor(){
                    this.queries = new ji((t)=>Re(t), Ae), this.onlineState = "Unknown", this.so = new Set();
                }
            }
            async function Bo(t, e) {
                const s = e.query;
                let i = !1, r = t.queries.get(s);
                if (r || (i = !0, r = new Mo()), i) try {
                    r.no = await t.onListen(s);
                } catch (t) {
                    const n = ko(t, `Initialization of query '${be(e.query)}' failed`);
                    return void e.onError(n);
                }
                t.queries.set(s, r), r.listeners.push(e), e.io(t.onlineState), r.no && e.ro(r.no) && jo(t);
            }
            async function Uo(t, e) {
                const s = e.query;
                let i = !1;
                const r = t.queries.get(s);
                if (r) {
                    const t = r.listeners.indexOf(e);
                    t >= 0 && (r.listeners.splice(t, 1), i = 0 === r.listeners.length);
                }
                if (i) return t.queries.delete(s), t.onUnlisten(s);
            }
            function qo(t, e) {
                let s = !1;
                for (const t1 of e){
                    const e = t1.query, i = t.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t1) && (s = !0);
                        i.no = t1;
                    }
                }
                s && jo(t);
            }
            function Ko(t, e, n) {
                const i = t.queries.get(e);
                if (i) for (const t of i.listeners)t.onError(n);
                t.queries.delete(e);
            }
            function jo(t) {
                t.so.forEach((t)=>{
                    t.next();
                });
            }
            class Qo {
                constructor(t, e, n){
                    this.query = t, this.oo = e, this.co = !1, this.ao = null, this.onlineState = "Unknown", this.options = n || {};
                }
                ro(t) {
                    if (!this.options.includeMetadataChanges) {
                        const e = [];
                        for (const n of t.docChanges)3 !== n.type && e.push(n);
                        t = new Fo(t.query, t.docs, t.oldDocs, e, t.mutatedKeys, t.fromCache, t.syncStateChanged, !0);
                    }
                    let e = !1;
                    return this.co ? this.uo(t) && (this.oo.next(t), e = !0) : this.ho(t, this.onlineState) && (this.lo(t), e = !0), this.ao = t, e;
                }
                onError(t) {
                    this.oo.error(t);
                }
                io(t) {
                    this.onlineState = t;
                    let e = !1;
                    return this.ao && !this.co && this.ho(this.ao, t) && (this.lo(this.ao), e = !0), e;
                }
                ho(t, e) {
                    return !t.fromCache || (!this.options.fo || !("Offline" !== e)) && (!t.docs.isEmpty() || "Offline" === e);
                }
                uo(t) {
                    if (t.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t.hasPendingWrites;
                    return !(!t.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
                }
                lo(t) {
                    t = Fo.fromInitialDocuments(t.query, t.docs, t.mutatedKeys, t.fromCache), this.co = !0, this.oo.next(t);
                }
            }
            class Jo {
                constructor(t){
                    this.key = t;
                }
            }
            class Yo {
                constructor(t){
                    this.key = t;
                }
            }
            class Xo {
                constructor(t, e){
                    this.query = t, this.po = e, this.To = null, this.current = !1, this.Eo = Pn(), this.mutatedKeys = Pn(), this.Io = ve(t), this.Ao = new $o(this.Io);
                }
                get Ro() {
                    return this.po;
                }
                bo(t, e) {
                    const n = e ? e.Po : new Oo(), s = e ? e.Ao : this.Ao;
                    let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    if (t.inorderTraversal((t, e)=>{
                        const u = s.get(t), h = Pe(this.query, e) ? e : null, l = !!u && this.mutatedKeys.has(u.key), f = !!h && (h.hasLocalMutations || this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
                        let d = !1;
                        u && h ? u.data.isEqual(h.data) ? l !== f && (n.track({
                            type: 3,
                            doc: h
                        }), d = !0) : this.vo(u, h) || (n.track({
                            type: 2,
                            doc: h
                        }), d = !0, (c && this.Io(h, c) > 0 || a && 0 > this.Io(h, a)) && (o = !0)) : !u && h ? (n.track({
                            type: 0,
                            doc: h
                        }), d = !0) : u && !h && (n.track({
                            type: 1,
                            doc: u
                        }), d = !0, (c || a) && (o = !0)), d && (h ? (r = r.add(h), i = f ? i.add(t) : i.delete(t)) : (r = r.delete(t), i = i.delete(t)));
                    }), _e(this.query) || me(this.query)) for(; r.size > this.query.limit;){
                        const t = _e(this.query) ? r.last() : r.first();
                        r = r.delete(t.key), i = i.delete(t.key), n.track({
                            type: 1,
                            doc: t
                        });
                    }
                    return {
                        Ao: r,
                        Po: n,
                        Ln: o,
                        mutatedKeys: i
                    };
                }
                vo(t, e) {
                    return t.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
                }
                applyChanges(t, e, n) {
                    const s = this.Ao;
                    this.Ao = t.Ao, this.mutatedKeys = t.mutatedKeys;
                    const i = t.Po.eo();
                    i.sort((t, e)=>(function(t, e) {
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
                                        return L();
                                }
                            };
                            return n(t) - n(e);
                        })(t.type, e.type) || this.Io(t.doc, e.doc)), this.Vo(n);
                    const r = e ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t.Ao, s, i, t.mutatedKeys, 0 === o, c, !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                io(t) {
                    return this.current && "Offline" === t ? (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t) {
                    return !this.po.has(t) && !!this.Ao.has(t) && !this.Ao.get(t).hasLocalMutations;
                }
                Vo(t) {
                    t && (t.addedDocuments.forEach((t)=>this.po = this.po.add(t)), t.modifiedDocuments.forEach((t)=>{}), t.removedDocuments.forEach((t)=>this.po = this.po.delete(t)), this.current = t.current);
                }
                So() {
                    if (!this.current) return [];
                    const t = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    const e = [];
                    return t.forEach((t)=>{
                        this.Eo.has(t) || e.push(new Yo(t));
                    }), this.Eo.forEach((n)=>{
                        t.has(n) || e.push(new Jo(n));
                    }), e;
                }
                No(t) {
                    this.po = t.Gn, this.Eo = Pn();
                    const e = this.bo(t.documents);
                    return this.applyChanges(e, !0);
                }
                xo() {
                    return Fo.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class Zo {
                constructor(t, e, n){
                    this.query = t, this.targetId = e, this.view = n;
                }
            }
            class tc {
                constructor(t){
                    this.key = t, this.ko = !1;
                }
            }
            class ec {
                constructor(t, e, n, s, i, r){
                    this.localStore = t, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.$o = {}, this.Oo = new ji((t)=>Re(t), Ae), this.Fo = new Map(), this.Mo = new Set(), this.Lo = new wn(Pt.comparator), this.Bo = new Map(), this.Uo = new br(), this.qo = {}, this.Ko = new Map(), this.jo = Ni.ie(), this.onlineState = "Unknown", this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function nc(t, e) {
                var t1, e1;
                let s, i;
                const n = (t.remoteStore.remoteSyncer.applyRemoteEvent = oc.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = Ec.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = ac.bind(null, t), t.$o.Rr = qo.bind(null, t.eventManager), t.$o.Go = Ko.bind(null, t.eventManager), t), r = n.Oo.get(e);
                if (r) s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.xo();
                else {
                    const t = await (t1 = n.localStore, e1 = Ee(e), t1.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                        let s;
                        return t1.ze.getTargetData(t, e1).next((i)=>i ? (s = i, js.resolve(s)) : t1.ze.allocateTargetId(t).next((i)=>(s = new ii(e1, i, 0, t.currentSequenceNumber), t1.ze.addTargetData(t, s).next(()=>s))));
                    }).then((t)=>{
                        const s = t1.Un.get(t.targetId);
                        return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (t1.Un = t1.Un.insert(t.targetId, t), t1.qn.set(e1, t.targetId)), t;
                    })), r = n.sharedClientState.addLocalQueryTarget(t.targetId);
                    s = t.targetId, i = await sc(n, e, s, "current" === r), n.isPrimaryClient && co(n.remoteStore, t);
                }
                return i;
            }
            async function sc(t, e, n, s) {
                t.Wo = (e, n, s)=>(async function(t, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && (i = await yr(t.localStore, e.query, !1).then(({ documents: t })=>e.view.bo(t, i)));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, t.isPrimaryClient, r);
                        return mc(t, e.targetId, o.Do), o.snapshot;
                    })(t, e, n, s);
                const i = await yr(t.localStore, e, !0), r = new Xo(e, i.Gn), o = r.bo(i.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n, s && "Offline" !== t.onlineState), a = r.applyChanges(o, t.isPrimaryClient, c);
                mc(t, n, a.Do);
                const u = new Zo(e, n, r);
                return t.Oo.set(e, u), t.Fo.has(n) ? t.Fo.get(n).push(e) : t.Fo.set(n, [
                    e
                ]), a.snapshot;
            }
            async function ic(t, e) {
                const s = t.Oo.get(e), i = t.Fo.get(s.targetId);
                if (i.length > 1) return t.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e))), void t.Oo.delete(e);
                t.isPrimaryClient ? (t.sharedClientState.removeLocalQueryTarget(s.targetId), t.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(t.localStore, s.targetId, !1).then(()=>{
                    t.sharedClientState.clearQueryState(s.targetId), ao(t.remoteStore, s.targetId), wc(t, s.targetId);
                }).catch(Fi)) : (wc(t, s.targetId), await gr(t.localStore, s.targetId, !0));
            }
            async function oc(t, e) {
                try {
                    const t1 = await function(t, e) {
                        const s = e.snapshotVersion;
                        let i = t.Un;
                        return t.persistence.runTransaction("Apply remote event", "readwrite-primary", (t1)=>{
                            var n, i1;
                            let r;
                            const r1 = t.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = t.Un;
                            const o = [];
                            e.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (!c) return;
                                o.push(t.ze.removeMatchingKeys(t1, e.removedDocuments, r).next(()=>t.ze.addMatchingKeys(t1, e.addedDocuments, r)));
                                const a = e.resumeToken;
                                if (a.approximateByteSize() > 0) {
                                    const u = c.withResumeToken(a, s).withSequenceNumber(t1.currentSequenceNumber);
                                    i = i.insert(r, u), u.resumeToken.approximateByteSize() > 0 || L(), (0 === c.resumeToken.approximateByteSize() || u.snapshotVersion.toMicroseconds() - c.snapshotVersion.toMicroseconds() >= 3e8 || e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size > 0) && o.push(t.ze.updateTargetData(t1, u));
                                }
                            });
                            let c = pn;
                            if (e.documentUpdates.forEach((s, i)=>{
                                e.resolvedLimboDocuments.has(s) && o.push(t.persistence.referenceDelegate.updateLimboDocument(t1, s));
                            }), o.push((n = e.documentUpdates, i1 = void 0, r = Pn(), n.forEach((t)=>r = r.add(t)), r1.getEntries(t1, r).next((t)=>{
                                let r = pn;
                                return n.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i1 ? void 0 : i1.get(n)) || s;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (r1.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (r1.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c = t;
                            })), !s.isEqual(rt.min())) {
                                const e = t.ze.getLastRemoteSnapshotVersion(t1).next((e)=>t.ze.setTargetsMetadata(t1, t1.currentSequenceNumber, s));
                                o.push(e);
                            }
                            return js.waitFor(o).next(()=>r1.apply(t1)).next(()=>t.Qn.vn(t1, c)).next(()=>c);
                        }).then((t1)=>(t.Un = i, t1));
                    }(t.localStore, e);
                    e.targetChanges.forEach((t1, e)=>{
                        const s = t.Bo.get(e);
                        s && (t1.addedDocuments.size + t1.modifiedDocuments.size + t1.removedDocuments.size <= 1 || L(), t1.addedDocuments.size > 0 ? s.ko = !0 : t1.modifiedDocuments.size > 0 ? s.ko || L() : t1.removedDocuments.size > 0 && (s.ko || L(), s.ko = !1));
                    }), await pc(t, t1, e);
                } catch (t) {
                    await Fi(t);
                }
            }
            function cc(t, e, n) {
                var t1;
                if (t.isPrimaryClient && 0 === n || !t.isPrimaryClient && 1 === n) {
                    let s;
                    const t2 = [];
                    t.Oo.forEach((n, s)=>{
                        const i = s.view.io(e);
                        i.snapshot && t2.push(i.snapshot);
                    }), (t1 = t.eventManager).onlineState = e, s = !1, t1.queries.forEach((t, n)=>{
                        for (const t of n.listeners)t.io(e) && (s = !0);
                    }), s && jo(t1), t2.length && t.$o.Rr(t2), t.onlineState = e, t.isPrimaryClient && t.sharedClientState.setOnlineState(e);
                }
            }
            async function ac(t, e, n) {
                t.sharedClientState.updateQueryState(e, "rejected", n);
                const i = t.Bo.get(e), r = i && i.key;
                if (r) {
                    let t1 = new wn(Pt.comparator);
                    t1 = t1.insert(r, Kt.newNoDocument(r, rt.min()));
                    const n = Pn().add(r), i = new Sn(rt.min(), new Map(), new gn(et), t1, n);
                    await oc(t, i), t.Lo = t.Lo.remove(r), t.Bo.delete(e), yc(t);
                } else await gr(t.localStore, e, !1).then(()=>wc(t, e, n)).catch(Fi);
            }
            function wc(t, e, n = null) {
                for (const s of (t.sharedClientState.removeLocalQueryTarget(e), t.Fo.get(e)))t.Oo.delete(s), n && t.$o.Go(s, n);
                t.Fo.delete(e), t.isPrimaryClient && t.Uo.cs(e).forEach((e)=>{
                    t.Uo.containsKey(e) || _c(t, e);
                });
            }
            function _c(t, e) {
                t.Mo.delete(e.path.canonicalString());
                const n = t.Lo.get(e);
                null !== n && (ao(t.remoteStore, n), t.Lo = t.Lo.remove(e), t.Bo.delete(n), yc(t));
            }
            function mc(t, e, n) {
                for (const s of n)s instanceof Jo ? (t.Uo.addReference(s.key, e), function(t, e) {
                    const n = e.key, s = n.path.canonicalString();
                    t.Lo.get(n) || t.Mo.has(s) || ($("SyncEngine", "New document in limbo: " + n), t.Mo.add(s), yc(t));
                }(t, s)) : s instanceof Yo ? ($("SyncEngine", "Document no longer in limbo: " + s.key), t.Uo.removeReference(s.key, e), t.Uo.containsKey(s.key) || _c(t, s.key)) : L();
            }
            function yc(t) {
                for(; t.Mo.size > 0 && t.Lo.size < t.maxConcurrentLimboResolutions;){
                    const e = t.Mo.values().next().value;
                    t.Mo.delete(e);
                    const n = new Pt(ht.fromString(e)), s = t.jo.next();
                    t.Bo.set(s, new tc(n)), t.Lo = t.Lo.insert(n, s), co(t.remoteStore, new ii(Ee(new fe(n.path)), s, 2, X.T));
                }
            }
            async function pc(t, e, n) {
                const i = [], r = [], o = [];
                t.Oo.isEmpty() || (t.Oo.forEach((t1, c)=>{
                    o.push(t.Wo(c, e, n).then((t1)=>{
                        if (t1) {
                            t.isPrimaryClient && t.sharedClientState.updateQueryState(c.targetId, t1.fromCache ? "not-current" : "current"), i.push(t1);
                            const e = or.kn(c.targetId, t1);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), t.$o.Rr(i), await async function(t, e) {
                    try {
                        await t.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t1)=>js.forEach(e, (e)=>js.forEach(e.Nn, (s)=>t.persistence.referenceDelegate.addReference(t1, e.targetId, s)).next(()=>js.forEach(e.xn, (s)=>t.persistence.referenceDelegate.removeReference(t1, e.targetId, s)))));
                    } catch (t) {
                        if (!Hs(t)) throw t;
                        $("LocalStore", "Failed to update sequence numbers: " + t);
                    }
                    for (const t1 of e){
                        const e = t1.targetId;
                        if (!t1.fromCache) {
                            const t1 = t.Un.get(e), s = t1.snapshotVersion, i = t1.withLastLimboFreeSnapshotVersion(s);
                            t.Un = t.Un.insert(e, i);
                        }
                    }
                }(t.localStore, r));
            }
            async function Tc(t, e) {
                var e1;
                if (!t.currentUser.isEqual(e)) {
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t1 = await hr(t.localStore, e);
                    t.currentUser = e, e1 = "'waitForPendingWrites' promise is rejected due to a user change.", t.Ko.forEach((t)=>{
                        t.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e1));
                        });
                    }), t.Ko.clear(), t.sharedClientState.handleUserChange(e, t1.removedBatchIds, t1.addedBatchIds), await pc(t, t1.Wn);
                }
            }
            function Ec(t, e) {
                const s = t.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t1 = Pn();
                    const s = t.Fo.get(e);
                    if (!s) return t1;
                    for (const e of s){
                        const s = t.Oo.get(e);
                        t1 = t1.unionWith(s.view.Ro);
                    }
                    return t1;
                }
            }
            class kc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(t) {
                    this.N = new Bn(t.databaseInfo.databaseId, !0), this.sharedClientState = this.Ho(t), this.persistence = this.Jo(t), await this.persistence.start(), this.gcScheduler = this.Yo(t), this.localStore = this.Xo(t);
                }
                Yo(t) {
                    return null;
                }
                Xo(t) {
                    return new ar(this.persistence, new cr(), t.initialUser, this.N);
                }
                Jo(t) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t) {
                    return new Kr();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class Fc {
                async initialize(t, e) {
                    this.localStore || (this.localStore = t.localStore, this.sharedClientState = t.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t)=>cc(this.syncEngine, t, 1), this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t) {
                    return new Lo();
                }
                createDatastore(t) {
                    const e = new Bn(t.databaseInfo.databaseId, !0), n = new zr(t.databaseInfo);
                    return new no(t.credentials, n, e);
                }
                createRemoteStore(t) {
                    return new io(this.localStore, this.datastore, t.asyncQueue, (t)=>cc(this.syncEngine, t, 0), Qr.bt() ? new Qr() : new jr());
                }
                createSyncEngine(t, e) {
                    return function(t, e, n, s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
                }
                terminate() {
                    return async function(t) {
                        $("RemoteStore", "RemoteStore shutting down."), t.Wr.add(5), await oo(t), t.zr.shutdown(), t.Hr.set("Unknown");
                    }(this.remoteStore);
                }
            }
            class Lc {
                constructor(t){
                    this.observer = t, this.muted = !1;
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
            class Kc {
                constructor(t, e, n){
                    this.credentials = t, this.asyncQueue = e, this.databaseInfo = n, this.user = D.UNAUTHENTICATED, this.clientId = tt.I(), this.credentialListener = ()=>Promise.resolve(), this.credentials.start(e, async (t)=>{
                        $("FirestoreClient", "Received user=", t.uid), await this.credentialListener(t), this.user = t;
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
                    if (this.asyncQueue.isShuttingDown) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const t = new Q();
                    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && await this.onlineComponents.terminate(), this.offlineComponents && await this.offlineComponents.terminate(), this.credentials.shutdown(), t.resolve();
                        } catch (e) {
                            const n = ko(e, "Failed to shutdown persistence");
                            t.reject(n);
                        }
                    }), t.promise;
                }
            }
            async function jc(t, e) {
                t.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await hr(e.localStore, t), s = t);
                }), e.persistence.setDatabaseDeletedListener(()=>t.terminate()), t.offlineComponents = e;
            }
            async function Qc(t, e) {
                t.asyncQueue.verifyOperationInProgress();
                const n = await Wc(t);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s = await t.getConfiguration();
                await e.initialize(n, s), t.setCredentialChangeListener((t)=>(async function(t, e) {
                        t.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(t);
                        t.Wr.add(3), await oo(t), s && t.Hr.set("Unknown"), await t.remoteSyncer.handleCredentialChange(e), t.Wr.delete(3), await ro(t);
                    })(e.remoteStore, t)), t.onlineComponents = e;
            }
            async function Wc(t) {
                return t.offlineComponents || ($("FirestoreClient", "Using default OfflineComponentProvider"), await jc(t, new kc())), t.offlineComponents;
            }
            async function Gc(t) {
                return t.onlineComponents || ($("FirestoreClient", "Using default OnlineComponentProvider"), await Qc(t, new Fc())), t.onlineComponents;
            }
            async function Xc(t) {
                const e = await Gc(t), n = e.eventManager;
                return n.onListen = nc.bind(null, e.syncEngine), n.onUnlisten = ic.bind(null, e.syncEngine), n;
            }
            class ua {
                constructor(t, e, n, s, i, r, o, c){
                    this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = c;
                }
            }
            class ha {
                constructor(t, e){
                    this.projectId = t, this.database = e || "(default)";
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(t) {
                    return t instanceof ha && t.projectId === this.projectId && t.database === this.database;
                }
            }
            const la = new Map();
            function _a(t) {
                if (Pt.isDocumentKey(t)) throw new j(K.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
            }
            function ga(t, e) {
                if ("_delegate" in t && (t = t._delegate), !(t instanceof e)) {
                    if (e.name === t.constructor.name) throw new j(K.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n = function(t) {
                            if (void 0 === t) return "undefined";
                            if (null === t) return "null";
                            if ("string" == typeof t) return t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t);
                            if ("number" == typeof t || "boolean" == typeof t) return "" + t;
                            if ("object" == typeof t) {
                                if (t instanceof Array) return "an array";
                                {
                                    var t1;
                                    const e = (t1 = t).constructor ? t1.constructor.name : null;
                                    return e ? `a custom ${e} object` : "an object";
                                }
                            }
                            return "function" == typeof t ? "a function" : L();
                        }(t);
                        throw new j(K.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
                    }
                }
                return t;
            }
            class pa {
                constructor(t){
                    var e;
                    if (void 0 === t.host) {
                        if (void 0 !== t.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
                    if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t.useFetchStreams, function(t, e, n, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
                    }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
                }
                isEqual(t) {
                    return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
                }
            }
            class Ta {
                constructor(t, e){
                    this._credentials = e, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({}), this._settingsFrozen = !1, t instanceof ha ? this._databaseId = t : (this._app = t, this._databaseId = function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new ha(t.options.projectId);
                    }(t));
                }
                get app() {
                    if (!this._app) throw new j(K.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(t) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t), void 0 !== t.credentials && (this._credentials = function(t) {
                        if (!t) return new G();
                        switch(t.type){
                            case "gapi":
                                const e = t.client;
                                return "object" == typeof e && null !== e && e.auth && e.auth.getAuthHeaderValueForFirstParty || L(), new Y(e, t.sessionIndex || "0", t.iamToken || null);
                            case "provider":
                                return t.client;
                            default:
                                throw new j(K.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    }(t.credentials));
                }
                _getSettings() {
                    return this._settings;
                }
                _freezeSettings() {
                    return this._settingsFrozen = !0, this._settings;
                }
                _delete() {
                    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
                }
                toJSON() {
                    return {
                        app: this._app,
                        databaseId: this._databaseId,
                        settings: this._settings
                    };
                }
                _terminate() {
                    return function(t) {
                        const e = la.get(t);
                        e && ($("ComponentProvider", "Removing Datastore"), la.delete(t), e.terminate());
                    }(this), Promise.resolve();
                }
            }
            class Ia {
                constructor(t, e, n){
                    this.converter = e, this._key = n, this.type = "document", this.firestore = t;
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
                    return new Ra(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(t) {
                    return new Ia(this.firestore, t, this._key);
                }
            }
            class Aa {
                constructor(t, e, n){
                    this.converter = e, this._query = n, this.type = "query", this.firestore = t;
                }
                withConverter(t) {
                    return new Aa(this.firestore, t, this._query);
                }
            }
            class Ra extends Aa {
                constructor(t, e, n){
                    super(t, e, new fe(n)), this._path = n, this.type = "collection";
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const t = this._path.popLast();
                    return t.isEmpty() ? null : new Ia(this.firestore, null, new Pt(t));
                }
                withConverter(t) {
                    return new Ra(this.firestore, t, this._path);
                }
            }
            function ba(t, e, ...n) {
                if (t = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.m9)(t), function(t, e, n) {
                    if (!n) throw new j(K.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
                }("collection", "path", e), t instanceof Ta) {
                    const s = ht.fromString(e, ...n);
                    return _a(s), new Ra(t, null, s);
                }
                {
                    if (!(t instanceof Ia || t instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t._path.child(ht.fromString(e, ...n));
                    return _a(s), new Ra(t.firestore, null, s);
                }
            }
            class Da {
                constructor(){
                    this._c = Promise.resolve(), this.mc = [], this.gc = !1, this.yc = [], this.Tc = null, this.Ec = !1, this.Ic = !1, this.Ac = [], this.ar = new Xr(this, "async_queue_retry"), this.Rc = ()=>{
                        const t = Jr();
                        t && $("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                    };
                    const t = Jr();
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
                        this.gc = !0, this.Ic = t || !1;
                        const e = Jr();
                        e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(t) {
                    if (this.bc(), this.gc) return new Promise(()=>{});
                    const e = new Q();
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
                            if (!Hs(t)) throw t;
                            $("AsyncQueue", "Operation failed with retryable error: " + t);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(t) {
                    const e = this._c.then(()=>(this.Ec = !0, t().catch((t)=>{
                            let e;
                            throw this.Tc = t, this.Ec = !1, O("INTERNAL UNHANDLED ERROR: ", (e = t.message || "", t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack), e)), t;
                        }).then((t)=>(this.Ec = !1, t))));
                    return this._c = e, e;
                }
                enqueueAfterDelay(t, e, n) {
                    this.bc(), this.Ac.indexOf(t) > -1 && (e = 0);
                    const s = xo.createAndSchedule(this, t, e, n, (t)=>this.Vc(t));
                    return this.yc.push(s), s;
                }
                bc() {
                    this.Tc && L();
                }
                verifyOperationInProgress() {}
                async Sc() {
                    let t;
                    do t = this._c, await t;
                    while (t !== this._c)
                }
                Dc(t) {
                    for (const e of this.yc)if (e.timerId === t) return !0;
                    return !1;
                }
                Cc(t) {
                    return this.Sc().then(()=>{
                        for (const e of (this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs), this.yc))if (e.skipDelay(), "all" !== t && e.timerId === t) break;
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
            class ka extends Ta {
                constructor(t, e){
                    super(t, e), this.type = "firestore", this._queue = new Da(), this._persistenceKey = "name" in t ? t.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e;
                const n = t._freezeSettings(), s = new ua(t._databaseId, (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, n.host, n.ssl, n.experimentalForceLongPolling, n.experimentalAutoDetectLongPolling, n.useFetchStreams);
                t._firestoreClient = new Kc(t._credentials, t._queue, s);
            }
            class Ja {
                constructor(...t){
                    for(let e = 0; e < t.length; ++e)if (0 === t[e].length) throw new j(K.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new ft(t);
                }
                isEqual(t) {
                    return this._internalPath.isEqual(t._internalPath);
                }
            }
            class Xa {
                constructor(t){
                    this._byteString = t;
                }
                static fromBase64String(t) {
                    try {
                        return new Xa(_t.fromBase64String(t));
                    } catch (t) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
                    }
                }
                static fromUint8Array(t) {
                    return new Xa(_t.fromUint8Array(t));
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
            class tu {
                constructor(t, e){
                    if (!isFinite(t) || t < -90 || t > 90) throw new j(K.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t);
                    if (!isFinite(e) || e < -180 || e > 180) throw new j(K.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
                    this._lat = t, this._long = e;
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
                    return et(this._lat, t._lat) || et(this._long, t._long);
                }
            }
            const Au = RegExp("[~\\*/\\[\\]]");
            function bu(t, e, n, s, i) {
                const r = s && !s.isEmpty(), o = void 0 !== i;
                let c = `Function ${e}() called with invalid data`;
                n && (c += " (via `toFirestore()`)"), c += ". ";
                let a = "";
                return (r || o) && (a += " (found", r && (a += ` in field ${s}`), o && (a += ` in document ${i}`), a += ")"), new j(K.INVALID_ARGUMENT, c + t + a);
            }
            class vu {
                constructor(t, e, n, s, i){
                    this._firestore = t, this._userDataWriter = e, this._key = n, this._document = s, this._converter = i;
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get ref() {
                    return new Ia(this._firestore, this._converter, this._key);
                }
                exists() {
                    return null !== this._document;
                }
                data() {
                    if (this._document) {
                        if (this._converter) {
                            const t = new Vu(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(t) {
                    if (this._document) {
                        const e = this._document.data.field(Su("DocumentSnapshot.get", t));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            class Vu extends vu {
                data() {
                    return super.data();
                }
            }
            function Su(t, e) {
                return "string" == typeof e ? function(t, e, n) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, void 0);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, void 0);
                    }
                }(t, e) : e instanceof Ja ? e._internalPath : e._delegate._internalPath;
            }
            class Du {
                constructor(t, e){
                    this.hasPendingWrites = t, this.fromCache = e;
                }
                isEqual(t) {
                    return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
                }
            }
            class Cu extends vu {
                constructor(t, e, n, s, i, r){
                    super(t, e, n, s, r), this._firestore = t, this._firestoreImpl = t, this.metadata = i;
                }
                exists() {
                    return super.exists();
                }
                data(t = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const e = new Nu(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(e, t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
                    }
                }
                get(t, e = {}) {
                    if (this._document) {
                        const n = this._document.data.field(Su("DocumentSnapshot.get", t));
                        if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
                    }
                }
            }
            class Nu extends Cu {
                data(t = {}) {
                    return super.data(t);
                }
            }
            class xu {
                constructor(t, e, n, s){
                    this._firestore = t, this._userDataWriter = e, this._snapshot = s, this.metadata = new Du(s.hasPendingWrites, s.fromCache), this.query = n;
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
                        t.call(e, new Nu(this._firestore, this._userDataWriter, n.key, n, new Du(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(t = {}) {
                    const e = !!t.includeMetadataChanges;
                    if (e && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = function(t, e) {
                        if (t._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t._firestore, t._userDataWriter, n.doc.key, n.doc, new Du(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                }));
                        }
                        {
                            let n = t._snapshot.oldDocs;
                            return t._snapshot.docChanges.filter((t)=>e || 3 !== t.type).map((e)=>{
                                const s = new Nu(t._firestore, t._userDataWriter, e.doc.key, e.doc, new Du(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: function(t) {
                                        switch(t){
                                            case 0:
                                                return "added";
                                            case 2:
                                            case 3:
                                                return "modified";
                                            case 1:
                                                return "removed";
                                            default:
                                                return L();
                                        }
                                    }(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
                }
            }
            class nh {
                convertValue(t, e = "none") {
                    switch(vt(t)){
                        case 0:
                            return null;
                        case 1:
                            return t.booleanValue;
                        case 2:
                            return yt(t.integerValue || t.doubleValue);
                        case 3:
                            return this.convertTimestamp(t.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(t, e);
                        case 5:
                            return t.stringValue;
                        case 6:
                            return this.convertBytes(pt(t.bytesValue));
                        case 7:
                            return this.convertReference(t.referenceValue);
                        case 8:
                            return this.convertGeoPoint(t.geoPointValue);
                        case 9:
                            return this.convertArray(t.arrayValue, e);
                        case 10:
                            return this.convertObject(t.mapValue, e);
                        default:
                            throw L();
                    }
                }
                convertObject(t, e) {
                    const n = {};
                    return ct(t.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e);
                    }), n;
                }
                convertGeoPoint(t) {
                    return new tu(yt(t.latitude), yt(t.longitude));
                }
                convertArray(t, e) {
                    return (t.values || []).map((t)=>this.convertValue(t, e));
                }
                convertServerTimestamp(t, e) {
                    switch(e){
                        case "previous":
                            const n = function Et(t) {
                                const e = t.mapValue.fields.__previous_value__;
                                return Tt(e) ? Et(e) : e;
                            }(t);
                            return null == n ? null : this.convertValue(n, e);
                        case "estimate":
                            return this.convertTimestamp(It(t));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }
                convertDocumentKey(t, e) {
                    const n = ht.fromString(t);
                    Ts(n) || L();
                    const s = new ha(n.get(1), n.get(3)), i = new Pt(n.popFirst(5));
                    return s.isEqual(e) || O(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
                }
            }
            class ah extends nh {
                constructor(t){
                    super(), this.firestore = t;
                }
                convertBytes(t) {
                    return new Xa(t);
                }
                convertReference(t) {
                    const e = this.convertDocumentKey(t, this.firestore._databaseId);
                    return new Ia(this.firestore, null, e);
                }
            }
            function lh(t) {
                t = ga(t, Aa);
                const e = ga(t.firestore, ka), n = (e._firestoreClient || Ma(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient), s = new ah(e);
                return function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                }(t._query), (function(t, e, n = {}) {
                    const s = new Q();
                    return t.asyncQueue.enqueueAndForget(async ()=>(function(t, e, n, s, i) {
                            const o = new Qo(n, new Lc({
                                next: (n)=>{
                                    e.enqueueAndForget(()=>Uo(t, o)), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t, o);
                        })(await Xc(t), t.asyncQueue, e, n, s)), s.promise;
                })(n, t._query).then((n)=>new xu(e, s, t, n));
            }
            !function(t, e = !0) {
                C = _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Jn, (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Xd)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.wA("firestore", (t, { options: n })=>{
                    const i = new ka(t.getProvider("app").getImmediate(), new H(t.getProvider("auth-internal")));
                    return n = Object.assign({
                        useFetchStreams: e
                    }, n), i._setSettings(n), i;
                }, "PUBLIC")), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", void 0), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", "esm2017");
            }();
        }
    }
]);
