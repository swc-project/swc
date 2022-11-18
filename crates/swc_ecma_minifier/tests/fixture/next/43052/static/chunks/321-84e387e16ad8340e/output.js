(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        321
    ],
    {
        1321: function(__unused_webpack_module, exports, __webpack_require__) {
            !function(e, t) {
                t(exports, __webpack_require__(7294));
            }(this, function(e, t) {
                "use strict";
                function r(e) {
                    return e && "object" == typeof e && "default" in e ? e : {
                        default: e
                    };
                }
                var n = r(t), o = ("undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self && self, {
                    exports: {}
                });
                !function(e, t) {
                    !function(e) {
                        var t = Object.freeze({
                            __proto__: null,
                            default: {}
                        });
                        const r = BigInt(0), n = BigInt(1), o = BigInt(2), i = BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"), s = Object.freeze({
                            a: BigInt(-1),
                            d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
                            P: BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"),
                            l: i,
                            n: i,
                            h: BigInt(8),
                            Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
                            Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
                        }), a = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000"), c = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
                        BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
                        const u = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235"), h = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), f = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838"), d = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
                        class l {
                            constructor(e, t, r, n){
                                this.x = e, this.y = t, this.z = r, this.t = n;
                            }
                            static fromAffine(e) {
                                if (!(e instanceof m)) throw TypeError("ExtendedPoint#fromAffine: expected Point");
                                return e.equals(m.ZERO) ? l.ZERO : new l(e.x, e.y, n, $(e.x * e.y));
                            }
                            static toAffineBatch(e) {
                                const t = function(e, t = s.P) {
                                    const o = Array(e.length), i = T(e.reduce((e, n, i)=>n === r ? e : (o[i] = e, $(e * n, t)), n), t);
                                    return e.reduceRight((e, n, i)=>n === r ? e : (o[i] = $(e * o[i], t), $(e * n, t)), i), o;
                                }(e.map((e)=>e.z));
                                return e.map((e, r)=>e.toAffine(t[r]));
                            }
                            static normalizeZ(e) {
                                return this.toAffineBatch(e).map(this.fromAffine);
                            }
                            equals(e) {
                                p(e);
                                const { x: t , y: r , z: n  } = this, { x: o , y: i , z: s  } = e, a = $(t * s), c = $(o * n), u = $(r * s), h = $(i * n);
                                return a === c && u === h;
                            }
                            negate() {
                                return new l($(-this.x), this.y, this.z, $(-this.t));
                            }
                            double() {
                                const { x: e , y: t , z: r  } = this, { a: n  } = s, i = $(e * e), a = $(t * t), c = $(o * $(r * r)), u = $(n * i), h = e + t, f = $($(h * h) - i - a), d = u + a, p = d - c, w = u - a, y = $(f * p), g = $(d * w), b = $(f * w), m = $(p * d);
                                return new l(y, g, m, b);
                            }
                            add(e) {
                                p(e);
                                const { x: t , y: n , z: i , t: s  } = this, { x: a , y: c , z: u , t: h  } = e, f = $((n - t) * (c + a)), d = $((n + t) * (c - a)), w = $(d - f);
                                if (w === r) return this.double();
                                const y = $(i * o * h), g = $(s * o * u), b = g + y, m = d + f, v = g - y, x = $(b * w), E = $(m * v), k = $(b * v), S = $(w * m);
                                return new l(x, E, S, k);
                            }
                            subtract(e) {
                                return this.add(e.negate());
                            }
                            precomputeWindow(e) {
                                const t = 1 + 256 / e, r = [];
                                let n = this, o = n;
                                for(let i = 0; i < t; i++){
                                    o = n, r.push(o);
                                    for(let t1 = 1; t1 < 2 ** (e - 1); t1++)o = o.add(n), r.push(o);
                                    n = o.double();
                                }
                                return r;
                            }
                            wNAF(e, t) {
                                !t && this.equals(l.BASE) && (t = m.BASE);
                                const r = t && t._WINDOW_SIZE || 1;
                                if (256 % r) throw Error("Point#wNAF: Invalid precomputation window, must be power of 2");
                                let o = t && b.get(t);
                                o || (o = this.precomputeWindow(r), t && 1 !== r && (o = l.normalizeZ(o), b.set(t, o)));
                                let i = l.ZERO, s = l.ZERO;
                                const a = 1 + 256 / r, c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, f = BigInt(r);
                                for(let t1 = 0; t1 < a; t1++){
                                    const r1 = t1 * c;
                                    let a1 = Number(e & u);
                                    if (e >>= f, a1 > c && (a1 -= h, e += n), 0 === a1) {
                                        let e1 = o[r1];
                                        t1 % 2 && (e1 = e1.negate()), s = s.add(e1);
                                    } else {
                                        let e2 = o[r1 + Math.abs(a1) - 1];
                                        a1 < 0 && (e2 = e2.negate()), i = i.add(e2);
                                    }
                                }
                                return l.normalizeZ([
                                    i,
                                    s
                                ])[0];
                            }
                            multiply(e, t) {
                                return this.wNAF(D(e, s.l), t);
                            }
                            multiplyUnsafe(e) {
                                let t = D(e, s.l, !1);
                                const o = l.BASE, i = l.ZERO;
                                if (t === r) return i;
                                if (this.equals(i) || t === n) return this;
                                if (this.equals(o)) return this.wNAF(t);
                                let a = i, c = this;
                                for(; t > r;)t & n && (a = a.add(c)), c = c.double(), t >>= n;
                                return a;
                            }
                            isSmallOrder() {
                                return this.multiplyUnsafe(s.h).equals(l.ZERO);
                            }
                            isTorsionFree() {
                                return this.multiplyUnsafe(s.l).equals(l.ZERO);
                            }
                            toAffine(e = T(this.z)) {
                                const { x: t , y: r , z: o  } = this, i = $(t * e), s = $(r * e);
                                if ($(o * e) !== n) throw Error("invZ was invalid");
                                return new m(i, s);
                            }
                            fromRistrettoBytes() {
                                y();
                            }
                            toRistrettoBytes() {
                                y();
                            }
                            fromRistrettoHash() {
                                y();
                            }
                        }
                        function p(e) {
                            if (!(e instanceof l)) throw TypeError("ExtendedPoint expected");
                        }
                        function w(e) {
                            if (!(e instanceof g)) throw TypeError("RistrettoPoint expected");
                        }
                        function y() {
                            throw Error("Legacy method: switch to RistrettoPoint");
                        }
                        l.BASE = new l(s.Gx, s.Gy, n, $(s.Gx * s.Gy)), l.ZERO = new l(r, n, n, r);
                        class g {
                            constructor(e){
                                this.ep = e;
                            }
                            static calcElligatorRistrettoMap(e) {
                                const { d: t  } = s, r = $(c * e * e), o = $((r + n) * f);
                                let i = BigInt(-1);
                                const a = $((i - t * r) * $(r + t));
                                let { isValid: h , value: p  } = _(o, a), w = $(p * e);
                                I(w) || (w = $(-w)), h || (p = w), h || (i = r);
                                const y = $(i * (r - n) * d - a), g = p * p, b = $((p + p) * a), m = $(y * u), v = $(n - g), x = $(n + g);
                                return new l($(b * x), $(v * m), $(m * x), $(b * v));
                            }
                            static hashToCurve(e) {
                                const t = R((e = z(e, 64)).slice(0, 32)), r = this.calcElligatorRistrettoMap(t), n = R(e.slice(32, 64)), o = this.calcElligatorRistrettoMap(n);
                                return new g(r.add(o));
                            }
                            static fromHex(e) {
                                e = z(e, 32);
                                const { a: t , d: o  } = s, i = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint", a = R(e);
                                if (!function(e, t) {
                                    if (e.length !== t.length) return !1;
                                    for(let r = 0; r < e.length; r++)if (e[r] !== t[r]) return !1;
                                    return !0;
                                }(A(a), e) || I(a)) throw Error(i);
                                const c = $(a * a), u = $(n + t * c), h = $(n - t * c), f = $(u * u), d = $(h * h), p = $(t * o * f - d), { isValid: w , value: y  } = N($(p * d)), b = $(y * h), m = $(y * b * p);
                                let v = $((a + a) * b);
                                I(v) && (v = $(-v));
                                const x = $(u * m), E = $(v * x);
                                if (!w || I(E) || x === r) throw Error(i);
                                return new g(new l(v, x, n, E));
                            }
                            toRawBytes() {
                                let { x: e , y: t , z: r , t: n  } = this.ep;
                                const o = $($(r + t) * $(r - t)), i = $(e * t), s = $(i * i), { value: a  } = N($(o * s)), u = $(a * o), f = $(a * i), d = $(u * f * n);
                                let l;
                                if (I(n * d)) {
                                    let r1 = $(t * c), n1 = $(e * c);
                                    e = r1, t = n1, l = $(u * h);
                                } else l = f;
                                I(e * d) && (t = $(-t));
                                let p = $((r - t) * l);
                                return I(p) && (p = $(-p)), A(p);
                            }
                            toHex() {
                                return k(this.toRawBytes());
                            }
                            toString() {
                                return this.toHex();
                            }
                            equals(e) {
                                w(e);
                                const t = this.ep, r = e.ep, n = $(t.x * r.y) === $(t.y * r.x), o = $(t.y * r.y) === $(t.x * r.x);
                                return n || o;
                            }
                            add(e) {
                                return w(e), new g(this.ep.add(e.ep));
                            }
                            subtract(e) {
                                return w(e), new g(this.ep.subtract(e.ep));
                            }
                            multiply(e) {
                                return new g(this.ep.multiply(e));
                            }
                            multiplyUnsafe(e) {
                                return new g(this.ep.multiplyUnsafe(e));
                            }
                        }
                        g.BASE = new g(l.BASE), g.ZERO = new g(l.ZERO);
                        const b = new WeakMap;
                        class m {
                            constructor(e, t){
                                this.x = e, this.y = t;
                            }
                            _setWindowSize(e) {
                                this._WINDOW_SIZE = e, b.delete(this);
                            }
                            static fromHex(e, t = !0) {
                                const { d: r , P: o  } = s, i = (e = z(e, 32)).slice();
                                i[31] = -129 & e[31];
                                const c = C(i);
                                if (t && c >= o) throw Error("Expected 0 < hex < P");
                                if (!t && c >= a) throw Error("Expected 0 < hex < 2**256");
                                const u = $(c * c), h = $(u - n), f = $(r * u + n);
                                let { isValid: d , value: l  } = _(h, f);
                                if (!d) throw Error("Point.fromHex: invalid y coordinate");
                                const p = (l & n) === n;
                                return 0 != (128 & e[31]) !== p && (l = $(-l)), new m(l, c);
                            }
                            static async fromPrivateKey(e) {
                                return (await L(e)).point;
                            }
                            toRawBytes() {
                                const e = A(this.y);
                                return e[31] |= this.x & n ? 128 : 0, e;
                            }
                            toHex() {
                                return k(this.toRawBytes());
                            }
                            toX25519() {
                                const { y: e  } = this;
                                return A($((n + e) * T(n - e)));
                            }
                            isTorsionFree() {
                                return l.fromAffine(this).isTorsionFree();
                            }
                            equals(e) {
                                return this.x === e.x && this.y === e.y;
                            }
                            negate() {
                                return new m($(-this.x), this.y);
                            }
                            add(e) {
                                return l.fromAffine(this).add(l.fromAffine(e)).toAffine();
                            }
                            subtract(e) {
                                return this.add(e.negate());
                            }
                            multiply(e) {
                                return l.fromAffine(this).multiply(e, this).toAffine();
                            }
                        }
                        m.BASE = new m(s.Gx, s.Gy), m.ZERO = new m(r, n);
                        class v {
                            constructor(e, t){
                                this.r = e, this.s = t, this.assertValidity();
                            }
                            static fromHex(e) {
                                const t = z(e, 64), r = m.fromHex(t.slice(0, 32), !1), n = C(t.slice(32, 64));
                                return new v(r, n);
                            }
                            assertValidity() {
                                const { r: e , s: t  } = this;
                                if (!(e instanceof m)) throw Error("Expected Point instance");
                                return D(t, s.l, !1), this;
                            }
                            toRawBytes() {
                                const e = new Uint8Array(64);
                                return e.set(this.r.toRawBytes()), e.set(A(this.s), 32), e;
                            }
                            toHex() {
                                return k(this.toRawBytes());
                            }
                        }
                        function x(...e) {
                            if (!e.every((e)=>e instanceof Uint8Array)) throw Error("Expected Uint8Array list");
                            if (1 === e.length) return e[0];
                            const t = e.reduce((e, t)=>e + t.length, 0), r = new Uint8Array(t);
                            for(let t1 = 0, n = 0; t1 < e.length; t1++){
                                const o = e[t1];
                                r.set(o, n), n += o.length;
                            }
                            return r;
                        }
                        const E = Array.from({
                            length: 256
                        }, (e, t)=>t.toString(16).padStart(2, "0"));
                        function k(e) {
                            if (!(e instanceof Uint8Array)) throw Error("Uint8Array expected");
                            let t = "";
                            for(let r = 0; r < e.length; r++)t += E[e[r]];
                            return t;
                        }
                        function S(e) {
                            if ("string" != typeof e) throw TypeError("hexToBytes: expected string, got " + typeof e);
                            if (e.length % 2) throw Error("hexToBytes: received invalid unpadded hex");
                            const t = new Uint8Array(e.length / 2);
                            for(let r = 0; r < t.length; r++){
                                const n = 2 * r, o = e.slice(n, n + 2), i = Number.parseInt(o, 16);
                                if (Number.isNaN(i) || i < 0) throw Error("Invalid byte sequence");
                                t[r] = i;
                            }
                            return t;
                        }
                        function B(e) {
                            return S(e.toString(16).padStart(64, "0"));
                        }
                        function A(e) {
                            return B(e).reverse();
                        }
                        function I(e) {
                            return ($(e) & n) === n;
                        }
                        function C(e) {
                            if (!(e instanceof Uint8Array)) throw Error("Expected Uint8Array");
                            return BigInt("0x" + k(Uint8Array.from(e).reverse()));
                        }
                        const O = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
                        function R(e) {
                            return $(C(e) & O);
                        }
                        function $(e, t = s.P) {
                            const n = e % t;
                            return n >= r ? n : t + n;
                        }
                        function T(e, t = s.P) {
                            if (e === r || t <= r) throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);
                            let o = $(e, t), i = t, a = r, c = n;
                            for(; o !== r;){
                                const e1 = i % o, t1 = a - c * (i / o);
                                i = o, o = e1, a = c, c = t1;
                            }
                            if (i !== n) throw Error("invert: does not exist");
                            return $(a, t);
                        }
                        function U(e, t) {
                            const { P: n  } = s;
                            let o = e;
                            for(; t-- > r;)o *= o, o %= n;
                            return o;
                        }
                        function _(e, t) {
                            const r = $(t * t * t), i = function(e) {
                                const { P: t  } = s, r = BigInt(5), i = BigInt(10), a = BigInt(20), c = BigInt(40), u = BigInt(80), h = e * e % t * e % t, f = U(h, o) * h % t, d = U(f, n) * e % t, l = U(d, r) * d % t, p = U(l, i) * l % t, w = U(p, a) * p % t, y = U(w, c) * w % t, g = U(y, u) * y % t, b = U(g, u) * y % t, m = U(b, i) * l % t;
                                return {
                                    pow_p_5_8: U(m, o) * e % t,
                                    b2: h
                                };
                            }(e * $(r * r * t)).pow_p_5_8;
                            let a = $(e * r * i);
                            const u = $(t * a * a), h = a, f = $(a * c), d = u === e, l = u === $(-e), p = u === $(-e * c);
                            return d && (a = h), (l || p) && (a = f), I(a) && (a = $(-a)), {
                                isValid: d || l,
                                value: a
                            };
                        }
                        function N(e) {
                            return _(n, e);
                        }
                        function j(e) {
                            return $(C(e), s.l);
                        }
                        function z(e, t) {
                            const r = e instanceof Uint8Array ? Uint8Array.from(e) : S(e);
                            if ("number" == typeof t && r.length !== t) throw Error(`Expected ${t} bytes`);
                            return r;
                        }
                        function D(e, t, n = !0) {
                            if (!t) throw TypeError("Specify max value");
                            if ("number" == typeof e && Number.isSafeInteger(e) && (e = BigInt(e)), "bigint" == typeof e && e < t) {
                                if (n) {
                                    if (r < e) return e;
                                } else if (r <= e) return e;
                            }
                            throw TypeError("Expected valid scalar: 0 < scalar < max");
                        }
                        let P;
                        async function L(e) {
                            return function(e) {
                                const t = ((r = e.slice(0, 32))[0] &= 248, r[31] &= 127, r[31] |= 64, r);
                                var r;
                                const n = e.slice(32, 64), o = j(t), i = m.BASE.multiply(o), s = i.toRawBytes();
                                return {
                                    head: t,
                                    prefix: n,
                                    scalar: o,
                                    point: i,
                                    pointBytes: s
                                };
                            }(await W.sha512(function(e) {
                                if (32 !== (e = "bigint" == typeof e || "number" == typeof e ? B(D(e, a)) : z(e)).length) throw Error("Expected 32 bytes");
                                return e;
                            }(e)));
                        }
                        async function M(e, t, r) {
                            const { r: n , SB: o , msg: i , pub: a  } = function(e, t, r) {
                                t = z(t), r instanceof m || (r = m.fromHex(r, !1));
                                const { r: n , s: o  } = e instanceof v ? e.assertValidity() : v.fromHex(e);
                                return {
                                    r: n,
                                    s: o,
                                    SB: l.BASE.multiplyUnsafe(o),
                                    pub: r,
                                    msg: t
                                };
                            }(e, t, r), c = await W.sha512(n.toRawBytes(), a.toRawBytes(), i);
                            return function(e, t, r, n) {
                                const o = j(n), i = l.fromAffine(e).multiplyUnsafe(o);
                                return l.fromAffine(t).add(i).subtract(r).multiplyUnsafe(s.h).equals(l.ZERO);
                            }(a, n, o, c);
                        }
                        m.BASE._setWindowSize(8);
                        const V = {
                            node: t,
                            web: "object" == typeof self && "crypto" in self ? self.crypto : void 0
                        }, W = {
                            bytesToHex: k,
                            hexToBytes: S,
                            concatBytes: x,
                            getExtendedPublicKey: L,
                            mod: $,
                            invert: T,
                            TORSION_SUBGROUP: [
                                "0100000000000000000000000000000000000000000000000000000000000000",
                                "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
                                "0000000000000000000000000000000000000000000000000000000000000080",
                                "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
                                "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
                                "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
                                "0000000000000000000000000000000000000000000000000000000000000000",
                                "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
                            ],
                            hashToPrivateScalar: (e)=>{
                                if ((e = z(e)).length < 40 || e.length > 1024) throw Error("Expected 40-1024 bytes of private key as per FIPS 186");
                                return $(C(e), s.l - n) + n;
                            },
                            randomBytes: (e = 32)=>{
                                if (V.web) return V.web.getRandomValues(new Uint8Array(e));
                                if (V.node) {
                                    const { randomBytes: t  } = V.node;
                                    return new Uint8Array(t(e).buffer);
                                }
                                throw Error("The environment doesn't have randomBytes function");
                            },
                            randomPrivateKey: ()=>W.randomBytes(32),
                            sha512: async (...e)=>{
                                const t = x(...e);
                                if (V.web) {
                                    const e1 = await V.web.subtle.digest("SHA-512", t.buffer);
                                    return new Uint8Array(e1);
                                }
                                if (V.node) return Uint8Array.from(V.node.createHash("sha512").update(t).digest());
                                throw Error("The environment doesn't have sha512 function");
                            },
                            precompute (e = 8, t = m.BASE) {
                                const r = t.equals(m.BASE) ? t : new m(t.x, t.y);
                                return r._setWindowSize(e), r.multiply(o), r;
                            },
                            sha512Sync: void 0
                        };
                        Object.defineProperties(W, {
                            sha512Sync: {
                                configurable: !1,
                                get: ()=>P,
                                set (e) {
                                    P || (P = e);
                                }
                            }
                        });
                        var F = function e(t, r, n) {
                            r = r || [];
                            for(var o = n = n || 0; t >= H;)r[n++] = 255 & t | 128, t /= 128;
                            for(; -128 & t;)r[n++] = 255 & t | 128, t >>>= 7;
                            return r[n] = 0 | t, e.bytes = n - o + 1, r;
                        }, H = Math.pow(2, 31), q = function e(t, r) {
                            var n, o = 0, i = 0, s = r = r || 0, a = t.length;
                            do {
                                if (s >= a) throw e.bytes = 0, RangeError("Could not decode varint");
                                n = t[s++], o += i < 28 ? (127 & n) << i : (127 & n) * Math.pow(2, i), i += 7;
                            }while (n >= 128)
                            return e.bytes = s - r, o;
                        }, J = Math.pow(2, 7), G = Math.pow(2, 14), Z = Math.pow(2, 21), K = Math.pow(2, 28), X = Math.pow(2, 35), Q = Math.pow(2, 42), Y = Math.pow(2, 49), ee = Math.pow(2, 56), te = Math.pow(2, 63), re = {
                            encode: F,
                            decode: q,
                            encodingLength: function(e) {
                                return e < J ? 1 : e < G ? 2 : e < Z ? 3 : e < K ? 4 : e < X ? 5 : e < Q ? 6 : e < Y ? 7 : e < ee ? 8 : e < te ? 9 : 10;
                            }
                        };
                        const ne = (e, t = 0)=>[
                                re.decode(e, t),
                                re.decode.bytes
                            ], oe = (e, t, r = 0)=>(re.encode(e, t, r), t), ie = (e)=>re.encodingLength(e), se = (e)=>{
                            if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name) return e;
                            if (e instanceof ArrayBuffer) return new Uint8Array(e);
                            if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
                            throw Error("Unknown type, must be binary type");
                        }, ae = (e, t)=>{
                            const r = t.byteLength, n = ie(e), o = n + ie(r), i = new Uint8Array(o + r);
                            return oe(e, i, 0), oe(r, i, n), i.set(t, o), new ue(e, r, t, i);
                        }, ce = (e)=>{
                            const t = se(e), [r, n] = ne(t), [o, i] = ne(t.subarray(n)), s = t.subarray(n + i);
                            if (s.byteLength !== o) throw Error("Incorrect length");
                            return new ue(r, o, s, t);
                        };
                        class ue {
                            constructor(e, t, r, n){
                                this.code = e, this.size = t, this.digest = r, this.bytes = n;
                            }
                        }
                        var he = function(e, t) {
                            if (e.length >= 255) throw TypeError("Alphabet too long");
                            for(var r = new Uint8Array(256), n = 0; n < r.length; n++)r[n] = 255;
                            for(var o = 0; o < e.length; o++){
                                var i = e.charAt(o), s = i.charCodeAt(0);
                                if (255 !== r[s]) throw TypeError(i + " is ambiguous");
                                r[s] = o;
                            }
                            var a = e.length, c = e.charAt(0), u = Math.log(a) / Math.log(256), h = Math.log(256) / Math.log(a);
                            function f(e) {
                                if ("string" != typeof e) throw TypeError("Expected String");
                                if (0 === e.length) return new Uint8Array;
                                var t = 0;
                                if (" " !== e[t]) {
                                    for(var n = 0, o = 0; e[t] === c;)n++, t++;
                                    for(var i = (e.length - t) * u + 1 >>> 0, s = new Uint8Array(i); e[t];){
                                        var h = r[e.charCodeAt(t)];
                                        if (255 === h) return;
                                        for(var f = 0, d = i - 1; (0 !== h || f < o) && -1 !== d; d--, f++)h += a * s[d] >>> 0, s[d] = h % 256 >>> 0, h = h / 256 >>> 0;
                                        if (0 !== h) throw Error("Non-zero carry");
                                        o = f, t++;
                                    }
                                    if (" " !== e[t]) {
                                        for(var l = i - o; l !== i && 0 === s[l];)l++;
                                        for(var p = new Uint8Array(n + (i - l)), w = n; l !== i;)p[w++] = s[l++];
                                        return p;
                                    }
                                }
                            }
                            return {
                                encode: function(t) {
                                    if (t instanceof Uint8Array || (ArrayBuffer.isView(t) ? t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : Array.isArray(t) && (t = Uint8Array.from(t))), !(t instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
                                    if (0 === t.length) return "";
                                    for(var r = 0, n = 0, o = 0, i = t.length; o !== i && 0 === t[o];)o++, r++;
                                    for(var s = (i - o) * h + 1 >>> 0, u = new Uint8Array(s); o !== i;){
                                        for(var f = t[o], d = 0, l = s - 1; (0 !== f || d < n) && -1 !== l; l--, d++)f += 256 * u[l] >>> 0, u[l] = f % a >>> 0, f = f / a >>> 0;
                                        if (0 !== f) throw Error("Non-zero carry");
                                        n = d, o++;
                                    }
                                    for(var p = s - n; p !== s && 0 === u[p];)p++;
                                    for(var w = c.repeat(r); p < s; ++p)w += e.charAt(u[p]);
                                    return w;
                                },
                                decodeUnsafe: f,
                                decode: function(e) {
                                    var r = f(e);
                                    if (r) return r;
                                    throw Error(`Non-${t} character`);
                                }
                            };
                        }, fe = he;
                        class de {
                            constructor(e, t, r){
                                this.name = e, this.prefix = t, this.baseEncode = r;
                            }
                            encode(e) {
                                if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
                                throw Error("Unknown type, must be binary type");
                            }
                        }
                        class le {
                            constructor(e, t, r){
                                if (this.name = e, this.prefix = t, void 0 === t.codePointAt(0)) throw Error("Invalid prefix character");
                                this.prefixCodePoint = t.codePointAt(0), this.baseDecode = r;
                            }
                            decode(e) {
                                if ("string" == typeof e) {
                                    if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
                                    return this.baseDecode(e.slice(this.prefix.length));
                                }
                                throw Error("Can only multibase decode strings");
                            }
                            or(e) {
                                return we(this, e);
                            }
                        }
                        class pe {
                            constructor(e){
                                this.decoders = e;
                            }
                            or(e) {
                                return we(this, e);
                            }
                            decode(e) {
                                const t = e[0], r = this.decoders[t];
                                if (r) return r.decode(e);
                                throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
                            }
                        }
                        const we = (e, t)=>new pe({
                                ...e.decoders || {
                                    [e.prefix]: e
                                },
                                ...t.decoders || {
                                    [t.prefix]: t
                                }
                            });
                        class ye {
                            constructor(e, t, r, n){
                                this.name = e, this.prefix = t, this.baseEncode = r, this.baseDecode = n, this.encoder = new de(e, t, r), this.decoder = new le(e, t, n);
                            }
                            encode(e) {
                                return this.encoder.encode(e);
                            }
                            decode(e) {
                                return this.decoder.decode(e);
                            }
                        }
                        const ge = ({ name: e , prefix: t , encode: r , decode: n  })=>new ye(e, t, r, n), be = ({ prefix: e , name: t , alphabet: r  })=>{
                            const { encode: n , decode: o  } = fe(r, t);
                            return ge({
                                prefix: e,
                                name: t,
                                encode: n,
                                decode: (e)=>se(o(e))
                            });
                        }, me = ({ name: e , prefix: t , bitsPerChar: r , alphabet: n  })=>ge({
                                prefix: t,
                                name: e,
                                encode: (e)=>((e, t, r)=>{
                                        const n = "=" === t[t.length - 1], o = (1 << r) - 1;
                                        let i = "", s = 0, a = 0;
                                        for(let n1 = 0; n1 < e.length; ++n1)for(a = a << 8 | e[n1], s += 8; s > r;)s -= r, i += t[o & a >> s];
                                        if (s && (i += t[o & a << r - s]), n) for(; i.length * r & 7;)i += "=";
                                        return i;
                                    })(e, n, r),
                                decode: (t)=>((e, t, r, n)=>{
                                        const o = {};
                                        for(let e1 = 0; e1 < t.length; ++e1)o[t[e1]] = e1;
                                        let i = e.length;
                                        for(; "=" === e[i - 1];)--i;
                                        const s = new Uint8Array(i * r / 8 | 0);
                                        let a = 0, c = 0, u = 0;
                                        for(let t1 = 0; t1 < i; ++t1){
                                            const i1 = o[e[t1]];
                                            if (void 0 === i1) throw SyntaxError(`Non-${n} character`);
                                            c = c << r | i1, a += r, a >= 8 && (a -= 8, s[u++] = 255 & c >> a);
                                        }
                                        if (a >= r || 255 & c << 8 - a) throw SyntaxError("Unexpected end of data");
                                        return s;
                                    })(t, n, r, e)
                            }), ve = be({
                            name: "base58btc",
                            prefix: "z",
                            alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
                        });
                        be({
                            name: "base58flickr",
                            prefix: "Z",
                            alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
                        });
                        const xe = me({
                            prefix: "b",
                            name: "base32",
                            alphabet: "abcdefghijklmnopqrstuvwxyz234567",
                            bitsPerChar: 5
                        });
                        me({
                            prefix: "B",
                            name: "base32upper",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
                            bitsPerChar: 5
                        }), me({
                            prefix: "c",
                            name: "base32pad",
                            alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
                            bitsPerChar: 5
                        }), me({
                            prefix: "C",
                            name: "base32padupper",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
                            bitsPerChar: 5
                        }), me({
                            prefix: "v",
                            name: "base32hex",
                            alphabet: "0123456789abcdefghijklmnopqrstuv",
                            bitsPerChar: 5
                        }), me({
                            prefix: "V",
                            name: "base32hexupper",
                            alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
                            bitsPerChar: 5
                        }), me({
                            prefix: "t",
                            name: "base32hexpad",
                            alphabet: "0123456789abcdefghijklmnopqrstuv=",
                            bitsPerChar: 5
                        }), me({
                            prefix: "T",
                            name: "base32hexpadupper",
                            alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
                            bitsPerChar: 5
                        }), me({
                            prefix: "h",
                            name: "base32z",
                            alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
                            bitsPerChar: 5
                        });
                        class Ee {
                            constructor(e, t, r, n){
                                this.code = t, this.version = e, this.multihash = r, this.bytes = n, this.byteOffset = n.byteOffset, this.byteLength = n.byteLength, this.asCID = this, this._baseCache = new Map, Object.defineProperties(this, {
                                    byteOffset: $e,
                                    byteLength: $e,
                                    code: Re,
                                    version: Re,
                                    multihash: Re,
                                    bytes: Re,
                                    _baseCache: $e,
                                    asCID: $e
                                });
                            }
                            toV0() {
                                if (0 === this.version) return this;
                                {
                                    const { code: e , multihash: t  } = this;
                                    if (e !== Ae) throw Error("Cannot convert a non dag-pb CID to CIDv0");
                                    if (t.code !== Ie) throw Error("Cannot convert non sha2-256 multihash CID to CIDv0");
                                    return Ee.createV0(t);
                                }
                            }
                            toV1() {
                                switch(this.version){
                                    case 0:
                                        {
                                            const { code: e , digest: t  } = this.multihash, r = ae(e, t);
                                            return Ee.createV1(this.code, r);
                                        }
                                    case 1:
                                        return this;
                                    default:
                                        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
                                }
                            }
                            equals(e) {
                                return e && this.code === e.code && this.version === e.version && ((t = this.multihash) === (r = e.multihash) || t.code === r.code && t.size === r.size && ((e, t)=>{
                                    if (e === t) return !0;
                                    if (e.byteLength !== t.byteLength) return !1;
                                    for(let r = 0; r < e.byteLength; r++)if (e[r] !== t[r]) return !1;
                                    return !0;
                                })(t.bytes, r.bytes));
                                var t, r;
                            }
                            toString(e) {
                                const { bytes: t , version: r , _baseCache: n  } = this;
                                return 0 === r ? Se(t, n, e || ve.encoder) : Be(t, n, e || xe.encoder);
                            }
                            toJSON() {
                                return {
                                    code: this.code,
                                    version: this.version,
                                    hash: this.multihash.bytes
                                };
                            }
                            get [Symbol.toStringTag]() {
                                return "CID";
                            }
                            [Symbol.for("nodejs.util.inspect.custom")]() {
                                return "CID(" + this.toString() + ")";
                            }
                            static isCID(e) {
                                return Te(/^0\.0/, Ue), !(!e || !e[Oe] && e.asCID !== e);
                            }
                            get toBaseEncodedString() {
                                throw Error("Deprecated, use .toString()");
                            }
                            get codec() {
                                throw Error('"codec" property is deprecated, use integer "code" property instead');
                            }
                            get buffer() {
                                throw Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
                            }
                            get multibaseName() {
                                throw Error('"multibaseName" property is deprecated');
                            }
                            get prefix() {
                                throw Error('"prefix" property is deprecated');
                            }
                            static asCID(e) {
                                if (e instanceof Ee) return e;
                                if (null != e && e.asCID === e) {
                                    const { version: t , code: r , multihash: n , bytes: o  } = e;
                                    return new Ee(t, r, n, o || Ce(t, r, n.bytes));
                                }
                                if (null != e && !0 === e[Oe]) {
                                    const { version: t1 , multihash: r1 , code: n1  } = e, o1 = ce(r1);
                                    return Ee.create(t1, n1, o1);
                                }
                                return null;
                            }
                            static create(e, t, r) {
                                if ("number" != typeof t) throw Error("String codecs are no longer supported");
                                switch(e){
                                    case 0:
                                        if (t !== Ae) throw Error(`Version 0 CID must use dag-pb (code: ${Ae}) block encoding`);
                                        return new Ee(e, t, r, r.bytes);
                                    case 1:
                                        {
                                            const n = Ce(e, t, r.bytes);
                                            return new Ee(e, t, r, n);
                                        }
                                    default:
                                        throw Error("Invalid version");
                                }
                            }
                            static createV0(e) {
                                return Ee.create(0, Ae, e);
                            }
                            static createV1(e, t) {
                                return Ee.create(1, e, t);
                            }
                            static decode(e) {
                                const [t, r] = Ee.decodeFirst(e);
                                if (r.length) throw Error("Incorrect length");
                                return t;
                            }
                            static decodeFirst(e) {
                                const t = Ee.inspectBytes(e), r = t.size - t.multihashSize, n = se(e.subarray(r, r + t.multihashSize));
                                if (n.byteLength !== t.multihashSize) throw Error("Incorrect length");
                                const o = n.subarray(t.multihashSize - t.digestSize), i = new ue(t.multihashCode, t.digestSize, o, n);
                                return [
                                    0 === t.version ? Ee.createV0(i) : Ee.createV1(t.codec, i),
                                    e.subarray(t.size)
                                ];
                            }
                            static inspectBytes(e) {
                                let t = 0;
                                const r = ()=>{
                                    const [r, n] = ne(e.subarray(t));
                                    return t += n, r;
                                };
                                let n = r(), o = Ae;
                                if (18 === n ? (n = 0, t = 0) : 1 === n && (o = r()), 0 !== n && 1 !== n) throw RangeError(`Invalid CID version ${n}`);
                                const i = t, s = r(), a = r(), c = t + a;
                                return {
                                    version: n,
                                    codec: o,
                                    multihashCode: s,
                                    digestSize: a,
                                    multihashSize: c - i,
                                    size: c
                                };
                            }
                            static parse(e, t) {
                                const [r, n] = ke(e, t), o = Ee.decode(n);
                                return o._baseCache.set(r, e), o;
                            }
                        }
                        const ke = (e, t)=>{
                            switch(e[0]){
                                case "Q":
                                    {
                                        const r = t || ve;
                                        return [
                                            ve.prefix,
                                            r.decode(`${ve.prefix}${e}`)
                                        ];
                                    }
                                case ve.prefix:
                                    {
                                        const r1 = t || ve;
                                        return [
                                            ve.prefix,
                                            r1.decode(e)
                                        ];
                                    }
                                case xe.prefix:
                                    {
                                        const r2 = t || xe;
                                        return [
                                            xe.prefix,
                                            r2.decode(e)
                                        ];
                                    }
                                default:
                                    if (null == t) throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
                                    return [
                                        e[0],
                                        t.decode(e)
                                    ];
                            }
                        }, Se = (e, t, r)=>{
                            const { prefix: n  } = r;
                            if (n !== ve.prefix) throw Error(`Cannot string encode V0 in ${r.name} encoding`);
                            const o = t.get(n);
                            if (null == o) {
                                const o1 = r.encode(e).slice(1);
                                return t.set(n, o1), o1;
                            }
                            return o;
                        }, Be = (e, t, r)=>{
                            const { prefix: n  } = r, o = t.get(n);
                            if (null == o) {
                                const o1 = r.encode(e);
                                return t.set(n, o1), o1;
                            }
                            return o;
                        }, Ae = 112, Ie = 18, Ce = (e, t, r)=>{
                            const n = ie(e), o = n + ie(t), i = new Uint8Array(o + r.byteLength);
                            return oe(e, i, 0), oe(t, i, n), i.set(r, o), i;
                        }, Oe = Symbol.for("@ipld/js-cid/CID"), Re = {
                            writable: !1,
                            configurable: !1,
                            enumerable: !0
                        }, $e = {
                            writable: !1,
                            enumerable: !1,
                            configurable: !1
                        }, Te = (e, t)=>{
                            if (!e.test("0.0.0-dev")) throw Error(t);
                            console.warn(t);
                        }, Ue = "CID.isCID(v) is deprecated and will be removed in the next major release.\nFollowing code pattern:\n\nif (CID.isCID(value)) {\n  doSomethingWithCID(value)\n}\n\nIs replaced with:\n\nconst cid = CID.asCID(value)\nif (cid) {\n  // Make sure to use cid instead of value\n  doSomethingWithCID(cid)\n}\n", _e = ({ name: e , code: t , encode: r  })=>new Ne(e, t, r);
                        class Ne {
                            constructor(e, t, r){
                                this.name = e, this.code = t, this.encode = r;
                            }
                            digest(e) {
                                if (e instanceof Uint8Array) {
                                    const t = this.encode(e);
                                    return t instanceof Uint8Array ? ae(this.code, t) : t.then((e)=>ae(this.code, e));
                                }
                                throw Error("Unknown type, must be binary type");
                            }
                        }
                        const je = "did:key:", ze = (e)=>{
                            const [t] = ne(e);
                            switch(t){
                                case 237:
                                case 4613:
                                    return t;
                                case 4608:
                                    if (e.length > 35) throw RangeError("Only p256-pub compressed is supported.");
                                    return t;
                                default:
                                    throw RangeError(`Unsupported key algorithm with multicode 0x${t.toString(16)}.`);
                            }
                        }, De = (e)=>{
                            if (!e.startsWith(je)) throw RangeError(`Invalid DID "${e}", must start with 'did:key:'`);
                            return Le(ve.decode(e.slice(je.length)));
                        }, Pe = (e)=>`did:key:${ve.encode(Me(e))}`, Le = (e)=>(ze(e), new We(e.buffer, e.byteOffset, e.byteLength)), Me = (e)=>e, Ve = (e)=>e instanceof We ? e : e instanceof Uint8Array ? Le(e) : De(e);
                        class We extends Uint8Array {
                            did() {
                                return Pe(this);
                            }
                        }
                        const Fe = 237, He = ie(Fe), qe = 32 + He, Je = (e)=>Ge(De(e)), Ge = (e)=>{
                            const [t] = ne(e);
                            if (t !== Fe) throw RangeError(`Unsupported key algorithm with multicode 0x${Fe.toString(16)}`);
                            if (e.byteLength !== qe) throw RangeError(`Expected Uint8Array with byteLength ${qe}, instead got Uint8Array with byteLength ${e.byteLength}`);
                            return new Ze(e.buffer, e.byteOffset);
                        };
                        class Ze {
                            constructor(e, t = 0){
                                this.buffer = e, this.byteOffset = t, this.byteLength = qe;
                            }
                            get bytes() {
                                const e = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
                                return Object.defineProperties(this, {
                                    bytes: {
                                        value: e
                                    }
                                }), e;
                            }
                            get publicKey() {
                                const e = new Uint8Array(this.buffer, this.byteOffset + He);
                                return Object.defineProperties(this, {
                                    publicKey: {
                                        value: e
                                    }
                                }), e;
                            }
                            did() {
                                return Pe(this.bytes);
                            }
                            verify(e, t) {
                                return M(t, e, this.publicKey);
                            }
                        }
                        const Ke = me({
                            prefix: "m",
                            name: "base64",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                            bitsPerChar: 6
                        }), Xe = me({
                            prefix: "M",
                            name: "base64pad",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                            bitsPerChar: 6
                        }), Qe = me({
                            prefix: "u",
                            name: "base64url",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
                            bitsPerChar: 6
                        });
                        me({
                            prefix: "U",
                            name: "base64urlpad",
                            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
                            bitsPerChar: 6
                        });
                        const Ye = 4864, et = ie(Ye), tt = ie(Fe), rt = 32, nt = et + rt + tt + rt, ot = async (e)=>{
                            if (e.byteLength !== rt) throw Error(`Expected Uint8Array with byteLength of 32 instead not ${e.byteLength}`);
                            const t = await async function(e) {
                                return (await L(e)).pointBytes;
                            }(e), r = new Uint8Array(nt);
                            return oe(Ye, r, 0), r.set(e, et), oe(Fe, r, et + rt), r.set(t, et + rt + tt), new it(r);
                        };
                        class it {
                            constructor(e){
                                this.buffer = e.buffer, this.byteOffset = e.byteOffset, this.byteLength = nt, this.bytes = e;
                            }
                            get principal() {
                                const e = new Uint8Array(this.buffer, et + rt), t = Ge(e);
                                return Object.defineProperties(this, {
                                    principal: {
                                        value: t
                                    }
                                }), t;
                            }
                            get secret() {
                                const e = new Uint8Array(this.buffer, et, rt);
                                return Object.defineProperties(this, {
                                    secret: {
                                        value: e
                                    }
                                }), e;
                            }
                            did() {
                                return (({ principal: e  })=>e.did())(this);
                            }
                            sign(e) {
                                return async function(e, t) {
                                    e = z(e);
                                    const { prefix: r , scalar: n , pointBytes: o  } = await L(t), i = j(await W.sha512(r, e)), a = m.BASE.multiply(i), c = $(i + j(await W.sha512(a.toRawBytes(), o, e)) * n, s.l);
                                    return new v(a, c).toRawBytes();
                                }(e, this.secret);
                            }
                            verify(e, t) {
                                return this.principal.verify(e, t);
                            }
                        }
                        const st = [
                            "string",
                            "number",
                            "bigint",
                            "symbol"
                        ], at = [
                            "Function",
                            "Generator",
                            "AsyncGenerator",
                            "GeneratorFunction",
                            "AsyncGeneratorFunction",
                            "AsyncFunction",
                            "Observable",
                            "Array",
                            "Buffer",
                            "Object",
                            "RegExp",
                            "Date",
                            "Error",
                            "Map",
                            "Set",
                            "WeakMap",
                            "WeakSet",
                            "ArrayBuffer",
                            "SharedArrayBuffer",
                            "DataView",
                            "Promise",
                            "URL",
                            "HTMLElement",
                            "Int8Array",
                            "Uint8Array",
                            "Uint8ClampedArray",
                            "Int16Array",
                            "Uint16Array",
                            "Int32Array",
                            "Uint32Array",
                            "Float32Array",
                            "Float64Array",
                            "BigInt64Array",
                            "BigUint64Array"
                        ];
                        function ct(e) {
                            if (null === e) return "null";
                            if (void 0 === e) return "undefined";
                            if (!0 === e || !1 === e) return "boolean";
                            const t = typeof e;
                            if (st.includes(t)) return t;
                            if ("function" === t) return "Function";
                            if (Array.isArray(e)) return "Array";
                            if (function(e) {
                                return e && e.constructor && e.constructor.isBuffer && e.constructor.isBuffer.call(null, e);
                            }(e)) return "Buffer";
                            const r = function(e) {
                                const t = Object.prototype.toString.call(e).slice(8, -1);
                                if (at.includes(t)) return t;
                            }(e);
                            return r || "Object";
                        }
                        class ut {
                            constructor(e, t, r){
                                this.major = e, this.majorEncoded = e << 5, this.name = t, this.terminal = r;
                            }
                            toString() {
                                return `Type[${this.major}].${this.name}`;
                            }
                            compare(e) {
                                return this.major < e.major ? -1 : this.major > e.major ? 1 : 0;
                            }
                        }
                        ut.uint = new ut(0, "uint", !0), ut.negint = new ut(1, "negint", !0), ut.bytes = new ut(2, "bytes", !0), ut.string = new ut(3, "string", !0), ut.array = new ut(4, "array", !1), ut.map = new ut(5, "map", !1), ut.tag = new ut(6, "tag", !1), ut.float = new ut(7, "float", !0), ut.false = new ut(7, "false", !0), ut.true = new ut(7, "true", !0), ut.null = new ut(7, "null", !0), ut.undefined = new ut(7, "undefined", !0), ut.break = new ut(7, "break", !0);
                        class ht {
                            constructor(e, t, r){
                                this.type = e, this.value = t, this.encodedLength = r, this.encodedBytes = void 0, this.byteValue = void 0;
                            }
                            toString() {
                                return `Token[${this.type}].${this.value}`;
                            }
                        }
                        const ft = globalThis.process && !globalThis.process.browser && globalThis.Buffer && "function" == typeof globalThis.Buffer.isBuffer, dt = new TextDecoder, lt = new TextEncoder;
                        function pt(e) {
                            return ft && globalThis.Buffer.isBuffer(e);
                        }
                        function wt(e) {
                            return e instanceof Uint8Array ? pt(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e : Uint8Array.from(e);
                        }
                        const yt = ft ? (e, t, r)=>r - t > 64 ? globalThis.Buffer.from(e.subarray(t, r)).toString("utf8") : kt(e, t, r) : (e, t, r)=>r - t > 64 ? dt.decode(e.subarray(t, r)) : kt(e, t, r), gt = ft ? (e)=>e.length > 64 ? globalThis.Buffer.from(e) : Et(e) : (e)=>e.length > 64 ? lt.encode(e) : Et(e), bt = (e)=>Uint8Array.from(e), mt = ft ? (e, t, r)=>pt(e) ? new Uint8Array(e.subarray(t, r)) : e.slice(t, r) : (e, t, r)=>e.slice(t, r), vt = ft ? (e, t)=>(e = e.map((e)=>e instanceof Uint8Array ? e : globalThis.Buffer.from(e)), wt(globalThis.Buffer.concat(e, t))) : (e, t)=>{
                            const r = new Uint8Array(t);
                            let n = 0;
                            for (let t1 of e)n + t1.length > r.length && (t1 = t1.subarray(0, r.length - n)), r.set(t1, n), n += t1.length;
                            return r;
                        }, xt = ft ? (e)=>globalThis.Buffer.allocUnsafe(e) : (e)=>new Uint8Array(e);
                        function Et(e, t = 1 / 0) {
                            let r;
                            const n = e.length;
                            let o = null;
                            const i = [];
                            for(let s = 0; s < n; ++s){
                                if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
                                    if (!o) {
                                        if (r > 56319) {
                                            (t -= 3) > -1 && i.push(239, 191, 189);
                                            continue;
                                        }
                                        if (s + 1 === n) {
                                            (t -= 3) > -1 && i.push(239, 191, 189);
                                            continue;
                                        }
                                        o = r;
                                        continue;
                                    }
                                    if (r < 56320) {
                                        (t -= 3) > -1 && i.push(239, 191, 189), o = r;
                                        continue;
                                    }
                                    r = 65536 + (o - 55296 << 10 | r - 56320);
                                } else o && (t -= 3) > -1 && i.push(239, 191, 189);
                                if (o = null, r < 128) {
                                    if ((t -= 1) < 0) break;
                                    i.push(r);
                                } else if (r < 2048) {
                                    if ((t -= 2) < 0) break;
                                    i.push(r >> 6 | 192, 63 & r | 128);
                                } else if (r < 65536) {
                                    if ((t -= 3) < 0) break;
                                    i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
                                } else {
                                    if (!(r < 1114112)) throw Error("Invalid code point");
                                    if ((t -= 4) < 0) break;
                                    i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
                                }
                            }
                            return i;
                        }
                        function kt(e, t, r) {
                            const n = [];
                            for(; t < r;){
                                const o = e[t];
                                let i = null, s = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                                if (t + s <= r) {
                                    let r1, n1, a, c;
                                    switch(s){
                                        case 1:
                                            o < 128 && (i = o);
                                            break;
                                        case 2:
                                            r1 = e[t + 1], 128 == (192 & r1) && (c = (31 & o) << 6 | 63 & r1, c > 127 && (i = c));
                                            break;
                                        case 3:
                                            r1 = e[t + 1], n1 = e[t + 2], 128 == (192 & r1) && 128 == (192 & n1) && (c = (15 & o) << 12 | (63 & r1) << 6 | 63 & n1, c > 2047 && (c < 55296 || c > 57343) && (i = c));
                                            break;
                                        case 4:
                                            r1 = e[t + 1], n1 = e[t + 2], a = e[t + 3], 128 == (192 & r1) && 128 == (192 & n1) && 128 == (192 & a) && (c = (15 & o) << 18 | (63 & r1) << 12 | (63 & n1) << 6 | 63 & a, c > 65535 && c < 1114112 && (i = c));
                                    }
                                }
                                null === i ? (i = 65533, s = 1) : i > 65535 && (i -= 65536, n.push(i >>> 10 & 1023 | 55296), i = 56320 | 1023 & i), n.push(i), t += s;
                            }
                            return St(n);
                        }
                        function St(e) {
                            const t = e.length;
                            if (t <= 4096) return String.fromCharCode.apply(String, e);
                            let r = "", n = 0;
                            for(; n < t;)r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
                            return r;
                        }
                        class Bt {
                            constructor(e = 256){
                                this.chunkSize = e, this.cursor = 0, this.maxCursor = -1, this.chunks = [], this._initReuseChunk = null;
                            }
                            reset() {
                                this.cursor = 0, this.maxCursor = -1, this.chunks.length && (this.chunks = []), null !== this._initReuseChunk && (this.chunks.push(this._initReuseChunk), this.maxCursor = this._initReuseChunk.length - 1);
                            }
                            push(e) {
                                let t = this.chunks[this.chunks.length - 1];
                                if (this.cursor + e.length <= this.maxCursor + 1) {
                                    const r = t.length - (this.maxCursor - this.cursor) - 1;
                                    t.set(e, r);
                                } else {
                                    if (t) {
                                        const e1 = t.length - (this.maxCursor - this.cursor) - 1;
                                        e1 < t.length && (this.chunks[this.chunks.length - 1] = t.subarray(0, e1), this.maxCursor = this.cursor - 1);
                                    }
                                    e.length < 64 && e.length < this.chunkSize ? (t = xt(this.chunkSize), this.chunks.push(t), this.maxCursor += t.length, null === this._initReuseChunk && (this._initReuseChunk = t), t.set(e, 0)) : (this.chunks.push(e), this.maxCursor += e.length);
                                }
                                this.cursor += e.length;
                            }
                            toBytes(e = !1) {
                                let t;
                                if (1 === this.chunks.length) {
                                    const r = this.chunks[0];
                                    e && this.cursor > r.length / 2 ? (t = this.cursor === r.length ? r : r.subarray(0, this.cursor), this._initReuseChunk = null, this.chunks = []) : t = mt(r, 0, this.cursor);
                                } else t = vt(this.chunks, this.cursor);
                                return e && this.reset(), t;
                            }
                        }
                        function At(e, t, r) {
                            if (e.length - t < r) throw Error("CBOR decode error: not enough data for type");
                        }
                        const It = [
                            24,
                            256,
                            65536,
                            4294967296,
                            BigInt("18446744073709551616")
                        ];
                        function Ct(e, t, r) {
                            At(e, t, 1);
                            const n = e[t];
                            if (!0 === r.strict && n < It[0]) throw Error("CBOR decode error: integer encoded in more bytes than necessary (strict decode)");
                            return n;
                        }
                        function Ot(e, t, r) {
                            At(e, t, 2);
                            const n = e[t] << 8 | e[t + 1];
                            if (!0 === r.strict && n < It[1]) throw Error("CBOR decode error: integer encoded in more bytes than necessary (strict decode)");
                            return n;
                        }
                        function Rt(e, t, r) {
                            At(e, t, 4);
                            const n = 16777216 * e[t] + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3];
                            if (!0 === r.strict && n < It[2]) throw Error("CBOR decode error: integer encoded in more bytes than necessary (strict decode)");
                            return n;
                        }
                        function $t(e, t, r) {
                            At(e, t, 8);
                            const n = 16777216 * e[t] + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3], o = 16777216 * e[t + 4] + (e[t + 5] << 16) + (e[t + 6] << 8) + e[t + 7], i = (BigInt(n) << BigInt(32)) + BigInt(o);
                            if (!0 === r.strict && i < It[3]) throw Error("CBOR decode error: integer encoded in more bytes than necessary (strict decode)");
                            if (i <= Number.MAX_SAFE_INTEGER) return Number(i);
                            if (!0 === r.allowBigInt) return i;
                            throw Error("CBOR decode error: integers outside of the safe integer range are not supported");
                        }
                        function Tt(e, t) {
                            return Ut(e, 0, t.value);
                        }
                        function Ut(e, t, r) {
                            if (r < It[0]) {
                                const n = Number(r);
                                e.push([
                                    t | n
                                ]);
                            } else if (r < It[1]) {
                                const n1 = Number(r);
                                e.push([
                                    24 | t,
                                    n1
                                ]);
                            } else if (r < It[2]) {
                                const n2 = Number(r);
                                e.push([
                                    25 | t,
                                    n2 >>> 8,
                                    255 & n2
                                ]);
                            } else if (r < It[3]) {
                                const n3 = Number(r);
                                e.push([
                                    26 | t,
                                    n3 >>> 24 & 255,
                                    n3 >>> 16 & 255,
                                    n3 >>> 8 & 255,
                                    255 & n3
                                ]);
                            } else {
                                const n4 = BigInt(r);
                                if (!(n4 < It[4])) throw Error("CBOR decode error: encountered BigInt larger than allowable range");
                                {
                                    const r1 = [
                                        27 | t,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0
                                    ];
                                    let o = Number(n4 & BigInt(4294967295)), i = Number(n4 >> BigInt(32) & BigInt(4294967295));
                                    r1[8] = 255 & o, o >>= 8, r1[7] = 255 & o, o >>= 8, r1[6] = 255 & o, o >>= 8, r1[5] = 255 & o, r1[4] = 255 & i, i >>= 8, r1[3] = 255 & i, i >>= 8, r1[2] = 255 & i, i >>= 8, r1[1] = 255 & i, e.push(r1);
                                }
                            }
                        }
                        Tt.encodedSize = function(e) {
                            return Ut.encodedSize(e.value);
                        }, Ut.encodedSize = function(e) {
                            return e < It[0] ? 1 : e < It[1] ? 2 : e < It[2] ? 3 : e < It[3] ? 5 : 9;
                        }, Tt.compareTokens = function(e, t) {
                            return e.value < t.value ? -1 : e.value > t.value ? 1 : 0;
                        };
                        const _t = BigInt(-1), Nt = BigInt(1);
                        function jt(e, t) {
                            const r = t.value, n = "bigint" == typeof r ? r * _t - Nt : -1 * r - 1;
                            Ut(e, t.type.majorEncoded, n);
                        }
                        function zt(e, t, r, n) {
                            At(e, t, r + n);
                            const o = mt(e, t + r, t + r + n);
                            return new ht(ut.bytes, o, r + n);
                        }
                        function Dt(e, t, r, n) {
                            return zt(e, t, 1, r);
                        }
                        function Pt(e) {
                            return void 0 === e.encodedBytes && (e.encodedBytes = e.type === ut.string ? gt(e.value) : e.value), e.encodedBytes;
                        }
                        function Lt(e, t) {
                            const r = Pt(t);
                            Ut(e, t.type.majorEncoded, r.length), e.push(r);
                        }
                        function Mt(e, t, r, n, o) {
                            const i = r + n;
                            At(e, t, i);
                            const s = new ht(ut.string, yt(e, t + r, t + i), i);
                            return !0 === o.retainStringBytes && (s.byteValue = mt(e, t + r, t + i)), s;
                        }
                        function Vt(e, t, r, n) {
                            return Mt(e, t, 1, r, n);
                        }
                        jt.encodedSize = function(e) {
                            const t = e.value, r = "bigint" == typeof t ? t * _t - Nt : -1 * t - 1;
                            return r < It[0] ? 1 : r < It[1] ? 2 : r < It[2] ? 3 : r < It[3] ? 5 : 9;
                        }, jt.compareTokens = function(e, t) {
                            return e.value < t.value ? 1 : e.value > t.value ? -1 : 0;
                        }, Lt.encodedSize = function(e) {
                            const t = Pt(e);
                            return Ut.encodedSize(t.length) + t.length;
                        }, Lt.compareTokens = function(e, t) {
                            return r = Pt(e), n = Pt(t), r.length < n.length ? -1 : r.length > n.length ? 1 : function(e, t) {
                                if (pt(e) && pt(t)) return e.compare(t);
                                for(let r = 0; r < e.length; r++)if (e[r] !== t[r]) return e[r] < t[r] ? -1 : 1;
                                return 0;
                            }(r, n);
                            var r, n;
                        };
                        const Wt = Lt;
                        function Ft(e, t, r, n) {
                            return new ht(ut.array, n, r);
                        }
                        function Ht(e, t, r, n) {
                            return Ft(0, 0, 1, r);
                        }
                        function qt(e, t) {
                            Ut(e, ut.array.majorEncoded, t.value);
                        }
                        function Jt(e, t, r, n) {
                            return new ht(ut.map, n, r);
                        }
                        function Gt(e, t, r, n) {
                            return Jt(0, 0, 1, r);
                        }
                        function Zt(e, t) {
                            Ut(e, ut.map.majorEncoded, t.value);
                        }
                        function Kt(e, t, r, n) {
                            return new ht(ut.tag, r, 1);
                        }
                        function Xt(e, t) {
                            Ut(e, ut.tag.majorEncoded, t.value);
                        }
                        function Qt(e, t, r) {
                            if (r) {
                                if (!1 === r.allowNaN && Number.isNaN(e)) throw Error("CBOR decode error: NaN values are not supported");
                                if (!1 === r.allowInfinity && (e === 1 / 0 || e === -1 / 0)) throw Error("CBOR decode error: Infinity values are not supported");
                            }
                            return new ht(ut.float, e, t);
                        }
                        function Yt(e, t, r) {
                            const n = t.value;
                            if (!1 === n) e.push([
                                20 | ut.float.majorEncoded
                            ]);
                            else if (!0 === n) e.push([
                                21 | ut.float.majorEncoded
                            ]);
                            else if (null === n) e.push([
                                22 | ut.float.majorEncoded
                            ]);
                            else if (void 0 === n) e.push([
                                23 | ut.float.majorEncoded
                            ]);
                            else {
                                let t1, i = !1;
                                r && !0 === r.float64 || (nr(n), t1 = or(rr, 1), n === t1 || Number.isNaN(n) ? (rr[0] = 249, e.push(rr.slice(0, 3)), i = !0) : (ir(n), t1 = sr(rr, 1), n === t1 && (rr[0] = 250, e.push(rr.slice(0, 5)), i = !0))), i || (o = n, tr.setFloat64(0, o, !1), t1 = ar(rr, 1), rr[0] = 251, e.push(rr.slice(0, 9)));
                            }
                            var o;
                        }
                        qt.compareTokens = Tt.compareTokens, qt.encodedSize = function(e) {
                            return Ut.encodedSize(e.value);
                        }, Zt.compareTokens = Tt.compareTokens, Zt.encodedSize = function(e) {
                            return Ut.encodedSize(e.value);
                        }, Xt.compareTokens = Tt.compareTokens, Xt.encodedSize = function(e) {
                            return Ut.encodedSize(e.value);
                        }, Yt.encodedSize = function(e, t) {
                            const r = e.value;
                            if (!1 === r || !0 === r || null == r) return 1;
                            if (!t || !0 !== t.float64) {
                                nr(r);
                                let e1 = or(rr, 1);
                                if (r === e1 || Number.isNaN(r)) return 3;
                                if (ir(r), e1 = sr(rr, 1), r === e1) return 5;
                            }
                            return 9;
                        };
                        const er = new ArrayBuffer(9), tr = new DataView(er, 1), rr = new Uint8Array(er, 0);
                        function nr(e) {
                            if (e === 1 / 0) tr.setUint16(0, 31744, !1);
                            else if (e === -1 / 0) tr.setUint16(0, 64512, !1);
                            else if (Number.isNaN(e)) tr.setUint16(0, 32256, !1);
                            else {
                                tr.setFloat32(0, e);
                                const t = tr.getUint32(0), r = (2139095040 & t) >> 23, n = 8388607 & t;
                                if (255 === r) tr.setUint16(0, 31744, !1);
                                else if (0 === r) tr.setUint16(0, (2147483648 & e) >> 16 | n >> 13, !1);
                                else {
                                    const e1 = r - 127;
                                    e1 < -24 ? tr.setUint16(0, 0) : e1 < -14 ? tr.setUint16(0, (2147483648 & t) >> 16 | 1 << 24 + e1, !1) : tr.setUint16(0, (2147483648 & t) >> 16 | e1 + 15 << 10 | n >> 13, !1);
                                }
                            }
                        }
                        function or(e, t) {
                            if (e.length - t < 2) throw Error("CBOR decode error: not enough data for float16");
                            const r = (e[t] << 8) + e[t + 1];
                            if (31744 === r) return 1 / 0;
                            if (64512 === r) return -1 / 0;
                            if (32256 === r) return NaN;
                            const n = r >> 10 & 31, o = 1023 & r;
                            let i;
                            return i = 0 === n ? o * 2 ** -24 : 31 !== n ? (o + 1024) * 2 ** (n - 25) : 0 === o ? 1 / 0 : NaN, 32768 & r ? -i : i;
                        }
                        function ir(e) {
                            tr.setFloat32(0, e, !1);
                        }
                        function sr(e, t) {
                            if (e.length - t < 4) throw Error("CBOR decode error: not enough data for float32");
                            const r = (e.byteOffset || 0) + t;
                            return new DataView(e.buffer, r, 4).getFloat32(0, !1);
                        }
                        function ar(e, t) {
                            if (e.length - t < 8) throw Error("CBOR decode error: not enough data for float64");
                            const r = (e.byteOffset || 0) + t;
                            return new DataView(e.buffer, r, 8).getFloat64(0, !1);
                        }
                        function cr(e, t, r) {
                            throw Error(`CBOR decode error: encountered invalid minor (${r}) for major ${e[t] >>> 5}`);
                        }
                        function ur(e) {
                            return ()=>{
                                throw Error(`CBOR decode error: ${e}`);
                            };
                        }
                        Yt.compareTokens = Tt.compareTokens;
                        const hr = [];
                        for(let e1 = 0; e1 <= 23; e1++)hr[e1] = cr;
                        hr[24] = function(e, t, r, n) {
                            return new ht(ut.uint, Ct(e, t + 1, n), 2);
                        }, hr[25] = function(e, t, r, n) {
                            return new ht(ut.uint, Ot(e, t + 1, n), 3);
                        }, hr[26] = function(e, t, r, n) {
                            return new ht(ut.uint, Rt(e, t + 1, n), 5);
                        }, hr[27] = function(e, t, r, n) {
                            return new ht(ut.uint, $t(e, t + 1, n), 9);
                        }, hr[28] = cr, hr[29] = cr, hr[30] = cr, hr[31] = cr;
                        for(let e2 = 32; e2 <= 55; e2++)hr[e2] = cr;
                        hr[56] = function(e, t, r, n) {
                            return new ht(ut.negint, -1 - Ct(e, t + 1, n), 2);
                        }, hr[57] = function(e, t, r, n) {
                            return new ht(ut.negint, -1 - Ot(e, t + 1, n), 3);
                        }, hr[58] = function(e, t, r, n) {
                            return new ht(ut.negint, -1 - Rt(e, t + 1, n), 5);
                        }, hr[59] = function(e, t, r, n) {
                            const o = $t(e, t + 1, n);
                            if ("bigint" != typeof o) {
                                const e1 = -1 - o;
                                if (e1 >= Number.MIN_SAFE_INTEGER) return new ht(ut.negint, e1, 9);
                            }
                            if (!0 !== n.allowBigInt) throw Error("CBOR decode error: integers outside of the safe integer range are not supported");
                            return new ht(ut.negint, _t - BigInt(o), 9);
                        }, hr[60] = cr, hr[61] = cr, hr[62] = cr, hr[63] = cr;
                        for(let e3 = 64; e3 <= 87; e3++)hr[e3] = Dt;
                        hr[88] = function(e, t, r, n) {
                            return zt(e, t, 2, Ct(e, t + 1, n));
                        }, hr[89] = function(e, t, r, n) {
                            return zt(e, t, 3, Ot(e, t + 1, n));
                        }, hr[90] = function(e, t, r, n) {
                            return zt(e, t, 5, Rt(e, t + 1, n));
                        }, hr[91] = function(e, t, r, n) {
                            const o = $t(e, t + 1, n);
                            if ("bigint" == typeof o) throw Error("CBOR decode error: 64-bit integer bytes lengths not supported");
                            return zt(e, t, 9, o);
                        }, hr[92] = cr, hr[93] = cr, hr[94] = cr, hr[95] = ur("indefinite length bytes/strings are not supported");
                        for(let e4 = 96; e4 <= 119; e4++)hr[e4] = Vt;
                        hr[120] = function(e, t, r, n) {
                            return Mt(e, t, 2, Ct(e, t + 1, n), n);
                        }, hr[121] = function(e, t, r, n) {
                            return Mt(e, t, 3, Ot(e, t + 1, n), n);
                        }, hr[122] = function(e, t, r, n) {
                            return Mt(e, t, 5, Rt(e, t + 1, n), n);
                        }, hr[123] = function(e, t, r, n) {
                            const o = $t(e, t + 1, n);
                            if ("bigint" == typeof o) throw Error("CBOR decode error: 64-bit integer string lengths not supported");
                            return Mt(e, t, 9, o, n);
                        }, hr[124] = cr, hr[125] = cr, hr[126] = cr, hr[127] = ur("indefinite length bytes/strings are not supported");
                        for(let e5 = 128; e5 <= 151; e5++)hr[e5] = Ht;
                        hr[152] = function(e, t, r, n) {
                            return Ft(0, 0, 2, Ct(e, t + 1, n));
                        }, hr[153] = function(e, t, r, n) {
                            return Ft(0, 0, 3, Ot(e, t + 1, n));
                        }, hr[154] = function(e, t, r, n) {
                            return Ft(0, 0, 5, Rt(e, t + 1, n));
                        }, hr[155] = function(e, t, r, n) {
                            const o = $t(e, t + 1, n);
                            if ("bigint" == typeof o) throw Error("CBOR decode error: 64-bit integer array lengths not supported");
                            return Ft(0, 0, 9, o);
                        }, hr[156] = cr, hr[157] = cr, hr[158] = cr, hr[159] = function(e, t, r, n) {
                            if (!1 === n.allowIndefinite) throw Error("CBOR decode error: indefinite length items not allowed");
                            return Ft(0, 0, 1, 1 / 0);
                        };
                        for(let e6 = 160; e6 <= 183; e6++)hr[e6] = Gt;
                        hr[184] = function(e, t, r, n) {
                            return Jt(0, 0, 2, Ct(e, t + 1, n));
                        }, hr[185] = function(e, t, r, n) {
                            return Jt(0, 0, 3, Ot(e, t + 1, n));
                        }, hr[186] = function(e, t, r, n) {
                            return Jt(0, 0, 5, Rt(e, t + 1, n));
                        }, hr[187] = function(e, t, r, n) {
                            const o = $t(e, t + 1, n);
                            if ("bigint" == typeof o) throw Error("CBOR decode error: 64-bit integer map lengths not supported");
                            return Jt(0, 0, 9, o);
                        }, hr[188] = cr, hr[189] = cr, hr[190] = cr, hr[191] = function(e, t, r, n) {
                            if (!1 === n.allowIndefinite) throw Error("CBOR decode error: indefinite length items not allowed");
                            return Jt(0, 0, 1, 1 / 0);
                        };
                        for(let e7 = 192; e7 <= 215; e7++)hr[e7] = Kt;
                        hr[216] = function(e, t, r, n) {
                            return new ht(ut.tag, Ct(e, t + 1, n), 2);
                        }, hr[217] = function(e, t, r, n) {
                            return new ht(ut.tag, Ot(e, t + 1, n), 3);
                        }, hr[218] = function(e, t, r, n) {
                            return new ht(ut.tag, Rt(e, t + 1, n), 5);
                        }, hr[219] = function(e, t, r, n) {
                            return new ht(ut.tag, $t(e, t + 1, n), 9);
                        }, hr[220] = cr, hr[221] = cr, hr[222] = cr, hr[223] = cr;
                        for(let e8 = 224; e8 <= 243; e8++)hr[e8] = ur("simple values are not supported");
                        hr[244] = cr, hr[245] = cr, hr[246] = cr, hr[247] = function(e, t, r, n) {
                            if (!1 === n.allowUndefined) throw Error("CBOR decode error: undefined values are not supported");
                            return !0 === n.coerceUndefinedToNull ? new ht(ut.null, null, 1) : new ht(ut.undefined, void 0, 1);
                        }, hr[248] = ur("simple values are not supported"), hr[249] = function(e, t, r, n) {
                            return Qt(or(e, t + 1), 3, n);
                        }, hr[250] = function(e, t, r, n) {
                            return Qt(sr(e, t + 1), 5, n);
                        }, hr[251] = function(e, t, r, n) {
                            return Qt(ar(e, t + 1), 9, n);
                        }, hr[252] = cr, hr[253] = cr, hr[254] = cr, hr[255] = function(e, t, r, n) {
                            if (!1 === n.allowIndefinite) throw Error("CBOR decode error: indefinite length items not allowed");
                            return new ht(ut.break, void 0, 1);
                        };
                        const fr = [];
                        for(let e9 = 0; e9 < 24; e9++)fr[e9] = new ht(ut.uint, e9, 1);
                        for(let e10 = -1; e10 >= -24; e10--)fr[31 - e10] = new ht(ut.negint, e10, 1);
                        function dr(e) {
                            switch(e.type){
                                case ut.false:
                                    return bt([
                                        244
                                    ]);
                                case ut.true:
                                    return bt([
                                        245
                                    ]);
                                case ut.null:
                                    return bt([
                                        246
                                    ]);
                                case ut.bytes:
                                    return e.value.length ? void 0 : bt([
                                        64
                                    ]);
                                case ut.string:
                                    return "" === e.value ? bt([
                                        96
                                    ]) : void 0;
                                case ut.array:
                                    return 0 === e.value ? bt([
                                        128
                                    ]) : void 0;
                                case ut.map:
                                    return 0 === e.value ? bt([
                                        160
                                    ]) : void 0;
                                case ut.uint:
                                    return e.value < 24 ? bt([
                                        Number(e.value)
                                    ]) : void 0;
                                case ut.negint:
                                    if (e.value >= -24) return bt([
                                        31 - Number(e.value)
                                    ]);
                            }
                        }
                        fr[64] = new ht(ut.bytes, new Uint8Array(0), 1), fr[96] = new ht(ut.string, "", 1), fr[128] = new ht(ut.array, 0, 1), fr[160] = new ht(ut.map, 0, 1), fr[244] = new ht(ut.false, !1, 1), fr[245] = new ht(ut.true, !0, 1), fr[246] = new ht(ut.null, null, 1);
                        const lr = {
                            float64: !1,
                            mapSorter: function(e, t) {
                                const r = Array.isArray(e[0]) ? e[0][0] : e[0], n = Array.isArray(t[0]) ? t[0][0] : t[0];
                                if (r.type !== n.type) return r.type.compare(n.type);
                                const o = r.type.major, i = wr[o].compareTokens(r, n);
                                return 0 === i && console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone"), i;
                            },
                            quickEncodeToken: dr
                        };
                        function pr() {
                            const e = [];
                            return e[ut.uint.major] = Tt, e[ut.negint.major] = jt, e[ut.bytes.major] = Lt, e[ut.string.major] = Wt, e[ut.array.major] = qt, e[ut.map.major] = Zt, e[ut.tag.major] = Xt, e[ut.float.major] = Yt, e;
                        }
                        const wr = pr(), yr = new Bt;
                        class gr {
                            constructor(e, t){
                                this.obj = e, this.parent = t;
                            }
                            includes(e) {
                                let t = this;
                                do {
                                    if (t.obj === e) return !0;
                                }while (t = t.parent)
                                return !1;
                            }
                            static createCheck(e, t) {
                                if (e && e.includes(t)) throw Error("CBOR encode error: object contains circular references");
                                return new gr(t, e);
                            }
                        }
                        const br = {
                            null: new ht(ut.null, null),
                            undefined: new ht(ut.undefined, void 0),
                            true: new ht(ut.true, !0),
                            false: new ht(ut.false, !1),
                            emptyArray: new ht(ut.array, 0),
                            emptyMap: new ht(ut.map, 0)
                        }, mr = {
                            number: (e, t, r, n)=>Number.isInteger(e) && Number.isSafeInteger(e) ? new ht(e >= 0 ? ut.uint : ut.negint, e) : new ht(ut.float, e),
                            bigint: (e, t, r, n)=>e >= BigInt(0) ? new ht(ut.uint, e) : new ht(ut.negint, e),
                            Uint8Array: (e, t, r, n)=>new ht(ut.bytes, e),
                            string: (e, t, r, n)=>new ht(ut.string, e),
                            boolean: (e, t, r, n)=>e ? br.true : br.false,
                            null: (e, t, r, n)=>br.null,
                            undefined: (e, t, r, n)=>br.undefined,
                            ArrayBuffer: (e, t, r, n)=>new ht(ut.bytes, new Uint8Array(e)),
                            DataView: (e, t, r, n)=>new ht(ut.bytes, new Uint8Array(e.buffer, e.byteOffset, e.byteLength)),
                            Array (e, t, r, n) {
                                if (!e.length) return !0 === r.addBreakTokens ? [
                                    br.emptyArray,
                                    new ht(ut.break)
                                ] : br.emptyArray;
                                n = gr.createCheck(n, e);
                                const o = [];
                                let i = 0;
                                for (const t1 of e)o[i++] = vr(t1, r, n);
                                return r.addBreakTokens ? [
                                    new ht(ut.array, e.length),
                                    o,
                                    new ht(ut.break)
                                ] : [
                                    new ht(ut.array, e.length),
                                    o
                                ];
                            },
                            Object (e, t, r, n) {
                                const o = "Object" !== t, i = o ? e.keys() : Object.keys(e), s = o ? e.size : i.length;
                                if (!s) return !0 === r.addBreakTokens ? [
                                    br.emptyMap,
                                    new ht(ut.break)
                                ] : br.emptyMap;
                                n = gr.createCheck(n, e);
                                const a = [];
                                let c = 0;
                                for (const t1 of i)a[c++] = [
                                    vr(t1, r, n),
                                    vr(o ? e.get(t1) : e[t1], r, n)
                                ];
                                return function(e, t) {
                                    t.mapSorter && e.sort(t.mapSorter);
                                }(a, r), r.addBreakTokens ? [
                                    new ht(ut.map, s),
                                    a,
                                    new ht(ut.break)
                                ] : [
                                    new ht(ut.map, s),
                                    a
                                ];
                            }
                        };
                        mr.Map = mr.Object, mr.Buffer = mr.Uint8Array;
                        for (const e11 of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" "))mr[`${e11}Array`] = mr.DataView;
                        function vr(e, t = {}, r) {
                            const n = ct(e), o = t && t.typeEncoders && t.typeEncoders[n] || mr[n];
                            if ("function" == typeof o) {
                                const i = o(e, n, t, r);
                                if (null != i) return i;
                            }
                            const i1 = mr[n];
                            if (!i1) throw Error(`CBOR encode error: unsupported type: ${n}`);
                            return i1(e, n, t, r);
                        }
                        function xr(e, t, r, n) {
                            if (Array.isArray(t)) for (const o of t)xr(e, o, r, n);
                            else r[t.type.major](e, t, n);
                        }
                        function Er(e, t, r) {
                            const n = vr(e, r);
                            if (!Array.isArray(n) && r.quickEncodeToken) {
                                const e1 = r.quickEncodeToken(n);
                                if (e1) return e1;
                                const o = t[n.type.major];
                                if (o.encodedSize) {
                                    const e2 = o.encodedSize(n, r), t1 = new Bt(e2);
                                    if (o(t1, n, r), 1 !== t1.chunks.length) throw Error(`Unexpected error: pre-calculated length for ${n} was wrong`);
                                    return wt(t1.chunks[0]);
                                }
                            }
                            return yr.reset(), xr(yr, n, t, r), yr.toBytes(!0);
                        }
                        const kr = {
                            strict: !1,
                            allowIndefinite: !0,
                            allowUndefined: !0,
                            allowBigInt: !0
                        };
                        class Sr {
                            constructor(e, t = {}){
                                this.pos = 0, this.data = e, this.options = t;
                            }
                            done() {
                                return this.pos >= this.data.length;
                            }
                            next() {
                                const e = this.data[this.pos];
                                let t = fr[e];
                                if (void 0 === t) {
                                    const r = hr[e];
                                    if (!r) throw Error(`CBOR decode error: no decoder for major type ${e >>> 5} (byte 0x${e.toString(16).padStart(2, "0")})`);
                                    const n = 31 & e;
                                    t = r(this.data, this.pos, n, this.options);
                                }
                                return this.pos += t.encodedLength, t;
                            }
                        }
                        const Br = Symbol.for("DONE"), Ar = Symbol.for("BREAK");
                        function Ir(e, t) {
                            if (e.done()) return Br;
                            const r = e.next();
                            if (r.type === ut.break) return Ar;
                            if (r.type.terminal) return r.value;
                            if (r.type === ut.array) return function(e, t, r) {
                                const n = [];
                                for(let o = 0; o < e.value; o++){
                                    const i = Ir(t, r);
                                    if (i === Ar) {
                                        if (e.value === 1 / 0) break;
                                        throw Error("CBOR decode error: got unexpected break to lengthed array");
                                    }
                                    if (i === Br) throw Error(`CBOR decode error: found array but not enough entries (got ${o}, expected ${e.value})`);
                                    n[o] = i;
                                }
                                return n;
                            }(r, e, t);
                            if (r.type === ut.map) return function(e, t, r) {
                                const n = !0 === r.useMaps, o = n ? void 0 : {}, i = n ? new Map : void 0;
                                for(let s = 0; s < e.value; s++){
                                    const a = Ir(t, r);
                                    if (a === Ar) {
                                        if (e.value === 1 / 0) break;
                                        throw Error("CBOR decode error: got unexpected break to lengthed map");
                                    }
                                    if (a === Br) throw Error(`CBOR decode error: found map but not enough entries (got ${s} [no key], expected ${e.value})`);
                                    if (!0 !== n && "string" != typeof a) throw Error(`CBOR decode error: non-string keys not supported (got ${typeof a})`);
                                    const c = Ir(t, r);
                                    if (c === Br) throw Error(`CBOR decode error: found map but not enough entries (got ${s} [no value], expected ${e.value})`);
                                    n ? i.set(a, c) : o[a] = c;
                                }
                                return n ? i : o;
                            }(r, e, t);
                            if (r.type === ut.tag) {
                                if (t.tags && "function" == typeof t.tags[r.value]) {
                                    const n = Ir(e, t);
                                    return t.tags[r.value](n);
                                }
                                throw Error(`CBOR decode error: tag not supported (${r.value})`);
                            }
                            throw Error("unsupported");
                        }
                        function Cr(e, t) {
                            if (!(e instanceof Uint8Array)) throw Error("CBOR decode error: data to decode must be a Uint8Array");
                            const r = (t = Object.assign({}, kr, t)).tokenizer || new Sr(e, t), n = Ir(r, t);
                            if (n === Br) throw Error("CBOR decode error: did not find any content to decode");
                            if (n === Ar) throw Error("CBOR decode error: got unexpected break");
                            if (!r.done()) throw Error("CBOR decode error: too many terminals, data makes no sense");
                            return n;
                        }
                        const Or = {
                            float64: !0,
                            typeEncoders: {
                                Object: function(e) {
                                    if (e.asCID !== e) return null;
                                    const t = Ee.asCID(e);
                                    if (!t) return null;
                                    const r = new Uint8Array(t.bytes.byteLength + 1);
                                    return r.set(t.bytes, 1), [
                                        new ht(ut.tag, 42),
                                        new ht(ut.bytes, r)
                                    ];
                                },
                                undefined: function() {
                                    throw Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
                                },
                                number: function(e) {
                                    if (Number.isNaN(e)) throw Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
                                    if (e === 1 / 0 || e === -1 / 0) throw Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
                                    return null;
                                }
                            }
                        }, Rr = {
                            allowIndefinite: !1,
                            coerceUndefinedToNull: !0,
                            allowNaN: !1,
                            allowInfinity: !1,
                            allowBigInt: !0,
                            strict: !0,
                            useMaps: !1,
                            tags: []
                        };
                        Rr.tags[42] = function(e) {
                            if (0 !== e[0]) throw Error("Invalid CID for CBOR tag 42; expected leading 0x00");
                            return Ee.decode(e.subarray(1));
                        };
                        const $r = (e)=>{
                            return t = e, r = Or, r = Object.assign({}, lr, r), Er(t, wr, r);
                            var t, r;
                        }, Tr = (e)=>Cr(e, Rr), Ur = new TextEncoder, _r = new TextDecoder, Nr = (e)=>Ur.encode(e);
                        class jr extends Array {
                            constructor(){
                                super(), this.inRecursive = [];
                            }
                            prefix(e) {
                                const t = this.inRecursive[this.inRecursive.length - 1];
                                t && (t.type === ut.array && (t.elements++, 1 !== t.elements && e.push([
                                    44
                                ])), t.type === ut.map && (t.elements++, 1 !== t.elements && (t.elements % 2 == 1 ? e.push([
                                    44
                                ]) : e.push([
                                    58
                                ]))));
                            }
                            [ut.uint.major](e, t) {
                                this.prefix(e);
                                const r = String(t.value), n = [];
                                for(let e1 = 0; e1 < r.length; e1++)n[e1] = r.charCodeAt(e1);
                                e.push(n);
                            }
                            [ut.negint.major](e, t) {
                                this[ut.uint.major](e, t);
                            }
                            [ut.bytes.major](e, t) {
                                throw Error("CBOR encode error: unsupported type: Uint8Array");
                            }
                            [ut.string.major](e, t) {
                                this.prefix(e);
                                const r = gt(JSON.stringify(t.value));
                                e.push(r.length > 32 ? wt(r) : r);
                            }
                            [ut.array.major](e, t) {
                                this.prefix(e), this.inRecursive.push({
                                    type: ut.array,
                                    elements: 0
                                }), e.push([
                                    91
                                ]);
                            }
                            [ut.map.major](e, t) {
                                this.prefix(e), this.inRecursive.push({
                                    type: ut.map,
                                    elements: 0
                                }), e.push([
                                    123
                                ]);
                            }
                            [ut.tag.major](e, t) {}
                            [ut.float.major](e, t) {
                                if ("break" === t.type.name) {
                                    const t1 = this.inRecursive.pop();
                                    if (t1) {
                                        if (t1.type === ut.array) e.push([
                                            93
                                        ]);
                                        else {
                                            if (t1.type !== ut.map) throw Error("Unexpected recursive type; this should not happen!");
                                            e.push([
                                                125
                                            ]);
                                        }
                                        return;
                                    }
                                    throw Error("Unexpected break; this should not happen!");
                                }
                                if (void 0 === t.value) throw Error("CBOR encode error: unsupported type: undefined");
                                if (this.prefix(e), "true" === t.type.name) return void e.push([
                                    116,
                                    114,
                                    117,
                                    101
                                ]);
                                if ("false" === t.type.name) return void e.push([
                                    102,
                                    97,
                                    108,
                                    115,
                                    101
                                ]);
                                if ("null" === t.type.name) return void e.push([
                                    110,
                                    117,
                                    108,
                                    108
                                ]);
                                const r = String(t.value), n = [];
                                let o = !1;
                                for(let e1 = 0; e1 < r.length; e1++)n[e1] = r.charCodeAt(e1), o || 46 !== n[e1] && 101 !== n[e1] && 69 !== n[e1] || (o = !0);
                                o || (n.push(46), n.push(48)), e.push(n);
                            }
                        }
                        const zr = {
                            addBreakTokens: !0,
                            mapSorter: function(e, t) {
                                if (Array.isArray(e[0]) || Array.isArray(t[0])) throw Error("CBOR encode error: complex map keys are not supported");
                                const r = e[0], n = t[0];
                                if (r.type !== ut.string || n.type !== ut.string) throw Error("CBOR encode error: non-string map keys are not supported");
                                if (r < n) return -1;
                                if (r > n) return 1;
                                throw Error("CBOR encode error: unexpected duplicate map keys, this is not supported");
                            }
                        };
                        class Dr {
                            constructor(e, t = {}){
                                this.pos = 0, this.data = e, this.options = t, this.modeStack = [
                                    "value"
                                ], this.lastToken = "";
                            }
                            done() {
                                return this.pos >= this.data.length;
                            }
                            ch() {
                                return this.data[this.pos];
                            }
                            currentMode() {
                                return this.modeStack[this.modeStack.length - 1];
                            }
                            skipWhitespace() {
                                let e = this.ch();
                                for(; 32 === e || 9 === e || 13 === e || 10 === e;)e = this.data[++this.pos];
                            }
                            expect(e) {
                                if (this.data.length - this.pos < e.length) throw Error(`CBOR decode error: unexpected end of input at position ${this.pos}`);
                                for(let t = 0; t < e.length; t++)if (this.data[this.pos++] !== e[t]) throw Error(`CBOR decode error: unexpected token at position ${this.pos}, expected to find '${String.fromCharCode(...e)}'`);
                            }
                            parseNumber() {
                                const e = this.pos;
                                let t = !1, r = !1;
                                const n = (e)=>{
                                    for(; !this.done();){
                                        const t = this.ch();
                                        if (!e.includes(t)) break;
                                        this.pos++;
                                    }
                                };
                                if (45 === this.ch() && (t = !0, this.pos++), 48 === this.ch()) {
                                    if (this.pos++, 46 !== this.ch()) return new ht(ut.uint, 0, this.pos - e);
                                    this.pos++, r = !0;
                                }
                                if (n([
                                    48,
                                    49,
                                    50,
                                    51,
                                    52,
                                    53,
                                    54,
                                    55,
                                    56,
                                    57
                                ]), t && this.pos === e + 1) throw Error(`CBOR decode error: unexpected token at position ${this.pos}`);
                                if (!this.done() && 46 === this.ch()) {
                                    if (r) throw Error(`CBOR decode error: unexpected token at position ${this.pos}`);
                                    r = !0, this.pos++, n([
                                        48,
                                        49,
                                        50,
                                        51,
                                        52,
                                        53,
                                        54,
                                        55,
                                        56,
                                        57
                                    ]);
                                }
                                this.done() || 101 !== this.ch() && 69 !== this.ch() || (r = !0, this.pos++, this.done() || 43 !== this.ch() && 45 !== this.ch() || this.pos++, n([
                                    48,
                                    49,
                                    50,
                                    51,
                                    52,
                                    53,
                                    54,
                                    55,
                                    56,
                                    57
                                ]));
                                const o = String.fromCharCode.apply(null, this.data.subarray(e, this.pos)), i = parseFloat(o);
                                return r ? new ht(ut.float, i, this.pos - e) : !0 !== this.options.allowBigInt || Number.isSafeInteger(i) ? new ht(i >= 0 ? ut.uint : ut.negint, i, this.pos - e) : new ht(i >= 0 ? ut.uint : ut.negint, BigInt(o), this.pos - e);
                            }
                            parseString() {
                                if (34 !== this.ch()) throw Error(`CBOR decode error: unexpected character at position ${this.pos}; this shouldn't happen`);
                                this.pos++;
                                for(let e = this.pos, t = 0; e < this.data.length && t < 65536; e++, t++){
                                    const r = this.data[e];
                                    if (92 === r || r < 32 || r >= 128) break;
                                    if (34 === r) {
                                        const r1 = String.fromCharCode.apply(null, this.data.subarray(this.pos, e));
                                        return this.pos = e + 1, new ht(ut.string, r1, t);
                                    }
                                }
                                const e1 = this.pos, t1 = [], r2 = ()=>{
                                    if (this.pos + 4 >= this.data.length) throw Error(`CBOR decode error: unexpected end of unicode escape sequence at position ${this.pos}`);
                                    let e = 0;
                                    for(let t = 0; t < 4; t++){
                                        let t1 = this.ch();
                                        if (t1 >= 48 && t1 <= 57) t1 -= 48;
                                        else if (t1 >= 97 && t1 <= 102) t1 = t1 - 97 + 10;
                                        else {
                                            if (!(t1 >= 65 && t1 <= 70)) throw Error(`CBOR decode error: unexpected unicode escape character at position ${this.pos}`);
                                            t1 = t1 - 65 + 10;
                                        }
                                        e = 16 * e + t1, this.pos++;
                                    }
                                    return e;
                                }, n = ()=>{
                                    const e = this.ch();
                                    let r, n, o, i, s = null, a = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                                    if (this.pos + a > this.data.length) throw Error(`CBOR decode error: unexpected unicode sequence at position ${this.pos}`);
                                    switch(a){
                                        case 1:
                                            e < 128 && (s = e);
                                            break;
                                        case 2:
                                            r = this.data[this.pos + 1], 128 == (192 & r) && (i = (31 & e) << 6 | 63 & r, i > 127 && (s = i));
                                            break;
                                        case 3:
                                            r = this.data[this.pos + 1], n = this.data[this.pos + 2], 128 == (192 & r) && 128 == (192 & n) && (i = (15 & e) << 12 | (63 & r) << 6 | 63 & n, i > 2047 && (i < 55296 || i > 57343) && (s = i));
                                            break;
                                        case 4:
                                            r = this.data[this.pos + 1], n = this.data[this.pos + 2], o = this.data[this.pos + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & o) && (i = (15 & e) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & o, i > 65535 && i < 1114112 && (s = i));
                                    }
                                    null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, t1.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), t1.push(s), this.pos += a;
                                };
                                for(; !this.done();){
                                    const o = this.ch();
                                    let i;
                                    switch(o){
                                        case 92:
                                            if (this.pos++, this.done()) throw Error(`CBOR decode error: unexpected string termination at position ${this.pos}`);
                                            switch(i = this.ch(), this.pos++, i){
                                                case 34:
                                                case 39:
                                                case 92:
                                                case 47:
                                                    t1.push(i);
                                                    break;
                                                case 98:
                                                    t1.push(8);
                                                    break;
                                                case 116:
                                                    t1.push(9);
                                                    break;
                                                case 110:
                                                    t1.push(10);
                                                    break;
                                                case 102:
                                                    t1.push(12);
                                                    break;
                                                case 114:
                                                    t1.push(13);
                                                    break;
                                                case 117:
                                                    t1.push(r2());
                                                    break;
                                                default:
                                                    throw Error(`CBOR decode error: unexpected string escape character at position ${this.pos}`);
                                            }
                                            break;
                                        case 34:
                                            return this.pos++, new ht(ut.string, St(t1), this.pos - e1);
                                        default:
                                            if (o < 32) throw Error(`CBOR decode error: invalid control character at position ${this.pos}`);
                                            o < 128 ? (t1.push(o), this.pos++) : n();
                                    }
                                }
                                throw Error(`CBOR decode error: unexpected end of string at position ${this.pos}`);
                            }
                            parseValue() {
                                switch(this.ch()){
                                    case 123:
                                        return this.modeStack.push("obj-start"), this.pos++, new ht(ut.map, 1 / 0, 1);
                                    case 91:
                                        return this.modeStack.push("array-start"), this.pos++, new ht(ut.array, 1 / 0, 1);
                                    case 34:
                                        return this.parseString();
                                    case 110:
                                        return this.expect([
                                            110,
                                            117,
                                            108,
                                            108
                                        ]), new ht(ut.null, null, 4);
                                    case 102:
                                        return this.expect([
                                            102,
                                            97,
                                            108,
                                            115,
                                            101
                                        ]), new ht(ut.false, !1, 5);
                                    case 116:
                                        return this.expect([
                                            116,
                                            114,
                                            117,
                                            101
                                        ]), new ht(ut.true, !0, 4);
                                    case 45:
                                    case 48:
                                    case 49:
                                    case 50:
                                    case 51:
                                    case 52:
                                    case 53:
                                    case 54:
                                    case 55:
                                    case 56:
                                    case 57:
                                        return this.parseNumber();
                                    default:
                                        throw Error(`CBOR decode error: unexpected character at position ${this.pos}`);
                                }
                            }
                            next() {
                                switch(this.skipWhitespace(), this.currentMode()){
                                    case "value":
                                        return this.modeStack.pop(), this.parseValue();
                                    case "array-value":
                                        if (this.modeStack.pop(), 93 === this.ch()) return this.pos++, this.skipWhitespace(), new ht(ut.break, void 0, 1);
                                        if (44 !== this.ch()) throw Error(`CBOR decode error: unexpected character at position ${this.pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
                                        return this.pos++, this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue();
                                    case "array-start":
                                        return this.modeStack.pop(), 93 === this.ch() ? (this.pos++, this.skipWhitespace(), new ht(ut.break, void 0, 1)) : (this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue());
                                    case "obj-key":
                                        if (125 === this.ch()) return this.modeStack.pop(), this.pos++, this.skipWhitespace(), new ht(ut.break, void 0, 1);
                                        if (44 !== this.ch()) throw Error(`CBOR decode error: unexpected character at position ${this.pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
                                        this.pos++, this.skipWhitespace();
                                    case "obj-start":
                                        {
                                            if (this.modeStack.pop(), 125 === this.ch()) return this.pos++, this.skipWhitespace(), new ht(ut.break, void 0, 1);
                                            const e = this.parseString();
                                            if (this.skipWhitespace(), 58 !== this.ch()) throw Error(`CBOR decode error: unexpected character at position ${this.pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
                                            return this.pos++, this.modeStack.push("obj-value"), e;
                                        }
                                    case "obj-value":
                                        return this.modeStack.pop(), this.modeStack.push("obj-key"), this.skipWhitespace(), this.parseValue();
                                    default:
                                        throw Error(`CBOR decode error: unexpected parse state at position ${this.pos}; this shouldn't happen`);
                                }
                            }
                        }
                        function Pr(e) {
                            const t = Ke.encode(e).slice(1);
                            return [
                                new ht(ut.map, 1 / 0, 1),
                                new ht(ut.string, "/", 1),
                                new ht(ut.map, 1 / 0, 1),
                                new ht(ut.string, "bytes", 5),
                                new ht(ut.string, t, t.length),
                                new ht(ut.break, void 0, 1),
                                new ht(ut.break, void 0, 1)
                            ];
                        }
                        const Lr = {
                            typeEncoders: {
                                Object: function(e) {
                                    if (e.asCID !== e) return null;
                                    const t = Ee.asCID(e);
                                    if (!t) return null;
                                    const r = t.toString();
                                    return [
                                        new ht(ut.map, 1 / 0, 1),
                                        new ht(ut.string, "/", 1),
                                        new ht(ut.string, r, r.length),
                                        new ht(ut.break, void 0, 1)
                                    ];
                                },
                                Uint8Array: Pr,
                                Buffer: Pr,
                                undefined: function() {
                                    throw Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
                                },
                                number: function(e) {
                                    if (Number.isNaN(e)) throw Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
                                    if (e === 1 / 0 || e === -1 / 0) throw Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
                                    return null;
                                }
                            }
                        };
                        class Mr extends Dr {
                            constructor(e, t){
                                super(e, t), this.tokenBuffer = [];
                            }
                            done() {
                                return 0 === this.tokenBuffer.length && super.done();
                            }
                            _next() {
                                return this.tokenBuffer.length > 0 ? this.tokenBuffer.pop() : super.next();
                            }
                            next() {
                                const e = this._next();
                                if (e.type === ut.map) {
                                    const e1 = this._next();
                                    if (e1.type === ut.string && "/" === e1.value) {
                                        const e2 = this._next();
                                        if (e2.type === ut.string) {
                                            if (this._next().type !== ut.break) throw Error("Invalid encoded CID form");
                                            return this.tokenBuffer.push(e2), new ht(ut.tag, 42, 0);
                                        }
                                        if (e2.type === ut.map) {
                                            const e3 = this._next();
                                            if (e3.type === ut.string && "bytes" === e3.value) {
                                                const e4 = this._next();
                                                if (e4.type === ut.string) {
                                                    for(let e5 = 0; e5 < 2; e5++)if (this._next().type !== ut.break) throw Error("Invalid encoded Bytes form");
                                                    const t = Ke.decode(`m${e4.value}`);
                                                    return new ht(ut.bytes, t, e4.value.length);
                                                }
                                                this.tokenBuffer.push(e4);
                                            }
                                            this.tokenBuffer.push(e3);
                                        }
                                        this.tokenBuffer.push(e2);
                                    }
                                    this.tokenBuffer.push(e1);
                                }
                                return e;
                            }
                        }
                        const Vr = {
                            allowIndefinite: !1,
                            allowUndefined: !1,
                            allowNaN: !1,
                            allowInfinity: !1,
                            allowBigInt: !0,
                            strict: !0,
                            useMaps: !1,
                            tags: []
                        };
                        Vr.tags[42] = Ee.parse;
                        const Wr = (e)=>{
                            return t = e, r = Lr, r = Object.assign({}, zr, r), Er(t, new jr, r);
                            var t, r;
                        }, Fr = (e)=>(function(e, t) {
                                return Cr(e, t = Object.assign({
                                    tokenizer: new Dr(e, t)
                                }, t));
                            })(e, Object.assign(Vr, {
                                tokenizer: new Mr(e, Vr)
                            })), Hr = se, qr = (e)=>ae(0, Hr(e)), Jr = (e)=>{
                            const { ucv: t , alg: r , typ: n  } = Fr(Qe.baseDecode(e));
                            return pn(n), wn(r), {
                                version: dn(t, "ucv")
                            };
                        }, Gr = (e)=>{
                            const t = Fr(Qe.baseDecode(e));
                            return {
                                issuer: un(t.iss, "iss"),
                                audience: un(t.aud, "aud"),
                                expiration: Zr(t.exp, "exp"),
                                nonce: hn(t.nnc, "nnc"),
                                notBefore: fn(t.nbf, "nbf"),
                                facts: nn(t.fct, sn, "fct") || [],
                                proofs: an(t.prf, "prf"),
                                capabilities: Xr(t.att, "att")
                            };
                        }, Zr = (e, t)=>Number.isInteger(e) ? e : yn.throw(`Expected integer but instead got '${t}: ${JSON.stringify(e)}'`), Kr = (e, t)=>on(e, Qr, t), Xr = (e, t)=>rn(e, Kr, t), Qr = (e)=>{
                            const t = {
                                ...e,
                                can: Yr(e.can),
                                with: en(e.with)
                            }, r = t.with;
                            return r.endsWith("*") && "*" !== t.can && (r.startsWith("my:") || r.startsWith("as:did:")) ? yn.throw(`Capability has invalid 'can: ${JSON.stringify(e.can)}', for all 'my:*' or 'as:<did>:*' it must be '*'.`) : t;
                        }, Yr = (e)=>"string" != typeof e ? yn.throw(`Capability has invalid 'can: ${JSON.stringify(e)}', value must be a string`) : e.slice(1, -1).includes("/") ? e.toLocaleLowerCase() : "*" === e ? e : yn.throw(`Capability has invalid 'can: "${e}"', value must have at least one path segment`), en = (e)=>"string" != typeof e ? yn.throw(`Capability has invalid 'with: ${JSON.stringify(e)}', value must be a string`) : tn(e) || yn.throw(`Capability has invalid 'with: "${e}"', value must be a valid URI string`), tn = (e)=>{
                            try {
                                return new URL(e), e;
                            } catch (e1) {
                                return null;
                            }
                        }, rn = (e, t, r)=>Array.isArray(e) ? e.map((e, n)=>t(e, `${r}[${n}]`)) : yn.throw(`${r} must be an array`), nn = (e, t, r)=>void 0 === e ? e : rn(e, t, r), on = (e, t, r)=>null != e && "object" == typeof e ? t(e) : yn.throw(`${r} must be of type object, instead got ${e}`), sn = (e, t)=>on(e, Object, t), an = (e, t)=>Array.isArray(e) ? rn(e, cn, t) : [
                                cn(e, t)
                            ], cn = (e, t)=>{
                            const r = "string" == typeof e ? e : yn.throw(`${t} has invalid value ${JSON.stringify(e)}, must be a string`);
                            try {
                                return Ee.parse(r);
                            } catch (e1) {
                                return Ee.create(1, 85, qr(Nr(r)));
                            }
                        }, un = (e, t)=>"string" == typeof e && e.startsWith("did:") ? De(e) : yn.throw(`DID has invalid representation '${t}: ${JSON.stringify(e)}'`), hn = (e, t = "Field")=>{
                            switch(typeof e){
                                case "string":
                                case "undefined":
                                    return e;
                                default:
                                    return yn.throw(`${t} has invalid value ${e}`);
                            }
                        }, fn = (e, t)=>{
                            switch(typeof e){
                                case "undefined":
                                    return;
                                case "number":
                                    return Zr(e, t);
                                default:
                                    return yn.throw(`${t} has invalid value ${JSON.stringify(e)}`);
                            }
                        }, dn = (e, t)=>/\d+\.\d+\.\d+/.test(e) ? e : yn.throw(`Invalid version '${t}: ${JSON.stringify(e)}'`), ln = (e, t)=>e instanceof Uint8Array ? e : yn.throw(`${t} must be Uint8Array, instead got ${JSON.stringify(e)}`), pn = (e)=>"JWT" === e ? e : yn.throw(`Header has invalid type 'typ: "${e}"'`), wn = (e)=>{
                            switch(e){
                                case "EdDSA":
                                    return 237;
                                case "RS256":
                                    return 4613;
                                default:
                                    return yn.throw(`Header has invalid algorithm 'alg: ${JSON.stringify(e)}'`);
                            }
                        };
                        class yn extends TypeError {
                            get name() {
                                return "ParseError";
                            }
                            static throw(e) {
                                throw new this(e);
                            }
                        }
                        class gn {
                            constructor(e){
                                this.model = e;
                            }
                            get version() {
                                return this.model.version;
                            }
                            get issuer() {
                                return Ve(this.model.issuer);
                            }
                            get audience() {
                                return Ve(this.model.audience);
                            }
                            get capabilities() {
                                return this.model.capabilities;
                            }
                            get expiration() {
                                return this.model.expiration;
                            }
                            get notBefore() {
                                return this.model.notBefore;
                            }
                            get nonce() {
                                return this.model.nonce;
                            }
                            get facts() {
                                return this.model.facts;
                            }
                            get proofs() {
                                return this.model.proofs;
                            }
                            get signature() {
                                return this.model.signature;
                            }
                        }
                        class bn extends Uint8Array {
                            constructor(e, { buffer: t , byteOffset: r = 0 , byteLength: n = t.byteLength  }){
                                super(t, r, n), this.model = e;
                            }
                            get version() {
                                return this.model.version;
                            }
                            get issuer() {
                                return Ve(this.model.issuer);
                            }
                            get audience() {
                                return Ve(this.model.audience);
                            }
                            get capabilities() {
                                return this.model.capabilities;
                            }
                            get expiration() {
                                return this.model.expiration;
                            }
                            get notBefore() {
                                return this.model.notBefore;
                            }
                            get nonce() {
                                return this.model.nonce;
                            }
                            get facts() {
                                return this.model.facts;
                            }
                            get proofs() {
                                return this.model.proofs;
                            }
                            get signature() {
                                return this.model.signature;
                            }
                        }
                        const mn = (e)=>new gn(e), vn = (e)=>{
                            const { facts: t , nonce: r , notBefore: n , ...o } = xn(e);
                            return $r({
                                ...o,
                                ...t.length > 0 && {
                                    facts: t
                                },
                                ...e.nonce && {
                                    nonce: r
                                },
                                ...e.notBefore && {
                                    notBefore: e.notBefore
                                },
                                signature: ln(e.signature, "signature")
                            });
                        }, xn = (e)=>({
                                version: dn(e.version, "version"),
                                issuer: kn(e.issuer, "issuer"),
                                audience: kn(e.audience, "audience"),
                                capabilities: Xr(e.capabilities, "capabilities"),
                                expiration: Zr(e.expiration, "expiration"),
                                proofs: nn(e.proofs, En, "proofs") || [],
                                signature: ln(e.signature, "signature"),
                                nonce: hn(e.nonce, "nonce"),
                                facts: nn(e.facts, sn, "facts") || [],
                                notBefore: fn(e.notBefore, "notBefore")
                            }), En = (e, t)=>Ee.asCID(e) || yn.throw(`Expected ${t} to be CID, instead got ${JSON.stringify(e)}`), kn = (e, t)=>e instanceof Uint8Array ? Le(e) : yn.throw(`Expected ${t} to be Uint8Array, instead got ${JSON.stringify(e)}`), Sn = (e)=>Qe.baseEncode(In(e)), Bn = (e)=>Qe.baseEncode(Cn(e)), An = (e)=>Qe.baseEncode(e), In = (e)=>Wr({
                                alg: Rn(e),
                                ucv: e.version,
                                typ: "JWT"
                            }), Cn = (e)=>Wr({
                                iss: Pe(e.issuer),
                                aud: Pe(e.audience),
                                att: e.capabilities,
                                exp: e.expiration,
                                prf: e.proofs.map(On),
                                ...e.facts.length > 0 && {
                                    fct: e.facts
                                },
                                ...e.nonce && {
                                    nnc: e.nonce
                                },
                                ...e.notBefore && {
                                    nbf: e.notBefore
                                }
                            }), On = (e)=>e.toString(), Rn = (e)=>{
                            switch(ze(e.issuer)){
                                case 237:
                                    return "EdDSA";
                                case 4613:
                                    return "RS256";
                                default:
                                    throw RangeError(`Unknown KeyType "${ze(e.issuer)}"`);
                            }
                        }, $n = (e)=>async (t)=>new Uint8Array(await crypto.subtle.digest(e, t)), Tn = _e({
                            name: "sha2-256",
                            code: 18,
                            encode: $n("SHA-256")
                        });
                        _e({
                            name: "sha2-512",
                            code: 19,
                            encode: $n("SHA-512")
                        });
                        const Un = (e)=>{
                            try {
                                return ((e)=>mn(xn(Tr(e))))(e);
                            } catch (t) {
                                const r = ((e)=>_r.decode(e))(e);
                                return Nn(r);
                            }
                        }, _n = async (e, t)=>{
                            const r = t?.hasher || Tn, [n, o] = e instanceof Uint8Array ? [
                                85,
                                (i = e, new Uint8Array(i.buffer, i.byteOffset, i.byteLength))
                            ] : [
                                113,
                                vn(e)
                            ];
                            var i;
                            return {
                                cid: Ee.createV1(n, await r.digest(o)),
                                bytes: o,
                                data: e
                            };
                        }, Nn = (e)=>{
                            const t = ((e)=>{
                                const t = e.split("."), [r, n, o] = 3 === t.length ? t : yn.throw(`Can't parse UCAN: ${e}: Expected JWT format: 3 dot-separated base64url-encoded values.`);
                                return {
                                    ...Jr(r),
                                    ...Gr(n),
                                    signature: Qe.baseDecode(o)
                                };
                            })(e);
                            return ((e)=>`${Sn(e)}.${Bn(e)}.${An(e.signature)}`)(t) === e ? mn(t) : ((e, t)=>new bn(e, t))(t, Nr(e));
                        }, jn = async ({ issuer: e , audience: t , capabilities: r , lifetimeInSeconds: n = 30 , expiration: o = Math.floor(Date.now() / 1e3) + n , notBefore: i , facts: s = [] , proofs: a = [] , nonce: c  })=>{
                            const u = xn({
                                version: "0.8.1",
                                issuer: zn(e, "issuer"),
                                audience: zn(t, "audience"),
                                capabilities: r,
                                facts: s,
                                expiration: o,
                                notBefore: i,
                                proofs: a,
                                nonce: c,
                                signature: Dn
                            }), h = Nr(`${Sn(f = u)}.${Bn(f)}`);
                            var f;
                            const d = await e.sign(h);
                            return mn({
                                ...u,
                                signature: d
                            });
                        }, zn = (e, t)=>e && "function" == typeof e.did ? un(e.did(), `${t}.did()`) : yn.throw(`The ${t}.did() must be a function that returns DID`), Dn = new Uint8Array;
                        var Pn = globalThis.fetch;
                        function Ln(e) {
                            return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
                        }
                        var Mn = {
                            exports: {}
                        }, Vn = {};
                        function Wn(e, t) {
                            "boolean" == typeof t && (t = {
                                forever: t
                            }), this._originalTimeouts = JSON.parse(JSON.stringify(e)), this._timeouts = e, this._options = t || {}, this._maxRetryTime = t && t.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
                        }
                        var Fn = Wn;
                        Wn.prototype.reset = function() {
                            this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0);
                        }, Wn.prototype.stop = function() {
                            this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), this._timeouts = [], this._cachedTimeouts = null;
                        }, Wn.prototype.retry = function(e) {
                            if (this._timeout && clearTimeout(this._timeout), !e) return !1;
                            var t = (new Date).getTime();
                            if (e && t - this._operationStart >= this._maxRetryTime) return this._errors.push(e), this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
                            this._errors.push(e);
                            var r = this._timeouts.shift();
                            if (void 0 === r) {
                                if (!this._cachedTimeouts) return !1;
                                this._errors.splice(0, this._errors.length - 1), r = this._cachedTimeouts.slice(-1);
                            }
                            var n = this;
                            return this._timer = setTimeout(function() {
                                n._attempts++, n._operationTimeoutCb && (n._timeout = setTimeout(function() {
                                    n._operationTimeoutCb(n._attempts);
                                }, n._operationTimeout), n._options.unref && n._timeout.unref()), n._fn(n._attempts);
                            }, r), this._options.unref && this._timer.unref(), !0;
                        }, Wn.prototype.attempt = function(e, t) {
                            this._fn = e, t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
                            var r = this;
                            this._operationTimeoutCb && (this._timeout = setTimeout(function() {
                                r._operationTimeoutCb();
                            }, r._operationTimeout)), this._operationStart = (new Date).getTime(), this._fn(this._attempts);
                        }, Wn.prototype.try = function(e) {
                            console.log("Using RetryOperation.try() is deprecated"), this.attempt(e);
                        }, Wn.prototype.start = function(e) {
                            console.log("Using RetryOperation.start() is deprecated"), this.attempt(e);
                        }, Wn.prototype.start = Wn.prototype.try, Wn.prototype.errors = function() {
                            return this._errors;
                        }, Wn.prototype.attempts = function() {
                            return this._attempts;
                        }, Wn.prototype.mainError = function() {
                            if (0 === this._errors.length) return null;
                            for(var e = {}, t = null, r = 0, n = 0; n < this._errors.length; n++){
                                var o = this._errors[n], i = o.message, s = (e[i] || 0) + 1;
                                e[i] = s, s >= r && (t = o, r = s);
                            }
                            return t;
                        }, function(e) {
                            var t = Fn;
                            e.operation = function(r) {
                                var n = e.timeouts(r);
                                return new t(n, {
                                    forever: r && (r.forever || r.retries === 1 / 0),
                                    unref: r && r.unref,
                                    maxRetryTime: r && r.maxRetryTime
                                });
                            }, e.timeouts = function(e) {
                                if (e instanceof Array) return [].concat(e);
                                var t = {
                                    retries: 10,
                                    factor: 2,
                                    minTimeout: 1e3,
                                    maxTimeout: 1 / 0,
                                    randomize: !1
                                };
                                for(var r in e)t[r] = e[r];
                                if (t.minTimeout > t.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
                                for(var n = [], o = 0; o < t.retries; o++)n.push(this.createTimeout(o, t));
                                return e && e.forever && !n.length && n.push(this.createTimeout(o, t)), n.sort(function(e, t) {
                                    return e - t;
                                }), n;
                            }, e.createTimeout = function(e, t) {
                                var r = t.randomize ? Math.random() + 1 : 1, n = Math.round(r * Math.max(t.minTimeout, 1) * Math.pow(t.factor, e));
                                return Math.min(n, t.maxTimeout);
                            }, e.wrap = function(t, r, n) {
                                if (r instanceof Array && (n = r, r = null), !n) for(var o in n = [], t)"function" == typeof t[o] && n.push(o);
                                for(var i = 0; i < n.length; i++){
                                    var s = n[i], a = t[s];
                                    t[s] = (function(n) {
                                        var o = e.operation(r), i = Array.prototype.slice.call(arguments, 1), s = i.pop();
                                        i.push(function(e) {
                                            o.retry(e) || (e && (arguments[0] = o.mainError()), s.apply(this, arguments));
                                        }), o.attempt(function() {
                                            n.apply(t, i);
                                        });
                                    }).bind(t, a), t[s].options = r;
                                }
                            };
                        }(Vn), function(e) {
                            e.exports = Vn;
                        }(Mn);
                        var Hn = Ln(Mn.exports);
                        const qn = new Set([
                            "Failed to fetch",
                            "NetworkError when attempting to fetch resource.",
                            "The Internet connection appears to be offline.",
                            "Network request failed"
                        ]);
                        class Jn extends Error {
                            constructor(e){
                                super(), e instanceof Error ? (this.originalError = e, { message: e  } = e) : (this.originalError = Error(e), this.originalError.stack = this.stack), this.name = "AbortError", this.message = e;
                            }
                        }
                        const Gn = (e)=>void 0 === globalThis.DOMException ? Error(e) : new DOMException(e);
                        async function Zn(e, t) {
                            return new Promise((r, n)=>{
                                t = {
                                    onFailedAttempt () {},
                                    retries: 10,
                                    ...t
                                };
                                const o = Hn.operation(t);
                                o.attempt(async (i)=>{
                                    try {
                                        r(await e(i));
                                    } catch (e2) {
                                        if (!(e2 instanceof Error)) return void n(TypeError(`Non-error was thrown: "${e2}". You should only throw errors.`));
                                        if (e2 instanceof Jn) o.stop(), n(e2.originalError);
                                        else if (e2 instanceof TypeError && (s = e2.message, !qn.has(s))) o.stop(), n(e2);
                                        else {
                                            ((e, t, r)=>{
                                                const n = r.retries - (t - 1);
                                                e.attemptNumber = t, e.retriesLeft = n;
                                            })(e2, i, t);
                                            try {
                                                await t.onFailedAttempt(e2);
                                            } catch (e1) {
                                                return void n(e1);
                                            }
                                            o.retry(e2) || n(o.mainError());
                                        }
                                    }
                                    var s;
                                }), t.signal && !t.signal.aborted && t.signal.addEventListener("abort", ()=>{
                                    o.stop();
                                    const e = void 0 === t.signal.reason ? Gn("The operation was aborted.") : t.signal.reason;
                                    n(e instanceof Error ? e : Gn(e));
                                }, {
                                    once: !0
                                });
                            });
                        }
                        const Kn = (e, t)=>Ee.createV1(e, t), Xn = Ee.asCID;
                        Ee.parse, Ee.decode;
                        const Qn = (e)=>{
                            return !(null != (t = e) && t.asCID === t);
                            var t;
                        };
                        class Yn {
                            constructor(e, t = new Map){
                                this.root = e, this.blocks = t, Object.defineProperties(this, {
                                    blocks: {
                                        enumerable: !1
                                    }
                                });
                            }
                            get version() {
                                return this.data.version;
                            }
                            get signature() {
                                return this.data.signature;
                            }
                            get cid() {
                                return this.root.cid;
                            }
                            get asCID() {
                                return this.cid;
                            }
                            get bytes() {
                                return this.root.bytes;
                            }
                            get data() {
                                const e = ro(this.root);
                                return Object.defineProperties(this, {
                                    data: {
                                        value: e,
                                        enumerable: !1
                                    }
                                }), e;
                            }
                            export() {
                                return oo(this.root, this.blocks);
                            }
                            get proofs() {
                                return so(this);
                            }
                            get issuer() {
                                return this.data.issuer;
                            }
                            get audience() {
                                return this.data.audience;
                            }
                            get capabilities() {
                                return this.data.capabilities;
                            }
                            get expiration() {
                                return this.data.expiration;
                            }
                            get notBefore() {
                                return this.data.notBefore;
                            }
                            get nonce() {
                                return this.data.nonce;
                            }
                            get facts() {
                                return this.data.facts;
                            }
                            iterate() {
                                return eo(this);
                            }
                        }
                        const eo = function*(e) {
                            for (const t of e.proofs)Qn(t) && (yield* eo(t), yield t);
                        }, to = new WeakMap, ro = ({ bytes: e  })=>{
                            const t = to.get(e);
                            if (!t) {
                                const t1 = Un(e);
                                return to.set(e, t1), t1;
                            }
                            return t;
                        }, no = async ({ issuer: e , audience: t , proofs: r = [] , ...n }, o)=>{
                            const i = [], s = new Map;
                            for (const e1 of r)if (Qn(e1)) {
                                i.push(e1.cid);
                                for (const t1 of e1.export())s.set(t1.cid.toString(), t1);
                            } else i.push(e1);
                            const a = await jn({
                                ...n,
                                issuer: e,
                                audience: t,
                                proofs: i
                            }), { cid: c , bytes: u  } = await _n(a, o);
                            to.set(c, a);
                            const h = new Yn({
                                cid: c,
                                bytes: u
                            }, s);
                            return Object.defineProperties(h, {
                                proofs: {
                                    value: r
                                }
                            }), h;
                        }, oo = function*(e, t) {
                            for (const r of ro(e).proofs){
                                const e1 = t.get(r.toString());
                                e1 && (yield* oo(e1, t));
                            }
                            yield e;
                        }, io = ({ root: e , blocks: t  })=>new Yn(e, t), so = (e)=>{
                            const t = [], { root: r , blocks: n  } = e;
                            for (const e1 of ro(r).proofs){
                                const r1 = n.get(e1.toString());
                                t.push(r1 ? io({
                                    root: r1,
                                    blocks: n
                                }) : e1);
                            }
                            return Object.defineProperty(e, "proofs", {
                                value: t
                            }), t;
                        };
                        class ao {
                            constructor({ issuer: e , audience: t , capability: r , proofs: n = [] , expiration: o , lifetimeInSeconds: i , notBefore: s , nonce: a , facts: c = []  }){
                                this.issuer = e, this.audience = t, this.proofs = n, this.capabilities = [
                                    r
                                ], this.expiration = o, this.lifetimeInSeconds = i, this.notBefore = s, this.nonce = a, this.facts = c;
                            }
                            delegate() {
                                return no(this);
                            }
                            async execute(e) {
                                const [t] = await e.execute(this);
                                return t;
                            }
                        }
                        const co = (e)=>Object.entries(e), uo = (e, t)=>{
                            const [r, n] = e.length < t.length ? [
                                new Set(e),
                                new Set(t)
                            ] : [
                                new Set(t),
                                new Set(e)
                            ];
                            for (const e1 of r)n.has(e1) || r.delete(e1);
                            return [
                                ...r
                            ];
                        };
                        class ho extends Error {
                            get error() {
                                return !0;
                            }
                            describe() {
                                return this.name;
                            }
                            get message() {
                                return this.describe();
                            }
                            toJSON() {
                                const { error: e , name: t , message: r  } = this;
                                return {
                                    error: e,
                                    name: t,
                                    message: r
                                };
                            }
                        }
                        class fo extends ho {
                            constructor(e, t, r){
                                super(), this.claimed = e, this.delegated = t, this.cause = r, this.name = "EscalatedCapability";
                            }
                            describe() {
                                return `Constraint violation: ${this.cause.message}`;
                            }
                        }
                        class lo extends ho {
                            constructor(e, t){
                                super(), this.name = "InvalidClaim", this.causes = e, this.context = t;
                            }
                            describe() {
                                return [
                                    `Can not derive ${this.context} from delegated capabilities:`,
                                    ...this.causes.map((e)=>go(e.message))
                                ].join("\n");
                            }
                            get cause() {
                                if (1 !== this.causes.length) return this;
                                {
                                    const [e] = this.causes, t = "InvalidClaim" === e.name ? e.cause : e;
                                    return Object.defineProperties(this, {
                                        cause: {
                                            value: t
                                        }
                                    }), t;
                                }
                            }
                        }
                        class po extends ho {
                            constructor(e, t){
                                super(), this.name = "MalformedCapability", this.capability = e, this.cause = t;
                            }
                            describe() {
                                return [
                                    `Encountered malformed '${this.capability.can}' capability: ${yo(this.capability)}`,
                                    go(this.cause.message)
                                ].join("\n");
                            }
                        }
                        class wo extends ho {
                            constructor(e){
                                super(), this.name = "UnknownCapability", this.capability = e;
                            }
                            describe() {
                                return `Encountered unknown capability: ${yo(this.capability)}`;
                            }
                        }
                        const yo = (e, t)=>JSON.stringify(e, (e, t)=>t && t.asCID === t ? t.toString() : t, t), go = (e)=>((e, t = "  ")=>`${t}${e.split("\n").join(`\n${t}`)}`)(`- ${e}`), bo = (e)=>new xo(e);
                        class mo {
                            match(e) {
                                return new wo(e.capability);
                            }
                            select(e) {
                                return Ro(this, e);
                            }
                            derive({ derives: e , to: t  }) {
                                return (({ from: e , to: t , derives: r  })=>new So(e, t, r))({
                                    derives: e,
                                    to: t,
                                    from: this
                                });
                            }
                        }
                        class vo extends mo {
                            or(e) {
                                return new Eo(this, e);
                            }
                            and(e) {
                                return ((...e)=>new ko(e))(this, e);
                            }
                        }
                        class xo extends vo {
                            constructor(e){
                                super(), this.descriptor = {
                                    derives: To,
                                    ...e
                                };
                            }
                            create(e) {
                                const { descriptor: t , can: r  } = this, n = t.caveats, o = e.caveats || {}, i = t.with.decode(e.with);
                                if (i.error) throw Object.assign(Error(`Invalid 'with' - ${i.message}`), {
                                    cause: i
                                });
                                const s = {};
                                for (const [e1, t1] of Object.entries(n || {})){
                                    const r1 = e1, n1 = t1.decode(o[r1]);
                                    if (n1?.error) throw Object.assign(Error(`Invalid 'caveats.${r1}' - ${n1.message}`), {
                                        cause: n1
                                    });
                                    void 0 !== n1 && (s[e1] = n1);
                                }
                                return {
                                    ...s,
                                    can: r,
                                    with: i.href
                                };
                            }
                            invoke({ with: e , caveats: t , ...r }) {
                                return ((e)=>new ao(e))({
                                    ...r,
                                    capability: this.create({
                                        with: e,
                                        caveats: t
                                    })
                                });
                            }
                            get can() {
                                return this.descriptor.can;
                            }
                            match(e) {
                                const t = Co(this, e);
                                return t.error ? t : new Bo(e, t, this.descriptor);
                            }
                            toString() {
                                return JSON.stringify({
                                    can: this.descriptor.can
                                });
                            }
                        }
                        class Eo extends vo {
                            constructor(e, t){
                                super(), this.left = e, this.right = t;
                            }
                            match(e) {
                                const t = this.left.match(e);
                                if (t.error) {
                                    const r = this.right.match(e);
                                    return r.error ? "MalformedCapability" === r.name ? r : t : r;
                                }
                                return t;
                            }
                            toString() {
                                return `${this.left.toString()}|${this.right.toString()}`;
                            }
                        }
                        class ko extends mo {
                            constructor(e){
                                super(), this.selectors = e;
                            }
                            match(e) {
                                const t = [];
                                for (const r of this.selectors){
                                    const n = r.match(e);
                                    if (n.error) return n;
                                    t.push(n);
                                }
                                return new Io(t);
                            }
                            select(e) {
                                return $o(this, e);
                            }
                            and(e) {
                                return new ko([
                                    ...this.selectors,
                                    e
                                ]);
                            }
                            toString() {
                                return `[${this.selectors.map(String).join(", ")}]`;
                            }
                        }
                        class So extends vo {
                            constructor(e, t, r){
                                super(), this.from = e, this.to = t, this.derives = r;
                            }
                            create(e) {
                                return this.to.create(e);
                            }
                            invoke(e) {
                                return this.to.invoke(e);
                            }
                            get can() {
                                return this.to.can;
                            }
                            match(e) {
                                const t = this.to.match(e);
                                return t.error ? t : new Ao(t, this.from, this.derives);
                            }
                            toString() {
                                return this.to.toString();
                            }
                        }
                        class Bo {
                            constructor(e, t, r){
                                this.source = [
                                    e
                                ], this.value = t, this.descriptor = {
                                    derives: To,
                                    ...r
                                };
                            }
                            get can() {
                                return this.value.can;
                            }
                            get proofs() {
                                const e = [
                                    this.source[0].delegation
                                ];
                                return Object.defineProperties(this, {
                                    proofs: {
                                        value: e
                                    }
                                }), e;
                            }
                            prune(e) {
                                return e.canIssue(this.value, this.source[0].delegation.issuer.did()) ? null : this;
                            }
                            select(e) {
                                const t = [], r = [], n = [];
                                for (const o of e){
                                    const e1 = Co(this, o);
                                    if (e1.error) "UnknownCapability" === e1.name ? t.push(e1.capability) : r.push(new lo([
                                        e1
                                    ], this));
                                    else {
                                        const t1 = this.descriptor.derives(this.value, e1);
                                        t1.error ? r.push(new lo([
                                            new fo(this.value, e1, t1)
                                        ], this)) : n.push(new Bo(o, e1, this.descriptor));
                                    }
                                }
                                return {
                                    matches: n,
                                    unknown: t,
                                    errors: r
                                };
                            }
                            toString() {
                                return JSON.stringify({
                                    can: this.descriptor.can,
                                    with: this.value.uri.href,
                                    caveats: Object.keys(this.value.caveats).length > 0 ? this.value.caveats : void 0
                                });
                            }
                        }
                        class Ao {
                            constructor(e, t, r){
                                this.selected = e, this.from = t, this.derives = r;
                            }
                            get can() {
                                return this.value.can;
                            }
                            get source() {
                                return this.selected.source;
                            }
                            get proofs() {
                                const e = [];
                                for (const { delegation: t  } of this.selected.source)e.push(t);
                                return Object.defineProperties(this, {
                                    proofs: {
                                        value: e
                                    }
                                }), e;
                            }
                            get value() {
                                return this.selected.value;
                            }
                            prune(e) {
                                const t = this.selected.prune(e);
                                return t ? new Ao(t, this.from, this.derives) : null;
                            }
                            select(e) {
                                const { derives: t , selected: r , from: n  } = this, { value: o  } = r, i = r.select(e), s = n.select(e), a = [], c = [];
                                for (const e1 of s.matches){
                                    const r1 = t(o, e1.value);
                                    r1.error ? c.push(new lo([
                                        new fo(o, e1.value, r1)
                                    ], this)) : a.push(e1);
                                }
                                return {
                                    unknown: uo(i.unknown, s.unknown),
                                    errors: [
                                        ...c,
                                        ...i.errors,
                                        ...s.errors.map((e)=>new lo([
                                                e
                                            ], this))
                                    ],
                                    matches: [
                                        ...i.matches.map((e)=>new Ao(e, n, t)),
                                        ...a
                                    ]
                                };
                            }
                            toString() {
                                return this.selected.toString();
                            }
                        }
                        class Io {
                            constructor(e){
                                this.matches = e;
                            }
                            get selectors() {
                                return this.matches;
                            }
                            get source() {
                                const e = [];
                                for (const t of this.matches)e.push(...t.source);
                                return Object.defineProperties(this, {
                                    source: {
                                        value: e
                                    }
                                }), e;
                            }
                            prune(e) {
                                const t = [];
                                for (const r of this.matches){
                                    const n = r.prune(e);
                                    n && t.push(n);
                                }
                                return 0 === t.length ? null : new Io(t);
                            }
                            get proofs() {
                                const e = [];
                                for (const { delegation: t  } of this.source)e.push(t);
                                return Object.defineProperties(this, {
                                    source: {
                                        value: e
                                    }
                                }), e;
                            }
                            get value() {
                                const e = [];
                                for (const t of this.matches)e.push(t.value);
                                return Object.defineProperties(this, {
                                    value: {
                                        value: e
                                    }
                                }), e;
                            }
                            select(e) {
                                return $o(this, e);
                            }
                            toString() {
                                return `[${this.matches.map((e)=>e.toString()).join(", ")}]`;
                            }
                        }
                        const Co = (e, t)=>{
                            const { can: r , with: n , caveats: o  } = e.descriptor, { delegation: i , index: s  } = t, a = t.capability;
                            if (a.can !== r) return new wo(a);
                            const c = n.decode(a.with);
                            if (c.error) return new po(a, c);
                            const u = {};
                            if (o) for (const [e1, t1] of co(o)){
                                const r1 = e1, n1 = a[r1], o1 = t1.decode(n1);
                                if (o1?.error) return new po(a, o1);
                                null != o1 && (u[r1] = o1);
                            }
                            return new Oo(r, a.with, c, u, i);
                        };
                        class Oo {
                            constructor(e, t, r, n, o){
                                this.can = e, this.with = t, this.uri = r, this.delegation = o, this.caveats = n;
                            }
                        }
                        const Ro = (e, t)=>{
                            const r = [], n = [], o = [];
                            for (const i of t){
                                const t1 = e.match(i);
                                t1.error ? "UnknownCapability" === t1.name ? r.push(t1.capability) : o.push(new lo([
                                    t1
                                ], t1.capability)) : n.push(t1);
                            }
                            return {
                                matches: n,
                                errors: o,
                                unknown: r
                            };
                        }, $o = (e, t)=>{
                            let r;
                            const n = [], o = [];
                            for (const i of e.selectors){
                                const s = i.select(t);
                                r = r ? uo(r, s.unknown) : s.unknown;
                                for (const t1 of s.errors)o.push(new lo([
                                    t1
                                ], e));
                                n.push(s.matches);
                            }
                            return {
                                unknown: r || [],
                                errors: o,
                                matches: (([e, ...t])=>{
                                    const r = e.map((e)=>[
                                            e
                                        ]);
                                    for (const e1 of t){
                                        const t1 = r.splice(0);
                                        for (const n of e1)for (const e2 of t1)r.push([
                                            ...e2,
                                            n
                                        ]);
                                    }
                                    return r;
                                })(n).map((e)=>new Io(e))
                            };
                        }, To = (e, t)=>{
                            if (t.with.endsWith("*")) {
                                if (!e.with.startsWith(t.with.slice(0, -1))) return new ho(`Resource ${e.with} does not match delegated ${t.with} `);
                            } else if (t.with !== e.with) return new ho(`Resource ${e.with} does not contain ${t.with}`);
                            for (const [r, n] of co(t.caveats))if (e.caveats[r] != n) return new ho(`${String(r)}: ${e.caveats[r]} violates ${n}`);
                            return !0;
                        }, Uo = (e, { protocol: t  } = {})=>{
                            if ("string" != typeof e && !(e instanceof URL)) return new ho("Expected URI but got " + typeof e);
                            try {
                                const r = new URL(String(e));
                                return null != t && r.protocol !== t ? new ho(`Expected ${t} URI instead got ${r.href}`) : r;
                            } catch (e1) {
                                return new ho("Invalid URI");
                            }
                        }, _o = (e)=>({
                                decode: (t)=>Uo(t, e)
                            }), No = (e)=>({
                                decode: (t)=>{
                                    const r = Uo(t, e);
                                    return r.error ? r : r.href;
                                }
                            }), jo = (e)=>({
                                decode: (t)=>void 0 === t ? void 0 : ((e, t = {})=>{
                                        if (null == e) return new ho(`Expected link but got ${e} instead`);
                                        {
                                            const r = Xn(e);
                                            return null == r ? new ho(`Expected link to be a CID instead of ${e}`) : null != t.code && r.code !== t.code ? new ho(`Expected link to be CID with 0x${t.code.toString(16)} codec`) : null != t.algorithm && r.multihash.code !== t.algorithm ? new ho(`Expected link to be CID with 0x${t.algorithm.toString(16)} hashing algorithm`) : null != t.version && r.version !== t.version ? new ho(`Expected link to be CID version ${t.version} instead of ${r.version}`) : r;
                                        }
                                    })(t, e)
                            });
                        function zo(e, t) {
                            return t.endsWith("*") ? !!e.startsWith(t.slice(0, -1)) || new ho(`${e} does not match ${t}`) : e === t || new ho(`${e} is different from ${t}`);
                        }
                        function Do(e, t) {
                            return e.with === t.with || new ho(`Can not derive ${e.can} with ${e.with} from ${t.with}`);
                        }
                        const Po = (e, t)=>e.uri.href !== t.uri.href ? new ho(`Expected 'with: "${t.uri.href}"' instead got '${e.uri.href}'`) : !t.caveats.link || `${t.caveats.link}` == `${e.caveats.link}` || new ho(`Link ${null == e.caveats.link ? "" : `${e.caveats.link} `}violates imposed ${t.caveats.link} constraint`);
                        class Lo {
                            constructor(e){
                                this.decoder = e;
                            }
                            optional() {
                                return this;
                            }
                            decode(e) {
                                return void 0 === e ? void 0 : this.decoder.decode(e);
                            }
                        }
                        class Mo extends class {
                            decode(e) {
                                return new ho("Given input is not valid");
                            }
                            optional() {
                                return new Lo(this);
                            }
                        } {
                            constructor({ min: e = -1 / 0 , max: t = 1 / 0  } = {}){
                                super(), this.min = e, this.max = t;
                            }
                            static isInteger(e) {
                                return Number.isInteger(e);
                            }
                            decode(e) {
                                const { min: t , max: r  } = this;
                                return Mo.isInteger(e) ? t > e ? new ho(`Expecting an Integer > ${t} but instead got ${e}`) : r < e ? new ho(`Expecting an Integer < ${r} but instead got ${e}`) : e : new ho(`Expecting an Integer but instead got: ${typeof e} ${e}`);
                            }
                            greater(e) {
                                return new Mo({
                                    min: e,
                                    max: this.max
                                });
                            }
                            less(e) {
                                return new Mo({
                                    min: this.min,
                                    max: e
                                });
                            }
                        }
                        const Vo = new Mo, Wo = bo({
                            can: "*",
                            with: _o({
                                protocol: "did:"
                            }),
                            derives: Do
                        }), Fo = Wo.derive({
                            to: bo({
                                can: "store/*",
                                with: _o({
                                    protocol: "did:"
                                }),
                                derives: Do
                            }),
                            derives: Do
                        }), Ho = Wo.or(Fo), qo = Ho.derive({
                            to: bo({
                                can: "store/add",
                                with: _o({
                                    protocol: "did:"
                                }),
                                caveats: {
                                    link: jo(),
                                    origin: jo(),
                                    size: Vo.optional()
                                },
                                derives: (e, t)=>{
                                    const r = Po(e, t);
                                    return r.error ? r : null == e.caveats.size || null == t.caveats.size || !(e.caveats.size > t.caveats.size) || new ho(`Size constraint violation: ${e.caveats.size} > ${t.caveats.size}`);
                                }
                            }),
                            derives: Do
                        }), Jo = Ho.derive({
                            to: bo({
                                can: "store/remove",
                                with: _o({
                                    protocol: "did:"
                                }),
                                caveats: {
                                    link: jo()
                                },
                                derives: Po
                            }),
                            derives: Do
                        }), Go = Ho.derive({
                            to: bo({
                                can: "store/list",
                                with: _o({
                                    protocol: "did:"
                                }),
                                derives: (e, t)=>e.uri.href === t.uri.href || new ho(`Expected 'with: "${t.uri.href}"' instead got '${e.uri.href}'`)
                            }),
                            derives: Do
                        }), Zo = qo.or(Jo).or(Go), Ko = bo({
                            can: "identity/validate",
                            with: _o({
                                protocol: "did:"
                            }),
                            caveats: {
                                as: No({
                                    protocol: "mailto:"
                                })
                            },
                            derives: (e, t)=>zo(e.caveats.as, t.caveats.as) && Do(e, t)
                        }), Xo = bo({
                            can: "identity/register",
                            with: _o({
                                protocol: "mailto:"
                            }),
                            caveats: {
                                as: No({
                                    protocol: "did:"
                                })
                            },
                            derives: (e, t)=>zo(e.caveats.as, t.caveats.as) && zo(e.with, t.with)
                        }), Qo = Zo.derive({
                            to: bo({
                                can: "identity/identify",
                                with: _o({
                                    protocol: "did:"
                                }),
                                derives: Do
                            }),
                            derives: Do
                        });
                        Xo.or(Ko).or(Qo);
                        class Yo {
                            constructor(e){
                                this.id = e.id, this.options = e, this.encoder = e.encoder, this.decoder = e.decoder, this.channel = e.channel, this.hasher = e.hasher || Tn;
                            }
                            execute(...e) {
                                return ei(e, this);
                            }
                        }
                        const ei = async (e, t)=>{
                            const r = await t.encoder.encode(e, t), n = await t.channel.request(r);
                            return await t.decoder.decode(n);
                        };
                        var ti = function e(t, r, n) {
                            if (Number.MAX_SAFE_INTEGER && t > Number.MAX_SAFE_INTEGER) throw e.bytes = 0, RangeError("Could not encode varint");
                            r = r || [];
                            for(var o = n = n || 0; t >= ri;)r[n++] = 255 & t | 128, t /= 128;
                            for(; -128 & t;)r[n++] = 255 & t | 128, t >>>= 7;
                            return r[n] = 0 | t, e.bytes = n - o + 1, r;
                        }, ri = Math.pow(2, 31), ni = function e(t, r) {
                            var n, o = 0, i = 0, s = r = r || 0, a = t.length;
                            do {
                                if (s >= a || i > 49) throw e.bytes = 0, RangeError("Could not decode varint");
                                n = t[s++], o += i < 28 ? (127 & n) << i : (127 & n) * Math.pow(2, i), i += 7;
                            }while (n >= 128)
                            return e.bytes = s - r, o;
                        }, oi = Math.pow(2, 7), ii = Math.pow(2, 14), si = Math.pow(2, 21), ai = Math.pow(2, 28), ci = Math.pow(2, 35), ui = Math.pow(2, 42), hi = Math.pow(2, 49), fi = Math.pow(2, 56), di = Math.pow(2, 63), li = {
                            encode: ti,
                            decode: ni,
                            encodingLength: function(e) {
                                return e < oi ? 1 : e < ii ? 2 : e < si ? 3 : e < ai ? 4 : e < ci ? 5 : e < ui ? 6 : e < hi ? 7 : e < fi ? 8 : e < di ? 9 : 10;
                            }
                        };
                        const pi = pr(), wi = {
                            float64: !1,
                            quickEncodeToken: dr
                        };
                        function yi(e, t = pi, r = wi) {
                            if (Array.isArray(e)) {
                                let n = 0;
                                for (const o of e)n += yi(o, t, r);
                                return n;
                            }
                            {
                                const n1 = t[e.type.major];
                                if (void 0 === n1.encodedSize || "function" != typeof n1.encodedSize) throw Error(`Encoder for ${e.type.name} does not have an encodedSize()`);
                                return n1.encodedSize(e, r);
                            }
                        }
                        class gi {
                            constructor(e, t){
                                this.bytes = e, this.byteOffset = t, this.roots = [], this.headerSize = t;
                            }
                            addRoot(e, t) {
                                return bi(this, e, t), this;
                            }
                            write(e) {
                                return vi(this, e), this;
                            }
                            close(e) {
                                return xi(this, e);
                            }
                        }
                        const bi = (e, t, r = {})=>{
                            const { resize: n = !1  } = r, { bytes: o , headerSize: i , byteOffset: s , roots: a  } = e;
                            e.roots.push(t);
                            const c = Ci(e);
                            if (c > i) {
                                if (!(c - i + s < o.byteLength)) throw a.pop(), RangeError(`Buffer has no capacity for a new root ${t}`);
                                if (!n) throw a.pop(), RangeError(`Header of size ${i} has no capacity for new root ${t}.\n  However there is a space in the buffer and you could call addRoot(root, { resize: root }) to resize header to make a space for this root.`);
                                Ei(e, c);
                            }
                        }, mi = ({ cid: e , bytes: t  })=>{
                            const r = e.bytes.byteLength + t.byteLength;
                            return li.encodingLength(r) + r;
                        }, vi = (e, { cid: t , bytes: r  })=>{
                            const n = t.bytes.byteLength + r.byteLength, o = li.encode(n);
                            if (e.byteOffset + o.length + n > e.bytes.byteLength) throw RangeError("Buffer has no capacity for this block");
                            ki(e, o), ki(e, t.bytes), ki(e, r);
                        }, xi = (e, t = {})=>{
                            const { resize: r = !1  } = t, { roots: n , bytes: o , byteOffset: i , headerSize: s  } = e, a = $r({
                                version: 1,
                                roots: n
                            }), c = li.encode(a.length), u = c.length + a.byteLength;
                            if (0 == s - u) return Si(e, c, a), o.subarray(0, i);
                            if (r) return Ei(e, u), Si(e, c, a), o.subarray(0, e.byteOffset);
                            throw RangeError("Header size was overestimated.\nYou can use close({ resize: true }) to resize header");
                        }, Ei = (e, t)=>{
                            const { bytes: r , headerSize: n  } = e;
                            r.set(r.subarray(n, e.byteOffset), t), e.byteOffset += t - n, e.headerSize = t;
                        }, ki = (e, t)=>{
                            e.bytes.set(t, e.byteOffset), e.byteOffset += t.length;
                        }, Si = ({ bytes: e  }, t, r)=>{
                            e.set(t), e.set(r, t.length);
                        }, Bi = [
                            new ht(ut.map, 2),
                            new ht(ut.string, "version"),
                            new ht(ut.uint, 1),
                            new ht(ut.string, "roots")
                        ], Ai = new ht(ut.tag, 42), Ii = (e)=>{
                            const t = [
                                ...Bi
                            ];
                            t.push(new ht(ut.array, e.length));
                            for (const r of e)t.push(Ai), t.push(new ht(ut.bytes, {
                                length: r + 1
                            }));
                            const r1 = yi(t);
                            return li.encodingLength(r1) + r1;
                        }, Ci = ({ roots: e  })=>Ii(e.map((e)=>e.bytes.byteLength)), Oi = {
                            Null: (e)=>null === e,
                            Int: (e)=>Number.isInteger(e),
                            Float: (e)=>"number" == typeof e && Number.isFinite(e),
                            String: (e)=>"string" == typeof e,
                            Bool: (e)=>"boolean" == typeof e,
                            Bytes: (e)=>e instanceof Uint8Array,
                            Link: (e)=>!Oi.Null(e) && "object" == typeof e && e.asCID === e,
                            List: (e)=>Array.isArray(e),
                            Map: (e)=>!Oi.Null(e) && "object" == typeof e && e.asCID !== e && !Oi.List(e) && !Oi.Bytes(e)
                        }, Ri = {
                            Int: Oi.Int,
                            "CarHeader > version": (e)=>Ri.Int(e),
                            "CarHeader > roots (anon) > valueType (anon)": Oi.Link,
                            "CarHeader > roots (anon)": (e)=>Oi.List(e) && Array.prototype.every.call(e, Ri["CarHeader > roots (anon) > valueType (anon)"]),
                            "CarHeader > roots": (e)=>Ri["CarHeader > roots (anon)"](e),
                            CarHeader: (e)=>{
                                const t = e && Object.keys(e);
                                return Oi.Map(e) && [
                                    "version"
                                ].every((e)=>t.includes(e)) && Object.entries(e).every(([e, t])=>Ri["CarHeader > " + e] && Ri["CarHeader > " + e](t));
                            }
                        }, $i = Ri.CarHeader, Ti = 18, Ui = 32, _i = 112;
                        async function Ni(e) {
                            const t = await e.upTo(8);
                            if (!t.length) throw Error("Unexpected end of data");
                            const r = li.decode(t);
                            return e.seek(li.decode.bytes), r;
                        }
                        async function ji(e, t) {
                            const r = await Ni(e);
                            if (0 === r) throw Error("Invalid CAR header (zero length)");
                            const n = await e.exactly(r);
                            e.seek(r);
                            const o = Tr(n);
                            if (!$i(o)) throw Error("Invalid CAR header format");
                            if (1 !== o.version && 2 !== o.version || void 0 !== t && o.version !== t) throw Error(`Invalid CAR version: ${o.version}${void 0 !== t ? ` (expected ${t})` : ""}`);
                            const i = Array.isArray(o.roots);
                            if (1 === o.version && !i || 2 === o.version && i) throw Error("Invalid CAR header format");
                            if (1 === o.version) return o;
                            const s = await async function(e) {
                                const t = await e.exactly(40), r = new DataView(t.buffer, t.byteOffset, t.byteLength);
                                let n = 0;
                                const o = {
                                    version: 2,
                                    characteristics: [
                                        r.getBigUint64(n, !0),
                                        r.getBigUint64(n += 8, !0)
                                    ],
                                    dataOffset: Number(r.getBigUint64(n += 8, !0)),
                                    dataSize: Number(r.getBigUint64(n += 8, !0)),
                                    indexOffset: Number(r.getBigUint64(n += 8, !0))
                                };
                                return e.seek(40), o;
                            }(e);
                            e.seek(s.dataOffset - e.pos);
                            const a = await ji(e, 1);
                            return Object.assign(a, s);
                        }
                        async function zi(e) {
                            const t = await e.exactly(2);
                            if (t[0] === Ti && t[1] === Ui) {
                                const t1 = await e.exactly(34);
                                e.seek(34);
                                const r = ce(t1);
                                return Ee.create(0, _i, r);
                            }
                            const r1 = await Ni(e);
                            if (1 !== r1) throw Error(`Unexpected CID version (${r1})`);
                            const n = await Ni(e), o = await async function(e) {
                                const t = await e.upTo(8);
                                li.decode(t);
                                const r = li.decode.bytes, n = li.decode(t.subarray(li.decode.bytes)), o = r + li.decode.bytes + n, i = await e.exactly(o);
                                return e.seek(o), i;
                            }(e), i = ce(o);
                            return Ee.create(r1, n, i);
                        }
                        async function Di(e) {
                            const t = e.pos;
                            let r = await Ni(e);
                            if (0 === r) throw Error("Invalid CAR section (zero length)");
                            return r += e.pos - t, {
                                cid: await zi(e),
                                length: r,
                                blockLength: r - Number(e.pos - t)
                            };
                        }
                        async function Pi(e) {
                            const { cid: t , blockLength: r  } = await Di(e), n = await e.exactly(r);
                            return e.seek(r), {
                                bytes: n,
                                cid: t
                            };
                        }
                        async function Li(e) {
                            const t = e.pos, { cid: r , length: n , blockLength: o  } = await Di(e), i = {
                                cid: r,
                                length: n,
                                blockLength: o,
                                offset: t,
                                blockOffset: e.pos
                            };
                            return e.seek(i.blockLength), i;
                        }
                        function Mi(e) {
                            const t = (async ()=>{
                                const t = await ji(e);
                                if (2 === t.version) {
                                    const r = e.pos - t.dataOffset;
                                    e = function(e, t) {
                                        let r = 0;
                                        return {
                                            async upTo (n) {
                                                let o = await e.upTo(n);
                                                return o.length + r > t && (o = o.subarray(0, t - r)), o;
                                            },
                                            async exactly (n) {
                                                const o = await e.exactly(n);
                                                if (o.length + r > t) throw Error("Unexpected end of data");
                                                return o;
                                            },
                                            seek (t) {
                                                r += t, e.seek(t);
                                            },
                                            get pos () {
                                                return e.pos;
                                            }
                                        };
                                    }(e, t.dataSize - r);
                                }
                                return t;
                            })();
                            return {
                                header: ()=>t,
                                async *blocks () {
                                    for(await t; (await e.upTo(8)).length > 0;)yield await Pi(e);
                                },
                                async *blocksIndex () {
                                    for(await t; (await e.upTo(8)).length > 0;)yield await Li(e);
                                }
                            };
                        }
                        function Vi(e) {
                            const t = e[Symbol.asyncIterator]();
                            return function(e) {
                                let t = 0, r = 0, n = 0, o = new Uint8Array(0);
                                const i = async (t)=>{
                                    r = o.length - n;
                                    const i = [
                                        o.subarray(n)
                                    ];
                                    for(; r < t;){
                                        const t1 = await e();
                                        if (null == t1) break;
                                        r < 0 ? t1.length > r && i.push(t1.subarray(-r)) : i.push(t1), r += t1.length;
                                    }
                                    o = new Uint8Array(i.reduce((e, t)=>e + t.length, 0));
                                    let s = 0;
                                    for (const e1 of i)o.set(e1, s), s += e1.length;
                                    n = 0;
                                };
                                return {
                                    upTo: async (e)=>(o.length - n < e && await i(e), o.subarray(n, n + Math.min(o.length - n, e))),
                                    async exactly (e) {
                                        if (o.length - n < e && await i(e), o.length - n < e) throw Error("Unexpected end of data");
                                        return o.subarray(n, n + e);
                                    },
                                    seek (e) {
                                        t += e, n += e;
                                    },
                                    get pos () {
                                        return t;
                                    }
                                };
                            }(async function() {
                                const e = await t.next();
                                return e.done ? null : e.value;
                            });
                        }
                        class Wi {
                            constructor(e, t){
                                this._header = e, this._blocks = t, this._keys = t.map((e)=>e.cid.toString());
                            }
                            get version() {
                                return this._header.version;
                            }
                            async getRoots() {
                                return this._header.roots;
                            }
                            async has(e) {
                                return this._keys.indexOf(e.toString()) > -1;
                            }
                            async get(e) {
                                const t = this._keys.indexOf(e.toString());
                                return t > -1 ? this._blocks[t] : void 0;
                            }
                            async *blocks() {
                                for (const e of this._blocks)yield e;
                            }
                            async *cids() {
                                for (const e of this._blocks)yield e.cid;
                            }
                            static async fromBytes(e) {
                                if (!(e instanceof Uint8Array)) throw TypeError("fromBytes() requires a Uint8Array");
                                return Fi(function(e) {
                                    let t = 0;
                                    return {
                                        upTo: async (r)=>e.subarray(t, t + Math.min(r, e.length - t)),
                                        async exactly (r) {
                                            if (r > e.length - t) throw Error("Unexpected end of data");
                                            return e.subarray(t, t + r);
                                        },
                                        seek (e) {
                                            t += e;
                                        },
                                        get pos () {
                                            return t;
                                        }
                                    };
                                }(e));
                            }
                            static async fromIterable(e) {
                                if (!e || "function" != typeof e[Symbol.asyncIterator]) throw TypeError("fromIterable() requires an async iterable");
                                return Fi(Vi(e));
                            }
                        }
                        async function Fi(e) {
                            const t = Mi(e), r = await t.header(), n = [];
                            for await (const e1 of t.blocks())n.push(e1);
                            return new Wi(r, n);
                        }
                        class Hi {
                            constructor(e = [], t = 0){
                                this.written = new Set, this.blocks = e, this.byteLength = t;
                            }
                            write(...e) {
                                for (const t of e){
                                    const e1 = t.cid.toString(xe);
                                    this.written.has(e1) || (this.blocks.push(t), this.byteLength += mi(t), this.written.add(e1));
                                }
                                return this;
                            }
                            flush(...e) {
                                const t = [];
                                for (const r of e.reverse()){
                                    const e1 = r.cid.toString(xe);
                                    this.written.has(e1) || (this.blocks.unshift(r), this.byteLength += mi({
                                        cid: r.cid,
                                        bytes: r.bytes
                                    }), this.written.add(e1)), t.push(r.cid);
                                }
                                this.byteLength += Ci({
                                    roots: t
                                });
                                const r1 = ((e, t = {})=>{
                                    const { roots: r = [] , byteOffset: n = 0 , byteLength: o = e.byteLength , headerSize: i = Ci({
                                        roots: r
                                    })  } = t, s = new Uint8Array(e, n, o), a = new gi(s, i);
                                    for (const e1 of r)a.addRoot(e1);
                                    return a;
                                })(new ArrayBuffer(this.byteLength), {
                                    roots: t
                                });
                                for (const e2 of this.blocks)r1.write(e2);
                                return r1.close();
                            }
                        }
                        const qi = ({ roots: e = [] , blocks: t  })=>{
                            const r = new Hi;
                            return t && r.write(...t.values()), r.flush(...e);
                        }, Ji = async (e)=>{
                            const t = await Wi.fromBytes(e), { _header: r , _blocks: n , _keys: o  } = t, i = [], s = new Map, a = r.roots.map((e)=>o.indexOf(String(e)));
                            for (const [e1, t1] of n.entries())a.includes(e1) ? i.push(t1) : s.set(t1.cid.toString(), t1);
                            return {
                                roots: i,
                                blocks: s
                            };
                        }, Gi = async (e, { hasher: t = Tn  } = {})=>Kn(514, await t.digest(e));
                        var Zi = Object.freeze({
                            __proto__: null,
                            code: 514,
                            createWriter: ()=>new Hi,
                            encode: qi,
                            decode: Ji,
                            link: Gi,
                            write: async (e, t)=>{
                                const r = qi(e);
                                return {
                                    bytes: r,
                                    cid: await Gi(r, t)
                                };
                            }
                        });
                        const Ki = Object.freeze({
                            "content-type": "application/car"
                        });
                        var Xi = Object.freeze({
                            __proto__: null,
                            codec: Zi,
                            encode: async (e, t)=>{
                                const r = [], n = new Map;
                                for (const o of e){
                                    const e1 = await no(o, t);
                                    r.push(e1.root);
                                    for (const t1 of e1.export())n.set(t1.cid.toString(), t1);
                                    n.delete(e1.root.cid.toString());
                                }
                                const o1 = qi({
                                    roots: r,
                                    blocks: n
                                });
                                return {
                                    headers: Ki,
                                    body: o1
                                };
                            },
                            decode: async ({ headers: e , body: t  })=>{
                                const r = e["content-type"] || e["Content-Type"];
                                if ("application/car" !== r) throw TypeError(`Only 'content-type: application/car' is supported, instead got '${r}'`);
                                const { roots: n , blocks: o  } = await Ji(t), i = [];
                                for (const e1 of n)i.push(io({
                                    root: e1,
                                    blocks: o
                                }));
                                return i;
                            }
                        });
                        const Qi = (e, t)=>{
                            if (t.has(e)) throw TypeError("Can not encode circular structure");
                            if (void 0 === e && 0 === t.size) return null;
                            if (null === e) return null;
                            if ("symbol" == typeof e && 0 === t.size) return null;
                            const r = Xn(e);
                            if (r) return r;
                            if (ArrayBuffer.isView(e)) return e;
                            if (Array.isArray(e)) {
                                t.add(e);
                                const r1 = [];
                                for (const n of e)r1.push(void 0 === n || "symbol" == typeof n ? null : Qi(n, t));
                                return r1;
                            }
                            if ("function" == typeof e.toJSON) {
                                t.add(e);
                                const r2 = e.toJSON();
                                return Qi(r2, t);
                            }
                            if ("object" == typeof e) {
                                t.add(e);
                                const r3 = {};
                                for (const [n1, o] of Object.entries(e))void 0 !== o && "symbol" != typeof o && (r3[n1] = Qi(o, t));
                                return r3;
                            }
                            return e;
                        }, Yi = (e)=>$r(Qi(e, new Set)), es = async (e, { hasher: t = Tn  } = {})=>Kn(113, await t.digest(e));
                        var ts = Object.freeze({
                            __proto__: null,
                            encode: Yi,
                            link: es,
                            write: async (e, t)=>{
                                const r = Yi(e);
                                return {
                                    cid: await es(r, t),
                                    bytes: r
                                };
                            },
                            code: 113,
                            decode: Tr
                        });
                        const rs = Object.freeze({
                            "content-type": "application/cbor"
                        }), ns = ts;
                        var os = Object.freeze({
                            __proto__: null,
                            codec: ns,
                            encode: (e)=>({
                                    headers: rs,
                                    body: Yi(e)
                                }),
                            decode: async ({ headers: e , body: t  })=>{
                                const r = e["content-type"] || e["Content-Type"];
                                if ("application/cbor" !== r) throw TypeError(`Only 'content-type: application/cbor' is supported, intsead got '${r}'`);
                                return Tr(t);
                            }
                        });
                        const is = ({ url: e , method: t = "POST" , fetch: r  })=>{
                            if (!r) {
                                if (void 0 === globalThis.fetch) throw TypeError("ucanto HTTP transport got undefined `fetch`. Try passing in a `fetch` implementation explicitly.");
                                r = globalThis.fetch.bind(globalThis);
                            }
                            return new ss({
                                url: e,
                                method: t,
                                fetch: r
                            });
                        };
                        class ss {
                            constructor({ url: e , fetch: t , method: r  }){
                                this.fetch = t, this.method = r, this.url = e;
                            }
                            async request({ headers: e , body: t  }) {
                                const r = await this.fetch(this.url.href, {
                                    headers: e,
                                    body: t,
                                    method: this.method
                                }), n = r.ok ? await r.arrayBuffer() : as.throw("HTTP Request failed", r);
                                return {
                                    headers: Object.fromEntries(r.headers.entries()),
                                    body: new Uint8Array(n)
                                };
                            }
                        }
                        class as extends Error {
                            static throw(e, t) {
                                throw new this(e, t);
                            }
                            constructor(e, { url: t , status: r = 500 , statusText: n = "Server error"  }){
                                super(e), this.name = "HTTPError", this.url = t, this.status = r, this.statusText = n;
                            }
                        }
                        const cs = new URL("https://access-api.web3.storage"), us = Je("did:key:z6MkkHafoFWxxWVNpNXocFdU6PL2RVLyTEgS1qTnD3bRP7V9");
                        function hs({ id: e , url: t = cs , fetch: r  }) {
                            return n = {
                                id: e,
                                encoder: Xi,
                                decoder: os,
                                channel: is({
                                    url: t,
                                    method: "POST",
                                    fetch: r
                                })
                            }, new Yo(n);
                            var n;
                        }
                        async function fs(e) {
                            const t = hs({
                                id: e.issuer,
                                url: e.url || cs
                            }), r = Ko.invoke({
                                audience: e.audience || us,
                                issuer: e.issuer,
                                with: e.issuer.did(),
                                caveats: {
                                    ...e.caveats
                                }
                            }), n = await r.execute(t);
                            if (n?.error) throw n;
                        }
                        async function ds(e) {
                            const t = hs({
                                id: e.issuer,
                                url: e.url || cs
                            }), r = Xo.invoke({
                                audience: e.audience || us,
                                issuer: e.issuer,
                                with: e.proof.capabilities[0].with,
                                caveats: {
                                    as: e.proof.capabilities[0].as
                                },
                                proofs: [
                                    e.proof
                                ]
                            }), n = await r.execute(t);
                            if (n?.error) throw n;
                        }
                        async function ls(e) {
                            const t = e.url || cs, r = await Zn(((e, t, r)=>async ()=>{
                                    const n = await Pn(`${t}validate?did=${e}`, {
                                        signal: r
                                    });
                                    if (!n.ok) throw Error(n.statusText);
                                    return n.text();
                                })(e.issuer.did(), t.toString(), e.signal), {
                                retries: 100,
                                signal: e.signal
                            }), n = Nn(r), o = await _n(n);
                            return io({
                                root: o
                            });
                        }
                        const ps = new URL("https://access-api.web3.storage"), ws = Je("did:key:z6MkkHafoFWxxWVNpNXocFdU6PL2RVLyTEgS1qTnD3bRP7V9");
                        var ys;
                        async function gs({ email: e  }) {
                            const t = localStorage.getItem(`__w3ui_id.v0.mailto:${e}`);
                            if (null != t) try {
                                const { email: e1 , verified: r , signingPrincipalBytes: n  } = JSON.parse(t), o = ((e)=>{
                                    if (e.byteLength !== nt) throw Error(`Expected Uint8Array with byteLength of ${nt} instead not ${e.byteLength}`);
                                    {
                                        const [t] = ne(e);
                                        if (t !== Ye) throw Error("Given bytes must be a multiformat with 4864 tag");
                                    }
                                    {
                                        const [t1] = ne(e.subarray(et + rt));
                                        if (t1 !== Fe) throw Error("Given bytes must contain public key in multiformats with 237 tag");
                                    }
                                    return new it(e);
                                })(Xe.decode(n));
                                return {
                                    email: e1,
                                    verified: r,
                                    signingPrincipal: o
                                };
                            } catch (e2) {
                                console.warn("failed to load identity", e2);
                            }
                        }
                        e.AuthStatus = void 0, (ys = e.AuthStatus || (e.AuthStatus = {}))[ys.SignedIn = 0] = "SignedIn", ys[ys.SignedOut = 1] = "SignedOut", ys[ys.EmailVerification = 2] = "EmailVerification", e.createIdentity = async function({ email: e  }) {
                            if (null == e || "" === e) throw Error("missing email address");
                            return {
                                email: e,
                                verified: !1,
                                signingPrincipal: await ot(W.randomPrivateKey())
                            };
                        }, e.loadDefaultIdentity = async function() {
                            const e = localStorage.getItem("__w3ui_id.v0.default.email");
                            if (null != e) return await gs({
                                email: e
                            });
                        }, e.loadIdentity = gs, e.registerIdentity = async function(e, t) {
                            if (!e.verified) throw Error("identity must be verified");
                            await ds({
                                audience: ws,
                                url: ps,
                                issuer: e.signingPrincipal,
                                proof: t
                            });
                        }, e.removeIdentity = async function(e) {
                            localStorage.removeItem(`__w3ui_id.v0.mailto:${e.email}`);
                            const t = localStorage.getItem("__w3ui_id.v0.default.email");
                            e.email === t && localStorage.removeItem("__w3ui_id.v0.default.email");
                        }, e.sendVerificationEmail = async function(e) {
                            if (e.verified) throw Error("already verified");
                            await fs({
                                audience: ws,
                                url: ps,
                                issuer: e.signingPrincipal,
                                caveats: {
                                    as: `mailto:${e.email}`
                                }
                            });
                        }, e.storeIdentity = async function(e) {
                            const { email: t , verified: r , signingPrincipal: n  } = e, o = Xe.encode(n.bytes);
                            localStorage.setItem(`__w3ui_id.v0.mailto:${t}`, JSON.stringify({
                                email: t,
                                verified: r,
                                signingPrincipalBytes: o
                            })), localStorage.setItem("__w3ui_id.v0.default.email", t);
                        }, e.waitIdentityVerification = async function(e, t = {}) {
                            if (e.verified) throw Error("already verified");
                            const r = await ls({
                                issuer: e.signingPrincipal,
                                url: ps,
                                signal: t.signal
                            });
                            return {
                                identity: {
                                    email: e.email,
                                    verified: !0,
                                    signingPrincipal: e.signingPrincipal
                                },
                                proof: r
                            };
                        }, Object.defineProperty(e, "__esModule", {
                            value: !0
                        });
                    }(t);
                }(0, o.exports);
                const i = t.createContext({
                    identity: void 0,
                    loadDefaultIdentity: async ()=>{},
                    unloadIdentity: async ()=>{},
                    unloadAndRemoveIdentity: async ()=>{},
                    registerAndStoreIdentity: async ()=>{},
                    cancelRegisterAndStoreIdentity: ()=>{},
                    authStatus: o.exports.AuthStatus.SignedOut
                });
                e.AuthContext = i, e.AuthProvider = function({ children: e  }) {
                    const [r, s] = t.useState(o.exports.AuthStatus.SignedOut), [a, c] = t.useState(), [u, h] = t.useState(), f = async (e)=>{
                        const t = new AbortController;
                        h(t);
                        try {
                            s(o.exports.AuthStatus.EmailVerification);
                            const { identity: r , proof: n  } = await o.exports.waitIdentityVerification(e, {
                                signal: t.signal
                            });
                            await o.exports.registerIdentity(r, n), await o.exports.storeIdentity(r), c(r), s(o.exports.AuthStatus.SignedIn);
                        } catch (e1) {
                            if (s(o.exports.AuthStatus.SignedOut), !t.signal.aborted) throw e1;
                        }
                    }, d = async ()=>{
                        s(o.exports.AuthStatus.SignedOut), c(void 0);
                    }, l = {
                        authStatus: r,
                        identity: a,
                        loadDefaultIdentity: async ()=>{
                            const e = await o.exports.loadDefaultIdentity();
                            if (null != e) {
                                if (c(e), e.verified) return void s(o.exports.AuthStatus.SignedIn);
                                await f(e);
                            }
                        },
                        unloadIdentity: d,
                        unloadAndRemoveIdentity: async ()=>{
                            if (null == a) throw Error("missing current identity");
                            await Promise.all([
                                o.exports.removeIdentity(a),
                                d()
                            ]);
                        },
                        registerAndStoreIdentity: async (e)=>{
                            let t;
                            if (null != a) {
                                if (a.email !== e) throw Error("unload current identity before registering a new one");
                                t = a;
                            } else t = await o.exports.loadIdentity({
                                email: e
                            }), null == t && (t = await o.exports.createIdentity({
                                email: e
                            }), await o.exports.storeIdentity(t));
                            if (c(t), t.verified) return void s(o.exports.AuthStatus.SignedIn);
                            const r = t;
                            await o.exports.sendVerificationEmail(r), await f(r);
                        },
                        cancelRegisterAndStoreIdentity: ()=>{
                            null != u && u.abort();
                        }
                    };
                    return n.default.createElement(i.Provider, {
                        value: l
                    }, e);
                }, e.AuthStatus = o.exports.AuthStatus, e.Identity = o.exports.Identity, e.useAuth = function() {
                    return t.useContext(i);
                }, Object.defineProperty(e, "__esModule", {
                    value: !0
                });
            });
        }
    }
]);
