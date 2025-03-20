export default function(r, t, e) {
    var n, o, s, a, i, h, c, l, f, u;
    n = e(8249), o = Math, a = (s = n.lib).WordArray, i = s.Hasher, h = n.algo, c = [], l = [], // Compute constants
    function() {
        function r(r) {
            return (r - (0 | r)) * 0x100000000 | 0;
        }
        for(var t = 2, e = 0; e < 64;)(function(r) {
            for(var t = o.sqrt(r), e = 2; e <= t; e++)if (!(r % e)) return !1;
            return !0;
        })(t) && (e < 8 && (c[e] = r(o.pow(t, 0.5))), l[e] = r(o.pow(t, 1 / 3)), e++), t++;
    }(), f = [], u = h.SHA256 = i.extend({
        _doReset: function() {
            this._hash = new a.init(c.slice(0));
        },
        _doProcessBlock: function(r, t) {
            // Computation
            for(var e = this._hash.words, n = e[0], o = e[1], s = e[2], a = e[3], i = e[4], h = e[5], c = e[6], u = e[7], _ = 0; _ < 64; _++){
                if (_ < 16) f[_] = 0 | r[t + _];
                else {
                    var d = f[_ - 15], H = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3, v = f[_ - 2], p = (v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10;
                    f[_] = H + f[_ - 7] + p + f[_ - 16];
                }
                var w = i & h ^ ~i & c, x = n & o ^ n & s ^ o & s, A = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22), g = u + ((i << 26 | i >>> 6) ^ (i << 21 | i >>> 11) ^ (i << 7 | i >>> 25)) + w + l[_] + f[_], y = A + x;
                u = c, c = h, h = i, i = a + g | 0, a = s, s = o, o = n, n = g + y | 0;
            }
            // Intermediate hash value
            e[0] = e[0] + n | 0, e[1] = e[1] + o | 0, e[2] = e[2] + s | 0, e[3] = e[3] + a | 0, e[4] = e[4] + i | 0, e[5] = e[5] + h | 0, e[6] = e[6] + c | 0, e[7] = e[7] + u | 0;
        },
        _doFinalize: function() {
            // Shortcuts
            var r = this._data, t = r.words, e = 8 * this._nDataBytes, n = 8 * r.sigBytes;
            // Return final computed hash
            return(// Add padding
            t[n >>> 5] |= 0x80 << 24 - n % 32, t[(n + 64 >>> 9 << 4) + 14] = o.floor(e / 0x100000000), t[(n + 64 >>> 9 << 4) + 15] = e, r.sigBytes = 4 * t.length, // Hash final blocks
            this._process(), this._hash);
        },
        clone: function() {
            var r = i.clone.call(this);
            return r._hash = this._hash.clone(), r;
        }
    }), /**
			 * Shortcut function to the hasher's object interface.
			 *
			 * @param {WordArray|string} message The message to hash.
			 *
			 * @return {WordArray} The hash.
			 *
			 * @static
			 *
			 * @example
			 *
			 *     var hash = CryptoJS.SHA256('message');
			 *     var hash = CryptoJS.SHA256(wordArray);
			 */ n.SHA256 = i._createHelper(u), /**
			 * Shortcut function to the HMAC's object interface.
			 *
			 * @param {WordArray|string} message The message to hash.
			 * @param {WordArray|string} key The secret key.
			 *
			 * @return {WordArray} The HMAC.
			 *
			 * @static
			 *
			 * @example
			 *
			 *     var hmac = CryptoJS.HmacSHA256(message, key);
			 */ n.HmacSHA256 = i._createHmacHelper(u), // CommonJS
    r.exports = n.SHA256;
/***/ }
