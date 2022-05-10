(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        405
    ],
    {
        7154: function(module) {
            function _extends() {
                return module.exports = _extends = Object.assign || function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }, module.exports.__esModule = !0, module.exports.default = module.exports, _extends.apply(this, arguments);
            }
            module.exports = _extends, module.exports.__esModule = !0, module.exports.default = module.exports;
        },
        562: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Ki: function() {
                    return toUint8;
                },
                tm: function() {
                    return bytesToNumber;
                },
                hL: function() {
                    return numberToBytes;
                },
                d3: function() {
                    return bytesToString;
                },
                qX: function() {
                    return stringToBytes;
                },
                lx: function() {
                    return concatTypedArrays;
                },
                G3: function() {
                    return bytesMatch;
                }
            });
            var a1, b1, global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908), global_window__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__), toUint8 = function(bytes) {
                var obj;
                return bytes instanceof Uint8Array ? bytes : (Array.isArray(bytes) || (obj = bytes, ArrayBuffer.isView(obj)) || bytes instanceof ArrayBuffer || (bytes = "number" != typeof bytes || "number" == typeof bytes && bytes != bytes ? 0 : [
                    bytes
                ]), new Uint8Array(bytes && bytes.buffer || bytes, bytes && bytes.byteOffset || 0, bytes && bytes.byteLength || 0));
            }, BigInt = global_window__WEBPACK_IMPORTED_MODULE_0___default().BigInt || Number, BYTE_TABLE = [
                BigInt("0x1"),
                BigInt("0x100"),
                BigInt("0x10000"),
                BigInt("0x1000000"),
                BigInt("0x100000000"),
                BigInt("0x10000000000"),
                BigInt("0x1000000000000"),
                BigInt("0x100000000000000"),
                BigInt("0x10000000000000000"), 
            ], bytesToNumber = (a1 = new Uint16Array([
                0xffcc
            ]), 0xff === (b1 = new Uint8Array(a1.buffer, a1.byteOffset, a1.byteLength))[0] || b1[0], function(bytes, _temp) {
                var _ref = void 0 === _temp ? {} : _temp, _ref$signed = _ref.signed, _ref$le = _ref.le, le = void 0 !== _ref$le && _ref$le;
                bytes = toUint8(bytes);
                var fn = le ? "reduce" : "reduceRight", number = (bytes[fn] ? bytes[fn] : Array.prototype[fn]).call(bytes, function(total, byte, i) {
                    var exponent = le ? i : Math.abs(i + 1 - bytes.length);
                    return total + BigInt(byte) * BYTE_TABLE[exponent];
                }, BigInt(0));
                if (void 0 !== _ref$signed && _ref$signed) {
                    var max = BYTE_TABLE[bytes.length] / BigInt(2) - BigInt(1);
                    (number = BigInt(number)) > max && (number -= max, number -= max, number -= BigInt(2));
                }
                return Number(number);
            }), numberToBytes = function(number, _temp2) {
                var _ref2$le = (void 0 === _temp2 ? {} : _temp2).le, le = void 0 !== _ref2$le && _ref2$le;
                ("bigint" != typeof number && "number" != typeof number || "number" == typeof number && number != number) && (number = 0), number = BigInt(number);
                for(var byteCount = Math.ceil(number.toString(2).length / 8), bytes = new Uint8Array(new ArrayBuffer(byteCount)), i = 0; i < byteCount; i++){
                    var byteIndex = le ? i : Math.abs(i + 1 - bytes.length);
                    bytes[byteIndex] = Number(number / BYTE_TABLE[i] & BigInt(0xff)), number < 0 && (bytes[byteIndex] = Math.abs(~bytes[byteIndex]), bytes[byteIndex] -= 0 === i ? 1 : 2);
                }
                return bytes;
            }, bytesToString = function(bytes) {
                if (!bytes) return "";
                bytes = Array.prototype.slice.call(bytes);
                var string = String.fromCharCode.apply(null, toUint8(bytes));
                try {
                    return decodeURIComponent(escape(string));
                } catch (e) {}
                return string;
            }, stringToBytes = function(string, stringIsBytes) {
                if ("string" != typeof string && string && "function" == typeof string.toString && (string = string.toString()), "string" != typeof string) return new Uint8Array();
                stringIsBytes || (string = unescape(encodeURIComponent(string)));
                for(var view = new Uint8Array(string.length), i = 0; i < string.length; i++)view[i] = string.charCodeAt(i);
                return view;
            }, concatTypedArrays = function() {
                for(var _len = arguments.length, buffers = new Array(_len), _key = 0; _key < _len; _key++)buffers[_key] = arguments[_key];
                if ((buffers = buffers.filter(function(b) {
                    return b && (b.byteLength || b.length) && "string" != typeof b;
                })).length <= 1) return toUint8(buffers[0]);
                var totalLen = buffers.reduce(function(total, buf, i) {
                    return total + (buf.byteLength || buf.length);
                }, 0), tempBuffer = new Uint8Array(totalLen), offset = 0;
                return buffers.forEach(function(buf) {
                    buf = toUint8(buf), tempBuffer.set(buf, offset), offset += buf.byteLength;
                }), tempBuffer;
            }, bytesMatch = function(a, b, _temp3) {
                var _ref3 = void 0 === _temp3 ? {} : _temp3, _ref3$offset = _ref3.offset, offset = void 0 === _ref3$offset ? 0 : _ref3$offset, _ref3$mask = _ref3.mask, mask = void 0 === _ref3$mask ? [] : _ref3$mask;
                a = toUint8(a);
                var fn = (b = toUint8(b)).every ? b.every : Array.prototype.every;
                return b.length && a.length - offset >= b.length && fn.call(b, function(bByte, i) {
                    return bByte === (mask[i] ? mask[i] & a[offset + i] : a[offset + i]);
                });
            };
        },
        2260: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                ws: function() {
                    return translateLegacyCodec;
                },
                kS: function() {
                    return parseCodecs;
                },
                Jg: function() {
                    return codecsFromDefault;
                },
                KL: function() {
                    return isAudioCodec;
                },
                _5: function() {
                    return getMimeForCodec;
                },
                p7: function() {
                    return browserSupportsCodec;
                },
                Hi: function() {
                    return muxerSupportsCodec;
                },
                lA: function() {
                    return DEFAULT_AUDIO_CODEC;
                },
                xz: function() {
                    return DEFAULT_VIDEO_CODEC;
                }
            });
            var global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908), global_window__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__), regexs = {
                mp4: /^(av0?1|avc0?[1234]|vp0?9|flac|opus|mp3|mp4a|mp4v|stpp.ttml.im1t)/,
                webm: /^(vp0?[89]|av0?1|opus|vorbis)/,
                ogg: /^(vp0?[89]|theora|flac|opus|vorbis)/,
                video: /^(av0?1|avc0?[1234]|vp0?[89]|hvc1|hev1|theora|mp4v)/,
                audio: /^(mp4a|flac|vorbis|opus|ac-[34]|ec-3|alac|mp3|speex|aac)/,
                text: /^(stpp.ttml.im1t)/,
                muxerVideo: /^(avc0?1)/,
                muxerAudio: /^(mp4a)/,
                muxerText: /a^/
            }, mediaTypes = [
                "video",
                "audio",
                "text"
            ], upperMediaTypes = [
                "Video",
                "Audio",
                "Text"
            ], translateLegacyCodec = function(codec) {
                return codec ? codec.replace(/avc1\.(\d+)\.(\d+)/i, function(orig, profile, avcLevel) {
                    var profileHex = ("00" + Number(profile).toString(16)).slice(-2), avcLevelHex = ("00" + Number(avcLevel).toString(16)).slice(-2);
                    return "avc1." + profileHex + "00" + avcLevelHex;
                }) : codec;
            }, parseCodecs = function(codecString) {
                void 0 === codecString && (codecString = "");
                var codecs = codecString.split(","), result = [];
                return codecs.forEach(function(codec) {
                    var codecType;
                    codec = codec.trim(), mediaTypes.forEach(function(name) {
                        var match = regexs[name].exec(codec.toLowerCase());
                        if (match && !(match.length <= 1)) {
                            codecType = name;
                            var type = codec.substring(0, match[1].length), details = codec.replace(type, "");
                            result.push({
                                type: type,
                                details: details,
                                mediaType: name
                            });
                        }
                    }), codecType || result.push({
                        type: codec,
                        details: "",
                        mediaType: "unknown"
                    });
                }), result;
            }, codecsFromDefault = function(master, audioGroupId) {
                if (!master.mediaGroups.AUDIO || !audioGroupId) return null;
                var audioGroup = master.mediaGroups.AUDIO[audioGroupId];
                if (!audioGroup) return null;
                for(var name in audioGroup){
                    var audioType = audioGroup[name];
                    if (audioType.default && audioType.playlists) return parseCodecs(audioType.playlists[0].attributes.CODECS);
                }
                return null;
            }, isAudioCodec = function(codec) {
                return void 0 === codec && (codec = ""), regexs.audio.test(codec.trim().toLowerCase());
            }, getMimeForCodec = function(codecString) {
                if (codecString && "string" == typeof codecString) {
                    var codec, codecs = codecString.toLowerCase().split(",").map(function(c) {
                        return translateLegacyCodec(c.trim());
                    }), type = "video";
                    1 === codecs.length && isAudioCodec(codecs[0]) ? type = "audio" : 1 === codecs.length && (void 0 === (codec = codecs[0]) && (codec = ""), regexs.text.test(codec.trim().toLowerCase())) && (type = "application");
                    var container = "mp4";
                    return codecs.every(function(c) {
                        return regexs.mp4.test(c);
                    }) ? container = "mp4" : codecs.every(function(c) {
                        return regexs.webm.test(c);
                    }) ? container = "webm" : codecs.every(function(c) {
                        return regexs.ogg.test(c);
                    }) && (container = "ogg"), type + "/" + container + ';codecs="' + codecString + '"';
                }
            }, browserSupportsCodec = function(codecString) {
                return void 0 === codecString && (codecString = ""), global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource && global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource.isTypeSupported && global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource.isTypeSupported(getMimeForCodec(codecString)) || !1;
            }, muxerSupportsCodec = function(codecString) {
                return void 0 === codecString && (codecString = ""), codecString.toLowerCase().split(",").every(function(codec) {
                    codec = codec.trim();
                    for(var i = 0; i < upperMediaTypes.length; i++)if (regexs["muxer" + upperMediaTypes[i]].test(codec)) return !0;
                    return !1;
                });
            }, DEFAULT_AUDIO_CODEC = "mp4a.40.2", DEFAULT_VIDEO_CODEC = "avc1.4d400d";
        },
        6185: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Xm: function() {
                    return detectContainerForBytes;
                },
                cz: function() {
                    return isLikelyFmp4MediaSegment;
                }
            });
            var DESCRIPTORS, byte_helpers = __webpack_require__(562);
            new Uint8Array([
                0x4f,
                0x70,
                0x75,
                0x73,
                0x48,
                0x65,
                0x61,
                0x64, 
            ]);
            var normalizePath1 = function(path) {
                return "string" == typeof path ? (0, byte_helpers.qX)(path) : path;
            }, normalizePaths = function(paths) {
                return Array.isArray(paths) ? paths.map(function(p) {
                    return normalizePath1(p);
                }) : [
                    normalizePath1(paths)
                ];
            }, parseDescriptors = function(bytes) {
                bytes = (0, byte_helpers.Ki)(bytes);
                for(var results = [], i = 0; bytes.length > i;){
                    var tag = bytes[i], size = 0, headerSize = 0, byte = bytes[++headerSize];
                    for(headerSize++; 0x80 & byte;)size = (0x7f & byte) << 7, byte = bytes[headerSize], headerSize++;
                    size += 0x7f & byte;
                    for(var z = 0; z < DESCRIPTORS.length; z++){
                        var _DESCRIPTORS$z = DESCRIPTORS[z], id = _DESCRIPTORS$z.id, parser = _DESCRIPTORS$z.parser;
                        if (tag === id) {
                            results.push(parser(bytes.subarray(headerSize, headerSize + size)));
                            break;
                        }
                    }
                    i += size + headerSize;
                }
                return results;
            };
            DESCRIPTORS = [
                {
                    id: 0x03,
                    parser: function(bytes) {
                        var desc = {
                            tag: 0x03,
                            id: bytes[0] << 8 | bytes[1],
                            flags: bytes[2],
                            size: 3,
                            dependsOnEsId: 0,
                            ocrEsId: 0,
                            descriptors: [],
                            url: ""
                        };
                        if (0x80 & desc.flags && (desc.dependsOnEsId = bytes[desc.size] << 8 | bytes[desc.size + 1], desc.size += 2), 0x40 & desc.flags) {
                            var len = bytes[desc.size];
                            desc.url = (0, byte_helpers.d3)(bytes.subarray(desc.size + 1, desc.size + 1 + len)), desc.size += len;
                        }
                        return 0x20 & desc.flags && (desc.ocrEsId = bytes[desc.size] << 8 | bytes[desc.size + 1], desc.size += 2), desc.descriptors = parseDescriptors(bytes.subarray(desc.size)) || [], desc;
                    }
                },
                {
                    id: 0x04,
                    parser: function(bytes) {
                        return {
                            tag: 0x04,
                            oti: bytes[0],
                            streamType: bytes[1],
                            bufferSize: bytes[2] << 16 | bytes[3] << 8 | bytes[4],
                            maxBitrate: bytes[5] << 24 | bytes[6] << 16 | bytes[7] << 8 | bytes[8],
                            avgBitrate: bytes[9] << 24 | bytes[10] << 16 | bytes[11] << 8 | bytes[12],
                            descriptors: parseDescriptors(bytes.subarray(13))
                        };
                    }
                },
                {
                    id: 0x05,
                    parser: function(bytes) {
                        return {
                            tag: 0x05,
                            bytes: bytes
                        };
                    }
                },
                {
                    id: 0x06,
                    parser: function(bytes) {
                        return {
                            tag: 0x06,
                            bytes: bytes
                        };
                    }
                }, 
            ];
            var findBox1 = function findBox(bytes, paths, complete) {
                void 0 === complete && (complete = !1), paths = normalizePaths(paths), bytes = (0, byte_helpers.Ki)(bytes);
                var results = [];
                if (!paths.length) return results;
                for(var i = 0; i < bytes.length;){
                    var size = (bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3]) >>> 0, type = bytes.subarray(i + 4, i + 8);
                    if (0 === size) break;
                    var end = i + size;
                    if (end > bytes.length) {
                        if (complete) break;
                        end = bytes.length;
                    }
                    var data = bytes.subarray(i + 8, end);
                    (0, byte_helpers.G3)(type, paths[0]) && (1 === paths.length ? results.push(data) : results.push.apply(results, findBox(data, paths.slice(1), complete))), i = end;
                }
                return results;
            }, EBML_TAGS = {
                EBML: (0, byte_helpers.Ki)([
                    0x1a,
                    0x45,
                    0xdf,
                    0xa3, 
                ]),
                DocType: (0, byte_helpers.Ki)([
                    0x42,
                    0x82
                ]),
                Segment: (0, byte_helpers.Ki)([
                    0x18,
                    0x53,
                    0x80,
                    0x67, 
                ]),
                SegmentInfo: (0, byte_helpers.Ki)([
                    0x15,
                    0x49,
                    0xa9,
                    0x66, 
                ]),
                Tracks: (0, byte_helpers.Ki)([
                    0x16,
                    0x54,
                    0xae,
                    0x6b, 
                ]),
                Track: (0, byte_helpers.Ki)([
                    0xae
                ]),
                TrackNumber: (0, byte_helpers.Ki)([
                    0xd7
                ]),
                DefaultDuration: (0, byte_helpers.Ki)([
                    0x23,
                    0xe3,
                    0x83, 
                ]),
                TrackEntry: (0, byte_helpers.Ki)([
                    0xae
                ]),
                TrackType: (0, byte_helpers.Ki)([
                    0x83
                ]),
                FlagDefault: (0, byte_helpers.Ki)([
                    0x88
                ]),
                CodecID: (0, byte_helpers.Ki)([
                    0x86
                ]),
                CodecPrivate: (0, byte_helpers.Ki)([
                    0x63,
                    0xa2
                ]),
                VideoTrack: (0, byte_helpers.Ki)([
                    0xe0
                ]),
                AudioTrack: (0, byte_helpers.Ki)([
                    0xe1
                ]),
                Cluster: (0, byte_helpers.Ki)([
                    0x1f,
                    0x43,
                    0xb6,
                    0x75, 
                ]),
                Timestamp: (0, byte_helpers.Ki)([
                    0xe7
                ]),
                TimestampScale: (0, byte_helpers.Ki)([
                    0x2a,
                    0xd7,
                    0xb1, 
                ]),
                BlockGroup: (0, byte_helpers.Ki)([
                    0xa0
                ]),
                BlockDuration: (0, byte_helpers.Ki)([
                    0x9b
                ]),
                Block: (0, byte_helpers.Ki)([
                    0xa1
                ]),
                SimpleBlock: (0, byte_helpers.Ki)([
                    0xa3
                ])
            }, LENGTH_TABLE = [
                128,
                64,
                32,
                16,
                8,
                4,
                2,
                1
            ], getLength = function(byte) {
                for(var len = 1, i = 0; i < LENGTH_TABLE.length && !(byte & LENGTH_TABLE[i]); i++)len++;
                return len;
            }, getvint = function(bytes, offset, removeLength, signed) {
                void 0 === removeLength && (removeLength = !0), void 0 === signed && (signed = !1);
                var length = getLength(bytes[offset]), valueBytes = bytes.subarray(offset, offset + length);
                return removeLength && (valueBytes = Array.prototype.slice.call(bytes, offset, offset + length), valueBytes[0] ^= LENGTH_TABLE[length - 1]), {
                    length: length,
                    value: (0, byte_helpers.tm)(valueBytes, {
                        signed: signed
                    }),
                    bytes: valueBytes
                };
            }, ebml_helpers_normalizePath = function normalizePath(path) {
                return "string" == typeof path ? path.match(/.{1,2}/g).map(function(p) {
                    return normalizePath(p);
                }) : "number" == typeof path ? (0, byte_helpers.hL)(path) : path;
            }, getInfinityDataSize1 = function getInfinityDataSize(id, bytes, offset) {
                if (offset >= bytes.length) return bytes.length;
                var innerid = getvint(bytes, offset, !1);
                if ((0, byte_helpers.G3)(id.bytes, innerid.bytes)) return offset;
                var dataHeader = getvint(bytes, offset + innerid.length);
                return getInfinityDataSize(id, bytes, offset + dataHeader.length + dataHeader.value + innerid.length);
            }, findEbml1 = function findEbml(bytes, paths) {
                paths = (paths1 = paths, Array.isArray(paths1) ? paths1.map(function(p) {
                    return ebml_helpers_normalizePath(p);
                }) : [
                    ebml_helpers_normalizePath(paths1)
                ]), bytes = (0, byte_helpers.Ki)(bytes);
                var paths1, results = [];
                if (!paths.length) return results;
                for(var i = 0; i < bytes.length;){
                    var id = getvint(bytes, i, !1), dataHeader = getvint(bytes, i + id.length), dataStart = i + id.length + dataHeader.length;
                    0x7f === dataHeader.value && (dataHeader.value = getInfinityDataSize1(id, bytes, dataStart), dataHeader.value !== bytes.length && (dataHeader.value -= dataStart));
                    var dataEnd = dataStart + dataHeader.value > bytes.length ? bytes.length : dataStart + dataHeader.value, data = bytes.subarray(dataStart, dataEnd);
                    (0, byte_helpers.G3)(paths[0], id.bytes) && (1 === paths.length ? results.push(data) : results = results.concat(findEbml(data, paths.slice(1))));
                    var totalLength = id.length + dataHeader.length + data.length;
                    i += totalLength;
                }
                return results;
            }, id3_helpers = __webpack_require__(8925), NAL_TYPE_ONE = (0, byte_helpers.Ki)([
                0x00,
                0x00,
                0x00,
                0x01, 
            ]), NAL_TYPE_TWO = (0, byte_helpers.Ki)([
                0x00,
                0x00,
                0x01, 
            ]), EMULATION_PREVENTION = (0, byte_helpers.Ki)([
                0x00,
                0x00,
                0x03, 
            ]), discardEmulationPreventionBytes = function(bytes) {
                for(var positions = [], i = 1; i < bytes.length - 2;)(0, byte_helpers.G3)(bytes.subarray(i, i + 3), EMULATION_PREVENTION) && (positions.push(i + 2), i++), i++;
                if (0 === positions.length) return bytes;
                var newLength = bytes.length - positions.length, newData = new Uint8Array(newLength), sourceIndex = 0;
                for(i = 0; i < newLength; sourceIndex++, i++)sourceIndex === positions[0] && (sourceIndex++, positions.shift()), newData[i] = bytes[sourceIndex];
                return newData;
            }, findNal = function(bytes, dataType, types, nalLimit) {
                void 0 === nalLimit && (nalLimit = 1 / 0), bytes = (0, byte_helpers.Ki)(bytes), types = [].concat(types);
                for(var nalStart, i = 0, nalsFound = 0; i < bytes.length && (nalsFound < nalLimit || nalStart);){
                    var nalOffset = void 0;
                    if ((0, byte_helpers.G3)(bytes.subarray(i), NAL_TYPE_ONE) ? nalOffset = 4 : (0, byte_helpers.G3)(bytes.subarray(i), NAL_TYPE_TWO) && (nalOffset = 3), !nalOffset) {
                        i++;
                        continue;
                    }
                    if (nalsFound++, nalStart) return discardEmulationPreventionBytes(bytes.subarray(nalStart, i));
                    var nalType = void 0;
                    "h264" === dataType ? nalType = 0x1f & bytes[i + nalOffset] : "h265" === dataType && (nalType = bytes[i + nalOffset] >> 1 & 0x3f), -1 !== types.indexOf(nalType) && (nalStart = i + nalOffset), i += nalOffset + ("h264" === dataType ? 1 : 2);
                }
                return bytes.subarray(0, 0);
            }, CONSTANTS = {
                webm: (0, byte_helpers.Ki)([
                    0x77,
                    0x65,
                    0x62,
                    0x6d, 
                ]),
                matroska: (0, byte_helpers.Ki)([
                    0x6d,
                    0x61,
                    0x74,
                    0x72,
                    0x6f,
                    0x73,
                    0x6b,
                    0x61, 
                ]),
                flac: (0, byte_helpers.Ki)([
                    0x66,
                    0x4c,
                    0x61,
                    0x43, 
                ]),
                ogg: (0, byte_helpers.Ki)([
                    0x4f,
                    0x67,
                    0x67,
                    0x53, 
                ]),
                ac3: (0, byte_helpers.Ki)([
                    0x0b,
                    0x77
                ]),
                riff: (0, byte_helpers.Ki)([
                    0x52,
                    0x49,
                    0x46,
                    0x46, 
                ]),
                avi: (0, byte_helpers.Ki)([
                    0x41,
                    0x56,
                    0x49
                ]),
                wav: (0, byte_helpers.Ki)([
                    0x57,
                    0x41,
                    0x56,
                    0x45, 
                ]),
                "3gp": (0, byte_helpers.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x33,
                    0x67, 
                ]),
                mp4: (0, byte_helpers.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                fmp4: (0, byte_helpers.Ki)([
                    0x73,
                    0x74,
                    0x79,
                    0x70, 
                ]),
                mov: (0, byte_helpers.Ki)([
                    0x66,
                    0x74,
                    0x79,
                    0x70,
                    0x71,
                    0x74, 
                ]),
                moov: (0, byte_helpers.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x76, 
                ]),
                moof: (0, byte_helpers.Ki)([
                    0x6d,
                    0x6f,
                    0x6f,
                    0x66, 
                ])
            }, _isLikely = {
                aac: function(bytes) {
                    var offset = (0, id3_helpers.c)(bytes);
                    return (0, byte_helpers.G3)(bytes, [
                        0xff,
                        0x10
                    ], {
                        offset: offset,
                        mask: [
                            0xff,
                            0x16
                        ]
                    });
                },
                mp3: function(bytes) {
                    var offset = (0, id3_helpers.c)(bytes);
                    return (0, byte_helpers.G3)(bytes, [
                        0xff,
                        0x02
                    ], {
                        offset: offset,
                        mask: [
                            0xff,
                            0x06
                        ]
                    });
                },
                webm: function(bytes) {
                    var docType = findEbml1(bytes, [
                        EBML_TAGS.EBML,
                        EBML_TAGS.DocType, 
                    ])[0];
                    return (0, byte_helpers.G3)(docType, CONSTANTS.webm);
                },
                mkv: function(bytes) {
                    var docType = findEbml1(bytes, [
                        EBML_TAGS.EBML,
                        EBML_TAGS.DocType, 
                    ])[0];
                    return (0, byte_helpers.G3)(docType, CONSTANTS.matroska);
                },
                mp4: function(bytes) {
                    return !(_isLikely["3gp"](bytes) || _isLikely.mov(bytes)) && (!!((0, byte_helpers.G3)(bytes, CONSTANTS.mp4, {
                        offset: 4
                    }) || (0, byte_helpers.G3)(bytes, CONSTANTS.fmp4, {
                        offset: 4
                    })) || !!((0, byte_helpers.G3)(bytes, CONSTANTS.moof, {
                        offset: 4
                    }) || (0, byte_helpers.G3)(bytes, CONSTANTS.moov, {
                        offset: 4
                    })) || void 0);
                },
                mov: function(bytes) {
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.mov, {
                        offset: 4
                    });
                },
                "3gp": function(bytes) {
                    return (0, byte_helpers.G3)(bytes, CONSTANTS["3gp"], {
                        offset: 4
                    });
                },
                ac3: function(bytes) {
                    var offset = (0, id3_helpers.c)(bytes);
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.ac3, {
                        offset: offset
                    });
                },
                ts: function(bytes) {
                    if (bytes.length < 189 && bytes.length >= 1) return 0x47 === bytes[0];
                    for(var i = 0; i + 188 < bytes.length && i < 188;){
                        if (0x47 === bytes[i] && 0x47 === bytes[i + 188]) return !0;
                        i += 1;
                    }
                    return !1;
                },
                flac: function(bytes) {
                    var offset = (0, id3_helpers.c)(bytes);
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.flac, {
                        offset: offset
                    });
                },
                ogg: function(bytes) {
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.ogg);
                },
                avi: function(bytes) {
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.riff) && (0, byte_helpers.G3)(bytes, CONSTANTS.avi, {
                        offset: 8
                    });
                },
                wav: function(bytes) {
                    return (0, byte_helpers.G3)(bytes, CONSTANTS.riff) && (0, byte_helpers.G3)(bytes, CONSTANTS.wav, {
                        offset: 8
                    });
                },
                h264: function(bytes) {
                    return findNal(bytes, "h264", 7, 3).length;
                },
                h265: function(bytes) {
                    return findNal(bytes, "h265", [
                        32,
                        33
                    ], 3).length;
                }
            }, isLikelyTypes = Object.keys(_isLikely).filter(function(t) {
                return "ts" !== t && "h264" !== t && "h265" !== t;
            }).concat([
                "ts",
                "h264",
                "h265"
            ]);
            isLikelyTypes.forEach(function(type) {
                var isLikelyFn = _isLikely[type];
                _isLikely[type] = function(bytes) {
                    return isLikelyFn((0, byte_helpers.Ki)(bytes));
                };
            });
            var isLikely = _isLikely, detectContainerForBytes = function(bytes) {
                bytes = (0, byte_helpers.Ki)(bytes);
                for(var i = 0; i < isLikelyTypes.length; i++){
                    var type = isLikelyTypes[i];
                    if (isLikely[type](bytes)) return type;
                }
                return "";
            }, isLikelyFmp4MediaSegment = function(bytes) {
                return findBox1(bytes, [
                    "moof"
                ]).length > 0;
            };
        },
        6722: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return decodeB64ToUint8Array;
                }
            });
            var global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908), global_window__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__), Buffer = __webpack_require__(816).Buffer;
            function decodeB64ToUint8Array(b64Text) {
                for(var s, decodedString = (s = b64Text, global_window__WEBPACK_IMPORTED_MODULE_0___default().atob ? global_window__WEBPACK_IMPORTED_MODULE_0___default().atob(s) : Buffer.from(s, "base64").toString("binary")), array = new Uint8Array(decodedString.length), i = 0; i < decodedString.length; i++)array[i] = decodedString.charCodeAt(i);
                return array;
            }
        },
        8925: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                c: function() {
                    return getId3Offset1;
                }
            });
            var _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(562), ID3 = (0, _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__.Ki)([
                0x49,
                0x44,
                0x33, 
            ]), getId3Size = function(bytes, offset) {
                void 0 === offset && (offset = 0);
                var flags = (bytes = (0, _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__.Ki)(bytes))[offset + 5], returnSize = bytes[offset + 6] << 21 | bytes[offset + 7] << 14 | bytes[offset + 8] << 7 | bytes[offset + 9];
                return (16 & flags) >> 4 ? returnSize + 20 : returnSize + 10;
            }, getId3Offset1 = function getId3Offset(bytes, offset) {
                return (void 0 === offset && (offset = 0), (bytes = (0, _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__.Ki)(bytes)).length - offset < 10 || !(0, _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__.G3)(bytes, ID3, {
                    offset: offset
                })) ? offset : (offset += getId3Size(bytes, offset), getId3Offset(bytes, offset));
            };
        },
        8485: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                t: function() {
                    return simpleTypeFromSourceType;
                }
            });
            var MPEGURL_REGEX = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i, DASH_REGEX = /^application\/dash\+xml/i, simpleTypeFromSourceType = function(type) {
                return MPEGURL_REGEX.test(type) ? "hls" : DASH_REGEX.test(type) ? "dash" : "application/vnd.videojs.vhs+json" === type ? "vhs-json" : null;
            };
        },
        779: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9945), url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__), global_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8908), global_window__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_1__), DEFAULT_LOCATION = "http://example.com";
            __webpack_exports__.Z = function(baseUrl, relativeUrl) {
                if (/^[a-z]+:/i.test(relativeUrl)) return relativeUrl;
                /^data:/.test(baseUrl) && (baseUrl = global_window__WEBPACK_IMPORTED_MODULE_1___default().location && global_window__WEBPACK_IMPORTED_MODULE_1___default().location.href || "");
                var nativeURL = "function" == typeof global_window__WEBPACK_IMPORTED_MODULE_1___default().URL, protocolLess = /^\/\//.test(baseUrl), removeLocation = !global_window__WEBPACK_IMPORTED_MODULE_1___default().location && !/\/\//i.test(baseUrl);
                if (nativeURL ? baseUrl = new (global_window__WEBPACK_IMPORTED_MODULE_1___default()).URL(baseUrl, global_window__WEBPACK_IMPORTED_MODULE_1___default().location || DEFAULT_LOCATION) : /\/\//i.test(baseUrl) || (baseUrl = url_toolkit__WEBPACK_IMPORTED_MODULE_0___default().buildAbsoluteURL(global_window__WEBPACK_IMPORTED_MODULE_1___default().location && global_window__WEBPACK_IMPORTED_MODULE_1___default().location.href || "", baseUrl)), nativeURL) {
                    var newUrl = new URL(relativeUrl, baseUrl);
                    return removeLocation ? newUrl.href.slice(DEFAULT_LOCATION.length) : protocolLess ? newUrl.href.slice(newUrl.protocol.length) : newUrl.href;
                }
                return url_toolkit__WEBPACK_IMPORTED_MODULE_0___default().buildAbsoluteURL(baseUrl, relativeUrl);
            };
        },
        3490: function(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            var window = __webpack_require__(8908);
            module.exports = function(callback, decodeResponseBody) {
                return void 0 === decodeResponseBody && (decodeResponseBody = !1), function(err, response, responseBody) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (response.statusCode >= 400 && response.statusCode <= 599) {
                        var cause = responseBody;
                        if (decodeResponseBody) {
                            if (window.TextDecoder) {
                                var contentTypeHeader, charset1 = (void 0 === (contentTypeHeader = response.headers && response.headers["content-type"]) && (contentTypeHeader = ""), contentTypeHeader.toLowerCase().split(";").reduce(function(charset, contentType) {
                                    var _contentType$split = contentType.split("="), type = _contentType$split[0], value = _contentType$split[1];
                                    return "charset" === type.trim() ? value.trim() : charset;
                                }, "utf-8"));
                                try {
                                    cause = new TextDecoder(charset1).decode(responseBody);
                                } catch (e) {}
                            } else cause = String.fromCharCode.apply(null, new Uint8Array(responseBody));
                        }
                        callback({
                            cause: cause
                        });
                        return;
                    }
                    callback(null, responseBody);
                };
            };
        },
        9603: function(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            var window = __webpack_require__(8908), _extends = __webpack_require__(7154), isFunction = __webpack_require__(7376);
            createXHR.httpHandler = __webpack_require__(3490);
            var parseHeaders = function(headers) {
                var result = {};
                return headers && headers.trim().split("\n").forEach(function(row) {
                    var index = row.indexOf(":"), key = row.slice(0, index).trim().toLowerCase(), value = row.slice(index + 1).trim();
                    void 0 === result[key] ? result[key] = value : Array.isArray(result[key]) ? result[key].push(value) : result[key] = [
                        result[key],
                        value
                    ];
                }), result;
            };
            function initParams(uri, options, callback) {
                var params = uri;
                return isFunction(options) ? (callback = options, "string" == typeof uri && (params = {
                    uri: uri
                })) : params = _extends({}, options, {
                    uri: uri
                }), params.callback = callback, params;
            }
            function createXHR(uri, options, callback) {
                return _createXHR(options = initParams(uri, options, callback));
            }
            function _createXHR(options) {
                if (void 0 === options.callback) throw new Error("callback argument missing");
                var key, aborted, timeoutTimer, called = !1, callback = function(err, response, body) {
                    called || (called = !0, options.callback(err, response, body));
                };
                function errorFunc(evt) {
                    return clearTimeout(timeoutTimer), evt instanceof Error || (evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"))), evt.statusCode = 0, callback(evt, failureResponse);
                }
                function loadFunc() {
                    if (!aborted) {
                        clearTimeout(timeoutTimer);
                        var status, response = failureResponse, err = null;
                        return 0 !== (status = options.useXDR && void 0 === xhr.status ? 200 : 1223 === xhr.status ? 204 : xhr.status) ? (response = {
                            body: function() {
                                var body = void 0;
                                if (body = xhr.response ? xhr.response : xhr.responseText || getXml(xhr), isJson) try {
                                    body = JSON.parse(body);
                                } catch (e) {}
                                return body;
                            }(),
                            statusCode: status,
                            method: method,
                            headers: {},
                            url: uri,
                            rawRequest: xhr
                        }, xhr.getAllResponseHeaders && (response.headers = parseHeaders(xhr.getAllResponseHeaders()))) : err = new Error("Internal XMLHttpRequest Error"), callback(err, response, response.body);
                    }
                }
                var xhr = options.xhr || null;
                xhr || (xhr = options.cors || options.useXDR ? new createXHR.XDomainRequest() : new createXHR.XMLHttpRequest());
                var uri = xhr.url = options.uri || options.url, method = xhr.method = options.method || "GET", body1 = options.body || options.data, headers = xhr.headers = options.headers || {}, sync = !!options.sync, isJson = !1, failureResponse = {
                    body: void 0,
                    headers: {},
                    statusCode: 0,
                    method: method,
                    url: uri,
                    rawRequest: xhr
                };
                if ("json" in options && !1 !== options.json && (isJson = !0, headers.accept || headers.Accept || (headers.Accept = "application/json"), "GET" !== method && "HEAD" !== method && (headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json"), body1 = JSON.stringify(!0 === options.json ? body1 : options.json))), xhr.onreadystatechange = function() {
                    4 === xhr.readyState && setTimeout(loadFunc, 0);
                }, xhr.onload = loadFunc, xhr.onerror = errorFunc, xhr.onprogress = function() {}, xhr.onabort = function() {
                    aborted = !0;
                }, xhr.ontimeout = errorFunc, xhr.open(method, uri, !sync, options.username, options.password), sync || (xhr.withCredentials = !!options.withCredentials), !sync && options.timeout > 0 && (timeoutTimer = setTimeout(function() {
                    if (!aborted) {
                        aborted = !0, xhr.abort("timeout");
                        var e = new Error("XMLHttpRequest timeout");
                        e.code = "ETIMEDOUT", errorFunc(e);
                    }
                }, options.timeout)), xhr.setRequestHeader) for(key in headers)headers.hasOwnProperty(key) && xhr.setRequestHeader(key, headers[key]);
                else if (options.headers && !function(obj) {
                    for(var i in obj)if (obj.hasOwnProperty(i)) return !1;
                    return !0;
                }(options.headers)) throw new Error("Headers cannot be set on an XDomainRequest object");
                return "responseType" in options && (xhr.responseType = options.responseType), "beforeSend" in options && "function" == typeof options.beforeSend && options.beforeSend(xhr), xhr.send(body1 || null), xhr;
            }
            function getXml(xhr) {
                try {
                    if ("document" === xhr.responseType) return xhr.responseXML;
                    var firefoxBugTakenEffect = xhr.responseXML && "parsererror" === xhr.responseXML.documentElement.nodeName;
                    if ("" === xhr.responseType && !firefoxBugTakenEffect) return xhr.responseXML;
                } catch (e) {}
                return null;
            }
            module.exports = createXHR, module.exports.default = createXHR, createXHR.XMLHttpRequest = window.XMLHttpRequest || function() {}, createXHR.XDomainRequest = "withCredentials" in new createXHR.XMLHttpRequest() ? createXHR.XMLHttpRequest : window.XDomainRequest, function(array, iterator) {
                for(var i = 0; i < array.length; i++)iterator(array[i]);
            }([
                "get",
                "put",
                "post",
                "patch",
                "head",
                "delete"
            ], function(method) {
                createXHR["delete" === method ? "del" : method] = function(uri, options, callback) {
                    return (options = initParams(uri, options, callback)).method = method.toUpperCase(), _createXHR(options);
                };
            });
        },
        2167: function(__unused_webpack_module, exports) {
            "use strict";
            function freeze(object, oc) {
                return void 0 === oc && (oc = Object), oc && "function" == typeof oc.freeze ? oc.freeze(object) : object;
            }
            var MIME_TYPE = freeze({
                HTML: "text/html",
                isHTML: function(value) {
                    return value === MIME_TYPE.HTML;
                },
                XML_APPLICATION: "application/xml",
                XML_TEXT: "text/xml",
                XML_XHTML_APPLICATION: "application/xhtml+xml",
                XML_SVG_IMAGE: "image/svg+xml"
            }), NAMESPACE = freeze({
                HTML: "http://www.w3.org/1999/xhtml",
                isHTML: function(uri) {
                    return uri === NAMESPACE.HTML;
                },
                SVG: "http://www.w3.org/2000/svg",
                XML: "http://www.w3.org/XML/1998/namespace",
                XMLNS: "http://www.w3.org/2000/xmlns/"
            });
            exports.freeze = freeze, exports.MIME_TYPE = MIME_TYPE, exports.NAMESPACE = NAMESPACE;
        },
        6129: function(__unused_webpack_module, exports, __webpack_require__) {
            var conventions = __webpack_require__(2167), dom = __webpack_require__(1146), entities = __webpack_require__(1045), sax1 = __webpack_require__(6925), DOMImplementation = dom.DOMImplementation, NAMESPACE = conventions.NAMESPACE, ParseError = sax1.ParseError, XMLReader = sax1.XMLReader;
            function DOMParser(options) {
                this.options = options || {
                    locator: {}
                };
            }
            function DOMHandler() {
                this.cdata = !1;
            }
            function position(locator, node) {
                node.lineNumber = locator.lineNumber, node.columnNumber = locator.columnNumber;
            }
            function _locator(l) {
                if (l) return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
            }
            function _toString(chars, start, length) {
                return "string" == typeof chars ? chars.substr(start, length) : chars.length >= start + length || start ? new java.lang.String(chars, start, length) + "" : chars;
            }
            function appendElement(hander, node) {
                hander.currentElement ? hander.currentElement.appendChild(node) : hander.doc.appendChild(node);
            }
            DOMParser.prototype.parseFromString = function(source, mimeType) {
                var options = this.options, sax = new XMLReader(), domBuilder1 = options.domBuilder || new DOMHandler(), errorHandler1 = options.errorHandler, locator1 = options.locator, defaultNSMap = options.xmlns || {}, isHTML = /\/x?html?$/.test(mimeType), entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
                return locator1 && domBuilder1.setDocumentLocator(locator1), sax.errorHandler = function(errorImpl, domBuilder, locator) {
                    if (!errorImpl) {
                        if (domBuilder instanceof DOMHandler) return domBuilder;
                        errorImpl = domBuilder;
                    }
                    var errorHandler = {}, isCallback = errorImpl instanceof Function;
                    function build(key) {
                        var fn = errorImpl[key];
                        !fn && isCallback && (fn = 2 == errorImpl.length ? function(msg) {
                            errorImpl(key, msg);
                        } : errorImpl), errorHandler[key] = fn && function(msg) {
                            fn("[xmldom " + key + "]\t" + msg + _locator(locator));
                        } || function() {};
                    }
                    return locator = locator || {}, build("warning"), build("error"), build("fatalError"), errorHandler;
                }(errorHandler1, domBuilder1, locator1), sax.domBuilder = options.domBuilder || domBuilder1, isHTML && (defaultNSMap[""] = NAMESPACE.HTML), defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML, source && "string" == typeof source ? sax.parse(source, defaultNSMap, entityMap) : sax.errorHandler.error("invalid doc source"), domBuilder1.doc;
            }, DOMHandler.prototype = {
                startDocument: function() {
                    this.doc = new DOMImplementation().createDocument(null, null, null), this.locator && (this.doc.documentURI = this.locator.systemId);
                },
                startElement: function(namespaceURI, localName, qName, attrs) {
                    var doc = this.doc, el = doc.createElementNS(namespaceURI, qName || localName), len = attrs.length;
                    appendElement(this, el), this.currentElement = el, this.locator && position(this.locator, el);
                    for(var i = 0; i < len; i++){
                        var namespaceURI = attrs.getURI(i), value = attrs.getValue(i), qName = attrs.getQName(i), attr = doc.createAttributeNS(namespaceURI, qName);
                        this.locator && position(attrs.getLocator(i), attr), attr.value = attr.nodeValue = value, el.setAttributeNode(attr);
                    }
                },
                endElement: function(namespaceURI, localName, qName) {
                    var current = this.currentElement;
                    current.tagName, this.currentElement = current.parentNode;
                },
                startPrefixMapping: function(prefix, uri) {},
                endPrefixMapping: function(prefix) {},
                processingInstruction: function(target, data) {
                    var ins = this.doc.createProcessingInstruction(target, data);
                    this.locator && position(this.locator, ins), appendElement(this, ins);
                },
                ignorableWhitespace: function(ch, start, length) {},
                characters: function(chars, start, length) {
                    if (chars = _toString.apply(this, arguments)) {
                        if (this.cdata) var charNode = this.doc.createCDATASection(chars);
                        else var charNode = this.doc.createTextNode(chars);
                        this.currentElement ? this.currentElement.appendChild(charNode) : /^\s*$/.test(chars) && this.doc.appendChild(charNode), this.locator && position(this.locator, charNode);
                    }
                },
                skippedEntity: function(name) {},
                endDocument: function() {
                    this.doc.normalize();
                },
                setDocumentLocator: function(locator) {
                    (this.locator = locator) && (locator.lineNumber = 0);
                },
                comment: function(chars, start, length) {
                    chars = _toString.apply(this, arguments);
                    var comm = this.doc.createComment(chars);
                    this.locator && position(this.locator, comm), appendElement(this, comm);
                },
                startCDATA: function() {
                    this.cdata = !0;
                },
                endCDATA: function() {
                    this.cdata = !1;
                },
                startDTD: function(name, publicId, systemId) {
                    var impl = this.doc.implementation;
                    if (impl && impl.createDocumentType) {
                        var dt = impl.createDocumentType(name, publicId, systemId);
                        this.locator && position(this.locator, dt), appendElement(this, dt), this.doc.doctype = dt;
                    }
                },
                warning: function(error) {
                    console.warn("[xmldom warning]\t" + error, _locator(this.locator));
                },
                error: function(error) {
                    console.error("[xmldom error]\t" + error, _locator(this.locator));
                },
                fatalError: function(error) {
                    throw new ParseError(error, this.locator);
                }
            }, "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
                DOMHandler.prototype[key] = function() {
                    return null;
                };
            }), exports.DOMParser = DOMParser, dom.DOMImplementation, dom.XMLSerializer;
        },
        1146: function(__unused_webpack_module, exports, __webpack_require__) {
            var NAMESPACE = __webpack_require__(2167).NAMESPACE;
            function notEmptyString(input) {
                return "" !== input;
            }
            function orderedSetReducer(current, element) {
                return current.hasOwnProperty(element) || (current[element] = !0), current;
            }
            function toOrderedSet(input) {
                if (!input) return [];
                var input1, list = (input1 = input) ? input1.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
                return Object.keys(list.reduce(orderedSetReducer, {}));
            }
            function copy(src, dest) {
                for(var p in src)dest[p] = src[p];
            }
            function _extends(Class, Super) {
                var pt = Class.prototype;
                if (!(pt instanceof Super)) {
                    function t() {}
                    t.prototype = Super.prototype, copy(pt, t = new t()), Class.prototype = pt = t;
                }
                pt.constructor != Class && ("function" != typeof Class && console.error("unknown Class:" + Class), pt.constructor = Class);
            }
            var NodeType = {}, ELEMENT_NODE = NodeType.ELEMENT_NODE = 1, ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2, TEXT_NODE = NodeType.TEXT_NODE = 3, CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4, ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5, ENTITY_NODE = NodeType.ENTITY_NODE = 6, PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7, COMMENT_NODE = NodeType.COMMENT_NODE = 8, DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9, DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10, DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11, NOTATION_NODE = NodeType.NOTATION_NODE = 12, ExceptionCode = {}, ExceptionMessage = {};
            ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1), ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
            var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
            ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4), ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5), ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6), ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
            var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
            ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
            var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
            function DOMException(code, message) {
                if (message instanceof Error) var error = message;
                else error = this, Error.call(this, ExceptionMessage[code]), this.message = ExceptionMessage[code], Error.captureStackTrace && Error.captureStackTrace(this, DOMException);
                return error.code = code, message && (this.message = this.message + ": " + message), error;
            }
            function NodeList() {}
            function LiveNodeList(node, refresh) {
                this._node = node, this._refresh = refresh, _updateLiveList(this);
            }
            function _updateLiveList(list) {
                var inc = list._node._inc || list._node.ownerDocument._inc;
                if (list._inc != inc) {
                    var ls = list._refresh(list._node);
                    __set__(list, "length", ls.length), copy(ls, list), list._inc = inc;
                }
            }
            function NamedNodeMap() {}
            function _findNodeIndex(list, node) {
                for(var i = list.length; i--;)if (list[i] === node) return i;
            }
            function _addNamedNode(el, list, newAttr, oldAttr) {
                if (oldAttr ? list[_findNodeIndex(list, oldAttr)] = newAttr : list[list.length++] = newAttr, el) {
                    newAttr.ownerElement = el;
                    var doc = el.ownerDocument;
                    doc && (oldAttr && _onRemoveAttribute(doc, el, oldAttr), _onAddAttribute(doc, el, newAttr));
                }
            }
            function _removeNamedNode(el, list, attr) {
                var i = _findNodeIndex(list, attr);
                if (i >= 0) {
                    for(var lastIndex = list.length - 1; i < lastIndex;)list[i] = list[++i];
                    if (list.length = lastIndex, el) {
                        var doc = el.ownerDocument;
                        doc && (_onRemoveAttribute(doc, el, attr), attr.ownerElement = null);
                    }
                } else throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + "@" + attr));
            }
            function DOMImplementation() {}
            function Node() {}
            function _xmlEncoder(c) {
                return "<" == c && "&lt;" || ">" == c && "&gt;" || "&" == c && "&amp;" || '"' == c && "&quot;" || "&#" + c.charCodeAt() + ";";
            }
            function _visitNode(node, callback) {
                if (callback(node)) return !0;
                if (node = node.firstChild) do if (_visitNode(node, callback)) return !0;
                while (node = node.nextSibling)
            }
            function Document() {}
            function _onAddAttribute(doc, el, newAttr) {
                doc && doc._inc++, newAttr.namespaceURI === NAMESPACE.XMLNS && (el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value);
            }
            function _onRemoveAttribute(doc, el, newAttr, remove) {
                doc && doc._inc++, newAttr.namespaceURI === NAMESPACE.XMLNS && delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
            }
            function _onUpdateChild(doc, el, newChild) {
                if (doc && doc._inc) {
                    doc._inc++;
                    var cs = el.childNodes;
                    if (newChild) cs[cs.length++] = newChild;
                    else {
                        for(var child = el.firstChild, i = 0; child;)cs[i++] = child, child = child.nextSibling;
                        cs.length = i;
                    }
                }
            }
            function _removeChild(parentNode, child) {
                var previous = child.previousSibling, next = child.nextSibling;
                return previous ? previous.nextSibling = next : parentNode.firstChild = next, next ? next.previousSibling = previous : parentNode.lastChild = previous, _onUpdateChild(parentNode.ownerDocument, parentNode), child;
            }
            function _insertBefore(parentNode, newChild, nextChild) {
                var cp = newChild.parentNode;
                if (cp && cp.removeChild(newChild), newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
                    var newFirst = newChild.firstChild;
                    if (null == newFirst) return newChild;
                    var newLast = newChild.lastChild;
                } else newFirst = newLast = newChild;
                var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;
                newFirst.previousSibling = pre, newLast.nextSibling = nextChild, pre ? pre.nextSibling = newFirst : parentNode.firstChild = newFirst, null == nextChild ? parentNode.lastChild = newLast : nextChild.previousSibling = newLast;
                do newFirst.parentNode = parentNode;
                while (newFirst !== newLast && (newFirst = newFirst.nextSibling))
                return _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode), newChild.nodeType == DOCUMENT_FRAGMENT_NODE && (newChild.firstChild = newChild.lastChild = null), newChild;
            }
            function Element() {
                this._nsMap = {};
            }
            function Attr() {}
            function CharacterData() {}
            function Text() {}
            function Comment() {}
            function CDATASection() {}
            function DocumentType() {}
            function Notation() {}
            function Entity() {}
            function EntityReference() {}
            function DocumentFragment() {}
            function ProcessingInstruction() {}
            function XMLSerializer() {}
            function nodeSerializeToString(isHtml, nodeFilter) {
                var buf = [], refNode = 9 == this.nodeType && this.documentElement || this, prefix = refNode.prefix, uri = refNode.namespaceURI;
                if (uri && null == prefix) {
                    var prefix = refNode.lookupPrefix(uri);
                    if (null == prefix) var visibleNamespaces = [
                        {
                            namespace: uri,
                            prefix: null
                        }
                    ];
                }
                return serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces), buf.join("");
            }
            function needNamespaceDefine(node, isHTML, visibleNamespaces) {
                var prefix = node.prefix || "", uri = node.namespaceURI;
                if (!uri) return !1;
                if ("xml" === prefix && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) return !1;
                for(var i = visibleNamespaces.length; i--;){
                    var ns = visibleNamespaces[i];
                    if (ns.prefix === prefix) return ns.namespace !== uri;
                }
                return !0;
            }
            function addSerializedAttribute(buf, qualifiedName, value) {
                buf.push(" ", qualifiedName, '="', value.replace(/[<&"]/g, _xmlEncoder), '"');
            }
            function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
                if (visibleNamespaces || (visibleNamespaces = []), nodeFilter) {
                    if (!(node = nodeFilter(node))) return;
                    if ("string" == typeof node) {
                        buf.push(node);
                        return;
                    }
                }
                switch(node.nodeType){
                    case ELEMENT_NODE:
                        var defaultNS, attrs = node.attributes, len = attrs.length, child = node.firstChild, nodeName = node.tagName;
                        isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;
                        var prefixedNodeName = nodeName;
                        if (!isHTML && !node.prefix && node.namespaceURI) {
                            for(var ai = 0; ai < attrs.length; ai++)if ("xmlns" === attrs.item(ai).name) {
                                defaultNS = attrs.item(ai).value;
                                break;
                            }
                            if (!defaultNS) for(var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--){
                                var namespace = visibleNamespaces[nsi];
                                if ("" === namespace.prefix && namespace.namespace === node.namespaceURI) {
                                    defaultNS = namespace.namespace;
                                    break;
                                }
                            }
                            if (defaultNS !== node.namespaceURI) for(var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--){
                                var namespace = visibleNamespaces[nsi];
                                if (namespace.namespace === node.namespaceURI) {
                                    namespace.prefix && (prefixedNodeName = namespace.prefix + ":" + nodeName);
                                    break;
                                }
                            }
                        }
                        buf.push("<", prefixedNodeName);
                        for(var i = 0; i < len; i++){
                            var attr = attrs.item(i);
                            "xmlns" == attr.prefix ? visibleNamespaces.push({
                                prefix: attr.localName,
                                namespace: attr.value
                            }) : "xmlns" == attr.nodeName && visibleNamespaces.push({
                                prefix: "",
                                namespace: attr.value
                            });
                        }
                        for(var i = 0; i < len; i++){
                            var attr = attrs.item(i);
                            if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                                var prefix = attr.prefix || "", uri = attr.namespaceURI;
                                addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri), visibleNamespaces.push({
                                    prefix: prefix,
                                    namespace: uri
                                });
                            }
                            serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
                        }
                        if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
                            var prefix = node.prefix || "", uri = node.namespaceURI;
                            addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri), visibleNamespaces.push({
                                prefix: prefix,
                                namespace: uri
                            });
                        }
                        if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
                            if (buf.push(">"), isHTML && /^script$/i.test(nodeName)) for(; child;)child.data ? buf.push(child.data) : serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice()), child = child.nextSibling;
                            else for(; child;)serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice()), child = child.nextSibling;
                            buf.push("</", prefixedNodeName, ">");
                        } else buf.push("/>");
                        return;
                    case DOCUMENT_NODE:
                    case DOCUMENT_FRAGMENT_NODE:
                        for(var child = node.firstChild; child;)serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice()), child = child.nextSibling;
                        return;
                    case ATTRIBUTE_NODE:
                        return addSerializedAttribute(buf, node.name, node.value);
                    case TEXT_NODE:
                        return buf.push(node.data.replace(/[<&]/g, _xmlEncoder).replace(/]]>/g, "]]&gt;"));
                    case CDATA_SECTION_NODE:
                        return buf.push("<![CDATA[", node.data, "]]>");
                    case COMMENT_NODE:
                        return buf.push("<!--", node.data, "-->");
                    case DOCUMENT_TYPE_NODE:
                        var pubid = node.publicId, sysid = node.systemId;
                        if (buf.push("<!DOCTYPE ", node.name), pubid) buf.push(" PUBLIC ", pubid), sysid && "." != sysid && buf.push(" ", sysid), buf.push(">");
                        else if (sysid && "." != sysid) buf.push(" SYSTEM ", sysid, ">");
                        else {
                            var sub = node.internalSubset;
                            sub && buf.push(" [", sub, "]"), buf.push(">");
                        }
                        return;
                    case PROCESSING_INSTRUCTION_NODE:
                        return buf.push("<?", node.target, " ", node.data, "?>");
                    case ENTITY_REFERENCE_NODE:
                        return buf.push("&", node.nodeName, ";");
                    default:
                        buf.push("??", node.nodeName);
                }
            }
            function importNode(doc, node, deep) {
                var node2;
                switch(node.nodeType){
                    case ELEMENT_NODE:
                        (node2 = node.cloneNode(!1)).ownerDocument = doc;
                    case DOCUMENT_FRAGMENT_NODE:
                        break;
                    case ATTRIBUTE_NODE:
                        deep = !0;
                }
                if (node2 || (node2 = node.cloneNode(!1)), node2.ownerDocument = doc, node2.parentNode = null, deep) for(var child = node.firstChild; child;)node2.appendChild(importNode(doc, child, deep)), child = child.nextSibling;
                return node2;
            }
            function cloneNode(doc, node, deep) {
                var node2 = new node.constructor();
                for(var n in node){
                    var v = node[n];
                    "object" != typeof v && v != node2[n] && (node2[n] = v);
                }
                switch(node.childNodes && (node2.childNodes = new NodeList()), node2.ownerDocument = doc, node2.nodeType){
                    case ELEMENT_NODE:
                        var attrs = node.attributes, attrs2 = node2.attributes = new NamedNodeMap(), len = attrs.length;
                        attrs2._ownerElement = node2;
                        for(var i = 0; i < len; i++)node2.setAttributeNode(cloneNode(doc, attrs.item(i), !0));
                        break;
                    case ATTRIBUTE_NODE:
                        deep = !0;
                }
                if (deep) for(var child = node.firstChild; child;)node2.appendChild(cloneNode(doc, child, deep)), child = child.nextSibling;
                return node2;
            }
            function __set__(object, key, value) {
                object[key] = value;
            }
            ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11), ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12), ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13), ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14), ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15), DOMException.prototype = Error.prototype, copy(ExceptionCode, DOMException), NodeList.prototype = {
                length: 0,
                item: function(index) {
                    return this[index] || null;
                },
                toString: function(isHTML, nodeFilter) {
                    for(var buf = [], i = 0; i < this.length; i++)serializeToString(this[i], buf, isHTML, nodeFilter);
                    return buf.join("");
                }
            }, LiveNodeList.prototype.item = function(i) {
                return _updateLiveList(this), this[i];
            }, _extends(LiveNodeList, NodeList), NamedNodeMap.prototype = {
                length: 0,
                item: NodeList.prototype.item,
                getNamedItem: function(key) {
                    for(var i = this.length; i--;){
                        var attr = this[i];
                        if (attr.nodeName == key) return attr;
                    }
                },
                setNamedItem: function(attr) {
                    var el = attr.ownerElement;
                    if (el && el != this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR);
                    var oldAttr = this.getNamedItem(attr.nodeName);
                    return _addNamedNode(this._ownerElement, this, attr, oldAttr), oldAttr;
                },
                setNamedItemNS: function(attr) {
                    var oldAttr, el = attr.ownerElement;
                    if (el && el != this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR);
                    return oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName), _addNamedNode(this._ownerElement, this, attr, oldAttr), oldAttr;
                },
                removeNamedItem: function(key) {
                    var attr = this.getNamedItem(key);
                    return _removeNamedNode(this._ownerElement, this, attr), attr;
                },
                removeNamedItemNS: function(namespaceURI, localName) {
                    var attr = this.getNamedItemNS(namespaceURI, localName);
                    return _removeNamedNode(this._ownerElement, this, attr), attr;
                },
                getNamedItemNS: function(namespaceURI, localName) {
                    for(var i = this.length; i--;){
                        var node = this[i];
                        if (node.localName == localName && node.namespaceURI == namespaceURI) return node;
                    }
                    return null;
                }
            }, DOMImplementation.prototype = {
                hasFeature: function(feature, version) {
                    return !0;
                },
                createDocument: function(namespaceURI, qualifiedName, doctype) {
                    var doc = new Document();
                    if (doc.implementation = this, doc.childNodes = new NodeList(), doc.doctype = doctype || null, doctype && doc.appendChild(doctype), qualifiedName) {
                        var root = doc.createElementNS(namespaceURI, qualifiedName);
                        doc.appendChild(root);
                    }
                    return doc;
                },
                createDocumentType: function(qualifiedName, publicId, systemId) {
                    var node = new DocumentType();
                    return node.name = qualifiedName, node.nodeName = qualifiedName, node.publicId = publicId || "", node.systemId = systemId || "", node;
                }
            }, Node.prototype = {
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
                insertBefore: function(newChild, refChild) {
                    return _insertBefore(this, newChild, refChild);
                },
                replaceChild: function(newChild, oldChild) {
                    this.insertBefore(newChild, oldChild), oldChild && this.removeChild(oldChild);
                },
                removeChild: function(oldChild) {
                    return _removeChild(this, oldChild);
                },
                appendChild: function(newChild) {
                    return this.insertBefore(newChild, null);
                },
                hasChildNodes: function() {
                    return null != this.firstChild;
                },
                cloneNode: function(deep) {
                    return cloneNode(this.ownerDocument || this, this, deep);
                },
                normalize: function() {
                    for(var child = this.firstChild; child;){
                        var next = child.nextSibling;
                        next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE ? (this.removeChild(next), child.appendData(next.data)) : (child.normalize(), child = next);
                    }
                },
                isSupported: function(feature, version) {
                    return this.ownerDocument.implementation.hasFeature(feature, version);
                },
                hasAttributes: function() {
                    return this.attributes.length > 0;
                },
                lookupPrefix: function(namespaceURI) {
                    for(var el = this; el;){
                        var map = el._nsMap;
                        if (map) {
                            for(var n in map)if (map[n] == namespaceURI) return n;
                        }
                        el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function(prefix) {
                    for(var el = this; el;){
                        var map = el._nsMap;
                        if (map && prefix in map) return map[prefix];
                        el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function(namespaceURI) {
                    return null == this.lookupPrefix(namespaceURI);
                }
            }, copy(NodeType, Node), copy(NodeType, Node.prototype), Document.prototype = {
                nodeName: "#document",
                nodeType: DOCUMENT_NODE,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function(newChild, refChild) {
                    if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
                        for(var child = newChild.firstChild; child;){
                            var next = child.nextSibling;
                            this.insertBefore(child, refChild), child = next;
                        }
                        return newChild;
                    }
                    return null == this.documentElement && newChild.nodeType == ELEMENT_NODE && (this.documentElement = newChild), _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
                },
                removeChild: function(oldChild) {
                    return this.documentElement == oldChild && (this.documentElement = null), _removeChild(this, oldChild);
                },
                importNode: function(importedNode, deep) {
                    return importNode(this, importedNode, deep);
                },
                getElementById: function(id) {
                    var rtv = null;
                    return _visitNode(this.documentElement, function(node) {
                        if (node.nodeType == ELEMENT_NODE && node.getAttribute("id") == id) return rtv = node, !0;
                    }), rtv;
                },
                getElementsByClassName: function(classNames) {
                    var classNamesSet = toOrderedSet(classNames);
                    return new LiveNodeList(this, function(base) {
                        var ls = [];
                        return classNamesSet.length > 0 && _visitNode(base.documentElement, function(node) {
                            if (node !== base && node.nodeType === ELEMENT_NODE) {
                                var nodeClassNames = node.getAttribute("class");
                                if (nodeClassNames) {
                                    var matches = classNames === nodeClassNames;
                                    if (!matches) {
                                        var list, nodeClassNamesSet = toOrderedSet(nodeClassNames);
                                        matches = classNamesSet.every((list = nodeClassNamesSet, function(element) {
                                            return list && -1 !== list.indexOf(element);
                                        }));
                                    }
                                    matches && ls.push(node);
                                }
                            }
                        }), ls;
                    });
                },
                createElement: function(tagName) {
                    var node = new Element();
                    return node.ownerDocument = this, node.nodeName = tagName, node.tagName = tagName, node.localName = tagName, node.childNodes = new NodeList(), (node.attributes = new NamedNodeMap())._ownerElement = node, node;
                },
                createDocumentFragment: function() {
                    var node = new DocumentFragment();
                    return node.ownerDocument = this, node.childNodes = new NodeList(), node;
                },
                createTextNode: function(data) {
                    var node = new Text();
                    return node.ownerDocument = this, node.appendData(data), node;
                },
                createComment: function(data) {
                    var node = new Comment();
                    return node.ownerDocument = this, node.appendData(data), node;
                },
                createCDATASection: function(data) {
                    var node = new CDATASection();
                    return node.ownerDocument = this, node.appendData(data), node;
                },
                createProcessingInstruction: function(target, data) {
                    var node = new ProcessingInstruction();
                    return node.ownerDocument = this, node.tagName = node.target = target, node.nodeValue = node.data = data, node;
                },
                createAttribute: function(name) {
                    var node = new Attr();
                    return node.ownerDocument = this, node.name = name, node.nodeName = name, node.localName = name, node.specified = !0, node;
                },
                createEntityReference: function(name) {
                    var node = new EntityReference();
                    return node.ownerDocument = this, node.nodeName = name, node;
                },
                createElementNS: function(namespaceURI, qualifiedName) {
                    var node = new Element(), pl = qualifiedName.split(":"), attrs = node.attributes = new NamedNodeMap();
                    return node.childNodes = new NodeList(), node.ownerDocument = this, node.nodeName = qualifiedName, node.tagName = qualifiedName, node.namespaceURI = namespaceURI, 2 == pl.length ? (node.prefix = pl[0], node.localName = pl[1]) : node.localName = qualifiedName, attrs._ownerElement = node, node;
                },
                createAttributeNS: function(namespaceURI, qualifiedName) {
                    var node = new Attr(), pl = qualifiedName.split(":");
                    return node.ownerDocument = this, node.nodeName = qualifiedName, node.name = qualifiedName, node.namespaceURI = namespaceURI, node.specified = !0, 2 == pl.length ? (node.prefix = pl[0], node.localName = pl[1]) : node.localName = qualifiedName, node;
                }
            }, _extends(Document, Node), Element.prototype = {
                nodeType: ELEMENT_NODE,
                hasAttribute: function(name) {
                    return null != this.getAttributeNode(name);
                },
                getAttribute: function(name) {
                    var attr = this.getAttributeNode(name);
                    return attr && attr.value || "";
                },
                getAttributeNode: function(name) {
                    return this.attributes.getNamedItem(name);
                },
                setAttribute: function(name, value) {
                    var attr = this.ownerDocument.createAttribute(name);
                    attr.value = attr.nodeValue = "" + value, this.setAttributeNode(attr);
                },
                removeAttribute: function(name) {
                    var attr = this.getAttributeNode(name);
                    attr && this.removeAttributeNode(attr);
                },
                appendChild: function(newChild1) {
                    return newChild1.nodeType === DOCUMENT_FRAGMENT_NODE ? this.insertBefore(newChild1, null) : function(parentNode, newChild) {
                        var cp = newChild.parentNode;
                        if (cp) {
                            var pre = parentNode.lastChild;
                            cp.removeChild(newChild);
                            var pre = parentNode.lastChild;
                        }
                        var pre = parentNode.lastChild;
                        return newChild.parentNode = parentNode, newChild.previousSibling = pre, newChild.nextSibling = null, pre ? pre.nextSibling = newChild : parentNode.firstChild = newChild, parentNode.lastChild = newChild, _onUpdateChild(parentNode.ownerDocument, parentNode, newChild), newChild;
                    }(this, newChild1);
                },
                setAttributeNode: function(newAttr) {
                    return this.attributes.setNamedItem(newAttr);
                },
                setAttributeNodeNS: function(newAttr) {
                    return this.attributes.setNamedItemNS(newAttr);
                },
                removeAttributeNode: function(oldAttr) {
                    return this.attributes.removeNamedItem(oldAttr.nodeName);
                },
                removeAttributeNS: function(namespaceURI, localName) {
                    var old = this.getAttributeNodeNS(namespaceURI, localName);
                    old && this.removeAttributeNode(old);
                },
                hasAttributeNS: function(namespaceURI, localName) {
                    return null != this.getAttributeNodeNS(namespaceURI, localName);
                },
                getAttributeNS: function(namespaceURI, localName) {
                    var attr = this.getAttributeNodeNS(namespaceURI, localName);
                    return attr && attr.value || "";
                },
                setAttributeNS: function(namespaceURI, qualifiedName, value) {
                    var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
                    attr.value = attr.nodeValue = "" + value, this.setAttributeNode(attr);
                },
                getAttributeNodeNS: function(namespaceURI, localName) {
                    return this.attributes.getNamedItemNS(namespaceURI, localName);
                },
                getElementsByTagName: function(tagName) {
                    return new LiveNodeList(this, function(base) {
                        var ls = [];
                        return _visitNode(base, function(node) {
                            node !== base && node.nodeType == ELEMENT_NODE && ("*" === tagName || node.tagName == tagName) && ls.push(node);
                        }), ls;
                    });
                },
                getElementsByTagNameNS: function(namespaceURI, localName) {
                    return new LiveNodeList(this, function(base) {
                        var ls = [];
                        return _visitNode(base, function(node) {
                            node !== base && node.nodeType === ELEMENT_NODE && ("*" === namespaceURI || node.namespaceURI === namespaceURI) && ("*" === localName || node.localName == localName) && ls.push(node);
                        }), ls;
                    });
                }
            }, Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName, Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS, _extends(Element, Node), Attr.prototype.nodeType = ATTRIBUTE_NODE, _extends(Attr, Node), CharacterData.prototype = {
                data: "",
                substringData: function(offset, count) {
                    return this.data.substring(offset, offset + count);
                },
                appendData: function(text) {
                    text = this.data + text, this.nodeValue = this.data = text, this.length = text.length;
                },
                insertData: function(offset, text) {
                    this.replaceData(offset, 0, text);
                },
                appendChild: function(newChild) {
                    throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
                },
                deleteData: function(offset, count) {
                    this.replaceData(offset, count, "");
                },
                replaceData: function(offset, count, text) {
                    text = this.data.substring(0, offset) + text + this.data.substring(offset + count), this.nodeValue = this.data = text, this.length = text.length;
                }
            }, _extends(CharacterData, Node), Text.prototype = {
                nodeName: "#text",
                nodeType: TEXT_NODE,
                splitText: function(offset) {
                    var text = this.data, newText = text.substring(offset);
                    text = text.substring(0, offset), this.data = this.nodeValue = text, this.length = text.length;
                    var newNode = this.ownerDocument.createTextNode(newText);
                    return this.parentNode && this.parentNode.insertBefore(newNode, this.nextSibling), newNode;
                }
            }, _extends(Text, CharacterData), Comment.prototype = {
                nodeName: "#comment",
                nodeType: COMMENT_NODE
            }, _extends(Comment, CharacterData), CDATASection.prototype = {
                nodeName: "#cdata-section",
                nodeType: CDATA_SECTION_NODE
            }, _extends(CDATASection, CharacterData), DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE, _extends(DocumentType, Node), Notation.prototype.nodeType = NOTATION_NODE, _extends(Notation, Node), Entity.prototype.nodeType = ENTITY_NODE, _extends(Entity, Node), EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE, _extends(EntityReference, Node), DocumentFragment.prototype.nodeName = "#document-fragment", DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE, _extends(DocumentFragment, Node), ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE, _extends(ProcessingInstruction, Node), XMLSerializer.prototype.serializeToString = function(node, isHtml, nodeFilter) {
                return nodeSerializeToString.call(node, isHtml, nodeFilter);
            }, Node.prototype.toString = nodeSerializeToString;
            try {
                if (Object.defineProperty) {
                    function getTextContent(node) {
                        switch(node.nodeType){
                            case ELEMENT_NODE:
                            case DOCUMENT_FRAGMENT_NODE:
                                var buf = [];
                                for(node = node.firstChild; node;)7 !== node.nodeType && 8 !== node.nodeType && buf.push(getTextContent(node)), node = node.nextSibling;
                                return buf.join("");
                            default:
                                return node.nodeValue;
                        }
                    }
                    Object.defineProperty(LiveNodeList.prototype, "length", {
                        get: function() {
                            return _updateLiveList(this), this.$$length;
                        }
                    }), Object.defineProperty(Node.prototype, "textContent", {
                        get: function() {
                            return getTextContent(this);
                        },
                        set: function(data) {
                            switch(this.nodeType){
                                case ELEMENT_NODE:
                                case DOCUMENT_FRAGMENT_NODE:
                                    for(; this.firstChild;)this.removeChild(this.firstChild);
                                    (data || String(data)) && this.appendChild(this.ownerDocument.createTextNode(data));
                                    break;
                                default:
                                    this.data = data, this.value = data, this.nodeValue = data;
                            }
                        }
                    }), __set__ = function(object, key, value) {
                        object["$$" + key] = value;
                    };
                }
            } catch (e) {}
            exports.DocumentType = DocumentType, exports.DOMException = DOMException, exports.DOMImplementation = DOMImplementation, exports.Element = Element, exports.Node = Node, exports.NodeList = NodeList, exports.XMLSerializer = XMLSerializer;
        },
        1045: function(__unused_webpack_module, exports, __webpack_require__) {
            var freeze = __webpack_require__(2167).freeze;
            exports.XML_ENTITIES = freeze({
                amp: "&",
                apos: "'",
                gt: ">",
                lt: "<",
                quot: '"'
            }), exports.HTML_ENTITIES = freeze({
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
            }), exports.entityMap = exports.HTML_ENTITIES;
        },
        3969: function(__unused_webpack_module, exports, __webpack_require__) {
            var dom = __webpack_require__(1146);
            dom.DOMImplementation, dom.XMLSerializer, exports.DOMParser = __webpack_require__(6129).DOMParser;
        },
        6925: function(__unused_webpack_module, exports, __webpack_require__) {
            var NAMESPACE = __webpack_require__(2167).NAMESPACE, nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"), tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
            function ParseError(message, locator) {
                this.message = message, this.locator = locator, Error.captureStackTrace && Error.captureStackTrace(this, ParseError);
            }
            function XMLReader() {}
            function copyLocator(f, t) {
                return t.lineNumber = f.lineNumber, t.columnNumber = f.columnNumber, t;
            }
            function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
                function addAttribute(qname, value, startIndex) {
                    el.attributeNames.hasOwnProperty(qname) && errorHandler.fatalError("Attribute " + qname + " redefined"), el.addValue(qname, value, startIndex);
                }
                for(var attrName, value1, p = ++start, s = 0;;){
                    var c = source.charAt(p);
                    switch(c){
                        case "=":
                            if (1 === s) attrName = source.slice(start, p), s = 3;
                            else if (2 === s) s = 3;
                            else throw new Error("attribute equal must after attrName");
                            break;
                        case "'":
                        case '"':
                            if (3 === s || 1 === s) {
                                if (1 === s && (errorHandler.warning('attribute value must after "="'), attrName = source.slice(start, p)), start = p + 1, (p = source.indexOf(c, start)) > 0) addAttribute(attrName, value1 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer), start - 1), s = 5;
                                else throw new Error("attribute value no end '" + c + "' match");
                            } else if (4 == s) addAttribute(attrName, value1 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer), start), errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!"), start = p + 1, s = 5;
                            else throw new Error('attribute value must after "="');
                            break;
                        case "/":
                            switch(s){
                                case 0:
                                    el.setTagName(source.slice(start, p));
                                case 5:
                                case 6:
                                case 7:
                                    s = 7, el.closed = !0;
                                case 4:
                                case 1:
                                case 2:
                                    break;
                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;
                        case "":
                            return errorHandler.error("unexpected end of input"), 0 == s && el.setTagName(source.slice(start, p)), p;
                        case ">":
                            switch(s){
                                case 0:
                                    el.setTagName(source.slice(start, p));
                                case 5:
                                case 6:
                                case 7:
                                    break;
                                case 4:
                                case 1:
                                    "/" === (value1 = source.slice(start, p)).slice(-1) && (el.closed = !0, value1 = value1.slice(0, -1));
                                case 2:
                                    2 === s && (value1 = attrName), 4 == s ? (errorHandler.warning('attribute "' + value1 + '" missed quot(")!'), addAttribute(attrName, value1.replace(/&#?\w+;/g, entityReplacer), start)) : (NAMESPACE.isHTML(currentNSMap[""]) && value1.match(/^(?:disabled|checked|selected)$/i) || errorHandler.warning('attribute "' + value1 + '" missed value!! "' + value1 + '" instead!!'), addAttribute(value1, value1, start));
                                    break;
                                case 3:
                                    throw new Error("attribute value missed!!");
                            }
                            return p;
                        case "\u0080":
                            c = " ";
                        default:
                            if (c <= " ") switch(s){
                                case 0:
                                    el.setTagName(source.slice(start, p)), s = 6;
                                    break;
                                case 1:
                                    attrName = source.slice(start, p), s = 2;
                                    break;
                                case 4:
                                    var value1 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                                    errorHandler.warning('attribute "' + value1 + '" missed quot(")!!'), addAttribute(attrName, value1, start);
                                case 5:
                                    s = 6;
                            }
                            else switch(s){
                                case 2:
                                    el.tagName, NAMESPACE.isHTML(currentNSMap[""]) && attrName.match(/^(?:disabled|checked|selected)$/i) || errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!'), addAttribute(attrName, attrName, start), start = p, s = 1;
                                    break;
                                case 5:
                                    errorHandler.warning('attribute space is required"' + attrName + '"!!');
                                case 6:
                                    s = 1, start = p;
                                    break;
                                case 3:
                                    s = 4, start = p;
                                    break;
                                case 7:
                                    throw new Error("elements closed character '/' and '>' must be connected to");
                            }
                    }
                    p++;
                }
            }
            function appendElement(el, domBuilder, currentNSMap) {
                for(var tagName = el.tagName, localNSMap = null, i = el.length; i--;){
                    var a = el[i], qName = a.qName, value = a.value, nsp = qName.indexOf(":");
                    if (nsp > 0) var prefix = a.prefix = qName.slice(0, nsp), localName = qName.slice(nsp + 1), nsPrefix = "xmlns" === prefix && localName;
                    else localName = qName, prefix = null, nsPrefix = "xmlns" === qName && "";
                    a.localName = localName, !1 !== nsPrefix && (null == localNSMap && (localNSMap = {}, _copy(currentNSMap, currentNSMap = {})), currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value, a.uri = NAMESPACE.XMLNS, domBuilder.startPrefixMapping(nsPrefix, value));
                }
                for(var i = el.length; i--;){
                    var prefix = (a = el[i]).prefix;
                    prefix && ("xml" === prefix && (a.uri = NAMESPACE.XML), "xmlns" !== prefix && (a.uri = currentNSMap[prefix || ""]));
                }
                var nsp = tagName.indexOf(":");
                nsp > 0 ? (prefix = el.prefix = tagName.slice(0, nsp), localName = el.localName = tagName.slice(nsp + 1)) : (prefix = null, localName = el.localName = tagName);
                var ns = el.uri = currentNSMap[prefix || ""];
                if (domBuilder.startElement(ns, localName, tagName, el), !el.closed) return el.currentNSMap = currentNSMap, el.localNSMap = localNSMap, !0;
                if (domBuilder.endElement(ns, localName, tagName), localNSMap) for(prefix in localNSMap)domBuilder.endPrefixMapping(prefix);
            }
            function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
                if (/^(?:script|textarea)$/i.test(tagName)) {
                    var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd), text = source.substring(elStartEnd + 1, elEndStart);
                    if (/[&<]/.test(text)) return /^script$/i.test(tagName) ? (domBuilder.characters(text, 0, text.length), elEndStart) : (text = text.replace(/&#?\w+;/g, entityReplacer), domBuilder.characters(text, 0, text.length), elEndStart);
                }
                return elStartEnd + 1;
            }
            function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
                var pos = closeMap[tagName];
                return null == pos && ((pos = source.lastIndexOf("</" + tagName + ">")) < elStartEnd && (pos = source.lastIndexOf("</" + tagName)), closeMap[tagName] = pos), pos < elStartEnd;
            }
            function _copy(source, target) {
                for(var n in source)target[n] = source[n];
            }
            function parseDCC(source, start, domBuilder, errorHandler) {
                if ("-" === source.charAt(start + 2)) {
                    if ("-" === source.charAt(start + 3)) {
                        var end = source.indexOf("-->", start + 4);
                        if (end > start) return domBuilder.comment(source, start + 4, end - start - 4), end + 3;
                        errorHandler.error("Unclosed comment");
                    }
                } else {
                    if ("CDATA[" == source.substr(start + 3, 6)) {
                        var end = source.indexOf("]]>", start + 9);
                        return domBuilder.startCDATA(), domBuilder.characters(source, start + 9, end - start - 9), domBuilder.endCDATA(), end + 3;
                    }
                    var matchs = split(source, start), len = matchs.length;
                    if (len > 1 && /!doctype/i.test(matchs[0][0])) {
                        var name = matchs[1][0], pubid = !1, sysid = !1;
                        len > 3 && (/^public$/i.test(matchs[2][0]) ? (pubid = matchs[3][0], sysid = len > 4 && matchs[4][0]) : /^system$/i.test(matchs[2][0]) && (sysid = matchs[3][0]));
                        var lastMatch = matchs[len - 1];
                        return domBuilder.startDTD(name, pubid, sysid), domBuilder.endDTD(), lastMatch.index + lastMatch[0].length;
                    }
                }
                return -1;
            }
            function parseInstruction(source, start, domBuilder) {
                var end = source.indexOf("?>", start);
                if (end) {
                    var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (match) return match[0].length, domBuilder.processingInstruction(match[1], match[2]), end + 2;
                }
                return -1;
            }
            function ElementAttributes() {
                this.attributeNames = {};
            }
            function split(source, start) {
                var match, buf = [], reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                for(reg.lastIndex = start, reg.exec(source); match = reg.exec(source);)if (buf.push(match), match[1]) return buf;
            }
            ParseError.prototype = new Error(), ParseError.prototype.name = ParseError.name, XMLReader.prototype = {
                parse: function(source1, defaultNSMap, entityMap1) {
                    var domBuilder2 = this.domBuilder;
                    domBuilder2.startDocument(), _copy(defaultNSMap, defaultNSMap = {}), function(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
                        function entityReplacer(a) {
                            var k = a.slice(1, -1);
                            return k in entityMap ? entityMap[k] : "#" === k.charAt(0) ? function(code) {
                                if (!(code > 0xffff)) return String.fromCharCode(code);
                                var surrogate1 = 0xd800 + ((code -= 0x10000) >> 10), surrogate2 = 0xdc00 + (0x3ff & code);
                                return String.fromCharCode(surrogate1, surrogate2);
                            }(parseInt(k.substr(1).replace("x", "0x"))) : (errorHandler.error("entity not found:" + a), a);
                        }
                        function appendText(end) {
                            if (end > start) {
                                var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
                                locator && position(start), domBuilder.characters(xt, 0, end - start), start = end;
                            }
                        }
                        function position(p, m) {
                            for(; p >= lineEnd && (m = linePattern.exec(source));)lineEnd = (lineStart = m.index) + m[0].length, locator.lineNumber++;
                            locator.columnNumber = p - lineStart + 1;
                        }
                        for(var lineStart = 0, lineEnd = 0, linePattern = /.*(?:\r\n?|\n)|.*$/g, locator = domBuilder.locator, parseStack = [
                            {
                                currentNSMap: defaultNSMapCopy
                            }
                        ], closeMap = {}, start = 0;;){
                            try {
                                var tagStart = source.indexOf("<", start);
                                if (tagStart < 0) {
                                    if (!source.substr(start).match(/^\s*$/)) {
                                        var doc = domBuilder.doc, text = doc.createTextNode(source.substr(start));
                                        doc.appendChild(text), domBuilder.currentElement = text;
                                    }
                                    return;
                                }
                                switch(tagStart > start && appendText(tagStart), source.charAt(tagStart + 1)){
                                    case "/":
                                        var end1 = source.indexOf(">", tagStart + 3), tagName = source.substring(tagStart + 2, end1).replace(/[ \t\n\r]+$/g, ""), config = parseStack.pop();
                                        end1 < 0 ? (tagName = source.substring(tagStart + 2).replace(/[\s<].*/, ""), errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName), end1 = tagStart + 1 + tagName.length) : tagName.match(/\s</) && (tagName = tagName.replace(/[\s<].*/, ""), errorHandler.error("end tag name: " + tagName + " maybe not complete"), end1 = tagStart + 1 + tagName.length);
                                        var localNSMap = config.localNSMap, endMatch = config.tagName == tagName;
                                        if (endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase()) {
                                            if (domBuilder.endElement(config.uri, config.localName, tagName), localNSMap) for(var prefix in localNSMap)domBuilder.endPrefixMapping(prefix);
                                            endMatch || errorHandler.fatalError("end tag name: " + tagName + " is not match the current start tagName:" + config.tagName);
                                        } else parseStack.push(config);
                                        end1++;
                                        break;
                                    case "?":
                                        locator && position(tagStart), end1 = parseInstruction(source, tagStart, domBuilder);
                                        break;
                                    case "!":
                                        locator && position(tagStart), end1 = parseDCC(source, tagStart, domBuilder, errorHandler);
                                        break;
                                    default:
                                        locator && position(tagStart);
                                        var el = new ElementAttributes(), currentNSMap = parseStack[parseStack.length - 1].currentNSMap, end1 = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler), len = el.length;
                                        if (!el.closed && fixSelfClosed(source, end1, el.tagName, closeMap) && (el.closed = !0, entityMap.nbsp || errorHandler.warning("unclosed xml attribute")), locator && len) {
                                            for(var locator2 = copyLocator(locator, {}), i = 0; i < len; i++){
                                                var a2 = el[i];
                                                position(a2.offset), a2.locator = copyLocator(locator, {});
                                            }
                                            domBuilder.locator = locator2, appendElement(el, domBuilder, currentNSMap) && parseStack.push(el), domBuilder.locator = locator;
                                        } else appendElement(el, domBuilder, currentNSMap) && parseStack.push(el);
                                        NAMESPACE.isHTML(el.uri) && !el.closed ? end1 = parseHtmlSpecialContent(source, end1, el.tagName, entityReplacer, domBuilder) : end1++;
                                }
                            } catch (e) {
                                if (e instanceof ParseError) throw e;
                                errorHandler.error("element parse error: " + e), end1 = -1;
                            }
                            end1 > start ? start = end1 : appendText(Math.max(tagStart, start) + 1);
                        }
                    }(source1, defaultNSMap, entityMap1, domBuilder2, this.errorHandler), domBuilder2.endDocument();
                }
            }, ElementAttributes.prototype = {
                setTagName: function(tagName) {
                    if (!tagNamePattern.test(tagName)) throw new Error("invalid tagName:" + tagName);
                    this.tagName = tagName;
                },
                addValue: function(qName, value, offset) {
                    if (!tagNamePattern.test(qName)) throw new Error("invalid attribute:" + qName);
                    this.attributeNames[qName] = this.length, this[this.length++] = {
                        qName: qName,
                        value: value,
                        offset: offset
                    };
                },
                length: 0,
                getLocalName: function(i) {
                    return this[i].localName;
                },
                getLocator: function(i) {
                    return this[i].locator;
                },
                getQName: function(i) {
                    return this[i].qName;
                },
                getURI: function(i) {
                    return this[i].uri;
                },
                getValue: function(i) {
                    return this[i].value;
                }
            }, exports.XMLReader = XMLReader, exports.ParseError = ParseError;
        },
        9144: function(module, __unused_webpack_exports, __webpack_require__) {
            var doccy, topLevel = void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof window ? window : {}, minDoc = __webpack_require__(7579);
            "undefined" != typeof document ? doccy = document : (doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"]) || (doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"] = minDoc), module.exports = doccy;
        },
        8908: function(module, __unused_webpack_exports, __webpack_require__) {
            var win;
            win = "undefined" != typeof window ? window : void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : {}, module.exports = win;
        },
        7376: function(module) {
            module.exports = function(fn) {
                if (!fn) return !1;
                var string = toString.call(fn);
                return "[object Function]" === string || "function" == typeof fn && "[object RegExp]" !== string || "undefined" != typeof window && (fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt);
            };
            var toString = Object.prototype.toString;
        },
        7537: function(module, exports) {
            function keyCode1(searchInput) {
                if (searchInput && "object" == typeof searchInput) {
                    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
                    hasKeyCode && (searchInput = hasKeyCode);
                }
                if ("number" == typeof searchInput) return names[searchInput];
                var search = String(searchInput), foundNamedKey = codes[search.toLowerCase()];
                if (foundNamedKey) return foundNamedKey;
                var foundNamedKey = aliases[search.toLowerCase()];
                return foundNamedKey || (1 === search.length ? search.charCodeAt(0) : void 0);
            }
            keyCode1.isEventKey = function(event, nameOrCode) {
                if (event && "object" == typeof event) {
                    var keyCode = event.which || event.keyCode || event.charCode;
                    if (null == keyCode) return !1;
                    if ("string" == typeof nameOrCode) {
                        var foundNamedKey = codes[nameOrCode.toLowerCase()];
                        if (foundNamedKey) return foundNamedKey === keyCode;
                        var foundNamedKey = aliases[nameOrCode.toLowerCase()];
                        if (foundNamedKey) return foundNamedKey === keyCode;
                    } else if ("number" == typeof nameOrCode) return nameOrCode === keyCode;
                    return !1;
                }
            };
            var codes = (exports = module.exports = keyCode1).code = exports.codes = {
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
            }, aliases = exports.aliases = {
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
            };
            for(i = 97; i < 123; i++)codes[String.fromCharCode(i)] = i - 32;
            for(var i = 48; i < 58; i++)codes[i - 48] = i;
            for(i = 1; i < 13; i++)codes["f" + i] = i + 111;
            for(i = 0; i < 10; i++)codes["numpad " + i] = i + 96;
            var names = exports.names = exports.title = {};
            for(i in codes)names[codes[i]] = i;
            for(var alias in aliases)codes[alias] = aliases[alias];
        },
        9323: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                _b: function() {
                    return Parser1;
                }
            });
            var inheritsLoose = __webpack_require__(4578), Stream1 = function() {
                function Stream() {
                    this.listeners = {};
                }
                var _proto = Stream.prototype;
                return _proto.on = function(type, listener) {
                    this.listeners[type] || (this.listeners[type] = []), this.listeners[type].push(listener);
                }, _proto.off = function(type, listener) {
                    if (!this.listeners[type]) return !1;
                    var index = this.listeners[type].indexOf(listener);
                    return this.listeners[type] = this.listeners[type].slice(0), this.listeners[type].splice(index, 1), index > -1;
                }, _proto.trigger = function(type) {
                    var callbacks = this.listeners[type];
                    if (callbacks) {
                        if (2 === arguments.length) for(var length = callbacks.length, i = 0; i < length; ++i)callbacks[i].call(this, arguments[1]);
                        else for(var args = Array.prototype.slice.call(arguments, 1), _length = callbacks.length, _i = 0; _i < _length; ++_i)callbacks[_i].apply(this, args);
                    }
                }, _proto.dispose = function() {
                    this.listeners = {};
                }, _proto.pipe = function(destination) {
                    this.on("data", function(data) {
                        destination.push(data);
                    });
                }, Stream;
            }(), esm_extends = __webpack_require__(7462), assertThisInitialized = __webpack_require__(7326), decode_b64_to_uint8_array = __webpack_require__(6722), LineStream1 = function(_Stream) {
                function LineStream() {
                    var _this;
                    return (_this = _Stream.call(this) || this).buffer = "", _this;
                }
                return (0, inheritsLoose.Z)(LineStream, _Stream), LineStream.prototype.push = function(data) {
                    var nextNewline;
                    for(this.buffer += data, nextNewline = this.buffer.indexOf("\n"); nextNewline > -1; nextNewline = this.buffer.indexOf("\n"))this.trigger("data", this.buffer.substring(0, nextNewline)), this.buffer = this.buffer.substring(nextNewline + 1);
                }, LineStream;
            }(Stream1), parseByterange = function(byterangeString) {
                var match = /([0-9.]*)?@?([0-9.]*)?/.exec(byterangeString || ""), result = {};
                return match[1] && (result.length = parseInt(match[1], 10)), match[2] && (result.offset = parseInt(match[2], 10)), result;
            }, attributeSeparator = function() {
                return new RegExp('(?:^|,)((?:[^=]*)=(?:"[^"]*"|[^,]*))');
            }, parseAttributes = function(attributes) {
                for(var attr, attrs = attributes.split(attributeSeparator()), result = {}, i = attrs.length; i--;)"" !== attrs[i] && ((attr = /([^=]*)=(.*)/.exec(attrs[i]).slice(1))[0] = attr[0].replace(/^\s+|\s+$/g, ""), attr[1] = attr[1].replace(/^\s+|\s+$/g, ""), attr[1] = attr[1].replace(/^['"](.*)['"]$/g, "$1"), result[attr[0]] = attr[1]);
                return result;
            }, ParseStream1 = function(_Stream) {
                function ParseStream() {
                    var _this;
                    return (_this = _Stream.call(this) || this).customParsers = [], _this.tagMappers = [], _this;
                }
                (0, inheritsLoose.Z)(ParseStream, _Stream);
                var _proto = ParseStream.prototype;
                return _proto.push = function(line) {
                    var match, event, _this2 = this;
                    if (0 !== (line = line.trim()).length) {
                        if ("#" !== line[0]) {
                            this.trigger("data", {
                                type: "uri",
                                uri: line
                            });
                            return;
                        }
                        this.tagMappers.reduce(function(acc, mapper) {
                            var mappedLine = mapper(line);
                            return mappedLine === line ? acc : acc.concat([
                                mappedLine
                            ]);
                        }, [
                            line
                        ]).forEach(function(newLine) {
                            for(var i = 0; i < _this2.customParsers.length; i++)if (_this2.customParsers[i].call(_this2, newLine)) return;
                            if (0 !== newLine.indexOf("#EXT")) {
                                _this2.trigger("data", {
                                    type: "comment",
                                    text: newLine.slice(1)
                                });
                                return;
                            }
                            if (newLine = newLine.replace("\r", ""), match = /^#EXTM3U/.exec(newLine)) {
                                _this2.trigger("data", {
                                    type: "tag",
                                    tagType: "m3u"
                                });
                                return;
                            }
                            if (match = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "inf"
                                }, match[1] && (event.duration = parseFloat(match[1])), match[2] && (event.title = match[2]), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "targetduration"
                                }, match[1] && (event.duration = parseInt(match[1], 10)), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "version"
                                }, match[1] && (event.version = parseInt(match[1], 10)), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "media-sequence"
                                }, match[1] && (event.number = parseInt(match[1], 10)), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "discontinuity-sequence"
                                }, match[1] && (event.number = parseInt(match[1], 10)), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "playlist-type"
                                }, match[1] && (event.playlistType = match[1]), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(newLine)) {
                                event = (0, esm_extends.Z)(parseByterange(match[1]), {
                                    type: "tag",
                                    tagType: "byterange"
                                }), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "allow-cache"
                                }, match[1] && (event.allowed = !/NO/.test(match[1])), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-MAP:?(.*)$/.exec(newLine)) {
                                if (event = {
                                    type: "tag",
                                    tagType: "map"
                                }, match[1]) {
                                    var attributes = parseAttributes(match[1]);
                                    attributes.URI && (event.uri = attributes.URI), attributes.BYTERANGE && (event.byterange = parseByterange(attributes.BYTERANGE));
                                }
                                _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-STREAM-INF:?(.*)$/.exec(newLine)) {
                                if (event = {
                                    type: "tag",
                                    tagType: "stream-inf"
                                }, match[1]) {
                                    if (event.attributes = parseAttributes(match[1]), event.attributes.RESOLUTION) {
                                        var split = event.attributes.RESOLUTION.split("x"), resolution = {};
                                        split[0] && (resolution.width = parseInt(split[0], 10)), split[1] && (resolution.height = parseInt(split[1], 10)), event.attributes.RESOLUTION = resolution;
                                    }
                                    event.attributes.BANDWIDTH && (event.attributes.BANDWIDTH = parseInt(event.attributes.BANDWIDTH, 10)), event.attributes["PROGRAM-ID"] && (event.attributes["PROGRAM-ID"] = parseInt(event.attributes["PROGRAM-ID"], 10));
                                }
                                _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-MEDIA:?(.*)$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "media"
                                }, match[1] && (event.attributes = parseAttributes(match[1])), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-ENDLIST/.exec(newLine)) {
                                _this2.trigger("data", {
                                    type: "tag",
                                    tagType: "endlist"
                                });
                                return;
                            }
                            if (match = /^#EXT-X-DISCONTINUITY/.exec(newLine)) {
                                _this2.trigger("data", {
                                    type: "tag",
                                    tagType: "discontinuity"
                                });
                                return;
                            }
                            if (match = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "program-date-time"
                                }, match[1] && (event.dateTimeString = match[1], event.dateTimeObject = new Date(match[1])), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-KEY:?(.*)$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "key"
                                }, match[1] && (event.attributes = parseAttributes(match[1]), event.attributes.IV && ("0x" === event.attributes.IV.substring(0, 2).toLowerCase() && (event.attributes.IV = event.attributes.IV.substring(2)), event.attributes.IV = event.attributes.IV.match(/.{8}/g), event.attributes.IV[0] = parseInt(event.attributes.IV[0], 16), event.attributes.IV[1] = parseInt(event.attributes.IV[1], 16), event.attributes.IV[2] = parseInt(event.attributes.IV[2], 16), event.attributes.IV[3] = parseInt(event.attributes.IV[3], 16), event.attributes.IV = new Uint32Array(event.attributes.IV))), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-START:?(.*)$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "start"
                                }, match[1] && (event.attributes = parseAttributes(match[1]), event.attributes["TIME-OFFSET"] = parseFloat(event.attributes["TIME-OFFSET"]), event.attributes.PRECISE = /YES/.test(event.attributes.PRECISE)), _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "cue-out-cont"
                                }, match[1] ? event.data = match[1] : event.data = "", _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "cue-out"
                                }, match[1] ? event.data = match[1] : event.data = "", _this2.trigger("data", event);
                                return;
                            }
                            if (match = /^#EXT-X-CUE-IN:?(.*)?$/.exec(newLine)) {
                                event = {
                                    type: "tag",
                                    tagType: "cue-in"
                                }, match[1] ? event.data = match[1] : event.data = "", _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-SKIP:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "skip"
                                }).attributes = parseAttributes(match[1]), event.attributes.hasOwnProperty("SKIPPED-SEGMENTS") && (event.attributes["SKIPPED-SEGMENTS"] = parseInt(event.attributes["SKIPPED-SEGMENTS"], 10)), event.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES") && (event.attributes["RECENTLY-REMOVED-DATERANGES"] = event.attributes["RECENTLY-REMOVED-DATERANGES"].split("	")), _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-PART:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "part"
                                }).attributes = parseAttributes(match[1]), [
                                    "DURATION"
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = parseFloat(event.attributes[key]));
                                }), [
                                    "INDEPENDENT",
                                    "GAP"
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = /YES/.test(event.attributes[key]));
                                }), event.attributes.hasOwnProperty("BYTERANGE") && (event.attributes.byterange = parseByterange(event.attributes.BYTERANGE)), _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "server-control"
                                }).attributes = parseAttributes(match[1]), [
                                    "CAN-SKIP-UNTIL",
                                    "PART-HOLD-BACK",
                                    "HOLD-BACK", 
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = parseFloat(event.attributes[key]));
                                }), [
                                    "CAN-SKIP-DATERANGES",
                                    "CAN-BLOCK-RELOAD"
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = /YES/.test(event.attributes[key]));
                                }), _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-PART-INF:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "part-inf"
                                }).attributes = parseAttributes(match[1]), [
                                    "PART-TARGET"
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = parseFloat(event.attributes[key]));
                                }), _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "preload-hint"
                                }).attributes = parseAttributes(match[1]), [
                                    "BYTERANGE-START",
                                    "BYTERANGE-LENGTH"
                                ].forEach(function(key) {
                                    if (event.attributes.hasOwnProperty(key)) {
                                        event.attributes[key] = parseInt(event.attributes[key], 10);
                                        var subkey = "BYTERANGE-LENGTH" === key ? "length" : "offset";
                                        event.attributes.byterange = event.attributes.byterange || {}, event.attributes.byterange[subkey] = event.attributes[key], delete event.attributes[key];
                                    }
                                }), _this2.trigger("data", event);
                                return;
                            }
                            if ((match = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(newLine)) && match[1]) {
                                (event = {
                                    type: "tag",
                                    tagType: "rendition-report"
                                }).attributes = parseAttributes(match[1]), [
                                    "LAST-MSN",
                                    "LAST-PART"
                                ].forEach(function(key) {
                                    event.attributes.hasOwnProperty(key) && (event.attributes[key] = parseInt(event.attributes[key], 10));
                                }), _this2.trigger("data", event);
                                return;
                            }
                            _this2.trigger("data", {
                                type: "tag",
                                data: newLine.slice(4)
                            });
                        });
                    }
                }, _proto.addParser = function(_ref) {
                    var _this3 = this, expression = _ref.expression, customType = _ref.customType, dataParser = _ref.dataParser, segment = _ref.segment;
                    "function" != typeof dataParser && (dataParser = function(line) {
                        return line;
                    }), this.customParsers.push(function(line) {
                        if (expression.exec(line)) return _this3.trigger("data", {
                            type: "custom",
                            data: dataParser(line),
                            customType: customType,
                            segment: segment
                        }), !0;
                    });
                }, _proto.addTagMapper = function(_ref2) {
                    var expression = _ref2.expression, map = _ref2.map;
                    this.tagMappers.push(function(line) {
                        return expression.test(line) ? map(line) : line;
                    });
                }, ParseStream;
            }(Stream1), camelCase = function(str) {
                return str.toLowerCase().replace(/-(\w)/g, function(a) {
                    return a[1].toUpperCase();
                });
            }, camelCaseKeys = function(attributes) {
                var result = {};
                return Object.keys(attributes).forEach(function(key) {
                    result[camelCase(key)] = attributes[key];
                }), result;
            }, setHoldBack = function(manifest) {
                var serverControl = manifest.serverControl, targetDuration = manifest.targetDuration, partTargetDuration = manifest.partTargetDuration;
                if (serverControl) {
                    var tag = "#EXT-X-SERVER-CONTROL", hb = "holdBack", phb = "partHoldBack", minTargetDuration = targetDuration && 3 * targetDuration, minPartDuration = partTargetDuration && 2 * partTargetDuration;
                    targetDuration && !serverControl.hasOwnProperty(hb) && (serverControl[hb] = minTargetDuration, this.trigger("info", {
                        message: tag + " defaulting HOLD-BACK to targetDuration * 3 (" + minTargetDuration + ")."
                    })), minTargetDuration && serverControl[hb] < minTargetDuration && (this.trigger("warn", {
                        message: tag + " clamping HOLD-BACK (" + serverControl[hb] + ") to targetDuration * 3 (" + minTargetDuration + ")"
                    }), serverControl[hb] = minTargetDuration), partTargetDuration && !serverControl.hasOwnProperty(phb) && (serverControl[phb] = 3 * partTargetDuration, this.trigger("info", {
                        message: tag + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + serverControl[phb] + ")."
                    })), partTargetDuration && serverControl[phb] < minPartDuration && (this.trigger("warn", {
                        message: tag + " clamping PART-HOLD-BACK (" + serverControl[phb] + ") to partTargetDuration * 2 (" + minPartDuration + ")."
                    }), serverControl[phb] = minPartDuration);
                }
            }, Parser1 = function(_Stream) {
                function Parser() {
                    (_this = _Stream.call(this) || this).lineStream = new LineStream1(), _this.parseStream = new ParseStream1(), _this.lineStream.pipe(_this.parseStream);
                    var _this, currentMap, _key, self = (0, assertThisInitialized.Z)(_this), uris = [], currentUri = {}, hasParts = !1, noop = function() {}, defaultMediaGroups = {
                        AUDIO: {},
                        VIDEO: {},
                        "CLOSED-CAPTIONS": {},
                        SUBTITLES: {}
                    }, currentTimeline = 0;
                    _this.manifest = {
                        allowCache: !0,
                        discontinuityStarts: [],
                        segments: []
                    };
                    var lastByterangeEnd = 0, lastPartByterangeEnd = 0;
                    return _this.on("end", function() {
                        !currentUri.uri && (currentUri.parts || currentUri.preloadHints) && (!currentUri.map && currentMap && (currentUri.map = currentMap), !currentUri.key && _key && (currentUri.key = _key), currentUri.timeline || "number" != typeof currentTimeline || (currentUri.timeline = currentTimeline), _this.manifest.preloadSegment = currentUri);
                    }), _this.parseStream.on("data", function(entry) {
                        var mediaGroup, rendition;
                        ({
                            tag: function() {
                                (({
                                    version: function() {
                                        entry.version && (this.manifest.version = entry.version);
                                    },
                                    "allow-cache": function() {
                                        this.manifest.allowCache = entry.allowed, "allowed" in entry || (this.trigger("info", {
                                            message: "defaulting allowCache to YES"
                                        }), this.manifest.allowCache = !0);
                                    },
                                    byterange: function() {
                                        var byterange = {};
                                        "length" in entry && (currentUri.byterange = byterange, byterange.length = entry.length, "offset" in entry || (entry.offset = lastByterangeEnd)), "offset" in entry && (currentUri.byterange = byterange, byterange.offset = entry.offset), lastByterangeEnd = byterange.offset + byterange.length;
                                    },
                                    endlist: function() {
                                        this.manifest.endList = !0;
                                    },
                                    inf: function() {
                                        "mediaSequence" in this.manifest || (this.manifest.mediaSequence = 0, this.trigger("info", {
                                            message: "defaulting media sequence to zero"
                                        })), "discontinuitySequence" in this.manifest || (this.manifest.discontinuitySequence = 0, this.trigger("info", {
                                            message: "defaulting discontinuity sequence to zero"
                                        })), entry.duration > 0 && (currentUri.duration = entry.duration), 0 === entry.duration && (currentUri.duration = 0.01, this.trigger("info", {
                                            message: "updating zero segment duration to a small value"
                                        })), this.manifest.segments = uris;
                                    },
                                    key: function() {
                                        if (!entry.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without attribute list"
                                            });
                                            return;
                                        }
                                        if ("NONE" === entry.attributes.METHOD) {
                                            _key = null;
                                            return;
                                        }
                                        if (!entry.attributes.URI) {
                                            this.trigger("warn", {
                                                message: "ignoring key declaration without URI"
                                            });
                                            return;
                                        }
                                        if ("com.apple.streamingkeydelivery" === entry.attributes.KEYFORMAT) {
                                            this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.apple.fps.1_0"] = {
                                                attributes: entry.attributes
                                            };
                                            return;
                                        }
                                        if ("urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed" === entry.attributes.KEYFORMAT) {
                                            if (-1 === [
                                                "SAMPLE-AES",
                                                "SAMPLE-AES-CTR",
                                                "SAMPLE-AES-CENC", 
                                            ].indexOf(entry.attributes.METHOD)) {
                                                this.trigger("warn", {
                                                    message: "invalid key method provided for Widevine"
                                                });
                                                return;
                                            }
                                            if ("SAMPLE-AES-CENC" === entry.attributes.METHOD && this.trigger("warn", {
                                                message: "SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead"
                                            }), "data:text/plain;base64," !== entry.attributes.URI.substring(0, 23)) {
                                                this.trigger("warn", {
                                                    message: "invalid key URI provided for Widevine"
                                                });
                                                return;
                                            }
                                            if (!(entry.attributes.KEYID && "0x" === entry.attributes.KEYID.substring(0, 2))) {
                                                this.trigger("warn", {
                                                    message: "invalid key ID provided for Widevine"
                                                });
                                                return;
                                            }
                                            this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.widevine.alpha"] = {
                                                attributes: {
                                                    schemeIdUri: entry.attributes.KEYFORMAT,
                                                    keyId: entry.attributes.KEYID.substring(2)
                                                },
                                                pssh: (0, decode_b64_to_uint8_array.Z)(entry.attributes.URI.split(",")[1])
                                            };
                                            return;
                                        }
                                        entry.attributes.METHOD || this.trigger("warn", {
                                            message: "defaulting key method to AES-128"
                                        }), _key = {
                                            method: entry.attributes.METHOD || "AES-128",
                                            uri: entry.attributes.URI
                                        }, void 0 !== entry.attributes.IV && (_key.iv = entry.attributes.IV);
                                    },
                                    "media-sequence": function() {
                                        if (!isFinite(entry.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid media sequence: " + entry.number
                                            });
                                            return;
                                        }
                                        this.manifest.mediaSequence = entry.number;
                                    },
                                    "discontinuity-sequence": function() {
                                        if (!isFinite(entry.number)) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid discontinuity sequence: " + entry.number
                                            });
                                            return;
                                        }
                                        this.manifest.discontinuitySequence = entry.number, currentTimeline = entry.number;
                                    },
                                    "playlist-type": function() {
                                        if (!/VOD|EVENT/.test(entry.playlistType)) {
                                            this.trigger("warn", {
                                                message: "ignoring unknown playlist type: " + entry.playlist
                                            });
                                            return;
                                        }
                                        this.manifest.playlistType = entry.playlistType;
                                    },
                                    map: function() {
                                        currentMap = {}, entry.uri && (currentMap.uri = entry.uri), entry.byterange && (currentMap.byterange = entry.byterange), _key && (currentMap.key = _key);
                                    },
                                    "stream-inf": function() {
                                        if (this.manifest.playlists = uris, this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups, !entry.attributes) {
                                            this.trigger("warn", {
                                                message: "ignoring empty stream-inf attributes"
                                            });
                                            return;
                                        }
                                        currentUri.attributes || (currentUri.attributes = {}), (0, esm_extends.Z)(currentUri.attributes, entry.attributes);
                                    },
                                    media: function() {
                                        if (this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups, !(entry.attributes && entry.attributes.TYPE && entry.attributes["GROUP-ID"] && entry.attributes.NAME)) {
                                            this.trigger("warn", {
                                                message: "ignoring incomplete or missing media group"
                                            });
                                            return;
                                        }
                                        var mediaGroupType = this.manifest.mediaGroups[entry.attributes.TYPE];
                                        mediaGroupType[entry.attributes["GROUP-ID"]] = mediaGroupType[entry.attributes["GROUP-ID"]] || {}, mediaGroup = mediaGroupType[entry.attributes["GROUP-ID"]], (rendition = {
                                            default: /yes/i.test(entry.attributes.DEFAULT)
                                        }).default ? rendition.autoselect = !0 : rendition.autoselect = /yes/i.test(entry.attributes.AUTOSELECT), entry.attributes.LANGUAGE && (rendition.language = entry.attributes.LANGUAGE), entry.attributes.URI && (rendition.uri = entry.attributes.URI), entry.attributes["INSTREAM-ID"] && (rendition.instreamId = entry.attributes["INSTREAM-ID"]), entry.attributes.CHARACTERISTICS && (rendition.characteristics = entry.attributes.CHARACTERISTICS), entry.attributes.FORCED && (rendition.forced = /yes/i.test(entry.attributes.FORCED)), mediaGroup[entry.attributes.NAME] = rendition;
                                    },
                                    discontinuity: function() {
                                        currentTimeline += 1, currentUri.discontinuity = !0, this.manifest.discontinuityStarts.push(uris.length);
                                    },
                                    "program-date-time": function() {
                                        void 0 === this.manifest.dateTimeString && (this.manifest.dateTimeString = entry.dateTimeString, this.manifest.dateTimeObject = entry.dateTimeObject), currentUri.dateTimeString = entry.dateTimeString, currentUri.dateTimeObject = entry.dateTimeObject;
                                    },
                                    targetduration: function() {
                                        if (!isFinite(entry.duration) || entry.duration < 0) {
                                            this.trigger("warn", {
                                                message: "ignoring invalid target duration: " + entry.duration
                                            });
                                            return;
                                        }
                                        this.manifest.targetDuration = entry.duration, setHoldBack.call(this, this.manifest);
                                    },
                                    start: function() {
                                        if (!entry.attributes || isNaN(entry.attributes["TIME-OFFSET"])) {
                                            this.trigger("warn", {
                                                message: "ignoring start declaration without appropriate attribute list"
                                            });
                                            return;
                                        }
                                        this.manifest.start = {
                                            timeOffset: entry.attributes["TIME-OFFSET"],
                                            precise: entry.attributes.PRECISE
                                        };
                                    },
                                    "cue-out": function() {
                                        currentUri.cueOut = entry.data;
                                    },
                                    "cue-out-cont": function() {
                                        currentUri.cueOutCont = entry.data;
                                    },
                                    "cue-in": function() {
                                        currentUri.cueIn = entry.data;
                                    },
                                    skip: function() {
                                        this.manifest.skip = camelCaseKeys(entry.attributes), this.warnOnMissingAttributes_("#EXT-X-SKIP", entry.attributes, [
                                            "SKIPPED-SEGMENTS"
                                        ]);
                                    },
                                    part: function() {
                                        var _this2 = this;
                                        hasParts = !0;
                                        var segmentIndex = this.manifest.segments.length, part = camelCaseKeys(entry.attributes);
                                        currentUri.parts = currentUri.parts || [], currentUri.parts.push(part), part.byterange && (part.byterange.hasOwnProperty("offset") || (part.byterange.offset = lastPartByterangeEnd), lastPartByterangeEnd = part.byterange.offset + part.byterange.length);
                                        var partIndex = currentUri.parts.length - 1;
                                        this.warnOnMissingAttributes_("#EXT-X-PART #" + partIndex + " for segment #" + segmentIndex, entry.attributes, [
                                            "URI",
                                            "DURATION"
                                        ]), this.manifest.renditionReports && this.manifest.renditionReports.forEach(function(r, i) {
                                            r.hasOwnProperty("lastPart") || _this2.trigger("warn", {
                                                message: "#EXT-X-RENDITION-REPORT #" + i + " lacks required attribute(s): LAST-PART"
                                            });
                                        });
                                    },
                                    "server-control": function() {
                                        var attrs = this.manifest.serverControl = camelCaseKeys(entry.attributes);
                                        attrs.hasOwnProperty("canBlockReload") || (attrs.canBlockReload = !1, this.trigger("info", {
                                            message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
                                        })), setHoldBack.call(this, this.manifest), attrs.canSkipDateranges && !attrs.hasOwnProperty("canSkipUntil") && this.trigger("warn", {
                                            message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
                                        });
                                    },
                                    "preload-hint": function() {
                                        var segmentIndex = this.manifest.segments.length, hint = camelCaseKeys(entry.attributes), isPart = hint.type && "PART" === hint.type;
                                        currentUri.preloadHints = currentUri.preloadHints || [], currentUri.preloadHints.push(hint), hint.byterange && !hint.byterange.hasOwnProperty("offset") && (hint.byterange.offset = isPart ? lastPartByterangeEnd : 0, isPart && (lastPartByterangeEnd = hint.byterange.offset + hint.byterange.length));
                                        var index = currentUri.preloadHints.length - 1;
                                        if (this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + index + " for segment #" + segmentIndex, entry.attributes, [
                                            "TYPE",
                                            "URI"
                                        ]), hint.type) for(var i = 0; i < currentUri.preloadHints.length - 1; i++){
                                            var otherHint = currentUri.preloadHints[i];
                                            otherHint.type && otherHint.type === hint.type && this.trigger("warn", {
                                                message: "#EXT-X-PRELOAD-HINT #" + index + " for segment #" + segmentIndex + " has the same TYPE " + hint.type + " as preload hint #" + i
                                            });
                                        }
                                    },
                                    "rendition-report": function() {
                                        var report = camelCaseKeys(entry.attributes);
                                        this.manifest.renditionReports = this.manifest.renditionReports || [], this.manifest.renditionReports.push(report);
                                        var index = this.manifest.renditionReports.length - 1, required = [
                                            "LAST-MSN",
                                            "URI", 
                                        ];
                                        hasParts && required.push("LAST-PART"), this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + index, entry.attributes, required);
                                    },
                                    "part-inf": function() {
                                        this.manifest.partInf = camelCaseKeys(entry.attributes), this.warnOnMissingAttributes_("#EXT-X-PART-INF", entry.attributes, [
                                            "PART-TARGET"
                                        ]), this.manifest.partInf.partTarget && (this.manifest.partTargetDuration = this.manifest.partInf.partTarget), setHoldBack.call(this, this.manifest);
                                    }
                                })[entry.tagType] || noop).call(self);
                            },
                            uri: function() {
                                currentUri.uri = entry.uri, uris.push(currentUri), !this.manifest.targetDuration || "duration" in currentUri || (this.trigger("warn", {
                                    message: "defaulting segment duration to the target duration"
                                }), currentUri.duration = this.manifest.targetDuration), _key && (currentUri.key = _key), currentUri.timeline = currentTimeline, currentMap && (currentUri.map = currentMap), lastPartByterangeEnd = 0, currentUri = {};
                            },
                            comment: function() {},
                            custom: function() {
                                entry.segment ? (currentUri.custom = currentUri.custom || {}, currentUri.custom[entry.customType] = entry.data) : (this.manifest.custom = this.manifest.custom || {}, this.manifest.custom[entry.customType] = entry.data);
                            }
                        })[entry.type].call(self);
                    }), _this;
                }
                (0, inheritsLoose.Z)(Parser, _Stream);
                var _proto = Parser.prototype;
                return _proto.warnOnMissingAttributes_ = function(identifier, attributes, required) {
                    var missing = [];
                    required.forEach(function(key) {
                        attributes.hasOwnProperty(key) || missing.push(key);
                    }), missing.length && this.trigger("warn", {
                        message: identifier + " lacks required attribute(s): " + missing.join(", ")
                    });
                }, _proto.push = function(chunk) {
                    this.lineStream.push(chunk);
                }, _proto.end = function() {
                    this.lineStream.push("\n"), this.trigger("end");
                }, _proto.addParser = function(options) {
                    this.parseStream.addParser(options);
                }, _proto.addTagMapper = function(options) {
                    this.parseStream.addTagMapper(options);
                }, Parser;
            }(Stream1);
        },
        973: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                jp: function() {
                    return addSidxSegmentsToPlaylist;
                },
                mm: function() {
                    return generateSidxKey;
                },
                Qc: function() {
                    return parse;
                },
                LG: function() {
                    return parseUTCTiming;
                }
            });
            var _videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(779), global_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8908), global_window__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_1__), _videojs_vhs_utils_es_decode_b64_to_uint8_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6722), _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3969), isObject = function(obj) {
                return !!obj && "object" == typeof obj;
            }, merge1 = function merge() {
                for(var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++)objects[_key] = arguments[_key];
                return objects.reduce(function(result, source) {
                    return "object" != typeof source || Object.keys(source).forEach(function(key) {
                        Array.isArray(result[key]) && Array.isArray(source[key]) ? result[key] = result[key].concat(source[key]) : isObject(result[key]) && isObject(source[key]) ? result[key] = merge(result[key], source[key]) : result[key] = source[key];
                    }), result;
                }, {});
            }, range1 = function(start, end) {
                for(var result = [], i = start; i < end; i++)result.push(i);
                return result;
            }, flatten = function(lists) {
                return lists.reduce(function(x, y) {
                    return x.concat(y);
                }, []);
            }, from = function(list) {
                if (!list.length) return [];
                for(var result = [], i = 0; i < list.length; i++)result.push(list[i]);
                return result;
            }, errors = {
                INVALID_NUMBER_OF_PERIOD: "INVALID_NUMBER_OF_PERIOD",
                DASH_EMPTY_MANIFEST: "DASH_EMPTY_MANIFEST",
                DASH_INVALID_XML: "DASH_INVALID_XML",
                NO_BASE_URL: "NO_BASE_URL",
                MISSING_SEGMENT_INFORMATION: "MISSING_SEGMENT_INFORMATION",
                SEGMENT_TIME_UNSPECIFIED: "SEGMENT_TIME_UNSPECIFIED",
                UNSUPPORTED_UTC_TIMING_SCHEME: "UNSUPPORTED_UTC_TIMING_SCHEME"
            }, urlTypeToSegment = function(_ref) {
                var _ref$baseUrl = _ref.baseUrl, _ref$source = _ref.source, source = void 0 === _ref$source ? "" : _ref$source, _ref$range = _ref.range, range = void 0 === _ref$range ? "" : _ref$range, _ref$indexRange = _ref.indexRange, indexRange = void 0 === _ref$indexRange ? "" : _ref$indexRange, segment = {
                    uri: source,
                    resolvedUri: (0, _videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__.Z)((void 0 === _ref$baseUrl ? "" : _ref$baseUrl) || "", source)
                };
                if (range || indexRange) {
                    var ranges = (range || indexRange).split("-"), startRange = parseInt(ranges[0], 10), endRange = parseInt(ranges[1], 10);
                    segment.byterange = {
                        length: endRange - startRange + 1,
                        offset: startRange
                    };
                }
                return segment;
            }, byteRangeToString = function(byterange) {
                var endRange = byterange.offset + byterange.length - 1;
                return byterange.offset + "-" + endRange;
            }, parseEndNumber = function(endNumber) {
                return (endNumber && "number" != typeof endNumber && (endNumber = parseInt(endNumber, 10)), isNaN(endNumber)) ? null : endNumber;
            }, segmentRange = {
                static: function(attributes) {
                    var duration = attributes.duration, _attributes$timescale = attributes.timescale, sourceDuration = attributes.sourceDuration, periodDuration = attributes.periodDuration, endNumber = parseEndNumber(attributes.endNumber), segmentDuration = duration / (void 0 === _attributes$timescale ? 1 : _attributes$timescale);
                    return "number" == typeof endNumber ? {
                        start: 0,
                        end: endNumber
                    } : "number" == typeof periodDuration ? {
                        start: 0,
                        end: periodDuration / segmentDuration
                    } : {
                        start: 0,
                        end: sourceDuration / segmentDuration
                    };
                },
                dynamic: function(attributes) {
                    var NOW = attributes.NOW, clientOffset = attributes.clientOffset, availabilityStartTime = attributes.availabilityStartTime, _attributes$timescale2 = attributes.timescale, timescale = void 0 === _attributes$timescale2 ? 1 : _attributes$timescale2, duration = attributes.duration, _attributes$start = attributes.start, _attributes$minimumUp = attributes.minimumUpdatePeriod, _attributes$timeShift = attributes.timeShiftBufferDepth, endNumber = parseEndNumber(attributes.endNumber), now = (NOW + clientOffset) / 1000, periodStartWC = availabilityStartTime + (void 0 === _attributes$start ? 0 : _attributes$start);
                    return {
                        start: Math.max(0, Math.floor((now - periodStartWC - (void 0 === _attributes$timeShift ? 1 / 0 : _attributes$timeShift)) * timescale / duration)),
                        end: "number" == typeof endNumber ? endNumber : Math.min(Math.ceil((now + (void 0 === _attributes$minimumUp ? 0 : _attributes$minimumUp) - periodStartWC) * timescale / duration), Math.floor((now - periodStartWC) * timescale / duration))
                    };
                }
            }, parseByDuration = function(attributes) {
                var attributes1, type = attributes.type, duration1 = attributes.duration, _attributes$timescale4 = attributes.timescale, periodDuration = attributes.periodDuration, sourceDuration = attributes.sourceDuration, _segmentRange$type = segmentRange[type](attributes), start = _segmentRange$type.start, end = _segmentRange$type.end, segments = range1(start, end).map((attributes1 = attributes, function(number, index) {
                    var duration = attributes1.duration, _attributes$timescale3 = attributes1.timescale, periodIndex = attributes1.periodIndex, _attributes$startNumb = attributes1.startNumber;
                    return {
                        number: (void 0 === _attributes$startNumb ? 1 : _attributes$startNumb) + number,
                        duration: duration / (void 0 === _attributes$timescale3 ? 1 : _attributes$timescale3),
                        timeline: periodIndex,
                        time: index * duration
                    };
                }));
                if ("static" === type) {
                    var index1 = segments.length - 1, sectionDuration = "number" == typeof periodDuration ? periodDuration : sourceDuration;
                    segments[index1].duration = sectionDuration - duration1 / (void 0 === _attributes$timescale4 ? 1 : _attributes$timescale4) * index1;
                }
                return segments;
            }, segmentsFromBase = function(attributes) {
                var baseUrl = attributes.baseUrl, _attributes$initializ = attributes.initialization, initialization = void 0 === _attributes$initializ ? {} : _attributes$initializ, sourceDuration = attributes.sourceDuration, _attributes$indexRang = attributes.indexRange, duration = attributes.duration;
                if (!baseUrl) throw new Error(errors.NO_BASE_URL);
                var initSegment = urlTypeToSegment({
                    baseUrl: baseUrl,
                    source: initialization.sourceURL,
                    range: initialization.range
                }), segment = urlTypeToSegment({
                    baseUrl: baseUrl,
                    source: baseUrl,
                    indexRange: void 0 === _attributes$indexRang ? "" : _attributes$indexRang
                });
                if (segment.map = initSegment, duration) {
                    var segmentTimeInfo = parseByDuration(attributes);
                    segmentTimeInfo.length && (segment.duration = segmentTimeInfo[0].duration, segment.timeline = segmentTimeInfo[0].timeline);
                } else sourceDuration && (segment.duration = sourceDuration, segment.timeline = 0);
                return segment.number = 0, [
                    segment
                ];
            }, addSidxSegmentsToPlaylist = function(playlist, sidx, baseUrl) {
                for(var initSegment = playlist.sidx.map ? playlist.sidx.map : null, sourceDuration = playlist.sidx.duration, timeline = playlist.timeline || 0, sidxByteRange = playlist.sidx.byterange, sidxEnd = sidxByteRange.offset + sidxByteRange.length, timescale = sidx.timescale, mediaReferences = sidx.references.filter(function(r) {
                    return 1 !== r.referenceType;
                }), segments = [], type = playlist.endList ? "static" : "dynamic", startIndex = sidxEnd + sidx.firstOffset, i = 0; i < mediaReferences.length; i++){
                    var reference = sidx.references[i], size = reference.referencedSize, duration = reference.subsegmentDuration, endIndex = startIndex + size - 1, indexRange = startIndex + "-" + endIndex, attributes = {
                        baseUrl: baseUrl,
                        timescale: timescale,
                        timeline: timeline,
                        periodIndex: timeline,
                        duration: duration,
                        sourceDuration: sourceDuration,
                        indexRange: indexRange,
                        type: type
                    }, segment = segmentsFromBase(attributes)[0];
                    initSegment && (segment.map = initSegment), segments.push(segment), startIndex += size;
                }
                return playlist.segments = segments, playlist;
            }, generateSidxKey = function(sidx) {
                return sidx && sidx.uri + "-" + byteRangeToString(sidx.byterange);
            }, mergeDiscontiguousPlaylists = function(playlists) {
                var o;
                return (o = playlists.reduce(function(acc, playlist) {
                    var _acc$name$segments, name = playlist.attributes.id + (playlist.attributes.lang || "");
                    return acc[name] ? (playlist.segments[0] && (playlist.segments[0].discontinuity = !0), (_acc$name$segments = acc[name].segments).push.apply(_acc$name$segments, playlist.segments), playlist.attributes.contentProtection && (acc[name].attributes.contentProtection = playlist.attributes.contentProtection)) : acc[name] = playlist, acc;
                }, {}), Object.keys(o).map(function(k) {
                    return o[k];
                })).map(function(playlist) {
                    var l, key;
                    return playlist.discontinuityStarts = (l = playlist.segments, key = "discontinuity", l.reduce(function(a, e, i) {
                        return e[key] && a.push(i), a;
                    }, [])), playlist;
                });
            }, addSidxSegmentsToPlaylist$1 = function(playlist, sidxMapping) {
                var sidxKey = generateSidxKey(playlist.sidx), sidxMatch = sidxKey && sidxMapping[sidxKey] && sidxMapping[sidxKey].sidx;
                return sidxMatch && addSidxSegmentsToPlaylist(playlist, sidxMatch, playlist.sidx.resolvedUri), playlist;
            }, addSidxSegmentsToPlaylists = function(playlists, sidxMapping) {
                if (void 0 === sidxMapping && (sidxMapping = {}), !Object.keys(sidxMapping).length) return playlists;
                for(var i in playlists)playlists[i] = addSidxSegmentsToPlaylist$1(playlists[i], sidxMapping);
                return playlists;
            }, formatAudioPlaylist = function(_ref, isAudioOnly) {
                var _attributes, attributes = _ref.attributes, segments = _ref.segments, sidx = _ref.sidx, playlist = {
                    attributes: ((_attributes = {
                        NAME: attributes.id,
                        BANDWIDTH: attributes.bandwidth,
                        CODECS: attributes.codecs
                    })["PROGRAM-ID"] = 1, _attributes),
                    uri: "",
                    endList: "static" === attributes.type,
                    timeline: attributes.periodIndex,
                    resolvedUri: "",
                    targetDuration: attributes.duration,
                    segments: segments,
                    mediaSequence: segments.length ? segments[0].number : 1
                };
                return attributes.contentProtection && (playlist.contentProtection = attributes.contentProtection), sidx && (playlist.sidx = sidx), isAudioOnly && (playlist.attributes.AUDIO = "audio", playlist.attributes.SUBTITLES = "subs"), playlist;
            }, formatVttPlaylist = function(_ref2) {
                var _m3u8Attributes, attributes = _ref2.attributes, segments = _ref2.segments;
                void 0 === segments && (segments = [
                    {
                        uri: attributes.baseUrl,
                        timeline: attributes.periodIndex,
                        resolvedUri: attributes.baseUrl || "",
                        duration: attributes.sourceDuration,
                        number: 0
                    }, 
                ], attributes.duration = attributes.sourceDuration);
                var m3u8Attributes = ((_m3u8Attributes = {
                    NAME: attributes.id,
                    BANDWIDTH: attributes.bandwidth
                })["PROGRAM-ID"] = 1, _m3u8Attributes);
                return attributes.codecs && (m3u8Attributes.CODECS = attributes.codecs), {
                    attributes: m3u8Attributes,
                    uri: "",
                    endList: "static" === attributes.type,
                    timeline: attributes.periodIndex,
                    resolvedUri: attributes.baseUrl || "",
                    targetDuration: attributes.duration,
                    segments: segments,
                    mediaSequence: segments.length ? segments[0].number : 1
                };
            }, organizeAudioPlaylists = function(playlists, sidxMapping, isAudioOnly) {
                void 0 === sidxMapping && (sidxMapping = {}), void 0 === isAudioOnly && (isAudioOnly = !1);
                var mainPlaylist, formattedPlaylists = playlists.reduce(function(a, playlist) {
                    var role = playlist.attributes.role && playlist.attributes.role.value || "", language = playlist.attributes.lang || "", label = playlist.attributes.label || "main";
                    if (language && !playlist.attributes.label) {
                        var roleLabel = role ? " (" + role + ")" : "";
                        label = "" + playlist.attributes.lang + roleLabel;
                    }
                    a[label] || (a[label] = {
                        language: language,
                        autoselect: !0,
                        default: "main" === role,
                        playlists: [],
                        uri: ""
                    });
                    var formatted = addSidxSegmentsToPlaylist$1(formatAudioPlaylist(playlist, isAudioOnly), sidxMapping);
                    return a[label].playlists.push(formatted), void 0 === mainPlaylist && "main" === role && ((mainPlaylist = playlist).default = !0), a;
                }, {});
                if (!mainPlaylist) {
                    var firstLabel = Object.keys(formattedPlaylists)[0];
                    formattedPlaylists[firstLabel].default = !0;
                }
                return formattedPlaylists;
            }, formatVideoPlaylist = function(_ref3) {
                var _attributes2, attributes = _ref3.attributes, segments = _ref3.segments, sidx = _ref3.sidx, playlist = {
                    attributes: ((_attributes2 = {
                        NAME: attributes.id,
                        AUDIO: "audio",
                        SUBTITLES: "subs",
                        RESOLUTION: {
                            width: attributes.width,
                            height: attributes.height
                        },
                        CODECS: attributes.codecs,
                        BANDWIDTH: attributes.bandwidth
                    })["PROGRAM-ID"] = 1, _attributes2),
                    uri: "",
                    endList: "static" === attributes.type,
                    timeline: attributes.periodIndex,
                    resolvedUri: "",
                    targetDuration: attributes.duration,
                    segments: segments,
                    mediaSequence: segments.length ? segments[0].number : 1
                };
                return attributes.contentProtection && (playlist.contentProtection = attributes.contentProtection), sidx && (playlist.sidx = sidx), playlist;
            }, videoOnly = function(_ref4) {
                var attributes = _ref4.attributes;
                return "video/mp4" === attributes.mimeType || "video/webm" === attributes.mimeType || "video" === attributes.contentType;
            }, audioOnly = function(_ref5) {
                var attributes = _ref5.attributes;
                return "audio/mp4" === attributes.mimeType || "audio/webm" === attributes.mimeType || "audio" === attributes.contentType;
            }, vttOnly = function(_ref6) {
                var attributes = _ref6.attributes;
                return "text/vtt" === attributes.mimeType || "text" === attributes.contentType;
            }, toM3u8 = function(dashPlaylists, locations, sidxMapping) {
                if (void 0 === sidxMapping && (sidxMapping = {}), !dashPlaylists.length) return {};
                var playlists, sidxMapping1, _mediaGroups, _dashPlaylists$0$attr = dashPlaylists[0].attributes, duration = _dashPlaylists$0$attr.sourceDuration, type = _dashPlaylists$0$attr.type, suggestedPresentationDelay = _dashPlaylists$0$attr.suggestedPresentationDelay, minimumUpdatePeriod = _dashPlaylists$0$attr.minimumUpdatePeriod, videoPlaylists = mergeDiscontiguousPlaylists(dashPlaylists.filter(videoOnly)).map(formatVideoPlaylist), audioPlaylists = mergeDiscontiguousPlaylists(dashPlaylists.filter(audioOnly)), vttPlaylists = dashPlaylists.filter(vttOnly), captions = dashPlaylists.map(function(playlist) {
                    return playlist.attributes.captionServices;
                }).filter(Boolean), manifest = {
                    allowCache: !0,
                    discontinuityStarts: [],
                    segments: [],
                    endList: !0,
                    mediaGroups: ((_mediaGroups = {
                        AUDIO: {},
                        VIDEO: {}
                    })["CLOSED-CAPTIONS"] = {}, _mediaGroups.SUBTITLES = {}, _mediaGroups),
                    uri: "",
                    duration: duration,
                    playlists: addSidxSegmentsToPlaylists(videoPlaylists, sidxMapping)
                };
                minimumUpdatePeriod >= 0 && (manifest.minimumUpdatePeriod = 1000 * minimumUpdatePeriod), locations && (manifest.locations = locations), "dynamic" === type && (manifest.suggestedPresentationDelay = suggestedPresentationDelay);
                var isAudioOnly = 0 === manifest.playlists.length;
                return audioPlaylists.length && (manifest.mediaGroups.AUDIO.audio = organizeAudioPlaylists(audioPlaylists, sidxMapping, isAudioOnly)), vttPlaylists.length && (manifest.mediaGroups.SUBTITLES.subs = (playlists = vttPlaylists, void 0 === (sidxMapping1 = sidxMapping) && (sidxMapping1 = {}), playlists.reduce(function(a, playlist) {
                    var label = playlist.attributes.lang || "text";
                    return a[label] || (a[label] = {
                        language: label,
                        default: !1,
                        autoselect: !1,
                        playlists: [],
                        uri: ""
                    }), a[label].playlists.push(addSidxSegmentsToPlaylist$1(formatVttPlaylist(playlist), sidxMapping1)), a;
                }, {}))), captions.length && (manifest.mediaGroups["CLOSED-CAPTIONS"].cc = captions.reduce(function(svcObj, svc) {
                    return svc && svc.forEach(function(service) {
                        var channel = service.channel, language = service.language;
                        svcObj[language] = {
                            autoselect: !1,
                            default: !1,
                            instreamId: channel,
                            language: language
                        }, service.hasOwnProperty("aspectRatio") && (svcObj[language].aspectRatio = service.aspectRatio), service.hasOwnProperty("easyReader") && (svcObj[language].easyReader = service.easyReader), service.hasOwnProperty("3D") && (svcObj[language]["3D"] = service["3D"]);
                    }), svcObj;
                }, {})), manifest;
            }, getLiveRValue = function(attributes, time, duration) {
                var NOW = attributes.NOW, clientOffset = attributes.clientOffset, availabilityStartTime = attributes.availabilityStartTime, _attributes$timescale = attributes.timescale, _attributes$start = attributes.start, _attributes$minimumUp = attributes.minimumUpdatePeriod;
                return Math.ceil((((NOW + clientOffset) / 1000 + (void 0 === _attributes$minimumUp ? 0 : _attributes$minimumUp) - (availabilityStartTime + (void 0 === _attributes$start ? 0 : _attributes$start))) * (void 0 === _attributes$timescale ? 1 : _attributes$timescale) - time) / duration);
            }, parseByTimeline = function(attributes, segmentTimeline) {
                for(var type = attributes.type, _attributes$minimumUp2 = attributes.minimumUpdatePeriod, minimumUpdatePeriod = void 0 === _attributes$minimumUp2 ? 0 : _attributes$minimumUp2, _attributes$media = attributes.media, media = void 0 === _attributes$media ? "" : _attributes$media, sourceDuration = attributes.sourceDuration, _attributes$timescale2 = attributes.timescale, timescale = void 0 === _attributes$timescale2 ? 1 : _attributes$timescale2, _attributes$startNumb = attributes.startNumber, startNumber = void 0 === _attributes$startNumb ? 1 : _attributes$startNumb, timeline = attributes.periodIndex, segments = [], time = -1, sIndex = 0; sIndex < segmentTimeline.length; sIndex++){
                    var S = segmentTimeline[sIndex], duration = S.d, repeat = S.r || 0, segmentTime = S.t || 0;
                    time < 0 && (time = segmentTime), segmentTime && segmentTime > time && (time = segmentTime);
                    var count = void 0;
                    if (repeat < 0) {
                        var nextS = sIndex + 1;
                        count = nextS === segmentTimeline.length ? "dynamic" === type && minimumUpdatePeriod > 0 && media.indexOf("$Number$") > 0 ? getLiveRValue(attributes, time, duration) : (sourceDuration * timescale - time) / duration : (segmentTimeline[nextS].t - time) / duration;
                    } else count = repeat + 1;
                    for(var end = startNumber + segments.length + count, number = startNumber + segments.length; number < end;)segments.push({
                        number: number,
                        duration: duration / timescale,
                        time: time,
                        timeline: timeline
                    }), time += duration, number++;
                }
                return segments;
            }, identifierPattern = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g, constructTemplateUrl = function(url, values) {
                var values1;
                return url.replace(identifierPattern, (values1 = values, function(match, identifier, format, width) {
                    if ("$$" === match) return "$";
                    if (void 0 === values1[identifier]) return match;
                    var value = "" + values1[identifier];
                    return "RepresentationID" === identifier ? value : (width = format ? parseInt(width, 10) : 1, value.length >= width) ? value : "" + new Array(width - value.length + 1).join("0") + value;
                }));
            }, segmentsFromTemplate = function(attributes, segmentTimeline) {
                var attributes2, segmentTimeline1, templateValues = {
                    RepresentationID: attributes.id,
                    Bandwidth: attributes.bandwidth || 0
                }, _attributes$initializ = attributes.initialization, initialization = void 0 === _attributes$initializ ? {
                    sourceURL: "",
                    range: ""
                } : _attributes$initializ, mapSegment = urlTypeToSegment({
                    baseUrl: attributes.baseUrl,
                    source: constructTemplateUrl(initialization.sourceURL, templateValues),
                    range: initialization.range
                });
                return (attributes2 = attributes, segmentTimeline1 = segmentTimeline, attributes2.duration || segmentTimeline1 ? attributes2.duration ? parseByDuration(attributes2) : parseByTimeline(attributes2, segmentTimeline1) : [
                    {
                        number: attributes2.startNumber || 1,
                        duration: attributes2.sourceDuration,
                        time: 0,
                        timeline: attributes2.periodIndex
                    }, 
                ]).map(function(segment) {
                    templateValues.Number = segment.number, templateValues.Time = segment.time;
                    var uri = constructTemplateUrl(attributes.media || "", templateValues), timescale = attributes.timescale || 1, presentationTimeOffset = attributes.presentationTimeOffset || 0, presentationTime = attributes.periodStart + (segment.time - presentationTimeOffset) / timescale, map = {
                        uri: uri,
                        timeline: segment.timeline,
                        duration: segment.duration,
                        resolvedUri: (0, _videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__.Z)(attributes.baseUrl || "", uri),
                        map: mapSegment,
                        number: segment.number,
                        presentationTime: presentationTime
                    };
                    return map;
                });
            }, SegmentURLToSegmentObject = function(attributes, segmentUrl) {
                var baseUrl = attributes.baseUrl, _attributes$initializ = attributes.initialization, initialization = void 0 === _attributes$initializ ? {} : _attributes$initializ, initSegment = urlTypeToSegment({
                    baseUrl: baseUrl,
                    source: initialization.sourceURL,
                    range: initialization.range
                }), segment = urlTypeToSegment({
                    baseUrl: baseUrl,
                    source: segmentUrl.media,
                    range: segmentUrl.mediaRange
                });
                return segment.map = initSegment, segment;
            }, segmentsFromList = function(attributes, segmentTimeline) {
                var segmentTimeInfo, duration = attributes.duration, _attributes$segmentUr = attributes.segmentUrls, periodStart = attributes.periodStart;
                if (!duration && !segmentTimeline || duration && segmentTimeline) throw new Error(errors.SEGMENT_TIME_UNSPECIFIED);
                var segmentUrlMap = (void 0 === _attributes$segmentUr ? [] : _attributes$segmentUr).map(function(segmentUrlObject) {
                    return SegmentURLToSegmentObject(attributes, segmentUrlObject);
                });
                return duration && (segmentTimeInfo = parseByDuration(attributes)), segmentTimeline && (segmentTimeInfo = parseByTimeline(attributes, segmentTimeline)), segmentTimeInfo.map(function(segmentTime, index) {
                    if (segmentUrlMap[index]) {
                        var segment = segmentUrlMap[index], timescale = attributes.timescale || 1, presentationTimeOffset = attributes.presentationTimeOffset || 0;
                        return segment.timeline = segmentTime.timeline, segment.duration = segmentTime.duration, segment.number = segmentTime.number, segment.presentationTime = periodStart + (segmentTime.time - presentationTimeOffset) / timescale, segment;
                    }
                }).filter(function(segment) {
                    return segment;
                });
            }, generateSegments = function(_ref) {
                var segmentAttributes, segmentsFn, attributes = _ref.attributes, segmentInfo = _ref.segmentInfo;
                segmentInfo.template ? (segmentsFn = segmentsFromTemplate, segmentAttributes = merge1(attributes, segmentInfo.template)) : segmentInfo.base ? (segmentsFn = segmentsFromBase, segmentAttributes = merge1(attributes, segmentInfo.base)) : segmentInfo.list && (segmentsFn = segmentsFromList, segmentAttributes = merge1(attributes, segmentInfo.list));
                var segmentsInfo = {
                    attributes: attributes
                };
                if (!segmentsFn) return segmentsInfo;
                var segments = segmentsFn(segmentAttributes, segmentInfo.segmentTimeline);
                if (segmentAttributes.duration) {
                    var _segmentAttributes = segmentAttributes, duration = _segmentAttributes.duration, _segmentAttributes$ti = _segmentAttributes.timescale, timescale = void 0 === _segmentAttributes$ti ? 1 : _segmentAttributes$ti;
                    segmentAttributes.duration = duration / timescale;
                } else segments.length ? segmentAttributes.duration = segments.reduce(function(max, segment) {
                    return Math.max(max, Math.ceil(segment.duration));
                }, 0) : segmentAttributes.duration = 0;
                return segmentsInfo.attributes = segmentAttributes, segmentsInfo.segments = segments, segmentInfo.base && segmentAttributes.indexRange && (segmentsInfo.sidx = segments[0], segmentsInfo.segments = []), segmentsInfo;
            }, findChildren = function(element, name) {
                return from(element.childNodes).filter(function(_ref) {
                    return _ref.tagName === name;
                });
            }, getContent = function(element) {
                return element.textContent.trim();
            }, parseDuration = function(str) {
                var match = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/.exec(str);
                if (!match) return 0;
                var _match$slice = match.slice(1), year = _match$slice[0], month = _match$slice[1], day = _match$slice[2], hour = _match$slice[3], minute = _match$slice[4], second = _match$slice[5];
                return 31536000 * parseFloat(year || 0) + 2592000 * parseFloat(month || 0) + 86400 * parseFloat(day || 0) + 3600 * parseFloat(hour || 0) + 60 * parseFloat(minute || 0) + parseFloat(second || 0);
            }, parsers = {
                mediaPresentationDuration: function(value) {
                    return parseDuration(value);
                },
                availabilityStartTime: function(value) {
                    var str;
                    return str = value, /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/.test(str) && (str += "Z"), Date.parse(str) / 1000;
                },
                minimumUpdatePeriod: function(value) {
                    return parseDuration(value);
                },
                suggestedPresentationDelay: function(value) {
                    return parseDuration(value);
                },
                type: function(value) {
                    return value;
                },
                timeShiftBufferDepth: function(value) {
                    return parseDuration(value);
                },
                start: function(value) {
                    return parseDuration(value);
                },
                width: function(value) {
                    return parseInt(value, 10);
                },
                height: function(value) {
                    return parseInt(value, 10);
                },
                bandwidth: function(value) {
                    return parseInt(value, 10);
                },
                startNumber: function(value) {
                    return parseInt(value, 10);
                },
                timescale: function(value) {
                    return parseInt(value, 10);
                },
                presentationTimeOffset: function(value) {
                    return parseInt(value, 10);
                },
                duration: function(value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? parseDuration(value) : parsedValue;
                },
                d: function(value) {
                    return parseInt(value, 10);
                },
                t: function(value) {
                    return parseInt(value, 10);
                },
                r: function(value) {
                    return parseInt(value, 10);
                },
                DEFAULT: function(value) {
                    return value;
                }
            }, parseAttributes = function(el) {
                return el && el.attributes ? from(el.attributes).reduce(function(a, e) {
                    var parseFn = parsers[e.name] || parsers.DEFAULT;
                    return a[e.name] = parseFn(e.value), a;
                }, {}) : {};
            }, keySystemsMap = {
                "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
                "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
                "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
                "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
            }, buildBaseUrls = function(referenceUrls, baseUrlElements) {
                return baseUrlElements.length ? flatten(referenceUrls.map(function(reference) {
                    return baseUrlElements.map(function(baseUrlElement) {
                        return (0, _videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__.Z)(reference, getContent(baseUrlElement));
                    });
                })) : referenceUrls;
            }, getSegmentInformation = function(adaptationSet) {
                var segmentTemplate = findChildren(adaptationSet, "SegmentTemplate")[0], segmentList = findChildren(adaptationSet, "SegmentList")[0], segmentUrls = segmentList && findChildren(segmentList, "SegmentURL").map(function(s) {
                    return merge1({
                        tag: "SegmentURL"
                    }, parseAttributes(s));
                }), segmentBase = findChildren(adaptationSet, "SegmentBase")[0], segmentTimelineParentNode = segmentList || segmentTemplate, segmentTimeline = segmentTimelineParentNode && findChildren(segmentTimelineParentNode, "SegmentTimeline")[0], segmentInitializationParentNode = segmentList || segmentBase || segmentTemplate, segmentInitialization = segmentInitializationParentNode && findChildren(segmentInitializationParentNode, "Initialization")[0], template = segmentTemplate && parseAttributes(segmentTemplate);
                template && segmentInitialization ? template.initialization = segmentInitialization && parseAttributes(segmentInitialization) : template && template.initialization && (template.initialization = {
                    sourceURL: template.initialization
                });
                var segmentInfo = {
                    template: template,
                    segmentTimeline: segmentTimeline && findChildren(segmentTimeline, "S").map(function(s) {
                        return parseAttributes(s);
                    }),
                    list: segmentList && merge1(parseAttributes(segmentList), {
                        segmentUrls: segmentUrls,
                        initialization: parseAttributes(segmentInitialization)
                    }),
                    base: segmentBase && merge1(parseAttributes(segmentBase), {
                        initialization: parseAttributes(segmentInitialization)
                    })
                };
                return Object.keys(segmentInfo).forEach(function(key) {
                    segmentInfo[key] || delete segmentInfo[key];
                }), segmentInfo;
            }, parseCaptionServiceMetadata = function(service) {
                return "urn:scte:dash:cc:cea-608:2015" === service.schemeIdUri ? ("string" != typeof service.value ? [] : service.value.split(";")).map(function(value) {
                    if (language = value, /^CC\d=/.test(value)) {
                        var channel, language, _value$split = value.split("=");
                        channel = _value$split[0], language = _value$split[1];
                    } else /^CC\d$/.test(value) && (channel = value);
                    return {
                        channel: channel,
                        language: language
                    };
                }) : "urn:scte:dash:cc:cea-708:2015" === service.schemeIdUri ? ("string" != typeof service.value ? [] : service.value.split(";")).map(function(value) {
                    var flags = {
                        channel: void 0,
                        language: void 0,
                        aspectRatio: 1,
                        easyReader: 0,
                        "3D": 0
                    };
                    if (/=/.test(value)) {
                        var _value$split2 = value.split("="), channel = _value$split2[0], _value$split2$ = _value$split2[1], opts = void 0 === _value$split2$ ? "" : _value$split2$;
                        flags.channel = channel, flags.language = value, opts.split(",").forEach(function(opt) {
                            var _opt$split = opt.split(":"), name = _opt$split[0], val = _opt$split[1];
                            "lang" === name ? flags.language = val : "er" === name ? flags.easyReader = Number(val) : "war" === name ? flags.aspectRatio = Number(val) : "3D" === name && (flags["3D"] = Number(val));
                        });
                    } else flags.language = value;
                    return flags.channel && (flags.channel = "SERVICE" + flags.channel), flags;
                }) : void 0;
            }, getPeriodStart = function(_ref) {
                var attributes = _ref.attributes, priorPeriodAttributes = _ref.priorPeriodAttributes, mpdType = _ref.mpdType;
                return "number" == typeof attributes.start ? attributes.start : priorPeriodAttributes && "number" == typeof priorPeriodAttributes.start && "number" == typeof priorPeriodAttributes.duration ? priorPeriodAttributes.start + priorPeriodAttributes.duration : priorPeriodAttributes || "static" !== mpdType ? null : 0;
            }, inheritAttributes = function(mpd, options) {
                void 0 === options && (options = {});
                var _options = options, _options$manifestUri = _options.manifestUri, _options$NOW = _options.NOW, NOW = void 0 === _options$NOW ? Date.now() : _options$NOW, _options$clientOffset = _options.clientOffset, periodNodes = findChildren(mpd, "Period");
                if (!periodNodes.length) throw new Error(errors.INVALID_NUMBER_OF_PERIOD);
                var locations = findChildren(mpd, "Location"), mpdAttributes = parseAttributes(mpd), mpdBaseUrls = buildBaseUrls([
                    void 0 === _options$manifestUri ? "" : _options$manifestUri
                ], findChildren(mpd, "BaseURL"));
                mpdAttributes.type = mpdAttributes.type || "static", mpdAttributes.sourceDuration = mpdAttributes.mediaPresentationDuration || 0, mpdAttributes.NOW = NOW, mpdAttributes.clientOffset = void 0 === _options$clientOffset ? 0 : _options$clientOffset, locations.length && (mpdAttributes.locations = locations.map(getContent));
                var mpdAttributes1, mpdBaseUrls1, periods = [];
                return periodNodes.forEach(function(node, index) {
                    var attributes = parseAttributes(node), priorPeriod = periods[index - 1];
                    attributes.start = getPeriodStart({
                        attributes: attributes,
                        priorPeriodAttributes: priorPeriod ? priorPeriod.attributes : null,
                        mpdType: mpdAttributes.type
                    }), periods.push({
                        node: node,
                        attributes: attributes
                    });
                }), {
                    locations: mpdAttributes.locations,
                    representationInfo: flatten(periods.map((mpdAttributes1 = mpdAttributes, mpdBaseUrls1 = mpdBaseUrls, function(period, index) {
                        var periodBaseUrls = buildBaseUrls(mpdBaseUrls1, findChildren(period.node, "BaseURL")), parsedPeriodId = parseInt(period.attributes.id, 10), periodIndex = global_window__WEBPACK_IMPORTED_MODULE_1___default().isNaN(parsedPeriodId) ? index : parsedPeriodId, periodAttributes = merge1(mpdAttributes1, {
                            periodIndex: periodIndex,
                            periodStart: period.attributes.start
                        });
                        "number" == typeof period.attributes.duration && (periodAttributes.periodDuration = period.attributes.duration);
                        var periodAttributes1, periodBaseUrls1, periodSegmentInfo, adaptationSets = findChildren(period.node, "AdaptationSet"), periodSegmentInfo1 = getSegmentInformation(period.node);
                        return flatten(adaptationSets.map((periodAttributes1 = periodAttributes, periodBaseUrls1 = periodBaseUrls, periodSegmentInfo = periodSegmentInfo1, function(adaptationSet) {
                            var adaptationSetAttributes = parseAttributes(adaptationSet), adaptationSetBaseUrls = buildBaseUrls(periodBaseUrls1, findChildren(adaptationSet, "BaseURL")), role = findChildren(adaptationSet, "Role")[0], roleAttributes = {
                                role: parseAttributes(role)
                            }, attrs = merge1(periodAttributes1, adaptationSetAttributes, roleAttributes), accessibility = findChildren(adaptationSet, "Accessibility")[0], captionServices = parseCaptionServiceMetadata(parseAttributes(accessibility));
                            captionServices && (attrs = merge1(attrs, {
                                captionServices: captionServices
                            }));
                            var label = findChildren(adaptationSet, "Label")[0];
                            label && label.childNodes.length && (attrs = merge1(attrs, {
                                label: label.childNodes[0].nodeValue.trim()
                            }));
                            var contentProtection = findChildren(adaptationSet, "ContentProtection").reduce(function(acc, node) {
                                var attributes = parseAttributes(node), keySystem = keySystemsMap[attributes.schemeIdUri];
                                if (keySystem) {
                                    acc[keySystem] = {
                                        attributes: attributes
                                    };
                                    var psshNode = findChildren(node, "cenc:pssh")[0];
                                    if (psshNode) {
                                        var pssh = getContent(psshNode), psshBuffer = pssh && (0, _videojs_vhs_utils_es_decode_b64_to_uint8_array__WEBPACK_IMPORTED_MODULE_2__.Z)(pssh);
                                        acc[keySystem].pssh = psshBuffer;
                                    }
                                }
                                return acc;
                            }, {});
                            Object.keys(contentProtection).length && (attrs = merge1(attrs, {
                                contentProtection: contentProtection
                            }));
                            var adaptationSetAttributes1, adaptationSetBaseUrls1, adaptationSetSegmentInfo, segmentInfo = getSegmentInformation(adaptationSet), representations = findChildren(adaptationSet, "Representation"), adaptationSetSegmentInfo1 = merge1(periodSegmentInfo, segmentInfo);
                            return flatten(representations.map((adaptationSetAttributes1 = attrs, adaptationSetBaseUrls1 = adaptationSetBaseUrls, adaptationSetSegmentInfo = adaptationSetSegmentInfo1, function(representation) {
                                var repBaseUrlElements = findChildren(representation, "BaseURL"), repBaseUrls = buildBaseUrls(adaptationSetBaseUrls1, repBaseUrlElements), attributes = merge1(adaptationSetAttributes1, parseAttributes(representation)), representationSegmentInfo = getSegmentInformation(representation);
                                return repBaseUrls.map(function(baseUrl) {
                                    return {
                                        segmentInfo: merge1(adaptationSetSegmentInfo, representationSegmentInfo),
                                        attributes: merge1(attributes, {
                                            baseUrl: baseUrl
                                        })
                                    };
                                });
                            })));
                        })));
                    })))
                };
            }, stringToMpdXml = function(manifestString) {
                if ("" === manifestString) throw new Error(errors.DASH_EMPTY_MANIFEST);
                var xml, mpd, parser = new _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_3__.DOMParser();
                try {
                    mpd = (xml = parser.parseFromString(manifestString, "application/xml")) && "MPD" === xml.documentElement.tagName ? xml.documentElement : null;
                } catch (e) {}
                if (!mpd || mpd && mpd.getElementsByTagName("parsererror").length > 0) throw new Error(errors.DASH_INVALID_XML);
                return mpd;
            }, parseUTCTimingScheme = function(mpd) {
                var UTCTimingNode = findChildren(mpd, "UTCTiming")[0];
                if (!UTCTimingNode) return null;
                var attributes = parseAttributes(UTCTimingNode);
                switch(attributes.schemeIdUri){
                    case "urn:mpeg:dash:utc:http-head:2014":
                    case "urn:mpeg:dash:utc:http-head:2012":
                        attributes.method = "HEAD";
                        break;
                    case "urn:mpeg:dash:utc:http-xsdate:2014":
                    case "urn:mpeg:dash:utc:http-iso:2014":
                    case "urn:mpeg:dash:utc:http-xsdate:2012":
                    case "urn:mpeg:dash:utc:http-iso:2012":
                        attributes.method = "GET";
                        break;
                    case "urn:mpeg:dash:utc:direct:2014":
                    case "urn:mpeg:dash:utc:direct:2012":
                        attributes.method = "DIRECT", attributes.value = Date.parse(attributes.value);
                        break;
                    default:
                        throw new Error(errors.UNSUPPORTED_UTC_TIMING_SCHEME);
                }
                return attributes;
            }, parse = function(manifestString, options) {
                void 0 === options && (options = {});
                var parsedManifestInfo = inheritAttributes(stringToMpdXml(manifestString), options), playlists = (0, parsedManifestInfo.representationInfo).map(generateSegments);
                return toM3u8(playlists, parsedManifestInfo.locations, options.sidxMapping);
            }, parseUTCTiming = function(manifestString) {
                return parseUTCTimingScheme(stringToMpdXml(manifestString));
            };
        },
        4221: function(module) {
            module.exports = function(data) {
                var view = new DataView(data.buffer, data.byteOffset, data.byteLength), result = {
                    version: data[0],
                    flags: new Uint8Array(data.subarray(1, 4)),
                    references: [],
                    referenceId: view.getUint32(4),
                    timescale: view.getUint32(8)
                }, i = 12;
                0 === result.version ? (result.earliestPresentationTime = view.getUint32(i), result.firstOffset = view.getUint32(i + 4), i += 8) : (result.earliestPresentationTime = 4294967296 * view.getUint32(i) + view.getUint32(i + 4), result.firstOffset = 4294967296 * view.getUint32(i + 8) + view.getUint32(i + 12), i += 16), i += 2;
                var referenceCount = view.getUint16(i);
                for(i += 2; referenceCount > 0; i += 12, referenceCount--)result.references.push({
                    referenceType: (0x80 & data[i]) >>> 7,
                    referencedSize: 0x7fffffff & view.getUint32(i),
                    subsegmentDuration: view.getUint32(i + 4),
                    startsWithSap: !!(0x80 & data[i + 8]),
                    sapType: (0x70 & data[i + 8]) >>> 4,
                    sapDeltaTime: 0x0fffffff & view.getUint32(i + 8)
                });
                return result;
            };
        },
        1489: function(module) {
            var secondsToVideoTs, secondsToAudioTs, videoTsToSeconds, audioTsToSeconds, audioTsToVideoTs, videoTsToAudioTs, metadataTsToSeconds;
            secondsToVideoTs = function(seconds) {
                return 90000 * seconds;
            }, secondsToAudioTs = function(seconds, sampleRate) {
                return seconds * sampleRate;
            }, videoTsToSeconds = function(timestamp) {
                return timestamp / 90000;
            }, audioTsToSeconds = function(timestamp, sampleRate) {
                return timestamp / sampleRate;
            }, audioTsToVideoTs = function(timestamp, sampleRate) {
                return secondsToVideoTs(audioTsToSeconds(timestamp, sampleRate));
            }, videoTsToAudioTs = function(timestamp, sampleRate) {
                return secondsToAudioTs(videoTsToSeconds(timestamp), sampleRate);
            }, metadataTsToSeconds = function(timestamp, timelineStartPts, keepOriginalTimestamps) {
                return videoTsToSeconds(keepOriginalTimestamps ? timestamp : timestamp - timelineStartPts);
            }, module.exports = {
                ONE_SECOND_IN_TS: 90000,
                secondsToVideoTs: secondsToVideoTs,
                secondsToAudioTs: secondsToAudioTs,
                videoTsToSeconds: videoTsToSeconds,
                audioTsToSeconds: audioTsToSeconds,
                audioTsToVideoTs: audioTsToVideoTs,
                videoTsToAudioTs: videoTsToAudioTs,
                metadataTsToSeconds: metadataTsToSeconds
            };
        },
        8581: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return __webpack_require__(4816);
                }, 
            ]);
        },
        4816: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return Home;
                }
            });
            var jsx_runtime = __webpack_require__(5893), react = __webpack_require__(7294), Home_module = __webpack_require__(214), Home_module_default = __webpack_require__.n(Home_module), video_es = __webpack_require__(5215);
            __webpack_require__(3512);
            var components_VideoJS = function(props) {
                var videoRef = react.useRef(null), playerRef = react.useRef(null), options = props.options, onReady = props.onReady;
                return react.useEffect(function() {
                    if (!playerRef.current) {
                        var videoElement = videoRef.current;
                        if (videoElement) var player = playerRef.current = (0, video_es.Z)(videoElement, options, function() {
                            console.log("player is ready"), onReady && onReady(player);
                        });
                    }
                }, [
                    onReady,
                    options,
                    videoRef
                ]), react.useEffect(function() {
                    return function() {
                        var player = playerRef.current;
                        player && (player.dispose(), playerRef.current = null);
                    };
                }, [
                    playerRef
                ]), (0, jsx_runtime.jsx)("div", {
                    "data-vjs-player": !0,
                    children: (0, jsx_runtime.jsx)("video", {
                        ref: videoRef,
                        className: "video-js vjs-big-play-centered"
                    })
                });
            };
            function Home() {
                var playerRef = (0, react.useRef)(null);
                return (0, jsx_runtime.jsx)("div", {
                    className: Home_module_default().container,
                    children: (0, jsx_runtime.jsx)("main", {
                        className: Home_module_default().main,
                        children: (0, jsx_runtime.jsx)(components_VideoJS, {
                            options: {
                                autoplay: !0,
                                controls: !0,
                                responsive: !0,
                                fluid: !0,
                                sources: [
                                    {
                                        src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
                                        type: "application/x-mpegurl"
                                    }, 
                                ]
                            },
                            onReady: function(player) {
                                playerRef.current = player, player.on("waiting", function() {
                                    console.log("player is waiting");
                                }), player.on("dispose", function() {
                                    console.log("player will dispose");
                                });
                            }
                        })
                    })
                });
            }
        },
        214: function(module) {
            module.exports = {
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
        5974: function(module) {
            module.exports = function(obj, reviver) {
                var json, error = null;
                try {
                    json = JSON.parse(obj, reviver);
                } catch (err) {
                    error = err;
                }
                return [
                    error,
                    json
                ];
            };
        },
        9945: function(module) {
            var URL_REGEX, FIRST_SEGMENT_REGEX, SLASH_DOT_REGEX, SLASH_DOT_DOT_REGEX, URLToolkit;
            URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#[^]*)?$/, FIRST_SEGMENT_REGEX = /^([^\/?#]*)([^]*)$/, SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g, SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g, URLToolkit = {
                buildAbsoluteURL: function(baseURL, relativeURL, opts) {
                    if (opts = opts || {}, baseURL = baseURL.trim(), !(relativeURL = relativeURL.trim())) {
                        if (!opts.alwaysNormalize) return baseURL;
                        var basePartsForNormalise = URLToolkit.parseURL(baseURL);
                        if (!basePartsForNormalise) throw new Error("Error trying to parse base URL.");
                        return basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path), URLToolkit.buildURLFromParts(basePartsForNormalise);
                    }
                    var relativeParts = URLToolkit.parseURL(relativeURL);
                    if (!relativeParts) throw new Error("Error trying to parse relative URL.");
                    if (relativeParts.scheme) return opts.alwaysNormalize ? (relativeParts.path = URLToolkit.normalizePath(relativeParts.path), URLToolkit.buildURLFromParts(relativeParts)) : relativeURL;
                    var baseParts = URLToolkit.parseURL(baseURL);
                    if (!baseParts) throw new Error("Error trying to parse base URL.");
                    if (!baseParts.netLoc && baseParts.path && "/" !== baseParts.path[0]) {
                        var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
                        baseParts.netLoc = pathParts[1], baseParts.path = pathParts[2];
                    }
                    baseParts.netLoc && !baseParts.path && (baseParts.path = "/");
                    var builtParts = {
                        scheme: baseParts.scheme,
                        netLoc: relativeParts.netLoc,
                        path: null,
                        params: relativeParts.params,
                        query: relativeParts.query,
                        fragment: relativeParts.fragment
                    };
                    if (!relativeParts.netLoc && (builtParts.netLoc = baseParts.netLoc, "/" !== relativeParts.path[0])) {
                        if (relativeParts.path) {
                            var baseURLPath = baseParts.path, newPath = baseURLPath.substring(0, baseURLPath.lastIndexOf("/") + 1) + relativeParts.path;
                            builtParts.path = URLToolkit.normalizePath(newPath);
                        } else builtParts.path = baseParts.path, relativeParts.params || (builtParts.params = baseParts.params, relativeParts.query || (builtParts.query = baseParts.query));
                    }
                    return null === builtParts.path && (builtParts.path = opts.alwaysNormalize ? URLToolkit.normalizePath(relativeParts.path) : relativeParts.path), URLToolkit.buildURLFromParts(builtParts);
                },
                parseURL: function(url) {
                    var parts = URL_REGEX.exec(url);
                    return parts ? {
                        scheme: parts[1] || "",
                        netLoc: parts[2] || "",
                        path: parts[3] || "",
                        params: parts[4] || "",
                        query: parts[5] || "",
                        fragment: parts[6] || ""
                    } : null;
                },
                normalizePath: function(path) {
                    for(path = path.split("").reverse().join("").replace(SLASH_DOT_REGEX, ""); path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, "")).length;);
                    return path.split("").reverse().join("");
                },
                buildURLFromParts: function(parts) {
                    return parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment;
                }
            }, module.exports = URLToolkit;
        },
        3407: function(module, __unused_webpack_exports, __webpack_require__) {
            var window = __webpack_require__(8908), vttjs = module.exports = {
                WebVTT: __webpack_require__(3706),
                VTTCue: __webpack_require__(2230),
                VTTRegion: __webpack_require__(3710)
            };
            window.vttjs = vttjs, window.WebVTT = vttjs.WebVTT;
            var cueShim = vttjs.VTTCue, regionShim = vttjs.VTTRegion, nativeVTTCue = window.VTTCue, nativeVTTRegion = window.VTTRegion;
            vttjs.shim = function() {
                window.VTTCue = cueShim, window.VTTRegion = regionShim;
            }, vttjs.restore = function() {
                window.VTTCue = nativeVTTCue, window.VTTRegion = nativeVTTRegion;
            }, window.VTTCue || vttjs.shim();
        },
        3706: function(module, __unused_webpack_exports, __webpack_require__) {
            var document = __webpack_require__(9144), _objCreate = Object.create || function() {
                function F() {}
                return function(o) {
                    if (1 !== arguments.length) throw new Error("Object.create shim only accepts one parameter.");
                    return F.prototype = o, new F();
                };
            }();
            function ParsingError(errorData, message) {
                this.name = "ParsingError", this.code = errorData.code, this.message = message || errorData.message;
            }
            function parseTimeStamp(input) {
                function computeSeconds(h, m, s, f) {
                    return (0 | h) * 3600 + (0 | m) * 60 + (0 | s) + (0 | f) / 1000;
                }
                var m1 = input.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
                return m1 ? m1[3] ? computeSeconds(m1[1], m1[2], m1[3].replace(":", ""), m1[4]) : m1[1] > 59 ? computeSeconds(m1[1], m1[2], 0, m1[4]) : computeSeconds(0, m1[1], m1[2], m1[4]) : null;
            }
            function Settings() {
                this.values = _objCreate(null);
            }
            function parseOptions(input, callback, keyValueDelim, groupDelim) {
                var groups = groupDelim ? input.split(groupDelim) : [
                    input
                ];
                for(var i in groups)if ("string" == typeof groups[i]) {
                    var kv = groups[i].split(keyValueDelim);
                    if (2 === kv.length) {
                        var k = kv[0], v = kv[1];
                        callback(k, v);
                    }
                }
            }
            function parseCue(input2, cue1, regionList) {
                var oInput = input2;
                function consumeTimeStamp() {
                    var ts = parseTimeStamp(input2);
                    if (null === ts) throw new ParsingError(ParsingError.Errors.BadTimeStamp, "Malformed timestamp: " + oInput);
                    return input2 = input2.replace(/^[^\sa-zA-Z-]+/, ""), ts;
                }
                function skipWhitespace() {
                    input2 = input2.replace(/^\s+/, "");
                }
                if (skipWhitespace(), cue1.startTime = consumeTimeStamp(), skipWhitespace(), "-->" !== input2.substr(0, 3)) throw new ParsingError(ParsingError.Errors.BadTimeStamp, "Malformed time stamp (time stamps must be separated by '-->'): " + oInput);
                input2 = input2.substr(3), skipWhitespace(), cue1.endTime = consumeTimeStamp(), skipWhitespace(), function(input, cue) {
                    var settings = new Settings();
                    parseOptions(input, function(k, v) {
                        switch(k){
                            case "region":
                                for(var i = regionList.length - 1; i >= 0; i--)if (regionList[i].id === v) {
                                    settings.set(k, regionList[i].region);
                                    break;
                                }
                                break;
                            case "vertical":
                                settings.alt(k, v, [
                                    "rl",
                                    "lr"
                                ]);
                                break;
                            case "line":
                                var vals = v.split(","), vals0 = vals[0];
                                settings.integer(k, vals0), settings.percent(k, vals0) && settings.set("snapToLines", !1), settings.alt(k, vals0, [
                                    "auto"
                                ]), 2 === vals.length && settings.alt("lineAlign", vals[1], [
                                    "start",
                                    "center",
                                    "end", 
                                ]);
                                break;
                            case "position":
                                vals = v.split(","), settings.percent(k, vals[0]), 2 === vals.length && settings.alt("positionAlign", vals[1], [
                                    "start",
                                    "center",
                                    "end", 
                                ]);
                                break;
                            case "size":
                                settings.percent(k, v);
                                break;
                            case "align":
                                settings.alt(k, v, [
                                    "start",
                                    "center",
                                    "end",
                                    "left",
                                    "right", 
                                ]);
                        }
                    }, /:/, /\s/), cue.region = settings.get("region", null), cue.vertical = settings.get("vertical", "");
                    try {
                        cue.line = settings.get("line", "auto");
                    } catch (e) {}
                    cue.lineAlign = settings.get("lineAlign", "start"), cue.snapToLines = settings.get("snapToLines", !0), cue.size = settings.get("size", 100);
                    try {
                        cue.align = settings.get("align", "center");
                    } catch (e1) {
                        cue.align = settings.get("align", "middle");
                    }
                    try {
                        cue.position = settings.get("position", "auto");
                    } catch (e2) {
                        cue.position = settings.get("position", {
                            start: 0,
                            left: 0,
                            center: 50,
                            middle: 50,
                            end: 100,
                            right: 100
                        }, cue.align);
                    }
                    cue.positionAlign = settings.get("positionAlign", {
                        start: "start",
                        left: "start",
                        center: "center",
                        middle: "center",
                        end: "end",
                        right: "end"
                    }, cue.align);
                }(input2, cue1);
            }
            ParsingError.prototype = _objCreate(Error.prototype), ParsingError.prototype.constructor = ParsingError, ParsingError.Errors = {
                BadSignature: {
                    code: 0,
                    message: "Malformed WebVTT signature."
                },
                BadTimeStamp: {
                    code: 1,
                    message: "Malformed time stamp."
                }
            }, Settings.prototype = {
                set: function(k, v) {
                    this.get(k) || "" === v || (this.values[k] = v);
                },
                get: function(k, dflt, defaultKey) {
                    return defaultKey ? this.has(k) ? this.values[k] : dflt[defaultKey] : this.has(k) ? this.values[k] : dflt;
                },
                has: function(k) {
                    return k in this.values;
                },
                alt: function(k, v, a) {
                    for(var n = 0; n < a.length; ++n)if (v === a[n]) {
                        this.set(k, v);
                        break;
                    }
                },
                integer: function(k, v) {
                    /^-?\d+$/.test(v) && this.set(k, parseInt(v, 10));
                },
                percent: function(k, v) {
                    return !!(v.match(/^([\d]{1,3})(\.[\d]*)?%$/) && (v = parseFloat(v)) >= 0 && v <= 100) && (this.set(k, v), !0);
                }
            };
            var TEXTAREA_ELEMENT = document.createElement && document.createElement("textarea"), TAG_NAME = {
                c: "span",
                i: "i",
                b: "b",
                u: "u",
                ruby: "ruby",
                rt: "rt",
                v: "span",
                lang: "span"
            }, DEFAULT_COLOR_CLASS = {
                white: "rgba(255,255,255,1)",
                lime: "rgba(0,255,0,1)",
                cyan: "rgba(0,255,255,1)",
                red: "rgba(255,0,0,1)",
                yellow: "rgba(255,255,0,1)",
                magenta: "rgba(255,0,255,1)",
                blue: "rgba(0,0,255,1)",
                black: "rgba(0,0,0,1)"
            }, TAG_ANNOTATION = {
                v: "title",
                lang: "lang"
            }, NEEDS_PARENT = {
                rt: "ruby"
            };
            function parseContent(window, input) {
                function nextToken() {
                    if (!input) return null;
                    var result, m = input.match(/^([^<]*)(<[^>]*>?)?/);
                    return result = m[1] ? m[1] : m[2], input = input.substr(result.length), result;
                }
                function unescape(s) {
                    return TEXTAREA_ELEMENT.innerHTML = s, s = TEXTAREA_ELEMENT.textContent, TEXTAREA_ELEMENT.textContent = "", s;
                }
                function shouldAdd(current, element) {
                    return !NEEDS_PARENT[element.localName] || NEEDS_PARENT[element.localName] === current.localName;
                }
                function createElement(type, annotation) {
                    var tagName = TAG_NAME[type];
                    if (!tagName) return null;
                    var element = window.document.createElement(tagName), name = TAG_ANNOTATION[type];
                    return name && annotation && (element[name] = annotation.trim()), element;
                }
                for(var t, rootDiv = window.document.createElement("div"), current1 = rootDiv, tagStack = []; null !== (t = nextToken());){
                    if ("<" === t[0]) {
                        if ("/" === t[1]) {
                            tagStack.length && tagStack[tagStack.length - 1] === t.substr(2).replace(">", "") && (tagStack.pop(), current1 = current1.parentNode);
                            continue;
                        }
                        var node, ts = parseTimeStamp(t.substr(1, t.length - 2));
                        if (ts) {
                            node = window.document.createProcessingInstruction("timestamp", ts), current1.appendChild(node);
                            continue;
                        }
                        var m2 = t.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
                        if (!m2) continue;
                        if (!(node = createElement(m2[1], m2[3]))) continue;
                        if (!shouldAdd(current1, node)) continue;
                        if (m2[2]) {
                            var classes = m2[2].split(".");
                            classes.forEach(function(cl) {
                                var bgColor = /^bg_/.test(cl), colorName = bgColor ? cl.slice(3) : cl;
                                if (DEFAULT_COLOR_CLASS.hasOwnProperty(colorName)) {
                                    var propName = bgColor ? "background-color" : "color", propValue = DEFAULT_COLOR_CLASS[colorName];
                                    node.style[propName] = propValue;
                                }
                            }), node.className = classes.join(" ");
                        }
                        tagStack.push(m2[1]), current1.appendChild(node), current1 = node;
                        continue;
                    }
                    current1.appendChild(window.document.createTextNode(unescape(t)));
                }
                return rootDiv;
            }
            var strongRTLRanges = [
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
            function isStrongRTLChar(charCode) {
                for(var i = 0; i < strongRTLRanges.length; i++){
                    var currentRange = strongRTLRanges[i];
                    if (charCode >= currentRange[0] && charCode <= currentRange[1]) return !0;
                }
                return !1;
            }
            function StyleBox() {}
            function CueStyleBox(window, cue, styleOptions) {
                StyleBox.call(this), this.cue = cue, this.cueDiv = parseContent(window, cue.text);
                var styles = {
                    color: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    position: "relative",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "inline",
                    writingMode: "" === cue.vertical ? "horizontal-tb" : "lr" === cue.vertical ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext"
                };
                this.applyStyles(styles, this.cueDiv), this.div = window.document.createElement("div"), styles = {
                    direction: function(cueDiv) {
                        var nodeStack1 = [], text1 = "";
                        if (!cueDiv || !cueDiv.childNodes) return "ltr";
                        function pushNodes(nodeStack, node) {
                            for(var i = node.childNodes.length - 1; i >= 0; i--)nodeStack.push(node.childNodes[i]);
                        }
                        function nextTextNode(nodeStack) {
                            if (!nodeStack || !nodeStack.length) return null;
                            var node = nodeStack.pop(), text = node.textContent || node.innerText;
                            if (text) {
                                var m = text.match(/^.*(\n|\r)/);
                                return m ? (nodeStack.length = 0, m[0]) : text;
                            }
                            return "ruby" === node.tagName ? nextTextNode(nodeStack) : node.childNodes ? (pushNodes(nodeStack, node), nextTextNode(nodeStack)) : void 0;
                        }
                        for(pushNodes(nodeStack1, cueDiv); text1 = nextTextNode(nodeStack1);)for(var i1 = 0; i1 < text1.length; i1++)if (isStrongRTLChar(text1.charCodeAt(i1))) return "rtl";
                        return "ltr";
                    }(this.cueDiv),
                    writingMode: "" === cue.vertical ? "horizontal-tb" : "lr" === cue.vertical ? "vertical-lr" : "vertical-rl",
                    unicodeBidi: "plaintext",
                    textAlign: "middle" === cue.align ? "center" : cue.align,
                    font: styleOptions.font,
                    whiteSpace: "pre-line",
                    position: "absolute"
                }, this.applyStyles(styles), this.div.appendChild(this.cueDiv);
                var textPos = 0;
                switch(cue.positionAlign){
                    case "start":
                        textPos = cue.position;
                        break;
                    case "center":
                        textPos = cue.position - cue.size / 2;
                        break;
                    case "end":
                        textPos = cue.position - cue.size;
                }
                "" === cue.vertical ? this.applyStyles({
                    left: this.formatStyle(textPos, "%"),
                    width: this.formatStyle(cue.size, "%")
                }) : this.applyStyles({
                    top: this.formatStyle(textPos, "%"),
                    height: this.formatStyle(cue.size, "%")
                }), this.move = function(box) {
                    this.applyStyles({
                        top: this.formatStyle(box.top, "px"),
                        bottom: this.formatStyle(box.bottom, "px"),
                        left: this.formatStyle(box.left, "px"),
                        right: this.formatStyle(box.right, "px"),
                        height: this.formatStyle(box.height, "px"),
                        width: this.formatStyle(box.width, "px")
                    });
                };
            }
            function BoxPosition(obj) {
                var lh, height, width, top;
                if (obj.div) {
                    height = obj.div.offsetHeight, width = obj.div.offsetWidth, top = obj.div.offsetTop;
                    var rects = (rects = obj.div.childNodes) && (rects = rects[0]) && rects.getClientRects && rects.getClientRects();
                    obj = obj.div.getBoundingClientRect(), lh = rects ? Math.max(rects[0] && rects[0].height || 0, obj.height / rects.length) : 0;
                }
                this.left = obj.left, this.right = obj.right, this.top = obj.top || top, this.height = obj.height || height, this.bottom = obj.bottom || top + (obj.height || height), this.width = obj.width || width, this.lineHeight = void 0 !== lh ? lh : obj.lineHeight;
            }
            function moveBoxToLinePosition(window, styleBox, containerBox, boxPositions) {
                var boxPosition = new BoxPosition(styleBox), cue2 = styleBox.cue, linePos = function(cue) {
                    if ("number" == typeof cue.line && (cue.snapToLines || cue.line >= 0 && cue.line <= 100)) return cue.line;
                    if (!cue.track || !cue.track.textTrackList || !cue.track.textTrackList.mediaElement) return -1;
                    for(var track = cue.track, trackList = track.textTrackList, count = 0, i = 0; i < trackList.length && trackList[i] !== track; i++)"showing" === trackList[i].mode && count++;
                    return -1 * ++count;
                }(cue2), axis1 = [];
                if (cue2.snapToLines) {
                    switch(cue2.vertical){
                        case "":
                            axis1 = [
                                "+y",
                                "-y"
                            ], size = "height";
                            break;
                        case "rl":
                            axis1 = [
                                "+x",
                                "-x"
                            ], size = "width";
                            break;
                        case "lr":
                            axis1 = [
                                "-x",
                                "+x"
                            ], size = "width";
                    }
                    var size, step = boxPosition.lineHeight, position = step * Math.round(linePos), maxPosition = containerBox[size] + step, initialAxis = axis1[0];
                    Math.abs(position) > maxPosition && (position = position < 0 ? -1 : 1, position *= Math.ceil(maxPosition / step) * step), linePos < 0 && (position += "" === cue2.vertical ? containerBox.height : containerBox.width, axis1 = axis1.reverse()), boxPosition.move(initialAxis, position);
                } else {
                    var calculatedPercentage = boxPosition.lineHeight / containerBox.height * 100;
                    switch(cue2.lineAlign){
                        case "center":
                            linePos -= calculatedPercentage / 2;
                            break;
                        case "end":
                            linePos -= calculatedPercentage;
                    }
                    switch(cue2.vertical){
                        case "":
                            styleBox.applyStyles({
                                top: styleBox.formatStyle(linePos, "%")
                            });
                            break;
                        case "rl":
                            styleBox.applyStyles({
                                left: styleBox.formatStyle(linePos, "%")
                            });
                            break;
                        case "lr":
                            styleBox.applyStyles({
                                right: styleBox.formatStyle(linePos, "%")
                            });
                    }
                    axis1 = [
                        "+y",
                        "-x",
                        "+x",
                        "-y"
                    ], boxPosition = new BoxPosition(styleBox);
                }
                var bestPosition1 = function(b, axis) {
                    for(var bestPosition, specifiedPosition = new BoxPosition(b), percentage = 1, i = 0; i < axis.length; i++){
                        for(; b.overlapsOppositeAxis(containerBox, axis[i]) || b.within(containerBox) && b.overlapsAny(boxPositions);)b.move(axis[i]);
                        if (b.within(containerBox)) return b;
                        var p = b.intersectPercentage(containerBox);
                        percentage > p && (bestPosition = new BoxPosition(b), percentage = p), b = new BoxPosition(specifiedPosition);
                    }
                    return bestPosition || specifiedPosition;
                }(boxPosition, axis1);
                styleBox.move(bestPosition1.toCSSCompatValues(containerBox));
            }
            function WebVTT() {}
            StyleBox.prototype.applyStyles = function(styles, div) {
                for(var prop in div = div || this.div, styles)styles.hasOwnProperty(prop) && (div.style[prop] = styles[prop]);
            }, StyleBox.prototype.formatStyle = function(val, unit) {
                return 0 === val ? 0 : val + unit;
            }, CueStyleBox.prototype = _objCreate(StyleBox.prototype), CueStyleBox.prototype.constructor = CueStyleBox, BoxPosition.prototype.move = function(axis, toMove) {
                switch(toMove = void 0 !== toMove ? toMove : this.lineHeight, axis){
                    case "+x":
                        this.left += toMove, this.right += toMove;
                        break;
                    case "-x":
                        this.left -= toMove, this.right -= toMove;
                        break;
                    case "+y":
                        this.top += toMove, this.bottom += toMove;
                        break;
                    case "-y":
                        this.top -= toMove, this.bottom -= toMove;
                }
            }, BoxPosition.prototype.overlaps = function(b2) {
                return this.left < b2.right && this.right > b2.left && this.top < b2.bottom && this.bottom > b2.top;
            }, BoxPosition.prototype.overlapsAny = function(boxes) {
                for(var i = 0; i < boxes.length; i++)if (this.overlaps(boxes[i])) return !0;
                return !1;
            }, BoxPosition.prototype.within = function(container) {
                return this.top >= container.top && this.bottom <= container.bottom && this.left >= container.left && this.right <= container.right;
            }, BoxPosition.prototype.overlapsOppositeAxis = function(container, axis) {
                switch(axis){
                    case "+x":
                        return this.left < container.left;
                    case "-x":
                        return this.right > container.right;
                    case "+y":
                        return this.top < container.top;
                    case "-y":
                        return this.bottom > container.bottom;
                }
            }, BoxPosition.prototype.intersectPercentage = function(b2) {
                var x = Math.max(0, Math.min(this.right, b2.right) - Math.max(this.left, b2.left)), y = Math.max(0, Math.min(this.bottom, b2.bottom) - Math.max(this.top, b2.top));
                return x * y / (this.height * this.width);
            }, BoxPosition.prototype.toCSSCompatValues = function(reference) {
                return {
                    top: this.top - reference.top,
                    bottom: reference.bottom - this.bottom,
                    left: this.left - reference.left,
                    right: reference.right - this.right,
                    height: this.height,
                    width: this.width
                };
            }, BoxPosition.getSimpleBoxPosition = function(obj) {
                var height = obj.div ? obj.div.offsetHeight : obj.tagName ? obj.offsetHeight : 0, width = obj.div ? obj.div.offsetWidth : obj.tagName ? obj.offsetWidth : 0, top = obj.div ? obj.div.offsetTop : obj.tagName ? obj.offsetTop : 0;
                obj = obj.div ? obj.div.getBoundingClientRect() : obj.tagName ? obj.getBoundingClientRect() : obj;
                var ret = {
                    left: obj.left,
                    right: obj.right,
                    top: obj.top || top,
                    height: obj.height || height,
                    bottom: obj.bottom || top + (obj.height || height),
                    width: obj.width || width
                };
                return ret;
            }, WebVTT.StringDecoder = function() {
                return {
                    decode: function(data) {
                        if (!data) return "";
                        if ("string" != typeof data) throw new Error("Error - expected string data.");
                        return decodeURIComponent(encodeURIComponent(data));
                    }
                };
            }, WebVTT.convertCueToDOMTree = function(window, cuetext) {
                return window && cuetext ? parseContent(window, cuetext) : null;
            }, WebVTT.processCues = function(window, cues1, overlay) {
                if (!window || !cues1 || !overlay) return null;
                for(; overlay.firstChild;)overlay.removeChild(overlay.firstChild);
                var paddedOverlay = window.document.createElement("div");
                if (paddedOverlay.style.position = "absolute", paddedOverlay.style.left = "0", paddedOverlay.style.right = "0", paddedOverlay.style.top = "0", paddedOverlay.style.bottom = "0", paddedOverlay.style.margin = "1.5%", overlay.appendChild(paddedOverlay), !function(cues) {
                    for(var i = 0; i < cues.length; i++)if (cues[i].hasBeenReset || !cues[i].displayState) return !0;
                    return !1;
                }(cues1)) {
                    for(var i2 = 0; i2 < cues1.length; i2++)paddedOverlay.appendChild(cues1[i2].displayState);
                    return;
                }
                var boxPositions = [], containerBox = BoxPosition.getSimpleBoxPosition(paddedOverlay), styleOptions = {
                    font: Math.round(5 * containerBox.height) / 100 + "px sans-serif"
                };
                !function() {
                    for(var styleBox, cue, i = 0; i < cues1.length; i++)cue = cues1[i], styleBox = new CueStyleBox(window, cue, styleOptions), paddedOverlay.appendChild(styleBox.div), moveBoxToLinePosition(window, styleBox, containerBox, boxPositions), cue.displayState = styleBox.div, boxPositions.push(BoxPosition.getSimpleBoxPosition(styleBox));
                }();
            }, WebVTT.Parser = function(window, vttjs, decoder) {
                decoder || (decoder = vttjs, vttjs = {}), vttjs || (vttjs = {}), this.window = window, this.vttjs = vttjs, this.state = "INITIAL", this.buffer = "", this.decoder = decoder || new TextDecoder("utf8"), this.regionList = [];
            }, WebVTT.Parser.prototype = {
                reportOrThrowError: function(e) {
                    if (e instanceof ParsingError) this.onparsingerror && this.onparsingerror(e);
                    else throw e;
                },
                parse: function(data) {
                    var self = this;
                    function collectNextLine() {
                        for(var buffer = self.buffer, pos = 0; pos < buffer.length && "\r" !== buffer[pos] && "\n" !== buffer[pos];)++pos;
                        var line = buffer.substr(0, pos);
                        return "\r" === buffer[pos] && ++pos, "\n" === buffer[pos] && ++pos, self.buffer = buffer.substr(pos), line;
                    }
                    function parseHeader(input3) {
                        input3.match(/X-TIMESTAMP-MAP/) ? parseOptions(input3, function(k1, v1) {
                            if ("X-TIMESTAMP-MAP" === k1) {
                                var input, settings;
                                input = v1, settings = new Settings(), parseOptions(input, function(k, v) {
                                    switch(k){
                                        case "MPEGT":
                                            settings.integer(k + "S", v);
                                            break;
                                        case "LOCA":
                                            settings.set(k + "L", parseTimeStamp(v));
                                    }
                                }, /[^\d]:/, /,/), self.ontimestampmap && self.ontimestampmap({
                                    MPEGTS: settings.get("MPEGTS"),
                                    LOCAL: settings.get("LOCAL")
                                });
                            }
                        }, /=/) : parseOptions(input3, function(k2, v2) {
                            "Region" === k2 && function(input) {
                                var settings = new Settings();
                                if (parseOptions(input, function(k, v) {
                                    switch(k){
                                        case "id":
                                            settings.set(k, v);
                                            break;
                                        case "width":
                                            settings.percent(k, v);
                                            break;
                                        case "lines":
                                            settings.integer(k, v);
                                            break;
                                        case "regionanchor":
                                        case "viewportanchor":
                                            var xy = v.split(",");
                                            if (2 !== xy.length) break;
                                            var anchor = new Settings();
                                            if (anchor.percent("x", xy[0]), anchor.percent("y", xy[1]), !anchor.has("x") || !anchor.has("y")) break;
                                            settings.set(k + "X", anchor.get("x")), settings.set(k + "Y", anchor.get("y"));
                                            break;
                                        case "scroll":
                                            settings.alt(k, v, [
                                                "up"
                                            ]);
                                    }
                                }, /=/, /\s/), settings.has("id")) {
                                    var region = new (self.vttjs.VTTRegion || self.window.VTTRegion)();
                                    region.width = settings.get("width", 100), region.lines = settings.get("lines", 3), region.regionAnchorX = settings.get("regionanchorX", 0), region.regionAnchorY = settings.get("regionanchorY", 100), region.viewportAnchorX = settings.get("viewportanchorX", 0), region.viewportAnchorY = settings.get("viewportanchorY", 100), region.scroll = settings.get("scroll", ""), self.onregion && self.onregion(region), self.regionList.push({
                                        id: settings.get("id"),
                                        region: region
                                    });
                                }
                            }(v2);
                        }, /:/);
                    }
                    data && (self.buffer += self.decoder.decode(data, {
                        stream: !0
                    }));
                    try {
                        if ("INITIAL" === self.state) {
                            if (!/\r\n|\n/.test(self.buffer)) return this;
                            var line1, m = (line1 = collectNextLine()).match(/^WEBVTT([ \t].*)?$/);
                            if (!m || !m[0]) throw new ParsingError(ParsingError.Errors.BadSignature);
                            self.state = "HEADER";
                        }
                        for(var alreadyCollectedLine = !1; self.buffer && /\r\n|\n/.test(self.buffer);)switch(alreadyCollectedLine ? alreadyCollectedLine = !1 : line1 = collectNextLine(), self.state){
                            case "HEADER":
                                /:/.test(line1) ? parseHeader(line1) : line1 || (self.state = "ID");
                                continue;
                            case "NOTE":
                                line1 || (self.state = "ID");
                                continue;
                            case "ID":
                                if (/^NOTE($|[ \t])/.test(line1)) {
                                    self.state = "NOTE";
                                    break;
                                }
                                if (!line1) continue;
                                self.cue = new (self.vttjs.VTTCue || self.window.VTTCue)(0, 0, "");
                                try {
                                    self.cue.align = "center";
                                } catch (e) {
                                    self.cue.align = "middle";
                                }
                                if (self.state = "CUE", -1 === line1.indexOf("-->")) {
                                    self.cue.id = line1;
                                    continue;
                                }
                            case "CUE":
                                try {
                                    parseCue(line1, self.cue, self.regionList);
                                } catch (e3) {
                                    self.reportOrThrowError(e3), self.cue = null, self.state = "BADCUE";
                                    continue;
                                }
                                self.state = "CUETEXT";
                                continue;
                            case "CUETEXT":
                                var hasSubstring = -1 !== line1.indexOf("-->");
                                if (!line1 || hasSubstring && (alreadyCollectedLine = !0)) {
                                    self.oncue && self.oncue(self.cue), self.cue = null, self.state = "ID";
                                    continue;
                                }
                                self.cue.text && (self.cue.text += "\n"), self.cue.text += line1.replace(/\u2028/g, "\n").replace(/u2029/g, "\n");
                                continue;
                            case "BADCUE":
                                line1 || (self.state = "ID");
                                continue;
                        }
                    } catch (e) {
                        self.reportOrThrowError(e), "CUETEXT" === self.state && self.cue && self.oncue && self.oncue(self.cue), self.cue = null, self.state = "INITIAL" === self.state ? "BADWEBVTT" : "BADCUE";
                    }
                    return this;
                },
                flush: function() {
                    var self = this;
                    try {
                        if (self.buffer += self.decoder.decode(), (self.cue || "HEADER" === self.state) && (self.buffer += "\n\n", self.parse()), "INITIAL" === self.state) throw new ParsingError(ParsingError.Errors.BadSignature);
                    } catch (e) {
                        self.reportOrThrowError(e);
                    }
                    return self.onflush && self.onflush(), this;
                }
            }, module.exports = WebVTT;
        },
        2230: function(module) {
            var directionSetting = {
                "": 1,
                lr: 1,
                rl: 1
            }, alignSetting = {
                start: 1,
                center: 1,
                end: 1,
                left: 1,
                right: 1,
                auto: 1,
                "line-left": 1,
                "line-right": 1
            };
            function findAlignSetting(value) {
                return "string" == typeof value && !!alignSetting[value.toLowerCase()] && value.toLowerCase();
            }
            function VTTCue(startTime, endTime, text) {
                this.hasBeenReset = !1;
                var _id = "", _pauseOnExit = !1, _startTime = startTime, _endTime = endTime, _text = text, _region = null, _vertical = "", _snapToLines = !0, _line = "auto", _lineAlign = "start", _position = "auto", _positionAlign = "auto", _size = 100, _align = "center";
                Object.defineProperties(this, {
                    id: {
                        enumerable: !0,
                        get: function() {
                            return _id;
                        },
                        set: function(value) {
                            _id = "" + value;
                        }
                    },
                    pauseOnExit: {
                        enumerable: !0,
                        get: function() {
                            return _pauseOnExit;
                        },
                        set: function(value) {
                            _pauseOnExit = !!value;
                        }
                    },
                    startTime: {
                        enumerable: !0,
                        get: function() {
                            return _startTime;
                        },
                        set: function(value) {
                            if ("number" != typeof value) throw new TypeError("Start time must be set to a number.");
                            _startTime = value, this.hasBeenReset = !0;
                        }
                    },
                    endTime: {
                        enumerable: !0,
                        get: function() {
                            return _endTime;
                        },
                        set: function(value) {
                            if ("number" != typeof value) throw new TypeError("End time must be set to a number.");
                            _endTime = value, this.hasBeenReset = !0;
                        }
                    },
                    text: {
                        enumerable: !0,
                        get: function() {
                            return _text;
                        },
                        set: function(value) {
                            _text = "" + value, this.hasBeenReset = !0;
                        }
                    },
                    region: {
                        enumerable: !0,
                        get: function() {
                            return _region;
                        },
                        set: function(value) {
                            _region = value, this.hasBeenReset = !0;
                        }
                    },
                    vertical: {
                        enumerable: !0,
                        get: function() {
                            return _vertical;
                        },
                        set: function(value) {
                            var value2, setting = "string" == typeof (value2 = value) && !!directionSetting[value2.toLowerCase()] && value2.toLowerCase();
                            if (!1 === setting) throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
                            _vertical = setting, this.hasBeenReset = !0;
                        }
                    },
                    snapToLines: {
                        enumerable: !0,
                        get: function() {
                            return _snapToLines;
                        },
                        set: function(value) {
                            _snapToLines = !!value, this.hasBeenReset = !0;
                        }
                    },
                    line: {
                        enumerable: !0,
                        get: function() {
                            return _line;
                        },
                        set: function(value) {
                            if ("number" != typeof value && "auto" !== value) throw new SyntaxError("Line: an invalid number or illegal string was specified.");
                            _line = value, this.hasBeenReset = !0;
                        }
                    },
                    lineAlign: {
                        enumerable: !0,
                        get: function() {
                            return _lineAlign;
                        },
                        set: function(value) {
                            var setting = findAlignSetting(value);
                            setting ? (_lineAlign = setting, this.hasBeenReset = !0) : console.warn("lineAlign: an invalid or illegal string was specified.");
                        }
                    },
                    position: {
                        enumerable: !0,
                        get: function() {
                            return _position;
                        },
                        set: function(value) {
                            if (value < 0 || value > 100) throw new Error("Position must be between 0 and 100.");
                            _position = value, this.hasBeenReset = !0;
                        }
                    },
                    positionAlign: {
                        enumerable: !0,
                        get: function() {
                            return _positionAlign;
                        },
                        set: function(value) {
                            var setting = findAlignSetting(value);
                            setting ? (_positionAlign = setting, this.hasBeenReset = !0) : console.warn("positionAlign: an invalid or illegal string was specified.");
                        }
                    },
                    size: {
                        enumerable: !0,
                        get: function() {
                            return _size;
                        },
                        set: function(value) {
                            if (value < 0 || value > 100) throw new Error("Size must be between 0 and 100.");
                            _size = value, this.hasBeenReset = !0;
                        }
                    },
                    align: {
                        enumerable: !0,
                        get: function() {
                            return _align;
                        },
                        set: function(value) {
                            var setting = findAlignSetting(value);
                            if (!setting) throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
                            _align = setting, this.hasBeenReset = !0;
                        }
                    }
                }), this.displayState = void 0;
            }
            VTTCue.prototype.getCueAsHTML = function() {
                return WebVTT.convertCueToDOMTree(window, this.text);
            }, module.exports = VTTCue;
        },
        3710: function(module) {
            var scrollSetting = {
                "": !0,
                up: !0
            };
            function isValidPercentValue(value) {
                return "number" == typeof value && value >= 0 && value <= 100;
            }
            module.exports = function() {
                var _width = 100, _lines = 3, _regionAnchorX = 0, _regionAnchorY = 100, _viewportAnchorX = 0, _viewportAnchorY = 100, _scroll = "";
                Object.defineProperties(this, {
                    width: {
                        enumerable: !0,
                        get: function() {
                            return _width;
                        },
                        set: function(value) {
                            if (!isValidPercentValue(value)) throw new Error("Width must be between 0 and 100.");
                            _width = value;
                        }
                    },
                    lines: {
                        enumerable: !0,
                        get: function() {
                            return _lines;
                        },
                        set: function(value) {
                            if ("number" != typeof value) throw new TypeError("Lines must be set to a number.");
                            _lines = value;
                        }
                    },
                    regionAnchorY: {
                        enumerable: !0,
                        get: function() {
                            return _regionAnchorY;
                        },
                        set: function(value) {
                            if (!isValidPercentValue(value)) throw new Error("RegionAnchorX must be between 0 and 100.");
                            _regionAnchorY = value;
                        }
                    },
                    regionAnchorX: {
                        enumerable: !0,
                        get: function() {
                            return _regionAnchorX;
                        },
                        set: function(value) {
                            if (!isValidPercentValue(value)) throw new Error("RegionAnchorY must be between 0 and 100.");
                            _regionAnchorX = value;
                        }
                    },
                    viewportAnchorY: {
                        enumerable: !0,
                        get: function() {
                            return _viewportAnchorY;
                        },
                        set: function(value) {
                            if (!isValidPercentValue(value)) throw new Error("ViewportAnchorY must be between 0 and 100.");
                            _viewportAnchorY = value;
                        }
                    },
                    viewportAnchorX: {
                        enumerable: !0,
                        get: function() {
                            return _viewportAnchorX;
                        },
                        set: function(value) {
                            if (!isValidPercentValue(value)) throw new Error("ViewportAnchorX must be between 0 and 100.");
                            _viewportAnchorX = value;
                        }
                    },
                    scroll: {
                        enumerable: !0,
                        get: function() {
                            return _scroll;
                        },
                        set: function(value) {
                            var value3, setting = "string" == typeof (value3 = value) && !!scrollSetting[value3.toLowerCase()] && value3.toLowerCase();
                            !1 === setting ? console.warn("Scroll: an invalid or illegal string was specified.") : _scroll = setting;
                        }
                    }
                });
            };
        },
        4782: function(__unused_webpack_module, exports) {
            "use strict";
            exports.byteLength = function(b64) {
                var lens = getLens(b64), validLen = lens[0], placeHoldersLen = lens[1];
                return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
            }, exports.toByteArray = function(b64) {
                var tmp, i, placeHoldersLen, lens = getLens(b64), validLen = lens[0], placeHoldersLen1 = lens[1], arr = new Arr((validLen + (placeHoldersLen = placeHoldersLen1)) * 3 / 4 - placeHoldersLen), curByte = 0, len = placeHoldersLen1 > 0 ? validLen - 4 : validLen;
                for(i = 0; i < len; i += 4)tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)], arr[curByte++] = tmp >> 16 & 0xff, arr[curByte++] = tmp >> 8 & 0xff, arr[curByte++] = 0xff & tmp;
                return 2 === placeHoldersLen1 && (tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4, arr[curByte++] = 0xff & tmp), 1 === placeHoldersLen1 && (tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2, arr[curByte++] = tmp >> 8 & 0xff, arr[curByte++] = 0xff & tmp), arr;
            }, exports.fromByteArray = function(uint8) {
                for(var tmp, len = uint8.length, extraBytes = len % 3, parts = [], i = 0, len2 = len - extraBytes; i < len2; i += 16383)parts.push(encodeChunk(uint8, i, i + 16383 > len2 ? len2 : i + 16383));
                return 1 === extraBytes ? (tmp = uint8[len - 1], parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3f] + "==")) : 2 === extraBytes && (tmp = (uint8[len - 2] << 8) + uint8[len - 1], parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3f] + lookup[tmp << 2 & 0x3f] + "=")), parts.join("");
            };
            for(var lookup = [], revLookup = [], Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i3 = 0, len1 = code.length; i3 < len1; ++i3)lookup[i3] = code[i3], revLookup[code.charCodeAt(i3)] = i3;
            function getLens(b64) {
                var len = b64.length;
                if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var validLen = b64.indexOf("=");
                return -1 === validLen && (validLen = len), [
                    validLen,
                    validLen === len ? 0 : 4 - validLen % 4
                ];
            }
            function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3f] + lookup[num >> 12 & 0x3f] + lookup[num >> 6 & 0x3f] + lookup[0x3f & num];
            }
            function encodeChunk(uint8, start, end) {
                for(var tmp, output = [], i = start; i < end; i += 3)tmp = (uint8[i] << 16 & 0xff0000) + (uint8[i + 1] << 8 & 0xff00) + (0xff & uint8[i + 2]), output.push(tripletToBase64(tmp));
                return output.join("");
            }
            revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63;
        },
        816: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var base64 = __webpack_require__(4782), ieee754 = __webpack_require__(8898), customInspectSymbol = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            function createBuffer(length) {
                if (length > 0x7fffffff) throw new RangeError('The value "' + length + '" is invalid for option "size"');
                var buf = new Uint8Array(length);
                return Object.setPrototypeOf(buf, Buffer.prototype), buf;
            }
            function Buffer(arg, encodingOrOffset, length) {
                if ("number" == typeof arg) {
                    if ("string" == typeof encodingOrOffset) throw new TypeError('The "string" argument must be of type string. Received type number');
                    return allocUnsafe(arg);
                }
                return from(arg, encodingOrOffset, length);
            }
            function from(value, encodingOrOffset, length) {
                if ("string" == typeof value) return fromString(value, encodingOrOffset);
                if (ArrayBuffer.isView(value)) return fromArrayLike(value);
                if (null == value) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
                if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
                if ("undefined" != typeof SharedArrayBuffer && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
                if ("number" == typeof value) throw new TypeError('The "value" argument must not be of type number. Received type number');
                var valueOf = value.valueOf && value.valueOf();
                if (null != valueOf && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
                var b = fromObject(value);
                if (b) return b;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof value[Symbol.toPrimitive]) return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
            }
            function assertSize(size) {
                if ("number" != typeof size) throw new TypeError('"size" argument must be of type number');
                if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
            }
            function allocUnsafe(size) {
                return assertSize(size), createBuffer(size < 0 ? 0 : 0 | checked(size));
            }
            function fromString(string, encoding) {
                if (("string" != typeof encoding || "" === encoding) && (encoding = "utf8"), !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
                var length = 0 | byteLength1(string, encoding), buf = createBuffer(length), actual = buf.write(string, encoding);
                return actual !== length && (buf = buf.slice(0, actual)), buf;
            }
            function fromArrayLike(array) {
                for(var length = array.length < 0 ? 0 : 0 | checked(array.length), buf = createBuffer(length), i = 0; i < length; i += 1)buf[i] = 255 & array[i];
                return buf;
            }
            function fromArrayBuffer(array, byteOffset, length) {
                var buf;
                if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
                if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
                return buf = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length), Object.setPrototypeOf(buf, Buffer.prototype), buf;
            }
            function fromObject(obj) {
                if (Buffer.isBuffer(obj)) {
                    var obj1, len = 0 | checked(obj.length), buf = createBuffer(len);
                    return 0 === buf.length || obj.copy(buf, 0, 0, len), buf;
                }
                return void 0 !== obj.length ? "number" != typeof obj.length || (obj1 = obj.length) != obj1 ? createBuffer(0) : fromArrayLike(obj) : "Buffer" === obj.type && Array.isArray(obj.data) ? fromArrayLike(obj.data) : void 0;
            }
            function checked(length) {
                if (length >= 0x7fffffff) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 0x7fffffff.toString(16) + " bytes");
                return 0 | length;
            }
            function byteLength1(string, encoding) {
                if (Buffer.isBuffer(string)) return string.length;
                if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
                if ("string" != typeof string) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
                var len = string.length, mustMatch = arguments.length > 2 && !0 === arguments[2];
                if (!mustMatch && 0 === len) return 0;
                for(var loweredCase = !1;;)switch(encoding){
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return len;
                    case "utf8":
                    case "utf-8":
                        return utf8ToBytes(string).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * len;
                    case "hex":
                        return len >>> 1;
                    case "base64":
                        return base64ToBytes(string).length;
                    default:
                        if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length;
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0;
                }
            }
            function slowToString(encoding, start, end) {
                var loweredCase = !1;
                if ((void 0 === start || start < 0) && (start = 0), start > this.length) return "";
                if ((void 0 === end || end > this.length) && (end = this.length), end <= 0) return "";
                if ((end >>>= 0) <= (start >>>= 0)) return "";
                for(encoding || (encoding = "utf8");;)switch(encoding){
                    case "hex":
                        return hexSlice(this, start, end);
                    case "utf8":
                    case "utf-8":
                        return utf8Slice(this, start, end);
                    case "ascii":
                        return asciiSlice(this, start, end);
                    case "latin1":
                    case "binary":
                        return latin1Slice(this, start, end);
                    case "base64":
                        return base64Slice(this, start, end);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return utf16leSlice(this, start, end);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = (encoding + "").toLowerCase(), loweredCase = !0;
                }
            }
            function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m], b[m] = i;
            }
            function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                var obj;
                if (0 === buffer.length) return -1;
                if ("string" == typeof byteOffset ? (encoding = byteOffset, byteOffset = 0) : byteOffset > 0x7fffffff ? byteOffset = 0x7fffffff : byteOffset < -2147483648 && (byteOffset = -2147483648), (obj = byteOffset = +byteOffset) != obj && (byteOffset = dir ? 0 : buffer.length - 1), byteOffset < 0 && (byteOffset = buffer.length + byteOffset), byteOffset >= buffer.length) {
                    if (dir) return -1;
                    byteOffset = buffer.length - 1;
                } else if (byteOffset < 0) {
                    if (!dir) return -1;
                    byteOffset = 0;
                }
                if ("string" == typeof val && (val = Buffer.from(val, encoding)), Buffer.isBuffer(val)) return 0 === val.length ? -1 : arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                if ("number" == typeof val) return (val &= 0xff, "function" == typeof Uint8Array.prototype.indexOf) ? dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset) : arrayIndexOf(buffer, [
                    val
                ], byteOffset, encoding, dir);
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var i4, indexSize = 1, arrLength = arr.length, valLength = val.length;
                if (void 0 !== encoding && ("ucs2" === (encoding = String(encoding).toLowerCase()) || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding)) {
                    if (arr.length < 2 || val.length < 2) return -1;
                    indexSize = 2, arrLength /= 2, valLength /= 2, byteOffset /= 2;
                }
                function read(buf, i) {
                    return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
                }
                if (dir) {
                    var foundIndex = -1;
                    for(i4 = byteOffset; i4 < arrLength; i4++)if (read(arr, i4) === read(val, -1 === foundIndex ? 0 : i4 - foundIndex)) {
                        if (-1 === foundIndex && (foundIndex = i4), i4 - foundIndex + 1 === valLength) return foundIndex * indexSize;
                    } else -1 !== foundIndex && (i4 -= i4 - foundIndex), foundIndex = -1;
                } else for(byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength), i4 = byteOffset; i4 >= 0; i4--){
                    for(var found = !0, j = 0; j < valLength; j++)if (read(arr, i4 + j) !== read(val, j)) {
                        found = !1;
                        break;
                    }
                    if (found) return i4;
                }
                return -1;
            }
            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                length ? (length = Number(length)) > remaining && (length = remaining) : length = remaining;
                var strLen = string.length;
                length > strLen / 2 && (length = strLen / 2);
                for(var i = 0; i < length; ++i){
                    var obj, parsed = parseInt(string.substr(2 * i, 2), 16);
                    if ((obj = parsed) != obj) break;
                    buf[offset + i] = parsed;
                }
                return i;
            }
            function utf8Write(buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
            }
            function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length);
            }
            function latin1Write(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length);
            }
            function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length);
            }
            function ucs2Write(buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
            }
            function base64Slice(buf, start, end) {
                return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
            }
            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                for(var res = [], i = start; i < end;){
                    var secondByte, thirdByte, fourthByte, tempCodePoint, firstByte = buf[i], codePoint = null, bytesPerSequence = firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;
                    if (i + bytesPerSequence <= end) switch(bytesPerSequence){
                        case 1:
                            firstByte < 0x80 && (codePoint = firstByte);
                            break;
                        case 2:
                            (0xc0 & (secondByte = buf[i + 1])) == 0x80 && (tempCodePoint = (0x1f & firstByte) << 0x6 | 0x3f & secondByte) > 0x7f && (codePoint = tempCodePoint);
                            break;
                        case 3:
                            secondByte = buf[i + 1], thirdByte = buf[i + 2], (0xc0 & secondByte) == 0x80 && (0xc0 & thirdByte) == 0x80 && (tempCodePoint = (0xf & firstByte) << 0xc | (0x3f & secondByte) << 0x6 | 0x3f & thirdByte) > 0x7ff && (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff) && (codePoint = tempCodePoint);
                            break;
                        case 4:
                            secondByte = buf[i + 1], thirdByte = buf[i + 2], fourthByte = buf[i + 3], (0xc0 & secondByte) == 0x80 && (0xc0 & thirdByte) == 0x80 && (0xc0 & fourthByte) == 0x80 && (tempCodePoint = (0xf & firstByte) << 0x12 | (0x3f & secondByte) << 0xc | (0x3f & thirdByte) << 0x6 | 0x3f & fourthByte) > 0xffff && tempCodePoint < 0x110000 && (codePoint = tempCodePoint);
                    }
                    null === codePoint ? (codePoint = 0xfffd, bytesPerSequence = 1) : codePoint > 0xffff && (codePoint -= 0x10000, res.push(codePoint >>> 10 & 0x3ff | 0xd800), codePoint = 0xdc00 | 0x3ff & codePoint), res.push(codePoint), i += bytesPerSequence;
                }
                return decodeCodePointsArray(res);
            }
            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= 0x1000) return String.fromCharCode.apply(String, codePoints);
                for(var res = "", i = 0; i < len;)res += String.fromCharCode.apply(String, codePoints.slice(i, i += 0x1000));
                return res;
            }
            function asciiSlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for(var i = start; i < end; ++i)ret += String.fromCharCode(0x7f & buf[i]);
                return ret;
            }
            function latin1Slice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
                return ret;
            }
            function hexSlice(buf, start, end) {
                var len = buf.length;
                (!start || start < 0) && (start = 0), (!end || end < 0 || end > len) && (end = len);
                for(var out = "", i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
                return out;
            }
            function utf16leSlice(buf, start, end) {
                for(var bytes = buf.slice(start, end), res = "", i = 0; i < bytes.length; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                return res;
            }
            function checkOffset(offset, ext, length) {
                if (offset % 1 != 0 || offset < 0) throw new RangeError("offset is not uint");
                if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
            }
            function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length) throw new RangeError("Index out of range");
            }
            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length) throw new RangeError("Index out of range");
                if (offset < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -340282346638528860000000000000000000000), ieee754.write(buf, value, offset, littleEndian, 23, 4), offset + 4;
            }
            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), ieee754.write(buf, value, offset, littleEndian, 52, 8), offset + 8;
            }
            exports.Buffer = Buffer, exports.SlowBuffer = function(length) {
                return +length != length && (length = 0), Buffer.alloc(+length);
            }, exports.INSPECT_MAX_BYTES = 50, exports.kMaxLength = 0x7fffffff, Buffer.TYPED_ARRAY_SUPPORT = function() {
                try {
                    var arr = new Uint8Array(1), proto = {
                        foo: function() {
                            return 42;
                        }
                    };
                    return Object.setPrototypeOf(proto, Uint8Array.prototype), Object.setPrototypeOf(arr, proto), 42 === arr.foo();
                } catch (e) {
                    return !1;
                }
            }(), Buffer.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (Buffer.isBuffer(this)) return this.buffer;
                }
            }), Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (Buffer.isBuffer(this)) return this.byteOffset;
                }
            }), Buffer.poolSize = 8192, Buffer.from = function(value, encodingOrOffset, length) {
                return from(value, encodingOrOffset, length);
            }, Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer, Uint8Array), Buffer.alloc = function(size, fill, encoding) {
                var size1, fill1, encoding1;
                return size1 = size, fill1 = fill, encoding1 = encoding, (assertSize(size1), size1 <= 0) ? createBuffer(size1) : void 0 !== fill1 ? "string" == typeof encoding1 ? createBuffer(size1).fill(fill1, encoding1) : createBuffer(size1).fill(fill1) : createBuffer(size1);
            }, Buffer.allocUnsafe = function(size) {
                return allocUnsafe(size);
            }, Buffer.allocUnsafeSlow = function(size) {
                return allocUnsafe(size);
            }, Buffer.isBuffer = function(b) {
                return null != b && !0 === b._isBuffer && b !== Buffer.prototype;
            }, Buffer.compare = function(a, b) {
                if (isInstance(a, Uint8Array) && (a = Buffer.from(a, a.offset, a.byteLength)), isInstance(b, Uint8Array) && (b = Buffer.from(b, b.offset, b.byteLength)), !Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (a === b) return 0;
                for(var x = a.length, y = b.length, i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                    x = a[i], y = b[i];
                    break;
                }
                return x < y ? -1 : y < x ? 1 : 0;
            }, Buffer.isEncoding = function(encoding) {
                switch(String(encoding).toLowerCase()){
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
                        return !0;
                    default:
                        return !1;
                }
            }, Buffer.concat = function(list, length) {
                if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === list.length) return Buffer.alloc(0);
                if (void 0 === length) for(i = 0, length = 0; i < list.length; ++i)length += list[i].length;
                var i, buffer = Buffer.allocUnsafe(length), pos = 0;
                for(i = 0; i < list.length; ++i){
                    var buf = list[i];
                    if (isInstance(buf, Uint8Array) && (buf = Buffer.from(buf)), !Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
                    buf.copy(buffer, pos), pos += buf.length;
                }
                return buffer;
            }, Buffer.byteLength = byteLength1, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
                var len = this.length;
                if (len % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
                return this;
            }, Buffer.prototype.swap32 = function() {
                var len = this.length;
                if (len % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for(var i = 0; i < len; i += 4)swap(this, i, i + 3), swap(this, i + 1, i + 2);
                return this;
            }, Buffer.prototype.swap64 = function() {
                var len = this.length;
                if (len % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for(var i = 0; i < len; i += 8)swap(this, i, i + 7), swap(this, i + 1, i + 6), swap(this, i + 2, i + 5), swap(this, i + 3, i + 4);
                return this;
            }, Buffer.prototype.toString = function() {
                var length = this.length;
                return 0 === length ? "" : 0 === arguments.length ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments);
            }, Buffer.prototype.toLocaleString = Buffer.prototype.toString, Buffer.prototype.equals = function(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                return this === b || 0 === Buffer.compare(this, b);
            }, Buffer.prototype.inspect = function() {
                var str = "", max = exports.INSPECT_MAX_BYTES;
                return str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim(), this.length > max && (str += " ... "), "<Buffer " + str + ">";
            }, customInspectSymbol && (Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect), Buffer.prototype.compare = function(target, start, end, thisStart, thisEnd) {
                if (isInstance(target, Uint8Array) && (target = Buffer.from(target, target.offset, target.byteLength)), !Buffer.isBuffer(target)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
                if (void 0 === start && (start = 0), void 0 === end && (end = target ? target.length : 0), void 0 === thisStart && (thisStart = 0), void 0 === thisEnd && (thisEnd = this.length), start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
                if (thisStart >= thisEnd && start >= end) return 0;
                if (thisStart >= thisEnd) return -1;
                if (start >= end) return 1;
                if (start >>>= 0, end >>>= 0, thisStart >>>= 0, thisEnd >>>= 0, this === target) return 0;
                for(var x = thisEnd - thisStart, y = end - start, len = Math.min(x, y), thisCopy = this.slice(thisStart, thisEnd), targetCopy = target.slice(start, end), i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                    x = thisCopy[i], y = targetCopy[i];
                    break;
                }
                return x < y ? -1 : y < x ? 1 : 0;
            }, Buffer.prototype.includes = function(val, byteOffset, encoding) {
                return -1 !== this.indexOf(val, byteOffset, encoding);
            }, Buffer.prototype.indexOf = function(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, !0);
            }, Buffer.prototype.lastIndexOf = function(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, !1);
            }, Buffer.prototype.write = function(string, offset, length, encoding) {
                if (void 0 === offset) encoding = "utf8", length = this.length, offset = 0;
                else if (void 0 === length && "string" == typeof offset) encoding = offset, length = this.length, offset = 0;
                else if (isFinite(offset)) offset >>>= 0, isFinite(length) ? (length >>>= 0, void 0 === encoding && (encoding = "utf8")) : (encoding = length, length = void 0);
                else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                var remaining = this.length - offset;
                if ((void 0 === length || length > remaining) && (length = remaining), string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                encoding || (encoding = "utf8");
                for(var loweredCase = !1;;)switch(encoding){
                    case "hex":
                        return hexWrite(this, string, offset, length);
                    case "utf8":
                    case "utf-8":
                        return utf8Write(this, string, offset, length);
                    case "ascii":
                        return asciiWrite(this, string, offset, length);
                    case "latin1":
                    case "binary":
                        return latin1Write(this, string, offset, length);
                    case "base64":
                        return base64Write(this, string, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return ucs2Write(this, string, offset, length);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0;
                }
            }, Buffer.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            }, Buffer.prototype.slice = function(start, end) {
                var len = this.length;
                start = ~~start, end = void 0 === end ? len : ~~end, start < 0 ? (start += len) < 0 && (start = 0) : start > len && (start = len), end < 0 ? (end += len) < 0 && (end = 0) : end > len && (end = len), end < start && (end = start);
                var newBuf = this.subarray(start, end);
                return Object.setPrototypeOf(newBuf, Buffer.prototype), newBuf;
            }, Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
                offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                return val;
            }, Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
                offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset + --byteLength], mul = 1; byteLength > 0 && (mul *= 0x100);)val += this[offset + --byteLength] * mul;
                return val;
            }, Buffer.prototype.readUInt8 = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 1, this.length), this[offset];
            }, Buffer.prototype.readUInt16LE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8;
            }, Buffer.prototype.readUInt16BE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1];
            }, Buffer.prototype.readUInt32LE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
            }, Buffer.prototype.readUInt32BE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
            }, Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
                offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
            }, Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
                offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var i = byteLength, mul = 1, val = this[offset + --i]; i > 0 && (mul *= 0x100);)val += this[offset + --i] * mul;
                return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
            }, Buffer.prototype.readInt8 = function(offset, noAssert) {
                return (offset >>>= 0, noAssert || checkOffset(offset, 1, this.length), 0x80 & this[offset]) ? -((0xff - this[offset] + 1) * 1) : this[offset];
            }, Buffer.prototype.readInt16LE = function(offset, noAssert) {
                offset >>>= 0, noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return 0x8000 & val ? 0xffff0000 | val : val;
            }, Buffer.prototype.readInt16BE = function(offset, noAssert) {
                offset >>>= 0, noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return 0x8000 & val ? 0xffff0000 | val : val;
            }, Buffer.prototype.readInt32LE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
            }, Buffer.prototype.readInt32BE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
            }, Buffer.prototype.readFloatLE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !0, 23, 4);
            }, Buffer.prototype.readFloatBE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !1, 23, 4);
            }, Buffer.prototype.readDoubleLE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !0, 52, 8);
            }, Buffer.prototype.readDoubleBE = function(offset, noAssert) {
                return offset >>>= 0, noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !1, 52, 8);
            }, Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset >>>= 0, byteLength >>>= 0, !noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0);
                }
                var mul = 1, i = 0;
                for(this[offset] = 0xff & value; ++i < byteLength && (mul *= 0x100);)this[offset + i] = value / mul & 0xff;
                return offset + byteLength;
            }, Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset >>>= 0, byteLength >>>= 0, !noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0);
                }
                var i = byteLength - 1, mul = 1;
                for(this[offset + i] = 0xff & value; --i >= 0 && (mul *= 0x100);)this[offset + i] = value / mul & 0xff;
                return offset + byteLength;
            }, Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 1, 0xff, 0), this[offset] = 0xff & value, offset + 1;
            }, Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, offset + 2;
            }, Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), this[offset] = value >>> 8, this[offset + 1] = 0xff & value, offset + 2;
            }, Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = 0xff & value, offset + 4;
            }, Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value, offset + 4;
            }, Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset >>>= 0, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = 0, mul = 1, sub = 0;
                for(this[offset] = 0xff & value; ++i < byteLength && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xff;
                return offset + byteLength;
            }, Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset >>>= 0, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = byteLength - 1, mul = 1, sub = 0;
                for(this[offset + i] = 0xff & value; --i >= 0 && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xff;
                return offset + byteLength;
            }, Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 1, 0x7f, -128), value < 0 && (value = 0xff + value + 1), this[offset] = 0xff & value, offset + 1;
            }, Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, offset + 2;
            }, Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), this[offset] = value >>> 8, this[offset + 1] = 0xff & value, offset + 2;
            }, Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24, offset + 4;
            }, Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
                return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), value < 0 && (value = 0xffffffff + value + 1), this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value, offset + 4;
            }, Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !0, noAssert);
            }, Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !1, noAssert);
            }, Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !0, noAssert);
            }, Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !1, noAssert);
            }, Buffer.prototype.copy = function(target, targetStart, start, end) {
                if (!Buffer.isBuffer(target)) throw new TypeError("argument should be a Buffer");
                if (start || (start = 0), end || 0 === end || (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && end < start && (end = start), end === start) return 0;
                if (0 === target.length || 0 === this.length) return 0;
                if (targetStart < 0) throw new RangeError("targetStart out of bounds");
                if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
                if (end < 0) throw new RangeError("sourceEnd out of bounds");
                end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
                var len = end - start;
                if (this === target && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(targetStart, start, end);
                else if (this === target && start < targetStart && targetStart < end) for(var i = len - 1; i >= 0; --i)target[i + targetStart] = this[i + start];
                else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
                return len;
            }, Buffer.prototype.fill = function(val, start, end, encoding) {
                if ("string" == typeof val) {
                    if ("string" == typeof start ? (encoding = start, start = 0, end = this.length) : "string" == typeof end && (encoding = end, end = this.length), void 0 !== encoding && "string" != typeof encoding) throw new TypeError("encoding must be a string");
                    if ("string" == typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
                    if (1 === val.length) {
                        var i, code = val.charCodeAt(0);
                        ("utf8" === encoding && code < 128 || "latin1" === encoding) && (val = code);
                    }
                } else "number" == typeof val ? val &= 255 : "boolean" == typeof val && (val = Number(val));
                if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
                if (end <= start) return this;
                if (start >>>= 0, end = void 0 === end ? this.length : end >>> 0, val || (val = 0), "number" == typeof val) for(i = start; i < end; ++i)this[i] = val;
                else {
                    var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding), len = bytes.length;
                    if (0 === len) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
                    for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
                }
                return this;
            };
            var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
            function utf8ToBytes(string, units) {
                units = units || 1 / 0;
                for(var codePoint, length = string.length, leadSurrogate = null, bytes = [], i = 0; i < length; ++i){
                    if ((codePoint = string.charCodeAt(i)) > 0xd7ff && codePoint < 0xe000) {
                        if (!leadSurrogate) {
                            if (codePoint > 0xdbff) {
                                (units -= 3) > -1 && bytes.push(0xef, 0xbf, 0xbd);
                                continue;
                            }
                            if (i + 1 === length) {
                                (units -= 3) > -1 && bytes.push(0xef, 0xbf, 0xbd);
                                continue;
                            }
                            leadSurrogate = codePoint;
                            continue;
                        }
                        if (codePoint < 0xdc00) {
                            (units -= 3) > -1 && bytes.push(0xef, 0xbf, 0xbd), leadSurrogate = codePoint;
                            continue;
                        }
                        codePoint = (leadSurrogate - 0xd800 << 10 | codePoint - 0xdc00) + 0x10000;
                    } else leadSurrogate && (units -= 3) > -1 && bytes.push(0xef, 0xbf, 0xbd);
                    if (leadSurrogate = null, codePoint < 0x80) {
                        if ((units -= 1) < 0) break;
                        bytes.push(codePoint);
                    } else if (codePoint < 0x800) {
                        if ((units -= 2) < 0) break;
                        bytes.push(codePoint >> 0x6 | 0xc0, 0x3f & codePoint | 0x80);
                    } else if (codePoint < 0x10000) {
                        if ((units -= 3) < 0) break;
                        bytes.push(codePoint >> 0xc | 0xe0, codePoint >> 0x6 & 0x3f | 0x80, 0x3f & codePoint | 0x80);
                    } else if (codePoint < 0x110000) {
                        if ((units -= 4) < 0) break;
                        bytes.push(codePoint >> 0x12 | 0xf0, codePoint >> 0xc & 0x3f | 0x80, codePoint >> 0x6 & 0x3f | 0x80, 0x3f & codePoint | 0x80);
                    } else throw new Error("Invalid code point");
                }
                return bytes;
            }
            function asciiToBytes(str) {
                for(var byteArray = [], i = 0; i < str.length; ++i)byteArray.push(0xff & str.charCodeAt(i));
                return byteArray;
            }
            function utf16leToBytes(str, units) {
                for(var c, hi, lo, byteArray = [], i = 0; i < str.length && !((units -= 2) < 0); ++i)hi = (c = str.charCodeAt(i)) >> 8, lo = c % 256, byteArray.push(lo), byteArray.push(hi);
                return byteArray;
            }
            function base64ToBytes(str1) {
                return base64.toByteArray(function(str) {
                    if ((str = (str = str.split("=")[0]).trim().replace(INVALID_BASE64_RE, "")).length < 2) return "";
                    for(; str.length % 4 != 0;)str += "=";
                    return str;
                }(str1));
            }
            function blitBuffer(src, dst, offset, length) {
                for(var i = 0; i < length && !(i + offset >= dst.length) && !(i >= src.length); ++i)dst[i + offset] = src[i];
                return i;
            }
            function isInstance(obj, type) {
                return obj instanceof type || null != obj && null != obj.constructor && null != obj.constructor.name && obj.constructor.name === type.name;
            }
            var hexSliceLookupTable = function() {
                for(var alphabet = "0123456789abcdef", table = new Array(256), i = 0; i < 16; ++i)for(var i16 = 16 * i, j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
                return table;
            }();
        },
        8898: function(__unused_webpack_module, exports) {
            exports.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i = isLE ? nBytes - 1 : 0, d = isLE ? -1 : 1, s = buffer[offset + i];
                for(i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
                for(m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
                if (0 === e) e = 1 - eBias;
                else {
                    if (e === eMax) return m ? NaN : (s ? -1 : 1) * (1 / 0);
                    m += Math.pow(2, mLen), e -= eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            }, exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = 23 === mLen ? 0.00000005960464477539062 : 0, i = isLE ? 0 : nBytes - 1, d = isLE ? 1 : -1, s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
                for(isNaN(value = Math.abs(value)) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, c *= 2), e + eBias >= 1 ? value += rt / c : value += rt * Math.pow(2, 1 - eBias), value * c >= 2 && (e++, c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
                for(e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
                buffer[offset + i - d] |= 128 * s;
            };
        },
        7579: function() {},
        7326: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _assertThisInitialized(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _assertThisInitialized;
                }
            });
        },
        8852: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _construct;
                }
            });
            var setPrototypeOf = __webpack_require__(9611);
            function _construct(Parent1, args1, Class1) {
                return (_construct = !function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }() ? function(Parent, args, Class) {
                    var a = [
                        null
                    ];
                    a.push.apply(a, args);
                    var instance = new (Function.bind.apply(Parent, a))();
                    return Class && (0, setPrototypeOf.Z)(instance, Class.prototype), instance;
                } : Reflect.construct).apply(null, arguments);
            }
        },
        7462: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _extends() {
                return (_extends = Object.assign || function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _extends;
                }
            });
        },
        136: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _inherits;
                }
            });
            var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9611);
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                Object.defineProperty(subClass, "prototype", {
                    value: Object.create(superClass && superClass.prototype, {
                        constructor: {
                            value: subClass,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    writable: !1
                }), superClass && (0, _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__.Z)(subClass, superClass);
            }
        },
        4578: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _inheritsLoose;
                }
            });
            var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9611);
            function _inheritsLoose(subClass, superClass) {
                subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, (0, _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__.Z)(subClass, superClass);
            }
        },
        9611: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            function _setPrototypeOf(o1, p1) {
                return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o1, p1);
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _setPrototypeOf;
                }
            });
        }
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            544,
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 8581);
        }), _N_E = __webpack_require__.O();
    }, 
]);
