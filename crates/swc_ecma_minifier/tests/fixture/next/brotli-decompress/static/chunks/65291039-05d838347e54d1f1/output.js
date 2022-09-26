"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        111
    ],
    {
        4201: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                Ue: function() {
                    return $d636bc798e7178db$export$185802fd694ee1f5;
                }
            });
            var restructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8396), _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4924), _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(655), fast_deep_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4063), unicode_properties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5915), unicode_trie__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7055), dfa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1478), clone__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6313), tiny_inflate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(311), brotli_decompress_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7709);
            function $parcel$export(e, n, v, s) {
                Object.defineProperty(e, n, {
                    get: v,
                    set: s,
                    enumerable: !0,
                    configurable: !0
                });
            }
            function $parcel$interopDefault(a) {
                return a && a.__esModule ? a.default : a;
            }
            var $d636bc798e7178db$exports = {};
            $parcel$export($d636bc798e7178db$exports, "logErrors", ()=>$d636bc798e7178db$export$bd5c5d8b8dcafd78), $parcel$export($d636bc798e7178db$exports, "registerFormat", ()=>$d636bc798e7178db$export$36b2f24e97d43be), $parcel$export($d636bc798e7178db$exports, "create", ()=>$d636bc798e7178db$export$185802fd694ee1f5), $parcel$export($d636bc798e7178db$exports, "defaultLanguage", ()=>$d636bc798e7178db$export$42940898df819940), $parcel$export($d636bc798e7178db$exports, "setDefaultLanguage", ()=>$d636bc798e7178db$export$5157e7780d44cc36);
            let $d636bc798e7178db$export$bd5c5d8b8dcafd78 = !1, $d636bc798e7178db$var$formats = [];
            function $d636bc798e7178db$export$36b2f24e97d43be(format) {
                $d636bc798e7178db$var$formats.push(format);
            }
            function $d636bc798e7178db$export$185802fd694ee1f5(buffer, postscriptName) {
                for(let i = 0; i < $d636bc798e7178db$var$formats.length; i++){
                    let format = $d636bc798e7178db$var$formats[i];
                    if (format.probe(buffer)) {
                        let font = new format(new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(buffer));
                        if (postscriptName) return font.getFont(postscriptName);
                        return font;
                    }
                }
                throw Error("Unknown font format");
            }
            let $d636bc798e7178db$export$42940898df819940 = "en";
            function $d636bc798e7178db$export$5157e7780d44cc36(lang = "en") {
                $d636bc798e7178db$export$42940898df819940 = lang;
            }
            function $e71565f2ce09cb6b$export$69a3209f1a06c04d(target, key1, descriptor) {
                if (descriptor.get) {
                    let get = descriptor.get;
                    descriptor.get = function() {
                        let value = get.call(this);
                        return Object.defineProperty(this, key1, {
                            value: value
                        }), value;
                    };
                } else if ("function" == typeof descriptor.value) {
                    let fn = descriptor.value;
                    return {
                        get () {
                            let cache1 = new Map;
                            function memoized(...args) {
                                let key = args.length > 0 ? args[0] : "value";
                                if (cache1.has(key)) return cache1.get(key);
                                let result = fn.apply(this, args);
                                return cache1.set(key, result), result;
                            }
                            return Object.defineProperty(this, key1, {
                                value: memoized
                            }), memoized;
                        }
                    };
                }
            }
            let $26a62205ad06574e$var$SubHeader = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                firstCode: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                entryCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                idDelta: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                idRangeOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $26a62205ad06574e$var$CmapGroup = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                startCharCode: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                endCharCode: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                glyphID: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $26a62205ad06574e$var$UnicodeValueRange = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                startUnicodeValue: restructure__WEBPACK_IMPORTED_MODULE_0__.Un,
                additionalCount: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $26a62205ad06574e$var$UVSMapping = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                unicodeValue: restructure__WEBPACK_IMPORTED_MODULE_0__.Un,
                glyphID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $26a62205ad06574e$var$DefaultUVS = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($26a62205ad06574e$var$UnicodeValueRange, restructure__WEBPACK_IMPORTED_MODULE_0__.U7), $26a62205ad06574e$var$NonDefaultUVS = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($26a62205ad06574e$var$UVSMapping, restructure__WEBPACK_IMPORTED_MODULE_0__.U7), $26a62205ad06574e$var$VarSelectorRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                varSelector: restructure__WEBPACK_IMPORTED_MODULE_0__.Un,
                defaultUVS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $26a62205ad06574e$var$DefaultUVS, {
                    type: "parent"
                }),
                nonDefaultUVS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $26a62205ad06574e$var$NonDefaultUVS, {
                    type: "parent"
                })
            }), $26a62205ad06574e$var$CmapSubtable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                0: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    codeMap: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, 256)
                },
                2: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    subHeaderKeys: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, 256),
                    subHeaderCount: (t)=>Math.max.apply(Math, t.subHeaderKeys),
                    subHeaders: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($26a62205ad06574e$var$SubHeader, "subHeaderCount"),
                    glyphIndexArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "subHeaderCount")
                },
                4: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    segCountX2: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    segCount: (t)=>t.segCountX2 >> 1,
                    searchRange: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    entrySelector: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    rangeShift: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    endCode: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "segCount"),
                    reservedPad: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    startCode: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "segCount"),
                    idDelta: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, "segCount"),
                    idRangeOffset: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "segCount"),
                    glyphIndexArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>(t.length - t._currentOffset) / 2)
                },
                6: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    firstCode: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    entryCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyphIndices: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "entryCount")
                },
                8: {
                    reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    is32: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, 8192),
                    nGroups: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    groups: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($26a62205ad06574e$var$CmapGroup, "nGroups")
                },
                10: {
                    reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    firstCode: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    entryCount: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    glyphIndices: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numChars")
                },
                12: {
                    reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    nGroups: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    groups: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($26a62205ad06574e$var$CmapGroup, "nGroups")
                },
                13: {
                    reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    language: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    nGroups: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    groups: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($26a62205ad06574e$var$CmapGroup, "nGroups")
                },
                14: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    numRecords: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    varSelectors: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($26a62205ad06574e$var$VarSelectorRecord, "numRecords")
                }
            }), $26a62205ad06574e$var$CmapEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                platformID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                encodingID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                table: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $26a62205ad06574e$var$CmapSubtable, {
                    type: "parent",
                    lazy: !0
                })
            });
            var $26a62205ad06574e$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numSubtables: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($26a62205ad06574e$var$CmapEntry, "numSubtables")
            }), $f2612a29f92ac062$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.LB,
                revision: restructure__WEBPACK_IMPORTED_MODULE_0__.LB,
                checkSumAdjustment: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                magicNumber: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                unitsPerEm: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                created: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.LB, 2),
                modified: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.LB, 2),
                xMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                macStyle: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
                    "bold",
                    "italic",
                    "underline",
                    "outline",
                    "shadow",
                    "condensed",
                    "extended"
                ]),
                lowestRecPPEM: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                fontDirectionHint: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                indexToLocFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                glyphDataFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            }), $2c179dd593583073$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.LB,
                ascent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                descent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                lineGap: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                advanceWidthMax: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minLeftSideBearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                minRightSideBearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMaxExtent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretSlopeRise: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretSlopeRun: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, 4),
                metricDataFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                numberOfMetrics: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            });
            let $bdc9060542264b85$var$HmtxEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                advance: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                bearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            });
            var $bdc9060542264b85$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                metrics: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($bdc9060542264b85$var$HmtxEntry, (t)=>t.parent.hhea.numberOfMetrics),
                bearings: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, (t)=>t.parent.maxp.numGlyphs - t.parent.hhea.numberOfMetrics)
            }), $dbf51cb3d3fe409d$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.LB,
                numGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxPoints: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxContours: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxComponentPoints: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxComponentContours: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxZones: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxTwilightPoints: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxStorage: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxFunctionDefs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxInstructionDefs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxStackElements: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxSizeOfInstructions: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxComponentElements: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                maxComponentDepth: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            });
            function $e449ad78d50845fe$export$badc544e0651b6b1(platformID, encodingID, languageID = 0) {
                return 1 === platformID && $e449ad78d50845fe$export$479e671907f486d1[languageID] ? $e449ad78d50845fe$export$479e671907f486d1[languageID] : $e449ad78d50845fe$export$6fef87b7618bdf0b[platformID][encodingID];
            }
            const $e449ad78d50845fe$var$SINGLE_BYTE_ENCODINGS = new Set([
                "x-mac-roman",
                "x-mac-cyrillic",
                "iso-8859-6",
                "iso-8859-8"
            ]), $e449ad78d50845fe$var$MAC_ENCODINGS = {
                "x-mac-croatian": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\u0160\u2122\xb4\xa8\u2260\u017D\xd8\u221E\xb1\u2264\u2265\u2206\xb5\u2202\u2211\u220F\u0161\u222B\xaa\xba\u03A9\u017E\xf8\xbf\xa1\xac\u221A\u0192\u2248\u0106\xab\u010C\u2026 \xc0\xc3\xd5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\uF8FF\xa9\u2044\u20AC\u2039\u203A\xc6\xbb\u2013\xb7\u201A\u201E\u2030\xc2\u0107\xc1\u010D\xc8\xcd\xce\xcf\xcc\xd3\xd4\u0111\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u03C0\xcb\u02DA\xb8\xca\xe6\u02C7",
                "x-mac-gaelic": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u1E02\xb1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xe6\xf8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xff\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xb7\u1EF2\u1EF3\u204A\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\u2663\xd2\xda\xdb\xd9\u0131\xdd\xfd\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83",
                "x-mac-greek": "\xc4\xb9\xb2\xc9\xb3\xd6\xdc\u0385\xe0\xe2\xe4\u0384\xa8\xe7\xe9\xe8\xea\xeb\xa3\u2122\xee\xef\u2022\xbd\u2030\xf4\xf6\xa6\u20AC\xf9\xfb\xfc\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xdf\xae\xa9\u03A3\u03AA\xa7\u2260\xb0\xb7\u0391\xb1\u2264\u2265\xa5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xac\u039F\u03A1\u2248\u03A4\xab\xbb\u2026 \u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xf7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xad",
                "x-mac-icelandic": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\xdd\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\xe6\xf8\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u2044\u20AC\xd0\xf0\xde\xfe\xfd\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7",
                "x-mac-inuit": "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xb0\u14A1\u14A5\u14A6\u2022\xb6\u14A7\xae\xa9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026 \u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142",
                "x-mac-ce": "\xc4\u0100\u0101\xc9\u0104\xd6\xdc\xe1\u0105\u010C\xe4\u010D\u0106\u0107\xe9\u0179\u017A\u010E\xed\u010F\u0112\u0113\u0116\xf3\u0117\xf4\xf6\xf5\xfa\u011A\u011B\xfc\u2020\xb0\u0118\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\u0119\xa8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xac\u221A\u0144\u0147\u2206\xab\xbb\u2026 \u0148\u0150\xd5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xc1\u0164\u0165\xcd\u017D\u017E\u016A\xd3\xd4\u016B\u016E\xda\u016F\u0170\u0171\u0172\u0173\xdd\xfd\u0137\u017B\u0141\u017C\u0122\u02C7",
                "x-mac-romanian": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\u0102\u0218\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\u0103\u0219\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\u0131\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7",
                "x-mac-turkish": "\xc4\xc5\xc7\xc9\xd1\xd6\xdc\xe1\xe0\xe2\xe4\xe3\xe5\xe7\xe9\xe8\xea\xeb\xed\xec\xee\xef\xf1\xf3\xf2\xf4\xf6\xf5\xfa\xf9\xfb\xfc\u2020\xb0\xa2\xa3\xa7\u2022\xb6\xdf\xae\xa9\u2122\xb4\xa8\u2260\xc6\xd8\u221E\xb1\u2264\u2265\xa5\xb5\u2202\u2211\u220F\u03C0\u222B\xaa\xba\u03A9\xe6\xf8\xbf\xa1\xac\u221A\u0192\u2248\u2206\xab\xbb\u2026 \xc0\xc3\xd5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xf7\u25CA\xff\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xb7\u201A\u201E\u2030\xc2\xca\xc1\xcb\xc8\xcd\xce\xcf\xcc\xd3\xd4\uF8FF\xd2\xda\xdb\xd9\uF8A0\u02C6\u02DC\xaf\u02D8\u02D9\u02DA\xb8\u02DD\u02DB\u02C7"
            }, $e449ad78d50845fe$var$encodingCache = new Map();
            function $e449ad78d50845fe$export$1dceb3c14ed68bee(encoding) {
                let cached = $e449ad78d50845fe$var$encodingCache.get(encoding);
                if (cached) return cached;
                let mapping = $e449ad78d50845fe$var$MAC_ENCODINGS[encoding];
                if (mapping) {
                    let res = new Map();
                    for(let i = 0; i < mapping.length; i++)res.set(mapping.charCodeAt(i), 0x80 + i);
                    return $e449ad78d50845fe$var$encodingCache.set(encoding, res), res;
                }
                if ($e449ad78d50845fe$var$SINGLE_BYTE_ENCODINGS.has(encoding)) {
                    let decoder = new TextDecoder(encoding), mapping1 = new Uint8Array(0x80);
                    for(let i1 = 0; i1 < 0x80; i1++)mapping1[i1] = 0x80 + i1;
                    let res1 = new Map(), s = decoder.decode(mapping1);
                    for(let i11 = 0; i11 < 0x80; i11++)res1.set(s.charCodeAt(i11), 0x80 + i11);
                    return $e449ad78d50845fe$var$encodingCache.set(encoding, res1), res1;
                }
            }
            const $e449ad78d50845fe$export$6fef87b7618bdf0b = [
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
            ], $e449ad78d50845fe$export$479e671907f486d1 = {
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
            }, $e449ad78d50845fe$export$2092376fd002e13 = [
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
            let $2bcf221753ec8e32$var$NameRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                platformID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                encodingID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                languageID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nameID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                string: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld("length", (t)=>$e449ad78d50845fe$export$badc544e0651b6b1(t.platformID, t.encodingID, t.languageID)), {
                    type: "parent",
                    relativeTo: (ctx)=>ctx.parent.stringOffset,
                    allowNull: !1
                })
            }), $2bcf221753ec8e32$var$LangTagRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld("length", "utf16be"), {
                    type: "parent",
                    relativeTo: (ctx)=>ctx.stringOffset
                })
            });
            var $2bcf221753ec8e32$var$NameTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                0: {
                    count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    stringOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    records: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($2bcf221753ec8e32$var$NameRecord, "count")
                },
                1: {
                    count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    stringOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    records: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($2bcf221753ec8e32$var$NameRecord, "count"),
                    langTagCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    langTags: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($2bcf221753ec8e32$var$LangTagRecord, "langTagCount")
                }
            });
            const $2bcf221753ec8e32$var$NAMES = [
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
            $2bcf221753ec8e32$var$NameTable.process = function(stream) {
                var records = {};
                for (let record of this.records){
                    let language = $e449ad78d50845fe$export$2092376fd002e13[record.platformID][record.languageID];
                    null == language && null != this.langTags && record.languageID >= 0x8000 && (language = this.langTags[record.languageID - 0x8000].tag), null == language && (language = record.platformID + "-" + record.languageID);
                    let key = record.nameID >= 256 ? "fontFeatures" : $2bcf221753ec8e32$var$NAMES[record.nameID] || record.nameID;
                    null == records[key] && (records[key] = {});
                    let obj = records[key];
                    record.nameID >= 256 && (obj = obj[record.nameID] || (obj[record.nameID] = {})), ("string" == typeof record.string || "string" != typeof obj[language]) && (obj[language] = record.string);
                }
                this.records = records;
            }, $2bcf221753ec8e32$var$NameTable.preEncode = function() {
                if (Array.isArray(this.records)) return;
                this.version = 0;
                let records = [];
                for(let key in this.records){
                    let val = this.records[key];
                    "fontFeatures" !== key && (records.push({
                        platformID: 3,
                        encodingID: 1,
                        languageID: 0x409,
                        nameID: $2bcf221753ec8e32$var$NAMES.indexOf(key),
                        length: 2 * val.en.length,
                        string: val.en
                    }), "postscriptName" === key && records.push({
                        platformID: 1,
                        encodingID: 0,
                        languageID: 0,
                        nameID: $2bcf221753ec8e32$var$NAMES.indexOf(key),
                        length: val.en.length,
                        string: val.en
                    }));
                }
                this.records = records, this.count = records.length, this.stringOffset = $2bcf221753ec8e32$var$NameTable.size(this, null, !1);
            };
            var $84b272aa31b70606$var$OS2 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                header: {
                    xAvgCharWidth: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    usWeightClass: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    usWidthClass: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    fsType: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
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
                    ySubscriptXSize: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySubscriptYSize: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySubscriptXOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySubscriptYOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySuperscriptXSize: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySuperscriptYSize: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySuperscriptXOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    ySuperscriptYOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    yStrikeoutSize: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    yStrikeoutPosition: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    sFamilyClass: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    panose: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, 10),
                    ulCharRange: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, 4),
                    vendorID: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                    fsSelection: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
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
                    usFirstCharIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    usLastCharIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                0: {},
                1: {
                    typoAscender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoDescender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoLineGap: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    winAscent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    winDescent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    codePageRange: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, 2)
                },
                2: {
                    typoAscender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoDescender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoLineGap: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    winAscent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    winDescent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    codePageRange: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, 2),
                    xHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    capHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    defaultChar: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    breakChar: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    maxContent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                5: {
                    typoAscender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoDescender: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    typoLineGap: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    winAscent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    winDescent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    codePageRange: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, 2),
                    xHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    capHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    defaultChar: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    breakChar: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    maxContent: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    usLowerOpticalPointSize: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    usUpperOpticalPointSize: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                }
            });
            let $84b272aa31b70606$var$versions = $84b272aa31b70606$var$OS2.versions;
            $84b272aa31b70606$var$versions[3] = $84b272aa31b70606$var$versions[4] = $84b272aa31b70606$var$versions[2];
            var $32d9e2eb9565d93c$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.E2, {
                header: {
                    italicAngle: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    underlinePosition: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    underlineThickness: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    isFixedPitch: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    minMemType42: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    maxMemType42: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    minMemType1: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    maxMemType1: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
                },
                1: {},
                2: {
                    numberOfGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyphNameIndex: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numberOfGlyphs"),
                    names: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(restructure__WEBPACK_IMPORTED_MODULE_0__.w_))
                },
                2.5: {
                    numberOfGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, "numberOfGlyphs")
                },
                3: {},
                4: {
                    map: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, (t)=>t.parent.maxp.numGlyphs)
                }
            }), $5202bd9d9ad8eaac$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                controlValues: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.Af)
            }), $5c0f37ca5ffb1850$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                instructions: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_)
            });
            let $2b2b260902b1c57e$var$loca = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("head.indexToLocFormat", {
                0: {
                    offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL)
                },
                1: {
                    offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7)
                }
            });
            $2b2b260902b1c57e$var$loca.process = function() {
                if (0 === this.version && !this._processed) {
                    for(let i = 0; i < this.offsets.length; i++)this.offsets[i] <<= 1;
                    this._processed = !0;
                }
            }, $2b2b260902b1c57e$var$loca.preEncode = function() {
                if (0 === this.version && !1 !== this._processed) {
                    for(let i = 0; i < this.offsets.length; i++)this.offsets[i] >>>= 1;
                    this._processed = !1;
                }
            };
            var $7afb878c7bea4f66$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                controlValueProgram: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_)
            }), $6c92b6371bce8bd9$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.lW);
            class $43e9821ef3717eec$export$2e2bcd8739ae039 {
                getCFFVersion(ctx) {
                    for(; ctx && !ctx.hdrSize;)ctx = ctx.parent;
                    return ctx ? ctx.version : -1;
                }
                decode(stream, parent) {
                    let offsetType, count = this.getCFFVersion(parent) >= 2 ? stream.readUInt32BE() : stream.readUInt16BE();
                    if (0 === count) return [];
                    let offSize = stream.readUInt8();
                    if (1 === offSize) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.w_;
                    else if (2 === offSize) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL;
                    else if (3 === offSize) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.Un;
                    else if (4 === offSize) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.U7;
                    else throw Error(`Bad offset size in CFFIndex: ${offSize} ${stream.pos}`);
                    let ret = [], startPos = stream.pos + (count + 1) * offSize - 1, start = offsetType.decode(stream);
                    for(let i = 0; i < count; i++){
                        let end = offsetType.decode(stream);
                        if (null != this.type) {
                            let pos = stream.pos;
                            stream.pos = startPos + start, parent.length = end - start, ret.push(this.type.decode(stream, parent)), stream.pos = pos;
                        } else ret.push({
                            offset: startPos + start,
                            length: end - start
                        });
                        start = end;
                    }
                    return stream.pos = startPos + start, ret;
                }
                size(arr, parent) {
                    let offsetType, size = 2;
                    if (0 === arr.length) return size;
                    let type = this.type || new restructure__WEBPACK_IMPORTED_MODULE_0__.lW, offset = 1;
                    for(let i = 0; i < arr.length; i++){
                        let item = arr[i];
                        offset += type.size(item, parent);
                    }
                    if (offset <= 0xff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.w_;
                    else if (offset <= 0xffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL;
                    else if (offset <= 0xffffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.Un;
                    else if (offset <= 0xffffffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.U7;
                    else throw Error("Bad offset in CFFIndex");
                    return size += 1 + offsetType.size() * (arr.length + 1), size += offset - 1;
                }
                encode(stream, arr, parent) {
                    let offsetType;
                    if (stream.writeUInt16BE(arr.length), 0 === arr.length) return;
                    let type = this.type || new restructure__WEBPACK_IMPORTED_MODULE_0__.lW, sizes = [], offset = 1;
                    for (let item of arr){
                        let s = type.size(item, parent);
                        sizes.push(s), offset += s;
                    }
                    if (offset <= 0xff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.w_;
                    else if (offset <= 0xffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL;
                    else if (offset <= 0xffffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.Un;
                    else if (offset <= 0xffffffff) offsetType = restructure__WEBPACK_IMPORTED_MODULE_0__.U7;
                    else throw Error("Bad offset in CFFIndex");
                    for (let size of (stream.writeUInt8(offsetType.size()), offset = 1, offsetType.encode(stream, offset), sizes))offset += size, offsetType.encode(stream, offset);
                    for (let item1 of arr)type.encode(stream, item1, parent);
                }
                constructor(type){
                    this.type = type;
                }
            }
            const $c2d28e92708f99da$var$FLOAT_EOF = 0xf, $c2d28e92708f99da$var$FLOAT_LOOKUP = [
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
            ], $c2d28e92708f99da$var$FLOAT_ENCODE_LOOKUP = {
                ".": 10,
                E: 11,
                "E-": 12,
                "-": 14
            };
            class $c2d28e92708f99da$export$2e2bcd8739ae039 {
                static decode(stream, value) {
                    if (32 <= value && value <= 246) return value - 139;
                    if (247 <= value && value <= 250) return (value - 247) * 256 + stream.readUInt8() + 108;
                    if (251 <= value && value <= 254) return -(256 * (value - 251)) - stream.readUInt8() - 108;
                    if (28 === value) return stream.readInt16BE();
                    if (29 === value) return stream.readInt32BE();
                    if (30 === value) {
                        let str = "";
                        for(;;){
                            let b = stream.readUInt8(), n1 = b >> 4;
                            if (n1 === $c2d28e92708f99da$var$FLOAT_EOF) break;
                            str += $c2d28e92708f99da$var$FLOAT_LOOKUP[n1];
                            let n2 = 15 & b;
                            if (n2 === $c2d28e92708f99da$var$FLOAT_EOF) break;
                            str += $c2d28e92708f99da$var$FLOAT_LOOKUP[n2];
                        }
                        return parseFloat(str);
                    }
                    return null;
                }
                static size(value) {
                    return (value.forceLarge && (value = 32768), (0 | value) !== value) ? 1 + Math.ceil((("" + value).length + 1) / 2) : -107 <= value && value <= 107 ? 1 : 108 <= value && value <= 1131 || -1131 <= value && value <= -108 ? 2 : -32768 <= value && value <= 32767 ? 3 : 5;
                }
                static encode(stream, value) {
                    let val = Number(value);
                    if (value.forceLarge) return stream.writeUInt8(29), stream.writeInt32BE(val);
                    if ((0 | val) !== val) {
                        stream.writeUInt8(30);
                        let str = "" + val;
                        for(let i = 0; i < str.length; i += 2){
                            let c1 = str[i], n1 = $c2d28e92708f99da$var$FLOAT_ENCODE_LOOKUP[c1] || +c1;
                            if (i === str.length - 1) var n2 = $c2d28e92708f99da$var$FLOAT_EOF;
                            else {
                                let c2 = str[i + 1];
                                var n2 = $c2d28e92708f99da$var$FLOAT_ENCODE_LOOKUP[c2] || +c2;
                            }
                            stream.writeUInt8(n1 << 4 | 15 & n2);
                        }
                        if (n2 !== $c2d28e92708f99da$var$FLOAT_EOF) return stream.writeUInt8($c2d28e92708f99da$var$FLOAT_EOF << 4);
                    } else if (-107 <= val && val <= 107) return stream.writeUInt8(val + 139);
                    else if (108 <= val && val <= 1131) return val -= 108, stream.writeUInt8((val >> 8) + 247), stream.writeUInt8(0xff & val);
                    else if (-1131 <= val && val <= -108) return val = -val - 108, stream.writeUInt8((val >> 8) + 251), stream.writeUInt8(0xff & val);
                    else if (-32768 <= val && val <= 32767) return stream.writeUInt8(28), stream.writeInt16BE(val);
                    else return stream.writeUInt8(29), stream.writeInt32BE(val);
                }
            }
            class $61aa549f16d58b9b$export$2e2bcd8739ae039 {
                decodeOperands(type, stream, ret, operands) {
                    if (Array.isArray(type)) return operands.map((op, i)=>this.decodeOperands(type[i], stream, ret, [
                            op
                        ]));
                    if (null != type.decode) return type.decode(stream, ret, operands);
                    switch(type){
                        case "number":
                        case "offset":
                        case "sid":
                            return operands[0];
                        case "boolean":
                            return !!operands[0];
                        default:
                            return operands;
                    }
                }
                encodeOperands(type, stream, ctx, operands) {
                    return Array.isArray(type) ? operands.map((op, i)=>this.encodeOperands(type[i], stream, ctx, op)[0]) : null != type.encode ? type.encode(stream, operands, ctx) : "number" == typeof operands ? [
                        operands
                    ] : "boolean" == typeof operands ? [
                        +operands
                    ] : Array.isArray(operands) ? operands : [
                        operands
                    ];
                }
                decode(stream, parent) {
                    let end = stream.pos + parent.length, ret = {}, operands = [];
                    for(let key in Object.defineProperties(ret, {
                        parent: {
                            value: parent
                        },
                        _startOffset: {
                            value: stream.pos
                        }
                    }), this.fields){
                        let field = this.fields[key];
                        ret[field[1]] = field[3];
                    }
                    for(; stream.pos < end;){
                        let b = stream.readUInt8();
                        if (b < 28) {
                            12 === b && (b = b << 8 | stream.readUInt8());
                            let field1 = this.fields[b];
                            if (!field1) throw Error(`Unknown operator ${b}`);
                            let val = this.decodeOperands(field1[2], stream, ret, operands);
                            null != val && (val instanceof restructure__WEBPACK_IMPORTED_MODULE_0__.c5 ? Object.defineProperty(ret, field1[1], val) : ret[field1[1]] = val), operands = [];
                        } else operands.push($c2d28e92708f99da$export$2e2bcd8739ae039.decode(stream, b));
                    }
                    return ret;
                }
                size(dict, parent, includePointers = !0) {
                    let ctx = {
                        parent: parent,
                        val: dict,
                        pointerSize: 0,
                        startOffset: parent.startOffset || 0
                    }, len = 0;
                    for(let k in this.fields){
                        let field = this.fields[k], val = dict[field[1]];
                        if (null == val || fast_deep_equal__WEBPACK_IMPORTED_MODULE_1__(val, field[3])) continue;
                        let operands = this.encodeOperands(field[2], null, ctx, val);
                        for (let op of operands)len += $c2d28e92708f99da$export$2e2bcd8739ae039.size(op);
                        len += (Array.isArray(field[0]) ? field[0] : [
                            field[0]
                        ]).length;
                    }
                    return includePointers && (len += ctx.pointerSize), len;
                }
                encode(stream, dict, parent) {
                    let ctx = {
                        pointers: [],
                        startOffset: stream.pos,
                        parent: parent,
                        val: dict,
                        pointerSize: 0
                    };
                    for (let field of (ctx.pointerOffset = stream.pos + this.size(dict, ctx, !1), this.ops)){
                        let val = dict[field[1]];
                        if (null == val || fast_deep_equal__WEBPACK_IMPORTED_MODULE_1__(val, field[3])) continue;
                        let operands = this.encodeOperands(field[2], stream, ctx, val);
                        for (let op of operands)$c2d28e92708f99da$export$2e2bcd8739ae039.encode(stream, op);
                        let key = Array.isArray(field[0]) ? field[0] : [
                            field[0]
                        ];
                        for (let op1 of key)stream.writeUInt8(op1);
                    }
                    let i = 0;
                    for(; i < ctx.pointers.length;){
                        let ptr = ctx.pointers[i++];
                        ptr.type.encode(stream, ptr.val, ptr.parent);
                    }
                }
                constructor(ops = []){
                    for (let field of (this.ops = ops, this.fields = {}, ops)){
                        let key = Array.isArray(field[0]) ? field[0][0] << 8 | field[0][1] : field[0];
                        this.fields[key] = field;
                    }
                }
            }
            class $0e34a43d05bde82c$export$2e2bcd8739ae039 extends restructure__WEBPACK_IMPORTED_MODULE_0__.$J {
                decode(stream, parent, operands) {
                    return this.offsetType = {
                        decode: ()=>operands[0]
                    }, super.decode(stream, parent, operands);
                }
                encode(stream, value, ctx) {
                    if (!stream) return this.offsetType = {
                        size: ()=>0
                    }, this.size(value, ctx), [
                        new $0e34a43d05bde82c$var$Ptr(0)
                    ];
                    let ptr = null;
                    return this.offsetType = {
                        encode: (stream, val)=>ptr = val
                    }, super.encode(stream, value, ctx), [
                        new $0e34a43d05bde82c$var$Ptr(ptr)
                    ];
                }
                constructor(type, options = {}){
                    null == options.type && (options.type = "global"), super(null, type, options);
                }
            }
            class $0e34a43d05bde82c$var$Ptr {
                valueOf() {
                    return this.val;
                }
                constructor(val){
                    this.val = val, this.forceLarge = !0;
                }
            }
            class $6d59db2e29cc77b3$var$CFFBlendOp {
                static decode(stream, parent, operands) {
                    let numBlends = operands.pop();
                    for(; operands.length > numBlends;)operands.pop();
                }
            }
            var $6d59db2e29cc77b3$export$2e2bcd8739ae039 = new $61aa549f16d58b9b$export$2e2bcd8739ae039([
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
                    !1
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
                    $6d59db2e29cc77b3$var$CFFBlendOp,
                    null
                ],
                [
                    19,
                    "Subrs",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039(new $43e9821ef3717eec$export$2e2bcd8739ae039, {
                        type: "local"
                    }),
                    null
                ]
            ]), $229224aec43783c5$export$2e2bcd8739ae039 = [
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
            let $bc0433d9b7e41f5f$export$dee0027060fa13bd = [
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
            ], $ef658f5c9a1488b2$export$c33b50336c234f16 = [
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
            ], $7cbbe4e24ef3cb75$var$LangSysTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                reqFeatureIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                featureCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                featureIndexes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "featureCount")
            }), $7cbbe4e24ef3cb75$var$LangSysRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                langSys: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$LangSysTable, {
                    type: "parent"
                })
            }), $7cbbe4e24ef3cb75$var$Script = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                defaultLangSys: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$LangSysTable),
                count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                langSysRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LangSysRecord, "count")
            }), $7cbbe4e24ef3cb75$var$ScriptRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                script: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$Script, {
                    type: "parent"
                })
            }), $7cbbe4e24ef3cb75$export$3e15fc05ce864229 = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$ScriptRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $7cbbe4e24ef3cb75$var$FeatureParams = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nameID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $7cbbe4e24ef3cb75$export$6e91cf7616333d5 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                featureParams: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$FeatureParams),
                lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupListIndexes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "lookupCount")
            }), $7cbbe4e24ef3cb75$var$FeatureRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                feature: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$6e91cf7616333d5, {
                    type: "parent"
                })
            }), $7cbbe4e24ef3cb75$export$aa18130def4b6cb4 = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$FeatureRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $7cbbe4e24ef3cb75$var$LookupFlags = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                markAttachmentType: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                flags: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, [
                    "rightToLeft",
                    "ignoreBaseGlyphs",
                    "ignoreLigatures",
                    "ignoreMarks",
                    "useMarkFilteringSet"
                ])
            });
            function $7cbbe4e24ef3cb75$export$df0008c6ff2da22a(SubTable) {
                let Lookup = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    lookupType: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    flags: $7cbbe4e24ef3cb75$var$LookupFlags,
                    subTableCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    subTables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, SubTable), "subTableCount"),
                    markFilteringSet: new restructure__WEBPACK_IMPORTED_MODULE_0__.Fi(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.flags.flags.useMarkFilteringSet)
                });
                return new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, Lookup), restructure__WEBPACK_IMPORTED_MODULE_0__.mL);
            }
            let $7cbbe4e24ef3cb75$var$RangeRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                start: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                end: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                startCoverageIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $7cbbe4e24ef3cb75$export$17608c3f81a6111 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyphs: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "glyphCount")
                },
                2: {
                    rangeCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    rangeRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$RangeRecord, "rangeCount")
                }
            }), $7cbbe4e24ef3cb75$var$ClassRangeRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                start: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                end: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                class: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $7cbbe4e24ef3cb75$export$843d551fbbafef71 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    startGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    classValueArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "glyphCount")
                },
                2: {
                    classRangeCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    classRangeRecord: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$ClassRangeRecord, "classRangeCount")
                }
            }), $7cbbe4e24ef3cb75$export$8215d14a63d9fb10 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                a: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                b: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                deltaFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $7cbbe4e24ef3cb75$var$LookupRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                sequenceIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupListIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $7cbbe4e24ef3cb75$var$Rule = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                input: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.glyphCount - 1),
                lookupRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LookupRecord, "lookupCount")
            }), $7cbbe4e24ef3cb75$var$RuleSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$Rule), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $7cbbe4e24ef3cb75$var$ClassRule = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                classes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.glyphCount - 1),
                lookupRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LookupRecord, "lookupCount")
            }), $7cbbe4e24ef3cb75$var$ClassSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$ClassRule), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $7cbbe4e24ef3cb75$export$841858b892ce1f4c = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    ruleSetCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    ruleSets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$RuleSet), "ruleSetCount")
                },
                2: {
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    classDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                    classSetCnt: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    classSet: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$ClassSet), "classSetCnt")
                },
                3: {
                    glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverages: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "glyphCount"),
                    lookupRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LookupRecord, "lookupCount")
                }
            }), $7cbbe4e24ef3cb75$var$ChainRule = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                backtrackGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                backtrack: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "backtrackGlyphCount"),
                inputGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                input: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.inputGlyphCount - 1),
                lookaheadGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookahead: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "lookaheadGlyphCount"),
                lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LookupRecord, "lookupCount")
            }), $7cbbe4e24ef3cb75$var$ChainRuleSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$ChainRule), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $7cbbe4e24ef3cb75$export$5e6d09e6861162f6 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    chainCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    chainRuleSets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$ChainRuleSet), "chainCount")
                },
                2: {
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    backtrackClassDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                    inputClassDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                    lookaheadClassDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                    chainCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    chainClassSet: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$var$ChainRuleSet), "chainCount")
                },
                3: {
                    backtrackGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    backtrackCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "backtrackGlyphCount"),
                    inputGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    inputCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "inputGlyphCount"),
                    lookaheadGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookaheadCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "lookaheadGlyphCount"),
                    lookupCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookupRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($7cbbe4e24ef3cb75$var$LookupRecord, "lookupCount")
                }
            }), $1a47b0c45c1c22fe$var$F2DOT14 = new restructure__WEBPACK_IMPORTED_MODULE_0__.gb(16, "BE", 14), $1a47b0c45c1c22fe$var$RegionAxisCoordinates = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                startCoord: $1a47b0c45c1c22fe$var$F2DOT14,
                peakCoord: $1a47b0c45c1c22fe$var$F2DOT14,
                endCoord: $1a47b0c45c1c22fe$var$F2DOT14
            }), $1a47b0c45c1c22fe$var$VariationRegionList = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                axisCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                regionCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                variationRegions: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($1a47b0c45c1c22fe$var$RegionAxisCoordinates, "axisCount"), "regionCount")
            }), $1a47b0c45c1c22fe$var$DeltaSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                shortDeltas: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, (t)=>t.parent.shortDeltaCount),
                regionDeltas: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.cS, (t)=>t.parent.regionIndexCount - t.parent.shortDeltaCount),
                deltas: (t)=>t.shortDeltas.concat(t.regionDeltas)
            }), $1a47b0c45c1c22fe$var$ItemVariationData = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                itemCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                shortDeltaCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                regionIndexCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                regionIndexes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "regionIndexCount"),
                deltaSets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($1a47b0c45c1c22fe$var$DeltaSet, "itemCount")
            }), $1a47b0c45c1c22fe$export$fe1b122a2710f241 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                variationRegionList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$var$VariationRegionList),
                variationDataCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                itemVariationData: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$var$ItemVariationData), "variationDataCount")
            }), $1a47b0c45c1c22fe$var$ConditionTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    axisIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    axisIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    filterRangeMinValue: $1a47b0c45c1c22fe$var$F2DOT14,
                    filterRangeMaxValue: $1a47b0c45c1c22fe$var$F2DOT14
                }
            }), $1a47b0c45c1c22fe$var$ConditionSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                conditionCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                conditionTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$var$ConditionTable), "conditionCount")
            }), $1a47b0c45c1c22fe$var$FeatureTableSubstitutionRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                featureIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                alternateFeatureTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $7cbbe4e24ef3cb75$export$6e91cf7616333d5, {
                    type: "parent"
                })
            }), $1a47b0c45c1c22fe$var$FeatureTableSubstitution = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                substitutionCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                substitutions: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($1a47b0c45c1c22fe$var$FeatureTableSubstitutionRecord, "substitutionCount")
            }), $1a47b0c45c1c22fe$var$FeatureVariationRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                conditionSet: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$var$ConditionSet, {
                    type: "parent"
                }),
                featureTableSubstitution: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$var$FeatureTableSubstitution, {
                    type: "parent"
                })
            }), $1a47b0c45c1c22fe$export$441b70b7971dd419 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                majorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                featureVariationRecordCount: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                featureVariationRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($1a47b0c45c1c22fe$var$FeatureVariationRecord, "featureVariationRecordCount")
            });
            class $b84fd3dd9d8eddb2$var$PredefinedOp {
                decode(stream, parent, operands) {
                    return this.predefinedOps[operands[0]] ? this.predefinedOps[operands[0]] : this.type.decode(stream, parent, operands);
                }
                size(value, ctx) {
                    return this.type.size(value, ctx);
                }
                encode(stream, value, ctx) {
                    let index = this.predefinedOps.indexOf(value);
                    return -1 !== index ? index : this.type.encode(stream, value, ctx);
                }
                constructor(predefinedOps, type){
                    this.predefinedOps = predefinedOps, this.type = type;
                }
            }
            class $b84fd3dd9d8eddb2$var$CFFEncodingVersion extends restructure__WEBPACK_IMPORTED_MODULE_0__.Mr {
                decode(stream) {
                    return 0x7f & restructure__WEBPACK_IMPORTED_MODULE_0__.w_.decode(stream);
                }
                constructor(){
                    super("UInt8");
                }
            }
            let $b84fd3dd9d8eddb2$var$Range1 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                first: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nLeft: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $b84fd3dd9d8eddb2$var$Range2 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                first: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nLeft: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $b84fd3dd9d8eddb2$var$CFFCustomEncoding = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(new $b84fd3dd9d8eddb2$var$CFFEncodingVersion(), {
                0: {
                    nCodes: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    codes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, "nCodes")
                },
                1: {
                    nRanges: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    ranges: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($b84fd3dd9d8eddb2$var$Range1, "nRanges")
                }
            }), $b84fd3dd9d8eddb2$var$CFFEncoding = new $b84fd3dd9d8eddb2$var$PredefinedOp([
                $bc0433d9b7e41f5f$export$dee0027060fa13bd,
                [
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
                ]
            ], new $0e34a43d05bde82c$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$CFFCustomEncoding, {
                lazy: !0
            }));
            class $b84fd3dd9d8eddb2$var$RangeArray extends restructure__WEBPACK_IMPORTED_MODULE_0__.mJ {
                decode(stream, parent) {
                    let length = (0, restructure__WEBPACK_IMPORTED_MODULE_0__.dB)(this.length, stream, parent), count = 0, res = [];
                    for(; count < length;){
                        let range = this.type.decode(stream, parent);
                        range.offset = count, count += range.nLeft + 1, res.push(range);
                    }
                    return res;
                }
            }
            let $b84fd3dd9d8eddb2$var$CFFCustomCharset = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, {
                0: {
                    glyphs: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.parent.CharStrings.length - 1)
                },
                1: {
                    ranges: new $b84fd3dd9d8eddb2$var$RangeArray($b84fd3dd9d8eddb2$var$Range1, (t)=>t.parent.CharStrings.length - 1)
                },
                2: {
                    ranges: new $b84fd3dd9d8eddb2$var$RangeArray($b84fd3dd9d8eddb2$var$Range2, (t)=>t.parent.CharStrings.length - 1)
                }
            }), $b84fd3dd9d8eddb2$var$CFFCharset = new $b84fd3dd9d8eddb2$var$PredefinedOp([
                $ef658f5c9a1488b2$export$c33b50336c234f16,
                [
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
                ],
                [
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
                ]
            ], new $0e34a43d05bde82c$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$CFFCustomCharset, {
                lazy: !0
            })), $b84fd3dd9d8eddb2$var$FDRange3 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                first: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                fd: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $b84fd3dd9d8eddb2$var$FDRange4 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                first: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                fd: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $b84fd3dd9d8eddb2$var$FDSelect = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, {
                0: {
                    fds: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.parent.CharStrings.length)
                },
                3: {
                    nRanges: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    ranges: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($b84fd3dd9d8eddb2$var$FDRange3, "nRanges"),
                    sentinel: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                4: {
                    nRanges: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    ranges: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($b84fd3dd9d8eddb2$var$FDRange4, "nRanges"),
                    sentinel: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
                }
            }), $b84fd3dd9d8eddb2$var$ptr = new $0e34a43d05bde82c$export$2e2bcd8739ae039($6d59db2e29cc77b3$export$2e2bcd8739ae039);
            class $b84fd3dd9d8eddb2$var$CFFPrivateOp {
                decode(stream, parent, operands) {
                    return parent.length = operands[0], $b84fd3dd9d8eddb2$var$ptr.decode(stream, parent, [
                        operands[1]
                    ]);
                }
                size(dict, ctx) {
                    return [
                        $6d59db2e29cc77b3$export$2e2bcd8739ae039.size(dict, ctx, !1),
                        $b84fd3dd9d8eddb2$var$ptr.size(dict, ctx)[0]
                    ];
                }
                encode(stream, dict, ctx) {
                    return [
                        $6d59db2e29cc77b3$export$2e2bcd8739ae039.size(dict, ctx, !1),
                        $b84fd3dd9d8eddb2$var$ptr.encode(stream, dict, ctx)[0]
                    ];
                }
            }
            let $b84fd3dd9d8eddb2$var$FontDict = new $61aa549f16d58b9b$export$2e2bcd8739ae039([
                [
                    18,
                    "Private",
                    new $b84fd3dd9d8eddb2$var$CFFPrivateOp,
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
            ]), $b84fd3dd9d8eddb2$var$CFFTopDict = new $61aa549f16d58b9b$export$2e2bcd8739ae039([
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
                    !1
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
                    $b84fd3dd9d8eddb2$var$CFFCharset,
                    $ef658f5c9a1488b2$export$c33b50336c234f16
                ],
                [
                    16,
                    "Encoding",
                    $b84fd3dd9d8eddb2$var$CFFEncoding,
                    $bc0433d9b7e41f5f$export$dee0027060fa13bd
                ],
                [
                    17,
                    "CharStrings",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039(new $43e9821ef3717eec$export$2e2bcd8739ae039),
                    null
                ],
                [
                    18,
                    "Private",
                    new $b84fd3dd9d8eddb2$var$CFFPrivateOp,
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
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$FDSelect),
                    null
                ],
                [
                    [
                        12,
                        36
                    ],
                    "FDArray",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039(new $43e9821ef3717eec$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$FontDict)),
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
            ]), $b84fd3dd9d8eddb2$var$VariationStore = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                itemVariationStore: $1a47b0c45c1c22fe$export$fe1b122a2710f241
            }), $b84fd3dd9d8eddb2$var$CFF2TopDict = new $61aa549f16d58b9b$export$2e2bcd8739ae039([
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
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039(new $43e9821ef3717eec$export$2e2bcd8739ae039),
                    null
                ],
                [
                    [
                        12,
                        37
                    ],
                    "FDSelect",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$FDSelect),
                    null
                ],
                [
                    [
                        12,
                        36
                    ],
                    "FDArray",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039(new $43e9821ef3717eec$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$FontDict)),
                    null
                ],
                [
                    24,
                    "vstore",
                    new $0e34a43d05bde82c$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$VariationStore),
                    null
                ],
                [
                    25,
                    "maxstack",
                    "number",
                    193
                ]
            ]);
            var $b84fd3dd9d8eddb2$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.gl, {
                1: {
                    hdrSize: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    offSize: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    nameIndex: new $43e9821ef3717eec$export$2e2bcd8739ae039(new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld("length")),
                    topDictIndex: new $43e9821ef3717eec$export$2e2bcd8739ae039($b84fd3dd9d8eddb2$var$CFFTopDict),
                    stringIndex: new $43e9821ef3717eec$export$2e2bcd8739ae039(new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld("length")),
                    globalSubrIndex: new $43e9821ef3717eec$export$2e2bcd8739ae039
                },
                2: {
                    hdrSize: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    topDict: $b84fd3dd9d8eddb2$var$CFF2TopDict,
                    globalSubrIndex: new $43e9821ef3717eec$export$2e2bcd8739ae039
                }
            });
            class $822ac0d589e4e237$var$CFFFont {
                static decode(stream) {
                    return new $822ac0d589e4e237$var$CFFFont(stream);
                }
                decode() {
                    this.stream.pos;
                    let top = $b84fd3dd9d8eddb2$export$2e2bcd8739ae039.decode(this.stream);
                    for(let key in top){
                        let val = top[key];
                        this[key] = val;
                    }
                    if (this.version < 2) {
                        if (1 !== this.topDictIndex.length) throw Error("Only a single font is allowed in CFF");
                        this.topDict = this.topDictIndex[0];
                    }
                    return this.isCIDFont = null != this.topDict.ROS, this;
                }
                string(sid) {
                    return this.version >= 2 ? null : sid < $229224aec43783c5$export$2e2bcd8739ae039.length ? $229224aec43783c5$export$2e2bcd8739ae039[sid] : this.stringIndex[sid - $229224aec43783c5$export$2e2bcd8739ae039.length];
                }
                get postscriptName() {
                    return this.version < 2 ? this.nameIndex[0] : null;
                }
                get fullName() {
                    return this.string(this.topDict.FullName);
                }
                get familyName() {
                    return this.string(this.topDict.FamilyName);
                }
                getCharString(glyph) {
                    return this.stream.pos = this.topDict.CharStrings[glyph].offset, this.stream.readBuffer(this.topDict.CharStrings[glyph].length);
                }
                getGlyphName(gid) {
                    if (this.version >= 2 || this.isCIDFont) return null;
                    let { charset: charset  } = this.topDict;
                    if (Array.isArray(charset)) return charset[gid];
                    if (0 === gid) return ".notdef";
                    switch(gid -= 1, charset.version){
                        case 0:
                            return this.string(charset.glyphs[gid]);
                        case 1:
                        case 2:
                            for(let i = 0; i < charset.ranges.length; i++){
                                let range = charset.ranges[i];
                                if (range.offset <= gid && gid <= range.offset + range.nLeft) return this.string(range.first + (gid - range.offset));
                            }
                    }
                    return null;
                }
                fdForGlyph(gid) {
                    if (!this.topDict.FDSelect) return null;
                    switch(this.topDict.FDSelect.version){
                        case 0:
                            return this.topDict.FDSelect.fds[gid];
                        case 3:
                        case 4:
                            let { ranges: ranges  } = this.topDict.FDSelect, low = 0, high = ranges.length - 1;
                            for(; low <= high;){
                                let mid = low + high >> 1;
                                if (gid < ranges[mid].first) high = mid - 1;
                                else {
                                    if (!(mid < high) || !(gid >= ranges[mid + 1].first)) return ranges[mid].fd;
                                    low = mid + 1;
                                }
                            }
                        default:
                            throw Error(`Unknown FDSelect version: ${this.topDict.FDSelect.version}`);
                    }
                }
                privateDictForGlyph(gid) {
                    if (this.topDict.FDSelect) {
                        let fd = this.fdForGlyph(gid);
                        return this.topDict.FDArray[fd] ? this.topDict.FDArray[fd].Private : null;
                    }
                    return this.version < 2 ? this.topDict.Private : this.topDict.FDArray[0].Private;
                }
                constructor(stream){
                    this.stream = stream, this.decode();
                }
            }
            var $822ac0d589e4e237$export$2e2bcd8739ae039 = $822ac0d589e4e237$var$CFFFont;
            let $2bbf2bc1ce37cd8f$var$VerticalOrigin = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyphIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                vertOriginY: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            });
            var $2bbf2bc1ce37cd8f$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                majorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                defaultVertOriginY: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                numVertOriginYMetrics: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                metrics: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($2bbf2bc1ce37cd8f$var$VerticalOrigin, "numVertOriginYMetrics")
            });
            let $0941618dc22a946d$export$16b227cb15d716a0 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                height: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                width: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                horiBearingX: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                horiBearingY: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                horiAdvance: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                vertBearingX: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                vertBearingY: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                vertAdvance: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $0941618dc22a946d$export$62c53e75f69bfe12 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                height: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                width: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                bearingX: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                bearingY: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                advance: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $0941618dc22a946d$var$EBDTComponent = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                xOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                yOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.cS
            });
            class $0941618dc22a946d$var$ByteAligned {
            }
            class $0941618dc22a946d$var$BitAligned {
            }
            new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("version", {
                1: {
                    metrics: $0941618dc22a946d$export$62c53e75f69bfe12,
                    data: $0941618dc22a946d$var$ByteAligned
                },
                2: {
                    metrics: $0941618dc22a946d$export$62c53e75f69bfe12,
                    data: $0941618dc22a946d$var$BitAligned
                },
                5: {
                    data: $0941618dc22a946d$var$BitAligned
                },
                6: {
                    metrics: $0941618dc22a946d$export$16b227cb15d716a0,
                    data: $0941618dc22a946d$var$ByteAligned
                },
                7: {
                    metrics: $0941618dc22a946d$export$16b227cb15d716a0,
                    data: $0941618dc22a946d$var$BitAligned
                },
                8: {
                    metrics: $0941618dc22a946d$export$62c53e75f69bfe12,
                    pad: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_),
                    numComponents: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    components: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($0941618dc22a946d$var$EBDTComponent, "numComponents")
                },
                9: {
                    metrics: $0941618dc22a946d$export$16b227cb15d716a0,
                    pad: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_),
                    numComponents: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    components: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($0941618dc22a946d$var$EBDTComponent, "numComponents")
                },
                17: {
                    metrics: $0941618dc22a946d$export$62c53e75f69bfe12,
                    dataLen: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    data: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW("dataLen")
                },
                18: {
                    metrics: $0941618dc22a946d$export$16b227cb15d716a0,
                    dataLen: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    data: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW("dataLen")
                },
                19: {
                    dataLen: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    data: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW("dataLen")
                }
            });
            let $9911c4c7201c13de$var$SBitLineMetrics = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                ascender: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                descender: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                widthMax: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                caretSlopeNumerator: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                caretSlopeDenominator: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                caretOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                minOriginSB: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                minAdvanceSB: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                maxBeforeBL: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                minAfterBL: restructure__WEBPACK_IMPORTED_MODULE_0__.cS,
                pad: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.cS, 2)
            }), $9911c4c7201c13de$var$CodeOffsetPair = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyphCode: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                offset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $9911c4c7201c13de$var$IndexSubtable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                header: {
                    imageFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    imageDataOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
                },
                1: {
                    offsetArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, (t)=>t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1)
                },
                2: {
                    imageSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    bigMetrics: $0941618dc22a946d$export$16b227cb15d716a0
                },
                3: {
                    offsetArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1)
                },
                4: {
                    numGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    glyphArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($9911c4c7201c13de$var$CodeOffsetPair, (t)=>t.numGlyphs + 1)
                },
                5: {
                    imageSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    bigMetrics: $0941618dc22a946d$export$16b227cb15d716a0,
                    numGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    glyphCodeArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numGlyphs")
                }
            }), $9911c4c7201c13de$var$IndexSubtableArray = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                firstGlyphIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lastGlyphIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                subtable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $9911c4c7201c13de$var$IndexSubtable)
            }), $9911c4c7201c13de$var$BitmapSizeTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                indexSubTableArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($9911c4c7201c13de$var$IndexSubtableArray, 1), {
                    type: "parent"
                }),
                indexTablesSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                numberOfIndexSubTables: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                colorRef: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                hori: $9911c4c7201c13de$var$SBitLineMetrics,
                vert: $9911c4c7201c13de$var$SBitLineMetrics,
                startGlyphIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                endGlyphIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                ppemX: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                ppemY: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                bitDepth: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                flags: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, [
                    "horizontal",
                    "vertical"
                ])
            });
            var $9911c4c7201c13de$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                numSizes: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                sizes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($9911c4c7201c13de$var$BitmapSizeTable, "numSizes")
            });
            let $abb847051efd51b1$var$ImageTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                ppem: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                resolution: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                imageOffsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "void"), (t)=>t.parent.parent.maxp.numGlyphs + 1)
            });
            var $abb847051efd51b1$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                flags: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
                    "renderOutlines"
                ]),
                numImgTables: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                imageTables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $abb847051efd51b1$var$ImageTable), "numImgTables")
            });
            let $eb629188f3dfefdd$var$LayerRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                gid: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                paletteIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $eb629188f3dfefdd$var$BaseGlyphRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                gid: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                firstLayerIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numLayers: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            });
            var $eb629188f3dfefdd$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numBaseGlyphRecords: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                baseGlyphRecord: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($eb629188f3dfefdd$var$BaseGlyphRecord, "numBaseGlyphRecords")),
                layerRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($eb629188f3dfefdd$var$LayerRecord, "numLayerRecords"), {
                    lazy: !0
                }),
                numLayerRecords: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            });
            let $08734b8e7dc64587$var$ColorRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                blue: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                green: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                red: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                alpha: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            });
            var $08734b8e7dc64587$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                header: {
                    numPaletteEntries: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    numPalettes: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    numColorRecords: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    colorRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($08734b8e7dc64587$var$ColorRecord, "numColorRecords")),
                    colorRecordIndices: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numPalettes")
                },
                0: {},
                1: {
                    offsetPaletteTypeArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "numPalettes")),
                    offsetPaletteLabelArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numPalettes")),
                    offsetPaletteEntryLabelArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numPaletteEntries"))
                }
            });
            let $497cef411d884e34$var$BaseCoord = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    coordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
                },
                2: {
                    coordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    referenceGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    baseCoordPoint: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                3: {
                    coordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    deviceTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10)
                }
            }), $497cef411d884e34$var$BaseValues = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                defaultIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                baseCoordCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                baseCoords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseCoord), "baseCoordCount")
            }), $497cef411d884e34$var$FeatMinMaxRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                minCoord: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseCoord, {
                    type: "parent"
                }),
                maxCoord: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseCoord, {
                    type: "parent"
                })
            }), $497cef411d884e34$var$MinMax = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                minCoord: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseCoord),
                maxCoord: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseCoord),
                featMinMaxCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                featMinMaxRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($497cef411d884e34$var$FeatMinMaxRecord, "featMinMaxCount")
            }), $497cef411d884e34$var$BaseLangSysRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                minMax: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$MinMax, {
                    type: "parent"
                })
            }), $497cef411d884e34$var$BaseScript = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                baseValues: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseValues),
                defaultMinMax: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$MinMax),
                baseLangSysCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                baseLangSysRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($497cef411d884e34$var$BaseLangSysRecord, "baseLangSysCount")
            }), $497cef411d884e34$var$BaseScriptRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                script: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseScript, {
                    type: "parent"
                })
            }), $497cef411d884e34$var$BaseScriptList = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($497cef411d884e34$var$BaseScriptRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $497cef411d884e34$var$BaseTagList = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $497cef411d884e34$var$Axis = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                baseTagList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseTagList),
                baseScriptList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$BaseScriptList)
            });
            var $497cef411d884e34$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, {
                header: {
                    horizAxis: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$Axis),
                    vertAxis: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $497cef411d884e34$var$Axis)
                },
                0x00010000: {},
                0x00010001: {
                    itemVariationStore: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$export$fe1b122a2710f241)
                }
            });
            let $cf5f33c63ef209e6$var$AttachPoint = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $cf5f33c63ef209e6$var$AttachList = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                attachPoints: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$AttachPoint), "glyphCount")
            }), $cf5f33c63ef209e6$var$CaretValue = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    coordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
                },
                2: {
                    caretValuePoint: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                3: {
                    coordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    deviceTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10)
                }
            }), $cf5f33c63ef209e6$var$LigGlyph = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$CaretValue), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $cf5f33c63ef209e6$var$LigCaretList = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                ligGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                ligGlyphs: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$LigGlyph), "ligGlyphCount")
            }), $cf5f33c63ef209e6$var$MarkGlyphSetsDef = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                markSetTableFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                markSetCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "markSetCount")
            });
            var $cf5f33c63ef209e6$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, {
                header: {
                    glyphClassDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                    attachList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$AttachList),
                    ligCaretList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$LigCaretList),
                    markAttachClassDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71)
                },
                0x00010000: {},
                0x00010002: {
                    markGlyphSetsDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$MarkGlyphSetsDef)
                },
                0x00010003: {
                    markGlyphSetsDef: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $cf5f33c63ef209e6$var$MarkGlyphSetsDef),
                    itemVariationStore: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$export$fe1b122a2710f241)
                }
            });
            let $47e0e8ef515d9903$var$ValueFormat = new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
                "xPlacement",
                "yPlacement",
                "xAdvance",
                "yAdvance",
                "xPlaDevice",
                "yPlaDevice",
                "xAdvDevice",
                "yAdvDevice"
            ]), $47e0e8ef515d9903$var$types = {
                xPlacement: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yPlacement: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xAdvance: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yAdvance: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xPlaDevice: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10, {
                    type: "global",
                    relativeTo: (ctx)=>ctx.rel
                }),
                yPlaDevice: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10, {
                    type: "global",
                    relativeTo: (ctx)=>ctx.rel
                }),
                xAdvDevice: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10, {
                    type: "global",
                    relativeTo: (ctx)=>ctx.rel
                }),
                yAdvDevice: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10, {
                    type: "global",
                    relativeTo: (ctx)=>ctx.rel
                })
            };
            class $47e0e8ef515d9903$var$ValueRecord {
                buildStruct(parent) {
                    let struct = parent;
                    for(; !struct[this.key] && struct.parent;)struct = struct.parent;
                    if (!struct[this.key]) return;
                    let fields = {};
                    fields.rel = ()=>struct._startOffset;
                    let format = struct[this.key];
                    for(let key in format)format[key] && (fields[key] = $47e0e8ef515d9903$var$types[key]);
                    return new restructure__WEBPACK_IMPORTED_MODULE_0__.AU(fields);
                }
                size(val, ctx) {
                    return this.buildStruct(ctx).size(val, ctx);
                }
                decode(stream, parent) {
                    let res = this.buildStruct(parent).decode(stream, parent);
                    return delete res.rel, res;
                }
                constructor(key = "valueFormat"){
                    this.key = key;
                }
            }
            let $47e0e8ef515d9903$var$PairValueRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                secondGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                value1: new $47e0e8ef515d9903$var$ValueRecord("valueFormat1"),
                value2: new $47e0e8ef515d9903$var$ValueRecord("valueFormat2")
            }), $47e0e8ef515d9903$var$PairSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($47e0e8ef515d9903$var$PairValueRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $47e0e8ef515d9903$var$Class2Record = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                value1: new $47e0e8ef515d9903$var$ValueRecord("valueFormat1"),
                value2: new $47e0e8ef515d9903$var$ValueRecord("valueFormat2")
            }), $47e0e8ef515d9903$var$Anchor = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                1: {
                    xCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    yCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
                },
                2: {
                    xCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    yCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    anchorPoint: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                3: {
                    xCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    yCoordinate: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                    xDeviceTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10),
                    yDeviceTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$8215d14a63d9fb10)
                }
            }), $47e0e8ef515d9903$var$EntryExitRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                entryAnchor: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$Anchor, {
                    type: "parent"
                }),
                exitAnchor: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$Anchor, {
                    type: "parent"
                })
            }), $47e0e8ef515d9903$var$MarkRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                class: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                markAnchor: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$Anchor, {
                    type: "parent"
                })
            }), $47e0e8ef515d9903$var$MarkArray = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($47e0e8ef515d9903$var$MarkRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $47e0e8ef515d9903$var$BaseRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$Anchor), (t)=>t.parent.classCount), $47e0e8ef515d9903$var$BaseArray = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($47e0e8ef515d9903$var$BaseRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $47e0e8ef515d9903$var$ComponentRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$Anchor), (t)=>t.parent.parent.classCount), $47e0e8ef515d9903$var$LigatureAttach = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($47e0e8ef515d9903$var$ComponentRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $47e0e8ef515d9903$var$LigatureArray = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$LigatureAttach), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $47e0e8ef515d9903$export$73a8cfb19cd43a0f = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("lookupType", {
                1: new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                    1: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        valueFormat: $47e0e8ef515d9903$var$ValueFormat,
                        value: new $47e0e8ef515d9903$var$ValueRecord()
                    },
                    2: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        valueFormat: $47e0e8ef515d9903$var$ValueFormat,
                        valueCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        values: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new $47e0e8ef515d9903$var$ValueRecord(), "valueCount")
                    }
                }),
                2: new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                    1: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        valueFormat1: $47e0e8ef515d9903$var$ValueFormat,
                        valueFormat2: $47e0e8ef515d9903$var$ValueFormat,
                        pairSetCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        pairSets: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$PairSet), "pairSetCount")
                    },
                    2: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        valueFormat1: $47e0e8ef515d9903$var$ValueFormat,
                        valueFormat2: $47e0e8ef515d9903$var$ValueFormat,
                        classDef1: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                        classDef2: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$843d551fbbafef71),
                        class1Count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        class2Count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        classRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($47e0e8ef515d9903$var$Class2Record, "class2Count"), "class1Count")
                    }
                }),
                3: {
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    entryExitCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    entryExitRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($47e0e8ef515d9903$var$EntryExitRecord, "entryExitCount")
                },
                4: {
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    markCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    baseCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    classCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    markArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$MarkArray),
                    baseArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$BaseArray)
                },
                5: {
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    markCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    ligatureCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    classCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    markArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$MarkArray),
                    ligatureArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$LigatureArray)
                },
                6: {
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    mark1Coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    mark2Coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    classCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    mark1Array: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$MarkArray),
                    mark2Array: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $47e0e8ef515d9903$var$BaseArray)
                },
                7: $7cbbe4e24ef3cb75$export$841858b892ce1f4c,
                8: $7cbbe4e24ef3cb75$export$5e6d09e6861162f6,
                9: {
                    posFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookupType: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    extension: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, null)
                }
            });
            $47e0e8ef515d9903$export$73a8cfb19cd43a0f.versions[9].extension.type = $47e0e8ef515d9903$export$73a8cfb19cd43a0f;
            var $47e0e8ef515d9903$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, {
                header: {
                    scriptList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$3e15fc05ce864229),
                    featureList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$aa18130def4b6cb4),
                    lookupList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new $7cbbe4e24ef3cb75$export$df0008c6ff2da22a($47e0e8ef515d9903$export$73a8cfb19cd43a0f))
                },
                0x00010000: {},
                0x00010001: {
                    featureVariations: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$export$441b70b7971dd419)
                }
            });
            let $d3f442064af66e06$var$Sequence = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $d3f442064af66e06$var$Ligature = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                glyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                compCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                components: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.compCount - 1)
            }), $d3f442064af66e06$var$LigatureSet = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $d3f442064af66e06$var$Ligature), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $d3f442064af66e06$var$GSUBLookup = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("lookupType", {
                1: new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                    1: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        deltaGlyphID: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
                    },
                    2: {
                        coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                        glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        substitute: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "glyphCount")
                    }
                }),
                2: {
                    substFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    sequences: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $d3f442064af66e06$var$Sequence), "count")
                },
                3: {
                    substFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    alternateSet: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $d3f442064af66e06$var$Sequence), "count")
                },
                4: {
                    substFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    ligatureSets: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $d3f442064af66e06$var$LigatureSet), "count")
                },
                5: $7cbbe4e24ef3cb75$export$841858b892ce1f4c,
                6: $7cbbe4e24ef3cb75$export$5e6d09e6861162f6,
                7: {
                    substFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookupType: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    extension: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, null)
                },
                8: {
                    substFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111),
                    backtrackCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "backtrackGlyphCount"),
                    lookaheadGlyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    lookaheadCoverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$17608c3f81a6111), "lookaheadGlyphCount"),
                    glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    substitutes: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "glyphCount")
                }
            });
            $d3f442064af66e06$var$GSUBLookup.versions[7].extension.type = $d3f442064af66e06$var$GSUBLookup;
            var $d3f442064af66e06$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, {
                header: {
                    scriptList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$3e15fc05ce864229),
                    featureList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $7cbbe4e24ef3cb75$export$aa18130def4b6cb4),
                    lookupList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new $7cbbe4e24ef3cb75$export$df0008c6ff2da22a($d3f442064af66e06$var$GSUBLookup))
                },
                0x00010000: {},
                0x00010001: {
                    featureVariations: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$export$441b70b7971dd419)
                }
            });
            let $71cfb3c4767fbd0c$var$JstfGSUBModList = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $71cfb3c4767fbd0c$var$JstfPriority = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                shrinkageEnableGSUB: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                shrinkageDisableGSUB: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                shrinkageEnableGPOS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                shrinkageDisableGPOS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                shrinkageJstfMax: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new $7cbbe4e24ef3cb75$export$df0008c6ff2da22a($47e0e8ef515d9903$export$73a8cfb19cd43a0f)),
                extensionEnableGSUB: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                extensionDisableGSUB: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                extensionEnableGPOS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                extensionDisableGPOS: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfGSUBModList),
                extensionJstfMax: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new $7cbbe4e24ef3cb75$export$df0008c6ff2da22a($47e0e8ef515d9903$export$73a8cfb19cd43a0f))
            }), $71cfb3c4767fbd0c$var$JstfLangSys = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfPriority), restructure__WEBPACK_IMPORTED_MODULE_0__.mL), $71cfb3c4767fbd0c$var$JstfLangSysRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                jstfLangSys: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfLangSys)
            }), $71cfb3c4767fbd0c$var$JstfScript = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                extenderGlyphs: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, restructure__WEBPACK_IMPORTED_MODULE_0__.mL)),
                defaultLangSys: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfLangSys),
                langSysCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                langSysRecords: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($71cfb3c4767fbd0c$var$JstfLangSysRecord, "langSysCount")
            }), $71cfb3c4767fbd0c$var$JstfScriptRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                script: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $71cfb3c4767fbd0c$var$JstfScript, {
                    type: "parent"
                })
            });
            var $71cfb3c4767fbd0c$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                scriptCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                scriptList: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($71cfb3c4767fbd0c$var$JstfScriptRecord, "scriptCount")
            });
            class $d059a6bd2d3b5b63$var$VariableSizeNumber {
                decode(stream, parent) {
                    switch(this.size(0, parent)){
                        case 1:
                            return stream.readUInt8();
                        case 2:
                            return stream.readUInt16BE();
                        case 3:
                            return stream.readUInt24BE();
                        case 4:
                            return stream.readUInt32BE();
                    }
                }
                size(val, parent) {
                    return (0, restructure__WEBPACK_IMPORTED_MODULE_0__.dB)(this._size, null, parent);
                }
                constructor(size){
                    this._size = size;
                }
            }
            let $d059a6bd2d3b5b63$var$MapDataEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                entry: new $d059a6bd2d3b5b63$var$VariableSizeNumber((t)=>((0x0030 & t.parent.entryFormat) >> 4) + 1),
                outerIndex: (t)=>t.entry >> (0x000F & t.parent.entryFormat) + 1,
                innerIndex: (t)=>t.entry & (1 << (0x000F & t.parent.entryFormat) + 1) - 1
            }), $d059a6bd2d3b5b63$var$DeltaSetIndexMap = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                entryFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                mapCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                mapData: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($d059a6bd2d3b5b63$var$MapDataEntry, "mapCount")
            });
            var $d059a6bd2d3b5b63$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                majorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                itemVariationStore: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $1a47b0c45c1c22fe$export$fe1b122a2710f241),
                advanceWidthMapping: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $d059a6bd2d3b5b63$var$DeltaSetIndexMap),
                LSBMapping: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $d059a6bd2d3b5b63$var$DeltaSetIndexMap),
                RSBMapping: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $d059a6bd2d3b5b63$var$DeltaSetIndexMap)
            });
            let $dceeca3e1977ce30$var$Signature = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                format: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                offset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $dceeca3e1977ce30$var$SignatureBlock = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, 2),
                cbSignature: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                signature: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW("cbSignature")
            });
            var $dceeca3e1977ce30$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                ulVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                usNumSigs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                usFlag: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                signatures: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($dceeca3e1977ce30$var$Signature, "usNumSigs"),
                signatureBlocks: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($dceeca3e1977ce30$var$SignatureBlock, "usNumSigs")
            });
            let $8acd740a9435aad0$var$GaspRange = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                rangeMaxPPEM: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                rangeGaspBehavior: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, [
                    "grayscale",
                    "gridfit",
                    "symmetricSmoothing",
                    "symmetricGridfit"
                ])
            });
            var $8acd740a9435aad0$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numRanges: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                gaspRanges: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($8acd740a9435aad0$var$GaspRange, "numRanges")
            });
            let $b5f380243c34d6a0$var$DeviceRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                pixelSize: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                maximumWidth: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                widths: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.parent.parent.maxp.numGlyphs)
            });
            var $b5f380243c34d6a0$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numRecords: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                sizeDeviceRecord: restructure__WEBPACK_IMPORTED_MODULE_0__.LB,
                records: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($b5f380243c34d6a0$var$DeviceRecord, "numRecords")
            });
            let $ca2df1256966e313$var$KernPair = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                left: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                right: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                value: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            }), $ca2df1256966e313$var$ClassTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                firstGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "nGlyphs"),
                max: (t)=>t.offsets.length && Math.max.apply(Math, t.offsets)
            }), $ca2df1256966e313$var$Kern2Array = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                off: (t)=>t._startOffset - t.parent.parent._startOffset,
                len: (t)=>((t.parent.leftTable.max - t.off) / t.parent.rowWidth + 1) * (t.parent.rowWidth / 2),
                values: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, "len")
            }), $ca2df1256966e313$var$KernSubtable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("format", {
                0: {
                    nPairs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    searchRange: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    entrySelector: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    rangeShift: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    pairs: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca2df1256966e313$var$KernPair, "nPairs")
                },
                2: {
                    rowWidth: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    leftTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $ca2df1256966e313$var$ClassTable, {
                        type: "parent"
                    }),
                    rightTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $ca2df1256966e313$var$ClassTable, {
                        type: "parent"
                    }),
                    array: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $ca2df1256966e313$var$Kern2Array, {
                        type: "parent"
                    })
                },
                3: {
                    glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    kernValueCount: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    leftClassCount: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    rightClassCount: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    flags: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    kernValue: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, "kernValueCount"),
                    leftClass: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, "glyphCount"),
                    rightClass: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, "glyphCount"),
                    kernIndex: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.leftClassCount * t.rightClassCount)
                }
            }), $ca2df1256966e313$var$KernTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("version", {
                0: {
                    subVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, [
                        "horizontal",
                        "minimum",
                        "crossStream",
                        "override"
                    ]),
                    subtable: $ca2df1256966e313$var$KernSubtable,
                    padding: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.length - t._currentOffset)
                },
                1: {
                    length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    coverage: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, [
                        null,
                        null,
                        null,
                        null,
                        null,
                        "variation",
                        "crossStream",
                        "vertical"
                    ]),
                    format: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                    tupleIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    subtable: $ca2df1256966e313$var$KernSubtable,
                    padding: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.length - t._currentOffset)
                }
            });
            var $ca2df1256966e313$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                0: {
                    nTables: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca2df1256966e313$var$KernTable, "nTables")
                },
                1: {
                    reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                    nTables: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca2df1256966e313$var$KernTable, "nTables")
                }
            }), $7a9f92b0c46ebe33$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                yPels: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, "numGlyphs")
            }), $2b2ccc419d152631$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                fontNumber: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                pitch: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                xHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                style: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                typeFamily: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                capHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                symbolSet: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                typeface: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(16),
                characterComplement: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(8),
                fileName: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(6),
                strokeWeight: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(1),
                widthType: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(1),
                serifStyle: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_)
            });
            let $ca5b40b9bcda9c9b$var$Ratio = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                bCharSet: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                xRatio: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                yStartRatio: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                yEndRatio: restructure__WEBPACK_IMPORTED_MODULE_0__.w_
            }), $ca5b40b9bcda9c9b$var$vTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                yPelHeight: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                yMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            }), $ca5b40b9bcda9c9b$var$VdmxGroup = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                recs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                startsz: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                endsz: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                entries: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca5b40b9bcda9c9b$var$vTable, "recs")
            });
            var $ca5b40b9bcda9c9b$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numRecs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                numRatios: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                ratioRanges: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca5b40b9bcda9c9b$var$Ratio, "numRatios"),
                offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numRatios"),
                groups: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($ca5b40b9bcda9c9b$var$VdmxGroup, "numRecs")
            }), $69530a3c40755af0$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                ascent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                descent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                lineGap: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                advanceHeightMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                minTopSideBearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                minBottomSideBearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMaxExtent: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretSlopeRise: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretSlopeRun: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                caretOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, 4),
                metricDataFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                numberOfMetrics: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            });
            let $344073dd270f0e62$var$VmtxEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                advance: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                bearing: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            });
            var $344073dd270f0e62$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                metrics: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW($344073dd270f0e62$var$VmtxEntry, (t)=>t.parent.vhea.numberOfMetrics),
                bearings: new restructure__WEBPACK_IMPORTED_MODULE_0__.pW(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, (t)=>t.parent.maxp.numGlyphs - t.parent.vhea.numberOfMetrics)
            });
            let $3793b781918cfced$var$shortFrac = new restructure__WEBPACK_IMPORTED_MODULE_0__.gb(16, "BE", 14), $3793b781918cfced$var$Correspondence = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                fromCoord: $3793b781918cfced$var$shortFrac,
                toCoord: $3793b781918cfced$var$shortFrac
            }), $3793b781918cfced$var$Segment = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                pairCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                correspondence: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($3793b781918cfced$var$Correspondence, "pairCount")
            });
            var $3793b781918cfced$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                axisCount: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                segment: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($3793b781918cfced$var$Segment, "axisCount")
            });
            class $6cb7dd5f47d82580$var$UnboundedArrayAccessor {
                getItem(index) {
                    if (null == this._items[index]) {
                        let pos = this.stream.pos;
                        this.stream.pos = this.base + this.type.size(null, this.parent) * index, this._items[index] = this.type.decode(this.stream, this.parent), this.stream.pos = pos;
                    }
                    return this._items[index];
                }
                inspect() {
                    return `[UnboundedArray ${this.type.constructor.name}]`;
                }
                constructor(type, stream, parent){
                    this.type = type, this.stream = stream, this.parent = parent, this.base = this.stream.pos, this._items = [];
                }
            }
            class $6cb7dd5f47d82580$export$c5af1eebc882e39a extends restructure__WEBPACK_IMPORTED_MODULE_0__.mJ {
                decode(stream, parent) {
                    return new $6cb7dd5f47d82580$var$UnboundedArrayAccessor(this.type, stream, parent);
                }
                constructor(type){
                    super(type, 0);
                }
            }
            let $6cb7dd5f47d82580$export$8351f8c2ae2f103c = function(ValueType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL) {
                class Shadow {
                    decode(stream, ctx) {
                        return ctx = ctx.parent.parent, this.type.decode(stream, ctx);
                    }
                    size(val, ctx) {
                        return ctx = ctx.parent.parent, this.type.size(val, ctx);
                    }
                    encode(stream, val, ctx) {
                        return ctx = ctx.parent.parent, this.type.encode(stream, val, ctx);
                    }
                    constructor(type){
                        this.type = type;
                    }
                }
                ValueType = new Shadow(ValueType);
                let BinarySearchHeader = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    unitSize: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    nUnits: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    searchRange: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    entrySelector: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    rangeShift: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                }), LookupSegmentSingle = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    lastGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    firstGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    value: ValueType
                }), LookupSegmentArray = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    lastGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    firstGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    values: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(ValueType, (t)=>t.lastGlyph - t.firstGlyph + 1), {
                        type: "parent"
                    })
                }), LookupSingle = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    glyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    value: ValueType
                });
                return new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, {
                    0: {
                        values: new $6cb7dd5f47d82580$export$c5af1eebc882e39a(ValueType)
                    },
                    2: {
                        binarySearchHeader: BinarySearchHeader,
                        segments: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(LookupSegmentSingle, (t)=>t.binarySearchHeader.nUnits)
                    },
                    4: {
                        binarySearchHeader: BinarySearchHeader,
                        segments: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(LookupSegmentArray, (t)=>t.binarySearchHeader.nUnits)
                    },
                    6: {
                        binarySearchHeader: BinarySearchHeader,
                        segments: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(LookupSingle, (t)=>t.binarySearchHeader.nUnits)
                    },
                    8: {
                        firstGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        count: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                        values: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(ValueType, "count")
                    }
                });
            };
            function $6cb7dd5f47d82580$export$79f7d93d790934ba(entryData = {}, lookupType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL) {
                let entry = Object.assign({
                    newState: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                }, entryData), Entry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU(entry), StateArray = new $6cb7dd5f47d82580$export$c5af1eebc882e39a(new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.nClasses));
                return new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    nClasses: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    classTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$8351f8c2ae2f103c(lookupType)),
                    stateArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, StateArray),
                    entryTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(Entry))
                });
            }
            function $6cb7dd5f47d82580$export$105027425199cc51(entryData = {}, lookupType = restructure__WEBPACK_IMPORTED_MODULE_0__.mL) {
                let ClassLookupTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    version: ()=>8,
                    firstGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    values: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, restructure__WEBPACK_IMPORTED_MODULE_0__.mL)
                }), entry = Object.assign({
                    newStateOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    newState: (t)=>(t.newStateOffset - (t.parent.stateArray.base - t.parent._startOffset)) / t.parent.nClasses,
                    flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                }, entryData), Entry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU(entry), StateArray = new $6cb7dd5f47d82580$export$c5af1eebc882e39a(new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.nClasses));
                return new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                    nClasses: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    classTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, ClassLookupTable),
                    stateArray: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, StateArray),
                    entryTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(Entry))
                });
            }
            let $6a3746e8c708f5a3$var$BslnSubtable = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("format", {
                0: {
                    deltas: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, 32)
                },
                1: {
                    deltas: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.Af, 32),
                    mappingData: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c(restructure__WEBPACK_IMPORTED_MODULE_0__.mL)
                },
                2: {
                    standardGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    controlPoints: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, 32)
                },
                3: {
                    standardGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    controlPoints: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, 32),
                    mappingData: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c(restructure__WEBPACK_IMPORTED_MODULE_0__.mL)
                }
            });
            var $6a3746e8c708f5a3$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                defaultBaseline: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                subtable: $6a3746e8c708f5a3$var$BslnSubtable
            });
            let $d0c76fac617b308a$var$Setting = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                setting: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nameIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                name: (t)=>t.parent.parent.parent.name.records.fontFeatures[t.nameIndex]
            }), $d0c76fac617b308a$var$FeatureName = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                feature: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nSettings: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                settingTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($d0c76fac617b308a$var$Setting, "nSettings"), {
                    type: "parent"
                }),
                featureFlags: new restructure__WEBPACK_IMPORTED_MODULE_0__.DL(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "hasDefault",
                    "exclusive"
                ]),
                defaultSetting: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                nameIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                name: (t)=>t.parent.parent.name.records.fontFeatures[t.nameIndex]
            });
            var $d0c76fac617b308a$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                featureNameCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                reserved1: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                reserved2: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.U7),
                featureNames: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($d0c76fac617b308a$var$FeatureName, "featureNameCount")
            });
            let $e83fd065f00fcd01$var$Axis = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                axisTag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                minValue: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                defaultValue: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                maxValue: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nameID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                name: (t)=>t.parent.parent.name.records.fontFeatures[t.nameID]
            }), $e83fd065f00fcd01$var$Instance = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                nameID: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                name: (t)=>t.parent.parent.name.records.fontFeatures[t.nameID],
                flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                coord: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.E2, (t)=>t.parent.axisCount),
                postscriptNameID: new restructure__WEBPACK_IMPORTED_MODULE_0__.Fi(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, (t)=>t.parent.instanceSize - t._currentOffset > 0)
            });
            var $e83fd065f00fcd01$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                offsetToData: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                countSizePairs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                axisCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                axisSize: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                instanceCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                instanceSize: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                axis: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($e83fd065f00fcd01$var$Axis, "axisCount"),
                instance: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($e83fd065f00fcd01$var$Instance, "instanceCount")
            });
            let $dbe33c8d3a7f131c$var$shortFrac = new restructure__WEBPACK_IMPORTED_MODULE_0__.gb(16, "BE", 14);
            class $dbe33c8d3a7f131c$var$Offset {
                static decode(stream, parent) {
                    return parent.flags ? stream.readUInt32BE() : 2 * stream.readUInt16BE();
                }
            }
            let $dbe33c8d3a7f131c$var$gvar = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                axisCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                globalCoordCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                globalCoords: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($dbe33c8d3a7f131c$var$shortFrac, "axisCount"), "globalCoordCount")),
                glyphCount: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                offsetToData: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J($dbe33c8d3a7f131c$var$Offset, "void", {
                    relativeTo: (ctx)=>ctx.offsetToData,
                    allowNull: !1
                }), (t)=>t.glyphCount + 1)
            }), $05b01887df96c4ee$var$ClassTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                coverage: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                subFeatureFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                stateTable: new $6cb7dd5f47d82580$export$105027425199cc51
            }), $05b01887df96c4ee$var$WidthDeltaRecord = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                justClass: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                beforeGrowLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                beforeShrinkLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                afterGrowLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                afterShrinkLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                growFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                shrinkFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }), $05b01887df96c4ee$var$WidthDeltaCluster = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($05b01887df96c4ee$var$WidthDeltaRecord, restructure__WEBPACK_IMPORTED_MODULE_0__.U7), $05b01887df96c4ee$var$ActionData = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("actionType", {
                0: {
                    lowerLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    upperLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    order: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyphs: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, restructure__WEBPACK_IMPORTED_MODULE_0__.mL)
                },
                1: {
                    addGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                2: {
                    substThreshold: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    addGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    substGlyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                },
                3: {},
                4: {
                    variationAxis: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    minimumLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    noStretchValue: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                    maximumLimit: restructure__WEBPACK_IMPORTED_MODULE_0__.E2
                },
                5: {
                    flags: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                    glyph: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
                }
            }), $05b01887df96c4ee$var$Action = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                actionClass: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                actionType: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                actionLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                actionData: $05b01887df96c4ee$var$ActionData,
                padding: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.actionLength - t._currentOffset)
            }), $05b01887df96c4ee$var$PostcompensationAction = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($05b01887df96c4ee$var$Action, restructure__WEBPACK_IMPORTED_MODULE_0__.U7), $05b01887df96c4ee$var$PostCompensationTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                lookupTable: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$PostcompensationAction))
            }), $05b01887df96c4ee$var$JustificationTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                classTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$ClassTable, {
                    type: "parent"
                }),
                wdcOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                postCompensationTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$PostCompensationTable, {
                    type: "parent"
                }),
                widthDeltaClusters: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$WidthDeltaCluster, {
                    type: "parent",
                    relativeTo: (ctx)=>ctx.wdcOffset
                }))
            });
            var $05b01887df96c4ee$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                horizontal: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$JustificationTable),
                vertical: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05b01887df96c4ee$var$JustificationTable)
            });
            let $03ee6ebd54db1053$var$LigatureData = {
                action: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }, $03ee6ebd54db1053$var$ContextualData = {
                markIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                currentIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }, $03ee6ebd54db1053$var$InsertionData = {
                currentInsertIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                markedInsertIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL
            }, $03ee6ebd54db1053$var$SubstitutionTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                items: new $6cb7dd5f47d82580$export$c5af1eebc882e39a(new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$8351f8c2ae2f103c))
            }), $03ee6ebd54db1053$var$SubtableData = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS("type", {
                0: {
                    stateTable: new $6cb7dd5f47d82580$export$79f7d93d790934ba
                },
                1: {
                    stateTable: new $6cb7dd5f47d82580$export$79f7d93d790934ba($03ee6ebd54db1053$var$ContextualData),
                    substitutionTable: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $03ee6ebd54db1053$var$SubstitutionTable)
                },
                2: {
                    stateTable: new $6cb7dd5f47d82580$export$79f7d93d790934ba($03ee6ebd54db1053$var$LigatureData),
                    ligatureActions: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(restructure__WEBPACK_IMPORTED_MODULE_0__.U7)),
                    components: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(restructure__WEBPACK_IMPORTED_MODULE_0__.mL)),
                    ligatureList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(restructure__WEBPACK_IMPORTED_MODULE_0__.mL))
                },
                4: {
                    lookupTable: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c
                },
                5: {
                    stateTable: new $6cb7dd5f47d82580$export$79f7d93d790934ba($03ee6ebd54db1053$var$InsertionData),
                    insertionActions: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, new $6cb7dd5f47d82580$export$c5af1eebc882e39a(restructure__WEBPACK_IMPORTED_MODULE_0__.mL))
                }
            }), $03ee6ebd54db1053$var$Subtable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                coverage: restructure__WEBPACK_IMPORTED_MODULE_0__.Un,
                type: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                subFeatureFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                table: $03ee6ebd54db1053$var$SubtableData,
                padding: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, (t)=>t.length - t._currentOffset)
            }), $03ee6ebd54db1053$var$FeatureEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                featureType: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                featureSetting: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                enableFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                disableFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $03ee6ebd54db1053$var$MorxChain = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                defaultFlags: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                chainLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                nFeatureEntries: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                nSubtables: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                features: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($03ee6ebd54db1053$var$FeatureEntry, "nFeatureEntries"),
                subtables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($03ee6ebd54db1053$var$Subtable, "nSubtables")
            });
            var $03ee6ebd54db1053$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                unused: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                nChains: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                chains: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($03ee6ebd54db1053$var$MorxChain, "nChains")
            });
            let $b7492a80b0d1a056$var$OpticalBounds = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                left: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                top: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                right: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                bottom: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            });
            var $b7492a80b0d1a056$export$2e2bcd8739ae039 = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.E2,
                format: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                lookupTable: new $6cb7dd5f47d82580$export$8351f8c2ae2f103c($b7492a80b0d1a056$var$OpticalBounds)
            });
            let $c3395722bea751e2$var$tables = {};
            var $c3395722bea751e2$export$2e2bcd8739ae039 = $c3395722bea751e2$var$tables;
            $c3395722bea751e2$var$tables.cmap = $26a62205ad06574e$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.head = $f2612a29f92ac062$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.hhea = $2c179dd593583073$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.hmtx = $bdc9060542264b85$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.maxp = $dbf51cb3d3fe409d$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.name = $2bcf221753ec8e32$var$NameTable, $c3395722bea751e2$var$tables["OS/2"] = $84b272aa31b70606$var$OS2, $c3395722bea751e2$var$tables.post = $32d9e2eb9565d93c$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.fpgm = $5c0f37ca5ffb1850$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.loca = $2b2b260902b1c57e$var$loca, $c3395722bea751e2$var$tables.prep = $7afb878c7bea4f66$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables["cvt "] = $5202bd9d9ad8eaac$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.glyf = $6c92b6371bce8bd9$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables["CFF "] = $822ac0d589e4e237$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.CFF2 = $822ac0d589e4e237$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.VORG = $2bbf2bc1ce37cd8f$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.EBLC = $9911c4c7201c13de$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.CBLC = $c3395722bea751e2$var$tables.EBLC, $c3395722bea751e2$var$tables.sbix = $abb847051efd51b1$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.COLR = $eb629188f3dfefdd$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.CPAL = $08734b8e7dc64587$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.BASE = $497cef411d884e34$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.GDEF = $cf5f33c63ef209e6$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.GPOS = $47e0e8ef515d9903$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.GSUB = $d3f442064af66e06$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.JSTF = $71cfb3c4767fbd0c$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.HVAR = $d059a6bd2d3b5b63$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.DSIG = $dceeca3e1977ce30$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.gasp = $8acd740a9435aad0$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.hdmx = $b5f380243c34d6a0$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.kern = $ca2df1256966e313$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.LTSH = $7a9f92b0c46ebe33$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.PCLT = $2b2ccc419d152631$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.VDMX = $ca5b40b9bcda9c9b$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.vhea = $69530a3c40755af0$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.vmtx = $344073dd270f0e62$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.avar = $3793b781918cfced$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.bsln = $6a3746e8c708f5a3$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.feat = $d0c76fac617b308a$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.fvar = $e83fd065f00fcd01$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.gvar = $dbe33c8d3a7f131c$var$gvar, $c3395722bea751e2$var$tables.just = $05b01887df96c4ee$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.morx = $03ee6ebd54db1053$export$2e2bcd8739ae039, $c3395722bea751e2$var$tables.opbd = $b7492a80b0d1a056$export$2e2bcd8739ae039;
            let $816c07a04b6dba87$var$TableEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                checkSum: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                offset: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "void", {
                    type: "global"
                }),
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $816c07a04b6dba87$var$Directory = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                numTables: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                searchRange: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                entrySelector: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                rangeShift: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($816c07a04b6dba87$var$TableEntry, "numTables")
            });
            $816c07a04b6dba87$var$Directory.process = function() {
                let tables = {};
                for (let table of this.tables)tables[table.tag] = table;
                this.tables = tables;
            }, $816c07a04b6dba87$var$Directory.preEncode = function() {
                if (!Array.isArray(this.tables)) {
                    let tables = [];
                    for(let tag in this.tables){
                        let table = this.tables[tag];
                        table && tables.push({
                            tag: tag,
                            checkSum: 0,
                            offset: new restructure__WEBPACK_IMPORTED_MODULE_0__.ox($c3395722bea751e2$export$2e2bcd8739ae039[tag], table),
                            length: $c3395722bea751e2$export$2e2bcd8739ae039[tag].size(table)
                        });
                    }
                    this.tables = tables;
                }
                this.tag = "true", this.numTables = this.tables.length;
                let maxPowerOf2 = Math.pow(2, Math.floor(Math.log(this.numTables) / Math.LN2));
                this.searchRange = 16 * maxPowerOf2, this.entrySelector = Math.log(maxPowerOf2) / Math.LN2, this.rangeShift = 16 * this.numTables - this.searchRange;
            };
            var $816c07a04b6dba87$export$2e2bcd8739ae039 = $816c07a04b6dba87$var$Directory;
            function $12727730ddfc8bfe$export$2e0ae67339d5f1ac(arr, cmp) {
                let min = 0, max = arr.length - 1;
                for(; min <= max;){
                    let mid = min + max >> 1, res = cmp(arr[mid]);
                    if (res < 0) max = mid - 1;
                    else {
                        if (!(res > 0)) return mid;
                        min = mid + 1;
                    }
                }
                return -1;
            }
            function $12727730ddfc8bfe$export$d02631cccf789723(index, end) {
                let range1 = [];
                for(; index < end;)range1.push(index++);
                return range1;
            }
            const $12727730ddfc8bfe$export$3d28c1996ced1f14 = new TextDecoder("ascii"), $12727730ddfc8bfe$var$CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", $12727730ddfc8bfe$var$LOOKUP = new Uint8Array(256);
            for(let i = 0; i < $12727730ddfc8bfe$var$CHARS.length; i++)$12727730ddfc8bfe$var$LOOKUP[$12727730ddfc8bfe$var$CHARS.charCodeAt(i)] = i;
            function $12727730ddfc8bfe$export$94fdf11bafc8de6b(base64) {
                let bufferLength = 0.75 * base64.length;
                "=" === base64[base64.length - 1] && (bufferLength--, "=" === base64[base64.length - 2] && bufferLength--);
                let bytes = new Uint8Array(bufferLength), p = 0;
                for(let i1 = 0, len = base64.length; i1 < len; i1 += 4){
                    let encoded1 = $12727730ddfc8bfe$var$LOOKUP[base64.charCodeAt(i1)], encoded2 = $12727730ddfc8bfe$var$LOOKUP[base64.charCodeAt(i1 + 1)], encoded3 = $12727730ddfc8bfe$var$LOOKUP[base64.charCodeAt(i1 + 2)], encoded4 = $12727730ddfc8bfe$var$LOOKUP[base64.charCodeAt(i1 + 3)];
                    bytes[p++] = encoded1 << 2 | encoded2 >> 4, bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2, bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                }
                return bytes;
            }
            class $f08dd41ef10b694c$export$2e2bcd8739ae039 {
                findSubtable(cmapTable, pairs) {
                    for (let [platformID, encodingID] of pairs)for (let cmap of cmapTable.tables)if (cmap.platformID === platformID && cmap.encodingID === encodingID) return cmap.table;
                    return null;
                }
                lookup(codepoint, variationSelector) {
                    if (this.encoding) codepoint = this.encoding.get(codepoint) || codepoint;
                    else if (variationSelector) {
                        let gid = this.getVariationSelector(codepoint, variationSelector);
                        if (gid) return gid;
                    }
                    let cmap = this.cmap;
                    switch(cmap.version){
                        case 0:
                            return cmap.codeMap.get(codepoint) || 0;
                        case 4:
                            {
                                let min = 0, max = cmap.segCount - 1;
                                for(; min <= max;){
                                    let mid = min + max >> 1;
                                    if (codepoint < cmap.startCode.get(mid)) max = mid - 1;
                                    else if (codepoint > cmap.endCode.get(mid)) min = mid + 1;
                                    else {
                                        let gid1, rangeOffset = cmap.idRangeOffset.get(mid);
                                        if (0 === rangeOffset) gid1 = codepoint + cmap.idDelta.get(mid);
                                        else {
                                            let index = rangeOffset / 2 + (codepoint - cmap.startCode.get(mid)) - (cmap.segCount - mid);
                                            0 !== (gid1 = cmap.glyphIndexArray.get(index) || 0) && (gid1 += cmap.idDelta.get(mid));
                                        }
                                        return 0xffff & gid1;
                                    }
                                }
                                return 0;
                            }
                        case 8:
                            throw Error("TODO: cmap format 8");
                        case 6:
                        case 10:
                            return cmap.glyphIndices.get(codepoint - cmap.firstCode) || 0;
                        case 12:
                        case 13:
                            {
                                let min1 = 0, max1 = cmap.nGroups - 1;
                                for(; min1 <= max1;){
                                    let mid1 = min1 + max1 >> 1, group = cmap.groups.get(mid1);
                                    if (codepoint < group.startCharCode) max1 = mid1 - 1;
                                    else if (codepoint > group.endCharCode) min1 = mid1 + 1;
                                    else {
                                        if (12 === cmap.version) return group.glyphID + (codepoint - group.startCharCode);
                                        return group.glyphID;
                                    }
                                }
                                return 0;
                            }
                        case 14:
                            throw Error("TODO: cmap format 14");
                        default:
                            throw Error(`Unknown cmap format ${cmap.version}`);
                    }
                }
                getVariationSelector(codepoint, variationSelector) {
                    if (!this.uvs) return 0;
                    let selectors = this.uvs.varSelectors.toArray(), i = $12727730ddfc8bfe$export$2e0ae67339d5f1ac(selectors, (x)=>variationSelector - x.varSelector), sel = selectors[i];
                    return (-1 !== i && sel.defaultUVS && (i = $12727730ddfc8bfe$export$2e0ae67339d5f1ac(sel.defaultUVS, (x)=>codepoint < x.startUnicodeValue ? -1 : codepoint > x.startUnicodeValue + x.additionalCount ? 1 : 0)), -1 !== i && sel.nonDefaultUVS && -1 !== (i = $12727730ddfc8bfe$export$2e0ae67339d5f1ac(sel.nonDefaultUVS, (x)=>codepoint - x.unicodeValue))) ? sel.nonDefaultUVS[i].glyphID : 0;
                }
                getCharacterSet() {
                    let cmap = this.cmap;
                    switch(cmap.version){
                        case 0:
                            return $12727730ddfc8bfe$export$d02631cccf789723(0, cmap.codeMap.length);
                        case 4:
                            {
                                let res = [], endCodes = cmap.endCode.toArray();
                                for(let i = 0; i < endCodes.length; i++){
                                    let tail = endCodes[i] + 1, start = cmap.startCode.get(i);
                                    res.push(...$12727730ddfc8bfe$export$d02631cccf789723(start, tail));
                                }
                                return res;
                            }
                        case 8:
                            throw Error("TODO: cmap format 8");
                        case 6:
                        case 10:
                            return $12727730ddfc8bfe$export$d02631cccf789723(cmap.firstCode, cmap.firstCode + cmap.glyphIndices.length);
                        case 12:
                        case 13:
                            {
                                let res1 = [];
                                for (let group of cmap.groups.toArray())res1.push(...$12727730ddfc8bfe$export$d02631cccf789723(group.startCharCode, group.endCharCode + 1));
                                return res1;
                            }
                        case 14:
                            throw Error("TODO: cmap format 14");
                        default:
                            throw Error(`Unknown cmap format ${cmap.version}`);
                    }
                }
                codePointsForGlyph(gid) {
                    let cmap = this.cmap;
                    switch(cmap.version){
                        case 0:
                            {
                                let res = [];
                                for(let i = 0; i < 256; i++)cmap.codeMap.get(i) === gid && res.push(i);
                                return res;
                            }
                        case 4:
                            {
                                let res1 = [];
                                for(let i1 = 0; i1 < cmap.segCount; i1++){
                                    let end = cmap.endCode.get(i1), start = cmap.startCode.get(i1), rangeOffset = cmap.idRangeOffset.get(i1), delta = cmap.idDelta.get(i1);
                                    for(var c = start; c <= end; c++){
                                        let g = 0;
                                        if (0 === rangeOffset) g = c + delta;
                                        else {
                                            let index = rangeOffset / 2 + (c - start) - (cmap.segCount - i1);
                                            0 !== (g = cmap.glyphIndexArray.get(index) || 0) && (g += delta);
                                        }
                                        g === gid && res1.push(c);
                                    }
                                }
                                return res1;
                            }
                        case 12:
                            {
                                let res2 = [];
                                for (let group of cmap.groups.toArray())gid >= group.glyphID && gid <= group.glyphID + (group.endCharCode - group.startCharCode) && res2.push(group.startCharCode + (gid - group.glyphID));
                                return res2;
                            }
                        case 13:
                            {
                                let res3 = [];
                                for (let group1 of cmap.groups.toArray())gid === group1.glyphID && res3.push(...$12727730ddfc8bfe$export$d02631cccf789723(group1.startCharCode, group1.endCharCode + 1));
                                return res3;
                            }
                        default:
                            throw Error(`Unknown cmap format ${cmap.version}`);
                    }
                }
                constructor(cmapTable){
                    if (this.encoding = null, this.cmap = this.findSubtable(cmapTable, [
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
                    ]), !this.cmap) for (let cmap of cmapTable.tables){
                        let encoding = $e449ad78d50845fe$export$badc544e0651b6b1(cmap.platformID, cmap.encodingID, cmap.table.language - 1), mapping = $e449ad78d50845fe$export$1dceb3c14ed68bee(encoding);
                        mapping && (this.cmap = cmap.table, this.encoding = mapping);
                    }
                    if (!this.cmap) throw Error("Could not find a supported cmap table");
                    this.uvs = this.findSubtable(cmapTable, [
                        [
                            0,
                            5
                        ]
                    ]), this.uvs && 14 !== this.uvs.version && (this.uvs = null);
                }
            }
            (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f08dd41ef10b694c$export$2e2bcd8739ae039.prototype, "getCharacterSet", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f08dd41ef10b694c$export$2e2bcd8739ae039.prototype, "codePointsForGlyph", null);
            class $0bba3a9db57637f3$export$2e2bcd8739ae039 {
                process(glyphs, positions) {
                    for(let glyphIndex = 0; glyphIndex < glyphs.length - 1; glyphIndex++){
                        let left = glyphs[glyphIndex].id, right = glyphs[glyphIndex + 1].id;
                        positions[glyphIndex].xAdvance += this.getKerning(left, right);
                    }
                }
                getKerning(left, right) {
                    let res = 0;
                    for (let table of this.kern.tables){
                        if (table.coverage.crossStream) continue;
                        switch(table.version){
                            case 0:
                                if (!table.coverage.horizontal) continue;
                                break;
                            case 1:
                                if (table.coverage.vertical || table.coverage.variation) continue;
                                break;
                            default:
                                throw Error(`Unsupported kerning table version ${table.version}`);
                        }
                        let val = 0, s = table.subtable;
                        switch(table.format){
                            case 0:
                                let pairIdx = $12727730ddfc8bfe$export$2e0ae67339d5f1ac(s.pairs, function(pair) {
                                    return left - pair.left || right - pair.right;
                                });
                                pairIdx >= 0 && (val = s.pairs[pairIdx].value);
                                break;
                            case 2:
                                let leftOffset = 0, rightOffset = 0;
                                leftOffset = left >= s.leftTable.firstGlyph && left < s.leftTable.firstGlyph + s.leftTable.nGlyphs ? s.leftTable.offsets[left - s.leftTable.firstGlyph] : s.array.off, right >= s.rightTable.firstGlyph && right < s.rightTable.firstGlyph + s.rightTable.nGlyphs && (rightOffset = s.rightTable.offsets[right - s.rightTable.firstGlyph]);
                                let index = (leftOffset + rightOffset - s.array.off) / 2;
                                val = s.array.values.get(index);
                                break;
                            case 3:
                                if (left >= s.glyphCount || right >= s.glyphCount) return 0;
                                val = s.kernValue[s.kernIndex[s.leftClass[left] * s.rightClassCount + s.rightClass[right]]];
                                break;
                            default:
                                throw Error(`Unsupported kerning sub-table format ${table.format}`);
                        }
                        table.coverage.override ? res = val : res += val;
                    }
                    return res;
                }
                constructor(font){
                    this.kern = font.kern;
                }
            }
            class $0a4bdfeb6dfd6f5e$export$2e2bcd8739ae039 {
                positionGlyphs(glyphs, positions) {
                    let clusterStart = 0, clusterEnd = 0;
                    for(let index = 0; index < glyphs.length; index++)glyphs[index].isMark ? clusterEnd = index : (clusterStart !== clusterEnd && this.positionCluster(glyphs, positions, clusterStart, clusterEnd), clusterStart = clusterEnd = index);
                    return clusterStart !== clusterEnd && this.positionCluster(glyphs, positions, clusterStart, clusterEnd), positions;
                }
                positionCluster(glyphs, positions, clusterStart, clusterEnd) {
                    let base = glyphs[clusterStart], baseBox = base.cbox.copy();
                    base.codePoints.length > 1 && (baseBox.minX += (base.codePoints.length - 1) * baseBox.width / base.codePoints.length);
                    let xOffset = -positions[clusterStart].xAdvance, yOffset = 0, yGap = this.font.unitsPerEm / 16;
                    for(let index = clusterStart + 1; index <= clusterEnd; index++){
                        let mark = glyphs[index], markBox = mark.cbox, position = positions[index], combiningClass = this.getCombiningClass(mark.codePoints[0]);
                        if ("Not_Reordered" !== combiningClass) {
                            switch(position.xOffset = position.yOffset = 0, combiningClass){
                                case "Double_Above":
                                case "Double_Below":
                                    position.xOffset += baseBox.minX - markBox.width / 2 - markBox.minX;
                                    break;
                                case "Attached_Below_Left":
                                case "Below_Left":
                                case "Above_Left":
                                    position.xOffset += baseBox.minX - markBox.minX;
                                    break;
                                case "Attached_Above_Right":
                                case "Below_Right":
                                case "Above_Right":
                                    position.xOffset += baseBox.maxX - markBox.width - markBox.minX;
                                    break;
                                default:
                                    position.xOffset += baseBox.minX + (baseBox.width - markBox.width) / 2 - markBox.minX;
                            }
                            switch(combiningClass){
                                case "Double_Below":
                                case "Below_Left":
                                case "Below":
                                case "Below_Right":
                                case "Attached_Below_Left":
                                case "Attached_Below":
                                    ("Attached_Below_Left" === combiningClass || "Attached_Below" === combiningClass) && (baseBox.minY += yGap), position.yOffset = -baseBox.minY - markBox.maxY, baseBox.minY += markBox.height;
                                    break;
                                case "Double_Above":
                                case "Above_Left":
                                case "Above":
                                case "Above_Right":
                                case "Attached_Above":
                                case "Attached_Above_Right":
                                    ("Attached_Above" === combiningClass || "Attached_Above_Right" === combiningClass) && (baseBox.maxY += yGap), position.yOffset = baseBox.maxY - markBox.minY, baseBox.maxY += markBox.height;
                            }
                            position.xAdvance = position.yAdvance = 0, position.xOffset += xOffset, position.yOffset += yOffset;
                        } else xOffset -= position.xAdvance, yOffset -= position.yAdvance;
                    }
                }
                getCombiningClass(codePoint) {
                    let combiningClass = (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.gy)(codePoint);
                    if ((-256 & codePoint) == 0x0e00) {
                        if ("Not_Reordered" === combiningClass) switch(codePoint){
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
                        else if (0x0e3a === codePoint) return "Below_Right";
                    }
                    switch(combiningClass){
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
                        case "CCC29":
                        case "CCC32":
                        case "CCC118":
                        case "CCC129":
                        case "CCC132":
                            return "Below";
                        case "CCC23":
                            return "Attached_Above";
                        case "CCC24":
                        case "CCC107":
                            return "Above_Right";
                        case "CCC25":
                        case "CCC19":
                            return "Above_Left";
                        case "CCC26":
                        case "CCC27":
                        case "CCC28":
                        case "CCC30":
                        case "CCC31":
                        case "CCC33":
                        case "CCC34":
                        case "CCC35":
                        case "CCC36":
                        case "CCC122":
                        case "CCC130":
                            return "Above";
                        case "CCC21":
                            break;
                        case "CCC103":
                            return "Below_Right";
                    }
                    return combiningClass;
                }
                constructor(font){
                    this.font = font;
                }
            }
            class $f34600ab9d7f70d8$export$2e2bcd8739ae039 {
                get width() {
                    return this.maxX - this.minX;
                }
                get height() {
                    return this.maxY - this.minY;
                }
                addPoint(x, y) {
                    Math.abs(x) !== 1 / 0 && (x < this.minX && (this.minX = x), x > this.maxX && (this.maxX = x)), Math.abs(y) !== 1 / 0 && (y < this.minY && (this.minY = y), y > this.maxY && (this.maxY = y));
                }
                copy() {
                    return new $f34600ab9d7f70d8$export$2e2bcd8739ae039(this.minX, this.minY, this.maxX, this.maxY);
                }
                constructor(minX = 1 / 0, minY = 1 / 0, maxX = -1 / 0, maxY = -1 / 0){
                    this.minX = minX, this.minY = minY, this.maxX = maxX, this.maxY = maxY;
                }
            }
            const $130d1a642ebcd2b7$var$UNICODE_SCRIPTS = {
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
            }, $130d1a642ebcd2b7$var$OPENTYPE_SCRIPTS = {};
            for(let script in $130d1a642ebcd2b7$var$UNICODE_SCRIPTS){
                let tag = $130d1a642ebcd2b7$var$UNICODE_SCRIPTS[script];
                if (Array.isArray(tag)) for (let t of tag)$130d1a642ebcd2b7$var$OPENTYPE_SCRIPTS[t] = script;
                else $130d1a642ebcd2b7$var$OPENTYPE_SCRIPTS[tag] = script;
            }
            function $130d1a642ebcd2b7$export$ce50e82f12a827a4(tag) {
                return $130d1a642ebcd2b7$var$OPENTYPE_SCRIPTS[tag];
            }
            function $130d1a642ebcd2b7$export$e5cb25e204fb8450(string) {
                let len = string.length, idx = 0;
                for(; idx < len;){
                    let code = string.charCodeAt(idx++);
                    if (0xd800 <= code && code <= 0xdbff && idx < len) {
                        let next = string.charCodeAt(idx);
                        0xdc00 <= next && next <= 0xdfff && (idx++, code = ((0x3FF & code) << 10) + (0x3FF & next) + 0x10000);
                    }
                    let script2 = (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.iM)(code);
                    if ("Common" !== script2 && "Inherited" !== script2 && "Unknown" !== script2) return $130d1a642ebcd2b7$var$UNICODE_SCRIPTS[script2];
                }
                return $130d1a642ebcd2b7$var$UNICODE_SCRIPTS.Unknown;
            }
            function $130d1a642ebcd2b7$export$16fab0757cfc223d(codePoints) {
                for(let i = 0; i < codePoints.length; i++){
                    let codePoint = codePoints[i], script3 = (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.iM)(codePoint);
                    if ("Common" !== script3 && "Inherited" !== script3 && "Unknown" !== script3) return $130d1a642ebcd2b7$var$UNICODE_SCRIPTS[script3];
                }
                return $130d1a642ebcd2b7$var$UNICODE_SCRIPTS.Unknown;
            }
            const $130d1a642ebcd2b7$var$RTL = {
                arab: !0,
                hebr: !0,
                syrc: !0,
                thaa: !0,
                cprt: !0,
                khar: !0,
                phnx: !0,
                "nko ": !0,
                lydi: !0,
                avst: !0,
                armi: !0,
                phli: !0,
                prti: !0,
                sarb: !0,
                orkh: !0,
                samr: !0,
                mand: !0,
                merc: !0,
                mero: !0,
                mani: !0,
                mend: !0,
                nbat: !0,
                narb: !0,
                palm: !0,
                phlp: !0
            };
            function $130d1a642ebcd2b7$export$9fddb9d0dd7d8a54(script4) {
                return $130d1a642ebcd2b7$var$RTL[script4] ? "rtl" : "ltr";
            }
            class $be07b3e97a42687a$export$2e2bcd8739ae039 {
                get advanceWidth() {
                    let width = 0;
                    for (let position of this.positions)width += position.xAdvance;
                    return width;
                }
                get advanceHeight() {
                    let height = 0;
                    for (let position of this.positions)height += position.yAdvance;
                    return height;
                }
                get bbox() {
                    let bbox = new $f34600ab9d7f70d8$export$2e2bcd8739ae039, x = 0, y = 0;
                    for(let index = 0; index < this.glyphs.length; index++){
                        let glyph = this.glyphs[index], p = this.positions[index], b = glyph.bbox;
                        bbox.addPoint(b.minX + x + p.xOffset, b.minY + y + p.yOffset), bbox.addPoint(b.maxX + x + p.xOffset, b.maxY + y + p.yOffset), x += p.xAdvance, y += p.yAdvance;
                    }
                    return bbox;
                }
                constructor(glyphs, features, script, language, direction){
                    if (this.glyphs = glyphs, this.positions = null, this.script = script, this.language = language || null, this.direction = direction || $130d1a642ebcd2b7$export$9fddb9d0dd7d8a54(script), this.features = {}, Array.isArray(features)) for (let tag of features)this.features[tag] = !0;
                    else "object" == typeof features && (this.features = features);
                }
            }
            class $1ac75d9a55b67f01$export$2e2bcd8739ae039 {
                constructor(xAdvance = 0, yAdvance = 0, xOffset = 0, yOffset = 0){
                    this.xAdvance = xAdvance, this.yAdvance = yAdvance, this.xOffset = xOffset, this.yOffset = yOffset;
                }
            }
            const $3b6302b64eccc32c$var$features = {
                allTypographicFeatures: {
                    code: 0,
                    exclusive: !1,
                    allTypeFeatures: 0
                },
                ligatures: {
                    code: 1,
                    exclusive: !1,
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
                    exclusive: !0,
                    unconnected: 0,
                    partiallyConnected: 1,
                    cursive: 2
                },
                letterCase: {
                    code: 3,
                    exclusive: !0
                },
                verticalSubstitution: {
                    code: 4,
                    exclusive: !1,
                    substituteVerticalForms: 0
                },
                linguisticRearrangement: {
                    code: 5,
                    exclusive: !1,
                    linguisticRearrangement: 0
                },
                numberSpacing: {
                    code: 6,
                    exclusive: !0,
                    monospacedNumbers: 0,
                    proportionalNumbers: 1,
                    thirdWidthNumbers: 2,
                    quarterWidthNumbers: 3
                },
                smartSwash: {
                    code: 8,
                    exclusive: !1,
                    wordInitialSwashes: 0,
                    wordFinalSwashes: 2,
                    nonFinalSwashes: 8
                },
                diacritics: {
                    code: 9,
                    exclusive: !0,
                    showDiacritics: 0,
                    hideDiacritics: 1,
                    decomposeDiacritics: 2
                },
                verticalPosition: {
                    code: 10,
                    exclusive: !0,
                    normalPosition: 0,
                    superiors: 1,
                    inferiors: 2,
                    ordinals: 3,
                    scientificInferiors: 4
                },
                fractions: {
                    code: 11,
                    exclusive: !0,
                    noFractions: 0,
                    verticalFractions: 1,
                    diagonalFractions: 2
                },
                overlappingCharacters: {
                    code: 13,
                    exclusive: !1,
                    preventOverlap: 0
                },
                typographicExtras: {
                    code: 14,
                    exclusive: !1,
                    slashedZero: 4
                },
                mathematicalExtras: {
                    code: 15,
                    exclusive: !1,
                    mathematicalGreek: 10
                },
                ornamentSets: {
                    code: 16,
                    exclusive: !0,
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
                    exclusive: !0,
                    noAlternates: 0
                },
                designComplexity: {
                    code: 18,
                    exclusive: !0,
                    designLevel1: 0,
                    designLevel2: 1,
                    designLevel3: 2,
                    designLevel4: 3,
                    designLevel5: 4
                },
                styleOptions: {
                    code: 19,
                    exclusive: !0,
                    noStyleOptions: 0,
                    displayText: 1,
                    engravedText: 2,
                    illuminatedCaps: 3,
                    titlingCaps: 4,
                    tallCaps: 5
                },
                characterShape: {
                    code: 20,
                    exclusive: !0,
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
                    exclusive: !0,
                    lowerCaseNumbers: 0,
                    upperCaseNumbers: 1
                },
                textSpacing: {
                    code: 22,
                    exclusive: !0,
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
                    exclusive: !0,
                    noTransliteration: 0
                },
                annotation: {
                    code: 24,
                    exclusive: !0,
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
                    exclusive: !0,
                    fullWidthKana: 0,
                    proportionalKana: 1
                },
                ideographicSpacing: {
                    code: 26,
                    exclusive: !0,
                    fullWidthIdeographs: 0,
                    proportionalIdeographs: 1,
                    halfWidthIdeographs: 2
                },
                unicodeDecomposition: {
                    code: 27,
                    exclusive: !1,
                    canonicalComposition: 0,
                    compatibilityComposition: 2,
                    transcodingComposition: 4
                },
                rubyKana: {
                    code: 28,
                    exclusive: !1,
                    rubyKana: 2
                },
                CJKSymbolAlternatives: {
                    code: 29,
                    exclusive: !0,
                    noCJKSymbolAlternatives: 0,
                    CJKSymbolAltOne: 1,
                    CJKSymbolAltTwo: 2,
                    CJKSymbolAltThree: 3,
                    CJKSymbolAltFour: 4,
                    CJKSymbolAltFive: 5
                },
                ideographicAlternatives: {
                    code: 30,
                    exclusive: !0,
                    noIdeographicAlternatives: 0,
                    ideographicAltOne: 1,
                    ideographicAltTwo: 2,
                    ideographicAltThree: 3,
                    ideographicAltFour: 4,
                    ideographicAltFive: 5
                },
                CJKVerticalRomanPlacement: {
                    code: 31,
                    exclusive: !0,
                    CJKVerticalRomanCentered: 0,
                    CJKVerticalRomanHBaseline: 1
                },
                italicCJKRoman: {
                    code: 32,
                    exclusive: !1,
                    CJKItalicRoman: 2
                },
                caseSensitiveLayout: {
                    code: 33,
                    exclusive: !1,
                    caseSensitiveLayout: 0,
                    caseSensitiveSpacing: 2
                },
                alternateKana: {
                    code: 34,
                    exclusive: !1,
                    alternateHorizKana: 0,
                    alternateVertKana: 2
                },
                stylisticAlternatives: {
                    code: 35,
                    exclusive: !1,
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
                    exclusive: !1,
                    contextualAlternates: 0,
                    swashAlternates: 2,
                    contextualSwashAlternates: 4
                },
                lowerCase: {
                    code: 37,
                    exclusive: !0,
                    defaultLowerCase: 0,
                    lowerCaseSmallCaps: 1,
                    lowerCasePetiteCaps: 2
                },
                upperCase: {
                    code: 38,
                    exclusive: !0,
                    defaultUpperCase: 0,
                    upperCaseSmallCaps: 1,
                    upperCasePetiteCaps: 2
                },
                languageTag: {
                    code: 39,
                    exclusive: !0
                },
                CJKRomanSpacing: {
                    code: 103,
                    exclusive: !0,
                    halfWidthCJKRoman: 0,
                    proportionalCJKRoman: 1,
                    defaultCJKRoman: 2,
                    fullWidthCJKRoman: 3
                }
            }, $3b6302b64eccc32c$var$feature = (name, selector)=>[
                    $3b6302b64eccc32c$var$features[name].code,
                    $3b6302b64eccc32c$var$features[name][selector]
                ], $3b6302b64eccc32c$var$OTMapping = {
                rlig: $3b6302b64eccc32c$var$feature("ligatures", "requiredLigatures"),
                clig: $3b6302b64eccc32c$var$feature("ligatures", "contextualLigatures"),
                dlig: $3b6302b64eccc32c$var$feature("ligatures", "rareLigatures"),
                hlig: $3b6302b64eccc32c$var$feature("ligatures", "historicalLigatures"),
                liga: $3b6302b64eccc32c$var$feature("ligatures", "commonLigatures"),
                hist: $3b6302b64eccc32c$var$feature("ligatures", "historicalLigatures"),
                smcp: $3b6302b64eccc32c$var$feature("lowerCase", "lowerCaseSmallCaps"),
                pcap: $3b6302b64eccc32c$var$feature("lowerCase", "lowerCasePetiteCaps"),
                frac: $3b6302b64eccc32c$var$feature("fractions", "diagonalFractions"),
                dnom: $3b6302b64eccc32c$var$feature("fractions", "diagonalFractions"),
                numr: $3b6302b64eccc32c$var$feature("fractions", "diagonalFractions"),
                afrc: $3b6302b64eccc32c$var$feature("fractions", "verticalFractions"),
                case: $3b6302b64eccc32c$var$feature("caseSensitiveLayout", "caseSensitiveLayout"),
                ccmp: $3b6302b64eccc32c$var$feature("unicodeDecomposition", "canonicalComposition"),
                cpct: $3b6302b64eccc32c$var$feature("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
                valt: $3b6302b64eccc32c$var$feature("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
                swsh: $3b6302b64eccc32c$var$feature("contextualAlternates", "swashAlternates"),
                cswh: $3b6302b64eccc32c$var$feature("contextualAlternates", "contextualSwashAlternates"),
                curs: $3b6302b64eccc32c$var$feature("cursiveConnection", "cursive"),
                c2pc: $3b6302b64eccc32c$var$feature("upperCase", "upperCasePetiteCaps"),
                c2sc: $3b6302b64eccc32c$var$feature("upperCase", "upperCaseSmallCaps"),
                init: $3b6302b64eccc32c$var$feature("smartSwash", "wordInitialSwashes"),
                fin2: $3b6302b64eccc32c$var$feature("smartSwash", "wordFinalSwashes"),
                medi: $3b6302b64eccc32c$var$feature("smartSwash", "nonFinalSwashes"),
                med2: $3b6302b64eccc32c$var$feature("smartSwash", "nonFinalSwashes"),
                fin3: $3b6302b64eccc32c$var$feature("smartSwash", "wordFinalSwashes"),
                fina: $3b6302b64eccc32c$var$feature("smartSwash", "wordFinalSwashes"),
                pkna: $3b6302b64eccc32c$var$feature("kanaSpacing", "proportionalKana"),
                half: $3b6302b64eccc32c$var$feature("textSpacing", "halfWidthText"),
                halt: $3b6302b64eccc32c$var$feature("textSpacing", "altHalfWidthText"),
                hkna: $3b6302b64eccc32c$var$feature("alternateKana", "alternateHorizKana"),
                vkna: $3b6302b64eccc32c$var$feature("alternateKana", "alternateVertKana"),
                ital: $3b6302b64eccc32c$var$feature("italicCJKRoman", "CJKItalicRoman"),
                lnum: $3b6302b64eccc32c$var$feature("numberCase", "upperCaseNumbers"),
                onum: $3b6302b64eccc32c$var$feature("numberCase", "lowerCaseNumbers"),
                mgrk: $3b6302b64eccc32c$var$feature("mathematicalExtras", "mathematicalGreek"),
                calt: $3b6302b64eccc32c$var$feature("contextualAlternates", "contextualAlternates"),
                vrt2: $3b6302b64eccc32c$var$feature("verticalSubstitution", "substituteVerticalForms"),
                vert: $3b6302b64eccc32c$var$feature("verticalSubstitution", "substituteVerticalForms"),
                tnum: $3b6302b64eccc32c$var$feature("numberSpacing", "monospacedNumbers"),
                pnum: $3b6302b64eccc32c$var$feature("numberSpacing", "proportionalNumbers"),
                sups: $3b6302b64eccc32c$var$feature("verticalPosition", "superiors"),
                subs: $3b6302b64eccc32c$var$feature("verticalPosition", "inferiors"),
                ordn: $3b6302b64eccc32c$var$feature("verticalPosition", "ordinals"),
                pwid: $3b6302b64eccc32c$var$feature("textSpacing", "proportionalText"),
                hwid: $3b6302b64eccc32c$var$feature("textSpacing", "halfWidthText"),
                qwid: $3b6302b64eccc32c$var$feature("textSpacing", "quarterWidthText"),
                twid: $3b6302b64eccc32c$var$feature("textSpacing", "thirdWidthText"),
                fwid: $3b6302b64eccc32c$var$feature("textSpacing", "proportionalText"),
                palt: $3b6302b64eccc32c$var$feature("textSpacing", "altProportionalText"),
                trad: $3b6302b64eccc32c$var$feature("characterShape", "traditionalCharacters"),
                smpl: $3b6302b64eccc32c$var$feature("characterShape", "simplifiedCharacters"),
                jp78: $3b6302b64eccc32c$var$feature("characterShape", "JIS1978Characters"),
                jp83: $3b6302b64eccc32c$var$feature("characterShape", "JIS1983Characters"),
                jp90: $3b6302b64eccc32c$var$feature("characterShape", "JIS1990Characters"),
                jp04: $3b6302b64eccc32c$var$feature("characterShape", "JIS2004Characters"),
                expt: $3b6302b64eccc32c$var$feature("characterShape", "expertCharacters"),
                hojo: $3b6302b64eccc32c$var$feature("characterShape", "hojoCharacters"),
                nlck: $3b6302b64eccc32c$var$feature("characterShape", "NLCCharacters"),
                tnam: $3b6302b64eccc32c$var$feature("characterShape", "traditionalNamesCharacters"),
                ruby: $3b6302b64eccc32c$var$feature("rubyKana", "rubyKana"),
                titl: $3b6302b64eccc32c$var$feature("styleOptions", "titlingCaps"),
                zero: $3b6302b64eccc32c$var$feature("typographicExtras", "slashedZero"),
                ss01: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltOne"),
                ss02: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltTwo"),
                ss03: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltThree"),
                ss04: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltFour"),
                ss05: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltFive"),
                ss06: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltSix"),
                ss07: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltSeven"),
                ss08: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltEight"),
                ss09: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltNine"),
                ss10: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltTen"),
                ss11: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltEleven"),
                ss12: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltTwelve"),
                ss13: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltThirteen"),
                ss14: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltFourteen"),
                ss15: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltFifteen"),
                ss16: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltSixteen"),
                ss17: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltSeventeen"),
                ss18: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltEighteen"),
                ss19: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltNineteen"),
                ss20: $3b6302b64eccc32c$var$feature("stylisticAlternatives", "stylisticAltTwenty")
            };
            for(let i1 = 1; i1 <= 99; i1++)$3b6302b64eccc32c$var$OTMapping[`cv${`00${i1}`.slice(-2)}`] = [
                $3b6302b64eccc32c$var$features.characterAlternatives.code,
                i1
            ];
            let $3b6302b64eccc32c$var$AATMapping = {};
            for(let ot in $3b6302b64eccc32c$var$OTMapping){
                let aat = $3b6302b64eccc32c$var$OTMapping[ot];
                null == $3b6302b64eccc32c$var$AATMapping[aat[0]] && ($3b6302b64eccc32c$var$AATMapping[aat[0]] = {}), $3b6302b64eccc32c$var$AATMapping[aat[0]][aat[1]] = ot;
            }
            function $3b6302b64eccc32c$export$b813f7d2a1677c16(features1) {
                let res = {};
                for(let k in features1){
                    let r;
                    (r = $3b6302b64eccc32c$var$OTMapping[k]) && (null == res[r[0]] && (res[r[0]] = {}), res[r[0]][r[1]] = features1[k]);
                }
                return res;
            }
            function $3b6302b64eccc32c$var$mapFeatureStrings(f) {
                let [type, setting] = f;
                if (isNaN(type)) var typeCode = $3b6302b64eccc32c$var$features[type] && $3b6302b64eccc32c$var$features[type].code;
                else var typeCode = type;
                if (isNaN(setting)) var settingCode = $3b6302b64eccc32c$var$features[type] && $3b6302b64eccc32c$var$features[type][setting];
                else var settingCode = setting;
                return [
                    typeCode,
                    settingCode
                ];
            }
            function $3b6302b64eccc32c$export$bd6df347a4f391c4(features2) {
                let res = {};
                if (Array.isArray(features2)) for(let k = 0; k < features2.length; k++){
                    let r, f = $3b6302b64eccc32c$var$mapFeatureStrings(features2[k]);
                    (r = $3b6302b64eccc32c$var$AATMapping[f[0]] && $3b6302b64eccc32c$var$AATMapping[f[0]][f[1]]) && (res[r] = !0);
                }
                else if ("object" == typeof features2) for(let type in features2){
                    let feature1 = features2[type];
                    for(let setting in feature1){
                        let r1, f1 = $3b6302b64eccc32c$var$mapFeatureStrings([
                            type,
                            setting
                        ]);
                        feature1[setting] && (r1 = $3b6302b64eccc32c$var$AATMapping[f1[0]] && $3b6302b64eccc32c$var$AATMapping[f1[0]][f1[1]]) && (res[r1] = !0);
                    }
                }
                return Object.keys(res);
            }
            class $ff5ce077dae0f144$export$2e2bcd8739ae039 {
                lookup(glyph) {
                    switch(this.table.version){
                        case 0:
                            return this.table.values.getItem(glyph);
                        case 2:
                        case 4:
                            {
                                let min = 0, max = this.table.binarySearchHeader.nUnits - 1;
                                for(; min <= max;){
                                    var mid = min + max >> 1, seg = this.table.segments[mid];
                                    if (0xffff === seg.firstGlyph) break;
                                    if (glyph < seg.firstGlyph) max = mid - 1;
                                    else if (glyph > seg.lastGlyph) min = mid + 1;
                                    else {
                                        if (2 === this.table.version) return seg.value;
                                        return seg.values[glyph - seg.firstGlyph];
                                    }
                                }
                                return null;
                            }
                        case 6:
                            {
                                let min1 = 0, max1 = this.table.binarySearchHeader.nUnits - 1;
                                for(; min1 <= max1;){
                                    var mid = min1 + max1 >> 1, seg = this.table.segments[mid];
                                    if (0xffff === seg.glyph) break;
                                    if (glyph < seg.glyph) max1 = mid - 1;
                                    else {
                                        if (!(glyph > seg.glyph)) return seg.value;
                                        min1 = mid + 1;
                                    }
                                }
                                return null;
                            }
                        case 8:
                            return this.table.values[glyph - this.table.firstGlyph];
                        default:
                            throw Error(`Unknown lookup table format: ${this.table.version}`);
                    }
                }
                glyphsForValue(classValue) {
                    let res = [];
                    switch(this.table.version){
                        case 2:
                        case 4:
                            for (let segment of this.table.segments)if (2 === this.table.version && segment.value === classValue) res.push(...$12727730ddfc8bfe$export$d02631cccf789723(segment.firstGlyph, segment.lastGlyph + 1));
                            else for(let index = 0; index < segment.values.length; index++)segment.values[index] === classValue && res.push(segment.firstGlyph + index);
                            break;
                        case 6:
                            for (let segment1 of this.table.segments)segment1.value === classValue && res.push(segment1.glyph);
                            break;
                        case 8:
                            for(let i = 0; i < this.table.values.length; i++)this.table.values[i] === classValue && res.push(this.table.firstGlyph + i);
                            break;
                        default:
                            throw Error(`Unknown lookup table format: ${this.table.version}`);
                    }
                    return res;
                }
                constructor(table){
                    this.table = table;
                }
            }
            (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $ff5ce077dae0f144$export$2e2bcd8739ae039.prototype, "glyphsForValue", null);
            const $50c7aac9316f2948$var$END_OF_TEXT_CLASS = 0, $50c7aac9316f2948$var$OUT_OF_BOUNDS_CLASS = 1, $50c7aac9316f2948$var$DELETED_GLYPH_CLASS = 2;
            class $50c7aac9316f2948$export$2e2bcd8739ae039 {
                process(glyphs, reverse, processEntry) {
                    let currentState = 0, index = reverse ? glyphs.length - 1 : 0, dir = reverse ? -1 : 1;
                    for(; 1 === dir && index <= glyphs.length || -1 === dir && index >= -1;){
                        let glyph = null, classCode = $50c7aac9316f2948$var$OUT_OF_BOUNDS_CLASS, shouldAdvance = !0;
                        index === glyphs.length || -1 === index ? classCode = $50c7aac9316f2948$var$END_OF_TEXT_CLASS : 0xffff === (glyph = glyphs[index]).id ? classCode = $50c7aac9316f2948$var$DELETED_GLYPH_CLASS : null == (classCode = this.lookupTable.lookup(glyph.id)) && (classCode = $50c7aac9316f2948$var$OUT_OF_BOUNDS_CLASS);
                        let entryIndex = this.stateTable.stateArray.getItem(currentState)[classCode], entry = this.stateTable.entryTable.getItem(entryIndex);
                        classCode !== $50c7aac9316f2948$var$END_OF_TEXT_CLASS && classCode !== $50c7aac9316f2948$var$DELETED_GLYPH_CLASS && (processEntry(glyph, entry, index), shouldAdvance = !(0x4000 & entry.flags)), currentState = entry.newState, shouldAdvance && (index += dir);
                    }
                    return glyphs;
                }
                traverse(opts, state = 0, visited = new Set) {
                    if (visited.has(state)) return;
                    visited.add(state);
                    let { nClasses: nClasses , stateArray: stateArray , entryTable: entryTable  } = this.stateTable, row = stateArray.getItem(state);
                    for(let classCode = 4; classCode < nClasses; classCode++){
                        let entryIndex = row[classCode], entry = entryTable.getItem(entryIndex);
                        for (let glyph of this.lookupTable.glyphsForValue(classCode))opts.enter && opts.enter(glyph, entry), 0 !== entry.newState && this.traverse(opts, entry.newState, visited), opts.exit && opts.exit(glyph, entry);
                    }
                }
                constructor(stateTable){
                    this.stateTable = stateTable, this.lookupTable = new $ff5ce077dae0f144$export$2e2bcd8739ae039(stateTable.classTable);
                }
            }
            const $55f71433a605c87d$var$SET_MARK = 0x8000, $55f71433a605c87d$var$REVERSE_DIRECTION = 0x400000;
            class $55f71433a605c87d$export$2e2bcd8739ae039 {
                process(glyphs, features = {}) {
                    for (let chain of this.morx.chains){
                        let flags = chain.defaultFlags;
                        for (let feature of chain.features){
                            let f;
                            (f = features[feature.featureType]) && (f[feature.featureSetting] ? (flags &= feature.disableFlags, flags |= feature.enableFlags) : !1 === f[feature.featureSetting] && (flags |= ~feature.disableFlags, flags &= ~feature.enableFlags));
                        }
                        for (let subtable of chain.subtables)subtable.subFeatureFlags & flags && this.processSubtable(subtable, glyphs);
                    }
                    let index = glyphs.length - 1;
                    for(; index >= 0;)0xffff === glyphs[index].id && glyphs.splice(index, 1), index--;
                    return glyphs;
                }
                processSubtable(subtable, glyphs) {
                    if (this.subtable = subtable, this.glyphs = glyphs, 4 === this.subtable.type) {
                        this.processNoncontextualSubstitutions(this.subtable, this.glyphs);
                        return;
                    }
                    this.ligatureStack = [], this.markedGlyph = null, this.firstGlyph = null, this.lastGlyph = null, this.markedIndex = null;
                    let stateMachine = this.getStateMachine(subtable), process = this.getProcessor(), reverse = !!(this.subtable.coverage & $55f71433a605c87d$var$REVERSE_DIRECTION);
                    return stateMachine.process(this.glyphs, reverse, process);
                }
                getStateMachine(subtable) {
                    return new $50c7aac9316f2948$export$2e2bcd8739ae039(subtable.table.stateTable);
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
                            throw Error(`Invalid morx subtable type: ${this.subtable.type}`);
                    }
                }
                processIndicRearragement(glyph, entry, index) {
                    0x8000 & entry.flags && (this.firstGlyph = index), 0x2000 & entry.flags && (this.lastGlyph = index), $55f71433a605c87d$var$reorderGlyphs(this.glyphs, 0x000F & entry.flags, this.firstGlyph, this.lastGlyph);
                }
                processContextualSubstitution(glyph, entry, index) {
                    let subsitutions = this.subtable.table.substitutionTable.items;
                    if (0xffff !== entry.markIndex) {
                        let lookup = subsitutions.getItem(entry.markIndex), lookupTable = new $ff5ce077dae0f144$export$2e2bcd8739ae039(lookup);
                        glyph = this.glyphs[this.markedGlyph];
                        var gid = lookupTable.lookup(glyph.id);
                        gid && (this.glyphs[this.markedGlyph] = this.font.getGlyph(gid, glyph.codePoints));
                    }
                    if (0xffff !== entry.currentIndex) {
                        let lookup1 = subsitutions.getItem(entry.currentIndex), lookupTable1 = new $ff5ce077dae0f144$export$2e2bcd8739ae039(lookup1);
                        glyph = this.glyphs[index];
                        var gid = lookupTable1.lookup(glyph.id);
                        gid && (this.glyphs[index] = this.font.getGlyph(gid, glyph.codePoints));
                    }
                    entry.flags & $55f71433a605c87d$var$SET_MARK && (this.markedGlyph = index);
                }
                processLigature(glyph, entry, index) {
                    if (0x8000 & entry.flags && this.ligatureStack.push(index), 0x2000 & entry.flags) {
                        let actions = this.subtable.table.ligatureActions, components = this.subtable.table.components, ligatureList = this.subtable.table.ligatureList, actionIndex = entry.action, last = !1, ligatureIndex = 0, codePoints = [], ligatureGlyphs = [];
                        for(; !last;){
                            let componentGlyph = this.ligatureStack.pop();
                            codePoints.unshift(...this.glyphs[componentGlyph].codePoints);
                            let action = actions.getItem(actionIndex++);
                            last = !!(0x80000000 & action);
                            let store = !!(0x40000000 & action), offset = (0x3FFFFFFF & action) << 2 >> 2;
                            if (offset += this.glyphs[componentGlyph].id, ligatureIndex += components.getItem(offset), last || store) {
                                let ligatureEntry = ligatureList.getItem(ligatureIndex);
                                this.glyphs[componentGlyph] = this.font.getGlyph(ligatureEntry, codePoints), ligatureGlyphs.push(componentGlyph), ligatureIndex = 0, codePoints = [];
                            } else this.glyphs[componentGlyph] = this.font.getGlyph(0xffff);
                        }
                        this.ligatureStack.push(...ligatureGlyphs);
                    }
                }
                processNoncontextualSubstitutions(subtable, glyphs, index) {
                    let lookupTable = new $ff5ce077dae0f144$export$2e2bcd8739ae039(subtable.table.lookupTable);
                    for(index = 0; index < glyphs.length; index++){
                        let glyph = glyphs[index];
                        if (0xffff !== glyph.id) {
                            let gid = lookupTable.lookup(glyph.id);
                            gid && (glyphs[index] = this.font.getGlyph(gid, glyph.codePoints));
                        }
                    }
                }
                _insertGlyphs(glyphIndex, insertionActionIndex, count, isBefore) {
                    let insertions = [];
                    for(; count--;){
                        let gid = this.subtable.table.insertionActions.getItem(insertionActionIndex++);
                        insertions.push(this.font.getGlyph(gid));
                    }
                    !isBefore && glyphIndex++, this.glyphs.splice(glyphIndex, 0, ...insertions);
                }
                processGlyphInsertion(glyph, entry, index) {
                    if (entry.flags & $55f71433a605c87d$var$SET_MARK && (this.markedIndex = index), 0xffff !== entry.markedInsertIndex) {
                        let count = (0x001F & entry.flags) >>> 5, isBefore = !!(0x0400 & entry.flags);
                        this._insertGlyphs(this.markedIndex, entry.markedInsertIndex, count, isBefore);
                    }
                    if (0xffff !== entry.currentInsertIndex) {
                        let count1 = (0x03E0 & entry.flags) >>> 5, isBefore1 = !!(0x0800 & entry.flags);
                        this._insertGlyphs(index, entry.currentInsertIndex, count1, isBefore1);
                    }
                }
                getSupportedFeatures() {
                    let features = [];
                    for (let chain of this.morx.chains)for (let feature of chain.features)features.push([
                        feature.featureType,
                        feature.featureSetting
                    ]);
                    return features;
                }
                generateInputs(gid) {
                    return this.inputCache || this.generateInputCache(), this.inputCache[gid] || [];
                }
                generateInputCache() {
                    for (let chain of (this.inputCache = {}, this.morx.chains)){
                        let flags = chain.defaultFlags;
                        for (let subtable of chain.subtables)subtable.subFeatureFlags & flags && this.generateInputsForSubtable(subtable);
                    }
                }
                generateInputsForSubtable(subtable) {
                    if (2 !== subtable.type) return;
                    if (subtable.coverage & $55f71433a605c87d$var$REVERSE_DIRECTION) throw Error("Reverse subtable, not supported.");
                    this.subtable = subtable, this.ligatureStack = [];
                    let stateMachine = this.getStateMachine(subtable), process = this.getProcessor(), input = [], stack = [];
                    this.glyphs = [], stateMachine.traverse({
                        enter: (glyph, entry)=>{
                            let glyphs = this.glyphs;
                            stack.push({
                                glyphs: glyphs.slice(),
                                ligatureStack: this.ligatureStack.slice()
                            });
                            let g1 = this.font.getGlyph(glyph);
                            input.push(g1), glyphs.push(input[input.length - 1]), process(glyphs[glyphs.length - 1], entry, glyphs.length - 1);
                            let count = 0, found = 0;
                            for(let i = 0; i < glyphs.length && count <= 1; i++)0xffff !== glyphs[i].id && (count++, found = glyphs[i].id);
                            if (1 === count) {
                                let result = input.map((g)=>g.id), cache1 = this.inputCache[found];
                                cache1 ? cache1.push(result) : this.inputCache[found] = [
                                    result
                                ];
                            }
                        },
                        exit: ()=>{
                            ({ glyphs: this.glyphs , ligatureStack: this.ligatureStack  } = stack.pop()), input.pop();
                        }
                    });
                }
                constructor(font){
                    this.processIndicRearragement = this.processIndicRearragement.bind(this), this.processContextualSubstitution = this.processContextualSubstitution.bind(this), this.processLigature = this.processLigature.bind(this), this.processNoncontextualSubstitutions = this.processNoncontextualSubstitutions.bind(this), this.processGlyphInsertion = this.processGlyphInsertion.bind(this), this.font = font, this.morx = font.morx, this.inputCache = null;
                }
            }
            function $55f71433a605c87d$var$swap(glyphs, rangeA, rangeB, reverseA = !1, reverseB = !1) {
                let end = glyphs.splice(rangeB[0] - (rangeB[1] - 1), rangeB[1]);
                reverseB && end.reverse();
                let start = glyphs.splice(rangeA[0], rangeA[1], ...end);
                return reverseA && start.reverse(), glyphs.splice(rangeB[0] - (rangeA[1] - 1), 0, ...start), glyphs;
            }
            function $55f71433a605c87d$var$reorderGlyphs(glyphs, verb, firstGlyph, lastGlyph) {
                switch(verb){
                    case 0:
                        return glyphs;
                    case 1:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            1
                        ], [
                            lastGlyph,
                            0
                        ]);
                    case 2:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            0
                        ], [
                            lastGlyph,
                            1
                        ]);
                    case 3:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            1
                        ], [
                            lastGlyph,
                            1
                        ]);
                    case 4:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            0
                        ]);
                    case 5:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            0
                        ], !0, !1);
                    case 6:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            0
                        ], [
                            lastGlyph,
                            2
                        ]);
                    case 7:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            0
                        ], [
                            lastGlyph,
                            2
                        ], !1, !0);
                    case 8:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            1
                        ], [
                            lastGlyph,
                            2
                        ]);
                    case 9:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            1
                        ], [
                            lastGlyph,
                            2
                        ], !1, !0);
                    case 10:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            1
                        ]);
                    case 11:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            1
                        ], !0, !1);
                    case 12:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            2
                        ]);
                    case 13:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            2
                        ], !0, !1);
                    case 14:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            2
                        ], !1, !0);
                    case 15:
                        return $55f71433a605c87d$var$swap(glyphs, [
                            firstGlyph,
                            2
                        ], [
                            lastGlyph,
                            2
                        ], !0, !0);
                    default:
                        throw Error(`Unknown verb: ${verb}`);
                }
            }
            (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $55f71433a605c87d$export$2e2bcd8739ae039.prototype, "getStateMachine", null);
            class $ba6dd74203be8728$export$2e2bcd8739ae039 {
                substitute(glyphRun) {
                    "rtl" === glyphRun.direction && glyphRun.glyphs.reverse(), this.morxProcessor.process(glyphRun.glyphs, $3b6302b64eccc32c$export$b813f7d2a1677c16(glyphRun.features));
                }
                getAvailableFeatures(script, language) {
                    return $3b6302b64eccc32c$export$bd6df347a4f391c4(this.morxProcessor.getSupportedFeatures());
                }
                stringsForGlyph(gid) {
                    let glyphStrings = this.morxProcessor.generateInputs(gid), result = new Set;
                    for (let glyphs of glyphStrings)this._addStrings(glyphs, 0, result, "");
                    return result;
                }
                _addStrings(glyphs, index, strings, string) {
                    let codePoints = this.font._cmapProcessor.codePointsForGlyph(glyphs[index]);
                    for (let codePoint of codePoints){
                        let s = string + String.fromCodePoint(codePoint);
                        index < glyphs.length - 1 ? this._addStrings(glyphs, index + 1, strings, s) : strings.add(s);
                    }
                }
                constructor(font){
                    this.font = font, this.morxProcessor = new $55f71433a605c87d$export$2e2bcd8739ae039(font), this.fallbackPosition = !1;
                }
            }
            class $94d7a73bd2edfc9a$export$2e2bcd8739ae039 {
                _addFeatures(features, global) {
                    let stageIndex = this.stages.length - 1, stage = this.stages[stageIndex];
                    for (let feature of features)null == this.allFeatures[feature] && (stage.push(feature), this.allFeatures[feature] = stageIndex, global && (this.globalFeatures[feature] = !0));
                }
                add(arg, global = !0) {
                    if (0 === this.stages.length && this.stages.push([]), "string" == typeof arg && (arg = [
                        arg
                    ]), Array.isArray(arg)) this._addFeatures(arg, global);
                    else if ("object" == typeof arg) this._addFeatures(arg.global || [], !0), this._addFeatures(arg.local || [], !1);
                    else throw Error("Unsupported argument to ShapingPlan#add");
                }
                addStage(arg, global) {
                    "function" == typeof arg ? this.stages.push(arg, []) : (this.stages.push([]), this.add(arg, global));
                }
                setFeatureOverrides(features) {
                    if (Array.isArray(features)) this.add(features);
                    else if ("object" == typeof features) {
                        for(let tag in features)if (features[tag]) this.add(tag);
                        else if (null != this.allFeatures[tag]) {
                            let stage = this.stages[this.allFeatures[tag]];
                            stage.splice(stage.indexOf(tag), 1), delete this.allFeatures[tag], delete this.globalFeatures[tag];
                        }
                    }
                }
                assignGlobalFeatures(glyphs) {
                    for (let glyph of glyphs)for(let feature in this.globalFeatures)glyph.features[feature] = !0;
                }
                process(processor, glyphs, positions) {
                    for (let stage of this.stages)"function" == typeof stage ? positions || stage(this.font, glyphs, this) : stage.length > 0 && processor.applyFeatures(stage, glyphs, positions);
                }
                constructor(font, script, direction){
                    this.font = font, this.script = script, this.direction = direction, this.stages = [], this.globalFeatures = {}, this.allFeatures = {};
                }
            }
            const $649970d87335b30f$var$VARIATION_FEATURES = [
                "rvrn"
            ], $649970d87335b30f$var$COMMON_FEATURES = [
                "ccmp",
                "locl",
                "rlig",
                "mark",
                "mkmk"
            ], $649970d87335b30f$var$FRACTIONAL_FEATURES = [
                "frac",
                "numr",
                "dnom"
            ], $649970d87335b30f$var$HORIZONTAL_FEATURES = [
                "calt",
                "clig",
                "liga",
                "rclt",
                "curs",
                "kern"
            ], $649970d87335b30f$var$DIRECTIONAL_FEATURES = {
                ltr: [
                    "ltra",
                    "ltrm"
                ],
                rtl: [
                    "rtla",
                    "rtlm"
                ]
            };
            class $649970d87335b30f$export$2e2bcd8739ae039 {
                static plan(plan, glyphs, features) {
                    this.planPreprocessing(plan), this.planFeatures(plan), this.planPostprocessing(plan, features), plan.assignGlobalFeatures(glyphs), this.assignFeatures(plan, glyphs);
                }
                static planPreprocessing(plan) {
                    plan.add({
                        global: [
                            ...$649970d87335b30f$var$VARIATION_FEATURES,
                            ...$649970d87335b30f$var$DIRECTIONAL_FEATURES[plan.direction]
                        ],
                        local: $649970d87335b30f$var$FRACTIONAL_FEATURES
                    });
                }
                static planFeatures(plan) {}
                static planPostprocessing(plan, userFeatures) {
                    plan.add([
                        ...$649970d87335b30f$var$COMMON_FEATURES,
                        ...$649970d87335b30f$var$HORIZONTAL_FEATURES
                    ]), plan.setFeatureOverrides(userFeatures);
                }
                static assignFeatures(plan, glyphs) {
                    for(let i = 0; i < glyphs.length; i++){
                        let glyph = glyphs[i];
                        if (0x2044 === glyph.codePoints[0]) {
                            let start = i, end = i + 1;
                            for(; start > 0 && (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.X1)(glyphs[start - 1].codePoints[0]);)glyphs[start - 1].features.numr = !0, glyphs[start - 1].features.frac = !0, start--;
                            for(; end < glyphs.length && (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.X1)(glyphs[end].codePoints[0]);)glyphs[end].features.dnom = !0, glyphs[end].features.frac = !0, end++;
                            glyph.features.frac = !0, i = end - 1;
                        }
                    }
                }
            }
            (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)($649970d87335b30f$export$2e2bcd8739ae039, "zeroMarkWidths", "AFTER_GPOS");
            const $764eb544bbe1ccf0$var$trie = new unicode_trie__WEBPACK_IMPORTED_MODULE_3__($12727730ddfc8bfe$export$94fdf11bafc8de6b("ABABAAAAAACgMQAAAZUBav7t2CtPA0EUBeDZB00pin9AJZIEgyUEj0QhweDAgQOJxCBRBElQSBwSicLgkOAwnNKZ5GaY2c7uzj4o5yZfZrrbefbuIx2nSq3CGmzAWH/+K+UO7MIe7MMhHMMpnMMFXMIVXIt2t3CnP088iPqjqNN8e4Ij7Rle4LUH82rLm6i/92A+RERERERERERNmfz/89GDeRARERERzbN8ceps2Iwt9H0C9/AJ6yOlDkbTczcot5VSm8Pm1vcFWfb7+BKOLTuOd2UlTX4wGP85Eg953lWPFbnuN7PkjtLmalOWbNenkHOSa7T3KmR9MVTZ2zZkVj1kHa68MueVKH0R4zqQ44WEXLM8VjcWHP0PtKLfPzQnMtGn3W4QYf6qxFxceVI394r2xnV+1rih0fV1Vzf3fO1n3evL5J78ruvZ5ptX2Rwy92Tfb1wlEqut3U+sZ3HXOeJ7/zDrbyuP6+Zz0fqa6Nv3vhY7Yu1xWnGevmsvsUpTT/RYIe8waUH/rvHMWKFzLfN8L+rTfp645mfX7ftlnfDtYxN59w0=")), $764eb544bbe1ccf0$var$FEATURES = [
                "isol",
                "fina",
                "fin2",
                "fin3",
                "medi",
                "med2",
                "init"
            ], $764eb544bbe1ccf0$var$ShapingClasses = {
                Non_Joining: 0,
                Left_Joining: 1,
                Right_Joining: 2,
                Dual_Joining: 3,
                Join_Causing: 3,
                ALAPH: 4,
                "DALATH RISH": 5,
                Transparent: 6
            }, $764eb544bbe1ccf0$var$ISOL = "isol", $764eb544bbe1ccf0$var$FINA = "fina", $764eb544bbe1ccf0$var$FIN2 = "fin2", $764eb544bbe1ccf0$var$MEDI = "medi", $764eb544bbe1ccf0$var$MED2 = "med2", $764eb544bbe1ccf0$var$INIT = "init", $764eb544bbe1ccf0$var$NONE = null, $764eb544bbe1ccf0$var$STATE_TABLE = [
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$FIN2,
                        5
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$INIT,
                        $764eb544bbe1ccf0$var$FINA,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$INIT,
                        $764eb544bbe1ccf0$var$FINA,
                        3
                    ],
                    [
                        $764eb544bbe1ccf0$var$INIT,
                        $764eb544bbe1ccf0$var$FINA,
                        4
                    ],
                    [
                        $764eb544bbe1ccf0$var$INIT,
                        $764eb544bbe1ccf0$var$FINA,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$MEDI,
                        $764eb544bbe1ccf0$var$FINA,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$MEDI,
                        $764eb544bbe1ccf0$var$FINA,
                        3
                    ],
                    [
                        $764eb544bbe1ccf0$var$MEDI,
                        $764eb544bbe1ccf0$var$FINA,
                        4
                    ],
                    [
                        $764eb544bbe1ccf0$var$MEDI,
                        $764eb544bbe1ccf0$var$FINA,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$MED2,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$MED2,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$MED2,
                        $764eb544bbe1ccf0$var$FIN2,
                        5
                    ],
                    [
                        $764eb544bbe1ccf0$var$MED2,
                        $764eb544bbe1ccf0$var$ISOL,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$ISOL,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$ISOL,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$ISOL,
                        $764eb544bbe1ccf0$var$FIN2,
                        5
                    ],
                    [
                        $764eb544bbe1ccf0$var$ISOL,
                        $764eb544bbe1ccf0$var$ISOL,
                        6
                    ]
                ],
                [
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$NONE,
                        0
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        1
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        2
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        "fin3",
                        5
                    ],
                    [
                        $764eb544bbe1ccf0$var$NONE,
                        $764eb544bbe1ccf0$var$ISOL,
                        6
                    ]
                ]
            ];
            class $764eb544bbe1ccf0$export$2e2bcd8739ae039 extends $649970d87335b30f$export$2e2bcd8739ae039 {
                static planFeatures(plan) {
                    plan.add([
                        "ccmp",
                        "locl"
                    ]);
                    for(let i = 0; i < $764eb544bbe1ccf0$var$FEATURES.length; i++){
                        let feature = $764eb544bbe1ccf0$var$FEATURES[i];
                        plan.addStage(feature, !1);
                    }
                    plan.addStage("mset");
                }
                static assignFeatures(plan, glyphs) {
                    super.assignFeatures(plan, glyphs);
                    let prev = -1, state = 0, actions = [];
                    for(let i = 0; i < glyphs.length; i++){
                        let curAction, prevAction;
                        var glyph = glyphs[i];
                        let type = $764eb544bbe1ccf0$var$getShapingClass(glyph.codePoints[0]);
                        if (type === $764eb544bbe1ccf0$var$ShapingClasses.Transparent) {
                            actions[i] = $764eb544bbe1ccf0$var$NONE;
                            continue;
                        }
                        [prevAction, curAction, state] = $764eb544bbe1ccf0$var$STATE_TABLE[state][type], prevAction !== $764eb544bbe1ccf0$var$NONE && -1 !== prev && (actions[prev] = prevAction), actions[i] = curAction, prev = i;
                    }
                    for(let index = 0; index < glyphs.length; index++){
                        let feature;
                        var glyph = glyphs[index];
                        (feature = actions[index]) && (glyph.features[feature] = !0);
                    }
                }
            }
            function $764eb544bbe1ccf0$var$getShapingClass(codePoint) {
                let res = $764eb544bbe1ccf0$var$trie.get(codePoint);
                if (res) return res - 1;
                let category = (0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.n3)(codePoint);
                return "Mn" === category || "Me" === category || "Cf" === category ? $764eb544bbe1ccf0$var$ShapingClasses.Transparent : $764eb544bbe1ccf0$var$ShapingClasses.Non_Joining;
            }
            class $85d408632270248b$export$2e2bcd8739ae039 {
                reset(options = {}, index = 0) {
                    this.options = options, this.flags = options.flags || {}, this.markAttachmentType = options.markAttachmentType || 0, this.index = index;
                }
                get cur() {
                    return this.glyphs[this.index] || null;
                }
                shouldIgnore(glyph) {
                    return this.flags.ignoreMarks && glyph.isMark || this.flags.ignoreBaseGlyphs && glyph.isBase || this.flags.ignoreLigatures && glyph.isLigature || this.markAttachmentType && glyph.isMark && glyph.markAttachmentType !== this.markAttachmentType;
                }
                move(dir) {
                    for(this.index += dir; 0 <= this.index && this.index < this.glyphs.length && this.shouldIgnore(this.glyphs[this.index]);)this.index += dir;
                    return 0 > this.index || this.index >= this.glyphs.length ? null : this.glyphs[this.index];
                }
                next() {
                    return this.move(1);
                }
                prev() {
                    return this.move(-1);
                }
                peek(count = 1) {
                    let idx = this.index, res = this.increment(count);
                    return this.index = idx, res;
                }
                peekIndex(count = 1) {
                    let idx = this.index;
                    this.increment(count);
                    let res = this.index;
                    return this.index = idx, res;
                }
                increment(count = 1) {
                    let dir = count < 0 ? -1 : 1;
                    for(count = Math.abs(count); count--;)this.move(dir);
                    return this.glyphs[this.index];
                }
                constructor(glyphs, options){
                    this.glyphs = glyphs, this.reset(options);
                }
            }
            const $a83b9c36aaa94fd3$var$DEFAULT_SCRIPTS = [
                "DFLT",
                "dflt",
                "latn"
            ];
            class $a83b9c36aaa94fd3$export$2e2bcd8739ae039 {
                findScript(script) {
                    if (null == this.table.scriptList) return null;
                    for (let s of (Array.isArray(script) || (script = [
                        script
                    ]), script))for (let entry of this.table.scriptList)if (entry.tag === s) return entry;
                    return null;
                }
                selectScript(script, language, direction) {
                    let entry, changed = !1;
                    if (!this.script || script !== this.scriptTag) {
                        if ((entry = this.findScript(script)) || (entry = this.findScript($a83b9c36aaa94fd3$var$DEFAULT_SCRIPTS)), !entry) return this.scriptTag;
                        this.scriptTag = entry.tag, this.script = entry.script, this.language = null, this.languageTag = null, changed = !0;
                    }
                    if (direction && direction === this.direction || (this.direction = direction || $130d1a642ebcd2b7$export$9fddb9d0dd7d8a54(script)), language && language.length < 4 && (language += " ".repeat(4 - language.length)), !language || language !== this.languageTag) {
                        for (let lang of (this.language = null, this.script.langSysRecords))if (lang.tag === language) {
                            this.language = lang.langSys, this.languageTag = lang.tag;
                            break;
                        }
                        this.language || (this.language = this.script.defaultLangSys, this.languageTag = null), changed = !0;
                    }
                    if (changed && (this.features = {}, this.language)) for (let featureIndex of this.language.featureIndexes){
                        let record = this.table.featureList[featureIndex], substituteFeature = this.substituteFeatureForVariations(featureIndex);
                        this.features[record.tag] = substituteFeature || record.feature;
                    }
                    return this.scriptTag;
                }
                lookupsForFeatures(userFeatures = [], exclude) {
                    let lookups = [];
                    for (let tag of userFeatures){
                        let feature = this.features[tag];
                        if (feature) for (let lookupIndex of feature.lookupListIndexes)exclude && -1 !== exclude.indexOf(lookupIndex) || lookups.push({
                            feature: tag,
                            index: lookupIndex,
                            lookup: this.table.lookupList.get(lookupIndex)
                        });
                    }
                    return lookups.sort((a, b)=>a.index - b.index), lookups;
                }
                substituteFeatureForVariations(featureIndex) {
                    if (-1 === this.variationsIndex) return null;
                    let substitutions = this.table.featureVariations.featureVariationRecords[this.variationsIndex].featureTableSubstitution.substitutions;
                    for (let substitution of substitutions)if (substitution.featureIndex === featureIndex) return substitution.alternateFeatureTable;
                    return null;
                }
                findVariationsIndex(coords) {
                    let variations = this.table.featureVariations;
                    if (!variations) return -1;
                    let records = variations.featureVariationRecords;
                    for(let i = 0; i < records.length; i++){
                        let conditions = records[i].conditionSet.conditionTable;
                        if (this.variationConditionsMatch(conditions, coords)) return i;
                    }
                    return -1;
                }
                variationConditionsMatch(conditions, coords) {
                    return conditions.every((condition)=>{
                        let coord = condition.axisIndex < coords.length ? coords[condition.axisIndex] : 0;
                        return condition.filterRangeMinValue <= coord && coord <= condition.filterRangeMaxValue;
                    });
                }
                applyFeatures(userFeatures, glyphs, advances) {
                    let lookups = this.lookupsForFeatures(userFeatures);
                    this.applyLookups(lookups, glyphs, advances);
                }
                applyLookups(lookups, glyphs, positions) {
                    for (let { feature: feature , lookup: lookup  } of (this.glyphs = glyphs, this.positions = positions, this.glyphIterator = new $85d408632270248b$export$2e2bcd8739ae039(glyphs), lookups))for(this.currentFeature = feature, this.glyphIterator.reset(lookup.flags); this.glyphIterator.index < glyphs.length;){
                        if (!(feature in this.glyphIterator.cur.features)) {
                            this.glyphIterator.next();
                            continue;
                        }
                        for (let table of lookup.subTables)if (this.applyLookup(lookup.lookupType, table)) break;
                        this.glyphIterator.next();
                    }
                }
                applyLookup(lookup, table) {
                    throw Error("applyLookup must be implemented by subclasses");
                }
                applyLookupList(lookupRecords) {
                    let options = this.glyphIterator.options, glyphIndex = this.glyphIterator.index;
                    for (let lookupRecord of lookupRecords){
                        this.glyphIterator.reset(options, glyphIndex), this.glyphIterator.increment(lookupRecord.sequenceIndex);
                        let lookup = this.table.lookupList.get(lookupRecord.lookupListIndex);
                        for (let table of (this.glyphIterator.reset(lookup.flags, this.glyphIterator.index), lookup.subTables))if (this.applyLookup(lookup.lookupType, table)) break;
                    }
                    return this.glyphIterator.reset(options, glyphIndex), !0;
                }
                coverageIndex(coverage, glyph) {
                    switch(null == glyph && (glyph = this.glyphIterator.cur.id), coverage.version){
                        case 1:
                            return coverage.glyphs.indexOf(glyph);
                        case 2:
                            for (let range of coverage.rangeRecords)if (range.start <= glyph && glyph <= range.end) return range.startCoverageIndex + glyph - range.start;
                    }
                    return -1;
                }
                match(sequenceIndex, sequence, fn, matched) {
                    let pos = this.glyphIterator.index, glyph = this.glyphIterator.increment(sequenceIndex), idx = 0;
                    for(; idx < sequence.length && glyph && fn(sequence[idx], glyph);)matched && matched.push(this.glyphIterator.index), idx++, glyph = this.glyphIterator.next();
                    return this.glyphIterator.index = pos, !(idx < sequence.length) && (matched || !0);
                }
                sequenceMatches(sequenceIndex, sequence) {
                    return this.match(sequenceIndex, sequence, (component, glyph)=>component === glyph.id);
                }
                sequenceMatchIndices(sequenceIndex, sequence) {
                    return this.match(sequenceIndex, sequence, (component, glyph)=>this.currentFeature in glyph.features && component === glyph.id, []);
                }
                coverageSequenceMatches(sequenceIndex, sequence) {
                    return this.match(sequenceIndex, sequence, (coverage, glyph)=>this.coverageIndex(coverage, glyph.id) >= 0);
                }
                getClassID(glyph, classDef) {
                    switch(classDef.version){
                        case 1:
                            let i = glyph - classDef.startGlyph;
                            if (i >= 0 && i < classDef.classValueArray.length) return classDef.classValueArray[i];
                            break;
                        case 2:
                            for (let range of classDef.classRangeRecord)if (range.start <= glyph && glyph <= range.end) return range.class;
                    }
                    return 0;
                }
                classSequenceMatches(sequenceIndex, sequence, classDef) {
                    return this.match(sequenceIndex, sequence, (classID, glyph)=>classID === this.getClassID(glyph.id, classDef));
                }
                applyContext(table) {
                    let index;
                    switch(table.version){
                        case 1:
                            if (-1 === (index = this.coverageIndex(table.coverage))) break;
                            for (let rule of table.ruleSets[index])if (this.sequenceMatches(1, rule.input)) return this.applyLookupList(rule.lookupRecords);
                            break;
                        case 2:
                            if (-1 === this.coverageIndex(table.coverage) || -1 === (index = this.getClassID(this.glyphIterator.cur.id, table.classDef))) break;
                            for (let rule1 of table.classSet[index])if (this.classSequenceMatches(1, rule1.classes, table.classDef)) return this.applyLookupList(rule1.lookupRecords);
                            break;
                        case 3:
                            if (this.coverageSequenceMatches(0, table.coverages)) return this.applyLookupList(table.lookupRecords);
                    }
                    return !1;
                }
                applyChainingContext(table) {
                    let index;
                    switch(table.version){
                        case 1:
                            if (-1 === (index = this.coverageIndex(table.coverage))) break;
                            let set = table.chainRuleSets[index];
                            for (let rule of set)if (this.sequenceMatches(-rule.backtrack.length, rule.backtrack) && this.sequenceMatches(1, rule.input) && this.sequenceMatches(1 + rule.input.length, rule.lookahead)) return this.applyLookupList(rule.lookupRecords);
                            break;
                        case 2:
                            if (-1 === this.coverageIndex(table.coverage)) break;
                            index = this.getClassID(this.glyphIterator.cur.id, table.inputClassDef);
                            let rules = table.chainClassSet[index];
                            if (!rules) break;
                            for (let rule2 of rules)if (this.classSequenceMatches(-rule2.backtrack.length, rule2.backtrack, table.backtrackClassDef) && this.classSequenceMatches(1, rule2.input, table.inputClassDef) && this.classSequenceMatches(1 + rule2.input.length, rule2.lookahead, table.lookaheadClassDef)) return this.applyLookupList(rule2.lookupRecords);
                            break;
                        case 3:
                            if (this.coverageSequenceMatches(-table.backtrackGlyphCount, table.backtrackCoverage) && this.coverageSequenceMatches(0, table.inputCoverage) && this.coverageSequenceMatches(table.inputGlyphCount, table.lookaheadCoverage)) return this.applyLookupList(table.lookupRecords);
                    }
                    return !1;
                }
                constructor(font, table){
                    this.font = font, this.table = table, this.script = null, this.scriptTag = null, this.language = null, this.languageTag = null, this.features = {}, this.lookups = {}, this.variationsIndex = font._variationProcessor ? this.findVariationsIndex(font._variationProcessor.normalizedCoords) : -1, this.selectScript(), this.glyphs = [], this.positions = [], this.ligatureID = 1, this.currentFeature = null;
                }
            }
            class $10e7b257e1a9a756$export$2e2bcd8739ae039 {
                get id() {
                    return this._id;
                }
                set id(id) {
                    this._id = id, this.substituted = !0;
                    let GDEF = this._font.GDEF;
                    if (GDEF && GDEF.glyphClassDef) {
                        let classID = $a83b9c36aaa94fd3$export$2e2bcd8739ae039.prototype.getClassID(id, GDEF.glyphClassDef);
                        this.isBase = 1 === classID, this.isLigature = 2 === classID, this.isMark = 3 === classID, this.markAttachmentType = GDEF.markAttachClassDef ? $a83b9c36aaa94fd3$export$2e2bcd8739ae039.prototype.getClassID(id, GDEF.markAttachClassDef) : 0;
                    } else this.isMark = this.codePoints.length > 0 && this.codePoints.every(unicode_properties__WEBPACK_IMPORTED_MODULE_2__.YB), this.isBase = !this.isMark, this.isLigature = this.codePoints.length > 1, this.markAttachmentType = 0;
                }
                copy() {
                    return new $10e7b257e1a9a756$export$2e2bcd8739ae039(this._font, this.id, this.codePoints, this.features);
                }
                constructor(font, id, codePoints = [], features){
                    if (this._font = font, this.codePoints = codePoints, this.id = id, this.features = {}, Array.isArray(features)) for(let i = 0; i < features.length; i++){
                        let feature = features[i];
                        this.features[feature] = !0;
                    }
                    else "object" == typeof features && Object.assign(this.features, features);
                    this.ligatureID = null, this.ligatureComponent = null, this.isLigated = !1, this.cursiveAttachment = null, this.markAttachment = null, this.shaperInfo = null, this.substituted = !1, this.isMultiplied = !1;
                }
            }
            class $e1c6bbc8cb416f8c$export$2e2bcd8739ae039 extends $649970d87335b30f$export$2e2bcd8739ae039 {
                static planFeatures(plan) {
                    plan.add([
                        "ljmo",
                        "vjmo",
                        "tjmo"
                    ], !1);
                }
                static assignFeatures(plan, glyphs) {
                    let state = 0, i = 0;
                    for(; i < glyphs.length;){
                        let action, code = glyphs[i].codePoints[0], type = $e1c6bbc8cb416f8c$var$getType(code);
                        switch([action, state] = $e1c6bbc8cb416f8c$var$STATE_TABLE[state][type], action){
                            case $e1c6bbc8cb416f8c$var$DECOMPOSE:
                                plan.font.hasGlyphForCodePoint(code) || (i = $e1c6bbc8cb416f8c$var$decompose(glyphs, i, plan.font));
                                break;
                            case $e1c6bbc8cb416f8c$var$COMPOSE:
                                i = $e1c6bbc8cb416f8c$var$compose(glyphs, i, plan.font);
                                break;
                            case $e1c6bbc8cb416f8c$var$TONE_MARK:
                                $e1c6bbc8cb416f8c$var$reorderToneMark(glyphs, i, plan.font);
                                break;
                            case $e1c6bbc8cb416f8c$var$INVALID:
                                i = $e1c6bbc8cb416f8c$var$insertDottedCircle(glyphs, i, plan.font);
                        }
                        i++;
                    }
                }
            }
            (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)($e1c6bbc8cb416f8c$export$2e2bcd8739ae039, "zeroMarkWidths", "NONE");
            const $e1c6bbc8cb416f8c$var$HANGUL_BASE = 0xac00, $e1c6bbc8cb416f8c$var$HANGUL_END = 0xd7a4, $e1c6bbc8cb416f8c$var$HANGUL_COUNT = $e1c6bbc8cb416f8c$var$HANGUL_END - $e1c6bbc8cb416f8c$var$HANGUL_BASE + 1, $e1c6bbc8cb416f8c$var$L_BASE = 0x1100, $e1c6bbc8cb416f8c$var$V_BASE = 0x1161, $e1c6bbc8cb416f8c$var$T_BASE = 0x11a7, $e1c6bbc8cb416f8c$var$V_COUNT = 21, $e1c6bbc8cb416f8c$var$T_COUNT = 28, $e1c6bbc8cb416f8c$var$L_END = $e1c6bbc8cb416f8c$var$L_BASE + 19 - 1, $e1c6bbc8cb416f8c$var$V_END = $e1c6bbc8cb416f8c$var$V_BASE + $e1c6bbc8cb416f8c$var$V_COUNT - 1, $e1c6bbc8cb416f8c$var$T_END = $e1c6bbc8cb416f8c$var$T_BASE + $e1c6bbc8cb416f8c$var$T_COUNT - 1, $e1c6bbc8cb416f8c$var$DOTTED_CIRCLE = 0x25cc, $e1c6bbc8cb416f8c$var$isL = (code)=>0x1100 <= code && code <= 0x115f || 0xa960 <= code && code <= 0xa97c, $e1c6bbc8cb416f8c$var$isV = (code)=>0x1160 <= code && code <= 0x11a7 || 0xd7b0 <= code && code <= 0xd7c6, $e1c6bbc8cb416f8c$var$isT = (code)=>0x11a8 <= code && code <= 0x11ff || 0xd7cb <= code && code <= 0xd7fb, $e1c6bbc8cb416f8c$var$isTone = (code)=>0x302e <= code && code <= 0x302f, $e1c6bbc8cb416f8c$var$isLVT = (code)=>$e1c6bbc8cb416f8c$var$HANGUL_BASE <= code && code <= $e1c6bbc8cb416f8c$var$HANGUL_END, $e1c6bbc8cb416f8c$var$isLV = (code)=>code - $e1c6bbc8cb416f8c$var$HANGUL_BASE < $e1c6bbc8cb416f8c$var$HANGUL_COUNT && (code - $e1c6bbc8cb416f8c$var$HANGUL_BASE) % $e1c6bbc8cb416f8c$var$T_COUNT == 0, $e1c6bbc8cb416f8c$var$isCombiningL = (code)=>$e1c6bbc8cb416f8c$var$L_BASE <= code && code <= $e1c6bbc8cb416f8c$var$L_END, $e1c6bbc8cb416f8c$var$isCombiningV = (code)=>$e1c6bbc8cb416f8c$var$V_BASE <= code && code <= $e1c6bbc8cb416f8c$var$V_END, $e1c6bbc8cb416f8c$var$isCombiningT = (code)=>$e1c6bbc8cb416f8c$var$T_BASE + 1 && 1 <= code && code <= $e1c6bbc8cb416f8c$var$T_END, $e1c6bbc8cb416f8c$var$V = 2, $e1c6bbc8cb416f8c$var$T = 3, $e1c6bbc8cb416f8c$var$LV = 4, $e1c6bbc8cb416f8c$var$LVT = 5;
            function $e1c6bbc8cb416f8c$var$getType(code) {
                return $e1c6bbc8cb416f8c$var$isL(code) ? 1 : $e1c6bbc8cb416f8c$var$isV(code) ? $e1c6bbc8cb416f8c$var$V : $e1c6bbc8cb416f8c$var$isT(code) ? $e1c6bbc8cb416f8c$var$T : $e1c6bbc8cb416f8c$var$isLV(code) ? $e1c6bbc8cb416f8c$var$LV : $e1c6bbc8cb416f8c$var$isLVT(code) ? $e1c6bbc8cb416f8c$var$LVT : $e1c6bbc8cb416f8c$var$isTone(code) ? 6 : 0;
            }
            const $e1c6bbc8cb416f8c$var$NO_ACTION = 0, $e1c6bbc8cb416f8c$var$DECOMPOSE = 1, $e1c6bbc8cb416f8c$var$COMPOSE = 2, $e1c6bbc8cb416f8c$var$TONE_MARK = 4, $e1c6bbc8cb416f8c$var$INVALID = 5, $e1c6bbc8cb416f8c$var$STATE_TABLE = [
                [
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        1
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        2
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        3
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$INVALID,
                        0
                    ]
                ],
                [
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        1
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$COMPOSE,
                        2
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        2
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        3
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$INVALID,
                        0
                    ]
                ],
                [
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        1
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$COMPOSE,
                        3
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        2
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        3
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$TONE_MARK,
                        0
                    ]
                ],
                [
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        1
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$NO_ACTION,
                        0
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        2
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$DECOMPOSE,
                        3
                    ],
                    [
                        $e1c6bbc8cb416f8c$var$TONE_MARK,
                        0
                    ]
                ]
            ];
            function $e1c6bbc8cb416f8c$var$getGlyph(font, code, features) {
                return new $10e7b257e1a9a756$export$2e2bcd8739ae039(font, font.glyphForCodePoint(code).id, [
                    code
                ], features);
            }
            function $e1c6bbc8cb416f8c$var$decompose(glyphs, i, font) {
                let glyph = glyphs[i], s = glyph.codePoints[0] - $e1c6bbc8cb416f8c$var$HANGUL_BASE, t = $e1c6bbc8cb416f8c$var$T_BASE + s % $e1c6bbc8cb416f8c$var$T_COUNT, l = $e1c6bbc8cb416f8c$var$L_BASE + (s = s / $e1c6bbc8cb416f8c$var$T_COUNT | 0) / $e1c6bbc8cb416f8c$var$V_COUNT | 0, v = $e1c6bbc8cb416f8c$var$V_BASE + s % $e1c6bbc8cb416f8c$var$V_COUNT;
                if (!font.hasGlyphForCodePoint(l) || !font.hasGlyphForCodePoint(v) || t !== $e1c6bbc8cb416f8c$var$T_BASE && !font.hasGlyphForCodePoint(t)) return i;
                let ljmo = $e1c6bbc8cb416f8c$var$getGlyph(font, l, glyph.features);
                ljmo.features.ljmo = !0;
                let vjmo = $e1c6bbc8cb416f8c$var$getGlyph(font, v, glyph.features);
                vjmo.features.vjmo = !0;
                let insert = [
                    ljmo,
                    vjmo
                ];
                if (t > $e1c6bbc8cb416f8c$var$T_BASE) {
                    let tjmo = $e1c6bbc8cb416f8c$var$getGlyph(font, t, glyph.features);
                    tjmo.features.tjmo = !0, insert.push(tjmo);
                }
                return glyphs.splice(i, 1, ...insert), i + insert.length - 1;
            }
            function $e1c6bbc8cb416f8c$var$compose(glyphs, i, font) {
                let lv, ljmo, vjmo, tjmo, glyph = glyphs[i], type = $e1c6bbc8cb416f8c$var$getType(glyphs[i].codePoints[0]), prev = glyphs[i - 1].codePoints[0], prevType = $e1c6bbc8cb416f8c$var$getType(prev);
                if (prevType === $e1c6bbc8cb416f8c$var$LV && type === $e1c6bbc8cb416f8c$var$T) lv = prev, tjmo = glyph;
                else {
                    type === $e1c6bbc8cb416f8c$var$V ? (ljmo = glyphs[i - 1], vjmo = glyph) : (ljmo = glyphs[i - 2], vjmo = glyphs[i - 1], tjmo = glyph);
                    let l = ljmo.codePoints[0], v = vjmo.codePoints[0];
                    $e1c6bbc8cb416f8c$var$isCombiningL(l) && $e1c6bbc8cb416f8c$var$isCombiningV(v) && (lv = $e1c6bbc8cb416f8c$var$HANGUL_BASE + ((l - $e1c6bbc8cb416f8c$var$L_BASE) * $e1c6bbc8cb416f8c$var$V_COUNT + (v - $e1c6bbc8cb416f8c$var$V_BASE)) * $e1c6bbc8cb416f8c$var$T_COUNT);
                }
                let t = tjmo && tjmo.codePoints[0] || $e1c6bbc8cb416f8c$var$T_BASE;
                if (null != lv && (t === $e1c6bbc8cb416f8c$var$T_BASE || $e1c6bbc8cb416f8c$var$isCombiningT(t))) {
                    let s = lv + (t - $e1c6bbc8cb416f8c$var$T_BASE);
                    if (font.hasGlyphForCodePoint(s)) {
                        let del = prevType === $e1c6bbc8cb416f8c$var$V ? 3 : 2;
                        return glyphs.splice(i - del + 1, del, $e1c6bbc8cb416f8c$var$getGlyph(font, s, glyph.features)), i - del + 1;
                    }
                }
                return (ljmo && (ljmo.features.ljmo = !0), vjmo && (vjmo.features.vjmo = !0), tjmo && (tjmo.features.tjmo = !0), prevType === $e1c6bbc8cb416f8c$var$LV) ? ($e1c6bbc8cb416f8c$var$decompose(glyphs, i - 1, font), i + 1) : i;
            }
            function $e1c6bbc8cb416f8c$var$getLength(code) {
                switch($e1c6bbc8cb416f8c$var$getType(code)){
                    case $e1c6bbc8cb416f8c$var$LV:
                    case $e1c6bbc8cb416f8c$var$LVT:
                        return 1;
                    case $e1c6bbc8cb416f8c$var$V:
                        return 2;
                    case $e1c6bbc8cb416f8c$var$T:
                        return 3;
                }
            }
            function $e1c6bbc8cb416f8c$var$reorderToneMark(glyphs, i, font) {
                let glyph = glyphs[i], code = glyphs[i].codePoints[0];
                if (0 === font.glyphForCodePoint(code).advanceWidth) return;
                let len = $e1c6bbc8cb416f8c$var$getLength(glyphs[i - 1].codePoints[0]);
                return glyphs.splice(i, 1), glyphs.splice(i - len, 0, glyph);
            }
            function $e1c6bbc8cb416f8c$var$insertDottedCircle(glyphs, i, font) {
                let glyph = glyphs[i], code = glyphs[i].codePoints[0];
                if (font.hasGlyphForCodePoint($e1c6bbc8cb416f8c$var$DOTTED_CIRCLE)) {
                    let dottedCircle = $e1c6bbc8cb416f8c$var$getGlyph(font, $e1c6bbc8cb416f8c$var$DOTTED_CIRCLE, glyph.features), idx = 0 === font.glyphForCodePoint(code).advanceWidth ? i : i + 1;
                    glyphs.splice(idx, 0, dottedCircle), i++;
                }
                return i;
            }
            var $4b0735ca6c692ea5$exports = {};
            $4b0735ca6c692ea5$exports = JSON.parse('{"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,14,15,16,17],[0,0,0,18,19,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,28,29,30,31,32,33,0,34,0,0,35,36,0,0,37,0],[0,0,0,38,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,39,0,0,0,40,41,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,12,43,0,0,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,0,43,0,0,0,0],[0,0,0,45,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,50,0,0,51,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,52,0,0,0,0,0,0,0,0],[0,0,0,53,54,55,56,57,58,0,59,0,0,60,61,0,0,62,0],[0,0,0,4,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,63,64,0,0,40,41,0,9,0,10,0,0,0,42,0,63,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,0,2,16,0],[0,0,0,18,65,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,0,0],[0,0,0,69,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,73,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,75,0,0,0,76,77,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,25,79,0,0,0,0],[0,0,0,18,19,20,74,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,81,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,86,0,0,87,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,0,0,0],[0,0,0,18,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,89,90,0,0,76,77,0,23,0,24,0,0,0,78,0,89,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,0,0],[0,0,0,94,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,96,0,0,0,97,98,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,35,100,0,0,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,102,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,107,0,0,108,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,109,0,0,0,0,0,0,0,0],[0,0,0,28,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,110,111,0,0,97,98,0,33,0,34,0,0,0,99,0,110,0,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,0,0],[0,0,0,0,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,0,0,115,116,117,118,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,39,0,122,0,123,123,8,9,0,10,0,0,0,42,0,39,0,0],[0,124,64,0,0,0,0,0,0,0,0,0,0,0,0,0,124,0,0],[0,39,0,0,0,121,125,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,126,126,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,47,47,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,128,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,129,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,50,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,134,0,0,0,0,0,0,0,0],[0,0,0,135,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,136,0,0,0,137,138,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,60,140,0,0,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,0,140,0,0,0,0],[0,0,0,142,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,147,0,0,148,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,0,0,0],[0,0,0,53,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,150,151,0,0,137,138,0,58,0,59,0,0,0,139,0,150,0,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,0,0],[0,0,0,155,116,156,157,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,75,3,4,5,159,160,8,161,0,162,0,11,12,163,0,75,16,0],[0,0,0,0,0,40,164,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,0,165,0,0,0,0],[0,124,64,0,0,40,164,0,9,0,10,0,0,0,42,0,124,0,0],[0,0,0,0,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,71,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,167,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,168,0,0,0,0,0,0,0,0],[0,0,0,0,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,0,79,0,0,0,0],[0,0,0,169,170,171,172,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,75,0,176,0,177,177,22,23,0,24,0,0,0,78,0,75,0,0],[0,178,90,0,0,0,0,0,0,0,0,0,0,0,0,0,178,0,0],[0,75,0,0,0,175,179,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,180,180,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,83,83,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,182,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,183,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,86,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,188,0,0,0,0,0,0,0,0],[0,0,0,189,170,190,191,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,76,193,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,0,194,0,0,0,0],[0,178,90,0,0,76,193,0,23,0,24,0,0,0,78,0,178,0,0],[0,0,0,0,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,195,196,197,198,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,96,0,202,0,203,203,32,33,0,34,0,0,0,99,0,96,0,0],[0,204,111,0,0,0,0,0,0,0,0,0,0,0,0,0,204,0,0],[0,96,0,0,0,201,205,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,206,206,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,104,104,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,208,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,209,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,107,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,214,0,0,0,0,0,0,0,0],[0,0,0,215,196,216,217,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,97,219,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,0,220,0,0,0,0],[0,204,111,0,0,97,219,0,33,0,34,0,0,0,99,0,204,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,223,0,0,0,40,224,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,119,225,0,0,0,0],[0,0,0,115,116,117,222,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,115,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,226,64,0,0,40,224,0,9,0,10,0,0,0,42,0,226,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,39,0,0,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,44,44,8,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,227,0,228,229,0,9,0,10,0,0,230,0,0,0,0,0],[0,39,0,122,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,231,231,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,232,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,131,131,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,234,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,235,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,0,0,240,241,242,243,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,136,0,247,0,248,248,57,58,0,59,0,0,0,139,0,136,0,0],[0,249,151,0,0,0,0,0,0,0,0,0,0,0,0,0,249,0,0],[0,136,0,0,0,246,250,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,251,251,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,144,144,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,253,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,254,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,147,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,259,0,0,0,0,0,0,0,0],[0,0,0,260,241,261,262,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,137,264,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,0,265,0,0,0,0],[0,249,151,0,0,137,264,0,58,0,59,0,0,0,139,0,249,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,158,225,0,0,0,0],[0,0,0,155,116,156,222,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,155,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,43,266,266,8,161,0,24,0,0,12,267,0,0,0,0],[0,75,0,176,43,268,268,269,161,0,24,0,0,0,267,0,75,0,0],[0,0,0,0,0,270,0,0,271,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,272,0,0,0,0,0,0,0,0],[0,273,274,0,0,40,41,0,9,0,10,0,0,0,42,0,273,0,0],[0,0,0,40,0,123,123,8,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,121,275,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,276,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,279,0,0,0,76,280,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,173,281,0,0,0,0],[0,0,0,169,170,171,278,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,169,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,282,90,0,0,76,280,0,23,0,24,0,0,0,78,0,282,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,75,0,0,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,80,80,22,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,283,0,284,285,0,23,0,24,0,0,286,0,0,0,0,0],[0,75,0,176,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,287,287,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,288,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,185,185,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,290,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,291,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,192,281,0,0,0,0],[0,0,0,189,170,190,278,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,189,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,76,0,177,177,22,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,175,296,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,299,0,0,0,97,300,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,199,301,0,0,0,0],[0,0,0,195,196,197,298,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,195,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,302,111,0,0,97,300,0,33,0,34,0,0,0,99,0,302,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,96,0,0,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,101,101,32,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,303,0,304,305,0,33,0,34,0,0,306,0,0,0,0,0],[0,96,0,202,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,307,307,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,308,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,211,211,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,310,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,311,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,218,301,0,0,0,0],[0,0,0,215,196,216,298,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,215,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,97,0,203,203,32,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,201,316,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,0,225,0,0,0,0],[0,0,0,317,318,319,320,8,9,0,10,0,0,321,322,0,0,16,0],[0,223,0,323,0,123,123,8,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,0,0,121,324,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,325,318,326,327,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,64,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,230,0,0,0,0,0],[0,0,0,227,0,228,121,0,9,0,10,0,0,230,0,0,0,0,0],[0,0,0,227,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,0,0],[0,0,0,0,0,329,329,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,330,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,237,237,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,332,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,333,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,337,0,0,0,137,338,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,244,339,0,0,0,0],[0,0,0,240,241,242,336,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,240,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,340,151,0,0,137,338,0,58,0,59,0,0,0,139,0,340,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,136,0,0,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,141,141,57,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,341,0,342,343,0,58,0,59,0,0,344,0,0,0,0,0],[0,136,0,247,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,0,0,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,345,345,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,346,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,256,256,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,348,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,349,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,263,339,0,0,0,0],[0,0,0,260,241,261,336,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,260,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,137,0,248,248,57,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,246,354,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,126,126,8,23,0,0,0,0,0,0,0,0,0,0],[0,355,90,0,0,121,125,0,9,0,10,0,0,0,42,0,355,0,0],[0,0,0,0,0,356,356,269,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,357,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,270,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,363,0,0,0,0,0,0,0,0],[0,0,0,364,116,365,366,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,40,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,0,281,0,0,0,0],[0,0,0,369,370,371,372,22,23,0,24,0,0,373,374,0,0,27,0],[0,279,0,375,0,177,177,22,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,0,0,175,376,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,377,370,378,379,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,90,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,286,0,0,0,0,0],[0,0,0,283,0,284,175,0,23,0,24,0,0,286,0,0,0,0,0],[0,0,0,283,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,82,0,0],[0,0,0,0,0,381,381,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,382,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,293,293,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,384,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,385,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,76,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,0,301,0,0,0,0],[0,0,0,387,388,389,390,32,33,0,34,0,0,391,392,0,0,37,0],[0,299,0,393,0,203,203,32,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,0,0,201,394,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,395,388,396,397,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,111,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,306,0,0,0,0,0],[0,0,0,303,0,304,201,0,33,0,34,0,0,306,0,0,0,0,0],[0,0,0,303,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,0,0],[0,0,0,0,0,399,399,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,400,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,313,313,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,402,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,403,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,97,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,407,0,0,0,40,408,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,321,409,0,0,0,0],[0,0,0,317,318,319,406,8,9,0,10,0,0,321,322,0,0,16,0],[0,0,0,317,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,410,64,0,0,40,408,0,9,0,10,0,0,0,42,0,410,0,0],[0,223,0,0,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,323,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,328,409,0,0,0,0],[0,0,0,325,318,326,406,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,325,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,0,0,0,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,130,0,0],[0,0,0,0,0,411,411,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,412,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,413,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,0,339,0,0,0,0],[0,0,0,414,415,416,417,57,58,0,59,0,0,418,419,0,0,62,0],[0,337,0,420,0,248,248,57,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,0,0,246,421,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,422,415,423,424,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,151,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,344,0,0,0,0,0],[0,0,0,341,0,342,246,0,58,0,59,0,0,344,0,0,0,0,0],[0,0,0,341,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143,0,0],[0,0,0,0,0,426,426,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,427,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,351,351,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,429,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,430,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,137,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,432,116,433,434,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,0,0,180,180,269,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,359,359,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,437,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,438,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,443,274,0,0,0,0,0,0,0,0,0,0,0,0,0,443,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,367,225,0,0,0,0],[0,0,0,364,116,365,445,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,364,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,448,0,0,0,76,449,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,373,450,0,0,0,0],[0,0,0,369,370,371,447,22,23,0,24,0,0,373,374,0,0,27,0],[0,0,0,369,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,451,90,0,0,76,449,0,23,0,24,0,0,0,78,0,451,0,0],[0,279,0,0,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,375,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,380,450,0,0,0,0],[0,0,0,377,370,378,447,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,377,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,0,0,0,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,0,0],[0,0,0,0,0,452,452,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,453,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,454,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,457,0,0,0,97,458,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,391,459,0,0,0,0],[0,0,0,387,388,389,456,32,33,0,34,0,0,391,392,0,0,37,0],[0,0,0,387,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,460,111,0,0,97,458,0,33,0,34,0,0,0,99,0,460,0,0],[0,299,0,0,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,393,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,398,459,0,0,0,0],[0,0,0,395,388,396,456,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,395,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,0,0,0,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,210,0,0],[0,0,0,0,0,461,461,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,462,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,463,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,0,409,0,0,0,0],[0,0,0,464,465,466,467,8,9,0,10,0,0,468,469,0,0,16,0],[0,407,0,470,0,123,123,8,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,0,0,121,471,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,472,465,473,474,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,0,0,0,0,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,236,0,0],[0,0,0,0,0,0,476,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,479,0,0,0,137,480,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,418,481,0,0,0,0],[0,0,0,414,415,416,478,57,58,0,59,0,0,418,419,0,0,62,0],[0,0,0,414,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,482,151,0,0,137,480,0,58,0,59,0,0,0,139,0,482,0,0],[0,337,0,0,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,420,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,425,481,0,0,0,0],[0,0,0,422,415,423,478,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,422,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,0,0,0,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0],[0,0,0,0,0,483,483,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,484,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,485,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,435,225,0,0,0,0],[0,0,0,432,116,433,445,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,432,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,486,486,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,487,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,440,440,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,489,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,490,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,495,0,496,497,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,0,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,0,225,0,0,0,0],[0,0,0,0,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,0,450,0,0,0,0],[0,0,0,499,500,501,502,22,23,0,24,0,0,503,504,0,0,27,0],[0,448,0,505,0,177,177,22,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,0,0,175,506,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,507,500,508,509,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,0,0,0,0,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,292,0,0],[0,0,0,0,0,0,511,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,0,459,0,0,0,0],[0,0,0,512,513,514,515,32,33,0,34,0,0,516,517,0,0,37,0],[0,457,0,518,0,203,203,32,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,0,0,201,519,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,520,513,521,522,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,0,0,0,0,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,312,0,0],[0,0,0,0,0,0,524,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,527,0,0,0,40,528,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,468,529,0,0,0,0],[0,0,0,464,465,466,526,8,9,0,10,0,0,468,469,0,0,16,0],[0,0,0,464,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,530,64,0,0,40,528,0,9,0,10,0,0,0,42,0,530,0,0],[0,407,0,0,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,470,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,475,529,0,0,0,0],[0,0,0,472,465,473,526,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,472,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,0,0],[0,0,0,0,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,0,481,0,0,0,0],[0,0,0,531,532,533,534,57,58,0,59,0,0,535,536,0,0,62,0],[0,479,0,537,0,248,248,57,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,0,0,246,538,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,539,532,540,541,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,0,0,0,0,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,350,0,0],[0,0,0,0,0,0,543,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,358,0,0],[0,0,0,0,0,544,544,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,545,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,492,492,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,547,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,548,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,274,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,498,0,0,0,0,0],[0,0,0,495,0,496,368,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,495,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,553,0,0,0,76,554,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,503,555,0,0,0,0],[0,0,0,499,500,501,552,22,23,0,24,0,0,503,504,0,0,27,0],[0,0,0,499,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,556,90,0,0,76,554,0,23,0,24,0,0,0,78,0,556,0,0],[0,448,0,0,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,505,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,510,555,0,0,0,0],[0,0,0,507,500,508,552,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,507,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,559,0,0,0,97,560,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,516,561,0,0,0,0],[0,0,0,512,513,514,558,32,33,0,34,0,0,516,517,0,0,37,0],[0,0,0,512,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,562,111,0,0,97,560,0,33,0,34,0,0,0,99,0,562,0,0],[0,457,0,0,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,518,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,523,561,0,0,0,0],[0,0,0,520,513,521,558,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,520,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,0,0],[0,0,0,0,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,0,529,0,0,0,0],[0,0,0,563,66,564,565,8,9,0,10,0,0,566,68,0,0,16,0],[0,527,0,567,0,123,123,8,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,0,0,121,568,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,569,66,570,571,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,575,0,0,0,137,576,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,535,577,0,0,0,0],[0,0,0,531,532,533,574,57,58,0,59,0,0,535,536,0,0,62,0],[0,0,0,531,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,578,151,0,0,137,576,0,58,0,59,0,0,0,139,0,578,0,0],[0,479,0,0,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,537,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,542,577,0,0,0,0],[0,0,0,539,532,540,574,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,539,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,137,0,0],[0,0,0,0,0,0,0,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,439,0,0],[0,0,0,0,0,579,579,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,580,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,581,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,0,555,0,0,0,0],[0,0,0,582,91,583,584,22,23,0,24,0,0,585,93,0,0,27,0],[0,553,0,586,0,177,177,22,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,0,0,175,587,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,588,91,589,590,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,0,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,0,561,0,0,0,0],[0,0,0,592,112,593,594,32,33,0,34,0,0,595,114,0,0,37,0],[0,559,0,596,0,203,203,32,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,0,0,201,597,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,598,112,599,600,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,566,165,0,0,0,0],[0,0,0,563,66,564,67,8,9,0,10,0,0,566,68,0,0,16,0],[0,0,0,563,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,527,0,0,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,567,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,572,165,0,0,0,0],[0,0,0,569,66,570,67,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,569,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,0,577,0,0,0,0],[0,0,0,603,152,604,605,57,58,0,59,0,0,606,154,0,0,62,0],[0,575,0,607,0,248,248,57,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,0,0,246,608,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,609,152,610,611,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,0,0,0,0,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,491,0,0],[0,0,0,0,0,0,613,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,585,194,0,0,0,0],[0,0,0,582,91,583,92,22,23,0,24,0,0,585,93,0,0,27,0],[0,0,0,582,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,553,0,0,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,586,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,591,194,0,0,0,0],[0,0,0,588,91,589,92,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,588,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,595,220,0,0,0,0],[0,0,0,592,112,593,113,32,33,0,34,0,0,595,114,0,0,37,0],[0,0,0,592,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,559,0,0,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,596,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,601,220,0,0,0,0],[0,0,0,598,112,599,113,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,598,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,606,265,0,0,0,0],[0,0,0,603,152,604,153,57,58,0,59,0,0,606,154,0,0,62,0],[0,0,0,603,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,575,0,0,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,607,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,612,265,0,0,0,0],[0,0,0,609,152,610,153,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,609,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,549,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0]],"accepting":[false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,false,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,false,false,true,false,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,false,false,true,true,false,false,true,true,true,false,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,false,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,false,true,true,false,true,true,true],"tags":[[],["broken_cluster"],["consonant_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],[],["broken_cluster"],["symbol_cluster"],[],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["symbol_cluster"],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],[],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],[],[],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],["consonant_syllable"],["vowel_syllable"],["standalone_cluster"]]}');
            var $aa333a9607471296$exports = {};
            $aa333a9607471296$exports = JSON.parse('{"categories":["O","IND","S","GB","B","FM","CGJ","VMAbv","VMPst","VAbv","VPst","CMBlw","VPre","VBlw","H","VMBlw","CMAbv","MBlw","CS","R","SUB","MPst","MPre","FAbv","FPst","FBlw","SMAbv","SMBlw","VMPre","ZWNJ","ZWJ","WJ","VS","N","HN","MAbv"],"decompositions":{"2507":[2503,2494],"2508":[2503,2519],"2888":[2887,2902],"2891":[2887,2878],"2892":[2887,2903],"3018":[3014,3006],"3019":[3015,3006],"3020":[3014,3031],"3144":[3142,3158],"3264":[3263,3285],"3271":[3270,3285],"3272":[3270,3286],"3274":[3270,3266],"3275":[3270,3266,3285],"3402":[3398,3390],"3403":[3399,3390],"3404":[3398,3415],"3546":[3545,3530],"3548":[3545,3535],"3549":[3545,3535,3530],"3550":[3545,3551],"3635":[3661,3634],"3763":[3789,3762],"3955":[3953,3954],"3957":[3953,3956],"3958":[4018,3968],"3959":[4018,3953,3968],"3960":[4019,3968],"3961":[4019,3953,3968],"3969":[3953,3968],"6971":[6970,6965],"6973":[6972,6965],"6976":[6974,6965],"6977":[6975,6965],"6979":[6978,6965],"69934":[69937,69927],"69935":[69938,69927],"70475":[70471,70462],"70476":[70471,70487],"70843":[70841,70842],"70844":[70841,70832],"70846":[70841,70845],"71098":[71096,71087],"71099":[71097,71087]},"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[2,2,3,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,17,18,11,19,20,21,22,0,0,23,0,0,2,0,24,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,27,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,39,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,49,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,22,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,23,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,53,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,45,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,46,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,23,0,0,0,0,0,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,54,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,46,0,0,0,0,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0]],"accepting":[false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"tags":[[],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["symbol_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["virama_terminated_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["number_joiner_terminated_cluster"],["standard_cluster"],["standard_cluster"],["numeral_cluster"]]}');
            const $90a9d3398ee54fe5$export$a513ea61a7bee91c = {
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
            }, $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0 = {
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
            }, $90a9d3398ee54fe5$export$8519deaa7de2b07 = $90a9d3398ee54fe5$export$a513ea61a7bee91c.C | $90a9d3398ee54fe5$export$a513ea61a7bee91c.Ra | $90a9d3398ee54fe5$export$a513ea61a7bee91c.CM | $90a9d3398ee54fe5$export$a513ea61a7bee91c.V | $90a9d3398ee54fe5$export$a513ea61a7bee91c.Placeholder | $90a9d3398ee54fe5$export$a513ea61a7bee91c.Dotted_Circle, $90a9d3398ee54fe5$export$bbcd928767338e0d = $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWJ | $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWNJ, $90a9d3398ee54fe5$export$ca9599b2a300afc = $90a9d3398ee54fe5$export$a513ea61a7bee91c.H | $90a9d3398ee54fe5$export$a513ea61a7bee91c.Coeng, $90a9d3398ee54fe5$export$e99d119da76a0fc5 = {
                Default: {
                    hasOldSpec: !1,
                    virama: 0,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Devanagari: {
                    hasOldSpec: !0,
                    virama: 0x094D,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Bengali: {
                    hasOldSpec: !0,
                    virama: 0x09CD,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Sub,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Gurmukhi: {
                    hasOldSpec: !0,
                    virama: 0x0A4D,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Before_Sub,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Gujarati: {
                    hasOldSpec: !0,
                    virama: 0x0ACD,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Before_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Oriya: {
                    hasOldSpec: !0,
                    virama: 0x0B4D,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Main,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Tamil: {
                    hasOldSpec: !0,
                    virama: 0x0BCD,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Post,
                    rephMode: "Implicit",
                    blwfMode: "Pre_And_Post"
                },
                Telugu: {
                    hasOldSpec: !0,
                    virama: 0x0C4D,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Post,
                    rephMode: "Explicit",
                    blwfMode: "Post_Only"
                },
                Kannada: {
                    hasOldSpec: !0,
                    virama: 0x0CCD,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Post,
                    rephMode: "Implicit",
                    blwfMode: "Post_Only"
                },
                Malayalam: {
                    hasOldSpec: !0,
                    virama: 0x0D4D,
                    basePos: "Last",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Main,
                    rephMode: "Log_Repha",
                    blwfMode: "Pre_And_Post"
                },
                Khmer: {
                    hasOldSpec: !1,
                    virama: 0x17D2,
                    basePos: "First",
                    rephPos: $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Ra_To_Become_Reph,
                    rephMode: "Vis_Repha",
                    blwfMode: "Pre_And_Post"
                }
            }, $90a9d3398ee54fe5$export$f647c9cfdd77d95a = {
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
            }, { decompositions: $7826f90f6f0cecc9$var$decompositions  } = $parcel$interopDefault($aa333a9607471296$exports), $7826f90f6f0cecc9$var$trie = new unicode_trie__WEBPACK_IMPORTED_MODULE_3__($12727730ddfc8bfe$export$94fdf11bafc8de6b("AAARAAAAAACgwgAAAbENTvLtnX+sHUUVx/f13nd/vHf7bl+FRGL7R0OJMcWYphBrimkVCSJR2xiEaLEGQ7AkBGowbYRSgj8K2B/GkpRYE6wlQSyJKCagrSlGkmqsqUZMY7S2CWkgqQViQSkt4Hfuzrx77tyZ2fm1u+/RPcknuzs7O3PmnDOzs7N73zteS5KXwKvgDTCnniTvBfPBJeAVpP2vFr69GGUtAkvAModyr0DeT4BrwCpwPVgDbga3ga+DjYbyluLcCvBN8F2wGWwHO8Ej4DjyPIbtz0DCeZpvD4CD4E/gb+AoOAFOgtPgLKiNJkkbTIKLwALwfvAh8GGwHFwFPg2uAzeCm8Ft4E5wN7gPPAi+D34AfgR+Ap7kx8+AZ8HvwZ/BEXAMvAheAa+Bc6OpzvVGknTABY30eB62C8GlYDFYCpaDq/n5z2J7PVgDbgG3N1KbrOdbWzby/N/G9i6wlR8/wLebUNcOll7vX7PLsQ4bdpAy92B/L3gK7AO/A38EfwX/AC+AkyT/m3x7mqdtYz7Gfq2ZJOPgPc3UXu/D9uJmmmcRT1uC7TJwZTONJxFL1+J4JbgBrAG3gNv5Nev5dhO2m3l54rqtON7RNLd1V8Z5auMfI+8Wbvv12P4Ux78AvyZl/Bb7fwD34HwH/EVR/t8t6rRlrYgFlHnMsdyXIupRFP+Gzv8Bb4CklSSjrTR9bz21uZx/Nj8v+uIFOJ4HFnJo3kWtNG6WkPSzBl1YbC8jeVfx+q+R9Pg48lxN8jFdhd8+01LrLTCdq6io8GNb1a8qKioqKioqKioc2cbXGcrWQ2Ynf9a9rmV/zVua9Dc16V/gz8pfxvar4A6wAdwL7gdbwUPgh+BR8AR4qpWuLe3D9gA4CA6DI+AoOAFOtdL1nNexfYs937fxDA8ubKf1zmv3dViI/Uvb9m2sqKioqAiHrVtehrH3TK2/3l4WZduioqIiDq+Rd1Jbef9ehnHmSnCtNNf7nOPcr8PHilO8jrfBF9v996lfwf6tUpl3tPvvdSjsvcwGnLt3Gsw/kzkpK8CdYH83my3Id0iT91WkL5xMktXgIfD85OD54zjfmYu5OFgN7h1LkmdBMg5fgbvAChzv49ujfEuZ3xlOk7kReTaSfL/B/jl+fMXsJLkb7AcPj8TlHC/zsgnYcyLd3zSh1vGAJr2ioqKiIn/eKXkMjn3/cWF5t/z6y37+K5urwP2YB36vPfw8yr7zeRjpu8g8cTf2H2+n89EtivLE93fs27Ez/Br2vM2+qWPl/ZyX9StFfQxW5v724PPxzXz7XHu4Pps5Jvtmiq13szmzfP0hlHkYHGn358bHeD0vYvsy+K+kz9vt/jy8gT40G1w4Rua0PN98nnaGf/e1G+mXIO2DY8P6Xz7WPz7Ky/7omJ0PBff4+B91fAqsAp8HXwI3gR04txbbdWDDWDpP/g7Yxs6BXWAP2AueJHo+M5bOpw+Cw+AIOApOgFMW7Xkdec6AkXH1+QfgyzbOTY73jy/C/gJ+/CCOP4D9xfz4I9h+TFMWtf9SRWzZwq7f0yi/L9voWSRbDfV/clx/3TuKfjoT26/iX813URx4tiVG3ay/sfFuJenb7J50A4mr1di/CZzLKZ6y2reunup4qzT+fM0wHp0PUD9+A7bYNJ5fn3eNP/Ft5bc0+S4n9/l1Gj+K82zesd1wfj3fZ79h2YyyVvLj7djfCR4xjJEyuy1+S/FyDt/MPwodn5hB8axrxy9nSBtYjOyHrs+BQ+B58E+u+wsWbWBtpb/hYL8RuA/pJ8fT2GffX+wl+daSa08jz9nxNG2k4963XBG/ZVhpUS573mh3BtPo7x/Eb7pE2yd5XvZssY/M/RZLc9SLeDsfD5gfTidi9//pwrzWu7t9lKcN7dxynthAh8vcKrQu1frHTGKBNF662KfoOXU1FsaFxe6x2kjClkBnGvXxwX0bytZ5unK+S9n2jxabTc5M0HUaIyTrfFa+Ljmflc9Xz7JtNdPa4eKz6WAPlb5l6xfLBzopWxcfncvSf7rHRJk2KSN2bKRsvcu2UZmxVIb9qd551e8rZcTERGuQ+qwIjERkjl2+djOlhWfpibnp/qxmP92FVr1/bc9GYxxuI5o3UzdukzYpj+H6nOxra9nHiaksjhDdsasPe9ca/CvOU1GVwUT4t8P921H4T8gsnkdIh+dn/pXrU0mnOZw21CbJv1P5LP0r4jtkbLH171BbCvavnFfeZ8L8K2wv/CuQRU6n/qWSNSbr2mO8xtK/U+Mq6Y/1yQyFJHHtv8Kn2uOC/Gvbf2VEPxJ9SvhY5d+Q+y21iRxLruOzsY6MWGrOkPHZ1b+jFuPzqEX/VcmoZkyIPT53k36/DZnrMd+K/Dbjs6kv6+6VYl9OU+WT07TplvMvWWhfVo3f4t48S+rbjIZl/1b5Xyd5vJdQiTyf7tUdMlbn0J9d/cn6c7M5DO1TNF0+bmT0Z3qdKaaoXeg1Lv7NEhufzyT/6vIKEeO1jX/psdi38a889qpkStcI/u12U3zE1Re+/Yv6QNwvdTDJGi9t2ps1XtKYDJ0PmcZKcU812sRxvms7J47mZ5c+SWJD5LPRg4qqj+nWL8Q5sRVrGar1EG0sOI6ndH3DVWL7wpeuwaY6O1Nh19N+Oqs5uI7Eto3aICxNrCn5rAuZ7Cn2bdJtfZPlL/k8Ld+ki6v9E56XPUvT52mV/YVvmMj2Zz8TEuNMTxfHuFfFUJ60OLrz1utODnFG47fLbSjXy0xSy4gN63EywlhMxWcNmK71svszi5OGTvdJe3rtd8ifB6I/mKBr1ap7uU/sqqTsMb+H5fxBFyuq+yqLnd7cmj33TwyOVVOwuj3nVXRtQtUGWR9jzI6kecZrKSKPuFakU2hZmXXZMDlsS1W9jBavv6eHpf3EtfJ7mKwYV0lX2g9FVY5N+Ung9aH1590+n3KLgEredfiez6u9svisY/Suk9Jsnkli1a+C1m/T7rzqd5UY9mfiXX9R92ibdZUIawTC96b1GBn6rDG1JsPv/b392SkiXVUGmyN0LO5LYi46Zf/Adc/QMaCo8TtG/bH1Z/TsW1QfUPRjm2cZee5PRaT33lEbnhlMax4qe1o/Y8a0icdaoOv9bsh+Hj6jonueoGtHumcMlX9lxLxXq7/D84fSzznGt6rtUerXxYU47/IcPeG3vqBbJ1StETZqg9fS2Akd/0Ovp+/CxD3P+/6bQwzJtsvyh5w+XjeXH9KfXGH3/VbSX4tS4XoftPZbnvcyxX1G5QvW1wbWTkbs7c3mTco6NWODbdxk3R9lGZo/aGxhiknTmETXLVs1c90u9+mBGCf6hs6fsmTq29sxPv8d82CuhCpNjGNjg31blGHrz1i41hd6nuYzbU3XhLQzj7Jt67Otw0uXUdDoH8e4F/joMdVui2dMJc3E+Tetvr6jEtPnPhJaVwz9Y7TDVlx1qnfitlEbtzlTVD0qX/pcm1esxI65PO3mU4eNrr5SZMz46FDE+aIlb5tntb1o/WOUETsW847pvNpaZH225eUpNnrS9yDy9wTysyr9XVOe63+qd3M6e4X6Ptd1Dpc1SdV53ZqFag1hpP+bE5f4ivY74BzXilzWWW1+S0TjJng91Gd9wmbNgpMVz6W8d7GJZwWtWp8p++c8fpjW0Vzff3dJfzGuoersEtnmpjVLupY48H6o7n8/C+kvJn+Lcd6q3QHx3usvZax3W8apvP6rev+UJSHfiCYe/h2aTwTaRi5DO28ZSd9zNhTfJ8b2je7drOo9HtNNbPMW03zOpq2qNqnKFN+0huhlMye2Pe9TdzfCedfxMlRfG7xjncaJ7fiXMYZk3X+ZvuKbXCGh8y8XH8TybajPTfq4tjG2/qb0RJO3SB19ba2SMuoNbW8R/g653qa9sdsRYsssu+ZxPss+tnayFd94yjofEi+hZdvo73q9jd3yisUYbfEpQ9XmMqUIm2fFZh4xkZeE1BNDL5v+ZcqXh/90bSwjflz8U0QcFWHzPOpy0amM+stqf1ad7LltVPqWmG3p3+GiIvLJf8duYA3NcBwbWRpkDXmo7RP+z5E6+8Xswz512dbrW2aMNrpKaBt9y45VR2j9efhAQL/PF38Xadq907NYC5dpZLy3kMX6PUHgeGGS3nfoPn9rObJ9s/4uMntnSt/J5TX+2ZRhtFcB8ZgVmyZbit8GCd/7/C7EOcYK7LdyjNhIlL81nqN/Xf9mOHt/anovP4X0tyem/OUZF9TmscY2nzEulq96ZeVwv2Bxxnwk3s9njT8m/YWOKl199fe53tTXyu5DLojfKWXej6R3RAPtDf1ex/PvtdJ8Q7aP7Ht6XpdXSJf8/wMdQuS/j0/HtKny9KbT+oT2K2ETuW7Tt09Uss5nCdWhjPuMTXzrztO4FHMy+V6TJaH9I6+2C5HPq9oc8xlKRva5rF8M/7tC26/6BsNFivQ//e1pVsyP19VrNrH1D5Wi7oUDdVp8Q5HVr1ztlzXPtH2Gc30+lMX3edH3ecm3fp0+Ps/IPvWH6OpiV7meEMlbzyIkpi1jtDU0Pmm6nMd0jU8bXK7N0jWkb/joHyNebfWgtrJpc0h7QiQP24aKqcwYPnTRIUmG63fRQ5VXLsekgy5NtVXVadLfpjzV9S6xYnuNri159ZmsmLCpJ8/6XSRGOaH659H+GLYtwhd51xvq31B9Qm0UavM84qhoKaNOnfwf")), $7826f90f6f0cecc9$var$stateMachine = new dfa__WEBPACK_IMPORTED_MODULE_4__($parcel$interopDefault($4b0735ca6c692ea5$exports));
            class $7826f90f6f0cecc9$export$2e2bcd8739ae039 extends $649970d87335b30f$export$2e2bcd8739ae039 {
                static planFeatures(plan) {
                    plan.addStage($7826f90f6f0cecc9$var$setupSyllables), plan.addStage([
                        "locl",
                        "ccmp"
                    ]), plan.addStage($7826f90f6f0cecc9$var$initialReordering), plan.addStage("nukt"), plan.addStage("akhn"), plan.addStage("rphf", !1), plan.addStage("rkrf"), plan.addStage("pref", !1), plan.addStage("blwf", !1), plan.addStage("abvf", !1), plan.addStage("half", !1), plan.addStage("pstf", !1), plan.addStage("vatu"), plan.addStage("cjct"), plan.addStage("cfar", !1), plan.addStage($7826f90f6f0cecc9$var$finalReordering), plan.addStage({
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
                    }), plan.unicodeScript = $130d1a642ebcd2b7$export$ce50e82f12a827a4(plan.script), plan.indicConfig = $90a9d3398ee54fe5$export$e99d119da76a0fc5[plan.unicodeScript] || $90a9d3398ee54fe5$export$e99d119da76a0fc5.Default, plan.isOldSpec = plan.indicConfig.hasOldSpec && "2" !== plan.script[plan.script.length - 1];
                }
                static assignFeatures(plan, glyphs) {
                    for(let i = glyphs.length - 1; i >= 0; i--){
                        let codepoint = glyphs[i].codePoints[0], d = $90a9d3398ee54fe5$export$f647c9cfdd77d95a[codepoint] || $7826f90f6f0cecc9$var$decompositions[codepoint];
                        if (d) {
                            let decomposed = d.map((c)=>{
                                let g = plan.font.glyphForCodePoint(c);
                                return new $10e7b257e1a9a756$export$2e2bcd8739ae039(plan.font, g.id, [
                                    c
                                ], glyphs[i].features);
                            });
                            glyphs.splice(i, 1, ...decomposed);
                        }
                    }
                }
            }
            function $7826f90f6f0cecc9$var$indicCategory(glyph) {
                return $7826f90f6f0cecc9$var$trie.get(glyph.codePoints[0]) >> 8;
            }
            function $7826f90f6f0cecc9$var$indicPosition(glyph) {
                return 1 << (0xff & $7826f90f6f0cecc9$var$trie.get(glyph.codePoints[0]));
            }
            (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)($7826f90f6f0cecc9$export$2e2bcd8739ae039, "zeroMarkWidths", "NONE");
            class $7826f90f6f0cecc9$var$IndicInfo {
                constructor(category, position, syllableType, syllable){
                    this.category = category, this.position = position, this.syllableType = syllableType, this.syllable = syllable;
                }
            }
            function $7826f90f6f0cecc9$var$setupSyllables(font, glyphs) {
                let syllable = 0, last = 0;
                for (let [start, end, tags] of $7826f90f6f0cecc9$var$stateMachine.match(glyphs.map($7826f90f6f0cecc9$var$indicCategory))){
                    if (start > last) {
                        ++syllable;
                        for(let i = last; i < start; i++)glyphs[i].shaperInfo = new $7826f90f6f0cecc9$var$IndicInfo($90a9d3398ee54fe5$export$a513ea61a7bee91c.X, $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.End, "non_indic_cluster", syllable);
                    }
                    ++syllable;
                    for(let i1 = start; i1 <= end; i1++)glyphs[i1].shaperInfo = new $7826f90f6f0cecc9$var$IndicInfo(1 << $7826f90f6f0cecc9$var$indicCategory(glyphs[i1]), $7826f90f6f0cecc9$var$indicPosition(glyphs[i1]), tags[0], syllable);
                    last = end + 1;
                }
                if (last < glyphs.length) {
                    ++syllable;
                    for(let i2 = last; i2 < glyphs.length; i2++)glyphs[i2].shaperInfo = new $7826f90f6f0cecc9$var$IndicInfo($90a9d3398ee54fe5$export$a513ea61a7bee91c.X, $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.End, "non_indic_cluster", syllable);
                }
            }
            function $7826f90f6f0cecc9$var$isConsonant(glyph) {
                return glyph.shaperInfo.category & $90a9d3398ee54fe5$export$8519deaa7de2b07;
            }
            function $7826f90f6f0cecc9$var$isJoiner(glyph) {
                return glyph.shaperInfo.category & $90a9d3398ee54fe5$export$bbcd928767338e0d;
            }
            function $7826f90f6f0cecc9$var$isHalantOrCoeng(glyph) {
                return glyph.shaperInfo.category & $90a9d3398ee54fe5$export$ca9599b2a300afc;
            }
            function $7826f90f6f0cecc9$var$wouldSubstitute(glyphs, feature) {
                for (let glyph of glyphs)glyph.features = {
                    [feature]: !0
                };
                return glyphs[0]._font._layoutEngine.engine.GSUBProcessor.applyFeatures([
                    feature
                ], glyphs), 1 === glyphs.length;
            }
            function $7826f90f6f0cecc9$var$consonantPosition(font, consonant, virama) {
                let glyphs = [
                    virama,
                    consonant,
                    virama
                ];
                return $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(0, 2), "blwf") || $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(1, 3), "blwf") ? $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Below_C : $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(0, 2), "pstf") || $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(1, 3), "pstf") || $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(0, 2), "pref") || $7826f90f6f0cecc9$var$wouldSubstitute(glyphs.slice(1, 3), "pref") ? $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Post_C : $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C;
            }
            function $7826f90f6f0cecc9$var$initialReordering(font, glyphs, plan) {
                let indicConfig = plan.indicConfig, features = font._layoutEngine.engine.GSUBProcessor.features, dottedCircle = font.glyphForCodePoint(0x25cc).id, virama = font.glyphForCodePoint(indicConfig.virama).id;
                if (virama) {
                    let info = new $10e7b257e1a9a756$export$2e2bcd8739ae039(font, virama, [
                        indicConfig.virama
                    ]);
                    for(let i = 0; i < glyphs.length; i++)glyphs[i].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C && (glyphs[i].shaperInfo.position = $7826f90f6f0cecc9$var$consonantPosition(font, glyphs[i].copy(), info));
                }
                for(let start = 0, end = $7826f90f6f0cecc9$var$nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = $7826f90f6f0cecc9$var$nextSyllable(glyphs, start)){
                    let { category: category , syllableType: syllableType  } = glyphs[start].shaperInfo;
                    if ("symbol_cluster" === syllableType || "non_indic_cluster" === syllableType) continue;
                    if ("broken_cluster" === syllableType && dottedCircle) {
                        let g = new $10e7b257e1a9a756$export$2e2bcd8739ae039(font, dottedCircle, [
                            0x25cc
                        ]);
                        g.shaperInfo = new $7826f90f6f0cecc9$var$IndicInfo(1 << $7826f90f6f0cecc9$var$indicCategory(g), $7826f90f6f0cecc9$var$indicPosition(g), glyphs[start].shaperInfo.syllableType, glyphs[start].shaperInfo.syllable);
                        let i1 = start;
                        for(; i1 < end && glyphs[i1].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.Repha;)i1++;
                        glyphs.splice(i1++, 0, g), end++;
                    }
                    let base = end, limit = start, hasReph = !1;
                    if (indicConfig.rephPos !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Ra_To_Become_Reph && features.rphf && start + 3 <= end && ("Implicit" === indicConfig.rephMode && !$7826f90f6f0cecc9$var$isJoiner(glyphs[start + 2]) || "Explicit" === indicConfig.rephMode && glyphs[start + 2].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWJ)) {
                        let g1 = [
                            glyphs[start].copy(),
                            glyphs[start + 1].copy(),
                            glyphs[start + 2].copy()
                        ];
                        if ($7826f90f6f0cecc9$var$wouldSubstitute(g1.slice(0, 2), "rphf") || "Explicit" === indicConfig.rephMode && $7826f90f6f0cecc9$var$wouldSubstitute(g1, "rphf")) {
                            for(limit += 2; limit < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[limit]);)limit++;
                            base = start, hasReph = !0;
                        }
                    } else if ("Log_Repha" === indicConfig.rephMode && glyphs[start].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.Repha) {
                        for(limit++; limit < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[limit]);)limit++;
                        base = start, hasReph = !0;
                    }
                    switch(indicConfig.basePos){
                        case "Last":
                            {
                                let i2 = end, seenBelow = !1;
                                do {
                                    let info1 = glyphs[--i2].shaperInfo;
                                    if ($7826f90f6f0cecc9$var$isConsonant(glyphs[i2])) {
                                        if (info1.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Below_C && (info1.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Post_C || seenBelow)) {
                                            base = i2;
                                            break;
                                        }
                                        info1.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Below_C && (seenBelow = !0), base = i2;
                                    } else if (start < i2 && info1.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWJ && glyphs[i2 - 1].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.H) break;
                                }while (i2 > limit)
                                break;
                            }
                        case "First":
                            base = start;
                            for(let i3 = base + 1; i3 < end; i3++)$7826f90f6f0cecc9$var$isConsonant(glyphs[i3]) && (glyphs[i3].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Below_C);
                    }
                    hasReph && base === start && limit - base <= 2 && (hasReph = !1);
                    for(let i11 = start; i11 < base; i11++){
                        let info2 = glyphs[i11].shaperInfo;
                        info2.position = Math.min($90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_C, info2.position);
                    }
                    base < end && (glyphs[base].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C);
                    for(let i21 = base + 1; i21 < end; i21++)if (glyphs[i21].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.M) {
                        for(let j = i21 + 1; j < end; j++)if ($7826f90f6f0cecc9$var$isConsonant(glyphs[j])) {
                            glyphs[j].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Final_C;
                            break;
                        }
                        break;
                    }
                    if (hasReph && (glyphs[start].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Ra_To_Become_Reph), plan.isOldSpec) {
                        let disallowDoubleHalants = "Malayalam" !== plan.unicodeScript;
                        for(let i4 = base + 1; i4 < end; i4++)if (glyphs[i4].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.H) {
                            let j1;
                            for(j1 = end - 1; j1 > i4 && !$7826f90f6f0cecc9$var$isConsonant(glyphs[j1]) && (!disallowDoubleHalants || glyphs[j1].shaperInfo.category !== $90a9d3398ee54fe5$export$a513ea61a7bee91c.H); j1--);
                            if (glyphs[j1].shaperInfo.category !== $90a9d3398ee54fe5$export$a513ea61a7bee91c.H && j1 > i4) {
                                let t = glyphs[i4];
                                glyphs.splice(i4, 0, ...glyphs.splice(i4 + 1, j1 - i4)), glyphs[j1] = t;
                            }
                            break;
                        }
                    }
                    let lastPos = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Start;
                    for(let i31 = start; i31 < end; i31++){
                        let info3 = glyphs[i31].shaperInfo;
                        if (info3.category & ($90a9d3398ee54fe5$export$bbcd928767338e0d | $90a9d3398ee54fe5$export$a513ea61a7bee91c.N | $90a9d3398ee54fe5$export$a513ea61a7bee91c.RS | $90a9d3398ee54fe5$export$a513ea61a7bee91c.CM | $90a9d3398ee54fe5$export$ca9599b2a300afc & info3.category)) {
                            if (info3.position = lastPos, info3.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.H && info3.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M) {
                                for(let j2 = i31; j2 > start; j2--)if (glyphs[j2 - 1].shaperInfo.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M) {
                                    info3.position = glyphs[j2 - 1].shaperInfo.position;
                                    break;
                                }
                            }
                        } else info3.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.SMVD && (lastPos = info3.position);
                    }
                    let last = base;
                    for(let i41 = base + 1; i41 < end; i41++)if ($7826f90f6f0cecc9$var$isConsonant(glyphs[i41])) {
                        for(let j3 = last + 1; j3 < i41; j3++)glyphs[j3].shaperInfo.position < $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.SMVD && (glyphs[j3].shaperInfo.position = glyphs[i41].shaperInfo.position);
                        last = i41;
                    } else glyphs[i41].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.M && (last = i41);
                    let arr = glyphs.slice(start, end);
                    arr.sort((a, b)=>a.shaperInfo.position - b.shaperInfo.position), glyphs.splice(start, arr.length, ...arr);
                    for(let i5 = start; i5 < end; i5++)if (glyphs[i5].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C) {
                        base = i5;
                        break;
                    }
                    for(let i6 = start; i6 < end && glyphs[i6].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Ra_To_Become_Reph; i6++)glyphs[i6].features.rphf = !0;
                    let blwf = !plan.isOldSpec && "Pre_And_Post" === indicConfig.blwfMode;
                    for(let i7 = start; i7 < base; i7++)glyphs[i7].features.half = !0, blwf && (glyphs[i7].features.blwf = !0);
                    for(let i8 = base + 1; i8 < end; i8++)glyphs[i8].features.abvf = !0, glyphs[i8].features.pstf = !0, glyphs[i8].features.blwf = !0;
                    if (plan.isOldSpec && "Devanagari" === plan.unicodeScript) for(let i9 = start; i9 + 1 < base; i9++)glyphs[i9].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.Ra && glyphs[i9 + 1].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.H && (i9 + 1 === base || glyphs[i9 + 2].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWJ) && (glyphs[i9].features.blwf = !0, glyphs[i9 + 1].features.blwf = !0);
                    let prefLen = 2;
                    if (features.pref && base + prefLen < end) {
                        for(let i91 = base + 1; i91 + prefLen - 1 < end; i91++)if ($7826f90f6f0cecc9$var$wouldSubstitute([
                            glyphs[i91].copy(),
                            glyphs[i91 + 1].copy()
                        ], "pref")) {
                            for(let j4 = 0; j4 < prefLen; j4++)glyphs[i91++].features.pref = !0;
                            if (features.cfar) for(; i91 < end; i91++)glyphs[i91].features.cfar = !0;
                            break;
                        }
                    }
                    for(let i10 = start + 1; i10 < end; i10++)if ($7826f90f6f0cecc9$var$isJoiner(glyphs[i10])) {
                        let nonJoiner = glyphs[i10].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWNJ, j5 = i10;
                        do j5--, nonJoiner && delete glyphs[j5].features.half;
                        while (j5 > start && !$7826f90f6f0cecc9$var$isConsonant(glyphs[j5]))
                    }
                }
            }
            function $7826f90f6f0cecc9$var$finalReordering(font, glyphs, plan) {
                let indicConfig = plan.indicConfig, features = font._layoutEngine.engine.GSUBProcessor.features;
                for(let start = 0, end = $7826f90f6f0cecc9$var$nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = $7826f90f6f0cecc9$var$nextSyllable(glyphs, start)){
                    let tryPref = !!features.pref, base = start;
                    for(; base < end; base++)if (glyphs[base].shaperInfo.position >= $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C) {
                        if (tryPref && base + 1 < end) {
                            for(let i = base + 1; i < end; i++)if (glyphs[i].features.pref) {
                                if (!(glyphs[i].substituted && glyphs[i].isLigated && !glyphs[i].isMultiplied)) {
                                    for(base = i; base < end && $7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[base]);)base++;
                                    glyphs[base].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.BASE_C, tryPref = !1;
                                }
                                break;
                            }
                        }
                        if ("Malayalam" === plan.unicodeScript) for(let i1 = base + 1; i1 < end; i1++){
                            for(; i1 < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[i1]);)i1++;
                            if (i1 === end || !$7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[i1])) break;
                            for(i1++; i1 < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[i1]);)i1++;
                            i1 < end && $7826f90f6f0cecc9$var$isConsonant(glyphs[i1]) && glyphs[i1].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Below_C && (glyphs[base = i1].shaperInfo.position = $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C);
                        }
                        start < base && glyphs[base].shaperInfo.position > $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Base_C && base--;
                        break;
                    }
                    if (base === end && start < base && glyphs[base - 1].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.ZWJ && base--, base < end) for(; start < base && glyphs[base].shaperInfo.category & ($90a9d3398ee54fe5$export$a513ea61a7bee91c.N | $90a9d3398ee54fe5$export$ca9599b2a300afc);)base--;
                    if (start + 1 < end && start < base) {
                        let newPos = base === end ? base - 2 : base - 1;
                        if ("Malayalam" !== plan.unicodeScript && "Tamil" !== plan.unicodeScript) {
                            for(; newPos > start && !(glyphs[newPos].shaperInfo.category & ($90a9d3398ee54fe5$export$a513ea61a7bee91c.M | $90a9d3398ee54fe5$export$ca9599b2a300afc));)newPos--;
                            $7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newPos]) && glyphs[newPos].shaperInfo.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M ? newPos + 1 < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[newPos + 1]) && newPos++ : newPos = start;
                        }
                        if (start < newPos && glyphs[newPos].shaperInfo.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M) {
                            for(let i2 = newPos; i2 > start; i2--)if (glyphs[i2 - 1].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M) {
                                let oldPos = i2 - 1;
                                oldPos < base && base <= newPos && base--;
                                let tmp = glyphs[oldPos];
                                glyphs.splice(oldPos, 0, ...glyphs.splice(oldPos + 1, newPos - oldPos)), glyphs[newPos] = tmp, newPos--;
                            }
                        }
                    }
                    if (start + 1 < end && glyphs[start].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Ra_To_Become_Reph && glyphs[start].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.Repha !== (glyphs[start].isLigated && !glyphs[start].isMultiplied)) {
                        let newRephPos, rephPos = indicConfig.rephPos, found = !1;
                        if (rephPos !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Post) {
                            for(newRephPos = start + 1; newRephPos < base && !$7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newRephPos]);)newRephPos++;
                            if (newRephPos < base && $7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newRephPos]) && (newRephPos + 1 < base && $7826f90f6f0cecc9$var$isJoiner(glyphs[newRephPos + 1]) && newRephPos++, found = !0), !found && rephPos === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Main) {
                                for(newRephPos = base; newRephPos + 1 < end && glyphs[newRephPos + 1].shaperInfo.position <= $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Main;)newRephPos++;
                                found = newRephPos < end;
                            }
                            if (!found && rephPos === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Sub) {
                                for(newRephPos = base; newRephPos + 1 < end && !(glyphs[newRephPos + 1].shaperInfo.position & ($90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Post_C | $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.After_Post | $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.SMVD));)newRephPos++;
                                found = newRephPos < end;
                            }
                        }
                        if (!found) {
                            for(newRephPos = start + 1; newRephPos < base && !$7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newRephPos]);)newRephPos++;
                            newRephPos < base && $7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newRephPos]) && (newRephPos + 1 < base && $7826f90f6f0cecc9$var$isJoiner(glyphs[newRephPos + 1]) && newRephPos++, found = !0);
                        }
                        if (!found) {
                            for(newRephPos = end - 1; newRephPos > start && glyphs[newRephPos].shaperInfo.position === $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.SMVD;)newRephPos--;
                            if ($7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newRephPos])) for(let i3 = base + 1; i3 < newRephPos; i3++)glyphs[i3].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.M && newRephPos--;
                        }
                        let reph = glyphs[start];
                        glyphs.splice(start, 0, ...glyphs.splice(start + 1, newRephPos - start)), glyphs[newRephPos] = reph, start < base && base <= newRephPos && base--;
                    }
                    if (tryPref && base + 1 < end) {
                        for(let i4 = base + 1; i4 < end; i4++)if (glyphs[i4].features.pref) {
                            if (glyphs[i4].isLigated && !glyphs[i4].isMultiplied) {
                                let newPos1 = base;
                                if ("Malayalam" !== plan.unicodeScript && "Tamil" !== plan.unicodeScript) {
                                    for(; newPos1 > start && !(glyphs[newPos1 - 1].shaperInfo.category & ($90a9d3398ee54fe5$export$a513ea61a7bee91c.M | $90a9d3398ee54fe5$export$ca9599b2a300afc));)newPos1--;
                                    if (newPos1 > start && glyphs[newPos1 - 1].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.M) {
                                        let oldPos1 = i4;
                                        for(let j = base + 1; j < oldPos1; j++)if (glyphs[j].shaperInfo.category === $90a9d3398ee54fe5$export$a513ea61a7bee91c.M) {
                                            newPos1--;
                                            break;
                                        }
                                    }
                                }
                                newPos1 > start && $7826f90f6f0cecc9$var$isHalantOrCoeng(glyphs[newPos1 - 1]) && newPos1 < end && $7826f90f6f0cecc9$var$isJoiner(glyphs[newPos1]) && newPos1++;
                                let oldPos2 = i4, tmp1 = glyphs[oldPos2];
                                glyphs.splice(newPos1 + 1, 0, ...glyphs.splice(newPos1, oldPos2 - newPos1)), glyphs[newPos1] = tmp1, newPos1 <= base && base < oldPos2 && base++;
                            }
                            break;
                        }
                    }
                    glyphs[start].shaperInfo.position !== $90a9d3398ee54fe5$export$1a1f61c9c4dd9df0.Pre_M || start && /Cf|Mn/.test((0, unicode_properties__WEBPACK_IMPORTED_MODULE_2__.n3)(glyphs[start - 1].codePoints[0])) || (glyphs[start].features.init = !0);
                }
            }
            function $7826f90f6f0cecc9$var$nextSyllable(glyphs, start) {
                if (start >= glyphs.length) return start;
                let syllable = glyphs[start].shaperInfo.syllable;
                for(; ++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable;);
                return start;
            }
            const { categories: $7ab494fe977143c6$var$categories , decompositions: $7ab494fe977143c6$var$decompositions  } = $parcel$interopDefault($aa333a9607471296$exports), $7ab494fe977143c6$var$trie = new unicode_trie__WEBPACK_IMPORTED_MODULE_3__($12727730ddfc8bfe$export$94fdf11bafc8de6b("AAACAAAAAADQqQAAAVEMrvPtnH+oHUcVx+fd99799W5e8mx+9NkYm7YUI2KtimkVDG3FWgVTFY1Fqa2VJirYB0IaUFLBaKGJViXir6oxKCSBoi0UTKtg2yA26h+milYNtMH+0WK1VQyvtBS/487hnncyMzuzu7N7n7kHPszu7OzMmTNzdmdmfzzfUmpiUqkemAMbwSZwKbjcxM1XEL4VvB28G3zAk+56cLMlfgdYADvBbvBF8GWwH9xl+CFLfwj8BPwU/MKS38/AMfA86v9ro9ucQcdR+CjCP4CT4EnwDPg3eAFMTik1A+bAPNgINoFLwGawZSpLfzXCrWAb+AjYDm4BO8FusAfsA/vBXeAgOALuNfv3g4fAcXACPAaeAE+B58Bp8NJUpnN7WqlZsHY629+A8GLwWvAG8BZwJXinOf5ehB8EN4AdYGE6q7dmF9uugs8hvz0V58nZK/L+Kva/BX4ADoN7prP6HgUPgkfA73L0eQzHnwBPgX+Y80+DF8FUW6lBO4tbjXA9uAi8pj3sS2/E9mawBVwNtoJt5pzrTXgzwk+B7awP7sT+7nY6WxFfQBlfAl8H3wU/Anezcu/D9s/BMRN3HOEJ8EdwMkC/J5HmmXZmq2fBIjgEVEepbieLX4Fw0MnSrzRxmrVsm7MB8ReDV4vjr3ekJy7rZGVPMb196Xm6oug83oRyt4CrwDVgK9gGPtzxn3uTOD6YPDPNJ5Hm0+AznazffJ7Z4KSnXncg3VfAN8EBhx42/z/UGdbrx52sr9yH8AFTrt5+2GzfnWPbKuw7ZszZyNh/xowZM2bMmDFjxsQyZ5lPNs3h9nBNYHuAfr9ic9ffiHnsJzznU91/j3P+2snWYf6G8O/gn+A0eMnEt7vQp5ulX4NwHmwEm7rZ8UsRXg6uMPvXIHwPuK7rLl+nu9FzfMyYMWPGpGVuslmarv+YMWPSkNq/d2D8uNDNngvdivA2y3jy9m72bF9v3ymOf2MExp8fG2TsAcfA2wJYBJetWBq3i+0fwPafwLmzSl0LFmZNPMLHZ4fpnsX2AdjgcXB+T6kPge+AG7D/vXYW/tLsc9r9M+MkVyLNR1m6g9g+ZfYvmMExcHCm+ftP0+T5y/e17Uw/PYLwHnC0m80TH+zG30/3mjSDnPS2/B4pUJ4rX3n+b5H3o92l6UjfvZ7y/oJzToGnu8O66XTPYf8/Jr8XWL6TPXf9bPnHtmVs+89AnxVgDVgPLgKvAg+Y/F6H7c1gC7jKHH8XeJ/x15vAjt4wvwVs7wKfBXvAPvA18G1wsJevj36f5gjS3etIq+ft9+PYQ73h/nFsn2D7f+5l75bo/VPYftpTblFb2/Jo2pdjfL0uXOX/qxfnp8vZVk2Xv9hbmu+LxvYt3A/7/WZsPoptPkr9bdCv1ya+d4TuMO8Tre5n4XkILwSbzP4l/WHazX1//r2O/z7cFHnvSYW8R/Vm02ZXIHxHze1Xdf9bbn7p0z2kDroNr2X9WL+7937sX9fP+v9h9n6jTrfI3jG9EfsfN3G35PR/G4uRfY3eMTwdkFa/C3hrf2kcfy/xYTOmprrfZsLbEe7rDPW/U9Rrv9k/ahmTL0cWWxP/YxRkgtES+zwNhZPs+FQgMj/liEsto2HxsZBQX2pZoLZqWc5riXDaQBLSt1L3hcnE+Vct7aYVKCEhbXk2+b7NZ84mmXAwCiL14Ne85S62MYPcXi5StM/YxlJF2lfabznZsC6/C807xvZV+yFve9d1KY//d3HNO8pKUXuTDh0Gpp7B852q6QFMgdWM2dfbAxOuEPQEfcEsO5fquJLZrMfyCtWP0heZF6oSdiH9u4aQvJRIJ/eL6BBynItLp5D2JRkY5L5u3xAf6lviXHWSZcfaKO/+5zvO/c9Xtq8uRXSObd+8bS0zJrS1rxTyX7k/a0nrk5D+mHeOC90uq1Q216X57lykfqHt62uTGJ2rat+i/kttyq/RSi29PlclZf2Xxq55ZeSV34T96d5X5PqZJ9I3ZX2lnkXt3xL1Kyrav/LutbZ6uGxuS6ss6V3pXOXY4kP7EBfyJT7+4TJQS9uf74f6n+3+6ZIi9bCtieatFfCxUMx4KMYfy/pzrB30vm88q9SZ11K+n9eeNN612UFKWX8uI9TmRca7TbWvKy2JvF6naF+b/0uRupZp35cZikhZvyniY2R/CbdB3vXynIC6hbRBHf4l1xps6w4x/lVEtxRtGZMuRA8uNh/jfYV8kdpsBUszcODrD7E2JT2KrB3V6XMhbdNjcXItxzaOJWkpf976/I5glQn1sbLP86U9FQvz4l0S28/lcWUJbbrE2l+Z/TlHvi4/kvZXLMyrmy1PW7x8hl6UFgvlmNM1Jq3aJ3Se0yJcpdwS6mOp/ZgLX5N1rdFKaIzH9ztquMbqq+/qCFRk+hRoyZvrTHuO8fNd/djmEzZJ3TdisN1bNQNl7y96DV/3mVkTtwasVdk1ai6ybGlDek8nT1fXc4M5tVSPvhqOsWQeXQs8L1n3IradU8OxCeVjK7dr7Dpl0cMHnUvt18TzfVsfb/pZY56fV2GnVPVIYaOi9xcZJ8cmKcu3wcuPsVHV5cdKFfZXNZefp5sWft+wzR1cczKCxh99NRx76HvwOpWNv6YZtAajt6WPyPswtVVs/VOJ7xpYx3VR31er7gMxNuV9Q443CDlW43KuYSXblsybfKYt58trfez7A1X7Tdm+V7TcoudL+LpVGf2khN63U5OyD5Af0NoUv06l7Jc0Rte+so4xL9Ayy3Rz+SufY5Jf267xcm7J4dd3kumIOrmk7Pl549bUY1puI91Gdb8Tpu+9tjmhXFdwtfVsTv5SQvXKW0cK4eXgPBO6iJ07NNVOHH7/tF1jyJdnWbrU/Uau3VNI156QZ2ZaZFu76i6vQXy9YJ2H9QZ97aF3p1xlx1yfuYRcd0Kl7NyaX190+pUOKI0tvus5j7/nSWKLo3FER8R3LHEx8gqwge1POgi1l1yfirV3zHpISHxs3vLeFXOellcG1DFGbGP00PPkeKEOaXIsqhzbruOh9Qk5L08nW2grJ0avsvWocv0zRh/fGCG0TV35hB4v0rds5Vddjm/sFCKx+aXSt2yalPZsolxXW46CDnXp0YQ0rdso9OUYPSYT6+yzuxxzlrVfFfavQ/LKqsP+dbVzE/0qRb8pKin6V9U6Fnn24pqHufLMWy90nV+0DkXmcrb0Uq+6pU7/qcs/67SHTeTaaBk9ipyXQvLqW1U7uPKpux/ESlP9umydR8H3UjzHoXxj0/J1Yr5ubHsPrWOJqxK+hk5r+EVtH3pe1XWIXa+1vQ9YJ/oZre1bGReh3xKWeX7BxfYstwh5errGJi59be8482cSsfUPQT4Xlc9K+XMmatcY0fo2+SxYQs/4XO8M03Ng/TxujYH+FRELSdH+6mtveu8itb1Cy7C9X8GfsVOcfN86RHg56wJ0ob5qOz/E/rIdq7YhF34/0cfoeWKVftJjIbWDbDfXeXR/prBOKWJ/3dd43+sr+32TvgEIEZ6/7Zt5/l7ghMm77u+ey4gcz5xfktA5vE9C5vy2Y3lpXeX40tHcLMX42qZHS/ltZluXiSlDxillt3VdIvufbc0j75wy5aWaOxWRUZmfl5nDSh3LzoWbXJOg8uumKkndp1PnH2IPfe+U33z7vjWhdPQuWMh4raqxWMh9X89RZtSZ7/JpyXs3NWQcETN3CZHU/lmVnstZB1+ZfM5A/1VJ2V9t8wTXN1S+f27mzaulbCxJHePwC1Tz/0K1/VdPvtOsba+vL7ZxM1/jakJ/V9/yfdtNx+i7bhVRRll/rrK+sk3qLt/3T0afH+tzz1HDfxzZ/HlGDduK1y/GL21zvKptQGWFSpVlFm0z+ZxD/vdAt9EqQ971NkRHW7qytog53+cfVfeFGLStfddfYka5x6dl+yi//4z6/559aUn4/+/k2pv8BqfM/0qVCnu+If2OJPRZUcyzJF/5RQm5xtM9ln+LRN+8U9+iMQS1Veg9q2z/TlV3Ett3/rLOIXOookidy/5X3GYD+S8a1z2e0vH695T9vhEqdbY//0dU3jWZ2rYq/cvCRT8r08/NLlT5/zySdSurv1ybLiup5tAp5+NNzfPJ5r61warapajItfTQNeK610/rWEMPyb+uOo/ierRNbGU01Z+rqneIPWNsT9t1rD+OYr8rm0eKvp/Ch1P4Yepyy+hWVD/f+VWXX5X+TZdfZZ+KLb9J+S8=")), $7ab494fe977143c6$var$stateMachine = new dfa__WEBPACK_IMPORTED_MODULE_4__($parcel$interopDefault($aa333a9607471296$exports));
            class $7ab494fe977143c6$export$2e2bcd8739ae039 extends $649970d87335b30f$export$2e2bcd8739ae039 {
                static planFeatures(plan) {
                    plan.addStage($7ab494fe977143c6$var$setupSyllables), plan.addStage([
                        "locl",
                        "ccmp",
                        "nukt",
                        "akhn"
                    ]), plan.addStage($7ab494fe977143c6$var$clearSubstitutionFlags), plan.addStage([
                        "rphf"
                    ], !1), plan.addStage($7ab494fe977143c6$var$recordRphf), plan.addStage($7ab494fe977143c6$var$clearSubstitutionFlags), plan.addStage([
                        "pref"
                    ]), plan.addStage($7ab494fe977143c6$var$recordPref), plan.addStage([
                        "rkrf",
                        "abvf",
                        "blwf",
                        "half",
                        "pstf",
                        "vatu",
                        "cjct"
                    ]), plan.addStage($7ab494fe977143c6$var$reorder), plan.addStage([
                        "abvs",
                        "blws",
                        "pres",
                        "psts",
                        "dist",
                        "abvm",
                        "blwm"
                    ]);
                }
                static assignFeatures(plan, glyphs) {
                    for(let i = glyphs.length - 1; i >= 0; i--){
                        let codepoint = glyphs[i].codePoints[0];
                        if ($7ab494fe977143c6$var$decompositions[codepoint]) {
                            let decomposed = $7ab494fe977143c6$var$decompositions[codepoint].map((c)=>{
                                let g = plan.font.glyphForCodePoint(c);
                                return new $10e7b257e1a9a756$export$2e2bcd8739ae039(plan.font, g.id, [
                                    c
                                ], glyphs[i].features);
                            });
                            glyphs.splice(i, 1, ...decomposed);
                        }
                    }
                }
            }
            function $7ab494fe977143c6$var$useCategory(glyph) {
                return $7ab494fe977143c6$var$trie.get(glyph.codePoints[0]);
            }
            (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)($7ab494fe977143c6$export$2e2bcd8739ae039, "zeroMarkWidths", "BEFORE_GPOS");
            class $7ab494fe977143c6$var$USEInfo {
                constructor(category, syllableType, syllable){
                    this.category = category, this.syllableType = syllableType, this.syllable = syllable;
                }
            }
            function $7ab494fe977143c6$var$setupSyllables(font, glyphs) {
                let syllable = 0;
                for (let [start, end, tags] of $7ab494fe977143c6$var$stateMachine.match(glyphs.map($7ab494fe977143c6$var$useCategory))){
                    ++syllable;
                    for(let i = start; i <= end; i++)glyphs[i].shaperInfo = new $7ab494fe977143c6$var$USEInfo($7ab494fe977143c6$var$categories[$7ab494fe977143c6$var$useCategory(glyphs[i])], tags[0], syllable);
                    let limit = "R" === glyphs[start].shaperInfo.category ? 1 : Math.min(3, end - start);
                    for(let i1 = start; i1 < start + limit; i1++)glyphs[i1].features.rphf = !0;
                }
            }
            function $7ab494fe977143c6$var$clearSubstitutionFlags(font, glyphs) {
                for (let glyph of glyphs)glyph.substituted = !1;
            }
            function $7ab494fe977143c6$var$recordRphf(font, glyphs) {
                for (let glyph of glyphs)glyph.substituted && glyph.features.rphf && (glyph.shaperInfo.category = "R");
            }
            function $7ab494fe977143c6$var$recordPref(font, glyphs) {
                for (let glyph of glyphs)glyph.substituted && (glyph.shaperInfo.category = "VPre");
            }
            function $7ab494fe977143c6$var$reorder(font, glyphs) {
                let dottedCircle = font.glyphForCodePoint(0x25cc).id;
                for(let start = 0, end = $7ab494fe977143c6$var$nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = $7ab494fe977143c6$var$nextSyllable(glyphs, start)){
                    let i, j, info = glyphs[start].shaperInfo, type = info.syllableType;
                    if ("virama_terminated_cluster" === type || "standard_cluster" === type || "broken_cluster" === type) {
                        if ("broken_cluster" === type && dottedCircle) {
                            let g = new $10e7b257e1a9a756$export$2e2bcd8739ae039(font, dottedCircle, [
                                0x25cc
                            ]);
                            for(g.shaperInfo = info, i = start; i < end && "R" === glyphs[i].shaperInfo.category; i++);
                            glyphs.splice(++i, 0, g), end++;
                        }
                        if ("R" === info.category && end - start > 1) {
                            for(i = start + 1; i < end; i++)if ($7ab494fe977143c6$var$isBase(info = glyphs[i].shaperInfo) || $7ab494fe977143c6$var$isHalant(glyphs[i])) {
                                $7ab494fe977143c6$var$isHalant(glyphs[i]) && i--, glyphs.splice(start, 0, ...glyphs.splice(start + 1, i - start), glyphs[i]);
                                break;
                            }
                        }
                        for(i = start, j = end; i < end; i++)$7ab494fe977143c6$var$isBase(info = glyphs[i].shaperInfo) || $7ab494fe977143c6$var$isHalant(glyphs[i]) ? j = $7ab494fe977143c6$var$isHalant(glyphs[i]) ? i + 1 : i : ("VPre" === info.category || "VMPre" === info.category) && j < i && glyphs.splice(j, 1, glyphs[i], ...glyphs.splice(j, i - j));
                    }
                }
            }
            function $7ab494fe977143c6$var$nextSyllable(glyphs, start) {
                if (start >= glyphs.length) return start;
                let syllable = glyphs[start].shaperInfo.syllable;
                for(; ++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable;);
                return start;
            }
            function $7ab494fe977143c6$var$isHalant(glyph) {
                return "H" === glyph.shaperInfo.category && !glyph.isLigated;
            }
            function $7ab494fe977143c6$var$isBase(info) {
                return "B" === info.category || "GB" === info.category;
            }
            const $102b6fe50f1d50b4$var$SHAPERS = {
                arab: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                mong: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                syrc: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                "nko ": $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                phag: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                mand: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                mani: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                phlp: $764eb544bbe1ccf0$export$2e2bcd8739ae039,
                hang: $e1c6bbc8cb416f8c$export$2e2bcd8739ae039,
                bng2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                beng: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                dev2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                deva: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                gjr2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                gujr: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                guru: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                gur2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                knda: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                knd2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                mlm2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                mlym: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                ory2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                orya: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                taml: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                tml2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                telu: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                tel2: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                khmr: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                bali: $7ab494fe977143c6$export$2e2bcd8739ae039,
                batk: $7ab494fe977143c6$export$2e2bcd8739ae039,
                brah: $7ab494fe977143c6$export$2e2bcd8739ae039,
                bugi: $7ab494fe977143c6$export$2e2bcd8739ae039,
                buhd: $7ab494fe977143c6$export$2e2bcd8739ae039,
                cakm: $7ab494fe977143c6$export$2e2bcd8739ae039,
                cham: $7ab494fe977143c6$export$2e2bcd8739ae039,
                dupl: $7ab494fe977143c6$export$2e2bcd8739ae039,
                egyp: $7ab494fe977143c6$export$2e2bcd8739ae039,
                gran: $7ab494fe977143c6$export$2e2bcd8739ae039,
                hano: $7ab494fe977143c6$export$2e2bcd8739ae039,
                java: $7ab494fe977143c6$export$2e2bcd8739ae039,
                kthi: $7ab494fe977143c6$export$2e2bcd8739ae039,
                kali: $7ab494fe977143c6$export$2e2bcd8739ae039,
                khar: $7ab494fe977143c6$export$2e2bcd8739ae039,
                khoj: $7ab494fe977143c6$export$2e2bcd8739ae039,
                sind: $7ab494fe977143c6$export$2e2bcd8739ae039,
                lepc: $7ab494fe977143c6$export$2e2bcd8739ae039,
                limb: $7ab494fe977143c6$export$2e2bcd8739ae039,
                mahj: $7ab494fe977143c6$export$2e2bcd8739ae039,
                mtei: $7ab494fe977143c6$export$2e2bcd8739ae039,
                modi: $7ab494fe977143c6$export$2e2bcd8739ae039,
                hmng: $7ab494fe977143c6$export$2e2bcd8739ae039,
                rjng: $7ab494fe977143c6$export$2e2bcd8739ae039,
                saur: $7ab494fe977143c6$export$2e2bcd8739ae039,
                shrd: $7ab494fe977143c6$export$2e2bcd8739ae039,
                sidd: $7ab494fe977143c6$export$2e2bcd8739ae039,
                sinh: $7826f90f6f0cecc9$export$2e2bcd8739ae039,
                sund: $7ab494fe977143c6$export$2e2bcd8739ae039,
                sylo: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tglg: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tagb: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tale: $7ab494fe977143c6$export$2e2bcd8739ae039,
                lana: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tavt: $7ab494fe977143c6$export$2e2bcd8739ae039,
                takr: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tibt: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tfng: $7ab494fe977143c6$export$2e2bcd8739ae039,
                tirh: $7ab494fe977143c6$export$2e2bcd8739ae039,
                latn: $649970d87335b30f$export$2e2bcd8739ae039,
                DFLT: $649970d87335b30f$export$2e2bcd8739ae039
            };
            function $102b6fe50f1d50b4$export$7877a478dd30fd3d(script) {
                for (let s of (Array.isArray(script) || (script = [
                    script
                ]), script)){
                    let shaper = $102b6fe50f1d50b4$var$SHAPERS[s];
                    if (shaper) return shaper;
                }
                return $649970d87335b30f$export$2e2bcd8739ae039;
            }
            class $0a876c45f1f7c41c$export$2e2bcd8739ae039 extends $a83b9c36aaa94fd3$export$2e2bcd8739ae039 {
                applyLookup(lookupType, table) {
                    switch(lookupType){
                        case 1:
                            {
                                let index = this.coverageIndex(table.coverage);
                                if (-1 === index) return !1;
                                let glyph = this.glyphIterator.cur;
                                switch(table.version){
                                    case 1:
                                        glyph.id = glyph.id + table.deltaGlyphID & 0xffff;
                                        break;
                                    case 2:
                                        glyph.id = table.substitute.get(index);
                                }
                                return !0;
                            }
                        case 2:
                            {
                                let index1 = this.coverageIndex(table.coverage);
                                if (-1 !== index1) {
                                    let sequence = table.sequences.get(index1);
                                    if (0 === sequence.length) return this.glyphs.splice(this.glyphIterator.index, 1), !0;
                                    this.glyphIterator.cur.id = sequence[0], this.glyphIterator.cur.ligatureComponent = 0;
                                    let features = this.glyphIterator.cur.features, curGlyph = this.glyphIterator.cur, replacement = sequence.slice(1).map((gid, i)=>{
                                        let glyph = new $10e7b257e1a9a756$export$2e2bcd8739ae039(this.font, gid, void 0, features);
                                        return glyph.shaperInfo = curGlyph.shaperInfo, glyph.isLigated = curGlyph.isLigated, glyph.ligatureComponent = i + 1, glyph.substituted = !0, glyph.isMultiplied = !0, glyph;
                                    });
                                    return this.glyphs.splice(this.glyphIterator.index + 1, 0, ...replacement), !0;
                                }
                                return !1;
                            }
                        case 3:
                            {
                                let index2 = this.coverageIndex(table.coverage);
                                if (-1 !== index2) return this.glyphIterator.cur.id = table.alternateSet.get(index2)[0], !0;
                                return !1;
                            }
                        case 4:
                            {
                                let index3 = this.coverageIndex(table.coverage);
                                if (-1 === index3) return !1;
                                for (let ligature of table.ligatureSets.get(index3)){
                                    let matched = this.sequenceMatchIndices(1, ligature.components);
                                    if (!matched) continue;
                                    let curGlyph1 = this.glyphIterator.cur, characters = curGlyph1.codePoints.slice();
                                    for (let index4 of matched)characters.push(...this.glyphs[index4].codePoints);
                                    let ligatureGlyph = new $10e7b257e1a9a756$export$2e2bcd8739ae039(this.font, ligature.glyph, characters, curGlyph1.features);
                                    ligatureGlyph.shaperInfo = curGlyph1.shaperInfo, ligatureGlyph.isLigated = !0, ligatureGlyph.substituted = !0;
                                    let isMarkLigature = curGlyph1.isMark;
                                    for(let i = 0; i < matched.length && isMarkLigature; i++)isMarkLigature = this.glyphs[matched[i]].isMark;
                                    ligatureGlyph.ligatureID = isMarkLigature ? null : this.ligatureID++;
                                    let lastLigID = curGlyph1.ligatureID, lastNumComps = curGlyph1.codePoints.length, curComps = lastNumComps, idx = this.glyphIterator.index + 1;
                                    for (let matchIndex of matched){
                                        if (isMarkLigature) idx = matchIndex;
                                        else for(; idx < matchIndex;){
                                            var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[idx].ligatureComponent || 1, lastNumComps);
                                            this.glyphs[idx].ligatureID = ligatureGlyph.ligatureID, this.glyphs[idx].ligatureComponent = ligatureComponent, idx++;
                                        }
                                        lastLigID = this.glyphs[idx].ligatureID, curComps += lastNumComps = this.glyphs[idx].codePoints.length, idx++;
                                    }
                                    if (lastLigID && !isMarkLigature) for(let i1 = idx; i1 < this.glyphs.length && this.glyphs[i1].ligatureID === lastLigID; i1++){
                                        var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[i1].ligatureComponent || 1, lastNumComps);
                                        this.glyphs[i1].ligatureComponent = ligatureComponent;
                                    }
                                    for(let i2 = matched.length - 1; i2 >= 0; i2--)this.glyphs.splice(matched[i2], 1);
                                    return this.glyphs[this.glyphIterator.index] = ligatureGlyph, !0;
                                }
                                return !1;
                            }
                        case 5:
                            return this.applyContext(table);
                        case 6:
                            return this.applyChainingContext(table);
                        case 7:
                            return this.applyLookup(table.lookupType, table.extension);
                        default:
                            throw Error(`GSUB lookupType ${lookupType} is not supported`);
                    }
                }
            }
            class $c96c93587d49c14d$export$2e2bcd8739ae039 extends $a83b9c36aaa94fd3$export$2e2bcd8739ae039 {
                applyPositionValue(sequenceIndex, value) {
                    let position = this.positions[this.glyphIterator.peekIndex(sequenceIndex)];
                    null != value.xAdvance && (position.xAdvance += value.xAdvance), null != value.yAdvance && (position.yAdvance += value.yAdvance), null != value.xPlacement && (position.xOffset += value.xPlacement), null != value.yPlacement && (position.yOffset += value.yPlacement);
                    let variationProcessor = this.font._variationProcessor, variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;
                    variationProcessor && variationStore && (value.xPlaDevice && (position.xOffset += variationProcessor.getDelta(variationStore, value.xPlaDevice.a, value.xPlaDevice.b)), value.yPlaDevice && (position.yOffset += variationProcessor.getDelta(variationStore, value.yPlaDevice.a, value.yPlaDevice.b)), value.xAdvDevice && (position.xAdvance += variationProcessor.getDelta(variationStore, value.xAdvDevice.a, value.xAdvDevice.b)), value.yAdvDevice && (position.yAdvance += variationProcessor.getDelta(variationStore, value.yAdvDevice.a, value.yAdvDevice.b)));
                }
                applyLookup(lookupType, table) {
                    switch(lookupType){
                        case 1:
                            {
                                let index = this.coverageIndex(table.coverage);
                                if (-1 === index) return !1;
                                switch(table.version){
                                    case 1:
                                        this.applyPositionValue(0, table.value);
                                        break;
                                    case 2:
                                        this.applyPositionValue(0, table.values.get(index));
                                }
                                return !0;
                            }
                        case 2:
                            {
                                let nextGlyph = this.glyphIterator.peek();
                                if (!nextGlyph) return !1;
                                let index1 = this.coverageIndex(table.coverage);
                                if (-1 === index1) return !1;
                                switch(table.version){
                                    case 1:
                                        let set = table.pairSets.get(index1);
                                        for (let pair of set)if (pair.secondGlyph === nextGlyph.id) return this.applyPositionValue(0, pair.value1), this.applyPositionValue(1, pair.value2), !0;
                                        return !1;
                                    case 2:
                                        let class1 = this.getClassID(this.glyphIterator.cur.id, table.classDef1), class2 = this.getClassID(nextGlyph.id, table.classDef2);
                                        if (-1 === class1 || -1 === class2) return !1;
                                        var pair1 = table.classRecords.get(class1).get(class2);
                                        return this.applyPositionValue(0, pair1.value1), this.applyPositionValue(1, pair1.value2), !0;
                                }
                            }
                        case 3:
                            {
                                let d, nextIndex = this.glyphIterator.peekIndex(), nextGlyph1 = this.glyphs[nextIndex];
                                if (!nextGlyph1) return !1;
                                let curRecord = table.entryExitRecords[this.coverageIndex(table.coverage)];
                                if (!curRecord || !curRecord.exitAnchor) return !1;
                                let nextRecord = table.entryExitRecords[this.coverageIndex(table.coverage, nextGlyph1.id)];
                                if (!nextRecord || !nextRecord.entryAnchor) return !1;
                                let entry = this.getAnchor(nextRecord.entryAnchor), exit = this.getAnchor(curRecord.exitAnchor), cur = this.positions[this.glyphIterator.index], next = this.positions[nextIndex];
                                switch(this.direction){
                                    case "ltr":
                                        cur.xAdvance = exit.x + cur.xOffset, d = entry.x + next.xOffset, next.xAdvance -= d, next.xOffset -= d;
                                        break;
                                    case "rtl":
                                        d = exit.x + cur.xOffset, cur.xAdvance -= d, cur.xOffset -= d, next.xAdvance = entry.x + next.xOffset;
                                }
                                return this.glyphIterator.flags.rightToLeft ? (this.glyphIterator.cur.cursiveAttachment = nextIndex, cur.yOffset = entry.y - exit.y) : (nextGlyph1.cursiveAttachment = this.glyphIterator.index, cur.yOffset = exit.y - entry.y), !0;
                            }
                        case 4:
                            {
                                let markIndex = this.coverageIndex(table.markCoverage);
                                if (-1 === markIndex) return !1;
                                let baseGlyphIndex = this.glyphIterator.index;
                                for(; --baseGlyphIndex >= 0 && (this.glyphs[baseGlyphIndex].isMark || this.glyphs[baseGlyphIndex].ligatureComponent > 0););
                                if (baseGlyphIndex < 0) return !1;
                                let baseIndex = this.coverageIndex(table.baseCoverage, this.glyphs[baseGlyphIndex].id);
                                if (-1 === baseIndex) return !1;
                                let markRecord = table.markArray[markIndex], baseAnchor = table.baseArray[baseIndex][markRecord.class];
                                return this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex), !0;
                            }
                        case 5:
                            {
                                let markIndex1 = this.coverageIndex(table.markCoverage);
                                if (-1 === markIndex1) return !1;
                                let baseGlyphIndex1 = this.glyphIterator.index;
                                for(; --baseGlyphIndex1 >= 0 && this.glyphs[baseGlyphIndex1].isMark;);
                                if (baseGlyphIndex1 < 0) return !1;
                                let ligIndex = this.coverageIndex(table.ligatureCoverage, this.glyphs[baseGlyphIndex1].id);
                                if (-1 === ligIndex) return !1;
                                let ligAttach = table.ligatureArray[ligIndex], markGlyph = this.glyphIterator.cur, ligGlyph = this.glyphs[baseGlyphIndex1], compIndex = ligGlyph.ligatureID && ligGlyph.ligatureID === markGlyph.ligatureID && markGlyph.ligatureComponent > 0 ? Math.min(markGlyph.ligatureComponent, ligGlyph.codePoints.length) - 1 : ligGlyph.codePoints.length - 1, markRecord1 = table.markArray[markIndex1], baseAnchor1 = ligAttach[compIndex][markRecord1.class];
                                return this.applyAnchor(markRecord1, baseAnchor1, baseGlyphIndex1), !0;
                            }
                        case 6:
                            {
                                let mark1Index = this.coverageIndex(table.mark1Coverage);
                                if (-1 === mark1Index) return !1;
                                let prevIndex = this.glyphIterator.peekIndex(-1), prev = this.glyphs[prevIndex];
                                if (!prev || !prev.isMark) return !1;
                                let cur1 = this.glyphIterator.cur, good = !1;
                                if (cur1.ligatureID === prev.ligatureID ? cur1.ligatureID ? cur1.ligatureComponent === prev.ligatureComponent && (good = !0) : good = !0 : (cur1.ligatureID && !cur1.ligatureComponent || prev.ligatureID && !prev.ligatureComponent) && (good = !0), !good) return !1;
                                let mark2Index = this.coverageIndex(table.mark2Coverage, prev.id);
                                if (-1 === mark2Index) return !1;
                                let markRecord2 = table.mark1Array[mark1Index], baseAnchor2 = table.mark2Array[mark2Index][markRecord2.class];
                                return this.applyAnchor(markRecord2, baseAnchor2, prevIndex), !0;
                            }
                        case 7:
                            return this.applyContext(table);
                        case 8:
                            return this.applyChainingContext(table);
                        case 9:
                            return this.applyLookup(table.lookupType, table.extension);
                        default:
                            throw Error(`Unsupported GPOS table: ${lookupType}`);
                    }
                }
                applyAnchor(markRecord, baseAnchor, baseGlyphIndex) {
                    let baseCoords = this.getAnchor(baseAnchor), markCoords = this.getAnchor(markRecord.markAnchor);
                    this.positions[baseGlyphIndex];
                    let markPos = this.positions[this.glyphIterator.index];
                    markPos.xOffset = baseCoords.x - markCoords.x, markPos.yOffset = baseCoords.y - markCoords.y, this.glyphIterator.cur.markAttachment = baseGlyphIndex;
                }
                getAnchor(anchor) {
                    let x = anchor.xCoordinate, y = anchor.yCoordinate, variationProcessor = this.font._variationProcessor, variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;
                    return variationProcessor && variationStore && (anchor.xDeviceTable && (x += variationProcessor.getDelta(variationStore, anchor.xDeviceTable.a, anchor.xDeviceTable.b)), anchor.yDeviceTable && (y += variationProcessor.getDelta(variationStore, anchor.yDeviceTable.a, anchor.yDeviceTable.b))), {
                        x: x,
                        y: y
                    };
                }
                applyFeatures(userFeatures, glyphs, advances) {
                    super.applyFeatures(userFeatures, glyphs, advances);
                    for(var i = 0; i < this.glyphs.length; i++)this.fixCursiveAttachment(i);
                    this.fixMarkAttachment();
                }
                fixCursiveAttachment(i) {
                    let glyph = this.glyphs[i];
                    if (null != glyph.cursiveAttachment) {
                        let j = glyph.cursiveAttachment;
                        glyph.cursiveAttachment = null, this.fixCursiveAttachment(j), this.positions[i].yOffset += this.positions[j].yOffset;
                    }
                }
                fixMarkAttachment() {
                    for(let i = 0; i < this.glyphs.length; i++){
                        let glyph = this.glyphs[i];
                        if (null != glyph.markAttachment) {
                            let j = glyph.markAttachment;
                            if (this.positions[i].xOffset += this.positions[j].xOffset, this.positions[i].yOffset += this.positions[j].yOffset, "ltr" === this.direction) for(let k = j; k < i; k++)this.positions[i].xOffset -= this.positions[k].xAdvance, this.positions[i].yOffset -= this.positions[k].yAdvance;
                            else for(let k1 = j + 1; k1 < i + 1; k1++)this.positions[i].xOffset += this.positions[k1].xAdvance, this.positions[i].yOffset += this.positions[k1].yAdvance;
                        }
                    }
                }
            }
            class $a62492810de27e3d$export$2e2bcd8739ae039 {
                setup(glyphRun) {
                    this.glyphInfos = glyphRun.glyphs.map((glyph)=>new $10e7b257e1a9a756$export$2e2bcd8739ae039(this.font, glyph.id, [
                            ...glyph.codePoints
                        ]));
                    let script = null;
                    for(let key in this.GPOSProcessor && (script = this.GPOSProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction)), this.GSUBProcessor && (script = this.GSUBProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction)), this.shaper = $102b6fe50f1d50b4$export$7877a478dd30fd3d(script), this.plan = new $94d7a73bd2edfc9a$export$2e2bcd8739ae039(this.font, script, glyphRun.direction), this.shaper.plan(this.plan, this.glyphInfos, glyphRun.features), this.plan.allFeatures)glyphRun.features[key] = !0;
                }
                substitute(glyphRun) {
                    this.GSUBProcessor && (this.plan.process(this.GSUBProcessor, this.glyphInfos), glyphRun.glyphs = this.glyphInfos.map((glyphInfo)=>this.font.getGlyph(glyphInfo.id, glyphInfo.codePoints)));
                }
                position(glyphRun) {
                    return "BEFORE_GPOS" === this.shaper.zeroMarkWidths && this.zeroMarkAdvances(glyphRun.positions), this.GPOSProcessor && this.plan.process(this.GPOSProcessor, this.glyphInfos, glyphRun.positions), "AFTER_GPOS" === this.shaper.zeroMarkWidths && this.zeroMarkAdvances(glyphRun.positions), "rtl" === glyphRun.direction && (glyphRun.glyphs.reverse(), glyphRun.positions.reverse()), this.GPOSProcessor && this.GPOSProcessor.features;
                }
                zeroMarkAdvances(positions) {
                    for(let i = 0; i < this.glyphInfos.length; i++)this.glyphInfos[i].isMark && (positions[i].xAdvance = 0, positions[i].yAdvance = 0);
                }
                cleanup() {
                    this.glyphInfos = null, this.plan = null, this.shaper = null;
                }
                getAvailableFeatures(script, language) {
                    let features = [];
                    return this.GSUBProcessor && (this.GSUBProcessor.selectScript(script, language), features.push(...Object.keys(this.GSUBProcessor.features))), this.GPOSProcessor && (this.GPOSProcessor.selectScript(script, language), features.push(...Object.keys(this.GPOSProcessor.features))), features;
                }
                constructor(font){
                    this.font = font, this.glyphInfos = null, this.plan = null, this.GSUBProcessor = null, this.GPOSProcessor = null, this.fallbackPosition = !0, font.GSUB && (this.GSUBProcessor = new $0a876c45f1f7c41c$export$2e2bcd8739ae039(font, font.GSUB)), font.GPOS && (this.GPOSProcessor = new $c96c93587d49c14d$export$2e2bcd8739ae039(font, font.GPOS));
                }
            }
            class $4c0a7fa5df7a9ab1$export$2e2bcd8739ae039 {
                layout(string, features, script, language, direction) {
                    if ("string" == typeof features && (direction = language, language = script, script = features, features = []), "string" == typeof string) {
                        null == script && (script = $130d1a642ebcd2b7$export$e5cb25e204fb8450(string));
                        var glyphs = this.font.glyphsForString(string);
                    } else {
                        if (null == script) {
                            let codePoints = [];
                            for (let glyph of string)codePoints.push(...glyph.codePoints);
                            script = $130d1a642ebcd2b7$export$16fab0757cfc223d(codePoints);
                        }
                        var glyphs = string;
                    }
                    let glyphRun = new $be07b3e97a42687a$export$2e2bcd8739ae039(glyphs, features, script, language, direction);
                    return 0 === glyphs.length ? (glyphRun.positions = [], glyphRun) : (this.engine && this.engine.setup && this.engine.setup(glyphRun), this.substitute(glyphRun), this.position(glyphRun), this.hideDefaultIgnorables(glyphRun.glyphs, glyphRun.positions), this.engine && this.engine.cleanup && this.engine.cleanup(), glyphRun);
                }
                substitute(glyphRun) {
                    this.engine && this.engine.substitute && this.engine.substitute(glyphRun);
                }
                position(glyphRun) {
                    glyphRun.positions = glyphRun.glyphs.map((glyph)=>new $1ac75d9a55b67f01$export$2e2bcd8739ae039(glyph.advanceWidth));
                    let positioned = null;
                    this.engine && this.engine.position && (positioned = this.engine.position(glyphRun)), positioned || this.engine && !this.engine.fallbackPosition || (this.unicodeLayoutEngine || (this.unicodeLayoutEngine = new $0a4bdfeb6dfd6f5e$export$2e2bcd8739ae039(this.font)), this.unicodeLayoutEngine.positionGlyphs(glyphRun.glyphs, glyphRun.positions)), positioned && positioned.kern || !1 === glyphRun.features.kern || !this.font.kern || (this.kernProcessor || (this.kernProcessor = new $0bba3a9db57637f3$export$2e2bcd8739ae039(this.font)), this.kernProcessor.process(glyphRun.glyphs, glyphRun.positions), glyphRun.features.kern = !0);
                }
                hideDefaultIgnorables(glyphs, positions) {
                    let space = this.font.glyphForCodePoint(0x20);
                    for(let i = 0; i < glyphs.length; i++)this.isDefaultIgnorable(glyphs[i].codePoints[0]) && (glyphs[i] = space, positions[i].xAdvance = 0, positions[i].yAdvance = 0);
                }
                isDefaultIgnorable(ch) {
                    let plane = ch >> 16;
                    if (0 === plane) switch(ch >> 8){
                        case 0x00:
                            return 0x00AD === ch;
                        case 0x03:
                            return 0x034F === ch;
                        case 0x06:
                            return 0x061C === ch;
                        case 0x17:
                            return 0x17B4 <= ch && ch <= 0x17B5;
                        case 0x18:
                            return 0x180B <= ch && ch <= 0x180E;
                        case 0x20:
                            return 0x200B <= ch && ch <= 0x200F || 0x202A <= ch && ch <= 0x202E || 0x2060 <= ch && ch <= 0x206F;
                        case 0xFE:
                            return 0xFE00 <= ch && ch <= 0xFE0F || 0xFEFF === ch;
                        case 0xFF:
                            return 0xFFF0 <= ch && ch <= 0xFFF8;
                        default:
                            return !1;
                    }
                    else switch(plane){
                        case 0x01:
                            return 0x1BCA0 <= ch && ch <= 0x1BCA3 || 0x1D173 <= ch && ch <= 0x1D17A;
                        case 0x0E:
                            return 0xE0000 <= ch && ch <= 0xE0FFF;
                        default:
                            return !1;
                    }
                }
                getAvailableFeatures(script, language) {
                    let features = [];
                    return this.engine && features.push(...this.engine.getAvailableFeatures(script, language)), this.font.kern && -1 === features.indexOf("kern") && features.push("kern"), features;
                }
                stringsForGlyph(gid) {
                    let result = new Set, codePoints = this.font._cmapProcessor.codePointsForGlyph(gid);
                    for (let codePoint of codePoints)result.add(String.fromCodePoint(codePoint));
                    if (this.engine && this.engine.stringsForGlyph) for (let string of this.engine.stringsForGlyph(gid))result.add(string);
                    return Array.from(result);
                }
                constructor(font){
                    this.font = font, this.unicodeLayoutEngine = null, this.kernProcessor = null, this.font.morx ? this.engine = new $ba6dd74203be8728$export$2e2bcd8739ae039(this.font) : (this.font.GSUB || this.font.GPOS) && (this.engine = new $a62492810de27e3d$export$2e2bcd8739ae039(this.font));
                }
            }
            const $f43aec954cdfdf21$var$SVG_COMMANDS = {
                moveTo: "M",
                lineTo: "L",
                quadraticCurveTo: "Q",
                bezierCurveTo: "C",
                closePath: "Z"
            };
            class $f43aec954cdfdf21$export$2e2bcd8739ae039 {
                toFunction() {
                    return (ctx)=>{
                        this.commands.forEach((c)=>ctx[c.command].apply(ctx, c.args));
                    };
                }
                toSVG() {
                    return this.commands.map((c)=>`${$f43aec954cdfdf21$var$SVG_COMMANDS[c.command]}${c.args.map((arg)=>Math.round(100 * arg) / 100).join(" ")}`).join("");
                }
                get cbox() {
                    if (!this._cbox) {
                        let cbox = new $f34600ab9d7f70d8$export$2e2bcd8739ae039;
                        for (let command1 of this.commands)for(let i = 0; i < command1.args.length; i += 2)cbox.addPoint(command1.args[i], command1.args[i + 1]);
                        this._cbox = Object.freeze(cbox);
                    }
                    return this._cbox;
                }
                get bbox() {
                    if (this._bbox) return this._bbox;
                    let bbox = new $f34600ab9d7f70d8$export$2e2bcd8739ae039, cx = 0, cy = 0, f = (t)=>Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i];
                    for (let c of this.commands)switch(c.command){
                        case "moveTo":
                        case "lineTo":
                            let [x, y] = c.args;
                            bbox.addPoint(x, y), cx = x, cy = y;
                            break;
                        case "quadraticCurveTo":
                        case "bezierCurveTo":
                            if ("quadraticCurveTo" === c.command) var [qp1x, qp1y, p3x, p3y] = c.args, cp1x = cx + 2 / 3 * (qp1x - cx), cp1y = cy + 2 / 3 * (qp1y - cy), cp2x = p3x + 2 / 3 * (qp1x - p3x), cp2y = p3y + 2 / 3 * (qp1y - p3y);
                            else var [cp1x, cp1y, cp2x, cp2y, p3x, p3y] = c.args;
                            bbox.addPoint(p3x, p3y);
                            for(var p0 = [
                                cx,
                                cy
                            ], p1 = [
                                cp1x,
                                cp1y
                            ], p2 = [
                                cp2x,
                                cp2y
                            ], p3 = [
                                p3x,
                                p3y
                            ], i = 0; i <= 1; i++){
                                let b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i], a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
                                if (c = 3 * p1[i] - 3 * p0[i], 0 === a) {
                                    if (0 === b) continue;
                                    let t = -c / b;
                                    0 < t && t < 1 && (0 === i ? bbox.addPoint(f(t), bbox.maxY) : 1 === i && bbox.addPoint(bbox.maxX, f(t)));
                                    continue;
                                }
                                let b2ac = Math.pow(b, 2) - 4 * c * a;
                                if (b2ac < 0) continue;
                                let t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
                                0 < t1 && t1 < 1 && (0 === i ? bbox.addPoint(f(t1), bbox.maxY) : 1 === i && bbox.addPoint(bbox.maxX, f(t1)));
                                let t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
                                0 < t2 && t2 < 1 && (0 === i ? bbox.addPoint(f(t2), bbox.maxY) : 1 === i && bbox.addPoint(bbox.maxX, f(t2)));
                            }
                            cx = p3x, cy = p3y;
                    }
                    return this._bbox = Object.freeze(bbox);
                }
                mapPoints(fn) {
                    let path = new $f43aec954cdfdf21$export$2e2bcd8739ae039;
                    for (let c of this.commands){
                        let args = [];
                        for(let i = 0; i < c.args.length; i += 2){
                            let [x, y] = fn(c.args[i], c.args[i + 1]);
                            args.push(x, y);
                        }
                        path[c.command](...args);
                    }
                    return path;
                }
                transform(m0, m1, m2, m3, m4, m5) {
                    return this.mapPoints((x, y)=>[
                            m0 * x + m2 * y + m4,
                            m1 * x + m3 * y + m5
                        ]);
                }
                translate(x, y) {
                    return this.transform(1, 0, 0, 1, x, y);
                }
                rotate(angle) {
                    let cos = Math.cos(angle), sin = Math.sin(angle);
                    return this.transform(cos, sin, -sin, cos, 0, 0);
                }
                scale(scaleX, scaleY = scaleX) {
                    return this.transform(scaleX, 0, 0, scaleY, 0, 0);
                }
                constructor(){
                    this.commands = [], this._bbox = null, this._cbox = null;
                }
            }
            for (let command of [
                "moveTo",
                "lineTo",
                "quadraticCurveTo",
                "bezierCurveTo",
                "closePath"
            ])$f43aec954cdfdf21$export$2e2bcd8739ae039.prototype[command] = function(...args) {
                return this._bbox = this._cbox = null, this.commands.push({
                    command: command,
                    args: args
                }), this;
            };
            var $7713b9b7b438dff8$export$2e2bcd8739ae039 = [
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
            class $f92906be28e61769$export$2e2bcd8739ae039 {
                _getPath() {
                    return new $f43aec954cdfdf21$export$2e2bcd8739ae039();
                }
                _getCBox() {
                    return this.path.cbox;
                }
                _getBBox() {
                    return this.path.bbox;
                }
                _getTableMetrics(table) {
                    if (this.id < table.metrics.length) return table.metrics.get(this.id);
                    let metric = table.metrics.get(table.metrics.length - 1);
                    return {
                        advance: metric ? metric.advance : 0,
                        bearing: table.bearings.get(this.id - table.metrics.length) || 0
                    };
                }
                _getMetrics(cbox) {
                    if (this._metrics) return this._metrics;
                    let { advance: advanceWidth , bearing: leftBearing  } = this._getTableMetrics(this._font.hmtx);
                    if (this._font.vmtx) var { advance: advanceHeight , bearing: topBearing  } = this._getTableMetrics(this._font.vmtx);
                    else {
                        let os2;
                        if (null == cbox && ({ cbox: cbox  } = this), (os2 = this._font["OS/2"]) && os2.version > 0) var advanceHeight = Math.abs(os2.typoAscender - os2.typoDescender), topBearing = os2.typoAscender - cbox.maxY;
                        else {
                            let { hhea: hhea  } = this._font;
                            var advanceHeight = Math.abs(hhea.ascent - hhea.descent), topBearing = hhea.ascent - cbox.maxY;
                        }
                    }
                    return this._font._variationProcessor && this._font.HVAR && (advanceWidth += this._font._variationProcessor.getAdvanceAdjustment(this.id, this._font.HVAR)), this._metrics = {
                        advanceWidth: advanceWidth,
                        advanceHeight: advanceHeight,
                        leftBearing: leftBearing,
                        topBearing: topBearing
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
                getScaledPath(size) {
                    let scale = 1 / this._font.unitsPerEm * size;
                    return this.path.scale(scale);
                }
                get advanceWidth() {
                    return this._getMetrics().advanceWidth;
                }
                get advanceHeight() {
                    return this._getMetrics().advanceHeight;
                }
                get ligatureCaretPositions() {}
                _getName() {
                    let { post: post  } = this._font;
                    if (!post) return null;
                    switch(post.version){
                        case 1:
                            return $7713b9b7b438dff8$export$2e2bcd8739ae039[this.id];
                        case 2:
                            let id = post.glyphNameIndex[this.id];
                            if (id < $7713b9b7b438dff8$export$2e2bcd8739ae039.length) return $7713b9b7b438dff8$export$2e2bcd8739ae039[id];
                            return post.names[id - $7713b9b7b438dff8$export$2e2bcd8739ae039.length];
                        case 2.5:
                            return $7713b9b7b438dff8$export$2e2bcd8739ae039[this.id + post.offsets[this.id]];
                        case 4:
                            return String.fromCharCode(post.map[this.id]);
                    }
                }
                get name() {
                    return this._getName();
                }
                render(ctx, size) {
                    ctx.save();
                    let scale = 1 / this._font.head.unitsPerEm * size;
                    ctx.scale(scale, scale), this.path.toFunction()(ctx), ctx.fill(), ctx.restore();
                }
                constructor(id, codePoints, font){
                    this.id = id, this.codePoints = codePoints, this._font = font, this.isMark = this.codePoints.length > 0 && this.codePoints.every(unicode_properties__WEBPACK_IMPORTED_MODULE_2__.YB), this.isLigature = this.codePoints.length > 1;
                }
            }
            (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "cbox", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "bbox", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "path", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "advanceWidth", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "advanceHeight", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $f92906be28e61769$export$2e2bcd8739ae039.prototype, "name", null);
            let $69aac16029968692$var$GlyfHeader = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                numberOfContours: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af
            });
            const $69aac16029968692$var$MORE_COMPONENTS = 32;
            class $69aac16029968692$export$baf26146a414f24a {
                copy() {
                    return new $69aac16029968692$export$baf26146a414f24a(this.onCurve, this.endContour, this.x, this.y);
                }
                constructor(onCurve, endContour, x = 0, y = 0){
                    this.onCurve = onCurve, this.endContour = endContour, this.x = x, this.y = y;
                }
            }
            class $69aac16029968692$var$Component {
                constructor(glyphID, dx, dy){
                    this.glyphID = glyphID, this.dx = dx, this.dy = dy, this.pos = 0, this.scaleX = this.scaleY = 1, this.scale01 = this.scale10 = 0;
                }
            }
            class $69aac16029968692$export$2e2bcd8739ae039 extends $f92906be28e61769$export$2e2bcd8739ae039 {
                _getCBox(internal) {
                    if (this._font._variationProcessor && !internal) return this.path.cbox;
                    let stream = this._font._getTableStream("glyf");
                    stream.pos += this._font.loca.offsets[this.id];
                    let glyph = $69aac16029968692$var$GlyfHeader.decode(stream);
                    return Object.freeze(new $f34600ab9d7f70d8$export$2e2bcd8739ae039(glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax));
                }
                _parseGlyphCoord(stream, prev, short, same) {
                    if (short) {
                        var val = stream.readUInt8();
                        same || (val = -val), val += prev;
                    } else if (same) var val = prev;
                    else var val = prev + stream.readInt16BE();
                    return val;
                }
                _decode() {
                    let glyfPos = this._font.loca.offsets[this.id];
                    if (glyfPos === this._font.loca.offsets[this.id + 1]) return null;
                    let stream = this._font._getTableStream("glyf");
                    stream.pos += glyfPos;
                    let startPos = stream.pos, glyph = $69aac16029968692$var$GlyfHeader.decode(stream);
                    return glyph.numberOfContours > 0 ? this._decodeSimple(glyph, stream) : glyph.numberOfContours < 0 && this._decodeComposite(glyph, stream, startPos), glyph;
                }
                _decodeSimple(glyph, stream) {
                    glyph.points = [];
                    let endPtsOfContours = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, glyph.numberOfContours).decode(stream);
                    glyph.instructions = new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, restructure__WEBPACK_IMPORTED_MODULE_0__.mL).decode(stream);
                    let flags = [], numCoords = endPtsOfContours[endPtsOfContours.length - 1] + 1;
                    for(; flags.length < numCoords;){
                        var flag = stream.readUInt8();
                        if (flags.push(flag), 8 & flag) {
                            let count = stream.readUInt8();
                            for(let j = 0; j < count; j++)flags.push(flag);
                        }
                    }
                    for(var i = 0; i < flags.length; i++){
                        var flag = flags[i];
                        let point = new $69aac16029968692$export$baf26146a414f24a(!!(1 & flag), endPtsOfContours.indexOf(i) >= 0, 0, 0);
                        glyph.points.push(point);
                    }
                    let px = 0;
                    for(var i = 0; i < flags.length; i++){
                        var flag = flags[i];
                        glyph.points[i].x = px = this._parseGlyphCoord(stream, px, 2 & flag, 16 & flag);
                    }
                    let py = 0;
                    for(var i = 0; i < flags.length; i++){
                        var flag = flags[i];
                        glyph.points[i].y = py = this._parseGlyphCoord(stream, py, 4 & flag, 32 & flag);
                    }
                    if (this._font._variationProcessor) {
                        let points = glyph.points.slice();
                        points.push(...this._getPhantomPoints(glyph)), this._font._variationProcessor.transformPoints(this.id, points), glyph.phantomPoints = points.slice(-4);
                    }
                }
                _decodeComposite(glyph, stream, offset = 0) {
                    glyph.components = [];
                    let haveInstructions = !1, flags = $69aac16029968692$var$MORE_COMPONENTS;
                    for(; flags & $69aac16029968692$var$MORE_COMPONENTS;){
                        flags = stream.readUInt16BE();
                        let gPos = stream.pos - offset, glyphID = stream.readUInt16BE();
                        if (haveInstructions || (haveInstructions = (256 & flags) != 0), 1 & flags) var dx = stream.readInt16BE(), dy = stream.readInt16BE();
                        else var dx = stream.readInt8(), dy = stream.readInt8();
                        var component = new $69aac16029968692$var$Component(glyphID, dx, dy);
                        component.pos = gPos, 8 & flags ? component.scaleX = component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824 : 64 & flags ? (component.scaleX = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824, component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824) : 128 & flags && (component.scaleX = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824, component.scale01 = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824, component.scale10 = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824, component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824), glyph.components.push(component);
                    }
                    if (this._font._variationProcessor) {
                        let points = [];
                        for(let j = 0; j < glyph.components.length; j++){
                            var component = glyph.components[j];
                            points.push(new $69aac16029968692$export$baf26146a414f24a(!0, !0, component.dx, component.dy));
                        }
                        points.push(...this._getPhantomPoints(glyph)), this._font._variationProcessor.transformPoints(this.id, points), glyph.phantomPoints = points.splice(-4, 4);
                        for(let i = 0; i < points.length; i++){
                            let point = points[i];
                            glyph.components[i].dx = point.x, glyph.components[i].dy = point.y;
                        }
                    }
                    return haveInstructions;
                }
                _getPhantomPoints(glyph) {
                    let cbox = this._getCBox(!0);
                    null == this._metrics && (this._metrics = $f92906be28e61769$export$2e2bcd8739ae039.prototype._getMetrics.call(this, cbox));
                    let { advanceWidth: advanceWidth , advanceHeight: advanceHeight , leftBearing: leftBearing , topBearing: topBearing  } = this._metrics;
                    return [
                        new $69aac16029968692$export$baf26146a414f24a(!1, !0, glyph.xMin - leftBearing, 0),
                        new $69aac16029968692$export$baf26146a414f24a(!1, !0, glyph.xMin - leftBearing + advanceWidth, 0),
                        new $69aac16029968692$export$baf26146a414f24a(!1, !0, 0, glyph.yMax + topBearing),
                        new $69aac16029968692$export$baf26146a414f24a(!1, !0, 0, glyph.yMax + topBearing + advanceHeight)
                    ];
                }
                _getContours() {
                    let glyph = this._decode();
                    if (!glyph) return [];
                    let points = [];
                    if (glyph.numberOfContours < 0) for (let component of glyph.components){
                        let contours = this._font.getGlyph(component.glyphID)._getContours();
                        for(let i = 0; i < contours.length; i++){
                            let contour = contours[i];
                            for(let j = 0; j < contour.length; j++){
                                let point = contour[j], x = point.x * component.scaleX + point.y * component.scale01 + component.dx, y = point.y * component.scaleY + point.x * component.scale10 + component.dy;
                                points.push(new $69aac16029968692$export$baf26146a414f24a(point.onCurve, point.endContour, x, y));
                            }
                        }
                    }
                    else points = glyph.points || [];
                    glyph.phantomPoints && !this._font.directory.tables.HVAR && (this._metrics.advanceWidth = glyph.phantomPoints[1].x - glyph.phantomPoints[0].x, this._metrics.advanceHeight = glyph.phantomPoints[3].y - glyph.phantomPoints[2].y, this._metrics.leftBearing = glyph.xMin - glyph.phantomPoints[0].x, this._metrics.topBearing = glyph.phantomPoints[2].y - glyph.yMax);
                    let contours1 = [], cur = [];
                    for(let k = 0; k < points.length; k++){
                        var point1 = points[k];
                        cur.push(point1), point1.endContour && (contours1.push(cur), cur = []);
                    }
                    return contours1;
                }
                _getMetrics() {
                    if (this._metrics) return this._metrics;
                    let cbox = this._getCBox(!0);
                    return super._getMetrics(cbox), this._font._variationProcessor && !this._font.HVAR && this.path, this._metrics;
                }
                _getPath() {
                    let contours = this._getContours(), path = new $f43aec954cdfdf21$export$2e2bcd8739ae039;
                    for(let i = 0; i < contours.length; i++){
                        let contour = contours[i], firstPt = contour[0], lastPt = contour[contour.length - 1], start = 0;
                        if (firstPt.onCurve) {
                            var curvePt = null;
                            start = 1;
                        } else var curvePt = firstPt = lastPt.onCurve ? lastPt : new $69aac16029968692$export$baf26146a414f24a(!1, !1, (firstPt.x + lastPt.x) / 2, (firstPt.y + lastPt.y) / 2);
                        path.moveTo(firstPt.x, firstPt.y);
                        for(let j = start; j < contour.length; j++){
                            let pt = contour[j], prevPt = 0 === j ? firstPt : contour[j - 1];
                            if (prevPt.onCurve && pt.onCurve) path.lineTo(pt.x, pt.y);
                            else if (prevPt.onCurve && !pt.onCurve) var curvePt = pt;
                            else if (prevPt.onCurve || pt.onCurve) {
                                if (!prevPt.onCurve && pt.onCurve) {
                                    path.quadraticCurveTo(curvePt.x, curvePt.y, pt.x, pt.y);
                                    var curvePt = null;
                                } else throw Error("Unknown TTF path state");
                            } else {
                                let midX = (prevPt.x + pt.x) / 2, midY = (prevPt.y + pt.y) / 2;
                                path.quadraticCurveTo(prevPt.x, prevPt.y, midX, midY);
                                var curvePt = pt;
                            }
                        }
                        curvePt && path.quadraticCurveTo(curvePt.x, curvePt.y, firstPt.x, firstPt.y), path.closePath();
                    }
                    return path;
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "TTF");
                }
            }
            class $62cc5109c6101893$export$2e2bcd8739ae039 extends $f92906be28e61769$export$2e2bcd8739ae039 {
                _getName() {
                    return this._font.CFF2 ? super._getName() : this._font["CFF "].getGlyphName(this.id);
                }
                bias(s) {
                    return s.length < 1240 ? 107 : s.length < 33900 ? 1131 : 32768;
                }
                _getPath() {
                    let usedGsubrs, usedSubrs, cff = this._font.CFF2 || this._font["CFF "], { stream: stream  } = cff, str = cff.topDict.CharStrings[this.id], end = str.offset + str.length;
                    stream.pos = str.offset;
                    let path = new $f43aec954cdfdf21$export$2e2bcd8739ae039, stack = [], trans = [], width = null, nStems = 0, x1 = 0, y1 = 0, open = !1;
                    this._usedGsubrs = usedGsubrs = {}, this._usedSubrs = usedSubrs = {};
                    let gsubrs = cff.globalSubrIndex || [], gsubrsBias = this.bias(gsubrs), privateDict = cff.privateDictForGlyph(this.id) || {}, subrs = privateDict.Subrs || [], subrsBias = this.bias(subrs), vstore = cff.topDict.vstore && cff.topDict.vstore.itemVariationStore, vsindex = privateDict.vsindex, variationProcessor = this._font._variationProcessor;
                    function checkWidth() {
                        null == width && (width = stack.shift() + privateDict.nominalWidthX);
                    }
                    function parseStems() {
                        return stack.length % 2 != 0 && checkWidth(), nStems += stack.length >> 1, stack.length = 0;
                    }
                    function moveTo(x, y) {
                        open && path.closePath(), path.moveTo(x, y), open = !0;
                    }
                    let parse = function() {
                        for(; stream.pos < end;){
                            let op = stream.readUInt8();
                            if (op < 32) {
                                let index, subr, phase;
                                switch(op){
                                    case 1:
                                    case 3:
                                    case 18:
                                    case 23:
                                        parseStems();
                                        break;
                                    case 4:
                                        stack.length > 1 && checkWidth(), moveTo(x1, y1 += stack.shift());
                                        break;
                                    case 5:
                                        for(; stack.length >= 2;)x1 += stack.shift(), y1 += stack.shift(), path.lineTo(x1, y1);
                                        break;
                                    case 6:
                                    case 7:
                                        for(phase = 6 === op; stack.length >= 1;)phase ? x1 += stack.shift() : y1 += stack.shift(), path.lineTo(x1, y1), phase = !phase;
                                        break;
                                    case 8:
                                        for(; stack.length > 0;){
                                            var c1x = x1 + stack.shift(), c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift();
                                            x1 = c2x + stack.shift(), y1 = c2y + stack.shift(), path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1);
                                        }
                                        break;
                                    case 10:
                                        if (subr = subrs[index = stack.pop() + subrsBias]) {
                                            usedSubrs[index] = !0;
                                            var p = stream.pos, e = end;
                                            stream.pos = subr.offset, end = subr.offset + subr.length, parse(), stream.pos = p, end = e;
                                        }
                                        break;
                                    case 11:
                                        if (cff.version >= 2) break;
                                        return;
                                    case 14:
                                        if (cff.version >= 2) break;
                                        stack.length > 0 && checkWidth(), open && (path.closePath(), open = !1);
                                        break;
                                    case 15:
                                        if (cff.version < 2) throw Error("vsindex operator not supported in CFF v1");
                                        vsindex = stack.pop();
                                        break;
                                    case 16:
                                        {
                                            if (cff.version < 2) throw Error("blend operator not supported in CFF v1");
                                            if (!variationProcessor) throw Error("blend operator in non-variation font");
                                            let blendVector = variationProcessor.getBlendVector(vstore, vsindex), numBlends = stack.pop(), numOperands = numBlends * blendVector.length, delta = stack.length - numOperands, base = delta - numBlends;
                                            for(let i = 0; i < numBlends; i++){
                                                let sum = stack[base + i];
                                                for(let j = 0; j < blendVector.length; j++)sum += blendVector[j] * stack[delta++];
                                                stack[base + i] = sum;
                                            }
                                            for(; numOperands--;)stack.pop();
                                            break;
                                        }
                                    case 19:
                                    case 20:
                                        parseStems(), stream.pos += nStems + 7 >> 3;
                                        break;
                                    case 21:
                                        stack.length > 2 && checkWidth(), moveTo(x1 += stack.shift(), y1 += stack.shift());
                                        break;
                                    case 22:
                                        stack.length > 1 && checkWidth(), moveTo(x1 += stack.shift(), y1);
                                        break;
                                    case 24:
                                        for(; stack.length >= 8;){
                                            var c1x = x1 + stack.shift(), c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift();
                                            x1 = c2x + stack.shift(), y1 = c2y + stack.shift(), path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1);
                                        }
                                        x1 += stack.shift(), y1 += stack.shift(), path.lineTo(x1, y1);
                                        break;
                                    case 25:
                                        for(; stack.length >= 8;)x1 += stack.shift(), y1 += stack.shift(), path.lineTo(x1, y1);
                                        var c1x = x1 + stack.shift(), c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift();
                                        x1 = c2x + stack.shift(), y1 = c2y + stack.shift(), path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1);
                                        break;
                                    case 26:
                                        for(stack.length % 2 && (x1 += stack.shift()); stack.length >= 4;)c1x = x1, c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x1 = c2x, y1 = c2y + stack.shift(), path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1);
                                        break;
                                    case 27:
                                        for(stack.length % 2 && (y1 += stack.shift()); stack.length >= 4;)c1x = x1 + stack.shift(), c1y = y1, c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x1 = c2x + stack.shift(), y1 = c2y, path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1);
                                        break;
                                    case 28:
                                        stack.push(stream.readInt16BE());
                                        break;
                                    case 29:
                                        if (subr = gsubrs[index = stack.pop() + gsubrsBias]) {
                                            usedGsubrs[index] = !0;
                                            var p = stream.pos, e = end;
                                            stream.pos = subr.offset, end = subr.offset + subr.length, parse(), stream.pos = p, end = e;
                                        }
                                        break;
                                    case 30:
                                    case 31:
                                        for(phase = 31 === op; stack.length >= 4;)phase ? (c1x = x1 + stack.shift(), c1y = y1, c2x = c1x + stack.shift(), y1 = (c2y = c1y + stack.shift()) + stack.shift(), x1 = c2x + (1 === stack.length ? stack.shift() : 0)) : (c1x = x1, c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x1 = c2x + stack.shift(), y1 = c2y + (1 === stack.length ? stack.shift() : 0)), path.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1), phase = !phase;
                                        break;
                                    case 12:
                                        switch(op = stream.readUInt8()){
                                            case 3:
                                                let a = stack.pop(), b = stack.pop();
                                                stack.push(a && b ? 1 : 0);
                                                break;
                                            case 4:
                                                a = stack.pop(), b = stack.pop(), stack.push(a || b ? 1 : 0);
                                                break;
                                            case 5:
                                                a = stack.pop(), stack.push(a ? 0 : 1);
                                                break;
                                            case 9:
                                                a = stack.pop(), stack.push(Math.abs(a));
                                                break;
                                            case 10:
                                                a = stack.pop(), b = stack.pop(), stack.push(a + b);
                                                break;
                                            case 11:
                                                a = stack.pop(), b = stack.pop(), stack.push(a - b);
                                                break;
                                            case 12:
                                                a = stack.pop(), b = stack.pop(), stack.push(a / b);
                                                break;
                                            case 14:
                                                a = stack.pop(), stack.push(-a);
                                                break;
                                            case 15:
                                                a = stack.pop(), b = stack.pop(), stack.push(a === b ? 1 : 0);
                                                break;
                                            case 18:
                                                stack.pop();
                                                break;
                                            case 20:
                                                let val = stack.pop(), idx = stack.pop();
                                                trans[idx] = val;
                                                break;
                                            case 21:
                                                idx = stack.pop(), stack.push(trans[idx] || 0);
                                                break;
                                            case 22:
                                                let s1 = stack.pop(), s2 = stack.pop(), v1 = stack.pop(), v2 = stack.pop();
                                                stack.push(v1 <= v2 ? s1 : s2);
                                                break;
                                            case 23:
                                                stack.push(Math.random());
                                                break;
                                            case 24:
                                                a = stack.pop(), b = stack.pop(), stack.push(a * b);
                                                break;
                                            case 26:
                                                a = stack.pop(), stack.push(Math.sqrt(a));
                                                break;
                                            case 27:
                                                a = stack.pop(), stack.push(a, a);
                                                break;
                                            case 28:
                                                a = stack.pop(), b = stack.pop(), stack.push(b, a);
                                                break;
                                            case 29:
                                                (idx = stack.pop()) < 0 ? idx = 0 : idx > stack.length - 1 && (idx = stack.length - 1), stack.push(stack[idx]);
                                                break;
                                            case 30:
                                                let n = stack.pop(), j1 = stack.pop();
                                                if (j1 >= 0) for(; j1 > 0;){
                                                    var t = stack[n - 1];
                                                    for(let i1 = n - 2; i1 >= 0; i1--)stack[i1 + 1] = stack[i1];
                                                    stack[0] = t, j1--;
                                                }
                                                else for(; j1 < 0;){
                                                    var t = stack[0];
                                                    for(let i2 = 0; i2 <= n; i2++)stack[i2] = stack[i2 + 1];
                                                    stack[n - 1] = t, j1++;
                                                }
                                                break;
                                            case 34:
                                                c1x = x1 + stack.shift(), c1y = y1, c2x = c1x + stack.shift(), c2y = c1y + stack.shift();
                                                let c3x = c2x + stack.shift(), c3y = c2y, c4x = c3x + stack.shift(), c4y = c3y, c5x = c4x + stack.shift(), c5y = c4y, c6x = c5x + stack.shift(), c6y = c5y;
                                                x1 = c6x, y1 = c6y, path.bezierCurveTo(c1x, c1y, c2x, c2y, c3x, c3y), path.bezierCurveTo(c4x, c4y, c5x, c5y, c6x, c6y);
                                                break;
                                            case 35:
                                                let pts = [];
                                                for(let i3 = 0; i3 <= 5; i3++)x1 += stack.shift(), y1 += stack.shift(), pts.push(x1, y1);
                                                path.bezierCurveTo(...pts.slice(0, 6)), path.bezierCurveTo(...pts.slice(6)), stack.shift();
                                                break;
                                            case 36:
                                                c1x = x1 + stack.shift(), c1y = y1 + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), c3x = c2x + stack.shift(), c3y = c2y, c4x = c3x + stack.shift(), c4y = c3y, c5x = c4x + stack.shift(), c5y = c4y + stack.shift(), c6x = c5x + stack.shift(), c6y = c5y, x1 = c6x, y1 = c6y, path.bezierCurveTo(c1x, c1y, c2x, c2y, c3x, c3y), path.bezierCurveTo(c4x, c4y, c5x, c5y, c6x, c6y);
                                                break;
                                            case 37:
                                                let startx = x1, starty = y1;
                                                pts = [];
                                                for(let i11 = 0; i11 <= 4; i11++)x1 += stack.shift(), y1 += stack.shift(), pts.push(x1, y1);
                                                Math.abs(x1 - startx) > Math.abs(y1 - starty) ? (x1 += stack.shift(), y1 = starty) : (x1 = startx, y1 += stack.shift()), pts.push(x1, y1), path.bezierCurveTo(...pts.slice(0, 6)), path.bezierCurveTo(...pts.slice(6));
                                                break;
                                            default:
                                                throw Error(`Unknown op: 12 ${op}`);
                                        }
                                        break;
                                    default:
                                        throw Error(`Unknown op: ${op}`);
                                }
                            } else if (op < 247) stack.push(op - 139);
                            else if (op < 251) {
                                var b1 = stream.readUInt8();
                                stack.push((op - 247) * 256 + b1 + 108);
                            } else if (op < 255) {
                                var b1 = stream.readUInt8();
                                stack.push(-(256 * (op - 251)) - b1 - 108);
                            } else stack.push(stream.readInt32BE() / 65536);
                        }
                    };
                    return parse(), open && path.closePath(), path;
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "CFF");
                }
            }
            let $25d8f049c222084c$var$SBIXImage = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                originX: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                originY: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                type: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                data: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW((t)=>t.parent.buflen - t._currentOffset)
            });
            class $25d8f049c222084c$export$2e2bcd8739ae039 extends $69aac16029968692$export$2e2bcd8739ae039 {
                getImageForSize(size) {
                    for(let i = 0; i < this._font.sbix.imageTables.length; i++){
                        var table = this._font.sbix.imageTables[i];
                        if (table.ppem >= size) break;
                    }
                    let offsets = table.imageOffsets, start = offsets[this.id], end = offsets[this.id + 1];
                    return start === end ? null : (this._font.stream.pos = start, $25d8f049c222084c$var$SBIXImage.decode(this._font.stream, {
                        buflen: end - start
                    }));
                }
                render(ctx, size) {
                    let img = this.getImageForSize(size);
                    if (null != img) {
                        let scale = size / this._font.unitsPerEm;
                        ctx.image(img.data, {
                            height: size,
                            x: img.originX,
                            y: (this.bbox.minY - img.originY) * scale
                        });
                    }
                    this._font.sbix.flags.renderOutlines && super.render(ctx, size);
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "SBIX");
                }
            }
            class $0d411f0165859681$var$COLRLayer {
                constructor(glyph, color){
                    this.glyph = glyph, this.color = color;
                }
            }
            class $0d411f0165859681$export$2e2bcd8739ae039 extends $f92906be28e61769$export$2e2bcd8739ae039 {
                _getBBox() {
                    let bbox = new $f34600ab9d7f70d8$export$2e2bcd8739ae039;
                    for(let i = 0; i < this.layers.length; i++){
                        let b = this.layers[i].glyph.bbox;
                        bbox.addPoint(b.minX, b.minY), bbox.addPoint(b.maxX, b.maxY);
                    }
                    return bbox;
                }
                get layers() {
                    let cpal = this._font.CPAL, colr = this._font.COLR, low = 0, high = colr.baseGlyphRecord.length - 1;
                    for(; low <= high;){
                        let mid = low + high >> 1;
                        var rec = colr.baseGlyphRecord[mid];
                        if (this.id < rec.gid) high = mid - 1;
                        else if (this.id > rec.gid) low = mid + 1;
                        else {
                            var baseLayer = rec;
                            break;
                        }
                    }
                    if (null == baseLayer) {
                        var g = this._font._getBaseGlyph(this.id), color = {
                            red: 0,
                            green: 0,
                            blue: 0,
                            alpha: 255
                        };
                        return [
                            new $0d411f0165859681$var$COLRLayer(g, color)
                        ];
                    }
                    let layers = [];
                    for(let i = baseLayer.firstLayerIndex; i < baseLayer.firstLayerIndex + baseLayer.numLayers; i++){
                        var rec = colr.layerRecords[i], color = cpal.colorRecords[rec.paletteIndex], g = this._font._getBaseGlyph(rec.gid);
                        layers.push(new $0d411f0165859681$var$COLRLayer(g, color));
                    }
                    return layers;
                }
                render(ctx, size) {
                    for (let { glyph: glyph , color: color  } of this.layers)ctx.fillColor([
                        color.red,
                        color.green,
                        color.blue
                    ], color.alpha / 255 * 100), glyph.render(ctx, size);
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "COLR");
                }
            }
            const $0bb840cac04e911b$var$INTERMEDIATE_TUPLE = 0x4000, $0bb840cac04e911b$var$TUPLE_INDEX_MASK = 0x0fff, $0bb840cac04e911b$var$POINTS_ARE_WORDS = 0x80, $0bb840cac04e911b$var$POINT_RUN_COUNT_MASK = 0x7f;
            class $0bb840cac04e911b$export$2e2bcd8739ae039 {
                normalizeCoords(coords) {
                    let normalized = [];
                    for(var i = 0; i < this.font.fvar.axis.length; i++){
                        let axis = this.font.fvar.axis[i];
                        coords[i] < axis.defaultValue ? normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.defaultValue - axis.minValue + Number.EPSILON)) : normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.maxValue - axis.defaultValue + Number.EPSILON));
                    }
                    if (this.font.avar) for(var i = 0; i < this.font.avar.segment.length; i++){
                        let segment = this.font.avar.segment[i];
                        for(let j = 0; j < segment.correspondence.length; j++){
                            let pair = segment.correspondence[j];
                            if (j >= 1 && normalized[i] < pair.fromCoord) {
                                let prev = segment.correspondence[j - 1];
                                normalized[i] = ((normalized[i] - prev.fromCoord) * (pair.toCoord - prev.toCoord) + Number.EPSILON) / (pair.fromCoord - prev.fromCoord + Number.EPSILON) + prev.toCoord;
                                break;
                            }
                        }
                    }
                    return normalized;
                }
                transformPoints(gid, glyphPoints) {
                    if (!this.font.fvar || !this.font.gvar) return;
                    let { gvar: gvar  } = this.font;
                    if (gid >= gvar.glyphCount) return;
                    let offset = gvar.offsets[gid];
                    if (offset === gvar.offsets[gid + 1]) return;
                    let { stream: stream  } = this.font;
                    if (stream.pos = offset, stream.pos >= stream.length) return;
                    let tupleCount = stream.readUInt16BE(), offsetToData = offset + stream.readUInt16BE();
                    if (0x8000 & tupleCount) {
                        var here = stream.pos;
                        stream.pos = offsetToData;
                        var sharedPoints = this.decodePoints();
                        offsetToData = stream.pos, stream.pos = here;
                    }
                    let origPoints = glyphPoints.map((pt)=>pt.copy());
                    tupleCount &= 0x0fff;
                    for(let i = 0; i < tupleCount; i++){
                        let tupleDataSize = stream.readUInt16BE(), tupleIndex = stream.readUInt16BE();
                        if (0x8000 & tupleIndex) {
                            var tupleCoords = [];
                            for(let a = 0; a < gvar.axisCount; a++)tupleCoords.push(stream.readInt16BE() / 16384);
                        } else {
                            if ((tupleIndex & $0bb840cac04e911b$var$TUPLE_INDEX_MASK) >= gvar.globalCoordCount) throw Error("Invalid gvar table");
                            var tupleCoords = gvar.globalCoords[tupleIndex & $0bb840cac04e911b$var$TUPLE_INDEX_MASK];
                        }
                        if (tupleIndex & $0bb840cac04e911b$var$INTERMEDIATE_TUPLE) {
                            var startCoords = [];
                            for(let a1 = 0; a1 < gvar.axisCount; a1++)startCoords.push(stream.readInt16BE() / 16384);
                            var endCoords = [];
                            for(let a11 = 0; a11 < gvar.axisCount; a11++)endCoords.push(stream.readInt16BE() / 16384);
                        }
                        let factor = this.tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords);
                        if (0 === factor) {
                            offsetToData += tupleDataSize;
                            continue;
                        }
                        var here = stream.pos;
                        if (stream.pos = offsetToData, 0x2000 & tupleIndex) var points = this.decodePoints();
                        else var points = sharedPoints;
                        let nPoints = 0 === points.length ? glyphPoints.length : points.length, xDeltas = this.decodeDeltas(nPoints), yDeltas = this.decodeDeltas(nPoints);
                        if (0 === points.length) for(let i1 = 0; i1 < glyphPoints.length; i1++){
                            var point = glyphPoints[i1];
                            point.x += Math.round(xDeltas[i1] * factor), point.y += Math.round(yDeltas[i1] * factor);
                        }
                        else {
                            let outPoints = origPoints.map((pt)=>pt.copy()), hasDelta = glyphPoints.map(()=>!1);
                            for(let i2 = 0; i2 < points.length; i2++){
                                let idx = points[i2];
                                if (idx < glyphPoints.length) {
                                    let point1 = outPoints[idx];
                                    hasDelta[idx] = !0, point1.x += Math.round(xDeltas[i2] * factor), point1.y += Math.round(yDeltas[i2] * factor);
                                }
                            }
                            this.interpolateMissingDeltas(outPoints, origPoints, hasDelta);
                            for(let i11 = 0; i11 < glyphPoints.length; i11++){
                                let deltaX = outPoints[i11].x - origPoints[i11].x, deltaY = outPoints[i11].y - origPoints[i11].y;
                                glyphPoints[i11].x += deltaX, glyphPoints[i11].y += deltaY;
                            }
                        }
                        offsetToData += tupleDataSize, stream.pos = here;
                    }
                }
                decodePoints() {
                    let stream = this.font.stream, count = stream.readUInt8();
                    count & $0bb840cac04e911b$var$POINTS_ARE_WORDS && (count = (count & $0bb840cac04e911b$var$POINT_RUN_COUNT_MASK) << 8 | stream.readUInt8());
                    let points = new Uint16Array(count), i = 0, point = 0;
                    for(; i < count;){
                        let run = stream.readUInt8(), runCount = (run & $0bb840cac04e911b$var$POINT_RUN_COUNT_MASK) + 1, fn = run & $0bb840cac04e911b$var$POINTS_ARE_WORDS ? stream.readUInt16 : stream.readUInt8;
                        for(let j = 0; j < runCount && i < count; j++)point += fn.call(stream), points[i++] = point;
                    }
                    return points;
                }
                decodeDeltas(count) {
                    let stream = this.font.stream, i = 0, deltas = new Int16Array(count);
                    for(; i < count;){
                        let run = stream.readUInt8(), runCount = (0x3f & run) + 1;
                        if (0x80 & run) i += runCount;
                        else {
                            let fn = 0x40 & run ? stream.readInt16BE : stream.readInt8;
                            for(let j = 0; j < runCount && i < count; j++)deltas[i++] = fn.call(stream);
                        }
                    }
                    return deltas;
                }
                tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords) {
                    let normalized = this.normalizedCoords, { gvar: gvar  } = this.font, factor = 1;
                    for(let i = 0; i < gvar.axisCount; i++)if (0 !== tupleCoords[i]) {
                        if (0 === normalized[i]) return 0;
                        if ((tupleIndex & $0bb840cac04e911b$var$INTERMEDIATE_TUPLE) == 0) {
                            if (normalized[i] < Math.min(0, tupleCoords[i]) || normalized[i] > Math.max(0, tupleCoords[i])) return 0;
                            factor = (factor * normalized[i] + Number.EPSILON) / (tupleCoords[i] + Number.EPSILON);
                        } else {
                            if (normalized[i] < startCoords[i] || normalized[i] > endCoords[i]) return 0;
                            factor = normalized[i] < tupleCoords[i] ? factor * (normalized[i] - startCoords[i] + Number.EPSILON) / (tupleCoords[i] - startCoords[i] + Number.EPSILON) : factor * (endCoords[i] - normalized[i] + Number.EPSILON) / (endCoords[i] - tupleCoords[i] + Number.EPSILON);
                        }
                    }
                    return factor;
                }
                interpolateMissingDeltas(points, inPoints, hasDelta) {
                    if (0 === points.length) return;
                    let point = 0;
                    for(; point < points.length;){
                        let firstPoint = point, endPoint = point, pt = points[endPoint];
                        for(; !pt.endContour;)pt = points[++endPoint];
                        for(; point <= endPoint && !hasDelta[point];)point++;
                        if (point > endPoint) continue;
                        let firstDelta = point, curDelta = point;
                        for(point++; point <= endPoint;)hasDelta[point] && (this.deltaInterpolate(curDelta + 1, point - 1, curDelta, point, inPoints, points), curDelta = point), point++;
                        curDelta === firstDelta ? this.deltaShift(firstPoint, endPoint, curDelta, inPoints, points) : (this.deltaInterpolate(curDelta + 1, endPoint, curDelta, firstDelta, inPoints, points), firstDelta > 0 && this.deltaInterpolate(firstPoint, firstDelta - 1, curDelta, firstDelta, inPoints, points)), point = endPoint + 1;
                    }
                }
                deltaInterpolate(p1, p2, ref1, ref2, inPoints, outPoints) {
                    if (p1 > p2) return;
                    let iterable = [
                        "x",
                        "y"
                    ];
                    for(let i = 0; i < iterable.length; i++){
                        let k = iterable[i];
                        if (inPoints[ref1][k] > inPoints[ref2][k]) {
                            var p = ref1;
                            ref1 = ref2, ref2 = p;
                        }
                        let in1 = inPoints[ref1][k], in2 = inPoints[ref2][k], out1 = outPoints[ref1][k], out2 = outPoints[ref2][k];
                        if (in1 !== in2 || out1 === out2) {
                            let scale = in1 === in2 ? 0 : (out2 - out1) / (in2 - in1);
                            for(let p3 = p1; p3 <= p2; p3++){
                                let out = inPoints[p3][k];
                                out <= in1 ? out += out1 - in1 : out >= in2 ? out += out2 - in2 : out = out1 + (out - in1) * scale, outPoints[p3][k] = out;
                            }
                        }
                    }
                }
                deltaShift(p1, p2, ref, inPoints, outPoints) {
                    let deltaX = outPoints[ref].x - inPoints[ref].x, deltaY = outPoints[ref].y - inPoints[ref].y;
                    if (0 !== deltaX || 0 !== deltaY) for(let p = p1; p <= p2; p++)p !== ref && (outPoints[p].x += deltaX, outPoints[p].y += deltaY);
                }
                getAdvanceAdjustment(gid, table) {
                    let outerIndex, innerIndex;
                    if (table.advanceWidthMapping) {
                        let idx = gid;
                        idx >= table.advanceWidthMapping.mapCount && (idx = table.advanceWidthMapping.mapCount - 1), table.advanceWidthMapping.entryFormat, { outerIndex: outerIndex , innerIndex: innerIndex  } = table.advanceWidthMapping.mapData[idx];
                    } else outerIndex = 0, innerIndex = gid;
                    return this.getDelta(table.itemVariationStore, outerIndex, innerIndex);
                }
                getDelta(itemStore, outerIndex, innerIndex) {
                    if (outerIndex >= itemStore.itemVariationData.length) return 0;
                    let varData = itemStore.itemVariationData[outerIndex];
                    if (innerIndex >= varData.deltaSets.length) return 0;
                    let deltaSet = varData.deltaSets[innerIndex], blendVector = this.getBlendVector(itemStore, outerIndex), netAdjustment = 0;
                    for(let master = 0; master < varData.regionIndexCount; master++)netAdjustment += deltaSet.deltas[master] * blendVector[master];
                    return netAdjustment;
                }
                getBlendVector(itemStore, outerIndex) {
                    let varData = itemStore.itemVariationData[outerIndex];
                    if (this.blendVectors.has(varData)) return this.blendVectors.get(varData);
                    let normalizedCoords = this.normalizedCoords, blendVector = [];
                    for(let master = 0; master < varData.regionIndexCount; master++){
                        let scalar = 1, regionIndex = varData.regionIndexes[master], axes = itemStore.variationRegionList.variationRegions[regionIndex];
                        for(let j = 0; j < axes.length; j++){
                            let axis = axes[j];
                            scalar *= axis.startCoord > axis.peakCoord || axis.peakCoord > axis.endCoord ? 1 : axis.startCoord < 0 && axis.endCoord > 0 && 0 !== axis.peakCoord ? 1 : 0 === axis.peakCoord ? 1 : normalizedCoords[j] < axis.startCoord || normalizedCoords[j] > axis.endCoord ? 0 : normalizedCoords[j] === axis.peakCoord ? 1 : normalizedCoords[j] < axis.peakCoord ? (normalizedCoords[j] - axis.startCoord + Number.EPSILON) / (axis.peakCoord - axis.startCoord + Number.EPSILON) : (axis.endCoord - normalizedCoords[j] + Number.EPSILON) / (axis.endCoord - axis.peakCoord + Number.EPSILON);
                        }
                        blendVector[master] = scalar;
                    }
                    return this.blendVectors.set(varData, blendVector), blendVector;
                }
                constructor(font, coords){
                    this.font = font, this.normalizedCoords = this.normalizeCoords(coords), this.blendVectors = new Map;
                }
            }
            Promise.resolve();
            class $5cc7476da92df375$export$2e2bcd8739ae039 {
                includeGlyph(glyph) {
                    return "object" == typeof glyph && (glyph = glyph.id), null == this.mapping[glyph] && (this.glyphs.push(glyph), this.mapping[glyph] = this.glyphs.length - 1), this.mapping[glyph];
                }
                constructor(font){
                    this.font = font, this.glyphs = [], this.mapping = {}, this.includeGlyph(0);
                }
            }
            class $807e58506be70005$var$Point {
                static size(val) {
                    return val >= 0 && val <= 255 ? 1 : 2;
                }
                static encode(stream, value) {
                    value >= 0 && value <= 255 ? stream.writeUInt8(value) : stream.writeInt16BE(value);
                }
            }
            let $807e58506be70005$var$Glyf = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                numberOfContours: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMin: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                xMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                yMax: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                endPtsOfContours: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "numberOfContours"),
                instructions: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                flags: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, 0),
                xPoints: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($807e58506be70005$var$Point, 0),
                yPoints: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($807e58506be70005$var$Point, 0)
            });
            class $807e58506be70005$export$2e2bcd8739ae039 {
                encodeSimple(path, instructions = []) {
                    let endPtsOfContours = [], xPoints = [], yPoints = [], flags = [], same = 0, lastX = 0, lastY = 0, lastFlag = 0, pointCount = 0;
                    for(let i = 0; i < path.commands.length; i++){
                        let c = path.commands[i];
                        for(let j = 0; j < c.args.length; j += 2){
                            let x = c.args[j], y = c.args[j + 1], flag = 0;
                            if ("quadraticCurveTo" === c.command && 2 === j) {
                                let next = path.commands[i + 1];
                                if (next && "quadraticCurveTo" === next.command) {
                                    let midX = (lastX + next.args[0]) / 2, midY = (lastY + next.args[1]) / 2;
                                    if (x === midX && y === midY) continue;
                                }
                            }
                            "quadraticCurveTo" === c.command && 0 === j || (flag |= 1), flag = this._encodePoint(x, lastX, xPoints, flag, 2, 16), (flag = this._encodePoint(y, lastY, yPoints, flag, 4, 32)) === lastFlag && same < 255 ? (flags[flags.length - 1] |= 8, same++) : (same > 0 && (flags.push(same), same = 0), flags.push(flag), lastFlag = flag), lastX = x, lastY = y, pointCount++;
                        }
                        "closePath" === c.command && endPtsOfContours.push(pointCount - 1);
                    }
                    path.commands.length > 1 && "closePath" !== path.commands[path.commands.length - 1].command && endPtsOfContours.push(pointCount - 1);
                    let bbox = path.bbox, glyf = {
                        numberOfContours: endPtsOfContours.length,
                        xMin: bbox.minX,
                        yMin: bbox.minY,
                        xMax: bbox.maxX,
                        yMax: bbox.maxY,
                        endPtsOfContours: endPtsOfContours,
                        instructions: instructions,
                        flags: flags,
                        xPoints: xPoints,
                        yPoints: yPoints
                    }, size = $807e58506be70005$var$Glyf.size(glyf), tail = 4 - size % 4, stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.yy(size + tail);
                    return $807e58506be70005$var$Glyf.encode(stream, glyf), 0 !== tail && stream.fill(0, tail), stream.buffer;
                }
                _encodePoint(value, last, points, flag, shortFlag, sameFlag) {
                    let diff = value - last;
                    return value === last ? flag |= sameFlag : (-255 <= diff && diff <= 255 && (flag |= shortFlag, diff < 0 ? diff = -diff : flag |= sameFlag), points.push(diff)), flag;
                }
            }
            class $4abbb6a5dbdc441a$export$2e2bcd8739ae039 extends $5cc7476da92df375$export$2e2bcd8739ae039 {
                _addGlyph(gid) {
                    let glyph = this.font.getGlyph(gid), glyf = glyph._decode(), curOffset = this.font.loca.offsets[gid], nextOffset = this.font.loca.offsets[gid + 1], stream = this.font._getTableStream("glyf");
                    stream.pos += curOffset;
                    let buffer = stream.readBuffer(nextOffset - curOffset);
                    if (glyf && glyf.numberOfContours < 0) {
                        buffer = new Uint8Array(buffer);
                        let view = new DataView(buffer.buffer);
                        for (let component of glyf.components)gid = this.includeGlyph(component.glyphID), view.setUint16(component.pos, gid);
                    } else glyf && this.font._variationProcessor && (buffer = this.glyphEncoder.encodeSimple(glyph.path, glyf.instructions));
                    return this.glyf.push(buffer), this.loca.offsets.push(this.offset), this.hmtx.metrics.push({
                        advance: glyph.advanceWidth,
                        bearing: glyph._getMetrics().leftBearing
                    }), this.offset += buffer.length, this.glyf.length - 1;
                }
                encode() {
                    this.glyf = [], this.offset = 0, this.loca = {
                        offsets: [],
                        version: this.font.loca.version
                    }, this.hmtx = {
                        metrics: [],
                        bearings: []
                    };
                    let i = 0;
                    for(; i < this.glyphs.length;)this._addGlyph(this.glyphs[i++]);
                    let maxp = clone__WEBPACK_IMPORTED_MODULE_5__(this.font.maxp);
                    maxp.numGlyphs = this.glyf.length, this.loca.offsets.push(this.offset);
                    let head = clone__WEBPACK_IMPORTED_MODULE_5__(this.font.head);
                    head.indexToLocFormat = this.loca.version;
                    let hhea = clone__WEBPACK_IMPORTED_MODULE_5__(this.font.hhea);
                    return hhea.numberOfMetrics = this.hmtx.metrics.length, $816c07a04b6dba87$export$2e2bcd8739ae039.toBuffer({
                        tables: {
                            head: head,
                            hhea: hhea,
                            loca: this.loca,
                            maxp: maxp,
                            "cvt ": this.font["cvt "],
                            prep: this.font.prep,
                            glyf: this.glyf,
                            hmtx: this.hmtx,
                            fpgm: this.font.fpgm
                        }
                    });
                }
                constructor(font){
                    super(font), this.glyphEncoder = new $807e58506be70005$export$2e2bcd8739ae039;
                }
            }
            class $001d739428a71d5a$export$2e2bcd8739ae039 extends $5cc7476da92df375$export$2e2bcd8739ae039 {
                subsetCharstrings() {
                    this.charstrings = [];
                    let gsubrs = {};
                    for (let gid of this.glyphs){
                        this.charstrings.push(this.cff.getCharString(gid));
                        let glyph = this.font.getGlyph(gid);
                        for(let subr in glyph.path, glyph._usedGsubrs)gsubrs[subr] = !0;
                    }
                    this.gsubrs = this.subsetSubrs(this.cff.globalSubrIndex, gsubrs);
                }
                subsetSubrs(subrs, used) {
                    let res = [];
                    for(let i = 0; i < subrs.length; i++){
                        let subr = subrs[i];
                        used[i] ? (this.cff.stream.pos = subr.offset, res.push(this.cff.stream.readBuffer(subr.length))) : res.push(new Uint8Array([
                            11
                        ]));
                    }
                    return res;
                }
                subsetFontdict(topDict) {
                    topDict.FDArray = [], topDict.FDSelect = {
                        version: 0,
                        fds: []
                    };
                    let used_fds = {}, used_subrs = [], fd_select = {};
                    for (let gid of this.glyphs){
                        let fd = this.cff.fdForGlyph(gid);
                        if (null == fd) continue;
                        used_fds[fd] || (topDict.FDArray.push(Object.assign({}, this.cff.topDict.FDArray[fd])), used_subrs.push({}), fd_select[fd] = topDict.FDArray.length - 1), used_fds[fd] = !0, topDict.FDSelect.fds.push(fd_select[fd]);
                        let glyph = this.font.getGlyph(gid);
                        for(let subr in glyph.path, glyph._usedSubrs)used_subrs[fd_select[fd]][subr] = !0;
                    }
                    for(let i = 0; i < topDict.FDArray.length; i++){
                        let dict = topDict.FDArray[i];
                        delete dict.FontName, dict.Private && dict.Private.Subrs && (dict.Private = Object.assign({}, dict.Private), dict.Private.Subrs = this.subsetSubrs(dict.Private.Subrs, used_subrs[i]));
                    }
                }
                createCIDFontdict(topDict) {
                    let used_subrs = {};
                    for (let gid of this.glyphs){
                        let glyph = this.font.getGlyph(gid);
                        for(let subr in glyph.path, glyph._usedSubrs)used_subrs[subr] = !0;
                    }
                    let privateDict = Object.assign({}, this.cff.topDict.Private);
                    return this.cff.topDict.Private && this.cff.topDict.Private.Subrs && (privateDict.Subrs = this.subsetSubrs(this.cff.topDict.Private.Subrs, used_subrs)), topDict.FDArray = [
                        {
                            Private: privateDict
                        }
                    ], topDict.FDSelect = {
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
                addString(string) {
                    return string ? (this.strings || (this.strings = []), this.strings.push(string), $229224aec43783c5$export$2e2bcd8739ae039.length + this.strings.length - 1) : null;
                }
                encode() {
                    this.subsetCharstrings();
                    let charset = {
                        version: this.charstrings.length > 255 ? 2 : 1,
                        ranges: [
                            {
                                first: 1,
                                nLeft: this.charstrings.length - 2
                            }
                        ]
                    }, topDict = Object.assign({}, this.cff.topDict);
                    for (let key of (topDict.Private = null, topDict.charset = charset, topDict.Encoding = null, topDict.CharStrings = this.charstrings, [
                        "version",
                        "Notice",
                        "Copyright",
                        "FullName",
                        "FamilyName",
                        "Weight",
                        "PostScript",
                        "BaseFontName",
                        "FontName"
                    ]))topDict[key] = this.addString(this.cff.string(topDict[key]));
                    topDict.ROS = [
                        this.addString("Adobe"),
                        this.addString("Identity"),
                        0
                    ], topDict.CIDCount = this.charstrings.length, this.cff.isCIDFont ? this.subsetFontdict(topDict) : this.createCIDFontdict(topDict);
                    let top = {
                        version: 1,
                        hdrSize: this.cff.hdrSize,
                        offSize: 4,
                        header: this.cff.header,
                        nameIndex: [
                            this.cff.postscriptName
                        ],
                        topDictIndex: [
                            topDict
                        ],
                        stringIndex: this.strings,
                        globalSubrIndex: this.gsubrs
                    };
                    return $b84fd3dd9d8eddb2$export$2e2bcd8739ae039.toBuffer(top);
                }
                constructor(font){
                    if (super(font), this.cff = this.font["CFF "], !this.cff) throw Error("Not a CFF Font");
                }
            }
            class $4c1709dee528ea76$export$2e2bcd8739ae039 {
                static probe(buffer) {
                    let format = $12727730ddfc8bfe$export$3d28c1996ced1f14.decode(buffer.slice(0, 4));
                    return "true" === format || "OTTO" === format || format === String.fromCharCode(0, 1, 0, 0);
                }
                setDefaultLanguage(lang = null) {
                    this.defaultLanguage = lang;
                }
                _getTable(table) {
                    if (!(table.tag in this._tables)) try {
                        this._tables[table.tag] = this._decodeTable(table);
                    } catch (e) {
                        $d636bc798e7178db$export$bd5c5d8b8dcafd78 && (console.error(`Error decoding table ${table.tag}`), console.error(e.stack));
                    }
                    return this._tables[table.tag];
                }
                _getTableStream(tag) {
                    let table = this.directory.tables[tag];
                    return table ? (this.stream.pos = table.offset, this.stream) : null;
                }
                _decodeDirectory() {
                    return this.directory = $816c07a04b6dba87$export$2e2bcd8739ae039.decode(this.stream, {
                        _startOffset: 0
                    });
                }
                _decodeTable(table) {
                    let pos = this.stream.pos, stream = this._getTableStream(table.tag), result = $c3395722bea751e2$export$2e2bcd8739ae039[table.tag].decode(stream, this, table.length);
                    return this.stream.pos = pos, result;
                }
                getName(key, lang = this.defaultLanguage || $d636bc798e7178db$export$42940898df819940) {
                    let record = this.name && this.name.records[key];
                    return record && (record[lang] || record[this.defaultLanguage] || record[$d636bc798e7178db$export$42940898df819940] || record.en || record[Object.keys(record)[0]]) || null;
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
                    let os2 = this["OS/2"];
                    return os2 ? os2.capHeight : this.ascent;
                }
                get xHeight() {
                    let os2 = this["OS/2"];
                    return os2 ? os2.xHeight : 0;
                }
                get numGlyphs() {
                    return this.maxp.numGlyphs;
                }
                get unitsPerEm() {
                    return this.head.unitsPerEm;
                }
                get bbox() {
                    return Object.freeze(new $f34600ab9d7f70d8$export$2e2bcd8739ae039(this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax));
                }
                get _cmapProcessor() {
                    return new $f08dd41ef10b694c$export$2e2bcd8739ae039(this.cmap);
                }
                get characterSet() {
                    return this._cmapProcessor.getCharacterSet();
                }
                hasGlyphForCodePoint(codePoint) {
                    return !!this._cmapProcessor.lookup(codePoint);
                }
                glyphForCodePoint(codePoint) {
                    return this.getGlyph(this._cmapProcessor.lookup(codePoint), [
                        codePoint
                    ]);
                }
                glyphsForString(string) {
                    let glyphs = [], len = string.length, idx = 0, last = -1, state = -1;
                    for(; idx <= len;){
                        let code = 0, nextState = 0;
                        if (idx < len) {
                            if (0xd800 <= (code = string.charCodeAt(idx++)) && code <= 0xdbff && idx < len) {
                                let next = string.charCodeAt(idx);
                                0xdc00 <= next && next <= 0xdfff && (idx++, code = ((0x3ff & code) << 10) + (0x3ff & next) + 0x10000);
                            }
                            nextState = 0xfe00 <= code && code <= 0xfe0f || 0xe0100 <= code && code <= 0xe01ef ? 1 : 0;
                        } else idx++;
                        0 === state && 1 === nextState ? glyphs.push(this.getGlyph(this._cmapProcessor.lookup(last, code), [
                            last,
                            code
                        ])) : 0 === state && 0 === nextState && glyphs.push(this.glyphForCodePoint(last)), last = code, state = nextState;
                    }
                    return glyphs;
                }
                get _layoutEngine() {
                    return new $4c0a7fa5df7a9ab1$export$2e2bcd8739ae039(this);
                }
                layout(string, userFeatures, script, language, direction) {
                    return this._layoutEngine.layout(string, userFeatures, script, language, direction);
                }
                stringsForGlyph(gid) {
                    return this._layoutEngine.stringsForGlyph(gid);
                }
                get availableFeatures() {
                    return this._layoutEngine.getAvailableFeatures();
                }
                getAvailableFeatures(script, language) {
                    return this._layoutEngine.getAvailableFeatures(script, language);
                }
                _getBaseGlyph(glyph, characters = []) {
                    return !this._glyphs[glyph] && (this.directory.tables.glyf ? this._glyphs[glyph] = new $69aac16029968692$export$2e2bcd8739ae039(glyph, characters, this) : (this.directory.tables["CFF "] || this.directory.tables.CFF2) && (this._glyphs[glyph] = new $62cc5109c6101893$export$2e2bcd8739ae039(glyph, characters, this))), this._glyphs[glyph] || null;
                }
                getGlyph(glyph, characters = []) {
                    return this._glyphs[glyph] || (this.directory.tables.sbix ? this._glyphs[glyph] = new $25d8f049c222084c$export$2e2bcd8739ae039(glyph, characters, this) : this.directory.tables.COLR && this.directory.tables.CPAL ? this._glyphs[glyph] = new $0d411f0165859681$export$2e2bcd8739ae039(glyph, characters, this) : this._getBaseGlyph(glyph, characters)), this._glyphs[glyph] || null;
                }
                createSubset() {
                    return this.directory.tables["CFF "] ? new $001d739428a71d5a$export$2e2bcd8739ae039(this) : new $4abbb6a5dbdc441a$export$2e2bcd8739ae039(this);
                }
                get variationAxes() {
                    let res = {};
                    if (!this.fvar) return res;
                    for (let axis of this.fvar.axis)res[axis.axisTag.trim()] = {
                        name: axis.name.en,
                        min: axis.minValue,
                        default: axis.defaultValue,
                        max: axis.maxValue
                    };
                    return res;
                }
                get namedVariations() {
                    let res = {};
                    if (!this.fvar) return res;
                    for (let instance of this.fvar.instance){
                        let settings = {};
                        for(let i = 0; i < this.fvar.axis.length; i++)settings[this.fvar.axis[i].axisTag.trim()] = instance.coord[i];
                        res[instance.name.en] = settings;
                    }
                    return res;
                }
                getVariation(settings) {
                    if (!(this.directory.tables.fvar && (this.directory.tables.gvar && this.directory.tables.glyf || this.directory.tables.CFF2))) throw Error("Variations require a font with the fvar, gvar and glyf, or CFF2 tables.");
                    if ("string" == typeof settings && (settings = this.namedVariations[settings]), "object" != typeof settings) throw Error("Variation settings must be either a variation name or settings object.");
                    let coords = this.fvar.axis.map((axis, i)=>{
                        let axisTag = axis.axisTag.trim();
                        return axisTag in settings ? Math.max(axis.minValue, Math.min(axis.maxValue, settings[axisTag])) : axis.defaultValue;
                    }), stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this.stream.buffer);
                    stream.pos = this._directoryPos;
                    let font = new $4c1709dee528ea76$export$2e2bcd8739ae039(stream, coords);
                    return font._tables = this._tables, font;
                }
                get _variationProcessor() {
                    if (!this.fvar) return null;
                    let variationCoords = this.variationCoords;
                    return variationCoords || this.CFF2 ? (variationCoords || (variationCoords = this.fvar.axis.map((axis)=>axis.defaultValue)), new $0bb840cac04e911b$export$2e2bcd8739ae039(this, variationCoords)) : null;
                }
                getFont(name) {
                    return this.getVariation(name);
                }
                constructor(stream, variationCoords = null){
                    for(let tag in (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "TTF"), this.defaultLanguage = null, this.stream = stream, this.variationCoords = variationCoords, this._directoryPos = this.stream.pos, this._tables = {}, this._glyphs = {}, this._decodeDirectory(), this.directory.tables){
                        let table = this.directory.tables[tag];
                        $c3395722bea751e2$export$2e2bcd8739ae039[tag] && table.length > 0 && Object.defineProperty(this, tag, {
                            get: this._getTable.bind(this, table)
                        });
                    }
                }
            }
            (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "bbox", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "_cmapProcessor", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "characterSet", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "_layoutEngine", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "variationAxes", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "namedVariations", null), (0, _swc_helpers_src_ts_decorate_mjs__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
                $e71565f2ce09cb6b$export$69a3209f1a06c04d
            ], $4c1709dee528ea76$export$2e2bcd8739ae039.prototype, "_variationProcessor", null);
            let $c1726355ecc5b889$var$WOFFDirectoryEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                offset: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "void", {
                    type: "global"
                }),
                compLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                origChecksum: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $c1726355ecc5b889$var$WOFFDirectory = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                flavor: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                numTables: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                totalSfntSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                majorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                metaOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                metaLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                metaOrigLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                privOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                privLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($c1726355ecc5b889$var$WOFFDirectoryEntry, "numTables")
            });
            $c1726355ecc5b889$var$WOFFDirectory.process = function() {
                let tables1 = {};
                for (let table of this.tables)tables1[table.tag] = table;
                this.tables = tables1;
            };
            class $760785214b9fc52c$export$2e2bcd8739ae039 extends $4c1709dee528ea76$export$2e2bcd8739ae039 {
                static probe(buffer) {
                    return "wOFF" === $12727730ddfc8bfe$export$3d28c1996ced1f14.decode(buffer.slice(0, 4));
                }
                _decodeDirectory() {
                    this.directory = $c1726355ecc5b889$var$WOFFDirectory.decode(this.stream, {
                        _startOffset: 0
                    });
                }
                _getTableStream(tag) {
                    let table = this.directory.tables[tag];
                    if (table) {
                        if (this.stream.pos = table.offset, !(table.compLength < table.length)) return this.stream;
                        {
                            this.stream.pos += 2;
                            let outBuffer = new Uint8Array(table.length), buf = tiny_inflate__WEBPACK_IMPORTED_MODULE_6__(this.stream.readBuffer(table.compLength - 2), outBuffer);
                            return new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(buf);
                        }
                    }
                    return null;
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "WOFF");
                }
            }
            class $8046190c9f1ad19e$export$2e2bcd8739ae039 extends $69aac16029968692$export$2e2bcd8739ae039 {
                _decode() {
                    return this._font._transformedGlyphs[this.id];
                }
                _getCBox() {
                    return this.path.bbox;
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "WOFF2");
                }
            }
            const $c28ec7bbb3b8de3a$var$Base128 = {
                decode (stream) {
                    let result = 0, iterable = [
                        0,
                        1,
                        2,
                        3,
                        4
                    ];
                    for(let j = 0; j < iterable.length; j++){
                        iterable[j];
                        let code = stream.readUInt8();
                        if (0xe0000000 & result) throw Error("Overflow");
                        if (result = result << 7 | 0x7f & code, (0x80 & code) == 0) return result;
                    }
                    throw Error("Bad base 128 number");
                }
            };
            let $c28ec7bbb3b8de3a$var$knownTags = [
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
            ], $c28ec7bbb3b8de3a$var$WOFF2DirectoryEntry = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                flags: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                customTag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Fi(new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4), (t)=>(0x3f & t.flags) == 0x3f),
                tag: (t)=>t.customTag || $c28ec7bbb3b8de3a$var$knownTags[0x3f & t.flags],
                length: $c28ec7bbb3b8de3a$var$Base128,
                transformVersion: (t)=>t.flags >>> 6 & 0x03,
                transformed: (t)=>"glyf" === t.tag || "loca" === t.tag ? 0 === t.transformVersion : 0 !== t.transformVersion,
                transformLength: new restructure__WEBPACK_IMPORTED_MODULE_0__.Fi($c28ec7bbb3b8de3a$var$Base128, (t)=>t.transformed)
            }), $c28ec7bbb3b8de3a$var$WOFF2Directory = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                tag: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                flavor: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                numTables: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.mL),
                totalSfntSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                totalCompressedSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                majorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                minorVersion: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                metaOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                metaLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                metaOrigLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                privOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                privLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                tables: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($c28ec7bbb3b8de3a$var$WOFF2DirectoryEntry, "numTables")
            });
            $c28ec7bbb3b8de3a$var$WOFF2Directory.process = function() {
                let tables = {};
                for(let i = 0; i < this.tables.length; i++){
                    let table = this.tables[i];
                    tables[table.tag] = table;
                }
                return this.tables = tables;
            };
            class $21ee218f84ac7f32$export$2e2bcd8739ae039 extends $4c1709dee528ea76$export$2e2bcd8739ae039 {
                static probe(buffer) {
                    return "wOF2" === $12727730ddfc8bfe$export$3d28c1996ced1f14.decode(buffer.slice(0, 4));
                }
                _decodeDirectory() {
                    this.directory = $c28ec7bbb3b8de3a$var$WOFF2Directory.decode(this.stream), this._dataPos = this.stream.pos;
                }
                _decompress() {
                    if (!this._decompressed) {
                        this.stream.pos = this._dataPos;
                        let buffer = this.stream.readBuffer(this.directory.totalCompressedSize), decompressedSize = 0;
                        for(let tag in this.directory.tables){
                            let entry = this.directory.tables[tag];
                            entry.offset = decompressedSize, decompressedSize += null != entry.transformLength ? entry.transformLength : entry.length;
                        }
                        let decompressed = brotli_decompress_js__WEBPACK_IMPORTED_MODULE_7__(buffer, decompressedSize);
                        if (!decompressed) throw Error("Error decoding compressed data in WOFF2");
                        this.stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(decompressed), this._decompressed = !0;
                    }
                }
                _decodeTable(table) {
                    return this._decompress(), super._decodeTable(table);
                }
                _getBaseGlyph(glyph, characters = []) {
                    if (!this._glyphs[glyph]) return this.directory.tables.glyf && this.directory.tables.glyf.transformed ? (this._transformedGlyphs || this._transformGlyfTable(), this._glyphs[glyph] = new $8046190c9f1ad19e$export$2e2bcd8739ae039(glyph, characters, this)) : super._getBaseGlyph(glyph, characters);
                }
                _transformGlyfTable() {
                    this._decompress(), this.stream.pos = this.directory.tables.glyf.offset;
                    let table = $21ee218f84ac7f32$var$GlyfTable.decode(this.stream), glyphs = [];
                    for(let index = 0; index < table.numGlyphs; index++){
                        let glyph = {}, nContours = table.nContours.readInt16BE();
                        if (glyph.numberOfContours = nContours, nContours > 0) {
                            let nPoints = [], totalPoints = 0;
                            for(let i = 0; i < nContours; i++)totalPoints += $21ee218f84ac7f32$var$read255UInt16(table.nPoints), nPoints.push(totalPoints);
                            glyph.points = $21ee218f84ac7f32$var$decodeTriplet(table.flags, table.glyphs, totalPoints);
                            for(let i1 = 0; i1 < nContours; i1++)glyph.points[nPoints[i1] - 1].endContour = !0;
                            $21ee218f84ac7f32$var$read255UInt16(table.glyphs);
                        } else nContours < 0 && $69aac16029968692$export$2e2bcd8739ae039.prototype._decodeComposite.call({
                            _font: this
                        }, glyph, table.composites) && $21ee218f84ac7f32$var$read255UInt16(table.glyphs);
                        glyphs.push(glyph);
                    }
                    this._transformedGlyphs = glyphs;
                }
                constructor(...args){
                    super(...args), (0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "WOFF2");
                }
            }
            class $21ee218f84ac7f32$var$Substream {
                decode(stream, parent) {
                    return new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this._buf.decode(stream, parent));
                }
                constructor(length){
                    this.length = length, this._buf = new restructure__WEBPACK_IMPORTED_MODULE_0__.lW(length);
                }
            }
            let $21ee218f84ac7f32$var$GlyfTable = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                version: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                numGlyphs: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                indexFormat: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nContourStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                nPointsStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                flagStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                glyphStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                compositeStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                bboxStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                instructionStreamSize: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                nContours: new $21ee218f84ac7f32$var$Substream("nContourStreamSize"),
                nPoints: new $21ee218f84ac7f32$var$Substream("nPointsStreamSize"),
                flags: new $21ee218f84ac7f32$var$Substream("flagStreamSize"),
                glyphs: new $21ee218f84ac7f32$var$Substream("glyphStreamSize"),
                composites: new $21ee218f84ac7f32$var$Substream("compositeStreamSize"),
                bboxes: new $21ee218f84ac7f32$var$Substream("bboxStreamSize"),
                instructions: new $21ee218f84ac7f32$var$Substream("instructionStreamSize")
            });
            const $21ee218f84ac7f32$var$LOWEST_U_CODE = 253;
            function $21ee218f84ac7f32$var$read255UInt16(stream) {
                let code = stream.readUInt8();
                return 253 === code ? stream.readUInt16BE() : 255 === code ? stream.readUInt8() + $21ee218f84ac7f32$var$LOWEST_U_CODE : 254 === code ? stream.readUInt8() + 2 * $21ee218f84ac7f32$var$LOWEST_U_CODE : code;
            }
            function $21ee218f84ac7f32$var$withSign(flag, baseval) {
                return 1 & flag ? baseval : -baseval;
            }
            function $21ee218f84ac7f32$var$decodeTriplet(flags, glyphs, nPoints) {
                let y, x = y = 0, res = [];
                for(let i = 0; i < nPoints; i++){
                    let dx = 0, dy = 0, flag = flags.readUInt8(), onCurve = !(flag >> 7);
                    if ((flag &= 0x7f) < 10) dx = 0, dy = $21ee218f84ac7f32$var$withSign(flag, ((14 & flag) << 7) + glyphs.readUInt8());
                    else if (flag < 20) dx = $21ee218f84ac7f32$var$withSign(flag, ((flag - 10 & 14) << 7) + glyphs.readUInt8()), dy = 0;
                    else if (flag < 84) {
                        var b0 = flag - 20, b1 = glyphs.readUInt8();
                        dx = $21ee218f84ac7f32$var$withSign(flag, 1 + (0x30 & b0) + (b1 >> 4)), dy = $21ee218f84ac7f32$var$withSign(flag >> 1, 1 + ((0x0c & b0) << 2) + (0x0f & b1));
                    } else if (flag < 120) {
                        var b0 = flag - 84;
                        dx = $21ee218f84ac7f32$var$withSign(flag, 1 + (b0 / 12 << 8) + glyphs.readUInt8()), dy = $21ee218f84ac7f32$var$withSign(flag >> 1, 1 + (b0 % 12 >> 2 << 8) + glyphs.readUInt8());
                    } else if (flag < 124) {
                        var b1 = glyphs.readUInt8();
                        let b2 = glyphs.readUInt8();
                        dx = $21ee218f84ac7f32$var$withSign(flag, (b1 << 4) + (b2 >> 4)), dy = $21ee218f84ac7f32$var$withSign(flag >> 1, ((0x0f & b2) << 8) + glyphs.readUInt8());
                    } else dx = $21ee218f84ac7f32$var$withSign(flag, glyphs.readUInt16BE()), dy = $21ee218f84ac7f32$var$withSign(flag >> 1, glyphs.readUInt16BE());
                    x += dx, y += dy, res.push(new $69aac16029968692$export$baf26146a414f24a(onCurve, !1, x, y));
                }
                return res;
            }
            let $cd5853a56c68fec7$var$TTCHeader = new restructure__WEBPACK_IMPORTED_MODULE_0__.bS(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, {
                0x00010000: {
                    numFonts: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "numFonts")
                },
                0x00020000: {
                    numFonts: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    offsets: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, "numFonts"),
                    dsigTag: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    dsigLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                    dsigOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
                }
            });
            class $cd5853a56c68fec7$export$2e2bcd8739ae039 {
                static probe(buffer) {
                    return "ttcf" === $12727730ddfc8bfe$export$3d28c1996ced1f14.decode(buffer.slice(0, 4));
                }
                getFont(name) {
                    for (let offset of this.header.offsets){
                        let stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this.stream.buffer);
                        stream.pos = offset;
                        let font = new $4c1709dee528ea76$export$2e2bcd8739ae039(stream);
                        if (font.postscriptName === name || font.postscriptName instanceof Uint8Array && name instanceof Uint8Array && font.postscriptName.every((v, i)=>name[i] === v)) return font;
                    }
                    return null;
                }
                get fonts() {
                    let fonts = [];
                    for (let offset of this.header.offsets){
                        let stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this.stream.buffer);
                        stream.pos = offset, fonts.push(new $4c1709dee528ea76$export$2e2bcd8739ae039(stream));
                    }
                    return fonts;
                }
                constructor(stream){
                    if ((0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "TTC"), this.stream = stream, "ttcf" !== stream.readString(4)) throw Error("Not a TrueType collection");
                    this.header = $cd5853a56c68fec7$var$TTCHeader.decode(stream);
                }
            }
            let $05f49f930186144e$var$DFontName = new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(restructure__WEBPACK_IMPORTED_MODULE_0__.w_);
            new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                len: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                buf: new restructure__WEBPACK_IMPORTED_MODULE_0__.lW("len")
            });
            let $05f49f930186144e$var$Ref = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                id: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                nameOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Af,
                attr: restructure__WEBPACK_IMPORTED_MODULE_0__.w_,
                dataOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.Un,
                handle: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            }), $05f49f930186144e$var$Type = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                name: new restructure__WEBPACK_IMPORTED_MODULE_0__.Ld(4),
                maxTypeIndex: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                refList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($05f49f930186144e$var$Ref, (t)=>t.maxTypeIndex + 1), {
                    type: "parent"
                })
            }), $05f49f930186144e$var$TypeList = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                length: restructure__WEBPACK_IMPORTED_MODULE_0__.mL,
                types: new restructure__WEBPACK_IMPORTED_MODULE_0__.mJ($05f49f930186144e$var$Type, (t)=>t.length + 1)
            }), $05f49f930186144e$var$DFontMap = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                reserved: new restructure__WEBPACK_IMPORTED_MODULE_0__.kV(restructure__WEBPACK_IMPORTED_MODULE_0__.w_, 24),
                typeList: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, $05f49f930186144e$var$TypeList),
                nameListOffset: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.mL, "void")
            }), $05f49f930186144e$var$DFontHeader = new restructure__WEBPACK_IMPORTED_MODULE_0__.AU({
                dataOffset: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                map: new restructure__WEBPACK_IMPORTED_MODULE_0__.$J(restructure__WEBPACK_IMPORTED_MODULE_0__.U7, $05f49f930186144e$var$DFontMap),
                dataLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7,
                mapLength: restructure__WEBPACK_IMPORTED_MODULE_0__.U7
            });
            class $05f49f930186144e$export$2e2bcd8739ae039 {
                static probe(buffer) {
                    let stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(buffer);
                    try {
                        var header = $05f49f930186144e$var$DFontHeader.decode(stream);
                    } catch (e) {
                        return !1;
                    }
                    for (let type of header.map.typeList.types)if ("sfnt" === type.name) return !0;
                    return !1;
                }
                getFont(name) {
                    if (!this.sfnt) return null;
                    for (let ref of this.sfnt.refList){
                        let pos = this.header.dataOffset + ref.dataOffset + 4, stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this.stream.buffer.slice(pos)), font = new $4c1709dee528ea76$export$2e2bcd8739ae039(stream);
                        if (font.postscriptName === name || font.postscriptName instanceof Uint8Array && name instanceof Uint8Array && font.postscriptName.every((v, i)=>name[i] === v)) return font;
                    }
                    return null;
                }
                get fonts() {
                    let fonts = [];
                    for (let ref of this.sfnt.refList){
                        let pos = this.header.dataOffset + ref.dataOffset + 4, stream = new restructure__WEBPACK_IMPORTED_MODULE_0__.fT(this.stream.buffer.slice(pos));
                        fonts.push(new $4c1709dee528ea76$export$2e2bcd8739ae039(stream));
                    }
                    return fonts;
                }
                constructor(stream){
                    for (let type of ((0, _swc_helpers_src_define_property_mjs__WEBPACK_IMPORTED_MODULE_9__.Z)(this, "type", "DFont"), this.stream = stream, this.header = $05f49f930186144e$var$DFontHeader.decode(this.stream), this.header.map.typeList.types)){
                        for (let ref of type.refList)ref.nameOffset >= 0 ? (this.stream.pos = ref.nameOffset + this.header.map.nameListOffset, ref.name = $05f49f930186144e$var$DFontName.decode(this.stream)) : ref.name = null;
                        "sfnt" === type.name && (this.sfnt = type);
                    }
                }
            }
            $d636bc798e7178db$export$36b2f24e97d43be($4c1709dee528ea76$export$2e2bcd8739ae039), $d636bc798e7178db$export$36b2f24e97d43be($760785214b9fc52c$export$2e2bcd8739ae039), $d636bc798e7178db$export$36b2f24e97d43be($21ee218f84ac7f32$export$2e2bcd8739ae039), $d636bc798e7178db$export$36b2f24e97d43be($cd5853a56c68fec7$export$2e2bcd8739ae039), $d636bc798e7178db$export$36b2f24e97d43be($05f49f930186144e$export$2e2bcd8739ae039);
        }
    }
]);
