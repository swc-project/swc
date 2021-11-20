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
                constructor(t2){
                    this.uid = t2;
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
                constructor(t3, e2){
                    super(e2), this.code = t3, this.message = e2, this.name = "FirebaseError", this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`
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
                constructor(t7, e5){
                    this.user = e5, this.type = "OAuth", this.authHeaders = {
                    }, this.authHeaders.Authorization = `Bearer ${t7}`;
                }
            }
            class G {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {
                }
                start(t4, e3) {
                    t4.enqueueRetryable(()=>e3(D.UNAUTHENTICATED)
                    );
                }
                shutdown() {
                }
            }
            class H {
                constructor(t5){
                    this.t = t5, this.currentUser = D.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t6, e4) {
                    let n = this.i;
                    const s = (t)=>this.i !== n ? (n = this.i, e4(t)) : Promise.resolve()
                    ;
                    let i = new Q;
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q, t6.enqueueRetryable(()=>s(this.currentUser)
                        );
                    };
                    const r = ()=>{
                        const e = i;
                        t6.enqueueRetryable(async ()=>{
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
                    const t = this.i, e6 = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e6).then((e)=>this.i !== t ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? (B("string" == typeof e.accessToken), new W(e.accessToken, this.currentUser)) : null
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
                constructor(t11, e11, n2){
                    this.h = t11, this.l = e11, this.m = n2, this.type = "FirstParty", this.user = D.FIRST_PARTY;
                }
                get authHeaders() {
                    const t = {
                        "X-Goog-AuthUser": this.l
                    }, e = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return e && (t.Authorization = e), this.m && (t["X-Goog-Iam-Authorization-Token"] = this.m), t;
                }
            }
            class Y {
                constructor(t8, e7, n1){
                    this.h = t8, this.l = e7, this.m = n1;
                }
                getToken() {
                    return Promise.resolve(new J(this.h, this.l, this.m));
                }
                start(t9, e8) {
                    t9.enqueueRetryable(()=>e8(D.FIRST_PARTY)
                    );
                }
                shutdown() {
                }
                invalidateToken() {
                }
            }
            class X {
                constructor(t10, e9){
                    this.previousValue = t10, e9 && (e9.sequenceNumberHandler = (t)=>this.g(t)
                    , this.p = (t)=>e9.writeSequenceNumber(t)
                    );
                }
                g(t12) {
                    return this.previousValue = Math.max(t12, this.previousValue), this.previousValue;
                }
                next() {
                    const t = ++this.previousValue;
                    return this.p && this.p(t), t;
                }
            }
            function Z(t) {
                const e = "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
                if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                else for(let e10 = 0; e10 < t; e10++)n[e10] = Math.floor(256 * Math.random());
                return n;
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            function nt(t13, e, n) {
                return t13.length === e.length && t13.every((t, s)=>n(t, e[s])
                );
            }
            X.T = -1;
            class it {
                constructor(t22, e12){
                    if (this.seconds = t22, this.nanoseconds = e12, e12 < 0) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e12);
                    if (e12 >= 1000000000) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e12);
                    if (t22 < -62135596800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t22);
                    if (t22 >= 253402300800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t22);
                }
                static now() {
                    return it.fromMillis(Date.now());
                }
                static fromDate(t14) {
                    return it.fromMillis(t14.getTime());
                }
                static fromMillis(t15) {
                    const e = Math.floor(t15 / 1000);
                    return new it(e, Math.floor(1000000 * (t15 - 1000 * e)));
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1000 * this.seconds + this.nanoseconds / 1000000;
                }
                _compareTo(t16) {
                    return this.seconds === t16.seconds ? et(this.nanoseconds, t16.nanoseconds) : et(this.seconds, t16.seconds);
                }
                isEqual(t17) {
                    return t17.seconds === this.seconds && t17.nanoseconds === this.nanoseconds;
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
                constructor(t18){
                    this.timestamp = t18;
                }
                static fromTimestamp(t19) {
                    return new rt(t19);
                }
                static min() {
                    return new rt(new it(0, 0));
                }
                compareTo(t20) {
                    return this.timestamp._compareTo(t20.timestamp);
                }
                isEqual(t21) {
                    return this.timestamp.isEqual(t21.timestamp);
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
                constructor(t25, e16, n5){
                    void 0 === e16 ? e16 = 0 : 0 > t25.length && L(), void 0 === n5 ? n5 = t25.length - 0 : n5 > t25.length - 0 && L(), this.segments = t25, this.offset = 0, this.len = n5;
                }
                get length() {
                    return this.len;
                }
                isEqual(t23) {
                    return 0 === ut.comparator(this, t23);
                }
                child(t24) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t24 instanceof ut ? t24.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t24), this.construct(e);
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(t33) {
                    return t33 = void 0 === t33 ? 1 : t33, this.construct(this.segments, this.offset + t33, this.length - t33);
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
                get(t26) {
                    return this.segments[this.offset + t26];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(t27) {
                    if (t27.length < this.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t27.get(e)) return !1;
                    return !0;
                }
                isImmediateParentOf(t28) {
                    if (this.length + 1 !== t28.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t28.get(e)) return !1;
                    return !0;
                }
                forEach(t29) {
                    for(let e = this.offset, n = this.limit(); e < n; e++)t29(this.segments[e]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(t30, e13) {
                    const n = Math.min(t30.length, e13.length);
                    for(let s = 0; s < n; s++){
                        const n = t30.get(s), i = e13.get(s);
                        if (n < i) return -1;
                        if (n > i) return 1;
                    }
                    return t30.length < e13.length ? -1 : t30.length > e13.length ? 1 : 0;
                }
            }
            class ht extends ut {
                construct(t31, e14, n3) {
                    return new ht(t31, e14, n3);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...t32) {
                    const e = [];
                    for (const n of t32){
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
                construct(t35, e15, n4) {
                    return new ft(t35, e15, n4);
                }
                static isValidIdentifier(t34) {
                    return lt.test(t34);
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
                static fromServerFormat(t39) {
                    const e = [];
                    let n = "", s = 0;
                    const i = ()=>{
                        if (0 === n.length) throw new j(K.INVALID_ARGUMENT, `Invalid field path (${t39}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n), n = "";
                    };
                    let r = !1;
                    for(; s < t39.length;){
                        const e = t39[s];
                        if ("\\" === e) {
                            if (s + 1 === t39.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t39);
                            const e = t39[s + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t39);
                            n += e, s += 2;
                        } else "`" === e ? (r = !r, s++) : "." !== e || r ? (n += e, s++) : (i(), s++);
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t39);
                    return new ft(e);
                }
                static emptyPath() {
                    return new ft([]);
                }
            }
            class dt {
                constructor(t36){
                    this.fields = t36, t36.sort(ft.comparator);
                }
                covers(t37) {
                    for (const e of this.fields)if (e.isPrefixOf(t37)) return !0;
                    return !1;
                }
                isEqual(t38) {
                    return nt(this.fields, t38.fields, (t, e)=>t.isEqual(e)
                    );
                }
            }
            class _t {
                constructor(t42){
                    this.binaryString = t42;
                }
                static fromBase64String(t40) {
                    const e = atob(t40);
                    return new _t(e);
                }
                static fromUint8Array(t41) {
                    const e17 = function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(t41);
                    return new _t(e17);
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
                compareTo(t44) {
                    return et(this.binaryString, t44.binaryString);
                }
                isEqual(t43) {
                    return this.binaryString === t43.binaryString;
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
                constructor(t52){
                    this.path = t52;
                }
                static fromPath(t45) {
                    return new Pt(ht.fromString(t45));
                }
                static fromName(t46) {
                    return new Pt(ht.fromString(t46).popFirst(5));
                }
                hasCollectionId(t47) {
                    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t47;
                }
                isEqual(t48) {
                    return null !== t48 && 0 === ht.comparator(this.path, t48.path);
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t49, e20) {
                    return ht.comparator(t49.path, e20.path);
                }
                static isDocumentKey(t50) {
                    return t50.length % 2 == 0;
                }
                static fromSegments(t51) {
                    return new Pt(new ht(t51.slice()));
                }
            }
            function vt(t) {
                return "nullValue" in t ? 0 : "booleanValue" in t ? 1 : "integerValue" in t || "doubleValue" in t ? 2 : "timestampValue" in t ? 3 : "stringValue" in t ? 5 : "bytesValue" in t ? 6 : "referenceValue" in t ? 7 : "geoPointValue" in t ? 8 : "arrayValue" in t ? 9 : "mapValue" in t ? Tt(t) ? 4 : 10 : L();
            }
            function Vt(t55, e21) {
                var t53, e18, t54, e19;
                const n6 = vt(t55);
                if (n6 !== vt(e21)) return !1;
                switch(n6){
                    case 0:
                        return !0;
                    case 1:
                        return t55.booleanValue === e21.booleanValue;
                    case 4:
                        return It(t55).isEqual(It(e21));
                    case 3:
                        return (function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) return t.timestampValue === e.timestampValue;
                            const n = gt(t.timestampValue), s = gt(e.timestampValue);
                            return n.seconds === s.seconds && n.nanos === s.nanos;
                        })(t55, e21);
                    case 5:
                        return t55.stringValue === e21.stringValue;
                    case 6:
                        return t53 = t55, e18 = e21, pt(t53.bytesValue).isEqual(pt(e18.bytesValue));
                    case 7:
                        return t55.referenceValue === e21.referenceValue;
                    case 8:
                        return t54 = t55, e19 = e21, yt(t54.geoPointValue.latitude) === yt(e19.geoPointValue.latitude) && yt(t54.geoPointValue.longitude) === yt(e19.geoPointValue.longitude);
                    case 2:
                        return (function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return yt(t.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = yt(t.doubleValue), s = yt(e.doubleValue);
                                return n === s ? Rt(n) === Rt(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        })(t55, e21);
                    case 9:
                        return nt(t55.arrayValue.values || [], e21.arrayValue.values || [], Vt);
                    case 10:
                        return (function(t, e) {
                            const n = t.mapValue.fields || {
                            }, s = e.mapValue.fields || {
                            };
                            if (ot(n) !== ot(s)) return !1;
                            for(const t56 in n)if (n.hasOwnProperty(t56) && (void 0 === s[t56] || !Vt(n[t56], s[t56]))) return !1;
                            return !0;
                        })(t55, e21);
                    default:
                        return L();
                }
            }
            function St(t57, e) {
                return void 0 !== (t57.values || []).find((t)=>Vt(t, e)
                );
            }
            function Dt(t58, e22) {
                const n7 = vt(t58), s1 = vt(e22);
                if (n7 !== s1) return et(n7, s1);
                switch(n7){
                    case 0:
                        return 0;
                    case 1:
                        return et(t58.booleanValue, e22.booleanValue);
                    case 2:
                        return (function(t, e) {
                            const n = yt(t.integerValue || t.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        })(t58, e22);
                    case 3:
                        return Ct(t58.timestampValue, e22.timestampValue);
                    case 4:
                        return Ct(It(t58), It(e22));
                    case 5:
                        return et(t58.stringValue, e22.stringValue);
                    case 6:
                        return (function(t, e) {
                            const n = pt(t), s = pt(e);
                            return n.compareTo(s);
                        })(t58.bytesValue, e22.bytesValue);
                    case 7:
                        return (function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let t59 = 0; t59 < n.length && t59 < s.length; t59++){
                                const e = et(n[t59], s[t59]);
                                if (0 !== e) return e;
                            }
                            return et(n.length, s.length);
                        })(t58.referenceValue, e22.referenceValue);
                    case 8:
                        return (function(t, e) {
                            const n = et(yt(t.latitude), yt(e.latitude));
                            return 0 !== n ? n : et(yt(t.longitude), yt(e.longitude));
                        })(t58.geoPointValue, e22.geoPointValue);
                    case 9:
                        return (function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let t60 = 0; t60 < n.length && t60 < s.length; ++t60){
                                const e = Dt(n[t60], s[t60]);
                                if (e) return e;
                            }
                            return et(n.length, s.length);
                        })(t58.arrayValue, e22.arrayValue);
                    case 10:
                        return (function(t, e) {
                            const n = t.fields || {
                            }, s = Object.keys(n), i = e.fields || {
                            }, r = Object.keys(i);
                            s.sort(), r.sort();
                            for(let t61 = 0; t61 < s.length && t61 < r.length; ++t61){
                                const e = et(s[t61], r[t61]);
                                if (0 !== e) return e;
                                const o = Dt(n[s[t61]], i[r[t61]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        })(t58.mapValue, e22.mapValue);
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
            function xt(t62) {
                var e23, n8;
                return "nullValue" in t62 ? "null" : "booleanValue" in t62 ? "" + t62.booleanValue : "integerValue" in t62 ? "" + t62.integerValue : "doubleValue" in t62 ? "" + t62.doubleValue : "timestampValue" in t62 ? (function(t) {
                    const e = gt(t);
                    return `time(${e.seconds},${e.nanos})`;
                })(t62.timestampValue) : "stringValue" in t62 ? t62.stringValue : "bytesValue" in t62 ? pt(t62.bytesValue).toBase64() : "referenceValue" in t62 ? (n8 = t62.referenceValue, Pt.fromName(n8).toString()) : "geoPointValue" in t62 ? `geo(${(e23 = t62.geoPointValue).latitude},${e23.longitude})` : "arrayValue" in t62 ? (function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? n = !1 : e += ",", e += xt(s);
                    return e + "]";
                })(t62.arrayValue) : "mapValue" in t62 ? (function(t) {
                    const e = Object.keys(t.fields || {
                    }).sort();
                    let n = "{", s = !0;
                    for (const i of e)s ? s = !1 : n += ",", n += `${i}:${xt(t.fields[i])}`;
                    return n + "}";
                })(t62.mapValue) : L();
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
                constructor(t66){
                    this.value = t66;
                }
                static empty() {
                    return new Ut({
                        mapValue: {
                        }
                    });
                }
                field(t63) {
                    if (t63.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n = 0; n < t63.length - 1; ++n)if (!Lt(e = (e.mapValue.fields || {
                        })[t63.get(n)])) return null;
                        return (e = (e.mapValue.fields || {
                        })[t63.lastSegment()]) || null;
                    }
                }
                set(t64, e31) {
                    this.getFieldsMap(t64.popLast())[t64.lastSegment()] = Bt(e31);
                }
                setAll(t65) {
                    let e = ft.emptyPath(), n = {
                    }, s = [];
                    t65.forEach((t, i)=>{
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
                delete(t80) {
                    const e = this.field(t80.popLast());
                    Lt(e) && e.mapValue.fields && delete e.mapValue.fields[t80.lastSegment()];
                }
                isEqual(t67) {
                    return Vt(this.value, t67.value);
                }
                getFieldsMap(t68) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {
                        }
                    });
                    for(let n = 0; n < t68.length; ++n){
                        let s = e.mapValue.fields[t68.get(n)];
                        Lt(s) && s.mapValue.fields || (s = {
                            mapValue: {
                                fields: {
                                }
                            }
                        }, e.mapValue.fields[t68.get(n)] = s), e = s;
                    }
                    return e.mapValue.fields;
                }
                applyChanges(t69, e24, n9) {
                    for (const e of (ct(e24, (e, n)=>t69[e] = n
                    ), n9))delete t69[e];
                }
                clone() {
                    return new Ut(Bt(this.value));
                }
            }
            class Kt {
                constructor(t70, e25, n12, s3, i3){
                    this.key = t70, this.documentType = e25, this.version = n12, this.data = s3, this.documentState = i3;
                }
                static newInvalidDocument(t71) {
                    return new Kt(t71, 0, rt.min(), Ut.empty(), 0);
                }
                static newFoundDocument(t72, e26, n10) {
                    return new Kt(t72, 1, e26, n10, 0);
                }
                static newNoDocument(t73, e27) {
                    return new Kt(t73, 2, e27, Ut.empty(), 0);
                }
                static newUnknownDocument(t74, e28) {
                    return new Kt(t74, 3, e28, Ut.empty(), 2);
                }
                convertToFoundDocument(t75, e29) {
                    return this.version = t75, this.documentType = 1, this.data = e29, this.documentState = 0, this;
                }
                convertToNoDocument(t76) {
                    return this.version = t76, this.documentType = 2, this.data = Ut.empty(), this.documentState = 0, this;
                }
                convertToUnknownDocument(t77) {
                    return this.version = t77, this.documentType = 3, this.data = Ut.empty(), this.documentState = 2, this;
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
                isEqual(t78) {
                    return t78 instanceof Kt && this.key.isEqual(t78.key) && this.version.isEqual(t78.version) && this.documentType === t78.documentType && this.documentState === t78.documentState && this.data.isEqual(t78.data);
                }
                clone() {
                    return new Kt(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class jt {
                constructor(t79, e30 = null, n11 = [], s2 = [], i2 = null, r1 = null, o1 = null){
                    this.path = t79, this.collectionGroup = e30, this.orderBy = n11, this.filters = s2, this.limit = i2, this.startAt = r1, this.endAt = o1, this.A = null;
                }
            }
            function Qt(t, e = null, n = [], s = [], i = null, r = null, o = null) {
                return new jt(t, e, n, s, i, r, o);
            }
            function Wt(t83) {
                const e = q(t83);
                if (null === e.A) {
                    let t81 = e.path.canonicalString();
                    null !== e.collectionGroup && (t81 += "|cg:" + e.collectionGroup), t81 += "|f:", t81 += e.filters.map((t)=>Yt(t)
                    ).join(","), t81 += "|ob:", t81 += e.orderBy.map((t)=>{
                        var t82;
                        return (t82 = t).field.canonicalString() + t82.dir;
                    }).join(","), At(e.limit) || (t81 += "|l:", t81 += e.limit), e.startAt && (t81 += "|lb:", t81 += ce(e.startAt)), e.endAt && (t81 += "|ub:", t81 += ce(e.endAt)), e.A = t81;
                }
                return e.A;
            }
            function zt(t, e) {
                var n, s;
                if (t.limit !== e.limit) return !1;
                if (t.orderBy.length !== e.orderBy.length) return !1;
                for(let n13 = 0; n13 < t.orderBy.length; n13++)if (!ue(t.orderBy[n13], e.orderBy[n13])) return !1;
                if (t.filters.length !== e.filters.length) return !1;
                for(let i = 0; i < t.filters.length; i++)if (n = t.filters[i], s = e.filters[i], n.op !== s.op || !n.field.isEqual(s.field) || !Vt(n.value, s.value)) return !1;
                return t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!le(t.startAt, e.startAt) && le(t.endAt, e.endAt);
            }
            function Ht(t) {
                return Pt.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length;
            }
            class Jt extends class {
            } {
                constructor(t88, e36, n17){
                    super(), this.field = t88, this.op = e36, this.value = n17;
                }
                static create(t84, e32, n14) {
                    return t84.isKeyField() ? "in" === e32 || "not-in" === e32 ? this.R(t84, e32, n14) : new Xt(t84, e32, n14) : "array-contains" === e32 ? new ne(t84, n14) : "in" === e32 ? new se(t84, n14) : "not-in" === e32 ? new ie(t84, n14) : "array-contains-any" === e32 ? new re(t84, n14) : new Jt(t84, e32, n14);
                }
                static R(t85, e33, n15) {
                    return "in" === e33 ? new Zt(t85, n15) : new te(t85, n15);
                }
                matches(t86) {
                    const e = t86.data.field(this.field);
                    return "!=" === this.op ? null !== e && this.P(Dt(e, this.value)) : null !== e && vt(this.value) === vt(e) && this.P(Dt(e, this.value));
                }
                P(t87) {
                    switch(this.op){
                        case "<":
                            return t87 < 0;
                        case "<=":
                            return t87 <= 0;
                        case "==":
                            return 0 === t87;
                        case "!=":
                            return 0 !== t87;
                        case ">":
                            return t87 > 0;
                        case ">=":
                            return t87 >= 0;
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
                constructor(t94, e34, n16){
                    super(t94, e34, n16), this.key = Pt.fromName(n16.referenceValue);
                }
                matches(t89) {
                    const e = Pt.comparator(t89.key, this.key);
                    return this.P(e);
                }
            }
            class Zt extends Jt {
                constructor(t90, e35){
                    super(t90, "in", e35), this.keys = ee("in", e35);
                }
                matches(t91) {
                    return this.keys.some((e)=>e.isEqual(t91.key)
                    );
                }
            }
            class te extends Jt {
                constructor(t92, e37){
                    super(t92, "not-in", e37), this.keys = ee("not-in", e37);
                }
                matches(t93) {
                    return !this.keys.some((e)=>e.isEqual(t93.key)
                    );
                }
            }
            function ee(t95, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>Pt.fromName(t.referenceValue)
                );
            }
            class ne extends Jt {
                constructor(t103, e43){
                    super(t103, "array-contains", e43);
                }
                matches(t96) {
                    const e = t96.data.field(this.field);
                    return Ot(e) && St(e.arrayValue, this.value);
                }
            }
            class se extends Jt {
                constructor(t97, e38){
                    super(t97, "in", e38);
                }
                matches(t98) {
                    const e = t98.data.field(this.field);
                    return null !== e && St(this.value.arrayValue, e);
                }
            }
            class ie extends Jt {
                constructor(t99, e39){
                    super(t99, "not-in", e39);
                }
                matches(t100) {
                    if (St(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t100.data.field(this.field);
                    return null !== e && !St(this.value.arrayValue, e);
                }
            }
            class re extends Jt {
                constructor(t101, e40){
                    super(t101, "array-contains-any", e40);
                }
                matches(t102) {
                    const e = t102.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>St(this.value.arrayValue, t)
                    );
                }
            }
            class oe {
                constructor(t104, e41){
                    this.position = t104, this.before = e41;
                }
            }
            function ce(t105) {
                return `${t105.before ? "b" : "a"}:${t105.position.map((t)=>Nt(t)
                ).join(",")}`;
            }
            class ae {
                constructor(t106, e42 = "asc"){
                    this.field = t106, this.dir = e42;
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
                constructor(t107, e44 = null, n18 = [], s4 = [], i4 = null, r2 = "F", o2 = null, c1 = null){
                    this.path = t107, this.collectionGroup = e44, this.explicitOrderBy = n18, this.filters = s4, this.limit = i4, this.limitType = r2, this.startAt = o2, this.endAt = c1, this.V = null, this.S = null, this.startAt, this.endAt;
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
                const e45 = q(t);
                if (null === e45.V) {
                    var t108;
                    e45.V = [];
                    const t109 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(e45), n = (t108 = e45).explicitOrderBy.length > 0 ? t108.explicitOrderBy[0].field : null;
                    if (null !== t109 && null === n) t109.isKeyField() || e45.V.push(new ae(t109)), e45.V.push(new ae(ft.keyField(), "asc"));
                    else {
                        let t = !1;
                        for (const n of e45.explicitOrderBy)e45.V.push(n), n.field.isKeyField() && (t = !0);
                        if (!t) {
                            const t = e45.explicitOrderBy.length > 0 ? e45.explicitOrderBy[e45.explicitOrderBy.length - 1].dir : "asc";
                            e45.V.push(new ae(ft.keyField(), t));
                        }
                    }
                }
                return e45.V;
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
                    const n19 = e.endAt ? new oe(e.endAt.position, !e.endAt.before) : null, s = e.startAt ? new oe(e.startAt.position, !e.startAt.before) : null;
                    e.S = Qt(e.path, e.collectionGroup, t, e.filters, e.limit, n19, s);
                }
                return e.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t111) {
                var t110;
                let e46;
                return `Query(target=${e46 = (t110 = Ee(t111)).path.canonicalString(), null !== t110.collectionGroup && (e46 += " collectionGroup=" + t110.collectionGroup), t110.filters.length > 0 && (e46 += `, filters: [${t110.filters.map((t)=>{
                    var e;
                    return `${(e = t).field.canonicalString()} ${e.op} ${Nt(e.value)}`;
                }).join(", ")}]`), At(t110.limit) || (e46 += ", limit: " + t110.limit), t110.orderBy.length > 0 && (e46 += `, orderBy: [${t110.orderBy.map((t)=>{
                    var t112;
                    return t112 = t, `${t112.field.canonicalString()} (${t112.dir})`;
                }).join(", ")}]`), t110.startAt && (e46 += ", startAt: " + ce(t110.startAt)), t110.endAt && (e46 += ", endAt: " + ce(t110.endAt)), `Target(${e46})`}; limitType=${t111.limitType})`;
            }
            function Pe(t114, e48) {
                var t113, e47;
                return e48.isFoundDocument() && (function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                })(t114, e48) && (function(t, e) {
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                })(t114, e48) && (function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                })(t114, e48) && (t113 = t114, e47 = e48, (!t113.startAt || !!he(t113.startAt, Te(t113), e47)) && !(t113.endAt && he(t113.endAt, Te(t113), e47)));
            }
            function ve(t115) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t115)){
                        const t = Ve(i, e, n);
                        if (0 !== t) return t;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            function Ve(t116, e49, n20) {
                const s5 = t116.field.isKeyField() ? Pt.comparator(e49.key, n20.key) : function(t, e, n) {
                    const s = e.data.field(t), i = n.data.field(t);
                    return null !== s && null !== i ? Dt(s, i) : L();
                }(t116.field, e49, n20);
                switch(t116.dir){
                    case "asc":
                        return s5;
                    case "desc":
                        return -1 * s5;
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
            function xe(t117, e50, n21) {
                return t117 instanceof Oe ? (function(t, e) {
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
                })(n21, e50) : t117 instanceof Fe ? Me(t117, e50) : t117 instanceof Le ? Be(t117, e50) : (function(t, e) {
                    const n = $e(t, e), s = qe(n) + qe(t.C);
                    return $t(n) && $t(t.C) ? De(s) : Se(t.N, s);
                })(t117, e50);
            }
            function ke(t, e, n) {
                return t instanceof Fe ? Me(t, e) : t instanceof Le ? Be(t, e) : n;
            }
            function $e(t, e) {
                var n, t118;
                return t instanceof Ue ? $t(n = e) || (t118 = n) && "doubleValue" in t118 ? e : {
                    integerValue: 0
                } : null;
            }
            class Oe extends Ne {
            }
            class Fe extends Ne {
                constructor(t119){
                    super(), this.elements = t119;
                }
            }
            function Me(t120, e) {
                const n = Ke(e);
                for (const e51 of t120.elements)n.some((t)=>Vt(t, e51)
                ) || n.push(e51);
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class Le extends Ne {
                constructor(t121){
                    super(), this.elements = t121;
                }
            }
            function Be(t122, e) {
                let n = Ke(e);
                for (const e52 of t122.elements)n = n.filter((t)=>!Vt(t, e52)
                );
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            class Ue extends Ne {
                constructor(t123, e56){
                    super(), this.N = t123, this.C = e56;
                }
            }
            function qe(t) {
                return yt(t.integerValue || t.doubleValue);
            }
            function Ke(t) {
                return Ot(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
            }
            class je {
                constructor(t129, e53){
                    this.field = t129, this.transform = e53;
                }
            }
            class We {
                constructor(t124, e54){
                    this.version = t124, this.transformResults = e54;
                }
            }
            class Ge {
                constructor(t125, e55){
                    this.updateTime = t125, this.exists = e55;
                }
                static none() {
                    return new Ge;
                }
                static exists(t126) {
                    return new Ge(void 0, t126);
                }
                static updateTime(t127) {
                    return new Ge(t127);
                }
                get isNone() {
                    return void 0 === this.updateTime && void 0 === this.exists;
                }
                isEqual(t128) {
                    return this.exists === t128.exists && (this.updateTime ? !!t128.updateTime && this.updateTime.isEqual(t128.updateTime) : !t128.updateTime);
                }
            }
            function ze(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            class He {
            }
            function Je(t130, e57, n22) {
                t130 instanceof en ? (function(t, e, n) {
                    const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                    s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                })(t130, e57, n22) : t130 instanceof nn ? (function(t, e, n) {
                    if (!ze(t.precondition, e)) return void e.convertToUnknownDocument(n.version);
                    const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                })(t130, e57, n22) : (function(t, e, n) {
                    e.convertToNoDocument(n.version).setHasCommittedMutations();
                })(0, e57, n22);
            }
            function Ye(t132, e59, n23) {
                var t131, e58;
                t132 instanceof en ? (function(t, e, n) {
                    if (ze(t.precondition, e)) {
                        const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                        s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                    }
                })(t132, e59, n23) : t132 instanceof nn ? (function(t, e, n) {
                    if (ze(t.precondition, e)) {
                        const s = on(t.fieldTransforms, n, e), i = e.data;
                        i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                    }
                })(t132, e59, n23) : (t131 = t132, e58 = e59, ze(t131.precondition, e58) && e58.convertToNoDocument(rt.min()));
            }
            function Ze(t136, e63) {
                var t133, e60;
                return t136.type === e63.type && !!t136.key.isEqual(e63.key) && !!t136.precondition.isEqual(e63.precondition) && (t133 = t136.fieldTransforms, e60 = e63.fieldTransforms, !!(void 0 === t133 && void 0 === e60 || !(!t133 || !e60) && nt(t133, e60, (t, e)=>{
                    var t134, e61, t135, e62;
                    return t134 = t, e61 = e, t134.field.isEqual(e61.field) && (t135 = t134.transform, e62 = e61.transform, t135 instanceof Fe && e62 instanceof Fe || t135 instanceof Le && e62 instanceof Le ? nt(t135.elements, e62.elements, Vt) : t135 instanceof Ue && e62 instanceof Ue ? Vt(t135.C, e62.C) : t135 instanceof Oe && e62 instanceof Oe);
                })) && (0 === t136.type ? t136.value.isEqual(e63.value) : 1 !== t136.type || t136.data.isEqual(e63.data) && t136.fieldMask.isEqual(e63.fieldMask)));
            }
            function tn(t) {
                return t.isFoundDocument() ? t.version : rt.min();
            }
            class en extends He {
                constructor(t138, e65, n25, s7 = []){
                    super(), this.key = t138, this.value = e65, this.precondition = n25, this.fieldTransforms = s7, this.type = 0;
                }
            }
            class nn extends He {
                constructor(t137, e64, n24, s6, i5 = []){
                    super(), this.key = t137, this.data = e64, this.fieldMask = n24, this.precondition = s6, this.fieldTransforms = i5, this.type = 1;
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
                constructor(t141, e69){
                    super(), this.key = t141, this.precondition = e69, this.type = 2, this.fieldTransforms = [];
                }
            }
            class an extends null {
                constructor(t139, e66){
                    super(), this.key = t139, this.precondition = e66, this.type = 3, this.fieldTransforms = [];
                }
            }
            class un {
                constructor(t140){
                    this.count = t140;
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
                constructor(t173, e67){
                    this.comparator = t173, this.root = e67 || mn.EMPTY;
                }
                insert(t142, e68) {
                    return new wn(this.comparator, this.root.insert(t142, e68, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                remove(t143) {
                    return new wn(this.comparator, this.root.remove(t143, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                get(t144) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n = this.comparator(t144, e.key);
                        if (0 === n) return e.value;
                        n < 0 ? e = e.left : n > 0 && (e = e.right);
                    }
                    return null;
                }
                indexOf(t145) {
                    let e = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const s = this.comparator(t145, n.key);
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
                inorderTraversal(t146) {
                    return this.root.inorderTraversal(t146);
                }
                forEach(t147) {
                    this.inorderTraversal((e, n)=>(t147(e, n), !1)
                    );
                }
                toString() {
                    const t = [];
                    return this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)
                    ), `{${t.join(", ")}}`;
                }
                reverseTraversal(t148) {
                    return this.root.reverseTraversal(t148);
                }
                getIterator() {
                    return new _n(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t149) {
                    return new _n(this.root, t149, this.comparator, !1);
                }
                getReverseIterator() {
                    return new _n(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t150) {
                    return new _n(this.root, t150, this.comparator, !0);
                }
            }
            class _n {
                constructor(t151, e76, n30, s14){
                    this.isReverse = s14, this.nodeStack = [];
                    let i = 1;
                    for(; !t151.isEmpty();)if (i = e76 ? n30(t151.key, e76) : 1, s14 && (i *= -1), i < 0) t151 = this.isReverse ? t151.left : t151.right;
                    else {
                        if (0 === i) {
                            this.nodeStack.push(t151);
                            break;
                        }
                        this.nodeStack.push(t151), t151 = this.isReverse ? t151.right : t151.left;
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
                constructor(t152, e70, n26, s8, i9){
                    this.key = t152, this.value = e70, this.color = null != n26 ? n26 : mn.RED, this.left = null != s8 ? s8 : mn.EMPTY, this.right = null != i9 ? i9 : mn.EMPTY, this.size = this.left.size + 1 + this.right.size;
                }
                copy(t153, e71, n27, s9, i6) {
                    return new mn(null != t153 ? t153 : this.key, null != e71 ? e71 : this.value, null != n27 ? n27 : this.color, null != s9 ? s9 : this.left, null != i6 ? i6 : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(t154) {
                    return this.left.inorderTraversal(t154) || t154(this.key, this.value) || this.right.inorderTraversal(t154);
                }
                reverseTraversal(t155) {
                    return this.right.reverseTraversal(t155) || t155(this.key, this.value) || this.left.reverseTraversal(t155);
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
                insert(t156, e72, n28) {
                    let s = this;
                    const i = n28(t156, s.key);
                    return (s = i < 0 ? s.copy(null, null, null, s.left.insert(t156, e72, n28), null) : 0 === i ? s.copy(null, e72, null, null, null) : s.copy(null, null, null, null, s.right.insert(t156, e72, n28))).fixUp();
                }
                removeMin() {
                    if (this.left.isEmpty()) return mn.EMPTY;
                    let t = this;
                    return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), (t = t.copy(null, null, null, t.left.removeMin(), null)).fixUp();
                }
                remove(t157, e73) {
                    let n, s = this;
                    if (0 > e73(t157, s.key)) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t157, e73), null);
                    else {
                        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e73(t157, s.key)) {
                            if (s.right.isEmpty()) return mn.EMPTY;
                            n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
                        }
                        s = s.copy(null, null, null, null, s.right.remove(t157, e73));
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
                insert(t158, e74, n29) {
                    return new mn(t158, e74);
                }
                remove(t159, e75) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(t160) {
                    return !1;
                }
                reverseTraversal(t161) {
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
                constructor(t162){
                    this.comparator = t162, this.data = new wn(this.comparator);
                }
                has(t163) {
                    return null !== this.data.get(t163);
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
                indexOf(t164) {
                    return this.data.indexOf(t164);
                }
                forEach(t165) {
                    this.data.inorderTraversal((e, n)=>(t165(e), !1)
                    );
                }
                forEachInRange(t166, e78) {
                    const n = this.data.getIteratorFrom(t166[0]);
                    for(; n.hasNext();){
                        const s = n.getNext();
                        if (this.comparator(s.key, t166[1]) >= 0) return;
                        e78(s.key);
                    }
                }
                forEachWhile(t167, e77) {
                    let n;
                    for(n = void 0 !== e77 ? this.data.getIteratorFrom(e77) : this.data.getIterator(); n.hasNext();)if (!t167(n.getNext().key)) return;
                }
                firstAfterOrEqual(t168) {
                    const e = this.data.getIteratorFrom(t168);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new yn(this.data.getIterator());
                }
                getIteratorFrom(t169) {
                    return new yn(this.data.getIteratorFrom(t169));
                }
                add(t170) {
                    return this.copy(this.data.remove(t170).insert(t170, !0));
                }
                delete(t171) {
                    return this.has(t171) ? this.copy(this.data.remove(t171)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(t172) {
                    let e = this;
                    return e.size < t172.size && (e = t172, t172 = this), t172.forEach((t)=>{
                        e = e.add(t);
                    }), e;
                }
                isEqual(t176) {
                    if (!(t176 instanceof gn)) return !1;
                    if (this.size !== t176.size) return !1;
                    const e = this.data.getIterator(), n = t176.data.getIterator();
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
                copy(t174) {
                    const e = new gn(this.comparator);
                    return e.data = t174, e;
                }
            }
            class yn {
                constructor(t175){
                    this.iter = t175;
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
                constructor(t192, e87, n34, s10, i7){
                    this.snapshotVersion = t192, this.targetChanges = e87, this.targetMismatches = n34, this.documentUpdates = s10, this.resolvedLimboDocuments = i7;
                }
                static createSynthesizedRemoteEventForCurrentChange(t177, e79) {
                    const n = new Map;
                    return n.set(t177, Dn.createSynthesizedTargetChangeForCurrentChange(t177, e79)), new Sn(rt.min(), n, Vn(), Tn(), Pn());
                }
            }
            class Dn {
                constructor(t178, e80, n31, s11, i8){
                    this.resumeToken = t178, this.current = e80, this.addedDocuments = n31, this.modifiedDocuments = s11, this.removedDocuments = i8;
                }
                static createSynthesizedTargetChangeForCurrentChange(t179, e81) {
                    return new Dn(_t.EMPTY_BYTE_STRING, e81, Pn(), Pn(), Pn());
                }
            }
            class Cn {
                constructor(t180, e82, n32, s12){
                    this.k = t180, this.removedTargetIds = e82, this.key = n32, this.$ = s12;
                }
            }
            class Nn {
                constructor(t181, e83){
                    this.targetId = t181, this.O = e83;
                }
            }
            class xn {
                constructor(t182, e84, n33 = _t.EMPTY_BYTE_STRING, s13 = null){
                    this.state = t182, this.targetIds = e84, this.resumeToken = n33, this.cause = s13;
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
                j(t183) {
                    t183.approximateByteSize() > 0 && (this.U = !0, this.L = t183);
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
                H(t184, e85) {
                    this.U = !0, this.M = this.M.insert(t184, e85);
                }
                J(t185) {
                    this.U = !0, this.M = this.M.remove(t185);
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
                constructor(t186){
                    this.tt = t186, this.et = new Map, this.nt = Tn(), this.st = On(), this.it = new gn(et);
                }
                rt(t187) {
                    for (const e of t187.k)t187.$ && t187.$.isFoundDocument() ? this.ot(e, t187.$) : this.ct(e, t187.key, t187.$);
                    for (const e86 of t187.removedTargetIds)this.ct(e86, t187.key, t187.$);
                }
                at(t188) {
                    this.forEachTarget(t188, (e)=>{
                        const n = this.ut(e);
                        switch(t188.state){
                            case 0:
                                this.ht(e) && n.j(t188.resumeToken);
                                break;
                            case 1:
                                n.X(), n.q || n.G(), n.j(t188.resumeToken);
                                break;
                            case 2:
                                n.X(), n.q || this.removeTarget(e);
                                break;
                            case 3:
                                this.ht(e) && (n.Z(), n.j(t188.resumeToken));
                                break;
                            case 4:
                                this.ht(e) && (this.lt(e), n.j(t188.resumeToken));
                                break;
                            default:
                                L();
                        }
                    });
                }
                forEachTarget(t189, e89) {
                    t189.targetIds.length > 0 ? t189.targetIds.forEach(e89) : this.et.forEach((t, n)=>{
                        this.ht(n) && e89(n);
                    });
                }
                ft(t190) {
                    const e = t190.targetId, n = t190.O.count, s = this.dt(e);
                    if (s) {
                        const t = s.target;
                        if (Ht(t)) if (0 === n) {
                            const n = new Pt(t.path);
                            this.ct(e, n, Kt.newNoDocument(n, rt.min()));
                        } else B(1 === n);
                        else this.wt(e) !== n && (this.lt(e), this.it = this.it.add(e));
                    }
                }
                _t(t191) {
                    const e88 = new Map;
                    this.et.forEach((n, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n.current && Ht(i.target)) {
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t191));
                            }
                            n.K && (e88.set(s, n.W()), n.G());
                        }
                    });
                    let n35 = Pn();
                    this.st.forEach((t193, e90)=>{
                        let s = !0;
                        e90.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return !e || 2 === e.purpose || (s = !1, !1);
                        }), s && (n35 = n35.add(t193));
                    });
                    const s15 = new Sn(t191, e88, this.it, this.nt, n35);
                    return this.nt = Tn(), this.st = On(), this.it = new gn(et), s15;
                }
                ot(t205, e92) {
                    if (this.ht(t205)) {
                        const n = this.gt(t205, e92.key) ? 2 : 0;
                        this.ut(t205).H(e92.key, n), this.nt = this.nt.insert(e92.key, e92), this.st = this.st.insert(e92.key, this.yt(e92.key).add(t205));
                    }
                }
                ct(t194, e91, n36) {
                    if (this.ht(t194)) {
                        const s = this.ut(t194);
                        this.gt(t194, e91) ? s.H(e91, 1) : s.J(e91), this.st = this.st.insert(e91, this.yt(e91).delete(t194)), n36 && (this.nt = this.nt.insert(e91, n36));
                    }
                }
                removeTarget(t195) {
                    this.et.delete(t195);
                }
                wt(t196) {
                    const e = this.ut(t196).W();
                    return this.tt.getRemoteKeysForTarget(t196).size + e.addedDocuments.size - e.removedDocuments.size;
                }
                Y(t197) {
                    this.ut(t197).Y();
                }
                ut(t198) {
                    let e = this.et.get(t198);
                    return e || (e = new kn, this.et.set(t198, e)), e;
                }
                yt(t199) {
                    let e = this.st.get(t199);
                    return e || (e = new gn(et), this.st = this.st.insert(t199, e)), e;
                }
                ht(t200) {
                    const e = null !== this.dt(t200);
                    return e || $("WatchChangeAggregator", "Detected inactive target", t200), e;
                }
                dt(t201) {
                    const e = this.et.get(t201);
                    return e && e.q ? null : this.tt.Tt(t201);
                }
                lt(t202) {
                    this.et.set(t202, new kn), this.tt.getRemoteKeysForTarget(t202).forEach((e)=>{
                        this.ct(t202, e, null);
                    });
                }
                gt(t203, e94) {
                    return this.tt.getRemoteKeysForTarget(t203).has(e94);
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
                constructor(t204, e93){
                    this.databaseId = t204, this.D = e93;
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
            function jn(t206) {
                return B(!!t206), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t206));
            }
            function Qn(t, e) {
                var t207;
                return (t207 = t, new ht([
                    "projects",
                    t207.projectId,
                    "databases",
                    t207.database
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
            function ss(t209, e96) {
                var t208, e95;
                let n37;
                if (e96 instanceof en) n37 = {
                    update: Zn(t209, e96.key, e96.value)
                };
                else if (e96 instanceof cn) n37 = {
                    delete: Gn(t209, e96.key)
                };
                else if (e96 instanceof nn) n37 = {
                    update: Zn(t209, e96.key, e96.data),
                    updateMask: ps(e96.fieldMask)
                };
                else {
                    if (!(e96 instanceof an)) return L();
                    n37 = {
                        verify: Gn(t209, e96.key)
                    };
                }
                return e96.fieldTransforms.length > 0 && (n37.updateTransforms = e96.fieldTransforms.map((t)=>(function(t, e) {
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
                )), e96.precondition.isNone || (n37.currentDocument = (t208 = t209, void 0 !== (e95 = e96.precondition).updateTime ? {
                    updateTime: Un(t208, e95.updateTime.toTimestamp())
                } : void 0 !== e95.exists ? {
                    exists: e95.exists
                } : L())), n37;
            }
            function is(t211, e97) {
                var t210;
                const n38 = e97.currentDocument ? void 0 !== (t210 = e97.currentDocument).updateTime ? Ge.updateTime(jn(t210.updateTime)) : void 0 !== t210.exists ? Ge.exists(t210.exists) : Ge.none() : Ge.none(), s16 = e97.updateTransforms ? e97.updateTransforms.map((e98)=>(function(t, e) {
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
                    })(t211, e98)
                ) : [];
                if (e97.update) {
                    e97.update.name;
                    const i = zn(t211, e97.update.name), r = new Ut({
                        mapValue: {
                            fields: e97.update.fields
                        }
                    });
                    if (e97.updateMask) {
                        const t212 = function(t213) {
                            const e = t213.fieldPaths || [];
                            return new dt(e.map((t)=>ft.fromServerFormat(t)
                            ));
                        }(e97.updateMask);
                        return new nn(i, r, t212, n38, s16);
                    }
                    return new en(i, r, n38, s16);
                }
                if (e97.delete) {
                    const s = zn(t211, e97.delete);
                    return new cn(s, n38);
                }
                if (e97.verify) {
                    const s = zn(t211, e97.verify);
                    return new an(s, n38);
                }
                return L();
            }
            function hs(t214) {
                return t214 ? void 0 !== t214.unaryFilter ? [
                    ys(t214)
                ] : void 0 !== t214.fieldFilter ? [
                    gs(t214)
                ] : void 0 !== t214.compositeFilter ? t214.compositeFilter.filters.map((t)=>hs(t)
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
            function gs(t215) {
                return Jt.create(ms(t215.fieldFilter.field), function(t) {
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
                }(t215.fieldFilter.op), t215.fieldFilter.value);
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
            function ps(t216) {
                const e = [];
                return t216.fields.forEach((t)=>e.push(t.canonicalString())
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
                for(let e99 = 0; e99 < s; e99++){
                    const s = t.charAt(e99);
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
                constructor(t232, e113, n49){
                    this.ownerId = t232, this.allowTabSynchronization = e113, this.leaseTimestampMs = n49;
                }
            }
            Ps.store = "owner", Ps.key = "owner";
            class vs {
                constructor(t217, e100, n39){
                    this.userId = t217, this.lastAcknowledgedBatchId = e100, this.lastStreamToken = n39;
                }
            }
            vs.store = "mutationQueues", vs.keyPath = "userId";
            class Vs {
                constructor(t218, e101, n40, s21, i12){
                    this.userId = t218, this.batchId = e101, this.localWriteTimeMs = n40, this.baseMutations = s21, this.mutations = i12;
                }
            }
            Vs.store = "mutations", Vs.keyPath = "batchId", Vs.userMutationsIndex = "userMutationsIndex", Vs.userMutationsKeyPath = [
                "userId",
                "batchId"
            ];
            class Ss {
                constructor(){
                }
                static prefixForUser(t219) {
                    return [
                        t219
                    ];
                }
                static prefixForPath(t220, e102) {
                    return [
                        t220,
                        Es(e102)
                    ];
                }
                static key(t221, e103, n41) {
                    return [
                        t221,
                        Es(e103),
                        n41
                    ];
                }
            }
            Ss.store = "documentMutations", Ss.PLACEHOLDER = new Ss;
            class Ns {
                constructor(t222, e104, n42, s17, i10, r4){
                    this.unknownDocument = t222, this.noDocument = e104, this.document = n42, this.hasCommittedMutations = s17, this.readTime = i10, this.parentPath = r4;
                }
            }
            Ns.store = "remoteDocuments", Ns.readTimeIndex = "readTimeIndex", Ns.readTimeIndexPath = "readTime", Ns.collectionReadTimeIndex = "collectionReadTimeIndex", Ns.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime"
            ];
            class xs {
                constructor(t223){
                    this.byteSize = t223;
                }
            }
            xs.store = "remoteDocumentGlobal", xs.key = "remoteDocumentGlobalKey";
            class ks {
                constructor(t224, e105, n43, s18, i11, r3, o3){
                    this.targetId = t224, this.canonicalId = e105, this.readTime = n43, this.resumeToken = s18, this.lastListenSequenceNumber = i11, this.lastLimboFreeSnapshotVersion = r3, this.query = o3;
                }
            }
            ks.store = "targets", ks.keyPath = "targetId", ks.queryTargetsIndexName = "queryTargetsIndex", ks.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ];
            class $s {
                constructor(t225, e106, n44){
                    this.targetId = t225, this.path = e106, this.sequenceNumber = n44;
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
                constructor(t226, e107, n45, s19){
                    this.highestTargetId = t226, this.highestListenSequenceNumber = e107, this.lastRemoteSnapshotVersion = n45, this.targetCount = s19;
                }
            }
            Os.key = "targetGlobalKey", Os.store = "targetGlobal";
            class Fs {
                constructor(t227, e108){
                    this.collectionId = t227, this.parent = e108;
                }
            }
            Fs.store = "collectionParents", Fs.keyPath = [
                "collectionId",
                "parent"
            ];
            class Ms {
                constructor(t228, e109, n46, s20){
                    this.clientId = t228, this.updateTimeMs = e109, this.networkEnabled = n46, this.inForeground = s20;
                }
            }
            Ms.store = "clientMetadata", Ms.keyPath = "clientId";
            class Ls {
                constructor(t229, e110, n47){
                    this.bundleId = t229, this.createTime = e110, this.version = n47;
                }
            }
            Ls.store = "bundles", Ls.keyPath = "bundleId";
            class Bs {
                constructor(t230, e111, n48){
                    this.name = t230, this.readTime = e111, this.bundledQuery = n48;
                }
            }
            Bs.store = "namedQueries", Bs.keyPath = "name";
            class Ks {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(t231) {
                    this.onCommittedListeners.push(t231);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((t)=>t()
                    );
                }
            }
            class js {
                constructor(t233){
                    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, t233((t)=>{
                        this.isDone = !0, this.result = t, this.nextCallback && this.nextCallback(t);
                    }, (t)=>{
                        this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t235) {
                    return this.next(void 0, t235);
                }
                next(t234, e112) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e112, this.error) : this.wrapSuccess(t234, this.result) : new js((n, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t234, e).next(n, s);
                        }, this.catchCallback = (t)=>{
                            this.wrapFailure(e112, t).next(n, s);
                        };
                    });
                }
                toPromise() {
                    return new Promise((t, e)=>{
                        this.next(t, e);
                    });
                }
                wrapUserFunction(t241) {
                    try {
                        const e = t241();
                        return e instanceof js ? e : js.resolve(e);
                    } catch (t) {
                        return js.reject(t);
                    }
                }
                wrapSuccess(t236, e115) {
                    return t236 ? this.wrapUserFunction(()=>t236(e115)
                    ) : js.resolve(e115);
                }
                wrapFailure(t237, e114) {
                    return t237 ? this.wrapUserFunction(()=>t237(e114)
                    ) : js.reject(e114);
                }
                static resolve(t238) {
                    return new js((e, n)=>{
                        e(t238);
                    });
                }
                static reject(t239) {
                    return new js((e, n)=>{
                        n(t239);
                    });
                }
                static waitFor(t240) {
                    return new js((e, n)=>{
                        let s = 0, i = 0, r = !1;
                        t240.forEach((t242)=>{
                            ++s, t242.next(()=>{
                                ++i, r && i === s && e();
                            }, (t)=>n(t)
                            );
                        }), r = !0, i === s && e();
                    });
                }
                static or(t243) {
                    let e = js.resolve(!1);
                    for (const n of t243)e = e.next((t)=>t ? js.resolve(t) : n()
                    );
                    return e;
                }
                static forEach(t244, e117) {
                    const n = [];
                    return t244.forEach((t, s)=>{
                        n.push(e117.call(this, t, s));
                    }), this.waitFor(n);
                }
            }
            class Qs {
                constructor(t254, e116){
                    this.action = t254, this.transaction = e116, this.aborted = !1, this.Et = new Q, this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }, this.transaction.onabort = ()=>{
                        e116.error ? this.Et.reject(new zs(t254, e116.error)) : this.Et.resolve();
                    }, this.transaction.onerror = (e)=>{
                        const n = Zs(e.target.error);
                        this.Et.reject(new zs(t254, n));
                    };
                }
                static open(t245, e120, n51, s22) {
                    try {
                        return new Qs(e120, t245.transaction(s22, n51));
                    } catch (t) {
                        throw new zs(e120, t);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(t246) {
                    t246 && this.Et.reject(t246), this.aborted || ($("SimpleDb", "Aborting transaction:", t246 ? t246.message : "Client-initiated abort"), this.aborted = !0, this.transaction.abort());
                }
                store(t247) {
                    const e = this.transaction.objectStore(t247);
                    return new Js(e);
                }
            }
            class Ws {
                constructor(t248, e118, n50){
                    this.name = t248, this.version = e118, this.At = n50, 12.2 === Ws.Rt(getUA()) && O("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(t249) {
                    return $("SimpleDb", "Removing database:", t249), Ys(window.indexedDB.deleteDatabase(t249)).toPromise();
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
                static St(t250, e119) {
                    return t250.store(e119);
                }
                static Rt(t251) {
                    const e = t251.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = e ? e[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                static vt(t252) {
                    const e = t252.match(/Android ([\d.]+)/i), n = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(n);
                }
                async Dt(t253) {
                    return this.db || ($("SimpleDb", "Opening database:", this.name), this.db = await new Promise((e121, n52)=>{
                        const s23 = indexedDB.open(this.name, this.version);
                        s23.onsuccess = (t)=>{
                            const n = t.target.result;
                            e121(n);
                        }, s23.onblocked = ()=>{
                            n52(new zs(t253, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }, s23.onerror = (e)=>{
                            const s = e.target.error;
                            "VersionError" === s.name ? n52(new j(K.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n52(new j(K.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n52(new zs(t253, s));
                        }, s23.onupgradeneeded = (t)=>{
                            $("SimpleDb", "Database \"" + this.name + "\" requires upgrade from version:", t.oldVersion);
                            const e = t.target.result;
                            this.At.Ct(e, s23.transaction, t.oldVersion, this.version).next(()=>{
                                $("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        };
                    })), this.Nt && (this.db.onversionchange = (t)=>this.Nt(t)
                    ), this.db;
                }
                xt(t256) {
                    this.Nt = t256, this.db && (this.db.onversionchange = (e)=>t256(e)
                    );
                }
                async runTransaction(t255, e124, n54, s24) {
                    const i = "readonly" === e124;
                    let r = 0;
                    for(;;){
                        ++r;
                        try {
                            this.db = await this.Dt(t255);
                            const e = Qs.open(this.db, t255, i ? "readonly" : "readwrite", n54), r = s24(e).catch((t)=>(e.abort(t), js.reject(t))
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
                constructor(t260){
                    this.kt = t260, this.$t = !1, this.Ot = null;
                }
                get isDone() {
                    return this.$t;
                }
                get Ft() {
                    return this.Ot;
                }
                set cursor(t257) {
                    this.kt = t257;
                }
                done() {
                    this.$t = !0;
                }
                Mt(t258) {
                    this.Ot = t258;
                }
                delete() {
                    return Ys(this.kt.delete());
                }
            }
            class zs extends null {
                constructor(t259, e122){
                    super(K.UNAVAILABLE, `IndexedDB transaction '${t259}' failed: ${e122}`), this.name = "IndexedDbTransactionError";
                }
            }
            function Hs(t) {
                return "IndexedDbTransactionError" === t.name;
            }
            class Js {
                constructor(t269){
                    this.store = t269;
                }
                put(t261, e123) {
                    let n;
                    return void 0 !== e123 ? ($("SimpleDb", "PUT", this.store.name, t261, e123), n = this.store.put(e123, t261)) : ($("SimpleDb", "PUT", this.store.name, "<auto-key>", t261), n = this.store.put(t261)), Ys(n);
                }
                add(t262) {
                    return $("SimpleDb", "ADD", this.store.name, t262, t262), Ys(this.store.add(t262));
                }
                get(t263) {
                    return Ys(this.store.get(t263)).next((e)=>(void 0 === e && (e = null), $("SimpleDb", "GET", this.store.name, t263, e), e)
                    );
                }
                delete(t264) {
                    return $("SimpleDb", "DELETE", this.store.name, t264), Ys(this.store.delete(t264));
                }
                count() {
                    return $("SimpleDb", "COUNT", this.store.name), Ys(this.store.count());
                }
                Lt(t265, e125) {
                    const n = this.cursor(this.options(t265, e125)), s = [];
                    return this.Bt(n, (t, e)=>{
                        s.push(e);
                    }).next(()=>s
                    );
                }
                Ut(t266, e128) {
                    $("SimpleDb", "DELETE ALL", this.store.name);
                    const n53 = this.options(t266, e128);
                    n53.qt = !1;
                    const s = this.cursor(n53);
                    return this.Bt(s, (t, e, n)=>n.delete()
                    );
                }
                Kt(t267, e126) {
                    let n;
                    e126 ? n = t267 : (n = {
                    }, e126 = t267);
                    const s = this.cursor(n);
                    return this.Bt(s, e126);
                }
                jt(t268) {
                    const e127 = this.cursor({
                    });
                    return new js((n, s25)=>{
                        e127.onerror = (t)=>{
                            const e = Zs(t.target.error);
                            s25(e);
                        }, e127.onsuccess = (e)=>{
                            const s = e.target.result;
                            s ? t268(s.primaryKey, s.value).next((t)=>{
                                t ? s.continue() : n();
                            }) : n();
                        };
                    });
                }
                Bt(t270, e130) {
                    const n = [];
                    return new js((s, i13)=>{
                        t270.onerror = (t)=>{
                            i13(t.target.error);
                        }, t270.onsuccess = (t)=>{
                            const i = t.target.result;
                            if (!i) return void s();
                            const r = new Gs(i), o = e130(i.primaryKey, i.value, r);
                            if (o instanceof js) {
                                const t271 = o.catch((t)=>(r.done(), js.reject(t))
                                );
                                n.push(t271);
                            }
                            r.isDone ? s() : null === r.Ft ? i.continue() : i.continue(r.Ft);
                        };
                    }).next(()=>js.waitFor(n)
                    );
                }
                options(t273, e129) {
                    let n;
                    return void 0 !== t273 && ("string" == typeof t273 ? n = t273 : e129 = t273), {
                        index: n,
                        range: e129
                    };
                }
                cursor(t272) {
                    let e = "next";
                    if (t272.reverse && (e = "prev"), t272.index) {
                        const n = this.store.index(t272.index);
                        return t272.qt ? n.openKeyCursor(t272.range, e) : n.openCursor(t272.range, e);
                    }
                    return this.store.openCursor(t272.range, e);
                }
            }
            function Ys(t274) {
                return new js((e131, n55)=>{
                    t274.onsuccess = (t)=>{
                        const n = t.target.result;
                        e131(n);
                    }, t274.onerror = (t)=>{
                        const e = Zs(t.target.error);
                        n55(e);
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
                constructor(t278, e134, n56, s26){
                    this.batchId = t278, this.localWriteTime = e134, this.baseMutations = n56, this.mutations = s26;
                }
                applyToRemoteDocument(t275, e132) {
                    const n = e132.mutationResults;
                    for(let e = 0; e < this.mutations.length; e++){
                        const s = this.mutations[e];
                        s.key.isEqual(t275.key) && Je(s, t275, n[e]);
                    }
                }
                applyToLocalView(t276) {
                    for (const e of this.baseMutations)e.key.isEqual(t276.key) && Ye(e, t276, this.localWriteTime);
                    for (const e133 of this.mutations)e133.key.isEqual(t276.key) && Ye(e133, t276, this.localWriteTime);
                }
                applyToLocalDocumentSet(t277) {
                    this.mutations.forEach((e)=>{
                        const n = t277.get(e.key), s = n;
                        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key)
                    , Pn());
                }
                isEqual(t279) {
                    return this.batchId === t279.batchId && nt(this.mutations, t279.mutations, (t, e)=>Ze(t, e)
                    ) && nt(this.baseMutations, t279.baseMutations, (t, e)=>Ze(t, e)
                    );
                }
            }
            class si {
                constructor(t286, e138, n59, s28){
                    this.batch = t286, this.commitVersion = e138, this.mutationResults = n59, this.docVersions = s28;
                }
                static from(t280, e135, n57) {
                    B(t280.mutations.length === n57.length);
                    let s = Rn();
                    const i = t280.mutations;
                    for(let t = 0; t < i.length; t++)s = s.insert(i[t].key, n57[t].version);
                    return new si(t280, e135, n57, s);
                }
            }
            class ii {
                constructor(t281, e136, n58, s27, i14 = rt.min(), r5 = rt.min(), o4 = _t.EMPTY_BYTE_STRING){
                    this.target = t281, this.targetId = e136, this.purpose = n58, this.sequenceNumber = s27, this.snapshotVersion = i14, this.lastLimboFreeSnapshotVersion = r5, this.resumeToken = o4;
                }
                withSequenceNumber(t282) {
                    return new ii(this.target, this.targetId, this.purpose, t282, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(t283, e137) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, e137, this.lastLimboFreeSnapshotVersion, t283);
                }
                withLastLimboFreeSnapshotVersion(t284) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t284, this.resumeToken);
                }
            }
            function fi(t, e139) {
                const n = (e139.baseMutations || []).map((e)=>is(t.Wt, e)
                );
                for(let t285 = 0; t285 < e139.mutations.length - 1; ++t285){
                    const n = e139.mutations[t285];
                    if (t285 + 1 < e139.mutations.length && void 0 !== e139.mutations[t285 + 1].transform) {
                        const s = e139.mutations[t285 + 1];
                        n.updateTransforms = s.transform.fieldTransforms, e139.mutations.splice(t285 + 1, 1), ++t285;
                    }
                }
                const s = e139.mutations.map((e)=>is(t.Wt, e)
                ), i = it.fromMillis(e139.localWriteTimeMs);
                return new ni(e139.batchId, i, n, s);
            }
            class Ri {
                constructor(t292, e143, n63){
                    this.cacheSizeCollectionThreshold = t292, this.percentileToCollect = e143, this.maximumSequenceNumbersToCollect = n63;
                }
                static withCacheSize(t287) {
                    return new Ri(t287, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            class vi {
                constructor(t288, e140, n60, s30){
                    this.userId = t288, this.N = e140, this.Ht = n60, this.referenceDelegate = s30, this.Jt = {
                    };
                }
                static Yt(t289, e141, n61, s29) {
                    B("" !== t289.uid);
                    const i = t289.isAuthenticated() ? t289.uid : "";
                    return new vi(i, e141, n61, s29);
                }
                checkEmpty(t290) {
                    let e = !0;
                    const n = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return Si(t290).Kt({
                        index: Vs.userMutationsIndex,
                        range: n
                    }, (t, n, s)=>{
                        e = !1, s.done();
                    }).next(()=>e
                    );
                }
                addMutationBatch(t291, e142, n62, s31) {
                    const i15 = Di(t291), r = Si(t291);
                    return r.add({
                    }).next((o)=>{
                        B("number" == typeof o);
                        const c = new ni(o, e142, n62, s31), a = function(t, e144, n) {
                            const s = n.baseMutations.map((e)=>ss(t.Wt, e)
                            ), i = n.mutations.map((e)=>ss(t.Wt, e)
                            );
                            return new Vs(e144, n.batchId, n.localWriteTime.toMillis(), s, i);
                        }(this.N, this.userId, c), u = [];
                        let h = new gn((t, e)=>et(t.canonicalString(), e.canonicalString())
                        );
                        for (const t293 of s31){
                            const e = Ss.key(this.userId, t293.key.path, o);
                            h = h.add(t293.key.path.popLast()), u.push(r.put(a)), u.push(i15.put(e, Ss.PLACEHOLDER));
                        }
                        return h.forEach((e)=>{
                            u.push(this.Ht.addToCollectionParentIndex(t291, e));
                        }), t291.addOnCommittedListener(()=>{
                            this.Jt[o] = c.keys();
                        }), js.waitFor(u).next(()=>c
                        );
                    });
                }
                lookupMutationBatch(t294, e147) {
                    return Si(t294).get(e147).next((t)=>t ? (B(t.userId === this.userId), fi(this.N, t)) : null
                    );
                }
                Xt(t295, e145) {
                    return this.Jt[e145] ? js.resolve(this.Jt[e145]) : this.lookupMutationBatch(t295, e145).next((t)=>{
                        if (t) {
                            const n = t.keys();
                            return this.Jt[e145] = n, n;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(t298, e146) {
                    const n = e146 + 1, s32 = IDBKeyRange.lowerBound([
                        this.userId,
                        n
                    ]);
                    let i = null;
                    return Si(t298).Kt({
                        index: Vs.userMutationsIndex,
                        range: s32
                    }, (t, e, s)=>{
                        e.userId === this.userId && (B(e.batchId >= n), i = fi(this.N, e)), s.done();
                    }).next(()=>i
                    );
                }
                getHighestUnacknowledgedBatchId(t296) {
                    const e148 = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    let n = -1;
                    return Si(t296).Kt({
                        index: Vs.userMutationsIndex,
                        range: e148,
                        reverse: !0
                    }, (t, e, s)=>{
                        n = e.batchId, s.done();
                    }).next(()=>n
                    );
                }
                getAllMutationBatches(t297) {
                    const e = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return Si(t297).Lt(Vs.userMutationsIndex, e).next((t299)=>t299.map((t)=>fi(this.N, t)
                        )
                    );
                }
                getAllMutationBatchesAffectingDocumentKey(t300, e150) {
                    const n64 = Ss.prefixForPath(this.userId, e150.path), s = IDBKeyRange.lowerBound(n64), i = [];
                    return Di(t300).Kt({
                        range: s
                    }, (n, s, r)=>{
                        const [o, c, a] = n, u = Rs(c);
                        if (o === this.userId && e150.path.isEqual(u)) return Si(t300).get(a).next((t)=>{
                            if (!t) throw L();
                            B(t.userId === this.userId), i.push(fi(this.N, t));
                        });
                        r.done();
                    }).next(()=>i
                    );
                }
                getAllMutationBatchesAffectingDocumentKeys(t301, e149) {
                    let n = new gn(et);
                    const s = [];
                    return e149.forEach((e)=>{
                        const i16 = Ss.prefixForPath(this.userId, e.path), r6 = IDBKeyRange.lowerBound(i16), o5 = Di(t301).Kt({
                            range: r6
                        }, (t, s, i)=>{
                            const [r, o, c] = t, a = Rs(o);
                            r === this.userId && e.path.isEqual(a) ? n = n.add(c) : i.done();
                        });
                        s.push(o5);
                    }), js.waitFor(s).next(()=>this.Zt(t301, n)
                    );
                }
                getAllMutationBatchesAffectingQuery(t302, e152) {
                    const n = e152.path, s = n.length + 1, i17 = Ss.prefixForPath(this.userId, n), r7 = IDBKeyRange.lowerBound(i17);
                    let o = new gn(et);
                    return Di(t302).Kt({
                        range: r7
                    }, (t, e, i)=>{
                        const [r, c, a] = t, u = Rs(c);
                        r === this.userId && n.isPrefixOf(u) ? u.length === s && (o = o.add(a)) : i.done();
                    }).next(()=>this.Zt(t302, o)
                    );
                }
                Zt(t303, e151) {
                    const n = [], s = [];
                    return e151.forEach((e)=>{
                        s.push(Si(t303).get(e).next((t)=>{
                            if (null === t) throw L();
                            B(t.userId === this.userId), n.push(fi(this.N, t));
                        }));
                    }), js.waitFor(s).next(()=>n
                    );
                }
                removeMutationBatch(t305, e153) {
                    return (function(t, e, n65) {
                        const s = t.store(Vs.store), i = t.store(Ss.store), r = [], o = IDBKeyRange.only(n65.batchId);
                        let c = 0;
                        const a = s.Kt({
                            range: o
                        }, (t, e, n)=>(c++, n.delete())
                        );
                        r.push(a.next(()=>{
                            B(1 === c);
                        }));
                        const u = [];
                        for (const t304 of n65.mutations){
                            const s = Ss.key(e, t304.key.path, n65.batchId);
                            r.push(i.delete(s)), u.push(t304.key);
                        }
                        return js.waitFor(r).next(()=>u
                        );
                    })(t305.Qt, this.userId, e153).next((n)=>(t305.addOnCommittedListener(()=>{
                            this.te(e153.batchId);
                        }), js.forEach(n, (e)=>this.referenceDelegate.markPotentiallyOrphaned(t305, e)
                        ))
                    );
                }
                te(t307) {
                    delete this.Jt[t307];
                }
                performConsistencyCheck(t306) {
                    return this.checkEmpty(t306).next((e154)=>{
                        if (!e154) return js.resolve();
                        const n66 = IDBKeyRange.lowerBound(Ss.prefixForUser(this.userId)), s = [];
                        return Di(t306).Kt({
                            range: n66
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
                containsKey(t309, e155) {
                    return Vi(t309, this.userId, e155);
                }
                ee(t308) {
                    return Ci(t308).get(this.userId).next((t)=>t || new vs(this.userId, -1, "")
                    );
                }
            }
            function Vi(t310, e, n) {
                const s33 = Ss.prefixForPath(e, n.path), i = s33[1], r8 = IDBKeyRange.lowerBound(s33);
                let o = !1;
                return Di(t310).Kt({
                    range: r8,
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
                constructor(t311){
                    this.ne = t311;
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
                constructor(t317, e159){
                    this.mapKeyFn = t317, this.equalsFn = e159, this.inner = {
                    };
                }
                get(t312) {
                    const e = this.mapKeyFn(t312), n = this.inner[e];
                    if (void 0 !== n) {
                        for (const [e156, s] of n)if (this.equalsFn(e156, t312)) return s;
                    }
                }
                has(t313) {
                    return void 0 !== this.get(t313);
                }
                set(t314, e157) {
                    const n = this.mapKeyFn(t314), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let n = 0; n < s.length; n++)if (this.equalsFn(s[n][0], t314)) return void (s[n] = [
                            t314,
                            e157
                        ]);
                        s.push([
                            t314,
                            e157
                        ]);
                    } else this.inner[n] = [
                        [
                            t314,
                            e157
                        ]
                    ];
                }
                delete(t315) {
                    const e = this.mapKeyFn(t315), n = this.inner[e];
                    if (void 0 === n) return !1;
                    for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t315)) return 1 === n.length ? delete this.inner[e] : n.splice(s, 1), !0;
                    return !1;
                }
                forEach(t316) {
                    ct(this.inner, (e, n)=>{
                        for (const [e158, s] of n)t316(e158, s);
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
                getReadTime(t326) {
                    const e = this.changes.get(t326);
                    return e ? e.readTime : rt.min();
                }
                addEntry(t318, e166) {
                    this.assertNotApplied(), this.changes.set(t318.key, {
                        document: t318,
                        readTime: e166
                    });
                }
                removeEntry(t319, e160 = null) {
                    this.assertNotApplied(), this.changes.set(t319, {
                        document: Kt.newInvalidDocument(t319),
                        readTime: e160
                    });
                }
                getEntry(t320, e161) {
                    this.assertNotApplied();
                    const n = this.changes.get(e161);
                    return void 0 !== n ? js.resolve(n.document) : this.getFromCache(t320, e161);
                }
                getEntries(t321, e162) {
                    return this.getAllFromCache(t321, e162);
                }
                apply(t322) {
                    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t322);
                }
                assertNotApplied() {
                }
            }
            class rr {
                constructor(t323, e163, n67){
                    this.He = t323, this.In = e163, this.Ht = n67;
                }
                An(t324, e164) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t324, e164).next((n)=>this.Rn(t324, e164, n)
                    );
                }
                Rn(t325, e165, n68) {
                    return this.He.getEntry(t325, e165).next((t)=>{
                        for (const e of n68)e.applyToLocalView(t);
                        return t;
                    });
                }
                bn(t330, e168) {
                    t330.forEach((t, n)=>{
                        for (const t327 of e168)t327.applyToLocalView(n);
                    });
                }
                Pn(t328, e167) {
                    return this.He.getEntries(t328, e167).next((e)=>this.vn(t328, e).next(()=>e
                        )
                    );
                }
                vn(t329, e171) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t329, e171).next((t)=>this.bn(e171, t)
                    );
                }
                getDocumentsMatchingQuery(t333, e169, n71) {
                    var t331;
                    return (t331 = e169, Pt.isDocumentKey(t331.path) && null === t331.collectionGroup && 0 === t331.filters.length) ? this.Vn(t333, e169.path) : null !== e169.collectionGroup ? this.Sn(t333, e169, n71) : this.Dn(t333, e169, n71);
                }
                Vn(t332, e170) {
                    return this.An(t332, new Pt(e170)).next((t)=>{
                        let e = In();
                        return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
                    });
                }
                Sn(t334, e173, n69) {
                    const s = e173.collectionGroup;
                    let i = In();
                    return this.Ht.getCollectionParents(t334, s).next((r9)=>js.forEach(r9, (r)=>{
                            var t335, e172;
                            const o = (t335 = e173, e172 = r.child(s), new fe(e172, null, t335.explicitOrderBy.slice(), t335.filters.slice(), t335.limit, t335.limitType, t335.startAt, t335.endAt));
                            return this.Dn(t334, o, n69).next((t336)=>{
                                t336.forEach((t, e)=>{
                                    i = i.insert(t, e);
                                });
                            });
                        }).next(()=>i
                        )
                    );
                }
                Dn(t338, e174, n70) {
                    let s, i18;
                    return this.He.getDocumentsMatchingQuery(t338, e174, n70).next((n)=>(s = n, this.In.getAllMutationBatchesAffectingQuery(t338, e174))
                    ).next((e175)=>(i18 = e175, this.Cn(t338, i18, s).next((t)=>{
                            for (const t337 of (s = t, i18))for (const e of t337.mutations){
                                const n = e.key;
                                let i = s.get(n);
                                null == i && (i = Kt.newInvalidDocument(n), s = s.insert(n, i)), Ye(e, i, t337.localWriteTime), i.isFoundDocument() || (s = s.remove(n));
                            }
                        }))
                    ).next(()=>(s.forEach((t, n)=>{
                            Pe(e174, n) || (s = s.remove(t));
                        }), s)
                    );
                }
                Cn(t340, e177, n76) {
                    let s = Pn();
                    for (const t339 of e177)for (const e176 of t339.mutations)e176 instanceof nn && null === n76.get(e176.key) && (s = s.add(e176.key));
                    let i = n76;
                    return this.He.getEntries(t340, s).next((t341)=>(t341.forEach((t, e)=>{
                            e.isFoundDocument() && (i = i.insert(t, e));
                        }), i)
                    );
                }
            }
            class or {
                constructor(t346, e180, n72, s35){
                    this.targetId = t346, this.fromCache = e180, this.Nn = n72, this.xn = s35;
                }
                static kn(t342, e178) {
                    let n = Pn(), s = Pn();
                    for (const t of e178.docChanges)switch(t.type){
                        case 0:
                            n = n.add(t.doc.key);
                            break;
                        case 1:
                            s = s.add(t.doc.key);
                    }
                    return new or(t342, e178.fromCache, n, s);
                }
            }
            class cr {
                $n(t343) {
                    this.On = t343;
                }
                getDocumentsMatchingQuery(t344, e179, n73, s34) {
                    var t345;
                    return 0 === (t345 = e179).filters.length && null === t345.limit && null == t345.startAt && null == t345.endAt && (0 === t345.explicitOrderBy.length || 1 === t345.explicitOrderBy.length && t345.explicitOrderBy[0].field.isKeyField()) || n73.isEqual(rt.min()) ? this.Fn(t344, e179) : this.On.Pn(t344, s34).next((i)=>{
                        const r = this.Mn(e179, i);
                        return (_e(e179) || me(e179)) && this.Ln(e179.limitType, r, s34, n73) ? this.Fn(t344, e179) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n73.toString(), be(e179)), this.On.getDocumentsMatchingQuery(t344, e179, n73).next((t)=>(r.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)
                        ));
                    });
                }
                Mn(t350, e184) {
                    let n = new gn(ve(t350));
                    return e184.forEach((e, s)=>{
                        Pe(t350, s) && (n = n.add(s));
                    }), n;
                }
                Ln(t347, e181, n74, s37) {
                    if (n74.size !== e181.size) return !0;
                    const i = "F" === t347 ? e181.last() : e181.first();
                    return !!i && (i.hasPendingWrites || i.version.compareTo(s37) > 0);
                }
                Fn(t348, e182) {
                    return x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__.in.DEBUG && $("QueryEngine", "Using full collection scan to execute query:", be(e182)), this.On.getDocumentsMatchingQuery(t348, e182, rt.min());
                }
            }
            class ar {
                constructor(t349, e183, n75, s36){
                    this.persistence = t349, this.Bn = e183, this.N = s36, this.Un = new wn(et), this.qn = new ji((t)=>Wt(t)
                    , zt), this.Kn = rt.min(), this.In = t349.getMutationQueue(n75), this.jn = t349.getRemoteDocumentCache(), this.ze = t349.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t349.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t351) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t351.collect(e, this.Un)
                    );
                }
            }
            async function hr(t352, e187) {
                const n77 = q(t352);
                let s38 = n77.In, i = n77.Qn;
                const r10 = await n77.persistence.runTransaction("Handle user change", "readonly", (t354)=>{
                    let r;
                    return n77.In.getAllMutationBatches(t354).next((o)=>(r = o, s38 = n77.persistence.getMutationQueue(e187), i = new rr(n77.jn, s38, n77.persistence.getIndexManager()), s38.getAllMutationBatches(t354))
                    ).next((e)=>{
                        const n = [], s = [];
                        let o = Pn();
                        for (const t355 of r)for (const e185 of (n.push(t355.batchId), t355.mutations))o = o.add(e185.key);
                        for (const t353 of e)for (const e186 of (s.push(t353.batchId), t353.mutations))o = o.add(e186.key);
                        return i.Pn(t354, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            })
                        );
                    });
                });
                return n77.In = s38, n77.Qn = i, n77.Bn.$n(n77.Qn), r10;
            }
            function fr(t356) {
                const e = q(t356);
                return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t)=>e.ze.getLastRemoteSnapshotVersion(t)
                );
            }
            function _r(t357, e) {
                const n = q(t357);
                return n.persistence.runTransaction("Get next mutation batch", "readonly", (t)=>(void 0 === e && (e = -1), n.In.getNextMutationBatchAfterBatchId(t, e))
                );
            }
            async function gr(t358, e, n) {
                const s = q(t358), i = s.Un.get(e);
                try {
                    n || await s.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t)=>s.persistence.referenceDelegate.removeTarget(t, i)
                    );
                } catch (t) {
                    if (!Hs(t)) throw t;
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
                }
                s.Un = s.Un.remove(e), s.qn.delete(i.target);
            }
            function yr(t359, e188, n78) {
                const s39 = q(t359);
                let i19 = rt.min(), r = Pn();
                return s39.persistence.runTransaction("Execute query", "readonly", (t360)=>(function(t, e, n) {
                        const s = q(t), i = s.qn.get(n);
                        return void 0 !== i ? js.resolve(s.Un.get(i)) : s.ze.getTargetData(e, n);
                    })(s39, t360, Ee(e188)).next((e)=>{
                        if (e) return i19 = e.lastLimboFreeSnapshotVersion, s39.ze.getMatchingKeysForTargetId(t360, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>s39.Bn.getDocumentsMatchingQuery(t360, e188, n78 ? i19 : rt.min(), n78 ? r : Pn())
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
                addReference(t362, e200) {
                    const n = new Pr(t362, e200);
                    this.Zn = this.Zn.add(n), this.es = this.es.add(n);
                }
                ss(t361, e189) {
                    t361.forEach((t)=>this.addReference(t, e189)
                    );
                }
                removeReference(t364, e190) {
                    this.rs(new Pr(t364, e190));
                }
                os(t363, e191) {
                    t363.forEach((t)=>this.removeReference(t, e191)
                    );
                }
                cs(t365) {
                    const e = new Pt(new ht([])), n = new Pr(e, t365), s = new Pr(e, t365 + 1), i = [];
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
                rs(t367) {
                    this.Zn = this.Zn.delete(t367), this.es = this.es.delete(t367);
                }
                hs(t366) {
                    const e = new Pt(new ht([])), n = new Pr(e, t366), s = new Pr(e, t366 + 1);
                    let i = Pn();
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        i = i.add(t.key);
                    }), i;
                }
                containsKey(t378) {
                    const e = new Pr(t378, 0), n = this.Zn.firstAfterOrEqual(e);
                    return null !== n && t378.isEqual(n.key);
                }
            }
            class Pr {
                constructor(t368, e192){
                    this.key = t368, this.ls = e192;
                }
                static ts(t369, e193) {
                    return Pt.comparator(t369.key, e193.key) || et(t369.ls, e193.ls);
                }
                static ns(t370, e194) {
                    return et(t370.ls, e194.ls) || Pt.comparator(t370.key, e194.key);
                }
            }
            class vr {
                constructor(t371, e195){
                    this.Ht = t371, this.referenceDelegate = e195, this.In = [], this.fs = 1, this.ds = new gn(Pr.ts);
                }
                checkEmpty(t372) {
                    return js.resolve(0 === this.In.length);
                }
                addMutationBatch(t373, e196, n79, s40) {
                    const i = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const r = new ni(i, e196, n79, s40);
                    for (const e of (this.In.push(r), s40))this.ds = this.ds.add(new Pr(e.key, i)), this.Ht.addToCollectionParentIndex(t373, e.key.path.popLast());
                    return js.resolve(r);
                }
                lookupMutationBatch(t374, e197) {
                    return js.resolve(this.ws(e197));
                }
                getNextMutationBatchAfterBatchId(t375, e198) {
                    const s = this._s(e198 + 1), i = s < 0 ? 0 : s;
                    return js.resolve(this.In.length > i ? this.In[i] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return js.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t376) {
                    return js.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t377, e199) {
                    const n = new Pr(e199, 0), s = new Pr(e199, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t379, e201) {
                    let n = new gn(et);
                    return e201.forEach((t380)=>{
                        const e = new Pr(t380, 0), s = new Pr(t380, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), js.resolve(this.gs(n));
                }
                getAllMutationBatchesAffectingQuery(t381, e202) {
                    const n = e202.path, s = n.length + 1;
                    let i = n;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    let o = new gn(et);
                    return this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return !!n.isPrefixOf(e) && (e.length === s && (o = o.add(t.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t382) {
                    const e = [];
                    return t382.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e;
                }
                removeMutationBatch(t394, e209) {
                    B(0 === this.ys(e209.batchId, "removed")), this.In.shift();
                    let n = this.ds;
                    return js.forEach(e209.mutations, (s)=>{
                        const i = new Pr(s.key, e209.batchId);
                        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t394, s.key);
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(t383) {
                }
                containsKey(t384, e203) {
                    const n = new Pr(e203, 0), s = this.ds.firstAfterOrEqual(n);
                    return js.resolve(e203.isEqual(s && s.key));
                }
                performConsistencyCheck(t385) {
                    return this.In.length, js.resolve();
                }
                ys(t386, e204) {
                    return this._s(t386);
                }
                _s(t387) {
                    return 0 === this.In.length ? 0 : t387 - this.In[0].batchId;
                }
                ws(t388) {
                    const e = this._s(t388);
                    return e < 0 || e >= this.In.length ? null : this.In[e];
                }
            }
            class Vr {
                constructor(t389, e205){
                    this.Ht = t389, this.ps = e205, this.docs = new wn(Pt.comparator), this.size = 0;
                }
                addEntry(t390, e206, n81) {
                    const s = e206.key, i = this.docs.get(s), r = i ? i.size : 0, o = this.ps(e206);
                    return this.docs = this.docs.insert(s, {
                        document: e206.clone(),
                        size: o,
                        readTime: n81
                    }), this.size += o - r, this.Ht.addToCollectionParentIndex(t390, s.path.popLast());
                }
                removeEntry(t391) {
                    const e = this.docs.get(t391);
                    e && (this.docs = this.docs.remove(t391), this.size -= e.size);
                }
                getEntry(t392, e207) {
                    const n = this.docs.get(e207);
                    return js.resolve(n ? n.document.clone() : Kt.newInvalidDocument(e207));
                }
                getEntries(t393, e208) {
                    let n = Tn();
                    return e208.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : Kt.newInvalidDocument(t));
                    }), js.resolve(n);
                }
                getDocumentsMatchingQuery(t396, e214, n80) {
                    let s = Tn();
                    const i = new Pt(e214.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t , value: { document: i , readTime: o  }  } = r.getNext();
                        if (!e214.path.isPrefixOf(t.path)) break;
                        0 >= o.compareTo(n80) || Pe(e214, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t395, e210) {
                    return js.forEach(this.docs, (t)=>e210(t)
                    );
                }
                newChangeBuffer(t403) {
                    return new Sr(this);
                }
                getSize(t397) {
                    return js.resolve(this.size);
                }
            }
            class Sr extends Qi {
                constructor(t398){
                    super(), this.Se = t398;
                }
                applyChanges(t399) {
                    const e = [];
                    return this.changes.forEach((n, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t399, s.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), js.waitFor(e);
                }
                getFromCache(t400, e211) {
                    return this.Se.getEntry(t400, e211);
                }
                getAllFromCache(t401, e212) {
                    return this.Se.getEntries(t401, e212);
                }
            }
            class Cr {
                constructor(t402, e213){
                    this.bs = {
                    }, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t402(this), this.ze = new class {
                        constructor(t404){
                            this.persistence = t404, this.Es = new ji((t)=>Wt(t)
                            , zt), this.lastRemoteSnapshotVersion = rt.min(), this.highestTargetId = 0, this.Is = 0, this.As = new br, this.targetCount = 0, this.Rs = Ni.se();
                        }
                        forEachTarget(t, e223) {
                            return this.Es.forEach((t, n)=>e223(n)
                            ), js.resolve();
                        }
                        getLastRemoteSnapshotVersion(t405) {
                            return js.resolve(this.lastRemoteSnapshotVersion);
                        }
                        getHighestSequenceNumber(t406) {
                            return js.resolve(this.Is);
                        }
                        allocateTargetId(t407) {
                            return this.highestTargetId = this.Rs.next(), js.resolve(this.highestTargetId);
                        }
                        setTargetsMetadata(t408, e215, n) {
                            return n && (this.lastRemoteSnapshotVersion = n), e215 > this.Is && (this.Is = e215), js.resolve();
                        }
                        ce(t409) {
                            this.Es.set(t409.target, t409);
                            const e = t409.targetId;
                            e > this.highestTargetId && (this.Rs = new Ni(e), this.highestTargetId = e), t409.sequenceNumber > this.Is && (this.Is = t409.sequenceNumber);
                        }
                        addTargetData(t410, e216) {
                            return this.ce(e216), this.targetCount += 1, js.resolve();
                        }
                        updateTargetData(t411, e217) {
                            return this.ce(e217), js.resolve();
                        }
                        removeTargetData(t412, e218) {
                            return this.Es.delete(e218.target), this.As.cs(e218.targetId), this.targetCount -= 1, js.resolve();
                        }
                        removeTargets(t413, e219, n82) {
                            let s = 0;
                            const i = [];
                            return this.Es.forEach((r, o)=>{
                                o.sequenceNumber <= e219 && null === n82.get(o.targetId) && (this.Es.delete(r), i.push(this.removeMatchingKeysForTargetId(t413, o.targetId)), s++);
                            }), js.waitFor(i).next(()=>s
                            );
                        }
                        getTargetCount(t414) {
                            return js.resolve(this.targetCount);
                        }
                        getTargetData(t415, e220) {
                            const n = this.Es.get(e220) || null;
                            return js.resolve(n);
                        }
                        addMatchingKeys(t416, e221, n83) {
                            return this.As.ss(e221, n83), js.resolve();
                        }
                        removeMatchingKeys(t417, e222, n84) {
                            this.As.os(e222, n84);
                            const s = this.persistence.referenceDelegate, i = [];
                            return s && e222.forEach((e)=>{
                                i.push(s.markPotentiallyOrphaned(t417, e));
                            }), js.waitFor(i);
                        }
                        removeMatchingKeysForTargetId(t418, e) {
                            return this.As.cs(e), js.resolve();
                        }
                        getMatchingKeysForTargetId(t419, e224) {
                            const n = this.As.hs(e224);
                            return js.resolve(n);
                        }
                        containsKey(t420, e225) {
                            return js.resolve(this.As.containsKey(e225));
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
                                has(t421) {
                                    const e = t421.lastSegment(), n = t421.popLast(), s = this.index[e];
                                    return s && s.has(n);
                                }
                                getEntries(t422) {
                                    return (this.index[t422] || new gn(ht.comparator)).toArray();
                                }
                            };
                        }
                        addToCollectionParentIndex(t, e) {
                            return this.Gt.add(e), js.resolve();
                        }
                        getCollectionParents(t423, e226) {
                            return js.resolve(this.Gt.getEntries(e226));
                        }
                    }, this.He = (function(t, e) {
                        return new Vr(t, e);
                    })(this.Ht, (t)=>this.referenceDelegate.Ps(t)
                    ), this.N = new class {
                        constructor(t){
                            this.Wt = t;
                        }
                    }(e213), this.Je = new class {
                        constructor(t434){
                            this.N = t434, this.Yn = new Map, this.Xn = new Map;
                        }
                        getBundleMetadata(t424, e233) {
                            return js.resolve(this.Yn.get(e233));
                        }
                        saveBundleMetadata(t425, e227) {
                            var n;
                            return this.Yn.set(e227.id, {
                                id: (n = e227).id,
                                version: n.version,
                                createTime: jn(n.createTime)
                            }), js.resolve();
                        }
                        getNamedQuery(t426, e228) {
                            return js.resolve(this.Xn.get(e228));
                        }
                        saveNamedQuery(t427, e229) {
                            var t431;
                            return this.Xn.set(e229.name, {
                                name: (t431 = e229).name,
                                query: function(t432) {
                                    var t428, e234;
                                    const e230 = function(t433) {
                                        var t429, t430, e235, n, s, i, o, c;
                                        let e231 = function(t) {
                                            const e = Wn(t);
                                            return 4 === e.length ? ht.emptyPath() : Xn(e);
                                        }(t433.parent);
                                        const n85 = t433.structuredQuery, s41 = n85.from ? n85.from.length : 0;
                                        let i20 = null;
                                        if (s41 > 0) {
                                            B(1 === s41);
                                            const t = n85.from[0];
                                            t.allDescendants ? i20 = t.collectionId : e231 = e231.child(t.collectionId);
                                        }
                                        let r = [];
                                        n85.where && (r = hs(n85.where));
                                        let o6 = [];
                                        n85.orderBy && (o6 = n85.orderBy.map((t436)=>{
                                            var t435;
                                            return t435 = t436, new ae(ms(t435.field), function(t) {
                                                switch(t){
                                                    case "ASCENDING":
                                                        return "asc";
                                                    case "DESCENDING":
                                                        return "desc";
                                                    default:
                                                        return;
                                                }
                                            }(t435.direction));
                                        }));
                                        let c2 = null, e232;
                                        n85.limit && (c2 = At(e232 = "object" == typeof (t429 = n85.limit) ? t429.value : t429) ? null : e232);
                                        let a = null;
                                        n85.startAt && (a = fs(n85.startAt));
                                        let u = null;
                                        return n85.endAt && (u = fs(n85.endAt)), t430 = e231, e235 = i20, n = o6, s = r, i = c2, o = a, c = u, new fe(t430, e235, n, s, i, "F", o, c);
                                    }({
                                        parent: t432.parent,
                                        structuredQuery: t432.structuredQuery
                                    });
                                    return "LAST" === t432.limitType ? (t428 = e230, e234 = e230.limit, new fe(t428.path, t428.collectionGroup, t428.explicitOrderBy.slice(), t428.filters.slice(), e234, "L", t428.startAt, t428.endAt)) : e230;
                                }(t431.bundledQuery),
                                readTime: jn(t431.readTime)
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
                getMutationQueue(t438) {
                    let e = this.bs[t438.toKey()];
                    return e || (e = new vr(this.Ht, this.referenceDelegate), this.bs[t438.toKey()] = e), e;
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
                runTransaction(t437, e254, n86) {
                    $("MemoryPersistence", "Starting transaction:", t437);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n86(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t
                        )
                    ).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t)
                    );
                }
                Ss(t446, e236) {
                    return js.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t446, e236)
                    ));
                }
            }
            class Nr extends Ks {
                constructor(t439){
                    super(), this.currentSequenceNumber = t439;
                }
            }
            class xr {
                constructor(t440){
                    this.persistence = t440, this.Ds = new br, this.Cs = null;
                }
                static Ns(t441) {
                    return new xr(t441);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw L();
                }
                addReference(t442, e237, n88) {
                    return this.Ds.addReference(n88, e237), this.xs.delete(n88.toString()), js.resolve();
                }
                removeReference(t443, e238, n87) {
                    return this.Ds.removeReference(n87, e238), this.xs.add(n87.toString()), js.resolve();
                }
                markPotentiallyOrphaned(t444, e239) {
                    return this.xs.add(e239.toString()), js.resolve();
                }
                removeTarget(t445, e240) {
                    this.Ds.cs(e240.targetId).forEach((t)=>this.xs.add(t.toString())
                    );
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(t445, e240.targetId).next((t447)=>{
                        t447.forEach((t)=>this.xs.add(t.toString())
                        );
                    }).next(()=>n.removeTargetData(t445, e240)
                    );
                }
                vs() {
                    this.Cs = new Set;
                }
                Vs(t448) {
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return js.forEach(this.xs, (n)=>{
                        const s = Pt.fromPath(n);
                        return this.ks(t448, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t448))
                    );
                }
                updateLimboDocument(t449, e241) {
                    return this.ks(t449, e241).next((t)=>{
                        t ? this.xs.delete(e241.toString()) : this.xs.add(e241.toString());
                    });
                }
                Ps(t483) {
                    return 0;
                }
                ks(t450, e242) {
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e242))
                        ,
                        ()=>this.persistence.getTargetCache().containsKey(t450, e242)
                        ,
                        ()=>this.persistence.Ss(t450, e242)
                    ]);
                }
            }
            class Fr {
                constructor(t451, e243, n95, s44){
                    this.user = t451, this.batchId = e243, this.state = n95, this.error = s44;
                }
                static $s(t452, e244, n89) {
                    const s = JSON.parse(n89);
                    let i, r = "object" == typeof s && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected"
                    ].indexOf(s.state) && (void 0 === s.error || "object" == typeof s.error);
                    return r && s.error && (r = "string" == typeof s.error.message && "string" == typeof s.error.code) && (i = new j(s.error.code, s.error.message)), r ? new Fr(t452, e244, s.state, i) : (O("SharedClientState", `Failed to parse mutation state for ID '${e244}': ${n89}`), null);
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
                constructor(t453, e245, n90){
                    this.targetId = t453, this.state = e245, this.error = n90;
                }
                static $s(t454, e246) {
                    const n = JSON.parse(e246);
                    let s, i = "object" == typeof n && -1 !== [
                        "not-current",
                        "current",
                        "rejected"
                    ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
                    return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code) && (s = new j(n.error.code, n.error.message)), i ? new Mr(t454, n.state, s) : (O("SharedClientState", `Failed to parse target state for ID '${t454}': ${e246}`), null);
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
                constructor(t455, e247){
                    this.clientId = t455, this.activeTargetIds = e247;
                }
                static $s(t456, e248) {
                    const n = JSON.parse(e248);
                    let s = "object" == typeof n && n.activeTargetIds instanceof Array, i = Vn();
                    for(let t = 0; s && t < n.activeTargetIds.length; ++t)s = bt(n.activeTargetIds[t]), i = i.add(n.activeTargetIds[t]);
                    return s ? new Lr(t456, i) : (O("SharedClientState", `Failed to parse client data for instance '${t456}': ${e248}`), null);
                }
            }
            class Br {
                constructor(t457, e249){
                    this.clientId = t457, this.onlineState = e249;
                }
                static $s(t458) {
                    const e = JSON.parse(t458);
                    return "object" == typeof e && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(e.onlineState) && "string" == typeof e.clientId ? new Br(e.clientId, e.onlineState) : (O("SharedClientState", `Failed to parse online state: ${t458}`), null);
                }
            }
            class Ur {
                constructor(){
                    this.activeTargetIds = Vn();
                }
                Fs(t459) {
                    this.activeTargetIds = this.activeTargetIds.add(t459);
                }
                Ms(t460) {
                    this.activeTargetIds = this.activeTargetIds.delete(t460);
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
                addPendingMutation(t461) {
                }
                updateMutationState(t462, e250, n91) {
                }
                addLocalQueryTarget(t463) {
                    return this.yi.Fs(t463), this.pi[t463] || "not-current";
                }
                updateQueryState(t464, e251, n92) {
                    this.pi[t464] = e251;
                }
                removeLocalQueryTarget(t465) {
                    this.yi.Ms(t465);
                }
                isLocalQueryTarget(t466) {
                    return this.yi.activeTargetIds.has(t466);
                }
                clearQueryState(t467) {
                    delete this.pi[t467];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(t468) {
                    return this.yi.activeTargetIds.has(t468);
                }
                start() {
                    return this.yi = new Ur, Promise.resolve();
                }
                handleUserChange(t469, e252, n93) {
                }
                setOnlineState(t470) {
                }
                shutdown() {
                }
                writeSequenceNumber(t471) {
                }
                notifyBundleLoaded() {
                }
            }
            class jr {
                Ti(t472) {
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
                Ti(t473) {
                    this.bi.push(t473);
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
                constructor(t474){
                    this.vi = t474.vi, this.Vi = t474.Vi;
                }
                Si(t475) {
                    this.Di = t475;
                }
                Ci(t476) {
                    this.Ni = t476;
                }
                onMessage(t477) {
                    this.xi = t477;
                }
                close() {
                    this.Vi();
                }
                send(t478) {
                    this.vi(t478);
                }
                ki() {
                    this.Di();
                }
                $i(t479) {
                    this.Ni(t479);
                }
                Oi(t480) {
                    this.xi(t480);
                }
            }
            class zr extends class {
                constructor(t489){
                    this.databaseInfo = t489, this.databaseId = t489.databaseId;
                    const e = t489.ssl ? "https" : "http";
                    this.Fi = e + "://" + t489.host, this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
                }
                Li(t488, e260, n, s) {
                    const i = this.Bi(t488, e260);
                    $("RestConnection", "Sending: ", i, n);
                    const r = {
                    };
                    return this.Ui(r, s), this.qi(t488, i, r, n).then((t)=>($("RestConnection", "Received: ", t), t)
                    , (e)=>{
                        throw F("RestConnection", `${t488} failed with error: `, e, "url: ", i, "request:", n), e;
                    });
                }
                Ki(t, e, n97, s45) {
                    return this.Li(t, e, n97, s45);
                }
                Ui(t490, e261) {
                    if (t490["X-Goog-Api-Client"] = "gl-js/ fire/" + C, t490["Content-Type"] = "text/plain", this.databaseInfo.appId && (t490["X-Firebase-GMPID"] = this.databaseInfo.appId), e261) for(const n in e261.authHeaders)e261.authHeaders.hasOwnProperty(n) && (t490[n] = e261.authHeaders[n]);
                }
                Bi(t491, e262) {
                    const n = Wr[t491];
                    return `${this.Fi}/v1/${e262}:${n}`;
                }
            } {
                constructor(t481){
                    super(t481), this.forceLongPolling = t481.forceLongPolling, this.autoDetectLongPolling = t481.autoDetectLongPolling, this.useFetchStreams = t481.useFetchStreams;
                }
                qi(t482, e253, n94, s42) {
                    return new Promise((i, r)=>{
                        const o = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.JJ;
                        o.listenOnce(_firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.NO_ERROR:
                                        const e256 = o.getResponseJson();
                                        $("Connection", "XHR received:", JSON.stringify(e256)), i(e256);
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.TIMEOUT:
                                        $("Connection", "RPC \"" + t482 + "\" timed out"), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ($("Connection", "RPC \"" + t482 + "\" failed with status:", n, "response text:", o.getResponseText()), n > 0) {
                                            const t484 = o.getResponseJson().error;
                                            if (t484 && t484.status && t484.message) {
                                                const e255 = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t484.status);
                                                r(new j(e255, t484.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", "RPC \"" + t482 + "\" completed.");
                            }
                        });
                        const c = JSON.stringify(s42);
                        o.send(e253, "POST", c, n94, 15);
                    });
                }
                ji(t485, e257) {
                    const n96 = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t485,
                        "/channel"
                    ], s43 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.UE)(), i21 = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.FJ)(), r = {
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
                    })), this.Ui(r.initMessageHeaders, e257), (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.uI)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.b$)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.d)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.w1)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.Mn)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.ru)() || (r.httpHeadersOverwriteParam = "$httpHeaders");
                    const o = n96.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s43.createWebChannel(o, r);
                    let a = !1, u = !1;
                    const h = new Gr({
                        vi: (t)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t486, e, n)=>{
                        t486.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t487) {
                                setTimeout(()=>{
                                    throw t487;
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
                        var e259;
                        if (!u) {
                            const n = t.data[0];
                            B(!!n);
                            const s = n, i = s.error || (null === (e259 = s[0]) || void 0 === e259 ? void 0 : e259.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                const t = i.status;
                                let e258 = function(t) {
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t), n = i.message;
                                void 0 === e258 && (e258 = K.INTERNAL, n = "Unknown error status: " + t + " with message " + i.message), u = !0, h.$i(new j(e258, n)), c.close();
                            } else $("Connection", "WebChannel received:", n), h.Oi(n);
                        }
                    }), g(i21, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__.ju.STAT_EVENT, (t)=>{
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
                constructor(t497, e266, n101 = 1000, s48 = 1.5, i24 = 60000){
                    this.Oe = t497, this.timerId = e266, this.Qi = n101, this.Wi = s48, this.Gi = i24, this.zi = 0, this.Hi = null, this.Ji = Date.now(), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(t492) {
                    this.cancel();
                    const e = Math.floor(this.zi + this.Zi()), n = Math.max(0, Date.now() - this.Ji), s = Math.max(0, e - n);
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t492())
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
                constructor(t493, e263, n98, s46, i22, r11, o7){
                    this.Oe = t493, this.er = n98, this.nr = s46, this.sr = i22, this.credentialsProvider = r11, this.listener = o7, this.state = 0, this.ir = 0, this.rr = null, this.cr = null, this.stream = null, this.ar = new Xr(t493, e263);
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
                mr(t494) {
                    this.gr(), this.stream.send(t494);
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
                async close(t495, e264) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== t495 ? this.ar.reset() : e264 && e264.code === K.RESOURCE_EXHAUSTED ? (O(e264.toString()), O("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e264 && e264.code === K.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), this.stream = null), this.state = t495, await this.listener.Ci(e264);
                }
                pr() {
                }
                auth() {
                    this.state = 1;
                    const t496 = this.Tr(this.ir), e265 = this.ir;
                    this.credentialsProvider.getToken().then((t)=>{
                        this.ir === e265 && this.Er(t);
                    }, (e)=>{
                        t496(()=>{
                            const t = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t498) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t498), this.stream.Si(()=>{
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
                Ir(t505) {
                    return $("PersistentStream", `close with error: ${t505}`), this.stream = null, this.close(4, t505);
                }
                Tr(t499) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t499 ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())
                        );
                    };
                }
            }
            class to extends Zr {
                constructor(t500, e269, n99, s47, i23){
                    super(t500, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e269, n99, i23), this.N = s47;
                }
                Ar(t501) {
                    return this.sr.ji("Listen", t501);
                }
                onMessage(t502) {
                    this.ar.reset();
                    const e268 = function(t506, e270) {
                        let n;
                        if ("targetChange" in e270) {
                            var t503, t504, e267;
                            e270.targetChange;
                            const s = "NO_CHANGE" === (t503 = e270.targetChange.targetChangeType || "NO_CHANGE") ? 0 : "ADD" === t503 ? 1 : "REMOVE" === t503 ? 2 : "CURRENT" === t503 ? 3 : "RESET" === t503 ? 4 : L(), i = e270.targetChange.targetIds || [], r = (t504 = t506, e267 = e270.targetChange.resumeToken, t504.D ? (B(void 0 === e267 || "string" == typeof e267), _t.fromBase64String(e267 || "")) : (B(void 0 === e267 || e267 instanceof Uint8Array), _t.fromUint8Array(e267 || new Uint8Array))), o = e270.targetChange.cause, c = o && function(t) {
                                const e = void 0 === t.code ? K.UNKNOWN : dn(t.code);
                                return new j(e, t.message || "");
                            }(o);
                            n = new xn(s, i, r, c || null);
                        } else if ("documentChange" in e270) {
                            e270.documentChange;
                            const s = e270.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t506, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o), a = s.targetIds || [], u = s.removedTargetIds || [];
                            n = new Cn(a, u, c.key, c);
                        } else if ("documentDelete" in e270) {
                            e270.documentDelete;
                            const s = e270.documentDelete;
                            s.document;
                            const i = zn(t506, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r), c = s.removedTargetIds || [];
                            n = new Cn([], c, o.key, o);
                        } else if ("documentRemove" in e270) {
                            e270.documentRemove;
                            const s = e270.documentRemove;
                            s.document;
                            const i = zn(t506, s.document), r = s.removedTargetIds || [];
                            n = new Cn([], r, i, null);
                        } else {
                            if (!("filter" in e270)) return L();
                            {
                                e270.filter;
                                const t = e270.filter;
                                t.targetId;
                                const s = t.count || 0, i = new un(s), r = t.targetId;
                                n = new Nn(r, i);
                            }
                        }
                        return n;
                    }(this.N, t502), n100 = function(t) {
                        if (!("targetChange" in t)) return rt.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t502);
                    return this.listener.Rr(e268, n100);
                }
                br(t507) {
                    const e271 = {
                    };
                    e271.database = Yn(this.N), e271.addTarget = (function(t509, e273) {
                        let n103;
                        const s49 = e273.target;
                        return (n103 = Ht(s49) ? {
                            documents: {
                                documents: [
                                    Hn(t509, s49.path)
                                ]
                            }
                        } : {
                            query: (function(t510, e274) {
                                var t508, e272;
                                const n = {
                                    structuredQuery: {
                                    }
                                }, s = e274.path;
                                null !== e274.collectionGroup ? (n.parent = Hn(t510, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e274.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n.parent = Hn(t510, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t511) {
                                    if (0 !== t511.length) {
                                        const e = t511.map((t512)=>(function(t) {
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
                                            })(t512)
                                        );
                                        return 1 === e.length ? e[0] : {
                                            compositeFilter: {
                                                op: "AND",
                                                filters: e
                                            }
                                        };
                                    }
                                }(e274.filters);
                                i && (n.structuredQuery.where = i);
                                const r = function(t514) {
                                    if (0 !== t514.length) return t514.map((t)=>{
                                        var t513;
                                        return {
                                            field: _s((t513 = t).field),
                                            direction: Mn[t513.dir]
                                        };
                                    });
                                }(e274.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (t508 = t510, e272 = e274.limit, t508.D || At(e272) ? e272 : {
                                    value: e272
                                });
                                return null !== o && (n.structuredQuery.limit = o), e274.startAt && (n.structuredQuery.startAt = ls(e274.startAt)), e274.endAt && (n.structuredQuery.endAt = ls(e274.endAt)), n;
                            })(t509, s49)
                        }).targetId = e273.targetId, e273.resumeToken.approximateByteSize() > 0 ? n103.resumeToken = qn(t509, e273.resumeToken) : e273.snapshotVersion.compareTo(rt.min()) > 0 && (n103.readTime = Un(t509, e273.snapshotVersion.toTimestamp())), n103;
                    })(this.N, t507);
                    const n102 = function(t, e275) {
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
                        }(0, e275.purpose);
                        return null == n ? null : {
                            "goog-listen-tags": n
                        };
                    }(this.N, t507);
                    n102 && (e271.labels = n102), this.mr(e271);
                }
                Pr(t521) {
                    const e = {
                    };
                    e.database = Yn(this.N), e.removeTarget = t521, this.mr(e);
                }
            }
            class eo extends null {
                constructor(t515, e278, n105, s50, i26){
                    super(t515, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", e278, n105, i26), this.N = s50, this.vr = !1;
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
                Ar(t516) {
                    return this.sr.ji("Write", t516);
                }
                onMessage(t517) {
                    if (B(!!t517.streamToken), this.lastStreamToken = t517.streamToken, this.vr) {
                        var t519, e277;
                        this.ar.reset();
                        const e276 = (t519 = t517.writeResults, e277 = t517.commitTime, t519 && t519.length > 0 ? (B(void 0 !== e277), t519.map((t)=>{
                            var t518, e;
                            let n;
                            return t518 = t, e = e277, (n = t518.updateTime ? jn(t518.updateTime) : jn(e)).isEqual(rt.min()) && (n = jn(e)), new We(n, t518.transformResults || []);
                        })) : []), n104 = jn(t517.commitTime);
                        return this.listener.Dr(n104, e276);
                    }
                    return B(!t517.writeResults || 0 === t517.writeResults.length), this.vr = !0, this.listener.Cr();
                }
                Nr() {
                    const t = {
                    };
                    t.database = Yn(this.N), this.mr(t);
                }
                Sr(t520) {
                    const e = {
                        streamToken: this.lastStreamToken,
                        writes: t520.map((t)=>ss(this.N, t)
                        )
                    };
                    this.mr(e);
                }
            }
            class no extends class {
            } {
                constructor(t523, e282, n109){
                    super(), this.credentials = t523, this.sr = e282, this.N = n109, this.kr = !1;
                }
                $r() {
                    if (this.kr) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(t522, e279, n106) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t522, e279, n106, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                Ki(t524, e280, n107) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t524, e280, n107, s)
                    ).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class io {
                constructor(t525, e281, n108, s51, i25){
                    this.localStore = t525, this.datastore = e281, this.asyncQueue = n108, this.remoteSyncer = {
                    }, this.jr = [], this.Qr = new Map, this.Wr = new Set, this.Gr = [], this.zr = i25, this.zr.Ti((t526)=>{
                        n108.enqueueAndForget(async ()=>{
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
                        qr(t527) {
                            "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${t527.toString()}`), this.Br("Offline")));
                        }
                        set(t528) {
                            this.Kr(), this.Or = 0, "Online" === t528 && (this.Mr = !1), this.Br(t528);
                        }
                        Br(t529) {
                            t529 !== this.state && (this.state = t529, this.onlineStateHandler(t529));
                        }
                        Ur(t530) {
                            const e = `Could not reach Cloud Firestore backend. ${t530}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                            this.Mr ? (O(e), this.Mr = !1) : $("OnlineStateTracker", e);
                        }
                        Kr() {
                            null !== this.Fr && (this.Fr.cancel(), this.Fr = null);
                        }
                    }(n108, s51);
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
            async function yo(t531, e283, n110) {
                if (t531.Hr.set("Online"), e283 instanceof xn && 2 === e283.state && e283.cause) try {
                    await async function(t, e) {
                        const n = e.cause;
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(t531, e283);
                } catch (n111) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e283.targetIds.join(","), n111), await po(t531, n111);
                }
                else if (e283 instanceof Cn ? t531.Jr.rt(e283) : e283 instanceof Nn ? t531.Jr.ft(e283) : t531.Jr.at(e283), !n110.isEqual(rt.min())) try {
                    const e284 = await fr(t531.localStore);
                    n110.compareTo(e284) >= 0 && await function(t, e285) {
                        const n112 = t.Jr._t(e285);
                        return n112.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const i = t.Qr.get(s);
                                i && t.Qr.set(s, i.withResumeToken(n.resumeToken, e285));
                            }
                        }), n112.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (n) {
                                t.Qr.set(e, n.withResumeToken(_t.EMPTY_BYTE_STRING, n.snapshotVersion)), ho(t, e);
                                const s = new ii(n.target, e, 1, n.sequenceNumber);
                                uo(t, s);
                            }
                        }), t.remoteSyncer.applyRemoteEvent(n112);
                    }(t531, n110);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t531, e);
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
                } catch (t532) {
                    await po(e, t532);
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
            async function So(t533, e286) {
                e286 && No(t533).Vr && await async function(t534, e) {
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
                        const n = t534.jr.shift();
                        No(t534).dr(), await To(t534, ()=>t534.remoteSyncer.rejectFailedWrite(n.batchId, e)
                        ), await Eo(t534);
                    }
                }(t533, e286), Ro(t533) && bo(t533);
            }
            async function Do(t, e) {
                const n = q(t);
                e ? (n.Wr.delete(2), await ro(n)) : e || (n.Wr.add(2), await oo(n), n.Hr.set("Unknown"));
            }
            function Co(t535) {
                return t535.Yr || (t535.Yr = (function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new to(e, s.sr, s.credentials, s.N, n);
                })(t535.datastore, t535.asyncQueue, {
                    Si: mo.bind(null, t535),
                    Ci: go.bind(null, t535),
                    Rr: yo.bind(null, t535)
                }), t535.Gr.push(async (e)=>{
                    e ? (t535.Yr.dr(), fo(t535) ? lo(t535) : t535.Hr.set("Unknown")) : (await t535.Yr.stop(), _o(t535));
                })), t535.Yr;
            }
            function No(t536) {
                return t536.Xr || (t536.Xr = (function(t, e, n) {
                    const s = q(t);
                    return s.$r(), new eo(e, s.sr, s.credentials, s.N, n);
                })(t536.datastore, t536.asyncQueue, {
                    Si: Po.bind(null, t536),
                    Ci: So.bind(null, t536),
                    Cr: vo.bind(null, t536),
                    Dr: Vo.bind(null, t536)
                }), t536.Gr.push(async (e)=>{
                    e ? (t536.Xr.dr(), await Eo(t536)) : (await t536.Xr.stop(), t536.jr.length > 0 && ($("RemoteStore", `Stopping write stream with ${t536.jr.length} pending writes`), t536.jr = []));
                })), t536.Xr;
            }
            class xo {
                constructor(t540, e288, n114, s55, i29){
                    this.asyncQueue = t540, this.timerId = e288, this.targetTimeMs = n114, this.op = s55, this.removalCallback = i29, this.deferred = new Q, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t)=>{
                    });
                }
                static createAndSchedule(t537, e287, n113, s52, i27) {
                    const r = Date.now() + n113, o = new xo(t537, e287, r, s52, i27);
                    return o.start(n113), o;
                }
                start(t538) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed()
                    , t538);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(t539) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t539 ? ": " + t539 : ""))));
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
                constructor(t541){
                    this.comparator = t541 ? (e, n)=>t541(e, n) || Pt.comparator(e.key, n.key)
                     : (t, e)=>Pt.comparator(t.key, e.key)
                    , this.keyedMap = In(), this.sortedSet = new wn(this.comparator);
                }
                static emptySet(t553) {
                    return new $o(t553.comparator);
                }
                has(t542) {
                    return null != this.keyedMap.get(t542);
                }
                get(t543) {
                    return this.keyedMap.get(t543);
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
                indexOf(t544) {
                    const e = this.keyedMap.get(t544);
                    return e ? this.sortedSet.indexOf(e) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(t545) {
                    this.sortedSet.inorderTraversal((e, n)=>(t545(e), !1)
                    );
                }
                add(t546) {
                    const e = this.delete(t546.key);
                    return e.copy(e.keyedMap.insert(t546.key, t546), e.sortedSet.insert(t546, null));
                }
                delete(t547) {
                    const e = this.get(t547);
                    return e ? this.copy(this.keyedMap.remove(t547), this.sortedSet.remove(e)) : this;
                }
                isEqual(t548) {
                    if (!(t548 instanceof $o)) return !1;
                    if (this.size !== t548.size) return !1;
                    const e = this.sortedSet.getIterator(), n = t548.sortedSet.getIterator();
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
                copy(t549, e291) {
                    const n = new $o;
                    return n.comparator = this.comparator, n.keyedMap = t549, n.sortedSet = e291, n;
                }
            }
            class Oo {
                constructor(){
                    this.Zr = new wn(Pt.comparator);
                }
                track(t550) {
                    const e = t550.doc.key, n = this.Zr.get(e);
                    n ? 0 !== t550.type && 3 === n.type ? this.Zr = this.Zr.insert(e, t550) : 3 === t550.type && 1 !== n.type ? this.Zr = this.Zr.insert(e, {
                        type: n.type,
                        doc: t550.doc
                    }) : 2 === t550.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t550.doc
                    }) : 2 === t550.type && 0 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 0,
                        doc: t550.doc
                    }) : 1 === t550.type && 0 === n.type ? this.Zr = this.Zr.remove(e) : 1 === t550.type && 2 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 1,
                        doc: n.doc
                    }) : 0 === t550.type && 1 === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2,
                        doc: t550.doc
                    }) : L() : this.Zr = this.Zr.insert(e, t550);
                }
                eo() {
                    const t = [];
                    return this.Zr.inorderTraversal((e, n)=>{
                        t.push(n);
                    }), t;
                }
            }
            class Fo {
                constructor(t551, e289, n116, s53, i28, r12, o8, c3){
                    this.query = t551, this.docs = e289, this.oldDocs = n116, this.docChanges = s53, this.mutatedKeys = i28, this.fromCache = r12, this.syncStateChanged = o8, this.excludesMetadataChanges = c3;
                }
                static fromInitialDocuments(t552, e290, n115, s54) {
                    const i = [];
                    return e290.forEach((t)=>{
                        i.push({
                            type: 0,
                            doc: t
                        });
                    }), new Fo(t552, e290, $o.emptySet(e290), i, n115, s54, !0, !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t555) {
                    if (!(this.fromCache === t555.fromCache && this.syncStateChanged === t555.syncStateChanged && this.mutatedKeys.isEqual(t555.mutatedKeys) && Ae(this.query, t555.query) && this.docs.isEqual(t555.docs) && this.oldDocs.isEqual(t555.oldDocs))) return !1;
                    const e = this.docChanges, n = t555.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let t554 = 0; t554 < e.length; t554++)if (e[t554].type !== n[t554].type || !e[t554].doc.isEqual(n[t554].doc)) return !1;
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
                } catch (t556) {
                    const n = ko(t556, `Initialization of query '${be(e.query)}' failed`);
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
                for (const t557 of e){
                    const e = t557.query, i = n.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t557) && (s = !0);
                        i.no = t557;
                    }
                }
                s && jo(n);
            }
            function Ko(t, e, n) {
                const s = q(t), i = s.queries.get(e);
                if (i) for (const t558 of i.listeners)t558.onError(n);
                s.queries.delete(e);
            }
            function jo(t559) {
                t559.so.forEach((t)=>{
                    t.next();
                });
            }
            class Qo {
                constructor(t570, e295, n118){
                    this.query = t570, this.oo = e295, this.co = !1, this.ao = null, this.onlineState = "Unknown", this.options = n118 || {
                    };
                }
                ro(t560) {
                    if (!this.options.includeMetadataChanges) {
                        const e = [];
                        for (const n of t560.docChanges)3 !== n.type && e.push(n);
                        t560 = new Fo(t560.query, t560.docs, t560.oldDocs, e, t560.mutatedKeys, t560.fromCache, t560.syncStateChanged, !0);
                    }
                    let e = !1;
                    return this.co ? this.uo(t560) && (this.oo.next(t560), e = !0) : this.ho(t560, this.onlineState) && (this.lo(t560), e = !0), this.ao = t560, e;
                }
                onError(t561) {
                    this.oo.error(t561);
                }
                io(t562) {
                    this.onlineState = t562;
                    let e = !1;
                    return this.ao && !this.co && this.ho(this.ao, t562) && (this.lo(this.ao), e = !0), e;
                }
                ho(t563, e292) {
                    if (!t563.fromCache) return !0;
                    const n = "Offline" !== e292;
                    return (!this.options.fo || !n) && (!t563.docs.isEmpty() || "Offline" === e292);
                }
                uo(t564) {
                    if (t564.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t564.hasPendingWrites;
                    return !(!t564.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
                }
                lo(t565) {
                    t565 = Fo.fromInitialDocuments(t565.query, t565.docs, t565.mutatedKeys, t565.fromCache), this.co = !0, this.oo.next(t565);
                }
            }
            class Jo {
                constructor(t566){
                    this.key = t566;
                }
            }
            class Yo {
                constructor(t567){
                    this.key = t567;
                }
            }
            class Xo {
                constructor(t568, e293){
                    this.query = t568, this.po = e293, this.To = null, this.current = !1, this.Eo = Pn(), this.mutatedKeys = Pn(), this.Io = ve(t568), this.Ao = new $o(this.Io);
                }
                get Ro() {
                    return this.po;
                }
                bo(t569, e294) {
                    const n = e294 ? e294.Po : new Oo, s = e294 ? e294.Ao : this.Ao;
                    let i = e294 ? e294.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    if (t569.inorderTraversal((t, e)=>{
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
                vo(t572, e297) {
                    return t572.hasLocalMutations && e297.hasCommittedMutations && !e297.hasLocalMutations;
                }
                applyChanges(t571, e296, n117) {
                    const s = this.Ao;
                    this.Ao = t571.Ao, this.mutatedKeys = t571.mutatedKeys;
                    const i = t571.Po.eo();
                    i.sort((t573, e298)=>(function(t574, e) {
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
                            return n(t574) - n(e);
                        })(t573.type, e298.type) || this.Io(t573.doc, e298.doc)
                    ), this.Vo(n117);
                    const r = e296 ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 : 0, c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t571.Ao, s, i, t571.mutatedKeys, 0 === o, c, !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                io(t577) {
                    return this.current && "Offline" === t577 ? (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo,
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(t575) {
                    return !this.po.has(t575) && !!this.Ao.has(t575) && !this.Ao.get(t575).hasLocalMutations;
                }
                Vo(t576) {
                    t576 && (t576.addedDocuments.forEach((t)=>this.po = this.po.add(t)
                    ), t576.modifiedDocuments.forEach((t)=>{
                    }), t576.removedDocuments.forEach((t)=>this.po = this.po.delete(t)
                    ), this.current = t576.current);
                }
                So() {
                    if (!this.current) return [];
                    const t578 = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    const e = [];
                    return t578.forEach((t)=>{
                        this.Eo.has(t) || e.push(new Yo(t));
                    }), this.Eo.forEach((n)=>{
                        t578.has(n) || e.push(new Jo(n));
                    }), e;
                }
                No(t582) {
                    this.po = t582.Gn, this.Eo = Pn();
                    const e = this.bo(t582.documents);
                    return this.applyChanges(e, !0);
                }
                xo() {
                    return Fo.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class Zo {
                constructor(t579, e300, n120){
                    this.query = t579, this.targetId = e300, this.view = n120;
                }
            }
            class tc {
                constructor(t580){
                    this.key = t580, this.ko = !1;
                }
            }
            class ec {
                constructor(t581, e299, n119, s56, i30, r13){
                    this.localStore = t581, this.remoteStore = e299, this.eventManager = n119, this.sharedClientState = s56, this.currentUser = i30, this.maxConcurrentLimboResolutions = r13, this.$o = {
                    }, this.Oo = new ji((t)=>Re(t)
                    , Ae), this.Fo = new Map, this.Mo = new Set, this.Lo = new wn(Pt.comparator), this.Bo = new Map, this.Uo = new br, this.qo = {
                    }, this.Ko = new Map, this.jo = Ni.ie(), this.onlineState = "Unknown", this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function nc(t584, e301) {
                const n121 = Cc(t584);
                let s57, i31;
                const r = n121.Oo.get(e301);
                if (r) s57 = r.targetId, n121.sharedClientState.addLocalQueryTarget(s57), i31 = r.view.xo();
                else {
                    const t583 = await function(t585, e) {
                        const n = q(t585);
                        return n.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                            let s;
                            return n.ze.getTargetData(t, e).next((i32)=>i32 ? (s = i32, js.resolve(s)) : n.ze.allocateTargetId(t).next((i)=>(s = new ii(e, i, 0, t.currentSequenceNumber), n.ze.addTargetData(t, s).next(()=>s
                                    ))
                                )
                            );
                        }).then((t)=>{
                            const s = n.Un.get(t.targetId);
                            return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Un = n.Un.insert(t.targetId, t), n.qn.set(e, t.targetId)), t;
                        });
                    }(n121.localStore, Ee(e301)), r = n121.sharedClientState.addLocalQueryTarget(t583.targetId);
                    i31 = await sc(n121, e301, s57 = t583.targetId, "current" === r), n121.isPrimaryClient && co(n121.remoteStore, t583);
                }
                return i31;
            }
            async function sc(t586, e302, n122, s58) {
                t586.Wo = (e303, n123, s59)=>(async function(t587, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && (i = await yr(t587.localStore, e.query, !1).then(({ documents: t  })=>e.view.bo(t, i)
                        ));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, t587.isPrimaryClient, r);
                        return mc(t587, e.targetId, o.Do), o.snapshot;
                    })(t586, e303, n123, s59)
                ;
                const i33 = await yr(t586.localStore, e302, !0), r14 = new Xo(e302, i33.Gn), o9 = r14.bo(i33.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n122, s58 && "Offline" !== t586.onlineState), a = r14.applyChanges(o9, t586.isPrimaryClient, c);
                mc(t586, n122, a.Do);
                const u = new Zo(e302, n122, r14);
                return t586.Oo.set(e302, u), t586.Fo.has(n122) ? t586.Fo.get(n122).push(e302) : t586.Fo.set(n122, [
                    e302
                ]), a.snapshot;
            }
            async function ic(t588, e) {
                const n = q(t588), s = n.Oo.get(e), i = n.Fo.get(s.targetId);
                if (i.length > 1) return n.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e)
                )), void n.Oo.delete(e);
                n.isPrimaryClient ? (n.sharedClientState.removeLocalQueryTarget(s.targetId), n.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(n.localStore, s.targetId, !1).then(()=>{
                    n.sharedClientState.clearQueryState(s.targetId), ao(n.remoteStore, s.targetId), wc(n, s.targetId);
                }).catch(Fi)) : (wc(n, s.targetId), await gr(n.localStore, s.targetId, !0));
            }
            async function oc(t591, e304) {
                const n124 = q(t591);
                try {
                    const t589 = await function(t592, e307) {
                        const n127 = q(t592), s61 = e307.snapshotVersion;
                        let i = n127.Un;
                        return n127.persistence.runTransaction("Apply remote event", "readwrite-primary", (t594)=>{
                            var t590, e305, n125, s60, i34;
                            const r16 = n127.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            i = n127.Un;
                            const o10 = [];
                            e307.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (c) {
                                    o10.push(n127.ze.removeMatchingKeys(t594, e.removedDocuments, r).next(()=>n127.ze.addMatchingKeys(t594, e.addedDocuments, r)
                                    ));
                                    const a = e.resumeToken;
                                    if (a.approximateByteSize() > 0) {
                                        var t593, e306, n126;
                                        const u = c.withResumeToken(a, s61).withSequenceNumber(t594.currentSequenceNumber);
                                        i = i.insert(r, u), t593 = c, e306 = u, n126 = e, ((B(e306.resumeToken.approximateByteSize() > 0), 0 === t593.resumeToken.approximateByteSize()) ? 0 : e306.snapshotVersion.toMicroseconds() - t593.snapshotVersion.toMicroseconds() >= 300000000 ? 0 : !(n126.addedDocuments.size + n126.modifiedDocuments.size + n126.removedDocuments.size > 0)) || o10.push(n127.ze.updateTargetData(t594, u));
                                    }
                                }
                            });
                            let c4 = Tn(), r15;
                            if (e307.documentUpdates.forEach((s, i)=>{
                                e307.resolvedLimboDocuments.has(s) && o10.push(n127.persistence.referenceDelegate.updateLimboDocument(t594, s));
                            }), o10.push((t590 = t594, e305 = r16, n125 = e307.documentUpdates, s60 = s61, i34 = void 0, r15 = Pn(), n125.forEach((t)=>r15 = r15.add(t)
                            ), e305.getEntries(t590, r15).next((t)=>{
                                let r = Tn();
                                return n125.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i34 ? void 0 : i34.get(n)) || s60;
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? (e305.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (e305.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c4 = t;
                            })), !s61.isEqual(rt.min())) {
                                const e = n127.ze.getLastRemoteSnapshotVersion(t594).next((e)=>n127.ze.setTargetsMetadata(t594, t594.currentSequenceNumber, s61)
                                );
                                o10.push(e);
                            }
                            return js.waitFor(o10).next(()=>r16.apply(t594)
                            ).next(()=>n127.Qn.vn(t594, c4)
                            ).next(()=>c4
                            );
                        }).then((t)=>(n127.Un = i, t)
                        );
                    }(n124.localStore, e304);
                    e304.targetChanges.forEach((t, e)=>{
                        const s = n124.Bo.get(e);
                        s && (B(t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1), t.addedDocuments.size > 0 ? s.ko = !0 : t.modifiedDocuments.size > 0 ? B(s.ko) : t.removedDocuments.size > 0 && (B(s.ko), s.ko = !1));
                    }), await pc(n124, t589, e304);
                } catch (t) {
                    await Fi(t);
                }
            }
            function cc(t, e308, n128) {
                const s62 = q(t);
                if (s62.isPrimaryClient && 0 === n128 || !s62.isPrimaryClient && 1 === n128) {
                    const t595 = [];
                    s62.Oo.forEach((n, s)=>{
                        const i = s.view.io(e308);
                        i.snapshot && t595.push(i.snapshot);
                    }), (function(t, e) {
                        const n129 = q(t);
                        n129.onlineState = e;
                        let s = !1;
                        n129.queries.forEach((t, n)=>{
                            for (const t596 of n.listeners)t596.io(e) && (s = !0);
                        }), s && jo(n129);
                    })(s62.eventManager, e308), t595.length && s62.$o.Rr(t595), s62.onlineState = e308, s62.isPrimaryClient && s62.sharedClientState.setOnlineState(e308);
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
            function wc(t, e309, n = null) {
                for (const s of (t.sharedClientState.removeLocalQueryTarget(e309), t.Fo.get(e309)))t.Oo.delete(s), n && t.$o.Go(s, n);
                t.Fo.delete(e309), t.isPrimaryClient && t.Uo.cs(e309).forEach((e)=>{
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
            async function pc(t597, e310, n130) {
                const s63 = q(t597), i35 = [], r = [], o = [];
                s63.Oo.isEmpty() || (s63.Oo.forEach((t598, c)=>{
                    o.push(s63.Wo(c, e310, n130).then((t)=>{
                        if (t) {
                            s63.isPrimaryClient && s63.sharedClientState.updateQueryState(c.targetId, t.fromCache ? "not-current" : "current"), i35.push(t);
                            const e = or.kn(c.targetId, t);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), s63.$o.Rr(i35), await async function(t600, e311) {
                    const n = q(t600);
                    try {
                        await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t)=>js.forEach(e311, (e)=>js.forEach(e.Nn, (s)=>n.persistence.referenceDelegate.addReference(t, e.targetId, s)
                                ).next(()=>js.forEach(e.xn, (s)=>n.persistence.referenceDelegate.removeReference(t, e.targetId, s)
                                    )
                                )
                            )
                        );
                    } catch (t) {
                        if (!Hs(t)) throw t;
                        $("LocalStore", "Failed to update sequence numbers: " + t);
                    }
                    for (const t599 of e311){
                        const e = t599.targetId;
                        if (!t599.fromCache) {
                            const t = n.Un.get(e), s = t.snapshotVersion, i = t.withLastLimboFreeSnapshotVersion(s);
                            n.Un = n.Un.insert(e, i);
                        }
                    }
                }(s63.localStore, r));
            }
            async function Tc(t603, e) {
                const n = q(t603);
                if (!n.currentUser.isEqual(e)) {
                    var t601, e312;
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t602 = await hr(n.localStore, e);
                    n.currentUser = e, e312 = "'waitForPendingWrites' promise is rejected due to a user change.", (t601 = n).Ko.forEach((t604)=>{
                        t604.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e312));
                        });
                    }), t601.Ko.clear(), n.sharedClientState.handleUserChange(e, t602.removedBatchIds, t602.addedBatchIds), await pc(n, t602.Wn);
                }
            }
            function Ec(t, e) {
                const n = q(t), s = n.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t = Pn();
                    const s = n.Fo.get(e);
                    if (!s) return t;
                    for (const e313 of s){
                        const s = n.Oo.get(e313);
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
                async initialize(t610) {
                    this.N = Yr(t610.databaseInfo.databaseId), this.sharedClientState = this.Ho(t610), this.persistence = this.Jo(t610), await this.persistence.start(), this.gcScheduler = this.Yo(t610), this.localStore = this.Xo(t610);
                }
                Yo(t605) {
                    return null;
                }
                Xo(t606) {
                    var e;
                    return this.persistence, e = new cr, t606.initialUser, this.N, new ar(this.persistence, e, t606.initialUser, this.N);
                }
                Jo(t607) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t608) {
                    return new Kr;
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class Fc {
                async initialize(t609, e316) {
                    this.localStore || (this.localStore = t609.localStore, this.sharedClientState = t609.sharedClientState, this.datastore = this.createDatastore(e316), this.remoteStore = this.createRemoteStore(e316), this.eventManager = this.createEventManager(e316), this.syncEngine = this.createSyncEngine(e316, !t609.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t)=>cc(this.syncEngine, t, 1)
                    , this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t613) {
                    return new Lo;
                }
                createDatastore(t611) {
                    var e, n;
                    const e314 = Yr(t611.databaseInfo.databaseId), n131 = (t611.databaseInfo, new zr(t611.databaseInfo));
                    return t611.credentials, e = n131, n = e314, new no(t611.credentials, e, n);
                }
                createRemoteStore(t612) {
                    var i, r;
                    return this.localStore, this.datastore, t612.asyncQueue, i = (t)=>cc(this.syncEngine, t, 0)
                    , r = Qr.bt() ? new Qr : new jr, new io(this.localStore, this.datastore, t612.asyncQueue, i, r);
                }
                createSyncEngine(t614, e315) {
                    return (function(t, e, n, s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t614.initialUser, t614.maxConcurrentLimboResolutions, e315);
                }
                terminate() {
                    return (async function(t) {
                        const e = q(t);
                        $("RemoteStore", "RemoteStore shutting down."), e.Wr.add(5), await oo(e), e.zr.shutdown(), e.Hr.set("Unknown");
                    })(this.remoteStore);
                }
            }
            class Lc {
                constructor(t619){
                    this.observer = t619, this.muted = !1;
                }
                next(t615) {
                    this.observer.next && this.tc(this.observer.next, t615);
                }
                error(t616) {
                    this.observer.error ? this.tc(this.observer.error, t616) : console.error("Uncaught Error in snapshot listener:", t616);
                }
                ec() {
                    this.muted = !0;
                }
                tc(t617, e318) {
                    this.muted || setTimeout(()=>{
                        this.muted || t617(e318);
                    }, 0);
                }
            }
            class Kc {
                constructor(t618, e317, n132){
                    this.credentials = t618, this.asyncQueue = e317, this.databaseInfo = n132, this.user = D.UNAUTHENTICATED, this.clientId = (class {
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
                    , this.credentials.start(e317, async (t)=>{
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
                setCredentialChangeListener(t620) {
                    this.credentialListener = t620;
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
            async function jc(t621, e) {
                t621.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t621.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t621.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await hr(e.localStore, t), s = t);
                }), e.persistence.setDatabaseDeletedListener(()=>t621.terminate()
                ), t621.offlineComponents = e;
            }
            async function Qc(t622, e319) {
                t622.asyncQueue.verifyOperationInProgress();
                const n133 = await Wc(t622);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s64 = await t622.getConfiguration();
                await e319.initialize(n133, s64), t622.setCredentialChangeListener((t623)=>(async function(t, e) {
                        const n = q(t);
                        n.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(n);
                        n.Wr.add(3), await oo(n), s && n.Hr.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.Wr.delete(3), await ro(n);
                    })(e319.remoteStore, t623)
                ), t622.onlineComponents = e319;
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
                constructor(t626, e321, n134, s65, i37, r18, o11, c5){
                    this.databaseId = t626, this.appId = e321, this.persistenceKey = n134, this.host = s65, this.ssl = i37, this.forceLongPolling = r18, this.autoDetectLongPolling = o11, this.useFetchStreams = c5;
                }
            }
            class ha {
                constructor(t624, e320){
                    this.projectId = t624, this.database = e320 || "(default)";
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(t625) {
                    return t625 instanceof ha && t625.projectId === this.projectId && t625.database === this.database;
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
                        var t627;
                        const e = (t627 = t).constructor ? t627.constructor.name : null;
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
                constructor(t628){
                    var e322;
                    if (void 0 === t628.host) {
                        if (void 0 !== t628.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t628.host, this.ssl = null === (e322 = t628.ssl) || void 0 === e322 || e322;
                    if (this.credentials = t628.credentials, this.ignoreUndefinedProperties = !!t628.ignoreUndefinedProperties, void 0 === t628.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t628.cacheSizeBytes && t628.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t628.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t628.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t628.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t628.useFetchStreams, (function(t, e, n, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
                    })("experimentalForceLongPolling", t628.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t628.experimentalAutoDetectLongPolling);
                }
                isEqual(t630) {
                    return this.host === t630.host && this.ssl === t630.ssl && this.credentials === t630.credentials && this.cacheSizeBytes === t630.cacheSizeBytes && this.experimentalForceLongPolling === t630.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t630.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t630.ignoreUndefinedProperties && this.useFetchStreams === t630.useFetchStreams;
                }
            }
            class Ta {
                constructor(t629, e323){
                    this._credentials = e323, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({
                    }), this._settingsFrozen = !1, t629 instanceof ha ? this._databaseId = t629 : (this._app = t629, this._databaseId = (function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, "\"projectId\" not provided in firebase.initializeApp.");
                        return new ha(t.options.projectId);
                    })(t629));
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
                _setSettings(t631) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t631), void 0 !== t631.credentials && (this._credentials = (function(t) {
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
                    })(t631.credentials));
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
                constructor(t637, e326, n137){
                    this.converter = e326, this._key = n137, this.type = "document", this.firestore = t637;
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
                withConverter(t632) {
                    return new Ia(this.firestore, t632, this._key);
                }
            }
            class Aa {
                constructor(t633, e324, n135){
                    this.converter = e324, this._query = n135, this.type = "query", this.firestore = t633;
                }
                withConverter(t634) {
                    return new Aa(this.firestore, t634, this._query);
                }
            }
            class Ra extends Aa {
                constructor(t635, e325, n136){
                    super(t635, e325, we(n136)), this._path = n136, this.type = "collection";
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
                withConverter(t636) {
                    return new Ra(this.firestore, t636, this._path);
                }
            }
            function ba(t638, e327, ...n138) {
                if (t638 = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__.m9)(t638), (function(t, e, n) {
                    if (!n) throw new j(K.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
                })("collection", "path", e327), t638 instanceof Ta) {
                    const s = ht.fromString(e327, ...n138);
                    return _a(s), new Ra(t638, null, s);
                }
                {
                    if (!(t638 instanceof Ia || t638 instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t638._path.child(ht.fromString(e327, ...n138));
                    return _a(s), new Ra(t638.firestore, null, s);
                }
            }
            class ka extends Ta {
                constructor(t639, e328){
                    super(t639, e328), this.type = "firestore", this._queue = new class {
                        constructor(){
                            this._c = Promise.resolve(), this.mc = [], this.gc = !1, this.yc = [], this.Tc = null, this.Ec = !1, this.Ic = !1, this.Ac = [], this.ar = new Xr(this, "async_queue_retry"), this.Rc = ()=>{
                                const t = Jr();
                                t && $("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                            };
                            const t640 = Jr();
                            t640 && "function" == typeof t640.addEventListener && t640.addEventListener("visibilitychange", this.Rc);
                        }
                        get isShuttingDown() {
                            return this.gc;
                        }
                        enqueueAndForget(t647) {
                            this.enqueue(t647);
                        }
                        enqueueAndForgetEvenWhileRestricted(t641) {
                            this.bc(), this.Pc(t641);
                        }
                        enterRestrictedMode(t642) {
                            if (!this.gc) {
                                this.gc = !0, this.Ic = t642 || !1;
                                const e = Jr();
                                e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                            }
                        }
                        enqueue(t643) {
                            if (this.bc(), this.gc) return new Promise(()=>{
                            });
                            const e = new Q;
                            return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t643().then(e.resolve, e.reject), e.promise)
                            ).then(()=>e.promise
                            );
                        }
                        enqueueRetryable(t644) {
                            this.enqueueAndForget(()=>(this.mc.push(t644), this.vc())
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
                        Pc(t645) {
                            const e330 = this._c.then(()=>(this.Ec = !0, t645().catch((t)=>{
                                    var t646;
                                    this.Tc = t, this.Ec = !1;
                                    let e;
                                    const e329 = (e = (t646 = t).message || "", t646.stack && (e = t646.stack.includes(t646.message) ? t646.stack : t646.message + "\n" + t646.stack), e);
                                    throw O("INTERNAL UNHANDLED ERROR: ", e329), t;
                                }).then((t)=>(this.Ec = !1, t)
                                ))
                            );
                            return this._c = e330, e330;
                        }
                        enqueueAfterDelay(t648, e331, n) {
                            this.bc(), this.Ac.indexOf(t648) > -1 && (e331 = 0);
                            const s = xo.createAndSchedule(this, t648, e331, n, (t)=>this.Vc(t)
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
                        Dc(t650) {
                            for (const e of this.yc)if (e.timerId === t650) return !0;
                            return !1;
                        }
                        Cc(t649) {
                            return this.Sc().then(()=>{
                                for (const e332 of (this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs
                                ), this.yc))if (e332.skipDelay(), "all" !== t649 && e332.timerId === t649) break;
                                return this.Sc();
                            });
                        }
                        Nc(t) {
                            this.Ac.push(t);
                        }
                        Vc(t651) {
                            const e = this.yc.indexOf(t651);
                            this.yc.splice(e, 1);
                        }
                    }, this._persistenceKey = "name" in t639 ? t639.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e, e333, s;
                const n = t._freezeSettings(), s66 = (t._databaseId, e333 = (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, s = n, new ua(t._databaseId, e333, t._persistenceKey, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams));
                t._firestoreClient = new Kc(t._credentials, t._queue, s66);
            }
            class Ja {
                constructor(...t661){
                    for(let e = 0; e < t661.length; ++e)if (0 === t661[e].length) throw new j(K.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new ft(t661);
                }
                isEqual(t652) {
                    return this._internalPath.isEqual(t652._internalPath);
                }
            }
            class Xa {
                constructor(t653){
                    this._byteString = t653;
                }
                static fromBase64String(t654) {
                    try {
                        return new Xa(_t.fromBase64String(t654));
                    } catch (t) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
                    }
                }
                static fromUint8Array(t655) {
                    return new Xa(_t.fromUint8Array(t655));
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
                isEqual(t656) {
                    return this._byteString.isEqual(t656._byteString);
                }
            }
            class Za {
                constructor(t657){
                    this._methodName = t657;
                }
            }
            class tu {
                constructor(t658, e335){
                    if (!isFinite(t658) || t658 < -90 || t658 > 90) throw new j(K.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t658);
                    if (!isFinite(e335) || e335 < -180 || e335 > 180) throw new j(K.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e335);
                    this._lat = t658, this._long = e335;
                }
                get latitude() {
                    return this._lat;
                }
                get longitude() {
                    return this._long;
                }
                isEqual(t659) {
                    return this._lat === t659._lat && this._long === t659._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(t660) {
                    return et(this._lat, t660._lat) || et(this._long, t660._long);
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
                constructor(t673, e334, n139, s67, i36, r17){
                    this.settings = t673, this.databaseId = e334, this.N = n139, this.ignoreUndefinedProperties = s67, void 0 === i36 && this.xc(), this.fieldTransforms = i36 || [], this.fieldMask = r17 || [];
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(t662) {
                    return new ru(Object.assign(Object.assign({
                    }, this.settings), t662), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(t663) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t663), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.Mc(t663), s;
                }
                Lc(t664) {
                    var e;
                    const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t664), s = this.$c({
                        path: n,
                        Fc: !1
                    });
                    return s.xc(), s;
                }
                Bc(t665) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(t666) {
                    return bu(t666, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(t667) {
                    return void 0 !== this.fieldMask.find((e)=>t667.isPrefixOf(e)
                    ) || void 0 !== this.fieldTransforms.find((e)=>t667.isPrefixOf(e.field)
                    );
                }
                xc() {
                    if (this.path) for(let t = 0; t < this.path.length; t++)this.Mc(this.path.get(t));
                }
                Mc(t668) {
                    if (0 === t668.length) throw this.Uc("Document fields must not be empty");
                    if (iu(this.kc) && eu.test(t668)) throw this.Uc("Document fields cannot begin and end with \"__\"");
                }
            }
            class uu extends null {
                _toFieldTransform(t669) {
                    if (2 !== t669.kc) throw 1 === t669.kc ? t669.Uc(`${this._methodName}() can only appear at the top level of your update data`) : t669.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return t669.fieldMask.push(t669.path), null;
                }
                isEqual(t670) {
                    return t670 instanceof uu;
                }
            }
            class lu extends null {
                _toFieldTransform(t671) {
                    return new je(t671.path, new Oe);
                }
                isEqual(t672) {
                    return t672 instanceof lu;
                }
            }
            function yu(t674, e336) {
                if (Tu(t674 = getModularInstance(t674))) return Eu("Unsupported field value:", e336, t674), pu(t674, e336);
                if (t674 instanceof Za) return (function(t, e) {
                    if (!iu(e.kc)) throw e.Uc(`${t._methodName}() can only be used with update() and set()`);
                    if (!e.path) throw e.Uc(`${t._methodName}() is not currently supported inside arrays`);
                    const n = t._toFieldTransform(e);
                    n && e.fieldTransforms.push(n);
                })(t674, e336), null;
                if (void 0 === t674 && e336.ignoreUndefinedProperties) return null;
                if (e336.path && e336.fieldMask.push(e336.path), t674 instanceof Array) {
                    if (e336.settings.Fc && 4 !== e336.kc) throw e336.Uc("Nested arrays are not supported");
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
                    })(t674, e336);
                }
                return (function(t, e) {
                    var t675, e337;
                    if (null === (t = getModularInstance(t))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof t) return t675 = e.N, bt(e337 = t) ? De(e337) : Se(t675, e337);
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
                })(t674, e336);
            }
            function pu(t676, e) {
                const n = {
                };
                return at(t676) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : ct(t676, (t, s)=>{
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
                var t677;
                if (!Tu(n) || "object" != typeof (t677 = n) || null === t677 || Object.getPrototypeOf(t677) !== Object.prototype && null !== Object.getPrototypeOf(t677)) {
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
                constructor(t679, e338, n140, s70, i39){
                    this._firestore = t679, this._userDataWriter = e338, this._key = n140, this._document = s70, this._converter = i39;
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
                get(t678) {
                    if (this._document) {
                        const e = this._document.data.field(Su("DocumentSnapshot.get", t678));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            class Vu extends vu {
                data() {
                    return super.data();
                }
            }
            function Su(t680, e339) {
                return "string" == typeof e339 ? (function(t, e, n) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, !1, void 0, n);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, !1, void 0, n);
                    }
                })(t680, e339) : e339 instanceof Ja ? e339._internalPath : e339._delegate._internalPath;
            }
            class Du {
                constructor(t689, e343){
                    this.hasPendingWrites = t689, this.fromCache = e343;
                }
                isEqual(t681) {
                    return this.hasPendingWrites === t681.hasPendingWrites && this.fromCache === t681.fromCache;
                }
            }
            class Cu extends vu {
                constructor(t682, e340, n142, s68, i38, r19){
                    super(t682, e340, n142, s68, r19), this._firestore = t682, this._firestoreImpl = t682, this.metadata = i38;
                }
                exists() {
                    return super.exists();
                }
                data(t683 = {
                }) {
                    if (this._document) {
                        if (this._converter) {
                            const e = new Nu(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(e, t683);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t683.serverTimestamps);
                    }
                }
                get(t684, e341 = {
                }) {
                    if (this._document) {
                        const n = this._document.data.field(Su("DocumentSnapshot.get", t684));
                        if (null !== n) return this._userDataWriter.convertValue(n, e341.serverTimestamps);
                    }
                }
            }
            class Nu extends Cu {
                data(t685 = {
                }) {
                    return super.data(t685);
                }
            }
            class xu {
                constructor(t686, e342, n141, s69){
                    this._firestore = t686, this._userDataWriter = e342, this._snapshot = s69, this.metadata = new Du(s69.hasPendingWrites, s69.fromCache), this.query = n141;
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
                forEach(t687, e345) {
                    this._snapshot.docs.forEach((n)=>{
                        t687.call(e345, new Nu(this._firestore, this._userDataWriter, n.key, n, new Du(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(t688 = {
                }) {
                    const e344 = !!t688.includeMetadataChanges;
                    if (e344 && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e344 || (this._cachedChanges = (function(t690, e346) {
                        if (t690._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t690._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t690._firestore, t690._userDataWriter, n.doc.key, n.doc, new Du(t690._snapshot.mutatedKeys.has(n.doc.key), t690._snapshot.fromCache), t690.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                })
                            );
                        }
                        {
                            let n = t690._snapshot.oldDocs;
                            return t690._snapshot.docChanges.filter((t)=>e346 || 3 !== t.type
                            ).map((e)=>{
                                const s = new Nu(t690._firestore, t690._userDataWriter, e.doc.key, e.doc, new Du(t690._snapshot.mutatedKeys.has(e.doc.key), t690._snapshot.fromCache), t690.query.converter);
                                let i = -1, r = -1;
                                return 0 !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: ku(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    })(this, e344), this._cachedChangesIncludeMetadataChanges = e344), this._cachedChanges;
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
                convertValue(t694, e351 = "none") {
                    switch(vt(t694)){
                        case 0:
                            return null;
                        case 1:
                            return t694.booleanValue;
                        case 2:
                            return yt(t694.integerValue || t694.doubleValue);
                        case 3:
                            return this.convertTimestamp(t694.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(t694, e351);
                        case 5:
                            return t694.stringValue;
                        case 6:
                            return this.convertBytes(pt(t694.bytesValue));
                        case 7:
                            return this.convertReference(t694.referenceValue);
                        case 8:
                            return this.convertGeoPoint(t694.geoPointValue);
                        case 9:
                            return this.convertArray(t694.arrayValue, e351);
                        case 10:
                            return this.convertObject(t694.mapValue, e351);
                        default:
                            throw L();
                    }
                }
                convertObject(t691, e347) {
                    const n = {
                    };
                    return ct(t691.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e347);
                    }), n;
                }
                convertGeoPoint(t692) {
                    return new tu(yt(t692.latitude), yt(t692.longitude));
                }
                convertArray(t693, e348) {
                    return (t693.values || []).map((t)=>this.convertValue(t, e348)
                    );
                }
                convertServerTimestamp(t701, e349) {
                    switch(e349){
                        case "previous":
                            const n = Et(t701);
                            return null == n ? null : this.convertValue(n, e349);
                        case "estimate":
                            return this.convertTimestamp(It(t701));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t695) {
                    const e = gt(t695);
                    return new it(e.seconds, e.nanos);
                }
                convertDocumentKey(t696, e350) {
                    const n = ht.fromString(t696);
                    B(Ts(n));
                    const s = new ha(n.get(1), n.get(3)), i = new Pt(n.popFirst(5));
                    return s.isEqual(e350) || O(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e350.projectId}/${e350.database}) instead.`), i;
                }
            }
            class ah extends nh {
                constructor(t697){
                    super(), this.firestore = t697;
                }
                convertBytes(t698) {
                    return new Xa(t698);
                }
                convertReference(t699) {
                    const e = this.convertDocumentKey(t699, this.firestore._databaseId);
                    return new Ia(this.firestore, null, e);
                }
            }
            function lh(t702) {
                var t700;
                t702 = ga(t702, Aa);
                const e352 = ga(t702.firestore, ka), n143 = ((t700 = e352)._firestoreClient || Ma(t700), t700._firestoreClient.verifyNotTerminated(), t700._firestoreClient), s71 = new ah(e352);
                return (function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                })(t702._query), (function(t703, e353, n144 = {
                }) {
                    const s72 = new Q;
                    return t703.asyncQueue.enqueueAndForget(async ()=>(function(t704, e, n145, s, i) {
                            const r = new Lc({
                                next: (n)=>{
                                    e.enqueueAndForget(()=>Uo(t704, o)
                                    ), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, "Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to \"server\" to retrieve the cached documents.)")) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), o = new Qo(n145, r, {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t704, o);
                        })(await Xc(t703), t703.asyncQueue, e353, n144, s72)
                    ), s72.promise;
                })(n143, t702._query).then((n)=>new xu(e352, s71, t702, n)
                );
            }
            !function(t705, e = !0) {
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
