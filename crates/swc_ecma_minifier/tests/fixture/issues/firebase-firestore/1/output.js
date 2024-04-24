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
                constructor(t1){
                    this.uid = t1;
                }
                isAuthenticated() {
                    return null != this.uid;
                }
                toKey() {
                    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
                }
                isEqual(t1) {
                    return t1.uid === this.uid;
                }
            }
            D.UNAUTHENTICATED = new D(null), D.GOOGLE_CREDENTIALS = new D("google-credentials-uid"), D.FIRST_PARTY = new D("first-party-uid"), D.MOCK_USER = new D("mock-user");
            let C = "9.4.0";
            const N = new _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.Yd("@firebase/firestore");
            function x() {
                return N.logLevel;
            }
            function $(t1, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG) {
                    const n1 = e.map(M);
                    N.debug(`Firestore (${C}): ${t1}`, ...n1);
                }
            }
            function O(t1, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.ERROR) {
                    const n1 = e.map(M);
                    N.error(`Firestore (${C}): ${t1}`, ...n1);
                }
            }
            function F(t1, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.WARN) {
                    const n1 = e.map(M);
                    N.warn(`Firestore (${C}): ${t1}`, ...n1);
                }
            }
            function M(t1) {
                if ("string" == typeof t1) return t1;
                try {
                    return JSON.stringify(t1);
                } catch (e) {
                    return t1;
                }
            }
            function L(t1 = "Unexpected state") {
                const e = `FIRESTORE (${C}) INTERNAL ASSERTION FAILED: ` + t1;
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
                constructor(t1, e){
                    super(e), this.code = t1, this.message = e, this.name = "FirebaseError", this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`;
                }
            }
            class Q {
                constructor(){
                    this.promise = new Promise((t1, e)=>{
                        this.resolve = t1, this.reject = e;
                    });
                }
            }
            class W {
                constructor(t1, e){
                    this.user = e, this.type = "OAuth", this.authHeaders = {}, this.authHeaders.Authorization = `Bearer ${t1}`;
                }
            }
            class G {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(t1, e) {
                    t1.enqueueRetryable(()=>e(D.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class H {
                constructor(t1){
                    this.t = t1, this.currentUser = D.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t1, e) {
                    let n1 = this.i;
                    const s = (t1)=>this.i !== n1 ? (n1 = this.i, e(t1)) : Promise.resolve();
                    let i = new Q();
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q(), t1.enqueueRetryable(()=>s(this.currentUser));
                    };
                    const r = ()=>{
                        const e = i;
                        t1.enqueueRetryable(async ()=>{
                            await e.promise, await s(this.currentUser);
                        });
                    }, o = (t1)=>{
                        $("FirebaseCredentialsProvider", "Auth detected"), this.auth = t1, this.auth.addAuthTokenListener(this.o), r();
                    };
                    this.t.onInit((t1)=>o(t1)), setTimeout(()=>{
                        if (!this.auth) {
                            const t1 = this.t.getImmediate({
                                optional: !0
                            });
                            t1 ? o(t1) : ($("FirebaseCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Q());
                        }
                    }, 0), r();
                }
                getToken() {
                    const t1 = this.i, e = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e).then((e)=>this.i !== t1 ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? ("string" == typeof e.accessToken || L(), new W(e.accessToken, this.currentUser)) : null) : Promise.resolve(null);
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const t1 = this.auth && this.auth.getUid();
                    return null === t1 || "string" == typeof t1 || L(), new D(t1);
                }
            }
            class J {
                constructor(t1, e, n1){
                    this.h = t1, this.l = e, this.m = n1, this.type = "FirstParty", this.user = D.FIRST_PARTY;
                }
                get authHeaders() {
                    const t1 = {
                        "X-Goog-AuthUser": this.l
                    }, e = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return e && (t1.Authorization = e), this.m && (t1["X-Goog-Iam-Authorization-Token"] = this.m), t1;
                }
            }
            class Y {
                constructor(t1, e, n1){
                    this.h = t1, this.l = e, this.m = n1;
                }
                getToken() {
                    return Promise.resolve(new J(this.h, this.l, this.m));
                }
                start(t1, e) {
                    t1.enqueueRetryable(()=>e(D.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class X {
                constructor(t1, e){
                    this.previousValue = t1, e && (e.sequenceNumberHandler = (t1)=>this.g(t1), this.p = (t1)=>e.writeSequenceNumber(t1));
                }
                g(t1) {
                    return this.previousValue = Math.max(t1, this.previousValue), this.previousValue;
                }
                next() {
                    const t1 = ++this.previousValue;
                    return this.p && this.p(t1), t1;
                }
            }
            X.T = -1;
            class tt {
                static I() {
                    const t1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t1.length) * t1.length;
                    let n1 = "";
                    for(; n1.length < 20;){
                        const s = function() {
                            const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n1 = new Uint8Array(40);
                            if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n1);
                            else for(let e = 0; e < t; e++)n1[e] = Math.floor(256 * Math.random());
                            return n1;
                        }(40);
                        for(let i = 0; i < s.length; ++i)n1.length < 20 && s[i] < e && (n1 += t1.charAt(s[i] % t1.length));
                    }
                    return n1;
                }
            }
            function et(t1, e) {
                return t1 < e ? -1 : t1 > e ? 1 : 0;
            }
            function nt(t1, e, n1) {
                return t1.length === e.length && t1.every((t1, s)=>n1(t1, e[s]));
            }
            class it {
                constructor(t1, e){
                    if (this.seconds = t1, this.nanoseconds = e, e < 0 || e >= 1e9) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (t1 < -62135596800 || t1 >= 253402300800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t1);
                }
                static now() {
                    return it.fromMillis(Date.now());
                }
                static fromDate(t1) {
                    return it.fromMillis(t1.getTime());
                }
                static fromMillis(t1) {
                    const e = Math.floor(t1 / 1e3);
                    return new it(e, Math.floor(1e6 * (t1 - 1e3 * e)));
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(t1) {
                    return this.seconds === t1.seconds ? et(this.nanoseconds, t1.nanoseconds) : et(this.seconds, t1.seconds);
                }
                isEqual(t1) {
                    return t1.seconds === this.seconds && t1.nanoseconds === this.nanoseconds;
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
                constructor(t1){
                    this.timestamp = t1;
                }
                static fromTimestamp(t1) {
                    return new rt(t1);
                }
                static min() {
                    return new rt(new it(0, 0));
                }
                compareTo(t1) {
                    return this.timestamp._compareTo(t1.timestamp);
                }
                isEqual(t1) {
                    return this.timestamp.isEqual(t1.timestamp);
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
            function ot(t1) {
                let e = 0;
                for(const n1 in t1)Object.prototype.hasOwnProperty.call(t1, n1) && e++;
                return e;
            }
            function ct(t1, e) {
                for(const n1 in t1)Object.prototype.hasOwnProperty.call(t1, n1) && e(n1, t1[n1]);
            }
            class ut {
                constructor(t1, e, n1){
                    void 0 === e ? e = 0 : e > t1.length && L(), void 0 === n1 ? n1 = t1.length - e : n1 > t1.length - e && L(), this.segments = t1, this.offset = e, this.len = n1;
                }
                get length() {
                    return this.len;
                }
                isEqual(t1) {
                    return 0 === ut.comparator(this, t1);
                }
                child(t1) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t1 instanceof ut ? t1.forEach((t1)=>{
                        e.push(t1);
                    }) : e.push(t1), this.construct(e);
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(t1) {
                    return t1 = void 0 === t1 ? 1 : t1, this.construct(this.segments, this.offset + t1, this.length - t1);
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
                get(t1) {
                    return this.segments[this.offset + t1];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(t1) {
                    if (t1.length < this.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t1.get(e)) return !1;
                    return !0;
                }
                isImmediateParentOf(t1) {
                    if (this.length + 1 !== t1.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t1.get(e)) return !1;
                    return !0;
                }
                forEach(t1) {
                    for(let e = this.offset, n1 = this.limit(); e < n1; e++)t1(this.segments[e]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(t1, e) {
                    const n1 = Math.min(t1.length, e.length);
                    for(let s = 0; s < n1; s++){
                        const n1 = t1.get(s), i = e.get(s);
                        if (n1 < i) return -1;
                        if (n1 > i) return 1;
                    }
                    return t1.length < e.length ? -1 : t1.length > e.length ? 1 : 0;
                }
            }
            class ht extends ut {
                construct(t1, e, n1) {
                    return new ht(t1, e, n1);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...t1) {
                    const e = [];
                    for (const n1 of t1){
                        if (n1.indexOf("//") >= 0) throw new j(K.INVALID_ARGUMENT, `Invalid segment (${n1}). Paths must not contain // in them.`);
                        e.push(...n1.split("/").filter((t1)=>t1.length > 0));
                    }
                    return new ht(e);
                }
                static emptyPath() {
                    return new ht([]);
                }
            }
            const lt = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class ft extends ut {
                construct(t1, e, n1) {
                    return new ft(t1, e, n1);
                }
                static isValidIdentifier(t1) {
                    return lt.test(t1);
                }
                canonicalString() {
                    return this.toArray().map((t1)=>(t1 = t1.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), ft.isValidIdentifier(t1) || (t1 = "`" + t1 + "`"), t1)).join(".");
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
                static fromServerFormat(t1) {
                    const e = [];
                    let n1 = "", s = 0;
                    const i = ()=>{
                        if (0 === n1.length) throw new j(K.INVALID_ARGUMENT, `Invalid field path (${t1}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n1), n1 = "";
                    };
                    let r = !1;
                    for(; s < t1.length;){
                        const e = t1[s];
                        if ("\\" === e) {
                            if (s + 1 === t1.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t1);
                            const e = t1[s + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t1);
                            n1 += e, s += 2;
                        } else "`" === e ? r = !r : "." !== e || r ? n1 += e : i(), s++;
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t1);
                    return new ft(e);
                }
                static emptyPath() {
                    return new ft([]);
                }
            }
            class _t {
                constructor(t1){
                    this.binaryString = t1;
                }
                static fromBase64String(t1) {
                    return new _t(atob(t1));
                }
                static fromUint8Array(t1) {
                    return new _t(function(t1) {
                        let e = "";
                        for(let n1 = 0; n1 < t1.length; ++n1)e += String.fromCharCode(t1[n1]);
                        return e;
                    }(t1));
                }
                toBase64() {
                    return btoa(this.binaryString);
                }
                toUint8Array() {
                    return function(t1) {
                        const e = new Uint8Array(t1.length);
                        for(let n1 = 0; n1 < t1.length; n1++)e[n1] = t1.charCodeAt(n1);
                        return e;
                    }(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(t1) {
                    return et(this.binaryString, t1.binaryString);
                }
                isEqual(t1) {
                    return this.binaryString === t1.binaryString;
                }
            }
            _t.EMPTY_BYTE_STRING = new _t("");
            const mt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function gt(t1) {
                if (t1 || L(), "string" == typeof t1) {
                    let e = 0;
                    const n1 = mt.exec(t1);
                    if (n1 || L(), n1[1]) {
                        let t1 = n1[1];
                        e = Number(t1 = (t1 + "000000000").substr(0, 9));
                    }
                    return {
                        seconds: Math.floor(new Date(t1).getTime() / 1e3),
                        nanos: e
                    };
                }
                return {
                    seconds: yt(t1.seconds),
                    nanos: yt(t1.nanos)
                };
            }
            function yt(t1) {
                return "number" == typeof t1 ? t1 : "string" == typeof t1 ? Number(t1) : 0;
            }
            function pt(t1) {
                return "string" == typeof t1 ? _t.fromBase64String(t1) : _t.fromUint8Array(t1);
            }
            function Tt(t1) {
                var e, n1;
                return "server_timestamp" === (null === (n1 = ((null === (e = null == t1 ? void 0 : t1.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n1 ? void 0 : n1.stringValue);
            }
            function It(t1) {
                const e = gt(t1.mapValue.fields.__local_write_time__.timestampValue);
                return new it(e.seconds, e.nanos);
            }
            function At(t1) {
                return null == t1;
            }
            function Rt(t1) {
                return 0 === t1 && 1 / t1 == -1 / 0;
            }
            class Pt {
                constructor(t1){
                    this.path = t1;
                }
                static fromPath(t1) {
                    return new Pt(ht.fromString(t1));
                }
                static fromName(t1) {
                    return new Pt(ht.fromString(t1).popFirst(5));
                }
                hasCollectionId(t1) {
                    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t1;
                }
                isEqual(t1) {
                    return null !== t1 && 0 === ht.comparator(this.path, t1.path);
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t1, e) {
                    return ht.comparator(t1.path, e.path);
                }
                static isDocumentKey(t1) {
                    return t1.length % 2 == 0;
                }
                static fromSegments(t1) {
                    return new Pt(new ht(t1.slice()));
                }
            }
            function vt(t1) {
                return "nullValue" in t1 ? 0 : "booleanValue" in t1 ? 1 : "integerValue" in t1 || "doubleValue" in t1 ? 2 : "timestampValue" in t1 ? 3 : "stringValue" in t1 ? 5 : "bytesValue" in t1 ? 6 : "referenceValue" in t1 ? 7 : "geoPointValue" in t1 ? 8 : "arrayValue" in t1 ? 9 : "mapValue" in t1 ? Tt(t1) ? 4 : 10 : L();
            }
            function Vt(t1, e) {
                const n1 = vt(t1);
                if (n1 !== vt(e)) return !1;
                switch(n1){
                    case 0:
                        return !0;
                    case 1:
                        return t1.booleanValue === e.booleanValue;
                    case 4:
                        return It(t1).isEqual(It(e));
                    case 3:
                        return function(t1, e) {
                            if ("string" == typeof t1.timestampValue && "string" == typeof e.timestampValue && t1.timestampValue.length === e.timestampValue.length) return t1.timestampValue === e.timestampValue;
                            const n1 = gt(t1.timestampValue), s = gt(e.timestampValue);
                            return n1.seconds === s.seconds && n1.nanos === s.nanos;
                        }(t1, e);
                    case 5:
                        return t1.stringValue === e.stringValue;
                    case 6:
                        return pt(t1.bytesValue).isEqual(pt(e.bytesValue));
                    case 7:
                        return t1.referenceValue === e.referenceValue;
                    case 8:
                        return yt(t1.geoPointValue.latitude) === yt(e.geoPointValue.latitude) && yt(t1.geoPointValue.longitude) === yt(e.geoPointValue.longitude);
                    case 2:
                        return function(t1, e) {
                            if ("integerValue" in t1 && "integerValue" in e) return yt(t1.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t1 && "doubleValue" in e) {
                                const n1 = yt(t1.doubleValue), s = yt(e.doubleValue);
                                return n1 === s ? Rt(n1) === Rt(s) : isNaN(n1) && isNaN(s);
                            }
                            return !1;
                        }(t1, e);
                    case 9:
                        return nt(t1.arrayValue.values || [], e.arrayValue.values || [], Vt);
                    case 10:
                        return function(t1, e) {
                            const n1 = t1.mapValue.fields || {}, s = e.mapValue.fields || {};
                            if (ot(n1) !== ot(s)) return !1;
                            for(const t1 in n1)if (n1.hasOwnProperty(t1) && (void 0 === s[t1] || !Vt(n1[t1], s[t1]))) return !1;
                            return !0;
                        }(t1, e);
                    default:
                        return L();
                }
            }
            function St(t1, e) {
                return void 0 !== (t1.values || []).find((t1)=>Vt(t1, e));
            }
            function Dt(t1, e) {
                const n1 = vt(t1), s = vt(e);
                if (n1 !== s) return et(n1, s);
                switch(n1){
                    case 0:
                        return 0;
                    case 1:
                        return et(t1.booleanValue, e.booleanValue);
                    case 2:
                        return function(t1, e) {
                            const n1 = yt(t1.integerValue || t1.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n1 < s ? -1 : n1 > s ? 1 : n1 === s ? 0 : isNaN(n1) ? isNaN(s) ? 0 : -1 : 1;
                        }(t1, e);
                    case 3:
                        return Ct(t1.timestampValue, e.timestampValue);
                    case 4:
                        return Ct(It(t1), It(e));
                    case 5:
                        return et(t1.stringValue, e.stringValue);
                    case 6:
                        return function(t1, e) {
                            const n1 = pt(t1), s = pt(e);
                            return n1.compareTo(s);
                        }(t1.bytesValue, e.bytesValue);
                    case 7:
                        return function(t1, e) {
                            const n1 = t1.split("/"), s = e.split("/");
                            for(let t1 = 0; t1 < n1.length && t1 < s.length; t1++){
                                const e = et(n1[t1], s[t1]);
                                if (0 !== e) return e;
                            }
                            return et(n1.length, s.length);
                        }(t1.referenceValue, e.referenceValue);
                    case 8:
                        return function(t1, e) {
                            const n1 = et(yt(t1.latitude), yt(e.latitude));
                            return 0 !== n1 ? n1 : et(yt(t1.longitude), yt(e.longitude));
                        }(t1.geoPointValue, e.geoPointValue);
                    case 9:
                        return function(t1, e) {
                            const n1 = t1.values || [], s = e.values || [];
                            for(let t1 = 0; t1 < n1.length && t1 < s.length; ++t1){
                                const e = Dt(n1[t1], s[t1]);
                                if (e) return e;
                            }
                            return et(n1.length, s.length);
                        }(t1.arrayValue, e.arrayValue);
                    case 10:
                        return function(t1, e) {
                            const n1 = t1.fields || {}, s = Object.keys(n1), i = e.fields || {}, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t1 = 0; t1 < s.length && t1 < r.length; ++t1){
                                const e = et(s[t1], r[t1]);
                                if (0 !== e) return e;
                                const o = Dt(n1[s[t1]], i[r[t1]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        }(t1.mapValue, e.mapValue);
                    default:
                        throw L();
                }
            }
            function Ct(t1, e) {
                if ("string" == typeof t1 && "string" == typeof e && t1.length === e.length) return et(t1, e);
                const n1 = gt(t1), s = gt(e), i = et(n1.seconds, s.seconds);
                return 0 !== i ? i : et(n1.nanos, s.nanos);
            }
            function xt(t1) {
                var e, n1;
                return "nullValue" in t1 ? "null" : "booleanValue" in t1 ? "" + t1.booleanValue : "integerValue" in t1 ? "" + t1.integerValue : "doubleValue" in t1 ? "" + t1.doubleValue : "timestampValue" in t1 ? function(t1) {
                    const e = gt(t1);
                    return `time(${e.seconds},${e.nanos})`;
                }(t1.timestampValue) : "stringValue" in t1 ? t1.stringValue : "bytesValue" in t1 ? pt(t1.bytesValue).toBase64() : "referenceValue" in t1 ? (n1 = t1.referenceValue, Pt.fromName(n1).toString()) : "geoPointValue" in t1 ? `geo(${(e = t1.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t1 ? function(t1) {
                    let e = "[", n1 = !0;
                    for (const s of t1.values || [])n1 ? n1 = !1 : e += ",", e += xt(s);
                    return e + "]";
                }(t1.arrayValue) : "mapValue" in t1 ? function(t1) {
                    const e = Object.keys(t1.fields || {}).sort();
                    let n1 = "{", s = !0;
                    for (const i of e)s ? s = !1 : n1 += ",", n1 += `${i}:${xt(t1.fields[i])}`;
                    return n1 + "}";
                }(t1.mapValue) : L();
            }
            function $t(t1) {
                return !!t1 && "integerValue" in t1;
            }
            function Ot(t1) {
                return !!t1 && "arrayValue" in t1;
            }
            function Ft(t1) {
                return !!t1 && "nullValue" in t1;
            }
            function Mt(t1) {
                return !!t1 && "doubleValue" in t1 && isNaN(Number(t1.doubleValue));
            }
            function Lt(t1) {
                return !!t1 && "mapValue" in t1;
            }
            function Bt(t1) {
                if (t1.geoPointValue) return {
                    geoPointValue: Object.assign({}, t1.geoPointValue)
                };
                if (t1.timestampValue && "object" == typeof t1.timestampValue) return {
                    timestampValue: Object.assign({}, t1.timestampValue)
                };
                if (t1.mapValue) {
                    const e = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return ct(t1.mapValue.fields, (t1, n1)=>e.mapValue.fields[t1] = Bt(n1)), e;
                }
                if (t1.arrayValue) {
                    const e = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let n1 = 0; n1 < (t1.arrayValue.values || []).length; ++n1)e.arrayValue.values[n1] = Bt(t1.arrayValue.values[n1]);
                    return e;
                }
                return Object.assign({}, t1);
            }
            class Ut {
                constructor(t1){
                    this.value = t1;
                }
                static empty() {
                    return new Ut({
                        mapValue: {}
                    });
                }
                field(t1) {
                    if (t1.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n1 = 0; n1 < t1.length - 1; ++n1)if (!Lt(e = (e.mapValue.fields || {})[t1.get(n1)])) return null;
                        return (e = (e.mapValue.fields || {})[t1.lastSegment()]) || null;
                    }
                }
                set(t1, e) {
                    this.getFieldsMap(t1.popLast())[t1.lastSegment()] = Bt(e);
                }
                setAll(t1) {
                    let e = ft.emptyPath(), n1 = {}, s = [];
                    t1.forEach((t1, i)=>{
                        if (!e.isImmediateParentOf(i)) {
                            const t1 = this.getFieldsMap(e);
                            this.applyChanges(t1, n1, s), n1 = {}, s = [], e = i.popLast();
                        }
                        t1 ? n1[i.lastSegment()] = Bt(t1) : s.push(i.lastSegment());
                    });
                    const i = this.getFieldsMap(e);
                    this.applyChanges(i, n1, s);
                }
                delete(t1) {
                    const e = this.field(t1.popLast());
                    Lt(e) && e.mapValue.fields && delete e.mapValue.fields[t1.lastSegment()];
                }
                isEqual(t1) {
                    return Vt(this.value, t1.value);
                }
                getFieldsMap(t1) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {}
                    });
                    for(let n1 = 0; n1 < t1.length; ++n1){
                        let s = e.mapValue.fields[t1.get(n1)];
                        Lt(s) && s.mapValue.fields || (s = {
                            mapValue: {
                                fields: {}
                            }
                        }, e.mapValue.fields[t1.get(n1)] = s), e = s;
                    }
                    return e.mapValue.fields;
                }
                applyChanges(t1, e, n1) {
                    for (const e1 of (ct(e, (e, n1)=>t1[e] = n1), n1))delete t1[e1];
                }
                clone() {
                    return new Ut(Bt(this.value));
                }
            }
            class Kt {
                constructor(t1, e, n1, s, i){
                    this.key = t1, this.documentType = e, this.version = n1, this.data = s, this.documentState = i;
                }
                static newInvalidDocument(t1) {
                    return new Kt(t1, 0, rt.min(), Ut.empty(), 0);
                }
                static newFoundDocument(t1, e, n1) {
                    return new Kt(t1, 1, e, n1, 0);
                }
                static newNoDocument(t1, e) {
                    return new Kt(t1, 2, e, Ut.empty(), 0);
                }
                static newUnknownDocument(t1, e) {
                    return new Kt(t1, 3, e, Ut.empty(), 2);
                }
                convertToFoundDocument(t1, e) {
                    return this.version = t1, this.documentType = 1, this.data = e, this.documentState = 0, this;
                }
                convertToNoDocument(t1) {
                    return this.version = t1, this.documentType = 2, this.data = Ut.empty(), this.documentState = 0, this;
                }
                convertToUnknownDocument(t1) {
                    return this.version = t1, this.documentType = 3, this.data = Ut.empty(), this.documentState = 2, this;
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
                isEqual(t1) {
                    return t1 instanceof Kt && this.key.isEqual(t1.key) && this.version.isEqual(t1.version) && this.documentType === t1.documentType && this.documentState === t1.documentState && this.data.isEqual(t1.data);
                }
                clone() {
                    return new Kt(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class jt {
                constructor(t1, e = null, n1 = [], s = [], i = null, r = null, o = null){
                    this.path = t1, this.collectionGroup = e, this.orderBy = n1, this.filters = s, this.limit = i, this.startAt = r, this.endAt = o, this.A = null;
                }
            }
            function Qt(t1, e = null, n1 = [], s = [], i = null, r = null, o = null) {
                return new jt(t1, e, n1, s, i, r, o);
            }
            function Wt(t1) {
                if (null === t1.A) {
                    let t2 = t1.path.canonicalString();
                    null !== t1.collectionGroup && (t2 += "|cg:" + t1.collectionGroup), t2 += "|f:" + t1.filters.map((t1)=>t1.field.canonicalString() + t1.op.toString() + xt(t1.value)).join(",") + "|ob:" + t1.orderBy.map((t1)=>t1.field.canonicalString() + t1.dir).join(","), At(t1.limit) || (t2 += "|l:" + t1.limit), t1.startAt && (t2 += "|lb:" + ce(t1.startAt)), t1.endAt && (t2 += "|ub:" + ce(t1.endAt)), t1.A = t2;
                }
                return t1.A;
            }
            function zt(t1, e) {
                var n1, s, t2, e1;
                if (t1.limit !== e.limit || t1.orderBy.length !== e.orderBy.length) return !1;
                for(let n1 = 0; n1 < t1.orderBy.length; n1++)if (t2 = t1.orderBy[n1], e1 = e.orderBy[n1], !(t2.dir === e1.dir && t2.field.isEqual(e1.field))) return !1;
                if (t1.filters.length !== e.filters.length) return !1;
                for(let i = 0; i < t1.filters.length; i++)if (n1 = t1.filters[i], s = e.filters[i], n1.op !== s.op || !n1.field.isEqual(s.field) || !Vt(n1.value, s.value)) return !1;
                return t1.collectionGroup === e.collectionGroup && !!t1.path.isEqual(e.path) && !!le(t1.startAt, e.startAt) && le(t1.endAt, e.endAt);
            }
            function Ht(t1) {
                return Pt.isDocumentKey(t1.path) && null === t1.collectionGroup && 0 === t1.filters.length;
            }
            class Jt extends class {
            } {
                constructor(t1, e, n1){
                    super(), this.field = t1, this.op = e, this.value = n1;
                }
                static create(t1, e, n1) {
                    return t1.isKeyField() ? "in" === e || "not-in" === e ? this.R(t1, e, n1) : new Xt(t1, e, n1) : "array-contains" === e ? new ne(t1, n1) : "in" === e ? new se(t1, n1) : "not-in" === e ? new ie(t1, n1) : "array-contains-any" === e ? new re(t1, n1) : new Jt(t1, e, n1);
                }
                static R(t1, e, n1) {
                    return "in" === e ? new Zt(t1, n1) : new te(t1, n1);
                }
                matches(t1) {
                    const e = t1.data.field(this.field);
                    return "!=" === this.op ? null !== e && this.P(Dt(e, this.value)) : null !== e && vt(this.value) === vt(e) && this.P(Dt(e, this.value));
                }
                P(t1) {
                    switch(this.op){
                        case "<":
                            return t1 < 0;
                        case "<=":
                            return t1 <= 0;
                        case "==":
                            return 0 === t1;
                        case "!=":
                            return 0 !== t1;
                        case ">":
                            return t1 > 0;
                        case ">=":
                            return t1 >= 0;
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
                constructor(t1, e, n1){
                    super(t1, e, n1), this.key = Pt.fromName(n1.referenceValue);
                }
                matches(t1) {
                    const e = Pt.comparator(t1.key, this.key);
                    return this.P(e);
                }
            }
            class Zt extends Jt {
                constructor(t1, e){
                    super(t1, "in", e), this.keys = ee("in", e);
                }
                matches(t1) {
                    return this.keys.some((e)=>e.isEqual(t1.key));
                }
            }
            class te extends Jt {
                constructor(t1, e){
                    super(t1, "not-in", e), this.keys = ee("not-in", e);
                }
                matches(t1) {
                    return !this.keys.some((e)=>e.isEqual(t1.key));
                }
            }
            function ee(t1, e) {
                var n1;
                return ((null === (n1 = e.arrayValue) || void 0 === n1 ? void 0 : n1.values) || []).map((t1)=>Pt.fromName(t1.referenceValue));
            }
            class ne extends Jt {
                constructor(t1, e){
                    super(t1, "array-contains", e);
                }
                matches(t1) {
                    const e = t1.data.field(this.field);
                    return Ot(e) && St(e.arrayValue, this.value);
                }
            }
            class se extends Jt {
                constructor(t1, e){
                    super(t1, "in", e);
                }
                matches(t1) {
                    const e = t1.data.field(this.field);
                    return null !== e && St(this.value.arrayValue, e);
                }
            }
            class ie extends Jt {
                constructor(t1, e){
                    super(t1, "not-in", e);
                }
                matches(t1) {
                    if (St(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t1.data.field(this.field);
                    return null !== e && !St(this.value.arrayValue, e);
                }
            }
            class re extends Jt {
                constructor(t1, e){
                    super(t1, "array-contains-any", e);
                }
                matches(t1) {
                    const e = t1.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t1)=>St(this.value.arrayValue, t1));
                }
            }
            class oe {
                constructor(t1, e){
                    this.position = t1, this.before = e;
                }
            }
            function ce(t1) {
                return `${t1.before ? "b" : "a"}:${t1.position.map((t1)=>xt(t1)).join(",")}`;
            }
            class ae {
                constructor(t1, e = "asc"){
                    this.field = t1, this.dir = e;
                }
            }
            function he(t1, e, n1) {
                let s = 0;
                for(let i = 0; i < t1.position.length; i++){
                    const r = e[i], o = t1.position[i];
                    if (s = r.field.isKeyField() ? Pt.comparator(Pt.fromName(o.referenceValue), n1.key) : Dt(o, n1.data.field(r.field)), "desc" === r.dir && (s *= -1), 0 !== s) break;
                }
                return t1.before ? s <= 0 : s < 0;
            }
            function le(t1, e) {
                if (null === t1) return null === e;
                if (null === e || t1.before !== e.before || t1.position.length !== e.position.length) return !1;
                for(let n1 = 0; n1 < t1.position.length; n1++)if (!Vt(t1.position[n1], e.position[n1])) return !1;
                return !0;
            }
            class fe {
                constructor(t1, e = null, n1 = [], s = [], i = null, r = "F", o = null, c = null){
                    this.path = t1, this.collectionGroup = e, this.explicitOrderBy = n1, this.filters = s, this.limit = i, this.limitType = r, this.startAt = o, this.endAt = c, this.V = null, this.S = null, this.startAt, this.endAt;
                }
            }
            function _e(t1) {
                return !At(t1.limit) && "F" === t1.limitType;
            }
            function me(t1) {
                return !At(t1.limit) && "L" === t1.limitType;
            }
            function Te(t1) {
                if (null === t1.V) {
                    t1.V = [];
                    const t2 = function(t1) {
                        for (const e of t1.filters)if (e.v()) return e.field;
                        return null;
                    }(t1), n1 = t1.explicitOrderBy.length > 0 ? t1.explicitOrderBy[0].field : null;
                    if (null !== t2 && null === n1) t2.isKeyField() || t1.V.push(new ae(t2)), t1.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t2 = !1;
                        for (const n1 of t1.explicitOrderBy)t1.V.push(n1), n1.field.isKeyField() && (t2 = !0);
                        if (!t2) {
                            const t2 = t1.explicitOrderBy.length > 0 ? t1.explicitOrderBy[t1.explicitOrderBy.length - 1].dir : "asc";
                            t1.V.push(new ae(ft.keyField(), t2));
                        }
                    }
                }
                return t1.V;
            }
            function Ee(t1) {
                if (!t1.S) {
                    if ("F" === t1.limitType) t1.S = Qt(t1.path, t1.collectionGroup, Te(t1), t1.filters, t1.limit, t1.startAt, t1.endAt);
                    else {
                        const t2 = [];
                        for (const n1 of Te(t1)){
                            const e = "desc" === n1.dir ? "asc" : "desc";
                            t2.push(new ae(n1.field, e));
                        }
                        const n1 = t1.endAt ? new oe(t1.endAt.position, !t1.endAt.before) : null, s = t1.startAt ? new oe(t1.startAt.position, !t1.startAt.before) : null;
                        t1.S = Qt(t1.path, t1.collectionGroup, t2, t1.filters, t1.limit, n1, s);
                    }
                }
                return t1.S;
            }
            function Ae(t1, e) {
                return zt(Ee(t1), Ee(e)) && t1.limitType === e.limitType;
            }
            function Re(t1) {
                return `${Wt(Ee(t1))}|lt:${t1.limitType}`;
            }
            function be(t1) {
                var t2;
                let e;
                return `Query(target=${e = (t2 = Ee(t1)).path.canonicalString(), null !== t2.collectionGroup && (e += " collectionGroup=" + t2.collectionGroup), t2.filters.length > 0 && (e += `, filters: [${t2.filters.map((t1)=>`${t1.field.canonicalString()} ${t1.op} ${xt(t1.value)}`).join(", ")}]`), At(t2.limit) || (e += ", limit: " + t2.limit), t2.orderBy.length > 0 && (e += `, orderBy: [${t2.orderBy.map((t1)=>`${t1.field.canonicalString()} (${t1.dir})`).join(", ")}]`), t2.startAt && (e += ", startAt: " + ce(t2.startAt)), t2.endAt && (e += ", endAt: " + ce(t2.endAt)), `Target(${e})`}; limitType=${t1.limitType})`;
            }
            function Pe(t1, e) {
                return e.isFoundDocument() && function(t1, e) {
                    const n1 = e.key.path;
                    return null !== t1.collectionGroup ? e.key.hasCollectionId(t1.collectionGroup) && t1.path.isPrefixOf(n1) : Pt.isDocumentKey(t1.path) ? t1.path.isEqual(n1) : t1.path.isImmediateParentOf(n1);
                }(t1, e) && function(t1, e) {
                    for (const n1 of t1.explicitOrderBy)if (!n1.field.isKeyField() && null === e.data.field(n1.field)) return !1;
                    return !0;
                }(t1, e) && function(t1, e) {
                    for (const n1 of t1.filters)if (!n1.matches(e)) return !1;
                    return !0;
                }(t1, e) && !(t1.startAt && !he(t1.startAt, Te(t1), e) || t1.endAt && he(t1.endAt, Te(t1), e));
            }
            function ve(t1) {
                return (e, n1)=>{
                    let s = !1;
                    for (const i of Te(t1)){
                        const t1 = function(t1, e, n1) {
                            const s = t1.field.isKeyField() ? Pt.comparator(e.key, n1.key) : function(t1, e, n1) {
                                const s = e.data.field(t1), i = n1.data.field(t1);
                                return null !== s && null !== i ? Dt(s, i) : L();
                            }(t1.field, e, n1);
                            switch(t1.dir){
                                case "asc":
                                    return s;
                                case "desc":
                                    return -1 * s;
                                default:
                                    return L();
                            }
                        }(i, e, n1);
                        if (0 !== t1) return t1;
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
                constructor(t1){
                    super(), this.elements = t1;
                }
            }
            function Me(t1, e) {
                const n1 = Ke(e);
                for (const e of t1.elements)n1.some((t1)=>Vt(t1, e)) || n1.push(e);
                return {
                    arrayValue: {
                        values: n1
                    }
                };
            }
            class Le extends Ne {
                constructor(t1){
                    super(), this.elements = t1;
                }
            }
            function Be(t1, e) {
                let n1 = Ke(e);
                for (const e of t1.elements)n1 = n1.filter((t1)=>!Vt(t1, e));
                return {
                    arrayValue: {
                        values: n1
                    }
                };
            }
            class Ue extends Ne {
                constructor(t1, e){
                    super(), this.N = t1, this.C = e;
                }
            }
            function qe(t1) {
                return yt(t1.integerValue || t1.doubleValue);
            }
            function Ke(t1) {
                return Ot(t1) && t1.arrayValue.values ? t1.arrayValue.values.slice() : [];
            }
            function ze(t1, e) {
                return void 0 !== t1.updateTime ? e.isFoundDocument() && e.version.isEqual(t1.updateTime) : void 0 === t1.exists || t1.exists === e.isFoundDocument();
            }
            class He {
            }
            function Ye(t1, e, n1) {
                t1 instanceof en ? function(t1, e, n1) {
                    if (!ze(t1.precondition, e)) return;
                    const s = t1.value.clone(), i = on(t1.fieldTransforms, n1, e);
                    s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                }(t1, e, n1) : t1 instanceof nn ? function(t1, e, n1) {
                    if (!ze(t1.precondition, e)) return;
                    const s = on(t1.fieldTransforms, n1, e), i = e.data;
                    i.setAll(sn(t1)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                }(t1, e, n1) : ze(t1.precondition, e) && e.convertToNoDocument(rt.min());
            }
            function Ze(t1, e) {
                var t2, e1;
                return t1.type === e.type && !!t1.key.isEqual(e.key) && !!t1.precondition.isEqual(e.precondition) && (t2 = t1.fieldTransforms, e1 = e.fieldTransforms, !!(void 0 === t2 && void 0 === e1 || !(!t2 || !e1) && nt(t2, e1, (t1, e)=>{
                    var t2, e1;
                    return t1.field.isEqual(e.field) && (t2 = t1.transform, e1 = e.transform, t2 instanceof Fe && e1 instanceof Fe || t2 instanceof Le && e1 instanceof Le ? nt(t2.elements, e1.elements, Vt) : t2 instanceof Ue && e1 instanceof Ue ? Vt(t2.C, e1.C) : t2 instanceof Oe && e1 instanceof Oe);
                }))) && (0 === t1.type ? t1.value.isEqual(e.value) : 1 !== t1.type || t1.data.isEqual(e.data) && t1.fieldMask.isEqual(e.fieldMask));
            }
            function tn(t1) {
                return t1.isFoundDocument() ? t1.version : rt.min();
            }
            class en extends He {
                constructor(t1, e, n1, s = []){
                    super(), this.key = t1, this.value = e, this.precondition = n1, this.fieldTransforms = s, this.type = 0;
                }
            }
            class nn extends He {
                constructor(t1, e, n1, s, i = []){
                    super(), this.key = t1, this.data = e, this.fieldMask = n1, this.precondition = s, this.fieldTransforms = i, this.type = 1;
                }
            }
            function sn(t1) {
                const e = new Map();
                return t1.fieldMask.fields.forEach((n1)=>{
                    if (!n1.isEmpty()) {
                        const s = t1.data.field(n1);
                        e.set(n1, s);
                    }
                }), e;
            }
            function rn(t1, e, n1) {
                const s = new Map();
                t1.length === n1.length || L();
                for(let i = 0; i < n1.length; i++){
                    var n2;
                    const r = t1[i], o = r.transform, c = e.data.field(r.field);
                    s.set(r.field, (n2 = n1[i], o instanceof Fe ? Me(o, c) : o instanceof Le ? Be(o, c) : n2));
                }
                return s;
            }
            function on(t1, e, n1) {
                const s = new Map();
                for (const i of t1){
                    const t1 = i.transform, r = n1.data.field(i.field);
                    s.set(i.field, t1 instanceof Oe ? function(t1, e) {
                        const n1 = {
                            fields: {
                                __type__: {
                                    stringValue: "server_timestamp"
                                },
                                __local_write_time__: {
                                    timestampValue: {
                                        seconds: t1.seconds,
                                        nanos: t1.nanoseconds
                                    }
                                }
                            }
                        };
                        return e && (n1.fields.__previous_value__ = e), {
                            mapValue: n1
                        };
                    }(e, r) : t1 instanceof Fe ? Me(t1, r) : t1 instanceof Le ? Be(t1, r) : function(t1, e) {
                        const n1 = t1 instanceof Ue ? $t(e) || e && "doubleValue" in e ? e : {
                            integerValue: 0
                        } : null, s = qe(n1) + qe(t1.C);
                        return $t(n1) && $t(t1.C) ? {
                            integerValue: "" + s
                        } : function(t1, e) {
                            if (t1.D) {
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
                        }(t1.N, s);
                    }(t1, r));
                }
                return s;
            }
            class un {
                constructor(t1){
                    this.count = t1;
                }
            }
            function dn(t1) {
                if (void 0 === t1) return O("GRPC error has no .code"), K.UNKNOWN;
                switch(t1){
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
                constructor(t1, e){
                    this.comparator = t1, this.root = e || mn.EMPTY;
                }
                insert(t1, e) {
                    return new wn(this.comparator, this.root.insert(t1, e, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                remove(t1) {
                    return new wn(this.comparator, this.root.remove(t1, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                get(t1) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n1 = this.comparator(t1, e.key);
                        if (0 === n1) return e.value;
                        n1 < 0 ? e = e.left : n1 > 0 && (e = e.right);
                    }
                    return null;
                }
                indexOf(t1) {
                    let e = 0, n1 = this.root;
                    for(; !n1.isEmpty();){
                        const s = this.comparator(t1, n1.key);
                        if (0 === s) return e + n1.left.size;
                        s < 0 ? n1 = n1.left : (e += n1.left.size + 1, n1 = n1.right);
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
                inorderTraversal(t1) {
                    return this.root.inorderTraversal(t1);
                }
                forEach(t1) {
                    this.inorderTraversal((e, n1)=>(t1(e, n1), !1));
                }
                toString() {
                    const t1 = [];
                    return this.inorderTraversal((e, n1)=>(t1.push(`${e}:${n1}`), !1)), `{${t1.join(", ")}}`;
                }
                reverseTraversal(t1) {
                    return this.root.reverseTraversal(t1);
                }
                getIterator() {
                    return new _n(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t1) {
                    return new _n(this.root, t1, this.comparator, !1);
                }
                getReverseIterator() {
                    return new _n(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t1) {
                    return new _n(this.root, t1, this.comparator, !0);
                }
            }
            class _n {
                constructor(t1, e, n1, s){
                    this.isReverse = s, this.nodeStack = [];
                    let i = 1;
                    for(; !t1.isEmpty();)if (i = e ? n1(t1.key, e) : 1, s && (i *= -1), i < 0) t1 = this.isReverse ? t1.left : t1.right;
                    else {
                        if (0 === i) {
                            this.nodeStack.push(t1);
                            break;
                        }
                        this.nodeStack.push(t1), t1 = this.isReverse ? t1.right : t1.left;
                    }
                }
                getNext() {
                    let t1 = this.nodeStack.pop();
                    const e = {
                        key: t1.key,
                        value: t1.value
                    };
                    if (this.isReverse) for(t1 = t1.left; !t1.isEmpty();)this.nodeStack.push(t1), t1 = t1.right;
                    else for(t1 = t1.right; !t1.isEmpty();)this.nodeStack.push(t1), t1 = t1.left;
                    return e;
                }
                hasNext() {
                    return this.nodeStack.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack.length) return null;
                    const t1 = this.nodeStack[this.nodeStack.length - 1];
                    return {
                        key: t1.key,
                        value: t1.value
                    };
                }
            }
            class mn {
                constructor(t1, e, n1, s, i){
                    this.key = t1, this.value = e, this.color = null != n1 ? n1 : mn.RED, this.left = null != s ? s : mn.EMPTY, this.right = null != i ? i : mn.EMPTY, this.size = this.left.size + 1 + this.right.size;
                }
                copy(t1, e, n1, s, i) {
                    return new mn(null != t1 ? t1 : this.key, null != e ? e : this.value, null != n1 ? n1 : this.color, null != s ? s : this.left, null != i ? i : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(t1) {
                    return this.left.inorderTraversal(t1) || t1(this.key, this.value) || this.right.inorderTraversal(t1);
                }
                reverseTraversal(t1) {
                    return this.right.reverseTraversal(t1) || t1(this.key, this.value) || this.left.reverseTraversal(t1);
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
                insert(t1, e, n1) {
                    let s = this;
                    const i = n1(t1, s.key);
                    return (s = i < 0 ? s.copy(null, null, null, s.left.insert(t1, e, n1), null) : 0 === i ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t1, e, n1))).fixUp();
                }
                removeMin() {
                    if (this.left.isEmpty()) return mn.EMPTY;
                    let t1 = this;
                    return t1.left.isRed() || t1.left.left.isRed() || (t1 = t1.moveRedLeft()), (t1 = t1.copy(null, null, null, t1.left.removeMin(), null)).fixUp();
                }
                remove(t1, e) {
                    let n1, s = this;
                    if (0 > e(t1, s.key)) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t1, e), null);
                    else {
                        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e(t1, s.key)) {
                            if (s.right.isEmpty()) return mn.EMPTY;
                            n1 = s.right.min(), s = s.copy(n1.key, n1.value, null, null, s.right.removeMin());
                        }
                        s = s.copy(null, null, null, null, s.right.remove(t1, e));
                    }
                    return s.fixUp();
                }
                isRed() {
                    return this.color;
                }
                fixUp() {
                    let t1 = this;
                    return t1.right.isRed() && !t1.left.isRed() && (t1 = t1.rotateLeft()), t1.left.isRed() && t1.left.left.isRed() && (t1 = t1.rotateRight()), t1.left.isRed() && t1.right.isRed() && (t1 = t1.colorFlip()), t1;
                }
                moveRedLeft() {
                    let t1 = this.colorFlip();
                    return t1.right.left.isRed() && (t1 = (t1 = (t1 = t1.copy(null, null, null, null, t1.right.rotateRight())).rotateLeft()).colorFlip()), t1;
                }
                moveRedRight() {
                    let t1 = this.colorFlip();
                    return t1.left.left.isRed() && (t1 = (t1 = t1.rotateRight()).colorFlip()), t1;
                }
                rotateLeft() {
                    const t1 = this.copy(null, null, mn.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, t1, null);
                }
                rotateRight() {
                    const t1 = this.copy(null, null, mn.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, t1);
                }
                colorFlip() {
                    const t1 = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, t1, e);
                }
                checkMaxDepth() {
                    return Math.pow(2, this.check()) <= this.size + 1;
                }
                check() {
                    if (this.isRed() && this.left.isRed() || this.right.isRed()) throw L();
                    const t1 = this.left.check();
                    if (t1 !== this.right.check()) throw L();
                    return t1 + (this.isRed() ? 0 : 1);
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
                copy(t1, e, n1, s, i) {
                    return this;
                }
                insert(t1, e, n1) {
                    return new mn(t1, e);
                }
                remove(t1, e) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(t1) {
                    return !1;
                }
                reverseTraversal(t1) {
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
                constructor(t1){
                    this.comparator = t1, this.data = new wn(this.comparator);
                }
                has(t1) {
                    return null !== this.data.get(t1);
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
                indexOf(t1) {
                    return this.data.indexOf(t1);
                }
                forEach(t1) {
                    this.data.inorderTraversal((e, n1)=>(t1(e), !1));
                }
                forEachInRange(t1, e) {
                    const n1 = this.data.getIteratorFrom(t1[0]);
                    for(; n1.hasNext();){
                        const s = n1.getNext();
                        if (this.comparator(s.key, t1[1]) >= 0) return;
                        e(s.key);
                    }
                }
                forEachWhile(t1, e) {
                    let n1;
                    for(n1 = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n1.hasNext();)if (!t1(n1.getNext().key)) return;
                }
                firstAfterOrEqual(t1) {
                    const e = this.data.getIteratorFrom(t1);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new yn(this.data.getIterator());
                }
                getIteratorFrom(t1) {
                    return new yn(this.data.getIteratorFrom(t1));
                }
                add(t1) {
                    return this.copy(this.data.remove(t1).insert(t1, !0));
                }
                delete(t1) {
                    return this.has(t1) ? this.copy(this.data.remove(t1)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(t1) {
                    let e = this;
                    return e.size < t1.size && (e = t1, t1 = this), t1.forEach((t1)=>{
                        e = e.add(t1);
                    }), e;
                }
                isEqual(t1) {
                    if (!(t1 instanceof gn) || this.size !== t1.size) return !1;
                    const e = this.data.getIterator(), n1 = t1.data.getIterator();
                    for(; e.hasNext();){
                        const t1 = e.getNext().key, s = n1.getNext().key;
                        if (0 !== this.comparator(t1, s)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const t1 = [];
                    return this.forEach((e)=>{
                        t1.push(e);
                    }), t1;
                }
                toString() {
                    const t1 = [];
                    return this.forEach((e)=>t1.push(e)), "SortedSet(" + t1.toString() + ")";
                }
                copy(t1) {
                    const e = new gn(this.comparator);
                    return e.data = t1, e;
                }
            }
            class yn {
                constructor(t1){
                    this.iter = t1;
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
            function Pn(...t1) {
                let e = bn;
                for (const n1 of t1)e = e.add(n1);
                return e;
            }
            const vn = new gn(et);
            class Sn {
                constructor(t1, e, n1, s, i){
                    this.snapshotVersion = t1, this.targetChanges = e, this.targetMismatches = n1, this.documentUpdates = s, this.resolvedLimboDocuments = i;
                }
                static createSynthesizedRemoteEventForCurrentChange(t1, e) {
                    const n1 = new Map();
                    return n1.set(t1, Dn.createSynthesizedTargetChangeForCurrentChange(t1, e)), new Sn(rt.min(), n1, vn, pn, Pn());
                }
            }
            class Dn {
                constructor(t1, e, n1, s, i){
                    this.resumeToken = t1, this.current = e, this.addedDocuments = n1, this.modifiedDocuments = s, this.removedDocuments = i;
                }
                static createSynthesizedTargetChangeForCurrentChange(t1, e) {
                    return new Dn(_t.EMPTY_BYTE_STRING, e, Pn(), Pn(), Pn());
                }
            }
            class Cn {
                constructor(t1, e, n1, s){
                    this.k = t1, this.removedTargetIds = e, this.key = n1, this.$ = s;
                }
            }
            class Nn {
                constructor(t1, e){
                    this.targetId = t1, this.O = e;
                }
            }
            class xn {
                constructor(t1, e, n1 = _t.EMPTY_BYTE_STRING, s = null){
                    this.state = t1, this.targetIds = e, this.resumeToken = n1, this.cause = s;
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
                j(t1) {
                    t1.approximateByteSize() > 0 && (this.U = !0, this.L = t1);
                }
                W() {
                    let t1 = Pn(), e = Pn(), n1 = Pn();
                    return this.M.forEach((s, i)=>{
                        switch(i){
                            case 0:
                                t1 = t1.add(s);
                                break;
                            case 2:
                                e = e.add(s);
                                break;
                            case 1:
                                n1 = n1.add(s);
                                break;
                            default:
                                L();
                        }
                    }), new Dn(this.L, this.B, t1, e, n1);
                }
                G() {
                    this.U = !1, this.M = Fn();
                }
                H(t1, e) {
                    this.U = !0, this.M = this.M.insert(t1, e);
                }
                J(t1) {
                    this.U = !0, this.M = this.M.remove(t1);
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
                constructor(t1){
                    this.tt = t1, this.et = new Map(), this.nt = pn, this.st = On(), this.it = new gn(et);
                }
                rt(t1) {
                    for (const e of t1.k)t1.$ && t1.$.isFoundDocument() ? this.ot(e, t1.$) : this.ct(e, t1.key, t1.$);
                    for (const e of t1.removedTargetIds)this.ct(e, t1.key, t1.$);
                }
                at(t1) {
                    this.forEachTarget(t1, (e)=>{
                        const n1 = this.ut(e);
                        switch(t1.state){
                            case 0:
                                this.ht(e) && n1.j(t1.resumeToken);
                                break;
                            case 1:
                                n1.X(), n1.q || n1.G(), n1.j(t1.resumeToken);
                                break;
                            case 2:
                                n1.X(), n1.q || this.removeTarget(e);
                                break;
                            case 3:
                                this.ht(e) && (n1.Z(), n1.j(t1.resumeToken));
                                break;
                            case 4:
                                this.ht(e) && (this.lt(e), n1.j(t1.resumeToken));
                                break;
                            default:
                                L();
                        }
                    });
                }
                forEachTarget(t1, e) {
                    t1.targetIds.length > 0 ? t1.targetIds.forEach(e) : this.et.forEach((t1, n1)=>{
                        this.ht(n1) && e(n1);
                    });
                }
                ft(t1) {
                    const e = t1.targetId, n1 = t1.O.count, s = this.dt(e);
                    if (s) {
                        const t1 = s.target;
                        if (Ht(t1)) {
                            if (0 === n1) {
                                const n1 = new Pt(t1.path);
                                this.ct(e, n1, Kt.newNoDocument(n1, rt.min()));
                            } else 1 === n1 || L();
                        } else this.wt(e) !== n1 && (this.lt(e), this.it = this.it.add(e));
                    }
                }
                _t(t1) {
                    const e = new Map();
                    this.et.forEach((n1, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n1.current && Ht(i.target)) {
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t1));
                            }
                            n1.K && (e.set(s, n1.W()), n1.G());
                        }
                    });
                    let n1 = Pn();
                    this.st.forEach((t1, e)=>{
                        let s = !0;
                        e.forEachWhile((t1)=>{
                            const e = this.dt(t1);
                            return !e || 2 === e.purpose || (s = !1, !1);
                        }), s && (n1 = n1.add(t1));
                    });
                    const s = new Sn(t1, e, this.it, this.nt, n1);
                    return this.nt = pn, this.st = On(), this.it = new gn(et), s;
                }
                ot(t1, e) {
                    if (!this.ht(t1)) return;
                    const n1 = this.gt(t1, e.key) ? 2 : 0;
                    this.ut(t1).H(e.key, n1), this.nt = this.nt.insert(e.key, e), this.st = this.st.insert(e.key, this.yt(e.key).add(t1));
                }
                ct(t1, e, n1) {
                    if (!this.ht(t1)) return;
                    const s = this.ut(t1);
                    this.gt(t1, e) ? s.H(e, 1) : s.J(e), this.st = this.st.insert(e, this.yt(e).delete(t1)), n1 && (this.nt = this.nt.insert(e, n1));
                }
                removeTarget(t1) {
                    this.et.delete(t1);
                }
                wt(t1) {
                    const e = this.ut(t1).W();
                    return this.tt.getRemoteKeysForTarget(t1).size + e.addedDocuments.size - e.removedDocuments.size;
                }
                Y(t1) {
                    this.ut(t1).Y();
                }
                ut(t1) {
                    let e = this.et.get(t1);
                    return e || (e = new kn(), this.et.set(t1, e)), e;
                }
                yt(t1) {
                    let e = this.st.get(t1);
                    return e || (e = new gn(et), this.st = this.st.insert(t1, e)), e;
                }
                ht(t1) {
                    const e = null !== this.dt(t1);
                    return e || $("WatchChangeAggregator", "Detected inactive target", t1), e;
                }
                dt(t1) {
                    const e = this.et.get(t1);
                    return e && e.q ? null : this.tt.Tt(t1);
                }
                lt(t1) {
                    this.et.set(t1, new kn()), this.tt.getRemoteKeysForTarget(t1).forEach((e)=>{
                        this.ct(t1, e, null);
                    });
                }
                gt(t1, e) {
                    return this.tt.getRemoteKeysForTarget(t1).has(e);
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
                constructor(t1, e){
                    this.databaseId = t1, this.D = e;
                }
            }
            function jn(t1) {
                return t1 || L(), rt.fromTimestamp(function(t1) {
                    const e = gt(t1);
                    return new it(e.seconds, e.nanos);
                }(t1));
            }
            function Wn(t1) {
                const e = ht.fromString(t1);
                return Ts(e) || L(), e;
            }
            function zn(t1, e) {
                const n1 = Wn(e);
                if (n1.get(1) !== t1.databaseId.projectId) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n1.get(1) + " vs " + t1.databaseId.projectId);
                if (n1.get(3) !== t1.databaseId.database) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n1.get(3) + " vs " + t1.databaseId.database);
                return new Pt(Xn(n1));
            }
            function Hn(t1, e) {
                var t2;
                return new ht([
                    "projects",
                    (t2 = t1.databaseId).projectId,
                    "databases",
                    t2.database
                ]).child("documents").child(e).canonicalString();
            }
            function Yn(t1) {
                return new ht([
                    "projects",
                    t1.databaseId.projectId,
                    "databases",
                    t1.databaseId.database
                ]).canonicalString();
            }
            function Xn(t1) {
                return t1.length > 4 && "documents" === t1.get(4) || L(), t1.popFirst(5);
            }
            function ls(t1) {
                return {
                    before: t1.before,
                    values: t1.position
                };
            }
            function fs(t1) {
                const e = !!t1.before;
                return new oe(t1.values || [], e);
            }
            function _s(t1) {
                return {
                    fieldPath: t1.canonicalString()
                };
            }
            function ms(t1) {
                return ft.fromServerFormat(t1.fieldPath);
            }
            function Ts(t1) {
                return t1.length >= 4 && "projects" === t1.get(0) && "databases" === t1.get(2);
            }
            function Es(t1) {
                let e = "";
                for(let n1 = 0; n1 < t1.length; n1++)e.length > 0 && (e += ""), e = function(t1, e) {
                    let n1 = e;
                    const s = t1.length;
                    for(let e = 0; e < s; e++){
                        const s = t1.charAt(e);
                        switch(s){
                            case "\0":
                                n1 += "";
                                break;
                            case "":
                                n1 += "";
                                break;
                            default:
                                n1 += s;
                        }
                    }
                    return n1;
                }(t1.get(n1), e);
                return e + "";
            }
            class Ps {
                constructor(t1, e, n1){
                    this.ownerId = t1, this.allowTabSynchronization = e, this.leaseTimestampMs = n1;
                }
            }
            Ps.store = "owner", Ps.key = "owner";
            class vs {
                constructor(t1, e, n1){
                    this.userId = t1, this.lastAcknowledgedBatchId = e, this.lastStreamToken = n1;
                }
            }
            vs.store = "mutationQueues", vs.keyPath = "userId";
            class Vs {
                constructor(t1, e, n1, s, i){
                    this.userId = t1, this.batchId = e, this.localWriteTimeMs = n1, this.baseMutations = s, this.mutations = i;
                }
            }
            Vs.store = "mutations", Vs.keyPath = "batchId", Vs.userMutationsIndex = "userMutationsIndex", Vs.userMutationsKeyPath = [
                "userId",
                "batchId"
            ];
            class Ss {
                constructor(){}
                static prefixForUser(t1) {
                    return [
                        t1
                    ];
                }
                static prefixForPath(t1, e) {
                    return [
                        t1,
                        Es(e)
                    ];
                }
                static key(t1, e, n1) {
                    return [
                        t1,
                        Es(e),
                        n1
                    ];
                }
            }
            Ss.store = "documentMutations", Ss.PLACEHOLDER = new Ss();
            class Ns {
                constructor(t1, e, n1, s, i, r){
                    this.unknownDocument = t1, this.noDocument = e, this.document = n1, this.hasCommittedMutations = s, this.readTime = i, this.parentPath = r;
                }
            }
            Ns.store = "remoteDocuments", Ns.readTimeIndex = "readTimeIndex", Ns.readTimeIndexPath = "readTime", Ns.collectionReadTimeIndex = "collectionReadTimeIndex", Ns.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime"
            ];
            class xs {
                constructor(t1){
                    this.byteSize = t1;
                }
            }
            xs.store = "remoteDocumentGlobal", xs.key = "remoteDocumentGlobalKey";
            class ks {
                constructor(t1, e, n1, s, i, r, o){
                    this.targetId = t1, this.canonicalId = e, this.readTime = n1, this.resumeToken = s, this.lastListenSequenceNumber = i, this.lastLimboFreeSnapshotVersion = r, this.query = o;
                }
            }
            ks.store = "targets", ks.keyPath = "targetId", ks.queryTargetsIndexName = "queryTargetsIndex", ks.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ];
            class $s {
                constructor(t1, e, n1){
                    this.targetId = t1, this.path = e, this.sequenceNumber = n1;
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
                constructor(t1, e, n1, s){
                    this.highestTargetId = t1, this.highestListenSequenceNumber = e, this.lastRemoteSnapshotVersion = n1, this.targetCount = s;
                }
            }
            Os.key = "targetGlobalKey", Os.store = "targetGlobal";
            class Fs {
                constructor(t1, e){
                    this.collectionId = t1, this.parent = e;
                }
            }
            Fs.store = "collectionParents", Fs.keyPath = [
                "collectionId",
                "parent"
            ];
            class Ms {
                constructor(t1, e, n1, s){
                    this.clientId = t1, this.updateTimeMs = e, this.networkEnabled = n1, this.inForeground = s;
                }
            }
            Ms.store = "clientMetadata", Ms.keyPath = "clientId";
            class Ls {
                constructor(t1, e, n1){
                    this.bundleId = t1, this.createTime = e, this.version = n1;
                }
            }
            Ls.store = "bundles", Ls.keyPath = "bundleId";
            class Bs {
                constructor(t1, e, n1){
                    this.name = t1, this.readTime = e, this.bundledQuery = n1;
                }
            }
            Bs.store = "namedQueries", Bs.keyPath = "name", vs.store, Vs.store, Ss.store, Ns.store, ks.store, Ps.store, Os.store, $s.store, Ms.store, xs.store, Fs.store, Ls.store, Bs.store;
            class Ks {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(t1) {
                    this.onCommittedListeners.push(t1);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((t1)=>t1());
                }
            }
            class js {
                constructor(t1){
                    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, t1((t1)=>{
                        this.isDone = !0, this.result = t1, this.nextCallback && this.nextCallback(t1);
                    }, (t1)=>{
                        this.isDone = !0, this.error = t1, this.catchCallback && this.catchCallback(t1);
                    });
                }
                catch(t1) {
                    return this.next(void 0, t1);
                }
                next(t1, e) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t1, this.result) : new js((n1, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t1, e).next(n1, s);
                        }, this.catchCallback = (t1)=>{
                            this.wrapFailure(e, t1).next(n1, s);
                        };
                    });
                }
                toPromise() {
                    return new Promise((t1, e)=>{
                        this.next(t1, e);
                    });
                }
                wrapUserFunction(t1) {
                    try {
                        const e = t1();
                        return e instanceof js ? e : js.resolve(e);
                    } catch (t1) {
                        return js.reject(t1);
                    }
                }
                wrapSuccess(t1, e) {
                    return t1 ? this.wrapUserFunction(()=>t1(e)) : js.resolve(e);
                }
                wrapFailure(t1, e) {
                    return t1 ? this.wrapUserFunction(()=>t1(e)) : js.reject(e);
                }
                static resolve(t1) {
                    return new js((e, n1)=>{
                        e(t1);
                    });
                }
                static reject(t1) {
                    return new js((e, n1)=>{
                        n1(t1);
                    });
                }
                static waitFor(t1) {
                    return new js((e, n1)=>{
                        let s = 0, i = 0, r = !1;
                        t1.forEach((t1)=>{
                            ++s, t1.next(()=>{
                                ++i, r && i === s && e();
                            }, (t1)=>n1(t1));
                        }), r = !0, i === s && e();
                    });
                }
                static or(t1) {
                    let e = js.resolve(!1);
                    for (const n1 of t1)e = e.next((t1)=>t1 ? js.resolve(t1) : n1());
                    return e;
                }
                static forEach(t1, e) {
                    const n1 = [];
                    return t1.forEach((t1, s)=>{
                        n1.push(e.call(this, t1, s));
                    }), this.waitFor(n1);
                }
            }
            function Hs(t1) {
                return "IndexedDbTransactionError" === t1.name;
            }
            class ni {
                constructor(t1, e, n1, s){
                    this.batchId = t1, this.localWriteTime = e, this.baseMutations = n1, this.mutations = s;
                }
                applyToRemoteDocument(t1, e) {
                    const n1 = e.mutationResults;
                    for(let e = 0; e < this.mutations.length; e++){
                        const s = this.mutations[e];
                        if (s.key.isEqual(t1.key)) {
                            var n2;
                            n2 = n1[e], s instanceof en ? function(t1, e, n1) {
                                const s = t1.value.clone(), i = rn(t1.fieldTransforms, e, n1.transformResults);
                                s.setAll(i), e.convertToFoundDocument(n1.version, s).setHasCommittedMutations();
                            }(s, t1, n2) : s instanceof nn ? function(t1, e, n1) {
                                if (!ze(t1.precondition, e)) return void e.convertToUnknownDocument(n1.version);
                                const s = rn(t1.fieldTransforms, e, n1.transformResults), i = e.data;
                                i.setAll(sn(t1)), i.setAll(s), e.convertToFoundDocument(n1.version, i).setHasCommittedMutations();
                            }(s, t1, n2) : function(t1, e, n1) {
                                e.convertToNoDocument(n1.version).setHasCommittedMutations();
                            }(0, t1, n2);
                        }
                    }
                }
                applyToLocalView(t1) {
                    for (const e of this.baseMutations)e.key.isEqual(t1.key) && Ye(e, t1, this.localWriteTime);
                    for (const e of this.mutations)e.key.isEqual(t1.key) && Ye(e, t1, this.localWriteTime);
                }
                applyToLocalDocumentSet(t1) {
                    this.mutations.forEach((e)=>{
                        const n1 = t1.get(e.key);
                        this.applyToLocalView(n1), n1.isValidDocument() || n1.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t1, e)=>t1.add(e.key), Pn());
                }
                isEqual(t1) {
                    return this.batchId === t1.batchId && nt(this.mutations, t1.mutations, (t1, e)=>Ze(t1, e)) && nt(this.baseMutations, t1.baseMutations, (t1, e)=>Ze(t1, e));
                }
            }
            class ii {
                constructor(t1, e, n1, s, i = rt.min(), r = rt.min(), o = _t.EMPTY_BYTE_STRING){
                    this.target = t1, this.targetId = e, this.purpose = n1, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
                }
                withSequenceNumber(t1) {
                    return new ii(this.target, this.targetId, this.purpose, t1, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(t1, e) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t1);
                }
                withLastLimboFreeSnapshotVersion(t1) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t1, this.resumeToken);
                }
            }
            class ri {
                constructor(t1){
                    this.Wt = t1;
                }
            }
            class pi {
                constructor(){
                    this.Gt = new Ti();
                }
                addToCollectionParentIndex(t1, e) {
                    return this.Gt.add(e), js.resolve();
                }
                getCollectionParents(t1, e) {
                    return js.resolve(this.Gt.getEntries(e));
                }
            }
            class Ti {
                constructor(){
                    this.index = {};
                }
                add(t1) {
                    const e = t1.lastSegment(), n1 = t1.popLast(), s = this.index[e] || new gn(ht.comparator), i = !s.has(n1);
                    return this.index[e] = s.add(n1), i;
                }
                has(t1) {
                    const e = t1.lastSegment(), n1 = t1.popLast(), s = this.index[e];
                    return s && s.has(n1);
                }
                getEntries(t1) {
                    return (this.index[t1] || new gn(ht.comparator)).toArray();
                }
            }
            class Ri {
                constructor(t1, e, n1){
                    this.cacheSizeCollectionThreshold = t1, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n1;
                }
                static withCacheSize(t1) {
                    return new Ri(t1, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            class Ni {
                constructor(t1){
                    this.ne = t1;
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
            async function Fi(t1) {
                if (t1.code !== K.FAILED_PRECONDITION || "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab." !== t1.message) throw t1;
                $("LocalStore", "Unexpectedly lost primary lease");
            }
            class ji {
                constructor(t1, e){
                    this.mapKeyFn = t1, this.equalsFn = e, this.inner = {};
                }
                get(t1) {
                    const e = this.mapKeyFn(t1), n1 = this.inner[e];
                    if (void 0 !== n1) {
                        for (const [e, s] of n1)if (this.equalsFn(e, t1)) return s;
                    }
                }
                has(t1) {
                    return void 0 !== this.get(t1);
                }
                set(t1, e) {
                    const n1 = this.mapKeyFn(t1), s = this.inner[n1];
                    if (void 0 !== s) {
                        for(let n1 = 0; n1 < s.length; n1++)if (this.equalsFn(s[n1][0], t1)) return void (s[n1] = [
                            t1,
                            e
                        ]);
                        s.push([
                            t1,
                            e
                        ]);
                    } else this.inner[n1] = [
                        [
                            t1,
                            e
                        ]
                    ];
                }
                delete(t1) {
                    const e = this.mapKeyFn(t1), n1 = this.inner[e];
                    if (void 0 === n1) return !1;
                    for(let s = 0; s < n1.length; s++)if (this.equalsFn(n1[s][0], t1)) return 1 === n1.length ? delete this.inner[e] : n1.splice(s, 1), !0;
                    return !1;
                }
                forEach(t1) {
                    ct(this.inner, (e, n1)=>{
                        for (const [e, s] of n1)t1(e, s);
                    });
                }
                isEmpty() {
                    return function(t1) {
                        for(const e in t1)if (Object.prototype.hasOwnProperty.call(t1, e)) return !1;
                        return !0;
                    }(this.inner);
                }
            }
            class Qi {
                constructor(){
                    this.changes = new ji((t1)=>t1.toString(), (t1, e)=>t1.isEqual(e)), this.changesApplied = !1;
                }
                getReadTime(t1) {
                    const e = this.changes.get(t1);
                    return e ? e.readTime : rt.min();
                }
                addEntry(t1, e) {
                    this.assertNotApplied(), this.changes.set(t1.key, {
                        document: t1,
                        readTime: e
                    });
                }
                removeEntry(t1, e = null) {
                    this.assertNotApplied(), this.changes.set(t1, {
                        document: Kt.newInvalidDocument(t1),
                        readTime: e
                    });
                }
                getEntry(t1, e) {
                    this.assertNotApplied();
                    const n1 = this.changes.get(e);
                    return void 0 !== n1 ? js.resolve(n1.document) : this.getFromCache(t1, e);
                }
                getEntries(t1, e) {
                    return this.getAllFromCache(t1, e);
                }
                apply(t1) {
                    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t1);
                }
                assertNotApplied() {}
            }
            class rr {
                constructor(t1, e, n1){
                    this.He = t1, this.In = e, this.Ht = n1;
                }
                An(t1, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t1, e).next((n1)=>this.Rn(t1, e, n1));
                }
                Rn(t1, e, n1) {
                    return this.He.getEntry(t1, e).next((t1)=>{
                        for (const e of n1)e.applyToLocalView(t1);
                        return t1;
                    });
                }
                bn(t1, e) {
                    t1.forEach((t1, n1)=>{
                        for (const t1 of e)t1.applyToLocalView(n1);
                    });
                }
                Pn(t1, e) {
                    return this.He.getEntries(t1, e).next((e)=>this.vn(t1, e).next(()=>e));
                }
                vn(t1, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t1, e).next((t1)=>this.bn(e, t1));
                }
                getDocumentsMatchingQuery(t1, e, n1) {
                    return Pt.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length ? this.Vn(t1, e.path) : null !== e.collectionGroup ? this.Sn(t1, e, n1) : this.Dn(t1, e, n1);
                }
                Vn(t1, e) {
                    return this.An(t1, new Pt(e)).next((t1)=>{
                        let e = En;
                        return t1.isFoundDocument() && (e = e.insert(t1.key, t1)), e;
                    });
                }
                Sn(t1, e, n1) {
                    const s = e.collectionGroup;
                    let i = En;
                    return this.Ht.getCollectionParents(t1, s).next((r)=>js.forEach(r, (r)=>{
                            const o = new fe(r.child(s), null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
                            return this.Dn(t1, o, n1).next((t1)=>{
                                t1.forEach((t1, e)=>{
                                    i = i.insert(t1, e);
                                });
                            });
                        }).next(()=>i));
                }
                Dn(t1, e, n1) {
                    let s, i;
                    return this.He.getDocumentsMatchingQuery(t1, e, n1).next((n1)=>(s = n1, this.In.getAllMutationBatchesAffectingQuery(t1, e))).next((e)=>(i = e, this.Cn(t1, i, s).next((t1)=>{
                            for (const t2 of (s = t1, i))for (const e of t2.mutations){
                                const n1 = e.key;
                                let i = s.get(n1);
                                null == i && (i = Kt.newInvalidDocument(n1), s = s.insert(n1, i)), Ye(e, i, t2.localWriteTime), i.isFoundDocument() || (s = s.remove(n1));
                            }
                        }))).next(()=>(s.forEach((t1, n1)=>{
                            Pe(e, n1) || (s = s.remove(t1));
                        }), s));
                }
                Cn(t1, e, n1) {
                    let s = Pn();
                    for (const t1 of e)for (const e of t1.mutations)e instanceof nn && null === n1.get(e.key) && (s = s.add(e.key));
                    let i = n1;
                    return this.He.getEntries(t1, s).next((t1)=>(t1.forEach((t1, e)=>{
                            e.isFoundDocument() && (i = i.insert(t1, e));
                        }), i));
                }
            }
            class or {
                constructor(t1, e, n1, s){
                    this.targetId = t1, this.fromCache = e, this.Nn = n1, this.xn = s;
                }
                static kn(t1, e) {
                    let n1 = Pn(), s = Pn();
                    for (const t1 of e.docChanges)switch(t1.type){
                        case 0:
                            n1 = n1.add(t1.doc.key);
                            break;
                        case 1:
                            s = s.add(t1.doc.key);
                    }
                    return new or(t1, e.fromCache, n1, s);
                }
            }
            class cr {
                $n(t1) {
                    this.On = t1;
                }
                getDocumentsMatchingQuery(t1, e, n1, s) {
                    return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField()) || n1.isEqual(rt.min()) ? this.Fn(t1, e) : this.On.Pn(t1, s).next((i)=>{
                        const r = this.Mn(e, i);
                        return (_e(e) || me(e)) && this.Ln(e.limitType, r, s, n1) ? this.Fn(t1, e) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n1.toString(), be(e)), this.On.getDocumentsMatchingQuery(t1, e, n1).next((t1)=>(r.forEach((e)=>{
                                t1 = t1.insert(e.key, e);
                            }), t1)));
                    });
                }
                Mn(t1, e) {
                    let n1 = new gn(ve(t1));
                    return e.forEach((e, s)=>{
                        Pe(t1, s) && (n1 = n1.add(s));
                    }), n1;
                }
                Ln(t1, e, n1, s) {
                    if (n1.size !== e.size) return !0;
                    const i = "F" === t1 ? e.last() : e.first();
                    return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
                }
                Fn(t1, e) {
                    return x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Using full collection scan to execute query:", be(e)), this.On.getDocumentsMatchingQuery(t1, e, rt.min());
                }
            }
            class ar {
                constructor(t1, e, n1, s){
                    this.persistence = t1, this.Bn = e, this.N = s, this.Un = new wn(et), this.qn = new ji((t1)=>Wt(t1), zt), this.Kn = rt.min(), this.In = t1.getMutationQueue(n1), this.jn = t1.getRemoteDocumentCache(), this.ze = t1.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t1.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t1) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t1.collect(e, this.Un));
                }
            }
            async function hr(t1, e) {
                let s = t1.In, i = t1.Qn;
                const r = await t1.persistence.runTransaction("Handle user change", "readonly", (t2)=>{
                    let r;
                    return t1.In.getAllMutationBatches(t2).next((o)=>(r = o, s = t1.persistence.getMutationQueue(e), i = new rr(t1.jn, s, t1.persistence.getIndexManager()), s.getAllMutationBatches(t2))).next((e)=>{
                        const n1 = [], s = [];
                        let o = Pn();
                        for (const t1 of r)for (const e of (n1.push(t1.batchId), t1.mutations))o = o.add(e.key);
                        for (const t1 of e)for (const e of (s.push(t1.batchId), t1.mutations))o = o.add(e.key);
                        return i.Pn(t2, o).next((t1)=>({
                                Wn: t1,
                                removedBatchIds: n1,
                                addedBatchIds: s
                            }));
                    });
                });
                return t1.In = s, t1.Qn = i, t1.Bn.$n(t1.Qn), r;
            }
            function fr(t1) {
                return t1.persistence.runTransaction("Get last remote snapshot version", "readonly", (t2)=>t1.ze.getLastRemoteSnapshotVersion(t2));
            }
            async function gr(t1, e, n1) {
                const i = t1.Un.get(e);
                try {
                    n1 || await t1.persistence.runTransaction("Release target", n1 ? "readwrite" : "readwrite-primary", (t2)=>t1.persistence.referenceDelegate.removeTarget(t2, i));
                } catch (t1) {
                    if (!Hs(t1)) throw t1;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t1}`);
                }
                t1.Un = t1.Un.remove(e), t1.qn.delete(i.target);
            }
            function yr(t1, e, n1) {
                let i = rt.min(), r = Pn();
                return t1.persistence.runTransaction("Execute query", "readonly", (t2)=>(function(t1, e, n1) {
                        const i = t1.qn.get(n1);
                        return void 0 !== i ? js.resolve(t1.Un.get(i)) : t1.ze.getTargetData(e, n1);
                    })(t1, t2, Ee(e)).next((e)=>{
                        if (e) return i = e.lastLimboFreeSnapshotVersion, t1.ze.getMatchingKeysForTargetId(t2, e.targetId).next((t1)=>{
                            r = t1;
                        });
                    }).next(()=>t1.Bn.getDocumentsMatchingQuery(t2, e, n1 ? i : rt.min(), n1 ? r : Pn())).next((t1)=>({
                            documents: t1,
                            Gn: r
                        })));
            }
            class Rr {
                constructor(t1){
                    this.N = t1, this.Yn = new Map(), this.Xn = new Map();
                }
                getBundleMetadata(t1, e) {
                    return js.resolve(this.Yn.get(e));
                }
                saveBundleMetadata(t1, e) {
                    return this.Yn.set(e.id, {
                        id: e.id,
                        version: e.version,
                        createTime: jn(e.createTime)
                    }), js.resolve();
                }
                getNamedQuery(t1, e) {
                    return js.resolve(this.Xn.get(e));
                }
                saveNamedQuery(t1, e) {
                    return this.Xn.set(e.name, {
                        name: e.name,
                        query: function(t1) {
                            var e;
                            const e1 = function(t1) {
                                var t2;
                                let e, e1 = function(t1) {
                                    const e = Wn(t1);
                                    return 4 === e.length ? ht.emptyPath() : Xn(e);
                                }(t1.parent);
                                const n1 = t1.structuredQuery, s = n1.from ? n1.from.length : 0;
                                let i = null;
                                if (s > 0) {
                                    1 === s || L();
                                    const t1 = n1.from[0];
                                    t1.allDescendants ? i = t1.collectionId : e1 = e1.child(t1.collectionId);
                                }
                                let r = [];
                                n1.where && (r = function hs(t1) {
                                    return t1 ? void 0 !== t1.unaryFilter ? [
                                        function(t1) {
                                            switch(t1.unaryFilter.op){
                                                case "IS_NAN":
                                                    const e = ms(t1.unaryFilter.field);
                                                    return Jt.create(e, "==", {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NULL":
                                                    const n1 = ms(t1.unaryFilter.field);
                                                    return Jt.create(n1, "==", {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                case "IS_NOT_NAN":
                                                    const s = ms(t1.unaryFilter.field);
                                                    return Jt.create(s, "!=", {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NOT_NULL":
                                                    const i = ms(t1.unaryFilter.field);
                                                    return Jt.create(i, "!=", {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                default:
                                                    return L();
                                            }
                                        }(t1)
                                    ] : void 0 !== t1.fieldFilter ? [
                                        Jt.create(ms(t1.fieldFilter.field), function(t1) {
                                            switch(t1){
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
                                        }(t1.fieldFilter.op), t1.fieldFilter.value)
                                    ] : void 0 !== t1.compositeFilter ? t1.compositeFilter.filters.map((t1)=>hs(t1)).reduce((t1, e)=>t1.concat(e)) : L() : [];
                                }(n1.where));
                                let o = [];
                                n1.orderBy && (o = n1.orderBy.map((t1)=>new ae(ms(t1.field), function(t1) {
                                        switch(t1){
                                            case "ASCENDING":
                                                return "asc";
                                            case "DESCENDING":
                                                return "desc";
                                            default:
                                                return;
                                        }
                                    }(t1.direction))));
                                let c = null;
                                n1.limit && (c = At(e = "object" == typeof (t2 = n1.limit) ? t2.value : t2) ? null : e);
                                let a = null;
                                n1.startAt && (a = fs(n1.startAt));
                                let u = null;
                                return n1.endAt && (u = fs(n1.endAt)), new fe(e1, i, o, r, c, "F", a, u);
                            }({
                                parent: t1.parent,
                                structuredQuery: t1.structuredQuery
                            });
                            return "LAST" === t1.limitType ? (e = e1.limit, new fe(e1.path, e1.collectionGroup, e1.explicitOrderBy.slice(), e1.filters.slice(), e, "L", e1.startAt, e1.endAt)) : e1;
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
                addReference(t1, e) {
                    const n1 = new Pr(t1, e);
                    this.Zn = this.Zn.add(n1), this.es = this.es.add(n1);
                }
                ss(t1, e) {
                    t1.forEach((t1)=>this.addReference(t1, e));
                }
                removeReference(t1, e) {
                    this.rs(new Pr(t1, e));
                }
                os(t1, e) {
                    t1.forEach((t1)=>this.removeReference(t1, e));
                }
                cs(t1) {
                    const e = new Pt(new ht([])), n1 = new Pr(e, t1), s = new Pr(e, t1 + 1), i = [];
                    return this.es.forEachInRange([
                        n1,
                        s
                    ], (t1)=>{
                        this.rs(t1), i.push(t1.key);
                    }), i;
                }
                us() {
                    this.Zn.forEach((t1)=>this.rs(t1));
                }
                rs(t1) {
                    this.Zn = this.Zn.delete(t1), this.es = this.es.delete(t1);
                }
                hs(t1) {
                    const e = new Pt(new ht([])), n1 = new Pr(e, t1), s = new Pr(e, t1 + 1);
                    let i = Pn();
                    return this.es.forEachInRange([
                        n1,
                        s
                    ], (t1)=>{
                        i = i.add(t1.key);
                    }), i;
                }
                containsKey(t1) {
                    const e = new Pr(t1, 0), n1 = this.Zn.firstAfterOrEqual(e);
                    return null !== n1 && t1.isEqual(n1.key);
                }
            }
            class Pr {
                constructor(t1, e){
                    this.key = t1, this.ls = e;
                }
                static ts(t1, e) {
                    return Pt.comparator(t1.key, e.key) || et(t1.ls, e.ls);
                }
                static ns(t1, e) {
                    return et(t1.ls, e.ls) || Pt.comparator(t1.key, e.key);
                }
            }
            class vr {
                constructor(t1, e){
                    this.Ht = t1, this.referenceDelegate = e, this.In = [], this.fs = 1, this.ds = new gn(Pr.ts);
                }
                checkEmpty(t1) {
                    return js.resolve(0 === this.In.length);
                }
                addMutationBatch(t1, e, n1, s) {
                    const i = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const r = new ni(i, e, n1, s);
                    for (const e of (this.In.push(r), s))this.ds = this.ds.add(new Pr(e.key, i)), this.Ht.addToCollectionParentIndex(t1, e.key.path.popLast());
                    return js.resolve(r);
                }
                lookupMutationBatch(t1, e) {
                    return js.resolve(this.ws(e));
                }
                getNextMutationBatchAfterBatchId(t1, e) {
                    const s = this._s(e + 1), i = s < 0 ? 0 : s;
                    return js.resolve(this.In.length > i ? this.In[i] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return js.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t1) {
                    return js.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t1, e) {
                    const n1 = new Pr(e, 0), s = new Pr(e, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n1,
                        s
                    ], (t1)=>{
                        const e = this.ws(t1.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t1, e) {
                    let n1 = new gn(et);
                    return e.forEach((t1)=>{
                        const e = new Pr(t1, 0), s = new Pr(t1, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t1)=>{
                            n1 = n1.add(t1.ls);
                        });
                    }), js.resolve(this.gs(n1));
                }
                getAllMutationBatchesAffectingQuery(t1, e) {
                    const n1 = e.path, s = n1.length + 1;
                    let i = n1;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    let o = new gn(et);
                    return this.ds.forEachWhile((t1)=>{
                        const e = t1.key.path;
                        return !!n1.isPrefixOf(e) && (e.length === s && (o = o.add(t1.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t1) {
                    const e = [];
                    return t1.forEach((t1)=>{
                        const n1 = this.ws(t1);
                        null !== n1 && e.push(n1);
                    }), e;
                }
                removeMutationBatch(t1, e) {
                    0 === this.ys(e.batchId, "removed") || L(), this.In.shift();
                    let n1 = this.ds;
                    return js.forEach(e.mutations, (s)=>{
                        const i = new Pr(s.key, e.batchId);
                        return n1 = n1.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t1, s.key);
                    }).next(()=>{
                        this.ds = n1;
                    });
                }
                te(t1) {}
                containsKey(t1, e) {
                    const n1 = new Pr(e, 0), s = this.ds.firstAfterOrEqual(n1);
                    return js.resolve(e.isEqual(s && s.key));
                }
                performConsistencyCheck(t1) {
                    return this.In.length, js.resolve();
                }
                ys(t1, e) {
                    return this._s(t1);
                }
                _s(t1) {
                    return 0 === this.In.length ? 0 : t1 - this.In[0].batchId;
                }
                ws(t1) {
                    const e = this._s(t1);
                    return e < 0 || e >= this.In.length ? null : this.In[e];
                }
            }
            class Vr {
                constructor(t1, e){
                    this.Ht = t1, this.ps = e, this.docs = new wn(Pt.comparator), this.size = 0;
                }
                addEntry(t1, e, n1) {
                    const s = e.key, i = this.docs.get(s), r = i ? i.size : 0, o = this.ps(e);
                    return this.docs = this.docs.insert(s, {
                        document: e.clone(),
                        size: o,
                        readTime: n1
                    }), this.size += o - r, this.Ht.addToCollectionParentIndex(t1, s.path.popLast());
                }
                removeEntry(t1) {
                    const e = this.docs.get(t1);
                    e && (this.docs = this.docs.remove(t1), this.size -= e.size);
                }
                getEntry(t1, e) {
                    const n1 = this.docs.get(e);
                    return js.resolve(n1 ? n1.document.clone() : Kt.newInvalidDocument(e));
                }
                getEntries(t1, e) {
                    let n1 = pn;
                    return e.forEach((t1)=>{
                        const e = this.docs.get(t1);
                        n1 = n1.insert(t1, e ? e.document.clone() : Kt.newInvalidDocument(t1));
                    }), js.resolve(n1);
                }
                getDocumentsMatchingQuery(t1, e, n1) {
                    let s = pn;
                    const i = new Pt(e.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t1, value: { document: i, readTime: o } } = r.getNext();
                        if (!e.path.isPrefixOf(t1.path)) break;
                        0 >= o.compareTo(n1) || Pe(e, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t1, e) {
                    return js.forEach(this.docs, (t1)=>e(t1));
                }
                newChangeBuffer(t1) {
                    return new Sr(this);
                }
                getSize(t1) {
                    return js.resolve(this.size);
                }
            }
            class Sr extends Qi {
                constructor(t1){
                    super(), this.Se = t1;
                }
                applyChanges(t1) {
                    const e = [];
                    return this.changes.forEach((n1, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t1, s.document, this.getReadTime(n1))) : this.Se.removeEntry(n1);
                    }), js.waitFor(e);
                }
                getFromCache(t1, e) {
                    return this.Se.getEntry(t1, e);
                }
                getAllFromCache(t1, e) {
                    return this.Se.getEntries(t1, e);
                }
            }
            class Dr {
                constructor(t1){
                    this.persistence = t1, this.Es = new ji((t1)=>Wt(t1), zt), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Is = 0, this.As = new br(), this.targetCount = 0, this.Rs = Ni.se();
                }
                forEachTarget(t1, e) {
                    return this.Es.forEach((t1, n1)=>e(n1)), js.resolve();
                }
                getLastRemoteSnapshotVersion(t1) {
                    return js.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(t1) {
                    return js.resolve(this.Is);
                }
                allocateTargetId(t1) {
                    return this.highestTargetId = this.Rs.next(), js.resolve(this.highestTargetId);
                }
                setTargetsMetadata(t1, e, n1) {
                    return n1 && (this.lastRemoteSnapshotVersion = n1), e > this.Is && (this.Is = e), js.resolve();
                }
                ce(t1) {
                    this.Es.set(t1.target, t1);
                    const e = t1.targetId;
                    e > this.highestTargetId && (this.Rs = new Ni(e), this.highestTargetId = e), t1.sequenceNumber > this.Is && (this.Is = t1.sequenceNumber);
                }
                addTargetData(t1, e) {
                    return this.ce(e), this.targetCount += 1, js.resolve();
                }
                updateTargetData(t1, e) {
                    return this.ce(e), js.resolve();
                }
                removeTargetData(t1, e) {
                    return this.Es.delete(e.target), this.As.cs(e.targetId), this.targetCount -= 1, js.resolve();
                }
                removeTargets(t1, e, n1) {
                    let s = 0;
                    const i = [];
                    return this.Es.forEach((r, o)=>{
                        o.sequenceNumber <= e && null === n1.get(o.targetId) && (this.Es.delete(r), i.push(this.removeMatchingKeysForTargetId(t1, o.targetId)), s++);
                    }), js.waitFor(i).next(()=>s);
                }
                getTargetCount(t1) {
                    return js.resolve(this.targetCount);
                }
                getTargetData(t1, e) {
                    const n1 = this.Es.get(e) || null;
                    return js.resolve(n1);
                }
                addMatchingKeys(t1, e, n1) {
                    return this.As.ss(e, n1), js.resolve();
                }
                removeMatchingKeys(t1, e, n1) {
                    this.As.os(e, n1);
                    const s = this.persistence.referenceDelegate, i = [];
                    return s && e.forEach((e)=>{
                        i.push(s.markPotentiallyOrphaned(t1, e));
                    }), js.waitFor(i);
                }
                removeMatchingKeysForTargetId(t1, e) {
                    return this.As.cs(e), js.resolve();
                }
                getMatchingKeysForTargetId(t1, e) {
                    const n1 = this.As.hs(e);
                    return js.resolve(n1);
                }
                containsKey(t1, e) {
                    return js.resolve(this.As.containsKey(e));
                }
            }
            class Cr {
                constructor(t1, e){
                    this.bs = {}, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t1(this), this.ze = new Dr(this), this.Ht = new pi(), this.He = new Vr(this.Ht, (t1)=>this.referenceDelegate.Ps(t1)), this.N = new ri(e), this.Je = new Rr(this.N);
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
                getMutationQueue(t1) {
                    let e = this.bs[t1.toKey()];
                    return e || (e = new vr(this.Ht, this.referenceDelegate), this.bs[t1.toKey()] = e), e;
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
                runTransaction(t1, e, n1) {
                    $("MemoryPersistence", "Starting transaction:", t1);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n1(s).next((t1)=>this.referenceDelegate.Vs(s).next(()=>t1)).toPromise().then((t1)=>(s.raiseOnCommittedEvent(), t1));
                }
                Ss(t1, e) {
                    return js.or(Object.values(this.bs).map((n1)=>()=>n1.containsKey(t1, e)));
                }
            }
            class Nr extends Ks {
                constructor(t1){
                    super(), this.currentSequenceNumber = t1;
                }
            }
            class xr {
                constructor(t1){
                    this.persistence = t1, this.Ds = new br(), this.Cs = null;
                }
                static Ns(t1) {
                    return new xr(t1);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw L();
                }
                addReference(t1, e, n1) {
                    return this.Ds.addReference(n1, e), this.xs.delete(n1.toString()), js.resolve();
                }
                removeReference(t1, e, n1) {
                    return this.Ds.removeReference(n1, e), this.xs.add(n1.toString()), js.resolve();
                }
                markPotentiallyOrphaned(t1, e) {
                    return this.xs.add(e.toString()), js.resolve();
                }
                removeTarget(t1, e) {
                    this.Ds.cs(e.targetId).forEach((t1)=>this.xs.add(t1.toString()));
                    const n1 = this.persistence.getTargetCache();
                    return n1.getMatchingKeysForTargetId(t1, e.targetId).next((t1)=>{
                        t1.forEach((t1)=>this.xs.add(t1.toString()));
                    }).next(()=>n1.removeTargetData(t1, e));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(t1) {
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return js.forEach(this.xs, (n1)=>{
                        const s = Pt.fromPath(n1);
                        return this.ks(t1, s).next((t1)=>{
                            t1 || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t1)));
                }
                updateLimboDocument(t1, e) {
                    return this.ks(t1, e).next((t1)=>{
                        t1 ? this.xs.delete(e.toString()) : this.xs.add(e.toString());
                    });
                }
                Ps(t1) {
                    return 0;
                }
                ks(t1, e) {
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e)),
                        ()=>this.persistence.getTargetCache().containsKey(t1, e),
                        ()=>this.persistence.Ss(t1, e)
                    ]);
                }
            }
            class Ur {
                constructor(){
                    this.activeTargetIds = vn;
                }
                Fs(t1) {
                    this.activeTargetIds = this.activeTargetIds.add(t1);
                }
                Ms(t1) {
                    this.activeTargetIds = this.activeTargetIds.delete(t1);
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
                addPendingMutation(t1) {}
                updateMutationState(t1, e, n1) {}
                addLocalQueryTarget(t1) {
                    return this.yi.Fs(t1), this.pi[t1] || "not-current";
                }
                updateQueryState(t1, e, n1) {
                    this.pi[t1] = e;
                }
                removeLocalQueryTarget(t1) {
                    this.yi.Ms(t1);
                }
                isLocalQueryTarget(t1) {
                    return this.yi.activeTargetIds.has(t1);
                }
                clearQueryState(t1) {
                    delete this.pi[t1];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(t1) {
                    return this.yi.activeTargetIds.has(t1);
                }
                start() {
                    return this.yi = new Ur(), Promise.resolve();
                }
                handleUserChange(t1, e, n1) {}
                setOnlineState(t1) {}
                shutdown() {}
                writeSequenceNumber(t1) {}
                notifyBundleLoaded() {}
            }
            class jr {
                Ti(t1) {}
                shutdown() {}
            }
            class Qr {
                constructor(){
                    this.Ei = ()=>this.Ii(), this.Ai = ()=>this.Ri(), this.bi = [], this.Pi();
                }
                Ti(t1) {
                    this.bi.push(t1);
                }
                shutdown() {
                    window.removeEventListener("online", this.Ei), window.removeEventListener("offline", this.Ai);
                }
                Pi() {
                    window.addEventListener("online", this.Ei), window.addEventListener("offline", this.Ai);
                }
                Ii() {
                    for (const t1 of ($("ConnectivityMonitor", "Network connectivity changed: AVAILABLE"), this.bi))t1(0);
                }
                Ri() {
                    for (const t1 of ($("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE"), this.bi))t1(1);
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
                constructor(t1){
                    this.vi = t1.vi, this.Vi = t1.Vi;
                }
                Si(t1) {
                    this.Di = t1;
                }
                Ci(t1) {
                    this.Ni = t1;
                }
                onMessage(t1) {
                    this.xi = t1;
                }
                close() {
                    this.Vi();
                }
                send(t1) {
                    this.vi(t1);
                }
                ki() {
                    this.Di();
                }
                $i(t1) {
                    this.Ni(t1);
                }
                Oi(t1) {
                    this.xi(t1);
                }
            }
            class zr extends class {
                constructor(t1){
                    this.databaseInfo = t1, this.databaseId = t1.databaseId;
                    const e = t1.ssl ? "https" : "http";
                    this.Fi = e + "://" + t1.host, this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
                }
                Li(t1, e, n1, s) {
                    const i = this.Bi(t1, e);
                    $("RestConnection", "Sending: ", i, n1);
                    const r = {};
                    return this.Ui(r, s), this.qi(t1, i, r, n1).then((t1)=>($("RestConnection", "Received: ", t1), t1), (e)=>{
                        throw F("RestConnection", `${t1} failed with error: `, e, "url: ", i, "request:", n1), e;
                    });
                }
                Ki(t1, e, n1, s) {
                    return this.Li(t1, e, n1, s);
                }
                Ui(t1, e) {
                    if (t1["X-Goog-Api-Client"] = "gl-js/ fire/" + C, t1["Content-Type"] = "text/plain", this.databaseInfo.appId && (t1["X-Firebase-GMPID"] = this.databaseInfo.appId), e) for(const n1 in e.authHeaders)e.authHeaders.hasOwnProperty(n1) && (t1[n1] = e.authHeaders[n1]);
                }
                Bi(t1, e) {
                    const n1 = Wr[t1];
                    return `${this.Fi}/v1/${e}:${n1}`;
                }
            } {
                constructor(t1){
                    super(t1), this.forceLongPolling = t1.forceLongPolling, this.autoDetectLongPolling = t1.autoDetectLongPolling, this.useFetchStreams = t1.useFetchStreams;
                }
                qi(t1, e, n1, s) {
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
                                        $("Connection", 'RPC "' + t1 + '" timed out'), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.HTTP_ERROR:
                                        const n1 = o.getStatus();
                                        if ($("Connection", 'RPC "' + t1 + '" failed with status:', n1, "response text:", o.getResponseText()), n1 > 0) {
                                            const t1 = o.getResponseJson().error;
                                            if (t1 && t1.status && t1.message) {
                                                const e = function(t1) {
                                                    const e = t1.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t1.status);
                                                r(new j(e, t1.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", 'RPC "' + t1 + '" completed.');
                            }
                        });
                        const c = JSON.stringify(s);
                        o.send(e, "POST", c, n1, 15);
                    });
                }
                ji(t1, e) {
                    const n1 = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t1,
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
                    const o = n1.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s.createWebChannel(o, r);
                    let a = !1, u = !1;
                    const h = new Gr({
                        vi: (t1)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t1) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t1), c.send(t1));
                        },
                        Vi: ()=>c.close()
                    }), g = (t1, e, n1)=>{
                        t1.listen(e, (t1)=>{
                            try {
                                n1(t1);
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
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.ERROR, (t1)=>{
                        u || (u = !0, F("Connection", "WebChannel transport errored:", t1), h.$i(new j(K.UNAVAILABLE, "The operation could not be completed")));
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ii.EventType.MESSAGE, (t1)=>{
                        var e;
                        if (!u) {
                            const n1 = t1.data[0];
                            n1 || L();
                            const i = n1.error || (null === (e = n1[0]) || void 0 === e ? void 0 : e.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t1 = i.status;
                                let e = function(t1) {
                                    const e = hn[t1];
                                    if (void 0 !== e) return dn(e);
                                }(t1), n1 = i.message;
                                void 0 === e && (e = K.INTERNAL, n1 = "Unknown error status: " + t1 + " with message " + i.message), u = !0, h.$i(new j(e, n1)), c.close();
                            } else $("Connection", "WebChannel received:", n1), h.Oi(n1);
                        }
                    }), g(i, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ju.STAT_EVENT, (t1)=>{
                        t1.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.kN.PROXY ? $("Connection", "Detected buffering proxy") : t1.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.kN.NOPROXY && $("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        h.ki();
                    }, 0), h;
                }
            }
            function Jr() {
                return "undefined" != typeof document ? document : null;
            }
            class Xr {
                constructor(t1, e, n1 = 1e3, s = 1.5, i = 6e4){
                    this.Oe = t1, this.timerId = e, this.Qi = n1, this.Wi = s, this.Gi = i, this.zi = 0, this.Hi = null, this.Ji = Date.now(), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(t1) {
                    this.cancel();
                    const e = Math.floor(this.zi + this.Zi()), n1 = Math.max(0, Date.now() - this.Ji), s = Math.max(0, e - n1);
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n1} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t1())), this.zi *= this.Wi, this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
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
                constructor(t1, e, n1, s, i, r, o){
                    this.Oe = t1, this.er = n1, this.nr = s, this.sr = i, this.credentialsProvider = r, this.listener = o, this.state = 0, this.ir = 0, this.rr = null, this.cr = null, this.stream = null, this.ar = new Xr(t1, e);
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
                mr(t1) {
                    this.gr(), this.stream.send(t1);
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
                async close(t1, e) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== t1 ? this.ar.reset() : e && e.code === K.RESOURCE_EXHAUSTED ? (O(e.toString()), O("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e && e.code === K.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), this.stream = null), this.state = t1, await this.listener.Ci(e);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const t1 = this.Tr(this.ir), e = this.ir;
                    this.credentialsProvider.getToken().then((t1)=>{
                        this.ir === e && this.Er(t1);
                    }, (e)=>{
                        t1(()=>{
                            const t1 = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t1);
                        });
                    });
                }
                Er(t1) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t1), this.stream.Si(()=>{
                        e(()=>(this.state = 2, this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve())), this.listener.Si()));
                    }), this.stream.Ci((t1)=>{
                        e(()=>this.Ir(t1));
                    }), this.stream.onMessage((t1)=>{
                        e(()=>this.onMessage(t1));
                    });
                }
                lr() {
                    this.state = 5, this.ar.Xi(async ()=>{
                        this.state = 0, this.start();
                    });
                }
                Ir(t1) {
                    return $("PersistentStream", `close with error: ${t1}`), this.stream = null, this.close(4, t1);
                }
                Tr(t1) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t1 ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class to extends Zr {
                constructor(t1, e, n1, s, i){
                    super(t1, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n1, i), this.N = s;
                }
                Ar(t1) {
                    return this.sr.ji("Listen", t1);
                }
                onMessage(t1) {
                    this.ar.reset();
                    const e = function(t1, e) {
                        let n1;
                        if ("targetChange" in e) {
                            var t2, e1;
                            e.targetChange;
                            const s = "NO_CHANGE" === (t2 = e.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t2 ? 1 : "REMOVE" === t2 ? 2 : "CURRENT" === t2 ? 3 : "RESET" === t2 ? 4 : L(), i = e.targetChange.targetIds || [], r = (e1 = e.targetChange.resumeToken, t1.D ? (void 0 === e1 || "string" == typeof e1 || L(), _t.fromBase64String(e1 || "")) : (void 0 === e1 || e1 instanceof Uint8Array || L(), _t.fromUint8Array(e1 || new Uint8Array()))), o = e.targetChange.cause;
                            n1 = new xn(s, i, r, o && new j(void 0 === o.code ? K.UNKNOWN : dn(o.code), o.message || "") || null);
                        } else if ("documentChange" in e) {
                            e.documentChange;
                            const s = e.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t1, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o);
                            n1 = new Cn(s.targetIds || [], s.removedTargetIds || [], c.key, c);
                        } else if ("documentDelete" in e) {
                            e.documentDelete;
                            const s = e.documentDelete;
                            s.document;
                            const i = zn(t1, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r);
                            n1 = new Cn([], s.removedTargetIds || [], o.key, o);
                        } else if ("documentRemove" in e) {
                            e.documentRemove;
                            const s = e.documentRemove;
                            s.document;
                            const i = zn(t1, s.document);
                            n1 = new Cn([], s.removedTargetIds || [], i, null);
                        } else {
                            if (!("filter" in e)) return L();
                            {
                                e.filter;
                                const t1 = e.filter;
                                t1.targetId;
                                const i = new un(t1.count || 0);
                                n1 = new Nn(t1.targetId, i);
                            }
                        }
                        return n1;
                    }(this.N, t1), n1 = function(t1) {
                        if (!("targetChange" in t1)) return rt.min();
                        const e = t1.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t1);
                    return this.listener.Rr(e, n1);
                }
                br(t1) {
                    const e = {};
                    e.database = Yn(this.N), e.addTarget = function(t1, e) {
                        var e1, e2;
                        let n1;
                        const s = e.target;
                        return (n1 = Ht(s) ? {
                            documents: {
                                documents: [
                                    Hn(t1, s.path)
                                ]
                            }
                        } : {
                            query: function(t1, e) {
                                var e1;
                                const n1 = {
                                    structuredQuery: {}
                                }, s = e.path;
                                null !== e.collectionGroup ? (n1.parent = Hn(t1, s), n1.structuredQuery.from = [
                                    {
                                        collectionId: e.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n1.parent = Hn(t1, s.popLast()), n1.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t1) {
                                    if (0 === t1.length) return;
                                    const e = t1.map((t1)=>(function(t1) {
                                            if ("==" === t1.op) {
                                                if (Mt(t1.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t1.field),
                                                        op: "IS_NAN"
                                                    }
                                                };
                                                if (Ft(t1.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t1.field),
                                                        op: "IS_NULL"
                                                    }
                                                };
                                            } else if ("!=" === t1.op) {
                                                if (Mt(t1.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t1.field),
                                                        op: "IS_NOT_NAN"
                                                    }
                                                };
                                                if (Ft(t1.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t1.field),
                                                        op: "IS_NOT_NULL"
                                                    }
                                                };
                                            }
                                            return {
                                                fieldFilter: {
                                                    field: _s(t1.field),
                                                    op: Ln[t1.op],
                                                    value: t1.value
                                                }
                                            };
                                        })(t1));
                                    return 1 === e.length ? e[0] : {
                                        compositeFilter: {
                                            op: "AND",
                                            filters: e
                                        }
                                    };
                                }(e.filters);
                                i && (n1.structuredQuery.where = i);
                                const r = function(t1) {
                                    if (0 !== t1.length) return t1.map((t1)=>({
                                            field: _s(t1.field),
                                            direction: Mn[t1.dir]
                                        }));
                                }(e.orderBy);
                                r && (n1.structuredQuery.orderBy = r);
                                const o = (e1 = e.limit, t1.D || At(e1) ? e1 : {
                                    value: e1
                                });
                                return null !== o && (n1.structuredQuery.limit = o), e.startAt && (n1.structuredQuery.startAt = ls(e.startAt)), e.endAt && (n1.structuredQuery.endAt = ls(e.endAt)), n1;
                            }(t1, s)
                        }).targetId = e.targetId, e.resumeToken.approximateByteSize() > 0 ? n1.resumeToken = (e1 = e.resumeToken, t1.D ? e1.toBase64() : e1.toUint8Array()) : e.snapshotVersion.compareTo(rt.min()) > 0 && (n1.readTime = (e2 = e.snapshotVersion.toTimestamp(), t1.D ? `${new Date(1e3 * e2.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e2.nanoseconds).slice(-9)}Z` : {
                            seconds: "" + e2.seconds,
                            nanos: e2.nanoseconds
                        })), n1;
                    }(this.N, t1);
                    const n1 = function(t1, e) {
                        const n1 = function(t1, e) {
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
                        return null == n1 ? null : {
                            "goog-listen-tags": n1
                        };
                    }(this.N, t1);
                    n1 && (e.labels = n1), this.mr(e);
                }
                Pr(t1) {
                    const e = {};
                    e.database = Yn(this.N), e.removeTarget = t1, this.mr(e);
                }
            }
            class no extends class {
            } {
                constructor(t1, e, n1){
                    super(), this.credentials = t1, this.sr = e, this.N = n1, this.kr = !1;
                }
                $r() {
                    if (this.kr) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(t1, e, n1) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t1, e, n1, s)).catch((t1)=>{
                        throw "FirebaseError" === t1.name ? (t1.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t1) : new j(K.UNKNOWN, t1.toString());
                    });
                }
                Ki(t1, e, n1) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t1, e, n1, s)).catch((t1)=>{
                        throw "FirebaseError" === t1.name ? (t1.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t1) : new j(K.UNKNOWN, t1.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class so {
                constructor(t1, e){
                    this.asyncQueue = t1, this.onlineStateHandler = e, this.state = "Unknown", this.Or = 0, this.Fr = null, this.Mr = !0;
                }
                Lr() {
                    0 === this.Or && (this.Br("Unknown"), this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, ()=>(this.Fr = null, this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve())));
                }
                qr(t1) {
                    "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${t1.toString()}`), this.Br("Offline")));
                }
                set(t1) {
                    this.Kr(), this.Or = 0, "Online" === t1 && (this.Mr = !1), this.Br(t1);
                }
                Br(t1) {
                    t1 !== this.state && (this.state = t1, this.onlineStateHandler(t1));
                }
                Ur(t1) {
                    const e = `Could not reach Cloud Firestore backend. ${t1}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (O(e), this.Mr = !1) : $("OnlineStateTracker", e);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), this.Fr = null);
                }
            }
            class io {
                constructor(t1, e, n1, s, i){
                    this.localStore = t1, this.datastore = e, this.asyncQueue = n1, this.remoteSyncer = {}, this.jr = [], this.Qr = new Map(), this.Wr = new Set(), this.Gr = [], this.zr = i, this.zr.Ti((t1)=>{
                        n1.enqueueAndForget(async ()=>{
                            wo(this) && ($("RemoteStore", "Restarting streams for network reachability change."), await async function(t1) {
                                t1.Wr.add(4), await oo(t1), t1.Hr.set("Unknown"), t1.Wr.delete(4), await ro(t1);
                            }(this));
                        });
                    }), this.Hr = new so(n1, s);
                }
            }
            async function ro(t1) {
                if (wo(t1)) for (const e of t1.Gr)await e(!0);
            }
            async function oo(t1) {
                for (const e of t1.Gr)await e(!1);
            }
            function co(t1, e) {
                t1.Qr.has(e.targetId) || (t1.Qr.set(e.targetId, e), fo(t1) ? lo(t1) : Co(t1).hr() && uo(t1, e));
            }
            function ao(t1, e) {
                const s = Co(t1);
                t1.Qr.delete(e), s.hr() && ho(t1, e), 0 === t1.Qr.size && (s.hr() ? s.wr() : wo(t1) && t1.Hr.set("Unknown"));
            }
            function uo(t1, e) {
                t1.Jr.Y(e.targetId), Co(t1).br(e);
            }
            function ho(t1, e) {
                t1.Jr.Y(e), Co(t1).Pr(e);
            }
            function lo(t1) {
                t1.Jr = new $n({
                    getRemoteKeysForTarget: (e)=>t1.remoteSyncer.getRemoteKeysForTarget(e),
                    Tt: (e)=>t1.Qr.get(e) || null
                }), Co(t1).start(), t1.Hr.Lr();
            }
            function fo(t1) {
                return wo(t1) && !Co(t1).ur() && t1.Qr.size > 0;
            }
            function wo(t1) {
                return 0 === t1.Wr.size;
            }
            async function mo(t1) {
                t1.Qr.forEach((e, n1)=>{
                    uo(t1, e);
                });
            }
            async function go(t1, e) {
                t1.Jr = void 0, fo(t1) ? (t1.Hr.qr(e), lo(t1)) : t1.Hr.set("Unknown");
            }
            async function yo(t1, e, n1) {
                if (t1.Hr.set("Online"), e instanceof xn && 2 === e.state && e.cause) try {
                    await async function(t1, e) {
                        const n1 = e.cause;
                        for (const s of e.targetIds)t1.Qr.has(s) && (await t1.remoteSyncer.rejectListen(s, n1), t1.Qr.delete(s), t1.Jr.removeTarget(s));
                    }(t1, e);
                } catch (n1) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n1), await po(t1, n1);
                }
                else if (e instanceof Cn ? t1.Jr.rt(e) : e instanceof Nn ? t1.Jr.ft(e) : t1.Jr.at(e), !n1.isEqual(rt.min())) try {
                    const e = await fr(t1.localStore);
                    n1.compareTo(e) >= 0 && await function(t1, e) {
                        const n1 = t1.Jr._t(e);
                        return n1.targetChanges.forEach((n1, s)=>{
                            if (n1.resumeToken.approximateByteSize() > 0) {
                                const i = t1.Qr.get(s);
                                i && t1.Qr.set(s, i.withResumeToken(n1.resumeToken, e));
                            }
                        }), n1.targetMismatches.forEach((e)=>{
                            const n1 = t1.Qr.get(e);
                            if (!n1) return;
                            t1.Qr.set(e, n1.withResumeToken(_t.EMPTY_BYTE_STRING, n1.snapshotVersion)), ho(t1, e);
                            const s = new ii(n1.target, e, 1, n1.sequenceNumber);
                            uo(t1, s);
                        }), t1.remoteSyncer.applyRemoteEvent(n1);
                    }(t1, n1);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t1, e);
                }
            }
            async function po(t1, e, n1) {
                if (!Hs(e)) throw e;
                t1.Wr.add(1), await oo(t1), t1.Hr.set("Offline"), n1 || (n1 = ()=>fr(t1.localStore)), t1.asyncQueue.enqueueRetryable(async ()=>{
                    $("RemoteStore", "Retrying IndexedDB access"), await n1(), t1.Wr.delete(1), await ro(t1);
                });
            }
            async function Do(t1, e) {
                e ? (t1.Wr.delete(2), await ro(t1)) : e || (t1.Wr.add(2), await oo(t1), t1.Hr.set("Unknown"));
            }
            function Co(t1) {
                var t2, e, n1;
                return t1.Yr || (t1.Yr = (t2 = t1.datastore, e = t1.asyncQueue, n1 = {
                    Si: mo.bind(null, t1),
                    Ci: go.bind(null, t1),
                    Rr: yo.bind(null, t1)
                }, t2.$r(), new to(e, t2.sr, t2.credentials, t2.N, n1)), t1.Gr.push(async (e)=>{
                    e ? (t1.Yr.dr(), fo(t1) ? lo(t1) : t1.Hr.set("Unknown")) : (await t1.Yr.stop(), t1.Jr = void 0);
                })), t1.Yr;
            }
            class xo {
                constructor(t1, e, n1, s, i){
                    this.asyncQueue = t1, this.timerId = e, this.targetTimeMs = n1, this.op = s, this.removalCallback = i, this.deferred = new Q(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t1)=>{});
                }
                static createAndSchedule(t1, e, n1, s, i) {
                    const o = new xo(t1, e, Date.now() + n1, s, i);
                    return o.start(n1), o;
                }
                start(t1) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), t1);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t1) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t1 ? ": " + t1 : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((t1)=>this.deferred.resolve(t1))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
                }
            }
            function ko(t1, e) {
                if (O("AsyncQueue", `${e}: ${t1}`), Hs(t1)) return new j(K.UNAVAILABLE, `${e}: ${t1}`);
                throw t1;
            }
            class $o {
                constructor(t1){
                    this.comparator = t1 ? (e, n1)=>t1(e, n1) || Pt.comparator(e.key, n1.key) : (t1, e)=>Pt.comparator(t1.key, e.key), this.keyedMap = En, this.sortedSet = new wn(this.comparator);
                }
                static emptySet(t1) {
                    return new $o(t1.comparator);
                }
                has(t1) {
                    return null != this.keyedMap.get(t1);
                }
                get(t1) {
                    return this.keyedMap.get(t1);
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
                indexOf(t1) {
                    const e = this.keyedMap.get(t1);
                    return e ? this.sortedSet.indexOf(e) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(t1) {
                    this.sortedSet.inorderTraversal((e, n1)=>(t1(e), !1));
                }
                add(t1) {
                    const e = this.delete(t1.key);
                    return e.copy(e.keyedMap.insert(t1.key, t1), e.sortedSet.insert(t1, null));
                }
                delete(t1) {
                    const e = this.get(t1);
                    return e ? this.copy(this.keyedMap.remove(t1), this.sortedSet.remove(e)) : this;
                }
                isEqual(t1) {
                    if (!(t1 instanceof $o) || this.size !== t1.size) return !1;
                    const e = this.sortedSet.getIterator(), n1 = t1.sortedSet.getIterator();
                    for(; e.hasNext();){
                        const t1 = e.getNext().key, s = n1.getNext().key;
                        if (!t1.isEqual(s)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const t1 = [];
                    return this.forEach((e)=>{
                        t1.push(e.toString());
                    }), 0 === t1.length ? "DocumentSet ()" : "DocumentSet (\n  " + t1.join("  \n") + "\n)";
                }
                copy(t1, e) {
                    const n1 = new $o();
                    return n1.comparator = this.comparator, n1.keyedMap = t1, n1.sortedSet = e, n1;
                }
            }
            class Oo {
                constructor(){
                    this.Zr = new wn(Pt.comparator);
                }
                track(t1) {
                    const e = t1.doc.key, n1 = this.Zr.get(e);
                    n1 ? 0 !== t1.type && 3 === n1.type ? this.Zr = this.Zr.insert(e, t1) : 3 === t1.type && 1 !== n1.type ? this.Zr = this.Zr.insert(e, {
                        type: n1.type,
                        doc: t1.doc
                    }) : 2 === t1.type && 2 === n1.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t1.doc
                    }) : 2 === t1.type && 0 === n1.type ? this.Zr = this.Zr.insert(e, {
                        type: 0,
                        doc: t1.doc
                    }) : 1 === t1.type && 0 === n1.type ? this.Zr = this.Zr.remove(e) : 1 === t1.type && 2 === n1.type ? this.Zr = this.Zr.insert(e, {
                        type: 1,
                        doc: n1.doc
                    }) : 0 === t1.type && 1 === n1.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t1.doc
                    }) : L() : this.Zr = this.Zr.insert(e, t1);
                }
                eo() {
                    const t1 = [];
                    return this.Zr.inorderTraversal((e, n1)=>{
                        t1.push(n1);
                    }), t1;
                }
            }
            class Fo {
                constructor(t1, e, n1, s, i, r, o, c){
                    this.query = t1, this.docs = e, this.oldDocs = n1, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = c;
                }
                static fromInitialDocuments(t1, e, n1, s) {
                    const i = [];
                    return e.forEach((t1)=>{
                        i.push({
                            type: 0,
                            doc: t1
                        });
                    }), new Fo(t1, e, $o.emptySet(e), i, n1, s, !0, !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t1) {
                    if (!(this.fromCache === t1.fromCache && this.syncStateChanged === t1.syncStateChanged && this.mutatedKeys.isEqual(t1.mutatedKeys) && Ae(this.query, t1.query) && this.docs.isEqual(t1.docs) && this.oldDocs.isEqual(t1.oldDocs))) return !1;
                    const e = this.docChanges, n1 = t1.docChanges;
                    if (e.length !== n1.length) return !1;
                    for(let t1 = 0; t1 < e.length; t1++)if (e[t1].type !== n1[t1].type || !e[t1].doc.isEqual(n1[t1].doc)) return !1;
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
                    this.queries = new ji((t1)=>Re(t1), Ae), this.onlineState = "Unknown", this.so = new Set();
                }
            }
            async function Bo(t1, e) {
                const s = e.query;
                let i = !1, r = t1.queries.get(s);
                if (r || (i = !0, r = new Mo()), i) try {
                    r.no = await t1.onListen(s);
                } catch (t1) {
                    const n1 = ko(t1, `Initialization of query '${be(e.query)}' failed`);
                    return void e.onError(n1);
                }
                t1.queries.set(s, r), r.listeners.push(e), e.io(t1.onlineState), r.no && e.ro(r.no) && jo(t1);
            }
            async function Uo(t1, e) {
                const s = e.query;
                let i = !1;
                const r = t1.queries.get(s);
                if (r) {
                    const t1 = r.listeners.indexOf(e);
                    t1 >= 0 && (r.listeners.splice(t1, 1), i = 0 === r.listeners.length);
                }
                if (i) return t1.queries.delete(s), t1.onUnlisten(s);
            }
            function qo(t1, e) {
                let s = !1;
                for (const t2 of e){
                    const e = t2.query, i = t1.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t2) && (s = !0);
                        i.no = t2;
                    }
                }
                s && jo(t1);
            }
            function Ko(t1, e, n1) {
                const i = t1.queries.get(e);
                if (i) for (const t1 of i.listeners)t1.onError(n1);
                t1.queries.delete(e);
            }
            function jo(t1) {
                t1.so.forEach((t1)=>{
                    t1.next();
                });
            }
            class Qo {
                constructor(t1, e, n1){
                    this.query = t1, this.oo = e, this.co = !1, this.ao = null, this.onlineState = "Unknown", this.options = n1 || {};
                }
                ro(t1) {
                    if (!this.options.includeMetadataChanges) {
                        const e = [];
                        for (const n1 of t1.docChanges)3 !== n1.type && e.push(n1);
                        t1 = new Fo(t1.query, t1.docs, t1.oldDocs, e, t1.mutatedKeys, t1.fromCache, t1.syncStateChanged, !0);
                    }
                    let e = !1;
                    return this.co ? this.uo(t1) && (this.oo.next(t1), e = !0) : this.ho(t1, this.onlineState) && (this.lo(t1), e = !0), this.ao = t1, e;
                }
                onError(t1) {
                    this.oo.error(t1);
                }
                io(t1) {
                    this.onlineState = t1;
                    let e = !1;
                    return this.ao && !this.co && this.ho(this.ao, t1) && (this.lo(this.ao), e = !0), e;
                }
                ho(t1, e) {
                    return !t1.fromCache || (!this.options.fo || !("Offline" !== e)) && (!t1.docs.isEmpty() || "Offline" === e);
                }
                uo(t1) {
                    if (t1.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t1.hasPendingWrites;
                    return !(!t1.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
                }
                lo(t1) {
                    t1 = Fo.fromInitialDocuments(t1.query, t1.docs, t1.mutatedKeys, t1.fromCache), this.co = !0, this.oo.next(t1);
                }
            }
            class Jo {
                constructor(t1){
                    this.key = t1;
                }
            }
            class Yo {
                constructor(t1){
                    this.key = t1;
                }
            }
            class Xo {
                constructor(t1, e){
                    this.query = t1, this.po = e, this.To = null, this.current = !1, this.Eo = Pn(), this.mutatedKeys = Pn(), this.Io = ve(t1), this.Ao = new $o(this.Io);
                }
                get Ro() {
                    return this.po;
                }
                bo(t1, e) {
                    const n1 = e ? e.Po : new Oo(), s = e ? e.Ao : this.Ao;
                    let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    if (t1.inorderTraversal((t1, e)=>{
                        const u = s.get(t1), h = Pe(this.query, e) ? e : null, l = !!u && this.mutatedKeys.has(u.key), f = !!h && (h.hasLocalMutations || this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
                        let d = !1;
                        u && h ? u.data.isEqual(h.data) ? l !== f && (n1.track({
                            type: 3,
                            doc: h
                        }), d = !0) : this.vo(u, h) || (n1.track({
                            type: 2,
                            doc: h
                        }), d = !0, (c && this.Io(h, c) > 0 || a && 0 > this.Io(h, a)) && (o = !0)) : !u && h ? (n1.track({
                            type: 0,
                            doc: h
                        }), d = !0) : u && !h && (n1.track({
                            type: 1,
                            doc: u
                        }), d = !0, (c || a) && (o = !0)), d && (h ? (r = r.add(h), i = f ? i.add(t1) : i.delete(t1)) : (r = r.delete(t1), i = i.delete(t1)));
                    }), _e(this.query) || me(this.query)) for(; r.size > this.query.limit;){
                        const t1 = _e(this.query) ? r.last() : r.first();
                        r = r.delete(t1.key), i = i.delete(t1.key), n1.track({
                            type: 1,
                            doc: t1
                        });
                    }
                    return {
                        Ao: r,
                        Po: n1,
                        Ln: o,
                        mutatedKeys: i
                    };
                }
                vo(t1, e) {
                    return t1.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
                }
                applyChanges(t1, e, n1) {
                    const s = this.Ao;
                    this.Ao = t1.Ao, this.mutatedKeys = t1.mutatedKeys;
                    const i = t1.Po.eo();
                    i.sort((t1, e)=>(function(t1, e) {
                            const n1 = (t1)=>{
                                switch(t1){
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
                            return n1(t1) - n1(e);
                        })(t1.type, e.type) || this.Io(t1.doc, e.doc)), this.Vo(n1);
                    const r = e ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t1.Ao, s, i, t1.mutatedKeys, 0 === o, c, !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                io(t1) {
                    return this.current && "Offline" === t1 ? (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t1) {
                    return !this.po.has(t1) && !!this.Ao.has(t1) && !this.Ao.get(t1).hasLocalMutations;
                }
                Vo(t1) {
                    t1 && (t1.addedDocuments.forEach((t1)=>this.po = this.po.add(t1)), t1.modifiedDocuments.forEach((t1)=>{}), t1.removedDocuments.forEach((t1)=>this.po = this.po.delete(t1)), this.current = t1.current);
                }
                So() {
                    if (!this.current) return [];
                    const t1 = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t1)=>{
                        this.Co(t1.key) && (this.Eo = this.Eo.add(t1.key));
                    });
                    const e = [];
                    return t1.forEach((t1)=>{
                        this.Eo.has(t1) || e.push(new Yo(t1));
                    }), this.Eo.forEach((n1)=>{
                        t1.has(n1) || e.push(new Jo(n1));
                    }), e;
                }
                No(t1) {
                    this.po = t1.Gn, this.Eo = Pn();
                    const e = this.bo(t1.documents);
                    return this.applyChanges(e, !0);
                }
                xo() {
                    return Fo.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class Zo {
                constructor(t1, e, n1){
                    this.query = t1, this.targetId = e, this.view = n1;
                }
            }
            class tc {
                constructor(t1){
                    this.key = t1, this.ko = !1;
                }
            }
            class ec {
                constructor(t1, e, n1, s, i, r){
                    this.localStore = t1, this.remoteStore = e, this.eventManager = n1, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.$o = {}, this.Oo = new ji((t1)=>Re(t1), Ae), this.Fo = new Map(), this.Mo = new Set(), this.Lo = new wn(Pt.comparator), this.Bo = new Map(), this.Uo = new br(), this.qo = {}, this.Ko = new Map(), this.jo = Ni.ie(), this.onlineState = "Unknown", this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function nc(t1, e) {
                var t2, e1;
                let s, i;
                const n1 = (t1.remoteStore.remoteSyncer.applyRemoteEvent = oc.bind(null, t1), t1.remoteStore.remoteSyncer.getRemoteKeysForTarget = Ec.bind(null, t1), t1.remoteStore.remoteSyncer.rejectListen = ac.bind(null, t1), t1.$o.Rr = qo.bind(null, t1.eventManager), t1.$o.Go = Ko.bind(null, t1.eventManager), t1), r = n1.Oo.get(e);
                if (r) s = r.targetId, n1.sharedClientState.addLocalQueryTarget(s), i = r.view.xo();
                else {
                    const t1 = await (t2 = n1.localStore, e1 = Ee(e), t2.persistence.runTransaction("Allocate target", "readwrite", (t1)=>{
                        let s;
                        return t2.ze.getTargetData(t1, e1).next((i)=>i ? (s = i, js.resolve(s)) : t2.ze.allocateTargetId(t1).next((i)=>(s = new ii(e1, i, 0, t1.currentSequenceNumber), t2.ze.addTargetData(t1, s).next(()=>s))));
                    }).then((t1)=>{
                        const s = t2.Un.get(t1.targetId);
                        return (null === s || t1.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (t2.Un = t2.Un.insert(t1.targetId, t1), t2.qn.set(e1, t1.targetId)), t1;
                    })), r = n1.sharedClientState.addLocalQueryTarget(t1.targetId);
                    s = t1.targetId, i = await sc(n1, e, s, "current" === r), n1.isPrimaryClient && co(n1.remoteStore, t1);
                }
                return i;
            }
            async function sc(t1, e, n1, s) {
                t1.Wo = (e, n1, s)=>(async function(t1, e, n1, s) {
                        let i = e.view.bo(n1);
                        i.Ln && (i = await yr(t1.localStore, e.query, !1).then(({ documents: t1 })=>e.view.bo(t1, i)));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, t1.isPrimaryClient, r);
                        return mc(t1, e.targetId, o.Do), o.snapshot;
                    })(t1, e, n1, s);
                const i = await yr(t1.localStore, e, !0), r = new Xo(e, i.Gn), o = r.bo(i.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n1, s && "Offline" !== t1.onlineState), a = r.applyChanges(o, t1.isPrimaryClient, c);
                mc(t1, n1, a.Do);
                const u = new Zo(e, n1, r);
                return t1.Oo.set(e, u), t1.Fo.has(n1) ? t1.Fo.get(n1).push(e) : t1.Fo.set(n1, [
                    e
                ]), a.snapshot;
            }
            async function ic(t1, e) {
                const s = t1.Oo.get(e), i = t1.Fo.get(s.targetId);
                if (i.length > 1) return t1.Fo.set(s.targetId, i.filter((t1)=>!Ae(t1, e))), void t1.Oo.delete(e);
                t1.isPrimaryClient ? (t1.sharedClientState.removeLocalQueryTarget(s.targetId), t1.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(t1.localStore, s.targetId, !1).then(()=>{
                    t1.sharedClientState.clearQueryState(s.targetId), ao(t1.remoteStore, s.targetId), wc(t1, s.targetId);
                }).catch(Fi)) : (wc(t1, s.targetId), await gr(t1.localStore, s.targetId, !0));
            }
            async function oc(t1, e) {
                try {
                    const t2 = await function(t1, e) {
                        const s = e.snapshotVersion;
                        let i = t1.Un;
                        return t1.persistence.runTransaction("Apply remote event", "readwrite-primary", (t2)=>{
                            var n1, i1;
                            let r;
                            const r1 = t1.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = t1.Un;
                            const o = [];
                            e.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (!c) return;
                                o.push(t1.ze.removeMatchingKeys(t2, e.removedDocuments, r).next(()=>t1.ze.addMatchingKeys(t2, e.addedDocuments, r)));
                                const a = e.resumeToken;
                                if (a.approximateByteSize() > 0) {
                                    const u = c.withResumeToken(a, s).withSequenceNumber(t2.currentSequenceNumber);
                                    i = i.insert(r, u), u.resumeToken.approximateByteSize() > 0 || L(), (0 === c.resumeToken.approximateByteSize() || u.snapshotVersion.toMicroseconds() - c.snapshotVersion.toMicroseconds() >= 3e8 || e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size > 0) && o.push(t1.ze.updateTargetData(t2, u));
                                }
                            });
                            let c = pn;
                            if (e.documentUpdates.forEach((s, i)=>{
                                e.resolvedLimboDocuments.has(s) && o.push(t1.persistence.referenceDelegate.updateLimboDocument(t2, s));
                            }), o.push((n1 = e.documentUpdates, i1 = void 0, r = Pn(), n1.forEach((t1)=>r = r.add(t1)), r1.getEntries(t2, r).next((t1)=>{
                                let r = pn;
                                return n1.forEach((n1, o)=>{
                                    const c = t1.get(n1), a = (null == i1 ? void 0 : i1.get(n1)) || s;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (r1.removeEntry(n1, a), r = r.insert(n1, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (r1.addEntry(o, a), r = r.insert(n1, o)) : $("LocalStore", "Ignoring outdated watch update for ", n1, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t1)=>{
                                c = t1;
                            })), !s.isEqual(rt.min())) {
                                const e = t1.ze.getLastRemoteSnapshotVersion(t2).next((e)=>t1.ze.setTargetsMetadata(t2, t2.currentSequenceNumber, s));
                                o.push(e);
                            }
                            return js.waitFor(o).next(()=>r1.apply(t2)).next(()=>t1.Qn.vn(t2, c)).next(()=>c);
                        }).then((t2)=>(t1.Un = i, t2));
                    }(t1.localStore, e);
                    e.targetChanges.forEach((t2, e)=>{
                        const s = t1.Bo.get(e);
                        s && (t2.addedDocuments.size + t2.modifiedDocuments.size + t2.removedDocuments.size <= 1 || L(), t2.addedDocuments.size > 0 ? s.ko = !0 : t2.modifiedDocuments.size > 0 ? s.ko || L() : t2.removedDocuments.size > 0 && (s.ko || L(), s.ko = !1));
                    }), await pc(t1, t2, e);
                } catch (t1) {
                    await Fi(t1);
                }
            }
            function cc(t1, e, n1) {
                if (t1.isPrimaryClient && 0 === n1 || !t1.isPrimaryClient && 1 === n1) {
                    var t2;
                    let s;
                    const t3 = [];
                    t1.Oo.forEach((n1, s)=>{
                        const i = s.view.io(e);
                        i.snapshot && t3.push(i.snapshot);
                    }), (t2 = t1.eventManager).onlineState = e, s = !1, t2.queries.forEach((t1, n1)=>{
                        for (const t1 of n1.listeners)t1.io(e) && (s = !0);
                    }), s && jo(t2), t3.length && t1.$o.Rr(t3), t1.onlineState = e, t1.isPrimaryClient && t1.sharedClientState.setOnlineState(e);
                }
            }
            async function ac(t1, e, n1) {
                t1.sharedClientState.updateQueryState(e, "rejected", n1);
                const i = t1.Bo.get(e), r = i && i.key;
                if (r) {
                    let t2 = new wn(Pt.comparator);
                    t2 = t2.insert(r, Kt.newNoDocument(r, rt.min()));
                    const n1 = Pn().add(r), i = new Sn(rt.min(), new Map(), new gn(et), t2, n1);
                    await oc(t1, i), t1.Lo = t1.Lo.remove(r), t1.Bo.delete(e), yc(t1);
                } else await gr(t1.localStore, e, !1).then(()=>wc(t1, e, n1)).catch(Fi);
            }
            function wc(t1, e, n1 = null) {
                for (const s of (t1.sharedClientState.removeLocalQueryTarget(e), t1.Fo.get(e)))t1.Oo.delete(s), n1 && t1.$o.Go(s, n1);
                t1.Fo.delete(e), t1.isPrimaryClient && t1.Uo.cs(e).forEach((e)=>{
                    t1.Uo.containsKey(e) || _c(t1, e);
                });
            }
            function _c(t1, e) {
                t1.Mo.delete(e.path.canonicalString());
                const n1 = t1.Lo.get(e);
                null !== n1 && (ao(t1.remoteStore, n1), t1.Lo = t1.Lo.remove(e), t1.Bo.delete(n1), yc(t1));
            }
            function mc(t1, e, n1) {
                for (const s of n1)s instanceof Jo ? (t1.Uo.addReference(s.key, e), function(t1, e) {
                    const n1 = e.key, s = n1.path.canonicalString();
                    t1.Lo.get(n1) || t1.Mo.has(s) || ($("SyncEngine", "New document in limbo: " + n1), t1.Mo.add(s), yc(t1));
                }(t1, s)) : s instanceof Yo ? ($("SyncEngine", "Document no longer in limbo: " + s.key), t1.Uo.removeReference(s.key, e), t1.Uo.containsKey(s.key) || _c(t1, s.key)) : L();
            }
            function yc(t1) {
                for(; t1.Mo.size > 0 && t1.Lo.size < t1.maxConcurrentLimboResolutions;){
                    const e = t1.Mo.values().next().value;
                    t1.Mo.delete(e);
                    const n1 = new Pt(ht.fromString(e)), s = t1.jo.next();
                    t1.Bo.set(s, new tc(n1)), t1.Lo = t1.Lo.insert(n1, s), co(t1.remoteStore, new ii(Ee(new fe(n1.path)), s, 2, X.T));
                }
            }
            async function pc(t1, e, n1) {
                const i = [], r = [], o = [];
                t1.Oo.isEmpty() || (t1.Oo.forEach((t2, c)=>{
                    o.push(t1.Wo(c, e, n1).then((t2)=>{
                        if (t2) {
                            t1.isPrimaryClient && t1.sharedClientState.updateQueryState(c.targetId, t2.fromCache ? "not-current" : "current"), i.push(t2);
                            const e = or.kn(c.targetId, t2);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), t1.$o.Rr(i), await async function(t1, e) {
                    try {
                        await t1.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t2)=>js.forEach(e, (e)=>js.forEach(e.Nn, (s)=>t1.persistence.referenceDelegate.addReference(t2, e.targetId, s)).next(()=>js.forEach(e.xn, (s)=>t1.persistence.referenceDelegate.removeReference(t2, e.targetId, s)))));
                    } catch (t1) {
                        if (!Hs(t1)) throw t1;
                        $("LocalStore", "Failed to update sequence numbers: " + t1);
                    }
                    for (const t2 of e){
                        const e = t2.targetId;
                        if (!t2.fromCache) {
                            const t2 = t1.Un.get(e), s = t2.snapshotVersion, i = t2.withLastLimboFreeSnapshotVersion(s);
                            t1.Un = t1.Un.insert(e, i);
                        }
                    }
                }(t1.localStore, r));
            }
            async function Tc(t1, e) {
                if (!t1.currentUser.isEqual(e)) {
                    var e1;
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t2 = await hr(t1.localStore, e);
                    t1.currentUser = e, e1 = "'waitForPendingWrites' promise is rejected due to a user change.", t1.Ko.forEach((t1)=>{
                        t1.forEach((t1)=>{
                            t1.reject(new j(K.CANCELLED, e1));
                        });
                    }), t1.Ko.clear(), t1.sharedClientState.handleUserChange(e, t2.removedBatchIds, t2.addedBatchIds), await pc(t1, t2.Wn);
                }
            }
            function Ec(t1, e) {
                const s = t1.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t2 = Pn();
                    const s = t1.Fo.get(e);
                    if (!s) return t2;
                    for (const e of s){
                        const s = t1.Oo.get(e);
                        t2 = t2.unionWith(s.view.Ro);
                    }
                    return t2;
                }
            }
            class kc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(t1) {
                    this.N = new Bn(t1.databaseInfo.databaseId, !0), this.sharedClientState = this.Ho(t1), this.persistence = this.Jo(t1), await this.persistence.start(), this.gcScheduler = this.Yo(t1), this.localStore = this.Xo(t1);
                }
                Yo(t1) {
                    return null;
                }
                Xo(t1) {
                    return new ar(this.persistence, new cr(), t1.initialUser, this.N);
                }
                Jo(t1) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t1) {
                    return new Kr();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class Fc {
                async initialize(t1, e) {
                    this.localStore || (this.localStore = t1.localStore, this.sharedClientState = t1.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t1.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t1)=>cc(this.syncEngine, t1, 1), this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t1) {
                    return new Lo();
                }
                createDatastore(t1) {
                    const e = new Bn(t1.databaseInfo.databaseId, !0), n1 = new zr(t1.databaseInfo);
                    return new no(t1.credentials, n1, e);
                }
                createRemoteStore(t1) {
                    return new io(this.localStore, this.datastore, t1.asyncQueue, (t1)=>cc(this.syncEngine, t1, 0), Qr.bt() ? new Qr() : new jr());
                }
                createSyncEngine(t1, e) {
                    return function(t1, e, n1, s, i, r, o) {
                        const c = new ec(t1, e, n1, s, i, r);
                        return o && (c.Qo = !0), c;
                    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t1.initialUser, t1.maxConcurrentLimboResolutions, e);
                }
                terminate() {
                    return async function(t1) {
                        $("RemoteStore", "RemoteStore shutting down."), t1.Wr.add(5), await oo(t1), t1.zr.shutdown(), t1.Hr.set("Unknown");
                    }(this.remoteStore);
                }
            }
            class Lc {
                constructor(t1){
                    this.observer = t1, this.muted = !1;
                }
                next(t1) {
                    this.observer.next && this.tc(this.observer.next, t1);
                }
                error(t1) {
                    this.observer.error ? this.tc(this.observer.error, t1) : console.error("Uncaught Error in snapshot listener:", t1);
                }
                ec() {
                    this.muted = !0;
                }
                tc(t1, e) {
                    this.muted || setTimeout(()=>{
                        this.muted || t1(e);
                    }, 0);
                }
            }
            class Kc {
                constructor(t1, e, n1){
                    this.credentials = t1, this.asyncQueue = e, this.databaseInfo = n1, this.user = D.UNAUTHENTICATED, this.clientId = tt.I(), this.credentialListener = ()=>Promise.resolve(), this.credentials.start(e, async (t1)=>{
                        $("FirestoreClient", "Received user=", t1.uid), await this.credentialListener(t1), this.user = t1;
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
                setCredentialChangeListener(t1) {
                    this.credentialListener = t1;
                }
                verifyNotTerminated() {
                    if (this.asyncQueue.isShuttingDown) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const t1 = new Q();
                    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && await this.onlineComponents.terminate(), this.offlineComponents && await this.offlineComponents.terminate(), this.credentials.shutdown(), t1.resolve();
                        } catch (e) {
                            const n1 = ko(e, "Failed to shutdown persistence");
                            t1.reject(n1);
                        }
                    }), t1.promise;
                }
            }
            async function jc(t1, e) {
                t1.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n1 = await t1.getConfiguration();
                await e.initialize(n1);
                let s = n1.initialUser;
                t1.setCredentialChangeListener(async (t1)=>{
                    s.isEqual(t1) || (await hr(e.localStore, t1), s = t1);
                }), e.persistence.setDatabaseDeletedListener(()=>t1.terminate()), t1.offlineComponents = e;
            }
            async function Qc(t1, e) {
                t1.asyncQueue.verifyOperationInProgress();
                const n1 = await Wc(t1);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s = await t1.getConfiguration();
                await e.initialize(n1, s), t1.setCredentialChangeListener((t1)=>(async function(t1, e) {
                        t1.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(t1);
                        t1.Wr.add(3), await oo(t1), s && t1.Hr.set("Unknown"), await t1.remoteSyncer.handleCredentialChange(e), t1.Wr.delete(3), await ro(t1);
                    })(e.remoteStore, t1)), t1.onlineComponents = e;
            }
            async function Wc(t1) {
                return t1.offlineComponents || ($("FirestoreClient", "Using default OfflineComponentProvider"), await jc(t1, new kc())), t1.offlineComponents;
            }
            async function Gc(t1) {
                return t1.onlineComponents || ($("FirestoreClient", "Using default OnlineComponentProvider"), await Qc(t1, new Fc())), t1.onlineComponents;
            }
            async function Xc(t1) {
                const e = await Gc(t1), n1 = e.eventManager;
                return n1.onListen = nc.bind(null, e.syncEngine), n1.onUnlisten = ic.bind(null, e.syncEngine), n1;
            }
            class ua {
                constructor(t1, e, n1, s, i, r, o, c){
                    this.databaseId = t1, this.appId = e, this.persistenceKey = n1, this.host = s, this.ssl = i, this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = c;
                }
            }
            class ha {
                constructor(t1, e){
                    this.projectId = t1, this.database = e || "(default)";
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(t1) {
                    return t1 instanceof ha && t1.projectId === this.projectId && t1.database === this.database;
                }
            }
            const la = new Map();
            function _a(t1) {
                if (Pt.isDocumentKey(t1)) throw new j(K.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t1} has ${t1.length}.`);
            }
            function ga(t1, e) {
                if ("_delegate" in t1 && (t1 = t1._delegate), !(t1 instanceof e)) {
                    if (e.name === t1.constructor.name) throw new j(K.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n1 = function(t1) {
                            if (void 0 === t1) return "undefined";
                            if (null === t1) return "null";
                            if ("string" == typeof t1) return t1.length > 20 && (t1 = `${t1.substring(0, 20)}...`), JSON.stringify(t1);
                            if ("number" == typeof t1 || "boolean" == typeof t1) return "" + t1;
                            if ("object" == typeof t1) {
                                if (t1 instanceof Array) return "an array";
                                {
                                    var t2;
                                    const e = (t2 = t1).constructor ? t2.constructor.name : null;
                                    return e ? `a custom ${e} object` : "an object";
                                }
                            }
                            return "function" == typeof t1 ? "a function" : L();
                        }(t1);
                        throw new j(K.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n1}`);
                    }
                }
                return t1;
            }
            class pa {
                constructor(t1){
                    var e;
                    if (void 0 === t1.host) {
                        if (void 0 !== t1.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t1.host, this.ssl = null === (e = t1.ssl) || void 0 === e || e;
                    if (this.credentials = t1.credentials, this.ignoreUndefinedProperties = !!t1.ignoreUndefinedProperties, void 0 === t1.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t1.cacheSizeBytes && t1.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t1.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t1.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t1.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t1.useFetchStreams, function(t1, e, n1, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t1} and ${n1} cannot be used together.`);
                    }("experimentalForceLongPolling", t1.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t1.experimentalAutoDetectLongPolling);
                }
                isEqual(t1) {
                    return this.host === t1.host && this.ssl === t1.ssl && this.credentials === t1.credentials && this.cacheSizeBytes === t1.cacheSizeBytes && this.experimentalForceLongPolling === t1.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t1.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t1.ignoreUndefinedProperties && this.useFetchStreams === t1.useFetchStreams;
                }
            }
            class Ta {
                constructor(t1, e){
                    this._credentials = e, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({}), this._settingsFrozen = !1, t1 instanceof ha ? this._databaseId = t1 : (this._app = t1, this._databaseId = function(t1) {
                        if (!Object.prototype.hasOwnProperty.apply(t1.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new ha(t1.options.projectId);
                    }(t1));
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
                _setSettings(t1) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t1), void 0 !== t1.credentials && (this._credentials = function(t1) {
                        if (!t1) return new G();
                        switch(t1.type){
                            case "gapi":
                                const e = t1.client;
                                return "object" == typeof e && null !== e && e.auth && e.auth.getAuthHeaderValueForFirstParty || L(), new Y(e, t1.sessionIndex || "0", t1.iamToken || null);
                            case "provider":
                                return t1.client;
                            default:
                                throw new j(K.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    }(t1.credentials));
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
                    return function(t1) {
                        const e = la.get(t1);
                        e && ($("ComponentProvider", "Removing Datastore"), la.delete(t1), e.terminate());
                    }(this), Promise.resolve();
                }
            }
            class Ia {
                constructor(t1, e, n1){
                    this.converter = e, this._key = n1, this.type = "document", this.firestore = t1;
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
                withConverter(t1) {
                    return new Ia(this.firestore, t1, this._key);
                }
            }
            class Aa {
                constructor(t1, e, n1){
                    this.converter = e, this._query = n1, this.type = "query", this.firestore = t1;
                }
                withConverter(t1) {
                    return new Aa(this.firestore, t1, this._query);
                }
            }
            class Ra extends Aa {
                constructor(t1, e, n1){
                    super(t1, e, new fe(n1)), this._path = n1, this.type = "collection";
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const t1 = this._path.popLast();
                    return t1.isEmpty() ? null : new Ia(this.firestore, null, new Pt(t1));
                }
                withConverter(t1) {
                    return new Ra(this.firestore, t1, this._path);
                }
            }
            function ba(t1, e, ...n1) {
                if (t1 = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.m9)(t1), function(t1, e, n1) {
                    if (!n1) throw new j(K.INVALID_ARGUMENT, `Function ${t1}() cannot be called with an empty ${e}.`);
                }("collection", "path", e), t1 instanceof Ta) {
                    const s = ht.fromString(e, ...n1);
                    return _a(s), new Ra(t1, null, s);
                }
                {
                    if (!(t1 instanceof Ia || t1 instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t1._path.child(ht.fromString(e, ...n1));
                    return _a(s), new Ra(t1.firestore, null, s);
                }
            }
            class Da {
                constructor(){
                    this._c = Promise.resolve(), this.mc = [], this.gc = !1, this.yc = [], this.Tc = null, this.Ec = !1, this.Ic = !1, this.Ac = [], this.ar = new Xr(this, "async_queue_retry"), this.Rc = ()=>{
                        const t1 = Jr();
                        t1 && $("AsyncQueue", "Visibility state changed to " + t1.visibilityState), this.ar.tr();
                    };
                    const t1 = Jr();
                    t1 && "function" == typeof t1.addEventListener && t1.addEventListener("visibilitychange", this.Rc);
                }
                get isShuttingDown() {
                    return this.gc;
                }
                enqueueAndForget(t1) {
                    this.enqueue(t1);
                }
                enqueueAndForgetEvenWhileRestricted(t1) {
                    this.bc(), this.Pc(t1);
                }
                enterRestrictedMode(t1) {
                    if (!this.gc) {
                        this.gc = !0, this.Ic = t1 || !1;
                        const e = Jr();
                        e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(t1) {
                    if (this.bc(), this.gc) return new Promise(()=>{});
                    const e = new Q();
                    return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t1().then(e.resolve, e.reject), e.promise)).then(()=>e.promise);
                }
                enqueueRetryable(t1) {
                    this.enqueueAndForget(()=>(this.mc.push(t1), this.vc()));
                }
                async vc() {
                    if (0 !== this.mc.length) {
                        try {
                            await this.mc[0](), this.mc.shift(), this.ar.reset();
                        } catch (t1) {
                            if (!Hs(t1)) throw t1;
                            $("AsyncQueue", "Operation failed with retryable error: " + t1);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(t1) {
                    const e = this._c.then(()=>(this.Ec = !0, t1().catch((t1)=>{
                            let e;
                            throw this.Tc = t1, this.Ec = !1, O("INTERNAL UNHANDLED ERROR: ", (e = t1.message || "", t1.stack && (e = t1.stack.includes(t1.message) ? t1.stack : t1.message + "\n" + t1.stack), e)), t1;
                        }).then((t1)=>(this.Ec = !1, t1))));
                    return this._c = e, e;
                }
                enqueueAfterDelay(t1, e, n1) {
                    this.bc(), this.Ac.indexOf(t1) > -1 && (e = 0);
                    const s = xo.createAndSchedule(this, t1, e, n1, (t1)=>this.Vc(t1));
                    return this.yc.push(s), s;
                }
                bc() {
                    this.Tc && L();
                }
                verifyOperationInProgress() {}
                async Sc() {
                    let t1;
                    do t1 = this._c, await t1;
                    while (t1 !== this._c)
                }
                Dc(t1) {
                    for (const e of this.yc)if (e.timerId === t1) return !0;
                    return !1;
                }
                Cc(t1) {
                    return this.Sc().then(()=>{
                        for (const e of (this.yc.sort((t1, e)=>t1.targetTimeMs - e.targetTimeMs), this.yc))if (e.skipDelay(), "all" !== t1 && e.timerId === t1) break;
                        return this.Sc();
                    });
                }
                Nc(t1) {
                    this.Ac.push(t1);
                }
                Vc(t1) {
                    const e = this.yc.indexOf(t1);
                    this.yc.splice(e, 1);
                }
            }
            class ka extends Ta {
                constructor(t1, e){
                    super(t1, e), this.type = "firestore", this._queue = new Da(), this._persistenceKey = "name" in t1 ? t1.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t1) {
                var e;
                const n1 = t1._freezeSettings(), s = new ua(t1._databaseId, (null === (e = t1._app) || void 0 === e ? void 0 : e.options.appId) || "", t1._persistenceKey, n1.host, n1.ssl, n1.experimentalForceLongPolling, n1.experimentalAutoDetectLongPolling, n1.useFetchStreams);
                t1._firestoreClient = new Kc(t1._credentials, t1._queue, s);
            }
            class Ja {
                constructor(...t1){
                    for(let e = 0; e < t1.length; ++e)if (0 === t1[e].length) throw new j(K.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new ft(t1);
                }
                isEqual(t1) {
                    return this._internalPath.isEqual(t1._internalPath);
                }
            }
            class Xa {
                constructor(t1){
                    this._byteString = t1;
                }
                static fromBase64String(t1) {
                    try {
                        return new Xa(_t.fromBase64String(t1));
                    } catch (t1) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t1);
                    }
                }
                static fromUint8Array(t1) {
                    return new Xa(_t.fromUint8Array(t1));
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
                isEqual(t1) {
                    return this._byteString.isEqual(t1._byteString);
                }
            }
            class tu {
                constructor(t1, e){
                    if (!isFinite(t1) || t1 < -90 || t1 > 90) throw new j(K.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t1);
                    if (!isFinite(e) || e < -180 || e > 180) throw new j(K.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
                    this._lat = t1, this._long = e;
                }
                get latitude() {
                    return this._lat;
                }
                get longitude() {
                    return this._long;
                }
                isEqual(t1) {
                    return this._lat === t1._lat && this._long === t1._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(t1) {
                    return et(this._lat, t1._lat) || et(this._long, t1._long);
                }
            }
            const Au = RegExp("[~\\*/\\[\\]]");
            function bu(t1, e, n1, s, i) {
                const r = s && !s.isEmpty(), o = void 0 !== i;
                let c = `Function ${e}() called with invalid data`;
                n1 && (c += " (via `toFirestore()`)"), c += ". ";
                let a = "";
                return (r || o) && (a += " (found", r && (a += ` in field ${s}`), o && (a += ` in document ${i}`), a += ")"), new j(K.INVALID_ARGUMENT, c + t1 + a);
            }
            class vu {
                constructor(t1, e, n1, s, i){
                    this._firestore = t1, this._userDataWriter = e, this._key = n1, this._document = s, this._converter = i;
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
                            const t1 = new Vu(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(t1);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(t1) {
                    if (this._document) {
                        const e = this._document.data.field(Su("DocumentSnapshot.get", t1));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            class Vu extends vu {
                data() {
                    return super.data();
                }
            }
            function Su(t1, e) {
                return "string" == typeof e ? function(t1, e) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t1, !1, void 0, void 0);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t1, !1, void 0, n);
                    }
                }(t1, e) : e instanceof Ja ? e._internalPath : e._delegate._internalPath;
            }
            class Du {
                constructor(t1, e){
                    this.hasPendingWrites = t1, this.fromCache = e;
                }
                isEqual(t1) {
                    return this.hasPendingWrites === t1.hasPendingWrites && this.fromCache === t1.fromCache;
                }
            }
            class Cu extends vu {
                constructor(t1, e, n1, s, i, r){
                    super(t1, e, n1, s, r), this._firestore = t1, this._firestoreImpl = t1, this.metadata = i;
                }
                exists() {
                    return super.exists();
                }
                data(t1 = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const e = new Nu(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(e, t1);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t1.serverTimestamps);
                    }
                }
                get(t1, e = {}) {
                    if (this._document) {
                        const n1 = this._document.data.field(Su("DocumentSnapshot.get", t1));
                        if (null !== n1) return this._userDataWriter.convertValue(n1, e.serverTimestamps);
                    }
                }
            }
            class Nu extends Cu {
                data(t1 = {}) {
                    return super.data(t1);
                }
            }
            class xu {
                constructor(t1, e, n1, s){
                    this._firestore = t1, this._userDataWriter = e, this._snapshot = s, this.metadata = new Du(s.hasPendingWrites, s.fromCache), this.query = n1;
                }
                get docs() {
                    const t1 = [];
                    return this.forEach((e)=>t1.push(e)), t1;
                }
                get size() {
                    return this._snapshot.docs.size;
                }
                get empty() {
                    return 0 === this.size;
                }
                forEach(t1, e) {
                    this._snapshot.docs.forEach((n1)=>{
                        t1.call(e, new Nu(this._firestore, this._userDataWriter, n1.key, n1, new Du(this._snapshot.mutatedKeys.has(n1.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(t1 = {}) {
                    const e = !!t1.includeMetadataChanges;
                    if (e && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = function(t1, e) {
                        if (t1._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t1._snapshot.docChanges.map((n1)=>({
                                    type: "added",
                                    doc: new Nu(t1._firestore, t1._userDataWriter, n1.doc.key, n1.doc, new Du(t1._snapshot.mutatedKeys.has(n1.doc.key), t1._snapshot.fromCache), t1.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                }));
                        }
                        {
                            let n1 = t1._snapshot.oldDocs;
                            return t1._snapshot.docChanges.filter((t1)=>e || 3 !== t1.type).map((e)=>{
                                const s = new Nu(t1._firestore, t1._userDataWriter, e.doc.key, e.doc, new Du(t1._snapshot.mutatedKeys.has(e.doc.key), t1._snapshot.fromCache), t1.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n1.indexOf(e.doc.key), n1 = n1.delete(e.doc.key)), 1 !== e.type && (r = (n1 = n1.add(e.doc)).indexOf(e.doc.key)), {
                                    type: function(t1) {
                                        switch(t1){
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
                convertValue(t1, e = "none") {
                    switch(vt(t1)){
                        case 0:
                            return null;
                        case 1:
                            return t1.booleanValue;
                        case 2:
                            return yt(t1.integerValue || t1.doubleValue);
                        case 3:
                            return this.convertTimestamp(t1.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(t1, e);
                        case 5:
                            return t1.stringValue;
                        case 6:
                            return this.convertBytes(pt(t1.bytesValue));
                        case 7:
                            return this.convertReference(t1.referenceValue);
                        case 8:
                            return this.convertGeoPoint(t1.geoPointValue);
                        case 9:
                            return this.convertArray(t1.arrayValue, e);
                        case 10:
                            return this.convertObject(t1.mapValue, e);
                        default:
                            throw L();
                    }
                }
                convertObject(t1, e) {
                    const n1 = {};
                    return ct(t1.fields, (t1, s)=>{
                        n1[t1] = this.convertValue(s, e);
                    }), n1;
                }
                convertGeoPoint(t1) {
                    return new tu(yt(t1.latitude), yt(t1.longitude));
                }
                convertArray(t1, e) {
                    return (t1.values || []).map((t1)=>this.convertValue(t1, e));
                }
                convertServerTimestamp(t1, e) {
                    switch(e){
                        case "previous":
                            const n1 = function Et(t1) {
                                const e = t1.mapValue.fields.__previous_value__;
                                return Tt(e) ? Et(e) : e;
                            }(t1);
                            return null == n1 ? null : this.convertValue(n1, e);
                        case "estimate":
                            return this.convertTimestamp(It(t1));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t1) {
                    const e = gt(t1);
                    return new it(e.seconds, e.nanos);
                }
                convertDocumentKey(t1, e) {
                    const n1 = ht.fromString(t1);
                    Ts(n1) || L();
                    const s = new ha(n1.get(1), n1.get(3)), i = new Pt(n1.popFirst(5));
                    return s.isEqual(e) || O(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
                }
            }
            class ah extends nh {
                constructor(t1){
                    super(), this.firestore = t1;
                }
                convertBytes(t1) {
                    return new Xa(t1);
                }
                convertReference(t1) {
                    const e = this.convertDocumentKey(t1, this.firestore._databaseId);
                    return new Ia(this.firestore, null, e);
                }
            }
            function lh(t1) {
                t1 = ga(t1, Aa);
                const e = ga(t1.firestore, ka), n1 = (e._firestoreClient || Ma(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient), s = new ah(e);
                return function(t1) {
                    if (me(t1) && 0 === t1.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                }(t1._query), (function(t1, e, n1 = {}) {
                    const s = new Q();
                    return t1.asyncQueue.enqueueAndForget(async ()=>(function(t1, e, n1, s, i) {
                            const o = new Qo(n1, new Lc({
                                next: (n1)=>{
                                    e.enqueueAndForget(()=>Uo(t1, o)), n1.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n1);
                                },
                                error: (t1)=>i.reject(t1)
                            }), {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t1, o);
                        })(await Xc(t1), t1.asyncQueue, e, n1, s)), s.promise;
                })(n1, t1._query).then((n1)=>new xu(e, s, t1, n1));
            }
            !function(t1, e = !0) {
                C = _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Jn, (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Xd)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.wA("firestore", (t1, { options: n1 })=>{
                    const i = new ka(t1.getProvider("app").getImmediate(), new H(t1.getProvider("auth-internal")));
                    return n1 = Object.assign({
                        useFetchStreams: e
                    }, n1), i._setSettings(n1), i;
                }, "PUBLIC")), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", void 0), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", "esm2017");
            }();
        }
    }
]);
