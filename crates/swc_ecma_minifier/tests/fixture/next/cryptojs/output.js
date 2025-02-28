export default function(s, u, a) {
    var r, i, n, h, t, o, c, l, f, e;
    r = a(8249), i = Math, h = (n = r.lib).WordArray, t = n.Hasher, o = r.algo, c = [], l = [], // Compute constants
    function() {
        function r(r) {
            return (r - (0 | r)) * 0x100000000 | 0;
        }
        for(var t = 2, e = 0; e < 64;)(function(r) {
            for(var t = i.sqrt(r), e = 2; e <= t; e++)if (!(r % e)) return !1;
            return !0;
        })(t) && (e < 8 && (c[e] = r(i.pow(t, 0.5))), l[e] = r(i.pow(t, 1 / 3)), e++), t++;
    }(), f = [], e = o.SHA256 = t.extend({
        _doReset: function() {
            this._hash = new h.init(c.slice(0));
        },
        _doProcessBlock: function(c, u) {
            // Computation
            for(var r = this._hash.words, t = r[0], e = r[1], n = r[2], o = r[3], s = r[4], a = r[5], i = r[6], h = r[7], _ = 0; _ < 64; _++){
                if (_ < 16) f[_] = 0 | c[u + _];
                else {
                    var d = f[_ - 15], H = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3, v = f[_ - 2], p = (v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10;
                    f[_] = H + f[_ - 7] + p + f[_ - 16];
                }
                var w = s & a ^ ~s & i, x = t & e ^ t & n ^ e & n, A = (t << 30 | t >>> 2) ^ (t << 19 | t >>> 13) ^ (t << 10 | t >>> 22), g = h + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + w + l[_] + f[_], y = A + x;
                h = i, i = a, a = s, s = o + g | 0, o = n, n = e, e = t, t = g + y | 0;
            }
            // Intermediate hash value
            r[0] = r[0] + t | 0, r[1] = r[1] + e | 0, r[2] = r[2] + n | 0, r[3] = r[3] + o | 0, r[4] = r[4] + s | 0, r[5] = r[5] + a | 0, r[6] = r[6] + i | 0, r[7] = r[7] + h | 0;
        },
        _doFinalize: function() {
            // Shortcuts
            var e = this._data, r = e.words, n = 8 * this._nDataBytes, t = 8 * e.sigBytes;
            // Return final computed hash
            return(// Add padding
            r[t >>> 5] |= 0x80 << 24 - t % 32, r[(t + 64 >>> 9 << 4) + 14] = i.floor(n / 0x100000000), r[(t + 64 >>> 9 << 4) + 15] = n, e.sigBytes = 4 * r.length, // Hash final blocks
            this._process(), this._hash);
        },
        clone: function() {
            var r = t.clone.call(this);
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
			 */ r.SHA256 = t._createHelper(e), /**
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
			 */ r.HmacSHA256 = t._createHmacHelper(e), // CommonJS
    s.exports = r.SHA256;
/***/ }
