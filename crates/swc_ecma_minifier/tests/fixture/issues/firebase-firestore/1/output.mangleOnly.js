"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        16
    ],
    {
        19: function(a, b, c) {
            c.d(b, {
                hJ: function() {
                    return g$;
                },
                PL: function() {
                    return iu;
                }
            });
            var d = c(2238);
            var e = c(8463);
            var f = c(3333);
            var g = c(4444);
            var h = c(3510);
            var i = c(4155);
            const j = "@firebase/firestore";
            class k {
                constructor(a){
                    this.uid = a;
                }
                isAuthenticated() {
                    return null != this.uid;
                }
                toKey() {
                    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
                }
                isEqual(a) {
                    return a.uid === this.uid;
                }
            }
            (k.UNAUTHENTICATED = new k(null)), (k.GOOGLE_CREDENTIALS = new k("google-credentials-uid")), (k.FIRST_PARTY = new k("first-party-uid")), (k.MOCK_USER = new k("mock-user"));
            let l = "9.4.0";
            const m = new f.Yd("@firebase/firestore");
            function n() {
                return m.logLevel;
            }
            function o(a) {
                m.setLogLevel(a);
            }
            function p(a, ...b) {
                if (m.logLevel <= f["in"].DEBUG) {
                    const c = b.map(s);
                    m.debug(`Firestore (${l}): ${a}`, ...c);
                }
            }
            function q(a, ...b) {
                if (m.logLevel <= f["in"].ERROR) {
                    const c = b.map(s);
                    m.error(`Firestore (${l}): ${a}`, ...c);
                }
            }
            function r(a, ...b) {
                if (m.logLevel <= f["in"].WARN) {
                    const c = b.map(s);
                    m.warn(`Firestore (${l}): ${a}`, ...c);
                }
            }
            function s(a) {
                if ("string" == typeof a) return a;
                try {
                    return (c = a), JSON.stringify(c);
                } catch (b) {
                    return a;
                }
                var c;
            }
            function t(a = "Unexpected state") {
                const b = `FIRESTORE (${l}) INTERNAL ASSERTION FAILED: ` + a;
                throw (q(b), new Error(b));
            }
            function u(a, b) {
                a || t();
            }
            function v(a, b) {
                a || t();
            }
            function w(a, b) {
                return a;
            }
            const x = {
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
            class y extends Error {
                constructor(a, b){
                    super(b), (this.code = a), (this.message = b), (this.name = "FirebaseError"), (this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`);
                }
            }
            class z {
                constructor(){
                    this.promise = new Promise((a, b)=>{
                        (this.resolve = a), (this.reject = b);
                    });
                }
            }
            class A {
                constructor(a, b){
                    (this.user = b), (this.type = "OAuth"), (this.authHeaders = {}), (this.authHeaders.Authorization = `Bearer ${a}`);
                }
            }
            class B {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(a, b) {
                    a.enqueueRetryable(()=>b(k.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class C {
                constructor(a){
                    (this.token = a), (this.changeListener = null);
                }
                getToken() {
                    return Promise.resolve(this.token);
                }
                invalidateToken() {}
                start(a, b) {
                    (this.changeListener = b), a.enqueueRetryable(()=>b(this.token.user));
                }
                shutdown() {
                    this.changeListener = null;
                }
            }
            class D {
                constructor(a){
                    (this.t = a), (this.currentUser = k.UNAUTHENTICATED), (this.i = 0), (this.forceRefresh = !1), (this.auth = null);
                }
                start(a, b) {
                    let c = this.i;
                    const d = (a)=>this.i !== c ? ((c = this.i), b(a)) : Promise.resolve();
                    let e = new z();
                    this.o = ()=>{
                        this.i++, (this.currentUser = this.u()), e.resolve(), (e = new z()), a.enqueueRetryable(()=>d(this.currentUser));
                    };
                    const f = ()=>{
                        const b = e;
                        a.enqueueRetryable(async ()=>{
                            await b.promise, await d(this.currentUser);
                        });
                    }, g = (a)=>{
                        p("FirebaseCredentialsProvider", "Auth detected"), (this.auth = a), this.auth.addAuthTokenListener(this.o), f();
                    };
                    this.t.onInit((a)=>g(a)), setTimeout(()=>{
                        if (!this.auth) {
                            const a = this.t.getImmediate({
                                optional: !0
                            });
                            a ? g(a) : (p("FirebaseCredentialsProvider", "Auth not yet detected"), e.resolve(), (e = new z()));
                        }
                    }, 0), f();
                }
                getToken() {
                    const a = this.i, b = this.forceRefresh;
                    return ((this.forceRefresh = !1), this.auth ? this.auth.getToken(b).then((b)=>this.i !== a ? (p("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : b ? (u("string" == typeof b.accessToken), new A(b.accessToken, this.currentUser)) : null) : Promise.resolve(null));
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const a = this.auth && this.auth.getUid();
                    return u(null === a || "string" == typeof a), new k(a);
                }
            }
            class E {
                constructor(a, b, c){
                    (this.h = a), (this.l = b), (this.m = c), (this.type = "FirstParty"), (this.user = k.FIRST_PARTY);
                }
                get authHeaders() {
                    const a = {
                        "X-Goog-AuthUser": this.l
                    }, b = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return (b && (a.Authorization = b), this.m && (a["X-Goog-Iam-Authorization-Token"] = this.m), a);
                }
            }
            class F {
                constructor(a, b, c){
                    (this.h = a), (this.l = b), (this.m = c);
                }
                getToken() {
                    return Promise.resolve(new E(this.h, this.l, this.m));
                }
                start(a, b) {
                    a.enqueueRetryable(()=>b(k.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class G {
                constructor(a, b){
                    (this.previousValue = a), b && ((b.sequenceNumberHandler = (a)=>this.g(a)), (this.p = (a)=>b.writeSequenceNumber(a)));
                }
                g(a) {
                    return ((this.previousValue = Math.max(a, this.previousValue)), this.previousValue);
                }
                next() {
                    const a = ++this.previousValue;
                    return this.p && this.p(a), a;
                }
            }
            function H(a) {
                const b = "undefined" != typeof self && (self.crypto || self.msCrypto), c = new Uint8Array(a);
                if (b && "function" == typeof b.getRandomValues) b.getRandomValues(c);
                else for(let d = 0; d < a; d++)c[d] = Math.floor(256 * Math.random());
                return c;
            }
            G.T = -1;
            class I {
                static I() {
                    const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", b = Math.floor(256 / a.length) * a.length;
                    let c = "";
                    for(; c.length < 20;){
                        const d = H(40);
                        for(let e = 0; e < d.length; ++e)c.length < 20 && d[e] < b && (c += a.charAt(d[e] % a.length));
                    }
                    return c;
                }
            }
            function J(a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            }
            function K(a, b, c) {
                return (a.length === b.length && a.every((a, d)=>c(a, b[d])));
            }
            function L(a) {
                return a + "\0";
            }
            class M {
                constructor(a, b){
                    if (((this.seconds = a), (this.nanoseconds = b), b < 0)) throw new y(x.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + b);
                    if (b >= 1e9) throw new y(x.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + b);
                    if (a < -62135596800) throw new y(x.INVALID_ARGUMENT, "Timestamp seconds out of range: " + a);
                    if (a >= 253402300800) throw new y(x.INVALID_ARGUMENT, "Timestamp seconds out of range: " + a);
                }
                static now() {
                    return M.fromMillis(Date.now());
                }
                static fromDate(a) {
                    return M.fromMillis(a.getTime());
                }
                static fromMillis(a) {
                    const b = Math.floor(a / 1e3), c = Math.floor(1e6 * (a - 1e3 * b));
                    return new M(b, c);
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(a) {
                    return this.seconds === a.seconds ? J(this.nanoseconds, a.nanoseconds) : J(this.seconds, a.seconds);
                }
                isEqual(a) {
                    return (a.seconds === this.seconds && a.nanoseconds === this.nanoseconds);
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
                    const a = this.seconds - -62135596800;
                    return (String(a).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0"));
                }
            }
            class N {
                constructor(a){
                    this.timestamp = a;
                }
                static fromTimestamp(a) {
                    return new N(a);
                }
                static min() {
                    return new N(new M(0, 0));
                }
                compareTo(a) {
                    return this.timestamp._compareTo(a.timestamp);
                }
                isEqual(a) {
                    return this.timestamp.isEqual(a.timestamp);
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
            function O(a) {
                let b = 0;
                for(const c in a)Object.prototype.hasOwnProperty.call(a, c) && b++;
                return b;
            }
            function P(a, b) {
                for(const c in a)Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
            }
            function Q(a) {
                for(const b in a)if (Object.prototype.hasOwnProperty.call(a, b)) return !1;
                return !0;
            }
            class R {
                constructor(a, b, c){
                    void 0 === b ? (b = 0) : b > a.length && t(), void 0 === c ? (c = a.length - b) : c > a.length - b && t(), (this.segments = a), (this.offset = b), (this.len = c);
                }
                get length() {
                    return this.len;
                }
                isEqual(a) {
                    return 0 === R.comparator(this, a);
                }
                child(a) {
                    const b = this.segments.slice(this.offset, this.limit());
                    return (a instanceof R ? a.forEach((a)=>{
                        b.push(a);
                    }) : b.push(a), this.construct(b));
                }
                limit() {
                    return this.offset + this.length;
                }
                popFirst(a) {
                    return ((a = void 0 === a ? 1 : a), this.construct(this.segments, this.offset + a, this.length - a));
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
                get(a) {
                    return this.segments[this.offset + a];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(a) {
                    if (a.length < this.length) return !1;
                    for(let b = 0; b < this.length; b++)if (this.get(b) !== a.get(b)) return !1;
                    return !0;
                }
                isImmediateParentOf(a) {
                    if (this.length + 1 !== a.length) return !1;
                    for(let b = 0; b < this.length; b++)if (this.get(b) !== a.get(b)) return !1;
                    return !0;
                }
                forEach(a) {
                    for(let b = this.offset, c = this.limit(); b < c; b++)a(this.segments[b]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(a, b) {
                    const c = Math.min(a.length, b.length);
                    for(let d = 0; d < c; d++){
                        const e = a.get(d), f = b.get(d);
                        if (e < f) return -1;
                        if (e > f) return 1;
                    }
                    return a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
                }
            }
            class S extends R {
                construct(a, b, c) {
                    return new S(a, b, c);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...a) {
                    const b = [];
                    for (const c of a){
                        if (c.indexOf("//") >= 0) throw new y(x.INVALID_ARGUMENT, `Invalid segment (${c}). Paths must not contain // in them.`);
                        b.push(...c.split("/").filter((a)=>a.length > 0));
                    }
                    return new S(b);
                }
                static emptyPath() {
                    return new S([]);
                }
            }
            const T = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class U extends R {
                construct(a, b, c) {
                    return new U(a, b, c);
                }
                static isValidIdentifier(a) {
                    return T.test(a);
                }
                canonicalString() {
                    return this.toArray().map((a)=>((a = a.replace(/\\/g, "\\\\").replace(/`/g, "\\`")), U.isValidIdentifier(a) || (a = "`" + a + "`"), a)).join(".");
                }
                toString() {
                    return this.canonicalString();
                }
                isKeyField() {
                    return 1 === this.length && "__name__" === this.get(0);
                }
                static keyField() {
                    return new U([
                        "__name__"
                    ]);
                }
                static fromServerFormat(a) {
                    const b = [];
                    let c = "", d = 0;
                    const e = ()=>{
                        if (0 === c.length) throw new y(x.INVALID_ARGUMENT, `Invalid field path (${a}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        b.push(c), (c = "");
                    };
                    let f = !1;
                    for(; d < a.length;){
                        const g = a[d];
                        if ("\\" === g) {
                            if (d + 1 === a.length) throw new y(x.INVALID_ARGUMENT, "Path has trailing escape character: " + a);
                            const h = a[d + 1];
                            if ("\\" !== h && "." !== h && "`" !== h) throw new y(x.INVALID_ARGUMENT, "Path has invalid escape sequence: " + a);
                            (c += h), (d += 2);
                        } else "`" === g ? ((f = !f), d++) : "." !== g || f ? ((c += g), d++) : (e(), d++);
                    }
                    if ((e(), f)) throw new y(x.INVALID_ARGUMENT, "Unterminated ` in path: " + a);
                    return new U(b);
                }
                static emptyPath() {
                    return new U([]);
                }
            }
            class V {
                constructor(a){
                    (this.fields = a), a.sort(U.comparator);
                }
                covers(a) {
                    for (const b of this.fields)if (b.isPrefixOf(a)) return !0;
                    return !1;
                }
                isEqual(a) {
                    return K(this.fields, a.fields, (a, b)=>a.isEqual(b));
                }
            }
            function W() {
                return "undefined" != typeof atob;
            }
            class X {
                constructor(a){
                    this.binaryString = a;
                }
                static fromBase64String(a) {
                    const b = atob(a);
                    return new X(b);
                }
                static fromUint8Array(a) {
                    const b = (function(a) {
                        let b = "";
                        for(let c = 0; c < a.length; ++c)b += String.fromCharCode(a[c]);
                        return b;
                    })(a);
                    return new X(b);
                }
                toBase64() {
                    return (a = this.binaryString), btoa(a);
                    var a;
                }
                toUint8Array() {
                    return (function(a) {
                        const b = new Uint8Array(a.length);
                        for(let c = 0; c < a.length; c++)b[c] = a.charCodeAt(c);
                        return b;
                    })(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(a) {
                    return J(this.binaryString, a.binaryString);
                }
                isEqual(a) {
                    return this.binaryString === a.binaryString;
                }
            }
            X.EMPTY_BYTE_STRING = new X("");
            const Y = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function Z(a) {
                if ((u(!!a), "string" == typeof a)) {
                    let b = 0;
                    const c = Y.exec(a);
                    if ((u(!!c), c[1])) {
                        let d = c[1];
                        (d = (d + "000000000").substr(0, 9)), (b = Number(d));
                    }
                    const e = new Date(a);
                    return {
                        seconds: Math.floor(e.getTime() / 1e3),
                        nanos: b
                    };
                }
                return {
                    seconds: $(a.seconds),
                    nanos: $(a.nanos)
                };
            }
            function $(a) {
                return "number" == typeof a ? a : "string" == typeof a ? Number(a) : 0;
            }
            function _(a) {
                return "string" == typeof a ? X.fromBase64String(a) : X.fromUint8Array(a);
            }
            function aa(a) {
                var b, c;
                return ("server_timestamp" === (null === (c = ((null === (b = null == a ? void 0 : a.mapValue) || void 0 === b ? void 0 : b.fields) || {}).__type__) || void 0 === c ? void 0 : c.stringValue));
            }
            function ab(a) {
                const b = a.mapValue.fields.__previous_value__;
                return aa(b) ? ab(b) : b;
            }
            function ac(a) {
                const b = Z(a.mapValue.fields.__local_write_time__.timestampValue);
                return new M(b.seconds, b.nanos);
            }
            function ad(a) {
                return null == a;
            }
            function ae(a) {
                return 0 === a && 1 / a == -1 / 0;
            }
            function af(a) {
                return ("number" == typeof a && Number.isInteger(a) && !ae(a) && a <= Number.MAX_SAFE_INTEGER && a >= Number.MIN_SAFE_INTEGER);
            }
            class ag {
                constructor(a){
                    this.path = a;
                }
                static fromPath(a) {
                    return new ag(S.fromString(a));
                }
                static fromName(a) {
                    return new ag(S.fromString(a).popFirst(5));
                }
                hasCollectionId(a) {
                    return (this.path.length >= 2 && this.path.get(this.path.length - 2) === a);
                }
                isEqual(a) {
                    return (null !== a && 0 === S.comparator(this.path, a.path));
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(a, b) {
                    return S.comparator(a.path, b.path);
                }
                static isDocumentKey(a) {
                    return a.length % 2 == 0;
                }
                static fromSegments(a) {
                    return new ag(new S(a.slice()));
                }
            }
            function ah(a) {
                return "nullValue" in a ? 0 : "booleanValue" in a ? 1 : "integerValue" in a || "doubleValue" in a ? 2 : "timestampValue" in a ? 3 : "stringValue" in a ? 5 : "bytesValue" in a ? 6 : "referenceValue" in a ? 7 : "geoPointValue" in a ? 8 : "arrayValue" in a ? 9 : "mapValue" in a ? aa(a) ? 4 : 10 : t();
            }
            function ai(a, b) {
                const c = ah(a);
                if (c !== ah(b)) return !1;
                switch(c){
                    case 0:
                        return !0;
                    case 1:
                        return a.booleanValue === b.booleanValue;
                    case 4:
                        return ac(a).isEqual(ac(b));
                    case 3:
                        return (function(a, b) {
                            if ("string" == typeof a.timestampValue && "string" == typeof b.timestampValue && a.timestampValue.length === b.timestampValue.length) return (a.timestampValue === b.timestampValue);
                            const c = Z(a.timestampValue), d = Z(b.timestampValue);
                            return (c.seconds === d.seconds && c.nanos === d.nanos);
                        })(a, b);
                    case 5:
                        return a.stringValue === b.stringValue;
                    case 6:
                        return (function(a, b) {
                            return _(a.bytesValue).isEqual(_(b.bytesValue));
                        })(a, b);
                    case 7:
                        return a.referenceValue === b.referenceValue;
                    case 8:
                        return (function(a, b) {
                            return ($(a.geoPointValue.latitude) === $(b.geoPointValue.latitude) && $(a.geoPointValue.longitude) === $(b.geoPointValue.longitude));
                        })(a, b);
                    case 2:
                        return (function(a, b) {
                            if ("integerValue" in a && "integerValue" in b) return ($(a.integerValue) === $(b.integerValue));
                            if ("doubleValue" in a && "doubleValue" in b) {
                                const c = $(a.doubleValue), d = $(b.doubleValue);
                                return c === d ? ae(c) === ae(d) : isNaN(c) && isNaN(d);
                            }
                            return !1;
                        })(a, b);
                    case 9:
                        return K(a.arrayValue.values || [], b.arrayValue.values || [], ai);
                    case 10:
                        return (function(a, b) {
                            const c = a.mapValue.fields || {}, d = b.mapValue.fields || {};
                            if (O(c) !== O(d)) return !1;
                            for(const e in c)if (c.hasOwnProperty(e) && (void 0 === d[e] || !ai(c[e], d[e]))) return !1;
                            return !0;
                        })(a, b);
                    default:
                        return t();
                }
            }
            function aj(a, b) {
                return void 0 !== (a.values || []).find((a)=>ai(a, b));
            }
            function ak(a, b) {
                const c = ah(a), d = ah(b);
                if (c !== d) return J(c, d);
                switch(c){
                    case 0:
                        return 0;
                    case 1:
                        return J(a.booleanValue, b.booleanValue);
                    case 2:
                        return (function(a, b) {
                            const c = $(a.integerValue || a.doubleValue), d = $(b.integerValue || b.doubleValue);
                            return c < d ? -1 : c > d ? 1 : c === d ? 0 : isNaN(c) ? isNaN(d) ? 0 : -1 : 1;
                        })(a, b);
                    case 3:
                        return al(a.timestampValue, b.timestampValue);
                    case 4:
                        return al(ac(a), ac(b));
                    case 5:
                        return J(a.stringValue, b.stringValue);
                    case 6:
                        return (function(a, b) {
                            const c = _(a), d = _(b);
                            return c.compareTo(d);
                        })(a.bytesValue, b.bytesValue);
                    case 7:
                        return (function(a, b) {
                            const c = a.split("/"), d = b.split("/");
                            for(let e = 0; e < c.length && e < d.length; e++){
                                const f = J(c[e], d[e]);
                                if (0 !== f) return f;
                            }
                            return J(c.length, d.length);
                        })(a.referenceValue, b.referenceValue);
                    case 8:
                        return (function(a, b) {
                            const c = J($(a.latitude), $(b.latitude));
                            if (0 !== c) return c;
                            return J($(a.longitude), $(b.longitude));
                        })(a.geoPointValue, b.geoPointValue);
                    case 9:
                        return (function(a, b) {
                            const c = a.values || [], d = b.values || [];
                            for(let e = 0; e < c.length && e < d.length; ++e){
                                const f = ak(c[e], d[e]);
                                if (f) return f;
                            }
                            return J(c.length, d.length);
                        })(a.arrayValue, b.arrayValue);
                    case 10:
                        return (function(a, b) {
                            const c = a.fields || {}, d = Object.keys(c), e = b.fields || {}, f = Object.keys(e);
                            d.sort(), f.sort();
                            for(let g = 0; g < d.length && g < f.length; ++g){
                                const h = J(d[g], f[g]);
                                if (0 !== h) return h;
                                const i = ak(c[d[g]], e[f[g]]);
                                if (0 !== i) return i;
                            }
                            return J(d.length, f.length);
                        })(a.mapValue, b.mapValue);
                    default:
                        throw t();
                }
            }
            function al(a, b) {
                if ("string" == typeof a && "string" == typeof b && a.length === b.length) return J(a, b);
                const c = Z(a), d = Z(b), e = J(c.seconds, d.seconds);
                return 0 !== e ? e : J(c.nanos, d.nanos);
            }
            function am(a) {
                return an(a);
            }
            function an(a) {
                return "nullValue" in a ? "null" : "booleanValue" in a ? "" + a.booleanValue : "integerValue" in a ? "" + a.integerValue : "doubleValue" in a ? "" + a.doubleValue : "timestampValue" in a ? (function(a) {
                    const b = Z(a);
                    return `time(${b.seconds},${b.nanos})`;
                })(a.timestampValue) : "stringValue" in a ? a.stringValue : "bytesValue" in a ? _(a.bytesValue).toBase64() : "referenceValue" in a ? ((c = a.referenceValue), ag.fromName(c).toString()) : "geoPointValue" in a ? `geo(${(b = a.geoPointValue).latitude},${b.longitude})` : "arrayValue" in a ? (function(a) {
                    let b = "[", c = !0;
                    for (const d of a.values || [])c ? (c = !1) : (b += ","), (b += an(d));
                    return b + "]";
                })(a.arrayValue) : "mapValue" in a ? (function(a) {
                    const b = Object.keys(a.fields || {}).sort();
                    let c = "{", d = !0;
                    for (const e of b)d ? (d = !1) : (c += ","), (c += `${e}:${an(a.fields[e])}`);
                    return c + "}";
                })(a.mapValue) : t();
                var b, c;
            }
            function ao(a, b) {
                return {
                    referenceValue: `projects/${a.projectId}/databases/${a.database}/documents/${b.path.canonicalString()}`
                };
            }
            function ap(a) {
                return !!a && "integerValue" in a;
            }
            function aq(a) {
                return !!a && "arrayValue" in a;
            }
            function ar(a) {
                return !!a && "nullValue" in a;
            }
            function as(a) {
                return (!!a && "doubleValue" in a && isNaN(Number(a.doubleValue)));
            }
            function at(a) {
                return !!a && "mapValue" in a;
            }
            function au(a) {
                if (a.geoPointValue) return {
                    geoPointValue: Object.assign({}, a.geoPointValue)
                };
                if (a.timestampValue && "object" == typeof a.timestampValue) return {
                    timestampValue: Object.assign({}, a.timestampValue)
                };
                if (a.mapValue) {
                    const b = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return (P(a.mapValue.fields, (a, c)=>(b.mapValue.fields[a] = au(c))), b);
                }
                if (a.arrayValue) {
                    const c = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let d = 0; d < (a.arrayValue.values || []).length; ++d)c.arrayValue.values[d] = au(a.arrayValue.values[d]);
                    return c;
                }
                return Object.assign({}, a);
            }
            class av {
                constructor(a){
                    this.value = a;
                }
                static empty() {
                    return new av({
                        mapValue: {}
                    });
                }
                field(a) {
                    if (a.isEmpty()) return this.value;
                    {
                        let b = this.value;
                        for(let c = 0; c < a.length - 1; ++c)if (((b = (b.mapValue.fields || {})[a.get(c)]), !at(b))) return null;
                        return ((b = (b.mapValue.fields || {})[a.lastSegment()]), b || null);
                    }
                }
                set(a, b) {
                    this.getFieldsMap(a.popLast())[a.lastSegment()] = au(b);
                }
                setAll(a) {
                    let b = U.emptyPath(), c = {}, d = [];
                    a.forEach((a, e)=>{
                        if (!b.isImmediateParentOf(e)) {
                            const f = this.getFieldsMap(b);
                            this.applyChanges(f, c, d), (c = {}), (d = []), (b = e.popLast());
                        }
                        a ? (c[e.lastSegment()] = au(a)) : d.push(e.lastSegment());
                    });
                    const e = this.getFieldsMap(b);
                    this.applyChanges(e, c, d);
                }
                delete(a) {
                    const b = this.field(a.popLast());
                    at(b) && b.mapValue.fields && delete b.mapValue.fields[a.lastSegment()];
                }
                isEqual(a) {
                    return ai(this.value, a.value);
                }
                getFieldsMap(a) {
                    let b = this.value;
                    b.mapValue.fields || (b.mapValue = {
                        fields: {}
                    });
                    for(let c = 0; c < a.length; ++c){
                        let d = b.mapValue.fields[a.get(c)];
                        (at(d) && d.mapValue.fields) || ((d = {
                            mapValue: {
                                fields: {}
                            }
                        }), (b.mapValue.fields[a.get(c)] = d)), (b = d);
                    }
                    return b.mapValue.fields;
                }
                applyChanges(a, b, c) {
                    P(b, (b, c)=>(a[b] = c));
                    for (const d of c)delete a[d];
                }
                clone() {
                    return new av(au(this.value));
                }
            }
            function aw(a) {
                const b = [];
                return (P(a.fields, (a, c)=>{
                    const d = new U([
                        a
                    ]);
                    if (at(c)) {
                        const e = aw(c.mapValue).fields;
                        if (0 === e.length) b.push(d);
                        else for (const f of e)b.push(d.child(f));
                    } else b.push(d);
                }), new V(b));
            }
            class ax {
                constructor(a, b, c, d, e){
                    (this.key = a), (this.documentType = b), (this.version = c), (this.data = d), (this.documentState = e);
                }
                static newInvalidDocument(a) {
                    return new ax(a, 0, N.min(), av.empty(), 0);
                }
                static newFoundDocument(a, b, c) {
                    return new ax(a, 1, b, c, 0);
                }
                static newNoDocument(a, b) {
                    return new ax(a, 2, b, av.empty(), 0);
                }
                static newUnknownDocument(a, b) {
                    return new ax(a, 3, b, av.empty(), 2);
                }
                convertToFoundDocument(a, b) {
                    return ((this.version = a), (this.documentType = 1), (this.data = b), (this.documentState = 0), this);
                }
                convertToNoDocument(a) {
                    return ((this.version = a), (this.documentType = 2), (this.data = av.empty()), (this.documentState = 0), this);
                }
                convertToUnknownDocument(a) {
                    return ((this.version = a), (this.documentType = 3), (this.data = av.empty()), (this.documentState = 2), this);
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
                isEqual(a) {
                    return (a instanceof ax && this.key.isEqual(a.key) && this.version.isEqual(a.version) && this.documentType === a.documentType && this.documentState === a.documentState && this.data.isEqual(a.data));
                }
                clone() {
                    return new ax(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class ay {
                constructor(a, b = null, c = [], d = [], e = null, f = null, g = null){
                    (this.path = a), (this.collectionGroup = b), (this.orderBy = c), (this.filters = d), (this.limit = e), (this.startAt = f), (this.endAt = g), (this.A = null);
                }
            }
            function az(a, b = null, c = [], d = [], e = null, f = null, g = null) {
                return new ay(a, b, c, d, e, f, g);
            }
            function aA(a) {
                const b = w(a);
                if (null === b.A) {
                    let c = b.path.canonicalString();
                    null !== b.collectionGroup && (c += "|cg:" + b.collectionGroup), (c += "|f:"), (c += b.filters.map((a)=>aF(a)).join(",")), (c += "|ob:"), (c += b.orderBy.map((a)=>(function(a) {
                            return (a.field.canonicalString() + a.dir);
                        })(a)).join(",")), ad(b.limit) || ((c += "|l:"), (c += b.limit)), b.startAt && ((c += "|lb:"), (c += aP(b.startAt))), b.endAt && ((c += "|ub:"), (c += aP(b.endAt))), (b.A = c);
                }
                return b.A;
            }
            function aB(a) {
                let b = a.path.canonicalString();
                return (null !== a.collectionGroup && (b += " collectionGroup=" + a.collectionGroup), a.filters.length > 0 && (b += `, filters: [${a.filters.map((a)=>{
                    return `${(b = a).field.canonicalString()} ${b.op} ${am(b.value)}`;
                    var b;
                }).join(", ")}]`), ad(a.limit) || (b += ", limit: " + a.limit), a.orderBy.length > 0 && (b += `, orderBy: [${a.orderBy.map((a)=>(function(a) {
                        return `${a.field.canonicalString()} (${a.dir})`;
                    })(a)).join(", ")}]`), a.startAt && (b += ", startAt: " + aP(a.startAt)), a.endAt && (b += ", endAt: " + aP(a.endAt)), `Target(${b})`);
            }
            function aC(a, b) {
                if (a.limit !== b.limit) return !1;
                if (a.orderBy.length !== b.orderBy.length) return !1;
                for(let c = 0; c < a.orderBy.length; c++)if (!aR(a.orderBy[c], b.orderBy[c])) return !1;
                if (a.filters.length !== b.filters.length) return !1;
                for(let d = 0; d < a.filters.length; d++)if (((e = a.filters[d]), (f = b.filters[d]), e.op !== f.op || !e.field.isEqual(f.field) || !ai(e.value, f.value))) return !1;
                var e, f;
                return (a.collectionGroup === b.collectionGroup && !!a.path.isEqual(b.path) && !!aT(a.startAt, b.startAt) && aT(a.endAt, b.endAt));
            }
            function aD(a) {
                return (ag.isDocumentKey(a.path) && null === a.collectionGroup && 0 === a.filters.length);
            }
            class aE extends class {
            } {
                constructor(a, b, c){
                    super(), (this.field = a), (this.op = b), (this.value = c);
                }
                static create(a, b, c) {
                    return a.isKeyField() ? "in" === b || "not-in" === b ? this.R(a, b, c) : new aG(a, b, c) : "array-contains" === b ? new aK(a, c) : "in" === b ? new aL(a, c) : "not-in" === b ? new aM(a, c) : "array-contains-any" === b ? new aN(a, c) : new aE(a, b, c);
                }
                static R(a, b, c) {
                    return "in" === b ? new aH(a, c) : new aI(a, c);
                }
                matches(a) {
                    const b = a.data.field(this.field);
                    return "!=" === this.op ? null !== b && this.P(ak(b, this.value)) : null !== b && ah(this.value) === ah(b) && this.P(ak(b, this.value));
                }
                P(a) {
                    switch(this.op){
                        case "<":
                            return a < 0;
                        case "<=":
                            return a <= 0;
                        case "==":
                            return 0 === a;
                        case "!=":
                            return 0 !== a;
                        case ">":
                            return a > 0;
                        case ">=":
                            return a >= 0;
                        default:
                            return t();
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
            function aF(a) {
                return (a.field.canonicalString() + a.op.toString() + am(a.value));
            }
            class aG extends aE {
                constructor(a, b, c){
                    super(a, b, c), (this.key = ag.fromName(c.referenceValue));
                }
                matches(a) {
                    const b = ag.comparator(a.key, this.key);
                    return this.P(b);
                }
            }
            class aH extends aE {
                constructor(a, b){
                    super(a, "in", b), (this.keys = aJ("in", b));
                }
                matches(a) {
                    return this.keys.some((b)=>b.isEqual(a.key));
                }
            }
            class aI extends aE {
                constructor(a, b){
                    super(a, "not-in", b), (this.keys = aJ("not-in", b));
                }
                matches(a) {
                    return !this.keys.some((b)=>b.isEqual(a.key));
                }
            }
            function aJ(a, b) {
                var c;
                return ((null === (c = b.arrayValue) || void 0 === c ? void 0 : c.values) || []).map((a)=>ag.fromName(a.referenceValue));
            }
            class aK extends aE {
                constructor(a, b){
                    super(a, "array-contains", b);
                }
                matches(a) {
                    const b = a.data.field(this.field);
                    return aq(b) && aj(b.arrayValue, this.value);
                }
            }
            class aL extends aE {
                constructor(a, b){
                    super(a, "in", b);
                }
                matches(a) {
                    const b = a.data.field(this.field);
                    return null !== b && aj(this.value.arrayValue, b);
                }
            }
            class aM extends aE {
                constructor(a, b){
                    super(a, "not-in", b);
                }
                matches(a) {
                    if (aj(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const b = a.data.field(this.field);
                    return null !== b && !aj(this.value.arrayValue, b);
                }
            }
            class aN extends aE {
                constructor(a, b){
                    super(a, "array-contains-any", b);
                }
                matches(a) {
                    const b = a.data.field(this.field);
                    return (!(!aq(b) || !b.arrayValue.values) && b.arrayValue.values.some((a)=>aj(this.value.arrayValue, a)));
                }
            }
            class aO {
                constructor(a, b){
                    (this.position = a), (this.before = b);
                }
            }
            function aP(a) {
                return `${a.before ? "b" : "a"}:${a.position.map((a)=>am(a)).join(",")}`;
            }
            class aQ {
                constructor(a, b = "asc"){
                    (this.field = a), (this.dir = b);
                }
            }
            function aR(a, b) {
                return a.dir === b.dir && a.field.isEqual(b.field);
            }
            function aS(a, b, c) {
                let d = 0;
                for(let e = 0; e < a.position.length; e++){
                    const f = b[e], g = a.position[e];
                    if (f.field.isKeyField()) d = ag.comparator(ag.fromName(g.referenceValue), c.key);
                    else {
                        d = ak(g, c.data.field(f.field));
                    }
                    if (("desc" === f.dir && (d *= -1), 0 !== d)) break;
                }
                return a.before ? d <= 0 : d < 0;
            }
            function aT(a, b) {
                if (null === a) return null === b;
                if (null === b) return !1;
                if (a.before !== b.before || a.position.length !== b.position.length) return !1;
                for(let c = 0; c < a.position.length; c++){
                    if (!ai(a.position[c], b.position[c])) return !1;
                }
                return !0;
            }
            class aU {
                constructor(a, b = null, c = [], d = [], e = null, f = "F", g = null, h = null){
                    (this.path = a), (this.collectionGroup = b), (this.explicitOrderBy = c), (this.filters = d), (this.limit = e), (this.limitType = f), (this.startAt = g), (this.endAt = h), (this.V = null), (this.S = null), this.startAt, this.endAt;
                }
            }
            function aV(a, b, c, d, e, f, g, h) {
                return new aU(a, b, c, d, e, f, g, h);
            }
            function aW(a) {
                return new aU(a);
            }
            function aX(a) {
                return !ad(a.limit) && "F" === a.limitType;
            }
            function aY(a) {
                return !ad(a.limit) && "L" === a.limitType;
            }
            function aZ(a) {
                return a.explicitOrderBy.length > 0 ? a.explicitOrderBy[0].field : null;
            }
            function a$(a) {
                for (const b of a.filters)if (b.v()) return b.field;
                return null;
            }
            function a_(a) {
                return null !== a.collectionGroup;
            }
            function a0(a) {
                const b = w(a);
                if (null === b.V) {
                    b.V = [];
                    const c = a$(b), d = aZ(b);
                    if (null !== c && null === d) c.isKeyField() || b.V.push(new aQ(c)), b.V.push(new aQ(U.keyField(), "asc"));
                    else {
                        let e = !1;
                        for (const f of b.explicitOrderBy)b.V.push(f), f.field.isKeyField() && (e = !0);
                        if (!e) {
                            const g = b.explicitOrderBy.length > 0 ? b.explicitOrderBy[b.explicitOrderBy.length - 1].dir : "asc";
                            b.V.push(new aQ(U.keyField(), g));
                        }
                    }
                }
                return b.V;
            }
            function a1(a) {
                const b = w(a);
                if (!b.S) if ("F" === b.limitType) b.S = az(b.path, b.collectionGroup, a0(b), b.filters, b.limit, b.startAt, b.endAt);
                else {
                    const c = [];
                    for (const d of a0(b)){
                        const e = "desc" === d.dir ? "asc" : "desc";
                        c.push(new aQ(d.field, e));
                    }
                    const f = b.endAt ? new aO(b.endAt.position, !b.endAt.before) : null, g = b.startAt ? new aO(b.startAt.position, !b.startAt.before) : null;
                    b.S = az(b.path, b.collectionGroup, c, b.filters, b.limit, f, g);
                }
                return b.S;
            }
            function a2(a, b, c) {
                return new aU(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), b, c, a.startAt, a.endAt);
            }
            function a3(a, b) {
                return aC(a1(a), a1(b)) && a.limitType === b.limitType;
            }
            function a4(a) {
                return `${aA(a1(a))}|lt:${a.limitType}`;
            }
            function a5(a) {
                return `Query(target=${aB(a1(a))}; limitType=${a.limitType})`;
            }
            function a6(a, b) {
                return (b.isFoundDocument() && (function(a, b) {
                    const c = b.key.path;
                    return null !== a.collectionGroup ? b.key.hasCollectionId(a.collectionGroup) && a.path.isPrefixOf(c) : ag.isDocumentKey(a.path) ? a.path.isEqual(c) : a.path.isImmediateParentOf(c);
                })(a, b) && (function(a, b) {
                    for (const c of a.explicitOrderBy)if (!c.field.isKeyField() && null === b.data.field(c.field)) return !1;
                    return !0;
                })(a, b) && (function(a, b) {
                    for (const c of a.filters)if (!c.matches(b)) return !1;
                    return !0;
                })(a, b) && (function(a, b) {
                    if (a.startAt && !aS(a.startAt, a0(a), b)) return !1;
                    if (a.endAt && aS(a.endAt, a0(a), b)) return !1;
                    return !0;
                })(a, b));
            }
            function a7(a) {
                return (b, c)=>{
                    let d = !1;
                    for (const e of a0(a)){
                        const f = a8(e, b, c);
                        if (0 !== f) return f;
                        d = d || e.field.isKeyField();
                    }
                    return 0;
                };
            }
            function a8(a, b, c) {
                const d = a.field.isKeyField() ? ag.comparator(b.key, c.key) : (function(a, b, c) {
                    const d = b.data.field(a), e = c.data.field(a);
                    return null !== d && null !== e ? ak(d, e) : t();
                })(a.field, b, c);
                switch(a.dir){
                    case "asc":
                        return d;
                    case "desc":
                        return -1 * d;
                    default:
                        return t();
                }
            }
            function a9(a, b) {
                if (a.D) {
                    if (isNaN(b)) return {
                        doubleValue: "NaN"
                    };
                    if (b === 1 / 0) return {
                        doubleValue: "Infinity"
                    };
                    if (b === -1 / 0) return {
                        doubleValue: "-Infinity"
                    };
                }
                return {
                    doubleValue: ae(b) ? "-0" : b
                };
            }
            function ba(a) {
                return {
                    integerValue: "" + a
                };
            }
            function bb(a, b) {
                return af(b) ? ba(b) : a9(a, b);
            }
            class bc {
                constructor(){
                    this._ = void 0;
                }
            }
            function bd(a, b, c) {
                return a instanceof bg ? (function(a, b) {
                    const c = {
                        fields: {
                            __type__: {
                                stringValue: "server_timestamp"
                            },
                            __local_write_time__: {
                                timestampValue: {
                                    seconds: a.seconds,
                                    nanos: a.nanoseconds
                                }
                            }
                        }
                    };
                    return (b && (c.fields.__previous_value__ = b), {
                        mapValue: c
                    });
                })(c, b) : a instanceof bh ? bi(a, b) : a instanceof bj ? bk(a, b) : (function(a, b) {
                    const c = bf(a, b), d = bm(c) + bm(a.C);
                    return ap(c) && ap(a.C) ? ba(d) : a9(a.N, d);
                })(a, b);
            }
            function be(a, b, c) {
                return a instanceof bh ? bi(a, b) : a instanceof bj ? bk(a, b) : c;
            }
            function bf(a, b) {
                return a instanceof bl ? ap((c = b)) || (function(a) {
                    return !!a && "doubleValue" in a;
                })(c) ? b : {
                    integerValue: 0
                } : null;
                var c;
            }
            class bg extends bc {
            }
            class bh extends bc {
                constructor(a){
                    super(), (this.elements = a);
                }
            }
            function bi(a, b) {
                const c = bn(b);
                for (const d of a.elements)c.some((a)=>ai(a, d)) || c.push(d);
                return {
                    arrayValue: {
                        values: c
                    }
                };
            }
            class bj extends bc {
                constructor(a){
                    super(), (this.elements = a);
                }
            }
            function bk(a, b) {
                let c = bn(b);
                for (const d of a.elements)c = c.filter((a)=>!ai(a, d));
                return {
                    arrayValue: {
                        values: c
                    }
                };
            }
            class bl extends bc {
                constructor(a, b){
                    super(), (this.N = a), (this.C = b);
                }
            }
            function bm(a) {
                return $(a.integerValue || a.doubleValue);
            }
            function bn(a) {
                return aq(a) && a.arrayValue.values ? a.arrayValue.values.slice() : [];
            }
            class bo {
                constructor(a, b){
                    (this.field = a), (this.transform = b);
                }
            }
            function bp(a, b) {
                return (a.field.isEqual(b.field) && (function(a, b) {
                    return (a instanceof bh && b instanceof bh) || (a instanceof bj && b instanceof bj) ? K(a.elements, b.elements, ai) : a instanceof bl && b instanceof bl ? ai(a.C, b.C) : a instanceof bg && b instanceof bg;
                })(a.transform, b.transform));
            }
            class bq {
                constructor(a, b){
                    (this.version = a), (this.transformResults = b);
                }
            }
            class br {
                constructor(a, b){
                    (this.updateTime = a), (this.exists = b);
                }
                static none() {
                    return new br();
                }
                static exists(a) {
                    return new br(void 0, a);
                }
                static updateTime(a) {
                    return new br(a);
                }
                get isNone() {
                    return (void 0 === this.updateTime && void 0 === this.exists);
                }
                isEqual(a) {
                    return (this.exists === a.exists && (this.updateTime ? !!a.updateTime && this.updateTime.isEqual(a.updateTime) : !a.updateTime));
                }
            }
            function bs(a, b) {
                return void 0 !== a.updateTime ? b.isFoundDocument() && b.version.isEqual(a.updateTime) : void 0 === a.exists || a.exists === b.isFoundDocument();
            }
            class bt {
            }
            function bu(a, b, c) {
                a instanceof bz ? (function(a, b, c) {
                    const d = a.value.clone(), e = bC(a.fieldTransforms, b, c.transformResults);
                    d.setAll(e), b.convertToFoundDocument(c.version, d).setHasCommittedMutations();
                })(a, b, c) : a instanceof bA ? (function(a, b, c) {
                    if (!bs(a.precondition, b)) return void b.convertToUnknownDocument(c.version);
                    const d = bC(a.fieldTransforms, b, c.transformResults), e = b.data;
                    e.setAll(bB(a)), e.setAll(d), b.convertToFoundDocument(c.version, e).setHasCommittedMutations();
                })(a, b, c) : (function(a, b, c) {
                    b.convertToNoDocument(c.version).setHasCommittedMutations();
                })(0, b, c);
            }
            function bv(a, b, c) {
                a instanceof bz ? (function(a, b, c) {
                    if (!bs(a.precondition, b)) return;
                    const d = a.value.clone(), e = bD(a.fieldTransforms, c, b);
                    d.setAll(e), b.convertToFoundDocument(by(b), d).setHasLocalMutations();
                })(a, b, c) : a instanceof bA ? (function(a, b, c) {
                    if (!bs(a.precondition, b)) return;
                    const d = bD(a.fieldTransforms, c, b), e = b.data;
                    e.setAll(bB(a)), e.setAll(d), b.convertToFoundDocument(by(b), e).setHasLocalMutations();
                })(a, b, c) : (function(a, b) {
                    bs(a.precondition, b) && b.convertToNoDocument(N.min());
                })(a, b);
            }
            function bw(a, b) {
                let c = null;
                for (const d of a.fieldTransforms){
                    const e = b.data.field(d.field), f = bf(d.transform, e || null);
                    null != f && (null == c && (c = av.empty()), c.set(d.field, f));
                }
                return c || null;
            }
            function bx(a, b) {
                return (a.type === b.type && !!a.key.isEqual(b.key) && !!a.precondition.isEqual(b.precondition) && !!(function(a, b) {
                    return ((void 0 === a && void 0 === b) || (!(!a || !b) && K(a, b, (a, b)=>bp(a, b))));
                })(a.fieldTransforms, b.fieldTransforms) && (0 === a.type ? a.value.isEqual(b.value) : 1 !== a.type || (a.data.isEqual(b.data) && a.fieldMask.isEqual(b.fieldMask))));
            }
            function by(a) {
                return a.isFoundDocument() ? a.version : N.min();
            }
            class bz extends bt {
                constructor(a, b, c, d = []){
                    super(), (this.key = a), (this.value = b), (this.precondition = c), (this.fieldTransforms = d), (this.type = 0);
                }
            }
            class bA extends bt {
                constructor(a, b, c, d, e = []){
                    super(), (this.key = a), (this.data = b), (this.fieldMask = c), (this.precondition = d), (this.fieldTransforms = e), (this.type = 1);
                }
            }
            function bB(a) {
                const b = new Map();
                return (a.fieldMask.fields.forEach((c)=>{
                    if (!c.isEmpty()) {
                        const d = a.data.field(c);
                        b.set(c, d);
                    }
                }), b);
            }
            function bC(a, b, c) {
                const d = new Map();
                u(a.length === c.length);
                for(let e = 0; e < c.length; e++){
                    const f = a[e], g = f.transform, h = b.data.field(f.field);
                    d.set(f.field, be(g, h, c[e]));
                }
                return d;
            }
            function bD(a, b, c) {
                const d = new Map();
                for (const e of a){
                    const f = e.transform, g = c.data.field(e.field);
                    d.set(e.field, bd(f, g, b));
                }
                return d;
            }
            class bE extends (null && bt) {
                constructor(a, b){
                    super(), (this.key = a), (this.precondition = b), (this.type = 2), (this.fieldTransforms = []);
                }
            }
            class bF extends (null && bt) {
                constructor(a, b){
                    super(), (this.key = a), (this.precondition = b), (this.type = 3), (this.fieldTransforms = []);
                }
            }
            class bG {
                constructor(a){
                    this.count = a;
                }
            }
            var bH, bI;
            function bJ(a) {
                switch(a){
                    default:
                        return t();
                    case x.CANCELLED:
                    case x.UNKNOWN:
                    case x.DEADLINE_EXCEEDED:
                    case x.RESOURCE_EXHAUSTED:
                    case x.INTERNAL:
                    case x.UNAVAILABLE:
                    case x.UNAUTHENTICATED:
                        return !1;
                    case x.INVALID_ARGUMENT:
                    case x.NOT_FOUND:
                    case x.ALREADY_EXISTS:
                    case x.PERMISSION_DENIED:
                    case x.FAILED_PRECONDITION:
                    case x.ABORTED:
                    case x.OUT_OF_RANGE:
                    case x.UNIMPLEMENTED:
                    case x.DATA_LOSS:
                        return !0;
                }
            }
            function bK(a) {
                if (void 0 === a) return q("GRPC error has no .code"), x.UNKNOWN;
                switch(a){
                    case bH.OK:
                        return x.OK;
                    case bH.CANCELLED:
                        return x.CANCELLED;
                    case bH.UNKNOWN:
                        return x.UNKNOWN;
                    case bH.DEADLINE_EXCEEDED:
                        return x.DEADLINE_EXCEEDED;
                    case bH.RESOURCE_EXHAUSTED:
                        return x.RESOURCE_EXHAUSTED;
                    case bH.INTERNAL:
                        return x.INTERNAL;
                    case bH.UNAVAILABLE:
                        return x.UNAVAILABLE;
                    case bH.UNAUTHENTICATED:
                        return x.UNAUTHENTICATED;
                    case bH.INVALID_ARGUMENT:
                        return x.INVALID_ARGUMENT;
                    case bH.NOT_FOUND:
                        return x.NOT_FOUND;
                    case bH.ALREADY_EXISTS:
                        return x.ALREADY_EXISTS;
                    case bH.PERMISSION_DENIED:
                        return x.PERMISSION_DENIED;
                    case bH.FAILED_PRECONDITION:
                        return x.FAILED_PRECONDITION;
                    case bH.ABORTED:
                        return x.ABORTED;
                    case bH.OUT_OF_RANGE:
                        return x.OUT_OF_RANGE;
                    case bH.UNIMPLEMENTED:
                        return x.UNIMPLEMENTED;
                    case bH.DATA_LOSS:
                        return x.DATA_LOSS;
                    default:
                        return t();
                }
            }
            ((bI = bH || (bH = {}))[(bI.OK = 0)] = "OK"), (bI[(bI.CANCELLED = 1)] = "CANCELLED"), (bI[(bI.UNKNOWN = 2)] = "UNKNOWN"), (bI[(bI.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"), (bI[(bI.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"), (bI[(bI.NOT_FOUND = 5)] = "NOT_FOUND"), (bI[(bI.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"), (bI[(bI.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"), (bI[(bI.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"), (bI[(bI.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"), (bI[(bI.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"), (bI[(bI.ABORTED = 10)] = "ABORTED"), (bI[(bI.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"), (bI[(bI.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"), (bI[(bI.INTERNAL = 13)] = "INTERNAL"), (bI[(bI.UNAVAILABLE = 14)] = "UNAVAILABLE"), (bI[(bI.DATA_LOSS = 15)] = "DATA_LOSS");
            class bL {
                constructor(a, b){
                    (this.comparator = a), (this.root = b || bN.EMPTY);
                }
                insert(a, b) {
                    return new bL(this.comparator, this.root.insert(a, b, this.comparator).copy(null, null, bN.BLACK, null, null));
                }
                remove(a) {
                    return new bL(this.comparator, this.root.remove(a, this.comparator).copy(null, null, bN.BLACK, null, null));
                }
                get(a) {
                    let b = this.root;
                    for(; !b.isEmpty();){
                        const c = this.comparator(a, b.key);
                        if (0 === c) return b.value;
                        c < 0 ? (b = b.left) : c > 0 && (b = b.right);
                    }
                    return null;
                }
                indexOf(a) {
                    let b = 0, c = this.root;
                    for(; !c.isEmpty();){
                        const d = this.comparator(a, c.key);
                        if (0 === d) return b + c.left.size;
                        d < 0 ? (c = c.left) : ((b += c.left.size + 1), (c = c.right));
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
                inorderTraversal(a) {
                    return this.root.inorderTraversal(a);
                }
                forEach(a) {
                    this.inorderTraversal((b, c)=>(a(b, c), !1));
                }
                toString() {
                    const a = [];
                    return (this.inorderTraversal((b, c)=>(a.push(`${b}:${c}`), !1)), `{${a.join(", ")}}`);
                }
                reverseTraversal(a) {
                    return this.root.reverseTraversal(a);
                }
                getIterator() {
                    return new bM(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(a) {
                    return new bM(this.root, a, this.comparator, !1);
                }
                getReverseIterator() {
                    return new bM(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(a) {
                    return new bM(this.root, a, this.comparator, !0);
                }
            }
            class bM {
                constructor(a, b, c, d){
                    (this.isReverse = d), (this.nodeStack = []);
                    let e = 1;
                    for(; !a.isEmpty();)if (((e = b ? c(a.key, b) : 1), d && (e *= -1), e < 0)) a = this.isReverse ? a.left : a.right;
                    else {
                        if (0 === e) {
                            this.nodeStack.push(a);
                            break;
                        }
                        this.nodeStack.push(a), (a = this.isReverse ? a.right : a.left);
                    }
                }
                getNext() {
                    let a = this.nodeStack.pop();
                    const b = {
                        key: a.key,
                        value: a.value
                    };
                    if (this.isReverse) for(a = a.left; !a.isEmpty();)this.nodeStack.push(a), (a = a.right);
                    else for(a = a.right; !a.isEmpty();)this.nodeStack.push(a), (a = a.left);
                    return b;
                }
                hasNext() {
                    return this.nodeStack.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack.length) return null;
                    const a = this.nodeStack[this.nodeStack.length - 1];
                    return {
                        key: a.key,
                        value: a.value
                    };
                }
            }
            class bN {
                constructor(a, b, c, d, e){
                    (this.key = a), (this.value = b), (this.color = null != c ? c : bN.RED), (this.left = null != d ? d : bN.EMPTY), (this.right = null != e ? e : bN.EMPTY), (this.size = this.left.size + 1 + this.right.size);
                }
                copy(a, b, c, d, e) {
                    return new bN(null != a ? a : this.key, null != b ? b : this.value, null != c ? c : this.color, null != d ? d : this.left, null != e ? e : this.right);
                }
                isEmpty() {
                    return !1;
                }
                inorderTraversal(a) {
                    return (this.left.inorderTraversal(a) || a(this.key, this.value) || this.right.inorderTraversal(a));
                }
                reverseTraversal(a) {
                    return (this.right.reverseTraversal(a) || a(this.key, this.value) || this.left.reverseTraversal(a));
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
                insert(a, b, c) {
                    let d = this;
                    const e = c(a, d.key);
                    return ((d = e < 0 ? d.copy(null, null, null, d.left.insert(a, b, c), null) : 0 === e ? d.copy(null, b, null, null, null) : d.copy(null, null, null, null, d.right.insert(a, b, c))), d.fixUp());
                }
                removeMin() {
                    if (this.left.isEmpty()) return bN.EMPTY;
                    let a = this;
                    return (a.left.isRed() || a.left.left.isRed() || (a = a.moveRedLeft()), (a = a.copy(null, null, null, a.left.removeMin(), null)), a.fixUp());
                }
                remove(a, b) {
                    let c, d = this;
                    if (b(a, d.key) < 0) d.left.isEmpty() || d.left.isRed() || d.left.left.isRed() || (d = d.moveRedLeft()), (d = d.copy(null, null, null, d.left.remove(a, b), null));
                    else {
                        if ((d.left.isRed() && (d = d.rotateRight()), d.right.isEmpty() || d.right.isRed() || d.right.left.isRed() || (d = d.moveRedRight()), 0 === b(a, d.key))) {
                            if (d.right.isEmpty()) return bN.EMPTY;
                            (c = d.right.min()), (d = d.copy(c.key, c.value, null, null, d.right.removeMin()));
                        }
                        d = d.copy(null, null, null, null, d.right.remove(a, b));
                    }
                    return d.fixUp();
                }
                isRed() {
                    return this.color;
                }
                fixUp() {
                    let a = this;
                    return (a.right.isRed() && !a.left.isRed() && (a = a.rotateLeft()), a.left.isRed() && a.left.left.isRed() && (a = a.rotateRight()), a.left.isRed() && a.right.isRed() && (a = a.colorFlip()), a);
                }
                moveRedLeft() {
                    let a = this.colorFlip();
                    return (a.right.left.isRed() && ((a = a.copy(null, null, null, null, a.right.rotateRight())), (a = a.rotateLeft()), (a = a.colorFlip())), a);
                }
                moveRedRight() {
                    let a = this.colorFlip();
                    return (a.left.left.isRed() && ((a = a.rotateRight()), (a = a.colorFlip())), a);
                }
                rotateLeft() {
                    const a = this.copy(null, null, bN.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, a, null);
                }
                rotateRight() {
                    const a = this.copy(null, null, bN.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, a);
                }
                colorFlip() {
                    const a = this.left.copy(null, null, !this.left.color, null, null), b = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, a, b);
                }
                checkMaxDepth() {
                    const a = this.check();
                    return Math.pow(2, a) <= this.size + 1;
                }
                check() {
                    if (this.isRed() && this.left.isRed()) throw t();
                    if (this.right.isRed()) throw t();
                    const a = this.left.check();
                    if (a !== this.right.check()) throw t();
                    return a + (this.isRed() ? 0 : 1);
                }
            }
            (bN.EMPTY = null), (bN.RED = !0), (bN.BLACK = !1);
            bN.EMPTY = new (class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw t();
                }
                get value() {
                    throw t();
                }
                get color() {
                    throw t();
                }
                get left() {
                    throw t();
                }
                get right() {
                    throw t();
                }
                copy(a, b, c, d, e) {
                    return this;
                }
                insert(a, b, c) {
                    return new bN(a, b);
                }
                remove(a, b) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(a) {
                    return !1;
                }
                reverseTraversal(a) {
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
            class bO {
                constructor(a){
                    (this.comparator = a), (this.data = new bL(this.comparator));
                }
                has(a) {
                    return null !== this.data.get(a);
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
                indexOf(a) {
                    return this.data.indexOf(a);
                }
                forEach(a) {
                    this.data.inorderTraversal((b, c)=>(a(b), !1));
                }
                forEachInRange(a, b) {
                    const c = this.data.getIteratorFrom(a[0]);
                    for(; c.hasNext();){
                        const d = c.getNext();
                        if (this.comparator(d.key, a[1]) >= 0) return;
                        b(d.key);
                    }
                }
                forEachWhile(a, b) {
                    let c;
                    for(c = void 0 !== b ? this.data.getIteratorFrom(b) : this.data.getIterator(); c.hasNext();){
                        if (!a(c.getNext().key)) return;
                    }
                }
                firstAfterOrEqual(a) {
                    const b = this.data.getIteratorFrom(a);
                    return b.hasNext() ? b.getNext().key : null;
                }
                getIterator() {
                    return new bP(this.data.getIterator());
                }
                getIteratorFrom(a) {
                    return new bP(this.data.getIteratorFrom(a));
                }
                add(a) {
                    return this.copy(this.data.remove(a).insert(a, !0));
                }
                delete(a) {
                    return this.has(a) ? this.copy(this.data.remove(a)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(a) {
                    let b = this;
                    return (b.size < a.size && ((b = a), (a = this)), a.forEach((a)=>{
                        b = b.add(a);
                    }), b);
                }
                isEqual(a) {
                    if (!(a instanceof bO)) return !1;
                    if (this.size !== a.size) return !1;
                    const b = this.data.getIterator(), c = a.data.getIterator();
                    for(; b.hasNext();){
                        const d = b.getNext().key, e = c.getNext().key;
                        if (0 !== this.comparator(d, e)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const a = [];
                    return (this.forEach((b)=>{
                        a.push(b);
                    }), a);
                }
                toString() {
                    const a = [];
                    return (this.forEach((b)=>a.push(b)), "SortedSet(" + a.toString() + ")");
                }
                copy(a) {
                    const b = new bO(this.comparator);
                    return (b.data = a), b;
                }
            }
            class bP {
                constructor(a){
                    this.iter = a;
                }
                getNext() {
                    return this.iter.getNext().key;
                }
                hasNext() {
                    return this.iter.hasNext();
                }
            }
            const bQ = new bL(ag.comparator);
            function bR() {
                return bQ;
            }
            const bS = new bL(ag.comparator);
            function bT() {
                return bS;
            }
            const bU = new bL(ag.comparator);
            function bV() {
                return bU;
            }
            const bW = new bO(ag.comparator);
            function bX(...a) {
                let b = bW;
                for (const c of a)b = b.add(c);
                return b;
            }
            const bY = new bO(J);
            function bZ() {
                return bY;
            }
            class b$ {
                constructor(a, b, c, d, e){
                    (this.snapshotVersion = a), (this.targetChanges = b), (this.targetMismatches = c), (this.documentUpdates = d), (this.resolvedLimboDocuments = e);
                }
                static createSynthesizedRemoteEventForCurrentChange(a, b) {
                    const c = new Map();
                    return (c.set(a, b_.createSynthesizedTargetChangeForCurrentChange(a, b)), new b$(N.min(), c, bZ(), bR(), bX()));
                }
            }
            class b_ {
                constructor(a, b, c, d, e){
                    (this.resumeToken = a), (this.current = b), (this.addedDocuments = c), (this.modifiedDocuments = d), (this.removedDocuments = e);
                }
                static createSynthesizedTargetChangeForCurrentChange(a, b) {
                    return new b_(X.EMPTY_BYTE_STRING, b, bX(), bX(), bX());
                }
            }
            class b0 {
                constructor(a, b, c, d){
                    (this.k = a), (this.removedTargetIds = b), (this.key = c), (this.$ = d);
                }
            }
            class b1 {
                constructor(a, b){
                    (this.targetId = a), (this.O = b);
                }
            }
            class b2 {
                constructor(a, b, c = X.EMPTY_BYTE_STRING, d = null){
                    (this.state = a), (this.targetIds = b), (this.resumeToken = c), (this.cause = d);
                }
            }
            class b3 {
                constructor(){
                    (this.F = 0), (this.M = b6()), (this.L = X.EMPTY_BYTE_STRING), (this.B = !1), (this.U = !0);
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
                j(a) {
                    a.approximateByteSize() > 0 && ((this.U = !0), (this.L = a));
                }
                W() {
                    let a = bX(), b = bX(), c = bX();
                    return (this.M.forEach((d, e)=>{
                        switch(e){
                            case 0:
                                a = a.add(d);
                                break;
                            case 2:
                                b = b.add(d);
                                break;
                            case 1:
                                c = c.add(d);
                                break;
                            default:
                                t();
                        }
                    }), new b_(this.L, this.B, a, b, c));
                }
                G() {
                    (this.U = !1), (this.M = b6());
                }
                H(a, b) {
                    (this.U = !0), (this.M = this.M.insert(a, b));
                }
                J(a) {
                    (this.U = !0), (this.M = this.M.remove(a));
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
            class b4 {
                constructor(a){
                    (this.tt = a), (this.et = new Map()), (this.nt = bR()), (this.st = b5()), (this.it = new bO(J));
                }
                rt(a) {
                    for (const b of a.k)a.$ && a.$.isFoundDocument() ? this.ot(b, a.$) : this.ct(b, a.key, a.$);
                    for (const c of a.removedTargetIds)this.ct(c, a.key, a.$);
                }
                at(a) {
                    this.forEachTarget(a, (b)=>{
                        const c = this.ut(b);
                        switch(a.state){
                            case 0:
                                this.ht(b) && c.j(a.resumeToken);
                                break;
                            case 1:
                                c.X(), c.q || c.G(), c.j(a.resumeToken);
                                break;
                            case 2:
                                c.X(), c.q || this.removeTarget(b);
                                break;
                            case 3:
                                this.ht(b) && (c.Z(), c.j(a.resumeToken));
                                break;
                            case 4:
                                this.ht(b) && (this.lt(b), c.j(a.resumeToken));
                                break;
                            default:
                                t();
                        }
                    });
                }
                forEachTarget(a, b) {
                    a.targetIds.length > 0 ? a.targetIds.forEach(b) : this.et.forEach((a, c)=>{
                        this.ht(c) && b(c);
                    });
                }
                ft(a) {
                    const b = a.targetId, c = a.O.count, d = this.dt(b);
                    if (d) {
                        const e = d.target;
                        if (aD(e)) if (0 === c) {
                            const f = new ag(e.path);
                            this.ct(b, f, ax.newNoDocument(f, N.min()));
                        } else u(1 === c);
                        else {
                            this.wt(b) !== c && (this.lt(b), (this.it = this.it.add(b)));
                        }
                    }
                }
                _t(a) {
                    const b = new Map();
                    this.et.forEach((c, d)=>{
                        const e = this.dt(d);
                        if (e) {
                            if (c.current && aD(e.target)) {
                                const f = new ag(e.target.path);
                                null !== this.nt.get(f) || this.gt(d, f) || this.ct(d, f, ax.newNoDocument(f, a));
                            }
                            c.K && (b.set(d, c.W()), c.G());
                        }
                    });
                    let c = bX();
                    this.st.forEach((a, b)=>{
                        let d = !0;
                        b.forEachWhile((a)=>{
                            const b = this.dt(a);
                            return (!b || 2 === b.purpose || ((d = !1), !1));
                        }), d && (c = c.add(a));
                    });
                    const d = new b$(a, b, this.it, this.nt, c);
                    return ((this.nt = bR()), (this.st = b5()), (this.it = new bO(J)), d);
                }
                ot(a, b) {
                    if (!this.ht(a)) return;
                    const c = this.gt(a, b.key) ? 2 : 0;
                    this.ut(a).H(b.key, c), (this.nt = this.nt.insert(b.key, b)), (this.st = this.st.insert(b.key, this.yt(b.key).add(a)));
                }
                ct(a, b, c) {
                    if (!this.ht(a)) return;
                    const d = this.ut(a);
                    this.gt(a, b) ? d.H(b, 1) : d.J(b), (this.st = this.st.insert(b, this.yt(b).delete(a))), c && (this.nt = this.nt.insert(b, c));
                }
                removeTarget(a) {
                    this.et.delete(a);
                }
                wt(a) {
                    const b = this.ut(a).W();
                    return (this.tt.getRemoteKeysForTarget(a).size + b.addedDocuments.size - b.removedDocuments.size);
                }
                Y(a) {
                    this.ut(a).Y();
                }
                ut(a) {
                    let b = this.et.get(a);
                    return b || ((b = new b3()), this.et.set(a, b)), b;
                }
                yt(a) {
                    let b = this.st.get(a);
                    return (b || ((b = new bO(J)), (this.st = this.st.insert(a, b))), b);
                }
                ht(a) {
                    const b = null !== this.dt(a);
                    return (b || p("WatchChangeAggregator", "Detected inactive target", a), b);
                }
                dt(a) {
                    const b = this.et.get(a);
                    return b && b.q ? null : this.tt.Tt(a);
                }
                lt(a) {
                    this.et.set(a, new b3());
                    this.tt.getRemoteKeysForTarget(a).forEach((b)=>{
                        this.ct(a, b, null);
                    });
                }
                gt(a, b) {
                    return this.tt.getRemoteKeysForTarget(a).has(b);
                }
            }
            function b5() {
                return new bL(ag.comparator);
            }
            function b6() {
                return new bL(ag.comparator);
            }
            const b7 = (()=>{
                const a = {
                    asc: "ASCENDING",
                    desc: "DESCENDING"
                };
                return a;
            })(), b8 = (()=>{
                const a = {
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
                return a;
            })();
            class b9 {
                constructor(a, b){
                    (this.databaseId = a), (this.D = b);
                }
            }
            function ca(a, b) {
                if (a.D) {
                    return `${new Date(1e3 * b.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + b.nanoseconds).slice(-9)}Z`;
                }
                return {
                    seconds: "" + b.seconds,
                    nanos: b.nanoseconds
                };
            }
            function cb(a, b) {
                return a.D ? b.toBase64() : b.toUint8Array();
            }
            function cc(a, b) {
                return ca(a, b.toTimestamp());
            }
            function cd(a) {
                return (u(!!a), N.fromTimestamp((function(a) {
                    const b = Z(a);
                    return new M(b.seconds, b.nanos);
                })(a)));
            }
            function ce(a, b) {
                return (function(a) {
                    return new S([
                        "projects",
                        a.projectId,
                        "databases",
                        a.database, 
                    ]);
                })(a).child("documents").child(b).canonicalString();
            }
            function cf(a) {
                const b = S.fromString(a);
                return u(cH(b)), b;
            }
            function cg(a, b) {
                return ce(a.databaseId, b.path);
            }
            function ch(a, b) {
                const c = cf(b);
                if (c.get(1) !== a.databaseId.projectId) throw new y(x.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + c.get(1) + " vs " + a.databaseId.projectId);
                if (c.get(3) !== a.databaseId.database) throw new y(x.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + c.get(3) + " vs " + a.databaseId.database);
                return new ag(cl(c));
            }
            function ci(a, b) {
                return ce(a.databaseId, b);
            }
            function cj(a) {
                const b = cf(a);
                return 4 === b.length ? S.emptyPath() : cl(b);
            }
            function ck(a) {
                return new S([
                    "projects",
                    a.databaseId.projectId,
                    "databases",
                    a.databaseId.database, 
                ]).canonicalString();
            }
            function cl(a) {
                return (u(a.length > 4 && "documents" === a.get(4)), a.popFirst(5));
            }
            function cm(a, b, c) {
                return {
                    name: cg(a, b),
                    fields: c.value.mapValue.fields
                };
            }
            function cn(a, b, c) {
                const d = ch(a, b.name), e = cd(b.updateTime), f = new av({
                    mapValue: {
                        fields: b.fields
                    }
                }), g = ax.newFoundDocument(d, e, f);
                return (c && g.setHasCommittedMutations(), c ? g.setHasCommittedMutations() : g);
            }
            function co(a, b) {
                return "found" in b ? (function(a, b) {
                    u(!!b.found), b.found.name, b.found.updateTime;
                    const c = ch(a, b.found.name), d = cd(b.found.updateTime), e = new av({
                        mapValue: {
                            fields: b.found.fields
                        }
                    });
                    return ax.newFoundDocument(c, d, e);
                })(a, b) : "missing" in b ? (function(a, b) {
                    u(!!b.missing), u(!!b.readTime);
                    const c = ch(a, b.missing), d = cd(b.readTime);
                    return ax.newNoDocument(c, d);
                })(a, b) : t();
            }
            function cp(a, b) {
                let c;
                if ("targetChange" in b) {
                    b.targetChange;
                    const d = (function(a) {
                        return "NO_CHANGE" === a ? 0 : "ADD" === a ? 1 : "REMOVE" === a ? 2 : "CURRENT" === a ? 3 : "RESET" === a ? 4 : t();
                    })(b.targetChange.targetChangeType || "NO_CHANGE"), e = b.targetChange.targetIds || [], f = (function(a, b) {
                        return a.D ? (u(void 0 === b || "string" == typeof b), X.fromBase64String(b || "")) : (u(void 0 === b || b instanceof Uint8Array), X.fromUint8Array(b || new Uint8Array()));
                    })(a, b.targetChange.resumeToken), g = b.targetChange.cause, h = g && (function(a) {
                        const b = void 0 === a.code ? x.UNKNOWN : bK(a.code);
                        return new y(b, a.message || "");
                    })(g);
                    c = new b2(d, e, f, h || null);
                } else if ("documentChange" in b) {
                    b.documentChange;
                    const i = b.documentChange;
                    i.document, i.document.name, i.document.updateTime;
                    const j = ch(a, i.document.name), k = cd(i.document.updateTime), l = new av({
                        mapValue: {
                            fields: i.document.fields
                        }
                    }), m = ax.newFoundDocument(j, k, l), n = i.targetIds || [], o = i.removedTargetIds || [];
                    c = new b0(n, o, m.key, m);
                } else if ("documentDelete" in b) {
                    b.documentDelete;
                    const p = b.documentDelete;
                    p.document;
                    const q = ch(a, p.document), r = p.readTime ? cd(p.readTime) : N.min(), s = ax.newNoDocument(q, r), v = p.removedTargetIds || [];
                    c = new b0([], v, s.key, s);
                } else if ("documentRemove" in b) {
                    b.documentRemove;
                    const w = b.documentRemove;
                    w.document;
                    const z = ch(a, w.document), A = w.removedTargetIds || [];
                    c = new b0([], A, z, null);
                } else {
                    if (!("filter" in b)) return t();
                    {
                        b.filter;
                        const B = b.filter;
                        B.targetId;
                        const C = B.count || 0, D = new bG(C), E = B.targetId;
                        c = new b1(E, D);
                    }
                }
                return c;
            }
            function cq(a, b) {
                let c;
                if (b instanceof bz) c = {
                    update: cm(a, b.key, b.value)
                };
                else if (b instanceof bE) c = {
                    delete: cg(a, b.key)
                };
                else if (b instanceof bA) c = {
                    update: cm(a, b.key, b.data),
                    updateMask: cG(b.fieldMask)
                };
                else {
                    if (!(b instanceof bF)) return t();
                    c = {
                        verify: cg(a, b.key)
                    };
                }
                return (b.fieldTransforms.length > 0 && (c.updateTransforms = b.fieldTransforms.map((a)=>(function(a, b) {
                        const c = b.transform;
                        if (c instanceof bg) return {
                            fieldPath: b.field.canonicalString(),
                            setToServerValue: "REQUEST_TIME"
                        };
                        if (c instanceof bh) return {
                            fieldPath: b.field.canonicalString(),
                            appendMissingElements: {
                                values: c.elements
                            }
                        };
                        if (c instanceof bj) return {
                            fieldPath: b.field.canonicalString(),
                            removeAllFromArray: {
                                values: c.elements
                            }
                        };
                        if (c instanceof bl) return {
                            fieldPath: b.field.canonicalString(),
                            increment: c.C
                        };
                        throw t();
                    })(0, a))), b.precondition.isNone || (c.currentDocument = (function(a, b) {
                    return void 0 !== b.updateTime ? {
                        updateTime: cc(a, b.updateTime)
                    } : void 0 !== b.exists ? {
                        exists: b.exists
                    } : t();
                })(a, b.precondition)), c);
            }
            function cr(a, b) {
                const c = b.currentDocument ? (function(a) {
                    return void 0 !== a.updateTime ? br.updateTime(cd(a.updateTime)) : void 0 !== a.exists ? br.exists(a.exists) : br.none();
                })(b.currentDocument) : br.none(), d = b.updateTransforms ? b.updateTransforms.map((b)=>(function(a, b) {
                        let c = null;
                        if ("setToServerValue" in b) u("REQUEST_TIME" === b.setToServerValue), (c = new bg());
                        else if ("appendMissingElements" in b) {
                            const d = b.appendMissingElements.values || [];
                            c = new bh(d);
                        } else if ("removeAllFromArray" in b) {
                            const e = b.removeAllFromArray.values || [];
                            c = new bj(e);
                        } else "increment" in b ? (c = new bl(a, b.increment)) : t();
                        const f = U.fromServerFormat(b.fieldPath);
                        return new bo(f, c);
                    })(a, b)) : [];
                if (b.update) {
                    b.update.name;
                    const e = ch(a, b.update.name), f = new av({
                        mapValue: {
                            fields: b.update.fields
                        }
                    });
                    if (b.updateMask) {
                        const g = (function(a) {
                            const b = a.fieldPaths || [];
                            return new V(b.map((a)=>U.fromServerFormat(a)));
                        })(b.updateMask);
                        return new bA(e, f, g, c, d);
                    }
                    return new bz(e, f, c, d);
                }
                if (b.delete) {
                    const h = ch(a, b.delete);
                    return new bE(h, c);
                }
                if (b.verify) {
                    const i = ch(a, b.verify);
                    return new bF(i, c);
                }
                return t();
            }
            function cs(a, b) {
                return a && a.length > 0 ? (u(void 0 !== b), a.map((a)=>(function(a, b) {
                        let c = a.updateTime ? cd(a.updateTime) : cd(b);
                        return (c.isEqual(N.min()) && (c = cd(b)), new bq(c, a.transformResults || []));
                    })(a, b))) : [];
            }
            function ct(a, b) {
                return {
                    documents: [
                        ci(a, b.path)
                    ]
                };
            }
            function cu(a, b) {
                const c = {
                    structuredQuery: {}
                }, d = b.path;
                null !== b.collectionGroup ? ((c.parent = ci(a, d)), (c.structuredQuery.from = [
                    {
                        collectionId: b.collectionGroup,
                        allDescendants: !0
                    }, 
                ])) : ((c.parent = ci(a, d.popLast())), (c.structuredQuery.from = [
                    {
                        collectionId: d.lastSegment()
                    }, 
                ]));
                const e = (function(a) {
                    if (0 === a.length) return;
                    const b = a.map((a)=>(function(a) {
                            if ("==" === a.op) {
                                if (as(a.value)) return {
                                    unaryFilter: {
                                        field: cC(a.field),
                                        op: "IS_NAN"
                                    }
                                };
                                if (ar(a.value)) return {
                                    unaryFilter: {
                                        field: cC(a.field),
                                        op: "IS_NULL"
                                    }
                                };
                            } else if ("!=" === a.op) {
                                if (as(a.value)) return {
                                    unaryFilter: {
                                        field: cC(a.field),
                                        op: "IS_NOT_NAN"
                                    }
                                };
                                if (ar(a.value)) return {
                                    unaryFilter: {
                                        field: cC(a.field),
                                        op: "IS_NOT_NULL"
                                    }
                                };
                            }
                            return {
                                fieldFilter: {
                                    field: cC(a.field),
                                    op: cB(a.op),
                                    value: a.value
                                }
                            };
                        })(a));
                    if (1 === b.length) return b[0];
                    return {
                        compositeFilter: {
                            op: "AND",
                            filters: b
                        }
                    };
                })(b.filters);
                e && (c.structuredQuery.where = e);
                const f = (function(a) {
                    if (0 === a.length) return;
                    return a.map((a)=>(function(a) {
                            return {
                                field: cC(a.field),
                                direction: cA(a.dir)
                            };
                        })(a));
                })(b.orderBy);
                f && (c.structuredQuery.orderBy = f);
                const g = (function(a, b) {
                    return a.D || ad(b) ? b : {
                        value: b
                    };
                })(a, b.limit);
                return (null !== g && (c.structuredQuery.limit = g), b.startAt && (c.structuredQuery.startAt = cy(b.startAt)), b.endAt && (c.structuredQuery.endAt = cy(b.endAt)), c);
            }
            function cv(a) {
                let b = cj(a.parent);
                const c = a.structuredQuery, d = c.from ? c.from.length : 0;
                let e = null;
                if (d > 0) {
                    u(1 === d);
                    const f = c.from[0];
                    f.allDescendants ? (e = f.collectionId) : (b = b.child(f.collectionId));
                }
                let g = [];
                c.where && (g = cx(c.where));
                let h = [];
                c.orderBy && (h = c.orderBy.map((a)=>(function(a) {
                        return new aQ(cD(a.field), (function(a) {
                            switch(a){
                                case "ASCENDING":
                                    return "asc";
                                case "DESCENDING":
                                    return "desc";
                                default:
                                    return;
                            }
                        })(a.direction));
                    })(a)));
                let i = null;
                c.limit && (i = (function(a) {
                    let b;
                    return ((b = "object" == typeof a ? a.value : a), ad(b) ? null : b);
                })(c.limit));
                let j = null;
                c.startAt && (j = cz(c.startAt));
                let k = null;
                return (c.endAt && (k = cz(c.endAt)), aV(b, e, h, g, i, "F", j, k));
            }
            function cw(a, b) {
                const c = (function(a, b) {
                    switch(b){
                        case 0:
                            return null;
                        case 1:
                            return "existence-filter-mismatch";
                        case 2:
                            return "limbo-document";
                        default:
                            return t();
                    }
                })(0, b.purpose);
                return null == c ? null : {
                    "goog-listen-tags": c
                };
            }
            function cx(a) {
                return a ? void 0 !== a.unaryFilter ? [
                    cF(a)
                ] : void 0 !== a.fieldFilter ? [
                    cE(a)
                ] : void 0 !== a.compositeFilter ? a.compositeFilter.filters.map((a)=>cx(a)).reduce((a, b)=>a.concat(b)) : t() : [];
            }
            function cy(a) {
                return {
                    before: a.before,
                    values: a.position
                };
            }
            function cz(a) {
                const b = !!a.before, c = a.values || [];
                return new aO(c, b);
            }
            function cA(a) {
                return b7[a];
            }
            function cB(a) {
                return b8[a];
            }
            function cC(a) {
                return {
                    fieldPath: a.canonicalString()
                };
            }
            function cD(a) {
                return U.fromServerFormat(a.fieldPath);
            }
            function cE(a) {
                return aE.create(cD(a.fieldFilter.field), (function(a) {
                    switch(a){
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
                            return t();
                    }
                })(a.fieldFilter.op), a.fieldFilter.value);
            }
            function cF(a) {
                switch(a.unaryFilter.op){
                    case "IS_NAN":
                        const b = cD(a.unaryFilter.field);
                        return aE.create(b, "==", {
                            doubleValue: NaN
                        });
                    case "IS_NULL":
                        const c = cD(a.unaryFilter.field);
                        return aE.create(c, "==", {
                            nullValue: "NULL_VALUE"
                        });
                    case "IS_NOT_NAN":
                        const d = cD(a.unaryFilter.field);
                        return aE.create(d, "!=", {
                            doubleValue: NaN
                        });
                    case "IS_NOT_NULL":
                        const e = cD(a.unaryFilter.field);
                        return aE.create(e, "!=", {
                            nullValue: "NULL_VALUE"
                        });
                    default:
                        return t();
                }
            }
            function cG(a) {
                const b = [];
                return (a.fields.forEach((a)=>b.push(a.canonicalString())), {
                    fieldPaths: b
                });
            }
            function cH(a) {
                return (a.length >= 4 && "projects" === a.get(0) && "databases" === a.get(2));
            }
            function cI(a) {
                let b = "";
                for(let c = 0; c < a.length; c++)b.length > 0 && (b = cK(b)), (b = cJ(a.get(c), b));
                return cK(b);
            }
            function cJ(a, b) {
                let c = b;
                const d = a.length;
                for(let e = 0; e < d; e++){
                    const f = a.charAt(e);
                    switch(f){
                        case "\0":
                            c += "";
                            break;
                        case "":
                            c += "";
                            break;
                        default:
                            c += f;
                    }
                }
                return c;
            }
            function cK(a) {
                return a + "";
            }
            function cL(a) {
                const b = a.length;
                if ((u(b >= 2), 2 === b)) return (u("" === a.charAt(0) && "" === a.charAt(1)), S.emptyPath());
                const c = b - 2, d = [];
                let e = "";
                for(let f = 0; f < b;){
                    const g = a.indexOf("", f);
                    (g < 0 || g > c) && t();
                    switch(a.charAt(g + 1)){
                        case "":
                            const h = a.substring(f, g);
                            let i;
                            0 === e.length ? (i = h) : ((e += h), (i = e), (e = "")), d.push(i);
                            break;
                        case "":
                            (e += a.substring(f, g)), (e += "\0");
                            break;
                        case "":
                            e += a.substring(f, g + 1);
                            break;
                        default:
                            t();
                    }
                    f = g + 2;
                }
                return new S(d);
            }
            class cM {
                constructor(a, b){
                    (this.seconds = a), (this.nanoseconds = b);
                }
            }
            class cN {
                constructor(a, b, c){
                    (this.ownerId = a), (this.allowTabSynchronization = b), (this.leaseTimestampMs = c);
                }
            }
            (cN.store = "owner"), (cN.key = "owner");
            class cO {
                constructor(a, b, c){
                    (this.userId = a), (this.lastAcknowledgedBatchId = b), (this.lastStreamToken = c);
                }
            }
            (cO.store = "mutationQueues"), (cO.keyPath = "userId");
            class cP {
                constructor(a, b, c, d, e){
                    (this.userId = a), (this.batchId = b), (this.localWriteTimeMs = c), (this.baseMutations = d), (this.mutations = e);
                }
            }
            (cP.store = "mutations"), (cP.keyPath = "batchId"), (cP.userMutationsIndex = "userMutationsIndex"), (cP.userMutationsKeyPath = [
                "userId",
                "batchId"
            ]);
            class cQ {
                constructor(){}
                static prefixForUser(a) {
                    return [
                        a
                    ];
                }
                static prefixForPath(a, b) {
                    return [
                        a,
                        cI(b)
                    ];
                }
                static key(a, b, c) {
                    return [
                        a,
                        cI(b),
                        c
                    ];
                }
            }
            (cQ.store = "documentMutations"), (cQ.PLACEHOLDER = new cQ());
            class cR {
                constructor(a, b){
                    (this.path = a), (this.readTime = b);
                }
            }
            class cS {
                constructor(a, b){
                    (this.path = a), (this.version = b);
                }
            }
            class cT {
                constructor(a, b, c, d, e, f){
                    (this.unknownDocument = a), (this.noDocument = b), (this.document = c), (this.hasCommittedMutations = d), (this.readTime = e), (this.parentPath = f);
                }
            }
            (cT.store = "remoteDocuments"), (cT.readTimeIndex = "readTimeIndex"), (cT.readTimeIndexPath = "readTime"), (cT.collectionReadTimeIndex = "collectionReadTimeIndex"), (cT.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime", 
            ]);
            class cU {
                constructor(a){
                    this.byteSize = a;
                }
            }
            (cU.store = "remoteDocumentGlobal"), (cU.key = "remoteDocumentGlobalKey");
            class cV {
                constructor(a, b, c, d, e, f, g){
                    (this.targetId = a), (this.canonicalId = b), (this.readTime = c), (this.resumeToken = d), (this.lastListenSequenceNumber = e), (this.lastLimboFreeSnapshotVersion = f), (this.query = g);
                }
            }
            (cV.store = "targets"), (cV.keyPath = "targetId"), (cV.queryTargetsIndexName = "queryTargetsIndex"), (cV.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ]);
            class cW {
                constructor(a, b, c){
                    (this.targetId = a), (this.path = b), (this.sequenceNumber = c);
                }
            }
            (cW.store = "targetDocuments"), (cW.keyPath = [
                "targetId",
                "path"
            ]), (cW.documentTargetsIndex = "documentTargetsIndex"), (cW.documentTargetsKeyPath = [
                "path",
                "targetId"
            ]);
            class cX {
                constructor(a, b, c, d){
                    (this.highestTargetId = a), (this.highestListenSequenceNumber = b), (this.lastRemoteSnapshotVersion = c), (this.targetCount = d);
                }
            }
            (cX.key = "targetGlobalKey"), (cX.store = "targetGlobal");
            class cY {
                constructor(a, b){
                    (this.collectionId = a), (this.parent = b);
                }
            }
            (cY.store = "collectionParents"), (cY.keyPath = [
                "collectionId",
                "parent"
            ]);
            class cZ {
                constructor(a, b, c, d){
                    (this.clientId = a), (this.updateTimeMs = b), (this.networkEnabled = c), (this.inForeground = d);
                }
            }
            (cZ.store = "clientMetadata"), (cZ.keyPath = "clientId");
            class c$ {
                constructor(a, b, c){
                    (this.bundleId = a), (this.createTime = b), (this.version = c);
                }
            }
            (c$.store = "bundles"), (c$.keyPath = "bundleId");
            class c_ {
                constructor(a, b, c){
                    (this.name = a), (this.readTime = b), (this.bundledQuery = c);
                }
            }
            (c_.store = "namedQueries"), (c_.keyPath = "name");
            const c0 = [
                ...[
                    ...[
                        ...[
                            ...[
                                cO.store,
                                cP.store,
                                cQ.store,
                                cT.store,
                                cV.store,
                                cN.store,
                                cX.store,
                                cW.store, 
                            ],
                            cZ.store, 
                        ],
                        cU.store, 
                    ],
                    cY.store, 
                ],
                c$.store,
                c_.store, 
            ], c1 = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
            class c2 {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(a) {
                    this.onCommittedListeners.push(a);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((a)=>a());
                }
            }
            class c3 {
                constructor(a){
                    (this.nextCallback = null), (this.catchCallback = null), (this.result = void 0), (this.error = void 0), (this.isDone = !1), (this.callbackAttached = !1), a((a)=>{
                        (this.isDone = !0), (this.result = a), this.nextCallback && this.nextCallback(a);
                    }, (a)=>{
                        (this.isDone = !0), (this.error = a), this.catchCallback && this.catchCallback(a);
                    });
                }
                catch(a) {
                    return this.next(void 0, a);
                }
                next(a, b) {
                    return (this.callbackAttached && t(), (this.callbackAttached = !0), this.isDone ? this.error ? this.wrapFailure(b, this.error) : this.wrapSuccess(a, this.result) : new c3((c, d)=>{
                        (this.nextCallback = (b)=>{
                            this.wrapSuccess(a, b).next(c, d);
                        }), (this.catchCallback = (a)=>{
                            this.wrapFailure(b, a).next(c, d);
                        });
                    }));
                }
                toPromise() {
                    return new Promise((a, b)=>{
                        this.next(a, b);
                    });
                }
                wrapUserFunction(a) {
                    try {
                        const b = a();
                        return b instanceof c3 ? b : c3.resolve(b);
                    } catch (c) {
                        return c3.reject(c);
                    }
                }
                wrapSuccess(a, b) {
                    return a ? this.wrapUserFunction(()=>a(b)) : c3.resolve(b);
                }
                wrapFailure(a, b) {
                    return a ? this.wrapUserFunction(()=>a(b)) : c3.reject(b);
                }
                static resolve(a) {
                    return new c3((b, c)=>{
                        b(a);
                    });
                }
                static reject(a) {
                    return new c3((b, c)=>{
                        c(a);
                    });
                }
                static waitFor(a) {
                    return new c3((b, c)=>{
                        let d = 0, e = 0, f = !1;
                        a.forEach((a)=>{
                            ++d, a.next(()=>{
                                ++e, f && e === d && b();
                            }, (a)=>c(a));
                        }), (f = !0), e === d && b();
                    });
                }
                static or(a) {
                    let b = c3.resolve(!1);
                    for (const c of a)b = b.next((a)=>(a ? c3.resolve(a) : c()));
                    return b;
                }
                static forEach(a, b) {
                    const c = [];
                    return (a.forEach((a, d)=>{
                        c.push(b.call(this, a, d));
                    }), this.waitFor(c));
                }
            }
            class c4 {
                constructor(a, b){
                    (this.action = a), (this.transaction = b), (this.aborted = !1), (this.Et = new z()), (this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }), (this.transaction.onabort = ()=>{
                        b.error ? this.Et.reject(new c7(a, b.error)) : this.Et.resolve();
                    }), (this.transaction.onerror = (b)=>{
                        const c = dc(b.target.error);
                        this.Et.reject(new c7(a, c));
                    });
                }
                static open(a, b, c, d) {
                    try {
                        return new c4(b, a.transaction(d, c));
                    } catch (e) {
                        throw new c7(b, e);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(a) {
                    a && this.Et.reject(a), this.aborted || (p("SimpleDb", "Aborting transaction:", a ? a.message : "Client-initiated abort"), (this.aborted = !0), this.transaction.abort());
                }
                store(a) {
                    const b = this.transaction.objectStore(a);
                    return new c9(b);
                }
            }
            class c5 {
                constructor(a, b, c){
                    (this.name = a), (this.version = b), (this.At = c);
                    12.2 === c5.Rt(getUA()) && q("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(a) {
                    return (p("SimpleDb", "Removing database:", a), da(window.indexedDB.deleteDatabase(a)).toPromise());
                }
                static bt() {
                    if (!isIndexedDBAvailable()) return !1;
                    if (c5.Pt()) return !0;
                    const a = getUA(), b = c5.Rt(a), c = 0 < b && b < 10, d = c5.vt(a), e = 0 < d && d < 4.5;
                    return !(a.indexOf("MSIE ") > 0 || a.indexOf("Trident/") > 0 || a.indexOf("Edge/") > 0 || c || e);
                }
                static Pt() {
                    var a;
                    return ("undefined" != typeof i && "YES" === (null === (a = i.env) || void 0 === a ? void 0 : a.Vt));
                }
                static St(a, b) {
                    return a.store(b);
                }
                static Rt(a) {
                    const b = a.match(/i(?:phone|pad|pod) os ([\d_]+)/i), c = b ? b[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(c);
                }
                static vt(a) {
                    const b = a.match(/Android ([\d.]+)/i), c = b ? b[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(c);
                }
                async Dt(a) {
                    return (this.db || (p("SimpleDb", "Opening database:", this.name), (this.db = await new Promise((b, c)=>{
                        const d = indexedDB.open(this.name, this.version);
                        (d.onsuccess = (a)=>{
                            const c = a.target.result;
                            b(c);
                        }), (d.onblocked = ()=>{
                            c(new c7(a, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }), (d.onerror = (b)=>{
                            const d = b.target.error;
                            "VersionError" === d.name ? c(new y(x.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === d.name ? c(new y(x.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + d)) : c(new c7(a, d));
                        }), (d.onupgradeneeded = (a)=>{
                            p("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', a.oldVersion);
                            const b = a.target.result;
                            this.At.Ct(b, d.transaction, a.oldVersion, this.version).next(()=>{
                                p("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        });
                    }))), this.Nt && (this.db.onversionchange = (a)=>this.Nt(a)), this.db);
                }
                xt(a) {
                    (this.Nt = a), this.db && (this.db.onversionchange = (b)=>a(b));
                }
                async runTransaction(a, b, c, d) {
                    const e = "readonly" === b;
                    let f = 0;
                    for(;;){
                        ++f;
                        try {
                            this.db = await this.Dt(a);
                            const g = c4.open(this.db, a, e ? "readonly" : "readwrite", c), h = d(g).catch((a)=>(g.abort(a), c3.reject(a))).toPromise();
                            return (h.catch(()=>{}), await g.It, h);
                        } catch (i) {
                            const j = "FirebaseError" !== i.name && f < 3;
                            if ((p("SimpleDb", "Transaction failed with error:", i.message, "Retrying:", j), this.close(), !j)) return Promise.reject(i);
                        }
                    }
                }
                close() {
                    this.db && this.db.close(), (this.db = void 0);
                }
            }
            class c6 {
                constructor(a){
                    (this.kt = a), (this.$t = !1), (this.Ot = null);
                }
                get isDone() {
                    return this.$t;
                }
                get Ft() {
                    return this.Ot;
                }
                set cursor(a) {
                    this.kt = a;
                }
                done() {
                    this.$t = !0;
                }
                Mt(a) {
                    this.Ot = a;
                }
                delete() {
                    return da(this.kt.delete());
                }
            }
            class c7 extends (null && y) {
                constructor(a, b){
                    super(x.UNAVAILABLE, `IndexedDB transaction '${a}' failed: ${b}`), (this.name = "IndexedDbTransactionError");
                }
            }
            function c8(a) {
                return "IndexedDbTransactionError" === a.name;
            }
            class c9 {
                constructor(a){
                    this.store = a;
                }
                put(a, b) {
                    let c;
                    return (void 0 !== b ? (p("SimpleDb", "PUT", this.store.name, a, b), (c = this.store.put(b, a))) : (p("SimpleDb", "PUT", this.store.name, "<auto-key>", a), (c = this.store.put(a))), da(c));
                }
                add(a) {
                    p("SimpleDb", "ADD", this.store.name, a, a);
                    return da(this.store.add(a));
                }
                get(a) {
                    return da(this.store.get(a)).next((b)=>(void 0 === b && (b = null), p("SimpleDb", "GET", this.store.name, a, b), b));
                }
                delete(a) {
                    p("SimpleDb", "DELETE", this.store.name, a);
                    return da(this.store.delete(a));
                }
                count() {
                    p("SimpleDb", "COUNT", this.store.name);
                    return da(this.store.count());
                }
                Lt(a, b) {
                    const c = this.cursor(this.options(a, b)), d = [];
                    return this.Bt(c, (a, b)=>{
                        d.push(b);
                    }).next(()=>d);
                }
                Ut(a, b) {
                    p("SimpleDb", "DELETE ALL", this.store.name);
                    const c = this.options(a, b);
                    c.qt = !1;
                    const d = this.cursor(c);
                    return this.Bt(d, (a, b, c)=>c.delete());
                }
                Kt(a, b) {
                    let c;
                    b ? (c = a) : ((c = {}), (b = a));
                    const d = this.cursor(c);
                    return this.Bt(d, b);
                }
                jt(a) {
                    const b = this.cursor({});
                    return new c3((c, d)=>{
                        (b.onerror = (a)=>{
                            const b = dc(a.target.error);
                            d(b);
                        }), (b.onsuccess = (b)=>{
                            const d = b.target.result;
                            d ? a(d.primaryKey, d.value).next((a)=>{
                                a ? d.continue() : c();
                            }) : c();
                        });
                    });
                }
                Bt(a, b) {
                    const c = [];
                    return new c3((d, e)=>{
                        (a.onerror = (a)=>{
                            e(a.target.error);
                        }), (a.onsuccess = (a)=>{
                            const e = a.target.result;
                            if (!e) return void d();
                            const f = new c6(e), g = b(e.primaryKey, e.value, f);
                            if (g instanceof c3) {
                                const h = g.catch((a)=>(f.done(), c3.reject(a)));
                                c.push(h);
                            }
                            f.isDone ? d() : null === f.Ft ? e.continue() : e.continue(f.Ft);
                        });
                    }).next(()=>c3.waitFor(c));
                }
                options(a, b) {
                    let c;
                    return (void 0 !== a && ("string" == typeof a ? (c = a) : (b = a)), {
                        index: c,
                        range: b
                    });
                }
                cursor(a) {
                    let b = "next";
                    if ((a.reverse && (b = "prev"), a.index)) {
                        const c = this.store.index(a.index);
                        return a.qt ? c.openKeyCursor(a.range, b) : c.openCursor(a.range, b);
                    }
                    return this.store.openCursor(a.range, b);
                }
            }
            function da(a) {
                return new c3((b, c)=>{
                    (a.onsuccess = (a)=>{
                        const c = a.target.result;
                        b(c);
                    }), (a.onerror = (a)=>{
                        const b = dc(a.target.error);
                        c(b);
                    });
                });
            }
            let db = null && !1;
            function dc(a) {
                const b = c5.Rt(getUA());
                if (b >= 12.2 && b < 13) {
                    const c = "An internal error was encountered in the Indexed Database server";
                    if (a.message.indexOf(c) >= 0) {
                        const d = new y("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${c}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return (db || ((db = !0), setTimeout(()=>{
                            throw d;
                        }, 0)), d);
                    }
                }
                return a;
            }
            class dd extends (null && c2) {
                constructor(a, b){
                    super(), (this.Qt = a), (this.currentSequenceNumber = b);
                }
            }
            function de(a, b) {
                const c = w(a);
                return c5.St(c.Qt, b);
            }
            class df {
                constructor(a, b, c, d){
                    (this.batchId = a), (this.localWriteTime = b), (this.baseMutations = c), (this.mutations = d);
                }
                applyToRemoteDocument(a, b) {
                    const c = b.mutationResults;
                    for(let d = 0; d < this.mutations.length; d++){
                        const e = this.mutations[d];
                        if (e.key.isEqual(a.key)) {
                            bu(e, a, c[d]);
                        }
                    }
                }
                applyToLocalView(a) {
                    for (const b of this.baseMutations)b.key.isEqual(a.key) && bv(b, a, this.localWriteTime);
                    for (const c of this.mutations)c.key.isEqual(a.key) && bv(c, a, this.localWriteTime);
                }
                applyToLocalDocumentSet(a) {
                    this.mutations.forEach((b)=>{
                        const c = a.get(b.key), d = c;
                        this.applyToLocalView(d), c.isValidDocument() || d.convertToNoDocument(N.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((a, b)=>a.add(b.key), bX());
                }
                isEqual(a) {
                    return (this.batchId === a.batchId && K(this.mutations, a.mutations, (a, b)=>bx(a, b)) && K(this.baseMutations, a.baseMutations, (a, b)=>bx(a, b)));
                }
            }
            class dg {
                constructor(a, b, c, d){
                    (this.batch = a), (this.commitVersion = b), (this.mutationResults = c), (this.docVersions = d);
                }
                static from(a, b, c) {
                    u(a.mutations.length === c.length);
                    let d = bV();
                    const e = a.mutations;
                    for(let f = 0; f < e.length; f++)d = d.insert(e[f].key, c[f].version);
                    return new dg(a, b, c, d);
                }
            }
            class dh {
                constructor(a, b, c, d, e = N.min(), f = N.min(), g = X.EMPTY_BYTE_STRING){
                    (this.target = a), (this.targetId = b), (this.purpose = c), (this.sequenceNumber = d), (this.snapshotVersion = e), (this.lastLimboFreeSnapshotVersion = f), (this.resumeToken = g);
                }
                withSequenceNumber(a) {
                    return new dh(this.target, this.targetId, this.purpose, a, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(a, b) {
                    return new dh(this.target, this.targetId, this.purpose, this.sequenceNumber, b, this.lastLimboFreeSnapshotVersion, a);
                }
                withLastLimboFreeSnapshotVersion(a) {
                    return new dh(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, a, this.resumeToken);
                }
            }
            class di {
                constructor(a){
                    this.Wt = a;
                }
            }
            function dj(a, b) {
                if (b.document) return cn(a.Wt, b.document, !!b.hasCommittedMutations);
                if (b.noDocument) {
                    const c = ag.fromSegments(b.noDocument.path), d = dp(b.noDocument.readTime), e = ax.newNoDocument(c, d);
                    return b.hasCommittedMutations ? e.setHasCommittedMutations() : e;
                }
                if (b.unknownDocument) {
                    const f = ag.fromSegments(b.unknownDocument.path), g = dp(b.unknownDocument.version);
                    return ax.newUnknownDocument(f, g);
                }
                return t();
            }
            function dk(a, b, c) {
                const d = dl(c), e = b.key.path.popLast().toArray();
                if (b.isFoundDocument()) {
                    const f = (function(a, b) {
                        return {
                            name: cg(a, b.key),
                            fields: b.data.value.mapValue.fields,
                            updateTime: ca(a, b.version.toTimestamp())
                        };
                    })(a.Wt, b), g = b.hasCommittedMutations;
                    return new cT(null, null, f, g, d, e);
                }
                if (b.isNoDocument()) {
                    const h = b.key.path.toArray(), i = dn(b.version), j = b.hasCommittedMutations;
                    return new cT(null, new cR(h, i), null, j, d, e);
                }
                if (b.isUnknownDocument()) {
                    const k = b.key.path.toArray(), l = dn(b.version);
                    return new cT(new cS(k, l), null, null, !0, d, e);
                }
                return t();
            }
            function dl(a) {
                const b = a.toTimestamp();
                return [
                    b.seconds,
                    b.nanoseconds
                ];
            }
            function dm(a) {
                const b = new M(a[0], a[1]);
                return N.fromTimestamp(b);
            }
            function dn(a) {
                const b = a.toTimestamp();
                return new cM(b.seconds, b.nanoseconds);
            }
            function dp(a) {
                const b = new M(a.seconds, a.nanoseconds);
                return N.fromTimestamp(b);
            }
            function dq(a, b) {
                const c = (b.baseMutations || []).map((b)=>cr(a.Wt, b));
                for(let d = 0; d < b.mutations.length - 1; ++d){
                    const e = b.mutations[d];
                    if (d + 1 < b.mutations.length && void 0 !== b.mutations[d + 1].transform) {
                        const f = b.mutations[d + 1];
                        (e.updateTransforms = f.transform.fieldTransforms), b.mutations.splice(d + 1, 1), ++d;
                    }
                }
                const g = b.mutations.map((b)=>cr(a.Wt, b)), h = M.fromMillis(b.localWriteTimeMs);
                return new df(b.batchId, h, c, g);
            }
            function dr(a) {
                const b = dp(a.readTime), c = void 0 !== a.lastLimboFreeSnapshotVersion ? dp(a.lastLimboFreeSnapshotVersion) : N.min();
                let d;
                var e;
                return (void 0 !== a.query.documents ? (u(1 === (e = a.query).documents.length), (d = a1(aW(cj(e.documents[0]))))) : (d = (function(a) {
                    return a1(cv(a));
                })(a.query)), new dh(d, a.targetId, 0, a.lastListenSequenceNumber, b, c, X.fromBase64String(a.resumeToken)));
            }
            function ds(a, b) {
                const c = dn(b.snapshotVersion), d = dn(b.lastLimboFreeSnapshotVersion);
                let e;
                e = aD(b.target) ? ct(a.Wt, b.target) : cu(a.Wt, b.target);
                const f = b.resumeToken.toBase64();
                return new cV(b.targetId, aA(b.target), c, f, b.sequenceNumber, d, e);
            }
            function dt(a) {
                const b = cv({
                    parent: a.parent,
                    structuredQuery: a.structuredQuery
                });
                return "LAST" === a.limitType ? a2(b, b.limit, "L") : b;
            }
            class du {
                getBundleMetadata(a, b) {
                    return dv(a).get(b).next((a)=>{
                        if (a) return {
                            id: (b = a).bundleId,
                            createTime: dp(b.createTime),
                            version: b.version
                        };
                        var b;
                    });
                }
                saveBundleMetadata(a, b) {
                    return dv(a).put({
                        bundleId: (c = b).id,
                        createTime: dn(cd(c.createTime)),
                        version: c.version
                    });
                    var c;
                }
                getNamedQuery(a, b) {
                    return dw(a).get(b).next((a)=>{
                        if (a) return {
                            name: (b = a).name,
                            query: dt(b.bundledQuery),
                            readTime: dp(b.readTime)
                        };
                        var b;
                    });
                }
                saveNamedQuery(a, b) {
                    return dw(a).put((function(a) {
                        return {
                            name: a.name,
                            readTime: dn(cd(a.readTime)),
                            bundledQuery: a.bundledQuery
                        };
                    })(b));
                }
            }
            function dv(a) {
                return de(a, c$.store);
            }
            function dw(a) {
                return de(a, c_.store);
            }
            class dx {
                constructor(){
                    this.Gt = new dy();
                }
                addToCollectionParentIndex(a, b) {
                    return this.Gt.add(b), c3.resolve();
                }
                getCollectionParents(a, b) {
                    return c3.resolve(this.Gt.getEntries(b));
                }
            }
            class dy {
                constructor(){
                    this.index = {};
                }
                add(a) {
                    const b = a.lastSegment(), c = a.popLast(), d = this.index[b] || new bO(S.comparator), e = !d.has(c);
                    return (this.index[b] = d.add(c)), e;
                }
                has(a) {
                    const b = a.lastSegment(), c = a.popLast(), d = this.index[b];
                    return d && d.has(c);
                }
                getEntries(a) {
                    return (this.index[a] || new bO(S.comparator)).toArray();
                }
            }
            class dz {
                constructor(){
                    this.zt = new dy();
                }
                addToCollectionParentIndex(a, b) {
                    if (!this.zt.has(b)) {
                        const c = b.lastSegment(), d = b.popLast();
                        a.addOnCommittedListener(()=>{
                            this.zt.add(b);
                        });
                        const e = {
                            collectionId: c,
                            parent: cI(d)
                        };
                        return dA(a).put(e);
                    }
                    return c3.resolve();
                }
                getCollectionParents(a, b) {
                    const c = [], d = IDBKeyRange.bound([
                        b,
                        ""
                    ], [
                        L(b),
                        ""
                    ], !1, !0);
                    return dA(a).Lt(d).next((a)=>{
                        for (const d of a){
                            if (d.collectionId !== b) break;
                            c.push(cL(d.parent));
                        }
                        return c;
                    });
                }
            }
            function dA(a) {
                return de(a, cY.store);
            }
            const dB = {
                didRun: !1,
                sequenceNumbersCollected: 0,
                targetsRemoved: 0,
                documentsRemoved: 0
            };
            class dC {
                constructor(a, b, c){
                    (this.cacheSizeCollectionThreshold = a), (this.percentileToCollect = b), (this.maximumSequenceNumbersToCollect = c);
                }
                static withCacheSize(a) {
                    return new dC(a, dC.DEFAULT_COLLECTION_PERCENTILE, dC.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            function dD(a, b, c) {
                const d = a.store(cP.store), e = a.store(cQ.store), f = [], g = IDBKeyRange.only(c.batchId);
                let h = 0;
                const i = d.Kt({
                    range: g
                }, (a, b, c)=>(h++, c.delete()));
                f.push(i.next(()=>{
                    u(1 === h);
                }));
                const j = [];
                for (const k of c.mutations){
                    const l = cQ.key(b, k.key.path, c.batchId);
                    f.push(e.delete(l)), j.push(k.key);
                }
                return c3.waitFor(f).next(()=>j);
            }
            function dE(a) {
                if (!a) return 0;
                let b;
                if (a.document) b = a.document;
                else if (a.unknownDocument) b = a.unknownDocument;
                else {
                    if (!a.noDocument) throw t();
                    b = a.noDocument;
                }
                return JSON.stringify(b).length;
            }
            (dC.DEFAULT_COLLECTION_PERCENTILE = 10), (dC.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3), (dC.DEFAULT = new dC(41943040, dC.DEFAULT_COLLECTION_PERCENTILE, dC.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)), (dC.DISABLED = new dC(-1, 0, 0));
            class dF {
                constructor(a, b, c, d){
                    (this.userId = a), (this.N = b), (this.Ht = c), (this.referenceDelegate = d), (this.Jt = {});
                }
                static Yt(a, b, c, d) {
                    u("" !== a.uid);
                    const e = a.isAuthenticated() ? a.uid : "";
                    return new dF(e, b, c, d);
                }
                checkEmpty(a) {
                    let b = !0;
                    const c = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return dH(a).Kt({
                        index: cP.userMutationsIndex,
                        range: c
                    }, (a, c, d)=>{
                        (b = !1), d.done();
                    }).next(()=>b);
                }
                addMutationBatch(a, b, c, d) {
                    const e = dI(a), f = dH(a);
                    return f.add({}).next((g)=>{
                        u("number" == typeof g);
                        const h = new df(g, b, c, d), i = (function(a, b, c) {
                            const d = c.baseMutations.map((b)=>cq(a.Wt, b)), e = c.mutations.map((b)=>cq(a.Wt, b));
                            return new cP(b, c.batchId, c.localWriteTime.toMillis(), d, e);
                        })(this.N, this.userId, h), j = [];
                        let k = new bO((a, b)=>J(a.canonicalString(), b.canonicalString()));
                        for (const l of d){
                            const m = cQ.key(this.userId, l.key.path, g);
                            (k = k.add(l.key.path.popLast())), j.push(f.put(i)), j.push(e.put(m, cQ.PLACEHOLDER));
                        }
                        return (k.forEach((b)=>{
                            j.push(this.Ht.addToCollectionParentIndex(a, b));
                        }), a.addOnCommittedListener(()=>{
                            this.Jt[g] = h.keys();
                        }), c3.waitFor(j).next(()=>h));
                    });
                }
                lookupMutationBatch(a, b) {
                    return dH(a).get(b).next((a)=>a ? (u(a.userId === this.userId), dq(this.N, a)) : null);
                }
                Xt(a, b) {
                    return this.Jt[b] ? c3.resolve(this.Jt[b]) : this.lookupMutationBatch(a, b).next((a)=>{
                        if (a) {
                            const c = a.keys();
                            return (this.Jt[b] = c), c;
                        }
                        return null;
                    });
                }
                getNextMutationBatchAfterBatchId(a, b) {
                    const c = b + 1, d = IDBKeyRange.lowerBound([
                        this.userId,
                        c
                    ]);
                    let e = null;
                    return dH(a).Kt({
                        index: cP.userMutationsIndex,
                        range: d
                    }, (a, b, d)=>{
                        b.userId === this.userId && (u(b.batchId >= c), (e = dq(this.N, b))), d.done();
                    }).next(()=>e);
                }
                getHighestUnacknowledgedBatchId(a) {
                    const b = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY, 
                    ]);
                    let c = -1;
                    return dH(a).Kt({
                        index: cP.userMutationsIndex,
                        range: b,
                        reverse: !0
                    }, (a, b, d)=>{
                        (c = b.batchId), d.done();
                    }).next(()=>c);
                }
                getAllMutationBatches(a) {
                    const b = IDBKeyRange.bound([
                        this.userId,
                        -1
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return dH(a).Lt(cP.userMutationsIndex, b).next((a)=>a.map((a)=>dq(this.N, a)));
                }
                getAllMutationBatchesAffectingDocumentKey(a, b) {
                    const c = cQ.prefixForPath(this.userId, b.path), d = IDBKeyRange.lowerBound(c), e = [];
                    return dI(a).Kt({
                        range: d
                    }, (c, d, f)=>{
                        const [g, h, i] = c, j = cL(h);
                        if (g === this.userId && b.path.isEqual(j)) return dH(a).get(i).next((a)=>{
                            if (!a) throw t();
                            u(a.userId === this.userId), e.push(dq(this.N, a));
                        });
                        f.done();
                    }).next(()=>e);
                }
                getAllMutationBatchesAffectingDocumentKeys(a, b) {
                    let c = new bO(J);
                    const d = [];
                    return (b.forEach((b)=>{
                        const e = cQ.prefixForPath(this.userId, b.path), f = IDBKeyRange.lowerBound(e), g = dI(a).Kt({
                            range: f
                        }, (a, d, e)=>{
                            const [f, g, h] = a, i = cL(g);
                            f === this.userId && b.path.isEqual(i) ? (c = c.add(h)) : e.done();
                        });
                        d.push(g);
                    }), c3.waitFor(d).next(()=>this.Zt(a, c)));
                }
                getAllMutationBatchesAffectingQuery(a, b) {
                    const c = b.path, d = c.length + 1, e = cQ.prefixForPath(this.userId, c), f = IDBKeyRange.lowerBound(e);
                    let g = new bO(J);
                    return dI(a).Kt({
                        range: f
                    }, (a, b, e)=>{
                        const [f, h, i] = a, j = cL(h);
                        f === this.userId && c.isPrefixOf(j) ? j.length === d && (g = g.add(i)) : e.done();
                    }).next(()=>this.Zt(a, g));
                }
                Zt(a, b) {
                    const c = [], d = [];
                    return (b.forEach((b)=>{
                        d.push(dH(a).get(b).next((a)=>{
                            if (null === a) throw t();
                            u(a.userId === this.userId), c.push(dq(this.N, a));
                        }));
                    }), c3.waitFor(d).next(()=>c));
                }
                removeMutationBatch(a, b) {
                    return dD(a.Qt, this.userId, b).next((c)=>(a.addOnCommittedListener(()=>{
                            this.te(b.batchId);
                        }), c3.forEach(c, (b)=>this.referenceDelegate.markPotentiallyOrphaned(a, b))));
                }
                te(a) {
                    delete this.Jt[a];
                }
                performConsistencyCheck(a) {
                    return this.checkEmpty(a).next((b)=>{
                        if (!b) return c3.resolve();
                        const c = IDBKeyRange.lowerBound(cQ.prefixForUser(this.userId)), d = [];
                        return dI(a).Kt({
                            range: c
                        }, (a, b, c)=>{
                            if (a[0] === this.userId) {
                                const e = cL(a[1]);
                                d.push(e);
                            } else c.done();
                        }).next(()=>{
                            u(0 === d.length);
                        });
                    });
                }
                containsKey(a, b) {
                    return dG(a, this.userId, b);
                }
                ee(a) {
                    return dJ(a).get(this.userId).next((a)=>a || new cO(this.userId, -1, ""));
                }
            }
            function dG(a, b, c) {
                const d = cQ.prefixForPath(b, c.path), e = d[1], f = IDBKeyRange.lowerBound(d);
                let g = !1;
                return dI(a).Kt({
                    range: f,
                    qt: !0
                }, (a, c, d)=>{
                    const [f, h, i] = a;
                    f === b && h === e && (g = !0), d.done();
                }).next(()=>g);
            }
            function dH(a) {
                return de(a, cP.store);
            }
            function dI(a) {
                return de(a, cQ.store);
            }
            function dJ(a) {
                return de(a, cO.store);
            }
            class dK {
                constructor(a){
                    this.ne = a;
                }
                next() {
                    return (this.ne += 2), this.ne;
                }
                static se() {
                    return new dK(0);
                }
                static ie() {
                    return new dK(-1);
                }
            }
            class dL {
                constructor(a, b){
                    (this.referenceDelegate = a), (this.N = b);
                }
                allocateTargetId(a) {
                    return this.re(a).next((b)=>{
                        const c = new dK(b.highestTargetId);
                        return ((b.highestTargetId = c.next()), this.oe(a, b).next(()=>b.highestTargetId));
                    });
                }
                getLastRemoteSnapshotVersion(a) {
                    return this.re(a).next((a)=>N.fromTimestamp(new M(a.lastRemoteSnapshotVersion.seconds, a.lastRemoteSnapshotVersion.nanoseconds)));
                }
                getHighestSequenceNumber(a) {
                    return this.re(a).next((a)=>a.highestListenSequenceNumber);
                }
                setTargetsMetadata(a, b, c) {
                    return this.re(a).next((d)=>((d.highestListenSequenceNumber = b), c && (d.lastRemoteSnapshotVersion = c.toTimestamp()), b > d.highestListenSequenceNumber && (d.highestListenSequenceNumber = b), this.oe(a, d)));
                }
                addTargetData(a, b) {
                    return this.ce(a, b).next(()=>this.re(a).next((c)=>((c.targetCount += 1), this.ae(b, c), this.oe(a, c))));
                }
                updateTargetData(a, b) {
                    return this.ce(a, b);
                }
                removeTargetData(a, b) {
                    return this.removeMatchingKeysForTargetId(a, b.targetId).next(()=>dM(a).delete(b.targetId)).next(()=>this.re(a)).next((b)=>(u(b.targetCount > 0), (b.targetCount -= 1), this.oe(a, b)));
                }
                removeTargets(a, b, c) {
                    let d = 0;
                    const e = [];
                    return dM(a).Kt((f, g)=>{
                        const h = dr(g);
                        h.sequenceNumber <= b && null === c.get(h.targetId) && (d++, e.push(this.removeTargetData(a, h)));
                    }).next(()=>c3.waitFor(e)).next(()=>d);
                }
                forEachTarget(a, b) {
                    return dM(a).Kt((a, c)=>{
                        const d = dr(c);
                        b(d);
                    });
                }
                re(a) {
                    return dN(a).get(cX.key).next((a)=>(u(null !== a), a));
                }
                oe(a, b) {
                    return dN(a).put(cX.key, b);
                }
                ce(a, b) {
                    return dM(a).put(ds(this.N, b));
                }
                ae(a, b) {
                    let c = !1;
                    return (a.targetId > b.highestTargetId && ((b.highestTargetId = a.targetId), (c = !0)), a.sequenceNumber > b.highestListenSequenceNumber && ((b.highestListenSequenceNumber = a.sequenceNumber), (c = !0)), c);
                }
                getTargetCount(a) {
                    return this.re(a).next((a)=>a.targetCount);
                }
                getTargetData(a, b) {
                    const c = aA(b), d = IDBKeyRange.bound([
                        c,
                        Number.NEGATIVE_INFINITY
                    ], [
                        c,
                        Number.POSITIVE_INFINITY
                    ]);
                    let e = null;
                    return dM(a).Kt({
                        range: d,
                        index: cV.queryTargetsIndexName
                    }, (a, c, d)=>{
                        const f = dr(c);
                        aC(b, f.target) && ((e = f), d.done());
                    }).next(()=>e);
                }
                addMatchingKeys(a, b, c) {
                    const d = [], e = dO(a);
                    return (b.forEach((b)=>{
                        const f = cI(b.path);
                        d.push(e.put(new cW(c, f))), d.push(this.referenceDelegate.addReference(a, c, b));
                    }), c3.waitFor(d));
                }
                removeMatchingKeys(a, b, c) {
                    const d = dO(a);
                    return c3.forEach(b, (b)=>{
                        const e = cI(b.path);
                        return c3.waitFor([
                            d.delete([
                                c,
                                e
                            ]),
                            this.referenceDelegate.removeReference(a, c, b), 
                        ]);
                    });
                }
                removeMatchingKeysForTargetId(a, b) {
                    const c = dO(a), d = IDBKeyRange.bound([
                        b
                    ], [
                        b + 1
                    ], !1, !0);
                    return c.delete(d);
                }
                getMatchingKeysForTargetId(a, b) {
                    const c = IDBKeyRange.bound([
                        b
                    ], [
                        b + 1
                    ], !1, !0), d = dO(a);
                    let e = bX();
                    return d.Kt({
                        range: c,
                        qt: !0
                    }, (a, b, c)=>{
                        const d = cL(a[1]), f = new ag(d);
                        e = e.add(f);
                    }).next(()=>e);
                }
                containsKey(a, b) {
                    const c = cI(b.path), d = IDBKeyRange.bound([
                        c
                    ], [
                        L(c)
                    ], !1, !0);
                    let e = 0;
                    return dO(a).Kt({
                        index: cW.documentTargetsIndex,
                        qt: !0,
                        range: d
                    }, ([a, b], c, d)=>{
                        0 !== a && (e++, d.done());
                    }).next(()=>e > 0);
                }
                Tt(a, b) {
                    return dM(a).get(b).next((a)=>(a ? dr(a) : null));
                }
            }
            function dM(a) {
                return de(a, cV.store);
            }
            function dN(a) {
                return de(a, cX.store);
            }
            function dO(a) {
                return de(a, cW.store);
            }
            async function dP(a) {
                if (a.code !== x.FAILED_PRECONDITION || a.message !== c1) throw a;
                p("LocalStore", "Unexpectedly lost primary lease");
            }
            function dQ([a, b], [c, d]) {
                const e = J(a, c);
                return 0 === e ? J(b, d) : e;
            }
            class dR {
                constructor(a){
                    (this.ue = a), (this.buffer = new bO(dQ)), (this.he = 0);
                }
                le() {
                    return ++this.he;
                }
                fe(a) {
                    const b = [
                        a,
                        this.le()
                    ];
                    if (this.buffer.size < this.ue) this.buffer = this.buffer.add(b);
                    else {
                        const c = this.buffer.last();
                        dQ(b, c) < 0 && (this.buffer = this.buffer.delete(c).add(b));
                    }
                }
                get maxValue() {
                    return this.buffer.last()[0];
                }
            }
            class dS {
                constructor(a, b){
                    (this.garbageCollector = a), (this.asyncQueue = b), (this.de = !1), (this.we = null);
                }
                start(a) {
                    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this._e(a);
                }
                stop() {
                    this.we && (this.we.cancel(), (this.we = null));
                }
                get started() {
                    return null !== this.we;
                }
                _e(a) {
                    const b = this.de ? 3e5 : 6e4;
                    p("LruGarbageCollector", `Garbage collection scheduled in ${b}ms`), (this.we = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", b, async ()=>{
                        (this.we = null), (this.de = !0);
                        try {
                            await a.collectGarbage(this.garbageCollector);
                        } catch (b) {
                            c8(b) ? p("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", b) : await dP(b);
                        }
                        await this._e(a);
                    }));
                }
            }
            class dT {
                constructor(a, b){
                    (this.me = a), (this.params = b);
                }
                calculateTargetCount(a, b) {
                    return this.me.ge(a).next((a)=>Math.floor((b / 100) * a));
                }
                nthSequenceNumber(a, b) {
                    if (0 === b) return c3.resolve(G.T);
                    const c = new dR(b);
                    return this.me.forEachTarget(a, (a)=>c.fe(a.sequenceNumber)).next(()=>this.me.ye(a, (a)=>c.fe(a))).next(()=>c.maxValue);
                }
                removeTargets(a, b, c) {
                    return this.me.removeTargets(a, b, c);
                }
                removeOrphanedDocuments(a, b) {
                    return this.me.removeOrphanedDocuments(a, b);
                }
                collect(a, b) {
                    return -1 === this.params.cacheSizeCollectionThreshold ? (p("LruGarbageCollector", "Garbage collection skipped; disabled"), c3.resolve(dB)) : this.getCacheSize(a).next((c)=>c < this.params.cacheSizeCollectionThreshold ? (p("LruGarbageCollector", `Garbage collection skipped; Cache size ${c} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), dB) : this.pe(a, b));
                }
                getCacheSize(a) {
                    return this.me.getCacheSize(a);
                }
                pe(a, b) {
                    let c, d, e, f, g, h, i;
                    const j = Date.now();
                    return this.calculateTargetCount(a, this.params.percentileToCollect).next((b)=>(b > this.params.maximumSequenceNumbersToCollect ? (p("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${b}`), (d = this.params.maximumSequenceNumbersToCollect)) : (d = b), (f = Date.now()), this.nthSequenceNumber(a, d))).next((d)=>((c = d), (g = Date.now()), this.removeTargets(a, c, b))).next((b)=>((e = b), (h = Date.now()), this.removeOrphanedDocuments(a, c))).next((a)=>{
                        if (((i = Date.now()), n() <= LogLevel.DEBUG)) {
                            p("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${f - j}ms\n\tDetermined least recently used ${d} in ` + (g - f) + "ms\n" + `\tRemoved ${e} targets in ` + (h - g) + "ms\n" + `\tRemoved ${a} documents in ` + (i - h) + "ms\n" + `Total Duration: ${i - j}ms`);
                        }
                        return c3.resolve({
                            didRun: !0,
                            sequenceNumbersCollected: d,
                            targetsRemoved: e,
                            documentsRemoved: a
                        });
                    });
                }
            }
            class dU {
                constructor(a, b){
                    (this.db = a), (this.garbageCollector = (function(a, b) {
                        return new dT(a, b);
                    })(this, b));
                }
                ge(a) {
                    const b = this.Te(a);
                    return this.db.getTargetCache().getTargetCount(a).next((a)=>b.next((b)=>a + b));
                }
                Te(a) {
                    let b = 0;
                    return this.ye(a, (a)=>{
                        b++;
                    }).next(()=>b);
                }
                forEachTarget(a, b) {
                    return this.db.getTargetCache().forEachTarget(a, b);
                }
                ye(a, b) {
                    return this.Ee(a, (a, c)=>b(c));
                }
                addReference(a, b, c) {
                    return dV(a, c);
                }
                removeReference(a, b, c) {
                    return dV(a, c);
                }
                removeTargets(a, b, c) {
                    return this.db.getTargetCache().removeTargets(a, b, c);
                }
                markPotentiallyOrphaned(a, b) {
                    return dV(a, b);
                }
                Ie(a, b) {
                    return (function(a, b) {
                        let c = !1;
                        return dJ(a).jt((d)=>dG(a, d, b).next((a)=>(a && (c = !0), c3.resolve(!a)))).next(()=>c);
                    })(a, b);
                }
                removeOrphanedDocuments(a, b) {
                    const c = this.db.getRemoteDocumentCache().newChangeBuffer(), d = [];
                    let e = 0;
                    return this.Ee(a, (f, g)=>{
                        if (g <= b) {
                            const h = this.Ie(a, f).next((b)=>{
                                if (!b) return (e++, c.getEntry(a, f).next(()=>(c.removeEntry(f), dO(a).delete([
                                        0,
                                        cI(f.path), 
                                    ]))));
                            });
                            d.push(h);
                        }
                    }).next(()=>c3.waitFor(d)).next(()=>c.apply(a)).next(()=>e);
                }
                removeTarget(a, b) {
                    const c = b.withSequenceNumber(a.currentSequenceNumber);
                    return this.db.getTargetCache().updateTargetData(a, c);
                }
                updateLimboDocument(a, b) {
                    return dV(a, b);
                }
                Ee(a, b) {
                    const c = dO(a);
                    let d, e = G.T;
                    return c.Kt({
                        index: cW.documentTargetsIndex
                    }, ([a, c], { path: f , sequenceNumber: g  })=>{
                        0 === a ? (e !== G.T && b(new ag(cL(d)), e), (e = g), (d = f)) : (e = G.T);
                    }).next(()=>{
                        e !== G.T && b(new ag(cL(d)), e);
                    });
                }
                getCacheSize(a) {
                    return this.db.getRemoteDocumentCache().getSize(a);
                }
            }
            function dV(a, b) {
                return dO(a).put((function(a, b) {
                    return new cW(0, cI(a.path), b);
                })(b, a.currentSequenceNumber));
            }
            class dW {
                constructor(a, b){
                    (this.mapKeyFn = a), (this.equalsFn = b), (this.inner = {});
                }
                get(a) {
                    const b = this.mapKeyFn(a), c = this.inner[b];
                    if (void 0 !== c) for (const [d, e] of c)if (this.equalsFn(d, a)) return e;
                }
                has(a) {
                    return void 0 !== this.get(a);
                }
                set(a, b) {
                    const c = this.mapKeyFn(a), d = this.inner[c];
                    if (void 0 !== d) {
                        for(let e = 0; e < d.length; e++)if (this.equalsFn(d[e][0], a)) return void (d[e] = [
                            a,
                            b
                        ]);
                        d.push([
                            a,
                            b
                        ]);
                    } else this.inner[c] = [
                        [
                            a,
                            b
                        ]
                    ];
                }
                delete(a) {
                    const b = this.mapKeyFn(a), c = this.inner[b];
                    if (void 0 === c) return !1;
                    for(let d = 0; d < c.length; d++)if (this.equalsFn(c[d][0], a)) return (1 === c.length ? delete this.inner[b] : c.splice(d, 1), !0);
                    return !1;
                }
                forEach(a) {
                    P(this.inner, (b, c)=>{
                        for (const [d, e] of c)a(d, e);
                    });
                }
                isEmpty() {
                    return Q(this.inner);
                }
            }
            class dX {
                constructor(){
                    (this.changes = new dW((a)=>a.toString(), (a, b)=>a.isEqual(b))), (this.changesApplied = !1);
                }
                getReadTime(a) {
                    const b = this.changes.get(a);
                    return b ? b.readTime : N.min();
                }
                addEntry(a, b) {
                    this.assertNotApplied(), this.changes.set(a.key, {
                        document: a,
                        readTime: b
                    });
                }
                removeEntry(a, b = null) {
                    this.assertNotApplied(), this.changes.set(a, {
                        document: ax.newInvalidDocument(a),
                        readTime: b
                    });
                }
                getEntry(a, b) {
                    this.assertNotApplied();
                    const c = this.changes.get(b);
                    return void 0 !== c ? c3.resolve(c.document) : this.getFromCache(a, b);
                }
                getEntries(a, b) {
                    return this.getAllFromCache(a, b);
                }
                apply(a) {
                    return (this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(a));
                }
                assertNotApplied() {}
            }
            class dY {
                constructor(a, b){
                    (this.N = a), (this.Ht = b);
                }
                addEntry(a, b, c) {
                    return d_(a).put(d0(b), c);
                }
                removeEntry(a, b) {
                    const c = d_(a), d = d0(b);
                    return c.delete(d);
                }
                updateMetadata(a, b) {
                    return this.getMetadata(a).next((c)=>((c.byteSize += b), this.Ae(a, c)));
                }
                getEntry(a, b) {
                    return d_(a).get(d0(b)).next((a)=>this.Re(b, a));
                }
                be(a, b) {
                    return d_(a).get(d0(b)).next((a)=>({
                            document: this.Re(b, a),
                            size: dE(a)
                        }));
                }
                getEntries(a, b) {
                    let c = bR();
                    return this.Pe(a, b, (a, b)=>{
                        const d = this.Re(a, b);
                        c = c.insert(a, d);
                    }).next(()=>c);
                }
                ve(a, b) {
                    let c = bR(), d = new bL(ag.comparator);
                    return this.Pe(a, b, (a, b)=>{
                        const e = this.Re(a, b);
                        (c = c.insert(a, e)), (d = d.insert(a, dE(b)));
                    }).next(()=>({
                            documents: c,
                            Ve: d
                        }));
                }
                Pe(a, b, c) {
                    if (b.isEmpty()) return c3.resolve();
                    const d = IDBKeyRange.bound(b.first().path.toArray(), b.last().path.toArray()), e = b.getIterator();
                    let f = e.getNext();
                    return d_(a).Kt({
                        range: d
                    }, (a, b, d)=>{
                        const g = ag.fromSegments(a);
                        for(; f && ag.comparator(f, g) < 0;)c(f, null), (f = e.getNext());
                        f && f.isEqual(g) && (c(f, b), (f = e.hasNext() ? e.getNext() : null)), f ? d.Mt(f.path.toArray()) : d.done();
                    }).next(()=>{
                        for(; f;)c(f, null), (f = e.hasNext() ? e.getNext() : null);
                    });
                }
                getDocumentsMatchingQuery(a, b, c) {
                    let d = bR();
                    const e = b.path.length + 1, f = {};
                    if (c.isEqual(N.min())) {
                        const g = b.path.toArray();
                        f.range = IDBKeyRange.lowerBound(g);
                    } else {
                        const h = b.path.toArray(), i = dl(c);
                        (f.range = IDBKeyRange.lowerBound([
                            h,
                            i
                        ], !0)), (f.index = cT.collectionReadTimeIndex);
                    }
                    return d_(a).Kt(f, (a, c, f)=>{
                        if (a.length !== e) return;
                        const g = dj(this.N, c);
                        b.path.isPrefixOf(g.key.path) ? a6(b, g) && (d = d.insert(g.key, g)) : f.done();
                    }).next(()=>d);
                }
                newChangeBuffer(a) {
                    return new dZ(this, !!a && a.trackRemovals);
                }
                getSize(a) {
                    return this.getMetadata(a).next((a)=>a.byteSize);
                }
                getMetadata(a) {
                    return d$(a).get(cU.key).next((a)=>(u(!!a), a));
                }
                Ae(a, b) {
                    return d$(a).put(cU.key, b);
                }
                Re(a, b) {
                    if (b) {
                        const c = dj(this.N, b);
                        if (!(c.isNoDocument() && c.version.isEqual(N.min()))) return c;
                    }
                    return ax.newInvalidDocument(a);
                }
            }
            class dZ extends (null && dX) {
                constructor(a, b){
                    super(), (this.Se = a), (this.trackRemovals = b), (this.De = new dW((a)=>a.toString(), (a, b)=>a.isEqual(b)));
                }
                applyChanges(a) {
                    const b = [];
                    let c = 0, d = new bO((a, b)=>J(a.canonicalString(), b.canonicalString()));
                    return (this.changes.forEach((e, f)=>{
                        const g = this.De.get(e);
                        if (f.document.isValidDocument()) {
                            const h = dk(this.Se.N, f.document, this.getReadTime(e));
                            d = d.add(e.path.popLast());
                            const i = dE(h);
                            (c += i - g), b.push(this.Se.addEntry(a, e, h));
                        } else if (((c -= g), this.trackRemovals)) {
                            const j = dk(this.Se.N, ax.newNoDocument(e, N.min()), this.getReadTime(e));
                            b.push(this.Se.addEntry(a, e, j));
                        } else b.push(this.Se.removeEntry(a, e));
                    }), d.forEach((c)=>{
                        b.push(this.Se.Ht.addToCollectionParentIndex(a, c));
                    }), b.push(this.Se.updateMetadata(a, c)), c3.waitFor(b));
                }
                getFromCache(a, b) {
                    return this.Se.be(a, b).next((a)=>(this.De.set(b, a.size), a.document));
                }
                getAllFromCache(a, b) {
                    return this.Se.ve(a, b).next(({ documents: a , Ve: b  })=>(b.forEach((a, b)=>{
                            this.De.set(a, b);
                        }), a));
                }
            }
            function d$(a) {
                return de(a, cU.store);
            }
            function d_(a) {
                return de(a, cT.store);
            }
            function d0(a) {
                return a.path.toArray();
            }
            class d1 {
                constructor(a){
                    this.N = a;
                }
                Ct(a, b, c, d) {
                    u(c < d && c >= 0 && d <= 11);
                    const e = new c4("createOrUpgrade", b);
                    c < 1 && d >= 1 && ((function(a) {
                        a.createObjectStore(cN.store);
                    })(a), (function(a) {
                        a.createObjectStore(cO.store, {
                            keyPath: cO.keyPath
                        });
                        a.createObjectStore(cP.store, {
                            keyPath: cP.keyPath,
                            autoIncrement: !0
                        }).createIndex(cP.userMutationsIndex, cP.userMutationsKeyPath, {
                            unique: !0
                        }), a.createObjectStore(cQ.store);
                    })(a), d2(a), (function(a) {
                        a.createObjectStore(cT.store);
                    })(a));
                    let f = c3.resolve();
                    return (c < 3 && d >= 3 && (0 !== c && (!(function(a) {
                        a.deleteObjectStore(cW.store), a.deleteObjectStore(cV.store), a.deleteObjectStore(cX.store);
                    })(a), d2(a)), (f = f.next(()=>(function(a) {
                            const b = a.store(cX.store), c = new cX(0, 0, N.min().toTimestamp(), 0);
                            return b.put(cX.key, c);
                        })(e)))), c < 4 && d >= 4 && (0 !== c && (f = f.next(()=>(function(a, b) {
                            return b.store(cP.store).Lt().next((c)=>{
                                a.deleteObjectStore(cP.store);
                                a.createObjectStore(cP.store, {
                                    keyPath: cP.keyPath,
                                    autoIncrement: !0
                                }).createIndex(cP.userMutationsIndex, cP.userMutationsKeyPath, {
                                    unique: !0
                                });
                                const d = b.store(cP.store), e = c.map((a)=>d.put(a));
                                return c3.waitFor(e);
                            });
                        })(a, e))), (f = f.next(()=>{
                        !(function(a) {
                            a.createObjectStore(cZ.store, {
                                keyPath: cZ.keyPath
                            });
                        })(a);
                    }))), c < 5 && d >= 5 && (f = f.next(()=>this.Ce(e))), c < 6 && d >= 6 && (f = f.next(()=>((function(a) {
                            a.createObjectStore(cU.store);
                        })(a), this.Ne(e)))), c < 7 && d >= 7 && (f = f.next(()=>this.xe(e))), c < 8 && d >= 8 && (f = f.next(()=>this.ke(a, e))), c < 9 && d >= 9 && (f = f.next(()=>{
                        !(function(a) {
                            a.objectStoreNames.contains("remoteDocumentChanges") && a.deleteObjectStore("remoteDocumentChanges");
                        })(a), (function(a) {
                            const b = a.objectStore(cT.store);
                            b.createIndex(cT.readTimeIndex, cT.readTimeIndexPath, {
                                unique: !1
                            }), b.createIndex(cT.collectionReadTimeIndex, cT.collectionReadTimeIndexPath, {
                                unique: !1
                            });
                        })(b);
                    })), c < 10 && d >= 10 && (f = f.next(()=>this.$e(e))), c < 11 && d >= 11 && (f = f.next(()=>{
                        !(function(a) {
                            a.createObjectStore(c$.store, {
                                keyPath: c$.keyPath
                            });
                        })(a), (function(a) {
                            a.createObjectStore(c_.store, {
                                keyPath: c_.keyPath
                            });
                        })(a);
                    })), f);
                }
                Ne(a) {
                    let b = 0;
                    return a.store(cT.store).Kt((a, c)=>{
                        b += dE(c);
                    }).next(()=>{
                        const c = new cU(b);
                        return a.store(cU.store).put(cU.key, c);
                    });
                }
                Ce(a) {
                    const b = a.store(cO.store), c = a.store(cP.store);
                    return b.Lt().next((b)=>c3.forEach(b, (b)=>{
                            const d = IDBKeyRange.bound([
                                b.userId,
                                -1
                            ], [
                                b.userId,
                                b.lastAcknowledgedBatchId
                            ]);
                            return c.Lt(cP.userMutationsIndex, d).next((c)=>c3.forEach(c, (c)=>{
                                    u(c.userId === b.userId);
                                    const d = dq(this.N, c);
                                    return dD(a, b.userId, d).next(()=>{});
                                }));
                        }));
                }
                xe(a) {
                    const b = a.store(cW.store), c = a.store(cT.store);
                    return a.store(cX.store).get(cX.key).next((a)=>{
                        const d = [];
                        return c.Kt((c, e)=>{
                            const f = new S(c), g = (function(a) {
                                return [
                                    0,
                                    cI(a)
                                ];
                            })(f);
                            d.push(b.get(g).next((c)=>c ? c3.resolve() : ((c)=>b.put(new cW(0, cI(c), a.highestListenSequenceNumber)))(f)));
                        }).next(()=>c3.waitFor(d));
                    });
                }
                ke(a, b) {
                    a.createObjectStore(cY.store, {
                        keyPath: cY.keyPath
                    });
                    const c = b.store(cY.store), d = new dy(), e = (a)=>{
                        if (d.add(a)) {
                            const b = a.lastSegment(), e = a.popLast();
                            return c.put({
                                collectionId: b,
                                parent: cI(e)
                            });
                        }
                    };
                    return b.store(cT.store).Kt({
                        qt: !0
                    }, (a, b)=>{
                        const c = new S(a);
                        return e(c.popLast());
                    }).next(()=>b.store(cQ.store).Kt({
                            qt: !0
                        }, ([a, b, c], d)=>{
                            const f = cL(b);
                            return e(f.popLast());
                        }));
                }
                $e(a) {
                    const b = a.store(cV.store);
                    return b.Kt((a, c)=>{
                        const d = dr(c), e = ds(this.N, d);
                        return b.put(e);
                    });
                }
            }
            function d2(a) {
                a.createObjectStore(cW.store, {
                    keyPath: cW.keyPath
                }).createIndex(cW.documentTargetsIndex, cW.documentTargetsKeyPath, {
                    unique: !0
                });
                a.createObjectStore(cV.store, {
                    keyPath: cV.keyPath
                }).createIndex(cV.queryTargetsIndexName, cV.queryTargetsKeyPath, {
                    unique: !0
                }), a.createObjectStore(cX.store);
            }
            const d3 = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
            class d4 {
                constructor(a, b, c, d, e, f, g, h, i, j){
                    if (((this.allowTabSynchronization = a), (this.persistenceKey = b), (this.clientId = c), (this.Oe = e), (this.window = f), (this.document = g), (this.Fe = i), (this.Me = j), (this.Le = null), (this.Be = !1), (this.isPrimary = !1), (this.networkEnabled = !0), (this.Ue = null), (this.inForeground = !1), (this.qe = null), (this.Ke = null), (this.je = Number.NEGATIVE_INFINITY), (this.Qe = (a)=>Promise.resolve()), !d4.bt())) throw new y(x.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
                    (this.referenceDelegate = new dU(this, d)), (this.We = b + "main"), (this.N = new di(h)), (this.Ge = new c5(this.We, 11, new d1(this.N))), (this.ze = new dL(this.referenceDelegate, this.N)), (this.Ht = new dz()), (this.He = (function(a, b) {
                        return new dY(a, b);
                    })(this.N, this.Ht)), (this.Je = new du()), this.window && this.window.localStorage ? (this.Ye = this.window.localStorage) : ((this.Ye = null), !1 === j && q("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
                }
                start() {
                    return this.Xe().then(()=>{
                        if (!this.isPrimary && !this.allowTabSynchronization) throw new y(x.FAILED_PRECONDITION, d3);
                        return (this.Ze(), this.tn(), this.en(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (a)=>this.ze.getHighestSequenceNumber(a)));
                    }).then((a)=>{
                        this.Le = new G(a, this.Fe);
                    }).then(()=>{
                        this.Be = !0;
                    }).catch((a)=>(this.Ge && this.Ge.close(), Promise.reject(a)));
                }
                nn(a) {
                    return ((this.Qe = async (b)=>{
                        if (this.started) return a(b);
                    }), a(this.isPrimary));
                }
                setDatabaseDeletedListener(a) {
                    this.Ge.xt(async (b)=>{
                        null === b.newVersion && (await a());
                    });
                }
                setNetworkEnabled(a) {
                    this.networkEnabled !== a && ((this.networkEnabled = a), this.Oe.enqueueAndForget(async ()=>{
                        this.started && (await this.Xe());
                    }));
                }
                Xe() {
                    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (a)=>d6(a).put(new cZ(this.clientId, Date.now(), this.networkEnabled, this.inForeground)).next(()=>{
                            if (this.isPrimary) return this.sn(a).next((a)=>{
                                a || ((this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)));
                            });
                        }).next(()=>this.rn(a)).next((b)=>this.isPrimary && !b ? this.on(a).next(()=>!1) : !!b && this.cn(a).next(()=>!0))).catch((a)=>{
                        if (c8(a)) return (p("IndexedDbPersistence", "Failed to extend owner lease: ", a), this.isPrimary);
                        if (!this.allowTabSynchronization) throw a;
                        return (p("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", a), !1);
                    }).then((a)=>{
                        this.isPrimary !== a && this.Oe.enqueueRetryable(()=>this.Qe(a)), (this.isPrimary = a);
                    });
                }
                sn(a) {
                    return d5(a).get(cN.key).next((a)=>c3.resolve(this.an(a)));
                }
                un(a) {
                    return d6(a).delete(this.clientId);
                }
                async hn() {
                    if (this.isPrimary && !this.ln(this.je, 18e5)) {
                        this.je = Date.now();
                        const a = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (a)=>{
                            const b = de(a, cZ.store);
                            return b.Lt().next((a)=>{
                                const c = this.fn(a, 18e5), d = a.filter((a)=>-1 === c.indexOf(a));
                                return c3.forEach(d, (a)=>b.delete(a.clientId)).next(()=>d);
                            });
                        }).catch(()=>[]);
                        if (this.Ye) for (const b of a)this.Ye.removeItem(this.dn(b.clientId));
                    }
                }
                en() {
                    this.Ke = this.Oe.enqueueAfterDelay("client_metadata_refresh", 4e3, ()=>this.Xe().then(()=>this.hn()).then(()=>this.en()));
                }
                an(a) {
                    return !!a && a.ownerId === this.clientId;
                }
                rn(a) {
                    if (this.Me) return c3.resolve(!0);
                    return d5(a).get(cN.key).next((b)=>{
                        if (null !== b && this.ln(b.leaseTimestampMs, 5e3) && !this.wn(b.ownerId)) {
                            if (this.an(b) && this.networkEnabled) return !0;
                            if (!this.an(b)) {
                                if (!b.allowTabSynchronization) throw new y(x.FAILED_PRECONDITION, d3);
                                return !1;
                            }
                        }
                        return (!(!this.networkEnabled || !this.inForeground) || d6(a).Lt().next((a)=>void 0 === this.fn(a, 5e3).find((a)=>{
                                if (this.clientId !== a.clientId) {
                                    const b = !this.networkEnabled && a.networkEnabled, c = !this.inForeground && a.inForeground, d = this.networkEnabled === a.networkEnabled;
                                    if (b || (c && d)) return !0;
                                }
                                return !1;
                            })));
                    }).next((a)=>(this.isPrimary !== a && p("IndexedDbPersistence", `Client ${a ? "is" : "is not"} eligible for a primary lease.`), a));
                }
                async shutdown() {
                    (this.Be = !1), this._n(), this.Ke && (this.Ke.cancel(), (this.Ke = null)), this.mn(), this.gn(), await this.Ge.runTransaction("shutdown", "readwrite", [
                        cN.store,
                        cZ.store
                    ], (a)=>{
                        const b = new dd(a, G.T);
                        return this.on(b).next(()=>this.un(b));
                    }), this.Ge.close(), this.yn();
                }
                fn(a, b) {
                    return a.filter((a)=>this.ln(a.updateTimeMs, b) && !this.wn(a.clientId));
                }
                pn() {
                    return this.runTransaction("getActiveClients", "readonly", (a)=>d6(a).Lt().next((a)=>this.fn(a, 18e5).map((a)=>a.clientId)));
                }
                get started() {
                    return this.Be;
                }
                getMutationQueue(a) {
                    return dF.Yt(a, this.N, this.Ht, this.referenceDelegate);
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
                runTransaction(a, b, c) {
                    p("IndexedDbPersistence", "Starting transaction:", a);
                    const d = "readonly" === b ? "readonly" : "readwrite";
                    let e;
                    return this.Ge.runTransaction(a, d, c0, (d)=>((e = new dd(d, this.Le ? this.Le.next() : G.T)), "readwrite-primary" === b ? this.sn(e).next((a)=>!!a || this.rn(e)).next((b)=>{
                            if (!b) throw ((q(`Failed to obtain primary lease for action '${a}'.`), (this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)), new y(x.FAILED_PRECONDITION, c1)));
                            return c(e);
                        }).next((a)=>this.cn(e).next(()=>a)) : this.Tn(e).next(()=>c(e)))).then((a)=>(e.raiseOnCommittedEvent(), a));
                }
                Tn(a) {
                    return d5(a).get(cN.key).next((a)=>{
                        if (null !== a && this.ln(a.leaseTimestampMs, 5e3) && !this.wn(a.ownerId) && !this.an(a) && !(this.Me || (this.allowTabSynchronization && a.allowTabSynchronization))) throw new y(x.FAILED_PRECONDITION, d3);
                    });
                }
                cn(a) {
                    const b = new cN(this.clientId, this.allowTabSynchronization, Date.now());
                    return d5(a).put(cN.key, b);
                }
                static bt() {
                    return c5.bt();
                }
                on(a) {
                    const b = d5(a);
                    return b.get(cN.key).next((a)=>this.an(a) ? (p("IndexedDbPersistence", "Releasing primary lease."), b.delete(cN.key)) : c3.resolve());
                }
                ln(a, b) {
                    const c = Date.now();
                    return (!(a < c - b) && (!(a > c) || (q(`Detected an update time that is in the future: ${a} > ${c}`), !1)));
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
                    var a;
                    "function" == typeof (null === (a = this.window) || void 0 === a ? void 0 : a.addEventListener) && ((this.Ue = ()=>{
                        this._n(), isSafari() && navigator.appVersion.match("Version/14") && this.Oe.enterRestrictedMode(!0), this.Oe.enqueueAndForget(()=>this.shutdown());
                    }), this.window.addEventListener("pagehide", this.Ue));
                }
                gn() {
                    this.Ue && (this.window.removeEventListener("pagehide", this.Ue), (this.Ue = null));
                }
                wn(a) {
                    var b;
                    try {
                        const c = null !== (null === (b = this.Ye) || void 0 === b ? void 0 : b.getItem(this.dn(a)));
                        return (p("IndexedDbPersistence", `Client '${a}' ${c ? "is" : "is not"} zombied in LocalStorage`), c);
                    } catch (d) {
                        return (q("IndexedDbPersistence", "Failed to get zombied client id.", d), !1);
                    }
                }
                _n() {
                    if (this.Ye) try {
                        this.Ye.setItem(this.dn(this.clientId), String(Date.now()));
                    } catch (a) {
                        q("Failed to set zombie client id.", a);
                    }
                }
                yn() {
                    if (this.Ye) try {
                        this.Ye.removeItem(this.dn(this.clientId));
                    } catch (a) {}
                }
                dn(a) {
                    return `firestore_zombie_${this.persistenceKey}_${a}`;
                }
            }
            function d5(a) {
                return de(a, cN.store);
            }
            function d6(a) {
                return de(a, cZ.store);
            }
            function d7(a, b) {
                let c = a.projectId;
                return (a.isDefaultDatabase || (c += "." + a.database), "firestore/" + b + "/" + c + "/");
            }
            class d8 {
                constructor(a, b){
                    (this.progress = a), (this.En = b);
                }
            }
            class d9 {
                constructor(a, b, c){
                    (this.He = a), (this.In = b), (this.Ht = c);
                }
                An(a, b) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(a, b).next((c)=>this.Rn(a, b, c));
                }
                Rn(a, b, c) {
                    return this.He.getEntry(a, b).next((a)=>{
                        for (const b of c)b.applyToLocalView(a);
                        return a;
                    });
                }
                bn(a, b) {
                    a.forEach((a, c)=>{
                        for (const d of b)d.applyToLocalView(c);
                    });
                }
                Pn(a, b) {
                    return this.He.getEntries(a, b).next((b)=>this.vn(a, b).next(()=>b));
                }
                vn(a, b) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(a, b).next((a)=>this.bn(b, a));
                }
                getDocumentsMatchingQuery(a, b, c) {
                    return (function(a) {
                        return (ag.isDocumentKey(a.path) && null === a.collectionGroup && 0 === a.filters.length);
                    })(b) ? this.Vn(a, b.path) : a_(b) ? this.Sn(a, b, c) : this.Dn(a, b, c);
                }
                Vn(a, b) {
                    return this.An(a, new ag(b)).next((a)=>{
                        let b = bT();
                        return (a.isFoundDocument() && (b = b.insert(a.key, a)), b);
                    });
                }
                Sn(a, b, c) {
                    const d = b.collectionGroup;
                    let e = bT();
                    return this.Ht.getCollectionParents(a, d).next((f)=>c3.forEach(f, (f)=>{
                            const g = (function(a, b) {
                                return new aU(b, null, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, a.startAt, a.endAt);
                            })(b, f.child(d));
                            return this.Dn(a, g, c).next((a)=>{
                                a.forEach((a, b)=>{
                                    e = e.insert(a, b);
                                });
                            });
                        }).next(()=>e));
                }
                Dn(a, b, c) {
                    let d, e;
                    return this.He.getDocumentsMatchingQuery(a, b, c).next((c)=>((d = c), this.In.getAllMutationBatchesAffectingQuery(a, b))).next((b)=>((e = b), this.Cn(a, e, d).next((a)=>{
                            d = a;
                            for (const b of e)for (const c of b.mutations){
                                const f = c.key;
                                let g = d.get(f);
                                null == g && ((g = ax.newInvalidDocument(f)), (d = d.insert(f, g))), bv(c, g, b.localWriteTime), g.isFoundDocument() || (d = d.remove(f));
                            }
                        }))).next(()=>(d.forEach((a, c)=>{
                            a6(b, c) || (d = d.remove(a));
                        }), d));
                }
                Cn(a, b, c) {
                    let d = bX();
                    for (const e of b)for (const f of e.mutations)f instanceof bA && null === c.get(f.key) && (d = d.add(f.key));
                    let g = c;
                    return this.He.getEntries(a, d).next((a)=>(a.forEach((a, b)=>{
                            b.isFoundDocument() && (g = g.insert(a, b));
                        }), g));
                }
            }
            class ea {
                constructor(a, b, c, d){
                    (this.targetId = a), (this.fromCache = b), (this.Nn = c), (this.xn = d);
                }
                static kn(a, b) {
                    let c = bX(), d = bX();
                    for (const e of b.docChanges)switch(e.type){
                        case 0:
                            c = c.add(e.doc.key);
                            break;
                        case 1:
                            d = d.add(e.doc.key);
                    }
                    return new ea(a, b.fromCache, c, d);
                }
            }
            class eb {
                $n(a) {
                    this.On = a;
                }
                getDocumentsMatchingQuery(a, b, c, d) {
                    return (function(a) {
                        return (0 === a.filters.length && null === a.limit && null == a.startAt && null == a.endAt && (0 === a.explicitOrderBy.length || (1 === a.explicitOrderBy.length && a.explicitOrderBy[0].field.isKeyField())));
                    })(b) || c.isEqual(N.min()) ? this.Fn(a, b) : this.On.Pn(a, d).next((e)=>{
                        const g = this.Mn(b, e);
                        return (aX(b) || aY(b)) && this.Ln(b.limitType, g, d, c) ? this.Fn(a, b) : (n() <= f["in"].DEBUG && p("QueryEngine", "Re-using previous result from %s to execute query: %s", c.toString(), a5(b)), this.On.getDocumentsMatchingQuery(a, b, c).next((a)=>(g.forEach((b)=>{
                                a = a.insert(b.key, b);
                            }), a)));
                    });
                }
                Mn(a, b) {
                    let c = new bO(a7(a));
                    return (b.forEach((b, d)=>{
                        a6(a, d) && (c = c.add(d));
                    }), c);
                }
                Ln(a, b, c, d) {
                    if (c.size !== b.size) return !0;
                    const e = "F" === a ? b.last() : b.first();
                    return (!!e && (e.hasPendingWrites || e.version.compareTo(d) > 0));
                }
                Fn(a, b) {
                    return (n() <= f["in"].DEBUG && p("QueryEngine", "Using full collection scan to execute query:", a5(b)), this.On.getDocumentsMatchingQuery(a, b, N.min()));
                }
            }
            class ec {
                constructor(a, b, c, d){
                    (this.persistence = a), (this.Bn = b), (this.N = d), (this.Un = new bL(J)), (this.qn = new dW((a)=>aA(a), aC)), (this.Kn = N.min()), (this.In = a.getMutationQueue(c)), (this.jn = a.getRemoteDocumentCache()), (this.ze = a.getTargetCache()), (this.Qn = new d9(this.jn, this.In, this.persistence.getIndexManager())), (this.Je = a.getBundleCache()), this.Bn.$n(this.Qn);
                }
                collectGarbage(a) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (b)=>a.collect(b, this.Un));
                }
            }
            function ed(a, b, c, d) {
                return new ec(a, b, c, d);
            }
            async function ee(a, b) {
                const c = w(a);
                let d = c.In, e = c.Qn;
                const f = await c.persistence.runTransaction("Handle user change", "readonly", (a)=>{
                    let f;
                    return c.In.getAllMutationBatches(a).next((g)=>((f = g), (d = c.persistence.getMutationQueue(b)), (e = new d9(c.jn, d, c.persistence.getIndexManager())), d.getAllMutationBatches(a))).next((b)=>{
                        const c = [], d = [];
                        let g = bX();
                        for (const h of f){
                            c.push(h.batchId);
                            for (const i of h.mutations)g = g.add(i.key);
                        }
                        for (const j of b){
                            d.push(j.batchId);
                            for (const k of j.mutations)g = g.add(k.key);
                        }
                        return e.Pn(a, g).next((a)=>({
                                Wn: a,
                                removedBatchIds: c,
                                addedBatchIds: d
                            }));
                    });
                });
                return (c.In = d), (c.Qn = e), c.Bn.$n(c.Qn), f;
            }
            function ef(a, b) {
                const c = w(a);
                return c.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (a)=>{
                    const d = b.batch.keys(), e = c.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    return (function(a, b, c, d) {
                        const e = c.batch, f = e.keys();
                        let g = c3.resolve();
                        return (f.forEach((a)=>{
                            g = g.next(()=>d.getEntry(b, a)).next((b)=>{
                                const f = c.docVersions.get(a);
                                u(null !== f), b.version.compareTo(f) < 0 && (e.applyToRemoteDocument(b, c), b.isValidDocument() && d.addEntry(b, c.commitVersion));
                            });
                        }), g.next(()=>a.In.removeMutationBatch(b, e)));
                    })(c, a, b, e).next(()=>e.apply(a)).next(()=>c.In.performConsistencyCheck(a)).next(()=>c.Qn.Pn(a, d));
                });
            }
            function eg(a) {
                const b = w(a);
                return b.persistence.runTransaction("Get last remote snapshot version", "readonly", (a)=>b.ze.getLastRemoteSnapshotVersion(a));
            }
            function eh(a, b) {
                const c = w(a), d = b.snapshotVersion;
                let e = c.Un;
                return c.persistence.runTransaction("Apply remote event", "readwrite-primary", (a)=>{
                    const f = c.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    e = c.Un;
                    const g = [];
                    b.targetChanges.forEach((b, f)=>{
                        const h = e.get(f);
                        if (!h) return;
                        g.push(c.ze.removeMatchingKeys(a, b.removedDocuments, f).next(()=>c.ze.addMatchingKeys(a, b.addedDocuments, f)));
                        const i = b.resumeToken;
                        if (i.approximateByteSize() > 0) {
                            const j = h.withResumeToken(i, d).withSequenceNumber(a.currentSequenceNumber);
                            (e = e.insert(f, j)), (function(a, b, c) {
                                if ((u(b.resumeToken.approximateByteSize() > 0), 0 === a.resumeToken.approximateByteSize())) return !0;
                                if (b.snapshotVersion.toMicroseconds() - a.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                                return (c.addedDocuments.size + c.modifiedDocuments.size + c.removedDocuments.size > 0);
                            })(h, j, b) && g.push(c.ze.updateTargetData(a, j));
                        }
                    });
                    let h = bR();
                    if ((b.documentUpdates.forEach((d, e)=>{
                        b.resolvedLimboDocuments.has(d) && g.push(c.persistence.referenceDelegate.updateLimboDocument(a, d));
                    }), g.push(ei(a, f, b.documentUpdates, d, void 0).next((a)=>{
                        h = a;
                    })), !d.isEqual(N.min()))) {
                        const i = c.ze.getLastRemoteSnapshotVersion(a).next((b)=>c.ze.setTargetsMetadata(a, a.currentSequenceNumber, d));
                        g.push(i);
                    }
                    return c3.waitFor(g).next(()=>f.apply(a)).next(()=>c.Qn.vn(a, h)).next(()=>h);
                }).then((a)=>((c.Un = e), a));
            }
            function ei(a, b, c, d, e) {
                let f = bX();
                return (c.forEach((a)=>(f = f.add(a))), b.getEntries(a, f).next((a)=>{
                    let f = bR();
                    return (c.forEach((c, g)=>{
                        const h = a.get(c), i = (null == e ? void 0 : e.get(c)) || d;
                        g.isNoDocument() && g.version.isEqual(N.min()) ? (b.removeEntry(c, i), (f = f.insert(c, g))) : !h.isValidDocument() || g.version.compareTo(h.version) > 0 || (0 === g.version.compareTo(h.version) && h.hasPendingWrites) ? (b.addEntry(g, i), (f = f.insert(c, g))) : p("LocalStore", "Ignoring outdated watch update for ", c, ". Current version:", h.version, " Watch version:", g.version);
                    }), f);
                }));
            }
            function ej(a, b) {
                const c = w(a);
                return c.persistence.runTransaction("Get next mutation batch", "readonly", (a)=>(void 0 === b && (b = -1), c.In.getNextMutationBatchAfterBatchId(a, b)));
            }
            function ek(a, b) {
                const c = w(a);
                return c.persistence.runTransaction("Allocate target", "readwrite", (a)=>{
                    let d;
                    return c.ze.getTargetData(a, b).next((e)=>e ? ((d = e), c3.resolve(d)) : c.ze.allocateTargetId(a).next((e)=>((d = new dh(b, e, 0, a.currentSequenceNumber)), c.ze.addTargetData(a, d).next(()=>d))));
                }).then((a)=>{
                    const d = c.Un.get(a.targetId);
                    return ((null === d || a.snapshotVersion.compareTo(d.snapshotVersion) > 0) && ((c.Un = c.Un.insert(a.targetId, a)), c.qn.set(b, a.targetId)), a);
                });
            }
            async function el(a, b, c) {
                const d = w(a), e = d.Un.get(b), f = c ? "readwrite" : "readwrite-primary";
                try {
                    c || (await d.persistence.runTransaction("Release target", f, (a)=>d.persistence.referenceDelegate.removeTarget(a, e)));
                } catch (g) {
                    if (!c8(g)) throw g;
                    p("LocalStore", `Failed to update sequence numbers for target ${b}: ${g}`);
                }
                (d.Un = d.Un.remove(b)), d.qn.delete(e.target);
            }
            function em(a, b, c) {
                const d = w(a);
                let e = N.min(), f = bX();
                return d.persistence.runTransaction("Execute query", "readonly", (a)=>(function(a, b, c) {
                        const d = w(a), e = d.qn.get(c);
                        return void 0 !== e ? c3.resolve(d.Un.get(e)) : d.ze.getTargetData(b, c);
                    })(d, a, a1(b)).next((b)=>{
                        if (b) return ((e = b.lastLimboFreeSnapshotVersion), d.ze.getMatchingKeysForTargetId(a, b.targetId).next((a)=>{
                            f = a;
                        }));
                    }).next(()=>d.Bn.getDocumentsMatchingQuery(a, b, c ? e : N.min(), c ? f : bX())).next((a)=>({
                            documents: a,
                            Gn: f
                        })));
            }
            function en(a, b) {
                const c = w(a), d = w(c.ze), e = c.Un.get(b);
                return e ? Promise.resolve(e.target) : c.persistence.runTransaction("Get target data", "readonly", (a)=>d.Tt(a, b).next((a)=>(a ? a.target : null)));
            }
            function eo(a) {
                const b = w(a);
                return b.persistence.runTransaction("Get new document changes", "readonly", (a)=>(function(a, b, c) {
                        const d = w(a);
                        let e = bR(), f = dl(c);
                        const g = d_(b), h = IDBKeyRange.lowerBound(f, !0);
                        return g.Kt({
                            index: cT.readTimeIndex,
                            range: h
                        }, (a, b)=>{
                            const c = dj(d.N, b);
                            (e = e.insert(c.key, c)), (f = b.readTime);
                        }).next(()=>({
                                En: e,
                                readTime: dm(f)
                            }));
                    })(b.jn, a, b.Kn)).then(({ En: a , readTime: c  })=>((b.Kn = c), a));
            }
            async function ep(a) {
                const b = w(a);
                return b.persistence.runTransaction("Synchronize last document change read time", "readonly", (a)=>(function(a) {
                        const b = d_(a);
                        let c = N.min();
                        return b.Kt({
                            index: cT.readTimeIndex,
                            reverse: !0
                        }, (a, b, d)=>{
                            b.readTime && (c = dm(b.readTime)), d.done();
                        }).next(()=>c);
                    })(a)).then((a)=>{
                    b.Kn = a;
                });
            }
            async function eq(a, b, c, d) {
                const e = w(a);
                let f = bX(), g = bR(), h = bV();
                for (const i of c){
                    const j = b.zn(i.metadata.name);
                    i.document && (f = f.add(j)), (g = g.insert(j, b.Hn(i))), (h = h.insert(j, b.Jn(i.metadata.readTime)));
                }
                const k = e.jn.newChangeBuffer({
                    trackRemovals: !0
                }), l = await ek(e, (function(a) {
                    return a1(aW(S.fromString(`__bundle__/docs/${a}`)));
                })(d));
                return e.persistence.runTransaction("Apply bundle documents", "readwrite", (a)=>ei(a, k, g, N.min(), h).next((b)=>(k.apply(a), b)).next((b)=>e.ze.removeMatchingKeysForTargetId(a, l.targetId).next(()=>e.ze.addMatchingKeys(a, f, l.targetId)).next(()=>e.Qn.vn(a, b)).next(()=>b)));
            }
            async function er(a, b, c = bX()) {
                const d = await ek(a, a1(dt(b.bundledQuery))), e = w(a);
                return e.persistence.runTransaction("Save named query", "readwrite", (a)=>{
                    const f = cd(b.readTime);
                    if (d.snapshotVersion.compareTo(f) >= 0) return e.Je.saveNamedQuery(a, b);
                    const g = d.withResumeToken(X.EMPTY_BYTE_STRING, f);
                    return ((e.Un = e.Un.insert(g.targetId, g)), e.ze.updateTargetData(a, g).next(()=>e.ze.removeMatchingKeysForTargetId(a, d.targetId)).next(()=>e.ze.addMatchingKeys(a, c, d.targetId)).next(()=>e.Je.saveNamedQuery(a, b)));
                });
            }
            class es {
                constructor(a){
                    (this.N = a), (this.Yn = new Map()), (this.Xn = new Map());
                }
                getBundleMetadata(a, b) {
                    return c3.resolve(this.Yn.get(b));
                }
                saveBundleMetadata(a, b) {
                    var c;
                    return (this.Yn.set(b.id, {
                        id: (c = b).id,
                        version: c.version,
                        createTime: cd(c.createTime)
                    }), c3.resolve());
                }
                getNamedQuery(a, b) {
                    return c3.resolve(this.Xn.get(b));
                }
                saveNamedQuery(a, b) {
                    return (this.Xn.set(b.name, (function(a) {
                        return {
                            name: a.name,
                            query: dt(a.bundledQuery),
                            readTime: cd(a.readTime)
                        };
                    })(b)), c3.resolve());
                }
            }
            class et {
                constructor(){
                    (this.Zn = new bO(eu.ts)), (this.es = new bO(eu.ns));
                }
                isEmpty() {
                    return this.Zn.isEmpty();
                }
                addReference(a, b) {
                    const c = new eu(a, b);
                    (this.Zn = this.Zn.add(c)), (this.es = this.es.add(c));
                }
                ss(a, b) {
                    a.forEach((a)=>this.addReference(a, b));
                }
                removeReference(a, b) {
                    this.rs(new eu(a, b));
                }
                os(a, b) {
                    a.forEach((a)=>this.removeReference(a, b));
                }
                cs(a) {
                    const b = new ag(new S([])), c = new eu(b, a), d = new eu(b, a + 1), e = [];
                    return (this.es.forEachInRange([
                        c,
                        d
                    ], (a)=>{
                        this.rs(a), e.push(a.key);
                    }), e);
                }
                us() {
                    this.Zn.forEach((a)=>this.rs(a));
                }
                rs(a) {
                    (this.Zn = this.Zn.delete(a)), (this.es = this.es.delete(a));
                }
                hs(a) {
                    const b = new ag(new S([])), c = new eu(b, a), d = new eu(b, a + 1);
                    let e = bX();
                    return (this.es.forEachInRange([
                        c,
                        d
                    ], (a)=>{
                        e = e.add(a.key);
                    }), e);
                }
                containsKey(a) {
                    const b = new eu(a, 0), c = this.Zn.firstAfterOrEqual(b);
                    return null !== c && a.isEqual(c.key);
                }
            }
            class eu {
                constructor(a, b){
                    (this.key = a), (this.ls = b);
                }
                static ts(a, b) {
                    return ag.comparator(a.key, b.key) || J(a.ls, b.ls);
                }
                static ns(a, b) {
                    return J(a.ls, b.ls) || ag.comparator(a.key, b.key);
                }
            }
            class ev {
                constructor(a, b){
                    (this.Ht = a), (this.referenceDelegate = b), (this.In = []), (this.fs = 1), (this.ds = new bO(eu.ts));
                }
                checkEmpty(a) {
                    return c3.resolve(0 === this.In.length);
                }
                addMutationBatch(a, b, c, d) {
                    const e = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const f = new df(e, b, c, d);
                    this.In.push(f);
                    for (const g of d)(this.ds = this.ds.add(new eu(g.key, e))), this.Ht.addToCollectionParentIndex(a, g.key.path.popLast());
                    return c3.resolve(f);
                }
                lookupMutationBatch(a, b) {
                    return c3.resolve(this.ws(b));
                }
                getNextMutationBatchAfterBatchId(a, b) {
                    const c = b + 1, d = this._s(c), e = d < 0 ? 0 : d;
                    return c3.resolve(this.In.length > e ? this.In[e] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return c3.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(a) {
                    return c3.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(a, b) {
                    const c = new eu(b, 0), d = new eu(b, Number.POSITIVE_INFINITY), e = [];
                    return (this.ds.forEachInRange([
                        c,
                        d
                    ], (a)=>{
                        const b = this.ws(a.ls);
                        e.push(b);
                    }), c3.resolve(e));
                }
                getAllMutationBatchesAffectingDocumentKeys(a, b) {
                    let c = new bO(J);
                    return (b.forEach((a)=>{
                        const b = new eu(a, 0), d = new eu(a, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            b,
                            d
                        ], (a)=>{
                            c = c.add(a.ls);
                        });
                    }), c3.resolve(this.gs(c)));
                }
                getAllMutationBatchesAffectingQuery(a, b) {
                    const c = b.path, d = c.length + 1;
                    let e = c;
                    ag.isDocumentKey(e) || (e = e.child(""));
                    const f = new eu(new ag(e), 0);
                    let g = new bO(J);
                    return (this.ds.forEachWhile((a)=>{
                        const b = a.key.path;
                        return (!!c.isPrefixOf(b) && (b.length === d && (g = g.add(a.ls)), !0));
                    }, f), c3.resolve(this.gs(g)));
                }
                gs(a) {
                    const b = [];
                    return (a.forEach((a)=>{
                        const c = this.ws(a);
                        null !== c && b.push(c);
                    }), b);
                }
                removeMutationBatch(a, b) {
                    u(0 === this.ys(b.batchId, "removed")), this.In.shift();
                    let c = this.ds;
                    return c3.forEach(b.mutations, (d)=>{
                        const e = new eu(d.key, b.batchId);
                        return ((c = c.delete(e)), this.referenceDelegate.markPotentiallyOrphaned(a, d.key));
                    }).next(()=>{
                        this.ds = c;
                    });
                }
                te(a) {}
                containsKey(a, b) {
                    const c = new eu(b, 0), d = this.ds.firstAfterOrEqual(c);
                    return c3.resolve(b.isEqual(d && d.key));
                }
                performConsistencyCheck(a) {
                    return this.In.length, c3.resolve();
                }
                ys(a, b) {
                    return this._s(a);
                }
                _s(a) {
                    if (0 === this.In.length) return 0;
                    return a - this.In[0].batchId;
                }
                ws(a) {
                    const b = this._s(a);
                    if (b < 0 || b >= this.In.length) return null;
                    return this.In[b];
                }
            }
            class ew {
                constructor(a, b){
                    (this.Ht = a), (this.ps = b), (this.docs = new bL(ag.comparator)), (this.size = 0);
                }
                addEntry(a, b, c) {
                    const d = b.key, e = this.docs.get(d), f = e ? e.size : 0, g = this.ps(b);
                    return ((this.docs = this.docs.insert(d, {
                        document: b.clone(),
                        size: g,
                        readTime: c
                    })), (this.size += g - f), this.Ht.addToCollectionParentIndex(a, d.path.popLast()));
                }
                removeEntry(a) {
                    const b = this.docs.get(a);
                    b && ((this.docs = this.docs.remove(a)), (this.size -= b.size));
                }
                getEntry(a, b) {
                    const c = this.docs.get(b);
                    return c3.resolve(c ? c.document.clone() : ax.newInvalidDocument(b));
                }
                getEntries(a, b) {
                    let c = bR();
                    return (b.forEach((a)=>{
                        const b = this.docs.get(a);
                        c = c.insert(a, b ? b.document.clone() : ax.newInvalidDocument(a));
                    }), c3.resolve(c));
                }
                getDocumentsMatchingQuery(a, b, c) {
                    let d = bR();
                    const e = new ag(b.path.child("")), f = this.docs.getIteratorFrom(e);
                    for(; f.hasNext();){
                        const { key: g , value: { document: h , readTime: i  } ,  } = f.getNext();
                        if (!b.path.isPrefixOf(g.path)) break;
                        i.compareTo(c) <= 0 || (a6(b, h) && (d = d.insert(h.key, h.clone())));
                    }
                    return c3.resolve(d);
                }
                Ts(a, b) {
                    return c3.forEach(this.docs, (a)=>b(a));
                }
                newChangeBuffer(a) {
                    return new ex(this);
                }
                getSize(a) {
                    return c3.resolve(this.size);
                }
            }
            class ex extends dX {
                constructor(a){
                    super(), (this.Se = a);
                }
                applyChanges(a) {
                    const b = [];
                    return (this.changes.forEach((c, d)=>{
                        d.document.isValidDocument() ? b.push(this.Se.addEntry(a, d.document, this.getReadTime(c))) : this.Se.removeEntry(c);
                    }), c3.waitFor(b));
                }
                getFromCache(a, b) {
                    return this.Se.getEntry(a, b);
                }
                getAllFromCache(a, b) {
                    return this.Se.getEntries(a, b);
                }
            }
            class ey {
                constructor(a){
                    (this.persistence = a), (this.Es = new dW((a)=>aA(a), aC)), (this.lastRemoteSnapshotVersion = N.min()), (this.highestTargetId = 0), (this.Is = 0), (this.As = new et()), (this.targetCount = 0), (this.Rs = dK.se());
                }
                forEachTarget(a, b) {
                    return this.Es.forEach((a, c)=>b(c)), c3.resolve();
                }
                getLastRemoteSnapshotVersion(a) {
                    return c3.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(a) {
                    return c3.resolve(this.Is);
                }
                allocateTargetId(a) {
                    return ((this.highestTargetId = this.Rs.next()), c3.resolve(this.highestTargetId));
                }
                setTargetsMetadata(a, b, c) {
                    return (c && (this.lastRemoteSnapshotVersion = c), b > this.Is && (this.Is = b), c3.resolve());
                }
                ce(a) {
                    this.Es.set(a.target, a);
                    const b = a.targetId;
                    b > this.highestTargetId && ((this.Rs = new dK(b)), (this.highestTargetId = b)), a.sequenceNumber > this.Is && (this.Is = a.sequenceNumber);
                }
                addTargetData(a, b) {
                    return (this.ce(b), (this.targetCount += 1), c3.resolve());
                }
                updateTargetData(a, b) {
                    return this.ce(b), c3.resolve();
                }
                removeTargetData(a, b) {
                    return (this.Es.delete(b.target), this.As.cs(b.targetId), (this.targetCount -= 1), c3.resolve());
                }
                removeTargets(a, b, c) {
                    let d = 0;
                    const e = [];
                    return (this.Es.forEach((f, g)=>{
                        g.sequenceNumber <= b && null === c.get(g.targetId) && (this.Es.delete(f), e.push(this.removeMatchingKeysForTargetId(a, g.targetId)), d++);
                    }), c3.waitFor(e).next(()=>d));
                }
                getTargetCount(a) {
                    return c3.resolve(this.targetCount);
                }
                getTargetData(a, b) {
                    const c = this.Es.get(b) || null;
                    return c3.resolve(c);
                }
                addMatchingKeys(a, b, c) {
                    return this.As.ss(b, c), c3.resolve();
                }
                removeMatchingKeys(a, b, c) {
                    this.As.os(b, c);
                    const d = this.persistence.referenceDelegate, e = [];
                    return (d && b.forEach((b)=>{
                        e.push(d.markPotentiallyOrphaned(a, b));
                    }), c3.waitFor(e));
                }
                removeMatchingKeysForTargetId(a, b) {
                    return this.As.cs(b), c3.resolve();
                }
                getMatchingKeysForTargetId(a, b) {
                    const c = this.As.hs(b);
                    return c3.resolve(c);
                }
                containsKey(a, b) {
                    return c3.resolve(this.As.containsKey(b));
                }
            }
            class ez {
                constructor(a, b){
                    (this.bs = {}), (this.Le = new G(0)), (this.Be = !1), (this.Be = !0), (this.referenceDelegate = a(this)), (this.ze = new ey(this));
                    (this.Ht = new dx()), (this.He = (function(a, b) {
                        return new ew(a, b);
                    })(this.Ht, (a)=>this.referenceDelegate.Ps(a))), (this.N = new di(b)), (this.Je = new es(this.N));
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
                getMutationQueue(a) {
                    let b = this.bs[a.toKey()];
                    return (b || ((b = new ev(this.Ht, this.referenceDelegate)), (this.bs[a.toKey()] = b)), b);
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
                runTransaction(a, b, c) {
                    p("MemoryPersistence", "Starting transaction:", a);
                    const d = new eA(this.Le.next());
                    return (this.referenceDelegate.vs(), c(d).next((a)=>this.referenceDelegate.Vs(d).next(()=>a)).toPromise().then((a)=>(d.raiseOnCommittedEvent(), a)));
                }
                Ss(a, b) {
                    return c3.or(Object.values(this.bs).map((c)=>()=>c.containsKey(a, b)));
                }
            }
            class eA extends c2 {
                constructor(a){
                    super(), (this.currentSequenceNumber = a);
                }
            }
            class eB {
                constructor(a){
                    (this.persistence = a), (this.Ds = new et()), (this.Cs = null);
                }
                static Ns(a) {
                    return new eB(a);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw t();
                }
                addReference(a, b, c) {
                    return (this.Ds.addReference(c, b), this.xs.delete(c.toString()), c3.resolve());
                }
                removeReference(a, b, c) {
                    return (this.Ds.removeReference(c, b), this.xs.add(c.toString()), c3.resolve());
                }
                markPotentiallyOrphaned(a, b) {
                    return this.xs.add(b.toString()), c3.resolve();
                }
                removeTarget(a, b) {
                    this.Ds.cs(b.targetId).forEach((a)=>this.xs.add(a.toString()));
                    const c = this.persistence.getTargetCache();
                    return c.getMatchingKeysForTargetId(a, b.targetId).next((a)=>{
                        a.forEach((a)=>this.xs.add(a.toString()));
                    }).next(()=>c.removeTargetData(a, b));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(a) {
                    const b = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return c3.forEach(this.xs, (c)=>{
                        const d = ag.fromPath(c);
                        return this.ks(a, d).next((a)=>{
                            a || b.removeEntry(d);
                        });
                    }).next(()=>((this.Cs = null), b.apply(a)));
                }
                updateLimboDocument(a, b) {
                    return this.ks(a, b).next((a)=>{
                        a ? this.xs.delete(b.toString()) : this.xs.add(b.toString());
                    });
                }
                Ps(a) {
                    return 0;
                }
                ks(a, b) {
                    return c3.or([
                        ()=>c3.resolve(this.Ds.containsKey(b)),
                        ()=>this.persistence.getTargetCache().containsKey(a, b),
                        ()=>this.persistence.Ss(a, b), 
                    ]);
                }
            }
            function eC(a, b) {
                return `firestore_clients_${a}_${b}`;
            }
            function eD(a, b, c) {
                let d = `firestore_mutations_${a}_${c}`;
                return b.isAuthenticated() && (d += `_${b.uid}`), d;
            }
            function eE(a, b) {
                return `firestore_targets_${a}_${b}`;
            }
            class eF {
                constructor(a, b, c, d){
                    (this.user = a), (this.batchId = b), (this.state = c), (this.error = d);
                }
                static $s(a, b, c) {
                    const d = JSON.parse(c);
                    let e, f = "object" == typeof d && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected", 
                    ].indexOf(d.state) && (void 0 === d.error || "object" == typeof d.error);
                    return (f && d.error && ((f = "string" == typeof d.error.message && "string" == typeof d.error.code), f && (e = new y(d.error.code, d.error.message))), f ? new eF(a, b, d.state, e) : (q("SharedClientState", `Failed to parse mutation state for ID '${b}': ${c}`), null));
                }
                Os() {
                    const a = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (a.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(a));
                }
            }
            class eG {
                constructor(a, b, c){
                    (this.targetId = a), (this.state = b), (this.error = c);
                }
                static $s(a, b) {
                    const c = JSON.parse(b);
                    let d, e = "object" == typeof c && -1 !== [
                        "not-current",
                        "current",
                        "rejected", 
                    ].indexOf(c.state) && (void 0 === c.error || "object" == typeof c.error);
                    return (e && c.error && ((e = "string" == typeof c.error.message && "string" == typeof c.error.code), e && (d = new y(c.error.code, c.error.message))), e ? new eG(a, c.state, d) : (q("SharedClientState", `Failed to parse target state for ID '${a}': ${b}`), null));
                }
                Os() {
                    const a = {
                        state: this.state,
                        updateTimeMs: Date.now()
                    };
                    return (this.error && (a.error = {
                        code: this.error.code,
                        message: this.error.message
                    }), JSON.stringify(a));
                }
            }
            class eH {
                constructor(a, b){
                    (this.clientId = a), (this.activeTargetIds = b);
                }
                static $s(a, b) {
                    const c = JSON.parse(b);
                    let d = "object" == typeof c && c.activeTargetIds instanceof Array, e = bZ();
                    for(let f = 0; d && f < c.activeTargetIds.length; ++f)(d = af(c.activeTargetIds[f])), (e = e.add(c.activeTargetIds[f]));
                    return d ? new eH(a, e) : (q("SharedClientState", `Failed to parse client data for instance '${a}': ${b}`), null);
                }
            }
            class eI {
                constructor(a, b){
                    (this.clientId = a), (this.onlineState = b);
                }
                static $s(a) {
                    const b = JSON.parse(a);
                    return "object" == typeof b && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(b.onlineState) && "string" == typeof b.clientId ? new eI(b.clientId, b.onlineState) : (q("SharedClientState", `Failed to parse online state: ${a}`), null);
                }
            }
            class eJ {
                constructor(){
                    this.activeTargetIds = bZ();
                }
                Fs(a) {
                    this.activeTargetIds = this.activeTargetIds.add(a);
                }
                Ms(a) {
                    this.activeTargetIds = this.activeTargetIds.delete(a);
                }
                Os() {
                    const a = {
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    };
                    return JSON.stringify(a);
                }
            }
            class eK {
                constructor(a, b, c, d, e){
                    (this.window = a), (this.Oe = b), (this.persistenceKey = c), (this.Ls = d), (this.syncEngine = null), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null), (this.Bs = this.Us.bind(this)), (this.qs = new bL(J)), (this.started = !1), (this.Ks = []);
                    const f = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    (this.storage = this.window.localStorage), (this.currentUser = e), (this.js = eC(this.persistenceKey, this.Ls)), (this.Qs = (function(a) {
                        return `firestore_sequence_number_${a}`;
                    })(this.persistenceKey)), (this.qs = this.qs.insert(this.Ls, new eJ())), (this.Ws = new RegExp(`^firestore_clients_${f}_([^_]*)$`)), (this.Gs = new RegExp(`^firestore_mutations_${f}_(\\d+)(?:_(.*))?$`)), (this.zs = new RegExp(`^firestore_targets_${f}_(\\d+)$`)), (this.Hs = (function(a) {
                        return `firestore_online_state_${a}`;
                    })(this.persistenceKey)), (this.Js = (function(a) {
                        return `firestore_bundle_loaded_${a}`;
                    })(this.persistenceKey)), this.window.addEventListener("storage", this.Bs);
                }
                static bt(a) {
                    return !(!a || !a.localStorage);
                }
                async start() {
                    const a = await this.syncEngine.pn();
                    for (const b of a){
                        if (b === this.Ls) continue;
                        const c = this.getItem(eC(this.persistenceKey, b));
                        if (c) {
                            const d = eH.$s(b, c);
                            d && (this.qs = this.qs.insert(d.clientId, d));
                        }
                    }
                    this.Ys();
                    const e = this.storage.getItem(this.Hs);
                    if (e) {
                        const f = this.Xs(e);
                        f && this.Zs(f);
                    }
                    for (const g of this.Ks)this.Us(g);
                    (this.Ks = []), this.window.addEventListener("pagehide", ()=>this.shutdown()), (this.started = !0);
                }
                writeSequenceNumber(a) {
                    this.setItem(this.Qs, JSON.stringify(a));
                }
                getAllActiveQueryTargets() {
                    return this.ti(this.qs);
                }
                isActiveQueryTarget(a) {
                    let b = !1;
                    return (this.qs.forEach((c, d)=>{
                        d.activeTargetIds.has(a) && (b = !0);
                    }), b);
                }
                addPendingMutation(a) {
                    this.ei(a, "pending");
                }
                updateMutationState(a, b, c) {
                    this.ei(a, b, c), this.ni(a);
                }
                addLocalQueryTarget(a) {
                    let b = "not-current";
                    if (this.isActiveQueryTarget(a)) {
                        const c = this.storage.getItem(eE(this.persistenceKey, a));
                        if (c) {
                            const d = eG.$s(a, c);
                            d && (b = d.state);
                        }
                    }
                    return this.si.Fs(a), this.Ys(), b;
                }
                removeLocalQueryTarget(a) {
                    this.si.Ms(a), this.Ys();
                }
                isLocalQueryTarget(a) {
                    return this.si.activeTargetIds.has(a);
                }
                clearQueryState(a) {
                    this.removeItem(eE(this.persistenceKey, a));
                }
                updateQueryState(a, b, c) {
                    this.ii(a, b, c);
                }
                handleUserChange(a, b, c) {
                    b.forEach((a)=>{
                        this.ni(a);
                    }), (this.currentUser = a), c.forEach((a)=>{
                        this.addPendingMutation(a);
                    });
                }
                setOnlineState(a) {
                    this.ri(a);
                }
                notifyBundleLoaded() {
                    this.oi();
                }
                shutdown() {
                    this.started && (this.window.removeEventListener("storage", this.Bs), this.removeItem(this.js), (this.started = !1));
                }
                getItem(a) {
                    const b = this.storage.getItem(a);
                    return p("SharedClientState", "READ", a, b), b;
                }
                setItem(a, b) {
                    p("SharedClientState", "SET", a, b), this.storage.setItem(a, b);
                }
                removeItem(a) {
                    p("SharedClientState", "REMOVE", a), this.storage.removeItem(a);
                }
                Us(a) {
                    const b = a;
                    if (b.storageArea === this.storage) {
                        if ((p("SharedClientState", "EVENT", b.key, b.newValue), b.key === this.js)) return void q("Received WebStorage notification for local change. Another client might have garbage-collected our state");
                        this.Oe.enqueueRetryable(async ()=>{
                            if (this.started) {
                                if (null !== b.key) if (this.Ws.test(b.key)) {
                                    if (null == b.newValue) {
                                        const a = this.ci(b.key);
                                        return this.ai(a, null);
                                    }
                                    {
                                        const c = this.ui(b.key, b.newValue);
                                        if (c) return this.ai(c.clientId, c);
                                    }
                                } else if (this.Gs.test(b.key)) {
                                    if (null !== b.newValue) {
                                        const d = this.hi(b.key, b.newValue);
                                        if (d) return this.li(d);
                                    }
                                } else if (this.zs.test(b.key)) {
                                    if (null !== b.newValue) {
                                        const e = this.fi(b.key, b.newValue);
                                        if (e) return this.di(e);
                                    }
                                } else if (b.key === this.Hs) {
                                    if (null !== b.newValue) {
                                        const f = this.Xs(b.newValue);
                                        if (f) return this.Zs(f);
                                    }
                                } else if (b.key === this.Qs) {
                                    const g = (function(a) {
                                        let b = G.T;
                                        if (null != a) try {
                                            const c = JSON.parse(a);
                                            u("number" == typeof c), (b = c);
                                        } catch (d) {
                                            q("SharedClientState", "Failed to read sequence number from WebStorage", d);
                                        }
                                        return b;
                                    })(b.newValue);
                                    g !== G.T && this.sequenceNumberHandler(g);
                                } else if (b.key === this.Js) return this.syncEngine.wi();
                            } else this.Ks.push(b);
                        });
                    }
                }
                get si() {
                    return this.qs.get(this.Ls);
                }
                Ys() {
                    this.setItem(this.js, this.si.Os());
                }
                ei(a, b, c) {
                    const d = new eF(this.currentUser, a, b, c), e = eD(this.persistenceKey, this.currentUser, a);
                    this.setItem(e, d.Os());
                }
                ni(a) {
                    const b = eD(this.persistenceKey, this.currentUser, a);
                    this.removeItem(b);
                }
                ri(a) {
                    const b = {
                        clientId: this.Ls,
                        onlineState: a
                    };
                    this.storage.setItem(this.Hs, JSON.stringify(b));
                }
                ii(a, b, c) {
                    const d = eE(this.persistenceKey, a), e = new eG(a, b, c);
                    this.setItem(d, e.Os());
                }
                oi() {
                    this.setItem(this.Js, "value-not-used");
                }
                ci(a) {
                    const b = this.Ws.exec(a);
                    return b ? b[1] : null;
                }
                ui(a, b) {
                    const c = this.ci(a);
                    return eH.$s(c, b);
                }
                hi(a, b) {
                    const c = this.Gs.exec(a), d = Number(c[1]), e = void 0 !== c[2] ? c[2] : null;
                    return eF.$s(new k(e), d, b);
                }
                fi(a, b) {
                    const c = this.zs.exec(a), d = Number(c[1]);
                    return eG.$s(d, b);
                }
                Xs(a) {
                    return eI.$s(a);
                }
                async li(a) {
                    if (a.user.uid === this.currentUser.uid) return this.syncEngine._i(a.batchId, a.state, a.error);
                    p("SharedClientState", `Ignoring mutation for non-active user ${a.user.uid}`);
                }
                di(a) {
                    return this.syncEngine.mi(a.targetId, a.state, a.error);
                }
                ai(a, b) {
                    const c = b ? this.qs.insert(a, b) : this.qs.remove(a), d = this.ti(this.qs), e = this.ti(c), f = [], g = [];
                    return (e.forEach((a)=>{
                        d.has(a) || f.push(a);
                    }), d.forEach((a)=>{
                        e.has(a) || g.push(a);
                    }), this.syncEngine.gi(f, g).then(()=>{
                        this.qs = c;
                    }));
                }
                Zs(a) {
                    this.qs.get(a.clientId) && this.onlineStateHandler(a.onlineState);
                }
                ti(a) {
                    let b = bZ();
                    return (a.forEach((a, c)=>{
                        b = b.unionWith(c.activeTargetIds);
                    }), b);
                }
            }
            class eL {
                constructor(){
                    (this.yi = new eJ()), (this.pi = {}), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null);
                }
                addPendingMutation(a) {}
                updateMutationState(a, b, c) {}
                addLocalQueryTarget(a) {
                    return this.yi.Fs(a), this.pi[a] || "not-current";
                }
                updateQueryState(a, b, c) {
                    this.pi[a] = b;
                }
                removeLocalQueryTarget(a) {
                    this.yi.Ms(a);
                }
                isLocalQueryTarget(a) {
                    return this.yi.activeTargetIds.has(a);
                }
                clearQueryState(a) {
                    delete this.pi[a];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(a) {
                    return this.yi.activeTargetIds.has(a);
                }
                start() {
                    return (this.yi = new eJ()), Promise.resolve();
                }
                handleUserChange(a, b, c) {}
                setOnlineState(a) {}
                shutdown() {}
                writeSequenceNumber(a) {}
                notifyBundleLoaded() {}
            }
            class eM {
                Ti(a) {}
                shutdown() {}
            }
            class eN {
                constructor(){
                    (this.Ei = ()=>this.Ii()), (this.Ai = ()=>this.Ri()), (this.bi = []), this.Pi();
                }
                Ti(a) {
                    this.bi.push(a);
                }
                shutdown() {
                    window.removeEventListener("online", this.Ei), window.removeEventListener("offline", this.Ai);
                }
                Pi() {
                    window.addEventListener("online", this.Ei), window.addEventListener("offline", this.Ai);
                }
                Ii() {
                    p("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
                    for (const a of this.bi)a(0);
                }
                Ri() {
                    p("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
                    for (const a of this.bi)a(1);
                }
                static bt() {
                    return ("undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener);
                }
            }
            const eO = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            class eP {
                constructor(a){
                    (this.vi = a.vi), (this.Vi = a.Vi);
                }
                Si(a) {
                    this.Di = a;
                }
                Ci(a) {
                    this.Ni = a;
                }
                onMessage(a) {
                    this.xi = a;
                }
                close() {
                    this.Vi();
                }
                send(a) {
                    this.vi(a);
                }
                ki() {
                    this.Di();
                }
                $i(a) {
                    this.Ni(a);
                }
                Oi(a) {
                    this.xi(a);
                }
            }
            class eQ extends class {
                constructor(a){
                    (this.databaseInfo = a), (this.databaseId = a.databaseId);
                    const b = a.ssl ? "https" : "http";
                    (this.Fi = b + "://" + a.host), (this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents");
                }
                Li(a, b, c, d) {
                    const e = this.Bi(a, b);
                    p("RestConnection", "Sending: ", e, c);
                    const f = {};
                    return (this.Ui(f, d), this.qi(a, e, f, c).then((a)=>(p("RestConnection", "Received: ", a), a), (b)=>{
                        throw ((r("RestConnection", `${a} failed with error: `, b, "url: ", e, "request:", c), b));
                    }));
                }
                Ki(a, b, c, d) {
                    return this.Li(a, b, c, d);
                }
                Ui(a, b) {
                    if (((a["X-Goog-Api-Client"] = "gl-js/ fire/" + l), (a["Content-Type"] = "text/plain"), this.databaseInfo.appId && (a["X-Firebase-GMPID"] = this.databaseInfo.appId), b)) for(const c in b.authHeaders)b.authHeaders.hasOwnProperty(c) && (a[c] = b.authHeaders[c]);
                }
                Bi(a, b) {
                    const c = eO[a];
                    return `${this.Fi}/v1/${b}:${c}`;
                }
            } {
                constructor(a){
                    super(a), (this.forceLongPolling = a.forceLongPolling), (this.autoDetectLongPolling = a.autoDetectLongPolling), (this.useFetchStreams = a.useFetchStreams);
                }
                qi(a, b, c, d) {
                    return new Promise((e, f)=>{
                        const g = new h.JJ();
                        g.listenOnce(h.tw.COMPLETE, ()=>{
                            try {
                                switch(g.getLastErrorCode()){
                                    case h.jK.NO_ERROR:
                                        const b = g.getResponseJson();
                                        p("Connection", "XHR received:", JSON.stringify(b)), e(b);
                                        break;
                                    case h.jK.TIMEOUT:
                                        p("Connection", 'RPC "' + a + '" timed out'), f(new y(x.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case h.jK.HTTP_ERROR:
                                        const c = g.getStatus();
                                        if ((p("Connection", 'RPC "' + a + '" failed with status:', c, "response text:", g.getResponseText()), c > 0)) {
                                            const d = g.getResponseJson().error;
                                            if (d && d.status && d.message) {
                                                const i = (function(a) {
                                                    const b = a.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(x).indexOf(b) >= 0 ? b : x.UNKNOWN;
                                                })(d.status);
                                                f(new y(i, d.message));
                                            } else f(new y(x.UNKNOWN, "Server responded with status " + g.getStatus()));
                                        } else f(new y(x.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        t();
                                }
                            } finally{
                                p("Connection", 'RPC "' + a + '" completed.');
                            }
                        });
                        const i = JSON.stringify(d);
                        g.send(b, "POST", i, c, 15);
                    });
                }
                ji(a, b) {
                    const c = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        a,
                        "/channel", 
                    ], d = (0, h.UE)(), e = (0, h.FJ)(), f = {
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
                    this.useFetchStreams && (f.xmlHttpFactory = new h.zI({})), this.Ui(f.initMessageHeaders, b), (0, g.uI)() || (0, g.b$)() || (0, g.d)() || (0, g.w1)() || (0, g.Mn)() || (0, g.ru)() || (f.httpHeadersOverwriteParam = "$httpHeaders");
                    const i = c.join("");
                    p("Connection", "Creating WebChannel: " + i, f);
                    const j = d.createWebChannel(i, f);
                    let k = !1, l = !1;
                    const m = new eP({
                        vi: (a)=>{
                            l ? p("Connection", "Not sending because WebChannel is closed:", a) : (k || (p("Connection", "Opening WebChannel transport."), j.open(), (k = !0)), p("Connection", "WebChannel sending:", a), j.send(a));
                        },
                        Vi: ()=>j.close()
                    }), n = (a, b, c)=>{
                        a.listen(b, (a)=>{
                            try {
                                c(a);
                            } catch (b) {
                                setTimeout(()=>{
                                    throw b;
                                }, 0);
                            }
                        });
                    };
                    return (n(j, h.ii.EventType.OPEN, ()=>{
                        l || p("Connection", "WebChannel transport opened.");
                    }), n(j, h.ii.EventType.CLOSE, ()=>{
                        l || ((l = !0), p("Connection", "WebChannel transport closed"), m.$i());
                    }), n(j, h.ii.EventType.ERROR, (a)=>{
                        l || ((l = !0), r("Connection", "WebChannel transport errored:", a), m.$i(new y(x.UNAVAILABLE, "The operation could not be completed")));
                    }), n(j, h.ii.EventType.MESSAGE, (a)=>{
                        var b;
                        if (!l) {
                            const c = a.data[0];
                            u(!!c);
                            const d = c, e = d.error || (null === (b = d[0]) || void 0 === b ? void 0 : b.error);
                            if (e) {
                                p("Connection", "WebChannel received error:", e);
                                const f = e.status;
                                let g = (function(a) {
                                    const b = bH[a];
                                    if (void 0 !== b) return bK(b);
                                })(f), h = e.message;
                                void 0 === g && ((g = x.INTERNAL), (h = "Unknown error status: " + f + " with message " + e.message)), (l = !0), m.$i(new y(g, h)), j.close();
                            } else p("Connection", "WebChannel received:", c), m.Oi(c);
                        }
                    }), n(e, h.ju.STAT_EVENT, (a)=>{
                        a.stat === h.kN.PROXY ? p("Connection", "Detected buffering proxy") : a.stat === h.kN.NOPROXY && p("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        m.ki();
                    }, 0), m);
                }
            }
            function eR() {
                return "undefined" != typeof window ? window : null;
            }
            function eS() {
                return "undefined" != typeof document ? document : null;
            }
            function eT(a) {
                return new b9(a, !0);
            }
            class eU {
                constructor(a, b, c = 1e3, d = 1.5, e = 6e4){
                    (this.Oe = a), (this.timerId = b), (this.Qi = c), (this.Wi = d), (this.Gi = e), (this.zi = 0), (this.Hi = null), (this.Ji = Date.now()), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(a) {
                    this.cancel();
                    const b = Math.floor(this.zi + this.Zi()), c = Math.max(0, Date.now() - this.Ji), d = Math.max(0, b - c);
                    d > 0 && p("ExponentialBackoff", `Backing off for ${d} ms (base delay: ${this.zi} ms, delay with jitter: ${b} ms, last attempt: ${c} ms ago)`), (this.Hi = this.Oe.enqueueAfterDelay(this.timerId, d, ()=>((this.Ji = Date.now()), a()))), (this.zi *= this.Wi), this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
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
            class eV {
                constructor(a, b, c, d, e, f, g){
                    (this.Oe = a), (this.er = c), (this.nr = d), (this.sr = e), (this.credentialsProvider = f), (this.listener = g), (this.state = 0), (this.ir = 0), (this.rr = null), (this.cr = null), (this.stream = null), (this.ar = new eU(a, b));
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
                mr(a) {
                    this.gr(), this.stream.send(a);
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
                async close(a, b) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== a ? this.ar.reset() : b && b.code === x.RESOURCE_EXHAUSTED ? (q(b.toString()), q("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : b && b.code === x.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), (this.stream = null)), (this.state = a), await this.listener.Ci(b);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const a = this.Tr(this.ir), b = this.ir;
                    this.credentialsProvider.getToken().then((a)=>{
                        this.ir === b && this.Er(a);
                    }, (b)=>{
                        a(()=>{
                            const a = new y(x.UNKNOWN, "Fetching auth token failed: " + b.message);
                            return this.Ir(a);
                        });
                    });
                }
                Er(a) {
                    const b = this.Tr(this.ir);
                    (this.stream = this.Ar(a)), this.stream.Si(()=>{
                        b(()=>((this.state = 2), (this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve()))), this.listener.Si()));
                    }), this.stream.Ci((a)=>{
                        b(()=>this.Ir(a));
                    }), this.stream.onMessage((a)=>{
                        b(()=>this.onMessage(a));
                    });
                }
                lr() {
                    (this.state = 5), this.ar.Xi(async ()=>{
                        (this.state = 0), this.start();
                    });
                }
                Ir(a) {
                    return (p("PersistentStream", `close with error: ${a}`), (this.stream = null), this.close(4, a));
                }
                Tr(a) {
                    return (b)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === a ? b() : (p("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class eW extends eV {
                constructor(a, b, c, d, e){
                    super(a, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", b, c, e), (this.N = d);
                }
                Ar(a) {
                    return this.sr.ji("Listen", a);
                }
                onMessage(a) {
                    this.ar.reset();
                    const b = cp(this.N, a), c = (function(a) {
                        if (!("targetChange" in a)) return N.min();
                        const b = a.targetChange;
                        return b.targetIds && b.targetIds.length ? N.min() : b.readTime ? cd(b.readTime) : N.min();
                    })(a);
                    return this.listener.Rr(b, c);
                }
                br(a) {
                    const b = {};
                    (b.database = ck(this.N)), (b.addTarget = (function(a, b) {
                        let c;
                        const d = b.target;
                        return ((c = aD(d) ? {
                            documents: ct(a, d)
                        } : {
                            query: cu(a, d)
                        }), (c.targetId = b.targetId), b.resumeToken.approximateByteSize() > 0 ? (c.resumeToken = cb(a, b.resumeToken)) : b.snapshotVersion.compareTo(N.min()) > 0 && (c.readTime = ca(a, b.snapshotVersion.toTimestamp())), c);
                    })(this.N, a));
                    const c = cw(this.N, a);
                    c && (b.labels = c), this.mr(b);
                }
                Pr(a) {
                    const b = {};
                    (b.database = ck(this.N)), (b.removeTarget = a), this.mr(b);
                }
            }
            class eX extends (null && eV) {
                constructor(a, b, c, d, e){
                    super(a, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", b, c, e), (this.N = d), (this.vr = !1);
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
                Ar(a) {
                    return this.sr.ji("Write", a);
                }
                onMessage(a) {
                    if ((u(!!a.streamToken), (this.lastStreamToken = a.streamToken), this.vr)) {
                        this.ar.reset();
                        const b = cs(a.writeResults, a.commitTime), c = cd(a.commitTime);
                        return this.listener.Dr(c, b);
                    }
                    return (u(!a.writeResults || 0 === a.writeResults.length), (this.vr = !0), this.listener.Cr());
                }
                Nr() {
                    const a = {};
                    (a.database = ck(this.N)), this.mr(a);
                }
                Sr(a) {
                    const b = {
                        streamToken: this.lastStreamToken,
                        writes: a.map((a)=>cq(this.N, a))
                    };
                    this.mr(b);
                }
            }
            class eY extends class {
            } {
                constructor(a, b, c){
                    super(), (this.credentials = a), (this.sr = b), (this.N = c), (this.kr = !1);
                }
                $r() {
                    if (this.kr) throw new y(x.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(a, b, c) {
                    return (this.$r(), this.credentials.getToken().then((d)=>this.sr.Li(a, b, c, d)).catch((a)=>{
                        throw "FirebaseError" === a.name ? (a.code === x.UNAUTHENTICATED && this.credentials.invalidateToken(), a) : new y(x.UNKNOWN, a.toString());
                    }));
                }
                Ki(a, b, c) {
                    return (this.$r(), this.credentials.getToken().then((d)=>this.sr.Ki(a, b, c, d)).catch((a)=>{
                        throw "FirebaseError" === a.name ? (a.code === x.UNAUTHENTICATED && this.credentials.invalidateToken(), a) : new y(x.UNKNOWN, a.toString());
                    }));
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class eZ {
                constructor(a, b){
                    (this.asyncQueue = a), (this.onlineStateHandler = b), (this.state = "Unknown"), (this.Or = 0), (this.Fr = null), (this.Mr = !0);
                }
                Lr() {
                    0 === this.Or && (this.Br("Unknown"), (this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, ()=>((this.Fr = null), this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline"), Promise.resolve()))));
                }
                qr(a) {
                    "Online" === this.state ? this.Br("Unknown") : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${a.toString()}`), this.Br("Offline")));
                }
                set(a) {
                    this.Kr(), (this.Or = 0), "Online" === a && (this.Mr = !1), this.Br(a);
                }
                Br(a) {
                    a !== this.state && ((this.state = a), this.onlineStateHandler(a));
                }
                Ur(a) {
                    const b = `Could not reach Cloud Firestore backend. ${a}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (q(b), (this.Mr = !1)) : p("OnlineStateTracker", b);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), (this.Fr = null));
                }
            }
            class e$ {
                constructor(a, b, c, d, e){
                    (this.localStore = a), (this.datastore = b), (this.asyncQueue = c), (this.remoteSyncer = {}), (this.jr = []), (this.Qr = new Map()), (this.Wr = new Set()), (this.Gr = []), (this.zr = e), this.zr.Ti((a)=>{
                        c.enqueueAndForget(async ()=>{
                            e7(this) && (p("RemoteStore", "Restarting streams for network reachability change."), await (async function(a) {
                                const b = w(a);
                                b.Wr.add(4), await e0(b), b.Hr.set("Unknown"), b.Wr.delete(4), await e_(b);
                            })(this));
                        });
                    }), (this.Hr = new eZ(c, d));
                }
            }
            async function e_(a) {
                if (e7(a)) for (const b of a.Gr)await b(!0);
            }
            async function e0(a) {
                for (const b of a.Gr)await b(!1);
            }
            function e1(a, b) {
                const c = w(a);
                c.Qr.has(b.targetId) || (c.Qr.set(b.targetId, b), e6(c) ? e5(c) : fo(c).hr() && e3(c, b));
            }
            function e2(a, b) {
                const c = w(a), d = fo(c);
                c.Qr.delete(b), d.hr() && e4(c, b), 0 === c.Qr.size && (d.hr() ? d.wr() : e7(c) && c.Hr.set("Unknown"));
            }
            function e3(a, b) {
                a.Jr.Y(b.targetId), fo(a).br(b);
            }
            function e4(a, b) {
                a.Jr.Y(b), fo(a).Pr(b);
            }
            function e5(a) {
                (a.Jr = new b4({
                    getRemoteKeysForTarget: (b)=>a.remoteSyncer.getRemoteKeysForTarget(b),
                    Tt: (b)=>a.Qr.get(b) || null
                })), fo(a).start(), a.Hr.Lr();
            }
            function e6(a) {
                return e7(a) && !fo(a).ur() && a.Qr.size > 0;
            }
            function e7(a) {
                return 0 === w(a).Wr.size;
            }
            function e8(a) {
                a.Jr = void 0;
            }
            async function e9(a) {
                a.Qr.forEach((b, c)=>{
                    e3(a, b);
                });
            }
            async function fa(a, b) {
                e8(a), e6(a) ? (a.Hr.qr(b), e5(a)) : a.Hr.set("Unknown");
            }
            async function fb(a, b, c) {
                if ((a.Hr.set("Online"), b instanceof b2 && 2 === b.state && b.cause)) try {
                    await (async function(a, b) {
                        const c = b.cause;
                        for (const d of b.targetIds)a.Qr.has(d) && (await a.remoteSyncer.rejectListen(d, c), a.Qr.delete(d), a.Jr.removeTarget(d));
                    })(a, b);
                } catch (d) {
                    p("RemoteStore", "Failed to remove targets %s: %s ", b.targetIds.join(","), d), await fc(a, d);
                }
                else if ((b instanceof b0 ? a.Jr.rt(b) : b instanceof b1 ? a.Jr.ft(b) : a.Jr.at(b), !c.isEqual(N.min()))) try {
                    const e = await eg(a.localStore);
                    c.compareTo(e) >= 0 && (await (function(a, b) {
                        const c = a.Jr._t(b);
                        return (c.targetChanges.forEach((c, d)=>{
                            if (c.resumeToken.approximateByteSize() > 0) {
                                const e = a.Qr.get(d);
                                e && a.Qr.set(d, e.withResumeToken(c.resumeToken, b));
                            }
                        }), c.targetMismatches.forEach((b)=>{
                            const c = a.Qr.get(b);
                            if (!c) return;
                            a.Qr.set(b, c.withResumeToken(X.EMPTY_BYTE_STRING, c.snapshotVersion)), e4(a, b);
                            const d = new dh(c.target, b, 1, c.sequenceNumber);
                            e3(a, d);
                        }), a.remoteSyncer.applyRemoteEvent(c));
                    })(a, c));
                } catch (f) {
                    p("RemoteStore", "Failed to raise snapshot:", f), await fc(a, f);
                }
            }
            async function fc(a, b, c) {
                if (!c8(b)) throw b;
                a.Wr.add(1), await e0(a), a.Hr.set("Offline"), c || (c = ()=>eg(a.localStore)), a.asyncQueue.enqueueRetryable(async ()=>{
                    p("RemoteStore", "Retrying IndexedDB access"), await c(), a.Wr.delete(1), await e_(a);
                });
            }
            function fd(a, b) {
                return b().catch((c)=>fc(a, c, b));
            }
            async function fe(a) {
                const b = w(a), c = fp(b);
                let d = b.jr.length > 0 ? b.jr[b.jr.length - 1].batchId : -1;
                for(; ff(b);)try {
                    const e = await ej(b.localStore, d);
                    if (null === e) {
                        0 === b.jr.length && c.wr();
                        break;
                    }
                    (d = e.batchId), fg(b, e);
                } catch (f) {
                    await fc(b, f);
                }
                fh(b) && fi(b);
            }
            function ff(a) {
                return e7(a) && a.jr.length < 10;
            }
            function fg(a, b) {
                a.jr.push(b);
                const c = fp(a);
                c.hr() && c.Vr && c.Sr(b.mutations);
            }
            function fh(a) {
                return e7(a) && !fp(a).ur() && a.jr.length > 0;
            }
            function fi(a) {
                fp(a).start();
            }
            async function fj(a) {
                fp(a).Nr();
            }
            async function fk(a) {
                const b = fp(a);
                for (const c of a.jr)b.Sr(c.mutations);
            }
            async function fl(a, b, c) {
                const d = a.jr.shift(), e = dg.from(d, b, c);
                await fd(a, ()=>a.remoteSyncer.applySuccessfulWrite(e)), await fe(a);
            }
            async function fm(a, b) {
                b && fp(a).Vr && (await (async function(a, b) {
                    if (((d = b.code), bJ(d) && d !== x.ABORTED)) {
                        const c = a.jr.shift();
                        fp(a).dr(), await fd(a, ()=>a.remoteSyncer.rejectFailedWrite(c.batchId, b)), await fe(a);
                    }
                    var d;
                })(a, b)), fh(a) && fi(a);
            }
            async function fn(a, b) {
                const c = w(a);
                b ? (c.Wr.delete(2), await e_(c)) : b || (c.Wr.add(2), await e0(c), c.Hr.set("Unknown"));
            }
            function fo(a) {
                return (a.Yr || ((a.Yr = (function(a, b, c) {
                    const d = w(a);
                    return (d.$r(), new eW(b, d.sr, d.credentials, d.N, c));
                })(a.datastore, a.asyncQueue, {
                    Si: e9.bind(null, a),
                    Ci: fa.bind(null, a),
                    Rr: fb.bind(null, a)
                })), a.Gr.push(async (b)=>{
                    b ? (a.Yr.dr(), e6(a) ? e5(a) : a.Hr.set("Unknown")) : (await a.Yr.stop(), e8(a));
                })), a.Yr);
            }
            function fp(a) {
                return (a.Xr || ((a.Xr = (function(a, b, c) {
                    const d = w(a);
                    return (d.$r(), new eX(b, d.sr, d.credentials, d.N, c));
                })(a.datastore, a.asyncQueue, {
                    Si: fj.bind(null, a),
                    Ci: fm.bind(null, a),
                    Cr: fk.bind(null, a),
                    Dr: fl.bind(null, a)
                })), a.Gr.push(async (b)=>{
                    b ? (a.Xr.dr(), await fe(a)) : (await a.Xr.stop(), a.jr.length > 0 && (p("RemoteStore", `Stopping write stream with ${a.jr.length} pending writes`), (a.jr = [])));
                })), a.Xr);
            }
            class fq {
                constructor(a, b, c, d, e){
                    (this.asyncQueue = a), (this.timerId = b), (this.targetTimeMs = c), (this.op = d), (this.removalCallback = e), (this.deferred = new z()), (this.then = this.deferred.promise.then.bind(this.deferred.promise)), this.deferred.promise.catch((a)=>{});
                }
                static createAndSchedule(a, b, c, d, e) {
                    const f = Date.now() + c, g = new fq(a, b, f, d, e);
                    return g.start(c), g;
                }
                start(a) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), a);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(a) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new y(x.CANCELLED, "Operation cancelled" + (a ? ": " + a : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((a)=>this.deferred.resolve(a))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), (this.timerHandle = null));
                }
            }
            function fr(a, b) {
                if ((q("AsyncQueue", `${b}: ${a}`), c8(a))) return new y(x.UNAVAILABLE, `${b}: ${a}`);
                throw a;
            }
            class fs {
                constructor(a){
                    (this.comparator = a ? (b, c)=>a(b, c) || ag.comparator(b.key, c.key) : (a, b)=>ag.comparator(a.key, b.key)), (this.keyedMap = bT()), (this.sortedSet = new bL(this.comparator));
                }
                static emptySet(a) {
                    return new fs(a.comparator);
                }
                has(a) {
                    return null != this.keyedMap.get(a);
                }
                get(a) {
                    return this.keyedMap.get(a);
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
                indexOf(a) {
                    const b = this.keyedMap.get(a);
                    return b ? this.sortedSet.indexOf(b) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                forEach(a) {
                    this.sortedSet.inorderTraversal((b, c)=>(a(b), !1));
                }
                add(a) {
                    const b = this.delete(a.key);
                    return b.copy(b.keyedMap.insert(a.key, a), b.sortedSet.insert(a, null));
                }
                delete(a) {
                    const b = this.get(a);
                    return b ? this.copy(this.keyedMap.remove(a), this.sortedSet.remove(b)) : this;
                }
                isEqual(a) {
                    if (!(a instanceof fs)) return !1;
                    if (this.size !== a.size) return !1;
                    const b = this.sortedSet.getIterator(), c = a.sortedSet.getIterator();
                    for(; b.hasNext();){
                        const d = b.getNext().key, e = c.getNext().key;
                        if (!d.isEqual(e)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const a = [];
                    return (this.forEach((b)=>{
                        a.push(b.toString());
                    }), 0 === a.length ? "DocumentSet ()" : "DocumentSet (\n  " + a.join("  \n") + "\n)");
                }
                copy(a, b) {
                    const c = new fs();
                    return ((c.comparator = this.comparator), (c.keyedMap = a), (c.sortedSet = b), c);
                }
            }
            class ft {
                constructor(){
                    this.Zr = new bL(ag.comparator);
                }
                track(a) {
                    const b = a.doc.key, c = this.Zr.get(b);
                    c ? 0 !== a.type && 3 === c.type ? (this.Zr = this.Zr.insert(b, a)) : 3 === a.type && 1 !== c.type ? (this.Zr = this.Zr.insert(b, {
                        type: c.type,
                        doc: a.doc
                    })) : 2 === a.type && 2 === c.type ? (this.Zr = this.Zr.insert(b, {
                        type: 2,
                        doc: a.doc
                    })) : 2 === a.type && 0 === c.type ? (this.Zr = this.Zr.insert(b, {
                        type: 0,
                        doc: a.doc
                    })) : 1 === a.type && 0 === c.type ? (this.Zr = this.Zr.remove(b)) : 1 === a.type && 2 === c.type ? (this.Zr = this.Zr.insert(b, {
                        type: 1,
                        doc: c.doc
                    })) : 0 === a.type && 1 === c.type ? (this.Zr = this.Zr.insert(b, {
                        type: 2,
                        doc: a.doc
                    })) : t() : (this.Zr = this.Zr.insert(b, a));
                }
                eo() {
                    const a = [];
                    return (this.Zr.inorderTraversal((b, c)=>{
                        a.push(c);
                    }), a);
                }
            }
            class fu {
                constructor(a, b, c, d, e, f, g, h){
                    (this.query = a), (this.docs = b), (this.oldDocs = c), (this.docChanges = d), (this.mutatedKeys = e), (this.fromCache = f), (this.syncStateChanged = g), (this.excludesMetadataChanges = h);
                }
                static fromInitialDocuments(a, b, c, d) {
                    const e = [];
                    return (b.forEach((a)=>{
                        e.push({
                            type: 0,
                            doc: a
                        });
                    }), new fu(a, b, fs.emptySet(b), e, c, d, !0, !1));
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(a) {
                    if (!(this.fromCache === a.fromCache && this.syncStateChanged === a.syncStateChanged && this.mutatedKeys.isEqual(a.mutatedKeys) && a3(this.query, a.query) && this.docs.isEqual(a.docs) && this.oldDocs.isEqual(a.oldDocs))) return !1;
                    const b = this.docChanges, c = a.docChanges;
                    if (b.length !== c.length) return !1;
                    for(let d = 0; d < b.length; d++)if (b[d].type !== c[d].type || !b[d].doc.isEqual(c[d].doc)) return !1;
                    return !0;
                }
            }
            class fv {
                constructor(){
                    (this.no = void 0), (this.listeners = []);
                }
            }
            class fw {
                constructor(){
                    (this.queries = new dW((a)=>a4(a), a3)), (this.onlineState = "Unknown"), (this.so = new Set());
                }
            }
            async function fx(a, b) {
                const c = w(a), d = b.query;
                let e = !1, f = c.queries.get(d);
                if ((f || ((e = !0), (f = new fv())), e)) try {
                    f.no = await c.onListen(d);
                } catch (g) {
                    const h = fr(g, `Initialization of query '${a5(b.query)}' failed`);
                    return void b.onError(h);
                }
                if ((c.queries.set(d, f), f.listeners.push(b), b.io(c.onlineState), f.no)) {
                    b.ro(f.no) && fB(c);
                }
            }
            async function fy(a, b) {
                const c = w(a), d = b.query;
                let e = !1;
                const f = c.queries.get(d);
                if (f) {
                    const g = f.listeners.indexOf(b);
                    g >= 0 && (f.listeners.splice(g, 1), (e = 0 === f.listeners.length));
                }
                if (e) return c.queries.delete(d), c.onUnlisten(d);
            }
            function fz(a, b) {
                const c = w(a);
                let d = !1;
                for (const e of b){
                    const f = e.query, g = c.queries.get(f);
                    if (g) {
                        for (const h of g.listeners)h.ro(e) && (d = !0);
                        g.no = e;
                    }
                }
                d && fB(c);
            }
            function fA(a, b, c) {
                const d = w(a), e = d.queries.get(b);
                if (e) for (const f of e.listeners)f.onError(c);
                d.queries.delete(b);
            }
            function fB(a) {
                a.so.forEach((a)=>{
                    a.next();
                });
            }
            class fC {
                constructor(a, b, c){
                    (this.query = a), (this.oo = b), (this.co = !1), (this.ao = null), (this.onlineState = "Unknown"), (this.options = c || {});
                }
                ro(a) {
                    if (!this.options.includeMetadataChanges) {
                        const b = [];
                        for (const c of a.docChanges)3 !== c.type && b.push(c);
                        a = new fu(a.query, a.docs, a.oldDocs, b, a.mutatedKeys, a.fromCache, a.syncStateChanged, !0);
                    }
                    let d = !1;
                    return (this.co ? this.uo(a) && (this.oo.next(a), (d = !0)) : this.ho(a, this.onlineState) && (this.lo(a), (d = !0)), (this.ao = a), d);
                }
                onError(a) {
                    this.oo.error(a);
                }
                io(a) {
                    this.onlineState = a;
                    let b = !1;
                    return (this.ao && !this.co && this.ho(this.ao, a) && (this.lo(this.ao), (b = !0)), b);
                }
                ho(a, b) {
                    if (!a.fromCache) return !0;
                    const c = "Offline" !== b;
                    return ((!this.options.fo || !c) && (!a.docs.isEmpty() || "Offline" === b));
                }
                uo(a) {
                    if (a.docChanges.length > 0) return !0;
                    const b = this.ao && this.ao.hasPendingWrites !== a.hasPendingWrites;
                    return (!(!a.syncStateChanged && !b) && !0 === this.options.includeMetadataChanges);
                }
                lo(a) {
                    (a = fu.fromInitialDocuments(a.query, a.docs, a.mutatedKeys, a.fromCache)), (this.co = !0), this.oo.next(a);
                }
            }
            class fD {
                constructor(a, b){
                    (this.payload = a), (this.byteLength = b);
                }
                wo() {
                    return "metadata" in this.payload;
                }
            }
            class fE {
                constructor(a){
                    this.N = a;
                }
                zn(a) {
                    return ch(this.N, a);
                }
                Hn(a) {
                    return a.metadata.exists ? cn(this.N, a.document, !1) : ax.newNoDocument(this.zn(a.metadata.name), this.Jn(a.metadata.readTime));
                }
                Jn(a) {
                    return cd(a);
                }
            }
            class fF {
                constructor(a, b, c){
                    (this._o = a), (this.localStore = b), (this.N = c), (this.queries = []), (this.documents = []), (this.progress = fG(a));
                }
                mo(a) {
                    this.progress.bytesLoaded += a.byteLength;
                    let b = this.progress.documentsLoaded;
                    return (a.payload.namedQuery ? this.queries.push(a.payload.namedQuery) : a.payload.documentMetadata ? (this.documents.push({
                        metadata: a.payload.documentMetadata
                    }), a.payload.documentMetadata.exists || ++b) : a.payload.document && ((this.documents[this.documents.length - 1].document = a.payload.document), ++b), b !== this.progress.documentsLoaded ? ((this.progress.documentsLoaded = b), Object.assign({}, this.progress)) : null);
                }
                yo(a) {
                    const b = new Map(), c = new fE(this.N);
                    for (const d of a)if (d.metadata.queries) {
                        const e = c.zn(d.metadata.name);
                        for (const f of d.metadata.queries){
                            const g = (b.get(f) || bX()).add(e);
                            b.set(f, g);
                        }
                    }
                    return b;
                }
                async complete() {
                    const a = await eq(this.localStore, new fE(this.N), this.documents, this._o.id), b = this.yo(this.documents);
                    for (const c of this.queries)await er(this.localStore, c, b.get(c.name));
                    return ((this.progress.taskState = "Success"), new d8(Object.assign({}, this.progress), a));
                }
            }
            function fG(a) {
                return {
                    taskState: "Running",
                    documentsLoaded: 0,
                    bytesLoaded: 0,
                    totalDocuments: a.totalDocuments,
                    totalBytes: a.totalBytes
                };
            }
            class fH {
                constructor(a){
                    this.key = a;
                }
            }
            class fI {
                constructor(a){
                    this.key = a;
                }
            }
            class fJ {
                constructor(a, b){
                    (this.query = a), (this.po = b), (this.To = null), (this.current = !1), (this.Eo = bX()), (this.mutatedKeys = bX()), (this.Io = a7(a)), (this.Ao = new fs(this.Io));
                }
                get Ro() {
                    return this.po;
                }
                bo(a, b) {
                    const c = b ? b.Po : new ft(), d = b ? b.Ao : this.Ao;
                    let e = b ? b.mutatedKeys : this.mutatedKeys, f = d, g = !1;
                    const h = aX(this.query) && d.size === this.query.limit ? d.last() : null, i = aY(this.query) && d.size === this.query.limit ? d.first() : null;
                    if ((a.inorderTraversal((a, b)=>{
                        const j = d.get(a), k = a6(this.query, b) ? b : null, l = !!j && this.mutatedKeys.has(j.key), m = !!k && (k.hasLocalMutations || (this.mutatedKeys.has(k.key) && k.hasCommittedMutations));
                        let n = !1;
                        if (j && k) {
                            j.data.isEqual(k.data) ? l !== m && (c.track({
                                type: 3,
                                doc: k
                            }), (n = !0)) : this.vo(j, k) || (c.track({
                                type: 2,
                                doc: k
                            }), (n = !0), ((h && this.Io(k, h) > 0) || (i && this.Io(k, i) < 0)) && (g = !0));
                        } else !j && k ? (c.track({
                            type: 0,
                            doc: k
                        }), (n = !0)) : j && !k && (c.track({
                            type: 1,
                            doc: j
                        }), (n = !0), (h || i) && (g = !0));
                        n && (k ? ((f = f.add(k)), (e = m ? e.add(a) : e.delete(a))) : ((f = f.delete(a)), (e = e.delete(a))));
                    }), aX(this.query) || aY(this.query))) for(; f.size > this.query.limit;){
                        const j = aX(this.query) ? f.last() : f.first();
                        (f = f.delete(j.key)), (e = e.delete(j.key)), c.track({
                            type: 1,
                            doc: j
                        });
                    }
                    return {
                        Ao: f,
                        Po: c,
                        Ln: g,
                        mutatedKeys: e
                    };
                }
                vo(a, b) {
                    return (a.hasLocalMutations && b.hasCommittedMutations && !b.hasLocalMutations);
                }
                applyChanges(a, b, c) {
                    const d = this.Ao;
                    (this.Ao = a.Ao), (this.mutatedKeys = a.mutatedKeys);
                    const e = a.Po.eo();
                    e.sort((a, b)=>(function(a, b) {
                            const c = (a)=>{
                                switch(a){
                                    case 0:
                                        return 1;
                                    case 2:
                                    case 3:
                                        return 2;
                                    case 1:
                                        return 0;
                                    default:
                                        return t();
                                }
                            };
                            return c(a) - c(b);
                        })(a.type, b.type) || this.Io(a.doc, b.doc)), this.Vo(c);
                    const f = b ? this.So() : [], g = 0 === this.Eo.size && this.current ? 1 : 0, h = g !== this.To;
                    if (((this.To = g), 0 !== e.length || h)) {
                        return {
                            snapshot: new fu(this.query, a.Ao, d, e, a.mutatedKeys, 0 === g, h, !1),
                            Do: f
                        };
                    }
                    return {
                        Do: f
                    };
                }
                io(a) {
                    return this.current && "Offline" === a ? ((this.current = !1), this.applyChanges({
                        Ao: this.Ao,
                        Po: new ft(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, !1)) : {
                        Do: []
                    };
                }
                Co(a) {
                    return (!this.po.has(a) && !!this.Ao.has(a) && !this.Ao.get(a).hasLocalMutations);
                }
                Vo(a) {
                    a && (a.addedDocuments.forEach((a)=>(this.po = this.po.add(a))), a.modifiedDocuments.forEach((a)=>{}), a.removedDocuments.forEach((a)=>(this.po = this.po.delete(a))), (this.current = a.current));
                }
                So() {
                    if (!this.current) return [];
                    const a = this.Eo;
                    (this.Eo = bX()), this.Ao.forEach((a)=>{
                        this.Co(a.key) && (this.Eo = this.Eo.add(a.key));
                    });
                    const b = [];
                    return (a.forEach((a)=>{
                        this.Eo.has(a) || b.push(new fI(a));
                    }), this.Eo.forEach((c)=>{
                        a.has(c) || b.push(new fH(c));
                    }), b);
                }
                No(a) {
                    (this.po = a.Gn), (this.Eo = bX());
                    const b = this.bo(a.documents);
                    return this.applyChanges(b, !0);
                }
                xo() {
                    return fu.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class fK {
                constructor(a, b, c){
                    (this.query = a), (this.targetId = b), (this.view = c);
                }
            }
            class fL {
                constructor(a){
                    (this.key = a), (this.ko = !1);
                }
            }
            class fM {
                constructor(a, b, c, d, e, f){
                    (this.localStore = a), (this.remoteStore = b), (this.eventManager = c), (this.sharedClientState = d), (this.currentUser = e), (this.maxConcurrentLimboResolutions = f), (this.$o = {}), (this.Oo = new dW((a)=>a4(a), a3)), (this.Fo = new Map()), (this.Mo = new Set()), (this.Lo = new bL(ag.comparator)), (this.Bo = new Map()), (this.Uo = new et()), (this.qo = {}), (this.Ko = new Map()), (this.jo = dK.ie()), (this.onlineState = "Unknown"), (this.Qo = void 0);
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function fN(a, b) {
                const c = ge(a);
                let d, e;
                const f = c.Oo.get(b);
                if (f) (d = f.targetId), c.sharedClientState.addLocalQueryTarget(d), (e = f.view.xo());
                else {
                    const g = await ek(c.localStore, a1(b)), h = c.sharedClientState.addLocalQueryTarget(g.targetId);
                    (d = g.targetId), (e = await fO(c, b, d, "current" === h)), c.isPrimaryClient && e1(c.remoteStore, g);
                }
                return e;
            }
            async function fO(a, b, c, d) {
                a.Wo = (b, c, d)=>(async function(a, b, c, d) {
                        let e = b.view.bo(c);
                        e.Ln && (e = await em(a.localStore, b.query, !1).then(({ documents: a  })=>b.view.bo(a, e)));
                        const f = d && d.targetChanges.get(b.targetId), g = b.view.applyChanges(e, a.isPrimaryClient, f);
                        return f_(a, b.targetId, g.Do), g.snapshot;
                    })(a, b, c, d);
                const e = await em(a.localStore, b, !0), f = new fJ(b, e.Gn), g = f.bo(e.documents), h = b_.createSynthesizedTargetChangeForCurrentChange(c, d && "Offline" !== a.onlineState), i = f.applyChanges(g, a.isPrimaryClient, h);
                f_(a, c, i.Do);
                const j = new fK(b, c, f);
                return (a.Oo.set(b, j), a.Fo.has(c) ? a.Fo.get(c).push(b) : a.Fo.set(c, [
                    b
                ]), i.snapshot);
            }
            async function fP(a, b) {
                const c = w(a), d = c.Oo.get(b), e = c.Fo.get(d.targetId);
                if (e.length > 1) return (c.Fo.set(d.targetId, e.filter((a)=>!a3(a, b))), void c.Oo.delete(b));
                if (c.isPrimaryClient) {
                    c.sharedClientState.removeLocalQueryTarget(d.targetId);
                    c.sharedClientState.isActiveQueryTarget(d.targetId) || (await el(c.localStore, d.targetId, !1).then(()=>{
                        c.sharedClientState.clearQueryState(d.targetId), e2(c.remoteStore, d.targetId), fZ(c, d.targetId);
                    }).catch(dP));
                } else fZ(c, d.targetId), await el(c.localStore, d.targetId, !0);
            }
            async function fQ(a, b, c) {
                const d = gf(a);
                try {
                    const e = await (function(a, b) {
                        const c = w(a), d = M.now(), e = b.reduce((a, b)=>a.add(b.key), bX());
                        let f;
                        return c.persistence.runTransaction("Locally write mutations", "readwrite", (a)=>c.Qn.Pn(a, e).next((e)=>{
                                f = e;
                                const g = [];
                                for (const h of b){
                                    const i = bw(h, f.get(h.key));
                                    null != i && g.push(new bA(h.key, i, aw(i.value.mapValue), br.exists(!0)));
                                }
                                return c.In.addMutationBatch(a, d, g, b);
                            })).then((a)=>(a.applyToLocalDocumentSet(f), {
                                batchId: a.batchId,
                                changes: f
                            }));
                    })(d.localStore, b);
                    d.sharedClientState.addPendingMutation(e.batchId), (function(a, b, c) {
                        let d = a.qo[a.currentUser.toKey()];
                        d || (d = new bL(J));
                        (d = d.insert(b, c)), (a.qo[a.currentUser.toKey()] = d);
                    })(d, e.batchId, c), await f2(d, e.changes), await fe(d.remoteStore);
                } catch (f) {
                    const g = fr(f, "Failed to persist write");
                    c.reject(g);
                }
            }
            async function fR(a, b) {
                const c = w(a);
                try {
                    const d = await eh(c.localStore, b);
                    b.targetChanges.forEach((a, b)=>{
                        const d = c.Bo.get(b);
                        d && (u(a.addedDocuments.size + a.modifiedDocuments.size + a.removedDocuments.size <= 1), a.addedDocuments.size > 0 ? (d.ko = !0) : a.modifiedDocuments.size > 0 ? u(d.ko) : a.removedDocuments.size > 0 && (u(d.ko), (d.ko = !1)));
                    }), await f2(c, d, b);
                } catch (e) {
                    await dP(e);
                }
            }
            function fS(a, b, c) {
                const d = w(a);
                if ((d.isPrimaryClient && 0 === c) || (!d.isPrimaryClient && 1 === c)) {
                    const e = [];
                    d.Oo.forEach((a, c)=>{
                        const d = c.view.io(b);
                        d.snapshot && e.push(d.snapshot);
                    }), (function(a, b) {
                        const c = w(a);
                        c.onlineState = b;
                        let d = !1;
                        c.queries.forEach((a, c)=>{
                            for (const e of c.listeners)e.io(b) && (d = !0);
                        }), d && fB(c);
                    })(d.eventManager, b), e.length && d.$o.Rr(e), (d.onlineState = b), d.isPrimaryClient && d.sharedClientState.setOnlineState(b);
                }
            }
            async function fT(a, b, c) {
                const d = w(a);
                d.sharedClientState.updateQueryState(b, "rejected", c);
                const e = d.Bo.get(b), f = e && e.key;
                if (f) {
                    let g = new bL(ag.comparator);
                    g = g.insert(f, ax.newNoDocument(f, N.min()));
                    const h = bX().add(f), i = new b$(N.min(), new Map(), new bO(J), g, h);
                    await fR(d, i), (d.Lo = d.Lo.remove(f)), d.Bo.delete(b), f1(d);
                } else await el(d.localStore, b, !1).then(()=>fZ(d, b, c)).catch(dP);
            }
            async function fU(a, b) {
                const c = w(a), d = b.batch.batchId;
                try {
                    const e = await ef(c.localStore, b);
                    fY(c, d, null), fX(c, d), c.sharedClientState.updateMutationState(d, "acknowledged"), await f2(c, e);
                } catch (f) {
                    await dP(f);
                }
            }
            async function fV(a, b, c) {
                const d = w(a);
                try {
                    const e = await (function(a, b) {
                        const c = w(a);
                        return c.persistence.runTransaction("Reject batch", "readwrite-primary", (a)=>{
                            let d;
                            return c.In.lookupMutationBatch(a, b).next((b)=>(u(null !== b), (d = b.keys()), c.In.removeMutationBatch(a, b))).next(()=>c.In.performConsistencyCheck(a)).next(()=>c.Qn.Pn(a, d));
                        });
                    })(d.localStore, b);
                    fY(d, b, c), fX(d, b), d.sharedClientState.updateMutationState(b, "rejected", c), await f2(d, e);
                } catch (f) {
                    await dP(f);
                }
            }
            async function fW(a, b) {
                const c = w(a);
                e7(c.remoteStore) || p("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
                try {
                    const d = await (function(a) {
                        const b = w(a);
                        return b.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (a)=>b.In.getHighestUnacknowledgedBatchId(a));
                    })(c.localStore);
                    if (-1 === d) return void b.resolve();
                    const e = c.Ko.get(d) || [];
                    e.push(b), c.Ko.set(d, e);
                } catch (f) {
                    const g = fr(f, "Initialization of waitForPendingWrites() operation failed");
                    b.reject(g);
                }
            }
            function fX(a, b) {
                (a.Ko.get(b) || []).forEach((a)=>{
                    a.resolve();
                }), a.Ko.delete(b);
            }
            function fY(a, b, c) {
                const d = w(a);
                let e = d.qo[d.currentUser.toKey()];
                if (e) {
                    const f = e.get(b);
                    f && (c ? f.reject(c) : f.resolve(), (e = e.remove(b))), (d.qo[d.currentUser.toKey()] = e);
                }
            }
            function fZ(a, b, c = null) {
                a.sharedClientState.removeLocalQueryTarget(b);
                for (const d of a.Fo.get(b))a.Oo.delete(d), c && a.$o.Go(d, c);
                if ((a.Fo.delete(b), a.isPrimaryClient)) {
                    a.Uo.cs(b).forEach((b)=>{
                        a.Uo.containsKey(b) || f$(a, b);
                    });
                }
            }
            function f$(a, b) {
                a.Mo.delete(b.path.canonicalString());
                const c = a.Lo.get(b);
                null !== c && (e2(a.remoteStore, c), (a.Lo = a.Lo.remove(b)), a.Bo.delete(c), f1(a));
            }
            function f_(a, b, c) {
                for (const d of c)if (d instanceof fH) a.Uo.addReference(d.key, b), f0(a, d);
                else if (d instanceof fI) {
                    p("SyncEngine", "Document no longer in limbo: " + d.key), a.Uo.removeReference(d.key, b);
                    a.Uo.containsKey(d.key) || f$(a, d.key);
                } else t();
            }
            function f0(a, b) {
                const c = b.key, d = c.path.canonicalString();
                a.Lo.get(c) || a.Mo.has(d) || (p("SyncEngine", "New document in limbo: " + c), a.Mo.add(d), f1(a));
            }
            function f1(a) {
                for(; a.Mo.size > 0 && a.Lo.size < a.maxConcurrentLimboResolutions;){
                    const b = a.Mo.values().next().value;
                    a.Mo.delete(b);
                    const c = new ag(S.fromString(b)), d = a.jo.next();
                    a.Bo.set(d, new fL(c)), (a.Lo = a.Lo.insert(c, d)), e1(a.remoteStore, new dh(a1(aW(c.path)), d, 2, G.T));
                }
            }
            async function f2(a, b, c) {
                const d = w(a), e = [], f = [], g = [];
                d.Oo.isEmpty() || (d.Oo.forEach((a, h)=>{
                    g.push(d.Wo(h, b, c).then((a)=>{
                        if (a) {
                            d.isPrimaryClient && d.sharedClientState.updateQueryState(h.targetId, a.fromCache ? "not-current" : "current"), e.push(a);
                            const b = ea.kn(h.targetId, a);
                            f.push(b);
                        }
                    }));
                }), await Promise.all(g), d.$o.Rr(e), await (async function(a, b) {
                    const c = w(a);
                    try {
                        await c.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (a)=>c3.forEach(b, (b)=>c3.forEach(b.Nn, (d)=>c.persistence.referenceDelegate.addReference(a, b.targetId, d)).next(()=>c3.forEach(b.xn, (d)=>c.persistence.referenceDelegate.removeReference(a, b.targetId, d)))));
                    } catch (d) {
                        if (!c8(d)) throw d;
                        p("LocalStore", "Failed to update sequence numbers: " + d);
                    }
                    for (const e of b){
                        const f = e.targetId;
                        if (!e.fromCache) {
                            const g = c.Un.get(f), h = g.snapshotVersion, i = g.withLastLimboFreeSnapshotVersion(h);
                            c.Un = c.Un.insert(f, i);
                        }
                    }
                })(d.localStore, f));
            }
            async function f3(a, b) {
                const c = w(a);
                if (!c.currentUser.isEqual(b)) {
                    p("SyncEngine", "User change. New user:", b.toKey());
                    const d = await ee(c.localStore, b);
                    (c.currentUser = b), (function(a, b) {
                        a.Ko.forEach((a)=>{
                            a.forEach((a)=>{
                                a.reject(new y(x.CANCELLED, b));
                            });
                        }), a.Ko.clear();
                    })(c, "'waitForPendingWrites' promise is rejected due to a user change."), c.sharedClientState.handleUserChange(b, d.removedBatchIds, d.addedBatchIds), await f2(c, d.Wn);
                }
            }
            function f4(a, b) {
                const c = w(a), d = c.Bo.get(b);
                if (d && d.ko) return bX().add(d.key);
                {
                    let e = bX();
                    const f = c.Fo.get(b);
                    if (!f) return e;
                    for (const g of f){
                        const h = c.Oo.get(g);
                        e = e.unionWith(h.view.Ro);
                    }
                    return e;
                }
            }
            async function f5(a, b) {
                const c = w(a), d = await em(c.localStore, b.query, !0), e = b.view.No(d);
                return c.isPrimaryClient && f_(c, b.targetId, e.Do), e;
            }
            async function f6(a) {
                const b = w(a);
                return eo(b.localStore).then((a)=>f2(b, a));
            }
            async function f7(a, b, c, d) {
                const e = w(a), f = await (function(a, b) {
                    const c = w(a), d = w(c.In);
                    return c.persistence.runTransaction("Lookup mutation documents", "readonly", (a)=>d.Xt(a, b).next((b)=>b ? c.Qn.Pn(a, b) : c3.resolve(null)));
                })(e.localStore, b);
                null !== f ? ("pending" === c ? await fe(e.remoteStore) : "acknowledged" === c || "rejected" === c ? (fY(e, b, d || null), fX(e, b), (function(a, b) {
                    w(w(a).In).te(b);
                })(e.localStore, b)) : t(), await f2(e, f)) : p("SyncEngine", "Cannot apply mutation batch with id: " + b);
            }
            async function f8(a, b) {
                const c = w(a);
                if ((ge(c), gf(c), !0 === b && !0 !== c.Qo)) {
                    const d = c.sharedClientState.getAllActiveQueryTargets(), e = await f9(c, d.toArray());
                    (c.Qo = !0), await fn(c.remoteStore, !0);
                    for (const f of e)e1(c.remoteStore, f);
                } else if (!1 === b && !1 !== c.Qo) {
                    const g = [];
                    let h = Promise.resolve();
                    c.Fo.forEach((a, b)=>{
                        c.sharedClientState.isLocalQueryTarget(b) ? g.push(b) : (h = h.then(()=>(fZ(c, b), el(c.localStore, b, !0)))), e2(c.remoteStore, b);
                    }), await h, await f9(c, g), (function(a) {
                        const b = w(a);
                        b.Bo.forEach((a, c)=>{
                            e2(b.remoteStore, c);
                        }), b.Uo.us(), (b.Bo = new Map()), (b.Lo = new bL(ag.comparator));
                    })(c), (c.Qo = !1), await fn(c.remoteStore, !1);
                }
            }
            async function f9(a, b, c) {
                const d = w(a), e = [], f = [];
                for (const g of b){
                    let h;
                    const i = d.Fo.get(g);
                    if (i && 0 !== i.length) {
                        h = await ek(d.localStore, a1(i[0]));
                        for (const j of i){
                            const k = d.Oo.get(j), l = await f5(d, k);
                            l.snapshot && f.push(l.snapshot);
                        }
                    } else {
                        const m = await en(d.localStore, g);
                        (h = await ek(d.localStore, m)), await fO(d, ga(m), g, !1);
                    }
                    e.push(h);
                }
                return d.$o.Rr(f), e;
            }
            function ga(a) {
                return aV(a.path, a.collectionGroup, a.orderBy, a.filters, a.limit, "F", a.startAt, a.endAt);
            }
            function gb(a) {
                const b = w(a);
                return w(w(b.localStore).persistence).pn();
            }
            async function gc(a, b, c, d) {
                const e = w(a);
                if (e.Qo) p("SyncEngine", "Ignoring unexpected query state notification.");
                else if (e.Fo.has(b)) switch(c){
                    case "current":
                    case "not-current":
                        {
                            const f = await eo(e.localStore), g = b$.createSynthesizedRemoteEventForCurrentChange(b, "current" === c);
                            await f2(e, f, g);
                            break;
                        }
                    case "rejected":
                        await el(e.localStore, b, !0), fZ(e, b, d);
                        break;
                    default:
                        t();
                }
            }
            async function gd(a, b, c) {
                const d = ge(a);
                if (d.Qo) {
                    for (const e of b){
                        if (d.Fo.has(e)) {
                            p("SyncEngine", "Adding an already active target " + e);
                            continue;
                        }
                        const f = await en(d.localStore, e), g = await ek(d.localStore, f);
                        await fO(d, ga(f), g.targetId, !1), e1(d.remoteStore, g);
                    }
                    for (const h of c)d.Fo.has(h) && (await el(d.localStore, h, !1).then(()=>{
                        e2(d.remoteStore, h), fZ(d, h);
                    }).catch(dP));
                }
            }
            function ge(a) {
                const b = w(a);
                return ((b.remoteStore.remoteSyncer.applyRemoteEvent = fR.bind(null, b)), (b.remoteStore.remoteSyncer.getRemoteKeysForTarget = f4.bind(null, b)), (b.remoteStore.remoteSyncer.rejectListen = fT.bind(null, b)), (b.$o.Rr = fz.bind(null, b.eventManager)), (b.$o.Go = fA.bind(null, b.eventManager)), b);
            }
            function gf(a) {
                const b = w(a);
                return ((b.remoteStore.remoteSyncer.applySuccessfulWrite = fU.bind(null, b)), (b.remoteStore.remoteSyncer.rejectFailedWrite = fV.bind(null, b)), b);
            }
            function gg(a, b, c) {
                const d = w(a);
                (async function(a, b, c) {
                    try {
                        const d = await b.getMetadata();
                        if (await (function(a, b) {
                            const c = w(a), d = cd(b.createTime);
                            return c.persistence.runTransaction("hasNewerBundle", "readonly", (a)=>c.Je.getBundleMetadata(a, b.id)).then((a)=>!!a && a.createTime.compareTo(d) >= 0);
                        })(a.localStore, d)) return (await b.close(), void c._completeWith((function(a) {
                            return {
                                taskState: "Success",
                                documentsLoaded: a.totalDocuments,
                                bytesLoaded: a.totalBytes,
                                totalDocuments: a.totalDocuments,
                                totalBytes: a.totalBytes
                            };
                        })(d)));
                        c._updateProgress(fG(d));
                        const e = new fF(d, a.localStore, b.N);
                        let f = await b.zo();
                        for(; f;){
                            const g = await e.mo(f);
                            g && c._updateProgress(g), (f = await b.zo());
                        }
                        const h = await e.complete();
                        await f2(a, h.En, void 0), await (function(a, b) {
                            const c = w(a);
                            return c.persistence.runTransaction("Save bundle", "readwrite", (a)=>c.Je.saveBundleMetadata(a, b));
                        })(a.localStore, d), c._completeWith(h.progress);
                    } catch (i) {
                        r("SyncEngine", `Loading bundle failed with ${i}`), c._failWith(i);
                    }
                })(d, b, c).then(()=>{
                    d.sharedClientState.notifyBundleLoaded();
                });
            }
            class gh {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(a) {
                    (this.N = eT(a.databaseInfo.databaseId)), (this.sharedClientState = this.Ho(a)), (this.persistence = this.Jo(a)), await this.persistence.start(), (this.gcScheduler = this.Yo(a)), (this.localStore = this.Xo(a));
                }
                Yo(a) {
                    return null;
                }
                Xo(a) {
                    return ed(this.persistence, new eb(), a.initialUser, this.N);
                }
                Jo(a) {
                    return new ez(eB.Ns, this.N);
                }
                Ho(a) {
                    return new eL();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class gi extends (null && gh) {
                constructor(a, b, c){
                    super(), (this.Zo = a), (this.cacheSizeBytes = b), (this.forceOwnership = c), (this.synchronizeTabs = !1);
                }
                async initialize(a) {
                    await super.initialize(a), await ep(this.localStore), await this.Zo.initialize(this, a), await gf(this.Zo.syncEngine), await fe(this.Zo.remoteStore), await this.persistence.nn(()=>(this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(this.localStore), Promise.resolve()));
                }
                Xo(a) {
                    return ed(this.persistence, new eb(), a.initialUser, this.N);
                }
                Yo(a) {
                    const b = this.persistence.referenceDelegate.garbageCollector;
                    return new dS(b, a.asyncQueue);
                }
                Jo(a) {
                    const b = d7(a.databaseInfo.databaseId, a.databaseInfo.persistenceKey), c = void 0 !== this.cacheSizeBytes ? dC.withCacheSize(this.cacheSizeBytes) : dC.DEFAULT;
                    return new d4(this.synchronizeTabs, b, a.clientId, c, a.asyncQueue, eR(), eS(), this.N, this.sharedClientState, !!this.forceOwnership);
                }
                Ho(a) {
                    return new eL();
                }
            }
            class gj extends (null && gi) {
                constructor(a, b){
                    super(a, b, !1), (this.Zo = a), (this.cacheSizeBytes = b), (this.synchronizeTabs = !0);
                }
                async initialize(a) {
                    await super.initialize(a);
                    const b = this.Zo.syncEngine;
                    this.sharedClientState instanceof eK && ((this.sharedClientState.syncEngine = {
                        _i: f7.bind(null, b),
                        mi: gc.bind(null, b),
                        gi: gd.bind(null, b),
                        pn: gb.bind(null, b),
                        wi: f6.bind(null, b)
                    }), await this.sharedClientState.start()), await this.persistence.nn(async (a)=>{
                        await f8(this.Zo.syncEngine, a), this.gcScheduler && (a && !this.gcScheduler.started ? this.gcScheduler.start(this.localStore) : a || this.gcScheduler.stop());
                    });
                }
                Ho(a) {
                    const b = eR();
                    if (!eK.bt(b)) throw new y(x.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
                    const c = d7(a.databaseInfo.databaseId, a.databaseInfo.persistenceKey);
                    return new eK(b, a.asyncQueue, c, a.clientId, a.initialUser);
                }
            }
            class gk {
                async initialize(a, b) {
                    this.localStore || ((this.localStore = a.localStore), (this.sharedClientState = a.sharedClientState), (this.datastore = this.createDatastore(b)), (this.remoteStore = this.createRemoteStore(b)), (this.eventManager = this.createEventManager(b)), (this.syncEngine = this.createSyncEngine(b, !a.synchronizeTabs)), (this.sharedClientState.onlineStateHandler = (a)=>fS(this.syncEngine, a, 1)), (this.remoteStore.remoteSyncer.handleCredentialChange = f3.bind(null, this.syncEngine)), await fn(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(a) {
                    return new fw();
                }
                createDatastore(a) {
                    const b = eT(a.databaseInfo.databaseId), c = ((d = a.databaseInfo), new eQ(d));
                    var d;
                    return (function(a, b, c) {
                        return new eY(a, b, c);
                    })(a.credentials, c, b);
                }
                createRemoteStore(a) {
                    return ((b = this.localStore), (c = this.datastore), (d = a.asyncQueue), (e = (a)=>fS(this.syncEngine, a, 0)), (f = eN.bt() ? new eN() : new eM()), new e$(b, c, d, e, f));
                    var b, c, d, e, f;
                }
                createSyncEngine(a, b) {
                    return (function(a, b, c, d, e, f, g) {
                        const h = new fM(a, b, c, d, e, f);
                        return g && (h.Qo = !0), h;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, a.initialUser, a.maxConcurrentLimboResolutions, b);
                }
                terminate() {
                    return (async function(a) {
                        const b = w(a);
                        p("RemoteStore", "RemoteStore shutting down."), b.Wr.add(5), await e0(b), b.zr.shutdown(), b.Hr.set("Unknown");
                    })(this.remoteStore);
                }
            }
            function gl(a, b = 10240) {
                let c = 0;
                return {
                    async read () {
                        if (c < a.byteLength) {
                            const d = {
                                value: a.slice(c, c + b),
                                done: !1
                            };
                            return (c += b), d;
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
            class gm {
                constructor(a){
                    (this.observer = a), (this.muted = !1);
                }
                next(a) {
                    this.observer.next && this.tc(this.observer.next, a);
                }
                error(a) {
                    this.observer.error ? this.tc(this.observer.error, a) : console.error("Uncaught Error in snapshot listener:", a);
                }
                ec() {
                    this.muted = !0;
                }
                tc(a, b) {
                    this.muted || setTimeout(()=>{
                        this.muted || a(b);
                    }, 0);
                }
            }
            class gn {
                constructor(a, b){
                    (this.nc = a), (this.N = b), (this.metadata = new z()), (this.buffer = new Uint8Array()), (this.sc = new TextDecoder("utf-8")), this.ic().then((a)=>{
                        a && a.wo() ? this.metadata.resolve(a.payload.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null == a ? void 0 : a.payload)}`));
                    }, (a)=>this.metadata.reject(a));
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
                    const a = await this.rc();
                    if (null === a) return null;
                    const b = this.sc.decode(a), c = Number(b);
                    isNaN(c) && this.oc(`length string (${b}) is not valid number`);
                    const d = await this.cc(c);
                    return new fD(JSON.parse(d), a.length + c);
                }
                ac() {
                    return this.buffer.findIndex((a)=>a === "{".charCodeAt(0));
                }
                async rc() {
                    for(; this.ac() < 0;){
                        if (await this.uc()) break;
                    }
                    if (0 === this.buffer.length) return null;
                    const a = this.ac();
                    a < 0 && this.oc("Reached the end of bundle when a length string is expected.");
                    const b = this.buffer.slice(0, a);
                    return (this.buffer = this.buffer.slice(a)), b;
                }
                async cc(a) {
                    for(; this.buffer.length < a;){
                        (await this.uc()) && this.oc("Reached the end of bundle when more is expected.");
                    }
                    const b = this.sc.decode(this.buffer.slice(0, a));
                    return (this.buffer = this.buffer.slice(a)), b;
                }
                oc(a) {
                    throw ((this.nc.cancel(), new Error(`Invalid bundle format: ${a}`)));
                }
                async uc() {
                    const a = await this.nc.read();
                    if (!a.done) {
                        const b = new Uint8Array(this.buffer.length + a.value.length);
                        b.set(this.buffer), b.set(a.value, this.buffer.length), (this.buffer = b);
                    }
                    return a.done;
                }
            }
            class go {
                constructor(a){
                    (this.datastore = a), (this.readVersions = new Map()), (this.mutations = []), (this.committed = !1), (this.lastWriteError = null), (this.writtenDocs = new Set());
                }
                async lookup(a) {
                    if ((this.ensureCommitNotCalled(), this.mutations.length > 0)) throw new y(x.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
                    const b = await (async function(a, b) {
                        const c = w(a), d = ck(c.N) + "/documents", e = {
                            documents: b.map((a)=>cg(c.N, a))
                        }, f = await c.Ki("BatchGetDocuments", d, e), g = new Map();
                        f.forEach((a)=>{
                            const b = co(c.N, a);
                            g.set(b.key.toString(), b);
                        });
                        const h = [];
                        return (b.forEach((a)=>{
                            const b = g.get(a.toString());
                            u(!!b), h.push(b);
                        }), h);
                    })(this.datastore, a);
                    return b.forEach((a)=>this.recordVersion(a)), b;
                }
                set(a, b) {
                    this.write(b.toMutation(a, this.precondition(a))), this.writtenDocs.add(a.toString());
                }
                update(a, b) {
                    try {
                        this.write(b.toMutation(a, this.preconditionForUpdate(a)));
                    } catch (c) {
                        this.lastWriteError = c;
                    }
                    this.writtenDocs.add(a.toString());
                }
                delete(a) {
                    this.write(new bE(a, this.precondition(a))), this.writtenDocs.add(a.toString());
                }
                async commit() {
                    if ((this.ensureCommitNotCalled(), this.lastWriteError)) throw this.lastWriteError;
                    const a = this.readVersions;
                    this.mutations.forEach((b)=>{
                        a.delete(b.key.toString());
                    }), a.forEach((a, b)=>{
                        const c = ag.fromPath(b);
                        this.mutations.push(new bF(c, this.precondition(c)));
                    }), await (async function(a, b) {
                        const c = w(a), d = ck(c.N) + "/documents", e = {
                            writes: b.map((a)=>cq(c.N, a))
                        };
                        await c.Li("Commit", d, e);
                    })(this.datastore, this.mutations), (this.committed = !0);
                }
                recordVersion(a) {
                    let b;
                    if (a.isFoundDocument()) b = a.version;
                    else {
                        if (!a.isNoDocument()) throw t();
                        b = N.min();
                    }
                    const c = this.readVersions.get(a.key.toString());
                    if (c) {
                        if (!b.isEqual(c)) throw new y(x.ABORTED, "Document version changed between two reads.");
                    } else this.readVersions.set(a.key.toString(), b);
                }
                precondition(a) {
                    const b = this.readVersions.get(a.toString());
                    return !this.writtenDocs.has(a.toString()) && b ? br.updateTime(b) : br.none();
                }
                preconditionForUpdate(a) {
                    const b = this.readVersions.get(a.toString());
                    if (!this.writtenDocs.has(a.toString()) && b) {
                        if (b.isEqual(N.min())) throw new y(x.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
                        return br.updateTime(b);
                    }
                    return br.exists(!0);
                }
                write(a) {
                    this.ensureCommitNotCalled(), this.mutations.push(a);
                }
                ensureCommitNotCalled() {}
            }
            class gp {
                constructor(a, b, c, d){
                    (this.asyncQueue = a), (this.datastore = b), (this.updateFunction = c), (this.deferred = d), (this.hc = 5), (this.ar = new eU(this.asyncQueue, "transaction_retry"));
                }
                run() {
                    (this.hc -= 1), this.lc();
                }
                lc() {
                    this.ar.Xi(async ()=>{
                        const a = new go(this.datastore), b = this.fc(a);
                        b && b.then((b)=>{
                            this.asyncQueue.enqueueAndForget(()=>a.commit().then(()=>{
                                    this.deferred.resolve(b);
                                }).catch((a)=>{
                                    this.dc(a);
                                }));
                        }).catch((a)=>{
                            this.dc(a);
                        });
                    });
                }
                fc(a) {
                    try {
                        const b = this.updateFunction(a);
                        return !ad(b) && b.catch && b.then ? b : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
                    } catch (c) {
                        return this.deferred.reject(c), null;
                    }
                }
                dc(a) {
                    this.hc > 0 && this.wc(a) ? ((this.hc -= 1), this.asyncQueue.enqueueAndForget(()=>(this.lc(), Promise.resolve()))) : this.deferred.reject(a);
                }
                wc(a) {
                    if ("FirebaseError" === a.name) {
                        const b = a.code;
                        return ("aborted" === b || "failed-precondition" === b || !bJ(b));
                    }
                    return !1;
                }
            }
            class gq {
                constructor(a, b, c){
                    (this.credentials = a), (this.asyncQueue = b), (this.databaseInfo = c), (this.user = k.UNAUTHENTICATED), (this.clientId = I.I()), (this.credentialListener = ()=>Promise.resolve()), this.credentials.start(b, async (a)=>{
                        p("FirestoreClient", "Received user=", a.uid), await this.credentialListener(a), (this.user = a);
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
                setCredentialChangeListener(a) {
                    this.credentialListener = a;
                }
                verifyNotTerminated() {
                    if (this.asyncQueue.isShuttingDown) throw new y(x.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const a = new z();
                    return (this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && (await this.onlineComponents.terminate()), this.offlineComponents && (await this.offlineComponents.terminate()), this.credentials.shutdown(), a.resolve();
                        } catch (b) {
                            const c = fr(b, "Failed to shutdown persistence");
                            a.reject(c);
                        }
                    }), a.promise);
                }
            }
            async function gr(a, b) {
                a.asyncQueue.verifyOperationInProgress(), p("FirestoreClient", "Initializing OfflineComponentProvider");
                const c = await a.getConfiguration();
                await b.initialize(c);
                let d = c.initialUser;
                a.setCredentialChangeListener(async (a)=>{
                    d.isEqual(a) || (await ee(b.localStore, a), (d = a));
                }), b.persistence.setDatabaseDeletedListener(()=>a.terminate()), (a.offlineComponents = b);
            }
            async function gs(a, b) {
                a.asyncQueue.verifyOperationInProgress();
                const c = await gt(a);
                p("FirestoreClient", "Initializing OnlineComponentProvider");
                const d = await a.getConfiguration();
                await b.initialize(c, d), a.setCredentialChangeListener((a)=>(async function(a, b) {
                        const c = w(a);
                        c.asyncQueue.verifyOperationInProgress(), p("RemoteStore", "RemoteStore received new credentials");
                        const d = e7(c);
                        c.Wr.add(3), await e0(c), d && c.Hr.set("Unknown"), await c.remoteSyncer.handleCredentialChange(b), c.Wr.delete(3), await e_(c);
                    })(b.remoteStore, a)), (a.onlineComponents = b);
            }
            async function gt(a) {
                return (a.offlineComponents || (p("FirestoreClient", "Using default OfflineComponentProvider"), await gr(a, new gh())), a.offlineComponents);
            }
            async function gu(a) {
                return (a.onlineComponents || (p("FirestoreClient", "Using default OnlineComponentProvider"), await gs(a, new gk())), a.onlineComponents);
            }
            function gv(a) {
                return gt(a).then((a)=>a.persistence);
            }
            function gw(a) {
                return gt(a).then((a)=>a.localStore);
            }
            function gx(a) {
                return gu(a).then((a)=>a.remoteStore);
            }
            function gy(a) {
                return gu(a).then((a)=>a.syncEngine);
            }
            async function gz(a) {
                const b = await gu(a), c = b.eventManager;
                return ((c.onListen = fN.bind(null, b.syncEngine)), (c.onUnlisten = fP.bind(null, b.syncEngine)), c);
            }
            function gA(a) {
                return a.asyncQueue.enqueue(async ()=>{
                    const b = await gv(a), c = await gx(a);
                    return (b.setNetworkEnabled(!0), (function(a) {
                        const b = w(a);
                        return b.Wr.delete(0), e_(b);
                    })(c));
                });
            }
            function gB(a) {
                return a.asyncQueue.enqueue(async ()=>{
                    const b = await gv(a), c = await gx(a);
                    return (b.setNetworkEnabled(!1), (async function(a) {
                        const b = w(a);
                        b.Wr.add(0), await e0(b), b.Hr.set("Offline");
                    })(c));
                });
            }
            function gC(a, b) {
                const c = new z();
                return (a.asyncQueue.enqueueAndForget(async ()=>(async function(a, b, c) {
                        try {
                            const d = await (function(a, b) {
                                const c = w(a);
                                return c.persistence.runTransaction("read document", "readonly", (a)=>c.Qn.An(a, b));
                            })(a, b);
                            d.isFoundDocument() ? c.resolve(d) : d.isNoDocument() ? c.resolve(null) : c.reject(new y(x.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
                        } catch (e) {
                            const f = fr(e, `Failed to get document '${b} from cache`);
                            c.reject(f);
                        }
                    })(await gw(a), b, c)), c.promise);
            }
            function gD(a, b, c = {}) {
                const d = new z();
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(a, b, c, d, e) {
                        const f = new gm({
                            next: (f)=>{
                                b.enqueueAndForget(()=>fy(a, g));
                                const h = f.docs.has(c);
                                !h && f.fromCache ? e.reject(new y(x.UNAVAILABLE, "Failed to get document because the client is offline.")) : h && f.fromCache && d && "server" === d.source ? e.reject(new y(x.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : e.resolve(f);
                            },
                            error: (a)=>e.reject(a)
                        }), g = new fC(aW(c.path), f, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return fx(a, g);
                    })(await gz(a), a.asyncQueue, b, c, d)), d.promise);
            }
            function gE(a, b) {
                const c = new z();
                return (a.asyncQueue.enqueueAndForget(async ()=>(async function(a, b, c) {
                        try {
                            const d = await em(a, b, !0), e = new fJ(b, d.Gn), f = e.bo(d.documents), g = e.applyChanges(f, !1);
                            c.resolve(g.snapshot);
                        } catch (h) {
                            const i = fr(h, `Failed to execute query '${b} against cache`);
                            c.reject(i);
                        }
                    })(await gw(a), b, c)), c.promise);
            }
            function gF(a, b, c = {}) {
                const d = new z();
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(a, b, c, d, e) {
                        const f = new gm({
                            next: (c)=>{
                                b.enqueueAndForget(()=>fy(a, g)), c.fromCache && "server" === d.source ? e.reject(new y(x.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : e.resolve(c);
                            },
                            error: (a)=>e.reject(a)
                        }), g = new fC(c, f, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return fx(a, g);
                    })(await gz(a), a.asyncQueue, b, c, d)), d.promise);
            }
            function gG(a, b) {
                const c = new gm(b);
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(a, b) {
                        w(a).so.add(b), b.next();
                    })(await gz(a), c)), ()=>{
                    c.ec(), a.asyncQueue.enqueueAndForget(async ()=>(function(a, b) {
                            w(a).so.delete(b);
                        })(await gz(a), c));
                });
            }
            function gH(a, b) {
                const c = new z();
                return (a.asyncQueue.enqueueAndForget(async ()=>{
                    const d = await (function(a) {
                        return gu(a).then((a)=>a.datastore);
                    })(a);
                    new gp(a.asyncQueue, d, b, c).run();
                }), c.promise);
            }
            function gI(a, b, c, d) {
                const e = (function(a, b) {
                    let c;
                    c = "string" == typeof a ? new TextEncoder().encode(a) : a;
                    return (function(a, b) {
                        return new gn(a, b);
                    })((function(a, b) {
                        if (a instanceof Uint8Array) return gl(a, b);
                        if (a instanceof ArrayBuffer) return gl(new Uint8Array(a), b);
                        if (a instanceof ReadableStream) return a.getReader();
                        throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
                    })(c), b);
                })(c, eT(b));
                a.asyncQueue.enqueueAndForget(async ()=>{
                    gg(await gy(a), e, d);
                });
            }
            function gJ(a, b) {
                return a.asyncQueue.enqueue(async ()=>(function(a, b) {
                        const c = w(a);
                        return c.persistence.runTransaction("Get named query", "readonly", (a)=>c.Je.getNamedQuery(a, b));
                    })(await gw(a), b));
            }
            class gK {
                constructor(a, b, c, d, e, f, g, h){
                    (this.databaseId = a), (this.appId = b), (this.persistenceKey = c), (this.host = d), (this.ssl = e), (this.forceLongPolling = f), (this.autoDetectLongPolling = g), (this.useFetchStreams = h);
                }
            }
            class gL {
                constructor(a, b){
                    (this.projectId = a), (this.database = b || "(default)");
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(a) {
                    return (a instanceof gL && a.projectId === this.projectId && a.database === this.database);
                }
            }
            const gM = new Map();
            function gN(a, b, c) {
                if (!c) throw new y(x.INVALID_ARGUMENT, `Function ${a}() cannot be called with an empty ${b}.`);
            }
            function gO(a, b, c, d) {
                if (!0 === b && !0 === d) throw new y(x.INVALID_ARGUMENT, `${a} and ${c} cannot be used together.`);
            }
            function gP(a) {
                if (!ag.isDocumentKey(a)) throw new y(x.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${a} has ${a.length}.`);
            }
            function gQ(a) {
                if (ag.isDocumentKey(a)) throw new y(x.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${a} has ${a.length}.`);
            }
            function gR(a) {
                if (void 0 === a) return "undefined";
                if (null === a) return "null";
                if ("string" == typeof a) return (a.length > 20 && (a = `${a.substring(0, 20)}...`), JSON.stringify(a));
                if ("number" == typeof a || "boolean" == typeof a) return "" + a;
                if ("object" == typeof a) {
                    if (a instanceof Array) return "an array";
                    {
                        const b = (function(a) {
                            if (a.constructor) return a.constructor.name;
                            return null;
                        })(a);
                        return b ? `a custom ${b} object` : "an object";
                    }
                }
                return "function" == typeof a ? "a function" : t();
            }
            function gS(a, b) {
                if (("_delegate" in a && (a = a._delegate), !(a instanceof b))) {
                    if (b.name === a.constructor.name) throw new y(x.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const c = gR(a);
                        throw new y(x.INVALID_ARGUMENT, `Expected type '${b.name}', but it was: ${c}`);
                    }
                }
                return a;
            }
            function gT(a, b) {
                if (b <= 0) throw new y(x.INVALID_ARGUMENT, `Function ${a}() requires a positive number, but it was: ${b}.`);
            }
            class gU {
                constructor(a){
                    var b;
                    if (void 0 === a.host) {
                        if (void 0 !== a.ssl) throw new y(x.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        (this.host = "firestore.googleapis.com"), (this.ssl = true);
                    } else (this.host = a.host), (this.ssl = null === (b = a.ssl) || void 0 === b || b);
                    if (((this.credentials = a.credentials), (this.ignoreUndefinedProperties = !!a.ignoreUndefinedProperties), void 0 === a.cacheSizeBytes)) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== a.cacheSizeBytes && a.cacheSizeBytes < 1048576) throw new y(x.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = a.cacheSizeBytes;
                    }
                    (this.experimentalForceLongPolling = !!a.experimentalForceLongPolling), (this.experimentalAutoDetectLongPolling = !!a.experimentalAutoDetectLongPolling), (this.useFetchStreams = !!a.useFetchStreams), gO("experimentalForceLongPolling", a.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", a.experimentalAutoDetectLongPolling);
                }
                isEqual(a) {
                    return (this.host === a.host && this.ssl === a.ssl && this.credentials === a.credentials && this.cacheSizeBytes === a.cacheSizeBytes && this.experimentalForceLongPolling === a.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === a.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === a.ignoreUndefinedProperties && this.useFetchStreams === a.useFetchStreams);
                }
            }
            class gV {
                constructor(a, b){
                    (this._credentials = b), (this.type = "firestore-lite"), (this._persistenceKey = "(lite)"), (this._settings = new gU({})), (this._settingsFrozen = !1), a instanceof gL ? (this._databaseId = a) : ((this._app = a), (this._databaseId = (function(a) {
                        if (!Object.prototype.hasOwnProperty.apply(a.options, [
                            "projectId"
                        ])) throw new y(x.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new gL(a.options.projectId);
                    })(a)));
                }
                get app() {
                    if (!this._app) throw new y(x.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(a) {
                    if (this._settingsFrozen) throw new y(x.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    (this._settings = new gU(a)), void 0 !== a.credentials && (this._credentials = (function(a) {
                        if (!a) return new B();
                        switch(a.type){
                            case "gapi":
                                const b = a.client;
                                return (u(!("object" != typeof b || null === b || !b.auth || !b.auth.getAuthHeaderValueForFirstParty)), new F(b, a.sessionIndex || "0", a.iamToken || null));
                            case "provider":
                                return a.client;
                            default:
                                throw new y(x.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    })(a.credentials));
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
                    return ((function(a) {
                        const b = gM.get(a);
                        b && (p("ComponentProvider", "Removing Datastore"), gM.delete(a), b.terminate());
                    })(this), Promise.resolve());
                }
            }
            function gW(a, b, c, d = {}) {
                var e;
                const f = (a = gS(a, gV))._getSettings();
                if (("firestore.googleapis.com" !== f.host && f.host !== b && r("Host has been set in both settings() and useEmulator(), emulator host will be used"), a._setSettings(Object.assign(Object.assign({}, f), {
                    host: `${b}:${c}`,
                    ssl: !1
                })), d.mockUserToken)) {
                    let g, h;
                    if ("string" == typeof d.mockUserToken) (g = d.mockUserToken), (h = k.MOCK_USER);
                    else {
                        g = createMockUserToken(d.mockUserToken, null === (e = a._app) || void 0 === e ? void 0 : e.options.projectId);
                        const i = d.mockUserToken.sub || d.mockUserToken.user_id;
                        if (!i) throw new y(x.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
                        h = new k(i);
                    }
                    a._credentials = new C(new A(g, h));
                }
            }
            class gX {
                constructor(a, b, c){
                    (this.converter = b), (this._key = c), (this.type = "document"), (this.firestore = a);
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
                    return new gZ(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(a) {
                    return new gX(this.firestore, a, this._key);
                }
            }
            class gY {
                constructor(a, b, c){
                    (this.converter = b), (this._query = c), (this.type = "query"), (this.firestore = a);
                }
                withConverter(a) {
                    return new gY(this.firestore, a, this._query);
                }
            }
            class gZ extends gY {
                constructor(a, b, c){
                    super(a, b, aW(c)), (this._path = c), (this.type = "collection");
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const a = this._path.popLast();
                    return a.isEmpty() ? null : new gX(this.firestore, null, new ag(a));
                }
                withConverter(a) {
                    return new gZ(this.firestore, a, this._path);
                }
            }
            function g$(a, b, ...c) {
                if (((a = (0, g.m9)(a)), gN("collection", "path", b), a instanceof gV)) {
                    const d = S.fromString(b, ...c);
                    return gQ(d), new gZ(a, null, d);
                }
                {
                    if (!(a instanceof gX || a instanceof gZ)) throw new y(x.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const e = a._path.child(S.fromString(b, ...c));
                    return (gQ(e), new gZ(a.firestore, null, e));
                }
            }
            function g_(a, b) {
                if (((a = gS(a, gV)), gN("collectionGroup", "collection id", b), b.indexOf("/") >= 0)) throw new y(x.INVALID_ARGUMENT, `Invalid collection ID '${b}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
                return new gY(a, null, (function(a) {
                    return new aU(S.emptyPath(), a);
                })(b));
            }
            function g0(a, b, ...c) {
                if (((a = getModularInstance(a)), 1 === arguments.length && (b = I.I()), gN("doc", "path", b), a instanceof gV)) {
                    const d = S.fromString(b, ...c);
                    return (gP(d), new gX(a, null, new ag(d)));
                }
                {
                    if (!(a instanceof gX || a instanceof gZ)) throw new y(x.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const e = a._path.child(S.fromString(b, ...c));
                    return (gP(e), new gX(a.firestore, a instanceof gZ ? a.converter : null, new ag(e)));
                }
            }
            function g1(a, b) {
                return ((a = getModularInstance(a)), (b = getModularInstance(b)), (a instanceof gX || a instanceof gZ) && (b instanceof gX || b instanceof gZ) && a.firestore === b.firestore && a.path === b.path && a.converter === b.converter);
            }
            function g2(a, b) {
                return ((a = getModularInstance(a)), (b = getModularInstance(b)), a instanceof gY && b instanceof gY && a.firestore === b.firestore && a3(a._query, b._query) && a.converter === b.converter);
            }
            class g3 {
                constructor(){
                    (this._c = Promise.resolve()), (this.mc = []), (this.gc = !1), (this.yc = []), (this.Tc = null), (this.Ec = !1), (this.Ic = !1), (this.Ac = []), (this.ar = new eU(this, "async_queue_retry")), (this.Rc = ()=>{
                        const a = eS();
                        a && p("AsyncQueue", "Visibility state changed to " + a.visibilityState), this.ar.tr();
                    });
                    const a = eS();
                    a && "function" == typeof a.addEventListener && a.addEventListener("visibilitychange", this.Rc);
                }
                get isShuttingDown() {
                    return this.gc;
                }
                enqueueAndForget(a) {
                    this.enqueue(a);
                }
                enqueueAndForgetEvenWhileRestricted(a) {
                    this.bc(), this.Pc(a);
                }
                enterRestrictedMode(a) {
                    if (!this.gc) {
                        (this.gc = !0), (this.Ic = a || !1);
                        const b = eS();
                        b && "function" == typeof b.removeEventListener && b.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(a) {
                    if ((this.bc(), this.gc)) return new Promise(()=>{});
                    const b = new z();
                    return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (a().then(b.resolve, b.reject), b.promise)).then(()=>b.promise);
                }
                enqueueRetryable(a) {
                    this.enqueueAndForget(()=>(this.mc.push(a), this.vc()));
                }
                async vc() {
                    if (0 !== this.mc.length) {
                        try {
                            await this.mc[0](), this.mc.shift(), this.ar.reset();
                        } catch (a) {
                            if (!c8(a)) throw a;
                            p("AsyncQueue", "Operation failed with retryable error: " + a);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(a) {
                    const b = this._c.then(()=>((this.Ec = !0), a().catch((a)=>{
                            (this.Tc = a), (this.Ec = !1);
                            const b = (function(a) {
                                let b = a.message || "";
                                a.stack && (b = a.stack.includes(a.message) ? a.stack : a.message + "\n" + a.stack);
                                return b;
                            })(a);
                            throw ((q("INTERNAL UNHANDLED ERROR: ", b), a));
                        }).then((a)=>((this.Ec = !1), a))));
                    return (this._c = b), b;
                }
                enqueueAfterDelay(a, b, c) {
                    this.bc(), this.Ac.indexOf(a) > -1 && (b = 0);
                    const d = fq.createAndSchedule(this, a, b, c, (a)=>this.Vc(a));
                    return this.yc.push(d), d;
                }
                bc() {
                    this.Tc && t();
                }
                verifyOperationInProgress() {}
                async Sc() {
                    let a;
                    do {
                        (a = this._c), await a;
                    }while (a !== this._c)
                }
                Dc(a) {
                    for (const b of this.yc)if (b.timerId === a) return !0;
                    return !1;
                }
                Cc(a) {
                    return this.Sc().then(()=>{
                        this.yc.sort((a, b)=>a.targetTimeMs - b.targetTimeMs);
                        for (const b of this.yc)if ((b.skipDelay(), "all" !== a && b.timerId === a)) break;
                        return this.Sc();
                    });
                }
                Nc(a) {
                    this.Ac.push(a);
                }
                Vc(a) {
                    const b = this.yc.indexOf(a);
                    this.yc.splice(b, 1);
                }
            }
            function g4(a) {
                return (function(a, b) {
                    if ("object" != typeof a || null === a) return !1;
                    const c = a;
                    for (const d of b)if (d in c && "function" == typeof c[d]) return !0;
                    return !1;
                })(a, [
                    "next",
                    "error",
                    "complete"
                ]);
            }
            class g5 {
                constructor(){
                    (this._progressObserver = {}), (this._taskCompletionResolver = new z()), (this._lastProgress = {
                        taskState: "Running",
                        totalBytes: 0,
                        totalDocuments: 0,
                        bytesLoaded: 0,
                        documentsLoaded: 0
                    });
                }
                onProgress(a, b, c) {
                    this._progressObserver = {
                        next: a,
                        error: b,
                        complete: c
                    };
                }
                catch(a) {
                    return this._taskCompletionResolver.promise.catch(a);
                }
                then(a, b) {
                    return this._taskCompletionResolver.promise.then(a, b);
                }
                _completeWith(a) {
                    this._updateProgress(a), this._progressObserver.complete && this._progressObserver.complete(), this._taskCompletionResolver.resolve(a);
                }
                _failWith(a) {
                    (this._lastProgress.taskState = "Error"), this._progressObserver.next && this._progressObserver.next(this._lastProgress), this._progressObserver.error && this._progressObserver.error(a), this._taskCompletionResolver.reject(a);
                }
                _updateProgress(a) {
                    (this._lastProgress = a), this._progressObserver.next && this._progressObserver.next(a);
                }
            }
            const g6 = null && -1;
            class g7 extends gV {
                constructor(a, b){
                    super(a, b), (this.type = "firestore"), (this._queue = new g3()), (this._persistenceKey = "name" in a ? a.name : "[DEFAULT]");
                }
                _terminate() {
                    return (this._firestoreClient || hb(this), this._firestoreClient.terminate());
                }
            }
            function g8(a, b) {
                const c = _getProvider(a, "firestore");
                if (c.isInitialized()) {
                    const d = c.getImmediate(), e = c.getOptions();
                    if (deepEqual(e, b)) return d;
                    throw new y(x.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
                }
                if (void 0 !== b.cacheSizeBytes && -1 !== b.cacheSizeBytes && b.cacheSizeBytes < 1048576) throw new y(x.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                return c.initialize({
                    options: b
                });
            }
            function g9(a = getApp()) {
                return _getProvider(a, "firestore").getImmediate();
            }
            function ha(a) {
                return (a._firestoreClient || hb(a), a._firestoreClient.verifyNotTerminated(), a._firestoreClient);
            }
            function hb(a) {
                var b;
                const c = a._freezeSettings(), d = (function(a, b, c, d) {
                    return new gK(a, b, c, d.host, d.ssl, d.experimentalForceLongPolling, d.experimentalAutoDetectLongPolling, d.useFetchStreams);
                })(a._databaseId, (null === (b = a._app) || void 0 === b ? void 0 : b.options.appId) || "", a._persistenceKey, c);
                a._firestoreClient = new gq(a._credentials, a._queue, d);
            }
            function hc(a, b) {
                hm((a = gS(a, g7)));
                const c = ha(a), d = a._freezeSettings(), e = new gk();
                return he(c, e, new gi(e, d.cacheSizeBytes, null == b ? void 0 : b.forceOwnership));
            }
            function hd(a) {
                hm((a = gS(a, g7)));
                const b = ha(a), c = a._freezeSettings(), d = new gk();
                return he(b, d, new gj(d, c.cacheSizeBytes));
            }
            function he(a, b, c) {
                const d = new z();
                return a.asyncQueue.enqueue(async ()=>{
                    try {
                        await gr(a, c), await gs(a, b), d.resolve();
                    } catch (e) {
                        if (!((function(a) {
                            if ("FirebaseError" === a.name) return (a.code === x.FAILED_PRECONDITION || a.code === x.UNIMPLEMENTED);
                            if ("undefined" != typeof DOMException && a instanceof DOMException) return (22 === a.code || 20 === a.code || 11 === a.code);
                            return !0;
                        })(e))) throw e;
                        console.warn("Error enabling offline persistence. Falling back to persistence disabled: " + e), d.reject(e);
                    }
                }).then(()=>d.promise);
            }
            function hf(a) {
                if (a._initialized && !a._terminated) throw new y(x.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
                const b = new z();
                return (a._queue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                    try {
                        await (async function(a) {
                            if (!c5.bt()) return Promise.resolve();
                            const b = a + "main";
                            await c5.delete(b);
                        })(d7(a._databaseId, a._persistenceKey)), b.resolve();
                    } catch (c) {
                        b.reject(c);
                    }
                }), b.promise);
            }
            function hg(a) {
                return (function(a) {
                    const b = new z();
                    return (a.asyncQueue.enqueueAndForget(async ()=>fW(await gy(a), b)), b.promise);
                })(ha((a = gS(a, g7))));
            }
            function hh(a) {
                return gA(ha((a = gS(a, g7))));
            }
            function hi(a) {
                return gB(ha((a = gS(a, g7))));
            }
            function hj(a) {
                return (_removeServiceInstance(a.app, "firestore"), a._delete());
            }
            function hk(a, b) {
                const c = ha((a = gS(a, g7))), d = new g5();
                return gI(c, a._databaseId, b, d), d;
            }
            function hl(a, b) {
                return gJ(ha((a = gS(a, g7))), b).then((b)=>b ? new gY(a, null, b.query) : null);
            }
            function hm(a) {
                if (a._initialized || a._terminated) throw new y(x.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
            }
            class hn {
                constructor(...a){
                    for(let b = 0; b < a.length; ++b)if (0 === a[b].length) throw new y(x.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new U(a);
                }
                isEqual(a) {
                    return this._internalPath.isEqual(a._internalPath);
                }
            }
            function ho() {
                return new hn("__name__");
            }
            class hp {
                constructor(a){
                    this._byteString = a;
                }
                static fromBase64String(a) {
                    try {
                        return new hp(X.fromBase64String(a));
                    } catch (b) {
                        throw new y(x.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + b);
                    }
                }
                static fromUint8Array(a) {
                    return new hp(X.fromUint8Array(a));
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
                isEqual(a) {
                    return this._byteString.isEqual(a._byteString);
                }
            }
            class hq {
                constructor(a){
                    this._methodName = a;
                }
            }
            class hr {
                constructor(a, b){
                    if (!isFinite(a) || a < -90 || a > 90) throw new y(x.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + a);
                    if (!isFinite(b) || b < -180 || b > 180) throw new y(x.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + b);
                    (this._lat = a), (this._long = b);
                }
                get latitude() {
                    return this._lat;
                }
                get longitude() {
                    return this._long;
                }
                isEqual(a) {
                    return this._lat === a._lat && this._long === a._long;
                }
                toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                _compareTo(a) {
                    return J(this._lat, a._lat) || J(this._long, a._long);
                }
            }
            const hs = /^__.*__$/;
            class ht {
                constructor(a, b, c){
                    (this.data = a), (this.fieldMask = b), (this.fieldTransforms = c);
                }
                toMutation(a, b) {
                    return null !== this.fieldMask ? new bA(a, this.data, this.fieldMask, b, this.fieldTransforms) : new bz(a, this.data, b, this.fieldTransforms);
                }
            }
            class hu {
                constructor(a, b, c){
                    (this.data = a), (this.fieldMask = b), (this.fieldTransforms = c);
                }
                toMutation(a, b) {
                    return new bA(a, this.data, this.fieldMask, b, this.fieldTransforms);
                }
            }
            function hv(a) {
                switch(a){
                    case 0:
                    case 2:
                    case 1:
                        return !0;
                    case 3:
                    case 4:
                        return !1;
                    default:
                        throw t();
                }
            }
            class hw {
                constructor(a, b, c, d, e, f){
                    (this.settings = a), (this.databaseId = b), (this.N = c), (this.ignoreUndefinedProperties = d), void 0 === e && this.xc(), (this.fieldTransforms = e || []), (this.fieldMask = f || []);
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(a) {
                    return new hw(Object.assign(Object.assign({}, this.settings), a), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(a) {
                    var b;
                    const c = null === (b = this.path) || void 0 === b ? void 0 : b.child(a), d = this.$c({
                        path: c,
                        Fc: !1
                    });
                    return d.Mc(a), d;
                }
                Lc(a) {
                    var b;
                    const c = null === (b = this.path) || void 0 === b ? void 0 : b.child(a), d = this.$c({
                        path: c,
                        Fc: !1
                    });
                    return d.xc(), d;
                }
                Bc(a) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(a) {
                    return hQ(a, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(a) {
                    return (void 0 !== this.fieldMask.find((b)=>a.isPrefixOf(b)) || void 0 !== this.fieldTransforms.find((b)=>a.isPrefixOf(b.field)));
                }
                xc() {
                    if (this.path) for(let a = 0; a < this.path.length; a++)this.Mc(this.path.get(a));
                }
                Mc(a) {
                    if (0 === a.length) throw this.Uc("Document fields must not be empty");
                    if (hv(this.kc) && hs.test(a)) throw this.Uc('Document fields cannot begin and end with "__"');
                }
            }
            class hx {
                constructor(a, b, c){
                    (this.databaseId = a), (this.ignoreUndefinedProperties = b), (this.N = c || eT(a));
                }
                jc(a, b, c, d = !1) {
                    return new hw({
                        kc: a,
                        methodName: b,
                        Kc: c,
                        path: U.emptyPath(),
                        Fc: !1,
                        qc: d
                    }, this.databaseId, this.N, this.ignoreUndefinedProperties);
                }
            }
            function hy(a) {
                const b = a._freezeSettings(), c = eT(a._databaseId);
                return new hx(a._databaseId, !!b.ignoreUndefinedProperties, c);
            }
            function hz(a, b, c, d, e, f = {}) {
                const g = a.jc(f.merge || f.mergeFields ? 2 : 0, b, c, e);
                hM("Data must be an object, but it was:", g, d);
                const h = hK(d, g);
                let i, j;
                if (f.merge) (i = new V(g.fieldMask)), (j = g.fieldTransforms);
                else if (f.mergeFields) {
                    const k = [];
                    for (const l of f.mergeFields){
                        const m = hN(b, l, c);
                        if (!g.contains(m)) throw new y(x.INVALID_ARGUMENT, `Field '${m}' is specified in your field mask but missing from your input data.`);
                        hR(k, m) || k.push(m);
                    }
                    (i = new V(k)), (j = g.fieldTransforms.filter((a)=>i.covers(a.field)));
                } else (i = null), (j = g.fieldTransforms);
                return new ht(new av(h), i, j);
            }
            class hA extends (null && hq) {
                _toFieldTransform(a) {
                    if (2 !== a.kc) throw 1 === a.kc ? a.Uc(`${this._methodName}() can only appear at the top level of your update data`) : a.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return a.fieldMask.push(a.path), null;
                }
                isEqual(a) {
                    return a instanceof hA;
                }
            }
            function hB(a, b, c) {
                return new hw({
                    kc: 3,
                    Kc: b.settings.Kc,
                    methodName: a._methodName,
                    Fc: c
                }, b.databaseId, b.N, b.ignoreUndefinedProperties);
            }
            class hC extends (null && hq) {
                _toFieldTransform(a) {
                    return new bo(a.path, new bg());
                }
                isEqual(a) {
                    return a instanceof hC;
                }
            }
            class hD extends (null && hq) {
                constructor(a, b){
                    super(a), (this.Qc = b);
                }
                _toFieldTransform(a) {
                    const b = hB(this, a, !0), c = this.Qc.map((a)=>hJ(a, b)), d = new bh(c);
                    return new bo(a.path, d);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            class hE extends (null && hq) {
                constructor(a, b){
                    super(a), (this.Qc = b);
                }
                _toFieldTransform(a) {
                    const b = hB(this, a, !0), c = this.Qc.map((a)=>hJ(a, b)), d = new bj(c);
                    return new bo(a.path, d);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            class hF extends (null && hq) {
                constructor(a, b){
                    super(a), (this.Wc = b);
                }
                _toFieldTransform(a) {
                    const b = new bl(a.N, bb(a.N, this.Wc));
                    return new bo(a.path, b);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            function hG(a, b, c, d) {
                const e = a.jc(1, b, c);
                hM("Data must be an object, but it was:", e, d);
                const f = [], g = av.empty();
                P(d, (a, d)=>{
                    const h = hP(b, a, c);
                    d = getModularInstance(d);
                    const i = e.Lc(h);
                    if (d instanceof hA) f.push(h);
                    else {
                        const j = hJ(d, i);
                        null != j && (f.push(h), g.set(h, j));
                    }
                });
                const h = new V(f);
                return new hu(g, h, e.fieldTransforms);
            }
            function hH(a, b, c, d, e, f) {
                const g = a.jc(1, b, c), h = [
                    hN(b, d, c)
                ], i = [
                    e
                ];
                if (f.length % 2 != 0) throw new y(x.INVALID_ARGUMENT, `Function ${b}() needs to be called with an even number of arguments that alternate between field names and values.`);
                for(let j = 0; j < f.length; j += 2)h.push(hN(b, f[j])), i.push(f[j + 1]);
                const k = [], l = av.empty();
                for(let m = h.length - 1; m >= 0; --m)if (!hR(k, h[m])) {
                    const n = h[m];
                    let o = i[m];
                    o = getModularInstance(o);
                    const p = g.Lc(n);
                    if (o instanceof hA) k.push(n);
                    else {
                        const q = hJ(o, p);
                        null != q && (k.push(n), l.set(n, q));
                    }
                }
                const r = new V(k);
                return new hu(l, r, g.fieldTransforms);
            }
            function hI(a, b, c, d = !1) {
                return hJ(c, a.jc(d ? 4 : 3, b));
            }
            function hJ(a, b) {
                if (hL((a = getModularInstance(a)))) return hM("Unsupported field value:", b, a), hK(a, b);
                if (a instanceof hq) return ((function(a, b) {
                    if (!hv(b.kc)) throw b.Uc(`${a._methodName}() can only be used with update() and set()`);
                    if (!b.path) throw b.Uc(`${a._methodName}() is not currently supported inside arrays`);
                    const c = a._toFieldTransform(b);
                    c && b.fieldTransforms.push(c);
                })(a, b), null);
                if (void 0 === a && b.ignoreUndefinedProperties) return null;
                if ((b.path && b.fieldMask.push(b.path), a instanceof Array)) {
                    if (b.settings.Fc && 4 !== b.kc) throw b.Uc("Nested arrays are not supported");
                    return (function(a, b) {
                        const c = [];
                        let d = 0;
                        for (const e of a){
                            let f = hJ(e, b.Bc(d));
                            null == f && (f = {
                                nullValue: "NULL_VALUE"
                            }), c.push(f), d++;
                        }
                        return {
                            arrayValue: {
                                values: c
                            }
                        };
                    })(a, b);
                }
                return (function(a, b) {
                    if (null === (a = getModularInstance(a))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof a) return bb(b.N, a);
                    if ("boolean" == typeof a) return {
                        booleanValue: a
                    };
                    if ("string" == typeof a) return {
                        stringValue: a
                    };
                    if (a instanceof Date) {
                        const c = M.fromDate(a);
                        return {
                            timestampValue: ca(b.N, c)
                        };
                    }
                    if (a instanceof M) {
                        const d = new M(a.seconds, 1e3 * Math.floor(a.nanoseconds / 1e3));
                        return {
                            timestampValue: ca(b.N, d)
                        };
                    }
                    if (a instanceof hr) return {
                        geoPointValue: {
                            latitude: a.latitude,
                            longitude: a.longitude
                        }
                    };
                    if (a instanceof hp) return {
                        bytesValue: cb(b.N, a._byteString)
                    };
                    if (a instanceof gX) {
                        const e = b.databaseId, f = a.firestore._databaseId;
                        if (!f.isEqual(e)) throw b.Uc(`Document reference is for database ${f.projectId}/${f.database} but should be for database ${e.projectId}/${e.database}`);
                        return {
                            referenceValue: ce(a.firestore._databaseId || b.databaseId, a._key.path)
                        };
                    }
                    throw b.Uc(`Unsupported field value: ${gR(a)}`);
                })(a, b);
            }
            function hK(a, b) {
                const c = {};
                return (Q(a) ? b.path && b.path.length > 0 && b.fieldMask.push(b.path) : P(a, (a, d)=>{
                    const e = hJ(d, b.Oc(a));
                    null != e && (c[a] = e);
                }), {
                    mapValue: {
                        fields: c
                    }
                });
            }
            function hL(a) {
                return !("object" != typeof a || null === a || a instanceof Array || a instanceof Date || a instanceof M || a instanceof hr || a instanceof hp || a instanceof gX || a instanceof hq);
            }
            function hM(a, b, c) {
                if (!hL(c) || !(function(a) {
                    return ("object" == typeof a && null !== a && (Object.getPrototypeOf(a) === Object.prototype || null === Object.getPrototypeOf(a)));
                })(c)) {
                    const d = gR(c);
                    throw "an object" === d ? b.Uc(a + " a custom object") : b.Uc(a + " " + d);
                }
            }
            function hN(a, b, c) {
                if ((b = getModularInstance(b)) instanceof hn) return b._internalPath;
                if ("string" == typeof b) return hP(a, b);
                throw hQ("Field path arguments must be of type string or FieldPath.", a, !1, void 0, c);
            }
            const hO = new RegExp("[~\\*/\\[\\]]");
            function hP(a, b, c) {
                if (b.search(hO) >= 0) throw hQ(`Invalid field path (${b}). Paths must not contain '~', '*', '/', '[', or ']'`, a, !1, void 0, c);
                try {
                    return new hn(...b.split("."))._internalPath;
                } catch (d) {
                    throw hQ(`Invalid field path (${b}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, a, !1, void 0, c);
                }
            }
            function hQ(a, b, c, d, e) {
                const f = d && !d.isEmpty(), g = void 0 !== e;
                let h = `Function ${b}() called with invalid data`;
                c && (h += " (via `toFirestore()`)"), (h += ". ");
                let i = "";
                return ((f || g) && ((i += " (found"), f && (i += ` in field ${d}`), g && (i += ` in document ${e}`), (i += ")")), new y(x.INVALID_ARGUMENT, h + a + i));
            }
            function hR(a, b) {
                return a.some((a)=>a.isEqual(b));
            }
            class hS {
                constructor(a, b, c, d, e){
                    (this._firestore = a), (this._userDataWriter = b), (this._key = c), (this._document = d), (this._converter = e);
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get ref() {
                    return new gX(this._firestore, this._converter, this._key);
                }
                exists() {
                    return null !== this._document;
                }
                data() {
                    if (this._document) {
                        if (this._converter) {
                            const a = new hT(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(a);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(a) {
                    if (this._document) {
                        const b = this._document.data.field(hU("DocumentSnapshot.get", a));
                        if (null !== b) return this._userDataWriter.convertValue(b);
                    }
                }
            }
            class hT extends hS {
                data() {
                    return super.data();
                }
            }
            function hU(a, b) {
                return "string" == typeof b ? hP(a, b) : b instanceof hn ? b._internalPath : b._delegate._internalPath;
            }
            class hV {
                constructor(a, b){
                    (this.hasPendingWrites = a), (this.fromCache = b);
                }
                isEqual(a) {
                    return (this.hasPendingWrites === a.hasPendingWrites && this.fromCache === a.fromCache);
                }
            }
            class hW extends hS {
                constructor(a, b, c, d, e, f){
                    super(a, b, c, d, f), (this._firestore = a), (this._firestoreImpl = a), (this.metadata = e);
                }
                exists() {
                    return super.exists();
                }
                data(a = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const b = new hX(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(b, a);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, a.serverTimestamps);
                    }
                }
                get(a, b = {}) {
                    if (this._document) {
                        const c = this._document.data.field(hU("DocumentSnapshot.get", a));
                        if (null !== c) return this._userDataWriter.convertValue(c, b.serverTimestamps);
                    }
                }
            }
            class hX extends hW {
                data(a = {}) {
                    return super.data(a);
                }
            }
            class hY {
                constructor(a, b, c, d){
                    (this._firestore = a), (this._userDataWriter = b), (this._snapshot = d), (this.metadata = new hV(d.hasPendingWrites, d.fromCache)), (this.query = c);
                }
                get docs() {
                    const a = [];
                    return this.forEach((b)=>a.push(b)), a;
                }
                get size() {
                    return this._snapshot.docs.size;
                }
                get empty() {
                    return 0 === this.size;
                }
                forEach(a, b) {
                    this._snapshot.docs.forEach((c)=>{
                        a.call(b, new hX(this._firestore, this._userDataWriter, c.key, c, new hV(this._snapshot.mutatedKeys.has(c.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(a = {}) {
                    const b = !!a.includeMetadataChanges;
                    if (b && this._snapshot.excludesMetadataChanges) throw new y(x.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return ((this._cachedChanges && this._cachedChangesIncludeMetadataChanges === b) || ((this._cachedChanges = (function(a, b) {
                        if (a._snapshot.oldDocs.isEmpty()) {
                            let c = 0;
                            return a._snapshot.docChanges.map((b)=>({
                                    type: "added",
                                    doc: new hX(a._firestore, a._userDataWriter, b.doc.key, b.doc, new hV(a._snapshot.mutatedKeys.has(b.doc.key), a._snapshot.fromCache), a.query.converter),
                                    oldIndex: -1,
                                    newIndex: c++
                                }));
                        }
                        {
                            let d = a._snapshot.oldDocs;
                            return a._snapshot.docChanges.filter((a)=>b || 3 !== a.type).map((b)=>{
                                const c = new hX(a._firestore, a._userDataWriter, b.doc.key, b.doc, new hV(a._snapshot.mutatedKeys.has(b.doc.key), a._snapshot.fromCache), a.query.converter);
                                let e = -1, f = -1;
                                return (0 !== b.type && ((e = d.indexOf(b.doc.key)), (d = d.delete(b.doc.key))), 1 !== b.type && ((d = d.add(b.doc)), (f = d.indexOf(b.doc.key))), {
                                    type: hZ(b.type),
                                    doc: c,
                                    oldIndex: e,
                                    newIndex: f
                                });
                            });
                        }
                    })(this, b)), (this._cachedChangesIncludeMetadataChanges = b)), this._cachedChanges);
                }
            }
            function hZ(a) {
                switch(a){
                    case 0:
                        return "added";
                    case 2:
                    case 3:
                        return "modified";
                    case 1:
                        return "removed";
                    default:
                        return t();
                }
            }
            function h$(a, b) {
                return a instanceof hW && b instanceof hW ? a._firestore === b._firestore && a._key.isEqual(b._key) && (null === a._document ? null === b._document : a._document.isEqual(b._document)) && a._converter === b._converter : a instanceof hY && b instanceof hY && a._firestore === b._firestore && g2(a.query, b.query) && a.metadata.isEqual(b.metadata) && a._snapshot.isEqual(b._snapshot);
            }
            function h_(a) {
                if (aY(a) && 0 === a.explicitOrderBy.length) throw new y(x.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
            }
            class h0 {
            }
            function h1(a, ...b) {
                for (const c of b)a = c._apply(a);
                return a;
            }
            class h2 extends (null && h0) {
                constructor(a, b, c){
                    super(), (this.Gc = a), (this.zc = b), (this.Hc = c), (this.type = "where");
                }
                _apply(a) {
                    const b = hy(a.firestore), c = (function(a, b, c, d, e, f, g) {
                        let h;
                        if (e.isKeyField()) {
                            if ("array-contains" === f || "array-contains-any" === f) throw new y(x.INVALID_ARGUMENT, `Invalid Query. You can't perform '${f}' queries on FieldPath.documentId().`);
                            if ("in" === f || "not-in" === f) {
                                ii(g, f);
                                const i = [];
                                for (const j of g)i.push(ih(d, a, j));
                                h = {
                                    arrayValue: {
                                        values: i
                                    }
                                };
                            } else h = ih(d, a, g);
                        } else ("in" !== f && "not-in" !== f && "array-contains-any" !== f) || ii(g, f), (h = hI(c, b, g, "in" === f || "not-in" === f));
                        const k = aE.create(e, f, h);
                        return ((function(a, b) {
                            if (b.v()) {
                                const c = a$(a);
                                if (null !== c && !c.isEqual(b.field)) throw new y(x.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${c.toString()}' and '${b.field.toString()}'`);
                                const d = aZ(a);
                                null !== d && ij(a, b.field, d);
                            }
                            const e = (function(a, b) {
                                for (const c of a.filters)if (b.indexOf(c.op) >= 0) return c.op;
                                return null;
                            })(a, (function(a) {
                                switch(a){
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
                            })(b.op));
                            if (null !== e) throw e === b.op ? new y(x.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${b.op.toString()}' filter.`) : new y(x.INVALID_ARGUMENT, `Invalid query. You cannot use '${b.op.toString()}' filters with '${e.toString()}' filters.`);
                        })(a, k), k);
                    })(a._query, "where", b, a.firestore._databaseId, this.Gc, this.zc, this.Hc);
                    return new gY(a.firestore, a.converter, (function(a, b) {
                        const c = a.filters.concat([
                            b
                        ]);
                        return new aU(a.path, a.collectionGroup, a.explicitOrderBy.slice(), c, a.limit, a.limitType, a.startAt, a.endAt);
                    })(a._query, c));
                }
            }
            function h3(a, b, c) {
                const d = b, e = hU("where", a);
                return new h2(e, d, c);
            }
            class h4 extends (null && h0) {
                constructor(a, b){
                    super(), (this.Gc = a), (this.Jc = b), (this.type = "orderBy");
                }
                _apply(a) {
                    const b = (function(a, b, c) {
                        if (null !== a.startAt) throw new y(x.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
                        if (null !== a.endAt) throw new y(x.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
                        const d = new aQ(b, c);
                        return ((function(a, b) {
                            if (null === aZ(a)) {
                                const c = a$(a);
                                null !== c && ij(a, c, b.field);
                            }
                        })(a, d), d);
                    })(a._query, this.Gc, this.Jc);
                    return new gY(a.firestore, a.converter, (function(a, b) {
                        const c = a.explicitOrderBy.concat([
                            b
                        ]);
                        return new aU(a.path, a.collectionGroup, c, a.filters.slice(), a.limit, a.limitType, a.startAt, a.endAt);
                    })(a._query, b));
                }
            }
            function h5(a, b = "asc") {
                const c = b, d = hU("orderBy", a);
                return new h4(d, c);
            }
            class h6 extends (null && h0) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Yc = b), (this.Xc = c);
                }
                _apply(a) {
                    return new gY(a.firestore, a.converter, a2(a._query, this.Yc, this.Xc));
                }
            }
            function h7(a) {
                return gT("limit", a), new h6("limit", a, "F");
            }
            function h8(a) {
                return (gT("limitToLast", a), new h6("limitToLast", a, "L"));
            }
            class h9 extends (null && h0) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Zc = b), (this.ta = c);
                }
                _apply(a) {
                    const b = ig(a, this.type, this.Zc, this.ta);
                    return new gY(a.firestore, a.converter, (function(a, b) {
                        return new aU(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, b, a.endAt);
                    })(a._query, b));
                }
            }
            function ia(...a) {
                return new h9("startAt", a, !0);
            }
            function ib(...a) {
                return new h9("startAfter", a, !1);
            }
            class ic extends (null && h0) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Zc = b), (this.ta = c);
                }
                _apply(a) {
                    const b = ig(a, this.type, this.Zc, this.ta);
                    return new gY(a.firestore, a.converter, (function(a, b) {
                        return new aU(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, a.startAt, b);
                    })(a._query, b));
                }
            }
            function id(...a) {
                return new ic("endBefore", a, !0);
            }
            function ie(...a) {
                return new ic("endAt", a, !1);
            }
            function ig(a, b, c, d) {
                if (((c[0] = getModularInstance(c[0])), c[0] instanceof hS)) return (function(a, b, c, d, e) {
                    if (!d) throw new y(x.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${c}().`);
                    const f = [];
                    for (const g of a0(a))if (g.field.isKeyField()) f.push(ao(b, d.key));
                    else {
                        const h = d.data.field(g.field);
                        if (aa(h)) throw new y(x.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + g.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
                        if (null === h) {
                            const i = g.field.canonicalString();
                            throw new y(x.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${i}' (used as the orderBy) does not exist.`);
                        }
                        f.push(h);
                    }
                    return new aO(f, e);
                })(a._query, a.firestore._databaseId, b, c[0]._document, d);
                {
                    const e = hy(a.firestore);
                    return (function(a, b, c, d, e, f) {
                        const g = a.explicitOrderBy;
                        if (e.length > g.length) throw new y(x.INVALID_ARGUMENT, `Too many arguments provided to ${d}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
                        const h = [];
                        for(let i = 0; i < e.length; i++){
                            const j = e[i];
                            if (g[i].field.isKeyField()) {
                                if ("string" != typeof j) throw new y(x.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${d}(), but got a ${typeof j}`);
                                if (!a_(a) && -1 !== j.indexOf("/")) throw new y(x.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to ${d}() must be a plain document ID, but '${j}' contains a slash.`);
                                const k = a.path.child(S.fromString(j));
                                if (!ag.isDocumentKey(k)) throw new y(x.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to ${d}() must result in a valid document path, but '${k}' is not because it contains an odd number of segments.`);
                                const l = new ag(k);
                                h.push(ao(b, l));
                            } else {
                                const m = hI(c, d, j);
                                h.push(m);
                            }
                        }
                        return new aO(h, f);
                    })(a._query, a.firestore._databaseId, e, b, c, d);
                }
            }
            function ih(a, b, c) {
                if ("string" == typeof (c = getModularInstance(c))) {
                    if ("" === c) throw new y(x.INVALID_ARGUMENT, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");
                    if (!a_(b) && -1 !== c.indexOf("/")) throw new y(x.INVALID_ARGUMENT, `Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '${c}' contains a '/' character.`);
                    const d = b.path.child(S.fromString(c));
                    if (!ag.isDocumentKey(d)) throw new y(x.INVALID_ARGUMENT, `Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '${d}' is not because it has an odd number of segments (${d.length}).`);
                    return ao(a, new ag(d));
                }
                if (c instanceof gX) return ao(a, c._key);
                throw new y(x.INVALID_ARGUMENT, `Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: ${gR(c)}.`);
            }
            function ii(a, b) {
                if (!Array.isArray(a) || 0 === a.length) throw new y(x.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${b.toString()}' filters.`);
                if (a.length > 10) throw new y(x.INVALID_ARGUMENT, `Invalid Query. '${b.toString()}' filters support a maximum of 10 elements in the value array.`);
            }
            function ij(a, b, c) {
                if (!c.isEqual(b)) throw new y(x.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${b.toString()}' and so you must also use '${b.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${c.toString()}' instead.`);
            }
            class ik {
                convertValue(a, b = "none") {
                    switch(ah(a)){
                        case 0:
                            return null;
                        case 1:
                            return a.booleanValue;
                        case 2:
                            return $(a.integerValue || a.doubleValue);
                        case 3:
                            return this.convertTimestamp(a.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(a, b);
                        case 5:
                            return a.stringValue;
                        case 6:
                            return this.convertBytes(_(a.bytesValue));
                        case 7:
                            return this.convertReference(a.referenceValue);
                        case 8:
                            return this.convertGeoPoint(a.geoPointValue);
                        case 9:
                            return this.convertArray(a.arrayValue, b);
                        case 10:
                            return this.convertObject(a.mapValue, b);
                        default:
                            throw t();
                    }
                }
                convertObject(a, b) {
                    const c = {};
                    return (P(a.fields, (a, d)=>{
                        c[a] = this.convertValue(d, b);
                    }), c);
                }
                convertGeoPoint(a) {
                    return new hr($(a.latitude), $(a.longitude));
                }
                convertArray(a, b) {
                    return (a.values || []).map((a)=>this.convertValue(a, b));
                }
                convertServerTimestamp(a, b) {
                    switch(b){
                        case "previous":
                            const c = ab(a);
                            return null == c ? null : this.convertValue(c, b);
                        case "estimate":
                            return this.convertTimestamp(ac(a));
                        default:
                            return null;
                    }
                }
                convertTimestamp(a) {
                    const b = Z(a);
                    return new M(b.seconds, b.nanos);
                }
                convertDocumentKey(a, b) {
                    const c = S.fromString(a);
                    u(cH(c));
                    const d = new gL(c.get(1), c.get(3)), e = new ag(c.popFirst(5));
                    return (d.isEqual(b) || q(`Document ${e} contains a document reference within a different database (${d.projectId}/${d.database}) which is not supported. It will be treated as a reference in the current database (${b.projectId}/${b.database}) instead.`), e);
                }
            }
            function il(a, b, c) {
                let d;
                return ((d = a ? c && (c.merge || c.mergeFields) ? a.toFirestore(b, c) : a.toFirestore(b) : b), d);
            }
            class im extends (null && ik) {
                constructor(a){
                    super(), (this.firestore = a);
                }
                convertBytes(a) {
                    return new hp(a);
                }
                convertReference(a) {
                    const b = this.convertDocumentKey(a, this.firestore._databaseId);
                    return new gX(this.firestore, null, b);
                }
            }
            class io {
                constructor(a, b){
                    (this._firestore = a), (this._commitHandler = b), (this._mutations = []), (this._committed = !1), (this._dataReader = hy(a));
                }
                set(a, b, c) {
                    this._verifyNotCommitted();
                    const d = ip(a, this._firestore), e = il(d.converter, b, c), f = hz(this._dataReader, "WriteBatch.set", d._key, e, null !== d.converter, c);
                    return (this._mutations.push(f.toMutation(d._key, br.none())), this);
                }
                update(a, b, c, ...d) {
                    this._verifyNotCommitted();
                    const e = ip(a, this._firestore);
                    let f;
                    return ((f = "string" == typeof (b = getModularInstance(b)) || b instanceof hn ? hH(this._dataReader, "WriteBatch.update", e._key, b, c, d) : hG(this._dataReader, "WriteBatch.update", e._key, b)), this._mutations.push(f.toMutation(e._key, br.exists(!0))), this);
                }
                delete(a) {
                    this._verifyNotCommitted();
                    const b = ip(a, this._firestore);
                    return ((this._mutations = this._mutations.concat(new bE(b._key, br.none()))), this);
                }
                commit() {
                    return (this._verifyNotCommitted(), (this._committed = !0), this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve());
                }
                _verifyNotCommitted() {
                    if (this._committed) throw new y(x.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
                }
            }
            function ip(a, b) {
                if ((a = getModularInstance(a)).firestore !== b) throw new y(x.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
                return a;
            }
            function iq(a) {
                a = gS(a, gX);
                const b = gS(a.firestore, g7);
                return gD(ha(b), a._key).then((c)=>iE(b, a, c));
            }
            class ir extends ik {
                constructor(a){
                    super(), (this.firestore = a);
                }
                convertBytes(a) {
                    return new hp(a);
                }
                convertReference(a) {
                    const b = this.convertDocumentKey(a, this.firestore._databaseId);
                    return new gX(this.firestore, null, b);
                }
            }
            function is(a) {
                a = gS(a, gX);
                const b = gS(a.firestore, g7), c = ha(b), d = new ir(b);
                return gC(c, a._key).then((c)=>new hW(b, d, a._key, c, new hV(null !== c && c.hasLocalMutations, !0), a.converter));
            }
            function it(a) {
                a = gS(a, gX);
                const b = gS(a.firestore, g7);
                return gD(ha(b), a._key, {
                    source: "server"
                }).then((c)=>iE(b, a, c));
            }
            function iu(a) {
                a = gS(a, gY);
                const b = gS(a.firestore, g7), c = ha(b), d = new ir(b);
                return (h_(a._query), gF(c, a._query).then((c)=>new hY(b, d, a, c)));
            }
            function iv(a) {
                a = gS(a, gY);
                const b = gS(a.firestore, g7), c = ha(b), d = new ir(b);
                return gE(c, a._query).then((c)=>new hY(b, d, a, c));
            }
            function iw(a) {
                a = gS(a, gY);
                const b = gS(a.firestore, g7), c = ha(b), d = new ir(b);
                return gF(c, a._query, {
                    source: "server"
                }).then((c)=>new hY(b, d, a, c));
            }
            function ix(a, b, c) {
                a = gS(a, gX);
                const d = gS(a.firestore, g7), e = il(a.converter, b, c);
                return iD(d, [
                    hz(hy(d), "setDoc", a._key, e, null !== a.converter, c).toMutation(a._key, br.none()), 
                ]);
            }
            function iy(a, b, c, ...d) {
                a = gS(a, gX);
                const e = gS(a.firestore, g7), f = hy(e);
                let g;
                g = "string" == typeof ((b = getModularInstance(b))) || b instanceof hn ? hH(f, "updateDoc", a._key, b, c, d) : hG(f, "updateDoc", a._key, b);
                return iD(e, [
                    g.toMutation(a._key, br.exists(!0))
                ]);
            }
            function iz(a) {
                return iD(gS(a.firestore, g7), [
                    new bE(a._key, br.none())
                ]);
            }
            function iA(a, b) {
                const c = gS(a.firestore, g7), d = g0(a), e = il(a.converter, b);
                return iD(c, [
                    hz(hy(a.firestore), "addDoc", d._key, e, null !== a.converter, {}).toMutation(d._key, br.exists(!1)), 
                ]).then(()=>d);
            }
            function iB(a, ...b) {
                var c, d, e;
                a = getModularInstance(a);
                let f = {
                    includeMetadataChanges: !1
                }, g = 0;
                "object" != typeof b[g] || g4(b[g]) || ((f = b[g]), g++);
                const h = {
                    includeMetadataChanges: f.includeMetadataChanges
                };
                if (g4(b[g])) {
                    const i = b[g];
                    (b[g] = null === (c = i.next) || void 0 === c ? void 0 : c.bind(i)), (b[g + 1] = null === (d = i.error) || void 0 === d ? void 0 : d.bind(i)), (b[g + 2] = null === (e = i.complete) || void 0 === e ? void 0 : e.bind(i));
                }
                let j, k, l;
                if (a instanceof gX) (k = gS(a.firestore, g7)), (l = aW(a._key.path)), (j = {
                    next: (c)=>{
                        b[g] && b[g](iE(k, a, c));
                    },
                    error: b[g + 1],
                    complete: b[g + 2]
                });
                else {
                    const m = gS(a, gY);
                    (k = gS(m.firestore, g7)), (l = m._query);
                    const n = new ir(k);
                    (j = {
                        next: (a)=>{
                            b[g] && b[g](new hY(k, n, m, a));
                        },
                        error: b[g + 1],
                        complete: b[g + 2]
                    }), h_(a._query);
                }
                return (function(a, b, c, d) {
                    const e = new gm(d), f = new fC(b, e, c);
                    return (a.asyncQueue.enqueueAndForget(async ()=>fx(await gz(a), f)), ()=>{
                        e.ec(), a.asyncQueue.enqueueAndForget(async ()=>fy(await gz(a), f));
                    });
                })(ha(k), l, h, j);
            }
            function iC(a, b) {
                return gG(ha((a = gS(a, g7))), g4(b) ? b : {
                    next: b
                });
            }
            function iD(a, b) {
                return (function(a, b) {
                    const c = new z();
                    return (a.asyncQueue.enqueueAndForget(async ()=>fQ(await gy(a), b, c)), c.promise);
                })(ha(a), b);
            }
            function iE(a, b, c) {
                const d = c.docs.get(b._key), e = new ir(a);
                return new hW(a, e, b._key, d, new hV(c.hasPendingWrites, c.fromCache), b.converter);
            }
            class iF extends (null && class {
                constructor(a, b){
                    (this._firestore = a), (this._transaction = b), (this._dataReader = hy(a));
                }
                get(a) {
                    const b = ip(a, this._firestore), c = new im(this._firestore);
                    return this._transaction.lookup([
                        b._key
                    ]).then((a)=>{
                        if (!a || 1 !== a.length) return t();
                        const d = a[0];
                        if (d.isFoundDocument()) return new hS(this._firestore, c, d.key, d, b.converter);
                        if (d.isNoDocument()) return new hS(this._firestore, c, b._key, null, b.converter);
                        throw t();
                    });
                }
                set(a, b, c) {
                    const d = ip(a, this._firestore), e = il(d.converter, b, c), f = hz(this._dataReader, "Transaction.set", d._key, e, null !== d.converter, c);
                    return this._transaction.set(d._key, f), this;
                }
                update(a, b, c, ...d) {
                    const e = ip(a, this._firestore);
                    let f;
                    return ((f = "string" == typeof (b = getModularInstance(b)) || b instanceof hn ? hH(this._dataReader, "Transaction.update", e._key, b, c, d) : hG(this._dataReader, "Transaction.update", e._key, b)), this._transaction.update(e._key, f), this);
                }
                delete(a) {
                    const b = ip(a, this._firestore);
                    return this._transaction.delete(b._key), this;
                }
            }) {
                constructor(a, b){
                    super(a, b), (this._firestore = a);
                }
                get(a) {
                    const b = ip(a, this._firestore), c = new ir(this._firestore);
                    return super.get(a).then((a)=>new hW(this._firestore, c, b._key, a._document, new hV(!1, !1), b.converter));
                }
            }
            function iG(a, b) {
                return gH(ha((a = gS(a, g7))), (c)=>b(new iF(a, c)));
            }
            function iH() {
                return new hA("deleteField");
            }
            function iI() {
                return new hC("serverTimestamp");
            }
            function iJ(...a) {
                return new hD("arrayUnion", a);
            }
            function iK(...a) {
                return new hE("arrayRemove", a);
            }
            function iL(a) {
                return new hF("increment", a);
            }
            function iM(a) {
                return ha((a = gS(a, g7))), new io(a, (b)=>iD(a, b));
            }
            !(function(a, b = !0) {
                !(function(a) {
                    l = a;
                })(d.Jn), (0, d.Xd)(new e.wA("firestore", (a, { options: c  })=>{
                    const d = a.getProvider("app").getImmediate(), e = new g7(d, new D(a.getProvider("auth-internal")));
                    return ((c = Object.assign({
                        useFetchStreams: b
                    }, c)), e._setSettings(c), e);
                }, "PUBLIC")), (0, d.KN)(j, "3.3.0", a), (0, d.KN)(j, "3.3.0", "esm2017");
            })();
        }
    }, 
]);
