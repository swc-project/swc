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
                throw O(e), new Error(e);
            }
            function B(t, e) {
                t || L();
            }
            function q(t, e) {
                return t;
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
                    super(e), this.code = t, this.message = e, this.name = "FirebaseError", this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`
                    ;
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
                    t.enqueueRetryable(()=>e(D.UNAUTHENTICATED)
                    );
                }
                shutdown() {}
            }
            class H {
                constructor(t){
                    this.t = t, this.currentUser = D.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t1, e2) {
                    let n = this.i;
                    const s = (t)=>this.i !== n ? (n = this.i, e2(t)) : Promise.resolve()
                    ;
                    let i = new Q;
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q, t1.enqueueRetryable(()=>s(this.currentUser)
                        );
                    };
                    const r = ()=>{
                        const e = i;
                        t1.enqueueRetryable(async ()=>{
                            await e.promise, await s(this.currentUser);
                        });
                    }, o = (t)=>{
                        $("FirebaseCredentialsProvider", "Auth detected"), this.auth = t, this.auth.addAuthTokenListener(this.o), r();
                    };
                    this.t.onInit((t)=>o(t)
                    ), setTimeout(()=>{
                        if (!this.auth) {
                            const t = this.t.getImmediate({
                                optional: !0
                            });
                            t ? o(t) : ($("FirebaseCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Q);
                        }
                    }, 0), r();
                }
                getToken() {
                    const t = this.i, e3 = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e3).then((e)=>this.i !== t ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? (B("string" == typeof e.accessToken), new W(e.accessToken, this.currentUser)) : null
                    ) : Promise.resolve(null);
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const t = this.auth && this.auth.getUid();
                    return B(null === t || "string" == typeof t), new D(t);
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
                    t.enqueueRetryable(()=>e(D.FIRST_PARTY)
                    );
                }
                shutdown() {}
                invalidateToken() {}
            }
            class X {
                constructor(t2, e){
                    this.previousValue = t2, e && (e.sequenceNumberHandler = (t)=>this.g(t)
                    , this.p = (t)=>e.writeSequenceNumber(t)
                    );
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
                else for(let e4 = 0; e4 < t; e4++)n[e4] = Math.floor(256 * Math.random());
                return n;
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function nt(t3, e, n) {
                return t3.length === e.length && t3.every((t, s)=>n(t, e[s])
                );
            }
            X.T = -1;
            class it {
                constructor(t, e){
                    if (this.seconds = t, this.nanoseconds = e, e < 0) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (e >= 1000000000) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (t < -62135596800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                    if (t >= 253402300800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                }
                static now() {
                    return it.fromMillis(Date.now());
                }
                static fromDate(t) {
                    return it.fromMillis(t.getTime());
                }
                static fromMillis(t) {
                    const e = Math.floor(t / 1000);
                    return new it(e, Math.floor(1000000 * (t - 1000 * e)));
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1000 * this.seconds + this.nanoseconds / 1000000;
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
                    return 1000000 * this.timestamp.seconds + this.timestamp.nanoseconds / 1000;
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
                child(t4) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t4 instanceof ut ? t4.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t4), this.construct(e);
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
                static fromString(...t5) {
                    const e = [];
                    for (const n of t5){
                        if (n.indexOf("//") >= 0) throw new j(K.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
                        e.push(...n.split("/").filter((t)=>t.length > 0
                        ));
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
                    return this.toArray().map((t)=>(t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), ft.isValidIdentifier(t) || (t = "`" + t + "`"), t)
                    ).join(".");
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
                        } else "`" === e ? (r = !r, s++) : "." !== e || r ? (n += e, s++) : (i(), s++);
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
                isEqual(t6) {
                    return nt(this.fields, t6.fields, (t, e)=>t.isEqual(e)
                    );
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
                static fromUint8Array(t7) {
                    const e5 = function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(t7);
                    return new _t(e5);
                }
                toBase64() {
                    return btoa(this.binaryString);
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
                    return et(this.binaryString, t.binaryString);
                }
                isEqual(t) {
                    return this.binaryString === t.binaryString;
                }
            }
            _t.EMPTY_BYTE_STRING = new _t("");
            const mt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function gt(t) {
                if (B(!!t), "string" == typeof t) {
                    let e = 0;
                    const n = mt.exec(t);
                    if (B(!!n), n[1]) {
                        let t = n[1];
                        e = Number(t = (t + "000000000").substr(0, 9));
                    }
                    const s = new Date(t);
                    return {
                        seconds: Math.floor(s.getTime() / 1000),
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
            function At(t) {
                return null == t;
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
            function Vt(t10, e8) {
                var t8, e6, t9, e7;
                const n1 = vt(t10);
                if (n1 !== vt(e8)) return !1;
                switch(n1){
                    case 0:
                        return !0;
                    case 1:
                        return t10.booleanValue === e8.booleanValue;
                    case 4:
                        return It(t10).isEqual(It(e8));
                    case 3:
                        return (function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) return t.timestampValue === e.timestampValue;
                            const n = gt(t.timestampValue), s = gt(e.timestampValue);
                            return n.seconds === s.seconds && n.nanos === s.nanos;
                        })(t10, e8);
                    case 5:
                        return t10.stringValue === e8.stringValue;
                    case 6:
                        return t8 = t10, e6 = e8, pt(t8.bytesValue).isEqual(pt(e6.bytesValue));
                    case 7:
                        return t10.referenceValue === e8.referenceValue;
                    case 8:
                        return t9 = t10, e7 = e8, yt(t9.geoPointValue.latitude) === yt(e7.geoPointValue.latitude) && yt(t9.geoPointValue.longitude) === yt(e7.geoPointValue.longitude);
                    case 2:
                        return (function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return yt(t.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = yt(t.doubleValue), s = yt(e.doubleValue);
                                return n === s ? Rt(n) === Rt(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        })(t10, e8);
                    case 9:
                        return nt(t10.arrayValue.values || [], e8.arrayValue.values || [], Vt);
                    case 10:
                        return (function(t, e) {
                            const n = t.mapValue.fields || {}, s = e.mapValue.fields || {};
                            if (ot(n) !== ot(s)) return !1;
                            for(const t11 in n)if (n.hasOwnProperty(t11) && (void 0 === s[t11] || !Vt(n[t11], s[t11]))) return !1;
                            return !0;
                        })(t10, e8);
                    default:
                        return L();
                }
            }
            function St(t12, e) {
                return void 0 !== (t12.values || []).find((t)=>Vt(t, e)
                );
            }
            function Dt(t13, e9) {
                const n2 = vt(t13), s1 = vt(e9);
                if (n2 !== s1) return et(n2, s1);
                switch(n2){
                    case 0:
                        return 0;
                    case 1:
                        return et(t13.booleanValue, e9.booleanValue);
                    case 2:
                        return (function(t, e) {
                            const n = yt(t.integerValue || t.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        })(t13, e9);
                    case 3:
                        return Ct(t13.timestampValue, e9.timestampValue);
                    case 4:
                        return Ct(It(t13), It(e9));
                    case 5:
                        return et(t13.stringValue, e9.stringValue);
                    case 6:
                        return (function(t, e) {
                            const n = pt(t), s = pt(e);
                            return n.compareTo(s);
                        })(t13.bytesValue, e9.bytesValue);
                    case 7:
                        return (function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let t14 = 0; t14 < n.length && t14 < s.length; t14++){
                                const e = et(n[t14], s[t14]);
                                if (0 !== e) return e;
                            }
                            return et(n.length, s.length);
                        })(t13.referenceValue, e9.referenceValue);
                    case 8:
                        return (function(t, e) {
                            const n = et(yt(t.latitude), yt(e.latitude));
                            return 0 !== n ? n : et(yt(t.longitude), yt(e.longitude));
                        })(t13.geoPointValue, e9.geoPointValue);
                    case 9:
                        return (function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let t15 = 0; t15 < n.length && t15 < s.length; ++t15){
                                const e = Dt(n[t15], s[t15]);
                                if (e) return e;
                            }
                            return et(n.length, s.length);
                        })(t13.arrayValue, e9.arrayValue);
                    case 10:
                        return (function(t, e) {
                            const n = t.fields || {}, s = Object.keys(n), i = e.fields || {}, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t16 = 0; t16 < s.length && t16 < r.length; ++t16){
                                const e = et(s[t16], r[t16]);
                                if (0 !== e) return e;
                                const o = Dt(n[s[t16]], i[r[t16]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        })(t13.mapValue, e9.mapValue);
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
            function xt(t17) {
                var e10, n3;
                return "nullValue" in t17 ? "null" : "booleanValue" in t17 ? "" + t17.booleanValue : "integerValue" in t17 ? "" + t17.integerValue : "doubleValue" in t17 ? "" + t17.doubleValue : "timestampValue" in t17 ? function(t) {
                    const e = gt(t);
                    return `time(${e.seconds},${e.nanos})`;
                }(t17.timestampValue) : "stringValue" in t17 ? t17.stringValue : "bytesValue" in t17 ? pt(t17.bytesValue).toBase64() : "referenceValue" in t17 ? (n3 = t17.referenceValue, Pt.fromName(n3).toString()) : "geoPointValue" in t17 ? `geo(${(e10 = t17.geoPointValue).latitude},${e10.longitude})` : "arrayValue" in t17 ? function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? n = !1 : e += ",", e += xt(s);
                    return e + "]";
                }(t17.arrayValue) : "mapValue" in t17 ? function(t) {
                    const e = Object.keys(t.fields || {}).sort();
                    let n = "{", s = !0;
                    for (const i of e)s ? s = !1 : n += ",", n += `${i}:${xt(t.fields[i])}`;
                    return n + "}";
                }(t17.mapValue) : L();
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
            function Bt(t18) {
                if (t18.geoPointValue) return {
                    geoPointValue: Object.assign({}, t18.geoPointValue)
                };
                if (t18.timestampValue && "object" == typeof t18.timestampValue) return {
                    timestampValue: Object.assign({}, t18.timestampValue)
                };
                if (t18.mapValue) {
                    const e = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return ct(t18.mapValue.fields, (t, n)=>e.mapValue.fields[t] = Bt(n)
                    ), e;
                }
                if (t18.arrayValue) {
                    const e = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let n = 0; n < (t18.arrayValue.values || []).length; ++n)e.arrayValue.values[n] = Bt(t18.arrayValue.values[n]);
                    return e;
                }
                return Object.assign({}, t18);
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
                setAll(t19) {
                    let e = ft.emptyPath(), n = {}, s = [];
                    t19.forEach((t, i)=>{
                        if (!e.isImmediateParentOf(i)) {
                            const t = this.getFieldsMap(e);
                            this.applyChanges(t, n, s), n = {}, s = [], e = i.popLast();
                        }
                        t ? n[i.lastSegment()] = Bt(t) : s.push(i.lastSegment());
                    });
                    const i1 = this.getFieldsMap(e);
                    this.applyChanges(i1, n, s);
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
                applyChanges(t, e12, n4) {
                    for (const e11 of (ct(e12, (e, n)=>t[e] = n
                    ), n4))delete t[e11];
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
            function Wt(t22) {
                const e = q(t22);
                if (null === e.A) {
                    let t20 = e.path.canonicalString();
                    null !== e.collectionGroup && (t20 += "|cg:" + e.collectionGroup), t20 += "|f:", t20 += e.filters.map((t)=>Yt(t)
                    ).join(","), t20 += "|ob:", t20 += e.orderBy.map((t)=>{
                        var t21;
                        return (t21 = t).field.canonicalString() + t21.dir;
                    }).join(","), At(e.limit) || (t20 += "|l:", t20 += e.limit), e.startAt && (t20 += "|lb:", t20 += ce(e.startAt)), e.endAt && (t20 += "|ub:", t20 += ce(e.endAt)), e.A = t20;
                }
                return e.A;
            }
            function zt(t, e) {
                var n, s;
                if (t.limit !== e.limit) return !1;
                if (t.orderBy.length !== e.orderBy.length) return !1;
                for(let n5 = 0; n5 < t.orderBy.length; n5++)if (!ue(t.orderBy[n5], e.orderBy[n5])) return !1;
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
                    return this.keys.some((e)=>e.isEqual(t.key)
                    );
                }
            }
            class te extends Jt {
                constructor(t, e){
                    super(t, "not-in", e), this.keys = ee("not-in", e);
                }
                matches(t) {
                    return !this.keys.some((e)=>e.isEqual(t.key)
                    );
                }
            }
            function ee(t23, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>Pt.fromName(t.referenceValue)
                );
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
                matches(t24) {
                    const e = t24.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>St(this.value.arrayValue, t)
                    );
                }
            }
            class oe {
                constructor(t, e){
                    this.position = t, this.before = e;
                }
            }
            function ce(t25) {
                return `${t25.before ? "b" : "a"}:${t25.position.map((t)=>Nt(t)
                ).join(",")}`;
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
                if (null === e) return !1;
                if (t.before !== e.before || t.position.length !== e.position.length) return !1;
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
                return !At(t.limit) && "F" === t.limitType;
            }
            function me(t) {
                return !At(t.limit) && "L" === t.limitType;
            }
            function Te(t) {
                const e13 = q(t);
                if (null === e13.V) {
                    var t26;
                    e13.V = [];
                    const t27 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(e13), n = (t26 = e13).explicitOrderBy.length > 0 ? t26.explicitOrderBy[0].field : null;
                    if (null !== t27 && null === n) t27.isKeyField() || e13.V.push(new ae(t27)), e13.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t = !1;
                        for (const n of e13.explicitOrderBy)e13.V.push(n), n.field.isKeyField() && (t = !0);
                        if (!t) {
                            const t = e13.explicitOrderBy.length > 0 ? e13.explicitOrderBy[e13.explicitOrderBy.length - 1].dir : "asc";
                            e13.V.push(new ae(ft.keyField(), t));
                        }
                    }
                }
                return e13.V;
            }
            function Ee(t) {
                const e = q(t);
                if (!e.S) if ("F" === e.limitType) e.S = Qt(e.path, e.collectionGroup, Te(e), e.filters, e.limit, e.startAt, e.endAt);
                else {
                    const t = [];
                    for (const n of Te(e)){
                        const e = "desc" === n.dir ? "asc" : "desc";
                        t.push(new ae(n.field, e));
                    }
                    const n6 = e.endAt ? new oe(e.endAt.position, !e.endAt.before) : null, s = e.startAt ? new oe(e.startAt.position, !e.startAt.before) : null;
                    e.S = Qt(e.path, e.collectionGroup, t, e.filters, e.limit, n6, s);
                }
                return e.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t29) {
                var t28;
                let e14;
                return `Query(target=${e14 = (t28 = Ee(t29)).path.canonicalString(), null !== t28.collectionGroup && (e14 += " collectionGroup=" + t28.collectionGroup), t28.filters.length > 0 && (e14 += `, filters: [${t28.filters.map((t)=>{
                    var e;
                    return `${(e = t).field.canonicalString()} ${e.op} ${Nt(e.value)}`;
                }).join(", ")}]`), At(t28.limit) || (e14 += ", limit: " + t28.limit), t28.orderBy.length > 0 && (e14 += `, orderBy: [${t28.orderBy.map((t)=>{
                    var t30;
                    return t30 = t, `${t30.field.canonicalString()} (${t30.dir})`;
                }).join(", ")}]`), t28.startAt && (e14 += ", startAt: " + ce(t28.startAt)), t28.endAt && (e14 += ", endAt: " + ce(t28.endAt)), `Target(${e14})`}; limitType=${t29.limitType})`;
            }
            function Pe(t32, e16) {
                var t31, e15;
                return e16.isFoundDocument() && function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                }(t32, e16) && function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                }(t32, e16) && function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                }(t32, e16) && (t31 = t32, e15 = e16, (!t31.startAt || !!he(t31.startAt, Te(t31), e15)) && !(t31.endAt && he(t31.endAt, Te(t31), e15)));
            }
            function ve(t33) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t33)){
                        const t = Ve(i, e, n);
                        if (0 !== t) return t;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            function Ve(t34, e17, n7) {
                const s2 = t34.field.isKeyField() ? Pt.comparator(e17.key, n7.key) : function(t, e, n) {
                    const s = e.data.field(t), i = n.data.field(t);
                    return null !== s && null !== i ? Dt(s, i) : L();
                }(t34.field, e17, n7);
                switch(t34.dir){
                    case "asc":
                        return s2;
                    case "desc":
                        return -1 * s2;
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
            function xe(t35, e18, n8) {
                return t35 instanceof Oe ? function(t, e) {
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
                }(n8, e18) : t35 instanceof Fe ? Me(t35, e18) : t35 instanceof Le ? Be(t35, e18) : function(t, e) {
                    const n = $e(t, e), s = qe(n) + qe(t.C);
                    return $t(n) && $t(t.C) ? De(s) : Se(t.N, s);
                }(t35, e18);
            }
            function ke(t, e, n) {
                return t instanceof Fe ? Me(t, e) : t instanceof Le ? Be(t, e) : n;
            }
            function $e(t, e) {
                var n, t36;
                return t instanceof Ue ? $t(n = e) || (t36 = n) && "doubleValue" in t36 ? e : {
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
            function Me(t37, e) {
                const n = Ke(e);
                for (const e19 of t37.elements)n.some((t)=>Vt(t, e19)
                ) || n.push(e19);
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
            function Be(t38, e) {
                let n = Ke(e);
                for (const e20 of t38.elements)n = n.filter((t)=>!Vt(t, e20)
                );
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
                    return new Ge;
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
            function Je(t39, e21, n9) {
                t39 instanceof en ? function(t, e, n) {
                    const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                    s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                }(t39, e21, n9) : t39 instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                    const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                }(t39, e21, n9) : function(t, e, n) {
                    e.convertToNoDocument(n.version).setHasCommittedMutations();
                }(0, e21, n9);
            }
            function Ye(t41, e23, n10) {
                var t40, e22;
                t41 instanceof en ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                    s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                }(t41, e23, n10) : t41 instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = on(t.fieldTransforms, n, e), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                }(t41, e23, n10) : (t40 = t41, e22 = e23, ze(t40.precondition, e22) && e22.convertToNoDocument(rt.min()));
            }
            function Ze(t45, e27) {
                var t42, e24;
                return t45.type === e27.type && !!t45.key.isEqual(e27.key) && !!t45.precondition.isEqual(e27.precondition) && (t42 = t45.fieldTransforms, e24 = e27.fieldTransforms, !!(void 0 === t42 && void 0 === e24 || !(!t42 || !e24) && nt(t42, e24, (t, e)=>{
                    var t43, e25, t44, e26;
                    return t43 = t, e25 = e, t43.field.isEqual(e25.field) && (t44 = t43.transform, e26 = e25.transform, t44 instanceof Fe && e26 instanceof Fe || t44 instanceof Le && e26 instanceof Le ? nt(t44.elements, e26.elements, Vt) : t44 instanceof Ue && e26 instanceof Ue ? Vt(t44.C, e26.C) : t44 instanceof Oe && e26 instanceof Oe);
                })) && (0 === t45.type ? t45.value.isEqual(e27.value) : 1 !== t45.type || t45.data.isEqual(e27.data) && t45.fieldMask.isEqual(e27.fieldMask)));
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
                const e = new Map;
                return t.fieldMask.fields.forEach((n)=>{
                    if (!n.isEmpty()) {
                        const s = t.data.field(n);
                        e.set(n, s);
                    }
                }), e;
            }
            function rn(t, e, n) {
                const s = new Map;
                B(t.length === n.length);
                for(let i = 0; i < n.length; i++){
                    const r = t[i], o = r.transform, c = e.data.field(r.field);
                    s.set(r.field, ke(o, c, n[i]));
                }
                return s;
            }
            function on(t, e, n) {
                const s = new Map;
                for (const i of t){
                    const t = i.transform, r = n.data.field(i.field);
                    s.set(i.field, xe(t, r, e));
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
                    this.inorderTraversal((e, n)=>(t(e, n), !1)
                    );
                }
                toString() {
                    const t = [];
                    return this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)
                    ), `{${t.join(", ")}}`;
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
                    if (this.isRed() && this.left.isRed()) throw L();
                    if (this.right.isRed()) throw L();
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
            };
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
                    this.data.inorderTraversal((e, n)=>(t(e), !1)
                    );
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
                unionWith(t46) {
                    let e = this;
                    return e.size < t46.size && (e = t46, t46 = this), t46.forEach((t)=>{
                        e = e.add(t);
                    }), e;
                }
                isEqual(t) {
                    if (!(t instanceof gn)) return !1;
                    if (this.size !== t.size) return !1;
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
                    return this.forEach((e)=>t.push(e)
                    ), "SortedSet(" + t.toString() + ")";
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
            const pn = new wn(Pt.comparator);
            function Tn() {
                return pn;
            }
            const En = new wn(Pt.comparator);
            function In() {
                return En;
            }
            const An = new wn(Pt.comparator);
            function Rn() {
                return An;
            }
            const bn = new gn(Pt.comparator);
            function Pn(...t) {
                let e = bn;
                for (const n of t)e = e.add(n);
                return e;
            }
            const vn = new gn(et);
            function Vn() {
                return vn;
            }
            class Sn {
                constructor(t, e, n, s, i){
                    this.snapshotVersion = t, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
                }
                static createSynthesizedRemoteEventForCurrentChange(t, e) {
                    const n = new Map;
                    return n.set(t, Dn.createSynthesizedTargetChangeForCurrentChange(t, e)), new Sn(rt.min(), n, Vn(), Tn(), Pn());
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
                    this.tt = t, this.et = new Map, this.nt = Tn(), this.st = On(), this.it = new gn(et);
                }
                rt(t) {
                    for (const e of t.k)t.$ && t.$.isFoundDocument() ? this.ot(e, t.$) : this.ct(e, t.key, t.$);
                    for (const e28 of t.removedTargetIds)this.ct(e28, t.key, t.$);
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
                        if (Ht(t)) if (0 === n) {
                            const n = new Pt(t.path);
                            this.ct(e, n, Kt.newNoDocument(n, rt.min()));
                        } else B(1 === n);
                        else this.wt(e) !== n && (this.lt(e), this.it = this.it.add(e));
                    }
                }
                _t(t47) {
                    const e29 = new Map;
                    this.et.forEach((n, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n.current && Ht(i.target)) {
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t47));
                            }
                            n.K && (e29.set(s, n.W()), n.G());
                        }
                    });
                    let n11 = Pn();
                    this.st.forEach((t48, e30)=>{
                        let s = !0;
                        e30.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return !e || 2 === e.purpose || (s = !1, !1);
                        }), s && (n11 = n11.add(t48));
                    });
                    const s3 = new Sn(t47, e29, this.it, this.nt, n11);
                    return this.nt = Tn(), this.st = On(), this.it = new gn(et), s3;
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
                    return e || (e = new kn, this.et.set(t, e)), e;
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
                    this.et.set(t, new kn), this.tt.getRemoteKeysForTarget(t).forEach((e)=>{
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
                return t.D ? `${new Date(1000 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z` : {
                    seconds: "" + e.seconds,
                    nanos: e.nanoseconds
                };
            }
            function qn(t, e) {
                return t.D ? e.toBase64() : e.toUint8Array();
            }
            function jn(t49) {
                return B(!!t49), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t49));
            }
            function Qn(t, e) {
                var t50;
                return (t50 = t, new ht([
                    "projects",
                    t50.projectId,
                    "databases",
                    t50.database
                ])).child("documents").child(e).canonicalString();
            }
            function Wn(t) {
                const e = ht.fromString(t);
                return B(Ts(e)), e;
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
                    t.databaseId.database
                ]).canonicalString();
            }
            function Xn(t) {
                return B(t.length > 4 && "documents" === t.get(4)), t.popFirst(5);
            }
            function Zn(t, e, n) {
                return {
                    name: Gn(t, e),
                    fields: n.value.mapValue.fields
                };
            }
            function ss(t52, e32) {
                var t51, e31;
                let n12;
                if (e32 instanceof en) n12 = {
                    update: Zn(t52, e32.key, e32.value)
                };
                else if (e32 instanceof cn) n12 = {
                    delete: Gn(t52, e32.key)
                };
                else if (e32 instanceof nn) n12 = {
                    update: Zn(t52, e32.key, e32.data),
                    updateMask: ps(e32.fieldMask)
                };
                else {
                    if (!(e32 instanceof an)) return L();
                    n12 = {
                        verify: Gn(t52, e32.key)
                    };
                }
                return e32.fieldTransforms.length > 0 && (n12.updateTransforms = e32.fieldTransforms.map((t)=>(function(t, e) {
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
                    })(0, t)
                )), e32.precondition.isNone || (n12.currentDocument = (t51 = t52, void 0 !== (e31 = e32.precondition).updateTime ? {
                    updateTime: Un(t51, e31.updateTime.toTimestamp())
                } : void 0 !== e31.exists ? {
                    exists: e31.exists
                } : L())), n12;
            }
            function is(t54, e33) {
                var t53;
                const n13 = e33.currentDocument ? void 0 !== (t53 = e33.currentDocument).updateTime ? Ge.updateTime(jn(t53.updateTime)) : void 0 !== t53.exists ? Ge.exists(t53.exists) : Ge.none() : Ge.none(), s4 = e33.updateTransforms ? e33.updateTransforms.map((e34)=>(function(t, e) {
                        let n = null;
                        if ("setToServerValue" in e) B("REQUEST_TIME" === e.setToServerValue), n = new Oe;
                        else if ("appendMissingElements" in e) {
                            const t = e.appendMissingElements.values || [];
                            n = new Fe(t);
                        } else if ("removeAllFromArray" in e) {
                            const t = e.removeAllFromArray.values || [];
                            n = new Le(t);
                        } else "increment" in e ? n = new Ue(t, e.increment) : L();
                        const s = ft.fromServerFormat(e.fieldPath);
                        return new je(s, n);
                    })(t54, e34)
                ) : [];
                if (e33.update) {
                    e33.update.name;
                    const i = zn(t54, e33.update.name), r = new Ut({
                        mapValue: {
                            fields: e33.update.fields
                        }
                    });
                    if (e33.updateMask) {
                        const t55 = function(t58) {
                            const e = t58.fieldPaths || [];
                            return new dt(e.map((t)=>ft.fromServerFormat(t)
                            ));
                        }(e33.updateMask);
                        return new nn(i, r, t55, n13, s4);
                    }
                    return new en(i, r, n13, s4);
                }
                if (e33.delete) {
                    const s = zn(t54, e33.delete);
                    return new cn(s, n13);
                }
                if (e33.verify) {
                    const s = zn(t54, e33.verify);
                    return new an(s, n13);
                }
                return L();
            }
            function hs(t59) {
                return t59 ? void 0 !== t59.unaryFilter ? [
                    ys(t59)
                ] : void 0 !== t59.fieldFilter ? [
                    gs(t59)
                ] : void 0 !== t59.compositeFilter ? t59.compositeFilter.filters.map((t)=>hs(t)
                ).reduce((t, e)=>t.concat(e)
                ) : L() : [];
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
            function gs(t60) {
                return Jt.create(ms(t60.fieldFilter.field), function(t) {
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
                }(t60.fieldFilter.op), t60.fieldFilter.value);
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
            function ps(t61) {
                const e = [];
                return t61.fields.forEach((t)=>e.push(t.canonicalString())
                ), {
                    fieldPaths: e
                };
            }
            function Ts(t) {
                return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
            }
            function Es(t) {
                let e = "";
                for(let n = 0; n < t.length; n++)e.length > 0 && (e = As(e)), e = Is(t.get(n), e);
                return As(e);
            }
            function Is(t, e) {
                let n = e;
                const s = t.length;
                for(let e35 = 0; e35 < s; e35++){
                    const s = t.charAt(e35);
                    switch(s){
                        case "\x00":
                            n += "\x01\x10";
                            break;
                        case "\x01":
                            n += "\x01\x11";
                            break;
                        default:
                            n += s;
                    }
                }
                return n;
            }
            function As(t) {
                return t + "\x01\x01";
            }
            function Rs(t) {
                const e = t.length;
                if (B(e >= 2), 2 === e) return B("\x01" === t.charAt(0) && "\x01" === t.charAt(1)), ht.emptyPath();
                const n = e - 2, s = [];
                let i = "";
                for(let r = 0; r < e;){
                    const e = t.indexOf("\x01", r);
                    switch((e < 0 || e > n) && L(), t.charAt(e + 1)){
                        case "\x01":
                            const n14 = t.substring(r, e);
                            let o;
                            0 === i.length ? o = n14 : (i += n14, o = i, i = ""), s.push(o);
                            break;
                        case "\x10":
                            i += t.substring(r, e), i += "\x00";
                            break;
                        case "\x11":
                            i += t.substring(r, e + 1);
                            break;
                        default:
                            L();
                    }
                    r = e + 2;
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
            Ss.store = "documentMutations", Ss.PLACEHOLDER = new Ss;
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
                    this.onCommittedListeners.forEach((t)=>t()
                    );
                }
            }
            class js {
                constructor(t62){
                    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, t62((t)=>{
                        this.isDone = !0, this.result = t, this.nextCallback && this.nextCallback(t);
                    }, (t)=>{
                        this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t) {
                    return this.next(void 0, t);
                }
                next(t63, e36) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e36, this.error) : this.wrapSuccess(t63, this.result) : new js((n, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t63, e).next(n, s);
                        }, this.catchCallback = (t)=>{
                            this.wrapFailure(e36, t).next(n, s);
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
                    } catch (t64) {
                        return js.reject(t64);
                    }
                }
                wrapSuccess(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)
                    ) : js.resolve(e);
                }
                wrapFailure(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)
                    ) : js.reject(e);
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
                static waitFor(t65) {
                    return new js((e, n)=>{
                        let s = 0, i = 0, r = !1;
                        t65.forEach((t66)=>{
                            ++s, t66.next(()=>{
                                ++i, r && i === s && e();
                            }, (t)=>n(t)
                            );
                        }), r = !0, i === s && e();
                    });
                }
                static or(t67) {
                    let e = js.resolve(!1);
                    for (const n of t67)e = e.next((t)=>t ? js.resolve(t) : n()
                    );
                    return e;
                }
                static forEach(t68, e) {
                    const n = [];
                    return t68.forEach((t, s)=>{
                        n.push(e.call(this, t, s));
                    }), this.waitFor(n);
                }
            }
            class Qs {
                constructor(t, e37){
                    this.action = t, this.transaction = e37, this.aborted = !1, this.Et = new Q, this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }, this.transaction.onabort = ()=>{
                        e37.error ? this.Et.reject(new zs(t, e37.error)) : this.Et.resolve();
                    }, this.transaction.onerror = (e)=>{
                        const n = Zs(e.target.error);
                        this.Et.reject(new zs(t, n));
                    };
                }
                static open(t, e, n, s) {
                    try {
                        return new Qs(e, t.transaction(s, n));
                    } catch (t69) {
                        throw new zs(e, t69);
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
                async Dt(t70) {
                    return this.db || ($("SimpleDb", "Opening database:", this.name), this.db = await new Promise((e38, n15)=>{
                        const s5 = indexedDB.open(this.name, this.version);
                        s5.onsuccess = (t)=>{
                            const n = t.target.result;
                            e38(n);
                        }, s5.onblocked = ()=>{
                            n15(new zs(t70, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }, s5.onerror = (e)=>{
                            const s = e.target.error;
                            "VersionError" === s.name ? n15(new j(K.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n15(new j(K.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n15(new zs(t70, s));
                        }, s5.onupgradeneeded = (t)=>{
                            $("SimpleDb", "Database \"" + this.name + "\" requires upgrade from version:", t.oldVersion);
                            const e = t.target.result;
                            this.At.Ct(e, s5.transaction, t.oldVersion, this.version).next(()=>{
                                $("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        };
                    })), this.Nt && (this.db.onversionchange = (t)=>this.Nt(t)
                    ), this.db;
                }
                xt(t) {
                    this.Nt = t, this.db && (this.db.onversionchange = (e)=>t(e)
                    );
                }
                async runTransaction(t71, e, n, s) {
                    const i = "readonly" === e;
                    let r = 0;
                    for(;;){
                        ++r;
                        try {
                            this.db = await this.Dt(t71);
                            const e = Qs.open(this.db, t71, i ? "readonly" : "readwrite", n), r = s(e).catch((t)=>(e.abort(t), js.reject(t))
                            ).toPromise();
                            return r.catch(()=>{}), await e.It, r;
                        } catch (t) {
                            const e = "FirebaseError" !== t.name && r < 3;
                            if ($("SimpleDb", "Transaction failed with error:", t.message, "Retrying:", e), this.close(), !e) return Promise.reject(t);
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
                    return Ys(this.store.get(t)).next((e)=>(void 0 === e && (e = null), $("SimpleDb", "GET", this.store.name, t, e), e)
                    );
                }
                delete(t) {
                    return $("SimpleDb", "DELETE", this.store.name, t), Ys(this.store.delete(t));
                }
                count() {
                    return $("SimpleDb", "COUNT", this.store.name), Ys(this.store.count());
                }
                Lt(t, e39) {
                    const n = this.cursor(this.options(t, e39)), s = [];
                    return this.Bt(n, (t, e)=>{
                        s.push(e);
                    }).next(()=>s
                    );
                }
                Ut(t, e) {
                    $("SimpleDb", "DELETE ALL", this.store.name);
                    const n16 = this.options(t, e);
                    n16.qt = !1;
                    const s = this.cursor(n16);
                    return this.Bt(s, (t, e, n)=>n.delete()
                    );
                }
                Kt(t, e) {
                    let n;
                    e ? n = t : (n = {}, e = t);
                    const s = this.cursor(n);
                    return this.Bt(s, e);
                }
                jt(t72) {
                    const e40 = this.cursor({});
                    return new js((n, s6)=>{
                        e40.onerror = (t)=>{
                            const e = Zs(t.target.error);
                            s6(e);
                        }, e40.onsuccess = (e)=>{
                            const s = e.target.result;
                            s ? t72(s.primaryKey, s.value).next((t)=>{
                                t ? s.continue() : n();
                            }) : n();
                        };
                    });
                }
                Bt(t73, e) {
                    const n = [];
                    return new js((s, i2)=>{
                        t73.onerror = (t)=>{
                            i2(t.target.error);
                        }, t73.onsuccess = (t)=>{
                            const i = t.target.result;
                            if (!i) return void s();
                            const r = new Gs(i), o = e(i.primaryKey, i.value, r);
                            if (o instanceof js) {
                                const t74 = o.catch((t)=>(r.done(), js.reject(t))
                                );
                                n.push(t74);
                            }
                            r.isDone ? s() : null === r.Ft ? i.continue() : i.continue(r.Ft);
                        };
                    }).next(()=>js.waitFor(n)
                    );
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
            function Ys(t75) {
                return new js((e41, n17)=>{
                    t75.onsuccess = (t)=>{
                        const n = t.target.result;
                        e41(n);
                    }, t75.onerror = (t)=>{
                        const e = Zs(t.target.error);
                        n17(e);
                    };
                });
            }
            let Xs = null;
            function Zs(t) {
                const e = Ws.Rt(getUA());
                if (e >= 12.2 && e < 13) {
                    const e = "An internal error was encountered in the Indexed Database server";
                    if (t.message.indexOf(e) >= 0) {
                        const t = new j("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return Xs || (Xs = !0, setTimeout(()=>{
                            throw t;
                        }, 0)), t;
                    }
                }
                return t;
            }
            function ei(t, e) {
                const n = q(t);
                return Ws.St(n.Qt, e);
            }
            class ni {
                constructor(t, e, n, s){
                    this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
                }
                applyToRemoteDocument(t, e) {
                    const n = e.mutationResults;
                    for(let e42 = 0; e42 < this.mutations.length; e42++){
                        const s = this.mutations[e42];
                        s.key.isEqual(t.key) && Je(s, t, n[e42]);
                    }
                }
                applyToLocalView(t) {
                    for (const e of this.baseMutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                    for (const e43 of this.mutations)e43.key.isEqual(t.key) && Ye(e43, t, this.localWriteTime);
                }
                applyToLocalDocumentSet(t) {
                    this.mutations.forEach((e)=>{
                        const n = t.get(e.key), s = n;
                        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key)
                    , Pn());
                }
                isEqual(t76) {
                    return this.batchId === t76.batchId && nt(this.mutations, t76.mutations, (t, e)=>Ze(t, e)
                    ) && nt(this.baseMutations, t76.baseMutations, (t, e)=>Ze(t, e)
                    );
                }
            }
            class si {
                constructor(t, e, n, s){
                    this.batch = t, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
                }
                static from(t, e, n) {
                    B(t.mutations.length === n.length);
                    let s = Rn();
                    const i = t.mutations;
                    for(let t77 = 0; t77 < i.length; t77++)s = s.insert(i[t77].key, n[t77].version);
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
            function fi(t, e44) {
                const n = (e44.baseMutations || []).map((e)=>is(t.Wt, e)
                );
                for(let t78 = 0; t78 < e44.mutations.length - 1; ++t78){
                    const n = e44.mutations[t78];
                    if (t78 + 1 < e44.mutations.length && void 0 !== e44.mutations[t78 + 1].transform) {
                        const s = e44.mutations[t78 + 1];
                        n.updateTransforms = s.transform.fieldTransforms, e44.mutations.splice(t78 + 1, 1), ++t78;
                    }
                }
                const s = e44.mutations.map((e)=>is(t.Wt, e)
                ), i = it.fromMillis(e44.localWriteTimeMs);
                return new ni(e44.batchId, i, n, s);
            }
            class Ri {
                constructor(t, e, n){
                    this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
                }
                static withCacheSize(t) {
                    return new Ri(t, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            class vi {
                constructor(t, e, n, s){
                    this.userId = t, this.N = e, this.Ht = n, this.referenceDelegate = s, this.Jt = {};
                }
                static Yt(t, e, n, s) {
                    B("" !== t.uid);
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
                    }).next(()=>e
                    );
                }
                addMutationBatch(t79, e45, n18, s7) {
                    const i3 = Di(t79), r = Si(t79);
                    return r.add({}).next((o)=>{
                        B("number" == typeof o);
                        const c = new ni(o, e45, n18, s7), a = function(t, e46, n) {
                            const s = n.baseMutations.map((e)=>ss(t.Wt, e)
                            ), i = n.mutations.map((e)=>ss(t.Wt, e)
                            );
                            return new Vs(e46, n.batchId, n.localWriteTime.toMillis(), s, i);
                        }(this.N, this.userId, c), u = [];
                        let h = new gn((t, e)=>et(t.canonicalString(), e.canonicalString())
                        );
                        for (const t80 of s7){
                            const e = Ss.key(this.userId, t80.key.path, o);
                            h = h.add(t80.key.path.popLast()), u.push(r.put(a)), u.push(i3.put(e, Ss.PLACEHOLDER));
                        }
                        return h.forEach((e)=>{
                            u.push(this.Ht.addToCollectionParentIndex(t79, e));
                        }), t79.addOnCommittedListener(()=>{
                            this.Jt[o] = c.keys();
                        }), js.waitFor(u).next(()=>c
                        );
                    });
                }
                lookupMutationBatch(t81, e) {
                    return Si(t81).get(e).next((t)=>t ? (B(t.userId === this.userId), fi(this.N, t)) : null
                    );
                }
                Xt(t82, e) {
                    return this.Jt[e] ? js.resolve(this.Jt[e]) : this.lookupMutationBatch(t82, e).next((t)=>{
                        if (t) {
                            const n = t.keys();
                            return this.Jt[e] = n, n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(t, e47) {
                    const n = e47 + 1, s8 = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let i = null;
                    return Si(t).Kt({
                        index: Vs.userMutationsIndex,
                        range: s8
                    }, (t, e, s)=>{
                        e.userId === this.userId && (B(e.batchId >= n), i = fi(this.N, e)), s.done();
                    }).next(()=>i
                    );
                }
                getHighestUnacknowledgedBatchId(t) {
                    const e48 = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    let n = -1;
                    return Si(t).Kt({
                        index: Vs.userMutationsIndex,
                        range: e48,
                        reverse: !0
                    }, (t, e, s)=>{
                        n = e.batchId, s.done();
                    }).next(()=>n
                    );
                }
                getAllMutationBatches(t83) {
                    const e = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return Si(t83).Lt(Vs.userMutationsIndex, e).next((t84)=>t84.map((t)=>fi(this.N, t)
                        )
                    );
                }
                getAllMutationBatchesAffectingDocumentKey(t85, e) {
                    const n19 = Ss.prefixForPath(this.userId, e.path), s = IDBKeyRange.lowerBound(n19), i = [];
                    return Di(t85).Kt({
                        range: s
                    }, (n, s, r)=>{
                        const [o, c, a] = n, u = Rs(c);
                        if (o === this.userId && e.path.isEqual(u)) return Si(t85).get(a).next((t)=>{
                            if (!t) throw L();
                            B(t.userId === this.userId), i.push(fi(this.N, t));
                        });
                        r.done();
                    }).next(()=>i
                    );
                }
                getAllMutationBatchesAffectingDocumentKeys(t86, e49) {
                    let n = new gn(et);
                    const s = [];
                    return e49.forEach((e)=>{
                        const i4 = Ss.prefixForPath(this.userId, e.path), r1 = IDBKeyRange.lowerBound(i4), o1 = Di(t86).Kt({
                            range: r1
                        }, (t, s, i)=>{
                            const [r, o, c] = t, a = Rs(o);
                            r === this.userId && e.path.isEqual(a) ? n = n.add(c) : i.done();
                        });
                        s.push(o1);
                    }), js.waitFor(s).next(()=>this.Zt(t86, n)
                    );
                }
                getAllMutationBatchesAffectingQuery(t87, e) {
                    const n = e.path, s = n.length + 1, i5 = Ss.prefixForPath(this.userId, n), r2 = IDBKeyRange.lowerBound(i5);
                    let o = new gn(et);
                    return Di(t87).Kt({
                        range: r2
                    }, (t, e, i)=>{
                        const [r, c, a] = t, u = Rs(c);
                        r === this.userId && n.isPrefixOf(u) ? u.length === s && (o = o.add(a)) : i.done();
                    }).next(()=>this.Zt(t87, o)
                    );
                }
                Zt(t88, e50) {
                    const n = [], s = [];
                    return e50.forEach((e)=>{
                        s.push(Si(t88).get(e).next((t)=>{
                            if (null === t) throw L();
                            B(t.userId === this.userId), n.push(fi(this.N, t));
                        }));
                    }), js.waitFor(s).next(()=>n
                    );
                }
                removeMutationBatch(t90, e51) {
                    return (function(t, e, n20) {
                        const s = t.store(Vs.store), i = t.store(Ss.store), r = [], o = IDBKeyRange.only(n20.batchId);
                        let c = 0;
                        const a = s.Kt({
                            range: o
                        }, (t, e, n)=>(c++, n.delete())
                        );
                        r.push(a.next(()=>{
                            B(1 === c);
                        }));
                        const u = [];
                        for (const t89 of n20.mutations){
                            const s = Ss.key(e, t89.key.path, n20.batchId);
                            r.push(i.delete(s)), u.push(t89.key);
                        }
                        return js.waitFor(r).next(()=>u
                        );
                    })(t90.Qt, this.userId, e51).next((n)=>(t90.addOnCommittedListener(()=>{
                            this.te(e51.batchId);
                        }), js.forEach(n, (e)=>this.referenceDelegate.markPotentiallyOrphaned(t90, e)
                        ))
                    );
                }
                te(t) {
                    delete this.Jt[t];
                }
                performConsistencyCheck(t91) {
                    return this.checkEmpty(t91).next((e52)=>{
                        if (!e52) return js.resolve();
                        const n21 = IDBKeyRange.lowerBound(Ss.prefixForUser(this.userId)), s = [];
                        return Di(t91).Kt({
                            range: n21
                        }, (t, e, n)=>{
                            if (t[0] === this.userId) {
                                const e = Rs(t[1]);
                                s.push(e);
                            } else n.done();
                        }).next(()=>{
                            B(0 === s.length);
                        });
                    });
                }
                containsKey(t, e) {
                    return Vi(t, this.userId, e);
                }
                ee(t92) {
                    return Ci(t92).get(this.userId).next((t)=>t || new vs(this.userId, -1, "")
                    );
                }
            }
            function Vi(t93, e, n) {
                const s9 = Ss.prefixForPath(e, n.path), i = s9[1], r3 = IDBKeyRange.lowerBound(s9);
                let o = !1;
                return Di(t93).Kt({
                    range: r3,
                    qt: !0
                }, (t, n, s)=>{
                    const [r, c, a] = t;
                    r === e && c === i && (o = !0), s.done();
                }).next(()=>o
                );
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
                        for (const [e53, s] of n)if (this.equalsFn(e53, t)) return s;
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
                        for (const [e54, s] of n)t(e54, s);
                    });
                }
                isEmpty() {
                    return at(this.inner);
                }
            }
            class Qi {
                constructor(){
                    this.changes = new ji((t)=>t.toString()
                    , (t, e)=>t.isEqual(e)
                    ), this.changesApplied = !1;
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
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t, e).next((n)=>this.Rn(t, e, n)
                    );
                }
                Rn(t94, e55, n) {
                    return this.He.getEntry(t94, e55).next((t)=>{
                        for (const e of n)e.applyToLocalView(t);
                        return t;
                    });
                }
                bn(t, e) {
                    t.forEach((t, n)=>{
                        for (const t95 of e)t95.applyToLocalView(n);
                    });
                }
                Pn(t, e56) {
                    return this.He.getEntries(t, e56).next((e)=>this.vn(t, e).next(()=>e
                        )
                    );
                }
                vn(t96, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t96, e).next((t)=>this.bn(e, t)
                    );
                }
                getDocumentsMatchingQuery(t, e, n) {
                    var t97;
                    return (t97 = e, Pt.isDocumentKey(t97.path) && null === t97.collectionGroup && 0 === t97.filters.length) ? this.Vn(t, e.path) : null !== e.collectionGroup ? this.Sn(t, e, n) : this.Dn(t, e, n);
                }
                Vn(t98, e57) {
                    return this.An(t98, new Pt(e57)).next((t)=>{
                        let e = In();
                        return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
                    });
                }
                Sn(t99, e59, n) {
                    const s = e59.collectionGroup;
                    let i = In();
                    return this.Ht.getCollectionParents(t99, s).next((r4)=>js.forEach(r4, (r)=>{
                            var t100, e58;
                            const o = (t100 = e59, e58 = r.child(s), new fe(e58, null, t100.explicitOrderBy.slice(), t100.filters.slice(), t100.limit, t100.limitType, t100.startAt, t100.endAt));
                            return this.Dn(t99, o, n).next((t101)=>{
                                t101.forEach((t, e)=>{
                                    i = i.insert(t, e);
                                });
                            });
                        }).next(()=>i
                        )
                    );
                }
                Dn(t103, e60, n22) {
                    let s, i6;
                    return this.He.getDocumentsMatchingQuery(t103, e60, n22).next((n)=>(s = n, this.In.getAllMutationBatchesAffectingQuery(t103, e60))
                    ).next((e61)=>(i6 = e61, this.Cn(t103, i6, s).next((t)=>{
                            for (const t102 of (s = t, i6))for (const e of t102.mutations){
                                const n = e.key;
                                let i = s.get(n);
                                null == i && (i = Kt.newInvalidDocument(n), s = s.insert(n, i)), Ye(e, i, t102.localWriteTime), i.isFoundDocument() || (s = s.remove(n));
                            }
                        }))
                    ).next(()=>(s.forEach((t, n)=>{
                            Pe(e60, n) || (s = s.remove(t));
                        }), s)
                    );
                }
                Cn(t105, e63, n) {
                    let s = Pn();
                    for (const t104 of e63)for (const e62 of t104.mutations)e62 instanceof nn && null === n.get(e62.key) && (s = s.add(e62.key));
                    let i = n;
                    return this.He.getEntries(t105, s).next((t106)=>(t106.forEach((t, e)=>{
                            e.isFoundDocument() && (i = i.insert(t, e));
                        }), i)
                    );
                }
            }
            class or {
                constructor(t, e, n, s){
                    this.targetId = t, this.fromCache = e, this.Nn = n, this.xn = s;
                }
                static kn(t, e) {
                    let n = Pn(), s = Pn();
                    for (const t107 of e.docChanges)switch(t107.type){
                        case 0:
                            n = n.add(t107.doc.key);
                            break;
                        case 1:
                            s = s.add(t107.doc.key);
                    }
                    return new or(t, e.fromCache, n, s);
                }
            }
            class cr {
                $n(t) {
                    this.On = t;
                }
                getDocumentsMatchingQuery(t109, e64, n, s) {
                    var t108;
                    return 0 === (t108 = e64).filters.length && null === t108.limit && null == t108.startAt && null == t108.endAt && (0 === t108.explicitOrderBy.length || 1 === t108.explicitOrderBy.length && t108.explicitOrderBy[0].field.isKeyField()) || n.isEqual(rt.min()) ? this.Fn(t109, e64) : this.On.Pn(t109, s).next((i)=>{
                        const r = this.Mn(e64, i);
                        return (_e(e64) || me(e64)) && this.Ln(e64.limitType, r, s, n) ? this.Fn(t109, e64) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), be(e64)), this.On.getDocumentsMatchingQuery(t109, e64, n).next((t)=>(r.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)
                        ));
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
                constructor(t110, e, n, s){
                    this.persistence = t110, this.Bn = e, this.N = s, this.Un = new wn(et), this.qn = new ji((t)=>Wt(t)
                    , zt), this.Kn = rt.min(), this.In = t110.getMutationQueue(n), this.jn = t110.getRemoteDocumentCache(), this.ze = t110.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t110.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t.collect(e, this.Un)
                    );
                }
            }
            async function hr(t111, e67) {
                const n23 = q(t111);
                let s10 = n23.In, i = n23.Qn;
                const r5 = await n23.persistence.runTransaction("Handle user change", "readonly", (t113)=>{
                    let r;
                    return n23.In.getAllMutationBatches(t113).next((o)=>(r = o, s10 = n23.persistence.getMutationQueue(e67), i = new rr(n23.jn, s10, n23.persistence.getIndexManager()), s10.getAllMutationBatches(t113))
                    ).next((e)=>{
                        const n = [], s = [];
                        let o = Pn();
                        for (const t114 of r)for (const e65 of (n.push(t114.batchId), t114.mutations))o = o.add(e65.key);
                        for (const t112 of e)for (const e66 of (s.push(t112.batchId), t112.mutations))o = o.add(e66.key);
                        return i.Pn(t113, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            })
                        );
                    });
                });
                return n23.In = s10, n23.Qn = i, n23.Bn.$n(n23.Qn), r5;
            }
            function fr(t115) {
                const e = q(t115);
                return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t)=>e.ze.getLastRemoteSnapshotVersion(t)
                );
            }
            function _r(t116, e) {
                const n = q(t116);
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (t)=>(void 0 === e && (e = -1), n.In.getNextMutationBatchAfterBatchId(t, e))
                );
            }
            async function gr(t117, e, n) {
                const s = q(t117), i = s.Un.get(e);
                try {
                    n || await s.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t)=>s.persistence.referenceDelegate.removeTarget(t, i)
                    );
                } catch (t) {
                    if (!Hs(t)) throw t;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
                }
                s.Un = s.Un.remove(e), s.qn.delete(i.target);
            }
            function yr(t118, e68, n24) {
                const s11 = q(t118);
                let i7 = rt.min(), r = Pn();
                return s11.persistence.runTransaction("Execute query", "readonly", (t119)=>(function(t, e, n) {
                        const s = q(t), i = s.qn.get(n);
                        return void 0 !== i ? js.resolve(s.Un.get(i)) : s.ze.getTargetData(e, n);
                    })(s11, t119, Ee(e68)).next((e)=>{
                        if (e) return i7 = e.lastLimboFreeSnapshotVersion, s11.ze.getMatchingKeysForTargetId(t119, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>s11.Bn.getDocumentsMatchingQuery(t119, e68, n24 ? i7 : rt.min(), n24 ? r : Pn())
                    ).next((t)=>({
                            documents: t,
                            Gn: r
                        })
                    )
                );
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
                ss(t120, e) {
                    t120.forEach((t)=>this.addReference(t, e)
                    );
                }
                removeReference(t, e) {
                    this.rs(new Pr(t, e));
                }
                os(t121, e) {
                    t121.forEach((t)=>this.removeReference(t, e)
                    );
                }
                cs(t122) {
                    const e = new Pt(new ht([])), n = new Pr(e, t122), s = new Pr(e, t122 + 1), i = [];
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        this.rs(t), i.push(t.key);
                    }), i;
                }
                us() {
                    this.Zn.forEach((t)=>this.rs(t)
                    );
                }
                rs(t) {
                    this.Zn = this.Zn.delete(t), this.es = this.es.delete(t);
                }
                hs(t123) {
                    const e = new Pt(new ht([])), n = new Pr(e, t123), s = new Pr(e, t123 + 1);
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
                    for (const e69 of (this.In.push(r), s))this.ds = this.ds.add(new Pr(e69.key, i)), this.Ht.addToCollectionParentIndex(t, e69.key.path.popLast());
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
                getAllMutationBatchesAffectingDocumentKey(t124, e70) {
                    const n = new Pr(e70, 0), s = new Pr(e70, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t125, e71) {
                    let n = new gn(et);
                    return e71.forEach((t126)=>{
                        const e = new Pr(t126, 0), s = new Pr(t126, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), js.resolve(this.gs(n));
                }
                getAllMutationBatchesAffectingQuery(t127, e72) {
                    const n = e72.path, s = n.length + 1;
                    let i = n;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    let o = new gn(et);
                    return this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return !!n.isPrefixOf(e) && (e.length === s && (o = o.add(t.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t128) {
                    const e = [];
                    return t128.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e;
                }
                removeMutationBatch(t, e) {
                    B(0 === this.ys(e.batchId, "removed")), this.In.shift();
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
                getEntries(t129, e73) {
                    let n = Tn();
                    return e73.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : Kt.newInvalidDocument(t));
                    }), js.resolve(n);
                }
                getDocumentsMatchingQuery(t, e, n) {
                    let s = Tn();
                    const i = new Pt(e.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t , value: { document: i , readTime: o  }  } = r.getNext();
                        if (!e.path.isPrefixOf(t.path)) break;
                        0 >= o.compareTo(n) || Pe(e, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t130, e) {
                    return js.forEach(this.docs, (t)=>e(t)
                    );
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
                constructor(t131, e74){
                    this.bs = {}, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t131(this), this.ze = new class {
                        constructor(t132){
                            this.persistence = t132, this.Es = new ji((t)=>Wt(t)
                            , zt), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Is = 0, this.As = new br, this.targetCount = 0, this.Rs = Ni.se();
                        }
                        forEachTarget(t, e) {
                            return this.Es.forEach((t, n)=>e(n)
                            ), js.resolve();
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
                            }), js.waitFor(i).next(()=>s
                            );
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
                        removeMatchingKeys(t, e75, n) {
                            this.As.os(e75, n);
                            const s = this.persistence.referenceDelegate, i = [];
                            return s && e75.forEach((e)=>{
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
                            };
                        }
                        addToCollectionParentIndex(t, e) {
                            return this.Gt.add(e), js.resolve();
                        }
                        getCollectionParents(t, e) {
                            return js.resolve(this.Gt.getEntries(e));
                        }
                    }, this.He = function(t, e) {
                        return new Vr(t, e);
                    }(this.Ht, (t)=>this.referenceDelegate.Ps(t)
                    ), this.N = new class {
                        constructor(t){
                            this.Wt = t;
                        }
                    }(e74), this.Je = new class {
                        constructor(t){
                            this.N = t, this.Yn = new Map, this.Xn = new Map;
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
                        saveNamedQuery(t137, e79) {
                            var t133;
                            return this.Xn.set(e79.name, {
                                name: (t133 = e79).name,
                                query: function(t138) {
                                    var t134, e80;
                                    const e76 = function(t139) {
                                        var t135, t136, e81, n, s, i, o, c;
                                        let e77 = function(t) {
                                            const e = Wn(t);
                                            return 4 === e.length ? ht.emptyPath() : Xn(e);
                                        }(t139.parent);
                                        const n25 = t139.structuredQuery, s12 = n25.from ? n25.from.length : 0;
                                        let i8 = null;
                                        if (s12 > 0) {
                                            B(1 === s12);
                                            const t = n25.from[0];
                                            t.allDescendants ? i8 = t.collectionId : e77 = e77.child(t.collectionId);
                                        }
                                        let r = [];
                                        n25.where && (r = hs(n25.where));
                                        let o2 = [];
                                        n25.orderBy && (o2 = n25.orderBy.map((t141)=>{
                                            var t140;
                                            return t140 = t141, new ae(ms(t140.field), function(t) {
                                                switch(t){
                                                    case "ASCENDING":
                                                        return "asc";
                                                    case "DESCENDING":
                                                        return "desc";
                                                    default:
                                                        return;
                                                }
                                            }(t140.direction));
                                        }));
                                        let c1 = null, e78;
                                        n25.limit && (c1 = At(e78 = "object" == typeof (t135 = n25.limit) ? t135.value : t135) ? null : e78);
                                        let a = null;
                                        n25.startAt && (a = fs(n25.startAt));
                                        let u = null;
                                        return n25.endAt && (u = fs(n25.endAt)), t136 = e77, e81 = i8, n = o2, s = r, i = c1, o = a, c = u, new fe(t136, e81, n, s, i, "F", o, c);
                                    }({
                                        parent: t138.parent,
                                        structuredQuery: t138.structuredQuery
                                    });
                                    return "LAST" === t138.limitType ? (t134 = e76, e80 = e76.limit, new fe(t134.path, t134.collectionGroup, t134.explicitOrderBy.slice(), t134.filters.slice(), e80, "L", t134.startAt, t134.endAt)) : e76;
                                }(t133.bundledQuery),
                                readTime: jn(t133.readTime)
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
                runTransaction(t142, e, n) {
                    $("MemoryPersistence", "Starting transaction:", t142);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t
                        )
                    ).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t)
                    );
                }
                Ss(t, e) {
                    return js.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t, e)
                    ));
                }
            }
            class Nr extends Ks {
                constructor(t){
                    super(), this.currentSequenceNumber = t;
                }
            }
            class xr {
                constructor(t){
                    this.persistence = t, this.Ds = new br, this.Cs = null;
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
                removeTarget(t143, e) {
                    this.Ds.cs(e.targetId).forEach((t)=>this.xs.add(t.toString())
                    );
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(t143, e.targetId).next((t144)=>{
                        t144.forEach((t)=>this.xs.add(t.toString())
                        );
                    }).next(()=>n.removeTargetData(t143, e)
                    );
                }
                vs() {
                    this.Cs = new Set;
                }
                Vs(t145) {
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return js.forEach(this.xs, (n)=>{
                        const s = Pt.fromPath(n);
                        return this.ks(t145, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t145))
                    );
                }
                updateLimboDocument(t146, e) {
                    return this.ks(t146, e).next((t)=>{
                        t ? this.xs.delete(e.toString()) : this.xs.add(e.toString());
                    });
                }
                Ps(t) {
                    return 0;
                }
                ks(t, e) {
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e))
                        ,
                        ()=>this.persistence.getTargetCache().containsKey(t, e)
                        ,
                        ()=>this.persistence.Ss(t, e)
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
                        "rejected"
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
                        "rejected"
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
                    let s = "object" == typeof n && n.activeTargetIds instanceof Array, i = Vn();
                    for(let t147 = 0; s && t147 < n.activeTargetIds.length; ++t147)s = bt(n.activeTargetIds[t147]), i = i.add(n.activeTargetIds[t147]);
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
                    this.activeTargetIds = Vn();
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
                    this.yi = new Ur, this.pi = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
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
                    return this.yi = new Ur, Promise.resolve();
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
                    this.Ei = ()=>this.Ii()
                    , this.Ai = ()=>this.Ri()
                    , this.bi = [], this.Pi();
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
                Li(t157, e91, n, s) {
                    const i = this.Bi(t157, e91);
                    $("RestConnection", "Sending: ", i, n);
                    const r = {};
                    return this.Ui(r, s), this.qi(t157, i, r, n).then((t)=>($("RestConnection", "Received: ", t), t)
                    , (e)=>{
                        throw F("RestConnection", `${t157} failed with error: `, e, "url: ", i, "request:", n), e;
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
                qi(t148, e82, n26, s) {
                    return new Promise((i, r)=>{
                        const o = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.JJ;
                        o.listenOnce(_firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.NO_ERROR:
                                        const e85 = o.getResponseJson();
                                        $("Connection", "XHR received:", JSON.stringify(e85)), i(e85);
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.TIMEOUT:
                                        $("Connection", "RPC \"" + t148 + "\" timed out"), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ($("Connection", "RPC \"" + t148 + "\" failed with status:", n, "response text:", o.getResponseText()), n > 0) {
                                            const t149 = o.getResponseJson().error;
                                            if (t149 && t149.status && t149.message) {
                                                const e83 = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t149.status);
                                                r(new j(e83, t149.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", "RPC \"" + t148 + "\" completed.");
                            }
                        });
                        const c = JSON.stringify(s);
                        o.send(e82, "POST", c, n26, 15);
                    });
                }
                ji(t152, e87) {
                    const n27 = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t152,
                        "/channel"
                    ], s13 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.UE)(), i9 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.FJ)(), r = {
                        httpSessionIdParam: "gsessionid",
                        initMessageHeaders: {},
                        messageUrlParams: {
                            database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
                        },
                        sendRawJson: !0,
                        supportsCrossDomainXhr: !0,
                        internalChannelParams: {
                            forwardChannelRequestTimeoutMs: 600000
                        },
                        forceLongPolling: this.forceLongPolling,
                        detectBufferingProxy: this.autoDetectLongPolling
                    };
                    this.useFetchStreams && (r.xmlHttpFactory = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.zI({})), this.Ui(r.initMessageHeaders, e87), (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.uI)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.b$)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.d)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.w1)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.Mn)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.ru)() || (r.httpHeadersOverwriteParam = "$httpHeaders");
                    const o = n27.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s13.createWebChannel(o, r);
                    let a = !1, u = !1;
                    const h = new Gr({
                        vi: (t)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t153, e, n)=>{
                        t153.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t154) {
                                setTimeout(()=>{
                                    throw t154;
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
                        var e90;
                        if (!u) {
                            const n = t.data[0];
                            B(!!n);
                            const s = n, i = s.error || (null === (e90 = s[0]) || void 0 === e90 ? void 0 : e90.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t155 = i.status;
                                let e88 = function(t) {
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t155), n = i.message;
                                void 0 === e88 && (e88 = K.INTERNAL, n = "Unknown error status: " + t155 + " with message " + i.message), u = !0, h.$i(new j(e88, n)), c.close();
                            } else $("Connection", "WebChannel received:", n), h.Oi(n);
                        }
                    }), g(i9, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ju.STAT_EVENT, (t)=>{
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
                constructor(t, e, n = 1000, s = 1.5, i = 60000){
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
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t())
                    ), this.zi *= this.Wi, this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
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
                    this.hr() && null === this.rr && (this.rr = this.Oe.enqueueAfterDelay(this.er, 60000, ()=>this._r()
                    ));
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
                    const t158 = this.Tr(this.ir), e92 = this.ir;
                    this.credentialsProvider.getToken().then((t)=>{
                        this.ir === e92 && this.Er(t);
                    }, (e)=>{
                        t158(()=>{
                            const t = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t159) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t159), this.stream.Si(()=>{
                        e(()=>(this.state = 2, this.cr = this.Oe.enqueueAfterDelay(this.nr, 10000, ()=>(this.hr() && (this.state = 3), Promise.resolve())
                            ), this.listener.Si())
                        );
                    }), this.stream.Ci((t)=>{
                        e(()=>this.Ir(t)
                        );
                    }), this.stream.onMessage((t)=>{
                        e(()=>this.onMessage(t)
                        );
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
                        this.Oe.enqueueAndForget(()=>this.ir === t ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())
                        );
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
                onMessage(t162) {
                    this.ar.reset();
                    const e94 = function(t163, e95) {
                        let n;
                        if ("targetChange" in e95) {
                            var t160, t161, e93;
                            e95.targetChange;
                            const s = "NO_CHANGE" === (t160 = e95.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t160 ? 1 : "REMOVE" === t160 ? 2 : "CURRENT" === t160 ? 3 : "RESET" === t160 ? 4 : L(), i = e95.targetChange.targetIds || [], r = (t161 = t163, e93 = e95.targetChange.resumeToken, t161.D ? (B(void 0 === e93 || "string" == typeof e93), _t.fromBase64String(e93 || "")) : (B(void 0 === e93 || e93 instanceof Uint8Array), _t.fromUint8Array(e93 || new Uint8Array))), o = e95.targetChange.cause, c = o && function(t) {
                                const e = void 0 === t.code ? K.UNKNOWN : dn(t.code);
                                return new j(e, t.message || "");
                            }(o);
                            n = new xn(s, i, r, c || null);
                        } else if ("documentChange" in e95) {
                            e95.documentChange;
                            const s = e95.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t163, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o), a = s.targetIds || [], u = s.removedTargetIds || [];
                            n = new Cn(a, u, c.key, c);
                        } else if ("documentDelete" in e95) {
                            e95.documentDelete;
                            const s = e95.documentDelete;
                            s.document;
                            const i = zn(t163, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r), c = s.removedTargetIds || [];
                            n = new Cn([], c, o.key, o);
                        } else if ("documentRemove" in e95) {
                            e95.documentRemove;
                            const s = e95.documentRemove;
                            s.document;
                            const i = zn(t163, s.document), r = s.removedTargetIds || [];
                            n = new Cn([], r, i, null);
                        } else {
                            if (!("filter" in e95)) return L();
                            {
                                e95.filter;
                                const t = e95.filter;
                                t.targetId;
                                const s = t.count || 0, i = new un(s), r = t.targetId;
                                n = new Nn(r, i);
                            }
                        }
                        return n;
                    }(this.N, t162), n28 = function(t) {
                        if (!("targetChange" in t)) return rt.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t162);
                    return this.listener.Rr(e94, n28);
                }
                br(t164) {
                    const e96 = {};
                    e96.database = Yn(this.N), e96.addTarget = function(t166, e98) {
                        let n30;
                        const s14 = e98.target;
                        return (n30 = Ht(s14) ? {
                            documents: {
                                documents: [
                                    Hn(t166, s14.path)
                                ]
                            }
                        } : {
                            query: function(t167, e99) {
                                var t165, e97;
                                const n = {
                                    structuredQuery: {}
                                }, s = e99.path;
                                null !== e99.collectionGroup ? (n.parent = Hn(t167, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e99.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n.parent = Hn(t167, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t168) {
                                    if (0 === t168.length) return;
                                    const e = t168.map((t169)=>(function(t) {
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
                                        })(t169)
                                    );
                                    return 1 === e.length ? e[0] : {
                                        compositeFilter: {
                                            op: "AND",
                                            filters: e
                                        }
                                    };
                                }(e99.filters);
                                i && (n.structuredQuery.where = i);
                                const r = function(t171) {
                                    if (0 !== t171.length) return t171.map((t)=>{
                                        var t170;
                                        return {
                                            field: _s((t170 = t).field),
                                            direction: Mn[t170.dir]
                                        };
                                    });
                                }(e99.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (t165 = t167, e97 = e99.limit, t165.D || At(e97) ? e97 : {
                                    value: e97
                                });
                                return null !== o && (n.structuredQuery.limit = o), e99.startAt && (n.structuredQuery.startAt = ls(e99.startAt)), e99.endAt && (n.structuredQuery.endAt = ls(e99.endAt)), n;
                            }(t166, s14)
                        }).targetId = e98.targetId, e98.resumeToken.approximateByteSize() > 0 ? n30.resumeToken = qn(t166, e98.resumeToken) : e98.snapshotVersion.compareTo(rt.min()) > 0 && (n30.readTime = Un(t166, e98.snapshotVersion.toTimestamp())), n30;
                    }(this.N, t164);
                    const n29 = function(t, e100) {
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
                        }(0, e100.purpose);
                        return null == n ? null : {
                            "goog-listen-tags": n
                        };
                    }(this.N, t164);
                    n29 && (e96.labels = n29), this.mr(e96);
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
                onMessage(t174) {
                    if (B(!!t174.streamToken), this.lastStreamToken = t174.streamToken, this.vr) {
                        var t172, e102;
                        this.ar.reset();
                        const e101 = (t172 = t174.writeResults, e102 = t174.commitTime, t172 && t172.length > 0 ? (B(void 0 !== e102), t172.map((t)=>{
                            var t173, e;
                            let n;
                            return t173 = t, e = e102, (n = t173.updateTime ? jn(t173.updateTime) : jn(e)).isEqual(rt.min()) && (n = jn(e)), new We(n, t173.transformResults || []);
                        })) : []), n31 = jn(t174.commitTime);
                        return this.listener.Dr(n31, e101);
                    }
                    return B(!t174.writeResults || 0 === t174.writeResults.length), this.vr = !0, this.listener.Cr();
                }
                Nr() {
                    const t = {};
                    t.database = Yn(this.N), this.mr(t);
                }
                Sr(t175) {
                    const e = {
                        streamToken: this.lastStreamToken,
                        writes: t175.map((t)=>ss(this.N, t)
                        )
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
                Li(t176, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t176, e, n, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                Ki(t177, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t177, e, n, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class io {
                constructor(t178, e104, n, s, i){
                    this.localStore = t178, this.datastore = e104, this.asyncQueue = n, this.remoteSyncer = {}, this.jr = [], this.Qr = new Map, this.Wr = new Set, this.Gr = [], this.zr = i, this.zr.Ti((t179)=>{
                        n.enqueueAndForget(async ()=>{
                            wo(this) && ($("RemoteStore", "Restarting streams for network reachability change."), await async function(t) {
                                const e = q(t);
                                e.Wr.add(4), await oo(e), e.Hr.set("Unknown"), e.Wr.delete(4), await ro(e);
                            }(this));
                        });
                    }), this.Hr = new class {
                        constructor(t, e){
                            this.asyncQueue = t, this.onlineStateHandler = e, this.state = "Unknown", this.Or = 0, this.Fr = null, this.Mr = !0;
                        }
                        Lr() {
                            0 === this.Or && (this.Br("Unknown"), this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 10000, ()=>(this.Fr = null, this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve())
                            ));
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
                const n = q(t);
                n.Qr.has(e.targetId) || (n.Qr.set(e.targetId, e), fo(n) ? lo(n) : Co(n).hr() && uo(n, e));
            }
            function ao(t, e) {
                const n = q(t), s = Co(n);
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
                    getRemoteKeysForTarget: (e)=>t.remoteSyncer.getRemoteKeysForTarget(e)
                    ,
                    Tt: (e)=>t.Qr.get(e) || null
                }), Co(t).start(), t.Hr.Lr();
            }
            function fo(t) {
                return wo(t) && !Co(t).ur() && t.Qr.size > 0;
            }
            function wo(t) {
                return 0 === q(t).Wr.size;
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
            async function yo(t180, e105, n33) {
                if (t180.Hr.set("Online"), e105 instanceof xn && 2 === e105.state && e105.cause) try {
                    await async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(t180, e105);
                } catch (n34) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e105.targetIds.join(","), n34), await po(t180, n34);
                }
                else if (e105 instanceof Cn ? t180.Jr.rt(e105) : e105 instanceof Nn ? t180.Jr.ft(e105) : t180.Jr.at(e105), !n33.isEqual(rt.min())) try {
                    const e106 = await fr(t180.localStore);
                    n33.compareTo(e106) >= 0 && await function(t, e108) {
                        const n35 = t.Jr._t(e108);
                        return n35.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const i = t.Qr.get(s);
                                i && t.Qr.set(s, i.withResumeToken(n.resumeToken, e108));
                            }
                        }), n35.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (!n) return;
                            t.Qr.set(e, n.withResumeToken(_t.EMPTY_BYTE_STRING, n.snapshotVersion)), ho(t, e);
                            const s = new ii(n.target, e, 1, n.sequenceNumber);
                            uo(t, s);
                        }), t.remoteSyncer.applyRemoteEvent(n35);
                    }(t180, n33);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t180, e);
                }
            }
            async function po(t, e, n) {
                if (!Hs(e)) throw e;
                t.Wr.add(1), await oo(t), t.Hr.set("Offline"), n || (n = ()=>fr(t.localStore)
                ), t.asyncQueue.enqueueRetryable(async ()=>{
                    $("RemoteStore", "Retrying IndexedDB access"), await n(), t.Wr.delete(1), await ro(t);
                });
            }
            function To(t, e) {
                return e().catch((n)=>po(t, n, e)
                );
            }
            async function Eo(t) {
                const e = q(t), n = No(e);
                let s = e.jr.length > 0 ? e.jr[e.jr.length - 1].batchId : -1;
                for(; Io(e);)try {
                    const t = await _r(e.localStore, s);
                    if (null === t) {
                        0 === e.jr.length && n.wr();
                        break;
                    }
                    s = t.batchId, Ao(e, t);
                } catch (t181) {
                    await po(e, t181);
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
                await To(t, ()=>t.remoteSyncer.applySuccessfulWrite(i)
                ), await Eo(t);
            }
            async function So(t182, e109) {
                e109 && No(t182).Vr && await async function(t183, e) {
                    var n;
                    if ((function(t) {
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
                    })(n = e.code) && n !== K.ABORTED) {
                        const n = t183.jr.shift();
                        No(t183).dr(), await To(t183, ()=>t183.remoteSyncer.rejectFailedWrite(n.batchId, e)
                        ), await Eo(t183);
                    }
                }(t182, e109), Ro(t182) && bo(t182);
            }
            async function Do(t, e) {
                const n = q(t);
                e ? (n.Wr.delete(2), await ro(n)) : e || (n.Wr.add(2), await oo(n), n.Hr.set("Unknown"));
            }
            function Co(t184) {
                return t184.Yr || (t184.Yr = function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new to(e, s.sr, s.credentials, s.N, n);
                }(t184.datastore, t184.asyncQueue, {
                    Si: mo.bind(null, t184),
                    Ci: go.bind(null, t184),
                    Rr: yo.bind(null, t184)
                }), t184.Gr.push(async (e)=>{
                    e ? (t184.Yr.dr(), fo(t184) ? lo(t184) : t184.Hr.set("Unknown")) : (await t184.Yr.stop(), _o(t184));
                })), t184.Yr;
            }
            function No(t185) {
                return t185.Xr || (t185.Xr = function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new eo(e, s.sr, s.credentials, s.N, n);
                }(t185.datastore, t185.asyncQueue, {
                    Si: Po.bind(null, t185),
                    Ci: So.bind(null, t185),
                    Cr: vo.bind(null, t185),
                    Dr: Vo.bind(null, t185)
                }), t185.Gr.push(async (e)=>{
                    e ? (t185.Xr.dr(), await Eo(t185)) : (await t185.Xr.stop(), t185.jr.length > 0 && ($("RemoteStore", `Stopping write stream with ${t185.jr.length} pending writes`), t185.jr = []));
                })), t185.Xr;
            }
            class xo {
                constructor(t, e, n, s, i){
                    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new Q, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t)=>{});
                }
                static createAndSchedule(t, e, n, s, i) {
                    const r = Date.now() + n, o = new xo(t, e, r, s, i);
                    return o.start(n), o;
                }
                start(t) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed()
                    , t);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((t)=>this.deferred.resolve(t)
                        )) : Promise.resolve()
                    );
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
                constructor(t186){
                    this.comparator = t186 ? (e, n)=>t186(e, n) || Pt.comparator(e.key, n.key)
                     : (t, e)=>Pt.comparator(t.key, e.key)
                    , this.keyedMap = In(), this.sortedSet = new wn(this.comparator);
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
                    this.sortedSet.inorderTraversal((e, n)=>(t(e), !1)
                    );
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
                    if (!(t instanceof $o)) return !1;
                    if (this.size !== t.size) return !1;
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
                    const n = new $o;
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
                static fromInitialDocuments(t187, e, n, s) {
                    const i = [];
                    return e.forEach((t)=>{
                        i.push({
                            type: 0,
                            doc: t
                        });
                    }), new Fo(t187, e, $o.emptySet(e), i, n, s, !0, !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t) {
                    if (!(this.fromCache === t.fromCache && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && Ae(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs))) return !1;
                    const e = this.docChanges, n = t.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let t188 = 0; t188 < e.length; t188++)if (e[t188].type !== n[t188].type || !e[t188].doc.isEqual(n[t188].doc)) return !1;
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
                    this.queries = new ji((t)=>Re(t)
                    , Ae), this.onlineState = "Unknown", this.so = new Set;
                }
            }
            async function Bo(t, e) {
                const n = q(t), s = e.query;
                let i = !1, r = n.queries.get(s);
                if (r || (i = !0, r = new Mo), i) try {
                    r.no = await n.onListen(s);
                } catch (t189) {
                    const n = ko(t189, `Initialization of query '${be(e.query)}' failed`);
                    return void e.onError(n);
                }
                n.queries.set(s, r), r.listeners.push(e), e.io(n.onlineState), r.no && e.ro(r.no) && jo(n);
            }
            async function Uo(t, e) {
                const n = q(t), s = e.query;
                let i = !1;
                const r = n.queries.get(s);
                if (r) {
                    const t = r.listeners.indexOf(e);
                    t >= 0 && (r.listeners.splice(t, 1), i = 0 === r.listeners.length);
                }
                if (i) return n.queries.delete(s), n.onUnlisten(s);
            }
            function qo(t, e) {
                const n = q(t);
                let s = !1;
                for (const t190 of e){
                    const e = t190.query, i = n.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t190) && (s = !0);
                        i.no = t190;
                    }
                }
                s && jo(n);
            }
            function Ko(t, e, n) {
                const s = q(t), i = s.queries.get(e);
                if (i) for (const t191 of i.listeners)t191.onError(n);
                s.queries.delete(e);
            }
            function jo(t192) {
                t192.so.forEach((t)=>{
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
                bo(t193, e110) {
                    const n = e110 ? e110.Po : new Oo, s = e110 ? e110.Ao : this.Ao;
                    let i = e110 ? e110.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    if (t193.inorderTraversal((t, e)=>{
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
                applyChanges(t194, e111, n36) {
                    const s = this.Ao;
                    this.Ao = t194.Ao, this.mutatedKeys = t194.mutatedKeys;
                    const i = t194.Po.eo();
                    i.sort((t195, e112)=>(function(t196, e) {
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
                            return n(t196) - n(e);
                        })(t195.type, e112.type) || this.Io(t195.doc, e112.doc)
                    ), this.Vo(n36);
                    const r = e111 ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t194.Ao, s, i, t194.mutatedKeys, 0 === o, c, !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                io(t) {
                    return this.current && "Offline" === t ? (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo,
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t) {
                    return !this.po.has(t) && !!this.Ao.has(t) && !this.Ao.get(t).hasLocalMutations;
                }
                Vo(t197) {
                    t197 && (t197.addedDocuments.forEach((t)=>this.po = this.po.add(t)
                    ), t197.modifiedDocuments.forEach((t)=>{}), t197.removedDocuments.forEach((t)=>this.po = this.po.delete(t)
                    ), this.current = t197.current);
                }
                So() {
                    if (!this.current) return [];
                    const t198 = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    const e = [];
                    return t198.forEach((t)=>{
                        this.Eo.has(t) || e.push(new Yo(t));
                    }), this.Eo.forEach((n)=>{
                        t198.has(n) || e.push(new Jo(n));
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
                constructor(t199, e, n, s, i, r){
                    this.localStore = t199, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.$o = {}, this.Oo = new ji((t)=>Re(t)
                    , Ae), this.Fo = new Map, this.Mo = new Set, this.Lo = new wn(Pt.comparator), this.Bo = new Map, this.Uo = new br, this.qo = {}, this.Ko = new Map, this.jo = Ni.ie(), this.onlineState = "Unknown", this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function nc(t201, e113) {
                const n37 = Cc(t201);
                let s15, i10;
                const r = n37.Oo.get(e113);
                if (r) s15 = r.targetId, n37.sharedClientState.addLocalQueryTarget(s15), i10 = r.view.xo();
                else {
                    const t200 = await function(t202, e) {
                        const n = q(t202);
                        return n.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                            let s;
                            return n.ze.getTargetData(t, e).next((i11)=>i11 ? (s = i11, js.resolve(s)) : n.ze.allocateTargetId(t).next((i)=>(s = new ii(e, i, 0, t.currentSequenceNumber), n.ze.addTargetData(t, s).next(()=>s
                                    ))
                                )
                            );
                        }).then((t)=>{
                            const s = n.Un.get(t.targetId);
                            return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Un = n.Un.insert(t.targetId, t), n.qn.set(e, t.targetId)), t;
                        });
                    }(n37.localStore, Ee(e113)), r = n37.sharedClientState.addLocalQueryTarget(t200.targetId);
                    i10 = await sc(n37, e113, s15 = t200.targetId, "current" === r), n37.isPrimaryClient && co(n37.remoteStore, t200);
                }
                return i10;
            }
            async function sc(t203, e114, n38, s16) {
                t203.Wo = (e115, n39, s17)=>(async function(t204, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && (i = await yr(t204.localStore, e.query, !1).then(({ documents: t  })=>e.view.bo(t, i)
                        ));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, t204.isPrimaryClient, r);
                        return mc(t204, e.targetId, o.Do), o.snapshot;
                    })(t203, e115, n39, s17)
                ;
                const i12 = await yr(t203.localStore, e114, !0), r6 = new Xo(e114, i12.Gn), o3 = r6.bo(i12.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n38, s16 && "Offline" !== t203.onlineState), a = r6.applyChanges(o3, t203.isPrimaryClient, c);
                mc(t203, n38, a.Do);
                const u = new Zo(e114, n38, r6);
                return t203.Oo.set(e114, u), t203.Fo.has(n38) ? t203.Fo.get(n38).push(e114) : t203.Fo.set(n38, [
                    e114
                ]), a.snapshot;
            }
            async function ic(t205, e) {
                const n = q(t205), s = n.Oo.get(e), i = n.Fo.get(s.targetId);
                if (i.length > 1) return n.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e)
                )), void n.Oo.delete(e);
                n.isPrimaryClient ? (n.sharedClientState.removeLocalQueryTarget(s.targetId), n.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(n.localStore, s.targetId, !1).then(()=>{
                    n.sharedClientState.clearQueryState(s.targetId), ao(n.remoteStore, s.targetId), wc(n, s.targetId);
                }).catch(Fi)) : (wc(n, s.targetId), await gr(n.localStore, s.targetId, !0));
            }
            async function oc(t208, e116) {
                const n40 = q(t208);
                try {
                    const t206 = await function(t209, e119) {
                        const n43 = q(t209), s19 = e119.snapshotVersion;
                        let i = n43.Un;
                        return n43.persistence.runTransaction("Apply remote event", "readwrite-primary", (t211)=>{
                            var t207, e117, n41, s18, i13;
                            const r8 = n43.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = n43.Un;
                            const o4 = [];
                            e119.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (!c) return;
                                o4.push(n43.ze.removeMatchingKeys(t211, e.removedDocuments, r).next(()=>n43.ze.addMatchingKeys(t211, e.addedDocuments, r)
                                ));
                                const a = e.resumeToken;
                                if (a.approximateByteSize() > 0) {
                                    var t210, e118, n42;
                                    const u = c.withResumeToken(a, s19).withSequenceNumber(t211.currentSequenceNumber);
                                    i = i.insert(r, u), t210 = c, e118 = u, n42 = e, ((B(e118.resumeToken.approximateByteSize() > 0), 0 === t210.resumeToken.approximateByteSize()) ? 0 : e118.snapshotVersion.toMicroseconds() - t210.snapshotVersion.toMicroseconds() >= 300000000 ? 0 : !(n42.addedDocuments.size + n42.modifiedDocuments.size + n42.removedDocuments.size > 0)) || o4.push(n43.ze.updateTargetData(t211, u));
                                }
                            });
                            let c2 = Tn(), r7;
                            if (e119.documentUpdates.forEach((s, i)=>{
                                e119.resolvedLimboDocuments.has(s) && o4.push(n43.persistence.referenceDelegate.updateLimboDocument(t211, s));
                            }), o4.push((t207 = t211, e117 = r8, n41 = e119.documentUpdates, s18 = s19, i13 = void 0, r7 = Pn(), n41.forEach((t)=>r7 = r7.add(t)
                            ), e117.getEntries(t207, r7).next((t)=>{
                                let r = Tn();
                                return n41.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i13 ? void 0 : i13.get(n)) || s18;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (e117.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (e117.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c2 = t;
                            })), !s19.isEqual(rt.min())) {
                                const e = n43.ze.getLastRemoteSnapshotVersion(t211).next((e)=>n43.ze.setTargetsMetadata(t211, t211.currentSequenceNumber, s19)
                                );
                                o4.push(e);
                            }
                            return js.waitFor(o4).next(()=>r8.apply(t211)
                            ).next(()=>n43.Qn.vn(t211, c2)
                            ).next(()=>c2
                            );
                        }).then((t)=>(n43.Un = i, t)
                        );
                    }(n40.localStore, e116);
                    e116.targetChanges.forEach((t, e)=>{
                        const s = n40.Bo.get(e);
                        s && (B(t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1), t.addedDocuments.size > 0 ? s.ko = !0 : t.modifiedDocuments.size > 0 ? B(s.ko) : t.removedDocuments.size > 0 && (B(s.ko), s.ko = !1));
                    }), await pc(n40, t206, e116);
                } catch (t) {
                    await Fi(t);
                }
            }
            function cc(t, e120, n44) {
                const s20 = q(t);
                if (s20.isPrimaryClient && 0 === n44 || !s20.isPrimaryClient && 1 === n44) {
                    const t212 = [];
                    s20.Oo.forEach((n, s)=>{
                        const i = s.view.io(e120);
                        i.snapshot && t212.push(i.snapshot);
                    }), function(t, e) {
                        const n45 = q(t);
                        n45.onlineState = e;
                        let s = !1;
                        n45.queries.forEach((t, n)=>{
                            for (const t213 of n.listeners)t213.io(e) && (s = !0);
                        }), s && jo(n45);
                    }(s20.eventManager, e120), t212.length && s20.$o.Rr(t212), s20.onlineState = e120, s20.isPrimaryClient && s20.sharedClientState.setOnlineState(e120);
                }
            }
            async function ac(t, e, n) {
                const s = q(t);
                s.sharedClientState.updateQueryState(e, "rejected", n);
                const i = s.Bo.get(e), r = i && i.key;
                if (r) {
                    let t = new wn(Pt.comparator);
                    t = t.insert(r, Kt.newNoDocument(r, rt.min()));
                    const n = Pn().add(r), i = new Sn(rt.min(), new Map, new gn(et), t, n);
                    await oc(s, i), s.Lo = s.Lo.remove(r), s.Bo.delete(e), yc(s);
                } else await gr(s.localStore, e, !1).then(()=>wc(s, e, n)
                ).catch(Fi);
            }
            function wc(t, e121, n = null) {
                for (const s of (t.sharedClientState.removeLocalQueryTarget(e121), t.Fo.get(e121)))t.Oo.delete(s), n && t.$o.Go(s, n);
                t.Fo.delete(e121), t.isPrimaryClient && t.Uo.cs(e121).forEach((e)=>{
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
            async function pc(t214, e122, n46) {
                const s21 = q(t214), i14 = [], r = [], o = [];
                s21.Oo.isEmpty() || (s21.Oo.forEach((t215, c)=>{
                    o.push(s21.Wo(c, e122, n46).then((t)=>{
                        if (t) {
                            s21.isPrimaryClient && s21.sharedClientState.updateQueryState(c.targetId, t.fromCache ? "not-current" : "current"), i14.push(t);
                            const e = or.kn(c.targetId, t);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), s21.$o.Rr(i14), await async function(t217, e123) {
                    const n = q(t217);
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t)=>js.forEach(e123, (e)=>js.forEach(e.Nn, (s)=>n.persistence.referenceDelegate.addReference(t, e.targetId, s)
                                ).next(()=>js.forEach(e.xn, (s)=>n.persistence.referenceDelegate.removeReference(t, e.targetId, s)
                                    )
                                )
                            )
                        );
                    } catch (t) {
                        if (!Hs(t)) throw t;
                        $("LocalStore", "Failed to update sequence numbers: " + t);
                    }
                    for (const t216 of e123){
                        const e = t216.targetId;
                        if (!t216.fromCache) {
                            const t = n.Un.get(e), s = t.snapshotVersion, i = t.withLastLimboFreeSnapshotVersion(s);
                            n.Un = n.Un.insert(e, i);
                        }
                    }
                }(s21.localStore, r));
            }
            async function Tc(t220, e) {
                const n = q(t220);
                if (!n.currentUser.isEqual(e)) {
                    var t218, e124;
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t219 = await hr(n.localStore, e);
                    n.currentUser = e, e124 = "'waitForPendingWrites' promise is rejected due to a user change.", (t218 = n).Ko.forEach((t221)=>{
                        t221.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e124));
                        });
                    }), t218.Ko.clear(), n.sharedClientState.handleUserChange(e, t219.removedBatchIds, t219.addedBatchIds), await pc(n, t219.Wn);
                }
            }
            function Ec(t, e) {
                const n = q(t), s = n.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t = Pn();
                    const s = n.Fo.get(e);
                    if (!s) return t;
                    for (const e125 of s){
                        const s = n.Oo.get(e125);
                        t = t.unionWith(s.view.Ro);
                    }
                    return t;
                }
            }
            function Cc(t) {
                const e = q(t);
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
                    var t222, e, n, s;
                    return t222 = this.persistence, e = new cr, n = t.initialUser, s = this.N, new ar(t222, e, n, s);
                }
                Jo(t) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t) {
                    return new Kr;
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class Fc {
                async initialize(t223, e) {
                    this.localStore || (this.localStore = t223.localStore, this.sharedClientState = t223.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t223.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t)=>cc(this.syncEngine, t, 1)
                    , this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t) {
                    return new Lo;
                }
                createDatastore(t) {
                    var s, t224, e, n;
                    const e126 = Yr(t.databaseInfo.databaseId), n47 = (s = t.databaseInfo, new zr(s));
                    return t224 = t.credentials, e = n47, n = e126, new no(t224, e, n);
                }
                createRemoteStore(t225) {
                    var e, n, s, i, r;
                    return e = this.localStore, n = this.datastore, s = t225.asyncQueue, i = (t)=>cc(this.syncEngine, t, 0)
                    , r = Qr.bt() ? new Qr : new jr, new io(e, n, s, i, r);
                }
                createSyncEngine(t226, e127) {
                    return (function(t, e, n, s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t226.initialUser, t226.maxConcurrentLimboResolutions, e127);
                }
                terminate() {
                    return (async function(t) {
                        const e = q(t);
                        $("RemoteStore", "RemoteStore shutting down."), e.Wr.add(5), await oo(e), e.zr.shutdown(), e.Hr.set("Unknown");
                    })(this.remoteStore);
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
                constructor(t227, e128, n48){
                    this.credentials = t227, this.asyncQueue = e128, this.databaseInfo = n48, this.user = D.UNAUTHENTICATED, this.clientId = (class {
                        static I() {
                            const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
                            let n = "";
                            for(; n.length < 20;){
                                const s = Z(40);
                                for(let i = 0; i < s.length; ++i)n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
                            }
                            return n;
                        }
                    }).I(), this.credentialListener = ()=>Promise.resolve()
                    , this.credentials.start(e128, async (t)=>{
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
                    const t = new Q;
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
            async function jc(t228, e) {
                t228.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t228.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t228.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await hr(e.localStore, t), s = t);
                }), e.persistence.setDatabaseDeletedListener(()=>t228.terminate()
                ), t228.offlineComponents = e;
            }
            async function Qc(t229, e129) {
                t229.asyncQueue.verifyOperationInProgress();
                const n49 = await Wc(t229);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s22 = await t229.getConfiguration();
                await e129.initialize(n49, s22), t229.setCredentialChangeListener((t230)=>(async function(t, e) {
                        const n = q(t);
                        n.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(n);
                        n.Wr.add(3), await oo(n), s && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.Wr.delete(3), await ro(n);
                    })(e129.remoteStore, t230)
                ), t229.onlineComponents = e129;
            }
            async function Wc(t) {
                return t.offlineComponents || ($("FirestoreClient", "Using default OfflineComponentProvider"), await jc(t, new kc)), t.offlineComponents;
            }
            async function Gc(t) {
                return t.onlineComponents || ($("FirestoreClient", "Using default OnlineComponentProvider"), await Qc(t, new Fc)), t.onlineComponents;
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
            const la = new Map;
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
                        var t231;
                        const e = (t231 = t).constructor ? t231.constructor.name : null;
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
                constructor(t232){
                    var e130;
                    if (void 0 === t232.host) {
                        if (void 0 !== t232.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t232.host, this.ssl = null === (e130 = t232.ssl) || void 0 === e130 || e130;
                    if (this.credentials = t232.credentials, this.ignoreUndefinedProperties = !!t232.ignoreUndefinedProperties, void 0 === t232.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t232.cacheSizeBytes && t232.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t232.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t232.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t232.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t232.useFetchStreams, function(t, e, n, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
                    }("experimentalForceLongPolling", t232.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t232.experimentalAutoDetectLongPolling);
                }
                isEqual(t) {
                    return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
                }
            }
            class Ta {
                constructor(t233, e){
                    this._credentials = e, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({}), this._settingsFrozen = !1, t233 instanceof ha ? this._databaseId = t233 : (this._app = t233, this._databaseId = function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, "\"projectId\" not provided in firebase.initializeApp.");
                        return new ha(t.options.projectId);
                    }(t233));
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
                _setSettings(t234) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t234), void 0 !== t234.credentials && (this._credentials = function(t) {
                        if (!t) return new G;
                        switch(t.type){
                            case "gapi":
                                const e = t.client;
                                return B(!("object" != typeof e || null === e || !e.auth || !e.auth.getAuthHeaderValueForFirstParty)), new Y(e, t.sessionIndex || "0", t.iamToken || null);
                            case "provider":
                                return t.client;
                            default:
                                throw new j(K.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    }(t234.credentials));
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
                    return (function(t) {
                        const e = la.get(t);
                        e && ($("ComponentProvider", "Removing Datastore"), la.delete(t), e.terminate());
                    })(this), Promise.resolve();
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
            function ba(t235, e131, ...n50) {
                if (t235 = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.m9)(t235), function(t, e, n) {
                    if (!n) throw new j(K.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
                }("collection", "path", e131), t235 instanceof Ta) {
                    const s = ht.fromString(e131, ...n50);
                    return _a(s), new Ra(t235, null, s);
                }
                {
                    if (!(t235 instanceof Ia || t235 instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t235._path.child(ht.fromString(e131, ...n50));
                    return _a(s), new Ra(t235.firestore, null, s);
                }
            }
            class ka extends Ta {
                constructor(t236, e132){
                    super(t236, e132), this.type = "firestore", this._queue = new class {
                        constructor(){
                            this._c = Promise.resolve(), this.mc = [], this.gc = !1, this.yc = [], this.Tc = null, this.Ec = !1, this.Ic = !1, this.Ac = [], this.ar = new Xr(this, "async_queue_retry"), this.Rc = ()=>{
                                const t = Jr();
                                t && $("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                            };
                            const t237 = Jr();
                            t237 && "function" == typeof t237.addEventListener && t237.addEventListener("visibilitychange", this.Rc);
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
                            const e = new Q;
                            return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t().then(e.resolve, e.reject), e.promise)
                            ).then(()=>e.promise
                            );
                        }
                        enqueueRetryable(t) {
                            this.enqueueAndForget(()=>(this.mc.push(t), this.vc())
                            );
                        }
                        async vc() {
                            if (0 !== this.mc.length) {
                                try {
                                    await this.mc[0](), this.mc.shift(), this.ar.reset();
                                } catch (t) {
                                    if (!Hs(t)) throw t;
                                    $("AsyncQueue", "Operation failed with retryable error: " + t);
                                }
                                this.mc.length > 0 && this.ar.Xi(()=>this.vc()
                                );
                            }
                        }
                        Pc(t239) {
                            const e134 = this._c.then(()=>(this.Ec = !0, t239().catch((t)=>{
                                    var t238;
                                    this.Tc = t, this.Ec = !1;
                                    let e;
                                    const e133 = (e = (t238 = t).message || "", t238.stack && (e = t238.stack.includes(t238.message) ? t238.stack : t238.message + "\n" + t238.stack), e);
                                    throw O("INTERNAL UNHANDLED ERROR: ", e133), t;
                                }).then((t)=>(this.Ec = !1, t)
                                ))
                            );
                            return this._c = e134, e134;
                        }
                        enqueueAfterDelay(t240, e, n) {
                            this.bc(), this.Ac.indexOf(t240) > -1 && (e = 0);
                            const s = xo.createAndSchedule(this, t240, e, n, (t)=>this.Vc(t)
                            );
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
                        Cc(t241) {
                            return this.Sc().then(()=>{
                                for (const e135 of (this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs
                                ), this.yc))if (e135.skipDelay(), "all" !== t241 && e135.timerId === t241) break;
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
                    }, this._persistenceKey = "name" in t236 ? t236.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e, t242, e136, n, s;
                const n51 = t._freezeSettings(), s23 = (t242 = t._databaseId, e136 = (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", n = t._persistenceKey, s = n51, new ua(t242, e136, n, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams));
                t._firestoreClient = new Kc(t._credentials, t._queue, s23);
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
                    } catch (t243) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t243);
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
                    return void 0 !== this.fieldMask.find((e)=>t.isPrefixOf(e)
                    ) || void 0 !== this.fieldTransforms.find((e)=>t.isPrefixOf(e.field)
                    );
                }
                xc() {
                    if (this.path) for(let t = 0; t < this.path.length; t++)this.Mc(this.path.get(t));
                }
                Mc(t) {
                    if (0 === t.length) throw this.Uc("Document fields must not be empty");
                    if (iu(this.kc) && eu.test(t)) throw this.Uc("Document fields cannot begin and end with \"__\"");
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
                    return new je(t.path, new Oe);
                }
                isEqual(t) {
                    return t instanceof lu;
                }
            }
            function yu(t244, e137) {
                if (Tu(t244 = getModularInstance(t244))) return Eu("Unsupported field value:", e137, t244), pu(t244, e137);
                if (t244 instanceof Za) return (function(t, e) {
                    if (!iu(e.kc)) throw e.Uc(`${t._methodName}() can only be used with update() and set()`);
                    if (!e.path) throw e.Uc(`${t._methodName}() is not currently supported inside arrays`);
                    const n = t._toFieldTransform(e);
                    n && e.fieldTransforms.push(n);
                })(t244, e137), null;
                if (void 0 === t244 && e137.ignoreUndefinedProperties) return null;
                if (e137.path && e137.fieldMask.push(e137.path), t244 instanceof Array) {
                    if (e137.settings.Fc && 4 !== e137.kc) throw e137.Uc("Nested arrays are not supported");
                    return (function(t, e) {
                        const n = [];
                        let s = 0;
                        for (const i of t){
                            let t = yu(i, e.Bc(s));
                            null == t && (t = {
                                nullValue: "NULL_VALUE"
                            }), n.push(t), s++;
                        }
                        return {
                            arrayValue: {
                                values: n
                            }
                        };
                    })(t244, e137);
                }
                return (function(t, e) {
                    if (null === (t = getModularInstance(t))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof t) {
                        var t245, e138;
                        return t245 = e.N, bt(e138 = t) ? De(e138) : Se(t245, e138);
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
                        const n = new it(t.seconds, 1000 * Math.floor(t.nanoseconds / 1000));
                        return {
                            timestampValue: Un(e.N, n)
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
                        const n = e.databaseId, s = t.firestore._databaseId;
                        if (!s.isEqual(n)) throw e.Uc(`Document reference is for database ${s.projectId}/${s.database} but should be for database ${n.projectId}/${n.database}`);
                        return {
                            referenceValue: Qn(t.firestore._databaseId || e.databaseId, t._key.path)
                        };
                    }
                    throw e.Uc(`Unsupported field value: ${ma(t)}`);
                })(t244, e137);
            }
            function pu(t246, e) {
                const n = {};
                return at(t246) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : ct(t246, (t, s)=>{
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
                var t247;
                if (!Tu(n) || "object" != typeof (t247 = n) || null === t247 || Object.getPrototypeOf(t247) !== Object.prototype && null !== Object.getPrototypeOf(t247)) {
                    const s = ma(n);
                    throw "an object" === s ? e.Uc(t + " a custom object") : e.Uc(t + " " + s);
                }
            }
            const Au = new RegExp("[~\\*/\\[\\]]");
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
            function Su(t248, e139) {
                return "string" == typeof e139 ? function(t, e, n) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, n);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, n);
                    }
                }(t248, e139) : e139 instanceof Ja ? e139._internalPath : e139._delegate._internalPath;
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
                    return this.forEach((e)=>t.push(e)
                    ), t;
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
                docChanges(t249 = {}) {
                    const e140 = !!t249.includeMetadataChanges;
                    if (e140 && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e140 || (this._cachedChanges = function(t250, e141) {
                        if (t250._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t250._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t250._firestore, t250._userDataWriter, n.doc.key, n.doc, new Du(t250._snapshot.mutatedKeys.has(n.doc.key), t250._snapshot.fromCache), t250.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                })
                            );
                        }
                        {
                            let n = t250._snapshot.oldDocs;
                            return t250._snapshot.docChanges.filter((t)=>e141 || 3 !== t.type
                            ).map((e)=>{
                                const s = new Nu(t250._firestore, t250._userDataWriter, e.doc.key, e.doc, new Du(t250._snapshot.mutatedKeys.has(e.doc.key), t250._snapshot.fromCache), t250.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: ku(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    }(this, e140), this._cachedChangesIncludeMetadataChanges = e140), this._cachedChanges;
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
                convertObject(t251, e) {
                    const n = {};
                    return ct(t251.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e);
                    }), n;
                }
                convertGeoPoint(t) {
                    return new tu(yt(t.latitude), yt(t.longitude));
                }
                convertArray(t252, e) {
                    return (t252.values || []).map((t)=>this.convertValue(t, e)
                    );
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
                    B(Ts(n));
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
            function lh(t254) {
                var t253;
                t254 = ga(t254, Aa);
                const e142 = ga(t254.firestore, ka), n52 = ((t253 = e142)._firestoreClient || Ma(t253), t253._firestoreClient.verifyNotTerminated(), t253._firestoreClient), s24 = new ah(e142);
                return (function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                })(t254._query), (function(t255, e143, n53 = {}) {
                    const s25 = new Q;
                    return t255.asyncQueue.enqueueAndForget(async ()=>(function(t256, e, n54, s, i) {
                            const r = new Lc({
                                next: (n)=>{
                                    e.enqueueAndForget(()=>Uo(t256, o)
                                    ), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, "Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to \"server\" to retrieve the cached documents.)")) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), o = new Qo(n54, r, {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t256, o);
                        })(await Xc(t255), t255.asyncQueue, e143, n53, s25)
                    ), s25.promise;
                })(n52, t254._query).then((n)=>new xu(e142, s24, t254, n)
                );
            }
            !function(t257, e = !0) {
                C = _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Jn, (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.Xd)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.wA("firestore", (t, { options: n  })=>{
                    const s = t.getProvider("app").getImmediate(), i = new ka(s, new H(t.getProvider("auth-internal")));
                    return n = Object.assign({
                        useFetchStreams: e
                    }, n), i._setSettings(n), i;
                }, "PUBLIC")), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", void 0), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(S, "3.3.0", "esm2017");
            }();
        }
    }
]);
