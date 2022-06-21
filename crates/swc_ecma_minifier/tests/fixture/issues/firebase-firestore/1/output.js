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
            var hn, ln, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2238), _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8463), _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3333), _firebase_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4444), _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3510), process = __webpack_require__(4155);
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
                var e;
                if ("string" == typeof t) return t;
                try {
                    return e = t, JSON.stringify(e);
                } catch (e1) {
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
            function Z(t) {
                const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
                if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                else for(let e1 = 0; e1 < t; e1++)n[e1] = Math.floor(256 * Math.random());
                return n;
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function nt(t, e, n) {
                return t.length === e.length && t.every((t, s)=>n(t, e[s]));
            }
            X.T = -1;
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
                    const e = Math.floor(t / 1e3);
                    return new it(e, Math.floor(1e6 * (t - 1e3 * e)));
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
                    const t = this.seconds - -62135596800;
                    return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
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
            function at(t) {
                for(const e in t)if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
                return !0;
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
                        const n1 = t.get(s), i = e.get(s);
                        if (n1 < i) return -1;
                        if (n1 > i) return 1;
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
                        const e1 = t[s];
                        if ("\\" === e1) {
                            if (s + 1 === t.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
                            const e2 = t[s + 1];
                            if ("\\" !== e2 && "." !== e2 && "`" !== e2) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
                            n += e2, s += 2;
                        } else "`" === e1 ? (r = !r, s++) : "." !== e1 || r ? (n += e1, s++) : (i(), s++);
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
                    return new ft(e);
                }
                static emptyPath() {
                    return new ft([]);
                }
            }
            class dt {
                constructor(t){
                    this.fields = t, t.sort(ft.comparator);
                }
                covers(t) {
                    for (const e of this.fields)if (e.isPrefixOf(t)) return !0;
                    return !1;
                }
                isEqual(t) {
                    return nt(this.fields, t.fields, (t, e)=>t.isEqual(e));
                }
            }
            class _t {
                constructor(t){
                    this.binaryString = t;
                }
                static fromBase64String(t) {
                    const e = atob(t);
                    return new _t(e);
                }
                static fromUint8Array(t) {
                    const e = function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(t);
                    return new _t(e);
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
            const mt = RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function gt(t) {
                if (t || L(), "string" == typeof t) {
                    let e = 0;
                    const n = mt.exec(t);
                    if (n || L(), n[1]) {
                        let t1 = n[1];
                        e = Number(t1 = (t1 + "000000000").substr(0, 9));
                    }
                    const s = new Date(t);
                    return {
                        seconds: Math.floor(s.getTime() / 1e3),
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
            function Et(t) {
                const e = t.mapValue.fields.__previous_value__;
                return Tt(e) ? Et(e) : e;
            }
            function It(t) {
                const e = gt(t.mapValue.fields.__local_write_time__.timestampValue);
                return new it(e.seconds, e.nanos);
            }
            function Rt(t) {
                return 0 === t && 1 / t == -1 / 0;
            }
            function bt(t) {
                return "number" == typeof t && Number.isInteger(t) && !Rt(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
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
                var t1, e1, t2, e2;
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
                        return t1 = t, e1 = e, pt(t1.bytesValue).isEqual(pt(e1.bytesValue));
                    case 7:
                        return t.referenceValue === e.referenceValue;
                    case 8:
                        return t2 = t, e2 = e, yt(t2.geoPointValue.latitude) === yt(e2.geoPointValue.latitude) && yt(t2.geoPointValue.longitude) === yt(e2.geoPointValue.longitude);
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
                            for(const t1 in n)if (n.hasOwnProperty(t1) && (void 0 === s[t1] || !Vt(n[t1], s[t1]))) return !1;
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
                            for(let t1 = 0; t1 < n.length && t1 < s.length; t1++){
                                const e1 = et(n[t1], s[t1]);
                                if (0 !== e1) return e1;
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
                            for(let t1 = 0; t1 < n.length && t1 < s.length; ++t1){
                                const e1 = Dt(n[t1], s[t1]);
                                if (e1) return e1;
                            }
                            return et(n.length, s.length);
                        }(t.arrayValue, e.arrayValue);
                    case 10:
                        return function(t, e) {
                            const n = t.fields || {}, s = Object.keys(n), i = e.fields || {}, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t1 = 0; t1 < s.length && t1 < r.length; ++t1){
                                const e1 = et(s[t1], r[t1]);
                                if (0 !== e1) return e1;
                                const o = Dt(n[s[t1]], i[r[t1]]);
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
            function Nt(t) {
                return xt(t);
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
                    const e1 = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let n = 0; n < (t.arrayValue.values || []).length; ++n)e1.arrayValue.values[n] = Bt(t.arrayValue.values[n]);
                    return e1;
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
                            const t1 = this.getFieldsMap(e);
                            this.applyChanges(t1, n, s), n = {}, s = [], e = i.popLast();
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
                var t1;
                const e = t;
                if (null === e.A) {
                    let t2 = e.path.canonicalString();
                    null !== e.collectionGroup && (t2 += "|cg:" + e.collectionGroup), t2 += "|f:", t2 += e.filters.map((t)=>Yt(t)).join(","), t2 += "|ob:", t2 += e.orderBy.map((t)=>{
                        var t1;
                        return (t1 = t).field.canonicalString() + t1.dir;
                    }).join(","), t1 = e.limit, null == t1 || (t2 += "|l:", t2 += e.limit), e.startAt && (t2 += "|lb:", t2 += ce(e.startAt)), e.endAt && (t2 += "|ub:", t2 += ce(e.endAt)), e.A = t2;
                }
                return e.A;
            }
            function zt(t, e) {
                var n, s;
                if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1;
                for(let n1 = 0; n1 < t.orderBy.length; n1++)if (!ue(t.orderBy[n1], e.orderBy[n1])) return !1;
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
                        "not-in", 
                    ].indexOf(this.op) >= 0;
                }
            }
            function Yt(t) {
                return t.field.canonicalString() + t.op.toString() + Nt(t.value);
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
                return `${t.before ? "b" : "a"}:${t.position.map((t)=>Nt(t)).join(",")}`;
            }
            class ae {
                constructor(t, e = "asc"){
                    this.field = t, this.dir = e;
                }
            }
            function ue(t, e) {
                return t.dir === e.dir && t.field.isEqual(e.field);
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
            function we(t) {
                return new fe(t);
            }
            function _e(t) {
                return null != t.limit && "F" === t.limitType;
            }
            function me(t) {
                return null != t.limit && "L" === t.limitType;
            }
            function Te(t) {
                var t1;
                const e = t;
                if (null === e.V) {
                    e.V = [];
                    const t2 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(e), n = (t1 = e).explicitOrderBy.length > 0 ? t1.explicitOrderBy[0].field : null;
                    if (null !== t2 && null === n) t2.isKeyField() || e.V.push(new ae(t2)), e.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t3 = !1;
                        for (const n1 of e.explicitOrderBy)e.V.push(n1), n1.field.isKeyField() && (t3 = !0);
                        if (!t3) {
                            const t4 = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
                            e.V.push(new ae(ft.keyField(), t4));
                        }
                    }
                }
                return e.V;
            }
            function Ee(t) {
                const e = t;
                if (!e.S) {
                    if ("F" === e.limitType) e.S = Qt(e.path, e.collectionGroup, Te(e), e.filters, e.limit, e.startAt, e.endAt);
                    else {
                        const t1 = [];
                        for (const n of Te(e)){
                            const e1 = "desc" === n.dir ? "asc" : "desc";
                            t1.push(new ae(n.field, e1));
                        }
                        const n1 = e.endAt ? new oe(e.endAt.position, !e.endAt.before) : null, s = e.startAt ? new oe(e.startAt.position, !e.startAt.before) : null;
                        e.S = Qt(e.path, e.collectionGroup, t1, e.filters, e.limit, n1, s);
                    }
                }
                return e.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t) {
                var t1, t2;
                let e;
                return `Query(target=${e = (t1 = Ee(t)).path.canonicalString(), null !== t1.collectionGroup && (e += " collectionGroup=" + t1.collectionGroup), t1.filters.length > 0 && (e += `, filters: [${t1.filters.map((t)=>{
                    var e;
                    return `${(e = t).field.canonicalString()} ${e.op} ${Nt(e.value)}`;
                }).join(", ")}]`), t2 = t1.limit, null == t2 || (e += ", limit: " + t1.limit), t1.orderBy.length > 0 && (e += `, orderBy: [${t1.orderBy.map((t)=>{
                    var t1;
                    return t1 = t, `${t1.field.canonicalString()} (${t1.dir})`;
                }).join(", ")}]`), t1.startAt && (e += ", startAt: " + ce(t1.startAt)), t1.endAt && (e += ", endAt: " + ce(t1.endAt)), `Target(${e})`}; limitType=${t.limitType})`;
            }
            function Pe(t, e) {
                var t1, e1;
                return e.isFoundDocument() && function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                }(t, e) && function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                }(t, e) && function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                }(t, e) && (t1 = t, e1 = e, !(t1.startAt && !he(t1.startAt, Te(t1), e1) || t1.endAt && he(t1.endAt, Te(t1), e1)));
            }
            function ve(t) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t)){
                        const t1 = Ve(i, e, n);
                        if (0 !== t1) return t1;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            function Ve(t, e, n) {
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
            }
            function Se(t, e) {
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
            }
            function De(t) {
                return {
                    integerValue: "" + t
                };
            }
            class Ne {
                constructor(){
                    this._ = void 0;
                }
            }
            function xe(t, e, n) {
                return t instanceof Oe ? function(t, e) {
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
                }(n, e) : t instanceof Fe ? Me(t, e) : t instanceof Le ? Be(t, e) : function(t, e) {
                    const n = $e(t, e), s = qe(n) + qe(t.C);
                    return $t(n) && $t(t.C) ? De(s) : Se(t.N, s);
                }(t, e);
            }
            function ke(t, e, n) {
                return t instanceof Fe ? Me(t, e) : t instanceof Le ? Be(t, e) : n;
            }
            function $e(t, e) {
                var n, t1;
                return t instanceof Ue ? $t(n = e) || (t1 = n) && "doubleValue" in t1 ? e : {
                    integerValue: 0
                } : null;
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
                for (const e1 of t.elements)n.some((t)=>Vt(t, e1)) || n.push(e1);
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
                for (const e1 of t.elements)n = n.filter((t)=>!Vt(t, e1));
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
            class je {
                constructor(t, e){
                    this.field = t, this.transform = e;
                }
            }
            class We {
                constructor(t, e){
                    this.version = t, this.transformResults = e;
                }
            }
            class Ge {
                constructor(t, e){
                    this.updateTime = t, this.exists = e;
                }
                static none() {
                    return new Ge();
                }
                static exists(t) {
                    return new Ge(void 0, t);
                }
                static updateTime(t) {
                    return new Ge(t);
                }
                get isNone() {
                    return void 0 === this.updateTime && void 0 === this.exists;
                }
                isEqual(t) {
                    return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
                }
            }
            function ze(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            class He {
            }
            function Je(t, e, n) {
                t instanceof en ? function(t, e, n) {
                    const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                    s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                }(t, e, n) : t instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                    const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                }(t, e, n) : function(t, e, n) {
                    e.convertToNoDocument(n.version).setHasCommittedMutations();
                }(0, e, n);
            }
            function Ye(t, e, n) {
                var t1, e1;
                t instanceof en ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                    s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                }(t, e, n) : t instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = on(t.fieldTransforms, n, e), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                }(t, e, n) : (t1 = t, e1 = e, ze(t1.precondition, e1) && e1.convertToNoDocument(rt.min()));
            }
            function Ze(t, e) {
                var t1, e1;
                return t.type === e.type && !!t.key.isEqual(e.key) && !!t.precondition.isEqual(e.precondition) && (t1 = t.fieldTransforms, e1 = e.fieldTransforms, !!(void 0 === t1 && void 0 === e1 || !(!t1 || !e1) && nt(t1, e1, (t, e)=>{
                    var t1, e1, t2, e2;
                    return t1 = t, e1 = e, t1.field.isEqual(e1.field) && (t2 = t1.transform, e2 = e1.transform, t2 instanceof Fe && e2 instanceof Fe || t2 instanceof Le && e2 instanceof Le ? nt(t2.elements, e2.elements, Vt) : t2 instanceof Ue && e2 instanceof Ue ? Vt(t2.C, e2.C) : t2 instanceof Oe && e2 instanceof Oe);
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
                const s = new Map();
                t.length === n.length || L();
                for(let i = 0; i < n.length; i++){
                    const r = t[i], o = r.transform, c = e.data.field(r.field);
                    s.set(r.field, ke(o, c, n[i]));
                }
                return s;
            }
            function on(t, e, n) {
                const s = new Map();
                for (const i of t){
                    const t1 = i.transform, r = n.data.field(i.field);
                    s.set(i.field, xe(t1, r, e));
                }
                return s;
            }
            class cn extends null {
                constructor(t, e){
                    super(), this.key = t, this.precondition = e, this.type = 2, this.fieldTransforms = [];
                }
            }
            class an extends null {
                constructor(t, e){
                    super(), this.key = t, this.precondition = e, this.type = 3, this.fieldTransforms = [];
                }
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
            (ln = hn || (hn = {}))[ln.OK = 0] = "OK", ln[ln.CANCELLED = 1] = "CANCELLED", ln[ln.UNKNOWN = 2] = "UNKNOWN", ln[ln.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ln[ln.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ln[ln.NOT_FOUND = 5] = "NOT_FOUND", ln[ln.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ln[ln.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ln[ln.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ln[ln.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ln[ln.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ln[ln.ABORTED = 10] = "ABORTED", ln[ln.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ln[ln.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ln[ln.INTERNAL = 13] = "INTERNAL", ln[ln.UNAVAILABLE = 14] = "UNAVAILABLE", ln[ln.DATA_LOSS = 15] = "DATA_LOSS";
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
                    const t = this.check();
                    return Math.pow(2, t) <= this.size + 1;
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
                        const t1 = e.getNext().key, s = n.getNext().key;
                        if (0 !== this.comparator(t1, s)) return !1;
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
            const pn = new wn(Pt.comparator), En = new wn(Pt.comparator), An = new wn(Pt.comparator), bn = new gn(Pt.comparator);
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
                    for (const e1 of t.removedTargetIds)this.ct(e1, t.key, t.$);
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
                        const t1 = s.target;
                        if (Ht(t1)) {
                            if (0 === n) {
                                const n1 = new Pt(t1.path);
                                this.ct(e, n1, Kt.newNoDocument(n1, rt.min()));
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
                                const e1 = new Pt(i.target.path);
                                null !== this.nt.get(e1) || this.gt(s, e1) || this.ct(s, e1, Kt.newNoDocument(e1, t));
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
            function Un(t, e) {
                return t.D ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z` : {
                    seconds: "" + e.seconds,
                    nanos: e.nanoseconds
                };
            }
            function qn(t, e) {
                return t.D ? e.toBase64() : e.toUint8Array();
            }
            function jn(t) {
                return t || L(), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t));
            }
            function Qn(t, e) {
                var t1;
                return (t1 = t, new ht([
                    "projects",
                    t1.projectId,
                    "databases",
                    t1.database, 
                ])).child("documents").child(e).canonicalString();
            }
            function Wn(t) {
                const e = ht.fromString(t);
                return Ts(e) || L(), e;
            }
            function Gn(t, e) {
                return Qn(t.databaseId, e.path);
            }
            function zn(t, e) {
                const n = Wn(e);
                if (n.get(1) !== t.databaseId.projectId) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
                if (n.get(3) !== t.databaseId.database) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
                return new Pt(Xn(n));
            }
            function Hn(t, e) {
                return Qn(t.databaseId, e);
            }
            function Yn(t) {
                return new ht([
                    "projects",
                    t.databaseId.projectId,
                    "databases",
                    t.databaseId.database, 
                ]).canonicalString();
            }
            function Xn(t) {
                return t.length > 4 && "documents" === t.get(4) || L(), t.popFirst(5);
            }
            function Zn(t, e, n) {
                return {
                    name: Gn(t, e),
                    fields: n.value.mapValue.fields
                };
            }
            function ss(t, e) {
                var t1, e1;
                let n;
                if (e instanceof en) n = {
                    update: Zn(t, e.key, e.value)
                };
                else if (e instanceof cn) n = {
                    delete: Gn(t, e.key)
                };
                else if (e instanceof nn) n = {
                    update: Zn(t, e.key, e.data),
                    updateMask: ps(e.fieldMask)
                };
                else {
                    if (!(e instanceof an)) return L();
                    n = {
                        verify: Gn(t, e.key)
                    };
                }
                return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t)=>(function(t, e) {
                        const n = e.transform;
                        if (n instanceof Oe) return {
                            fieldPath: e.field.canonicalString(),
                            setToServerValue: "REQUEST_TIME"
                        };
                        if (n instanceof Fe) return {
                            fieldPath: e.field.canonicalString(),
                            appendMissingElements: {
                                values: n.elements
                            }
                        };
                        if (n instanceof Le) return {
                            fieldPath: e.field.canonicalString(),
                            removeAllFromArray: {
                                values: n.elements
                            }
                        };
                        if (n instanceof Ue) return {
                            fieldPath: e.field.canonicalString(),
                            increment: n.C
                        };
                        throw L();
                    })(0, t))), e.precondition.isNone || (n.currentDocument = (t1 = t, void 0 !== (e1 = e.precondition).updateTime ? {
                    updateTime: Un(t1, (0, e1.updateTime).toTimestamp())
                } : void 0 !== e1.exists ? {
                    exists: e1.exists
                } : L())), n;
            }
            function is(t, e) {
                var t1;
                const n = e.currentDocument ? void 0 !== (t1 = e.currentDocument).updateTime ? Ge.updateTime(jn(t1.updateTime)) : void 0 !== t1.exists ? Ge.exists(t1.exists) : Ge.none() : Ge.none(), s = e.updateTransforms ? e.updateTransforms.map((e)=>(function(t, e) {
                        let n = null;
                        if ("setToServerValue" in e) "REQUEST_TIME" === e.setToServerValue || L(), n = new Oe();
                        else if ("appendMissingElements" in e) {
                            const t1 = e.appendMissingElements.values || [];
                            n = new Fe(t1);
                        } else if ("removeAllFromArray" in e) {
                            const t2 = e.removeAllFromArray.values || [];
                            n = new Le(t2);
                        } else "increment" in e ? n = new Ue(t, e.increment) : L();
                        const s = ft.fromServerFormat(e.fieldPath);
                        return new je(s, n);
                    })(t, e)) : [];
                if (e.update) {
                    e.update.name;
                    const i = zn(t, e.update.name), r = new Ut({
                        mapValue: {
                            fields: e.update.fields
                        }
                    });
                    if (e.updateMask) {
                        const t2 = function(t) {
                            const e = t.fieldPaths || [];
                            return new dt(e.map((t)=>ft.fromServerFormat(t)));
                        }(e.updateMask);
                        return new nn(i, r, t2, n, s);
                    }
                    return new en(i, r, n, s);
                }
                if (e.delete) {
                    const s1 = zn(t, e.delete);
                    return new cn(s1, n);
                }
                if (e.verify) {
                    const s2 = zn(t, e.verify);
                    return new an(s2, n);
                }
                return L();
            }
            function hs(t) {
                return t ? void 0 !== t.unaryFilter ? [
                    ys(t)
                ] : void 0 !== t.fieldFilter ? [
                    gs(t)
                ] : void 0 !== t.compositeFilter ? t.compositeFilter.filters.map((t)=>hs(t)).reduce((t, e)=>t.concat(e)) : L() : [];
            }
            function ls(t) {
                return {
                    before: t.before,
                    values: t.position
                };
            }
            function fs(t) {
                const e = !!t.before, n = t.values || [];
                return new oe(n, e);
            }
            function _s(t) {
                return {
                    fieldPath: t.canonicalString()
                };
            }
            function ms(t) {
                return ft.fromServerFormat(t.fieldPath);
            }
            function gs(t) {
                return Jt.create(ms(t.fieldFilter.field), function(t) {
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
                }(t.fieldFilter.op), t.fieldFilter.value);
            }
            function ys(t) {
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
            }
            function ps(t) {
                const e = [];
                return t.fields.forEach((t)=>e.push(t.canonicalString())), {
                    fieldPaths: e
                };
            }
            function Ts(t) {
                return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
            }
            function Es(t) {
                let e = "";
                for(let n = 0; n < t.length; n++)e.length > 0 && (e += ""), e = Is(t.get(n), e);
                return e + "";
            }
            function Is(t, e) {
                let n = e;
                const s = t.length;
                for(let e1 = 0; e1 < s; e1++){
                    const s1 = t.charAt(e1);
                    switch(s1){
                        case "\0":
                            n += "";
                            break;
                        case "":
                            n += "";
                            break;
                        default:
                            n += s1;
                    }
                }
                return n;
            }
            function Rs(t) {
                const e = t.length;
                if (e >= 2 || L(), 2 === e) return "" === t.charAt(0) && "" === t.charAt(1) || L(), ht.emptyPath();
                const n = e - 2, s = [];
                let i = "";
                for(let r = 0; r < e;){
                    const e1 = t.indexOf("", r);
                    switch((e1 < 0 || e1 > n) && L(), t.charAt(e1 + 1)){
                        case "":
                            const n1 = t.substring(r, e1);
                            let o;
                            0 === i.length ? o = n1 : (i += n1, o = i, i = ""), s.push(o);
                            break;
                        case "":
                            i += t.substring(r, e1), i += "\0";
                            break;
                        case "":
                            i += t.substring(r, e1 + 1);
                            break;
                        default:
                            L();
                    }
                    r = e1 + 2;
                }
                return new ht(s);
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
                "readTime", 
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
                    } catch (t1) {
                        return js.reject(t1);
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
            class Qs {
                constructor(t, e){
                    this.action = t, this.transaction = e, this.aborted = !1, this.Et = new Q(), this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }, this.transaction.onabort = ()=>{
                        e.error ? this.Et.reject(new zs(t, e.error)) : this.Et.resolve();
                    }, this.transaction.onerror = (e)=>{
                        const n = Zs(e.target.error);
                        this.Et.reject(new zs(t, n));
                    };
                }
                static open(t, e, n, s) {
                    try {
                        return new Qs(e, t.transaction(s, n));
                    } catch (t1) {
                        throw new zs(e, t1);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(t) {
                    t && this.Et.reject(t), this.aborted || ($("SimpleDb", "Aborting transaction:", t ? t.message : "Client-initiated abort"), this.aborted = !0, this.transaction.abort());
                }
                store(t) {
                    const e = this.transaction.objectStore(t);
                    return new Js(e);
                }
            }
            class Ws {
                constructor(t, e, n){
                    this.name = t, this.version = e, this.At = n, 12.2 === Ws.Rt(getUA()) && O("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(t) {
                    return $("SimpleDb", "Removing database:", t), Ys(window.indexedDB.deleteDatabase(t)).toPromise();
                }
                static bt() {
                    if (!isIndexedDBAvailable()) return !1;
                    if (Ws.Pt()) return !0;
                    const t = getUA(), e = Ws.Rt(t), n = 0 < e && e < 10, s = Ws.vt(t), i = 0 < s && s < 4.5;
                    return !(t.indexOf("MSIE ") > 0 || t.indexOf("Trident/") > 0 || t.indexOf("Edge/") > 0 || n || i);
                }
                static Pt() {
                    var t;
                    return void 0 !== process && "YES" === (null === (t = process.env) || void 0 === t ? void 0 : t.Vt);
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
                    return this.db || ($("SimpleDb", "Opening database:", this.name), this.db = await new Promise((e, n)=>{
                        const s = indexedDB.open(this.name, this.version);
                        s.onsuccess = (t)=>{
                            const n = t.target.result;
                            e(n);
                        }, s.onblocked = ()=>{
                            n(new zs(t, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }, s.onerror = (e)=>{
                            const s = e.target.error;
                            "VersionError" === s.name ? n(new j(K.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n(new j(K.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n(new zs(t, s));
                        }, s.onupgradeneeded = (t)=>{
                            $("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', t.oldVersion);
                            const e = t.target.result;
                            this.At.Ct(e, s.transaction, t.oldVersion, this.version).next(()=>{
                                $("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        };
                    })), this.Nt && (this.db.onversionchange = (t)=>this.Nt(t)), this.db;
                }
                xt(t) {
                    this.Nt = t, this.db && (this.db.onversionchange = (e)=>t(e));
                }
                async runTransaction(t, e, n, s) {
                    const i = "readonly" === e;
                    let r = 0;
                    for(;;){
                        ++r;
                        try {
                            this.db = await this.Dt(t);
                            const e1 = Qs.open(this.db, t, i ? "readonly" : "readwrite", n), r1 = s(e1).catch((t)=>(e1.abort(t), js.reject(t))).toPromise();
                            return r1.catch(()=>{}), await e1.It, r1;
                        } catch (t1) {
                            const e2 = "FirebaseError" !== t1.name && r < 3;
                            if ($("SimpleDb", "Transaction failed with error:", t1.message, "Retrying:", e2), this.close(), !e2) return Promise.reject(t1);
                        }
                    }
                }
                close() {
                    this.db && this.db.close(), this.db = void 0;
                }
            }
            class Gs {
                constructor(t){
                    this.kt = t, this.$t = !1, this.Ot = null;
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
                    return Ys(this.kt.delete());
                }
            }
            class zs extends null {
                constructor(t, e){
                    super(K.UNAVAILABLE, `IndexedDB transaction '${t}' failed: ${e}`), this.name = "IndexedDbTransactionError";
                }
            }
            function Hs(t) {
                return "IndexedDbTransactionError" === t.name;
            }
            class Js {
                constructor(t){
                    this.store = t;
                }
                put(t, e) {
                    let n;
                    return void 0 !== e ? ($("SimpleDb", "PUT", this.store.name, t, e), n = this.store.put(e, t)) : ($("SimpleDb", "PUT", this.store.name, "<auto-key>", t), n = this.store.put(t)), Ys(n);
                }
                add(t) {
                    return $("SimpleDb", "ADD", this.store.name, t, t), Ys(this.store.add(t));
                }
                get(t) {
                    return Ys(this.store.get(t)).next((e)=>(void 0 === e && (e = null), $("SimpleDb", "GET", this.store.name, t, e), e));
                }
                delete(t) {
                    return $("SimpleDb", "DELETE", this.store.name, t), Ys(this.store.delete(t));
                }
                count() {
                    return $("SimpleDb", "COUNT", this.store.name), Ys(this.store.count());
                }
                Lt(t, e) {
                    const n = this.cursor(this.options(t, e)), s = [];
                    return this.Bt(n, (t, e)=>{
                        s.push(e);
                    }).next(()=>s);
                }
                Ut(t, e) {
                    $("SimpleDb", "DELETE ALL", this.store.name);
                    const n = this.options(t, e);
                    n.qt = !1;
                    const s = this.cursor(n);
                    return this.Bt(s, (t, e, n)=>n.delete());
                }
                Kt(t, e) {
                    let n;
                    e ? n = t : (n = {}, e = t);
                    const s = this.cursor(n);
                    return this.Bt(s, e);
                }
                jt(t) {
                    const e = this.cursor({});
                    return new js((n, s)=>{
                        e.onerror = (t)=>{
                            const e = Zs(t.target.error);
                            s(e);
                        }, e.onsuccess = (e)=>{
                            const s = e.target.result;
                            s ? t(s.primaryKey, s.value).next((t)=>{
                                t ? s.continue() : n();
                            }) : n();
                        };
                    });
                }
                Bt(t, e) {
                    const n = [];
                    return new js((s, i)=>{
                        t.onerror = (t)=>{
                            i(t.target.error);
                        }, t.onsuccess = (t)=>{
                            const i = t.target.result;
                            if (!i) return void s();
                            const r = new Gs(i), o = e(i.primaryKey, i.value, r);
                            if (o instanceof js) {
                                const t1 = o.catch((t)=>(r.done(), js.reject(t)));
                                n.push(t1);
                            }
                            r.isDone ? s() : null === r.Ft ? i.continue() : i.continue(r.Ft);
                        };
                    }).next(()=>js.waitFor(n));
                }
                options(t, e) {
                    let n;
                    return void 0 !== t && ("string" == typeof t ? n = t : e = t), {
                        index: n,
                        range: e
                    };
                }
                cursor(t) {
                    let e = "next";
                    if (t.reverse && (e = "prev"), t.index) {
                        const n = this.store.index(t.index);
                        return t.qt ? n.openKeyCursor(t.range, e) : n.openCursor(t.range, e);
                    }
                    return this.store.openCursor(t.range, e);
                }
            }
            function Ys(t) {
                return new js((e, n)=>{
                    t.onsuccess = (t)=>{
                        const n = t.target.result;
                        e(n);
                    }, t.onerror = (t)=>{
                        const e = Zs(t.target.error);
                        n(e);
                    };
                });
            }
            let Xs = null;
            function Zs(t) {
                const e = Ws.Rt(getUA());
                if (e >= 12.2 && e < 13) {
                    const e1 = "An internal error was encountered in the Indexed Database server";
                    if (t.message.indexOf(e1) >= 0) {
                        const t1 = new j("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e1}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return Xs || (Xs = !0, setTimeout(()=>{
                            throw t1;
                        }, 0)), t1;
                    }
                }
                return t;
            }
            function ei(t, e) {
                return Ws.St(t.Qt, e);
            }
            class ni {
                constructor(t, e, n, s){
                    this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
                }
                applyToRemoteDocument(t, e) {
                    const n = e.mutationResults;
                    for(let e1 = 0; e1 < this.mutations.length; e1++){
                        const s = this.mutations[e1];
                        s.key.isEqual(t.key) && Je(s, t, n[e1]);
                    }
                }
                applyToLocalView(t) {
                    for (const e of this.baseMutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                    for (const e1 of this.mutations)e1.key.isEqual(t.key) && Ye(e1, t, this.localWriteTime);
                }
                applyToLocalDocumentSet(t) {
                    this.mutations.forEach((e)=>{
                        const n = t.get(e.key), s = n;
                        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key), Pn());
                }
                isEqual(t) {
                    return this.batchId === t.batchId && nt(this.mutations, t.mutations, (t, e)=>Ze(t, e)) && nt(this.baseMutations, t.baseMutations, (t, e)=>Ze(t, e));
                }
            }
            class si {
                constructor(t, e, n, s){
                    this.batch = t, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
                }
                static from(t, e, n) {
                    t.mutations.length === n.length || L();
                    let s = An;
                    const i = t.mutations;
                    for(let t1 = 0; t1 < i.length; t1++)s = s.insert(i[t1].key, n[t1].version);
                    return new si(t, e, n, s);
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
            function fi(t, e) {
                const n = (e.baseMutations || []).map((e)=>is(t.Wt, e));
                for(let t1 = 0; t1 < e.mutations.length - 1; ++t1){
                    const n1 = e.mutations[t1];
                    if (t1 + 1 < e.mutations.length && void 0 !== e.mutations[t1 + 1].transform) {
                        const s = e.mutations[t1 + 1];
                        n1.updateTransforms = s.transform.fieldTransforms, e.mutations.splice(t1 + 1, 1), ++t1;
                    }
                }
                const s1 = e.mutations.map((e)=>is(t.Wt, e)), i = it.fromMillis(e.localWriteTimeMs);
                return new ni(e.batchId, i, n, s1);
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
            class vi {
                constructor(t, e, n, s){
                    this.userId = t, this.N = e, this.Ht = n, this.referenceDelegate = s, this.Jt = {};
                }
                static Yt(t, e, n, s) {
                    "" !== t.uid || L();
                    const i = t.isAuthenticated() ? t.uid : "";
                    return new vi(i, e, n, s);
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
                    return Si(t).Kt({
                        index: Vs.userMutationsIndex,
                        range: n
                    }, (t, n, s)=>{
                        e = !1, s.done();
                    }).next(()=>e);
                }
                addMutationBatch(t, e, n, s) {
                    const i = Di(t), r = Si(t);
                    return r.add({}).next((o)=>{
                        "number" == typeof o || L();
                        const c = new ni(o, e, n, s), a = function(t, e, n) {
                            const s = n.baseMutations.map((e)=>ss(t.Wt, e)), i = n.mutations.map((e)=>ss(t.Wt, e));
                            return new Vs(e, n.batchId, n.localWriteTime.toMillis(), s, i);
                        }(this.N, this.userId, c), u = [];
                        let h = new gn((t, e)=>et(t.canonicalString(), e.canonicalString()));
                        for (const t1 of s){
                            const e1 = Ss.key(this.userId, t1.key.path, o);
                            h = h.add(t1.key.path.popLast()), u.push(r.put(a)), u.push(i.put(e1, Ss.PLACEHOLDER));
                        }
                        return h.forEach((e)=>{
                            u.push(this.Ht.addToCollectionParentIndex(t, e));
                        }), t.addOnCommittedListener(()=>{
                            this.Jt[o] = c.keys();
                        }), js.waitFor(u).next(()=>c);
                    });
                }
                lookupMutationBatch(t, e) {
                    return Si(t).get(e).next((t)=>t ? (t.userId === this.userId || L(), fi(this.N, t)) : null);
                }
                Xt(t, e) {
                    return this.Jt[e] ? js.resolve(this.Jt[e]) : this.lookupMutationBatch(t, e).next((t)=>{
                        if (t) {
                            const n = t.keys();
                            return this.Jt[e] = n, n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(t, e) {
                    const n = e + 1, s = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let i = null;
                    return Si(t).Kt({
                        index: Vs.userMutationsIndex,
                        range: s
                    }, (t, e, s)=>{
                        e.userId === this.userId && (e.batchId >= n || L(), i = fi(this.N, e)), s.done();
                    }).next(()=>i);
                }
                getHighestUnacknowledgedBatchId(t) {
                    const e = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY, 
                    ]);
                    let n = -1;
                    return Si(t).Kt({
                        index: Vs.userMutationsIndex,
                        range: e,
                        reverse: !0
                    }, (t, e, s)=>{
                        n = e.batchId, s.done();
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
                    return Si(t).Lt(Vs.userMutationsIndex, e).next((t)=>t.map((t)=>fi(this.N, t)));
                }
                getAllMutationBatchesAffectingDocumentKey(t, e) {
                    const n = Ss.prefixForPath(this.userId, e.path), s = IDBKeyRange.lowerBound(n), i = [];
                    return Di(t).Kt({
                        range: s
                    }, (n, s, r)=>{
                        const [o, c, a] = n, u = Rs(c);
                        if (o === this.userId && e.path.isEqual(u)) return Si(t).get(a).next((t)=>{
                            if (!t) throw L();
                            t.userId === this.userId || L(), i.push(fi(this.N, t));
                        });
                        r.done();
                    }).next(()=>i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t, e) {
                    let n = new gn(et);
                    const s = [];
                    return e.forEach((e)=>{
                        const i = Ss.prefixForPath(this.userId, e.path), r = IDBKeyRange.lowerBound(i), o = Di(t).Kt({
                            range: r
                        }, (t, s, i)=>{
                            const [r, o, c] = t, a = Rs(o);
                            r === this.userId && e.path.isEqual(a) ? n = n.add(c) : i.done();
                        });
                        s.push(o);
                    }), js.waitFor(s).next(()=>this.Zt(t, n));
                }
                getAllMutationBatchesAffectingQuery(t, e) {
                    const n = e.path, s = n.length + 1, i = Ss.prefixForPath(this.userId, n), r = IDBKeyRange.lowerBound(i);
                    let o = new gn(et);
                    return Di(t).Kt({
                        range: r
                    }, (t, e, i)=>{
                        const [r, c, a] = t, u = Rs(c);
                        r === this.userId && n.isPrefixOf(u) ? u.length === s && (o = o.add(a)) : i.done();
                    }).next(()=>this.Zt(t, o));
                }
                Zt(t, e) {
                    const n = [], s = [];
                    return e.forEach((e)=>{
                        s.push(Si(t).get(e).next((t)=>{
                            if (null === t) throw L();
                            t.userId === this.userId || L(), n.push(fi(this.N, t));
                        }));
                    }), js.waitFor(s).next(()=>n);
                }
                removeMutationBatch(t, e) {
                    return (function(t, e, n) {
                        const s = t.store(Vs.store), i = t.store(Ss.store), r = [], o = IDBKeyRange.only(n.batchId);
                        let c = 0;
                        const a = s.Kt({
                            range: o
                        }, (t, e, n)=>(c++, n.delete()));
                        r.push(a.next(()=>{
                            1 === c || L();
                        }));
                        const u = [];
                        for (const t1 of n.mutations){
                            const s1 = Ss.key(e, t1.key.path, n.batchId);
                            r.push(i.delete(s1)), u.push(t1.key);
                        }
                        return js.waitFor(r).next(()=>u);
                    })(t.Qt, this.userId, e).next((n)=>(t.addOnCommittedListener(()=>{
                            this.te(e.batchId);
                        }), js.forEach(n, (e)=>this.referenceDelegate.markPotentiallyOrphaned(t, e))));
                }
                te(t) {
                    delete this.Jt[t];
                }
                performConsistencyCheck(t) {
                    return this.checkEmpty(t).next((e)=>{
                        if (!e) return js.resolve();
                        const n = IDBKeyRange.lowerBound(Ss.prefixForUser(this.userId)), s = [];
                        return Di(t).Kt({
                            range: n
                        }, (t, e, n)=>{
                            if (t[0] === this.userId) {
                                const e1 = Rs(t[1]);
                                s.push(e1);
                            } else n.done();
                        }).next(()=>{
                            0 === s.length || L();
                        });
                    });
                }
                containsKey(t, e) {
                    return Vi(t, this.userId, e);
                }
                ee(t) {
                    return Ci(t).get(this.userId).next((t)=>t || new vs(this.userId, -1, ""));
                }
            }
            function Vi(t, e, n) {
                const s = Ss.prefixForPath(e, n.path), i = s[1], r = IDBKeyRange.lowerBound(s);
                let o = !1;
                return Di(t).Kt({
                    range: r,
                    qt: !0
                }, (t, n, s)=>{
                    const [r, c, a] = t;
                    r === e && c === i && (o = !0), s.done();
                }).next(()=>o);
            }
            function Si(t) {
                return ei(t, Vs.store);
            }
            function Di(t) {
                return ei(t, Ss.store);
            }
            function Ci(t) {
                return ei(t, vs.store);
            }
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
                        for (const [e1, s] of n)if (this.equalsFn(e1, t)) return s;
                    }
                }
                has(t) {
                    return void 0 !== this.get(t);
                }
                set(t, e) {
                    const n = this.mapKeyFn(t), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let n1 = 0; n1 < s.length; n1++)if (this.equalsFn(s[n1][0], t)) return void (s[n1] = [
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
                        for (const [e1, s] of n)t(e1, s);
                    });
                }
                isEmpty() {
                    return at(this.inner);
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
                        for (const t1 of e)t1.applyToLocalView(n);
                    });
                }
                Pn(t, e) {
                    return this.He.getEntries(t, e).next((e)=>this.vn(t, e).next(()=>e));
                }
                vn(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t)=>this.bn(e, t));
                }
                getDocumentsMatchingQuery(t, e, n) {
                    var t1;
                    return (t1 = e, Pt.isDocumentKey(t1.path) && null === t1.collectionGroup && 0 === t1.filters.length) ? this.Vn(t, e.path) : null !== e.collectionGroup ? this.Sn(t, e, n) : this.Dn(t, e, n);
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
                            var t1, e1;
                            const o = (t1 = e, e1 = r.child(s), new fe(e1, null, t1.explicitOrderBy.slice(), t1.filters.slice(), t1.limit, t1.limitType, t1.startAt, t1.endAt));
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
                                let i1 = s.get(n);
                                null == i1 && (i1 = Kt.newInvalidDocument(n), s = s.insert(n, i1)), Ye(e, i1, t1.localWriteTime), i1.isFoundDocument() || (s = s.remove(n));
                            }
                        }))).next(()=>(s.forEach((t, n)=>{
                            Pe(e, n) || (s = s.remove(t));
                        }), s));
                }
                Cn(t, e, n) {
                    let s = Pn();
                    for (const t1 of e)for (const e1 of t1.mutations)e1 instanceof nn && null === n.get(e1.key) && (s = s.add(e1.key));
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
                    for (const t1 of e.docChanges)switch(t1.type){
                        case 0:
                            n = n.add(t1.doc.key);
                            break;
                        case 1:
                            s = s.add(t1.doc.key);
                    }
                    return new or(t, e.fromCache, n, s);
                }
            }
            class cr {
                $n(t) {
                    this.On = t;
                }
                getDocumentsMatchingQuery(t, e, n, s) {
                    var t1;
                    return 0 === (t1 = e).filters.length && null === t1.limit && null == t1.startAt && null == t1.endAt && (0 === t1.explicitOrderBy.length || 1 === t1.explicitOrderBy.length && t1.explicitOrderBy[0].field.isKeyField()) || n.isEqual(rt.min()) ? this.Fn(t, e) : this.On.Pn(t, s).next((i)=>{
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
                const n = t;
                let s = n.In, i = n.Qn;
                const r = await n.persistence.runTransaction("Handle user change", "readonly", (t)=>{
                    let r;
                    return n.In.getAllMutationBatches(t).next((o)=>(r = o, s = n.persistence.getMutationQueue(e), i = new rr(n.jn, s, n.persistence.getIndexManager()), s.getAllMutationBatches(t))).next((e)=>{
                        const n = [], s = [];
                        let o = Pn();
                        for (const t1 of r)for (const e1 of (n.push(t1.batchId), t1.mutations))o = o.add(e1.key);
                        for (const t2 of e)for (const e2 of (s.push(t2.batchId), t2.mutations))o = o.add(e2.key);
                        return i.Pn(t, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            }));
                    });
                });
                return n.In = s, n.Qn = i, n.Bn.$n(n.Qn), r;
            }
            function fr(t) {
                const e = t;
                return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t)=>e.ze.getLastRemoteSnapshotVersion(t));
            }
            function _r(t, e) {
                const n = t;
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (t)=>(void 0 === e && (e = -1), n.In.getNextMutationBatchAfterBatchId(t, e)));
            }
            async function gr(t, e, n) {
                const s = t, i = s.Un.get(e);
                try {
                    n || await s.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t)=>s.persistence.referenceDelegate.removeTarget(t, i));
                } catch (t1) {
                    if (!Hs(t1)) throw t1;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t1}`);
                }
                s.Un = s.Un.remove(e), s.qn.delete(i.target);
            }
            function yr(t, e, n) {
                const s = t;
                let i = rt.min(), r = Pn();
                return s.persistence.runTransaction("Execute query", "readonly", (t)=>(function(t, e, n) {
                        const s = t, i = s.qn.get(n);
                        return void 0 !== i ? js.resolve(s.Un.get(i)) : s.ze.getTargetData(e, n);
                    })(s, t, Ee(e)).next((e)=>{
                        if (e) return i = e.lastLimboFreeSnapshotVersion, s.ze.getMatchingKeysForTargetId(t, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>s.Bn.getDocumentsMatchingQuery(t, e, n ? i : rt.min(), n ? r : Pn())).next((t)=>({
                            documents: t,
                            Gn: r
                        })));
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
                    for (const e1 of (this.In.push(r), s))this.ds = this.ds.add(new Pr(e1.key, i)), this.Ht.addToCollectionParentIndex(t, e1.key.path.popLast());
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
                        const { key: t1 , value: { document: i1 , readTime: o  } ,  } = r.getNext();
                        if (!e.path.isPrefixOf(t1.path)) break;
                        0 >= o.compareTo(n) || Pe(e, i1) && (s = s.insert(i1.key, i1.clone()));
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
            class Cr {
                constructor(t, e){
                    this.bs = {}, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t(this), this.ze = new class {
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
                    }(this), this.Ht = new class {
                        constructor(){
                            this.Gt = new class {
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
                            }();
                        }
                        addToCollectionParentIndex(t, e) {
                            return this.Gt.add(e), js.resolve();
                        }
                        getCollectionParents(t, e) {
                            return js.resolve(this.Gt.getEntries(e));
                        }
                    }(), this.He = function(t, e) {
                        return new Vr(t, e);
                    }(this.Ht, (t)=>this.referenceDelegate.Ps(t)), this.N = new class {
                        constructor(t){
                            this.Wt = t;
                        }
                    }(e), this.Je = new class {
                        constructor(t){
                            this.N = t, this.Yn = new Map(), this.Xn = new Map();
                        }
                        getBundleMetadata(t, e) {
                            return js.resolve(this.Yn.get(e));
                        }
                        saveBundleMetadata(t, e) {
                            var n;
                            return this.Yn.set(e.id, {
                                id: (n = e).id,
                                version: n.version,
                                createTime: jn(n.createTime)
                            }), js.resolve();
                        }
                        getNamedQuery(t, e) {
                            return js.resolve(this.Xn.get(e));
                        }
                        saveNamedQuery(t, e) {
                            var t1;
                            return this.Xn.set(e.name, {
                                name: (t1 = e).name,
                                query: function(t) {
                                    var t1, e;
                                    const e1 = function(t) {
                                        var t1, t2, e, n, s, i, o, c;
                                        let e1 = function(t) {
                                            const e = Wn(t);
                                            return 4 === e.length ? ht.emptyPath() : Xn(e);
                                        }(t.parent);
                                        const n1 = t.structuredQuery, s1 = n1.from ? n1.from.length : 0;
                                        let i1 = null;
                                        if (s1 > 0) {
                                            1 === s1 || L();
                                            const t3 = n1.from[0];
                                            t3.allDescendants ? i1 = t3.collectionId : e1 = e1.child(t3.collectionId);
                                        }
                                        let r = [];
                                        n1.where && (r = hs(n1.where));
                                        let o1 = [];
                                        n1.orderBy && (o1 = n1.orderBy.map((t)=>{
                                            var t1;
                                            return t1 = t, new ae(ms(t1.field), function(t) {
                                                switch(t){
                                                    case "ASCENDING":
                                                        return "asc";
                                                    case "DESCENDING":
                                                        return "desc";
                                                    default:
                                                        return;
                                                }
                                            }(t1.direction));
                                        }));
                                        let c1 = null, e2;
                                        n1.limit && (c1 = null == (e2 = "object" == typeof (t1 = n1.limit) ? t1.value : t1) ? null : e2);
                                        let a = null;
                                        n1.startAt && (a = fs(n1.startAt));
                                        let u = null;
                                        return n1.endAt && (u = fs(n1.endAt)), t2 = e1, e = i1, n = o1, s = r, i = c1, o = a, c = u, new fe(t2, e, n, s, i, "F", o, c);
                                    }({
                                        parent: t.parent,
                                        structuredQuery: t.structuredQuery
                                    });
                                    return "LAST" === t.limitType ? (t1 = e1, e = e1.limit, new fe(t1.path, t1.collectionGroup, t1.explicitOrderBy.slice(), t1.filters.slice(), e, "L", t1.startAt, t1.endAt)) : e1;
                                }(t1.bundledQuery),
                                readTime: jn(t1.readTime)
                            }), js.resolve();
                        }
                    }(this.N);
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
                        ()=>this.persistence.Ss(t, e), 
                    ]);
                }
            }
            class Fr {
                constructor(t, e, n, s){
                    this.user = t, this.batchId = e, this.state = n, this.error = s;
                }
                static $s(t, e, n) {
                    const s = JSON.parse(n);
                    let i, r = "object" == typeof s && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected", 
                    ].indexOf(s.state) && (void 0 === s.error || "object" == typeof s.error);
                    return r && s.error && (r = "string" == typeof s.error.message && "string" == typeof s.error.code) && (i = new j(s.error.code, s.error.message)), r ? new Fr(t, e, s.state, i) : (O("SharedClientState", `Failed to parse mutation state for ID '${e}': ${n}`), null);
                }
                Os() {
                    const t = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return this.error && (t.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(t);
                }
            }
            class Mr {
                constructor(t, e, n){
                    this.targetId = t, this.state = e, this.error = n;
                }
                static $s(t, e) {
                    const n = JSON.parse(e);
                    let s, i = "object" == typeof n && -1 !== [
                        "not-current",
                        "current",
                        "rejected", 
                    ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
                    return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code) && (s = new j(n.error.code, n.error.message)), i ? new Mr(t, n.state, s) : (O("SharedClientState", `Failed to parse target state for ID '${t}': ${e}`), null);
                }
                Os() {
                    const t = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return this.error && (t.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(t);
                }
            }
            class Lr {
                constructor(t, e){
                    this.clientId = t, this.activeTargetIds = e;
                }
                static $s(t, e) {
                    const n = JSON.parse(e);
                    let s = "object" == typeof n && n.activeTargetIds instanceof Array, i = vn;
                    for(let t1 = 0; s && t1 < n.activeTargetIds.length; ++t1)s = bt(n.activeTargetIds[t1]), i = i.add(n.activeTargetIds[t1]);
                    return s ? new Lr(t, i) : (O("SharedClientState", `Failed to parse client data for instance '${t}': ${e}`), null);
                }
            }
            class Br {
                constructor(t, e){
                    this.clientId = t, this.onlineState = e;
                }
                static $s(t) {
                    const e = JSON.parse(t);
                    return "object" == typeof e && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(e.onlineState) && "string" == typeof e.clientId ? new Br(e.clientId, e.onlineState) : (O("SharedClientState", `Failed to parse online state: ${t}`), null);
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
                    const t = {
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    };
                    return JSON.stringify(t);
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
                                            const t1 = o.getResponseJson().error;
                                            if (t1 && t1.status && t1.message) {
                                                const e1 = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t1.status);
                                                r(new j(e1, t1.message));
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
                        "/channel", 
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
                        vi (t) {
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t, e, n)=>{
                        t.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t1) {
                                setTimeout(()=>{
                                    throw t1;
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
                            const s = n, i = s.error || (null === (e = s[0]) || void 0 === e ? void 0 : e.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t1 = i.status;
                                let e1 = function(t) {
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t1), n1 = i.message;
                                void 0 === e1 && (e1 = K.INTERNAL, n1 = "Unknown error status: " + t1 + " with message " + i.message), u = !0, h.$i(new j(e1, n1)), c.close();
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
            function Yr(t) {
                return new Bn(t, !0);
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
                            var t1, t2, e1;
                            e.targetChange;
                            const s = "NO_CHANGE" === (t1 = e.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t1 ? 1 : "REMOVE" === t1 ? 2 : "CURRENT" === t1 ? 3 : "RESET" === t1 ? 4 : L(), i = e.targetChange.targetIds || [], r = (t2 = t, e1 = e.targetChange.resumeToken, t2.D ? (void 0 === e1 || "string" == typeof e1 || L(), _t.fromBase64String(e1 || "")) : (void 0 === e1 || e1 instanceof Uint8Array || L(), _t.fromUint8Array(e1 || new Uint8Array()))), o = e.targetChange.cause, c = o && function(t) {
                                const e = void 0 === t.code ? K.UNKNOWN : dn(t.code);
                                return new j(e, t.message || "");
                            }(o);
                            n = new xn(s, i, r, c || null);
                        } else if ("documentChange" in e) {
                            e.documentChange;
                            const s1 = e.documentChange;
                            s1.document, s1.document.name, s1.document.updateTime;
                            const i1 = zn(t, s1.document.name), r1 = jn(s1.document.updateTime), o1 = new Ut({
                                mapValue: {
                                    fields: s1.document.fields
                                }
                            }), c1 = Kt.newFoundDocument(i1, r1, o1), a = s1.targetIds || [], u = s1.removedTargetIds || [];
                            n = new Cn(a, u, c1.key, c1);
                        } else if ("documentDelete" in e) {
                            e.documentDelete;
                            const s2 = e.documentDelete;
                            s2.document;
                            const i2 = zn(t, s2.document), r2 = s2.readTime ? jn(s2.readTime) : rt.min(), o2 = Kt.newNoDocument(i2, r2), c2 = s2.removedTargetIds || [];
                            n = new Cn([], c2, o2.key, o2);
                        } else if ("documentRemove" in e) {
                            e.documentRemove;
                            const s3 = e.documentRemove;
                            s3.document;
                            const i3 = zn(t, s3.document), r3 = s3.removedTargetIds || [];
                            n = new Cn([], r3, i3, null);
                        } else {
                            if (!("filter" in e)) return L();
                            {
                                e.filter;
                                const t3 = e.filter;
                                t3.targetId;
                                const s4 = t3.count || 0, i4 = new un(s4), r4 = t3.targetId;
                                n = new Nn(r4, i4);
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
                                var t1, e1;
                                const n = {
                                    structuredQuery: {}
                                }, s = e.path;
                                null !== e.collectionGroup ? (n.parent = Hn(t, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e.collectionGroup,
                                        allDescendants: !0
                                    }, 
                                ]) : (n.parent = Hn(t, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }, 
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
                                    if (0 !== t.length) return t.map((t)=>{
                                        var t1;
                                        return {
                                            field: _s((t1 = t).field),
                                            direction: Mn[t1.dir]
                                        };
                                    });
                                }(e.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (t1 = t, e1 = e.limit, t1.D || null == e1 ? e1 : {
                                    value: e1
                                });
                                return null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = ls(e.startAt)), e.endAt && (n.structuredQuery.endAt = ls(e.endAt)), n;
                            }(t, s)
                        }).targetId = e.targetId, e.resumeToken.approximateByteSize() > 0 ? n.resumeToken = qn(t, e.resumeToken) : e.snapshotVersion.compareTo(rt.min()) > 0 && (n.readTime = Un(t, e.snapshotVersion.toTimestamp())), n;
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
            class eo extends null {
                constructor(t, e, n, s, i){
                    super(t, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", e, n, i), this.N = s, this.vr = !1;
                }
                get Vr() {
                    return this.vr;
                }
                start() {
                    this.vr = !1, this.lastStreamToken = void 0, super.start();
                }
                pr() {
                    this.vr && this.Sr([]);
                }
                Ar(t) {
                    return this.sr.ji("Write", t);
                }
                onMessage(t) {
                    var t1, e;
                    if (t.streamToken || L(), this.lastStreamToken = t.streamToken, this.vr) {
                        this.ar.reset();
                        const e1 = (t1 = t.writeResults, e = t.commitTime, t1 && t1.length > 0 ? (void 0 !== e || L(), t1.map((t)=>{
                            var t1, e1;
                            let n;
                            return t1 = t, e1 = e, (n = t1.updateTime ? jn(t1.updateTime) : jn(e1)).isEqual(rt.min()) && (n = jn(e1)), new We(n, t1.transformResults || []);
                        })) : []), n = jn(t.commitTime);
                        return this.listener.Dr(n, e1);
                    }
                    return t.writeResults && 0 !== t.writeResults.length && L(), this.vr = !0, this.listener.Cr();
                }
                Nr() {
                    const t = {};
                    t.database = Yn(this.N), this.mr(t);
                }
                Sr(t) {
                    const e = {
                        streamToken: this.lastStreamToken,
                        writes: t.map((t)=>ss(this.N, t))
                    };
                    this.mr(e);
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
            class io {
                constructor(t, e, n, s, i){
                    this.localStore = t, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, this.jr = [], this.Qr = new Map(), this.Wr = new Set(), this.Gr = [], this.zr = i, this.zr.Ti((t)=>{
                        n.enqueueAndForget(async ()=>{
                            wo(this) && ($("RemoteStore", "Restarting streams for network reachability change."), await async function(t) {
                                const e = t;
                                e.Wr.add(4), await oo(e), e.Hr.set("Unknown"), e.Wr.delete(4), await ro(e);
                            }(this));
                        });
                    }), this.Hr = new class {
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
                    }(n, s);
                }
            }
            async function ro(t) {
                if (wo(t)) for (const e of t.Gr)await e(!0);
            }
            async function oo(t) {
                for (const e of t.Gr)await e(!1);
            }
            function co(t, e) {
                const n = t;
                n.Qr.has(e.targetId) || (n.Qr.set(e.targetId, e), fo(n) ? lo(n) : Co(n).hr() && uo(n, e));
            }
            function ao(t, e) {
                const n = t, s = Co(n);
                n.Qr.delete(e), s.hr() && ho(n, e), 0 === n.Qr.size && (s.hr() ? s.wr() : wo(n) && n.Hr.set("Unknown"));
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
            function _o(t) {
                t.Jr = void 0;
            }
            async function mo(t) {
                t.Qr.forEach((e, n)=>{
                    uo(t, e);
                });
            }
            async function go(t, e) {
                _o(t), fo(t) ? (t.Hr.qr(e), lo(t)) : t.Hr.set("Unknown");
            }
            async function yo(t, e, n) {
                if (t.Hr.set("Online"), e instanceof xn && 2 === e.state && e.cause) try {
                    await async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(t, e);
                } catch (n1) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n1), await po(t, n1);
                }
                else if (e instanceof Cn ? t.Jr.rt(e) : e instanceof Nn ? t.Jr.ft(e) : t.Jr.at(e), !n.isEqual(rt.min())) try {
                    const e1 = await fr(t.localStore);
                    n.compareTo(e1) >= 0 && await function(t, e) {
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
                } catch (e2) {
                    $("RemoteStore", "Failed to raise snapshot:", e2), await po(t, e2);
                }
            }
            async function po(t, e, n) {
                if (!Hs(e)) throw e;
                t.Wr.add(1), await oo(t), t.Hr.set("Offline"), n || (n = ()=>fr(t.localStore)), t.asyncQueue.enqueueRetryable(async ()=>{
                    $("RemoteStore", "Retrying IndexedDB access"), await n(), t.Wr.delete(1), await ro(t);
                });
            }
            function To(t, e) {
                return e().catch((n)=>po(t, n, e));
            }
            async function Eo(t) {
                const e = t, n = No(e);
                let s = e.jr.length > 0 ? e.jr[e.jr.length - 1].batchId : -1;
                for(; Io(e);)try {
                    const t1 = await _r(e.localStore, s);
                    if (null === t1) {
                        0 === e.jr.length && n.wr();
                        break;
                    }
                    s = t1.batchId, Ao(e, t1);
                } catch (t2) {
                    await po(e, t2);
                }
                Ro(e) && bo(e);
            }
            function Io(t) {
                return wo(t) && t.jr.length < 10;
            }
            function Ao(t, e) {
                t.jr.push(e);
                const n = No(t);
                n.hr() && n.Vr && n.Sr(e.mutations);
            }
            function Ro(t) {
                return wo(t) && !No(t).ur() && t.jr.length > 0;
            }
            function bo(t) {
                No(t).start();
            }
            async function Po(t) {
                No(t).Nr();
            }
            async function vo(t) {
                const e = No(t);
                for (const n of t.jr)e.Sr(n.mutations);
            }
            async function Vo(t, e, n) {
                const s = t.jr.shift(), i = si.from(s, e, n);
                await To(t, ()=>t.remoteSyncer.applySuccessfulWrite(i)), await Eo(t);
            }
            async function So(t, e) {
                e && No(t).Vr && await async function(t, e) {
                    var n;
                    if (function(t) {
                        switch(t){
                            default:
                                return L();
                            case K.CANCELLED:
                            case K.UNKNOWN:
                            case K.DEADLINE_EXCEEDED:
                            case K.RESOURCE_EXHAUSTED:
                            case K.INTERNAL:
                            case K.UNAVAILABLE:
                            case K.UNAUTHENTICATED:
                                return !1;
                            case K.INVALID_ARGUMENT:
                            case K.NOT_FOUND:
                            case K.ALREADY_EXISTS:
                            case K.PERMISSION_DENIED:
                            case K.FAILED_PRECONDITION:
                            case K.ABORTED:
                            case K.OUT_OF_RANGE:
                            case K.UNIMPLEMENTED:
                            case K.DATA_LOSS:
                                return !0;
                        }
                    }(n = e.code) && n !== K.ABORTED) {
                        const n1 = t.jr.shift();
                        No(t).dr(), await To(t, ()=>t.remoteSyncer.rejectFailedWrite(n1.batchId, e)), await Eo(t);
                    }
                }(t, e), Ro(t) && bo(t);
            }
            async function Do(t, e) {
                const n = t;
                e ? (n.Wr.delete(2), await ro(n)) : e || (n.Wr.add(2), await oo(n), n.Hr.set("Unknown"));
            }
            function Co(t) {
                return t.Yr || (t.Yr = function(t, e, n) {
                    const s = t;
                    return s.$r(), new to(e, s.sr, s.credentials, s.N, n);
                }(t.datastore, t.asyncQueue, {
                    Si: mo.bind(null, t),
                    Ci: go.bind(null, t),
                    Rr: yo.bind(null, t)
                }), t.Gr.push(async (e)=>{
                    e ? (t.Yr.dr(), fo(t) ? lo(t) : t.Hr.set("Unknown")) : (await t.Yr.stop(), _o(t));
                })), t.Yr;
            }
            function No(t) {
                return t.Xr || (t.Xr = function(t, e, n) {
                    const s = t;
                    return s.$r(), new eo(e, s.sr, s.credentials, s.N, n);
                }(t.datastore, t.asyncQueue, {
                    Si: Po.bind(null, t),
                    Ci: So.bind(null, t),
                    Cr: vo.bind(null, t),
                    Dr: Vo.bind(null, t)
                }), t.Gr.push(async (e)=>{
                    e ? (t.Xr.dr(), await Eo(t)) : (await t.Xr.stop(), t.jr.length > 0 && ($("RemoteStore", `Stopping write stream with ${t.jr.length} pending writes`), t.jr = []));
                })), t.Xr;
            }
            class xo {
                constructor(t, e, n, s, i){
                    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new Q(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t)=>{});
                }
                static createAndSchedule(t, e, n, s, i) {
                    const r = Date.now() + n, o = new xo(t, e, r, s, i);
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
                        const t1 = e.getNext().key, s = n.getNext().key;
                        if (!t1.isEqual(s)) return !1;
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
                    for(let t1 = 0; t1 < e.length; t1++)if (e[t1].type !== n[t1].type || !e[t1].doc.isEqual(n[t1].doc)) return !1;
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
                const n = t, s = e.query;
                let i = !1, r = n.queries.get(s);
                if (r || (i = !0, r = new Mo()), i) try {
                    r.no = await n.onListen(s);
                } catch (t1) {
                    const n1 = ko(t1, `Initialization of query '${be(e.query)}' failed`);
                    return void e.onError(n1);
                }
                n.queries.set(s, r), r.listeners.push(e), e.io(n.onlineState), r.no && e.ro(r.no) && jo(n);
            }
            async function Uo(t, e) {
                const n = t, s = e.query;
                let i = !1;
                const r = n.queries.get(s);
                if (r) {
                    const t1 = r.listeners.indexOf(e);
                    t1 >= 0 && (r.listeners.splice(t1, 1), i = 0 === r.listeners.length);
                }
                if (i) return n.queries.delete(s), n.onUnlisten(s);
            }
            function qo(t, e) {
                const n = t;
                let s = !1;
                for (const t1 of e){
                    const e1 = t1.query, i = n.queries.get(e1);
                    if (i) {
                        for (const e2 of i.listeners)e2.ro(t1) && (s = !0);
                        i.no = t1;
                    }
                }
                s && jo(n);
            }
            function Ko(t, e, n) {
                const s = t, i = s.queries.get(e);
                if (i) for (const t1 of i.listeners)t1.onError(n);
                s.queries.delete(e);
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
                    let e1 = !1;
                    return this.co ? this.uo(t) && (this.oo.next(t), e1 = !0) : this.ho(t, this.onlineState) && (this.lo(t), e1 = !0), this.ao = t, e1;
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
                    if (!t.fromCache) return !0;
                    const n = "Offline" !== e;
                    return (!this.options.fo || !n) && (!t.docs.isEmpty() || "Offline" === e);
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
                        const t1 = _e(this.query) ? r.last() : r.first();
                        r = r.delete(t1.key), i = i.delete(t1.key), n.track({
                            type: 1,
                            doc: t1
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
                const n = Cc(t);
                let s, i;
                const r = n.Oo.get(e);
                if (r) s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.xo();
                else {
                    const t1 = await function(t, e) {
                        const n = t;
                        return n.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                            let s;
                            return n.ze.getTargetData(t, e).next((i)=>i ? (s = i, js.resolve(s)) : n.ze.allocateTargetId(t).next((i)=>(s = new ii(e, i, 0, t.currentSequenceNumber), n.ze.addTargetData(t, s).next(()=>s))));
                        }).then((t)=>{
                            const s = n.Un.get(t.targetId);
                            return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Un = n.Un.insert(t.targetId, t), n.qn.set(e, t.targetId)), t;
                        });
                    }(n.localStore, Ee(e)), r1 = n.sharedClientState.addLocalQueryTarget(t1.targetId);
                    i = await sc(n, e, s = t1.targetId, "current" === r1), n.isPrimaryClient && co(n.remoteStore, t1);
                }
                return i;
            }
            async function sc(t, e, n, s) {
                t.Wo = (e, n, s)=>(async function(t, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && (i = await yr(t.localStore, e.query, !1).then(({ documents: t  })=>e.view.bo(t, i)));
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
                const n = t, s = n.Oo.get(e), i = n.Fo.get(s.targetId);
                if (i.length > 1) return n.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e))), void n.Oo.delete(e);
                n.isPrimaryClient ? (n.sharedClientState.removeLocalQueryTarget(s.targetId), n.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(n.localStore, s.targetId, !1).then(()=>{
                    n.sharedClientState.clearQueryState(s.targetId), ao(n.remoteStore, s.targetId), wc(n, s.targetId);
                }).catch(Fi)) : (wc(n, s.targetId), await gr(n.localStore, s.targetId, !0));
            }
            async function oc(t, e) {
                const n = t;
                try {
                    const t1 = await function(t, e) {
                        const n = t, s = e.snapshotVersion;
                        let i = n.Un;
                        return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t)=>{
                            var t1, e1, n1, s1, i1;
                            const r = n.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = n.Un;
                            const o = [];
                            e.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (!c) return;
                                o.push(n.ze.removeMatchingKeys(t, e.removedDocuments, r).next(()=>n.ze.addMatchingKeys(t, e.addedDocuments, r)));
                                const a = e.resumeToken;
                                if (a.approximateByteSize() > 0) {
                                    var t1, e1, n1;
                                    const u = c.withResumeToken(a, s).withSequenceNumber(t.currentSequenceNumber);
                                    i = i.insert(r, u), t1 = c, e1 = u, n1 = e, e1.resumeToken.approximateByteSize() > 0 || L(), (0 === t1.resumeToken.approximateByteSize() || e1.snapshotVersion.toMicroseconds() - t1.snapshotVersion.toMicroseconds() >= 3e8 || n1.addedDocuments.size + n1.modifiedDocuments.size + n1.removedDocuments.size > 0) && o.push(n.ze.updateTargetData(t, u));
                                }
                            });
                            let c = pn, r1;
                            if (e.documentUpdates.forEach((s, i)=>{
                                e.resolvedLimboDocuments.has(s) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t, s));
                            }), o.push((t1 = t, e1 = r, n1 = e.documentUpdates, s1 = s, i1 = void 0, r1 = Pn(), n1.forEach((t)=>r1 = r1.add(t)), e1.getEntries(t1, r1).next((t)=>{
                                let r = pn;
                                return n1.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i1 ? void 0 : i1.get(n)) || s1;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (e1.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (e1.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c = t;
                            })), !s.isEqual(rt.min())) {
                                const e2 = n.ze.getLastRemoteSnapshotVersion(t).next((e)=>n.ze.setTargetsMetadata(t, t.currentSequenceNumber, s));
                                o.push(e2);
                            }
                            return js.waitFor(o).next(()=>r.apply(t)).next(()=>n.Qn.vn(t, c)).next(()=>c);
                        }).then((t)=>(n.Un = i, t));
                    }(n.localStore, e);
                    e.targetChanges.forEach((t, e)=>{
                        const s = n.Bo.get(e);
                        s && (t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1 || L(), t.addedDocuments.size > 0 ? s.ko = !0 : t.modifiedDocuments.size > 0 ? s.ko || L() : t.removedDocuments.size > 0 && (s.ko || L(), s.ko = !1));
                    }), await pc(n, t1, e);
                } catch (t2) {
                    await Fi(t2);
                }
            }
            function cc(t, e, n) {
                const s = t;
                if (s.isPrimaryClient && 0 === n || !s.isPrimaryClient && 1 === n) {
                    const t1 = [];
                    s.Oo.forEach((n, s)=>{
                        const i = s.view.io(e);
                        i.snapshot && t1.push(i.snapshot);
                    }), function(t, e) {
                        const n = t;
                        n.onlineState = e;
                        let s = !1;
                        n.queries.forEach((t, n)=>{
                            for (const t1 of n.listeners)t1.io(e) && (s = !0);
                        }), s && jo(n);
                    }(s.eventManager, e), t1.length && s.$o.Rr(t1), s.onlineState = e, s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
                }
            }
            async function ac(t, e, n) {
                const s = t;
                s.sharedClientState.updateQueryState(e, "rejected", n);
                const i = s.Bo.get(e), r = i && i.key;
                if (r) {
                    let t1 = new wn(Pt.comparator);
                    t1 = t1.insert(r, Kt.newNoDocument(r, rt.min()));
                    const n1 = Pn().add(r), i1 = new Sn(rt.min(), new Map(), new gn(et), t1, n1);
                    await oc(s, i1), s.Lo = s.Lo.remove(r), s.Bo.delete(e), yc(s);
                } else await gr(s.localStore, e, !1).then(()=>wc(s, e, n)).catch(Fi);
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
                for (const s of n)s instanceof Jo ? (t.Uo.addReference(s.key, e), gc(t, s)) : s instanceof Yo ? ($("SyncEngine", "Document no longer in limbo: " + s.key), t.Uo.removeReference(s.key, e), t.Uo.containsKey(s.key) || _c(t, s.key)) : L();
            }
            function gc(t, e) {
                const n = e.key, s = n.path.canonicalString();
                t.Lo.get(n) || t.Mo.has(s) || ($("SyncEngine", "New document in limbo: " + n), t.Mo.add(s), yc(t));
            }
            function yc(t) {
                for(; t.Mo.size > 0 && t.Lo.size < t.maxConcurrentLimboResolutions;){
                    const e = t.Mo.values().next().value;
                    t.Mo.delete(e);
                    const n = new Pt(ht.fromString(e)), s = t.jo.next();
                    t.Bo.set(s, new tc(n)), t.Lo = t.Lo.insert(n, s), co(t.remoteStore, new ii(Ee(we(n.path)), s, 2, X.T));
                }
            }
            async function pc(t, e, n) {
                const s = t, i = [], r = [], o = [];
                s.Oo.isEmpty() || (s.Oo.forEach((t, c)=>{
                    o.push(s.Wo(c, e, n).then((t)=>{
                        if (t) {
                            s.isPrimaryClient && s.sharedClientState.updateQueryState(c.targetId, t.fromCache ? "not-current" : "current"), i.push(t);
                            const e = or.kn(c.targetId, t);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), s.$o.Rr(i), await async function(t, e) {
                    const n = t;
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t)=>js.forEach(e, (e)=>js.forEach(e.Nn, (s)=>n.persistence.referenceDelegate.addReference(t, e.targetId, s)).next(()=>js.forEach(e.xn, (s)=>n.persistence.referenceDelegate.removeReference(t, e.targetId, s)))));
                    } catch (t1) {
                        if (!Hs(t1)) throw t1;
                        $("LocalStore", "Failed to update sequence numbers: " + t1);
                    }
                    for (const t2 of e){
                        const e1 = t2.targetId;
                        if (!t2.fromCache) {
                            const t3 = n.Un.get(e1), s = t3.snapshotVersion, i = t3.withLastLimboFreeSnapshotVersion(s);
                            n.Un = n.Un.insert(e1, i);
                        }
                    }
                }(s.localStore, r));
            }
            async function Tc(t, e) {
                var t1, e1;
                const n = t;
                if (!n.currentUser.isEqual(e)) {
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t2 = await hr(n.localStore, e);
                    n.currentUser = e, e1 = "'waitForPendingWrites' promise is rejected due to a user change.", (t1 = n).Ko.forEach((t)=>{
                        t.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e1));
                        });
                    }), t1.Ko.clear(), n.sharedClientState.handleUserChange(e, t2.removedBatchIds, t2.addedBatchIds), await pc(n, t2.Wn);
                }
            }
            function Ec(t, e) {
                const n = t, s = n.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t1 = Pn();
                    const s1 = n.Fo.get(e);
                    if (!s1) return t1;
                    for (const e1 of s1){
                        const s2 = n.Oo.get(e1);
                        t1 = t1.unionWith(s2.view.Ro);
                    }
                    return t1;
                }
            }
            function Cc(t) {
                const e = t;
                return e.remoteStore.remoteSyncer.applyRemoteEvent = oc.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = Ec.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = ac.bind(null, e), e.$o.Rr = qo.bind(null, e.eventManager), e.$o.Go = Ko.bind(null, e.eventManager), e;
            }
            class kc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(t) {
                    this.N = Yr(t.databaseInfo.databaseId), this.sharedClientState = this.Ho(t), this.persistence = this.Jo(t), await this.persistence.start(), this.gcScheduler = this.Yo(t), this.localStore = this.Xo(t);
                }
                Yo(t) {
                    return null;
                }
                Xo(t) {
                    var t1, e, n, s;
                    return t1 = this.persistence, e = new cr(), n = t.initialUser, s = this.N, new ar(t1, e, n, s);
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
                    var s, t1, e, n;
                    const e1 = Yr(t.databaseInfo.databaseId), n1 = (s = t.databaseInfo, new zr(s));
                    return t1 = t.credentials, e = n1, n = e1, new no(t1, e, n);
                }
                createRemoteStore(t) {
                    var e, n, s, i, r;
                    return e = this.localStore, n = this.datastore, s = t.asyncQueue, i = (t)=>cc(this.syncEngine, t, 0), r = Qr.bt() ? new Qr() : new jr(), new io(e, n, s, i, r);
                }
                createSyncEngine(t, e) {
                    return function(t, e, n, s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
                }
                terminate() {
                    return async function(t) {
                        const e = t;
                        $("RemoteStore", "RemoteStore shutting down."), e.Wr.add(5), await oo(e), e.zr.shutdown(), e.Hr.set("Unknown");
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
                    this.credentials = t, this.asyncQueue = e, this.databaseInfo = n, this.user = D.UNAUTHENTICATED, this.clientId = (class {
                        static I() {
                            const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
                            let n = "";
                            for(; n.length < 20;){
                                const s = Z(40);
                                for(let i = 0; i < s.length; ++i)n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
                            }
                            return n;
                        }
                    }).I(), this.credentialListener = ()=>Promise.resolve(), this.credentials.start(e, async (t)=>{
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
                        const n = t;
                        n.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(n);
                        n.Wr.add(3), await oo(n), s && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.Wr.delete(3), await ro(n);
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
            function ma(t) {
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
            }
            function ga(t, e) {
                if ("_delegate" in t && (t = t._delegate), !(t instanceof e)) {
                    if (e.name === t.constructor.name) throw new j(K.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n = ma(t);
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
                    super(t, e, we(n)), this._path = n, this.type = "collection";
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
                    const s1 = t._path.child(ht.fromString(e, ...n));
                    return _a(s1), new Ra(t.firestore, null, s1);
                }
            }
            class ka extends Ta {
                constructor(t, e){
                    super(t, e), this.type = "firestore", this._queue = new class {
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
                                    var t1;
                                    this.Tc = t, this.Ec = !1;
                                    let e;
                                    const e1 = (e = (t1 = t).message || "", t1.stack && (e = t1.stack.includes(t1.message) ? t1.stack : t1.message + "\n" + t1.stack), e);
                                    throw O("INTERNAL UNHANDLED ERROR: ", e1), t;
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
                            do await (t = this._c);
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
                    }(), this._persistenceKey = "name" in t ? t.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e, t1, e1, n, s;
                const n1 = t._freezeSettings(), s1 = (t1 = t._databaseId, e1 = (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", n = t._persistenceKey, s = n1, new ua(t1, e1, n, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams));
                t._firestoreClient = new Kc(t._credentials, t._queue, s1);
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
                    } catch (t1) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t1);
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
            class Za {
                constructor(t){
                    this._methodName = t;
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
            const eu = /^__.*__$/;
            function iu(t) {
                switch(t){
                    case 0:
                    case 2:
                    case 1:
                        return !0;
                    case 3:
                    case 4:
                        return !1;
                    default:
                        throw L();
                }
            }
            class ru {
                constructor(t, e, n, s, i, r){
                    this.settings = t, this.databaseId = e, this.N = n, this.ignoreUndefinedProperties = s, void 0 === i && this.xc(), this.fieldTransforms = i || [], this.fieldMask = r || [];
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(t) {
                    return new ru(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
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
                    return bu(t, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(t) {
                    return void 0 !== this.fieldMask.find((e)=>t.isPrefixOf(e)) || void 0 !== this.fieldTransforms.find((e)=>t.isPrefixOf(e.field));
                }
                xc() {
                    if (this.path) for(let t = 0; t < this.path.length; t++)this.Mc(this.path.get(t));
                }
                Mc(t) {
                    if (0 === t.length) throw this.Uc("Document fields must not be empty");
                    if (iu(this.kc) && eu.test(t)) throw this.Uc('Document fields cannot begin and end with "__"');
                }
            }
            class uu extends null {
                _toFieldTransform(t) {
                    if (2 !== t.kc) throw 1 === t.kc ? t.Uc(`${this._methodName}() can only appear at the top level of your update data`) : t.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return t.fieldMask.push(t.path), null;
                }
                isEqual(t) {
                    return t instanceof uu;
                }
            }
            class lu extends null {
                _toFieldTransform(t) {
                    return new je(t.path, new Oe());
                }
                isEqual(t) {
                    return t instanceof lu;
                }
            }
            function yu(t, e) {
                if (Tu(t = getModularInstance(t))) return Eu("Unsupported field value:", e, t), pu(t, e);
                if (t instanceof Za) return function(t, e) {
                    if (!iu(e.kc)) throw e.Uc(`${t._methodName}() can only be used with update() and set()`);
                    if (!e.path) throw e.Uc(`${t._methodName}() is not currently supported inside arrays`);
                    const n = t._toFieldTransform(e);
                    n && e.fieldTransforms.push(n);
                }(t, e), null;
                if (void 0 === t && e.ignoreUndefinedProperties) return null;
                if (e.path && e.fieldMask.push(e.path), t instanceof Array) {
                    if (e.settings.Fc && 4 !== e.kc) throw e.Uc("Nested arrays are not supported");
                    return function(t, e) {
                        const n = [];
                        let s = 0;
                        for (const i of t){
                            let t1 = yu(i, e.Bc(s));
                            null == t1 && (t1 = {
                                nullValue: "NULL_VALUE"
                            }), n.push(t1), s++;
                        }
                        return {
                            arrayValue: {
                                values: n
                            }
                        };
                    }(t, e);
                }
                return function(t, e) {
                    if (null === (t = getModularInstance(t))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof t) {
                        var t1, e1;
                        return t1 = e.N, bt(e1 = t) ? De(e1) : Se(t1, e1);
                    }
                    if ("boolean" == typeof t) return {
                        booleanValue: t
                    };
                    if ("string" == typeof t) return {
                        stringValue: t
                    };
                    if (t instanceof Date) {
                        const n = it.fromDate(t);
                        return {
                            timestampValue: Un(e.N, n)
                        };
                    }
                    if (t instanceof it) {
                        const n1 = new it(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));
                        return {
                            timestampValue: Un(e.N, n1)
                        };
                    }
                    if (t instanceof tu) return {
                        geoPointValue: {
                            latitude: t.latitude,
                            longitude: t.longitude
                        }
                    };
                    if (t instanceof Xa) return {
                        bytesValue: qn(e.N, t._byteString)
                    };
                    if (t instanceof Ia) {
                        const n2 = e.databaseId, s = t.firestore._databaseId;
                        if (!s.isEqual(n2)) throw e.Uc(`Document reference is for database ${s.projectId}/${s.database} but should be for database ${n2.projectId}/${n2.database}`);
                        return {
                            referenceValue: Qn(t.firestore._databaseId || e.databaseId, t._key.path)
                        };
                    }
                    throw e.Uc(`Unsupported field value: ${ma(t)}`);
                }(t, e);
            }
            function pu(t, e) {
                const n = {};
                return at(t) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : ct(t, (t, s)=>{
                    const i = yu(s, e.Oc(t));
                    null != i && (n[t] = i);
                }), {
                    mapValue: {
                        fields: n
                    }
                };
            }
            function Tu(t) {
                return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof it || t instanceof tu || t instanceof Xa || t instanceof Ia || t instanceof Za);
            }
            function Eu(t, e, n) {
                var t1;
                if (!Tu(n) || "object" != typeof (t1 = n) || null === t1 || Object.getPrototypeOf(t1) !== Object.prototype && null !== Object.getPrototypeOf(t1)) {
                    const s = ma(n);
                    throw "an object" === s ? e.Uc(t + " a custom object") : e.Uc(t + " " + s);
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
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, n);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, n);
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
                            let e1 = 0;
                            return t._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t._firestore, t._userDataWriter, n.doc.key, n.doc, new Du(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter),
                                    oldIndex: -1,
                                    newIndex: e1++
                                }));
                        }
                        {
                            let n = t._snapshot.oldDocs;
                            return t._snapshot.docChanges.filter((t)=>e || 3 !== t.type).map((e)=>{
                                const s = new Nu(t._firestore, t._userDataWriter, e.doc.key, e.doc, new Du(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: ku(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
                }
            }
            function ku(t) {
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
                            const n = Et(t);
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
                var t1;
                t = ga(t, Aa);
                const e = ga(t.firestore, ka), n = ((t1 = e)._firestoreClient || Ma(t1), t1._firestoreClient.verifyNotTerminated(), t1._firestoreClient), s = new ah(e);
                return function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                }(t._query), (function(t, e, n = {}) {
                    const s = new Q();
                    return t.asyncQueue.enqueueAndForget(async ()=>(function(t, e, n, s, i) {
                            const r = new Lc({
                                next (n) {
                                    e.enqueueAndForget(()=>Uo(t, o)), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), o = new Qo(n, r, {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t, o);
                        })(await Xc(t), t.asyncQueue, e, n, s)), s.promise;
                })(n, t._query).then((n)=>new xu(e, s, t, n));
            }
            !function(t, e = !0) {
                C = _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Jn, (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Xd)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.wA("firestore", (t, { options: n  })=>{
                    const s = t.getProvider("app").getImmediate(), i = new ka(s, new H(t.getProvider("auth-internal")));
                    return n = Object.assign({
                        useFetchStreams: e
                    }, n), i._setSettings(n), i;
                }, "PUBLIC")), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", void 0), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", "esm2017");
            }();
        }
    }, 
]);
