export default function(r, t, e) {
    var a;
    a = e(8249), function(r) {
        var t = a.lib, e = t.WordArray, n = t.Hasher, o = a.algo, s = [], i = [];
        function h(r) {
            return (r - (0 | r)) * 0x100000000 | 0;
        }
        for(var c = 2, l = 0; l < 64;)(function(t) {
            for(var e = r.sqrt(t), a = 2; a <= e; a++)if (!(t % a)) return !1;
            return !0;
        })(c) && (l < 8 && (s[l] = h(r.pow(c, 0.5))), i[l] = h(r.pow(c, 1 / 3)), l++), c++;
        // Reusable object
        var f = [], u = o.SHA256 = n.extend({
            _doReset: function() {
                this._hash = new e.init(s.slice(0));
            },
            _doProcessBlock: function(r, t) {
                // Computation
                for(var e = this._hash.words, a = e[0], n = e[1], o = e[2], s = e[3], h = e[4], c = e[5], l = e[6], u = e[7], _ = 0; _ < 64; _++){
                    if (_ < 16) f[_] = 0 | r[t + _];
                    else {
                        var v = f[_ - 15], d = (v << 25 | v >>> 7) ^ (v << 14 | v >>> 18) ^ v >>> 3, H = f[_ - 2], p = (H << 15 | H >>> 17) ^ (H << 13 | H >>> 19) ^ H >>> 10;
                        f[_] = d + f[_ - 7] + p + f[_ - 16];
                    }
                    var w = h & c ^ ~h & l, x = a & n ^ a & o ^ n & o, A = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22), g = u + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + w + i[_] + f[_], y = A + x;
                    u = l, l = c, c = h, h = s + g | 0, s = o, o = n, n = a, a = g + y | 0;
                }
                // Intermediate hash value
                e[0] = e[0] + a | 0, e[1] = e[1] + n | 0, e[2] = e[2] + o | 0, e[3] = e[3] + s | 0, e[4] = e[4] + h | 0, e[5] = e[5] + c | 0, e[6] = e[6] + l | 0, e[7] = e[7] + u | 0;
            },
            _doFinalize: function() {
                // Shortcuts
                var t = this._data, e = t.words, a = 8 * this._nDataBytes, n = 8 * t.sigBytes;
                // Return final computed hash
                return(// Add padding
                e[n >>> 5] |= 0x80 << 24 - n % 32, e[(n + 64 >>> 9 << 4) + 14] = r.floor(a / 0x100000000), e[(n + 64 >>> 9 << 4) + 15] = a, t.sigBytes = 4 * e.length, // Hash final blocks
                this._process(), this._hash);
            },
            clone: function() {
                var r = n.clone.call(this);
                return r._hash = this._hash.clone(), r;
            }
        });
        /**
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
			 */ a.SHA256 = n._createHelper(u), /**
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
			 */ a.HmacSHA256 = n._createHmacHelper(u);
    }(Math), // CommonJS
    r.exports = a.SHA256;
/***/ };
