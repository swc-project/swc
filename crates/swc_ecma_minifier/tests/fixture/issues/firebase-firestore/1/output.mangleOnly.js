"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        16
    ],
    {
        19: function(S, I, d) {
            d.d(I, {
                hJ: function() {
                    return g3;
                },
                PL: function() {
                    return iu;
                }
            });
            var T = d(2238);
            var U = d(8463);
            var J = d(3333);
            var V = d(4444);
            var W = d(3510);
            var X = d(4155);
            const Y = "@firebase/firestore";
            class b {
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
            (b.UNAUTHENTICATED = new b(null)), (b.GOOGLE_CREDENTIALS = new b("google-credentials-uid")), (b.FIRST_PARTY = new b("first-party-uid")), (b.MOCK_USER = new b("mock-user"));
            let Z = "9.4.0";
            const $ = new J.Yd("@firebase/firestore");
            function _() {
                return $.logLevel;
            }
            function aa(a) {
                $.setLogLevel(a);
            }
            function ab(a, ...b) {
                if ($.logLevel <= J["in"].DEBUG) {
                    const c = b.map(ae);
                    $.debug(`Firestore (${Z}): ${a}`, ...c);
                }
            }
            function ac(a, ...b) {
                if ($.logLevel <= J["in"].ERROR) {
                    const c = b.map(ae);
                    $.error(`Firestore (${Z}): ${a}`, ...c);
                }
            }
            function ad(a, ...b) {
                if ($.logLevel <= J["in"].WARN) {
                    const c = b.map(ae);
                    $.warn(`Firestore (${Z}): ${a}`, ...c);
                }
            }
            function ae(a) {
                if ("string" == typeof a) return a;
                try {
                    return (c = a), JSON.stringify(c);
                } catch (b) {
                    return a;
                }
                var c;
            }
            function af(b = "Unexpected state") {
                const a = `FIRESTORE (${Z}) INTERNAL ASSERTION FAILED: ` + b;
                throw (ac(a), new Error(a));
            }
            function ag(a, b) {
                a || af();
            }
            function ah(a, b) {
                a || af();
            }
            function ai(a, b) {
                return a;
            }
            const aj = {
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
            class K extends Error {
                constructor(b, a){
                    super(a), (this.code = b), (this.message = a), (this.name = "FirebaseError"), (this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`);
                }
            }
            class ak {
                constructor(){
                    this.promise = new Promise((a, b)=>{
                        (this.resolve = a), (this.reject = b);
                    });
                }
            }
            class al {
                constructor(a, b){
                    (this.user = b), (this.type = "OAuth"), (this.authHeaders = {}), (this.authHeaders.Authorization = `Bearer ${a}`);
                }
            }
            class am {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(a, c) {
                    a.enqueueRetryable(()=>c(b.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class an {
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
            class ao {
                constructor(a){
                    (this.t = a), (this.currentUser = b.UNAUTHENTICATED), (this.i = 0), (this.forceRefresh = !1), (this.auth = null);
                }
                start(b, c) {
                    let d = this.i;
                    const e = (a)=>this.i !== d ? ((d = this.i), c(a)) : Promise.resolve();
                    let f = new ak();
                    this.o = ()=>{
                        this.i++, (this.currentUser = this.u()), f.resolve(), (f = new ak()), b.enqueueRetryable(()=>e(this.currentUser));
                    };
                    const a = ()=>{
                        const a = f;
                        b.enqueueRetryable(async ()=>{
                            await a.promise, await e(this.currentUser);
                        });
                    }, g = (b)=>{
                        ab("FirebaseCredentialsProvider", "Auth detected"), (this.auth = b), this.auth.addAuthTokenListener(this.o), a();
                    };
                    this.t.onInit((a)=>g(a)), setTimeout(()=>{
                        if (!this.auth) {
                            const a = this.t.getImmediate({
                                optional: !0
                            });
                            a ? g(a) : (ab("FirebaseCredentialsProvider", "Auth not yet detected"), f.resolve(), (f = new ak()));
                        }
                    }, 0), a();
                }
                getToken() {
                    const b = this.i, a = this.forceRefresh;
                    return ((this.forceRefresh = !1), this.auth ? this.auth.getToken(a).then((a)=>this.i !== b ? (ab("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : a ? (ag("string" == typeof a.accessToken), new al(a.accessToken, this.currentUser)) : null) : Promise.resolve(null));
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                u() {
                    const a = this.auth && this.auth.getUid();
                    return ag(null === a || "string" == typeof a), new b(a);
                }
            }
            class ap {
                constructor(a, c, d){
                    (this.h = a), (this.l = c), (this.m = d), (this.type = "FirstParty"), (this.user = b.FIRST_PARTY);
                }
                get authHeaders() {
                    const a = {
                        "X-Goog-AuthUser": this.l
                    }, b = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    return (b && (a.Authorization = b), this.m && (a["X-Goog-Iam-Authorization-Token"] = this.m), a);
                }
            }
            class aq {
                constructor(a, b, c){
                    (this.h = a), (this.l = b), (this.m = c);
                }
                getToken() {
                    return Promise.resolve(new ap(this.h, this.l, this.m));
                }
                start(a, c) {
                    a.enqueueRetryable(()=>c(b.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            class L {
                constructor(b, a){
                    (this.previousValue = b), a && ((a.sequenceNumberHandler = (a)=>this.g(a)), (this.p = (b)=>a.writeSequenceNumber(b)));
                }
                g(a) {
                    return ((this.previousValue = Math.max(a, this.previousValue)), this.previousValue);
                }
                next() {
                    const a = ++this.previousValue;
                    return this.p && this.p(a), a;
                }
            }
            function ar(d) {
                const a = "undefined" != typeof self && (self.crypto || self.msCrypto), b = new Uint8Array(d);
                if (a && "function" == typeof a.getRandomValues) a.getRandomValues(b);
                else for(let c = 0; c < d; c++)b[c] = Math.floor(256 * Math.random());
                return b;
            }
            L.T = -1;
            class as {
                static I() {
                    const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / a.length) * a.length;
                    let b = "";
                    for(; b.length < 20;){
                        const d = ar(40);
                        for(let c = 0; c < d.length; ++c)b.length < 20 && d[c] < e && (b += a.charAt(d[c] % a.length));
                    }
                    return b;
                }
            }
            function M(a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            }
            function at(a, b, c) {
                return (a.length === b.length && a.every((a, d)=>c(a, b[d])));
            }
            function au(a) {
                return a + "\0";
            }
            class av {
                constructor(a, b){
                    if (((this.seconds = a), (this.nanoseconds = b), b < 0)) throw new K(aj.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + b);
                    if (b >= 1e9) throw new K(aj.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + b);
                    if (a < -62135596800) throw new K(aj.INVALID_ARGUMENT, "Timestamp seconds out of range: " + a);
                    if (a >= 253402300800) throw new K(aj.INVALID_ARGUMENT, "Timestamp seconds out of range: " + a);
                }
                static now() {
                    return av.fromMillis(Date.now());
                }
                static fromDate(a) {
                    return av.fromMillis(a.getTime());
                }
                static fromMillis(a) {
                    const b = Math.floor(a / 1e3), c = Math.floor(1e6 * (a - 1e3 * b));
                    return new av(b, c);
                }
                toDate() {
                    return new Date(this.toMillis());
                }
                toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(a) {
                    return this.seconds === a.seconds ? M(this.nanoseconds, a.nanoseconds) : M(this.seconds, a.seconds);
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
            class aw {
                constructor(a){
                    this.timestamp = a;
                }
                static fromTimestamp(a) {
                    return new aw(a);
                }
                static min() {
                    return new aw(new av(0, 0));
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
            function ax(a) {
                let b = 0;
                for(const c in a)Object.prototype.hasOwnProperty.call(a, c) && b++;
                return b;
            }
            function ay(a, c) {
                for(const b in a)Object.prototype.hasOwnProperty.call(a, b) && c(b, a[b]);
            }
            function az(a) {
                for(const b in a)if (Object.prototype.hasOwnProperty.call(a, b)) return !1;
                return !0;
            }
            class z {
                constructor(b, a, c){
                    void 0 === a ? (a = 0) : a > b.length && af(), void 0 === c ? (c = b.length - a) : c > b.length - a && af(), (this.segments = b), (this.offset = a), (this.len = c);
                }
                get length() {
                    return this.len;
                }
                isEqual(a) {
                    return 0 === z.comparator(this, a);
                }
                child(a) {
                    const b = this.segments.slice(this.offset, this.limit());
                    return (a instanceof z ? a.forEach((a)=>{
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
                isPrefixOf(b) {
                    if (b.length < this.length) return !1;
                    for(let a = 0; a < this.length; a++)if (this.get(a) !== b.get(a)) return !1;
                    return !0;
                }
                isImmediateParentOf(b) {
                    if (this.length + 1 !== b.length) return !1;
                    for(let a = 0; a < this.length; a++)if (this.get(a) !== b.get(a)) return !1;
                    return !0;
                }
                forEach(b) {
                    for(let a = this.offset, c = this.limit(); a < c; a++)b(this.segments[a]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(a, b) {
                    const f = Math.min(a.length, b.length);
                    for(let c = 0; c < f; c++){
                        const d = a.get(c), e = b.get(c);
                        if (d < e) return -1;
                        if (d > e) return 1;
                    }
                    return a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
                }
            }
            class aA extends z {
                construct(a, b, c) {
                    return new aA(a, b, c);
                }
                canonicalString() {
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                static fromString(...c) {
                    const b = [];
                    for (const a of c){
                        if (a.indexOf("//") >= 0) throw new K(aj.INVALID_ARGUMENT, `Invalid segment (${a}). Paths must not contain // in them.`);
                        b.push(...a.split("/").filter((a)=>a.length > 0));
                    }
                    return new aA(b);
                }
                static emptyPath() {
                    return new aA([]);
                }
            }
            const aB = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            class aC extends z {
                construct(a, b, c) {
                    return new aC(a, b, c);
                }
                static isValidIdentifier(a) {
                    return aB.test(a);
                }
                canonicalString() {
                    return this.toArray().map((a)=>((a = a.replace(/\\/g, "\\\\").replace(/`/g, "\\`")), aC.isValidIdentifier(a) || (a = "`" + a + "`"), a)).join(".");
                }
                toString() {
                    return this.canonicalString();
                }
                isKeyField() {
                    return 1 === this.length && "__name__" === this.get(0);
                }
                static keyField() {
                    return new aC([
                        "__name__"
                    ]);
                }
                static fromServerFormat(b) {
                    const h = [];
                    let f = "", a = 0;
                    const g = ()=>{
                        if (0 === f.length) throw new K(aj.INVALID_ARGUMENT, `Invalid field path (${b}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        h.push(f), (f = "");
                    };
                    let c = !1;
                    for(; a < b.length;){
                        const d = b[a];
                        if ("\\" === d) {
                            if (a + 1 === b.length) throw new K(aj.INVALID_ARGUMENT, "Path has trailing escape character: " + b);
                            const e = b[a + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new K(aj.INVALID_ARGUMENT, "Path has invalid escape sequence: " + b);
                            (f += e), (a += 2);
                        } else "`" === d ? ((c = !c), a++) : "." !== d || c ? ((f += d), a++) : (g(), a++);
                    }
                    if ((g(), c)) throw new K(aj.INVALID_ARGUMENT, "Unterminated ` in path: " + b);
                    return new aC(h);
                }
                static emptyPath() {
                    return new aC([]);
                }
            }
            class aD {
                constructor(a){
                    (this.fields = a), a.sort(aC.comparator);
                }
                covers(a) {
                    for (const b of this.fields)if (b.isPrefixOf(a)) return !0;
                    return !1;
                }
                isEqual(a) {
                    return at(this.fields, a.fields, (a, b)=>a.isEqual(b));
                }
            }
            function aE() {
                return "undefined" != typeof atob;
            }
            class A {
                constructor(a){
                    this.binaryString = a;
                }
                static fromBase64String(a) {
                    const b = atob(a);
                    return new A(b);
                }
                static fromUint8Array(a) {
                    const b = (function(b) {
                        let c = "";
                        for(let a = 0; a < b.length; ++a)c += String.fromCharCode(b[a]);
                        return c;
                    })(a);
                    return new A(b);
                }
                toBase64() {
                    return (a = this.binaryString), btoa(a);
                    var a;
                }
                toUint8Array() {
                    return (function(b) {
                        const c = new Uint8Array(b.length);
                        for(let a = 0; a < b.length; a++)c[a] = b.charCodeAt(a);
                        return c;
                    })(this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(a) {
                    return M(this.binaryString, a.binaryString);
                }
                isEqual(a) {
                    return this.binaryString === a.binaryString;
                }
            }
            A.EMPTY_BYTE_STRING = new A("");
            const aF = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            function aG(a) {
                if ((ag(!!a), "string" == typeof a)) {
                    let d = 0;
                    const b = aF.exec(a);
                    if ((ag(!!b), b[1])) {
                        let c = b[1];
                        (c = (c + "000000000").substr(0, 9)), (d = Number(c));
                    }
                    const e = new Date(a);
                    return {
                        seconds: Math.floor(e.getTime() / 1e3),
                        nanos: d
                    };
                }
                return {
                    seconds: aH(a.seconds),
                    nanos: aH(a.nanos)
                };
            }
            function aH(a) {
                return "number" == typeof a ? a : "string" == typeof a ? Number(a) : 0;
            }
            function aI(a) {
                return "string" == typeof a ? A.fromBase64String(a) : A.fromUint8Array(a);
            }
            function aJ(c) {
                var a, b;
                return ("server_timestamp" === (null === (b = ((null === (a = null == c ? void 0 : c.mapValue) || void 0 === a ? void 0 : a.fields) || {}).__type__) || void 0 === b ? void 0 : b.stringValue));
            }
            function aK(b) {
                const a = b.mapValue.fields.__previous_value__;
                return aJ(a) ? aK(a) : a;
            }
            function aL(b) {
                const a = aG(b.mapValue.fields.__local_write_time__.timestampValue);
                return new av(a.seconds, a.nanos);
            }
            function aM(a) {
                return null == a;
            }
            function aN(a) {
                return 0 === a && 1 / a == -1 / 0;
            }
            function aO(a) {
                return ("number" == typeof a && Number.isInteger(a) && !aN(a) && a <= Number.MAX_SAFE_INTEGER && a >= Number.MIN_SAFE_INTEGER);
            }
            class l {
                constructor(a){
                    this.path = a;
                }
                static fromPath(a) {
                    return new l(aA.fromString(a));
                }
                static fromName(a) {
                    return new l(aA.fromString(a).popFirst(5));
                }
                hasCollectionId(a) {
                    return (this.path.length >= 2 && this.path.get(this.path.length - 2) === a);
                }
                isEqual(a) {
                    return (null !== a && 0 === aA.comparator(this.path, a.path));
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(a, b) {
                    return aA.comparator(a.path, b.path);
                }
                static isDocumentKey(a) {
                    return a.length % 2 == 0;
                }
                static fromSegments(a) {
                    return new l(new aA(a.slice()));
                }
            }
            function aP(a) {
                return "nullValue" in a ? 0 : "booleanValue" in a ? 1 : "integerValue" in a || "doubleValue" in a ? 2 : "timestampValue" in a ? 3 : "stringValue" in a ? 5 : "bytesValue" in a ? 6 : "referenceValue" in a ? 7 : "geoPointValue" in a ? 8 : "arrayValue" in a ? 9 : "mapValue" in a ? aJ(a) ? 4 : 10 : af();
            }
            function aQ(a, b) {
                const c = aP(a);
                if (c !== aP(b)) return !1;
                switch(c){
                    case 0:
                        return !0;
                    case 1:
                        return a.booleanValue === b.booleanValue;
                    case 4:
                        return aL(a).isEqual(aL(b));
                    case 3:
                        return (function(a, b) {
                            if ("string" == typeof a.timestampValue && "string" == typeof b.timestampValue && a.timestampValue.length === b.timestampValue.length) return (a.timestampValue === b.timestampValue);
                            const c = aG(a.timestampValue), d = aG(b.timestampValue);
                            return (c.seconds === d.seconds && c.nanos === d.nanos);
                        })(a, b);
                    case 5:
                        return a.stringValue === b.stringValue;
                    case 6:
                        return (function(a, b) {
                            return aI(a.bytesValue).isEqual(aI(b.bytesValue));
                        })(a, b);
                    case 7:
                        return a.referenceValue === b.referenceValue;
                    case 8:
                        return (function(a, b) {
                            return (aH(a.geoPointValue.latitude) === aH(b.geoPointValue.latitude) && aH(a.geoPointValue.longitude) === aH(b.geoPointValue.longitude));
                        })(a, b);
                    case 2:
                        return (function(a, b) {
                            if ("integerValue" in a && "integerValue" in b) return (aH(a.integerValue) === aH(b.integerValue));
                            if ("doubleValue" in a && "doubleValue" in b) {
                                const c = aH(a.doubleValue), d = aH(b.doubleValue);
                                return c === d ? aN(c) === aN(d) : isNaN(c) && isNaN(d);
                            }
                            return !1;
                        })(a, b);
                    case 9:
                        return at(a.arrayValue.values || [], b.arrayValue.values || [], aQ);
                    case 10:
                        return (function(d, e) {
                            const a = d.mapValue.fields || {}, c = e.mapValue.fields || {};
                            if (ax(a) !== ax(c)) return !1;
                            for(const b in a)if (a.hasOwnProperty(b) && (void 0 === c[b] || !aQ(a[b], c[b]))) return !1;
                            return !0;
                        })(a, b);
                    default:
                        return af();
                }
            }
            function aR(a, b) {
                return void 0 !== (a.values || []).find((a)=>aQ(a, b));
            }
            function aS(a, b) {
                const c = aP(a), d = aP(b);
                if (c !== d) return M(c, d);
                switch(c){
                    case 0:
                        return 0;
                    case 1:
                        return M(a.booleanValue, b.booleanValue);
                    case 2:
                        return (function(c, d) {
                            const a = aH(c.integerValue || c.doubleValue), b = aH(d.integerValue || d.doubleValue);
                            return a < b ? -1 : a > b ? 1 : a === b ? 0 : isNaN(a) ? isNaN(b) ? 0 : -1 : 1;
                        })(a, b);
                    case 3:
                        return aT(a.timestampValue, b.timestampValue);
                    case 4:
                        return aT(aL(a), aL(b));
                    case 5:
                        return M(a.stringValue, b.stringValue);
                    case 6:
                        return (function(a, b) {
                            const c = aI(a), d = aI(b);
                            return c.compareTo(d);
                        })(a.bytesValue, b.bytesValue);
                    case 7:
                        return (function(e, f) {
                            const b = e.split("/"), c = f.split("/");
                            for(let a = 0; a < b.length && a < c.length; a++){
                                const d = M(b[a], c[a]);
                                if (0 !== d) return d;
                            }
                            return M(b.length, c.length);
                        })(a.referenceValue, b.referenceValue);
                    case 8:
                        return (function(a, b) {
                            const c = M(aH(a.latitude), aH(b.latitude));
                            if (0 !== c) return c;
                            return M(aH(a.longitude), aH(b.longitude));
                        })(a.geoPointValue, b.geoPointValue);
                    case 9:
                        return (function(e, f) {
                            const b = e.values || [], c = f.values || [];
                            for(let a = 0; a < b.length && a < c.length; ++a){
                                const d = aS(b[a], c[a]);
                                if (d) return d;
                            }
                            return M(b.length, c.length);
                        })(a.arrayValue, b.arrayValue);
                    case 10:
                        return (function(h, i) {
                            const d = h.fields || {}, b = Object.keys(d), e = i.fields || {}, c = Object.keys(e);
                            b.sort(), c.sort();
                            for(let a = 0; a < b.length && a < c.length; ++a){
                                const f = M(b[a], c[a]);
                                if (0 !== f) return f;
                                const g = aS(d[b[a]], e[c[a]]);
                                if (0 !== g) return g;
                            }
                            return M(b.length, c.length);
                        })(a.mapValue, b.mapValue);
                    default:
                        throw af();
                }
            }
            function aT(a, b) {
                if ("string" == typeof a && "string" == typeof b && a.length === b.length) return M(a, b);
                const c = aG(a), d = aG(b), e = M(c.seconds, d.seconds);
                return 0 !== e ? e : M(c.nanos, d.nanos);
            }
            function aU(a) {
                return aV(a);
            }
            function aV(a) {
                return "nullValue" in a ? "null" : "booleanValue" in a ? "" + a.booleanValue : "integerValue" in a ? "" + a.integerValue : "doubleValue" in a ? "" + a.doubleValue : "timestampValue" in a ? (function(b) {
                    const a = aG(b);
                    return `time(${a.seconds},${a.nanos})`;
                })(a.timestampValue) : "stringValue" in a ? a.stringValue : "bytesValue" in a ? aI(a.bytesValue).toBase64() : "referenceValue" in a ? ((c = a.referenceValue), l.fromName(c).toString()) : "geoPointValue" in a ? `geo(${(b = a.geoPointValue).latitude},${b.longitude})` : "arrayValue" in a ? (function(c) {
                    let a = "[", b = !0;
                    for (const d of c.values || [])b ? (b = !1) : (a += ","), (a += aV(d));
                    return a + "]";
                })(a.arrayValue) : "mapValue" in a ? (function(b) {
                    const e = Object.keys(b.fields || {}).sort();
                    let a = "{", c = !0;
                    for (const d of e)c ? (c = !1) : (a += ","), (a += `${d}:${aV(b.fields[d])}`);
                    return a + "}";
                })(a.mapValue) : af();
                var b, c;
            }
            function aW(a, b) {
                return {
                    referenceValue: `projects/${a.projectId}/databases/${a.database}/documents/${b.path.canonicalString()}`
                };
            }
            function aX(a) {
                return !!a && "integerValue" in a;
            }
            function aY(a) {
                return !!a && "arrayValue" in a;
            }
            function aZ(a) {
                return !!a && "nullValue" in a;
            }
            function a$(a) {
                return (!!a && "doubleValue" in a && isNaN(Number(a.doubleValue)));
            }
            function a_(a) {
                return !!a && "mapValue" in a;
            }
            function a0(a) {
                if (a.geoPointValue) return {
                    geoPointValue: Object.assign({}, a.geoPointValue)
                };
                if (a.timestampValue && "object" == typeof a.timestampValue) return {
                    timestampValue: Object.assign({}, a.timestampValue)
                };
                if (a.mapValue) {
                    const d = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return (ay(a.mapValue.fields, (a, b)=>(d.mapValue.fields[a] = a0(b))), d);
                }
                if (a.arrayValue) {
                    const c = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let b = 0; b < (a.arrayValue.values || []).length; ++b)c.arrayValue.values[b] = a0(a.arrayValue.values[b]);
                    return c;
                }
                return Object.assign({}, a);
            }
            class a1 {
                constructor(a){
                    this.value = a;
                }
                static empty() {
                    return new a1({
                        mapValue: {}
                    });
                }
                field(b) {
                    if (b.isEmpty()) return this.value;
                    {
                        let a = this.value;
                        for(let c = 0; c < b.length - 1; ++c)if (((a = (a.mapValue.fields || {})[b.get(c)]), !a_(a))) return null;
                        return ((a = (a.mapValue.fields || {})[b.lastSegment()]), a || null);
                    }
                }
                set(a, b) {
                    this.getFieldsMap(a.popLast())[a.lastSegment()] = a0(b);
                }
                setAll(a) {
                    let b = aC.emptyPath(), c = {}, d = [];
                    a.forEach((e, a)=>{
                        if (!b.isImmediateParentOf(a)) {
                            const f = this.getFieldsMap(b);
                            this.applyChanges(f, c, d), (c = {}), (d = []), (b = a.popLast());
                        }
                        e ? (c[a.lastSegment()] = a0(e)) : d.push(a.lastSegment());
                    });
                    const e = this.getFieldsMap(b);
                    this.applyChanges(e, c, d);
                }
                delete(b) {
                    const a = this.field(b.popLast());
                    a_(a) && a.mapValue.fields && delete a.mapValue.fields[b.lastSegment()];
                }
                isEqual(a) {
                    return aQ(this.value, a.value);
                }
                getFieldsMap(d) {
                    let a = this.value;
                    a.mapValue.fields || (a.mapValue = {
                        fields: {}
                    });
                    for(let c = 0; c < d.length; ++c){
                        let b = a.mapValue.fields[d.get(c)];
                        (a_(b) && b.mapValue.fields) || ((b = {
                            mapValue: {
                                fields: {}
                            }
                        }), (a.mapValue.fields[d.get(c)] = b)), (a = b);
                    }
                    return a.mapValue.fields;
                }
                applyChanges(a, b, c) {
                    ay(b, (b, c)=>(a[b] = c));
                    for (const d of c)delete a[d];
                }
                clone() {
                    return new a1(a0(this.value));
                }
            }
            function a2(a) {
                const b = [];
                return (ay(a.fields, (e, c)=>{
                    const a = new aC([
                        e
                    ]);
                    if (a_(c)) {
                        const d = a2(c.mapValue).fields;
                        if (0 === d.length) b.push(a);
                        else for (const f of d)b.push(a.child(f));
                    } else b.push(a);
                }), new aD(b));
            }
            class a3 {
                constructor(a, b, c, d, e){
                    (this.key = a), (this.documentType = b), (this.version = c), (this.data = d), (this.documentState = e);
                }
                static newInvalidDocument(a) {
                    return new a3(a, 0, aw.min(), a1.empty(), 0);
                }
                static newFoundDocument(a, b, c) {
                    return new a3(a, 1, b, c, 0);
                }
                static newNoDocument(a, b) {
                    return new a3(a, 2, b, a1.empty(), 0);
                }
                static newUnknownDocument(a, b) {
                    return new a3(a, 3, b, a1.empty(), 2);
                }
                convertToFoundDocument(a, b) {
                    return ((this.version = a), (this.documentType = 1), (this.data = b), (this.documentState = 0), this);
                }
                convertToNoDocument(a) {
                    return ((this.version = a), (this.documentType = 2), (this.data = a1.empty()), (this.documentState = 0), this);
                }
                convertToUnknownDocument(a) {
                    return ((this.version = a), (this.documentType = 3), (this.data = a1.empty()), (this.documentState = 2), this);
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
                    return (a instanceof a3 && this.key.isEqual(a.key) && this.version.isEqual(a.version) && this.documentType === a.documentType && this.documentState === a.documentState && this.data.isEqual(a.data));
                }
                clone() {
                    return new a3(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            class a4 {
                constructor(a, b = null, c = [], d = [], e = null, f = null, g = null){
                    (this.path = a), (this.collectionGroup = b), (this.orderBy = c), (this.filters = d), (this.limit = e), (this.startAt = f), (this.endAt = g), (this.A = null);
                }
            }
            function a5(a, b = null, c = [], d = [], e = null, f = null, g = null) {
                return new a4(a, b, c, d, e, f, g);
            }
            function a6(c) {
                const a = ai(c);
                if (null === a.A) {
                    let b = a.path.canonicalString();
                    null !== a.collectionGroup && (b += "|cg:" + a.collectionGroup), (b += "|f:"), (b += a.filters.map((a)=>ba(a)).join(",")), (b += "|ob:"), (b += a.orderBy.map((a)=>(function(a) {
                            return (a.field.canonicalString() + a.dir);
                        })(a)).join(",")), aM(a.limit) || ((b += "|l:"), (b += a.limit)), a.startAt && ((b += "|lb:"), (b += bk(a.startAt))), a.endAt && ((b += "|ub:"), (b += bk(a.endAt))), (a.A = b);
                }
                return a.A;
            }
            function a7(a) {
                let b = a.path.canonicalString();
                return (null !== a.collectionGroup && (b += " collectionGroup=" + a.collectionGroup), a.filters.length > 0 && (b += `, filters: [${a.filters.map((a)=>{
                    return `${(b = a).field.canonicalString()} ${b.op} ${aU(b.value)}`;
                    var b;
                }).join(", ")}]`), aM(a.limit) || (b += ", limit: " + a.limit), a.orderBy.length > 0 && (b += `, orderBy: [${a.orderBy.map((a)=>(function(a) {
                        return `${a.field.canonicalString()} (${a.dir})`;
                    })(a)).join(", ")}]`), a.startAt && (b += ", startAt: " + bk(a.startAt)), a.endAt && (b += ", endAt: " + bk(a.endAt)), `Target(${b})`);
            }
            function a8(a, b) {
                if (a.limit !== b.limit) return !1;
                if (a.orderBy.length !== b.orderBy.length) return !1;
                for(let c = 0; c < a.orderBy.length; c++)if (!bm(a.orderBy[c], b.orderBy[c])) return !1;
                if (a.filters.length !== b.filters.length) return !1;
                for(let d = 0; d < a.filters.length; d++)if (((e = a.filters[d]), (f = b.filters[d]), e.op !== f.op || !e.field.isEqual(f.field) || !aQ(e.value, f.value))) return !1;
                var e, f;
                return (a.collectionGroup === b.collectionGroup && !!a.path.isEqual(b.path) && !!bo(a.startAt, b.startAt) && bo(a.endAt, b.endAt));
            }
            function a9(a) {
                return (l.isDocumentKey(a.path) && null === a.collectionGroup && 0 === a.filters.length);
            }
            class e extends class {
            } {
                constructor(a, b, c){
                    super(), (this.field = a), (this.op = b), (this.value = c);
                }
                static create(b, a, c) {
                    return b.isKeyField() ? "in" === a || "not-in" === a ? this.R(b, a, c) : new bb(b, a, c) : "array-contains" === a ? new bf(b, c) : "in" === a ? new bg(b, c) : "not-in" === a ? new bh(b, c) : "array-contains-any" === a ? new bi(b, c) : new e(b, a, c);
                }
                static R(a, c, b) {
                    return "in" === c ? new bc(a, b) : new bd(a, b);
                }
                matches(b) {
                    const a = b.data.field(this.field);
                    return "!=" === this.op ? null !== a && this.P(aS(a, this.value)) : null !== a && aP(this.value) === aP(a) && this.P(aS(a, this.value));
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
                            return af();
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
            function ba(a) {
                return (a.field.canonicalString() + a.op.toString() + aU(a.value));
            }
            class bb extends e {
                constructor(b, c, a){
                    super(b, c, a), (this.key = l.fromName(a.referenceValue));
                }
                matches(a) {
                    const b = l.comparator(a.key, this.key);
                    return this.P(b);
                }
            }
            class bc extends e {
                constructor(b, a){
                    super(b, "in", a), (this.keys = be("in", a));
                }
                matches(a) {
                    return this.keys.some((b)=>b.isEqual(a.key));
                }
            }
            class bd extends e {
                constructor(b, a){
                    super(b, "not-in", a), (this.keys = be("not-in", a));
                }
                matches(a) {
                    return !this.keys.some((b)=>b.isEqual(a.key));
                }
            }
            function be(c, b) {
                var a;
                return ((null === (a = b.arrayValue) || void 0 === a ? void 0 : a.values) || []).map((a)=>l.fromName(a.referenceValue));
            }
            class bf extends e {
                constructor(a, b){
                    super(a, "array-contains", b);
                }
                matches(b) {
                    const a = b.data.field(this.field);
                    return aY(a) && aR(a.arrayValue, this.value);
                }
            }
            class bg extends e {
                constructor(a, b){
                    super(a, "in", b);
                }
                matches(b) {
                    const a = b.data.field(this.field);
                    return null !== a && aR(this.value.arrayValue, a);
                }
            }
            class bh extends e {
                constructor(a, b){
                    super(a, "not-in", b);
                }
                matches(b) {
                    if (aR(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const a = b.data.field(this.field);
                    return null !== a && !aR(this.value.arrayValue, a);
                }
            }
            class bi extends e {
                constructor(a, b){
                    super(a, "array-contains-any", b);
                }
                matches(b) {
                    const a = b.data.field(this.field);
                    return (!(!aY(a) || !a.arrayValue.values) && a.arrayValue.values.some((a)=>aR(this.value.arrayValue, a)));
                }
            }
            class bj {
                constructor(a, b){
                    (this.position = a), (this.before = b);
                }
            }
            function bk(a) {
                return `${a.before ? "b" : "a"}:${a.position.map((a)=>aU(a)).join(",")}`;
            }
            class bl {
                constructor(a, b = "asc"){
                    (this.field = a), (this.dir = b);
                }
            }
            function bm(a, b) {
                return a.dir === b.dir && a.field.isEqual(b.field);
            }
            function bn(c, g, e) {
                let a = 0;
                for(let b = 0; b < c.position.length; b++){
                    const d = g[b], f = c.position[b];
                    if (d.field.isKeyField()) a = l.comparator(l.fromName(f.referenceValue), e.key);
                    else {
                        a = aS(f, e.data.field(d.field));
                    }
                    if (("desc" === d.dir && (a *= -1), 0 !== a)) break;
                }
                return c.before ? a <= 0 : a < 0;
            }
            function bo(a, b) {
                if (null === a) return null === b;
                if (null === b) return !1;
                if (a.before !== b.before || a.position.length !== b.position.length) return !1;
                for(let c = 0; c < a.position.length; c++){
                    if (!aQ(a.position[c], b.position[c])) return !1;
                }
                return !0;
            }
            class bp {
                constructor(a, b = null, c = [], d = [], e = null, f = "F", g = null, h = null){
                    (this.path = a), (this.collectionGroup = b), (this.explicitOrderBy = c), (this.filters = d), (this.limit = e), (this.limitType = f), (this.startAt = g), (this.endAt = h), (this.V = null), (this.S = null), this.startAt, this.endAt;
                }
            }
            function bq(a, b, c, d, e, f, g, h) {
                return new bp(a, b, c, d, e, f, g, h);
            }
            function br(a) {
                return new bp(a);
            }
            function bs(a) {
                return !aM(a.limit) && "F" === a.limitType;
            }
            function bt(a) {
                return !aM(a.limit) && "L" === a.limitType;
            }
            function bu(a) {
                return a.explicitOrderBy.length > 0 ? a.explicitOrderBy[0].field : null;
            }
            function bv(b) {
                for (const a of b.filters)if (a.v()) return a.field;
                return null;
            }
            function bw(a) {
                return null !== a.collectionGroup;
            }
            function bx(e) {
                const a = ai(e);
                if (null === a.V) {
                    a.V = [];
                    const b = bv(a), f = bu(a);
                    if (null !== b && null === f) b.isKeyField() || a.V.push(new bl(b)), a.V.push(new bl(aC.keyField(), "asc"));
                    else {
                        let c = !1;
                        for (const d of a.explicitOrderBy)a.V.push(d), d.field.isKeyField() && (c = !0);
                        if (!c) {
                            const g = a.explicitOrderBy.length > 0 ? a.explicitOrderBy[a.explicitOrderBy.length - 1].dir : "asc";
                            a.V.push(new bl(aC.keyField(), g));
                        }
                    }
                }
                return a.V;
            }
            function by(d) {
                const a = ai(d);
                if (!a.S) if ("F" === a.limitType) a.S = a5(a.path, a.collectionGroup, bx(a), a.filters, a.limit, a.startAt, a.endAt);
                else {
                    const b = [];
                    for (const c of bx(a)){
                        const e = "desc" === c.dir ? "asc" : "desc";
                        b.push(new bl(c.field, e));
                    }
                    const f = a.endAt ? new bj(a.endAt.position, !a.endAt.before) : null, g = a.startAt ? new bj(a.startAt.position, !a.startAt.before) : null;
                    a.S = a5(a.path, a.collectionGroup, b, a.filters, a.limit, f, g);
                }
                return a.S;
            }
            function bz(a, b, c) {
                return new bp(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), b, c, a.startAt, a.endAt);
            }
            function bA(a, b) {
                return a8(by(a), by(b)) && a.limitType === b.limitType;
            }
            function bB(a) {
                return `${a6(by(a))}|lt:${a.limitType}`;
            }
            function bC(a) {
                return `Query(target=${a7(by(a))}; limitType=${a.limitType})`;
            }
            function bD(b, a) {
                return (a.isFoundDocument() && (function(a, c) {
                    const b = c.key.path;
                    return null !== a.collectionGroup ? c.key.hasCollectionId(a.collectionGroup) && a.path.isPrefixOf(b) : l.isDocumentKey(a.path) ? a.path.isEqual(b) : a.path.isImmediateParentOf(b);
                })(b, a) && (function(b, c) {
                    for (const a of b.explicitOrderBy)if (!a.field.isKeyField() && null === c.data.field(a.field)) return !1;
                    return !0;
                })(b, a) && (function(a, b) {
                    for (const c of a.filters)if (!c.matches(b)) return !1;
                    return !0;
                })(b, a) && (function(a, b) {
                    if (a.startAt && !bn(a.startAt, bx(a), b)) return !1;
                    if (a.endAt && bn(a.endAt, bx(a), b)) return !1;
                    return !0;
                })(b, a));
            }
            function bE(a) {
                return (e, f)=>{
                    let b = !1;
                    for (const c of bx(a)){
                        const d = bF(c, e, f);
                        if (0 !== d) return d;
                        b = b || c.field.isKeyField();
                    }
                    return 0;
                };
            }
            function bF(a, b, c) {
                const d = a.field.isKeyField() ? l.comparator(b.key, c.key) : (function(a, d, e) {
                    const b = d.data.field(a), c = e.data.field(a);
                    return null !== b && null !== c ? aS(b, c) : af();
                })(a.field, b, c);
                switch(a.dir){
                    case "asc":
                        return d;
                    case "desc":
                        return -1 * d;
                    default:
                        return af();
                }
            }
            function bG(b, a) {
                if (b.D) {
                    if (isNaN(a)) return {
                        doubleValue: "NaN"
                    };
                    if (a === 1 / 0) return {
                        doubleValue: "Infinity"
                    };
                    if (a === -1 / 0) return {
                        doubleValue: "-Infinity"
                    };
                }
                return {
                    doubleValue: aN(a) ? "-0" : a
                };
            }
            function bH(a) {
                return {
                    integerValue: "" + a
                };
            }
            function bI(b, a) {
                return aO(a) ? bH(a) : bG(b, a);
            }
            class m {
                constructor(){
                    this._ = void 0;
                }
            }
            function bJ(a, b, c) {
                return a instanceof bM ? (function(a, b) {
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
                })(c, b) : a instanceof bN ? bO(a, b) : a instanceof bP ? bQ(a, b) : (function(a, d) {
                    const b = bL(a, d), c = bS(b) + bS(a.C);
                    return aX(b) && aX(a.C) ? bH(c) : bG(a.N, c);
                })(a, b);
            }
            function bK(a, b, c) {
                return a instanceof bN ? bO(a, b) : a instanceof bP ? bQ(a, b) : c;
            }
            function bL(b, a) {
                return b instanceof bR ? aX((c = a)) || (function(a) {
                    return !!a && "doubleValue" in a;
                })(c) ? a : {
                    integerValue: 0
                } : null;
                var c;
            }
            class bM extends m {
            }
            class bN extends m {
                constructor(a){
                    super(), (this.elements = a);
                }
            }
            function bO(b, c) {
                const a = bT(c);
                for (const d of b.elements)a.some((a)=>aQ(a, d)) || a.push(d);
                return {
                    arrayValue: {
                        values: a
                    }
                };
            }
            class bP extends m {
                constructor(a){
                    super(), (this.elements = a);
                }
            }
            function bQ(b, c) {
                let a = bT(c);
                for (const d of b.elements)a = a.filter((a)=>!aQ(a, d));
                return {
                    arrayValue: {
                        values: a
                    }
                };
            }
            class bR extends m {
                constructor(a, b){
                    super(), (this.N = a), (this.C = b);
                }
            }
            function bS(a) {
                return aH(a.integerValue || a.doubleValue);
            }
            function bT(a) {
                return aY(a) && a.arrayValue.values ? a.arrayValue.values.slice() : [];
            }
            class bU {
                constructor(a, b){
                    (this.field = a), (this.transform = b);
                }
            }
            function bV(a, b) {
                return (a.field.isEqual(b.field) && (function(a, b) {
                    return (a instanceof bN && b instanceof bN) || (a instanceof bP && b instanceof bP) ? at(a.elements, b.elements, aQ) : a instanceof bR && b instanceof bR ? aQ(a.C, b.C) : a instanceof bM && b instanceof bM;
                })(a.transform, b.transform));
            }
            class bW {
                constructor(a, b){
                    (this.version = a), (this.transformResults = b);
                }
            }
            class bX {
                constructor(a, b){
                    (this.updateTime = a), (this.exists = b);
                }
                static none() {
                    return new bX();
                }
                static exists(a) {
                    return new bX(void 0, a);
                }
                static updateTime(a) {
                    return new bX(a);
                }
                get isNone() {
                    return (void 0 === this.updateTime && void 0 === this.exists);
                }
                isEqual(a) {
                    return (this.exists === a.exists && (this.updateTime ? !!a.updateTime && this.updateTime.isEqual(a.updateTime) : !a.updateTime));
                }
            }
            function bY(a, b) {
                return void 0 !== a.updateTime ? b.isFoundDocument() && b.version.isEqual(a.updateTime) : void 0 === a.exists || a.exists === b.isFoundDocument();
            }
            class n {
            }
            function bZ(a, b, c) {
                a instanceof b2 ? (function(a, b, c) {
                    const d = a.value.clone(), e = b5(a.fieldTransforms, b, c.transformResults);
                    d.setAll(e), b.convertToFoundDocument(c.version, d).setHasCommittedMutations();
                })(a, b, c) : a instanceof b3 ? (function(b, a, c) {
                    if (!bY(b.precondition, a)) return void a.convertToUnknownDocument(c.version);
                    const e = b5(b.fieldTransforms, a, c.transformResults), d = a.data;
                    d.setAll(b4(b)), d.setAll(e), a.convertToFoundDocument(c.version, d).setHasCommittedMutations();
                })(a, b, c) : (function(c, a, b) {
                    a.convertToNoDocument(b.version).setHasCommittedMutations();
                })(0, b, c);
            }
            function b$(a, b, c) {
                a instanceof b2 ? (function(b, a, d) {
                    if (!bY(b.precondition, a)) return;
                    const c = b.value.clone(), e = b6(b.fieldTransforms, d, a);
                    c.setAll(e), a.convertToFoundDocument(b1(a), c).setHasLocalMutations();
                })(a, b, c) : a instanceof b3 ? (function(b, a, d) {
                    if (!bY(b.precondition, a)) return;
                    const e = b6(b.fieldTransforms, d, a), c = a.data;
                    c.setAll(b4(b)), c.setAll(e), a.convertToFoundDocument(b1(a), c).setHasLocalMutations();
                })(a, b, c) : (function(b, a) {
                    bY(b.precondition, a) && a.convertToNoDocument(aw.min());
                })(a, b);
            }
            function b_(d, e) {
                let a = null;
                for (const b of d.fieldTransforms){
                    const f = e.data.field(b.field), c = bL(b.transform, f || null);
                    null != c && (null == a && (a = a1.empty()), a.set(b.field, c));
                }
                return a || null;
            }
            function b0(a, b) {
                return (a.type === b.type && !!a.key.isEqual(b.key) && !!a.precondition.isEqual(b.precondition) && !!(function(a, b) {
                    return ((void 0 === a && void 0 === b) || (!(!a || !b) && at(a, b, (a, b)=>bV(a, b))));
                })(a.fieldTransforms, b.fieldTransforms) && (0 === a.type ? a.value.isEqual(b.value) : 1 !== a.type || (a.data.isEqual(b.data) && a.fieldMask.isEqual(b.fieldMask))));
            }
            function b1(a) {
                return a.isFoundDocument() ? a.version : aw.min();
            }
            class b2 extends n {
                constructor(a, b, c, d = []){
                    super(), (this.key = a), (this.value = b), (this.precondition = c), (this.fieldTransforms = d), (this.type = 0);
                }
            }
            class b3 extends n {
                constructor(a, b, c, d, e = []){
                    super(), (this.key = a), (this.data = b), (this.fieldMask = c), (this.precondition = d), (this.fieldTransforms = e), (this.type = 1);
                }
            }
            function b4(a) {
                const b = new Map();
                return (a.fieldMask.fields.forEach((c)=>{
                    if (!c.isEmpty()) {
                        const d = a.data.field(c);
                        b.set(c, d);
                    }
                }), b);
            }
            function b5(d, f, b) {
                const e = new Map();
                ag(d.length === b.length);
                for(let a = 0; a < b.length; a++){
                    const c = d[a], g = c.transform, h = f.data.field(c.field);
                    e.set(c.field, bK(g, h, b[a]));
                }
                return e;
            }
            function b6(c, d, e) {
                const b = new Map();
                for (const a of c){
                    const f = a.transform, g = e.data.field(a.field);
                    b.set(a.field, bJ(f, g, d));
                }
                return b;
            }
            class b7 extends (null && n) {
                constructor(a, b){
                    super(), (this.key = a), (this.precondition = b), (this.type = 2), (this.fieldTransforms = []);
                }
            }
            class b8 extends (null && n) {
                constructor(a, b){
                    super(), (this.key = a), (this.precondition = b), (this.type = 3), (this.fieldTransforms = []);
                }
            }
            class b9 {
                constructor(a){
                    this.count = a;
                }
            }
            var B, a;
            function ca(a) {
                switch(a){
                    default:
                        return af();
                    case aj.CANCELLED:
                    case aj.UNKNOWN:
                    case aj.DEADLINE_EXCEEDED:
                    case aj.RESOURCE_EXHAUSTED:
                    case aj.INTERNAL:
                    case aj.UNAVAILABLE:
                    case aj.UNAUTHENTICATED:
                        return !1;
                    case aj.INVALID_ARGUMENT:
                    case aj.NOT_FOUND:
                    case aj.ALREADY_EXISTS:
                    case aj.PERMISSION_DENIED:
                    case aj.FAILED_PRECONDITION:
                    case aj.ABORTED:
                    case aj.OUT_OF_RANGE:
                    case aj.UNIMPLEMENTED:
                    case aj.DATA_LOSS:
                        return !0;
                }
            }
            function cb(a) {
                if (void 0 === a) return ac("GRPC error has no .code"), aj.UNKNOWN;
                switch(a){
                    case B.OK:
                        return aj.OK;
                    case B.CANCELLED:
                        return aj.CANCELLED;
                    case B.UNKNOWN:
                        return aj.UNKNOWN;
                    case B.DEADLINE_EXCEEDED:
                        return aj.DEADLINE_EXCEEDED;
                    case B.RESOURCE_EXHAUSTED:
                        return aj.RESOURCE_EXHAUSTED;
                    case B.INTERNAL:
                        return aj.INTERNAL;
                    case B.UNAVAILABLE:
                        return aj.UNAVAILABLE;
                    case B.UNAUTHENTICATED:
                        return aj.UNAUTHENTICATED;
                    case B.INVALID_ARGUMENT:
                        return aj.INVALID_ARGUMENT;
                    case B.NOT_FOUND:
                        return aj.NOT_FOUND;
                    case B.ALREADY_EXISTS:
                        return aj.ALREADY_EXISTS;
                    case B.PERMISSION_DENIED:
                        return aj.PERMISSION_DENIED;
                    case B.FAILED_PRECONDITION:
                        return aj.FAILED_PRECONDITION;
                    case B.ABORTED:
                        return aj.ABORTED;
                    case B.OUT_OF_RANGE:
                        return aj.OUT_OF_RANGE;
                    case B.UNIMPLEMENTED:
                        return aj.UNIMPLEMENTED;
                    case B.DATA_LOSS:
                        return aj.DATA_LOSS;
                    default:
                        return af();
                }
            }
            ((a = B || (B = {}))[(a.OK = 0)] = "OK"), (a[(a.CANCELLED = 1)] = "CANCELLED"), (a[(a.UNKNOWN = 2)] = "UNKNOWN"), (a[(a.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"), (a[(a.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"), (a[(a.NOT_FOUND = 5)] = "NOT_FOUND"), (a[(a.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"), (a[(a.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"), (a[(a.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"), (a[(a.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"), (a[(a.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"), (a[(a.ABORTED = 10)] = "ABORTED"), (a[(a.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"), (a[(a.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"), (a[(a.INTERNAL = 13)] = "INTERNAL"), (a[(a.UNAVAILABLE = 14)] = "UNAVAILABLE"), (a[(a.DATA_LOSS = 15)] = "DATA_LOSS");
            class q {
                constructor(a, b){
                    (this.comparator = a), (this.root = b || o.EMPTY);
                }
                insert(a, b) {
                    return new q(this.comparator, this.root.insert(a, b, this.comparator).copy(null, null, o.BLACK, null, null));
                }
                remove(a) {
                    return new q(this.comparator, this.root.remove(a, this.comparator).copy(null, null, o.BLACK, null, null));
                }
                get(c) {
                    let a = this.root;
                    for(; !a.isEmpty();){
                        const b = this.comparator(c, a.key);
                        if (0 === b) return a.value;
                        b < 0 ? (a = a.left) : b > 0 && (a = a.right);
                    }
                    return null;
                }
                indexOf(d) {
                    let b = 0, a = this.root;
                    for(; !a.isEmpty();){
                        const c = this.comparator(d, a.key);
                        if (0 === c) return b + a.left.size;
                        c < 0 ? (a = a.left) : ((b += a.left.size + 1), (a = a.right));
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
                    return new cc(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(a) {
                    return new cc(this.root, a, this.comparator, !1);
                }
                getReverseIterator() {
                    return new cc(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(a) {
                    return new cc(this.root, a, this.comparator, !0);
                }
            }
            class cc {
                constructor(a, c, e, d){
                    (this.isReverse = d), (this.nodeStack = []);
                    let b = 1;
                    for(; !a.isEmpty();)if (((b = c ? e(a.key, c) : 1), d && (b *= -1), b < 0)) a = this.isReverse ? a.left : a.right;
                    else {
                        if (0 === b) {
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
            class o {
                constructor(d, e, a, b, c){
                    (this.key = d), (this.value = e), (this.color = null != a ? a : o.RED), (this.left = null != b ? b : o.EMPTY), (this.right = null != c ? c : o.EMPTY), (this.size = this.left.size + 1 + this.right.size);
                }
                copy(a, b, c, d, e) {
                    return new o(null != a ? a : this.key, null != b ? b : this.value, null != c ? c : this.color, null != d ? d : this.left, null != e ? e : this.right);
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
                insert(b, c, d) {
                    let a = this;
                    const e = d(b, a.key);
                    return ((a = e < 0 ? a.copy(null, null, null, a.left.insert(b, c, d), null) : 0 === e ? a.copy(null, c, null, null, null) : a.copy(null, null, null, null, a.right.insert(b, c, d))), a.fixUp());
                }
                removeMin() {
                    if (this.left.isEmpty()) return o.EMPTY;
                    let a = this;
                    return (a.left.isRed() || a.left.left.isRed() || (a = a.moveRedLeft()), (a = a.copy(null, null, null, a.left.removeMin(), null)), a.fixUp());
                }
                remove(b, c) {
                    let d, a = this;
                    if (c(b, a.key) < 0) a.left.isEmpty() || a.left.isRed() || a.left.left.isRed() || (a = a.moveRedLeft()), (a = a.copy(null, null, null, a.left.remove(b, c), null));
                    else {
                        if ((a.left.isRed() && (a = a.rotateRight()), a.right.isEmpty() || a.right.isRed() || a.right.left.isRed() || (a = a.moveRedRight()), 0 === c(b, a.key))) {
                            if (a.right.isEmpty()) return o.EMPTY;
                            (d = a.right.min()), (a = a.copy(d.key, d.value, null, null, a.right.removeMin()));
                        }
                        a = a.copy(null, null, null, null, a.right.remove(b, c));
                    }
                    return a.fixUp();
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
                    const a = this.copy(null, null, o.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, a, null);
                }
                rotateRight() {
                    const a = this.copy(null, null, o.RED, this.left.right, null);
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
                    if (this.isRed() && this.left.isRed()) throw af();
                    if (this.right.isRed()) throw af();
                    const a = this.left.check();
                    if (a !== this.right.check()) throw af();
                    return a + (this.isRed() ? 0 : 1);
                }
            }
            (o.EMPTY = null), (o.RED = !0), (o.BLACK = !1);
            o.EMPTY = new (class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw af();
                }
                get value() {
                    throw af();
                }
                get color() {
                    throw af();
                }
                get left() {
                    throw af();
                }
                get right() {
                    throw af();
                }
                copy(a, b, c, d, e) {
                    return this;
                }
                insert(a, b, c) {
                    return new o(a, b);
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
            class C {
                constructor(a){
                    (this.comparator = a), (this.data = new q(this.comparator));
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
                forEachInRange(a, d) {
                    const b = this.data.getIteratorFrom(a[0]);
                    for(; b.hasNext();){
                        const c = b.getNext();
                        if (this.comparator(c.key, a[1]) >= 0) return;
                        d(c.key);
                    }
                }
                forEachWhile(c, b) {
                    let a;
                    for(a = void 0 !== b ? this.data.getIteratorFrom(b) : this.data.getIterator(); a.hasNext();){
                        if (!c(a.getNext().key)) return;
                    }
                }
                firstAfterOrEqual(b) {
                    const a = this.data.getIteratorFrom(b);
                    return a.hasNext() ? a.getNext().key : null;
                }
                getIterator() {
                    return new cd(this.data.getIterator());
                }
                getIteratorFrom(a) {
                    return new cd(this.data.getIteratorFrom(a));
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
                    if (!(a instanceof C)) return !1;
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
                copy(b) {
                    const a = new C(this.comparator);
                    return (a.data = b), a;
                }
            }
            class cd {
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
            const ce = new q(l.comparator);
            function cf() {
                return ce;
            }
            const cg = new q(l.comparator);
            function ch() {
                return cg;
            }
            const ci = new q(l.comparator);
            function cj() {
                return ci;
            }
            const ck = new C(l.comparator);
            function cl(...b) {
                let a = ck;
                for (const c of b)a = a.add(c);
                return a;
            }
            const cm = new C(M);
            function cn() {
                return cm;
            }
            class co {
                constructor(a, b, c, d, e){
                    (this.snapshotVersion = a), (this.targetChanges = b), (this.targetMismatches = c), (this.documentUpdates = d), (this.resolvedLimboDocuments = e);
                }
                static createSynthesizedRemoteEventForCurrentChange(a, c) {
                    const b = new Map();
                    return (b.set(a, cp.createSynthesizedTargetChangeForCurrentChange(a, c)), new co(aw.min(), b, cn(), cf(), cl()));
                }
            }
            class cp {
                constructor(a, b, c, d, e){
                    (this.resumeToken = a), (this.current = b), (this.addedDocuments = c), (this.modifiedDocuments = d), (this.removedDocuments = e);
                }
                static createSynthesizedTargetChangeForCurrentChange(b, a) {
                    return new cp(A.EMPTY_BYTE_STRING, a, cl(), cl(), cl());
                }
            }
            class cq {
                constructor(a, b, c, d){
                    (this.k = a), (this.removedTargetIds = b), (this.key = c), (this.$ = d);
                }
            }
            class cr {
                constructor(a, b){
                    (this.targetId = a), (this.O = b);
                }
            }
            class cs {
                constructor(a, b, c = A.EMPTY_BYTE_STRING, d = null){
                    (this.state = a), (this.targetIds = b), (this.resumeToken = c), (this.cause = d);
                }
            }
            class ct {
                constructor(){
                    (this.F = 0), (this.M = cw()), (this.L = A.EMPTY_BYTE_STRING), (this.B = !1), (this.U = !0);
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
                    let a = cl(), b = cl(), c = cl();
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
                                af();
                        }
                    }), new cp(this.L, this.B, a, b, c));
                }
                G() {
                    (this.U = !1), (this.M = cw());
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
            class cu {
                constructor(a){
                    (this.tt = a), (this.et = new Map()), (this.nt = cf()), (this.st = cv()), (this.it = new C(M));
                }
                rt(a) {
                    for (const b of a.k)a.$ && a.$.isFoundDocument() ? this.ot(b, a.$) : this.ct(b, a.key, a.$);
                    for (const c of a.removedTargetIds)this.ct(c, a.key, a.$);
                }
                at(a) {
                    this.forEachTarget(a, (c)=>{
                        const b = this.ut(c);
                        switch(a.state){
                            case 0:
                                this.ht(c) && b.j(a.resumeToken);
                                break;
                            case 1:
                                b.X(), b.q || b.G(), b.j(a.resumeToken);
                                break;
                            case 2:
                                b.X(), b.q || this.removeTarget(c);
                                break;
                            case 3:
                                this.ht(c) && (b.Z(), b.j(a.resumeToken));
                                break;
                            case 4:
                                this.ht(c) && (this.lt(c), b.j(a.resumeToken));
                                break;
                            default:
                                af();
                        }
                    });
                }
                forEachTarget(a, b) {
                    a.targetIds.length > 0 ? a.targetIds.forEach(b) : this.et.forEach((c, a)=>{
                        this.ht(a) && b(a);
                    });
                }
                ft(c) {
                    const a = c.targetId, b = c.O.count, d = this.dt(a);
                    if (d) {
                        const e = d.target;
                        if (a9(e)) if (0 === b) {
                            const f = new l(e.path);
                            this.ct(a, f, a3.newNoDocument(f, aw.min()));
                        } else ag(1 === b);
                        else {
                            this.wt(a) !== b && (this.lt(a), (this.it = this.it.add(a)));
                        }
                    }
                }
                _t(a) {
                    const b = new Map();
                    this.et.forEach((c, d)=>{
                        const f = this.dt(d);
                        if (f) {
                            if (c.current && a9(f.target)) {
                                const e = new l(f.target.path);
                                null !== this.nt.get(e) || this.gt(d, e) || this.ct(d, e, a3.newNoDocument(e, a));
                            }
                            c.K && (b.set(d, c.W()), c.G());
                        }
                    });
                    let c = cl();
                    this.st.forEach((a, b)=>{
                        let d = !0;
                        b.forEachWhile((b)=>{
                            const a = this.dt(b);
                            return (!a || 2 === a.purpose || ((d = !1), !1));
                        }), d && (c = c.add(a));
                    });
                    const d = new co(a, b, this.it, this.nt, c);
                    return ((this.nt = cf()), (this.st = cv()), (this.it = new C(M)), d);
                }
                ot(b, a) {
                    if (!this.ht(b)) return;
                    const c = this.gt(b, a.key) ? 2 : 0;
                    this.ut(b).H(a.key, c), (this.nt = this.nt.insert(a.key, a)), (this.st = this.st.insert(a.key, this.yt(a.key).add(b)));
                }
                ct(b, a, c) {
                    if (!this.ht(b)) return;
                    const d = this.ut(b);
                    this.gt(b, a) ? d.H(a, 1) : d.J(a), (this.st = this.st.insert(a, this.yt(a).delete(b))), c && (this.nt = this.nt.insert(a, c));
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
                ut(b) {
                    let a = this.et.get(b);
                    return a || ((a = new ct()), this.et.set(b, a)), a;
                }
                yt(b) {
                    let a = this.st.get(b);
                    return (a || ((a = new C(M)), (this.st = this.st.insert(b, a))), a);
                }
                ht(a) {
                    const b = null !== this.dt(a);
                    return (b || ab("WatchChangeAggregator", "Detected inactive target", a), b);
                }
                dt(a) {
                    const b = this.et.get(a);
                    return b && b.q ? null : this.tt.Tt(a);
                }
                lt(a) {
                    this.et.set(a, new ct());
                    this.tt.getRemoteKeysForTarget(a).forEach((b)=>{
                        this.ct(a, b, null);
                    });
                }
                gt(a, b) {
                    return this.tt.getRemoteKeysForTarget(a).has(b);
                }
            }
            function cv() {
                return new q(l.comparator);
            }
            function cw() {
                return new q(l.comparator);
            }
            const cx = (()=>{
                const a = {
                    asc: "ASCENDING",
                    desc: "DESCENDING"
                };
                return a;
            })(), cy = (()=>{
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
            class cz {
                constructor(a, b){
                    (this.databaseId = a), (this.D = b);
                }
            }
            function cA(b, a) {
                if (b.D) {
                    return `${new Date(1e3 * a.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + a.nanoseconds).slice(-9)}Z`;
                }
                return {
                    seconds: "" + a.seconds,
                    nanos: a.nanoseconds
                };
            }
            function cB(b, a) {
                return b.D ? a.toBase64() : a.toUint8Array();
            }
            function cC(a, b) {
                return cA(a, b.toTimestamp());
            }
            function cD(a) {
                return (ag(!!a), aw.fromTimestamp((function(b) {
                    const a = aG(b);
                    return new av(a.seconds, a.nanos);
                })(a)));
            }
            function cE(a, b) {
                return (function(a) {
                    return new aA([
                        "projects",
                        a.projectId,
                        "databases",
                        a.database, 
                    ]);
                })(a).child("documents").child(b).canonicalString();
            }
            function cF(b) {
                const a = aA.fromString(b);
                return ag(c5(a)), a;
            }
            function cG(a, b) {
                return cE(a.databaseId, b.path);
            }
            function cH(b, c) {
                const a = cF(c);
                if (a.get(1) !== b.databaseId.projectId) throw new K(aj.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + a.get(1) + " vs " + b.databaseId.projectId);
                if (a.get(3) !== b.databaseId.database) throw new K(aj.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + a.get(3) + " vs " + b.databaseId.database);
                return new l(cL(a));
            }
            function cI(a, b) {
                return cE(a.databaseId, b);
            }
            function cJ(b) {
                const a = cF(b);
                return 4 === a.length ? aA.emptyPath() : cL(a);
            }
            function cK(a) {
                return new aA([
                    "projects",
                    a.databaseId.projectId,
                    "databases",
                    a.databaseId.database, 
                ]).canonicalString();
            }
            function cL(a) {
                return (ag(a.length > 4 && "documents" === a.get(4)), a.popFirst(5));
            }
            function cM(a, b, c) {
                return {
                    name: cG(a, b),
                    fields: c.value.mapValue.fields
                };
            }
            function cN(d, a, c) {
                const e = cH(d, a.name), f = cD(a.updateTime), g = new a1({
                    mapValue: {
                        fields: a.fields
                    }
                }), b = a3.newFoundDocument(e, f, g);
                return (c && b.setHasCommittedMutations(), c ? b.setHasCommittedMutations() : b);
            }
            function cO(b, a) {
                return "found" in a ? (function(b, a) {
                    ag(!!a.found), a.found.name, a.found.updateTime;
                    const c = cH(b, a.found.name), d = cD(a.found.updateTime), e = new a1({
                        mapValue: {
                            fields: a.found.fields
                        }
                    });
                    return a3.newFoundDocument(c, d, e);
                })(b, a) : "missing" in a ? (function(b, a) {
                    ag(!!a.missing), ag(!!a.readTime);
                    const c = cH(b, a.missing), d = cD(a.readTime);
                    return a3.newNoDocument(c, d);
                })(b, a) : af();
            }
            function cP(e, a) {
                let c;
                if ("targetChange" in a) {
                    a.targetChange;
                    const k = (function(a) {
                        return "NO_CHANGE" === a ? 0 : "ADD" === a ? 1 : "REMOVE" === a ? 2 : "CURRENT" === a ? 3 : "RESET" === a ? 4 : af();
                    })(a.targetChange.targetChangeType || "NO_CHANGE"), l = a.targetChange.targetIds || [], m = (function(b, a) {
                        return b.D ? (ag(void 0 === a || "string" == typeof a), A.fromBase64String(a || "")) : (ag(void 0 === a || a instanceof Uint8Array), A.fromUint8Array(a || new Uint8Array()));
                    })(e, a.targetChange.resumeToken), h = a.targetChange.cause, n = h && (function(a) {
                        const b = void 0 === a.code ? aj.UNKNOWN : cb(a.code);
                        return new K(b, a.message || "");
                    })(h);
                    c = new cs(k, l, m, n || null);
                } else if ("documentChange" in a) {
                    a.documentChange;
                    const b = a.documentChange;
                    b.document, b.document.name, b.document.updateTime;
                    const o = cH(e, b.document.name), p = cD(b.document.updateTime), q = new a1({
                        mapValue: {
                            fields: b.document.fields
                        }
                    }), i = a3.newFoundDocument(o, p, q), r = b.targetIds || [], s = b.removedTargetIds || [];
                    c = new cq(r, s, i.key, i);
                } else if ("documentDelete" in a) {
                    a.documentDelete;
                    const d = a.documentDelete;
                    d.document;
                    const t = cH(e, d.document), u = d.readTime ? cD(d.readTime) : aw.min(), j = a3.newNoDocument(t, u), v = d.removedTargetIds || [];
                    c = new cq([], v, j.key, j);
                } else if ("documentRemove" in a) {
                    a.documentRemove;
                    const f = a.documentRemove;
                    f.document;
                    const w = cH(e, f.document), x = f.removedTargetIds || [];
                    c = new cq([], x, w, null);
                } else {
                    if (!("filter" in a)) return af();
                    {
                        a.filter;
                        const g = a.filter;
                        g.targetId;
                        const y = g.count || 0, z = new b9(y), B = g.targetId;
                        c = new cr(B, z);
                    }
                }
                return c;
            }
            function cQ(c, a) {
                let b;
                if (a instanceof b2) b = {
                    update: cM(c, a.key, a.value)
                };
                else if (a instanceof b7) b = {
                    delete: cG(c, a.key)
                };
                else if (a instanceof b3) b = {
                    update: cM(c, a.key, a.data),
                    updateMask: c4(a.fieldMask)
                };
                else {
                    if (!(a instanceof b8)) return af();
                    b = {
                        verify: cG(c, a.key)
                    };
                }
                return (a.fieldTransforms.length > 0 && (b.updateTransforms = a.fieldTransforms.map((a)=>(function(c, b) {
                        const a = b.transform;
                        if (a instanceof bM) return {
                            fieldPath: b.field.canonicalString(),
                            setToServerValue: "REQUEST_TIME"
                        };
                        if (a instanceof bN) return {
                            fieldPath: b.field.canonicalString(),
                            appendMissingElements: {
                                values: a.elements
                            }
                        };
                        if (a instanceof bP) return {
                            fieldPath: b.field.canonicalString(),
                            removeAllFromArray: {
                                values: a.elements
                            }
                        };
                        if (a instanceof bR) return {
                            fieldPath: b.field.canonicalString(),
                            increment: a.C
                        };
                        throw af();
                    })(0, a))), a.precondition.isNone || (b.currentDocument = (function(b, a) {
                    return void 0 !== a.updateTime ? {
                        updateTime: cC(b, a.updateTime)
                    } : void 0 !== a.exists ? {
                        exists: a.exists
                    } : af();
                })(c, a.precondition)), b);
            }
            function cR(c, a) {
                const b = a.currentDocument ? (function(a) {
                    return void 0 !== a.updateTime ? bX.updateTime(cD(a.updateTime)) : void 0 !== a.exists ? bX.exists(a.exists) : bX.none();
                })(a.currentDocument) : bX.none(), d = a.updateTransforms ? a.updateTransforms.map((a)=>(function(c, a) {
                        let b = null;
                        if ("setToServerValue" in a) ag("REQUEST_TIME" === a.setToServerValue), (b = new bM());
                        else if ("appendMissingElements" in a) {
                            const d = a.appendMissingElements.values || [];
                            b = new bN(d);
                        } else if ("removeAllFromArray" in a) {
                            const e = a.removeAllFromArray.values || [];
                            b = new bP(e);
                        } else "increment" in a ? (b = new bR(c, a.increment)) : af();
                        const f = aC.fromServerFormat(a.fieldPath);
                        return new bU(f, b);
                    })(c, a)) : [];
                if (a.update) {
                    a.update.name;
                    const e = cH(c, a.update.name), f = new a1({
                        mapValue: {
                            fields: a.update.fields
                        }
                    });
                    if (a.updateMask) {
                        const g = (function(a) {
                            const b = a.fieldPaths || [];
                            return new aD(b.map((a)=>aC.fromServerFormat(a)));
                        })(a.updateMask);
                        return new b3(e, f, g, b, d);
                    }
                    return new b2(e, f, b, d);
                }
                if (a.delete) {
                    const h = cH(c, a.delete);
                    return new b7(h, b);
                }
                if (a.verify) {
                    const i = cH(c, a.verify);
                    return new b8(i, b);
                }
                return af();
            }
            function cS(a, b) {
                return a && a.length > 0 ? (ag(void 0 !== b), a.map((a)=>(function(a, c) {
                        let b = a.updateTime ? cD(a.updateTime) : cD(c);
                        return (b.isEqual(aw.min()) && (b = cD(c)), new bW(b, a.transformResults || []));
                    })(a, b))) : [];
            }
            function cT(a, b) {
                return {
                    documents: [
                        cI(a, b.path)
                    ]
                };
            }
            function cU(c, a) {
                const b = {
                    structuredQuery: {}
                }, d = a.path;
                null !== a.collectionGroup ? ((b.parent = cI(c, d)), (b.structuredQuery.from = [
                    {
                        collectionId: a.collectionGroup,
                        allDescendants: !0
                    }, 
                ])) : ((b.parent = cI(c, d.popLast())), (b.structuredQuery.from = [
                    {
                        collectionId: d.lastSegment()
                    }, 
                ]));
                const e = (function(b) {
                    if (0 === b.length) return;
                    const a = b.map((a)=>(function(a) {
                            if ("==" === a.op) {
                                if (a$(a.value)) return {
                                    unaryFilter: {
                                        field: c0(a.field),
                                        op: "IS_NAN"
                                    }
                                };
                                if (aZ(a.value)) return {
                                    unaryFilter: {
                                        field: c0(a.field),
                                        op: "IS_NULL"
                                    }
                                };
                            } else if ("!=" === a.op) {
                                if (a$(a.value)) return {
                                    unaryFilter: {
                                        field: c0(a.field),
                                        op: "IS_NOT_NAN"
                                    }
                                };
                                if (aZ(a.value)) return {
                                    unaryFilter: {
                                        field: c0(a.field),
                                        op: "IS_NOT_NULL"
                                    }
                                };
                            }
                            return {
                                fieldFilter: {
                                    field: c0(a.field),
                                    op: c_(a.op),
                                    value: a.value
                                }
                            };
                        })(a));
                    if (1 === a.length) return a[0];
                    return {
                        compositeFilter: {
                            op: "AND",
                            filters: a
                        }
                    };
                })(a.filters);
                e && (b.structuredQuery.where = e);
                const f = (function(a) {
                    if (0 === a.length) return;
                    return a.map((a)=>(function(a) {
                            return {
                                field: c0(a.field),
                                direction: c$(a.dir)
                            };
                        })(a));
                })(a.orderBy);
                f && (b.structuredQuery.orderBy = f);
                const g = (function(b, a) {
                    return b.D || aM(a) ? a : {
                        value: a
                    };
                })(c, a.limit);
                return (null !== g && (b.structuredQuery.limit = g), a.startAt && (b.structuredQuery.startAt = cY(a.startAt)), a.endAt && (b.structuredQuery.endAt = cY(a.endAt)), b);
            }
            function cV(d) {
                let b = cJ(d.parent);
                const a = d.structuredQuery, e = a.from ? a.from.length : 0;
                let f = null;
                if (e > 0) {
                    ag(1 === e);
                    const c = a.from[0];
                    c.allDescendants ? (f = c.collectionId) : (b = b.child(c.collectionId));
                }
                let g = [];
                a.where && (g = cX(a.where));
                let h = [];
                a.orderBy && (h = a.orderBy.map((a)=>(function(a) {
                        return new bl(c1(a.field), (function(a) {
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
                a.limit && (i = (function(a) {
                    let b;
                    return ((b = "object" == typeof a ? a.value : a), aM(b) ? null : b);
                })(a.limit));
                let j = null;
                a.startAt && (j = cZ(a.startAt));
                let k = null;
                return (a.endAt && (k = cZ(a.endAt)), bq(b, f, h, g, i, "F", j, k));
            }
            function cW(c, b) {
                const a = (function(b, a) {
                    switch(a){
                        case 0:
                            return null;
                        case 1:
                            return "existence-filter-mismatch";
                        case 2:
                            return "limbo-document";
                        default:
                            return af();
                    }
                })(0, b.purpose);
                return null == a ? null : {
                    "goog-listen-tags": a
                };
            }
            function cX(a) {
                return a ? void 0 !== a.unaryFilter ? [
                    c3(a)
                ] : void 0 !== a.fieldFilter ? [
                    c2(a)
                ] : void 0 !== a.compositeFilter ? a.compositeFilter.filters.map((a)=>cX(a)).reduce((a, b)=>a.concat(b)) : af() : [];
            }
            function cY(a) {
                return {
                    before: a.before,
                    values: a.position
                };
            }
            function cZ(a) {
                const b = !!a.before, c = a.values || [];
                return new bj(c, b);
            }
            function c$(a) {
                return cx[a];
            }
            function c_(a) {
                return cy[a];
            }
            function c0(a) {
                return {
                    fieldPath: a.canonicalString()
                };
            }
            function c1(a) {
                return aC.fromServerFormat(a.fieldPath);
            }
            function c2(a) {
                return e.create(c1(a.fieldFilter.field), (function(a) {
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
                            return af();
                    }
                })(a.fieldFilter.op), a.fieldFilter.value);
            }
            function c3(a) {
                switch(a.unaryFilter.op){
                    case "IS_NAN":
                        const b = c1(a.unaryFilter.field);
                        return e.create(b, "==", {
                            doubleValue: NaN
                        });
                    case "IS_NULL":
                        const c = c1(a.unaryFilter.field);
                        return e.create(c, "==", {
                            nullValue: "NULL_VALUE"
                        });
                    case "IS_NOT_NAN":
                        const d = c1(a.unaryFilter.field);
                        return e.create(d, "!=", {
                            doubleValue: NaN
                        });
                    case "IS_NOT_NULL":
                        const f = c1(a.unaryFilter.field);
                        return e.create(f, "!=", {
                            nullValue: "NULL_VALUE"
                        });
                    default:
                        return af();
                }
            }
            function c4(a) {
                const b = [];
                return (a.fields.forEach((a)=>b.push(a.canonicalString())), {
                    fieldPaths: b
                });
            }
            function c5(a) {
                return (a.length >= 4 && "projects" === a.get(0) && "databases" === a.get(2));
            }
            function c6(c) {
                let a = "";
                for(let b = 0; b < c.length; b++)a.length > 0 && (a = c8(a)), (a = c7(c.get(b), a));
                return c8(a);
            }
            function c7(c, e) {
                let a = e;
                const f = c.length;
                for(let b = 0; b < f; b++){
                    const d = c.charAt(b);
                    switch(d){
                        case "\0":
                            a += "";
                            break;
                        case "":
                            a += "";
                            break;
                        default:
                            a += d;
                    }
                }
                return a;
            }
            function c8(a) {
                return a + "";
            }
            function c9(a) {
                const e = a.length;
                if ((ag(e >= 2), 2 === e)) return (ag("" === a.charAt(0) && "" === a.charAt(1)), aA.emptyPath());
                const i = e - 2, g = [];
                let b = "";
                for(let d = 0; d < e;){
                    const c = a.indexOf("", d);
                    (c < 0 || c > i) && af();
                    switch(a.charAt(c + 1)){
                        case "":
                            const h = a.substring(d, c);
                            let f;
                            0 === b.length ? (f = h) : ((b += h), (f = b), (b = "")), g.push(f);
                            break;
                        case "":
                            (b += a.substring(d, c)), (b += "\0");
                            break;
                        case "":
                            b += a.substring(d, c + 1);
                            break;
                        default:
                            af();
                    }
                    d = c + 2;
                }
                return new aA(g);
            }
            class da {
                constructor(a, b){
                    (this.seconds = a), (this.nanoseconds = b);
                }
            }
            class r {
                constructor(a, b, c){
                    (this.ownerId = a), (this.allowTabSynchronization = b), (this.leaseTimestampMs = c);
                }
            }
            (r.store = "owner"), (r.key = "owner");
            class s {
                constructor(a, b, c){
                    (this.userId = a), (this.lastAcknowledgedBatchId = b), (this.lastStreamToken = c);
                }
            }
            (s.store = "mutationQueues"), (s.keyPath = "userId");
            class g {
                constructor(a, b, c, d, e){
                    (this.userId = a), (this.batchId = b), (this.localWriteTimeMs = c), (this.baseMutations = d), (this.mutations = e);
                }
            }
            (g.store = "mutations"), (g.keyPath = "batchId"), (g.userMutationsIndex = "userMutationsIndex"), (g.userMutationsKeyPath = [
                "userId",
                "batchId"
            ]);
            class p {
                constructor(){}
                static prefixForUser(a) {
                    return [
                        a
                    ];
                }
                static prefixForPath(a, b) {
                    return [
                        a,
                        c6(b)
                    ];
                }
                static key(a, b, c) {
                    return [
                        a,
                        c6(b),
                        c
                    ];
                }
            }
            (p.store = "documentMutations"), (p.PLACEHOLDER = new p());
            class db {
                constructor(a, b){
                    (this.path = a), (this.readTime = b);
                }
            }
            class dc {
                constructor(a, b){
                    (this.path = a), (this.version = b);
                }
            }
            class f {
                constructor(a, b, c, d, e, f){
                    (this.unknownDocument = a), (this.noDocument = b), (this.document = c), (this.hasCommittedMutations = d), (this.readTime = e), (this.parentPath = f);
                }
            }
            (f.store = "remoteDocuments"), (f.readTimeIndex = "readTimeIndex"), (f.readTimeIndexPath = "readTime"), (f.collectionReadTimeIndex = "collectionReadTimeIndex"), (f.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime", 
            ]);
            class t {
                constructor(a){
                    this.byteSize = a;
                }
            }
            (t.store = "remoteDocumentGlobal"), (t.key = "remoteDocumentGlobalKey");
            class h {
                constructor(a, b, c, d, e, f, g){
                    (this.targetId = a), (this.canonicalId = b), (this.readTime = c), (this.resumeToken = d), (this.lastListenSequenceNumber = e), (this.lastLimboFreeSnapshotVersion = f), (this.query = g);
                }
            }
            (h.store = "targets"), (h.keyPath = "targetId"), (h.queryTargetsIndexName = "queryTargetsIndex"), (h.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ]);
            class i {
                constructor(a, b, c){
                    (this.targetId = a), (this.path = b), (this.sequenceNumber = c);
                }
            }
            (i.store = "targetDocuments"), (i.keyPath = [
                "targetId",
                "path"
            ]), (i.documentTargetsIndex = "documentTargetsIndex"), (i.documentTargetsKeyPath = [
                "path",
                "targetId"
            ]);
            class u {
                constructor(a, b, c, d){
                    (this.highestTargetId = a), (this.highestListenSequenceNumber = b), (this.lastRemoteSnapshotVersion = c), (this.targetCount = d);
                }
            }
            (u.key = "targetGlobalKey"), (u.store = "targetGlobal");
            class v {
                constructor(a, b){
                    (this.collectionId = a), (this.parent = b);
                }
            }
            (v.store = "collectionParents"), (v.keyPath = [
                "collectionId",
                "parent"
            ]);
            class w {
                constructor(a, b, c, d){
                    (this.clientId = a), (this.updateTimeMs = b), (this.networkEnabled = c), (this.inForeground = d);
                }
            }
            (w.store = "clientMetadata"), (w.keyPath = "clientId");
            class x {
                constructor(a, b, c){
                    (this.bundleId = a), (this.createTime = b), (this.version = c);
                }
            }
            (x.store = "bundles"), (x.keyPath = "bundleId");
            class y {
                constructor(a, b, c){
                    (this.name = a), (this.readTime = b), (this.bundledQuery = c);
                }
            }
            (y.store = "namedQueries"), (y.keyPath = "name");
            const dd = [
                ...[
                    ...[
                        ...[
                            ...[
                                s.store,
                                g.store,
                                p.store,
                                f.store,
                                h.store,
                                r.store,
                                u.store,
                                i.store, 
                            ],
                            w.store, 
                        ],
                        t.store, 
                    ],
                    v.store, 
                ],
                x.store,
                y.store, 
            ], de = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
            class D {
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
            class df {
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
                    return (this.callbackAttached && af(), (this.callbackAttached = !0), this.isDone ? this.error ? this.wrapFailure(b, this.error) : this.wrapSuccess(a, this.result) : new df((c, d)=>{
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
                wrapUserFunction(b) {
                    try {
                        const a = b();
                        return a instanceof df ? a : df.resolve(a);
                    } catch (c) {
                        return df.reject(c);
                    }
                }
                wrapSuccess(a, b) {
                    return a ? this.wrapUserFunction(()=>a(b)) : df.resolve(b);
                }
                wrapFailure(a, b) {
                    return a ? this.wrapUserFunction(()=>a(b)) : df.reject(b);
                }
                static resolve(a) {
                    return new df((b, c)=>{
                        b(a);
                    });
                }
                static reject(a) {
                    return new df((c, b)=>{
                        b(a);
                    });
                }
                static waitFor(a) {
                    return new df((b, f)=>{
                        let c = 0, d = 0, e = !1;
                        a.forEach((a)=>{
                            ++c, a.next(()=>{
                                ++d, e && d === c && b();
                            }, (a)=>f(a));
                        }), (e = !0), d === c && b();
                    });
                }
                static or(b) {
                    let a = df.resolve(!1);
                    for (const c of b)a = a.next((a)=>(a ? df.resolve(a) : c()));
                    return a;
                }
                static forEach(a, c) {
                    const b = [];
                    return (a.forEach((a, d)=>{
                        b.push(c.call(this, a, d));
                    }), this.waitFor(b));
                }
            }
            class dg {
                constructor(a, b){
                    (this.action = a), (this.transaction = b), (this.aborted = !1), (this.Et = new ak()), (this.transaction.oncomplete = ()=>{
                        this.Et.resolve();
                    }), (this.transaction.onabort = ()=>{
                        b.error ? this.Et.reject(new dj(a, b.error)) : this.Et.resolve();
                    }), (this.transaction.onerror = (b)=>{
                        const c = dp(b.target.error);
                        this.Et.reject(new dj(a, c));
                    });
                }
                static open(b, a, c, d) {
                    try {
                        return new dg(a, b.transaction(d, c));
                    } catch (e) {
                        throw new dj(a, e);
                    }
                }
                get It() {
                    return this.Et.promise;
                }
                abort(a) {
                    a && this.Et.reject(a), this.aborted || (ab("SimpleDb", "Aborting transaction:", a ? a.message : "Client-initiated abort"), (this.aborted = !0), this.transaction.abort());
                }
                store(a) {
                    const b = this.transaction.objectStore(a);
                    return new dl(b);
                }
            }
            class dh {
                constructor(a, b, c){
                    (this.name = a), (this.version = b), (this.At = c);
                    12.2 === dh.Rt(getUA()) && ac("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
                }
                static delete(a) {
                    return (ab("SimpleDb", "Removing database:", a), dm(window.indexedDB.deleteDatabase(a)).toPromise());
                }
                static bt() {
                    if (!isIndexedDBAvailable()) return !1;
                    if (dh.Pt()) return !0;
                    const a = getUA(), b = dh.Rt(a), d = 0 < b && b < 10, c = dh.vt(a), e = 0 < c && c < 4.5;
                    return !(a.indexOf("MSIE ") > 0 || a.indexOf("Trident/") > 0 || a.indexOf("Edge/") > 0 || d || e);
                }
                static Pt() {
                    var a;
                    return ("undefined" != typeof X && "YES" === (null === (a = X.env) || void 0 === a ? void 0 : a.Vt));
                }
                static St(a, b) {
                    return a.store(b);
                }
                static Rt(b) {
                    const a = b.match(/i(?:phone|pad|pod) os ([\d_]+)/i), c = a ? a[1].split("_").slice(0, 2).join(".") : "-1";
                    return Number(c);
                }
                static vt(b) {
                    const a = b.match(/Android ([\d.]+)/i), c = a ? a[1].split(".").slice(0, 2).join(".") : "-1";
                    return Number(c);
                }
                async Dt(a) {
                    return (this.db || (ab("SimpleDb", "Opening database:", this.name), (this.db = await new Promise((c, d)=>{
                        const b = indexedDB.open(this.name, this.version);
                        (b.onsuccess = (a)=>{
                            const b = a.target.result;
                            c(b);
                        }), (b.onblocked = ()=>{
                            d(new dj(a, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
                        }), (b.onerror = (c)=>{
                            const b = c.target.error;
                            "VersionError" === b.name ? d(new K(aj.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === b.name ? d(new K(aj.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + b)) : d(new dj(a, b));
                        }), (b.onupgradeneeded = (a)=>{
                            ab("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', a.oldVersion);
                            const c = a.target.result;
                            this.At.Ct(c, b.transaction, a.oldVersion, this.version).next(()=>{
                                ab("SimpleDb", "Database upgrade to version " + this.version + " complete");
                            });
                        });
                    }))), this.Nt && (this.db.onversionchange = (a)=>this.Nt(a)), this.db);
                }
                xt(a) {
                    (this.Nt = a), this.db && (this.db.onversionchange = (b)=>a(b));
                }
                async runTransaction(b, g, h, i) {
                    const j = "readonly" === g;
                    let c = 0;
                    for(;;){
                        ++c;
                        try {
                            this.db = await this.Dt(b);
                            const d = dg.open(this.db, b, j ? "readonly" : "readwrite", h), e = i(d).catch((a)=>(d.abort(a), df.reject(a))).toPromise();
                            return (e.catch(()=>{}), await d.It, e);
                        } catch (a) {
                            const f = "FirebaseError" !== a.name && c < 3;
                            if ((ab("SimpleDb", "Transaction failed with error:", a.message, "Retrying:", f), this.close(), !f)) return Promise.reject(a);
                        }
                    }
                }
                close() {
                    this.db && this.db.close(), (this.db = void 0);
                }
            }
            class di {
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
                    return dm(this.kt.delete());
                }
            }
            class dj extends (null && K) {
                constructor(a, b){
                    super(aj.UNAVAILABLE, `IndexedDB transaction '${a}' failed: ${b}`), (this.name = "IndexedDbTransactionError");
                }
            }
            function dk(a) {
                return "IndexedDbTransactionError" === a.name;
            }
            class dl {
                constructor(a){
                    this.store = a;
                }
                put(a, b) {
                    let c;
                    return (void 0 !== b ? (ab("SimpleDb", "PUT", this.store.name, a, b), (c = this.store.put(b, a))) : (ab("SimpleDb", "PUT", this.store.name, "<auto-key>", a), (c = this.store.put(a))), dm(c));
                }
                add(a) {
                    ab("SimpleDb", "ADD", this.store.name, a, a);
                    return dm(this.store.add(a));
                }
                get(a) {
                    return dm(this.store.get(a)).next((b)=>(void 0 === b && (b = null), ab("SimpleDb", "GET", this.store.name, a, b), b));
                }
                delete(a) {
                    ab("SimpleDb", "DELETE", this.store.name, a);
                    return dm(this.store.delete(a));
                }
                count() {
                    ab("SimpleDb", "COUNT", this.store.name);
                    return dm(this.store.count());
                }
                Lt(a, b) {
                    const c = this.cursor(this.options(a, b)), d = [];
                    return this.Bt(c, (b, a)=>{
                        d.push(a);
                    }).next(()=>d);
                }
                Ut(b, c) {
                    ab("SimpleDb", "DELETE ALL", this.store.name);
                    const a = this.options(b, c);
                    a.qt = !1;
                    const d = this.cursor(a);
                    return this.Bt(d, (b, c, a)=>a.delete());
                }
                Kt(c, a) {
                    let b;
                    a ? (b = c) : ((b = {}), (a = c));
                    const d = this.cursor(b);
                    return this.Bt(d, a);
                }
                jt(a) {
                    const b = this.cursor({});
                    return new df((c, d)=>{
                        (b.onerror = (a)=>{
                            const b = dp(a.target.error);
                            d(b);
                        }), (b.onsuccess = (d)=>{
                            const b = d.target.result;
                            b ? a(b.primaryKey, b.value).next((a)=>{
                                a ? b.continue() : c();
                            }) : c();
                        });
                    });
                }
                Bt(a, b) {
                    const c = [];
                    return new df((d, e)=>{
                        (a.onerror = (a)=>{
                            e(a.target.error);
                        }), (a.onsuccess = (g)=>{
                            const a = g.target.result;
                            if (!a) return void d();
                            const e = new di(a), f = b(a.primaryKey, a.value, e);
                            if (f instanceof df) {
                                const h = f.catch((a)=>(e.done(), df.reject(a)));
                                c.push(h);
                            }
                            e.isDone ? d() : null === e.Ft ? a.continue() : a.continue(e.Ft);
                        });
                    }).next(()=>df.waitFor(c));
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
            function dm(a) {
                return new df((b, c)=>{
                    (a.onsuccess = (a)=>{
                        const c = a.target.result;
                        b(c);
                    }), (a.onerror = (a)=>{
                        const b = dp(a.target.error);
                        c(b);
                    });
                });
            }
            let dn = null && !1;
            function dp(a) {
                const b = dh.Rt(getUA());
                if (b >= 12.2 && b < 13) {
                    const c = "An internal error was encountered in the Indexed Database server";
                    if (a.message.indexOf(c) >= 0) {
                        const d = new K("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${c}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
                        return (dn || ((dn = !0), setTimeout(()=>{
                            throw d;
                        }, 0)), d);
                    }
                }
                return a;
            }
            class dq extends (null && D) {
                constructor(a, b){
                    super(), (this.Qt = a), (this.currentSequenceNumber = b);
                }
            }
            function dr(a, b) {
                const c = ai(a);
                return dh.St(c.Qt, b);
            }
            class ds {
                constructor(a, b, c, d){
                    (this.batchId = a), (this.localWriteTime = b), (this.baseMutations = c), (this.mutations = d);
                }
                applyToRemoteDocument(b, d) {
                    const e = d.mutationResults;
                    for(let a = 0; a < this.mutations.length; a++){
                        const c = this.mutations[a];
                        if (c.key.isEqual(b.key)) {
                            bZ(c, b, e[a]);
                        }
                    }
                }
                applyToLocalView(a) {
                    for (const b of this.baseMutations)b.key.isEqual(a.key) && b$(b, a, this.localWriteTime);
                    for (const c of this.mutations)c.key.isEqual(a.key) && b$(c, a, this.localWriteTime);
                }
                applyToLocalDocumentSet(a) {
                    this.mutations.forEach((d)=>{
                        const b = a.get(d.key), c = b;
                        this.applyToLocalView(c), b.isValidDocument() || c.convertToNoDocument(aw.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((a, b)=>a.add(b.key), cl());
                }
                isEqual(a) {
                    return (this.batchId === a.batchId && at(this.mutations, a.mutations, (a, b)=>b0(a, b)) && at(this.baseMutations, a.baseMutations, (a, b)=>b0(a, b)));
                }
            }
            class dt {
                constructor(a, b, c, d){
                    (this.batch = a), (this.commitVersion = b), (this.mutationResults = c), (this.docVersions = d);
                }
                static from(b, f, c) {
                    ag(b.mutations.length === c.length);
                    let d = cj();
                    const e = b.mutations;
                    for(let a = 0; a < e.length; a++)d = d.insert(e[a].key, c[a].version);
                    return new dt(b, f, c, d);
                }
            }
            class du {
                constructor(a, b, c, d, e = aw.min(), f = aw.min(), g = A.EMPTY_BYTE_STRING){
                    (this.target = a), (this.targetId = b), (this.purpose = c), (this.sequenceNumber = d), (this.snapshotVersion = e), (this.lastLimboFreeSnapshotVersion = f), (this.resumeToken = g);
                }
                withSequenceNumber(a) {
                    return new du(this.target, this.targetId, this.purpose, a, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                withResumeToken(a, b) {
                    return new du(this.target, this.targetId, this.purpose, this.sequenceNumber, b, this.lastLimboFreeSnapshotVersion, a);
                }
                withLastLimboFreeSnapshotVersion(a) {
                    return new du(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, a, this.resumeToken);
                }
            }
            class dv {
                constructor(a){
                    this.Wt = a;
                }
            }
            function dw(c, a) {
                if (a.document) return cN(c.Wt, a.document, !!a.hasCommittedMutations);
                if (a.noDocument) {
                    const d = l.fromSegments(a.noDocument.path), e = dB(a.noDocument.readTime), b = a3.newNoDocument(d, e);
                    return a.hasCommittedMutations ? b.setHasCommittedMutations() : b;
                }
                if (a.unknownDocument) {
                    const f = l.fromSegments(a.unknownDocument.path), g = dB(a.unknownDocument.version);
                    return a3.newUnknownDocument(f, g);
                }
                return af();
            }
            function dx(d, a, e) {
                const b = dy(e), c = a.key.path.popLast().toArray();
                if (a.isFoundDocument()) {
                    const g = (function(b, a) {
                        return {
                            name: cG(b, a.key),
                            fields: a.data.value.mapValue.fields,
                            updateTime: cA(b, a.version.toTimestamp())
                        };
                    })(d.Wt, a), h = a.hasCommittedMutations;
                    return new f(null, null, g, h, b, c);
                }
                if (a.isNoDocument()) {
                    const i = a.key.path.toArray(), j = dA(a.version), k = a.hasCommittedMutations;
                    return new f(null, new db(i, j), null, k, b, c);
                }
                if (a.isUnknownDocument()) {
                    const l = a.key.path.toArray(), m = dA(a.version);
                    return new f(new dc(l, m), null, null, !0, b, c);
                }
                return af();
            }
            function dy(b) {
                const a = b.toTimestamp();
                return [
                    a.seconds,
                    a.nanoseconds
                ];
            }
            function dz(a) {
                const b = new av(a[0], a[1]);
                return aw.fromTimestamp(b);
            }
            function dA(b) {
                const a = b.toTimestamp();
                return new da(a.seconds, a.nanoseconds);
            }
            function dB(a) {
                const b = new av(a.seconds, a.nanoseconds);
                return aw.fromTimestamp(b);
            }
            function dC(h, a) {
                const c = (a.baseMutations || []).map((a)=>cR(h.Wt, a));
                for(let b = 0; b < a.mutations.length - 1; ++b){
                    const d = a.mutations[b];
                    if (b + 1 < a.mutations.length && void 0 !== a.mutations[b + 1].transform) {
                        const e = a.mutations[b + 1];
                        (d.updateTransforms = e.transform.fieldTransforms), a.mutations.splice(b + 1, 1), ++b;
                    }
                }
                const f = a.mutations.map((a)=>cR(h.Wt, a)), g = av.fromMillis(a.localWriteTimeMs);
                return new ds(a.batchId, g, c, f);
            }
            function dD(a) {
                const d = dB(a.readTime), e = void 0 !== a.lastLimboFreeSnapshotVersion ? dB(a.lastLimboFreeSnapshotVersion) : aw.min();
                let b;
                var c;
                return (void 0 !== a.query.documents ? (ag(1 === (c = a.query).documents.length), (b = by(br(cJ(c.documents[0]))))) : (b = (function(a) {
                    return by(cV(a));
                })(a.query)), new du(b, a.targetId, 0, a.lastListenSequenceNumber, d, e, A.fromBase64String(a.resumeToken)));
            }
            function dE(b, a) {
                const d = dA(a.snapshotVersion), e = dA(a.lastLimboFreeSnapshotVersion);
                let c;
                c = a9(a.target) ? cT(b.Wt, a.target) : cU(b.Wt, a.target);
                const f = a.resumeToken.toBase64();
                return new h(a.targetId, a6(a.target), d, f, a.sequenceNumber, e, c);
            }
            function dF(a) {
                const b = cV({
                    parent: a.parent,
                    structuredQuery: a.structuredQuery
                });
                return "LAST" === a.limitType ? bz(b, b.limit, "L") : b;
            }
            class dG {
                getBundleMetadata(a, b) {
                    return dH(a).get(b).next((a)=>{
                        if (a) return {
                            id: (b = a).bundleId,
                            createTime: dB(b.createTime),
                            version: b.version
                        };
                        var b;
                    });
                }
                saveBundleMetadata(a, b) {
                    return dH(a).put({
                        bundleId: (c = b).id,
                        createTime: dA(cD(c.createTime)),
                        version: c.version
                    });
                    var c;
                }
                getNamedQuery(a, b) {
                    return dI(a).get(b).next((a)=>{
                        if (a) return {
                            name: (b = a).name,
                            query: dF(b.bundledQuery),
                            readTime: dB(b.readTime)
                        };
                        var b;
                    });
                }
                saveNamedQuery(a, b) {
                    return dI(a).put((function(a) {
                        return {
                            name: a.name,
                            readTime: dA(cD(a.readTime)),
                            bundledQuery: a.bundledQuery
                        };
                    })(b));
                }
            }
            function dH(a) {
                return dr(a, x.store);
            }
            function dI(a) {
                return dr(a, y.store);
            }
            class dJ {
                constructor(){
                    this.Gt = new dK();
                }
                addToCollectionParentIndex(b, a) {
                    return this.Gt.add(a), df.resolve();
                }
                getCollectionParents(b, a) {
                    return df.resolve(this.Gt.getEntries(a));
                }
            }
            class dK {
                constructor(){
                    this.index = {};
                }
                add(a) {
                    const b = a.lastSegment(), c = a.popLast(), d = this.index[b] || new C(aA.comparator), e = !d.has(c);
                    return (this.index[b] = d.add(c)), e;
                }
                has(a) {
                    const c = a.lastSegment(), d = a.popLast(), b = this.index[c];
                    return b && b.has(d);
                }
                getEntries(a) {
                    return (this.index[a] || new C(aA.comparator)).toArray();
                }
            }
            class dL {
                constructor(){
                    this.zt = new dK();
                }
                addToCollectionParentIndex(b, a) {
                    if (!this.zt.has(a)) {
                        const c = a.lastSegment(), d = a.popLast();
                        b.addOnCommittedListener(()=>{
                            this.zt.add(a);
                        });
                        const e = {
                            collectionId: c,
                            parent: c6(d)
                        };
                        return dM(b).put(e);
                    }
                    return df.resolve();
                }
                getCollectionParents(b, a) {
                    const d = [], c = IDBKeyRange.bound([
                        a,
                        ""
                    ], [
                        au(a),
                        ""
                    ], !1, !0);
                    return dM(b).Lt(c).next((c)=>{
                        for (const b of c){
                            if (b.collectionId !== a) break;
                            d.push(c9(b.parent));
                        }
                        return d;
                    });
                }
            }
            function dM(a) {
                return dr(a, v.store);
            }
            const dN = {
                didRun: !1,
                sequenceNumbersCollected: 0,
                targetsRemoved: 0,
                documentsRemoved: 0
            };
            class c {
                constructor(a, b, c){
                    (this.cacheSizeCollectionThreshold = a), (this.percentileToCollect = b), (this.maximumSequenceNumbersToCollect = c);
                }
                static withCacheSize(a) {
                    return new c(a, c.DEFAULT_COLLECTION_PERCENTILE, c.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            function dO(c, e, a) {
                const f = c.store(g.store), h = c.store(p.store), b = [], i = IDBKeyRange.only(a.batchId);
                let m = 0;
                const j = f.Kt({
                    range: i
                }, (b, c, a)=>(m++, a.delete()));
                b.push(j.next(()=>{
                    ag(1 === m);
                }));
                const k = [];
                for (const d of a.mutations){
                    const l = p.key(e, d.key.path, a.batchId);
                    b.push(h.delete(l)), k.push(d.key);
                }
                return df.waitFor(b).next(()=>k);
            }
            function dP(a) {
                if (!a) return 0;
                let b;
                if (a.document) b = a.document;
                else if (a.unknownDocument) b = a.unknownDocument;
                else {
                    if (!a.noDocument) throw af();
                    b = a.noDocument;
                }
                return JSON.stringify(b).length;
            }
            (c.DEFAULT_COLLECTION_PERCENTILE = 10), (c.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3), (c.DEFAULT = new c(41943040, c.DEFAULT_COLLECTION_PERCENTILE, c.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)), (c.DISABLED = new c(-1, 0, 0));
            class dQ {
                constructor(a, b, c, d){
                    (this.userId = a), (this.N = b), (this.Ht = c), (this.referenceDelegate = d), (this.Jt = {});
                }
                static Yt(a, b, c, d) {
                    ag("" !== a.uid);
                    const e = a.isAuthenticated() ? a.uid : "";
                    return new dQ(e, b, c, d);
                }
                checkEmpty(a) {
                    let c = !0;
                    const b = IDBKeyRange.bound([
                        this.userId,
                        Number.NEGATIVE_INFINITY
                    ], [
                        this.userId,
                        Number.POSITIVE_INFINITY
                    ]);
                    return dS(a).Kt({
                        index: g.userMutationsIndex,
                        range: b
                    }, (b, d, a)=>{
                        (c = !1), a.done();
                    }).next(()=>c);
                }
                addMutationBatch(a, c, d, e) {
                    const f = dT(a), b = dS(a);
                    return b.add({}).next((h)=>{
                        ag("number" == typeof h);
                        const l = new ds(h, c, d, e), m = (function(e, b, a) {
                            const c = a.baseMutations.map((a)=>cQ(e.Wt, a)), d = a.mutations.map((a)=>cQ(e.Wt, a));
                            return new g(b, a.batchId, a.localWriteTime.toMillis(), c, d);
                        })(this.N, this.userId, l), i = [];
                        let j = new C((a, b)=>M(a.canonicalString(), b.canonicalString()));
                        for (const k of e){
                            const n = p.key(this.userId, k.key.path, h);
                            (j = j.add(k.key.path.popLast())), i.push(b.put(m)), i.push(f.put(n, p.PLACEHOLDER));
                        }
                        return (j.forEach((b)=>{
                            i.push(this.Ht.addToCollectionParentIndex(a, b));
                        }), a.addOnCommittedListener(()=>{
                            this.Jt[h] = l.keys();
                        }), df.waitFor(i).next(()=>l));
                    });
                }
                lookupMutationBatch(a, b) {
                    return dS(a).get(b).next((a)=>a ? (ag(a.userId === this.userId), dC(this.N, a)) : null);
                }
                Xt(b, a) {
                    return this.Jt[a] ? df.resolve(this.Jt[a]) : this.lookupMutationBatch(b, a).next((b)=>{
                        if (b) {
                            const c = b.keys();
                            return (this.Jt[a] = c), c;
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
                    return dS(a).Kt({
                        index: g.userMutationsIndex,
                        range: d
                    }, (d, a, b)=>{
                        a.userId === this.userId && (ag(a.batchId >= c), (e = dC(this.N, a))), b.done();
                    }).next(()=>e);
                }
                getHighestUnacknowledgedBatchId(a) {
                    const b = IDBKeyRange.upperBound([
                        this.userId,
                        Number.POSITIVE_INFINITY, 
                    ]);
                    let c = -1;
                    return dS(a).Kt({
                        index: g.userMutationsIndex,
                        range: b,
                        reverse: !0
                    }, (d, a, b)=>{
                        (c = a.batchId), b.done();
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
                    return dS(a).Lt(g.userMutationsIndex, b).next((a)=>a.map((a)=>dC(this.N, a)));
                }
                getAllMutationBatchesAffectingDocumentKey(a, b) {
                    const c = p.prefixForPath(this.userId, b.path), d = IDBKeyRange.lowerBound(c), e = [];
                    return dT(a).Kt({
                        range: d
                    }, (c, j, d)=>{
                        const [f, g, h] = c, i = c9(g);
                        if (f === this.userId && b.path.isEqual(i)) return dS(a).get(h).next((a)=>{
                            if (!a) throw af();
                            ag(a.userId === this.userId), e.push(dC(this.N, a));
                        });
                        d.done();
                    }).next(()=>e);
                }
                getAllMutationBatchesAffectingDocumentKeys(c, a) {
                    let d = new C(M);
                    const b = [];
                    return (a.forEach((a)=>{
                        const e = p.prefixForPath(this.userId, a.path), f = IDBKeyRange.lowerBound(e), g = dT(c).Kt({
                            range: f
                        }, (b, i, c)=>{
                            const [e, f, g] = b, h = c9(f);
                            e === this.userId && a.path.isEqual(h) ? (d = d.add(g)) : c.done();
                        });
                        b.push(g);
                    }), df.waitFor(b).next(()=>this.Zt(c, d)));
                }
                getAllMutationBatchesAffectingQuery(b, c) {
                    const a = c.path, f = a.length + 1, d = p.prefixForPath(this.userId, a), e = IDBKeyRange.lowerBound(d);
                    let g = new C(M);
                    return dT(b).Kt({
                        range: e
                    }, (c, j, d)=>{
                        const [e, h, i] = c, b = c9(h);
                        e === this.userId && a.isPrefixOf(b) ? b.length === f && (g = g.add(i)) : d.done();
                    }).next(()=>this.Zt(b, g));
                }
                Zt(c, a) {
                    const d = [], b = [];
                    return (a.forEach((a)=>{
                        b.push(dS(c).get(a).next((a)=>{
                            if (null === a) throw af();
                            ag(a.userId === this.userId), d.push(dC(this.N, a));
                        }));
                    }), df.waitFor(b).next(()=>d));
                }
                removeMutationBatch(a, b) {
                    return dO(a.Qt, this.userId, b).next((c)=>(a.addOnCommittedListener(()=>{
                            this.te(b.batchId);
                        }), df.forEach(c, (b)=>this.referenceDelegate.markPotentiallyOrphaned(a, b))));
                }
                te(a) {
                    delete this.Jt[a];
                }
                performConsistencyCheck(a) {
                    return this.checkEmpty(a).next((b)=>{
                        if (!b) return df.resolve();
                        const c = IDBKeyRange.lowerBound(p.prefixForUser(this.userId)), d = [];
                        return dT(a).Kt({
                            range: c
                        }, (a, e, b)=>{
                            if (a[0] === this.userId) {
                                const c = c9(a[1]);
                                d.push(c);
                            } else b.done();
                        }).next(()=>{
                            ag(0 === d.length);
                        });
                    });
                }
                containsKey(a, b) {
                    return dR(a, this.userId, b);
                }
                ee(a) {
                    return dU(a).get(this.userId).next((a)=>a || new s(this.userId, -1, ""));
                }
            }
            function dR(b, c, d) {
                const a = p.prefixForPath(c, d.path), f = a[1], e = IDBKeyRange.lowerBound(a);
                let g = !1;
                return dT(b).Kt({
                    range: e,
                    qt: !0
                }, (a, h, b)=>{
                    const [d, e, i] = a;
                    d === c && e === f && (g = !0), b.done();
                }).next(()=>g);
            }
            function dS(a) {
                return dr(a, g.store);
            }
            function dT(a) {
                return dr(a, p.store);
            }
            function dU(a) {
                return dr(a, s.store);
            }
            class dV {
                constructor(a){
                    this.ne = a;
                }
                next() {
                    return (this.ne += 2), this.ne;
                }
                static se() {
                    return new dV(0);
                }
                static ie() {
                    return new dV(-1);
                }
            }
            class dW {
                constructor(a, b){
                    (this.referenceDelegate = a), (this.N = b);
                }
                allocateTargetId(a) {
                    return this.re(a).next((b)=>{
                        const c = new dV(b.highestTargetId);
                        return ((b.highestTargetId = c.next()), this.oe(a, b).next(()=>b.highestTargetId));
                    });
                }
                getLastRemoteSnapshotVersion(a) {
                    return this.re(a).next((a)=>aw.fromTimestamp(new av(a.lastRemoteSnapshotVersion.seconds, a.lastRemoteSnapshotVersion.nanoseconds)));
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
                    return this.removeMatchingKeysForTargetId(a, b.targetId).next(()=>dX(a).delete(b.targetId)).next(()=>this.re(a)).next((b)=>(ag(b.targetCount > 0), (b.targetCount -= 1), this.oe(a, b)));
                }
                removeTargets(a, b, c) {
                    let d = 0;
                    const e = [];
                    return dX(a).Kt((h, g)=>{
                        const f = dD(g);
                        f.sequenceNumber <= b && null === c.get(f.targetId) && (d++, e.push(this.removeTargetData(a, f)));
                    }).next(()=>df.waitFor(e)).next(()=>d);
                }
                forEachTarget(a, b) {
                    return dX(a).Kt((d, a)=>{
                        const c = dD(a);
                        b(c);
                    });
                }
                re(a) {
                    return dY(a).get(u.key).next((a)=>(ag(null !== a), a));
                }
                oe(a, b) {
                    return dY(a).put(u.key, b);
                }
                ce(a, b) {
                    return dX(a).put(dE(this.N, b));
                }
                ae(a, b) {
                    let c = !1;
                    return (a.targetId > b.highestTargetId && ((b.highestTargetId = a.targetId), (c = !0)), a.sequenceNumber > b.highestListenSequenceNumber && ((b.highestListenSequenceNumber = a.sequenceNumber), (c = !0)), c);
                }
                getTargetCount(a) {
                    return this.re(a).next((a)=>a.targetCount);
                }
                getTargetData(b, c) {
                    const a = a6(c), d = IDBKeyRange.bound([
                        a,
                        Number.NEGATIVE_INFINITY
                    ], [
                        a,
                        Number.POSITIVE_INFINITY
                    ]);
                    let e = null;
                    return dX(b).Kt({
                        range: d,
                        index: h.queryTargetsIndexName
                    }, (f, b, d)=>{
                        const a = dD(b);
                        a8(c, a.target) && ((e = a), d.done());
                    }).next(()=>e);
                }
                addMatchingKeys(a, b, d) {
                    const c = [], e = dZ(a);
                    return (b.forEach((b)=>{
                        const f = c6(b.path);
                        c.push(e.put(new i(d, f))), c.push(this.referenceDelegate.addReference(a, d, b));
                    }), df.waitFor(c));
                }
                removeMatchingKeys(a, b, c) {
                    const d = dZ(a);
                    return df.forEach(b, (b)=>{
                        const e = c6(b.path);
                        return df.waitFor([
                            d.delete([
                                c,
                                e
                            ]),
                            this.referenceDelegate.removeReference(a, c, b), 
                        ]);
                    });
                }
                removeMatchingKeysForTargetId(b, a) {
                    const c = dZ(b), d = IDBKeyRange.bound([
                        a
                    ], [
                        a + 1
                    ], !1, !0);
                    return c.delete(d);
                }
                getMatchingKeysForTargetId(b, a) {
                    const c = IDBKeyRange.bound([
                        a
                    ], [
                        a + 1
                    ], !1, !0), d = dZ(b);
                    let e = cl();
                    return d.Kt({
                        range: c,
                        qt: !0
                    }, (a, d, f)=>{
                        const b = c9(a[1]), c = new l(b);
                        e = e.add(c);
                    }).next(()=>e);
                }
                containsKey(b, c) {
                    const a = c6(c.path), d = IDBKeyRange.bound([
                        a
                    ], [
                        au(a)
                    ], !1, !0);
                    let e = 0;
                    return dZ(b).Kt({
                        index: i.documentTargetsIndex,
                        qt: !0,
                        range: d
                    }, ([a, c], d, b)=>{
                        0 !== a && (e++, b.done());
                    }).next(()=>e > 0);
                }
                Tt(a, b) {
                    return dX(a).get(b).next((a)=>(a ? dD(a) : null));
                }
            }
            function dX(a) {
                return dr(a, h.store);
            }
            function dY(a) {
                return dr(a, u.store);
            }
            function dZ(a) {
                return dr(a, i.store);
            }
            async function d$(a) {
                if (a.code !== aj.FAILED_PRECONDITION || a.message !== de) throw a;
                ab("LocalStore", "Unexpectedly lost primary lease");
            }
            function d_([b, c], [d, e]) {
                const a = M(b, d);
                return 0 === a ? M(c, e) : a;
            }
            class d0 {
                constructor(a){
                    (this.ue = a), (this.buffer = new C(d_)), (this.he = 0);
                }
                le() {
                    return ++this.he;
                }
                fe(c) {
                    const a = [
                        c,
                        this.le()
                    ];
                    if (this.buffer.size < this.ue) this.buffer = this.buffer.add(a);
                    else {
                        const b = this.buffer.last();
                        d_(a, b) < 0 && (this.buffer = this.buffer.delete(b).add(a));
                    }
                }
                get maxValue() {
                    return this.buffer.last()[0];
                }
            }
            class d1 {
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
                _e(b) {
                    const a = this.de ? 3e5 : 6e4;
                    ab("LruGarbageCollector", `Garbage collection scheduled in ${a}ms`), (this.we = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", a, async ()=>{
                        (this.we = null), (this.de = !0);
                        try {
                            await b.collectGarbage(this.garbageCollector);
                        } catch (a) {
                            dk(a) ? ab("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", a) : await d$(a);
                        }
                        await this._e(b);
                    }));
                }
            }
            class d2 {
                constructor(a, b){
                    (this.me = a), (this.params = b);
                }
                calculateTargetCount(a, b) {
                    return this.me.ge(a).next((a)=>Math.floor((b / 100) * a));
                }
                nthSequenceNumber(b, a) {
                    if (0 === a) return df.resolve(L.T);
                    const c = new d0(a);
                    return this.me.forEachTarget(b, (a)=>c.fe(a.sequenceNumber)).next(()=>this.me.ye(b, (a)=>c.fe(a))).next(()=>c.maxValue);
                }
                removeTargets(a, b, c) {
                    return this.me.removeTargets(a, b, c);
                }
                removeOrphanedDocuments(a, b) {
                    return this.me.removeOrphanedDocuments(a, b);
                }
                collect(a, b) {
                    return -1 === this.params.cacheSizeCollectionThreshold ? (ab("LruGarbageCollector", "Garbage collection skipped; disabled"), df.resolve(dN)) : this.getCacheSize(a).next((c)=>c < this.params.cacheSizeCollectionThreshold ? (ab("LruGarbageCollector", `Garbage collection skipped; Cache size ${c} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), dN) : this.pe(a, b));
                }
                getCacheSize(a) {
                    return this.me.getCacheSize(a);
                }
                pe(a, b) {
                    let c, d, e, f, g, h, i;
                    const j = Date.now();
                    return this.calculateTargetCount(a, this.params.percentileToCollect).next((b)=>(b > this.params.maximumSequenceNumbersToCollect ? (ab("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${b}`), (d = this.params.maximumSequenceNumbersToCollect)) : (d = b), (f = Date.now()), this.nthSequenceNumber(a, d))).next((d)=>((c = d), (g = Date.now()), this.removeTargets(a, c, b))).next((b)=>((e = b), (h = Date.now()), this.removeOrphanedDocuments(a, c))).next((a)=>{
                        if (((i = Date.now()), _() <= LogLevel.DEBUG)) {
                            ab("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${f - j}ms\n\tDetermined least recently used ${d} in ` + (g - f) + "ms\n" + `\tRemoved ${e} targets in ` + (h - g) + "ms\n" + `\tRemoved ${a} documents in ` + (i - h) + "ms\n" + `Total Duration: ${i - j}ms`);
                        }
                        return df.resolve({
                            didRun: !0,
                            sequenceNumbersCollected: d,
                            targetsRemoved: e,
                            documentsRemoved: a
                        });
                    });
                }
            }
            class d3 {
                constructor(a, b){
                    (this.db = a), (this.garbageCollector = (function(a, b) {
                        return new d2(a, b);
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
                    return this.Ee(a, (c, a)=>b(a));
                }
                addReference(a, c, b) {
                    return d4(a, b);
                }
                removeReference(a, c, b) {
                    return d4(a, b);
                }
                removeTargets(a, b, c) {
                    return this.db.getTargetCache().removeTargets(a, b, c);
                }
                markPotentiallyOrphaned(a, b) {
                    return d4(a, b);
                }
                Ie(a, b) {
                    return (function(a, b) {
                        let c = !1;
                        return dU(a).jt((d)=>dR(a, d, b).next((a)=>(a && (c = !0), df.resolve(!a)))).next(()=>c);
                    })(a, b);
                }
                removeOrphanedDocuments(a, b) {
                    const c = this.db.getRemoteDocumentCache().newChangeBuffer(), d = [];
                    let e = 0;
                    return this.Ee(a, (f, g)=>{
                        if (g <= b) {
                            const h = this.Ie(a, f).next((b)=>{
                                if (!b) return (e++, c.getEntry(a, f).next(()=>(c.removeEntry(f), dZ(a).delete([
                                        0,
                                        c6(f.path), 
                                    ]))));
                            });
                            d.push(h);
                        }
                    }).next(()=>df.waitFor(d)).next(()=>c.apply(a)).next(()=>e);
                }
                removeTarget(a, b) {
                    const c = b.withSequenceNumber(a.currentSequenceNumber);
                    return this.db.getTargetCache().updateTargetData(a, c);
                }
                updateLimboDocument(a, b) {
                    return d4(a, b);
                }
                Ee(a, c) {
                    const b = dZ(a);
                    let d, e = L.T;
                    return b.Kt({
                        index: i.documentTargetsIndex
                    }, ([a, g], { path: b , sequenceNumber: f  })=>{
                        0 === a ? (e !== L.T && c(new l(c9(d)), e), (e = f), (d = b)) : (e = L.T);
                    }).next(()=>{
                        e !== L.T && c(new l(c9(d)), e);
                    });
                }
                getCacheSize(a) {
                    return this.db.getRemoteDocumentCache().getSize(a);
                }
            }
            function d4(a, b) {
                return dZ(a).put((function(a, b) {
                    return new i(0, c6(a.path), b);
                })(b, a.currentSequenceNumber));
            }
            class d5 {
                constructor(a, b){
                    (this.mapKeyFn = a), (this.equalsFn = b), (this.inner = {});
                }
                get(a) {
                    const c = this.mapKeyFn(a), b = this.inner[c];
                    if (void 0 !== b) for (const [d, e] of b)if (this.equalsFn(d, a)) return e;
                }
                has(a) {
                    return void 0 !== this.get(a);
                }
                set(a, d) {
                    const e = this.mapKeyFn(a), b = this.inner[e];
                    if (void 0 !== b) {
                        for(let c = 0; c < b.length; c++)if (this.equalsFn(b[c][0], a)) return void (b[c] = [
                            a,
                            d
                        ]);
                        b.push([
                            a,
                            d
                        ]);
                    } else this.inner[e] = [
                        [
                            a,
                            d
                        ]
                    ];
                }
                delete(c) {
                    const d = this.mapKeyFn(c), a = this.inner[d];
                    if (void 0 === a) return !1;
                    for(let b = 0; b < a.length; b++)if (this.equalsFn(a[b][0], c)) return (1 === a.length ? delete this.inner[d] : a.splice(b, 1), !0);
                    return !1;
                }
                forEach(a) {
                    ay(this.inner, (e, b)=>{
                        for (const [c, d] of b)a(c, d);
                    });
                }
                isEmpty() {
                    return az(this.inner);
                }
            }
            class E {
                constructor(){
                    (this.changes = new d5((a)=>a.toString(), (a, b)=>a.isEqual(b))), (this.changesApplied = !1);
                }
                getReadTime(b) {
                    const a = this.changes.get(b);
                    return a ? a.readTime : aw.min();
                }
                addEntry(a, b) {
                    this.assertNotApplied(), this.changes.set(a.key, {
                        document: a,
                        readTime: b
                    });
                }
                removeEntry(a, b = null) {
                    this.assertNotApplied(), this.changes.set(a, {
                        document: a3.newInvalidDocument(a),
                        readTime: b
                    });
                }
                getEntry(c, a) {
                    this.assertNotApplied();
                    const b = this.changes.get(a);
                    return void 0 !== b ? df.resolve(b.document) : this.getFromCache(c, a);
                }
                getEntries(a, b) {
                    return this.getAllFromCache(a, b);
                }
                apply(a) {
                    return (this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(a));
                }
                assertNotApplied() {}
            }
            class d6 {
                constructor(a, b){
                    (this.N = a), (this.Ht = b);
                }
                addEntry(a, b, c) {
                    return d9(a).put(ea(b), c);
                }
                removeEntry(a, b) {
                    const c = d9(a), d = ea(b);
                    return c.delete(d);
                }
                updateMetadata(a, b) {
                    return this.getMetadata(a).next((c)=>((c.byteSize += b), this.Ae(a, c)));
                }
                getEntry(a, b) {
                    return d9(a).get(ea(b)).next((a)=>this.Re(b, a));
                }
                be(a, b) {
                    return d9(a).get(ea(b)).next((a)=>({
                            document: this.Re(b, a),
                            size: dP(a)
                        }));
                }
                getEntries(a, b) {
                    let c = cf();
                    return this.Pe(a, b, (a, b)=>{
                        const d = this.Re(a, b);
                        c = c.insert(a, d);
                    }).next(()=>c);
                }
                ve(a, b) {
                    let c = cf(), d = new q(l.comparator);
                    return this.Pe(a, b, (a, b)=>{
                        const e = this.Re(a, b);
                        (c = c.insert(a, e)), (d = d.insert(a, dP(b)));
                    }).next(()=>({
                            documents: c,
                            Ve: d
                        }));
                }
                Pe(b, a, e) {
                    if (a.isEmpty()) return df.resolve();
                    const c = IDBKeyRange.bound(a.first().path.toArray(), a.last().path.toArray()), d = a.getIterator();
                    let f = d.getNext();
                    return d9(b).Kt({
                        range: c
                    }, (c, g, a)=>{
                        const b = l.fromSegments(c);
                        for(; f && l.comparator(f, b) < 0;)e(f, null), (f = d.getNext());
                        f && f.isEqual(b) && (e(f, g), (f = d.hasNext() ? d.getNext() : null)), f ? a.Mt(f.path.toArray()) : a.done();
                    }).next(()=>{
                        for(; f;)e(f, null), (f = d.hasNext() ? d.getNext() : null);
                    });
                }
                getDocumentsMatchingQuery(d, b, c) {
                    let i = cf();
                    const j = b.path.length + 1, a = {};
                    if (c.isEqual(aw.min())) {
                        const e = b.path.toArray();
                        a.range = IDBKeyRange.lowerBound(e);
                    } else {
                        const g = b.path.toArray(), h = dy(c);
                        (a.range = IDBKeyRange.lowerBound([
                            g,
                            h
                        ], !0)), (a.index = f.collectionReadTimeIndex);
                    }
                    return d9(d).Kt(a, (c, d, e)=>{
                        if (c.length !== j) return;
                        const a = dw(this.N, d);
                        b.path.isPrefixOf(a.key.path) ? bD(b, a) && (i = i.insert(a.key, a)) : e.done();
                    }).next(()=>i);
                }
                newChangeBuffer(a) {
                    return new d7(this, !!a && a.trackRemovals);
                }
                getSize(a) {
                    return this.getMetadata(a).next((a)=>a.byteSize);
                }
                getMetadata(a) {
                    return d8(a).get(t.key).next((a)=>(ag(!!a), a));
                }
                Ae(a, b) {
                    return d8(a).put(t.key, b);
                }
                Re(c, b) {
                    if (b) {
                        const a = dw(this.N, b);
                        if (!(a.isNoDocument() && a.version.isEqual(aw.min()))) return a;
                    }
                    return a3.newInvalidDocument(c);
                }
            }
            class d7 extends (null && E) {
                constructor(a, b){
                    super(), (this.Se = a), (this.trackRemovals = b), (this.De = new d5((a)=>a.toString(), (a, b)=>a.isEqual(b)));
                }
                applyChanges(b) {
                    const a = [];
                    let c = 0, d = new C((a, b)=>M(a.canonicalString(), b.canonicalString()));
                    return (this.changes.forEach((e, f)=>{
                        const g = this.De.get(e);
                        if (f.document.isValidDocument()) {
                            const h = dx(this.Se.N, f.document, this.getReadTime(e));
                            d = d.add(e.path.popLast());
                            const i = dP(h);
                            (c += i - g), a.push(this.Se.addEntry(b, e, h));
                        } else if (((c -= g), this.trackRemovals)) {
                            const j = dx(this.Se.N, a3.newNoDocument(e, aw.min()), this.getReadTime(e));
                            a.push(this.Se.addEntry(b, e, j));
                        } else a.push(this.Se.removeEntry(b, e));
                    }), d.forEach((c)=>{
                        a.push(this.Se.Ht.addToCollectionParentIndex(b, c));
                    }), a.push(this.Se.updateMetadata(b, c)), df.waitFor(a));
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
            function d8(a) {
                return dr(a, t.store);
            }
            function d9(a) {
                return dr(a, f.store);
            }
            function ea(a) {
                return a.path.toArray();
            }
            class eb {
                constructor(a){
                    this.N = a;
                }
                Ct(d, e, b, c) {
                    ag(b < c && b >= 0 && c <= 11);
                    const j = new dg("createOrUpgrade", e);
                    b < 1 && c >= 1 && ((function(a) {
                        a.createObjectStore(r.store);
                    })(d), (function(a) {
                        a.createObjectStore(s.store, {
                            keyPath: s.keyPath
                        });
                        a.createObjectStore(g.store, {
                            keyPath: g.keyPath,
                            autoIncrement: !0
                        }).createIndex(g.userMutationsIndex, g.userMutationsKeyPath, {
                            unique: !0
                        }), a.createObjectStore(p.store);
                    })(d), ec(d), (function(a) {
                        a.createObjectStore(f.store);
                    })(d));
                    let a = df.resolve();
                    return (b < 3 && c >= 3 && (0 !== b && (!(function(a) {
                        a.deleteObjectStore(i.store), a.deleteObjectStore(h.store), a.deleteObjectStore(u.store);
                    })(d), ec(d)), (a = a.next(()=>(function(a) {
                            const b = a.store(u.store), c = new u(0, 0, aw.min().toTimestamp(), 0);
                            return b.put(u.key, c);
                        })(j)))), b < 4 && c >= 4 && (0 !== b && (a = a.next(()=>(function(b, a) {
                            return a.store(g.store).Lt().next((c)=>{
                                b.deleteObjectStore(g.store);
                                b.createObjectStore(g.store, {
                                    keyPath: g.keyPath,
                                    autoIncrement: !0
                                }).createIndex(g.userMutationsIndex, g.userMutationsKeyPath, {
                                    unique: !0
                                });
                                const e = a.store(g.store), d = c.map((a)=>e.put(a));
                                return df.waitFor(d);
                            });
                        })(d, j))), (a = a.next(()=>{
                        !(function(a) {
                            a.createObjectStore(w.store, {
                                keyPath: w.keyPath
                            });
                        })(d);
                    }))), b < 5 && c >= 5 && (a = a.next(()=>this.Ce(j))), b < 6 && c >= 6 && (a = a.next(()=>((function(a) {
                            a.createObjectStore(t.store);
                        })(d), this.Ne(j)))), b < 7 && c >= 7 && (a = a.next(()=>this.xe(j))), b < 8 && c >= 8 && (a = a.next(()=>this.ke(d, j))), b < 9 && c >= 9 && (a = a.next(()=>{
                        !(function(a) {
                            a.objectStoreNames.contains("remoteDocumentChanges") && a.deleteObjectStore("remoteDocumentChanges");
                        })(d), (function(b) {
                            const a = b.objectStore(f.store);
                            a.createIndex(f.readTimeIndex, f.readTimeIndexPath, {
                                unique: !1
                            }), a.createIndex(f.collectionReadTimeIndex, f.collectionReadTimeIndexPath, {
                                unique: !1
                            });
                        })(e);
                    })), b < 10 && c >= 10 && (a = a.next(()=>this.$e(j))), b < 11 && c >= 11 && (a = a.next(()=>{
                        !(function(a) {
                            a.createObjectStore(x.store, {
                                keyPath: x.keyPath
                            });
                        })(d), (function(a) {
                            a.createObjectStore(y.store, {
                                keyPath: y.keyPath
                            });
                        })(d);
                    })), a);
                }
                Ne(a) {
                    let b = 0;
                    return a.store(f.store).Kt((c, a)=>{
                        b += dP(a);
                    }).next(()=>{
                        const c = new t(b);
                        return a.store(t.store).put(t.key, c);
                    });
                }
                Ce(a) {
                    const b = a.store(s.store), c = a.store(g.store);
                    return b.Lt().next((b)=>df.forEach(b, (b)=>{
                            const d = IDBKeyRange.bound([
                                b.userId,
                                -1
                            ], [
                                b.userId,
                                b.lastAcknowledgedBatchId
                            ]);
                            return c.Lt(g.userMutationsIndex, d).next((c)=>df.forEach(c, (c)=>{
                                    ag(c.userId === b.userId);
                                    const d = dC(this.N, c);
                                    return dO(a, b.userId, d).next(()=>{});
                                }));
                        }));
                }
                xe(a) {
                    const b = a.store(i.store), c = a.store(f.store);
                    return a.store(u.store).get(u.key).next((a)=>{
                        const d = [];
                        return c.Kt((c, g)=>{
                            const e = new aA(c), f = (function(a) {
                                return [
                                    0,
                                    c6(a)
                                ];
                            })(e);
                            d.push(b.get(f).next((c)=>c ? df.resolve() : ((c)=>b.put(new i(0, c6(c), a.highestListenSequenceNumber)))(e)));
                        }).next(()=>df.waitFor(d));
                    });
                }
                ke(b, a) {
                    b.createObjectStore(v.store, {
                        keyPath: v.keyPath
                    });
                    const c = a.store(v.store), d = new dK(), e = (a)=>{
                        if (d.add(a)) {
                            const b = a.lastSegment(), e = a.popLast();
                            return c.put({
                                collectionId: b,
                                parent: c6(e)
                            });
                        }
                    };
                    return a.store(f.store).Kt({
                        qt: !0
                    }, (a, c)=>{
                        const b = new aA(a);
                        return e(b.popLast());
                    }).next(()=>a.store(p.store).Kt({
                            qt: !0
                        }, ([c, a, d], f)=>{
                            const b = c9(a);
                            return e(b.popLast());
                        }));
                }
                $e(a) {
                    const b = a.store(h.store);
                    return b.Kt((e, a)=>{
                        const c = dD(a), d = dE(this.N, c);
                        return b.put(d);
                    });
                }
            }
            function ec(a) {
                a.createObjectStore(i.store, {
                    keyPath: i.keyPath
                }).createIndex(i.documentTargetsIndex, i.documentTargetsKeyPath, {
                    unique: !0
                });
                a.createObjectStore(h.store, {
                    keyPath: h.keyPath
                }).createIndex(h.queryTargetsIndexName, h.queryTargetsKeyPath, {
                    unique: !0
                }), a.createObjectStore(u.store);
            }
            const ed = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
            class ee {
                constructor(c, a, d, e, f, g, h, i, j, b){
                    if (((this.allowTabSynchronization = c), (this.persistenceKey = a), (this.clientId = d), (this.Oe = f), (this.window = g), (this.document = h), (this.Fe = j), (this.Me = b), (this.Le = null), (this.Be = !1), (this.isPrimary = !1), (this.networkEnabled = !0), (this.Ue = null), (this.inForeground = !1), (this.qe = null), (this.Ke = null), (this.je = Number.NEGATIVE_INFINITY), (this.Qe = (a)=>Promise.resolve()), !ee.bt())) throw new K(aj.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
                    (this.referenceDelegate = new d3(this, e)), (this.We = a + "main"), (this.N = new dv(i)), (this.Ge = new dh(this.We, 11, new eb(this.N))), (this.ze = new dW(this.referenceDelegate, this.N)), (this.Ht = new dL()), (this.He = (function(a, b) {
                        return new d6(a, b);
                    })(this.N, this.Ht)), (this.Je = new dG()), this.window && this.window.localStorage ? (this.Ye = this.window.localStorage) : ((this.Ye = null), !1 === b && ac("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
                }
                start() {
                    return this.Xe().then(()=>{
                        if (!this.isPrimary && !this.allowTabSynchronization) throw new K(aj.FAILED_PRECONDITION, ed);
                        return (this.Ze(), this.tn(), this.en(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (a)=>this.ze.getHighestSequenceNumber(a)));
                    }).then((a)=>{
                        this.Le = new L(a, this.Fe);
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
                    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (a)=>eg(a).put(new w(this.clientId, Date.now(), this.networkEnabled, this.inForeground)).next(()=>{
                            if (this.isPrimary) return this.sn(a).next((a)=>{
                                a || ((this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)));
                            });
                        }).next(()=>this.rn(a)).next((b)=>this.isPrimary && !b ? this.on(a).next(()=>!1) : !!b && this.cn(a).next(()=>!0))).catch((a)=>{
                        if (dk(a)) return (ab("IndexedDbPersistence", "Failed to extend owner lease: ", a), this.isPrimary);
                        if (!this.allowTabSynchronization) throw a;
                        return (ab("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", a), !1);
                    }).then((a)=>{
                        this.isPrimary !== a && this.Oe.enqueueRetryable(()=>this.Qe(a)), (this.isPrimary = a);
                    });
                }
                sn(a) {
                    return ef(a).get(r.key).next((a)=>df.resolve(this.an(a)));
                }
                un(a) {
                    return eg(a).delete(this.clientId);
                }
                async hn() {
                    if (this.isPrimary && !this.ln(this.je, 18e5)) {
                        this.je = Date.now();
                        const a = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (a)=>{
                            const b = dr(a, w.store);
                            return b.Lt().next((a)=>{
                                const d = this.fn(a, 18e5), c = a.filter((a)=>-1 === d.indexOf(a));
                                return df.forEach(c, (a)=>b.delete(a.clientId)).next(()=>c);
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
                    if (this.Me) return df.resolve(!0);
                    return ef(a).get(r.key).next((b)=>{
                        if (null !== b && this.ln(b.leaseTimestampMs, 5e3) && !this.wn(b.ownerId)) {
                            if (this.an(b) && this.networkEnabled) return !0;
                            if (!this.an(b)) {
                                if (!b.allowTabSynchronization) throw new K(aj.FAILED_PRECONDITION, ed);
                                return !1;
                            }
                        }
                        return (!(!this.networkEnabled || !this.inForeground) || eg(a).Lt().next((a)=>void 0 === this.fn(a, 5e3).find((a)=>{
                                if (this.clientId !== a.clientId) {
                                    const b = !this.networkEnabled && a.networkEnabled, c = !this.inForeground && a.inForeground, d = this.networkEnabled === a.networkEnabled;
                                    if (b || (c && d)) return !0;
                                }
                                return !1;
                            })));
                    }).next((a)=>(this.isPrimary !== a && ab("IndexedDbPersistence", `Client ${a ? "is" : "is not"} eligible for a primary lease.`), a));
                }
                async shutdown() {
                    (this.Be = !1), this._n(), this.Ke && (this.Ke.cancel(), (this.Ke = null)), this.mn(), this.gn(), await this.Ge.runTransaction("shutdown", "readwrite", [
                        r.store,
                        w.store
                    ], (a)=>{
                        const b = new dq(a, L.T);
                        return this.on(b).next(()=>this.un(b));
                    }), this.Ge.close(), this.yn();
                }
                fn(a, b) {
                    return a.filter((a)=>this.ln(a.updateTimeMs, b) && !this.wn(a.clientId));
                }
                pn() {
                    return this.runTransaction("getActiveClients", "readonly", (a)=>eg(a).Lt().next((a)=>this.fn(a, 18e5).map((a)=>a.clientId)));
                }
                get started() {
                    return this.Be;
                }
                getMutationQueue(a) {
                    return dQ.Yt(a, this.N, this.Ht, this.referenceDelegate);
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
                runTransaction(a, b, d) {
                    ab("IndexedDbPersistence", "Starting transaction:", a);
                    const c = "readonly" === b ? "readonly" : "readwrite";
                    let e;
                    return this.Ge.runTransaction(a, c, dd, (c)=>((e = new dq(c, this.Le ? this.Le.next() : L.T)), "readwrite-primary" === b ? this.sn(e).next((a)=>!!a || this.rn(e)).next((b)=>{
                            if (!b) throw ((ac(`Failed to obtain primary lease for action '${a}'.`), (this.isPrimary = !1), this.Oe.enqueueRetryable(()=>this.Qe(!1)), new K(aj.FAILED_PRECONDITION, de)));
                            return d(e);
                        }).next((a)=>this.cn(e).next(()=>a)) : this.Tn(e).next(()=>d(e)))).then((a)=>(e.raiseOnCommittedEvent(), a));
                }
                Tn(a) {
                    return ef(a).get(r.key).next((a)=>{
                        if (null !== a && this.ln(a.leaseTimestampMs, 5e3) && !this.wn(a.ownerId) && !this.an(a) && !(this.Me || (this.allowTabSynchronization && a.allowTabSynchronization))) throw new K(aj.FAILED_PRECONDITION, ed);
                    });
                }
                cn(a) {
                    const b = new r(this.clientId, this.allowTabSynchronization, Date.now());
                    return ef(a).put(r.key, b);
                }
                static bt() {
                    return dh.bt();
                }
                on(a) {
                    const b = ef(a);
                    return b.get(r.key).next((a)=>this.an(a) ? (ab("IndexedDbPersistence", "Releasing primary lease."), b.delete(r.key)) : df.resolve());
                }
                ln(a, c) {
                    const b = Date.now();
                    return (!(a < b - c) && (!(a > b) || (ac(`Detected an update time that is in the future: ${a} > ${b}`), !1)));
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
                wn(b) {
                    var a;
                    try {
                        const c = null !== (null === (a = this.Ye) || void 0 === a ? void 0 : a.getItem(this.dn(b)));
                        return (ab("IndexedDbPersistence", `Client '${b}' ${c ? "is" : "is not"} zombied in LocalStorage`), c);
                    } catch (d) {
                        return (ac("IndexedDbPersistence", "Failed to get zombied client id.", d), !1);
                    }
                }
                _n() {
                    if (this.Ye) try {
                        this.Ye.setItem(this.dn(this.clientId), String(Date.now()));
                    } catch (a) {
                        ac("Failed to set zombie client id.", a);
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
            function ef(a) {
                return dr(a, r.store);
            }
            function eg(a) {
                return dr(a, w.store);
            }
            function eh(a, c) {
                let b = a.projectId;
                return (a.isDefaultDatabase || (b += "." + a.database), "firestore/" + c + "/" + b + "/");
            }
            class ei {
                constructor(a, b){
                    (this.progress = a), (this.En = b);
                }
            }
            class ej {
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
                    a.forEach((d, a)=>{
                        for (const c of b)c.applyToLocalView(a);
                    });
                }
                Pn(a, b) {
                    return this.He.getEntries(a, b).next((b)=>this.vn(a, b).next(()=>b));
                }
                vn(a, b) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(a, b).next((a)=>this.bn(b, a));
                }
                getDocumentsMatchingQuery(b, a, c) {
                    return (function(a) {
                        return (l.isDocumentKey(a.path) && null === a.collectionGroup && 0 === a.filters.length);
                    })(a) ? this.Vn(b, a.path) : bw(a) ? this.Sn(b, a, c) : this.Dn(b, a, c);
                }
                Vn(a, b) {
                    return this.An(a, new l(b)).next((a)=>{
                        let b = ch();
                        return (a.isFoundDocument() && (b = b.insert(a.key, a)), b);
                    });
                }
                Sn(a, b, d) {
                    const c = b.collectionGroup;
                    let e = ch();
                    return this.Ht.getCollectionParents(a, c).next((f)=>df.forEach(f, (f)=>{
                            const g = (function(a, b) {
                                return new bp(b, null, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, a.startAt, a.endAt);
                            })(b, f.child(c));
                            return this.Dn(a, g, d).next((a)=>{
                                a.forEach((a, b)=>{
                                    e = e.insert(a, b);
                                });
                            });
                        }).next(()=>e));
                }
                Dn(a, b, c) {
                    let d, e;
                    return this.He.getDocumentsMatchingQuery(a, b, c).next((c)=>((d = c), this.In.getAllMutationBatchesAffectingQuery(a, b))).next((b)=>((e = b), this.Cn(a, e, d).next((g)=>{
                            d = g;
                            for (const c of e)for (const f of c.mutations){
                                const b = f.key;
                                let a = d.get(b);
                                null == a && ((a = a3.newInvalidDocument(b)), (d = d.insert(b, a))), b$(f, a, c.localWriteTime), a.isFoundDocument() || (d = d.remove(b));
                            }
                        }))).next(()=>(d.forEach((a, c)=>{
                            bD(b, c) || (d = d.remove(a));
                        }), d));
                }
                Cn(d, e, c) {
                    let a = cl();
                    for (const f of e)for (const b of f.mutations)b instanceof b3 && null === c.get(b.key) && (a = a.add(b.key));
                    let g = c;
                    return this.He.getEntries(d, a).next((a)=>(a.forEach((b, a)=>{
                            a.isFoundDocument() && (g = g.insert(b, a));
                        }), g));
                }
            }
            class ek {
                constructor(a, b, c, d){
                    (this.targetId = a), (this.fromCache = b), (this.Nn = c), (this.xn = d);
                }
                static kn(e, d) {
                    let a = cl(), b = cl();
                    for (const c of d.docChanges)switch(c.type){
                        case 0:
                            a = a.add(c.doc.key);
                            break;
                        case 1:
                            b = b.add(c.doc.key);
                    }
                    return new ek(e, d.fromCache, a, b);
                }
            }
            class el {
                $n(a) {
                    this.On = a;
                }
                getDocumentsMatchingQuery(a, b, c, d) {
                    return (function(a) {
                        return (0 === a.filters.length && null === a.limit && null == a.startAt && null == a.endAt && (0 === a.explicitOrderBy.length || (1 === a.explicitOrderBy.length && a.explicitOrderBy[0].field.isKeyField())));
                    })(b) || c.isEqual(aw.min()) ? this.Fn(a, b) : this.On.Pn(a, d).next((e)=>{
                        const f = this.Mn(b, e);
                        return (bs(b) || bt(b)) && this.Ln(b.limitType, f, d, c) ? this.Fn(a, b) : (_() <= J["in"].DEBUG && ab("QueryEngine", "Re-using previous result from %s to execute query: %s", c.toString(), bC(b)), this.On.getDocumentsMatchingQuery(a, b, c).next((a)=>(f.forEach((b)=>{
                                a = a.insert(b.key, b);
                            }), a)));
                    });
                }
                Mn(a, b) {
                    let c = new C(bE(a));
                    return (b.forEach((d, b)=>{
                        bD(a, b) && (c = c.add(b));
                    }), c);
                }
                Ln(c, a, d, e) {
                    if (d.size !== a.size) return !0;
                    const b = "F" === c ? a.last() : a.first();
                    return (!!b && (b.hasPendingWrites || b.version.compareTo(e) > 0));
                }
                Fn(b, a) {
                    return (_() <= J["in"].DEBUG && ab("QueryEngine", "Using full collection scan to execute query:", bC(a)), this.On.getDocumentsMatchingQuery(b, a, aw.min()));
                }
            }
            class em {
                constructor(a, b, c, d){
                    (this.persistence = a), (this.Bn = b), (this.N = d), (this.Un = new q(M)), (this.qn = new d5((a)=>a6(a), a8)), (this.Kn = aw.min()), (this.In = a.getMutationQueue(c)), (this.jn = a.getRemoteDocumentCache()), (this.ze = a.getTargetCache()), (this.Qn = new ej(this.jn, this.In, this.persistence.getIndexManager())), (this.Je = a.getBundleCache()), this.Bn.$n(this.Qn);
                }
                collectGarbage(a) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (b)=>a.collect(b, this.Un));
                }
            }
            function en(a, b, c, d) {
                return new em(a, b, c, d);
            }
            async function eo(b, f) {
                const a = ai(b);
                let c = a.In, d = a.Qn;
                const e = await a.persistence.runTransaction("Handle user change", "readonly", (b)=>{
                    let e;
                    return a.In.getAllMutationBatches(b).next((g)=>((e = g), (c = a.persistence.getMutationQueue(f)), (d = new ej(a.jn, c, a.persistence.getIndexManager())), c.getAllMutationBatches(b))).next((g)=>{
                        const h = [], i = [];
                        let a = cl();
                        for (const c of e){
                            h.push(c.batchId);
                            for (const j of c.mutations)a = a.add(j.key);
                        }
                        for (const f of g){
                            i.push(f.batchId);
                            for (const k of f.mutations)a = a.add(k.key);
                        }
                        return d.Pn(b, a).next((a)=>({
                                Wn: a,
                                removedBatchIds: h,
                                addedBatchIds: i
                            }));
                    });
                });
                return (a.In = c), (a.Qn = d), a.Bn.$n(a.Qn), e;
            }
            function ep(a, c) {
                const b = ai(a);
                return b.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (a)=>{
                    const e = c.batch.keys(), d = b.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    return (function(e, f, a, g) {
                        const b = a.batch, c = b.keys();
                        let d = df.resolve();
                        return (c.forEach((c)=>{
                            d = d.next(()=>g.getEntry(f, c)).next((d)=>{
                                const e = a.docVersions.get(c);
                                ag(null !== e), d.version.compareTo(e) < 0 && (b.applyToRemoteDocument(d, a), d.isValidDocument() && g.addEntry(d, a.commitVersion));
                            });
                        }), d.next(()=>e.In.removeMutationBatch(f, b)));
                    })(b, a, c, d).next(()=>d.apply(a)).next(()=>b.In.performConsistencyCheck(a)).next(()=>b.Qn.Pn(a, e));
                });
            }
            function eq(a) {
                const b = ai(a);
                return b.persistence.runTransaction("Get last remote snapshot version", "readonly", (a)=>b.ze.getLastRemoteSnapshotVersion(a));
            }
            function er(b, c) {
                const a = ai(b), d = c.snapshotVersion;
                let e = a.Un;
                return a.persistence.runTransaction("Apply remote event", "readwrite-primary", (f)=>{
                    const g = a.jn.newChangeBuffer({
                        trackRemovals: !0
                    });
                    e = a.Un;
                    const b = [];
                    c.targetChanges.forEach((c, g)=>{
                        const h = e.get(g);
                        if (!h) return;
                        b.push(a.ze.removeMatchingKeys(f, c.removedDocuments, g).next(()=>a.ze.addMatchingKeys(f, c.addedDocuments, g)));
                        const j = c.resumeToken;
                        if (j.approximateByteSize() > 0) {
                            const i = h.withResumeToken(j, d).withSequenceNumber(f.currentSequenceNumber);
                            (e = e.insert(g, i)), (function(b, c, a) {
                                if ((ag(c.resumeToken.approximateByteSize() > 0), 0 === b.resumeToken.approximateByteSize())) return !0;
                                if (c.snapshotVersion.toMicroseconds() - b.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                                return (a.addedDocuments.size + a.modifiedDocuments.size + a.removedDocuments.size > 0);
                            })(h, i, c) && b.push(a.ze.updateTargetData(f, i));
                        }
                    });
                    let i = cf();
                    if ((c.documentUpdates.forEach((d, e)=>{
                        c.resolvedLimboDocuments.has(d) && b.push(a.persistence.referenceDelegate.updateLimboDocument(f, d));
                    }), b.push(es(f, g, c.documentUpdates, d, void 0).next((a)=>{
                        i = a;
                    })), !d.isEqual(aw.min()))) {
                        const h = a.ze.getLastRemoteSnapshotVersion(f).next((b)=>a.ze.setTargetsMetadata(f, f.currentSequenceNumber, d));
                        b.push(h);
                    }
                    return df.waitFor(b).next(()=>g.apply(f)).next(()=>a.Qn.vn(f, i)).next(()=>i);
                }).then((b)=>((a.Un = e), b));
            }
            function es(a, b, c, e, f) {
                let d = cl();
                return (c.forEach((a)=>(d = d.add(a))), b.getEntries(a, d).next((d)=>{
                    let a = cf();
                    return (c.forEach((g, c)=>{
                        const h = d.get(g), i = (null == f ? void 0 : f.get(g)) || e;
                        c.isNoDocument() && c.version.isEqual(aw.min()) ? (b.removeEntry(g, i), (a = a.insert(g, c))) : !h.isValidDocument() || c.version.compareTo(h.version) > 0 || (0 === c.version.compareTo(h.version) && h.hasPendingWrites) ? (b.addEntry(c, i), (a = a.insert(g, c))) : ab("LocalStore", "Ignoring outdated watch update for ", g, ". Current version:", h.version, " Watch version:", c.version);
                    }), a);
                }));
            }
            function et(a, c) {
                const b = ai(a);
                return b.persistence.runTransaction("Get next mutation batch", "readonly", (a)=>(void 0 === c && (c = -1), b.In.getNextMutationBatchAfterBatchId(a, c)));
            }
            function eu(a, c) {
                const b = ai(a);
                return b.persistence.runTransaction("Allocate target", "readwrite", (a)=>{
                    let d;
                    return b.ze.getTargetData(a, c).next((e)=>e ? ((d = e), df.resolve(d)) : b.ze.allocateTargetId(a).next((e)=>((d = new du(c, e, 0, a.currentSequenceNumber)), b.ze.addTargetData(a, d).next(()=>d))));
                }).then((a)=>{
                    const d = b.Un.get(a.targetId);
                    return ((null === d || a.snapshotVersion.compareTo(d.snapshotVersion) > 0) && ((b.Un = b.Un.insert(a.targetId, a)), b.qn.set(c, a.targetId)), a);
                });
            }
            async function ev(e, b, d) {
                const a = ai(e), f = a.Un.get(b), g = d ? "readwrite" : "readwrite-primary";
                try {
                    d || (await a.persistence.runTransaction("Release target", g, (b)=>a.persistence.referenceDelegate.removeTarget(b, f)));
                } catch (c) {
                    if (!dk(c)) throw c;
                    ab("LocalStore", `Failed to update sequence numbers for target ${b}: ${c}`);
                }
                (a.Un = a.Un.remove(b)), a.qn.delete(f.target);
            }
            function ew(a, c, d) {
                const b = ai(a);
                let e = aw.min(), f = cl();
                return b.persistence.runTransaction("Execute query", "readonly", (a)=>(function(d, e, b) {
                        const a = ai(d), c = a.qn.get(b);
                        return void 0 !== c ? df.resolve(a.Un.get(c)) : a.ze.getTargetData(e, b);
                    })(b, a, by(c)).next((c)=>{
                        if (c) return ((e = c.lastLimboFreeSnapshotVersion), b.ze.getMatchingKeysForTargetId(a, c.targetId).next((a)=>{
                            f = a;
                        }));
                    }).next(()=>b.Bn.getDocumentsMatchingQuery(a, c, d ? e : aw.min(), d ? f : cl())).next((a)=>({
                            documents: a,
                            Gn: f
                        })));
            }
            function ex(c, d) {
                const a = ai(c), e = ai(a.ze), b = a.Un.get(d);
                return b ? Promise.resolve(b.target) : a.persistence.runTransaction("Get target data", "readonly", (a)=>e.Tt(a, d).next((a)=>(a ? a.target : null)));
            }
            function ey(a) {
                const b = ai(a);
                return b.persistence.runTransaction("Get new document changes", "readonly", (a)=>(function(a, b, c) {
                        const h = ai(a);
                        let i = cf(), d = dy(c);
                        const e = d9(b), g = IDBKeyRange.lowerBound(d, !0);
                        return e.Kt({
                            index: f.readTimeIndex,
                            range: g
                        }, (c, a)=>{
                            const b = dw(h.N, a);
                            (i = i.insert(b.key, b)), (d = a.readTime);
                        }).next(()=>({
                                En: i,
                                readTime: dz(d)
                            }));
                    })(b.jn, a, b.Kn)).then(({ En: a , readTime: c  })=>((b.Kn = c), a));
            }
            async function ez(a) {
                const b = ai(a);
                return b.persistence.runTransaction("Synchronize last document change read time", "readonly", (a)=>(function(a) {
                        const b = d9(a);
                        let c = aw.min();
                        return b.Kt({
                            index: f.readTimeIndex,
                            reverse: !0
                        }, (d, a, b)=>{
                            a.readTime && (c = dz(a.readTime)), b.done();
                        }).next(()=>c);
                    })(a)).then((a)=>{
                    b.Kn = a;
                });
            }
            async function eA(h, b, i, j) {
                const c = ai(h);
                let e = cl(), f = cf(), g = cj();
                for (const a of i){
                    const d = b.zn(a.metadata.name);
                    a.document && (e = e.add(d)), (f = f.insert(d, b.Hn(a))), (g = g.insert(d, b.Jn(a.metadata.readTime)));
                }
                const k = c.jn.newChangeBuffer({
                    trackRemovals: !0
                }), l = await eu(c, (function(a) {
                    return by(br(aA.fromString(`__bundle__/docs/${a}`)));
                })(j));
                return c.persistence.runTransaction("Apply bundle documents", "readwrite", (a)=>es(a, k, f, aw.min(), g).next((b)=>(k.apply(a), b)).next((b)=>c.ze.removeMatchingKeysForTargetId(a, l.targetId).next(()=>c.ze.addMatchingKeys(a, e, l.targetId)).next(()=>c.Qn.vn(a, b)).next(()=>b)));
            }
            async function eB(a, b, d = cl()) {
                const e = await eu(a, by(dF(b.bundledQuery))), c = ai(a);
                return c.persistence.runTransaction("Save named query", "readwrite", (f)=>{
                    const g = cD(b.readTime);
                    if (e.snapshotVersion.compareTo(g) >= 0) return c.Je.saveNamedQuery(f, b);
                    const a = e.withResumeToken(A.EMPTY_BYTE_STRING, g);
                    return ((c.Un = c.Un.insert(a.targetId, a)), c.ze.updateTargetData(f, a).next(()=>c.ze.removeMatchingKeysForTargetId(f, e.targetId)).next(()=>c.ze.addMatchingKeys(f, d, e.targetId)).next(()=>c.Je.saveNamedQuery(f, b)));
                });
            }
            class eC {
                constructor(a){
                    (this.N = a), (this.Yn = new Map()), (this.Xn = new Map());
                }
                getBundleMetadata(b, a) {
                    return df.resolve(this.Yn.get(a));
                }
                saveBundleMetadata(c, b) {
                    var a;
                    return (this.Yn.set(b.id, {
                        id: (a = b).id,
                        version: a.version,
                        createTime: cD(a.createTime)
                    }), df.resolve());
                }
                getNamedQuery(b, a) {
                    return df.resolve(this.Xn.get(a));
                }
                saveNamedQuery(b, a) {
                    return (this.Xn.set(a.name, (function(a) {
                        return {
                            name: a.name,
                            query: dF(a.bundledQuery),
                            readTime: cD(a.readTime)
                        };
                    })(a)), df.resolve());
                }
            }
            class eD {
                constructor(){
                    (this.Zn = new C(eE.ts)), (this.es = new C(eE.ns));
                }
                isEmpty() {
                    return this.Zn.isEmpty();
                }
                addReference(b, c) {
                    const a = new eE(b, c);
                    (this.Zn = this.Zn.add(a)), (this.es = this.es.add(a));
                }
                ss(a, b) {
                    a.forEach((a)=>this.addReference(a, b));
                }
                removeReference(a, b) {
                    this.rs(new eE(a, b));
                }
                os(a, b) {
                    a.forEach((a)=>this.removeReference(a, b));
                }
                cs(a) {
                    const b = new l(new aA([])), c = new eE(b, a), d = new eE(b, a + 1), e = [];
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
                    const b = new l(new aA([])), c = new eE(b, a), d = new eE(b, a + 1);
                    let e = cl();
                    return (this.es.forEachInRange([
                        c,
                        d
                    ], (a)=>{
                        e = e.add(a.key);
                    }), e);
                }
                containsKey(a) {
                    const c = new eE(a, 0), b = this.Zn.firstAfterOrEqual(c);
                    return null !== b && a.isEqual(b.key);
                }
            }
            class eE {
                constructor(a, b){
                    (this.key = a), (this.ls = b);
                }
                static ts(a, b) {
                    return l.comparator(a.key, b.key) || M(a.ls, b.ls);
                }
                static ns(a, b) {
                    return M(a.ls, b.ls) || l.comparator(a.key, b.key);
                }
            }
            class eF {
                constructor(a, b){
                    (this.Ht = a), (this.referenceDelegate = b), (this.In = []), (this.fs = 1), (this.ds = new C(eE.ts));
                }
                checkEmpty(a) {
                    return df.resolve(0 === this.In.length);
                }
                addMutationBatch(e, f, g, a) {
                    const b = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const c = new ds(b, f, g, a);
                    this.In.push(c);
                    for (const d of a)(this.ds = this.ds.add(new eE(d.key, b))), this.Ht.addToCollectionParentIndex(e, d.key.path.popLast());
                    return df.resolve(c);
                }
                lookupMutationBatch(b, a) {
                    return df.resolve(this.ws(a));
                }
                getNextMutationBatchAfterBatchId(e, c) {
                    const d = c + 1, a = this._s(d), b = a < 0 ? 0 : a;
                    return df.resolve(this.In.length > b ? this.In[b] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return df.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(a) {
                    return df.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(e, a) {
                    const b = new eE(a, 0), c = new eE(a, Number.POSITIVE_INFINITY), d = [];
                    return (this.ds.forEachInRange([
                        b,
                        c
                    ], (a)=>{
                        const b = this.ws(a.ls);
                        d.push(b);
                    }), df.resolve(d));
                }
                getAllMutationBatchesAffectingDocumentKeys(c, a) {
                    let b = new C(M);
                    return (a.forEach((a)=>{
                        const c = new eE(a, 0), d = new eE(a, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            c,
                            d
                        ], (a)=>{
                            b = b.add(a.ls);
                        });
                    }), df.resolve(this.gs(b)));
                }
                getAllMutationBatchesAffectingQuery(f, c) {
                    const b = c.path, g = b.length + 1;
                    let a = b;
                    l.isDocumentKey(a) || (a = a.child(""));
                    const d = new eE(new l(a), 0);
                    let e = new C(M);
                    return (this.ds.forEachWhile((a)=>{
                        const c = a.key.path;
                        return (!!b.isPrefixOf(c) && (c.length === g && (e = e.add(a.ls)), !0));
                    }, d), df.resolve(this.gs(e)));
                }
                gs(a) {
                    const b = [];
                    return (a.forEach((c)=>{
                        const a = this.ws(c);
                        null !== a && b.push(a);
                    }), b);
                }
                removeMutationBatch(b, a) {
                    ag(0 === this.ys(a.batchId, "removed")), this.In.shift();
                    let c = this.ds;
                    return df.forEach(a.mutations, (d)=>{
                        const e = new eE(d.key, a.batchId);
                        return ((c = c.delete(e)), this.referenceDelegate.markPotentiallyOrphaned(b, d.key));
                    }).next(()=>{
                        this.ds = c;
                    });
                }
                te(a) {}
                containsKey(d, a) {
                    const c = new eE(a, 0), b = this.ds.firstAfterOrEqual(c);
                    return df.resolve(a.isEqual(b && b.key));
                }
                performConsistencyCheck(a) {
                    return this.In.length, df.resolve();
                }
                ys(a, b) {
                    return this._s(a);
                }
                _s(a) {
                    if (0 === this.In.length) return 0;
                    return a - this.In[0].batchId;
                }
                ws(b) {
                    const a = this._s(b);
                    if (a < 0 || a >= this.In.length) return null;
                    return this.In[a];
                }
            }
            class eG {
                constructor(a, b){
                    (this.Ht = a), (this.ps = b), (this.docs = new q(l.comparator)), (this.size = 0);
                }
                addEntry(e, a, f) {
                    const b = a.key, c = this.docs.get(b), g = c ? c.size : 0, d = this.ps(a);
                    return ((this.docs = this.docs.insert(b, {
                        document: a.clone(),
                        size: d,
                        readTime: f
                    })), (this.size += d - g), this.Ht.addToCollectionParentIndex(e, b.path.popLast()));
                }
                removeEntry(a) {
                    const b = this.docs.get(a);
                    b && ((this.docs = this.docs.remove(a)), (this.size -= b.size));
                }
                getEntry(c, a) {
                    const b = this.docs.get(a);
                    return df.resolve(b ? b.document.clone() : a3.newInvalidDocument(a));
                }
                getEntries(c, a) {
                    let b = cf();
                    return (a.forEach((a)=>{
                        const c = this.docs.get(a);
                        b = b.insert(a, c ? c.document.clone() : a3.newInvalidDocument(a));
                    }), df.resolve(b));
                }
                getDocumentsMatchingQuery(i, a, e) {
                    let b = cf();
                    const f = new l(a.path.child("")), d = this.docs.getIteratorFrom(f);
                    for(; d.hasNext();){
                        const { key: g , value: { document: c , readTime: h  } ,  } = d.getNext();
                        if (!a.path.isPrefixOf(g.path)) break;
                        h.compareTo(e) <= 0 || (bD(a, c) && (b = b.insert(c.key, c.clone())));
                    }
                    return df.resolve(b);
                }
                Ts(a, b) {
                    return df.forEach(this.docs, (a)=>b(a));
                }
                newChangeBuffer(a) {
                    return new eH(this);
                }
                getSize(a) {
                    return df.resolve(this.size);
                }
            }
            class eH extends E {
                constructor(a){
                    super(), (this.Se = a);
                }
                applyChanges(b) {
                    const a = [];
                    return (this.changes.forEach((c, d)=>{
                        d.document.isValidDocument() ? a.push(this.Se.addEntry(b, d.document, this.getReadTime(c))) : this.Se.removeEntry(c);
                    }), df.waitFor(a));
                }
                getFromCache(a, b) {
                    return this.Se.getEntry(a, b);
                }
                getAllFromCache(a, b) {
                    return this.Se.getEntries(a, b);
                }
            }
            class eI {
                constructor(a){
                    (this.persistence = a), (this.Es = new d5((a)=>a6(a), a8)), (this.lastRemoteSnapshotVersion = aw.min()), (this.highestTargetId = 0), (this.Is = 0), (this.As = new eD()), (this.targetCount = 0), (this.Rs = dV.se());
                }
                forEachTarget(a, b) {
                    return this.Es.forEach((c, a)=>b(a)), df.resolve();
                }
                getLastRemoteSnapshotVersion(a) {
                    return df.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(a) {
                    return df.resolve(this.Is);
                }
                allocateTargetId(a) {
                    return ((this.highestTargetId = this.Rs.next()), df.resolve(this.highestTargetId));
                }
                setTargetsMetadata(c, a, b) {
                    return (b && (this.lastRemoteSnapshotVersion = b), a > this.Is && (this.Is = a), df.resolve());
                }
                ce(a) {
                    this.Es.set(a.target, a);
                    const b = a.targetId;
                    b > this.highestTargetId && ((this.Rs = new dV(b)), (this.highestTargetId = b)), a.sequenceNumber > this.Is && (this.Is = a.sequenceNumber);
                }
                addTargetData(b, a) {
                    return (this.ce(a), (this.targetCount += 1), df.resolve());
                }
                updateTargetData(b, a) {
                    return this.ce(a), df.resolve();
                }
                removeTargetData(b, a) {
                    return (this.Es.delete(a.target), this.As.cs(a.targetId), (this.targetCount -= 1), df.resolve());
                }
                removeTargets(b, c, d) {
                    let e = 0;
                    const a = [];
                    return (this.Es.forEach((g, f)=>{
                        f.sequenceNumber <= c && null === d.get(f.targetId) && (this.Es.delete(g), a.push(this.removeMatchingKeysForTargetId(b, f.targetId)), e++);
                    }), df.waitFor(a).next(()=>e));
                }
                getTargetCount(a) {
                    return df.resolve(this.targetCount);
                }
                getTargetData(c, a) {
                    const b = this.Es.get(a) || null;
                    return df.resolve(b);
                }
                addMatchingKeys(c, a, b) {
                    return this.As.ss(a, b), df.resolve();
                }
                removeMatchingKeys(e, a, b) {
                    this.As.os(a, b);
                    const c = this.persistence.referenceDelegate, d = [];
                    return (c && a.forEach((a)=>{
                        d.push(c.markPotentiallyOrphaned(e, a));
                    }), df.waitFor(d));
                }
                removeMatchingKeysForTargetId(b, a) {
                    return this.As.cs(a), df.resolve();
                }
                getMatchingKeysForTargetId(c, a) {
                    const b = this.As.hs(a);
                    return df.resolve(b);
                }
                containsKey(b, a) {
                    return df.resolve(this.As.containsKey(a));
                }
            }
            class eJ {
                constructor(a, b){
                    (this.bs = {}), (this.Le = new L(0)), (this.Be = !1), (this.Be = !0), (this.referenceDelegate = a(this)), (this.ze = new eI(this));
                    (this.Ht = new dJ()), (this.He = (function(a, b) {
                        return new eG(a, b);
                    })(this.Ht, (a)=>this.referenceDelegate.Ps(a))), (this.N = new dv(b)), (this.Je = new eC(this.N));
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
                getMutationQueue(b) {
                    let a = this.bs[b.toKey()];
                    return (a || ((a = new eF(this.Ht, this.referenceDelegate)), (this.bs[b.toKey()] = a)), a);
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
                runTransaction(a, d, b) {
                    ab("MemoryPersistence", "Starting transaction:", a);
                    const c = new eK(this.Le.next());
                    return (this.referenceDelegate.vs(), b(c).next((a)=>this.referenceDelegate.Vs(c).next(()=>a)).toPromise().then((a)=>(c.raiseOnCommittedEvent(), a)));
                }
                Ss(a, b) {
                    return df.or(Object.values(this.bs).map((c)=>()=>c.containsKey(a, b)));
                }
            }
            class eK extends D {
                constructor(a){
                    super(), (this.currentSequenceNumber = a);
                }
            }
            class eL {
                constructor(a){
                    (this.persistence = a), (this.Ds = new eD()), (this.Cs = null);
                }
                static Ns(a) {
                    return new eL(a);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw af();
                }
                addReference(c, b, a) {
                    return (this.Ds.addReference(a, b), this.xs.delete(a.toString()), df.resolve());
                }
                removeReference(c, b, a) {
                    return (this.Ds.removeReference(a, b), this.xs.add(a.toString()), df.resolve());
                }
                markPotentiallyOrphaned(b, a) {
                    return this.xs.add(a.toString()), df.resolve();
                }
                removeTarget(b, a) {
                    this.Ds.cs(a.targetId).forEach((a)=>this.xs.add(a.toString()));
                    const c = this.persistence.getTargetCache();
                    return c.getMatchingKeysForTargetId(b, a.targetId).next((a)=>{
                        a.forEach((a)=>this.xs.add(a.toString()));
                    }).next(()=>c.removeTargetData(b, a));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(a) {
                    const b = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return df.forEach(this.xs, (c)=>{
                        const d = l.fromPath(c);
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
                    return df.or([
                        ()=>df.resolve(this.Ds.containsKey(b)),
                        ()=>this.persistence.getTargetCache().containsKey(a, b),
                        ()=>this.persistence.Ss(a, b), 
                    ]);
                }
            }
            function eM(a, b) {
                return `firestore_clients_${a}_${b}`;
            }
            function eN(c, a, d) {
                let b = `firestore_mutations_${c}_${d}`;
                return a.isAuthenticated() && (b += `_${a.uid}`), b;
            }
            function eO(a, b) {
                return `firestore_targets_${a}_${b}`;
            }
            class eP {
                constructor(a, b, c, d){
                    (this.user = a), (this.batchId = b), (this.state = c), (this.error = d);
                }
                static $s(f, c, d) {
                    const a = JSON.parse(d);
                    let e, b = "object" == typeof a && -1 !== [
                        "pending",
                        "acknowledged",
                        "rejected", 
                    ].indexOf(a.state) && (void 0 === a.error || "object" == typeof a.error);
                    return (b && a.error && ((b = "string" == typeof a.error.message && "string" == typeof a.error.code), b && (e = new K(a.error.code, a.error.message))), b ? new eP(f, c, a.state, e) : (ac("SharedClientState", `Failed to parse mutation state for ID '${c}': ${d}`), null));
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
            class eQ {
                constructor(a, b, c){
                    (this.targetId = a), (this.state = b), (this.error = c);
                }
                static $s(c, d) {
                    const a = JSON.parse(d);
                    let e, b = "object" == typeof a && -1 !== [
                        "not-current",
                        "current",
                        "rejected", 
                    ].indexOf(a.state) && (void 0 === a.error || "object" == typeof a.error);
                    return (b && a.error && ((b = "string" == typeof a.error.message && "string" == typeof a.error.code), b && (e = new K(a.error.code, a.error.message))), b ? new eQ(c, a.state, e) : (ac("SharedClientState", `Failed to parse target state for ID '${c}': ${d}`), null));
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
            class eR {
                constructor(a, b){
                    (this.clientId = a), (this.activeTargetIds = b);
                }
                static $s(e, f) {
                    const a = JSON.parse(f);
                    let c = "object" == typeof a && a.activeTargetIds instanceof Array, d = cn();
                    for(let b = 0; c && b < a.activeTargetIds.length; ++b)(c = aO(a.activeTargetIds[b])), (d = d.add(a.activeTargetIds[b]));
                    return c ? new eR(e, d) : (ac("SharedClientState", `Failed to parse client data for instance '${e}': ${f}`), null);
                }
            }
            class eS {
                constructor(a, b){
                    (this.clientId = a), (this.onlineState = b);
                }
                static $s(b) {
                    const a = JSON.parse(b);
                    return "object" == typeof a && -1 !== [
                        "Unknown",
                        "Online",
                        "Offline"
                    ].indexOf(a.onlineState) && "string" == typeof a.clientId ? new eS(a.clientId, a.onlineState) : (ac("SharedClientState", `Failed to parse online state: ${b}`), null);
                }
            }
            class eT {
                constructor(){
                    this.activeTargetIds = cn();
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
            class eU {
                constructor(c, d, b, e, f){
                    (this.window = c), (this.Oe = d), (this.persistenceKey = b), (this.Ls = e), (this.syncEngine = null), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null), (this.Bs = this.Us.bind(this)), (this.qs = new q(M)), (this.started = !1), (this.Ks = []);
                    const a = b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    (this.storage = this.window.localStorage), (this.currentUser = f), (this.js = eM(this.persistenceKey, this.Ls)), (this.Qs = (function(a) {
                        return `firestore_sequence_number_${a}`;
                    })(this.persistenceKey)), (this.qs = this.qs.insert(this.Ls, new eT())), (this.Ws = new RegExp(`^firestore_clients_${a}_([^_]*)$`)), (this.Gs = new RegExp(`^firestore_mutations_${a}_(\\d+)(?:_(.*))?$`)), (this.zs = new RegExp(`^firestore_targets_${a}_(\\d+)$`)), (this.Hs = (function(a) {
                        return `firestore_online_state_${a}`;
                    })(this.persistenceKey)), (this.Js = (function(a) {
                        return `firestore_bundle_loaded_${a}`;
                    })(this.persistenceKey)), this.window.addEventListener("storage", this.Bs);
                }
                static bt(a) {
                    return !(!a || !a.localStorage);
                }
                async start() {
                    const f = await this.syncEngine.pn();
                    for (const a of f){
                        if (a === this.Ls) continue;
                        const c = this.getItem(eM(this.persistenceKey, a));
                        if (c) {
                            const b = eR.$s(a, c);
                            b && (this.qs = this.qs.insert(b.clientId, b));
                        }
                    }
                    this.Ys();
                    const d = this.storage.getItem(this.Hs);
                    if (d) {
                        const e = this.Xs(d);
                        e && this.Zs(e);
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
                isActiveQueryTarget(b) {
                    let a = !1;
                    return (this.qs.forEach((d, c)=>{
                        c.activeTargetIds.has(b) && (a = !0);
                    }), a);
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
                        const c = this.storage.getItem(eO(this.persistenceKey, a));
                        if (c) {
                            const d = eQ.$s(a, c);
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
                    this.removeItem(eO(this.persistenceKey, a));
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
                    return ab("SharedClientState", "READ", a, b), b;
                }
                setItem(a, b) {
                    ab("SharedClientState", "SET", a, b), this.storage.setItem(a, b);
                }
                removeItem(a) {
                    ab("SharedClientState", "REMOVE", a), this.storage.removeItem(a);
                }
                Us(b) {
                    const a = b;
                    if (a.storageArea === this.storage) {
                        if ((ab("SharedClientState", "EVENT", a.key, a.newValue), a.key === this.js)) return void ac("Received WebStorage notification for local change. Another client might have garbage-collected our state");
                        this.Oe.enqueueRetryable(async ()=>{
                            if (this.started) {
                                if (null !== a.key) if (this.Ws.test(a.key)) {
                                    if (null == a.newValue) {
                                        const g = this.ci(a.key);
                                        return this.ai(g, null);
                                    }
                                    {
                                        const b = this.ui(a.key, a.newValue);
                                        if (b) return this.ai(b.clientId, b);
                                    }
                                } else if (this.Gs.test(a.key)) {
                                    if (null !== a.newValue) {
                                        const c = this.hi(a.key, a.newValue);
                                        if (c) return this.li(c);
                                    }
                                } else if (this.zs.test(a.key)) {
                                    if (null !== a.newValue) {
                                        const d = this.fi(a.key, a.newValue);
                                        if (d) return this.di(d);
                                    }
                                } else if (a.key === this.Hs) {
                                    if (null !== a.newValue) {
                                        const e = this.Xs(a.newValue);
                                        if (e) return this.Zs(e);
                                    }
                                } else if (a.key === this.Qs) {
                                    const f = (function(a) {
                                        let b = L.T;
                                        if (null != a) try {
                                            const c = JSON.parse(a);
                                            ag("number" == typeof c), (b = c);
                                        } catch (d) {
                                            ac("SharedClientState", "Failed to read sequence number from WebStorage", d);
                                        }
                                        return b;
                                    })(a.newValue);
                                    f !== L.T && this.sequenceNumberHandler(f);
                                } else if (a.key === this.Js) return this.syncEngine.wi();
                            } else this.Ks.push(a);
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
                    const d = new eP(this.currentUser, a, b, c), e = eN(this.persistenceKey, this.currentUser, a);
                    this.setItem(e, d.Os());
                }
                ni(a) {
                    const b = eN(this.persistenceKey, this.currentUser, a);
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
                    const d = eO(this.persistenceKey, a), e = new eQ(a, b, c);
                    this.setItem(d, e.Os());
                }
                oi() {
                    this.setItem(this.Js, "value-not-used");
                }
                ci(b) {
                    const a = this.Ws.exec(b);
                    return a ? a[1] : null;
                }
                ui(a, b) {
                    const c = this.ci(a);
                    return eR.$s(c, b);
                }
                hi(c, d) {
                    const a = this.Gs.exec(c), e = Number(a[1]), f = void 0 !== a[2] ? a[2] : null;
                    return eP.$s(new b(f), e, d);
                }
                fi(a, b) {
                    const c = this.zs.exec(a), d = Number(c[1]);
                    return eQ.$s(d, b);
                }
                Xs(a) {
                    return eS.$s(a);
                }
                async li(a) {
                    if (a.user.uid === this.currentUser.uid) return this.syncEngine._i(a.batchId, a.state, a.error);
                    ab("SharedClientState", `Ignoring mutation for non-active user ${a.user.uid}`);
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
                    let b = cn();
                    return (a.forEach((c, a)=>{
                        b = b.unionWith(a.activeTargetIds);
                    }), b);
                }
            }
            class eV {
                constructor(){
                    (this.yi = new eT()), (this.pi = {}), (this.onlineStateHandler = null), (this.sequenceNumberHandler = null);
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
                    return (this.yi = new eT()), Promise.resolve();
                }
                handleUserChange(a, b, c) {}
                setOnlineState(a) {}
                shutdown() {}
                writeSequenceNumber(a) {}
                notifyBundleLoaded() {}
            }
            class eW {
                Ti(a) {}
                shutdown() {}
            }
            class eX {
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
                    ab("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
                    for (const a of this.bi)a(0);
                }
                Ri() {
                    ab("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
                    for (const a of this.bi)a(1);
                }
                static bt() {
                    return ("undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener);
                }
            }
            const eY = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            class eZ {
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
            class e$ extends class {
                constructor(a){
                    (this.databaseInfo = a), (this.databaseId = a.databaseId);
                    const b = a.ssl ? "https" : "http";
                    (this.Fi = b + "://" + a.host), (this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents");
                }
                Li(a, e, b, f) {
                    const c = this.Bi(a, e);
                    ab("RestConnection", "Sending: ", c, b);
                    const d = {};
                    return (this.Ui(d, f), this.qi(a, c, d, b).then((a)=>(ab("RestConnection", "Received: ", a), a), (d)=>{
                        throw ((ad("RestConnection", `${a} failed with error: `, d, "url: ", c, "request:", b), d));
                    }));
                }
                Ki(a, b, c, d) {
                    return this.Li(a, b, c, d);
                }
                Ui(a, b) {
                    if (((a["X-Goog-Api-Client"] = "gl-js/ fire/" + Z), (a["Content-Type"] = "text/plain"), this.databaseInfo.appId && (a["X-Firebase-GMPID"] = this.databaseInfo.appId), b)) for(const c in b.authHeaders)b.authHeaders.hasOwnProperty(c) && (a[c] = b.authHeaders[c]);
                }
                Bi(a, b) {
                    const c = eY[a];
                    return `${this.Fi}/v1/${b}:${c}`;
                }
            } {
                constructor(a){
                    super(a), (this.forceLongPolling = a.forceLongPolling), (this.autoDetectLongPolling = a.autoDetectLongPolling), (this.useFetchStreams = a.useFetchStreams);
                }
                qi(a, b, c, d) {
                    return new Promise((g, h)=>{
                        const e = new W.JJ();
                        e.listenOnce(W.tw.COMPLETE, ()=>{
                            try {
                                switch(e.getLastErrorCode()){
                                    case W.jK.NO_ERROR:
                                        const c = e.getResponseJson();
                                        ab("Connection", "XHR received:", JSON.stringify(c)), g(c);
                                        break;
                                    case W.jK.TIMEOUT:
                                        ab("Connection", 'RPC "' + a + '" timed out'), h(new K(aj.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case W.jK.HTTP_ERROR:
                                        const d = e.getStatus();
                                        if ((ab("Connection", 'RPC "' + a + '" failed with status:', d, "response text:", e.getResponseText()), d > 0)) {
                                            const b = e.getResponseJson().error;
                                            if (b && b.status && b.message) {
                                                const f = (function(b) {
                                                    const a = b.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(aj).indexOf(a) >= 0 ? a : aj.UNKNOWN;
                                                })(b.status);
                                                h(new K(f, b.message));
                                            } else h(new K(aj.UNKNOWN, "Server responded with status " + e.getStatus()));
                                        } else h(new K(aj.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        af();
                                }
                            } finally{
                                ab("Connection", 'RPC "' + a + '" completed.');
                            }
                        });
                        const f = JSON.stringify(d);
                        e.send(b, "POST", f, c, 15);
                    });
                }
                ji(e, f) {
                    const g = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        e,
                        "/channel", 
                    ], h = (0, W.UE)(), i = (0, W.FJ)(), a = {
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
                    this.useFetchStreams && (a.xmlHttpFactory = new W.zI({})), this.Ui(a.initMessageHeaders, f), (0, V.uI)() || (0, V.b$)() || (0, V.d)() || (0, V.w1)() || (0, V.Mn)() || (0, V.ru)() || (a.httpHeadersOverwriteParam = "$httpHeaders");
                    const d = g.join("");
                    ab("Connection", "Creating WebChannel: " + d, a);
                    const c = h.createWebChannel(d, a);
                    let k = !1, l = !1;
                    const j = new eZ({
                        vi: (a)=>{
                            l ? ab("Connection", "Not sending because WebChannel is closed:", a) : (k || (ab("Connection", "Opening WebChannel transport."), c.open(), (k = !0)), ab("Connection", "WebChannel sending:", a), c.send(a));
                        },
                        Vi: ()=>c.close()
                    }), b = (a, b, c)=>{
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
                    return (b(c, W.ii.EventType.OPEN, ()=>{
                        l || ab("Connection", "WebChannel transport opened.");
                    }), b(c, W.ii.EventType.CLOSE, ()=>{
                        l || ((l = !0), ab("Connection", "WebChannel transport closed"), j.$i());
                    }), b(c, W.ii.EventType.ERROR, (a)=>{
                        l || ((l = !0), ad("Connection", "WebChannel transport errored:", a), j.$i(new K(aj.UNAVAILABLE, "The operation could not be completed")));
                    }), b(c, W.ii.EventType.MESSAGE, (i)=>{
                        var d;
                        if (!l) {
                            const b = i.data[0];
                            ag(!!b);
                            const f = b, a = f.error || (null === (d = f[0]) || void 0 === d ? void 0 : d.error);
                            if (a) {
                                ab("Connection", "WebChannel received error:", a);
                                const g = a.status;
                                let e = (function(b) {
                                    const a = B[b];
                                    if (void 0 !== a) return cb(a);
                                })(g), h = a.message;
                                void 0 === e && ((e = aj.INTERNAL), (h = "Unknown error status: " + g + " with message " + a.message)), (l = !0), j.$i(new K(e, h)), c.close();
                            } else ab("Connection", "WebChannel received:", b), j.Oi(b);
                        }
                    }), b(i, W.ju.STAT_EVENT, (a)=>{
                        a.stat === W.kN.PROXY ? ab("Connection", "Detected buffering proxy") : a.stat === W.kN.NOPROXY && ab("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        j.ki();
                    }, 0), j);
                }
            }
            function e_() {
                return "undefined" != typeof window ? window : null;
            }
            function e0() {
                return "undefined" != typeof document ? document : null;
            }
            function e1(a) {
                return new cz(a, !0);
            }
            class e2 {
                constructor(a, b, c = 1e3, d = 1.5, e = 6e4){
                    (this.Oe = a), (this.timerId = b), (this.Qi = c), (this.Wi = d), (this.Gi = e), (this.zi = 0), (this.Hi = null), (this.Ji = Date.now()), this.reset();
                }
                reset() {
                    this.zi = 0;
                }
                Yi() {
                    this.zi = this.Gi;
                }
                Xi(d) {
                    this.cancel();
                    const b = Math.floor(this.zi + this.Zi()), c = Math.max(0, Date.now() - this.Ji), a = Math.max(0, b - c);
                    a > 0 && ab("ExponentialBackoff", `Backing off for ${a} ms (base delay: ${this.zi} ms, delay with jitter: ${b} ms, last attempt: ${c} ms ago)`), (this.Hi = this.Oe.enqueueAfterDelay(this.timerId, a, ()=>((this.Ji = Date.now()), d()))), (this.zi *= this.Wi), this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
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
            class F {
                constructor(a, b, c, d, e, f, g){
                    (this.Oe = a), (this.er = c), (this.nr = d), (this.sr = e), (this.credentialsProvider = f), (this.listener = g), (this.state = 0), (this.ir = 0), (this.rr = null), (this.cr = null), (this.stream = null), (this.ar = new e2(a, b));
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
                async close(b, a) {
                    this.gr(), this.yr(), this.ar.cancel(), this.ir++, 4 !== b ? this.ar.reset() : a && a.code === aj.RESOURCE_EXHAUSTED ? (ac(a.toString()), ac("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : a && a.code === aj.UNAUTHENTICATED && 3 !== this.state && this.credentialsProvider.invalidateToken(), null !== this.stream && (this.pr(), this.stream.close(), (this.stream = null)), (this.state = b), await this.listener.Ci(a);
                }
                pr() {}
                auth() {
                    this.state = 1;
                    const a = this.Tr(this.ir), b = this.ir;
                    this.credentialsProvider.getToken().then((a)=>{
                        this.ir === b && this.Er(a);
                    }, (b)=>{
                        a(()=>{
                            const a = new K(aj.UNKNOWN, "Fetching auth token failed: " + b.message);
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
                    return (ab("PersistentStream", `close with error: ${a}`), (this.stream = null), this.close(4, a));
                }
                Tr(a) {
                    return (b)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === a ? b() : (ab("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            class e3 extends F {
                constructor(a, b, c, d, e){
                    super(a, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", b, c, e), (this.N = d);
                }
                Ar(a) {
                    return this.sr.ji("Listen", a);
                }
                onMessage(a) {
                    this.ar.reset();
                    const b = cP(this.N, a), c = (function(b) {
                        if (!("targetChange" in b)) return aw.min();
                        const a = b.targetChange;
                        return a.targetIds && a.targetIds.length ? aw.min() : a.readTime ? cD(a.readTime) : aw.min();
                    })(a);
                    return this.listener.Rr(b, c);
                }
                br(b) {
                    const a = {};
                    (a.database = cK(this.N)), (a.addTarget = (function(c, a) {
                        let b;
                        const d = a.target;
                        return ((b = a9(d) ? {
                            documents: cT(c, d)
                        } : {
                            query: cU(c, d)
                        }), (b.targetId = a.targetId), a.resumeToken.approximateByteSize() > 0 ? (b.resumeToken = cB(c, a.resumeToken)) : a.snapshotVersion.compareTo(aw.min()) > 0 && (b.readTime = cA(c, a.snapshotVersion.toTimestamp())), b);
                    })(this.N, b));
                    const c = cW(this.N, b);
                    c && (a.labels = c), this.mr(a);
                }
                Pr(b) {
                    const a = {};
                    (a.database = cK(this.N)), (a.removeTarget = b), this.mr(a);
                }
            }
            class e4 extends (null && F) {
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
                    if ((ag(!!a.streamToken), (this.lastStreamToken = a.streamToken), this.vr)) {
                        this.ar.reset();
                        const b = cS(a.writeResults, a.commitTime), c = cD(a.commitTime);
                        return this.listener.Dr(c, b);
                    }
                    return (ag(!a.writeResults || 0 === a.writeResults.length), (this.vr = !0), this.listener.Cr());
                }
                Nr() {
                    const a = {};
                    (a.database = cK(this.N)), this.mr(a);
                }
                Sr(a) {
                    const b = {
                        streamToken: this.lastStreamToken,
                        writes: a.map((a)=>cQ(this.N, a))
                    };
                    this.mr(b);
                }
            }
            class e5 extends class {
            } {
                constructor(a, b, c){
                    super(), (this.credentials = a), (this.sr = b), (this.N = c), (this.kr = !1);
                }
                $r() {
                    if (this.kr) throw new K(aj.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                Li(a, b, c) {
                    return (this.$r(), this.credentials.getToken().then((d)=>this.sr.Li(a, b, c, d)).catch((a)=>{
                        throw "FirebaseError" === a.name ? (a.code === aj.UNAUTHENTICATED && this.credentials.invalidateToken(), a) : new K(aj.UNKNOWN, a.toString());
                    }));
                }
                Ki(a, b, c) {
                    return (this.$r(), this.credentials.getToken().then((d)=>this.sr.Ki(a, b, c, d)).catch((a)=>{
                        throw "FirebaseError" === a.name ? (a.code === aj.UNAUTHENTICATED && this.credentials.invalidateToken(), a) : new K(aj.UNKNOWN, a.toString());
                    }));
                }
                terminate() {
                    this.kr = !0;
                }
            }
            class e6 {
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
                Ur(b) {
                    const a = `Could not reach Cloud Firestore backend. ${b}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (ac(a), (this.Mr = !1)) : ab("OnlineStateTracker", a);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), (this.Fr = null));
                }
            }
            class e7 {
                constructor(b, c, a, d, e){
                    (this.localStore = b), (this.datastore = c), (this.asyncQueue = a), (this.remoteSyncer = {}), (this.jr = []), (this.Qr = new Map()), (this.Wr = new Set()), (this.Gr = []), (this.zr = e), this.zr.Ti((b)=>{
                        a.enqueueAndForget(async ()=>{
                            fg(this) && (ab("RemoteStore", "Restarting streams for network reachability change."), await (async function(b) {
                                const a = ai(b);
                                a.Wr.add(4), await e9(a), a.Hr.set("Unknown"), a.Wr.delete(4), await e8(a);
                            })(this));
                        });
                    }), (this.Hr = new e6(a, d));
                }
            }
            async function e8(a) {
                if (fg(a)) for (const b of a.Gr)await b(!0);
            }
            async function e9(a) {
                for (const b of a.Gr)await b(!1);
            }
            function fa(c, b) {
                const a = ai(c);
                a.Qr.has(b.targetId) || (a.Qr.set(b.targetId, b), ff(a) ? fe(a) : fx(a).hr() && fc(a, b));
            }
            function fb(d, c) {
                const a = ai(d), b = fx(a);
                a.Qr.delete(c), b.hr() && fd(a, c), 0 === a.Qr.size && (b.hr() ? b.wr() : fg(a) && a.Hr.set("Unknown"));
            }
            function fc(a, b) {
                a.Jr.Y(b.targetId), fx(a).br(b);
            }
            function fd(a, b) {
                a.Jr.Y(b), fx(a).Pr(b);
            }
            function fe(a) {
                (a.Jr = new cu({
                    getRemoteKeysForTarget: (b)=>a.remoteSyncer.getRemoteKeysForTarget(b),
                    Tt: (b)=>a.Qr.get(b) || null
                })), fx(a).start(), a.Hr.Lr();
            }
            function ff(a) {
                return fg(a) && !fx(a).ur() && a.Qr.size > 0;
            }
            function fg(a) {
                return 0 === ai(a).Wr.size;
            }
            function fh(a) {
                a.Jr = void 0;
            }
            async function fi(a) {
                a.Qr.forEach((b, c)=>{
                    fc(a, b);
                });
            }
            async function fj(a, b) {
                fh(a), ff(a) ? (a.Hr.qr(b), fe(a)) : a.Hr.set("Unknown");
            }
            async function fk(b, a, c) {
                if ((b.Hr.set("Online"), a instanceof cs && 2 === a.state && a.cause)) try {
                    await (async function(a, c) {
                        const d = c.cause;
                        for (const b of c.targetIds)a.Qr.has(b) && (await a.remoteSyncer.rejectListen(b, d), a.Qr.delete(b), a.Jr.removeTarget(b));
                    })(b, a);
                } catch (d) {
                    ab("RemoteStore", "Failed to remove targets %s: %s ", a.targetIds.join(","), d), await fl(b, d);
                }
                else if ((a instanceof cq ? b.Jr.rt(a) : a instanceof cr ? b.Jr.ft(a) : b.Jr.at(a), !c.isEqual(aw.min()))) try {
                    const f = await eq(b.localStore);
                    c.compareTo(f) >= 0 && (await (function(b, c) {
                        const a = b.Jr._t(c);
                        return (a.targetChanges.forEach((a, d)=>{
                            if (a.resumeToken.approximateByteSize() > 0) {
                                const e = b.Qr.get(d);
                                e && b.Qr.set(d, e.withResumeToken(a.resumeToken, c));
                            }
                        }), a.targetMismatches.forEach((c)=>{
                            const a = b.Qr.get(c);
                            if (!a) return;
                            b.Qr.set(c, a.withResumeToken(A.EMPTY_BYTE_STRING, a.snapshotVersion)), fd(b, c);
                            const d = new du(a.target, c, 1, a.sequenceNumber);
                            fc(b, d);
                        }), b.remoteSyncer.applyRemoteEvent(a));
                    })(b, c));
                } catch (e) {
                    ab("RemoteStore", "Failed to raise snapshot:", e), await fl(b, e);
                }
            }
            async function fl(a, b, c) {
                if (!dk(b)) throw b;
                a.Wr.add(1), await e9(a), a.Hr.set("Offline"), c || (c = ()=>eq(a.localStore)), a.asyncQueue.enqueueRetryable(async ()=>{
                    ab("RemoteStore", "Retrying IndexedDB access"), await c(), a.Wr.delete(1), await e8(a);
                });
            }
            function fm(b, a) {
                return a().catch((c)=>fl(b, c, a));
            }
            async function fn(d) {
                const a = ai(d), e = fy(a);
                let c = a.jr.length > 0 ? a.jr[a.jr.length - 1].batchId : -1;
                for(; fo(a);)try {
                    const b = await et(a.localStore, c);
                    if (null === b) {
                        0 === a.jr.length && e.wr();
                        break;
                    }
                    (c = b.batchId), fp(a, b);
                } catch (f) {
                    await fl(a, f);
                }
                fq(a) && fr(a);
            }
            function fo(a) {
                return fg(a) && a.jr.length < 10;
            }
            function fp(b, c) {
                b.jr.push(c);
                const a = fy(b);
                a.hr() && a.Vr && a.Sr(c.mutations);
            }
            function fq(a) {
                return fg(a) && !fy(a).ur() && a.jr.length > 0;
            }
            function fr(a) {
                fy(a).start();
            }
            async function fs(a) {
                fy(a).Nr();
            }
            async function ft(a) {
                const b = fy(a);
                for (const c of a.jr)b.Sr(c.mutations);
            }
            async function fu(a, b, c) {
                const d = a.jr.shift(), e = dt.from(d, b, c);
                await fm(a, ()=>a.remoteSyncer.applySuccessfulWrite(e)), await fn(a);
            }
            async function fv(a, b) {
                b && fy(a).Vr && (await (async function(a, b) {
                    if (((d = b.code), ca(d) && d !== aj.ABORTED)) {
                        const c = a.jr.shift();
                        fy(a).dr(), await fm(a, ()=>a.remoteSyncer.rejectFailedWrite(c.batchId, b)), await fn(a);
                    }
                    var d;
                })(a, b)), fq(a) && fr(a);
            }
            async function fw(c, b) {
                const a = ai(c);
                b ? (a.Wr.delete(2), await e8(a)) : b || (a.Wr.add(2), await e9(a), a.Hr.set("Unknown"));
            }
            function fx(a) {
                return (a.Yr || ((a.Yr = (function(b, c, d) {
                    const a = ai(b);
                    return (a.$r(), new e3(c, a.sr, a.credentials, a.N, d));
                })(a.datastore, a.asyncQueue, {
                    Si: fi.bind(null, a),
                    Ci: fj.bind(null, a),
                    Rr: fk.bind(null, a)
                })), a.Gr.push(async (b)=>{
                    b ? (a.Yr.dr(), ff(a) ? fe(a) : a.Hr.set("Unknown")) : (await a.Yr.stop(), fh(a));
                })), a.Yr);
            }
            function fy(a) {
                return (a.Xr || ((a.Xr = (function(b, c, d) {
                    const a = ai(b);
                    return (a.$r(), new e4(c, a.sr, a.credentials, a.N, d));
                })(a.datastore, a.asyncQueue, {
                    Si: fs.bind(null, a),
                    Ci: fv.bind(null, a),
                    Cr: ft.bind(null, a),
                    Dr: fu.bind(null, a)
                })), a.Gr.push(async (b)=>{
                    b ? (a.Xr.dr(), await fn(a)) : (await a.Xr.stop(), a.jr.length > 0 && (ab("RemoteStore", `Stopping write stream with ${a.jr.length} pending writes`), (a.jr = [])));
                })), a.Xr);
            }
            class fz {
                constructor(a, b, c, d, e){
                    (this.asyncQueue = a), (this.timerId = b), (this.targetTimeMs = c), (this.op = d), (this.removalCallback = e), (this.deferred = new ak()), (this.then = this.deferred.promise.then.bind(this.deferred.promise)), this.deferred.promise.catch((a)=>{});
                }
                static createAndSchedule(c, d, a, e, f) {
                    const g = Date.now() + a, b = new fz(c, d, g, e, f);
                    return b.start(a), b;
                }
                start(a) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), a);
                }
                skipDelay() {
                    return this.handleDelayElapsed();
                }
                cancel(a) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new K(aj.CANCELLED, "Operation cancelled" + (a ? ": " + a : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((a)=>this.deferred.resolve(a))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), (this.timerHandle = null));
                }
            }
            function fA(a, b) {
                if ((ac("AsyncQueue", `${b}: ${a}`), dk(a))) return new K(aj.UNAVAILABLE, `${b}: ${a}`);
                throw a;
            }
            class fB {
                constructor(a){
                    (this.comparator = a ? (b, c)=>a(b, c) || l.comparator(b.key, c.key) : (a, b)=>l.comparator(a.key, b.key)), (this.keyedMap = ch()), (this.sortedSet = new q(this.comparator));
                }
                static emptySet(a) {
                    return new fB(a.comparator);
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
                indexOf(b) {
                    const a = this.keyedMap.get(b);
                    return a ? this.sortedSet.indexOf(a) : -1;
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
                    if (!(a instanceof fB)) return !1;
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
                copy(b, c) {
                    const a = new fB();
                    return ((a.comparator = this.comparator), (a.keyedMap = b), (a.sortedSet = c), a);
                }
            }
            class fC {
                constructor(){
                    this.Zr = new q(l.comparator);
                }
                track(a) {
                    const c = a.doc.key, b = this.Zr.get(c);
                    b ? 0 !== a.type && 3 === b.type ? (this.Zr = this.Zr.insert(c, a)) : 3 === a.type && 1 !== b.type ? (this.Zr = this.Zr.insert(c, {
                        type: b.type,
                        doc: a.doc
                    })) : 2 === a.type && 2 === b.type ? (this.Zr = this.Zr.insert(c, {
                        type: 2,
                        doc: a.doc
                    })) : 2 === a.type && 0 === b.type ? (this.Zr = this.Zr.insert(c, {
                        type: 0,
                        doc: a.doc
                    })) : 1 === a.type && 0 === b.type ? (this.Zr = this.Zr.remove(c)) : 1 === a.type && 2 === b.type ? (this.Zr = this.Zr.insert(c, {
                        type: 1,
                        doc: b.doc
                    })) : 0 === a.type && 1 === b.type ? (this.Zr = this.Zr.insert(c, {
                        type: 2,
                        doc: a.doc
                    })) : af() : (this.Zr = this.Zr.insert(c, a));
                }
                eo() {
                    const a = [];
                    return (this.Zr.inorderTraversal((c, b)=>{
                        a.push(b);
                    }), a);
                }
            }
            class fD {
                constructor(a, b, c, d, e, f, g, h){
                    (this.query = a), (this.docs = b), (this.oldDocs = c), (this.docChanges = d), (this.mutatedKeys = e), (this.fromCache = f), (this.syncStateChanged = g), (this.excludesMetadataChanges = h);
                }
                static fromInitialDocuments(b, a, c, d) {
                    const e = [];
                    return (a.forEach((a)=>{
                        e.push({
                            type: 0,
                            doc: a
                        });
                    }), new fD(b, a, fB.emptySet(a), e, c, d, !0, !1));
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(a) {
                    if (!(this.fromCache === a.fromCache && this.syncStateChanged === a.syncStateChanged && this.mutatedKeys.isEqual(a.mutatedKeys) && bA(this.query, a.query) && this.docs.isEqual(a.docs) && this.oldDocs.isEqual(a.oldDocs))) return !1;
                    const c = this.docChanges, d = a.docChanges;
                    if (c.length !== d.length) return !1;
                    for(let b = 0; b < c.length; b++)if (c[b].type !== d[b].type || !c[b].doc.isEqual(d[b].doc)) return !1;
                    return !0;
                }
            }
            class fE {
                constructor(){
                    (this.no = void 0), (this.listeners = []);
                }
            }
            class fF {
                constructor(){
                    (this.queries = new d5((a)=>bB(a), bA)), (this.onlineState = "Unknown"), (this.so = new Set());
                }
            }
            async function fG(f, b) {
                const c = ai(f), d = b.query;
                let e = !1, a = c.queries.get(d);
                if ((a || ((e = !0), (a = new fE())), e)) try {
                    a.no = await c.onListen(d);
                } catch (g) {
                    const h = fA(g, `Initialization of query '${bC(b.query)}' failed`);
                    return void b.onError(h);
                }
                if ((c.queries.set(d, a), a.listeners.push(b), b.io(c.onlineState), a.no)) {
                    b.ro(a.no) && fK(c);
                }
            }
            async function fH(g, d) {
                const b = ai(g), c = d.query;
                let e = !1;
                const a = b.queries.get(c);
                if (a) {
                    const f = a.listeners.indexOf(d);
                    f >= 0 && (a.listeners.splice(f, 1), (e = 0 === a.listeners.length));
                }
                if (e) return b.queries.delete(c), b.onUnlisten(c);
            }
            function fI(e, f) {
                const c = ai(e);
                let d = !1;
                for (const a of f){
                    const g = a.query, b = c.queries.get(g);
                    if (b) {
                        for (const h of b.listeners)h.ro(a) && (d = !0);
                        b.no = a;
                    }
                }
                d && fK(c);
            }
            function fJ(d, a, e) {
                const b = ai(d), c = b.queries.get(a);
                if (c) for (const f of c.listeners)f.onError(e);
                b.queries.delete(a);
            }
            function fK(a) {
                a.so.forEach((a)=>{
                    a.next();
                });
            }
            class fL {
                constructor(a, b, c){
                    (this.query = a), (this.oo = b), (this.co = !1), (this.ao = null), (this.onlineState = "Unknown"), (this.options = c || {});
                }
                ro(a) {
                    if (!this.options.includeMetadataChanges) {
                        const c = [];
                        for (const d of a.docChanges)3 !== d.type && c.push(d);
                        a = new fD(a.query, a.docs, a.oldDocs, c, a.mutatedKeys, a.fromCache, a.syncStateChanged, !0);
                    }
                    let b = !1;
                    return (this.co ? this.uo(a) && (this.oo.next(a), (b = !0)) : this.ho(a, this.onlineState) && (this.lo(a), (b = !0)), (this.ao = a), b);
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
                    (a = fD.fromInitialDocuments(a.query, a.docs, a.mutatedKeys, a.fromCache)), (this.co = !0), this.oo.next(a);
                }
            }
            class fM {
                constructor(a, b){
                    (this.payload = a), (this.byteLength = b);
                }
                wo() {
                    return "metadata" in this.payload;
                }
            }
            class fN {
                constructor(a){
                    this.N = a;
                }
                zn(a) {
                    return cH(this.N, a);
                }
                Hn(a) {
                    return a.metadata.exists ? cN(this.N, a.document, !1) : a3.newNoDocument(this.zn(a.metadata.name), this.Jn(a.metadata.readTime));
                }
                Jn(a) {
                    return cD(a);
                }
            }
            class fO {
                constructor(a, b, c){
                    (this._o = a), (this.localStore = b), (this.N = c), (this.queries = []), (this.documents = []), (this.progress = fP(a));
                }
                mo(a) {
                    this.progress.bytesLoaded += a.byteLength;
                    let b = this.progress.documentsLoaded;
                    return (a.payload.namedQuery ? this.queries.push(a.payload.namedQuery) : a.payload.documentMetadata ? (this.documents.push({
                        metadata: a.payload.documentMetadata
                    }), a.payload.documentMetadata.exists || ++b) : a.payload.document && ((this.documents[this.documents.length - 1].document = a.payload.document), ++b), b !== this.progress.documentsLoaded ? ((this.progress.documentsLoaded = b), Object.assign({}, this.progress)) : null);
                }
                yo(d) {
                    const a = new Map(), e = new fN(this.N);
                    for (const b of d)if (b.metadata.queries) {
                        const f = e.zn(b.metadata.name);
                        for (const c of b.metadata.queries){
                            const g = (a.get(c) || cl()).add(f);
                            a.set(c, g);
                        }
                    }
                    return a;
                }
                async complete() {
                    const b = await eA(this.localStore, new fN(this.N), this.documents, this._o.id), c = this.yo(this.documents);
                    for (const a of this.queries)await eB(this.localStore, a, c.get(a.name));
                    return ((this.progress.taskState = "Success"), new ei(Object.assign({}, this.progress), b));
                }
            }
            function fP(a) {
                return {
                    taskState: "Running",
                    documentsLoaded: 0,
                    bytesLoaded: 0,
                    totalDocuments: a.totalDocuments,
                    totalBytes: a.totalBytes
                };
            }
            class fQ {
                constructor(a){
                    this.key = a;
                }
            }
            class fR {
                constructor(a){
                    this.key = a;
                }
            }
            class fS {
                constructor(a, b){
                    (this.query = a), (this.po = b), (this.To = null), (this.current = !1), (this.Eo = cl()), (this.mutatedKeys = cl()), (this.Io = bE(a)), (this.Ao = new fB(this.Io));
                }
                get Ro() {
                    return this.po;
                }
                bo(g, a) {
                    const f = a ? a.Po : new fC(), c = a ? a.Ao : this.Ao;
                    let d = a ? a.mutatedKeys : this.mutatedKeys, b = c, h = !1;
                    const i = bs(this.query) && c.size === this.query.limit ? c.last() : null, j = bt(this.query) && c.size === this.query.limit ? c.first() : null;
                    if ((g.inorderTraversal((g, l)=>{
                        const e = c.get(g), a = bD(this.query, l) ? l : null, n = !!e && this.mutatedKeys.has(e.key), m = !!a && (a.hasLocalMutations || (this.mutatedKeys.has(a.key) && a.hasCommittedMutations));
                        let k = !1;
                        if (e && a) {
                            e.data.isEqual(a.data) ? n !== m && (f.track({
                                type: 3,
                                doc: a
                            }), (k = !0)) : this.vo(e, a) || (f.track({
                                type: 2,
                                doc: a
                            }), (k = !0), ((i && this.Io(a, i) > 0) || (j && this.Io(a, j) < 0)) && (h = !0));
                        } else !e && a ? (f.track({
                            type: 0,
                            doc: a
                        }), (k = !0)) : e && !a && (f.track({
                            type: 1,
                            doc: e
                        }), (k = !0), (i || j) && (h = !0));
                        k && (a ? ((b = b.add(a)), (d = m ? d.add(g) : d.delete(g))) : ((b = b.delete(g)), (d = d.delete(g))));
                    }), bs(this.query) || bt(this.query))) for(; b.size > this.query.limit;){
                        const e = bs(this.query) ? b.last() : b.first();
                        (b = b.delete(e.key)), (d = d.delete(e.key)), f.track({
                            type: 1,
                            doc: e
                        });
                    }
                    return {
                        Ao: b,
                        Po: f,
                        Ln: h,
                        mutatedKeys: d
                    };
                }
                vo(b, a) {
                    return (b.hasLocalMutations && a.hasCommittedMutations && !a.hasLocalMutations);
                }
                applyChanges(a, f, g) {
                    const h = this.Ao;
                    (this.Ao = a.Ao), (this.mutatedKeys = a.mutatedKeys);
                    const b = a.Po.eo();
                    b.sort((a, b)=>(function(b, c) {
                            const a = (a)=>{
                                switch(a){
                                    case 0:
                                        return 1;
                                    case 2:
                                    case 3:
                                        return 2;
                                    case 1:
                                        return 0;
                                    default:
                                        return af();
                                }
                            };
                            return a(b) - a(c);
                        })(a.type, b.type) || this.Io(a.doc, b.doc)), this.Vo(g);
                    const d = f ? this.So() : [], c = 0 === this.Eo.size && this.current ? 1 : 0, e = c !== this.To;
                    if (((this.To = c), 0 !== b.length || e)) {
                        return {
                            snapshot: new fD(this.query, a.Ao, h, b, a.mutatedKeys, 0 === c, e, !1),
                            Do: d
                        };
                    }
                    return {
                        Do: d
                    };
                }
                io(a) {
                    return this.current && "Offline" === a ? ((this.current = !1), this.applyChanges({
                        Ao: this.Ao,
                        Po: new fC(),
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
                    (this.Eo = cl()), this.Ao.forEach((a)=>{
                        this.Co(a.key) && (this.Eo = this.Eo.add(a.key));
                    });
                    const b = [];
                    return (a.forEach((a)=>{
                        this.Eo.has(a) || b.push(new fR(a));
                    }), this.Eo.forEach((c)=>{
                        a.has(c) || b.push(new fQ(c));
                    }), b);
                }
                No(a) {
                    (this.po = a.Gn), (this.Eo = cl());
                    const b = this.bo(a.documents);
                    return this.applyChanges(b, !0);
                }
                xo() {
                    return fD.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 === this.To);
                }
            }
            class fT {
                constructor(a, b, c){
                    (this.query = a), (this.targetId = b), (this.view = c);
                }
            }
            class fU {
                constructor(a){
                    (this.key = a), (this.ko = !1);
                }
            }
            class fV {
                constructor(a, b, c, d, e, f){
                    (this.localStore = a), (this.remoteStore = b), (this.eventManager = c), (this.sharedClientState = d), (this.currentUser = e), (this.maxConcurrentLimboResolutions = f), (this.$o = {}), (this.Oo = new d5((a)=>bB(a), bA)), (this.Fo = new Map()), (this.Mo = new Set()), (this.Lo = new q(l.comparator)), (this.Bo = new Map()), (this.Uo = new eD()), (this.qo = {}), (this.Ko = new Map()), (this.jo = dV.ie()), (this.onlineState = "Unknown"), (this.Qo = void 0);
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            async function fW(g, c) {
                const a = gn(g);
                let b, d;
                const e = a.Oo.get(c);
                if (e) (b = e.targetId), a.sharedClientState.addLocalQueryTarget(b), (d = e.view.xo());
                else {
                    const f = await eu(a.localStore, by(c)), h = a.sharedClientState.addLocalQueryTarget(f.targetId);
                    (b = f.targetId), (d = await fX(a, c, b, "current" === h)), a.isPrimaryClient && fa(a.remoteStore, f);
                }
                return d;
            }
            async function fX(a, b, c, g) {
                a.Wo = (b, c, d)=>(async function(b, a, f, d) {
                        let c = a.view.bo(f);
                        c.Ln && (c = await ew(b.localStore, a.query, !1).then(({ documents: b  })=>a.view.bo(b, c)));
                        const g = d && d.targetChanges.get(a.targetId), e = a.view.applyChanges(c, b.isPrimaryClient, g);
                        return f8(b, a.targetId, e.Do), e.snapshot;
                    })(a, b, c, d);
                const e = await ew(a.localStore, b, !0), d = new fS(b, e.Gn), h = d.bo(e.documents), i = cp.createSynthesizedTargetChangeForCurrentChange(c, g && "Offline" !== a.onlineState), f = d.applyChanges(h, a.isPrimaryClient, i);
                f8(a, c, f.Do);
                const j = new fT(b, c, d);
                return (a.Oo.set(b, j), a.Fo.has(c) ? a.Fo.get(c).push(b) : a.Fo.set(c, [
                    b
                ]), f.snapshot);
            }
            async function fY(e, c) {
                const a = ai(e), b = a.Oo.get(c), d = a.Fo.get(b.targetId);
                if (d.length > 1) return (a.Fo.set(b.targetId, d.filter((a)=>!bA(a, c))), void a.Oo.delete(c));
                if (a.isPrimaryClient) {
                    a.sharedClientState.removeLocalQueryTarget(b.targetId);
                    a.sharedClientState.isActiveQueryTarget(b.targetId) || (await ev(a.localStore, b.targetId, !1).then(()=>{
                        a.sharedClientState.clearQueryState(b.targetId), fb(a.remoteStore, b.targetId), f6(a, b.targetId);
                    }).catch(d$));
                } else f6(a, b.targetId), await ev(a.localStore, b.targetId, !0);
            }
            async function fZ(d, e, c) {
                const a = go(d);
                try {
                    const b = await (function(a, b) {
                        const c = ai(a), d = av.now(), e = b.reduce((a, b)=>a.add(b.key), cl());
                        let f;
                        return c.persistence.runTransaction("Locally write mutations", "readwrite", (a)=>c.Qn.Pn(a, e).next((i)=>{
                                f = i;
                                const h = [];
                                for (const e of b){
                                    const g = b_(e, f.get(e.key));
                                    null != g && h.push(new b3(e.key, g, a2(g.value.mapValue), bX.exists(!0)));
                                }
                                return c.In.addMutationBatch(a, d, h, b);
                            })).then((a)=>(a.applyToLocalDocumentSet(f), {
                                batchId: a.batchId,
                                changes: f
                            }));
                    })(a.localStore, e);
                    a.sharedClientState.addPendingMutation(b.batchId), (function(b, c, d) {
                        let a = b.qo[b.currentUser.toKey()];
                        a || (a = new q(M));
                        (a = a.insert(c, d)), (b.qo[b.currentUser.toKey()] = a);
                    })(a, b.batchId, c), await gb(a, b.changes), await fn(a.remoteStore);
                } catch (f) {
                    const g = fA(f, "Failed to persist write");
                    c.reject(g);
                }
            }
            async function f$(c, a) {
                const b = ai(c);
                try {
                    const d = await er(b.localStore, a);
                    a.targetChanges.forEach((a, d)=>{
                        const c = b.Bo.get(d);
                        c && (ag(a.addedDocuments.size + a.modifiedDocuments.size + a.removedDocuments.size <= 1), a.addedDocuments.size > 0 ? (c.ko = !0) : a.modifiedDocuments.size > 0 ? ag(c.ko) : a.removedDocuments.size > 0 && (ag(c.ko), (c.ko = !1)));
                    }), await gb(b, d, a);
                } catch (e) {
                    await d$(e);
                }
            }
            function f_(e, b, c) {
                const a = ai(e);
                if ((a.isPrimaryClient && 0 === c) || (!a.isPrimaryClient && 1 === c)) {
                    const d = [];
                    a.Oo.forEach((e, c)=>{
                        const a = c.view.io(b);
                        a.snapshot && d.push(a.snapshot);
                    }), (function(b, c) {
                        const a = ai(b);
                        a.onlineState = c;
                        let d = !1;
                        a.queries.forEach((e, a)=>{
                            for (const b of a.listeners)b.io(c) && (d = !0);
                        }), d && fK(a);
                    })(a.eventManager, b), d.length && a.$o.Rr(d), (a.onlineState = b), a.isPrimaryClient && a.sharedClientState.setOnlineState(b);
                }
            }
            async function f0(f, c, g) {
                const a = ai(f);
                a.sharedClientState.updateQueryState(c, "rejected", g);
                const e = a.Bo.get(c), b = e && e.key;
                if (b) {
                    let d = new q(l.comparator);
                    d = d.insert(b, a3.newNoDocument(b, aw.min()));
                    const h = cl().add(b), i = new co(aw.min(), new Map(), new C(M), d, h);
                    await f$(a, i), (a.Lo = a.Lo.remove(b)), a.Bo.delete(c), ga(a);
                } else await ev(a.localStore, c, !1).then(()=>f6(a, c, g)).catch(d$);
            }
            async function f1(d, c) {
                const a = ai(d), b = c.batch.batchId;
                try {
                    const e = await ep(a.localStore, c);
                    f5(a, b, null), f4(a, b), a.sharedClientState.updateMutationState(b, "acknowledged"), await gb(a, e);
                } catch (f) {
                    await d$(f);
                }
            }
            async function f2(d, b, c) {
                const a = ai(d);
                try {
                    const e = await (function(a, c) {
                        const b = ai(a);
                        return b.persistence.runTransaction("Reject batch", "readwrite-primary", (a)=>{
                            let d;
                            return b.In.lookupMutationBatch(a, c).next((c)=>(ag(null !== c), (d = c.keys()), b.In.removeMutationBatch(a, c))).next(()=>b.In.performConsistencyCheck(a)).next(()=>b.Qn.Pn(a, d));
                        });
                    })(a.localStore, b);
                    f5(a, b, c), f4(a, b), a.sharedClientState.updateMutationState(b, "rejected", c), await gb(a, e);
                } catch (f) {
                    await d$(f);
                }
            }
            async function f3(e, b) {
                const a = ai(e);
                fg(a.remoteStore) || ab("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
                try {
                    const c = await (function(a) {
                        const b = ai(a);
                        return b.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (a)=>b.In.getHighestUnacknowledgedBatchId(a));
                    })(a.localStore);
                    if (-1 === c) return void b.resolve();
                    const d = a.Ko.get(c) || [];
                    d.push(b), a.Ko.set(c, d);
                } catch (f) {
                    const g = fA(f, "Initialization of waitForPendingWrites() operation failed");
                    b.reject(g);
                }
            }
            function f4(a, b) {
                (a.Ko.get(b) || []).forEach((a)=>{
                    a.resolve();
                }), a.Ko.delete(b);
            }
            function f5(f, d, e) {
                const b = ai(f);
                let a = b.qo[b.currentUser.toKey()];
                if (a) {
                    const c = a.get(d);
                    c && (e ? c.reject(e) : c.resolve(), (a = a.remove(d))), (b.qo[b.currentUser.toKey()] = a);
                }
            }
            function f6(a, b, c = null) {
                a.sharedClientState.removeLocalQueryTarget(b);
                for (const d of a.Fo.get(b))a.Oo.delete(d), c && a.$o.Go(d, c);
                if ((a.Fo.delete(b), a.isPrimaryClient)) {
                    a.Uo.cs(b).forEach((b)=>{
                        a.Uo.containsKey(b) || f7(a, b);
                    });
                }
            }
            function f7(a, b) {
                a.Mo.delete(b.path.canonicalString());
                const c = a.Lo.get(b);
                null !== c && (fb(a.remoteStore, c), (a.Lo = a.Lo.remove(b)), a.Bo.delete(c), ga(a));
            }
            function f8(b, c, d) {
                for (const a of d)if (a instanceof fQ) b.Uo.addReference(a.key, c), f9(b, a);
                else if (a instanceof fR) {
                    ab("SyncEngine", "Document no longer in limbo: " + a.key), b.Uo.removeReference(a.key, c);
                    b.Uo.containsKey(a.key) || f7(b, a.key);
                } else af();
            }
            function f9(a, d) {
                const b = d.key, c = b.path.canonicalString();
                a.Lo.get(b) || a.Mo.has(c) || (ab("SyncEngine", "New document in limbo: " + b), a.Mo.add(c), ga(a));
            }
            function ga(a) {
                for(; a.Mo.size > 0 && a.Lo.size < a.maxConcurrentLimboResolutions;){
                    const d = a.Mo.values().next().value;
                    a.Mo.delete(d);
                    const b = new l(aA.fromString(d)), c = a.jo.next();
                    a.Bo.set(c, new fU(b)), (a.Lo = a.Lo.insert(b, c)), fa(a.remoteStore, new du(by(br(b.path)), c, 2, L.T));
                }
            }
            async function gb(b, f, g) {
                const a = ai(b), c = [], d = [], e = [];
                a.Oo.isEmpty() || (a.Oo.forEach((h, b)=>{
                    e.push(a.Wo(b, f, g).then((e)=>{
                        if (e) {
                            a.isPrimaryClient && a.sharedClientState.updateQueryState(b.targetId, e.fromCache ? "not-current" : "current"), c.push(e);
                            const f = ek.kn(b.targetId, e);
                            d.push(f);
                        }
                    }));
                }), await Promise.all(e), a.$o.Rr(c), await (async function(f, g) {
                    const a = ai(f);
                    try {
                        await a.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (b)=>df.forEach(g, (c)=>df.forEach(c.Nn, (d)=>a.persistence.referenceDelegate.addReference(b, c.targetId, d)).next(()=>df.forEach(c.xn, (d)=>a.persistence.referenceDelegate.removeReference(b, c.targetId, d)))));
                    } catch (b) {
                        if (!dk(b)) throw b;
                        ab("LocalStore", "Failed to update sequence numbers: " + b);
                    }
                    for (const c of g){
                        const d = c.targetId;
                        if (!c.fromCache) {
                            const e = a.Un.get(d), h = e.snapshotVersion, i = e.withLastLimboFreeSnapshotVersion(h);
                            a.Un = a.Un.insert(d, i);
                        }
                    }
                })(a.localStore, d));
            }
            async function gc(d, b) {
                const a = ai(d);
                if (!a.currentUser.isEqual(b)) {
                    ab("SyncEngine", "User change. New user:", b.toKey());
                    const c = await eo(a.localStore, b);
                    (a.currentUser = b), (function(a, b) {
                        a.Ko.forEach((a)=>{
                            a.forEach((a)=>{
                                a.reject(new K(aj.CANCELLED, b));
                            });
                        }), a.Ko.clear();
                    })(a, "'waitForPendingWrites' promise is rejected due to a user change."), a.sharedClientState.handleUserChange(b, c.removedBatchIds, c.addedBatchIds), await gb(a, c.Wn);
                }
            }
            function gd(f, d) {
                const b = ai(f), c = b.Bo.get(d);
                if (c && c.ko) return cl().add(c.key);
                {
                    let a = cl();
                    const e = b.Fo.get(d);
                    if (!e) return a;
                    for (const g of e){
                        const h = b.Oo.get(g);
                        a = a.unionWith(h.view.Ro);
                    }
                    return a;
                }
            }
            async function ge(d, a) {
                const b = ai(d), e = await ew(b.localStore, a.query, !0), c = a.view.No(e);
                return b.isPrimaryClient && f8(b, a.targetId, c.Do), c;
            }
            async function gf(a) {
                const b = ai(a);
                return ey(b.localStore).then((a)=>gb(b, a));
            }
            async function gg(e, b, c, f) {
                const a = ai(e), d = await (function(b, c) {
                    const a = ai(b), d = ai(a.In);
                    return a.persistence.runTransaction("Lookup mutation documents", "readonly", (b)=>d.Xt(b, c).next((c)=>c ? a.Qn.Pn(b, c) : df.resolve(null)));
                })(a.localStore, b);
                null !== d ? ("pending" === c ? await fn(a.remoteStore) : "acknowledged" === c || "rejected" === c ? (f5(a, b, f || null), f4(a, b), (function(a, b) {
                    ai(ai(a).In).te(b);
                })(a.localStore, b)) : af(), await gb(a, d)) : ab("SyncEngine", "Cannot apply mutation batch with id: " + b);
            }
            async function gh(c, b) {
                const a = ai(c);
                if ((gn(a), go(a), !0 === b && !0 !== a.Qo)) {
                    const d = a.sharedClientState.getAllActiveQueryTargets(), e = await gi(a, d.toArray());
                    (a.Qo = !0), await fw(a.remoteStore, !0);
                    for (const f of e)fa(a.remoteStore, f);
                } else if (!1 === b && !1 !== a.Qo) {
                    const g = [];
                    let h = Promise.resolve();
                    a.Fo.forEach((c, b)=>{
                        a.sharedClientState.isLocalQueryTarget(b) ? g.push(b) : (h = h.then(()=>(f6(a, b), ev(a.localStore, b, !0)))), fb(a.remoteStore, b);
                    }), await h, await gi(a, g), (function(b) {
                        const a = ai(b);
                        a.Bo.forEach((c, b)=>{
                            fb(a.remoteStore, b);
                        }), a.Uo.us(), (a.Bo = new Map()), (a.Lo = new q(l.comparator));
                    })(a), (a.Qo = !1), await fw(a.remoteStore, !1);
                }
            }
            async function gi(i, j, m) {
                const a = ai(i), e = [], f = [];
                for (const c of j){
                    let d;
                    const b = a.Fo.get(c);
                    if (b && 0 !== b.length) {
                        d = await eu(a.localStore, by(b[0]));
                        for (const k of b){
                            const l = a.Oo.get(k), g = await ge(a, l);
                            g.snapshot && f.push(g.snapshot);
                        }
                    } else {
                        const h = await ex(a.localStore, c);
                        (d = await eu(a.localStore, h)), await fX(a, gj(h), c, !1);
                    }
                    e.push(d);
                }
                return a.$o.Rr(f), e;
            }
            function gj(a) {
                return bq(a.path, a.collectionGroup, a.orderBy, a.filters, a.limit, "F", a.startAt, a.endAt);
            }
            function gk(a) {
                const b = ai(a);
                return ai(ai(b.localStore).persistence).pn();
            }
            async function gl(d, b, c, e) {
                const a = ai(d);
                if (a.Qo) ab("SyncEngine", "Ignoring unexpected query state notification.");
                else if (a.Fo.has(b)) switch(c){
                    case "current":
                    case "not-current":
                        {
                            const f = await ey(a.localStore), g = co.createSynthesizedRemoteEventForCurrentChange(b, "current" === c);
                            await gb(a, f, g);
                            break;
                        }
                    case "rejected":
                        await ev(a.localStore, b, !0), f6(a, b, e);
                        break;
                    default:
                        af();
                }
            }
            async function gm(f, g, h) {
                const a = gn(f);
                if (a.Qo) {
                    for (const b of g){
                        if (a.Fo.has(b)) {
                            ab("SyncEngine", "Adding an already active target " + b);
                            continue;
                        }
                        const c = await ex(a.localStore, b), d = await eu(a.localStore, c);
                        await fX(a, gj(c), d.targetId, !1), fa(a.remoteStore, d);
                    }
                    for (const e of h)a.Fo.has(e) && (await ev(a.localStore, e, !1).then(()=>{
                        fb(a.remoteStore, e), f6(a, e);
                    }).catch(d$));
                }
            }
            function gn(b) {
                const a = ai(b);
                return ((a.remoteStore.remoteSyncer.applyRemoteEvent = f$.bind(null, a)), (a.remoteStore.remoteSyncer.getRemoteKeysForTarget = gd.bind(null, a)), (a.remoteStore.remoteSyncer.rejectListen = f0.bind(null, a)), (a.$o.Rr = fI.bind(null, a.eventManager)), (a.$o.Go = fJ.bind(null, a.eventManager)), a);
            }
            function go(b) {
                const a = ai(b);
                return ((a.remoteStore.remoteSyncer.applySuccessfulWrite = f1.bind(null, a)), (a.remoteStore.remoteSyncer.rejectFailedWrite = f2.bind(null, a)), a);
            }
            function gp(a, b, c) {
                const d = ai(a);
                (async function(d, a, b) {
                    try {
                        const c = await a.getMetadata();
                        if (await (function(a, b) {
                            const c = ai(a), d = cD(b.createTime);
                            return c.persistence.runTransaction("hasNewerBundle", "readonly", (a)=>c.Je.getBundleMetadata(a, b.id)).then((a)=>!!a && a.createTime.compareTo(d) >= 0);
                        })(d.localStore, c)) return (await a.close(), void b._completeWith((function(a) {
                            return {
                                taskState: "Success",
                                documentsLoaded: a.totalDocuments,
                                bytesLoaded: a.totalBytes,
                                totalDocuments: a.totalDocuments,
                                totalBytes: a.totalBytes
                            };
                        })(c)));
                        b._updateProgress(fP(c));
                        const f = new fO(c, d.localStore, a.N);
                        let e = await a.zo();
                        for(; e;){
                            const g = await f.mo(e);
                            g && b._updateProgress(g), (e = await a.zo());
                        }
                        const h = await f.complete();
                        await gb(d, h.En, void 0), await (function(a, c) {
                            const b = ai(a);
                            return b.persistence.runTransaction("Save bundle", "readwrite", (a)=>b.Je.saveBundleMetadata(a, c));
                        })(d.localStore, c), b._completeWith(h.progress);
                    } catch (i) {
                        ad("SyncEngine", `Loading bundle failed with ${i}`), b._failWith(i);
                    }
                })(d, b, c).then(()=>{
                    d.sharedClientState.notifyBundleLoaded();
                });
            }
            class N {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(a) {
                    (this.N = e1(a.databaseInfo.databaseId)), (this.sharedClientState = this.Ho(a)), (this.persistence = this.Jo(a)), await this.persistence.start(), (this.gcScheduler = this.Yo(a)), (this.localStore = this.Xo(a));
                }
                Yo(a) {
                    return null;
                }
                Xo(a) {
                    return en(this.persistence, new el(), a.initialUser, this.N);
                }
                Jo(a) {
                    return new eJ(eL.Ns, this.N);
                }
                Ho(a) {
                    return new eV();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            class O extends (null && N) {
                constructor(a, b, c){
                    super(), (this.Zo = a), (this.cacheSizeBytes = b), (this.forceOwnership = c), (this.synchronizeTabs = !1);
                }
                async initialize(a) {
                    await super.initialize(a), await ez(this.localStore), await this.Zo.initialize(this, a), await go(this.Zo.syncEngine), await fn(this.Zo.remoteStore), await this.persistence.nn(()=>(this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(this.localStore), Promise.resolve()));
                }
                Xo(a) {
                    return en(this.persistence, new el(), a.initialUser, this.N);
                }
                Yo(a) {
                    const b = this.persistence.referenceDelegate.garbageCollector;
                    return new d1(b, a.asyncQueue);
                }
                Jo(a) {
                    const b = eh(a.databaseInfo.databaseId, a.databaseInfo.persistenceKey), d = void 0 !== this.cacheSizeBytes ? c.withCacheSize(this.cacheSizeBytes) : c.DEFAULT;
                    return new ee(this.synchronizeTabs, b, a.clientId, d, a.asyncQueue, e_(), e0(), this.N, this.sharedClientState, !!this.forceOwnership);
                }
                Ho(a) {
                    return new eV();
                }
            }
            class gq extends (null && O) {
                constructor(a, b){
                    super(a, b, !1), (this.Zo = a), (this.cacheSizeBytes = b), (this.synchronizeTabs = !0);
                }
                async initialize(b) {
                    await super.initialize(b);
                    const a = this.Zo.syncEngine;
                    this.sharedClientState instanceof eU && ((this.sharedClientState.syncEngine = {
                        _i: gg.bind(null, a),
                        mi: gl.bind(null, a),
                        gi: gm.bind(null, a),
                        pn: gk.bind(null, a),
                        wi: gf.bind(null, a)
                    }), await this.sharedClientState.start()), await this.persistence.nn(async (a)=>{
                        await gh(this.Zo.syncEngine, a), this.gcScheduler && (a && !this.gcScheduler.started ? this.gcScheduler.start(this.localStore) : a || this.gcScheduler.stop());
                    });
                }
                Ho(a) {
                    const b = e_();
                    if (!eU.bt(b)) throw new K(aj.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
                    const c = eh(a.databaseInfo.databaseId, a.databaseInfo.persistenceKey);
                    return new eU(b, a.asyncQueue, c, a.clientId, a.initialUser);
                }
            }
            class gr {
                async initialize(b, a) {
                    this.localStore || ((this.localStore = b.localStore), (this.sharedClientState = b.sharedClientState), (this.datastore = this.createDatastore(a)), (this.remoteStore = this.createRemoteStore(a)), (this.eventManager = this.createEventManager(a)), (this.syncEngine = this.createSyncEngine(a, !b.synchronizeTabs)), (this.sharedClientState.onlineStateHandler = (a)=>f_(this.syncEngine, a, 1)), (this.remoteStore.remoteSyncer.handleCredentialChange = gc.bind(null, this.syncEngine)), await fw(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(a) {
                    return new fF();
                }
                createDatastore(a) {
                    const b = e1(a.databaseInfo.databaseId), c = ((d = a.databaseInfo), new e$(d));
                    var d;
                    return (function(a, b, c) {
                        return new e5(a, b, c);
                    })(a.credentials, c, b);
                }
                createRemoteStore(a) {
                    return ((b = this.localStore), (c = this.datastore), (d = a.asyncQueue), (e = (a)=>f_(this.syncEngine, a, 0)), (f = eX.bt() ? new eX() : new eW()), new e7(b, c, d, e, f));
                    var b, c, d, e, f;
                }
                createSyncEngine(a, b) {
                    return (function(b, c, d, e, f, g, h) {
                        const a = new fV(b, c, d, e, f, g);
                        return h && (a.Qo = !0), a;
                    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, a.initialUser, a.maxConcurrentLimboResolutions, b);
                }
                terminate() {
                    return (async function(b) {
                        const a = ai(b);
                        ab("RemoteStore", "RemoteStore shutting down."), a.Wr.add(5), await e9(a), a.zr.shutdown(), a.Hr.set("Unknown");
                    })(this.remoteStore);
                }
            }
            function gs(a, b = 10240) {
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
            class gt {
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
            class gu {
                constructor(a, b){
                    (this.nc = a), (this.N = b), (this.metadata = new ak()), (this.buffer = new Uint8Array()), (this.sc = new TextDecoder("utf-8")), this.ic().then((a)=>{
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
                    const c = this.sc.decode(a), b = Number(c);
                    isNaN(b) && this.oc(`length string (${c}) is not valid number`);
                    const d = await this.cc(b);
                    return new fM(JSON.parse(d), a.length + b);
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
            class gv {
                constructor(a){
                    (this.datastore = a), (this.readVersions = new Map()), (this.mutations = []), (this.committed = !1), (this.lastWriteError = null), (this.writtenDocs = new Set());
                }
                async lookup(b) {
                    if ((this.ensureCommitNotCalled(), this.mutations.length > 0)) throw new K(aj.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
                    const a = await (async function(c, a) {
                        const b = ai(c), d = cK(b.N) + "/documents", e = {
                            documents: a.map((a)=>cG(b.N, a))
                        }, f = await b.Ki("BatchGetDocuments", d, e), h = new Map();
                        f.forEach((c)=>{
                            const a = cO(b.N, c);
                            h.set(a.key.toString(), a);
                        });
                        const g = [];
                        return (a.forEach((b)=>{
                            const a = h.get(b.toString());
                            ag(!!a), g.push(a);
                        }), g);
                    })(this.datastore, b);
                    return a.forEach((a)=>this.recordVersion(a)), a;
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
                    this.write(new b7(a, this.precondition(a))), this.writtenDocs.add(a.toString());
                }
                async commit() {
                    if ((this.ensureCommitNotCalled(), this.lastWriteError)) throw this.lastWriteError;
                    const a = this.readVersions;
                    this.mutations.forEach((b)=>{
                        a.delete(b.key.toString());
                    }), a.forEach((c, b)=>{
                        const a = l.fromPath(b);
                        this.mutations.push(new b8(a, this.precondition(a)));
                    }), await (async function(b, c) {
                        const a = ai(b), d = cK(a.N) + "/documents", e = {
                            writes: c.map((b)=>cQ(a.N, b))
                        };
                        await a.Li("Commit", d, e);
                    })(this.datastore, this.mutations), (this.committed = !0);
                }
                recordVersion(a) {
                    let b;
                    if (a.isFoundDocument()) b = a.version;
                    else {
                        if (!a.isNoDocument()) throw af();
                        b = aw.min();
                    }
                    const c = this.readVersions.get(a.key.toString());
                    if (c) {
                        if (!b.isEqual(c)) throw new K(aj.ABORTED, "Document version changed between two reads.");
                    } else this.readVersions.set(a.key.toString(), b);
                }
                precondition(a) {
                    const b = this.readVersions.get(a.toString());
                    return !this.writtenDocs.has(a.toString()) && b ? bX.updateTime(b) : bX.none();
                }
                preconditionForUpdate(b) {
                    const a = this.readVersions.get(b.toString());
                    if (!this.writtenDocs.has(b.toString()) && a) {
                        if (a.isEqual(aw.min())) throw new K(aj.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
                        return bX.updateTime(a);
                    }
                    return bX.exists(!0);
                }
                write(a) {
                    this.ensureCommitNotCalled(), this.mutations.push(a);
                }
                ensureCommitNotCalled() {}
            }
            class gw {
                constructor(a, b, c, d){
                    (this.asyncQueue = a), (this.datastore = b), (this.updateFunction = c), (this.deferred = d), (this.hc = 5), (this.ar = new e2(this.asyncQueue, "transaction_retry"));
                }
                run() {
                    (this.hc -= 1), this.lc();
                }
                lc() {
                    this.ar.Xi(async ()=>{
                        const b = new gv(this.datastore), a = this.fc(b);
                        a && a.then((a)=>{
                            this.asyncQueue.enqueueAndForget(()=>b.commit().then(()=>{
                                    this.deferred.resolve(a);
                                }).catch((a)=>{
                                    this.dc(a);
                                }));
                        }).catch((a)=>{
                            this.dc(a);
                        });
                    });
                }
                fc(b) {
                    try {
                        const a = this.updateFunction(b);
                        return !aM(a) && a.catch && a.then ? a : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
                    } catch (c) {
                        return this.deferred.reject(c), null;
                    }
                }
                dc(a) {
                    this.hc > 0 && this.wc(a) ? ((this.hc -= 1), this.asyncQueue.enqueueAndForget(()=>(this.lc(), Promise.resolve()))) : this.deferred.reject(a);
                }
                wc(b) {
                    if ("FirebaseError" === b.name) {
                        const a = b.code;
                        return ("aborted" === a || "failed-precondition" === a || !ca(a));
                    }
                    return !1;
                }
            }
            class gx {
                constructor(c, a, d){
                    (this.credentials = c), (this.asyncQueue = a), (this.databaseInfo = d), (this.user = b.UNAUTHENTICATED), (this.clientId = as.I()), (this.credentialListener = ()=>Promise.resolve()), this.credentials.start(a, async (a)=>{
                        ab("FirestoreClient", "Received user=", a.uid), await this.credentialListener(a), (this.user = a);
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
                    if (this.asyncQueue.isShuttingDown) throw new K(aj.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const a = new ak();
                    return (this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && (await this.onlineComponents.terminate()), this.offlineComponents && (await this.offlineComponents.terminate()), this.credentials.shutdown(), a.resolve();
                        } catch (b) {
                            const c = fA(b, "Failed to shutdown persistence");
                            a.reject(c);
                        }
                    }), a.promise);
                }
            }
            async function gy(a, b) {
                a.asyncQueue.verifyOperationInProgress(), ab("FirestoreClient", "Initializing OfflineComponentProvider");
                const c = await a.getConfiguration();
                await b.initialize(c);
                let d = c.initialUser;
                a.setCredentialChangeListener(async (a)=>{
                    d.isEqual(a) || (await eo(b.localStore, a), (d = a));
                }), b.persistence.setDatabaseDeletedListener(()=>a.terminate()), (a.offlineComponents = b);
            }
            async function gz(a, b) {
                a.asyncQueue.verifyOperationInProgress();
                const c = await gA(a);
                ab("FirestoreClient", "Initializing OnlineComponentProvider");
                const d = await a.getConfiguration();
                await b.initialize(c, d), a.setCredentialChangeListener((a)=>(async function(b, c) {
                        const a = ai(b);
                        a.asyncQueue.verifyOperationInProgress(), ab("RemoteStore", "RemoteStore received new credentials");
                        const d = fg(a);
                        a.Wr.add(3), await e9(a), d && a.Hr.set("Unknown"), await a.remoteSyncer.handleCredentialChange(c), a.Wr.delete(3), await e8(a);
                    })(b.remoteStore, a)), (a.onlineComponents = b);
            }
            async function gA(a) {
                return (a.offlineComponents || (ab("FirestoreClient", "Using default OfflineComponentProvider"), await gy(a, new N())), a.offlineComponents);
            }
            async function gB(a) {
                return (a.onlineComponents || (ab("FirestoreClient", "Using default OnlineComponentProvider"), await gz(a, new gr())), a.onlineComponents);
            }
            function gC(a) {
                return gA(a).then((a)=>a.persistence);
            }
            function gD(a) {
                return gA(a).then((a)=>a.localStore);
            }
            function gE(a) {
                return gB(a).then((a)=>a.remoteStore);
            }
            function gF(a) {
                return gB(a).then((a)=>a.syncEngine);
            }
            async function gG(c) {
                const a = await gB(c), b = a.eventManager;
                return ((b.onListen = fW.bind(null, a.syncEngine)), (b.onUnlisten = fY.bind(null, a.syncEngine)), b);
            }
            function gH(a) {
                return a.asyncQueue.enqueue(async ()=>{
                    const b = await gC(a), c = await gE(a);
                    return (b.setNetworkEnabled(!0), (function(b) {
                        const a = ai(b);
                        return a.Wr.delete(0), e8(a);
                    })(c));
                });
            }
            function gI(a) {
                return a.asyncQueue.enqueue(async ()=>{
                    const b = await gC(a), c = await gE(a);
                    return (b.setNetworkEnabled(!1), (async function(b) {
                        const a = ai(b);
                        a.Wr.add(0), await e9(a), a.Hr.set("Offline");
                    })(c));
                });
            }
            function gJ(a, c) {
                const b = new ak();
                return (a.asyncQueue.enqueueAndForget(async ()=>(async function(d, c, a) {
                        try {
                            const b = await (function(a, c) {
                                const b = ai(a);
                                return b.persistence.runTransaction("read document", "readonly", (a)=>b.Qn.An(a, c));
                            })(d, c);
                            b.isFoundDocument() ? a.resolve(b) : b.isNoDocument() ? a.resolve(null) : a.reject(new K(aj.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
                        } catch (e) {
                            const f = fA(e, `Failed to get document '${c} from cache`);
                            a.reject(f);
                        }
                    })(await gD(a), c, b)), b.promise);
            }
            function gK(a, c, d = {}) {
                const b = new ak();
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(a, e, b, f, g) {
                        const c = new gt({
                            next: (c)=>{
                                e.enqueueAndForget(()=>fH(a, d));
                                const h = c.docs.has(b);
                                !h && c.fromCache ? g.reject(new K(aj.UNAVAILABLE, "Failed to get document because the client is offline.")) : h && c.fromCache && f && "server" === f.source ? g.reject(new K(aj.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : g.resolve(c);
                            },
                            error: (a)=>g.reject(a)
                        }), d = new fL(br(b.path), c, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return fG(a, d);
                    })(await gG(a), a.asyncQueue, c, d, b)), b.promise);
            }
            function gL(a, c) {
                const b = new ak();
                return (a.asyncQueue.enqueueAndForget(async ()=>(async function(e, a, b) {
                        try {
                            const c = await ew(e, a, !0), d = new fS(a, c.Gn), f = d.bo(c.documents), g = d.applyChanges(f, !1);
                            b.resolve(g.snapshot);
                        } catch (h) {
                            const i = fA(h, `Failed to execute query '${a} against cache`);
                            b.reject(i);
                        }
                    })(await gD(a), c, b)), b.promise);
            }
            function gM(a, c, d = {}) {
                const b = new ak();
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(a, e, b, f, g) {
                        const c = new gt({
                            next: (b)=>{
                                e.enqueueAndForget(()=>fH(a, d)), b.fromCache && "server" === f.source ? g.reject(new K(aj.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : g.resolve(b);
                            },
                            error: (a)=>g.reject(a)
                        }), d = new fL(b, c, {
                            includeMetadataChanges: !0,
                            fo: !0
                        });
                        return fG(a, d);
                    })(await gG(a), a.asyncQueue, c, d, b)), b.promise);
            }
            function gN(a, b) {
                const c = new gt(b);
                return (a.asyncQueue.enqueueAndForget(async ()=>(function(b, a) {
                        ai(b).so.add(a), a.next();
                    })(await gG(a), c)), ()=>{
                    c.ec(), a.asyncQueue.enqueueAndForget(async ()=>(function(a, b) {
                            ai(a).so.delete(b);
                        })(await gG(a), c));
                });
            }
            function gO(a, c) {
                const b = new ak();
                return (a.asyncQueue.enqueueAndForget(async ()=>{
                    const d = await (function(a) {
                        return gB(a).then((a)=>a.datastore);
                    })(a);
                    new gw(a.asyncQueue, d, c, b).run();
                }), b.promise);
            }
            function gP(a, b, c, d) {
                const e = (function(a, c) {
                    let b;
                    b = "string" == typeof a ? new TextEncoder().encode(a) : a;
                    return (function(a, b) {
                        return new gu(a, b);
                    })((function(a, b) {
                        if (a instanceof Uint8Array) return gs(a, b);
                        if (a instanceof ArrayBuffer) return gs(new Uint8Array(a), b);
                        if (a instanceof ReadableStream) return a.getReader();
                        throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
                    })(b), c);
                })(c, e1(b));
                a.asyncQueue.enqueueAndForget(async ()=>{
                    gp(await gF(a), e, d);
                });
            }
            function gQ(a, b) {
                return a.asyncQueue.enqueue(async ()=>(function(a, c) {
                        const b = ai(a);
                        return b.persistence.runTransaction("Get named query", "readonly", (a)=>b.Je.getNamedQuery(a, c));
                    })(await gD(a), b));
            }
            class gR {
                constructor(a, b, c, d, e, f, g, h){
                    (this.databaseId = a), (this.appId = b), (this.persistenceKey = c), (this.host = d), (this.ssl = e), (this.forceLongPolling = f), (this.autoDetectLongPolling = g), (this.useFetchStreams = h);
                }
            }
            class gS {
                constructor(a, b){
                    (this.projectId = a), (this.database = b || "(default)");
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(a) {
                    return (a instanceof gS && a.projectId === this.projectId && a.database === this.database);
                }
            }
            const gT = new Map();
            function gU(a, b, c) {
                if (!c) throw new K(aj.INVALID_ARGUMENT, `Function ${a}() cannot be called with an empty ${b}.`);
            }
            function gV(a, b, c, d) {
                if (!0 === b && !0 === d) throw new K(aj.INVALID_ARGUMENT, `${a} and ${c} cannot be used together.`);
            }
            function gW(a) {
                if (!l.isDocumentKey(a)) throw new K(aj.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${a} has ${a.length}.`);
            }
            function gX(a) {
                if (l.isDocumentKey(a)) throw new K(aj.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${a} has ${a.length}.`);
            }
            function gY(a) {
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
                return "function" == typeof a ? "a function" : af();
            }
            function gZ(a, b) {
                if (("_delegate" in a && (a = a._delegate), !(a instanceof b))) {
                    if (b.name === a.constructor.name) throw new K(aj.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const c = gY(a);
                        throw new K(aj.INVALID_ARGUMENT, `Expected type '${b.name}', but it was: ${c}`);
                    }
                }
                return a;
            }
            function g$(b, a) {
                if (a <= 0) throw new K(aj.INVALID_ARGUMENT, `Function ${b}() requires a positive number, but it was: ${a}.`);
            }
            class g_ {
                constructor(a){
                    var b;
                    if (void 0 === a.host) {
                        if (void 0 !== a.ssl) throw new K(aj.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        (this.host = "firestore.googleapis.com"), (this.ssl = true);
                    } else (this.host = a.host), (this.ssl = null === (b = a.ssl) || void 0 === b || b);
                    if (((this.credentials = a.credentials), (this.ignoreUndefinedProperties = !!a.ignoreUndefinedProperties), void 0 === a.cacheSizeBytes)) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== a.cacheSizeBytes && a.cacheSizeBytes < 1048576) throw new K(aj.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = a.cacheSizeBytes;
                    }
                    (this.experimentalForceLongPolling = !!a.experimentalForceLongPolling), (this.experimentalAutoDetectLongPolling = !!a.experimentalAutoDetectLongPolling), (this.useFetchStreams = !!a.useFetchStreams), gV("experimentalForceLongPolling", a.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", a.experimentalAutoDetectLongPolling);
                }
                isEqual(a) {
                    return (this.host === a.host && this.ssl === a.ssl && this.credentials === a.credentials && this.cacheSizeBytes === a.cacheSizeBytes && this.experimentalForceLongPolling === a.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === a.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === a.ignoreUndefinedProperties && this.useFetchStreams === a.useFetchStreams);
                }
            }
            class P {
                constructor(a, b){
                    (this._credentials = b), (this.type = "firestore-lite"), (this._persistenceKey = "(lite)"), (this._settings = new g_({})), (this._settingsFrozen = !1), a instanceof gS ? (this._databaseId = a) : ((this._app = a), (this._databaseId = (function(a) {
                        if (!Object.prototype.hasOwnProperty.apply(a.options, [
                            "projectId"
                        ])) throw new K(aj.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new gS(a.options.projectId);
                    })(a)));
                }
                get app() {
                    if (!this._app) throw new K(aj.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(a) {
                    if (this._settingsFrozen) throw new K(aj.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    (this._settings = new g_(a)), void 0 !== a.credentials && (this._credentials = (function(a) {
                        if (!a) return new am();
                        switch(a.type){
                            case "gapi":
                                const b = a.client;
                                return (ag(!("object" != typeof b || null === b || !b.auth || !b.auth.getAuthHeaderValueForFirstParty)), new aq(b, a.sessionIndex || "0", a.iamToken || null));
                            case "provider":
                                return a.client;
                            default:
                                throw new K(aj.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
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
                        const b = gT.get(a);
                        b && (ab("ComponentProvider", "Removing Datastore"), gT.delete(a), b.terminate());
                    })(this), Promise.resolve());
                }
            }
            function g0(c, h, j, a = {}) {
                var d;
                const e = (c = gZ(c, P))._getSettings();
                if (("firestore.googleapis.com" !== e.host && e.host !== h && ad("Host has been set in both settings() and useEmulator(), emulator host will be used"), c._setSettings(Object.assign(Object.assign({}, e), {
                    host: `${h}:${j}`,
                    ssl: !1
                })), a.mockUserToken)) {
                    let f, g;
                    if ("string" == typeof a.mockUserToken) (f = a.mockUserToken), (g = b.MOCK_USER);
                    else {
                        f = createMockUserToken(a.mockUserToken, null === (d = c._app) || void 0 === d ? void 0 : d.options.projectId);
                        const i = a.mockUserToken.sub || a.mockUserToken.user_id;
                        if (!i) throw new K(aj.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
                        g = new b(i);
                    }
                    c._credentials = new an(new al(f, g));
                }
            }
            class g1 {
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
                    return new g2(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(a) {
                    return new g1(this.firestore, a, this._key);
                }
            }
            class Q {
                constructor(a, b, c){
                    (this.converter = b), (this._query = c), (this.type = "query"), (this.firestore = a);
                }
                withConverter(a) {
                    return new Q(this.firestore, a, this._query);
                }
            }
            class g2 extends Q {
                constructor(b, c, a){
                    super(b, c, br(a)), (this._path = a), (this.type = "collection");
                }
                get id() {
                    return this._query.path.lastSegment();
                }
                get path() {
                    return this._query.path.canonicalString();
                }
                get parent() {
                    const a = this._path.popLast();
                    return a.isEmpty() ? null : new g1(this.firestore, null, new l(a));
                }
                withConverter(a) {
                    return new g2(this.firestore, a, this._path);
                }
            }
            function g3(a, b, ...c) {
                if (((a = (0, V.m9)(a)), gU("collection", "path", b), a instanceof P)) {
                    const d = aA.fromString(b, ...c);
                    return gX(d), new g2(a, null, d);
                }
                {
                    if (!(a instanceof g1 || a instanceof g2)) throw new K(aj.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const e = a._path.child(aA.fromString(b, ...c));
                    return (gX(e), new g2(a.firestore, null, e));
                }
            }
            function g4(b, a) {
                if (((b = gZ(b, P)), gU("collectionGroup", "collection id", a), a.indexOf("/") >= 0)) throw new K(aj.INVALID_ARGUMENT, `Invalid collection ID '${a}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
                return new Q(b, null, (function(a) {
                    return new bp(aA.emptyPath(), a);
                })(a));
            }
            function g5(a, b, ...c) {
                if (((a = getModularInstance(a)), 1 === arguments.length && (b = as.I()), gU("doc", "path", b), a instanceof P)) {
                    const d = aA.fromString(b, ...c);
                    return (gW(d), new g1(a, null, new l(d)));
                }
                {
                    if (!(a instanceof g1 || a instanceof g2)) throw new K(aj.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const e = a._path.child(aA.fromString(b, ...c));
                    return (gW(e), new g1(a.firestore, a instanceof g2 ? a.converter : null, new l(e)));
                }
            }
            function g6(a, b) {
                return ((a = getModularInstance(a)), (b = getModularInstance(b)), (a instanceof g1 || a instanceof g2) && (b instanceof g1 || b instanceof g2) && a.firestore === b.firestore && a.path === b.path && a.converter === b.converter);
            }
            function g7(a, b) {
                return ((a = getModularInstance(a)), (b = getModularInstance(b)), a instanceof Q && b instanceof Q && a.firestore === b.firestore && bA(a._query, b._query) && a.converter === b.converter);
            }
            class g8 {
                constructor(){
                    (this._c = Promise.resolve()), (this.mc = []), (this.gc = !1), (this.yc = []), (this.Tc = null), (this.Ec = !1), (this.Ic = !1), (this.Ac = []), (this.ar = new e2(this, "async_queue_retry")), (this.Rc = ()=>{
                        const a = e0();
                        a && ab("AsyncQueue", "Visibility state changed to " + a.visibilityState), this.ar.tr();
                    });
                    const a = e0();
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
                enterRestrictedMode(b) {
                    if (!this.gc) {
                        (this.gc = !0), (this.Ic = b || !1);
                        const a = e0();
                        a && "function" == typeof a.removeEventListener && a.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(a) {
                    if ((this.bc(), this.gc)) return new Promise(()=>{});
                    const b = new ak();
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
                            if (!dk(a)) throw a;
                            ab("AsyncQueue", "Operation failed with retryable error: " + a);
                        }
                        this.mc.length > 0 && this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(b) {
                    const a = this._c.then(()=>((this.Ec = !0), b().catch((a)=>{
                            (this.Tc = a), (this.Ec = !1);
                            const b = (function(a) {
                                let b = a.message || "";
                                a.stack && (b = a.stack.includes(a.message) ? a.stack : a.message + "\n" + a.stack);
                                return b;
                            })(a);
                            throw ((ac("INTERNAL UNHANDLED ERROR: ", b), a));
                        }).then((a)=>((this.Ec = !1), a))));
                    return (this._c = a), a;
                }
                enqueueAfterDelay(a, b, d) {
                    this.bc(), this.Ac.indexOf(a) > -1 && (b = 0);
                    const c = fz.createAndSchedule(this, a, b, d, (a)=>this.Vc(a));
                    return this.yc.push(c), c;
                }
                bc() {
                    this.Tc && af();
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
            function g9(a) {
                return (function(a, d) {
                    if ("object" != typeof a || null === a) return !1;
                    const b = a;
                    for (const c of d)if (c in b && "function" == typeof b[c]) return !0;
                    return !1;
                })(a, [
                    "next",
                    "error",
                    "complete"
                ]);
            }
            class ha {
                constructor(){
                    (this._progressObserver = {}), (this._taskCompletionResolver = new ak()), (this._lastProgress = {
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
            const hb = null && -1;
            class hc extends P {
                constructor(a, b){
                    super(a, b), (this.type = "firestore"), (this._queue = new g8()), (this._persistenceKey = "name" in a ? a.name : "[DEFAULT]");
                }
                _terminate() {
                    return (this._firestoreClient || hg(this), this._firestoreClient.terminate());
                }
            }
            function hd(c, a) {
                const b = _getProvider(c, "firestore");
                if (b.isInitialized()) {
                    const d = b.getImmediate(), e = b.getOptions();
                    if (deepEqual(e, a)) return d;
                    throw new K(aj.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
                }
                if (void 0 !== a.cacheSizeBytes && -1 !== a.cacheSizeBytes && a.cacheSizeBytes < 1048576) throw new K(aj.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                return b.initialize({
                    options: a
                });
            }
            function he(a = getApp()) {
                return _getProvider(a, "firestore").getImmediate();
            }
            function hf(a) {
                return (a._firestoreClient || hg(a), a._firestoreClient.verifyNotTerminated(), a._firestoreClient);
            }
            function hg(a) {
                var b;
                const c = a._freezeSettings(), d = (function(b, c, d, a) {
                    return new gR(b, c, d, a.host, a.ssl, a.experimentalForceLongPolling, a.experimentalAutoDetectLongPolling, a.useFetchStreams);
                })(a._databaseId, (null === (b = a._app) || void 0 === b ? void 0 : b.options.appId) || "", a._persistenceKey, c);
                a._firestoreClient = new gx(a._credentials, a._queue, d);
            }
            function hh(a, b) {
                hr((a = gZ(a, hc)));
                const d = hf(a), e = a._freezeSettings(), c = new gr();
                return hj(d, c, new O(c, e.cacheSizeBytes, null == b ? void 0 : b.forceOwnership));
            }
            function hi(a) {
                hr((a = gZ(a, hc)));
                const c = hf(a), d = a._freezeSettings(), b = new gr();
                return hj(c, b, new gq(b, d.cacheSizeBytes));
            }
            function hj(a, b, c) {
                const d = new ak();
                return a.asyncQueue.enqueue(async ()=>{
                    try {
                        await gy(a, c), await gz(a, b), d.resolve();
                    } catch (e) {
                        if (!((function(a) {
                            if ("FirebaseError" === a.name) return (a.code === aj.FAILED_PRECONDITION || a.code === aj.UNIMPLEMENTED);
                            if ("undefined" != typeof DOMException && a instanceof DOMException) return (22 === a.code || 20 === a.code || 11 === a.code);
                            return !0;
                        })(e))) throw e;
                        console.warn("Error enabling offline persistence. Falling back to persistence disabled: " + e), d.reject(e);
                    }
                }).then(()=>d.promise);
            }
            function hk(a) {
                if (a._initialized && !a._terminated) throw new K(aj.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
                const b = new ak();
                return (a._queue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                    try {
                        await (async function(a) {
                            if (!dh.bt()) return Promise.resolve();
                            const b = a + "main";
                            await dh.delete(b);
                        })(eh(a._databaseId, a._persistenceKey)), b.resolve();
                    } catch (c) {
                        b.reject(c);
                    }
                }), b.promise);
            }
            function hl(a) {
                return (function(a) {
                    const b = new ak();
                    return (a.asyncQueue.enqueueAndForget(async ()=>f3(await gF(a), b)), b.promise);
                })(hf((a = gZ(a, hc))));
            }
            function hm(a) {
                return gH(hf((a = gZ(a, hc))));
            }
            function hn(a) {
                return gI(hf((a = gZ(a, hc))));
            }
            function ho(a) {
                return (_removeServiceInstance(a.app, "firestore"), a._delete());
            }
            function hp(a, c) {
                const d = hf((a = gZ(a, hc))), b = new ha();
                return gP(d, a._databaseId, c, b), b;
            }
            function hq(a, b) {
                return gQ(hf((a = gZ(a, hc))), b).then((b)=>b ? new Q(a, null, b.query) : null);
            }
            function hr(a) {
                if (a._initialized || a._terminated) throw new K(aj.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
            }
            class hs {
                constructor(...a){
                    for(let b = 0; b < a.length; ++b)if (0 === a[b].length) throw new K(aj.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new aC(a);
                }
                isEqual(a) {
                    return this._internalPath.isEqual(a._internalPath);
                }
            }
            function ht() {
                return new hs("__name__");
            }
            class hu {
                constructor(a){
                    this._byteString = a;
                }
                static fromBase64String(a) {
                    try {
                        return new hu(A.fromBase64String(a));
                    } catch (b) {
                        throw new K(aj.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + b);
                    }
                }
                static fromUint8Array(a) {
                    return new hu(A.fromUint8Array(a));
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
            class j {
                constructor(a){
                    this._methodName = a;
                }
            }
            class hv {
                constructor(a, b){
                    if (!isFinite(a) || a < -90 || a > 90) throw new K(aj.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + a);
                    if (!isFinite(b) || b < -180 || b > 180) throw new K(aj.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + b);
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
                    return M(this._lat, a._lat) || M(this._long, a._long);
                }
            }
            const hw = /^__.*__$/;
            class hx {
                constructor(a, b, c){
                    (this.data = a), (this.fieldMask = b), (this.fieldTransforms = c);
                }
                toMutation(a, b) {
                    return null !== this.fieldMask ? new b3(a, this.data, this.fieldMask, b, this.fieldTransforms) : new b2(a, this.data, b, this.fieldTransforms);
                }
            }
            class hy {
                constructor(a, b, c){
                    (this.data = a), (this.fieldMask = b), (this.fieldTransforms = c);
                }
                toMutation(a, b) {
                    return new b3(a, this.data, this.fieldMask, b, this.fieldTransforms);
                }
            }
            function hz(a) {
                switch(a){
                    case 0:
                    case 2:
                    case 1:
                        return !0;
                    case 3:
                    case 4:
                        return !1;
                    default:
                        throw af();
                }
            }
            class hA {
                constructor(b, c, d, e, a, f){
                    (this.settings = b), (this.databaseId = c), (this.N = d), (this.ignoreUndefinedProperties = e), void 0 === a && this.xc(), (this.fieldTransforms = a || []), (this.fieldMask = f || []);
                }
                get path() {
                    return this.settings.path;
                }
                get kc() {
                    return this.settings.kc;
                }
                $c(a) {
                    return new hA(Object.assign(Object.assign({}, this.settings), a), this.databaseId, this.N, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
                }
                Oc(b) {
                    var a;
                    const d = null === (a = this.path) || void 0 === a ? void 0 : a.child(b), c = this.$c({
                        path: d,
                        Fc: !1
                    });
                    return c.Mc(b), c;
                }
                Lc(c) {
                    var a;
                    const d = null === (a = this.path) || void 0 === a ? void 0 : a.child(c), b = this.$c({
                        path: d,
                        Fc: !1
                    });
                    return b.xc(), b;
                }
                Bc(a) {
                    return this.$c({
                        path: void 0,
                        Fc: !0
                    });
                }
                Uc(a) {
                    return hU(a, this.settings.methodName, this.settings.qc || !1, this.path, this.settings.Kc);
                }
                contains(a) {
                    return (void 0 !== this.fieldMask.find((b)=>a.isPrefixOf(b)) || void 0 !== this.fieldTransforms.find((b)=>a.isPrefixOf(b.field)));
                }
                xc() {
                    if (this.path) for(let a = 0; a < this.path.length; a++)this.Mc(this.path.get(a));
                }
                Mc(a) {
                    if (0 === a.length) throw this.Uc("Document fields must not be empty");
                    if (hz(this.kc) && hw.test(a)) throw this.Uc('Document fields cannot begin and end with "__"');
                }
            }
            class hB {
                constructor(a, b, c){
                    (this.databaseId = a), (this.ignoreUndefinedProperties = b), (this.N = c || e1(a));
                }
                jc(a, b, c, d = !1) {
                    return new hA({
                        kc: a,
                        methodName: b,
                        Kc: c,
                        path: aC.emptyPath(),
                        Fc: !1,
                        qc: d
                    }, this.databaseId, this.N, this.ignoreUndefinedProperties);
                }
            }
            function hC(a) {
                const b = a._freezeSettings(), c = e1(a._databaseId);
                return new hB(a._databaseId, !!b.ignoreUndefinedProperties, c);
            }
            function hD(j, g, h, i, k, b = {}) {
                const a = j.jc(b.merge || b.mergeFields ? 2 : 0, g, h, k);
                hQ("Data must be an object, but it was:", a, i);
                const l = hO(i, a);
                let c, d;
                if (b.merge) (c = new aD(a.fieldMask)), (d = a.fieldTransforms);
                else if (b.mergeFields) {
                    const f = [];
                    for (const m of b.mergeFields){
                        const e = hR(g, m, h);
                        if (!a.contains(e)) throw new K(aj.INVALID_ARGUMENT, `Field '${e}' is specified in your field mask but missing from your input data.`);
                        hV(f, e) || f.push(e);
                    }
                    (c = new aD(f)), (d = a.fieldTransforms.filter((a)=>c.covers(a.field)));
                } else (c = null), (d = a.fieldTransforms);
                return new hx(new a1(l), c, d);
            }
            class hE extends (null && j) {
                _toFieldTransform(a) {
                    if (2 !== a.kc) throw 1 === a.kc ? a.Uc(`${this._methodName}() can only appear at the top level of your update data`) : a.Uc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
                    return a.fieldMask.push(a.path), null;
                }
                isEqual(a) {
                    return a instanceof hE;
                }
            }
            function hF(b, a, c) {
                return new hA({
                    kc: 3,
                    Kc: a.settings.Kc,
                    methodName: b._methodName,
                    Fc: c
                }, a.databaseId, a.N, a.ignoreUndefinedProperties);
            }
            class hG extends (null && j) {
                _toFieldTransform(a) {
                    return new bU(a.path, new bM());
                }
                isEqual(a) {
                    return a instanceof hG;
                }
            }
            class hH extends (null && j) {
                constructor(a, b){
                    super(a), (this.Qc = b);
                }
                _toFieldTransform(a) {
                    const d = hF(this, a, !0), b = this.Qc.map((a)=>hN(a, d)), c = new bN(b);
                    return new bU(a.path, c);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            class hI extends (null && j) {
                constructor(a, b){
                    super(a), (this.Qc = b);
                }
                _toFieldTransform(a) {
                    const d = hF(this, a, !0), b = this.Qc.map((a)=>hN(a, d)), c = new bP(b);
                    return new bU(a.path, c);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            class hJ extends (null && j) {
                constructor(a, b){
                    super(a), (this.Wc = b);
                }
                _toFieldTransform(a) {
                    const b = new bR(a.N, bI(a.N, this.Wc));
                    return new bU(a.path, b);
                }
                isEqual(a) {
                    return this === a;
                }
            }
            function hK(c, d, e, a) {
                const b = c.jc(1, d, e);
                hQ("Data must be an object, but it was:", b, a);
                const f = [], g = a1.empty();
                ay(a, (i, a)=>{
                    const c = hT(d, i, e);
                    a = getModularInstance(a);
                    const j = b.Lc(c);
                    if (a instanceof hE) f.push(c);
                    else {
                        const h = hN(a, j);
                        null != h && (f.push(c), g.set(c, h));
                    }
                });
                const h = new aD(f);
                return new hy(g, h, b.fieldTransforms);
            }
            function hL(n, b, i, o, p, c) {
                const j = n.jc(1, b, i), d = [
                    hR(b, o, i)
                ], k = [
                    p
                ];
                if (c.length % 2 != 0) throw new K(aj.INVALID_ARGUMENT, `Function ${b}() needs to be called with an even number of arguments that alternate between field names and values.`);
                for(let e = 0; e < c.length; e += 2)d.push(hR(b, c[e])), k.push(c[e + 1]);
                const f = [], l = a1.empty();
                for(let a = d.length - 1; a >= 0; --a)if (!hV(f, d[a])) {
                    const g = d[a];
                    let h = k[a];
                    h = getModularInstance(h);
                    const q = j.Lc(g);
                    if (h instanceof hE) f.push(g);
                    else {
                        const m = hN(h, q);
                        null != m && (f.push(g), l.set(g, m));
                    }
                }
                const r = new aD(f);
                return new hy(l, r, j.fieldTransforms);
            }
            function hM(a, b, c, d = !1) {
                return hN(c, a.jc(d ? 4 : 3, b));
            }
            function hN(b, a) {
                if (hP((b = getModularInstance(b)))) return hQ("Unsupported field value:", a, b), hO(b, a);
                if (b instanceof j) return ((function(b, a) {
                    if (!hz(a.kc)) throw a.Uc(`${b._methodName}() can only be used with update() and set()`);
                    if (!a.path) throw a.Uc(`${b._methodName}() is not currently supported inside arrays`);
                    const c = b._toFieldTransform(a);
                    c && a.fieldTransforms.push(c);
                })(b, a), null);
                if (void 0 === b && a.ignoreUndefinedProperties) return null;
                if ((a.path && a.fieldMask.push(a.path), b instanceof Array)) {
                    if (a.settings.Fc && 4 !== a.kc) throw a.Uc("Nested arrays are not supported");
                    return (function(d, e) {
                        const b = [];
                        let c = 0;
                        for (const f of d){
                            let a = hN(f, e.Bc(c));
                            null == a && (a = {
                                nullValue: "NULL_VALUE"
                            }), b.push(a), c++;
                        }
                        return {
                            arrayValue: {
                                values: b
                            }
                        };
                    })(b, a);
                }
                return (function(a, b) {
                    if (null === (a = getModularInstance(a))) return {
                        nullValue: "NULL_VALUE"
                    };
                    if ("number" == typeof a) return bI(b.N, a);
                    if ("boolean" == typeof a) return {
                        booleanValue: a
                    };
                    if ("string" == typeof a) return {
                        stringValue: a
                    };
                    if (a instanceof Date) {
                        const e = av.fromDate(a);
                        return {
                            timestampValue: cA(b.N, e)
                        };
                    }
                    if (a instanceof av) {
                        const f = new av(a.seconds, 1e3 * Math.floor(a.nanoseconds / 1e3));
                        return {
                            timestampValue: cA(b.N, f)
                        };
                    }
                    if (a instanceof hv) return {
                        geoPointValue: {
                            latitude: a.latitude,
                            longitude: a.longitude
                        }
                    };
                    if (a instanceof hu) return {
                        bytesValue: cB(b.N, a._byteString)
                    };
                    if (a instanceof g1) {
                        const c = b.databaseId, d = a.firestore._databaseId;
                        if (!d.isEqual(c)) throw b.Uc(`Document reference is for database ${d.projectId}/${d.database} but should be for database ${c.projectId}/${c.database}`);
                        return {
                            referenceValue: cE(a.firestore._databaseId || b.databaseId, a._key.path)
                        };
                    }
                    throw b.Uc(`Unsupported field value: ${gY(a)}`);
                })(b, a);
            }
            function hO(b, a) {
                const c = {};
                return (az(b) ? a.path && a.path.length > 0 && a.fieldMask.push(a.path) : ay(b, (b, e)=>{
                    const d = hN(e, a.Oc(b));
                    null != d && (c[b] = d);
                }), {
                    mapValue: {
                        fields: c
                    }
                });
            }
            function hP(a) {
                return !("object" != typeof a || null === a || a instanceof Array || a instanceof Date || a instanceof av || a instanceof hv || a instanceof hu || a instanceof g1 || a instanceof j);
            }
            function hQ(b, c, a) {
                if (!hP(a) || !(function(a) {
                    return ("object" == typeof a && null !== a && (Object.getPrototypeOf(a) === Object.prototype || null === Object.getPrototypeOf(a)));
                })(a)) {
                    const d = gY(a);
                    throw "an object" === d ? c.Uc(b + " a custom object") : c.Uc(b + " " + d);
                }
            }
            function hR(b, a, c) {
                if ((a = getModularInstance(a)) instanceof hs) return a._internalPath;
                if ("string" == typeof a) return hT(b, a);
                throw hU("Field path arguments must be of type string or FieldPath.", b, !1, void 0, c);
            }
            const hS = new RegExp("[~\\*/\\[\\]]");
            function hT(b, a, c) {
                if (a.search(hS) >= 0) throw hU(`Invalid field path (${a}). Paths must not contain '~', '*', '/', '[', or ']'`, b, !1, void 0, c);
                try {
                    return new hs(...a.split("."))._internalPath;
                } catch (d) {
                    throw hU(`Invalid field path (${a}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, b, !1, void 0, c);
                }
            }
            function hU(g, h, i, b, d) {
                const e = b && !b.isEmpty(), f = void 0 !== d;
                let c = `Function ${h}() called with invalid data`;
                i && (c += " (via `toFirestore()`)"), (c += ". ");
                let a = "";
                return ((e || f) && ((a += " (found"), e && (a += ` in field ${b}`), f && (a += ` in document ${d}`), (a += ")")), new K(aj.INVALID_ARGUMENT, c + g + a));
            }
            function hV(a, b) {
                return a.some((a)=>a.isEqual(b));
            }
            class G {
                constructor(a, b, c, d, e){
                    (this._firestore = a), (this._userDataWriter = b), (this._key = c), (this._document = d), (this._converter = e);
                }
                get id() {
                    return this._key.path.lastSegment();
                }
                get ref() {
                    return new g1(this._firestore, this._converter, this._key);
                }
                exists() {
                    return null !== this._document;
                }
                data() {
                    if (this._document) {
                        if (this._converter) {
                            const a = new hW(this._firestore, this._userDataWriter, this._key, this._document, null);
                            return this._converter.fromFirestore(a);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                get(b) {
                    if (this._document) {
                        const a = this._document.data.field(hX("DocumentSnapshot.get", b));
                        if (null !== a) return this._userDataWriter.convertValue(a);
                    }
                }
            }
            class hW extends G {
                data() {
                    return super.data();
                }
            }
            function hX(b, a) {
                return "string" == typeof a ? hT(b, a) : a instanceof hs ? a._internalPath : a._delegate._internalPath;
            }
            class hY {
                constructor(a, b){
                    (this.hasPendingWrites = a), (this.fromCache = b);
                }
                isEqual(a) {
                    return (this.hasPendingWrites === a.hasPendingWrites && this.fromCache === a.fromCache);
                }
            }
            class R extends G {
                constructor(a, b, c, d, e, f){
                    super(a, b, c, d, f), (this._firestore = a), (this._firestoreImpl = a), (this.metadata = e);
                }
                exists() {
                    return super.exists();
                }
                data(a = {}) {
                    if (this._document) {
                        if (this._converter) {
                            const b = new hZ(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
                            return this._converter.fromFirestore(b, a);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, a.serverTimestamps);
                    }
                }
                get(b, c = {}) {
                    if (this._document) {
                        const a = this._document.data.field(hX("DocumentSnapshot.get", b));
                        if (null !== a) return this._userDataWriter.convertValue(a, c.serverTimestamps);
                    }
                }
            }
            class hZ extends R {
                data(a = {}) {
                    return super.data(a);
                }
            }
            class h$ {
                constructor(b, c, d, a){
                    (this._firestore = b), (this._userDataWriter = c), (this._snapshot = a), (this.metadata = new hY(a.hasPendingWrites, a.fromCache)), (this.query = d);
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
                        a.call(b, new hZ(this._firestore, this._userDataWriter, c.key, c, new hY(this._snapshot.mutatedKeys.has(c.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                docChanges(b = {}) {
                    const a = !!b.includeMetadataChanges;
                    if (a && this._snapshot.excludesMetadataChanges) throw new K(aj.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return ((this._cachedChanges && this._cachedChangesIncludeMetadataChanges === a) || ((this._cachedChanges = (function(a, b) {
                        if (a._snapshot.oldDocs.isEmpty()) {
                            let c = 0;
                            return a._snapshot.docChanges.map((b)=>({
                                    type: "added",
                                    doc: new hZ(a._firestore, a._userDataWriter, b.doc.key, b.doc, new hY(a._snapshot.mutatedKeys.has(b.doc.key), a._snapshot.fromCache), a.query.converter),
                                    oldIndex: -1,
                                    newIndex: c++
                                }));
                        }
                        {
                            let d = a._snapshot.oldDocs;
                            return a._snapshot.docChanges.filter((a)=>b || 3 !== a.type).map((b)=>{
                                const f = new hZ(a._firestore, a._userDataWriter, b.doc.key, b.doc, new hY(a._snapshot.mutatedKeys.has(b.doc.key), a._snapshot.fromCache), a.query.converter);
                                let c = -1, e = -1;
                                return (0 !== b.type && ((c = d.indexOf(b.doc.key)), (d = d.delete(b.doc.key))), 1 !== b.type && ((d = d.add(b.doc)), (e = d.indexOf(b.doc.key))), {
                                    type: h_(b.type),
                                    doc: f,
                                    oldIndex: c,
                                    newIndex: e
                                });
                            });
                        }
                    })(this, a)), (this._cachedChangesIncludeMetadataChanges = a)), this._cachedChanges);
                }
            }
            function h_(a) {
                switch(a){
                    case 0:
                        return "added";
                    case 2:
                    case 3:
                        return "modified";
                    case 1:
                        return "removed";
                    default:
                        return af();
                }
            }
            function h0(a, b) {
                return a instanceof R && b instanceof R ? a._firestore === b._firestore && a._key.isEqual(b._key) && (null === a._document ? null === b._document : a._document.isEqual(b._document)) && a._converter === b._converter : a instanceof h$ && b instanceof h$ && a._firestore === b._firestore && g7(a.query, b.query) && a.metadata.isEqual(b.metadata) && a._snapshot.isEqual(b._snapshot);
            }
            function h1(a) {
                if (bt(a) && 0 === a.explicitOrderBy.length) throw new K(aj.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
            }
            class k {
            }
            function h2(a, ...b) {
                for (const c of b)a = c._apply(a);
                return a;
            }
            class h3 extends (null && k) {
                constructor(a, b, c){
                    super(), (this.Gc = a), (this.zc = b), (this.Hc = c), (this.type = "where");
                }
                _apply(a) {
                    const b = hC(a.firestore), c = (function(d, j, k, f, g, a, b) {
                        let c;
                        if (g.isKeyField()) {
                            if ("array-contains" === a || "array-contains-any" === a) throw new K(aj.INVALID_ARGUMENT, `Invalid Query. You can't perform '${a}' queries on FieldPath.documentId().`);
                            if ("in" === a || "not-in" === a) {
                                ij(b, a);
                                const h = [];
                                for (const l of b)h.push(ii(f, d, l));
                                c = {
                                    arrayValue: {
                                        values: h
                                    }
                                };
                            } else c = ii(f, d, b);
                        } else ("in" !== a && "not-in" !== a && "array-contains-any" !== a) || ij(b, a), (c = hM(k, j, b, "in" === a || "not-in" === a));
                        const i = e.create(g, a, c);
                        return ((function(b, a) {
                            if (a.v()) {
                                const c = bv(b);
                                if (null !== c && !c.isEqual(a.field)) throw new K(aj.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${c.toString()}' and '${a.field.toString()}'`);
                                const e = bu(b);
                                null !== e && ik(b, a.field, e);
                            }
                            const d = (function(b, c) {
                                for (const a of b.filters)if (c.indexOf(a.op) >= 0) return a.op;
                                return null;
                            })(b, (function(a) {
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
                            })(a.op));
                            if (null !== d) throw d === a.op ? new K(aj.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${a.op.toString()}' filter.`) : new K(aj.INVALID_ARGUMENT, `Invalid query. You cannot use '${a.op.toString()}' filters with '${d.toString()}' filters.`);
                        })(d, i), i);
                    })(a._query, "where", b, a.firestore._databaseId, this.Gc, this.zc, this.Hc);
                    return new Q(a.firestore, a.converter, (function(a, b) {
                        const c = a.filters.concat([
                            b
                        ]);
                        return new bp(a.path, a.collectionGroup, a.explicitOrderBy.slice(), c, a.limit, a.limitType, a.startAt, a.endAt);
                    })(a._query, c));
                }
            }
            function h4(a, b, c) {
                const d = b, e = hX("where", a);
                return new h3(e, d, c);
            }
            class h5 extends (null && k) {
                constructor(a, b){
                    super(), (this.Gc = a), (this.Jc = b), (this.type = "orderBy");
                }
                _apply(a) {
                    const b = (function(a, c, d) {
                        if (null !== a.startAt) throw new K(aj.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
                        if (null !== a.endAt) throw new K(aj.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
                        const b = new bl(c, d);
                        return ((function(a, c) {
                            if (null === bu(a)) {
                                const b = bv(a);
                                null !== b && ik(a, b, c.field);
                            }
                        })(a, b), b);
                    })(a._query, this.Gc, this.Jc);
                    return new Q(a.firestore, a.converter, (function(a, b) {
                        const c = a.explicitOrderBy.concat([
                            b
                        ]);
                        return new bp(a.path, a.collectionGroup, c, a.filters.slice(), a.limit, a.limitType, a.startAt, a.endAt);
                    })(a._query, b));
                }
            }
            function h6(a, b = "asc") {
                const c = b, d = hX("orderBy", a);
                return new h5(d, c);
            }
            class h7 extends (null && k) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Yc = b), (this.Xc = c);
                }
                _apply(a) {
                    return new Q(a.firestore, a.converter, bz(a._query, this.Yc, this.Xc));
                }
            }
            function h8(a) {
                return g$("limit", a), new h7("limit", a, "F");
            }
            function h9(a) {
                return (g$("limitToLast", a), new h7("limitToLast", a, "L"));
            }
            class ia extends (null && k) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Zc = b), (this.ta = c);
                }
                _apply(a) {
                    const b = ih(a, this.type, this.Zc, this.ta);
                    return new Q(a.firestore, a.converter, (function(a, b) {
                        return new bp(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, b, a.endAt);
                    })(a._query, b));
                }
            }
            function ib(...a) {
                return new ia("startAt", a, !0);
            }
            function ic(...a) {
                return new ia("startAfter", a, !1);
            }
            class id extends (null && k) {
                constructor(a, b, c){
                    super(), (this.type = a), (this.Zc = b), (this.ta = c);
                }
                _apply(a) {
                    const b = ih(a, this.type, this.Zc, this.ta);
                    return new Q(a.firestore, a.converter, (function(a, b) {
                        return new bp(a.path, a.collectionGroup, a.explicitOrderBy.slice(), a.filters.slice(), a.limit, a.limitType, a.startAt, b);
                    })(a._query, b));
                }
            }
            function ie(...a) {
                return new id("endBefore", a, !0);
            }
            function ig(...a) {
                return new id("endAt", a, !1);
            }
            function ih(a, c, b, d) {
                if (((b[0] = getModularInstance(b[0])), b[0] instanceof G)) return (function(e, f, g, b, h) {
                    if (!b) throw new K(aj.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${g}().`);
                    const c = [];
                    for (const a of bx(e))if (a.field.isKeyField()) c.push(aW(f, b.key));
                    else {
                        const d = b.data.field(a.field);
                        if (aJ(d)) throw new K(aj.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + a.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
                        if (null === d) {
                            const i = a.field.canonicalString();
                            throw new K(aj.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${i}' (used as the orderBy) does not exist.`);
                        }
                        c.push(d);
                    }
                    return new bj(c, h);
                })(a._query, a.firestore._databaseId, c, b[0]._document, d);
                {
                    const e = hC(a.firestore);
                    return (function(d, i, j, b, e, k) {
                        const h = d.explicitOrderBy;
                        if (e.length > h.length) throw new K(aj.INVALID_ARGUMENT, `Too many arguments provided to ${b}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
                        const f = [];
                        for(let c = 0; c < e.length; c++){
                            const a = e[c];
                            if (h[c].field.isKeyField()) {
                                if ("string" != typeof a) throw new K(aj.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${b}(), but got a ${typeof a}`);
                                if (!bw(d) && -1 !== a.indexOf("/")) throw new K(aj.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to ${b}() must be a plain document ID, but '${a}' contains a slash.`);
                                const g = d.path.child(aA.fromString(a));
                                if (!l.isDocumentKey(g)) throw new K(aj.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to ${b}() must result in a valid document path, but '${g}' is not because it contains an odd number of segments.`);
                                const m = new l(g);
                                f.push(aW(i, m));
                            } else {
                                const n = hM(j, b, a);
                                f.push(n);
                            }
                        }
                        return new bj(f, k);
                    })(a._query, a.firestore._databaseId, e, c, b, d);
                }
            }
            function ii(c, d, a) {
                if ("string" == typeof (a = getModularInstance(a))) {
                    if ("" === a) throw new K(aj.INVALID_ARGUMENT, "Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");
                    if (!bw(d) && -1 !== a.indexOf("/")) throw new K(aj.INVALID_ARGUMENT, `Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '${a}' contains a '/' character.`);
                    const b = d.path.child(aA.fromString(a));
                    if (!l.isDocumentKey(b)) throw new K(aj.INVALID_ARGUMENT, `Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '${b}' is not because it has an odd number of segments (${b.length}).`);
                    return aW(c, new l(b));
                }
                if (a instanceof g1) return aW(c, a._key);
                throw new K(aj.INVALID_ARGUMENT, `Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: ${gY(a)}.`);
            }
            function ij(a, b) {
                if (!Array.isArray(a) || 0 === a.length) throw new K(aj.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${b.toString()}' filters.`);
                if (a.length > 10) throw new K(aj.INVALID_ARGUMENT, `Invalid Query. '${b.toString()}' filters support a maximum of 10 elements in the value array.`);
            }
            function ik(c, a, b) {
                if (!b.isEqual(a)) throw new K(aj.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${a.toString()}' and so you must also use '${a.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${b.toString()}' instead.`);
            }
            class H {
                convertValue(a, b = "none") {
                    switch(aP(a)){
                        case 0:
                            return null;
                        case 1:
                            return a.booleanValue;
                        case 2:
                            return aH(a.integerValue || a.doubleValue);
                        case 3:
                            return this.convertTimestamp(a.timestampValue);
                        case 4:
                            return this.convertServerTimestamp(a, b);
                        case 5:
                            return a.stringValue;
                        case 6:
                            return this.convertBytes(aI(a.bytesValue));
                        case 7:
                            return this.convertReference(a.referenceValue);
                        case 8:
                            return this.convertGeoPoint(a.geoPointValue);
                        case 9:
                            return this.convertArray(a.arrayValue, b);
                        case 10:
                            return this.convertObject(a.mapValue, b);
                        default:
                            throw af();
                    }
                }
                convertObject(a, c) {
                    const b = {};
                    return (ay(a.fields, (a, d)=>{
                        b[a] = this.convertValue(d, c);
                    }), b);
                }
                convertGeoPoint(a) {
                    return new hv(aH(a.latitude), aH(a.longitude));
                }
                convertArray(a, b) {
                    return (a.values || []).map((a)=>this.convertValue(a, b));
                }
                convertServerTimestamp(a, b) {
                    switch(b){
                        case "previous":
                            const c = aK(a);
                            return null == c ? null : this.convertValue(c, b);
                        case "estimate":
                            return this.convertTimestamp(aL(a));
                        default:
                            return null;
                    }
                }
                convertTimestamp(b) {
                    const a = aG(b);
                    return new av(a.seconds, a.nanos);
                }
                convertDocumentKey(e, b) {
                    const a = aA.fromString(e);
                    ag(c5(a));
                    const c = new gS(a.get(1), a.get(3)), d = new l(a.popFirst(5));
                    return (c.isEqual(b) || ac(`Document ${d} contains a document reference within a different database (${c.projectId}/${c.database}) which is not supported. It will be treated as a reference in the current database (${b.projectId}/${b.database}) instead.`), d);
                }
            }
            function il(b, c, a) {
                let d;
                return ((d = b ? a && (a.merge || a.mergeFields) ? b.toFirestore(c, a) : b.toFirestore(c) : c), d);
            }
            class im extends (null && H) {
                constructor(a){
                    super(), (this.firestore = a);
                }
                convertBytes(a) {
                    return new hu(a);
                }
                convertReference(a) {
                    const b = this.convertDocumentKey(a, this.firestore._databaseId);
                    return new g1(this.firestore, null, b);
                }
            }
            class io {
                constructor(a, b){
                    (this._firestore = a), (this._commitHandler = b), (this._mutations = []), (this._committed = !1), (this._dataReader = hC(a));
                }
                set(c, d, b) {
                    this._verifyNotCommitted();
                    const a = ip(c, this._firestore), e = il(a.converter, d, b), f = hD(this._dataReader, "WriteBatch.set", a._key, e, null !== a.converter, b);
                    return (this._mutations.push(f.toMutation(a._key, bX.none())), this);
                }
                update(d, a, e, ...f) {
                    this._verifyNotCommitted();
                    const b = ip(d, this._firestore);
                    let c;
                    return ((c = "string" == typeof (a = getModularInstance(a)) || a instanceof hs ? hL(this._dataReader, "WriteBatch.update", b._key, a, e, f) : hK(this._dataReader, "WriteBatch.update", b._key, a)), this._mutations.push(c.toMutation(b._key, bX.exists(!0))), this);
                }
                delete(a) {
                    this._verifyNotCommitted();
                    const b = ip(a, this._firestore);
                    return ((this._mutations = this._mutations.concat(new b7(b._key, bX.none()))), this);
                }
                commit() {
                    return (this._verifyNotCommitted(), (this._committed = !0), this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve());
                }
                _verifyNotCommitted() {
                    if (this._committed) throw new K(aj.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
                }
            }
            function ip(a, b) {
                if ((a = getModularInstance(a)).firestore !== b) throw new K(aj.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
                return a;
            }
            function iq(a) {
                a = gZ(a, g1);
                const b = gZ(a.firestore, hc);
                return gK(hf(b), a._key).then((c)=>iE(b, a, c));
            }
            class ir extends H {
                constructor(a){
                    super(), (this.firestore = a);
                }
                convertBytes(a) {
                    return new hu(a);
                }
                convertReference(a) {
                    const b = this.convertDocumentKey(a, this.firestore._databaseId);
                    return new g1(this.firestore, null, b);
                }
            }
            function is(a) {
                a = gZ(a, g1);
                const b = gZ(a.firestore, hc), c = hf(b), d = new ir(b);
                return gJ(c, a._key).then((c)=>new R(b, d, a._key, c, new hY(null !== c && c.hasLocalMutations, !0), a.converter));
            }
            function it(a) {
                a = gZ(a, g1);
                const b = gZ(a.firestore, hc);
                return gK(hf(b), a._key, {
                    source: "server"
                }).then((c)=>iE(b, a, c));
            }
            function iu(a) {
                a = gZ(a, Q);
                const b = gZ(a.firestore, hc), c = hf(b), d = new ir(b);
                return (h1(a._query), gM(c, a._query).then((c)=>new h$(b, d, a, c)));
            }
            function iv(a) {
                a = gZ(a, Q);
                const b = gZ(a.firestore, hc), c = hf(b), d = new ir(b);
                return gL(c, a._query).then((c)=>new h$(b, d, a, c));
            }
            function iw(a) {
                a = gZ(a, Q);
                const b = gZ(a.firestore, hc), c = hf(b), d = new ir(b);
                return gM(c, a._query, {
                    source: "server"
                }).then((c)=>new h$(b, d, a, c));
            }
            function ix(a, d, b) {
                a = gZ(a, g1);
                const c = gZ(a.firestore, hc), e = il(a.converter, d, b);
                return iD(c, [
                    hD(hC(c), "setDoc", a._key, e, null !== a.converter, b).toMutation(a._key, bX.none()), 
                ]);
            }
            function iy(a, b, f, ...g) {
                a = gZ(a, g1);
                const c = gZ(a.firestore, hc), d = hC(c);
                let e;
                e = "string" == typeof ((b = getModularInstance(b))) || b instanceof hs ? hL(d, "updateDoc", a._key, b, f, g) : hK(d, "updateDoc", a._key, b);
                return iD(c, [
                    e.toMutation(a._key, bX.exists(!0))
                ]);
            }
            function iz(a) {
                return iD(gZ(a.firestore, hc), [
                    new b7(a._key, bX.none())
                ]);
            }
            function iA(a, c) {
                const d = gZ(a.firestore, hc), b = g5(a), e = il(a.converter, c);
                return iD(d, [
                    hD(hC(a.firestore), "addDoc", b._key, e, null !== a.converter, {}).toMutation(b._key, bX.exists(!1)), 
                ]).then(()=>b);
            }
            function iB(c, ...b) {
                var f, g, h;
                c = getModularInstance(c);
                let k = {
                    includeMetadataChanges: !1
                }, a = 0;
                "object" != typeof b[a] || g9(b[a]) || ((k = b[a]), a++);
                const m = {
                    includeMetadataChanges: k.includeMetadataChanges
                };
                if (g9(b[a])) {
                    const d = b[a];
                    (b[a] = null === (f = d.next) || void 0 === f ? void 0 : f.bind(d)), (b[a + 1] = null === (g = d.error) || void 0 === g ? void 0 : g.bind(d)), (b[a + 2] = null === (h = d.complete) || void 0 === h ? void 0 : h.bind(d));
                }
                let i, e, j;
                if (c instanceof g1) (e = gZ(c.firestore, hc)), (j = br(c._key.path)), (i = {
                    next: (d)=>{
                        b[a] && b[a](iE(e, c, d));
                    },
                    error: b[a + 1],
                    complete: b[a + 2]
                });
                else {
                    const l = gZ(c, Q);
                    (e = gZ(l.firestore, hc)), (j = l._query);
                    const n = new ir(e);
                    (i = {
                        next: (c)=>{
                            b[a] && b[a](new h$(e, n, l, c));
                        },
                        error: b[a + 1],
                        complete: b[a + 2]
                    }), h1(c._query);
                }
                return (function(a, b, c, d) {
                    const e = new gt(d), f = new fL(b, e, c);
                    return (a.asyncQueue.enqueueAndForget(async ()=>fG(await gG(a), f)), ()=>{
                        e.ec(), a.asyncQueue.enqueueAndForget(async ()=>fH(await gG(a), f));
                    });
                })(hf(e), j, m, i);
            }
            function iC(b, a) {
                return gN(hf((b = gZ(b, hc))), g9(a) ? a : {
                    next: a
                });
            }
            function iD(a, b) {
                return (function(a, c) {
                    const b = new ak();
                    return (a.asyncQueue.enqueueAndForget(async ()=>fZ(await gF(a), c, b)), b.promise);
                })(hf(a), b);
            }
            function iE(c, a, b) {
                const d = b.docs.get(a._key), e = new ir(c);
                return new R(c, e, a._key, d, new hY(b.hasPendingWrites, b.fromCache), a.converter);
            }
            class iF extends (null && class {
                constructor(a, b){
                    (this._firestore = a), (this._transaction = b), (this._dataReader = hC(a));
                }
                get(a) {
                    const b = ip(a, this._firestore), c = new im(this._firestore);
                    return this._transaction.lookup([
                        b._key
                    ]).then((d)=>{
                        if (!d || 1 !== d.length) return af();
                        const a = d[0];
                        if (a.isFoundDocument()) return new G(this._firestore, c, a.key, a, b.converter);
                        if (a.isNoDocument()) return new G(this._firestore, c, b._key, null, b.converter);
                        throw af();
                    });
                }
                set(c, d, b) {
                    const a = ip(c, this._firestore), e = il(a.converter, d, b), f = hD(this._dataReader, "Transaction.set", a._key, e, null !== a.converter, b);
                    return this._transaction.set(a._key, f), this;
                }
                update(d, a, e, ...f) {
                    const b = ip(d, this._firestore);
                    let c;
                    return ((c = "string" == typeof (a = getModularInstance(a)) || a instanceof hs ? hL(this._dataReader, "Transaction.update", b._key, a, e, f) : hK(this._dataReader, "Transaction.update", b._key, a)), this._transaction.update(b._key, c), this);
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
                    return super.get(a).then((a)=>new R(this._firestore, c, b._key, a._document, new hY(!1, !1), b.converter));
                }
            }
            function iG(a, b) {
                return gO(hf((a = gZ(a, hc))), (c)=>b(new iF(a, c)));
            }
            function iH() {
                return new hE("deleteField");
            }
            function iI() {
                return new hG("serverTimestamp");
            }
            function iJ(...a) {
                return new hH("arrayUnion", a);
            }
            function iK(...a) {
                return new hI("arrayRemove", a);
            }
            function iL(a) {
                return new hJ("increment", a);
            }
            function iM(a) {
                return hf((a = gZ(a, hc))), new io(a, (b)=>iD(a, b));
            }
            !(function(a, b = !0) {
                !(function(a) {
                    Z = a;
                })(T.Jn), (0, T.Xd)(new U.wA("firestore", (c, { options: a  })=>{
                    const e = c.getProvider("app").getImmediate(), d = new hc(e, new ao(c.getProvider("auth-internal")));
                    return ((a = Object.assign({
                        useFetchStreams: b
                    }, a)), d._setSettings(a), d);
                }, "PUBLIC")), (0, T.KN)(Y, "3.3.0", a), (0, T.KN)(Y, "3.3.0", "esm2017");
            })();
        }
    }, 
]);
