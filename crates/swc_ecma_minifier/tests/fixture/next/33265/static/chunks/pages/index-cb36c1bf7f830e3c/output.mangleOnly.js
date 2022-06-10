(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        7154: function(a) {
            function b() {
                (a.exports = b = Object.assign || function(d) {
                    for(var a = 1; a < arguments.length; a++){
                        var b = arguments[a];
                        for(var c in b){
                            if (Object.prototype.hasOwnProperty.call(b, c)) {
                                d[c] = b[c];
                            }
                        }
                    }
                    return d;
                }), (a.exports.__esModule = true), (a.exports["default"] = a.exports);
                return b.apply(this, arguments);
            }
            (a.exports = b), (a.exports.__esModule = true), (a.exports["default"] = a.exports);
        },
        562: function(g, d, b) {
            "use strict";
            b.d(d, {
                Ki: function() {
                    return m;
                },
                tm: function() {
                    return s;
                },
                hL: function() {
                    return t;
                },
                d3: function() {
                    return u;
                },
                qX: function() {
                    return v;
                },
                lx: function() {
                    return w;
                },
                G3: function() {
                    return x;
                }
            });
            var e = b(8908);
            var f = b.n(e);
            var h = function d(b, c) {
                var a = "";
                while(c--){
                    a += b;
                }
                return a;
            };
            var i = function b(a) {
                return a.toString(2).length;
            };
            var j = function b(a) {
                return Math.ceil(i(a) / 8);
            };
            var k = function d(c, b, a) {
                if (a === void 0) {
                    a = " ";
                }
                return (h(a, b) + c.toString()).slice(-b);
            };
            var l = function b(a) {
                return ArrayBuffer.isView(a);
            };
            var m = function b(a) {
                if (a instanceof Uint8Array) {
                    return a;
                }
                if (!Array.isArray(a) && !l(a) && !(a instanceof ArrayBuffer)) {
                    if (typeof a !== "number" || (typeof a === "number" && a !== a)) {
                        a = 0;
                    } else {
                        a = [
                            a
                        ];
                    }
                }
                return new Uint8Array((a && a.buffer) || a, (a && a.byteOffset) || 0, (a && a.byteLength) || 0);
            };
            var n = function d(a) {
                a = m(a);
                var c = "";
                for(var b = 0; b < a.length; b++){
                    c += k(a[b].toString(16), 2, "0");
                }
                return c;
            };
            var o = function d(a) {
                a = m(a);
                var c = "";
                for(var b = 0; b < a.length; b++){
                    c += k(a[b].toString(2), 8, "0");
                }
                return c;
            };
            var a = f().BigInt || Number;
            var p = [
                a("0x1"),
                a("0x100"),
                a("0x10000"),
                a("0x1000000"),
                a("0x100000000"),
                a("0x10000000000"),
                a("0x1000000000000"),
                a("0x100000000000000"),
                a("0x10000000000000000"), 
            ];
            var c = (function() {
                var a = new Uint16Array([
                    0xffcc
                ]);
                var b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
                if (b[0] === 0xff) {
                    return "big";
                }
                if (b[0] === 0xcc) {
                    return "little";
                }
                return "unknown";
            })();
            var q = c === "big";
            var r = c === "little";
            var s = function n(c, f) {
                var g = f === void 0 ? {} : f, h = g.signed, j = h === void 0 ? false : h, i = g.le, k = i === void 0 ? false : i;
                c = m(c);
                var d = k ? "reduce" : "reduceRight";
                var l = c[d] ? c[d] : Array.prototype[d];
                var b = l.call(c, function(d, e, b) {
                    var f = k ? b : Math.abs(b + 1 - c.length);
                    return d + a(e) * p[f];
                }, a(0));
                if (j) {
                    var e = p[c.length] / a(2) - a(1);
                    b = a(b);
                    if (b > e) {
                        b -= e;
                        b -= e;
                        b -= a(2);
                    }
                }
                return Number(b);
            };
            var t = function l(b, f) {
                var i = f === void 0 ? {} : f, g = i.le, k = g === void 0 ? false : g;
                if ((typeof b !== "bigint" && typeof b !== "number") || (typeof b === "number" && b !== b)) {
                    b = 0;
                }
                b = a(b);
                var h = j(b);
                var c = new Uint8Array(new ArrayBuffer(h));
                for(var d = 0; d < h; d++){
                    var e = k ? d : Math.abs(d + 1 - c.length);
                    c[e] = Number((b / p[d]) & a(0xff));
                    if (b < 0) {
                        c[e] = Math.abs(~c[e]);
                        c[e] -= d === 0 ? 1 : 2;
                    }
                }
                return c;
            };
            var u = function c(a) {
                if (!a) {
                    return "";
                }
                a = Array.prototype.slice.call(a);
                var b = String.fromCharCode.apply(null, m(a));
                try {
                    return decodeURIComponent(escape(b));
                } catch (d) {}
                return b;
            };
            var v = function e(a, d) {
                if (typeof a !== "string" && a && typeof a.toString === "function") {
                    a = a.toString();
                }
                if (typeof a !== "string") {
                    return new Uint8Array();
                }
                if (!d) {
                    a = unescape(encodeURIComponent(a));
                }
                var c = new Uint8Array(a.length);
                for(var b = 0; b < a.length; b++){
                    c[b] = a.charCodeAt(b);
                }
                return c;
            };
            var w = function f() {
                for(var c = arguments.length, a = new Array(c), b = 0; b < c; b++){
                    a[b] = arguments[b];
                }
                a = a.filter(function(a) {
                    return (a && (a.byteLength || a.length) && typeof a !== "string");
                });
                if (a.length <= 1) {
                    return m(a[0]);
                }
                var d = a.reduce(function(b, a, c) {
                    return b + (a.byteLength || a.length);
                }, 0);
                var e = new Uint8Array(d);
                var g = 0;
                a.forEach(function(a) {
                    a = m(a);
                    e.set(a, g);
                    g += a.byteLength;
                });
                return e;
            };
            var x = function i(b, a, c) {
                var d = c === void 0 ? {} : c, e = d.offset, g = e === void 0 ? 0 : e, f = d.mask, j = f === void 0 ? [] : f;
                b = m(b);
                a = m(a);
                var h = a.every ? a.every : Array.prototype.every;
                return (a.length && b.length - g >= a.length && h.call(a, function(c, a) {
                    var d = j[a] ? j[a] & b[g + a] : b[g + a];
                    return c === d;
                }));
            };
            var y = function d(a, b, c) {
                if (Uint8Array.prototype.slice) {
                    return Uint8Array.prototype.slice.call(a, b, c);
                }
                return new Uint8Array(Array.prototype.slice.call(a, b, c));
            };
            var z = function b(a) {
                if (a.reverse) {
                    return a.reverse();
                }
                return Array.prototype.reverse.call(a);
            };
        },
        2260: function(d, b, a) {
            "use strict";
            a.d(b, {
                ws: function() {
                    return i;
                },
                kS: function() {
                    return l;
                },
                Jg: function() {
                    return m;
                },
                KL: function() {
                    return o;
                },
                _5: function() {
                    return q;
                },
                p7: function() {
                    return r;
                },
                Hi: function() {
                    return s;
                },
                lA: function() {
                    return t;
                },
                xz: function() {
                    return u;
                }
            });
            var c = a(8908);
            var e = a.n(c);
            var f = {
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
            var g = [
                "video",
                "audio",
                "text"
            ];
            var h = [
                "Video",
                "Audio",
                "Text"
            ];
            var i = function b(a) {
                if (!a) {
                    return a;
                }
                return a.replace(/avc1\.(\d+)\.(\d+)/i, function(e, a, b) {
                    var c = ("00" + Number(a).toString(16)).slice(-2);
                    var d = ("00" + Number(b).toString(16)).slice(-2);
                    return "avc1." + c + "00" + d;
                });
            };
            var j = function b(a) {
                return a.map(i);
            };
            var k = function b(a) {
                return a.replace(/avc1\.(\d+)\.(\d+)/i, function(a) {
                    return j([
                        a
                    ])[0];
                });
            };
            var l = function d(a) {
                if (a === void 0) {
                    a = "";
                }
                var b = a.split(",");
                var c = [];
                b.forEach(function(a) {
                    a = a.trim();
                    var b;
                    g.forEach(function(d) {
                        var e = f[d].exec(a.toLowerCase());
                        if (!e || e.length <= 1) {
                            return;
                        }
                        b = d;
                        var g = a.substring(0, e[1].length);
                        var h = a.replace(g, "");
                        c.push({
                            type: g,
                            details: h,
                            mediaType: d
                        });
                    });
                    if (!b) {
                        c.push({
                            type: a,
                            details: "",
                            mediaType: "unknown"
                        });
                    }
                });
                return c;
            };
            var m = function f(c, d) {
                if (!c.mediaGroups.AUDIO || !d) {
                    return null;
                }
                var a = c.mediaGroups.AUDIO[d];
                if (!a) {
                    return null;
                }
                for(var e in a){
                    var b = a[e];
                    if (b.default && b.playlists) {
                        return l(b.playlists[0].attributes.CODECS);
                    }
                }
                return null;
            };
            var n = function b(a) {
                if (a === void 0) {
                    a = "";
                }
                return f.video.test(a.trim().toLowerCase());
            };
            var o = function b(a) {
                if (a === void 0) {
                    a = "";
                }
                return f.audio.test(a.trim().toLowerCase());
            };
            var p = function b(a) {
                if (a === void 0) {
                    a = "";
                }
                return f.text.test(a.trim().toLowerCase());
            };
            var q = function e(b) {
                if (!b || typeof b !== "string") {
                    return;
                }
                var a = b.toLowerCase().split(",").map(function(a) {
                    return i(a.trim());
                });
                var d = "video";
                if (a.length === 1 && o(a[0])) {
                    d = "audio";
                } else if (a.length === 1 && p(a[0])) {
                    d = "application";
                }
                var c = "mp4";
                if (a.every(function(a) {
                    return f.mp4.test(a);
                })) {
                    c = "mp4";
                } else if (a.every(function(a) {
                    return f.webm.test(a);
                })) {
                    c = "webm";
                } else if (a.every(function(a) {
                    return f.ogg.test(a);
                })) {
                    c = "ogg";
                }
                return d + "/" + c + ';codecs="' + b + '"';
            };
            var r = function b(a) {
                if (a === void 0) {
                    a = "";
                }
                return ((e().MediaSource && e().MediaSource.isTypeSupported && e().MediaSource.isTypeSupported(q(a))) || false);
            };
            var s = function b(a) {
                if (a === void 0) {
                    a = "";
                }
                return a.toLowerCase().split(",").every(function(a) {
                    a = a.trim();
                    for(var b = 0; b < h.length; b++){
                        var c = h[b];
                        if (f["muxer" + c].test(a)) {
                            return true;
                        }
                    }
                    return false;
                });
            };
            var t = "mp4a.40.2";
            var u = "avc1.4d400d";
        },
        6185: function(g, d, b) {
            "use strict";
            b.d(d, {
                Xm: function() {
                    return T;
                },
                cz: function() {
                    return U;
                }
            });
            var a = b(562);
            var h = function m(a) {
                var b = "";
                var d = a[1] >>> 3;
                var g = a[1] & 0x1f;
                var e = a[2] >>> 7;
                var f = (a[2] & 0x40) >> 6;
                var h = (a[2] & 0x20) >> 5;
                var i = (a[2] & 0x10) >> 4;
                var j = (a[2] & 0x08) >> 3;
                var k = (a[2] & 0x04) >> 2;
                var l = a[2] & 0x03;
                b += d + "." + padStart(g, 2, "0");
                if (e === 0) {
                    b += "M";
                } else if (e === 1) {
                    b += "H";
                }
                var c;
                if (d === 2 && f) {
                    c = h ? 12 : 10;
                } else {
                    c = f ? 10 : 8;
                }
                b += "." + padStart(c, 2, "0");
                b += "." + i;
                b += "." + j + k + l;
                return b;
            };
            var i = function e(a) {
                var b = toHexString(a[1]);
                var c = toHexString(a[2] & 0xfc);
                var d = toHexString(a[3]);
                return "" + b + c + d;
            };
            var j = function m(b) {
                var a = "";
                var d = b[1] >> 6;
                var j = b[1] & 0x1f;
                var k = (b[1] & 0x20) >> 5;
                var g = b.subarray(2, 6);
                var h = b.subarray(6, 12);
                var l = b[12];
                if (d === 1) {
                    a += "A";
                } else if (d === 2) {
                    a += "B";
                } else if (d === 3) {
                    a += "C";
                }
                a += j + ".";
                var e = parseInt(toBinaryString(g).split("").reverse().join(""), 2);
                if (e > 255) {
                    e = parseInt(toBinaryString(g), 2);
                }
                a += e.toString(16) + ".";
                if (k === 0) {
                    a += "L";
                } else {
                    a += "H";
                }
                a += l;
                var c = "";
                for(var f = 0; f < h.length; f++){
                    var i = h[f];
                    if (i) {
                        if (c) {
                            c += ".";
                        }
                        c += i.toString(16);
                    }
                }
                if (c) {
                    a += "." + c;
                }
                return a;
            };
            var k = new Uint8Array([
                0x4f,
                0x70,
                0x75,
                0x73,
                0x48,
                0x65,
                0x61,
                0x64, 
            ]);
            var l = function g(c) {
                var a = new DataView(c.buffer, c.byteOffset, c.byteLength);
                var f = a.getUint8(0);
                var d = f !== 0;
                var b = {
                    version: f,
                    channels: a.getUint8(1),
                    preSkip: a.getUint16(2, d),
                    sampleRate: a.getUint32(4, d),
                    outputGain: a.getUint16(8, d),
                    channelMappingFamily: a.getUint8(10)
                };
                if (b.channelMappingFamily > 0 && c.length > 10) {
                    b.streamCount = a.getUint8(11);
                    b.twoChannelStreamCount = a.getUint8(12);
                    b.channelMapping = [];
                    for(var e = 0; e < b.channels; e++){
                        b.channelMapping.push(a.getUint8(13 + e));
                    }
                }
                return b;
            };
            var m = function e(a) {
                var d = a.channelMappingFamily <= 0 ? 11 : 12 + a.channels;
                var b = new DataView(new ArrayBuffer(d));
                var c = a.version !== 0;
                b.setUint8(0, a.version);
                b.setUint8(1, a.channels);
                b.setUint16(2, a.preSkip, c);
                b.setUint32(4, a.sampleRate, c);
                b.setUint16(8, a.outputGain, c);
                b.setUint8(10, a.channelMappingFamily);
                if (a.channelMappingFamily > 0) {
                    b.setUint8(11, a.streamCount);
                    a.channelMapping.foreach(function(a, c) {
                        b.setUint8(12 + c, a);
                    });
                }
                return new Uint8Array(b.buffer);
            };
            var n = function c(b) {
                if (typeof b === "string") {
                    return (0, a.qX)(b);
                }
                if (typeof b === "number") {
                    return b;
                }
                return b;
            };
            var o = function b(a) {
                if (!Array.isArray(a)) {
                    return [
                        n(a)
                    ];
                }
                return a.map(function(a) {
                    return n(a);
                });
            };
            var e;
            var p = function n(c) {
                c = (0, a.Ki)(c);
                var i = [];
                var g = 0;
                while(c.length > g){
                    var k = c[g];
                    var d = 0;
                    var b = 0;
                    b++;
                    var f = c[b];
                    b++;
                    while(f & 0x80){
                        d = (f & 0x7f) << 7;
                        f = c[b];
                        b++;
                    }
                    d += f & 0x7f;
                    for(var h = 0; h < e.length; h++){
                        var j = e[h], l = j.id, m = j.parser;
                        if (k === l) {
                            i.push(m(c.subarray(b, b + d)));
                            break;
                        }
                    }
                    g += d + b;
                }
                return i;
            };
            e = [
                {
                    id: 0x03,
                    parser: function e(c) {
                        var b = {
                            tag: 0x03,
                            id: (c[0] << 8) | c[1],
                            flags: c[2],
                            size: 3,
                            dependsOnEsId: 0,
                            ocrEsId: 0,
                            descriptors: [],
                            url: ""
                        };
                        if (b.flags & 0x80) {
                            b.dependsOnEsId = (c[b.size] << 8) | c[b.size + 1];
                            b.size += 2;
                        }
                        if (b.flags & 0x40) {
                            var d = c[b.size];
                            b.url = (0, a.d3)(c.subarray(b.size + 1, b.size + 1 + d));
                            b.size += d;
                        }
                        if (b.flags & 0x20) {
                            b.ocrEsId = (c[b.size] << 8) | c[b.size + 1];
                            b.size += 2;
                        }
                        b.descriptors = p(c.subarray(b.size)) || [];
                        return b;
                    }
                },
                {
                    id: 0x04,
                    parser: function c(a) {
                        var b = {
                            tag: 0x04,
                            oti: a[0],
                            streamType: a[1],
                            bufferSize: (a[2] << 16) | (a[3] << 8) | a[4],
                            maxBitrate: (a[5] << 24) | (a[6] << 16) | (a[7] << 8) | a[8],
                            avgBitrate: (a[9] << 24) | (a[10] << 16) | (a[11] << 8) | a[12],
                            descriptors: p(a.subarray(13))
                        };
                        return b;
                    }
                },
                {
                    id: 0x05,
                    parser: function b(a) {
                        return {
                            tag: 0x05,
                            bytes: a
                        };
                    }
                },
                {
                    id: 0x06,
                    parser: function b(a) {
                        return {
                            tag: 0x06,
                            bytes: a
                        };
                    }
                }, 
            ];
            var q = function j(b, d, f) {
                if (f === void 0) {
                    f = false;
                }
                d = o(d);
                b = (0, a.Ki)(b);
                var e = [];
                if (!d.length) {
                    return e;
                }
                var c = 0;
                while(c < b.length){
                    var h = ((b[c] << 24) | (b[c + 1] << 16) | (b[c + 2] << 8) | b[c + 3]) >>> 0;
                    var k = b.subarray(c + 4, c + 8);
                    if (h === 0) {
                        break;
                    }
                    var g = c + h;
                    if (g > b.length) {
                        if (f) {
                            break;
                        }
                        g = b.length;
                    }
                    var i = b.subarray(c + 8, g);
                    if ((0, a.G3)(k, d[0])) {
                        if (d.length === 1) {
                            e.push(i);
                        } else {
                            e.push.apply(e, j(i, d.slice(1), f));
                        }
                    }
                    c = g;
                }
                return e;
            };
            var r = function f(a, c) {
                c = n(c);
                if (!c.length) {
                    return a.subarray(a.length);
                }
                var b = 0;
                while(b < a.length){
                    if (bytesMatch(a.subarray(b, b + c.length), c)) {
                        var d = ((a[b - 4] << 24) | (a[b - 3] << 16) | (a[b - 2] << 8) | a[b - 1]) >>> 0;
                        var e = d > 1 ? b + d : a.byteLength;
                        return a.subarray(b + 4, e);
                    }
                    b++;
                }
                return a.subarray(a.length);
            };
            var s = function g(a, b, c) {
                if (b === void 0) {
                    b = 4;
                }
                if (c === void 0) {
                    c = function b(a) {
                        return bytesToNumber(a);
                    };
                }
                var d = [];
                if (!a || !a.length) {
                    return d;
                }
                var f = bytesToNumber(a.subarray(4, 8));
                for(var e = 8; f; e += b, f--){
                    d.push(c(a.subarray(e, e + b)));
                }
                return d;
            };
            var t = function A(b, v) {
                var f = s(q(b, [
                    "stss"
                ])[0]);
                var k = s(q(b, [
                    "stco"
                ])[0]);
                var l = s(q(b, [
                    "stts"
                ])[0], 8, function(a) {
                    return {
                        sampleCount: bytesToNumber(a.subarray(0, 4)),
                        sampleDelta: bytesToNumber(a.subarray(4, 8))
                    };
                });
                var e = s(q(b, [
                    "stsc"
                ])[0], 12, function(a) {
                    return {
                        firstChunk: bytesToNumber(a.subarray(0, 4)),
                        samplesPerChunk: bytesToNumber(a.subarray(4, 8)),
                        sampleDescriptionIndex: bytesToNumber(a.subarray(8, 12))
                    };
                });
                var g = q(b, [
                    "stsz"
                ])[0];
                var w = s((g && g.length && g.subarray(4)) || null);
                var a = [];
                for(var c = 0; c < k.length; c++){
                    var m = void 0;
                    for(var d = 0; d < e.length; d++){
                        var n = e[d];
                        var x = c + 1 >= n.firstChunk && (d + 1 >= e.length || c + 1 < e[d + 1].firstChunk);
                        if (x) {
                            m = n.samplesPerChunk;
                            break;
                        }
                    }
                    var h = k[c];
                    for(var o = 0; o < m; o++){
                        var p = w[a.length];
                        var r = !f.length;
                        if (f.length && f.indexOf(a.length + 1) !== -1) {
                            r = true;
                        }
                        var i = {
                            keyframe: r,
                            start: h,
                            end: h + p
                        };
                        for(var j = 0; j < l.length; j++){
                            var t = l[j], y = t.sampleCount, u = t.sampleDelta;
                            if (a.length <= y) {
                                var z = a.length ? a[a.length - 1].timestamp : 0;
                                i.timestamp = z + (u / v) * 1000;
                                i.duration = u;
                                break;
                            }
                        }
                        a.push(i);
                        h += p;
                    }
                }
                return a;
            };
            var u = function t(c, b) {
                var a = bytesToString(b.subarray(0, 4));
                if (c.type === "video") {
                    c.info = c.info || {};
                    c.info.width = (b[28] << 8) | b[29];
                    c.info.height = (b[30] << 8) | b[31];
                } else if (c.type === "audio") {
                    c.info = c.info || {};
                    c.info.channels = (b[20] << 8) | b[21];
                    c.info.bitDepth = (b[22] << 8) | b[23];
                    c.info.sampleRate = (b[28] << 8) | b[29];
                }
                if (a === "avc1") {
                    var f = r(b, "avcC");
                    a += "." + getAvcCodec(f);
                    c.info.avcC = f;
                } else if (a === "hvc1" || a === "hev1") {
                    a += "." + getHvcCodec(r(b, "hvcC"));
                } else if (a === "mp4a" || a === "mp4v") {
                    var h = r(b, "esds");
                    var g = p(h.subarray(4))[0];
                    var e = g && g.descriptors.filter(function(a) {
                        var b = a.tag;
                        return b === 0x04;
                    })[0];
                    if (e) {
                        a += "." + toHexString(e.oti);
                        if (e.oti === 0x40) {
                            a += "." + (e.descriptors[0].bytes[0] >> 3).toString();
                        } else if (e.oti === 0x20) {
                            a += "." + e.descriptors[0].bytes[4].toString();
                        } else if (e.oti === 0xdd) {
                            a = "vorbis";
                        }
                    } else if (c.type === "audio") {
                        a += ".40.2";
                    } else {
                        a += ".20.9";
                    }
                } else if (a === "av01") {
                    a += "." + getAv1Codec(r(b, "av1C"));
                } else if (a === "vp09") {
                    var d = r(b, "vpcC");
                    var i = d[0];
                    var j = d[1];
                    var k = d[2] >> 4;
                    var l = (d[2] & 0x0f) >> 1;
                    var m = (d[2] & 0x0f) >> 3;
                    var n = d[3];
                    var o = d[4];
                    var q = d[5];
                    a += "." + padStart(i, 2, "0");
                    a += "." + padStart(j, 2, "0");
                    a += "." + padStart(k, 2, "0");
                    a += "." + padStart(l, 2, "0");
                    a += "." + padStart(n, 2, "0");
                    a += "." + padStart(o, 2, "0");
                    a += "." + padStart(q, 2, "0");
                    a += "." + padStart(m, 2, "0");
                } else if (a === "theo") {
                    a = "theora";
                } else if (a === "spex") {
                    a = "speex";
                } else if (a === ".mp3") {
                    a = "mp4a.40.34";
                } else if (a === "msVo") {
                    a = "vorbis";
                } else if (a === "Opus") {
                    a = "opus";
                    var s = r(b, "dOps");
                    c.info.opus = parseOpusHead(s);
                    c.info.codecDelay = 6500000;
                } else {
                    a = a.toLowerCase();
                }
                c.codec = a;
            };
            var v = function e(a, b) {
                if (b === void 0) {
                    b = true;
                }
                a = toUint8(a);
                var c = q(a, [
                    "moov",
                    "trak"
                ], true);
                var d = [];
                c.forEach(function(h) {
                    var a = {
                        bytes: h
                    };
                    var i = q(h, [
                        "mdia"
                    ])[0];
                    var o = q(i, [
                        "hdlr"
                    ])[0];
                    var j = bytesToString(o.subarray(8, 12));
                    if (j === "soun") {
                        a.type = "audio";
                    } else if (j === "vide") {
                        a.type = "video";
                    } else {
                        a.type = j;
                    }
                    var f = q(h, [
                        "tkhd"
                    ])[0];
                    if (f) {
                        var k = new DataView(f.buffer, f.byteOffset, f.byteLength);
                        var p = k.getUint8(0);
                        a.number = p === 0 ? k.getUint32(12) : k.getUint32(20);
                    }
                    var c = q(i, [
                        "mdhd"
                    ])[0];
                    if (c) {
                        var r = c[0];
                        var g = r === 0 ? 12 : 20;
                        a.timescale = ((c[g] << 24) | (c[g + 1] << 16) | (c[g + 2] << 8) | c[g + 3]) >>> 0;
                    }
                    var m = q(i, [
                        "minf",
                        "stbl"
                    ])[0];
                    var l = q(m, [
                        "stsd"
                    ])[0];
                    var s = bytesToNumber(l.subarray(4, 8));
                    var e = 8;
                    while(s--){
                        var n = bytesToNumber(l.subarray(e, e + 4));
                        var v = l.subarray(e + 4, e + 4 + n);
                        u(a, v);
                        e += 4 + n;
                    }
                    if (b) {
                        a.frameTable = t(m, a.timescale);
                    }
                    d.push(a);
                });
                return d;
            };
            var w = function d(c) {
                var a = q(c, [
                    "moov",
                    "mvhd"
                ], true)[0];
                if (!a || !a.length) {
                    return;
                }
                var b = {};
                if (a[0] === 1) {
                    b.timestampScale = bytesToNumber(a.subarray(20, 24));
                    b.duration = bytesToNumber(a.subarray(24, 32));
                } else {
                    b.timestampScale = bytesToNumber(a.subarray(12, 16));
                    b.duration = bytesToNumber(a.subarray(16, 20));
                }
                b.bytes = a;
                return b;
            };
            var x = {
                EBML: (0, a.Ki)([
                    0x1a,
                    0x45,
                    0xdf,
                    0xa3, 
                ]),
                DocType: (0, a.Ki)([
                    0x42,
                    0x82
                ]),
                Segment: (0, a.Ki)([
                    0x18,
                    0x53,
                    0x80,
                    0x67, 
                ]),
                SegmentInfo: (0, a.Ki)([
                    0x15,
                    0x49,
                    0xa9,
                    0x66, 
                ]),
                Tracks: (0, a.Ki)([
                    0x16,
                    0x54,
                    0xae,
                    0x6b, 
                ]),
                Track: (0, a.Ki)([
                    0xae
                ]),
                TrackNumber: (0, a.Ki)([
                    0xd7
                ]),
                DefaultDuration: (0, a.Ki)([
                    0x23,
                    0xe3,
                    0x83, 
                ]),
                TrackEntry: (0, a.Ki)([
                    0xae
                ]),
                TrackType: (0, a.Ki)([
                    0x83
                ]),
                FlagDefault: (0, a.Ki)([
                    0x88
                ]),
                CodecID: (0, a.Ki)([
                    0x86
                ]),
                CodecPrivate: (0, a.Ki)([
                    0x63,
                    0xa2
                ]),
                VideoTrack: (0, a.Ki)([
                    0xe0
                ]),
                AudioTrack: (0, a.Ki)([
                    0xe1
                ]),
                Cluster: (0, a.Ki)([
                    0x1f,
                    0x43,
                    0xb6,
                    0x75, 
                ]),
                Timestamp: (0, a.Ki)([
                    0xe7
                ]),
                TimestampScale: (0, a.Ki)([
                    0x2a,
                    0xd7,
                    0xb1, 
                ]),
                BlockGroup: (0, a.Ki)([
                    0xa0
                ]),
                BlockDuration: (0, a.Ki)([
                    0x9b
                ]),
                Block: (0, a.Ki)([
                    0xa1
                ]),
                SimpleBlock: (0, a.Ki)([
                    0xa3
                ])
            };
            var y = [
                128,
                64,
                32,
                16,
                8,
                4,
                2,
                1
            ];
            var z = function d(c) {
                var b = 1;
                for(var a = 0; a < y.length; a++){
                    if (c & y[a]) {
                        break;
                    }
                    b++;
                }
                return b;
            };
            var A = function h(e, b, f, g) {
                if (f === void 0) {
                    f = true;
                }
                if (g === void 0) {
                    g = false;
                }
                var c = z(e[b]);
                var d = e.subarray(b, b + c);
                if (f) {
                    d = Array.prototype.slice.call(e, b, b + c);
                    d[0] ^= y[c - 1];
                }
                return {
                    length: c,
                    value: (0, a.tm)(d, {
                        signed: g
                    }),
                    bytes: d
                };
            };
            var B = function c(b) {
                if (typeof b === "string") {
                    return b.match(/.{1,2}/g).map(function(a) {
                        return c(a);
                    });
                }
                if (typeof b === "number") {
                    return (0, a.hL)(b);
                }
                return b;
            };
            var C = function b(a) {
                if (!Array.isArray(a)) {
                    return [
                        B(a)
                    ];
                }
                return a.map(function(a) {
                    return B(a);
                });
            };
            var D = function g(e, b, c) {
                if (c >= b.length) {
                    return b.length;
                }
                var d = A(b, c, false);
                if ((0, a.G3)(e.bytes, d.bytes)) {
                    return c;
                }
                var f = A(b, c + d.length);
                return g(e, b, c + f.length + f.value + d.length);
            };
            var E = function j(b, d) {
                d = C(d);
                b = (0, a.Ki)(b);
                var e = [];
                if (!d.length) {
                    return e;
                }
                var f = 0;
                while(f < b.length){
                    var g = A(b, f, false);
                    var c = A(b, f + g.length);
                    var h = f + g.length + c.length;
                    if (c.value === 0x7f) {
                        c.value = D(g, b, h);
                        if (c.value !== b.length) {
                            c.value -= h;
                        }
                    }
                    var k = h + c.value > b.length ? b.length : h + c.value;
                    var i = b.subarray(h, k);
                    if ((0, a.G3)(d[0], g.bytes)) {
                        if (d.length === 1) {
                            e.push(i);
                        } else {
                            e = e.concat(j(i, d.slice(1)));
                        }
                    }
                    var l = g.length + c.length + i.length;
                    f += l;
                }
                return e;
            };
            var F = function w(a, f, g, t) {
                var b;
                if (f === "group") {
                    b = E(a, [
                        x.BlockDuration
                    ])[0];
                    if (b) {
                        b = bytesToNumber(b);
                        b = ((1 / g) * b * g) / 1000;
                    }
                    a = E(a, [
                        x.Block
                    ])[0];
                    f = "block";
                }
                var u = new DataView(a.buffer, a.byteOffset, a.byteLength);
                var h = A(a, 0);
                var m = u.getInt16(h.length, false);
                var i = a[h.length + 2];
                var c = a.subarray(h.length + 3);
                var n = ((1 / g) * (t + m) * g) / 1000;
                var d = {
                    duration: b,
                    trackNumber: h.value,
                    keyframe: f === "simple" && i >> 7 === 1,
                    invisible: (i & 0x08) >> 3 === 1,
                    lacing: (i & 0x06) >> 1,
                    discardable: f === "simple" && (i & 0x01) === 1,
                    frames: [],
                    pts: n,
                    dts: n,
                    timestamp: m
                };
                if (!d.lacing) {
                    d.frames.push(c);
                    return d;
                }
                var j = c[0] + 1;
                var k = [];
                var e = 1;
                if (d.lacing === 2) {
                    var v = (c.length - e) / j;
                    for(var o = 0; o < j; o++){
                        k.push(v);
                    }
                }
                if (d.lacing === 1) {
                    for(var p = 0; p < j - 1; p++){
                        var q = 0;
                        do {
                            q += c[e];
                            e++;
                        }while (c[e - 1] === 0xff)
                        k.push(q);
                    }
                }
                if (d.lacing === 3) {
                    var r = 0;
                    for(var l = 0; l < j - 1; l++){
                        var s = l === 0 ? A(c, e) : A(c, e, true, true);
                        r += s.value;
                        k.push(r);
                        e += s.length;
                    }
                }
                k.forEach(function(a) {
                    d.frames.push(c.subarray(e, e + a));
                    e += a;
                });
                return d;
            };
            var G = function g(d) {
                var a = 0;
                var c = {};
                while(a < d.length){
                    var e = d[a] & 0x7f;
                    var f = d[a + 1];
                    var b = void 0;
                    if (f === 1) {
                        b = d[a + 2];
                    } else {
                        b = d.subarray(a + 2, a + 2 + f);
                    }
                    if (e === 1) {
                        c.profile = b;
                    } else if (e === 2) {
                        c.level = b;
                    } else if (e === 3) {
                        c.bitDepth = b;
                    } else if (e === 4) {
                        c.chromaSubsampling = b;
                    } else {
                        c[e] = b;
                    }
                    a += 2 + f;
                }
                return c;
            };
            var H = function d(b) {
                b = toUint8(b);
                var c = [];
                var a = E(b, [
                    x.Segment,
                    x.Tracks,
                    x.Track, 
                ]);
                if (!a.length) {
                    a = E(b, [
                        x.Tracks,
                        x.Track, 
                    ]);
                }
                if (!a.length) {
                    a = E(b, [
                        x.Track
                    ]);
                }
                if (!a.length) {
                    return c;
                }
                a.forEach(function(d) {
                    var e = E(d, x.TrackType)[0];
                    if (!e || !e.length) {
                        return;
                    }
                    if (e[0] === 1) {
                        e = "video";
                    } else if (e[0] === 2) {
                        e = "audio";
                    } else if (e[0] === 17) {
                        e = "subtitle";
                    } else {
                        return;
                    }
                    var b = {
                        rawCodec: bytesToString(E(d, [
                            x.CodecID
                        ])[0]),
                        type: e,
                        codecPrivate: E(d, [
                            x.CodecPrivate, 
                        ])[0],
                        number: bytesToNumber(E(d, [
                            x.TrackNumber
                        ])[0]),
                        defaultDuration: bytesToNumber(E(d, [
                            x.DefaultDuration
                        ])[0]),
                        default: E(d, [
                            x.FlagDefault
                        ])[0],
                        rawData: d
                    };
                    var a = "";
                    if (/V_MPEG4\/ISO\/AVC/.test(b.rawCodec)) {
                        a = "avc1." + getAvcCodec(b.codecPrivate);
                    } else if (/V_MPEGH\/ISO\/HEVC/.test(b.rawCodec)) {
                        a = "hev1." + getHvcCodec(b.codecPrivate);
                    } else if (/V_MPEG4\/ISO\/ASP/.test(b.rawCodec)) {
                        if (b.codecPrivate) {
                            a = "mp4v.20." + b.codecPrivate[4].toString();
                        } else {
                            a = "mp4v.20.9";
                        }
                    } else if (/^V_THEORA/.test(b.rawCodec)) {
                        a = "theora";
                    } else if (/^V_VP8/.test(b.rawCodec)) {
                        a = "vp8";
                    } else if (/^V_VP9/.test(b.rawCodec)) {
                        if (b.codecPrivate) {
                            var f = G(b.codecPrivate), k = f.profile, l = f.level, m = f.bitDepth, n = f.chromaSubsampling;
                            a = "vp09.";
                            a += padStart(k, 2, "0") + ".";
                            a += padStart(l, 2, "0") + ".";
                            a += padStart(m, 2, "0") + ".";
                            a += "" + padStart(n, 2, "0");
                            var g = E(d, [
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
                            var h = E(d, [
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
                            var i = E(d, [
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
                            var j = E(d, [
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
                            if (g.length || h.length || i.length || j.length) {
                                a += "." + padStart(j[0], 2, "0");
                                a += "." + padStart(i[0], 2, "0");
                                a += "." + padStart(g[0], 2, "0");
                                a += "." + padStart(h[0], 2, "0");
                            }
                        } else {
                            a = "vp9";
                        }
                    } else if (/^V_AV1/.test(b.rawCodec)) {
                        a = "av01." + getAv1Codec(b.codecPrivate);
                    } else if (/A_ALAC/.test(b.rawCodec)) {
                        a = "alac";
                    } else if (/A_MPEG\/L2/.test(b.rawCodec)) {
                        a = "mp2";
                    } else if (/A_MPEG\/L3/.test(b.rawCodec)) {
                        a = "mp3";
                    } else if (/^A_AAC/.test(b.rawCodec)) {
                        if (b.codecPrivate) {
                            a = "mp4a.40." + (b.codecPrivate[0] >>> 3).toString();
                        } else {
                            a = "mp4a.40.2";
                        }
                    } else if (/^A_AC3/.test(b.rawCodec)) {
                        a = "ac-3";
                    } else if (/^A_PCM/.test(b.rawCodec)) {
                        a = "pcm";
                    } else if (/^A_MS\/ACM/.test(b.rawCodec)) {
                        a = "speex";
                    } else if (/^A_EAC3/.test(b.rawCodec)) {
                        a = "ec-3";
                    } else if (/^A_VORBIS/.test(b.rawCodec)) {
                        a = "vorbis";
                    } else if (/^A_FLAC/.test(b.rawCodec)) {
                        a = "flac";
                    } else if (/^A_OPUS/.test(b.rawCodec)) {
                        a = "opus";
                    }
                    b.codec = a;
                    c.push(b);
                });
                return c.sort(function(a, b) {
                    return a.number - b.number;
                });
            };
            var I = function g(d, b) {
                var e = [];
                var c = E(d, [
                    x.Segment
                ])[0];
                var a = E(c, [
                    x.SegmentInfo,
                    x.TimestampScale, 
                ])[0];
                if (a && a.length) {
                    a = bytesToNumber(a);
                } else {
                    a = 1000000;
                }
                var f = E(c, [
                    x.Cluster
                ]);
                if (!b) {
                    b = H(c);
                }
                f.forEach(function(c, h) {
                    var d = E(c, [
                        x.SimpleBlock, 
                    ]).map(function(a) {
                        return {
                            type: "simple",
                            data: a
                        };
                    });
                    var f = E(c, [
                        x.BlockGroup, 
                    ]).map(function(a) {
                        return {
                            type: "group",
                            data: a
                        };
                    });
                    var b = E(c, [
                        x.Timestamp
                    ])[0] || 0;
                    if (b && b.length) {
                        b = bytesToNumber(b);
                    }
                    var g = d.concat(f).sort(function(a, b) {
                        return a.data.byteOffset - b.data.byteOffset;
                    });
                    g.forEach(function(c, f) {
                        var d = F(c.data, c.type, a, b);
                        e.push(d);
                    });
                });
                return {
                    tracks: b,
                    blocks: e
                };
            };
            var J = b(8925);
            var K = (0, a.Ki)([
                0x00,
                0x00,
                0x00,
                0x01, 
            ]);
            var L = (0, a.Ki)([
                0x00,
                0x00,
                0x01, 
            ]);
            var M = (0, a.Ki)([
                0x00,
                0x00,
                0x03, 
            ]);
            var N = function h(c) {
                var d = [];
                var b = 1;
                while(b < c.length - 2){
                    if ((0, a.G3)(c.subarray(b, b + 3), M)) {
                        d.push(b + 2);
                        b++;
                    }
                    b++;
                }
                if (d.length === 0) {
                    return c;
                }
                var f = c.length - d.length;
                var g = new Uint8Array(f);
                var e = 0;
                for(b = 0; b < f; e++, b++){
                    if (e === d[0]) {
                        e++;
                        d.shift();
                    }
                    g[b] = c[e];
                }
                return g;
            };
            var O = function k(b, f, g, h) {
                if (h === void 0) {
                    h = Infinity;
                }
                b = (0, a.Ki)(b);
                g = [].concat(g);
                var c = 0;
                var e;
                var j = 0;
                while(c < b.length && (j < h || e)){
                    var d = void 0;
                    if ((0, a.G3)(b.subarray(c), K)) {
                        d = 4;
                    } else if ((0, a.G3)(b.subarray(c), L)) {
                        d = 3;
                    }
                    if (!d) {
                        c++;
                        continue;
                    }
                    j++;
                    if (e) {
                        return N(b.subarray(e, c));
                    }
                    var i = void 0;
                    if (f === "h264") {
                        i = b[c + d] & 0x1f;
                    } else if (f === "h265") {
                        i = (b[c + d] >> 1) & 0x3f;
                    }
                    if (g.indexOf(i) !== -1) {
                        e = c + d;
                    }
                    c += d + (f === "h264" ? 1 : 2);
                }
                return b.subarray(0, 0);
            };
            var P = function d(a, b, c) {
                return O(a, "h264", b, c);
            };
            var Q = function d(a, b, c) {
                return O(a, "h265", b, c);
            };
            var R = {
                webm: (0, a.Ki)([
                    0x77,
                    0x65,
                    0x62,
                    0x6d, 
                ]),
                matroska: (0, a.Ki)([
                    0x6d,
                    0x61,
                    0x74,
                    0x72,
                    0x6f,
                    0x73,
                    0x6b,
                    0x61, 
                ]),
                flac: (0, a.Ki)([
                    0x66,
                    0x4c,
                    0x61,
                    0x43, 
                ]),
                ogg: (0, a.Ki)([
                    0x4f,
                    0x67,
                    0x67,
                    0x53, 
                ]),
                ac3: (0, a.Ki)([
                    0x0b,
                    0x77
                ]),
                riff: (0, a.Ki)([
                    0x52,
                    0x49,
                    0x46,
                    0x46, 
                ]),
                avi: (0, a.Ki)([
                    0x41,
                    0x56,
                    0x49
                ]),
                wav: (0, a.Ki)([
                    0x57,
                    0x41,
                    0x56,
                    0x45, 
                ]),
                "3gp": (0, a.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x33,
                    0x67, 
                ]),
                mp4: (0, a.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                fmp4: (0, a.Ki)([
                    0x73,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                mov: (0, a.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x71,
                    0x74, 
                ]),
                moov: (0, a.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x76, 
                ]),
                moof: (0, a.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x66, 
                ])
            };
            var c = {
                aac: function d(b) {
                    var c = (0, J.c)(b);
                    return (0, a.G3)(b, [
                        0xff,
                        0x10
                    ], {
                        offset: c,
                        mask: [
                            0xff,
                            0x16
                        ]
                    });
                },
                mp3: function d(b) {
                    var c = (0, J.c)(b);
                    return (0, a.G3)(b, [
                        0xff,
                        0x02
                    ], {
                        offset: c,
                        mask: [
                            0xff,
                            0x06
                        ]
                    });
                },
                webm: function d(b) {
                    var c = E(b, [
                        x.EBML,
                        x.DocType, 
                    ])[0];
                    return (0, a.G3)(c, R.webm);
                },
                mkv: function d(b) {
                    var c = E(b, [
                        x.EBML,
                        x.DocType, 
                    ])[0];
                    return (0, a.G3)(c, R.matroska);
                },
                mp4: function d(b) {
                    if (c["3gp"](b) || c.mov(b)) {
                        return false;
                    }
                    if ((0, a.G3)(b, R.mp4, {
                        offset: 4
                    }) || (0, a.G3)(b, R.fmp4, {
                        offset: 4
                    })) {
                        return true;
                    }
                    if ((0, a.G3)(b, R.moof, {
                        offset: 4
                    }) || (0, a.G3)(b, R.moov, {
                        offset: 4
                    })) {
                        return true;
                    }
                },
                mov: function c(b) {
                    return (0, a.G3)(b, R.mov, {
                        offset: 4
                    });
                },
                "3gp": function c(b) {
                    return (0, a.G3)(b, R["3gp"], {
                        offset: 4
                    });
                },
                ac3: function d(b) {
                    var c = (0, J.c)(b);
                    return (0, a.G3)(b, R.ac3, {
                        offset: c
                    });
                },
                ts: function c(a) {
                    if (a.length < 189 && a.length >= 1) {
                        return a[0] === 0x47;
                    }
                    var b = 0;
                    while(b + 188 < a.length && b < 188){
                        if (a[b] === 0x47 && a[b + 188] === 0x47) {
                            return true;
                        }
                        b += 1;
                    }
                    return false;
                },
                flac: function d(b) {
                    var c = (0, J.c)(b);
                    return (0, a.G3)(b, R.flac, {
                        offset: c
                    });
                },
                ogg: function c(b) {
                    return (0, a.G3)(b, R.ogg);
                },
                avi: function c(b) {
                    return ((0, a.G3)(b, R.riff) && (0, a.G3)(b, R.avi, {
                        offset: 8
                    }));
                },
                wav: function c(b) {
                    return ((0, a.G3)(b, R.riff) && (0, a.G3)(b, R.wav, {
                        offset: 8
                    }));
                },
                h264: function b(a) {
                    return P(a, 7, 3).length;
                },
                h265: function b(a) {
                    return Q(a, [
                        32,
                        33
                    ], 3).length;
                }
            };
            var f = Object.keys(c).filter(function(a) {
                return a !== "ts" && a !== "h264" && a !== "h265";
            }).concat([
                "ts",
                "h264",
                "h265"
            ]);
            f.forEach(function(b) {
                var d = c[b];
                c[b] = function(b) {
                    return d((0, a.Ki)(b));
                };
            });
            var S = c;
            var T = function e(b) {
                b = (0, a.Ki)(b);
                for(var c = 0; c < f.length; c++){
                    var d = f[c];
                    if (S[d](b)) {
                        return d;
                    }
                }
                return "";
            };
            var U = function b(a) {
                return q(a, [
                    "moof"
                ]).length > 0;
            };
        },
        6722: function(d, b, a) {
            "use strict";
            a.d(b, {
                Z: function() {
                    return h;
                }
            });
            var c = a(8908);
            var e = a.n(c);
            var f = a(816)["Buffer"];
            var g = function b(a) {
                return e().atob ? e().atob(a) : f.from(a, "base64").toString("binary");
            };
            function h(d) {
                var b = g(d);
                var c = new Uint8Array(b.length);
                for(var a = 0; a < b.length; a++){
                    c[a] = b.charCodeAt(a);
                }
                return c;
            }
        },
        8925: function(d, b, a) {
            "use strict";
            a.d(b, {
                c: function() {
                    return g;
                }
            });
            var c = a(562);
            var e = (0, c.Ki)([
                0x49,
                0x44,
                0x33, 
            ]);
            var f = function g(a, b) {
                if (b === void 0) {
                    b = 0;
                }
                a = (0, c.Ki)(a);
                var e = a[b + 5];
                var d = (a[b + 6] << 21) | (a[b + 7] << 14) | (a[b + 8] << 7) | a[b + 9];
                var f = (e & 16) >> 4;
                if (f) {
                    return d + 20;
                }
                return d + 10;
            };
            var g = function d(b, a) {
                if (a === void 0) {
                    a = 0;
                }
                b = (0, c.Ki)(b);
                if (b.length - a < 10 || !(0, c.G3)(b, e, {
                    offset: a
                })) {
                    return a;
                }
                a += f(b, a);
                return d(b, a);
            };
        },
        8485: function(c, a, b) {
            "use strict";
            b.d(a, {
                t: function() {
                    return f;
                }
            });
            var d = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;
            var e = /^application\/dash\+xml/i;
            var f = function b(a) {
                if (d.test(a)) {
                    return "hls";
                }
                if (e.test(a)) {
                    return "dash";
                }
                if (a === "application/vnd.videojs.vhs+json") {
                    return "vhs-json";
                }
                return null;
            };
        },
        779: function(f, b, a) {
            "use strict";
            var c = a(9945);
            var g = a.n(c);
            var d = a(8908);
            var h = a.n(d);
            var i = "http://example.com";
            var e = function j(a, b) {
                if (/^[a-z]+:/i.test(b)) {
                    return b;
                }
                if (/^data:/.test(a)) {
                    a = (h().location && h().location.href) || "";
                }
                var d = typeof h().URL === "function";
                var e = /^\/\//.test(a);
                var f = !h().location && !/\/\//i.test(a);
                if (d) {
                    a = new (h().URL)(a, h().location || i);
                } else if (!/\/\//i.test(a)) {
                    a = g().buildAbsoluteURL((h().location && h().location.href) || "", a);
                }
                if (d) {
                    var c = new URL(b, a);
                    if (f) {
                        return c.href.slice(i.length);
                    } else if (e) {
                        return c.href.slice(c.protocol.length);
                    }
                    return c.href;
                }
                return g().buildAbsoluteURL(a, b);
            };
            b["Z"] = e;
        },
        3490: function(a, d, b) {
            "use strict";
            var e = b(8908);
            var c = function b(c, a) {
                if (a === void 0) {
                    a = false;
                }
                return function(h, b, d) {
                    if (h) {
                        c(h);
                        return;
                    }
                    if (b.statusCode >= 400 && b.statusCode <= 599) {
                        var g = d;
                        if (a) {
                            if (e.TextDecoder) {
                                var i = f(b.headers && b.headers["content-type"]);
                                try {
                                    g = new TextDecoder(i).decode(d);
                                } catch (j) {}
                            } else {
                                g = String.fromCharCode.apply(null, new Uint8Array(d));
                            }
                        }
                        c({
                            cause: g
                        });
                        return;
                    }
                    c(null, d);
                };
            };
            function f(a) {
                if (a === void 0) {
                    a = "";
                }
                return a.toLowerCase().split(";").reduce(function(b, c) {
                    var a = c.split("="), d = a[0], e = a[1];
                    if (d.trim() === "charset") {
                        return e.trim();
                    }
                    return b;
                }, "utf-8");
            }
            a.exports = c;
        },
        9603: function(b, d, a) {
            "use strict";
            var c = a(8908);
            var e = a(7154);
            var f = a(7376);
            k.httpHandler = a(3490);
            var g = function c(a) {
                var b = {};
                if (!a) {
                    return b;
                }
                a.trim().split("\n").forEach(function(c) {
                    var e = c.indexOf(":");
                    var a = c.slice(0, e).trim().toLowerCase();
                    var d = c.slice(e + 1).trim();
                    if (typeof b[a] === "undefined") {
                        b[a] = d;
                    } else if (Array.isArray(b[a])) {
                        b[a].push(d);
                    } else {
                        b[a] = [
                            b[a],
                            d
                        ];
                    }
                });
                return b;
            };
            b.exports = k;
            b.exports["default"] = k;
            k.XMLHttpRequest = c.XMLHttpRequest || n;
            k.XDomainRequest = "withCredentials" in new k.XMLHttpRequest() ? k.XMLHttpRequest : c.XDomainRequest;
            h([
                "get",
                "put",
                "post",
                "patch",
                "head",
                "delete"
            ], function(a) {
                k[a === "delete" ? "del" : a] = function(c, b, d) {
                    b = j(c, b, d);
                    b.method = a.toUpperCase();
                    return l(b);
                };
            });
            function h(b, c) {
                for(var a = 0; a < b.length; a++){
                    c(b[a]);
                }
            }
            function i(a) {
                for(var b in a){
                    if (a.hasOwnProperty(b)) return false;
                }
                return true;
            }
            function j(a, c, d) {
                var b = a;
                if (f(c)) {
                    d = c;
                    if (typeof a === "string") {
                        b = {
                            uri: a
                        };
                    }
                } else {
                    b = e({}, c, {
                        uri: a
                    });
                }
                b.callback = d;
                return b;
            }
            function k(b, a, c) {
                a = j(b, a, c);
                return l(a);
            }
            function l(a) {
                if (typeof a.callback === "undefined") {
                    throw new Error("callback argument missing");
                }
                var r = false;
                var s = function e(b, c, d) {
                    if (!r) {
                        r = true;
                        a.callback(b, c, d);
                    }
                };
                function n() {
                    if (b.readyState === 4) {
                        setTimeout(o, 0);
                    }
                }
                function t() {
                    var a = undefined;
                    if (b.response) {
                        a = b.response;
                    } else {
                        a = b.responseText || m(b);
                    }
                    if (p) {
                        try {
                            a = JSON.parse(a);
                        } catch (c) {}
                    }
                    return a;
                }
                function j(a) {
                    clearTimeout(q);
                    if (!(a instanceof Error)) {
                        a = new Error("" + (a || "Unknown XMLHttpRequest Error"));
                    }
                    a.statusCode = 0;
                    return s(a, v);
                }
                function o() {
                    if (u) return;
                    var c;
                    clearTimeout(q);
                    if (a.useXDR && b.status === undefined) {
                        c = 200;
                    } else {
                        c = b.status === 1223 ? 204 : b.status;
                    }
                    var d = v;
                    var f = null;
                    if (c !== 0) {
                        d = {
                            body: t(),
                            statusCode: c,
                            method: e,
                            headers: {},
                            url: l,
                            rawRequest: b
                        };
                        if (b.getAllResponseHeaders) {
                            d.headers = g(b.getAllResponseHeaders());
                        }
                    } else {
                        f = new Error("Internal XMLHttpRequest Error");
                    }
                    return s(f, d, d.body);
                }
                var b = a.xhr || null;
                if (!b) {
                    if (a.cors || a.useXDR) {
                        b = new k.XDomainRequest();
                    } else {
                        b = new k.XMLHttpRequest();
                    }
                }
                var d;
                var u;
                var l = (b.url = a.uri || a.url);
                var e = (b.method = a.method || "GET");
                var f = a.body || a.data;
                var c = (b.headers = a.headers || {});
                var h = !!a.sync;
                var p = false;
                var q;
                var v = {
                    body: undefined,
                    headers: {},
                    statusCode: 0,
                    method: e,
                    url: l,
                    rawRequest: b
                };
                if ("json" in a && a.json !== false) {
                    p = true;
                    c["accept"] || c["Accept"] || (c["Accept"] = "application/json");
                    if (e !== "GET" && e !== "HEAD") {
                        c["content-type"] || c["Content-Type"] || (c["Content-Type"] = "application/json");
                        f = JSON.stringify(a.json === true ? f : a.json);
                    }
                }
                b.onreadystatechange = n;
                b.onload = o;
                b.onerror = j;
                b.onprogress = function() {};
                b.onabort = function() {
                    u = true;
                };
                b.ontimeout = j;
                b.open(e, l, !h, a.username, a.password);
                if (!h) {
                    b.withCredentials = !!a.withCredentials;
                }
                if (!h && a.timeout > 0) {
                    q = setTimeout(function() {
                        if (u) return;
                        u = true;
                        b.abort("timeout");
                        var a = new Error("XMLHttpRequest timeout");
                        a.code = "ETIMEDOUT";
                        j(a);
                    }, a.timeout);
                }
                if (b.setRequestHeader) {
                    for(d in c){
                        if (c.hasOwnProperty(d)) {
                            b.setRequestHeader(d, c[d]);
                        }
                    }
                } else if (a.headers && !i(a.headers)) {
                    throw new Error("Headers cannot be set on an XDomainRequest object");
                }
                if ("responseType" in a) {
                    b.responseType = a.responseType;
                }
                if ("beforeSend" in a && typeof a.beforeSend === "function") {
                    a.beforeSend(b);
                }
                b.send(f || null);
                return b;
            }
            function m(a) {
                try {
                    if (a.responseType === "document") {
                        return a.responseXML;
                    }
                    var b = a.responseXML && a.responseXML.documentElement.nodeName === "parsererror";
                    if (a.responseType === "" && !b) {
                        return a.responseXML;
                    }
                } catch (c) {}
                return null;
            }
            function n() {}
        },
        2167: function(e, a) {
            "use strict";
            function b(b, a) {
                if (a === undefined) {
                    a = Object;
                }
                return a && typeof a.freeze === "function" ? a.freeze(b) : b;
            }
            var c = b({
                HTML: "text/html",
                isHTML: function(a) {
                    return a === c.HTML;
                },
                XML_APPLICATION: "application/xml",
                XML_TEXT: "text/xml",
                XML_XHTML_APPLICATION: "application/xhtml+xml",
                XML_SVG_IMAGE: "image/svg+xml"
            });
            var d = b({
                HTML: "http://www.w3.org/1999/xhtml",
                isHTML: function(a) {
                    return a === d.HTML;
                },
                SVG: "http://www.w3.org/2000/svg",
                XML: "http://www.w3.org/XML/1998/namespace",
                XMLNS: "http://www.w3.org/2000/xmlns/"
            });
            a.freeze = b;
            a.MIME_TYPE = c;
            a.NAMESPACE = d;
        },
        6129: function(i, g, a) {
            var b;
            var h = a(2167);
            var c = a(1146);
            var j = a(1045);
            var d = a(6925);
            var k = c.DOMImplementation;
            var l = h.NAMESPACE;
            var m = d.ParseError;
            var n = d.XMLReader;
            function e(a) {
                this.options = a || {
                    locator: {}
                };
            }
            e.prototype.parseFromString = function(e, i) {
                var a = this.options;
                var b = new n();
                var c = a.domBuilder || new f();
                var k = a.errorHandler;
                var g = a.locator;
                var d = a.xmlns || {};
                var h = /\/x?html?$/.test(i);
                var m = h ? j.HTML_ENTITIES : j.XML_ENTITIES;
                if (g) {
                    c.setDocumentLocator(g);
                }
                b.errorHandler = o(k, c, g);
                b.domBuilder = a.domBuilder || c;
                if (h) {
                    d[""] = l.HTML;
                }
                d.xml = d.xml || l.XML;
                if (e && typeof e === "string") {
                    b.parse(e, d, m);
                } else {
                    b.errorHandler.error("invalid doc source");
                }
                return c.doc;
            };
            function o(a, b, d) {
                if (!a) {
                    if (b instanceof f) {
                        return b;
                    }
                    a = b;
                }
                var e = {};
                var g = a instanceof Function;
                d = d || {};
                function c(c) {
                    var b = a[c];
                    if (!b && g) {
                        b = a.length == 2 ? function(b) {
                            a(c, b);
                        } : a;
                    }
                    e[c] = (b && function(a) {
                        b("[xmldom " + c + "]\t" + a + q(d));
                    }) || function() {};
                }
                c("warning");
                c("error");
                c("fatalError");
                return e;
            }
            function f() {
                this.cdata = false;
            }
            function p(a, b) {
                b.lineNumber = a.lineNumber;
                b.columnNumber = a.columnNumber;
            }
            f.prototype = {
                startDocument: function() {
                    this.doc = new k().createDocument(null, null, null);
                    if (this.locator) {
                        this.doc.documentURI = this.locator.systemId;
                    }
                },
                startElement: function(e, h, f, b) {
                    var g = this.doc;
                    var c = g.createElementNS(e, f || h);
                    var i = b.length;
                    s(this, c);
                    this.currentElement = c;
                    this.locator && p(this.locator, c);
                    for(var a = 0; a < i; a++){
                        var e = b.getURI(a);
                        var j = b.getValue(a);
                        var f = b.getQName(a);
                        var d = g.createAttributeNS(e, f);
                        this.locator && p(b.getLocator(a), d);
                        d.value = d.nodeValue = j;
                        c.setAttributeNode(d);
                    }
                },
                endElement: function(b, c, d) {
                    var a = this.currentElement;
                    var e = a.tagName;
                    this.currentElement = a.parentNode;
                },
                startPrefixMapping: function(a, b) {},
                endPrefixMapping: function(a) {},
                processingInstruction: function(b, c) {
                    var a = this.doc.createProcessingInstruction(b, c);
                    this.locator && p(this.locator, a);
                    s(this, a);
                },
                ignorableWhitespace: function(a, b, c) {},
                characters: function(a, c, d) {
                    a = r.apply(this, arguments);
                    if (a) {
                        if (this.cdata) {
                            var b = this.doc.createCDATASection(a);
                        } else {
                            var b = this.doc.createTextNode(a);
                        }
                        if (this.currentElement) {
                            this.currentElement.appendChild(b);
                        } else if (/^\s*$/.test(a)) {
                            this.doc.appendChild(b);
                        }
                        this.locator && p(this.locator, b);
                    }
                },
                skippedEntity: function(a) {},
                endDocument: function() {
                    this.doc.normalize();
                },
                setDocumentLocator: function(a) {
                    if ((this.locator = a)) {
                        a.lineNumber = 0;
                    }
                },
                comment: function(a, c, d) {
                    a = r.apply(this, arguments);
                    var b = this.doc.createComment(a);
                    this.locator && p(this.locator, b);
                    s(this, b);
                },
                startCDATA: function() {
                    this.cdata = true;
                },
                endCDATA: function() {
                    this.cdata = false;
                },
                startDTD: function(c, d, e) {
                    var a = this.doc.implementation;
                    if (a && a.createDocumentType) {
                        var b = a.createDocumentType(c, d, e);
                        this.locator && p(this.locator, b);
                        s(this, b);
                        this.doc.doctype = b;
                    }
                },
                warning: function(a) {
                    console.warn("[xmldom warning]\t" + a, q(this.locator));
                },
                error: function(a) {
                    console.error("[xmldom error]\t" + a, q(this.locator));
                },
                fatalError: function(a) {
                    throw new m(a, this.locator);
                }
            };
            function q(a) {
                if (a) {
                    return ("\n@" + (a.systemId || "") + "#[line:" + a.lineNumber + ",col:" + a.columnNumber + "]");
                }
            }
            function r(a, b, c) {
                if (typeof a == "string") {
                    return a.substr(b, c);
                } else {
                    if (a.length >= b + c || b) {
                        return new java.lang.String(a, b, c) + "";
                    }
                    return a;
                }
            }
            "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(a) {
                f.prototype[a] = function() {
                    return null;
                };
            });
            function s(a, b) {
                if (!a.currentElement) {
                    a.doc.appendChild(b);
                } else {
                    a.currentElement.appendChild(b);
                }
            }
            b = f;
            g.DOMParser = e;
            b = c.DOMImplementation;
            b = c.XMLSerializer;
        },
        1146: function(P, f, z) {
            var A = z(2167);
            var Q = A.NAMESPACE;
            function R(a) {
                return a !== "";
            }
            function S(a) {
                return a ? a.split(/[\t\n\f\r ]+/).filter(R) : [];
            }
            function T(a, b) {
                if (!a.hasOwnProperty(b)) {
                    a[b] = true;
                }
                return a;
            }
            function U(a) {
                if (!a) return [];
                var b = S(a);
                return Object.keys(b.reduce(T, {}));
            }
            function V(a) {
                return function(b) {
                    return a && a.indexOf(b) !== -1;
                };
            }
            function k(a, c) {
                for(var b in a){
                    c[b] = a[b];
                }
            }
            function d(a, d) {
                var b = a.prototype;
                if (!(b instanceof d)) {
                    function c() {}
                    c.prototype = d.prototype;
                    c = new c();
                    k(b, c);
                    a.prototype = b = c;
                }
                if (b.constructor != a) {
                    if (typeof a != "function") {
                        console.error("unknown Class:" + a);
                    }
                    b.constructor = a;
                }
            }
            var e = {};
            var B = (e.ELEMENT_NODE = 1);
            var C = (e.ATTRIBUTE_NODE = 2);
            var D = (e.TEXT_NODE = 3);
            var E = (e.CDATA_SECTION_NODE = 4);
            var F = (e.ENTITY_REFERENCE_NODE = 5);
            var G = (e.ENTITY_NODE = 6);
            var H = (e.PROCESSING_INSTRUCTION_NODE = 7);
            var I = (e.COMMENT_NODE = 8);
            var J = (e.DOCUMENT_NODE = 9);
            var K = (e.DOCUMENT_TYPE_NODE = 10);
            var L = (e.DOCUMENT_FRAGMENT_NODE = 11);
            var M = (e.NOTATION_NODE = 12);
            var a = {};
            var c = {};
            var W = (a.INDEX_SIZE_ERR = ((c[1] = "Index size error"), 1));
            var X = (a.DOMSTRING_SIZE_ERR = ((c[2] = "DOMString size error"), 2));
            var Y = (a.HIERARCHY_REQUEST_ERR = ((c[3] = "Hierarchy request error"), 3));
            var Z = (a.WRONG_DOCUMENT_ERR = ((c[4] = "Wrong document"), 4));
            var $ = (a.INVALID_CHARACTER_ERR = ((c[5] = "Invalid character"), 5));
            var _ = (a.NO_DATA_ALLOWED_ERR = ((c[6] = "No data allowed"), 6));
            var aa = (a.NO_MODIFICATION_ALLOWED_ERR = ((c[7] = "No modification allowed"), 7));
            var ab = (a.NOT_FOUND_ERR = ((c[8] = "Not found"), 8));
            var ac = (a.NOT_SUPPORTED_ERR = ((c[9] = "Not supported"), 9));
            var ad = (a.INUSE_ATTRIBUTE_ERR = ((c[10] = "Attribute in use"), 10));
            var ae = (a.INVALID_STATE_ERR = ((c[11] = "Invalid state"), 11));
            var af = (a.SYNTAX_ERR = ((c[12] = "Syntax error"), 12));
            var ag = (a.INVALID_MODIFICATION_ERR = ((c[13] = "Invalid modification"), 13));
            var ah = (a.NAMESPACE_ERR = ((c[14] = "Invalid namespace"), 14));
            var ai = (a.INVALID_ACCESS_ERR = ((c[15] = "Invalid access"), 15));
            function l(b, a) {
                if (a instanceof Error) {
                    var d = a;
                } else {
                    d = this;
                    Error.call(this, c[b]);
                    this.message = c[b];
                    if (Error.captureStackTrace) Error.captureStackTrace(this, l);
                }
                d.code = b;
                if (a) this.message = this.message + ": " + a;
                return d;
            }
            l.prototype = Error.prototype;
            k(a, l);
            function i() {}
            i.prototype = {
                length: 0,
                item: function(a) {
                    return this[a] || null;
                },
                toString: function(c, d) {
                    for(var b = [], a = 0; a < this.length; a++){
                        ay(this[a], b, c, d);
                    }
                    return b.join("");
                }
            };
            function m(a, b) {
                this._node = a;
                this._refresh = b;
                aj(this);
            }
            function aj(a) {
                var b = a._node._inc || a._node.ownerDocument._inc;
                if (a._inc != b) {
                    var c = a._refresh(a._node);
                    O(a, "length", c.length);
                    k(c, a);
                    a._inc = b;
                }
            }
            m.prototype.item = function(a) {
                aj(this);
                return this[a];
            };
            d(m, i);
            function N() {}
            function ak(b, c) {
                var a = b.length;
                while(a--){
                    if (b[a] === c) {
                        return a;
                    }
                }
            }
            function al(a, b, c, d) {
                if (d) {
                    b[ak(b, d)] = c;
                } else {
                    b[b.length++] = c;
                }
                if (a) {
                    c.ownerElement = a;
                    var e = a.ownerDocument;
                    if (e) {
                        d && aq(e, a, d);
                        ap(e, a, c);
                    }
                }
            }
            function am(b, a, c) {
                var d = ak(a, c);
                if (d >= 0) {
                    var e = a.length - 1;
                    while(d < e){
                        a[d] = a[++d];
                    }
                    a.length = e;
                    if (b) {
                        var f = b.ownerDocument;
                        if (f) {
                            aq(f, b, c);
                            c.ownerElement = null;
                        }
                    }
                } else {
                    throw l(ab, new Error(b.tagName + "@" + c));
                }
            }
            N.prototype = {
                length: 0,
                item: i.prototype.item,
                getNamedItem: function(c) {
                    var a = this.length;
                    while(a--){
                        var b = this[a];
                        if (b.nodeName == c) {
                            return b;
                        }
                    }
                },
                setNamedItem: function(a) {
                    var b = a.ownerElement;
                    if (b && b != this._ownerElement) {
                        throw new l(ad);
                    }
                    var c = this.getNamedItem(a.nodeName);
                    al(this._ownerElement, this, a, c);
                    return c;
                },
                setNamedItemNS: function(a) {
                    var c = a.ownerElement, b;
                    if (c && c != this._ownerElement) {
                        throw new l(ad);
                    }
                    b = this.getNamedItemNS(a.namespaceURI, a.localName);
                    al(this._ownerElement, this, a, b);
                    return b;
                },
                removeNamedItem: function(b) {
                    var a = this.getNamedItem(b);
                    am(this._ownerElement, this, a);
                    return a;
                },
                removeNamedItemNS: function(b, c) {
                    var a = this.getNamedItemNS(b, c);
                    am(this._ownerElement, this, a);
                    return a;
                },
                getNamedItemNS: function(c, d) {
                    var b = this.length;
                    while(b--){
                        var a = this[b];
                        if (a.localName == d && a.namespaceURI == c) {
                            return a;
                        }
                    }
                    return null;
                }
            };
            function p() {}
            p.prototype = {
                hasFeature: function(a, b) {
                    return true;
                },
                createDocument: function(d, c, b) {
                    var a = new j();
                    a.implementation = this;
                    a.childNodes = new i();
                    a.doctype = b || null;
                    if (b) {
                        a.appendChild(b);
                    }
                    if (c) {
                        var e = a.createElementNS(d, c);
                        a.appendChild(e);
                    }
                    return a;
                },
                createDocumentType: function(b, c, d) {
                    var a = new n();
                    a.name = b;
                    a.nodeName = b;
                    a.publicId = c || "";
                    a.systemId = d || "";
                    return a;
                }
            };
            function b() {}
            b.prototype = {
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
                insertBefore: function(a, b) {
                    return at(this, a, b);
                },
                replaceChild: function(b, a) {
                    this.insertBefore(b, a);
                    if (a) {
                        this.removeChild(a);
                    }
                },
                removeChild: function(a) {
                    return as(this, a);
                },
                appendChild: function(a) {
                    return this.insertBefore(a, null);
                },
                hasChildNodes: function() {
                    return this.firstChild != null;
                },
                cloneNode: function(a) {
                    return aA(this.ownerDocument || this, this, a);
                },
                normalize: function() {
                    var a = this.firstChild;
                    while(a){
                        var b = a.nextSibling;
                        if (b && b.nodeType == D && a.nodeType == D) {
                            this.removeChild(b);
                            a.appendData(b.data);
                        } else {
                            a.normalize();
                            a = b;
                        }
                    }
                },
                isSupported: function(a, b) {
                    return this.ownerDocument.implementation.hasFeature(a, b);
                },
                hasAttributes: function() {
                    return this.attributes.length > 0;
                },
                lookupPrefix: function(d) {
                    var a = this;
                    while(a){
                        var b = a._nsMap;
                        if (b) {
                            for(var c in b){
                                if (b[c] == d) {
                                    return c;
                                }
                            }
                        }
                        a = a.nodeType == C ? a.ownerDocument : a.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function(c) {
                    var a = this;
                    while(a){
                        var b = a._nsMap;
                        if (b) {
                            if (c in b) {
                                return b[c];
                            }
                        }
                        a = a.nodeType == C ? a.ownerDocument : a.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function(a) {
                    var b = this.lookupPrefix(a);
                    return b == null;
                }
            };
            function an(a) {
                return ((a == "<" && "&lt;") || (a == ">" && "&gt;") || (a == "&" && "&amp;") || (a == '"' && "&quot;") || "&#" + a.charCodeAt() + ";");
            }
            k(e, b);
            k(e, b.prototype);
            function ao(a, b) {
                if (b(a)) {
                    return true;
                }
                if ((a = a.firstChild)) {
                    do {
                        if (ao(a, b)) {
                            return true;
                        }
                    }while ((a = a.nextSibling))
                }
            }
            function j() {}
            function ap(b, c, a) {
                b && b._inc++;
                var d = a.namespaceURI;
                if (d === Q.XMLNS) {
                    c._nsMap[a.prefix ? a.localName : ""] = a.value;
                }
            }
            function aq(b, c, a, e) {
                b && b._inc++;
                var d = a.namespaceURI;
                if (d === Q.XMLNS) {
                    delete c._nsMap[a.prefix ? a.localName : ""];
                }
            }
            function ar(c, d, e) {
                if (c && c._inc) {
                    c._inc++;
                    var a = d.childNodes;
                    if (e) {
                        a[a.length++] = e;
                    } else {
                        var b = d.firstChild;
                        var f = 0;
                        while(b){
                            a[f++] = b;
                            b = b.nextSibling;
                        }
                        a.length = f;
                    }
                }
            }
            function as(a, d) {
                var b = d.previousSibling;
                var c = d.nextSibling;
                if (b) {
                    b.nextSibling = c;
                } else {
                    a.firstChild = c;
                }
                if (c) {
                    c.previousSibling = b;
                } else {
                    a.lastChild = b;
                }
                ar(a.ownerDocument, a);
                return d;
            }
            function at(c, a, d) {
                var g = a.parentNode;
                if (g) {
                    g.removeChild(a);
                }
                if (a.nodeType === L) {
                    var b = a.firstChild;
                    if (b == null) {
                        return a;
                    }
                    var e = a.lastChild;
                } else {
                    b = e = a;
                }
                var f = d ? d.previousSibling : c.lastChild;
                b.previousSibling = f;
                e.nextSibling = d;
                if (f) {
                    f.nextSibling = b;
                } else {
                    c.firstChild = b;
                }
                if (d == null) {
                    c.lastChild = e;
                } else {
                    d.previousSibling = e;
                }
                do {
                    b.parentNode = c;
                }while (b !== e && (b = b.nextSibling))
                ar(c.ownerDocument || c, c);
                if (a.nodeType == L) {
                    a.firstChild = a.lastChild = null;
                }
                return a;
            }
            function au(b, a) {
                var d = a.parentNode;
                if (d) {
                    var c = b.lastChild;
                    d.removeChild(a);
                    var c = b.lastChild;
                }
                var c = b.lastChild;
                a.parentNode = b;
                a.previousSibling = c;
                a.nextSibling = null;
                if (c) {
                    c.nextSibling = a;
                } else {
                    b.firstChild = a;
                }
                b.lastChild = a;
                ar(b.ownerDocument, b, a);
                return a;
            }
            j.prototype = {
                nodeName: "#document",
                nodeType: J,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function(a, c) {
                    if (a.nodeType == L) {
                        var b = a.firstChild;
                        while(b){
                            var d = b.nextSibling;
                            this.insertBefore(b, c);
                            b = d;
                        }
                        return a;
                    }
                    if (this.documentElement == null && a.nodeType == B) {
                        this.documentElement = a;
                    }
                    return (at(this, a, c), (a.ownerDocument = this), a);
                },
                removeChild: function(a) {
                    if (this.documentElement == a) {
                        this.documentElement = null;
                    }
                    return as(this, a);
                },
                importNode: function(a, b) {
                    return az(this, a, b);
                },
                getElementById: function(b) {
                    var a = null;
                    ao(this.documentElement, function(c) {
                        if (c.nodeType == B) {
                            if (c.getAttribute("id") == b) {
                                a = c;
                                return true;
                            }
                        }
                    });
                    return a;
                },
                getElementsByClassName: function(a) {
                    var b = U(a);
                    return new m(this, function(c) {
                        var d = [];
                        if (b.length > 0) {
                            ao(c.documentElement, function(e) {
                                if (e !== c && e.nodeType === B) {
                                    var f = e.getAttribute("class");
                                    if (f) {
                                        var g = a === f;
                                        if (!g) {
                                            var h = U(f);
                                            g = b.every(V(h));
                                        }
                                        if (g) {
                                            d.push(e);
                                        }
                                    }
                                }
                            });
                        }
                        return d;
                    });
                },
                createElement: function(b) {
                    var a = new g();
                    a.ownerDocument = this;
                    a.nodeName = b;
                    a.tagName = b;
                    a.localName = b;
                    a.childNodes = new i();
                    var c = (a.attributes = new N());
                    c._ownerElement = a;
                    return a;
                },
                createDocumentFragment: function() {
                    var a = new o();
                    a.ownerDocument = this;
                    a.childNodes = new i();
                    return a;
                },
                createTextNode: function(b) {
                    var a = new r();
                    a.ownerDocument = this;
                    a.appendData(b);
                    return a;
                },
                createComment: function(b) {
                    var a = new s();
                    a.ownerDocument = this;
                    a.appendData(b);
                    return a;
                },
                createCDATASection: function(b) {
                    var a = new t();
                    a.ownerDocument = this;
                    a.appendData(b);
                    return a;
                },
                createProcessingInstruction: function(b, c) {
                    var a = new x();
                    a.ownerDocument = this;
                    a.tagName = a.target = b;
                    a.nodeValue = a.data = c;
                    return a;
                },
                createAttribute: function(b) {
                    var a = new q();
                    a.ownerDocument = this;
                    a.name = b;
                    a.nodeName = b;
                    a.localName = b;
                    a.specified = true;
                    return a;
                },
                createEntityReference: function(b) {
                    var a = new w();
                    a.ownerDocument = this;
                    a.nodeName = b;
                    return a;
                },
                createElementNS: function(d, b) {
                    var a = new g();
                    var c = b.split(":");
                    var e = (a.attributes = new N());
                    a.childNodes = new i();
                    a.ownerDocument = this;
                    a.nodeName = b;
                    a.tagName = b;
                    a.namespaceURI = d;
                    if (c.length == 2) {
                        a.prefix = c[0];
                        a.localName = c[1];
                    } else {
                        a.localName = b;
                    }
                    e._ownerElement = a;
                    return a;
                },
                createAttributeNS: function(d, b) {
                    var a = new q();
                    var c = b.split(":");
                    a.ownerDocument = this;
                    a.nodeName = b;
                    a.name = b;
                    a.namespaceURI = d;
                    a.specified = true;
                    if (c.length == 2) {
                        a.prefix = c[0];
                        a.localName = c[1];
                    } else {
                        a.localName = b;
                    }
                    return a;
                }
            };
            d(j, b);
            function g() {
                this._nsMap = {};
            }
            g.prototype = {
                nodeType: B,
                hasAttribute: function(a) {
                    return this.getAttributeNode(a) != null;
                },
                getAttribute: function(b) {
                    var a = this.getAttributeNode(b);
                    return (a && a.value) || "";
                },
                getAttributeNode: function(a) {
                    return this.attributes.getNamedItem(a);
                },
                setAttribute: function(b, c) {
                    var a = this.ownerDocument.createAttribute(b);
                    a.value = a.nodeValue = "" + c;
                    this.setAttributeNode(a);
                },
                removeAttribute: function(b) {
                    var a = this.getAttributeNode(b);
                    a && this.removeAttributeNode(a);
                },
                appendChild: function(a) {
                    if (a.nodeType === L) {
                        return this.insertBefore(a, null);
                    } else {
                        return au(this, a);
                    }
                },
                setAttributeNode: function(a) {
                    return this.attributes.setNamedItem(a);
                },
                setAttributeNodeNS: function(a) {
                    return this.attributes.setNamedItemNS(a);
                },
                removeAttributeNode: function(a) {
                    return this.attributes.removeNamedItem(a.nodeName);
                },
                removeAttributeNS: function(b, c) {
                    var a = this.getAttributeNodeNS(b, c);
                    a && this.removeAttributeNode(a);
                },
                hasAttributeNS: function(a, b) {
                    return (this.getAttributeNodeNS(a, b) != null);
                },
                getAttributeNS: function(b, c) {
                    var a = this.getAttributeNodeNS(b, c);
                    return (a && a.value) || "";
                },
                setAttributeNS: function(b, c, d) {
                    var a = this.ownerDocument.createAttributeNS(b, c);
                    a.value = a.nodeValue = "" + d;
                    this.setAttributeNode(a);
                },
                getAttributeNodeNS: function(a, b) {
                    return this.attributes.getNamedItemNS(a, b);
                },
                getElementsByTagName: function(a) {
                    return new m(this, function(b) {
                        var c = [];
                        ao(b, function(d) {
                            if (d !== b && d.nodeType == B && (a === "*" || d.tagName == a)) {
                                c.push(d);
                            }
                        });
                        return c;
                    });
                },
                getElementsByTagNameNS: function(a, b) {
                    return new m(this, function(c) {
                        var d = [];
                        ao(c, function(e) {
                            if (e !== c && e.nodeType === B && (a === "*" || e.namespaceURI === a) && (b === "*" || e.localName == b)) {
                                d.push(e);
                            }
                        });
                        return d;
                    });
                }
            };
            j.prototype.getElementsByTagName = g.prototype.getElementsByTagName;
            j.prototype.getElementsByTagNameNS = g.prototype.getElementsByTagNameNS;
            d(g, b);
            function q() {}
            q.prototype.nodeType = C;
            d(q, b);
            function h() {}
            h.prototype = {
                data: "",
                substringData: function(a, b) {
                    return this.data.substring(a, a + b);
                },
                appendData: function(a) {
                    a = this.data + a;
                    this.nodeValue = this.data = a;
                    this.length = a.length;
                },
                insertData: function(a, b) {
                    this.replaceData(a, 0, b);
                },
                appendChild: function(a) {
                    throw new Error(c[Y]);
                },
                deleteData: function(a, b) {
                    this.replaceData(a, b, "");
                },
                replaceData: function(b, c, a) {
                    var d = this.data.substring(0, b);
                    var e = this.data.substring(b + c);
                    a = d + a + e;
                    this.nodeValue = this.data = a;
                    this.length = a.length;
                }
            };
            d(h, b);
            function r() {}
            r.prototype = {
                nodeName: "#text",
                nodeType: D,
                splitText: function(b) {
                    var a = this.data;
                    var d = a.substring(b);
                    a = a.substring(0, b);
                    this.data = this.nodeValue = a;
                    this.length = a.length;
                    var c = this.ownerDocument.createTextNode(d);
                    if (this.parentNode) {
                        this.parentNode.insertBefore(c, this.nextSibling);
                    }
                    return c;
                }
            };
            d(r, h);
            function s() {}
            s.prototype = {
                nodeName: "#comment",
                nodeType: I
            };
            d(s, h);
            function t() {}
            t.prototype = {
                nodeName: "#cdata-section",
                nodeType: E
            };
            d(t, h);
            function n() {}
            n.prototype.nodeType = K;
            d(n, b);
            function u() {}
            u.prototype.nodeType = M;
            d(u, b);
            function v() {}
            v.prototype.nodeType = G;
            d(v, b);
            function w() {}
            w.prototype.nodeType = F;
            d(w, b);
            function o() {}
            o.prototype.nodeName = "#document-fragment";
            o.prototype.nodeType = L;
            d(o, b);
            function x() {}
            x.prototype.nodeType = H;
            d(x, b);
            function y() {}
            y.prototype.serializeToString = function(a, b, c) {
                return av.call(a, b, c);
            };
            b.prototype.toString = av;
            function av(e, f) {
                var d = [];
                var a = (this.nodeType == 9 && this.documentElement) || this;
                var b = a.prefix;
                var c = a.namespaceURI;
                if (c && b == null) {
                    var b = a.lookupPrefix(c);
                    if (b == null) {
                        var g = [
                            {
                                namespace: c,
                                prefix: null
                            }
                        ];
                    }
                }
                ay(this, d, e, f, g);
                return d.join("");
            }
            function aw(b, g, c) {
                var d = b.prefix || "";
                var a = b.namespaceURI;
                if (!a) {
                    return false;
                }
                if ((d === "xml" && a === Q.XML) || a === Q.XMLNS) {
                    return false;
                }
                var e = c.length;
                while(e--){
                    var f = c[e];
                    if (f.prefix === d) {
                        return f.namespace !== a;
                    }
                }
                return true;
            }
            function ax(a, b, c) {
                a.push(" ", b, '="', c.replace(/[<&"]/g, an), '"');
            }
            function ay(a, b, e, k, c) {
                if (!c) {
                    c = [];
                }
                if (k) {
                    a = k(a);
                    if (a) {
                        if (typeof a == "string") {
                            b.push(a);
                            return;
                        }
                    } else {
                        return;
                    }
                }
                switch(a.nodeType){
                    case B:
                        var l = a.attributes;
                        var s = l.length;
                        var d = a.firstChild;
                        var n = a.tagName;
                        e = Q.isHTML(a.namespaceURI) || e;
                        var p = n;
                        if (!e && !a.prefix && a.namespaceURI) {
                            var q;
                            for(var r = 0; r < l.length; r++){
                                if (l.item(r).name === "xmlns") {
                                    q = l.item(r).value;
                                    break;
                                }
                            }
                            if (!q) {
                                for(var g = c.length - 1; g >= 0; g--){
                                    var h = c[g];
                                    if (h.prefix === "" && h.namespace === a.namespaceURI) {
                                        q = h.namespace;
                                        break;
                                    }
                                }
                            }
                            if (q !== a.namespaceURI) {
                                for(var g = c.length - 1; g >= 0; g--){
                                    var h = c[g];
                                    if (h.namespace === a.namespaceURI) {
                                        if (h.prefix) {
                                            p = h.prefix + ":" + n;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        b.push("<", p);
                        for(var i = 0; i < s; i++){
                            var f = l.item(i);
                            if (f.prefix == "xmlns") {
                                c.push({
                                    prefix: f.localName,
                                    namespace: f.value
                                });
                            } else if (f.nodeName == "xmlns") {
                                c.push({
                                    prefix: "",
                                    namespace: f.value
                                });
                            }
                        }
                        for(var i = 0; i < s; i++){
                            var f = l.item(i);
                            if (aw(f, e, c)) {
                                var j = f.prefix || "";
                                var o = f.namespaceURI;
                                ax(b, j ? "xmlns:" + j : "xmlns", o);
                                c.push({
                                    prefix: j,
                                    namespace: o
                                });
                            }
                            ay(f, b, e, k, c);
                        }
                        if (n === p && aw(a, e, c)) {
                            var j = a.prefix || "";
                            var o = a.namespaceURI;
                            ax(b, j ? "xmlns:" + j : "xmlns", o);
                            c.push({
                                prefix: j,
                                namespace: o
                            });
                        }
                        if (d || (e && !/^(?:meta|link|img|br|hr|input)$/i.test(n))) {
                            b.push(">");
                            if (e && /^script$/i.test(n)) {
                                while(d){
                                    if (d.data) {
                                        b.push(d.data);
                                    } else {
                                        ay(d, b, e, k, c.slice());
                                    }
                                    d = d.nextSibling;
                                }
                            } else {
                                while(d){
                                    ay(d, b, e, k, c.slice());
                                    d = d.nextSibling;
                                }
                            }
                            b.push("</", p, ">");
                        } else {
                            b.push("/>");
                        }
                        return;
                    case J:
                    case L:
                        var d = a.firstChild;
                        while(d){
                            ay(d, b, e, k, c.slice());
                            d = d.nextSibling;
                        }
                        return;
                    case C:
                        return ax(b, a.name, a.value);
                    case D:
                        return b.push(a.data.replace(/[<&]/g, an).replace(/]]>/g, "]]&gt;"));
                    case E:
                        return b.push("<![CDATA[", a.data, "]]>");
                    case I:
                        return b.push("<!--", a.data, "-->");
                    case K:
                        var t = a.publicId;
                        var m = a.systemId;
                        b.push("<!DOCTYPE ", a.name);
                        if (t) {
                            b.push(" PUBLIC ", t);
                            if (m && m != ".") {
                                b.push(" ", m);
                            }
                            b.push(">");
                        } else if (m && m != ".") {
                            b.push(" SYSTEM ", m, ">");
                        } else {
                            var u = a.internalSubset;
                            if (u) {
                                b.push(" [", u, "]");
                            }
                            b.push(">");
                        }
                        return;
                    case H:
                        return b.push("<?", a.target, " ", a.data, "?>");
                    case F:
                        return b.push("&", a.nodeName, ";");
                    default:
                        b.push("??", a.nodeName);
                }
            }
            function az(d, b, e) {
                var a;
                switch(b.nodeType){
                    case B:
                        a = b.cloneNode(false);
                        a.ownerDocument = d;
                    case L:
                        break;
                    case C:
                        e = true;
                        break;
                }
                if (!a) {
                    a = b.cloneNode(false);
                }
                a.ownerDocument = d;
                a.parentNode = null;
                if (e) {
                    var c = b.firstChild;
                    while(c){
                        a.appendChild(az(d, c, e));
                        c = c.nextSibling;
                    }
                }
                return a;
            }
            function aA(d, b, e) {
                var a = new b.constructor();
                for(var f in b){
                    var g = b[f];
                    if (typeof g != "object") {
                        if (g != a[f]) {
                            a[f] = g;
                        }
                    }
                }
                if (b.childNodes) {
                    a.childNodes = new i();
                }
                a.ownerDocument = d;
                switch(a.nodeType){
                    case B:
                        var j = b.attributes;
                        var k = (a.attributes = new N());
                        var l = j.length;
                        k._ownerElement = a;
                        for(var h = 0; h < l; h++){
                            a.setAttributeNode(aA(d, j.item(h), true));
                        }
                        break;
                    case C:
                        e = true;
                }
                if (e) {
                    var c = b.firstChild;
                    while(c){
                        a.appendChild(aA(d, c, e));
                        c = c.nextSibling;
                    }
                }
                return a;
            }
            function O(a, b, c) {
                a[b] = c;
            }
            try {
                if (Object.defineProperty) {
                    Object.defineProperty(m.prototype, "length", {
                        get: function() {
                            aj(this);
                            return this.$$length;
                        }
                    });
                    Object.defineProperty(b.prototype, "textContent", {
                        get: function() {
                            return aB(this);
                        },
                        set: function(a) {
                            switch(this.nodeType){
                                case B:
                                case L:
                                    while(this.firstChild){
                                        this.removeChild(this.firstChild);
                                    }
                                    if (a || String(a)) {
                                        this.appendChild(this.ownerDocument.createTextNode(a));
                                    }
                                    break;
                                default:
                                    this.data = a;
                                    this.value = a;
                                    this.nodeValue = a;
                            }
                        }
                    });
                    function aB(a) {
                        switch(a.nodeType){
                            case B:
                            case L:
                                var b = [];
                                a = a.firstChild;
                                while(a){
                                    if (a.nodeType !== 7 && a.nodeType !== 8) {
                                        b.push(aB(a));
                                    }
                                    a = a.nextSibling;
                                }
                                return b.join("");
                            default:
                                return a.nodeValue;
                        }
                    }
                    O = function(a, b, c) {
                        a["$$" + b] = c;
                    };
                }
            } catch (aC) {}
            f.DocumentType = n;
            f.DOMException = l;
            f.DOMImplementation = p;
            f.Element = g;
            f.Node = b;
            f.NodeList = i;
            f.XMLSerializer = y;
        },
        1045: function(d, a, c) {
            var b = c(2167).freeze;
            a.XML_ENTITIES = b({
                amp: "&",
                apos: "'",
                gt: ">",
                lt: "<",
                quot: '"'
            });
            a.HTML_ENTITIES = b({
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
            a.entityMap = a.HTML_ENTITIES;
        },
        3969: function(e, d, a) {
            var b;
            var c = a(1146);
            b = c.DOMImplementation;
            b = c.XMLSerializer;
            d.DOMParser = a(6129).DOMParser;
        },
        6925: function(h, c, f) {
            var i = f(2167).NAMESPACE;
            var b = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
            var d = new RegExp("[\\-\\.0-9" + b.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
            var j = new RegExp("^" + b.source + d.source + "*(?::" + b.source + d.source + "*)?$");
            var k = 0;
            var l = 1;
            var m = 2;
            var n = 3;
            var o = 4;
            var p = 5;
            var q = 6;
            var r = 7;
            function a(b, c) {
                this.message = b;
                this.locator = c;
                if (Error.captureStackTrace) Error.captureStackTrace(this, a);
            }
            a.prototype = new Error();
            a.prototype.name = a.name;
            function e() {}
            e.prototype = {
                parse: function(c, a, d) {
                    var b = this.domBuilder;
                    b.startDocument();
                    y(a, (a = {}));
                    s(c, a, d, b, this.errorHandler);
                    b.endDocument();
                }
            };
            function s(e, H, I, f, k) {
                function N(a) {
                    if (a > 0xffff) {
                        a -= 0x10000;
                        var b = 0xd800 + (a >> 10), c = 0xdc00 + (a & 0x3ff);
                        return String.fromCharCode(b, c);
                    } else {
                        return String.fromCharCode(a);
                    }
                }
                function s(b) {
                    var a = b.slice(1, -1);
                    if (a in I) {
                        return I[a];
                    } else if (a.charAt(0) === "#") {
                        return N(parseInt(a.substr(1).replace("x", "0x")));
                    } else {
                        k.error("entity not found:" + b);
                        return b;
                    }
                }
                function y(a) {
                    if (a > m) {
                        var b = e.substring(m, a).replace(/&#?\w+;/g, s);
                        l && o(m);
                        f.characters(b, 0, a - m);
                        m = a;
                    }
                }
                function o(b, a) {
                    while(b >= P && (a = Q.exec(e))){
                        O = a.index;
                        P = O + a[0].length;
                        l.lineNumber++;
                    }
                    l.columnNumber = b - O + 1;
                }
                var O = 0;
                var P = 0;
                var Q = /.*(?:\r\n?|\n)|.*$/g;
                var l = f.locator;
                var n = [
                    {
                        currentNSMap: H
                    }
                ];
                var J = {};
                var m = 0;
                while(true){
                    try {
                        var b = e.indexOf("<", m);
                        if (b < 0) {
                            if (!e.substr(m).match(/^\s*$/)) {
                                var B = f.doc;
                                var C = B.createTextNode(e.substr(m));
                                B.appendChild(C);
                                f.currentElement = C;
                            }
                            return;
                        }
                        if (b > m) {
                            y(b);
                        }
                        switch(e.charAt(b + 1)){
                            case "/":
                                var c = e.indexOf(">", b + 3);
                                var h = e.substring(b + 2, c).replace(/[ \t\n\r]+$/g, "");
                                var j = n.pop();
                                if (c < 0) {
                                    h = e.substring(b + 2).replace(/[\s<].*/, "");
                                    k.error("end tag name: " + h + " is not complete:" + j.tagName);
                                    c = b + 1 + h.length;
                                } else if (h.match(/\s</)) {
                                    h = h.replace(/[\s<].*/, "");
                                    k.error("end tag name: " + h + " maybe not complete");
                                    c = b + 1 + h.length;
                                }
                                var D = j.localNSMap;
                                var E = j.tagName == h;
                                var K = E || (j.tagName && j.tagName.toLowerCase() == h.toLowerCase());
                                if (K) {
                                    f.endElement(j.uri, j.localName, h);
                                    if (D) {
                                        for(var L in D){
                                            f.endPrefixMapping(L);
                                        }
                                    }
                                    if (!E) {
                                        k.fatalError("end tag name: " + h + " is not match the current start tagName:" + j.tagName);
                                    }
                                } else {
                                    n.push(j);
                                }
                                c++;
                                break;
                            case "?":
                                l && o(b);
                                c = A(e, b, f);
                                break;
                            case "!":
                                l && o(b);
                                c = z(e, b, f, k);
                                break;
                            default:
                                l && o(b);
                                var d = new g();
                                var p = n[n.length - 1].currentNSMap;
                                var c = u(e, b, d, p, s, k);
                                var F = d.length;
                                if (!d.closed && x(e, c, d.tagName, J)) {
                                    d.closed = true;
                                    if (!I.nbsp) {
                                        k.warning("unclosed xml attribute");
                                    }
                                }
                                if (l && F) {
                                    var M = t(l, {});
                                    for(var q = 0; q < F; q++){
                                        var G = d[q];
                                        o(G.offset);
                                        G.locator = t(l, {});
                                    }
                                    f.locator = M;
                                    if (v(d, f, p)) {
                                        n.push(d);
                                    }
                                    f.locator = l;
                                } else {
                                    if (v(d, f, p)) {
                                        n.push(d);
                                    }
                                }
                                if (i.isHTML(d.uri) && !d.closed) {
                                    c = w(e, c, d.tagName, s, f);
                                } else {
                                    c++;
                                }
                        }
                    } catch (r) {
                        if (r instanceof a) {
                            throw r;
                        }
                        k.error("element parse error: " + r);
                        c = -1;
                    }
                    if (c > m) {
                        m = c;
                    } else {
                        y(Math.max(b, m) + 1);
                    }
                }
            }
            function t(b, a) {
                a.lineNumber = b.lineNumber;
                a.columnNumber = b.columnNumber;
                return a;
            }
            function u(f, a, h, u, t, g) {
                function j(a, b, c) {
                    if (h.attributeNames.hasOwnProperty(a)) {
                        g.fatalError("Attribute " + a + " redefined");
                    }
                    h.addValue(a, b, c);
                }
                var e;
                var d;
                var c = ++a;
                var b = k;
                while(true){
                    var s = f.charAt(c);
                    switch(s){
                        case "=":
                            if (b === l) {
                                e = f.slice(a, c);
                                b = n;
                            } else if (b === m) {
                                b = n;
                            } else {
                                throw new Error("attribute equal must after attrName");
                            }
                            break;
                        case "'":
                        case '"':
                            if (b === n || b === l) {
                                if (b === l) {
                                    g.warning('attribute value must after "="');
                                    e = f.slice(a, c);
                                }
                                a = c + 1;
                                c = f.indexOf(s, a);
                                if (c > 0) {
                                    d = f.slice(a, c).replace(/&#?\w+;/g, t);
                                    j(e, d, a - 1);
                                    b = p;
                                } else {
                                    throw new Error("attribute value no end '" + s + "' match");
                                }
                            } else if (b == o) {
                                d = f.slice(a, c).replace(/&#?\w+;/g, t);
                                j(e, d, a);
                                g.warning('attribute "' + e + '" missed start quot(' + s + ")!!");
                                a = c + 1;
                                b = p;
                            } else {
                                throw new Error('attribute value must after "="');
                            }
                            break;
                        case "/":
                            switch(b){
                                case k:
                                    h.setTagName(f.slice(a, c));
                                case p:
                                case q:
                                case r:
                                    b = r;
                                    h.closed = true;
                                case o:
                                case l:
                                case m:
                                    break;
                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;
                        case "":
                            g.error("unexpected end of input");
                            if (b == k) {
                                h.setTagName(f.slice(a, c));
                            }
                            return c;
                        case ">":
                            switch(b){
                                case k:
                                    h.setTagName(f.slice(a, c));
                                case p:
                                case q:
                                case r:
                                    break;
                                case o:
                                case l:
                                    d = f.slice(a, c);
                                    if (d.slice(-1) === "/") {
                                        h.closed = true;
                                        d = d.slice(0, -1);
                                    }
                                case m:
                                    if (b === m) {
                                        d = e;
                                    }
                                    if (b == o) {
                                        g.warning('attribute "' + d + '" missed quot(")!');
                                        j(e, d.replace(/&#?\w+;/g, t), a);
                                    } else {
                                        if (!i.isHTML(u[""]) || !d.match(/^(?:disabled|checked|selected)$/i)) {
                                            g.warning('attribute "' + d + '" missed value!! "' + d + '" instead!!');
                                        }
                                        j(d, d, a);
                                    }
                                    break;
                                case n:
                                    throw new Error("attribute value missed!!");
                            }
                            return c;
                        case "\u0080":
                            s = " ";
                        default:
                            if (s <= " ") {
                                switch(b){
                                    case k:
                                        h.setTagName(f.slice(a, c));
                                        b = q;
                                        break;
                                    case l:
                                        e = f.slice(a, c);
                                        b = m;
                                        break;
                                    case o:
                                        var d = f.slice(a, c).replace(/&#?\w+;/g, t);
                                        g.warning('attribute "' + d + '" missed quot(")!!');
                                        j(e, d, a);
                                    case p:
                                        b = q;
                                        break;
                                }
                            } else {
                                switch(b){
                                    case m:
                                        var v = h.tagName;
                                        if (!i.isHTML(u[""]) || !e.match(/^(?:disabled|checked|selected)$/i)) {
                                            g.warning('attribute "' + e + '" missed value!! "' + e + '" instead2!!');
                                        }
                                        j(e, e, a);
                                        a = c;
                                        b = l;
                                        break;
                                    case p:
                                        g.warning('attribute space is required"' + e + '"!!');
                                    case q:
                                        b = l;
                                        a = c;
                                        break;
                                    case n:
                                        b = o;
                                        a = c;
                                        break;
                                    case r:
                                        throw new Error("elements closed character '/' and '>' must be connected to");
                                }
                            }
                    }
                    c++;
                }
            }
            function v(a, m, f) {
                var g = a.tagName;
                var h = null;
                var j = a.length;
                while(j--){
                    var c = a[j];
                    var k = c.qName;
                    var n = c.value;
                    var d = k.indexOf(":");
                    if (d > 0) {
                        var b = (c.prefix = k.slice(0, d));
                        var e = k.slice(d + 1);
                        var l = b === "xmlns" && e;
                    } else {
                        e = k;
                        b = null;
                        l = k === "xmlns" && "";
                    }
                    c.localName = e;
                    if (l !== false) {
                        if (h == null) {
                            h = {};
                            y(f, (f = {}));
                        }
                        f[l] = h[l] = n;
                        c.uri = i.XMLNS;
                        m.startPrefixMapping(l, n);
                    }
                }
                var j = a.length;
                while(j--){
                    c = a[j];
                    var b = c.prefix;
                    if (b) {
                        if (b === "xml") {
                            c.uri = i.XML;
                        }
                        if (b !== "xmlns") {
                            c.uri = f[b || ""];
                        }
                    }
                }
                var d = g.indexOf(":");
                if (d > 0) {
                    b = a.prefix = g.slice(0, d);
                    e = a.localName = g.slice(d + 1);
                } else {
                    b = null;
                    e = a.localName = g;
                }
                var o = (a.uri = f[b || ""]);
                m.startElement(o, e, g, a);
                if (a.closed) {
                    m.endElement(o, e, g);
                    if (h) {
                        for(b in h){
                            m.endPrefixMapping(b);
                        }
                    }
                } else {
                    a.currentNSMap = f;
                    a.localNSMap = h;
                    return true;
                }
            }
            function w(e, b, c, g, f) {
                if (/^(?:script|textarea)$/i.test(c)) {
                    var d = e.indexOf("</" + c + ">", b);
                    var a = e.substring(b + 1, d);
                    if (/[&<]/.test(a)) {
                        if (/^script$/i.test(c)) {
                            f.characters(a, 0, a.length);
                            return d;
                        }
                        a = a.replace(/&#?\w+;/g, g);
                        f.characters(a, 0, a.length);
                        return d;
                    }
                }
                return b + 1;
            }
            function x(c, d, b, e) {
                var a = e[b];
                if (a == null) {
                    a = c.lastIndexOf("</" + b + ">");
                    if (a < d) {
                        a = c.lastIndexOf("</" + b);
                    }
                    e[b] = a;
                }
                return a < d;
            }
            function y(a, c) {
                for(var b in a){
                    c[b] = a[b];
                }
            }
            function z(c, a, d, j) {
                var k = c.charAt(a + 2);
                switch(k){
                    case "-":
                        if (c.charAt(a + 3) === "-") {
                            var e = c.indexOf("-->", a + 4);
                            if (e > a) {
                                d.comment(c, a + 4, e - a - 4);
                                return e + 3;
                            } else {
                                j.error("Unclosed comment");
                                return -1;
                            }
                        } else {
                            return -1;
                        }
                    default:
                        if (c.substr(a + 3, 6) == "CDATA[") {
                            var e = c.indexOf("]]>", a + 9);
                            d.startCDATA();
                            d.characters(c, a + 9, e - a - 9);
                            d.endCDATA();
                            return e + 3;
                        }
                        var b = B(c, a);
                        var f = b.length;
                        if (f > 1 && /!doctype/i.test(b[0][0])) {
                            var l = b[1][0];
                            var h = false;
                            var g = false;
                            if (f > 3) {
                                if (/^public$/i.test(b[2][0])) {
                                    h = b[3][0];
                                    g = f > 4 && b[4][0];
                                } else if (/^system$/i.test(b[2][0])) {
                                    g = b[3][0];
                                }
                            }
                            var i = b[f - 1];
                            d.startDTD(l, h, g);
                            d.endDTD();
                            return i.index + i[0].length;
                        }
                }
                return -1;
            }
            function A(c, d, e) {
                var b = c.indexOf("?>", d);
                if (b) {
                    var a = c.substring(d, b).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (a) {
                        var f = a[0].length;
                        e.processingInstruction(a[1], a[2]);
                        return b + 2;
                    } else {
                        return -1;
                    }
                }
                return -1;
            }
            function g() {
                this.attributeNames = {};
            }
            g.prototype = {
                setTagName: function(a) {
                    if (!j.test(a)) {
                        throw new Error("invalid tagName:" + a);
                    }
                    this.tagName = a;
                },
                addValue: function(a, b, c) {
                    if (!j.test(a)) {
                        throw new Error("invalid attribute:" + a);
                    }
                    this.attributeNames[a] = this.length;
                    this[this.length++] = {
                        qName: a,
                        value: b,
                        offset: c
                    };
                },
                length: 0,
                getLocalName: function(a) {
                    return this[a].localName;
                },
                getLocator: function(a) {
                    return this[a].locator;
                },
                getQName: function(a) {
                    return this[a].qName;
                },
                getURI: function(a) {
                    return this[a].uri;
                },
                getValue: function(a) {
                    return this[a].value;
                }
            };
            function B(c, e) {
                var a;
                var d = [];
                var b = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                b.lastIndex = e;
                b.exec(c);
                while((a = b.exec(c))){
                    d.push(a);
                    if (a[1]) return d;
                }
            }
            c.XMLReader = e;
            c.ParseError = a;
        },
        9144: function(d, f, b) {
            var c = typeof b.g !== "undefined" ? b.g : typeof window !== "undefined" ? window : {};
            var e = b(7579);
            var a;
            if (typeof document !== "undefined") {
                a = document;
            } else {
                a = c["__GLOBAL_DOCUMENT_CACHE@4"];
                if (!a) {
                    a = c["__GLOBAL_DOCUMENT_CACHE@4"] = e;
                }
            }
            d.exports = a;
        },
        8908: function(c, d, b) {
            var a;
            if (typeof window !== "undefined") {
                a = window;
            } else if (typeof b.g !== "undefined") {
                a = b.g;
            } else if (typeof self !== "undefined") {
                a = self;
            } else {
                a = {};
            }
            c.exports = a;
        },
        7376: function(a) {
            a.exports = c;
            var b = Object.prototype.toString;
            function c(a) {
                if (!a) {
                    return false;
                }
                var c = b.call(a);
                return (c === "[object Function]" || (typeof a === "function" && c !== "[object RegExp]") || (typeof window !== "undefined" && (a === window.setTimeout || a === window.alert || a === window.confirm || a === window.prompt)));
            }
        },
        7537: function(g, c) {
            function d(a) {
                if (a && "object" === typeof a) {
                    var f = a.which || a.keyCode || a.charCode;
                    if (f) a = f;
                }
                if ("number" === typeof a) return h[a];
                var d = String(a);
                var c = b[d.toLowerCase()];
                if (c) return c;
                var c = e[d.toLowerCase()];
                if (c) return c;
                if (d.length === 1) return d.charCodeAt(0);
                return undefined;
            }
            d.isEventKey = function g(a, c) {
                if (a && "object" === typeof a) {
                    var d = a.which || a.keyCode || a.charCode;
                    if (d === null || d === undefined) {
                        return false;
                    }
                    if (typeof c === "string") {
                        var f = b[c.toLowerCase()];
                        if (f) {
                            return f === d;
                        }
                        var f = e[c.toLowerCase()];
                        if (f) {
                            return f === d;
                        }
                    } else if (typeof c === "number") {
                        return c === d;
                    }
                    return false;
                }
            };
            c = g.exports = d;
            var b = (c.code = c.codes = {
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
            var e = (c.aliases = {
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
            for(a = 97; a < 123; a++)b[String.fromCharCode(a)] = a - 32;
            for(var a = 48; a < 58; a++)b[a - 48] = a;
            for(a = 1; a < 13; a++)b["f" + a] = a + 111;
            for(a = 0; a < 10; a++)b["numpad " + a] = a + 96;
            var h = (c.names = c.title = {});
            for(a in b)h[b[a]] = a;
            for(var f in e){
                b[f] = e[f];
            }
        },
        9323: function(d, c, a) {
            "use strict";
            a.d(c, {
                _b: function() {
                    return r;
                }
            });
            var e = a(4578);
            var b = (function() {
                function b() {
                    this.listeners = {};
                }
                var a = b.prototype;
                a.on = function c(a, b) {
                    if (!this.listeners[a]) {
                        this.listeners[a] = [];
                    }
                    this.listeners[a].push(b);
                };
                a.off = function d(a, c) {
                    if (!this.listeners[a]) {
                        return false;
                    }
                    var b = this.listeners[a].indexOf(c);
                    this.listeners[a] = this.listeners[a].slice(0);
                    this.listeners[a].splice(b, 1);
                    return b > -1;
                };
                a.trigger = function h(d) {
                    var a = this.listeners[d];
                    if (!a) {
                        return;
                    }
                    if (arguments.length === 2) {
                        var e = a.length;
                        for(var b = 0; b < e; ++b){
                            a[b].call(this, arguments[1]);
                        }
                    } else {
                        var f = Array.prototype.slice.call(arguments, 1);
                        var g = a.length;
                        for(var c = 0; c < g; ++c){
                            a[c].apply(this, f);
                        }
                    }
                };
                a.dispose = function a() {
                    this.listeners = {};
                };
                a.pipe = function a(b) {
                    this.on("data", function(a) {
                        b.push(a);
                    });
                };
                return b;
            })();
            var f = a(7462);
            var g = a(7326);
            var h = a(6722);
            var i = (function(b) {
                (0, e.Z)(a, b);
                function a() {
                    var a;
                    a = b.call(this) || this;
                    a.buffer = "";
                    return a;
                }
                var c = a.prototype;
                c.push = function c(b) {
                    var a;
                    this.buffer += b;
                    a = this.buffer.indexOf("\n");
                    for(; a > -1; a = this.buffer.indexOf("\n")){
                        this.trigger("data", this.buffer.substring(0, a));
                        this.buffer = this.buffer.substring(a + 1);
                    }
                };
                return a;
            })(b);
            var j = String.fromCharCode(0x09);
            var k = function d(c) {
                var a = /([0-9.]*)?@?([0-9.]*)?/.exec(c || "");
                var b = {};
                if (a[1]) {
                    b.length = parseInt(a[1], 10);
                }
                if (a[2]) {
                    b.offset = parseInt(a[2], 10);
                }
                return b;
            };
            var l = function d() {
                var a = "[^=]*";
                var b = '"[^"]*"|[^,]*';
                var c = "(?:" + a + ")=(?:" + b + ")";
                return new RegExp("(?:^|,)(" + c + ")");
            };
            var m = function f(e) {
                var b = e.split(l());
                var d = {};
                var c = b.length;
                var a;
                while(c--){
                    if (b[c] === "") {
                        continue;
                    }
                    a = /([^=]*)=(.*)/.exec(b[c]).slice(1);
                    a[0] = a[0].replace(/^\s+|\s+$/g, "");
                    a[1] = a[1].replace(/^\s+|\s+$/g, "");
                    a[1] = a[1].replace(/^['"](.*)['"]$/g, "$1");
                    d[a[0]] = a[1];
                }
                return d;
            };
            var n = (function(c) {
                (0, e.Z)(b, c);
                function b() {
                    var a;
                    a = c.call(this) || this;
                    a.customParsers = [];
                    a.tagMappers = [];
                    return a;
                }
                var a = b.prototype;
                a.push = function c(a) {
                    var d = this;
                    var e;
                    var g;
                    a = a.trim();
                    if (a.length === 0) {
                        return;
                    }
                    if (a[0] !== "#") {
                        this.trigger("data", {
                            type: "uri",
                            uri: a
                        });
                        return;
                    }
                    var b = this.tagMappers.reduce(function(b, d) {
                        var c = d(a);
                        if (c === a) {
                            return b;
                        }
                        return b.concat([
                            c
                        ]);
                    }, [
                        a
                    ]);
                    b.forEach(function(a) {
                        for(var h = 0; h < d.customParsers.length; h++){
                            if (d.customParsers[h].call(d, a)) {
                                return;
                            }
                        }
                        if (a.indexOf("#EXT") !== 0) {
                            d.trigger("data", {
                                type: "comment",
                                text: a.slice(1)
                            });
                            return;
                        }
                        a = a.replace("\r", "");
                        e = /^#EXTM3U/.exec(a);
                        if (e) {
                            d.trigger("data", {
                                type: "tag",
                                tagType: "m3u"
                            });
                            return;
                        }
                        e = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "inf"
                            };
                            if (e[1]) {
                                g.duration = parseFloat(e[1]);
                            }
                            if (e[2]) {
                                g.title = e[2];
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "targetduration"
                            };
                            if (e[1]) {
                                g.duration = parseInt(e[1], 10);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "version"
                            };
                            if (e[1]) {
                                g.version = parseInt(e[1], 10);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "media-sequence"
                            };
                            if (e[1]) {
                                g.number = parseInt(e[1], 10);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "discontinuity-sequence"
                            };
                            if (e[1]) {
                                g.number = parseInt(e[1], 10);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "playlist-type"
                            };
                            if (e[1]) {
                                g.playlistType = e[1];
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(a);
                        if (e) {
                            g = (0, f.Z)(k(e[1]), {
                                type: "tag",
                                tagType: "byterange"
                            });
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "allow-cache"
                            };
                            if (e[1]) {
                                g.allowed = !/NO/.test(e[1]);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-MAP:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "map"
                            };
                            if (e[1]) {
                                var b = m(e[1]);
                                if (b.URI) {
                                    g.uri = b.URI;
                                }
                                if (b.BYTERANGE) {
                                    g.byterange = k(b.BYTERANGE);
                                }
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-STREAM-INF:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "stream-inf"
                            };
                            if (e[1]) {
                                g.attributes = m(e[1]);
                                if (g.attributes.RESOLUTION) {
                                    var c = g.attributes.RESOLUTION.split("x");
                                    var i = {};
                                    if (c[0]) {
                                        i.width = parseInt(c[0], 10);
                                    }
                                    if (c[1]) {
                                        i.height = parseInt(c[1], 10);
                                    }
                                    g.attributes.RESOLUTION = i;
                                }
                                if (g.attributes.BANDWIDTH) {
                                    g.attributes.BANDWIDTH = parseInt(g.attributes.BANDWIDTH, 10);
                                }
                                if (g.attributes["PROGRAM-ID"]) {
                                    g.attributes["PROGRAM-ID"] = parseInt(g.attributes["PROGRAM-ID"], 10);
                                }
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-MEDIA:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "media"
                            };
                            if (e[1]) {
                                g.attributes = m(e[1]);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-ENDLIST/.exec(a);
                        if (e) {
                            d.trigger("data", {
                                type: "tag",
                                tagType: "endlist"
                            });
                            return;
                        }
                        e = /^#EXT-X-DISCONTINUITY/.exec(a);
                        if (e) {
                            d.trigger("data", {
                                type: "tag",
                                tagType: "discontinuity"
                            });
                            return;
                        }
                        e = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "program-date-time"
                            };
                            if (e[1]) {
                                g.dateTimeString = e[1];
                                g.dateTimeObject = new Date(e[1]);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-KEY:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "key"
                            };
                            if (e[1]) {
                                g.attributes = m(e[1]);
                                if (g.attributes.IV) {
                                    if (g.attributes.IV.substring(0, 2).toLowerCase() === "0x") {
                                        g.attributes.IV = g.attributes.IV.substring(2);
                                    }
                                    g.attributes.IV = g.attributes.IV.match(/.{8}/g);
                                    g.attributes.IV[0] = parseInt(g.attributes.IV[0], 16);
                                    g.attributes.IV[1] = parseInt(g.attributes.IV[1], 16);
                                    g.attributes.IV[2] = parseInt(g.attributes.IV[2], 16);
                                    g.attributes.IV[3] = parseInt(g.attributes.IV[3], 16);
                                    g.attributes.IV = new Uint32Array(g.attributes.IV);
                                }
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-START:?(.*)$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "start"
                            };
                            if (e[1]) {
                                g.attributes = m(e[1]);
                                g.attributes["TIME-OFFSET"] = parseFloat(g.attributes["TIME-OFFSET"]);
                                g.attributes.PRECISE = /YES/.test(g.attributes.PRECISE);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "cue-out-cont"
                            };
                            if (e[1]) {
                                g.data = e[1];
                            } else {
                                g.data = "";
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "cue-out"
                            };
                            if (e[1]) {
                                g.data = e[1];
                            } else {
                                g.data = "";
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-CUE-IN:?(.*)?$/.exec(a);
                        if (e) {
                            g = {
                                type: "tag",
                                tagType: "cue-in"
                            };
                            if (e[1]) {
                                g.data = e[1];
                            } else {
                                g.data = "";
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-SKIP:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "skip"
                            };
                            g.attributes = m(e[1]);
                            if (g.attributes.hasOwnProperty("SKIPPED-SEGMENTS")) {
                                g.attributes["SKIPPED-SEGMENTS"] = parseInt(g.attributes["SKIPPED-SEGMENTS"], 10);
                            }
                            if (g.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES")) {
                                g.attributes["RECENTLY-REMOVED-DATERANGES"] = g.attributes["RECENTLY-REMOVED-DATERANGES"].split(j);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-PART:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "part"
                            };
                            g.attributes = m(e[1]);
                            [
                                "DURATION"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = parseFloat(g.attributes[a]);
                                }
                            });
                            [
                                "INDEPENDENT",
                                "GAP"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = /YES/.test(g.attributes[a]);
                                }
                            });
                            if (g.attributes.hasOwnProperty("BYTERANGE")) {
                                g.attributes.byterange = k(g.attributes.BYTERANGE);
                            }
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "server-control"
                            };
                            g.attributes = m(e[1]);
                            [
                                "CAN-SKIP-UNTIL",
                                "PART-HOLD-BACK",
                                "HOLD-BACK", 
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = parseFloat(g.attributes[a]);
                                }
                            });
                            [
                                "CAN-SKIP-DATERANGES",
                                "CAN-BLOCK-RELOAD"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = /YES/.test(g.attributes[a]);
                                }
                            });
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-PART-INF:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "part-inf"
                            };
                            g.attributes = m(e[1]);
                            [
                                "PART-TARGET"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = parseFloat(g.attributes[a]);
                                }
                            });
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "preload-hint"
                            };
                            g.attributes = m(e[1]);
                            [
                                "BYTERANGE-START",
                                "BYTERANGE-LENGTH"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = parseInt(g.attributes[a], 10);
                                    var b = a === "BYTERANGE-LENGTH" ? "length" : "offset";
                                    g.attributes.byterange = g.attributes.byterange || {};
                                    g.attributes.byterange[b] = g.attributes[a];
                                    delete g.attributes[a];
                                }
                            });
                            d.trigger("data", g);
                            return;
                        }
                        e = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(a);
                        if (e && e[1]) {
                            g = {
                                type: "tag",
                                tagType: "rendition-report"
                            };
                            g.attributes = m(e[1]);
                            [
                                "LAST-MSN",
                                "LAST-PART"
                            ].forEach(function(a) {
                                if (g.attributes.hasOwnProperty(a)) {
                                    g.attributes[a] = parseInt(g.attributes[a], 10);
                                }
                            });
                            d.trigger("data", g);
                            return;
                        }
                        d.trigger("data", {
                            type: "tag",
                            data: a.slice(4)
                        });
                    });
                };
                a.addParser = function c(a) {
                    var d = this;
                    var e = a.expression, f = a.customType, b = a.dataParser, g = a.segment;
                    if (typeof b !== "function") {
                        b = function b(a) {
                            return a;
                        };
                    }
                    this.customParsers.push(function(a) {
                        var c = e.exec(a);
                        if (c) {
                            d.trigger("data", {
                                type: "custom",
                                data: b(a),
                                customType: f,
                                segment: g
                            });
                            return true;
                        }
                    });
                };
                a.addTagMapper = function c(a) {
                    var d = a.expression, e = a.map;
                    var b = function b(a) {
                        if (d.test(a)) {
                            return e(a);
                        }
                        return a;
                    };
                    this.tagMappers.push(b);
                };
                return b;
            })(b);
            var o = function b(a) {
                return a.toLowerCase().replace(/-(\w)/g, function(a) {
                    return a[1].toUpperCase();
                });
            };
            var p = function c(a) {
                var b = {};
                Object.keys(a).forEach(function(c) {
                    b[o(c)] = a[c];
                });
                return b;
            };
            var q = function j(g) {
                var a = g.serverControl, h = g.targetDuration, d = g.partTargetDuration;
                if (!a) {
                    return;
                }
                var f = "#EXT-X-SERVER-CONTROL";
                var e = "holdBack";
                var b = "partHoldBack";
                var c = h && h * 3;
                var i = d && d * 2;
                if (h && !a.hasOwnProperty(e)) {
                    a[e] = c;
                    this.trigger("info", {
                        message: f + " defaulting HOLD-BACK to targetDuration * 3 (" + c + ")."
                    });
                }
                if (c && a[e] < c) {
                    this.trigger("warn", {
                        message: f + " clamping HOLD-BACK (" + a[e] + ") to targetDuration * 3 (" + c + ")"
                    });
                    a[e] = c;
                }
                if (d && !a.hasOwnProperty(b)) {
                    a[b] = d * 3;
                    this.trigger("info", {
                        message: f + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + a[b] + ")."
                    });
                }
                if (d && a[b] < i) {
                    this.trigger("warn", {
                        message: f + " clamping PART-HOLD-BACK (" + a[b] + ") to partTargetDuration * 2 (" + i + ")."
                    });
                    a[b] = i;
                }
            };
            var r = (function(c) {
                (0, e.Z)(b, c);
                function b() {
                    var a;
                    a = c.call(this) || this;
                    a.lineStream = new i();
                    a.parseStream = new n();
                    a.lineStream.pipe(a.parseStream);
                    var b = (0, g.Z)(a);
                    var d = [];
                    var e = {};
                    var j;
                    var k;
                    var l = false;
                    var m = function a() {};
                    var o = {
                        AUDIO: {},
                        VIDEO: {},
                        "CLOSED-CAPTIONS": {},
                        SUBTITLES: {}
                    };
                    var r = "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed";
                    var s = 0;
                    a.manifest = {
                        allowCache: true,
                        discontinuityStarts: [],
                        segments: []
                    };
                    var t = 0;
                    var u = 0;
                    a.on("end", function() {
                        if (e.uri || (!e.parts && !e.preloadHints)) {
                            return;
                        }
                        if (!e.map && j) {
                            e.map = j;
                        }
                        if (!e.key && k) {
                            e.key = k;
                        }
                        if (!e.timeline && typeof s === "number") {
                            e.timeline = s;
                        }
                        a.manifest.preloadSegment = e;
                    });
                    a.parseStream.on("data", function(a) {
                        var c;
                        var g;
                        ({
                            tag: function i() {
                                (({
                                    version: function b() {
                                        if (a.version) {
                                            this.manifest.version = a.version;
                                        }
                                    },
                                    "allow-cache": function b() {
                                        this.manifest.allowCache = a.allowed;
                                        if (!("allowed" in a)) {
                                            this.trigger("info", {
                                                message: "defaulting allowCache to YES"
                                            });
                                            this.manifest.allowCache = true;
                                        }
                                    },
                                    byterange: function b() {
                                        var b = {};
                                        if ("length" in a) {
                                            e.byterange = b;
                                            b.length = a.length;
                                            if (!("offset" in a)) {
                                                a.offset = t;
                                            }
                                        }
                                        if ("offset" in a) {
                                            e.byterange = b;
                                            b.offset = a.offset;
                                        }
                                        t = b.offset + b.length;
                                    },
                                    endlist: function a() {
                                        this.manifest.endList = true;
                                    },
                                    inf: function b() {
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
                                        if (a.duration > 0) {
                                            e.duration = a.duration;
                                        }
                                        if (a.duration === 0) {
                                            e.duration = 0.01;
                                            this.trigger("info", {
                                                message: "updating zero segment duration to a small value"
                                            });
                                        }
                                        this.manifest.segments = d;
                                    },
                                    key: function c() {
                                        if (!a.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without attribute list"
                                            });
                                            return;
                                        }
                                        if (a.attributes.METHOD === "NONE") {
                                            k = null;
                                            return;
                                        }
                                        if (!a.attributes.URI) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without URI"
                                            });
                                            return;
                                        }
                                        if (a.attributes.KEYFORMAT === "com.apple.streamingkeydelivery") {
                                            this.manifest.contentProtection = this.manifest.contentProtection || {};
                                            this.manifest.contentProtection["com.apple.fps.1_0"] = {
                                                attributes: a.attributes
                                            };
                                            return;
                                        }
                                        if (a.attributes.KEYFORMAT === r) {
                                            var b = [
                                                "SAMPLE-AES",
                                                "SAMPLE-AES-CTR",
                                                "SAMPLE-AES-CENC", 
                                            ];
                                            if (b.indexOf(a.attributes.METHOD) === -1) {
                                                this.trigger("warn", {
                                                    message: "invalid key method provided for Widevine"
                                                });
                                                return;
                                            }
                                            if (a.attributes.METHOD === "SAMPLE-AES-CENC") {
                                                this.trigger("warn", {
                                                    message: "SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead"
                                                });
                                            }
                                            if (a.attributes.URI.substring(0, 23) !== "data:text/plain;base64,") {
                                                this.trigger("warn", {
                                                    message: "invalid key URI provided for Widevine"
                                                });
                                                return;
                                            }
                                            if (!(a.attributes.KEYID && a.attributes.KEYID.substring(0, 2) === "0x")) {
                                                this.trigger("warn", {
                                                    message: "invalid key ID provided for Widevine"
                                                });
                                                return;
                                            }
                                            this.manifest.contentProtection = this.manifest.contentProtection || {};
                                            this.manifest.contentProtection["com.widevine.alpha"] = {
                                                attributes: {
                                                    schemeIdUri: a.attributes.KEYFORMAT,
                                                    keyId: a.attributes.KEYID.substring(2)
                                                },
                                                pssh: (0, h.Z)(a.attributes.URI.split(",")[1])
                                            };
                                            return;
                                        }
                                        if (!a.attributes.METHOD) {
                                            this.trigger("warn", {
                                                message: "defaulting key method to AES-128"
                                            });
                                        }
                                        k = {
                                            method: a.attributes.METHOD || "AES-128",
                                            uri: a.attributes.URI
                                        };
                                        if (typeof a.attributes.IV !== "undefined") {
                                            k.iv = a.attributes.IV;
                                        }
                                    },
                                    "media-sequence": function b() {
                                        if (!isFinite(a.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid media sequence: " + a.number
                                            });
                                            return;
                                        }
                                        this.manifest.mediaSequence = a.number;
                                    },
                                    "discontinuity-sequence": function b() {
                                        if (!isFinite(a.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid discontinuity sequence: " + a.number
                                            });
                                            return;
                                        }
                                        this.manifest.discontinuitySequence = a.number;
                                        s = a.number;
                                    },
                                    "playlist-type": function b() {
                                        if (!/VOD|EVENT/.test(a.playlistType)) {
                                            this.trigger("warn", {
                                                message: "ignoring unknown playlist type: " + a.playlist
                                            });
                                            return;
                                        }
                                        this.manifest.playlistType = a.playlistType;
                                    },
                                    map: function b() {
                                        j = {};
                                        if (a.uri) {
                                            j.uri = a.uri;
                                        }
                                        if (a.byterange) {
                                            j.byterange = a.byterange;
                                        }
                                        if (k) {
                                            j.key = k;
                                        }
                                    },
                                    "stream-inf": function b() {
                                        this.manifest.playlists = d;
                                        this.manifest.mediaGroups = this.manifest.mediaGroups || o;
                                        if (!a.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring empty stream-inf attributes"
                                            });
                                            return;
                                        }
                                        if (!e.attributes) {
                                            e.attributes = {};
                                        }
                                        (0, f.Z)(e.attributes, a.attributes);
                                    },
                                    media: function d() {
                                        this.manifest.mediaGroups = this.manifest.mediaGroups || o;
                                        if (!(a.attributes && a.attributes.TYPE && a.attributes["GROUP-ID"] && a.attributes.NAME)) {
                                            this.trigger("warn", {
                                                message: "ignoring incomplete or missing media group"
                                            });
                                            return;
                                        }
                                        var b = this.manifest.mediaGroups[a.attributes.TYPE];
                                        b[a.attributes["GROUP-ID"]] = b[a.attributes["GROUP-ID"]] || {};
                                        c = b[a.attributes["GROUP-ID"]];
                                        g = {
                                            default: /yes/i.test(a.attributes.DEFAULT)
                                        };
                                        if (g.default) {
                                            g.autoselect = true;
                                        } else {
                                            g.autoselect = /yes/i.test(a.attributes.AUTOSELECT);
                                        }
                                        if (a.attributes.LANGUAGE) {
                                            g.language = a.attributes.LANGUAGE;
                                        }
                                        if (a.attributes.URI) {
                                            g.uri = a.attributes.URI;
                                        }
                                        if (a.attributes["INSTREAM-ID"]) {
                                            g.instreamId = a.attributes["INSTREAM-ID"];
                                        }
                                        if (a.attributes.CHARACTERISTICS) {
                                            g.characteristics = a.attributes.CHARACTERISTICS;
                                        }
                                        if (a.attributes.FORCED) {
                                            g.forced = /yes/i.test(a.attributes.FORCED);
                                        }
                                        c[a.attributes.NAME] = g;
                                    },
                                    discontinuity: function a() {
                                        s += 1;
                                        e.discontinuity = true;
                                        this.manifest.discontinuityStarts.push(d.length);
                                    },
                                    "program-date-time": function b() {
                                        if (typeof this.manifest.dateTimeString === "undefined") {
                                            this.manifest.dateTimeString = a.dateTimeString;
                                            this.manifest.dateTimeObject = a.dateTimeObject;
                                        }
                                        e.dateTimeString = a.dateTimeString;
                                        e.dateTimeObject = a.dateTimeObject;
                                    },
                                    targetduration: function b() {
                                        if (!isFinite(a.duration) || a.duration < 0) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid target duration: " + a.duration
                                            });
                                            return;
                                        }
                                        this.manifest.targetDuration = a.duration;
                                        q.call(this, this.manifest);
                                    },
                                    start: function b() {
                                        if (!a.attributes || isNaN(a.attributes["TIME-OFFSET"])) {
                                            this.trigger("warn", {
                                                message: "ignoring start declaration without appropriate attribute list"
                                            });
                                            return;
                                        }
                                        this.manifest.start = {
                                            timeOffset: a.attributes["TIME-OFFSET"],
                                            precise: a.attributes.PRECISE
                                        };
                                    },
                                    "cue-out": function b() {
                                        e.cueOut = a.data;
                                    },
                                    "cue-out-cont": function b() {
                                        e.cueOutCont = a.data;
                                    },
                                    "cue-in": function b() {
                                        e.cueIn = a.data;
                                    },
                                    skip: function b() {
                                        this.manifest.skip = p(a.attributes);
                                        this.warnOnMissingAttributes_("#EXT-X-SKIP", a.attributes, [
                                            "SKIPPED-SEGMENTS"
                                        ]);
                                    },
                                    part: function b() {
                                        var f = this;
                                        l = true;
                                        var c = this.manifest.segments.length;
                                        var b = p(a.attributes);
                                        e.parts = e.parts || [];
                                        e.parts.push(b);
                                        if (b.byterange) {
                                            if (!b.byterange.hasOwnProperty("offset")) {
                                                b.byterange.offset = u;
                                            }
                                            u = b.byterange.offset + b.byterange.length;
                                        }
                                        var d = e.parts.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PART #" + d + " for segment #" + c, a.attributes, [
                                            "URI",
                                            "DURATION"
                                        ]);
                                        if (this.manifest.renditionReports) {
                                            this.manifest.renditionReports.forEach(function(a, b) {
                                                if (!a.hasOwnProperty("lastPart")) {
                                                    f.trigger("warn", {
                                                        message: "#EXT-X-RENDITION-REPORT #" + b + " lacks required attribute(s): LAST-PART"
                                                    });
                                                }
                                            });
                                        }
                                    },
                                    "server-control": function c() {
                                        var b = (this.manifest.serverControl = p(a.attributes));
                                        if (!b.hasOwnProperty("canBlockReload")) {
                                            b.canBlockReload = false;
                                            this.trigger("info", {
                                                message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
                                            });
                                        }
                                        q.call(this, this.manifest);
                                        if (b.canSkipDateranges && !b.hasOwnProperty("canSkipUntil")) {
                                            this.trigger("warn", {
                                                message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
                                            });
                                        }
                                    },
                                    "preload-hint": function i() {
                                        var d = this.manifest.segments.length;
                                        var b = p(a.attributes);
                                        var f = b.type && b.type === "PART";
                                        e.preloadHints = e.preloadHints || [];
                                        e.preloadHints.push(b);
                                        if (b.byterange) {
                                            if (!b.byterange.hasOwnProperty("offset")) {
                                                b.byterange.offset = f ? u : 0;
                                                if (f) {
                                                    u = b.byterange.offset + b.byterange.length;
                                                }
                                            }
                                        }
                                        var g = e.preloadHints.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + g + " for segment #" + d, a.attributes, [
                                            "TYPE",
                                            "URI"
                                        ]);
                                        if (!b.type) {
                                            return;
                                        }
                                        for(var c = 0; c < e.preloadHints.length - 1; c++){
                                            var h = e.preloadHints[c];
                                            if (!h.type) {
                                                continue;
                                            }
                                            if (h.type === b.type) {
                                                this.trigger("warn", {
                                                    message: "#EXT-X-PRELOAD-HINT #" + g + " for segment #" + d + " has the same TYPE " + b.type + " as preload hint #" + c
                                                });
                                            }
                                        }
                                    },
                                    "rendition-report": function e() {
                                        var c = p(a.attributes);
                                        this.manifest.renditionReports = this.manifest.renditionReports || [];
                                        this.manifest.renditionReports.push(c);
                                        var d = this.manifest.renditionReports.length - 1;
                                        var b = [
                                            "LAST-MSN",
                                            "URI", 
                                        ];
                                        if (l) {
                                            b.push("LAST-PART");
                                        }
                                        this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + d, a.attributes, b);
                                    },
                                    "part-inf": function b() {
                                        this.manifest.partInf = p(a.attributes);
                                        this.warnOnMissingAttributes_("#EXT-X-PART-INF", a.attributes, [
                                            "PART-TARGET"
                                        ]);
                                        if (this.manifest.partInf.partTarget) {
                                            this.manifest.partTargetDuration = this.manifest.partInf.partTarget;
                                        }
                                        q.call(this, this.manifest);
                                    }
                                }[a.tagType] || m).call(b));
                            },
                            uri: function b() {
                                e.uri = a.uri;
                                d.push(e);
                                if (this.manifest.targetDuration && !("duration" in e)) {
                                    this.trigger("warn", {
                                        message: "defaulting segment duration to the target duration"
                                    });
                                    e.duration = this.manifest.targetDuration;
                                }
                                if (k) {
                                    e.key = k;
                                }
                                e.timeline = s;
                                if (j) {
                                    e.map = j;
                                }
                                u = 0;
                                e = {};
                            },
                            comment: function a() {},
                            custom: function b() {
                                if (a.segment) {
                                    e.custom = e.custom || {};
                                    e.custom[a.customType] = a.data;
                                } else {
                                    this.manifest.custom = this.manifest.custom || {};
                                    this.manifest.custom[a.customType] = a.data;
                                }
                            }
                        }[a.type].call(b));
                    });
                    return a;
                }
                var a = b.prototype;
                a.warnOnMissingAttributes_ = function d(b, e, c) {
                    var a = [];
                    c.forEach(function(b) {
                        if (!e.hasOwnProperty(b)) {
                            a.push(b);
                        }
                    });
                    if (a.length) {
                        this.trigger("warn", {
                            message: b + " lacks required attribute(s): " + a.join(", ")
                        });
                    }
                };
                a.push = function b(a) {
                    this.lineStream.push(a);
                };
                a.end = function a() {
                    this.lineStream.push("\n");
                    this.trigger("end");
                };
                a.addParser = function b(a) {
                    this.parseStream.addParser(a);
                };
                a.addTagMapper = function b(a) {
                    this.parseStream.addTagMapper(a);
                };
                return b;
            })(b);
        },
        973: function(e, b, a) {
            "use strict";
            a.d(b, {
                jp: function() {
                    return y;
                },
                mm: function() {
                    return z;
                },
                Qc: function() {
                    return ap;
                },
                LG: function() {
                    return aq;
                }
            });
            var f = a(779);
            var c = a(8908);
            var g = a.n(c);
            var h = a(6722);
            var i = a(3969);
            var d = "0.19.2";
            var j = function b(a) {
                return !!a && typeof a === "object";
            };
            var k = function d() {
                for(var b = arguments.length, c = new Array(b), a = 0; a < b; a++){
                    c[a] = arguments[a];
                }
                return c.reduce(function(a, b) {
                    if (typeof b !== "object") {
                        return a;
                    }
                    Object.keys(b).forEach(function(c) {
                        if (Array.isArray(a[c]) && Array.isArray(b[c])) {
                            a[c] = a[c].concat(b[c]);
                        } else if (j(a[c]) && j(b[c])) {
                            a[c] = d(a[c], b[c]);
                        } else {
                            a[c] = b[c];
                        }
                    });
                    return a;
                }, {});
            };
            var l = function b(a) {
                return Object.keys(a).map(function(b) {
                    return a[b];
                });
            };
            var m = function e(c, d) {
                var b = [];
                for(var a = c; a < d; a++){
                    b.push(a);
                }
                return b;
            };
            var n = function b(a) {
                return a.reduce(function(a, b) {
                    return a.concat(b);
                }, []);
            };
            var o = function d(a) {
                if (!a.length) {
                    return [];
                }
                var c = [];
                for(var b = 0; b < a.length; b++){
                    c.push(a[b]);
                }
                return c;
            };
            var p = function b(a, c) {
                return a.reduce(function(a, b, d) {
                    if (b[c]) {
                        a.push(d);
                    }
                    return a;
                }, []);
            };
            var q = {
                INVALID_NUMBER_OF_PERIOD: "INVALID_NUMBER_OF_PERIOD",
                DASH_EMPTY_MANIFEST: "DASH_EMPTY_MANIFEST",
                DASH_INVALID_XML: "DASH_INVALID_XML",
                NO_BASE_URL: "NO_BASE_URL",
                MISSING_SEGMENT_INFORMATION: "MISSING_SEGMENT_INFORMATION",
                SEGMENT_TIME_UNSPECIFIED: "SEGMENT_TIME_UNSPECIFIED",
                UNSUPPORTED_UTC_TIMING_SCHEME: "UNSUPPORTED_UTC_TIMING_SCHEME"
            };
            var r = function p(a) {
                var c = a.baseUrl, m = c === void 0 ? "" : c, d = a.source, e = d === void 0 ? "" : d, g = a.range, b = g === void 0 ? "" : g, h = a.indexRange, i = h === void 0 ? "" : h;
                var j = {
                    uri: e,
                    resolvedUri: (0, f.Z)(m || "", e)
                };
                if (b || i) {
                    var n = b ? b : i;
                    var k = n.split("-");
                    var l = parseInt(k[0], 10);
                    var o = parseInt(k[1], 10);
                    j.byterange = {
                        length: o - l + 1,
                        offset: l
                    };
                }
                return j;
            };
            var s = function c(a) {
                var b = a.offset + a.length - 1;
                return a.offset + "-" + b;
            };
            var t = function b(a) {
                if (a && typeof a !== "number") {
                    a = parseInt(a, 10);
                }
                if (isNaN(a)) {
                    return null;
                }
                return a;
            };
            var u = {
                static: function i(a) {
                    var f = a.duration, b = a.timescale, g = b === void 0 ? 1 : b, h = a.sourceDuration, c = a.periodDuration;
                    var d = t(a.endNumber);
                    var e = f / g;
                    if (typeof d === "number") {
                        return {
                            start: 0,
                            end: d
                        };
                    }
                    if (typeof c === "number") {
                        return {
                            start: 0,
                            end: c / e
                        };
                    }
                    return {
                        start: 0,
                        end: h / e
                    };
                },
                dynamic: function w(a) {
                    var k = a.NOW, l = a.clientOffset, m = a.availabilityStartTime, f = a.timescale, b = f === void 0 ? 1 : f, c = a.duration, g = a.start, n = g === void 0 ? 0 : g, h = a.minimumUpdatePeriod, o = h === void 0 ? 0 : h, i = a.timeShiftBufferDepth, p = i === void 0 ? Infinity : i;
                    var j = t(a.endNumber);
                    var d = (k + l) / 1000;
                    var e = m + n;
                    var q = d + o;
                    var r = q - e;
                    var s = Math.ceil((r * b) / c);
                    var u = Math.floor(((d - e - p) * b) / c);
                    var v = Math.floor(((d - e) * b) / c);
                    return {
                        start: Math.max(0, u),
                        end: typeof j === "number" ? j : Math.min(s, v)
                    };
                }
            };
            var v = function a(b) {
                return function(e, f) {
                    var a = b.duration, c = b.timescale, g = c === void 0 ? 1 : c, h = b.periodIndex, d = b.startNumber, i = d === void 0 ? 1 : d;
                    return {
                        number: i + e,
                        duration: a / g,
                        timeline: h,
                        time: f * a
                    };
                };
            };
            var w = function o(a) {
                var c = a.type, h = a.duration, d = a.timescale, i = d === void 0 ? 1 : d, e = a.periodDuration, j = a.sourceDuration;
                var f = u[c](a), k = f.start, l = f.end;
                var b = m(k, l).map(v(a));
                if (c === "static") {
                    var g = b.length - 1;
                    var n = typeof e === "number" ? e : j;
                    b[g].duration = n - (h / i) * g;
                }
                return b;
            };
            var x = function l(b) {
                var c = b.baseUrl, e = b.initialization, f = e === void 0 ? {} : e, g = b.sourceDuration, h = b.indexRange, i = h === void 0 ? "" : h, j = b.duration;
                if (!c) {
                    throw new Error(q.NO_BASE_URL);
                }
                var k = r({
                    baseUrl: c,
                    source: f.sourceURL,
                    range: f.range
                });
                var a = r({
                    baseUrl: c,
                    source: c,
                    indexRange: i
                });
                a.map = k;
                if (j) {
                    var d = w(b);
                    if (d.length) {
                        a.duration = d[0].duration;
                        a.timeline = d[0].timeline;
                    }
                } else if (g) {
                    a.duration = g;
                    a.timeline = 0;
                }
                a.number = 0;
                return [
                    a
                ];
            };
            var y = function v(a, b, l) {
                var e = a.sidx.map ? a.sidx.map : null;
                var m = a.sidx.duration;
                var f = a.timeline || 0;
                var g = a.sidx.byterange;
                var n = g.offset + g.length;
                var o = b.timescale;
                var p = b.references.filter(function(a) {
                    return a.referenceType !== 1;
                });
                var h = [];
                var q = a.endList ? "static" : "dynamic";
                var c = n + b.firstOffset;
                for(var d = 0; d < p.length; d++){
                    var i = b.references[d];
                    var j = i.referencedSize;
                    var r = i.subsegmentDuration;
                    var s = c + j - 1;
                    var t = c + "-" + s;
                    var u = {
                        baseUrl: l,
                        timescale: o,
                        timeline: f,
                        periodIndex: f,
                        duration: r,
                        sourceDuration: m,
                        indexRange: t,
                        type: q
                    };
                    var k = x(u)[0];
                    if (e) {
                        k.map = e;
                    }
                    h.push(k);
                    c += j;
                }
                a.segments = h;
                return a;
            };
            var z = function b(a) {
                return (a && a.uri + "-" + s(a.byterange));
            };
            var A = function c(a) {
                var b = l(a.reduce(function(b, a) {
                    var c = a.attributes.id + (a.attributes.lang || "");
                    if (b[c]) {
                        var d;
                        if (a.segments[0]) {
                            a.segments[0].discontinuity = true;
                        }
                        (d = b[c].segments).push.apply(d, a.segments);
                        if (a.attributes.contentProtection) {
                            b[c].attributes.contentProtection = a.attributes.contentProtection;
                        }
                    } else {
                        b[c] = a;
                    }
                    return b;
                }, {}));
                return b.map(function(a) {
                    a.discontinuityStarts = p(a.segments, "discontinuity");
                    return a;
                });
            };
            var B = function e(a, c) {
                var b = z(a.sidx);
                var d = b && c[b] && c[b].sidx;
                if (d) {
                    y(a, d, a.sidx.resolvedUri);
                }
                return a;
            };
            var C = function d(a, b) {
                if (b === void 0) {
                    b = {};
                }
                if (!Object.keys(b).length) {
                    return a;
                }
                for(var c in a){
                    a[c] = B(a[c], b);
                }
                return a;
            };
            var D = function h(c, g) {
                var d;
                var a = c.attributes, e = c.segments, f = c.sidx;
                var b = {
                    attributes: ((d = {
                        NAME: a.id,
                        BANDWIDTH: a.bandwidth,
                        CODECS: a.codecs
                    }), (d["PROGRAM-ID"] = 1), d),
                    uri: "",
                    endList: a.type === "static",
                    timeline: a.periodIndex,
                    resolvedUri: "",
                    targetDuration: a.duration,
                    segments: e,
                    mediaSequence: e.length ? e[0].number : 1
                };
                if (a.contentProtection) {
                    b.contentProtection = a.contentProtection;
                }
                if (f) {
                    b.sidx = f;
                }
                if (g) {
                    b.attributes.AUDIO = "audio";
                    b.attributes.SUBTITLES = "subs";
                }
                return b;
            };
            var E = function f(d) {
                var c;
                var a = d.attributes, b = d.segments;
                if (typeof b === "undefined") {
                    b = [
                        {
                            uri: a.baseUrl,
                            timeline: a.periodIndex,
                            resolvedUri: a.baseUrl || "",
                            duration: a.sourceDuration,
                            number: 0
                        }, 
                    ];
                    a.duration = a.sourceDuration;
                }
                var e = ((c = {
                    NAME: a.id,
                    BANDWIDTH: a.bandwidth
                }), (c["PROGRAM-ID"] = 1), c);
                if (a.codecs) {
                    e.CODECS = a.codecs;
                }
                return {
                    attributes: e,
                    uri: "",
                    endList: a.type === "static",
                    timeline: a.periodIndex,
                    resolvedUri: a.baseUrl || "",
                    targetDuration: a.duration,
                    segments: b,
                    mediaSequence: b.length ? b[0].number : 1
                };
            };
            var F = function g(d, b, c) {
                if (b === void 0) {
                    b = {};
                }
                if (c === void 0) {
                    c = false;
                }
                var e;
                var a = d.reduce(function(d, a) {
                    var f = (a.attributes.role && a.attributes.role.value) || "";
                    var h = a.attributes.lang || "";
                    var g = a.attributes.label || "main";
                    if (h && !a.attributes.label) {
                        var i = f ? " (" + f + ")" : "";
                        g = "" + a.attributes.lang + i;
                    }
                    if (!d[g]) {
                        d[g] = {
                            language: h,
                            autoselect: true,
                            default: f === "main",
                            playlists: [],
                            uri: ""
                        };
                    }
                    var j = B(D(a, c), b);
                    d[g].playlists.push(j);
                    if (typeof e === "undefined" && f === "main") {
                        e = a;
                        e.default = true;
                    }
                    return d;
                }, {});
                if (!e) {
                    var f = Object.keys(a)[0];
                    a[f].default = true;
                }
                return a;
            };
            var G = function c(b, a) {
                if (a === void 0) {
                    a = {};
                }
                return b.reduce(function(b, d) {
                    var c = d.attributes.lang || "text";
                    if (!b[c]) {
                        b[c] = {
                            language: c,
                            default: false,
                            autoselect: false,
                            playlists: [],
                            uri: ""
                        };
                    }
                    b[c].playlists.push(B(E(d), a));
                    return b;
                }, {});
            };
            var H = function b(a) {
                return a.reduce(function(a, b) {
                    if (!b) {
                        return a;
                    }
                    b.forEach(function(b) {
                        var d = b.channel, c = b.language;
                        a[c] = {
                            autoselect: false,
                            default: false,
                            instreamId: d,
                            language: c
                        };
                        if (b.hasOwnProperty("aspectRatio")) {
                            a[c].aspectRatio = b.aspectRatio;
                        }
                        if (b.hasOwnProperty("easyReader")) {
                            a[c].easyReader = b.easyReader;
                        }
                        if (b.hasOwnProperty("3D")) {
                            a[c]["3D"] = b["3D"];
                        }
                    });
                    return a;
                }, {});
            };
            var I = function g(b) {
                var c;
                var a = b.attributes, d = b.segments, f = b.sidx;
                var e = {
                    attributes: ((c = {
                        NAME: a.id,
                        AUDIO: "audio",
                        SUBTITLES: "subs",
                        RESOLUTION: {
                            width: a.width,
                            height: a.height
                        },
                        CODECS: a.codecs,
                        BANDWIDTH: a.bandwidth
                    }), (c["PROGRAM-ID"] = 1), c),
                    uri: "",
                    endList: a.type === "static",
                    timeline: a.periodIndex,
                    resolvedUri: "",
                    targetDuration: a.duration,
                    segments: d,
                    mediaSequence: d.length ? d[0].number : 1
                };
                if (a.contentProtection) {
                    e.contentProtection = a.contentProtection;
                }
                if (f) {
                    e.sidx = f;
                }
                return e;
            };
            var J = function c(b) {
                var a = b.attributes;
                return (a.mimeType === "video/mp4" || a.mimeType === "video/webm" || a.contentType === "video");
            };
            var K = function c(b) {
                var a = b.attributes;
                return (a.mimeType === "audio/mp4" || a.mimeType === "audio/webm" || a.contentType === "audio");
            };
            var L = function c(b) {
                var a = b.attributes;
                return (a.mimeType === "text/vtt" || a.contentType === "text");
            };
            var M = function p(b, f, c) {
                var d;
                if (c === void 0) {
                    c = {};
                }
                if (!b.length) {
                    return {};
                }
                var e = b[0].attributes, k = e.sourceDuration, l = e.type, m = e.suggestedPresentationDelay, g = e.minimumUpdatePeriod;
                var n = A(b.filter(J)).map(I);
                var h = A(b.filter(K));
                var i = b.filter(L);
                var j = b.map(function(a) {
                    return a.attributes.captionServices;
                }).filter(Boolean);
                var a = {
                    allowCache: true,
                    discontinuityStarts: [],
                    segments: [],
                    endList: true,
                    mediaGroups: ((d = {
                        AUDIO: {},
                        VIDEO: {}
                    }), (d["CLOSED-CAPTIONS"] = {}), (d.SUBTITLES = {}), d),
                    uri: "",
                    duration: k,
                    playlists: C(n, c)
                };
                if (g >= 0) {
                    a.minimumUpdatePeriod = g * 1000;
                }
                if (f) {
                    a.locations = f;
                }
                if (l === "dynamic") {
                    a.suggestedPresentationDelay = m;
                }
                var o = a.playlists.length === 0;
                if (h.length) {
                    a.mediaGroups.AUDIO.audio = F(h, c, o);
                }
                if (i.length) {
                    a.mediaGroups.SUBTITLES.subs = G(i, c);
                }
                if (j.length) {
                    a.mediaGroups["CLOSED-CAPTIONS"].cc = H(j);
                }
                return a;
            };
            var N = function q(a, e, f) {
                var g = a.NOW, h = a.clientOffset, i = a.availabilityStartTime, b = a.timescale, j = b === void 0 ? 1 : b, c = a.start, k = c === void 0 ? 0 : c, d = a.minimumUpdatePeriod, l = d === void 0 ? 0 : d;
                var m = (g + h) / 1000;
                var n = i + k;
                var o = m + l;
                var p = o - n;
                return Math.ceil((p * j - e) / f);
            };
            var O = function y(b, e) {
                var s = b.type, k = b.minimumUpdatePeriod, t = k === void 0 ? 0 : k, l = b.media, u = l === void 0 ? "" : l, v = b.sourceDuration, m = b.timescale, n = m === void 0 ? 1 : m, o = b.startNumber, p = o === void 0 ? 1 : o, w = b.periodIndex;
                var f = [];
                var a = -1;
                for(var g = 0; g < e.length; g++){
                    var i = e[g];
                    var c = i.d;
                    var q = i.r || 0;
                    var h = i.t || 0;
                    if (a < 0) {
                        a = h;
                    }
                    if (h && h > a) {
                        a = h;
                    }
                    var d = void 0;
                    if (q < 0) {
                        var r = g + 1;
                        if (r === e.length) {
                            if (s === "dynamic" && t > 0 && u.indexOf("$Number$") > 0) {
                                d = N(b, a, c);
                            } else {
                                d = (v * n - a) / c;
                            }
                        } else {
                            d = (e[r].t - a) / c;
                        }
                    } else {
                        d = q + 1;
                    }
                    var x = p + f.length + d;
                    var j = p + f.length;
                    while(j < x){
                        f.push({
                            number: j,
                            duration: c / n,
                            time: a,
                            timeline: w
                        });
                        a += c;
                        j++;
                    }
                }
                return f;
            };
            var P = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g;
            var Q = function a(b) {
                return function(e, d, f, a) {
                    if (e === "$$") {
                        return "$";
                    }
                    if (typeof b[d] === "undefined") {
                        return e;
                    }
                    var c = "" + b[d];
                    if (d === "RepresentationID") {
                        return c;
                    }
                    if (!f) {
                        a = 1;
                    } else {
                        a = parseInt(a, 10);
                    }
                    if (c.length >= a) {
                        return c;
                    }
                    return ("" + new Array(a - c.length + 1).join("0") + c);
                };
            };
            var R = function c(a, b) {
                return a.replace(P, Q(b));
            };
            var S = function c(a, b) {
                if (!a.duration && !b) {
                    return [
                        {
                            number: a.startNumber || 1,
                            duration: a.sourceDuration,
                            time: 0,
                            timeline: a.periodIndex
                        }, 
                    ];
                }
                if (a.duration) {
                    return w(a);
                }
                return O(a, b);
            };
            var T = function h(a, d) {
                var e = {
                    RepresentationID: a.id,
                    Bandwidth: a.bandwidth || 0
                };
                var b = a.initialization, c = b === void 0 ? {
                    sourceURL: "",
                    range: ""
                } : b;
                var i = r({
                    baseUrl: a.baseUrl,
                    source: R(c.sourceURL, e),
                    range: c.range
                });
                var g = S(a, d);
                return g.map(function(b) {
                    e.Number = b.number;
                    e.Time = b.time;
                    var c = R(a.media || "", e);
                    var d = a.timescale || 1;
                    var g = a.presentationTimeOffset || 0;
                    var h = a.periodStart + (b.time - g) / d;
                    var j = {
                        uri: c,
                        timeline: b.timeline,
                        duration: b.duration,
                        resolvedUri: (0, f.Z)(a.baseUrl || "", c),
                        map: i,
                        number: b.number,
                        presentationTime: h
                    };
                    return j;
                });
            };
            var U = function h(a, b) {
                var c = a.baseUrl, d = a.initialization, e = d === void 0 ? {} : d;
                var g = r({
                    baseUrl: c,
                    source: e.sourceURL,
                    range: e.range
                });
                var f = r({
                    baseUrl: c,
                    source: b.media,
                    range: b.mediaRange
                });
                f.map = g;
                return f;
            };
            var V = function h(a, b) {
                var c = a.duration, e = a.segmentUrls, f = e === void 0 ? [] : e, i = a.periodStart;
                if ((!c && !b) || (c && b)) {
                    throw new Error(q.SEGMENT_TIME_UNSPECIFIED);
                }
                var j = f.map(function(b) {
                    return U(a, b);
                });
                var d;
                if (c) {
                    d = w(a);
                }
                if (b) {
                    d = O(a, b);
                }
                var g = d.map(function(c, d) {
                    if (j[d]) {
                        var b = j[d];
                        var e = a.timescale || 1;
                        var f = a.presentationTimeOffset || 0;
                        b.timeline = c.timeline;
                        b.duration = c.duration;
                        b.number = c.number;
                        b.presentationTime = i + (c.time - f) / e;
                        return b;
                    }
                }).filter(function(a) {
                    return a;
                });
                return g;
            };
            var W = function m(g) {
                var e = g.attributes, b = g.segmentInfo;
                var a;
                var d;
                if (b.template) {
                    d = T;
                    a = k(e, b.template);
                } else if (b.base) {
                    d = x;
                    a = k(e, b.base);
                } else if (b.list) {
                    d = V;
                    a = k(e, b.list);
                }
                var c = {
                    attributes: e
                };
                if (!d) {
                    return c;
                }
                var f = d(a, b.segmentTimeline);
                if (a.duration) {
                    var h = a, j = h.duration, i = h.timescale, l = i === void 0 ? 1 : i;
                    a.duration = j / l;
                } else if (f.length) {
                    a.duration = f.reduce(function(a, b) {
                        return Math.max(a, Math.ceil(b.duration));
                    }, 0);
                } else {
                    a.duration = 0;
                }
                c.attributes = a;
                c.segments = f;
                if (b.base && a.indexRange) {
                    c.sidx = f[0];
                    c.segments = [];
                }
                return c;
            };
            var X = function b(a) {
                return a.map(W);
            };
            var Y = function b(a, c) {
                return o(a.childNodes).filter(function(a) {
                    var b = a.tagName;
                    return b === c;
                });
            };
            var Z = function b(a) {
                return a.textContent.trim();
            };
            var $ = function p(c) {
                var d = 365 * 24 * 60 * 60;
                var e = 30 * 24 * 60 * 60;
                var f = 24 * 60 * 60;
                var g = 60 * 60;
                var h = 60;
                var i = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/;
                var b = i.exec(c);
                if (!b) {
                    return 0;
                }
                var a = b.slice(1), j = a[0], k = a[1], l = a[2], m = a[3], n = a[4], o = a[5];
                return (parseFloat(j || 0) * d + parseFloat(k || 0) * e + parseFloat(l || 0) * f + parseFloat(m || 0) * g + parseFloat(n || 0) * h + parseFloat(o || 0));
            };
            var _ = function c(a) {
                var b = /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/;
                if (b.test(a)) {
                    a += "Z";
                }
                return Date.parse(a);
            };
            var aa = {
                mediaPresentationDuration: function b(a) {
                    return $(a);
                },
                availabilityStartTime: function b(a) {
                    return _(a) / 1000;
                },
                minimumUpdatePeriod: function b(a) {
                    return $(a);
                },
                suggestedPresentationDelay: function b(a) {
                    return $(a);
                },
                type: function b(a) {
                    return a;
                },
                timeShiftBufferDepth: function b(a) {
                    return $(a);
                },
                start: function b(a) {
                    return $(a);
                },
                width: function b(a) {
                    return parseInt(a, 10);
                },
                height: function b(a) {
                    return parseInt(a, 10);
                },
                bandwidth: function b(a) {
                    return parseInt(a, 10);
                },
                startNumber: function b(a) {
                    return parseInt(a, 10);
                },
                timescale: function b(a) {
                    return parseInt(a, 10);
                },
                presentationTimeOffset: function b(a) {
                    return parseInt(a, 10);
                },
                duration: function c(a) {
                    var b = parseInt(a, 10);
                    if (isNaN(b)) {
                        return $(a);
                    }
                    return b;
                },
                d: function b(a) {
                    return parseInt(a, 10);
                },
                t: function b(a) {
                    return parseInt(a, 10);
                },
                r: function b(a) {
                    return parseInt(a, 10);
                },
                DEFAULT: function b(a) {
                    return a;
                }
            };
            var ab = function b(a) {
                if (!(a && a.attributes)) {
                    return {};
                }
                return o(a.attributes).reduce(function(b, a) {
                    var c = aa[a.name] || aa.DEFAULT;
                    b[a.name] = c(a.value);
                    return b;
                }, {});
            };
            var ac = {
                "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
                "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
                "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
                "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
            };
            var ad = function c(a, b) {
                if (!b.length) {
                    return a;
                }
                return n(a.map(function(a) {
                    return b.map(function(b) {
                        return (0, f.Z)(a, Z(b));
                    });
                }));
            };
            var ae = function m(e) {
                var d = Y(e, "SegmentTemplate")[0];
                var b = Y(e, "SegmentList")[0];
                var l = b && Y(b, "SegmentURL").map(function(a) {
                    return k({
                        tag: "SegmentURL"
                    }, ab(a));
                });
                var f = Y(e, "SegmentBase")[0];
                var g = b || d;
                var h = g && Y(g, "SegmentTimeline")[0];
                var i = b || f || d;
                var c = i && Y(i, "Initialization")[0];
                var a = d && ab(d);
                if (a && c) {
                    a.initialization = c && ab(c);
                } else if (a && a.initialization) {
                    a.initialization = {
                        sourceURL: a.initialization
                    };
                }
                var j = {
                    template: a,
                    segmentTimeline: h && Y(h, "S").map(function(a) {
                        return ab(a);
                    }),
                    list: b && k(ab(b), {
                        segmentUrls: l,
                        initialization: ab(c)
                    }),
                    base: f && k(ab(f), {
                        initialization: ab(c)
                    })
                };
                Object.keys(j).forEach(function(a) {
                    if (!j[a]) {
                        delete j[a];
                    }
                });
                return j;
            };
            var af = function a(b, c, d) {
                return function(a) {
                    var e = Y(a, "BaseURL");
                    var f = ad(c, e);
                    var g = k(b, ab(a));
                    var h = ae(a);
                    return f.map(function(a) {
                        return {
                            segmentInfo: k(d, h),
                            attributes: k(g, {
                                baseUrl: a
                            })
                        };
                    });
                };
            };
            var ag = function b(a) {
                return a.reduce(function(a, c) {
                    var d = ab(c);
                    var b = ac[d.schemeIdUri];
                    if (b) {
                        a[b] = {
                            attributes: d
                        };
                        var e = Y(c, "cenc:pssh")[0];
                        if (e) {
                            var f = Z(e);
                            var g = f && (0, h.Z)(f);
                            a[b].pssh = g;
                        }
                    }
                    return a;
                }, {});
            };
            var ah = function d(a) {
                if (a.schemeIdUri === "urn:scte:dash:cc:cea-608:2015") {
                    var b = typeof a.value !== "string" ? [] : a.value.split(";");
                    return b.map(function(a) {
                        var b;
                        var c;
                        c = a;
                        if (/^CC\d=/.test(a)) {
                            var d = a.split("=");
                            b = d[0];
                            c = d[1];
                        } else if (/^CC\d$/.test(a)) {
                            b = a;
                        }
                        return {
                            channel: b,
                            language: c
                        };
                    });
                } else if (a.schemeIdUri === "urn:scte:dash:cc:cea-708:2015") {
                    var c = typeof a.value !== "string" ? [] : a.value.split(";");
                    return c.map(function(b) {
                        var a = {
                            channel: undefined,
                            language: undefined,
                            aspectRatio: 1,
                            easyReader: 0,
                            "3D": 0
                        };
                        if (/=/.test(b)) {
                            var c = b.split("="), e = c[0], d = c[1], f = d === void 0 ? "" : d;
                            a.channel = e;
                            a.language = b;
                            f.split(",").forEach(function(e) {
                                var d = e.split(":"), b = d[0], c = d[1];
                                if (b === "lang") {
                                    a.language = c;
                                } else if (b === "er") {
                                    a.easyReader = Number(c);
                                } else if (b === "war") {
                                    a.aspectRatio = Number(c);
                                } else if (b === "3D") {
                                    a["3D"] = Number(c);
                                }
                            });
                        } else {
                            a.language = b;
                        }
                        if (a.channel) {
                            a.channel = "SERVICE" + a.channel;
                        }
                        return a;
                    });
                }
            };
            var ai = function a(b, c, d) {
                return function(a) {
                    var i = ab(a);
                    var j = ad(c, Y(a, "BaseURL"));
                    var l = Y(a, "Role")[0];
                    var m = {
                        role: ab(l)
                    };
                    var e = k(b, i, m);
                    var o = Y(a, "Accessibility")[0];
                    var g = ah(ab(o));
                    if (g) {
                        e = k(e, {
                            captionServices: g
                        });
                    }
                    var f = Y(a, "Label")[0];
                    if (f && f.childNodes.length) {
                        var p = f.childNodes[0].nodeValue.trim();
                        e = k(e, {
                            label: p
                        });
                    }
                    var h = ag(Y(a, "ContentProtection"));
                    if (Object.keys(h).length) {
                        e = k(e, {
                            contentProtection: h
                        });
                    }
                    var q = ae(a);
                    var r = Y(a, "Representation");
                    var s = k(d, q);
                    return n(r.map(af(e, j, s)));
                };
            };
            var aj = function a(b, c) {
                return function(a, f) {
                    var h = ad(c, Y(a.node, "BaseURL"));
                    var d = parseInt(a.attributes.id, 10);
                    var i = g().isNaN(d) ? f : d;
                    var e = k(b, {
                        periodIndex: i,
                        periodStart: a.attributes.start
                    });
                    if (typeof a.attributes.duration === "number") {
                        e.periodDuration = a.attributes.duration;
                    }
                    var j = Y(a.node, "AdaptationSet");
                    var l = ae(a.node);
                    return n(j.map(ai(e, h, l)));
                };
            };
            var ak = function e(b) {
                var c = b.attributes, a = b.priorPeriodAttributes, d = b.mpdType;
                if (typeof c.start === "number") {
                    return c.start;
                }
                if (a && typeof a.start === "number" && typeof a.duration === "number") {
                    return (a.start + a.duration);
                }
                if (!a && d === "static") {
                    return 0;
                }
                return null;
            };
            var al = function p(b, c) {
                if (c === void 0) {
                    c = {};
                }
                var d = c, e = d.manifestUri, j = e === void 0 ? "" : e, f = d.NOW, k = f === void 0 ? Date.now() : f, g = d.clientOffset, l = g === void 0 ? 0 : g;
                var h = Y(b, "Period");
                if (!h.length) {
                    throw new Error(q.INVALID_NUMBER_OF_PERIOD);
                }
                var i = Y(b, "Location");
                var a = ab(b);
                var m = ad([
                    j
                ], Y(b, "BaseURL"));
                a.type = a.type || "static";
                a.sourceDuration = a.mediaPresentationDuration || 0;
                a.NOW = k;
                a.clientOffset = l;
                if (i.length) {
                    a.locations = i.map(Z);
                }
                var o = [];
                h.forEach(function(c, e) {
                    var b = ab(c);
                    var d = o[e - 1];
                    b.start = ak({
                        attributes: b,
                        priorPeriodAttributes: d ? d.attributes : null,
                        mpdType: a.type
                    });
                    o.push({
                        node: c,
                        attributes: b
                    });
                });
                return {
                    locations: a.locations,
                    representationInfo: n(o.map(aj(a, m)))
                };
            };
            var am = function e(c) {
                if (c === "") {
                    throw new Error(q.DASH_EMPTY_MANIFEST);
                }
                var d = new i.DOMParser();
                var b;
                var a;
                try {
                    b = d.parseFromString(c, "application/xml");
                    a = b && b.documentElement.tagName === "MPD" ? b.documentElement : null;
                } catch (f) {}
                if (!a || (a && a.getElementsByTagName("parsererror").length > 0)) {
                    throw new Error(q.DASH_INVALID_XML);
                }
                return a;
            };
            var an = function d(c) {
                var b = Y(c, "UTCTiming")[0];
                if (!b) {
                    return null;
                }
                var a = ab(b);
                switch(a.schemeIdUri){
                    case "urn:mpeg:dash:utc:http-head:2014":
                    case "urn:mpeg:dash:utc:http-head:2012":
                        a.method = "HEAD";
                        break;
                    case "urn:mpeg:dash:utc:http-xsdate:2014":
                    case "urn:mpeg:dash:utc:http-iso:2014":
                    case "urn:mpeg:dash:utc:http-xsdate:2012":
                    case "urn:mpeg:dash:utc:http-iso:2012":
                        a.method = "GET";
                        break;
                    case "urn:mpeg:dash:utc:direct:2014":
                    case "urn:mpeg:dash:utc:direct:2012":
                        a.method = "DIRECT";
                        a.value = Date.parse(a.value);
                        break;
                    case "urn:mpeg:dash:utc:http-ntp:2014":
                    case "urn:mpeg:dash:utc:ntp:2014":
                    case "urn:mpeg:dash:utc:sntp:2014":
                    default:
                        throw new Error(q.UNSUPPORTED_UTC_TIMING_SCHEME);
                }
                return a;
            };
            var ao = null && d;
            var ap = function e(c, a) {
                if (a === void 0) {
                    a = {};
                }
                var b = al(am(c), a);
                var d = X(b.representationInfo);
                return M(d, b.locations, a.sidxMapping);
            };
            var aq = function b(a) {
                return an(am(a));
            };
        },
        4221: function(a) {
            var c = Math.pow(2, 32);
            var b = function(d) {
                var b = new DataView(d.buffer, d.byteOffset, d.byteLength), e = {
                    version: d[0],
                    flags: new Uint8Array(d.subarray(1, 4)),
                    references: [],
                    referenceId: b.getUint32(4),
                    timescale: b.getUint32(8)
                }, a = 12;
                if (e.version === 0) {
                    e.earliestPresentationTime = b.getUint32(a);
                    e.firstOffset = b.getUint32(a + 4);
                    a += 8;
                } else {
                    e.earliestPresentationTime = b.getUint32(a) * c + b.getUint32(a + 4);
                    e.firstOffset = b.getUint32(a + 8) * c + b.getUint32(a + 12);
                    a += 16;
                }
                a += 2;
                var f = b.getUint16(a);
                a += 2;
                for(; f > 0; a += 12, f--){
                    e.references.push({
                        referenceType: (d[a] & 0x80) >>> 7,
                        referencedSize: b.getUint32(a) & 0x7fffffff,
                        subsegmentDuration: b.getUint32(a + 4),
                        startsWithSap: !!(d[a + 8] & 0x80),
                        sapType: (d[a + 8] & 0x70) >>> 4,
                        sapDeltaTime: b.getUint32(a + 8) & 0x0fffffff
                    });
                }
                return e;
            };
            a.exports = b;
        },
        1489: function(h) {
            var i = 90000, a, b, c, d, e, f, g;
            a = function(a) {
                return a * i;
            };
            b = function(a, b) {
                return a * b;
            };
            c = function(a) {
                return a / i;
            };
            d = function(a, b) {
                return a / b;
            };
            e = function(b, c) {
                return a(d(b, c));
            };
            f = function(a, d) {
                return b(c(a), d);
            };
            g = function(a, b, d) {
                return c(d ? a : a - b);
            };
            h.exports = {
                ONE_SECOND_IN_TS: i,
                secondsToVideoTs: a,
                secondsToAudioTs: b,
                videoTsToSeconds: c,
                audioTsToSeconds: d,
                audioTsToVideoTs: e,
                videoTsToAudioTs: f,
                metadataTsToSeconds: g
            };
        },
        8581: function(a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return c(4816);
                }, 
            ]);
            if (false) {}
        },
        4816: function(e, b, a) {
            "use strict";
            a.r(b);
            a.d(b, {
                default: function() {
                    return l;
                }
            });
            var f = a(5893);
            var g = a(7294);
            var c = a(214);
            var h = a.n(c);
            var i = a(5215);
            var j = a(3512);
            var d = function(a) {
                var b = g.useRef(null);
                var c = g.useRef(null);
                var d = a.options, e = a.onReady;
                g.useEffect(function() {
                    if (!c.current) {
                        var a = b.current;
                        if (!a) return;
                        var f = (c.current = (0, i.Z)(a, d, function() {
                            console.log("player is ready");
                            e && e(f);
                        }));
                    } else {}
                }, [
                    e,
                    d,
                    b
                ]);
                g.useEffect(function() {
                    return function() {
                        var a = c.current;
                        if (a) {
                            a.dispose();
                            c.current = null;
                        }
                    };
                }, [
                    c
                ]);
                return (0, f.jsx)("div", {
                    "data-vjs-player": true,
                    children: (0, f.jsx)("video", {
                        ref: b,
                        className: "video-js vjs-big-play-centered"
                    })
                });
            };
            var k = d;
            function l() {
                var c = (0, g.useRef)(null);
                var a = {
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
                var b = function(a) {
                    c.current = a;
                    a.on("waiting", function() {
                        console.log("player is waiting");
                    });
                    a.on("dispose", function() {
                        console.log("player will dispose");
                    });
                };
                return (0, f.jsx)("div", {
                    className: h().container,
                    children: (0, f.jsx)("main", {
                        className: h().main,
                        children: (0, f.jsx)(k, {
                            options: a,
                            onReady: b
                        })
                    })
                });
            }
        },
        214: function(a) {
            a.exports = {
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
        5974: function(a) {
            a.exports = b;
            function b(c, d) {
                var a;
                var b = null;
                try {
                    a = JSON.parse(c, d);
                } catch (e) {
                    b = e;
                }
                return [
                    b,
                    a
                ];
            }
        },
        9945: function(a) {
            (function(c) {
                var d = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#[^]*)?$/;
                var e = /^([^\/?#]*)([^]*)$/;
                var f = /(?:\/|^)\.(?=\/)/g;
                var g = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;
                var b = {
                    buildAbsoluteURL: function(f, g, h) {
                        h = h || {};
                        f = f.trim();
                        g = g.trim();
                        if (!g) {
                            if (!h.alwaysNormalize) {
                                return f;
                            }
                            var i = b.parseURL(f);
                            if (!i) {
                                throw new Error("Error trying to parse base URL.");
                            }
                            i.path = b.normalizePath(i.path);
                            return b.buildURLFromParts(i);
                        }
                        var a = b.parseURL(g);
                        if (!a) {
                            throw new Error("Error trying to parse relative URL.");
                        }
                        if (a.scheme) {
                            if (!h.alwaysNormalize) {
                                return g;
                            }
                            a.path = b.normalizePath(a.path);
                            return b.buildURLFromParts(a);
                        }
                        var c = b.parseURL(f);
                        if (!c) {
                            throw new Error("Error trying to parse base URL.");
                        }
                        if (!c.netLoc && c.path && c.path[0] !== "/") {
                            var j = e.exec(c.path);
                            c.netLoc = j[1];
                            c.path = j[2];
                        }
                        if (c.netLoc && !c.path) {
                            c.path = "/";
                        }
                        var d = {
                            scheme: c.scheme,
                            netLoc: a.netLoc,
                            path: null,
                            params: a.params,
                            query: a.query,
                            fragment: a.fragment
                        };
                        if (!a.netLoc) {
                            d.netLoc = c.netLoc;
                            if (a.path[0] !== "/") {
                                if (!a.path) {
                                    d.path = c.path;
                                    if (!a.params) {
                                        d.params = c.params;
                                        if (!a.query) {
                                            d.query = c.query;
                                        }
                                    }
                                } else {
                                    var k = c.path;
                                    var l = k.substring(0, k.lastIndexOf("/") + 1) + a.path;
                                    d.path = b.normalizePath(l);
                                }
                            }
                        }
                        if (d.path === null) {
                            d.path = h.alwaysNormalize ? b.normalizePath(a.path) : a.path;
                        }
                        return b.buildURLFromParts(d);
                    },
                    parseURL: function(b) {
                        var a = d.exec(b);
                        if (!a) {
                            return null;
                        }
                        return {
                            scheme: a[1] || "",
                            netLoc: a[2] || "",
                            path: a[3] || "",
                            params: a[4] || "",
                            query: a[5] || "",
                            fragment: a[6] || ""
                        };
                    },
                    normalizePath: function(a) {
                        a = a.split("").reverse().join("").replace(f, "");
                        while(a.length !== (a = a.replace(g, "")).length){}
                        return a.split("").reverse().join("");
                    },
                    buildURLFromParts: function(a) {
                        return (a.scheme + a.netLoc + a.path + a.params + a.query + a.fragment);
                    }
                };
                if (true) a.exports = b;
                else {}
            })(this);
        },
        3407: function(d, e, c) {
            var b = c(8908);
            var a = (d.exports = {
                WebVTT: c(3706),
                VTTCue: c(2230),
                VTTRegion: c(3710)
            });
            b.vttjs = a;
            b.WebVTT = a.WebVTT;
            var f = a.VTTCue;
            var g = a.VTTRegion;
            var h = b.VTTCue;
            var i = b.VTTRegion;
            a.shim = function() {
                b.VTTCue = f;
                b.VTTRegion = g;
            };
            a.restore = function() {
                b.VTTCue = h;
                b.VTTRegion = i;
            };
            if (!b.VTTCue) {
                a.shim();
            }
        },
        3706: function(h, k, i) {
            var f = i(9144);
            var g = Object.create || (function() {
                function a() {}
                return function(b) {
                    if (arguments.length !== 1) {
                        throw new Error("Object.create shim only accepts one parameter.");
                    }
                    a.prototype = b;
                    return new a();
                };
            })();
            function c(a, b) {
                this.name = "ParsingError";
                this.code = a.code;
                this.message = b || a.message;
            }
            c.prototype = g(Error.prototype);
            c.prototype.constructor = c;
            c.Errors = {
                BadSignature: {
                    code: 0,
                    message: "Malformed WebVTT signature."
                },
                BadTimeStamp: {
                    code: 1,
                    message: "Malformed time stamp."
                }
            };
            function l(c) {
                function b(a, b, c, d) {
                    return ((a | 0) * 3600 + (b | 0) * 60 + (c | 0) + (d | 0) / 1000);
                }
                var a = c.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
                if (!a) {
                    return null;
                }
                if (a[3]) {
                    return b(a[1], a[2], a[3].replace(":", ""), a[4]);
                } else if (a[1] > 59) {
                    return b(a[1], a[2], 0, a[4]);
                } else {
                    return b(0, a[1], a[2], a[4]);
                }
            }
            function j() {
                this.values = g(null);
            }
            j.prototype = {
                set: function(a, b) {
                    if (!this.get(a) && b !== "") {
                        this.values[a] = b;
                    }
                },
                get: function(a, b, c) {
                    if (c) {
                        return this.has(a) ? this.values[a] : b[c];
                    }
                    return this.has(a) ? this.values[a] : b;
                },
                has: function(a) {
                    return a in this.values;
                },
                alt: function(d, b, c) {
                    for(var a = 0; a < c.length; ++a){
                        if (b === c[a]) {
                            this.set(d, b);
                            break;
                        }
                    }
                },
                integer: function(b, a) {
                    if (/^-?\d+$/.test(a)) {
                        this.set(b, parseInt(a, 10));
                    }
                },
                percent: function(b, a) {
                    var c;
                    if ((c = a.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
                        a = parseFloat(a);
                        if (a >= 0 && a <= 100) {
                            this.set(b, a);
                            return true;
                        }
                    }
                    return false;
                }
            };
            function m(c, f, g, d) {
                var a = d ? c.split(d) : [
                    c
                ];
                for(var e in a){
                    if (typeof a[e] !== "string") {
                        continue;
                    }
                    var b = a[e].split(g);
                    if (b.length !== 2) {
                        continue;
                    }
                    var h = b[0];
                    var i = b[1];
                    f(h, i);
                }
            }
            function n(a, d, h) {
                var f = a;
                function e() {
                    var b = l(a);
                    if (b === null) {
                        throw new c(c.Errors.BadTimeStamp, "Malformed timestamp: " + f);
                    }
                    a = a.replace(/^[^\sa-zA-Z-]+/, "");
                    return b;
                }
                function g(c, a) {
                    var b = new j();
                    m(c, function(a, d) {
                        switch(a){
                            case "region":
                                for(var e = h.length - 1; e >= 0; e--){
                                    if (h[e].id === d) {
                                        b.set(a, h[e].region);
                                        break;
                                    }
                                }
                                break;
                            case "vertical":
                                b.alt(a, d, [
                                    "rl",
                                    "lr"
                                ]);
                                break;
                            case "line":
                                var c = d.split(","), f = c[0];
                                b.integer(a, f);
                                b.percent(a, f) ? b.set("snapToLines", false) : null;
                                b.alt(a, f, [
                                    "auto"
                                ]);
                                if (c.length === 2) {
                                    b.alt("lineAlign", c[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "position":
                                c = d.split(",");
                                b.percent(a, c[0]);
                                if (c.length === 2) {
                                    b.alt("positionAlign", c[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "size":
                                b.percent(a, d);
                                break;
                            case "align":
                                b.alt(a, d, [
                                    "start",
                                    "center",
                                    "end",
                                    "left",
                                    "right", 
                                ]);
                                break;
                        }
                    }, /:/, /\s/);
                    a.region = b.get("region", null);
                    a.vertical = b.get("vertical", "");
                    try {
                        a.line = b.get("line", "auto");
                    } catch (d) {}
                    a.lineAlign = b.get("lineAlign", "start");
                    a.snapToLines = b.get("snapToLines", true);
                    a.size = b.get("size", 100);
                    try {
                        a.align = b.get("align", "center");
                    } catch (e) {
                        a.align = b.get("align", "middle");
                    }
                    try {
                        a.position = b.get("position", "auto");
                    } catch (f) {
                        a.position = b.get("position", {
                            start: 0,
                            left: 0,
                            center: 50,
                            middle: 50,
                            end: 100,
                            right: 100
                        }, a.align);
                    }
                    a.positionAlign = b.get("positionAlign", {
                        start: "start",
                        left: "start",
                        center: "center",
                        middle: "center",
                        end: "end",
                        right: "end"
                    }, a.align);
                }
                function b() {
                    a = a.replace(/^\s+/, "");
                }
                b();
                d.startTime = e();
                b();
                if (a.substr(0, 3) !== "-->") {
                    throw new c(c.Errors.BadTimeStamp, "Malformed time stamp (time stamps must be separated by '-->'): " + f);
                }
                a = a.substr(3);
                b();
                d.endTime = e();
                b();
                g(a, d);
            }
            var o = f.createElement && f.createElement("textarea");
            var p = {
                c: "span",
                i: "i",
                b: "b",
                u: "u",
                ruby: "ruby",
                rt: "rt",
                v: "span",
                lang: "span"
            };
            var q = {
                white: "rgba(255,255,255,1)",
                lime: "rgba(0,255,0,1)",
                cyan: "rgba(0,255,255,1)",
                red: "rgba(255,0,0,1)",
                yellow: "rgba(255,255,0,1)",
                magenta: "rgba(255,0,255,1)",
                blue: "rgba(0,0,255,1)",
                black: "rgba(0,0,0,1)"
            };
            var r = {
                v: "title",
                lang: "lang"
            };
            var s = {
                rt: "ruby"
            };
            function t(f, t) {
                function j() {
                    if (!t) {
                        return null;
                    }
                    function b(a) {
                        t = t.substr(a.length);
                        return a;
                    }
                    var a = t.match(/^([^<]*)(<[^>]*>?)?/);
                    return b(a[1] ? a[1] : a[2]);
                }
                function k(a) {
                    o.innerHTML = a;
                    a = o.textContent;
                    o.textContent = "";
                    return a;
                }
                function m(b, a) {
                    return (!s[a.localName] || s[a.localName] === b.localName);
                }
                function n(a, b) {
                    var c = p[a];
                    if (!c) {
                        return null;
                    }
                    var d = f.document.createElement(c);
                    var e = r[a];
                    if (e && b) {
                        d[e] = b.trim();
                    }
                    return d;
                }
                var g = f.document.createElement("div"), c = g, a, e = [];
                while((a = j()) !== null){
                    if (a[0] === "<") {
                        if (a[1] === "/") {
                            if (e.length && e[e.length - 1] === a.substr(2).replace(">", "")) {
                                e.pop();
                                c = c.parentNode;
                            }
                            continue;
                        }
                        var h = l(a.substr(1, a.length - 2));
                        var b;
                        if (h) {
                            b = f.document.createProcessingInstruction("timestamp", h);
                            c.appendChild(b);
                            continue;
                        }
                        var d = a.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
                        if (!d) {
                            continue;
                        }
                        b = n(d[1], d[3]);
                        if (!b) {
                            continue;
                        }
                        if (!m(c, b)) {
                            continue;
                        }
                        if (d[2]) {
                            var i = d[2].split(".");
                            i.forEach(function(a) {
                                var c = /^bg_/.test(a);
                                var d = c ? a.slice(3) : a;
                                if (q.hasOwnProperty(d)) {
                                    var e = c ? "background-color" : "color";
                                    var f = q[d];
                                    b.style[e] = f;
                                }
                            });
                            b.className = i.join(" ");
                        }
                        e.push(d[1]);
                        c.appendChild(b);
                        c = b;
                        continue;
                    }
                    c.appendChild(f.document.createTextNode(k(a)));
                }
                return g;
            }
            var u = [
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
            function v(b) {
                for(var a = 0; a < u.length; a++){
                    var c = u[a];
                    if (b >= c[0] && b <= c[1]) {
                        return true;
                    }
                }
                return false;
            }
            function w(a) {
                var d = [], b = "", e;
                if (!a || !a.childNodes) {
                    return "ltr";
                }
                function f(c, b) {
                    for(var a = b.childNodes.length - 1; a >= 0; a--){
                        c.push(b.childNodes[a]);
                    }
                }
                function g(a) {
                    if (!a || !a.length) {
                        return null;
                    }
                    var b = a.pop(), c = b.textContent || b.innerText;
                    if (c) {
                        var d = c.match(/^.*(\n|\r)/);
                        if (d) {
                            a.length = 0;
                            return d[0];
                        }
                        return c;
                    }
                    if (b.tagName === "ruby") {
                        return g(a);
                    }
                    if (b.childNodes) {
                        f(a, b);
                        return g(a);
                    }
                }
                f(d, a);
                while((b = g(d))){
                    for(var c = 0; c < b.length; c++){
                        e = b.charCodeAt(c);
                        if (v(e)) {
                            return "rtl";
                        }
                    }
                }
                return "ltr";
            }
            function x(a) {
                if (typeof a.line === "number" && (a.snapToLines || (a.line >= 0 && a.line <= 100))) {
                    return a.line;
                }
                if (!a.track || !a.track.textTrackList || !a.track.textTrackList.mediaElement) {
                    return -1;
                }
                var d = a.track, c = d.textTrackList, e = 0;
                for(var b = 0; b < c.length && c[b] !== d; b++){
                    if (c[b].mode === "showing") {
                        e++;
                    }
                }
                return ++e * -1;
            }
            function d() {}
            d.prototype.applyStyles = function(a, b) {
                b = b || this.div;
                for(var c in a){
                    if (a.hasOwnProperty(c)) {
                        b.style[c] = a[c];
                    }
                }
            };
            d.prototype.formatStyle = function(a, b) {
                return a === 0 ? 0 : a + b;
            };
            function e(e, a, f) {
                d.call(this);
                this.cue = a;
                this.cueDiv = t(e, a.text);
                var c = {
                    color: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    position: "relative",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "inline",
                    writingMode: a.vertical === "" ? "horizontal-tb" : a.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext"
                };
                this.applyStyles(c, this.cueDiv);
                this.div = e.document.createElement("div");
                c = {
                    direction: w(this.cueDiv),
                    writingMode: a.vertical === "" ? "horizontal-tb" : a.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext",
                    textAlign: a.align === "middle" ? "center" : a.align,
                    font: f.font,
                    whiteSpace: "pre-line",
                    position: "absolute"
                };
                this.applyStyles(c);
                this.div.appendChild(this.cueDiv);
                var b = 0;
                switch(a.positionAlign){
                    case "start":
                        b = a.position;
                        break;
                    case "center":
                        b = a.position - a.size / 2;
                        break;
                    case "end":
                        b = a.position - a.size;
                        break;
                }
                if (a.vertical === "") {
                    this.applyStyles({
                        left: this.formatStyle(b, "%"),
                        width: this.formatStyle(a.size, "%")
                    });
                } else {
                    this.applyStyles({
                        top: this.formatStyle(b, "%"),
                        height: this.formatStyle(a.size, "%")
                    });
                }
                this.move = function(a) {
                    this.applyStyles({
                        top: this.formatStyle(a.top, "px"),
                        bottom: this.formatStyle(a.bottom, "px"),
                        left: this.formatStyle(a.left, "px"),
                        right: this.formatStyle(a.right, "px"),
                        height: this.formatStyle(a.height, "px"),
                        width: this.formatStyle(a.width, "px")
                    });
                };
            }
            e.prototype = g(d.prototype);
            e.prototype.constructor = e;
            function a(a) {
                var c, d, f, e;
                if (a.div) {
                    d = a.div.offsetHeight;
                    f = a.div.offsetWidth;
                    e = a.div.offsetTop;
                    var b = (b = a.div.childNodes) && (b = b[0]) && b.getClientRects && b.getClientRects();
                    a = a.div.getBoundingClientRect();
                    c = b ? Math.max((b[0] && b[0].height) || 0, a.height / b.length) : 0;
                }
                this.left = a.left;
                this.right = a.right;
                this.top = a.top || e;
                this.height = a.height || d;
                this.bottom = a.bottom || e + (a.height || d);
                this.width = a.width || f;
                this.lineHeight = c !== undefined ? c : a.lineHeight;
            }
            a.prototype.move = function(b, a) {
                a = a !== undefined ? a : this.lineHeight;
                switch(b){
                    case "+x":
                        this.left += a;
                        this.right += a;
                        break;
                    case "-x":
                        this.left -= a;
                        this.right -= a;
                        break;
                    case "+y":
                        this.top += a;
                        this.bottom += a;
                        break;
                    case "-y":
                        this.top -= a;
                        this.bottom -= a;
                        break;
                }
            };
            a.prototype.overlaps = function(a) {
                return (this.left < a.right && this.right > a.left && this.top < a.bottom && this.bottom > a.top);
            };
            a.prototype.overlapsAny = function(b) {
                for(var a = 0; a < b.length; a++){
                    if (this.overlaps(b[a])) {
                        return true;
                    }
                }
                return false;
            };
            a.prototype.within = function(a) {
                return (this.top >= a.top && this.bottom <= a.bottom && this.left >= a.left && this.right <= a.right);
            };
            a.prototype.overlapsOppositeAxis = function(a, b) {
                switch(b){
                    case "+x":
                        return this.left < a.left;
                    case "-x":
                        return this.right > a.right;
                    case "+y":
                        return this.top < a.top;
                    case "-y":
                        return this.bottom > a.bottom;
                }
            };
            a.prototype.intersectPercentage = function(a) {
                var b = Math.max(0, Math.min(this.right, a.right) - Math.max(this.left, a.left)), c = Math.max(0, Math.min(this.bottom, a.bottom) - Math.max(this.top, a.top)), d = b * c;
                return d / (this.height * this.width);
            };
            a.prototype.toCSSCompatValues = function(a) {
                return {
                    top: this.top - a.top,
                    bottom: a.bottom - this.bottom,
                    left: this.left - a.left,
                    right: a.right - this.right,
                    height: this.height,
                    width: this.width
                };
            };
            a.getSimpleBoxPosition = function(a) {
                var b = a.div ? a.div.offsetHeight : a.tagName ? a.offsetHeight : 0;
                var d = a.div ? a.div.offsetWidth : a.tagName ? a.offsetWidth : 0;
                var c = a.div ? a.div.offsetTop : a.tagName ? a.offsetTop : 0;
                a = a.div ? a.div.getBoundingClientRect() : a.tagName ? a.getBoundingClientRect() : a;
                var e = {
                    left: a.left,
                    right: a.right,
                    top: a.top || c,
                    height: a.height || b,
                    bottom: a.bottom || c + (a.height || b),
                    width: a.width || d
                };
                return e;
            };
            function y(p, b, g, q) {
                function m(b, d) {
                    var e, f = new a(b), h = 1;
                    for(var c = 0; c < d.length; c++){
                        while(b.overlapsOppositeAxis(g, d[c]) || (b.within(g) && b.overlapsAny(q))){
                            b.move(d[c]);
                        }
                        if (b.within(g)) {
                            return b;
                        }
                        var i = b.intersectPercentage(g);
                        if (h > i) {
                            e = new a(b);
                            h = i;
                        }
                        b = new a(f);
                    }
                    return e || f;
                }
                var h = new a(b), e = b.cue, d = x(e), c = [];
                if (e.snapToLines) {
                    var i;
                    switch(e.vertical){
                        case "":
                            c = [
                                "+y",
                                "-y"
                            ];
                            i = "height";
                            break;
                        case "rl":
                            c = [
                                "+x",
                                "-x"
                            ];
                            i = "width";
                            break;
                        case "lr":
                            c = [
                                "-x",
                                "+x"
                            ];
                            i = "width";
                            break;
                    }
                    var j = h.lineHeight, f = j * Math.round(d), k = g[i] + j, n = c[0];
                    if (Math.abs(f) > k) {
                        f = f < 0 ? -1 : 1;
                        f *= Math.ceil(k / j) * j;
                    }
                    if (d < 0) {
                        f += e.vertical === "" ? g.height : g.width;
                        c = c.reverse();
                    }
                    h.move(n, f);
                } else {
                    var l = (h.lineHeight / g.height) * 100;
                    switch(e.lineAlign){
                        case "center":
                            d -= l / 2;
                            break;
                        case "end":
                            d -= l;
                            break;
                    }
                    switch(e.vertical){
                        case "":
                            b.applyStyles({
                                top: b.formatStyle(d, "%")
                            });
                            break;
                        case "rl":
                            b.applyStyles({
                                left: b.formatStyle(d, "%")
                            });
                            break;
                        case "lr":
                            b.applyStyles({
                                right: b.formatStyle(d, "%")
                            });
                            break;
                    }
                    c = [
                        "+y",
                        "-x",
                        "+x",
                        "-y"
                    ];
                    h = new a(b);
                }
                var o = m(h, c);
                b.move(o.toCSSCompatValues(g));
            }
            function b() {}
            b.StringDecoder = function() {
                return {
                    decode: function(a) {
                        if (!a) {
                            return "";
                        }
                        if (typeof a !== "string") {
                            throw new Error("Error - expected string data.");
                        }
                        return decodeURIComponent(encodeURIComponent(a));
                    }
                };
            };
            b.convertCueToDOMTree = function(a, b) {
                if (!a || !b) {
                    return null;
                }
                return t(a, b);
            };
            var z = 0.05;
            var A = "sans-serif";
            var B = "1.5%";
            b.processCues = function(g, d, c) {
                if (!g || !d || !c) {
                    return null;
                }
                while(c.firstChild){
                    c.removeChild(c.firstChild);
                }
                var b = g.document.createElement("div");
                b.style.position = "absolute";
                b.style.left = "0";
                b.style.right = "0";
                b.style.top = "0";
                b.style.bottom = "0";
                b.style.margin = B;
                c.appendChild(b);
                function h(b) {
                    for(var a = 0; a < b.length; a++){
                        if (b[a].hasBeenReset || !b[a].displayState) {
                            return true;
                        }
                    }
                    return false;
                }
                if (!h(d)) {
                    for(var f = 0; f < d.length; f++){
                        b.appendChild(d[f].displayState);
                    }
                    return;
                }
                var k = [], i = a.getSimpleBoxPosition(b), j = Math.round(i.height * z * 100) / 100;
                var l = {
                    font: j + "px " + A
                };
                (function() {
                    var c, f;
                    for(var h = 0; h < d.length; h++){
                        f = d[h];
                        c = new e(g, f, l);
                        b.appendChild(c.div);
                        y(g, c, i, k);
                        f.displayState = c.div;
                        k.push(a.getSimpleBoxPosition(c));
                    }
                })();
            };
            b.Parser = function(c, a, b) {
                if (!b) {
                    b = a;
                    a = {};
                }
                if (!a) {
                    a = {};
                }
                this.window = c;
                this.vttjs = a;
                this.state = "INITIAL";
                this.buffer = "";
                this.decoder = b || new TextDecoder("utf8");
                this.regionList = [];
            };
            b.Parser.prototype = {
                reportOrThrowError: function(a) {
                    if (a instanceof c) {
                        this.onparsingerror && this.onparsingerror(a);
                    } else {
                        throw a;
                    }
                },
                parse: function(e) {
                    var a = this;
                    if (e) {
                        a.buffer += a.decoder.decode(e, {
                            stream: true
                        });
                    }
                    function f() {
                        var c = a.buffer;
                        var b = 0;
                        while(b < c.length && c[b] !== "\r" && c[b] !== "\n"){
                            ++b;
                        }
                        var d = c.substr(0, b);
                        if (c[b] === "\r") {
                            ++b;
                        }
                        if (c[b] === "\n") {
                            ++b;
                        }
                        a.buffer = c.substr(b);
                        return d;
                    }
                    function p(d) {
                        var b = new j();
                        m(d, function(a, d) {
                            switch(a){
                                case "id":
                                    b.set(a, d);
                                    break;
                                case "width":
                                    b.percent(a, d);
                                    break;
                                case "lines":
                                    b.integer(a, d);
                                    break;
                                case "regionanchor":
                                case "viewportanchor":
                                    var e = d.split(",");
                                    if (e.length !== 2) {
                                        break;
                                    }
                                    var c = new j();
                                    c.percent("x", e[0]);
                                    c.percent("y", e[1]);
                                    if (!c.has("x") || !c.has("y")) {
                                        break;
                                    }
                                    b.set(a + "X", c.get("x"));
                                    b.set(a + "Y", c.get("y"));
                                    break;
                                case "scroll":
                                    b.alt(a, d, [
                                        "up"
                                    ]);
                                    break;
                            }
                        }, /=/, /\s/);
                        if (b.has("id")) {
                            var c = new (a.vttjs.VTTRegion || a.window.VTTRegion)();
                            c.width = b.get("width", 100);
                            c.lines = b.get("lines", 3);
                            c.regionAnchorX = b.get("regionanchorX", 0);
                            c.regionAnchorY = b.get("regionanchorY", 100);
                            c.viewportAnchorX = b.get("viewportanchorX", 0);
                            c.viewportAnchorY = b.get("viewportanchorY", 100);
                            c.scroll = b.get("scroll", "");
                            a.onregion && a.onregion(c);
                            a.regionList.push({
                                id: b.get("id"),
                                region: c
                            });
                        }
                    }
                    function q(c) {
                        var b = new j();
                        m(c, function(a, c) {
                            switch(a){
                                case "MPEGT":
                                    b.integer(a + "S", c);
                                    break;
                                case "LOCA":
                                    b.set(a + "L", l(c));
                                    break;
                            }
                        }, /[^\d]:/, /,/);
                        a.ontimestampmap && a.ontimestampmap({
                            MPEGTS: b.get("MPEGTS"),
                            LOCAL: b.get("LOCAL")
                        });
                    }
                    function h(a) {
                        if (a.match(/X-TIMESTAMP-MAP/)) {
                            m(a, function(a, b) {
                                switch(a){
                                    case "X-TIMESTAMP-MAP":
                                        q(b);
                                        break;
                                }
                            }, /=/);
                        } else {
                            m(a, function(a, b) {
                                switch(a){
                                    case "Region":
                                        p(b);
                                        break;
                                }
                            }, /:/);
                        }
                    }
                    try {
                        var b;
                        if (a.state === "INITIAL") {
                            if (!/\r\n|\n/.test(a.buffer)) {
                                return this;
                            }
                            b = f();
                            var g = b.match(/^WEBVTT([ \t].*)?$/);
                            if (!g || !g[0]) {
                                throw new c(c.Errors.BadSignature);
                            }
                            a.state = "HEADER";
                        }
                        var d = false;
                        while(a.buffer){
                            if (!/\r\n|\n/.test(a.buffer)) {
                                return this;
                            }
                            if (!d) {
                                b = f();
                            } else {
                                d = false;
                            }
                            switch(a.state){
                                case "HEADER":
                                    if (/:/.test(b)) {
                                        h(b);
                                    } else if (!b) {
                                        a.state = "ID";
                                    }
                                    continue;
                                case "NOTE":
                                    if (!b) {
                                        a.state = "ID";
                                    }
                                    continue;
                                case "ID":
                                    if (/^NOTE($|[ \t])/.test(b)) {
                                        a.state = "NOTE";
                                        break;
                                    }
                                    if (!b) {
                                        continue;
                                    }
                                    a.cue = new (a.vttjs.VTTCue || a.window.VTTCue)(0, 0, "");
                                    try {
                                        a.cue.align = "center";
                                    } catch (r) {
                                        a.cue.align = "middle";
                                    }
                                    a.state = "CUE";
                                    if (b.indexOf("-->") === -1) {
                                        a.cue.id = b;
                                        continue;
                                    }
                                case "CUE":
                                    try {
                                        n(b, a.cue, a.regionList);
                                    } catch (i) {
                                        a.reportOrThrowError(i);
                                        a.cue = null;
                                        a.state = "BADCUE";
                                        continue;
                                    }
                                    a.state = "CUETEXT";
                                    continue;
                                case "CUETEXT":
                                    var k = b.indexOf("-->") !== -1;
                                    if (!b || (k && (d = true))) {
                                        a.oncue && a.oncue(a.cue);
                                        a.cue = null;
                                        a.state = "ID";
                                        continue;
                                    }
                                    if (a.cue.text) {
                                        a.cue.text += "\n";
                                    }
                                    a.cue.text += b.replace(/\u2028/g, "\n").replace(/u2029/g, "\n");
                                    continue;
                                case "BADCUE":
                                    if (!b) {
                                        a.state = "ID";
                                    }
                                    continue;
                            }
                        }
                    } catch (o) {
                        a.reportOrThrowError(o);
                        if (a.state === "CUETEXT" && a.cue && a.oncue) {
                            a.oncue(a.cue);
                        }
                        a.cue = null;
                        a.state = a.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
                    }
                    return this;
                },
                flush: function() {
                    var a = this;
                    try {
                        a.buffer += a.decoder.decode();
                        if (a.cue || a.state === "HEADER") {
                            a.buffer += "\n\n";
                            a.parse();
                        }
                        if (a.state === "INITIAL") {
                            throw new c(c.Errors.BadSignature);
                        }
                    } catch (b) {
                        a.reportOrThrowError(b);
                    }
                    a.onflush && a.onflush();
                    return this;
                }
            };
            h.exports = b;
        },
        2230: function(b) {
            var c = "auto";
            var d = {
                "": 1,
                lr: 1,
                rl: 1
            };
            var e = {
                start: 1,
                center: 1,
                end: 1,
                left: 1,
                right: 1,
                auto: 1,
                "line-left": 1,
                "line-right": 1
            };
            function f(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var b = d[a.toLowerCase()];
                return b ? a.toLowerCase() : false;
            }
            function g(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var b = e[a.toLowerCase()];
                return b ? a.toLowerCase() : false;
            }
            function a(a, b, d) {
                this.hasBeenReset = false;
                var e = "";
                var h = false;
                var i = a;
                var j = b;
                var k = d;
                var l = null;
                var m = "";
                var n = true;
                var o = "auto";
                var p = "start";
                var q = "auto";
                var r = "auto";
                var s = 100;
                var t = "center";
                Object.defineProperties(this, {
                    id: {
                        enumerable: true,
                        get: function() {
                            return e;
                        },
                        set: function(a) {
                            e = "" + a;
                        }
                    },
                    pauseOnExit: {
                        enumerable: true,
                        get: function() {
                            return h;
                        },
                        set: function(a) {
                            h = !!a;
                        }
                    },
                    startTime: {
                        enumerable: true,
                        get: function() {
                            return i;
                        },
                        set: function(a) {
                            if (typeof a !== "number") {
                                throw new TypeError("Start time must be set to a number.");
                            }
                            i = a;
                            this.hasBeenReset = true;
                        }
                    },
                    endTime: {
                        enumerable: true,
                        get: function() {
                            return j;
                        },
                        set: function(a) {
                            if (typeof a !== "number") {
                                throw new TypeError("End time must be set to a number.");
                            }
                            j = a;
                            this.hasBeenReset = true;
                        }
                    },
                    text: {
                        enumerable: true,
                        get: function() {
                            return k;
                        },
                        set: function(a) {
                            k = "" + a;
                            this.hasBeenReset = true;
                        }
                    },
                    region: {
                        enumerable: true,
                        get: function() {
                            return l;
                        },
                        set: function(a) {
                            l = a;
                            this.hasBeenReset = true;
                        }
                    },
                    vertical: {
                        enumerable: true,
                        get: function() {
                            return m;
                        },
                        set: function(b) {
                            var a = f(b);
                            if (a === false) {
                                throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
                            }
                            m = a;
                            this.hasBeenReset = true;
                        }
                    },
                    snapToLines: {
                        enumerable: true,
                        get: function() {
                            return n;
                        },
                        set: function(a) {
                            n = !!a;
                            this.hasBeenReset = true;
                        }
                    },
                    line: {
                        enumerable: true,
                        get: function() {
                            return o;
                        },
                        set: function(a) {
                            if (typeof a !== "number" && a !== c) {
                                throw new SyntaxError("Line: an invalid number or illegal string was specified.");
                            }
                            o = a;
                            this.hasBeenReset = true;
                        }
                    },
                    lineAlign: {
                        enumerable: true,
                        get: function() {
                            return p;
                        },
                        set: function(b) {
                            var a = g(b);
                            if (!a) {
                                console.warn("lineAlign: an invalid or illegal string was specified.");
                            } else {
                                p = a;
                                this.hasBeenReset = true;
                            }
                        }
                    },
                    position: {
                        enumerable: true,
                        get: function() {
                            return q;
                        },
                        set: function(a) {
                            if (a < 0 || a > 100) {
                                throw new Error("Position must be between 0 and 100.");
                            }
                            q = a;
                            this.hasBeenReset = true;
                        }
                    },
                    positionAlign: {
                        enumerable: true,
                        get: function() {
                            return r;
                        },
                        set: function(b) {
                            var a = g(b);
                            if (!a) {
                                console.warn("positionAlign: an invalid or illegal string was specified.");
                            } else {
                                r = a;
                                this.hasBeenReset = true;
                            }
                        }
                    },
                    size: {
                        enumerable: true,
                        get: function() {
                            return s;
                        },
                        set: function(a) {
                            if (a < 0 || a > 100) {
                                throw new Error("Size must be between 0 and 100.");
                            }
                            s = a;
                            this.hasBeenReset = true;
                        }
                    },
                    align: {
                        enumerable: true,
                        get: function() {
                            return t;
                        },
                        set: function(b) {
                            var a = g(b);
                            if (!a) {
                                throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
                            }
                            t = a;
                            this.hasBeenReset = true;
                        }
                    }
                });
                this.displayState = undefined;
            }
            a.prototype.getCueAsHTML = function() {
                return WebVTT.convertCueToDOMTree(window, this.text);
            };
            b.exports = a;
        },
        3710: function(a) {
            var c = {
                "": true,
                up: true
            };
            function d(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var b = c[a.toLowerCase()];
                return b ? a.toLowerCase() : false;
            }
            function e(a) {
                return typeof a === "number" && a >= 0 && a <= 100;
            }
            function b() {
                var a = 100;
                var b = 3;
                var c = 0;
                var f = 100;
                var g = 0;
                var h = 100;
                var i = "";
                Object.defineProperties(this, {
                    width: {
                        enumerable: true,
                        get: function() {
                            return a;
                        },
                        set: function(b) {
                            if (!e(b)) {
                                throw new Error("Width must be between 0 and 100.");
                            }
                            a = b;
                        }
                    },
                    lines: {
                        enumerable: true,
                        get: function() {
                            return b;
                        },
                        set: function(a) {
                            if (typeof a !== "number") {
                                throw new TypeError("Lines must be set to a number.");
                            }
                            b = a;
                        }
                    },
                    regionAnchorY: {
                        enumerable: true,
                        get: function() {
                            return f;
                        },
                        set: function(a) {
                            if (!e(a)) {
                                throw new Error("RegionAnchorX must be between 0 and 100.");
                            }
                            f = a;
                        }
                    },
                    regionAnchorX: {
                        enumerable: true,
                        get: function() {
                            return c;
                        },
                        set: function(a) {
                            if (!e(a)) {
                                throw new Error("RegionAnchorY must be between 0 and 100.");
                            }
                            c = a;
                        }
                    },
                    viewportAnchorY: {
                        enumerable: true,
                        get: function() {
                            return h;
                        },
                        set: function(a) {
                            if (!e(a)) {
                                throw new Error("ViewportAnchorY must be between 0 and 100.");
                            }
                            h = a;
                        }
                    },
                    viewportAnchorX: {
                        enumerable: true,
                        get: function() {
                            return g;
                        },
                        set: function(a) {
                            if (!e(a)) {
                                throw new Error("ViewportAnchorX must be between 0 and 100.");
                            }
                            g = a;
                        }
                    },
                    scroll: {
                        enumerable: true,
                        get: function() {
                            return i;
                        },
                        set: function(b) {
                            var a = d(b);
                            if (a === false) {
                                console.warn("Scroll: an invalid or illegal string was specified.");
                            } else {
                                i = a;
                            }
                        }
                    }
                });
            }
            a.exports = b;
        },
        4782: function(g, b) {
            "use strict";
            b.byteLength = j;
            b.toByteArray = l;
            b.fromByteArray = o;
            var e = [];
            var c = [];
            var h = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var a = 0, f = d.length; a < f; ++a){
                e[a] = d[a];
                c[d.charCodeAt(a)] = a;
            }
            c["-".charCodeAt(0)] = 62;
            c["_".charCodeAt(0)] = 63;
            function i(c) {
                var b = c.length;
                if (b % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var a = c.indexOf("=");
                if (a === -1) a = b;
                var d = a === b ? 0 : 4 - (a % 4);
                return [
                    a,
                    d
                ];
            }
            function j(c) {
                var a = i(c);
                var d = a[0];
                var b = a[1];
                return ((d + b) * 3) / 4 - b;
            }
            function k(c, b, a) {
                return ((b + a) * 3) / 4 - a;
            }
            function l(b) {
                var d;
                var l = i(b);
                var j = l[0];
                var g = l[1];
                var e = new h(k(b, j, g));
                var f = 0;
                var m = g > 0 ? j - 4 : j;
                var a;
                for(a = 0; a < m; a += 4){
                    d = (c[b.charCodeAt(a)] << 18) | (c[b.charCodeAt(a + 1)] << 12) | (c[b.charCodeAt(a + 2)] << 6) | c[b.charCodeAt(a + 3)];
                    e[f++] = (d >> 16) & 0xff;
                    e[f++] = (d >> 8) & 0xff;
                    e[f++] = d & 0xff;
                }
                if (g === 2) {
                    d = (c[b.charCodeAt(a)] << 2) | (c[b.charCodeAt(a + 1)] >> 4);
                    e[f++] = d & 0xff;
                }
                if (g === 1) {
                    d = (c[b.charCodeAt(a)] << 10) | (c[b.charCodeAt(a + 1)] << 4) | (c[b.charCodeAt(a + 2)] >> 2);
                    e[f++] = (d >> 8) & 0xff;
                    e[f++] = d & 0xff;
                }
                return e;
            }
            function m(a) {
                return (e[(a >> 18) & 0x3f] + e[(a >> 12) & 0x3f] + e[(a >> 6) & 0x3f] + e[a & 0x3f]);
            }
            function n(b, e, f) {
                var c;
                var d = [];
                for(var a = e; a < f; a += 3){
                    c = ((b[a] << 16) & 0xff0000) + ((b[a + 1] << 8) & 0xff00) + (b[a + 2] & 0xff);
                    d.push(m(c));
                }
                return d.join("");
            }
            function o(b) {
                var a;
                var c = b.length;
                var g = c % 3;
                var f = [];
                var h = 16383;
                for(var d = 0, i = c - g; d < i; d += h){
                    f.push(n(b, d, d + h > i ? i : d + h));
                }
                if (g === 1) {
                    a = b[c - 1];
                    f.push(e[a >> 2] + e[(a << 4) & 0x3f] + "==");
                } else if (g === 2) {
                    a = (b[c - 2] << 8) + b[c - 1];
                    f.push(e[a >> 10] + e[(a >> 4) & 0x3f] + e[(a << 2) & 0x3f] + "=");
                }
                return f.join("");
            }
        },
        816: function(g, b, c) {
            "use strict";
            var h = c(4782);
            var i = c(8898);
            var d = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            b.Buffer = a;
            b.SlowBuffer = u;
            b.INSPECT_MAX_BYTES = 50;
            var e = 0x7fffffff;
            b.kMaxLength = e;
            a.TYPED_ARRAY_SUPPORT = j();
            if (!a.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function j() {
                try {
                    var a = new Uint8Array(1);
                    var b = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(b, Uint8Array.prototype);
                    Object.setPrototypeOf(a, b);
                    return a.foo() === 42;
                } catch (c) {
                    return false;
                }
            }
            Object.defineProperty(a.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!a.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(a.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!a.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function k(b) {
                if (b > e) {
                    throw new RangeError('The value "' + b + '" is invalid for option "size"');
                }
                var c = new Uint8Array(b);
                Object.setPrototypeOf(c, a.prototype);
                return c;
            }
            function a(a, b, c) {
                if (typeof a === "number") {
                    if (typeof b === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return o(a);
                }
                return l(a, b, c);
            }
            a.poolSize = 8192;
            function l(b, c, d) {
                if (typeof b === "string") {
                    return p(b, c);
                }
                if (ArrayBuffer.isView(b)) {
                    return q(b);
                }
                if (b == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof b);
                }
                if (Z(b, ArrayBuffer) || (b && Z(b.buffer, ArrayBuffer))) {
                    return r(b, c, d);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (Z(b, SharedArrayBuffer) || (b && Z(b.buffer, SharedArrayBuffer)))) {
                    return r(b, c, d);
                }
                if (typeof b === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var e = b.valueOf && b.valueOf();
                if (e != null && e !== b) {
                    return a.from(e, c, d);
                }
                var f = s(b);
                if (f) return f;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof b[Symbol.toPrimitive] === "function") {
                    return a.from(b[Symbol.toPrimitive]("string"), c, d);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof b);
            }
            a.from = function(a, b, c) {
                return l(a, b, c);
            };
            Object.setPrototypeOf(a.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(a, Uint8Array);
            function m(a) {
                if (typeof a !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (a < 0) {
                    throw new RangeError('The value "' + a + '" is invalid for option "size"');
                }
            }
            function n(a, b, c) {
                m(a);
                if (a <= 0) {
                    return k(a);
                }
                if (b !== undefined) {
                    return typeof c === "string" ? k(a).fill(b, c) : k(a).fill(b);
                }
                return k(a);
            }
            a.alloc = function(a, b, c) {
                return n(a, b, c);
            };
            function o(a) {
                m(a);
                return k(a < 0 ? 0 : t(a) | 0);
            }
            a.allocUnsafe = function(a) {
                return o(a);
            };
            a.allocUnsafeSlow = function(a) {
                return o(a);
            };
            function p(d, b) {
                if (typeof b !== "string" || b === "") {
                    b = "utf8";
                }
                if (!a.isEncoding(b)) {
                    throw new TypeError("Unknown encoding: " + b);
                }
                var e = f(d, b) | 0;
                var c = k(e);
                var g = c.write(d, b);
                if (g !== e) {
                    c = c.slice(0, g);
                }
                return c;
            }
            function q(b) {
                var c = b.length < 0 ? 0 : t(b.length) | 0;
                var d = k(c);
                for(var a = 0; a < c; a += 1){
                    d[a] = b[a] & 255;
                }
                return d;
            }
            function r(c, b, e) {
                if (b < 0 || c.byteLength < b) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (c.byteLength < b + (e || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var d;
                if (b === undefined && e === undefined) {
                    d = new Uint8Array(c);
                } else if (e === undefined) {
                    d = new Uint8Array(c, b);
                } else {
                    d = new Uint8Array(c, b, e);
                }
                Object.setPrototypeOf(d, a.prototype);
                return d;
            }
            function s(b) {
                if (a.isBuffer(b)) {
                    var d = t(b.length) | 0;
                    var c = k(d);
                    if (c.length === 0) {
                        return c;
                    }
                    b.copy(c, 0, 0, d);
                    return c;
                }
                if (b.length !== undefined) {
                    if (typeof b.length !== "number" || $(b.length)) {
                        return k(0);
                    }
                    return q(b);
                }
                if (b.type === "Buffer" && Array.isArray(b.data)) {
                    return q(b.data);
                }
            }
            function t(a) {
                if (a >= e) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + e.toString(16) + " bytes");
                }
                return a | 0;
            }
            function u(b) {
                if (+b != b) {
                    b = 0;
                }
                return a.alloc(+b);
            }
            a.isBuffer = function c(b) {
                return (b != null && b._isBuffer === true && b !== a.prototype);
            };
            a.compare = function h(b, c) {
                if (Z(b, Uint8Array)) b = a.from(b, b.offset, b.byteLength);
                if (Z(c, Uint8Array)) c = a.from(c, c.offset, c.byteLength);
                if (!a.isBuffer(b) || !a.isBuffer(c)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (b === c) return 0;
                var e = b.length;
                var f = c.length;
                for(var d = 0, g = Math.min(e, f); d < g; ++d){
                    if (b[d] !== c[d]) {
                        e = b[d];
                        f = c[d];
                        break;
                    }
                }
                if (e < f) return -1;
                if (f < e) return 1;
                return 0;
            };
            a.isEncoding = function b(a) {
                switch(String(a).toLowerCase()){
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
            a.concat = function h(c, e) {
                if (!Array.isArray(c)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (c.length === 0) {
                    return a.alloc(0);
                }
                var b;
                if (e === undefined) {
                    e = 0;
                    for(b = 0; b < c.length; ++b){
                        e += c[b].length;
                    }
                }
                var f = a.allocUnsafe(e);
                var g = 0;
                for(b = 0; b < c.length; ++b){
                    var d = c[b];
                    if (Z(d, Uint8Array)) {
                        d = a.from(d);
                    }
                    if (!a.isBuffer(d)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    d.copy(f, g);
                    g += d.length;
                }
                return f;
            };
            function f(b, d) {
                if (a.isBuffer(b)) {
                    return b.length;
                }
                if (ArrayBuffer.isView(b) || Z(b, ArrayBuffer)) {
                    return b.byteLength;
                }
                if (typeof b !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof b);
                }
                var c = b.length;
                var e = arguments.length > 2 && arguments[2] === true;
                if (!e && c === 0) return 0;
                var f = false;
                for(;;){
                    switch(d){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return c;
                        case "utf8":
                        case "utf-8":
                            return U(b).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return c * 2;
                        case "hex":
                            return c >>> 1;
                        case "base64":
                            return X(b).length;
                        default:
                            if (f) {
                                return e ? -1 : U(b).length;
                            }
                            d = ("" + d).toLowerCase();
                            f = true;
                    }
                }
            }
            a.byteLength = f;
            function v(c, a, b) {
                var d = false;
                if (a === undefined || a < 0) {
                    a = 0;
                }
                if (a > this.length) {
                    return "";
                }
                if (b === undefined || b > this.length) {
                    b = this.length;
                }
                if (b <= 0) {
                    return "";
                }
                b >>>= 0;
                a >>>= 0;
                if (b <= a) {
                    return "";
                }
                if (!c) c = "utf8";
                while(true){
                    switch(c){
                        case "hex":
                            return L(this, a, b);
                        case "utf8":
                        case "utf-8":
                            return G(this, a, b);
                        case "ascii":
                            return J(this, a, b);
                        case "latin1":
                        case "binary":
                            return K(this, a, b);
                        case "base64":
                            return F(this, a, b);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return M(this, a, b);
                        default:
                            if (d) throw new TypeError("Unknown encoding: " + c);
                            c = (c + "").toLowerCase();
                            d = true;
                    }
                }
            }
            a.prototype._isBuffer = true;
            function w(a, b, c) {
                var d = a[b];
                a[b] = a[c];
                a[c] = d;
            }
            a.prototype.swap16 = function c() {
                var b = this.length;
                if (b % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var a = 0; a < b; a += 2){
                    w(this, a, a + 1);
                }
                return this;
            };
            a.prototype.swap32 = function c() {
                var b = this.length;
                if (b % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var a = 0; a < b; a += 4){
                    w(this, a, a + 3);
                    w(this, a + 1, a + 2);
                }
                return this;
            };
            a.prototype.swap64 = function c() {
                var b = this.length;
                if (b % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var a = 0; a < b; a += 8){
                    w(this, a, a + 7);
                    w(this, a + 1, a + 6);
                    w(this, a + 2, a + 5);
                    w(this, a + 3, a + 4);
                }
                return this;
            };
            a.prototype.toString = function b() {
                var a = this.length;
                if (a === 0) return "";
                if (arguments.length === 0) return G(this, 0, a);
                return v.apply(this, arguments);
            };
            a.prototype.toLocaleString = a.prototype.toString;
            a.prototype.equals = function c(b) {
                if (!a.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                if (this === b) return true;
                return a.compare(this, b) === 0;
            };
            a.prototype.inspect = function d() {
                var a = "";
                var c = b.INSPECT_MAX_BYTES;
                a = this.toString("hex", 0, c).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > c) a += " ... ";
                return "<Buffer " + a + ">";
            };
            if (d) {
                a.prototype[d] = a.prototype.inspect;
            }
            a.prototype.compare = function m(b, c, d, e, f) {
                if (Z(b, Uint8Array)) {
                    b = a.from(b, b.offset, b.byteLength);
                }
                if (!a.isBuffer(b)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof b);
                }
                if (c === undefined) {
                    c = 0;
                }
                if (d === undefined) {
                    d = b ? b.length : 0;
                }
                if (e === undefined) {
                    e = 0;
                }
                if (f === undefined) {
                    f = this.length;
                }
                if (c < 0 || d > b.length || e < 0 || f > this.length) {
                    throw new RangeError("out of range index");
                }
                if (e >= f && c >= d) {
                    return 0;
                }
                if (e >= f) {
                    return -1;
                }
                if (c >= d) {
                    return 1;
                }
                c >>>= 0;
                d >>>= 0;
                e >>>= 0;
                f >>>= 0;
                if (this === b) return 0;
                var h = f - e;
                var i = d - c;
                var l = Math.min(h, i);
                var j = this.slice(e, f);
                var k = b.slice(c, d);
                for(var g = 0; g < l; ++g){
                    if (j[g] !== k[g]) {
                        h = j[g];
                        i = k[g];
                        break;
                    }
                }
                if (h < i) return -1;
                if (i < h) return 1;
                return 0;
            };
            function x(d, c, b, f, e) {
                if (d.length === 0) return -1;
                if (typeof b === "string") {
                    f = b;
                    b = 0;
                } else if (b > 0x7fffffff) {
                    b = 0x7fffffff;
                } else if (b < -0x80000000) {
                    b = -0x80000000;
                }
                b = +b;
                if ($(b)) {
                    b = e ? 0 : d.length - 1;
                }
                if (b < 0) b = d.length + b;
                if (b >= d.length) {
                    if (e) return -1;
                    else b = d.length - 1;
                } else if (b < 0) {
                    if (e) b = 0;
                    else return -1;
                }
                if (typeof c === "string") {
                    c = a.from(c, f);
                }
                if (a.isBuffer(c)) {
                    if (c.length === 0) {
                        return -1;
                    }
                    return y(d, c, b, f, e);
                } else if (typeof c === "number") {
                    c = c & 0xff;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (e) {
                            return Uint8Array.prototype.indexOf.call(d, c, b);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(d, c, b);
                        }
                    }
                    return y(d, [
                        c
                    ], b, f, e);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function y(f, g, d, c, m) {
                var k = 1;
                var h = f.length;
                var e = g.length;
                if (c !== undefined) {
                    c = String(c).toLowerCase();
                    if (c === "ucs2" || c === "ucs-2" || c === "utf16le" || c === "utf-16le") {
                        if (f.length < 2 || g.length < 2) {
                            return -1;
                        }
                        k = 2;
                        h /= 2;
                        e /= 2;
                        d /= 2;
                    }
                }
                function i(a, b) {
                    if (k === 1) {
                        return a[b];
                    } else {
                        return a.readUInt16BE(b * k);
                    }
                }
                var a;
                if (m) {
                    var b = -1;
                    for(a = d; a < h; a++){
                        if (i(f, a) === i(g, b === -1 ? 0 : a - b)) {
                            if (b === -1) b = a;
                            if (a - b + 1 === e) return b * k;
                        } else {
                            if (b !== -1) a -= a - b;
                            b = -1;
                        }
                    }
                } else {
                    if (d + e > h) d = h - e;
                    for(a = d; a >= 0; a--){
                        var l = true;
                        for(var j = 0; j < e; j++){
                            if (i(f, a + j) !== i(g, j)) {
                                l = false;
                                break;
                            }
                        }
                        if (l) return a;
                    }
                }
                return -1;
            }
            a.prototype.includes = function d(a, b, c) {
                return this.indexOf(a, b, c) !== -1;
            };
            a.prototype.indexOf = function d(a, b, c) {
                return x(this, a, b, c, true);
            };
            a.prototype.lastIndexOf = function d(a, b, c) {
                return x(this, a, b, c, false);
            };
            function z(e, f, c, a) {
                c = Number(c) || 0;
                var d = e.length - c;
                if (!a) {
                    a = d;
                } else {
                    a = Number(a);
                    if (a > d) {
                        a = d;
                    }
                }
                var g = f.length;
                if (a > g / 2) {
                    a = g / 2;
                }
                for(var b = 0; b < a; ++b){
                    var h = parseInt(f.substr(b * 2, 2), 16);
                    if ($(h)) return b;
                    e[c + b] = h;
                }
                return b;
            }
            function A(a, c, b, d) {
                return Y(U(c, a.length - b), a, b, d);
            }
            function B(a, b, c, d) {
                return Y(V(b), a, c, d);
            }
            function C(a, b, c, d) {
                return B(a, b, c, d);
            }
            function D(a, b, c, d) {
                return Y(X(b), a, c, d);
            }
            function E(a, c, b, d) {
                return Y(W(c, a.length - b), a, b, d);
            }
            a.prototype.write = function g(d, b, a, c) {
                if (b === undefined) {
                    c = "utf8";
                    a = this.length;
                    b = 0;
                } else if (a === undefined && typeof b === "string") {
                    c = b;
                    a = this.length;
                    b = 0;
                } else if (isFinite(b)) {
                    b = b >>> 0;
                    if (isFinite(a)) {
                        a = a >>> 0;
                        if (c === undefined) c = "utf8";
                    } else {
                        c = a;
                        a = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var e = this.length - b;
                if (a === undefined || a > e) a = e;
                if ((d.length > 0 && (a < 0 || b < 0)) || b > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!c) c = "utf8";
                var f = false;
                for(;;){
                    switch(c){
                        case "hex":
                            return z(this, d, b, a);
                        case "utf8":
                        case "utf-8":
                            return A(this, d, b, a);
                        case "ascii":
                            return B(this, d, b, a);
                        case "latin1":
                        case "binary":
                            return C(this, d, b, a);
                        case "base64":
                            return D(this, d, b, a);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return E(this, d, b, a);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + c);
                            c = ("" + c).toLowerCase();
                            f = true;
                    }
                }
            };
            a.prototype.toJSON = function a() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function F(a, b, c) {
                if (b === 0 && c === a.length) {
                    return h.fromByteArray(a);
                } else {
                    return h.fromByteArray(a.slice(b, c));
                }
            }
            function G(e, l, h) {
                h = Math.min(e.length, h);
                var j = [];
                var c = l;
                while(c < h){
                    var f = e[c];
                    var a = null;
                    var i = f > 0xef ? 4 : f > 0xdf ? 3 : f > 0xbf ? 2 : 1;
                    if (c + i <= h) {
                        var d, g, k, b;
                        switch(i){
                            case 1:
                                if (f < 0x80) {
                                    a = f;
                                }
                                break;
                            case 2:
                                d = e[c + 1];
                                if ((d & 0xc0) === 0x80) {
                                    b = ((f & 0x1f) << 0x6) | (d & 0x3f);
                                    if (b > 0x7f) {
                                        a = b;
                                    }
                                }
                                break;
                            case 3:
                                d = e[c + 1];
                                g = e[c + 2];
                                if ((d & 0xc0) === 0x80 && (g & 0xc0) === 0x80) {
                                    b = ((f & 0xf) << 0xc) | ((d & 0x3f) << 0x6) | (g & 0x3f);
                                    if (b > 0x7ff && (b < 0xd800 || b > 0xdfff)) {
                                        a = b;
                                    }
                                }
                                break;
                            case 4:
                                d = e[c + 1];
                                g = e[c + 2];
                                k = e[c + 3];
                                if ((d & 0xc0) === 0x80 && (g & 0xc0) === 0x80 && (k & 0xc0) === 0x80) {
                                    b = ((f & 0xf) << 0x12) | ((d & 0x3f) << 0xc) | ((g & 0x3f) << 0x6) | (k & 0x3f);
                                    if (b > 0xffff && b < 0x110000) {
                                        a = b;
                                    }
                                }
                        }
                    }
                    if (a === null) {
                        a = 0xfffd;
                        i = 1;
                    } else if (a > 0xffff) {
                        a -= 0x10000;
                        j.push(((a >>> 10) & 0x3ff) | 0xd800);
                        a = 0xdc00 | (a & 0x3ff);
                    }
                    j.push(a);
                    c += i;
                }
                return I(j);
            }
            var H = 0x1000;
            function I(a) {
                var c = a.length;
                if (c <= H) {
                    return String.fromCharCode.apply(String, a);
                }
                var d = "";
                var b = 0;
                while(b < c){
                    d += String.fromCharCode.apply(String, a.slice(b, (b += H)));
                }
                return d;
            }
            function J(c, e, a) {
                var d = "";
                a = Math.min(c.length, a);
                for(var b = e; b < a; ++b){
                    d += String.fromCharCode(c[b] & 0x7f);
                }
                return d;
            }
            function K(c, e, a) {
                var d = "";
                a = Math.min(c.length, a);
                for(var b = e; b < a; ++b){
                    d += String.fromCharCode(c[b]);
                }
                return d;
            }
            function L(d, b, a) {
                var e = d.length;
                if (!b || b < 0) b = 0;
                if (!a || a < 0 || a > e) a = e;
                var f = "";
                for(var c = b; c < a; ++c){
                    f += _[d[c]];
                }
                return f;
            }
            function M(d, e, f) {
                var b = d.slice(e, f);
                var c = "";
                for(var a = 0; a < b.length; a += 2){
                    c += String.fromCharCode(b[a] + b[a + 1] * 256);
                }
                return c;
            }
            a.prototype.slice = function f(c, b) {
                var d = this.length;
                c = ~~c;
                b = b === undefined ? d : ~~b;
                if (c < 0) {
                    c += d;
                    if (c < 0) c = 0;
                } else if (c > d) {
                    c = d;
                }
                if (b < 0) {
                    b += d;
                    if (b < 0) b = 0;
                } else if (b > d) {
                    b = d;
                }
                if (b < c) b = c;
                var e = this.subarray(c, b);
                Object.setPrototypeOf(e, a.prototype);
                return e;
            };
            function N(a, b, c) {
                if (a % 1 !== 0 || a < 0) throw new RangeError("offset is not uint");
                if (a + b > c) throw new RangeError("Trying to access beyond buffer length");
            }
            a.prototype.readUIntLE = function g(a, b, f) {
                a = a >>> 0;
                b = b >>> 0;
                if (!f) N(a, b, this.length);
                var c = this[a];
                var d = 1;
                var e = 0;
                while(++e < b && (d *= 0x100)){
                    c += this[a + e] * d;
                }
                return c;
            };
            a.prototype.readUIntBE = function f(b, a, e) {
                b = b >>> 0;
                a = a >>> 0;
                if (!e) {
                    N(b, a, this.length);
                }
                var c = this[b + --a];
                var d = 1;
                while(a > 0 && (d *= 0x100)){
                    c += this[b + --a] * d;
                }
                return c;
            };
            a.prototype.readUInt8 = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 1, this.length);
                return this[a];
            };
            a.prototype.readUInt16LE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 2, this.length);
                return this[a] | (this[a + 1] << 8);
            };
            a.prototype.readUInt16BE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 2, this.length);
                return (this[a] << 8) | this[a + 1];
            };
            a.prototype.readUInt32LE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return ((this[a] | (this[a + 1] << 8) | (this[a + 2] << 16)) + this[a + 3] * 0x1000000);
            };
            a.prototype.readUInt32BE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return (this[a] * 0x1000000 + ((this[a + 1] << 16) | (this[a + 2] << 8) | this[a + 3]));
            };
            a.prototype.readIntLE = function g(a, b, f) {
                a = a >>> 0;
                b = b >>> 0;
                if (!f) N(a, b, this.length);
                var c = this[a];
                var d = 1;
                var e = 0;
                while(++e < b && (d *= 0x100)){
                    c += this[a + e] * d;
                }
                d *= 0x80;
                if (c >= d) c -= Math.pow(2, 8 * b);
                return c;
            };
            a.prototype.readIntBE = function g(a, b, f) {
                a = a >>> 0;
                b = b >>> 0;
                if (!f) N(a, b, this.length);
                var e = b;
                var c = 1;
                var d = this[a + --e];
                while(e > 0 && (c *= 0x100)){
                    d += this[a + --e] * c;
                }
                c *= 0x80;
                if (d >= c) d -= Math.pow(2, 8 * b);
                return d;
            };
            a.prototype.readInt8 = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 1, this.length);
                if (!(this[a] & 0x80)) return this[a];
                return (0xff - this[a] + 1) * -1;
            };
            a.prototype.readInt16LE = function d(a, c) {
                a = a >>> 0;
                if (!c) N(a, 2, this.length);
                var b = this[a] | (this[a + 1] << 8);
                return b & 0x8000 ? b | 0xffff0000 : b;
            };
            a.prototype.readInt16BE = function d(a, c) {
                a = a >>> 0;
                if (!c) N(a, 2, this.length);
                var b = this[a + 1] | (this[a] << 8);
                return b & 0x8000 ? b | 0xffff0000 : b;
            };
            a.prototype.readInt32LE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return (this[a] | (this[a + 1] << 8) | (this[a + 2] << 16) | (this[a + 3] << 24));
            };
            a.prototype.readInt32BE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return ((this[a] << 24) | (this[a + 1] << 16) | (this[a + 2] << 8) | this[a + 3]);
            };
            a.prototype.readFloatLE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return i.read(this, a, true, 23, 4);
            };
            a.prototype.readFloatBE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 4, this.length);
                return i.read(this, a, false, 23, 4);
            };
            a.prototype.readDoubleLE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 8, this.length);
                return i.read(this, a, true, 52, 8);
            };
            a.prototype.readDoubleBE = function c(a, b) {
                a = a >>> 0;
                if (!b) N(a, 8, this.length);
                return i.read(this, a, false, 52, 8);
            };
            function O(b, c, d, e, f, g) {
                if (!a.isBuffer(b)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (c > f || c < g) throw new RangeError('"value" argument is out of bounds');
                if (d + e > b.length) throw new RangeError("Index out of range");
            }
            a.prototype.writeUIntLE = function h(c, a, b, f) {
                c = +c;
                a = a >>> 0;
                b = b >>> 0;
                if (!f) {
                    var g = Math.pow(2, 8 * b) - 1;
                    O(this, c, a, b, g, 0);
                }
                var d = 1;
                var e = 0;
                this[a] = c & 0xff;
                while(++e < b && (d *= 0x100)){
                    this[a + e] = (c / d) & 0xff;
                }
                return a + b;
            };
            a.prototype.writeUIntBE = function h(c, a, b, f) {
                c = +c;
                a = a >>> 0;
                b = b >>> 0;
                if (!f) {
                    var g = Math.pow(2, 8 * b) - 1;
                    O(this, c, a, b, g, 0);
                }
                var d = b - 1;
                var e = 1;
                this[a + d] = c & 0xff;
                while(--d >= 0 && (e *= 0x100)){
                    this[a + d] = (c / e) & 0xff;
                }
                return a + b;
            };
            a.prototype.writeUInt8 = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 1, 0xff, 0);
                this[a] = b & 0xff;
                return a + 1;
            };
            a.prototype.writeUInt16LE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 2, 0xffff, 0);
                this[a] = b & 0xff;
                this[a + 1] = b >>> 8;
                return a + 2;
            };
            a.prototype.writeUInt16BE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 2, 0xffff, 0);
                this[a] = b >>> 8;
                this[a + 1] = b & 0xff;
                return a + 2;
            };
            a.prototype.writeUInt32LE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 4, 0xffffffff, 0);
                this[a + 3] = b >>> 24;
                this[a + 2] = b >>> 16;
                this[a + 1] = b >>> 8;
                this[a] = b & 0xff;
                return a + 4;
            };
            a.prototype.writeUInt32BE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 4, 0xffffffff, 0);
                this[a] = b >>> 24;
                this[a + 1] = b >>> 16;
                this[a + 2] = b >>> 8;
                this[a + 3] = b & 0xff;
                return a + 4;
            };
            a.prototype.writeIntLE = function i(b, a, c, h) {
                b = +b;
                a = a >>> 0;
                if (!h) {
                    var f = Math.pow(2, 8 * c - 1);
                    O(this, b, a, c, f - 1, -f);
                }
                var d = 0;
                var g = 1;
                var e = 0;
                this[a] = b & 0xff;
                while(++d < c && (g *= 0x100)){
                    if (b < 0 && e === 0 && this[a + d - 1] !== 0) {
                        e = 1;
                    }
                    this[a + d] = (((b / g) >> 0) - e) & 0xff;
                }
                return a + c;
            };
            a.prototype.writeIntBE = function i(b, a, c, h) {
                b = +b;
                a = a >>> 0;
                if (!h) {
                    var f = Math.pow(2, 8 * c - 1);
                    O(this, b, a, c, f - 1, -f);
                }
                var d = c - 1;
                var g = 1;
                var e = 0;
                this[a + d] = b & 0xff;
                while(--d >= 0 && (g *= 0x100)){
                    if (b < 0 && e === 0 && this[a + d + 1] !== 0) {
                        e = 1;
                    }
                    this[a + d] = (((b / g) >> 0) - e) & 0xff;
                }
                return a + c;
            };
            a.prototype.writeInt8 = function d(a, b, c) {
                a = +a;
                b = b >>> 0;
                if (!c) O(this, a, b, 1, 0x7f, -0x80);
                if (a < 0) a = 0xff + a + 1;
                this[b] = a & 0xff;
                return b + 1;
            };
            a.prototype.writeInt16LE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 2, 0x7fff, -0x8000);
                this[a] = b & 0xff;
                this[a + 1] = b >>> 8;
                return a + 2;
            };
            a.prototype.writeInt16BE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 2, 0x7fff, -0x8000);
                this[a] = b >>> 8;
                this[a + 1] = b & 0xff;
                return a + 2;
            };
            a.prototype.writeInt32LE = function d(b, a, c) {
                b = +b;
                a = a >>> 0;
                if (!c) O(this, b, a, 4, 0x7fffffff, -0x80000000);
                this[a] = b & 0xff;
                this[a + 1] = b >>> 8;
                this[a + 2] = b >>> 16;
                this[a + 3] = b >>> 24;
                return a + 4;
            };
            a.prototype.writeInt32BE = function d(a, b, c) {
                a = +a;
                b = b >>> 0;
                if (!c) O(this, a, b, 4, 0x7fffffff, -0x80000000);
                if (a < 0) a = 0xffffffff + a + 1;
                this[b] = a >>> 24;
                this[b + 1] = a >>> 16;
                this[b + 2] = a >>> 8;
                this[b + 3] = a & 0xff;
                return b + 4;
            };
            function P(b, d, a, c, e, f) {
                if (a + c > b.length) throw new RangeError("Index out of range");
                if (a < 0) throw new RangeError("Index out of range");
            }
            function Q(c, b, a, d, e) {
                b = +b;
                a = a >>> 0;
                if (!e) {
                    P(c, b, a, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                }
                i.write(c, b, a, d, 23, 4);
                return a + 4;
            }
            a.prototype.writeFloatLE = function d(a, b, c) {
                return Q(this, a, b, true, c);
            };
            a.prototype.writeFloatBE = function d(a, b, c) {
                return Q(this, a, b, false, c);
            };
            function R(c, b, a, d, e) {
                b = +b;
                a = a >>> 0;
                if (!e) {
                    P(c, b, a, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                }
                i.write(c, b, a, d, 52, 8);
                return a + 8;
            }
            a.prototype.writeDoubleLE = function d(a, b, c) {
                return R(this, a, b, true, c);
            };
            a.prototype.writeDoubleBE = function d(a, b, c) {
                return R(this, a, b, false, c);
            };
            a.prototype.copy = function h(e, d, c, b) {
                if (!a.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!c) c = 0;
                if (!b && b !== 0) b = this.length;
                if (d >= e.length) d = e.length;
                if (!d) d = 0;
                if (b > 0 && b < c) b = c;
                if (b === c) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (d < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (c < 0 || c >= this.length) throw new RangeError("Index out of range");
                if (b < 0) throw new RangeError("sourceEnd out of bounds");
                if (b > this.length) b = this.length;
                if (e.length - d < b - c) {
                    b = e.length - d + c;
                }
                var g = b - c;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(d, c, b);
                } else if (this === e && c < d && d < b) {
                    for(var f = g - 1; f >= 0; --f){
                        e[f + d] = this[f + c];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(c, b), d);
                }
                return g;
            };
            a.prototype.fill = function j(b, c, d, e) {
                if (typeof b === "string") {
                    if (typeof c === "string") {
                        e = c;
                        c = 0;
                        d = this.length;
                    } else if (typeof d === "string") {
                        e = d;
                        d = this.length;
                    }
                    if (e !== undefined && typeof e !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof e === "string" && !a.isEncoding(e)) {
                        throw new TypeError("Unknown encoding: " + e);
                    }
                    if (b.length === 1) {
                        var g = b.charCodeAt(0);
                        if ((e === "utf8" && g < 128) || e === "latin1") {
                            b = g;
                        }
                    }
                } else if (typeof b === "number") {
                    b = b & 255;
                } else if (typeof b === "boolean") {
                    b = Number(b);
                }
                if (c < 0 || this.length < c || this.length < d) {
                    throw new RangeError("Out of range index");
                }
                if (d <= c) {
                    return this;
                }
                c = c >>> 0;
                d = d === undefined ? this.length : d >>> 0;
                if (!b) b = 0;
                var f;
                if (typeof b === "number") {
                    for(f = c; f < d; ++f){
                        this[f] = b;
                    }
                } else {
                    var h = a.isBuffer(b) ? b : a.from(b, e);
                    var i = h.length;
                    if (i === 0) {
                        throw new TypeError('The value "' + b + '" is invalid for argument "value"');
                    }
                    for(f = 0; f < d - c; ++f){
                        this[f + c] = h[f % i];
                    }
                }
                return this;
            };
            var S = /[^+/0-9A-Za-z-_]/g;
            function T(a) {
                a = a.split("=")[0];
                a = a.trim().replace(S, "");
                if (a.length < 2) return "";
                while(a.length % 4 !== 0){
                    a = a + "=";
                }
                return a;
            }
            function U(f, b) {
                b = b || Infinity;
                var a;
                var g = f.length;
                var d = null;
                var c = [];
                for(var e = 0; e < g; ++e){
                    a = f.charCodeAt(e);
                    if (a > 0xd7ff && a < 0xe000) {
                        if (!d) {
                            if (a > 0xdbff) {
                                if ((b -= 3) > -1) c.push(0xef, 0xbf, 0xbd);
                                continue;
                            } else if (e + 1 === g) {
                                if ((b -= 3) > -1) c.push(0xef, 0xbf, 0xbd);
                                continue;
                            }
                            d = a;
                            continue;
                        }
                        if (a < 0xdc00) {
                            if ((b -= 3) > -1) c.push(0xef, 0xbf, 0xbd);
                            d = a;
                            continue;
                        }
                        a = (((d - 0xd800) << 10) | (a - 0xdc00)) + 0x10000;
                    } else if (d) {
                        if ((b -= 3) > -1) c.push(0xef, 0xbf, 0xbd);
                    }
                    d = null;
                    if (a < 0x80) {
                        if ((b -= 1) < 0) break;
                        c.push(a);
                    } else if (a < 0x800) {
                        if ((b -= 2) < 0) break;
                        c.push((a >> 0x6) | 0xc0, (a & 0x3f) | 0x80);
                    } else if (a < 0x10000) {
                        if ((b -= 3) < 0) break;
                        c.push((a >> 0xc) | 0xe0, ((a >> 0x6) & 0x3f) | 0x80, (a & 0x3f) | 0x80);
                    } else if (a < 0x110000) {
                        if ((b -= 4) < 0) break;
                        c.push((a >> 0x12) | 0xf0, ((a >> 0xc) & 0x3f) | 0x80, ((a >> 0x6) & 0x3f) | 0x80, (a & 0x3f) | 0x80);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return c;
            }
            function V(b) {
                var c = [];
                for(var a = 0; a < b.length; ++a){
                    c.push(b.charCodeAt(a) & 0xff);
                }
                return c;
            }
            function W(d, g) {
                var a, e, f;
                var b = [];
                for(var c = 0; c < d.length; ++c){
                    if ((g -= 2) < 0) break;
                    a = d.charCodeAt(c);
                    e = a >> 8;
                    f = a % 256;
                    b.push(f);
                    b.push(e);
                }
                return b;
            }
            function X(a) {
                return h.toByteArray(T(a));
            }
            function Y(b, c, d, e) {
                for(var a = 0; a < e; ++a){
                    if (a + d >= c.length || a >= b.length) break;
                    c[a + d] = b[a];
                }
                return a;
            }
            function Z(a, b) {
                return (a instanceof b || (a != null && a.constructor != null && a.constructor.name != null && a.constructor.name === b.name));
            }
            function $(a) {
                return a !== a;
            }
            var _ = (function() {
                var c = "0123456789abcdef";
                var d = new Array(256);
                for(var a = 0; a < 16; ++a){
                    var e = a * 16;
                    for(var b = 0; b < 16; ++b){
                        d[e + b] = c[a] + c[b];
                    }
                }
                return d;
            })();
        },
        8898: function(b, a) {
            a.read = function(g, h, j, e, k) {
                var a, c;
                var l = k * 8 - e - 1;
                var m = (1 << l) - 1;
                var n = m >> 1;
                var b = -7;
                var d = j ? k - 1 : 0;
                var i = j ? -1 : 1;
                var f = g[h + d];
                d += i;
                a = f & ((1 << -b) - 1);
                f >>= -b;
                b += l;
                for(; b > 0; a = a * 256 + g[h + d], d += i, b -= 8){}
                c = a & ((1 << -b) - 1);
                a >>= -b;
                b += e;
                for(; b > 0; c = c * 256 + g[h + d], d += i, b -= 8){}
                if (a === 0) {
                    a = 1 - n;
                } else if (a === m) {
                    return c ? NaN : (f ? -1 : 1) * Infinity;
                } else {
                    c = c + Math.pow(2, e);
                    a = a - n;
                }
                return (f ? -1 : 1) * c * Math.pow(2, a - e);
            };
            a.write = function(j, b, k, m, c, n) {
                var a, d, e;
                var h = n * 8 - c - 1;
                var i = (1 << h) - 1;
                var f = i >> 1;
                var o = c === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var g = m ? 0 : n - 1;
                var l = m ? 1 : -1;
                var p = b < 0 || (b === 0 && 1 / b < 0) ? 1 : 0;
                b = Math.abs(b);
                if (isNaN(b) || b === Infinity) {
                    d = isNaN(b) ? 1 : 0;
                    a = i;
                } else {
                    a = Math.floor(Math.log(b) / Math.LN2);
                    if (b * (e = Math.pow(2, -a)) < 1) {
                        a--;
                        e *= 2;
                    }
                    if (a + f >= 1) {
                        b += o / e;
                    } else {
                        b += o * Math.pow(2, 1 - f);
                    }
                    if (b * e >= 2) {
                        a++;
                        e /= 2;
                    }
                    if (a + f >= i) {
                        d = 0;
                        a = i;
                    } else if (a + f >= 1) {
                        d = (b * e - 1) * Math.pow(2, c);
                        a = a + f;
                    } else {
                        d = b * Math.pow(2, f - 1) * Math.pow(2, c);
                        a = 0;
                    }
                }
                for(; c >= 8; j[k + g] = d & 0xff, g += l, d /= 256, c -= 8){}
                a = (a << c) | d;
                h += c;
                for(; h > 0; j[k + g] = a & 0xff, g += l, a /= 256, h -= 8){}
                j[k + g - l] |= p * 128;
            };
        },
        7579: function() {},
        7326: function(c, a, b) {
            "use strict";
            b.d(a, {
                Z: function() {
                    return d;
                }
            });
            function d(a) {
                if (a === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return a;
            }
        },
        8852: function(c, b, a) {
            "use strict";
            a.d(b, {
                Z: function() {
                    return f;
                }
            });
            var d = a(9611);
            function e() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            function f(a, b, c) {
                if (e()) {
                    f = Reflect.construct;
                } else {
                    f = function h(e, f, b) {
                        var a = [
                            null
                        ];
                        a.push.apply(a, f);
                        var g = Function.bind.apply(e, a);
                        var c = new g();
                        if (b) (0, d.Z)(c, b.prototype);
                        return c;
                    };
                }
                return f.apply(null, arguments);
            }
        },
        7462: function(c, a, b) {
            "use strict";
            b.d(a, {
                Z: function() {
                    return d;
                }
            });
            function d() {
                d = Object.assign || function(d) {
                    for(var a = 1; a < arguments.length; a++){
                        var b = arguments[a];
                        for(var c in b){
                            if (Object.prototype.hasOwnProperty.call(b, c)) {
                                d[c] = b[c];
                            }
                        }
                    }
                    return d;
                };
                return d.apply(this, arguments);
            }
        },
        136: function(c, b, a) {
            "use strict";
            a.d(b, {
                Z: function() {
                    return e;
                }
            });
            var d = a(9611);
            function e(b, a) {
                if (typeof a !== "function" && a !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                Object.defineProperty(b, "prototype", {
                    value: Object.create(a && a.prototype, {
                        constructor: {
                            value: b,
                            writable: true,
                            configurable: true
                        }
                    }),
                    writable: false
                });
                if (a) (0, d.Z)(b, a);
            }
        },
        4578: function(c, b, a) {
            "use strict";
            a.d(b, {
                Z: function() {
                    return e;
                }
            });
            var d = a(9611);
            function e(a, b) {
                a.prototype = Object.create(b.prototype);
                a.prototype.constructor = a;
                (0, d.Z)(a, b);
            }
        },
        9611: function(c, a, b) {
            "use strict";
            b.d(a, {
                Z: function() {
                    return d;
                }
            });
            function d(a, b) {
                d = Object.setPrototypeOf || function c(a, b) {
                    a.__proto__ = b;
                    return a;
                };
                return d(a, b);
            }
        }
    },
    function(a) {
        var c = function(b) {
            return a((a.s = b));
        };
        a.O(0, [
            544,
            774,
            888,
            179
        ], function() {
            return c(8581);
        });
        var b = a.O();
        _N_E = b;
    }, 
]);
