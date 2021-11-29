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
                    this.user = e, this.type = "OAuth", this.authHeaders = {
                    }, this.authHeaders.Authorization = `Bearer ${t}`;
                }
            }
            class G {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {
                }
                start(t2, e3) {
                    t2.enqueueRetryable(()=>e3(D.UNAUTHENTICATED)
                    );
                }
                shutdown() {
                }
            }
            class H {
                constructor(t){
                    this.t = t, this.currentUser = D.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t3, e2) {
                    let n = this.i;
                    const s = (t)=>this.i !== n ? (n = this.i, e2(t)) : Promise.resolve()
                    ;
                    let i = new Q;
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q, t3.enqueueRetryable(()=>s(this.currentUser)
                        );
                    };
                    const r = ()=>{
                        const e = i;
                        t3.enqueueRetryable(async ()=>{
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
                    const t = this.i, e4 = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e4).then((e)=>this.i !== t ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? (B("string" == typeof e.accessToken), new W(e.accessToken, this.currentUser)) : null
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
                start(t4, e5) {
                    t4.enqueueRetryable(()=>e5(D.FIRST_PARTY)
                    );
                }
                shutdown() {
                }
                invalidateToken() {
                }
            }
            class X {
                constructor(t5, e){
                    this.previousValue = t5, e && (e.sequenceNumberHandler = (t)=>this.g(t)
                    , this.p = (t)=>e.writeSequenceNumber(t)
                    );
                }
                g(t6) {
                    return this.previousValue = Math.max(t6, this.previousValue), this.previousValue;
                }
                next() {
                    const t = ++this.previousValue;
                    return this.p && this.p(t), t;
                }
            }
            function Z(t) {
                const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
                if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                else for(let e6 = 0; e6 < t; e6++)n[e6] = Math.floor(256 * Math.random());
                return n;
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function nt(t7, e, n) {
                return t7.length === e.length && t7.every((t, s)=>n(t, e[s])
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
                static fromDate(t11) {
                    return it.fromMillis(t11.getTime());
                }
                static fromMillis(t8) {
                    const e = Math.floor(t8 / 1000);
                    return new it(e, Math.floor(1000000 * (t8 - 1000 * e)));
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1000 * this.seconds + this.nanoseconds / 1000000;
                }
                _compareTo(t9) {
                    return this.seconds === t9.seconds ? et(this.nanoseconds, t9.nanoseconds) : et(this.seconds, t9.seconds);
                }
                isEqual(t10) {
                    return t10.seconds === this.seconds && t10.nanoseconds === this.nanoseconds;
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
                static fromTimestamp(t14) {
                    return new rt(t14);
                }
                static min() {
                    return new rt(new it(0, 0));
                }
                compareTo(t12) {
                    return this.timestamp._compareTo(t12.timestamp);
                }
                isEqual(t13) {
                    return this.timestamp.isEqual(t13.timestamp);
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
                    void 0 === e ? e = 0 : 0 > t.length && L(), void 0 === n ? n = t.length - 0 : n > t.length - 0 && L(), this.segments = t, this.offset = 0, this.len = n;
                }
                get length() {
                    return this.len;
                }
                isEqual(t16) {
                    return 0 === ut.comparator(this, t16);
                }
                child(t15) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t15 instanceof ut ? t15.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t15), this.construct(e);
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(t24) {
                    return t24 = void 0 === t24 ? 1 : t24, this.construct(this.segments, this.offset + t24, this.length - t24);
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
                get(t17) {
                    return this.segments[this.offset + t17];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(t18) {
                    if (t18.length < this.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t18.get(e)) return !1;
                    return !0;
                }
                isImmediateParentOf(t19) {
                    if (this.length + 1 !== t19.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t19.get(e)) return !1;
                    return !0;
                }
                forEach(t20) {
                    for(let e = this.offset, n = this.limit(); e < n; e++)t20(this.segments[e]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(t21, e9) {
                    const n = Math.min(t21.length, e9.length);
                    for(let s = 0; s < n; s++){
                        const n = t21.get(s), i = e9.get(s);
                        if (n < i) return -1;
                        if (n > i) return 1;
                    }
                    return t21.length < e9.length ? -1 : t21.length > e9.length ? 1 : 0;
                }
            }
            class ht extends ut {
                construct(t22, e7, n2) {
                    return new ht(t22, e7, n2);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...t23) {
                    const e = [];
                    for (const n of t23){
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
                construct(t26, e8, n1) {
                    return new ft(t26, e8, n1);
                }
                static isValidIdentifier(t25) {
                    return lt.test(t25);
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
                static fromServerFormat(t27) {
                    const e = [];
                    let n = "", s = 0;
                    const i = ()=>{
                        if (0 === n.length) throw new j(K.INVALID_ARGUMENT, `Invalid field path (${t27}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n), n = "";
                    };
                    let r = !1;
                    for(; s < t27.length;){
                        const e = t27[s];
                        if ("\\" === e) {
                            if (s + 1 === t27.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t27);
                            const e = t27[s + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t27);
                            n += e, s += 2;
                        } else "`" === e ? (r = !r, s++) : "." !== e || r ? (n += e, s++) : (i(), s++);
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t27);
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
                covers(t29) {
                    for (const e of this.fields)if (e.isPrefixOf(t29)) return !0;
                    return !1;
                }
                isEqual(t28) {
                    return nt(this.fields, t28.fields, (t, e)=>t.isEqual(e)
                    );
                }
            }
            class _t {
                constructor(t){
                    this.binaryString = t;
                }
                static fromBase64String(t31) {
                    const e = atob(t31);
                    return new _t(e);
                }
                static fromUint8Array(t30) {
                    const e10 = function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(t30);
                    return new _t(e10);
                }
                toBase64() {
                    return this.binaryString, btoa(this.binaryString);
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
                compareTo(t33) {
                    return et(this.binaryString, t33.binaryString);
                }
                isEqual(t32) {
                    return this.binaryString === t32.binaryString;
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
                return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {
                }).__type__) || void 0 === n ? void 0 : n.stringValue);
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
                static fromPath(t40) {
                    return new Pt(ht.fromString(t40));
                }
                static fromName(t34) {
                    return new Pt(ht.fromString(t34).popFirst(5));
                }
                hasCollectionId(t35) {
                    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t35;
                }
                isEqual(t36) {
                    return null !== t36 && 0 === ht.comparator(this.path, t36.path);
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t37, e13) {
                    return ht.comparator(t37.path, e13.path);
                }
                static isDocumentKey(t38) {
                    return t38.length % 2 == 0;
                }
                static fromSegments(t39) {
                    return new Pt(new ht(t39.slice()));
                }
            }
            function vt(t) {
                return "nullValue" in t ? 0 : "booleanValue" in t ? 1 : "integerValue" in t || "doubleValue" in t ? 2 : "timestampValue" in t ? 3 : "stringValue" in t ? 5 : "bytesValue" in t ? 6 : "referenceValue" in t ? 7 : "geoPointValue" in t ? 8 : "arrayValue" in t ? 9 : "mapValue" in t ? Tt(t) ? 4 : 10 : L();
            }
            function Vt(t43, e14) {
                var t41, e11, t42, e12;
                const n3 = vt(t43);
                if (n3 !== vt(e14)) return !1;
                switch(n3){
                    case 0:
                        return !0;
                    case 1:
                        return t43.booleanValue === e14.booleanValue;
                    case 4:
                        return It(t43).isEqual(It(e14));
                    case 3:
                        return (function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) return t.timestampValue === e.timestampValue;
                            const n = gt(t.timestampValue), s = gt(e.timestampValue);
                            return n.seconds === s.seconds && n.nanos === s.nanos;
                        })(t43, e14);
                    case 5:
                        return t43.stringValue === e14.stringValue;
                    case 6:
                        return t41 = t43, e11 = e14, pt(t41.bytesValue).isEqual(pt(e11.bytesValue));
                    case 7:
                        return t43.referenceValue === e14.referenceValue;
                    case 8:
                        return t42 = t43, e12 = e14, yt(t42.geoPointValue.latitude) === yt(e12.geoPointValue.latitude) && yt(t42.geoPointValue.longitude) === yt(e12.geoPointValue.longitude);
                    case 2:
                        return (function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return yt(t.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = yt(t.doubleValue), s = yt(e.doubleValue);
                                return n === s ? Rt(n) === Rt(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        })(t43, e14);
                    case 9:
                        return nt(t43.arrayValue.values || [], e14.arrayValue.values || [], Vt);
                    case 10:
                        return (function(t, e) {
                            const n = t.mapValue.fields || {
                            }, s = e.mapValue.fields || {
                            };
                            if (ot(n) !== ot(s)) return !1;
                            for(const t44 in n)if (n.hasOwnProperty(t44) && (void 0 === s[t44] || !Vt(n[t44], s[t44]))) return !1;
                            return !0;
                        })(t43, e14);
                    default:
                        return L();
                }
            }
            function St(t45, e) {
                return void 0 !== (t45.values || []).find((t)=>Vt(t, e)
                );
            }
            function Dt(t46, e15) {
                const n4 = vt(t46), s1 = vt(e15);
                if (n4 !== s1) return et(n4, s1);
                switch(n4){
                    case 0:
                        return 0;
                    case 1:
                        return et(t46.booleanValue, e15.booleanValue);
                    case 2:
                        return (function(t, e) {
                            const n = yt(t.integerValue || t.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        })(t46, e15);
                    case 3:
                        return Ct(t46.timestampValue, e15.timestampValue);
                    case 4:
                        return Ct(It(t46), It(e15));
                    case 5:
                        return et(t46.stringValue, e15.stringValue);
                    case 6:
                        return (function(t, e) {
                            const n = pt(t), s = pt(e);
                            return n.compareTo(s);
                        })(t46.bytesValue, e15.bytesValue);
                    case 7:
                        return (function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let t47 = 0; t47 < n.length && t47 < s.length; t47++){
                                const e = et(n[t47], s[t47]);
                                if (0 !== e) return e;
                            }
                            return et(n.length, s.length);
                        })(t46.referenceValue, e15.referenceValue);
                    case 8:
                        return (function(t, e) {
                            const n = et(yt(t.latitude), yt(e.latitude));
                            return 0 !== n ? n : et(yt(t.longitude), yt(e.longitude));
                        })(t46.geoPointValue, e15.geoPointValue);
                    case 9:
                        return (function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let t48 = 0; t48 < n.length && t48 < s.length; ++t48){
                                const e = Dt(n[t48], s[t48]);
                                if (e) return e;
                            }
                            return et(n.length, s.length);
                        })(t46.arrayValue, e15.arrayValue);
                    case 10:
                        return (function(t, e) {
                            const n = t.fields || {
                            }, s = Object.keys(n), i = e.fields || {
                            }, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t49 = 0; t49 < s.length && t49 < r.length; ++t49){
                                const e = et(s[t49], r[t49]);
                                if (0 !== e) return e;
                                const o = Dt(n[s[t49]], i[r[t49]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        })(t46.mapValue, e15.mapValue);
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
            function xt(t50) {
                var e16, n5;
                return "nullValue" in t50 ? "null" : "booleanValue" in t50 ? "" + t50.booleanValue : "integerValue" in t50 ? "" + t50.integerValue : "doubleValue" in t50 ? "" + t50.doubleValue : "timestampValue" in t50 ? (function(t) {
                    const e = gt(t);
                    return `time(${e.seconds},${e.nanos})`;
                })(t50.timestampValue) : "stringValue" in t50 ? t50.stringValue : "bytesValue" in t50 ? pt(t50.bytesValue).toBase64() : "referenceValue" in t50 ? (n5 = t50.referenceValue, Pt.fromName(n5).toString()) : "geoPointValue" in t50 ? `geo(${(e16 = t50.geoPointValue).latitude},${e16.longitude})` : "arrayValue" in t50 ? (function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? n = !1 : e += ",", e += xt(s);
                    return e + "]";
                })(t50.arrayValue) : "mapValue" in t50 ? (function(t) {
                    const e = Object.keys(t.fields || {
                    }).sort();
                    let n = "{", s = !0;
                    for (const i of e)s ? s = !1 : n += ",", n += `${i}:${xt(t.fields[i])}`;
                    return n + "}";
                })(t50.mapValue) : L();
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
                    geoPointValue: Object.assign({
                    }, t.geoPointValue)
                };
                if (t.timestampValue && "object" == typeof t.timestampValue) return {
                    timestampValue: Object.assign({
                    }, t.timestampValue)
                };
                if (t.mapValue) {
                    const e = {
                        mapValue: {
                            fields: {
                            }
                        }
                    };
                    return ct(t.mapValue.fields, (t, n)=>e.mapValue.fields[t] = Bt(n)
                    ), e;
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
                return Object.assign({
                }, t);
            }
            class Ut {
                constructor(t){
                    this.value = t;
                }
                static empty() {
                    return new Ut({
                        mapValue: {
                        }
                    });
                }
                field(t53) {
                    if (t53.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n = 0; n < t53.length - 1; ++n)if (!Lt(e = (e.mapValue.fields || {
                        })[t53.get(n)])) return null;
                        return (e = (e.mapValue.fields || {
                        })[t53.lastSegment()]) || null;
                    }
                }
                set(t51, e18) {
                    this.getFieldsMap(t51.popLast())[t51.lastSegment()] = Bt(e18);
                }
                setAll(t52) {
                    let e = ft.emptyPath(), n = {
                    }, s = [];
                    t52.forEach((t, i)=>{
                        if (!e.isImmediateParentOf(i)) {
                            const t = this.getFieldsMap(e);
                            this.applyChanges(t, n, s), n = {
                            }, s = [], e = i.popLast();
                        }
                        t ? n[i.lastSegment()] = Bt(t) : s.push(i.lastSegment());
                    });
                    const i1 = this.getFieldsMap(e);
                    this.applyChanges(i1, n, s);
                }
                delete(t57) {
                    const e = this.field(t57.popLast());
                    Lt(e) && e.mapValue.fields && delete e.mapValue.fields[t57.lastSegment()];
                }
                isEqual(t54) {
                    return Vt(this.value, t54.value);
                }
                getFieldsMap(t55) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {
                        }
                    });
                    for(let n = 0; n < t55.length; ++n){
                        let s = e.mapValue.fields[t55.get(n)];
                        Lt(s) && s.mapValue.fields || (s = {
                            mapValue: {
                                fields: {
                                }
                            }
                        }, e.mapValue.fields[t55.get(n)] = s), e = s;
                    }
                    return e.mapValue.fields;
                }
                applyChanges(t56, e17, n6) {
                    for (const e of (ct(e17, (e, n)=>t56[e] = n
                    ), n6))delete t56[e];
                }
                clone() {
                    return new Ut(Bt(this.value));
                }
            }
            class Kt {
                constructor(t, e, n, s, i){
                    this.key = t, this.documentType = e, this.version = n, this.data = s, this.documentState = i;
                }
                static newInvalidDocument(t65) {
                    return new Kt(t65, 0, rt.min(), Ut.empty(), 0);
                }
                static newFoundDocument(t58, e22, n7) {
                    return new Kt(t58, 1, e22, n7, 0);
                }
                static newNoDocument(t59, e19) {
                    return new Kt(t59, 2, e19, Ut.empty(), 0);
                }
                static newUnknownDocument(t60, e20) {
                    return new Kt(t60, 3, e20, Ut.empty(), 2);
                }
                convertToFoundDocument(t61, e21) {
                    return this.version = t61, this.documentType = 1, this.data = e21, this.documentState = 0, this;
                }
                convertToNoDocument(t62) {
                    return this.version = t62, this.documentType = 2, this.data = Ut.empty(), this.documentState = 0, this;
                }
                convertToUnknownDocument(t63) {
                    return this.version = t63, this.documentType = 3, this.data = Ut.empty(), this.documentState = 2, this;
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
                isEqual(t64) {
                    return t64 instanceof Kt && this.key.isEqual(t64.key) && this.version.isEqual(t64.version) && this.documentType === t64.documentType && this.documentState === t64.documentState && this.data.isEqual(t64.data);
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
            function Wt(t68) {
                const e = q(t68);
                if (null === e.A) {
                    let t66 = e.path.canonicalString();
                    null !== e.collectionGroup && (t66 += "|cg:" + e.collectionGroup), t66 += "|f:", t66 += e.filters.map((t)=>Yt(t)
                    ).join(","), t66 += "|ob:", t66 += e.orderBy.map((t)=>{
                        var t67;
                        return (t67 = t).field.canonicalString() + t67.dir;
                    }).join(","), At(e.limit) || (t66 += "|l:", t66 += e.limit), e.startAt && (t66 += "|lb:", t66 += ce(e.startAt)), e.endAt && (t66 += "|ub:", t66 += ce(e.endAt)), e.A = t66;
                }
                return e.A;
            }
            function zt(t, e) {
                var n, s;
                if (t.limit !== e.limit) return !1;
                if (t.orderBy.length !== e.orderBy.length) return !1;
                for(let n8 = 0; n8 < t.orderBy.length; n8++)if (!ue(t.orderBy[n8], e.orderBy[n8])) return !1;
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
                static create(t72, e24, n10) {
                    return t72.isKeyField() ? "in" === e24 || "not-in" === e24 ? this.R(t72, e24, n10) : new Xt(t72, e24, n10) : "array-contains" === e24 ? new ne(t72, n10) : "in" === e24 ? new se(t72, n10) : "not-in" === e24 ? new ie(t72, n10) : "array-contains-any" === e24 ? new re(t72, n10) : new Jt(t72, e24, n10);
                }
                static R(t69, e23, n9) {
                    return "in" === e23 ? new Zt(t69, n9) : new te(t69, n9);
                }
                matches(t70) {
                    const e = t70.data.field(this.field);
                    return "!=" === this.op ? null !== e && this.P(Dt(e, this.value)) : null !== e && vt(this.value) === vt(e) && this.P(Dt(e, this.value));
                }
                P(t71) {
                    switch(this.op){
                        case "<":
                            return t71 < 0;
                        case "<=":
                            return t71 <= 0;
                        case "==":
                            return 0 === t71;
                        case "!=":
                            return 0 !== t71;
                        case ">":
                            return t71 > 0;
                        case ">=":
                            return t71 >= 0;
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
                matches(t73) {
                    const e = Pt.comparator(t73.key, this.key);
                    return this.P(e);
                }
            }
            class Zt extends Jt {
                constructor(t, e){
                    super(t, "in", e), this.keys = ee("in", e);
                }
                matches(t74) {
                    return this.keys.some((e)=>e.isEqual(t74.key)
                    );
                }
            }
            class te extends Jt {
                constructor(t, e){
                    super(t, "not-in", e), this.keys = ee("not-in", e);
                }
                matches(t75) {
                    return !this.keys.some((e)=>e.isEqual(t75.key)
                    );
                }
            }
            function ee(t76, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>Pt.fromName(t.referenceValue)
                );
            }
            class ne extends Jt {
                constructor(t, e){
                    super(t, "array-contains", e);
                }
                matches(t77) {
                    const e = t77.data.field(this.field);
                    return Ot(e) && St(e.arrayValue, this.value);
                }
            }
            class se extends Jt {
                constructor(t, e){
                    super(t, "in", e);
                }
                matches(t78) {
                    const e = t78.data.field(this.field);
                    return null !== e && St(this.value.arrayValue, e);
                }
            }
            class ie extends Jt {
                constructor(t, e){
                    super(t, "not-in", e);
                }
                matches(t79) {
                    if (St(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t79.data.field(this.field);
                    return null !== e && !St(this.value.arrayValue, e);
                }
            }
            class re extends Jt {
                constructor(t, e){
                    super(t, "array-contains-any", e);
                }
                matches(t80) {
                    const e = t80.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>St(this.value.arrayValue, t)
                    );
                }
            }
            class oe {
                constructor(t, e){
                    this.position = t, this.before = e;
                }
            }
            function ce(t81) {
                return `${t81.before ? "b" : "a"}:${t81.position.map((t)=>Nt(t)
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
                const e25 = q(t);
                if (null === e25.V) {
                    var t82;
                    e25.V = [];
                    const t83 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(e25), n = (t82 = e25).explicitOrderBy.length > 0 ? t82.explicitOrderBy[0].field : null;
                    if (null !== t83 && null === n) t83.isKeyField() || e25.V.push(new ae(t83)), e25.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t = !1;
                        for (const n of e25.explicitOrderBy)e25.V.push(n), n.field.isKeyField() && (t = !0);
                        if (!t) {
                            const t = e25.explicitOrderBy.length > 0 ? e25.explicitOrderBy[e25.explicitOrderBy.length - 1].dir : "asc";
                            e25.V.push(new ae(ft.keyField(), t));
                        }
                    }
                }
                return e25.V;
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
                    const n11 = e.endAt ? new oe(e.endAt.position, !e.endAt.before) : null, s = e.startAt ? new oe(e.startAt.position, !e.startAt.before) : null;
                    e.S = Qt(e.path, e.collectionGroup, t, e.filters, e.limit, n11, s);
                }
                return e.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t85) {
                var t84;
                let e26;
                return `Query(target=${e26 = (t84 = Ee(t85)).path.canonicalString(), null !== t84.collectionGroup && (e26 += " collectionGroup=" + t84.collectionGroup), t84.filters.length > 0 && (e26 += `, filters: [${t84.filters.map((t)=>{
                    var e;
                    return `${(e = t).field.canonicalString()} ${e.op} ${Nt(e.value)}`;
                }).join(", ")}]`), At(t84.limit) || (e26 += ", limit: " + t84.limit), t84.orderBy.length > 0 && (e26 += `, orderBy: [${t84.orderBy.map((t)=>{
                    var t86;
                    return t86 = t, `${t86.field.canonicalString()} (${t86.dir})`;
                }).join(", ")}]`), t84.startAt && (e26 += ", startAt: " + ce(t84.startAt)), t84.endAt && (e26 += ", endAt: " + ce(t84.endAt)), `Target(${e26})`}; limitType=${t85.limitType})`;
            }
            function Pe(t88, e28) {
                var t87, e27;
                return e28.isFoundDocument() && (function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                })(t88, e28) && (function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                })(t88, e28) && (function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                })(t88, e28) && (t87 = t88, e27 = e28, (!t87.startAt || !!he(t87.startAt, Te(t87), e27)) && !(t87.endAt && he(t87.endAt, Te(t87), e27)));
            }
            function ve(t89) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t89)){
                        const t = Ve(i, e, n);
                        if (0 !== t) return t;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            function Ve(t90, e29, n12) {
                const s2 = t90.field.isKeyField() ? Pt.comparator(e29.key, n12.key) : function(t, e, n) {
                    const s = e.data.field(t), i = n.data.field(t);
                    return null !== s && null !== i ? Dt(s, i) : L();
                }(t90.field, e29, n12);
                switch(t90.dir){
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
            function xe(t91, e30, n13) {
                return t91 instanceof Oe ? (function(t, e) {
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
                })(n13, e30) : t91 instanceof Fe ? Me(t91, e30) : t91 instanceof Le ? Be(t91, e30) : (function(t, e) {
                    const n = $e(t, e), s = qe(n) + qe(t.C);
                    return $t(n) && $t(t.C) ? De(s) : Se(t.N, s);
                })(t91, e30);
            }
            function ke(t, e, n) {
                return t instanceof Fe ? Me(t, e) : t instanceof Le ? Be(t, e) : n;
            }
            function $e(t, e) {
                var n, t92;
                return t instanceof Ue ? $t(n = e) || (t92 = n) && "doubleValue" in t92 ? e : {
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
            function Me(t93, e) {
                const n = Ke(e);
                for (const e31 of t93.elements)n.some((t)=>Vt(t, e31)
                ) || n.push(e31);
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
            function Be(t94, e) {
                let n = Ke(e);
                for (const e32 of t94.elements)n = n.filter((t)=>!Vt(t, e32)
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
                static exists(t97) {
                    return new Ge(void 0, t97);
                }
                static updateTime(t95) {
                    return new Ge(t95);
                }
                get isNone() {
                    return void 0 === this.updateTime && void 0 === this.exists;
                }
                isEqual(t96) {
                    return this.exists === t96.exists && (this.updateTime ? !!t96.updateTime && this.updateTime.isEqual(t96.updateTime) : !t96.updateTime);
                }
            }
            function ze(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            class He {
            }
            function Je(t98, e33, n14) {
                t98 instanceof en ? (function(t, e, n) {
                    const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                    s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                })(t98, e33, n14) : t98 instanceof nn ? (function(t, e, n) {
                    if (!ze(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                    const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                })(t98, e33, n14) : (function(t, e, n) {
                    e.convertToNoDocument(n.version).setHasCommittedMutations();
                })(0, e33, n14);
            }
            function Ye(t100, e35, n15) {
                var t99, e34;
                t100 instanceof en ? (function(t, e, n) {
                    if (ze(t.precondition, e)) {
                        const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                        s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                    }
                })(t100, e35, n15) : t100 instanceof nn ? (function(t, e, n) {
                    if (ze(t.precondition, e)) {
                        const s = on(t.fieldTransforms, n, e), i = e.data;
                        i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                    }
                })(t100, e35, n15) : (t99 = t100, e34 = e35, ze(t99.precondition, e34) && e34.convertToNoDocument(rt.min()));
            }
            function Ze(t104, e39) {
                var t101, e36;
                return t104.type === e39.type && !!t104.key.isEqual(e39.key) && !!t104.precondition.isEqual(e39.precondition) && (t101 = t104.fieldTransforms, e36 = e39.fieldTransforms, !!(void 0 === t101 && void 0 === e36 || !(!t101 || !e36) && nt(t101, e36, (t, e)=>{
                    var t102, e37, t103, e38;
                    return t102 = t, e37 = e, t102.field.isEqual(e37.field) && (t103 = t102.transform, e38 = e37.transform, t103 instanceof Fe && e38 instanceof Fe || t103 instanceof Le && e38 instanceof Le ? nt(t103.elements, e38.elements, Vt) : t103 instanceof Ue && e38 instanceof Ue ? Vt(t103.C, e38.C) : t103 instanceof Oe && e38 instanceof Oe);
                })) && (0 === t104.type ? t104.value.isEqual(e39.value) : 1 !== t104.type || t104.data.isEqual(e39.data) && t104.fieldMask.isEqual(e39.fieldMask)));
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
            (ln = hn || (hn = {
            }))[ln.OK = 0] = "OK", ln[ln.CANCELLED = 1] = "CANCELLED", ln[ln.UNKNOWN = 2] = "UNKNOWN", ln[ln.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ln[ln.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ln[ln.NOT_FOUND = 5] = "NOT_FOUND", ln[ln.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ln[ln.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ln[ln.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ln[ln.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ln[ln.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ln[ln.ABORTED = 10] = "ABORTED", ln[ln.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ln[ln.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ln[ln.INTERNAL = 13] = "INTERNAL", ln[ln.UNAVAILABLE = 14] = "UNAVAILABLE", ln[ln.DATA_LOSS = 15] = "DATA_LOSS";
            class wn {
                constructor(t, e){
                    this.comparator = t, this.root = e || mn.EMPTY;
                }
                insert(t113, e40) {
                    return new wn(this.comparator, this.root.insert(t113, e40, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                remove(t105) {
                    return new wn(this.comparator, this.root.remove(t105, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                get(t106) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n = this.comparator(t106, e.key);
                        if (0 === n) return e.value;
                        n < 0 ? e = e.left : n > 0 && (e = e.right);
                    }
                    return null;
                }
                indexOf(t107) {
                    let e = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const s = this.comparator(t107, n.key);
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
                inorderTraversal(t108) {
                    return this.root.inorderTraversal(t108);
                }
                forEach(t109) {
                    this.inorderTraversal((e, n)=>(t109(e, n), !1)
                    );
                }
                toString() {
                    const t = [];
                    return this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)
                    ), `{${t.join(", ")}}`;
                }
                reverseTraversal(t110) {
                    return this.root.reverseTraversal(t110);
                }
                getIterator() {
                    return new _n(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t111) {
                    return new _n(this.root, t111, this.comparator, !1);
                }
                getReverseIterator() {
                    return new _n(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t112) {
                    return new _n(this.root, t112, this.comparator, !0);
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
                copy(t122, e45, n18, s3, i2) {
                    return new mn(null != t122 ? t122 : this.key, null != e45 ? e45 : this.value, null != n18 ? n18 : this.color, null != s3 ? s3 : this.left, null != i2 ? i2 : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(t114) {
                    return this.left.inorderTraversal(t114) || t114(this.key, this.value) || this.right.inorderTraversal(t114);
                }
                reverseTraversal(t115) {
                    return this.right.reverseTraversal(t115) || t115(this.key, this.value) || this.left.reverseTraversal(t115);
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
                insert(t116, e41, n16) {
                    let s = this;
                    const i = n16(t116, s.key);
                    return (s = i < 0 ? s.copy(null, null, null, s.left.insert(t116, e41, n16), null) : 0 === i ? s.copy(null, e41, null, null, null) : s.copy(null, null, null, null, s.right.insert(t116, e41, n16))).fixUp();
                }
                removeMin() {
                    if (this.left.isEmpty()) return mn.EMPTY;
                    let t = this;
                    return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), (t = t.copy(null, null, null, t.left.removeMin(), null)).fixUp();
                }
                remove(t117, e42) {
                    let n, s = this;
                    if (0 > e42(t117, s.key)) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t117, e42), null);
                    else {
                        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e42(t117, s.key)) {
                            if (s.right.isEmpty()) return mn.EMPTY;
                            n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
                        }
                        s = s.copy(null, null, null, null, s.right.remove(t117, e42));
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
                insert(t118, e43, n17) {
                    return new mn(t118, e43);
                }
                remove(t119, e44) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(t120) {
                    return !1;
                }
                reverseTraversal(t121) {
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
                has(t132) {
                    return null !== this.data.get(t132);
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
                indexOf(t123) {
                    return this.data.indexOf(t123);
                }
                forEach(t124) {
                    this.data.inorderTraversal((e, n)=>(t124(e), !1)
                    );
                }
                forEachInRange(t125, e47) {
                    const n = this.data.getIteratorFrom(t125[0]);
                    for(; n.hasNext();){
                        const s = n.getNext();
                        if (this.comparator(s.key, t125[1]) >= 0) return;
                        e47(s.key);
                    }
                }
                forEachWhile(t126, e46) {
                    let n;
                    for(n = void 0 !== e46 ? this.data.getIteratorFrom(e46) : this.data.getIterator(); n.hasNext();)if (!t126(n.getNext().key)) return;
                }
                firstAfterOrEqual(t127) {
                    const e = this.data.getIteratorFrom(t127);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new yn(this.data.getIterator());
                }
                getIteratorFrom(t128) {
                    return new yn(this.data.getIteratorFrom(t128));
                }
                add(t129) {
                    return this.copy(this.data.remove(t129).insert(t129, !0));
                }
                delete(t130) {
                    return this.has(t130) ? this.copy(this.data.remove(t130)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(t131) {
                    let e = this;
                    return e.size < t131.size && (e = t131, t131 = this), t131.forEach((t)=>{
                        e = e.add(t);
                    }), e;
                }
                isEqual(t134) {
                    if (!(t134 instanceof gn)) return !1;
                    if (this.size !== t134.size) return !1;
                    const e = this.data.getIterator(), n = t134.data.getIterator();
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
                copy(t133) {
                    const e = new gn(this.comparator);
                    return e.data = t133, e;
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
                static createSynthesizedRemoteEventForCurrentChange(t135, e48) {
                    const n = new Map;
                    return n.set(t135, Dn.createSynthesizedTargetChangeForCurrentChange(t135, e48)), new Sn(rt.min(), n, Vn(), Tn(), Pn());
                }
            }
            class Dn {
                constructor(t, e, n, s, i){
                    this.resumeToken = t, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
                }
                static createSynthesizedTargetChangeForCurrentChange(t136, e49) {
                    return new Dn(_t.EMPTY_BYTE_STRING, e49, Pn(), Pn(), Pn());
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
                j(t139) {
                    t139.approximateByteSize() > 0 && (this.U = !0, this.L = t139);
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
                H(t137, e51) {
                    this.U = !0, this.M = this.M.insert(t137, e51);
                }
                J(t138) {
                    this.U = !0, this.M = this.M.remove(t138);
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
                rt(t144) {
                    for (const e of t144.k)t144.$ && t144.$.isFoundDocument() ? this.ot(e, t144.$) : this.ct(e, t144.key, t144.$);
                    for (const e50 of t144.removedTargetIds)this.ct(e50, t144.key, t144.$);
                }
                at(t140) {
                    this.forEachTarget(t140, (e)=>{
                        const n = this.ut(e);
                        switch(t140.state){
                            case 0:
                                this.ht(e) && n.j(t140.resumeToken);
                                break;
                            case 1:
                                n.X(), n.q || n.G(), n.j(t140.resumeToken);
                                break;
                            case 2:
                                n.X(), n.q || this.removeTarget(e);
                                break;
                            case 3:
                                this.ht(e) && (n.Z(), n.j(t140.resumeToken));
                                break;
                            case 4:
                                this.ht(e) && (this.lt(e), n.j(t140.resumeToken));
                                break;
                            default:
                                L();
                        }
                    });
                }
                forEachTarget(t141, e53) {
                    t141.targetIds.length > 0 ? t141.targetIds.forEach(e53) : this.et.forEach((t, n)=>{
                        this.ht(n) && e53(n);
                    });
                }
                ft(t142) {
                    const e = t142.targetId, n = t142.O.count, s = this.dt(e);
                    if (s) {
                        const t = s.target;
                        if (Ht(t)) if (0 === n) {
                            const n = new Pt(t.path);
                            this.ct(e, n, Kt.newNoDocument(n, rt.min()));
                        } else B(1 === n);
                        else this.wt(e) !== n && (this.lt(e), this.it = this.it.add(e));
                    }
                }
                _t(t143) {
                    const e52 = new Map;
                    this.et.forEach((n, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n.current && Ht(i.target)) {
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t143));
                            }
                            n.K && (e52.set(s, n.W()), n.G());
                        }
                    });
                    let n19 = Pn();
                    this.st.forEach((t145, e54)=>{
                        let s = !0;
                        e54.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return !e || 2 === e.purpose || (s = !1, !1);
                        }), s && (n19 = n19.add(t145));
                    });
                    const s4 = new Sn(t143, e52, this.it, this.nt, n19);
                    return this.nt = Tn(), this.st = On(), this.it = new gn(et), s4;
                }
                ot(t156, e56) {
                    if (this.ht(t156)) {
                        const n = this.gt(t156, e56.key) ? 2 : 0;
                        this.ut(t156).H(e56.key, n), this.nt = this.nt.insert(e56.key, e56), this.st = this.st.insert(e56.key, this.yt(e56.key).add(t156));
                    }
                }
                ct(t146, e55, n20) {
                    if (this.ht(t146)) {
                        const s = this.ut(t146);
                        this.gt(t146, e55) ? s.H(e55, 1) : s.J(e55), this.st = this.st.insert(e55, this.yt(e55).delete(t146)), n20 && (this.nt = this.nt.insert(e55, n20));
                    }
                }
                removeTarget(t147) {
                    this.et.delete(t147);
                }
                wt(t148) {
                    const e = this.ut(t148).W();
                    return this.tt.getRemoteKeysForTarget(t148).size + e.addedDocuments.size - e.removedDocuments.size;
                }
                Y(t149) {
                    this.ut(t149).Y();
                }
                ut(t150) {
                    let e = this.et.get(t150);
                    return e || (e = new kn, this.et.set(t150, e)), e;
                }
                yt(t151) {
                    let e = this.st.get(t151);
                    return e || (e = new gn(et), this.st = this.st.insert(t151, e)), e;
                }
                ht(t152) {
                    const e = null !== this.dt(t152);
                    return e || $("WatchChangeAggregator", "Detected inactive target", t152), e;
                }
                dt(t153) {
                    const e = this.et.get(t153);
                    return e && e.q ? null : this.tt.Tt(t153);
                }
                lt(t154) {
                    this.et.set(t154, new kn), this.tt.getRemoteKeysForTarget(t154).forEach((e)=>{
                        this.ct(t154, e, null);
                    });
                }
                gt(t155, e57) {
                    return this.tt.getRemoteKeysForTarget(t155).has(e57);
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
            function jn(t157) {
                return B(!!t157), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t157));
            }
            function Qn(t, e) {
                var t158;
                return (t158 = t, new ht([
                    "projects",
                    t158.projectId,
                    "databases",
                    t158.database
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
            function ss(t160, e59) {
                var t159, e58;
                let n21;
                if (e59 instanceof en) n21 = {
                    update: Zn(t160, e59.key, e59.value)
                };
                else if (e59 instanceof cn) n21 = {
                    delete: Gn(t160, e59.key)
                };
                else if (e59 instanceof nn) n21 = {
                    update: Zn(t160, e59.key, e59.data),
                    updateMask: ps(e59.fieldMask)
                };
                else {
                    if (!(e59 instanceof an)) return L();
                    n21 = {
                        verify: Gn(t160, e59.key)
                    };
                }
                return e59.fieldTransforms.length > 0 && (n21.updateTransforms = e59.fieldTransforms.map((t)=>(function(t, e) {
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
                )), e59.precondition.isNone || (n21.currentDocument = (t159 = t160, void 0 !== (e58 = e59.precondition).updateTime ? {
                    updateTime: Un(t159, e58.updateTime.toTimestamp())
                } : void 0 !== e58.exists ? {
                    exists: e58.exists
                } : L())), n21;
            }
            function is(t162, e60) {
                var t161;
                const n22 = e60.currentDocument ? void 0 !== (t161 = e60.currentDocument).updateTime ? Ge.updateTime(jn(t161.updateTime)) : void 0 !== t161.exists ? Ge.exists(t161.exists) : Ge.none() : Ge.none(), s5 = e60.updateTransforms ? e60.updateTransforms.map((e61)=>(function(t, e) {
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
                    })(t162, e61)
                ) : [];
                if (e60.update) {
                    e60.update.name;
                    const i = zn(t162, e60.update.name), r = new Ut({
                        mapValue: {
                            fields: e60.update.fields
                        }
                    });
                    if (e60.updateMask) {
                        const t163 = function(t164) {
                            const e = t164.fieldPaths || [];
                            return new dt(e.map((t)=>ft.fromServerFormat(t)
                            ));
                        }(e60.updateMask);
                        return new nn(i, r, t163, n22, s5);
                    }
                    return new en(i, r, n22, s5);
                }
                if (e60.delete) {
                    const s = zn(t162, e60.delete);
                    return new cn(s, n22);
                }
                if (e60.verify) {
                    const s = zn(t162, e60.verify);
                    return new an(s, n22);
                }
                return L();
            }
            function hs(t165) {
                return t165 ? void 0 !== t165.unaryFilter ? [
                    ys(t165)
                ] : void 0 !== t165.fieldFilter ? [
                    gs(t165)
                ] : void 0 !== t165.compositeFilter ? t165.compositeFilter.filters.map((t)=>hs(t)
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
            function gs(t166) {
                return Jt.create(ms(t166.fieldFilter.field), function(t) {
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
                }(t166.fieldFilter.op), t166.fieldFilter.value);
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
            function ps(t167) {
                const e = [];
                return t167.fields.forEach((t)=>e.push(t.canonicalString())
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
                for(let e62 = 0; e62 < s; e62++){
                    const s = t.charAt(e62);
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
                const s = [];
                let i = "";
                for(let r = 0; r < e;){
                    const e = t.indexOf("\x01", r);
                    switch((e < 0 || e > n) && L(), t.charAt(e + 1)){
                        case "\x01":
                            const n = t.substring(r, e);
                            let o;
                            0 === i.length ? o = n : (o = i += n, i = ""), s.push(o);
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
                constructor(){
                }
                static prefixForUser(t170) {
                    return [
                        t170
                    ];
                }
                static prefixForPath(t168, e64) {
                    return [
                        t168,
                        Es(e64)
                    ];
                }
                static key(t169, e63, n23) {
                    return [
                        t169,
                        Es(e63),
                        n23
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
            Bs.store = "namedQueries", Bs.keyPath = "name";
            class Ks {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(t171) {
                    this.onCommittedListeners.push(t171);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((t)=>t()
                    );
                }
            }
            class js {
                constructor(t172){
                    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, t172((t)=>{
                        this.isDone = !0, this.result = t, this.nextCallback && this.nextCallback(t);
                    }, (t)=>{
                        this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t174) {
                    return this.next(void 0, t174);
                }
                next(t173, e65) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e65, this.error) : this.wrapSuccess(t173, this.result) : new js((n, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t173, e).next(n, s);
                        }, this.catchCallback = (t)=>{
                            this.wrapFailure(e65, t).next(n, s);
                        };
                    });
                }
                toPromise() {
                    return new Promise((t, e)=>{
                        this.next(t, e);
                    });
                }
                wrapUserFunction(t180) {
                    try {
                        const e = t180();
                        return e instanceof js ? e : js.resolve(e);
                    } catch (t) {
                        return js.reject(t);
                    }
                }
                wrapSuccess(t175, e67) {
                    return t175 ? this.wrapUserFunction(()=>t175(e67)
                    ) : js.resolve(e67);
                }
                wrapFailure(t176, e66) {
                    return t176 ? this.wrapUserFunction(()=>t176(e66)
                    ) : js.reject(e66);
                }
                static resolve(t177) {
                    return new js((e, n)=>{
                        e(t177);
                    });
                }
                static reject(t178) {
                    return new js((e, n)=>{
                        n(t178);
                    });
                }
                static waitFor(t179) {
                    return new js((e, n)=>{
                        let s = 0, i = 0, r = !1;
                        t179.forEach((t181)=>{
                            ++s, t181.next(()=>{
                                ++i, r && i === s && e();
                            }, (t)=>n(t)
                            );
                        }), r = !0, i === s && e();
                    });
                }
                static or(t182) {
                    let e = js.resolve(!1);
                    for (const n of t182)e = e.next((t)=>t ? js.resolve(t) : n()
                    );
                    return e;
                }
                static forEach(t183, e68) {
                    const n = [];
                    return t183.forEach((t, s)=>{
                        n.push(e68.call(this, t, s));
                    }), this.waitFor(n);
                }
            }
            class Qs {
                constructor(t, e69){
                    this.action = t, this.transaction = e69, this.aborted = !1, this.Et = new Q, this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }, this.transaction.onabort = ()=>{
                        e69.error ? this.Et.reject(new zs(t, e69.error)) : this.Et.resolve();
                    }, this.transaction.onerror = (e)=>{
                        const n = Zs(e.target.error);
                        this.Et.reject(new zs(t, n));
                    };
                }
                static open(t186, e70, n24, s6) {
                    try {
                        return new Qs(e70, t186.transaction(s6, n24));
                    } catch (t) {
                        throw new zs(e70, t);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(t184) {
                    t184 && this.Et.reject(t184), this.aborted || ($("SimpleDb", "Aborting transaction:", t184 ? t184.message : "Client-initiated abort"), this.aborted = !0, this.transaction.abort());
                }
                store(t185) {
                    const e = this.transaction.objectStore(t185);
                    return new Js(e);
                }
            }
            class Ws {
                constructor(t, e, n){
                    this.name = t, this.version = e, this.At = n, 12.2 === Ws.Rt(getUA()) && O("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(t191) {
                    return $("SimpleDb", "Removing database:", t191), Ys(window.indexedDB.deleteDatabase(t191)).toPromise();
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
                static St(t187, e71) {
                    return t187.store(e71);
                }
                static Rt(t188) {
                    const e = t188.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = e ? e[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                static vt(t189) {
                    const e = t189.match(/Android ([\d.]+)/i), n = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                async Dt(t190) {
                    return this.db || ($("SimpleDb", "Opening database:", this.name), this.db = await new Promise((e72, n25)=>{
                        const s7 = indexedDB.open(this.name, this.version);
                        s7.onsuccess = (t)=>{
                            const n = t.target.result;
                            e72(n);
                        }, s7.onblocked = ()=>{
                            n25(new zs(t190, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }, s7.onerror = (e)=>{
                            const s = e.target.error;
                            "VersionError" === s.name ? n25(new j(K.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n25(new j(K.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n25(new zs(t190, s));
                        }, s7.onupgradeneeded = (t)=>{
                            $("SimpleDb", "Database \"" + this.name + "\" requires upgrade from version:", t.oldVersion);
                            const e = t.target.result;
                            this.At.Ct(e, s7.transaction, t.oldVersion, this.version).next(()=>{
                                $("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        };
                    })), this.Nt && (this.db.onversionchange = (t)=>this.Nt(t)
                    ), this.db;
                }
                xt(t193) {
                    this.Nt = t193, this.db && (this.db.onversionchange = (e)=>t193(e)
                    );
                }
                async runTransaction(t192, e73, n27, s8) {
                    const i = "readonly" === e73;
                    let r = 0;
                    for(;;){
                        ++r;
                        try {
                            this.db = await this.Dt(t192);
                            const e = Qs.open(this.db, t192, i ? "readonly" : "readwrite", n27), r = s8(e).catch((t)=>(e.abort(t), js.reject(t))
                            ).toPromise();
                            return r.catch(()=>{
                            }), await e.It, r;
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
                set cursor(t195) {
                    this.kt = t195;
                }
                done() {
                    this.$t = !0;
                }
                Mt(t194) {
                    this.Ot = t194;
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
                put(t203, e74) {
                    let n;
                    return void 0 !== e74 ? ($("SimpleDb", "PUT", this.store.name, t203, e74), n = this.store.put(e74, t203)) : ($("SimpleDb", "PUT", this.store.name, "<auto-key>", t203), n = this.store.put(t203)), Ys(n);
                }
                add(t196) {
                    return $("SimpleDb", "ADD", this.store.name, t196, t196), Ys(this.store.add(t196));
                }
                get(t197) {
                    return Ys(this.store.get(t197)).next((e)=>(void 0 === e && (e = null), $("SimpleDb", "GET", this.store.name, t197, e), e)
                    );
                }
                delete(t198) {
                    return $("SimpleDb", "DELETE", this.store.name, t198), Ys(this.store.delete(t198));
                }
                count() {
                    return $("SimpleDb", "COUNT", this.store.name), Ys(this.store.count());
                }
                Lt(t199, e75) {
                    const n = this.cursor(this.options(t199, e75)), s = [];
                    return this.Bt(n, (t, e)=>{
                        s.push(e);
                    }).next(()=>s
                    );
                }
                Ut(t200, e78) {
                    $("SimpleDb", "DELETE ALL", this.store.name);
                    const n26 = this.options(t200, e78);
                    n26.qt = !1;
                    const s = this.cursor(n26);
                    return this.Bt(s, (t, e, n)=>n.delete()
                    );
                }
                Kt(t201, e76) {
                    let n;
                    e76 ? n = t201 : (n = {
                    }, e76 = t201);
                    const s = this.cursor(n);
                    return this.Bt(s, e76);
                }
                jt(t202) {
                    const e77 = this.cursor({
                    });
                    return new js((n, s9)=>{
                        e77.onerror = (t)=>{
                            const e = Zs(t.target.error);
                            s9(e);
                        }, e77.onsuccess = (e)=>{
                            const s = e.target.result;
                            s ? t202(s.primaryKey, s.value).next((t)=>{
                                t ? s.continue() : n();
                            }) : n();
                        };
                    });
                }
                Bt(t204, e80) {
                    const n = [];
                    return new js((s, i3)=>{
                        t204.onerror = (t)=>{
                            i3(t.target.error);
                        }, t204.onsuccess = (t)=>{
                            const i = t.target.result;
                            if (!i) return void s();
                            const r = new Gs(i), o = e80(i.primaryKey, i.value, r);
                            if (o instanceof js) {
                                const t205 = o.catch((t)=>(r.done(), js.reject(t))
                                );
                                n.push(t205);
                            }
                            r.isDone ? s() : null === r.Ft ? i.continue() : i.continue(r.Ft);
                        };
                    }).next(()=>js.waitFor(n)
                    );
                }
                options(t207, e79) {
                    let n;
                    return void 0 !== t207 && ("string" == typeof t207 ? n = t207 : e79 = t207), {
                        index: n,
                        range: e79
                    };
                }
                cursor(t206) {
                    let e = "next";
                    if (t206.reverse && (e = "prev"), t206.index) {
                        const n = this.store.index(t206.index);
                        return t206.qt ? n.openKeyCursor(t206.range, e) : n.openCursor(t206.range, e);
                    }
                    return this.store.openCursor(t206.range, e);
                }
            }
            function Ys(t208) {
                return new js((e81, n28)=>{
                    t208.onsuccess = (t)=>{
                        const n = t.target.result;
                        e81(n);
                    }, t208.onerror = (t)=>{
                        const e = Zs(t.target.error);
                        n28(e);
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
                applyToRemoteDocument(t211, e84) {
                    const n = e84.mutationResults;
                    for(let e82 = 0; e82 < this.mutations.length; e82++){
                        const s = this.mutations[e82];
                        s.key.isEqual(t211.key) && Je(s, t211, n[e82]);
                    }
                }
                applyToLocalView(t209) {
                    for (const e of this.baseMutations)e.key.isEqual(t209.key) && Ye(e, t209, this.localWriteTime);
                    for (const e83 of this.mutations)e83.key.isEqual(t209.key) && Ye(e83, t209, this.localWriteTime);
                }
                applyToLocalDocumentSet(t210) {
                    this.mutations.forEach((e)=>{
                        const n = t210.get(e.key), s = n;
                        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key)
                    , Pn());
                }
                isEqual(t212) {
                    return this.batchId === t212.batchId && nt(this.mutations, t212.mutations, (t, e)=>Ze(t, e)
                    ) && nt(this.baseMutations, t212.baseMutations, (t, e)=>Ze(t, e)
                    );
                }
            }
            class si {
                constructor(t, e, n, s){
                    this.batch = t, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
                }
                static from(t214, e85, n29) {
                    B(t214.mutations.length === n29.length);
                    let s = Rn();
                    const i = t214.mutations;
                    for(let t213 = 0; t213 < i.length; t213++)s = s.insert(i[t213].key, n29[t213].version);
                    return new si(t214, e85, n29, s);
                }
            }
            class ii {
                constructor(t, e, n, s, i = rt.min(), r = rt.min(), o = _t.EMPTY_BYTE_STRING){
                    this.target = t, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
                }
                withSequenceNumber(t218) {
                    return new ii(this.target, this.targetId, this.purpose, t218, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(t215, e86) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, e86, this.lastLimboFreeSnapshotVersion, t215);
                }
                withLastLimboFreeSnapshotVersion(t216) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t216, this.resumeToken);
                }
            }
            function fi(t, e87) {
                const n = (e87.baseMutations || []).map((e)=>is(t.Wt, e)
                );
                for(let t217 = 0; t217 < e87.mutations.length - 1; ++t217){
                    const n = e87.mutations[t217];
                    if (t217 + 1 < e87.mutations.length && void 0 !== e87.mutations[t217 + 1].transform) {
                        const s = e87.mutations[t217 + 1];
                        n.updateTransforms = s.transform.fieldTransforms, e87.mutations.splice(t217 + 1, 1), ++t217;
                    }
                }
                const s = e87.mutations.map((e)=>is(t.Wt, e)
                ), i = it.fromMillis(e87.localWriteTimeMs);
                return new ni(e87.batchId, i, n, s);
            }
            class Ri {
                constructor(t, e, n){
                    this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
                }
                static withCacheSize(t219) {
                    return new Ri(t219, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            class vi {
                constructor(t, e, n, s){
                    this.userId = t, this.N = e, this.Ht = n, this.referenceDelegate = s, this.Jt = {
                    };
                }
                static Yt(t222, e89, n31, s10) {
                    B("" !== t222.uid);
                    const i = t222.isAuthenticated() ? t222.uid : "";
                    return new vi(i, e89, n31, s10);
                }
                checkEmpty(t220) {
                    let e = !0;
                    const n = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return Si(t220).Kt({
                        index: Vs.userMutationsIndex,
                        range: n
                    }, (t, n, s)=>{
                        e = !1, s.done();
                    }).next(()=>e
                    );
                }
                addMutationBatch(t221, e88, n30, s11) {
                    const i4 = Di(t221), r = Si(t221);
                    return r.add({
                    }).next((o)=>{
                        B("number" == typeof o);
                        const c = new ni(o, e88, n30, s11), a = function(t, e90, n) {
                            const s = n.baseMutations.map((e)=>ss(t.Wt, e)
                            ), i = n.mutations.map((e)=>ss(t.Wt, e)
                            );
                            return new Vs(e90, n.batchId, n.localWriteTime.toMillis(), s, i);
                        }(this.N, this.userId, c), u = [];
                        let h = new gn((t, e)=>et(t.canonicalString(), e.canonicalString())
                        );
                        for (const t223 of s11){
                            const e = Ss.key(this.userId, t223.key.path, o);
                            h = h.add(t223.key.path.popLast()), u.push(r.put(a)), u.push(i4.put(e, Ss.PLACEHOLDER));
                        }
                        return h.forEach((e)=>{
                            u.push(this.Ht.addToCollectionParentIndex(t221, e));
                        }), t221.addOnCommittedListener(()=>{
                            this.Jt[o] = c.keys();
                        }), js.waitFor(u).next(()=>c
                        );
                    });
                }
                lookupMutationBatch(t224, e93) {
                    return Si(t224).get(e93).next((t)=>t ? (B(t.userId === this.userId), fi(this.N, t)) : null
                    );
                }
                Xt(t225, e91) {
                    return this.Jt[e91] ? js.resolve(this.Jt[e91]) : this.lookupMutationBatch(t225, e91).next((t)=>{
                        if (t) {
                            const n = t.keys();
                            return this.Jt[e91] = n, n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(t228, e92) {
                    const n = e92 + 1, s12 = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let i = null;
                    return Si(t228).Kt({
                        index: Vs.userMutationsIndex,
                        range: s12
                    }, (t, e, s)=>{
                        e.userId === this.userId && (B(e.batchId >= n), i = fi(this.N, e)), s.done();
                    }).next(()=>i
                    );
                }
                getHighestUnacknowledgedBatchId(t226) {
                    const e94 = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    let n = -1;
                    return Si(t226).Kt({
                        index: Vs.userMutationsIndex,
                        range: e94,
                        reverse: !0
                    }, (t, e, s)=>{
                        n = e.batchId, s.done();
                    }).next(()=>n
                    );
                }
                getAllMutationBatches(t227) {
                    const e = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return Si(t227).Lt(Vs.userMutationsIndex, e).next((t229)=>t229.map((t)=>fi(this.N, t)
                        )
                    );
                }
                getAllMutationBatchesAffectingDocumentKey(t230, e96) {
                    const n32 = Ss.prefixForPath(this.userId, e96.path), s = IDBKeyRange.lowerBound(n32), i = [];
                    return Di(t230).Kt({
                        range: s
                    }, (n, s, r)=>{
                        const [o, c, a] = n, u = Rs(c);
                        if (o === this.userId && e96.path.isEqual(u)) return Si(t230).get(a).next((t)=>{
                            if (!t) throw L();
                            B(t.userId === this.userId), i.push(fi(this.N, t));
                        });
                        r.done();
                    }).next(()=>i
                    );
                }
                getAllMutationBatchesAffectingDocumentKeys(t231, e95) {
                    let n = new gn(et);
                    const s = [];
                    return e95.forEach((e)=>{
                        const i5 = Ss.prefixForPath(this.userId, e.path), r1 = IDBKeyRange.lowerBound(i5), o1 = Di(t231).Kt({
                            range: r1
                        }, (t, s, i)=>{
                            const [r, o, c] = t, a = Rs(o);
                            r === this.userId && e.path.isEqual(a) ? n = n.add(c) : i.done();
                        });
                        s.push(o1);
                    }), js.waitFor(s).next(()=>this.Zt(t231, n)
                    );
                }
                getAllMutationBatchesAffectingQuery(t232, e98) {
                    const n = e98.path, s = n.length + 1, i6 = Ss.prefixForPath(this.userId, n), r2 = IDBKeyRange.lowerBound(i6);
                    let o = new gn(et);
                    return Di(t232).Kt({
                        range: r2
                    }, (t, e, i)=>{
                        const [r, c, a] = t, u = Rs(c);
                        r === this.userId && n.isPrefixOf(u) ? u.length === s && (o = o.add(a)) : i.done();
                    }).next(()=>this.Zt(t232, o)
                    );
                }
                Zt(t233, e97) {
                    const n = [], s = [];
                    return e97.forEach((e)=>{
                        s.push(Si(t233).get(e).next((t)=>{
                            if (null === t) throw L();
                            B(t.userId === this.userId), n.push(fi(this.N, t));
                        }));
                    }), js.waitFor(s).next(()=>n
                    );
                }
                removeMutationBatch(t235, e99) {
                    return (function(t, e, n33) {
                        const s = t.store(Vs.store), i = t.store(Ss.store), r = [], o = IDBKeyRange.only(n33.batchId);
                        let c = 0;
                        const a = s.Kt({
                            range: o
                        }, (t, e, n)=>(c++, n.delete())
                        );
                        r.push(a.next(()=>{
                            B(1 === c);
                        }));
                        const u = [];
                        for (const t234 of n33.mutations){
                            const s = Ss.key(e, t234.key.path, n33.batchId);
                            r.push(i.delete(s)), u.push(t234.key);
                        }
                        return js.waitFor(r).next(()=>u
                        );
                    })(t235.Qt, this.userId, e99).next((n)=>(t235.addOnCommittedListener(()=>{
                            this.te(e99.batchId);
                        }), js.forEach(n, (e)=>this.referenceDelegate.markPotentiallyOrphaned(t235, e)
                        ))
                    );
                }
                te(t237) {
                    delete this.Jt[t237];
                }
                performConsistencyCheck(t236) {
                    return this.checkEmpty(t236).next((e100)=>{
                        if (!e100) return js.resolve();
                        const n34 = IDBKeyRange.lowerBound(Ss.prefixForUser(this.userId)), s = [];
                        return Di(t236).Kt({
                            range: n34
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
                containsKey(t239, e101) {
                    return Vi(t239, this.userId, e101);
                }
                ee(t238) {
                    return Ci(t238).get(this.userId).next((t)=>t || new vs(this.userId, -1, "")
                    );
                }
            }
            function Vi(t240, e, n) {
                const s13 = Ss.prefixForPath(e, n.path), i = s13[1], r3 = IDBKeyRange.lowerBound(s13);
                let o = !1;
                return Di(t240).Kt({
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
                    this.mapKeyFn = t, this.equalsFn = e, this.inner = {
                    };
                }
                get(t245) {
                    const e = this.mapKeyFn(t245), n = this.inner[e];
                    if (void 0 !== n) {
                        for (const [e102, s] of n)if (this.equalsFn(e102, t245)) return s;
                    }
                }
                has(t241) {
                    return void 0 !== this.get(t241);
                }
                set(t242, e104) {
                    const n = this.mapKeyFn(t242), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let n = 0; n < s.length; n++)if (this.equalsFn(s[n][0], t242)) return void (s[n] = [
                            t242,
                            e104
                        ]);
                        s.push([
                            t242,
                            e104
                        ]);
                    } else this.inner[n] = [
                        [
                            t242,
                            e104
                        ]
                    ];
                }
                delete(t243) {
                    const e = this.mapKeyFn(t243), n = this.inner[e];
                    if (void 0 === n) return !1;
                    for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t243)) return 1 === n.length ? delete this.inner[e] : n.splice(s, 1), !0;
                    return !1;
                }
                forEach(t244) {
                    ct(this.inner, (e, n)=>{
                        for (const [e103, s] of n)t244(e103, s);
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
                getReadTime(t251) {
                    const e = this.changes.get(t251);
                    return e ? e.readTime : rt.min();
                }
                addEntry(t246, e108) {
                    this.assertNotApplied(), this.changes.set(t246.key, {
                        document: t246,
                        readTime: e108
                    });
                }
                removeEntry(t247, e105 = null) {
                    this.assertNotApplied(), this.changes.set(t247, {
                        document: Kt.newInvalidDocument(t247),
                        readTime: e105
                    });
                }
                getEntry(t248, e106) {
                    this.assertNotApplied();
                    const n = this.changes.get(e106);
                    return void 0 !== n ? js.resolve(n.document) : this.getFromCache(t248, e106);
                }
                getEntries(t249, e107) {
                    return this.getAllFromCache(t249, e107);
                }
                apply(t250) {
                    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t250);
                }
                assertNotApplied() {
                }
            }
            class rr {
                constructor(t, e, n){
                    this.He = t, this.In = e, this.Ht = n;
                }
                An(t253, e110) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t253, e110).next((n)=>this.Rn(t253, e110, n)
                    );
                }
                Rn(t252, e109, n35) {
                    return this.He.getEntry(t252, e109).next((t)=>{
                        for (const e of n35)e.applyToLocalView(t);
                        return t;
                    });
                }
                bn(t257, e112) {
                    t257.forEach((t, n)=>{
                        for (const t254 of e112)t254.applyToLocalView(n);
                    });
                }
                Pn(t255, e111) {
                    return this.He.getEntries(t255, e111).next((e)=>this.vn(t255, e).next(()=>e
                        )
                    );
                }
                vn(t256, e115) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t256, e115).next((t)=>this.bn(e115, t)
                    );
                }
                getDocumentsMatchingQuery(t260, e113, n38) {
                    var t258;
                    return (t258 = e113, Pt.isDocumentKey(t258.path) && null === t258.collectionGroup && 0 === t258.filters.length) ? this.Vn(t260, e113.path) : null !== e113.collectionGroup ? this.Sn(t260, e113, n38) : this.Dn(t260, e113, n38);
                }
                Vn(t259, e114) {
                    return this.An(t259, new Pt(e114)).next((t)=>{
                        let e = In();
                        return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
                    });
                }
                Sn(t261, e117, n36) {
                    const s = e117.collectionGroup;
                    let i = In();
                    return this.Ht.getCollectionParents(t261, s).next((r4)=>js.forEach(r4, (r)=>{
                            var t262, e116;
                            const o = (t262 = e117, e116 = r.child(s), new fe(e116, null, t262.explicitOrderBy.slice(), t262.filters.slice(), t262.limit, t262.limitType, t262.startAt, t262.endAt));
                            return this.Dn(t261, o, n36).next((t263)=>{
                                t263.forEach((t, e)=>{
                                    i = i.insert(t, e);
                                });
                            });
                        }).next(()=>i
                        )
                    );
                }
                Dn(t265, e118, n37) {
                    let s, i7;
                    return this.He.getDocumentsMatchingQuery(t265, e118, n37).next((n)=>(s = n, this.In.getAllMutationBatchesAffectingQuery(t265, e118))
                    ).next((e119)=>(i7 = e119, this.Cn(t265, i7, s).next((t)=>{
                            for (const t264 of (s = t, i7))for (const e of t264.mutations){
                                const n = e.key;
                                let i = s.get(n);
                                null == i && (i = Kt.newInvalidDocument(n), s = s.insert(n, i)), Ye(e, i, t264.localWriteTime), i.isFoundDocument() || (s = s.remove(n));
                            }
                        }))
                    ).next(()=>(s.forEach((t, n)=>{
                            Pe(e118, n) || (s = s.remove(t));
                        }), s)
                    );
                }
                Cn(t267, e121, n39) {
                    let s = Pn();
                    for (const t266 of e121)for (const e120 of t266.mutations)e120 instanceof nn && null === n39.get(e120.key) && (s = s.add(e120.key));
                    let i = n39;
                    return this.He.getEntries(t267, s).next((t268)=>(t268.forEach((t, e)=>{
                            e.isFoundDocument() && (i = i.insert(t, e));
                        }), i)
                    );
                }
            }
            class or {
                constructor(t, e, n, s){
                    this.targetId = t, this.fromCache = e, this.Nn = n, this.xn = s;
                }
                static kn(t273, e123) {
                    let n = Pn(), s = Pn();
                    for (const t269 of e123.docChanges)switch(t269.type){
                        case 0:
                            n = n.add(t269.doc.key);
                            break;
                        case 1:
                            s = s.add(t269.doc.key);
                    }
                    return new or(t273, e123.fromCache, n, s);
                }
            }
            class cr {
                $n(t270) {
                    this.On = t270;
                }
                getDocumentsMatchingQuery(t271, e122, n41, s14) {
                    var t272;
                    return 0 === (t272 = e122).filters.length && null === t272.limit && null == t272.startAt && null == t272.endAt && (0 === t272.explicitOrderBy.length || 1 === t272.explicitOrderBy.length && t272.explicitOrderBy[0].field.isKeyField()) || n41.isEqual(rt.min()) ? this.Fn(t271, e122) : this.On.Pn(t271, s14).next((i)=>{
                        const r = this.Mn(e122, i);
                        return (_e(e122) || me(e122)) && this.Ln(e122.limitType, r, s14, n41) ? this.Fn(t271, e122) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n41.toString(), be(e122)), this.On.getDocumentsMatchingQuery(t271, e122, n41).next((t)=>(r.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)
                        ));
                    });
                }
                Mn(t276, e126) {
                    let n = new gn(ve(t276));
                    return e126.forEach((e, s)=>{
                        Pe(t276, s) && (n = n.add(s));
                    }), n;
                }
                Ln(t274, e124, n40, s15) {
                    if (n40.size !== e124.size) return !0;
                    const i = "F" === t274 ? e124.last() : e124.first();
                    return !!i && (i.hasPendingWrites || i.version.compareTo(s15) > 0);
                }
                Fn(t275, e125) {
                    return x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Using full collection scan to execute query:", be(e125)), this.On.getDocumentsMatchingQuery(t275, e125, rt.min());
                }
            }
            class ar {
                constructor(t277, e, n, s){
                    this.persistence = t277, this.Bn = e, this.N = s, this.Un = new wn(et), this.qn = new ji((t)=>Wt(t)
                    , zt), this.Kn = rt.min(), this.In = t277.getMutationQueue(n), this.jn = t277.getRemoteDocumentCache(), this.ze = t277.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t277.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t278) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t278.collect(e, this.Un)
                    );
                }
            }
            async function hr(t279, e129) {
                const n42 = q(t279);
                let s16 = n42.In, i = n42.Qn;
                const r5 = await n42.persistence.runTransaction("Handle user change", "readonly", (t281)=>{
                    let r;
                    return n42.In.getAllMutationBatches(t281).next((o)=>(r = o, s16 = n42.persistence.getMutationQueue(e129), i = new rr(n42.jn, s16, n42.persistence.getIndexManager()), s16.getAllMutationBatches(t281))
                    ).next((e)=>{
                        const n = [], s = [];
                        let o = Pn();
                        for (const t282 of r)for (const e127 of (n.push(t282.batchId), t282.mutations))o = o.add(e127.key);
                        for (const t280 of e)for (const e128 of (s.push(t280.batchId), t280.mutations))o = o.add(e128.key);
                        return i.Pn(t281, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            })
                        );
                    });
                });
                return n42.In = s16, n42.Qn = i, n42.Bn.$n(n42.Qn), r5;
            }
            function fr(t283) {
                const e = q(t283);
                return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t)=>e.ze.getLastRemoteSnapshotVersion(t)
                );
            }
            function _r(t284, e) {
                const n = q(t284);
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (t)=>(void 0 === e && (e = -1), n.In.getNextMutationBatchAfterBatchId(t, e))
                );
            }
            async function gr(t285, e, n) {
                const s = q(t285), i = s.Un.get(e);
                try {
                    n || await s.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t)=>s.persistence.referenceDelegate.removeTarget(t, i)
                    );
                } catch (t) {
                    if (!Hs(t)) throw t;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
                }
                s.Un = s.Un.remove(e), s.qn.delete(i.target);
            }
            function yr(t286, e130, n43) {
                const s17 = q(t286);
                let i8 = rt.min(), r = Pn();
                return s17.persistence.runTransaction("Execute query", "readonly", (t287)=>(function(t, e, n) {
                        const s = q(t), i = s.qn.get(n);
                        return void 0 !== i ? js.resolve(s.Un.get(i)) : s.ze.getTargetData(e, n);
                    })(s17, t287, Ee(e130)).next((e)=>{
                        if (e) return i8 = e.lastLimboFreeSnapshotVersion, s17.ze.getMatchingKeysForTargetId(t287, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>s17.Bn.getDocumentsMatchingQuery(t287, e130, n43 ? i8 : rt.min(), n43 ? r : Pn())
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
                addReference(t289, e134) {
                    const n = new Pr(t289, e134);
                    this.Zn = this.Zn.add(n), this.es = this.es.add(n);
                }
                ss(t288, e131) {
                    t288.forEach((t)=>this.addReference(t, e131)
                    );
                }
                removeReference(t291, e132) {
                    this.rs(new Pr(t291, e132));
                }
                os(t290, e133) {
                    t290.forEach((t)=>this.removeReference(t, e133)
                    );
                }
                cs(t292) {
                    const e = new Pt(new ht([])), n = new Pr(e, t292), s = new Pr(e, t292 + 1), i = [];
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
                rs(t294) {
                    this.Zn = this.Zn.delete(t294), this.es = this.es.delete(t294);
                }
                hs(t293) {
                    const e = new Pt(new ht([])), n = new Pr(e, t293), s = new Pr(e, t293 + 1);
                    let i = Pn();
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        i = i.add(t.key);
                    }), i;
                }
                containsKey(t295) {
                    const e = new Pr(t295, 0), n = this.Zn.firstAfterOrEqual(e);
                    return null !== n && t295.isEqual(n.key);
                }
            }
            class Pr {
                constructor(t, e){
                    this.key = t, this.ls = e;
                }
                static ts(t297, e136) {
                    return Pt.comparator(t297.key, e136.key) || et(t297.ls, e136.ls);
                }
                static ns(t296, e135) {
                    return et(t296.ls, e135.ls) || Pt.comparator(t296.key, e135.key);
                }
            }
            class vr {
                constructor(t, e){
                    this.Ht = t, this.referenceDelegate = e, this.In = [], this.fs = 1, this.ds = new gn(Pr.ts);
                }
                checkEmpty(t303) {
                    return js.resolve(0 === this.In.length);
                }
                addMutationBatch(t298, e141, n44, s18) {
                    const i = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const r = new ni(i, e141, n44, s18);
                    for (const e137 of (this.In.push(r), s18))this.ds = this.ds.add(new Pr(e137.key, i)), this.Ht.addToCollectionParentIndex(t298, e137.key.path.popLast());
                    return js.resolve(r);
                }
                lookupMutationBatch(t299, e138) {
                    return js.resolve(this.ws(e138));
                }
                getNextMutationBatchAfterBatchId(t300, e139) {
                    const s = this._s(e139 + 1), i = s < 0 ? 0 : s;
                    return js.resolve(this.In.length > i ? this.In[i] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return js.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t301) {
                    return js.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t302, e140) {
                    const n = new Pr(e140, 0), s = new Pr(e140, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t304, e142) {
                    let n = new gn(et);
                    return e142.forEach((t305)=>{
                        const e = new Pr(t305, 0), s = new Pr(t305, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), js.resolve(this.gs(n));
                }
                getAllMutationBatchesAffectingQuery(t306, e143) {
                    const n = e143.path, s = n.length + 1;
                    let i = n;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    let o = new gn(et);
                    return this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return !!n.isPrefixOf(e) && (e.length === s && (o = o.add(t.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t307) {
                    const e = [];
                    return t307.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e;
                }
                removeMutationBatch(t314, e146) {
                    B(0 === this.ys(e146.batchId, "removed")), this.In.shift();
                    let n = this.ds;
                    return js.forEach(e146.mutations, (s)=>{
                        const i = new Pr(s.key, e146.batchId);
                        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t314, s.key);
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(t308) {
                }
                containsKey(t309, e144) {
                    const n = new Pr(e144, 0), s = this.ds.firstAfterOrEqual(n);
                    return js.resolve(e144.isEqual(s && s.key));
                }
                performConsistencyCheck(t310) {
                    return this.In.length, js.resolve();
                }
                ys(t311, e145) {
                    return this._s(t311);
                }
                _s(t312) {
                    return 0 === this.In.length ? 0 : t312 - this.In[0].batchId;
                }
                ws(t313) {
                    const e = this._s(t313);
                    return e < 0 || e >= this.In.length ? null : this.In[e];
                }
            }
            class Vr {
                constructor(t, e){
                    this.Ht = t, this.ps = e, this.docs = new wn(Pt.comparator), this.size = 0;
                }
                addEntry(t318, e149, n46) {
                    const s = e149.key, i = this.docs.get(s), r = i ? i.size : 0, o = this.ps(e149);
                    return this.docs = this.docs.insert(s, {
                        document: e149.clone(),
                        size: o,
                        readTime: n46
                    }), this.size += o - r, this.Ht.addToCollectionParentIndex(t318, s.path.popLast());
                }
                removeEntry(t315) {
                    const e = this.docs.get(t315);
                    e && (this.docs = this.docs.remove(t315), this.size -= e.size);
                }
                getEntry(t316, e147) {
                    const n = this.docs.get(e147);
                    return js.resolve(n ? n.document.clone() : Kt.newInvalidDocument(e147));
                }
                getEntries(t317, e148) {
                    let n = Tn();
                    return e148.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : Kt.newInvalidDocument(t));
                    }), js.resolve(n);
                }
                getDocumentsMatchingQuery(t320, e153, n45) {
                    let s = Tn();
                    const i = new Pt(e153.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t , value: { document: i , readTime: o  }  } = r.getNext();
                        if (!e153.path.isPrefixOf(t.path)) break;
                        0 >= o.compareTo(n45) || Pe(e153, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t319, e150) {
                    return js.forEach(this.docs, (t)=>e150(t)
                    );
                }
                newChangeBuffer(t322) {
                    return new Sr(this);
                }
                getSize(t321) {
                    return js.resolve(this.size);
                }
            }
            class Sr extends Qi {
                constructor(t){
                    super(), this.Se = t;
                }
                applyChanges(t325) {
                    const e = [];
                    return this.changes.forEach((n, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t325, s.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), js.waitFor(e);
                }
                getFromCache(t323, e151) {
                    return this.Se.getEntry(t323, e151);
                }
                getAllFromCache(t324, e152) {
                    return this.Se.getEntries(t324, e152);
                }
            }
            class Cr {
                constructor(t326, e154){
                    this.bs = {
                    }, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t326(this), this.ze = new class {
                        constructor(t327){
                            this.persistence = t327, this.Es = new ji((t)=>Wt(t)
                            , zt), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Is = 0, this.As = new br, this.targetCount = 0, this.Rs = Ni.se();
                        }
                        forEachTarget(t, e163) {
                            return this.Es.forEach((t, n)=>e163(n)
                            ), js.resolve();
                        }
                        getLastRemoteSnapshotVersion(t328) {
                            return js.resolve(this.lastRemoteSnapshotVersion);
                        }
                        getHighestSequenceNumber(t329) {
                            return js.resolve(this.Is);
                        }
                        allocateTargetId(t330) {
                            return this.highestTargetId = this.Rs.next(), js.resolve(this.highestTargetId);
                        }
                        setTargetsMetadata(t331, e155, n) {
                            return n && (this.lastRemoteSnapshotVersion = n), e155 > this.Is && (this.Is = e155), js.resolve();
                        }
                        ce(t332) {
                            this.Es.set(t332.target, t332);
                            const e = t332.targetId;
                            e > this.highestTargetId && (this.Rs = new Ni(e), this.highestTargetId = e), t332.sequenceNumber > this.Is && (this.Is = t332.sequenceNumber);
                        }
                        addTargetData(t333, e156) {
                            return this.ce(e156), this.targetCount += 1, js.resolve();
                        }
                        updateTargetData(t334, e157) {
                            return this.ce(e157), js.resolve();
                        }
                        removeTargetData(t335, e158) {
                            return this.Es.delete(e158.target), this.As.cs(e158.targetId), this.targetCount -= 1, js.resolve();
                        }
                        removeTargets(t336, e159, n47) {
                            let s = 0;
                            const i = [];
                            return this.Es.forEach((r, o)=>{
                                o.sequenceNumber <= e159 && null === n47.get(o.targetId) && (this.Es.delete(r), i.push(this.removeMatchingKeysForTargetId(t336, o.targetId)), s++);
                            }), js.waitFor(i).next(()=>s
                            );
                        }
                        getTargetCount(t337) {
                            return js.resolve(this.targetCount);
                        }
                        getTargetData(t338, e160) {
                            const n = this.Es.get(e160) || null;
                            return js.resolve(n);
                        }
                        addMatchingKeys(t339, e161, n48) {
                            return this.As.ss(e161, n48), js.resolve();
                        }
                        removeMatchingKeys(t340, e162, n49) {
                            this.As.os(e162, n49);
                            const s = this.persistence.referenceDelegate, i = [];
                            return s && e162.forEach((e)=>{
                                i.push(s.markPotentiallyOrphaned(t340, e));
                            }), js.waitFor(i);
                        }
                        removeMatchingKeysForTargetId(t341, e) {
                            return this.As.cs(e), js.resolve();
                        }
                        getMatchingKeysForTargetId(t342, e164) {
                            const n = this.As.hs(e164);
                            return js.resolve(n);
                        }
                        containsKey(t343, e165) {
                            return js.resolve(this.As.containsKey(e165));
                        }
                    }(this), this.Ht = new class {
                        constructor(){
                            this.Gt = new class {
                                constructor(){
                                    this.index = {
                                    };
                                }
                                add(t) {
                                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new gn(ht.comparator), i = !s.has(n);
                                    return this.index[e] = s.add(n), i;
                                }
                                has(t344) {
                                    const e = t344.lastSegment(), n = t344.popLast(), s = this.index[e];
                                    return s && s.has(n);
                                }
                                getEntries(t345) {
                                    return (this.index[t345] || new gn(ht.comparator)).toArray();
                                }
                            };
                        }
                        addToCollectionParentIndex(t, e) {
                            return this.Gt.add(e), js.resolve();
                        }
                        getCollectionParents(t346, e166) {
                            return js.resolve(this.Gt.getEntries(e166));
                        }
                    }, this.He = (function(t, e) {
                        return new Vr(t, e);
                    })(this.Ht, (t)=>this.referenceDelegate.Ps(t)
                    ), this.N = new class {
                        constructor(t){
                            this.Wt = t;
                        }
                    }(e154), this.Je = new class {
                        constructor(t){
                            this.N = t, this.Yn = new Map, this.Xn = new Map;
                        }
                        getBundleMetadata(t356, e173) {
                            return js.resolve(this.Yn.get(e173));
                        }
                        saveBundleMetadata(t347, e167) {
                            var n;
                            return this.Yn.set(e167.id, {
                                id: (n = e167).id,
                                version: n.version,
                                createTime: jn(n.createTime)
                            }), js.resolve();
                        }
                        getNamedQuery(t348, e168) {
                            return js.resolve(this.Xn.get(e168));
                        }
                        saveNamedQuery(t349, e169) {
                            var t353;
                            return this.Xn.set(e169.name, {
                                name: (t353 = e169).name,
                                query: function(t354) {
                                    var t350, e174;
                                    const e170 = function(t355) {
                                        var t351, t352, e175, n, s, i, o, c;
                                        let e171 = function(t) {
                                            const e = Wn(t);
                                            return 4 === e.length ? ht.emptyPath() : Xn(e);
                                        }(t355.parent);
                                        const n50 = t355.structuredQuery, s19 = n50.from ? n50.from.length : 0;
                                        let i9 = null;
                                        if (s19 > 0) {
                                            B(1 === s19);
                                            const t = n50.from[0];
                                            t.allDescendants ? i9 = t.collectionId : e171 = e171.child(t.collectionId);
                                        }
                                        let r = [];
                                        n50.where && (r = hs(n50.where));
                                        let o2 = [];
                                        n50.orderBy && (o2 = n50.orderBy.map((t358)=>{
                                            var t357;
                                            return t357 = t358, new ae(ms(t357.field), function(t) {
                                                switch(t){
                                                    case "ASCENDING":
                                                        return "asc";
                                                    case "DESCENDING":
                                                        return "desc";
                                                    default:
                                                        return;
                                                }
                                            }(t357.direction));
                                        }));
                                        let c1 = null, e172;
                                        n50.limit && (c1 = At(e172 = "object" == typeof (t351 = n50.limit) ? t351.value : t351) ? null : e172);
                                        let a = null;
                                        n50.startAt && (a = fs(n50.startAt));
                                        let u = null;
                                        return n50.endAt && (u = fs(n50.endAt)), t352 = e171, e175 = i9, n = o2, s = r, i = c1, o = a, c = u, new fe(t352, e175, n, s, i, "F", o, c);
                                    }({
                                        parent: t354.parent,
                                        structuredQuery: t354.structuredQuery
                                    });
                                    return "LAST" === t354.limitType ? (t350 = e170, e174 = e170.limit, new fe(t350.path, t350.collectionGroup, t350.explicitOrderBy.slice(), t350.filters.slice(), e174, "L", t350.startAt, t350.endAt)) : e170;
                                }(t353.bundledQuery),
                                readTime: jn(t353.readTime)
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
                setDatabaseDeletedListener() {
                }
                setNetworkEnabled() {
                }
                getIndexManager() {
                    return this.Ht;
                }
                getMutationQueue(t360) {
                    let e = this.bs[t360.toKey()];
                    return e || (e = new vr(this.Ht, this.referenceDelegate), this.bs[t360.toKey()] = e), e;
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
                runTransaction(t359, e183, n51) {
                    $("MemoryPersistence", "Starting transaction:", t359);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n51(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t
                        )
                    ).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t)
                    );
                }
                Ss(t361, e176) {
                    return js.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t361, e176)
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
                static Ns(t366) {
                    return new xr(t366);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw L();
                }
                addReference(t362, e177, n53) {
                    return this.Ds.addReference(n53, e177), this.xs.delete(n53.toString()), js.resolve();
                }
                removeReference(t363, e178, n52) {
                    return this.Ds.removeReference(n52, e178), this.xs.add(n52.toString()), js.resolve();
                }
                markPotentiallyOrphaned(t364, e179) {
                    return this.xs.add(e179.toString()), js.resolve();
                }
                removeTarget(t365, e180) {
                    this.Ds.cs(e180.targetId).forEach((t)=>this.xs.add(t.toString())
                    );
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(t365, e180.targetId).next((t367)=>{
                        t367.forEach((t)=>this.xs.add(t.toString())
                        );
                    }).next(()=>n.removeTargetData(t365, e180)
                    );
                }
                vs() {
                    this.Cs = new Set;
                }
                Vs(t368) {
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return js.forEach(this.xs, (n)=>{
                        const s = Pt.fromPath(n);
                        return this.ks(t368, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t368))
                    );
                }
                updateLimboDocument(t369, e181) {
                    return this.ks(t369, e181).next((t)=>{
                        t ? this.xs.delete(e181.toString()) : this.xs.add(e181.toString());
                    });
                }
                Ps(t371) {
                    return 0;
                }
                ks(t370, e182) {
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e182))
                        ,
                        ()=>this.persistence.getTargetCache().containsKey(t370, e182)
                        ,
                        ()=>this.persistence.Ss(t370, e182)
                    ]);
                }
            }
            class Fr {
                constructor(t, e, n, s){
                    this.user = t, this.batchId = e, this.state = n, this.error = s;
                }
                static $s(t372, e184, n54) {
                    const s = JSON.parse(n54);
                    let i, r = "object" == typeof s && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected"
                    ].indexOf(s.state) && (void 0 === s.error || "object" == typeof s.error);
                    return r && s.error && (r = "string" == typeof s.error.message && "string" == typeof s.error.code) && (i = new j(s.error.code, s.error.message)), r ? new Fr(t372, e184, s.state, i) : (O("SharedClientState", `Failed to parse mutation state for ID '${e184}': ${n54}`), null);
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
                static $s(t373, e185) {
                    const n = JSON.parse(e185);
                    let s, i = "object" == typeof n && -1 !== [
                        "not-current",
                        "current",
                        "rejected"
                    ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
                    return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code) && (s = new j(n.error.code, n.error.message)), i ? new Mr(t373, n.state, s) : (O("SharedClientState", `Failed to parse target state for ID '${t373}': ${e185}`), null);
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
                static $s(t375, e186) {
                    const n = JSON.parse(e186);
                    let s = "object" == typeof n && n.activeTargetIds instanceof Array, i = Vn();
                    for(let t374 = 0; s && t374 < n.activeTargetIds.length; ++t374)s = bt(n.activeTargetIds[t374]), i = i.add(n.activeTargetIds[t374]);
                    return s ? new Lr(t375, i) : (O("SharedClientState", `Failed to parse client data for instance '${t375}': ${e186}`), null);
                }
            }
            class Br {
                constructor(t, e){
                    this.clientId = t, this.onlineState = e;
                }
                static $s(t391) {
                    const e = JSON.parse(t391);
                    return "object" == typeof e && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(e.onlineState) && "string" == typeof e.clientId ? new Br(e.clientId, e.onlineState) : (O("SharedClientState", `Failed to parse online state: ${t391}`), null);
                }
            }
            class Ur {
                constructor(){
                    this.activeTargetIds = Vn();
                }
                Fs(t376) {
                    this.activeTargetIds = this.activeTargetIds.add(t376);
                }
                Ms(t377) {
                    this.activeTargetIds = this.activeTargetIds.delete(t377);
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
                    this.yi = new Ur, this.pi = {
                    }, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
                }
                addPendingMutation(t378) {
                }
                updateMutationState(t379, e190, n58) {
                }
                addLocalQueryTarget(t380) {
                    return this.yi.Fs(t380), this.pi[t380] || "not-current";
                }
                updateQueryState(t381, e187, n55) {
                    this.pi[t381] = e187;
                }
                removeLocalQueryTarget(t382) {
                    this.yi.Ms(t382);
                }
                isLocalQueryTarget(t383) {
                    return this.yi.activeTargetIds.has(t383);
                }
                clearQueryState(t384) {
                    delete this.pi[t384];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(t385) {
                    return this.yi.activeTargetIds.has(t385);
                }
                start() {
                    return this.yi = new Ur, Promise.resolve();
                }
                handleUserChange(t386, e188, n56) {
                }
                setOnlineState(t387) {
                }
                shutdown() {
                }
                writeSequenceNumber(t388) {
                }
                notifyBundleLoaded() {
                }
            }
            class jr {
                Ti(t389) {
                }
                shutdown() {
                }
            }
            class Qr {
                constructor(){
                    this.Ei = ()=>this.Ii()
                    , this.Ai = ()=>this.Ri()
                    , this.bi = [], this.Pi();
                }
                Ti(t390) {
                    this.bi.push(t390);
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
                Si(t397) {
                    this.Di = t397;
                }
                Ci(t392) {
                    this.Ni = t392;
                }
                onMessage(t393) {
                    this.xi = t393;
                }
                close() {
                    this.Vi();
                }
                send(t394) {
                    this.vi(t394);
                }
                ki() {
                    this.Di();
                }
                $i(t395) {
                    this.Ni(t395);
                }
                Oi(t396) {
                    this.xi(t396);
                }
            }
            class zr extends class {
                constructor(t){
                    this.databaseInfo = t, this.databaseId = t.databaseId;
                    const e = t.ssl ? "https" : "http";
                    this.Fi = e + "://" + t.host, this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
                }
                Li(t403, e196, n, s) {
                    const i = this.Bi(t403, e196);
                    $("RestConnection", "Sending: ", i, n);
                    const r = {
                    };
                    return this.Ui(r, s), this.qi(t403, i, r, n).then((t)=>($("RestConnection", "Received: ", t), t)
                    , (e)=>{
                        throw F("RestConnection", `${t403} failed with error: `, e, "url: ", i, "request:", n), e;
                    });
                }
                Ki(t, e, n60, s22) {
                    return this.Li(t, e, n60, s22);
                }
                Ui(t404, e197) {
                    if (t404["X-Goog-Api-Client"] = "gl-js/ fire/" + C, t404["Content-Type"] = "text/plain", this.databaseInfo.appId && (t404["X-Firebase-GMPID"] = this.databaseInfo.appId), e197) for(const n in e197.authHeaders)e197.authHeaders.hasOwnProperty(n) && (t404[n] = e197.authHeaders[n]);
                }
                Bi(t405, e198) {
                    const n = Wr[t405];
                    return `${this.Fi}/v1/${e198}:${n}`;
                }
            } {
                constructor(t){
                    super(t), this.forceLongPolling = t.forceLongPolling, this.autoDetectLongPolling = t.autoDetectLongPolling, this.useFetchStreams = t.useFetchStreams;
                }
                qi(t398, e189, n57, s21) {
                    return new Promise((i, r)=>{
                        const o = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.JJ;
                        o.listenOnce(_firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.NO_ERROR:
                                        const e192 = o.getResponseJson();
                                        $("Connection", "XHR received:", JSON.stringify(e192)), i(e192);
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.TIMEOUT:
                                        $("Connection", "RPC \"" + t398 + "\" timed out"), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ($("Connection", "RPC \"" + t398 + "\" failed with status:", n, "response text:", o.getResponseText()), n > 0) {
                                            const t399 = o.getResponseJson().error;
                                            if (t399 && t399.status && t399.message) {
                                                const e191 = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t399.status);
                                                r(new j(e191, t399.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", "RPC \"" + t398 + "\" completed.");
                            }
                        });
                        const c = JSON.stringify(s21);
                        o.send(e189, "POST", c, n57, 15);
                    });
                }
                ji(t400, e193) {
                    const n59 = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t400,
                        "/channel"
                    ], s20 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.UE)(), i10 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.FJ)(), r = {
                        httpSessionIdParam: "gsessionid",
                        initMessageHeaders: {
                        },
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
                    this.useFetchStreams && (r.xmlHttpFactory = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.zI({
                    })), this.Ui(r.initMessageHeaders, e193), (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.uI)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.b$)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.d)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.w1)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.Mn)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.ru)() || (r.httpHeadersOverwriteParam = "$httpHeaders");
                    const o = n59.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s20.createWebChannel(o, r);
                    let a = !1, u = !1;
                    const h = new Gr({
                        vi: (t)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t401, e, n)=>{
                        t401.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t402) {
                                setTimeout(()=>{
                                    throw t402;
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
                        var e195;
                        if (!u) {
                            const n = t.data[0];
                            B(!!n);
                            const s = n, i = s.error || (null === (e195 = s[0]) || void 0 === e195 ? void 0 : e195.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t = i.status;
                                let e194 = function(t) {
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t), n = i.message;
                                void 0 === e194 && (e194 = K.INTERNAL, n = "Unknown error status: " + t + " with message " + i.message), u = !0, h.$i(new j(e194, n)), c.close();
                            } else $("Connection", "WebChannel received:", n), h.Oi(n);
                        }
                    }), g(i10, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ju.STAT_EVENT, (t)=>{
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
                Xi(t406) {
                    this.cancel();
                    const e = Math.floor(this.zi + this.Zi()), n = Math.max(0, Date.now() - this.Ji), s = Math.max(0, e - n);
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t406())
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
                mr(t409) {
                    this.gr(), this.stream.send(t409);
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
                async close(t407, e200) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== t407 ? this.ar.reset() : e200 && e200.code === K.RESOURCE_EXHAUSTED ? (O(e200.toString()), O("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e200 && e200.code === K.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), this.stream = null), this.state = t407, await this.listener.Ci(e200);
                }
                pr() {
                }
                auth() {
                    this.state = 1;
                    const t408 = this.Tr(this.ir), e199 = this.ir;
                    this.credentialsProvider.getToken().then((t)=>{
                        this.ir === e199 && this.Er(t);
                    }, (e)=>{
                        t408(()=>{
                            const t = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t410) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t410), this.stream.Si(()=>{
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
                Ir(t412) {
                    return $("PersistentStream", `close with error: ${t412}`), this.stream = null, this.close(4, t412);
                }
                Tr(t411) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t411 ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())
                        );
                    };
                }
            }
            class to extends Zr {
                constructor(t, e, n, s, i){
                    super(t, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, i), this.N = s;
                }
                Ar(t416) {
                    return this.sr.ji("Listen", t416);
                }
                onMessage(t413) {
                    this.ar.reset();
                    const e202 = function(t417, e203) {
                        let n;
                        if ("targetChange" in e203) {
                            var t414, t415, e201;
                            e203.targetChange;
                            const s = "NO_CHANGE" === (t414 = e203.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t414 ? 1 : "REMOVE" === t414 ? 2 : "CURRENT" === t414 ? 3 : "RESET" === t414 ? 4 : L(), i = e203.targetChange.targetIds || [], r = (t415 = t417, e201 = e203.targetChange.resumeToken, t415.D ? (B(void 0 === e201 || "string" == typeof e201), _t.fromBase64String(e201 || "")) : (B(void 0 === e201 || e201 instanceof Uint8Array), _t.fromUint8Array(e201 || new Uint8Array))), o = e203.targetChange.cause, c = o && function(t) {
                                const e = void 0 === t.code ? K.UNKNOWN : dn(t.code);
                                return new j(e, t.message || "");
                            }(o);
                            n = new xn(s, i, r, c || null);
                        } else if ("documentChange" in e203) {
                            e203.documentChange;
                            const s = e203.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t417, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o), a = s.targetIds || [], u = s.removedTargetIds || [];
                            n = new Cn(a, u, c.key, c);
                        } else if ("documentDelete" in e203) {
                            e203.documentDelete;
                            const s = e203.documentDelete;
                            s.document;
                            const i = zn(t417, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r), c = s.removedTargetIds || [];
                            n = new Cn([], c, o.key, o);
                        } else if ("documentRemove" in e203) {
                            e203.documentRemove;
                            const s = e203.documentRemove;
                            s.document;
                            const i = zn(t417, s.document), r = s.removedTargetIds || [];
                            n = new Cn([], r, i, null);
                        } else {
                            if (!("filter" in e203)) return L();
                            {
                                e203.filter;
                                const t = e203.filter;
                                t.targetId;
                                const s = t.count || 0, i = new un(s), r = t.targetId;
                                n = new Nn(r, i);
                            }
                        }
                        return n;
                    }(this.N, t413), n61 = function(t) {
                        if (!("targetChange" in t)) return rt.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t413);
                    return this.listener.Rr(e202, n61);
                }
                br(t418) {
                    const e204 = {
                    };
                    e204.database = Yn(this.N), e204.addTarget = (function(t420, e206) {
                        let n63;
                        const s23 = e206.target;
                        return (n63 = Ht(s23) ? {
                            documents: {
                                documents: [
                                    Hn(t420, s23.path)
                                ]
                            }
                        } : {
                            query: (function(t421, e207) {
                                var t419, e205;
                                const n = {
                                    structuredQuery: {
                                    }
                                }, s = e207.path;
                                null !== e207.collectionGroup ? (n.parent = Hn(t421, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e207.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n.parent = Hn(t421, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t422) {
                                    if (0 !== t422.length) {
                                        const e = t422.map((t423)=>(function(t) {
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
                                            })(t423)
                                        );
                                        return 1 === e.length ? e[0] : {
                                            compositeFilter: {
                                                op: "AND",
                                                filters: e
                                            }
                                        };
                                    }
                                }(e207.filters);
                                i && (n.structuredQuery.where = i);
                                const r = function(t425) {
                                    if (0 !== t425.length) return t425.map((t)=>{
                                        var t424;
                                        return {
                                            field: _s((t424 = t).field),
                                            direction: Mn[t424.dir]
                                        };
                                    });
                                }(e207.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (t419 = t421, e205 = e207.limit, t419.D || At(e205) ? e205 : {
                                    value: e205
                                });
                                return null !== o && (n.structuredQuery.limit = o), e207.startAt && (n.structuredQuery.startAt = ls(e207.startAt)), e207.endAt && (n.structuredQuery.endAt = ls(e207.endAt)), n;
                            })(t420, s23)
                        }).targetId = e206.targetId, e206.resumeToken.approximateByteSize() > 0 ? n63.resumeToken = qn(t420, e206.resumeToken) : e206.snapshotVersion.compareTo(rt.min()) > 0 && (n63.readTime = Un(t420, e206.snapshotVersion.toTimestamp())), n63;
                    })(this.N, t418);
                    const n62 = function(t, e208) {
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
                        }(0, e208.purpose);
                        return null == n ? null : {
                            "goog-listen-tags": n
                        };
                    }(this.N, t418);
                    n62 && (e204.labels = n62), this.mr(e204);
                }
                Pr(t426) {
                    const e = {
                    };
                    e.database = Yn(this.N), e.removeTarget = t426, this.mr(e);
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
                Ar(t431) {
                    return this.sr.ji("Write", t431);
                }
                onMessage(t427) {
                    if (B(!!t427.streamToken), this.lastStreamToken = t427.streamToken, this.vr) {
                        var t429, e210;
                        this.ar.reset();
                        const e209 = (t429 = t427.writeResults, e210 = t427.commitTime, t429 && t429.length > 0 ? (B(void 0 !== e210), t429.map((t)=>{
                            var t428, e;
                            let n;
                            return t428 = t, e = e210, (n = t428.updateTime ? jn(t428.updateTime) : jn(e)).isEqual(rt.min()) && (n = jn(e)), new We(n, t428.transformResults || []);
                        })) : []), n64 = jn(t427.commitTime);
                        return this.listener.Dr(n64, e209);
                    }
                    return B(!t427.writeResults || 0 === t427.writeResults.length), this.vr = !0, this.listener.Cr();
                }
                Nr() {
                    const t = {
                    };
                    t.database = Yn(this.N), this.mr(t);
                }
                Sr(t430) {
                    const e = {
                        streamToken: this.lastStreamToken,
                        writes: t430.map((t)=>ss(this.N, t)
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
                Li(t432, e212, n66) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t432, e212, n66, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                Ki(t433, e211, n65) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t433, e211, n65, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class io {
                constructor(t434, e213, n, s, i){
                    this.localStore = t434, this.datastore = e213, this.asyncQueue = n, this.remoteSyncer = {
                    }, this.jr = [], this.Qr = new Map, this.Wr = new Set, this.Gr = [], this.zr = i, this.zr.Ti((t435)=>{
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
                        set(t436) {
                            this.Kr(), this.Or = 0, "Online" === t436 && (this.Mr = !1), this.Br(t436);
                        }
                        Br(t437) {
                            t437 !== this.state && (this.state = t437, this.onlineStateHandler(t437));
                        }
                        Ur(t438) {
                            const e = `Could not reach Cloud Firestore backend. ${t438}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
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
            async function yo(t439, e214, n67) {
                if (t439.Hr.set("Online"), e214 instanceof xn && 2 === e214.state && e214.cause) try {
                    await async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(t439, e214);
                } catch (n68) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e214.targetIds.join(","), n68), await po(t439, n68);
                }
                else if (e214 instanceof Cn ? t439.Jr.rt(e214) : e214 instanceof Nn ? t439.Jr.ft(e214) : t439.Jr.at(e214), !n67.isEqual(rt.min())) try {
                    const e215 = await fr(t439.localStore);
                    n67.compareTo(e215) >= 0 && await function(t, e216) {
                        const n69 = t.Jr._t(e216);
                        return n69.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const i = t.Qr.get(s);
                                i && t.Qr.set(s, i.withResumeToken(n.resumeToken, e216));
                            }
                        }), n69.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (n) {
                                t.Qr.set(e, n.withResumeToken(_t.EMPTY_BYTE_STRING, n.snapshotVersion)), ho(t, e);
                                const s = new ii(n.target, e, 1, n.sequenceNumber);
                                uo(t, s);
                            }
                        }), t.remoteSyncer.applyRemoteEvent(n69);
                    }(t439, n67);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t439, e);
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
                } catch (t440) {
                    await po(e, t440);
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
            async function So(t441, e217) {
                e217 && No(t441).Vr && await async function(t442, e) {
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
                        const n = t442.jr.shift();
                        No(t442).dr(), await To(t442, ()=>t442.remoteSyncer.rejectFailedWrite(n.batchId, e)
                        ), await Eo(t442);
                    }
                }(t441, e217), Ro(t441) && bo(t441);
            }
            async function Do(t, e) {
                const n = q(t);
                e ? (n.Wr.delete(2), await ro(n)) : e || (n.Wr.add(2), await oo(n), n.Hr.set("Unknown"));
            }
            function Co(t443) {
                return t443.Yr || (t443.Yr = (function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new to(e, s.sr, s.credentials, s.N, n);
                })(t443.datastore, t443.asyncQueue, {
                    Si: mo.bind(null, t443),
                    Ci: go.bind(null, t443),
                    Rr: yo.bind(null, t443)
                }), t443.Gr.push(async (e)=>{
                    e ? (t443.Yr.dr(), fo(t443) ? lo(t443) : t443.Hr.set("Unknown")) : (await t443.Yr.stop(), _o(t443));
                })), t443.Yr;
            }
            function No(t444) {
                return t444.Xr || (t444.Xr = (function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new eo(e, s.sr, s.credentials, s.N, n);
                })(t444.datastore, t444.asyncQueue, {
                    Si: Po.bind(null, t444),
                    Ci: So.bind(null, t444),
                    Cr: vo.bind(null, t444),
                    Dr: Vo.bind(null, t444)
                }), t444.Gr.push(async (e)=>{
                    e ? (t444.Xr.dr(), await Eo(t444)) : (await t444.Xr.stop(), t444.jr.length > 0 && ($("RemoteStore", `Stopping write stream with ${t444.jr.length} pending writes`), t444.jr = []));
                })), t444.Xr;
            }
            class xo {
                constructor(t, e, n, s, i){
                    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new Q, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t)=>{
                    });
                }
                static createAndSchedule(t447, e218, n70, s24, i11) {
                    const r = Date.now() + n70, o = new xo(t447, e218, r, s24, i11);
                    return o.start(n70), o;
                }
                start(t445) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed()
                    , t445);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t446) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t446 ? ": " + t446 : ""))));
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
                constructor(t448){
                    this.comparator = t448 ? (e, n)=>t448(e, n) || Pt.comparator(e.key, n.key)
                     : (t, e)=>Pt.comparator(t.key, e.key)
                    , this.keyedMap = In(), this.sortedSet = new wn(this.comparator);
                }
                static emptySet(t458) {
                    return new $o(t458.comparator);
                }
                has(t449) {
                    return null != this.keyedMap.get(t449);
                }
                get(t450) {
                    return this.keyedMap.get(t450);
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
                indexOf(t451) {
                    const e = this.keyedMap.get(t451);
                    return e ? this.sortedSet.indexOf(e) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(t452) {
                    this.sortedSet.inorderTraversal((e, n)=>(t452(e), !1)
                    );
                }
                add(t453) {
                    const e = this.delete(t453.key);
                    return e.copy(e.keyedMap.insert(t453.key, t453), e.sortedSet.insert(t453, null));
                }
                delete(t454) {
                    const e = this.get(t454);
                    return e ? this.copy(this.keyedMap.remove(t454), this.sortedSet.remove(e)) : this;
                }
                isEqual(t455) {
                    if (!(t455 instanceof $o)) return !1;
                    if (this.size !== t455.size) return !1;
                    const e = this.sortedSet.getIterator(), n = t455.sortedSet.getIterator();
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
                copy(t456, e219) {
                    const n = new $o;
                    return n.comparator = this.comparator, n.keyedMap = t456, n.sortedSet = e219, n;
                }
            }
            class Oo {
                constructor(){
                    this.Zr = new wn(Pt.comparator);
                }
                track(t457) {
                    const e = t457.doc.key, n = this.Zr.get(e);
                    n ? 0 !== t457.type && 3 === n.type ? this.Zr = this.Zr.insert(e, t457) : 3 === t457.type && 1 !== n.type ? this.Zr = this.Zr.insert(e, {
                        type: n.type,
                        doc: t457.doc
                    }) : 2 === t457.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t457.doc
                    }) : 2 === t457.type && 0 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 0,
                        doc: t457.doc
                    }) : 1 === t457.type && 0 === n.type ? this.Zr = this.Zr.remove(e) : 1 === t457.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 1,
                        doc: n.doc
                    }) : 0 === t457.type && 1 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t457.doc
                    }) : L() : this.Zr = this.Zr.insert(e, t457);
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
                static fromInitialDocuments(t459, e220, n71, s25) {
                    const i = [];
                    return e220.forEach((t)=>{
                        i.push({
                            type: 0,
                            doc: t
                        });
                    }), new Fo(t459, e220, $o.emptySet(e220), i, n71, s25, !0, !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t461) {
                    if (!(this.fromCache === t461.fromCache && this.syncStateChanged === t461.syncStateChanged && this.mutatedKeys.isEqual(t461.mutatedKeys) && Ae(this.query, t461.query) && this.docs.isEqual(t461.docs) && this.oldDocs.isEqual(t461.oldDocs))) return !1;
                    const e = this.docChanges, n = t461.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let t460 = 0; t460 < e.length; t460++)if (e[t460].type !== n[t460].type || !e[t460].doc.isEqual(n[t460].doc)) return !1;
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
                } catch (t462) {
                    const n = ko(t462, `Initialization of query '${be(e.query)}' failed`);
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
                for (const t463 of e){
                    const e = t463.query, i = n.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t463) && (s = !0);
                        i.no = t463;
                    }
                }
                s && jo(n);
            }
            function Ko(t, e, n) {
                const s = q(t), i = s.queries.get(e);
                if (i) for (const t464 of i.listeners)t464.onError(n);
                s.queries.delete(e);
            }
            function jo(t465) {
                t465.so.forEach((t)=>{
                    t.next();
                });
            }
            class Qo {
                constructor(t, e, n){
                    this.query = t, this.oo = e, this.co = !1, this.ao = null, this.onlineState = "Unknown", this.options = n || {
                    };
                }
                ro(t471) {
                    if (!this.options.includeMetadataChanges) {
                        const e = [];
                        for (const n of t471.docChanges)3 !== n.type && e.push(n);
                        t471 = new Fo(t471.query, t471.docs, t471.oldDocs, e, t471.mutatedKeys, t471.fromCache, t471.syncStateChanged, !0);
                    }
                    let e = !1;
                    return this.co ? this.uo(t471) && (this.oo.next(t471), e = !0) : this.ho(t471, this.onlineState) && (this.lo(t471), e = !0), this.ao = t471, e;
                }
                onError(t466) {
                    this.oo.error(t466);
                }
                io(t467) {
                    this.onlineState = t467;
                    let e = !1;
                    return this.ao && !this.co && this.ho(this.ao, t467) && (this.lo(this.ao), e = !0), e;
                }
                ho(t468, e221) {
                    if (!t468.fromCache) return !0;
                    const n = "Offline" !== e221;
                    return (!this.options.fo || !n) && (!t468.docs.isEmpty() || "Offline" === e221);
                }
                uo(t469) {
                    if (t469.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t469.hasPendingWrites;
                    return !(!t469.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
                }
                lo(t470) {
                    t470 = Fo.fromInitialDocuments(t470.query, t470.docs, t470.mutatedKeys, t470.fromCache), this.co = !0, this.oo.next(t470);
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
                bo(t472, e222) {
                    const n = e222 ? e222.Po : new Oo, s = e222 ? e222.Ao : this.Ao;
                    let i = e222 ? e222.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    if (t472.inorderTraversal((t, e)=>{
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
                vo(t474, e224) {
                    return t474.hasLocalMutations && e224.hasCommittedMutations && !e224.hasLocalMutations;
                }
                applyChanges(t473, e223, n72) {
                    const s = this.Ao;
                    this.Ao = t473.Ao, this.mutatedKeys = t473.mutatedKeys;
                    const i = t473.Po.eo();
                    i.sort((t475, e225)=>(function(t476, e) {
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
                            return n(t476) - n(e);
                        })(t475.type, e225.type) || this.Io(t475.doc, e225.doc)
                    ), this.Vo(n72);
                    const r = e223 ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t473.Ao, s, i, t473.mutatedKeys, 0 === o, c, !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                io(t479) {
                    return this.current && "Offline" === t479 ? (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo,
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t477) {
                    return !this.po.has(t477) && !!this.Ao.has(t477) && !this.Ao.get(t477).hasLocalMutations;
                }
                Vo(t478) {
                    t478 && (t478.addedDocuments.forEach((t)=>this.po = this.po.add(t)
                    ), t478.modifiedDocuments.forEach((t)=>{
                    }), t478.removedDocuments.forEach((t)=>this.po = this.po.delete(t)
                    ), this.current = t478.current);
                }
                So() {
                    if (!this.current) return [];
                    const t480 = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    const e = [];
                    return t480.forEach((t)=>{
                        this.Eo.has(t) || e.push(new Yo(t));
                    }), this.Eo.forEach((n)=>{
                        t480.has(n) || e.push(new Jo(n));
                    }), e;
                }
                No(t481) {
                    this.po = t481.Gn, this.Eo = Pn();
                    const e = this.bo(t481.documents);
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
                constructor(t482, e, n, s, i, r){
                    this.localStore = t482, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.$o = {
                    }, this.Oo = new ji((t)=>Re(t)
                    , Ae), this.Fo = new Map, this.Mo = new Set, this.Lo = new wn(Pt.comparator), this.Bo = new Map, this.Uo = new br, this.qo = {
                    }, this.Ko = new Map, this.jo = Ni.ie(), this.onlineState = "Unknown", this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function nc(t484, e226) {
                const n73 = Cc(t484);
                let s26, i12;
                const r = n73.Oo.get(e226);
                if (r) s26 = r.targetId, n73.sharedClientState.addLocalQueryTarget(s26), i12 = r.view.xo();
                else {
                    const t483 = await function(t485, e) {
                        const n = q(t485);
                        return n.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                            let s;
                            return n.ze.getTargetData(t, e).next((i13)=>i13 ? (s = i13, js.resolve(s)) : n.ze.allocateTargetId(t).next((i)=>(s = new ii(e, i, 0, t.currentSequenceNumber), n.ze.addTargetData(t, s).next(()=>s
                                    ))
                                )
                            );
                        }).then((t)=>{
                            const s = n.Un.get(t.targetId);
                            return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Un = n.Un.insert(t.targetId, t), n.qn.set(e, t.targetId)), t;
                        });
                    }(n73.localStore, Ee(e226)), r = n73.sharedClientState.addLocalQueryTarget(t483.targetId);
                    i12 = await sc(n73, e226, s26 = t483.targetId, "current" === r), n73.isPrimaryClient && co(n73.remoteStore, t483);
                }
                return i12;
            }
            async function sc(t486, e227, n74, s27) {
                t486.Wo = (e228, n75, s28)=>(async function(t487, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && (i = await yr(t487.localStore, e.query, !1).then(({ documents: t  })=>e.view.bo(t, i)
                        ));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, t487.isPrimaryClient, r);
                        return mc(t487, e.targetId, o.Do), o.snapshot;
                    })(t486, e228, n75, s28)
                ;
                const i14 = await yr(t486.localStore, e227, !0), r6 = new Xo(e227, i14.Gn), o3 = r6.bo(i14.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n74, s27 && "Offline" !== t486.onlineState), a = r6.applyChanges(o3, t486.isPrimaryClient, c);
                mc(t486, n74, a.Do);
                const u = new Zo(e227, n74, r6);
                return t486.Oo.set(e227, u), t486.Fo.has(n74) ? t486.Fo.get(n74).push(e227) : t486.Fo.set(n74, [
                    e227
                ]), a.snapshot;
            }
            async function ic(t488, e) {
                const n = q(t488), s = n.Oo.get(e), i = n.Fo.get(s.targetId);
                if (i.length > 1) return n.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e)
                )), void n.Oo.delete(e);
                n.isPrimaryClient ? (n.sharedClientState.removeLocalQueryTarget(s.targetId), n.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(n.localStore, s.targetId, !1).then(()=>{
                    n.sharedClientState.clearQueryState(s.targetId), ao(n.remoteStore, s.targetId), wc(n, s.targetId);
                }).catch(Fi)) : (wc(n, s.targetId), await gr(n.localStore, s.targetId, !0));
            }
            async function oc(t491, e229) {
                const n76 = q(t491);
                try {
                    const t489 = await function(t492, e232) {
                        const n79 = q(t492), s30 = e232.snapshotVersion;
                        let i = n79.Un;
                        return n79.persistence.runTransaction("Apply remote event", "readwrite-primary", (t494)=>{
                            var t490, e230, n77, s29, i15;
                            const r8 = n79.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = n79.Un;
                            const o4 = [];
                            e232.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (c) {
                                    o4.push(n79.ze.removeMatchingKeys(t494, e.removedDocuments, r).next(()=>n79.ze.addMatchingKeys(t494, e.addedDocuments, r)
                                    ));
                                    const a = e.resumeToken;
                                    if (a.approximateByteSize() > 0) {
                                        var t493, e231, n78;
                                        const u = c.withResumeToken(a, s30).withSequenceNumber(t494.currentSequenceNumber);
                                        i = i.insert(r, u), t493 = c, e231 = u, n78 = e, ((B(e231.resumeToken.approximateByteSize() > 0), 0 === t493.resumeToken.approximateByteSize()) ? 0 : e231.snapshotVersion.toMicroseconds() - t493.snapshotVersion.toMicroseconds() >= 300000000 ? 0 : !(n78.addedDocuments.size + n78.modifiedDocuments.size + n78.removedDocuments.size > 0)) || o4.push(n79.ze.updateTargetData(t494, u));
                                    }
                                }
                            });
                            let c2 = Tn(), r7;
                            if (e232.documentUpdates.forEach((s, i)=>{
                                e232.resolvedLimboDocuments.has(s) && o4.push(n79.persistence.referenceDelegate.updateLimboDocument(t494, s));
                            }), o4.push((t490 = t494, e230 = r8, n77 = e232.documentUpdates, s29 = s30, i15 = void 0, r7 = Pn(), n77.forEach((t)=>r7 = r7.add(t)
                            ), e230.getEntries(t490, r7).next((t)=>{
                                let r = Tn();
                                return n77.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i15 ? void 0 : i15.get(n)) || s29;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (e230.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (e230.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c2 = t;
                            })), !s30.isEqual(rt.min())) {
                                const e = n79.ze.getLastRemoteSnapshotVersion(t494).next((e)=>n79.ze.setTargetsMetadata(t494, t494.currentSequenceNumber, s30)
                                );
                                o4.push(e);
                            }
                            return js.waitFor(o4).next(()=>r8.apply(t494)
                            ).next(()=>n79.Qn.vn(t494, c2)
                            ).next(()=>c2
                            );
                        }).then((t)=>(n79.Un = i, t)
                        );
                    }(n76.localStore, e229);
                    e229.targetChanges.forEach((t, e)=>{
                        const s = n76.Bo.get(e);
                        s && (B(t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1), t.addedDocuments.size > 0 ? s.ko = !0 : t.modifiedDocuments.size > 0 ? B(s.ko) : t.removedDocuments.size > 0 && (B(s.ko), s.ko = !1));
                    }), await pc(n76, t489, e229);
                } catch (t) {
                    await Fi(t);
                }
            }
            function cc(t, e233, n80) {
                const s31 = q(t);
                if (s31.isPrimaryClient && 0 === n80 || !s31.isPrimaryClient && 1 === n80) {
                    const t495 = [];
                    s31.Oo.forEach((n, s)=>{
                        const i = s.view.io(e233);
                        i.snapshot && t495.push(i.snapshot);
                    }), (function(t, e) {
                        const n81 = q(t);
                        n81.onlineState = e;
                        let s = !1;
                        n81.queries.forEach((t, n)=>{
                            for (const t496 of n.listeners)t496.io(e) && (s = !0);
                        }), s && jo(n81);
                    })(s31.eventManager, e233), t495.length && s31.$o.Rr(t495), s31.onlineState = e233, s31.isPrimaryClient && s31.sharedClientState.setOnlineState(e233);
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
            function wc(t, e234, n = null) {
                for (const s of (t.sharedClientState.removeLocalQueryTarget(e234), t.Fo.get(e234)))t.Oo.delete(s), n && t.$o.Go(s, n);
                t.Fo.delete(e234), t.isPrimaryClient && t.Uo.cs(e234).forEach((e)=>{
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
            async function pc(t497, e235, n82) {
                const s32 = q(t497), i16 = [], r = [], o = [];
                s32.Oo.isEmpty() || (s32.Oo.forEach((t498, c)=>{
                    o.push(s32.Wo(c, e235, n82).then((t)=>{
                        if (t) {
                            s32.isPrimaryClient && s32.sharedClientState.updateQueryState(c.targetId, t.fromCache ? "not-current" : "current"), i16.push(t);
                            const e = or.kn(c.targetId, t);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), s32.$o.Rr(i16), await async function(t500, e236) {
                    const n = q(t500);
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t)=>js.forEach(e236, (e)=>js.forEach(e.Nn, (s)=>n.persistence.referenceDelegate.addReference(t, e.targetId, s)
                                ).next(()=>js.forEach(e.xn, (s)=>n.persistence.referenceDelegate.removeReference(t, e.targetId, s)
                                    )
                                )
                            )
                        );
                    } catch (t) {
                        if (!Hs(t)) throw t;
                        $("LocalStore", "Failed to update sequence numbers: " + t);
                    }
                    for (const t499 of e236){
                        const e = t499.targetId;
                        if (!t499.fromCache) {
                            const t = n.Un.get(e), s = t.snapshotVersion, i = t.withLastLimboFreeSnapshotVersion(s);
                            n.Un = n.Un.insert(e, i);
                        }
                    }
                }(s32.localStore, r));
            }
            async function Tc(t503, e) {
                const n = q(t503);
                if (!n.currentUser.isEqual(e)) {
                    var t501, e237;
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t502 = await hr(n.localStore, e);
                    n.currentUser = e, e237 = "'waitForPendingWrites' promise is rejected due to a user change.", (t501 = n).Ko.forEach((t504)=>{
                        t504.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e237));
                        });
                    }), t501.Ko.clear(), n.sharedClientState.handleUserChange(e, t502.removedBatchIds, t502.addedBatchIds), await pc(n, t502.Wn);
                }
            }
            function Ec(t, e) {
                const n = q(t), s = n.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t = Pn();
                    const s = n.Fo.get(e);
                    if (!s) return t;
                    for (const e238 of s){
                        const s = n.Oo.get(e238);
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
                async initialize(t510) {
                    this.N = Yr(t510.databaseInfo.databaseId), this.sharedClientState = this.Ho(t510), this.persistence = this.Jo(t510), await this.persistence.start(), this.gcScheduler = this.Yo(t510), this.localStore = this.Xo(t510);
                }
                Yo(t505) {
                    return null;
                }
                Xo(t506) {
                    var e;
                    return this.persistence, e = new cr, t506.initialUser, this.N, new ar(this.persistence, e, t506.initialUser, this.N);
                }
                Jo(t507) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t508) {
                    return new Kr;
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class Fc {
                async initialize(t509, e241) {
                    this.localStore || (this.localStore = t509.localStore, this.sharedClientState = t509.sharedClientState, this.datastore = this.createDatastore(e241), this.remoteStore = this.createRemoteStore(e241), this.eventManager = this.createEventManager(e241), this.syncEngine = this.createSyncEngine(e241, !t509.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t)=>cc(this.syncEngine, t, 1)
                    , this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t513) {
                    return new Lo;
                }
                createDatastore(t511) {
                    var e, n;
                    const e239 = Yr(t511.databaseInfo.databaseId), n83 = (t511.databaseInfo, new zr(t511.databaseInfo));
                    return t511.credentials, e = n83, n = e239, new no(t511.credentials, e, n);
                }
                createRemoteStore(t512) {
                    var i, r;
                    return this.localStore, this.datastore, t512.asyncQueue, i = (t)=>cc(this.syncEngine, t, 0)
                    , r = Qr.bt() ? new Qr : new jr, new io(this.localStore, this.datastore, t512.asyncQueue, i, r);
                }
                createSyncEngine(t514, e240) {
                    return (function(t, e, n, s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t514.initialUser, t514.maxConcurrentLimboResolutions, e240);
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
                next(t517) {
                    this.observer.next && this.tc(this.observer.next, t517);
                }
                error(t515) {
                    this.observer.error ? this.tc(this.observer.error, t515) : console.error("Uncaught Error in snapshot listener:", t515);
                }
                ec() {
                    this.muted = !0;
                }
                tc(t516, e242) {
                    this.muted || setTimeout(()=>{
                        this.muted || t516(e242);
                    }, 0);
                }
            }
            class Kc {
                constructor(t518, e243, n84){
                    this.credentials = t518, this.asyncQueue = e243, this.databaseInfo = n84, this.user = D.UNAUTHENTICATED, this.clientId = (class {
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
                    , this.credentials.start(e243, async (t)=>{
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
                setCredentialChangeListener(t519) {
                    this.credentialListener = t519;
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
            async function jc(t520, e) {
                t520.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t520.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t520.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await hr(e.localStore, t), s = t);
                }), e.persistence.setDatabaseDeletedListener(()=>t520.terminate()
                ), t520.offlineComponents = e;
            }
            async function Qc(t521, e244) {
                t521.asyncQueue.verifyOperationInProgress();
                const n85 = await Wc(t521);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s33 = await t521.getConfiguration();
                await e244.initialize(n85, s33), t521.setCredentialChangeListener((t522)=>(async function(t, e) {
                        const n = q(t);
                        n.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(n);
                        n.Wr.add(3), await oo(n), s && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.Wr.delete(3), await ro(n);
                    })(e244.remoteStore, t522)
                ), t521.onlineComponents = e244;
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
                isEqual(t523) {
                    return t523 instanceof ha && t523.projectId === this.projectId && t523.database === this.database;
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
                        var t524;
                        const e = (t524 = t).constructor ? t524.constructor.name : null;
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
                constructor(t525){
                    var e245;
                    if (void 0 === t525.host) {
                        if (void 0 !== t525.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t525.host, this.ssl = null === (e245 = t525.ssl) || void 0 === e245 || e245;
                    if (this.credentials = t525.credentials, this.ignoreUndefinedProperties = !!t525.ignoreUndefinedProperties, void 0 === t525.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t525.cacheSizeBytes && t525.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t525.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t525.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t525.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t525.useFetchStreams, (function(t, e, n, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
                    })("experimentalForceLongPolling", t525.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t525.experimentalAutoDetectLongPolling);
                }
                isEqual(t526) {
                    return this.host === t526.host && this.ssl === t526.ssl && this.credentials === t526.credentials && this.cacheSizeBytes === t526.cacheSizeBytes && this.experimentalForceLongPolling === t526.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t526.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t526.ignoreUndefinedProperties && this.useFetchStreams === t526.useFetchStreams;
                }
            }
            class Ta {
                constructor(t527, e){
                    this._credentials = e, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({
                    }), this._settingsFrozen = !1, t527 instanceof ha ? this._databaseId = t527 : (this._app = t527, this._databaseId = (function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, "\"projectId\" not provided in firebase.initializeApp.");
                        return new ha(t.options.projectId);
                    })(t527));
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
                _setSettings(t528) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t528), void 0 !== t528.credentials && (this._credentials = (function(t) {
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
                    })(t528.credentials));
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
                withConverter(t529) {
                    return new Ia(this.firestore, t529, this._key);
                }
            }
            class Aa {
                constructor(t, e, n){
                    this.converter = e, this._query = n, this.type = "query", this.firestore = t;
                }
                withConverter(t530) {
                    return new Aa(this.firestore, t530, this._query);
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
                withConverter(t531) {
                    return new Ra(this.firestore, t531, this._path);
                }
            }
            function ba(t532, e246, ...n86) {
                if (t532 = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.m9)(t532), (function(t, e, n) {
                    if (!n) throw new j(K.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
                })("collection", "path", e246), t532 instanceof Ta) {
                    const s = ht.fromString(e246, ...n86);
                    return _a(s), new Ra(t532, null, s);
                }
                {
                    if (!(t532 instanceof Ia || t532 instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t532._path.child(ht.fromString(e246, ...n86));
                    return _a(s), new Ra(t532.firestore, null, s);
                }
            }
            class ka extends Ta {
                constructor(t533, e247){
                    super(t533, e247), this.type = "firestore", this._queue = new class {
                        constructor(){
                            this._c = Promise.resolve(), this.mc = [], this.gc = !1, this.yc = [], this.Tc = null, this.Ec = !1, this.Ic = !1, this.Ac = [], this.ar = new Xr(this, "async_queue_retry"), this.Rc = ()=>{
                                const t = Jr();
                                t && $("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                            };
                            const t534 = Jr();
                            t534 && "function" == typeof t534.addEventListener && t534.addEventListener("visibilitychange", this.Rc);
                        }
                        get isShuttingDown() {
                            return this.gc;
                        }
                        enqueueAndForget(t541) {
                            this.enqueue(t541);
                        }
                        enqueueAndForgetEvenWhileRestricted(t535) {
                            this.bc(), this.Pc(t535);
                        }
                        enterRestrictedMode(t536) {
                            if (!this.gc) {
                                this.gc = !0, this.Ic = t536 || !1;
                                const e = Jr();
                                e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                            }
                        }
                        enqueue(t537) {
                            if (this.bc(), this.gc) return new Promise(()=>{
                            });
                            const e = new Q;
                            return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t537().then(e.resolve, e.reject), e.promise)
                            ).then(()=>e.promise
                            );
                        }
                        enqueueRetryable(t538) {
                            this.enqueueAndForget(()=>(this.mc.push(t538), this.vc())
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
                        Pc(t539) {
                            const e249 = this._c.then(()=>(this.Ec = !0, t539().catch((t)=>{
                                    var t540;
                                    this.Tc = t, this.Ec = !1;
                                    let e;
                                    const e248 = (e = (t540 = t).message || "", t540.stack && (e = t540.stack.includes(t540.message) ? t540.stack : t540.message + "\n" + t540.stack), e);
                                    throw O("INTERNAL UNHANDLED ERROR: ", e248), t;
                                }).then((t)=>(this.Ec = !1, t)
                                ))
                            );
                            return this._c = e249, e249;
                        }
                        enqueueAfterDelay(t542, e250, n) {
                            this.bc(), this.Ac.indexOf(t542) > -1 && (e250 = 0);
                            const s = xo.createAndSchedule(this, t542, e250, n, (t)=>this.Vc(t)
                            );
                            return this.yc.push(s), s;
                        }
                        bc() {
                            this.Tc && L();
                        }
                        verifyOperationInProgress() {
                        }
                        async Sc() {
                            let t;
                            do await (t = this._c);
                            while (t !== this._c)
                        }
                        Dc(t544) {
                            for (const e of this.yc)if (e.timerId === t544) return !0;
                            return !1;
                        }
                        Cc(t543) {
                            return this.Sc().then(()=>{
                                for (const e251 of (this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs
                                ), this.yc))if (e251.skipDelay(), "all" !== t543 && e251.timerId === t543) break;
                                return this.Sc();
                            });
                        }
                        Nc(t) {
                            this.Ac.push(t);
                        }
                        Vc(t545) {
                            const e = this.yc.indexOf(t545);
                            this.yc.splice(e, 1);
                        }
                    }, this._persistenceKey = "name" in t533 ? t533.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e, e252, s;
                const n = t._freezeSettings(), s34 = (t._databaseId, e252 = (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, s = n, new ua(t._databaseId, e252, t._persistenceKey, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams));
                t._firestoreClient = new Kc(t._credentials, t._queue, s34);
            }
            class Ja {
                constructor(...t){
                    for(let e = 0; e < t.length; ++e)if (0 === t[e].length) throw new j(K.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new ft(t);
                }
                isEqual(t546) {
                    return this._internalPath.isEqual(t546._internalPath);
                }
            }
            class Xa {
                constructor(t){
                    this._byteString = t;
                }
                static fromBase64String(t549) {
                    try {
                        return new Xa(_t.fromBase64String(t549));
                    } catch (t) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
                    }
                }
                static fromUint8Array(t547) {
                    return new Xa(_t.fromUint8Array(t547));
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
                isEqual(t548) {
                    return this._byteString.isEqual(t548._byteString);
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
                isEqual(t551) {
                    return this._lat === t551._lat && this._long === t551._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(t550) {
                    return et(this._lat, t550._lat) || et(this._long, t550._long);
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
                $c(t562) {
                    return new ru(Object.assign(Object.assign({
                    }, this.settings), t562), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(t552) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t552), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.Mc(t552), s;
                }
                Lc(t553) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t553), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.xc(), s;
                }
                Bc(t554) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(t555) {
                    return bu(t555, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(t556) {
                    return void 0 !== this.fieldMask.find((e)=>t556.isPrefixOf(e)
                    ) || void 0 !== this.fieldTransforms.find((e)=>t556.isPrefixOf(e.field)
                    );
                }
                xc() {
                    if (this.path) for(let t = 0; t < this.path.length; t++)this.Mc(this.path.get(t));
                }
                Mc(t557) {
                    if (0 === t557.length) throw this.Uc("Document fields must not be empty");
                    if (iu(this.kc) && eu.test(t557)) throw this.Uc("Document fields cannot begin and end with \"__\"");
                }
            }
            class uu extends null {
                _toFieldTransform(t558) {
                    if (2 !== t558.kc) throw 1 === t558.kc ? t558.Uc(`${this._methodName}() can only appear at the top level of your update data`) : t558.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return t558.fieldMask.push(t558.path), null;
                }
                isEqual(t559) {
                    return t559 instanceof uu;
                }
            }
            class lu extends null {
                _toFieldTransform(t560) {
                    return new je(t560.path, new Oe);
                }
                isEqual(t561) {
                    return t561 instanceof lu;
                }
            }
            function yu(t563, e253) {
                if (Tu(t563 = getModularInstance(t563))) return Eu("Unsupported field value:", e253, t563), pu(t563, e253);
                if (t563 instanceof Za) return (function(t, e) {
                    if (!iu(e.kc)) throw e.Uc(`${t._methodName}() can only be used with update() and set()`);
                    if (!e.path) throw e.Uc(`${t._methodName}() is not currently supported inside arrays`);
                    const n = t._toFieldTransform(e);
                    n && e.fieldTransforms.push(n);
                })(t563, e253), null;
                if (void 0 === t563 && e253.ignoreUndefinedProperties) return null;
                if (e253.path && e253.fieldMask.push(e253.path), t563 instanceof Array) {
                    if (e253.settings.Fc && 4 !== e253.kc) throw e253.Uc("Nested arrays are not supported");
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
                    })(t563, e253);
                }
                return (function(t, e) {
                    var t564, e254;
                    if (null === (t = getModularInstance(t))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof t) return t564 = e.N, bt(e254 = t) ? De(e254) : Se(t564, e254);
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
                })(t563, e253);
            }
            function pu(t565, e) {
                const n = {
                };
                return at(t565) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : ct(t565, (t, s)=>{
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
                var t566;
                if (!Tu(n) || "object" != typeof (t566 = n) || null === t566 || Object.getPrototypeOf(t566) !== Object.prototype && null !== Object.getPrototypeOf(t566)) {
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
                get(t567) {
                    if (this._document) {
                        const e = this._document.data.field(Su("DocumentSnapshot.get", t567));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            class Vu extends vu {
                data() {
                    return super.data();
                }
            }
            function Su(t568, e255) {
                return "string" == typeof e255 ? (function(t, e, n) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, n);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, n);
                    }
                })(t568, e255) : e255 instanceof Ja ? e255._internalPath : e255._delegate._internalPath;
            }
            class Du {
                constructor(t, e){
                    this.hasPendingWrites = t, this.fromCache = e;
                }
                isEqual(t569) {
                    return this.hasPendingWrites === t569.hasPendingWrites && this.fromCache === t569.fromCache;
                }
            }
            class Cu extends vu {
                constructor(t, e, n, s, i, r){
                    super(t, e, n, s, r), this._firestore = t, this._firestoreImpl = t, this.metadata = i;
                }
                exists() {
                    return super.exists();
                }
                data(t572 = {
                }) {
                    if (this._document) {
                        if (this._converter) {
                            const e = new Nu(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(e, t572);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t572.serverTimestamps);
                    }
                }
                get(t570, e256 = {
                }) {
                    if (this._document) {
                        const n = this._document.data.field(Su("DocumentSnapshot.get", t570));
                        if (null !== n) return this._userDataWriter.convertValue(n, e256.serverTimestamps);
                    }
                }
            }
            class Nu extends Cu {
                data(t571 = {
                }) {
                    return super.data(t571);
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
                forEach(t574, e258) {
                    this._snapshot.docs.forEach((n)=>{
                        t574.call(e258, new Nu(this._firestore, this._userDataWriter, n.key, n, new Du(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(t573 = {
                }) {
                    const e257 = !!t573.includeMetadataChanges;
                    if (e257 && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e257 || (this._cachedChanges = (function(t575, e259) {
                        if (t575._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t575._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t575._firestore, t575._userDataWriter, n.doc.key, n.doc, new Du(t575._snapshot.mutatedKeys.has(n.doc.key), t575._snapshot.fromCache), t575.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                })
                            );
                        }
                        {
                            let n = t575._snapshot.oldDocs;
                            return t575._snapshot.docChanges.filter((t)=>e259 || 3 !== t.type
                            ).map((e)=>{
                                const s = new Nu(t575._firestore, t575._userDataWriter, e.doc.key, e.doc, new Du(t575._snapshot.mutatedKeys.has(e.doc.key), t575._snapshot.fromCache), t575.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: ku(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    })(this, e257), this._cachedChangesIncludeMetadataChanges = e257), this._cachedChanges;
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
                convertValue(t579, e264 = "none") {
                    switch(vt(t579)){
                        case 0:
                            return null;
                        case 1:
                            return t579.booleanValue;
                        case 2:
                            return yt(t579.integerValue || t579.doubleValue);
                        case 3:
                            return this.convertTimestamp(t579.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(t579, e264);
                        case 5:
                            return t579.stringValue;
                        case 6:
                            return this.convertBytes(pt(t579.bytesValue));
                        case 7:
                            return this.convertReference(t579.referenceValue);
                        case 8:
                            return this.convertGeoPoint(t579.geoPointValue);
                        case 9:
                            return this.convertArray(t579.arrayValue, e264);
                        case 10:
                            return this.convertObject(t579.mapValue, e264);
                        default:
                            throw L();
                    }
                }
                convertObject(t576, e260) {
                    const n = {
                    };
                    return ct(t576.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e260);
                    }), n;
                }
                convertGeoPoint(t577) {
                    return new tu(yt(t577.latitude), yt(t577.longitude));
                }
                convertArray(t578, e261) {
                    return (t578.values || []).map((t)=>this.convertValue(t, e261)
                    );
                }
                convertServerTimestamp(t582, e262) {
                    switch(e262){
                        case "previous":
                            const n = Et(t582);
                            return null == n ? null : this.convertValue(n, e262);
                        case "estimate":
                            return this.convertTimestamp(It(t582));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t580) {
                    const e = gt(t580);
                    return new it(e.seconds, e.nanos);
                }
                convertDocumentKey(t581, e263) {
                    const n = ht.fromString(t581);
                    B(Ts(n));
                    const s = new ha(n.get(1), n.get(3)), i = new Pt(n.popFirst(5));
                    return s.isEqual(e263) || O(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e263.projectId}/${e263.database}) instead.`), i;
                }
            }
            class ah extends nh {
                constructor(t){
                    super(), this.firestore = t;
                }
                convertBytes(t585) {
                    return new Xa(t585);
                }
                convertReference(t583) {
                    const e = this.convertDocumentKey(t583, this.firestore._databaseId);
                    return new Ia(this.firestore, null, e);
                }
            }
            function lh(t586) {
                var t584;
                t586 = ga(t586, Aa);
                const e265 = ga(t586.firestore, ka), n87 = ((t584 = e265)._firestoreClient || Ma(t584), t584._firestoreClient.verifyNotTerminated(), t584._firestoreClient), s35 = new ah(e265);
                return (function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                })(t586._query), (function(t587, e266, n88 = {
                }) {
                    const s36 = new Q;
                    return t587.asyncQueue.enqueueAndForget(async ()=>(function(t588, e, n89, s, i) {
                            const r = new Lc({
                                next: (n)=>{
                                    e.enqueueAndForget(()=>Uo(t588, o)
                                    ), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, "Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to \"server\" to retrieve the cached documents.)")) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), o = new Qo(n89, r, {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t588, o);
                        })(await Xc(t587), t587.asyncQueue, e266, n88, s36)
                    ), s36.promise;
                })(n87, t586._query).then((n)=>new xu(e265, s35, t586, n)
                );
            }
            !function(t589, e = !0) {
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
