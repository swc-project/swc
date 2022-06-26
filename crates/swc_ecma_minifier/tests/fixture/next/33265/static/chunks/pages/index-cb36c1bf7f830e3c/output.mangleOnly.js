(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        7154: function(a) {
            function b() {
                (a.exports = b = Object.assign || function(a) {
                    for(var b = 1; b < arguments.length; b++){
                        var c = arguments[b];
                        for(var d in c){
                            if (Object.prototype.hasOwnProperty.call(c, d)) {
                                a[d] = c[d];
                            }
                        }
                    }
                    return a;
                }), (a.exports.__esModule = true), (a.exports["default"] = a.exports);
                return b.apply(this, arguments);
            }
            (a.exports = b), (a.exports.__esModule = true), (a.exports["default"] = a.exports);
        },
        562: function(a, b, c) {
            "use strict";
            c.d(b, {
                Ki: function() {
                    return k;
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
            var d = c(8908);
            var e = c.n(d);
            var f = function a(b, c) {
                var d = "";
                while(c--){
                    d += b;
                }
                return d;
            };
            var g = function a(b) {
                return b.toString(2).length;
            };
            var h = function a(b) {
                return Math.ceil(g(b) / 8);
            };
            var i = function a(b, c, d) {
                if (d === void 0) {
                    d = " ";
                }
                return (f(d, c) + b.toString()).slice(-c);
            };
            var j = function a(b) {
                return ArrayBuffer.isView(b);
            };
            var k = function a(b) {
                if (b instanceof Uint8Array) {
                    return b;
                }
                if (!Array.isArray(b) && !j(b) && !(b instanceof ArrayBuffer)) {
                    if (typeof b !== "number" || (typeof b === "number" && b !== b)) {
                        b = 0;
                    } else {
                        b = [
                            b
                        ];
                    }
                }
                return new Uint8Array((b && b.buffer) || b, (b && b.byteOffset) || 0, (b && b.byteLength) || 0);
            };
            var l = function a(b) {
                b = k(b);
                var c = "";
                for(var d = 0; d < b.length; d++){
                    c += i(b[d].toString(16), 2, "0");
                }
                return c;
            };
            var m = function a(b) {
                b = k(b);
                var c = "";
                for(var d = 0; d < b.length; d++){
                    c += i(b[d].toString(2), 8, "0");
                }
                return c;
            };
            var n = e().BigInt || Number;
            var o = [
                n("0x1"),
                n("0x100"),
                n("0x10000"),
                n("0x1000000"),
                n("0x100000000"),
                n("0x10000000000"),
                n("0x1000000000000"),
                n("0x100000000000000"),
                n("0x10000000000000000"), 
            ];
            var p = (function() {
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
            var q = p === "big";
            var r = p === "little";
            var s = function a(b, c) {
                var d = c === void 0 ? {} : c, e = d.signed, f = e === void 0 ? false : e, g = d.le, h = g === void 0 ? false : g;
                b = k(b);
                var i = h ? "reduce" : "reduceRight";
                var j = b[i] ? b[i] : Array.prototype[i];
                var l = j.call(b, function(a, c, d) {
                    var e = h ? d : Math.abs(d + 1 - b.length);
                    return a + n(c) * o[e];
                }, n(0));
                if (f) {
                    var m = o[b.length] / n(2) - n(1);
                    l = n(l);
                    if (l > m) {
                        l -= m;
                        l -= m;
                        l -= n(2);
                    }
                }
                return Number(l);
            };
            var t = function a(b, c) {
                var d = c === void 0 ? {} : c, e = d.le, f = e === void 0 ? false : e;
                if ((typeof b !== "bigint" && typeof b !== "number") || (typeof b === "number" && b !== b)) {
                    b = 0;
                }
                b = n(b);
                var g = h(b);
                var i = new Uint8Array(new ArrayBuffer(g));
                for(var j = 0; j < g; j++){
                    var k = f ? j : Math.abs(j + 1 - i.length);
                    i[k] = Number((b / o[j]) & n(0xff));
                    if (b < 0) {
                        i[k] = Math.abs(~i[k]);
                        i[k] -= j === 0 ? 1 : 2;
                    }
                }
                return i;
            };
            var u = function a(b) {
                if (!b) {
                    return "";
                }
                b = Array.prototype.slice.call(b);
                var c = String.fromCharCode.apply(null, k(b));
                try {
                    return decodeURIComponent(escape(c));
                } catch (d) {}
                return c;
            };
            var v = function a(b, c) {
                if (typeof b !== "string" && b && typeof b.toString === "function") {
                    b = b.toString();
                }
                if (typeof b !== "string") {
                    return new Uint8Array();
                }
                if (!c) {
                    b = unescape(encodeURIComponent(b));
                }
                var d = new Uint8Array(b.length);
                for(var e = 0; e < b.length; e++){
                    d[e] = b.charCodeAt(e);
                }
                return d;
            };
            var w = function a() {
                for(var b = arguments.length, c = new Array(b), d = 0; d < b; d++){
                    c[d] = arguments[d];
                }
                c = c.filter(function(a) {
                    return (a && (a.byteLength || a.length) && typeof a !== "string");
                });
                if (c.length <= 1) {
                    return k(c[0]);
                }
                var e = c.reduce(function(a, b, c) {
                    return a + (b.byteLength || b.length);
                }, 0);
                var f = new Uint8Array(e);
                var g = 0;
                c.forEach(function(a) {
                    a = k(a);
                    f.set(a, g);
                    g += a.byteLength;
                });
                return f;
            };
            var x = function a(b, c, d) {
                var e = d === void 0 ? {} : d, f = e.offset, g = f === void 0 ? 0 : f, h = e.mask, i = h === void 0 ? [] : h;
                b = k(b);
                c = k(c);
                var j = c.every ? c.every : Array.prototype.every;
                return (c.length && b.length - g >= c.length && j.call(c, function(a, c) {
                    var d = i[c] ? i[c] & b[g + c] : b[g + c];
                    return a === d;
                }));
            };
            var y = function a(b, c, d) {
                if (Uint8Array.prototype.slice) {
                    return Uint8Array.prototype.slice.call(b, c, d);
                }
                return new Uint8Array(Array.prototype.slice.call(b, c, d));
            };
            var z = function a(b) {
                if (b.reverse) {
                    return b.reverse();
                }
                return Array.prototype.reverse.call(b);
            };
        },
        2260: function(a, b, c) {
            "use strict";
            c.d(b, {
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
            var d = c(8908);
            var e = c.n(d);
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
            var i = function a(b) {
                if (!b) {
                    return b;
                }
                return b.replace(/avc1\.(\d+)\.(\d+)/i, function(a, b, c) {
                    var d = ("00" + Number(b).toString(16)).slice(-2);
                    var e = ("00" + Number(c).toString(16)).slice(-2);
                    return "avc1." + d + "00" + e;
                });
            };
            var j = function a(b) {
                return b.map(i);
            };
            var k = function a(b) {
                return b.replace(/avc1\.(\d+)\.(\d+)/i, function(a) {
                    return j([
                        a
                    ])[0];
                });
            };
            var l = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                var c = b.split(",");
                var d = [];
                c.forEach(function(a) {
                    a = a.trim();
                    var b;
                    g.forEach(function(c) {
                        var e = f[c].exec(a.toLowerCase());
                        if (!e || e.length <= 1) {
                            return;
                        }
                        b = c;
                        var g = a.substring(0, e[1].length);
                        var h = a.replace(g, "");
                        d.push({
                            type: g,
                            details: h,
                            mediaType: c
                        });
                    });
                    if (!b) {
                        d.push({
                            type: a,
                            details: "",
                            mediaType: "unknown"
                        });
                    }
                });
                return d;
            };
            var m = function a(b, c) {
                if (!b.mediaGroups.AUDIO || !c) {
                    return null;
                }
                var d = b.mediaGroups.AUDIO[c];
                if (!d) {
                    return null;
                }
                for(var e in d){
                    var f = d[e];
                    if (f.default && f.playlists) {
                        return l(f.playlists[0].attributes.CODECS);
                    }
                }
                return null;
            };
            var n = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                return f.video.test(b.trim().toLowerCase());
            };
            var o = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                return f.audio.test(b.trim().toLowerCase());
            };
            var p = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                return f.text.test(b.trim().toLowerCase());
            };
            var q = function a(b) {
                if (!b || typeof b !== "string") {
                    return;
                }
                var c = b.toLowerCase().split(",").map(function(a) {
                    return i(a.trim());
                });
                var d = "video";
                if (c.length === 1 && o(c[0])) {
                    d = "audio";
                } else if (c.length === 1 && p(c[0])) {
                    d = "application";
                }
                var e = "mp4";
                if (c.every(function(a) {
                    return f.mp4.test(a);
                })) {
                    e = "mp4";
                } else if (c.every(function(a) {
                    return f.webm.test(a);
                })) {
                    e = "webm";
                } else if (c.every(function(a) {
                    return f.ogg.test(a);
                })) {
                    e = "ogg";
                }
                return d + "/" + e + ';codecs="' + b + '"';
            };
            var r = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                return ((e().MediaSource && e().MediaSource.isTypeSupported && e().MediaSource.isTypeSupported(q(b))) || false);
            };
            var s = function a(b) {
                if (b === void 0) {
                    b = "";
                }
                return b.toLowerCase().split(",").every(function(a) {
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
        6185: function(a, b, c) {
            "use strict";
            c.d(b, {
                Xm: function() {
                    return T;
                },
                cz: function() {
                    return U;
                }
            });
            var d = c(562);
            var e = function a(b) {
                var c = "";
                var d = b[1] >>> 3;
                var e = b[1] & 0x1f;
                var f = b[2] >>> 7;
                var g = (b[2] & 0x40) >> 6;
                var h = (b[2] & 0x20) >> 5;
                var i = (b[2] & 0x10) >> 4;
                var j = (b[2] & 0x08) >> 3;
                var k = (b[2] & 0x04) >> 2;
                var l = b[2] & 0x03;
                c += d + "." + padStart(e, 2, "0");
                if (f === 0) {
                    c += "M";
                } else if (f === 1) {
                    c += "H";
                }
                var m;
                if (d === 2 && g) {
                    m = h ? 12 : 10;
                } else {
                    m = g ? 10 : 8;
                }
                c += "." + padStart(m, 2, "0");
                c += "." + i;
                c += "." + j + k + l;
                return c;
            };
            var f = function a(b) {
                var c = toHexString(b[1]);
                var d = toHexString(b[2] & 0xfc);
                var e = toHexString(b[3]);
                return "" + c + d + e;
            };
            var g = function a(b) {
                var c = "";
                var d = b[1] >> 6;
                var e = b[1] & 0x1f;
                var f = (b[1] & 0x20) >> 5;
                var g = b.subarray(2, 6);
                var h = b.subarray(6, 12);
                var i = b[12];
                if (d === 1) {
                    c += "A";
                } else if (d === 2) {
                    c += "B";
                } else if (d === 3) {
                    c += "C";
                }
                c += e + ".";
                var j = parseInt(toBinaryString(g).split("").reverse().join(""), 2);
                if (j > 255) {
                    j = parseInt(toBinaryString(g), 2);
                }
                c += j.toString(16) + ".";
                if (f === 0) {
                    c += "L";
                } else {
                    c += "H";
                }
                c += i;
                var k = "";
                for(var l = 0; l < h.length; l++){
                    var m = h[l];
                    if (m) {
                        if (k) {
                            k += ".";
                        }
                        k += m.toString(16);
                    }
                }
                if (k) {
                    c += "." + k;
                }
                return c;
            };
            var h = new Uint8Array([
                0x4f,
                0x70,
                0x75,
                0x73,
                0x48,
                0x65,
                0x61,
                0x64, 
            ]);
            var i = function a(b) {
                var c = new DataView(b.buffer, b.byteOffset, b.byteLength);
                var d = c.getUint8(0);
                var e = d !== 0;
                var f = {
                    version: d,
                    channels: c.getUint8(1),
                    preSkip: c.getUint16(2, e),
                    sampleRate: c.getUint32(4, e),
                    outputGain: c.getUint16(8, e),
                    channelMappingFamily: c.getUint8(10)
                };
                if (f.channelMappingFamily > 0 && b.length > 10) {
                    f.streamCount = c.getUint8(11);
                    f.twoChannelStreamCount = c.getUint8(12);
                    f.channelMapping = [];
                    for(var g = 0; g < f.channels; g++){
                        f.channelMapping.push(c.getUint8(13 + g));
                    }
                }
                return f;
            };
            var j = function a(b) {
                var c = b.channelMappingFamily <= 0 ? 11 : 12 + b.channels;
                var d = new DataView(new ArrayBuffer(c));
                var e = b.version !== 0;
                d.setUint8(0, b.version);
                d.setUint8(1, b.channels);
                d.setUint16(2, b.preSkip, e);
                d.setUint32(4, b.sampleRate, e);
                d.setUint16(8, b.outputGain, e);
                d.setUint8(10, b.channelMappingFamily);
                if (b.channelMappingFamily > 0) {
                    d.setUint8(11, b.streamCount);
                    b.channelMapping.foreach(function(a, b) {
                        d.setUint8(12 + b, a);
                    });
                }
                return new Uint8Array(d.buffer);
            };
            var k = function a(b) {
                if (typeof b === "string") {
                    return (0, d.qX)(b);
                }
                if (typeof b === "number") {
                    return b;
                }
                return b;
            };
            var l = function a(b) {
                if (!Array.isArray(b)) {
                    return [
                        k(b)
                    ];
                }
                return b.map(function(a) {
                    return k(a);
                });
            };
            var m;
            var n = function a(b) {
                b = (0, d.Ki)(b);
                var c = [];
                var e = 0;
                while(b.length > e){
                    var f = b[e];
                    var g = 0;
                    var h = 0;
                    h++;
                    var i = b[h];
                    h++;
                    while(i & 0x80){
                        g = (i & 0x7f) << 7;
                        i = b[h];
                        h++;
                    }
                    g += i & 0x7f;
                    for(var j = 0; j < m.length; j++){
                        var k = m[j], l = k.id, n = k.parser;
                        if (f === l) {
                            c.push(n(b.subarray(h, h + g)));
                            break;
                        }
                    }
                    e += g + h;
                }
                return c;
            };
            m = [
                {
                    id: 0x03,
                    parser: function a(b) {
                        var c = {
                            tag: 0x03,
                            id: (b[0] << 8) | b[1],
                            flags: b[2],
                            size: 3,
                            dependsOnEsId: 0,
                            ocrEsId: 0,
                            descriptors: [],
                            url: ""
                        };
                        if (c.flags & 0x80) {
                            c.dependsOnEsId = (b[c.size] << 8) | b[c.size + 1];
                            c.size += 2;
                        }
                        if (c.flags & 0x40) {
                            var e = b[c.size];
                            c.url = (0, d.d3)(b.subarray(c.size + 1, c.size + 1 + e));
                            c.size += e;
                        }
                        if (c.flags & 0x20) {
                            c.ocrEsId = (b[c.size] << 8) | b[c.size + 1];
                            c.size += 2;
                        }
                        c.descriptors = n(b.subarray(c.size)) || [];
                        return c;
                    }
                },
                {
                    id: 0x04,
                    parser: function a(b) {
                        var c = {
                            tag: 0x04,
                            oti: b[0],
                            streamType: b[1],
                            bufferSize: (b[2] << 16) | (b[3] << 8) | b[4],
                            maxBitrate: (b[5] << 24) | (b[6] << 16) | (b[7] << 8) | b[8],
                            avgBitrate: (b[9] << 24) | (b[10] << 16) | (b[11] << 8) | b[12],
                            descriptors: n(b.subarray(13))
                        };
                        return c;
                    }
                },
                {
                    id: 0x05,
                    parser: function a(b) {
                        return {
                            tag: 0x05,
                            bytes: b
                        };
                    }
                },
                {
                    id: 0x06,
                    parser: function a(b) {
                        return {
                            tag: 0x06,
                            bytes: b
                        };
                    }
                }, 
            ];
            var o = function a(b, c, e) {
                if (e === void 0) {
                    e = false;
                }
                c = l(c);
                b = (0, d.Ki)(b);
                var f = [];
                if (!c.length) {
                    return f;
                }
                var g = 0;
                while(g < b.length){
                    var h = ((b[g] << 24) | (b[g + 1] << 16) | (b[g + 2] << 8) | b[g + 3]) >>> 0;
                    var i = b.subarray(g + 4, g + 8);
                    if (h === 0) {
                        break;
                    }
                    var j = g + h;
                    if (j > b.length) {
                        if (e) {
                            break;
                        }
                        j = b.length;
                    }
                    var k = b.subarray(g + 8, j);
                    if ((0, d.G3)(i, c[0])) {
                        if (c.length === 1) {
                            f.push(k);
                        } else {
                            f.push.apply(f, a(k, c.slice(1), e));
                        }
                    }
                    g = j;
                }
                return f;
            };
            var p = function a(b, c) {
                c = k(c);
                if (!c.length) {
                    return b.subarray(b.length);
                }
                var d = 0;
                while(d < b.length){
                    if (bytesMatch(b.subarray(d, d + c.length), c)) {
                        var e = ((b[d - 4] << 24) | (b[d - 3] << 16) | (b[d - 2] << 8) | b[d - 1]) >>> 0;
                        var f = e > 1 ? d + e : b.byteLength;
                        return b.subarray(d + 4, f);
                    }
                    d++;
                }
                return b.subarray(b.length);
            };
            var q = function a(b, c, d) {
                if (c === void 0) {
                    c = 4;
                }
                if (d === void 0) {
                    d = function a(b) {
                        return bytesToNumber(b);
                    };
                }
                var e = [];
                if (!b || !b.length) {
                    return e;
                }
                var f = bytesToNumber(b.subarray(4, 8));
                for(var g = 8; f; g += c, f--){
                    e.push(d(b.subarray(g, g + c)));
                }
                return e;
            };
            var r = function a(b, c) {
                var d = q(o(b, [
                    "stss"
                ])[0]);
                var e = q(o(b, [
                    "stco"
                ])[0]);
                var f = q(o(b, [
                    "stts"
                ])[0], 8, function(a) {
                    return {
                        sampleCount: bytesToNumber(a.subarray(0, 4)),
                        sampleDelta: bytesToNumber(a.subarray(4, 8))
                    };
                });
                var g = q(o(b, [
                    "stsc"
                ])[0], 12, function(a) {
                    return {
                        firstChunk: bytesToNumber(a.subarray(0, 4)),
                        samplesPerChunk: bytesToNumber(a.subarray(4, 8)),
                        sampleDescriptionIndex: bytesToNumber(a.subarray(8, 12))
                    };
                });
                var h = o(b, [
                    "stsz"
                ])[0];
                var i = q((h && h.length && h.subarray(4)) || null);
                var j = [];
                for(var k = 0; k < e.length; k++){
                    var l = void 0;
                    for(var m = 0; m < g.length; m++){
                        var n = g[m];
                        var p = k + 1 >= n.firstChunk && (m + 1 >= g.length || k + 1 < g[m + 1].firstChunk);
                        if (p) {
                            l = n.samplesPerChunk;
                            break;
                        }
                    }
                    var r = e[k];
                    for(var s = 0; s < l; s++){
                        var t = i[j.length];
                        var u = !d.length;
                        if (d.length && d.indexOf(j.length + 1) !== -1) {
                            u = true;
                        }
                        var v = {
                            keyframe: u,
                            start: r,
                            end: r + t
                        };
                        for(var w = 0; w < f.length; w++){
                            var x = f[w], y = x.sampleCount, z = x.sampleDelta;
                            if (j.length <= y) {
                                var A = j.length ? j[j.length - 1].timestamp : 0;
                                v.timestamp = A + (z / c) * 1000;
                                v.duration = z;
                                break;
                            }
                        }
                        j.push(v);
                        r += t;
                    }
                }
                return j;
            };
            var s = function a(b, c) {
                var d = bytesToString(c.subarray(0, 4));
                if (b.type === "video") {
                    b.info = b.info || {};
                    b.info.width = (c[28] << 8) | c[29];
                    b.info.height = (c[30] << 8) | c[31];
                } else if (b.type === "audio") {
                    b.info = b.info || {};
                    b.info.channels = (c[20] << 8) | c[21];
                    b.info.bitDepth = (c[22] << 8) | c[23];
                    b.info.sampleRate = (c[28] << 8) | c[29];
                }
                if (d === "avc1") {
                    var e = p(c, "avcC");
                    d += "." + getAvcCodec(e);
                    b.info.avcC = e;
                } else if (d === "hvc1" || d === "hev1") {
                    d += "." + getHvcCodec(p(c, "hvcC"));
                } else if (d === "mp4a" || d === "mp4v") {
                    var f = p(c, "esds");
                    var g = n(f.subarray(4))[0];
                    var h = g && g.descriptors.filter(function(a) {
                        var b = a.tag;
                        return b === 0x04;
                    })[0];
                    if (h) {
                        d += "." + toHexString(h.oti);
                        if (h.oti === 0x40) {
                            d += "." + (h.descriptors[0].bytes[0] >> 3).toString();
                        } else if (h.oti === 0x20) {
                            d += "." + h.descriptors[0].bytes[4].toString();
                        } else if (h.oti === 0xdd) {
                            d = "vorbis";
                        }
                    } else if (b.type === "audio") {
                        d += ".40.2";
                    } else {
                        d += ".20.9";
                    }
                } else if (d === "av01") {
                    d += "." + getAv1Codec(p(c, "av1C"));
                } else if (d === "vp09") {
                    var i = p(c, "vpcC");
                    var j = i[0];
                    var k = i[1];
                    var l = i[2] >> 4;
                    var m = (i[2] & 0x0f) >> 1;
                    var o = (i[2] & 0x0f) >> 3;
                    var q = i[3];
                    var r = i[4];
                    var s = i[5];
                    d += "." + padStart(j, 2, "0");
                    d += "." + padStart(k, 2, "0");
                    d += "." + padStart(l, 2, "0");
                    d += "." + padStart(m, 2, "0");
                    d += "." + padStart(q, 2, "0");
                    d += "." + padStart(r, 2, "0");
                    d += "." + padStart(s, 2, "0");
                    d += "." + padStart(o, 2, "0");
                } else if (d === "theo") {
                    d = "theora";
                } else if (d === "spex") {
                    d = "speex";
                } else if (d === ".mp3") {
                    d = "mp4a.40.34";
                } else if (d === "msVo") {
                    d = "vorbis";
                } else if (d === "Opus") {
                    d = "opus";
                    var t = p(c, "dOps");
                    b.info.opus = parseOpusHead(t);
                    b.info.codecDelay = 6500000;
                } else {
                    d = d.toLowerCase();
                }
                b.codec = d;
            };
            var t = function a(b, c) {
                if (c === void 0) {
                    c = true;
                }
                b = toUint8(b);
                var d = o(b, [
                    "moov",
                    "trak"
                ], true);
                var e = [];
                d.forEach(function(a) {
                    var b = {
                        bytes: a
                    };
                    var d = o(a, [
                        "mdia"
                    ])[0];
                    var f = o(d, [
                        "hdlr"
                    ])[0];
                    var g = bytesToString(f.subarray(8, 12));
                    if (g === "soun") {
                        b.type = "audio";
                    } else if (g === "vide") {
                        b.type = "video";
                    } else {
                        b.type = g;
                    }
                    var h = o(a, [
                        "tkhd"
                    ])[0];
                    if (h) {
                        var i = new DataView(h.buffer, h.byteOffset, h.byteLength);
                        var j = i.getUint8(0);
                        b.number = j === 0 ? i.getUint32(12) : i.getUint32(20);
                    }
                    var k = o(d, [
                        "mdhd"
                    ])[0];
                    if (k) {
                        var l = k[0];
                        var m = l === 0 ? 12 : 20;
                        b.timescale = ((k[m] << 24) | (k[m + 1] << 16) | (k[m + 2] << 8) | k[m + 3]) >>> 0;
                    }
                    var n = o(d, [
                        "minf",
                        "stbl"
                    ])[0];
                    var p = o(n, [
                        "stsd"
                    ])[0];
                    var q = bytesToNumber(p.subarray(4, 8));
                    var t = 8;
                    while(q--){
                        var u = bytesToNumber(p.subarray(t, t + 4));
                        var v = p.subarray(t + 4, t + 4 + u);
                        s(b, v);
                        t += 4 + u;
                    }
                    if (c) {
                        b.frameTable = r(n, b.timescale);
                    }
                    e.push(b);
                });
                return e;
            };
            var u = function a(b) {
                var c = o(b, [
                    "moov",
                    "mvhd"
                ], true)[0];
                if (!c || !c.length) {
                    return;
                }
                var d = {};
                if (c[0] === 1) {
                    d.timestampScale = bytesToNumber(c.subarray(20, 24));
                    d.duration = bytesToNumber(c.subarray(24, 32));
                } else {
                    d.timestampScale = bytesToNumber(c.subarray(12, 16));
                    d.duration = bytesToNumber(c.subarray(16, 20));
                }
                d.bytes = c;
                return d;
            };
            var v = {
                EBML: (0, d.Ki)([
                    0x1a,
                    0x45,
                    0xdf,
                    0xa3, 
                ]),
                DocType: (0, d.Ki)([
                    0x42,
                    0x82
                ]),
                Segment: (0, d.Ki)([
                    0x18,
                    0x53,
                    0x80,
                    0x67, 
                ]),
                SegmentInfo: (0, d.Ki)([
                    0x15,
                    0x49,
                    0xa9,
                    0x66, 
                ]),
                Tracks: (0, d.Ki)([
                    0x16,
                    0x54,
                    0xae,
                    0x6b, 
                ]),
                Track: (0, d.Ki)([
                    0xae
                ]),
                TrackNumber: (0, d.Ki)([
                    0xd7
                ]),
                DefaultDuration: (0, d.Ki)([
                    0x23,
                    0xe3,
                    0x83, 
                ]),
                TrackEntry: (0, d.Ki)([
                    0xae
                ]),
                TrackType: (0, d.Ki)([
                    0x83
                ]),
                FlagDefault: (0, d.Ki)([
                    0x88
                ]),
                CodecID: (0, d.Ki)([
                    0x86
                ]),
                CodecPrivate: (0, d.Ki)([
                    0x63,
                    0xa2
                ]),
                VideoTrack: (0, d.Ki)([
                    0xe0
                ]),
                AudioTrack: (0, d.Ki)([
                    0xe1
                ]),
                Cluster: (0, d.Ki)([
                    0x1f,
                    0x43,
                    0xb6,
                    0x75, 
                ]),
                Timestamp: (0, d.Ki)([
                    0xe7
                ]),
                TimestampScale: (0, d.Ki)([
                    0x2a,
                    0xd7,
                    0xb1, 
                ]),
                BlockGroup: (0, d.Ki)([
                    0xa0
                ]),
                BlockDuration: (0, d.Ki)([
                    0x9b
                ]),
                Block: (0, d.Ki)([
                    0xa1
                ]),
                SimpleBlock: (0, d.Ki)([
                    0xa3
                ])
            };
            var w = [
                128,
                64,
                32,
                16,
                8,
                4,
                2,
                1
            ];
            var x = function a(b) {
                var c = 1;
                for(var d = 0; d < w.length; d++){
                    if (b & w[d]) {
                        break;
                    }
                    c++;
                }
                return c;
            };
            var y = function a(b, c, e, f) {
                if (e === void 0) {
                    e = true;
                }
                if (f === void 0) {
                    f = false;
                }
                var g = x(b[c]);
                var h = b.subarray(c, c + g);
                if (e) {
                    h = Array.prototype.slice.call(b, c, c + g);
                    h[0] ^= w[g - 1];
                }
                return {
                    length: g,
                    value: (0, d.tm)(h, {
                        signed: f
                    }),
                    bytes: h
                };
            };
            var z = function a(b) {
                if (typeof b === "string") {
                    return b.match(/.{1,2}/g).map(function(b) {
                        return a(b);
                    });
                }
                if (typeof b === "number") {
                    return (0, d.hL)(b);
                }
                return b;
            };
            var A = function a(b) {
                if (!Array.isArray(b)) {
                    return [
                        z(b)
                    ];
                }
                return b.map(function(a) {
                    return z(a);
                });
            };
            var B = function a(b, c, e) {
                if (e >= c.length) {
                    return c.length;
                }
                var f = y(c, e, false);
                if ((0, d.G3)(b.bytes, f.bytes)) {
                    return e;
                }
                var g = y(c, e + f.length);
                return a(b, c, e + g.length + g.value + f.length);
            };
            var C = function a(b, c) {
                c = A(c);
                b = (0, d.Ki)(b);
                var e = [];
                if (!c.length) {
                    return e;
                }
                var f = 0;
                while(f < b.length){
                    var g = y(b, f, false);
                    var h = y(b, f + g.length);
                    var i = f + g.length + h.length;
                    if (h.value === 0x7f) {
                        h.value = B(g, b, i);
                        if (h.value !== b.length) {
                            h.value -= i;
                        }
                    }
                    var j = i + h.value > b.length ? b.length : i + h.value;
                    var k = b.subarray(i, j);
                    if ((0, d.G3)(c[0], g.bytes)) {
                        if (c.length === 1) {
                            e.push(k);
                        } else {
                            e = e.concat(a(k, c.slice(1)));
                        }
                    }
                    var l = g.length + h.length + k.length;
                    f += l;
                }
                return e;
            };
            var D = function a(b, c, d, e) {
                var f;
                if (c === "group") {
                    f = C(b, [
                        v.BlockDuration
                    ])[0];
                    if (f) {
                        f = bytesToNumber(f);
                        f = ((1 / d) * f * d) / 1000;
                    }
                    b = C(b, [
                        v.Block
                    ])[0];
                    c = "block";
                }
                var g = new DataView(b.buffer, b.byteOffset, b.byteLength);
                var h = y(b, 0);
                var i = g.getInt16(h.length, false);
                var j = b[h.length + 2];
                var k = b.subarray(h.length + 3);
                var l = ((1 / d) * (e + i) * d) / 1000;
                var m = {
                    duration: f,
                    trackNumber: h.value,
                    keyframe: c === "simple" && j >> 7 === 1,
                    invisible: (j & 0x08) >> 3 === 1,
                    lacing: (j & 0x06) >> 1,
                    discardable: c === "simple" && (j & 0x01) === 1,
                    frames: [],
                    pts: l,
                    dts: l,
                    timestamp: i
                };
                if (!m.lacing) {
                    m.frames.push(k);
                    return m;
                }
                var n = k[0] + 1;
                var o = [];
                var p = 1;
                if (m.lacing === 2) {
                    var q = (k.length - p) / n;
                    for(var r = 0; r < n; r++){
                        o.push(q);
                    }
                }
                if (m.lacing === 1) {
                    for(var s = 0; s < n - 1; s++){
                        var t = 0;
                        do {
                            t += k[p];
                            p++;
                        }while (k[p - 1] === 0xff)
                        o.push(t);
                    }
                }
                if (m.lacing === 3) {
                    var u = 0;
                    for(var w = 0; w < n - 1; w++){
                        var x = w === 0 ? y(k, p) : y(k, p, true, true);
                        u += x.value;
                        o.push(u);
                        p += x.length;
                    }
                }
                o.forEach(function(a) {
                    m.frames.push(k.subarray(p, p + a));
                    p += a;
                });
                return m;
            };
            var E = function a(b) {
                var c = 0;
                var d = {};
                while(c < b.length){
                    var e = b[c] & 0x7f;
                    var f = b[c + 1];
                    var g = void 0;
                    if (f === 1) {
                        g = b[c + 2];
                    } else {
                        g = b.subarray(c + 2, c + 2 + f);
                    }
                    if (e === 1) {
                        d.profile = g;
                    } else if (e === 2) {
                        d.level = g;
                    } else if (e === 3) {
                        d.bitDepth = g;
                    } else if (e === 4) {
                        d.chromaSubsampling = g;
                    } else {
                        d[e] = g;
                    }
                    c += 2 + f;
                }
                return d;
            };
            var F = function a(b) {
                b = toUint8(b);
                var c = [];
                var d = C(b, [
                    v.Segment,
                    v.Tracks,
                    v.Track, 
                ]);
                if (!d.length) {
                    d = C(b, [
                        v.Tracks,
                        v.Track, 
                    ]);
                }
                if (!d.length) {
                    d = C(b, [
                        v.Track
                    ]);
                }
                if (!d.length) {
                    return c;
                }
                d.forEach(function(a) {
                    var b = C(a, v.TrackType)[0];
                    if (!b || !b.length) {
                        return;
                    }
                    if (b[0] === 1) {
                        b = "video";
                    } else if (b[0] === 2) {
                        b = "audio";
                    } else if (b[0] === 17) {
                        b = "subtitle";
                    } else {
                        return;
                    }
                    var d = {
                        rawCodec: bytesToString(C(a, [
                            v.CodecID
                        ])[0]),
                        type: b,
                        codecPrivate: C(a, [
                            v.CodecPrivate, 
                        ])[0],
                        number: bytesToNumber(C(a, [
                            v.TrackNumber
                        ])[0]),
                        defaultDuration: bytesToNumber(C(a, [
                            v.DefaultDuration
                        ])[0]),
                        default: C(a, [
                            v.FlagDefault
                        ])[0],
                        rawData: a
                    };
                    var e = "";
                    if (/V_MPEG4\/ISO\/AVC/.test(d.rawCodec)) {
                        e = "avc1." + getAvcCodec(d.codecPrivate);
                    } else if (/V_MPEGH\/ISO\/HEVC/.test(d.rawCodec)) {
                        e = "hev1." + getHvcCodec(d.codecPrivate);
                    } else if (/V_MPEG4\/ISO\/ASP/.test(d.rawCodec)) {
                        if (d.codecPrivate) {
                            e = "mp4v.20." + d.codecPrivate[4].toString();
                        } else {
                            e = "mp4v.20.9";
                        }
                    } else if (/^V_THEORA/.test(d.rawCodec)) {
                        e = "theora";
                    } else if (/^V_VP8/.test(d.rawCodec)) {
                        e = "vp8";
                    } else if (/^V_VP9/.test(d.rawCodec)) {
                        if (d.codecPrivate) {
                            var f = E(d.codecPrivate), g = f.profile, h = f.level, i = f.bitDepth, j = f.chromaSubsampling;
                            e = "vp09.";
                            e += padStart(g, 2, "0") + ".";
                            e += padStart(h, 2, "0") + ".";
                            e += padStart(i, 2, "0") + ".";
                            e += "" + padStart(j, 2, "0");
                            var k = C(a, [
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
                            var l = C(a, [
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
                            var m = C(a, [
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
                            var n = C(a, [
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
                            if (k.length || l.length || m.length || n.length) {
                                e += "." + padStart(n[0], 2, "0");
                                e += "." + padStart(m[0], 2, "0");
                                e += "." + padStart(k[0], 2, "0");
                                e += "." + padStart(l[0], 2, "0");
                            }
                        } else {
                            e = "vp9";
                        }
                    } else if (/^V_AV1/.test(d.rawCodec)) {
                        e = "av01." + getAv1Codec(d.codecPrivate);
                    } else if (/A_ALAC/.test(d.rawCodec)) {
                        e = "alac";
                    } else if (/A_MPEG\/L2/.test(d.rawCodec)) {
                        e = "mp2";
                    } else if (/A_MPEG\/L3/.test(d.rawCodec)) {
                        e = "mp3";
                    } else if (/^A_AAC/.test(d.rawCodec)) {
                        if (d.codecPrivate) {
                            e = "mp4a.40." + (d.codecPrivate[0] >>> 3).toString();
                        } else {
                            e = "mp4a.40.2";
                        }
                    } else if (/^A_AC3/.test(d.rawCodec)) {
                        e = "ac-3";
                    } else if (/^A_PCM/.test(d.rawCodec)) {
                        e = "pcm";
                    } else if (/^A_MS\/ACM/.test(d.rawCodec)) {
                        e = "speex";
                    } else if (/^A_EAC3/.test(d.rawCodec)) {
                        e = "ec-3";
                    } else if (/^A_VORBIS/.test(d.rawCodec)) {
                        e = "vorbis";
                    } else if (/^A_FLAC/.test(d.rawCodec)) {
                        e = "flac";
                    } else if (/^A_OPUS/.test(d.rawCodec)) {
                        e = "opus";
                    }
                    d.codec = e;
                    c.push(d);
                });
                return c.sort(function(a, b) {
                    return a.number - b.number;
                });
            };
            var G = function a(b, c) {
                var d = [];
                var e = C(b, [
                    v.Segment
                ])[0];
                var f = C(e, [
                    v.SegmentInfo,
                    v.TimestampScale, 
                ])[0];
                if (f && f.length) {
                    f = bytesToNumber(f);
                } else {
                    f = 1000000;
                }
                var g = C(e, [
                    v.Cluster
                ]);
                if (!c) {
                    c = F(e);
                }
                g.forEach(function(a, b) {
                    var c = C(a, [
                        v.SimpleBlock, 
                    ]).map(function(a) {
                        return {
                            type: "simple",
                            data: a
                        };
                    });
                    var e = C(a, [
                        v.BlockGroup, 
                    ]).map(function(a) {
                        return {
                            type: "group",
                            data: a
                        };
                    });
                    var g = C(a, [
                        v.Timestamp
                    ])[0] || 0;
                    if (g && g.length) {
                        g = bytesToNumber(g);
                    }
                    var h = c.concat(e).sort(function(a, b) {
                        return a.data.byteOffset - b.data.byteOffset;
                    });
                    h.forEach(function(a, b) {
                        var c = D(a.data, a.type, f, g);
                        d.push(c);
                    });
                });
                return {
                    tracks: c,
                    blocks: d
                };
            };
            var H = c(8925);
            var I = (0, d.Ki)([
                0x00,
                0x00,
                0x00,
                0x01, 
            ]);
            var J = (0, d.Ki)([
                0x00,
                0x00,
                0x01, 
            ]);
            var K = (0, d.Ki)([
                0x00,
                0x00,
                0x03, 
            ]);
            var L = function a(b) {
                var c = [];
                var e = 1;
                while(e < b.length - 2){
                    if ((0, d.G3)(b.subarray(e, e + 3), K)) {
                        c.push(e + 2);
                        e++;
                    }
                    e++;
                }
                if (c.length === 0) {
                    return b;
                }
                var f = b.length - c.length;
                var g = new Uint8Array(f);
                var h = 0;
                for(e = 0; e < f; h++, e++){
                    if (h === c[0]) {
                        h++;
                        c.shift();
                    }
                    g[e] = b[h];
                }
                return g;
            };
            var M = function a(b, c, e, f) {
                if (f === void 0) {
                    f = Infinity;
                }
                b = (0, d.Ki)(b);
                e = [].concat(e);
                var g = 0;
                var h;
                var i = 0;
                while(g < b.length && (i < f || h)){
                    var j = void 0;
                    if ((0, d.G3)(b.subarray(g), I)) {
                        j = 4;
                    } else if ((0, d.G3)(b.subarray(g), J)) {
                        j = 3;
                    }
                    if (!j) {
                        g++;
                        continue;
                    }
                    i++;
                    if (h) {
                        return L(b.subarray(h, g));
                    }
                    var k = void 0;
                    if (c === "h264") {
                        k = b[g + j] & 0x1f;
                    } else if (c === "h265") {
                        k = (b[g + j] >> 1) & 0x3f;
                    }
                    if (e.indexOf(k) !== -1) {
                        h = g + j;
                    }
                    g += j + (c === "h264" ? 1 : 2);
                }
                return b.subarray(0, 0);
            };
            var N = function a(b, c, d) {
                return M(b, "h264", c, d);
            };
            var O = function a(b, c, d) {
                return M(b, "h265", c, d);
            };
            var P = {
                webm: (0, d.Ki)([
                    0x77,
                    0x65,
                    0x62,
                    0x6d, 
                ]),
                matroska: (0, d.Ki)([
                    0x6d,
                    0x61,
                    0x74,
                    0x72,
                    0x6f,
                    0x73,
                    0x6b,
                    0x61, 
                ]),
                flac: (0, d.Ki)([
                    0x66,
                    0x4c,
                    0x61,
                    0x43, 
                ]),
                ogg: (0, d.Ki)([
                    0x4f,
                    0x67,
                    0x67,
                    0x53, 
                ]),
                ac3: (0, d.Ki)([
                    0x0b,
                    0x77
                ]),
                riff: (0, d.Ki)([
                    0x52,
                    0x49,
                    0x46,
                    0x46, 
                ]),
                avi: (0, d.Ki)([
                    0x41,
                    0x56,
                    0x49
                ]),
                wav: (0, d.Ki)([
                    0x57,
                    0x41,
                    0x56,
                    0x45, 
                ]),
                "3gp": (0, d.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x33,
                    0x67, 
                ]),
                mp4: (0, d.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                fmp4: (0, d.Ki)([
                    0x73,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                mov: (0, d.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x71,
                    0x74, 
                ]),
                moov: (0, d.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x76, 
                ]),
                moof: (0, d.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x66, 
                ])
            };
            var Q = {
                aac: function a(b) {
                    var c = (0, H.c)(b);
                    return (0, d.G3)(b, [
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
                mp3: function a(b) {
                    var c = (0, H.c)(b);
                    return (0, d.G3)(b, [
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
                webm: function a(b) {
                    var c = C(b, [
                        v.EBML,
                        v.DocType, 
                    ])[0];
                    return (0, d.G3)(c, P.webm);
                },
                mkv: function a(b) {
                    var c = C(b, [
                        v.EBML,
                        v.DocType, 
                    ])[0];
                    return (0, d.G3)(c, P.matroska);
                },
                mp4: function a(b) {
                    if (Q["3gp"](b) || Q.mov(b)) {
                        return false;
                    }
                    if ((0, d.G3)(b, P.mp4, {
                        offset: 4
                    }) || (0, d.G3)(b, P.fmp4, {
                        offset: 4
                    })) {
                        return true;
                    }
                    if ((0, d.G3)(b, P.moof, {
                        offset: 4
                    }) || (0, d.G3)(b, P.moov, {
                        offset: 4
                    })) {
                        return true;
                    }
                },
                mov: function a(b) {
                    return (0, d.G3)(b, P.mov, {
                        offset: 4
                    });
                },
                "3gp": function a(b) {
                    return (0, d.G3)(b, P["3gp"], {
                        offset: 4
                    });
                },
                ac3: function a(b) {
                    var c = (0, H.c)(b);
                    return (0, d.G3)(b, P.ac3, {
                        offset: c
                    });
                },
                ts: function a(b) {
                    if (b.length < 189 && b.length >= 1) {
                        return b[0] === 0x47;
                    }
                    var c = 0;
                    while(c + 188 < b.length && c < 188){
                        if (b[c] === 0x47 && b[c + 188] === 0x47) {
                            return true;
                        }
                        c += 1;
                    }
                    return false;
                },
                flac: function a(b) {
                    var c = (0, H.c)(b);
                    return (0, d.G3)(b, P.flac, {
                        offset: c
                    });
                },
                ogg: function a(b) {
                    return (0, d.G3)(b, P.ogg);
                },
                avi: function a(b) {
                    return ((0, d.G3)(b, P.riff) && (0, d.G3)(b, P.avi, {
                        offset: 8
                    }));
                },
                wav: function a(b) {
                    return ((0, d.G3)(b, P.riff) && (0, d.G3)(b, P.wav, {
                        offset: 8
                    }));
                },
                h264: function a(b) {
                    return N(b, 7, 3).length;
                },
                h265: function a(b) {
                    return O(b, [
                        32,
                        33
                    ], 3).length;
                }
            };
            var R = Object.keys(Q).filter(function(a) {
                return a !== "ts" && a !== "h264" && a !== "h265";
            }).concat([
                "ts",
                "h264",
                "h265"
            ]);
            R.forEach(function(a) {
                var b = Q[a];
                Q[a] = function(a) {
                    return b((0, d.Ki)(a));
                };
            });
            var S = Q;
            var T = function a(b) {
                b = (0, d.Ki)(b);
                for(var c = 0; c < R.length; c++){
                    var e = R[c];
                    if (S[e](b)) {
                        return e;
                    }
                }
                return "";
            };
            var U = function a(b) {
                return o(b, [
                    "moof"
                ]).length > 0;
            };
        },
        6722: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return h;
                }
            });
            var d = c(8908);
            var e = c.n(d);
            var f = c(816)["Buffer"];
            var g = function a(b) {
                return e().atob ? e().atob(b) : f.from(b, "base64").toString("binary");
            };
            function h(a) {
                var b = g(a);
                var c = new Uint8Array(b.length);
                for(var d = 0; d < b.length; d++){
                    c[d] = b.charCodeAt(d);
                }
                return c;
            }
        },
        8925: function(a, b, c) {
            "use strict";
            c.d(b, {
                c: function() {
                    return g;
                }
            });
            var d = c(562);
            var e = (0, d.Ki)([
                0x49,
                0x44,
                0x33, 
            ]);
            var f = function a(b, c) {
                if (c === void 0) {
                    c = 0;
                }
                b = (0, d.Ki)(b);
                var e = b[c + 5];
                var f = (b[c + 6] << 21) | (b[c + 7] << 14) | (b[c + 8] << 7) | b[c + 9];
                var g = (e & 16) >> 4;
                if (g) {
                    return f + 20;
                }
                return f + 10;
            };
            var g = function a(b, c) {
                if (c === void 0) {
                    c = 0;
                }
                b = (0, d.Ki)(b);
                if (b.length - c < 10 || !(0, d.G3)(b, e, {
                    offset: c
                })) {
                    return c;
                }
                c += f(b, c);
                return a(b, c);
            };
        },
        8485: function(a, b, c) {
            "use strict";
            c.d(b, {
                t: function() {
                    return f;
                }
            });
            var d = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;
            var e = /^application\/dash\+xml/i;
            var f = function a(b) {
                if (d.test(b)) {
                    return "hls";
                }
                if (e.test(b)) {
                    return "dash";
                }
                if (b === "application/vnd.videojs.vhs+json") {
                    return "vhs-json";
                }
                return null;
            };
        },
        779: function(a, b, c) {
            "use strict";
            var d = c(9945);
            var e = c.n(d);
            var f = c(8908);
            var g = c.n(f);
            var h = "http://example.com";
            var i = function a(b, c) {
                if (/^[a-z]+:/i.test(c)) {
                    return c;
                }
                if (/^data:/.test(b)) {
                    b = (g().location && g().location.href) || "";
                }
                var d = typeof g().URL === "function";
                var f = /^\/\//.test(b);
                var i = !g().location && !/\/\//i.test(b);
                if (d) {
                    b = new (g().URL)(b, g().location || h);
                } else if (!/\/\//i.test(b)) {
                    b = e().buildAbsoluteURL((g().location && g().location.href) || "", b);
                }
                if (d) {
                    var j = new URL(c, b);
                    if (i) {
                        return j.href.slice(h.length);
                    } else if (f) {
                        return j.href.slice(j.protocol.length);
                    }
                    return j.href;
                }
                return e().buildAbsoluteURL(b, c);
            };
            b["Z"] = i;
        },
        3490: function(a, b, c) {
            "use strict";
            var d = c(8908);
            var e = function a(b, c) {
                if (c === void 0) {
                    c = false;
                }
                return function(a, e, g) {
                    if (a) {
                        b(a);
                        return;
                    }
                    if (e.statusCode >= 400 && e.statusCode <= 599) {
                        var h = g;
                        if (c) {
                            if (d.TextDecoder) {
                                var i = f(e.headers && e.headers["content-type"]);
                                try {
                                    h = new TextDecoder(i).decode(g);
                                } catch (j) {}
                            } else {
                                h = String.fromCharCode.apply(null, new Uint8Array(g));
                            }
                        }
                        b({
                            cause: h
                        });
                        return;
                    }
                    b(null, g);
                };
            };
            function f(a) {
                if (a === void 0) {
                    a = "";
                }
                return a.toLowerCase().split(";").reduce(function(a, b) {
                    var c = b.split("="), d = c[0], e = c[1];
                    if (d.trim() === "charset") {
                        return e.trim();
                    }
                    return a;
                }, "utf-8");
            }
            a.exports = e;
        },
        9603: function(a, b, c) {
            "use strict";
            var d = c(8908);
            var e = c(7154);
            var f = c(7376);
            k.httpHandler = c(3490);
            var g = function a(b) {
                var c = {};
                if (!b) {
                    return c;
                }
                b.trim().split("\n").forEach(function(a) {
                    var b = a.indexOf(":");
                    var d = a.slice(0, b).trim().toLowerCase();
                    var e = a.slice(b + 1).trim();
                    if (typeof c[d] === "undefined") {
                        c[d] = e;
                    } else if (Array.isArray(c[d])) {
                        c[d].push(e);
                    } else {
                        c[d] = [
                            c[d],
                            e
                        ];
                    }
                });
                return c;
            };
            a.exports = k;
            a.exports["default"] = k;
            k.XMLHttpRequest = d.XMLHttpRequest || n;
            k.XDomainRequest = "withCredentials" in new k.XMLHttpRequest() ? k.XMLHttpRequest : d.XDomainRequest;
            h([
                "get",
                "put",
                "post",
                "patch",
                "head",
                "delete"
            ], function(a) {
                k[a === "delete" ? "del" : a] = function(b, c, d) {
                    c = j(b, c, d);
                    c.method = a.toUpperCase();
                    return l(c);
                };
            });
            function h(a, b) {
                for(var c = 0; c < a.length; c++){
                    b(a[c]);
                }
            }
            function i(a) {
                for(var b in a){
                    if (a.hasOwnProperty(b)) return false;
                }
                return true;
            }
            function j(a, b, c) {
                var d = a;
                if (f(b)) {
                    c = b;
                    if (typeof a === "string") {
                        d = {
                            uri: a
                        };
                    }
                } else {
                    d = e({}, b, {
                        uri: a
                    });
                }
                d.callback = c;
                return d;
            }
            function k(a, b, c) {
                b = j(a, b, c);
                return l(b);
            }
            function l(a) {
                if (typeof a.callback === "undefined") {
                    throw new Error("callback argument missing");
                }
                var b = false;
                var c = function c(d, e, f) {
                    if (!b) {
                        b = true;
                        a.callback(d, e, f);
                    }
                };
                function d() {
                    if (j.readyState === 4) {
                        setTimeout(h, 0);
                    }
                }
                function e() {
                    var a = undefined;
                    if (j.response) {
                        a = j.response;
                    } else {
                        a = j.responseText || m(j);
                    }
                    if (t) {
                        try {
                            a = JSON.parse(a);
                        } catch (b) {}
                    }
                    return a;
                }
                function f(a) {
                    clearTimeout(u);
                    if (!(a instanceof Error)) {
                        a = new Error("" + (a || "Unknown XMLHttpRequest Error"));
                    }
                    a.statusCode = 0;
                    return c(a, v);
                }
                function h() {
                    if (n) return;
                    var b;
                    clearTimeout(u);
                    if (a.useXDR && j.status === undefined) {
                        b = 200;
                    } else {
                        b = j.status === 1223 ? 204 : j.status;
                    }
                    var d = v;
                    var f = null;
                    if (b !== 0) {
                        d = {
                            body: e(),
                            statusCode: b,
                            method: p,
                            headers: {},
                            url: o,
                            rawRequest: j
                        };
                        if (j.getAllResponseHeaders) {
                            d.headers = g(j.getAllResponseHeaders());
                        }
                    } else {
                        f = new Error("Internal XMLHttpRequest Error");
                    }
                    return c(f, d, d.body);
                }
                var j = a.xhr || null;
                if (!j) {
                    if (a.cors || a.useXDR) {
                        j = new k.XDomainRequest();
                    } else {
                        j = new k.XMLHttpRequest();
                    }
                }
                var l;
                var n;
                var o = (j.url = a.uri || a.url);
                var p = (j.method = a.method || "GET");
                var q = a.body || a.data;
                var r = (j.headers = a.headers || {});
                var s = !!a.sync;
                var t = false;
                var u;
                var v = {
                    body: undefined,
                    headers: {},
                    statusCode: 0,
                    method: p,
                    url: o,
                    rawRequest: j
                };
                if ("json" in a && a.json !== false) {
                    t = true;
                    r["accept"] || r["Accept"] || (r["Accept"] = "application/json");
                    if (p !== "GET" && p !== "HEAD") {
                        r["content-type"] || r["Content-Type"] || (r["Content-Type"] = "application/json");
                        q = JSON.stringify(a.json === true ? q : a.json);
                    }
                }
                j.onreadystatechange = d;
                j.onload = h;
                j.onerror = f;
                j.onprogress = function() {};
                j.onabort = function() {
                    n = true;
                };
                j.ontimeout = f;
                j.open(p, o, !s, a.username, a.password);
                if (!s) {
                    j.withCredentials = !!a.withCredentials;
                }
                if (!s && a.timeout > 0) {
                    u = setTimeout(function() {
                        if (n) return;
                        n = true;
                        j.abort("timeout");
                        var a = new Error("XMLHttpRequest timeout");
                        a.code = "ETIMEDOUT";
                        f(a);
                    }, a.timeout);
                }
                if (j.setRequestHeader) {
                    for(l in r){
                        if (r.hasOwnProperty(l)) {
                            j.setRequestHeader(l, r[l]);
                        }
                    }
                } else if (a.headers && !i(a.headers)) {
                    throw new Error("Headers cannot be set on an XDomainRequest object");
                }
                if ("responseType" in a) {
                    j.responseType = a.responseType;
                }
                if ("beforeSend" in a && typeof a.beforeSend === "function") {
                    a.beforeSend(j);
                }
                j.send(q || null);
                return j;
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
        2167: function(a, b) {
            "use strict";
            function c(a, b) {
                if (b === undefined) {
                    b = Object;
                }
                return b && typeof b.freeze === "function" ? b.freeze(a) : a;
            }
            var d = c({
                HTML: "text/html",
                isHTML: function(a) {
                    return a === d.HTML;
                },
                XML_APPLICATION: "application/xml",
                XML_TEXT: "text/xml",
                XML_XHTML_APPLICATION: "application/xhtml+xml",
                XML_SVG_IMAGE: "image/svg+xml"
            });
            var e = c({
                HTML: "http://www.w3.org/1999/xhtml",
                isHTML: function(a) {
                    return a === e.HTML;
                },
                SVG: "http://www.w3.org/2000/svg",
                XML: "http://www.w3.org/XML/1998/namespace",
                XMLNS: "http://www.w3.org/2000/xmlns/"
            });
            b.freeze = c;
            b.MIME_TYPE = d;
            b.NAMESPACE = e;
        },
        6129: function(a, b, c) {
            var d;
            var e = c(2167);
            var f = c(1146);
            var g = c(1045);
            var h = c(6925);
            var i = f.DOMImplementation;
            var j = e.NAMESPACE;
            var k = h.ParseError;
            var l = h.XMLReader;
            function m(a) {
                this.options = a || {
                    locator: {}
                };
            }
            m.prototype.parseFromString = function(a, b) {
                var c = this.options;
                var d = new l();
                var e = c.domBuilder || new o();
                var f = c.errorHandler;
                var h = c.locator;
                var i = c.xmlns || {};
                var k = /\/x?html?$/.test(b);
                var m = k ? g.HTML_ENTITIES : g.XML_ENTITIES;
                if (h) {
                    e.setDocumentLocator(h);
                }
                d.errorHandler = n(f, e, h);
                d.domBuilder = c.domBuilder || e;
                if (k) {
                    i[""] = j.HTML;
                }
                i.xml = i.xml || j.XML;
                if (a && typeof a === "string") {
                    d.parse(a, i, m);
                } else {
                    d.errorHandler.error("invalid doc source");
                }
                return e.doc;
            };
            function n(a, b, c) {
                if (!a) {
                    if (b instanceof o) {
                        return b;
                    }
                    a = b;
                }
                var d = {};
                var e = a instanceof Function;
                c = c || {};
                function f(b) {
                    var f = a[b];
                    if (!f && e) {
                        f = a.length == 2 ? function(c) {
                            a(b, c);
                        } : a;
                    }
                    d[b] = (f && function(a) {
                        f("[xmldom " + b + "]\t" + a + q(c));
                    }) || function() {};
                }
                f("warning");
                f("error");
                f("fatalError");
                return d;
            }
            function o() {
                this.cdata = false;
            }
            function p(a, b) {
                b.lineNumber = a.lineNumber;
                b.columnNumber = a.columnNumber;
            }
            o.prototype = {
                startDocument: function() {
                    this.doc = new i().createDocument(null, null, null);
                    if (this.locator) {
                        this.doc.documentURI = this.locator.systemId;
                    }
                },
                startElement: function(a, b, c, d) {
                    var e = this.doc;
                    var f = e.createElementNS(a, c || b);
                    var g = d.length;
                    s(this, f);
                    this.currentElement = f;
                    this.locator && p(this.locator, f);
                    for(var h = 0; h < g; h++){
                        var a = d.getURI(h);
                        var i = d.getValue(h);
                        var c = d.getQName(h);
                        var j = e.createAttributeNS(a, c);
                        this.locator && p(d.getLocator(h), j);
                        j.value = j.nodeValue = i;
                        f.setAttributeNode(j);
                    }
                },
                endElement: function(a, b, c) {
                    var d = this.currentElement;
                    var e = d.tagName;
                    this.currentElement = d.parentNode;
                },
                startPrefixMapping: function(a, b) {},
                endPrefixMapping: function(a) {},
                processingInstruction: function(a, b) {
                    var c = this.doc.createProcessingInstruction(a, b);
                    this.locator && p(this.locator, c);
                    s(this, c);
                },
                ignorableWhitespace: function(a, b, c) {},
                characters: function(a, b, c) {
                    a = r.apply(this, arguments);
                    if (a) {
                        if (this.cdata) {
                            var d = this.doc.createCDATASection(a);
                        } else {
                            var d = this.doc.createTextNode(a);
                        }
                        if (this.currentElement) {
                            this.currentElement.appendChild(d);
                        } else if (/^\s*$/.test(a)) {
                            this.doc.appendChild(d);
                        }
                        this.locator && p(this.locator, d);
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
                comment: function(a, b, c) {
                    a = r.apply(this, arguments);
                    var d = this.doc.createComment(a);
                    this.locator && p(this.locator, d);
                    s(this, d);
                },
                startCDATA: function() {
                    this.cdata = true;
                },
                endCDATA: function() {
                    this.cdata = false;
                },
                startDTD: function(a, b, c) {
                    var d = this.doc.implementation;
                    if (d && d.createDocumentType) {
                        var e = d.createDocumentType(a, b, c);
                        this.locator && p(this.locator, e);
                        s(this, e);
                        this.doc.doctype = e;
                    }
                },
                warning: function(a) {
                    console.warn("[xmldom warning]\t" + a, q(this.locator));
                },
                error: function(a) {
                    console.error("[xmldom error]\t" + a, q(this.locator));
                },
                fatalError: function(a) {
                    throw new k(a, this.locator);
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
                o.prototype[a] = function() {
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
            d = o;
            b.DOMParser = m;
            d = f.DOMImplementation;
            d = f.XMLSerializer;
        },
        1146: function(a, b, c) {
            var d = c(2167);
            var e = d.NAMESPACE;
            function f(a) {
                return a !== "";
            }
            function g(a) {
                return a ? a.split(/[\t\n\f\r ]+/).filter(f) : [];
            }
            function h(a, b) {
                if (!a.hasOwnProperty(b)) {
                    a[b] = true;
                }
                return a;
            }
            function i(a) {
                if (!a) return [];
                var b = g(a);
                return Object.keys(b.reduce(h, {}));
            }
            function j(a) {
                return function(b) {
                    return a && a.indexOf(b) !== -1;
                };
            }
            function k(a, b) {
                for(var c in a){
                    b[c] = a[c];
                }
            }
            function l(a, b) {
                var c = a.prototype;
                if (!(c instanceof b)) {
                    function d() {}
                    d.prototype = b.prototype;
                    d = new d();
                    k(c, d);
                    a.prototype = c = d;
                }
                if (c.constructor != a) {
                    if (typeof a != "function") {
                        console.error("unknown Class:" + a);
                    }
                    c.constructor = a;
                }
            }
            var m = {};
            var n = (m.ELEMENT_NODE = 1);
            var o = (m.ATTRIBUTE_NODE = 2);
            var p = (m.TEXT_NODE = 3);
            var q = (m.CDATA_SECTION_NODE = 4);
            var r = (m.ENTITY_REFERENCE_NODE = 5);
            var s = (m.ENTITY_NODE = 6);
            var t = (m.PROCESSING_INSTRUCTION_NODE = 7);
            var u = (m.COMMENT_NODE = 8);
            var v = (m.DOCUMENT_NODE = 9);
            var w = (m.DOCUMENT_TYPE_NODE = 10);
            var x = (m.DOCUMENT_FRAGMENT_NODE = 11);
            var y = (m.NOTATION_NODE = 12);
            var z = {};
            var A = {};
            var B = (z.INDEX_SIZE_ERR = ((A[1] = "Index size error"), 1));
            var C = (z.DOMSTRING_SIZE_ERR = ((A[2] = "DOMString size error"), 2));
            var D = (z.HIERARCHY_REQUEST_ERR = ((A[3] = "Hierarchy request error"), 3));
            var E = (z.WRONG_DOCUMENT_ERR = ((A[4] = "Wrong document"), 4));
            var F = (z.INVALID_CHARACTER_ERR = ((A[5] = "Invalid character"), 5));
            var G = (z.NO_DATA_ALLOWED_ERR = ((A[6] = "No data allowed"), 6));
            var H = (z.NO_MODIFICATION_ALLOWED_ERR = ((A[7] = "No modification allowed"), 7));
            var I = (z.NOT_FOUND_ERR = ((A[8] = "Not found"), 8));
            var J = (z.NOT_SUPPORTED_ERR = ((A[9] = "Not supported"), 9));
            var K = (z.INUSE_ATTRIBUTE_ERR = ((A[10] = "Attribute in use"), 10));
            var L = (z.INVALID_STATE_ERR = ((A[11] = "Invalid state"), 11));
            var M = (z.SYNTAX_ERR = ((A[12] = "Syntax error"), 12));
            var N = (z.INVALID_MODIFICATION_ERR = ((A[13] = "Invalid modification"), 13));
            var O = (z.NAMESPACE_ERR = ((A[14] = "Invalid namespace"), 14));
            var P = (z.INVALID_ACCESS_ERR = ((A[15] = "Invalid access"), 15));
            function Q(a, b) {
                if (b instanceof Error) {
                    var c = b;
                } else {
                    c = this;
                    Error.call(this, A[a]);
                    this.message = A[a];
                    if (Error.captureStackTrace) Error.captureStackTrace(this, Q);
                }
                c.code = a;
                if (b) this.message = this.message + ": " + b;
                return c;
            }
            Q.prototype = Error.prototype;
            k(z, Q);
            function R() {}
            R.prototype = {
                length: 0,
                item: function(a) {
                    return this[a] || null;
                },
                toString: function(a, b) {
                    for(var c = [], d = 0; d < this.length; d++){
                        ax(this[d], c, a, b);
                    }
                    return c.join("");
                }
            };
            function S(a, b) {
                this._node = a;
                this._refresh = b;
                T(this);
            }
            function T(a) {
                var b = a._node._inc || a._node.ownerDocument._inc;
                if (a._inc != b) {
                    var c = a._refresh(a._node);
                    aA(a, "length", c.length);
                    k(c, a);
                    a._inc = b;
                }
            }
            S.prototype.item = function(a) {
                T(this);
                return this[a];
            };
            l(S, R);
            function U() {}
            function V(a, b) {
                var c = a.length;
                while(c--){
                    if (a[c] === b) {
                        return c;
                    }
                }
            }
            function W(a, b, c, d) {
                if (d) {
                    b[V(b, d)] = c;
                } else {
                    b[b.length++] = c;
                }
                if (a) {
                    c.ownerElement = a;
                    var e = a.ownerDocument;
                    if (e) {
                        d && ac(e, a, d);
                        ab(e, a, c);
                    }
                }
            }
            function X(a, b, c) {
                var d = V(b, c);
                if (d >= 0) {
                    var e = b.length - 1;
                    while(d < e){
                        b[d] = b[++d];
                    }
                    b.length = e;
                    if (a) {
                        var f = a.ownerDocument;
                        if (f) {
                            ac(f, a, c);
                            c.ownerElement = null;
                        }
                    }
                } else {
                    throw Q(I, new Error(a.tagName + "@" + c));
                }
            }
            U.prototype = {
                length: 0,
                item: R.prototype.item,
                getNamedItem: function(a) {
                    var b = this.length;
                    while(b--){
                        var c = this[b];
                        if (c.nodeName == a) {
                            return c;
                        }
                    }
                },
                setNamedItem: function(a) {
                    var b = a.ownerElement;
                    if (b && b != this._ownerElement) {
                        throw new Q(K);
                    }
                    var c = this.getNamedItem(a.nodeName);
                    W(this._ownerElement, this, a, c);
                    return c;
                },
                setNamedItemNS: function(a) {
                    var b = a.ownerElement, c;
                    if (b && b != this._ownerElement) {
                        throw new Q(K);
                    }
                    c = this.getNamedItemNS(a.namespaceURI, a.localName);
                    W(this._ownerElement, this, a, c);
                    return c;
                },
                removeNamedItem: function(a) {
                    var b = this.getNamedItem(a);
                    X(this._ownerElement, this, b);
                    return b;
                },
                removeNamedItemNS: function(a, b) {
                    var c = this.getNamedItemNS(a, b);
                    X(this._ownerElement, this, c);
                    return c;
                },
                getNamedItemNS: function(a, b) {
                    var c = this.length;
                    while(c--){
                        var d = this[c];
                        if (d.localName == b && d.namespaceURI == a) {
                            return d;
                        }
                    }
                    return null;
                }
            };
            function Y() {}
            Y.prototype = {
                hasFeature: function(a, b) {
                    return true;
                },
                createDocument: function(a, b, c) {
                    var d = new aa();
                    d.implementation = this;
                    d.childNodes = new R();
                    d.doctype = c || null;
                    if (c) {
                        d.appendChild(c);
                    }
                    if (b) {
                        var e = d.createElementNS(a, b);
                        d.appendChild(e);
                    }
                    return d;
                },
                createDocumentType: function(a, b, c) {
                    var d = new an();
                    d.name = a;
                    d.nodeName = a;
                    d.publicId = b || "";
                    d.systemId = c || "";
                    return d;
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
                insertBefore: function(a, b) {
                    return af(this, a, b);
                },
                replaceChild: function(a, b) {
                    this.insertBefore(a, b);
                    if (b) {
                        this.removeChild(b);
                    }
                },
                removeChild: function(a) {
                    return ae(this, a);
                },
                appendChild: function(a) {
                    return this.insertBefore(a, null);
                },
                hasChildNodes: function() {
                    return this.firstChild != null;
                },
                cloneNode: function(a) {
                    return az(this.ownerDocument || this, this, a);
                },
                normalize: function() {
                    var a = this.firstChild;
                    while(a){
                        var b = a.nextSibling;
                        if (b && b.nodeType == p && a.nodeType == p) {
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
                lookupPrefix: function(a) {
                    var b = this;
                    while(b){
                        var c = b._nsMap;
                        if (c) {
                            for(var d in c){
                                if (c[d] == a) {
                                    return d;
                                }
                            }
                        }
                        b = b.nodeType == o ? b.ownerDocument : b.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function(a) {
                    var b = this;
                    while(b){
                        var c = b._nsMap;
                        if (c) {
                            if (a in c) {
                                return c[a];
                            }
                        }
                        b = b.nodeType == o ? b.ownerDocument : b.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function(a) {
                    var b = this.lookupPrefix(a);
                    return b == null;
                }
            };
            function $(a) {
                return ((a == "<" && "&lt;") || (a == ">" && "&gt;") || (a == "&" && "&amp;") || (a == '"' && "&quot;") || "&#" + a.charCodeAt() + ";");
            }
            k(m, Z);
            k(m, Z.prototype);
            function _(a, b) {
                if (b(a)) {
                    return true;
                }
                if ((a = a.firstChild)) {
                    do {
                        if (_(a, b)) {
                            return true;
                        }
                    }while ((a = a.nextSibling))
                }
            }
            function aa() {}
            function ab(a, b, c) {
                a && a._inc++;
                var d = c.namespaceURI;
                if (d === e.XMLNS) {
                    b._nsMap[c.prefix ? c.localName : ""] = c.value;
                }
            }
            function ac(a, b, c, d) {
                a && a._inc++;
                var f = c.namespaceURI;
                if (f === e.XMLNS) {
                    delete b._nsMap[c.prefix ? c.localName : ""];
                }
            }
            function ad(a, b, c) {
                if (a && a._inc) {
                    a._inc++;
                    var d = b.childNodes;
                    if (c) {
                        d[d.length++] = c;
                    } else {
                        var e = b.firstChild;
                        var f = 0;
                        while(e){
                            d[f++] = e;
                            e = e.nextSibling;
                        }
                        d.length = f;
                    }
                }
            }
            function ae(a, b) {
                var c = b.previousSibling;
                var d = b.nextSibling;
                if (c) {
                    c.nextSibling = d;
                } else {
                    a.firstChild = d;
                }
                if (d) {
                    d.previousSibling = c;
                } else {
                    a.lastChild = c;
                }
                ad(a.ownerDocument, a);
                return b;
            }
            function af(a, b, c) {
                var d = b.parentNode;
                if (d) {
                    d.removeChild(b);
                }
                if (b.nodeType === x) {
                    var e = b.firstChild;
                    if (e == null) {
                        return b;
                    }
                    var f = b.lastChild;
                } else {
                    e = f = b;
                }
                var g = c ? c.previousSibling : a.lastChild;
                e.previousSibling = g;
                f.nextSibling = c;
                if (g) {
                    g.nextSibling = e;
                } else {
                    a.firstChild = e;
                }
                if (c == null) {
                    a.lastChild = f;
                } else {
                    c.previousSibling = f;
                }
                do {
                    e.parentNode = a;
                }while (e !== f && (e = e.nextSibling))
                ad(a.ownerDocument || a, a);
                if (b.nodeType == x) {
                    b.firstChild = b.lastChild = null;
                }
                return b;
            }
            function ag(a, b) {
                var c = b.parentNode;
                if (c) {
                    var d = a.lastChild;
                    c.removeChild(b);
                    var d = a.lastChild;
                }
                var d = a.lastChild;
                b.parentNode = a;
                b.previousSibling = d;
                b.nextSibling = null;
                if (d) {
                    d.nextSibling = b;
                } else {
                    a.firstChild = b;
                }
                a.lastChild = b;
                ad(a.ownerDocument, a, b);
                return b;
            }
            aa.prototype = {
                nodeName: "#document",
                nodeType: v,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function(a, b) {
                    if (a.nodeType == x) {
                        var c = a.firstChild;
                        while(c){
                            var d = c.nextSibling;
                            this.insertBefore(c, b);
                            c = d;
                        }
                        return a;
                    }
                    if (this.documentElement == null && a.nodeType == n) {
                        this.documentElement = a;
                    }
                    return (af(this, a, b), (a.ownerDocument = this), a);
                },
                removeChild: function(a) {
                    if (this.documentElement == a) {
                        this.documentElement = null;
                    }
                    return ae(this, a);
                },
                importNode: function(a, b) {
                    return ay(this, a, b);
                },
                getElementById: function(a) {
                    var b = null;
                    _(this.documentElement, function(c) {
                        if (c.nodeType == n) {
                            if (c.getAttribute("id") == a) {
                                b = c;
                                return true;
                            }
                        }
                    });
                    return b;
                },
                getElementsByClassName: function(a) {
                    var b = i(a);
                    return new S(this, function(c) {
                        var d = [];
                        if (b.length > 0) {
                            _(c.documentElement, function(e) {
                                if (e !== c && e.nodeType === n) {
                                    var f = e.getAttribute("class");
                                    if (f) {
                                        var g = a === f;
                                        if (!g) {
                                            var h = i(f);
                                            g = b.every(j(h));
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
                createElement: function(a) {
                    var b = new ah();
                    b.ownerDocument = this;
                    b.nodeName = a;
                    b.tagName = a;
                    b.localName = a;
                    b.childNodes = new R();
                    var c = (b.attributes = new U());
                    c._ownerElement = b;
                    return b;
                },
                createDocumentFragment: function() {
                    var a = new ar();
                    a.ownerDocument = this;
                    a.childNodes = new R();
                    return a;
                },
                createTextNode: function(a) {
                    var b = new ak();
                    b.ownerDocument = this;
                    b.appendData(a);
                    return b;
                },
                createComment: function(a) {
                    var b = new al();
                    b.ownerDocument = this;
                    b.appendData(a);
                    return b;
                },
                createCDATASection: function(a) {
                    var b = new am();
                    b.ownerDocument = this;
                    b.appendData(a);
                    return b;
                },
                createProcessingInstruction: function(a, b) {
                    var c = new as();
                    c.ownerDocument = this;
                    c.tagName = c.target = a;
                    c.nodeValue = c.data = b;
                    return c;
                },
                createAttribute: function(a) {
                    var b = new ai();
                    b.ownerDocument = this;
                    b.name = a;
                    b.nodeName = a;
                    b.localName = a;
                    b.specified = true;
                    return b;
                },
                createEntityReference: function(a) {
                    var b = new aq();
                    b.ownerDocument = this;
                    b.nodeName = a;
                    return b;
                },
                createElementNS: function(a, b) {
                    var c = new ah();
                    var d = b.split(":");
                    var e = (c.attributes = new U());
                    c.childNodes = new R();
                    c.ownerDocument = this;
                    c.nodeName = b;
                    c.tagName = b;
                    c.namespaceURI = a;
                    if (d.length == 2) {
                        c.prefix = d[0];
                        c.localName = d[1];
                    } else {
                        c.localName = b;
                    }
                    e._ownerElement = c;
                    return c;
                },
                createAttributeNS: function(a, b) {
                    var c = new ai();
                    var d = b.split(":");
                    c.ownerDocument = this;
                    c.nodeName = b;
                    c.name = b;
                    c.namespaceURI = a;
                    c.specified = true;
                    if (d.length == 2) {
                        c.prefix = d[0];
                        c.localName = d[1];
                    } else {
                        c.localName = b;
                    }
                    return c;
                }
            };
            l(aa, Z);
            function ah() {
                this._nsMap = {};
            }
            ah.prototype = {
                nodeType: n,
                hasAttribute: function(a) {
                    return this.getAttributeNode(a) != null;
                },
                getAttribute: function(a) {
                    var b = this.getAttributeNode(a);
                    return (b && b.value) || "";
                },
                getAttributeNode: function(a) {
                    return this.attributes.getNamedItem(a);
                },
                setAttribute: function(a, b) {
                    var c = this.ownerDocument.createAttribute(a);
                    c.value = c.nodeValue = "" + b;
                    this.setAttributeNode(c);
                },
                removeAttribute: function(a) {
                    var b = this.getAttributeNode(a);
                    b && this.removeAttributeNode(b);
                },
                appendChild: function(a) {
                    if (a.nodeType === x) {
                        return this.insertBefore(a, null);
                    } else {
                        return ag(this, a);
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
                removeAttributeNS: function(a, b) {
                    var c = this.getAttributeNodeNS(a, b);
                    c && this.removeAttributeNode(c);
                },
                hasAttributeNS: function(a, b) {
                    return (this.getAttributeNodeNS(a, b) != null);
                },
                getAttributeNS: function(a, b) {
                    var c = this.getAttributeNodeNS(a, b);
                    return (c && c.value) || "";
                },
                setAttributeNS: function(a, b, c) {
                    var d = this.ownerDocument.createAttributeNS(a, b);
                    d.value = d.nodeValue = "" + c;
                    this.setAttributeNode(d);
                },
                getAttributeNodeNS: function(a, b) {
                    return this.attributes.getNamedItemNS(a, b);
                },
                getElementsByTagName: function(a) {
                    return new S(this, function(b) {
                        var c = [];
                        _(b, function(d) {
                            if (d !== b && d.nodeType == n && (a === "*" || d.tagName == a)) {
                                c.push(d);
                            }
                        });
                        return c;
                    });
                },
                getElementsByTagNameNS: function(a, b) {
                    return new S(this, function(c) {
                        var d = [];
                        _(c, function(e) {
                            if (e !== c && e.nodeType === n && (a === "*" || e.namespaceURI === a) && (b === "*" || e.localName == b)) {
                                d.push(e);
                            }
                        });
                        return d;
                    });
                }
            };
            aa.prototype.getElementsByTagName = ah.prototype.getElementsByTagName;
            aa.prototype.getElementsByTagNameNS = ah.prototype.getElementsByTagNameNS;
            l(ah, Z);
            function ai() {}
            ai.prototype.nodeType = o;
            l(ai, Z);
            function aj() {}
            aj.prototype = {
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
                    throw new Error(A[D]);
                },
                deleteData: function(a, b) {
                    this.replaceData(a, b, "");
                },
                replaceData: function(a, b, c) {
                    var d = this.data.substring(0, a);
                    var e = this.data.substring(a + b);
                    c = d + c + e;
                    this.nodeValue = this.data = c;
                    this.length = c.length;
                }
            };
            l(aj, Z);
            function ak() {}
            ak.prototype = {
                nodeName: "#text",
                nodeType: p,
                splitText: function(a) {
                    var b = this.data;
                    var c = b.substring(a);
                    b = b.substring(0, a);
                    this.data = this.nodeValue = b;
                    this.length = b.length;
                    var d = this.ownerDocument.createTextNode(c);
                    if (this.parentNode) {
                        this.parentNode.insertBefore(d, this.nextSibling);
                    }
                    return d;
                }
            };
            l(ak, aj);
            function al() {}
            al.prototype = {
                nodeName: "#comment",
                nodeType: u
            };
            l(al, aj);
            function am() {}
            am.prototype = {
                nodeName: "#cdata-section",
                nodeType: q
            };
            l(am, aj);
            function an() {}
            an.prototype.nodeType = w;
            l(an, Z);
            function ao() {}
            ao.prototype.nodeType = y;
            l(ao, Z);
            function ap() {}
            ap.prototype.nodeType = s;
            l(ap, Z);
            function aq() {}
            aq.prototype.nodeType = r;
            l(aq, Z);
            function ar() {}
            ar.prototype.nodeName = "#document-fragment";
            ar.prototype.nodeType = x;
            l(ar, Z);
            function as() {}
            as.prototype.nodeType = t;
            l(as, Z);
            function at() {}
            at.prototype.serializeToString = function(a, b, c) {
                return au.call(a, b, c);
            };
            Z.prototype.toString = au;
            function au(a, b) {
                var c = [];
                var d = (this.nodeType == 9 && this.documentElement) || this;
                var e = d.prefix;
                var f = d.namespaceURI;
                if (f && e == null) {
                    var e = d.lookupPrefix(f);
                    if (e == null) {
                        var g = [
                            {
                                namespace: f,
                                prefix: null
                            }
                        ];
                    }
                }
                ax(this, c, a, b, g);
                return c.join("");
            }
            function av(a, b, c) {
                var d = a.prefix || "";
                var f = a.namespaceURI;
                if (!f) {
                    return false;
                }
                if ((d === "xml" && f === e.XML) || f === e.XMLNS) {
                    return false;
                }
                var g = c.length;
                while(g--){
                    var h = c[g];
                    if (h.prefix === d) {
                        return h.namespace !== f;
                    }
                }
                return true;
            }
            function aw(a, b, c) {
                a.push(" ", b, '="', c.replace(/[<&"]/g, $), '"');
            }
            function ax(a, b, c, d, f) {
                if (!f) {
                    f = [];
                }
                if (d) {
                    a = d(a);
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
                    case n:
                        var g = a.attributes;
                        var h = g.length;
                        var i = a.firstChild;
                        var j = a.tagName;
                        c = e.isHTML(a.namespaceURI) || c;
                        var k = j;
                        if (!c && !a.prefix && a.namespaceURI) {
                            var l;
                            for(var m = 0; m < g.length; m++){
                                if (g.item(m).name === "xmlns") {
                                    l = g.item(m).value;
                                    break;
                                }
                            }
                            if (!l) {
                                for(var s = f.length - 1; s >= 0; s--){
                                    var y = f[s];
                                    if (y.prefix === "" && y.namespace === a.namespaceURI) {
                                        l = y.namespace;
                                        break;
                                    }
                                }
                            }
                            if (l !== a.namespaceURI) {
                                for(var s = f.length - 1; s >= 0; s--){
                                    var y = f[s];
                                    if (y.namespace === a.namespaceURI) {
                                        if (y.prefix) {
                                            k = y.prefix + ":" + j;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        b.push("<", k);
                        for(var z = 0; z < h; z++){
                            var A = g.item(z);
                            if (A.prefix == "xmlns") {
                                f.push({
                                    prefix: A.localName,
                                    namespace: A.value
                                });
                            } else if (A.nodeName == "xmlns") {
                                f.push({
                                    prefix: "",
                                    namespace: A.value
                                });
                            }
                        }
                        for(var z = 0; z < h; z++){
                            var A = g.item(z);
                            if (av(A, c, f)) {
                                var B = A.prefix || "";
                                var C = A.namespaceURI;
                                aw(b, B ? "xmlns:" + B : "xmlns", C);
                                f.push({
                                    prefix: B,
                                    namespace: C
                                });
                            }
                            ax(A, b, c, d, f);
                        }
                        if (j === k && av(a, c, f)) {
                            var B = a.prefix || "";
                            var C = a.namespaceURI;
                            aw(b, B ? "xmlns:" + B : "xmlns", C);
                            f.push({
                                prefix: B,
                                namespace: C
                            });
                        }
                        if (i || (c && !/^(?:meta|link|img|br|hr|input)$/i.test(j))) {
                            b.push(">");
                            if (c && /^script$/i.test(j)) {
                                while(i){
                                    if (i.data) {
                                        b.push(i.data);
                                    } else {
                                        ax(i, b, c, d, f.slice());
                                    }
                                    i = i.nextSibling;
                                }
                            } else {
                                while(i){
                                    ax(i, b, c, d, f.slice());
                                    i = i.nextSibling;
                                }
                            }
                            b.push("</", k, ">");
                        } else {
                            b.push("/>");
                        }
                        return;
                    case v:
                    case x:
                        var i = a.firstChild;
                        while(i){
                            ax(i, b, c, d, f.slice());
                            i = i.nextSibling;
                        }
                        return;
                    case o:
                        return aw(b, a.name, a.value);
                    case p:
                        return b.push(a.data.replace(/[<&]/g, $).replace(/]]>/g, "]]&gt;"));
                    case q:
                        return b.push("<![CDATA[", a.data, "]]>");
                    case u:
                        return b.push("<!--", a.data, "-->");
                    case w:
                        var D = a.publicId;
                        var E = a.systemId;
                        b.push("<!DOCTYPE ", a.name);
                        if (D) {
                            b.push(" PUBLIC ", D);
                            if (E && E != ".") {
                                b.push(" ", E);
                            }
                            b.push(">");
                        } else if (E && E != ".") {
                            b.push(" SYSTEM ", E, ">");
                        } else {
                            var F = a.internalSubset;
                            if (F) {
                                b.push(" [", F, "]");
                            }
                            b.push(">");
                        }
                        return;
                    case t:
                        return b.push("<?", a.target, " ", a.data, "?>");
                    case r:
                        return b.push("&", a.nodeName, ";");
                    default:
                        b.push("??", a.nodeName);
                }
            }
            function ay(a, b, c) {
                var d;
                switch(b.nodeType){
                    case n:
                        d = b.cloneNode(false);
                        d.ownerDocument = a;
                    case x:
                        break;
                    case o:
                        c = true;
                        break;
                }
                if (!d) {
                    d = b.cloneNode(false);
                }
                d.ownerDocument = a;
                d.parentNode = null;
                if (c) {
                    var e = b.firstChild;
                    while(e){
                        d.appendChild(ay(a, e, c));
                        e = e.nextSibling;
                    }
                }
                return d;
            }
            function az(a, b, c) {
                var d = new b.constructor();
                for(var e in b){
                    var f = b[e];
                    if (typeof f != "object") {
                        if (f != d[e]) {
                            d[e] = f;
                        }
                    }
                }
                if (b.childNodes) {
                    d.childNodes = new R();
                }
                d.ownerDocument = a;
                switch(d.nodeType){
                    case n:
                        var g = b.attributes;
                        var h = (d.attributes = new U());
                        var i = g.length;
                        h._ownerElement = d;
                        for(var j = 0; j < i; j++){
                            d.setAttributeNode(az(a, g.item(j), true));
                        }
                        break;
                    case o:
                        c = true;
                }
                if (c) {
                    var k = b.firstChild;
                    while(k){
                        d.appendChild(az(a, k, c));
                        k = k.nextSibling;
                    }
                }
                return d;
            }
            function aA(a, b, c) {
                a[b] = c;
            }
            try {
                if (Object.defineProperty) {
                    Object.defineProperty(S.prototype, "length", {
                        get: function() {
                            T(this);
                            return this.$$length;
                        }
                    });
                    Object.defineProperty(Z.prototype, "textContent", {
                        get: function() {
                            return aB(this);
                        },
                        set: function(a) {
                            switch(this.nodeType){
                                case n:
                                case x:
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
                            case n:
                            case x:
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
                    aA = function(a, b, c) {
                        a["$$" + b] = c;
                    };
                }
            } catch (aC) {}
            b.DocumentType = an;
            b.DOMException = Q;
            b.DOMImplementation = Y;
            b.Element = ah;
            b.Node = Z;
            b.NodeList = R;
            b.XMLSerializer = at;
        },
        1045: function(a, b, c) {
            var d = c(2167).freeze;
            b.XML_ENTITIES = d({
                amp: "&",
                apos: "'",
                gt: ">",
                lt: "<",
                quot: '"'
            });
            b.HTML_ENTITIES = d({
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
            b.entityMap = b.HTML_ENTITIES;
        },
        3969: function(a, b, c) {
            var d;
            var e = c(1146);
            d = e.DOMImplementation;
            d = e.XMLSerializer;
            b.DOMParser = c(6129).DOMParser;
        },
        6925: function(a, b, c) {
            var d = c(2167).NAMESPACE;
            var e = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
            var f = new RegExp("[\\-\\.0-9" + e.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
            var g = new RegExp("^" + e.source + f.source + "*(?::" + e.source + f.source + "*)?$");
            var h = 0;
            var i = 1;
            var j = 2;
            var k = 3;
            var l = 4;
            var m = 5;
            var n = 6;
            var o = 7;
            function p(a, b) {
                this.message = a;
                this.locator = b;
                if (Error.captureStackTrace) Error.captureStackTrace(this, p);
            }
            p.prototype = new Error();
            p.prototype.name = p.name;
            function q() {}
            q.prototype = {
                parse: function(a, b, c) {
                    var d = this.domBuilder;
                    d.startDocument();
                    x(b, (b = {}));
                    r(a, b, c, d, this.errorHandler);
                    d.endDocument();
                }
            };
            function r(a, b, c, e, f) {
                function g(a) {
                    if (a > 0xffff) {
                        a -= 0x10000;
                        var b = 0xd800 + (a >> 10), c = 0xdc00 + (a & 0x3ff);
                        return String.fromCharCode(b, c);
                    } else {
                        return String.fromCharCode(a);
                    }
                }
                function h(a) {
                    var b = a.slice(1, -1);
                    if (b in c) {
                        return c[b];
                    } else if (b.charAt(0) === "#") {
                        return g(parseInt(b.substr(1).replace("x", "0x")));
                    } else {
                        f.error("entity not found:" + a);
                        return a;
                    }
                }
                function i(b) {
                    if (b > r) {
                        var c = a.substring(r, b).replace(/&#?\w+;/g, h);
                        n && j(r);
                        e.characters(c, 0, b - r);
                        r = b;
                    }
                }
                function j(b, c) {
                    while(b >= l && (c = m.exec(a))){
                        k = c.index;
                        l = k + c[0].length;
                        n.lineNumber++;
                    }
                    n.columnNumber = b - k + 1;
                }
                var k = 0;
                var l = 0;
                var m = /.*(?:\r\n?|\n)|.*$/g;
                var n = e.locator;
                var o = [
                    {
                        currentNSMap: b
                    }
                ];
                var q = {};
                var r = 0;
                while(true){
                    try {
                        var x = a.indexOf("<", r);
                        if (x < 0) {
                            if (!a.substr(r).match(/^\s*$/)) {
                                var B = e.doc;
                                var C = B.createTextNode(a.substr(r));
                                B.appendChild(C);
                                e.currentElement = C;
                            }
                            return;
                        }
                        if (x > r) {
                            i(x);
                        }
                        switch(a.charAt(x + 1)){
                            case "/":
                                var D = a.indexOf(">", x + 3);
                                var E = a.substring(x + 2, D).replace(/[ \t\n\r]+$/g, "");
                                var F = o.pop();
                                if (D < 0) {
                                    E = a.substring(x + 2).replace(/[\s<].*/, "");
                                    f.error("end tag name: " + E + " is not complete:" + F.tagName);
                                    D = x + 1 + E.length;
                                } else if (E.match(/\s</)) {
                                    E = E.replace(/[\s<].*/, "");
                                    f.error("end tag name: " + E + " maybe not complete");
                                    D = x + 1 + E.length;
                                }
                                var G = F.localNSMap;
                                var H = F.tagName == E;
                                var I = H || (F.tagName && F.tagName.toLowerCase() == E.toLowerCase());
                                if (I) {
                                    e.endElement(F.uri, F.localName, E);
                                    if (G) {
                                        for(var J in G){
                                            e.endPrefixMapping(J);
                                        }
                                    }
                                    if (!H) {
                                        f.fatalError("end tag name: " + E + " is not match the current start tagName:" + F.tagName);
                                    }
                                } else {
                                    o.push(F);
                                }
                                D++;
                                break;
                            case "?":
                                n && j(x);
                                D = z(a, x, e);
                                break;
                            case "!":
                                n && j(x);
                                D = y(a, x, e, f);
                                break;
                            default:
                                n && j(x);
                                var K = new A();
                                var L = o[o.length - 1].currentNSMap;
                                var D = t(a, x, K, L, h, f);
                                var M = K.length;
                                if (!K.closed && w(a, D, K.tagName, q)) {
                                    K.closed = true;
                                    if (!c.nbsp) {
                                        f.warning("unclosed xml attribute");
                                    }
                                }
                                if (n && M) {
                                    var N = s(n, {});
                                    for(var O = 0; O < M; O++){
                                        var P = K[O];
                                        j(P.offset);
                                        P.locator = s(n, {});
                                    }
                                    e.locator = N;
                                    if (u(K, e, L)) {
                                        o.push(K);
                                    }
                                    e.locator = n;
                                } else {
                                    if (u(K, e, L)) {
                                        o.push(K);
                                    }
                                }
                                if (d.isHTML(K.uri) && !K.closed) {
                                    D = v(a, D, K.tagName, h, e);
                                } else {
                                    D++;
                                }
                        }
                    } catch (Q) {
                        if (Q instanceof p) {
                            throw Q;
                        }
                        f.error("element parse error: " + Q);
                        D = -1;
                    }
                    if (D > r) {
                        r = D;
                    } else {
                        i(Math.max(x, r) + 1);
                    }
                }
            }
            function s(a, b) {
                b.lineNumber = a.lineNumber;
                b.columnNumber = a.columnNumber;
                return b;
            }
            function t(a, b, c, e, f, g) {
                function p(a, b, d) {
                    if (c.attributeNames.hasOwnProperty(a)) {
                        g.fatalError("Attribute " + a + " redefined");
                    }
                    c.addValue(a, b, d);
                }
                var q;
                var r;
                var s = ++b;
                var t = h;
                while(true){
                    var u = a.charAt(s);
                    switch(u){
                        case "=":
                            if (t === i) {
                                q = a.slice(b, s);
                                t = k;
                            } else if (t === j) {
                                t = k;
                            } else {
                                throw new Error("attribute equal must after attrName");
                            }
                            break;
                        case "'":
                        case '"':
                            if (t === k || t === i) {
                                if (t === i) {
                                    g.warning('attribute value must after "="');
                                    q = a.slice(b, s);
                                }
                                b = s + 1;
                                s = a.indexOf(u, b);
                                if (s > 0) {
                                    r = a.slice(b, s).replace(/&#?\w+;/g, f);
                                    p(q, r, b - 1);
                                    t = m;
                                } else {
                                    throw new Error("attribute value no end '" + u + "' match");
                                }
                            } else if (t == l) {
                                r = a.slice(b, s).replace(/&#?\w+;/g, f);
                                p(q, r, b);
                                g.warning('attribute "' + q + '" missed start quot(' + u + ")!!");
                                b = s + 1;
                                t = m;
                            } else {
                                throw new Error('attribute value must after "="');
                            }
                            break;
                        case "/":
                            switch(t){
                                case h:
                                    c.setTagName(a.slice(b, s));
                                case m:
                                case n:
                                case o:
                                    t = o;
                                    c.closed = true;
                                case l:
                                case i:
                                case j:
                                    break;
                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;
                        case "":
                            g.error("unexpected end of input");
                            if (t == h) {
                                c.setTagName(a.slice(b, s));
                            }
                            return s;
                        case ">":
                            switch(t){
                                case h:
                                    c.setTagName(a.slice(b, s));
                                case m:
                                case n:
                                case o:
                                    break;
                                case l:
                                case i:
                                    r = a.slice(b, s);
                                    if (r.slice(-1) === "/") {
                                        c.closed = true;
                                        r = r.slice(0, -1);
                                    }
                                case j:
                                    if (t === j) {
                                        r = q;
                                    }
                                    if (t == l) {
                                        g.warning('attribute "' + r + '" missed quot(")!');
                                        p(q, r.replace(/&#?\w+;/g, f), b);
                                    } else {
                                        if (!d.isHTML(e[""]) || !r.match(/^(?:disabled|checked|selected)$/i)) {
                                            g.warning('attribute "' + r + '" missed value!! "' + r + '" instead!!');
                                        }
                                        p(r, r, b);
                                    }
                                    break;
                                case k:
                                    throw new Error("attribute value missed!!");
                            }
                            return s;
                        case "\u0080":
                            u = " ";
                        default:
                            if (u <= " ") {
                                switch(t){
                                    case h:
                                        c.setTagName(a.slice(b, s));
                                        t = n;
                                        break;
                                    case i:
                                        q = a.slice(b, s);
                                        t = j;
                                        break;
                                    case l:
                                        var r = a.slice(b, s).replace(/&#?\w+;/g, f);
                                        g.warning('attribute "' + r + '" missed quot(")!!');
                                        p(q, r, b);
                                    case m:
                                        t = n;
                                        break;
                                }
                            } else {
                                switch(t){
                                    case j:
                                        var v = c.tagName;
                                        if (!d.isHTML(e[""]) || !q.match(/^(?:disabled|checked|selected)$/i)) {
                                            g.warning('attribute "' + q + '" missed value!! "' + q + '" instead2!!');
                                        }
                                        p(q, q, b);
                                        b = s;
                                        t = i;
                                        break;
                                    case m:
                                        g.warning('attribute space is required"' + q + '"!!');
                                    case n:
                                        t = i;
                                        b = s;
                                        break;
                                    case k:
                                        t = l;
                                        b = s;
                                        break;
                                    case o:
                                        throw new Error("elements closed character '/' and '>' must be connected to");
                                }
                            }
                    }
                    s++;
                }
            }
            function u(a, b, c) {
                var e = a.tagName;
                var f = null;
                var g = a.length;
                while(g--){
                    var h = a[g];
                    var i = h.qName;
                    var j = h.value;
                    var k = i.indexOf(":");
                    if (k > 0) {
                        var l = (h.prefix = i.slice(0, k));
                        var m = i.slice(k + 1);
                        var n = l === "xmlns" && m;
                    } else {
                        m = i;
                        l = null;
                        n = i === "xmlns" && "";
                    }
                    h.localName = m;
                    if (n !== false) {
                        if (f == null) {
                            f = {};
                            x(c, (c = {}));
                        }
                        c[n] = f[n] = j;
                        h.uri = d.XMLNS;
                        b.startPrefixMapping(n, j);
                    }
                }
                var g = a.length;
                while(g--){
                    h = a[g];
                    var l = h.prefix;
                    if (l) {
                        if (l === "xml") {
                            h.uri = d.XML;
                        }
                        if (l !== "xmlns") {
                            h.uri = c[l || ""];
                        }
                    }
                }
                var k = e.indexOf(":");
                if (k > 0) {
                    l = a.prefix = e.slice(0, k);
                    m = a.localName = e.slice(k + 1);
                } else {
                    l = null;
                    m = a.localName = e;
                }
                var o = (a.uri = c[l || ""]);
                b.startElement(o, m, e, a);
                if (a.closed) {
                    b.endElement(o, m, e);
                    if (f) {
                        for(l in f){
                            b.endPrefixMapping(l);
                        }
                    }
                } else {
                    a.currentNSMap = c;
                    a.localNSMap = f;
                    return true;
                }
            }
            function v(a, b, c, d, e) {
                if (/^(?:script|textarea)$/i.test(c)) {
                    var f = a.indexOf("</" + c + ">", b);
                    var g = a.substring(b + 1, f);
                    if (/[&<]/.test(g)) {
                        if (/^script$/i.test(c)) {
                            e.characters(g, 0, g.length);
                            return f;
                        }
                        g = g.replace(/&#?\w+;/g, d);
                        e.characters(g, 0, g.length);
                        return f;
                    }
                }
                return b + 1;
            }
            function w(a, b, c, d) {
                var e = d[c];
                if (e == null) {
                    e = a.lastIndexOf("</" + c + ">");
                    if (e < b) {
                        e = a.lastIndexOf("</" + c);
                    }
                    d[c] = e;
                }
                return e < b;
            }
            function x(a, b) {
                for(var c in a){
                    b[c] = a[c];
                }
            }
            function y(a, b, c, d) {
                var e = a.charAt(b + 2);
                switch(e){
                    case "-":
                        if (a.charAt(b + 3) === "-") {
                            var f = a.indexOf("-->", b + 4);
                            if (f > b) {
                                c.comment(a, b + 4, f - b - 4);
                                return f + 3;
                            } else {
                                d.error("Unclosed comment");
                                return -1;
                            }
                        } else {
                            return -1;
                        }
                    default:
                        if (a.substr(b + 3, 6) == "CDATA[") {
                            var f = a.indexOf("]]>", b + 9);
                            c.startCDATA();
                            c.characters(a, b + 9, f - b - 9);
                            c.endCDATA();
                            return f + 3;
                        }
                        var g = B(a, b);
                        var h = g.length;
                        if (h > 1 && /!doctype/i.test(g[0][0])) {
                            var i = g[1][0];
                            var j = false;
                            var k = false;
                            if (h > 3) {
                                if (/^public$/i.test(g[2][0])) {
                                    j = g[3][0];
                                    k = h > 4 && g[4][0];
                                } else if (/^system$/i.test(g[2][0])) {
                                    k = g[3][0];
                                }
                            }
                            var l = g[h - 1];
                            c.startDTD(i, j, k);
                            c.endDTD();
                            return l.index + l[0].length;
                        }
                }
                return -1;
            }
            function z(a, b, c) {
                var d = a.indexOf("?>", b);
                if (d) {
                    var e = a.substring(b, d).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (e) {
                        var f = e[0].length;
                        c.processingInstruction(e[1], e[2]);
                        return d + 2;
                    } else {
                        return -1;
                    }
                }
                return -1;
            }
            function A() {
                this.attributeNames = {};
            }
            A.prototype = {
                setTagName: function(a) {
                    if (!g.test(a)) {
                        throw new Error("invalid tagName:" + a);
                    }
                    this.tagName = a;
                },
                addValue: function(a, b, c) {
                    if (!g.test(a)) {
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
            function B(a, b) {
                var c;
                var d = [];
                var e = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                e.lastIndex = b;
                e.exec(a);
                while((c = e.exec(a))){
                    d.push(c);
                    if (c[1]) return d;
                }
            }
            b.XMLReader = q;
            b.ParseError = p;
        },
        9144: function(a, b, c) {
            var d = typeof c.g !== "undefined" ? c.g : typeof window !== "undefined" ? window : {};
            var e = c(7579);
            var f;
            if (typeof document !== "undefined") {
                f = document;
            } else {
                f = d["__GLOBAL_DOCUMENT_CACHE@4"];
                if (!f) {
                    f = d["__GLOBAL_DOCUMENT_CACHE@4"] = e;
                }
            }
            a.exports = f;
        },
        8908: function(a, b, c) {
            var d;
            if (typeof window !== "undefined") {
                d = window;
            } else if (typeof c.g !== "undefined") {
                d = c.g;
            } else if (typeof self !== "undefined") {
                d = self;
            } else {
                d = {};
            }
            a.exports = d;
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
        7537: function(a, b) {
            function c(a) {
                if (a && "object" === typeof a) {
                    var b = a.which || a.keyCode || a.charCode;
                    if (b) a = b;
                }
                if ("number" === typeof a) return g[a];
                var c = String(a);
                var f = d[c.toLowerCase()];
                if (f) return f;
                var f = e[c.toLowerCase()];
                if (f) return f;
                if (c.length === 1) return c.charCodeAt(0);
                return undefined;
            }
            c.isEventKey = function a(b, c) {
                if (b && "object" === typeof b) {
                    var f = b.which || b.keyCode || b.charCode;
                    if (f === null || f === undefined) {
                        return false;
                    }
                    if (typeof c === "string") {
                        var g = d[c.toLowerCase()];
                        if (g) {
                            return g === f;
                        }
                        var g = e[c.toLowerCase()];
                        if (g) {
                            return g === f;
                        }
                    } else if (typeof c === "number") {
                        return c === f;
                    }
                    return false;
                }
            };
            b = a.exports = c;
            var d = (b.code = b.codes = {
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
            var e = (b.aliases = {
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
            for(f = 97; f < 123; f++)d[String.fromCharCode(f)] = f - 32;
            for(var f = 48; f < 58; f++)d[f - 48] = f;
            for(f = 1; f < 13; f++)d["f" + f] = f + 111;
            for(f = 0; f < 10; f++)d["numpad " + f] = f + 96;
            var g = (b.names = b.title = {});
            for(f in d)g[d[f]] = f;
            for(var h in e){
                d[h] = e[h];
            }
        },
        9323: function(a, b, c) {
            "use strict";
            c.d(b, {
                _b: function() {
                    return r;
                }
            });
            var d = c(4578);
            var e = (function() {
                function a() {
                    this.listeners = {};
                }
                var b = a.prototype;
                b.on = function a(b, c) {
                    if (!this.listeners[b]) {
                        this.listeners[b] = [];
                    }
                    this.listeners[b].push(c);
                };
                b.off = function a(b, c) {
                    if (!this.listeners[b]) {
                        return false;
                    }
                    var d = this.listeners[b].indexOf(c);
                    this.listeners[b] = this.listeners[b].slice(0);
                    this.listeners[b].splice(d, 1);
                    return d > -1;
                };
                b.trigger = function a(b) {
                    var c = this.listeners[b];
                    if (!c) {
                        return;
                    }
                    if (arguments.length === 2) {
                        var d = c.length;
                        for(var e = 0; e < d; ++e){
                            c[e].call(this, arguments[1]);
                        }
                    } else {
                        var f = Array.prototype.slice.call(arguments, 1);
                        var g = c.length;
                        for(var h = 0; h < g; ++h){
                            c[h].apply(this, f);
                        }
                    }
                };
                b.dispose = function a() {
                    this.listeners = {};
                };
                b.pipe = function a(b) {
                    this.on("data", function(a) {
                        b.push(a);
                    });
                };
                return a;
            })();
            var f = c(7462);
            var g = c(7326);
            var h = c(6722);
            var i = (function(a) {
                (0, d.Z)(b, a);
                function b() {
                    var b;
                    b = a.call(this) || this;
                    b.buffer = "";
                    return b;
                }
                var c = b.prototype;
                c.push = function a(b) {
                    var c;
                    this.buffer += b;
                    c = this.buffer.indexOf("\n");
                    for(; c > -1; c = this.buffer.indexOf("\n")){
                        this.trigger("data", this.buffer.substring(0, c));
                        this.buffer = this.buffer.substring(c + 1);
                    }
                };
                return b;
            })(e);
            var j = String.fromCharCode(0x09);
            var k = function a(b) {
                var c = /([0-9.]*)?@?([0-9.]*)?/.exec(b || "");
                var d = {};
                if (c[1]) {
                    d.length = parseInt(c[1], 10);
                }
                if (c[2]) {
                    d.offset = parseInt(c[2], 10);
                }
                return d;
            };
            var l = function a() {
                var b = "[^=]*";
                var c = '"[^"]*"|[^,]*';
                var d = "(?:" + b + ")=(?:" + c + ")";
                return new RegExp("(?:^|,)(" + d + ")");
            };
            var m = function a(b) {
                var c = b.split(l());
                var d = {};
                var e = c.length;
                var f;
                while(e--){
                    if (c[e] === "") {
                        continue;
                    }
                    f = /([^=]*)=(.*)/.exec(c[e]).slice(1);
                    f[0] = f[0].replace(/^\s+|\s+$/g, "");
                    f[1] = f[1].replace(/^\s+|\s+$/g, "");
                    f[1] = f[1].replace(/^['"](.*)['"]$/g, "$1");
                    d[f[0]] = f[1];
                }
                return d;
            };
            var n = (function(a) {
                (0, d.Z)(b, a);
                function b() {
                    var b;
                    b = a.call(this) || this;
                    b.customParsers = [];
                    b.tagMappers = [];
                    return b;
                }
                var c = b.prototype;
                c.push = function a(b) {
                    var c = this;
                    var d;
                    var e;
                    b = b.trim();
                    if (b.length === 0) {
                        return;
                    }
                    if (b[0] !== "#") {
                        this.trigger("data", {
                            type: "uri",
                            uri: b
                        });
                        return;
                    }
                    var g = this.tagMappers.reduce(function(a, c) {
                        var d = c(b);
                        if (d === b) {
                            return a;
                        }
                        return a.concat([
                            d
                        ]);
                    }, [
                        b
                    ]);
                    g.forEach(function(a) {
                        for(var b = 0; b < c.customParsers.length; b++){
                            if (c.customParsers[b].call(c, a)) {
                                return;
                            }
                        }
                        if (a.indexOf("#EXT") !== 0) {
                            c.trigger("data", {
                                type: "comment",
                                text: a.slice(1)
                            });
                            return;
                        }
                        a = a.replace("\r", "");
                        d = /^#EXTM3U/.exec(a);
                        if (d) {
                            c.trigger("data", {
                                type: "tag",
                                tagType: "m3u"
                            });
                            return;
                        }
                        d = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "inf"
                            };
                            if (d[1]) {
                                e.duration = parseFloat(d[1]);
                            }
                            if (d[2]) {
                                e.title = d[2];
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "targetduration"
                            };
                            if (d[1]) {
                                e.duration = parseInt(d[1], 10);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "version"
                            };
                            if (d[1]) {
                                e.version = parseInt(d[1], 10);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "media-sequence"
                            };
                            if (d[1]) {
                                e.number = parseInt(d[1], 10);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "discontinuity-sequence"
                            };
                            if (d[1]) {
                                e.number = parseInt(d[1], 10);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "playlist-type"
                            };
                            if (d[1]) {
                                e.playlistType = d[1];
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(a);
                        if (d) {
                            e = (0, f.Z)(k(d[1]), {
                                type: "tag",
                                tagType: "byterange"
                            });
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "allow-cache"
                            };
                            if (d[1]) {
                                e.allowed = !/NO/.test(d[1]);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-MAP:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "map"
                            };
                            if (d[1]) {
                                var g = m(d[1]);
                                if (g.URI) {
                                    e.uri = g.URI;
                                }
                                if (g.BYTERANGE) {
                                    e.byterange = k(g.BYTERANGE);
                                }
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-STREAM-INF:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "stream-inf"
                            };
                            if (d[1]) {
                                e.attributes = m(d[1]);
                                if (e.attributes.RESOLUTION) {
                                    var h = e.attributes.RESOLUTION.split("x");
                                    var i = {};
                                    if (h[0]) {
                                        i.width = parseInt(h[0], 10);
                                    }
                                    if (h[1]) {
                                        i.height = parseInt(h[1], 10);
                                    }
                                    e.attributes.RESOLUTION = i;
                                }
                                if (e.attributes.BANDWIDTH) {
                                    e.attributes.BANDWIDTH = parseInt(e.attributes.BANDWIDTH, 10);
                                }
                                if (e.attributes["PROGRAM-ID"]) {
                                    e.attributes["PROGRAM-ID"] = parseInt(e.attributes["PROGRAM-ID"], 10);
                                }
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-MEDIA:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "media"
                            };
                            if (d[1]) {
                                e.attributes = m(d[1]);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-ENDLIST/.exec(a);
                        if (d) {
                            c.trigger("data", {
                                type: "tag",
                                tagType: "endlist"
                            });
                            return;
                        }
                        d = /^#EXT-X-DISCONTINUITY/.exec(a);
                        if (d) {
                            c.trigger("data", {
                                type: "tag",
                                tagType: "discontinuity"
                            });
                            return;
                        }
                        d = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "program-date-time"
                            };
                            if (d[1]) {
                                e.dateTimeString = d[1];
                                e.dateTimeObject = new Date(d[1]);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-KEY:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "key"
                            };
                            if (d[1]) {
                                e.attributes = m(d[1]);
                                if (e.attributes.IV) {
                                    if (e.attributes.IV.substring(0, 2).toLowerCase() === "0x") {
                                        e.attributes.IV = e.attributes.IV.substring(2);
                                    }
                                    e.attributes.IV = e.attributes.IV.match(/.{8}/g);
                                    e.attributes.IV[0] = parseInt(e.attributes.IV[0], 16);
                                    e.attributes.IV[1] = parseInt(e.attributes.IV[1], 16);
                                    e.attributes.IV[2] = parseInt(e.attributes.IV[2], 16);
                                    e.attributes.IV[3] = parseInt(e.attributes.IV[3], 16);
                                    e.attributes.IV = new Uint32Array(e.attributes.IV);
                                }
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-START:?(.*)$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "start"
                            };
                            if (d[1]) {
                                e.attributes = m(d[1]);
                                e.attributes["TIME-OFFSET"] = parseFloat(e.attributes["TIME-OFFSET"]);
                                e.attributes.PRECISE = /YES/.test(e.attributes.PRECISE);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "cue-out-cont"
                            };
                            if (d[1]) {
                                e.data = d[1];
                            } else {
                                e.data = "";
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "cue-out"
                            };
                            if (d[1]) {
                                e.data = d[1];
                            } else {
                                e.data = "";
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-CUE-IN:?(.*)?$/.exec(a);
                        if (d) {
                            e = {
                                type: "tag",
                                tagType: "cue-in"
                            };
                            if (d[1]) {
                                e.data = d[1];
                            } else {
                                e.data = "";
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-SKIP:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "skip"
                            };
                            e.attributes = m(d[1]);
                            if (e.attributes.hasOwnProperty("SKIPPED-SEGMENTS")) {
                                e.attributes["SKIPPED-SEGMENTS"] = parseInt(e.attributes["SKIPPED-SEGMENTS"], 10);
                            }
                            if (e.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES")) {
                                e.attributes["RECENTLY-REMOVED-DATERANGES"] = e.attributes["RECENTLY-REMOVED-DATERANGES"].split(j);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-PART:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "part"
                            };
                            e.attributes = m(d[1]);
                            [
                                "DURATION"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = parseFloat(e.attributes[a]);
                                }
                            });
                            [
                                "INDEPENDENT",
                                "GAP"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = /YES/.test(e.attributes[a]);
                                }
                            });
                            if (e.attributes.hasOwnProperty("BYTERANGE")) {
                                e.attributes.byterange = k(e.attributes.BYTERANGE);
                            }
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "server-control"
                            };
                            e.attributes = m(d[1]);
                            [
                                "CAN-SKIP-UNTIL",
                                "PART-HOLD-BACK",
                                "HOLD-BACK", 
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = parseFloat(e.attributes[a]);
                                }
                            });
                            [
                                "CAN-SKIP-DATERANGES",
                                "CAN-BLOCK-RELOAD"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = /YES/.test(e.attributes[a]);
                                }
                            });
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-PART-INF:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "part-inf"
                            };
                            e.attributes = m(d[1]);
                            [
                                "PART-TARGET"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = parseFloat(e.attributes[a]);
                                }
                            });
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "preload-hint"
                            };
                            e.attributes = m(d[1]);
                            [
                                "BYTERANGE-START",
                                "BYTERANGE-LENGTH"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = parseInt(e.attributes[a], 10);
                                    var b = a === "BYTERANGE-LENGTH" ? "length" : "offset";
                                    e.attributes.byterange = e.attributes.byterange || {};
                                    e.attributes.byterange[b] = e.attributes[a];
                                    delete e.attributes[a];
                                }
                            });
                            c.trigger("data", e);
                            return;
                        }
                        d = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(a);
                        if (d && d[1]) {
                            e = {
                                type: "tag",
                                tagType: "rendition-report"
                            };
                            e.attributes = m(d[1]);
                            [
                                "LAST-MSN",
                                "LAST-PART"
                            ].forEach(function(a) {
                                if (e.attributes.hasOwnProperty(a)) {
                                    e.attributes[a] = parseInt(e.attributes[a], 10);
                                }
                            });
                            c.trigger("data", e);
                            return;
                        }
                        c.trigger("data", {
                            type: "tag",
                            data: a.slice(4)
                        });
                    });
                };
                c.addParser = function a(b) {
                    var c = this;
                    var d = b.expression, e = b.customType, f = b.dataParser, g = b.segment;
                    if (typeof f !== "function") {
                        f = function a(b) {
                            return b;
                        };
                    }
                    this.customParsers.push(function(a) {
                        var b = d.exec(a);
                        if (b) {
                            c.trigger("data", {
                                type: "custom",
                                data: f(a),
                                customType: e,
                                segment: g
                            });
                            return true;
                        }
                    });
                };
                c.addTagMapper = function a(b) {
                    var c = b.expression, d = b.map;
                    var e = function a(b) {
                        if (c.test(b)) {
                            return d(b);
                        }
                        return b;
                    };
                    this.tagMappers.push(e);
                };
                return b;
            })(e);
            var o = function a(b) {
                return b.toLowerCase().replace(/-(\w)/g, function(a) {
                    return a[1].toUpperCase();
                });
            };
            var p = function a(b) {
                var c = {};
                Object.keys(b).forEach(function(a) {
                    c[o(a)] = b[a];
                });
                return c;
            };
            var q = function a(b) {
                var c = b.serverControl, d = b.targetDuration, e = b.partTargetDuration;
                if (!c) {
                    return;
                }
                var f = "#EXT-X-SERVER-CONTROL";
                var g = "holdBack";
                var h = "partHoldBack";
                var i = d && d * 3;
                var j = e && e * 2;
                if (d && !c.hasOwnProperty(g)) {
                    c[g] = i;
                    this.trigger("info", {
                        message: f + " defaulting HOLD-BACK to targetDuration * 3 (" + i + ")."
                    });
                }
                if (i && c[g] < i) {
                    this.trigger("warn", {
                        message: f + " clamping HOLD-BACK (" + c[g] + ") to targetDuration * 3 (" + i + ")"
                    });
                    c[g] = i;
                }
                if (e && !c.hasOwnProperty(h)) {
                    c[h] = e * 3;
                    this.trigger("info", {
                        message: f + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + c[h] + ")."
                    });
                }
                if (e && c[h] < j) {
                    this.trigger("warn", {
                        message: f + " clamping PART-HOLD-BACK (" + c[h] + ") to partTargetDuration * 2 (" + j + ")."
                    });
                    c[h] = j;
                }
            };
            var r = (function(a) {
                (0, d.Z)(b, a);
                function b() {
                    var b;
                    b = a.call(this) || this;
                    b.lineStream = new i();
                    b.parseStream = new n();
                    b.lineStream.pipe(b.parseStream);
                    var c = (0, g.Z)(b);
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
                    b.manifest = {
                        allowCache: true,
                        discontinuityStarts: [],
                        segments: []
                    };
                    var t = 0;
                    var u = 0;
                    b.on("end", function() {
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
                        b.manifest.preloadSegment = e;
                    });
                    b.parseStream.on("data", function(a) {
                        var b;
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
                                    key: function b() {
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
                                            var c = [
                                                "SAMPLE-AES",
                                                "SAMPLE-AES-CTR",
                                                "SAMPLE-AES-CENC", 
                                            ];
                                            if (c.indexOf(a.attributes.METHOD) === -1) {
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
                                    media: function c() {
                                        this.manifest.mediaGroups = this.manifest.mediaGroups || o;
                                        if (!(a.attributes && a.attributes.TYPE && a.attributes["GROUP-ID"] && a.attributes.NAME)) {
                                            this.trigger("warn", {
                                                message: "ignoring incomplete or missing media group"
                                            });
                                            return;
                                        }
                                        var d = this.manifest.mediaGroups[a.attributes.TYPE];
                                        d[a.attributes["GROUP-ID"]] = d[a.attributes["GROUP-ID"]] || {};
                                        b = d[a.attributes["GROUP-ID"]];
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
                                        b[a.attributes.NAME] = g;
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
                                        var c = this;
                                        l = true;
                                        var d = this.manifest.segments.length;
                                        var b = p(a.attributes);
                                        e.parts = e.parts || [];
                                        e.parts.push(b);
                                        if (b.byterange) {
                                            if (!b.byterange.hasOwnProperty("offset")) {
                                                b.byterange.offset = u;
                                            }
                                            u = b.byterange.offset + b.byterange.length;
                                        }
                                        var f = e.parts.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PART #" + f + " for segment #" + d, a.attributes, [
                                            "URI",
                                            "DURATION"
                                        ]);
                                        if (this.manifest.renditionReports) {
                                            this.manifest.renditionReports.forEach(function(a, b) {
                                                if (!a.hasOwnProperty("lastPart")) {
                                                    c.trigger("warn", {
                                                        message: "#EXT-X-RENDITION-REPORT #" + b + " lacks required attribute(s): LAST-PART"
                                                    });
                                                }
                                            });
                                        }
                                    },
                                    "server-control": function b() {
                                        var c = (this.manifest.serverControl = p(a.attributes));
                                        if (!c.hasOwnProperty("canBlockReload")) {
                                            c.canBlockReload = false;
                                            this.trigger("info", {
                                                message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
                                            });
                                        }
                                        q.call(this, this.manifest);
                                        if (c.canSkipDateranges && !c.hasOwnProperty("canSkipUntil")) {
                                            this.trigger("warn", {
                                                message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
                                            });
                                        }
                                    },
                                    "preload-hint": function b() {
                                        var c = this.manifest.segments.length;
                                        var d = p(a.attributes);
                                        var f = d.type && d.type === "PART";
                                        e.preloadHints = e.preloadHints || [];
                                        e.preloadHints.push(d);
                                        if (d.byterange) {
                                            if (!d.byterange.hasOwnProperty("offset")) {
                                                d.byterange.offset = f ? u : 0;
                                                if (f) {
                                                    u = d.byterange.offset + d.byterange.length;
                                                }
                                            }
                                        }
                                        var g = e.preloadHints.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + g + " for segment #" + c, a.attributes, [
                                            "TYPE",
                                            "URI"
                                        ]);
                                        if (!d.type) {
                                            return;
                                        }
                                        for(var h = 0; h < e.preloadHints.length - 1; h++){
                                            var i = e.preloadHints[h];
                                            if (!i.type) {
                                                continue;
                                            }
                                            if (i.type === d.type) {
                                                this.trigger("warn", {
                                                    message: "#EXT-X-PRELOAD-HINT #" + g + " for segment #" + c + " has the same TYPE " + d.type + " as preload hint #" + h
                                                });
                                            }
                                        }
                                    },
                                    "rendition-report": function b() {
                                        var c = p(a.attributes);
                                        this.manifest.renditionReports = this.manifest.renditionReports || [];
                                        this.manifest.renditionReports.push(c);
                                        var d = this.manifest.renditionReports.length - 1;
                                        var e = [
                                            "LAST-MSN",
                                            "URI", 
                                        ];
                                        if (l) {
                                            e.push("LAST-PART");
                                        }
                                        this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + d, a.attributes, e);
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
                                }[a.tagType] || m).call(c));
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
                        }[a.type].call(c));
                    });
                    return b;
                }
                var c = b.prototype;
                c.warnOnMissingAttributes_ = function a(b, c, d) {
                    var e = [];
                    d.forEach(function(a) {
                        if (!c.hasOwnProperty(a)) {
                            e.push(a);
                        }
                    });
                    if (e.length) {
                        this.trigger("warn", {
                            message: b + " lacks required attribute(s): " + e.join(", ")
                        });
                    }
                };
                c.push = function a(b) {
                    this.lineStream.push(b);
                };
                c.end = function a() {
                    this.lineStream.push("\n");
                    this.trigger("end");
                };
                c.addParser = function a(b) {
                    this.parseStream.addParser(b);
                };
                c.addTagMapper = function a(b) {
                    this.parseStream.addTagMapper(b);
                };
                return b;
            })(e);
        },
        973: function(a, b, c) {
            "use strict";
            c.d(b, {
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
            var d = c(779);
            var e = c(8908);
            var f = c.n(e);
            var g = c(6722);
            var h = c(3969);
            var i = "0.19.2";
            var j = function a(b) {
                return !!b && typeof b === "object";
            };
            var k = function a() {
                for(var b = arguments.length, c = new Array(b), d = 0; d < b; d++){
                    c[d] = arguments[d];
                }
                return c.reduce(function(b, c) {
                    if (typeof c !== "object") {
                        return b;
                    }
                    Object.keys(c).forEach(function(d) {
                        if (Array.isArray(b[d]) && Array.isArray(c[d])) {
                            b[d] = b[d].concat(c[d]);
                        } else if (j(b[d]) && j(c[d])) {
                            b[d] = a(b[d], c[d]);
                        } else {
                            b[d] = c[d];
                        }
                    });
                    return b;
                }, {});
            };
            var l = function a(b) {
                return Object.keys(b).map(function(a) {
                    return b[a];
                });
            };
            var m = function a(b, c) {
                var d = [];
                for(var e = b; e < c; e++){
                    d.push(e);
                }
                return d;
            };
            var n = function a(b) {
                return b.reduce(function(a, b) {
                    return a.concat(b);
                }, []);
            };
            var o = function a(b) {
                if (!b.length) {
                    return [];
                }
                var c = [];
                for(var d = 0; d < b.length; d++){
                    c.push(b[d]);
                }
                return c;
            };
            var p = function a(b, c) {
                return b.reduce(function(a, b, d) {
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
            var r = function a(b) {
                var c = b.baseUrl, e = c === void 0 ? "" : c, f = b.source, g = f === void 0 ? "" : f, h = b.range, i = h === void 0 ? "" : h, j = b.indexRange, k = j === void 0 ? "" : j;
                var l = {
                    uri: g,
                    resolvedUri: (0, d.Z)(e || "", g)
                };
                if (i || k) {
                    var m = i ? i : k;
                    var n = m.split("-");
                    var o = parseInt(n[0], 10);
                    var p = parseInt(n[1], 10);
                    l.byterange = {
                        length: p - o + 1,
                        offset: o
                    };
                }
                return l;
            };
            var s = function a(b) {
                var c = b.offset + b.length - 1;
                return b.offset + "-" + c;
            };
            var t = function a(b) {
                if (b && typeof b !== "number") {
                    b = parseInt(b, 10);
                }
                if (isNaN(b)) {
                    return null;
                }
                return b;
            };
            var u = {
                static: function a(b) {
                    var c = b.duration, d = b.timescale, e = d === void 0 ? 1 : d, f = b.sourceDuration, g = b.periodDuration;
                    var h = t(b.endNumber);
                    var i = c / e;
                    if (typeof h === "number") {
                        return {
                            start: 0,
                            end: h
                        };
                    }
                    if (typeof g === "number") {
                        return {
                            start: 0,
                            end: g / i
                        };
                    }
                    return {
                        start: 0,
                        end: f / i
                    };
                },
                dynamic: function a(b) {
                    var c = b.NOW, d = b.clientOffset, e = b.availabilityStartTime, f = b.timescale, g = f === void 0 ? 1 : f, h = b.duration, i = b.start, j = i === void 0 ? 0 : i, k = b.minimumUpdatePeriod, l = k === void 0 ? 0 : k, m = b.timeShiftBufferDepth, n = m === void 0 ? Infinity : m;
                    var o = t(b.endNumber);
                    var p = (c + d) / 1000;
                    var q = e + j;
                    var r = p + l;
                    var s = r - q;
                    var u = Math.ceil((s * g) / h);
                    var v = Math.floor(((p - q - n) * g) / h);
                    var w = Math.floor(((p - q) * g) / h);
                    return {
                        start: Math.max(0, v),
                        end: typeof o === "number" ? o : Math.min(u, w)
                    };
                }
            };
            var v = function a(b) {
                return function(a, c) {
                    var d = b.duration, e = b.timescale, f = e === void 0 ? 1 : e, g = b.periodIndex, h = b.startNumber, i = h === void 0 ? 1 : h;
                    return {
                        number: i + a,
                        duration: d / f,
                        timeline: g,
                        time: c * d
                    };
                };
            };
            var w = function a(b) {
                var c = b.type, d = b.duration, e = b.timescale, f = e === void 0 ? 1 : e, g = b.periodDuration, h = b.sourceDuration;
                var i = u[c](b), j = i.start, k = i.end;
                var l = m(j, k).map(v(b));
                if (c === "static") {
                    var n = l.length - 1;
                    var o = typeof g === "number" ? g : h;
                    l[n].duration = o - (d / f) * n;
                }
                return l;
            };
            var x = function a(b) {
                var c = b.baseUrl, d = b.initialization, e = d === void 0 ? {} : d, f = b.sourceDuration, g = b.indexRange, h = g === void 0 ? "" : g, i = b.duration;
                if (!c) {
                    throw new Error(q.NO_BASE_URL);
                }
                var j = r({
                    baseUrl: c,
                    source: e.sourceURL,
                    range: e.range
                });
                var k = r({
                    baseUrl: c,
                    source: c,
                    indexRange: h
                });
                k.map = j;
                if (i) {
                    var l = w(b);
                    if (l.length) {
                        k.duration = l[0].duration;
                        k.timeline = l[0].timeline;
                    }
                } else if (f) {
                    k.duration = f;
                    k.timeline = 0;
                }
                k.number = 0;
                return [
                    k
                ];
            };
            var y = function a(b, c, d) {
                var e = b.sidx.map ? b.sidx.map : null;
                var f = b.sidx.duration;
                var g = b.timeline || 0;
                var h = b.sidx.byterange;
                var i = h.offset + h.length;
                var j = c.timescale;
                var k = c.references.filter(function(a) {
                    return a.referenceType !== 1;
                });
                var l = [];
                var m = b.endList ? "static" : "dynamic";
                var n = i + c.firstOffset;
                for(var o = 0; o < k.length; o++){
                    var p = c.references[o];
                    var q = p.referencedSize;
                    var r = p.subsegmentDuration;
                    var s = n + q - 1;
                    var t = n + "-" + s;
                    var u = {
                        baseUrl: d,
                        timescale: j,
                        timeline: g,
                        periodIndex: g,
                        duration: r,
                        sourceDuration: f,
                        indexRange: t,
                        type: m
                    };
                    var v = x(u)[0];
                    if (e) {
                        v.map = e;
                    }
                    l.push(v);
                    n += q;
                }
                b.segments = l;
                return b;
            };
            var z = function a(b) {
                return (b && b.uri + "-" + s(b.byterange));
            };
            var A = function a(b) {
                var c = l(b.reduce(function(a, b) {
                    var c = b.attributes.id + (b.attributes.lang || "");
                    if (a[c]) {
                        var d;
                        if (b.segments[0]) {
                            b.segments[0].discontinuity = true;
                        }
                        (d = a[c].segments).push.apply(d, b.segments);
                        if (b.attributes.contentProtection) {
                            a[c].attributes.contentProtection = b.attributes.contentProtection;
                        }
                    } else {
                        a[c] = b;
                    }
                    return a;
                }, {}));
                return c.map(function(a) {
                    a.discontinuityStarts = p(a.segments, "discontinuity");
                    return a;
                });
            };
            var B = function a(b, c) {
                var d = z(b.sidx);
                var e = d && c[d] && c[d].sidx;
                if (e) {
                    y(b, e, b.sidx.resolvedUri);
                }
                return b;
            };
            var C = function a(b, c) {
                if (c === void 0) {
                    c = {};
                }
                if (!Object.keys(c).length) {
                    return b;
                }
                for(var d in b){
                    b[d] = B(b[d], c);
                }
                return b;
            };
            var D = function a(b, c) {
                var d;
                var e = b.attributes, f = b.segments, g = b.sidx;
                var h = {
                    attributes: ((d = {
                        NAME: e.id,
                        BANDWIDTH: e.bandwidth,
                        CODECS: e.codecs
                    }), (d["PROGRAM-ID"] = 1), d),
                    uri: "",
                    endList: e.type === "static",
                    timeline: e.periodIndex,
                    resolvedUri: "",
                    targetDuration: e.duration,
                    segments: f,
                    mediaSequence: f.length ? f[0].number : 1
                };
                if (e.contentProtection) {
                    h.contentProtection = e.contentProtection;
                }
                if (g) {
                    h.sidx = g;
                }
                if (c) {
                    h.attributes.AUDIO = "audio";
                    h.attributes.SUBTITLES = "subs";
                }
                return h;
            };
            var E = function a(b) {
                var c;
                var d = b.attributes, e = b.segments;
                if (typeof e === "undefined") {
                    e = [
                        {
                            uri: d.baseUrl,
                            timeline: d.periodIndex,
                            resolvedUri: d.baseUrl || "",
                            duration: d.sourceDuration,
                            number: 0
                        }, 
                    ];
                    d.duration = d.sourceDuration;
                }
                var f = ((c = {
                    NAME: d.id,
                    BANDWIDTH: d.bandwidth
                }), (c["PROGRAM-ID"] = 1), c);
                if (d.codecs) {
                    f.CODECS = d.codecs;
                }
                return {
                    attributes: f,
                    uri: "",
                    endList: d.type === "static",
                    timeline: d.periodIndex,
                    resolvedUri: d.baseUrl || "",
                    targetDuration: d.duration,
                    segments: e,
                    mediaSequence: e.length ? e[0].number : 1
                };
            };
            var F = function a(b, c, d) {
                if (c === void 0) {
                    c = {};
                }
                if (d === void 0) {
                    d = false;
                }
                var e;
                var f = b.reduce(function(a, b) {
                    var f = (b.attributes.role && b.attributes.role.value) || "";
                    var g = b.attributes.lang || "";
                    var h = b.attributes.label || "main";
                    if (g && !b.attributes.label) {
                        var i = f ? " (" + f + ")" : "";
                        h = "" + b.attributes.lang + i;
                    }
                    if (!a[h]) {
                        a[h] = {
                            language: g,
                            autoselect: true,
                            default: f === "main",
                            playlists: [],
                            uri: ""
                        };
                    }
                    var j = B(D(b, d), c);
                    a[h].playlists.push(j);
                    if (typeof e === "undefined" && f === "main") {
                        e = b;
                        e.default = true;
                    }
                    return a;
                }, {});
                if (!e) {
                    var g = Object.keys(f)[0];
                    f[g].default = true;
                }
                return f;
            };
            var G = function a(b, c) {
                if (c === void 0) {
                    c = {};
                }
                return b.reduce(function(a, b) {
                    var d = b.attributes.lang || "text";
                    if (!a[d]) {
                        a[d] = {
                            language: d,
                            default: false,
                            autoselect: false,
                            playlists: [],
                            uri: ""
                        };
                    }
                    a[d].playlists.push(B(E(b), c));
                    return a;
                }, {});
            };
            var H = function a(b) {
                return b.reduce(function(a, b) {
                    if (!b) {
                        return a;
                    }
                    b.forEach(function(b) {
                        var c = b.channel, d = b.language;
                        a[d] = {
                            autoselect: false,
                            default: false,
                            instreamId: c,
                            language: d
                        };
                        if (b.hasOwnProperty("aspectRatio")) {
                            a[d].aspectRatio = b.aspectRatio;
                        }
                        if (b.hasOwnProperty("easyReader")) {
                            a[d].easyReader = b.easyReader;
                        }
                        if (b.hasOwnProperty("3D")) {
                            a[d]["3D"] = b["3D"];
                        }
                    });
                    return a;
                }, {});
            };
            var I = function a(b) {
                var c;
                var d = b.attributes, e = b.segments, f = b.sidx;
                var g = {
                    attributes: ((c = {
                        NAME: d.id,
                        AUDIO: "audio",
                        SUBTITLES: "subs",
                        RESOLUTION: {
                            width: d.width,
                            height: d.height
                        },
                        CODECS: d.codecs,
                        BANDWIDTH: d.bandwidth
                    }), (c["PROGRAM-ID"] = 1), c),
                    uri: "",
                    endList: d.type === "static",
                    timeline: d.periodIndex,
                    resolvedUri: "",
                    targetDuration: d.duration,
                    segments: e,
                    mediaSequence: e.length ? e[0].number : 1
                };
                if (d.contentProtection) {
                    g.contentProtection = d.contentProtection;
                }
                if (f) {
                    g.sidx = f;
                }
                return g;
            };
            var J = function a(b) {
                var c = b.attributes;
                return (c.mimeType === "video/mp4" || c.mimeType === "video/webm" || c.contentType === "video");
            };
            var K = function a(b) {
                var c = b.attributes;
                return (c.mimeType === "audio/mp4" || c.mimeType === "audio/webm" || c.contentType === "audio");
            };
            var L = function a(b) {
                var c = b.attributes;
                return (c.mimeType === "text/vtt" || c.contentType === "text");
            };
            var M = function a(b, c, d) {
                var e;
                if (d === void 0) {
                    d = {};
                }
                if (!b.length) {
                    return {};
                }
                var f = b[0].attributes, g = f.sourceDuration, h = f.type, i = f.suggestedPresentationDelay, j = f.minimumUpdatePeriod;
                var k = A(b.filter(J)).map(I);
                var l = A(b.filter(K));
                var m = b.filter(L);
                var n = b.map(function(a) {
                    return a.attributes.captionServices;
                }).filter(Boolean);
                var o = {
                    allowCache: true,
                    discontinuityStarts: [],
                    segments: [],
                    endList: true,
                    mediaGroups: ((e = {
                        AUDIO: {},
                        VIDEO: {}
                    }), (e["CLOSED-CAPTIONS"] = {}), (e.SUBTITLES = {}), e),
                    uri: "",
                    duration: g,
                    playlists: C(k, d)
                };
                if (j >= 0) {
                    o.minimumUpdatePeriod = j * 1000;
                }
                if (c) {
                    o.locations = c;
                }
                if (h === "dynamic") {
                    o.suggestedPresentationDelay = i;
                }
                var p = o.playlists.length === 0;
                if (l.length) {
                    o.mediaGroups.AUDIO.audio = F(l, d, p);
                }
                if (m.length) {
                    o.mediaGroups.SUBTITLES.subs = G(m, d);
                }
                if (n.length) {
                    o.mediaGroups["CLOSED-CAPTIONS"].cc = H(n);
                }
                return o;
            };
            var N = function a(b, c, d) {
                var e = b.NOW, f = b.clientOffset, g = b.availabilityStartTime, h = b.timescale, i = h === void 0 ? 1 : h, j = b.start, k = j === void 0 ? 0 : j, l = b.minimumUpdatePeriod, m = l === void 0 ? 0 : l;
                var n = (e + f) / 1000;
                var o = g + k;
                var p = n + m;
                var q = p - o;
                return Math.ceil((q * i - c) / d);
            };
            var O = function a(b, c) {
                var d = b.type, e = b.minimumUpdatePeriod, f = e === void 0 ? 0 : e, g = b.media, h = g === void 0 ? "" : g, i = b.sourceDuration, j = b.timescale, k = j === void 0 ? 1 : j, l = b.startNumber, m = l === void 0 ? 1 : l, n = b.periodIndex;
                var o = [];
                var p = -1;
                for(var q = 0; q < c.length; q++){
                    var r = c[q];
                    var s = r.d;
                    var t = r.r || 0;
                    var u = r.t || 0;
                    if (p < 0) {
                        p = u;
                    }
                    if (u && u > p) {
                        p = u;
                    }
                    var v = void 0;
                    if (t < 0) {
                        var w = q + 1;
                        if (w === c.length) {
                            if (d === "dynamic" && f > 0 && h.indexOf("$Number$") > 0) {
                                v = N(b, p, s);
                            } else {
                                v = (i * k - p) / s;
                            }
                        } else {
                            v = (c[w].t - p) / s;
                        }
                    } else {
                        v = t + 1;
                    }
                    var x = m + o.length + v;
                    var y = m + o.length;
                    while(y < x){
                        o.push({
                            number: y,
                            duration: s / k,
                            time: p,
                            timeline: n
                        });
                        p += s;
                        y++;
                    }
                }
                return o;
            };
            var P = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g;
            var Q = function a(b) {
                return function(a, c, d, e) {
                    if (a === "$$") {
                        return "$";
                    }
                    if (typeof b[c] === "undefined") {
                        return a;
                    }
                    var f = "" + b[c];
                    if (c === "RepresentationID") {
                        return f;
                    }
                    if (!d) {
                        e = 1;
                    } else {
                        e = parseInt(e, 10);
                    }
                    if (f.length >= e) {
                        return f;
                    }
                    return ("" + new Array(e - f.length + 1).join("0") + f);
                };
            };
            var R = function a(b, c) {
                return b.replace(P, Q(c));
            };
            var S = function a(b, c) {
                if (!b.duration && !c) {
                    return [
                        {
                            number: b.startNumber || 1,
                            duration: b.sourceDuration,
                            time: 0,
                            timeline: b.periodIndex
                        }, 
                    ];
                }
                if (b.duration) {
                    return w(b);
                }
                return O(b, c);
            };
            var T = function a(b, c) {
                var e = {
                    RepresentationID: b.id,
                    Bandwidth: b.bandwidth || 0
                };
                var f = b.initialization, g = f === void 0 ? {
                    sourceURL: "",
                    range: ""
                } : f;
                var h = r({
                    baseUrl: b.baseUrl,
                    source: R(g.sourceURL, e),
                    range: g.range
                });
                var i = S(b, c);
                return i.map(function(a) {
                    e.Number = a.number;
                    e.Time = a.time;
                    var c = R(b.media || "", e);
                    var f = b.timescale || 1;
                    var g = b.presentationTimeOffset || 0;
                    var i = b.periodStart + (a.time - g) / f;
                    var j = {
                        uri: c,
                        timeline: a.timeline,
                        duration: a.duration,
                        resolvedUri: (0, d.Z)(b.baseUrl || "", c),
                        map: h,
                        number: a.number,
                        presentationTime: i
                    };
                    return j;
                });
            };
            var U = function a(b, c) {
                var d = b.baseUrl, e = b.initialization, f = e === void 0 ? {} : e;
                var g = r({
                    baseUrl: d,
                    source: f.sourceURL,
                    range: f.range
                });
                var h = r({
                    baseUrl: d,
                    source: c.media,
                    range: c.mediaRange
                });
                h.map = g;
                return h;
            };
            var V = function a(b, c) {
                var d = b.duration, e = b.segmentUrls, f = e === void 0 ? [] : e, g = b.periodStart;
                if ((!d && !c) || (d && c)) {
                    throw new Error(q.SEGMENT_TIME_UNSPECIFIED);
                }
                var h = f.map(function(a) {
                    return U(b, a);
                });
                var i;
                if (d) {
                    i = w(b);
                }
                if (c) {
                    i = O(b, c);
                }
                var j = i.map(function(a, c) {
                    if (h[c]) {
                        var d = h[c];
                        var e = b.timescale || 1;
                        var f = b.presentationTimeOffset || 0;
                        d.timeline = a.timeline;
                        d.duration = a.duration;
                        d.number = a.number;
                        d.presentationTime = g + (a.time - f) / e;
                        return d;
                    }
                }).filter(function(a) {
                    return a;
                });
                return j;
            };
            var W = function a(b) {
                var c = b.attributes, d = b.segmentInfo;
                var e;
                var f;
                if (d.template) {
                    f = T;
                    e = k(c, d.template);
                } else if (d.base) {
                    f = x;
                    e = k(c, d.base);
                } else if (d.list) {
                    f = V;
                    e = k(c, d.list);
                }
                var g = {
                    attributes: c
                };
                if (!f) {
                    return g;
                }
                var h = f(e, d.segmentTimeline);
                if (e.duration) {
                    var i = e, j = i.duration, l = i.timescale, m = l === void 0 ? 1 : l;
                    e.duration = j / m;
                } else if (h.length) {
                    e.duration = h.reduce(function(a, b) {
                        return Math.max(a, Math.ceil(b.duration));
                    }, 0);
                } else {
                    e.duration = 0;
                }
                g.attributes = e;
                g.segments = h;
                if (d.base && e.indexRange) {
                    g.sidx = h[0];
                    g.segments = [];
                }
                return g;
            };
            var X = function a(b) {
                return b.map(W);
            };
            var Y = function a(b, c) {
                return o(b.childNodes).filter(function(a) {
                    var b = a.tagName;
                    return b === c;
                });
            };
            var Z = function a(b) {
                return b.textContent.trim();
            };
            var $ = function a(b) {
                var c = 365 * 24 * 60 * 60;
                var d = 30 * 24 * 60 * 60;
                var e = 24 * 60 * 60;
                var f = 60 * 60;
                var g = 60;
                var h = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/;
                var i = h.exec(b);
                if (!i) {
                    return 0;
                }
                var j = i.slice(1), k = j[0], l = j[1], m = j[2], n = j[3], o = j[4], p = j[5];
                return (parseFloat(k || 0) * c + parseFloat(l || 0) * d + parseFloat(m || 0) * e + parseFloat(n || 0) * f + parseFloat(o || 0) * g + parseFloat(p || 0));
            };
            var _ = function a(b) {
                var c = /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/;
                if (c.test(b)) {
                    b += "Z";
                }
                return Date.parse(b);
            };
            var aa = {
                mediaPresentationDuration: function a(b) {
                    return $(b);
                },
                availabilityStartTime: function a(b) {
                    return _(b) / 1000;
                },
                minimumUpdatePeriod: function a(b) {
                    return $(b);
                },
                suggestedPresentationDelay: function a(b) {
                    return $(b);
                },
                type: function a(b) {
                    return b;
                },
                timeShiftBufferDepth: function a(b) {
                    return $(b);
                },
                start: function a(b) {
                    return $(b);
                },
                width: function a(b) {
                    return parseInt(b, 10);
                },
                height: function a(b) {
                    return parseInt(b, 10);
                },
                bandwidth: function a(b) {
                    return parseInt(b, 10);
                },
                startNumber: function a(b) {
                    return parseInt(b, 10);
                },
                timescale: function a(b) {
                    return parseInt(b, 10);
                },
                presentationTimeOffset: function a(b) {
                    return parseInt(b, 10);
                },
                duration: function a(b) {
                    var c = parseInt(b, 10);
                    if (isNaN(c)) {
                        return $(b);
                    }
                    return c;
                },
                d: function a(b) {
                    return parseInt(b, 10);
                },
                t: function a(b) {
                    return parseInt(b, 10);
                },
                r: function a(b) {
                    return parseInt(b, 10);
                },
                DEFAULT: function a(b) {
                    return b;
                }
            };
            var ab = function a(b) {
                if (!(b && b.attributes)) {
                    return {};
                }
                return o(b.attributes).reduce(function(a, b) {
                    var c = aa[b.name] || aa.DEFAULT;
                    a[b.name] = c(b.value);
                    return a;
                }, {});
            };
            var ac = {
                "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
                "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
                "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
                "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
            };
            var ad = function a(b, c) {
                if (!c.length) {
                    return b;
                }
                return n(b.map(function(a) {
                    return c.map(function(b) {
                        return (0, d.Z)(a, Z(b));
                    });
                }));
            };
            var ae = function a(b) {
                var c = Y(b, "SegmentTemplate")[0];
                var d = Y(b, "SegmentList")[0];
                var e = d && Y(d, "SegmentURL").map(function(a) {
                    return k({
                        tag: "SegmentURL"
                    }, ab(a));
                });
                var f = Y(b, "SegmentBase")[0];
                var g = d || c;
                var h = g && Y(g, "SegmentTimeline")[0];
                var i = d || f || c;
                var j = i && Y(i, "Initialization")[0];
                var l = c && ab(c);
                if (l && j) {
                    l.initialization = j && ab(j);
                } else if (l && l.initialization) {
                    l.initialization = {
                        sourceURL: l.initialization
                    };
                }
                var m = {
                    template: l,
                    segmentTimeline: h && Y(h, "S").map(function(a) {
                        return ab(a);
                    }),
                    list: d && k(ab(d), {
                        segmentUrls: e,
                        initialization: ab(j)
                    }),
                    base: f && k(ab(f), {
                        initialization: ab(j)
                    })
                };
                Object.keys(m).forEach(function(a) {
                    if (!m[a]) {
                        delete m[a];
                    }
                });
                return m;
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
            var ag = function a(b) {
                return b.reduce(function(a, b) {
                    var c = ab(b);
                    var d = ac[c.schemeIdUri];
                    if (d) {
                        a[d] = {
                            attributes: c
                        };
                        var e = Y(b, "cenc:pssh")[0];
                        if (e) {
                            var f = Z(e);
                            var h = f && (0, g.Z)(f);
                            a[d].pssh = h;
                        }
                    }
                    return a;
                }, {});
            };
            var ah = function a(b) {
                if (b.schemeIdUri === "urn:scte:dash:cc:cea-608:2015") {
                    var c = typeof b.value !== "string" ? [] : b.value.split(";");
                    return c.map(function(a) {
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
                } else if (b.schemeIdUri === "urn:scte:dash:cc:cea-708:2015") {
                    var d = typeof b.value !== "string" ? [] : b.value.split(";");
                    return d.map(function(a) {
                        var b = {
                            channel: undefined,
                            language: undefined,
                            aspectRatio: 1,
                            easyReader: 0,
                            "3D": 0
                        };
                        if (/=/.test(a)) {
                            var c = a.split("="), d = c[0], e = c[1], f = e === void 0 ? "" : e;
                            b.channel = d;
                            b.language = a;
                            f.split(",").forEach(function(a) {
                                var c = a.split(":"), d = c[0], e = c[1];
                                if (d === "lang") {
                                    b.language = e;
                                } else if (d === "er") {
                                    b.easyReader = Number(e);
                                } else if (d === "war") {
                                    b.aspectRatio = Number(e);
                                } else if (d === "3D") {
                                    b["3D"] = Number(e);
                                }
                            });
                        } else {
                            b.language = a;
                        }
                        if (b.channel) {
                            b.channel = "SERVICE" + b.channel;
                        }
                        return b;
                    });
                }
            };
            var ai = function a(b, c, d) {
                return function(a) {
                    var e = ab(a);
                    var f = ad(c, Y(a, "BaseURL"));
                    var g = Y(a, "Role")[0];
                    var h = {
                        role: ab(g)
                    };
                    var i = k(b, e, h);
                    var j = Y(a, "Accessibility")[0];
                    var l = ah(ab(j));
                    if (l) {
                        i = k(i, {
                            captionServices: l
                        });
                    }
                    var m = Y(a, "Label")[0];
                    if (m && m.childNodes.length) {
                        var o = m.childNodes[0].nodeValue.trim();
                        i = k(i, {
                            label: o
                        });
                    }
                    var p = ag(Y(a, "ContentProtection"));
                    if (Object.keys(p).length) {
                        i = k(i, {
                            contentProtection: p
                        });
                    }
                    var q = ae(a);
                    var r = Y(a, "Representation");
                    var s = k(d, q);
                    return n(r.map(af(i, f, s)));
                };
            };
            var aj = function a(b, c) {
                return function(a, d) {
                    var e = ad(c, Y(a.node, "BaseURL"));
                    var g = parseInt(a.attributes.id, 10);
                    var h = f().isNaN(g) ? d : g;
                    var i = k(b, {
                        periodIndex: h,
                        periodStart: a.attributes.start
                    });
                    if (typeof a.attributes.duration === "number") {
                        i.periodDuration = a.attributes.duration;
                    }
                    var j = Y(a.node, "AdaptationSet");
                    var l = ae(a.node);
                    return n(j.map(ai(i, e, l)));
                };
            };
            var ak = function a(b) {
                var c = b.attributes, d = b.priorPeriodAttributes, e = b.mpdType;
                if (typeof c.start === "number") {
                    return c.start;
                }
                if (d && typeof d.start === "number" && typeof d.duration === "number") {
                    return (d.start + d.duration);
                }
                if (!d && e === "static") {
                    return 0;
                }
                return null;
            };
            var al = function a(b, c) {
                if (c === void 0) {
                    c = {};
                }
                var d = c, e = d.manifestUri, f = e === void 0 ? "" : e, g = d.NOW, h = g === void 0 ? Date.now() : g, i = d.clientOffset, j = i === void 0 ? 0 : i;
                var k = Y(b, "Period");
                if (!k.length) {
                    throw new Error(q.INVALID_NUMBER_OF_PERIOD);
                }
                var l = Y(b, "Location");
                var m = ab(b);
                var o = ad([
                    f
                ], Y(b, "BaseURL"));
                m.type = m.type || "static";
                m.sourceDuration = m.mediaPresentationDuration || 0;
                m.NOW = h;
                m.clientOffset = j;
                if (l.length) {
                    m.locations = l.map(Z);
                }
                var p = [];
                k.forEach(function(a, b) {
                    var c = ab(a);
                    var d = p[b - 1];
                    c.start = ak({
                        attributes: c,
                        priorPeriodAttributes: d ? d.attributes : null,
                        mpdType: m.type
                    });
                    p.push({
                        node: a,
                        attributes: c
                    });
                });
                return {
                    locations: m.locations,
                    representationInfo: n(p.map(aj(m, o)))
                };
            };
            var am = function a(b) {
                if (b === "") {
                    throw new Error(q.DASH_EMPTY_MANIFEST);
                }
                var c = new h.DOMParser();
                var d;
                var e;
                try {
                    d = c.parseFromString(b, "application/xml");
                    e = d && d.documentElement.tagName === "MPD" ? d.documentElement : null;
                } catch (f) {}
                if (!e || (e && e.getElementsByTagName("parsererror").length > 0)) {
                    throw new Error(q.DASH_INVALID_XML);
                }
                return e;
            };
            var an = function a(b) {
                var c = Y(b, "UTCTiming")[0];
                if (!c) {
                    return null;
                }
                var d = ab(c);
                switch(d.schemeIdUri){
                    case "urn:mpeg:dash:utc:http-head:2014":
                    case "urn:mpeg:dash:utc:http-head:2012":
                        d.method = "HEAD";
                        break;
                    case "urn:mpeg:dash:utc:http-xsdate:2014":
                    case "urn:mpeg:dash:utc:http-iso:2014":
                    case "urn:mpeg:dash:utc:http-xsdate:2012":
                    case "urn:mpeg:dash:utc:http-iso:2012":
                        d.method = "GET";
                        break;
                    case "urn:mpeg:dash:utc:direct:2014":
                    case "urn:mpeg:dash:utc:direct:2012":
                        d.method = "DIRECT";
                        d.value = Date.parse(d.value);
                        break;
                    case "urn:mpeg:dash:utc:http-ntp:2014":
                    case "urn:mpeg:dash:utc:ntp:2014":
                    case "urn:mpeg:dash:utc:sntp:2014":
                    default:
                        throw new Error(q.UNSUPPORTED_UTC_TIMING_SCHEME);
                }
                return d;
            };
            var ao = null && i;
            var ap = function a(b, c) {
                if (c === void 0) {
                    c = {};
                }
                var d = al(am(b), c);
                var e = X(d.representationInfo);
                return M(e, d.locations, c.sidxMapping);
            };
            var aq = function a(b) {
                return an(am(b));
            };
        },
        4221: function(a) {
            var b = Math.pow(2, 32);
            var c = function(a) {
                var c = new DataView(a.buffer, a.byteOffset, a.byteLength), d = {
                    version: a[0],
                    flags: new Uint8Array(a.subarray(1, 4)),
                    references: [],
                    referenceId: c.getUint32(4),
                    timescale: c.getUint32(8)
                }, e = 12;
                if (d.version === 0) {
                    d.earliestPresentationTime = c.getUint32(e);
                    d.firstOffset = c.getUint32(e + 4);
                    e += 8;
                } else {
                    d.earliestPresentationTime = c.getUint32(e) * b + c.getUint32(e + 4);
                    d.firstOffset = c.getUint32(e + 8) * b + c.getUint32(e + 12);
                    e += 16;
                }
                e += 2;
                var f = c.getUint16(e);
                e += 2;
                for(; f > 0; e += 12, f--){
                    d.references.push({
                        referenceType: (a[e] & 0x80) >>> 7,
                        referencedSize: c.getUint32(e) & 0x7fffffff,
                        subsegmentDuration: c.getUint32(e + 4),
                        startsWithSap: !!(a[e + 8] & 0x80),
                        sapType: (a[e + 8] & 0x70) >>> 4,
                        sapDeltaTime: c.getUint32(e + 8) & 0x0fffffff
                    });
                }
                return d;
            };
            a.exports = c;
        },
        1489: function(a) {
            var b = 90000, c, d, e, f, g, h, i;
            c = function(a) {
                return a * b;
            };
            d = function(a, b) {
                return a * b;
            };
            e = function(a) {
                return a / b;
            };
            f = function(a, b) {
                return a / b;
            };
            g = function(a, b) {
                return c(f(a, b));
            };
            h = function(a, b) {
                return d(e(a), b);
            };
            i = function(a, b, c) {
                return e(c ? a : a - b);
            };
            a.exports = {
                ONE_SECOND_IN_TS: b,
                secondsToVideoTs: c,
                secondsToAudioTs: d,
                videoTsToSeconds: e,
                audioTsToSeconds: f,
                audioTsToVideoTs: g,
                videoTsToAudioTs: h,
                metadataTsToSeconds: i
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
        4816: function(a, b, c) {
            "use strict";
            c.r(b);
            c.d(b, {
                default: function() {
                    return l;
                }
            });
            var d = c(5893);
            var e = c(7294);
            var f = c(214);
            var g = c.n(f);
            var h = c(5215);
            var i = c(3512);
            var j = function(a) {
                var b = e.useRef(null);
                var c = e.useRef(null);
                var f = a.options, g = a.onReady;
                e.useEffect(function() {
                    if (!c.current) {
                        var a = b.current;
                        if (!a) return;
                        var d = (c.current = (0, h.Z)(a, f, function() {
                            console.log("player is ready");
                            g && g(d);
                        }));
                    } else {}
                }, [
                    g,
                    f,
                    b
                ]);
                e.useEffect(function() {
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
                return (0, d.jsx)("div", {
                    "data-vjs-player": true,
                    children: (0, d.jsx)("video", {
                        ref: b,
                        className: "video-js vjs-big-play-centered"
                    })
                });
            };
            var k = j;
            function l() {
                var a = (0, e.useRef)(null);
                var b = {
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
                var c = function(b) {
                    a.current = b;
                    b.on("waiting", function() {
                        console.log("player is waiting");
                    });
                    b.on("dispose", function() {
                        console.log("player will dispose");
                    });
                };
                return (0, d.jsx)("div", {
                    className: g().container,
                    children: (0, d.jsx)("main", {
                        className: g().main,
                        children: (0, d.jsx)(k, {
                            options: b,
                            onReady: c
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
            function b(a, b) {
                var c;
                var d = null;
                try {
                    c = JSON.parse(a, b);
                } catch (e) {
                    d = e;
                }
                return [
                    d,
                    c
                ];
            }
        },
        9945: function(a) {
            (function(b) {
                var c = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#[^]*)?$/;
                var d = /^([^\/?#]*)([^]*)$/;
                var e = /(?:\/|^)\.(?=\/)/g;
                var f = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;
                var g = {
                    buildAbsoluteURL: function(a, b, c) {
                        c = c || {};
                        a = a.trim();
                        b = b.trim();
                        if (!b) {
                            if (!c.alwaysNormalize) {
                                return a;
                            }
                            var e = g.parseURL(a);
                            if (!e) {
                                throw new Error("Error trying to parse base URL.");
                            }
                            e.path = g.normalizePath(e.path);
                            return g.buildURLFromParts(e);
                        }
                        var f = g.parseURL(b);
                        if (!f) {
                            throw new Error("Error trying to parse relative URL.");
                        }
                        if (f.scheme) {
                            if (!c.alwaysNormalize) {
                                return b;
                            }
                            f.path = g.normalizePath(f.path);
                            return g.buildURLFromParts(f);
                        }
                        var h = g.parseURL(a);
                        if (!h) {
                            throw new Error("Error trying to parse base URL.");
                        }
                        if (!h.netLoc && h.path && h.path[0] !== "/") {
                            var i = d.exec(h.path);
                            h.netLoc = i[1];
                            h.path = i[2];
                        }
                        if (h.netLoc && !h.path) {
                            h.path = "/";
                        }
                        var j = {
                            scheme: h.scheme,
                            netLoc: f.netLoc,
                            path: null,
                            params: f.params,
                            query: f.query,
                            fragment: f.fragment
                        };
                        if (!f.netLoc) {
                            j.netLoc = h.netLoc;
                            if (f.path[0] !== "/") {
                                if (!f.path) {
                                    j.path = h.path;
                                    if (!f.params) {
                                        j.params = h.params;
                                        if (!f.query) {
                                            j.query = h.query;
                                        }
                                    }
                                } else {
                                    var k = h.path;
                                    var l = k.substring(0, k.lastIndexOf("/") + 1) + f.path;
                                    j.path = g.normalizePath(l);
                                }
                            }
                        }
                        if (j.path === null) {
                            j.path = c.alwaysNormalize ? g.normalizePath(f.path) : f.path;
                        }
                        return g.buildURLFromParts(j);
                    },
                    parseURL: function(a) {
                        var b = c.exec(a);
                        if (!b) {
                            return null;
                        }
                        return {
                            scheme: b[1] || "",
                            netLoc: b[2] || "",
                            path: b[3] || "",
                            params: b[4] || "",
                            query: b[5] || "",
                            fragment: b[6] || ""
                        };
                    },
                    normalizePath: function(a) {
                        a = a.split("").reverse().join("").replace(e, "");
                        while(a.length !== (a = a.replace(f, "")).length){}
                        return a.split("").reverse().join("");
                    },
                    buildURLFromParts: function(a) {
                        return (a.scheme + a.netLoc + a.path + a.params + a.query + a.fragment);
                    }
                };
                if (true) a.exports = g;
                else {}
            })(this);
        },
        3407: function(a, b, c) {
            var d = c(8908);
            var e = (a.exports = {
                WebVTT: c(3706),
                VTTCue: c(2230),
                VTTRegion: c(3710)
            });
            d.vttjs = e;
            d.WebVTT = e.WebVTT;
            var f = e.VTTCue;
            var g = e.VTTRegion;
            var h = d.VTTCue;
            var i = d.VTTRegion;
            e.shim = function() {
                d.VTTCue = f;
                d.VTTRegion = g;
            };
            e.restore = function() {
                d.VTTCue = h;
                d.VTTRegion = i;
            };
            if (!d.VTTCue) {
                e.shim();
            }
        },
        3706: function(a, b, c) {
            var d = c(9144);
            var e = Object.create || (function() {
                function a() {}
                return function(b) {
                    if (arguments.length !== 1) {
                        throw new Error("Object.create shim only accepts one parameter.");
                    }
                    a.prototype = b;
                    return new a();
                };
            })();
            function f(a, b) {
                this.name = "ParsingError";
                this.code = a.code;
                this.message = b || a.message;
            }
            f.prototype = e(Error.prototype);
            f.prototype.constructor = f;
            f.Errors = {
                BadSignature: {
                    code: 0,
                    message: "Malformed WebVTT signature."
                },
                BadTimeStamp: {
                    code: 1,
                    message: "Malformed time stamp."
                }
            };
            function g(a) {
                function b(a, b, c, d) {
                    return ((a | 0) * 3600 + (b | 0) * 60 + (c | 0) + (d | 0) / 1000);
                }
                var c = a.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
                if (!c) {
                    return null;
                }
                if (c[3]) {
                    return b(c[1], c[2], c[3].replace(":", ""), c[4]);
                } else if (c[1] > 59) {
                    return b(c[1], c[2], 0, c[4]);
                } else {
                    return b(0, c[1], c[2], c[4]);
                }
            }
            function h() {
                this.values = e(null);
            }
            h.prototype = {
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
                alt: function(a, b, c) {
                    for(var d = 0; d < c.length; ++d){
                        if (b === c[d]) {
                            this.set(a, b);
                            break;
                        }
                    }
                },
                integer: function(a, b) {
                    if (/^-?\d+$/.test(b)) {
                        this.set(a, parseInt(b, 10));
                    }
                },
                percent: function(a, b) {
                    var c;
                    if ((c = b.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
                        b = parseFloat(b);
                        if (b >= 0 && b <= 100) {
                            this.set(a, b);
                            return true;
                        }
                    }
                    return false;
                }
            };
            function i(a, b, c, d) {
                var e = d ? a.split(d) : [
                    a
                ];
                for(var f in e){
                    if (typeof e[f] !== "string") {
                        continue;
                    }
                    var g = e[f].split(c);
                    if (g.length !== 2) {
                        continue;
                    }
                    var h = g[0];
                    var i = g[1];
                    b(h, i);
                }
            }
            function j(a, b, c) {
                var d = a;
                function e() {
                    var b = g(a);
                    if (b === null) {
                        throw new f(f.Errors.BadTimeStamp, "Malformed timestamp: " + d);
                    }
                    a = a.replace(/^[^\sa-zA-Z-]+/, "");
                    return b;
                }
                function j(a, b) {
                    var d = new h();
                    i(a, function(a, b) {
                        switch(a){
                            case "region":
                                for(var e = c.length - 1; e >= 0; e--){
                                    if (c[e].id === b) {
                                        d.set(a, c[e].region);
                                        break;
                                    }
                                }
                                break;
                            case "vertical":
                                d.alt(a, b, [
                                    "rl",
                                    "lr"
                                ]);
                                break;
                            case "line":
                                var f = b.split(","), g = f[0];
                                d.integer(a, g);
                                d.percent(a, g) ? d.set("snapToLines", false) : null;
                                d.alt(a, g, [
                                    "auto"
                                ]);
                                if (f.length === 2) {
                                    d.alt("lineAlign", f[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "position":
                                f = b.split(",");
                                d.percent(a, f[0]);
                                if (f.length === 2) {
                                    d.alt("positionAlign", f[1], [
                                        "start",
                                        "center",
                                        "end", 
                                    ]);
                                }
                                break;
                            case "size":
                                d.percent(a, b);
                                break;
                            case "align":
                                d.alt(a, b, [
                                    "start",
                                    "center",
                                    "end",
                                    "left",
                                    "right", 
                                ]);
                                break;
                        }
                    }, /:/, /\s/);
                    b.region = d.get("region", null);
                    b.vertical = d.get("vertical", "");
                    try {
                        b.line = d.get("line", "auto");
                    } catch (e) {}
                    b.lineAlign = d.get("lineAlign", "start");
                    b.snapToLines = d.get("snapToLines", true);
                    b.size = d.get("size", 100);
                    try {
                        b.align = d.get("align", "center");
                    } catch (f) {
                        b.align = d.get("align", "middle");
                    }
                    try {
                        b.position = d.get("position", "auto");
                    } catch (g) {
                        b.position = d.get("position", {
                            start: 0,
                            left: 0,
                            center: 50,
                            middle: 50,
                            end: 100,
                            right: 100
                        }, b.align);
                    }
                    b.positionAlign = d.get("positionAlign", {
                        start: "start",
                        left: "start",
                        center: "center",
                        middle: "center",
                        end: "end",
                        right: "end"
                    }, b.align);
                }
                function k() {
                    a = a.replace(/^\s+/, "");
                }
                k();
                b.startTime = e();
                k();
                if (a.substr(0, 3) !== "-->") {
                    throw new f(f.Errors.BadTimeStamp, "Malformed time stamp (time stamps must be separated by '-->'): " + d);
                }
                a = a.substr(3);
                k();
                b.endTime = e();
                k();
                j(a, b);
            }
            var k = d.createElement && d.createElement("textarea");
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
            var m = {
                white: "rgba(255,255,255,1)",
                lime: "rgba(0,255,0,1)",
                cyan: "rgba(0,255,255,1)",
                red: "rgba(255,0,0,1)",
                yellow: "rgba(255,255,0,1)",
                magenta: "rgba(255,0,255,1)",
                blue: "rgba(0,0,255,1)",
                black: "rgba(0,0,0,1)"
            };
            var n = {
                v: "title",
                lang: "lang"
            };
            var o = {
                rt: "ruby"
            };
            function p(a, b) {
                function c() {
                    if (!b) {
                        return null;
                    }
                    function a(a) {
                        b = b.substr(a.length);
                        return a;
                    }
                    var c = b.match(/^([^<]*)(<[^>]*>?)?/);
                    return a(c[1] ? c[1] : c[2]);
                }
                function d(a) {
                    k.innerHTML = a;
                    a = k.textContent;
                    k.textContent = "";
                    return a;
                }
                function e(a, b) {
                    return (!o[b.localName] || o[b.localName] === a.localName);
                }
                function f(b, c) {
                    var d = l[b];
                    if (!d) {
                        return null;
                    }
                    var e = a.document.createElement(d);
                    var f = n[b];
                    if (f && c) {
                        e[f] = c.trim();
                    }
                    return e;
                }
                var h = a.document.createElement("div"), i = h, j, p = [];
                while((j = c()) !== null){
                    if (j[0] === "<") {
                        if (j[1] === "/") {
                            if (p.length && p[p.length - 1] === j.substr(2).replace(">", "")) {
                                p.pop();
                                i = i.parentNode;
                            }
                            continue;
                        }
                        var q = g(j.substr(1, j.length - 2));
                        var r;
                        if (q) {
                            r = a.document.createProcessingInstruction("timestamp", q);
                            i.appendChild(r);
                            continue;
                        }
                        var s = j.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
                        if (!s) {
                            continue;
                        }
                        r = f(s[1], s[3]);
                        if (!r) {
                            continue;
                        }
                        if (!e(i, r)) {
                            continue;
                        }
                        if (s[2]) {
                            var t = s[2].split(".");
                            t.forEach(function(a) {
                                var b = /^bg_/.test(a);
                                var c = b ? a.slice(3) : a;
                                if (m.hasOwnProperty(c)) {
                                    var d = b ? "background-color" : "color";
                                    var e = m[c];
                                    r.style[d] = e;
                                }
                            });
                            r.className = t.join(" ");
                        }
                        p.push(s[1]);
                        i.appendChild(r);
                        i = r;
                        continue;
                    }
                    i.appendChild(a.document.createTextNode(d(j)));
                }
                return h;
            }
            var q = [
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
            function r(a) {
                for(var b = 0; b < q.length; b++){
                    var c = q[b];
                    if (a >= c[0] && a <= c[1]) {
                        return true;
                    }
                }
                return false;
            }
            function s(a) {
                var b = [], c = "", d;
                if (!a || !a.childNodes) {
                    return "ltr";
                }
                function e(a, b) {
                    for(var c = b.childNodes.length - 1; c >= 0; c--){
                        a.push(b.childNodes[c]);
                    }
                }
                function f(a) {
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
                        return f(a);
                    }
                    if (b.childNodes) {
                        e(a, b);
                        return f(a);
                    }
                }
                e(b, a);
                while((c = f(b))){
                    for(var g = 0; g < c.length; g++){
                        d = c.charCodeAt(g);
                        if (r(d)) {
                            return "rtl";
                        }
                    }
                }
                return "ltr";
            }
            function t(a) {
                if (typeof a.line === "number" && (a.snapToLines || (a.line >= 0 && a.line <= 100))) {
                    return a.line;
                }
                if (!a.track || !a.track.textTrackList || !a.track.textTrackList.mediaElement) {
                    return -1;
                }
                var b = a.track, c = b.textTrackList, d = 0;
                for(var e = 0; e < c.length && c[e] !== b; e++){
                    if (c[e].mode === "showing") {
                        d++;
                    }
                }
                return ++d * -1;
            }
            function u() {}
            u.prototype.applyStyles = function(a, b) {
                b = b || this.div;
                for(var c in a){
                    if (a.hasOwnProperty(c)) {
                        b.style[c] = a[c];
                    }
                }
            };
            u.prototype.formatStyle = function(a, b) {
                return a === 0 ? 0 : a + b;
            };
            function v(a, b, c) {
                u.call(this);
                this.cue = b;
                this.cueDiv = p(a, b.text);
                var d = {
                    color: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    position: "relative",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "inline",
                    writingMode: b.vertical === "" ? "horizontal-tb" : b.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext"
                };
                this.applyStyles(d, this.cueDiv);
                this.div = a.document.createElement("div");
                d = {
                    direction: s(this.cueDiv),
                    writingMode: b.vertical === "" ? "horizontal-tb" : b.vertical === "lr" ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext",
                    textAlign: b.align === "middle" ? "center" : b.align,
                    font: c.font,
                    whiteSpace: "pre-line",
                    position: "absolute"
                };
                this.applyStyles(d);
                this.div.appendChild(this.cueDiv);
                var e = 0;
                switch(b.positionAlign){
                    case "start":
                        e = b.position;
                        break;
                    case "center":
                        e = b.position - b.size / 2;
                        break;
                    case "end":
                        e = b.position - b.size;
                        break;
                }
                if (b.vertical === "") {
                    this.applyStyles({
                        left: this.formatStyle(e, "%"),
                        width: this.formatStyle(b.size, "%")
                    });
                } else {
                    this.applyStyles({
                        top: this.formatStyle(e, "%"),
                        height: this.formatStyle(b.size, "%")
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
            v.prototype = e(u.prototype);
            v.prototype.constructor = v;
            function w(a) {
                var b, c, d, e;
                if (a.div) {
                    c = a.div.offsetHeight;
                    d = a.div.offsetWidth;
                    e = a.div.offsetTop;
                    var f = (f = a.div.childNodes) && (f = f[0]) && f.getClientRects && f.getClientRects();
                    a = a.div.getBoundingClientRect();
                    b = f ? Math.max((f[0] && f[0].height) || 0, a.height / f.length) : 0;
                }
                this.left = a.left;
                this.right = a.right;
                this.top = a.top || e;
                this.height = a.height || c;
                this.bottom = a.bottom || e + (a.height || c);
                this.width = a.width || d;
                this.lineHeight = b !== undefined ? b : a.lineHeight;
            }
            w.prototype.move = function(a, b) {
                b = b !== undefined ? b : this.lineHeight;
                switch(a){
                    case "+x":
                        this.left += b;
                        this.right += b;
                        break;
                    case "-x":
                        this.left -= b;
                        this.right -= b;
                        break;
                    case "+y":
                        this.top += b;
                        this.bottom += b;
                        break;
                    case "-y":
                        this.top -= b;
                        this.bottom -= b;
                        break;
                }
            };
            w.prototype.overlaps = function(a) {
                return (this.left < a.right && this.right > a.left && this.top < a.bottom && this.bottom > a.top);
            };
            w.prototype.overlapsAny = function(a) {
                for(var b = 0; b < a.length; b++){
                    if (this.overlaps(a[b])) {
                        return true;
                    }
                }
                return false;
            };
            w.prototype.within = function(a) {
                return (this.top >= a.top && this.bottom <= a.bottom && this.left >= a.left && this.right <= a.right);
            };
            w.prototype.overlapsOppositeAxis = function(a, b) {
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
            w.prototype.intersectPercentage = function(a) {
                var b = Math.max(0, Math.min(this.right, a.right) - Math.max(this.left, a.left)), c = Math.max(0, Math.min(this.bottom, a.bottom) - Math.max(this.top, a.top)), d = b * c;
                return d / (this.height * this.width);
            };
            w.prototype.toCSSCompatValues = function(a) {
                return {
                    top: this.top - a.top,
                    bottom: a.bottom - this.bottom,
                    left: this.left - a.left,
                    right: a.right - this.right,
                    height: this.height,
                    width: this.width
                };
            };
            w.getSimpleBoxPosition = function(a) {
                var b = a.div ? a.div.offsetHeight : a.tagName ? a.offsetHeight : 0;
                var c = a.div ? a.div.offsetWidth : a.tagName ? a.offsetWidth : 0;
                var d = a.div ? a.div.offsetTop : a.tagName ? a.offsetTop : 0;
                a = a.div ? a.div.getBoundingClientRect() : a.tagName ? a.getBoundingClientRect() : a;
                var e = {
                    left: a.left,
                    right: a.right,
                    top: a.top || d,
                    height: a.height || b,
                    bottom: a.bottom || d + (a.height || b),
                    width: a.width || c
                };
                return e;
            };
            function x(a, b, c, d) {
                function e(a, b) {
                    var e, f = new w(a), g = 1;
                    for(var h = 0; h < b.length; h++){
                        while(a.overlapsOppositeAxis(c, b[h]) || (a.within(c) && a.overlapsAny(d))){
                            a.move(b[h]);
                        }
                        if (a.within(c)) {
                            return a;
                        }
                        var i = a.intersectPercentage(c);
                        if (g > i) {
                            e = new w(a);
                            g = i;
                        }
                        a = new w(f);
                    }
                    return e || f;
                }
                var f = new w(b), g = b.cue, h = t(g), i = [];
                if (g.snapToLines) {
                    var j;
                    switch(g.vertical){
                        case "":
                            i = [
                                "+y",
                                "-y"
                            ];
                            j = "height";
                            break;
                        case "rl":
                            i = [
                                "+x",
                                "-x"
                            ];
                            j = "width";
                            break;
                        case "lr":
                            i = [
                                "-x",
                                "+x"
                            ];
                            j = "width";
                            break;
                    }
                    var k = f.lineHeight, l = k * Math.round(h), m = c[j] + k, n = i[0];
                    if (Math.abs(l) > m) {
                        l = l < 0 ? -1 : 1;
                        l *= Math.ceil(m / k) * k;
                    }
                    if (h < 0) {
                        l += g.vertical === "" ? c.height : c.width;
                        i = i.reverse();
                    }
                    f.move(n, l);
                } else {
                    var o = (f.lineHeight / c.height) * 100;
                    switch(g.lineAlign){
                        case "center":
                            h -= o / 2;
                            break;
                        case "end":
                            h -= o;
                            break;
                    }
                    switch(g.vertical){
                        case "":
                            b.applyStyles({
                                top: b.formatStyle(h, "%")
                            });
                            break;
                        case "rl":
                            b.applyStyles({
                                left: b.formatStyle(h, "%")
                            });
                            break;
                        case "lr":
                            b.applyStyles({
                                right: b.formatStyle(h, "%")
                            });
                            break;
                    }
                    i = [
                        "+y",
                        "-x",
                        "+x",
                        "-y"
                    ];
                    f = new w(b);
                }
                var p = e(f, i);
                b.move(p.toCSSCompatValues(c));
            }
            function y() {}
            y.StringDecoder = function() {
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
            y.convertCueToDOMTree = function(a, b) {
                if (!a || !b) {
                    return null;
                }
                return p(a, b);
            };
            var z = 0.05;
            var A = "sans-serif";
            var B = "1.5%";
            y.processCues = function(a, b, c) {
                if (!a || !b || !c) {
                    return null;
                }
                while(c.firstChild){
                    c.removeChild(c.firstChild);
                }
                var d = a.document.createElement("div");
                d.style.position = "absolute";
                d.style.left = "0";
                d.style.right = "0";
                d.style.top = "0";
                d.style.bottom = "0";
                d.style.margin = B;
                c.appendChild(d);
                function e(a) {
                    for(var b = 0; b < a.length; b++){
                        if (a[b].hasBeenReset || !a[b].displayState) {
                            return true;
                        }
                    }
                    return false;
                }
                if (!e(b)) {
                    for(var f = 0; f < b.length; f++){
                        d.appendChild(b[f].displayState);
                    }
                    return;
                }
                var g = [], h = w.getSimpleBoxPosition(d), i = Math.round(h.height * z * 100) / 100;
                var j = {
                    font: i + "px " + A
                };
                (function() {
                    var c, e;
                    for(var f = 0; f < b.length; f++){
                        e = b[f];
                        c = new v(a, e, j);
                        d.appendChild(c.div);
                        x(a, c, h, g);
                        e.displayState = c.div;
                        g.push(w.getSimpleBoxPosition(c));
                    }
                })();
            };
            y.Parser = function(a, b, c) {
                if (!c) {
                    c = b;
                    b = {};
                }
                if (!b) {
                    b = {};
                }
                this.window = a;
                this.vttjs = b;
                this.state = "INITIAL";
                this.buffer = "";
                this.decoder = c || new TextDecoder("utf8");
                this.regionList = [];
            };
            y.Parser.prototype = {
                reportOrThrowError: function(a) {
                    if (a instanceof f) {
                        this.onparsingerror && this.onparsingerror(a);
                    } else {
                        throw a;
                    }
                },
                parse: function(a) {
                    var b = this;
                    if (a) {
                        b.buffer += b.decoder.decode(a, {
                            stream: true
                        });
                    }
                    function c() {
                        var a = b.buffer;
                        var c = 0;
                        while(c < a.length && a[c] !== "\r" && a[c] !== "\n"){
                            ++c;
                        }
                        var d = a.substr(0, c);
                        if (a[c] === "\r") {
                            ++c;
                        }
                        if (a[c] === "\n") {
                            ++c;
                        }
                        b.buffer = a.substr(c);
                        return d;
                    }
                    function d(a) {
                        var c = new h();
                        i(a, function(a, b) {
                            switch(a){
                                case "id":
                                    c.set(a, b);
                                    break;
                                case "width":
                                    c.percent(a, b);
                                    break;
                                case "lines":
                                    c.integer(a, b);
                                    break;
                                case "regionanchor":
                                case "viewportanchor":
                                    var d = b.split(",");
                                    if (d.length !== 2) {
                                        break;
                                    }
                                    var e = new h();
                                    e.percent("x", d[0]);
                                    e.percent("y", d[1]);
                                    if (!e.has("x") || !e.has("y")) {
                                        break;
                                    }
                                    c.set(a + "X", e.get("x"));
                                    c.set(a + "Y", e.get("y"));
                                    break;
                                case "scroll":
                                    c.alt(a, b, [
                                        "up"
                                    ]);
                                    break;
                            }
                        }, /=/, /\s/);
                        if (c.has("id")) {
                            var d = new (b.vttjs.VTTRegion || b.window.VTTRegion)();
                            d.width = c.get("width", 100);
                            d.lines = c.get("lines", 3);
                            d.regionAnchorX = c.get("regionanchorX", 0);
                            d.regionAnchorY = c.get("regionanchorY", 100);
                            d.viewportAnchorX = c.get("viewportanchorX", 0);
                            d.viewportAnchorY = c.get("viewportanchorY", 100);
                            d.scroll = c.get("scroll", "");
                            b.onregion && b.onregion(d);
                            b.regionList.push({
                                id: c.get("id"),
                                region: d
                            });
                        }
                    }
                    function e(a) {
                        var c = new h();
                        i(a, function(a, b) {
                            switch(a){
                                case "MPEGT":
                                    c.integer(a + "S", b);
                                    break;
                                case "LOCA":
                                    c.set(a + "L", g(b));
                                    break;
                            }
                        }, /[^\d]:/, /,/);
                        b.ontimestampmap && b.ontimestampmap({
                            MPEGTS: c.get("MPEGTS"),
                            LOCAL: c.get("LOCAL")
                        });
                    }
                    function k(a) {
                        if (a.match(/X-TIMESTAMP-MAP/)) {
                            i(a, function(a, b) {
                                switch(a){
                                    case "X-TIMESTAMP-MAP":
                                        e(b);
                                        break;
                                }
                            }, /=/);
                        } else {
                            i(a, function(a, b) {
                                switch(a){
                                    case "Region":
                                        d(b);
                                        break;
                                }
                            }, /:/);
                        }
                    }
                    try {
                        var l;
                        if (b.state === "INITIAL") {
                            if (!/\r\n|\n/.test(b.buffer)) {
                                return this;
                            }
                            l = c();
                            var m = l.match(/^WEBVTT([ \t].*)?$/);
                            if (!m || !m[0]) {
                                throw new f(f.Errors.BadSignature);
                            }
                            b.state = "HEADER";
                        }
                        var n = false;
                        while(b.buffer){
                            if (!/\r\n|\n/.test(b.buffer)) {
                                return this;
                            }
                            if (!n) {
                                l = c();
                            } else {
                                n = false;
                            }
                            switch(b.state){
                                case "HEADER":
                                    if (/:/.test(l)) {
                                        k(l);
                                    } else if (!l) {
                                        b.state = "ID";
                                    }
                                    continue;
                                case "NOTE":
                                    if (!l) {
                                        b.state = "ID";
                                    }
                                    continue;
                                case "ID":
                                    if (/^NOTE($|[ \t])/.test(l)) {
                                        b.state = "NOTE";
                                        break;
                                    }
                                    if (!l) {
                                        continue;
                                    }
                                    b.cue = new (b.vttjs.VTTCue || b.window.VTTCue)(0, 0, "");
                                    try {
                                        b.cue.align = "center";
                                    } catch (o) {
                                        b.cue.align = "middle";
                                    }
                                    b.state = "CUE";
                                    if (l.indexOf("-->") === -1) {
                                        b.cue.id = l;
                                        continue;
                                    }
                                case "CUE":
                                    try {
                                        j(l, b.cue, b.regionList);
                                    } catch (p) {
                                        b.reportOrThrowError(p);
                                        b.cue = null;
                                        b.state = "BADCUE";
                                        continue;
                                    }
                                    b.state = "CUETEXT";
                                    continue;
                                case "CUETEXT":
                                    var q = l.indexOf("-->") !== -1;
                                    if (!l || (q && (n = true))) {
                                        b.oncue && b.oncue(b.cue);
                                        b.cue = null;
                                        b.state = "ID";
                                        continue;
                                    }
                                    if (b.cue.text) {
                                        b.cue.text += "\n";
                                    }
                                    b.cue.text += l.replace(/\u2028/g, "\n").replace(/u2029/g, "\n");
                                    continue;
                                case "BADCUE":
                                    if (!l) {
                                        b.state = "ID";
                                    }
                                    continue;
                            }
                        }
                    } catch (r) {
                        b.reportOrThrowError(r);
                        if (b.state === "CUETEXT" && b.cue && b.oncue) {
                            b.oncue(b.cue);
                        }
                        b.cue = null;
                        b.state = b.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
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
                            throw new f(f.Errors.BadSignature);
                        }
                    } catch (b) {
                        a.reportOrThrowError(b);
                    }
                    a.onflush && a.onflush();
                    return this;
                }
            };
            a.exports = y;
        },
        2230: function(a) {
            var b = "auto";
            var c = {
                "": 1,
                lr: 1,
                rl: 1
            };
            var d = {
                start: 1,
                center: 1,
                end: 1,
                left: 1,
                right: 1,
                auto: 1,
                "line-left": 1,
                "line-right": 1
            };
            function e(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var b = c[a.toLowerCase()];
                return b ? a.toLowerCase() : false;
            }
            function f(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var b = d[a.toLowerCase()];
                return b ? a.toLowerCase() : false;
            }
            function g(a, c, d) {
                this.hasBeenReset = false;
                var g = "";
                var h = false;
                var i = a;
                var j = c;
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
                            return g;
                        },
                        set: function(a) {
                            g = "" + a;
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
                        set: function(a) {
                            var b = e(a);
                            if (b === false) {
                                throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
                            }
                            m = b;
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
                            if (typeof a !== "number" && a !== b) {
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
                        set: function(a) {
                            var b = f(a);
                            if (!b) {
                                console.warn("lineAlign: an invalid or illegal string was specified.");
                            } else {
                                p = b;
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
                        set: function(a) {
                            var b = f(a);
                            if (!b) {
                                console.warn("positionAlign: an invalid or illegal string was specified.");
                            } else {
                                r = b;
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
                        set: function(a) {
                            var b = f(a);
                            if (!b) {
                                throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
                            }
                            t = b;
                            this.hasBeenReset = true;
                        }
                    }
                });
                this.displayState = undefined;
            }
            g.prototype.getCueAsHTML = function() {
                return WebVTT.convertCueToDOMTree(window, this.text);
            };
            a.exports = g;
        },
        3710: function(a) {
            var b = {
                "": true,
                up: true
            };
            function c(a) {
                if (typeof a !== "string") {
                    return false;
                }
                var c = b[a.toLowerCase()];
                return c ? a.toLowerCase() : false;
            }
            function d(a) {
                return typeof a === "number" && a >= 0 && a <= 100;
            }
            function e() {
                var a = 100;
                var b = 3;
                var e = 0;
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
                            if (!d(b)) {
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
                            if (!d(a)) {
                                throw new Error("RegionAnchorX must be between 0 and 100.");
                            }
                            f = a;
                        }
                    },
                    regionAnchorX: {
                        enumerable: true,
                        get: function() {
                            return e;
                        },
                        set: function(a) {
                            if (!d(a)) {
                                throw new Error("RegionAnchorY must be between 0 and 100.");
                            }
                            e = a;
                        }
                    },
                    viewportAnchorY: {
                        enumerable: true,
                        get: function() {
                            return h;
                        },
                        set: function(a) {
                            if (!d(a)) {
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
                            if (!d(a)) {
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
                        set: function(a) {
                            var b = c(a);
                            if (b === false) {
                                console.warn("Scroll: an invalid or illegal string was specified.");
                            } else {
                                i = b;
                            }
                        }
                    }
                });
            }
            a.exports = e;
        },
        4782: function(a, b) {
            "use strict";
            b.byteLength = j;
            b.toByteArray = l;
            b.fromByteArray = o;
            var c = [];
            var d = [];
            var e = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var g = 0, h = f.length; g < h; ++g){
                c[g] = f[g];
                d[f.charCodeAt(g)] = g;
            }
            d["-".charCodeAt(0)] = 62;
            d["_".charCodeAt(0)] = 63;
            function i(a) {
                var b = a.length;
                if (b % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var c = a.indexOf("=");
                if (c === -1) c = b;
                var d = c === b ? 0 : 4 - (c % 4);
                return [
                    c,
                    d
                ];
            }
            function j(a) {
                var b = i(a);
                var c = b[0];
                var d = b[1];
                return ((c + d) * 3) / 4 - d;
            }
            function k(a, b, c) {
                return ((b + c) * 3) / 4 - c;
            }
            function l(a) {
                var b;
                var c = i(a);
                var f = c[0];
                var g = c[1];
                var h = new e(k(a, f, g));
                var j = 0;
                var l = g > 0 ? f - 4 : f;
                var m;
                for(m = 0; m < l; m += 4){
                    b = (d[a.charCodeAt(m)] << 18) | (d[a.charCodeAt(m + 1)] << 12) | (d[a.charCodeAt(m + 2)] << 6) | d[a.charCodeAt(m + 3)];
                    h[j++] = (b >> 16) & 0xff;
                    h[j++] = (b >> 8) & 0xff;
                    h[j++] = b & 0xff;
                }
                if (g === 2) {
                    b = (d[a.charCodeAt(m)] << 2) | (d[a.charCodeAt(m + 1)] >> 4);
                    h[j++] = b & 0xff;
                }
                if (g === 1) {
                    b = (d[a.charCodeAt(m)] << 10) | (d[a.charCodeAt(m + 1)] << 4) | (d[a.charCodeAt(m + 2)] >> 2);
                    h[j++] = (b >> 8) & 0xff;
                    h[j++] = b & 0xff;
                }
                return h;
            }
            function m(a) {
                return (c[(a >> 18) & 0x3f] + c[(a >> 12) & 0x3f] + c[(a >> 6) & 0x3f] + c[a & 0x3f]);
            }
            function n(a, b, c) {
                var d;
                var e = [];
                for(var f = b; f < c; f += 3){
                    d = ((a[f] << 16) & 0xff0000) + ((a[f + 1] << 8) & 0xff00) + (a[f + 2] & 0xff);
                    e.push(m(d));
                }
                return e.join("");
            }
            function o(a) {
                var b;
                var d = a.length;
                var e = d % 3;
                var f = [];
                var g = 16383;
                for(var h = 0, i = d - e; h < i; h += g){
                    f.push(n(a, h, h + g > i ? i : h + g));
                }
                if (e === 1) {
                    b = a[d - 1];
                    f.push(c[b >> 2] + c[(b << 4) & 0x3f] + "==");
                } else if (e === 2) {
                    b = (a[d - 2] << 8) + a[d - 1];
                    f.push(c[b >> 10] + c[(b >> 4) & 0x3f] + c[(b << 2) & 0x3f] + "=");
                }
                return f.join("");
            }
        },
        816: function(a, b, c) {
            "use strict";
            var d = c(4782);
            var e = c(8898);
            var f = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            b.Buffer = j;
            b.SlowBuffer = t;
            b.INSPECT_MAX_BYTES = 50;
            var g = 0x7fffffff;
            b.kMaxLength = g;
            j.TYPED_ARRAY_SUPPORT = h();
            if (!j.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function h() {
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
            Object.defineProperty(j.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!j.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(j.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!j.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function i(a) {
                if (a > g) {
                    throw new RangeError('The value "' + a + '" is invalid for option "size"');
                }
                var b = new Uint8Array(a);
                Object.setPrototypeOf(b, j.prototype);
                return b;
            }
            function j(a, b, c) {
                if (typeof a === "number") {
                    if (typeof b === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return n(a);
                }
                return k(a, b, c);
            }
            j.poolSize = 8192;
            function k(a, b, c) {
                if (typeof a === "string") {
                    return o(a, b);
                }
                if (ArrayBuffer.isView(a)) {
                    return p(a);
                }
                if (a == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof a);
                }
                if (Z(a, ArrayBuffer) || (a && Z(a.buffer, ArrayBuffer))) {
                    return q(a, b, c);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (Z(a, SharedArrayBuffer) || (a && Z(a.buffer, SharedArrayBuffer)))) {
                    return q(a, b, c);
                }
                if (typeof a === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var d = a.valueOf && a.valueOf();
                if (d != null && d !== a) {
                    return j.from(d, b, c);
                }
                var e = r(a);
                if (e) return e;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof a[Symbol.toPrimitive] === "function") {
                    return j.from(a[Symbol.toPrimitive]("string"), b, c);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof a);
            }
            j.from = function(a, b, c) {
                return k(a, b, c);
            };
            Object.setPrototypeOf(j.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(j, Uint8Array);
            function l(a) {
                if (typeof a !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (a < 0) {
                    throw new RangeError('The value "' + a + '" is invalid for option "size"');
                }
            }
            function m(a, b, c) {
                l(a);
                if (a <= 0) {
                    return i(a);
                }
                if (b !== undefined) {
                    return typeof c === "string" ? i(a).fill(b, c) : i(a).fill(b);
                }
                return i(a);
            }
            j.alloc = function(a, b, c) {
                return m(a, b, c);
            };
            function n(a) {
                l(a);
                return i(a < 0 ? 0 : s(a) | 0);
            }
            j.allocUnsafe = function(a) {
                return n(a);
            };
            j.allocUnsafeSlow = function(a) {
                return n(a);
            };
            function o(a, b) {
                if (typeof b !== "string" || b === "") {
                    b = "utf8";
                }
                if (!j.isEncoding(b)) {
                    throw new TypeError("Unknown encoding: " + b);
                }
                var c = u(a, b) | 0;
                var d = i(c);
                var e = d.write(a, b);
                if (e !== c) {
                    d = d.slice(0, e);
                }
                return d;
            }
            function p(a) {
                var b = a.length < 0 ? 0 : s(a.length) | 0;
                var c = i(b);
                for(var d = 0; d < b; d += 1){
                    c[d] = a[d] & 255;
                }
                return c;
            }
            function q(a, b, c) {
                if (b < 0 || a.byteLength < b) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (a.byteLength < b + (c || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var d;
                if (b === undefined && c === undefined) {
                    d = new Uint8Array(a);
                } else if (c === undefined) {
                    d = new Uint8Array(a, b);
                } else {
                    d = new Uint8Array(a, b, c);
                }
                Object.setPrototypeOf(d, j.prototype);
                return d;
            }
            function r(a) {
                if (j.isBuffer(a)) {
                    var b = s(a.length) | 0;
                    var c = i(b);
                    if (c.length === 0) {
                        return c;
                    }
                    a.copy(c, 0, 0, b);
                    return c;
                }
                if (a.length !== undefined) {
                    if (typeof a.length !== "number" || $(a.length)) {
                        return i(0);
                    }
                    return p(a);
                }
                if (a.type === "Buffer" && Array.isArray(a.data)) {
                    return p(a.data);
                }
            }
            function s(a) {
                if (a >= g) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + g.toString(16) + " bytes");
                }
                return a | 0;
            }
            function t(a) {
                if (+a != a) {
                    a = 0;
                }
                return j.alloc(+a);
            }
            j.isBuffer = function a(b) {
                return (b != null && b._isBuffer === true && b !== j.prototype);
            };
            j.compare = function a(b, c) {
                if (Z(b, Uint8Array)) b = j.from(b, b.offset, b.byteLength);
                if (Z(c, Uint8Array)) c = j.from(c, c.offset, c.byteLength);
                if (!j.isBuffer(b) || !j.isBuffer(c)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (b === c) return 0;
                var d = b.length;
                var e = c.length;
                for(var f = 0, g = Math.min(d, e); f < g; ++f){
                    if (b[f] !== c[f]) {
                        d = b[f];
                        e = c[f];
                        break;
                    }
                }
                if (d < e) return -1;
                if (e < d) return 1;
                return 0;
            };
            j.isEncoding = function a(b) {
                switch(String(b).toLowerCase()){
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
            j.concat = function a(b, c) {
                if (!Array.isArray(b)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (b.length === 0) {
                    return j.alloc(0);
                }
                var d;
                if (c === undefined) {
                    c = 0;
                    for(d = 0; d < b.length; ++d){
                        c += b[d].length;
                    }
                }
                var e = j.allocUnsafe(c);
                var f = 0;
                for(d = 0; d < b.length; ++d){
                    var g = b[d];
                    if (Z(g, Uint8Array)) {
                        g = j.from(g);
                    }
                    if (!j.isBuffer(g)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    g.copy(e, f);
                    f += g.length;
                }
                return e;
            };
            function u(a, b) {
                if (j.isBuffer(a)) {
                    return a.length;
                }
                if (ArrayBuffer.isView(a) || Z(a, ArrayBuffer)) {
                    return a.byteLength;
                }
                if (typeof a !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof a);
                }
                var c = a.length;
                var d = arguments.length > 2 && arguments[2] === true;
                if (!d && c === 0) return 0;
                var e = false;
                for(;;){
                    switch(b){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return c;
                        case "utf8":
                        case "utf-8":
                            return U(a).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return c * 2;
                        case "hex":
                            return c >>> 1;
                        case "base64":
                            return X(a).length;
                        default:
                            if (e) {
                                return d ? -1 : U(a).length;
                            }
                            b = ("" + b).toLowerCase();
                            e = true;
                    }
                }
            }
            j.byteLength = u;
            function v(a, b, c) {
                var d = false;
                if (b === undefined || b < 0) {
                    b = 0;
                }
                if (b > this.length) {
                    return "";
                }
                if (c === undefined || c > this.length) {
                    c = this.length;
                }
                if (c <= 0) {
                    return "";
                }
                c >>>= 0;
                b >>>= 0;
                if (c <= b) {
                    return "";
                }
                if (!a) a = "utf8";
                while(true){
                    switch(a){
                        case "hex":
                            return L(this, b, c);
                        case "utf8":
                        case "utf-8":
                            return G(this, b, c);
                        case "ascii":
                            return J(this, b, c);
                        case "latin1":
                        case "binary":
                            return K(this, b, c);
                        case "base64":
                            return F(this, b, c);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return M(this, b, c);
                        default:
                            if (d) throw new TypeError("Unknown encoding: " + a);
                            a = (a + "").toLowerCase();
                            d = true;
                    }
                }
            }
            j.prototype._isBuffer = true;
            function w(a, b, c) {
                var d = a[b];
                a[b] = a[c];
                a[c] = d;
            }
            j.prototype.swap16 = function a() {
                var b = this.length;
                if (b % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var c = 0; c < b; c += 2){
                    w(this, c, c + 1);
                }
                return this;
            };
            j.prototype.swap32 = function a() {
                var b = this.length;
                if (b % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var c = 0; c < b; c += 4){
                    w(this, c, c + 3);
                    w(this, c + 1, c + 2);
                }
                return this;
            };
            j.prototype.swap64 = function a() {
                var b = this.length;
                if (b % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var c = 0; c < b; c += 8){
                    w(this, c, c + 7);
                    w(this, c + 1, c + 6);
                    w(this, c + 2, c + 5);
                    w(this, c + 3, c + 4);
                }
                return this;
            };
            j.prototype.toString = function a() {
                var b = this.length;
                if (b === 0) return "";
                if (arguments.length === 0) return G(this, 0, b);
                return v.apply(this, arguments);
            };
            j.prototype.toLocaleString = j.prototype.toString;
            j.prototype.equals = function a(b) {
                if (!j.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                if (this === b) return true;
                return j.compare(this, b) === 0;
            };
            j.prototype.inspect = function a() {
                var c = "";
                var d = b.INSPECT_MAX_BYTES;
                c = this.toString("hex", 0, d).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > d) c += " ... ";
                return "<Buffer " + c + ">";
            };
            if (f) {
                j.prototype[f] = j.prototype.inspect;
            }
            j.prototype.compare = function a(b, c, d, e, f) {
                if (Z(b, Uint8Array)) {
                    b = j.from(b, b.offset, b.byteLength);
                }
                if (!j.isBuffer(b)) {
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
                var g = f - e;
                var h = d - c;
                var i = Math.min(g, h);
                var k = this.slice(e, f);
                var l = b.slice(c, d);
                for(var m = 0; m < i; ++m){
                    if (k[m] !== l[m]) {
                        g = k[m];
                        h = l[m];
                        break;
                    }
                }
                if (g < h) return -1;
                if (h < g) return 1;
                return 0;
            };
            function x(a, b, c, d, e) {
                if (a.length === 0) return -1;
                if (typeof c === "string") {
                    d = c;
                    c = 0;
                } else if (c > 0x7fffffff) {
                    c = 0x7fffffff;
                } else if (c < -0x80000000) {
                    c = -0x80000000;
                }
                c = +c;
                if ($(c)) {
                    c = e ? 0 : a.length - 1;
                }
                if (c < 0) c = a.length + c;
                if (c >= a.length) {
                    if (e) return -1;
                    else c = a.length - 1;
                } else if (c < 0) {
                    if (e) c = 0;
                    else return -1;
                }
                if (typeof b === "string") {
                    b = j.from(b, d);
                }
                if (j.isBuffer(b)) {
                    if (b.length === 0) {
                        return -1;
                    }
                    return y(a, b, c, d, e);
                } else if (typeof b === "number") {
                    b = b & 0xff;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (e) {
                            return Uint8Array.prototype.indexOf.call(a, b, c);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(a, b, c);
                        }
                    }
                    return y(a, [
                        b
                    ], c, d, e);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function y(a, b, c, d, e) {
                var f = 1;
                var g = a.length;
                var h = b.length;
                if (d !== undefined) {
                    d = String(d).toLowerCase();
                    if (d === "ucs2" || d === "ucs-2" || d === "utf16le" || d === "utf-16le") {
                        if (a.length < 2 || b.length < 2) {
                            return -1;
                        }
                        f = 2;
                        g /= 2;
                        h /= 2;
                        c /= 2;
                    }
                }
                function i(a, b) {
                    if (f === 1) {
                        return a[b];
                    } else {
                        return a.readUInt16BE(b * f);
                    }
                }
                var j;
                if (e) {
                    var k = -1;
                    for(j = c; j < g; j++){
                        if (i(a, j) === i(b, k === -1 ? 0 : j - k)) {
                            if (k === -1) k = j;
                            if (j - k + 1 === h) return k * f;
                        } else {
                            if (k !== -1) j -= j - k;
                            k = -1;
                        }
                    }
                } else {
                    if (c + h > g) c = g - h;
                    for(j = c; j >= 0; j--){
                        var l = true;
                        for(var m = 0; m < h; m++){
                            if (i(a, j + m) !== i(b, m)) {
                                l = false;
                                break;
                            }
                        }
                        if (l) return j;
                    }
                }
                return -1;
            }
            j.prototype.includes = function a(b, c, d) {
                return this.indexOf(b, c, d) !== -1;
            };
            j.prototype.indexOf = function a(b, c, d) {
                return x(this, b, c, d, true);
            };
            j.prototype.lastIndexOf = function a(b, c, d) {
                return x(this, b, c, d, false);
            };
            function z(a, b, c, d) {
                c = Number(c) || 0;
                var e = a.length - c;
                if (!d) {
                    d = e;
                } else {
                    d = Number(d);
                    if (d > e) {
                        d = e;
                    }
                }
                var f = b.length;
                if (d > f / 2) {
                    d = f / 2;
                }
                for(var g = 0; g < d; ++g){
                    var h = parseInt(b.substr(g * 2, 2), 16);
                    if ($(h)) return g;
                    a[c + g] = h;
                }
                return g;
            }
            function A(a, b, c, d) {
                return Y(U(b, a.length - c), a, c, d);
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
            function E(a, b, c, d) {
                return Y(W(b, a.length - c), a, c, d);
            }
            j.prototype.write = function a(b, c, d, e) {
                if (c === undefined) {
                    e = "utf8";
                    d = this.length;
                    c = 0;
                } else if (d === undefined && typeof c === "string") {
                    e = c;
                    d = this.length;
                    c = 0;
                } else if (isFinite(c)) {
                    c = c >>> 0;
                    if (isFinite(d)) {
                        d = d >>> 0;
                        if (e === undefined) e = "utf8";
                    } else {
                        e = d;
                        d = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var f = this.length - c;
                if (d === undefined || d > f) d = f;
                if ((b.length > 0 && (d < 0 || c < 0)) || c > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!e) e = "utf8";
                var g = false;
                for(;;){
                    switch(e){
                        case "hex":
                            return z(this, b, c, d);
                        case "utf8":
                        case "utf-8":
                            return A(this, b, c, d);
                        case "ascii":
                            return B(this, b, c, d);
                        case "latin1":
                        case "binary":
                            return C(this, b, c, d);
                        case "base64":
                            return D(this, b, c, d);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return E(this, b, c, d);
                        default:
                            if (g) throw new TypeError("Unknown encoding: " + e);
                            e = ("" + e).toLowerCase();
                            g = true;
                    }
                }
            };
            j.prototype.toJSON = function a() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function F(a, b, c) {
                if (b === 0 && c === a.length) {
                    return d.fromByteArray(a);
                } else {
                    return d.fromByteArray(a.slice(b, c));
                }
            }
            function G(a, b, c) {
                c = Math.min(a.length, c);
                var d = [];
                var e = b;
                while(e < c){
                    var f = a[e];
                    var g = null;
                    var h = f > 0xef ? 4 : f > 0xdf ? 3 : f > 0xbf ? 2 : 1;
                    if (e + h <= c) {
                        var i, j, k, l;
                        switch(h){
                            case 1:
                                if (f < 0x80) {
                                    g = f;
                                }
                                break;
                            case 2:
                                i = a[e + 1];
                                if ((i & 0xc0) === 0x80) {
                                    l = ((f & 0x1f) << 0x6) | (i & 0x3f);
                                    if (l > 0x7f) {
                                        g = l;
                                    }
                                }
                                break;
                            case 3:
                                i = a[e + 1];
                                j = a[e + 2];
                                if ((i & 0xc0) === 0x80 && (j & 0xc0) === 0x80) {
                                    l = ((f & 0xf) << 0xc) | ((i & 0x3f) << 0x6) | (j & 0x3f);
                                    if (l > 0x7ff && (l < 0xd800 || l > 0xdfff)) {
                                        g = l;
                                    }
                                }
                                break;
                            case 4:
                                i = a[e + 1];
                                j = a[e + 2];
                                k = a[e + 3];
                                if ((i & 0xc0) === 0x80 && (j & 0xc0) === 0x80 && (k & 0xc0) === 0x80) {
                                    l = ((f & 0xf) << 0x12) | ((i & 0x3f) << 0xc) | ((j & 0x3f) << 0x6) | (k & 0x3f);
                                    if (l > 0xffff && l < 0x110000) {
                                        g = l;
                                    }
                                }
                        }
                    }
                    if (g === null) {
                        g = 0xfffd;
                        h = 1;
                    } else if (g > 0xffff) {
                        g -= 0x10000;
                        d.push(((g >>> 10) & 0x3ff) | 0xd800);
                        g = 0xdc00 | (g & 0x3ff);
                    }
                    d.push(g);
                    e += h;
                }
                return I(d);
            }
            var H = 0x1000;
            function I(a) {
                var b = a.length;
                if (b <= H) {
                    return String.fromCharCode.apply(String, a);
                }
                var c = "";
                var d = 0;
                while(d < b){
                    c += String.fromCharCode.apply(String, a.slice(d, (d += H)));
                }
                return c;
            }
            function J(a, b, c) {
                var d = "";
                c = Math.min(a.length, c);
                for(var e = b; e < c; ++e){
                    d += String.fromCharCode(a[e] & 0x7f);
                }
                return d;
            }
            function K(a, b, c) {
                var d = "";
                c = Math.min(a.length, c);
                for(var e = b; e < c; ++e){
                    d += String.fromCharCode(a[e]);
                }
                return d;
            }
            function L(a, b, c) {
                var d = a.length;
                if (!b || b < 0) b = 0;
                if (!c || c < 0 || c > d) c = d;
                var e = "";
                for(var f = b; f < c; ++f){
                    e += _[a[f]];
                }
                return e;
            }
            function M(a, b, c) {
                var d = a.slice(b, c);
                var e = "";
                for(var f = 0; f < d.length; f += 2){
                    e += String.fromCharCode(d[f] + d[f + 1] * 256);
                }
                return e;
            }
            j.prototype.slice = function a(b, c) {
                var d = this.length;
                b = ~~b;
                c = c === undefined ? d : ~~c;
                if (b < 0) {
                    b += d;
                    if (b < 0) b = 0;
                } else if (b > d) {
                    b = d;
                }
                if (c < 0) {
                    c += d;
                    if (c < 0) c = 0;
                } else if (c > d) {
                    c = d;
                }
                if (c < b) c = b;
                var e = this.subarray(b, c);
                Object.setPrototypeOf(e, j.prototype);
                return e;
            };
            function N(a, b, c) {
                if (a % 1 !== 0 || a < 0) throw new RangeError("offset is not uint");
                if (a + b > c) throw new RangeError("Trying to access beyond buffer length");
            }
            j.prototype.readUIntLE = function a(b, c, d) {
                b = b >>> 0;
                c = c >>> 0;
                if (!d) N(b, c, this.length);
                var e = this[b];
                var f = 1;
                var g = 0;
                while(++g < c && (f *= 0x100)){
                    e += this[b + g] * f;
                }
                return e;
            };
            j.prototype.readUIntBE = function a(b, c, d) {
                b = b >>> 0;
                c = c >>> 0;
                if (!d) {
                    N(b, c, this.length);
                }
                var e = this[b + --c];
                var f = 1;
                while(c > 0 && (f *= 0x100)){
                    e += this[b + --c] * f;
                }
                return e;
            };
            j.prototype.readUInt8 = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 1, this.length);
                return this[b];
            };
            j.prototype.readUInt16LE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 2, this.length);
                return this[b] | (this[b + 1] << 8);
            };
            j.prototype.readUInt16BE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 2, this.length);
                return (this[b] << 8) | this[b + 1];
            };
            j.prototype.readUInt32LE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return ((this[b] | (this[b + 1] << 8) | (this[b + 2] << 16)) + this[b + 3] * 0x1000000);
            };
            j.prototype.readUInt32BE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return (this[b] * 0x1000000 + ((this[b + 1] << 16) | (this[b + 2] << 8) | this[b + 3]));
            };
            j.prototype.readIntLE = function a(b, c, d) {
                b = b >>> 0;
                c = c >>> 0;
                if (!d) N(b, c, this.length);
                var e = this[b];
                var f = 1;
                var g = 0;
                while(++g < c && (f *= 0x100)){
                    e += this[b + g] * f;
                }
                f *= 0x80;
                if (e >= f) e -= Math.pow(2, 8 * c);
                return e;
            };
            j.prototype.readIntBE = function a(b, c, d) {
                b = b >>> 0;
                c = c >>> 0;
                if (!d) N(b, c, this.length);
                var e = c;
                var f = 1;
                var g = this[b + --e];
                while(e > 0 && (f *= 0x100)){
                    g += this[b + --e] * f;
                }
                f *= 0x80;
                if (g >= f) g -= Math.pow(2, 8 * c);
                return g;
            };
            j.prototype.readInt8 = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 1, this.length);
                if (!(this[b] & 0x80)) return this[b];
                return (0xff - this[b] + 1) * -1;
            };
            j.prototype.readInt16LE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 2, this.length);
                var d = this[b] | (this[b + 1] << 8);
                return d & 0x8000 ? d | 0xffff0000 : d;
            };
            j.prototype.readInt16BE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 2, this.length);
                var d = this[b + 1] | (this[b] << 8);
                return d & 0x8000 ? d | 0xffff0000 : d;
            };
            j.prototype.readInt32LE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return (this[b] | (this[b + 1] << 8) | (this[b + 2] << 16) | (this[b + 3] << 24));
            };
            j.prototype.readInt32BE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return ((this[b] << 24) | (this[b + 1] << 16) | (this[b + 2] << 8) | this[b + 3]);
            };
            j.prototype.readFloatLE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return e.read(this, b, true, 23, 4);
            };
            j.prototype.readFloatBE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 4, this.length);
                return e.read(this, b, false, 23, 4);
            };
            j.prototype.readDoubleLE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 8, this.length);
                return e.read(this, b, true, 52, 8);
            };
            j.prototype.readDoubleBE = function a(b, c) {
                b = b >>> 0;
                if (!c) N(b, 8, this.length);
                return e.read(this, b, false, 52, 8);
            };
            function O(a, b, c, d, e, f) {
                if (!j.isBuffer(a)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (b > e || b < f) throw new RangeError('"value" argument is out of bounds');
                if (c + d > a.length) throw new RangeError("Index out of range");
            }
            j.prototype.writeUIntLE = function a(b, c, d, e) {
                b = +b;
                c = c >>> 0;
                d = d >>> 0;
                if (!e) {
                    var f = Math.pow(2, 8 * d) - 1;
                    O(this, b, c, d, f, 0);
                }
                var g = 1;
                var h = 0;
                this[c] = b & 0xff;
                while(++h < d && (g *= 0x100)){
                    this[c + h] = (b / g) & 0xff;
                }
                return c + d;
            };
            j.prototype.writeUIntBE = function a(b, c, d, e) {
                b = +b;
                c = c >>> 0;
                d = d >>> 0;
                if (!e) {
                    var f = Math.pow(2, 8 * d) - 1;
                    O(this, b, c, d, f, 0);
                }
                var g = d - 1;
                var h = 1;
                this[c + g] = b & 0xff;
                while(--g >= 0 && (h *= 0x100)){
                    this[c + g] = (b / h) & 0xff;
                }
                return c + d;
            };
            j.prototype.writeUInt8 = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 1, 0xff, 0);
                this[c] = b & 0xff;
                return c + 1;
            };
            j.prototype.writeUInt16LE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 2, 0xffff, 0);
                this[c] = b & 0xff;
                this[c + 1] = b >>> 8;
                return c + 2;
            };
            j.prototype.writeUInt16BE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 2, 0xffff, 0);
                this[c] = b >>> 8;
                this[c + 1] = b & 0xff;
                return c + 2;
            };
            j.prototype.writeUInt32LE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 4, 0xffffffff, 0);
                this[c + 3] = b >>> 24;
                this[c + 2] = b >>> 16;
                this[c + 1] = b >>> 8;
                this[c] = b & 0xff;
                return c + 4;
            };
            j.prototype.writeUInt32BE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 4, 0xffffffff, 0);
                this[c] = b >>> 24;
                this[c + 1] = b >>> 16;
                this[c + 2] = b >>> 8;
                this[c + 3] = b & 0xff;
                return c + 4;
            };
            j.prototype.writeIntLE = function a(b, c, d, e) {
                b = +b;
                c = c >>> 0;
                if (!e) {
                    var f = Math.pow(2, 8 * d - 1);
                    O(this, b, c, d, f - 1, -f);
                }
                var g = 0;
                var h = 1;
                var i = 0;
                this[c] = b & 0xff;
                while(++g < d && (h *= 0x100)){
                    if (b < 0 && i === 0 && this[c + g - 1] !== 0) {
                        i = 1;
                    }
                    this[c + g] = (((b / h) >> 0) - i) & 0xff;
                }
                return c + d;
            };
            j.prototype.writeIntBE = function a(b, c, d, e) {
                b = +b;
                c = c >>> 0;
                if (!e) {
                    var f = Math.pow(2, 8 * d - 1);
                    O(this, b, c, d, f - 1, -f);
                }
                var g = d - 1;
                var h = 1;
                var i = 0;
                this[c + g] = b & 0xff;
                while(--g >= 0 && (h *= 0x100)){
                    if (b < 0 && i === 0 && this[c + g + 1] !== 0) {
                        i = 1;
                    }
                    this[c + g] = (((b / h) >> 0) - i) & 0xff;
                }
                return c + d;
            };
            j.prototype.writeInt8 = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 1, 0x7f, -0x80);
                if (b < 0) b = 0xff + b + 1;
                this[c] = b & 0xff;
                return c + 1;
            };
            j.prototype.writeInt16LE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 2, 0x7fff, -0x8000);
                this[c] = b & 0xff;
                this[c + 1] = b >>> 8;
                return c + 2;
            };
            j.prototype.writeInt16BE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 2, 0x7fff, -0x8000);
                this[c] = b >>> 8;
                this[c + 1] = b & 0xff;
                return c + 2;
            };
            j.prototype.writeInt32LE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 4, 0x7fffffff, -0x80000000);
                this[c] = b & 0xff;
                this[c + 1] = b >>> 8;
                this[c + 2] = b >>> 16;
                this[c + 3] = b >>> 24;
                return c + 4;
            };
            j.prototype.writeInt32BE = function a(b, c, d) {
                b = +b;
                c = c >>> 0;
                if (!d) O(this, b, c, 4, 0x7fffffff, -0x80000000);
                if (b < 0) b = 0xffffffff + b + 1;
                this[c] = b >>> 24;
                this[c + 1] = b >>> 16;
                this[c + 2] = b >>> 8;
                this[c + 3] = b & 0xff;
                return c + 4;
            };
            function P(a, b, c, d, e, f) {
                if (c + d > a.length) throw new RangeError("Index out of range");
                if (c < 0) throw new RangeError("Index out of range");
            }
            function Q(a, b, c, d, f) {
                b = +b;
                c = c >>> 0;
                if (!f) {
                    P(a, b, c, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                }
                e.write(a, b, c, d, 23, 4);
                return c + 4;
            }
            j.prototype.writeFloatLE = function a(b, c, d) {
                return Q(this, b, c, true, d);
            };
            j.prototype.writeFloatBE = function a(b, c, d) {
                return Q(this, b, c, false, d);
            };
            function R(a, b, c, d, f) {
                b = +b;
                c = c >>> 0;
                if (!f) {
                    P(a, b, c, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                }
                e.write(a, b, c, d, 52, 8);
                return c + 8;
            }
            j.prototype.writeDoubleLE = function a(b, c, d) {
                return R(this, b, c, true, d);
            };
            j.prototype.writeDoubleBE = function a(b, c, d) {
                return R(this, b, c, false, d);
            };
            j.prototype.copy = function a(b, c, d, e) {
                if (!j.isBuffer(b)) throw new TypeError("argument should be a Buffer");
                if (!d) d = 0;
                if (!e && e !== 0) e = this.length;
                if (c >= b.length) c = b.length;
                if (!c) c = 0;
                if (e > 0 && e < d) e = d;
                if (e === d) return 0;
                if (b.length === 0 || this.length === 0) return 0;
                if (c < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (d < 0 || d >= this.length) throw new RangeError("Index out of range");
                if (e < 0) throw new RangeError("sourceEnd out of bounds");
                if (e > this.length) e = this.length;
                if (b.length - c < e - d) {
                    e = b.length - c + d;
                }
                var f = e - d;
                if (this === b && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(c, d, e);
                } else if (this === b && d < c && c < e) {
                    for(var g = f - 1; g >= 0; --g){
                        b[g + c] = this[g + d];
                    }
                } else {
                    Uint8Array.prototype.set.call(b, this.subarray(d, e), c);
                }
                return f;
            };
            j.prototype.fill = function a(b, c, d, e) {
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
                    if (typeof e === "string" && !j.isEncoding(e)) {
                        throw new TypeError("Unknown encoding: " + e);
                    }
                    if (b.length === 1) {
                        var f = b.charCodeAt(0);
                        if ((e === "utf8" && f < 128) || e === "latin1") {
                            b = f;
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
                var g;
                if (typeof b === "number") {
                    for(g = c; g < d; ++g){
                        this[g] = b;
                    }
                } else {
                    var h = j.isBuffer(b) ? b : j.from(b, e);
                    var i = h.length;
                    if (i === 0) {
                        throw new TypeError('The value "' + b + '" is invalid for argument "value"');
                    }
                    for(g = 0; g < d - c; ++g){
                        this[g + c] = h[g % i];
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
            function U(a, b) {
                b = b || Infinity;
                var c;
                var d = a.length;
                var e = null;
                var f = [];
                for(var g = 0; g < d; ++g){
                    c = a.charCodeAt(g);
                    if (c > 0xd7ff && c < 0xe000) {
                        if (!e) {
                            if (c > 0xdbff) {
                                if ((b -= 3) > -1) f.push(0xef, 0xbf, 0xbd);
                                continue;
                            } else if (g + 1 === d) {
                                if ((b -= 3) > -1) f.push(0xef, 0xbf, 0xbd);
                                continue;
                            }
                            e = c;
                            continue;
                        }
                        if (c < 0xdc00) {
                            if ((b -= 3) > -1) f.push(0xef, 0xbf, 0xbd);
                            e = c;
                            continue;
                        }
                        c = (((e - 0xd800) << 10) | (c - 0xdc00)) + 0x10000;
                    } else if (e) {
                        if ((b -= 3) > -1) f.push(0xef, 0xbf, 0xbd);
                    }
                    e = null;
                    if (c < 0x80) {
                        if ((b -= 1) < 0) break;
                        f.push(c);
                    } else if (c < 0x800) {
                        if ((b -= 2) < 0) break;
                        f.push((c >> 0x6) | 0xc0, (c & 0x3f) | 0x80);
                    } else if (c < 0x10000) {
                        if ((b -= 3) < 0) break;
                        f.push((c >> 0xc) | 0xe0, ((c >> 0x6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                    } else if (c < 0x110000) {
                        if ((b -= 4) < 0) break;
                        f.push((c >> 0x12) | 0xf0, ((c >> 0xc) & 0x3f) | 0x80, ((c >> 0x6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return f;
            }
            function V(a) {
                var b = [];
                for(var c = 0; c < a.length; ++c){
                    b.push(a.charCodeAt(c) & 0xff);
                }
                return b;
            }
            function W(a, b) {
                var c, d, e;
                var f = [];
                for(var g = 0; g < a.length; ++g){
                    if ((b -= 2) < 0) break;
                    c = a.charCodeAt(g);
                    d = c >> 8;
                    e = c % 256;
                    f.push(e);
                    f.push(d);
                }
                return f;
            }
            function X(a) {
                return d.toByteArray(T(a));
            }
            function Y(a, b, c, d) {
                for(var e = 0; e < d; ++e){
                    if (e + c >= b.length || e >= a.length) break;
                    b[e + c] = a[e];
                }
                return e;
            }
            function Z(a, b) {
                return (a instanceof b || (a != null && a.constructor != null && a.constructor.name != null && a.constructor.name === b.name));
            }
            function $(a) {
                return a !== a;
            }
            var _ = (function() {
                var a = "0123456789abcdef";
                var b = new Array(256);
                for(var c = 0; c < 16; ++c){
                    var d = c * 16;
                    for(var e = 0; e < 16; ++e){
                        b[d + e] = a[c] + a[e];
                    }
                }
                return b;
            })();
        },
        8898: function(a, b) {
            b.read = function(a, b, c, d, e) {
                var f, g;
                var h = e * 8 - d - 1;
                var i = (1 << h) - 1;
                var j = i >> 1;
                var k = -7;
                var l = c ? e - 1 : 0;
                var m = c ? -1 : 1;
                var n = a[b + l];
                l += m;
                f = n & ((1 << -k) - 1);
                n >>= -k;
                k += h;
                for(; k > 0; f = f * 256 + a[b + l], l += m, k -= 8){}
                g = f & ((1 << -k) - 1);
                f >>= -k;
                k += d;
                for(; k > 0; g = g * 256 + a[b + l], l += m, k -= 8){}
                if (f === 0) {
                    f = 1 - j;
                } else if (f === i) {
                    return g ? NaN : (n ? -1 : 1) * Infinity;
                } else {
                    g = g + Math.pow(2, d);
                    f = f - j;
                }
                return (n ? -1 : 1) * g * Math.pow(2, f - d);
            };
            b.write = function(a, b, c, d, e, f) {
                var g, h, i;
                var j = f * 8 - e - 1;
                var k = (1 << j) - 1;
                var l = k >> 1;
                var m = e === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var n = d ? 0 : f - 1;
                var o = d ? 1 : -1;
                var p = b < 0 || (b === 0 && 1 / b < 0) ? 1 : 0;
                b = Math.abs(b);
                if (isNaN(b) || b === Infinity) {
                    h = isNaN(b) ? 1 : 0;
                    g = k;
                } else {
                    g = Math.floor(Math.log(b) / Math.LN2);
                    if (b * (i = Math.pow(2, -g)) < 1) {
                        g--;
                        i *= 2;
                    }
                    if (g + l >= 1) {
                        b += m / i;
                    } else {
                        b += m * Math.pow(2, 1 - l);
                    }
                    if (b * i >= 2) {
                        g++;
                        i /= 2;
                    }
                    if (g + l >= k) {
                        h = 0;
                        g = k;
                    } else if (g + l >= 1) {
                        h = (b * i - 1) * Math.pow(2, e);
                        g = g + l;
                    } else {
                        h = b * Math.pow(2, l - 1) * Math.pow(2, e);
                        g = 0;
                    }
                }
                for(; e >= 8; a[c + n] = h & 0xff, n += o, h /= 256, e -= 8){}
                g = (g << e) | h;
                j += e;
                for(; j > 0; a[c + n] = g & 0xff, n += o, g /= 256, j -= 8){}
                a[c + n - o] |= p * 128;
            };
        },
        7579: function() {},
        7326: function(a, b, c) {
            "use strict";
            c.d(b, {
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
        8852: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return f;
                }
            });
            var d = c(9611);
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
                    f = function a(b, c, e) {
                        var f = [
                            null
                        ];
                        f.push.apply(f, c);
                        var g = Function.bind.apply(b, f);
                        var h = new g();
                        if (e) (0, d.Z)(h, e.prototype);
                        return h;
                    };
                }
                return f.apply(null, arguments);
            }
        },
        7462: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d() {
                d = Object.assign || function(a) {
                    for(var b = 1; b < arguments.length; b++){
                        var c = arguments[b];
                        for(var d in c){
                            if (Object.prototype.hasOwnProperty.call(c, d)) {
                                a[d] = c[d];
                            }
                        }
                    }
                    return a;
                };
                return d.apply(this, arguments);
            }
        },
        136: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return e;
                }
            });
            var d = c(9611);
            function e(a, b) {
                if (typeof b !== "function" && b !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                Object.defineProperty(a, "prototype", {
                    value: Object.create(b && b.prototype, {
                        constructor: {
                            value: a,
                            writable: true,
                            configurable: true
                        }
                    }),
                    writable: false
                });
                if (b) (0, d.Z)(a, b);
            }
        },
        4578: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return e;
                }
            });
            var d = c(9611);
            function e(a, b) {
                a.prototype = Object.create(b.prototype);
                a.prototype.constructor = a;
                (0, d.Z)(a, b);
            }
        },
        9611: function(a, b, c) {
            "use strict";
            c.d(b, {
                Z: function() {
                    return d;
                }
            });
            function d(a, b) {
                d = Object.setPrototypeOf || function a(b, c) {
                    b.__proto__ = c;
                    return b;
                };
                return d(a, b);
            }
        }
    },
    function(a) {
        var b = function(b) {
            return a((a.s = b));
        };
        a.O(0, [
            544,
            774,
            888,
            179
        ], function() {
            return b(8581);
        });
        var c = a.O();
        _N_E = c;
    }, 
]);
