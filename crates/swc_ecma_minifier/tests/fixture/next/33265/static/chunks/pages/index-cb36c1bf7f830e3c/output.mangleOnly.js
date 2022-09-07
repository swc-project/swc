(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        7154: function(e) {
            function t() {
                (e.exports = t = Object.assign || function(e) {
                    for(var t = 1; t < arguments.length; t++){
                        var r = arguments[t];
                        for(var n in r){
                            if (Object.prototype.hasOwnProperty.call(r, n)) {
                                e[n] = r[n];
                            }
                        }
                    }
                    return e;
                }), (e.exports.__esModule = true), (e.exports["default"] = e.exports);
                return t.apply(this, arguments);
            }
            (e.exports = t), (e.exports.__esModule = true), (e.exports["default"] = e.exports);
        },
        562: function(e, t, r) {
            "use strict";
            r.d(t, {
                Ki: function() {
                    return c;
                },
                tm: function() {
                    return b;
                },
                hL: function() {
                    return y;
                },
                d3: function() {
                    return w;
                },
                qX: function() {
                    return E;
                },
                lx: function() {
                    return T;
                },
                G3: function() {
                    return N;
                }
            });
            var n = r(8908);
            var i = r.n(n);
            var a = function e(t, r) {
                var n = "";
                while(r--){
                    n += t;
                }
                return n;
            };
            var o = function e(t) {
                return t.toString(2).length;
            };
            var s = function e(t) {
                return Math.ceil(o(t) / 8);
            };
            var u = function e(t, r, n) {
                if (n === void 0) {
                    n = " ";
                }
                return (a(n, r) + t.toString()).slice(-r);
            };
            var f = function e(t) {
                return ArrayBuffer.isView(t);
            };
            var c = function e(t) {
                if (t instanceof Uint8Array) {
                    return t;
                }
                if (!Array.isArray(t) && !f(t) && !(t instanceof ArrayBuffer)) {
                    if (typeof t !== "number" || (typeof t === "number" && t !== t)) {
                        t = 0;
                    } else {
                        t = [
                            t
                        ];
                    }
                }
                return new Uint8Array((t && t.buffer) || t, (t && t.byteOffset) || 0, (t && t.byteLength) || 0);
            };
            var l = function e(t) {
                t = c(t);
                var r = "";
                for(var n = 0; n < t.length; n++){
                    r += u(t[n].toString(16), 2, "0");
                }
                return r;
            };
            var h = function e(t) {
                t = c(t);
                var r = "";
                for(var n = 0; n < t.length; n++){
                    r += u(t[n].toString(2), 8, "0");
                }
                return r;
            };
            var p = i().BigInt || Number;
            var v = [
                p("0x1"),
                p("0x100"),
                p("0x10000"),
                p("0x1000000"),
                p("0x100000000"),
                p("0x10000000000"),
                p("0x1000000000000"),
                p("0x100000000000000"),
                p("0x10000000000000000"), 
            ];
            var d = (function() {
                var e = new Uint16Array([
                    0xffcc
                ]);
                var t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
                if (t[0] === 0xff) {
                    return "big";
                }
                if (t[0] === 0xcc) {
                    return "little";
                }
                return "unknown";
            })();
            var g = d === "big";
            var m = d === "little";
            var b = function e(t, r) {
                var n = r === void 0 ? {} : r, i = n.signed, a = i === void 0 ? false : i, o = n.le, s = o === void 0 ? false : o;
                t = c(t);
                var u = s ? "reduce" : "reduceRight";
                var f = t[u] ? t[u] : Array.prototype[u];
                var l = f.call(t, function(e, r, n) {
                    var i = s ? n : Math.abs(n + 1 - t.length);
                    return e + p(r) * v[i];
                }, p(0));
                if (a) {
                    var h = v[t.length] / p(2) - p(1);
                    l = p(l);
                    if (l > h) {
                        l -= h;
                        l -= h;
                        l -= p(2);
                    }
                }
                return Number(l);
            };
            var y = function e(t, r) {
                var n = r === void 0 ? {} : r, i = n.le, a = i === void 0 ? false : i;
                if ((typeof t !== "bigint" && typeof t !== "number") || (typeof t === "number" && t !== t)) {
                    t = 0;
                }
                t = p(t);
                var o = s(t);
                var u = new Uint8Array(new ArrayBuffer(o));
                for(var f = 0; f < o; f++){
                    var c = a ? f : Math.abs(f + 1 - u.length);
                    u[c] = Number((t / v[f]) & p(0xff));
                    if (t < 0) {
                        u[c] = Math.abs(~u[c]);
                        u[c] -= f === 0 ? 1 : 2;
                    }
                }
                return u;
            };
            var w = function e(t) {
                if (!t) {
                    return "";
                }
                t = Array.prototype.slice.call(t);
                var r = String.fromCharCode.apply(null, c(t));
                try {
                    return decodeURIComponent(escape(r));
                } catch (n) {}
                return r;
            };
            var E = function e(t, r) {
                if (typeof t !== "string" && t && typeof t.toString === "function") {
                    t = t.toString();
                }
                if (typeof t !== "string") {
                    return new Uint8Array();
                }
                if (!r) {
                    t = unescape(encodeURIComponent(t));
                }
                var n = new Uint8Array(t.length);
                for(var i = 0; i < t.length; i++){
                    n[i] = t.charCodeAt(i);
                }
                return n;
            };
            var T = function e() {
                for(var t = arguments.length, r = new Array(t), n = 0; n < t; n++){
                    r[n] = arguments[n];
                }
                r = r.filter(function(e) {
                    return (e && (e.byteLength || e.length) && typeof e !== "string");
                });
                if (r.length <= 1) {
                    return c(r[0]);
                }
                var i = r.reduce(function(e, t, r) {
                    return e + (t.byteLength || t.length);
                }, 0);
                var a = new Uint8Array(i);
                var o = 0;
                r.forEach(function(e) {
                    e = c(e);
                    a.set(e, o);
                    o += e.byteLength;
                });
                return a;
            };
            var N = function e(t, r, n) {
                var i = n === void 0 ? {} : n, a = i.offset, o = a === void 0 ? 0 : a, s = i.mask, u = s === void 0 ? [] : s;
                t = c(t);
                r = c(r);
                var f = r.every ? r.every : Array.prototype.every;
                return (r.length && t.length - o >= r.length && f.call(r, function(e, r) {
                    var n = u[r] ? u[r] & t[o + r] : t[o + r];
                    return e === n;
                }));
            };
            var A = function e(t, r, n) {
                if (Uint8Array.prototype.slice) {
                    return Uint8Array.prototype.slice.call(t, r, n);
                }
                return new Uint8Array(Array.prototype.slice.call(t, r, n));
            };
            var S = function e(t) {
                if (t.reverse) {
                    return t.reverse();
                }
                return Array.prototype.reverse.call(t);
            };
        },
        2260: function(e, t, r) {
            "use strict";
            r.d(t, {
                ws: function() {
                    return u;
                },
                kS: function() {
                    return l;
                },
                Jg: function() {
                    return h;
                },
                KL: function() {
                    return v;
                },
                _5: function() {
                    return g;
                },
                p7: function() {
                    return m;
                },
                Hi: function() {
                    return b;
                },
                lA: function() {
                    return y;
                },
                xz: function() {
                    return w;
                }
            });
            var n = r(8908);
            var i = r.n(n);
            var a = {
                mp4: /^(av0?1|avc0?[1234]|vp0?9|flac|opus|mp3|mp4a|mp4v|stpp.ttml.im1t)/,
                webm: /^(vp0?[89]|av0?1|opus|vorbis)/,
                ogg: /^(vp0?[89]|theora|flac|opus|vorbis)/,
                video: /^(av0?1|avc0?[1234]|vp0?[89]|hvc1|hev1|theora|mp4v)/,
                audio: /^(mp4a|flac|vorbis|opus|ac-[34]|ec-3|alac|mp3|speex|aac)/,
                text: /^(stpp.ttml.im1t)/,
                muxerVideo: /^(avc0?1)/,
                muxerAudio: /^(mp4a)/,
                muxerText: /a^/
            };
            var o = [
                "video",
                "audio",
                "text"
            ];
            var s = [
                "Video",
                "Audio",
                "Text"
            ];
            var u = function e(t) {
                if (!t) {
                    return t;
                }
                return t.replace(/avc1\.(\d+)\.(\d+)/i, function(e, t, r) {
                    var n = ("00" + Number(t).toString(16)).slice(-2);
                    var i = ("00" + Number(r).toString(16)).slice(-2);
                    return "avc1." + n + "00" + i;
                });
            };
            var f = function e(t) {
                return t.map(u);
            };
            var c = function e(t) {
                return t.replace(/avc1\.(\d+)\.(\d+)/i, function(e) {
                    return f([
                        e
                    ])[0];
                });
            };
            var l = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                var r = t.split(",");
                var n = [];
                r.forEach(function(e) {
                    e = e.trim();
                    var t;
                    o.forEach(function(r) {
                        var i = a[r].exec(e.toLowerCase());
                        if (!i || i.length <= 1) {
                            return;
                        }
                        t = r;
                        var o = e.substring(0, i[1].length);
                        var s = e.replace(o, "");
                        n.push({
                            type: o,
                            details: s,
                            mediaType: r
                        });
                    });
                    if (!t) {
                        n.push({
                            type: e,
                            details: "",
                            mediaType: "unknown"
                        });
                    }
                });
                return n;
            };
            var h = function e(t, r) {
                if (!t.mediaGroups.AUDIO || !r) {
                    return null;
                }
                var n = t.mediaGroups.AUDIO[r];
                if (!n) {
                    return null;
                }
                for(var i in n){
                    var a = n[i];
                    if (a.default && a.playlists) {
                        return l(a.playlists[0].attributes.CODECS);
                    }
                }
                return null;
            };
            var p = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                return a.video.test(t.trim().toLowerCase());
            };
            var v = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                return a.audio.test(t.trim().toLowerCase());
            };
            var d = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                return a.text.test(t.trim().toLowerCase());
            };
            var g = function e(t) {
                if (!t || typeof t !== "string") {
                    return;
                }
                var r = t.toLowerCase().split(",").map(function(e) {
                    return u(e.trim());
                });
                var n = "video";
                if (r.length === 1 && v(r[0])) {
                    n = "audio";
                } else if (r.length === 1 && d(r[0])) {
                    n = "application";
                }
                var i = "mp4";
                if (r.every(function(e) {
                    return a.mp4.test(e);
                })) {
                    i = "mp4";
                } else if (r.every(function(e) {
                    return a.webm.test(e);
                })) {
                    i = "webm";
                } else if (r.every(function(e) {
                    return a.ogg.test(e);
                })) {
                    i = "ogg";
                }
                return n + "/" + i + ';codecs="' + t + '"';
            };
            var m = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                return ((i().MediaSource && i().MediaSource.isTypeSupported && i().MediaSource.isTypeSupported(g(t))) || false);
            };
            var b = function e(t) {
                if (t === void 0) {
                    t = "";
                }
                return t.toLowerCase().split(",").every(function(e) {
                    e = e.trim();
                    for(var t = 0; t < s.length; t++){
                        var r = s[t];
                        if (a["muxer" + r].test(e)) {
                            return true;
                        }
                    }
                    return false;
                });
            };
            var y = "mp4a.40.2";
            var w = "avc1.4d400d";
        },
        6185: function(e, t, r) {
            "use strict";
            r.d(t, {
                Xm: function() {
                    return z;
                },
                cz: function() {
                    return K;
                }
            });
            var n = r(562);
            var i = function e(t) {
                var r = "";
                var n = t[1] >>> 3;
                var i = t[1] & 0x1f;
                var a = t[2] >>> 7;
                var o = (t[2] & 0x40) >> 6;
                var s = (t[2] & 0x20) >> 5;
                var u = (t[2] & 0x10) >> 4;
                var f = (t[2] & 0x08) >> 3;
                var c = (t[2] & 0x04) >> 2;
                var l = t[2] & 0x03;
                r += n + "." + padStart(i, 2, "0");
                if (a === 0) {
                    r += "M";
                } else if (a === 1) {
                    r += "H";
                }
                var h;
                if (n === 2 && o) {
                    h = s ? 12 : 10;
                } else {
                    h = o ? 10 : 8;
                }
                r += "." + padStart(h, 2, "0");
                r += "." + u;
                r += "." + f + c + l;
                return r;
            };
            var a = function e(t) {
                var r = toHexString(t[1]);
                var n = toHexString(t[2] & 0xfc);
                var i = toHexString(t[3]);
                return "" + r + n + i;
            };
            var o = function e(t) {
                var r = "";
                var n = t[1] >> 6;
                var i = t[1] & 0x1f;
                var a = (t[1] & 0x20) >> 5;
                var o = t.subarray(2, 6);
                var s = t.subarray(6, 12);
                var u = t[12];
                if (n === 1) {
                    r += "A";
                } else if (n === 2) {
                    r += "B";
                } else if (n === 3) {
                    r += "C";
                }
                r += i + ".";
                var f = parseInt(toBinaryString(o).split("").reverse().join(""), 2);
                if (f > 255) {
                    f = parseInt(toBinaryString(o), 2);
                }
                r += f.toString(16) + ".";
                if (a === 0) {
                    r += "L";
                } else {
                    r += "H";
                }
                r += u;
                var c = "";
                for(var l = 0; l < s.length; l++){
                    var h = s[l];
                    if (h) {
                        if (c) {
                            c += ".";
                        }
                        c += h.toString(16);
                    }
                }
                if (c) {
                    r += "." + c;
                }
                return r;
            };
            var s = new Uint8Array([
                0x4f,
                0x70,
                0x75,
                0x73,
                0x48,
                0x65,
                0x61,
                0x64, 
            ]);
            var u = function e(t) {
                var r = new DataView(t.buffer, t.byteOffset, t.byteLength);
                var n = r.getUint8(0);
                var i = n !== 0;
                var a = {
                    version: n,
                    channels: r.getUint8(1),
                    preSkip: r.getUint16(2, i),
                    sampleRate: r.getUint32(4, i),
                    outputGain: r.getUint16(8, i),
                    channelMappingFamily: r.getUint8(10)
                };
                if (a.channelMappingFamily > 0 && t.length > 10) {
                    a.streamCount = r.getUint8(11);
                    a.twoChannelStreamCount = r.getUint8(12);
                    a.channelMapping = [];
                    for(var o = 0; o < a.channels; o++){
                        a.channelMapping.push(r.getUint8(13 + o));
                    }
                }
                return a;
            };
            var f = function e(t) {
                var r = t.channelMappingFamily <= 0 ? 11 : 12 + t.channels;
                var n = new DataView(new ArrayBuffer(r));
                var i = t.version !== 0;
                n.setUint8(0, t.version);
                n.setUint8(1, t.channels);
                n.setUint16(2, t.preSkip, i);
                n.setUint32(4, t.sampleRate, i);
                n.setUint16(8, t.outputGain, i);
                n.setUint8(10, t.channelMappingFamily);
                if (t.channelMappingFamily > 0) {
                    n.setUint8(11, t.streamCount);
                    t.channelMapping.foreach(function(e, t) {
                        n.setUint8(12 + t, e);
                    });
                }
                return new Uint8Array(n.buffer);
            };
            var c = function e(t) {
                if (typeof t === "string") {
                    return (0, n.qX)(t);
                }
                if (typeof t === "number") {
                    return t;
                }
                return t;
            };
            var l = function e(t) {
                if (!Array.isArray(t)) {
                    return [
                        c(t)
                    ];
                }
                return t.map(function(e) {
                    return c(e);
                });
            };
            var h;
            var p = function e(t) {
                t = (0, n.Ki)(t);
                var r = [];
                var i = 0;
                while(t.length > i){
                    var a = t[i];
                    var o = 0;
                    var s = 0;
                    s++;
                    var u = t[s];
                    s++;
                    while(u & 0x80){
                        o = (u & 0x7f) << 7;
                        u = t[s];
                        s++;
                    }
                    o += u & 0x7f;
                    for(var f = 0; f < h.length; f++){
                        var c = h[f], l = c.id, p = c.parser;
                        if (a === l) {
                            r.push(p(t.subarray(s, s + o)));
                            break;
                        }
                    }
                    i += o + s;
                }
                return r;
            };
            h = [
                {
                    id: 0x03,
                    parser: function e(t) {
                        var r = {
                            tag: 0x03,
                            id: (t[0] << 8) | t[1],
                            flags: t[2],
                            size: 3,
                            dependsOnEsId: 0,
                            ocrEsId: 0,
                            descriptors: [],
                            url: ""
                        };
                        if (r.flags & 0x80) {
                            r.dependsOnEsId = (t[r.size] << 8) | t[r.size + 1];
                            r.size += 2;
                        }
                        if (r.flags & 0x40) {
                            var i = t[r.size];
                            r.url = (0, n.d3)(t.subarray(r.size + 1, r.size + 1 + i));
                            r.size += i;
                        }
                        if (r.flags & 0x20) {
                            r.ocrEsId = (t[r.size] << 8) | t[r.size + 1];
                            r.size += 2;
                        }
                        r.descriptors = p(t.subarray(r.size)) || [];
                        return r;
                    }
                },
                {
                    id: 0x04,
                    parser: function e(t) {
                        var r = {
                            tag: 0x04,
                            oti: t[0],
                            streamType: t[1],
                            bufferSize: (t[2] << 16) | (t[3] << 8) | t[4],
                            maxBitrate: (t[5] << 24) | (t[6] << 16) | (t[7] << 8) | t[8],
                            avgBitrate: (t[9] << 24) | (t[10] << 16) | (t[11] << 8) | t[12],
                            descriptors: p(t.subarray(13))
                        };
                        return r;
                    }
                },
                {
                    id: 0x05,
                    parser: function e(t) {
                        return {
                            tag: 0x05,
                            bytes: t
                        };
                    }
                },
                {
                    id: 0x06,
                    parser: function e(t) {
                        return {
                            tag: 0x06,
                            bytes: t
                        };
                    }
                }, 
            ];
            var v = function e(t, r, i) {
                if (i === void 0) {
                    i = false;
                }
                r = l(r);
                t = (0, n.Ki)(t);
                var a = [];
                if (!r.length) {
                    return a;
                }
                var o = 0;
                while(o < t.length){
                    var s = ((t[o] << 24) | (t[o + 1] << 16) | (t[o + 2] << 8) | t[o + 3]) >>> 0;
                    var u = t.subarray(o + 4, o + 8);
                    if (s === 0) {
                        break;
                    }
                    var f = o + s;
                    if (f > t.length) {
                        if (i) {
                            break;
                        }
                        f = t.length;
                    }
                    var c = t.subarray(o + 8, f);
                    if ((0, n.G3)(u, r[0])) {
                        if (r.length === 1) {
                            a.push(c);
                        } else {
                            a.push.apply(a, e(c, r.slice(1), i));
                        }
                    }
                    o = f;
                }
                return a;
            };
            var d = function e(t, r) {
                r = c(r);
                if (!r.length) {
                    return t.subarray(t.length);
                }
                var n = 0;
                while(n < t.length){
                    if (bytesMatch(t.subarray(n, n + r.length), r)) {
                        var i = ((t[n - 4] << 24) | (t[n - 3] << 16) | (t[n - 2] << 8) | t[n - 1]) >>> 0;
                        var a = i > 1 ? n + i : t.byteLength;
                        return t.subarray(n + 4, a);
                    }
                    n++;
                }
                return t.subarray(t.length);
            };
            var g = function e(t, r, n) {
                if (r === void 0) {
                    r = 4;
                }
                if (n === void 0) {
                    n = function e(t) {
                        return bytesToNumber(t);
                    };
                }
                var i = [];
                if (!t || !t.length) {
                    return i;
                }
                var a = bytesToNumber(t.subarray(4, 8));
                for(var o = 8; a; o += r, a--){
                    i.push(n(t.subarray(o, o + r)));
                }
                return i;
            };
            var m = function e(t, r) {
                var n = g(v(t, [
                    "stss"
                ])[0]);
                var i = g(v(t, [
                    "stco"
                ])[0]);
                var a = g(v(t, [
                    "stts"
                ])[0], 8, function(e) {
                    return {
                        sampleCount: bytesToNumber(e.subarray(0, 4)),
                        sampleDelta: bytesToNumber(e.subarray(4, 8))
                    };
                });
                var o = g(v(t, [
                    "stsc"
                ])[0], 12, function(e) {
                    return {
                        firstChunk: bytesToNumber(e.subarray(0, 4)),
                        samplesPerChunk: bytesToNumber(e.subarray(4, 8)),
                        sampleDescriptionIndex: bytesToNumber(e.subarray(8, 12))
                    };
                });
                var s = v(t, [
                    "stsz"
                ])[0];
                var u = g((s && s.length && s.subarray(4)) || null);
                var f = [];
                for(var c = 0; c < i.length; c++){
                    var l = void 0;
                    for(var h = 0; h < o.length; h++){
                        var p = o[h];
                        var d = c + 1 >= p.firstChunk && (h + 1 >= o.length || c + 1 < o[h + 1].firstChunk);
                        if (d) {
                            l = p.samplesPerChunk;
                            break;
                        }
                    }
                    var m = i[c];
                    for(var b = 0; b < l; b++){
                        var y = u[f.length];
                        var w = !n.length;
                        if (n.length && n.indexOf(f.length + 1) !== -1) {
                            w = true;
                        }
                        var E = {
                            keyframe: w,
                            start: m,
                            end: m + y
                        };
                        for(var T = 0; T < a.length; T++){
                            var N = a[T], A = N.sampleCount, S = N.sampleDelta;
                            if (f.length <= A) {
                                var x = f.length ? f[f.length - 1].timestamp : 0;
                                E.timestamp = x + (S / r) * 1000;
                                E.duration = S;
                                break;
                            }
                        }
                        f.push(E);
                        m += y;
                    }
                }
                return f;
            };
            var b = function e(t, r) {
                var n = bytesToString(r.subarray(0, 4));
                if (t.type === "video") {
                    t.info = t.info || {};
                    t.info.width = (r[28] << 8) | r[29];
                    t.info.height = (r[30] << 8) | r[31];
                } else if (t.type === "audio") {
                    t.info = t.info || {};
                    t.info.channels = (r[20] << 8) | r[21];
                    t.info.bitDepth = (r[22] << 8) | r[23];
                    t.info.sampleRate = (r[28] << 8) | r[29];
                }
                if (n === "avc1") {
                    var i = d(r, "avcC");
                    n += "." + getAvcCodec(i);
                    t.info.avcC = i;
                } else if (n === "hvc1" || n === "hev1") {
                    n += "." + getHvcCodec(d(r, "hvcC"));
                } else if (n === "mp4a" || n === "mp4v") {
                    var a = d(r, "esds");
                    var o = p(a.subarray(4))[0];
                    var s = o && o.descriptors.filter(function(e) {
                        var t = e.tag;
                        return t === 0x04;
                    })[0];
                    if (s) {
                        n += "." + toHexString(s.oti);
                        if (s.oti === 0x40) {
                            n += "." + (s.descriptors[0].bytes[0] >> 3).toString();
                        } else if (s.oti === 0x20) {
                            n += "." + s.descriptors[0].bytes[4].toString();
                        } else if (s.oti === 0xdd) {
                            n = "vorbis";
                        }
                    } else if (t.type === "audio") {
                        n += ".40.2";
                    } else {
                        n += ".20.9";
                    }
                } else if (n === "av01") {
                    n += "." + getAv1Codec(d(r, "av1C"));
                } else if (n === "vp09") {
                    var u = d(r, "vpcC");
                    var f = u[0];
                    var c = u[1];
                    var l = u[2] >> 4;
                    var h = (u[2] & 0x0f) >> 1;
                    var v = (u[2] & 0x0f) >> 3;
                    var g = u[3];
                    var m = u[4];
                    var b = u[5];
                    n += "." + padStart(f, 2, "0");
                    n += "." + padStart(c, 2, "0");
                    n += "." + padStart(l, 2, "0");
                    n += "." + padStart(h, 2, "0");
                    n += "." + padStart(g, 2, "0");
                    n += "." + padStart(m, 2, "0");
                    n += "." + padStart(b, 2, "0");
                    n += "." + padStart(v, 2, "0");
                } else if (n === "theo") {
                    n = "theora";
                } else if (n === "spex") {
                    n = "speex";
                } else if (n === ".mp3") {
                    n = "mp4a.40.34";
                } else if (n === "msVo") {
                    n = "vorbis";
                } else if (n === "Opus") {
                    n = "opus";
                    var y = d(r, "dOps");
                    t.info.opus = parseOpusHead(y);
                    t.info.codecDelay = 6500000;
                } else {
                    n = n.toLowerCase();
                }
                t.codec = n;
            };
            var y = function e(t, r) {
                if (r === void 0) {
                    r = true;
                }
                t = toUint8(t);
                var n = v(t, [
                    "moov",
                    "trak"
                ], true);
                var i = [];
                n.forEach(function(e) {
                    var t = {
                        bytes: e
                    };
                    var n = v(e, [
                        "mdia"
                    ])[0];
                    var a = v(n, [
                        "hdlr"
                    ])[0];
                    var o = bytesToString(a.subarray(8, 12));
                    if (o === "soun") {
                        t.type = "audio";
                    } else if (o === "vide") {
                        t.type = "video";
                    } else {
                        t.type = o;
                    }
                    var s = v(e, [
                        "tkhd"
                    ])[0];
                    if (s) {
                        var u = new DataView(s.buffer, s.byteOffset, s.byteLength);
                        var f = u.getUint8(0);
                        t.number = f === 0 ? u.getUint32(12) : u.getUint32(20);
                    }
                    var c = v(n, [
                        "mdhd"
                    ])[0];
                    if (c) {
                        var l = c[0];
                        var h = l === 0 ? 12 : 20;
                        t.timescale = ((c[h] << 24) | (c[h + 1] << 16) | (c[h + 2] << 8) | c[h + 3]) >>> 0;
                    }
                    var p = v(n, [
                        "minf",
                        "stbl"
                    ])[0];
                    var d = v(p, [
                        "stsd"
                    ])[0];
                    var g = bytesToNumber(d.subarray(4, 8));
                    var y = 8;
                    while(g--){
                        var w = bytesToNumber(d.subarray(y, y + 4));
                        var E = d.subarray(y + 4, y + 4 + w);
                        b(t, E);
                        y += 4 + w;
                    }
                    if (r) {
                        t.frameTable = m(p, t.timescale);
                    }
                    i.push(t);
                });
                return i;
            };
            var w = function e(t) {
                var r = v(t, [
                    "moov",
                    "mvhd"
                ], true)[0];
                if (!r || !r.length) {
                    return;
                }
                var n = {};
                if (r[0] === 1) {
                    n.timestampScale = bytesToNumber(r.subarray(20, 24));
                    n.duration = bytesToNumber(r.subarray(24, 32));
                } else {
                    n.timestampScale = bytesToNumber(r.subarray(12, 16));
                    n.duration = bytesToNumber(r.subarray(16, 20));
                }
                n.bytes = r;
                return n;
            };
            var E = {
                EBML: (0, n.Ki)([
                    0x1a,
                    0x45,
                    0xdf,
                    0xa3, 
                ]),
                DocType: (0, n.Ki)([
                    0x42,
                    0x82
                ]),
                Segment: (0, n.Ki)([
                    0x18,
                    0x53,
                    0x80,
                    0x67, 
                ]),
                SegmentInfo: (0, n.Ki)([
                    0x15,
                    0x49,
                    0xa9,
                    0x66, 
                ]),
                Tracks: (0, n.Ki)([
                    0x16,
                    0x54,
                    0xae,
                    0x6b, 
                ]),
                Track: (0, n.Ki)([
                    0xae
                ]),
                TrackNumber: (0, n.Ki)([
                    0xd7
                ]),
                DefaultDuration: (0, n.Ki)([
                    0x23,
                    0xe3,
                    0x83, 
                ]),
                TrackEntry: (0, n.Ki)([
                    0xae
                ]),
                TrackType: (0, n.Ki)([
                    0x83
                ]),
                FlagDefault: (0, n.Ki)([
                    0x88
                ]),
                CodecID: (0, n.Ki)([
                    0x86
                ]),
                CodecPrivate: (0, n.Ki)([
                    0x63,
                    0xa2
                ]),
                VideoTrack: (0, n.Ki)([
                    0xe0
                ]),
                AudioTrack: (0, n.Ki)([
                    0xe1
                ]),
                Cluster: (0, n.Ki)([
                    0x1f,
                    0x43,
                    0xb6,
                    0x75, 
                ]),
                Timestamp: (0, n.Ki)([
                    0xe7
                ]),
                TimestampScale: (0, n.Ki)([
                    0x2a,
                    0xd7,
                    0xb1, 
                ]),
                BlockGroup: (0, n.Ki)([
                    0xa0
                ]),
                BlockDuration: (0, n.Ki)([
                    0x9b
                ]),
                Block: (0, n.Ki)([
                    0xa1
                ]),
                SimpleBlock: (0, n.Ki)([
                    0xa3
                ])
            };
            var T = [
                128,
                64,
                32,
                16,
                8,
                4,
                2,
                1
            ];
            var N = function e(t) {
                var r = 1;
                for(var n = 0; n < T.length; n++){
                    if (t & T[n]) {
                        break;
                    }
                    r++;
                }
                return r;
            };
            var A = function e(t, r, i, a) {
                if (i === void 0) {
                    i = true;
                }
                if (a === void 0) {
                    a = false;
                }
                var o = N(t[r]);
                var s = t.subarray(r, r + o);
                if (i) {
                    s = Array.prototype.slice.call(t, r, r + o);
                    s[0] ^= T[o - 1];
                }
                return {
                    length: o,
                    value: (0, n.tm)(s, {
                        signed: a
                    }),
                    bytes: s
                };
            };
            var S = function e(t) {
                if (typeof t === "string") {
                    return t.match(/.{1,2}/g).map(function(t) {
                        return e(t);
                    });
                }
                if (typeof t === "number") {
                    return (0, n.hL)(t);
                }
                return t;
            };
            var x = function e(t) {
                if (!Array.isArray(t)) {
                    return [
                        S(t)
                    ];
                }
                return t.map(function(e) {
                    return S(e);
                });
            };
            var I = function e(t, r, i) {
                if (i >= r.length) {
                    return r.length;
                }
                var a = A(r, i, false);
                if ((0, n.G3)(t.bytes, a.bytes)) {
                    return i;
                }
                var o = A(r, i + a.length);
                return e(t, r, i + o.length + o.value + a.length);
            };
            var C = function e(t, r) {
                r = x(r);
                t = (0, n.Ki)(t);
                var i = [];
                if (!r.length) {
                    return i;
                }
                var a = 0;
                while(a < t.length){
                    var o = A(t, a, false);
                    var s = A(t, a + o.length);
                    var u = a + o.length + s.length;
                    if (s.value === 0x7f) {
                        s.value = I(o, t, u);
                        if (s.value !== t.length) {
                            s.value -= u;
                        }
                    }
                    var f = u + s.value > t.length ? t.length : u + s.value;
                    var c = t.subarray(u, f);
                    if ((0, n.G3)(r[0], o.bytes)) {
                        if (r.length === 1) {
                            i.push(c);
                        } else {
                            i = i.concat(e(c, r.slice(1)));
                        }
                    }
                    var l = o.length + s.length + c.length;
                    a += l;
                }
                return i;
            };
            var R = function e(t, r, n, i) {
                var a;
                if (r === "group") {
                    a = C(t, [
                        E.BlockDuration
                    ])[0];
                    if (a) {
                        a = bytesToNumber(a);
                        a = ((1 / n) * a * n) / 1000;
                    }
                    t = C(t, [
                        E.Block
                    ])[0];
                    r = "block";
                }
                var o = new DataView(t.buffer, t.byteOffset, t.byteLength);
                var s = A(t, 0);
                var u = o.getInt16(s.length, false);
                var f = t[s.length + 2];
                var c = t.subarray(s.length + 3);
                var l = ((1 / n) * (i + u) * n) / 1000;
                var h = {
                    duration: a,
                    trackNumber: s.value,
                    keyframe: r === "simple" && f >> 7 === 1,
                    invisible: (f & 0x08) >> 3 === 1,
                    lacing: (f & 0x06) >> 1,
                    discardable: r === "simple" && (f & 0x01) === 1,
                    frames: [],
                    pts: l,
                    dts: l,
                    timestamp: u
                };
                if (!h.lacing) {
                    h.frames.push(c);
                    return h;
                }
                var p = c[0] + 1;
                var v = [];
                var d = 1;
                if (h.lacing === 2) {
                    var g = (c.length - d) / p;
                    for(var m = 0; m < p; m++){
                        v.push(g);
                    }
                }
                if (h.lacing === 1) {
                    for(var b = 0; b < p - 1; b++){
                        var y = 0;
                        do {
                            y += c[d];
                            d++;
                        }while (c[d - 1] === 0xff)
                        v.push(y);
                    }
                }
                if (h.lacing === 3) {
                    var w = 0;
                    for(var T = 0; T < p - 1; T++){
                        var N = T === 0 ? A(c, d) : A(c, d, true, true);
                        w += N.value;
                        v.push(w);
                        d += N.length;
                    }
                }
                v.forEach(function(e) {
                    h.frames.push(c.subarray(d, d + e));
                    d += e;
                });
                return h;
            };
            var O = function e(t) {
                var r = 0;
                var n = {};
                while(r < t.length){
                    var i = t[r] & 0x7f;
                    var a = t[r + 1];
                    var o = void 0;
                    if (a === 1) {
                        o = t[r + 2];
                    } else {
                        o = t.subarray(r + 2, r + 2 + a);
                    }
                    if (i === 1) {
                        n.profile = o;
                    } else if (i === 2) {
                        n.level = o;
                    } else if (i === 3) {
                        n.bitDepth = o;
                    } else if (i === 4) {
                        n.chromaSubsampling = o;
                    } else {
                        n[i] = o;
                    }
                    r += 2 + a;
                }
                return n;
            };
            var D = function e(t) {
                t = toUint8(t);
                var r = [];
                var n = C(t, [
                    E.Segment,
                    E.Tracks,
                    E.Track, 
                ]);
                if (!n.length) {
                    n = C(t, [
                        E.Tracks,
                        E.Track, 
                    ]);
                }
                if (!n.length) {
                    n = C(t, [
                        E.Track
                    ]);
                }
                if (!n.length) {
                    return r;
                }
                n.forEach(function(e) {
                    var t = C(e, E.TrackType)[0];
                    if (!t || !t.length) {
                        return;
                    }
                    if (t[0] === 1) {
                        t = "video";
                    } else if (t[0] === 2) {
                        t = "audio";
                    } else if (t[0] === 17) {
                        t = "subtitle";
                    } else {
                        return;
                    }
                    var n = {
                        rawCodec: bytesToString(C(e, [
                            E.CodecID
                        ])[0]),
                        type: t,
                        codecPrivate: C(e, [
                            E.CodecPrivate, 
                        ])[0],
                        number: bytesToNumber(C(e, [
                            E.TrackNumber
                        ])[0]),
                        defaultDuration: bytesToNumber(C(e, [
                            E.DefaultDuration
                        ])[0]),
                        default: C(e, [
                            E.FlagDefault
                        ])[0],
                        rawData: e
                    };
                    var i = "";
                    if (/V_MPEG4\/ISO\/AVC/.test(n.rawCodec)) {
                        i = "avc1." + getAvcCodec(n.codecPrivate);
                    } else if (/V_MPEGH\/ISO\/HEVC/.test(n.rawCodec)) {
                        i = "hev1." + getHvcCodec(n.codecPrivate);
                    } else if (/V_MPEG4\/ISO\/ASP/.test(n.rawCodec)) {
                        if (n.codecPrivate) {
                            i = "mp4v.20." + n.codecPrivate[4].toString();
                        } else {
                            i = "mp4v.20.9";
                        }
                    } else if (/^V_THEORA/.test(n.rawCodec)) {
                        i = "theora";
                    } else if (/^V_VP8/.test(n.rawCodec)) {
                        i = "vp8";
                    } else if (/^V_VP9/.test(n.rawCodec)) {
                        if (n.codecPrivate) {
                            var a = O(n.codecPrivate), o = a.profile, s = a.level, u = a.bitDepth, f = a.chromaSubsampling;
                            i = "vp09.";
                            i += padStart(o, 2, "0") + ".";
                            i += padStart(s, 2, "0") + ".";
                            i += padStart(u, 2, "0") + ".";
                            i += "" + padStart(f, 2, "0");
                            var c = C(e, [
                                0xe0,
                                [
                                    0x55,
                                    0xb0
                                ],
                                [
                                    0x55,
                                    0xb1
                                ], 
                            ])[0] || [];
                            var l = C(e, [
                                0xe0,
                                [
                                    0x55,
                                    0xb0
                                ],
                                [
                                    0x55,
                                    0xb9
                                ], 
                            ])[0] || [];
                            var h = C(e, [
                                0xe0,
                                [
                                    0x55,
                                    0xb0
                                ],
                                [
                                    0x55,
                                    0xba
                                ], 
                            ])[0] || [];
                            var p = C(e, [
                                0xe0,
                                [
                                    0x55,
                                    0xb0
                                ],
                                [
                                    0x55,
                                    0xbb
                                ], 
                            ])[0] || [];
                            if (c.length || l.length || h.length || p.length) {
                                i += "." + padStart(p[0], 2, "0");
                                i += "." + padStart(h[0], 2, "0");
                                i += "." + padStart(c[0], 2, "0");
                                i += "." + padStart(l[0], 2, "0");
                            }
                        } else {
                            i = "vp9";
                        }
                    } else if (/^V_AV1/.test(n.rawCodec)) {
                        i = "av01." + getAv1Codec(n.codecPrivate);
                    } else if (/A_ALAC/.test(n.rawCodec)) {
                        i = "alac";
                    } else if (/A_MPEG\/L2/.test(n.rawCodec)) {
                        i = "mp2";
                    } else if (/A_MPEG\/L3/.test(n.rawCodec)) {
                        i = "mp3";
                    } else if (/^A_AAC/.test(n.rawCodec)) {
                        if (n.codecPrivate) {
                            i = "mp4a.40." + (n.codecPrivate[0] >>> 3).toString();
                        } else {
                            i = "mp4a.40.2";
                        }
                    } else if (/^A_AC3/.test(n.rawCodec)) {
                        i = "ac-3";
                    } else if (/^A_PCM/.test(n.rawCodec)) {
                        i = "pcm";
                    } else if (/^A_MS\/ACM/.test(n.rawCodec)) {
                        i = "speex";
                    } else if (/^A_EAC3/.test(n.rawCodec)) {
                        i = "ec-3";
                    } else if (/^A_VORBIS/.test(n.rawCodec)) {
                        i = "vorbis";
                    } else if (/^A_FLAC/.test(n.rawCodec)) {
                        i = "flac";
                    } else if (/^A_OPUS/.test(n.rawCodec)) {
                        i = "opus";
                    }
                    n.codec = i;
                    r.push(n);
                });
                return r.sort(function(e, t) {
                    return e.number - t.number;
                });
            };
            var L = function e(t, r) {
                var n = [];
                var i = C(t, [
                    E.Segment
                ])[0];
                var a = C(i, [
                    E.SegmentInfo,
                    E.TimestampScale, 
                ])[0];
                if (a && a.length) {
                    a = bytesToNumber(a);
                } else {
                    a = 1000000;
                }
                var o = C(i, [
                    E.Cluster
                ]);
                if (!r) {
                    r = D(i);
                }
                o.forEach(function(e, t) {
                    var r = C(e, [
                        E.SimpleBlock, 
                    ]).map(function(e) {
                        return {
                            type: "simple",
                            data: e
                        };
                    });
                    var i = C(e, [
                        E.BlockGroup, 
                    ]).map(function(e) {
                        return {
                            type: "group",
                            data: e
                        };
                    });
                    var o = C(e, [
                        E.Timestamp
                    ])[0] || 0;
                    if (o && o.length) {
                        o = bytesToNumber(o);
                    }
                    var s = r.concat(i).sort(function(e, t) {
                        return e.data.byteOffset - t.data.byteOffset;
                    });
                    s.forEach(function(e, t) {
                        var r = R(e.data, e.type, a, o);
                        n.push(r);
                    });
                });
                return {
                    tracks: r,
                    blocks: n
                };
            };
            var U = r(8925);
            var M = (0, n.Ki)([
                0x00,
                0x00,
                0x00,
                0x01, 
            ]);
            var P = (0, n.Ki)([
                0x00,
                0x00,
                0x01, 
            ]);
            var _ = (0, n.Ki)([
                0x00,
                0x00,
                0x03, 
            ]);
            var k = function e(t) {
                var r = [];
                var i = 1;
                while(i < t.length - 2){
                    if ((0, n.G3)(t.subarray(i, i + 3), _)) {
                        r.push(i + 2);
                        i++;
                    }
                    i++;
                }
                if (r.length === 0) {
                    return t;
                }
                var a = t.length - r.length;
                var o = new Uint8Array(a);
                var s = 0;
                for(i = 0; i < a; s++, i++){
                    if (s === r[0]) {
                        s++;
                        r.shift();
                    }
                    o[i] = t[s];
                }
                return o;
            };
            var B = function e(t, r, i, a) {
                if (a === void 0) {
                    a = Infinity;
                }
                t = (0, n.Ki)(t);
                i = [].concat(i);
                var o = 0;
                var s;
                var u = 0;
                while(o < t.length && (u < a || s)){
                    var f = void 0;
                    if ((0, n.G3)(t.subarray(o), M)) {
                        f = 4;
                    } else if ((0, n.G3)(t.subarray(o), P)) {
                        f = 3;
                    }
                    if (!f) {
                        o++;
                        continue;
                    }
                    u++;
                    if (s) {
                        return k(t.subarray(s, o));
                    }
                    var c = void 0;
                    if (r === "h264") {
                        c = t[o + f] & 0x1f;
                    } else if (r === "h265") {
                        c = (t[o + f] >> 1) & 0x3f;
                    }
                    if (i.indexOf(c) !== -1) {
                        s = o + f;
                    }
                    o += f + (r === "h264" ? 1 : 2);
                }
                return t.subarray(0, 0);
            };
            var X = function e(t, r, n) {
                return B(t, "h264", r, n);
            };
            var H = function e(t, r, n) {
                return B(t, "h265", r, n);
            };
            var V = {
                webm: (0, n.Ki)([
                    0x77,
                    0x65,
                    0x62,
                    0x6d, 
                ]),
                matroska: (0, n.Ki)([
                    0x6d,
                    0x61,
                    0x74,
                    0x72,
                    0x6f,
                    0x73,
                    0x6b,
                    0x61, 
                ]),
                flac: (0, n.Ki)([
                    0x66,
                    0x4c,
                    0x61,
                    0x43, 
                ]),
                ogg: (0, n.Ki)([
                    0x4f,
                    0x67,
                    0x67,
                    0x53, 
                ]),
                ac3: (0, n.Ki)([
                    0x0b,
                    0x77
                ]),
                riff: (0, n.Ki)([
                    0x52,
                    0x49,
                    0x46,
                    0x46, 
                ]),
                avi: (0, n.Ki)([
                    0x41,
                    0x56,
                    0x49
                ]),
                wav: (0, n.Ki)([
                    0x57,
                    0x41,
                    0x56,
                    0x45, 
                ]),
                "3gp": (0, n.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x33,
                    0x67, 
                ]),
                mp4: (0, n.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                fmp4: (0, n.Ki)([
                    0x73,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                mov: (0, n.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x71,
                    0x74, 
                ]),
                moov: (0, n.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x76, 
                ]),
                moof: (0, n.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x66, 
                ])
            };
            var G = {
                aac: function e(t) {
                    var r = (0, U.c)(t);
                    return (0, n.G3)(t, [
                        0xff,
                        0x10
                    ], {
                        offset: r,
                        mask: [
                            0xff,
                            0x16
                        ]
                    });
                },
                mp3: function e(t) {
                    var r = (0, U.c)(t);
                    return (0, n.G3)(t, [
                        0xff,
                        0x02
                    ], {
                        offset: r,
                        mask: [
                            0xff,
                            0x06
                        ]
                    });
                },
                webm: function e(t) {
                    var r = C(t, [
                        E.EBML,
                        E.DocType, 
                    ])[0];
                    return (0, n.G3)(r, V.webm);
                },
                mkv: function e(t) {
                    var r = C(t, [
                        E.EBML,
                        E.DocType, 
                    ])[0];
                    return (0, n.G3)(r, V.matroska);
                },
                mp4: function e(t) {
                    if (G["3gp"](t) || G.mov(t)) {
                        return false;
                    }
                    if ((0, n.G3)(t, V.mp4, {
                        offset: 4
                    }) || (0, n.G3)(t, V.fmp4, {
                        offset: 4
                    })) {
                        return true;
                    }
                    if ((0, n.G3)(t, V.moof, {
                        offset: 4
                    }) || (0, n.G3)(t, V.moov, {
                        offset: 4
                    })) {
                        return true;
                    }
                },
                mov: function e(t) {
                    return (0, n.G3)(t, V.mov, {
                        offset: 4
                    });
                },
                "3gp": function e(t) {
                    return (0, n.G3)(t, V["3gp"], {
                        offset: 4
                    });
                },
                ac3: function e(t) {
                    var r = (0, U.c)(t);
                    return (0, n.G3)(t, V.ac3, {
                        offset: r
                    });
                },
                ts: function e(t) {
                    if (t.length < 189 && t.length >= 1) {
                        return t[0] === 0x47;
                    }
                    var r = 0;
                    while(r + 188 < t.length && r < 188){
                        if (t[r] === 0x47 && t[r + 188] === 0x47) {
                            return true;
                        }
                        r += 1;
                    }
                    return false;
                },
                flac: function e(t) {
                    var r = (0, U.c)(t);
                    return (0, n.G3)(t, V.flac, {
                        offset: r
                    });
                },
                ogg: function e(t) {
                    return (0, n.G3)(t, V.ogg);
                },
                avi: function e(t) {
                    return ((0, n.G3)(t, V.riff) && (0, n.G3)(t, V.avi, {
                        offset: 8
                    }));
                },
                wav: function e(t) {
                    return ((0, n.G3)(t, V.riff) && (0, n.G3)(t, V.wav, {
                        offset: 8
                    }));
                },
                h264: function e(t) {
                    return X(t, 7, 3).length;
                },
                h265: function e(t) {
                    return H(t, [
                        32,
                        33
                    ], 3).length;
                }
            };
            var F = Object.keys(G).filter(function(e) {
                return e !== "ts" && e !== "h264" && e !== "h265";
            }).concat([
                "ts",
                "h264",
                "h265"
            ]);
            F.forEach(function(e) {
                var t = G[e];
                G[e] = function(e) {
                    return t((0, n.Ki)(e));
                };
            });
            var j = G;
            var z = function e(t) {
                t = (0, n.Ki)(t);
                for(var r = 0; r < F.length; r++){
                    var i = F[r];
                    if (j[i](t)) {
                        return i;
                    }
                }
                return "";
            };
            var K = function e(t) {
                return v(t, [
                    "moof"
                ]).length > 0;
            };
        },
        6722: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return s;
                }
            });
            var n = r(8908);
            var i = r.n(n);
            var a = r(816)["Buffer"];
            var o = function e(t) {
                return i().atob ? i().atob(t) : a.from(t, "base64").toString("binary");
            };
            function s(e) {
                var t = o(e);
                var r = new Uint8Array(t.length);
                for(var n = 0; n < t.length; n++){
                    r[n] = t.charCodeAt(n);
                }
                return r;
            }
        },
        8925: function(e, t, r) {
            "use strict";
            r.d(t, {
                c: function() {
                    return o;
                }
            });
            var n = r(562);
            var i = (0, n.Ki)([
                0x49,
                0x44,
                0x33, 
            ]);
            var a = function e(t, r) {
                if (r === void 0) {
                    r = 0;
                }
                t = (0, n.Ki)(t);
                var i = t[r + 5];
                var a = (t[r + 6] << 21) | (t[r + 7] << 14) | (t[r + 8] << 7) | t[r + 9];
                var o = (i & 16) >> 4;
                if (o) {
                    return a + 20;
                }
                return a + 10;
            };
            var o = function e(t, r) {
                if (r === void 0) {
                    r = 0;
                }
                t = (0, n.Ki)(t);
                if (t.length - r < 10 || !(0, n.G3)(t, i, {
                    offset: r
                })) {
                    return r;
                }
                r += a(t, r);
                return e(t, r);
            };
        },
        8485: function(e, t, r) {
            "use strict";
            r.d(t, {
                t: function() {
                    return a;
                }
            });
            var n = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;
            var i = /^application\/dash\+xml/i;
            var a = function e(t) {
                if (n.test(t)) {
                    return "hls";
                }
                if (i.test(t)) {
                    return "dash";
                }
                if (t === "application/vnd.videojs.vhs+json") {
                    return "vhs-json";
                }
                return null;
            };
        },
        779: function(e, t, r) {
            "use strict";
            var n = r(9945);
            var i = r.n(n);
            var a = r(8908);
            var o = r.n(a);
            var s = "http://example.com";
            var u = function e(t, r) {
                if (/^[a-z]+:/i.test(r)) {
                    return r;
                }
                if (/^data:/.test(t)) {
                    t = (o().location && o().location.href) || "";
                }
                var n = typeof o().URL === "function";
                var a = /^\/\//.test(t);
                var u = !o().location && !/\/\//i.test(t);
                if (n) {
                    t = new (o().URL)(t, o().location || s);
                } else if (!/\/\//i.test(t)) {
                    t = i().buildAbsoluteURL((o().location && o().location.href) || "", t);
                }
                if (n) {
                    var f = new URL(r, t);
                    if (u) {
                        return f.href.slice(s.length);
                    } else if (a) {
                        return f.href.slice(f.protocol.length);
                    }
                    return f.href;
                }
                return i().buildAbsoluteURL(t, r);
            };
            t["Z"] = u;
        },
        3490: function(e, t, r) {
            "use strict";
            var n = r(8908);
            var i = function e(t, r) {
                if (r === void 0) {
                    r = false;
                }
                return function(e, i, o) {
                    if (e) {
                        t(e);
                        return;
                    }
                    if (i.statusCode >= 400 && i.statusCode <= 599) {
                        var s = o;
                        if (r) {
                            if (n.TextDecoder) {
                                var u = a(i.headers && i.headers["content-type"]);
                                try {
                                    s = new TextDecoder(u).decode(o);
                                } catch (f) {}
                            } else {
                                s = String.fromCharCode.apply(null, new Uint8Array(o));
                            }
                        }
                        t({
                            cause: s
                        });
                        return;
                    }
                    t(null, o);
                };
            };
            function a(e) {
                if (e === void 0) {
                    e = "";
                }
                return e.toLowerCase().split(";").reduce(function(e, t) {
                    var r = t.split("="), n = r[0], i = r[1];
                    if (n.trim() === "charset") {
                        return i.trim();
                    }
                    return e;
                }, "utf-8");
            }
            e.exports = i;
        },
        9603: function(e, t, r) {
            "use strict";
            var n = r(8908);
            var i = r(7154);
            var a = r(7376);
            c.httpHandler = r(3490);
            var o = function e(t) {
                var r = {};
                if (!t) {
                    return r;
                }
                t.trim().split("\n").forEach(function(e) {
                    var t = e.indexOf(":");
                    var n = e.slice(0, t).trim().toLowerCase();
                    var i = e.slice(t + 1).trim();
                    if (typeof r[n] === "undefined") {
                        r[n] = i;
                    } else if (Array.isArray(r[n])) {
                        r[n].push(i);
                    } else {
                        r[n] = [
                            r[n],
                            i
                        ];
                    }
                });
                return r;
            };
            e.exports = c;
            e.exports["default"] = c;
            c.XMLHttpRequest = n.XMLHttpRequest || p;
            c.XDomainRequest = "withCredentials" in new c.XMLHttpRequest() ? c.XMLHttpRequest : n.XDomainRequest;
            s([
                "get",
                "put",
                "post",
                "patch",
                "head",
                "delete"
            ], function(e) {
                c[e === "delete" ? "del" : e] = function(t, r, n) {
                    r = f(t, r, n);
                    r.method = e.toUpperCase();
                    return l(r);
                };
            });
            function s(e, t) {
                for(var r = 0; r < e.length; r++){
                    t(e[r]);
                }
            }
            function u(e) {
                for(var t in e){
                    if (e.hasOwnProperty(t)) return false;
                }
                return true;
            }
            function f(e, t, r) {
                var n = e;
                if (a(t)) {
                    r = t;
                    if (typeof e === "string") {
                        n = {
                            uri: e
                        };
                    }
                } else {
                    n = i({}, t, {
                        uri: e
                    });
                }
                n.callback = r;
                return n;
            }
            function c(e, t, r) {
                t = f(e, t, r);
                return l(t);
            }
            function l(e) {
                if (typeof e.callback === "undefined") {
                    throw new Error("callback argument missing");
                }
                var t = false;
                var r = function r(n, i, a) {
                    if (!t) {
                        t = true;
                        e.callback(n, i, a);
                    }
                };
                function n() {
                    if (f.readyState === 4) {
                        setTimeout(s, 0);
                    }
                }
                function i() {
                    var e = undefined;
                    if (f.response) {
                        e = f.response;
                    } else {
                        e = f.responseText || h(f);
                    }
                    if (y) {
                        try {
                            e = JSON.parse(e);
                        } catch (t) {}
                    }
                    return e;
                }
                function a(e) {
                    clearTimeout(w);
                    if (!(e instanceof Error)) {
                        e = new Error("" + (e || "Unknown XMLHttpRequest Error"));
                    }
                    e.statusCode = 0;
                    return r(e, E);
                }
                function s() {
                    if (p) return;
                    var t;
                    clearTimeout(w);
                    if (e.useXDR && f.status === undefined) {
                        t = 200;
                    } else {
                        t = f.status === 1223 ? 204 : f.status;
                    }
                    var n = E;
                    var a = null;
                    if (t !== 0) {
                        n = {
                            body: i(),
                            statusCode: t,
                            method: d,
                            headers: {},
                            url: v,
                            rawRequest: f
                        };
                        if (f.getAllResponseHeaders) {
                            n.headers = o(f.getAllResponseHeaders());
                        }
                    } else {
                        a = new Error("Internal XMLHttpRequest Error");
                    }
                    return r(a, n, n.body);
                }
                var f = e.xhr || null;
                if (!f) {
                    if (e.cors || e.useXDR) {
                        f = new c.XDomainRequest();
                    } else {
                        f = new c.XMLHttpRequest();
                    }
                }
                var l;
                var p;
                var v = (f.url = e.uri || e.url);
                var d = (f.method = e.method || "GET");
                var g = e.body || e.data;
                var m = (f.headers = e.headers || {});
                var b = !!e.sync;
                var y = false;
                var w;
                var E = {
                    body: undefined,
                    headers: {},
                    statusCode: 0,
                    method: d,
                    url: v,
                    rawRequest: f
                };
                if ("json" in e && e.json !== false) {
                    y = true;
                    m["accept"] || m["Accept"] || (m["Accept"] = "application/json");
                    if (d !== "GET" && d !== "HEAD") {
                        m["content-type"] || m["Content-Type"] || (m["Content-Type"] = "application/json");
                        g = JSON.stringify(e.json === true ? g : e.json);
                    }
                }
                f.onreadystatechange = n;
                f.onload = s;
                f.onerror = a;
                f.onprogress = function() {};
                f.onabort = function() {
                    p = true;
                };
                f.ontimeout = a;
                f.open(d, v, !b, e.username, e.password);
                if (!b) {
                    f.withCredentials = !!e.withCredentials;
                }
                if (!b && e.timeout > 0) {
                    w = setTimeout(function() {
                        if (p) return;
                        p = true;
                        f.abort("timeout");
                        var e = new Error("XMLHttpRequest timeout");
                        e.code = "ETIMEDOUT";
                        a(e);
                    }, e.timeout);
                }
                if (f.setRequestHeader) {
                    for(l in m){
                        if (m.hasOwnProperty(l)) {
                            f.setRequestHeader(l, m[l]);
                        }
                    }
                } else if (e.headers && !u(e.headers)) {
                    throw new Error("Headers cannot be set on an XDomainRequest object");
                }
                if ("responseType" in e) {
                    f.responseType = e.responseType;
                }
                if ("beforeSend" in e && typeof e.beforeSend === "function") {
                    e.beforeSend(f);
                }
                f.send(g || null);
                return f;
            }
            function h(e) {
                try {
                    if (e.responseType === "document") {
                        return e.responseXML;
                    }
                    var t = e.responseXML && e.responseXML.documentElement.nodeName === "parsererror";
                    if (e.responseType === "" && !t) {
                        return e.responseXML;
                    }
                } catch (r) {}
                return null;
            }
            function p() {}
        },
        2167: function(e, t) {
            "use strict";
            function r(e, t) {
                if (t === undefined) {
                    t = Object;
                }
                return t && typeof t.freeze === "function" ? t.freeze(e) : e;
            }
            var n = r({
                HTML: "text/html",
                isHTML: function(e) {
                    return e === n.HTML;
                },
                XML_APPLICATION: "application/xml",
                XML_TEXT: "text/xml",
                XML_XHTML_APPLICATION: "application/xhtml+xml",
                XML_SVG_IMAGE: "image/svg+xml"
            });
            var i = r({
                HTML: "http://www.w3.org/1999/xhtml",
                isHTML: function(e) {
                    return e === i.HTML;
                },
                SVG: "http://www.w3.org/2000/svg",
                XML: "http://www.w3.org/XML/1998/namespace",
                XMLNS: "http://www.w3.org/2000/xmlns/"
            });
            t.freeze = r;
            t.MIME_TYPE = n;
            t.NAMESPACE = i;
        },
        6129: function(e, t, r) {
            var n;
            var i = r(2167);
            var a = r(1146);
            var o = r(1045);
            var s = r(6925);
            var u = a.DOMImplementation;
            var f = i.NAMESPACE;
            var c = s.ParseError;
            var l = s.XMLReader;
            function h(e) {
                this.options = e || {
                    locator: {}
                };
            }
            h.prototype.parseFromString = function(e, t) {
                var r = this.options;
                var n = new l();
                var i = r.domBuilder || new v();
                var a = r.errorHandler;
                var s = r.locator;
                var u = r.xmlns || {};
                var c = /\/x?html?$/.test(t);
                var h = c ? o.HTML_ENTITIES : o.XML_ENTITIES;
                if (s) {
                    i.setDocumentLocator(s);
                }
                n.errorHandler = p(a, i, s);
                n.domBuilder = r.domBuilder || i;
                if (c) {
                    u[""] = f.HTML;
                }
                u.xml = u.xml || f.XML;
                if (e && typeof e === "string") {
                    n.parse(e, u, h);
                } else {
                    n.errorHandler.error("invalid doc source");
                }
                return i.doc;
            };
            function p(e, t, r) {
                if (!e) {
                    if (t instanceof v) {
                        return t;
                    }
                    e = t;
                }
                var n = {};
                var i = e instanceof Function;
                r = r || {};
                function a(t) {
                    var a = e[t];
                    if (!a && i) {
                        a = e.length == 2 ? function(r) {
                            e(t, r);
                        } : e;
                    }
                    n[t] = (a && function(e) {
                        a("[xmldom " + t + "]\t" + e + g(r));
                    }) || function() {};
                }
                a("warning");
                a("error");
                a("fatalError");
                return n;
            }
            function v() {
                this.cdata = false;
            }
            function d(e, t) {
                t.lineNumber = e.lineNumber;
                t.columnNumber = e.columnNumber;
            }
            v.prototype = {
                startDocument: function() {
                    this.doc = new u().createDocument(null, null, null);
                    if (this.locator) {
                        this.doc.documentURI = this.locator.systemId;
                    }
                },
                startElement: function(e, t, r, n) {
                    var i = this.doc;
                    var a = i.createElementNS(e, r || t);
                    var o = n.length;
                    b(this, a);
                    this.currentElement = a;
                    this.locator && d(this.locator, a);
                    for(var s = 0; s < o; s++){
                        var e = n.getURI(s);
                        var u = n.getValue(s);
                        var r = n.getQName(s);
                        var f = i.createAttributeNS(e, r);
                        this.locator && d(n.getLocator(s), f);
                        f.value = f.nodeValue = u;
                        a.setAttributeNode(f);
                    }
                },
                endElement: function(e, t, r) {
                    var n = this.currentElement;
                    var i = n.tagName;
                    this.currentElement = n.parentNode;
                },
                startPrefixMapping: function(e, t) {},
                endPrefixMapping: function(e) {},
                processingInstruction: function(e, t) {
                    var r = this.doc.createProcessingInstruction(e, t);
                    this.locator && d(this.locator, r);
                    b(this, r);
                },
                ignorableWhitespace: function(e, t, r) {},
                characters: function(e, t, r) {
                    e = m.apply(this, arguments);
                    if (e) {
                        if (this.cdata) {
                            var n = this.doc.createCDATASection(e);
                        } else {
                            var n = this.doc.createTextNode(e);
                        }
                        if (this.currentElement) {
                            this.currentElement.appendChild(n);
                        } else if (/^\s*$/.test(e)) {
                            this.doc.appendChild(n);
                        }
                        this.locator && d(this.locator, n);
                    }
                },
                skippedEntity: function(e) {},
                endDocument: function() {
                    this.doc.normalize();
                },
                setDocumentLocator: function(e) {
                    if ((this.locator = e)) {
                        e.lineNumber = 0;
                    }
                },
                comment: function(e, t, r) {
                    e = m.apply(this, arguments);
                    var n = this.doc.createComment(e);
                    this.locator && d(this.locator, n);
                    b(this, n);
                },
                startCDATA: function() {
                    this.cdata = true;
                },
                endCDATA: function() {
                    this.cdata = false;
                },
                startDTD: function(e, t, r) {
                    var n = this.doc.implementation;
                    if (n && n.createDocumentType) {
                        var i = n.createDocumentType(e, t, r);
                        this.locator && d(this.locator, i);
                        b(this, i);
                        this.doc.doctype = i;
                    }
                },
                warning: function(e) {
                    console.warn("[xmldom warning]\t" + e, g(this.locator));
                },
                error: function(e) {
                    console.error("[xmldom error]\t" + e, g(this.locator));
                },
                fatalError: function(e) {
                    throw new c(e, this.locator);
                }
            };
            function g(e) {
                if (e) {
                    return ("\n@" + (e.systemId || "") + "#[line:" + e.lineNumber + ",col:" + e.columnNumber + "]");
                }
            }
            function m(e, t, r) {
                if (typeof e == "string") {
                    return e.substr(t, r);
                } else {
                    if (e.length >= t + r || t) {
                        return new java.lang.String(e, t, r) + "";
                    }
                    return e;
                }
            }
            "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(e) {
                v.prototype[e] = function() {
                    return null;
                };
            });
            function b(e, t) {
                if (!e.currentElement) {
                    e.doc.appendChild(t);
                } else {
                    e.currentElement.appendChild(t);
                }
            }
            n = v;
            t.DOMParser = h;
            n = a.DOMImplementation;
            n = a.XMLSerializer;
        },
        1146: function(e, t, r) {
            var n = r(2167);
            var i = n.NAMESPACE;
            function a(e) {
                return e !== "";
            }
            function o(e) {
                return e ? e.split(/[\t\n\f\r ]+/).filter(a) : [];
            }
            function s(e, t) {
                if (!e.hasOwnProperty(t)) {
                    e[t] = true;
                }
                return e;
            }
            function u(e) {
                if (!e) return [];
                var t = o(e);
                return Object.keys(t.reduce(s, {}));
            }
            function f(e) {
                return function(t) {
                    return e && e.indexOf(t) !== -1;
                };
            }
            function c(e, t) {
                for(var r in e){
                    t[r] = e[r];
                }
            }
            function l(e, t) {
                var r = e.prototype;
                if (!(r instanceof t)) {
                    function n() {}
                    n.prototype = t.prototype;
                    n = new n();
                    c(r, n);
                    e.prototype = r = n;
                }
                if (r.constructor != e) {
                    if (typeof e != "function") {
                        console.error("unknown Class:" + e);
                    }
                    r.constructor = e;
                }
            }
            var h = {};
            var p = (h.ELEMENT_NODE = 1);
            var v = (h.ATTRIBUTE_NODE = 2);
            var d = (h.TEXT_NODE = 3);
            var g = (h.CDATA_SECTION_NODE = 4);
            var m = (h.ENTITY_REFERENCE_NODE = 5);
            var b = (h.ENTITY_NODE = 6);
            var y = (h.PROCESSING_INSTRUCTION_NODE = 7);
            var w = (h.COMMENT_NODE = 8);
            var E = (h.DOCUMENT_NODE = 9);
            var T = (h.DOCUMENT_TYPE_NODE = 10);
            var N = (h.DOCUMENT_FRAGMENT_NODE = 11);
            var A = (h.NOTATION_NODE = 12);
            var S = {};
            var x = {};
            var I = (S.INDEX_SIZE_ERR = ((x[1] = "Index size error"), 1));
            var C = (S.DOMSTRING_SIZE_ERR = ((x[2] = "DOMString size error"), 2));
            var R = (S.HIERARCHY_REQUEST_ERR = ((x[3] = "Hierarchy request error"), 3));
            var O = (S.WRONG_DOCUMENT_ERR = ((x[4] = "Wrong document"), 4));
            var D = (S.INVALID_CHARACTER_ERR = ((x[5] = "Invalid character"), 5));
            var L = (S.NO_DATA_ALLOWED_ERR = ((x[6] = "No data allowed"), 6));
            var U = (S.NO_MODIFICATION_ALLOWED_ERR = ((x[7] = "No modification allowed"), 7));
            var M = (S.NOT_FOUND_ERR = ((x[8] = "Not found"), 8));
            var P = (S.NOT_SUPPORTED_ERR = ((x[9] = "Not supported"), 9));
            var _ = (S.INUSE_ATTRIBUTE_ERR = ((x[10] = "Attribute in use"), 10));
            var k = (S.INVALID_STATE_ERR = ((x[11] = "Invalid state"), 11));
            var B = (S.SYNTAX_ERR = ((x[12] = "Syntax error"), 12));
            var X = (S.INVALID_MODIFICATION_ERR = ((x[13] = "Invalid modification"), 13));
            var H = (S.NAMESPACE_ERR = ((x[14] = "Invalid namespace"), 14));
            var V = (S.INVALID_ACCESS_ERR = ((x[15] = "Invalid access"), 15));
            function G(e, t) {
                if (t instanceof Error) {
                    var r = t;
                } else {
                    r = this;
                    Error.call(this, x[e]);
                    this.message = x[e];
                    if (Error.captureStackTrace) Error.captureStackTrace(this, G);
                }
                r.code = e;
                if (t) this.message = this.message + ": " + t;
                return r;
            }
            G.prototype = Error.prototype;
            c(S, G);
            function F() {}
            F.prototype = {
                length: 0,
                item: function(e) {
                    return this[e] || null;
                },
                toString: function(e, t) {
                    for(var r = [], n = 0; n < this.length; n++){
                        eN(this[n], r, e, t);
                    }
                    return r.join("");
                }
            };
            function j(e, t) {
                this._node = e;
                this._refresh = t;
                z(this);
            }
            function z(e) {
                var t = e._node._inc || e._node.ownerDocument._inc;
                if (e._inc != t) {
                    var r = e._refresh(e._node);
                    ex(e, "length", r.length);
                    c(r, e);
                    e._inc = t;
                }
            }
            j.prototype.item = function(e) {
                z(this);
                return this[e];
            };
            l(j, F);
            function K() {}
            function q(e, t) {
                var r = e.length;
                while(r--){
                    if (e[r] === t) {
                        return r;
                    }
                }
            }
            function Y(e, t, r, n) {
                if (n) {
                    t[q(t, n)] = r;
                } else {
                    t[t.length++] = r;
                }
                if (e) {
                    r.ownerElement = e;
                    var i = e.ownerDocument;
                    if (i) {
                        n && er(i, e, n);
                        et(i, e, r);
                    }
                }
            }
            function $(e, t, r) {
                var n = q(t, r);
                if (n >= 0) {
                    var i = t.length - 1;
                    while(n < i){
                        t[n] = t[++n];
                    }
                    t.length = i;
                    if (e) {
                        var a = e.ownerDocument;
                        if (a) {
                            er(a, e, r);
                            r.ownerElement = null;
                        }
                    }
                } else {
                    throw G(M, new Error(e.tagName + "@" + r));
                }
            }
            K.prototype = {
                length: 0,
                item: F.prototype.item,
                getNamedItem: function(e) {
                    var t = this.length;
                    while(t--){
                        var r = this[t];
                        if (r.nodeName == e) {
                            return r;
                        }
                    }
                },
                setNamedItem: function(e) {
                    var t = e.ownerElement;
                    if (t && t != this._ownerElement) {
                        throw new G(_);
                    }
                    var r = this.getNamedItem(e.nodeName);
                    Y(this._ownerElement, this, e, r);
                    return r;
                },
                setNamedItemNS: function(e) {
                    var t = e.ownerElement, r;
                    if (t && t != this._ownerElement) {
                        throw new G(_);
                    }
                    r = this.getNamedItemNS(e.namespaceURI, e.localName);
                    Y(this._ownerElement, this, e, r);
                    return r;
                },
                removeNamedItem: function(e) {
                    var t = this.getNamedItem(e);
                    $(this._ownerElement, this, t);
                    return t;
                },
                removeNamedItemNS: function(e, t) {
                    var r = this.getNamedItemNS(e, t);
                    $(this._ownerElement, this, r);
                    return r;
                },
                getNamedItemNS: function(e, t) {
                    var r = this.length;
                    while(r--){
                        var n = this[r];
                        if (n.localName == t && n.namespaceURI == e) {
                            return n;
                        }
                    }
                    return null;
                }
            };
            function W() {}
            W.prototype = {
                hasFeature: function(e, t) {
                    return true;
                },
                createDocument: function(e, t, r) {
                    var n = new ee();
                    n.implementation = this;
                    n.childNodes = new F();
                    n.doctype = r || null;
                    if (r) {
                        n.appendChild(r);
                    }
                    if (t) {
                        var i = n.createElementNS(e, t);
                        n.appendChild(i);
                    }
                    return n;
                },
                createDocumentType: function(e, t, r) {
                    var n = new ep();
                    n.name = e;
                    n.nodeName = e;
                    n.publicId = t || "";
                    n.systemId = r || "";
                    return n;
                }
            };
            function Z() {}
            Z.prototype = {
                firstChild: null,
                lastChild: null,
                previousSibling: null,
                nextSibling: null,
                attributes: null,
                parentNode: null,
                childNodes: null,
                ownerDocument: null,
                nodeValue: null,
                namespaceURI: null,
                prefix: null,
                localName: null,
                insertBefore: function(e, t) {
                    return ea(this, e, t);
                },
                replaceChild: function(e, t) {
                    this.insertBefore(e, t);
                    if (t) {
                        this.removeChild(t);
                    }
                },
                removeChild: function(e) {
                    return ei(this, e);
                },
                appendChild: function(e) {
                    return this.insertBefore(e, null);
                },
                hasChildNodes: function() {
                    return this.firstChild != null;
                },
                cloneNode: function(e) {
                    return eS(this.ownerDocument || this, this, e);
                },
                normalize: function() {
                    var e = this.firstChild;
                    while(e){
                        var t = e.nextSibling;
                        if (t && t.nodeType == d && e.nodeType == d) {
                            this.removeChild(t);
                            e.appendData(t.data);
                        } else {
                            e.normalize();
                            e = t;
                        }
                    }
                },
                isSupported: function(e, t) {
                    return this.ownerDocument.implementation.hasFeature(e, t);
                },
                hasAttributes: function() {
                    return this.attributes.length > 0;
                },
                lookupPrefix: function(e) {
                    var t = this;
                    while(t){
                        var r = t._nsMap;
                        if (r) {
                            for(var n in r){
                                if (r[n] == e) {
                                    return n;
                                }
                            }
                        }
                        t = t.nodeType == v ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function(e) {
                    var t = this;
                    while(t){
                        var r = t._nsMap;
                        if (r) {
                            if (e in r) {
                                return r[e];
                            }
                        }
                        t = t.nodeType == v ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function(e) {
                    var t = this.lookupPrefix(e);
                    return t == null;
                }
            };
            function Q(e) {
                return ((e == "<" && "&lt;") || (e == ">" && "&gt;") || (e == "&" && "&amp;") || (e == '"' && "&quot;") || "&#" + e.charCodeAt() + ";");
            }
            c(h, Z);
            c(h, Z.prototype);
            function J(e, t) {
                if (t(e)) {
                    return true;
                }
                if ((e = e.firstChild)) {
                    do {
                        if (J(e, t)) {
                            return true;
                        }
                    }while ((e = e.nextSibling))
                }
            }
            function ee() {}
            function et(e, t, r) {
                e && e._inc++;
                var n = r.namespaceURI;
                if (n === i.XMLNS) {
                    t._nsMap[r.prefix ? r.localName : ""] = r.value;
                }
            }
            function er(e, t, r, n) {
                e && e._inc++;
                var a = r.namespaceURI;
                if (a === i.XMLNS) {
                    delete t._nsMap[r.prefix ? r.localName : ""];
                }
            }
            function en(e, t, r) {
                if (e && e._inc) {
                    e._inc++;
                    var n = t.childNodes;
                    if (r) {
                        n[n.length++] = r;
                    } else {
                        var i = t.firstChild;
                        var a = 0;
                        while(i){
                            n[a++] = i;
                            i = i.nextSibling;
                        }
                        n.length = a;
                    }
                }
            }
            function ei(e, t) {
                var r = t.previousSibling;
                var n = t.nextSibling;
                if (r) {
                    r.nextSibling = n;
                } else {
                    e.firstChild = n;
                }
                if (n) {
                    n.previousSibling = r;
                } else {
                    e.lastChild = r;
                }
                en(e.ownerDocument, e);
                return t;
            }
            function ea(e, t, r) {
                var n = t.parentNode;
                if (n) {
                    n.removeChild(t);
                }
                if (t.nodeType === N) {
                    var i = t.firstChild;
                    if (i == null) {
                        return t;
                    }
                    var a = t.lastChild;
                } else {
                    i = a = t;
                }
                var o = r ? r.previousSibling : e.lastChild;
                i.previousSibling = o;
                a.nextSibling = r;
                if (o) {
                    o.nextSibling = i;
                } else {
                    e.firstChild = i;
                }
                if (r == null) {
                    e.lastChild = a;
                } else {
                    r.previousSibling = a;
                }
                do {
                    i.parentNode = e;
                }while (i !== a && (i = i.nextSibling))
                en(e.ownerDocument || e, e);
                if (t.nodeType == N) {
                    t.firstChild = t.lastChild = null;
                }
                return t;
            }
            function eo(e, t) {
                var r = t.parentNode;
                if (r) {
                    var n = e.lastChild;
                    r.removeChild(t);
                    var n = e.lastChild;
                }
                var n = e.lastChild;
                t.parentNode = e;
                t.previousSibling = n;
                t.nextSibling = null;
                if (n) {
                    n.nextSibling = t;
                } else {
                    e.firstChild = t;
                }
                e.lastChild = t;
                en(e.ownerDocument, e, t);
                return t;
            }
            ee.prototype = {
                nodeName: "#document",
                nodeType: E,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function(e, t) {
                    if (e.nodeType == N) {
                        var r = e.firstChild;
                        while(r){
                            var n = r.nextSibling;
                            this.insertBefore(r, t);
                            r = n;
                        }
                        return e;
                    }
                    if (this.documentElement == null && e.nodeType == p) {
                        this.documentElement = e;
                    }
                    return (ea(this, e, t), (e.ownerDocument = this), e);
                },
                removeChild: function(e) {
                    if (this.documentElement == e) {
                        this.documentElement = null;
                    }
                    return ei(this, e);
                },
                importNode: function(e, t) {
                    return eA(this, e, t);
                },
                getElementById: function(e) {
                    var t = null;
                    J(this.documentElement, function(r) {
                        if (r.nodeType == p) {
                            if (r.getAttribute("id") == e) {
                                t = r;
                                return true;
                            }
                        }
                    });
                    return t;
                },
                getElementsByClassName: function(e) {
                    var t = u(e);
                    return new j(this, function(r) {
                        var n = [];
                        if (t.length > 0) {
                            J(r.documentElement, function(i) {
                                if (i !== r && i.nodeType === p) {
                                    var a = i.getAttribute("class");
                                    if (a) {
                                        var o = e === a;
                                        if (!o) {
                                            var s = u(a);
                                            o = t.every(f(s));
                                        }
                                        if (o) {
                                            n.push(i);
                                        }
                                    }
                                }
                            });
                        }
                        return n;
                    });
                },
                createElement: function(e) {
                    var t = new es();
                    t.ownerDocument = this;
                    t.nodeName = e;
                    t.tagName = e;
                    t.localName = e;
                    t.childNodes = new F();
                    var r = (t.attributes = new K());
                    r._ownerElement = t;
                    return t;
                },
                createDocumentFragment: function() {
                    var e = new em();
                    e.ownerDocument = this;
                    e.childNodes = new F();
                    return e;
                },
                createTextNode: function(e) {
                    var t = new ec();
                    t.ownerDocument = this;
                    t.appendData(e);
                    return t;
                },
                createComment: function(e) {
                    var t = new el();
                    t.ownerDocument = this;
                    t.appendData(e);
                    return t;
                },
                createCDATASection: function(e) {
                    var t = new eh();
                    t.ownerDocument = this;
                    t.appendData(e);
                    return t;
                },
                createProcessingInstruction: function(e, t) {
                    var r = new eb();
                    r.ownerDocument = this;
                    r.tagName = r.target = e;
                    r.nodeValue = r.data = t;
                    return r;
                },
                createAttribute: function(e) {
                    var t = new eu();
                    t.ownerDocument = this;
                    t.name = e;
                    t.nodeName = e;
                    t.localName = e;
                    t.specified = true;
                    return t;
                },
                createEntityReference: function(e) {
                    var t = new eg();
                    t.ownerDocument = this;
                    t.nodeName = e;
                    return t;
                },
                createElementNS: function(e, t) {
                    var r = new es();
                    var n = t.split(":");
                    var i = (r.attributes = new K());
                    r.childNodes = new F();
                    r.ownerDocument = this;
                    r.nodeName = t;
                    r.tagName = t;
                    r.namespaceURI = e;
                    if (n.length == 2) {
                        r.prefix = n[0];
                        r.localName = n[1];
                    } else {
                        r.localName = t;
                    }
                    i._ownerElement = r;
                    return r;
                },
                createAttributeNS: function(e, t) {
                    var r = new eu();
                    var n = t.split(":");
                    r.ownerDocument = this;
                    r.nodeName = t;
                    r.name = t;
                    r.namespaceURI = e;
                    r.specified = true;
                    if (n.length == 2) {
                        r.prefix = n[0];
                        r.localName = n[1];
                    } else {
                        r.localName = t;
                    }
                    return r;
                }
            };
            l(ee, Z);
            function es() {
                this._nsMap = {};
            }
            es.prototype = {
                nodeType: p,
                hasAttribute: function(e) {
                    return this.getAttributeNode(e) != null;
                },
                getAttribute: function(e) {
                    var t = this.getAttributeNode(e);
                    return (t && t.value) || "";
                },
                getAttributeNode: function(e) {
                    return this.attributes.getNamedItem(e);
                },
                setAttribute: function(e, t) {
                    var r = this.ownerDocument.createAttribute(e);
                    r.value = r.nodeValue = "" + t;
                    this.setAttributeNode(r);
                },
                removeAttribute: function(e) {
                    var t = this.getAttributeNode(e);
                    t && this.removeAttributeNode(t);
                },
                appendChild: function(e) {
                    if (e.nodeType === N) {
                        return this.insertBefore(e, null);
                    } else {
                        return eo(this, e);
                    }
                },
                setAttributeNode: function(e) {
                    return this.attributes.setNamedItem(e);
                },
                setAttributeNodeNS: function(e) {
                    return this.attributes.setNamedItemNS(e);
                },
                removeAttributeNode: function(e) {
                    return this.attributes.removeNamedItem(e.nodeName);
                },
                removeAttributeNS: function(e, t) {
                    var r = this.getAttributeNodeNS(e, t);
                    r && this.removeAttributeNode(r);
                },
                hasAttributeNS: function(e, t) {
                    return (this.getAttributeNodeNS(e, t) != null);
                },
                getAttributeNS: function(e, t) {
                    var r = this.getAttributeNodeNS(e, t);
                    return (r && r.value) || "";
                },
                setAttributeNS: function(e, t, r) {
                    var n = this.ownerDocument.createAttributeNS(e, t);
                    n.value = n.nodeValue = "" + r;
                    this.setAttributeNode(n);
                },
                getAttributeNodeNS: function(e, t) {
                    return this.attributes.getNamedItemNS(e, t);
                },
                getElementsByTagName: function(e) {
                    return new j(this, function(t) {
                        var r = [];
                        J(t, function(n) {
                            if (n !== t && n.nodeType == p && (e === "*" || n.tagName == e)) {
                                r.push(n);
                            }
                        });
                        return r;
                    });
                },
                getElementsByTagNameNS: function(e, t) {
                    return new j(this, function(r) {
                        var n = [];
                        J(r, function(i) {
                            if (i !== r && i.nodeType === p && (e === "*" || i.namespaceURI === e) && (t === "*" || i.localName == t)) {
                                n.push(i);
                            }
                        });
                        return n;
                    });
                }
            };
            ee.prototype.getElementsByTagName = es.prototype.getElementsByTagName;
            ee.prototype.getElementsByTagNameNS = es.prototype.getElementsByTagNameNS;
            l(es, Z);
            function eu() {}
            eu.prototype.nodeType = v;
            l(eu, Z);
            function ef() {}
            ef.prototype = {
                data: "",
                substringData: function(e, t) {
                    return this.data.substring(e, e + t);
                },
                appendData: function(e) {
                    e = this.data + e;
                    this.nodeValue = this.data = e;
                    this.length = e.length;
                },
                insertData: function(e, t) {
                    this.replaceData(e, 0, t);
                },
                appendChild: function(e) {
                    throw new Error(x[R]);
                },
                deleteData: function(e, t) {
                    this.replaceData(e, t, "");
                },
                replaceData: function(e, t, r) {
                    var n = this.data.substring(0, e);
                    var i = this.data.substring(e + t);
                    r = n + r + i;
                    this.nodeValue = this.data = r;
                    this.length = r.length;
                }
            };
            l(ef, Z);
            function ec() {}
            ec.prototype = {
                nodeName: "#text",
                nodeType: d,
                splitText: function(e) {
                    var t = this.data;
                    var r = t.substring(e);
                    t = t.substring(0, e);
                    this.data = this.nodeValue = t;
                    this.length = t.length;
                    var n = this.ownerDocument.createTextNode(r);
                    if (this.parentNode) {
                        this.parentNode.insertBefore(n, this.nextSibling);
                    }
                    return n;
                }
            };
            l(ec, ef);
            function el() {}
            el.prototype = {
                nodeName: "#comment",
                nodeType: w
            };
            l(el, ef);
            function eh() {}
            eh.prototype = {
                nodeName: "#cdata-section",
                nodeType: g
            };
            l(eh, ef);
            function ep() {}
            ep.prototype.nodeType = T;
            l(ep, Z);
            function ev() {}
            ev.prototype.nodeType = A;
            l(ev, Z);
            function ed() {}
            ed.prototype.nodeType = b;
            l(ed, Z);
            function eg() {}
            eg.prototype.nodeType = m;
            l(eg, Z);
            function em() {}
            em.prototype.nodeName = "#document-fragment";
            em.prototype.nodeType = N;
            l(em, Z);
            function eb() {}
            eb.prototype.nodeType = y;
            l(eb, Z);
            function ey() {}
            ey.prototype.serializeToString = function(e, t, r) {
                return ew.call(e, t, r);
            };
            Z.prototype.toString = ew;
            function ew(e, t) {
                var r = [];
                var n = (this.nodeType == 9 && this.documentElement) || this;
                var i = n.prefix;
                var a = n.namespaceURI;
                if (a && i == null) {
                    var i = n.lookupPrefix(a);
                    if (i == null) {
                        var o = [
                            {
                                namespace: a,
                                prefix: null
                            }
                        ];
                    }
                }
                eN(this, r, e, t, o);
                return r.join("");
            }
            function eE(e, t, r) {
                var n = e.prefix || "";
                var a = e.namespaceURI;
                if (!a) {
                    return false;
                }
                if ((n === "xml" && a === i.XML) || a === i.XMLNS) {
                    return false;
                }
                var o = r.length;
                while(o--){
                    var s = r[o];
                    if (s.prefix === n) {
                        return s.namespace !== a;
                    }
                }
                return true;
            }
            function eT(e, t, r) {
                e.push(" ", t, '="', r.replace(/[<&"]/g, Q), '"');
            }
            function eN(e, t, r, n, a) {
                if (!a) {
                    a = [];
                }
                if (n) {
                    e = n(e);
                    if (e) {
                        if (typeof e == "string") {
                            t.push(e);
                            return;
                        }
                    } else {
                        return;
                    }
                }
                switch(e.nodeType){
                    case p:
                        var o = e.attributes;
                        var s = o.length;
                        var u = e.firstChild;
                        var f = e.tagName;
                        r = i.isHTML(e.namespaceURI) || r;
                        var c = f;
                        if (!r && !e.prefix && e.namespaceURI) {
                            var l;
                            for(var h = 0; h < o.length; h++){
                                if (o.item(h).name === "xmlns") {
                                    l = o.item(h).value;
                                    break;
                                }
                            }
                            if (!l) {
                                for(var b = a.length - 1; b >= 0; b--){
                                    var A = a[b];
                                    if (A.prefix === "" && A.namespace === e.namespaceURI) {
                                        l = A.namespace;
                                        break;
                                    }
                                }
                            }
                            if (l !== e.namespaceURI) {
                                for(var b = a.length - 1; b >= 0; b--){
                                    var A = a[b];
                                    if (A.namespace === e.namespaceURI) {
                                        if (A.prefix) {
                                            c = A.prefix + ":" + f;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        t.push("<", c);
                        for(var S = 0; S < s; S++){
                            var x = o.item(S);
                            if (x.prefix == "xmlns") {
                                a.push({
                                    prefix: x.localName,
                                    namespace: x.value
                                });
                            } else if (x.nodeName == "xmlns") {
                                a.push({
                                    prefix: "",
                                    namespace: x.value
                                });
                            }
                        }
                        for(var S = 0; S < s; S++){
                            var x = o.item(S);
                            if (eE(x, r, a)) {
                                var I = x.prefix || "";
                                var C = x.namespaceURI;
                                eT(t, I ? "xmlns:" + I : "xmlns", C);
                                a.push({
                                    prefix: I,
                                    namespace: C
                                });
                            }
                            eN(x, t, r, n, a);
                        }
                        if (f === c && eE(e, r, a)) {
                            var I = e.prefix || "";
                            var C = e.namespaceURI;
                            eT(t, I ? "xmlns:" + I : "xmlns", C);
                            a.push({
                                prefix: I,
                                namespace: C
                            });
                        }
                        if (u || (r && !/^(?:meta|link|img|br|hr|input)$/i.test(f))) {
                            t.push(">");
                            if (r && /^script$/i.test(f)) {
                                while(u){
                                    if (u.data) {
                                        t.push(u.data);
                                    } else {
                                        eN(u, t, r, n, a.slice());
                                    }
                                    u = u.nextSibling;
                                }
                            } else {
                                while(u){
                                    eN(u, t, r, n, a.slice());
                                    u = u.nextSibling;
                                }
                            }
                            t.push("</", c, ">");
                        } else {
                            t.push("/>");
                        }
                        return;
                    case E:
                    case N:
                        var u = e.firstChild;
                        while(u){
                            eN(u, t, r, n, a.slice());
                            u = u.nextSibling;
                        }
                        return;
                    case v:
                        return eT(t, e.name, e.value);
                    case d:
                        return t.push(e.data.replace(/[<&]/g, Q).replace(/]]>/g, "]]&gt;"));
                    case g:
                        return t.push("<![CDATA[", e.data, "]]>");
                    case w:
                        return t.push("<!--", e.data, "-->");
                    case T:
                        var R = e.publicId;
                        var O = e.systemId;
                        t.push("<!DOCTYPE ", e.name);
                        if (R) {
                            t.push(" PUBLIC ", R);
                            if (O && O != ".") {
                                t.push(" ", O);
                            }
                            t.push(">");
                        } else if (O && O != ".") {
                            t.push(" SYSTEM ", O, ">");
                        } else {
                            var D = e.internalSubset;
                            if (D) {
                                t.push(" [", D, "]");
                            }
                            t.push(">");
                        }
                        return;
                    case y:
                        return t.push("<?", e.target, " ", e.data, "?>");
                    case m:
                        return t.push("&", e.nodeName, ";");
                    default:
                        t.push("??", e.nodeName);
                }
            }
            function eA(e, t, r) {
                var n;
                switch(t.nodeType){
                    case p:
                        n = t.cloneNode(false);
                        n.ownerDocument = e;
                    case N:
                        break;
                    case v:
                        r = true;
                        break;
                }
                if (!n) {
                    n = t.cloneNode(false);
                }
                n.ownerDocument = e;
                n.parentNode = null;
                if (r) {
                    var i = t.firstChild;
                    while(i){
                        n.appendChild(eA(e, i, r));
                        i = i.nextSibling;
                    }
                }
                return n;
            }
            function eS(e, t, r) {
                var n = new t.constructor();
                for(var i in t){
                    var a = t[i];
                    if (typeof a != "object") {
                        if (a != n[i]) {
                            n[i] = a;
                        }
                    }
                }
                if (t.childNodes) {
                    n.childNodes = new F();
                }
                n.ownerDocument = e;
                switch(n.nodeType){
                    case p:
                        var o = t.attributes;
                        var s = (n.attributes = new K());
                        var u = o.length;
                        s._ownerElement = n;
                        for(var f = 0; f < u; f++){
                            n.setAttributeNode(eS(e, o.item(f), true));
                        }
                        break;
                    case v:
                        r = true;
                }
                if (r) {
                    var c = t.firstChild;
                    while(c){
                        n.appendChild(eS(e, c, r));
                        c = c.nextSibling;
                    }
                }
                return n;
            }
            function ex(e, t, r) {
                e[t] = r;
            }
            try {
                if (Object.defineProperty) {
                    Object.defineProperty(j.prototype, "length", {
                        get: function() {
                            z(this);
                            return this.$$length;
                        }
                    });
                    Object.defineProperty(Z.prototype, "textContent", {
                        get: function() {
                            return eI(this);
                        },
                        set: function(e) {
                            switch(this.nodeType){
                                case p:
                                case N:
                                    while(this.firstChild){
                                        this.removeChild(this.firstChild);
                                    }
                                    if (e || String(e)) {
                                        this.appendChild(this.ownerDocument.createTextNode(e));
                                    }
                                    break;
                                default:
                                    this.data = e;
                                    this.value = e;
                                    this.nodeValue = e;
                            }
                        }
                    });
                    function eI(e) {
                        switch(e.nodeType){
                            case p:
                            case N:
                                var t = [];
                                e = e.firstChild;
                                while(e){
                                    if (e.nodeType !== 7 && e.nodeType !== 8) {
                                        t.push(eI(e));
                                    }
                                    e = e.nextSibling;
                                }
                                return t.join("");
                            default:
                                return e.nodeValue;
                        }
                    }
                    ex = function(e, t, r) {
                        e["$$" + t] = r;
                    };
                }
            } catch (eC) {}
            t.DocumentType = ep;
            t.DOMException = G;
            t.DOMImplementation = W;
            t.Element = es;
            t.Node = Z;
            t.NodeList = F;
            t.XMLSerializer = ey;
        },
        1045: function(e, t, r) {
            var n = r(2167).freeze;
            t.XML_ENTITIES = n({
                amp: "&",
                apos: "'",
                gt: ">",
                lt: "<",
                quot: '"'
            });
            t.HTML_ENTITIES = n({
                lt: "<",
                gt: ">",
                amp: "&",
                quot: '"',
                apos: "'",
                Agrave: "À",
                Aacute: "Á",
                Acirc: "Â",
                Atilde: "Ã",
                Auml: "Ä",
                Aring: "Å",
                AElig: "Æ",
                Ccedil: "Ç",
                Egrave: "È",
                Eacute: "É",
                Ecirc: "Ê",
                Euml: "Ë",
                Igrave: "Ì",
                Iacute: "Í",
                Icirc: "Î",
                Iuml: "Ï",
                ETH: "Ð",
                Ntilde: "Ñ",
                Ograve: "Ò",
                Oacute: "Ó",
                Ocirc: "Ô",
                Otilde: "Õ",
                Ouml: "Ö",
                Oslash: "Ø",
                Ugrave: "Ù",
                Uacute: "Ú",
                Ucirc: "Û",
                Uuml: "Ü",
                Yacute: "Ý",
                THORN: "Þ",
                szlig: "ß",
                agrave: "à",
                aacute: "á",
                acirc: "â",
                atilde: "ã",
                auml: "ä",
                aring: "å",
                aelig: "æ",
                ccedil: "ç",
                egrave: "è",
                eacute: "é",
                ecirc: "ê",
                euml: "ë",
                igrave: "ì",
                iacute: "í",
                icirc: "î",
                iuml: "ï",
                eth: "ð",
                ntilde: "ñ",
                ograve: "ò",
                oacute: "ó",
                ocirc: "ô",
                otilde: "õ",
                ouml: "ö",
                oslash: "ø",
                ugrave: "ù",
                uacute: "ú",
                ucirc: "û",
                uuml: "ü",
                yacute: "ý",
                thorn: "þ",
                yuml: "ÿ",
                nbsp: "\u00a0",
                iexcl: "¡",
                cent: "¢",
                pound: "£",
                curren: "¤",
                yen: "¥",
                brvbar: "¦",
                sect: "§",
                uml: "¨",
                copy: "©",
                ordf: "ª",
                laquo: "«",
                not: "¬",
                shy: "­­",
                reg: "®",
                macr: "¯",
                deg: "°",
                plusmn: "±",
                sup2: "²",
                sup3: "³",
                acute: "´",
                micro: "µ",
                para: "¶",
                middot: "·",
                cedil: "¸",
                sup1: "¹",
                ordm: "º",
                raquo: "»",
                frac14: "¼",
                frac12: "½",
                frac34: "¾",
                iquest: "¿",
                times: "×",
                divide: "÷",
                forall: "∀",
                part: "∂",
                exist: "∃",
                empty: "∅",
                nabla: "∇",
                isin: "∈",
                notin: "∉",
                ni: "∋",
                prod: "∏",
                sum: "∑",
                minus: "−",
                lowast: "∗",
                radic: "√",
                prop: "∝",
                infin: "∞",
                ang: "∠",
                and: "∧",
                or: "∨",
                cap: "∩",
                cup: "∪",
                int: "∫",
                there4: "∴",
                sim: "∼",
                cong: "≅",
                asymp: "≈",
                ne: "≠",
                equiv: "≡",
                le: "≤",
                ge: "≥",
                sub: "⊂",
                sup: "⊃",
                nsub: "⊄",
                sube: "⊆",
                supe: "⊇",
                oplus: "⊕",
                otimes: "⊗",
                perp: "⊥",
                sdot: "⋅",
                Alpha: "Α",
                Beta: "Β",
                Gamma: "Γ",
                Delta: "Δ",
                Epsilon: "Ε",
                Zeta: "Ζ",
                Eta: "Η",
                Theta: "Θ",
                Iota: "Ι",
                Kappa: "Κ",
                Lambda: "Λ",
                Mu: "Μ",
                Nu: "Ν",
                Xi: "Ξ",
                Omicron: "Ο",
                Pi: "Π",
                Rho: "Ρ",
                Sigma: "Σ",
                Tau: "Τ",
                Upsilon: "Υ",
                Phi: "Φ",
                Chi: "Χ",
                Psi: "Ψ",
                Omega: "Ω",
                alpha: "α",
                beta: "β",
                gamma: "γ",
                delta: "δ",
                epsilon: "ε",
                zeta: "ζ",
                eta: "η",
                theta: "θ",
                iota: "ι",
                kappa: "κ",
                lambda: "λ",
                mu: "μ",
                nu: "ν",
                xi: "ξ",
                omicron: "ο",
                pi: "π",
                rho: "ρ",
                sigmaf: "ς",
                sigma: "σ",
                tau: "τ",
                upsilon: "υ",
                phi: "φ",
                chi: "χ",
                psi: "ψ",
                omega: "ω",
                thetasym: "ϑ",
                upsih: "ϒ",
                piv: "ϖ",
                OElig: "Œ",
                oelig: "œ",
                Scaron: "Š",
                scaron: "š",
                Yuml: "Ÿ",
                fnof: "ƒ",
                circ: "ˆ",
                tilde: "˜",
                ensp: " ",
                emsp: " ",
                thinsp: " ",
                zwnj: "‌",
                zwj: "‍",
                lrm: "‎",
                rlm: "‏",
                ndash: "–",
                mdash: "—",
                lsquo: "‘",
                rsquo: "’",
                sbquo: "‚",
                ldquo: "“",
                rdquo: "”",
                bdquo: "„",
                dagger: "†",
                Dagger: "‡",
                bull: "•",
                hellip: "…",
                permil: "‰",
                prime: "′",
                Prime: "″",
                lsaquo: "‹",
                rsaquo: "›",
                oline: "‾",
                euro: "€",
                trade: "™",
                larr: "←",
                uarr: "↑",
                rarr: "→",
                darr: "↓",
                harr: "↔",
                crarr: "↵",
                lceil: "⌈",
                rceil: "⌉",
                lfloor: "⌊",
                rfloor: "⌋",
                loz: "◊",
                spades: "♠",
                clubs: "♣",
                hearts: "♥",
                diams: "♦"
            });
            t.entityMap = t.HTML_ENTITIES;
        },
        3969: function(e, t, r) {
            var n;
            var i = r(1146);
            n = i.DOMImplementation;
            n = i.XMLSerializer;
            t.DOMParser = r(6129).DOMParser;
        },
        6925: function(e, t, r) {
            var n = r(2167).NAMESPACE;
            var i = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
            var a = new RegExp("[\\-\\.0-9" + i.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
            var o = new RegExp("^" + i.source + a.source + "*(?::" + i.source + a.source + "*)?$");
            var s = 0;
            var u = 1;
            var f = 2;
            var c = 3;
            var l = 4;
            var h = 5;
            var p = 6;
            var v = 7;
            function d(e, t) {
                this.message = e;
                this.locator = t;
                if (Error.captureStackTrace) Error.captureStackTrace(this, d);
            }
            d.prototype = new Error();
            d.prototype.name = d.name;
            function g() {}
            g.prototype = {
                parse: function(e, t, r) {
                    var n = this.domBuilder;
                    n.startDocument();
                    N(t, (t = {}));
                    m(e, t, r, n, this.errorHandler);
                    n.endDocument();
                }
            };
            function m(e, t, r, i, a) {
                function o(e) {
                    if (e > 0xffff) {
                        e -= 0x10000;
                        var t = 0xd800 + (e >> 10), r = 0xdc00 + (e & 0x3ff);
                        return String.fromCharCode(t, r);
                    } else {
                        return String.fromCharCode(e);
                    }
                }
                function s(e) {
                    var t = e.slice(1, -1);
                    if (t in r) {
                        return r[t];
                    } else if (t.charAt(0) === "#") {
                        return o(parseInt(t.substr(1).replace("x", "0x")));
                    } else {
                        a.error("entity not found:" + e);
                        return e;
                    }
                }
                function u(t) {
                    if (t > m) {
                        var r = e.substring(m, t).replace(/&#?\w+;/g, s);
                        p && f(m);
                        i.characters(r, 0, t - m);
                        m = t;
                    }
                }
                function f(t, r) {
                    while(t >= l && (r = h.exec(e))){
                        c = r.index;
                        l = c + r[0].length;
                        p.lineNumber++;
                    }
                    p.columnNumber = t - c + 1;
                }
                var c = 0;
                var l = 0;
                var h = /.*(?:\r\n?|\n)|.*$/g;
                var p = i.locator;
                var v = [
                    {
                        currentNSMap: t
                    }
                ];
                var g = {};
                var m = 0;
                while(true){
                    try {
                        var N = e.indexOf("<", m);
                        if (N < 0) {
                            if (!e.substr(m).match(/^\s*$/)) {
                                var I = i.doc;
                                var C = I.createTextNode(e.substr(m));
                                I.appendChild(C);
                                i.currentElement = C;
                            }
                            return;
                        }
                        if (N > m) {
                            u(N);
                        }
                        switch(e.charAt(N + 1)){
                            case "/":
                                var R = e.indexOf(">", N + 3);
                                var O = e.substring(N + 2, R).replace(/[ \t\n\r]+$/g, "");
                                var D = v.pop();
                                if (R < 0) {
                                    O = e.substring(N + 2).replace(/[\s<].*/, "");
                                    a.error("end tag name: " + O + " is not complete:" + D.tagName);
                                    R = N + 1 + O.length;
                                } else if (O.match(/\s</)) {
                                    O = O.replace(/[\s<].*/, "");
                                    a.error("end tag name: " + O + " maybe not complete");
                                    R = N + 1 + O.length;
                                }
                                var L = D.localNSMap;
                                var U = D.tagName == O;
                                var M = U || (D.tagName && D.tagName.toLowerCase() == O.toLowerCase());
                                if (M) {
                                    i.endElement(D.uri, D.localName, O);
                                    if (L) {
                                        for(var P in L){
                                            i.endPrefixMapping(P);
                                        }
                                    }
                                    if (!U) {
                                        a.fatalError("end tag name: " + O + " is not match the current start tagName:" + D.tagName);
                                    }
                                } else {
                                    v.push(D);
                                }
                                R++;
                                break;
                            case "?":
                                p && f(N);
                                R = S(e, N, i);
                                break;
                            case "!":
                                p && f(N);
                                R = A(e, N, i, a);
                                break;
                            default:
                                p && f(N);
                                var _ = new x();
                                var k = v[v.length - 1].currentNSMap;
                                var R = y(e, N, _, k, s, a);
                                var B = _.length;
                                if (!_.closed && T(e, R, _.tagName, g)) {
                                    _.closed = true;
                                    if (!r.nbsp) {
                                        a.warning("unclosed xml attribute");
                                    }
                                }
                                if (p && B) {
                                    var X = b(p, {});
                                    for(var H = 0; H < B; H++){
                                        var V = _[H];
                                        f(V.offset);
                                        V.locator = b(p, {});
                                    }
                                    i.locator = X;
                                    if (w(_, i, k)) {
                                        v.push(_);
                                    }
                                    i.locator = p;
                                } else {
                                    if (w(_, i, k)) {
                                        v.push(_);
                                    }
                                }
                                if (n.isHTML(_.uri) && !_.closed) {
                                    R = E(e, R, _.tagName, s, i);
                                } else {
                                    R++;
                                }
                        }
                    } catch (G) {
                        if (G instanceof d) {
                            throw G;
                        }
                        a.error("element parse error: " + G);
                        R = -1;
                    }
                    if (R > m) {
                        m = R;
                    } else {
                        u(Math.max(N, m) + 1);
                    }
                }
            }
            function b(e, t) {
                t.lineNumber = e.lineNumber;
                t.columnNumber = e.columnNumber;
                return t;
            }
            function y(e, t, r, i, a, o) {
                function d(e, t, n) {
                    if (r.attributeNames.hasOwnProperty(e)) {
                        o.fatalError("Attribute " + e + " redefined");
                    }
                    r.addValue(e, t, n);
                }
                var g;
                var m;
                var b = ++t;
                var y = s;
                while(true){
                    var w = e.charAt(b);
                    switch(w){
                        case "=":
                            if (y === u) {
                                g = e.slice(t, b);
                                y = c;
                            } else if (y === f) {
                                y = c;
                            } else {
                                throw new Error("attribute equal must after attrName");
                            }
                            break;
                        case "'":
                        case '"':
                            if (y === c || y === u) {
                                if (y === u) {
                                    o.warning('attribute value must after "="');
                                    g = e.slice(t, b);
                                }
                                t = b + 1;
                                b = e.indexOf(w, t);
                                if (b > 0) {
                                    m = e.slice(t, b).replace(/&#?\w+;/g, a);
                                    d(g, m, t - 1);
                                    y = h;
                                } else {
                                    throw new Error("attribute value no end '" + w + "' match");
                                }
                            } else if (y == l) {
                                m = e.slice(t, b).replace(/&#?\w+;/g, a);
                                d(g, m, t);
                                o.warning('attribute "' + g + '" missed start quot(' + w + ")!!");
                                t = b + 1;
                                y = h;
                            } else {
                                throw new Error('attribute value must after "="');
                            }
                            break;
                        case "/":
                            switch(y){
                                case s:
                                    r.setTagName(e.slice(t, b));
                                case h:
                                case p:
                                case v:
                                    y = v;
                                    r.closed = true;
                                case l:
                                case u:
                                case f:
                                    break;
                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;
                        case "":
                            o.error("unexpected end of input");
                            if (y == s) {
                                r.setTagName(e.slice(t, b));
                            }
                            return b;
                        case ">":
                            switch(y){
                                case s:
                                    r.setTagName(e.slice(t, b));
                                case h:
                                case p:
                                case v:
                                    break;
                                case l:
                                case u:
                                    m = e.slice(t, b);
                                    if (m.slice(-1) === "/") {
                                        r.closed = true;
                                        m = m.slice(0, -1);
                                    }
                                case f:
                                    if (y === f) {
                                        m = g;
                                    }
                                    if (y == l) {
                                        o.warning('attribute "' + m + '" missed quot(")!');
                                        d(g, m.replace(/&#?\w+;/g, a), t);
                                    } else {
                                        if (!n.isHTML(i[""]) || !m.match(/^(?:disabled|checked|selected)$/i)) {
                                            o.warning('attribute "' + m + '" missed value!! "' + m + '" instead!!');
                                        }
                                        d(m, m, t);
                                    }
                                    break;
                                case c:
                                    throw new Error("attribute value missed!!");
                            }
                            return b;
                        case "\u0080":
                            w = " ";
                        default:
                            if (w <= " ") {
                                switch(y){
                                    case s:
                                        r.setTagName(e.slice(t, b));
                                        y = p;
                                        break;
                                    case u:
                                        g = e.slice(t, b);
                                        y = f;
                                        break;
                                    case l:
                                        var m = e.slice(t, b).replace(/&#?\w+;/g, a);
                                        o.warning('attribute "' + m + '" missed quot(")!!');
                                        d(g, m, t);
                                    case h:
                                        y = p;
                                        break;
                                }
                            } else {
                                switch(y){
                                    case f:
                                        var E = r.tagName;
                                        if (!n.isHTML(i[""]) || !g.match(/^(?:disabled|checked|selected)$/i)) {
                                            o.warning('attribute "' + g + '" missed value!! "' + g + '" instead2!!');
                                        }
                                        d(g, g, t);
                                        t = b;
                                        y = u;
                                        break;
                                    case h:
                                        o.warning('attribute space is required"' + g + '"!!');
                                    case p:
                                        y = u;
                                        t = b;
                                        break;
                                    case c:
                                        y = l;
                                        t = b;
                                        break;
                                    case v:
                                        throw new Error("elements closed character '/' and '>' must be connected to");
                                }
                            }
                    }
                    b++;
                }
            }
            function w(e, t, r) {
                var i = e.tagName;
                var a = null;
                var o = e.length;
                while(o--){
                    var s = e[o];
                    var u = s.qName;
                    var f = s.value;
                    var c = u.indexOf(":");
                    if (c > 0) {
                        var l = (s.prefix = u.slice(0, c));
                        var h = u.slice(c + 1);
                        var p = l === "xmlns" && h;
                    } else {
                        h = u;
                        l = null;
                        p = u === "xmlns" && "";
                    }
                    s.localName = h;
                    if (p !== false) {
                        if (a == null) {
                            a = {};
                            N(r, (r = {}));
                        }
                        r[p] = a[p] = f;
                        s.uri = n.XMLNS;
                        t.startPrefixMapping(p, f);
                    }
                }
                var o = e.length;
                while(o--){
                    s = e[o];
                    var l = s.prefix;
                    if (l) {
                        if (l === "xml") {
                            s.uri = n.XML;
                        }
                        if (l !== "xmlns") {
                            s.uri = r[l || ""];
                        }
                    }
                }
                var c = i.indexOf(":");
                if (c > 0) {
                    l = e.prefix = i.slice(0, c);
                    h = e.localName = i.slice(c + 1);
                } else {
                    l = null;
                    h = e.localName = i;
                }
                var v = (e.uri = r[l || ""]);
                t.startElement(v, h, i, e);
                if (e.closed) {
                    t.endElement(v, h, i);
                    if (a) {
                        for(l in a){
                            t.endPrefixMapping(l);
                        }
                    }
                } else {
                    e.currentNSMap = r;
                    e.localNSMap = a;
                    return true;
                }
            }
            function E(e, t, r, n, i) {
                if (/^(?:script|textarea)$/i.test(r)) {
                    var a = e.indexOf("</" + r + ">", t);
                    var o = e.substring(t + 1, a);
                    if (/[&<]/.test(o)) {
                        if (/^script$/i.test(r)) {
                            i.characters(o, 0, o.length);
                            return a;
                        }
                        o = o.replace(/&#?\w+;/g, n);
                        i.characters(o, 0, o.length);
                        return a;
                    }
                }
                return t + 1;
            }
            function T(e, t, r, n) {
                var i = n[r];
                if (i == null) {
                    i = e.lastIndexOf("</" + r + ">");
                    if (i < t) {
                        i = e.lastIndexOf("</" + r);
                    }
                    n[r] = i;
                }
                return i < t;
            }
            function N(e, t) {
                for(var r in e){
                    t[r] = e[r];
                }
            }
            function A(e, t, r, n) {
                var i = e.charAt(t + 2);
                switch(i){
                    case "-":
                        if (e.charAt(t + 3) === "-") {
                            var a = e.indexOf("-->", t + 4);
                            if (a > t) {
                                r.comment(e, t + 4, a - t - 4);
                                return a + 3;
                            } else {
                                n.error("Unclosed comment");
                                return -1;
                            }
                        } else {
                            return -1;
                        }
                    default:
                        if (e.substr(t + 3, 6) == "CDATA[") {
                            var a = e.indexOf("]]>", t + 9);
                            r.startCDATA();
                            r.characters(e, t + 9, a - t - 9);
                            r.endCDATA();
                            return a + 3;
                        }
                        var o = I(e, t);
                        var s = o.length;
                        if (s > 1 && /!doctype/i.test(o[0][0])) {
                            var u = o[1][0];
                            var f = false;
                            var c = false;
                            if (s > 3) {
                                if (/^public$/i.test(o[2][0])) {
                                    f = o[3][0];
                                    c = s > 4 && o[4][0];
                                } else if (/^system$/i.test(o[2][0])) {
                                    c = o[3][0];
                                }
                            }
                            var l = o[s - 1];
                            r.startDTD(u, f, c);
                            r.endDTD();
                            return l.index + l[0].length;
                        }
                }
                return -1;
            }
            function S(e, t, r) {
                var n = e.indexOf("?>", t);
                if (n) {
                    var i = e.substring(t, n).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (i) {
                        var a = i[0].length;
                        r.processingInstruction(i[1], i[2]);
                        return n + 2;
                    } else {
                        return -1;
                    }
                }
                return -1;
            }
            function x() {
                this.attributeNames = {};
            }
            x.prototype = {
                setTagName: function(e) {
                    if (!o.test(e)) {
                        throw new Error("invalid tagName:" + e);
                    }
                    this.tagName = e;
                },
                addValue: function(e, t, r) {
                    if (!o.test(e)) {
                        throw new Error("invalid attribute:" + e);
                    }
                    this.attributeNames[e] = this.length;
                    this[this.length++] = {
                        qName: e,
                        value: t,
                        offset: r
                    };
                },
                length: 0,
                getLocalName: function(e) {
                    return this[e].localName;
                },
                getLocator: function(e) {
                    return this[e].locator;
                },
                getQName: function(e) {
                    return this[e].qName;
                },
                getURI: function(e) {
                    return this[e].uri;
                },
                getValue: function(e) {
                    return this[e].value;
                }
            };
            function I(e, t) {
                var r;
                var n = [];
                var i = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                i.lastIndex = t;
                i.exec(e);
                while((r = i.exec(e))){
                    n.push(r);
                    if (r[1]) return n;
                }
            }
            t.XMLReader = g;
            t.ParseError = d;
        },
        9144: function(e, t, r) {
            var n = typeof r.g !== "undefined" ? r.g : typeof window !== "undefined" ? window : {};
            var i = r(7579);
            var a;
            if (typeof document !== "undefined") {
                a = document;
            } else {
                a = n["__GLOBAL_DOCUMENT_CACHE@4"];
                if (!a) {
                    a = n["__GLOBAL_DOCUMENT_CACHE@4"] = i;
                }
            }
            e.exports = a;
        },
        8908: function(e, t, r) {
            var n;
            if (typeof window !== "undefined") {
                n = window;
            } else if (typeof r.g !== "undefined") {
                n = r.g;
            } else if (typeof self !== "undefined") {
                n = self;
            } else {
                n = {};
            }
            e.exports = n;
        },
        7376: function(e) {
            e.exports = r;
            var t = Object.prototype.toString;
            function r(e) {
                if (!e) {
                    return false;
                }
                var r = t.call(e);
                return (r === "[object Function]" || (typeof e === "function" && r !== "[object RegExp]") || (typeof window !== "undefined" && (e === window.setTimeout || e === window.alert || e === window.confirm || e === window.prompt)));
            }
        },
        7537: function(e, t) {
            function r(e) {
                if (e && "object" === typeof e) {
                    var t = e.which || e.keyCode || e.charCode;
                    if (t) e = t;
                }
                if ("number" === typeof e) return o[e];
                var r = String(e);
                var a = n[r.toLowerCase()];
                if (a) return a;
                var a = i[r.toLowerCase()];
                if (a) return a;
                if (r.length === 1) return r.charCodeAt(0);
                return undefined;
            }
            r.isEventKey = function e(t, r) {
                if (t && "object" === typeof t) {
                    var a = t.which || t.keyCode || t.charCode;
                    if (a === null || a === undefined) {
                        return false;
                    }
                    if (typeof r === "string") {
                        var o = n[r.toLowerCase()];
                        if (o) {
                            return o === a;
                        }
                        var o = i[r.toLowerCase()];
                        if (o) {
                            return o === a;
                        }
                    } else if (typeof r === "number") {
                        return r === a;
                    }
                    return false;
                }
            };
            t = e.exports = r;
            var n = (t.code = t.codes = {
                backspace: 8,
                tab: 9,
                enter: 13,
                shift: 16,
                ctrl: 17,
                alt: 18,
                "pause/break": 19,
                "caps lock": 20,
                esc: 27,
                space: 32,
                "page up": 33,
                "page down": 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                insert: 45,
                delete: 46,
                command: 91,
                "left command": 91,
                "right command": 93,
                "numpad *": 106,
                "numpad +": 107,
                "numpad -": 109,
                "numpad .": 110,
                "numpad /": 111,
                "num lock": 144,
                "scroll lock": 145,
                "my computer": 182,
                "my calculator": 183,
                ";": 186,
                "=": 187,
                ",": 188,
                "-": 189,
                ".": 190,
                "/": 191,
                "`": 192,
                "[": 219,
                "\\": 220,
                "]": 221,
                "'": 222
            });
            var i = (t.aliases = {
                windows: 91,
                "⇧": 16,
                "⌥": 18,
                "⌃": 17,
                "⌘": 91,
                ctl: 17,
                control: 17,
                option: 18,
                pause: 19,
                break: 19,
                caps: 20,
                return: 13,
                escape: 27,
                spc: 32,
                spacebar: 32,
                pgup: 33,
                pgdn: 34,
                ins: 45,
                del: 46,
                cmd: 91
            });
            for(a = 97; a < 123; a++)n[String.fromCharCode(a)] = a - 32;
            for(var a = 48; a < 58; a++)n[a - 48] = a;
            for(a = 1; a < 13; a++)n["f" + a] = a + 111;
            for(a = 0; a < 10; a++)n["numpad " + a] = a + 96;
            var o = (t.names = t.title = {});
            for(a in n)o[n[a]] = a;
            for(var s in i){
                n[s] = i[s];
            }
        },
        9323: function(e, t, r) {
            "use strict";
            r.d(t, {
                _b: function() {
                    return m;
                }
            });
            var n = r(4578);
            var i = (function() {
                function e() {
                    this.listeners = {};
                }
                var t = e.prototype;
                t.on = function e(t, r) {
                    if (!this.listeners[t]) {
                        this.listeners[t] = [];
                    }
                    this.listeners[t].push(r);
                };
                t.off = function e(t, r) {
                    if (!this.listeners[t]) {
                        return false;
                    }
                    var n = this.listeners[t].indexOf(r);
                    this.listeners[t] = this.listeners[t].slice(0);
                    this.listeners[t].splice(n, 1);
                    return n > -1;
                };
                t.trigger = function e(t) {
                    var r = this.listeners[t];
                    if (!r) {
                        return;
                    }
                    if (arguments.length === 2) {
                        var n = r.length;
                        for(var i = 0; i < n; ++i){
                            r[i].call(this, arguments[1]);
                        }
                    } else {
                        var a = Array.prototype.slice.call(arguments, 1);
                        var o = r.length;
                        for(var s = 0; s < o; ++s){
                            r[s].apply(this, a);
                        }
                    }
                };
                t.dispose = function e() {
                    this.listeners = {};
                };
                t.pipe = function e(t) {
                    this.on("data", function(e) {
                        t.push(e);
                    });
                };
                return e;
            })();
            var a = r(7462);
            var o = r(7326);
            var s = r(6722);
            var u = (function(e) {
                (0, n.Z)(t, e);
                function t() {
                    var t;
                    t = e.call(this) || this;
                    t.buffer = "";
                    return t;
                }
                var r = t.prototype;
                r.push = function e(t) {
                    var r;
                    this.buffer += t;
                    r = this.buffer.indexOf("\n");
                    for(; r > -1; r = this.buffer.indexOf("\n")){
                        this.trigger("data", this.buffer.substring(0, r));
                        this.buffer = this.buffer.substring(r + 1);
                    }
                };
                return t;
            })(i);
            var f = String.fromCharCode(0x09);
            var c = function e(t) {
                var r = /([0-9.]*)?@?([0-9.]*)?/.exec(t || "");
                var n = {};
                if (r[1]) {
                    n.length = parseInt(r[1], 10);
                }
                if (r[2]) {
                    n.offset = parseInt(r[2], 10);
                }
                return n;
            };
            var l = function e() {
                var t = "[^=]*";
                var r = '"[^"]*"|[^,]*';
                var n = "(?:" + t + ")=(?:" + r + ")";
                return new RegExp("(?:^|,)(" + n + ")");
            };
            var h = function e(t) {
                var r = t.split(l());
                var n = {};
                var i = r.length;
                var a;
                while(i--){
                    if (r[i] === "") {
                        continue;
                    }
                    a = /([^=]*)=(.*)/.exec(r[i]).slice(1);
                    a[0] = a[0].replace(/^\s+|\s+$/g, "");
                    a[1] = a[1].replace(/^\s+|\s+$/g, "");
                    a[1] = a[1].replace(/^['"](.*)['"]$/g, "$1");
                    n[a[0]] = a[1];
                }
                return n;
            };
            var p = (function(e) {
                (0, n.Z)(t, e);
                function t() {
                    var t;
                    t = e.call(this) || this;
                    t.customParsers = [];
                    t.tagMappers = [];
                    return t;
                }
                var r = t.prototype;
                r.push = function e(t) {
                    var r = this;
                    var n;
                    var i;
                    t = t.trim();
                    if (t.length === 0) {
                        return;
                    }
                    if (t[0] !== "#") {
                        this.trigger("data", {
                            type: "uri",
                            uri: t
                        });
                        return;
                    }
                    var o = this.tagMappers.reduce(function(e, r) {
                        var n = r(t);
                        if (n === t) {
                            return e;
                        }
                        return e.concat([
                            n
                        ]);
                    }, [
                        t
                    ]);
                    o.forEach(function(e) {
                        for(var t = 0; t < r.customParsers.length; t++){
                            if (r.customParsers[t].call(r, e)) {
                                return;
                            }
                        }
                        if (e.indexOf("#EXT") !== 0) {
                            r.trigger("data", {
                                type: "comment",
                                text: e.slice(1)
                            });
                            return;
                        }
                        e = e.replace("\r", "");
                        n = /^#EXTM3U/.exec(e);
                        if (n) {
                            r.trigger("data", {
                                type: "tag",
                                tagType: "m3u"
                            });
                            return;
                        }
                        n = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "inf"
                            };
                            if (n[1]) {
                                i.duration = parseFloat(n[1]);
                            }
                            if (n[2]) {
                                i.title = n[2];
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "targetduration"
                            };
                            if (n[1]) {
                                i.duration = parseInt(n[1], 10);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "version"
                            };
                            if (n[1]) {
                                i.version = parseInt(n[1], 10);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "media-sequence"
                            };
                            if (n[1]) {
                                i.number = parseInt(n[1], 10);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "discontinuity-sequence"
                            };
                            if (n[1]) {
                                i.number = parseInt(n[1], 10);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "playlist-type"
                            };
                            if (n[1]) {
                                i.playlistType = n[1];
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(e);
                        if (n) {
                            i = (0, a.Z)(c(n[1]), {
                                type: "tag",
                                tagType: "byterange"
                            });
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "allow-cache"
                            };
                            if (n[1]) {
                                i.allowed = !/NO/.test(n[1]);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-MAP:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "map"
                            };
                            if (n[1]) {
                                var o = h(n[1]);
                                if (o.URI) {
                                    i.uri = o.URI;
                                }
                                if (o.BYTERANGE) {
                                    i.byterange = c(o.BYTERANGE);
                                }
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-STREAM-INF:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "stream-inf"
                            };
                            if (n[1]) {
                                i.attributes = h(n[1]);
                                if (i.attributes.RESOLUTION) {
                                    var s = i.attributes.RESOLUTION.split("x");
                                    var u = {};
                                    if (s[0]) {
                                        u.width = parseInt(s[0], 10);
                                    }
                                    if (s[1]) {
                                        u.height = parseInt(s[1], 10);
                                    }
                                    i.attributes.RESOLUTION = u;
                                }
                                if (i.attributes.BANDWIDTH) {
                                    i.attributes.BANDWIDTH = parseInt(i.attributes.BANDWIDTH, 10);
                                }
                                if (i.attributes["PROGRAM-ID"]) {
                                    i.attributes["PROGRAM-ID"] = parseInt(i.attributes["PROGRAM-ID"], 10);
                                }
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-MEDIA:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "media"
                            };
                            if (n[1]) {
                                i.attributes = h(n[1]);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-ENDLIST/.exec(e);
                        if (n) {
                            r.trigger("data", {
                                type: "tag",
                                tagType: "endlist"
                            });
                            return;
                        }
                        n = /^#EXT-X-DISCONTINUITY/.exec(e);
                        if (n) {
                            r.trigger("data", {
                                type: "tag",
                                tagType: "discontinuity"
                            });
                            return;
                        }
                        n = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "program-date-time"
                            };
                            if (n[1]) {
                                i.dateTimeString = n[1];
                                i.dateTimeObject = new Date(n[1]);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-KEY:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "key"
                            };
                            if (n[1]) {
                                i.attributes = h(n[1]);
                                if (i.attributes.IV) {
                                    if (i.attributes.IV.substring(0, 2).toLowerCase() === "0x") {
                                        i.attributes.IV = i.attributes.IV.substring(2);
                                    }
                                    i.attributes.IV = i.attributes.IV.match(/.{8}/g);
                                    i.attributes.IV[0] = parseInt(i.attributes.IV[0], 16);
                                    i.attributes.IV[1] = parseInt(i.attributes.IV[1], 16);
                                    i.attributes.IV[2] = parseInt(i.attributes.IV[2], 16);
                                    i.attributes.IV[3] = parseInt(i.attributes.IV[3], 16);
                                    i.attributes.IV = new Uint32Array(i.attributes.IV);
                                }
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-START:?(.*)$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "start"
                            };
                            if (n[1]) {
                                i.attributes = h(n[1]);
                                i.attributes["TIME-OFFSET"] = parseFloat(i.attributes["TIME-OFFSET"]);
                                i.attributes.PRECISE = /YES/.test(i.attributes.PRECISE);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "cue-out-cont"
                            };
                            if (n[1]) {
                                i.data = n[1];
                            } else {
                                i.data = "";
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "cue-out"
                            };
                            if (n[1]) {
                                i.data = n[1];
                            } else {
                                i.data = "";
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-CUE-IN:?(.*)?$/.exec(e);
                        if (n) {
                            i = {
                                type: "tag",
                                tagType: "cue-in"
                            };
                            if (n[1]) {
                                i.data = n[1];
                            } else {
                                i.data = "";
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-SKIP:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "skip"
                            };
                            i.attributes = h(n[1]);
                            if (i.attributes.hasOwnProperty("SKIPPED-SEGMENTS")) {
                                i.attributes["SKIPPED-SEGMENTS"] = parseInt(i.attributes["SKIPPED-SEGMENTS"], 10);
                            }
                            if (i.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES")) {
                                i.attributes["RECENTLY-REMOVED-DATERANGES"] = i.attributes["RECENTLY-REMOVED-DATERANGES"].split(f);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-PART:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "part"
                            };
                            i.attributes = h(n[1]);
                            [
                                "DURATION"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = parseFloat(i.attributes[e]);
                                }
                            });
                            [
                                "INDEPENDENT",
                                "GAP"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = /YES/.test(i.attributes[e]);
                                }
                            });
                            if (i.attributes.hasOwnProperty("BYTERANGE")) {
                                i.attributes.byterange = c(i.attributes.BYTERANGE);
                            }
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "server-control"
                            };
                            i.attributes = h(n[1]);
                            [
                                "CAN-SKIP-UNTIL",
                                "PART-HOLD-BACK",
                                "HOLD-BACK", 
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = parseFloat(i.attributes[e]);
                                }
                            });
                            [
                                "CAN-SKIP-DATERANGES",
                                "CAN-BLOCK-RELOAD"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = /YES/.test(i.attributes[e]);
                                }
                            });
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-PART-INF:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "part-inf"
                            };
                            i.attributes = h(n[1]);
                            [
                                "PART-TARGET"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = parseFloat(i.attributes[e]);
                                }
                            });
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "preload-hint"
                            };
                            i.attributes = h(n[1]);
                            [
                                "BYTERANGE-START",
                                "BYTERANGE-LENGTH"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = parseInt(i.attributes[e], 10);
                                    var t = e === "BYTERANGE-LENGTH" ? "length" : "offset";
                                    i.attributes.byterange = i.attributes.byterange || {};
                                    i.attributes.byterange[t] = i.attributes[e];
                                    delete i.attributes[e];
                                }
                            });
                            r.trigger("data", i);
                            return;
                        }
                        n = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(e);
                        if (n && n[1]) {
                            i = {
                                type: "tag",
                                tagType: "rendition-report"
                            };
                            i.attributes = h(n[1]);
                            [
                                "LAST-MSN",
                                "LAST-PART"
                            ].forEach(function(e) {
                                if (i.attributes.hasOwnProperty(e)) {
                                    i.attributes[e] = parseInt(i.attributes[e], 10);
                                }
                            });
                            r.trigger("data", i);
                            return;
                        }
                        r.trigger("data", {
                            type: "tag",
                            data: e.slice(4)
                        });
                    });
                };
                r.addParser = function e(t) {
                    var r = this;
                    var n = t.expression, i = t.customType, a = t.dataParser, o = t.segment;
                    if (typeof a !== "function") {
                        a = function e(t) {
                            return t;
                        };
                    }
                    this.customParsers.push(function(e) {
                        var t = n.exec(e);
                        if (t) {
                            r.trigger("data", {
                                type: "custom",
                                data: a(e),
                                customType: i,
                                segment: o
                            });
                            return true;
                        }
                    });
                };
                r.addTagMapper = function e(t) {
                    var r = t.expression, n = t.map;
                    var i = function e(t) {
                        if (r.test(t)) {
                            return n(t);
                        }
                        return t;
                    };
                    this.tagMappers.push(i);
                };
                return t;
            })(i);
            var v = function e(t) {
                return t.toLowerCase().replace(/-(\w)/g, function(e) {
                    return e[1].toUpperCase();
                });
            };
            var d = function e(t) {
                var r = {};
                Object.keys(t).forEach(function(e) {
                    r[v(e)] = t[e];
                });
                return r;
            };
            var g = function e(t) {
                var r = t.serverControl, n = t.targetDuration, i = t.partTargetDuration;
                if (!r) {
                    return;
                }
                var a = "#EXT-X-SERVER-CONTROL";
                var o = "holdBack";
                var s = "partHoldBack";
                var u = n && n * 3;
                var f = i && i * 2;
                if (n && !r.hasOwnProperty(o)) {
                    r[o] = u;
                    this.trigger("info", {
                        message: a + " defaulting HOLD-BACK to targetDuration * 3 (" + u + ")."
                    });
                }
                if (u && r[o] < u) {
                    this.trigger("warn", {
                        message: a + " clamping HOLD-BACK (" + r[o] + ") to targetDuration * 3 (" + u + ")"
                    });
                    r[o] = u;
                }
                if (i && !r.hasOwnProperty(s)) {
                    r[s] = i * 3;
                    this.trigger("info", {
                        message: a + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + r[s] + ")."
                    });
                }
                if (i && r[s] < f) {
                    this.trigger("warn", {
                        message: a + " clamping PART-HOLD-BACK (" + r[s] + ") to partTargetDuration * 2 (" + f + ")."
                    });
                    r[s] = f;
                }
            };
            var m = (function(e) {
                (0, n.Z)(t, e);
                function t() {
                    var t;
                    t = e.call(this) || this;
                    t.lineStream = new u();
                    t.parseStream = new p();
                    t.lineStream.pipe(t.parseStream);
                    var r = (0, o.Z)(t);
                    var n = [];
                    var i = {};
                    var f;
                    var c;
                    var l = false;
                    var h = function e() {};
                    var v = {
                        AUDIO: {},
                        VIDEO: {},
                        "CLOSED-CAPTIONS": {},
                        SUBTITLES: {}
                    };
                    var m = "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed";
                    var b = 0;
                    t.manifest = {
                        allowCache: true,
                        discontinuityStarts: [],
                        segments: []
                    };
                    var y = 0;
                    var w = 0;
                    t.on("end", function() {
                        if (i.uri || (!i.parts && !i.preloadHints)) {
                            return;
                        }
                        if (!i.map && f) {
                            i.map = f;
                        }
                        if (!i.key && c) {
                            i.key = c;
                        }
                        if (!i.timeline && typeof b === "number") {
                            i.timeline = b;
                        }
                        t.manifest.preloadSegment = i;
                    });
                    t.parseStream.on("data", function(e) {
                        var t;
                        var o;
                        ({
                            tag: function u() {
                                (({
                                    version: function t() {
                                        if (e.version) {
                                            this.manifest.version = e.version;
                                        }
                                    },
                                    "allow-cache": function t() {
                                        this.manifest.allowCache = e.allowed;
                                        if (!("allowed" in e)) {
                                            this.trigger("info", {
                                                message: "defaulting allowCache to YES"
                                            });
                                            this.manifest.allowCache = true;
                                        }
                                    },
                                    byterange: function t() {
                                        var t = {};
                                        if ("length" in e) {
                                            i.byterange = t;
                                            t.length = e.length;
                                            if (!("offset" in e)) {
                                                e.offset = y;
                                            }
                                        }
                                        if ("offset" in e) {
                                            i.byterange = t;
                                            t.offset = e.offset;
                                        }
                                        y = t.offset + t.length;
                                    },
                                    endlist: function e() {
                                        this.manifest.endList = true;
                                    },
                                    inf: function t() {
                                        if (!("mediaSequence" in this.manifest)) {
                                            this.manifest.mediaSequence = 0;
                                            this.trigger("info", {
                                                message: "defaulting media sequence to zero"
                                            });
                                        }
                                        if (!("discontinuitySequence" in this.manifest)) {
                                            this.manifest.discontinuitySequence = 0;
                                            this.trigger("info", {
                                                message: "defaulting discontinuity sequence to zero"
                                            });
                                        }
                                        if (e.duration > 0) {
                                            i.duration = e.duration;
                                        }
                                        if (e.duration === 0) {
                                            i.duration = 0.01;
                                            this.trigger("info", {
                                                message: "updating zero segment duration to a small value"
                                            });
                                        }
                                        this.manifest.segments = n;
                                    },
                                    key: function t() {
                                        if (!e.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without attribute list"
                                            });
                                            return;
                                        }
                                        if (e.attributes.METHOD === "NONE") {
                                            c = null;
                                            return;
                                        }
                                        if (!e.attributes.URI) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without URI"
                                            });
                                            return;
                                        }
                                        if (e.attributes.KEYFORMAT === "com.apple.streamingkeydelivery") {
                                            this.manifest.contentProtection = this.manifest.contentProtection || {};
                                            this.manifest.contentProtection["com.apple.fps.1_0"] = {
                                                attributes: e.attributes
                                            };
                                            return;
                                        }
                                        if (e.attributes.KEYFORMAT === m) {
                                            var r = [
                                                "SAMPLE-AES",
                                                "SAMPLE-AES-CTR",
                                                "SAMPLE-AES-CENC", 
                                            ];
                                            if (r.indexOf(e.attributes.METHOD) === -1) {
                                                this.trigger("warn", {
                                                    message: "invalid key method provided for Widevine"
                                                });
                                                return;
                                            }
                                            if (e.attributes.METHOD === "SAMPLE-AES-CENC") {
                                                this.trigger("warn", {
                                                    message: "SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead"
                                                });
                                            }
                                            if (e.attributes.URI.substring(0, 23) !== "data:text/plain;base64,") {
                                                this.trigger("warn", {
                                                    message: "invalid key URI provided for Widevine"
                                                });
                                                return;
                                            }
                                            if (!(e.attributes.KEYID && e.attributes.KEYID.substring(0, 2) === "0x")) {
                                                this.trigger("warn", {
                                                    message: "invalid key ID provided for Widevine"
                                                });
                                                return;
                                            }
                                            this.manifest.contentProtection = this.manifest.contentProtection || {};
                                            this.manifest.contentProtection["com.widevine.alpha"] = {
                                                attributes: {
                                                    schemeIdUri: e.attributes.KEYFORMAT,
                                                    keyId: e.attributes.KEYID.substring(2)
                                                },
                                                pssh: (0, s.Z)(e.attributes.URI.split(",")[1])
                                            };
                                            return;
                                        }
                                        if (!e.attributes.METHOD) {
                                            this.trigger("warn", {
                                                message: "defaulting key method to AES-128"
                                            });
                                        }
                                        c = {
                                            method: e.attributes.METHOD || "AES-128",
                                            uri: e.attributes.URI
                                        };
                                        if (typeof e.attributes.IV !== "undefined") {
                                            c.iv = e.attributes.IV;
                                        }
                                    },
                                    "media-sequence": function t() {
                                        if (!isFinite(e.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid media sequence: " + e.number
                                            });
                                            return;
                                        }
                                        this.manifest.mediaSequence = e.number;
                                    },
                                    "discontinuity-sequence": function t() {
                                        if (!isFinite(e.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid discontinuity sequence: " + e.number
                                            });
                                            return;
                                        }
                                        this.manifest.discontinuitySequence = e.number;
                                        b = e.number;
                                    },
                                    "playlist-type": function t() {
                                        if (!/VOD|EVENT/.test(e.playlistType)) {
                                            this.trigger("warn", {
                                                message: "ignoring unknown playlist type: " + e.playlist
                                            });
                                            return;
                                        }
                                        this.manifest.playlistType = e.playlistType;
                                    },
                                    map: function t() {
                                        f = {};
                                        if (e.uri) {
                                            f.uri = e.uri;
                                        }
                                        if (e.byterange) {
                                            f.byterange = e.byterange;
                                        }
                                        if (c) {
                                            f.key = c;
                                        }
                                    },
                                    "stream-inf": function t() {
                                        this.manifest.playlists = n;
                                        this.manifest.mediaGroups = this.manifest.mediaGroups || v;
                                        if (!e.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring empty stream-inf attributes"
                                            });
                                            return;
                                        }
                                        if (!i.attributes) {
                                            i.attributes = {};
                                        }
                                        (0, a.Z)(i.attributes, e.attributes);
                                    },
                                    media: function r() {
                                        this.manifest.mediaGroups = this.manifest.mediaGroups || v;
                                        if (!(e.attributes && e.attributes.TYPE && e.attributes["GROUP-ID"] && e.attributes.NAME)) {
                                            this.trigger("warn", {
                                                message: "ignoring incomplete or missing media group"
                                            });
                                            return;
                                        }
                                        var n = this.manifest.mediaGroups[e.attributes.TYPE];
                                        n[e.attributes["GROUP-ID"]] = n[e.attributes["GROUP-ID"]] || {};
                                        t = n[e.attributes["GROUP-ID"]];
                                        o = {
                                            default: /yes/i.test(e.attributes.DEFAULT)
                                        };
                                        if (o.default) {
                                            o.autoselect = true;
                                        } else {
                                            o.autoselect = /yes/i.test(e.attributes.AUTOSELECT);
                                        }
                                        if (e.attributes.LANGUAGE) {
                                            o.language = e.attributes.LANGUAGE;
                                        }
                                        if (e.attributes.URI) {
                                            o.uri = e.attributes.URI;
                                        }
                                        if (e.attributes["INSTREAM-ID"]) {
                                            o.instreamId = e.attributes["INSTREAM-ID"];
                                        }
                                        if (e.attributes.CHARACTERISTICS) {
                                            o.characteristics = e.attributes.CHARACTERISTICS;
                                        }
                                        if (e.attributes.FORCED) {
                                            o.forced = /yes/i.test(e.attributes.FORCED);
                                        }
                                        t[e.attributes.NAME] = o;
                                    },
                                    discontinuity: function e() {
                                        b += 1;
                                        i.discontinuity = true;
                                        this.manifest.discontinuityStarts.push(n.length);
                                    },
                                    "program-date-time": function t() {
                                        if (typeof this.manifest.dateTimeString === "undefined") {
                                            this.manifest.dateTimeString = e.dateTimeString;
                                            this.manifest.dateTimeObject = e.dateTimeObject;
                                        }
                                        i.dateTimeString = e.dateTimeString;
                                        i.dateTimeObject = e.dateTimeObject;
                                    },
                                    targetduration: function t() {
                                        if (!isFinite(e.duration) || e.duration < 0) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid target duration: " + e.duration
                                            });
                                            return;
                                        }
                                        this.manifest.targetDuration = e.duration;
                                        g.call(this, this.manifest);
                                    },
                                    start: function t() {
                                        if (!e.attributes || isNaN(e.attributes["TIME-OFFSET"])) {
                                            this.trigger("warn", {
                                                message: "ignoring start declaration without appropriate attribute list"
                                            });
                                            return;
                                        }
                                        this.manifest.start = {
                                            timeOffset: e.attributes["TIME-OFFSET"],
                                            precise: e.attributes.PRECISE
                                        };
                                    },
                                    "cue-out": function t() {
                                        i.cueOut = e.data;
                                    },
                                    "cue-out-cont": function t() {
                                        i.cueOutCont = e.data;
                                    },
                                    "cue-in": function t() {
                                        i.cueIn = e.data;
                                    },
                                    skip: function t() {
                                        this.manifest.skip = d(e.attributes);
                                        this.warnOnMissingAttributes_("#EXT-X-SKIP", e.attributes, [
                                            "SKIPPED-SEGMENTS"
                                        ]);
                                    },
                                    part: function t() {
                                        var r = this;
                                        l = true;
                                        var n = this.manifest.segments.length;
                                        var t = d(e.attributes);
                                        i.parts = i.parts || [];
                                        i.parts.push(t);
                                        if (t.byterange) {
                                            if (!t.byterange.hasOwnProperty("offset")) {
                                                t.byterange.offset = w;
                                            }
                                            w = t.byterange.offset + t.byterange.length;
                                        }
                                        var a = i.parts.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PART #" + a + " for segment #" + n, e.attributes, [
                                            "URI",
                                            "DURATION"
                                        ]);
                                        if (this.manifest.renditionReports) {
                                            this.manifest.renditionReports.forEach(function(e, t) {
                                                if (!e.hasOwnProperty("lastPart")) {
                                                    r.trigger("warn", {
                                                        message: "#EXT-X-RENDITION-REPORT #" + t + " lacks required attribute(s): LAST-PART"
                                                    });
                                                }
                                            });
                                        }
                                    },
                                    "server-control": function t() {
                                        var r = (this.manifest.serverControl = d(e.attributes));
                                        if (!r.hasOwnProperty("canBlockReload")) {
                                            r.canBlockReload = false;
                                            this.trigger("info", {
                                                message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
                                            });
                                        }
                                        g.call(this, this.manifest);
                                        if (r.canSkipDateranges && !r.hasOwnProperty("canSkipUntil")) {
                                            this.trigger("warn", {
                                                message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
                                            });
                                        }
                                    },
                                    "preload-hint": function t() {
                                        var r = this.manifest.segments.length;
                                        var n = d(e.attributes);
                                        var a = n.type && n.type === "PART";
                                        i.preloadHints = i.preloadHints || [];
                                        i.preloadHints.push(n);
                                        if (n.byterange) {
                                            if (!n.byterange.hasOwnProperty("offset")) {
                                                n.byterange.offset = a ? w : 0;
                                                if (a) {
                                                    w = n.byterange.offset + n.byterange.length;
                                                }
                                            }
                                        }
                                        var o = i.preloadHints.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + o + " for segment #" + r, e.attributes, [
                                            "TYPE",
                                            "URI"
                                        ]);
                                        if (!n.type) {
                                            return;
                                        }
                                        for(var s = 0; s < i.preloadHints.length - 1; s++){
                                            var u = i.preloadHints[s];
                                            if (!u.type) {
                                                continue;
                                            }
                                            if (u.type === n.type) {
                                                this.trigger("warn", {
                                                    message: "#EXT-X-PRELOAD-HINT #" + o + " for segment #" + r + " has the same TYPE " + n.type + " as preload hint #" + s
                                                });
                                            }
                                        }
                                    },
                                    "rendition-report": function t() {
                                        var r = d(e.attributes);
                                        this.manifest.renditionReports = this.manifest.renditionReports || [];
                                        this.manifest.renditionReports.push(r);
                                        var n = this.manifest.renditionReports.length - 1;
                                        var i = [
                                            "LAST-MSN",
                                            "URI", 
                                        ];
                                        if (l) {
                                            i.push("LAST-PART");
                                        }
                                        this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + n, e.attributes, i);
                                    },
                                    "part-inf": function t() {
                                        this.manifest.partInf = d(e.attributes);
                                        this.warnOnMissingAttributes_("#EXT-X-PART-INF", e.attributes, [
                                            "PART-TARGET"
                                        ]);
                                        if (this.manifest.partInf.partTarget) {
                                            this.manifest.partTargetDuration = this.manifest.partInf.partTarget;
                                        }
                                        g.call(this, this.manifest);
                                    }
                                }[e.tagType] || h).call(r));
                            },
                            uri: function t() {
                                i.uri = e.uri;
                                n.push(i);
                                if (this.manifest.targetDuration && !("duration" in i)) {
                                    this.trigger("warn", {
                                        message: "defaulting segment duration to the target duration"
                                    });
                                    i.duration = this.manifest.targetDuration;
                                }
                                if (c) {
                                    i.key = c;
                                }
                                i.timeline = b;
                                if (f) {
                                    i.map = f;
                                }
                                w = 0;
                                i = {};
                            },
                            comment: function e() {},
                            custom: function t() {
                                if (e.segment) {
                                    i.custom = i.custom || {};
                                    i.custom[e.customType] = e.data;
                                } else {
                                    this.manifest.custom = this.manifest.custom || {};
                                    this.manifest.custom[e.customType] = e.data;
                                }
                            }
                        }[e.type].call(r));
                    });
                    return t;
                }
                var r = t.prototype;
                r.warnOnMissingAttributes_ = function e(t, r, n) {
                    var i = [];
                    n.forEach(function(e) {
                        if (!r.hasOwnProperty(e)) {
                            i.push(e);
                        }
                    });
                    if (i.length) {
                        this.trigger("warn", {
                            message: t + " lacks required attribute(s): " + i.join(", ")
                        });
                    }
                };
                r.push = function e(t) {
                    this.lineStream.push(t);
                };
                r.end = function e() {
                    this.lineStream.push("\n");
                    this.trigger("end");
                };
                r.addParser = function e(t) {
                    this.parseStream.addParser(t);
                };
                r.addTagMapper = function e(t) {
                    this.parseStream.addTagMapper(t);
                };
                return t;
            })(i);
        },
        973: function(e, t, r) {
            "use strict";
            r.d(t, {
                jp: function() {
                    return A;
                },
                mm: function() {
                    return S;
                },
                Qc: function() {
                    return ed;
                },
                LG: function() {
                    return eg;
                }
            });
            var n = r(779);
            var i = r(8908);
            var a = r.n(i);
            var o = r(6722);
            var s = r(3969);
            var u = "0.19.2";
            var f = function e(t) {
                return !!t && typeof t === "object";
            };
            var c = function e() {
                for(var t = arguments.length, r = new Array(t), n = 0; n < t; n++){
                    r[n] = arguments[n];
                }
                return r.reduce(function(t, r) {
                    if (typeof r !== "object") {
                        return t;
                    }
                    Object.keys(r).forEach(function(n) {
                        if (Array.isArray(t[n]) && Array.isArray(r[n])) {
                            t[n] = t[n].concat(r[n]);
                        } else if (f(t[n]) && f(r[n])) {
                            t[n] = e(t[n], r[n]);
                        } else {
                            t[n] = r[n];
                        }
                    });
                    return t;
                }, {});
            };
            var l = function e(t) {
                return Object.keys(t).map(function(e) {
                    return t[e];
                });
            };
            var h = function e(t, r) {
                var n = [];
                for(var i = t; i < r; i++){
                    n.push(i);
                }
                return n;
            };
            var p = function e(t) {
                return t.reduce(function(e, t) {
                    return e.concat(t);
                }, []);
            };
            var v = function e(t) {
                if (!t.length) {
                    return [];
                }
                var r = [];
                for(var n = 0; n < t.length; n++){
                    r.push(t[n]);
                }
                return r;
            };
            var d = function e(t, r) {
                return t.reduce(function(e, t, n) {
                    if (t[r]) {
                        e.push(n);
                    }
                    return e;
                }, []);
            };
            var g = {
                INVALID_NUMBER_OF_PERIOD: "INVALID_NUMBER_OF_PERIOD",
                DASH_EMPTY_MANIFEST: "DASH_EMPTY_MANIFEST",
                DASH_INVALID_XML: "DASH_INVALID_XML",
                NO_BASE_URL: "NO_BASE_URL",
                MISSING_SEGMENT_INFORMATION: "MISSING_SEGMENT_INFORMATION",
                SEGMENT_TIME_UNSPECIFIED: "SEGMENT_TIME_UNSPECIFIED",
                UNSUPPORTED_UTC_TIMING_SCHEME: "UNSUPPORTED_UTC_TIMING_SCHEME"
            };
            var m = function e(t) {
                var r = t.baseUrl, i = r === void 0 ? "" : r, a = t.source, o = a === void 0 ? "" : a, s = t.range, u = s === void 0 ? "" : s, f = t.indexRange, c = f === void 0 ? "" : f;
                var l = {
                    uri: o,
                    resolvedUri: (0, n.Z)(i || "", o)
                };
                if (u || c) {
                    var h = u ? u : c;
                    var p = h.split("-");
                    var v = parseInt(p[0], 10);
                    var d = parseInt(p[1], 10);
                    l.byterange = {
                        length: d - v + 1,
                        offset: v
                    };
                }
                return l;
            };
            var b = function e(t) {
                var r = t.offset + t.length - 1;
                return t.offset + "-" + r;
            };
            var y = function e(t) {
                if (t && typeof t !== "number") {
                    t = parseInt(t, 10);
                }
                if (isNaN(t)) {
                    return null;
                }
                return t;
            };
            var w = {
                static: function e(t) {
                    var r = t.duration, n = t.timescale, i = n === void 0 ? 1 : n, a = t.sourceDuration, o = t.periodDuration;
                    var s = y(t.endNumber);
                    var u = r / i;
                    if (typeof s === "number") {
                        return {
                            start: 0,
                            end: s
                        };
                    }
                    if (typeof o === "number") {
                        return {
                            start: 0,
                            end: o / u
                        };
                    }
                    return {
                        start: 0,
                        end: a / u
                    };
                },
                dynamic: function e(t) {
                    var r = t.NOW, n = t.clientOffset, i = t.availabilityStartTime, a = t.timescale, o = a === void 0 ? 1 : a, s = t.duration, u = t.start, f = u === void 0 ? 0 : u, c = t.minimumUpdatePeriod, l = c === void 0 ? 0 : c, h = t.timeShiftBufferDepth, p = h === void 0 ? Infinity : h;
                    var v = y(t.endNumber);
                    var d = (r + n) / 1000;
                    var g = i + f;
                    var m = d + l;
                    var b = m - g;
                    var w = Math.ceil((b * o) / s);
                    var E = Math.floor(((d - g - p) * o) / s);
                    var T = Math.floor(((d - g) * o) / s);
                    return {
                        start: Math.max(0, E),
                        end: typeof v === "number" ? v : Math.min(w, T)
                    };
                }
            };
            var E = function e(t) {
                return function(e, r) {
                    var n = t.duration, i = t.timescale, a = i === void 0 ? 1 : i, o = t.periodIndex, s = t.startNumber, u = s === void 0 ? 1 : s;
                    return {
                        number: u + e,
                        duration: n / a,
                        timeline: o,
                        time: r * n
                    };
                };
            };
            var T = function e(t) {
                var r = t.type, n = t.duration, i = t.timescale, a = i === void 0 ? 1 : i, o = t.periodDuration, s = t.sourceDuration;
                var u = w[r](t), f = u.start, c = u.end;
                var l = h(f, c).map(E(t));
                if (r === "static") {
                    var p = l.length - 1;
                    var v = typeof o === "number" ? o : s;
                    l[p].duration = v - (n / a) * p;
                }
                return l;
            };
            var N = function e(t) {
                var r = t.baseUrl, n = t.initialization, i = n === void 0 ? {} : n, a = t.sourceDuration, o = t.indexRange, s = o === void 0 ? "" : o, u = t.duration;
                if (!r) {
                    throw new Error(g.NO_BASE_URL);
                }
                var f = m({
                    baseUrl: r,
                    source: i.sourceURL,
                    range: i.range
                });
                var c = m({
                    baseUrl: r,
                    source: r,
                    indexRange: s
                });
                c.map = f;
                if (u) {
                    var l = T(t);
                    if (l.length) {
                        c.duration = l[0].duration;
                        c.timeline = l[0].timeline;
                    }
                } else if (a) {
                    c.duration = a;
                    c.timeline = 0;
                }
                c.number = 0;
                return [
                    c
                ];
            };
            var A = function e(t, r, n) {
                var i = t.sidx.map ? t.sidx.map : null;
                var a = t.sidx.duration;
                var o = t.timeline || 0;
                var s = t.sidx.byterange;
                var u = s.offset + s.length;
                var f = r.timescale;
                var c = r.references.filter(function(e) {
                    return e.referenceType !== 1;
                });
                var l = [];
                var h = t.endList ? "static" : "dynamic";
                var p = u + r.firstOffset;
                for(var v = 0; v < c.length; v++){
                    var d = r.references[v];
                    var g = d.referencedSize;
                    var m = d.subsegmentDuration;
                    var b = p + g - 1;
                    var y = p + "-" + b;
                    var w = {
                        baseUrl: n,
                        timescale: f,
                        timeline: o,
                        periodIndex: o,
                        duration: m,
                        sourceDuration: a,
                        indexRange: y,
                        type: h
                    };
                    var E = N(w)[0];
                    if (i) {
                        E.map = i;
                    }
                    l.push(E);
                    p += g;
                }
                t.segments = l;
                return t;
            };
            var S = function e(t) {
                return (t && t.uri + "-" + b(t.byterange));
            };
            var x = function e(t) {
                var r = l(t.reduce(function(e, t) {
                    var r = t.attributes.id + (t.attributes.lang || "");
                    if (e[r]) {
                        var n;
                        if (t.segments[0]) {
                            t.segments[0].discontinuity = true;
                        }
                        (n = e[r].segments).push.apply(n, t.segments);
                        if (t.attributes.contentProtection) {
                            e[r].attributes.contentProtection = t.attributes.contentProtection;
                        }
                    } else {
                        e[r] = t;
                    }
                    return e;
                }, {}));
                return r.map(function(e) {
                    e.discontinuityStarts = d(e.segments, "discontinuity");
                    return e;
                });
            };
            var I = function e(t, r) {
                var n = S(t.sidx);
                var i = n && r[n] && r[n].sidx;
                if (i) {
                    A(t, i, t.sidx.resolvedUri);
                }
                return t;
            };
            var C = function e(t, r) {
                if (r === void 0) {
                    r = {};
                }
                if (!Object.keys(r).length) {
                    return t;
                }
                for(var n in t){
                    t[n] = I(t[n], r);
                }
                return t;
            };
            var R = function e(t, r) {
                var n;
                var i = t.attributes, a = t.segments, o = t.sidx;
                var s = {
                    attributes: ((n = {
                        NAME: i.id,
                        BANDWIDTH: i.bandwidth,
                        CODECS: i.codecs
                    }), (n["PROGRAM-ID"] = 1), n),
                    uri: "",
                    endList: i.type === "static",
                    timeline: i.periodIndex,
                    resolvedUri: "",
                    targetDuration: i.duration,
                    segments: a,
                    mediaSequence: a.length ? a[0].number : 1
                };
                if (i.contentProtection) {
                    s.contentProtection = i.contentProtection;
                }
                if (o) {
                    s.sidx = o;
                }
                if (r) {
                    s.attributes.AUDIO = "audio";
                    s.attributes.SUBTITLES = "subs";
                }
                return s;
            };
            var O = function e(t) {
                var r;
                var n = t.attributes, i = t.segments;
                if (typeof i === "undefined") {
                    i = [
                        {
                            uri: n.baseUrl,
                            timeline: n.periodIndex,
                            resolvedUri: n.baseUrl || "",
                            duration: n.sourceDuration,
                            number: 0
                        }, 
                    ];
                    n.duration = n.sourceDuration;
                }
                var a = ((r = {
                    NAME: n.id,
                    BANDWIDTH: n.bandwidth
                }), (r["PROGRAM-ID"] = 1), r);
                if (n.codecs) {
                    a.CODECS = n.codecs;
                }
                return {
                    attributes: a,
                    uri: "",
                    endList: n.type === "static",
                    timeline: n.periodIndex,
                    resolvedUri: n.baseUrl || "",
                    targetDuration: n.duration,
                    segments: i,
                    mediaSequence: i.length ? i[0].number : 1
                };
            };
            var D = function e(t, r, n) {
                if (r === void 0) {
                    r = {};
                }
                if (n === void 0) {
                    n = false;
                }
                var i;
                var a = t.reduce(function(e, t) {
                    var a = (t.attributes.role && t.attributes.role.value) || "";
                    var o = t.attributes.lang || "";
                    var s = t.attributes.label || "main";
                    if (o && !t.attributes.label) {
                        var u = a ? " (" + a + ")" : "";
                        s = "" + t.attributes.lang + u;
                    }
                    if (!e[s]) {
                        e[s] = {
                            language: o,
                            autoselect: true,
                            default: a === "main",
                            playlists: [],
                            uri: ""
                        };
                    }
                    var f = I(R(t, n), r);
                    e[s].playlists.push(f);
                    if (typeof i === "undefined" && a === "main") {
                        i = t;
                        i.default = true;
                    }
                    return e;
                }, {});
                if (!i) {
                    var o = Object.keys(a)[0];
                    a[o].default = true;
                }
                return a;
            };
            var L = function e(t, r) {
                if (r === void 0) {
                    r = {};
                }
                return t.reduce(function(e, t) {
                    var n = t.attributes.lang || "text";
                    if (!e[n]) {
                        e[n] = {
                            language: n,
                            default: false,
                            autoselect: false,
                            playlists: [],
                            uri: ""
                        };
                    }
                    e[n].playlists.push(I(O(t), r));
                    return e;
                }, {});
            };
            var U = function e(t) {
                return t.reduce(function(e, t) {
                    if (!t) {
                        return e;
                    }
                    t.forEach(function(t) {
                        var r = t.channel, n = t.language;
                        e[n] = {
                            autoselect: false,
                            default: false,
                            instreamId: r,
                            language: n
                        };
                        if (t.hasOwnProperty("aspectRatio")) {
                            e[n].aspectRatio = t.aspectRatio;
                        }
                        if (t.hasOwnProperty("easyReader")) {
                            e[n].easyReader = t.easyReader;
                        }
                        if (t.hasOwnProperty("3D")) {
                            e[n]["3D"] = t["3D"];
                        }
                    });
                    return e;
                }, {});
            };
            var M = function e(t) {
                var r;
                var n = t.attributes, i = t.segments, a = t.sidx;
                var o = {
                    attributes: ((r = {
                        NAME: n.id,
                        AUDIO: "audio",
                        SUBTITLES: "subs",
                        RESOLUTION: {
                            width: n.width,
                            height: n.height
                        },
                        CODECS: n.codecs,
                        BANDWIDTH: n.bandwidth
                    }), (r["PROGRAM-ID"] = 1), r),
                    uri: "",
                    endList: n.type === "static",
                    timeline: n.periodIndex,
                    resolvedUri: "",
                    targetDuration: n.duration,
                    segments: i,
                    mediaSequence: i.length ? i[0].number : 1
                };
                if (n.contentProtection) {
                    o.contentProtection = n.contentProtection;
                }
                if (a) {
                    o.sidx = a;
                }
                return o;
            };
            var P = function e(t) {
                var r = t.attributes;
                return (r.mimeType === "video/mp4" || r.mimeType === "video/webm" || r.contentType === "video");
            };
            var _ = function e(t) {
                var r = t.attributes;
                return (r.mimeType === "audio/mp4" || r.mimeType === "audio/webm" || r.contentType === "audio");
            };
            var k = function e(t) {
                var r = t.attributes;
                return (r.mimeType === "text/vtt" || r.contentType === "text");
            };
            var B = function e(t, r, n) {
                var i;
                if (n === void 0) {
                    n = {};
                }
                if (!t.length) {
                    return {};
                }
                var a = t[0].attributes, o = a.sourceDuration, s = a.type, u = a.suggestedPresentationDelay, f = a.minimumUpdatePeriod;
                var c = x(t.filter(P)).map(M);
                var l = x(t.filter(_));
                var h = t.filter(k);
                var p = t.map(function(e) {
                    return e.attributes.captionServices;
                }).filter(Boolean);
                var v = {
                    allowCache: true,
                    discontinuityStarts: [],
                    segments: [],
                    endList: true,
                    mediaGroups: ((i = {
                        AUDIO: {},
                        VIDEO: {}
                    }), (i["CLOSED-CAPTIONS"] = {}), (i.SUBTITLES = {}), i),
                    uri: "",
                    duration: o,
                    playlists: C(c, n)
                };
                if (f >= 0) {
                    v.minimumUpdatePeriod = f * 1000;
                }
                if (r) {
                    v.locations = r;
                }
                if (s === "dynamic") {
                    v.suggestedPresentationDelay = u;
                }
                var d = v.playlists.length === 0;
                if (l.length) {
                    v.mediaGroups.AUDIO.audio = D(l, n, d);
                }
                if (h.length) {
                    v.mediaGroups.SUBTITLES.subs = L(h, n);
                }
                if (p.length) {
                    v.mediaGroups["CLOSED-CAPTIONS"].cc = U(p);
                }
                return v;
            };
            var X = function e(t, r, n) {
                var i = t.NOW, a = t.clientOffset, o = t.availabilityStartTime, s = t.timescale, u = s === void 0 ? 1 : s, f = t.start, c = f === void 0 ? 0 : f, l = t.minimumUpdatePeriod, h = l === void 0 ? 0 : l;
                var p = (i + a) / 1000;
                var v = o + c;
                var d = p + h;
                var g = d - v;
                return Math.ceil((g * u - r) / n);
            };
            var H = function e(t, r) {
                var n = t.type, i = t.minimumUpdatePeriod, a = i === void 0 ? 0 : i, o = t.media, s = o === void 0 ? "" : o, u = t.sourceDuration, f = t.timescale, c = f === void 0 ? 1 : f, l = t.startNumber, h = l === void 0 ? 1 : l, p = t.periodIndex;
                var v = [];
                var d = -1;
                for(var g = 0; g < r.length; g++){
                    var m = r[g];
                    var b = m.d;
                    var y = m.r || 0;
                    var w = m.t || 0;
                    if (d < 0) {
                        d = w;
                    }
                    if (w && w > d) {
                        d = w;
                    }
                    var E = void 0;
                    if (y < 0) {
                        var T = g + 1;
                        if (T === r.length) {
                            if (n === "dynamic" && a > 0 && s.indexOf("$Number$") > 0) {
                                E = X(t, d, b);
                            } else {
                                E = (u * c - d) / b;
                            }
                        } else {
                            E = (r[T].t - d) / b;
                        }
                    } else {
                        E = y + 1;
                    }
                    var N = h + v.length + E;
                    var A = h + v.length;
                    while(A < N){
                        v.push({
                            number: A,
                            duration: b / c,
                            time: d,
                            timeline: p
                        });
                        d += b;
                        A++;
                    }
                }
                return v;
            };
            var V = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g;
            var G = function e(t) {
                return function(e, r, n, i) {
                    if (e === "$$") {
                        return "$";
                    }
                    if (typeof t[r] === "undefined") {
                        return e;
                    }
                    var a = "" + t[r];
                    if (r === "RepresentationID") {
                        return a;
                    }
                    if (!n) {
                        i = 1;
                    } else {
                        i = parseInt(i, 10);
                    }
                    if (a.length >= i) {
                        return a;
                    }
                    return ("" + new Array(i - a.length + 1).join("0") + a);
                };
            };
            var F = function e(t, r) {
                return t.replace(V, G(r));
            };
            var j = function e(t, r) {
                if (!t.duration && !r) {
                    return [
                        {
                            number: t.startNumber || 1,
                            duration: t.sourceDuration,
                            time: 0,
                            timeline: t.periodIndex
                        }, 
                    ];
                }
                if (t.duration) {
                    return T(t);
                }
                return H(t, r);
            };
            var z = function e(t, r) {
                var i = {
                    RepresentationID: t.id,
                    Bandwidth: t.bandwidth || 0
                };
                var a = t.initialization, o = a === void 0 ? {
                    sourceURL: "",
                    range: ""
                } : a;
                var s = m({
                    baseUrl: t.baseUrl,
                    source: F(o.sourceURL, i),
                    range: o.range
                });
                var u = j(t, r);
                return u.map(function(e) {
                    i.Number = e.number;
                    i.Time = e.time;
                    var r = F(t.media || "", i);
                    var a = t.timescale || 1;
                    var o = t.presentationTimeOffset || 0;
                    var u = t.periodStart + (e.time - o) / a;
                    var f = {
                        uri: r,
                        timeline: e.timeline,
                        duration: e.duration,
                        resolvedUri: (0, n.Z)(t.baseUrl || "", r),
                        map: s,
                        number: e.number,
                        presentationTime: u
                    };
                    return f;
                });
            };
            var K = function e(t, r) {
                var n = t.baseUrl, i = t.initialization, a = i === void 0 ? {} : i;
                var o = m({
                    baseUrl: n,
                    source: a.sourceURL,
                    range: a.range
                });
                var s = m({
                    baseUrl: n,
                    source: r.media,
                    range: r.mediaRange
                });
                s.map = o;
                return s;
            };
            var q = function e(t, r) {
                var n = t.duration, i = t.segmentUrls, a = i === void 0 ? [] : i, o = t.periodStart;
                if ((!n && !r) || (n && r)) {
                    throw new Error(g.SEGMENT_TIME_UNSPECIFIED);
                }
                var s = a.map(function(e) {
                    return K(t, e);
                });
                var u;
                if (n) {
                    u = T(t);
                }
                if (r) {
                    u = H(t, r);
                }
                var f = u.map(function(e, r) {
                    if (s[r]) {
                        var n = s[r];
                        var i = t.timescale || 1;
                        var a = t.presentationTimeOffset || 0;
                        n.timeline = e.timeline;
                        n.duration = e.duration;
                        n.number = e.number;
                        n.presentationTime = o + (e.time - a) / i;
                        return n;
                    }
                }).filter(function(e) {
                    return e;
                });
                return f;
            };
            var Y = function e(t) {
                var r = t.attributes, n = t.segmentInfo;
                var i;
                var a;
                if (n.template) {
                    a = z;
                    i = c(r, n.template);
                } else if (n.base) {
                    a = N;
                    i = c(r, n.base);
                } else if (n.list) {
                    a = q;
                    i = c(r, n.list);
                }
                var o = {
                    attributes: r
                };
                if (!a) {
                    return o;
                }
                var s = a(i, n.segmentTimeline);
                if (i.duration) {
                    var u = i, f = u.duration, l = u.timescale, h = l === void 0 ? 1 : l;
                    i.duration = f / h;
                } else if (s.length) {
                    i.duration = s.reduce(function(e, t) {
                        return Math.max(e, Math.ceil(t.duration));
                    }, 0);
                } else {
                    i.duration = 0;
                }
                o.attributes = i;
                o.segments = s;
                if (n.base && i.indexRange) {
                    o.sidx = s[0];
                    o.segments = [];
                }
                return o;
            };
            var $ = function e(t) {
                return t.map(Y);
            };
            var W = function e(t, r) {
                return v(t.childNodes).filter(function(e) {
                    var t = e.tagName;
                    return t === r;
                });
            };
            var Z = function e(t) {
                return t.textContent.trim();
            };
            var Q = function e(t) {
                var r = 365 * 24 * 60 * 60;
                var n = 30 * 24 * 60 * 60;
                var i = 24 * 60 * 60;
                var a = 60 * 60;
                var o = 60;
                var s = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/;
                var u = s.exec(t);
                if (!u) {
                    return 0;
                }
                var f = u.slice(1), c = f[0], l = f[1], h = f[2], p = f[3], v = f[4], d = f[5];
                return (parseFloat(c || 0) * r + parseFloat(l || 0) * n + parseFloat(h || 0) * i + parseFloat(p || 0) * a + parseFloat(v || 0) * o + parseFloat(d || 0));
            };
            var J = function e(t) {
                var r = /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/;
                if (r.test(t)) {
                    t += "Z";
                }
                return Date.parse(t);
            };
            var ee = {
                mediaPresentationDuration: function e(t) {
                    return Q(t);
                },
                availabilityStartTime: function e(t) {
                    return J(t) / 1000;
                },
                minimumUpdatePeriod: function e(t) {
                    return Q(t);
                },
                suggestedPresentationDelay: function e(t) {
                    return Q(t);
                },
                type: function e(t) {
                    return t;
                },
                timeShiftBufferDepth: function e(t) {
                    return Q(t);
                },
                start: function e(t) {
                    return Q(t);
                },
                width: function e(t) {
                    return parseInt(t, 10);
                },
                height: function e(t) {
                    return parseInt(t, 10);
                },
                bandwidth: function e(t) {
                    return parseInt(t, 10);
                },
                startNumber: function e(t) {
                    return parseInt(t, 10);
                },
                timescale: function e(t) {
                    return parseInt(t, 10);
                },
                presentationTimeOffset: function e(t) {
                    return parseInt(t, 10);
                },
                duration: function e(t) {
                    var r = parseInt(t, 10);
                    if (isNaN(r)) {
                        return Q(t);
                    }
                    return r;
                },
                d: function e(t) {
                    return parseInt(t, 10);
                },
                t: function e(t) {
                    return parseInt(t, 10);
                },
                r: function e(t) {
                    return parseInt(t, 10);
                },
                DEFAULT: function e(t) {
                    return t;
                }
            };
            var et = function e(t) {
                if (!(t && t.attributes)) {
                    return {};
                }
                return v(t.attributes).reduce(function(e, t) {
                    var r = ee[t.name] || ee.DEFAULT;
                    e[t.name] = r(t.value);
                    return e;
                }, {});
            };
            var er = {
                "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
                "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
                "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
                "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
            };
            var en = function e(t, r) {
                if (!r.length) {
                    return t;
                }
                return p(t.map(function(e) {
                    return r.map(function(t) {
                        return (0, n.Z)(e, Z(t));
                    });
                }));
            };
            var ei = function e(t) {
                var r = W(t, "SegmentTemplate")[0];
                var n = W(t, "SegmentList")[0];
                var i = n && W(n, "SegmentURL").map(function(e) {
                    return c({
                        tag: "SegmentURL"
                    }, et(e));
                });
                var a = W(t, "SegmentBase")[0];
                var o = n || r;
                var s = o && W(o, "SegmentTimeline")[0];
                var u = n || a || r;
                var f = u && W(u, "Initialization")[0];
                var l = r && et(r);
                if (l && f) {
                    l.initialization = f && et(f);
                } else if (l && l.initialization) {
                    l.initialization = {
                        sourceURL: l.initialization
                    };
                }
                var h = {
                    template: l,
                    segmentTimeline: s && W(s, "S").map(function(e) {
                        return et(e);
                    }),
                    list: n && c(et(n), {
                        segmentUrls: i,
                        initialization: et(f)
                    }),
                    base: a && c(et(a), {
                        initialization: et(f)
                    })
                };
                Object.keys(h).forEach(function(e) {
                    if (!h[e]) {
                        delete h[e];
                    }
                });
                return h;
            };
            var ea = function e(t, r, n) {
                return function(e) {
                    var i = W(e, "BaseURL");
                    var a = en(r, i);
                    var o = c(t, et(e));
                    var s = ei(e);
                    return a.map(function(e) {
                        return {
                            segmentInfo: c(n, s),
                            attributes: c(o, {
                                baseUrl: e
                            })
                        };
                    });
                };
            };
            var eo = function e(t) {
                return t.reduce(function(e, t) {
                    var r = et(t);
                    var n = er[r.schemeIdUri];
                    if (n) {
                        e[n] = {
                            attributes: r
                        };
                        var i = W(t, "cenc:pssh")[0];
                        if (i) {
                            var a = Z(i);
                            var s = a && (0, o.Z)(a);
                            e[n].pssh = s;
                        }
                    }
                    return e;
                }, {});
            };
            var es = function e(t) {
                if (t.schemeIdUri === "urn:scte:dash:cc:cea-608:2015") {
                    var r = typeof t.value !== "string" ? [] : t.value.split(";");
                    return r.map(function(e) {
                        var t;
                        var r;
                        r = e;
                        if (/^CC\d=/.test(e)) {
                            var n = e.split("=");
                            t = n[0];
                            r = n[1];
                        } else if (/^CC\d$/.test(e)) {
                            t = e;
                        }
                        return {
                            channel: t,
                            language: r
                        };
                    });
                } else if (t.schemeIdUri === "urn:scte:dash:cc:cea-708:2015") {
                    var n = typeof t.value !== "string" ? [] : t.value.split(";");
                    return n.map(function(e) {
                        var t = {
                            channel: undefined,
                            language: undefined,
                            aspectRatio: 1,
                            easyReader: 0,
                            "3D": 0
                        };
                        if (/=/.test(e)) {
                            var r = e.split("="), n = r[0], i = r[1], a = i === void 0 ? "" : i;
                            t.channel = n;
                            t.language = e;
                            a.split(",").forEach(function(e) {
                                var r = e.split(":"), n = r[0], i = r[1];
                                if (n === "lang") {
                                    t.language = i;
                                } else if (n === "er") {
                                    t.easyReader = Number(i);
                                } else if (n === "war") {
                                    t.aspectRatio = Number(i);
                                } else if (n === "3D") {
                                    t["3D"] = Number(i);
                                }
                            });
                        } else {
                            t.language = e;
                        }
                        if (t.channel) {
                            t.channel = "SERVICE" + t.channel;
                        }
                        return t;
                    });
                }
            };
            var eu = function e(t, r, n) {
                return function(e) {
                    var i = et(e);
                    var a = en(r, W(e, "BaseURL"));
                    var o = W(e, "Role")[0];
                    var s = {
                        role: et(o)
                    };
                    var u = c(t, i, s);
                    var f = W(e, "Accessibility")[0];
                    var l = es(et(f));
                    if (l) {
                        u = c(u, {
                            captionServices: l
                        });
                    }
                    var h = W(e, "Label")[0];
                    if (h && h.childNodes.length) {
                        var v = h.childNodes[0].nodeValue.trim();
                        u = c(u, {
                            label: v
                        });
                    }
                    var d = eo(W(e, "ContentProtection"));
                    if (Object.keys(d).length) {
                        u = c(u, {
                            contentProtection: d
                        });
                    }
                    var g = ei(e);
                    var m = W(e, "Representation");
                    var b = c(n, g);
                    return p(m.map(ea(u, a, b)));
                };
            };
            var ef = function e(t, r) {
                return function(e, n) {
                    var i = en(r, W(e.node, "BaseURL"));
                    var o = parseInt(e.attributes.id, 10);
                    var s = a().isNaN(o) ? n : o;
                    var u = c(t, {
                        periodIndex: s,
                        periodStart: e.attributes.start
                    });
                    if (typeof e.attributes.duration === "number") {
                        u.periodDuration = e.attributes.duration;
                    }
                    var f = W(e.node, "AdaptationSet");
                    var l = ei(e.node);
                    return p(f.map(eu(u, i, l)));
                };
            };
            var ec = function e(t) {
                var r = t.attributes, n = t.priorPeriodAttributes, i = t.mpdType;
                if (typeof r.start === "number") {
                    return r.start;
                }
                if (n && typeof n.start === "number" && typeof n.duration === "number") {
                    return (n.start + n.duration);
                }
                if (!n && i === "static") {
                    return 0;
                }
                return null;
            };
            var el = function e(t, r) {
                if (r === void 0) {
                    r = {};
                }
                var n = r, i = n.manifestUri, a = i === void 0 ? "" : i, o = n.NOW, s = o === void 0 ? Date.now() : o, u = n.clientOffset, f = u === void 0 ? 0 : u;
                var c = W(t, "Period");
                if (!c.length) {
                    throw new Error(g.INVALID_NUMBER_OF_PERIOD);
                }
                var l = W(t, "Location");
                var h = et(t);
                var v = en([
                    a
                ], W(t, "BaseURL"));
                h.type = h.type || "static";
                h.sourceDuration = h.mediaPresentationDuration || 0;
                h.NOW = s;
                h.clientOffset = f;
                if (l.length) {
                    h.locations = l.map(Z);
                }
                var d = [];
                c.forEach(function(e, t) {
                    var r = et(e);
                    var n = d[t - 1];
                    r.start = ec({
                        attributes: r,
                        priorPeriodAttributes: n ? n.attributes : null,
                        mpdType: h.type
                    });
                    d.push({
                        node: e,
                        attributes: r
                    });
                });
                return {
                    locations: h.locations,
                    representationInfo: p(d.map(ef(h, v)))
                };
            };
            var eh = function e(t) {
                if (t === "") {
                    throw new Error(g.DASH_EMPTY_MANIFEST);
                }
                var r = new s.DOMParser();
                var n;
                var i;
                try {
                    n = r.parseFromString(t, "application/xml");
                    i = n && n.documentElement.tagName === "MPD" ? n.documentElement : null;
                } catch (a) {}
                if (!i || (i && i.getElementsByTagName("parsererror").length > 0)) {
                    throw new Error(g.DASH_INVALID_XML);
                }
                return i;
            };
            var ep = function e(t) {
                var r = W(t, "UTCTiming")[0];
                if (!r) {
                    return null;
                }
                var n = et(r);
                switch(n.schemeIdUri){
                    case "urn:mpeg:dash:utc:http-head:2014":
                    case "urn:mpeg:dash:utc:http-head:2012":
                        n.method = "HEAD";
                        break;
                    case "urn:mpeg:dash:utc:http-xsdate:2014":
                    case "urn:mpeg:dash:utc:http-iso:2014":
                    case "urn:mpeg:dash:utc:http-xsdate:2012":
                    case "urn:mpeg:dash:utc:http-iso:2012":
                        n.method = "GET";
                        break;
                    case "urn:mpeg:dash:utc:direct:2014":
                    case "urn:mpeg:dash:utc:direct:2012":
                        n.method = "DIRECT";
                        n.value = Date.parse(n.value);
                        break;
                    case "urn:mpeg:dash:utc:http-ntp:2014":
                    case "urn:mpeg:dash:utc:ntp:2014":
                    case "urn:mpeg:dash:utc:sntp:2014":
                    default:
                        throw new Error(g.UNSUPPORTED_UTC_TIMING_SCHEME);
                }
                return n;
            };
            var ev = null && u;
            var ed = function e(t, r) {
                if (r === void 0) {
                    r = {};
                }
                var n = el(eh(t), r);
                var i = $(n.representationInfo);
                return B(i, n.locations, r.sidxMapping);
            };
            var eg = function e(t) {
                return ep(eh(t));
            };
        },
        4221: function(e) {
            var t = Math.pow(2, 32);
            var r = function(e) {
                var r = new DataView(e.buffer, e.byteOffset, e.byteLength), n = {
                    version: e[0],
                    flags: new Uint8Array(e.subarray(1, 4)),
                    references: [],
                    referenceId: r.getUint32(4),
                    timescale: r.getUint32(8)
                }, i = 12;
                if (n.version === 0) {
                    n.earliestPresentationTime = r.getUint32(i);
                    n.firstOffset = r.getUint32(i + 4);
                    i += 8;
                } else {
                    n.earliestPresentationTime = r.getUint32(i) * t + r.getUint32(i + 4);
                    n.firstOffset = r.getUint32(i + 8) * t + r.getUint32(i + 12);
                    i += 16;
                }
                i += 2;
                var a = r.getUint16(i);
                i += 2;
                for(; a > 0; i += 12, a--){
                    n.references.push({
                        referenceType: (e[i] & 0x80) >>> 7,
                        referencedSize: r.getUint32(i) & 0x7fffffff,
                        subsegmentDuration: r.getUint32(i + 4),
                        startsWithSap: !!(e[i + 8] & 0x80),
                        sapType: (e[i + 8] & 0x70) >>> 4,
                        sapDeltaTime: r.getUint32(i + 8) & 0x0fffffff
                    });
                }
                return n;
            };
            e.exports = r;
        },
        1489: function(e) {
            var t = 90000, r, n, i, a, o, s, u;
            r = function(e) {
                return e * t;
            };
            n = function(e, t) {
                return e * t;
            };
            i = function(e) {
                return e / t;
            };
            a = function(e, t) {
                return e / t;
            };
            o = function(e, t) {
                return r(a(e, t));
            };
            s = function(e, t) {
                return n(i(e), t);
            };
            u = function(e, t, r) {
                return i(r ? e : e - t);
            };
            e.exports = {
                ONE_SECOND_IN_TS: t,
                secondsToVideoTs: r,
                secondsToAudioTs: n,
                videoTsToSeconds: i,
                audioTsToSeconds: a,
                audioTsToVideoTs: o,
                videoTsToAudioTs: s,
                metadataTsToSeconds: u
            };
        },
        8581: function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return r(4816);
                }, 
            ]);
            if (false) {}
        },
        4816: function(e, t, r) {
            "use strict";
            r.r(t);
            r.d(t, {
                default: function() {
                    return l;
                }
            });
            var n = r(5893);
            var i = r(7294);
            var a = r(214);
            var o = r.n(a);
            var s = r(5215);
            var u = r(3512);
            var f = function(e) {
                var t = i.useRef(null);
                var r = i.useRef(null);
                var a = e.options, o = e.onReady;
                i.useEffect(function() {
                    if (!r.current) {
                        var e = t.current;
                        if (!e) return;
                        var n = (r.current = (0, s.Z)(e, a, function() {
                            console.log("player is ready");
                            o && o(n);
                        }));
                    } else {}
                }, [
                    o,
                    a,
                    t
                ]);
                i.useEffect(function() {
                    return function() {
                        var e = r.current;
                        if (e) {
                            e.dispose();
                            r.current = null;
                        }
                    };
                }, [
                    r
                ]);
                return (0, n.jsx)("div", {
                    "data-vjs-player": true,
                    children: (0, n.jsx)("video", {
                        ref: t,
                        className: "video-js vjs-big-play-centered"
                    })
                });
            };
            var c = f;
            function l() {
                var e = (0, i.useRef)(null);
                var t = {
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [
                        {
                            src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
                            type: "application/x-mpegurl"
                        }, 
                    ]
                };
                var r = function(t) {
                    e.current = t;
                    t.on("waiting", function() {
                        console.log("player is waiting");
                    });
                    t.on("dispose", function() {
                        console.log("player will dispose");
                    });
                };
                return (0, n.jsx)("div", {
                    className: o().container,
                    children: (0, n.jsx)("main", {
                        className: o().main,
                        children: (0, n.jsx)(c, {
                            options: t,
                            onReady: r
                        })
                    })
                });
            }
        },
        214: function(e) {
            e.exports = {
                container: "Home_container__bCOhY",
                main: "Home_main__nLjiQ",
                footer: "Home_footer____T7K",
                title: "Home_title__T09hD",
                description: "Home_description__41Owk",
                code: "Home_code__suPER",
                grid: "Home_grid__GxQ85",
                card: "Home_card___LpL1",
                logo: "Home_logo__27_tb"
            };
        },
        3512: function() {},
        5974: function(e) {
            e.exports = t;
            function t(e, t) {
                var r;
                var n = null;
                try {
                    r = JSON.parse(e, t);
                } catch (i) {
                    n = i;
                }
                return [
                    n,
                    r
                ];
            }
        },
        9945: function(e) {
            (function(t) {
                var r = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#[^]*)?$/;
                var n = /^([^\/?#]*)([^]*)$/;
                var i = /(?:\/|^)\.(?=\/)/g;
                var a = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;
                var o = {
                    buildAbsoluteURL: function(e, t, r) {
                        r = r || {};
                        e = e.trim();
                        t = t.trim();
                        if (!t) {
                            if (!r.alwaysNormalize) {
                                return e;
                            }
                            var i = o.parseURL(e);
                            if (!i) {
                                throw new Error("Error trying to parse base URL.");
                            }
                            i.path = o.normalizePath(i.path);
                            return o.buildURLFromParts(i);
                        }
                        var a = o.parseURL(t);
                        if (!a) {
                            throw new Error("Error trying to parse relative URL.");
                        }
                        if (a.scheme) {
                            if (!r.alwaysNormalize) {
                                return t;
                            }
                            a.path = o.normalizePath(a.path);
                            return o.buildURLFromParts(a);
                        }
                        var s = o.parseURL(e);
                        if (!s) {
                            throw new Error("Error trying to parse base URL.");
                        }
                        if (!s.netLoc && s.path && s.path[0] !== "/") {
                            var u = n.exec(s.path);
                            s.netLoc = u[1];
                            s.path = u[2];
                        }
                        if (s.netLoc && !s.path) {
                            s.path = "/";
                        }
                        var f = {
                            scheme: s.scheme,
                            netLoc: a.netLoc,
                            path: null,
                            params: a.params,
                            query: a.query,
                            fragment: a.fragment
                        };
                        if (!a.netLoc) {
                            f.netLoc = s.netLoc;
                            if (a.path[0] !== "/") {
                                if (!a.path) {
                                    f.path = s.path;
                                    if (!a.params) {
                                        f.params = s.params;
                                        if (!a.query) {
                                            f.query = s.query;
                                        }
                                    }
                                } else {
                                    var c = s.path;
                                    var l = c.substring(0, c.lastIndexOf("/") + 1) + a.path;
                                    f.path = o.normalizePath(l);
                                }
                            }
                        }
                        if (f.path === null) {
                            f.path = r.alwaysNormalize ? o.normalizePath(a.path) : a.path;
                        }
                        return o.buildURLFromParts(f);
                    },
                    parseURL: function(e) {
                        var t = r.exec(e);
                        if (!t) {
                            return null;
                        }
                        return {
                            scheme: t[1] || "",
                            netLoc: t[2] || "",
                            path: t[3] || "",
                            params: t[4] || "",
                            query: t[5] || "",
                            fragment: t[6] || ""
                        };
                    },
                    normalizePath: function(e) {
                        e = e.split("").reverse().join("").replace(i, "");
                        while(e.length !== (e = e.replace(a, "")).length){}
                        return e.split("").reverse().join("");
                    },
                    buildURLFromParts: function(e) {
                        return (e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment);
                    }
                };
                if (true) e.exports = o;
                else {}
            })(this);
        },
        3407: function(e, t, r) {
            var n = r(8908);
            var i = (e.exports = {
                WebVTT: r(3706),
                VTTCue: r(2230),
                VTTRegion: r(3710)
            });
            n.vttjs = i;
            n.WebVTT = i.WebVTT;
            var a = i.VTTCue;
            var o = i.VTTRegion;
            var s = n.VTTCue;
            var u = n.VTTRegion;
            i.shim = function() {
                n.VTTCue = a;
                n.VTTRegion = o;
            };
            i.restore = function() {
                n.VTTCue = s;
                n.VTTRegion = u;
            };
            if (!n.VTTCue) {
                i.shim();
            }
        },
        3706: function(e, t, r) {
            var n = r(9144);
            var i = Object.create || (function() {
                function e() {}
                return function(t) {
                    if (arguments.length !== 1) {
                        throw new Error("Object.create shim only accepts one parameter.");
                    }
                    e.prototype = t;
                    return new e();
                };
            })();
            function a(e, t) {
                this.name = "ParsingError";
                this.code = e.code;
                this.message = t || e.message;
            }
            a.prototype = i(Error.prototype);
            a.prototype.constructor = a;
            a.Errors = {
                BadSignature: {
                    code: 0,
                    message: "Malformed WebVTT signature."
                },
                BadTimeStamp: {
                    code: 1,
                    message: "Malformed time stamp."
                }
            };
            function o(e) {
                function t(e, t, r, n) {
                    return ((e | 0) * 3600 + (t | 0) * 60 + (r | 0) + (n | 0) / 1000);
                }
                var r = e.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
                if (!r) {
                    return null;
                }
                if (r[3]) {
                    return t(r[1], r[2], r[3].replace(":", ""), r[4]);
                } else if (r[1] > 59) {
                    return t(r[1], r[2], 0, r[4]);
                } else {
                    return t(0, r[1], r[2], r[4]);
                }
            }
            function s() {
                this.values = i(null);
            }
            s.prototype = {
                set: function(e, t) {
                    if (!this.get(e) && t !== "") {
                        this.values[e] = t;
                    }
                },
                get: function(e, t, r) {
                    if (r) {
                        return this.has(e) ? this.values[e] : t[r];
                    }
                    return this.has(e) ? this.values[e] : t;
                },
                has: function(e) {
                    return e in this.values;
                },
                alt: function(e, t, r) {
                    for(var n = 0; n < r.length; ++n){
                        if (t === r[n]) {
                            this.set(e, t);
                            break;
                        }
                    }
                },
                integer: function(e, t) {
                    if (/^-?\d+$/.test(t)) {
                        this.set(e, parseInt(t, 10));
                    }
                },
                percent: function(e, t) {
                    var r;
                    if ((r = t.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
                        t = parseFloat(t);
                        if (t >= 0 && t <= 100) {
                            this.set(e, t);
                            return true;
                        }
                    }
                    return false;
                }
            };
            function u(e, t, r, n) {
                var i = n ? e.split(n) : [
                    e
                ];
                for(var a in i){
                    if (typeof i[a] !== "string") {
                        continue;
                    }
                    var o = i[a].split(r);
                    if (o.length !== 2) {
                        continue;
                    }
                    var s = o[0];
                    var u = o[1];
                    t(s, u);
                }
            }
            function f(e, t, r) {
                var n = e;
                function i() {
                    var t = o(e);
                    if (t === null) {
                        throw new a(a.Errors.BadTimeStamp, "Malformed timestamp: " + n);
                    }
                    e = e.replace(/^[^\sa-zA-Z-]+/, "");
                    return t;
                }
                function f(e, t) {
                    var n = new s();
                    u(e, function(e, t) {
                        switch(e){
                            case "region":
                                for(var i = r.length - 1; i >= 0; i--){
                                    if (r[i].id === t) {
                                        n.set(e, r[i].region);
                                        break;
                                    }
                                }
                                break;
                            case "vertical":
                                n.alt(e, t, [
                                    "rl",
                                    "lr"
                                ]);
                                break;
                            case "line":
                                var a = t.split(","), o = a[0];
                                n.integer(e, o);
                                n.percent(e, o) ? n.set("snapToLines", false) : null;
                                n.alt(e, o, [
                                    "auto"
                                ]);
                                if (a.length === 2) {
                                    n.alt("lineAlign", a[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "position":
                                a = t.split(",");
                                n.percent(e, a[0]);
                                if (a.length === 2) {
                                    n.alt("positionAlign", a[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "size":
                                n.percent(e, t);
                                break;
                            case "align":
                                n.alt(e, t, [
                                    "start",
                                    "center",
                                    "end",
                                    "left",
                                    "right", 
                                ]);
                                break;
                        }
                    }, /:/, /\s/);
                    t.region = n.get("region", null);
                    t.vertical = n.get("vertical", "");
                    try {
                        t.line = n.get("line", "auto");
                    } catch (i) {}
                    t.lineAlign = n.get("lineAlign", "start");
                    t.snapToLines = n.get("snapToLines", true);
                    t.size = n.get("size", 100);
                    try {
                        t.align = n.get("align", "center");
                    } catch (a) {
                        t.align = n.get("align", "middle");
                    }
                    try {
                        t.position = n.get("position", "auto");
                    } catch (o) {
                        t.position = n.get("position", {
                            start: 0,
                            left: 0,
                            center: 50,
                            middle: 50,
                            end: 100,
                            right: 100
                        }, t.align);
                    }
                    t.positionAlign = n.get("positionAlign", {
                        start: "start",
                        left: "start",
                        center: "center",
                        middle: "center",
                        end: "end",
                        right: "end"
                    }, t.align);
                }
                function c() {
                    e = e.replace(/^\s+/, "");
                }
                c();
                t.startTime = i();
                c();
                if (e.substr(0, 3) !== "-->") {
                    throw new a(a.Errors.BadTimeStamp, "Malformed time stamp (time stamps must be separated by '-->'): " + n);
                }
                e = e.substr(3);
                c();
                t.endTime = i();
                c();
                f(e, t);
            }
            var c = n.createElement && n.createElement("textarea");
            var l = {
                c: "span",
                i: "i",
                b: "b",
                u: "u",
                ruby: "ruby",
                rt: "rt",
                v: "span",
                lang: "span"
            };
            var h = {
                white: "rgba(255,255,255,1)",
                lime: "rgba(0,255,0,1)",
                cyan: "rgba(0,255,255,1)",
                red: "rgba(255,0,0,1)",
                yellow: "rgba(255,255,0,1)",
                magenta: "rgba(255,0,255,1)",
                blue: "rgba(0,0,255,1)",
                black: "rgba(0,0,0,1)"
            };
            var p = {
                v: "title",
                lang: "lang"
            };
            var v = {
                rt: "ruby"
            };
            function d(e, t) {
                function r() {
                    if (!t) {
                        return null;
                    }
                    function e(e) {
                        t = t.substr(e.length);
                        return e;
                    }
                    var r = t.match(/^([^<]*)(<[^>]*>?)?/);
                    return e(r[1] ? r[1] : r[2]);
                }
                function n(e) {
                    c.innerHTML = e;
                    e = c.textContent;
                    c.textContent = "";
                    return e;
                }
                function i(e, t) {
                    return (!v[t.localName] || v[t.localName] === e.localName);
                }
                function a(t, r) {
                    var n = l[t];
                    if (!n) {
                        return null;
                    }
                    var i = e.document.createElement(n);
                    var a = p[t];
                    if (a && r) {
                        i[a] = r.trim();
                    }
                    return i;
                }
                var s = e.document.createElement("div"), u = s, f, d = [];
                while((f = r()) !== null){
                    if (f[0] === "<") {
                        if (f[1] === "/") {
                            if (d.length && d[d.length - 1] === f.substr(2).replace(">", "")) {
                                d.pop();
                                u = u.parentNode;
                            }
                            continue;
                        }
                        var g = o(f.substr(1, f.length - 2));
                        var m;
                        if (g) {
                            m = e.document.createProcessingInstruction("timestamp", g);
                            u.appendChild(m);
                            continue;
                        }
                        var b = f.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
                        if (!b) {
                            continue;
                        }
                        m = a(b[1], b[3]);
                        if (!m) {
                            continue;
                        }
                        if (!i(u, m)) {
                            continue;
                        }
                        if (b[2]) {
                            var y = b[2].split(".");
                            y.forEach(function(e) {
                                var t = /^bg_/.test(e);
                                var r = t ? e.slice(3) : e;
                                if (h.hasOwnProperty(r)) {
                                    var n = t ? "background-color" : "color";
                                    var i = h[r];
                                    m.style[n] = i;
                                }
                            });
                            m.className = y.join(" ");
                        }
                        d.push(b[1]);
                        u.appendChild(m);
                        u = m;
                        continue;
                    }
                    u.appendChild(e.document.createTextNode(n(f)));
                }
                return s;
            }
            var g = [
                [
                    0x5be,
                    0x5be
                ],
                [
                    0x5c0,
                    0x5c0
                ],
                [
                    0x5c3,
                    0x5c3
                ],
                [
                    0x5c6,
                    0x5c6
                ],
                [
                    0x5d0,
                    0x5ea
                ],
                [
                    0x5f0,
                    0x5f4
                ],
                [
                    0x608,
                    0x608
                ],
                [
                    0x60b,
                    0x60b
                ],
                [
                    0x60d,
                    0x60d
                ],
                [
                    0x61b,
                    0x61b
                ],
                [
                    0x61e,
                    0x64a
                ],
                [
                    0x66d,
                    0x66f
                ],
                [
                    0x671,
                    0x6d5
                ],
                [
                    0x6e5,
                    0x6e6
                ],
                [
                    0x6ee,
                    0x6ef
                ],
                [
                    0x6fa,
                    0x70d
                ],
                [
                    0x70f,
                    0x710
                ],
                [
                    0x712,
                    0x72f
                ],
                [
                    0x74d,
                    0x7a5
                ],
                [
                    0x7b1,
                    0x7b1
                ],
                [
                    0x7c0,
                    0x7ea
                ],
                [
                    0x7f4,
                    0x7f5
                ],
                [
                    0x7fa,
                    0x7fa
                ],
                [
                    0x800,
                    0x815
                ],
                [
                    0x81a,
                    0x81a
                ],
                [
                    0x824,
                    0x824
                ],
                [
                    0x828,
                    0x828
                ],
                [
                    0x830,
                    0x83e
                ],
                [
                    0x840,
                    0x858
                ],
                [
                    0x85e,
                    0x85e
                ],
                [
                    0x8a0,
                    0x8a0
                ],
                [
                    0x8a2,
                    0x8ac
                ],
                [
                    0x200f,
                    0x200f
                ],
                [
                    0xfb1d,
                    0xfb1d
                ],
                [
                    0xfb1f,
                    0xfb28
                ],
                [
                    0xfb2a,
                    0xfb36
                ],
                [
                    0xfb38,
                    0xfb3c
                ],
                [
                    0xfb3e,
                    0xfb3e
                ],
                [
                    0xfb40,
                    0xfb41
                ],
                [
                    0xfb43,
                    0xfb44
                ],
                [
                    0xfb46,
                    0xfbc1
                ],
                [
                    0xfbd3,
                    0xfd3d
                ],
                [
                    0xfd50,
                    0xfd8f
                ],
                [
                    0xfd92,
                    0xfdc7
                ],
                [
                    0xfdf0,
                    0xfdfc
                ],
                [
                    0xfe70,
                    0xfe74
                ],
                [
                    0xfe76,
                    0xfefc
                ],
                [
                    0x10800,
                    0x10805
                ],
                [
                    0x10808,
                    0x10808
                ],
                [
                    0x1080a,
                    0x10835
                ],
                [
                    0x10837,
                    0x10838
                ],
                [
                    0x1083c,
                    0x1083c
                ],
                [
                    0x1083f,
                    0x10855
                ],
                [
                    0x10857,
                    0x1085f
                ],
                [
                    0x10900,
                    0x1091b
                ],
                [
                    0x10920,
                    0x10939
                ],
                [
                    0x1093f,
                    0x1093f
                ],
                [
                    0x10980,
                    0x109b7
                ],
                [
                    0x109be,
                    0x109bf
                ],
                [
                    0x10a00,
                    0x10a00
                ],
                [
                    0x10a10,
                    0x10a13
                ],
                [
                    0x10a15,
                    0x10a17
                ],
                [
                    0x10a19,
                    0x10a33
                ],
                [
                    0x10a40,
                    0x10a47
                ],
                [
                    0x10a50,
                    0x10a58
                ],
                [
                    0x10a60,
                    0x10a7f
                ],
                [
                    0x10b00,
                    0x10b35
                ],
                [
                    0x10b40,
                    0x10b55
                ],
                [
                    0x10b58,
                    0x10b72
                ],
                [
                    0x10b78,
                    0x10b7f
                ],
                [
                    0x10c00,
                    0x10c48
                ],
                [
                    0x1ee00,
                    0x1ee03
                ],
                [
                    0x1ee05,
                    0x1ee1f
                ],
                [
                    0x1ee21,
                    0x1ee22
                ],
                [
                    0x1ee24,
                    0x1ee24
                ],
                [
                    0x1ee27,
                    0x1ee27
                ],
                [
                    0x1ee29,
                    0x1ee32
                ],
                [
                    0x1ee34,
                    0x1ee37
                ],
                [
                    0x1ee39,
                    0x1ee39
                ],
                [
                    0x1ee3b,
                    0x1ee3b
                ],
                [
                    0x1ee42,
                    0x1ee42
                ],
                [
                    0x1ee47,
                    0x1ee47
                ],
                [
                    0x1ee49,
                    0x1ee49
                ],
                [
                    0x1ee4b,
                    0x1ee4b
                ],
                [
                    0x1ee4d,
                    0x1ee4f
                ],
                [
                    0x1ee51,
                    0x1ee52
                ],
                [
                    0x1ee54,
                    0x1ee54
                ],
                [
                    0x1ee57,
                    0x1ee57
                ],
                [
                    0x1ee59,
                    0x1ee59
                ],
                [
                    0x1ee5b,
                    0x1ee5b
                ],
                [
                    0x1ee5d,
                    0x1ee5d
                ],
                [
                    0x1ee5f,
                    0x1ee5f
                ],
                [
                    0x1ee61,
                    0x1ee62
                ],
                [
                    0x1ee64,
                    0x1ee64
                ],
                [
                    0x1ee67,
                    0x1ee6a
                ],
                [
                    0x1ee6c,
                    0x1ee72
                ],
                [
                    0x1ee74,
                    0x1ee77
                ],
                [
                    0x1ee79,
                    0x1ee7c
                ],
                [
                    0x1ee7e,
                    0x1ee7e
                ],
                [
                    0x1ee80,
                    0x1ee89
                ],
                [
                    0x1ee8b,
                    0x1ee9b
                ],
                [
                    0x1eea1,
                    0x1eea3
                ],
                [
                    0x1eea5,
                    0x1eea9
                ],
                [
                    0x1eeab,
                    0x1eebb
                ],
                [
                    0x10fffd,
                    0x10fffd
                ], 
            ];
            function m(e) {
                for(var t = 0; t < g.length; t++){
                    var r = g[t];
                    if (e >= r[0] && e <= r[1]) {
                        return true;
                    }
                }
                return false;
            }
            function b(e) {
                var t = [], r = "", n;
                if (!e || !e.childNodes) {
                    return "ltr";
                }
                function i(e, t) {
                    for(var r = t.childNodes.length - 1; r >= 0; r--){
                        e.push(t.childNodes[r]);
                    }
                }
                function a(e) {
                    if (!e || !e.length) {
                        return null;
                    }
                    var t = e.pop(), r = t.textContent || t.innerText;
                    if (r) {
                        var n = r.match(/^.*(\n|\r)/);
                        if (n) {
                            e.length = 0;
                            return n[0];
                        }
                        return r;
                    }
                    if (t.tagName === "ruby") {
                        return a(e);
                    }
                    if (t.childNodes) {
                        i(e, t);
                        return a(e);
                    }
                }
                i(t, e);
                while((r = a(t))){
                    for(var o = 0; o < r.length; o++){
                        n = r.charCodeAt(o);
                        if (m(n)) {
                            return "rtl";
                        }
                    }
                }
                return "ltr";
            }
            function y(e) {
                if (typeof e.line === "number" && (e.snapToLines || (e.line >= 0 && e.line <= 100))) {
                    return e.line;
                }
                if (!e.track || !e.track.textTrackList || !e.track.textTrackList.mediaElement) {
                    return -1;
                }
                var t = e.track, r = t.textTrackList, n = 0;
                for(var i = 0; i < r.length && r[i] !== t; i++){
                    if (r[i].mode === "showing") {
                        n++;
                    }
                }
                return ++n * -1;
            }
            function w() {}
            w.prototype.applyStyles = function(e, t) {
                t = t || this.div;
                for(var r in e){
                    if (e.hasOwnProperty(r)) {
                        t.style[r] = e[r];
                    }
                }
            };
            w.prototype.formatStyle = function(e, t) {
                return e === 0 ? 0 : e + t;
            };
            function E(e, t, r) {
                w.call(this);
                this.cue = t;
                this.cueDiv = d(e, t.text);
                var n = {
                    color: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    position: "relative",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "inline",
                    writingMode: t.vertical === "" ? "horizontal-tb" : t.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext"
                };
                this.applyStyles(n, this.cueDiv);
                this.div = e.document.createElement("div");
                n = {
                    direction: b(this.cueDiv),
                    writingMode: t.vertical === "" ? "horizontal-tb" : t.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext",
                    textAlign: t.align === "middle" ? "center" : t.align,
                    font: r.font,
                    whiteSpace: "pre-line",
                    position: "absolute"
                };
                this.applyStyles(n);
                this.div.appendChild(this.cueDiv);
                var i = 0;
                switch(t.positionAlign){
                    case "start":
                        i = t.position;
                        break;
                    case "center":
                        i = t.position - t.size / 2;
                        break;
                    case "end":
                        i = t.position - t.size;
                        break;
                }
                if (t.vertical === "") {
                    this.applyStyles({
                        left: this.formatStyle(i, "%"),
                        width: this.formatStyle(t.size, "%")
                    });
                } else {
                    this.applyStyles({
                        top: this.formatStyle(i, "%"),
                        height: this.formatStyle(t.size, "%")
                    });
                }
                this.move = function(e) {
                    this.applyStyles({
                        top: this.formatStyle(e.top, "px"),
                        bottom: this.formatStyle(e.bottom, "px"),
                        left: this.formatStyle(e.left, "px"),
                        right: this.formatStyle(e.right, "px"),
                        height: this.formatStyle(e.height, "px"),
                        width: this.formatStyle(e.width, "px")
                    });
                };
            }
            E.prototype = i(w.prototype);
            E.prototype.constructor = E;
            function T(e) {
                var t, r, n, i;
                if (e.div) {
                    r = e.div.offsetHeight;
                    n = e.div.offsetWidth;
                    i = e.div.offsetTop;
                    var a = (a = e.div.childNodes) && (a = a[0]) && a.getClientRects && a.getClientRects();
                    e = e.div.getBoundingClientRect();
                    t = a ? Math.max((a[0] && a[0].height) || 0, e.height / a.length) : 0;
                }
                this.left = e.left;
                this.right = e.right;
                this.top = e.top || i;
                this.height = e.height || r;
                this.bottom = e.bottom || i + (e.height || r);
                this.width = e.width || n;
                this.lineHeight = t !== undefined ? t : e.lineHeight;
            }
            T.prototype.move = function(e, t) {
                t = t !== undefined ? t : this.lineHeight;
                switch(e){
                    case "+x":
                        this.left += t;
                        this.right += t;
                        break;
                    case "-x":
                        this.left -= t;
                        this.right -= t;
                        break;
                    case "+y":
                        this.top += t;
                        this.bottom += t;
                        break;
                    case "-y":
                        this.top -= t;
                        this.bottom -= t;
                        break;
                }
            };
            T.prototype.overlaps = function(e) {
                return (this.left < e.right && this.right > e.left && this.top < e.bottom && this.bottom > e.top);
            };
            T.prototype.overlapsAny = function(e) {
                for(var t = 0; t < e.length; t++){
                    if (this.overlaps(e[t])) {
                        return true;
                    }
                }
                return false;
            };
            T.prototype.within = function(e) {
                return (this.top >= e.top && this.bottom <= e.bottom && this.left >= e.left && this.right <= e.right);
            };
            T.prototype.overlapsOppositeAxis = function(e, t) {
                switch(t){
                    case "+x":
                        return this.left < e.left;
                    case "-x":
                        return this.right > e.right;
                    case "+y":
                        return this.top < e.top;
                    case "-y":
                        return this.bottom > e.bottom;
                }
            };
            T.prototype.intersectPercentage = function(e) {
                var t = Math.max(0, Math.min(this.right, e.right) - Math.max(this.left, e.left)), r = Math.max(0, Math.min(this.bottom, e.bottom) - Math.max(this.top, e.top)), n = t * r;
                return n / (this.height * this.width);
            };
            T.prototype.toCSSCompatValues = function(e) {
                return {
                    top: this.top - e.top,
                    bottom: e.bottom - this.bottom,
                    left: this.left - e.left,
                    right: e.right - this.right,
                    height: this.height,
                    width: this.width
                };
            };
            T.getSimpleBoxPosition = function(e) {
                var t = e.div ? e.div.offsetHeight : e.tagName ? e.offsetHeight : 0;
                var r = e.div ? e.div.offsetWidth : e.tagName ? e.offsetWidth : 0;
                var n = e.div ? e.div.offsetTop : e.tagName ? e.offsetTop : 0;
                e = e.div ? e.div.getBoundingClientRect() : e.tagName ? e.getBoundingClientRect() : e;
                var i = {
                    left: e.left,
                    right: e.right,
                    top: e.top || n,
                    height: e.height || t,
                    bottom: e.bottom || n + (e.height || t),
                    width: e.width || r
                };
                return i;
            };
            function N(e, t, r, n) {
                function i(e, t) {
                    var i, a = new T(e), o = 1;
                    for(var s = 0; s < t.length; s++){
                        while(e.overlapsOppositeAxis(r, t[s]) || (e.within(r) && e.overlapsAny(n))){
                            e.move(t[s]);
                        }
                        if (e.within(r)) {
                            return e;
                        }
                        var u = e.intersectPercentage(r);
                        if (o > u) {
                            i = new T(e);
                            o = u;
                        }
                        e = new T(a);
                    }
                    return i || a;
                }
                var a = new T(t), o = t.cue, s = y(o), u = [];
                if (o.snapToLines) {
                    var f;
                    switch(o.vertical){
                        case "":
                            u = [
                                "+y",
                                "-y"
                            ];
                            f = "height";
                            break;
                        case "rl":
                            u = [
                                "+x",
                                "-x"
                            ];
                            f = "width";
                            break;
                        case "lr":
                            u = [
                                "-x",
                                "+x"
                            ];
                            f = "width";
                            break;
                    }
                    var c = a.lineHeight, l = c * Math.round(s), h = r[f] + c, p = u[0];
                    if (Math.abs(l) > h) {
                        l = l < 0 ? -1 : 1;
                        l *= Math.ceil(h / c) * c;
                    }
                    if (s < 0) {
                        l += o.vertical === "" ? r.height : r.width;
                        u = u.reverse();
                    }
                    a.move(p, l);
                } else {
                    var v = (a.lineHeight / r.height) * 100;
                    switch(o.lineAlign){
                        case "center":
                            s -= v / 2;
                            break;
                        case "end":
                            s -= v;
                            break;
                    }
                    switch(o.vertical){
                        case "":
                            t.applyStyles({
                                top: t.formatStyle(s, "%")
                            });
                            break;
                        case "rl":
                            t.applyStyles({
                                left: t.formatStyle(s, "%")
                            });
                            break;
                        case "lr":
                            t.applyStyles({
                                right: t.formatStyle(s, "%")
                            });
                            break;
                    }
                    u = [
                        "+y",
                        "-x",
                        "+x",
                        "-y"
                    ];
                    a = new T(t);
                }
                var d = i(a, u);
                t.move(d.toCSSCompatValues(r));
            }
            function A() {}
            A.StringDecoder = function() {
                return {
                    decode: function(e) {
                        if (!e) {
                            return "";
                        }
                        if (typeof e !== "string") {
                            throw new Error("Error - expected string data.");
                        }
                        return decodeURIComponent(encodeURIComponent(e));
                    }
                };
            };
            A.convertCueToDOMTree = function(e, t) {
                if (!e || !t) {
                    return null;
                }
                return d(e, t);
            };
            var S = 0.05;
            var x = "sans-serif";
            var I = "1.5%";
            A.processCues = function(e, t, r) {
                if (!e || !t || !r) {
                    return null;
                }
                while(r.firstChild){
                    r.removeChild(r.firstChild);
                }
                var n = e.document.createElement("div");
                n.style.position = "absolute";
                n.style.left = "0";
                n.style.right = "0";
                n.style.top = "0";
                n.style.bottom = "0";
                n.style.margin = I;
                r.appendChild(n);
                function i(e) {
                    for(var t = 0; t < e.length; t++){
                        if (e[t].hasBeenReset || !e[t].displayState) {
                            return true;
                        }
                    }
                    return false;
                }
                if (!i(t)) {
                    for(var a = 0; a < t.length; a++){
                        n.appendChild(t[a].displayState);
                    }
                    return;
                }
                var o = [], s = T.getSimpleBoxPosition(n), u = Math.round(s.height * S * 100) / 100;
                var f = {
                    font: u + "px " + x
                };
                (function() {
                    var r, i;
                    for(var a = 0; a < t.length; a++){
                        i = t[a];
                        r = new E(e, i, f);
                        n.appendChild(r.div);
                        N(e, r, s, o);
                        i.displayState = r.div;
                        o.push(T.getSimpleBoxPosition(r));
                    }
                })();
            };
            A.Parser = function(e, t, r) {
                if (!r) {
                    r = t;
                    t = {};
                }
                if (!t) {
                    t = {};
                }
                this.window = e;
                this.vttjs = t;
                this.state = "INITIAL";
                this.buffer = "";
                this.decoder = r || new TextDecoder("utf8");
                this.regionList = [];
            };
            A.Parser.prototype = {
                reportOrThrowError: function(e) {
                    if (e instanceof a) {
                        this.onparsingerror && this.onparsingerror(e);
                    } else {
                        throw e;
                    }
                },
                parse: function(e) {
                    var t = this;
                    if (e) {
                        t.buffer += t.decoder.decode(e, {
                            stream: true
                        });
                    }
                    function r() {
                        var e = t.buffer;
                        var r = 0;
                        while(r < e.length && e[r] !== "\r" && e[r] !== "\n"){
                            ++r;
                        }
                        var n = e.substr(0, r);
                        if (e[r] === "\r") {
                            ++r;
                        }
                        if (e[r] === "\n") {
                            ++r;
                        }
                        t.buffer = e.substr(r);
                        return n;
                    }
                    function n(e) {
                        var r = new s();
                        u(e, function(e, t) {
                            switch(e){
                                case "id":
                                    r.set(e, t);
                                    break;
                                case "width":
                                    r.percent(e, t);
                                    break;
                                case "lines":
                                    r.integer(e, t);
                                    break;
                                case "regionanchor":
                                case "viewportanchor":
                                    var n = t.split(",");
                                    if (n.length !== 2) {
                                        break;
                                    }
                                    var i = new s();
                                    i.percent("x", n[0]);
                                    i.percent("y", n[1]);
                                    if (!i.has("x") || !i.has("y")) {
                                        break;
                                    }
                                    r.set(e + "X", i.get("x"));
                                    r.set(e + "Y", i.get("y"));
                                    break;
                                case "scroll":
                                    r.alt(e, t, [
                                        "up"
                                    ]);
                                    break;
                            }
                        }, /=/, /\s/);
                        if (r.has("id")) {
                            var n = new (t.vttjs.VTTRegion || t.window.VTTRegion)();
                            n.width = r.get("width", 100);
                            n.lines = r.get("lines", 3);
                            n.regionAnchorX = r.get("regionanchorX", 0);
                            n.regionAnchorY = r.get("regionanchorY", 100);
                            n.viewportAnchorX = r.get("viewportanchorX", 0);
                            n.viewportAnchorY = r.get("viewportanchorY", 100);
                            n.scroll = r.get("scroll", "");
                            t.onregion && t.onregion(n);
                            t.regionList.push({
                                id: r.get("id"),
                                region: n
                            });
                        }
                    }
                    function i(e) {
                        var r = new s();
                        u(e, function(e, t) {
                            switch(e){
                                case "MPEGT":
                                    r.integer(e + "S", t);
                                    break;
                                case "LOCA":
                                    r.set(e + "L", o(t));
                                    break;
                            }
                        }, /[^\d]:/, /,/);
                        t.ontimestampmap && t.ontimestampmap({
                            MPEGTS: r.get("MPEGTS"),
                            LOCAL: r.get("LOCAL")
                        });
                    }
                    function c(e) {
                        if (e.match(/X-TIMESTAMP-MAP/)) {
                            u(e, function(e, t) {
                                switch(e){
                                    case "X-TIMESTAMP-MAP":
                                        i(t);
                                        break;
                                }
                            }, /=/);
                        } else {
                            u(e, function(e, t) {
                                switch(e){
                                    case "Region":
                                        n(t);
                                        break;
                                }
                            }, /:/);
                        }
                    }
                    try {
                        var l;
                        if (t.state === "INITIAL") {
                            if (!/\r\n|\n/.test(t.buffer)) {
                                return this;
                            }
                            l = r();
                            var h = l.match(/^WEBVTT([ \t].*)?$/);
                            if (!h || !h[0]) {
                                throw new a(a.Errors.BadSignature);
                            }
                            t.state = "HEADER";
                        }
                        var p = false;
                        while(t.buffer){
                            if (!/\r\n|\n/.test(t.buffer)) {
                                return this;
                            }
                            if (!p) {
                                l = r();
                            } else {
                                p = false;
                            }
                            switch(t.state){
                                case "HEADER":
                                    if (/:/.test(l)) {
                                        c(l);
                                    } else if (!l) {
                                        t.state = "ID";
                                    }
                                    continue;
                                case "NOTE":
                                    if (!l) {
                                        t.state = "ID";
                                    }
                                    continue;
                                case "ID":
                                    if (/^NOTE($|[ \t])/.test(l)) {
                                        t.state = "NOTE";
                                        break;
                                    }
                                    if (!l) {
                                        continue;
                                    }
                                    t.cue = new (t.vttjs.VTTCue || t.window.VTTCue)(0, 0, "");
                                    try {
                                        t.cue.align = "center";
                                    } catch (v) {
                                        t.cue.align = "middle";
                                    }
                                    t.state = "CUE";
                                    if (l.indexOf("-->") === -1) {
                                        t.cue.id = l;
                                        continue;
                                    }
                                case "CUE":
                                    try {
                                        f(l, t.cue, t.regionList);
                                    } catch (d) {
                                        t.reportOrThrowError(d);
                                        t.cue = null;
                                        t.state = "BADCUE";
                                        continue;
                                    }
                                    t.state = "CUETEXT";
                                    continue;
                                case "CUETEXT":
                                    var g = l.indexOf("-->") !== -1;
                                    if (!l || (g && (p = true))) {
                                        t.oncue && t.oncue(t.cue);
                                        t.cue = null;
                                        t.state = "ID";
                                        continue;
                                    }
                                    if (t.cue.text) {
                                        t.cue.text += "\n";
                                    }
                                    t.cue.text += l.replace(/\u2028/g, "\n").replace(/u2029/g, "\n");
                                    continue;
                                case "BADCUE":
                                    if (!l) {
                                        t.state = "ID";
                                    }
                                    continue;
                            }
                        }
                    } catch (m) {
                        t.reportOrThrowError(m);
                        if (t.state === "CUETEXT" && t.cue && t.oncue) {
                            t.oncue(t.cue);
                        }
                        t.cue = null;
                        t.state = t.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
                    }
                    return this;
                },
                flush: function() {
                    var e = this;
                    try {
                        e.buffer += e.decoder.decode();
                        if (e.cue || e.state === "HEADER") {
                            e.buffer += "\n\n";
                            e.parse();
                        }
                        if (e.state === "INITIAL") {
                            throw new a(a.Errors.BadSignature);
                        }
                    } catch (t) {
                        e.reportOrThrowError(t);
                    }
                    e.onflush && e.onflush();
                    return this;
                }
            };
            e.exports = A;
        },
        2230: function(e) {
            var t = "auto";
            var r = {
                "": 1,
                lr: 1,
                rl: 1
            };
            var n = {
                start: 1,
                center: 1,
                end: 1,
                left: 1,
                right: 1,
                auto: 1,
                "line-left": 1,
                "line-right": 1
            };
            function i(e) {
                if (typeof e !== "string") {
                    return false;
                }
                var t = r[e.toLowerCase()];
                return t ? e.toLowerCase() : false;
            }
            function a(e) {
                if (typeof e !== "string") {
                    return false;
                }
                var t = n[e.toLowerCase()];
                return t ? e.toLowerCase() : false;
            }
            function o(e, r, n) {
                this.hasBeenReset = false;
                var o = "";
                var s = false;
                var u = e;
                var f = r;
                var c = n;
                var l = null;
                var h = "";
                var p = true;
                var v = "auto";
                var d = "start";
                var g = "auto";
                var m = "auto";
                var b = 100;
                var y = "center";
                Object.defineProperties(this, {
                    id: {
                        enumerable: true,
                        get: function() {
                            return o;
                        },
                        set: function(e) {
                            o = "" + e;
                        }
                    },
                    pauseOnExit: {
                        enumerable: true,
                        get: function() {
                            return s;
                        },
                        set: function(e) {
                            s = !!e;
                        }
                    },
                    startTime: {
                        enumerable: true,
                        get: function() {
                            return u;
                        },
                        set: function(e) {
                            if (typeof e !== "number") {
                                throw new TypeError("Start time must be set to a number.");
                            }
                            u = e;
                            this.hasBeenReset = true;
                        }
                    },
                    endTime: {
                        enumerable: true,
                        get: function() {
                            return f;
                        },
                        set: function(e) {
                            if (typeof e !== "number") {
                                throw new TypeError("End time must be set to a number.");
                            }
                            f = e;
                            this.hasBeenReset = true;
                        }
                    },
                    text: {
                        enumerable: true,
                        get: function() {
                            return c;
                        },
                        set: function(e) {
                            c = "" + e;
                            this.hasBeenReset = true;
                        }
                    },
                    region: {
                        enumerable: true,
                        get: function() {
                            return l;
                        },
                        set: function(e) {
                            l = e;
                            this.hasBeenReset = true;
                        }
                    },
                    vertical: {
                        enumerable: true,
                        get: function() {
                            return h;
                        },
                        set: function(e) {
                            var t = i(e);
                            if (t === false) {
                                throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
                            }
                            h = t;
                            this.hasBeenReset = true;
                        }
                    },
                    snapToLines: {
                        enumerable: true,
                        get: function() {
                            return p;
                        },
                        set: function(e) {
                            p = !!e;
                            this.hasBeenReset = true;
                        }
                    },
                    line: {
                        enumerable: true,
                        get: function() {
                            return v;
                        },
                        set: function(e) {
                            if (typeof e !== "number" && e !== t) {
                                throw new SyntaxError("Line: an invalid number or illegal string was specified.");
                            }
                            v = e;
                            this.hasBeenReset = true;
                        }
                    },
                    lineAlign: {
                        enumerable: true,
                        get: function() {
                            return d;
                        },
                        set: function(e) {
                            var t = a(e);
                            if (!t) {
                                console.warn("lineAlign: an invalid or illegal string was specified.");
                            } else {
                                d = t;
                                this.hasBeenReset = true;
                            }
                        }
                    },
                    position: {
                        enumerable: true,
                        get: function() {
                            return g;
                        },
                        set: function(e) {
                            if (e < 0 || e > 100) {
                                throw new Error("Position must be between 0 and 100.");
                            }
                            g = e;
                            this.hasBeenReset = true;
                        }
                    },
                    positionAlign: {
                        enumerable: true,
                        get: function() {
                            return m;
                        },
                        set: function(e) {
                            var t = a(e);
                            if (!t) {
                                console.warn("positionAlign: an invalid or illegal string was specified.");
                            } else {
                                m = t;
                                this.hasBeenReset = true;
                            }
                        }
                    },
                    size: {
                        enumerable: true,
                        get: function() {
                            return b;
                        },
                        set: function(e) {
                            if (e < 0 || e > 100) {
                                throw new Error("Size must be between 0 and 100.");
                            }
                            b = e;
                            this.hasBeenReset = true;
                        }
                    },
                    align: {
                        enumerable: true,
                        get: function() {
                            return y;
                        },
                        set: function(e) {
                            var t = a(e);
                            if (!t) {
                                throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
                            }
                            y = t;
                            this.hasBeenReset = true;
                        }
                    }
                });
                this.displayState = undefined;
            }
            o.prototype.getCueAsHTML = function() {
                return WebVTT.convertCueToDOMTree(window, this.text);
            };
            e.exports = o;
        },
        3710: function(e) {
            var t = {
                "": true,
                up: true
            };
            function r(e) {
                if (typeof e !== "string") {
                    return false;
                }
                var r = t[e.toLowerCase()];
                return r ? e.toLowerCase() : false;
            }
            function n(e) {
                return typeof e === "number" && e >= 0 && e <= 100;
            }
            function i() {
                var e = 100;
                var t = 3;
                var i = 0;
                var a = 100;
                var o = 0;
                var s = 100;
                var u = "";
                Object.defineProperties(this, {
                    width: {
                        enumerable: true,
                        get: function() {
                            return e;
                        },
                        set: function(t) {
                            if (!n(t)) {
                                throw new Error("Width must be between 0 and 100.");
                            }
                            e = t;
                        }
                    },
                    lines: {
                        enumerable: true,
                        get: function() {
                            return t;
                        },
                        set: function(e) {
                            if (typeof e !== "number") {
                                throw new TypeError("Lines must be set to a number.");
                            }
                            t = e;
                        }
                    },
                    regionAnchorY: {
                        enumerable: true,
                        get: function() {
                            return a;
                        },
                        set: function(e) {
                            if (!n(e)) {
                                throw new Error("RegionAnchorX must be between 0 and 100.");
                            }
                            a = e;
                        }
                    },
                    regionAnchorX: {
                        enumerable: true,
                        get: function() {
                            return i;
                        },
                        set: function(e) {
                            if (!n(e)) {
                                throw new Error("RegionAnchorY must be between 0 and 100.");
                            }
                            i = e;
                        }
                    },
                    viewportAnchorY: {
                        enumerable: true,
                        get: function() {
                            return s;
                        },
                        set: function(e) {
                            if (!n(e)) {
                                throw new Error("ViewportAnchorY must be between 0 and 100.");
                            }
                            s = e;
                        }
                    },
                    viewportAnchorX: {
                        enumerable: true,
                        get: function() {
                            return o;
                        },
                        set: function(e) {
                            if (!n(e)) {
                                throw new Error("ViewportAnchorX must be between 0 and 100.");
                            }
                            o = e;
                        }
                    },
                    scroll: {
                        enumerable: true,
                        get: function() {
                            return u;
                        },
                        set: function(e) {
                            var t = r(e);
                            if (t === false) {
                                console.warn("Scroll: an invalid or illegal string was specified.");
                            } else {
                                u = t;
                            }
                        }
                    }
                });
            }
            e.exports = i;
        },
        4782: function(e, t) {
            "use strict";
            t.byteLength = f;
            t.toByteArray = l;
            t.fromByteArray = v;
            var r = [];
            var n = [];
            var i = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, s = a.length; o < s; ++o){
                r[o] = a[o];
                n[a.charCodeAt(o)] = o;
            }
            n["-".charCodeAt(0)] = 62;
            n["_".charCodeAt(0)] = 63;
            function u(e) {
                var t = e.length;
                if (t % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var r = e.indexOf("=");
                if (r === -1) r = t;
                var n = r === t ? 0 : 4 - (r % 4);
                return [
                    r,
                    n
                ];
            }
            function f(e) {
                var t = u(e);
                var r = t[0];
                var n = t[1];
                return ((r + n) * 3) / 4 - n;
            }
            function c(e, t, r) {
                return ((t + r) * 3) / 4 - r;
            }
            function l(e) {
                var t;
                var r = u(e);
                var a = r[0];
                var o = r[1];
                var s = new i(c(e, a, o));
                var f = 0;
                var l = o > 0 ? a - 4 : a;
                var h;
                for(h = 0; h < l; h += 4){
                    t = (n[e.charCodeAt(h)] << 18) | (n[e.charCodeAt(h + 1)] << 12) | (n[e.charCodeAt(h + 2)] << 6) | n[e.charCodeAt(h + 3)];
                    s[f++] = (t >> 16) & 0xff;
                    s[f++] = (t >> 8) & 0xff;
                    s[f++] = t & 0xff;
                }
                if (o === 2) {
                    t = (n[e.charCodeAt(h)] << 2) | (n[e.charCodeAt(h + 1)] >> 4);
                    s[f++] = t & 0xff;
                }
                if (o === 1) {
                    t = (n[e.charCodeAt(h)] << 10) | (n[e.charCodeAt(h + 1)] << 4) | (n[e.charCodeAt(h + 2)] >> 2);
                    s[f++] = (t >> 8) & 0xff;
                    s[f++] = t & 0xff;
                }
                return s;
            }
            function h(e) {
                return (r[(e >> 18) & 0x3f] + r[(e >> 12) & 0x3f] + r[(e >> 6) & 0x3f] + r[e & 0x3f]);
            }
            function p(e, t, r) {
                var n;
                var i = [];
                for(var a = t; a < r; a += 3){
                    n = ((e[a] << 16) & 0xff0000) + ((e[a + 1] << 8) & 0xff00) + (e[a + 2] & 0xff);
                    i.push(h(n));
                }
                return i.join("");
            }
            function v(e) {
                var t;
                var n = e.length;
                var i = n % 3;
                var a = [];
                var o = 16383;
                for(var s = 0, u = n - i; s < u; s += o){
                    a.push(p(e, s, s + o > u ? u : s + o));
                }
                if (i === 1) {
                    t = e[n - 1];
                    a.push(r[t >> 2] + r[(t << 4) & 0x3f] + "==");
                } else if (i === 2) {
                    t = (e[n - 2] << 8) + e[n - 1];
                    a.push(r[t >> 10] + r[(t >> 4) & 0x3f] + r[(t << 2) & 0x3f] + "=");
                }
                return a.join("");
            }
        },
        816: function(e, t, r) {
            "use strict";
            var n = r(4782);
            var i = r(8898);
            var a = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            t.Buffer = f;
            t.SlowBuffer = y;
            t.INSPECT_MAX_BYTES = 50;
            var o = 0x7fffffff;
            t.kMaxLength = o;
            f.TYPED_ARRAY_SUPPORT = s();
            if (!f.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function s() {
                try {
                    var e = new Uint8Array(1);
                    var t = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(t, Uint8Array.prototype);
                    Object.setPrototypeOf(e, t);
                    return e.foo() === 42;
                } catch (r) {
                    return false;
                }
            }
            Object.defineProperty(f.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!f.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(f.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!f.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function u(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var t = new Uint8Array(e);
                Object.setPrototypeOf(t, f.prototype);
                return t;
            }
            function f(e, t, r) {
                if (typeof e === "number") {
                    if (typeof t === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return p(e);
                }
                return c(e, t, r);
            }
            f.poolSize = 8192;
            function c(e, t, r) {
                if (typeof e === "string") {
                    return v(e, t);
                }
                if (ArrayBuffer.isView(e)) {
                    return d(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (Z(e, ArrayBuffer) || (e && Z(e.buffer, ArrayBuffer))) {
                    return g(e, t, r);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (Z(e, SharedArrayBuffer) || (e && Z(e.buffer, SharedArrayBuffer)))) {
                    return g(e, t, r);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var n = e.valueOf && e.valueOf();
                if (n != null && n !== e) {
                    return f.from(n, t, r);
                }
                var i = m(e);
                if (i) return i;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return f.from(e[Symbol.toPrimitive]("string"), t, r);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            f.from = function(e, t, r) {
                return c(e, t, r);
            };
            Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(f, Uint8Array);
            function l(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function h(e, t, r) {
                l(e);
                if (e <= 0) {
                    return u(e);
                }
                if (t !== undefined) {
                    return typeof r === "string" ? u(e).fill(t, r) : u(e).fill(t);
                }
                return u(e);
            }
            f.alloc = function(e, t, r) {
                return h(e, t, r);
            };
            function p(e) {
                l(e);
                return u(e < 0 ? 0 : b(e) | 0);
            }
            f.allocUnsafe = function(e) {
                return p(e);
            };
            f.allocUnsafeSlow = function(e) {
                return p(e);
            };
            function v(e, t) {
                if (typeof t !== "string" || t === "") {
                    t = "utf8";
                }
                if (!f.isEncoding(t)) {
                    throw new TypeError("Unknown encoding: " + t);
                }
                var r = w(e, t) | 0;
                var n = u(r);
                var i = n.write(e, t);
                if (i !== r) {
                    n = n.slice(0, i);
                }
                return n;
            }
            function d(e) {
                var t = e.length < 0 ? 0 : b(e.length) | 0;
                var r = u(t);
                for(var n = 0; n < t; n += 1){
                    r[n] = e[n] & 255;
                }
                return r;
            }
            function g(e, t, r) {
                if (t < 0 || e.byteLength < t) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < t + (r || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var n;
                if (t === undefined && r === undefined) {
                    n = new Uint8Array(e);
                } else if (r === undefined) {
                    n = new Uint8Array(e, t);
                } else {
                    n = new Uint8Array(e, t, r);
                }
                Object.setPrototypeOf(n, f.prototype);
                return n;
            }
            function m(e) {
                if (f.isBuffer(e)) {
                    var t = b(e.length) | 0;
                    var r = u(t);
                    if (r.length === 0) {
                        return r;
                    }
                    e.copy(r, 0, 0, t);
                    return r;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || Q(e.length)) {
                        return u(0);
                    }
                    return d(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return d(e.data);
                }
            }
            function b(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function y(e) {
                if (+e != e) {
                    e = 0;
                }
                return f.alloc(+e);
            }
            f.isBuffer = function e(t) {
                return (t != null && t._isBuffer === true && t !== f.prototype);
            };
            f.compare = function e(t, r) {
                if (Z(t, Uint8Array)) t = f.from(t, t.offset, t.byteLength);
                if (Z(r, Uint8Array)) r = f.from(r, r.offset, r.byteLength);
                if (!f.isBuffer(t) || !f.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (t === r) return 0;
                var n = t.length;
                var i = r.length;
                for(var a = 0, o = Math.min(n, i); a < o; ++a){
                    if (t[a] !== r[a]) {
                        n = t[a];
                        i = r[a];
                        break;
                    }
                }
                if (n < i) return -1;
                if (i < n) return 1;
                return 0;
            };
            f.isEncoding = function e(t) {
                switch(String(t).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            f.concat = function e(t, r) {
                if (!Array.isArray(t)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (t.length === 0) {
                    return f.alloc(0);
                }
                var n;
                if (r === undefined) {
                    r = 0;
                    for(n = 0; n < t.length; ++n){
                        r += t[n].length;
                    }
                }
                var i = f.allocUnsafe(r);
                var a = 0;
                for(n = 0; n < t.length; ++n){
                    var o = t[n];
                    if (Z(o, Uint8Array)) {
                        o = f.from(o);
                    }
                    if (!f.isBuffer(o)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    o.copy(i, a);
                    a += o.length;
                }
                return i;
            };
            function w(e, t) {
                if (f.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || Z(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var r = e.length;
                var n = arguments.length > 2 && arguments[2] === true;
                if (!n && r === 0) return 0;
                var i = false;
                for(;;){
                    switch(t){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return K(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return r * 2;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return $(e).length;
                        default:
                            if (i) {
                                return n ? -1 : K(e).length;
                            }
                            t = ("" + t).toLowerCase();
                            i = true;
                    }
                }
            }
            f.byteLength = w;
            function E(e, t, r) {
                var n = false;
                if (t === undefined || t < 0) {
                    t = 0;
                }
                if (t > this.length) {
                    return "";
                }
                if (r === undefined || r > this.length) {
                    r = this.length;
                }
                if (r <= 0) {
                    return "";
                }
                r >>>= 0;
                t >>>= 0;
                if (r <= t) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return k(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return L(this, t, r);
                        case "ascii":
                            return P(this, t, r);
                        case "latin1":
                        case "binary":
                            return _(this, t, r);
                        case "base64":
                            return D(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return B(this, t, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            n = true;
                    }
                }
            }
            f.prototype._isBuffer = true;
            function T(e, t, r) {
                var n = e[t];
                e[t] = e[r];
                e[r] = n;
            }
            f.prototype.swap16 = function e() {
                var t = this.length;
                if (t % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < t; r += 2){
                    T(this, r, r + 1);
                }
                return this;
            };
            f.prototype.swap32 = function e() {
                var t = this.length;
                if (t % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < t; r += 4){
                    T(this, r, r + 3);
                    T(this, r + 1, r + 2);
                }
                return this;
            };
            f.prototype.swap64 = function e() {
                var t = this.length;
                if (t % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < t; r += 8){
                    T(this, r, r + 7);
                    T(this, r + 1, r + 6);
                    T(this, r + 2, r + 5);
                    T(this, r + 3, r + 4);
                }
                return this;
            };
            f.prototype.toString = function e() {
                var t = this.length;
                if (t === 0) return "";
                if (arguments.length === 0) return L(this, 0, t);
                return E.apply(this, arguments);
            };
            f.prototype.toLocaleString = f.prototype.toString;
            f.prototype.equals = function e(t) {
                if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
                if (this === t) return true;
                return f.compare(this, t) === 0;
            };
            f.prototype.inspect = function e() {
                var r = "";
                var n = t.INSPECT_MAX_BYTES;
                r = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > n) r += " ... ";
                return "<Buffer " + r + ">";
            };
            if (a) {
                f.prototype[a] = f.prototype.inspect;
            }
            f.prototype.compare = function e(t, r, n, i, a) {
                if (Z(t, Uint8Array)) {
                    t = f.from(t, t.offset, t.byteLength);
                }
                if (!f.isBuffer(t)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof t);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (n === undefined) {
                    n = t ? t.length : 0;
                }
                if (i === undefined) {
                    i = 0;
                }
                if (a === undefined) {
                    a = this.length;
                }
                if (r < 0 || n > t.length || i < 0 || a > this.length) {
                    throw new RangeError("out of range index");
                }
                if (i >= a && r >= n) {
                    return 0;
                }
                if (i >= a) {
                    return -1;
                }
                if (r >= n) {
                    return 1;
                }
                r >>>= 0;
                n >>>= 0;
                i >>>= 0;
                a >>>= 0;
                if (this === t) return 0;
                var o = a - i;
                var s = n - r;
                var u = Math.min(o, s);
                var c = this.slice(i, a);
                var l = t.slice(r, n);
                for(var h = 0; h < u; ++h){
                    if (c[h] !== l[h]) {
                        o = c[h];
                        s = l[h];
                        break;
                    }
                }
                if (o < s) return -1;
                if (s < o) return 1;
                return 0;
            };
            function N(e, t, r, n, i) {
                if (e.length === 0) return -1;
                if (typeof r === "string") {
                    n = r;
                    r = 0;
                } else if (r > 0x7fffffff) {
                    r = 0x7fffffff;
                } else if (r < -0x80000000) {
                    r = -0x80000000;
                }
                r = +r;
                if (Q(r)) {
                    r = i ? 0 : e.length - 1;
                }
                if (r < 0) r = e.length + r;
                if (r >= e.length) {
                    if (i) return -1;
                    else r = e.length - 1;
                } else if (r < 0) {
                    if (i) r = 0;
                    else return -1;
                }
                if (typeof t === "string") {
                    t = f.from(t, n);
                }
                if (f.isBuffer(t)) {
                    if (t.length === 0) {
                        return -1;
                    }
                    return A(e, t, r, n, i);
                } else if (typeof t === "number") {
                    t = t & 0xff;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (i) {
                            return Uint8Array.prototype.indexOf.call(e, t, r);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, t, r);
                        }
                    }
                    return A(e, [
                        t
                    ], r, n, i);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function A(e, t, r, n, i) {
                var a = 1;
                var o = e.length;
                var s = t.length;
                if (n !== undefined) {
                    n = String(n).toLowerCase();
                    if (n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le") {
                        if (e.length < 2 || t.length < 2) {
                            return -1;
                        }
                        a = 2;
                        o /= 2;
                        s /= 2;
                        r /= 2;
                    }
                }
                function u(e, t) {
                    if (a === 1) {
                        return e[t];
                    } else {
                        return e.readUInt16BE(t * a);
                    }
                }
                var f;
                if (i) {
                    var c = -1;
                    for(f = r; f < o; f++){
                        if (u(e, f) === u(t, c === -1 ? 0 : f - c)) {
                            if (c === -1) c = f;
                            if (f - c + 1 === s) return c * a;
                        } else {
                            if (c !== -1) f -= f - c;
                            c = -1;
                        }
                    }
                } else {
                    if (r + s > o) r = o - s;
                    for(f = r; f >= 0; f--){
                        var l = true;
                        for(var h = 0; h < s; h++){
                            if (u(e, f + h) !== u(t, h)) {
                                l = false;
                                break;
                            }
                        }
                        if (l) return f;
                    }
                }
                return -1;
            }
            f.prototype.includes = function e(t, r, n) {
                return this.indexOf(t, r, n) !== -1;
            };
            f.prototype.indexOf = function e(t, r, n) {
                return N(this, t, r, n, true);
            };
            f.prototype.lastIndexOf = function e(t, r, n) {
                return N(this, t, r, n, false);
            };
            function S(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                if (!n) {
                    n = i;
                } else {
                    n = Number(n);
                    if (n > i) {
                        n = i;
                    }
                }
                var a = t.length;
                if (n > a / 2) {
                    n = a / 2;
                }
                for(var o = 0; o < n; ++o){
                    var s = parseInt(t.substr(o * 2, 2), 16);
                    if (Q(s)) return o;
                    e[r + o] = s;
                }
                return o;
            }
            function x(e, t, r, n) {
                return W(K(t, e.length - r), e, r, n);
            }
            function I(e, t, r, n) {
                return W(q(t), e, r, n);
            }
            function C(e, t, r, n) {
                return I(e, t, r, n);
            }
            function R(e, t, r, n) {
                return W($(t), e, r, n);
            }
            function O(e, t, r, n) {
                return W(Y(t, e.length - r), e, r, n);
            }
            f.prototype.write = function e(t, r, n, i) {
                if (r === undefined) {
                    i = "utf8";
                    n = this.length;
                    r = 0;
                } else if (n === undefined && typeof r === "string") {
                    i = r;
                    n = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(n)) {
                        n = n >>> 0;
                        if (i === undefined) i = "utf8";
                    } else {
                        i = n;
                        n = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var a = this.length - r;
                if (n === undefined || n > a) n = a;
                if ((t.length > 0 && (n < 0 || r < 0)) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!i) i = "utf8";
                var o = false;
                for(;;){
                    switch(i){
                        case "hex":
                            return S(this, t, r, n);
                        case "utf8":
                        case "utf-8":
                            return x(this, t, r, n);
                        case "ascii":
                            return I(this, t, r, n);
                        case "latin1":
                        case "binary":
                            return C(this, t, r, n);
                        case "base64":
                            return R(this, t, r, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return O(this, t, r, n);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + i);
                            i = ("" + i).toLowerCase();
                            o = true;
                    }
                }
            };
            f.prototype.toJSON = function e() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function D(e, t, r) {
                if (t === 0 && r === e.length) {
                    return n.fromByteArray(e);
                } else {
                    return n.fromByteArray(e.slice(t, r));
                }
            }
            function L(e, t, r) {
                r = Math.min(e.length, r);
                var n = [];
                var i = t;
                while(i < r){
                    var a = e[i];
                    var o = null;
                    var s = a > 0xef ? 4 : a > 0xdf ? 3 : a > 0xbf ? 2 : 1;
                    if (i + s <= r) {
                        var u, f, c, l;
                        switch(s){
                            case 1:
                                if (a < 0x80) {
                                    o = a;
                                }
                                break;
                            case 2:
                                u = e[i + 1];
                                if ((u & 0xc0) === 0x80) {
                                    l = ((a & 0x1f) << 0x6) | (u & 0x3f);
                                    if (l > 0x7f) {
                                        o = l;
                                    }
                                }
                                break;
                            case 3:
                                u = e[i + 1];
                                f = e[i + 2];
                                if ((u & 0xc0) === 0x80 && (f & 0xc0) === 0x80) {
                                    l = ((a & 0xf) << 0xc) | ((u & 0x3f) << 0x6) | (f & 0x3f);
                                    if (l > 0x7ff && (l < 0xd800 || l > 0xdfff)) {
                                        o = l;
                                    }
                                }
                                break;
                            case 4:
                                u = e[i + 1];
                                f = e[i + 2];
                                c = e[i + 3];
                                if ((u & 0xc0) === 0x80 && (f & 0xc0) === 0x80 && (c & 0xc0) === 0x80) {
                                    l = ((a & 0xf) << 0x12) | ((u & 0x3f) << 0xc) | ((f & 0x3f) << 0x6) | (c & 0x3f);
                                    if (l > 0xffff && l < 0x110000) {
                                        o = l;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 0xfffd;
                        s = 1;
                    } else if (o > 0xffff) {
                        o -= 0x10000;
                        n.push(((o >>> 10) & 0x3ff) | 0xd800);
                        o = 0xdc00 | (o & 0x3ff);
                    }
                    n.push(o);
                    i += s;
                }
                return M(n);
            }
            var U = 0x1000;
            function M(e) {
                var t = e.length;
                if (t <= U) {
                    return String.fromCharCode.apply(String, e);
                }
                var r = "";
                var n = 0;
                while(n < t){
                    r += String.fromCharCode.apply(String, e.slice(n, (n += U)));
                }
                return r;
            }
            function P(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for(var i = t; i < r; ++i){
                    n += String.fromCharCode(e[i] & 0x7f);
                }
                return n;
            }
            function _(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for(var i = t; i < r; ++i){
                    n += String.fromCharCode(e[i]);
                }
                return n;
            }
            function k(e, t, r) {
                var n = e.length;
                if (!t || t < 0) t = 0;
                if (!r || r < 0 || r > n) r = n;
                var i = "";
                for(var a = t; a < r; ++a){
                    i += J[e[a]];
                }
                return i;
            }
            function B(e, t, r) {
                var n = e.slice(t, r);
                var i = "";
                for(var a = 0; a < n.length; a += 2){
                    i += String.fromCharCode(n[a] + n[a + 1] * 256);
                }
                return i;
            }
            f.prototype.slice = function e(t, r) {
                var n = this.length;
                t = ~~t;
                r = r === undefined ? n : ~~r;
                if (t < 0) {
                    t += n;
                    if (t < 0) t = 0;
                } else if (t > n) {
                    t = n;
                }
                if (r < 0) {
                    r += n;
                    if (r < 0) r = 0;
                } else if (r > n) {
                    r = n;
                }
                if (r < t) r = t;
                var i = this.subarray(t, r);
                Object.setPrototypeOf(i, f.prototype);
                return i;
            };
            function X(e, t, r) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
            }
            f.prototype.readUIntLE = function e(t, r, n) {
                t = t >>> 0;
                r = r >>> 0;
                if (!n) X(t, r, this.length);
                var i = this[t];
                var a = 1;
                var o = 0;
                while(++o < r && (a *= 0x100)){
                    i += this[t + o] * a;
                }
                return i;
            };
            f.prototype.readUIntBE = function e(t, r, n) {
                t = t >>> 0;
                r = r >>> 0;
                if (!n) {
                    X(t, r, this.length);
                }
                var i = this[t + --r];
                var a = 1;
                while(r > 0 && (a *= 0x100)){
                    i += this[t + --r] * a;
                }
                return i;
            };
            f.prototype.readUInt8 = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 1, this.length);
                return this[t];
            };
            f.prototype.readUInt16LE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 2, this.length);
                return this[t] | (this[t + 1] << 8);
            };
            f.prototype.readUInt16BE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 2, this.length);
                return (this[t] << 8) | this[t + 1];
            };
            f.prototype.readUInt32LE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return ((this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) + this[t + 3] * 0x1000000);
            };
            f.prototype.readUInt32BE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return (this[t] * 0x1000000 + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]));
            };
            f.prototype.readIntLE = function e(t, r, n) {
                t = t >>> 0;
                r = r >>> 0;
                if (!n) X(t, r, this.length);
                var i = this[t];
                var a = 1;
                var o = 0;
                while(++o < r && (a *= 0x100)){
                    i += this[t + o] * a;
                }
                a *= 0x80;
                if (i >= a) i -= Math.pow(2, 8 * r);
                return i;
            };
            f.prototype.readIntBE = function e(t, r, n) {
                t = t >>> 0;
                r = r >>> 0;
                if (!n) X(t, r, this.length);
                var i = r;
                var a = 1;
                var o = this[t + --i];
                while(i > 0 && (a *= 0x100)){
                    o += this[t + --i] * a;
                }
                a *= 0x80;
                if (o >= a) o -= Math.pow(2, 8 * r);
                return o;
            };
            f.prototype.readInt8 = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 1, this.length);
                if (!(this[t] & 0x80)) return this[t];
                return (0xff - this[t] + 1) * -1;
            };
            f.prototype.readInt16LE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 2, this.length);
                var n = this[t] | (this[t + 1] << 8);
                return n & 0x8000 ? n | 0xffff0000 : n;
            };
            f.prototype.readInt16BE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 2, this.length);
                var n = this[t + 1] | (this[t] << 8);
                return n & 0x8000 ? n | 0xffff0000 : n;
            };
            f.prototype.readInt32LE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24));
            };
            f.prototype.readInt32BE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return ((this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]);
            };
            f.prototype.readFloatLE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return i.read(this, t, true, 23, 4);
            };
            f.prototype.readFloatBE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 4, this.length);
                return i.read(this, t, false, 23, 4);
            };
            f.prototype.readDoubleLE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 8, this.length);
                return i.read(this, t, true, 52, 8);
            };
            f.prototype.readDoubleBE = function e(t, r) {
                t = t >>> 0;
                if (!r) X(t, 8, this.length);
                return i.read(this, t, false, 52, 8);
            };
            function H(e, t, r, n, i, a) {
                if (!f.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > i || t < a) throw new RangeError('"value" argument is out of bounds');
                if (r + n > e.length) throw new RangeError("Index out of range");
            }
            f.prototype.writeUIntLE = function e(t, r, n, i) {
                t = +t;
                r = r >>> 0;
                n = n >>> 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n) - 1;
                    H(this, t, r, n, a, 0);
                }
                var o = 1;
                var s = 0;
                this[r] = t & 0xff;
                while(++s < n && (o *= 0x100)){
                    this[r + s] = (t / o) & 0xff;
                }
                return r + n;
            };
            f.prototype.writeUIntBE = function e(t, r, n, i) {
                t = +t;
                r = r >>> 0;
                n = n >>> 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n) - 1;
                    H(this, t, r, n, a, 0);
                }
                var o = n - 1;
                var s = 1;
                this[r + o] = t & 0xff;
                while(--o >= 0 && (s *= 0x100)){
                    this[r + o] = (t / s) & 0xff;
                }
                return r + n;
            };
            f.prototype.writeUInt8 = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 1, 0xff, 0);
                this[r] = t & 0xff;
                return r + 1;
            };
            f.prototype.writeUInt16LE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 2, 0xffff, 0);
                this[r] = t & 0xff;
                this[r + 1] = t >>> 8;
                return r + 2;
            };
            f.prototype.writeUInt16BE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 2, 0xffff, 0);
                this[r] = t >>> 8;
                this[r + 1] = t & 0xff;
                return r + 2;
            };
            f.prototype.writeUInt32LE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 4, 0xffffffff, 0);
                this[r + 3] = t >>> 24;
                this[r + 2] = t >>> 16;
                this[r + 1] = t >>> 8;
                this[r] = t & 0xff;
                return r + 4;
            };
            f.prototype.writeUInt32BE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 4, 0xffffffff, 0);
                this[r] = t >>> 24;
                this[r + 1] = t >>> 16;
                this[r + 2] = t >>> 8;
                this[r + 3] = t & 0xff;
                return r + 4;
            };
            f.prototype.writeIntLE = function e(t, r, n, i) {
                t = +t;
                r = r >>> 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n - 1);
                    H(this, t, r, n, a - 1, -a);
                }
                var o = 0;
                var s = 1;
                var u = 0;
                this[r] = t & 0xff;
                while(++o < n && (s *= 0x100)){
                    if (t < 0 && u === 0 && this[r + o - 1] !== 0) {
                        u = 1;
                    }
                    this[r + o] = (((t / s) >> 0) - u) & 0xff;
                }
                return r + n;
            };
            f.prototype.writeIntBE = function e(t, r, n, i) {
                t = +t;
                r = r >>> 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n - 1);
                    H(this, t, r, n, a - 1, -a);
                }
                var o = n - 1;
                var s = 1;
                var u = 0;
                this[r + o] = t & 0xff;
                while(--o >= 0 && (s *= 0x100)){
                    if (t < 0 && u === 0 && this[r + o + 1] !== 0) {
                        u = 1;
                    }
                    this[r + o] = (((t / s) >> 0) - u) & 0xff;
                }
                return r + n;
            };
            f.prototype.writeInt8 = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 1, 0x7f, -0x80);
                if (t < 0) t = 0xff + t + 1;
                this[r] = t & 0xff;
                return r + 1;
            };
            f.prototype.writeInt16LE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 2, 0x7fff, -0x8000);
                this[r] = t & 0xff;
                this[r + 1] = t >>> 8;
                return r + 2;
            };
            f.prototype.writeInt16BE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 2, 0x7fff, -0x8000);
                this[r] = t >>> 8;
                this[r + 1] = t & 0xff;
                return r + 2;
            };
            f.prototype.writeInt32LE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 4, 0x7fffffff, -0x80000000);
                this[r] = t & 0xff;
                this[r + 1] = t >>> 8;
                this[r + 2] = t >>> 16;
                this[r + 3] = t >>> 24;
                return r + 4;
            };
            f.prototype.writeInt32BE = function e(t, r, n) {
                t = +t;
                r = r >>> 0;
                if (!n) H(this, t, r, 4, 0x7fffffff, -0x80000000);
                if (t < 0) t = 0xffffffff + t + 1;
                this[r] = t >>> 24;
                this[r + 1] = t >>> 16;
                this[r + 2] = t >>> 8;
                this[r + 3] = t & 0xff;
                return r + 4;
            };
            function V(e, t, r, n, i, a) {
                if (r + n > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range");
            }
            function G(e, t, r, n, a) {
                t = +t;
                r = r >>> 0;
                if (!a) {
                    V(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                }
                i.write(e, t, r, n, 23, 4);
                return r + 4;
            }
            f.prototype.writeFloatLE = function e(t, r, n) {
                return G(this, t, r, true, n);
            };
            f.prototype.writeFloatBE = function e(t, r, n) {
                return G(this, t, r, false, n);
            };
            function F(e, t, r, n, a) {
                t = +t;
                r = r >>> 0;
                if (!a) {
                    V(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                }
                i.write(e, t, r, n, 52, 8);
                return r + 8;
            }
            f.prototype.writeDoubleLE = function e(t, r, n) {
                return F(this, t, r, true, n);
            };
            f.prototype.writeDoubleBE = function e(t, r, n) {
                return F(this, t, r, false, n);
            };
            f.prototype.copy = function e(t, r, n, i) {
                if (!f.isBuffer(t)) throw new TypeError("argument should be a Buffer");
                if (!n) n = 0;
                if (!i && i !== 0) i = this.length;
                if (r >= t.length) r = t.length;
                if (!r) r = 0;
                if (i > 0 && i < n) i = n;
                if (i === n) return 0;
                if (t.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                if (i > this.length) i = this.length;
                if (t.length - r < i - n) {
                    i = t.length - r + n;
                }
                var a = i - n;
                if (this === t && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, n, i);
                } else if (this === t && n < r && r < i) {
                    for(var o = a - 1; o >= 0; --o){
                        t[o + r] = this[o + n];
                    }
                } else {
                    Uint8Array.prototype.set.call(t, this.subarray(n, i), r);
                }
                return a;
            };
            f.prototype.fill = function e(t, r, n, i) {
                if (typeof t === "string") {
                    if (typeof r === "string") {
                        i = r;
                        r = 0;
                        n = this.length;
                    } else if (typeof n === "string") {
                        i = n;
                        n = this.length;
                    }
                    if (i !== undefined && typeof i !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof i === "string" && !f.isEncoding(i)) {
                        throw new TypeError("Unknown encoding: " + i);
                    }
                    if (t.length === 1) {
                        var a = t.charCodeAt(0);
                        if ((i === "utf8" && a < 128) || i === "latin1") {
                            t = a;
                        }
                    }
                } else if (typeof t === "number") {
                    t = t & 255;
                } else if (typeof t === "boolean") {
                    t = Number(t);
                }
                if (r < 0 || this.length < r || this.length < n) {
                    throw new RangeError("Out of range index");
                }
                if (n <= r) {
                    return this;
                }
                r = r >>> 0;
                n = n === undefined ? this.length : n >>> 0;
                if (!t) t = 0;
                var o;
                if (typeof t === "number") {
                    for(o = r; o < n; ++o){
                        this[o] = t;
                    }
                } else {
                    var s = f.isBuffer(t) ? t : f.from(t, i);
                    var u = s.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                    }
                    for(o = 0; o < n - r; ++o){
                        this[o + r] = s[o % u];
                    }
                }
                return this;
            };
            var j = /[^+/0-9A-Za-z-_]/g;
            function z(e) {
                e = e.split("=")[0];
                e = e.trim().replace(j, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function K(e, t) {
                t = t || Infinity;
                var r;
                var n = e.length;
                var i = null;
                var a = [];
                for(var o = 0; o < n; ++o){
                    r = e.charCodeAt(o);
                    if (r > 0xd7ff && r < 0xe000) {
                        if (!i) {
                            if (r > 0xdbff) {
                                if ((t -= 3) > -1) a.push(0xef, 0xbf, 0xbd);
                                continue;
                            } else if (o + 1 === n) {
                                if ((t -= 3) > -1) a.push(0xef, 0xbf, 0xbd);
                                continue;
                            }
                            i = r;
                            continue;
                        }
                        if (r < 0xdc00) {
                            if ((t -= 3) > -1) a.push(0xef, 0xbf, 0xbd);
                            i = r;
                            continue;
                        }
                        r = (((i - 0xd800) << 10) | (r - 0xdc00)) + 0x10000;
                    } else if (i) {
                        if ((t -= 3) > -1) a.push(0xef, 0xbf, 0xbd);
                    }
                    i = null;
                    if (r < 0x80) {
                        if ((t -= 1) < 0) break;
                        a.push(r);
                    } else if (r < 0x800) {
                        if ((t -= 2) < 0) break;
                        a.push((r >> 0x6) | 0xc0, (r & 0x3f) | 0x80);
                    } else if (r < 0x10000) {
                        if ((t -= 3) < 0) break;
                        a.push((r >> 0xc) | 0xe0, ((r >> 0x6) & 0x3f) | 0x80, (r & 0x3f) | 0x80);
                    } else if (r < 0x110000) {
                        if ((t -= 4) < 0) break;
                        a.push((r >> 0x12) | 0xf0, ((r >> 0xc) & 0x3f) | 0x80, ((r >> 0x6) & 0x3f) | 0x80, (r & 0x3f) | 0x80);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return a;
            }
            function q(e) {
                var t = [];
                for(var r = 0; r < e.length; ++r){
                    t.push(e.charCodeAt(r) & 0xff);
                }
                return t;
            }
            function Y(e, t) {
                var r, n, i;
                var a = [];
                for(var o = 0; o < e.length; ++o){
                    if ((t -= 2) < 0) break;
                    r = e.charCodeAt(o);
                    n = r >> 8;
                    i = r % 256;
                    a.push(i);
                    a.push(n);
                }
                return a;
            }
            function $(e) {
                return n.toByteArray(z(e));
            }
            function W(e, t, r, n) {
                for(var i = 0; i < n; ++i){
                    if (i + r >= t.length || i >= e.length) break;
                    t[i + r] = e[i];
                }
                return i;
            }
            function Z(e, t) {
                return (e instanceof t || (e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === t.name));
            }
            function Q(e) {
                return e !== e;
            }
            var J = (function() {
                var e = "0123456789abcdef";
                var t = new Array(256);
                for(var r = 0; r < 16; ++r){
                    var n = r * 16;
                    for(var i = 0; i < 16; ++i){
                        t[n + i] = e[r] + e[i];
                    }
                }
                return t;
            })();
        },
        8898: function(e, t) {
            t.read = function(e, t, r, n, i) {
                var a, o;
                var s = i * 8 - n - 1;
                var u = (1 << s) - 1;
                var f = u >> 1;
                var c = -7;
                var l = r ? i - 1 : 0;
                var h = r ? -1 : 1;
                var p = e[t + l];
                l += h;
                a = p & ((1 << -c) - 1);
                p >>= -c;
                c += s;
                for(; c > 0; a = a * 256 + e[t + l], l += h, c -= 8){}
                o = a & ((1 << -c) - 1);
                a >>= -c;
                c += n;
                for(; c > 0; o = o * 256 + e[t + l], l += h, c -= 8){}
                if (a === 0) {
                    a = 1 - f;
                } else if (a === u) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, n);
                    a = a - f;
                }
                return (p ? -1 : 1) * o * Math.pow(2, a - n);
            };
            t.write = function(e, t, r, n, i, a) {
                var o, s, u;
                var f = a * 8 - i - 1;
                var c = (1 << f) - 1;
                var l = c >> 1;
                var h = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = n ? 0 : a - 1;
                var v = n ? 1 : -1;
                var d = t < 0 || (t === 0 && 1 / t < 0) ? 1 : 0;
                t = Math.abs(t);
                if (isNaN(t) || t === Infinity) {
                    s = isNaN(t) ? 1 : 0;
                    o = c;
                } else {
                    o = Math.floor(Math.log(t) / Math.LN2);
                    if (t * (u = Math.pow(2, -o)) < 1) {
                        o--;
                        u *= 2;
                    }
                    if (o + l >= 1) {
                        t += h / u;
                    } else {
                        t += h * Math.pow(2, 1 - l);
                    }
                    if (t * u >= 2) {
                        o++;
                        u /= 2;
                    }
                    if (o + l >= c) {
                        s = 0;
                        o = c;
                    } else if (o + l >= 1) {
                        s = (t * u - 1) * Math.pow(2, i);
                        o = o + l;
                    } else {
                        s = t * Math.pow(2, l - 1) * Math.pow(2, i);
                        o = 0;
                    }
                }
                for(; i >= 8; e[r + p] = s & 0xff, p += v, s /= 256, i -= 8){}
                o = (o << i) | s;
                f += i;
                for(; f > 0; e[r + p] = o & 0xff, p += v, o /= 256, f -= 8){}
                e[r + p - v] |= d * 128;
            };
        },
        7579: function() {},
        7326: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e) {
                if (e === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return e;
            }
        },
        8852: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return a;
                }
            });
            var n = r(9611);
            function i() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function a(e, t, r) {
                if (i()) {
                    a = Reflect.construct;
                } else {
                    a = function e(t, r, i) {
                        var a = [
                            null
                        ];
                        a.push.apply(a, r);
                        var o = Function.bind.apply(t, a);
                        var s = new o();
                        if (i) (0, n.Z)(s, i.prototype);
                        return s;
                    };
                }
                return a.apply(null, arguments);
            }
        },
        7462: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n() {
                n = Object.assign || function(e) {
                    for(var t = 1; t < arguments.length; t++){
                        var r = arguments[t];
                        for(var n in r){
                            if (Object.prototype.hasOwnProperty.call(r, n)) {
                                e[n] = r[n];
                            }
                        }
                    }
                    return e;
                };
                return n.apply(this, arguments);
            }
        },
        136: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return i;
                }
            });
            var n = r(9611);
            function i(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                Object.defineProperty(e, "prototype", {
                    value: Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: true,
                            configurable: true
                        }
                    }),
                    writable: false
                });
                if (t) (0, n.Z)(e, t);
            }
        },
        4578: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return i;
                }
            });
            var n = r(9611);
            function i(e, t) {
                e.prototype = Object.create(t.prototype);
                e.prototype.constructor = e;
                (0, n.Z)(e, t);
            }
        },
        9611: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return n;
                }
            });
            function n(e, t) {
                n = Object.setPrototypeOf || function e(t, r) {
                    t.__proto__ = r;
                    return t;
                };
                return n(e, t);
            }
        }
    },
    function(e) {
        var t = function(t) {
            return e((e.s = t));
        };
        e.O(0, [
            544,
            774,
            888,
            179
        ], function() {
            return t(8581);
        });
        var r = e.O();
        _N_E = r;
    }, 
]);
