export default function(r, t, e) {
    var n;
    return n = function(r) {
        var t, e, n, o, s, a, i, c, h;
        return t = Math, n = (e = r.lib).WordArray, o = e.Hasher, s = r.algo, a = [], i = [], // Compute constants
        function() {
            function r(r) {
                return (r - (0 | r)) * 0x100000000 | 0;
            }
            for(var e = 2, n = 0; n < 64;)(function(r) {
                for(var e = t.sqrt(r), n = 2; n <= e; n++)if (!(r % n)) return !1;
                return !0;
            })(e) && (n < 8 && (a[n] = r(t.pow(e, 0.5))), i[n] = r(t.pow(e, 1 / 3)), n++), e++;
        }(), c = [], h = s.SHA256 = o.extend({
            _doReset: function() {
                this._hash = new n.init(a.slice(0));
            },
            _doProcessBlock: function(r, t) {
                // Computation
                for(var e = this._hash.words, n = e[0], o = e[1], s = e[2], a = e[3], h = e[4], u = e[5], f = e[6], l = e[7], _ = 0; _ < 64; _++){
                    if (_ < 16) c[_] = 0 | r[t + _];
                    else {
                        var d = c[_ - 15], v = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3, H = c[_ - 2], p = (H << 15 | H >>> 17) ^ (H << 13 | H >>> 19) ^ H >>> 10;
                        c[_] = v + c[_ - 7] + p + c[_ - 16];
                    }
                    var w = h & u ^ ~h & f, x = n & o ^ n & s ^ o & s, A = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22), g = l + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + w + i[_] + c[_], y = A + x;
                    l = f, f = u, u = h, h = a + g | 0, a = s, s = o, o = n, n = g + y | 0;
                }
                // Intermediate hash value
                e[0] = e[0] + n | 0, e[1] = e[1] + o | 0, e[2] = e[2] + s | 0, e[3] = e[3] + a | 0, e[4] = e[4] + h | 0, e[5] = e[5] + u | 0, e[6] = e[6] + f | 0, e[7] = e[7] + l | 0;
            },
            _doFinalize: function() {
                // Shortcuts
                var r = this._data, e = r.words, n = 8 * this._nDataBytes, o = 8 * r.sigBytes;
                // Return final computed hash
                return(// Add padding
                e[o >>> 5] |= 0x80 << 24 - o % 32, e[(o + 64 >>> 9 << 4) + 14] = t.floor(n / 0x100000000), e[(o + 64 >>> 9 << 4) + 15] = n, r.sigBytes = 4 * e.length, // Hash final blocks
                this._process(), this._hash);
            },
            clone: function() {
                var r = o.clone.call(this);
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
			 */ r.SHA256 = o._createHelper(h), /**
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
			 */ r.HmacSHA256 = o._createHmacHelper(h), r.SHA256;
    }, void // CommonJS
    (r.exports = n(e(8249)));
/***/ }
