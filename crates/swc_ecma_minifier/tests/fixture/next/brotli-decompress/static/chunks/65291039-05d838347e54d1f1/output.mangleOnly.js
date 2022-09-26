"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        111
    ],
    {
        4201: (function(e, t, s) {
            s.d(t, {
                "Ue": function() {
                    return w;
                }
            });
            var r = s(8396);
            var n = s(4924);
            var a = s(655);
            var l = s(4063);
            var i = s(5915);
            var o = s(7055);
            var u = s(1478);
            var c = s(6313);
            var f = s(311);
            var h = s(7709);
            function d(e, t, s, r) {
                Object.defineProperty(e, t, {
                    get: s,
                    set: r,
                    enumerable: true,
                    configurable: true
                });
            }
            function m(e) {
                return e && e.__esModule ? e.default : e;
            }
            var p = {};
            d(p, "logErrors", ()=>g);
            d(p, "registerFormat", ()=>y);
            d(p, "create", ()=>w);
            d(p, "defaultLanguage", ()=>x);
            d(p, "setDefaultLanguage", ()=>v);
            let g = false;
            let b = [];
            function y(e) {
                b.push(e);
            }
            function w(e, t) {
                for(let s = 0; s < b.length; s++){
                    let n = b[s];
                    if (n.probe(e)) {
                        let a = new n(new (0, r.fT)(e));
                        if (t) return a.getFont(t);
                        return a;
                    }
                }
                throw new Error("Unknown font format");
            }
            let x = "en";
            function v(e = "en") {
                x = e;
            }
            function _(e, t, s) {
                if (s.get) {
                    let r = s.get;
                    s.get = function() {
                        let e = r.call(this);
                        Object.defineProperty(this, t, {
                            value: e
                        });
                        return e;
                    };
                } else if (typeof s.value === "function") {
                    let n = s.value;
                    return {
                        get () {
                            let e = new Map;
                            function s(...t) {
                                let s = t.length > 0 ? t[0] : "value";
                                if (e.has(s)) return e.get(s);
                                let r = n.apply(this, t);
                                e.set(s, r);
                                return r;
                            }
                            Object.defineProperty(this, t, {
                                value: s
                            });
                            return s;
                        }
                    };
                }
            }
            let L = new r.AU({
                firstCode: r.mL,
                entryCount: r.mL,
                idDelta: r.Af,
                idRangeOffset: r.mL
            });
            let C = new r.AU({
                startCharCode: r.U7,
                endCharCode: r.U7,
                glyphID: r.U7
            });
            let A = new r.AU({
                startUnicodeValue: r.Un,
                additionalCount: r.w_
            });
            let k = new r.AU({
                unicodeValue: r.Un,
                glyphID: r.mL
            });
            let S = new r.mJ(A, r.U7);
            let I = new r.mJ(k, r.U7);
            let P = new r.AU({
                varSelector: r.Un,
                defaultUVS: new r.$J(r.U7, S, {
                    type: "parent"
                }),
                nonDefaultUVS: new r.$J(r.U7, I, {
                    type: "parent"
                })
            });
            let U = new r.bS(r.mL, {
                0: {
                    length: r.mL,
                    language: r.mL,
                    codeMap: new r.pW(r.w_, 256)
                },
                2: {
                    length: r.mL,
                    language: r.mL,
                    subHeaderKeys: new r.mJ(r.mL, 256),
                    subHeaderCount: (e)=>Math.max.apply(Math, e.subHeaderKeys),
                    subHeaders: new r.pW(L, "subHeaderCount"),
                    glyphIndexArray: new r.pW(r.mL, "subHeaderCount")
                },
                4: {
                    length: r.mL,
                    language: r.mL,
                    segCountX2: r.mL,
                    segCount: (e)=>e.segCountX2 >> 1,
                    searchRange: r.mL,
                    entrySelector: r.mL,
                    rangeShift: r.mL,
                    endCode: new r.pW(r.mL, "segCount"),
                    reservedPad: new r.kV(r.mL),
                    startCode: new r.pW(r.mL, "segCount"),
                    idDelta: new r.pW(r.Af, "segCount"),
                    idRangeOffset: new r.pW(r.mL, "segCount"),
                    glyphIndexArray: new r.pW(r.mL, (e)=>(e.length - e._currentOffset) / 2)
                },
                6: {
                    length: r.mL,
                    language: r.mL,
                    firstCode: r.mL,
                    entryCount: r.mL,
                    glyphIndices: new r.pW(r.mL, "entryCount")
                },
                8: {
                    reserved: new r.kV(r.mL),
                    length: r.U7,
                    language: r.mL,
                    is32: new r.pW(r.w_, 8192),
                    nGroups: r.U7,
                    groups: new r.pW(C, "nGroups")
                },
                10: {
                    reserved: new r.kV(r.mL),
                    length: r.U7,
                    language: r.U7,
                    firstCode: r.U7,
                    entryCount: r.U7,
                    glyphIndices: new r.pW(r.mL, "numChars")
                },
                12: {
                    reserved: new r.kV(r.mL),
                    length: r.U7,
                    language: r.U7,
                    nGroups: r.U7,
                    groups: new r.pW(C, "nGroups")
                },
                13: {
                    reserved: new r.kV(r.mL),
                    length: r.U7,
                    language: r.U7,
                    nGroups: r.U7,
                    groups: new r.pW(C, "nGroups")
                },
                14: {
                    length: r.U7,
                    numRecords: r.U7,
                    varSelectors: new r.pW(P, "numRecords")
                }
            });
            let J = new r.AU({
                platformID: r.mL,
                encodingID: r.mL,
                table: new r.$J(r.U7, U, {
                    type: "parent",
                    lazy: true
                })
            });
            var T = new r.AU({
                version: r.mL,
                numSubtables: r.mL,
                tables: new r.mJ(J, "numSubtables")
            });
            var O = new r.AU({
                version: r.LB,
                revision: r.LB,
                checkSumAdjustment: r.U7,
                magicNumber: r.U7,
                flags: r.mL,
                unitsPerEm: r.mL,
                created: new r.mJ(r.LB, 2),
                modified: new r.mJ(r.LB, 2),
                xMin: r.Af,
                yMin: r.Af,
                xMax: r.Af,
                yMax: r.Af,
                macStyle: new r.DL(r.mL, [
                    "bold",
                    "italic",
                    "underline",
                    "outline",
                    "shadow",
                    "condensed",
                    "extended"
                ]),
                lowestRecPPEM: r.mL,
                fontDirectionHint: r.Af,
                indexToLocFormat: r.Af,
                glyphDataFormat: r.Af
            });
            var F = new r.AU({
                version: r.LB,
                ascent: r.Af,
                descent: r.Af,
                lineGap: r.Af,
                advanceWidthMax: r.mL,
                minLeftSideBearing: r.Af,
                minRightSideBearing: r.Af,
                xMaxExtent: r.Af,
                caretSlopeRise: r.Af,
                caretSlopeRun: r.Af,
                caretOffset: r.Af,
                reserved: new r.kV(r.Af, 4),
                metricDataFormat: r.Af,
                numberOfMetrics: r.mL
            });
            let D = new r.AU({
                advance: r.mL,
                bearing: r.Af
            });
            var M = new r.AU({
                metrics: new r.pW(D, (e)=>e.parent.hhea.numberOfMetrics),
                bearings: new r.pW(r.Af, (e)=>e.parent.maxp.numGlyphs - e.parent.hhea.numberOfMetrics)
            });
            var G = new r.AU({
                version: r.LB,
                numGlyphs: r.mL,
                maxPoints: r.mL,
                maxContours: r.mL,
                maxComponentPoints: r.mL,
                maxComponentContours: r.mL,
                maxZones: r.mL,
                maxTwilightPoints: r.mL,
                maxStorage: r.mL,
                maxFunctionDefs: r.mL,
                maxInstructionDefs: r.mL,
                maxStackElements: r.mL,
                maxSizeOfInstructions: r.mL,
                maxComponentElements: r.mL,
                maxComponentDepth: r.mL
            });
            function E(e, t, s = 0) {
                if (e === 1 && W[s]) return W[s];
                return N[e][t];
            }
            const B = new Set([
                "x-mac-roman",
                "x-mac-cyrillic",
                "iso-8859-6",
                "iso-8859-8"
            ]);
            const V = {
                "x-mac-croatian": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\u0160\u2122\xb4\xa8\u2260\u017D\xd8\u221E\xb1\u2264\u2265\u2206\xb5\u2202\u2211\u220F\u0161\u222B\xaa\xba\u03A9\u017E\xf8\xbf\xa1\xac\u221A\u0192\u2248\u0106\xab\u010C\u2026 \xc0\xc3\xd5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\uF8FF\xa9\u2044\u20AC\u2039\u203A\xc6\xbb\u2013\xb7\u201A\u201E\u2030\xc2\u0107\xc1\u010D\xc8\xcd\xce\xcf\xcc\xd3\xd4\u0111\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u03C0\xcb\u02DA\xb8\xca\xe6\u02C7",
                "x-mac-gaelic": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u1E02\xb1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xe6\xf8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xff\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xb7\u1EF2\u1EF3\u204A\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\u2663\xd2\xda\xdb\xd9\u0131\xdd\xfd\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83",
                "x-mac-greek": "\xc4\xb9\xb2\xc9\xb3\xd6\xdc\u0385\xe0\xe2\xe4\u0384\xa8\xe7\xe9\xe8\xea\xeb\xa3\u2122\xee\xef\u2022\xbd\u2030\xf4\xf6\xa6\u20AC\xf9\xfb\xfc\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xdf\xae\xa9\u03A3\u03AA\xa7\u2260\xb0\xb7\u0391\xb1\u2264\u2265\xa5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xac\u039F\u03A1\u2248\u03A4\xab\xbb\u2026 \u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xf7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xad",
                "x-mac-icelandic": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\xdd\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\xe6\xf8\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u2044\u20AC\xd0\xf0\xde\xfe\xfd\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7",
                "x-mac-inuit": "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xb0\u14A1\u14A5\u14A6\u2022\xb6\u14A7\xae\xa9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026 \u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142",
                "x-mac-ce": "\xc4\u0100\u0101\xc9\u0104\xd6\xdc\xe1\u0105\u010C\xe4\u010D\u0106\u0107\xe9\u0179\u017A\u010E\xed\u010F\u0112\u0113\u0116\xf3\u0117\xf4\xf6\xf5\xfa\u011A\u011B\xfc\u2020\xb0\u0118\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\u0119\xa8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xac\u221A\u0144\u0147\u2206\xab\xbb\u2026 \u0148\u0150\xd5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xc1\u0164\u0165\xcd\u017D\u017E\u016A\xd3\xd4\u016B\u016E\xda\u016F\u0170\u0171\u0172\u0173\xdd\xfd\u0137\u017B\u0141\u017C\u0122\u02C7",
                "x-mac-romanian": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\u0102\u0218\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\u0103\u0219\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7",
                "x-mac-turkish": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\xe6\xf8\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\uF8A0\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7"
            };
            const z = new Map();
            function R(e) {
                let t = z.get(e);
                if (t) return t;
                let s = V[e];
                if (s) {
                    let r = new Map();
                    for(let n = 0; n < s.length; n++)r.set(s.charCodeAt(n), 0x80 + n);
                    z.set(e, r);
                    return r;
                }
                if (B.has(e)) {
                    let a = new TextDecoder(e);
                    let l = new Uint8Array(0x80);
                    for(let i = 0; i < 0x80; i++)l[i] = 0x80 + i;
                    let o = new Map();
                    let u = a.decode(l);
                    for(let c = 0; c < 0x80; c++)o.set(u.charCodeAt(c), 0x80 + c);
                    z.set(e, o);
                    return o;
                }
            }
            const N = [
                [
                    "utf16be",
                    "utf16be",
                    "utf16be",
                    "utf16be",
                    "utf16be",
                    "utf16be"
                ],
                [
                    "x-mac-roman",
                    "shift-jis",
                    "big5",
                    "euc-kr",
                    "iso-8859-6",
                    "iso-8859-8",
                    "x-mac-greek",
                    "x-mac-cyrillic",
                    "x-mac-symbol",
                    "x-mac-devanagari",
                    "x-mac-gurmukhi",
                    "x-mac-gujarati",
                    "Oriya",
                    "Bengali",
                    "Tamil",
                    "Telugu",
                    "Kannada",
                    "Malayalam",
                    "Sinhalese",
                    "Burmese",
                    "Khmer",
                    "iso-8859-11",
                    "Laotian",
                    "Georgian",
                    "Armenian",
                    "hz-gb-2312",
                    "Tibetan",
                    "Mongolian",
                    "Geez",
                    "x-mac-ce",
                    "Vietnamese",
                    "Sindhi"
                ],
                [
                    "ascii"
                ],
                [
                    "symbol",
                    "utf16be",
                    "shift-jis",
                    "gb18030",
                    "big5",
                    "x-cp20949",
                    "johab",
                    null,
                    null,
                    null,
                    "utf16be"
                ]
            ];
            const W = {
                15: "x-mac-icelandic",
                17: "x-mac-turkish",
                18: "x-mac-croatian",
                24: "x-mac-ce",
                25: "x-mac-ce",
                26: "x-mac-ce",
                27: "x-mac-ce",
                28: "x-mac-ce",
                30: "x-mac-icelandic",
                37: "x-mac-romanian",
                38: "x-mac-ce",
                39: "x-mac-ce",
                40: "x-mac-ce",
                143: "x-mac-inuit",
                146: "x-mac-gaelic"
            };
            const X = [
                [],
                {
                    0: "en",
                    30: "fo",
                    60: "ks",
                    90: "rw",
                    1: "fr",
                    31: "fa",
                    61: "ku",
                    91: "rn",
                    2: "de",
                    32: "ru",
                    62: "sd",
                    92: "ny",
                    3: "it",
                    33: "zh",
                    63: "bo",
                    93: "mg",
                    4: "nl",
                    34: "nl-BE",
                    64: "ne",
                    94: "eo",
                    5: "sv",
                    35: "ga",
                    65: "sa",
                    128: "cy",
                    6: "es",
                    36: "sq",
                    66: "mr",
                    129: "eu",
                    7: "da",
                    37: "ro",
                    67: "bn",
                    130: "ca",
                    8: "pt",
                    38: "cz",
                    68: "as",
                    131: "la",
                    9: "no",
                    39: "sk",
                    69: "gu",
                    132: "qu",
                    10: "he",
                    40: "si",
                    70: "pa",
                    133: "gn",
                    11: "ja",
                    41: "yi",
                    71: "or",
                    134: "ay",
                    12: "ar",
                    42: "sr",
                    72: "ml",
                    135: "tt",
                    13: "fi",
                    43: "mk",
                    73: "kn",
                    136: "ug",
                    14: "el",
                    44: "bg",
                    74: "ta",
                    137: "dz",
                    15: "is",
                    45: "uk",
                    75: "te",
                    138: "jv",
                    16: "mt",
                    46: "be",
                    76: "si",
                    139: "su",
                    17: "tr",
                    47: "uz",
                    77: "my",
                    140: "gl",
                    18: "hr",
                    48: "kk",
                    78: "km",
                    141: "af",
                    19: "zh-Hant",
                    49: "az-Cyrl",
                    79: "lo",
                    142: "br",
                    20: "ur",
                    50: "az-Arab",
                    80: "vi",
                    143: "iu",
                    21: "hi",
                    51: "hy",
                    81: "id",
                    144: "gd",
                    22: "th",
                    52: "ka",
                    82: "tl",
                    145: "gv",
                    23: "ko",
                    53: "mo",
                    83: "ms",
                    146: "ga",
                    24: "lt",
                    54: "ky",
                    84: "ms-Arab",
                    147: "to",
                    25: "pl",
                    55: "tg",
                    85: "am",
                    148: "el-polyton",
                    26: "hu",
                    56: "tk",
                    86: "ti",
                    149: "kl",
                    27: "es",
                    57: "mn-CN",
                    87: "om",
                    150: "az",
                    28: "lv",
                    58: "mn",
                    88: "so",
                    151: "nn",
                    29: "se",
                    59: "ps",
                    89: "sw"
                },
                [],
                {
                    0x0436: "af",
                    0x4009: "en-IN",
                    0x0487: "rw",
                    0x0432: "tn",
                    0x041C: "sq",
                    0x1809: "en-IE",
                    0x0441: "sw",
                    0x045B: "si",
                    0x0484: "gsw",
                    0x2009: "en-JM",
                    0x0457: "kok",
                    0x041B: "sk",
                    0x045E: "am",
                    0x4409: "en-MY",
                    0x0412: "ko",
                    0x0424: "sl",
                    0x1401: "ar-DZ",
                    0x1409: "en-NZ",
                    0x0440: "ky",
                    0x2C0A: "es-AR",
                    0x3C01: "ar-BH",
                    0x3409: "en-PH",
                    0x0454: "lo",
                    0x400A: "es-BO",
                    0x0C01: "ar",
                    0x4809: "en-SG",
                    0x0426: "lv",
                    0x340A: "es-CL",
                    0x0801: "ar-IQ",
                    0x1C09: "en-ZA",
                    0x0427: "lt",
                    0x240A: "es-CO",
                    0x2C01: "ar-JO",
                    0x2C09: "en-TT",
                    0x082E: "dsb",
                    0x140A: "es-CR",
                    0x3401: "ar-KW",
                    0x0809: "en-GB",
                    0x046E: "lb",
                    0x1C0A: "es-DO",
                    0x3001: "ar-LB",
                    0x0409: "en",
                    0x042F: "mk",
                    0x300A: "es-EC",
                    0x1001: "ar-LY",
                    0x3009: "en-ZW",
                    0x083E: "ms-BN",
                    0x440A: "es-SV",
                    0x1801: "ary",
                    0x0425: "et",
                    0x043E: "ms",
                    0x100A: "es-GT",
                    0x2001: "ar-OM",
                    0x0438: "fo",
                    0x044C: "ml",
                    0x480A: "es-HN",
                    0x4001: "ar-QA",
                    0x0464: "fil",
                    0x043A: "mt",
                    0x080A: "es-MX",
                    0x0401: "ar-SA",
                    0x040B: "fi",
                    0x0481: "mi",
                    0x4C0A: "es-NI",
                    0x2801: "ar-SY",
                    0x080C: "fr-BE",
                    0x047A: "arn",
                    0x180A: "es-PA",
                    0x1C01: "aeb",
                    0x0C0C: "fr-CA",
                    0x044E: "mr",
                    0x3C0A: "es-PY",
                    0x3801: "ar-AE",
                    0x040C: "fr",
                    0x047C: "moh",
                    0x280A: "es-PE",
                    0x2401: "ar-YE",
                    0x140C: "fr-LU",
                    0x0450: "mn",
                    0x500A: "es-PR",
                    0x042B: "hy",
                    0x180C: "fr-MC",
                    0x0850: "mn-CN",
                    0x0C0A: "es",
                    0x044D: "as",
                    0x100C: "fr-CH",
                    0x0461: "ne",
                    0x040A: "es",
                    0x082C: "az-Cyrl",
                    0x0462: "fy",
                    0x0414: "nb",
                    0x540A: "es-US",
                    0x042C: "az",
                    0x0456: "gl",
                    0x0814: "nn",
                    0x380A: "es-UY",
                    0x046D: "ba",
                    0x0437: "ka",
                    0x0482: "oc",
                    0x200A: "es-VE",
                    0x042D: "eu",
                    0x0C07: "de-AT",
                    0x0448: "or",
                    0x081D: "sv-FI",
                    0x0423: "be",
                    0x0407: "de",
                    0x0463: "ps",
                    0x041D: "sv",
                    0x0845: "bn",
                    0x1407: "de-LI",
                    0x0415: "pl",
                    0x045A: "syr",
                    0x0445: "bn-IN",
                    0x1007: "de-LU",
                    0x0416: "pt",
                    0x0428: "tg",
                    0x201A: "bs-Cyrl",
                    0x0807: "de-CH",
                    0x0816: "pt-PT",
                    0x085F: "tzm",
                    0x141A: "bs",
                    0x0408: "el",
                    0x0446: "pa",
                    0x0449: "ta",
                    0x047E: "br",
                    0x046F: "kl",
                    0x046B: "qu-BO",
                    0x0444: "tt",
                    0x0402: "bg",
                    0x0447: "gu",
                    0x086B: "qu-EC",
                    0x044A: "te",
                    0x0403: "ca",
                    0x0468: "ha",
                    0x0C6B: "qu",
                    0x041E: "th",
                    0x0C04: "zh-HK",
                    0x040D: "he",
                    0x0418: "ro",
                    0x0451: "bo",
                    0x1404: "zh-MO",
                    0x0439: "hi",
                    0x0417: "rm",
                    0x041F: "tr",
                    0x0804: "zh",
                    0x040E: "hu",
                    0x0419: "ru",
                    0x0442: "tk",
                    0x1004: "zh-SG",
                    0x040F: "is",
                    0x243B: "smn",
                    0x0480: "ug",
                    0x0404: "zh-TW",
                    0x0470: "ig",
                    0x103B: "smj-NO",
                    0x0422: "uk",
                    0x0483: "co",
                    0x0421: "id",
                    0x143B: "smj",
                    0x042E: "hsb",
                    0x041A: "hr",
                    0x045D: "iu",
                    0x0C3B: "se-FI",
                    0x0420: "ur",
                    0x101A: "hr-BA",
                    0x085D: "iu-Latn",
                    0x043B: "se",
                    0x0843: "uz-Cyrl",
                    0x0405: "cs",
                    0x083C: "ga",
                    0x083B: "se-SE",
                    0x0443: "uz",
                    0x0406: "da",
                    0x0434: "xh",
                    0x203B: "sms",
                    0x042A: "vi",
                    0x048C: "prs",
                    0x0435: "zu",
                    0x183B: "sma-NO",
                    0x0452: "cy",
                    0x0465: "dv",
                    0x0410: "it",
                    0x1C3B: "sms",
                    0x0488: "wo",
                    0x0813: "nl-BE",
                    0x0810: "it-CH",
                    0x044F: "sa",
                    0x0485: "sah",
                    0x0413: "nl",
                    0x0411: "ja",
                    0x1C1A: "sr-Cyrl-BA",
                    0x0478: "ii",
                    0x0C09: "en-AU",
                    0x044B: "kn",
                    0x0C1A: "sr",
                    0x046A: "yo",
                    0x2809: "en-BZ",
                    0x043F: "kk",
                    0x181A: "sr-Latn-BA",
                    0x1009: "en-CA",
                    0x0453: "km",
                    0x081A: "sr-Latn",
                    0x2409: "en-029",
                    0x0486: "quc",
                    0x046C: "nso"
                }
            ];
            let q = new r.AU({
                platformID: r.mL,
                encodingID: r.mL,
                languageID: r.mL,
                nameID: r.mL,
                length: r.mL,
                string: new r.$J(r.mL, new r.Ld("length", (e)=>(0, E)(e.platformID, e.encodingID, e.languageID)), {
                    type: "parent",
                    relativeTo: (e)=>e.parent.stringOffset,
                    allowNull: false
                })
            });
            let H = new r.AU({
                length: r.mL,
                tag: new r.$J(r.mL, new r.Ld("length", "utf16be"), {
                    type: "parent",
                    relativeTo: (e)=>e.stringOffset
                })
            });
            var j = new r.bS(r.mL, {
                0: {
                    count: r.mL,
                    stringOffset: r.mL,
                    records: new r.mJ(q, "count")
                },
                1: {
                    count: r.mL,
                    stringOffset: r.mL,
                    records: new r.mJ(q, "count"),
                    langTagCount: r.mL,
                    langTags: new r.mJ(H, "langTagCount")
                }
            });
            var Y = j;
            const $ = [
                "copyright",
                "fontFamily",
                "fontSubfamily",
                "uniqueSubfamily",
                "fullName",
                "version",
                "postscriptName",
                "trademark",
                "manufacturer",
                "designer",
                "description",
                "vendorURL",
                "designerURL",
                "license",
                "licenseURL",
                null,
                "preferredFamily",
                "preferredSubfamily",
                "compatibleFull",
                "sampleText",
                "postscriptCIDFontName",
                "wwsFamilyName",
                "wwsSubfamilyName"
            ];
            j.process = function(e) {
                var t = {};
                for (let s of this.records){
                    let r = (0, X)[s.platformID][s.languageID];
                    if (r == null && this.langTags != null && s.languageID >= 0x8000) r = this.langTags[s.languageID - 0x8000].tag;
                    if (r == null) r = s.platformID + "-" + s.languageID;
                    let n = s.nameID >= 256 ? "fontFeatures" : $[s.nameID] || s.nameID;
                    if (t[n] == null) t[n] = {};
                    let a = t[n];
                    if (s.nameID >= 256) a = a[s.nameID] || (a[s.nameID] = {});
                    if (typeof s.string === "string" || typeof a[r] !== "string") a[r] = s.string;
                }
                this.records = t;
            };
            j.preEncode = function() {
                if (Array.isArray(this.records)) return;
                this.version = 0;
                let e = [];
                for(let t in this.records){
                    let s = this.records[t];
                    if (t === "fontFeatures") continue;
                    e.push({
                        platformID: 3,
                        encodingID: 1,
                        languageID: 0x409,
                        nameID: $.indexOf(t),
                        length: s.en.length * 2,
                        string: s.en
                    });
                    if (t === "postscriptName") e.push({
                        platformID: 1,
                        encodingID: 0,
                        languageID: 0,
                        nameID: $.indexOf(t),
                        length: s.en.length,
                        string: s.en
                    });
                }
                this.records = e;
                this.count = e.length;
                this.stringOffset = j.size(this, null, false);
            };
            var Z = new r.bS(r.mL, {
                header: {
                    xAvgCharWidth: r.Af,
                    usWeightClass: r.mL,
                    usWidthClass: r.mL,
                    fsType: new r.DL(r.mL, [
                        null,
                        "noEmbedding",
                        "viewOnly",
                        "editable",
                        null,
                        null,
                        null,
                        null,
                        "noSubsetting",
                        "bitmapOnly"
                    ]),
                    ySubscriptXSize: r.Af,
                    ySubscriptYSize: r.Af,
                    ySubscriptXOffset: r.Af,
                    ySubscriptYOffset: r.Af,
                    ySuperscriptXSize: r.Af,
                    ySuperscriptYSize: r.Af,
                    ySuperscriptXOffset: r.Af,
                    ySuperscriptYOffset: r.Af,
                    yStrikeoutSize: r.Af,
                    yStrikeoutPosition: r.Af,
                    sFamilyClass: r.Af,
                    panose: new r.mJ(r.w_, 10),
                    ulCharRange: new r.mJ(r.U7, 4),
                    vendorID: new r.Ld(4),
                    fsSelection: new r.DL(r.mL, [
                        "italic",
                        "underscore",
                        "negative",
                        "outlined",
                        "strikeout",
                        "bold",
                        "regular",
                        "useTypoMetrics",
                        "wws",
                        "oblique"
                    ]),
                    usFirstCharIndex: r.mL,
                    usLastCharIndex: r.mL
                },
                0: {},
                1: {
                    typoAscender: r.Af,
                    typoDescender: r.Af,
                    typoLineGap: r.Af,
                    winAscent: r.mL,
                    winDescent: r.mL,
                    codePageRange: new r.mJ(r.U7, 2)
                },
                2: {
                    typoAscender: r.Af,
                    typoDescender: r.Af,
                    typoLineGap: r.Af,
                    winAscent: r.mL,
                    winDescent: r.mL,
                    codePageRange: new r.mJ(r.U7, 2),
                    xHeight: r.Af,
                    capHeight: r.Af,
                    defaultChar: r.mL,
                    breakChar: r.mL,
                    maxContent: r.mL
                },
                5: {
                    typoAscender: r.Af,
                    typoDescender: r.Af,
                    typoLineGap: r.Af,
                    winAscent: r.mL,
                    winDescent: r.mL,
                    codePageRange: new r.mJ(r.U7, 2),
                    xHeight: r.Af,
                    capHeight: r.Af,
                    defaultChar: r.mL,
                    breakChar: r.mL,
                    maxContent: r.mL,
                    usLowerOpticalPointSize: r.mL,
                    usUpperOpticalPointSize: r.mL
                }
            });
            let K = Z.versions;
            K[3] = K[4] = K[2];
            var Q = Z;
            var ee = new r.bS(r.E2, {
                header: {
                    italicAngle: r.E2,
                    underlinePosition: r.Af,
                    underlineThickness: r.Af,
                    isFixedPitch: r.U7,
                    minMemType42: r.U7,
                    maxMemType42: r.U7,
                    minMemType1: r.U7,
                    maxMemType1: r.U7
                },
                1: {},
                2: {
                    numberOfGlyphs: r.mL,
                    glyphNameIndex: new r.mJ(r.mL, "numberOfGlyphs"),
                    names: new r.mJ(new r.Ld(r.w_))
                },
                2.5: {
                    numberOfGlyphs: r.mL,
                    offsets: new r.mJ(r.w_, "numberOfGlyphs")
                },
                3: {},
                4: {
                    map: new r.mJ(r.U7, (e)=>e.parent.maxp.numGlyphs)
                }
            });
            var et = new r.AU({
                controlValues: new r.mJ(r.Af)
            });
            var es = new r.AU({
                instructions: new r.mJ(r.w_)
            });
            let er = new r.bS("head.indexToLocFormat", {
                0: {
                    offsets: new r.mJ(r.mL)
                },
                1: {
                    offsets: new r.mJ(r.U7)
                }
            });
            er.process = function() {
                if (this.version === 0 && !this._processed) {
                    for(let e = 0; e < this.offsets.length; e++)this.offsets[e] <<= 1;
                    this._processed = true;
                }
            };
            er.preEncode = function() {
                if (this.version === 0 && this._processed !== false) {
                    for(let e = 0; e < this.offsets.length; e++)this.offsets[e] >>>= 1;
                    this._processed = false;
                }
            };
            var en = er;
            var ea = new r.AU({
                controlValueProgram: new r.mJ(r.w_)
            });
            var el = new r.mJ(new r.lW);
            class ei {
                getCFFVersion(e) {
                    while(e && !e.hdrSize)e = e.parent;
                    return e ? e.version : -1;
                }
                decode(e, t) {
                    let s = this.getCFFVersion(t);
                    let n = s >= 2 ? e.readUInt32BE() : e.readUInt16BE();
                    if (n === 0) return [];
                    let a = e.readUInt8();
                    let l;
                    if (a === 1) l = r.w_;
                    else if (a === 2) l = r.mL;
                    else if (a === 3) l = r.Un;
                    else if (a === 4) l = r.U7;
                    else throw new Error(`Bad offset size in CFFIndex: ${a} ${e.pos}`);
                    let i = [];
                    let o = e.pos + (n + 1) * a - 1;
                    let u = l.decode(e);
                    for(let c = 0; c < n; c++){
                        let f = l.decode(e);
                        if (this.type != null) {
                            let h = e.pos;
                            e.pos = o + u;
                            t.length = f - u;
                            i.push(this.type.decode(e, t));
                            e.pos = h;
                        } else i.push({
                            offset: o + u,
                            length: f - u
                        });
                        u = f;
                    }
                    e.pos = o + u;
                    return i;
                }
                size(e, t) {
                    let s = 2;
                    if (e.length === 0) return s;
                    let n = this.type || new r.lW;
                    let a = 1;
                    for(let l = 0; l < e.length; l++){
                        let i = e[l];
                        a += n.size(i, t);
                    }
                    let o;
                    if (a <= 0xff) o = r.w_;
                    else if (a <= 0xffff) o = r.mL;
                    else if (a <= 0xffffff) o = r.Un;
                    else if (a <= 0xffffffff) o = r.U7;
                    else throw new Error("Bad offset in CFFIndex");
                    s += 1 + o.size() * (e.length + 1);
                    s += a - 1;
                    return s;
                }
                encode(e, t, s) {
                    e.writeUInt16BE(t.length);
                    if (t.length === 0) return;
                    let n = this.type || new r.lW;
                    let a = [];
                    let l = 1;
                    for (let i of t){
                        let o = n.size(i, s);
                        a.push(o);
                        l += o;
                    }
                    let u;
                    if (l <= 0xff) u = r.w_;
                    else if (l <= 0xffff) u = r.mL;
                    else if (l <= 0xffffff) u = r.Un;
                    else if (l <= 0xffffffff) u = r.U7;
                    else throw new Error("Bad offset in CFFIndex");
                    e.writeUInt8(u.size());
                    l = 1;
                    u.encode(e, l);
                    for (let c of a){
                        l += c;
                        u.encode(e, l);
                    }
                    for (let f of t)n.encode(e, f, s);
                    return;
                }
                constructor(e){
                    this.type = e;
                }
            }
            const eo = 0xf;
            const eu = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                "E",
                "E-",
                null,
                "-"
            ];
            const ec = {
                ".": 10,
                "E": 11,
                "E-": 12,
                "-": 14
            };
            class ef {
                static decode(e, t) {
                    if (32 <= t && t <= 246) return t - 139;
                    if (247 <= t && t <= 250) return (t - 247) * 256 + e.readUInt8() + 108;
                    if (251 <= t && t <= 254) return -(t - 251) * 256 - e.readUInt8() - 108;
                    if (t === 28) return e.readInt16BE();
                    if (t === 29) return e.readInt32BE();
                    if (t === 30) {
                        let s = "";
                        while(true){
                            let r = e.readUInt8();
                            let n = r >> 4;
                            if (n === eo) break;
                            s += eu[n];
                            let a = r & 15;
                            if (a === eo) break;
                            s += eu[a];
                        }
                        return parseFloat(s);
                    }
                    return null;
                }
                static size(e) {
                    if (e.forceLarge) e = 32768;
                    if ((e | 0) !== e) {
                        let t = "" + e;
                        return 1 + Math.ceil((t.length + 1) / 2);
                    } else if (-107 <= e && e <= 107) return 1;
                    else if (108 <= e && e <= 1131 || -1131 <= e && e <= -108) return 2;
                    else if (-32768 <= e && e <= 32767) return 3;
                    else return 5;
                }
                static encode(e, t) {
                    let s = Number(t);
                    if (t.forceLarge) {
                        e.writeUInt8(29);
                        return e.writeInt32BE(s);
                    } else if ((s | 0) !== s) {
                        e.writeUInt8(30);
                        let r = "" + s;
                        for(let n = 0; n < r.length; n += 2){
                            let a = r[n];
                            let l = ec[a] || +a;
                            if (n === r.length - 1) var i = eo;
                            else {
                                let o = r[n + 1];
                                var i = ec[o] || +o;
                            }
                            e.writeUInt8(l << 4 | i & 15);
                        }
                        if (i !== eo) return e.writeUInt8(eo << 4);
                    } else if (-107 <= s && s <= 107) return e.writeUInt8(s + 139);
                    else if (108 <= s && s <= 1131) {
                        s -= 108;
                        e.writeUInt8((s >> 8) + 247);
                        return e.writeUInt8(s & 0xff);
                    } else if (-1131 <= s && s <= -108) {
                        s = -s - 108;
                        e.writeUInt8((s >> 8) + 251);
                        return e.writeUInt8(s & 0xff);
                    } else if (-32768 <= s && s <= 32767) {
                        e.writeUInt8(28);
                        return e.writeInt16BE(s);
                    } else {
                        e.writeUInt8(29);
                        return e.writeInt32BE(s);
                    }
                }
            }
            class eh {
                decodeOperands(e, t, s, r) {
                    if (Array.isArray(e)) return r.map((r, n)=>this.decodeOperands(e[n], t, s, [
                            r
                        ]));
                    else if (e.decode != null) return e.decode(t, s, r);
                    else switch(e){
                        case "number":
                        case "offset":
                        case "sid":
                            return r[0];
                        case "boolean":
                            return !!r[0];
                        default:
                            return r;
                    }
                }
                encodeOperands(e, t, s, r) {
                    if (Array.isArray(e)) return r.map((r, n)=>this.encodeOperands(e[n], t, s, r)[0]);
                    else if (e.encode != null) return e.encode(t, r, s);
                    else if (typeof r === "number") return [
                        r
                    ];
                    else if (typeof r === "boolean") return [
                        +r
                    ];
                    else if (Array.isArray(r)) return r;
                    else return [
                        r
                    ];
                }
                decode(e, t) {
                    let s = e.pos + t.length;
                    let n = {};
                    let a = [];
                    Object.defineProperties(n, {
                        parent: {
                            value: t
                        },
                        _startOffset: {
                            value: e.pos
                        }
                    });
                    for(let l in this.fields){
                        let i = this.fields[l];
                        n[i[1]] = i[3];
                    }
                    while(e.pos < s){
                        let o = e.readUInt8();
                        if (o < 28) {
                            if (o === 12) o = o << 8 | e.readUInt8();
                            let u = this.fields[o];
                            if (!u) throw new Error(`Unknown operator ${o}`);
                            let c = this.decodeOperands(u[2], e, n, a);
                            if (c != null) {
                                if (c instanceof (0, r.c5)) Object.defineProperty(n, u[1], c);
                                else n[u[1]] = c;
                            }
                            a = [];
                        } else a.push((0, ef).decode(e, o));
                    }
                    return n;
                }
                size(e, t, s = true) {
                    let r = {
                        parent: t,
                        val: e,
                        pointerSize: 0,
                        startOffset: t.startOffset || 0
                    };
                    let n = 0;
                    for(let a in this.fields){
                        let i = this.fields[a];
                        let o = e[i[1]];
                        if (o == null || (0, l)(o, i[3])) continue;
                        let u = this.encodeOperands(i[2], null, r, o);
                        for (let c of u)n += (0, ef).size(c);
                        let f = Array.isArray(i[0]) ? i[0] : [
                            i[0]
                        ];
                        n += f.length;
                    }
                    if (s) n += r.pointerSize;
                    return n;
                }
                encode(e, t, s) {
                    let r = {
                        pointers: [],
                        startOffset: e.pos,
                        parent: s,
                        val: t,
                        pointerSize: 0
                    };
                    r.pointerOffset = e.pos + this.size(t, r, false);
                    for (let n of this.ops){
                        let a = t[n[1]];
                        if (a == null || (0, l)(a, n[3])) continue;
                        let i = this.encodeOperands(n[2], e, r, a);
                        for (let o of i)(0, ef).encode(e, o);
                        let u = Array.isArray(n[0]) ? n[0] : [
                            n[0]
                        ];
                        for (let c of u)e.writeUInt8(c);
                    }
                    let f = 0;
                    while(f < r.pointers.length){
                        let h = r.pointers[f++];
                        h.type.encode(e, h.val, h.parent);
                    }
                    return;
                }
                constructor(e = []){
                    this.ops = e;
                    this.fields = {};
                    for (let t of e){
                        let s = Array.isArray(t[0]) ? t[0][0] << 8 | t[0][1] : t[0];
                        this.fields[s] = t;
                    }
                }
            }
            class ed extends r.$J {
                decode(e, t, s) {
                    this.offsetType = {
                        decode: ()=>s[0]
                    };
                    return super.decode(e, t, s);
                }
                encode(e, t, s) {
                    if (!e) {
                        this.offsetType = {
                            size: ()=>0
                        };
                        this.size(t, s);
                        return [
                            new em(0)
                        ];
                    }
                    let r = null;
                    this.offsetType = {
                        encode: (e, t)=>r = t
                    };
                    super.encode(e, t, s);
                    return [
                        new em(r)
                    ];
                }
                constructor(e, t = {}){
                    if (t.type == null) t.type = "global";
                    super(null, e, t);
                }
            }
            class em {
                valueOf() {
                    return this.val;
                }
                constructor(e){
                    this.val = e;
                    this.forceLarge = true;
                }
            }
            class ep {
                static decode(e, t, s) {
                    let r = s.pop();
                    while(s.length > r)s.pop();
                }
            }
            var eg = new (0, eh)([
                [
                    6,
                    "BlueValues",
                    "delta",
                    null
                ],
                [
                    7,
                    "OtherBlues",
                    "delta",
                    null
                ],
                [
                    8,
                    "FamilyBlues",
                    "delta",
                    null
                ],
                [
                    9,
                    "FamilyOtherBlues",
                    "delta",
                    null
                ],
                [
                    [
                        12,
                        9
                    ],
                    "BlueScale",
                    "number",
                    0.039625
                ],
                [
                    [
                        12,
                        10
                    ],
                    "BlueShift",
                    "number",
                    7
                ],
                [
                    [
                        12,
                        11
                    ],
                    "BlueFuzz",
                    "number",
                    1
                ],
                [
                    10,
                    "StdHW",
                    "number",
                    null
                ],
                [
                    11,
                    "StdVW",
                    "number",
                    null
                ],
                [
                    [
                        12,
                        12
                    ],
                    "StemSnapH",
                    "delta",
                    null
                ],
                [
                    [
                        12,
                        13
                    ],
                    "StemSnapV",
                    "delta",
                    null
                ],
                [
                    [
                        12,
                        14
                    ],
                    "ForceBold",
                    "boolean",
                    false
                ],
                [
                    [
                        12,
                        17
                    ],
                    "LanguageGroup",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        18
                    ],
                    "ExpansionFactor",
                    "number",
                    0.06
                ],
                [
                    [
                        12,
                        19
                    ],
                    "initialRandomSeed",
                    "number",
                    0
                ],
                [
                    20,
                    "defaultWidthX",
                    "number",
                    0
                ],
                [
                    21,
                    "nominalWidthX",
                    "number",
                    0
                ],
                [
                    22,
                    "vsindex",
                    "number",
                    0
                ],
                [
                    23,
                    "blend",
                    ep,
                    null
                ],
                [
                    19,
                    "Subrs",
                    new (0, ed)(new (0, ei), {
                        type: "local"
                    }),
                    null
                ]
            ]);
            var eb = [
                ".notdef",
                "space",
                "exclam",
                "quotedbl",
                "numbersign",
                "dollar",
                "percent",
                "ampersand",
                "quoteright",
                "parenleft",
                "parenright",
                "asterisk",
                "plus",
                "comma",
                "hyphen",
                "period",
                "slash",
                "zero",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine",
                "colon",
                "semicolon",
                "less",
                "equal",
                "greater",
                "question",
                "at",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "bracketleft",
                "backslash",
                "bracketright",
                "asciicircum",
                "underscore",
                "quoteleft",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "braceleft",
                "bar",
                "braceright",
                "asciitilde",
                "exclamdown",
                "cent",
                "sterling",
                "fraction",
                "yen",
                "florin",
                "section",
                "currency",
                "quotesingle",
                "quotedblleft",
                "guillemotleft",
                "guilsinglleft",
                "guilsinglright",
                "fi",
                "fl",
                "endash",
                "dagger",
                "daggerdbl",
                "periodcentered",
                "paragraph",
                "bullet",
                "quotesinglbase",
                "quotedblbase",
                "quotedblright",
                "guillemotright",
                "ellipsis",
                "perthousand",
                "questiondown",
                "grave",
                "acute",
                "circumflex",
                "tilde",
                "macron",
                "breve",
                "dotaccent",
                "dieresis",
                "ring",
                "cedilla",
                "hungarumlaut",
                "ogonek",
                "caron",
                "emdash",
                "AE",
                "ordfeminine",
                "Lslash",
                "Oslash",
                "OE",
                "ordmasculine",
                "ae",
                "dotlessi",
                "lslash",
                "oslash",
                "oe",
                "germandbls",
                "onesuperior",
                "logicalnot",
                "mu",
                "trademark",
                "Eth",
                "onehalf",
                "plusminus",
                "Thorn",
                "onequarter",
                "divide",
                "brokenbar",
                "degree",
                "thorn",
                "threequarters",
                "twosuperior",
                "registered",
                "minus",
                "eth",
                "multiply",
                "threesuperior",
                "copyright",
                "Aacute",
                "Acircumflex",
                "Adieresis",
                "Agrave",
                "Aring",
                "Atilde",
                "Ccedilla",
                "Eacute",
                "Ecircumflex",
                "Edieresis",
                "Egrave",
                "Iacute",
                "Icircumflex",
                "Idieresis",
                "Igrave",
                "Ntilde",
                "Oacute",
                "Ocircumflex",
                "Odieresis",
                "Ograve",
                "Otilde",
                "Scaron",
                "Uacute",
                "Ucircumflex",
                "Udieresis",
                "Ugrave",
                "Yacute",
                "Ydieresis",
                "Zcaron",
                "aacute",
                "acircumflex",
                "adieresis",
                "agrave",
                "aring",
                "atilde",
                "ccedilla",
                "eacute",
                "ecircumflex",
                "edieresis",
                "egrave",
                "iacute",
                "icircumflex",
                "idieresis",
                "igrave",
                "ntilde",
                "oacute",
                "ocircumflex",
                "odieresis",
                "ograve",
                "otilde",
                "scaron",
                "uacute",
                "ucircumflex",
                "udieresis",
                "ugrave",
                "yacute",
                "ydieresis",
                "zcaron",
                "exclamsmall",
                "Hungarumlautsmall",
                "dollaroldstyle",
                "dollarsuperior",
                "ampersandsmall",
                "Acutesmall",
                "parenleftsuperior",
                "parenrightsuperior",
                "twodotenleader",
                "onedotenleader",
                "zerooldstyle",
                "oneoldstyle",
                "twooldstyle",
                "threeoldstyle",
                "fouroldstyle",
                "fiveoldstyle",
                "sixoldstyle",
                "sevenoldstyle",
                "eightoldstyle",
                "nineoldstyle",
                "commasuperior",
                "threequartersemdash",
                "periodsuperior",
                "questionsmall",
                "asuperior",
                "bsuperior",
                "centsuperior",
                "dsuperior",
                "esuperior",
                "isuperior",
                "lsuperior",
                "msuperior",
                "nsuperior",
                "osuperior",
                "rsuperior",
                "ssuperior",
                "tsuperior",
                "ff",
                "ffi",
                "ffl",
                "parenleftinferior",
                "parenrightinferior",
                "Circumflexsmall",
                "hyphensuperior",
                "Gravesmall",
                "Asmall",
                "Bsmall",
                "Csmall",
                "Dsmall",
                "Esmall",
                "Fsmall",
                "Gsmall",
                "Hsmall",
                "Ismall",
                "Jsmall",
                "Ksmall",
                "Lsmall",
                "Msmall",
                "Nsmall",
                "Osmall",
                "Psmall",
                "Qsmall",
                "Rsmall",
                "Ssmall",
                "Tsmall",
                "Usmall",
                "Vsmall",
                "Wsmall",
                "Xsmall",
                "Ysmall",
                "Zsmall",
                "colonmonetary",
                "onefitted",
                "rupiah",
                "Tildesmall",
                "exclamdownsmall",
                "centoldstyle",
                "Lslashsmall",
                "Scaronsmall",
                "Zcaronsmall",
                "Dieresissmall",
                "Brevesmall",
                "Caronsmall",
                "Dotaccentsmall",
                "Macronsmall",
                "figuredash",
                "hypheninferior",
                "Ogoneksmall",
                "Ringsmall",
                "Cedillasmall",
                "questiondownsmall",
                "oneeighth",
                "threeeighths",
                "fiveeighths",
                "seveneighths",
                "onethird",
                "twothirds",
                "zerosuperior",
                "foursuperior",
                "fivesuperior",
                "sixsuperior",
                "sevensuperior",
                "eightsuperior",
                "ninesuperior",
                "zeroinferior",
                "oneinferior",
                "twoinferior",
                "threeinferior",
                "fourinferior",
                "fiveinferior",
                "sixinferior",
                "seveninferior",
                "eightinferior",
                "nineinferior",
                "centinferior",
                "dollarinferior",
                "periodinferior",
                "commainferior",
                "Agravesmall",
                "Aacutesmall",
                "Acircumflexsmall",
                "Atildesmall",
                "Adieresissmall",
                "Aringsmall",
                "AEsmall",
                "Ccedillasmall",
                "Egravesmall",
                "Eacutesmall",
                "Ecircumflexsmall",
                "Edieresissmall",
                "Igravesmall",
                "Iacutesmall",
                "Icircumflexsmall",
                "Idieresissmall",
                "Ethsmall",
                "Ntildesmall",
                "Ogravesmall",
                "Oacutesmall",
                "Ocircumflexsmall",
                "Otildesmall",
                "Odieresissmall",
                "OEsmall",
                "Oslashsmall",
                "Ugravesmall",
                "Uacutesmall",
                "Ucircumflexsmall",
                "Udieresissmall",
                "Yacutesmall",
                "Thornsmall",
                "Ydieresissmall",
                "001.000",
                "001.001",
                "001.002",
                "001.003",
                "Black",
                "Bold",
                "Book",
                "Light",
                "Medium",
                "Regular",
                "Roman",
                "Semibold"
            ];
            let ey = [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "space",
                "exclam",
                "quotedbl",
                "numbersign",
                "dollar",
                "percent",
                "ampersand",
                "quoteright",
                "parenleft",
                "parenright",
                "asterisk",
                "plus",
                "comma",
                "hyphen",
                "period",
                "slash",
                "zero",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine",
                "colon",
                "semicolon",
                "less",
                "equal",
                "greater",
                "question",
                "at",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "bracketleft",
                "backslash",
                "bracketright",
                "asciicircum",
                "underscore",
                "quoteleft",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "braceleft",
                "bar",
                "braceright",
                "asciitilde",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "exclamdown",
                "cent",
                "sterling",
                "fraction",
                "yen",
                "florin",
                "section",
                "currency",
                "quotesingle",
                "quotedblleft",
                "guillemotleft",
                "guilsinglleft",
                "guilsinglright",
                "fi",
                "fl",
                "",
                "endash",
                "dagger",
                "daggerdbl",
                "periodcentered",
                "",
                "paragraph",
                "bullet",
                "quotesinglbase",
                "quotedblbase",
                "quotedblright",
                "guillemotright",
                "ellipsis",
                "perthousand",
                "",
                "questiondown",
                "",
                "grave",
                "acute",
                "circumflex",
                "tilde",
                "macron",
                "breve",
                "dotaccent",
                "dieresis",
                "",
                "ring",
                "cedilla",
                "",
                "hungarumlaut",
                "ogonek",
                "caron",
                "emdash",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "AE",
                "",
                "ordfeminine",
                "",
                "",
                "",
                "",
                "Lslash",
                "Oslash",
                "OE",
                "ordmasculine",
                "",
                "",
                "",
                "",
                "",
                "ae",
                "",
                "",
                "",
                "dotlessi",
                "",
                "",
                "lslash",
                "oslash",
                "oe",
                "germandbls"
            ];
            let ew = [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "space",
                "exclamsmall",
                "Hungarumlautsmall",
                "",
                "dollaroldstyle",
                "dollarsuperior",
                "ampersandsmall",
                "Acutesmall",
                "parenleftsuperior",
                "parenrightsuperior",
                "twodotenleader",
                "onedotenleader",
                "comma",
                "hyphen",
                "period",
                "fraction",
                "zerooldstyle",
                "oneoldstyle",
                "twooldstyle",
                "threeoldstyle",
                "fouroldstyle",
                "fiveoldstyle",
                "sixoldstyle",
                "sevenoldstyle",
                "eightoldstyle",
                "nineoldstyle",
                "colon",
                "semicolon",
                "commasuperior",
                "threequartersemdash",
                "periodsuperior",
                "questionsmall",
                "",
                "asuperior",
                "bsuperior",
                "centsuperior",
                "dsuperior",
                "esuperior",
                "",
                "",
                "isuperior",
                "",
                "",
                "lsuperior",
                "msuperior",
                "nsuperior",
                "osuperior",
                "",
                "",
                "rsuperior",
                "ssuperior",
                "tsuperior",
                "",
                "ff",
                "fi",
                "fl",
                "ffi",
                "ffl",
                "parenleftinferior",
                "",
                "parenrightinferior",
                "Circumflexsmall",
                "hyphensuperior",
                "Gravesmall",
                "Asmall",
                "Bsmall",
                "Csmall",
                "Dsmall",
                "Esmall",
                "Fsmall",
                "Gsmall",
                "Hsmall",
                "Ismall",
                "Jsmall",
                "Ksmall",
                "Lsmall",
                "Msmall",
                "Nsmall",
                "Osmall",
                "Psmall",
                "Qsmall",
                "Rsmall",
                "Ssmall",
                "Tsmall",
                "Usmall",
                "Vsmall",
                "Wsmall",
                "Xsmall",
                "Ysmall",
                "Zsmall",
                "colonmonetary",
                "onefitted",
                "rupiah",
                "Tildesmall",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "exclamdownsmall",
                "centoldstyle",
                "Lslashsmall",
                "",
                "",
                "Scaronsmall",
                "Zcaronsmall",
                "Dieresissmall",
                "Brevesmall",
                "Caronsmall",
                "",
                "Dotaccentsmall",
                "",
                "",
                "Macronsmall",
                "",
                "",
                "figuredash",
                "hypheninferior",
                "",
                "",
                "Ogoneksmall",
                "Ringsmall",
                "Cedillasmall",
                "",
                "",
                "",
                "onequarter",
                "onehalf",
                "threequarters",
                "questiondownsmall",
                "oneeighth",
                "threeeighths",
                "fiveeighths",
                "seveneighths",
                "onethird",
                "twothirds",
                "",
                "",
                "zerosuperior",
                "onesuperior",
                "twosuperior",
                "threesuperior",
                "foursuperior",
                "fivesuperior",
                "sixsuperior",
                "sevensuperior",
                "eightsuperior",
                "ninesuperior",
                "zeroinferior",
                "oneinferior",
                "twoinferior",
                "threeinferior",
                "fourinferior",
                "fiveinferior",
                "sixinferior",
                "seveninferior",
                "eightinferior",
                "nineinferior",
                "centinferior",
                "dollarinferior",
                "periodinferior",
                "commainferior",
                "Agravesmall",
                "Aacutesmall",
                "Acircumflexsmall",
                "Atildesmall",
                "Adieresissmall",
                "Aringsmall",
                "AEsmall",
                "Ccedillasmall",
                "Egravesmall",
                "Eacutesmall",
                "Ecircumflexsmall",
                "Edieresissmall",
                "Igravesmall",
                "Iacutesmall",
                "Icircumflexsmall",
                "Idieresissmall",
                "Ethsmall",
                "Ntildesmall",
                "Ogravesmall",
                "Oacutesmall",
                "Ocircumflexsmall",
                "Otildesmall",
                "Odieresissmall",
                "OEsmall",
                "Oslashsmall",
                "Ugravesmall",
                "Uacutesmall",
                "Ucircumflexsmall",
                "Udieresissmall",
                "Yacutesmall",
                "Thornsmall",
                "Ydieresissmall"
            ];
            let ex = [
                ".notdef",
                "space",
                "exclam",
                "quotedbl",
                "numbersign",
                "dollar",
                "percent",
                "ampersand",
                "quoteright",
                "parenleft",
                "parenright",
                "asterisk",
                "plus",
                "comma",
                "hyphen",
                "period",
                "slash",
                "zero",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine",
                "colon",
                "semicolon",
                "less",
                "equal",
                "greater",
                "question",
                "at",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "bracketleft",
                "backslash",
                "bracketright",
                "asciicircum",
                "underscore",
                "quoteleft",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "braceleft",
                "bar",
                "braceright",
                "asciitilde",
                "exclamdown",
                "cent",
                "sterling",
                "fraction",
                "yen",
                "florin",
                "section",
                "currency",
                "quotesingle",
                "quotedblleft",
                "guillemotleft",
                "guilsinglleft",
                "guilsinglright",
                "fi",
                "fl",
                "endash",
                "dagger",
                "daggerdbl",
                "periodcentered",
                "paragraph",
                "bullet",
                "quotesinglbase",
                "quotedblbase",
                "quotedblright",
                "guillemotright",
                "ellipsis",
                "perthousand",
                "questiondown",
                "grave",
                "acute",
                "circumflex",
                "tilde",
                "macron",
                "breve",
                "dotaccent",
                "dieresis",
                "ring",
                "cedilla",
                "hungarumlaut",
                "ogonek",
                "caron",
                "emdash",
                "AE",
                "ordfeminine",
                "Lslash",
                "Oslash",
                "OE",
                "ordmasculine",
                "ae",
                "dotlessi",
                "lslash",
                "oslash",
                "oe",
                "germandbls",
                "onesuperior",
                "logicalnot",
                "mu",
                "trademark",
                "Eth",
                "onehalf",
                "plusminus",
                "Thorn",
                "onequarter",
                "divide",
                "brokenbar",
                "degree",
                "thorn",
                "threequarters",
                "twosuperior",
                "registered",
                "minus",
                "eth",
                "multiply",
                "threesuperior",
                "copyright",
                "Aacute",
                "Acircumflex",
                "Adieresis",
                "Agrave",
                "Aring",
                "Atilde",
                "Ccedilla",
                "Eacute",
                "Ecircumflex",
                "Edieresis",
                "Egrave",
                "Iacute",
                "Icircumflex",
                "Idieresis",
                "Igrave",
                "Ntilde",
                "Oacute",
                "Ocircumflex",
                "Odieresis",
                "Ograve",
                "Otilde",
                "Scaron",
                "Uacute",
                "Ucircumflex",
                "Udieresis",
                "Ugrave",
                "Yacute",
                "Ydieresis",
                "Zcaron",
                "aacute",
                "acircumflex",
                "adieresis",
                "agrave",
                "aring",
                "atilde",
                "ccedilla",
                "eacute",
                "ecircumflex",
                "edieresis",
                "egrave",
                "iacute",
                "icircumflex",
                "idieresis",
                "igrave",
                "ntilde",
                "oacute",
                "ocircumflex",
                "odieresis",
                "ograve",
                "otilde",
                "scaron",
                "uacute",
                "ucircumflex",
                "udieresis",
                "ugrave",
                "yacute",
                "ydieresis",
                "zcaron"
            ];
            let ev = [
                ".notdef",
                "space",
                "exclamsmall",
                "Hungarumlautsmall",
                "dollaroldstyle",
                "dollarsuperior",
                "ampersandsmall",
                "Acutesmall",
                "parenleftsuperior",
                "parenrightsuperior",
                "twodotenleader",
                "onedotenleader",
                "comma",
                "hyphen",
                "period",
                "fraction",
                "zerooldstyle",
                "oneoldstyle",
                "twooldstyle",
                "threeoldstyle",
                "fouroldstyle",
                "fiveoldstyle",
                "sixoldstyle",
                "sevenoldstyle",
                "eightoldstyle",
                "nineoldstyle",
                "colon",
                "semicolon",
                "commasuperior",
                "threequartersemdash",
                "periodsuperior",
                "questionsmall",
                "asuperior",
                "bsuperior",
                "centsuperior",
                "dsuperior",
                "esuperior",
                "isuperior",
                "lsuperior",
                "msuperior",
                "nsuperior",
                "osuperior",
                "rsuperior",
                "ssuperior",
                "tsuperior",
                "ff",
                "fi",
                "fl",
                "ffi",
                "ffl",
                "parenleftinferior",
                "parenrightinferior",
                "Circumflexsmall",
                "hyphensuperior",
                "Gravesmall",
                "Asmall",
                "Bsmall",
                "Csmall",
                "Dsmall",
                "Esmall",
                "Fsmall",
                "Gsmall",
                "Hsmall",
                "Ismall",
                "Jsmall",
                "Ksmall",
                "Lsmall",
                "Msmall",
                "Nsmall",
                "Osmall",
                "Psmall",
                "Qsmall",
                "Rsmall",
                "Ssmall",
                "Tsmall",
                "Usmall",
                "Vsmall",
                "Wsmall",
                "Xsmall",
                "Ysmall",
                "Zsmall",
                "colonmonetary",
                "onefitted",
                "rupiah",
                "Tildesmall",
                "exclamdownsmall",
                "centoldstyle",
                "Lslashsmall",
                "Scaronsmall",
                "Zcaronsmall",
                "Dieresissmall",
                "Brevesmall",
                "Caronsmall",
                "Dotaccentsmall",
                "Macronsmall",
                "figuredash",
                "hypheninferior",
                "Ogoneksmall",
                "Ringsmall",
                "Cedillasmall",
                "onequarter",
                "onehalf",
                "threequarters",
                "questiondownsmall",
                "oneeighth",
                "threeeighths",
                "fiveeighths",
                "seveneighths",
                "onethird",
                "twothirds",
                "zerosuperior",
                "onesuperior",
                "twosuperior",
                "threesuperior",
                "foursuperior",
                "fivesuperior",
                "sixsuperior",
                "sevensuperior",
                "eightsuperior",
                "ninesuperior",
                "zeroinferior",
                "oneinferior",
                "twoinferior",
                "threeinferior",
                "fourinferior",
                "fiveinferior",
                "sixinferior",
                "seveninferior",
                "eightinferior",
                "nineinferior",
                "centinferior",
                "dollarinferior",
                "periodinferior",
                "commainferior",
                "Agravesmall",
                "Aacutesmall",
                "Acircumflexsmall",
                "Atildesmall",
                "Adieresissmall",
                "Aringsmall",
                "AEsmall",
                "Ccedillasmall",
                "Egravesmall",
                "Eacutesmall",
                "Ecircumflexsmall",
                "Edieresissmall",
                "Igravesmall",
                "Iacutesmall",
                "Icircumflexsmall",
                "Idieresissmall",
                "Ethsmall",
                "Ntildesmall",
                "Ogravesmall",
                "Oacutesmall",
                "Ocircumflexsmall",
                "Otildesmall",
                "Odieresissmall",
                "OEsmall",
                "Oslashsmall",
                "Ugravesmall",
                "Uacutesmall",
                "Ucircumflexsmall",
                "Udieresissmall",
                "Yacutesmall",
                "Thornsmall",
                "Ydieresissmall"
            ];
            let e_ = [
                ".notdef",
                "space",
                "dollaroldstyle",
                "dollarsuperior",
                "parenleftsuperior",
                "parenrightsuperior",
                "twodotenleader",
                "onedotenleader",
                "comma",
                "hyphen",
                "period",
                "fraction",
                "zerooldstyle",
                "oneoldstyle",
                "twooldstyle",
                "threeoldstyle",
                "fouroldstyle",
                "fiveoldstyle",
                "sixoldstyle",
                "sevenoldstyle",
                "eightoldstyle",
                "nineoldstyle",
                "colon",
                "semicolon",
                "commasuperior",
                "threequartersemdash",
                "periodsuperior",
                "asuperior",
                "bsuperior",
                "centsuperior",
                "dsuperior",
                "esuperior",
                "isuperior",
                "lsuperior",
                "msuperior",
                "nsuperior",
                "osuperior",
                "rsuperior",
                "ssuperior",
                "tsuperior",
                "ff",
                "fi",
                "fl",
                "ffi",
                "ffl",
                "parenleftinferior",
                "parenrightinferior",
                "hyphensuperior",
                "colonmonetary",
                "onefitted",
                "rupiah",
                "centoldstyle",
                "figuredash",
                "hypheninferior",
                "onequarter",
                "onehalf",
                "threequarters",
                "oneeighth",
                "threeeighths",
                "fiveeighths",
                "seveneighths",
                "onethird",
                "twothirds",
                "zerosuperior",
                "onesuperior",
                "twosuperior",
                "threesuperior",
                "foursuperior",
                "fivesuperior",
                "sixsuperior",
                "sevensuperior",
                "eightsuperior",
                "ninesuperior",
                "zeroinferior",
                "oneinferior",
                "twoinferior",
                "threeinferior",
                "fourinferior",
                "fiveinferior",
                "sixinferior",
                "seveninferior",
                "eightinferior",
                "nineinferior",
                "centinferior",
                "dollarinferior",
                "periodinferior",
                "commainferior"
            ];
            let eL = new r.AU({
                reserved: new r.kV(r.mL),
                reqFeatureIndex: r.mL,
                featureCount: r.mL,
                featureIndexes: new r.mJ(r.mL, "featureCount")
            });
            let eC = new r.AU({
                tag: new r.Ld(4),
                langSys: new r.$J(r.mL, eL, {
                    type: "parent"
                })
            });
            let eA = new r.AU({
                defaultLangSys: new r.$J(r.mL, eL),
                count: r.mL,
                langSysRecords: new r.mJ(eC, "count")
            });
            let ek = new r.AU({
                tag: new r.Ld(4),
                script: new r.$J(r.mL, eA, {
                    type: "parent"
                })
            });
            let eS = new r.mJ(ek, r.mL);
            let eI = new r.AU({
                version: r.mL,
                nameID: r.mL
            });
            let eP = new r.AU({
                featureParams: new r.$J(r.mL, eI),
                lookupCount: r.mL,
                lookupListIndexes: new r.mJ(r.mL, "lookupCount")
            });
            let eU = new r.AU({
                tag: new r.Ld(4),
                feature: new r.$J(r.mL, eP, {
                    type: "parent"
                })
            });
            let eJ = new r.mJ(eU, r.mL);
            let eT = new r.AU({
                markAttachmentType: r.w_,
                flags: new r.DL(r.w_, [
                    "rightToLeft",
                    "ignoreBaseGlyphs",
                    "ignoreLigatures",
                    "ignoreMarks",
                    "useMarkFilteringSet"
                ])
            });
            function eO(e) {
                let t = new r.AU({
                    lookupType: r.mL,
                    flags: eT,
                    subTableCount: r.mL,
                    subTables: new r.mJ(new r.$J(r.mL, e), "subTableCount"),
                    markFilteringSet: new r.Fi(r.mL, (e)=>e.flags.flags.useMarkFilteringSet)
                });
                return new r.pW(new r.$J(r.mL, t), r.mL);
            }
            let eF = new r.AU({
                start: r.mL,
                end: r.mL,
                startCoverageIndex: r.mL
            });
            let eD = new r.bS(r.mL, {
                1: {
                    glyphCount: r.mL,
                    glyphs: new r.mJ(r.mL, "glyphCount")
                },
                2: {
                    rangeCount: r.mL,
                    rangeRecords: new r.mJ(eF, "rangeCount")
                }
            });
            let eM = new r.AU({
                start: r.mL,
                end: r.mL,
                class: r.mL
            });
            let eG = new r.bS(r.mL, {
                1: {
                    startGlyph: r.mL,
                    glyphCount: r.mL,
                    classValueArray: new r.mJ(r.mL, "glyphCount")
                },
                2: {
                    classRangeCount: r.mL,
                    classRangeRecord: new r.mJ(eM, "classRangeCount")
                }
            });
            let eE = new r.AU({
                a: r.mL,
                b: r.mL,
                deltaFormat: r.mL
            });
            let eB = new r.AU({
                sequenceIndex: r.mL,
                lookupListIndex: r.mL
            });
            let eV = new r.AU({
                glyphCount: r.mL,
                lookupCount: r.mL,
                input: new r.mJ(r.mL, (e)=>e.glyphCount - 1),
                lookupRecords: new r.mJ(eB, "lookupCount")
            });
            let ez = new r.mJ(new r.$J(r.mL, eV), r.mL);
            let eR = new r.AU({
                glyphCount: r.mL,
                lookupCount: r.mL,
                classes: new r.mJ(r.mL, (e)=>e.glyphCount - 1),
                lookupRecords: new r.mJ(eB, "lookupCount")
            });
            let eN = new r.mJ(new r.$J(r.mL, eR), r.mL);
            let eW = new r.bS(r.mL, {
                1: {
                    coverage: new r.$J(r.mL, eD),
                    ruleSetCount: r.mL,
                    ruleSets: new r.mJ(new r.$J(r.mL, ez), "ruleSetCount")
                },
                2: {
                    coverage: new r.$J(r.mL, eD),
                    classDef: new r.$J(r.mL, eG),
                    classSetCnt: r.mL,
                    classSet: new r.mJ(new r.$J(r.mL, eN), "classSetCnt")
                },
                3: {
                    glyphCount: r.mL,
                    lookupCount: r.mL,
                    coverages: new r.mJ(new r.$J(r.mL, eD), "glyphCount"),
                    lookupRecords: new r.mJ(eB, "lookupCount")
                }
            });
            let eX = new r.AU({
                backtrackGlyphCount: r.mL,
                backtrack: new r.mJ(r.mL, "backtrackGlyphCount"),
                inputGlyphCount: r.mL,
                input: new r.mJ(r.mL, (e)=>e.inputGlyphCount - 1),
                lookaheadGlyphCount: r.mL,
                lookahead: new r.mJ(r.mL, "lookaheadGlyphCount"),
                lookupCount: r.mL,
                lookupRecords: new r.mJ(eB, "lookupCount")
            });
            let eq = new r.mJ(new r.$J(r.mL, eX), r.mL);
            let eH = new r.bS(r.mL, {
                1: {
                    coverage: new r.$J(r.mL, eD),
                    chainCount: r.mL,
                    chainRuleSets: new r.mJ(new r.$J(r.mL, eq), "chainCount")
                },
                2: {
                    coverage: new r.$J(r.mL, eD),
                    backtrackClassDef: new r.$J(r.mL, eG),
                    inputClassDef: new r.$J(r.mL, eG),
                    lookaheadClassDef: new r.$J(r.mL, eG),
                    chainCount: r.mL,
                    chainClassSet: new r.mJ(new r.$J(r.mL, eq), "chainCount")
                },
                3: {
                    backtrackGlyphCount: r.mL,
                    backtrackCoverage: new r.mJ(new r.$J(r.mL, eD), "backtrackGlyphCount"),
                    inputGlyphCount: r.mL,
                    inputCoverage: new r.mJ(new r.$J(r.mL, eD), "inputGlyphCount"),
                    lookaheadGlyphCount: r.mL,
                    lookaheadCoverage: new r.mJ(new r.$J(r.mL, eD), "lookaheadGlyphCount"),
                    lookupCount: r.mL,
                    lookupRecords: new r.mJ(eB, "lookupCount")
                }
            });
            let ej = new r.gb(16, "BE", 14);
            let eY = new r.AU({
                startCoord: ej,
                peakCoord: ej,
                endCoord: ej
            });
            let e$ = new r.AU({
                axisCount: r.mL,
                regionCount: r.mL,
                variationRegions: new r.mJ(new r.mJ(eY, "axisCount"), "regionCount")
            });
            let eZ = new r.AU({
                shortDeltas: new r.mJ(r.Af, (e)=>e.parent.shortDeltaCount),
                regionDeltas: new r.mJ(r.cS, (e)=>e.parent.regionIndexCount - e.parent.shortDeltaCount),
                deltas: (e)=>e.shortDeltas.concat(e.regionDeltas)
            });
            let eK = new r.AU({
                itemCount: r.mL,
                shortDeltaCount: r.mL,
                regionIndexCount: r.mL,
                regionIndexes: new r.mJ(r.mL, "regionIndexCount"),
                deltaSets: new r.mJ(eZ, "itemCount")
            });
            let eQ = new r.AU({
                format: r.mL,
                variationRegionList: new r.$J(r.U7, e$),
                variationDataCount: r.mL,
                itemVariationData: new r.mJ(new r.$J(r.U7, eK), "variationDataCount")
            });
            let e0 = new r.bS(r.mL, {
                1: {
                    axisIndex: r.mL,
                    axisIndex: r.mL,
                    filterRangeMinValue: ej,
                    filterRangeMaxValue: ej
                }
            });
            let e1 = new r.AU({
                conditionCount: r.mL,
                conditionTable: new r.mJ(new r.$J(r.U7, e0), "conditionCount")
            });
            let e2 = new r.AU({
                featureIndex: r.mL,
                alternateFeatureTable: new r.$J(r.U7, (0, eP), {
                    type: "parent"
                })
            });
            let e3 = new r.AU({
                version: r.E2,
                substitutionCount: r.mL,
                substitutions: new r.mJ(e2, "substitutionCount")
            });
            let e4 = new r.AU({
                conditionSet: new r.$J(r.U7, e1, {
                    type: "parent"
                }),
                featureTableSubstitution: new r.$J(r.U7, e3, {
                    type: "parent"
                })
            });
            let e5 = new r.AU({
                majorVersion: r.mL,
                minorVersion: r.mL,
                featureVariationRecordCount: r.U7,
                featureVariationRecords: new r.mJ(e4, "featureVariationRecordCount")
            });
            class e7 {
                decode(e, t, s) {
                    if (this.predefinedOps[s[0]]) return this.predefinedOps[s[0]];
                    return this.type.decode(e, t, s);
                }
                size(e, t) {
                    return this.type.size(e, t);
                }
                encode(e, t, s) {
                    let r = this.predefinedOps.indexOf(t);
                    if (r !== -1) return r;
                    return this.type.encode(e, t, s);
                }
                constructor(e, t){
                    this.predefinedOps = e;
                    this.type = t;
                }
            }
            class e6 extends r.Mr {
                decode(e) {
                    return r.w_.decode(e) & 0x7f;
                }
                constructor(){
                    super("UInt8");
                }
            }
            let e9 = new r.AU({
                first: r.mL,
                nLeft: r.w_
            });
            let e8 = new r.AU({
                first: r.mL,
                nLeft: r.mL
            });
            let te = new r.bS(new e6(), {
                0: {
                    nCodes: r.w_,
                    codes: new r.mJ(r.w_, "nCodes")
                },
                1: {
                    nRanges: r.w_,
                    ranges: new r.mJ(e9, "nRanges")
                }
            });
            let tt = new e7([
                (0, ey),
                (0, ew)
            ], new (0, ed)(te, {
                lazy: true
            }));
            class ts extends r.mJ {
                decode(e, t) {
                    let s = (0, r.dB)(this.length, e, t);
                    let n = 0;
                    let a = [];
                    while(n < s){
                        let l = this.type.decode(e, t);
                        l.offset = n;
                        n += l.nLeft + 1;
                        a.push(l);
                    }
                    return a;
                }
            }
            let tr = new r.bS(r.w_, {
                0: {
                    glyphs: new r.mJ(r.mL, (e)=>e.parent.CharStrings.length - 1)
                },
                1: {
                    ranges: new ts(e9, (e)=>e.parent.CharStrings.length - 1)
                },
                2: {
                    ranges: new ts(e8, (e)=>e.parent.CharStrings.length - 1)
                }
            });
            let tn = new e7([
                (0, ex),
                (0, ev),
                (0, e_)
            ], new (0, ed)(tr, {
                lazy: true
            }));
            let ta = new r.AU({
                first: r.mL,
                fd: r.w_
            });
            let tl = new r.AU({
                first: r.U7,
                fd: r.mL
            });
            let ti = new r.bS(r.w_, {
                0: {
                    fds: new r.mJ(r.w_, (e)=>e.parent.CharStrings.length)
                },
                3: {
                    nRanges: r.mL,
                    ranges: new r.mJ(ta, "nRanges"),
                    sentinel: r.mL
                },
                4: {
                    nRanges: r.U7,
                    ranges: new r.mJ(tl, "nRanges"),
                    sentinel: r.U7
                }
            });
            let to = new (0, ed)((0, eg));
            class tu {
                decode(e, t, s) {
                    t.length = s[0];
                    return to.decode(e, t, [
                        s[1]
                    ]);
                }
                size(e, t) {
                    return [
                        (0, eg).size(e, t, false),
                        to.size(e, t)[0]
                    ];
                }
                encode(e, t, s) {
                    return [
                        (0, eg).size(t, s, false),
                        to.encode(e, t, s)[0]
                    ];
                }
            }
            let tc = new (0, eh)([
                [
                    18,
                    "Private",
                    new tu,
                    null
                ],
                [
                    [
                        12,
                        38
                    ],
                    "FontName",
                    "sid",
                    null
                ],
                [
                    [
                        12,
                        7
                    ],
                    "FontMatrix",
                    "array",
                    [
                        0.001,
                        0,
                        0,
                        0.001,
                        0,
                        0
                    ]
                ],
                [
                    [
                        12,
                        5
                    ],
                    "PaintType",
                    "number",
                    0
                ]
            ]);
            let tf = new (0, eh)([
                [
                    [
                        12,
                        30
                    ],
                    "ROS",
                    [
                        "sid",
                        "sid",
                        "number"
                    ],
                    null
                ],
                [
                    0,
                    "version",
                    "sid",
                    null
                ],
                [
                    1,
                    "Notice",
                    "sid",
                    null
                ],
                [
                    [
                        12,
                        0
                    ],
                    "Copyright",
                    "sid",
                    null
                ],
                [
                    2,
                    "FullName",
                    "sid",
                    null
                ],
                [
                    3,
                    "FamilyName",
                    "sid",
                    null
                ],
                [
                    4,
                    "Weight",
                    "sid",
                    null
                ],
                [
                    [
                        12,
                        1
                    ],
                    "isFixedPitch",
                    "boolean",
                    false
                ],
                [
                    [
                        12,
                        2
                    ],
                    "ItalicAngle",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        3
                    ],
                    "UnderlinePosition",
                    "number",
                    -100
                ],
                [
                    [
                        12,
                        4
                    ],
                    "UnderlineThickness",
                    "number",
                    50
                ],
                [
                    [
                        12,
                        5
                    ],
                    "PaintType",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        6
                    ],
                    "CharstringType",
                    "number",
                    2
                ],
                [
                    [
                        12,
                        7
                    ],
                    "FontMatrix",
                    "array",
                    [
                        0.001,
                        0,
                        0,
                        0.001,
                        0,
                        0
                    ]
                ],
                [
                    13,
                    "UniqueID",
                    "number",
                    null
                ],
                [
                    5,
                    "FontBBox",
                    "array",
                    [
                        0,
                        0,
                        0,
                        0
                    ]
                ],
                [
                    [
                        12,
                        8
                    ],
                    "StrokeWidth",
                    "number",
                    0
                ],
                [
                    14,
                    "XUID",
                    "array",
                    null
                ],
                [
                    15,
                    "charset",
                    tn,
                    (0, ex)
                ],
                [
                    16,
                    "Encoding",
                    tt,
                    (0, ey)
                ],
                [
                    17,
                    "CharStrings",
                    new (0, ed)(new (0, ei)),
                    null
                ],
                [
                    18,
                    "Private",
                    new tu,
                    null
                ],
                [
                    [
                        12,
                        20
                    ],
                    "SyntheticBase",
                    "number",
                    null
                ],
                [
                    [
                        12,
                        21
                    ],
                    "PostScript",
                    "sid",
                    null
                ],
                [
                    [
                        12,
                        22
                    ],
                    "BaseFontName",
                    "sid",
                    null
                ],
                [
                    [
                        12,
                        23
                    ],
                    "BaseFontBlend",
                    "delta",
                    null
                ],
                [
                    [
                        12,
                        31
                    ],
                    "CIDFontVersion",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        32
                    ],
                    "CIDFontRevision",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        33
                    ],
                    "CIDFontType",
                    "number",
                    0
                ],
                [
                    [
                        12,
                        34
                    ],
                    "CIDCount",
                    "number",
                    8720
                ],
                [
                    [
                        12,
                        35
                    ],
                    "UIDBase",
                    "number",
                    null
                ],
                [
                    [
                        12,
                        37
                    ],
                    "FDSelect",
                    new (0, ed)(ti),
                    null
                ],
                [
                    [
                        12,
                        36
                    ],
                    "FDArray",
                    new (0, ed)(new (0, ei)(tc)),
                    null
                ],
                [
                    [
                        12,
                        38
                    ],
                    "FontName",
                    "sid",
                    null
                ]
            ]);
            let th = new r.AU({
                length: r.mL,
                itemVariationStore: (0, eQ)
            });
            let td = new (0, eh)([
                [
                    [
                        12,
                        7
                    ],
                    "FontMatrix",
                    "array",
                    [
                        0.001,
                        0,
                        0,
                        0.001,
                        0,
                        0
                    ]
                ],
                [
                    17,
                    "CharStrings",
                    new (0, ed)(new (0, ei)),
                    null
                ],
                [
                    [
                        12,
                        37
                    ],
                    "FDSelect",
                    new (0, ed)(ti),
                    null
                ],
                [
                    [
                        12,
                        36
                    ],
                    "FDArray",
                    new (0, ed)(new (0, ei)(tc)),
                    null
                ],
                [
                    24,
                    "vstore",
                    new (0, ed)(th),
                    null
                ],
                [
                    25,
                    "maxstack",
                    "number",
                    193
                ]
            ]);
            let tm = new r.bS(r.gl, {
                1: {
                    hdrSize: r.w_,
                    offSize: r.w_,
                    nameIndex: new (0, ei)(new r.Ld("length")),
                    topDictIndex: new (0, ei)(tf),
                    stringIndex: new (0, ei)(new r.Ld("length")),
                    globalSubrIndex: new (0, ei)
                },
                2: {
                    hdrSize: r.w_,
                    length: r.mL,
                    topDict: td,
                    globalSubrIndex: new (0, ei)
                }
            });
            var tp = tm;
            class tg {
                static decode(e) {
                    return new tg(e);
                }
                decode() {
                    let e = this.stream.pos;
                    let t = (0, tp).decode(this.stream);
                    for(let s in t){
                        let r = t[s];
                        this[s] = r;
                    }
                    if (this.version < 2) {
                        if (this.topDictIndex.length !== 1) throw new Error("Only a single font is allowed in CFF");
                        this.topDict = this.topDictIndex[0];
                    }
                    this.isCIDFont = this.topDict.ROS != null;
                    return this;
                }
                string(e) {
                    if (this.version >= 2) return null;
                    if (e < (0, eb).length) return (0, eb)[e];
                    return this.stringIndex[e - (0, eb).length];
                }
                get postscriptName() {
                    if (this.version < 2) return this.nameIndex[0];
                    return null;
                }
                get fullName() {
                    return this.string(this.topDict.FullName);
                }
                get familyName() {
                    return this.string(this.topDict.FamilyName);
                }
                getCharString(e) {
                    this.stream.pos = this.topDict.CharStrings[e].offset;
                    return this.stream.readBuffer(this.topDict.CharStrings[e].length);
                }
                getGlyphName(e) {
                    if (this.version >= 2) return null;
                    if (this.isCIDFont) return null;
                    let { charset: t  } = this.topDict;
                    if (Array.isArray(t)) return t[e];
                    if (e === 0) return ".notdef";
                    e -= 1;
                    switch(t.version){
                        case 0:
                            return this.string(t.glyphs[e]);
                        case 1:
                        case 2:
                            for(let s = 0; s < t.ranges.length; s++){
                                let r = t.ranges[s];
                                if (r.offset <= e && e <= r.offset + r.nLeft) return this.string(r.first + (e - r.offset));
                            }
                            break;
                    }
                    return null;
                }
                fdForGlyph(e) {
                    if (!this.topDict.FDSelect) return null;
                    switch(this.topDict.FDSelect.version){
                        case 0:
                            return this.topDict.FDSelect.fds[e];
                        case 3:
                        case 4:
                            let { ranges: t  } = this.topDict.FDSelect;
                            let s = 0;
                            let r = t.length - 1;
                            while(s <= r){
                                let n = s + r >> 1;
                                if (e < t[n].first) r = n - 1;
                                else if (n < r && e >= t[n + 1].first) s = n + 1;
                                else return t[n].fd;
                            }
                        default:
                            throw new Error(`Unknown FDSelect version: ${this.topDict.FDSelect.version}`);
                    }
                }
                privateDictForGlyph(e) {
                    if (this.topDict.FDSelect) {
                        let t = this.fdForGlyph(e);
                        if (this.topDict.FDArray[t]) return this.topDict.FDArray[t].Private;
                        return null;
                    }
                    if (this.version < 2) return this.topDict.Private;
                    return this.topDict.FDArray[0].Private;
                }
                constructor(e){
                    this.stream = e;
                    this.decode();
                }
            }
            var tb = tg;
            let ty = new r.AU({
                glyphIndex: r.mL,
                vertOriginY: r.Af
            });
            var tw = new r.AU({
                majorVersion: r.mL,
                minorVersion: r.mL,
                defaultVertOriginY: r.Af,
                numVertOriginYMetrics: r.mL,
                metrics: new r.mJ(ty, "numVertOriginYMetrics")
            });
            let tx = new r.AU({
                height: r.w_,
                width: r.w_,
                horiBearingX: r.cS,
                horiBearingY: r.cS,
                horiAdvance: r.w_,
                vertBearingX: r.cS,
                vertBearingY: r.cS,
                vertAdvance: r.w_
            });
            let tv = new r.AU({
                height: r.w_,
                width: r.w_,
                bearingX: r.cS,
                bearingY: r.cS,
                advance: r.w_
            });
            let t_ = new r.AU({
                glyph: r.mL,
                xOffset: r.cS,
                yOffset: r.cS
            });
            class tL {
            }
            class tC {
            }
            let tA = new r.bS("version", {
                1: {
                    metrics: tv,
                    data: tL
                },
                2: {
                    metrics: tv,
                    data: tC
                },
                5: {
                    data: tC
                },
                6: {
                    metrics: tx,
                    data: tL
                },
                7: {
                    metrics: tx,
                    data: tC
                },
                8: {
                    metrics: tv,
                    pad: new r.kV(r.w_),
                    numComponents: r.mL,
                    components: new r.mJ(t_, "numComponents")
                },
                9: {
                    metrics: tx,
                    pad: new r.kV(r.w_),
                    numComponents: r.mL,
                    components: new r.mJ(t_, "numComponents")
                },
                17: {
                    metrics: tv,
                    dataLen: r.U7,
                    data: new r.lW("dataLen")
                },
                18: {
                    metrics: tx,
                    dataLen: r.U7,
                    data: new r.lW("dataLen")
                },
                19: {
                    dataLen: r.U7,
                    data: new r.lW("dataLen")
                }
            });
            let tk = new r.AU({
                ascender: r.cS,
                descender: r.cS,
                widthMax: r.w_,
                caretSlopeNumerator: r.cS,
                caretSlopeDenominator: r.cS,
                caretOffset: r.cS,
                minOriginSB: r.cS,
                minAdvanceSB: r.cS,
                maxBeforeBL: r.cS,
                minAfterBL: r.cS,
                pad: new r.kV(r.cS, 2)
            });
            let tS = new r.AU({
                glyphCode: r.mL,
                offset: r.mL
            });
            let tI = new r.bS(r.mL, {
                header: {
                    imageFormat: r.mL,
                    imageDataOffset: r.U7
                },
                1: {
                    offsetArray: new r.mJ(r.U7, (e)=>e.parent.lastGlyphIndex - e.parent.firstGlyphIndex + 1)
                },
                2: {
                    imageSize: r.U7,
                    bigMetrics: (0, tx)
                },
                3: {
                    offsetArray: new r.mJ(r.mL, (e)=>e.parent.lastGlyphIndex - e.parent.firstGlyphIndex + 1)
                },
                4: {
                    numGlyphs: r.U7,
                    glyphArray: new r.mJ(tS, (e)=>e.numGlyphs + 1)
                },
                5: {
                    imageSize: r.U7,
                    bigMetrics: (0, tx),
                    numGlyphs: r.U7,
                    glyphCodeArray: new r.mJ(r.mL, "numGlyphs")
                }
            });
            let tP = new r.AU({
                firstGlyphIndex: r.mL,
                lastGlyphIndex: r.mL,
                subtable: new r.$J(r.U7, tI)
            });
            let tU = new r.AU({
                indexSubTableArray: new r.$J(r.U7, new r.mJ(tP, 1), {
                    type: "parent"
                }),
                indexTablesSize: r.U7,
                numberOfIndexSubTables: r.U7,
                colorRef: r.U7,
                hori: tk,
                vert: tk,
                startGlyphIndex: r.mL,
                endGlyphIndex: r.mL,
                ppemX: r.w_,
                ppemY: r.w_,
                bitDepth: r.w_,
                flags: new r.DL(r.w_, [
                    "horizontal",
                    "vertical"
                ])
            });
            var tJ = new r.AU({
                version: r.U7,
                numSizes: r.U7,
                sizes: new r.mJ(tU, "numSizes")
            });
            let tT = new r.AU({
                ppem: r.mL,
                resolution: r.mL,
                imageOffsets: new r.mJ(new r.$J(r.U7, "void"), (e)=>e.parent.parent.maxp.numGlyphs + 1)
            });
            var tO = new r.AU({
                version: r.mL,
                flags: new r.DL(r.mL, [
                    "renderOutlines"
                ]),
                numImgTables: r.U7,
                imageTables: new r.mJ(new r.$J(r.U7, tT), "numImgTables")
            });
            let tF = new r.AU({
                gid: r.mL,
                paletteIndex: r.mL
            });
            let tD = new r.AU({
                gid: r.mL,
                firstLayerIndex: r.mL,
                numLayers: r.mL
            });
            var tM = new r.AU({
                version: r.mL,
                numBaseGlyphRecords: r.mL,
                baseGlyphRecord: new r.$J(r.U7, new r.mJ(tD, "numBaseGlyphRecords")),
                layerRecords: new r.$J(r.U7, new r.mJ(tF, "numLayerRecords"), {
                    lazy: true
                }),
                numLayerRecords: r.mL
            });
            let tG = new r.AU({
                blue: r.w_,
                green: r.w_,
                red: r.w_,
                alpha: r.w_
            });
            var tE = new r.bS(r.mL, {
                header: {
                    numPaletteEntries: r.mL,
                    numPalettes: r.mL,
                    numColorRecords: r.mL,
                    colorRecords: new r.$J(r.U7, new r.mJ(tG, "numColorRecords")),
                    colorRecordIndices: new r.mJ(r.mL, "numPalettes")
                },
                0: {},
                1: {
                    offsetPaletteTypeArray: new r.$J(r.U7, new r.mJ(r.U7, "numPalettes")),
                    offsetPaletteLabelArray: new r.$J(r.U7, new r.mJ(r.mL, "numPalettes")),
                    offsetPaletteEntryLabelArray: new r.$J(r.U7, new r.mJ(r.mL, "numPaletteEntries"))
                }
            });
            let tB = new r.bS(r.mL, {
                1: {
                    coordinate: r.Af
                },
                2: {
                    coordinate: r.Af,
                    referenceGlyph: r.mL,
                    baseCoordPoint: r.mL
                },
                3: {
                    coordinate: r.Af,
                    deviceTable: new r.$J(r.mL, (0, eE))
                }
            });
            let tV = new r.AU({
                defaultIndex: r.mL,
                baseCoordCount: r.mL,
                baseCoords: new r.mJ(new r.$J(r.mL, tB), "baseCoordCount")
            });
            let tz = new r.AU({
                tag: new r.Ld(4),
                minCoord: new r.$J(r.mL, tB, {
                    type: "parent"
                }),
                maxCoord: new r.$J(r.mL, tB, {
                    type: "parent"
                })
            });
            let tR = new r.AU({
                minCoord: new r.$J(r.mL, tB),
                maxCoord: new r.$J(r.mL, tB),
                featMinMaxCount: r.mL,
                featMinMaxRecords: new r.mJ(tz, "featMinMaxCount")
            });
            let tN = new r.AU({
                tag: new r.Ld(4),
                minMax: new r.$J(r.mL, tR, {
                    type: "parent"
                })
            });
            let tW = new r.AU({
                baseValues: new r.$J(r.mL, tV),
                defaultMinMax: new r.$J(r.mL, tR),
                baseLangSysCount: r.mL,
                baseLangSysRecords: new r.mJ(tN, "baseLangSysCount")
            });
            let tX = new r.AU({
                tag: new r.Ld(4),
                script: new r.$J(r.mL, tW, {
                    type: "parent"
                })
            });
            let tq = new r.mJ(tX, r.mL);
            let tH = new r.mJ(new r.Ld(4), r.mL);
            let tj = new r.AU({
                baseTagList: new r.$J(r.mL, tH),
                baseScriptList: new r.$J(r.mL, tq)
            });
            var tY = new r.bS(r.U7, {
                header: {
                    horizAxis: new r.$J(r.mL, tj),
                    vertAxis: new r.$J(r.mL, tj)
                },
                0x00010000: {},
                0x00010001: {
                    itemVariationStore: new r.$J(r.U7, (0, eQ))
                }
            });
            let t$ = new r.mJ(r.mL, r.mL);
            let tZ = new r.AU({
                coverage: new r.$J(r.mL, (0, eD)),
                glyphCount: r.mL,
                attachPoints: new r.mJ(new r.$J(r.mL, t$), "glyphCount")
            });
            let tK = new r.bS(r.mL, {
                1: {
                    coordinate: r.Af
                },
                2: {
                    caretValuePoint: r.mL
                },
                3: {
                    coordinate: r.Af,
                    deviceTable: new r.$J(r.mL, (0, eE))
                }
            });
            let tQ = new r.mJ(new r.$J(r.mL, tK), r.mL);
            let t0 = new r.AU({
                coverage: new r.$J(r.mL, (0, eD)),
                ligGlyphCount: r.mL,
                ligGlyphs: new r.mJ(new r.$J(r.mL, tQ), "ligGlyphCount")
            });
            let t1 = new r.AU({
                markSetTableFormat: r.mL,
                markSetCount: r.mL,
                coverage: new r.mJ(new r.$J(r.U7, (0, eD)), "markSetCount")
            });
            var t2 = new r.bS(r.U7, {
                header: {
                    glyphClassDef: new r.$J(r.mL, (0, eG)),
                    attachList: new r.$J(r.mL, tZ),
                    ligCaretList: new r.$J(r.mL, t0),
                    markAttachClassDef: new r.$J(r.mL, (0, eG))
                },
                0x00010000: {},
                0x00010002: {
                    markGlyphSetsDef: new r.$J(r.mL, t1)
                },
                0x00010003: {
                    markGlyphSetsDef: new r.$J(r.mL, t1),
                    itemVariationStore: new r.$J(r.U7, (0, eQ))
                }
            });
            let t3 = new r.DL(r.mL, [
                "xPlacement",
                "yPlacement",
                "xAdvance",
                "yAdvance",
                "xPlaDevice",
                "yPlaDevice",
                "xAdvDevice",
                "yAdvDevice"
            ]);
            let t4 = {
                xPlacement: r.Af,
                yPlacement: r.Af,
                xAdvance: r.Af,
                yAdvance: r.Af,
                xPlaDevice: new r.$J(r.mL, (0, eE), {
                    type: "global",
                    relativeTo: (e)=>e.rel
                }),
                yPlaDevice: new r.$J(r.mL, (0, eE), {
                    type: "global",
                    relativeTo: (e)=>e.rel
                }),
                xAdvDevice: new r.$J(r.mL, (0, eE), {
                    type: "global",
                    relativeTo: (e)=>e.rel
                }),
                yAdvDevice: new r.$J(r.mL, (0, eE), {
                    type: "global",
                    relativeTo: (e)=>e.rel
                })
            };
            class t5 {
                buildStruct(e) {
                    let t = e;
                    while(!t[this.key] && t.parent)t = t.parent;
                    if (!t[this.key]) return;
                    let s = {};
                    s.rel = ()=>t._startOffset;
                    let n = t[this.key];
                    for(let a in n)if (n[a]) s[a] = t4[a];
                    return new r.AU(s);
                }
                size(e, t) {
                    return this.buildStruct(t).size(e, t);
                }
                decode(e, t) {
                    let s = this.buildStruct(t).decode(e, t);
                    delete s.rel;
                    return s;
                }
                constructor(e = "valueFormat"){
                    this.key = e;
                }
            }
            let t7 = new r.AU({
                secondGlyph: r.mL,
                value1: new t5("valueFormat1"),
                value2: new t5("valueFormat2")
            });
            let t6 = new r.mJ(t7, r.mL);
            let t9 = new r.AU({
                value1: new t5("valueFormat1"),
                value2: new t5("valueFormat2")
            });
            let t8 = new r.bS(r.mL, {
                1: {
                    xCoordinate: r.Af,
                    yCoordinate: r.Af
                },
                2: {
                    xCoordinate: r.Af,
                    yCoordinate: r.Af,
                    anchorPoint: r.mL
                },
                3: {
                    xCoordinate: r.Af,
                    yCoordinate: r.Af,
                    xDeviceTable: new r.$J(r.mL, (0, eE)),
                    yDeviceTable: new r.$J(r.mL, (0, eE))
                }
            });
            let se = new r.AU({
                entryAnchor: new r.$J(r.mL, t8, {
                    type: "parent"
                }),
                exitAnchor: new r.$J(r.mL, t8, {
                    type: "parent"
                })
            });
            let st = new r.AU({
                class: r.mL,
                markAnchor: new r.$J(r.mL, t8, {
                    type: "parent"
                })
            });
            let ss = new r.mJ(st, r.mL);
            let sr = new r.mJ(new r.$J(r.mL, t8), (e)=>e.parent.classCount);
            let sn = new r.mJ(sr, r.mL);
            let sa = new r.mJ(new r.$J(r.mL, t8), (e)=>e.parent.parent.classCount);
            let sl = new r.mJ(sa, r.mL);
            let si = new r.mJ(new r.$J(r.mL, sl), r.mL);
            let so = new r.bS("lookupType", {
                1: new r.bS(r.mL, {
                    1: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        valueFormat: t3,
                        value: new t5()
                    },
                    2: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        valueFormat: t3,
                        valueCount: r.mL,
                        values: new r.pW(new t5(), "valueCount")
                    }
                }),
                2: new r.bS(r.mL, {
                    1: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        valueFormat1: t3,
                        valueFormat2: t3,
                        pairSetCount: r.mL,
                        pairSets: new r.pW(new r.$J(r.mL, t6), "pairSetCount")
                    },
                    2: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        valueFormat1: t3,
                        valueFormat2: t3,
                        classDef1: new r.$J(r.mL, (0, eG)),
                        classDef2: new r.$J(r.mL, (0, eG)),
                        class1Count: r.mL,
                        class2Count: r.mL,
                        classRecords: new r.pW(new r.pW(t9, "class2Count"), "class1Count")
                    }
                }),
                3: {
                    format: r.mL,
                    coverage: new r.$J(r.mL, (0, eD)),
                    entryExitCount: r.mL,
                    entryExitRecords: new r.mJ(se, "entryExitCount")
                },
                4: {
                    format: r.mL,
                    markCoverage: new r.$J(r.mL, (0, eD)),
                    baseCoverage: new r.$J(r.mL, (0, eD)),
                    classCount: r.mL,
                    markArray: new r.$J(r.mL, ss),
                    baseArray: new r.$J(r.mL, sn)
                },
                5: {
                    format: r.mL,
                    markCoverage: new r.$J(r.mL, (0, eD)),
                    ligatureCoverage: new r.$J(r.mL, (0, eD)),
                    classCount: r.mL,
                    markArray: new r.$J(r.mL, ss),
                    ligatureArray: new r.$J(r.mL, si)
                },
                6: {
                    format: r.mL,
                    mark1Coverage: new r.$J(r.mL, (0, eD)),
                    mark2Coverage: new r.$J(r.mL, (0, eD)),
                    classCount: r.mL,
                    mark1Array: new r.$J(r.mL, ss),
                    mark2Array: new r.$J(r.mL, sn)
                },
                7: (0, eW),
                8: (0, eH),
                9: {
                    posFormat: r.mL,
                    lookupType: r.mL,
                    extension: new r.$J(r.U7, null)
                }
            });
            so.versions[9].extension.type = so;
            var su = new r.bS(r.U7, {
                header: {
                    scriptList: new r.$J(r.mL, (0, eS)),
                    featureList: new r.$J(r.mL, (0, eJ)),
                    lookupList: new r.$J(r.mL, new (0, eO)(so))
                },
                0x00010000: {},
                0x00010001: {
                    featureVariations: new r.$J(r.U7, (0, e5))
                }
            });
            let sc = new r.mJ(r.mL, r.mL);
            let sf = sc;
            let sh = new r.AU({
                glyph: r.mL,
                compCount: r.mL,
                components: new r.mJ(r.mL, (e)=>e.compCount - 1)
            });
            let sd = new r.mJ(new r.$J(r.mL, sh), r.mL);
            let sm = new r.bS("lookupType", {
                1: new r.bS(r.mL, {
                    1: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        deltaGlyphID: r.Af
                    },
                    2: {
                        coverage: new r.$J(r.mL, (0, eD)),
                        glyphCount: r.mL,
                        substitute: new r.pW(r.mL, "glyphCount")
                    }
                }),
                2: {
                    substFormat: r.mL,
                    coverage: new r.$J(r.mL, (0, eD)),
                    count: r.mL,
                    sequences: new r.pW(new r.$J(r.mL, sc), "count")
                },
                3: {
                    substFormat: r.mL,
                    coverage: new r.$J(r.mL, (0, eD)),
                    count: r.mL,
                    alternateSet: new r.pW(new r.$J(r.mL, sf), "count")
                },
                4: {
                    substFormat: r.mL,
                    coverage: new r.$J(r.mL, (0, eD)),
                    count: r.mL,
                    ligatureSets: new r.pW(new r.$J(r.mL, sd), "count")
                },
                5: (0, eW),
                6: (0, eH),
                7: {
                    substFormat: r.mL,
                    lookupType: r.mL,
                    extension: new r.$J(r.U7, null)
                },
                8: {
                    substFormat: r.mL,
                    coverage: new r.$J(r.mL, (0, eD)),
                    backtrackCoverage: new r.mJ(new r.$J(r.mL, (0, eD)), "backtrackGlyphCount"),
                    lookaheadGlyphCount: r.mL,
                    lookaheadCoverage: new r.mJ(new r.$J(r.mL, (0, eD)), "lookaheadGlyphCount"),
                    glyphCount: r.mL,
                    substitutes: new r.mJ(r.mL, "glyphCount")
                }
            });
            sm.versions[7].extension.type = sm;
            var sp = new r.bS(r.U7, {
                header: {
                    scriptList: new r.$J(r.mL, (0, eS)),
                    featureList: new r.$J(r.mL, (0, eJ)),
                    lookupList: new r.$J(r.mL, new (0, eO)(sm))
                },
                0x00010000: {},
                0x00010001: {
                    featureVariations: new r.$J(r.U7, (0, e5))
                }
            });
            let sg = new r.mJ(r.mL, r.mL);
            let sb = new r.AU({
                shrinkageEnableGSUB: new r.$J(r.mL, sg),
                shrinkageDisableGSUB: new r.$J(r.mL, sg),
                shrinkageEnableGPOS: new r.$J(r.mL, sg),
                shrinkageDisableGPOS: new r.$J(r.mL, sg),
                shrinkageJstfMax: new r.$J(r.mL, new (0, eO)((0, so))),
                extensionEnableGSUB: new r.$J(r.mL, sg),
                extensionDisableGSUB: new r.$J(r.mL, sg),
                extensionEnableGPOS: new r.$J(r.mL, sg),
                extensionDisableGPOS: new r.$J(r.mL, sg),
                extensionJstfMax: new r.$J(r.mL, new (0, eO)((0, so)))
            });
            let sy = new r.mJ(new r.$J(r.mL, sb), r.mL);
            let sw = new r.AU({
                tag: new r.Ld(4),
                jstfLangSys: new r.$J(r.mL, sy)
            });
            let sx = new r.AU({
                extenderGlyphs: new r.$J(r.mL, new r.mJ(r.mL, r.mL)),
                defaultLangSys: new r.$J(r.mL, sy),
                langSysCount: r.mL,
                langSysRecords: new r.mJ(sw, "langSysCount")
            });
            let sv = new r.AU({
                tag: new r.Ld(4),
                script: new r.$J(r.mL, sx, {
                    type: "parent"
                })
            });
            var s_ = new r.AU({
                version: r.U7,
                scriptCount: r.mL,
                scriptList: new r.mJ(sv, "scriptCount")
            });
            class sL {
                decode(e, t) {
                    switch(this.size(0, t)){
                        case 1:
                            return e.readUInt8();
                        case 2:
                            return e.readUInt16BE();
                        case 3:
                            return e.readUInt24BE();
                        case 4:
                            return e.readUInt32BE();
                    }
                }
                size(e, t) {
                    return (0, r.dB)(this._size, null, t);
                }
                constructor(e){
                    this._size = e;
                }
            }
            let sC = new r.AU({
                entry: new sL((e)=>((e.parent.entryFormat & 0x0030) >> 4) + 1),
                outerIndex: (e)=>e.entry >> (e.parent.entryFormat & 0x000F) + 1,
                innerIndex: (e)=>e.entry & (1 << (e.parent.entryFormat & 0x000F) + 1) - 1
            });
            let sA = new r.AU({
                entryFormat: r.mL,
                mapCount: r.mL,
                mapData: new r.mJ(sC, "mapCount")
            });
            var sk = new r.AU({
                majorVersion: r.mL,
                minorVersion: r.mL,
                itemVariationStore: new r.$J(r.U7, (0, eQ)),
                advanceWidthMapping: new r.$J(r.U7, sA),
                LSBMapping: new r.$J(r.U7, sA),
                RSBMapping: new r.$J(r.U7, sA)
            });
            let sS = new r.AU({
                format: r.U7,
                length: r.U7,
                offset: r.U7
            });
            let sI = new r.AU({
                reserved: new r.kV(r.mL, 2),
                cbSignature: r.U7,
                signature: new r.lW("cbSignature")
            });
            var sP = new r.AU({
                ulVersion: r.U7,
                usNumSigs: r.mL,
                usFlag: r.mL,
                signatures: new r.mJ(sS, "usNumSigs"),
                signatureBlocks: new r.mJ(sI, "usNumSigs")
            });
            let sU = new r.AU({
                rangeMaxPPEM: r.mL,
                rangeGaspBehavior: new r.DL(r.mL, [
                    "grayscale",
                    "gridfit",
                    "symmetricSmoothing",
                    "symmetricGridfit"
                ])
            });
            var sJ = new r.AU({
                version: r.mL,
                numRanges: r.mL,
                gaspRanges: new r.mJ(sU, "numRanges")
            });
            let sT = new r.AU({
                pixelSize: r.w_,
                maximumWidth: r.w_,
                widths: new r.mJ(r.w_, (e)=>e.parent.parent.maxp.numGlyphs)
            });
            var sO = new r.AU({
                version: r.mL,
                numRecords: r.Af,
                sizeDeviceRecord: r.LB,
                records: new r.mJ(sT, "numRecords")
            });
            let sF = new r.AU({
                left: r.mL,
                right: r.mL,
                value: r.Af
            });
            let sD = new r.AU({
                firstGlyph: r.mL,
                nGlyphs: r.mL,
                offsets: new r.mJ(r.mL, "nGlyphs"),
                max: (e)=>e.offsets.length && Math.max.apply(Math, e.offsets)
            });
            let sM = new r.AU({
                off: (e)=>e._startOffset - e.parent.parent._startOffset,
                len: (e)=>((e.parent.leftTable.max - e.off) / e.parent.rowWidth + 1) * (e.parent.rowWidth / 2),
                values: new r.pW(r.Af, "len")
            });
            let sG = new r.bS("format", {
                0: {
                    nPairs: r.mL,
                    searchRange: r.mL,
                    entrySelector: r.mL,
                    rangeShift: r.mL,
                    pairs: new r.mJ(sF, "nPairs")
                },
                2: {
                    rowWidth: r.mL,
                    leftTable: new r.$J(r.mL, sD, {
                        type: "parent"
                    }),
                    rightTable: new r.$J(r.mL, sD, {
                        type: "parent"
                    }),
                    array: new r.$J(r.mL, sM, {
                        type: "parent"
                    })
                },
                3: {
                    glyphCount: r.mL,
                    kernValueCount: r.w_,
                    leftClassCount: r.w_,
                    rightClassCount: r.w_,
                    flags: r.w_,
                    kernValue: new r.mJ(r.Af, "kernValueCount"),
                    leftClass: new r.mJ(r.w_, "glyphCount"),
                    rightClass: new r.mJ(r.w_, "glyphCount"),
                    kernIndex: new r.mJ(r.w_, (e)=>e.leftClassCount * e.rightClassCount)
                }
            });
            let sE = new r.bS("version", {
                0: {
                    subVersion: r.mL,
                    length: r.mL,
                    format: r.w_,
                    coverage: new r.DL(r.w_, [
                        "horizontal",
                        "minimum",
                        "crossStream",
                        "override"
                    ]),
                    subtable: sG,
                    padding: new r.kV(r.w_, (e)=>e.length - e._currentOffset)
                },
                1: {
                    length: r.U7,
                    coverage: new r.DL(r.w_, [
                        null,
                        null,
                        null,
                        null,
                        null,
                        "variation",
                        "crossStream",
                        "vertical"
                    ]),
                    format: r.w_,
                    tupleIndex: r.mL,
                    subtable: sG,
                    padding: new r.kV(r.w_, (e)=>e.length - e._currentOffset)
                }
            });
            var sB = new r.bS(r.mL, {
                0: {
                    nTables: r.mL,
                    tables: new r.mJ(sE, "nTables")
                },
                1: {
                    reserved: new r.kV(r.mL),
                    nTables: r.U7,
                    tables: new r.mJ(sE, "nTables")
                }
            });
            var sV = new r.AU({
                version: r.mL,
                numGlyphs: r.mL,
                yPels: new r.mJ(r.w_, "numGlyphs")
            });
            var sz = new r.AU({
                version: r.mL,
                fontNumber: r.U7,
                pitch: r.mL,
                xHeight: r.mL,
                style: r.mL,
                typeFamily: r.mL,
                capHeight: r.mL,
                symbolSet: r.mL,
                typeface: new r.Ld(16),
                characterComplement: new r.Ld(8),
                fileName: new r.Ld(6),
                strokeWeight: new r.Ld(1),
                widthType: new r.Ld(1),
                serifStyle: r.w_,
                reserved: new r.kV(r.w_)
            });
            let sR = new r.AU({
                bCharSet: r.w_,
                xRatio: r.w_,
                yStartRatio: r.w_,
                yEndRatio: r.w_
            });
            let sN = new r.AU({
                yPelHeight: r.mL,
                yMax: r.Af,
                yMin: r.Af
            });
            let sW = new r.AU({
                recs: r.mL,
                startsz: r.w_,
                endsz: r.w_,
                entries: new r.mJ(sN, "recs")
            });
            var sX = new r.AU({
                version: r.mL,
                numRecs: r.mL,
                numRatios: r.mL,
                ratioRanges: new r.mJ(sR, "numRatios"),
                offsets: new r.mJ(r.mL, "numRatios"),
                groups: new r.mJ(sW, "numRecs")
            });
            var sq = new r.AU({
                version: r.mL,
                ascent: r.Af,
                descent: r.Af,
                lineGap: r.Af,
                advanceHeightMax: r.Af,
                minTopSideBearing: r.Af,
                minBottomSideBearing: r.Af,
                yMaxExtent: r.Af,
                caretSlopeRise: r.Af,
                caretSlopeRun: r.Af,
                caretOffset: r.Af,
                reserved: new r.kV(r.Af, 4),
                metricDataFormat: r.Af,
                numberOfMetrics: r.mL
            });
            let sH = new r.AU({
                advance: r.mL,
                bearing: r.Af
            });
            var sj = new r.AU({
                metrics: new r.pW(sH, (e)=>e.parent.vhea.numberOfMetrics),
                bearings: new r.pW(r.Af, (e)=>e.parent.maxp.numGlyphs - e.parent.vhea.numberOfMetrics)
            });
            let sY = new r.gb(16, "BE", 14);
            let s$ = new r.AU({
                fromCoord: sY,
                toCoord: sY
            });
            let sZ = new r.AU({
                pairCount: r.mL,
                correspondence: new r.mJ(s$, "pairCount")
            });
            var sK = new r.AU({
                version: r.E2,
                axisCount: r.U7,
                segment: new r.mJ(sZ, "axisCount")
            });
            class sQ {
                getItem(e) {
                    if (this._items[e] == null) {
                        let t = this.stream.pos;
                        this.stream.pos = this.base + this.type.size(null, this.parent) * e;
                        this._items[e] = this.type.decode(this.stream, this.parent);
                        this.stream.pos = t;
                    }
                    return this._items[e];
                }
                inspect() {
                    return `[UnboundedArray ${this.type.constructor.name}]`;
                }
                constructor(e, t, s){
                    this.type = e;
                    this.stream = t;
                    this.parent = s;
                    this.base = this.stream.pos;
                    this._items = [];
                }
            }
            class s0 extends r.mJ {
                decode(e, t) {
                    return new sQ(this.type, e, t);
                }
                constructor(e){
                    super(e, 0);
                }
            }
            let s1 = function(e = r.mL) {
                class t {
                    decode(e, t) {
                        t = t.parent.parent;
                        return this.type.decode(e, t);
                    }
                    size(e, t) {
                        t = t.parent.parent;
                        return this.type.size(e, t);
                    }
                    encode(e, t, s) {
                        s = s.parent.parent;
                        return this.type.encode(e, t, s);
                    }
                    constructor(e){
                        this.type = e;
                    }
                }
                e = new t(e);
                let s = new r.AU({
                    unitSize: r.mL,
                    nUnits: r.mL,
                    searchRange: r.mL,
                    entrySelector: r.mL,
                    rangeShift: r.mL
                });
                let n = new r.AU({
                    lastGlyph: r.mL,
                    firstGlyph: r.mL,
                    value: e
                });
                let a = new r.AU({
                    lastGlyph: r.mL,
                    firstGlyph: r.mL,
                    values: new r.$J(r.mL, new r.mJ(e, (e)=>e.lastGlyph - e.firstGlyph + 1), {
                        type: "parent"
                    })
                });
                let l = new r.AU({
                    glyph: r.mL,
                    value: e
                });
                return new r.bS(r.mL, {
                    0: {
                        values: new s0(e)
                    },
                    2: {
                        binarySearchHeader: s,
                        segments: new r.mJ(n, (e)=>e.binarySearchHeader.nUnits)
                    },
                    4: {
                        binarySearchHeader: s,
                        segments: new r.mJ(a, (e)=>e.binarySearchHeader.nUnits)
                    },
                    6: {
                        binarySearchHeader: s,
                        segments: new r.mJ(l, (e)=>e.binarySearchHeader.nUnits)
                    },
                    8: {
                        firstGlyph: r.mL,
                        count: r.mL,
                        values: new r.mJ(e, "count")
                    }
                });
            };
            function s2(e = {}, t = r.mL) {
                let s = Object.assign({
                    newState: r.mL,
                    flags: r.mL
                }, e);
                let n = new r.AU(s);
                let a = new s0(new r.mJ(r.mL, (e)=>e.nClasses));
                let l = new r.AU({
                    nClasses: r.U7,
                    classTable: new r.$J(r.U7, new s1(t)),
                    stateArray: new r.$J(r.U7, a),
                    entryTable: new r.$J(r.U7, new s0(n))
                });
                return l;
            }
            function s3(e = {}, t = r.mL) {
                let s = new r.AU({
                    version () {
                        return 8;
                    },
                    firstGlyph: r.mL,
                    values: new r.mJ(r.w_, r.mL)
                });
                let n = Object.assign({
                    newStateOffset: r.mL,
                    newState: (e)=>(e.newStateOffset - (e.parent.stateArray.base - e.parent._startOffset)) / e.parent.nClasses,
                    flags: r.mL
                }, e);
                let a = new r.AU(n);
                let l = new s0(new r.mJ(r.w_, (e)=>e.nClasses));
                let i = new r.AU({
                    nClasses: r.mL,
                    classTable: new r.$J(r.mL, s),
                    stateArray: new r.$J(r.mL, l),
                    entryTable: new r.$J(r.mL, new s0(a))
                });
                return i;
            }
            let s4 = new r.bS("format", {
                0: {
                    deltas: new r.mJ(r.Af, 32)
                },
                1: {
                    deltas: new r.mJ(r.Af, 32),
                    mappingData: new (0, s1)(r.mL)
                },
                2: {
                    standardGlyph: r.mL,
                    controlPoints: new r.mJ(r.mL, 32)
                },
                3: {
                    standardGlyph: r.mL,
                    controlPoints: new r.mJ(r.mL, 32),
                    mappingData: new (0, s1)(r.mL)
                }
            });
            var s5 = new r.AU({
                version: r.E2,
                format: r.mL,
                defaultBaseline: r.mL,
                subtable: s4
            });
            let s7 = new r.AU({
                setting: r.mL,
                nameIndex: r.Af,
                name: (e)=>e.parent.parent.parent.name.records.fontFeatures[e.nameIndex]
            });
            let s6 = new r.AU({
                feature: r.mL,
                nSettings: r.mL,
                settingTable: new r.$J(r.U7, new r.mJ(s7, "nSettings"), {
                    type: "parent"
                }),
                featureFlags: new r.DL(r.w_, [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "hasDefault",
                    "exclusive"
                ]),
                defaultSetting: r.w_,
                nameIndex: r.Af,
                name: (e)=>e.parent.parent.name.records.fontFeatures[e.nameIndex]
            });
            var s9 = new r.AU({
                version: r.E2,
                featureNameCount: r.mL,
                reserved1: new r.kV(r.mL),
                reserved2: new r.kV(r.U7),
                featureNames: new r.mJ(s6, "featureNameCount")
            });
            let s8 = new r.AU({
                axisTag: new r.Ld(4),
                minValue: r.E2,
                defaultValue: r.E2,
                maxValue: r.E2,
                flags: r.mL,
                nameID: r.mL,
                name: (e)=>e.parent.parent.name.records.fontFeatures[e.nameID]
            });
            let re = new r.AU({
                nameID: r.mL,
                name: (e)=>e.parent.parent.name.records.fontFeatures[e.nameID],
                flags: r.mL,
                coord: new r.mJ(r.E2, (e)=>e.parent.axisCount),
                postscriptNameID: new r.Fi(r.mL, (e)=>e.parent.instanceSize - e._currentOffset > 0)
            });
            var rt = new r.AU({
                version: r.E2,
                offsetToData: r.mL,
                countSizePairs: r.mL,
                axisCount: r.mL,
                axisSize: r.mL,
                instanceCount: r.mL,
                instanceSize: r.mL,
                axis: new r.mJ(s8, "axisCount"),
                instance: new r.mJ(re, "instanceCount")
            });
            let rs = new r.gb(16, "BE", 14);
            class rr {
                static decode(e, t) {
                    return t.flags ? e.readUInt32BE() : e.readUInt16BE() * 2;
                }
            }
            let rn = new r.AU({
                version: r.mL,
                reserved: new r.kV(r.mL),
                axisCount: r.mL,
                globalCoordCount: r.mL,
                globalCoords: new r.$J(r.U7, new r.mJ(new r.mJ(rs, "axisCount"), "globalCoordCount")),
                glyphCount: r.mL,
                flags: r.mL,
                offsetToData: r.U7,
                offsets: new r.mJ(new r.$J(rr, "void", {
                    relativeTo: (e)=>e.offsetToData,
                    allowNull: false
                }), (e)=>e.glyphCount + 1)
            });
            var ra = rn;
            let rl = new r.AU({
                length: r.mL,
                coverage: r.mL,
                subFeatureFlags: r.U7,
                stateTable: new (0, s3)
            });
            let ri = new r.AU({
                justClass: r.U7,
                beforeGrowLimit: r.E2,
                beforeShrinkLimit: r.E2,
                afterGrowLimit: r.E2,
                afterShrinkLimit: r.E2,
                growFlags: r.mL,
                shrinkFlags: r.mL
            });
            let ro = new r.mJ(ri, r.U7);
            let ru = new r.bS("actionType", {
                0: {
                    lowerLimit: r.E2,
                    upperLimit: r.E2,
                    order: r.mL,
                    glyphs: new r.mJ(r.mL, r.mL)
                },
                1: {
                    addGlyph: r.mL
                },
                2: {
                    substThreshold: r.E2,
                    addGlyph: r.mL,
                    substGlyph: r.mL
                },
                3: {},
                4: {
                    variationAxis: r.U7,
                    minimumLimit: r.E2,
                    noStretchValue: r.E2,
                    maximumLimit: r.E2
                },
                5: {
                    flags: r.mL,
                    glyph: r.mL
                }
            });
            let rc = new r.AU({
                actionClass: r.mL,
                actionType: r.mL,
                actionLength: r.U7,
                actionData: ru,
                padding: new r.kV(r.w_, (e)=>e.actionLength - e._currentOffset)
            });
            let rf = new r.mJ(rc, r.U7);
            let rh = new r.AU({
                lookupTable: new (0, s1)(new r.$J(r.mL, rf))
            });
            let rd = new r.AU({
                classTable: new r.$J(r.mL, rl, {
                    type: "parent"
                }),
                wdcOffset: r.mL,
                postCompensationTable: new r.$J(r.mL, rh, {
                    type: "parent"
                }),
                widthDeltaClusters: new (0, s1)(new r.$J(r.mL, ro, {
                    type: "parent",
                    relativeTo: (e)=>e.wdcOffset
                }))
            });
            var rm = new r.AU({
                version: r.U7,
                format: r.mL,
                horizontal: new r.$J(r.mL, rd),
                vertical: new r.$J(r.mL, rd)
            });
            let rp = {
                action: r.mL
            };
            let rg = {
                markIndex: r.mL,
                currentIndex: r.mL
            };
            let rb = {
                currentInsertIndex: r.mL,
                markedInsertIndex: r.mL
            };
            let ry = new r.AU({
                items: new (0, s0)(new r.$J(r.U7, new (0, s1)))
            });
            let rw = new r.bS("type", {
                0: {
                    stateTable: new (0, s2)
                },
                1: {
                    stateTable: new (0, s2)(rg),
                    substitutionTable: new r.$J(r.U7, ry)
                },
                2: {
                    stateTable: new (0, s2)(rp),
                    ligatureActions: new r.$J(r.U7, new (0, s0)(r.U7)),
                    components: new r.$J(r.U7, new (0, s0)(r.mL)),
                    ligatureList: new r.$J(r.U7, new (0, s0)(r.mL))
                },
                4: {
                    lookupTable: new (0, s1)
                },
                5: {
                    stateTable: new (0, s2)(rb),
                    insertionActions: new r.$J(r.U7, new (0, s0)(r.mL))
                }
            });
            let rx = new r.AU({
                length: r.U7,
                coverage: r.Un,
                type: r.w_,
                subFeatureFlags: r.U7,
                table: rw,
                padding: new r.kV(r.w_, (e)=>e.length - e._currentOffset)
            });
            let rv = new r.AU({
                featureType: r.mL,
                featureSetting: r.mL,
                enableFlags: r.U7,
                disableFlags: r.U7
            });
            let r_ = new r.AU({
                defaultFlags: r.U7,
                chainLength: r.U7,
                nFeatureEntries: r.U7,
                nSubtables: r.U7,
                features: new r.mJ(rv, "nFeatureEntries"),
                subtables: new r.mJ(rx, "nSubtables")
            });
            var rL = new r.AU({
                version: r.mL,
                unused: new r.kV(r.mL),
                nChains: r.U7,
                chains: new r.mJ(r_, "nChains")
            });
            let rC = new r.AU({
                left: r.Af,
                top: r.Af,
                right: r.Af,
                bottom: r.Af
            });
            var rA = new r.AU({
                version: r.E2,
                format: r.mL,
                lookupTable: new (0, s1)(rC)
            });
            let rk = {};
            var rS = rk;
            rk.cmap = (0, T);
            rk.head = (0, O);
            rk.hhea = (0, F);
            rk.hmtx = (0, M);
            rk.maxp = (0, G);
            rk.name = (0, Y);
            rk["OS/2"] = (0, Q);
            rk.post = (0, ee);
            rk.fpgm = (0, es);
            rk.loca = (0, en);
            rk.prep = (0, ea);
            rk["cvt "] = (0, et);
            rk.glyf = (0, el);
            rk["CFF "] = (0, tb);
            rk["CFF2"] = (0, tb);
            rk.VORG = (0, tw);
            rk.EBLC = (0, tJ);
            rk.CBLC = rk.EBLC;
            rk.sbix = (0, tO);
            rk.COLR = (0, tM);
            rk.CPAL = (0, tE);
            rk.BASE = (0, tY);
            rk.GDEF = (0, t2);
            rk.GPOS = (0, su);
            rk.GSUB = (0, sp);
            rk.JSTF = (0, s_);
            rk.HVAR = (0, sk);
            rk.DSIG = (0, sP);
            rk.gasp = (0, sJ);
            rk.hdmx = (0, sO);
            rk.kern = (0, sB);
            rk.LTSH = (0, sV);
            rk.PCLT = (0, sz);
            rk.VDMX = (0, sX);
            rk.vhea = (0, sq);
            rk.vmtx = (0, sj);
            rk.avar = (0, sK);
            rk.bsln = (0, s5);
            rk.feat = (0, s9);
            rk.fvar = (0, rt);
            rk.gvar = (0, ra);
            rk.just = (0, rm);
            rk.morx = (0, rL);
            rk.opbd = (0, rA);
            let rI = new r.AU({
                tag: new r.Ld(4),
                checkSum: r.U7,
                offset: new r.$J(r.U7, "void", {
                    type: "global"
                }),
                length: r.U7
            });
            let rP = new r.AU({
                tag: new r.Ld(4),
                numTables: r.mL,
                searchRange: r.mL,
                entrySelector: r.mL,
                rangeShift: r.mL,
                tables: new r.mJ(rI, "numTables")
            });
            rP.process = function() {
                let e = {};
                for (let t of this.tables)e[t.tag] = t;
                this.tables = e;
            };
            rP.preEncode = function() {
                if (!Array.isArray(this.tables)) {
                    let e = [];
                    for(let t in this.tables){
                        let s = this.tables[t];
                        if (s) e.push({
                            tag: t,
                            checkSum: 0,
                            offset: new r.ox((0, rS)[t], s),
                            length: (0, rS)[t].size(s)
                        });
                    }
                    this.tables = e;
                }
                this.tag = "true";
                this.numTables = this.tables.length;
                let n = Math.floor(Math.log(this.numTables) / Math.LN2);
                let a = Math.pow(2, n);
                this.searchRange = a * 16;
                this.entrySelector = Math.log(a) / Math.LN2;
                this.rangeShift = this.numTables * 16 - this.searchRange;
            };
            var rU = rP;
            function rJ(e, t) {
                let s = 0;
                let r = e.length - 1;
                while(s <= r){
                    let n = s + r >> 1;
                    let a = t(e[n]);
                    if (a < 0) r = n - 1;
                    else if (a > 0) s = n + 1;
                    else return n;
                }
                return -1;
            }
            function rT(e, t) {
                let s = [];
                while(e < t)s.push(e++);
                return s;
            }
            const rO = new TextDecoder("ascii");
            const rF = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            const rD = new Uint8Array(256);
            for(let rM = 0; rM < rF.length; rM++)rD[rF.charCodeAt(rM)] = rM;
            function rG(e) {
                let t = e.length * 0.75;
                if (e[e.length - 1] === "=") {
                    t--;
                    if (e[e.length - 2] === "=") t--;
                }
                let s = new Uint8Array(t);
                let r = 0;
                for(let n = 0, a = e.length; n < a; n += 4){
                    let l = rD[e.charCodeAt(n)];
                    let i = rD[e.charCodeAt(n + 1)];
                    let o = rD[e.charCodeAt(n + 2)];
                    let u = rD[e.charCodeAt(n + 3)];
                    s[r++] = l << 2 | i >> 4;
                    s[r++] = (i & 15) << 4 | o >> 2;
                    s[r++] = (o & 3) << 6 | u & 63;
                }
                return s;
            }
            class rE {
                findSubtable(e, t) {
                    for (let [s, r] of t)for (let n of e.tables){
                        if (n.platformID === s && n.encodingID === r) return n.table;
                    }
                    return null;
                }
                lookup(e, t) {
                    if (this.encoding) e = this.encoding.get(e) || e;
                    else if (t) {
                        let s = this.getVariationSelector(e, t);
                        if (s) return s;
                    }
                    let r = this.cmap;
                    switch(r.version){
                        case 0:
                            return r.codeMap.get(e) || 0;
                        case 4:
                            {
                                let n = 0;
                                let a = r.segCount - 1;
                                while(n <= a){
                                    let l = n + a >> 1;
                                    if (e < r.startCode.get(l)) a = l - 1;
                                    else if (e > r.endCode.get(l)) n = l + 1;
                                    else {
                                        let i = r.idRangeOffset.get(l);
                                        let o;
                                        if (i === 0) o = e + r.idDelta.get(l);
                                        else {
                                            let u = i / 2 + (e - r.startCode.get(l)) - (r.segCount - l);
                                            o = r.glyphIndexArray.get(u) || 0;
                                            if (o !== 0) o += r.idDelta.get(l);
                                        }
                                        return o & 0xffff;
                                    }
                                }
                                return 0;
                            }
                        case 8:
                            throw new Error("TODO: cmap format 8");
                        case 6:
                        case 10:
                            return r.glyphIndices.get(e - r.firstCode) || 0;
                        case 12:
                        case 13:
                            {
                                let c = 0;
                                let f = r.nGroups - 1;
                                while(c <= f){
                                    let h = c + f >> 1;
                                    let d = r.groups.get(h);
                                    if (e < d.startCharCode) f = h - 1;
                                    else if (e > d.endCharCode) c = h + 1;
                                    else {
                                        if (r.version === 12) return d.glyphID + (e - d.startCharCode);
                                        else return d.glyphID;
                                    }
                                }
                                return 0;
                            }
                        case 14:
                            throw new Error("TODO: cmap format 14");
                        default:
                            throw new Error(`Unknown cmap format ${r.version}`);
                    }
                }
                getVariationSelector(e, t) {
                    if (!this.uvs) return 0;
                    let s = this.uvs.varSelectors.toArray();
                    let r = (0, rJ)(s, (e)=>t - e.varSelector);
                    let n = s[r];
                    if (r !== -1 && n.defaultUVS) r = (0, rJ)(n.defaultUVS, (t)=>e < t.startUnicodeValue ? -1 : e > t.startUnicodeValue + t.additionalCount ? 1 : 0);
                    if (r !== -1 && n.nonDefaultUVS) {
                        r = (0, rJ)(n.nonDefaultUVS, (t)=>e - t.unicodeValue);
                        if (r !== -1) return n.nonDefaultUVS[r].glyphID;
                    }
                    return 0;
                }
                getCharacterSet() {
                    let e = this.cmap;
                    switch(e.version){
                        case 0:
                            return (0, rT)(0, e.codeMap.length);
                        case 4:
                            {
                                let t = [];
                                let s = e.endCode.toArray();
                                for(let r = 0; r < s.length; r++){
                                    let n = s[r] + 1;
                                    let a = e.startCode.get(r);
                                    t.push(...(0, rT)(a, n));
                                }
                                return t;
                            }
                        case 8:
                            throw new Error("TODO: cmap format 8");
                        case 6:
                        case 10:
                            return (0, rT)(e.firstCode, e.firstCode + e.glyphIndices.length);
                        case 12:
                        case 13:
                            {
                                let l = [];
                                for (let i of e.groups.toArray())l.push(...(0, rT)(i.startCharCode, i.endCharCode + 1));
                                return l;
                            }
                        case 14:
                            throw new Error("TODO: cmap format 14");
                        default:
                            throw new Error(`Unknown cmap format ${e.version}`);
                    }
                }
                codePointsForGlyph(e) {
                    let t = this.cmap;
                    switch(t.version){
                        case 0:
                            {
                                let s = [];
                                for(let r = 0; r < 256; r++)if (t.codeMap.get(r) === e) s.push(r);
                                return s;
                            }
                        case 4:
                            {
                                let n = [];
                                for(let a = 0; a < t.segCount; a++){
                                    let l = t.endCode.get(a);
                                    let i = t.startCode.get(a);
                                    let o = t.idRangeOffset.get(a);
                                    let u = t.idDelta.get(a);
                                    for(var c = i; c <= l; c++){
                                        let f = 0;
                                        if (o === 0) f = c + u;
                                        else {
                                            let h = o / 2 + (c - i) - (t.segCount - a);
                                            f = t.glyphIndexArray.get(h) || 0;
                                            if (f !== 0) f += u;
                                        }
                                        if (f === e) n.push(c);
                                    }
                                }
                                return n;
                            }
                        case 12:
                            {
                                let d = [];
                                for (let m of t.groups.toArray())if (e >= m.glyphID && e <= m.glyphID + (m.endCharCode - m.startCharCode)) d.push(m.startCharCode + (e - m.glyphID));
                                return d;
                            }
                        case 13:
                            {
                                let p = [];
                                for (let g of t.groups.toArray())if (e === g.glyphID) p.push(...(0, rT)(g.startCharCode, g.endCharCode + 1));
                                return p;
                            }
                        default:
                            throw new Error(`Unknown cmap format ${t.version}`);
                    }
                }
                constructor(e){
                    this.encoding = null;
                    this.cmap = this.findSubtable(e, [
                        [
                            3,
                            10
                        ],
                        [
                            0,
                            6
                        ],
                        [
                            0,
                            4
                        ],
                        [
                            3,
                            1
                        ],
                        [
                            0,
                            3
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            0,
                            1
                        ],
                        [
                            0,
                            0
                        ]
                    ]);
                    if (!this.cmap) for (let t of e.tables){
                        let s = (0, E)(t.platformID, t.encodingID, t.table.language - 1);
                        let r = (0, R)(s);
                        if (r) {
                            this.cmap = t.table;
                            this.encoding = r;
                        }
                    }
                    if (!this.cmap) throw new Error("Could not find a supported cmap table");
                    this.uvs = this.findSubtable(e, [
                        [
                            0,
                            5
                        ]
                    ]);
                    if (this.uvs && this.uvs.version !== 14) this.uvs = null;
                }
            }
            (0, a.__decorate)([
                (0, _)
            ], rE.prototype, "getCharacterSet", null);
            (0, a.__decorate)([
                (0, _)
            ], rE.prototype, "codePointsForGlyph", null);
            class rB {
                process(e, t) {
                    for(let s = 0; s < e.length - 1; s++){
                        let r = e[s].id;
                        let n = e[s + 1].id;
                        t[s].xAdvance += this.getKerning(r, n);
                    }
                }
                getKerning(e, t) {
                    let s = 0;
                    for (let r of this.kern.tables){
                        if (r.coverage.crossStream) continue;
                        switch(r.version){
                            case 0:
                                if (!r.coverage.horizontal) continue;
                                break;
                            case 1:
                                if (r.coverage.vertical || r.coverage.variation) continue;
                                break;
                            default:
                                throw new Error(`Unsupported kerning table version ${r.version}`);
                        }
                        let n = 0;
                        let a = r.subtable;
                        switch(r.format){
                            case 0:
                                let l = (0, rJ)(a.pairs, function(s) {
                                    return e - s.left || t - s.right;
                                });
                                if (l >= 0) n = a.pairs[l].value;
                                break;
                            case 2:
                                let i = 0, o = 0;
                                if (e >= a.leftTable.firstGlyph && e < a.leftTable.firstGlyph + a.leftTable.nGlyphs) i = a.leftTable.offsets[e - a.leftTable.firstGlyph];
                                else i = a.array.off;
                                if (t >= a.rightTable.firstGlyph && t < a.rightTable.firstGlyph + a.rightTable.nGlyphs) o = a.rightTable.offsets[t - a.rightTable.firstGlyph];
                                let u = (i + o - a.array.off) / 2;
                                n = a.array.values.get(u);
                                break;
                            case 3:
                                if (e >= a.glyphCount || t >= a.glyphCount) return 0;
                                n = a.kernValue[a.kernIndex[a.leftClass[e] * a.rightClassCount + a.rightClass[t]]];
                                break;
                            default:
                                throw new Error(`Unsupported kerning sub-table format ${r.format}`);
                        }
                        if (r.coverage.override) s = n;
                        else s += n;
                    }
                    return s;
                }
                constructor(e){
                    this.kern = e.kern;
                }
            }
            class rV {
                positionGlyphs(e, t) {
                    let s = 0;
                    let r = 0;
                    for(let n = 0; n < e.length; n++){
                        let a = e[n];
                        if (a.isMark) r = n;
                        else {
                            if (s !== r) this.positionCluster(e, t, s, r);
                            s = r = n;
                        }
                    }
                    if (s !== r) this.positionCluster(e, t, s, r);
                    return t;
                }
                positionCluster(e, t, s, r) {
                    let n = e[s];
                    let a = n.cbox.copy();
                    if (n.codePoints.length > 1) a.minX += (n.codePoints.length - 1) * a.width / n.codePoints.length;
                    let l = -t[s].xAdvance;
                    let i = 0;
                    let o = this.font.unitsPerEm / 16;
                    for(let u = s + 1; u <= r; u++){
                        let c = e[u];
                        let f = c.cbox;
                        let h = t[u];
                        let d = this.getCombiningClass(c.codePoints[0]);
                        if (d !== "Not_Reordered") {
                            h.xOffset = h.yOffset = 0;
                            switch(d){
                                case "Double_Above":
                                case "Double_Below":
                                    h.xOffset += a.minX - f.width / 2 - f.minX;
                                    break;
                                case "Attached_Below_Left":
                                case "Below_Left":
                                case "Above_Left":
                                    h.xOffset += a.minX - f.minX;
                                    break;
                                case "Attached_Above_Right":
                                case "Below_Right":
                                case "Above_Right":
                                    h.xOffset += a.maxX - f.width - f.minX;
                                    break;
                                default:
                                    h.xOffset += a.minX + (a.width - f.width) / 2 - f.minX;
                            }
                            switch(d){
                                case "Double_Below":
                                case "Below_Left":
                                case "Below":
                                case "Below_Right":
                                case "Attached_Below_Left":
                                case "Attached_Below":
                                    if (d === "Attached_Below_Left" || d === "Attached_Below") a.minY += o;
                                    h.yOffset = -a.minY - f.maxY;
                                    a.minY += f.height;
                                    break;
                                case "Double_Above":
                                case "Above_Left":
                                case "Above":
                                case "Above_Right":
                                case "Attached_Above":
                                case "Attached_Above_Right":
                                    if (d === "Attached_Above" || d === "Attached_Above_Right") a.maxY += o;
                                    h.yOffset = a.maxY - f.minY;
                                    a.maxY += f.height;
                                    break;
                            }
                            h.xAdvance = h.yAdvance = 0;
                            h.xOffset += l;
                            h.yOffset += i;
                        } else {
                            l -= h.xAdvance;
                            i -= h.yAdvance;
                        }
                    }
                    return;
                }
                getCombiningClass(e) {
                    let t = (0, i.gy)(e);
                    if ((e & -256) === 0x0e00) {
                        if (t === "Not_Reordered") switch(e){
                            case 0x0e31:
                            case 0x0e34:
                            case 0x0e35:
                            case 0x0e36:
                            case 0x0e37:
                            case 0x0e47:
                            case 0x0e4c:
                            case 0x0e3d:
                            case 0x0e4e:
                                return "Above_Right";
                            case 0x0eb1:
                            case 0x0eb4:
                            case 0x0eb5:
                            case 0x0eb6:
                            case 0x0eb7:
                            case 0x0ebb:
                            case 0x0ecc:
                            case 0x0ecd:
                                return "Above";
                            case 0x0ebc:
                                return "Below";
                        }
                        else if (e === 0x0e3a) return "Below_Right";
                    }
                    switch(t){
                        case "CCC10":
                        case "CCC11":
                        case "CCC12":
                        case "CCC13":
                        case "CCC14":
                        case "CCC15":
                        case "CCC16":
                        case "CCC17":
                        case "CCC18":
                        case "CCC20":
                        case "CCC22":
                            return "Below";
                        case "CCC23":
                            return "Attached_Above";
                        case "CCC24":
                            return "Above_Right";
                        case "CCC25":
                        case "CCC19":
                            return "Above_Left";
                        case "CCC26":
                            return "Above";
                        case "CCC21":
                            break;
                        case "CCC27":
                        case "CCC28":
                        case "CCC30":
                        case "CCC31":
                        case "CCC33":
                        case "CCC34":
                        case "CCC35":
                        case "CCC36":
                            return "Above";
                        case "CCC29":
                        case "CCC32":
                            return "Below";
                        case "CCC103":
                            return "Below_Right";
                        case "CCC107":
                            return "Above_Right";
                        case "CCC118":
                            return "Below";
                        case "CCC122":
                            return "Above";
                        case "CCC129":
                        case "CCC132":
                            return "Below";
                        case "CCC130":
                            return "Above";
                    }
                    return t;
                }
                constructor(e){
                    this.font = e;
                }
            }
            class rz {
                get width() {
                    return this.maxX - this.minX;
                }
                get height() {
                    return this.maxY - this.minY;
                }
                addPoint(e, t) {
                    if (Math.abs(e) !== Infinity) {
                        if (e < this.minX) this.minX = e;
                        if (e > this.maxX) this.maxX = e;
                    }
                    if (Math.abs(t) !== Infinity) {
                        if (t < this.minY) this.minY = t;
                        if (t > this.maxY) this.maxY = t;
                    }
                }
                copy() {
                    return new rz(this.minX, this.minY, this.maxX, this.maxY);
                }
                constructor(e = Infinity, t = Infinity, s = -Infinity, r = -Infinity){
                    this.minX = e;
                    this.minY = t;
                    this.maxX = s;
                    this.maxY = r;
                }
            }
            const rR = {
                Caucasian_Albanian: "aghb",
                Arabic: "arab",
                Imperial_Aramaic: "armi",
                Armenian: "armn",
                Avestan: "avst",
                Balinese: "bali",
                Bamum: "bamu",
                Bassa_Vah: "bass",
                Batak: "batk",
                Bengali: [
                    "bng2",
                    "beng"
                ],
                Bopomofo: "bopo",
                Brahmi: "brah",
                Braille: "brai",
                Buginese: "bugi",
                Buhid: "buhd",
                Chakma: "cakm",
                Canadian_Aboriginal: "cans",
                Carian: "cari",
                Cham: "cham",
                Cherokee: "cher",
                Coptic: "copt",
                Cypriot: "cprt",
                Cyrillic: "cyrl",
                Devanagari: [
                    "dev2",
                    "deva"
                ],
                Deseret: "dsrt",
                Duployan: "dupl",
                Egyptian_Hieroglyphs: "egyp",
                Elbasan: "elba",
                Ethiopic: "ethi",
                Georgian: "geor",
                Glagolitic: "glag",
                Gothic: "goth",
                Grantha: "gran",
                Greek: "grek",
                Gujarati: [
                    "gjr2",
                    "gujr"
                ],
                Gurmukhi: [
                    "gur2",
                    "guru"
                ],
                Hangul: "hang",
                Han: "hani",
                Hanunoo: "hano",
                Hebrew: "hebr",
                Hiragana: "hira",
                Pahawh_Hmong: "hmng",
                Katakana_Or_Hiragana: "hrkt",
                Old_Italic: "ital",
                Javanese: "java",
                Kayah_Li: "kali",
                Katakana: "kana",
                Kharoshthi: "khar",
                Khmer: "khmr",
                Khojki: "khoj",
                Kannada: [
                    "knd2",
                    "knda"
                ],
                Kaithi: "kthi",
                Tai_Tham: "lana",
                Lao: "lao ",
                Latin: "latn",
                Lepcha: "lepc",
                Limbu: "limb",
                Linear_A: "lina",
                Linear_B: "linb",
                Lisu: "lisu",
                Lycian: "lyci",
                Lydian: "lydi",
                Mahajani: "mahj",
                Mandaic: "mand",
                Manichaean: "mani",
                Mende_Kikakui: "mend",
                Meroitic_Cursive: "merc",
                Meroitic_Hieroglyphs: "mero",
                Malayalam: [
                    "mlm2",
                    "mlym"
                ],
                Modi: "modi",
                Mongolian: "mong",
                Mro: "mroo",
                Meetei_Mayek: "mtei",
                Myanmar: [
                    "mym2",
                    "mymr"
                ],
                Old_North_Arabian: "narb",
                Nabataean: "nbat",
                Nko: "nko ",
                Ogham: "ogam",
                Ol_Chiki: "olck",
                Old_Turkic: "orkh",
                Oriya: [
                    "ory2",
                    "orya"
                ],
                Osmanya: "osma",
                Palmyrene: "palm",
                Pau_Cin_Hau: "pauc",
                Old_Permic: "perm",
                Phags_Pa: "phag",
                Inscriptional_Pahlavi: "phli",
                Psalter_Pahlavi: "phlp",
                Phoenician: "phnx",
                Miao: "plrd",
                Inscriptional_Parthian: "prti",
                Rejang: "rjng",
                Runic: "runr",
                Samaritan: "samr",
                Old_South_Arabian: "sarb",
                Saurashtra: "saur",
                Shavian: "shaw",
                Sharada: "shrd",
                Siddham: "sidd",
                Khudawadi: "sind",
                Sinhala: "sinh",
                Sora_Sompeng: "sora",
                Sundanese: "sund",
                Syloti_Nagri: "sylo",
                Syriac: "syrc",
                Tagbanwa: "tagb",
                Takri: "takr",
                Tai_Le: "tale",
                New_Tai_Lue: "talu",
                Tamil: [
                    "tml2",
                    "taml"
                ],
                Tai_Viet: "tavt",
                Telugu: [
                    "tel2",
                    "telu"
                ],
                Tifinagh: "tfng",
                Tagalog: "tglg",
                Thaana: "thaa",
                Thai: "thai",
                Tibetan: "tibt",
                Tirhuta: "tirh",
                Ugaritic: "ugar",
                Vai: "vai ",
                Warang_Citi: "wara",
                Old_Persian: "xpeo",
                Cuneiform: "xsux",
                Yi: "yi  ",
                Inherited: "zinh",
                Common: "zyyy",
                Unknown: "zzzz"
            };
            const rN = {};
            for(let rW in rR){
                let rX = rR[rW];
                if (Array.isArray(rX)) for (let rq of rX)rN[rq] = rW;
                else rN[rX] = rW;
            }
            function rH(e) {
                return rR[e];
            }
            function rj(e) {
                return rN[e];
            }
            function rY(e) {
                let t = e.length;
                let s = 0;
                while(s < t){
                    let r = e.charCodeAt(s++);
                    if (0xd800 <= r && r <= 0xdbff && s < t) {
                        let n = e.charCodeAt(s);
                        if (0xdc00 <= n && n <= 0xdfff) {
                            s++;
                            r = ((r & 0x3FF) << 10) + (n & 0x3FF) + 0x10000;
                        }
                    }
                    let a = (0, i.iM)(r);
                    if (a !== "Common" && a !== "Inherited" && a !== "Unknown") return rR[a];
                }
                return rR.Unknown;
            }
            function r$(e) {
                for(let t = 0; t < e.length; t++){
                    let s = e[t];
                    let r = (0, i.iM)(s);
                    if (r !== "Common" && r !== "Inherited" && r !== "Unknown") return rR[r];
                }
                return rR.Unknown;
            }
            const rZ = {
                arab: true,
                hebr: true,
                syrc: true,
                thaa: true,
                cprt: true,
                khar: true,
                phnx: true,
                "nko ": true,
                lydi: true,
                avst: true,
                armi: true,
                phli: true,
                prti: true,
                sarb: true,
                orkh: true,
                samr: true,
                mand: true,
                merc: true,
                mero: true,
                mani: true,
                mend: true,
                nbat: true,
                narb: true,
                palm: true,
                phlp: true
            };
            function rK(e) {
                if (rZ[e]) return "rtl";
                return "ltr";
            }
            class rQ {
                get advanceWidth() {
                    let e = 0;
                    for (let t of this.positions)e += t.xAdvance;
                    return e;
                }
                get advanceHeight() {
                    let e = 0;
                    for (let t of this.positions)e += t.yAdvance;
                    return e;
                }
                get bbox() {
                    let e = new (0, rz);
                    let t = 0;
                    let s = 0;
                    for(let r = 0; r < this.glyphs.length; r++){
                        let n = this.glyphs[r];
                        let a = this.positions[r];
                        let l = n.bbox;
                        e.addPoint(l.minX + t + a.xOffset, l.minY + s + a.yOffset);
                        e.addPoint(l.maxX + t + a.xOffset, l.maxY + s + a.yOffset);
                        t += a.xAdvance;
                        s += a.yAdvance;
                    }
                    return e;
                }
                constructor(e, t, s, r, n){
                    this.glyphs = e;
                    this.positions = null;
                    this.script = s;
                    this.language = r || null;
                    this.direction = n || rK(s);
                    this.features = {};
                    if (Array.isArray(t)) for (let a of t)this.features[a] = true;
                    else if (typeof t === "object") this.features = t;
                }
            }
            class r0 {
                constructor(e = 0, t = 0, s = 0, r = 0){
                    this.xAdvance = e;
                    this.yAdvance = t;
                    this.xOffset = s;
                    this.yOffset = r;
                }
            }
            const r1 = {
                allTypographicFeatures: {
                    code: 0,
                    exclusive: false,
                    allTypeFeatures: 0
                },
                ligatures: {
                    code: 1,
                    exclusive: false,
                    requiredLigatures: 0,
                    commonLigatures: 2,
                    rareLigatures: 4,
                    rebusPictures: 8,
                    diphthongLigatures: 10,
                    squaredLigatures: 12,
                    abbrevSquaredLigatures: 14,
                    symbolLigatures: 16,
                    contextualLigatures: 18,
                    historicalLigatures: 20
                },
                cursiveConnection: {
                    code: 2,
                    exclusive: true,
                    unconnected: 0,
                    partiallyConnected: 1,
                    cursive: 2
                },
                letterCase: {
                    code: 3,
                    exclusive: true
                },
                verticalSubstitution: {
                    code: 4,
                    exclusive: false,
                    substituteVerticalForms: 0
                },
                linguisticRearrangement: {
                    code: 5,
                    exclusive: false,
                    linguisticRearrangement: 0
                },
                numberSpacing: {
                    code: 6,
                    exclusive: true,
                    monospacedNumbers: 0,
                    proportionalNumbers: 1,
                    thirdWidthNumbers: 2,
                    quarterWidthNumbers: 3
                },
                smartSwash: {
                    code: 8,
                    exclusive: false,
                    wordInitialSwashes: 0,
                    wordFinalSwashes: 2,
                    nonFinalSwashes: 8
                },
                diacritics: {
                    code: 9,
                    exclusive: true,
                    showDiacritics: 0,
                    hideDiacritics: 1,
                    decomposeDiacritics: 2
                },
                verticalPosition: {
                    code: 10,
                    exclusive: true,
                    normalPosition: 0,
                    superiors: 1,
                    inferiors: 2,
                    ordinals: 3,
                    scientificInferiors: 4
                },
                fractions: {
                    code: 11,
                    exclusive: true,
                    noFractions: 0,
                    verticalFractions: 1,
                    diagonalFractions: 2
                },
                overlappingCharacters: {
                    code: 13,
                    exclusive: false,
                    preventOverlap: 0
                },
                typographicExtras: {
                    code: 14,
                    exclusive: false,
                    slashedZero: 4
                },
                mathematicalExtras: {
                    code: 15,
                    exclusive: false,
                    mathematicalGreek: 10
                },
                ornamentSets: {
                    code: 16,
                    exclusive: true,
                    noOrnaments: 0,
                    dingbats: 1,
                    piCharacters: 2,
                    fleurons: 3,
                    decorativeBorders: 4,
                    internationalSymbols: 5,
                    mathSymbols: 6
                },
                characterAlternatives: {
                    code: 17,
                    exclusive: true,
                    noAlternates: 0
                },
                designComplexity: {
                    code: 18,
                    exclusive: true,
                    designLevel1: 0,
                    designLevel2: 1,
                    designLevel3: 2,
                    designLevel4: 3,
                    designLevel5: 4
                },
                styleOptions: {
                    code: 19,
                    exclusive: true,
                    noStyleOptions: 0,
                    displayText: 1,
                    engravedText: 2,
                    illuminatedCaps: 3,
                    titlingCaps: 4,
                    tallCaps: 5
                },
                characterShape: {
                    code: 20,
                    exclusive: true,
                    traditionalCharacters: 0,
                    simplifiedCharacters: 1,
                    JIS1978Characters: 2,
                    JIS1983Characters: 3,
                    JIS1990Characters: 4,
                    traditionalAltOne: 5,
                    traditionalAltTwo: 6,
                    traditionalAltThree: 7,
                    traditionalAltFour: 8,
                    traditionalAltFive: 9,
                    expertCharacters: 10,
                    JIS2004Characters: 11,
                    hojoCharacters: 12,
                    NLCCharacters: 13,
                    traditionalNamesCharacters: 14
                },
                numberCase: {
                    code: 21,
                    exclusive: true,
                    lowerCaseNumbers: 0,
                    upperCaseNumbers: 1
                },
                textSpacing: {
                    code: 22,
                    exclusive: true,
                    proportionalText: 0,
                    monospacedText: 1,
                    halfWidthText: 2,
                    thirdWidthText: 3,
                    quarterWidthText: 4,
                    altProportionalText: 5,
                    altHalfWidthText: 6
                },
                transliteration: {
                    code: 23,
                    exclusive: true,
                    noTransliteration: 0
                },
                annotation: {
                    code: 24,
                    exclusive: true,
                    noAnnotation: 0,
                    boxAnnotation: 1,
                    roundedBoxAnnotation: 2,
                    circleAnnotation: 3,
                    invertedCircleAnnotation: 4,
                    parenthesisAnnotation: 5,
                    periodAnnotation: 6,
                    romanNumeralAnnotation: 7,
                    diamondAnnotation: 8,
                    invertedBoxAnnotation: 9,
                    invertedRoundedBoxAnnotation: 10
                },
                kanaSpacing: {
                    code: 25,
                    exclusive: true,
                    fullWidthKana: 0,
                    proportionalKana: 1
                },
                ideographicSpacing: {
                    code: 26,
                    exclusive: true,
                    fullWidthIdeographs: 0,
                    proportionalIdeographs: 1,
                    halfWidthIdeographs: 2
                },
                unicodeDecomposition: {
                    code: 27,
                    exclusive: false,
                    canonicalComposition: 0,
                    compatibilityComposition: 2,
                    transcodingComposition: 4
                },
                rubyKana: {
                    code: 28,
                    exclusive: false,
                    rubyKana: 2
                },
                CJKSymbolAlternatives: {
                    code: 29,
                    exclusive: true,
                    noCJKSymbolAlternatives: 0,
                    CJKSymbolAltOne: 1,
                    CJKSymbolAltTwo: 2,
                    CJKSymbolAltThree: 3,
                    CJKSymbolAltFour: 4,
                    CJKSymbolAltFive: 5
                },
                ideographicAlternatives: {
                    code: 30,
                    exclusive: true,
                    noIdeographicAlternatives: 0,
                    ideographicAltOne: 1,
                    ideographicAltTwo: 2,
                    ideographicAltThree: 3,
                    ideographicAltFour: 4,
                    ideographicAltFive: 5
                },
                CJKVerticalRomanPlacement: {
                    code: 31,
                    exclusive: true,
                    CJKVerticalRomanCentered: 0,
                    CJKVerticalRomanHBaseline: 1
                },
                italicCJKRoman: {
                    code: 32,
                    exclusive: false,
                    CJKItalicRoman: 2
                },
                caseSensitiveLayout: {
                    code: 33,
                    exclusive: false,
                    caseSensitiveLayout: 0,
                    caseSensitiveSpacing: 2
                },
                alternateKana: {
                    code: 34,
                    exclusive: false,
                    alternateHorizKana: 0,
                    alternateVertKana: 2
                },
                stylisticAlternatives: {
                    code: 35,
                    exclusive: false,
                    noStylisticAlternates: 0,
                    stylisticAltOne: 2,
                    stylisticAltTwo: 4,
                    stylisticAltThree: 6,
                    stylisticAltFour: 8,
                    stylisticAltFive: 10,
                    stylisticAltSix: 12,
                    stylisticAltSeven: 14,
                    stylisticAltEight: 16,
                    stylisticAltNine: 18,
                    stylisticAltTen: 20,
                    stylisticAltEleven: 22,
                    stylisticAltTwelve: 24,
                    stylisticAltThirteen: 26,
                    stylisticAltFourteen: 28,
                    stylisticAltFifteen: 30,
                    stylisticAltSixteen: 32,
                    stylisticAltSeventeen: 34,
                    stylisticAltEighteen: 36,
                    stylisticAltNineteen: 38,
                    stylisticAltTwenty: 40
                },
                contextualAlternates: {
                    code: 36,
                    exclusive: false,
                    contextualAlternates: 0,
                    swashAlternates: 2,
                    contextualSwashAlternates: 4
                },
                lowerCase: {
                    code: 37,
                    exclusive: true,
                    defaultLowerCase: 0,
                    lowerCaseSmallCaps: 1,
                    lowerCasePetiteCaps: 2
                },
                upperCase: {
                    code: 38,
                    exclusive: true,
                    defaultUpperCase: 0,
                    upperCaseSmallCaps: 1,
                    upperCasePetiteCaps: 2
                },
                languageTag: {
                    code: 39,
                    exclusive: true
                },
                CJKRomanSpacing: {
                    code: 103,
                    exclusive: true,
                    halfWidthCJKRoman: 0,
                    proportionalCJKRoman: 1,
                    defaultCJKRoman: 2,
                    fullWidthCJKRoman: 3
                }
            };
            const r2 = (e, t)=>[
                    r1[e].code,
                    r1[e][t]
                ];
            const r3 = {
                rlig: r2("ligatures", "requiredLigatures"),
                clig: r2("ligatures", "contextualLigatures"),
                dlig: r2("ligatures", "rareLigatures"),
                hlig: r2("ligatures", "historicalLigatures"),
                liga: r2("ligatures", "commonLigatures"),
                hist: r2("ligatures", "historicalLigatures"),
                smcp: r2("lowerCase", "lowerCaseSmallCaps"),
                pcap: r2("lowerCase", "lowerCasePetiteCaps"),
                frac: r2("fractions", "diagonalFractions"),
                dnom: r2("fractions", "diagonalFractions"),
                numr: r2("fractions", "diagonalFractions"),
                afrc: r2("fractions", "verticalFractions"),
                case: r2("caseSensitiveLayout", "caseSensitiveLayout"),
                ccmp: r2("unicodeDecomposition", "canonicalComposition"),
                cpct: r2("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
                valt: r2("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
                swsh: r2("contextualAlternates", "swashAlternates"),
                cswh: r2("contextualAlternates", "contextualSwashAlternates"),
                curs: r2("cursiveConnection", "cursive"),
                c2pc: r2("upperCase", "upperCasePetiteCaps"),
                c2sc: r2("upperCase", "upperCaseSmallCaps"),
                init: r2("smartSwash", "wordInitialSwashes"),
                fin2: r2("smartSwash", "wordFinalSwashes"),
                medi: r2("smartSwash", "nonFinalSwashes"),
                med2: r2("smartSwash", "nonFinalSwashes"),
                fin3: r2("smartSwash", "wordFinalSwashes"),
                fina: r2("smartSwash", "wordFinalSwashes"),
                pkna: r2("kanaSpacing", "proportionalKana"),
                half: r2("textSpacing", "halfWidthText"),
                halt: r2("textSpacing", "altHalfWidthText"),
                hkna: r2("alternateKana", "alternateHorizKana"),
                vkna: r2("alternateKana", "alternateVertKana"),
                ital: r2("italicCJKRoman", "CJKItalicRoman"),
                lnum: r2("numberCase", "upperCaseNumbers"),
                onum: r2("numberCase", "lowerCaseNumbers"),
                mgrk: r2("mathematicalExtras", "mathematicalGreek"),
                calt: r2("contextualAlternates", "contextualAlternates"),
                vrt2: r2("verticalSubstitution", "substituteVerticalForms"),
                vert: r2("verticalSubstitution", "substituteVerticalForms"),
                tnum: r2("numberSpacing", "monospacedNumbers"),
                pnum: r2("numberSpacing", "proportionalNumbers"),
                sups: r2("verticalPosition", "superiors"),
                subs: r2("verticalPosition", "inferiors"),
                ordn: r2("verticalPosition", "ordinals"),
                pwid: r2("textSpacing", "proportionalText"),
                hwid: r2("textSpacing", "halfWidthText"),
                qwid: r2("textSpacing", "quarterWidthText"),
                twid: r2("textSpacing", "thirdWidthText"),
                fwid: r2("textSpacing", "proportionalText"),
                palt: r2("textSpacing", "altProportionalText"),
                trad: r2("characterShape", "traditionalCharacters"),
                smpl: r2("characterShape", "simplifiedCharacters"),
                jp78: r2("characterShape", "JIS1978Characters"),
                jp83: r2("characterShape", "JIS1983Characters"),
                jp90: r2("characterShape", "JIS1990Characters"),
                jp04: r2("characterShape", "JIS2004Characters"),
                expt: r2("characterShape", "expertCharacters"),
                hojo: r2("characterShape", "hojoCharacters"),
                nlck: r2("characterShape", "NLCCharacters"),
                tnam: r2("characterShape", "traditionalNamesCharacters"),
                ruby: r2("rubyKana", "rubyKana"),
                titl: r2("styleOptions", "titlingCaps"),
                zero: r2("typographicExtras", "slashedZero"),
                ss01: r2("stylisticAlternatives", "stylisticAltOne"),
                ss02: r2("stylisticAlternatives", "stylisticAltTwo"),
                ss03: r2("stylisticAlternatives", "stylisticAltThree"),
                ss04: r2("stylisticAlternatives", "stylisticAltFour"),
                ss05: r2("stylisticAlternatives", "stylisticAltFive"),
                ss06: r2("stylisticAlternatives", "stylisticAltSix"),
                ss07: r2("stylisticAlternatives", "stylisticAltSeven"),
                ss08: r2("stylisticAlternatives", "stylisticAltEight"),
                ss09: r2("stylisticAlternatives", "stylisticAltNine"),
                ss10: r2("stylisticAlternatives", "stylisticAltTen"),
                ss11: r2("stylisticAlternatives", "stylisticAltEleven"),
                ss12: r2("stylisticAlternatives", "stylisticAltTwelve"),
                ss13: r2("stylisticAlternatives", "stylisticAltThirteen"),
                ss14: r2("stylisticAlternatives", "stylisticAltFourteen"),
                ss15: r2("stylisticAlternatives", "stylisticAltFifteen"),
                ss16: r2("stylisticAlternatives", "stylisticAltSixteen"),
                ss17: r2("stylisticAlternatives", "stylisticAltSeventeen"),
                ss18: r2("stylisticAlternatives", "stylisticAltEighteen"),
                ss19: r2("stylisticAlternatives", "stylisticAltNineteen"),
                ss20: r2("stylisticAlternatives", "stylisticAltTwenty")
            };
            for(let r4 = 1; r4 <= 99; r4++)r3[`cv${`00${r4}`.slice(-2)}`] = [
                r1.characterAlternatives.code,
                r4
            ];
            let r5 = {};
            for(let r7 in r3){
                let r6 = r3[r7];
                if (r5[r6[0]] == null) r5[r6[0]] = {};
                r5[r6[0]][r6[1]] = r7;
            }
            function r9(e) {
                let t = {};
                for(let s in e){
                    let r;
                    if (r = r3[s]) {
                        if (t[r[0]] == null) t[r[0]] = {};
                        t[r[0]][r[1]] = e[s];
                    }
                }
                return t;
            }
            function r8(e) {
                let [t, s] = e;
                if (isNaN(t)) var r = r1[t] && r1[t].code;
                else var r = t;
                if (isNaN(s)) var n = r1[t] && r1[t][s];
                else var n = s;
                return [
                    r,
                    n
                ];
            }
            function ne(e) {
                let t = {};
                if (Array.isArray(e)) for(let s = 0; s < e.length; s++){
                    let r;
                    let n = r8(e[s]);
                    if (r = r5[n[0]] && r5[n[0]][n[1]]) t[r] = true;
                }
                else if (typeof e === "object") for(let a in e){
                    let l = e[a];
                    for(let i in l){
                        let o;
                        let u = r8([
                            a,
                            i
                        ]);
                        if (l[i] && (o = r5[u[0]] && r5[u[0]][u[1]])) t[o] = true;
                    }
                }
                return Object.keys(t);
            }
            class nt {
                lookup(e) {
                    switch(this.table.version){
                        case 0:
                            return this.table.values.getItem(e);
                        case 2:
                        case 4:
                            {
                                let t = 0;
                                let s = this.table.binarySearchHeader.nUnits - 1;
                                while(t <= s){
                                    var r = t + s >> 1;
                                    var n = this.table.segments[r];
                                    if (n.firstGlyph === 0xffff) return null;
                                    if (e < n.firstGlyph) s = r - 1;
                                    else if (e > n.lastGlyph) t = r + 1;
                                    else {
                                        if (this.table.version === 2) return n.value;
                                        else return n.values[e - n.firstGlyph];
                                    }
                                }
                                return null;
                            }
                        case 6:
                            {
                                let a = 0;
                                let l = this.table.binarySearchHeader.nUnits - 1;
                                while(a <= l){
                                    var r = a + l >> 1;
                                    var n = this.table.segments[r];
                                    if (n.glyph === 0xffff) return null;
                                    if (e < n.glyph) l = r - 1;
                                    else if (e > n.glyph) a = r + 1;
                                    else return n.value;
                                }
                                return null;
                            }
                        case 8:
                            return this.table.values[e - this.table.firstGlyph];
                        default:
                            throw new Error(`Unknown lookup table format: ${this.table.version}`);
                    }
                }
                glyphsForValue(e) {
                    let t = [];
                    switch(this.table.version){
                        case 2:
                        case 4:
                            for (let s of this.table.segments)if (this.table.version === 2 && s.value === e) t.push(...(0, rT)(s.firstGlyph, s.lastGlyph + 1));
                            else {
                                for(let r = 0; r < s.values.length; r++)if (s.values[r] === e) t.push(s.firstGlyph + r);
                            }
                            break;
                        case 6:
                            for (let n of this.table.segments)if (n.value === e) t.push(n.glyph);
                            break;
                        case 8:
                            for(let a = 0; a < this.table.values.length; a++)if (this.table.values[a] === e) t.push(this.table.firstGlyph + a);
                            break;
                        default:
                            throw new Error(`Unknown lookup table format: ${this.table.version}`);
                    }
                    return t;
                }
                constructor(e){
                    this.table = e;
                }
            }
            (0, a.__decorate)([
                (0, _)
            ], nt.prototype, "glyphsForValue", null);
            const ns = 0;
            const nr = 1;
            const nn = 0;
            const na = 1;
            const nl = 2;
            const ni = 3;
            const no = 0x4000;
            class nu {
                process(e, t, s) {
                    let r = ns;
                    let n = t ? e.length - 1 : 0;
                    let a = t ? -1 : 1;
                    while(a === 1 && n <= e.length || a === -1 && n >= -1){
                        let l = null;
                        let i = na;
                        let o = true;
                        if (n === e.length || n === -1) i = nn;
                        else {
                            l = e[n];
                            if (l.id === 0xffff) i = nl;
                            else {
                                i = this.lookupTable.lookup(l.id);
                                if (i == null) i = na;
                            }
                        }
                        let u = this.stateTable.stateArray.getItem(r);
                        let c = u[i];
                        let f = this.stateTable.entryTable.getItem(c);
                        if (i !== nn && i !== nl) {
                            s(l, f, n);
                            o = !(f.flags & no);
                        }
                        r = f.newState;
                        if (o) n += a;
                    }
                    return e;
                }
                traverse(e, t = 0, s = new Set) {
                    if (s.has(t)) return;
                    s.add(t);
                    let { nClasses: r , stateArray: n , entryTable: a  } = this.stateTable;
                    let l = n.getItem(t);
                    for(let i = 4; i < r; i++){
                        let o = l[i];
                        let u = a.getItem(o);
                        for (let c of this.lookupTable.glyphsForValue(i)){
                            if (e.enter) e.enter(c, u);
                            if (u.newState !== 0) this.traverse(e, u.newState, s);
                            if (e.exit) e.exit(c, u);
                        }
                    }
                }
                constructor(e){
                    this.stateTable = e;
                    this.lookupTable = new (0, nt)(e.classTable);
                }
            }
            const nc = 0x8000;
            const nf = 0x2000;
            const nh = 0x000F;
            const nd = 0x8000;
            const nm = 0x8000;
            const np = 0x2000;
            const ng = 0x80000000;
            const nb = 0x40000000;
            const ny = 0x3FFFFFFF;
            const nw = 0x800000;
            const nx = 0x400000;
            const nv = 0x200000;
            const n_ = 0x2000;
            const nL = 0x1000;
            const nC = 0x0800;
            const nA = 0x0400;
            const nk = 0x03E0;
            const nS = 0x001F;
            class nI {
                process(e, t = {}) {
                    for (let s of this.morx.chains){
                        let r = s.defaultFlags;
                        for (let n of s.features){
                            let a;
                            if (a = t[n.featureType]) {
                                if (a[n.featureSetting]) {
                                    r &= n.disableFlags;
                                    r |= n.enableFlags;
                                } else if (a[n.featureSetting] === false) {
                                    r |= ~n.disableFlags;
                                    r &= ~n.enableFlags;
                                }
                            }
                        }
                        for (let l of s.subtables)if (l.subFeatureFlags & r) this.processSubtable(l, e);
                    }
                    let i = e.length - 1;
                    while(i >= 0){
                        if (e[i].id === 0xffff) e.splice(i, 1);
                        i--;
                    }
                    return e;
                }
                processSubtable(e, t) {
                    this.subtable = e;
                    this.glyphs = t;
                    if (this.subtable.type === 4) {
                        this.processNoncontextualSubstitutions(this.subtable, this.glyphs);
                        return;
                    }
                    this.ligatureStack = [];
                    this.markedGlyph = null;
                    this.firstGlyph = null;
                    this.lastGlyph = null;
                    this.markedIndex = null;
                    let s = this.getStateMachine(e);
                    let r = this.getProcessor();
                    let n = !!(this.subtable.coverage & nx);
                    return s.process(this.glyphs, n, r);
                }
                getStateMachine(e) {
                    return new (0, nu)(e.table.stateTable);
                }
                getProcessor() {
                    switch(this.subtable.type){
                        case 0:
                            return this.processIndicRearragement;
                        case 1:
                            return this.processContextualSubstitution;
                        case 2:
                            return this.processLigature;
                        case 4:
                            return this.processNoncontextualSubstitutions;
                        case 5:
                            return this.processGlyphInsertion;
                        default:
                            throw new Error(`Invalid morx subtable type: ${this.subtable.type}`);
                    }
                }
                processIndicRearragement(e, t, s) {
                    if (t.flags & nc) this.firstGlyph = s;
                    if (t.flags & nf) this.lastGlyph = s;
                    nU(this.glyphs, t.flags & nh, this.firstGlyph, this.lastGlyph);
                }
                processContextualSubstitution(e, t, s) {
                    let r = this.subtable.table.substitutionTable.items;
                    if (t.markIndex !== 0xffff) {
                        let n = r.getItem(t.markIndex);
                        let a = new (0, nt)(n);
                        e = this.glyphs[this.markedGlyph];
                        var l = a.lookup(e.id);
                        if (l) this.glyphs[this.markedGlyph] = this.font.getGlyph(l, e.codePoints);
                    }
                    if (t.currentIndex !== 0xffff) {
                        let i = r.getItem(t.currentIndex);
                        let o = new (0, nt)(i);
                        e = this.glyphs[s];
                        var l = o.lookup(e.id);
                        if (l) this.glyphs[s] = this.font.getGlyph(l, e.codePoints);
                    }
                    if (t.flags & nd) this.markedGlyph = s;
                }
                processLigature(e, t, s) {
                    if (t.flags & nm) this.ligatureStack.push(s);
                    if (t.flags & np) {
                        let r = this.subtable.table.ligatureActions;
                        let n = this.subtable.table.components;
                        let a = this.subtable.table.ligatureList;
                        let l = t.action;
                        let i = false;
                        let o = 0;
                        let u = [];
                        let c = [];
                        while(!i){
                            let f = this.ligatureStack.pop();
                            u.unshift(...this.glyphs[f].codePoints);
                            let h = r.getItem(l++);
                            i = !!(h & ng);
                            let d = !!(h & nb);
                            let m = (h & ny) << 2 >> 2;
                            m += this.glyphs[f].id;
                            let p = n.getItem(m);
                            o += p;
                            if (i || d) {
                                let g = a.getItem(o);
                                this.glyphs[f] = this.font.getGlyph(g, u);
                                c.push(f);
                                o = 0;
                                u = [];
                            } else this.glyphs[f] = this.font.getGlyph(0xffff);
                        }
                        this.ligatureStack.push(...c);
                    }
                }
                processNoncontextualSubstitutions(e, t, s) {
                    let r = new (0, nt)(e.table.lookupTable);
                    for(s = 0; s < t.length; s++){
                        let n = t[s];
                        if (n.id !== 0xffff) {
                            let a = r.lookup(n.id);
                            if (a) t[s] = this.font.getGlyph(a, n.codePoints);
                        }
                    }
                }
                _insertGlyphs(e, t, s, r) {
                    let n = [];
                    while(s--){
                        let a = this.subtable.table.insertionActions.getItem(t++);
                        n.push(this.font.getGlyph(a));
                    }
                    if (!r) e++;
                    this.glyphs.splice(e, 0, ...n);
                }
                processGlyphInsertion(e, t, s) {
                    if (t.flags & nd) this.markedIndex = s;
                    if (t.markedInsertIndex !== 0xffff) {
                        let r = (t.flags & nS) >>> 5;
                        let n = !!(t.flags & nA);
                        this._insertGlyphs(this.markedIndex, t.markedInsertIndex, r, n);
                    }
                    if (t.currentInsertIndex !== 0xffff) {
                        let a = (t.flags & nk) >>> 5;
                        let l = !!(t.flags & nC);
                        this._insertGlyphs(s, t.currentInsertIndex, a, l);
                    }
                }
                getSupportedFeatures() {
                    let e = [];
                    for (let t of this.morx.chains)for (let s of t.features)e.push([
                        s.featureType,
                        s.featureSetting
                    ]);
                    return e;
                }
                generateInputs(e) {
                    if (!this.inputCache) this.generateInputCache();
                    return this.inputCache[e] || [];
                }
                generateInputCache() {
                    this.inputCache = {};
                    for (let e of this.morx.chains){
                        let t = e.defaultFlags;
                        for (let s of e.subtables)if (s.subFeatureFlags & t) this.generateInputsForSubtable(s);
                    }
                }
                generateInputsForSubtable(e) {
                    if (e.type !== 2) return;
                    let t = !!(e.coverage & nx);
                    if (t) throw new Error("Reverse subtable, not supported.");
                    this.subtable = e;
                    this.ligatureStack = [];
                    let s = this.getStateMachine(e);
                    let r = this.getProcessor();
                    let n = [];
                    let a = [];
                    this.glyphs = [];
                    s.traverse({
                        enter: (e, t)=>{
                            let s = this.glyphs;
                            a.push({
                                glyphs: s.slice(),
                                ligatureStack: this.ligatureStack.slice()
                            });
                            let l = this.font.getGlyph(e);
                            n.push(l);
                            s.push(n[n.length - 1]);
                            r(s[s.length - 1], t, s.length - 1);
                            let i = 0;
                            let o = 0;
                            for(let u = 0; u < s.length && i <= 1; u++)if (s[u].id !== 0xffff) {
                                i++;
                                o = s[u].id;
                            }
                            if (i === 1) {
                                let c = n.map((e)=>e.id);
                                let f = this.inputCache[o];
                                if (f) f.push(c);
                                else this.inputCache[o] = [
                                    c
                                ];
                            }
                        },
                        exit: ()=>{
                            ({ glyphs: this.glyphs , ligatureStack: this.ligatureStack  } = a.pop());
                            n.pop();
                        }
                    });
                }
                constructor(e){
                    this.processIndicRearragement = this.processIndicRearragement.bind(this);
                    this.processContextualSubstitution = this.processContextualSubstitution.bind(this);
                    this.processLigature = this.processLigature.bind(this);
                    this.processNoncontextualSubstitutions = this.processNoncontextualSubstitutions.bind(this);
                    this.processGlyphInsertion = this.processGlyphInsertion.bind(this);
                    this.font = e;
                    this.morx = e.morx;
                    this.inputCache = null;
                }
            }
            (0, a.__decorate)([
                (0, _)
            ], nI.prototype, "getStateMachine", null);
            function nP(e, t, s, r = false, n = false) {
                let a = e.splice(s[0] - (s[1] - 1), s[1]);
                if (n) a.reverse();
                let l = e.splice(t[0], t[1], ...a);
                if (r) l.reverse();
                e.splice(s[0] - (t[1] - 1), 0, ...l);
                return e;
            }
            function nU(e, t, s, r) {
                let n = r - s + 1;
                switch(t){
                    case 0:
                        return e;
                    case 1:
                        return nP(e, [
                            s,
                            1
                        ], [
                            r,
                            0
                        ]);
                    case 2:
                        return nP(e, [
                            s,
                            0
                        ], [
                            r,
                            1
                        ]);
                    case 3:
                        return nP(e, [
                            s,
                            1
                        ], [
                            r,
                            1
                        ]);
                    case 4:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            0
                        ]);
                    case 5:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            0
                        ], true, false);
                    case 6:
                        return nP(e, [
                            s,
                            0
                        ], [
                            r,
                            2
                        ]);
                    case 7:
                        return nP(e, [
                            s,
                            0
                        ], [
                            r,
                            2
                        ], false, true);
                    case 8:
                        return nP(e, [
                            s,
                            1
                        ], [
                            r,
                            2
                        ]);
                    case 9:
                        return nP(e, [
                            s,
                            1
                        ], [
                            r,
                            2
                        ], false, true);
                    case 10:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            1
                        ]);
                    case 11:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            1
                        ], true, false);
                    case 12:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            2
                        ]);
                    case 13:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            2
                        ], true, false);
                    case 14:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            2
                        ], false, true);
                    case 15:
                        return nP(e, [
                            s,
                            2
                        ], [
                            r,
                            2
                        ], true, true);
                    default:
                        throw new Error(`Unknown verb: ${t}`);
                }
            }
            class nJ {
                substitute(e) {
                    if (e.direction === "rtl") e.glyphs.reverse();
                    this.morxProcessor.process(e.glyphs, r9(e.features));
                }
                getAvailableFeatures(e, t) {
                    return ne(this.morxProcessor.getSupportedFeatures());
                }
                stringsForGlyph(e) {
                    let t = this.morxProcessor.generateInputs(e);
                    let s = new Set;
                    for (let r of t)this._addStrings(r, 0, s, "");
                    return s;
                }
                _addStrings(e, t, s, r) {
                    let n = this.font._cmapProcessor.codePointsForGlyph(e[t]);
                    for (let a of n){
                        let l = r + String.fromCodePoint(a);
                        if (t < e.length - 1) this._addStrings(e, t + 1, s, l);
                        else s.add(l);
                    }
                }
                constructor(e){
                    this.font = e;
                    this.morxProcessor = new (0, nI)(e);
                    this.fallbackPosition = false;
                }
            }
            class nT {
                _addFeatures(e, t) {
                    let s = this.stages.length - 1;
                    let r = this.stages[s];
                    for (let n of e)if (this.allFeatures[n] == null) {
                        r.push(n);
                        this.allFeatures[n] = s;
                        if (t) this.globalFeatures[n] = true;
                    }
                }
                add(e, t = true) {
                    if (this.stages.length === 0) this.stages.push([]);
                    if (typeof e === "string") e = [
                        e
                    ];
                    if (Array.isArray(e)) this._addFeatures(e, t);
                    else if (typeof e === "object") {
                        this._addFeatures(e.global || [], true);
                        this._addFeatures(e.local || [], false);
                    } else throw new Error("Unsupported argument to ShapingPlan#add");
                }
                addStage(e, t) {
                    if (typeof e === "function") this.stages.push(e, []);
                    else {
                        this.stages.push([]);
                        this.add(e, t);
                    }
                }
                setFeatureOverrides(e) {
                    if (Array.isArray(e)) this.add(e);
                    else if (typeof e === "object") for(let t in e){
                        if (e[t]) this.add(t);
                        else if (this.allFeatures[t] != null) {
                            let s = this.stages[this.allFeatures[t]];
                            s.splice(s.indexOf(t), 1);
                            delete this.allFeatures[t];
                            delete this.globalFeatures[t];
                        }
                    }
                }
                assignGlobalFeatures(e) {
                    for (let t of e)for(let s in this.globalFeatures)t.features[s] = true;
                }
                process(e, t, s) {
                    for (let r of this.stages){
                        if (typeof r === "function") {
                            if (!s) r(this.font, t, this);
                        } else if (r.length > 0) e.applyFeatures(r, t, s);
                    }
                }
                constructor(e, t, s){
                    this.font = e;
                    this.script = t;
                    this.direction = s;
                    this.stages = [];
                    this.globalFeatures = {};
                    this.allFeatures = {};
                }
            }
            const nO = [
                "rvrn"
            ];
            const nF = [
                "ccmp",
                "locl",
                "rlig",
                "mark",
                "mkmk"
            ];
            const nD = [
                "frac",
                "numr",
                "dnom"
            ];
            const nM = [
                "calt",
                "clig",
                "liga",
                "rclt",
                "curs",
                "kern"
            ];
            const nG = (null && ([
                "vert"
            ]));
            const nE = {
                ltr: [
                    "ltra",
                    "ltrm"
                ],
                rtl: [
                    "rtla",
                    "rtlm"
                ]
            };
            class nB {
                static plan(e, t, s) {
                    this.planPreprocessing(e);
                    this.planFeatures(e);
                    this.planPostprocessing(e, s);
                    e.assignGlobalFeatures(t);
                    this.assignFeatures(e, t);
                }
                static planPreprocessing(e) {
                    e.add({
                        global: [
                            ...nO,
                            ...nE[e.direction]
                        ],
                        local: nD
                    });
                }
                static planFeatures(e) {}
                static planPostprocessing(e, t) {
                    e.add([
                        ...nF,
                        ...nM
                    ]);
                    e.setFeatureOverrides(t);
                }
                static assignFeatures(e, t) {
                    for(let s = 0; s < t.length; s++){
                        let r = t[s];
                        if (r.codePoints[0] === 0x2044) {
                            let n = s;
                            let a = s + 1;
                            while(n > 0 && (0, i.X1)(t[n - 1].codePoints[0])){
                                t[n - 1].features.numr = true;
                                t[n - 1].features.frac = true;
                                n--;
                            }
                            while(a < t.length && (0, i.X1)(t[a].codePoints[0])){
                                t[a].features.dnom = true;
                                t[a].features.frac = true;
                                a++;
                            }
                            r.features.frac = true;
                            s = a - 1;
                        }
                    }
                }
            }
            (0, n.Z)(nB, "zeroMarkWidths", "AFTER_GPOS");
            const nV = new (0, o)((0, rG)("ABABAAAAAACgMQAAAZUBav7t2CtPA0EUBeDZB00pin9AJZIEgyUEj0QhweDAgQOJxCBRBElQSBwSicLgkOAwnNKZ5GaY2c7uzj4o5yZfZrrbefbuIx2nSq3CGmzAWH/+K+UO7MIe7MMhHMMpnMMFXMIVXIt2t3CnP088iPqjqNN8e4Ij7Rle4LUH82rLm6i/92A+RERERERERERNmfz/89GDeRARERERzbN8ceps2Iwt9H0C9/AJ6yOlDkbTczcot5VSm8Pm1vcFWfb7+BKOLTuOd2UlTX4wGP85Eg953lWPFbnuN7PkjtLmalOWbNenkHOSa7T3KmR9MVTZ2zZkVj1kHa68MueVKH0R4zqQ44WEXLM8VjcWHP0PtKLfPzQnMtGn3W4QYf6qxFxceVI394r2xnV+1rih0fV1Vzf3fO1n3evL5J78ruvZ5ptX2Rwy92Tfb1wlEqut3U+sZ3HXOeJ7/zDrbyuP6+Zz0fqa6Nv3vhY7Yu1xWnGevmsvsUpTT/RYIe8waUH/rvHMWKFzLfN8L+rTfp645mfX7ftlnfDtYxN59w0="));
            const nz = [
                "isol",
                "fina",
                "fin2",
                "fin3",
                "medi",
                "med2",
                "init"
            ];
            const nR = {
                Non_Joining: 0,
                Left_Joining: 1,
                Right_Joining: 2,
                Dual_Joining: 3,
                Join_Causing: 3,
                ALAPH: 4,
                "DALATH RISH": 5,
                Transparent: 6
            };
            const nN = "isol";
            const nW = "fina";
            const nX = "fin2";
            const nq = "fin3";
            const nH = "medi";
            const nj = "med2";
            const nY = "init";
            const n$ = null;
            const nZ = [
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nN,
                        1
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nN,
                        1
                    ],
                    [
                        n$,
                        nN,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nN,
                        1
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nX,
                        5
                    ],
                    [
                        n$,
                        nN,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        nY,
                        nW,
                        1
                    ],
                    [
                        nY,
                        nW,
                        3
                    ],
                    [
                        nY,
                        nW,
                        4
                    ],
                    [
                        nY,
                        nW,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        nH,
                        nW,
                        1
                    ],
                    [
                        nH,
                        nW,
                        3
                    ],
                    [
                        nH,
                        nW,
                        4
                    ],
                    [
                        nH,
                        nW,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        nj,
                        nN,
                        1
                    ],
                    [
                        nj,
                        nN,
                        2
                    ],
                    [
                        nj,
                        nX,
                        5
                    ],
                    [
                        nj,
                        nN,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        nN,
                        nN,
                        1
                    ],
                    [
                        nN,
                        nN,
                        2
                    ],
                    [
                        nN,
                        nX,
                        5
                    ],
                    [
                        nN,
                        nN,
                        6
                    ]
                ],
                [
                    [
                        n$,
                        n$,
                        0
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nN,
                        1
                    ],
                    [
                        n$,
                        nN,
                        2
                    ],
                    [
                        n$,
                        nq,
                        5
                    ],
                    [
                        n$,
                        nN,
                        6
                    ]
                ]
            ];
            class nK extends (0, nB) {
                static planFeatures(e) {
                    e.add([
                        "ccmp",
                        "locl"
                    ]);
                    for(let t = 0; t < nz.length; t++){
                        let s = nz[t];
                        e.addStage(s, false);
                    }
                    e.addStage("mset");
                }
                static assignFeatures(e, t) {
                    super.assignFeatures(e, t);
                    let s = -1;
                    let r = 0;
                    let n = [];
                    for(let a = 0; a < t.length; a++){
                        let l, i;
                        var o = t[a];
                        let u = nQ(o.codePoints[0]);
                        if (u === nR.Transparent) {
                            n[a] = n$;
                            continue;
                        }
                        [i, l, r] = nZ[r][u];
                        if (i !== n$ && s !== -1) n[s] = i;
                        n[a] = l;
                        s = a;
                    }
                    for(let c = 0; c < t.length; c++){
                        let f;
                        var o = t[c];
                        if (f = n[c]) o.features[f] = true;
                    }
                }
            }
            function nQ(e) {
                let t = nV.get(e);
                if (t) return t - 1;
                let s = (0, i.n3)(e);
                if (s === "Mn" || s === "Me" || s === "Cf") return nR.Transparent;
                return nR.Non_Joining;
            }
            class n0 {
                reset(e = {}, t = 0) {
                    this.options = e;
                    this.flags = e.flags || {};
                    this.markAttachmentType = e.markAttachmentType || 0;
                    this.index = t;
                }
                get cur() {
                    return this.glyphs[this.index] || null;
                }
                shouldIgnore(e) {
                    return this.flags.ignoreMarks && e.isMark || this.flags.ignoreBaseGlyphs && e.isBase || this.flags.ignoreLigatures && e.isLigature || this.markAttachmentType && e.isMark && e.markAttachmentType !== this.markAttachmentType;
                }
                move(e) {
                    this.index += e;
                    while(0 <= this.index && this.index < this.glyphs.length && this.shouldIgnore(this.glyphs[this.index]))this.index += e;
                    if (0 > this.index || this.index >= this.glyphs.length) return null;
                    return this.glyphs[this.index];
                }
                next() {
                    return this.move(1);
                }
                prev() {
                    return this.move(-1);
                }
                peek(e = 1) {
                    let t = this.index;
                    let s = this.increment(e);
                    this.index = t;
                    return s;
                }
                peekIndex(e = 1) {
                    let t = this.index;
                    this.increment(e);
                    let s = this.index;
                    this.index = t;
                    return s;
                }
                increment(e = 1) {
                    let t = e < 0 ? -1 : 1;
                    e = Math.abs(e);
                    while(e--)this.move(t);
                    return this.glyphs[this.index];
                }
                constructor(e, t){
                    this.glyphs = e;
                    this.reset(t);
                }
            }
            const n1 = [
                "DFLT",
                "dflt",
                "latn"
            ];
            class n2 {
                findScript(e) {
                    if (this.table.scriptList == null) return null;
                    if (!Array.isArray(e)) e = [
                        e
                    ];
                    for (let t of e)for (let s of this.table.scriptList){
                        if (s.tag === t) return s;
                    }
                    return null;
                }
                selectScript(e, t, s) {
                    let r = false;
                    let n;
                    if (!this.script || e !== this.scriptTag) {
                        n = this.findScript(e);
                        if (!n) n = this.findScript(n1);
                        if (!n) return this.scriptTag;
                        this.scriptTag = n.tag;
                        this.script = n.script;
                        this.language = null;
                        this.languageTag = null;
                        r = true;
                    }
                    if (!s || s !== this.direction) this.direction = s || rK(e);
                    if (t && t.length < 4) t += " ".repeat(4 - t.length);
                    if (!t || t !== this.languageTag) {
                        this.language = null;
                        for (let a of this.script.langSysRecords)if (a.tag === t) {
                            this.language = a.langSys;
                            this.languageTag = a.tag;
                            break;
                        }
                        if (!this.language) {
                            this.language = this.script.defaultLangSys;
                            this.languageTag = null;
                        }
                        r = true;
                    }
                    if (r) {
                        this.features = {};
                        if (this.language) for (let l of this.language.featureIndexes){
                            let i = this.table.featureList[l];
                            let o = this.substituteFeatureForVariations(l);
                            this.features[i.tag] = o || i.feature;
                        }
                    }
                    return this.scriptTag;
                }
                lookupsForFeatures(e = [], t) {
                    let s = [];
                    for (let r of e){
                        let n = this.features[r];
                        if (!n) continue;
                        for (let a of n.lookupListIndexes){
                            if (t && t.indexOf(a) !== -1) continue;
                            s.push({
                                feature: r,
                                index: a,
                                lookup: this.table.lookupList.get(a)
                            });
                        }
                    }
                    s.sort((e, t)=>e.index - t.index);
                    return s;
                }
                substituteFeatureForVariations(e) {
                    if (this.variationsIndex === -1) return null;
                    let t = this.table.featureVariations.featureVariationRecords[this.variationsIndex];
                    let s = t.featureTableSubstitution.substitutions;
                    for (let r of s){
                        if (r.featureIndex === e) return r.alternateFeatureTable;
                    }
                    return null;
                }
                findVariationsIndex(e) {
                    let t = this.table.featureVariations;
                    if (!t) return -1;
                    let s = t.featureVariationRecords;
                    for(let r = 0; r < s.length; r++){
                        let n = s[r].conditionSet.conditionTable;
                        if (this.variationConditionsMatch(n, e)) return r;
                    }
                    return -1;
                }
                variationConditionsMatch(e, t) {
                    return e.every((e)=>{
                        let s = e.axisIndex < t.length ? t[e.axisIndex] : 0;
                        return e.filterRangeMinValue <= s && s <= e.filterRangeMaxValue;
                    });
                }
                applyFeatures(e, t, s) {
                    let r = this.lookupsForFeatures(e);
                    this.applyLookups(r, t, s);
                }
                applyLookups(e, t, s) {
                    this.glyphs = t;
                    this.positions = s;
                    this.glyphIterator = new (0, n0)(t);
                    for (let { feature: r , lookup: n  } of e){
                        this.currentFeature = r;
                        this.glyphIterator.reset(n.flags);
                        while(this.glyphIterator.index < t.length){
                            if (!(r in this.glyphIterator.cur.features)) {
                                this.glyphIterator.next();
                                continue;
                            }
                            for (let a of n.subTables){
                                let l = this.applyLookup(n.lookupType, a);
                                if (l) break;
                            }
                            this.glyphIterator.next();
                        }
                    }
                }
                applyLookup(e, t) {
                    throw new Error("applyLookup must be implemented by subclasses");
                }
                applyLookupList(e) {
                    let t = this.glyphIterator.options;
                    let s = this.glyphIterator.index;
                    for (let r of e){
                        this.glyphIterator.reset(t, s);
                        this.glyphIterator.increment(r.sequenceIndex);
                        let n = this.table.lookupList.get(r.lookupListIndex);
                        this.glyphIterator.reset(n.flags, this.glyphIterator.index);
                        for (let a of n.subTables){
                            if (this.applyLookup(n.lookupType, a)) break;
                        }
                    }
                    this.glyphIterator.reset(t, s);
                    return true;
                }
                coverageIndex(e, t) {
                    if (t == null) t = this.glyphIterator.cur.id;
                    switch(e.version){
                        case 1:
                            return e.glyphs.indexOf(t);
                        case 2:
                            for (let s of e.rangeRecords){
                                if (s.start <= t && t <= s.end) return s.startCoverageIndex + t - s.start;
                            }
                            break;
                    }
                    return -1;
                }
                match(e, t, s, r) {
                    let n = this.glyphIterator.index;
                    let a = this.glyphIterator.increment(e);
                    let l = 0;
                    while(l < t.length && a && s(t[l], a)){
                        if (r) r.push(this.glyphIterator.index);
                        l++;
                        a = this.glyphIterator.next();
                    }
                    this.glyphIterator.index = n;
                    if (l < t.length) return false;
                    return r || true;
                }
                sequenceMatches(e, t) {
                    return this.match(e, t, (e, t)=>e === t.id);
                }
                sequenceMatchIndices(e, t) {
                    return this.match(e, t, (e, t)=>{
                        if (!(this.currentFeature in t.features)) return false;
                        return e === t.id;
                    }, []);
                }
                coverageSequenceMatches(e, t) {
                    return this.match(e, t, (e, t)=>this.coverageIndex(e, t.id) >= 0);
                }
                getClassID(e, t) {
                    switch(t.version){
                        case 1:
                            let s = e - t.startGlyph;
                            if (s >= 0 && s < t.classValueArray.length) return t.classValueArray[s];
                            break;
                        case 2:
                            for (let r of t.classRangeRecord){
                                if (r.start <= e && e <= r.end) return r.class;
                            }
                            break;
                    }
                    return 0;
                }
                classSequenceMatches(e, t, s) {
                    return this.match(e, t, (e, t)=>e === this.getClassID(t.id, s));
                }
                applyContext(e) {
                    let t, s;
                    switch(e.version){
                        case 1:
                            t = this.coverageIndex(e.coverage);
                            if (t === -1) return false;
                            s = e.ruleSets[t];
                            for (let r of s){
                                if (this.sequenceMatches(1, r.input)) return this.applyLookupList(r.lookupRecords);
                            }
                            break;
                        case 2:
                            if (this.coverageIndex(e.coverage) === -1) return false;
                            t = this.getClassID(this.glyphIterator.cur.id, e.classDef);
                            if (t === -1) return false;
                            s = e.classSet[t];
                            for (let n of s){
                                if (this.classSequenceMatches(1, n.classes, e.classDef)) return this.applyLookupList(n.lookupRecords);
                            }
                            break;
                        case 3:
                            if (this.coverageSequenceMatches(0, e.coverages)) return this.applyLookupList(e.lookupRecords);
                            break;
                    }
                    return false;
                }
                applyChainingContext(e) {
                    let t;
                    switch(e.version){
                        case 1:
                            t = this.coverageIndex(e.coverage);
                            if (t === -1) return false;
                            let s = e.chainRuleSets[t];
                            for (let r of s){
                                if (this.sequenceMatches(-r.backtrack.length, r.backtrack) && this.sequenceMatches(1, r.input) && this.sequenceMatches(1 + r.input.length, r.lookahead)) return this.applyLookupList(r.lookupRecords);
                            }
                            break;
                        case 2:
                            if (this.coverageIndex(e.coverage) === -1) return false;
                            t = this.getClassID(this.glyphIterator.cur.id, e.inputClassDef);
                            let n = e.chainClassSet[t];
                            if (!n) return false;
                            for (let a of n){
                                if (this.classSequenceMatches(-a.backtrack.length, a.backtrack, e.backtrackClassDef) && this.classSequenceMatches(1, a.input, e.inputClassDef) && this.classSequenceMatches(1 + a.input.length, a.lookahead, e.lookaheadClassDef)) return this.applyLookupList(a.lookupRecords);
                            }
                            break;
                        case 3:
                            if (this.coverageSequenceMatches(-e.backtrackGlyphCount, e.backtrackCoverage) && this.coverageSequenceMatches(0, e.inputCoverage) && this.coverageSequenceMatches(e.inputGlyphCount, e.lookaheadCoverage)) return this.applyLookupList(e.lookupRecords);
                            break;
                    }
                    return false;
                }
                constructor(e, t){
                    this.font = e;
                    this.table = t;
                    this.script = null;
                    this.scriptTag = null;
                    this.language = null;
                    this.languageTag = null;
                    this.features = {};
                    this.lookups = {};
                    this.variationsIndex = e._variationProcessor ? this.findVariationsIndex(e._variationProcessor.normalizedCoords) : -1;
                    this.selectScript();
                    this.glyphs = [];
                    this.positions = [];
                    this.ligatureID = 1;
                    this.currentFeature = null;
                }
            }
            class n3 {
                get id() {
                    return this._id;
                }
                set id(e) {
                    this._id = e;
                    this.substituted = true;
                    let t = this._font.GDEF;
                    if (t && t.glyphClassDef) {
                        let s = (0, n2).prototype.getClassID(e, t.glyphClassDef);
                        this.isBase = s === 1;
                        this.isLigature = s === 2;
                        this.isMark = s === 3;
                        this.markAttachmentType = t.markAttachClassDef ? (0, n2).prototype.getClassID(e, t.markAttachClassDef) : 0;
                    } else {
                        this.isMark = this.codePoints.length > 0 && this.codePoints.every((0, i.YB));
                        this.isBase = !this.isMark;
                        this.isLigature = this.codePoints.length > 1;
                        this.markAttachmentType = 0;
                    }
                }
                copy() {
                    return new n3(this._font, this.id, this.codePoints, this.features);
                }
                constructor(e, t, s = [], r){
                    this._font = e;
                    this.codePoints = s;
                    this.id = t;
                    this.features = {};
                    if (Array.isArray(r)) for(let n = 0; n < r.length; n++){
                        let a = r[n];
                        this.features[a] = true;
                    }
                    else if (typeof r === "object") Object.assign(this.features, r);
                    this.ligatureID = null;
                    this.ligatureComponent = null;
                    this.isLigated = false;
                    this.cursiveAttachment = null;
                    this.markAttachment = null;
                    this.shaperInfo = null;
                    this.substituted = false;
                    this.isMultiplied = false;
                }
            }
            class n4 extends (0, nB) {
                static planFeatures(e) {
                    e.add([
                        "ljmo",
                        "vjmo",
                        "tjmo"
                    ], false);
                }
                static assignFeatures(e, t) {
                    let s = 0;
                    let r = 0;
                    while(r < t.length){
                        let n;
                        let a = t[r];
                        let l = a.codePoints[0];
                        let i = aC(l);
                        [n, s] = aU[s][i];
                        switch(n){
                            case ak:
                                if (!e.font.hasGlyphForCodePoint(l)) r = aT(t, r, e.font);
                                break;
                            case aS:
                                r = aO(t, r, e.font);
                                break;
                            case aI:
                                aD(t, r, e.font);
                                break;
                            case aP:
                                r = aM(t, r, e.font);
                                break;
                        }
                        r++;
                    }
                }
            }
            (0, n.Z)(n4, "zeroMarkWidths", "NONE");
            const n5 = 0xac00;
            const n7 = 0xd7a4;
            const n6 = n7 - n5 + 1;
            const n9 = 0x1100;
            const n8 = 0x1161;
            const ae = 0x11a7;
            const at = 19;
            const as = 21;
            const ar = 28;
            const an = n9 + at - 1;
            const aa = n8 + as - 1;
            const al = ae + ar - 1;
            const ai = 0x25cc;
            const ao = (e)=>0x1100 <= e && e <= 0x115f || 0xa960 <= e && e <= 0xa97c;
            const au = (e)=>0x1160 <= e && e <= 0x11a7 || 0xd7b0 <= e && e <= 0xd7c6;
            const ac = (e)=>0x11a8 <= e && e <= 0x11ff || 0xd7cb <= e && e <= 0xd7fb;
            const af = (e)=>0x302e <= e && e <= 0x302f;
            const ah = (e)=>n5 <= e && e <= n7;
            const ad = (e)=>e - n5 < n6 && (e - n5) % ar === 0;
            const am = (e)=>n9 <= e && e <= an;
            const ap = (e)=>n8 <= e && e <= aa;
            const ag = (e)=>ae + 1 && 1 <= e && e <= al;
            const ab = 0;
            const ay = 1;
            const aw = 2;
            const ax = 3;
            const av = 4;
            const a_ = 5;
            const aL = 6;
            function aC(e) {
                if (ao(e)) return ay;
                if (au(e)) return aw;
                if (ac(e)) return ax;
                if (ad(e)) return av;
                if (ah(e)) return a_;
                if (af(e)) return aL;
                return ab;
            }
            const aA = 0;
            const ak = 1;
            const aS = 2;
            const aI = 4;
            const aP = 5;
            const aU = [
                [
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        1
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        ak,
                        2
                    ],
                    [
                        ak,
                        3
                    ],
                    [
                        aP,
                        0
                    ]
                ],
                [
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        1
                    ],
                    [
                        aS,
                        2
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        ak,
                        2
                    ],
                    [
                        ak,
                        3
                    ],
                    [
                        aP,
                        0
                    ]
                ],
                [
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        1
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        aS,
                        3
                    ],
                    [
                        ak,
                        2
                    ],
                    [
                        ak,
                        3
                    ],
                    [
                        aI,
                        0
                    ]
                ],
                [
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        1
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        aA,
                        0
                    ],
                    [
                        ak,
                        2
                    ],
                    [
                        ak,
                        3
                    ],
                    [
                        aI,
                        0
                    ]
                ]
            ];
            function aJ(e, t, s) {
                return new (0, n3)(e, e.glyphForCodePoint(t).id, [
                    t
                ], s);
            }
            function aT(e, t, s) {
                let r = e[t];
                let n = r.codePoints[0];
                let a = n - n5;
                let l = ae + a % ar;
                a = a / ar | 0;
                let i = n9 + a / as | 0;
                let o = n8 + a % as;
                if (!s.hasGlyphForCodePoint(i) || !s.hasGlyphForCodePoint(o) || l !== ae && !s.hasGlyphForCodePoint(l)) return t;
                let u = aJ(s, i, r.features);
                u.features.ljmo = true;
                let c = aJ(s, o, r.features);
                c.features.vjmo = true;
                let f = [
                    u,
                    c
                ];
                if (l > ae) {
                    let h = aJ(s, l, r.features);
                    h.features.tjmo = true;
                    f.push(h);
                }
                e.splice(t, 1, ...f);
                return t + f.length - 1;
            }
            function aO(e, t, s) {
                let r = e[t];
                let n = e[t].codePoints[0];
                let a = aC(n);
                let l = e[t - 1].codePoints[0];
                let i = aC(l);
                let o, u, c, f;
                if (i === av && a === ax) {
                    o = l;
                    f = r;
                } else {
                    if (a === aw) {
                        u = e[t - 1];
                        c = r;
                    } else {
                        u = e[t - 2];
                        c = e[t - 1];
                        f = r;
                    }
                    let h = u.codePoints[0];
                    let d = c.codePoints[0];
                    if (am(h) && ap(d)) o = n5 + ((h - n9) * as + (d - n8)) * ar;
                }
                let m = f && f.codePoints[0] || ae;
                if (o != null && (m === ae || ag(m))) {
                    let p = o + (m - ae);
                    if (s.hasGlyphForCodePoint(p)) {
                        let g = i === aw ? 3 : 2;
                        e.splice(t - g + 1, g, aJ(s, p, r.features));
                        return t - g + 1;
                    }
                }
                if (u) u.features.ljmo = true;
                if (c) c.features.vjmo = true;
                if (f) f.features.tjmo = true;
                if (i === av) {
                    aT(e, t - 1, s);
                    return t + 1;
                }
                return t;
            }
            function aF(e) {
                switch(aC(e)){
                    case av:
                    case a_:
                        return 1;
                    case aw:
                        return 2;
                    case ax:
                        return 3;
                }
            }
            function aD(e, t, s) {
                let r = e[t];
                let n = e[t].codePoints[0];
                if (s.glyphForCodePoint(n).advanceWidth === 0) return;
                let a = e[t - 1].codePoints[0];
                let l = aF(a);
                e.splice(t, 1);
                return e.splice(t - l, 0, r);
            }
            function aM(e, t, s) {
                let r = e[t];
                let n = e[t].codePoints[0];
                if (s.hasGlyphForCodePoint(ai)) {
                    let a = aJ(s, ai, r.features);
                    let l = s.glyphForCodePoint(n).advanceWidth === 0 ? t : t + 1;
                    e.splice(l, 0, a);
                    t++;
                }
                return t;
            }
            var aG = {};
            aG = JSON.parse('{"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,14,15,16,17],[0,0,0,18,19,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,28,29,30,31,32,33,0,34,0,0,35,36,0,0,37,0],[0,0,0,38,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,39,0,0,0,40,41,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,12,43,0,0,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,0,43,0,0,0,0],[0,0,0,45,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,50,0,0,51,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,52,0,0,0,0,0,0,0,0],[0,0,0,53,54,55,56,57,58,0,59,0,0,60,61,0,0,62,0],[0,0,0,4,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,63,64,0,0,40,41,0,9,0,10,0,0,0,42,0,63,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,0,2,16,0],[0,0,0,18,65,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,0,0],[0,0,0,69,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,73,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,75,0,0,0,76,77,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,25,79,0,0,0,0],[0,0,0,18,19,20,74,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,81,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,86,0,0,87,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,0,0,0],[0,0,0,18,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,89,90,0,0,76,77,0,23,0,24,0,0,0,78,0,89,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,0,0],[0,0,0,94,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,96,0,0,0,97,98,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,35,100,0,0,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,102,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,107,0,0,108,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,109,0,0,0,0,0,0,0,0],[0,0,0,28,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,110,111,0,0,97,98,0,33,0,34,0,0,0,99,0,110,0,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,0,0],[0,0,0,0,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,0,0,115,116,117,118,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,39,0,122,0,123,123,8,9,0,10,0,0,0,42,0,39,0,0],[0,124,64,0,0,0,0,0,0,0,0,0,0,0,0,0,124,0,0],[0,39,0,0,0,121,125,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,126,126,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,47,47,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,128,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,129,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,50,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,134,0,0,0,0,0,0,0,0],[0,0,0,135,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,136,0,0,0,137,138,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,60,140,0,0,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,0,140,0,0,0,0],[0,0,0,142,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,147,0,0,148,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,0,0,0],[0,0,0,53,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,150,151,0,0,137,138,0,58,0,59,0,0,0,139,0,150,0,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,0,0],[0,0,0,155,116,156,157,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,75,3,4,5,159,160,8,161,0,162,0,11,12,163,0,75,16,0],[0,0,0,0,0,40,164,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,0,165,0,0,0,0],[0,124,64,0,0,40,164,0,9,0,10,0,0,0,42,0,124,0,0],[0,0,0,0,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,71,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,167,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,168,0,0,0,0,0,0,0,0],[0,0,0,0,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,0,79,0,0,0,0],[0,0,0,169,170,171,172,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,75,0,176,0,177,177,22,23,0,24,0,0,0,78,0,75,0,0],[0,178,90,0,0,0,0,0,0,0,0,0,0,0,0,0,178,0,0],[0,75,0,0,0,175,179,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,180,180,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,83,83,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,182,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,183,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,86,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,188,0,0,0,0,0,0,0,0],[0,0,0,189,170,190,191,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,76,193,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,0,194,0,0,0,0],[0,178,90,0,0,76,193,0,23,0,24,0,0,0,78,0,178,0,0],[0,0,0,0,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,195,196,197,198,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,96,0,202,0,203,203,32,33,0,34,0,0,0,99,0,96,0,0],[0,204,111,0,0,0,0,0,0,0,0,0,0,0,0,0,204,0,0],[0,96,0,0,0,201,205,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,206,206,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,104,104,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,208,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,209,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,107,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,214,0,0,0,0,0,0,0,0],[0,0,0,215,196,216,217,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,97,219,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,0,220,0,0,0,0],[0,204,111,0,0,97,219,0,33,0,34,0,0,0,99,0,204,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,223,0,0,0,40,224,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,119,225,0,0,0,0],[0,0,0,115,116,117,222,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,115,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,226,64,0,0,40,224,0,9,0,10,0,0,0,42,0,226,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,39,0,0,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,44,44,8,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,227,0,228,229,0,9,0,10,0,0,230,0,0,0,0,0],[0,39,0,122,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,231,231,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,232,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,131,131,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,234,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,235,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,0,0,240,241,242,243,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,136,0,247,0,248,248,57,58,0,59,0,0,0,139,0,136,0,0],[0,249,151,0,0,0,0,0,0,0,0,0,0,0,0,0,249,0,0],[0,136,0,0,0,246,250,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,251,251,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,144,144,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,253,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,254,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,147,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,259,0,0,0,0,0,0,0,0],[0,0,0,260,241,261,262,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,137,264,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,0,265,0,0,0,0],[0,249,151,0,0,137,264,0,58,0,59,0,0,0,139,0,249,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,158,225,0,0,0,0],[0,0,0,155,116,156,222,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,155,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,43,266,266,8,161,0,24,0,0,12,267,0,0,0,0],[0,75,0,176,43,268,268,269,161,0,24,0,0,0,267,0,75,0,0],[0,0,0,0,0,270,0,0,271,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,272,0,0,0,0,0,0,0,0],[0,273,274,0,0,40,41,0,9,0,10,0,0,0,42,0,273,0,0],[0,0,0,40,0,123,123,8,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,121,275,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,276,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,279,0,0,0,76,280,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,173,281,0,0,0,0],[0,0,0,169,170,171,278,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,169,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,282,90,0,0,76,280,0,23,0,24,0,0,0,78,0,282,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,75,0,0,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,80,80,22,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,283,0,284,285,0,23,0,24,0,0,286,0,0,0,0,0],[0,75,0,176,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,287,287,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,288,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,185,185,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,290,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,291,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,192,281,0,0,0,0],[0,0,0,189,170,190,278,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,189,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,76,0,177,177,22,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,175,296,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,299,0,0,0,97,300,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,199,301,0,0,0,0],[0,0,0,195,196,197,298,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,195,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,302,111,0,0,97,300,0,33,0,34,0,0,0,99,0,302,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,96,0,0,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,101,101,32,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,303,0,304,305,0,33,0,34,0,0,306,0,0,0,0,0],[0,96,0,202,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,307,307,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,308,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,211,211,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,310,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,311,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,218,301,0,0,0,0],[0,0,0,215,196,216,298,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,215,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,97,0,203,203,32,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,201,316,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,0,225,0,0,0,0],[0,0,0,317,318,319,320,8,9,0,10,0,0,321,322,0,0,16,0],[0,223,0,323,0,123,123,8,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,0,0,121,324,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,325,318,326,327,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,64,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,230,0,0,0,0,0],[0,0,0,227,0,228,121,0,9,0,10,0,0,230,0,0,0,0,0],[0,0,0,227,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,0,0],[0,0,0,0,0,329,329,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,330,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,237,237,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,332,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,333,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,337,0,0,0,137,338,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,244,339,0,0,0,0],[0,0,0,240,241,242,336,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,240,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,340,151,0,0,137,338,0,58,0,59,0,0,0,139,0,340,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,136,0,0,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,141,141,57,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,341,0,342,343,0,58,0,59,0,0,344,0,0,0,0,0],[0,136,0,247,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,0,0,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,345,345,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,346,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,256,256,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,348,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,349,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,263,339,0,0,0,0],[0,0,0,260,241,261,336,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,260,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,137,0,248,248,57,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,246,354,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,126,126,8,23,0,0,0,0,0,0,0,0,0,0],[0,355,90,0,0,121,125,0,9,0,10,0,0,0,42,0,355,0,0],[0,0,0,0,0,356,356,269,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,357,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,270,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,363,0,0,0,0,0,0,0,0],[0,0,0,364,116,365,366,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,40,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,0,281,0,0,0,0],[0,0,0,369,370,371,372,22,23,0,24,0,0,373,374,0,0,27,0],[0,279,0,375,0,177,177,22,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,0,0,175,376,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,377,370,378,379,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,90,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,286,0,0,0,0,0],[0,0,0,283,0,284,175,0,23,0,24,0,0,286,0,0,0,0,0],[0,0,0,283,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,82,0,0],[0,0,0,0,0,381,381,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,382,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,293,293,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,384,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,385,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,76,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,0,301,0,0,0,0],[0,0,0,387,388,389,390,32,33,0,34,0,0,391,392,0,0,37,0],[0,299,0,393,0,203,203,32,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,0,0,201,394,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,395,388,396,397,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,111,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,306,0,0,0,0,0],[0,0,0,303,0,304,201,0,33,0,34,0,0,306,0,0,0,0,0],[0,0,0,303,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,0,0],[0,0,0,0,0,399,399,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,400,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,313,313,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,402,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,403,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,97,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,407,0,0,0,40,408,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,321,409,0,0,0,0],[0,0,0,317,318,319,406,8,9,0,10,0,0,321,322,0,0,16,0],[0,0,0,317,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,410,64,0,0,40,408,0,9,0,10,0,0,0,42,0,410,0,0],[0,223,0,0,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,323,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,328,409,0,0,0,0],[0,0,0,325,318,326,406,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,325,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,0,0,0,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,130,0,0],[0,0,0,0,0,411,411,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,412,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,413,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,0,339,0,0,0,0],[0,0,0,414,415,416,417,57,58,0,59,0,0,418,419,0,0,62,0],[0,337,0,420,0,248,248,57,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,0,0,246,421,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,422,415,423,424,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,151,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,344,0,0,0,0,0],[0,0,0,341,0,342,246,0,58,0,59,0,0,344,0,0,0,0,0],[0,0,0,341,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143,0,0],[0,0,0,0,0,426,426,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,427,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,351,351,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,429,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,430,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,137,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,432,116,433,434,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,0,0,180,180,269,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,359,359,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,437,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,438,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,443,274,0,0,0,0,0,0,0,0,0,0,0,0,0,443,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,367,225,0,0,0,0],[0,0,0,364,116,365,445,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,364,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,448,0,0,0,76,449,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,373,450,0,0,0,0],[0,0,0,369,370,371,447,22,23,0,24,0,0,373,374,0,0,27,0],[0,0,0,369,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,451,90,0,0,76,449,0,23,0,24,0,0,0,78,0,451,0,0],[0,279,0,0,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,375,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,380,450,0,0,0,0],[0,0,0,377,370,378,447,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,377,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,0,0,0,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,0,0],[0,0,0,0,0,452,452,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,453,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,454,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,457,0,0,0,97,458,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,391,459,0,0,0,0],[0,0,0,387,388,389,456,32,33,0,34,0,0,391,392,0,0,37,0],[0,0,0,387,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,460,111,0,0,97,458,0,33,0,34,0,0,0,99,0,460,0,0],[0,299,0,0,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,393,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,398,459,0,0,0,0],[0,0,0,395,388,396,456,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,395,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,0,0,0,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,210,0,0],[0,0,0,0,0,461,461,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,462,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,463,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,0,409,0,0,0,0],[0,0,0,464,465,466,467,8,9,0,10,0,0,468,469,0,0,16,0],[0,407,0,470,0,123,123,8,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,0,0,121,471,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,472,465,473,474,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,0,0,0,0,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,236,0,0],[0,0,0,0,0,0,476,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,479,0,0,0,137,480,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,418,481,0,0,0,0],[0,0,0,414,415,416,478,57,58,0,59,0,0,418,419,0,0,62,0],[0,0,0,414,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,482,151,0,0,137,480,0,58,0,59,0,0,0,139,0,482,0,0],[0,337,0,0,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,420,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,425,481,0,0,0,0],[0,0,0,422,415,423,478,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,422,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,0,0,0,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0],[0,0,0,0,0,483,483,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,484,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,485,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,435,225,0,0,0,0],[0,0,0,432,116,433,445,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,432,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,486,486,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,487,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,440,440,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,489,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,490,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,495,0,496,497,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,0,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,0,225,0,0,0,0],[0,0,0,0,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,0,450,0,0,0,0],[0,0,0,499,500,501,502,22,23,0,24,0,0,503,504,0,0,27,0],[0,448,0,505,0,177,177,22,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,0,0,175,506,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,507,500,508,509,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,0,0,0,0,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,292,0,0],[0,0,0,0,0,0,511,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,0,459,0,0,0,0],[0,0,0,512,513,514,515,32,33,0,34,0,0,516,517,0,0,37,0],[0,457,0,518,0,203,203,32,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,0,0,201,519,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,520,513,521,522,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,0,0,0,0,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,312,0,0],[0,0,0,0,0,0,524,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,527,0,0,0,40,528,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,468,529,0,0,0,0],[0,0,0,464,465,466,526,8,9,0,10,0,0,468,469,0,0,16,0],[0,0,0,464,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,530,64,0,0,40,528,0,9,0,10,0,0,0,42,0,530,0,0],[0,407,0,0,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,470,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,475,529,0,0,0,0],[0,0,0,472,465,473,526,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,472,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,0,0],[0,0,0,0,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,0,481,0,0,0,0],[0,0,0,531,532,533,534,57,58,0,59,0,0,535,536,0,0,62,0],[0,479,0,537,0,248,248,57,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,0,0,246,538,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,539,532,540,541,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,0,0,0,0,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,350,0,0],[0,0,0,0,0,0,543,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,358,0,0],[0,0,0,0,0,544,544,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,545,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,492,492,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,547,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,548,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,274,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,498,0,0,0,0,0],[0,0,0,495,0,496,368,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,495,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,553,0,0,0,76,554,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,503,555,0,0,0,0],[0,0,0,499,500,501,552,22,23,0,24,0,0,503,504,0,0,27,0],[0,0,0,499,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,556,90,0,0,76,554,0,23,0,24,0,0,0,78,0,556,0,0],[0,448,0,0,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,505,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,510,555,0,0,0,0],[0,0,0,507,500,508,552,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,507,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,559,0,0,0,97,560,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,516,561,0,0,0,0],[0,0,0,512,513,514,558,32,33,0,34,0,0,516,517,0,0,37,0],[0,0,0,512,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,562,111,0,0,97,560,0,33,0,34,0,0,0,99,0,562,0,0],[0,457,0,0,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,518,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,523,561,0,0,0,0],[0,0,0,520,513,521,558,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,520,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,0,0],[0,0,0,0,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,0,529,0,0,0,0],[0,0,0,563,66,564,565,8,9,0,10,0,0,566,68,0,0,16,0],[0,527,0,567,0,123,123,8,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,0,0,121,568,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,569,66,570,571,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,575,0,0,0,137,576,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,535,577,0,0,0,0],[0,0,0,531,532,533,574,57,58,0,59,0,0,535,536,0,0,62,0],[0,0,0,531,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,578,151,0,0,137,576,0,58,0,59,0,0,0,139,0,578,0,0],[0,479,0,0,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,537,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,542,577,0,0,0,0],[0,0,0,539,532,540,574,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,539,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,137,0,0],[0,0,0,0,0,0,0,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,439,0,0],[0,0,0,0,0,579,579,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,580,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,581,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,0,555,0,0,0,0],[0,0,0,582,91,583,584,22,23,0,24,0,0,585,93,0,0,27,0],[0,553,0,586,0,177,177,22,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,0,0,175,587,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,588,91,589,590,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,0,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,0,561,0,0,0,0],[0,0,0,592,112,593,594,32,33,0,34,0,0,595,114,0,0,37,0],[0,559,0,596,0,203,203,32,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,0,0,201,597,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,598,112,599,600,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,566,165,0,0,0,0],[0,0,0,563,66,564,67,8,9,0,10,0,0,566,68,0,0,16,0],[0,0,0,563,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,527,0,0,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,567,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,572,165,0,0,0,0],[0,0,0,569,66,570,67,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,569,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,0,577,0,0,0,0],[0,0,0,603,152,604,605,57,58,0,59,0,0,606,154,0,0,62,0],[0,575,0,607,0,248,248,57,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,0,0,246,608,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,609,152,610,611,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,0,0,0,0,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,491,0,0],[0,0,0,0,0,0,613,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,585,194,0,0,0,0],[0,0,0,582,91,583,92,22,23,0,24,0,0,585,93,0,0,27,0],[0,0,0,582,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,553,0,0,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,586,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,591,194,0,0,0,0],[0,0,0,588,91,589,92,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,588,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,595,220,0,0,0,0],[0,0,0,592,112,593,113,32,33,0,34,0,0,595,114,0,0,37,0],[0,0,0,592,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,559,0,0,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,596,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,601,220,0,0,0,0],[0,0,0,598,112,599,113,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,598,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,606,265,0,0,0,0],[0,0,0,603,152,604,153,57,58,0,59,0,0,606,154,0,0,62,0],[0,0,0,603,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,575,0,0,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,607,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,612,265,0,0,0,0],[0,0,0,609,152,610,153,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,609,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,549,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0]],"accepting":[false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,false,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,false,false,true,false,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,false,false,true,true,false,false,true,true,true,false,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,false,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,false,true,true,false,true,true,true],"tags":[[],["broken_cluster"],["consonant_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],[],["broken_cluster"],["symbol_cluster"],[],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["symbol_cluster"],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],[],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],[],[],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],["consonant_syllable"],["vowel_syllable"],["standalone_cluster"]]}');
            var aE = {};
            aE = JSON.parse('{"categories":["O","IND","S","GB","B","FM","CGJ","VMAbv","VMPst","VAbv","VPst","CMBlw","VPre","VBlw","H","VMBlw","CMAbv","MBlw","CS","R","SUB","MPst","MPre","FAbv","FPst","FBlw","SMAbv","SMBlw","VMPre","ZWNJ","ZWJ","WJ","VS","N","HN","MAbv"],"decompositions":{"2507":[2503,2494],"2508":[2503,2519],"2888":[2887,2902],"2891":[2887,2878],"2892":[2887,2903],"3018":[3014,3006],"3019":[3015,3006],"3020":[3014,3031],"3144":[3142,3158],"3264":[3263,3285],"3271":[3270,3285],"3272":[3270,3286],"3274":[3270,3266],"3275":[3270,3266,3285],"3402":[3398,3390],"3403":[3399,3390],"3404":[3398,3415],"3546":[3545,3530],"3548":[3545,3535],"3549":[3545,3535,3530],"3550":[3545,3551],"3635":[3661,3634],"3763":[3789,3762],"3955":[3953,3954],"3957":[3953,3956],"3958":[4018,3968],"3959":[4018,3953,3968],"3960":[4019,3968],"3961":[4019,3953,3968],"3969":[3953,3968],"6971":[6970,6965],"6973":[6972,6965],"6976":[6974,6965],"6977":[6975,6965],"6979":[6978,6965],"69934":[69937,69927],"69935":[69938,69927],"70475":[70471,70462],"70476":[70471,70487],"70843":[70841,70842],"70844":[70841,70832],"70846":[70841,70845],"71098":[71096,71087],"71099":[71097,71087]},"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[2,2,3,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,17,18,11,19,20,21,22,0,0,23,0,0,2,0,24,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,27,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,39,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,49,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,53,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,54,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0]],"accepting":[false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"tags":[[],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["symbol_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["virama_terminated_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["number_joiner_terminated_cluster"],["standard_cluster"],["standard_cluster"],["numeral_cluster"]]}');
            const aB = {
                X: 1,
                C: 2,
                V: 4,
                N: 8,
                H: 16,
                ZWNJ: 32,
                ZWJ: 64,
                M: 128,
                SM: 256,
                VD: 512,
                A: 1024,
                Placeholder: 2048,
                Dotted_Circle: 4096,
                RS: 8192,
                Coeng: 16384,
                Repha: 32768,
                Ra: 65536,
                CM: 131072,
                Symbol: 262144
            };
            const aV = {
                Start: 1,
                Ra_To_Become_Reph: 2,
                Pre_M: 4,
                Pre_C: 8,
                Base_C: 16,
                After_Main: 32,
                Above_C: 64,
                Before_Sub: 128,
                Below_C: 256,
                After_Sub: 512,
                Before_Post: 1024,
                Post_C: 2048,
                After_Post: 4096,
                Final_C: 8192,
                SMVD: 16384,
                End: 32768
            };
            const az = aB.C | aB.Ra | aB.CM | aB.V | aB.Placeholder | aB.Dotted_Circle;
            const aR = aB.ZWJ | aB.ZWNJ;
            const aN = aB.H | aB.Coeng;
            const aW = {
                Default: {
                    hasOldSpec: false,
                    virama: 0,
                    basePos: "Last",
                    rephPos: aV.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Devanagari: {
                    hasOldSpec: true,
                    virama: 0x094D,
                    basePos: "Last",
                    rephPos: aV.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Bengali: {
                    hasOldSpec: true,
                    virama: 0x09CD,
                    basePos: "Last",
                    rephPos: aV.After_Sub,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Gurmukhi: {
                    hasOldSpec: true,
                    virama: 0x0A4D,
                    basePos: "Last",
                    rephPos: aV.Before_Sub,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Gujarati: {
                    hasOldSpec: true,
                    virama: 0x0ACD,
                    basePos: "Last",
                    rephPos: aV.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Oriya: {
                    hasOldSpec: true,
                    virama: 0x0B4D,
                    basePos: "Last",
                    rephPos: aV.After_Main,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Tamil: {
                    hasOldSpec: true,
                    virama: 0x0BCD,
                    basePos: "Last",
                    rephPos: aV.After_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Telugu: {
                    hasOldSpec: true,
                    virama: 0x0C4D,
                    basePos: "Last",
                    rephPos: aV.After_Post,
                    rephMode: "Explicit",
                    blwfMode: "Post_Only"
                },
                Kannada: {
                    hasOldSpec: true,
                    virama: 0x0CCD,
                    basePos: "Last",
                    rephPos: aV.After_Post,
                    rephMode: "Implicit",
                    blwfMode: "Post_Only"
                },
                Malayalam: {
                    hasOldSpec: true,
                    virama: 0x0D4D,
                    basePos: "Last",
                    rephPos: aV.After_Main,
                    rephMode: "Log_Repha",
                    blwfMode: "Pre_And_Post"
                },
                Khmer: {
                    hasOldSpec: false,
                    virama: 0x17D2,
                    basePos: "First",
                    rephPos: aV.Ra_To_Become_Reph,
                    rephMode: "Vis_Repha",
                    blwfMode: "Pre_And_Post"
                }
            };
            const aX = {
                0x17BE: [
                    0x17C1,
                    0x17BE
                ],
                0x17BF: [
                    0x17C1,
                    0x17BF
                ],
                0x17C0: [
                    0x17C1,
                    0x17C0
                ],
                0x17C4: [
                    0x17C1,
                    0x17C4
                ],
                0x17C5: [
                    0x17C1,
                    0x17C5
                ]
            };
            const { decompositions: aq  } = (0, (m(aE)));
            const aH = new (0, o)((0, rG)("AAARAAAAAACgwgAAAbENTvLtnX+sHUUVx/f13nd/vHf7bl+FRGL7R0OJMcWYphBrimkVCSJR2xiEaLEGQ7AkBGowbYRSgj8K2B/GkpRYE6wlQSyJKCagrSlGkmqsqUZMY7S2CWkgqQViQSkt4Hfuzrx77tyZ2fm1u+/RPcknuzs7O3PmnDOzs7N73zteS5KXwKvgDTCnniTvBfPBJeAVpP2vFr69GGUtAkvAModyr0DeT4BrwCpwPVgDbga3ga+DjYbyluLcCvBN8F2wGWwHO8Ej4DjyPIbtz0DCeZpvD4CD4E/gb+AoOAFOgtPgLKiNJkkbTIKLwALwfvAh8GGwHFwFPg2uAzeCm8Ft4E5wN7gPPAi+D34AfgR+Ap7kx8+AZ8HvwZ/BEXAMvAheAa+Bc6OpzvVGknTABY30eB62C8GlYDFYCpaDq/n5z2J7PVgDbgG3N1KbrOdbWzby/N/G9i6wlR8/wLebUNcOll7vX7PLsQ4bdpAy92B/L3gK7AO/A38EfwX/AC+AkyT/m3x7mqdtYz7Gfq2ZJOPgPc3UXu/D9uJmmmcRT1uC7TJwZTONJxFL1+J4JbgBrAG3gNv5Nev5dhO2m3l54rqtON7RNLd1V8Z5auMfI+8Wbvv12P4Ux78AvyZl/Bb7fwD34HwH/EVR/t8t6rRlrYgFlHnMsdyXIupRFP+Gzv8Bb4CklSSjrTR9bz21uZx/Nj8v+uIFOJ4HFnJo3kWtNG6WkPSzBl1YbC8jeVfx+q+R9Pg48lxN8jFdhd8+01LrLTCdq6io8GNb1a8qKioqKioqKioc2cbXGcrWQ2Ynf9a9rmV/zVua9Dc16V/gz8pfxvar4A6wAdwL7gdbwUPgh+BR8AR4qpWuLe3D9gA4CA6DI+AoOAFOtdL1nNexfYs937fxDA8ubKf1zmv3dViI/Uvb9m2sqKioqAiHrVtehrH3TK2/3l4WZduioqIiDq+Rd1Jbef9ehnHmSnCtNNf7nOPcr8PHilO8jrfBF9v996lfwf6tUpl3tPvvdSjsvcwGnLt3Gsw/kzkpK8CdYH83my3Id0iT91WkL5xMktXgIfD85OD54zjfmYu5OFgN7h1LkmdBMg5fgbvAChzv49ujfEuZ3xlOk7kReTaSfL/B/jl+fMXsJLkb7AcPj8TlHC/zsgnYcyLd3zSh1vGAJr2ioqKiIn/eKXkMjn3/cWF5t/z6y37+K5urwP2YB36vPfw8yr7zeRjpu8g8cTf2H2+n89EtivLE93fs27Ez/Br2vM2+qWPl/ZyX9StFfQxW5v724PPxzXz7XHu4Pps5Jvtmiq13szmzfP0hlHkYHGn358bHeD0vYvsy+K+kz9vt/jy8gT40G1w4Rua0PN98nnaGf/e1G+mXIO2DY8P6Xz7WPz7Ky/7omJ0PBff4+B91fAqsAp8HXwI3gR04txbbdWDDWDpP/g7Yxs6BXWAP2AueJHo+M5bOpw+Cw+AIOApOgFMW7Xkdec6AkXH1+QfgyzbOTY73jy/C/gJ+/CCOP4D9xfz4I9h+TFMWtf9SRWzZwq7f0yi/L9voWSRbDfV/clx/3TuKfjoT26/iX813URx4tiVG3ay/sfFuJenb7J50A4mr1di/CZzLKZ6y2reunup4qzT+fM0wHp0PUD9+A7bYNJ5fn3eNP/Ft5bc0+S4n9/l1Gj+K82zesd1wfj3fZ79h2YyyVvLj7djfCR4xjJEyuy1+S/FyDt/MPwodn5hB8axrxy9nSBtYjOyHrs+BQ+B58E+u+wsWbWBtpb/hYL8RuA/pJ8fT2GffX+wl+daSa08jz9nxNG2k4963XBG/ZVhpUS573mh3BtPo7x/Eb7pE2yd5XvZssY/M/RZLc9SLeDsfD5gfTidi9//pwrzWu7t9lKcN7dxynthAh8vcKrQu1frHTGKBNF662KfoOXU1FsaFxe6x2kjClkBnGvXxwX0bytZ5unK+S9n2jxabTc5M0HUaIyTrfFa+Ljmflc9Xz7JtNdPa4eKz6WAPlb5l6xfLBzopWxcfncvSf7rHRJk2KSN2bKRsvcu2UZmxVIb9qd551e8rZcTERGuQ+qwIjERkjl2+djOlhWfpibnp/qxmP92FVr1/bc9GYxxuI5o3UzdukzYpj+H6nOxra9nHiaksjhDdsasPe9ca/CvOU1GVwUT4t8P921H4T8gsnkdIh+dn/pXrU0mnOZw21CbJv1P5LP0r4jtkbLH171BbCvavnFfeZ8L8K2wv/CuQRU6n/qWSNSbr2mO8xtK/U+Mq6Y/1yQyFJHHtv8Kn2uOC/Gvbf2VEPxJ9SvhY5d+Q+y21iRxLruOzsY6MWGrOkPHZ1b+jFuPzqEX/VcmoZkyIPT53k36/DZnrMd+K/Dbjs6kv6+6VYl9OU+WT07TplvMvWWhfVo3f4t48S+rbjIZl/1b5Xyd5vJdQiTyf7tUdMlbn0J9d/cn6c7M5DO1TNF0+bmT0Z3qdKaaoXeg1Lv7NEhufzyT/6vIKEeO1jX/psdi38a889qpkStcI/u12U3zE1Re+/Yv6QNwvdTDJGi9t2ps1XtKYDJ0PmcZKcU812sRxvms7J47mZ5c+SWJD5LPRg4qqj+nWL8Q5sRVrGar1EG0sOI6ndH3DVWL7wpeuwaY6O1Nh19N+Oqs5uI7Eto3aICxNrCn5rAuZ7Cn2bdJtfZPlL/k8Ld+ki6v9E56XPUvT52mV/YVvmMj2Zz8TEuNMTxfHuFfFUJ60OLrz1utODnFG47fLbSjXy0xSy4gN63EywlhMxWcNmK71svszi5OGTvdJe3rtd8ifB6I/mKBr1ap7uU/sqqTsMb+H5fxBFyuq+yqLnd7cmj33TwyOVVOwuj3nVXRtQtUGWR9jzI6kecZrKSKPuFakU2hZmXXZMDlsS1W9jBavv6eHpf3EtfJ7mKwYV0lX2g9FVY5N+Ung9aH1590+n3KLgEredfiez6u9svisY/Suk9Jsnkli1a+C1m/T7rzqd5UY9mfiXX9R92ibdZUIawTC96b1GBn6rDG1JsPv/b392SkiXVUGmyN0LO5LYi46Zf/Adc/QMaCo8TtG/bH1Z/TsW1QfUPRjm2cZee5PRaT33lEbnhlMax4qe1o/Y8a0icdaoOv9bsh+Hj6jonueoGtHumcMlX9lxLxXq7/D84fSzznGt6rtUerXxYU47/IcPeG3vqBbJ1StETZqg9fS2Akd/0Ovp+/CxD3P+/6bQwzJtsvyh5w+XjeXH9KfXGH3/VbSX4tS4XoftPZbnvcyxX1G5QvW1wbWTkbs7c3mTco6NWODbdxk3R9lGZo/aGxhiknTmETXLVs1c90u9+mBGCf6hs6fsmTq29sxPv8d82CuhCpNjGNjg31blGHrz1i41hd6nuYzbU3XhLQzj7Jt67Otw0uXUdDoH8e4F/joMdVui2dMJc3E+Tetvr6jEtPnPhJaVwz9Y7TDVlx1qnfitlEbtzlTVD0qX/pcm1esxI65PO3mU4eNrr5SZMz46FDE+aIlb5tntb1o/WOUETsW847pvNpaZH225eUpNnrS9yDy9wTysyr9XVOe63+qd3M6e4X6Ptd1Dpc1SdV53ZqFag1hpP+bE5f4ivY74BzXilzWWW1+S0TjJng91Gd9wmbNgpMVz6W8d7GJZwWtWp8p++c8fpjW0Vzff3dJfzGuoersEtnmpjVLupY48H6o7n8/C+kvJn+Lcd6q3QHx3usvZax3W8apvP6rev+UJSHfiCYe/h2aTwTaRi5DO28ZSd9zNhTfJ8b2je7drOo9HtNNbPMW03zOpq2qNqnKFN+0huhlMye2Pe9TdzfCedfxMlRfG7xjncaJ7fiXMYZk3X+ZvuKbXCGh8y8XH8TybajPTfq4tjG2/qb0RJO3SB19ba2SMuoNbW8R/g653qa9sdsRYsssu+ZxPss+tnayFd94yjofEi+hZdvo73q9jd3yisUYbfEpQ9XmMqUIm2fFZh4xkZeE1BNDL5v+ZcqXh/90bSwjflz8U0QcFWHzPOpy0amM+stqf1ad7LltVPqWmG3p3+GiIvLJf8duYA3NcBwbWRpkDXmo7RP+z5E6+8Xswz512dbrW2aMNrpKaBt9y45VR2j9efhAQL/PF38Xadq907NYC5dpZLy3kMX6PUHgeGGS3nfoPn9rObJ9s/4uMntnSt/J5TX+2ZRhtFcB8ZgVmyZbit8GCd/7/C7EOcYK7LdyjNhIlL81nqN/Xf9mOHt/anovP4X0tyem/OUZF9TmscY2nzEulq96ZeVwv2Bxxnwk3s9njT8m/YWOKl199fe53tTXyu5DLojfKWXej6R3RAPtDf1ex/PvtdJ8Q7aP7Ht6XpdXSJf8/wMdQuS/j0/HtKny9KbT+oT2K2ETuW7Tt09Uss5nCdWhjPuMTXzrztO4FHMy+V6TJaH9I6+2C5HPq9oc8xlKRva5rF8M/7tC26/6BsNFivQ//e1pVsyP19VrNrH1D5Wi7oUDdVp8Q5HVr1ztlzXPtH2Gc30+lMX3edH3ecm3fp0+Ps/IPvWH6OpiV7meEMlbzyIkpi1jtDU0Pmm6nMd0jU8bXK7N0jWkb/joHyNebfWgtrJpc0h7QiQP24aKqcwYPnTRIUmG63fRQ5VXLsekgy5NtVXVadLfpjzV9S6xYnuNri159ZmsmLCpJ8/6XSRGOaH659H+GLYtwhd51xvq31B9Qm0UavM84qhoKaNOnfwf"));
            const aj = new (0, u)((0, (m(aG))));
            class aY extends (0, nB) {
                static planFeatures(e) {
                    e.addStage(aQ);
                    e.addStage([
                        "locl",
                        "ccmp"
                    ]);
                    e.addStage(a5);
                    e.addStage("nukt");
                    e.addStage("akhn");
                    e.addStage("rphf", false);
                    e.addStage("rkrf");
                    e.addStage("pref", false);
                    e.addStage("blwf", false);
                    e.addStage("abvf", false);
                    e.addStage("half", false);
                    e.addStage("pstf", false);
                    e.addStage("vatu");
                    e.addStage("cjct");
                    e.addStage("cfar", false);
                    e.addStage(a7);
                    e.addStage({
                        local: [
                            "init"
                        ],
                        global: [
                            "pres",
                            "abvs",
                            "blws",
                            "psts",
                            "haln",
                            "dist",
                            "abvm",
                            "blwm",
                            "calt",
                            "clig"
                        ]
                    });
                    e.unicodeScript = rj(e.script);
                    e.indicConfig = (0, aW)[e.unicodeScript] || (0, aW).Default;
                    e.isOldSpec = e.indicConfig.hasOldSpec && e.script[e.script.length - 1] !== "2";
                }
                static assignFeatures(e, t) {
                    for(let s = t.length - 1; s >= 0; s--){
                        let r = t[s].codePoints[0];
                        let n = (0, aX)[r] || aq[r];
                        if (n) {
                            let a = n.map((r)=>{
                                let n = e.font.glyphForCodePoint(r);
                                return new (0, n3)(e.font, n.id, [
                                    r
                                ], t[s].features);
                            });
                            t.splice(s, 1, ...a);
                        }
                    }
                }
            }
            (0, n.Z)(aY, "zeroMarkWidths", "NONE");
            function a$(e) {
                return aH.get(e.codePoints[0]) >> 8;
            }
            function aZ(e) {
                return 1 << (aH.get(e.codePoints[0]) & 0xff);
            }
            class aK {
                constructor(e, t, s, r){
                    this.category = e;
                    this.position = t;
                    this.syllableType = s;
                    this.syllable = r;
                }
            }
            function aQ(e, t) {
                let s = 0;
                let r = 0;
                for (let [n, a, l] of aj.match(t.map(a$))){
                    if (n > r) {
                        ++s;
                        for(let i = r; i < n; i++)t[i].shaperInfo = new aK((0, aB).X, (0, aV).End, "non_indic_cluster", s);
                    }
                    ++s;
                    for(let o = n; o <= a; o++)t[o].shaperInfo = new aK(1 << a$(t[o]), aZ(t[o]), l[0], s);
                    r = a + 1;
                }
                if (r < t.length) {
                    ++s;
                    for(let u = r; u < t.length; u++)t[u].shaperInfo = new aK((0, aB).X, (0, aV).End, "non_indic_cluster", s);
                }
            }
            function a0(e) {
                return e.shaperInfo.category & (0, az);
            }
            function a1(e) {
                return e.shaperInfo.category & (0, aR);
            }
            function a2(e) {
                return e.shaperInfo.category & (0, aN);
            }
            function a3(e, t) {
                for (let s of e)s.features = {
                    [t]: true
                };
                let r = e[0]._font._layoutEngine.engine.GSUBProcessor;
                r.applyFeatures([
                    t
                ], e);
                return e.length === 1;
            }
            function a4(e, t, s) {
                let r = [
                    s,
                    t,
                    s
                ];
                if (a3(r.slice(0, 2), "blwf") || a3(r.slice(1, 3), "blwf")) return (0, aV).Below_C;
                else if (a3(r.slice(0, 2), "pstf") || a3(r.slice(1, 3), "pstf")) return (0, aV).Post_C;
                else if (a3(r.slice(0, 2), "pref") || a3(r.slice(1, 3), "pref")) return (0, aV).Post_C;
                return (0, aV).Base_C;
            }
            function a5(e, t, s) {
                let r = s.indicConfig;
                let n = e._layoutEngine.engine.GSUBProcessor.features;
                let a = e.glyphForCodePoint(0x25cc).id;
                let l = e.glyphForCodePoint(r.virama).id;
                if (l) {
                    let i = new (0, n3)(e, l, [
                        r.virama
                    ]);
                    for(let o = 0; o < t.length; o++)if (t[o].shaperInfo.position === (0, aV).Base_C) t[o].shaperInfo.position = a4(e, t[o].copy(), i);
                }
                for(let u = 0, c = a6(t, 0); u < t.length; u = c, c = a6(t, u)){
                    let { category: f , syllableType: h  } = t[u].shaperInfo;
                    if (h === "symbol_cluster" || h === "non_indic_cluster") continue;
                    if (h === "broken_cluster" && a) {
                        let d = new (0, n3)(e, a, [
                            0x25cc
                        ]);
                        d.shaperInfo = new aK(1 << a$(d), aZ(d), t[u].shaperInfo.syllableType, t[u].shaperInfo.syllable);
                        let m = u;
                        while(m < c && t[m].shaperInfo.category === (0, aB).Repha)m++;
                        t.splice(m++, 0, d);
                        c++;
                    }
                    let p = c;
                    let g = u;
                    let b = false;
                    if (r.rephPos !== (0, aV).Ra_To_Become_Reph && n.rphf && u + 3 <= c && (r.rephMode === "Implicit" && !a1(t[u + 2]) || r.rephMode === "Explicit" && t[u + 2].shaperInfo.category === (0, aB).ZWJ)) {
                        let y = [
                            t[u].copy(),
                            t[u + 1].copy(),
                            t[u + 2].copy()
                        ];
                        if (a3(y.slice(0, 2), "rphf") || r.rephMode === "Explicit" && a3(y, "rphf")) {
                            g += 2;
                            while(g < c && a1(t[g]))g++;
                            p = u;
                            b = true;
                        }
                    } else if (r.rephMode === "Log_Repha" && t[u].shaperInfo.category === (0, aB).Repha) {
                        g++;
                        while(g < c && a1(t[g]))g++;
                        p = u;
                        b = true;
                    }
                    switch(r.basePos){
                        case "Last":
                            {
                                let w = c;
                                let x = false;
                                do {
                                    let v = t[--w].shaperInfo;
                                    if (a0(t[w])) {
                                        if (v.position !== (0, aV).Below_C && (v.position !== (0, aV).Post_C || x)) {
                                            p = w;
                                            break;
                                        }
                                        if (v.position === (0, aV).Below_C) x = true;
                                        p = w;
                                    } else if (u < w && v.category === (0, aB).ZWJ && t[w - 1].shaperInfo.category === (0, aB).H) break;
                                }while (w > g)
                                break;
                            }
                        case "First":
                            p = u;
                            for(let _ = p + 1; _ < c; _++)if (a0(t[_])) t[_].shaperInfo.position = (0, aV).Below_C;
                    }
                    if (b && p === u && g - p <= 2) b = false;
                    for(let L = u; L < p; L++){
                        let C = t[L].shaperInfo;
                        C.position = Math.min((0, aV).Pre_C, C.position);
                    }
                    if (p < c) t[p].shaperInfo.position = (0, aV).Base_C;
                    for(let A = p + 1; A < c; A++)if (t[A].shaperInfo.category === (0, aB).M) {
                        for(let k = A + 1; k < c; k++)if (a0(t[k])) {
                            t[k].shaperInfo.position = (0, aV).Final_C;
                            break;
                        }
                        break;
                    }
                    if (b) t[u].shaperInfo.position = (0, aV).Ra_To_Become_Reph;
                    if (s.isOldSpec) {
                        let S = s.unicodeScript !== "Malayalam";
                        for(let I = p + 1; I < c; I++)if (t[I].shaperInfo.category === (0, aB).H) {
                            let P;
                            for(P = c - 1; P > I; P--){
                                if (a0(t[P]) || S && t[P].shaperInfo.category === (0, aB).H) break;
                            }
                            if (t[P].shaperInfo.category !== (0, aB).H && P > I) {
                                let U = t[I];
                                t.splice(I, 0, ...t.splice(I + 1, P - I));
                                t[P] = U;
                            }
                            break;
                        }
                    }
                    let J = (0, aV).Start;
                    for(let T = u; T < c; T++){
                        let O = t[T].shaperInfo;
                        if (O.category & ((0, aR) | (0, aB).N | (0, aB).RS | (0, aB).CM | (0, aN) & O.category)) {
                            O.position = J;
                            if (O.category === (0, aB).H && O.position === (0, aV).Pre_M) {
                                for(let F = T; F > u; F--)if (t[F - 1].shaperInfo.position !== (0, aV).Pre_M) {
                                    O.position = t[F - 1].shaperInfo.position;
                                    break;
                                }
                            }
                        } else if (O.position !== (0, aV).SMVD) J = O.position;
                    }
                    let D = p;
                    for(let M = p + 1; M < c; M++){
                        if (a0(t[M])) {
                            for(let G = D + 1; G < M; G++)if (t[G].shaperInfo.position < (0, aV).SMVD) t[G].shaperInfo.position = t[M].shaperInfo.position;
                            D = M;
                        } else if (t[M].shaperInfo.category === (0, aB).M) D = M;
                    }
                    let E = t.slice(u, c);
                    E.sort((e, t)=>e.shaperInfo.position - t.shaperInfo.position);
                    t.splice(u, E.length, ...E);
                    for(let B = u; B < c; B++)if (t[B].shaperInfo.position === (0, aV).Base_C) {
                        p = B;
                        break;
                    }
                    for(let V = u; V < c && t[V].shaperInfo.position === (0, aV).Ra_To_Become_Reph; V++)t[V].features.rphf = true;
                    let z = !s.isOldSpec && r.blwfMode === "Pre_And_Post";
                    for(let R = u; R < p; R++){
                        t[R].features.half = true;
                        if (z) t[R].features.blwf = true;
                    }
                    for(let N = p + 1; N < c; N++){
                        t[N].features.abvf = true;
                        t[N].features.pstf = true;
                        t[N].features.blwf = true;
                    }
                    if (s.isOldSpec && s.unicodeScript === "Devanagari") {
                        for(let W = u; W + 1 < p; W++)if (t[W].shaperInfo.category === (0, aB).Ra && t[W + 1].shaperInfo.category === (0, aB).H && (W + 1 === p || t[W + 2].shaperInfo.category === (0, aB).ZWJ)) {
                            t[W].features.blwf = true;
                            t[W + 1].features.blwf = true;
                        }
                    }
                    let X = 2;
                    if (n.pref && p + X < c) for(let q = p + 1; q + X - 1 < c; q++){
                        let H = [
                            t[q].copy(),
                            t[q + 1].copy()
                        ];
                        if (a3(H, "pref")) {
                            for(let j = 0; j < X; j++)t[q++].features.pref = true;
                            if (n.cfar) for(; q < c; q++)t[q].features.cfar = true;
                            break;
                        }
                    }
                    for(let Y = u + 1; Y < c; Y++)if (a1(t[Y])) {
                        let $ = t[Y].shaperInfo.category === (0, aB).ZWNJ;
                        let Z = Y;
                        do {
                            Z--;
                            if ($) delete t[Z].features.half;
                        }while (Z > u && !a0(t[Z]))
                    }
                }
            }
            function a7(e, t, s) {
                let r = s.indicConfig;
                let n = e._layoutEngine.engine.GSUBProcessor.features;
                for(let a = 0, l = a6(t, 0); a < t.length; a = l, l = a6(t, a)){
                    let o = !!n.pref;
                    let u = a;
                    for(; u < l; u++)if (t[u].shaperInfo.position >= (0, aV).Base_C) {
                        if (o && u + 1 < l) {
                            for(let c = u + 1; c < l; c++)if (t[c].features.pref) {
                                if (!(t[c].substituted && t[c].isLigated && !t[c].isMultiplied)) {
                                    u = c;
                                    while(u < l && a2(t[u]))u++;
                                    t[u].shaperInfo.position = (0, aV).BASE_C;
                                    o = false;
                                }
                                break;
                            }
                        }
                        if (s.unicodeScript === "Malayalam") for(let f = u + 1; f < l; f++){
                            while(f < l && a1(t[f]))f++;
                            if (f === l || !a2(t[f])) break;
                            f++;
                            while(f < l && a1(t[f]))f++;
                            if (f < l && a0(t[f]) && t[f].shaperInfo.position === (0, aV).Below_C) {
                                u = f;
                                t[u].shaperInfo.position = (0, aV).Base_C;
                            }
                        }
                        if (a < u && t[u].shaperInfo.position > (0, aV).Base_C) u--;
                        break;
                    }
                    if (u === l && a < u && t[u - 1].shaperInfo.category === (0, aB).ZWJ) u--;
                    if (u < l) while(a < u && t[u].shaperInfo.category & ((0, aB).N | (0, aN)))u--;
                    if (a + 1 < l && a < u) {
                        let h = u === l ? u - 2 : u - 1;
                        if (s.unicodeScript !== "Malayalam" && s.unicodeScript !== "Tamil") {
                            while(h > a && !(t[h].shaperInfo.category & ((0, aB).M | (0, aN))))h--;
                            if (a2(t[h]) && t[h].shaperInfo.position !== (0, aV).Pre_M) {
                                if (h + 1 < l && a1(t[h + 1])) h++;
                            } else h = a;
                        }
                        if (a < h && t[h].shaperInfo.position !== (0, aV).Pre_M) {
                            for(let d = h; d > a; d--)if (t[d - 1].shaperInfo.position === (0, aV).Pre_M) {
                                let m = d - 1;
                                if (m < u && u <= h) u--;
                                let p = t[m];
                                t.splice(m, 0, ...t.splice(m + 1, h - m));
                                t[h] = p;
                                h--;
                            }
                        }
                    }
                    if (a + 1 < l && t[a].shaperInfo.position === (0, aV).Ra_To_Become_Reph && t[a].shaperInfo.category === (0, aB).Repha !== (t[a].isLigated && !t[a].isMultiplied)) {
                        let g;
                        let b = r.rephPos;
                        let y = false;
                        if (b !== (0, aV).After_Post) {
                            g = a + 1;
                            while(g < u && !a2(t[g]))g++;
                            if (g < u && a2(t[g])) {
                                if (g + 1 < u && a1(t[g + 1])) g++;
                                y = true;
                            }
                            if (!y && b === (0, aV).After_Main) {
                                g = u;
                                while(g + 1 < l && t[g + 1].shaperInfo.position <= (0, aV).After_Main)g++;
                                y = g < l;
                            }
                            if (!y && b === (0, aV).After_Sub) {
                                g = u;
                                while(g + 1 < l && !(t[g + 1].shaperInfo.position & ((0, aV).Post_C | (0, aV).After_Post | (0, aV).SMVD)))g++;
                                y = g < l;
                            }
                        }
                        if (!y) {
                            g = a + 1;
                            while(g < u && !a2(t[g]))g++;
                            if (g < u && a2(t[g])) {
                                if (g + 1 < u && a1(t[g + 1])) g++;
                                y = true;
                            }
                        }
                        if (!y) {
                            g = l - 1;
                            while(g > a && t[g].shaperInfo.position === (0, aV).SMVD)g--;
                            if (a2(t[g])) {
                                for(let w = u + 1; w < g; w++)if (t[w].shaperInfo.category === (0, aB).M) g--;
                            }
                        }
                        let x = t[a];
                        t.splice(a, 0, ...t.splice(a + 1, g - a));
                        t[g] = x;
                        if (a < u && u <= g) u--;
                    }
                    if (o && u + 1 < l) {
                        for(let v = u + 1; v < l; v++)if (t[v].features.pref) {
                            if (t[v].isLigated && !t[v].isMultiplied) {
                                let _ = u;
                                if (s.unicodeScript !== "Malayalam" && s.unicodeScript !== "Tamil") {
                                    while(_ > a && !(t[_ - 1].shaperInfo.category & ((0, aB).M | (0, aN))))_--;
                                    if (_ > a && t[_ - 1].shaperInfo.category === (0, aB).M) {
                                        let L = v;
                                        for(let C = u + 1; C < L; C++)if (t[C].shaperInfo.category === (0, aB).M) {
                                            _--;
                                            break;
                                        }
                                    }
                                }
                                if (_ > a && a2(t[_ - 1])) {
                                    if (_ < l && a1(t[_])) _++;
                                }
                                let A = v;
                                let k = t[A];
                                t.splice(_ + 1, 0, ...t.splice(_, A - _));
                                t[_] = k;
                                if (_ <= u && u < A) u++;
                            }
                            break;
                        }
                    }
                    if (t[a].shaperInfo.position === (0, aV).Pre_M && (!a || !/Cf|Mn/.test((0, i.n3)(t[a - 1].codePoints[0])))) t[a].features.init = true;
                }
            }
            function a6(e, t) {
                if (t >= e.length) return t;
                let s = e[t].shaperInfo.syllable;
                while(++t < e.length && e[t].shaperInfo.syllable === s);
                return t;
            }
            const { categories: a9 , decompositions: a8  } = (0, (m(aE)));
            const le = new (0, o)((0, rG)("AAACAAAAAADQqQAAAVEMrvPtnH+oHUcVx+fd99799W5e8mx+9NkYm7YUI2KtimkVDG3FWgVTFY1Fqa2VJirYB0IaUFLBaKGJViXir6oxKCSBoi0UTKtg2yA26h+milYNtMH+0WK1VQyvtBS/487hnncyMzuzu7N7n7kHPszu7OzMmTNzdmdmfzzfUmpiUqkemAMbwSZwKbjcxM1XEL4VvB28G3zAk+56cLMlfgdYADvBbvBF8GWwH9xl+CFLfwj8BPwU/MKS38/AMfA86v9ro9ucQcdR+CjCP4CT4EnwDPg3eAFMTik1A+bAPNgINoFLwGawZSpLfzXCrWAb+AjYDm4BO8FusAfsA/vBXeAgOALuNfv3g4fAcXACPAaeAE+B58Bp8NJUpnN7WqlZsHY629+A8GLwWvAG8BZwJXinOf5ehB8EN4AdYGE6q7dmF9uugs8hvz0V58nZK/L+Kva/BX4ADoN7prP6HgUPgkfA73L0eQzHnwBPgX+Y80+DF8FUW6lBO4tbjXA9uAi8pj3sS2/E9mawBVwNtoJt5pzrTXgzwk+B7awP7sT+7nY6WxFfQBlfAl8H3wU/Anezcu/D9s/BMRN3HOEJ8EdwMkC/J5HmmXZmq2fBIjgEVEepbieLX4Fw0MnSrzRxmrVsm7MB8ReDV4vjr3ekJy7rZGVPMb196Xm6oug83oRyt4CrwDVgK9gGPtzxn3uTOD6YPDPNJ5Hm0+AznazffJ7Z4KSnXncg3VfAN8EBhx42/z/UGdbrx52sr9yH8AFTrt5+2GzfnWPbKuw7ZszZyNh/xowZM2bMmDFjxsQyZ5lPNs3h9nBNYHuAfr9ic9ffiHnsJzznU91/j3P+2snWYf6G8O/gn+A0eMnEt7vQp5ulX4NwHmwEm7rZ8UsRXg6uMPvXIHwPuK7rLl+nu9FzfMyYMWPGpGVuslmarv+YMWPSkNq/d2D8uNDNngvdivA2y3jy9m72bF9v3ymOf2MExp8fG2TsAcfA2wJYBJetWBq3i+0fwPafwLmzSl0LFmZNPMLHZ4fpnsX2AdjgcXB+T6kPge+AG7D/vXYW/tLsc9r9M+MkVyLNR1m6g9g+ZfYvmMExcHCm+ftP0+T5y/e17Uw/PYLwHnC0m80TH+zG30/3mjSDnPS2/B4pUJ4rX3n+b5H3o92l6UjfvZ7y/oJzToGnu8O66XTPYf8/Jr8XWL6TPXf9bPnHtmVs+89AnxVgDVgPLgKvAg+Y/F6H7c1gC7jKHH8XeJ/x15vAjt4wvwVs7wKfBXvAPvA18G1wsJevj36f5gjS3etIq+ft9+PYQ73h/nFsn2D7f+5l75bo/VPYftpTblFb2/Jo2pdjfL0uXOX/qxfnp8vZVk2Xv9hbmu+LxvYt3A/7/WZsPoptPkr9bdCv1ya+d4TuMO8Tre5n4XkILwSbzP4l/WHazX1//r2O/z7cFHnvSYW8R/Vm02ZXIHxHze1Xdf9bbn7p0z2kDroNr2X9WL+7937sX9fP+v9h9n6jTrfI3jG9EfsfN3G35PR/G4uRfY3eMTwdkFa/C3hrf2kcfy/xYTOmprrfZsLbEe7rDPW/U9Rrv9k/ahmTL0cWWxP/YxRkgtES+zwNhZPs+FQgMj/liEsto2HxsZBQX2pZoLZqWc5riXDaQBLSt1L3hcnE+Vct7aYVKCEhbXk2+b7NZ84mmXAwCiL14Ne85S62MYPcXi5StM/YxlJF2lfabznZsC6/C807xvZV+yFve9d1KY//d3HNO8pKUXuTDh0Gpp7B852q6QFMgdWM2dfbAxOuEPQEfcEsO5fquJLZrMfyCtWP0heZF6oSdiH9u4aQvJRIJ/eL6BBynItLp5D2JRkY5L5u3xAf6lviXHWSZcfaKO/+5zvO/c9Xtq8uRXSObd+8bS0zJrS1rxTyX7k/a0nrk5D+mHeOC90uq1Q216X57lykfqHt62uTGJ2rat+i/kttyq/RSi29PlclZf2Xxq55ZeSV34T96d5X5PqZJ9I3ZX2lnkXt3xL1Kyrav/LutbZ6uGxuS6ss6V3pXOXY4kP7EBfyJT7+4TJQS9uf74f6n+3+6ZIi9bCtieatFfCxUMx4KMYfy/pzrB30vm88q9SZ11K+n9eeNN612UFKWX8uI9TmRca7TbWvKy2JvF6naF+b/0uRupZp35cZikhZvyniY2R/CbdB3vXynIC6hbRBHf4l1xps6w4x/lVEtxRtGZMuRA8uNh/jfYV8kdpsBUszcODrD7E2JT2KrB3V6XMhbdNjcXItxzaOJWkpf976/I5glQn1sbLP86U9FQvz4l0S28/lcWUJbbrE2l+Z/TlHvi4/kvZXLMyrmy1PW7x8hl6UFgvlmNM1Jq3aJ3Se0yJcpdwS6mOp/ZgLX5N1rdFKaIzH9ztquMbqq+/qCFRk+hRoyZvrTHuO8fNd/djmEzZJ3TdisN1bNQNl7y96DV/3mVkTtwasVdk1ai6ybGlDek8nT1fXc4M5tVSPvhqOsWQeXQs8L1n3IradU8OxCeVjK7dr7Dpl0cMHnUvt18TzfVsfb/pZY56fV2GnVPVIYaOi9xcZJ8cmKcu3wcuPsVHV5cdKFfZXNZefp5sWft+wzR1cczKCxh99NRx76HvwOpWNv6YZtAajt6WPyPswtVVs/VOJ7xpYx3VR31er7gMxNuV9Q443CDlW43KuYSXblsybfKYt58trfez7A1X7Tdm+V7TcoudL+LpVGf2khN63U5OyD5Af0NoUv06l7Jc0Rte+so4xL9Ayy3Rz+SufY5Jf267xcm7J4dd3kumIOrmk7Pl549bUY1puI91Gdb8Tpu+9tjmhXFdwtfVsTv5SQvXKW0cK4eXgPBO6iJ07NNVOHH7/tF1jyJdnWbrU/Uau3VNI156QZ2ZaZFu76i6vQXy9YJ2H9QZ97aF3p1xlx1yfuYRcd0Kl7NyaX190+pUOKI0tvus5j7/nSWKLo3FER8R3LHEx8gqwge1POgi1l1yfirV3zHpISHxs3vLeFXOellcG1DFGbGP00PPkeKEOaXIsqhzbruOh9Qk5L08nW2grJ0avsvWocv0zRh/fGCG0TV35hB4v0rds5Vddjm/sFCKx+aXSt2yalPZsolxXW46CDnXp0YQ0rdso9OUYPSYT6+yzuxxzlrVfFfavQ/LKqsP+dbVzE/0qRb8pKin6V9U6Fnn24pqHufLMWy90nV+0DkXmcrb0Uq+6pU7/qcs/67SHTeTaaBk9ipyXQvLqW1U7uPKpux/ESlP9umydR8H3UjzHoXxj0/J1Yr5ubHsPrWOJqxK+hk5r+EVtH3pe1XWIXa+1vQ9YJ/oZre1bGReh3xKWeX7BxfYstwh5errGJi59be8482cSsfUPQT4Xlc9K+XMmatcY0fo2+SxYQs/4XO8M03Ng/TxujYH+FRELSdH+6mtveu8itb1Cy7C9X8GfsVOcfN86RHg56wJ0ob5qOz/E/rIdq7YhF34/0cfoeWKVftJjIbWDbDfXeXR/prBOKWJ/3dd43+sr+32TvgEIEZ6/7Zt5/l7ghMm77u+ey4gcz5xfktA5vE9C5vy2Y3lpXeX40tHcLMX42qZHS/ltZluXiSlDxillt3VdIvufbc0j75wy5aWaOxWRUZmfl5nDSh3LzoWbXJOg8uumKkndp1PnH2IPfe+U33z7vjWhdPQuWMh4raqxWMh9X89RZtSZ7/JpyXs3NWQcETN3CZHU/lmVnstZB1+ZfM5A/1VJ2V9t8wTXN1S+f27mzaulbCxJHePwC1Tz/0K1/VdPvtOsba+vL7ZxM1/jakJ/V9/yfdtNx+i7bhVRRll/rrK+sk3qLt/3T0afH+tzz1HDfxzZ/HlGDduK1y/GL21zvKptQGWFSpVlFm0z+ZxD/vdAt9EqQ971NkRHW7qytog53+cfVfeFGLStfddfYka5x6dl+yi//4z6/559aUn4/+/k2pv8BqfM/0qVCnu+If2OJPRZUcyzJF/5RQm5xtM9ln+LRN+8U9+iMQS1Veg9q2z/TlV3Ett3/rLOIXOookidy/5X3GYD+S8a1z2e0vH695T9vhEqdbY//0dU3jWZ2rYq/cvCRT8r08/NLlT5/zySdSurv1ybLiup5tAp5+NNzfPJ5r61warapajItfTQNeK610/rWEMPyb+uOo/ierRNbGU01Z+rqneIPWNsT9t1rD+OYr8rm0eKvp/Ch1P4Yepyy+hWVD/f+VWXX5X+TZdfZZ+KLb9J+S8="));
            const lt = new (0, u)((0, (m(aE))));
            class ls extends (0, nB) {
                static planFeatures(e) {
                    e.addStage(la);
                    e.addStage([
                        "locl",
                        "ccmp",
                        "nukt",
                        "akhn"
                    ]);
                    e.addStage(ll);
                    e.addStage([
                        "rphf"
                    ], false);
                    e.addStage(li);
                    e.addStage(ll);
                    e.addStage([
                        "pref"
                    ]);
                    e.addStage(lo);
                    e.addStage([
                        "rkrf",
                        "abvf",
                        "blwf",
                        "half",
                        "pstf",
                        "vatu",
                        "cjct"
                    ]);
                    e.addStage(lu);
                    e.addStage([
                        "abvs",
                        "blws",
                        "pres",
                        "psts",
                        "dist",
                        "abvm",
                        "blwm"
                    ]);
                }
                static assignFeatures(e, t) {
                    for(let s = t.length - 1; s >= 0; s--){
                        let r = t[s].codePoints[0];
                        if (a8[r]) {
                            let n = a8[r].map((r)=>{
                                let n = e.font.glyphForCodePoint(r);
                                return new (0, n3)(e.font, n.id, [
                                    r
                                ], t[s].features);
                            });
                            t.splice(s, 1, ...n);
                        }
                    }
                }
            }
            (0, n.Z)(ls, "zeroMarkWidths", "BEFORE_GPOS");
            function lr(e) {
                return le.get(e.codePoints[0]);
            }
            class ln {
                constructor(e, t, s){
                    this.category = e;
                    this.syllableType = t;
                    this.syllable = s;
                }
            }
            function la(e, t) {
                let s = 0;
                for (let [r, n, a] of lt.match(t.map(lr))){
                    ++s;
                    for(let l = r; l <= n; l++)t[l].shaperInfo = new ln(a9[lr(t[l])], a[0], s);
                    let i = t[r].shaperInfo.category === "R" ? 1 : Math.min(3, n - r);
                    for(let o = r; o < r + i; o++)t[o].features.rphf = true;
                }
            }
            function ll(e, t) {
                for (let s of t)s.substituted = false;
            }
            function li(e, t) {
                for (let s of t)if (s.substituted && s.features.rphf) s.shaperInfo.category = "R";
            }
            function lo(e, t) {
                for (let s of t)if (s.substituted) s.shaperInfo.category = "VPre";
            }
            function lu(e, t) {
                let s = e.glyphForCodePoint(0x25cc).id;
                for(let r = 0, n = lc(t, 0); r < t.length; r = n, n = lc(t, r)){
                    let a, l;
                    let i = t[r].shaperInfo;
                    let o = i.syllableType;
                    if (o !== "virama_terminated_cluster" && o !== "standard_cluster" && o !== "broken_cluster") continue;
                    if (o === "broken_cluster" && s) {
                        let u = new (0, n3)(e, s, [
                            0x25cc
                        ]);
                        u.shaperInfo = i;
                        for(a = r; a < n && t[a].shaperInfo.category === "R"; a++);
                        t.splice(++a, 0, u);
                        n++;
                    }
                    if (i.category === "R" && n - r > 1) for(a = r + 1; a < n; a++){
                        i = t[a].shaperInfo;
                        if (lh(i) || lf(t[a])) {
                            if (lf(t[a])) a--;
                            t.splice(r, 0, ...t.splice(r + 1, a - r), t[a]);
                            break;
                        }
                    }
                    for(a = r, l = n; a < n; a++){
                        i = t[a].shaperInfo;
                        if (lh(i) || lf(t[a])) l = lf(t[a]) ? a + 1 : a;
                        else if ((i.category === "VPre" || i.category === "VMPre") && l < a) t.splice(l, 1, t[a], ...t.splice(l, a - l));
                    }
                }
            }
            function lc(e, t) {
                if (t >= e.length) return t;
                let s = e[t].shaperInfo.syllable;
                while(++t < e.length && e[t].shaperInfo.syllable === s);
                return t;
            }
            function lf(e) {
                return e.shaperInfo.category === "H" && !e.isLigated;
            }
            function lh(e) {
                return e.category === "B" || e.category === "GB";
            }
            const ld = {
                arab: (0, nK),
                mong: (0, nK),
                syrc: (0, nK),
                "nko ": (0, nK),
                phag: (0, nK),
                mand: (0, nK),
                mani: (0, nK),
                phlp: (0, nK),
                hang: (0, n4),
                bng2: (0, aY),
                beng: (0, aY),
                dev2: (0, aY),
                deva: (0, aY),
                gjr2: (0, aY),
                gujr: (0, aY),
                guru: (0, aY),
                gur2: (0, aY),
                knda: (0, aY),
                knd2: (0, aY),
                mlm2: (0, aY),
                mlym: (0, aY),
                ory2: (0, aY),
                orya: (0, aY),
                taml: (0, aY),
                tml2: (0, aY),
                telu: (0, aY),
                tel2: (0, aY),
                khmr: (0, aY),
                bali: (0, ls),
                batk: (0, ls),
                brah: (0, ls),
                bugi: (0, ls),
                buhd: (0, ls),
                cakm: (0, ls),
                cham: (0, ls),
                dupl: (0, ls),
                egyp: (0, ls),
                gran: (0, ls),
                hano: (0, ls),
                java: (0, ls),
                kthi: (0, ls),
                kali: (0, ls),
                khar: (0, ls),
                khoj: (0, ls),
                sind: (0, ls),
                lepc: (0, ls),
                limb: (0, ls),
                mahj: (0, ls),
                mtei: (0, ls),
                modi: (0, ls),
                hmng: (0, ls),
                rjng: (0, ls),
                saur: (0, ls),
                shrd: (0, ls),
                sidd: (0, ls),
                sinh: (0, aY),
                sund: (0, ls),
                sylo: (0, ls),
                tglg: (0, ls),
                tagb: (0, ls),
                tale: (0, ls),
                lana: (0, ls),
                tavt: (0, ls),
                takr: (0, ls),
                tibt: (0, ls),
                tfng: (0, ls),
                tirh: (0, ls),
                latn: (0, nB),
                DFLT: (0, nB)
            };
            function lm(e) {
                if (!Array.isArray(e)) e = [
                    e
                ];
                for (let t of e){
                    let s = ld[t];
                    if (s) return s;
                }
                return 0, nB;
            }
            class lp extends (0, n2) {
                applyLookup(e, t) {
                    switch(e){
                        case 1:
                            {
                                let s = this.coverageIndex(t.coverage);
                                if (s === -1) return false;
                                let r = this.glyphIterator.cur;
                                switch(t.version){
                                    case 1:
                                        r.id = r.id + t.deltaGlyphID & 0xffff;
                                        break;
                                    case 2:
                                        r.id = t.substitute.get(s);
                                        break;
                                }
                                return true;
                            }
                        case 2:
                            {
                                let n = this.coverageIndex(t.coverage);
                                if (n !== -1) {
                                    let a = t.sequences.get(n);
                                    if (a.length === 0) {
                                        this.glyphs.splice(this.glyphIterator.index, 1);
                                        return true;
                                    }
                                    this.glyphIterator.cur.id = a[0];
                                    this.glyphIterator.cur.ligatureComponent = 0;
                                    let l = this.glyphIterator.cur.features;
                                    let i = this.glyphIterator.cur;
                                    let o = a.slice(1).map((e, t)=>{
                                        let s = new (0, n3)(this.font, e, undefined, l);
                                        s.shaperInfo = i.shaperInfo;
                                        s.isLigated = i.isLigated;
                                        s.ligatureComponent = t + 1;
                                        s.substituted = true;
                                        s.isMultiplied = true;
                                        return s;
                                    });
                                    this.glyphs.splice(this.glyphIterator.index + 1, 0, ...o);
                                    return true;
                                }
                                return false;
                            }
                        case 3:
                            {
                                let u = this.coverageIndex(t.coverage);
                                if (u !== -1) {
                                    let c = 0;
                                    this.glyphIterator.cur.id = t.alternateSet.get(u)[c];
                                    return true;
                                }
                                return false;
                            }
                        case 4:
                            {
                                let f = this.coverageIndex(t.coverage);
                                if (f === -1) return false;
                                for (let h of t.ligatureSets.get(f)){
                                    let d = this.sequenceMatchIndices(1, h.components);
                                    if (!d) continue;
                                    let m = this.glyphIterator.cur;
                                    let p = m.codePoints.slice();
                                    for (let g of d)p.push(...this.glyphs[g].codePoints);
                                    let b = new (0, n3)(this.font, h.glyph, p, m.features);
                                    b.shaperInfo = m.shaperInfo;
                                    b.isLigated = true;
                                    b.substituted = true;
                                    let y = m.isMark;
                                    for(let w = 0; w < d.length && y; w++)y = this.glyphs[d[w]].isMark;
                                    b.ligatureID = y ? null : this.ligatureID++;
                                    let x = m.ligatureID;
                                    let v = m.codePoints.length;
                                    let _ = v;
                                    let L = this.glyphIterator.index + 1;
                                    for (let C of d){
                                        if (y) L = C;
                                        else while(L < C){
                                            var A = _ - v + Math.min(this.glyphs[L].ligatureComponent || 1, v);
                                            this.glyphs[L].ligatureID = b.ligatureID;
                                            this.glyphs[L].ligatureComponent = A;
                                            L++;
                                        }
                                        x = this.glyphs[L].ligatureID;
                                        v = this.glyphs[L].codePoints.length;
                                        _ += v;
                                        L++;
                                    }
                                    if (x && !y) for(let k = L; k < this.glyphs.length; k++){
                                        if (this.glyphs[k].ligatureID === x) {
                                            var A = _ - v + Math.min(this.glyphs[k].ligatureComponent || 1, v);
                                            this.glyphs[k].ligatureComponent = A;
                                        } else break;
                                    }
                                    for(let S = d.length - 1; S >= 0; S--)this.glyphs.splice(d[S], 1);
                                    this.glyphs[this.glyphIterator.index] = b;
                                    return true;
                                }
                                return false;
                            }
                        case 5:
                            return this.applyContext(t);
                        case 6:
                            return this.applyChainingContext(t);
                        case 7:
                            return this.applyLookup(t.lookupType, t.extension);
                        default:
                            throw new Error(`GSUB lookupType ${e} is not supported`);
                    }
                }
            }
            class lg extends (0, n2) {
                applyPositionValue(e, t) {
                    let s = this.positions[this.glyphIterator.peekIndex(e)];
                    if (t.xAdvance != null) s.xAdvance += t.xAdvance;
                    if (t.yAdvance != null) s.yAdvance += t.yAdvance;
                    if (t.xPlacement != null) s.xOffset += t.xPlacement;
                    if (t.yPlacement != null) s.yOffset += t.yPlacement;
                    let r = this.font._variationProcessor;
                    let n = this.font.GDEF && this.font.GDEF.itemVariationStore;
                    if (r && n) {
                        if (t.xPlaDevice) s.xOffset += r.getDelta(n, t.xPlaDevice.a, t.xPlaDevice.b);
                        if (t.yPlaDevice) s.yOffset += r.getDelta(n, t.yPlaDevice.a, t.yPlaDevice.b);
                        if (t.xAdvDevice) s.xAdvance += r.getDelta(n, t.xAdvDevice.a, t.xAdvDevice.b);
                        if (t.yAdvDevice) s.yAdvance += r.getDelta(n, t.yAdvDevice.a, t.yAdvDevice.b);
                    }
                }
                applyLookup(e, t) {
                    switch(e){
                        case 1:
                            {
                                let s = this.coverageIndex(t.coverage);
                                if (s === -1) return false;
                                switch(t.version){
                                    case 1:
                                        this.applyPositionValue(0, t.value);
                                        break;
                                    case 2:
                                        this.applyPositionValue(0, t.values.get(s));
                                        break;
                                }
                                return true;
                            }
                        case 2:
                            {
                                let r = this.glyphIterator.peek();
                                if (!r) return false;
                                let n = this.coverageIndex(t.coverage);
                                if (n === -1) return false;
                                switch(t.version){
                                    case 1:
                                        let a = t.pairSets.get(n);
                                        for (let l of a)if (l.secondGlyph === r.id) {
                                            this.applyPositionValue(0, l.value1);
                                            this.applyPositionValue(1, l.value2);
                                            return true;
                                        }
                                        return false;
                                    case 2:
                                        let i = this.getClassID(this.glyphIterator.cur.id, t.classDef1);
                                        let o = this.getClassID(r.id, t.classDef2);
                                        if (i === -1 || o === -1) return false;
                                        var u = t.classRecords.get(i).get(o);
                                        this.applyPositionValue(0, u.value1);
                                        this.applyPositionValue(1, u.value2);
                                        return true;
                                }
                            }
                        case 3:
                            {
                                let c = this.glyphIterator.peekIndex();
                                let f = this.glyphs[c];
                                if (!f) return false;
                                let h = t.entryExitRecords[this.coverageIndex(t.coverage)];
                                if (!h || !h.exitAnchor) return false;
                                let d = t.entryExitRecords[this.coverageIndex(t.coverage, f.id)];
                                if (!d || !d.entryAnchor) return false;
                                let m = this.getAnchor(d.entryAnchor);
                                let p = this.getAnchor(h.exitAnchor);
                                let g = this.positions[this.glyphIterator.index];
                                let b = this.positions[c];
                                let y;
                                switch(this.direction){
                                    case "ltr":
                                        g.xAdvance = p.x + g.xOffset;
                                        y = m.x + b.xOffset;
                                        b.xAdvance -= y;
                                        b.xOffset -= y;
                                        break;
                                    case "rtl":
                                        y = p.x + g.xOffset;
                                        g.xAdvance -= y;
                                        g.xOffset -= y;
                                        b.xAdvance = m.x + b.xOffset;
                                        break;
                                }
                                if (this.glyphIterator.flags.rightToLeft) {
                                    this.glyphIterator.cur.cursiveAttachment = c;
                                    g.yOffset = m.y - p.y;
                                } else {
                                    f.cursiveAttachment = this.glyphIterator.index;
                                    g.yOffset = p.y - m.y;
                                }
                                return true;
                            }
                        case 4:
                            {
                                let w = this.coverageIndex(t.markCoverage);
                                if (w === -1) return false;
                                let x = this.glyphIterator.index;
                                while(--x >= 0 && (this.glyphs[x].isMark || this.glyphs[x].ligatureComponent > 0));
                                if (x < 0) return false;
                                let v = this.coverageIndex(t.baseCoverage, this.glyphs[x].id);
                                if (v === -1) return false;
                                let _ = t.markArray[w];
                                let L = t.baseArray[v][_.class];
                                this.applyAnchor(_, L, x);
                                return true;
                            }
                        case 5:
                            {
                                let C = this.coverageIndex(t.markCoverage);
                                if (C === -1) return false;
                                let A = this.glyphIterator.index;
                                while(--A >= 0 && this.glyphs[A].isMark);
                                if (A < 0) return false;
                                let k = this.coverageIndex(t.ligatureCoverage, this.glyphs[A].id);
                                if (k === -1) return false;
                                let S = t.ligatureArray[k];
                                let I = this.glyphIterator.cur;
                                let P = this.glyphs[A];
                                let U = P.ligatureID && P.ligatureID === I.ligatureID && I.ligatureComponent > 0 ? Math.min(I.ligatureComponent, P.codePoints.length) - 1 : P.codePoints.length - 1;
                                let J = t.markArray[C];
                                let T = S[U][J.class];
                                this.applyAnchor(J, T, A);
                                return true;
                            }
                        case 6:
                            {
                                let O = this.coverageIndex(t.mark1Coverage);
                                if (O === -1) return false;
                                let F = this.glyphIterator.peekIndex(-1);
                                let D = this.glyphs[F];
                                if (!D || !D.isMark) return false;
                                let M = this.glyphIterator.cur;
                                let G = false;
                                if (M.ligatureID === D.ligatureID) {
                                    if (!M.ligatureID) G = true;
                                    else if (M.ligatureComponent === D.ligatureComponent) G = true;
                                } else if (M.ligatureID && !M.ligatureComponent || D.ligatureID && !D.ligatureComponent) G = true;
                                if (!G) return false;
                                let E = this.coverageIndex(t.mark2Coverage, D.id);
                                if (E === -1) return false;
                                let B = t.mark1Array[O];
                                let V = t.mark2Array[E][B.class];
                                this.applyAnchor(B, V, F);
                                return true;
                            }
                        case 7:
                            return this.applyContext(t);
                        case 8:
                            return this.applyChainingContext(t);
                        case 9:
                            return this.applyLookup(t.lookupType, t.extension);
                        default:
                            throw new Error(`Unsupported GPOS table: ${e}`);
                    }
                }
                applyAnchor(e, t, s) {
                    let r = this.getAnchor(t);
                    let n = this.getAnchor(e.markAnchor);
                    let a = this.positions[s];
                    let l = this.positions[this.glyphIterator.index];
                    l.xOffset = r.x - n.x;
                    l.yOffset = r.y - n.y;
                    this.glyphIterator.cur.markAttachment = s;
                }
                getAnchor(e) {
                    let t = e.xCoordinate;
                    let s = e.yCoordinate;
                    let r = this.font._variationProcessor;
                    let n = this.font.GDEF && this.font.GDEF.itemVariationStore;
                    if (r && n) {
                        if (e.xDeviceTable) t += r.getDelta(n, e.xDeviceTable.a, e.xDeviceTable.b);
                        if (e.yDeviceTable) s += r.getDelta(n, e.yDeviceTable.a, e.yDeviceTable.b);
                    }
                    return {
                        x: t,
                        y: s
                    };
                }
                applyFeatures(e, t, s) {
                    super.applyFeatures(e, t, s);
                    for(var r = 0; r < this.glyphs.length; r++)this.fixCursiveAttachment(r);
                    this.fixMarkAttachment();
                }
                fixCursiveAttachment(e) {
                    let t = this.glyphs[e];
                    if (t.cursiveAttachment != null) {
                        let s = t.cursiveAttachment;
                        t.cursiveAttachment = null;
                        this.fixCursiveAttachment(s);
                        this.positions[e].yOffset += this.positions[s].yOffset;
                    }
                }
                fixMarkAttachment() {
                    for(let e = 0; e < this.glyphs.length; e++){
                        let t = this.glyphs[e];
                        if (t.markAttachment != null) {
                            let s = t.markAttachment;
                            this.positions[e].xOffset += this.positions[s].xOffset;
                            this.positions[e].yOffset += this.positions[s].yOffset;
                            if (this.direction === "ltr") for(let r = s; r < e; r++){
                                this.positions[e].xOffset -= this.positions[r].xAdvance;
                                this.positions[e].yOffset -= this.positions[r].yAdvance;
                            }
                            else for(let n = s + 1; n < e + 1; n++){
                                this.positions[e].xOffset += this.positions[n].xAdvance;
                                this.positions[e].yOffset += this.positions[n].yAdvance;
                            }
                        }
                    }
                }
            }
            class lb {
                setup(e) {
                    this.glyphInfos = e.glyphs.map((e)=>new (0, n3)(this.font, e.id, [
                            ...e.codePoints
                        ]));
                    let t = null;
                    if (this.GPOSProcessor) t = this.GPOSProcessor.selectScript(e.script, e.language, e.direction);
                    if (this.GSUBProcessor) t = this.GSUBProcessor.selectScript(e.script, e.language, e.direction);
                    this.shaper = lm(t);
                    this.plan = new (0, nT)(this.font, t, e.direction);
                    this.shaper.plan(this.plan, this.glyphInfos, e.features);
                    for(let s in this.plan.allFeatures)e.features[s] = true;
                }
                substitute(e) {
                    if (this.GSUBProcessor) {
                        this.plan.process(this.GSUBProcessor, this.glyphInfos);
                        e.glyphs = this.glyphInfos.map((e)=>this.font.getGlyph(e.id, e.codePoints));
                    }
                }
                position(e) {
                    if (this.shaper.zeroMarkWidths === "BEFORE_GPOS") this.zeroMarkAdvances(e.positions);
                    if (this.GPOSProcessor) this.plan.process(this.GPOSProcessor, this.glyphInfos, e.positions);
                    if (this.shaper.zeroMarkWidths === "AFTER_GPOS") this.zeroMarkAdvances(e.positions);
                    if (e.direction === "rtl") {
                        e.glyphs.reverse();
                        e.positions.reverse();
                    }
                    return this.GPOSProcessor && this.GPOSProcessor.features;
                }
                zeroMarkAdvances(e) {
                    for(let t = 0; t < this.glyphInfos.length; t++)if (this.glyphInfos[t].isMark) {
                        e[t].xAdvance = 0;
                        e[t].yAdvance = 0;
                    }
                }
                cleanup() {
                    this.glyphInfos = null;
                    this.plan = null;
                    this.shaper = null;
                }
                getAvailableFeatures(e, t) {
                    let s = [];
                    if (this.GSUBProcessor) {
                        this.GSUBProcessor.selectScript(e, t);
                        s.push(...Object.keys(this.GSUBProcessor.features));
                    }
                    if (this.GPOSProcessor) {
                        this.GPOSProcessor.selectScript(e, t);
                        s.push(...Object.keys(this.GPOSProcessor.features));
                    }
                    return s;
                }
                constructor(e){
                    this.font = e;
                    this.glyphInfos = null;
                    this.plan = null;
                    this.GSUBProcessor = null;
                    this.GPOSProcessor = null;
                    this.fallbackPosition = true;
                    if (e.GSUB) this.GSUBProcessor = new (0, lp)(e, e.GSUB);
                    if (e.GPOS) this.GPOSProcessor = new (0, lg)(e, e.GPOS);
                }
            }
            class ly {
                layout(e, t, s, r, n) {
                    if (typeof t === "string") {
                        n = r;
                        r = s;
                        s = t;
                        t = [];
                    }
                    if (typeof e === "string") {
                        if (s == null) s = rY(e);
                        var a = this.font.glyphsForString(e);
                    } else {
                        if (s == null) {
                            let l = [];
                            for (let i of e)l.push(...i.codePoints);
                            s = r$(l);
                        }
                        var a = e;
                    }
                    let o = new (0, rQ)(a, t, s, r, n);
                    if (a.length === 0) {
                        o.positions = [];
                        return o;
                    }
                    if (this.engine && this.engine.setup) this.engine.setup(o);
                    this.substitute(o);
                    this.position(o);
                    this.hideDefaultIgnorables(o.glyphs, o.positions);
                    if (this.engine && this.engine.cleanup) this.engine.cleanup();
                    return o;
                }
                substitute(e) {
                    if (this.engine && this.engine.substitute) this.engine.substitute(e);
                }
                position(e) {
                    e.positions = e.glyphs.map((e)=>new (0, r0)(e.advanceWidth));
                    let t = null;
                    if (this.engine && this.engine.position) t = this.engine.position(e);
                    if (!t && (!this.engine || this.engine.fallbackPosition)) {
                        if (!this.unicodeLayoutEngine) this.unicodeLayoutEngine = new (0, rV)(this.font);
                        this.unicodeLayoutEngine.positionGlyphs(e.glyphs, e.positions);
                    }
                    if ((!t || !t.kern) && e.features.kern !== false && this.font.kern) {
                        if (!this.kernProcessor) this.kernProcessor = new (0, rB)(this.font);
                        this.kernProcessor.process(e.glyphs, e.positions);
                        e.features.kern = true;
                    }
                }
                hideDefaultIgnorables(e, t) {
                    let s = this.font.glyphForCodePoint(0x20);
                    for(let r = 0; r < e.length; r++)if (this.isDefaultIgnorable(e[r].codePoints[0])) {
                        e[r] = s;
                        t[r].xAdvance = 0;
                        t[r].yAdvance = 0;
                    }
                }
                isDefaultIgnorable(e) {
                    let t = e >> 16;
                    if (t === 0) switch(e >> 8){
                        case 0x00:
                            return e === 0x00AD;
                        case 0x03:
                            return e === 0x034F;
                        case 0x06:
                            return e === 0x061C;
                        case 0x17:
                            return 0x17B4 <= e && e <= 0x17B5;
                        case 0x18:
                            return 0x180B <= e && e <= 0x180E;
                        case 0x20:
                            return 0x200B <= e && e <= 0x200F || 0x202A <= e && e <= 0x202E || 0x2060 <= e && e <= 0x206F;
                        case 0xFE:
                            return 0xFE00 <= e && e <= 0xFE0F || e === 0xFEFF;
                        case 0xFF:
                            return 0xFFF0 <= e && e <= 0xFFF8;
                        default:
                            return false;
                    }
                    else switch(t){
                        case 0x01:
                            return 0x1BCA0 <= e && e <= 0x1BCA3 || 0x1D173 <= e && e <= 0x1D17A;
                        case 0x0E:
                            return 0xE0000 <= e && e <= 0xE0FFF;
                        default:
                            return false;
                    }
                }
                getAvailableFeatures(e, t) {
                    let s = [];
                    if (this.engine) s.push(...this.engine.getAvailableFeatures(e, t));
                    if (this.font.kern && s.indexOf("kern") === -1) s.push("kern");
                    return s;
                }
                stringsForGlyph(e) {
                    let t = new Set;
                    let s = this.font._cmapProcessor.codePointsForGlyph(e);
                    for (let r of s)t.add(String.fromCodePoint(r));
                    if (this.engine && this.engine.stringsForGlyph) for (let n of this.engine.stringsForGlyph(e))t.add(n);
                    return Array.from(t);
                }
                constructor(e){
                    this.font = e;
                    this.unicodeLayoutEngine = null;
                    this.kernProcessor = null;
                    if (this.font.morx) this.engine = new (0, nJ)(this.font);
                    else if (this.font.GSUB || this.font.GPOS) this.engine = new (0, lb)(this.font);
                }
            }
            const lw = {
                moveTo: "M",
                lineTo: "L",
                quadraticCurveTo: "Q",
                bezierCurveTo: "C",
                closePath: "Z"
            };
            class lx {
                toFunction() {
                    return (e)=>{
                        this.commands.forEach((t)=>{
                            return e[t.command].apply(e, t.args);
                        });
                    };
                }
                toSVG() {
                    let e = this.commands.map((e)=>{
                        let t = e.args.map((e)=>Math.round(e * 100) / 100);
                        return `${lw[e.command]}${t.join(" ")}`;
                    });
                    return e.join("");
                }
                get cbox() {
                    if (!this._cbox) {
                        let e = new (0, rz);
                        for (let t of this.commands)for(let s = 0; s < t.args.length; s += 2)e.addPoint(t.args[s], t.args[s + 1]);
                        this._cbox = Object.freeze(e);
                    }
                    return this._cbox;
                }
                get bbox() {
                    if (this._bbox) return this._bbox;
                    let e = new (0, rz);
                    let t = 0, s = 0;
                    let r = (e)=>Math.pow(1 - e, 3) * p[w] + 3 * Math.pow(1 - e, 2) * e * g[w] + 3 * (1 - e) * Math.pow(e, 2) * b[w] + Math.pow(e, 3) * y[w];
                    for (let n of this.commands)switch(n.command){
                        case "moveTo":
                        case "lineTo":
                            let [a, l] = n.args;
                            e.addPoint(a, l);
                            t = a;
                            s = l;
                            break;
                        case "quadraticCurveTo":
                        case "bezierCurveTo":
                            if (n.command === "quadraticCurveTo") {
                                var [i, o, u, c] = n.args;
                                var f = t + 2 / 3 * (i - t);
                                var h = s + 2 / 3 * (o - s);
                                var d = u + 2 / 3 * (i - u);
                                var m = c + 2 / 3 * (o - c);
                            } else var [f, h, d, m, u, c] = n.args;
                            e.addPoint(u, c);
                            var p = [
                                t,
                                s
                            ];
                            var g = [
                                f,
                                h
                            ];
                            var b = [
                                d,
                                m
                            ];
                            var y = [
                                u,
                                c
                            ];
                            for(var w = 0; w <= 1; w++){
                                let x = 6 * p[w] - 12 * g[w] + 6 * b[w];
                                let v = -3 * p[w] + 9 * g[w] - 9 * b[w] + 3 * y[w];
                                n = 3 * g[w] - 3 * p[w];
                                if (v === 0) {
                                    if (x === 0) continue;
                                    let _ = -n / x;
                                    if (0 < _ && _ < 1) {
                                        if (w === 0) e.addPoint(r(_), e.maxY);
                                        else if (w === 1) e.addPoint(e.maxX, r(_));
                                    }
                                    continue;
                                }
                                let L = Math.pow(x, 2) - 4 * n * v;
                                if (L < 0) continue;
                                let C = (-x + Math.sqrt(L)) / (2 * v);
                                if (0 < C && C < 1) {
                                    if (w === 0) e.addPoint(r(C), e.maxY);
                                    else if (w === 1) e.addPoint(e.maxX, r(C));
                                }
                                let A = (-x - Math.sqrt(L)) / (2 * v);
                                if (0 < A && A < 1) {
                                    if (w === 0) e.addPoint(r(A), e.maxY);
                                    else if (w === 1) e.addPoint(e.maxX, r(A));
                                }
                            }
                            t = u;
                            s = c;
                            break;
                    }
                    return this._bbox = Object.freeze(e);
                }
                mapPoints(e) {
                    let t = new lx;
                    for (let s of this.commands){
                        let r = [];
                        for(let n = 0; n < s.args.length; n += 2){
                            let [a, l] = e(s.args[n], s.args[n + 1]);
                            r.push(a, l);
                        }
                        t[s.command](...r);
                    }
                    return t;
                }
                transform(e, t, s, r, n, a) {
                    return this.mapPoints((l, i)=>{
                        const o = e * l + s * i + n;
                        const u = t * l + r * i + a;
                        return [
                            o,
                            u
                        ];
                    });
                }
                translate(e, t) {
                    return this.transform(1, 0, 0, 1, e, t);
                }
                rotate(e) {
                    let t = Math.cos(e);
                    let s = Math.sin(e);
                    return this.transform(t, s, -s, t, 0, 0);
                }
                scale(e, t = e) {
                    return this.transform(e, 0, 0, t, 0, 0);
                }
                constructor(){
                    this.commands = [];
                    this._bbox = null;
                    this._cbox = null;
                }
            }
            for (let lv of [
                "moveTo",
                "lineTo",
                "quadraticCurveTo",
                "bezierCurveTo",
                "closePath"
            ])lx.prototype[lv] = function(...e) {
                this._bbox = this._cbox = null;
                this.commands.push({
                    command: lv,
                    args: e
                });
                return this;
            };
            var l_ = [
                ".notdef",
                ".null",
                "nonmarkingreturn",
                "space",
                "exclam",
                "quotedbl",
                "numbersign",
                "dollar",
                "percent",
                "ampersand",
                "quotesingle",
                "parenleft",
                "parenright",
                "asterisk",
                "plus",
                "comma",
                "hyphen",
                "period",
                "slash",
                "zero",
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
                "eight",
                "nine",
                "colon",
                "semicolon",
                "less",
                "equal",
                "greater",
                "question",
                "at",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "bracketleft",
                "backslash",
                "bracketright",
                "asciicircum",
                "underscore",
                "grave",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "braceleft",
                "bar",
                "braceright",
                "asciitilde",
                "Adieresis",
                "Aring",
                "Ccedilla",
                "Eacute",
                "Ntilde",
                "Odieresis",
                "Udieresis",
                "aacute",
                "agrave",
                "acircumflex",
                "adieresis",
                "atilde",
                "aring",
                "ccedilla",
                "eacute",
                "egrave",
                "ecircumflex",
                "edieresis",
                "iacute",
                "igrave",
                "icircumflex",
                "idieresis",
                "ntilde",
                "oacute",
                "ograve",
                "ocircumflex",
                "odieresis",
                "otilde",
                "uacute",
                "ugrave",
                "ucircumflex",
                "udieresis",
                "dagger",
                "degree",
                "cent",
                "sterling",
                "section",
                "bullet",
                "paragraph",
                "germandbls",
                "registered",
                "copyright",
                "trademark",
                "acute",
                "dieresis",
                "notequal",
                "AE",
                "Oslash",
                "infinity",
                "plusminus",
                "lessequal",
                "greaterequal",
                "yen",
                "mu",
                "partialdiff",
                "summation",
                "product",
                "pi",
                "integral",
                "ordfeminine",
                "ordmasculine",
                "Omega",
                "ae",
                "oslash",
                "questiondown",
                "exclamdown",
                "logicalnot",
                "radical",
                "florin",
                "approxequal",
                "Delta",
                "guillemotleft",
                "guillemotright",
                "ellipsis",
                "nonbreakingspace",
                "Agrave",
                "Atilde",
                "Otilde",
                "OE",
                "oe",
                "endash",
                "emdash",
                "quotedblleft",
                "quotedblright",
                "quoteleft",
                "quoteright",
                "divide",
                "lozenge",
                "ydieresis",
                "Ydieresis",
                "fraction",
                "currency",
                "guilsinglleft",
                "guilsinglright",
                "fi",
                "fl",
                "daggerdbl",
                "periodcentered",
                "quotesinglbase",
                "quotedblbase",
                "perthousand",
                "Acircumflex",
                "Ecircumflex",
                "Aacute",
                "Edieresis",
                "Egrave",
                "Iacute",
                "Icircumflex",
                "Idieresis",
                "Igrave",
                "Oacute",
                "Ocircumflex",
                "apple",
                "Ograve",
                "Uacute",
                "Ucircumflex",
                "Ugrave",
                "dotlessi",
                "circumflex",
                "tilde",
                "macron",
                "breve",
                "dotaccent",
                "ring",
                "cedilla",
                "hungarumlaut",
                "ogonek",
                "caron",
                "Lslash",
                "lslash",
                "Scaron",
                "scaron",
                "Zcaron",
                "zcaron",
                "brokenbar",
                "Eth",
                "eth",
                "Yacute",
                "yacute",
                "Thorn",
                "thorn",
                "minus",
                "multiply",
                "onesuperior",
                "twosuperior",
                "threesuperior",
                "onehalf",
                "onequarter",
                "threequarters",
                "franc",
                "Gbreve",
                "gbreve",
                "Idotaccent",
                "Scedilla",
                "scedilla",
                "Cacute",
                "cacute",
                "Ccaron",
                "ccaron",
                "dcroat"
            ];
            class lL {
                _getPath() {
                    return new (0, lx)();
                }
                _getCBox() {
                    return this.path.cbox;
                }
                _getBBox() {
                    return this.path.bbox;
                }
                _getTableMetrics(e) {
                    if (this.id < e.metrics.length) return e.metrics.get(this.id);
                    let t = e.metrics.get(e.metrics.length - 1);
                    let s = {
                        advance: t ? t.advance : 0,
                        bearing: e.bearings.get(this.id - e.metrics.length) || 0
                    };
                    return s;
                }
                _getMetrics(e) {
                    if (this._metrics) return this._metrics;
                    let { advance: t , bearing: s  } = this._getTableMetrics(this._font.hmtx);
                    if (this._font.vmtx) var { advance: r , bearing: n  } = this._getTableMetrics(this._font.vmtx);
                    else {
                        let a;
                        if (typeof e === "undefined" || e === null) ({ cbox: e  } = this);
                        if ((a = this._font["OS/2"]) && a.version > 0) {
                            var r = Math.abs(a.typoAscender - a.typoDescender);
                            var n = a.typoAscender - e.maxY;
                        } else {
                            let { hhea: l  } = this._font;
                            var r = Math.abs(l.ascent - l.descent);
                            var n = l.ascent - e.maxY;
                        }
                    }
                    if (this._font._variationProcessor && this._font.HVAR) t += this._font._variationProcessor.getAdvanceAdjustment(this.id, this._font.HVAR);
                    return this._metrics = {
                        advanceWidth: t,
                        advanceHeight: r,
                        leftBearing: s,
                        topBearing: n
                    };
                }
                get cbox() {
                    return this._getCBox();
                }
                get bbox() {
                    return this._getBBox();
                }
                get path() {
                    return this._getPath();
                }
                getScaledPath(e) {
                    let t = 1 / this._font.unitsPerEm * e;
                    return this.path.scale(t);
                }
                get advanceWidth() {
                    return this._getMetrics().advanceWidth;
                }
                get advanceHeight() {
                    return this._getMetrics().advanceHeight;
                }
                get ligatureCaretPositions() {}
                _getName() {
                    let { post: e  } = this._font;
                    if (!e) return null;
                    switch(e.version){
                        case 1:
                            return (0, l_)[this.id];
                        case 2:
                            let t = e.glyphNameIndex[this.id];
                            if (t < (0, l_).length) return (0, l_)[t];
                            return e.names[t - (0, l_).length];
                        case 2.5:
                            return (0, l_)[this.id + e.offsets[this.id]];
                        case 4:
                            return String.fromCharCode(e.map[this.id]);
                    }
                }
                get name() {
                    return this._getName();
                }
                render(e, t) {
                    e.save();
                    let s = 1 / this._font.head.unitsPerEm * t;
                    e.scale(s, s);
                    let r = this.path.toFunction();
                    r(e);
                    e.fill();
                    e.restore();
                }
                constructor(e, t, s){
                    this.id = e;
                    this.codePoints = t;
                    this._font = s;
                    this.isMark = this.codePoints.length > 0 && this.codePoints.every((0, i.YB));
                    this.isLigature = this.codePoints.length > 1;
                }
            }
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "cbox", null);
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "bbox", null);
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "path", null);
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "advanceWidth", null);
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "advanceHeight", null);
            (0, a.__decorate)([
                (0, _)
            ], lL.prototype, "name", null);
            let lC = new r.AU({
                numberOfContours: r.Af,
                xMin: r.Af,
                yMin: r.Af,
                xMax: r.Af,
                yMax: r.Af
            });
            const lA = 1;
            const lk = 2;
            const lS = 4;
            const lI = 8;
            const lP = 16;
            const lU = 32;
            const lJ = 1;
            const lT = 2;
            const lO = 4;
            const lF = 8;
            const lD = 32;
            const lM = 64;
            const lG = 128;
            const lE = 256;
            const lB = 512;
            const lV = 1024;
            const lz = 2048;
            const lR = 4096;
            class lN {
                copy() {
                    return new lN(this.onCurve, this.endContour, this.x, this.y);
                }
                constructor(e, t, s = 0, r = 0){
                    this.onCurve = e;
                    this.endContour = t;
                    this.x = s;
                    this.y = r;
                }
            }
            class lW {
                constructor(e, t, s){
                    this.glyphID = e;
                    this.dx = t;
                    this.dy = s;
                    this.pos = 0;
                    this.scaleX = this.scaleY = 1;
                    this.scale01 = this.scale10 = 0;
                }
            }
            class lX extends (0, lL) {
                _getCBox(e) {
                    if (this._font._variationProcessor && !e) return this.path.cbox;
                    let t = this._font._getTableStream("glyf");
                    t.pos += this._font.loca.offsets[this.id];
                    let s = lC.decode(t);
                    let r = new (0, rz)(s.xMin, s.yMin, s.xMax, s.yMax);
                    return Object.freeze(r);
                }
                _parseGlyphCoord(e, t, s, r) {
                    if (s) {
                        var n = e.readUInt8();
                        if (!r) n = -n;
                        n += t;
                    } else if (r) var n = t;
                    else var n = t + e.readInt16BE();
                    return n;
                }
                _decode() {
                    let e = this._font.loca.offsets[this.id];
                    let t = this._font.loca.offsets[this.id + 1];
                    if (e === t) return null;
                    let s = this._font._getTableStream("glyf");
                    s.pos += e;
                    let r = s.pos;
                    let n = lC.decode(s);
                    if (n.numberOfContours > 0) this._decodeSimple(n, s);
                    else if (n.numberOfContours < 0) this._decodeComposite(n, s, r);
                    return n;
                }
                _decodeSimple(e, t) {
                    e.points = [];
                    let s = new r.mJ(r.mL, e.numberOfContours).decode(t);
                    e.instructions = new r.mJ(r.w_, r.mL).decode(t);
                    let n = [];
                    let a = s[s.length - 1] + 1;
                    while(n.length < a){
                        var l = t.readUInt8();
                        n.push(l);
                        if (l & lI) {
                            let i = t.readUInt8();
                            for(let o = 0; o < i; o++)n.push(l);
                        }
                    }
                    for(var u = 0; u < n.length; u++){
                        var l = n[u];
                        let c = new lN(!!(l & lA), s.indexOf(u) >= 0, 0, 0);
                        e.points.push(c);
                    }
                    let f = 0;
                    for(var u = 0; u < n.length; u++){
                        var l = n[u];
                        e.points[u].x = f = this._parseGlyphCoord(t, f, l & lk, l & lP);
                    }
                    let h = 0;
                    for(var u = 0; u < n.length; u++){
                        var l = n[u];
                        e.points[u].y = h = this._parseGlyphCoord(t, h, l & lS, l & lU);
                    }
                    if (this._font._variationProcessor) {
                        let d = e.points.slice();
                        d.push(...this._getPhantomPoints(e));
                        this._font._variationProcessor.transformPoints(this.id, d);
                        e.phantomPoints = d.slice(-4);
                    }
                    return;
                }
                _decodeComposite(e, t, s = 0) {
                    e.components = [];
                    let r = false;
                    let n = lD;
                    while(n & lD){
                        n = t.readUInt16BE();
                        let a = t.pos - s;
                        let l = t.readUInt16BE();
                        if (!r) r = (n & lE) !== 0;
                        if (n & lJ) {
                            var i = t.readInt16BE();
                            var o = t.readInt16BE();
                        } else {
                            var i = t.readInt8();
                            var o = t.readInt8();
                        }
                        var u = new lW(l, i, o);
                        u.pos = a;
                        if (n & lF) u.scaleX = u.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                        else if (n & lM) {
                            u.scaleX = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                            u.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                        } else if (n & lG) {
                            u.scaleX = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                            u.scale01 = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                            u.scale10 = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                            u.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824;
                        }
                        e.components.push(u);
                    }
                    if (this._font._variationProcessor) {
                        let c = [];
                        for(let f = 0; f < e.components.length; f++){
                            var u = e.components[f];
                            c.push(new lN(true, true, u.dx, u.dy));
                        }
                        c.push(...this._getPhantomPoints(e));
                        this._font._variationProcessor.transformPoints(this.id, c);
                        e.phantomPoints = c.splice(-4, 4);
                        for(let h = 0; h < c.length; h++){
                            let d = c[h];
                            e.components[h].dx = d.x;
                            e.components[h].dy = d.y;
                        }
                    }
                    return r;
                }
                _getPhantomPoints(e) {
                    let t = this._getCBox(true);
                    if (this._metrics == null) this._metrics = (0, lL).prototype._getMetrics.call(this, t);
                    let { advanceWidth: s , advanceHeight: r , leftBearing: n , topBearing: a  } = this._metrics;
                    return [
                        new lN(false, true, e.xMin - n, 0),
                        new lN(false, true, e.xMin - n + s, 0),
                        new lN(false, true, 0, e.yMax + a),
                        new lN(false, true, 0, e.yMax + a + r)
                    ];
                }
                _getContours() {
                    let e = this._decode();
                    if (!e) return [];
                    let t = [];
                    if (e.numberOfContours < 0) for (let s of e.components){
                        let r = this._font.getGlyph(s.glyphID)._getContours();
                        for(let n = 0; n < r.length; n++){
                            let a = r[n];
                            for(let l = 0; l < a.length; l++){
                                let i = a[l];
                                let o = i.x * s.scaleX + i.y * s.scale01 + s.dx;
                                let u = i.y * s.scaleY + i.x * s.scale10 + s.dy;
                                t.push(new lN(i.onCurve, i.endContour, o, u));
                            }
                        }
                    }
                    else t = e.points || [];
                    if (e.phantomPoints && !this._font.directory.tables.HVAR) {
                        this._metrics.advanceWidth = e.phantomPoints[1].x - e.phantomPoints[0].x;
                        this._metrics.advanceHeight = e.phantomPoints[3].y - e.phantomPoints[2].y;
                        this._metrics.leftBearing = e.xMin - e.phantomPoints[0].x;
                        this._metrics.topBearing = e.phantomPoints[2].y - e.yMax;
                    }
                    let c = [];
                    let f = [];
                    for(let h = 0; h < t.length; h++){
                        var d = t[h];
                        f.push(d);
                        if (d.endContour) {
                            c.push(f);
                            f = [];
                        }
                    }
                    return c;
                }
                _getMetrics() {
                    if (this._metrics) return this._metrics;
                    let e = this._getCBox(true);
                    super._getMetrics(e);
                    if (this._font._variationProcessor && !this._font.HVAR) this.path;
                    return this._metrics;
                }
                _getPath() {
                    let e = this._getContours();
                    let t = new (0, lx);
                    for(let s = 0; s < e.length; s++){
                        let r = e[s];
                        let n = r[0];
                        let a = r[r.length - 1];
                        let l = 0;
                        if (n.onCurve) {
                            var i = null;
                            l = 1;
                        } else {
                            if (a.onCurve) n = a;
                            else n = new lN(false, false, (n.x + a.x) / 2, (n.y + a.y) / 2);
                            var i = n;
                        }
                        t.moveTo(n.x, n.y);
                        for(let o = l; o < r.length; o++){
                            let u = r[o];
                            let c = o === 0 ? n : r[o - 1];
                            if (c.onCurve && u.onCurve) t.lineTo(u.x, u.y);
                            else if (c.onCurve && !u.onCurve) var i = u;
                            else if (!c.onCurve && !u.onCurve) {
                                let f = (c.x + u.x) / 2;
                                let h = (c.y + u.y) / 2;
                                t.quadraticCurveTo(c.x, c.y, f, h);
                                var i = u;
                            } else if (!c.onCurve && u.onCurve) {
                                t.quadraticCurveTo(i.x, i.y, u.x, u.y);
                                var i = null;
                            } else throw new Error("Unknown TTF path state");
                        }
                        if (i) t.quadraticCurveTo(i.x, i.y, n.x, n.y);
                        t.closePath();
                    }
                    return t;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "TTF");
                }
            }
            class lq extends (0, lL) {
                _getName() {
                    if (this._font.CFF2) return super._getName();
                    return this._font["CFF "].getGlyphName(this.id);
                }
                bias(e) {
                    if (e.length < 1240) return 107;
                    else if (e.length < 33900) return 1131;
                    else return 32768;
                }
                _getPath() {
                    let e = this._font.CFF2 || this._font["CFF "];
                    let { stream: t  } = e;
                    let s = e.topDict.CharStrings[this.id];
                    let r = s.offset + s.length;
                    t.pos = s.offset;
                    let n = new (0, lx);
                    let a = [];
                    let l = [];
                    let i = null;
                    let o = 0;
                    let u = 0, c = 0;
                    let f;
                    let h;
                    let d = false;
                    this._usedGsubrs = f = {};
                    this._usedSubrs = h = {};
                    let m = e.globalSubrIndex || [];
                    let p = this.bias(m);
                    let g = e.privateDictForGlyph(this.id) || {};
                    let b = g.Subrs || [];
                    let y = this.bias(b);
                    let w = e.topDict.vstore && e.topDict.vstore.itemVariationStore;
                    let x = g.vsindex;
                    let v = this._font._variationProcessor;
                    function _() {
                        if (i == null) i = a.shift() + g.nominalWidthX;
                    }
                    function L() {
                        if (a.length % 2 !== 0) _();
                        o += a.length >> 1;
                        return a.length = 0;
                    }
                    function C(e, t) {
                        if (d) n.closePath();
                        n.moveTo(e, t);
                        d = true;
                    }
                    let A = function() {
                        while(t.pos < r){
                            let s = t.readUInt8();
                            if (s < 32) {
                                let i, g, k;
                                switch(s){
                                    case 1:
                                    case 3:
                                    case 18:
                                    case 23:
                                        L();
                                        break;
                                    case 4:
                                        if (a.length > 1) _();
                                        c += a.shift();
                                        C(u, c);
                                        break;
                                    case 5:
                                        while(a.length >= 2){
                                            u += a.shift();
                                            c += a.shift();
                                            n.lineTo(u, c);
                                        }
                                        break;
                                    case 6:
                                    case 7:
                                        k = s === 6;
                                        while(a.length >= 1){
                                            if (k) u += a.shift();
                                            else c += a.shift();
                                            n.lineTo(u, c);
                                            k = !k;
                                        }
                                        break;
                                    case 8:
                                        while(a.length > 0){
                                            var S = u + a.shift();
                                            var I = c + a.shift();
                                            var P = S + a.shift();
                                            var U = I + a.shift();
                                            u = P + a.shift();
                                            c = U + a.shift();
                                            n.bezierCurveTo(S, I, P, U, u, c);
                                        }
                                        break;
                                    case 10:
                                        i = a.pop() + y;
                                        g = b[i];
                                        if (g) {
                                            h[i] = true;
                                            var J = t.pos;
                                            var T = r;
                                            t.pos = g.offset;
                                            r = g.offset + g.length;
                                            A();
                                            t.pos = J;
                                            r = T;
                                        }
                                        break;
                                    case 11:
                                        if (e.version >= 2) break;
                                        return;
                                    case 14:
                                        if (e.version >= 2) break;
                                        if (a.length > 0) _();
                                        if (d) {
                                            n.closePath();
                                            d = false;
                                        }
                                        break;
                                    case 15:
                                        if (e.version < 2) throw new Error("vsindex operator not supported in CFF v1");
                                        x = a.pop();
                                        break;
                                    case 16:
                                        {
                                            if (e.version < 2) throw new Error("blend operator not supported in CFF v1");
                                            if (!v) throw new Error("blend operator in non-variation font");
                                            let O = v.getBlendVector(w, x);
                                            let F = a.pop();
                                            let D = F * O.length;
                                            let M = a.length - D;
                                            let G = M - F;
                                            for(let E = 0; E < F; E++){
                                                let B = a[G + E];
                                                for(let V = 0; V < O.length; V++)B += O[V] * a[M++];
                                                a[G + E] = B;
                                            }
                                            while(D--)a.pop();
                                            break;
                                        }
                                    case 19:
                                    case 20:
                                        L();
                                        t.pos += o + 7 >> 3;
                                        break;
                                    case 21:
                                        if (a.length > 2) _();
                                        u += a.shift();
                                        c += a.shift();
                                        C(u, c);
                                        break;
                                    case 22:
                                        if (a.length > 1) _();
                                        u += a.shift();
                                        C(u, c);
                                        break;
                                    case 24:
                                        while(a.length >= 8){
                                            var S = u + a.shift();
                                            var I = c + a.shift();
                                            var P = S + a.shift();
                                            var U = I + a.shift();
                                            u = P + a.shift();
                                            c = U + a.shift();
                                            n.bezierCurveTo(S, I, P, U, u, c);
                                        }
                                        u += a.shift();
                                        c += a.shift();
                                        n.lineTo(u, c);
                                        break;
                                    case 25:
                                        while(a.length >= 8){
                                            u += a.shift();
                                            c += a.shift();
                                            n.lineTo(u, c);
                                        }
                                        var S = u + a.shift();
                                        var I = c + a.shift();
                                        var P = S + a.shift();
                                        var U = I + a.shift();
                                        u = P + a.shift();
                                        c = U + a.shift();
                                        n.bezierCurveTo(S, I, P, U, u, c);
                                        break;
                                    case 26:
                                        if (a.length % 2) u += a.shift();
                                        while(a.length >= 4){
                                            S = u;
                                            I = c + a.shift();
                                            P = S + a.shift();
                                            U = I + a.shift();
                                            u = P;
                                            c = U + a.shift();
                                            n.bezierCurveTo(S, I, P, U, u, c);
                                        }
                                        break;
                                    case 27:
                                        if (a.length % 2) c += a.shift();
                                        while(a.length >= 4){
                                            S = u + a.shift();
                                            I = c;
                                            P = S + a.shift();
                                            U = I + a.shift();
                                            u = P + a.shift();
                                            c = U;
                                            n.bezierCurveTo(S, I, P, U, u, c);
                                        }
                                        break;
                                    case 28:
                                        a.push(t.readInt16BE());
                                        break;
                                    case 29:
                                        i = a.pop() + p;
                                        g = m[i];
                                        if (g) {
                                            f[i] = true;
                                            var J = t.pos;
                                            var T = r;
                                            t.pos = g.offset;
                                            r = g.offset + g.length;
                                            A();
                                            t.pos = J;
                                            r = T;
                                        }
                                        break;
                                    case 30:
                                    case 31:
                                        k = s === 31;
                                        while(a.length >= 4){
                                            if (k) {
                                                S = u + a.shift();
                                                I = c;
                                                P = S + a.shift();
                                                U = I + a.shift();
                                                c = U + a.shift();
                                                u = P + (a.length === 1 ? a.shift() : 0);
                                            } else {
                                                S = u;
                                                I = c + a.shift();
                                                P = S + a.shift();
                                                U = I + a.shift();
                                                u = P + a.shift();
                                                c = U + (a.length === 1 ? a.shift() : 0);
                                            }
                                            n.bezierCurveTo(S, I, P, U, u, c);
                                            k = !k;
                                        }
                                        break;
                                    case 12:
                                        s = t.readUInt8();
                                        switch(s){
                                            case 3:
                                                let z = a.pop();
                                                let R = a.pop();
                                                a.push(z && R ? 1 : 0);
                                                break;
                                            case 4:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z || R ? 1 : 0);
                                                break;
                                            case 5:
                                                z = a.pop();
                                                a.push(z ? 0 : 1);
                                                break;
                                            case 9:
                                                z = a.pop();
                                                a.push(Math.abs(z));
                                                break;
                                            case 10:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z + R);
                                                break;
                                            case 11:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z - R);
                                                break;
                                            case 12:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z / R);
                                                break;
                                            case 14:
                                                z = a.pop();
                                                a.push(-z);
                                                break;
                                            case 15:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z === R ? 1 : 0);
                                                break;
                                            case 18:
                                                a.pop();
                                                break;
                                            case 20:
                                                let N = a.pop();
                                                let W = a.pop();
                                                l[W] = N;
                                                break;
                                            case 21:
                                                W = a.pop();
                                                a.push(l[W] || 0);
                                                break;
                                            case 22:
                                                let X = a.pop();
                                                let q = a.pop();
                                                let H = a.pop();
                                                let j = a.pop();
                                                a.push(H <= j ? X : q);
                                                break;
                                            case 23:
                                                a.push(Math.random());
                                                break;
                                            case 24:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(z * R);
                                                break;
                                            case 26:
                                                z = a.pop();
                                                a.push(Math.sqrt(z));
                                                break;
                                            case 27:
                                                z = a.pop();
                                                a.push(z, z);
                                                break;
                                            case 28:
                                                z = a.pop();
                                                R = a.pop();
                                                a.push(R, z);
                                                break;
                                            case 29:
                                                W = a.pop();
                                                if (W < 0) W = 0;
                                                else if (W > a.length - 1) W = a.length - 1;
                                                a.push(a[W]);
                                                break;
                                            case 30:
                                                let Y = a.pop();
                                                let $ = a.pop();
                                                if ($ >= 0) while($ > 0){
                                                    var Z = a[Y - 1];
                                                    for(let K = Y - 2; K >= 0; K--)a[K + 1] = a[K];
                                                    a[0] = Z;
                                                    $--;
                                                }
                                                else while($ < 0){
                                                    var Z = a[0];
                                                    for(let Q = 0; Q <= Y; Q++)a[Q] = a[Q + 1];
                                                    a[Y - 1] = Z;
                                                    $++;
                                                }
                                                break;
                                            case 34:
                                                S = u + a.shift();
                                                I = c;
                                                P = S + a.shift();
                                                U = I + a.shift();
                                                let ee = P + a.shift();
                                                let et = U;
                                                let es = ee + a.shift();
                                                let er = et;
                                                let en = es + a.shift();
                                                let ea = er;
                                                let el = en + a.shift();
                                                let ei = ea;
                                                u = el;
                                                c = ei;
                                                n.bezierCurveTo(S, I, P, U, ee, et);
                                                n.bezierCurveTo(es, er, en, ea, el, ei);
                                                break;
                                            case 35:
                                                let eo = [];
                                                for(let eu = 0; eu <= 5; eu++){
                                                    u += a.shift();
                                                    c += a.shift();
                                                    eo.push(u, c);
                                                }
                                                n.bezierCurveTo(...eo.slice(0, 6));
                                                n.bezierCurveTo(...eo.slice(6));
                                                a.shift();
                                                break;
                                            case 36:
                                                S = u + a.shift();
                                                I = c + a.shift();
                                                P = S + a.shift();
                                                U = I + a.shift();
                                                ee = P + a.shift();
                                                et = U;
                                                es = ee + a.shift();
                                                er = et;
                                                en = es + a.shift();
                                                ea = er + a.shift();
                                                el = en + a.shift();
                                                ei = ea;
                                                u = el;
                                                c = ei;
                                                n.bezierCurveTo(S, I, P, U, ee, et);
                                                n.bezierCurveTo(es, er, en, ea, el, ei);
                                                break;
                                            case 37:
                                                let ec = u;
                                                let ef = c;
                                                eo = [];
                                                for(let eh = 0; eh <= 4; eh++){
                                                    u += a.shift();
                                                    c += a.shift();
                                                    eo.push(u, c);
                                                }
                                                if (Math.abs(u - ec) > Math.abs(c - ef)) {
                                                    u += a.shift();
                                                    c = ef;
                                                } else {
                                                    u = ec;
                                                    c += a.shift();
                                                }
                                                eo.push(u, c);
                                                n.bezierCurveTo(...eo.slice(0, 6));
                                                n.bezierCurveTo(...eo.slice(6));
                                                break;
                                            default:
                                                throw new Error(`Unknown op: 12 ${s}`);
                                        }
                                        break;
                                    default:
                                        throw new Error(`Unknown op: ${s}`);
                                }
                            } else if (s < 247) a.push(s - 139);
                            else if (s < 251) {
                                var ed = t.readUInt8();
                                a.push((s - 247) * 256 + ed + 108);
                            } else if (s < 255) {
                                var ed = t.readUInt8();
                                a.push(-(s - 251) * 256 - ed - 108);
                            } else a.push(t.readInt32BE() / 65536);
                        }
                    };
                    A();
                    if (d) n.closePath();
                    return n;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "CFF");
                }
            }
            let lH = new r.AU({
                originX: r.mL,
                originY: r.mL,
                type: new r.Ld(4),
                data: new r.lW((e)=>e.parent.buflen - e._currentOffset)
            });
            class lj extends (0, lX) {
                getImageForSize(e) {
                    for(let t = 0; t < this._font.sbix.imageTables.length; t++){
                        var s = this._font.sbix.imageTables[t];
                        if (s.ppem >= e) break;
                    }
                    let r = s.imageOffsets;
                    let n = r[this.id];
                    let a = r[this.id + 1];
                    if (n === a) return null;
                    this._font.stream.pos = n;
                    return lH.decode(this._font.stream, {
                        buflen: a - n
                    });
                }
                render(e, t) {
                    let s = this.getImageForSize(t);
                    if (s != null) {
                        let r = t / this._font.unitsPerEm;
                        e.image(s.data, {
                            height: t,
                            x: s.originX,
                            y: (this.bbox.minY - s.originY) * r
                        });
                    }
                    if (this._font.sbix.flags.renderOutlines) super.render(e, t);
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "SBIX");
                }
            }
            class lY {
                constructor(e, t){
                    this.glyph = e;
                    this.color = t;
                }
            }
            class l$ extends (0, lL) {
                _getBBox() {
                    let e = new (0, rz);
                    for(let t = 0; t < this.layers.length; t++){
                        let s = this.layers[t];
                        let r = s.glyph.bbox;
                        e.addPoint(r.minX, r.minY);
                        e.addPoint(r.maxX, r.maxY);
                    }
                    return e;
                }
                get layers() {
                    let e = this._font.CPAL;
                    let t = this._font.COLR;
                    let s = 0;
                    let r = t.baseGlyphRecord.length - 1;
                    while(s <= r){
                        let n = s + r >> 1;
                        var a = t.baseGlyphRecord[n];
                        if (this.id < a.gid) r = n - 1;
                        else if (this.id > a.gid) s = n + 1;
                        else {
                            var l = a;
                            break;
                        }
                    }
                    if (l == null) {
                        var i = this._font._getBaseGlyph(this.id);
                        var o = {
                            red: 0,
                            green: 0,
                            blue: 0,
                            alpha: 255
                        };
                        return [
                            new lY(i, o)
                        ];
                    }
                    let u = [];
                    for(let c = l.firstLayerIndex; c < l.firstLayerIndex + l.numLayers; c++){
                        var a = t.layerRecords[c];
                        var o = e.colorRecords[a.paletteIndex];
                        var i = this._font._getBaseGlyph(a.gid);
                        u.push(new lY(i, o));
                    }
                    return u;
                }
                render(e, t) {
                    for (let { glyph: s , color: r  } of this.layers){
                        e.fillColor([
                            r.red,
                            r.green,
                            r.blue
                        ], r.alpha / 255 * 100);
                        s.render(e, t);
                    }
                    return;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "COLR");
                }
            }
            const lZ = 0x8000;
            const lK = 0x0fff;
            const lQ = 0x8000;
            const l0 = 0x4000;
            const l1 = 0x2000;
            const l2 = 0x0fff;
            const l3 = 0x80;
            const l4 = 0x7f;
            const l5 = 0x80;
            const l7 = 0x40;
            const l6 = 0x3f;
            class l9 {
                normalizeCoords(e) {
                    let t = [];
                    for(var s = 0; s < this.font.fvar.axis.length; s++){
                        let r = this.font.fvar.axis[s];
                        if (e[s] < r.defaultValue) t.push((e[s] - r.defaultValue + Number.EPSILON) / (r.defaultValue - r.minValue + Number.EPSILON));
                        else t.push((e[s] - r.defaultValue + Number.EPSILON) / (r.maxValue - r.defaultValue + Number.EPSILON));
                    }
                    if (this.font.avar) for(var s = 0; s < this.font.avar.segment.length; s++){
                        let n = this.font.avar.segment[s];
                        for(let a = 0; a < n.correspondence.length; a++){
                            let l = n.correspondence[a];
                            if (a >= 1 && t[s] < l.fromCoord) {
                                let i = n.correspondence[a - 1];
                                t[s] = ((t[s] - i.fromCoord) * (l.toCoord - i.toCoord) + Number.EPSILON) / (l.fromCoord - i.fromCoord + Number.EPSILON) + i.toCoord;
                                break;
                            }
                        }
                    }
                    return t;
                }
                transformPoints(e, t) {
                    if (!this.font.fvar || !this.font.gvar) return;
                    let { gvar: s  } = this.font;
                    if (e >= s.glyphCount) return;
                    let r = s.offsets[e];
                    if (r === s.offsets[e + 1]) return;
                    let { stream: n  } = this.font;
                    n.pos = r;
                    if (n.pos >= n.length) return;
                    let a = n.readUInt16BE();
                    let l = r + n.readUInt16BE();
                    if (a & lZ) {
                        var i = n.pos;
                        n.pos = l;
                        var o = this.decodePoints();
                        l = n.pos;
                        n.pos = i;
                    }
                    let u = t.map((e)=>e.copy());
                    a &= lK;
                    for(let c = 0; c < a; c++){
                        let f = n.readUInt16BE();
                        let h = n.readUInt16BE();
                        if (h & lQ) {
                            var d = [];
                            for(let m = 0; m < s.axisCount; m++)d.push(n.readInt16BE() / 16384);
                        } else {
                            if ((h & l2) >= s.globalCoordCount) throw new Error("Invalid gvar table");
                            var d = s.globalCoords[h & l2];
                        }
                        if (h & l0) {
                            var p = [];
                            for(let g = 0; g < s.axisCount; g++)p.push(n.readInt16BE() / 16384);
                            var b = [];
                            for(let y = 0; y < s.axisCount; y++)b.push(n.readInt16BE() / 16384);
                        }
                        let w = this.tupleFactor(h, d, p, b);
                        if (w === 0) {
                            l += f;
                            continue;
                        }
                        var i = n.pos;
                        n.pos = l;
                        if (h & l1) var x = this.decodePoints();
                        else var x = o;
                        let v = x.length === 0 ? t.length : x.length;
                        let _ = this.decodeDeltas(v);
                        let L = this.decodeDeltas(v);
                        if (x.length === 0) for(let C = 0; C < t.length; C++){
                            var A = t[C];
                            A.x += Math.round(_[C] * w);
                            A.y += Math.round(L[C] * w);
                        }
                        else {
                            let k = u.map((e)=>e.copy());
                            let S = t.map(()=>false);
                            for(let I = 0; I < x.length; I++){
                                let P = x[I];
                                if (P < t.length) {
                                    let U = k[P];
                                    S[P] = true;
                                    U.x += Math.round(_[I] * w);
                                    U.y += Math.round(L[I] * w);
                                }
                            }
                            this.interpolateMissingDeltas(k, u, S);
                            for(let J = 0; J < t.length; J++){
                                let T = k[J].x - u[J].x;
                                let O = k[J].y - u[J].y;
                                t[J].x += T;
                                t[J].y += O;
                            }
                        }
                        l += f;
                        n.pos = i;
                    }
                }
                decodePoints() {
                    let e = this.font.stream;
                    let t = e.readUInt8();
                    if (t & l3) t = (t & l4) << 8 | e.readUInt8();
                    let s = new Uint16Array(t);
                    let r = 0;
                    let n = 0;
                    while(r < t){
                        let a = e.readUInt8();
                        let l = (a & l4) + 1;
                        let i = a & l3 ? e.readUInt16 : e.readUInt8;
                        for(let o = 0; o < l && r < t; o++){
                            n += i.call(e);
                            s[r++] = n;
                        }
                    }
                    return s;
                }
                decodeDeltas(e) {
                    let t = this.font.stream;
                    let s = 0;
                    let r = new Int16Array(e);
                    while(s < e){
                        let n = t.readUInt8();
                        let a = (n & l6) + 1;
                        if (n & l5) s += a;
                        else {
                            let l = n & l7 ? t.readInt16BE : t.readInt8;
                            for(let i = 0; i < a && s < e; i++)r[s++] = l.call(t);
                        }
                    }
                    return r;
                }
                tupleFactor(e, t, s, r) {
                    let n = this.normalizedCoords;
                    let { gvar: a  } = this.font;
                    let l = 1;
                    for(let i = 0; i < a.axisCount; i++){
                        if (t[i] === 0) continue;
                        if (n[i] === 0) return 0;
                        if ((e & l0) === 0) {
                            if (n[i] < Math.min(0, t[i]) || n[i] > Math.max(0, t[i])) return 0;
                            l = (l * n[i] + Number.EPSILON) / (t[i] + Number.EPSILON);
                        } else {
                            if (n[i] < s[i] || n[i] > r[i]) return 0;
                            else if (n[i] < t[i]) l = l * (n[i] - s[i] + Number.EPSILON) / (t[i] - s[i] + Number.EPSILON);
                            else l = l * (r[i] - n[i] + Number.EPSILON) / (r[i] - t[i] + Number.EPSILON);
                        }
                    }
                    return l;
                }
                interpolateMissingDeltas(e, t, s) {
                    if (e.length === 0) return;
                    let r = 0;
                    while(r < e.length){
                        let n = r;
                        let a = r;
                        let l = e[a];
                        while(!l.endContour)l = e[++a];
                        while(r <= a && !s[r])r++;
                        if (r > a) continue;
                        let i = r;
                        let o = r;
                        r++;
                        while(r <= a){
                            if (s[r]) {
                                this.deltaInterpolate(o + 1, r - 1, o, r, t, e);
                                o = r;
                            }
                            r++;
                        }
                        if (o === i) this.deltaShift(n, a, o, t, e);
                        else {
                            this.deltaInterpolate(o + 1, a, o, i, t, e);
                            if (i > 0) this.deltaInterpolate(n, i - 1, o, i, t, e);
                        }
                        r = a + 1;
                    }
                }
                deltaInterpolate(e, t, s, r, n, a) {
                    if (e > t) return;
                    let l = [
                        "x",
                        "y"
                    ];
                    for(let i = 0; i < l.length; i++){
                        let o = l[i];
                        if (n[s][o] > n[r][o]) {
                            var u = s;
                            s = r;
                            r = u;
                        }
                        let c = n[s][o];
                        let f = n[r][o];
                        let h = a[s][o];
                        let d = a[r][o];
                        if (c !== f || h === d) {
                            let m = c === f ? 0 : (d - h) / (f - c);
                            for(let p = e; p <= t; p++){
                                let g = n[p][o];
                                if (g <= c) g += h - c;
                                else if (g >= f) g += d - f;
                                else g = h + (g - c) * m;
                                a[p][o] = g;
                            }
                        }
                    }
                }
                deltaShift(e, t, s, r, n) {
                    let a = n[s].x - r[s].x;
                    let l = n[s].y - r[s].y;
                    if (a === 0 && l === 0) return;
                    for(let i = e; i <= t; i++)if (i !== s) {
                        n[i].x += a;
                        n[i].y += l;
                    }
                }
                getAdvanceAdjustment(e, t) {
                    let s, r;
                    if (t.advanceWidthMapping) {
                        let n = e;
                        if (n >= t.advanceWidthMapping.mapCount) n = t.advanceWidthMapping.mapCount - 1;
                        let a = t.advanceWidthMapping.entryFormat;
                        ({ outerIndex: s , innerIndex: r  } = t.advanceWidthMapping.mapData[n]);
                    } else {
                        s = 0;
                        r = e;
                    }
                    return this.getDelta(t.itemVariationStore, s, r);
                }
                getDelta(e, t, s) {
                    if (t >= e.itemVariationData.length) return 0;
                    let r = e.itemVariationData[t];
                    if (s >= r.deltaSets.length) return 0;
                    let n = r.deltaSets[s];
                    let a = this.getBlendVector(e, t);
                    let l = 0;
                    for(let i = 0; i < r.regionIndexCount; i++)l += n.deltas[i] * a[i];
                    return l;
                }
                getBlendVector(e, t) {
                    let s = e.itemVariationData[t];
                    if (this.blendVectors.has(s)) return this.blendVectors.get(s);
                    let r = this.normalizedCoords;
                    let n = [];
                    for(let a = 0; a < s.regionIndexCount; a++){
                        let l = 1;
                        let i = s.regionIndexes[a];
                        let o = e.variationRegionList.variationRegions[i];
                        for(let u = 0; u < o.length; u++){
                            let c = o[u];
                            let f;
                            if (c.startCoord > c.peakCoord || c.peakCoord > c.endCoord) f = 1;
                            else if (c.startCoord < 0 && c.endCoord > 0 && c.peakCoord !== 0) f = 1;
                            else if (c.peakCoord === 0) f = 1;
                            else if (r[u] < c.startCoord || r[u] > c.endCoord) f = 0;
                            else {
                                if (r[u] === c.peakCoord) f = 1;
                                else if (r[u] < c.peakCoord) f = (r[u] - c.startCoord + Number.EPSILON) / (c.peakCoord - c.startCoord + Number.EPSILON);
                                else f = (c.endCoord - r[u] + Number.EPSILON) / (c.endCoord - c.peakCoord + Number.EPSILON);
                            }
                            l *= f;
                        }
                        n[a] = l;
                    }
                    this.blendVectors.set(s, n);
                    return n;
                }
                constructor(e, t){
                    this.font = e;
                    this.normalizedCoords = this.normalizeCoords(t);
                    this.blendVectors = new Map;
                }
            }
            const l8 = Promise.resolve();
            class ie {
                includeGlyph(e) {
                    if (typeof e === "object") e = e.id;
                    if (this.mapping[e] == null) {
                        this.glyphs.push(e);
                        this.mapping[e] = this.glyphs.length - 1;
                    }
                    return this.mapping[e];
                }
                constructor(e){
                    this.font = e;
                    this.glyphs = [];
                    this.mapping = {};
                    this.includeGlyph(0);
                }
            }
            const it = 1;
            const is = 2;
            const ir = 4;
            const ia = 8;
            const il = 16;
            const ii = 32;
            class io {
                static size(e) {
                    return e >= 0 && e <= 255 ? 1 : 2;
                }
                static encode(e, t) {
                    if (t >= 0 && t <= 255) e.writeUInt8(t);
                    else e.writeInt16BE(t);
                }
            }
            let iu = new r.AU({
                numberOfContours: r.Af,
                xMin: r.Af,
                yMin: r.Af,
                xMax: r.Af,
                yMax: r.Af,
                endPtsOfContours: new r.mJ(r.mL, "numberOfContours"),
                instructions: new r.mJ(r.w_, r.mL),
                flags: new r.mJ(r.w_, 0),
                xPoints: new r.mJ(io, 0),
                yPoints: new r.mJ(io, 0)
            });
            class ic {
                encodeSimple(e, t = []) {
                    let s = [];
                    let n = [];
                    let a = [];
                    let l = [];
                    let i = 0;
                    let o = 0, u = 0, c = 0;
                    let f = 0;
                    for(let h = 0; h < e.commands.length; h++){
                        let d = e.commands[h];
                        for(let m = 0; m < d.args.length; m += 2){
                            let p = d.args[m];
                            let g = d.args[m + 1];
                            let b = 0;
                            if (d.command === "quadraticCurveTo" && m === 2) {
                                let y = e.commands[h + 1];
                                if (y && y.command === "quadraticCurveTo") {
                                    let w = (o + y.args[0]) / 2;
                                    let x = (u + y.args[1]) / 2;
                                    if (p === w && g === x) continue;
                                }
                            }
                            if (!(d.command === "quadraticCurveTo" && m === 0)) b |= it;
                            b = this._encodePoint(p, o, n, b, is, il);
                            b = this._encodePoint(g, u, a, b, ir, ii);
                            if (b === c && i < 255) {
                                l[l.length - 1] |= ia;
                                i++;
                            } else {
                                if (i > 0) {
                                    l.push(i);
                                    i = 0;
                                }
                                l.push(b);
                                c = b;
                            }
                            o = p;
                            u = g;
                            f++;
                        }
                        if (d.command === "closePath") s.push(f - 1);
                    }
                    if (e.commands.length > 1 && e.commands[e.commands.length - 1].command !== "closePath") s.push(f - 1);
                    let v = e.bbox;
                    let _ = {
                        numberOfContours: s.length,
                        xMin: v.minX,
                        yMin: v.minY,
                        xMax: v.maxX,
                        yMax: v.maxY,
                        endPtsOfContours: s,
                        instructions: t,
                        flags: l,
                        xPoints: n,
                        yPoints: a
                    };
                    let L = iu.size(_);
                    let C = 4 - L % 4;
                    let A = new r.yy(L + C);
                    iu.encode(A, _);
                    if (C !== 0) A.fill(0, C);
                    return A.buffer;
                }
                _encodePoint(e, t, s, r, n, a) {
                    let l = e - t;
                    if (e === t) r |= a;
                    else {
                        if (-255 <= l && l <= 255) {
                            r |= n;
                            if (l < 0) l = -l;
                            else r |= a;
                        }
                        s.push(l);
                    }
                    return r;
                }
            }
            class ih extends (0, ie) {
                _addGlyph(e) {
                    let t = this.font.getGlyph(e);
                    let s = t._decode();
                    let r = this.font.loca.offsets[e];
                    let n = this.font.loca.offsets[e + 1];
                    let a = this.font._getTableStream("glyf");
                    a.pos += r;
                    let l = a.readBuffer(n - r);
                    if (s && s.numberOfContours < 0) {
                        l = new Uint8Array(l);
                        let i = new DataView(l.buffer);
                        for (let o of s.components){
                            e = this.includeGlyph(o.glyphID);
                            i.setUint16(o.pos, e);
                        }
                    } else if (s && this.font._variationProcessor) l = this.glyphEncoder.encodeSimple(t.path, s.instructions);
                    this.glyf.push(l);
                    this.loca.offsets.push(this.offset);
                    this.hmtx.metrics.push({
                        advance: t.advanceWidth,
                        bearing: t._getMetrics().leftBearing
                    });
                    this.offset += l.length;
                    return this.glyf.length - 1;
                }
                encode() {
                    this.glyf = [];
                    this.offset = 0;
                    this.loca = {
                        offsets: [],
                        version: this.font.loca.version
                    };
                    this.hmtx = {
                        metrics: [],
                        bearings: []
                    };
                    let e = 0;
                    while(e < this.glyphs.length)this._addGlyph(this.glyphs[e++]);
                    let t = (0, c)(this.font.maxp);
                    t.numGlyphs = this.glyf.length;
                    this.loca.offsets.push(this.offset);
                    let s = (0, c)(this.font.head);
                    s.indexToLocFormat = this.loca.version;
                    let r = (0, c)(this.font.hhea);
                    r.numberOfMetrics = this.hmtx.metrics.length;
                    return (0, rU).toBuffer({
                        tables: {
                            head: s,
                            hhea: r,
                            loca: this.loca,
                            maxp: t,
                            "cvt ": this.font["cvt "],
                            prep: this.font.prep,
                            glyf: this.glyf,
                            hmtx: this.hmtx,
                            fpgm: this.font.fpgm
                        }
                    });
                }
                constructor(e){
                    super(e);
                    this.glyphEncoder = new (0, ic);
                }
            }
            class id extends (0, ie) {
                subsetCharstrings() {
                    this.charstrings = [];
                    let e = {};
                    for (let t of this.glyphs){
                        this.charstrings.push(this.cff.getCharString(t));
                        let s = this.font.getGlyph(t);
                        let r = s.path;
                        for(let n in s._usedGsubrs)e[n] = true;
                    }
                    this.gsubrs = this.subsetSubrs(this.cff.globalSubrIndex, e);
                }
                subsetSubrs(e, t) {
                    let s = [];
                    for(let r = 0; r < e.length; r++){
                        let n = e[r];
                        if (t[r]) {
                            this.cff.stream.pos = n.offset;
                            s.push(this.cff.stream.readBuffer(n.length));
                        } else s.push(new Uint8Array([
                            11
                        ]));
                    }
                    return s;
                }
                subsetFontdict(e) {
                    e.FDArray = [];
                    e.FDSelect = {
                        version: 0,
                        fds: []
                    };
                    let t = {};
                    let s = [];
                    let r = {};
                    for (let n of this.glyphs){
                        let a = this.cff.fdForGlyph(n);
                        if (a == null) continue;
                        if (!t[a]) {
                            e.FDArray.push(Object.assign({}, this.cff.topDict.FDArray[a]));
                            s.push({});
                            r[a] = e.FDArray.length - 1;
                        }
                        t[a] = true;
                        e.FDSelect.fds.push(r[a]);
                        let l = this.font.getGlyph(n);
                        let i = l.path;
                        for(let o in l._usedSubrs)s[r[a]][o] = true;
                    }
                    for(let u = 0; u < e.FDArray.length; u++){
                        let c = e.FDArray[u];
                        delete c.FontName;
                        if (c.Private && c.Private.Subrs) {
                            c.Private = Object.assign({}, c.Private);
                            c.Private.Subrs = this.subsetSubrs(c.Private.Subrs, s[u]);
                        }
                    }
                    return;
                }
                createCIDFontdict(e) {
                    let t = {};
                    for (let s of this.glyphs){
                        let r = this.font.getGlyph(s);
                        let n = r.path;
                        for(let a in r._usedSubrs)t[a] = true;
                    }
                    let l = Object.assign({}, this.cff.topDict.Private);
                    if (this.cff.topDict.Private && this.cff.topDict.Private.Subrs) l.Subrs = this.subsetSubrs(this.cff.topDict.Private.Subrs, t);
                    e.FDArray = [
                        {
                            Private: l
                        }
                    ];
                    return e.FDSelect = {
                        version: 3,
                        nRanges: 1,
                        ranges: [
                            {
                                first: 0,
                                fd: 0
                            }
                        ],
                        sentinel: this.charstrings.length
                    };
                }
                addString(e) {
                    if (!e) return null;
                    if (!this.strings) this.strings = [];
                    this.strings.push(e);
                    return (0, eb).length + this.strings.length - 1;
                }
                encode() {
                    this.subsetCharstrings();
                    let e = {
                        version: this.charstrings.length > 255 ? 2 : 1,
                        ranges: [
                            {
                                first: 1,
                                nLeft: this.charstrings.length - 2
                            }
                        ]
                    };
                    let t = Object.assign({}, this.cff.topDict);
                    t.Private = null;
                    t.charset = e;
                    t.Encoding = null;
                    t.CharStrings = this.charstrings;
                    for (let s of [
                        "version",
                        "Notice",
                        "Copyright",
                        "FullName",
                        "FamilyName",
                        "Weight",
                        "PostScript",
                        "BaseFontName",
                        "FontName"
                    ])t[s] = this.addString(this.cff.string(t[s]));
                    t.ROS = [
                        this.addString("Adobe"),
                        this.addString("Identity"),
                        0
                    ];
                    t.CIDCount = this.charstrings.length;
                    if (this.cff.isCIDFont) this.subsetFontdict(t);
                    else this.createCIDFontdict(t);
                    let r = {
                        version: 1,
                        hdrSize: this.cff.hdrSize,
                        offSize: 4,
                        header: this.cff.header,
                        nameIndex: [
                            this.cff.postscriptName
                        ],
                        topDictIndex: [
                            t
                        ],
                        stringIndex: this.strings,
                        globalSubrIndex: this.gsubrs
                    };
                    return (0, tp).toBuffer(r);
                }
                constructor(e){
                    super(e);
                    this.cff = this.font["CFF "];
                    if (!this.cff) throw new Error("Not a CFF Font");
                }
            }
            class im {
                static probe(e) {
                    let t = (0, rO).decode(e.slice(0, 4));
                    return t === "true" || t === "OTTO" || t === String.fromCharCode(0, 1, 0, 0);
                }
                setDefaultLanguage(e = null) {
                    this.defaultLanguage = e;
                }
                _getTable(e) {
                    if (!(e.tag in this._tables)) try {
                        this._tables[e.tag] = this._decodeTable(e);
                    } catch (t) {
                        if (g) {
                            console.error(`Error decoding table ${e.tag}`);
                            console.error(t.stack);
                        }
                    }
                    return this._tables[e.tag];
                }
                _getTableStream(e) {
                    let t = this.directory.tables[e];
                    if (t) {
                        this.stream.pos = t.offset;
                        return this.stream;
                    }
                    return null;
                }
                _decodeDirectory() {
                    return this.directory = (0, rU).decode(this.stream, {
                        _startOffset: 0
                    });
                }
                _decodeTable(e) {
                    let t = this.stream.pos;
                    let s = this._getTableStream(e.tag);
                    let r = (0, rS)[e.tag].decode(s, this, e.length);
                    this.stream.pos = t;
                    return r;
                }
                getName(e, t = this.defaultLanguage || x) {
                    let s = this.name && this.name.records[e];
                    if (s) return s[t] || s[this.defaultLanguage] || s[x] || s["en"] || s[Object.keys(s)[0]] || null;
                    return null;
                }
                get postscriptName() {
                    return this.getName("postscriptName");
                }
                get fullName() {
                    return this.getName("fullName");
                }
                get familyName() {
                    return this.getName("fontFamily");
                }
                get subfamilyName() {
                    return this.getName("fontSubfamily");
                }
                get copyright() {
                    return this.getName("copyright");
                }
                get version() {
                    return this.getName("version");
                }
                get ascent() {
                    return this.hhea.ascent;
                }
                get descent() {
                    return this.hhea.descent;
                }
                get lineGap() {
                    return this.hhea.lineGap;
                }
                get underlinePosition() {
                    return this.post.underlinePosition;
                }
                get underlineThickness() {
                    return this.post.underlineThickness;
                }
                get italicAngle() {
                    return this.post.italicAngle;
                }
                get capHeight() {
                    let e = this["OS/2"];
                    return e ? e.capHeight : this.ascent;
                }
                get xHeight() {
                    let e = this["OS/2"];
                    return e ? e.xHeight : 0;
                }
                get numGlyphs() {
                    return this.maxp.numGlyphs;
                }
                get unitsPerEm() {
                    return this.head.unitsPerEm;
                }
                get bbox() {
                    return Object.freeze(new (0, rz)(this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax));
                }
                get _cmapProcessor() {
                    return new (0, rE)(this.cmap);
                }
                get characterSet() {
                    return this._cmapProcessor.getCharacterSet();
                }
                hasGlyphForCodePoint(e) {
                    return !!this._cmapProcessor.lookup(e);
                }
                glyphForCodePoint(e) {
                    return this.getGlyph(this._cmapProcessor.lookup(e), [
                        e
                    ]);
                }
                glyphsForString(e) {
                    let t = [];
                    let s = e.length;
                    let r = 0;
                    let n = -1;
                    let a = -1;
                    while(r <= s){
                        let l = 0;
                        let i = 0;
                        if (r < s) {
                            l = e.charCodeAt(r++);
                            if (0xd800 <= l && l <= 0xdbff && r < s) {
                                let o = e.charCodeAt(r);
                                if (0xdc00 <= o && o <= 0xdfff) {
                                    r++;
                                    l = ((l & 0x3ff) << 10) + (o & 0x3ff) + 0x10000;
                                }
                            }
                            i = 0xfe00 <= l && l <= 0xfe0f || 0xe0100 <= l && l <= 0xe01ef ? 1 : 0;
                        } else r++;
                        if (a === 0 && i === 1) t.push(this.getGlyph(this._cmapProcessor.lookup(n, l), [
                            n,
                            l
                        ]));
                        else if (a === 0 && i === 0) t.push(this.glyphForCodePoint(n));
                        n = l;
                        a = i;
                    }
                    return t;
                }
                get _layoutEngine() {
                    return new (0, ly)(this);
                }
                layout(e, t, s, r, n) {
                    return this._layoutEngine.layout(e, t, s, r, n);
                }
                stringsForGlyph(e) {
                    return this._layoutEngine.stringsForGlyph(e);
                }
                get availableFeatures() {
                    return this._layoutEngine.getAvailableFeatures();
                }
                getAvailableFeatures(e, t) {
                    return this._layoutEngine.getAvailableFeatures(e, t);
                }
                _getBaseGlyph(e, t = []) {
                    if (!this._glyphs[e]) {
                        if (this.directory.tables.glyf) this._glyphs[e] = new (0, lX)(e, t, this);
                        else if (this.directory.tables["CFF "] || this.directory.tables.CFF2) this._glyphs[e] = new (0, lq)(e, t, this);
                    }
                    return this._glyphs[e] || null;
                }
                getGlyph(e, t = []) {
                    if (!this._glyphs[e]) {
                        if (this.directory.tables.sbix) this._glyphs[e] = new (0, lj)(e, t, this);
                        else if (this.directory.tables.COLR && this.directory.tables.CPAL) this._glyphs[e] = new (0, l$)(e, t, this);
                        else this._getBaseGlyph(e, t);
                    }
                    return this._glyphs[e] || null;
                }
                createSubset() {
                    if (this.directory.tables["CFF "]) return new (0, id)(this);
                    return new (0, ih)(this);
                }
                get variationAxes() {
                    let e = {};
                    if (!this.fvar) return e;
                    for (let t of this.fvar.axis)e[t.axisTag.trim()] = {
                        name: t.name.en,
                        min: t.minValue,
                        default: t.defaultValue,
                        max: t.maxValue
                    };
                    return e;
                }
                get namedVariations() {
                    let e = {};
                    if (!this.fvar) return e;
                    for (let t of this.fvar.instance){
                        let s = {};
                        for(let r = 0; r < this.fvar.axis.length; r++){
                            let n = this.fvar.axis[r];
                            s[n.axisTag.trim()] = t.coord[r];
                        }
                        e[t.name.en] = s;
                    }
                    return e;
                }
                getVariation(e) {
                    if (!(this.directory.tables.fvar && (this.directory.tables.gvar && this.directory.tables.glyf || this.directory.tables.CFF2))) throw new Error("Variations require a font with the fvar, gvar and glyf, or CFF2 tables.");
                    if (typeof e === "string") e = this.namedVariations[e];
                    if (typeof e !== "object") throw new Error("Variation settings must be either a variation name or settings object.");
                    let t = this.fvar.axis.map((t, s)=>{
                        let r = t.axisTag.trim();
                        if (r in e) return Math.max(t.minValue, Math.min(t.maxValue, e[r]));
                        else return t.defaultValue;
                    });
                    let s = new r.fT(this.stream.buffer);
                    s.pos = this._directoryPos;
                    let n = new im(s, t);
                    n._tables = this._tables;
                    return n;
                }
                get _variationProcessor() {
                    if (!this.fvar) return null;
                    let e = this.variationCoords;
                    if (!e && !this.CFF2) return null;
                    if (!e) e = this.fvar.axis.map((e)=>e.defaultValue);
                    return new (0, l9)(this, e);
                }
                getFont(e) {
                    return this.getVariation(e);
                }
                constructor(e, t = null){
                    (0, n.Z)(this, "type", "TTF");
                    this.defaultLanguage = null;
                    this.stream = e;
                    this.variationCoords = t;
                    this._directoryPos = this.stream.pos;
                    this._tables = {};
                    this._glyphs = {};
                    this._decodeDirectory();
                    for(let s in this.directory.tables){
                        let r = this.directory.tables[s];
                        if ((0, rS)[s] && r.length > 0) Object.defineProperty(this, s, {
                            get: this._getTable.bind(this, r)
                        });
                    }
                }
            }
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "bbox", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "_cmapProcessor", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "characterSet", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "_layoutEngine", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "variationAxes", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "namedVariations", null);
            (0, a.__decorate)([
                (0, _)
            ], im.prototype, "_variationProcessor", null);
            let ip = new r.AU({
                tag: new r.Ld(4),
                offset: new r.$J(r.U7, "void", {
                    type: "global"
                }),
                compLength: r.U7,
                length: r.U7,
                origChecksum: r.U7
            });
            let ig = new r.AU({
                tag: new r.Ld(4),
                flavor: r.U7,
                length: r.U7,
                numTables: r.mL,
                reserved: new r.kV(r.mL),
                totalSfntSize: r.U7,
                majorVersion: r.mL,
                minorVersion: r.mL,
                metaOffset: r.U7,
                metaLength: r.U7,
                metaOrigLength: r.U7,
                privOffset: r.U7,
                privLength: r.U7,
                tables: new r.mJ(ip, "numTables")
            });
            ig.process = function() {
                let e = {};
                for (let t of this.tables)e[t.tag] = t;
                this.tables = e;
            };
            var ib = ig;
            class iy extends (0, im) {
                static probe(e) {
                    return (0, rO).decode(e.slice(0, 4)) === "wOFF";
                }
                _decodeDirectory() {
                    this.directory = (0, ib).decode(this.stream, {
                        _startOffset: 0
                    });
                }
                _getTableStream(e) {
                    let t = this.directory.tables[e];
                    if (t) {
                        this.stream.pos = t.offset;
                        if (t.compLength < t.length) {
                            this.stream.pos += 2;
                            let s = new Uint8Array(t.length);
                            let n = (0, f)(this.stream.readBuffer(t.compLength - 2), s);
                            return new r.fT(n);
                        } else return this.stream;
                    }
                    return null;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "WOFF");
                }
            }
            class iw extends (0, lX) {
                _decode() {
                    return this._font._transformedGlyphs[this.id];
                }
                _getCBox() {
                    return this.path.bbox;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "WOFF2");
                }
            }
            const ix = {
                decode (e) {
                    let t = 0;
                    let s = [
                        0,
                        1,
                        2,
                        3,
                        4
                    ];
                    for(let r = 0; r < s.length; r++){
                        let n = s[r];
                        let a = e.readUInt8();
                        if (t & 0xe0000000) throw new Error("Overflow");
                        t = t << 7 | a & 0x7f;
                        if ((a & 0x80) === 0) return t;
                    }
                    throw new Error("Bad base 128 number");
                }
            };
            let iv = [
                "cmap",
                "head",
                "hhea",
                "hmtx",
                "maxp",
                "name",
                "OS/2",
                "post",
                "cvt ",
                "fpgm",
                "glyf",
                "loca",
                "prep",
                "CFF ",
                "VORG",
                "EBDT",
                "EBLC",
                "gasp",
                "hdmx",
                "kern",
                "LTSH",
                "PCLT",
                "VDMX",
                "vhea",
                "vmtx",
                "BASE",
                "GDEF",
                "GPOS",
                "GSUB",
                "EBSC",
                "JSTF",
                "MATH",
                "CBDT",
                "CBLC",
                "COLR",
                "CPAL",
                "SVG ",
                "sbix",
                "acnt",
                "avar",
                "bdat",
                "bloc",
                "bsln",
                "cvar",
                "fdsc",
                "feat",
                "fmtx",
                "fvar",
                "gvar",
                "hsty",
                "just",
                "lcar",
                "mort",
                "morx",
                "opbd",
                "prop",
                "trak",
                "Zapf",
                "Silf",
                "Glat",
                "Gloc",
                "Feat",
                "Sill"
            ];
            let i_ = new r.AU({
                flags: r.w_,
                customTag: new r.Fi(new r.Ld(4), (e)=>(e.flags & 0x3f) === 0x3f),
                tag: (e)=>e.customTag || iv[e.flags & 0x3f],
                length: ix,
                transformVersion: (e)=>e.flags >>> 6 & 0x03,
                transformed: (e)=>e.tag === "glyf" || e.tag === "loca" ? e.transformVersion === 0 : e.transformVersion !== 0,
                transformLength: new r.Fi(ix, (e)=>e.transformed)
            });
            let iL = new r.AU({
                tag: new r.Ld(4),
                flavor: r.U7,
                length: r.U7,
                numTables: r.mL,
                reserved: new r.kV(r.mL),
                totalSfntSize: r.U7,
                totalCompressedSize: r.U7,
                majorVersion: r.mL,
                minorVersion: r.mL,
                metaOffset: r.U7,
                metaLength: r.U7,
                metaOrigLength: r.U7,
                privOffset: r.U7,
                privLength: r.U7,
                tables: new r.mJ(i_, "numTables")
            });
            iL.process = function() {
                let e = {};
                for(let t = 0; t < this.tables.length; t++){
                    let s = this.tables[t];
                    e[s.tag] = s;
                }
                return this.tables = e;
            };
            var iC = iL;
            class iA extends (0, im) {
                static probe(e) {
                    return (0, rO).decode(e.slice(0, 4)) === "wOF2";
                }
                _decodeDirectory() {
                    this.directory = (0, iC).decode(this.stream);
                    this._dataPos = this.stream.pos;
                }
                _decompress() {
                    if (!this._decompressed) {
                        this.stream.pos = this._dataPos;
                        let e = this.stream.readBuffer(this.directory.totalCompressedSize);
                        let t = 0;
                        for(let s in this.directory.tables){
                            let n = this.directory.tables[s];
                            n.offset = t;
                            t += n.transformLength != null ? n.transformLength : n.length;
                        }
                        let a = (0, h)(e, t);
                        if (!a) throw new Error("Error decoding compressed data in WOFF2");
                        this.stream = new r.fT(a);
                        this._decompressed = true;
                    }
                }
                _decodeTable(e) {
                    this._decompress();
                    return super._decodeTable(e);
                }
                _getBaseGlyph(e, t = []) {
                    if (!this._glyphs[e]) {
                        if (this.directory.tables.glyf && this.directory.tables.glyf.transformed) {
                            if (!this._transformedGlyphs) this._transformGlyfTable();
                            return this._glyphs[e] = new (0, iw)(e, t, this);
                        } else return super._getBaseGlyph(e, t);
                    }
                }
                _transformGlyfTable() {
                    this._decompress();
                    this.stream.pos = this.directory.tables.glyf.offset;
                    let e = iS.decode(this.stream);
                    let t = [];
                    for(let s = 0; s < e.numGlyphs; s++){
                        let r = {};
                        let n = e.nContours.readInt16BE();
                        r.numberOfContours = n;
                        if (n > 0) {
                            let a = [];
                            let l = 0;
                            for(let i = 0; i < n; i++){
                                let o = iT(e.nPoints);
                                l += o;
                                a.push(l);
                            }
                            r.points = iF(e.flags, e.glyphs, l);
                            for(let u = 0; u < n; u++)r.points[a[u] - 1].endContour = true;
                            var c = iT(e.glyphs);
                        } else if (n < 0) {
                            let f = (0, lX).prototype._decodeComposite.call({
                                _font: this
                            }, r, e.composites);
                            if (f) var c = iT(e.glyphs);
                        }
                        t.push(r);
                    }
                    this._transformedGlyphs = t;
                }
                constructor(...e){
                    super(...e);
                    (0, n.Z)(this, "type", "WOFF2");
                }
            }
            class ik {
                decode(e, t) {
                    return new r.fT(this._buf.decode(e, t));
                }
                constructor(e){
                    this.length = e;
                    this._buf = new r.lW(e);
                }
            }
            let iS = new r.AU({
                version: r.U7,
                numGlyphs: r.mL,
                indexFormat: r.mL,
                nContourStreamSize: r.U7,
                nPointsStreamSize: r.U7,
                flagStreamSize: r.U7,
                glyphStreamSize: r.U7,
                compositeStreamSize: r.U7,
                bboxStreamSize: r.U7,
                instructionStreamSize: r.U7,
                nContours: new ik("nContourStreamSize"),
                nPoints: new ik("nPointsStreamSize"),
                flags: new ik("flagStreamSize"),
                glyphs: new ik("glyphStreamSize"),
                composites: new ik("compositeStreamSize"),
                bboxes: new ik("bboxStreamSize"),
                instructions: new ik("instructionStreamSize")
            });
            const iI = 253;
            const iP = 254;
            const iU = 255;
            const iJ = 253;
            function iT(e) {
                let t = e.readUInt8();
                if (t === iI) return e.readUInt16BE();
                if (t === iU) return e.readUInt8() + iJ;
                if (t === iP) return e.readUInt8() + iJ * 2;
                return t;
            }
            function iO(e, t) {
                return e & 1 ? t : -t;
            }
            function iF(e, t, s) {
                let r;
                let n = r = 0;
                let a = [];
                for(let l = 0; l < s; l++){
                    let i = 0, o = 0;
                    let u = e.readUInt8();
                    let c = !(u >> 7);
                    u &= 0x7f;
                    if (u < 10) {
                        i = 0;
                        o = iO(u, ((u & 14) << 7) + t.readUInt8());
                    } else if (u < 20) {
                        i = iO(u, ((u - 10 & 14) << 7) + t.readUInt8());
                        o = 0;
                    } else if (u < 84) {
                        var f = u - 20;
                        var h = t.readUInt8();
                        i = iO(u, 1 + (f & 0x30) + (h >> 4));
                        o = iO(u >> 1, 1 + ((f & 0x0c) << 2) + (h & 0x0f));
                    } else if (u < 120) {
                        var f = u - 84;
                        i = iO(u, 1 + (f / 12 << 8) + t.readUInt8());
                        o = iO(u >> 1, 1 + (f % 12 >> 2 << 8) + t.readUInt8());
                    } else if (u < 124) {
                        var h = t.readUInt8();
                        let d = t.readUInt8();
                        i = iO(u, (h << 4) + (d >> 4));
                        o = iO(u >> 1, ((d & 0x0f) << 8) + t.readUInt8());
                    } else {
                        i = iO(u, t.readUInt16BE());
                        o = iO(u >> 1, t.readUInt16BE());
                    }
                    n += i;
                    r += o;
                    a.push(new (0, lN)(c, false, n, r));
                }
                return a;
            }
            let iD = new r.bS(r.U7, {
                0x00010000: {
                    numFonts: r.U7,
                    offsets: new r.mJ(r.U7, "numFonts")
                },
                0x00020000: {
                    numFonts: r.U7,
                    offsets: new r.mJ(r.U7, "numFonts"),
                    dsigTag: r.U7,
                    dsigLength: r.U7,
                    dsigOffset: r.U7
                }
            });
            class iM {
                static probe(e) {
                    return (0, rO).decode(e.slice(0, 4)) === "ttcf";
                }
                getFont(e) {
                    for (let t of this.header.offsets){
                        let s = new r.fT(this.stream.buffer);
                        s.pos = t;
                        let n = new (0, im)(s);
                        if (n.postscriptName === e || n.postscriptName instanceof Uint8Array && e instanceof Uint8Array && n.postscriptName.every((t, s)=>e[s] === t)) return n;
                    }
                    return null;
                }
                get fonts() {
                    let e = [];
                    for (let t of this.header.offsets){
                        let s = new r.fT(this.stream.buffer);
                        s.pos = t;
                        e.push(new (0, im)(s));
                    }
                    return e;
                }
                constructor(e){
                    (0, n.Z)(this, "type", "TTC");
                    this.stream = e;
                    if (e.readString(4) !== "ttcf") throw new Error("Not a TrueType collection");
                    this.header = iD.decode(e);
                }
            }
            let iG = new r.Ld(r.w_);
            let iE = new r.AU({
                len: r.U7,
                buf: new r.lW("len")
            });
            let iB = new r.AU({
                id: r.mL,
                nameOffset: r.Af,
                attr: r.w_,
                dataOffset: r.Un,
                handle: r.U7
            });
            let iV = new r.AU({
                name: new r.Ld(4),
                maxTypeIndex: r.mL,
                refList: new r.$J(r.mL, new r.mJ(iB, (e)=>e.maxTypeIndex + 1), {
                    type: "parent"
                })
            });
            let iz = new r.AU({
                length: r.mL,
                types: new r.mJ(iV, (e)=>e.length + 1)
            });
            let iR = new r.AU({
                reserved: new r.kV(r.w_, 24),
                typeList: new r.$J(r.mL, iz),
                nameListOffset: new r.$J(r.mL, "void")
            });
            let iN = new r.AU({
                dataOffset: r.U7,
                map: new r.$J(r.U7, iR),
                dataLength: r.U7,
                mapLength: r.U7
            });
            class iW {
                static probe(e) {
                    let t = new r.fT(e);
                    try {
                        var s = iN.decode(t);
                    } catch (n) {
                        return false;
                    }
                    for (let a of s.map.typeList.types){
                        if (a.name === "sfnt") return true;
                    }
                    return false;
                }
                getFont(e) {
                    if (!this.sfnt) return null;
                    for (let t of this.sfnt.refList){
                        let s = this.header.dataOffset + t.dataOffset + 4;
                        let n = new r.fT(this.stream.buffer.slice(s));
                        let a = new (0, im)(n);
                        if (a.postscriptName === e || a.postscriptName instanceof Uint8Array && e instanceof Uint8Array && a.postscriptName.every((t, s)=>e[s] === t)) return a;
                    }
                    return null;
                }
                get fonts() {
                    let e = [];
                    for (let t of this.sfnt.refList){
                        let s = this.header.dataOffset + t.dataOffset + 4;
                        let n = new r.fT(this.stream.buffer.slice(s));
                        e.push(new (0, im)(n));
                    }
                    return e;
                }
                constructor(e){
                    (0, n.Z)(this, "type", "DFont");
                    this.stream = e;
                    this.header = iN.decode(this.stream);
                    for (let t of this.header.map.typeList.types){
                        for (let s of t.refList)if (s.nameOffset >= 0) {
                            this.stream.pos = s.nameOffset + this.header.map.nameListOffset;
                            s.name = iG.decode(this.stream);
                        } else s.name = null;
                        if (t.name === "sfnt") this.sfnt = t;
                    }
                }
            }
            (0, y)((0, im));
            (0, y)((0, iy));
            (0, y)((0, iA));
            (0, y)((0, iM));
            (0, y)((0, iW));
        })
    }
]);
