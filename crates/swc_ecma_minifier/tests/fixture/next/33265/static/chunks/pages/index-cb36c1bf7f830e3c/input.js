(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 7154:
/***/ (function(module) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}

module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 562:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ki": function() { return /* binding */ toUint8; },
/* harmony export */   "tm": function() { return /* binding */ bytesToNumber; },
/* harmony export */   "hL": function() { return /* binding */ numberToBytes; },
/* harmony export */   "d3": function() { return /* binding */ bytesToString; },
/* harmony export */   "qX": function() { return /* binding */ stringToBytes; },
/* harmony export */   "lx": function() { return /* binding */ concatTypedArrays; },
/* harmony export */   "G3": function() { return /* binding */ bytesMatch; }
/* harmony export */ });
/* unused harmony exports countBits, countBytes, padStart, isTypedArray, toHexString, toBinaryString, ENDIANNESS, IS_BIG_ENDIAN, IS_LITTLE_ENDIAN, sliceBytes, reverseBytes */
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__);
 // const log2 = Math.log2 ? Math.log2 : (x) => (Math.log(x) / Math.log(2));

var repeat = function repeat(str, len) {
  var acc = '';

  while (len--) {
    acc += str;
  }

  return acc;
}; // count the number of bits it would take to represent a number
// we used to do this with log2 but BigInt does not support builtin math
// Math.ceil(log2(x));


var countBits = function countBits(x) {
  return x.toString(2).length;
}; // count the number of whole bytes it would take to represent a number

var countBytes = function countBytes(x) {
  return Math.ceil(countBits(x) / 8);
};
var padStart = function padStart(b, len, str) {
  if (str === void 0) {
    str = ' ';
  }

  return (repeat(str, len) + b.toString()).slice(-len);
};
var isTypedArray = function isTypedArray(obj) {
  return ArrayBuffer.isView(obj);
};
var toUint8 = function toUint8(bytes) {
  if (bytes instanceof Uint8Array) {
    return bytes;
  }

  if (!Array.isArray(bytes) && !isTypedArray(bytes) && !(bytes instanceof ArrayBuffer)) {
    // any non-number or NaN leads to empty uint8array
    // eslint-disable-next-line
    if (typeof bytes !== 'number' || typeof bytes === 'number' && bytes !== bytes) {
      bytes = 0;
    } else {
      bytes = [bytes];
    }
  }

  return new Uint8Array(bytes && bytes.buffer || bytes, bytes && bytes.byteOffset || 0, bytes && bytes.byteLength || 0);
};
var toHexString = function toHexString(bytes) {
  bytes = toUint8(bytes);
  var str = '';

  for (var i = 0; i < bytes.length; i++) {
    str += padStart(bytes[i].toString(16), 2, '0');
  }

  return str;
};
var toBinaryString = function toBinaryString(bytes) {
  bytes = toUint8(bytes);
  var str = '';

  for (var i = 0; i < bytes.length; i++) {
    str += padStart(bytes[i].toString(2), 8, '0');
  }

  return str;
};
var BigInt = (global_window__WEBPACK_IMPORTED_MODULE_0___default().BigInt) || Number;
var BYTE_TABLE = [BigInt('0x1'), BigInt('0x100'), BigInt('0x10000'), BigInt('0x1000000'), BigInt('0x100000000'), BigInt('0x10000000000'), BigInt('0x1000000000000'), BigInt('0x100000000000000'), BigInt('0x10000000000000000')];
var ENDIANNESS = function () {
  var a = new Uint16Array([0xFFCC]);
  var b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);

  if (b[0] === 0xFF) {
    return 'big';
  }

  if (b[0] === 0xCC) {
    return 'little';
  }

  return 'unknown';
}();
var IS_BIG_ENDIAN = ENDIANNESS === 'big';
var IS_LITTLE_ENDIAN = ENDIANNESS === 'little';
var bytesToNumber = function bytesToNumber(bytes, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$signed = _ref.signed,
      signed = _ref$signed === void 0 ? false : _ref$signed,
      _ref$le = _ref.le,
      le = _ref$le === void 0 ? false : _ref$le;

  bytes = toUint8(bytes);
  var fn = le ? 'reduce' : 'reduceRight';
  var obj = bytes[fn] ? bytes[fn] : Array.prototype[fn];
  var number = obj.call(bytes, function (total, byte, i) {
    var exponent = le ? i : Math.abs(i + 1 - bytes.length);
    return total + BigInt(byte) * BYTE_TABLE[exponent];
  }, BigInt(0));

  if (signed) {
    var max = BYTE_TABLE[bytes.length] / BigInt(2) - BigInt(1);
    number = BigInt(number);

    if (number > max) {
      number -= max;
      number -= max;
      number -= BigInt(2);
    }
  }

  return Number(number);
};
var numberToBytes = function numberToBytes(number, _temp2) {
  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$le = _ref2.le,
      le = _ref2$le === void 0 ? false : _ref2$le;

  // eslint-disable-next-line
  if (typeof number !== 'bigint' && typeof number !== 'number' || typeof number === 'number' && number !== number) {
    number = 0;
  }

  number = BigInt(number);
  var byteCount = countBytes(number);
  var bytes = new Uint8Array(new ArrayBuffer(byteCount));

  for (var i = 0; i < byteCount; i++) {
    var byteIndex = le ? i : Math.abs(i + 1 - bytes.length);
    bytes[byteIndex] = Number(number / BYTE_TABLE[i] & BigInt(0xFF));

    if (number < 0) {
      bytes[byteIndex] = Math.abs(~bytes[byteIndex]);
      bytes[byteIndex] -= i === 0 ? 1 : 2;
    }
  }

  return bytes;
};
var bytesToString = function bytesToString(bytes) {
  if (!bytes) {
    return '';
  } // TODO: should toUint8 handle cases where we only have 8 bytes
  // but report more since this is a Uint16+ Array?


  bytes = Array.prototype.slice.call(bytes);
  var string = String.fromCharCode.apply(null, toUint8(bytes));

  try {
    return decodeURIComponent(escape(string));
  } catch (e) {// if decodeURIComponent/escape fails, we are dealing with partial
    // or full non string data. Just return the potentially garbled string.
  }

  return string;
};
var stringToBytes = function stringToBytes(string, stringIsBytes) {
  if (typeof string !== 'string' && string && typeof string.toString === 'function') {
    string = string.toString();
  }

  if (typeof string !== 'string') {
    return new Uint8Array();
  } // If the string already is bytes, we don't have to do this
  // otherwise we do this so that we split multi length characters
  // into individual bytes


  if (!stringIsBytes) {
    string = unescape(encodeURIComponent(string));
  }

  var view = new Uint8Array(string.length);

  for (var i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }

  return view;
};
var concatTypedArrays = function concatTypedArrays() {
  for (var _len = arguments.length, buffers = new Array(_len), _key = 0; _key < _len; _key++) {
    buffers[_key] = arguments[_key];
  }

  buffers = buffers.filter(function (b) {
    return b && (b.byteLength || b.length) && typeof b !== 'string';
  });

  if (buffers.length <= 1) {
    // for 0 length we will return empty uint8
    // for 1 length we return the first uint8
    return toUint8(buffers[0]);
  }

  var totalLen = buffers.reduce(function (total, buf, i) {
    return total + (buf.byteLength || buf.length);
  }, 0);
  var tempBuffer = new Uint8Array(totalLen);
  var offset = 0;
  buffers.forEach(function (buf) {
    buf = toUint8(buf);
    tempBuffer.set(buf, offset);
    offset += buf.byteLength;
  });
  return tempBuffer;
};
/**
 * Check if the bytes "b" are contained within bytes "a".
 *
 * @param {Uint8Array|Array} a
 *        Bytes to check in
 *
 * @param {Uint8Array|Array} b
 *        Bytes to check for
 *
 * @param {Object} options
 *        options
 *
 * @param {Array|Uint8Array} [offset=0]
 *        offset to use when looking at bytes in a
 *
 * @param {Array|Uint8Array} [mask=[]]
 *        mask to use on bytes before comparison.
 *
 * @return {boolean}
 *         If all bytes in b are inside of a, taking into account
 *         bit masks.
 */

var bytesMatch = function bytesMatch(a, b, _temp3) {
  var _ref3 = _temp3 === void 0 ? {} : _temp3,
      _ref3$offset = _ref3.offset,
      offset = _ref3$offset === void 0 ? 0 : _ref3$offset,
      _ref3$mask = _ref3.mask,
      mask = _ref3$mask === void 0 ? [] : _ref3$mask;

  a = toUint8(a);
  b = toUint8(b); // ie 11 does not support uint8 every

  var fn = b.every ? b.every : Array.prototype.every;
  return b.length && a.length - offset >= b.length && // ie 11 doesn't support every on uin8
  fn.call(b, function (bByte, i) {
    var aByte = mask[i] ? mask[i] & a[offset + i] : a[offset + i];
    return bByte === aByte;
  });
};
var sliceBytes = function sliceBytes(src, start, end) {
  if (Uint8Array.prototype.slice) {
    return Uint8Array.prototype.slice.call(src, start, end);
  }

  return new Uint8Array(Array.prototype.slice.call(src, start, end));
};
var reverseBytes = function reverseBytes(src) {
  if (src.reverse) {
    return src.reverse();
  }

  return Array.prototype.reverse.call(src);
};

/***/ }),

/***/ 2260:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ws": function() { return /* binding */ translateLegacyCodec; },
/* harmony export */   "kS": function() { return /* binding */ parseCodecs; },
/* harmony export */   "Jg": function() { return /* binding */ codecsFromDefault; },
/* harmony export */   "KL": function() { return /* binding */ isAudioCodec; },
/* harmony export */   "_5": function() { return /* binding */ getMimeForCodec; },
/* harmony export */   "p7": function() { return /* binding */ browserSupportsCodec; },
/* harmony export */   "Hi": function() { return /* binding */ muxerSupportsCodec; },
/* harmony export */   "lA": function() { return /* binding */ DEFAULT_AUDIO_CODEC; },
/* harmony export */   "xz": function() { return /* binding */ DEFAULT_VIDEO_CODEC; }
/* harmony export */ });
/* unused harmony exports translateLegacyCodecs, mapLegacyAvcCodecs, isVideoCodec, isTextCodec */
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__);

var regexs = {
  // to determine mime types
  mp4: /^(av0?1|avc0?[1234]|vp0?9|flac|opus|mp3|mp4a|mp4v|stpp.ttml.im1t)/,
  webm: /^(vp0?[89]|av0?1|opus|vorbis)/,
  ogg: /^(vp0?[89]|theora|flac|opus|vorbis)/,
  // to determine if a codec is audio or video
  video: /^(av0?1|avc0?[1234]|vp0?[89]|hvc1|hev1|theora|mp4v)/,
  audio: /^(mp4a|flac|vorbis|opus|ac-[34]|ec-3|alac|mp3|speex|aac)/,
  text: /^(stpp.ttml.im1t)/,
  // mux.js support regex
  muxerVideo: /^(avc0?1)/,
  muxerAudio: /^(mp4a)/,
  // match nothing as muxer does not support text right now.
  // there cannot never be a character before the start of a string
  // so this matches nothing.
  muxerText: /a^/
};
var mediaTypes = ['video', 'audio', 'text'];
var upperMediaTypes = ['Video', 'Audio', 'Text'];
/**
 * Replace the old apple-style `avc1.<dd>.<dd>` codec string with the standard
 * `avc1.<hhhhhh>`
 *
 * @param {string} codec
 *        Codec string to translate
 * @return {string}
 *         The translated codec string
 */

var translateLegacyCodec = function translateLegacyCodec(codec) {
  if (!codec) {
    return codec;
  }

  return codec.replace(/avc1\.(\d+)\.(\d+)/i, function (orig, profile, avcLevel) {
    var profileHex = ('00' + Number(profile).toString(16)).slice(-2);
    var avcLevelHex = ('00' + Number(avcLevel).toString(16)).slice(-2);
    return 'avc1.' + profileHex + '00' + avcLevelHex;
  });
};
/**
 * Replace the old apple-style `avc1.<dd>.<dd>` codec strings with the standard
 * `avc1.<hhhhhh>`
 *
 * @param {string[]} codecs
 *        An array of codec strings to translate
 * @return {string[]}
 *         The translated array of codec strings
 */

var translateLegacyCodecs = function translateLegacyCodecs(codecs) {
  return codecs.map(translateLegacyCodec);
};
/**
 * Replace codecs in the codec string with the old apple-style `avc1.<dd>.<dd>` to the
 * standard `avc1.<hhhhhh>`.
 *
 * @param {string} codecString
 *        The codec string
 * @return {string}
 *         The codec string with old apple-style codecs replaced
 *
 * @private
 */

var mapLegacyAvcCodecs = function mapLegacyAvcCodecs(codecString) {
  return codecString.replace(/avc1\.(\d+)\.(\d+)/i, function (match) {
    return translateLegacyCodecs([match])[0];
  });
};
/**
 * @typedef {Object} ParsedCodecInfo
 * @property {number} codecCount
 *           Number of codecs parsed
 * @property {string} [videoCodec]
 *           Parsed video codec (if found)
 * @property {string} [videoObjectTypeIndicator]
 *           Video object type indicator (if found)
 * @property {string|null} audioProfile
 *           Audio profile
 */

/**
 * Parses a codec string to retrieve the number of codecs specified, the video codec and
 * object type indicator, and the audio profile.
 *
 * @param {string} [codecString]
 *        The codec string to parse
 * @return {ParsedCodecInfo}
 *         Parsed codec info
 */

var parseCodecs = function parseCodecs(codecString) {
  if (codecString === void 0) {
    codecString = '';
  }

  var codecs = codecString.split(',');
  var result = [];
  codecs.forEach(function (codec) {
    codec = codec.trim();
    var codecType;
    mediaTypes.forEach(function (name) {
      var match = regexs[name].exec(codec.toLowerCase());

      if (!match || match.length <= 1) {
        return;
      }

      codecType = name; // maintain codec case

      var type = codec.substring(0, match[1].length);
      var details = codec.replace(type, '');
      result.push({
        type: type,
        details: details,
        mediaType: name
      });
    });

    if (!codecType) {
      result.push({
        type: codec,
        details: '',
        mediaType: 'unknown'
      });
    }
  });
  return result;
};
/**
 * Returns a ParsedCodecInfo object for the default alternate audio playlist if there is
 * a default alternate audio playlist for the provided audio group.
 *
 * @param {Object} master
 *        The master playlist
 * @param {string} audioGroupId
 *        ID of the audio group for which to find the default codec info
 * @return {ParsedCodecInfo}
 *         Parsed codec info
 */

var codecsFromDefault = function codecsFromDefault(master, audioGroupId) {
  if (!master.mediaGroups.AUDIO || !audioGroupId) {
    return null;
  }

  var audioGroup = master.mediaGroups.AUDIO[audioGroupId];

  if (!audioGroup) {
    return null;
  }

  for (var name in audioGroup) {
    var audioType = audioGroup[name];

    if (audioType.default && audioType.playlists) {
      // codec should be the same for all playlists within the audio type
      return parseCodecs(audioType.playlists[0].attributes.CODECS);
    }
  }

  return null;
};
var isVideoCodec = function isVideoCodec(codec) {
  if (codec === void 0) {
    codec = '';
  }

  return regexs.video.test(codec.trim().toLowerCase());
};
var isAudioCodec = function isAudioCodec(codec) {
  if (codec === void 0) {
    codec = '';
  }

  return regexs.audio.test(codec.trim().toLowerCase());
};
var isTextCodec = function isTextCodec(codec) {
  if (codec === void 0) {
    codec = '';
  }

  return regexs.text.test(codec.trim().toLowerCase());
};
var getMimeForCodec = function getMimeForCodec(codecString) {
  if (!codecString || typeof codecString !== 'string') {
    return;
  }

  var codecs = codecString.toLowerCase().split(',').map(function (c) {
    return translateLegacyCodec(c.trim());
  }); // default to video type

  var type = 'video'; // only change to audio type if the only codec we have is
  // audio

  if (codecs.length === 1 && isAudioCodec(codecs[0])) {
    type = 'audio';
  } else if (codecs.length === 1 && isTextCodec(codecs[0])) {
    // text uses application/<container> for now
    type = 'application';
  } // default the container to mp4


  var container = 'mp4'; // every codec must be able to go into the container
  // for that container to be the correct one

  if (codecs.every(function (c) {
    return regexs.mp4.test(c);
  })) {
    container = 'mp4';
  } else if (codecs.every(function (c) {
    return regexs.webm.test(c);
  })) {
    container = 'webm';
  } else if (codecs.every(function (c) {
    return regexs.ogg.test(c);
  })) {
    container = 'ogg';
  }

  return type + "/" + container + ";codecs=\"" + codecString + "\"";
};
var browserSupportsCodec = function browserSupportsCodec(codecString) {
  if (codecString === void 0) {
    codecString = '';
  }

  return (global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource) && (global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource.isTypeSupported) && global_window__WEBPACK_IMPORTED_MODULE_0___default().MediaSource.isTypeSupported(getMimeForCodec(codecString)) || false;
};
var muxerSupportsCodec = function muxerSupportsCodec(codecString) {
  if (codecString === void 0) {
    codecString = '';
  }

  return codecString.toLowerCase().split(',').every(function (codec) {
    codec = codec.trim(); // any match is supported.

    for (var i = 0; i < upperMediaTypes.length; i++) {
      var type = upperMediaTypes[i];

      if (regexs["muxer" + type].test(codec)) {
        return true;
      }
    }

    return false;
  });
};
var DEFAULT_AUDIO_CODEC = 'mp4a.40.2';
var DEFAULT_VIDEO_CODEC = 'avc1.4d400d';

/***/ }),

/***/ 6185:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Xm": function() { return /* binding */ detectContainerForBytes; },
  "cz": function() { return /* binding */ isLikelyFmp4MediaSegment; }
});

// UNUSED EXPORTS: isLikely

// EXTERNAL MODULE: ./node_modules/@videojs/vhs-utils/es/byte-helpers.js
var byte_helpers = __webpack_require__(562);
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/codec-helpers.js
 // https://aomediacodec.github.io/av1-isobmff/#av1codecconfigurationbox-syntax
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#AV1

var codec_helpers_getAv1Codec = function getAv1Codec(bytes) {
  var codec = '';
  var profile = bytes[1] >>> 3;
  var level = bytes[1] & 0x1F;
  var tier = bytes[2] >>> 7;
  var highBitDepth = (bytes[2] & 0x40) >> 6;
  var twelveBit = (bytes[2] & 0x20) >> 5;
  var monochrome = (bytes[2] & 0x10) >> 4;
  var chromaSubsamplingX = (bytes[2] & 0x08) >> 3;
  var chromaSubsamplingY = (bytes[2] & 0x04) >> 2;
  var chromaSamplePosition = bytes[2] & 0x03;
  codec += profile + "." + padStart(level, 2, '0');

  if (tier === 0) {
    codec += 'M';
  } else if (tier === 1) {
    codec += 'H';
  }

  var bitDepth;

  if (profile === 2 && highBitDepth) {
    bitDepth = twelveBit ? 12 : 10;
  } else {
    bitDepth = highBitDepth ? 10 : 8;
  }

  codec += "." + padStart(bitDepth, 2, '0'); // TODO: can we parse color range??

  codec += "." + monochrome;
  codec += "." + chromaSubsamplingX + chromaSubsamplingY + chromaSamplePosition;
  return codec;
};
var codec_helpers_getAvcCodec = function getAvcCodec(bytes) {
  var profileId = toHexString(bytes[1]);
  var constraintFlags = toHexString(bytes[2] & 0xFC);
  var levelId = toHexString(bytes[3]);
  return "" + profileId + constraintFlags + levelId;
};
var codec_helpers_getHvcCodec = function getHvcCodec(bytes) {
  var codec = '';
  var profileSpace = bytes[1] >> 6;
  var profileId = bytes[1] & 0x1F;
  var tierFlag = (bytes[1] & 0x20) >> 5;
  var profileCompat = bytes.subarray(2, 6);
  var constraintIds = bytes.subarray(6, 12);
  var levelId = bytes[12];

  if (profileSpace === 1) {
    codec += 'A';
  } else if (profileSpace === 2) {
    codec += 'B';
  } else if (profileSpace === 3) {
    codec += 'C';
  }

  codec += profileId + "."; // ffmpeg does this in big endian

  var profileCompatVal = parseInt(toBinaryString(profileCompat).split('').reverse().join(''), 2); // apple does this in little endian...

  if (profileCompatVal > 255) {
    profileCompatVal = parseInt(toBinaryString(profileCompat), 2);
  }

  codec += profileCompatVal.toString(16) + ".";

  if (tierFlag === 0) {
    codec += 'L';
  } else {
    codec += 'H';
  }

  codec += levelId;
  var constraints = '';

  for (var i = 0; i < constraintIds.length; i++) {
    var v = constraintIds[i];

    if (v) {
      if (constraints) {
        constraints += '.';
      }

      constraints += v.toString(16);
    }
  }

  if (constraints) {
    codec += "." + constraints;
  }

  return codec;
};
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/opus-helpers.js
var OPUS_HEAD = new Uint8Array([// O, p, u, s
0x4f, 0x70, 0x75, 0x73, // H, e, a, d
0x48, 0x65, 0x61, 0x64]); // https://wiki.xiph.org/OggOpus
// https://vfrmaniac.fushizen.eu/contents/opus_in_isobmff.html
// https://opus-codec.org/docs/opusfile_api-0.7/structOpusHead.html

var opus_helpers_parseOpusHead = function parseOpusHead(bytes) {
  var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  var version = view.getUint8(0); // version 0, from mp4, does not use littleEndian.

  var littleEndian = version !== 0;
  var config = {
    version: version,
    channels: view.getUint8(1),
    preSkip: view.getUint16(2, littleEndian),
    sampleRate: view.getUint32(4, littleEndian),
    outputGain: view.getUint16(8, littleEndian),
    channelMappingFamily: view.getUint8(10)
  };

  if (config.channelMappingFamily > 0 && bytes.length > 10) {
    config.streamCount = view.getUint8(11);
    config.twoChannelStreamCount = view.getUint8(12);
    config.channelMapping = [];

    for (var c = 0; c < config.channels; c++) {
      config.channelMapping.push(view.getUint8(13 + c));
    }
  }

  return config;
};
var setOpusHead = function setOpusHead(config) {
  var size = config.channelMappingFamily <= 0 ? 11 : 12 + config.channels;
  var view = new DataView(new ArrayBuffer(size));
  var littleEndian = config.version !== 0;
  view.setUint8(0, config.version);
  view.setUint8(1, config.channels);
  view.setUint16(2, config.preSkip, littleEndian);
  view.setUint32(4, config.sampleRate, littleEndian);
  view.setUint16(8, config.outputGain, littleEndian);
  view.setUint8(10, config.channelMappingFamily);

  if (config.channelMappingFamily > 0) {
    view.setUint8(11, config.streamCount);
    config.channelMapping.foreach(function (cm, i) {
      view.setUint8(12 + i, cm);
    });
  }

  return new Uint8Array(view.buffer);
};
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/mp4-helpers.js




var normalizePath = function normalizePath(path) {
  if (typeof path === 'string') {
    return (0,byte_helpers/* stringToBytes */.qX)(path);
  }

  if (typeof path === 'number') {
    return path;
  }

  return path;
};

var normalizePaths = function normalizePaths(paths) {
  if (!Array.isArray(paths)) {
    return [normalizePath(paths)];
  }

  return paths.map(function (p) {
    return normalizePath(p);
  });
};

var DESCRIPTORS;
var parseDescriptors = function parseDescriptors(bytes) {
  bytes = (0,byte_helpers/* toUint8 */.Ki)(bytes);
  var results = [];
  var i = 0;

  while (bytes.length > i) {
    var tag = bytes[i];
    var size = 0;
    var headerSize = 0; // tag

    headerSize++;
    var byte = bytes[headerSize]; // first byte

    headerSize++;

    while (byte & 0x80) {
      size = (byte & 0x7F) << 7;
      byte = bytes[headerSize];
      headerSize++;
    }

    size += byte & 0x7F;

    for (var z = 0; z < DESCRIPTORS.length; z++) {
      var _DESCRIPTORS$z = DESCRIPTORS[z],
          id = _DESCRIPTORS$z.id,
          parser = _DESCRIPTORS$z.parser;

      if (tag === id) {
        results.push(parser(bytes.subarray(headerSize, headerSize + size)));
        break;
      }
    }

    i += size + headerSize;
  }

  return results;
};
DESCRIPTORS = [{
  id: 0x03,
  parser: function parser(bytes) {
    var desc = {
      tag: 0x03,
      id: bytes[0] << 8 | bytes[1],
      flags: bytes[2],
      size: 3,
      dependsOnEsId: 0,
      ocrEsId: 0,
      descriptors: [],
      url: ''
    }; // depends on es id

    if (desc.flags & 0x80) {
      desc.dependsOnEsId = bytes[desc.size] << 8 | bytes[desc.size + 1];
      desc.size += 2;
    } // url


    if (desc.flags & 0x40) {
      var len = bytes[desc.size];
      desc.url = (0,byte_helpers/* bytesToString */.d3)(bytes.subarray(desc.size + 1, desc.size + 1 + len));
      desc.size += len;
    } // ocr es id


    if (desc.flags & 0x20) {
      desc.ocrEsId = bytes[desc.size] << 8 | bytes[desc.size + 1];
      desc.size += 2;
    }

    desc.descriptors = parseDescriptors(bytes.subarray(desc.size)) || [];
    return desc;
  }
}, {
  id: 0x04,
  parser: function parser(bytes) {
    // DecoderConfigDescriptor
    var desc = {
      tag: 0x04,
      oti: bytes[0],
      streamType: bytes[1],
      bufferSize: bytes[2] << 16 | bytes[3] << 8 | bytes[4],
      maxBitrate: bytes[5] << 24 | bytes[6] << 16 | bytes[7] << 8 | bytes[8],
      avgBitrate: bytes[9] << 24 | bytes[10] << 16 | bytes[11] << 8 | bytes[12],
      descriptors: parseDescriptors(bytes.subarray(13))
    };
    return desc;
  }
}, {
  id: 0x05,
  parser: function parser(bytes) {
    // DecoderSpecificInfo
    return {
      tag: 0x05,
      bytes: bytes
    };
  }
}, {
  id: 0x06,
  parser: function parser(bytes) {
    // SLConfigDescriptor
    return {
      tag: 0x06,
      bytes: bytes
    };
  }
}];
/**
 * find any number of boxes by name given a path to it in an iso bmff
 * such as mp4.
 *
 * @param {TypedArray} bytes
 *        bytes for the iso bmff to search for boxes in
 *
 * @param {Uint8Array[]|string[]|string|Uint8Array} name
 *        An array of paths or a single path representing the name
 *        of boxes to search through in bytes. Paths may be
 *        uint8 (character codes) or strings.
 *
 * @param {boolean} [complete=false]
 *        Should we search only for complete boxes on the final path.
 *        This is very useful when you do not want to get back partial boxes
 *        in the case of streaming files.
 *
 * @return {Uint8Array[]}
 *         An array of the end paths that we found.
 */

var findBox = function findBox(bytes, paths, complete) {
  if (complete === void 0) {
    complete = false;
  }

  paths = normalizePaths(paths);
  bytes = (0,byte_helpers/* toUint8 */.Ki)(bytes);
  var results = [];

  if (!paths.length) {
    // short-circuit the search for empty paths
    return results;
  }

  var i = 0;

  while (i < bytes.length) {
    var size = (bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3]) >>> 0;
    var type = bytes.subarray(i + 4, i + 8); // invalid box format.

    if (size === 0) {
      break;
    }

    var end = i + size;

    if (end > bytes.length) {
      // this box is bigger than the number of bytes we have
      // and complete is set, we cannot find any more boxes.
      if (complete) {
        break;
      }

      end = bytes.length;
    }

    var data = bytes.subarray(i + 8, end);

    if ((0,byte_helpers/* bytesMatch */.G3)(type, paths[0])) {
      if (paths.length === 1) {
        // this is the end of the path and we've found the box we were
        // looking for
        results.push(data);
      } else {
        // recursively search for the next box along the path
        results.push.apply(results, findBox(data, paths.slice(1), complete));
      }
    }

    i = end;
  } // we've finished searching all of bytes


  return results;
};
/**
 * Search for a single matching box by name in an iso bmff format like
 * mp4. This function is useful for finding codec boxes which
 * can be placed arbitrarily in sample descriptions depending
 * on the version of the file or file type.
 *
 * @param {TypedArray} bytes
 *        bytes for the iso bmff to search for boxes in
 *
 * @param {string|Uint8Array} name
 *        The name of the box to find.
 *
 * @return {Uint8Array[]}
 *         a subarray of bytes representing the name boxed we found.
 */

var findNamedBox = function findNamedBox(bytes, name) {
  name = normalizePath(name);

  if (!name.length) {
    // short-circuit the search for empty paths
    return bytes.subarray(bytes.length);
  }

  var i = 0;

  while (i < bytes.length) {
    if (bytesMatch(bytes.subarray(i, i + name.length), name)) {
      var size = (bytes[i - 4] << 24 | bytes[i - 3] << 16 | bytes[i - 2] << 8 | bytes[i - 1]) >>> 0;
      var end = size > 1 ? i + size : bytes.byteLength;
      return bytes.subarray(i + 4, end);
    }

    i++;
  } // we've finished searching all of bytes


  return bytes.subarray(bytes.length);
};

var parseSamples = function parseSamples(data, entrySize, parseEntry) {
  if (entrySize === void 0) {
    entrySize = 4;
  }

  if (parseEntry === void 0) {
    parseEntry = function parseEntry(d) {
      return bytesToNumber(d);
    };
  }

  var entries = [];

  if (!data || !data.length) {
    return entries;
  }

  var entryCount = bytesToNumber(data.subarray(4, 8));

  for (var i = 8; entryCount; i += entrySize, entryCount--) {
    entries.push(parseEntry(data.subarray(i, i + entrySize)));
  }

  return entries;
};

var buildFrameTable = function buildFrameTable(stbl, timescale) {
  var keySamples = parseSamples(findBox(stbl, ['stss'])[0]);
  var chunkOffsets = parseSamples(findBox(stbl, ['stco'])[0]);
  var timeToSamples = parseSamples(findBox(stbl, ['stts'])[0], 8, function (entry) {
    return {
      sampleCount: bytesToNumber(entry.subarray(0, 4)),
      sampleDelta: bytesToNumber(entry.subarray(4, 8))
    };
  });
  var samplesToChunks = parseSamples(findBox(stbl, ['stsc'])[0], 12, function (entry) {
    return {
      firstChunk: bytesToNumber(entry.subarray(0, 4)),
      samplesPerChunk: bytesToNumber(entry.subarray(4, 8)),
      sampleDescriptionIndex: bytesToNumber(entry.subarray(8, 12))
    };
  });
  var stsz = findBox(stbl, ['stsz'])[0]; // stsz starts with a 4 byte sampleSize which we don't need

  var sampleSizes = parseSamples(stsz && stsz.length && stsz.subarray(4) || null);
  var frames = [];

  for (var chunkIndex = 0; chunkIndex < chunkOffsets.length; chunkIndex++) {
    var samplesInChunk = void 0;

    for (var i = 0; i < samplesToChunks.length; i++) {
      var sampleToChunk = samplesToChunks[i];
      var isThisOne = chunkIndex + 1 >= sampleToChunk.firstChunk && (i + 1 >= samplesToChunks.length || chunkIndex + 1 < samplesToChunks[i + 1].firstChunk);

      if (isThisOne) {
        samplesInChunk = sampleToChunk.samplesPerChunk;
        break;
      }
    }

    var chunkOffset = chunkOffsets[chunkIndex];

    for (var _i = 0; _i < samplesInChunk; _i++) {
      var frameEnd = sampleSizes[frames.length]; // if we don't have key samples every frame is a keyframe

      var keyframe = !keySamples.length;

      if (keySamples.length && keySamples.indexOf(frames.length + 1) !== -1) {
        keyframe = true;
      }

      var frame = {
        keyframe: keyframe,
        start: chunkOffset,
        end: chunkOffset + frameEnd
      };

      for (var k = 0; k < timeToSamples.length; k++) {
        var _timeToSamples$k = timeToSamples[k],
            sampleCount = _timeToSamples$k.sampleCount,
            sampleDelta = _timeToSamples$k.sampleDelta;

        if (frames.length <= sampleCount) {
          // ms to ns
          var lastTimestamp = frames.length ? frames[frames.length - 1].timestamp : 0;
          frame.timestamp = lastTimestamp + sampleDelta / timescale * 1000;
          frame.duration = sampleDelta;
          break;
        }
      }

      frames.push(frame);
      chunkOffset += frameEnd;
    }
  }

  return frames;
};
var addSampleDescription = function addSampleDescription(track, bytes) {
  var codec = bytesToString(bytes.subarray(0, 4));

  if (track.type === 'video') {
    track.info = track.info || {};
    track.info.width = bytes[28] << 8 | bytes[29];
    track.info.height = bytes[30] << 8 | bytes[31];
  } else if (track.type === 'audio') {
    track.info = track.info || {};
    track.info.channels = bytes[20] << 8 | bytes[21];
    track.info.bitDepth = bytes[22] << 8 | bytes[23];
    track.info.sampleRate = bytes[28] << 8 | bytes[29];
  }

  if (codec === 'avc1') {
    var avcC = findNamedBox(bytes, 'avcC'); // AVCDecoderConfigurationRecord

    codec += "." + getAvcCodec(avcC);
    track.info.avcC = avcC; // TODO: do we need to parse all this?

    /* {
      configurationVersion: avcC[0],
      profile: avcC[1],
      profileCompatibility: avcC[2],
      level: avcC[3],
      lengthSizeMinusOne: avcC[4] & 0x3
    };
     let spsNalUnitCount = avcC[5] & 0x1F;
    const spsNalUnits = track.info.avc.spsNalUnits = [];
     // past spsNalUnitCount
    let offset = 6;
     while (spsNalUnitCount--) {
      const nalLen = avcC[offset] << 8 | avcC[offset + 1];
       spsNalUnits.push(avcC.subarray(offset + 2, offset + 2 + nalLen));
       offset += nalLen + 2;
    }
    let ppsNalUnitCount = avcC[offset];
    const ppsNalUnits = track.info.avc.ppsNalUnits = [];
     // past ppsNalUnitCount
    offset += 1;
     while (ppsNalUnitCount--) {
      const nalLen = avcC[offset] << 8 | avcC[offset + 1];
       ppsNalUnits.push(avcC.subarray(offset + 2, offset + 2 + nalLen));
       offset += nalLen + 2;
    }*/
    // HEVCDecoderConfigurationRecord
  } else if (codec === 'hvc1' || codec === 'hev1') {
    codec += "." + getHvcCodec(findNamedBox(bytes, 'hvcC'));
  } else if (codec === 'mp4a' || codec === 'mp4v') {
    var esds = findNamedBox(bytes, 'esds');
    var esDescriptor = parseDescriptors(esds.subarray(4))[0];
    var decoderConfig = esDescriptor && esDescriptor.descriptors.filter(function (_ref) {
      var tag = _ref.tag;
      return tag === 0x04;
    })[0];

    if (decoderConfig) {
      // most codecs do not have a further '.'
      // such as 0xa5 for ac-3 and 0xa6 for e-ac-3
      codec += '.' + toHexString(decoderConfig.oti);

      if (decoderConfig.oti === 0x40) {
        codec += '.' + (decoderConfig.descriptors[0].bytes[0] >> 3).toString();
      } else if (decoderConfig.oti === 0x20) {
        codec += '.' + decoderConfig.descriptors[0].bytes[4].toString();
      } else if (decoderConfig.oti === 0xdd) {
        codec = 'vorbis';
      }
    } else if (track.type === 'audio') {
      codec += '.40.2';
    } else {
      codec += '.20.9';
    }
  } else if (codec === 'av01') {
    // AV1DecoderConfigurationRecord
    codec += "." + getAv1Codec(findNamedBox(bytes, 'av1C'));
  } else if (codec === 'vp09') {
    // VPCodecConfigurationRecord
    var vpcC = findNamedBox(bytes, 'vpcC'); // https://www.webmproject.org/vp9/mp4/

    var profile = vpcC[0];
    var level = vpcC[1];
    var bitDepth = vpcC[2] >> 4;
    var chromaSubsampling = (vpcC[2] & 0x0F) >> 1;
    var videoFullRangeFlag = (vpcC[2] & 0x0F) >> 3;
    var colourPrimaries = vpcC[3];
    var transferCharacteristics = vpcC[4];
    var matrixCoefficients = vpcC[5];
    codec += "." + padStart(profile, 2, '0');
    codec += "." + padStart(level, 2, '0');
    codec += "." + padStart(bitDepth, 2, '0');
    codec += "." + padStart(chromaSubsampling, 2, '0');
    codec += "." + padStart(colourPrimaries, 2, '0');
    codec += "." + padStart(transferCharacteristics, 2, '0');
    codec += "." + padStart(matrixCoefficients, 2, '0');
    codec += "." + padStart(videoFullRangeFlag, 2, '0');
  } else if (codec === 'theo') {
    codec = 'theora';
  } else if (codec === 'spex') {
    codec = 'speex';
  } else if (codec === '.mp3') {
    codec = 'mp4a.40.34';
  } else if (codec === 'msVo') {
    codec = 'vorbis';
  } else if (codec === 'Opus') {
    codec = 'opus';
    var dOps = findNamedBox(bytes, 'dOps');
    track.info.opus = parseOpusHead(dOps); // TODO: should this go into the webm code??
    // Firefox requires a codecDelay for opus playback
    // see https://bugzilla.mozilla.org/show_bug.cgi?id=1276238

    track.info.codecDelay = 6500000;
  } else {
    codec = codec.toLowerCase();
  }
  /* eslint-enable */
  // flac, ac-3, ec-3, opus


  track.codec = codec;
};
var parseTracks = function parseTracks(bytes, frameTable) {
  if (frameTable === void 0) {
    frameTable = true;
  }

  bytes = toUint8(bytes);
  var traks = findBox(bytes, ['moov', 'trak'], true);
  var tracks = [];
  traks.forEach(function (trak) {
    var track = {
      bytes: trak
    };
    var mdia = findBox(trak, ['mdia'])[0];
    var hdlr = findBox(mdia, ['hdlr'])[0];
    var trakType = bytesToString(hdlr.subarray(8, 12));

    if (trakType === 'soun') {
      track.type = 'audio';
    } else if (trakType === 'vide') {
      track.type = 'video';
    } else {
      track.type = trakType;
    }

    var tkhd = findBox(trak, ['tkhd'])[0];

    if (tkhd) {
      var view = new DataView(tkhd.buffer, tkhd.byteOffset, tkhd.byteLength);
      var tkhdVersion = view.getUint8(0);
      track.number = tkhdVersion === 0 ? view.getUint32(12) : view.getUint32(20);
    }

    var mdhd = findBox(mdia, ['mdhd'])[0];

    if (mdhd) {
      // mdhd is a FullBox, meaning it will have its own version as the first byte
      var version = mdhd[0];
      var index = version === 0 ? 12 : 20;
      track.timescale = (mdhd[index] << 24 | mdhd[index + 1] << 16 | mdhd[index + 2] << 8 | mdhd[index + 3]) >>> 0;
    }

    var stbl = findBox(mdia, ['minf', 'stbl'])[0];
    var stsd = findBox(stbl, ['stsd'])[0];
    var descriptionCount = bytesToNumber(stsd.subarray(4, 8));
    var offset = 8; // add codec and codec info

    while (descriptionCount--) {
      var len = bytesToNumber(stsd.subarray(offset, offset + 4));
      var sampleDescriptor = stsd.subarray(offset + 4, offset + 4 + len);
      addSampleDescription(track, sampleDescriptor);
      offset += 4 + len;
    }

    if (frameTable) {
      track.frameTable = buildFrameTable(stbl, track.timescale);
    } // codec has no sub parameters


    tracks.push(track);
  });
  return tracks;
};
var parseMediaInfo = function parseMediaInfo(bytes) {
  var mvhd = findBox(bytes, ['moov', 'mvhd'], true)[0];

  if (!mvhd || !mvhd.length) {
    return;
  }

  var info = {}; // ms to ns
  // mvhd v1 has 8 byte duration and other fields too

  if (mvhd[0] === 1) {
    info.timestampScale = bytesToNumber(mvhd.subarray(20, 24));
    info.duration = bytesToNumber(mvhd.subarray(24, 32));
  } else {
    info.timestampScale = bytesToNumber(mvhd.subarray(12, 16));
    info.duration = bytesToNumber(mvhd.subarray(16, 20));
  }

  info.bytes = mvhd;
  return info;
};
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/ebml-helpers.js

 // relevant specs for this parser:
// https://matroska-org.github.io/libebml/specs.html
// https://www.matroska.org/technical/elements.html
// https://www.webmproject.org/docs/container/

var EBML_TAGS = {
  EBML: (0,byte_helpers/* toUint8 */.Ki)([0x1A, 0x45, 0xDF, 0xA3]),
  DocType: (0,byte_helpers/* toUint8 */.Ki)([0x42, 0x82]),
  Segment: (0,byte_helpers/* toUint8 */.Ki)([0x18, 0x53, 0x80, 0x67]),
  SegmentInfo: (0,byte_helpers/* toUint8 */.Ki)([0x15, 0x49, 0xA9, 0x66]),
  Tracks: (0,byte_helpers/* toUint8 */.Ki)([0x16, 0x54, 0xAE, 0x6B]),
  Track: (0,byte_helpers/* toUint8 */.Ki)([0xAE]),
  TrackNumber: (0,byte_helpers/* toUint8 */.Ki)([0xd7]),
  DefaultDuration: (0,byte_helpers/* toUint8 */.Ki)([0x23, 0xe3, 0x83]),
  TrackEntry: (0,byte_helpers/* toUint8 */.Ki)([0xAE]),
  TrackType: (0,byte_helpers/* toUint8 */.Ki)([0x83]),
  FlagDefault: (0,byte_helpers/* toUint8 */.Ki)([0x88]),
  CodecID: (0,byte_helpers/* toUint8 */.Ki)([0x86]),
  CodecPrivate: (0,byte_helpers/* toUint8 */.Ki)([0x63, 0xA2]),
  VideoTrack: (0,byte_helpers/* toUint8 */.Ki)([0xe0]),
  AudioTrack: (0,byte_helpers/* toUint8 */.Ki)([0xe1]),
  // Not used yet, but will be used for live webm/mkv
  // see https://www.matroska.org/technical/basics.html#block-structure
  // see https://www.matroska.org/technical/basics.html#simpleblock-structure
  Cluster: (0,byte_helpers/* toUint8 */.Ki)([0x1F, 0x43, 0xB6, 0x75]),
  Timestamp: (0,byte_helpers/* toUint8 */.Ki)([0xE7]),
  TimestampScale: (0,byte_helpers/* toUint8 */.Ki)([0x2A, 0xD7, 0xB1]),
  BlockGroup: (0,byte_helpers/* toUint8 */.Ki)([0xA0]),
  BlockDuration: (0,byte_helpers/* toUint8 */.Ki)([0x9B]),
  Block: (0,byte_helpers/* toUint8 */.Ki)([0xA1]),
  SimpleBlock: (0,byte_helpers/* toUint8 */.Ki)([0xA3])
};
/**
 * This is a simple table to determine the length
 * of things in ebml. The length is one based (starts at 1,
 * rather than zero) and for every zero bit before a one bit
 * we add one to length. We also need this table because in some
 * case we have to xor all the length bits from another value.
 */

var LENGTH_TABLE = [128, 64, 32, 16, 8, 4, 2, 1];

var getLength = function getLength(byte) {
  var len = 1;

  for (var i = 0; i < LENGTH_TABLE.length; i++) {
    if (byte & LENGTH_TABLE[i]) {
      break;
    }

    len++;
  }

  return len;
}; // length in ebml is stored in the first 4 to 8 bits
// of the first byte. 4 for the id length and 8 for the
// data size length. Length is measured by converting the number to binary
// then 1 + the number of zeros before a 1 is encountered starting
// from the left.


var getvint = function getvint(bytes, offset, removeLength, signed) {
  if (removeLength === void 0) {
    removeLength = true;
  }

  if (signed === void 0) {
    signed = false;
  }

  var length = getLength(bytes[offset]);
  var valueBytes = bytes.subarray(offset, offset + length); // NOTE that we do **not** subarray here because we need to copy these bytes
  // as they will be modified below to remove the dataSizeLen bits and we do not
  // want to modify the original data. normally we could just call slice on
  // uint8array but ie 11 does not support that...

  if (removeLength) {
    valueBytes = Array.prototype.slice.call(bytes, offset, offset + length);
    valueBytes[0] ^= LENGTH_TABLE[length - 1];
  }

  return {
    length: length,
    value: (0,byte_helpers/* bytesToNumber */.tm)(valueBytes, {
      signed: signed
    }),
    bytes: valueBytes
  };
};

var ebml_helpers_normalizePath = function normalizePath(path) {
  if (typeof path === 'string') {
    return path.match(/.{1,2}/g).map(function (p) {
      return normalizePath(p);
    });
  }

  if (typeof path === 'number') {
    return (0,byte_helpers/* numberToBytes */.hL)(path);
  }

  return path;
};

var ebml_helpers_normalizePaths = function normalizePaths(paths) {
  if (!Array.isArray(paths)) {
    return [ebml_helpers_normalizePath(paths)];
  }

  return paths.map(function (p) {
    return ebml_helpers_normalizePath(p);
  });
};

var getInfinityDataSize = function getInfinityDataSize(id, bytes, offset) {
  if (offset >= bytes.length) {
    return bytes.length;
  }

  var innerid = getvint(bytes, offset, false);

  if ((0,byte_helpers/* bytesMatch */.G3)(id.bytes, innerid.bytes)) {
    return offset;
  }

  var dataHeader = getvint(bytes, offset + innerid.length);
  return getInfinityDataSize(id, bytes, offset + dataHeader.length + dataHeader.value + innerid.length);
};
/**
 * Notes on the EBLM format.
 *
 * EBLM uses "vints" tags. Every vint tag contains
 * two parts
 *
 * 1. The length from the first byte. You get this by
 *    converting the byte to binary and counting the zeros
 *    before a 1. Then you add 1 to that. Examples
 *    00011111 = length 4 because there are 3 zeros before a 1.
 *    00100000 = length 3 because there are 2 zeros before a 1.
 *    00000011 = length 7 because there are 6 zeros before a 1.
 *
 * 2. The bits used for length are removed from the first byte
 *    Then all the bytes are merged into a value. NOTE: this
 *    is not the case for id ebml tags as there id includes
 *    length bits.
 *
 */


var findEbml = function findEbml(bytes, paths) {
  paths = ebml_helpers_normalizePaths(paths);
  bytes = (0,byte_helpers/* toUint8 */.Ki)(bytes);
  var results = [];

  if (!paths.length) {
    return results;
  }

  var i = 0;

  while (i < bytes.length) {
    var id = getvint(bytes, i, false);
    var dataHeader = getvint(bytes, i + id.length);
    var dataStart = i + id.length + dataHeader.length; // dataSize is unknown or this is a live stream

    if (dataHeader.value === 0x7f) {
      dataHeader.value = getInfinityDataSize(id, bytes, dataStart);

      if (dataHeader.value !== bytes.length) {
        dataHeader.value -= dataStart;
      }
    }

    var dataEnd = dataStart + dataHeader.value > bytes.length ? bytes.length : dataStart + dataHeader.value;
    var data = bytes.subarray(dataStart, dataEnd);

    if ((0,byte_helpers/* bytesMatch */.G3)(paths[0], id.bytes)) {
      if (paths.length === 1) {
        // this is the end of the paths and we've found the tag we were
        // looking for
        results.push(data);
      } else {
        // recursively search for the next tag inside of the data
        // of this one
        results = results.concat(findEbml(data, paths.slice(1)));
      }
    }

    var totalLength = id.length + dataHeader.length + data.length; // move past this tag entirely, we are not looking for it

    i += totalLength;
  }

  return results;
}; // see https://www.matroska.org/technical/basics.html#block-structure

var decodeBlock = function decodeBlock(block, type, timestampScale, clusterTimestamp) {
  var duration;

  if (type === 'group') {
    duration = findEbml(block, [EBML_TAGS.BlockDuration])[0];

    if (duration) {
      duration = bytesToNumber(duration);
      duration = 1 / timestampScale * duration * timestampScale / 1000;
    }

    block = findEbml(block, [EBML_TAGS.Block])[0];
    type = 'block'; // treat data as a block after this point
  }

  var dv = new DataView(block.buffer, block.byteOffset, block.byteLength);
  var trackNumber = getvint(block, 0);
  var timestamp = dv.getInt16(trackNumber.length, false);
  var flags = block[trackNumber.length + 2];
  var data = block.subarray(trackNumber.length + 3); // pts/dts in seconds

  var ptsdts = 1 / timestampScale * (clusterTimestamp + timestamp) * timestampScale / 1000; // return the frame

  var parsed = {
    duration: duration,
    trackNumber: trackNumber.value,
    keyframe: type === 'simple' && flags >> 7 === 1,
    invisible: (flags & 0x08) >> 3 === 1,
    lacing: (flags & 0x06) >> 1,
    discardable: type === 'simple' && (flags & 0x01) === 1,
    frames: [],
    pts: ptsdts,
    dts: ptsdts,
    timestamp: timestamp
  };

  if (!parsed.lacing) {
    parsed.frames.push(data);
    return parsed;
  }

  var numberOfFrames = data[0] + 1;
  var frameSizes = [];
  var offset = 1; // Fixed

  if (parsed.lacing === 2) {
    var sizeOfFrame = (data.length - offset) / numberOfFrames;

    for (var i = 0; i < numberOfFrames; i++) {
      frameSizes.push(sizeOfFrame);
    }
  } // xiph


  if (parsed.lacing === 1) {
    for (var _i = 0; _i < numberOfFrames - 1; _i++) {
      var size = 0;

      do {
        size += data[offset];
        offset++;
      } while (data[offset - 1] === 0xFF);

      frameSizes.push(size);
    }
  } // ebml


  if (parsed.lacing === 3) {
    // first vint is unsinged
    // after that vints are singed and
    // based on a compounding size
    var _size = 0;

    for (var _i2 = 0; _i2 < numberOfFrames - 1; _i2++) {
      var vint = _i2 === 0 ? getvint(data, offset) : getvint(data, offset, true, true);
      _size += vint.value;
      frameSizes.push(_size);
      offset += vint.length;
    }
  }

  frameSizes.forEach(function (size) {
    parsed.frames.push(data.subarray(offset, offset + size));
    offset += size;
  });
  return parsed;
}; // VP9 Codec Feature Metadata (CodecPrivate)
// https://www.webmproject.org/docs/container/

var parseVp9Private = function parseVp9Private(bytes) {
  var i = 0;
  var params = {};

  while (i < bytes.length) {
    var id = bytes[i] & 0x7f;
    var len = bytes[i + 1];
    var val = void 0;

    if (len === 1) {
      val = bytes[i + 2];
    } else {
      val = bytes.subarray(i + 2, i + 2 + len);
    }

    if (id === 1) {
      params.profile = val;
    } else if (id === 2) {
      params.level = val;
    } else if (id === 3) {
      params.bitDepth = val;
    } else if (id === 4) {
      params.chromaSubsampling = val;
    } else {
      params[id] = val;
    }

    i += 2 + len;
  }

  return params;
};

var ebml_helpers_parseTracks = function parseTracks(bytes) {
  bytes = toUint8(bytes);
  var decodedTracks = [];
  var tracks = findEbml(bytes, [EBML_TAGS.Segment, EBML_TAGS.Tracks, EBML_TAGS.Track]);

  if (!tracks.length) {
    tracks = findEbml(bytes, [EBML_TAGS.Tracks, EBML_TAGS.Track]);
  }

  if (!tracks.length) {
    tracks = findEbml(bytes, [EBML_TAGS.Track]);
  }

  if (!tracks.length) {
    return decodedTracks;
  }

  tracks.forEach(function (track) {
    var trackType = findEbml(track, EBML_TAGS.TrackType)[0];

    if (!trackType || !trackType.length) {
      return;
    } // 1 is video, 2 is audio, 17 is subtitle
    // other values are unimportant in this context


    if (trackType[0] === 1) {
      trackType = 'video';
    } else if (trackType[0] === 2) {
      trackType = 'audio';
    } else if (trackType[0] === 17) {
      trackType = 'subtitle';
    } else {
      return;
    } // todo parse language


    var decodedTrack = {
      rawCodec: bytesToString(findEbml(track, [EBML_TAGS.CodecID])[0]),
      type: trackType,
      codecPrivate: findEbml(track, [EBML_TAGS.CodecPrivate])[0],
      number: bytesToNumber(findEbml(track, [EBML_TAGS.TrackNumber])[0]),
      defaultDuration: bytesToNumber(findEbml(track, [EBML_TAGS.DefaultDuration])[0]),
      default: findEbml(track, [EBML_TAGS.FlagDefault])[0],
      rawData: track
    };
    var codec = '';

    if (/V_MPEG4\/ISO\/AVC/.test(decodedTrack.rawCodec)) {
      codec = "avc1." + getAvcCodec(decodedTrack.codecPrivate);
    } else if (/V_MPEGH\/ISO\/HEVC/.test(decodedTrack.rawCodec)) {
      codec = "hev1." + getHvcCodec(decodedTrack.codecPrivate);
    } else if (/V_MPEG4\/ISO\/ASP/.test(decodedTrack.rawCodec)) {
      if (decodedTrack.codecPrivate) {
        codec = 'mp4v.20.' + decodedTrack.codecPrivate[4].toString();
      } else {
        codec = 'mp4v.20.9';
      }
    } else if (/^V_THEORA/.test(decodedTrack.rawCodec)) {
      codec = 'theora';
    } else if (/^V_VP8/.test(decodedTrack.rawCodec)) {
      codec = 'vp8';
    } else if (/^V_VP9/.test(decodedTrack.rawCodec)) {
      if (decodedTrack.codecPrivate) {
        var _parseVp9Private = parseVp9Private(decodedTrack.codecPrivate),
            profile = _parseVp9Private.profile,
            level = _parseVp9Private.level,
            bitDepth = _parseVp9Private.bitDepth,
            chromaSubsampling = _parseVp9Private.chromaSubsampling;

        codec = 'vp09.';
        codec += padStart(profile, 2, '0') + ".";
        codec += padStart(level, 2, '0') + ".";
        codec += padStart(bitDepth, 2, '0') + ".";
        codec += "" + padStart(chromaSubsampling, 2, '0'); // Video -> Colour -> Ebml name

        var matrixCoefficients = findEbml(track, [0xE0, [0x55, 0xB0], [0x55, 0xB1]])[0] || [];
        var videoFullRangeFlag = findEbml(track, [0xE0, [0x55, 0xB0], [0x55, 0xB9]])[0] || [];
        var transferCharacteristics = findEbml(track, [0xE0, [0x55, 0xB0], [0x55, 0xBA]])[0] || [];
        var colourPrimaries = findEbml(track, [0xE0, [0x55, 0xB0], [0x55, 0xBB]])[0] || []; // if we find any optional codec parameter specify them all.

        if (matrixCoefficients.length || videoFullRangeFlag.length || transferCharacteristics.length || colourPrimaries.length) {
          codec += "." + padStart(colourPrimaries[0], 2, '0');
          codec += "." + padStart(transferCharacteristics[0], 2, '0');
          codec += "." + padStart(matrixCoefficients[0], 2, '0');
          codec += "." + padStart(videoFullRangeFlag[0], 2, '0');
        }
      } else {
        codec = 'vp9';
      }
    } else if (/^V_AV1/.test(decodedTrack.rawCodec)) {
      codec = "av01." + getAv1Codec(decodedTrack.codecPrivate);
    } else if (/A_ALAC/.test(decodedTrack.rawCodec)) {
      codec = 'alac';
    } else if (/A_MPEG\/L2/.test(decodedTrack.rawCodec)) {
      codec = 'mp2';
    } else if (/A_MPEG\/L3/.test(decodedTrack.rawCodec)) {
      codec = 'mp3';
    } else if (/^A_AAC/.test(decodedTrack.rawCodec)) {
      if (decodedTrack.codecPrivate) {
        codec = 'mp4a.40.' + (decodedTrack.codecPrivate[0] >>> 3).toString();
      } else {
        codec = 'mp4a.40.2';
      }
    } else if (/^A_AC3/.test(decodedTrack.rawCodec)) {
      codec = 'ac-3';
    } else if (/^A_PCM/.test(decodedTrack.rawCodec)) {
      codec = 'pcm';
    } else if (/^A_MS\/ACM/.test(decodedTrack.rawCodec)) {
      codec = 'speex';
    } else if (/^A_EAC3/.test(decodedTrack.rawCodec)) {
      codec = 'ec-3';
    } else if (/^A_VORBIS/.test(decodedTrack.rawCodec)) {
      codec = 'vorbis';
    } else if (/^A_FLAC/.test(decodedTrack.rawCodec)) {
      codec = 'flac';
    } else if (/^A_OPUS/.test(decodedTrack.rawCodec)) {
      codec = 'opus';
    }

    decodedTrack.codec = codec;
    decodedTracks.push(decodedTrack);
  });
  return decodedTracks.sort(function (a, b) {
    return a.number - b.number;
  });
};
var parseData = function parseData(data, tracks) {
  var allBlocks = [];
  var segment = findEbml(data, [EBML_TAGS.Segment])[0];
  var timestampScale = findEbml(segment, [EBML_TAGS.SegmentInfo, EBML_TAGS.TimestampScale])[0]; // in nanoseconds, defaults to 1ms

  if (timestampScale && timestampScale.length) {
    timestampScale = bytesToNumber(timestampScale);
  } else {
    timestampScale = 1000000;
  }

  var clusters = findEbml(segment, [EBML_TAGS.Cluster]);

  if (!tracks) {
    tracks = ebml_helpers_parseTracks(segment);
  }

  clusters.forEach(function (cluster, ci) {
    var simpleBlocks = findEbml(cluster, [EBML_TAGS.SimpleBlock]).map(function (b) {
      return {
        type: 'simple',
        data: b
      };
    });
    var blockGroups = findEbml(cluster, [EBML_TAGS.BlockGroup]).map(function (b) {
      return {
        type: 'group',
        data: b
      };
    });
    var timestamp = findEbml(cluster, [EBML_TAGS.Timestamp])[0] || 0;

    if (timestamp && timestamp.length) {
      timestamp = bytesToNumber(timestamp);
    } // get all blocks then sort them into the correct order


    var blocks = simpleBlocks.concat(blockGroups).sort(function (a, b) {
      return a.data.byteOffset - b.data.byteOffset;
    });
    blocks.forEach(function (block, bi) {
      var decoded = decodeBlock(block.data, block.type, timestampScale, timestamp);
      allBlocks.push(decoded);
    });
  });
  return {
    tracks: tracks,
    blocks: allBlocks
  };
};
// EXTERNAL MODULE: ./node_modules/@videojs/vhs-utils/es/id3-helpers.js
var id3_helpers = __webpack_require__(8925);
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/nal-helpers.js

var NAL_TYPE_ONE = (0,byte_helpers/* toUint8 */.Ki)([0x00, 0x00, 0x00, 0x01]);
var NAL_TYPE_TWO = (0,byte_helpers/* toUint8 */.Ki)([0x00, 0x00, 0x01]);
var EMULATION_PREVENTION = (0,byte_helpers/* toUint8 */.Ki)([0x00, 0x00, 0x03]);
/**
 * Expunge any "Emulation Prevention" bytes from a "Raw Byte
 * Sequence Payload"
 *
 * @param data {Uint8Array} the bytes of a RBSP from a NAL
 * unit
 * @return {Uint8Array} the RBSP without any Emulation
 * Prevention Bytes
 */

var discardEmulationPreventionBytes = function discardEmulationPreventionBytes(bytes) {
  var positions = [];
  var i = 1; // Find all `Emulation Prevention Bytes`

  while (i < bytes.length - 2) {
    if ((0,byte_helpers/* bytesMatch */.G3)(bytes.subarray(i, i + 3), EMULATION_PREVENTION)) {
      positions.push(i + 2);
      i++;
    }

    i++;
  } // If no Emulation Prevention Bytes were found just return the original
  // array


  if (positions.length === 0) {
    return bytes;
  } // Create a new array to hold the NAL unit data


  var newLength = bytes.length - positions.length;
  var newData = new Uint8Array(newLength);
  var sourceIndex = 0;

  for (i = 0; i < newLength; sourceIndex++, i++) {
    if (sourceIndex === positions[0]) {
      // Skip this byte
      sourceIndex++; // Remove this position index

      positions.shift();
    }

    newData[i] = bytes[sourceIndex];
  }

  return newData;
};
var findNal = function findNal(bytes, dataType, types, nalLimit) {
  if (nalLimit === void 0) {
    nalLimit = Infinity;
  }

  bytes = (0,byte_helpers/* toUint8 */.Ki)(bytes);
  types = [].concat(types);
  var i = 0;
  var nalStart;
  var nalsFound = 0; // keep searching until:
  // we reach the end of bytes
  // we reach the maximum number of nals they want to seach
  // NOTE: that we disregard nalLimit when we have found the start
  // of the nal we want so that we can find the end of the nal we want.

  while (i < bytes.length && (nalsFound < nalLimit || nalStart)) {
    var nalOffset = void 0;

    if ((0,byte_helpers/* bytesMatch */.G3)(bytes.subarray(i), NAL_TYPE_ONE)) {
      nalOffset = 4;
    } else if ((0,byte_helpers/* bytesMatch */.G3)(bytes.subarray(i), NAL_TYPE_TWO)) {
      nalOffset = 3;
    } // we are unsynced,
    // find the next nal unit


    if (!nalOffset) {
      i++;
      continue;
    }

    nalsFound++;

    if (nalStart) {
      return discardEmulationPreventionBytes(bytes.subarray(nalStart, i));
    }

    var nalType = void 0;

    if (dataType === 'h264') {
      nalType = bytes[i + nalOffset] & 0x1f;
    } else if (dataType === 'h265') {
      nalType = bytes[i + nalOffset] >> 1 & 0x3f;
    }

    if (types.indexOf(nalType) !== -1) {
      nalStart = i + nalOffset;
    } // nal header is 1 length for h264, and 2 for h265


    i += nalOffset + (dataType === 'h264' ? 1 : 2);
  }

  return bytes.subarray(0, 0);
};
var findH264Nal = function findH264Nal(bytes, type, nalLimit) {
  return findNal(bytes, 'h264', type, nalLimit);
};
var findH265Nal = function findH265Nal(bytes, type, nalLimit) {
  return findNal(bytes, 'h265', type, nalLimit);
};
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/containers.js





var CONSTANTS = {
  // "webm" string literal in hex
  'webm': (0,byte_helpers/* toUint8 */.Ki)([0x77, 0x65, 0x62, 0x6d]),
  // "matroska" string literal in hex
  'matroska': (0,byte_helpers/* toUint8 */.Ki)([0x6d, 0x61, 0x74, 0x72, 0x6f, 0x73, 0x6b, 0x61]),
  // "fLaC" string literal in hex
  'flac': (0,byte_helpers/* toUint8 */.Ki)([0x66, 0x4c, 0x61, 0x43]),
  // "OggS" string literal in hex
  'ogg': (0,byte_helpers/* toUint8 */.Ki)([0x4f, 0x67, 0x67, 0x53]),
  // ac-3 sync byte, also works for ec-3 as that is simply a codec
  // of ac-3
  'ac3': (0,byte_helpers/* toUint8 */.Ki)([0x0b, 0x77]),
  // "RIFF" string literal in hex used for wav and avi
  'riff': (0,byte_helpers/* toUint8 */.Ki)([0x52, 0x49, 0x46, 0x46]),
  // "AVI" string literal in hex
  'avi': (0,byte_helpers/* toUint8 */.Ki)([0x41, 0x56, 0x49]),
  // "WAVE" string literal in hex
  'wav': (0,byte_helpers/* toUint8 */.Ki)([0x57, 0x41, 0x56, 0x45]),
  // "ftyp3g" string literal in hex
  '3gp': (0,byte_helpers/* toUint8 */.Ki)([0x66, 0x74, 0x79, 0x70, 0x33, 0x67]),
  // "ftyp" string literal in hex
  'mp4': (0,byte_helpers/* toUint8 */.Ki)([0x66, 0x74, 0x79, 0x70]),
  // "styp" string literal in hex
  'fmp4': (0,byte_helpers/* toUint8 */.Ki)([0x73, 0x74, 0x79, 0x70]),
  // "ftypqt" string literal in hex
  'mov': (0,byte_helpers/* toUint8 */.Ki)([0x66, 0x74, 0x79, 0x70, 0x71, 0x74]),
  // moov string literal in hex
  'moov': (0,byte_helpers/* toUint8 */.Ki)([0x6D, 0x6F, 0x6F, 0x76]),
  // moof string literal in hex
  'moof': (0,byte_helpers/* toUint8 */.Ki)([0x6D, 0x6F, 0x6F, 0x66])
};
var _isLikely = {
  aac: function aac(bytes) {
    var offset = (0,id3_helpers/* getId3Offset */.c)(bytes);
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, [0xFF, 0x10], {
      offset: offset,
      mask: [0xFF, 0x16]
    });
  },
  mp3: function mp3(bytes) {
    var offset = (0,id3_helpers/* getId3Offset */.c)(bytes);
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, [0xFF, 0x02], {
      offset: offset,
      mask: [0xFF, 0x06]
    });
  },
  webm: function webm(bytes) {
    var docType = findEbml(bytes, [EBML_TAGS.EBML, EBML_TAGS.DocType])[0]; // check if DocType EBML tag is webm

    return (0,byte_helpers/* bytesMatch */.G3)(docType, CONSTANTS.webm);
  },
  mkv: function mkv(bytes) {
    var docType = findEbml(bytes, [EBML_TAGS.EBML, EBML_TAGS.DocType])[0]; // check if DocType EBML tag is matroska

    return (0,byte_helpers/* bytesMatch */.G3)(docType, CONSTANTS.matroska);
  },
  mp4: function mp4(bytes) {
    // if this file is another base media file format, it is not mp4
    if (_isLikely['3gp'](bytes) || _isLikely.mov(bytes)) {
      return false;
    } // if this file starts with a ftyp or styp box its mp4


    if ((0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.mp4, {
      offset: 4
    }) || (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.fmp4, {
      offset: 4
    })) {
      return true;
    } // if this file starts with a moof/moov box its mp4


    if ((0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.moof, {
      offset: 4
    }) || (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.moov, {
      offset: 4
    })) {
      return true;
    }
  },
  mov: function mov(bytes) {
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.mov, {
      offset: 4
    });
  },
  '3gp': function gp(bytes) {
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS['3gp'], {
      offset: 4
    });
  },
  ac3: function ac3(bytes) {
    var offset = (0,id3_helpers/* getId3Offset */.c)(bytes);
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.ac3, {
      offset: offset
    });
  },
  ts: function ts(bytes) {
    if (bytes.length < 189 && bytes.length >= 1) {
      return bytes[0] === 0x47;
    }

    var i = 0; // check the first 376 bytes for two matching sync bytes

    while (i + 188 < bytes.length && i < 188) {
      if (bytes[i] === 0x47 && bytes[i + 188] === 0x47) {
        return true;
      }

      i += 1;
    }

    return false;
  },
  flac: function flac(bytes) {
    var offset = (0,id3_helpers/* getId3Offset */.c)(bytes);
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.flac, {
      offset: offset
    });
  },
  ogg: function ogg(bytes) {
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.ogg);
  },
  avi: function avi(bytes) {
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.riff) && (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.avi, {
      offset: 8
    });
  },
  wav: function wav(bytes) {
    return (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.riff) && (0,byte_helpers/* bytesMatch */.G3)(bytes, CONSTANTS.wav, {
      offset: 8
    });
  },
  'h264': function h264(bytes) {
    // find seq_parameter_set_rbsp
    return findH264Nal(bytes, 7, 3).length;
  },
  'h265': function h265(bytes) {
    // find video_parameter_set_rbsp or seq_parameter_set_rbsp
    return findH265Nal(bytes, [32, 33], 3).length;
  }
}; // get all the isLikely functions
// but make sure 'ts' is above h264 and h265
// but below everything else as it is the least specific

var isLikelyTypes = Object.keys(_isLikely) // remove ts, h264, h265
.filter(function (t) {
  return t !== 'ts' && t !== 'h264' && t !== 'h265';
}) // add it back to the bottom
.concat(['ts', 'h264', 'h265']); // make sure we are dealing with uint8 data.

isLikelyTypes.forEach(function (type) {
  var isLikelyFn = _isLikely[type];

  _isLikely[type] = function (bytes) {
    return isLikelyFn((0,byte_helpers/* toUint8 */.Ki)(bytes));
  };
}); // export after wrapping

var isLikely = _isLikely; // A useful list of file signatures can be found here
// https://en.wikipedia.org/wiki/List_of_file_signatures

var detectContainerForBytes = function detectContainerForBytes(bytes) {
  bytes = (0,byte_helpers/* toUint8 */.Ki)(bytes);

  for (var i = 0; i < isLikelyTypes.length; i++) {
    var type = isLikelyTypes[i];

    if (isLikely[type](bytes)) {
      return type;
    }
  }

  return '';
}; // fmp4 is not a container

var isLikelyFmp4MediaSegment = function isLikelyFmp4MediaSegment(bytes) {
  return findBox(bytes, ['moof']).length > 0;
};

/***/ }),

/***/ 6722:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ decodeB64ToUint8Array; }
/* harmony export */ });
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8908);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var Buffer = __webpack_require__(816)["Buffer"];


var atob = function atob(s) {
  return (global_window__WEBPACK_IMPORTED_MODULE_0___default().atob) ? global_window__WEBPACK_IMPORTED_MODULE_0___default().atob(s) : Buffer.from(s, 'base64').toString('binary');
};

function decodeB64ToUint8Array(b64Text) {
  var decodedString = atob(b64Text);
  var array = new Uint8Array(decodedString.length);

  for (var i = 0; i < decodedString.length; i++) {
    array[i] = decodedString.charCodeAt(i);
  }

  return array;
}

/***/ }),

/***/ 8925:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": function() { return /* binding */ getId3Offset; }
/* harmony export */ });
/* unused harmony export getId3Size */
/* harmony import */ var _byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(562);

var ID3 = (0,_byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toUint8 */ .Ki)([0x49, 0x44, 0x33]);
var getId3Size = function getId3Size(bytes, offset) {
  if (offset === void 0) {
    offset = 0;
  }

  bytes = (0,_byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toUint8 */ .Ki)(bytes);
  var flags = bytes[offset + 5];
  var returnSize = bytes[offset + 6] << 21 | bytes[offset + 7] << 14 | bytes[offset + 8] << 7 | bytes[offset + 9];
  var footerPresent = (flags & 16) >> 4;

  if (footerPresent) {
    return returnSize + 20;
  }

  return returnSize + 10;
};
var getId3Offset = function getId3Offset(bytes, offset) {
  if (offset === void 0) {
    offset = 0;
  }

  bytes = (0,_byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toUint8 */ .Ki)(bytes);

  if (bytes.length - offset < 10 || !(0,_byte_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .bytesMatch */ .G3)(bytes, ID3, {
    offset: offset
  })) {
    return offset;
  }

  offset += getId3Size(bytes, offset); // recursive check for id3 tags as some files
  // have multiple ID3 tag sections even though
  // they should not.

  return getId3Offset(bytes, offset);
};

/***/ }),

/***/ 8485:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ simpleTypeFromSourceType; }
/* harmony export */ });
var MPEGURL_REGEX = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;
var DASH_REGEX = /^application\/dash\+xml/i;
/**
 * Returns a string that describes the type of source based on a video source object's
 * media type.
 *
 * @see {@link https://dev.w3.org/html5/pf-summary/video.html#dom-source-type|Source Type}
 *
 * @param {string} type
 *        Video source object media type
 * @return {('hls'|'dash'|'vhs-json'|null)}
 *         VHS source type string
 */

var simpleTypeFromSourceType = function simpleTypeFromSourceType(type) {
  if (MPEGURL_REGEX.test(type)) {
    return 'hls';
  }

  if (DASH_REGEX.test(type)) {
    return 'dash';
  } // Denotes the special case of a manifest object passed to http-streaming instead of a
  // source URL.
  //
  // See https://en.wikipedia.org/wiki/Media_type for details on specifying media types.
  //
  // In this case, vnd stands for vendor, video.js for the organization, VHS for this
  // project, and the +json suffix identifies the structure of the media type.


  if (type === 'application/vnd.videojs.vhs+json') {
    return 'vhs-json';
  }

  return null;
};

/***/ }),

/***/ 779:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9945);
/* harmony import */ var url_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url_toolkit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8908);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_1__);


var DEFAULT_LOCATION = 'http://example.com';

var resolveUrl = function resolveUrl(baseUrl, relativeUrl) {
  // return early if we don't need to resolve
  if (/^[a-z]+:/i.test(relativeUrl)) {
    return relativeUrl;
  } // if baseUrl is a data URI, ignore it and resolve everything relative to window.location


  if (/^data:/.test(baseUrl)) {
    baseUrl = (global_window__WEBPACK_IMPORTED_MODULE_1___default().location) && (global_window__WEBPACK_IMPORTED_MODULE_1___default().location.href) || '';
  } // IE11 supports URL but not the URL constructor
  // feature detect the behavior we want


  var nativeURL = typeof (global_window__WEBPACK_IMPORTED_MODULE_1___default().URL) === 'function';
  var protocolLess = /^\/\//.test(baseUrl); // remove location if window.location isn't available (i.e. we're in node)
  // and if baseUrl isn't an absolute url

  var removeLocation = !(global_window__WEBPACK_IMPORTED_MODULE_1___default().location) && !/\/\//i.test(baseUrl); // if the base URL is relative then combine with the current location

  if (nativeURL) {
    baseUrl = new (global_window__WEBPACK_IMPORTED_MODULE_1___default().URL)(baseUrl, (global_window__WEBPACK_IMPORTED_MODULE_1___default().location) || DEFAULT_LOCATION);
  } else if (!/\/\//i.test(baseUrl)) {
    baseUrl = url_toolkit__WEBPACK_IMPORTED_MODULE_0___default().buildAbsoluteURL((global_window__WEBPACK_IMPORTED_MODULE_1___default().location) && (global_window__WEBPACK_IMPORTED_MODULE_1___default().location.href) || '', baseUrl);
  }

  if (nativeURL) {
    var newUrl = new URL(relativeUrl, baseUrl); // if we're a protocol-less url, remove the protocol
    // and if we're location-less, remove the location
    // otherwise, return the url unmodified

    if (removeLocation) {
      return newUrl.href.slice(DEFAULT_LOCATION.length);
    } else if (protocolLess) {
      return newUrl.href.slice(newUrl.protocol.length);
    }

    return newUrl.href;
  }

  return url_toolkit__WEBPACK_IMPORTED_MODULE_0___default().buildAbsoluteURL(baseUrl, relativeUrl);
};

/* harmony default export */ __webpack_exports__["Z"] = (resolveUrl);

/***/ }),

/***/ 3490:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(8908);

var httpResponseHandler = function httpResponseHandler(callback, decodeResponseBody) {
  if (decodeResponseBody === void 0) {
    decodeResponseBody = false;
  }

  return function (err, response, responseBody) {
    // if the XHR failed, return that error
    if (err) {
      callback(err);
      return;
    } // if the HTTP status code is 4xx or 5xx, the request also failed


    if (response.statusCode >= 400 && response.statusCode <= 599) {
      var cause = responseBody;

      if (decodeResponseBody) {
        if (window.TextDecoder) {
          var charset = getCharset(response.headers && response.headers['content-type']);

          try {
            cause = new TextDecoder(charset).decode(responseBody);
          } catch (e) {}
        } else {
          cause = String.fromCharCode.apply(null, new Uint8Array(responseBody));
        }
      }

      callback({
        cause: cause
      });
      return;
    } // otherwise, request succeeded


    callback(null, responseBody);
  };
};

function getCharset(contentTypeHeader) {
  if (contentTypeHeader === void 0) {
    contentTypeHeader = '';
  }

  return contentTypeHeader.toLowerCase().split(';').reduce(function (charset, contentType) {
    var _contentType$split = contentType.split('='),
        type = _contentType$split[0],
        value = _contentType$split[1];

    if (type.trim() === 'charset') {
      return value.trim();
    }

    return charset;
  }, 'utf-8');
}

module.exports = httpResponseHandler;

/***/ }),

/***/ 9603:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(8908);

var _extends = __webpack_require__(7154);

var isFunction = __webpack_require__(7376);

createXHR.httpHandler = __webpack_require__(3490);
/**
 * @license
 * slighly modified parse-headers 2.0.2 <https://github.com/kesla/parse-headers/>
 * Copyright (c) 2014 David Björklund
 * Available under the MIT license
 * <https://github.com/kesla/parse-headers/blob/master/LICENCE>
 */

var parseHeaders = function parseHeaders(headers) {
  var result = {};

  if (!headers) {
    return result;
  }

  headers.trim().split('\n').forEach(function (row) {
    var index = row.indexOf(':');
    var key = row.slice(0, index).trim().toLowerCase();
    var value = row.slice(index + 1).trim();

    if (typeof result[key] === 'undefined') {
      result[key] = value;
    } else if (Array.isArray(result[key])) {
      result[key].push(value);
    } else {
      result[key] = [result[key], value];
    }
  });
  return result;
};

module.exports = createXHR; // Allow use of default import syntax in TypeScript

module.exports["default"] = createXHR;
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop;
createXHR.XDomainRequest = "withCredentials" in new createXHR.XMLHttpRequest() ? createXHR.XMLHttpRequest : window.XDomainRequest;
forEachArray(["get", "put", "post", "patch", "head", "delete"], function (method) {
  createXHR[method === "delete" ? "del" : method] = function (uri, options, callback) {
    options = initParams(uri, options, callback);
    options.method = method.toUpperCase();
    return _createXHR(options);
  };
});

function forEachArray(array, iterator) {
  for (var i = 0; i < array.length; i++) {
    iterator(array[i]);
  }
}

function isEmpty(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) return false;
  }

  return true;
}

function initParams(uri, options, callback) {
  var params = uri;

  if (isFunction(options)) {
    callback = options;

    if (typeof uri === "string") {
      params = {
        uri: uri
      };
    }
  } else {
    params = _extends({}, options, {
      uri: uri
    });
  }

  params.callback = callback;
  return params;
}

function createXHR(uri, options, callback) {
  options = initParams(uri, options, callback);
  return _createXHR(options);
}

function _createXHR(options) {
  if (typeof options.callback === "undefined") {
    throw new Error("callback argument missing");
  }

  var called = false;

  var callback = function cbOnce(err, response, body) {
    if (!called) {
      called = true;
      options.callback(err, response, body);
    }
  };

  function readystatechange() {
    if (xhr.readyState === 4) {
      setTimeout(loadFunc, 0);
    }
  }

  function getBody() {
    // Chrome with requestType=blob throws errors arround when even testing access to responseText
    var body = undefined;

    if (xhr.response) {
      body = xhr.response;
    } else {
      body = xhr.responseText || getXml(xhr);
    }

    if (isJson) {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    return body;
  }

  function errorFunc(evt) {
    clearTimeout(timeoutTimer);

    if (!(evt instanceof Error)) {
      evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"));
    }

    evt.statusCode = 0;
    return callback(evt, failureResponse);
  } // will load the data & process the response in a special response object


  function loadFunc() {
    if (aborted) return;
    var status;
    clearTimeout(timeoutTimer);

    if (options.useXDR && xhr.status === undefined) {
      //IE8 CORS GET successful response doesn't have a status field, but body is fine
      status = 200;
    } else {
      status = xhr.status === 1223 ? 204 : xhr.status;
    }

    var response = failureResponse;
    var err = null;

    if (status !== 0) {
      response = {
        body: getBody(),
        statusCode: status,
        method: method,
        headers: {},
        url: uri,
        rawRequest: xhr
      };

      if (xhr.getAllResponseHeaders) {
        //remember xhr can in fact be XDR for CORS in IE
        response.headers = parseHeaders(xhr.getAllResponseHeaders());
      }
    } else {
      err = new Error("Internal XMLHttpRequest Error");
    }

    return callback(err, response, response.body);
  }

  var xhr = options.xhr || null;

  if (!xhr) {
    if (options.cors || options.useXDR) {
      xhr = new createXHR.XDomainRequest();
    } else {
      xhr = new createXHR.XMLHttpRequest();
    }
  }

  var key;
  var aborted;
  var uri = xhr.url = options.uri || options.url;
  var method = xhr.method = options.method || "GET";
  var body = options.body || options.data;
  var headers = xhr.headers = options.headers || {};
  var sync = !!options.sync;
  var isJson = false;
  var timeoutTimer;
  var failureResponse = {
    body: undefined,
    headers: {},
    statusCode: 0,
    method: method,
    url: uri,
    rawRequest: xhr
  };

  if ("json" in options && options.json !== false) {
    isJson = true;
    headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json"); //Don't override existing accept header declared by user

    if (method !== "GET" && method !== "HEAD") {
      headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json"); //Don't override existing accept header declared by user

      body = JSON.stringify(options.json === true ? body : options.json);
    }
  }

  xhr.onreadystatechange = readystatechange;
  xhr.onload = loadFunc;
  xhr.onerror = errorFunc; // IE9 must have onprogress be set to a unique function.

  xhr.onprogress = function () {// IE must die
  };

  xhr.onabort = function () {
    aborted = true;
  };

  xhr.ontimeout = errorFunc;
  xhr.open(method, uri, !sync, options.username, options.password); //has to be after open

  if (!sync) {
    xhr.withCredentials = !!options.withCredentials;
  } // Cannot set timeout with sync request
  // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
  // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent


  if (!sync && options.timeout > 0) {
    timeoutTimer = setTimeout(function () {
      if (aborted) return;
      aborted = true; //IE9 may still call readystatechange

      xhr.abort("timeout");
      var e = new Error("XMLHttpRequest timeout");
      e.code = "ETIMEDOUT";
      errorFunc(e);
    }, options.timeout);
  }

  if (xhr.setRequestHeader) {
    for (key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
  } else if (options.headers && !isEmpty(options.headers)) {
    throw new Error("Headers cannot be set on an XDomainRequest object");
  }

  if ("responseType" in options) {
    xhr.responseType = options.responseType;
  }

  if ("beforeSend" in options && typeof options.beforeSend === "function") {
    options.beforeSend(xhr);
  } // Microsoft Edge browser sends "undefined" when send is called with undefined value.
  // XMLHttpRequest spec says to pass null as body to indicate no body
  // See https://github.com/naugtur/xhr/issues/100.


  xhr.send(body || null);
  return xhr;
}

function getXml(xhr) {
  // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
  // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
  try {
    if (xhr.responseType === "document") {
      return xhr.responseXML;
    }

    var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror";

    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
      return xhr.responseXML;
    }
  } catch (e) {}

  return null;
}

function noop() {}

/***/ }),

/***/ 2167:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
})

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
})

exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;


/***/ }),

/***/ 6129:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;
var conventions = __webpack_require__(2167);
var dom = __webpack_require__(1146)
var entities = __webpack_require__(1045);
var sax = __webpack_require__(6925);

var DOMImplementation = dom.DOMImplementation;

var NAMESPACE = conventions.NAMESPACE;

var ParseError = sax.ParseError;
var XMLReader = sax.XMLReader;

function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	if(source && typeof source === 'string'){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
					this.doc.doctype = dt;
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		throw new ParseError(error, this.locator);
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

__webpack_unused_export__ = DOMHandler;
exports.DOMParser = DOMParser;

/**
 * @deprecated Import/require from main entry point instead
 */
__webpack_unused_export__ = dom.DOMImplementation;

/**
 * @deprecated Import/require from main entry point instead
 */
__webpack_unused_export__ = dom.XMLSerializer;


/***/ }),

/***/ 1146:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var conventions = __webpack_require__(2167);

var NAMESPACE = conventions.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}

/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknown Class:"+Class)
		}
		pt.constructor = Class
	}
}

// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};

function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);

/**
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};

/**
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation() {
}

DOMImplementation.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
	/**
	 * Look up the prefix associated to the given namespace URI, starting from this node.
	 * **The default namespace declarations are ignored by this method.**
	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
	 *
	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
	 *
	 * @param {string | null} namespaceURI
	 * @returns {string | null}
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
	 * @see https://github.com/xmldom/xmldom/issues/322
	 */
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}

function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}

function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	/**
	 * The DocumentType node of the document.
	 *
	 * @readonly
	 * @type DocumentType
	 */
	doctype :  null,
	documentElement :  null,
	_inc : 1,

	insertBefore :  function(newChild, refChild){//raises
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}

		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames)
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class')
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames)
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
		return false;
	}
	
	var i = visibleNamespaces.length 
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * The replacement text of any entity referred to directly or indirectly in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml/#CleanAttrVals
 * @see https://www.w3.org/TR/xml/#NT-AttValue
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<&"]/g,_xmlEncoder), '"')
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}

	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

		var prefixedNodeName = nodeName
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS
			// lookup current default ns from `xmlns` attribute
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value
					break
				}
			}
			if (!defaultNS) {
				// lookup current default ns in visibleNamespaces
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
						defaultNS = namespace.namespace
						break
					}
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}

		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node		
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 */
		return buf.push(node.data
			.replace(/[<&]/g,_xmlEncoder)
			.replace(/]]>/g, ']]&gt;')
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});

		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},

			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;

				default:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}

		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ 1045:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var freeze = (__webpack_require__(2167).freeze);

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'})

/**
 * A map of currently 241 entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
       lt: '<',
       gt: '>',
       amp: '&',
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
       'int': "∫",
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

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES


/***/ }),

/***/ 3969:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;
var dom = __webpack_require__(1146)
__webpack_unused_export__ = dom.DOMImplementation
__webpack_unused_export__ = dom.XMLSerializer
exports.DOMParser = __webpack_require__(6129).DOMParser


/***/ }),

/***/ 6925:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var NAMESPACE = (__webpack_require__(2167).NAMESPACE);

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}

				if (NAMESPACE.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (el.attributeNames.hasOwnProperty(qname)) {
			errorHandler.fatalError('Attribute ' + qname + ' redefined')
		}
		el.addValue(qname, value, startIndex)
	}
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName'); // No known test case
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				addAttribute(attrName, value, start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value.replace(/&#?\w+;/g,entityReplacer), start)
				}else{
					if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = NAMESPACE.XMLNS
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE.XML;
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;
exports.ParseError = ParseError;


/***/ }),

/***/ 9144:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var topLevel = typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g :
    typeof window !== 'undefined' ? window : {}
var minDoc = __webpack_require__(7579);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;


/***/ }),

/***/ 8908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof __webpack_require__.g !== "undefined") {
    win = __webpack_require__.g;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;


/***/ }),

/***/ 7376:
/***/ (function(module) {

module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  if (!fn) {
    return false
  }
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};


/***/ }),

/***/ 7537:
/***/ (function(module, exports) {

// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

function keyCode(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Compares a keyboard event with a given keyCode or keyName.
 *
 * @param {Event} event Keyboard event that should be tested
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Boolean}
 * @api public
 */
keyCode.isEventKey = function isEventKey(event, nameOrCode) {
  if (event && 'object' === typeof event) {
    var keyCode = event.which || event.keyCode || event.charCode
    if (keyCode === null || keyCode === undefined) { return false; }
    if (typeof nameOrCode === 'string') {
      // check codes
      var foundNamedKey = codes[nameOrCode.toLowerCase()]
      if (foundNamedKey) { return foundNamedKey === keyCode; }
    
      // check aliases
      var foundNamedKey = aliases[nameOrCode.toLowerCase()]
      if (foundNamedKey) { return foundNamedKey === keyCode; }
    } else if (typeof nameOrCode === 'number') {
      return nameOrCode === keyCode;
    }
    return false;
  }
}

exports = module.exports = keyCode;

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'spacebar': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
}

/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}


/***/ }),

/***/ 9323:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "_b": function() { return /* binding */ Parser; }
});

// UNUSED EXPORTS: LineStream, ParseStream

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
var inheritsLoose = __webpack_require__(4578);
;// CONCATENATED MODULE: ./node_modules/@videojs/vhs-utils/es/stream.js
/**
 * @file stream.js
 */

/**
 * A lightweight readable stream implemention that handles event dispatching.
 *
 * @class Stream
 */
var Stream = /*#__PURE__*/function () {
  function Stream() {
    this.listeners = {};
  }
  /**
   * Add a listener for a specified event type.
   *
   * @param {string} type the event name
   * @param {Function} listener the callback to be invoked when an event of
   * the specified type occurs
   */


  var _proto = Stream.prototype;

  _proto.on = function on(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }
  /**
   * Remove a listener for a specified event type.
   *
   * @param {string} type the event name
   * @param {Function} listener  a function previously registered for this
   * type of event through `on`
   * @return {boolean} if we could turn it off or not
   */
  ;

  _proto.off = function off(type, listener) {
    if (!this.listeners[type]) {
      return false;
    }

    var index = this.listeners[type].indexOf(listener); // TODO: which is better?
    // In Video.js we slice listener functions
    // on trigger so that it does not mess up the order
    // while we loop through.
    //
    // Here we slice on off so that the loop in trigger
    // can continue using it's old reference to loop without
    // messing up the order.

    this.listeners[type] = this.listeners[type].slice(0);
    this.listeners[type].splice(index, 1);
    return index > -1;
  }
  /**
   * Trigger an event of the specified type on this stream. Any additional
   * arguments to this function are passed as parameters to event listeners.
   *
   * @param {string} type the event name
   */
  ;

  _proto.trigger = function trigger(type) {
    var callbacks = this.listeners[type];

    if (!callbacks) {
      return;
    } // Slicing the arguments on every invocation of this method
    // can add a significant amount of overhead. Avoid the
    // intermediate object creation for the common case of a
    // single callback argument


    if (arguments.length === 2) {
      var length = callbacks.length;

      for (var i = 0; i < length; ++i) {
        callbacks[i].call(this, arguments[1]);
      }
    } else {
      var args = Array.prototype.slice.call(arguments, 1);
      var _length = callbacks.length;

      for (var _i = 0; _i < _length; ++_i) {
        callbacks[_i].apply(this, args);
      }
    }
  }
  /**
   * Destroys the stream and cleans up.
   */
  ;

  _proto.dispose = function dispose() {
    this.listeners = {};
  }
  /**
   * Forwards all `data` events on this stream to the destination stream. The
   * destination stream should provide a method `push` to receive the data
   * events as they arrive.
   *
   * @param {Stream} destination the stream that will receive all `data` events
   * @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
   */
  ;

  _proto.pipe = function pipe(destination) {
    this.on('data', function (data) {
      destination.push(data);
    });
  };

  return Stream;
}();


// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(7462);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(7326);
// EXTERNAL MODULE: ./node_modules/@videojs/vhs-utils/es/decode-b64-to-uint8-array.js
var decode_b64_to_uint8_array = __webpack_require__(6722);
;// CONCATENATED MODULE: ./node_modules/m3u8-parser/dist/m3u8-parser.es.js
/*! @name m3u8-parser @version 4.7.0 @license Apache-2.0 */






/**
 * A stream that buffers string input and generates a `data` event for each
 * line.
 *
 * @class LineStream
 * @extends Stream
 */

var LineStream = /*#__PURE__*/function (_Stream) {
  (0,inheritsLoose/* default */.Z)(LineStream, _Stream);

  function LineStream() {
    var _this;

    _this = _Stream.call(this) || this;
    _this.buffer = '';
    return _this;
  }
  /**
   * Add new data to be parsed.
   *
   * @param {string} data the text to process
   */


  var _proto = LineStream.prototype;

  _proto.push = function push(data) {
    var nextNewline;
    this.buffer += data;
    nextNewline = this.buffer.indexOf('\n');

    for (; nextNewline > -1; nextNewline = this.buffer.indexOf('\n')) {
      this.trigger('data', this.buffer.substring(0, nextNewline));
      this.buffer = this.buffer.substring(nextNewline + 1);
    }
  };

  return LineStream;
}(Stream);

var TAB = String.fromCharCode(0x09);

var parseByterange = function parseByterange(byterangeString) {
  // optionally match and capture 0+ digits before `@`
  // optionally match and capture 0+ digits after `@`
  var match = /([0-9.]*)?@?([0-9.]*)?/.exec(byterangeString || '');
  var result = {};

  if (match[1]) {
    result.length = parseInt(match[1], 10);
  }

  if (match[2]) {
    result.offset = parseInt(match[2], 10);
  }

  return result;
};
/**
 * "forgiving" attribute list psuedo-grammar:
 * attributes -> keyvalue (',' keyvalue)*
 * keyvalue   -> key '=' value
 * key        -> [^=]*
 * value      -> '"' [^"]* '"' | [^,]*
 */


var attributeSeparator = function attributeSeparator() {
  var key = '[^=]*';
  var value = '"[^"]*"|[^,]*';
  var keyvalue = '(?:' + key + ')=(?:' + value + ')';
  return new RegExp('(?:^|,)(' + keyvalue + ')');
};
/**
 * Parse attributes from a line given the separator
 *
 * @param {string} attributes the attribute line to parse
 */


var parseAttributes = function parseAttributes(attributes) {
  // split the string using attributes as the separator
  var attrs = attributes.split(attributeSeparator());
  var result = {};
  var i = attrs.length;
  var attr;

  while (i--) {
    // filter out unmatched portions of the string
    if (attrs[i] === '') {
      continue;
    } // split the key and value


    attr = /([^=]*)=(.*)/.exec(attrs[i]).slice(1); // trim whitespace and remove optional quotes around the value

    attr[0] = attr[0].replace(/^\s+|\s+$/g, '');
    attr[1] = attr[1].replace(/^\s+|\s+$/g, '');
    attr[1] = attr[1].replace(/^['"](.*)['"]$/g, '$1');
    result[attr[0]] = attr[1];
  }

  return result;
};
/**
 * A line-level M3U8 parser event stream. It expects to receive input one
 * line at a time and performs a context-free parse of its contents. A stream
 * interpretation of a manifest can be useful if the manifest is expected to
 * be too large to fit comfortably into memory or the entirety of the input
 * is not immediately available. Otherwise, it's probably much easier to work
 * with a regular `Parser` object.
 *
 * Produces `data` events with an object that captures the parser's
 * interpretation of the input. That object has a property `tag` that is one
 * of `uri`, `comment`, or `tag`. URIs only have a single additional
 * property, `line`, which captures the entirety of the input without
 * interpretation. Comments similarly have a single additional property
 * `text` which is the input without the leading `#`.
 *
 * Tags always have a property `tagType` which is the lower-cased version of
 * the M3U8 directive without the `#EXT` or `#EXT-X-` prefix. For instance,
 * `#EXT-X-MEDIA-SEQUENCE` becomes `media-sequence` when parsed. Unrecognized
 * tags are given the tag type `unknown` and a single additional property
 * `data` with the remainder of the input.
 *
 * @class ParseStream
 * @extends Stream
 */


var ParseStream = /*#__PURE__*/function (_Stream) {
  (0,inheritsLoose/* default */.Z)(ParseStream, _Stream);

  function ParseStream() {
    var _this;

    _this = _Stream.call(this) || this;
    _this.customParsers = [];
    _this.tagMappers = [];
    return _this;
  }
  /**
   * Parses an additional line of input.
   *
   * @param {string} line a single line of an M3U8 file to parse
   */


  var _proto = ParseStream.prototype;

  _proto.push = function push(line) {
    var _this2 = this;

    var match;
    var event; // strip whitespace

    line = line.trim();

    if (line.length === 0) {
      // ignore empty lines
      return;
    } // URIs


    if (line[0] !== '#') {
      this.trigger('data', {
        type: 'uri',
        uri: line
      });
      return;
    } // map tags


    var newLines = this.tagMappers.reduce(function (acc, mapper) {
      var mappedLine = mapper(line); // skip if unchanged

      if (mappedLine === line) {
        return acc;
      }

      return acc.concat([mappedLine]);
    }, [line]);
    newLines.forEach(function (newLine) {
      for (var i = 0; i < _this2.customParsers.length; i++) {
        if (_this2.customParsers[i].call(_this2, newLine)) {
          return;
        }
      } // Comments


      if (newLine.indexOf('#EXT') !== 0) {
        _this2.trigger('data', {
          type: 'comment',
          text: newLine.slice(1)
        });

        return;
      } // strip off any carriage returns here so the regex matching
      // doesn't have to account for them.


      newLine = newLine.replace('\r', ''); // Tags

      match = /^#EXTM3U/.exec(newLine);

      if (match) {
        _this2.trigger('data', {
          type: 'tag',
          tagType: 'm3u'
        });

        return;
      }

      match = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'inf'
        };

        if (match[1]) {
          event.duration = parseFloat(match[1]);
        }

        if (match[2]) {
          event.title = match[2];
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'targetduration'
        };

        if (match[1]) {
          event.duration = parseInt(match[1], 10);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'version'
        };

        if (match[1]) {
          event.version = parseInt(match[1], 10);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'media-sequence'
        };

        if (match[1]) {
          event.number = parseInt(match[1], 10);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'discontinuity-sequence'
        };

        if (match[1]) {
          event.number = parseInt(match[1], 10);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'playlist-type'
        };

        if (match[1]) {
          event.playlistType = match[1];
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-BYTERANGE:?(.*)?$/.exec(newLine);

      if (match) {
        event = (0,esm_extends/* default */.Z)(parseByterange(match[1]), {
          type: 'tag',
          tagType: 'byterange'
        });

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'allow-cache'
        };

        if (match[1]) {
          event.allowed = !/NO/.test(match[1]);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-MAP:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'map'
        };

        if (match[1]) {
          var attributes = parseAttributes(match[1]);

          if (attributes.URI) {
            event.uri = attributes.URI;
          }

          if (attributes.BYTERANGE) {
            event.byterange = parseByterange(attributes.BYTERANGE);
          }
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-STREAM-INF:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'stream-inf'
        };

        if (match[1]) {
          event.attributes = parseAttributes(match[1]);

          if (event.attributes.RESOLUTION) {
            var split = event.attributes.RESOLUTION.split('x');
            var resolution = {};

            if (split[0]) {
              resolution.width = parseInt(split[0], 10);
            }

            if (split[1]) {
              resolution.height = parseInt(split[1], 10);
            }

            event.attributes.RESOLUTION = resolution;
          }

          if (event.attributes.BANDWIDTH) {
            event.attributes.BANDWIDTH = parseInt(event.attributes.BANDWIDTH, 10);
          }

          if (event.attributes['PROGRAM-ID']) {
            event.attributes['PROGRAM-ID'] = parseInt(event.attributes['PROGRAM-ID'], 10);
          }
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-MEDIA:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'media'
        };

        if (match[1]) {
          event.attributes = parseAttributes(match[1]);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-ENDLIST/.exec(newLine);

      if (match) {
        _this2.trigger('data', {
          type: 'tag',
          tagType: 'endlist'
        });

        return;
      }

      match = /^#EXT-X-DISCONTINUITY/.exec(newLine);

      if (match) {
        _this2.trigger('data', {
          type: 'tag',
          tagType: 'discontinuity'
        });

        return;
      }

      match = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'program-date-time'
        };

        if (match[1]) {
          event.dateTimeString = match[1];
          event.dateTimeObject = new Date(match[1]);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-KEY:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'key'
        };

        if (match[1]) {
          event.attributes = parseAttributes(match[1]); // parse the IV string into a Uint32Array

          if (event.attributes.IV) {
            if (event.attributes.IV.substring(0, 2).toLowerCase() === '0x') {
              event.attributes.IV = event.attributes.IV.substring(2);
            }

            event.attributes.IV = event.attributes.IV.match(/.{8}/g);
            event.attributes.IV[0] = parseInt(event.attributes.IV[0], 16);
            event.attributes.IV[1] = parseInt(event.attributes.IV[1], 16);
            event.attributes.IV[2] = parseInt(event.attributes.IV[2], 16);
            event.attributes.IV[3] = parseInt(event.attributes.IV[3], 16);
            event.attributes.IV = new Uint32Array(event.attributes.IV);
          }
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-START:?(.*)$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'start'
        };

        if (match[1]) {
          event.attributes = parseAttributes(match[1]);
          event.attributes['TIME-OFFSET'] = parseFloat(event.attributes['TIME-OFFSET']);
          event.attributes.PRECISE = /YES/.test(event.attributes.PRECISE);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'cue-out-cont'
        };

        if (match[1]) {
          event.data = match[1];
        } else {
          event.data = '';
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'cue-out'
        };

        if (match[1]) {
          event.data = match[1];
        } else {
          event.data = '';
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-CUE-IN:?(.*)?$/.exec(newLine);

      if (match) {
        event = {
          type: 'tag',
          tagType: 'cue-in'
        };

        if (match[1]) {
          event.data = match[1];
        } else {
          event.data = '';
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-SKIP:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'skip'
        };
        event.attributes = parseAttributes(match[1]);

        if (event.attributes.hasOwnProperty('SKIPPED-SEGMENTS')) {
          event.attributes['SKIPPED-SEGMENTS'] = parseInt(event.attributes['SKIPPED-SEGMENTS'], 10);
        }

        if (event.attributes.hasOwnProperty('RECENTLY-REMOVED-DATERANGES')) {
          event.attributes['RECENTLY-REMOVED-DATERANGES'] = event.attributes['RECENTLY-REMOVED-DATERANGES'].split(TAB);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-PART:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'part'
        };
        event.attributes = parseAttributes(match[1]);
        ['DURATION'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = parseFloat(event.attributes[key]);
          }
        });
        ['INDEPENDENT', 'GAP'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = /YES/.test(event.attributes[key]);
          }
        });

        if (event.attributes.hasOwnProperty('BYTERANGE')) {
          event.attributes.byterange = parseByterange(event.attributes.BYTERANGE);
        }

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'server-control'
        };
        event.attributes = parseAttributes(match[1]);
        ['CAN-SKIP-UNTIL', 'PART-HOLD-BACK', 'HOLD-BACK'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = parseFloat(event.attributes[key]);
          }
        });
        ['CAN-SKIP-DATERANGES', 'CAN-BLOCK-RELOAD'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = /YES/.test(event.attributes[key]);
          }
        });

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-PART-INF:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'part-inf'
        };
        event.attributes = parseAttributes(match[1]);
        ['PART-TARGET'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = parseFloat(event.attributes[key]);
          }
        });

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'preload-hint'
        };
        event.attributes = parseAttributes(match[1]);
        ['BYTERANGE-START', 'BYTERANGE-LENGTH'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = parseInt(event.attributes[key], 10);
            var subkey = key === 'BYTERANGE-LENGTH' ? 'length' : 'offset';
            event.attributes.byterange = event.attributes.byterange || {};
            event.attributes.byterange[subkey] = event.attributes[key]; // only keep the parsed byterange object.

            delete event.attributes[key];
          }
        });

        _this2.trigger('data', event);

        return;
      }

      match = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(newLine);

      if (match && match[1]) {
        event = {
          type: 'tag',
          tagType: 'rendition-report'
        };
        event.attributes = parseAttributes(match[1]);
        ['LAST-MSN', 'LAST-PART'].forEach(function (key) {
          if (event.attributes.hasOwnProperty(key)) {
            event.attributes[key] = parseInt(event.attributes[key], 10);
          }
        });

        _this2.trigger('data', event);

        return;
      } // unknown tag type


      _this2.trigger('data', {
        type: 'tag',
        data: newLine.slice(4)
      });
    });
  }
  /**
   * Add a parser for custom headers
   *
   * @param {Object}   options              a map of options for the added parser
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {string}   options.customType   the custom type to register to the output
   * @param {Function} [options.dataParser] function to parse the line into an object
   * @param {boolean}  [options.segment]    should tag data be attached to the segment object
   */
  ;

  _proto.addParser = function addParser(_ref) {
    var _this3 = this;

    var expression = _ref.expression,
        customType = _ref.customType,
        dataParser = _ref.dataParser,
        segment = _ref.segment;

    if (typeof dataParser !== 'function') {
      dataParser = function dataParser(line) {
        return line;
      };
    }

    this.customParsers.push(function (line) {
      var match = expression.exec(line);

      if (match) {
        _this3.trigger('data', {
          type: 'custom',
          data: dataParser(line),
          customType: customType,
          segment: segment
        });

        return true;
      }
    });
  }
  /**
   * Add a custom header mapper
   *
   * @param {Object}   options
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {Function} options.map          function to translate tag into a different tag
   */
  ;

  _proto.addTagMapper = function addTagMapper(_ref2) {
    var expression = _ref2.expression,
        map = _ref2.map;

    var mapFn = function mapFn(line) {
      if (expression.test(line)) {
        return map(line);
      }

      return line;
    };

    this.tagMappers.push(mapFn);
  };

  return ParseStream;
}(Stream);

var camelCase = function camelCase(str) {
  return str.toLowerCase().replace(/-(\w)/g, function (a) {
    return a[1].toUpperCase();
  });
};

var camelCaseKeys = function camelCaseKeys(attributes) {
  var result = {};
  Object.keys(attributes).forEach(function (key) {
    result[camelCase(key)] = attributes[key];
  });
  return result;
}; // set SERVER-CONTROL hold back based upon targetDuration and partTargetDuration
// we need this helper because defaults are based upon targetDuration and
// partTargetDuration being set, but they may not be if SERVER-CONTROL appears before
// target durations are set.


var setHoldBack = function setHoldBack(manifest) {
  var serverControl = manifest.serverControl,
      targetDuration = manifest.targetDuration,
      partTargetDuration = manifest.partTargetDuration;

  if (!serverControl) {
    return;
  }

  var tag = '#EXT-X-SERVER-CONTROL';
  var hb = 'holdBack';
  var phb = 'partHoldBack';
  var minTargetDuration = targetDuration && targetDuration * 3;
  var minPartDuration = partTargetDuration && partTargetDuration * 2;

  if (targetDuration && !serverControl.hasOwnProperty(hb)) {
    serverControl[hb] = minTargetDuration;
    this.trigger('info', {
      message: tag + " defaulting HOLD-BACK to targetDuration * 3 (" + minTargetDuration + ")."
    });
  }

  if (minTargetDuration && serverControl[hb] < minTargetDuration) {
    this.trigger('warn', {
      message: tag + " clamping HOLD-BACK (" + serverControl[hb] + ") to targetDuration * 3 (" + minTargetDuration + ")"
    });
    serverControl[hb] = minTargetDuration;
  } // default no part hold back to part target duration * 3


  if (partTargetDuration && !serverControl.hasOwnProperty(phb)) {
    serverControl[phb] = partTargetDuration * 3;
    this.trigger('info', {
      message: tag + " defaulting PART-HOLD-BACK to partTargetDuration * 3 (" + serverControl[phb] + ")."
    });
  } // if part hold back is too small default it to part target duration * 2


  if (partTargetDuration && serverControl[phb] < minPartDuration) {
    this.trigger('warn', {
      message: tag + " clamping PART-HOLD-BACK (" + serverControl[phb] + ") to partTargetDuration * 2 (" + minPartDuration + ")."
    });
    serverControl[phb] = minPartDuration;
  }
};
/**
 * A parser for M3U8 files. The current interpretation of the input is
 * exposed as a property `manifest` on parser objects. It's just two lines to
 * create and parse a manifest once you have the contents available as a string:
 *
 * ```js
 * var parser = new m3u8.Parser();
 * parser.push(xhr.responseText);
 * ```
 *
 * New input can later be applied to update the manifest object by calling
 * `push` again.
 *
 * The parser attempts to create a usable manifest object even if the
 * underlying input is somewhat nonsensical. It emits `info` and `warning`
 * events during the parse if it encounters input that seems invalid or
 * requires some property of the manifest object to be defaulted.
 *
 * @class Parser
 * @extends Stream
 */


var Parser = /*#__PURE__*/function (_Stream) {
  (0,inheritsLoose/* default */.Z)(Parser, _Stream);

  function Parser() {
    var _this;

    _this = _Stream.call(this) || this;
    _this.lineStream = new LineStream();
    _this.parseStream = new ParseStream();

    _this.lineStream.pipe(_this.parseStream);
    /* eslint-disable consistent-this */


    var self = (0,assertThisInitialized/* default */.Z)(_this);
    /* eslint-enable consistent-this */


    var uris = [];
    var currentUri = {}; // if specified, the active EXT-X-MAP definition

    var currentMap; // if specified, the active decryption key

    var _key;

    var hasParts = false;

    var noop = function noop() {};

    var defaultMediaGroups = {
      'AUDIO': {},
      'VIDEO': {},
      'CLOSED-CAPTIONS': {},
      'SUBTITLES': {}
    }; // This is the Widevine UUID from DASH IF IOP. The same exact string is
    // used in MPDs with Widevine encrypted streams.

    var widevineUuid = 'urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed'; // group segments into numbered timelines delineated by discontinuities

    var currentTimeline = 0; // the manifest is empty until the parse stream begins delivering data

    _this.manifest = {
      allowCache: true,
      discontinuityStarts: [],
      segments: []
    }; // keep track of the last seen segment's byte range end, as segments are not required
    // to provide the offset, in which case it defaults to the next byte after the
    // previous segment

    var lastByterangeEnd = 0; // keep track of the last seen part's byte range end.

    var lastPartByterangeEnd = 0;

    _this.on('end', function () {
      // only add preloadSegment if we don't yet have a uri for it.
      // and we actually have parts/preloadHints
      if (currentUri.uri || !currentUri.parts && !currentUri.preloadHints) {
        return;
      }

      if (!currentUri.map && currentMap) {
        currentUri.map = currentMap;
      }

      if (!currentUri.key && _key) {
        currentUri.key = _key;
      }

      if (!currentUri.timeline && typeof currentTimeline === 'number') {
        currentUri.timeline = currentTimeline;
      }

      _this.manifest.preloadSegment = currentUri;
    }); // update the manifest with the m3u8 entry from the parse stream


    _this.parseStream.on('data', function (entry) {
      var mediaGroup;
      var rendition;
      ({
        tag: function tag() {
          // switch based on the tag type
          (({
            version: function version() {
              if (entry.version) {
                this.manifest.version = entry.version;
              }
            },
            'allow-cache': function allowCache() {
              this.manifest.allowCache = entry.allowed;

              if (!('allowed' in entry)) {
                this.trigger('info', {
                  message: 'defaulting allowCache to YES'
                });
                this.manifest.allowCache = true;
              }
            },
            byterange: function byterange() {
              var byterange = {};

              if ('length' in entry) {
                currentUri.byterange = byterange;
                byterange.length = entry.length;

                if (!('offset' in entry)) {
                  /*
                   * From the latest spec (as of this writing):
                   * https://tools.ietf.org/html/draft-pantos-http-live-streaming-23#section-4.3.2.2
                   *
                   * Same text since EXT-X-BYTERANGE's introduction in draft 7:
                   * https://tools.ietf.org/html/draft-pantos-http-live-streaming-07#section-3.3.1)
                   *
                   * "If o [offset] is not present, the sub-range begins at the next byte
                   * following the sub-range of the previous media segment."
                   */
                  entry.offset = lastByterangeEnd;
                }
              }

              if ('offset' in entry) {
                currentUri.byterange = byterange;
                byterange.offset = entry.offset;
              }

              lastByterangeEnd = byterange.offset + byterange.length;
            },
            endlist: function endlist() {
              this.manifest.endList = true;
            },
            inf: function inf() {
              if (!('mediaSequence' in this.manifest)) {
                this.manifest.mediaSequence = 0;
                this.trigger('info', {
                  message: 'defaulting media sequence to zero'
                });
              }

              if (!('discontinuitySequence' in this.manifest)) {
                this.manifest.discontinuitySequence = 0;
                this.trigger('info', {
                  message: 'defaulting discontinuity sequence to zero'
                });
              }

              if (entry.duration > 0) {
                currentUri.duration = entry.duration;
              }

              if (entry.duration === 0) {
                currentUri.duration = 0.01;
                this.trigger('info', {
                  message: 'updating zero segment duration to a small value'
                });
              }

              this.manifest.segments = uris;
            },
            key: function key() {
              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without attribute list'
                });
                return;
              } // clear the active encryption key


              if (entry.attributes.METHOD === 'NONE') {
                _key = null;
                return;
              }

              if (!entry.attributes.URI) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without URI'
                });
                return;
              }

              if (entry.attributes.KEYFORMAT === 'com.apple.streamingkeydelivery') {
                this.manifest.contentProtection = this.manifest.contentProtection || {}; // TODO: add full support for this.

                this.manifest.contentProtection['com.apple.fps.1_0'] = {
                  attributes: entry.attributes
                };
                return;
              } // check if the content is encrypted for Widevine
              // Widevine/HLS spec: https://storage.googleapis.com/wvdocs/Widevine_DRM_HLS.pdf


              if (entry.attributes.KEYFORMAT === widevineUuid) {
                var VALID_METHODS = ['SAMPLE-AES', 'SAMPLE-AES-CTR', 'SAMPLE-AES-CENC'];

                if (VALID_METHODS.indexOf(entry.attributes.METHOD) === -1) {
                  this.trigger('warn', {
                    message: 'invalid key method provided for Widevine'
                  });
                  return;
                }

                if (entry.attributes.METHOD === 'SAMPLE-AES-CENC') {
                  this.trigger('warn', {
                    message: 'SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead'
                  });
                }

                if (entry.attributes.URI.substring(0, 23) !== 'data:text/plain;base64,') {
                  this.trigger('warn', {
                    message: 'invalid key URI provided for Widevine'
                  });
                  return;
                }

                if (!(entry.attributes.KEYID && entry.attributes.KEYID.substring(0, 2) === '0x')) {
                  this.trigger('warn', {
                    message: 'invalid key ID provided for Widevine'
                  });
                  return;
                } // if Widevine key attributes are valid, store them as `contentProtection`
                // on the manifest to emulate Widevine tag structure in a DASH mpd


                this.manifest.contentProtection = this.manifest.contentProtection || {};
                this.manifest.contentProtection['com.widevine.alpha'] = {
                  attributes: {
                    schemeIdUri: entry.attributes.KEYFORMAT,
                    // remove '0x' from the key id string
                    keyId: entry.attributes.KEYID.substring(2)
                  },
                  // decode the base64-encoded PSSH box
                  pssh: (0,decode_b64_to_uint8_array/* default */.Z)(entry.attributes.URI.split(',')[1])
                };
                return;
              }

              if (!entry.attributes.METHOD) {
                this.trigger('warn', {
                  message: 'defaulting key method to AES-128'
                });
              } // setup an encryption key for upcoming segments


              _key = {
                method: entry.attributes.METHOD || 'AES-128',
                uri: entry.attributes.URI
              };

              if (typeof entry.attributes.IV !== 'undefined') {
                _key.iv = entry.attributes.IV;
              }
            },
            'media-sequence': function mediaSequence() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid media sequence: ' + entry.number
                });
                return;
              }

              this.manifest.mediaSequence = entry.number;
            },
            'discontinuity-sequence': function discontinuitySequence() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid discontinuity sequence: ' + entry.number
                });
                return;
              }

              this.manifest.discontinuitySequence = entry.number;
              currentTimeline = entry.number;
            },
            'playlist-type': function playlistType() {
              if (!/VOD|EVENT/.test(entry.playlistType)) {
                this.trigger('warn', {
                  message: 'ignoring unknown playlist type: ' + entry.playlist
                });
                return;
              }

              this.manifest.playlistType = entry.playlistType;
            },
            map: function map() {
              currentMap = {};

              if (entry.uri) {
                currentMap.uri = entry.uri;
              }

              if (entry.byterange) {
                currentMap.byterange = entry.byterange;
              }

              if (_key) {
                currentMap.key = _key;
              }
            },
            'stream-inf': function streamInf() {
              this.manifest.playlists = uris;
              this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups;

              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring empty stream-inf attributes'
                });
                return;
              }

              if (!currentUri.attributes) {
                currentUri.attributes = {};
              }

              (0,esm_extends/* default */.Z)(currentUri.attributes, entry.attributes);
            },
            media: function media() {
              this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups;

              if (!(entry.attributes && entry.attributes.TYPE && entry.attributes['GROUP-ID'] && entry.attributes.NAME)) {
                this.trigger('warn', {
                  message: 'ignoring incomplete or missing media group'
                });
                return;
              } // find the media group, creating defaults as necessary


              var mediaGroupType = this.manifest.mediaGroups[entry.attributes.TYPE];
              mediaGroupType[entry.attributes['GROUP-ID']] = mediaGroupType[entry.attributes['GROUP-ID']] || {};
              mediaGroup = mediaGroupType[entry.attributes['GROUP-ID']]; // collect the rendition metadata

              rendition = {
                default: /yes/i.test(entry.attributes.DEFAULT)
              };

              if (rendition.default) {
                rendition.autoselect = true;
              } else {
                rendition.autoselect = /yes/i.test(entry.attributes.AUTOSELECT);
              }

              if (entry.attributes.LANGUAGE) {
                rendition.language = entry.attributes.LANGUAGE;
              }

              if (entry.attributes.URI) {
                rendition.uri = entry.attributes.URI;
              }

              if (entry.attributes['INSTREAM-ID']) {
                rendition.instreamId = entry.attributes['INSTREAM-ID'];
              }

              if (entry.attributes.CHARACTERISTICS) {
                rendition.characteristics = entry.attributes.CHARACTERISTICS;
              }

              if (entry.attributes.FORCED) {
                rendition.forced = /yes/i.test(entry.attributes.FORCED);
              } // insert the new rendition


              mediaGroup[entry.attributes.NAME] = rendition;
            },
            discontinuity: function discontinuity() {
              currentTimeline += 1;
              currentUri.discontinuity = true;
              this.manifest.discontinuityStarts.push(uris.length);
            },
            'program-date-time': function programDateTime() {
              if (typeof this.manifest.dateTimeString === 'undefined') {
                // PROGRAM-DATE-TIME is a media-segment tag, but for backwards
                // compatibility, we add the first occurence of the PROGRAM-DATE-TIME tag
                // to the manifest object
                // TODO: Consider removing this in future major version
                this.manifest.dateTimeString = entry.dateTimeString;
                this.manifest.dateTimeObject = entry.dateTimeObject;
              }

              currentUri.dateTimeString = entry.dateTimeString;
              currentUri.dateTimeObject = entry.dateTimeObject;
            },
            targetduration: function targetduration() {
              if (!isFinite(entry.duration) || entry.duration < 0) {
                this.trigger('warn', {
                  message: 'ignoring invalid target duration: ' + entry.duration
                });
                return;
              }

              this.manifest.targetDuration = entry.duration;
              setHoldBack.call(this, this.manifest);
            },
            start: function start() {
              if (!entry.attributes || isNaN(entry.attributes['TIME-OFFSET'])) {
                this.trigger('warn', {
                  message: 'ignoring start declaration without appropriate attribute list'
                });
                return;
              }

              this.manifest.start = {
                timeOffset: entry.attributes['TIME-OFFSET'],
                precise: entry.attributes.PRECISE
              };
            },
            'cue-out': function cueOut() {
              currentUri.cueOut = entry.data;
            },
            'cue-out-cont': function cueOutCont() {
              currentUri.cueOutCont = entry.data;
            },
            'cue-in': function cueIn() {
              currentUri.cueIn = entry.data;
            },
            'skip': function skip() {
              this.manifest.skip = camelCaseKeys(entry.attributes);
              this.warnOnMissingAttributes_('#EXT-X-SKIP', entry.attributes, ['SKIPPED-SEGMENTS']);
            },
            'part': function part() {
              var _this2 = this;

              hasParts = true; // parts are always specifed before a segment

              var segmentIndex = this.manifest.segments.length;
              var part = camelCaseKeys(entry.attributes);
              currentUri.parts = currentUri.parts || [];
              currentUri.parts.push(part);

              if (part.byterange) {
                if (!part.byterange.hasOwnProperty('offset')) {
                  part.byterange.offset = lastPartByterangeEnd;
                }

                lastPartByterangeEnd = part.byterange.offset + part.byterange.length;
              }

              var partIndex = currentUri.parts.length - 1;
              this.warnOnMissingAttributes_("#EXT-X-PART #" + partIndex + " for segment #" + segmentIndex, entry.attributes, ['URI', 'DURATION']);

              if (this.manifest.renditionReports) {
                this.manifest.renditionReports.forEach(function (r, i) {
                  if (!r.hasOwnProperty('lastPart')) {
                    _this2.trigger('warn', {
                      message: "#EXT-X-RENDITION-REPORT #" + i + " lacks required attribute(s): LAST-PART"
                    });
                  }
                });
              }
            },
            'server-control': function serverControl() {
              var attrs = this.manifest.serverControl = camelCaseKeys(entry.attributes);

              if (!attrs.hasOwnProperty('canBlockReload')) {
                attrs.canBlockReload = false;
                this.trigger('info', {
                  message: '#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false'
                });
              }

              setHoldBack.call(this, this.manifest);

              if (attrs.canSkipDateranges && !attrs.hasOwnProperty('canSkipUntil')) {
                this.trigger('warn', {
                  message: '#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set'
                });
              }
            },
            'preload-hint': function preloadHint() {
              // parts are always specifed before a segment
              var segmentIndex = this.manifest.segments.length;
              var hint = camelCaseKeys(entry.attributes);
              var isPart = hint.type && hint.type === 'PART';
              currentUri.preloadHints = currentUri.preloadHints || [];
              currentUri.preloadHints.push(hint);

              if (hint.byterange) {
                if (!hint.byterange.hasOwnProperty('offset')) {
                  // use last part byterange end or zero if not a part.
                  hint.byterange.offset = isPart ? lastPartByterangeEnd : 0;

                  if (isPart) {
                    lastPartByterangeEnd = hint.byterange.offset + hint.byterange.length;
                  }
                }
              }

              var index = currentUri.preloadHints.length - 1;
              this.warnOnMissingAttributes_("#EXT-X-PRELOAD-HINT #" + index + " for segment #" + segmentIndex, entry.attributes, ['TYPE', 'URI']);

              if (!hint.type) {
                return;
              } // search through all preload hints except for the current one for
              // a duplicate type.


              for (var i = 0; i < currentUri.preloadHints.length - 1; i++) {
                var otherHint = currentUri.preloadHints[i];

                if (!otherHint.type) {
                  continue;
                }

                if (otherHint.type === hint.type) {
                  this.trigger('warn', {
                    message: "#EXT-X-PRELOAD-HINT #" + index + " for segment #" + segmentIndex + " has the same TYPE " + hint.type + " as preload hint #" + i
                  });
                }
              }
            },
            'rendition-report': function renditionReport() {
              var report = camelCaseKeys(entry.attributes);
              this.manifest.renditionReports = this.manifest.renditionReports || [];
              this.manifest.renditionReports.push(report);
              var index = this.manifest.renditionReports.length - 1;
              var required = ['LAST-MSN', 'URI'];

              if (hasParts) {
                required.push('LAST-PART');
              }

              this.warnOnMissingAttributes_("#EXT-X-RENDITION-REPORT #" + index, entry.attributes, required);
            },
            'part-inf': function partInf() {
              this.manifest.partInf = camelCaseKeys(entry.attributes);
              this.warnOnMissingAttributes_('#EXT-X-PART-INF', entry.attributes, ['PART-TARGET']);

              if (this.manifest.partInf.partTarget) {
                this.manifest.partTargetDuration = this.manifest.partInf.partTarget;
              }

              setHoldBack.call(this, this.manifest);
            }
          })[entry.tagType] || noop).call(self);
        },
        uri: function uri() {
          currentUri.uri = entry.uri;
          uris.push(currentUri); // if no explicit duration was declared, use the target duration

          if (this.manifest.targetDuration && !('duration' in currentUri)) {
            this.trigger('warn', {
              message: 'defaulting segment duration to the target duration'
            });
            currentUri.duration = this.manifest.targetDuration;
          } // annotate with encryption information, if necessary


          if (_key) {
            currentUri.key = _key;
          }

          currentUri.timeline = currentTimeline; // annotate with initialization segment information, if necessary

          if (currentMap) {
            currentUri.map = currentMap;
          } // reset the last byterange end as it needs to be 0 between parts


          lastPartByterangeEnd = 0; // prepare for the next URI

          currentUri = {};
        },
        comment: function comment() {// comments are not important for playback
        },
        custom: function custom() {
          // if this is segment-level data attach the output to the segment
          if (entry.segment) {
            currentUri.custom = currentUri.custom || {};
            currentUri.custom[entry.customType] = entry.data; // if this is manifest-level data attach to the top level manifest object
          } else {
            this.manifest.custom = this.manifest.custom || {};
            this.manifest.custom[entry.customType] = entry.data;
          }
        }
      })[entry.type].call(self);
    });

    return _this;
  }

  var _proto = Parser.prototype;

  _proto.warnOnMissingAttributes_ = function warnOnMissingAttributes_(identifier, attributes, required) {
    var missing = [];
    required.forEach(function (key) {
      if (!attributes.hasOwnProperty(key)) {
        missing.push(key);
      }
    });

    if (missing.length) {
      this.trigger('warn', {
        message: identifier + " lacks required attribute(s): " + missing.join(', ')
      });
    }
  }
  /**
   * Parse the input string and update the manifest object.
   *
   * @param {string} chunk a potentially incomplete portion of the manifest
   */
  ;

  _proto.push = function push(chunk) {
    this.lineStream.push(chunk);
  }
  /**
   * Flush any remaining input. This can be handy if the last line of an M3U8
   * manifest did not contain a trailing newline but the file has been
   * completely received.
   */
  ;

  _proto.end = function end() {
    // flush any buffered input
    this.lineStream.push('\n');
    this.trigger('end');
  }
  /**
   * Add an additional parser for non-standard tags
   *
   * @param {Object}   options              a map of options for the added parser
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {string}   options.type         the type to register to the output
   * @param {Function} [options.dataParser] function to parse the line into an object
   * @param {boolean}  [options.segment]    should tag data be attached to the segment object
   */
  ;

  _proto.addParser = function addParser(options) {
    this.parseStream.addParser(options);
  }
  /**
   * Add a custom header mapper
   *
   * @param {Object}   options
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {Function} options.map          function to translate tag into a different tag
   */
  ;

  _proto.addTagMapper = function addTagMapper(options) {
    this.parseStream.addTagMapper(options);
  };

  return Parser;
}(Stream);




/***/ }),

/***/ 973:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "jp": function() { return /* binding */ addSidxSegmentsToPlaylist; },
/* harmony export */   "mm": function() { return /* binding */ generateSidxKey; },
/* harmony export */   "Qc": function() { return /* binding */ parse; },
/* harmony export */   "LG": function() { return /* binding */ parseUTCTiming; }
/* harmony export */ });
/* unused harmony exports VERSION, inheritAttributes, stringToMpdXml, toM3u8, toPlaylists */
/* harmony import */ var _videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(779);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8908);
/* harmony import */ var global_window__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(global_window__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _videojs_vhs_utils_es_decode_b64_to_uint8_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6722);
/* harmony import */ var _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3969);
/*! @name mpd-parser @version 0.19.2 @license Apache-2.0 */





var version = "0.19.2";

var isObject = function isObject(obj) {
  return !!obj && typeof obj === 'object';
};

var merge = function merge() {
  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  return objects.reduce(function (result, source) {
    if (typeof source !== 'object') {
      return result;
    }

    Object.keys(source).forEach(function (key) {
      if (Array.isArray(result[key]) && Array.isArray(source[key])) {
        result[key] = result[key].concat(source[key]);
      } else if (isObject(result[key]) && isObject(source[key])) {
        result[key] = merge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    });
    return result;
  }, {});
};
var values = function values(o) {
  return Object.keys(o).map(function (k) {
    return o[k];
  });
};

var range = function range(start, end) {
  var result = [];

  for (var i = start; i < end; i++) {
    result.push(i);
  }

  return result;
};
var flatten = function flatten(lists) {
  return lists.reduce(function (x, y) {
    return x.concat(y);
  }, []);
};
var from = function from(list) {
  if (!list.length) {
    return [];
  }

  var result = [];

  for (var i = 0; i < list.length; i++) {
    result.push(list[i]);
  }

  return result;
};
var findIndexes = function findIndexes(l, key) {
  return l.reduce(function (a, e, i) {
    if (e[key]) {
      a.push(i);
    }

    return a;
  }, []);
};

var errors = {
  INVALID_NUMBER_OF_PERIOD: 'INVALID_NUMBER_OF_PERIOD',
  DASH_EMPTY_MANIFEST: 'DASH_EMPTY_MANIFEST',
  DASH_INVALID_XML: 'DASH_INVALID_XML',
  NO_BASE_URL: 'NO_BASE_URL',
  MISSING_SEGMENT_INFORMATION: 'MISSING_SEGMENT_INFORMATION',
  SEGMENT_TIME_UNSPECIFIED: 'SEGMENT_TIME_UNSPECIFIED',
  UNSUPPORTED_UTC_TIMING_SCHEME: 'UNSUPPORTED_UTC_TIMING_SCHEME'
};

/**
 * @typedef {Object} SingleUri
 * @property {string} uri - relative location of segment
 * @property {string} resolvedUri - resolved location of segment
 * @property {Object} byterange - Object containing information on how to make byte range
 *   requests following byte-range-spec per RFC2616.
 * @property {String} byterange.length - length of range request
 * @property {String} byterange.offset - byte offset of range request
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35.1
 */

/**
 * Converts a URLType node (5.3.9.2.3 Table 13) to a segment object
 * that conforms to how m3u8-parser is structured
 *
 * @see https://github.com/videojs/m3u8-parser
 *
 * @param {string} baseUrl - baseUrl provided by <BaseUrl> nodes
 * @param {string} source - source url for segment
 * @param {string} range - optional range used for range calls,
 *   follows  RFC 2616, Clause 14.35.1
 * @return {SingleUri} full segment information transformed into a format similar
 *   to m3u8-parser
 */

var urlTypeToSegment = function urlTypeToSegment(_ref) {
  var _ref$baseUrl = _ref.baseUrl,
      baseUrl = _ref$baseUrl === void 0 ? '' : _ref$baseUrl,
      _ref$source = _ref.source,
      source = _ref$source === void 0 ? '' : _ref$source,
      _ref$range = _ref.range,
      range = _ref$range === void 0 ? '' : _ref$range,
      _ref$indexRange = _ref.indexRange,
      indexRange = _ref$indexRange === void 0 ? '' : _ref$indexRange;
  var segment = {
    uri: source,
    resolvedUri: (0,_videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(baseUrl || '', source)
  };

  if (range || indexRange) {
    var rangeStr = range ? range : indexRange;
    var ranges = rangeStr.split('-');
    var startRange = parseInt(ranges[0], 10);
    var endRange = parseInt(ranges[1], 10); // byterange should be inclusive according to
    // RFC 2616, Clause 14.35.1

    segment.byterange = {
      length: endRange - startRange + 1,
      offset: startRange
    };
  }

  return segment;
};
var byteRangeToString = function byteRangeToString(byterange) {
  // `endRange` is one less than `offset + length` because the HTTP range
  // header uses inclusive ranges
  var endRange = byterange.offset + byterange.length - 1;
  return byterange.offset + "-" + endRange;
};

/**
 * parse the end number attribue that can be a string
 * number, or undefined.
 *
 * @param {string|number|undefined} endNumber
 *        The end number attribute.
 *
 * @return {number|null}
 *          The result of parsing the end number.
 */

var parseEndNumber = function parseEndNumber(endNumber) {
  if (endNumber && typeof endNumber !== 'number') {
    endNumber = parseInt(endNumber, 10);
  }

  if (isNaN(endNumber)) {
    return null;
  }

  return endNumber;
};
/**
 * Functions for calculating the range of available segments in static and dynamic
 * manifests.
 */


var segmentRange = {
  /**
   * Returns the entire range of available segments for a static MPD
   *
   * @param {Object} attributes
   *        Inheritied MPD attributes
   * @return {{ start: number, end: number }}
   *         The start and end numbers for available segments
   */
  static: function _static(attributes) {
    var duration = attributes.duration,
        _attributes$timescale = attributes.timescale,
        timescale = _attributes$timescale === void 0 ? 1 : _attributes$timescale,
        sourceDuration = attributes.sourceDuration,
        periodDuration = attributes.periodDuration;
    var endNumber = parseEndNumber(attributes.endNumber);
    var segmentDuration = duration / timescale;

    if (typeof endNumber === 'number') {
      return {
        start: 0,
        end: endNumber
      };
    }

    if (typeof periodDuration === 'number') {
      return {
        start: 0,
        end: periodDuration / segmentDuration
      };
    }

    return {
      start: 0,
      end: sourceDuration / segmentDuration
    };
  },

  /**
   * Returns the current live window range of available segments for a dynamic MPD
   *
   * @param {Object} attributes
   *        Inheritied MPD attributes
   * @return {{ start: number, end: number }}
   *         The start and end numbers for available segments
   */
  dynamic: function dynamic(attributes) {
    var NOW = attributes.NOW,
        clientOffset = attributes.clientOffset,
        availabilityStartTime = attributes.availabilityStartTime,
        _attributes$timescale2 = attributes.timescale,
        timescale = _attributes$timescale2 === void 0 ? 1 : _attributes$timescale2,
        duration = attributes.duration,
        _attributes$start = attributes.start,
        start = _attributes$start === void 0 ? 0 : _attributes$start,
        _attributes$minimumUp = attributes.minimumUpdatePeriod,
        minimumUpdatePeriod = _attributes$minimumUp === void 0 ? 0 : _attributes$minimumUp,
        _attributes$timeShift = attributes.timeShiftBufferDepth,
        timeShiftBufferDepth = _attributes$timeShift === void 0 ? Infinity : _attributes$timeShift;
    var endNumber = parseEndNumber(attributes.endNumber);
    var now = (NOW + clientOffset) / 1000;
    var periodStartWC = availabilityStartTime + start;
    var periodEndWC = now + minimumUpdatePeriod;
    var periodDuration = periodEndWC - periodStartWC;
    var segmentCount = Math.ceil(periodDuration * timescale / duration);
    var availableStart = Math.floor((now - periodStartWC - timeShiftBufferDepth) * timescale / duration);
    var availableEnd = Math.floor((now - periodStartWC) * timescale / duration);
    return {
      start: Math.max(0, availableStart),
      end: typeof endNumber === 'number' ? endNumber : Math.min(segmentCount, availableEnd)
    };
  }
};
/**
 * Maps a range of numbers to objects with information needed to build the corresponding
 * segment list
 *
 * @name toSegmentsCallback
 * @function
 * @param {number} number
 *        Number of the segment
 * @param {number} index
 *        Index of the number in the range list
 * @return {{ number: Number, duration: Number, timeline: Number, time: Number }}
 *         Object with segment timing and duration info
 */

/**
 * Returns a callback for Array.prototype.map for mapping a range of numbers to
 * information needed to build the segment list.
 *
 * @param {Object} attributes
 *        Inherited MPD attributes
 * @return {toSegmentsCallback}
 *         Callback map function
 */

var toSegments = function toSegments(attributes) {
  return function (number, index) {
    var duration = attributes.duration,
        _attributes$timescale3 = attributes.timescale,
        timescale = _attributes$timescale3 === void 0 ? 1 : _attributes$timescale3,
        periodIndex = attributes.periodIndex,
        _attributes$startNumb = attributes.startNumber,
        startNumber = _attributes$startNumb === void 0 ? 1 : _attributes$startNumb;
    return {
      number: startNumber + number,
      duration: duration / timescale,
      timeline: periodIndex,
      time: index * duration
    };
  };
};
/**
 * Returns a list of objects containing segment timing and duration info used for
 * building the list of segments. This uses the @duration attribute specified
 * in the MPD manifest to derive the range of segments.
 *
 * @param {Object} attributes
 *        Inherited MPD attributes
 * @return {{number: number, duration: number, time: number, timeline: number}[]}
 *         List of Objects with segment timing and duration info
 */

var parseByDuration = function parseByDuration(attributes) {
  var type = attributes.type,
      duration = attributes.duration,
      _attributes$timescale4 = attributes.timescale,
      timescale = _attributes$timescale4 === void 0 ? 1 : _attributes$timescale4,
      periodDuration = attributes.periodDuration,
      sourceDuration = attributes.sourceDuration;

  var _segmentRange$type = segmentRange[type](attributes),
      start = _segmentRange$type.start,
      end = _segmentRange$type.end;

  var segments = range(start, end).map(toSegments(attributes));

  if (type === 'static') {
    var index = segments.length - 1; // section is either a period or the full source

    var sectionDuration = typeof periodDuration === 'number' ? periodDuration : sourceDuration; // final segment may be less than full segment duration

    segments[index].duration = sectionDuration - duration / timescale * index;
  }

  return segments;
};

/**
 * Translates SegmentBase into a set of segments.
 * (DASH SPEC Section 5.3.9.3.2) contains a set of <SegmentURL> nodes.  Each
 * node should be translated into segment.
 *
 * @param {Object} attributes
 *   Object containing all inherited attributes from parent elements with attribute
 *   names as keys
 * @return {Object.<Array>} list of segments
 */

var segmentsFromBase = function segmentsFromBase(attributes) {
  var baseUrl = attributes.baseUrl,
      _attributes$initializ = attributes.initialization,
      initialization = _attributes$initializ === void 0 ? {} : _attributes$initializ,
      sourceDuration = attributes.sourceDuration,
      _attributes$indexRang = attributes.indexRange,
      indexRange = _attributes$indexRang === void 0 ? '' : _attributes$indexRang,
      duration = attributes.duration; // base url is required for SegmentBase to work, per spec (Section 5.3.9.2.1)

  if (!baseUrl) {
    throw new Error(errors.NO_BASE_URL);
  }

  var initSegment = urlTypeToSegment({
    baseUrl: baseUrl,
    source: initialization.sourceURL,
    range: initialization.range
  });
  var segment = urlTypeToSegment({
    baseUrl: baseUrl,
    source: baseUrl,
    indexRange: indexRange
  });
  segment.map = initSegment; // If there is a duration, use it, otherwise use the given duration of the source
  // (since SegmentBase is only for one total segment)

  if (duration) {
    var segmentTimeInfo = parseByDuration(attributes);

    if (segmentTimeInfo.length) {
      segment.duration = segmentTimeInfo[0].duration;
      segment.timeline = segmentTimeInfo[0].timeline;
    }
  } else if (sourceDuration) {
    segment.duration = sourceDuration;
    segment.timeline = 0;
  } // This is used for mediaSequence


  segment.number = 0;
  return [segment];
};
/**
 * Given a playlist, a sidx box, and a baseUrl, update the segment list of the playlist
 * according to the sidx information given.
 *
 * playlist.sidx has metadadata about the sidx where-as the sidx param
 * is the parsed sidx box itself.
 *
 * @param {Object} playlist the playlist to update the sidx information for
 * @param {Object} sidx the parsed sidx box
 * @return {Object} the playlist object with the updated sidx information
 */

var addSidxSegmentsToPlaylist = function addSidxSegmentsToPlaylist(playlist, sidx, baseUrl) {
  // Retain init segment information
  var initSegment = playlist.sidx.map ? playlist.sidx.map : null; // Retain source duration from initial main manifest parsing

  var sourceDuration = playlist.sidx.duration; // Retain source timeline

  var timeline = playlist.timeline || 0;
  var sidxByteRange = playlist.sidx.byterange;
  var sidxEnd = sidxByteRange.offset + sidxByteRange.length; // Retain timescale of the parsed sidx

  var timescale = sidx.timescale; // referenceType 1 refers to other sidx boxes

  var mediaReferences = sidx.references.filter(function (r) {
    return r.referenceType !== 1;
  });
  var segments = [];
  var type = playlist.endList ? 'static' : 'dynamic'; // firstOffset is the offset from the end of the sidx box

  var startIndex = sidxEnd + sidx.firstOffset;

  for (var i = 0; i < mediaReferences.length; i++) {
    var reference = sidx.references[i]; // size of the referenced (sub)segment

    var size = reference.referencedSize; // duration of the referenced (sub)segment, in  the  timescale
    // this will be converted to seconds when generating segments

    var duration = reference.subsegmentDuration; // should be an inclusive range

    var endIndex = startIndex + size - 1;
    var indexRange = startIndex + "-" + endIndex;
    var attributes = {
      baseUrl: baseUrl,
      timescale: timescale,
      timeline: timeline,
      // this is used in parseByDuration
      periodIndex: timeline,
      duration: duration,
      sourceDuration: sourceDuration,
      indexRange: indexRange,
      type: type
    };
    var segment = segmentsFromBase(attributes)[0];

    if (initSegment) {
      segment.map = initSegment;
    }

    segments.push(segment);
    startIndex += size;
  }

  playlist.segments = segments;
  return playlist;
};

var generateSidxKey = function generateSidxKey(sidx) {
  return sidx && sidx.uri + '-' + byteRangeToString(sidx.byterange);
};

var mergeDiscontiguousPlaylists = function mergeDiscontiguousPlaylists(playlists) {
  var mergedPlaylists = values(playlists.reduce(function (acc, playlist) {
    // assuming playlist IDs are the same across periods
    // TODO: handle multiperiod where representation sets are not the same
    // across periods
    var name = playlist.attributes.id + (playlist.attributes.lang || ''); // Periods after first

    if (acc[name]) {
      var _acc$name$segments;

      // first segment of subsequent periods signal a discontinuity
      if (playlist.segments[0]) {
        playlist.segments[0].discontinuity = true;
      }

      (_acc$name$segments = acc[name].segments).push.apply(_acc$name$segments, playlist.segments); // bubble up contentProtection, this assumes all DRM content
      // has the same contentProtection


      if (playlist.attributes.contentProtection) {
        acc[name].attributes.contentProtection = playlist.attributes.contentProtection;
      }
    } else {
      // first Period
      acc[name] = playlist;
    }

    return acc;
  }, {}));
  return mergedPlaylists.map(function (playlist) {
    playlist.discontinuityStarts = findIndexes(playlist.segments, 'discontinuity');
    return playlist;
  });
};

var addSidxSegmentsToPlaylist$1 = function addSidxSegmentsToPlaylist$1(playlist, sidxMapping) {
  var sidxKey = generateSidxKey(playlist.sidx);
  var sidxMatch = sidxKey && sidxMapping[sidxKey] && sidxMapping[sidxKey].sidx;

  if (sidxMatch) {
    addSidxSegmentsToPlaylist(playlist, sidxMatch, playlist.sidx.resolvedUri);
  }

  return playlist;
};
var addSidxSegmentsToPlaylists = function addSidxSegmentsToPlaylists(playlists, sidxMapping) {
  if (sidxMapping === void 0) {
    sidxMapping = {};
  }

  if (!Object.keys(sidxMapping).length) {
    return playlists;
  }

  for (var i in playlists) {
    playlists[i] = addSidxSegmentsToPlaylist$1(playlists[i], sidxMapping);
  }

  return playlists;
};
var formatAudioPlaylist = function formatAudioPlaylist(_ref, isAudioOnly) {
  var _attributes;

  var attributes = _ref.attributes,
      segments = _ref.segments,
      sidx = _ref.sidx;
  var playlist = {
    attributes: (_attributes = {
      NAME: attributes.id,
      BANDWIDTH: attributes.bandwidth,
      CODECS: attributes.codecs
    }, _attributes['PROGRAM-ID'] = 1, _attributes),
    uri: '',
    endList: attributes.type === 'static',
    timeline: attributes.periodIndex,
    resolvedUri: '',
    targetDuration: attributes.duration,
    segments: segments,
    mediaSequence: segments.length ? segments[0].number : 1
  };

  if (attributes.contentProtection) {
    playlist.contentProtection = attributes.contentProtection;
  }

  if (sidx) {
    playlist.sidx = sidx;
  }

  if (isAudioOnly) {
    playlist.attributes.AUDIO = 'audio';
    playlist.attributes.SUBTITLES = 'subs';
  }

  return playlist;
};
var formatVttPlaylist = function formatVttPlaylist(_ref2) {
  var _m3u8Attributes;

  var attributes = _ref2.attributes,
      segments = _ref2.segments;

  if (typeof segments === 'undefined') {
    // vtt tracks may use single file in BaseURL
    segments = [{
      uri: attributes.baseUrl,
      timeline: attributes.periodIndex,
      resolvedUri: attributes.baseUrl || '',
      duration: attributes.sourceDuration,
      number: 0
    }]; // targetDuration should be the same duration as the only segment

    attributes.duration = attributes.sourceDuration;
  }

  var m3u8Attributes = (_m3u8Attributes = {
    NAME: attributes.id,
    BANDWIDTH: attributes.bandwidth
  }, _m3u8Attributes['PROGRAM-ID'] = 1, _m3u8Attributes);

  if (attributes.codecs) {
    m3u8Attributes.CODECS = attributes.codecs;
  }

  return {
    attributes: m3u8Attributes,
    uri: '',
    endList: attributes.type === 'static',
    timeline: attributes.periodIndex,
    resolvedUri: attributes.baseUrl || '',
    targetDuration: attributes.duration,
    segments: segments,
    mediaSequence: segments.length ? segments[0].number : 1
  };
};
var organizeAudioPlaylists = function organizeAudioPlaylists(playlists, sidxMapping, isAudioOnly) {
  if (sidxMapping === void 0) {
    sidxMapping = {};
  }

  if (isAudioOnly === void 0) {
    isAudioOnly = false;
  }

  var mainPlaylist;
  var formattedPlaylists = playlists.reduce(function (a, playlist) {
    var role = playlist.attributes.role && playlist.attributes.role.value || '';
    var language = playlist.attributes.lang || '';
    var label = playlist.attributes.label || 'main';

    if (language && !playlist.attributes.label) {
      var roleLabel = role ? " (" + role + ")" : '';
      label = "" + playlist.attributes.lang + roleLabel;
    }

    if (!a[label]) {
      a[label] = {
        language: language,
        autoselect: true,
        default: role === 'main',
        playlists: [],
        uri: ''
      };
    }

    var formatted = addSidxSegmentsToPlaylist$1(formatAudioPlaylist(playlist, isAudioOnly), sidxMapping);
    a[label].playlists.push(formatted);

    if (typeof mainPlaylist === 'undefined' && role === 'main') {
      mainPlaylist = playlist;
      mainPlaylist.default = true;
    }

    return a;
  }, {}); // if no playlists have role "main", mark the first as main

  if (!mainPlaylist) {
    var firstLabel = Object.keys(formattedPlaylists)[0];
    formattedPlaylists[firstLabel].default = true;
  }

  return formattedPlaylists;
};
var organizeVttPlaylists = function organizeVttPlaylists(playlists, sidxMapping) {
  if (sidxMapping === void 0) {
    sidxMapping = {};
  }

  return playlists.reduce(function (a, playlist) {
    var label = playlist.attributes.lang || 'text';

    if (!a[label]) {
      a[label] = {
        language: label,
        default: false,
        autoselect: false,
        playlists: [],
        uri: ''
      };
    }

    a[label].playlists.push(addSidxSegmentsToPlaylist$1(formatVttPlaylist(playlist), sidxMapping));
    return a;
  }, {});
};

var organizeCaptionServices = function organizeCaptionServices(captionServices) {
  return captionServices.reduce(function (svcObj, svc) {
    if (!svc) {
      return svcObj;
    }

    svc.forEach(function (service) {
      var channel = service.channel,
          language = service.language;
      svcObj[language] = {
        autoselect: false,
        default: false,
        instreamId: channel,
        language: language
      };

      if (service.hasOwnProperty('aspectRatio')) {
        svcObj[language].aspectRatio = service.aspectRatio;
      }

      if (service.hasOwnProperty('easyReader')) {
        svcObj[language].easyReader = service.easyReader;
      }

      if (service.hasOwnProperty('3D')) {
        svcObj[language]['3D'] = service['3D'];
      }
    });
    return svcObj;
  }, {});
};

var formatVideoPlaylist = function formatVideoPlaylist(_ref3) {
  var _attributes2;

  var attributes = _ref3.attributes,
      segments = _ref3.segments,
      sidx = _ref3.sidx;
  var playlist = {
    attributes: (_attributes2 = {
      NAME: attributes.id,
      AUDIO: 'audio',
      SUBTITLES: 'subs',
      RESOLUTION: {
        width: attributes.width,
        height: attributes.height
      },
      CODECS: attributes.codecs,
      BANDWIDTH: attributes.bandwidth
    }, _attributes2['PROGRAM-ID'] = 1, _attributes2),
    uri: '',
    endList: attributes.type === 'static',
    timeline: attributes.periodIndex,
    resolvedUri: '',
    targetDuration: attributes.duration,
    segments: segments,
    mediaSequence: segments.length ? segments[0].number : 1
  };

  if (attributes.contentProtection) {
    playlist.contentProtection = attributes.contentProtection;
  }

  if (sidx) {
    playlist.sidx = sidx;
  }

  return playlist;
};

var videoOnly = function videoOnly(_ref4) {
  var attributes = _ref4.attributes;
  return attributes.mimeType === 'video/mp4' || attributes.mimeType === 'video/webm' || attributes.contentType === 'video';
};

var audioOnly = function audioOnly(_ref5) {
  var attributes = _ref5.attributes;
  return attributes.mimeType === 'audio/mp4' || attributes.mimeType === 'audio/webm' || attributes.contentType === 'audio';
};

var vttOnly = function vttOnly(_ref6) {
  var attributes = _ref6.attributes;
  return attributes.mimeType === 'text/vtt' || attributes.contentType === 'text';
};

var toM3u8 = function toM3u8(dashPlaylists, locations, sidxMapping) {
  var _mediaGroups;

  if (sidxMapping === void 0) {
    sidxMapping = {};
  }

  if (!dashPlaylists.length) {
    return {};
  } // grab all main manifest attributes


  var _dashPlaylists$0$attr = dashPlaylists[0].attributes,
      duration = _dashPlaylists$0$attr.sourceDuration,
      type = _dashPlaylists$0$attr.type,
      suggestedPresentationDelay = _dashPlaylists$0$attr.suggestedPresentationDelay,
      minimumUpdatePeriod = _dashPlaylists$0$attr.minimumUpdatePeriod;
  var videoPlaylists = mergeDiscontiguousPlaylists(dashPlaylists.filter(videoOnly)).map(formatVideoPlaylist);
  var audioPlaylists = mergeDiscontiguousPlaylists(dashPlaylists.filter(audioOnly));
  var vttPlaylists = dashPlaylists.filter(vttOnly);
  var captions = dashPlaylists.map(function (playlist) {
    return playlist.attributes.captionServices;
  }).filter(Boolean);
  var manifest = {
    allowCache: true,
    discontinuityStarts: [],
    segments: [],
    endList: true,
    mediaGroups: (_mediaGroups = {
      AUDIO: {},
      VIDEO: {}
    }, _mediaGroups['CLOSED-CAPTIONS'] = {}, _mediaGroups.SUBTITLES = {}, _mediaGroups),
    uri: '',
    duration: duration,
    playlists: addSidxSegmentsToPlaylists(videoPlaylists, sidxMapping)
  };

  if (minimumUpdatePeriod >= 0) {
    manifest.minimumUpdatePeriod = minimumUpdatePeriod * 1000;
  }

  if (locations) {
    manifest.locations = locations;
  }

  if (type === 'dynamic') {
    manifest.suggestedPresentationDelay = suggestedPresentationDelay;
  }

  var isAudioOnly = manifest.playlists.length === 0;

  if (audioPlaylists.length) {
    manifest.mediaGroups.AUDIO.audio = organizeAudioPlaylists(audioPlaylists, sidxMapping, isAudioOnly);
  }

  if (vttPlaylists.length) {
    manifest.mediaGroups.SUBTITLES.subs = organizeVttPlaylists(vttPlaylists, sidxMapping);
  }

  if (captions.length) {
    manifest.mediaGroups['CLOSED-CAPTIONS'].cc = organizeCaptionServices(captions);
  }

  return manifest;
};

/**
 * Calculates the R (repetition) value for a live stream (for the final segment
 * in a manifest where the r value is negative 1)
 *
 * @param {Object} attributes
 *        Object containing all inherited attributes from parent elements with attribute
 *        names as keys
 * @param {number} time
 *        current time (typically the total time up until the final segment)
 * @param {number} duration
 *        duration property for the given <S />
 *
 * @return {number}
 *        R value to reach the end of the given period
 */
var getLiveRValue = function getLiveRValue(attributes, time, duration) {
  var NOW = attributes.NOW,
      clientOffset = attributes.clientOffset,
      availabilityStartTime = attributes.availabilityStartTime,
      _attributes$timescale = attributes.timescale,
      timescale = _attributes$timescale === void 0 ? 1 : _attributes$timescale,
      _attributes$start = attributes.start,
      start = _attributes$start === void 0 ? 0 : _attributes$start,
      _attributes$minimumUp = attributes.minimumUpdatePeriod,
      minimumUpdatePeriod = _attributes$minimumUp === void 0 ? 0 : _attributes$minimumUp;
  var now = (NOW + clientOffset) / 1000;
  var periodStartWC = availabilityStartTime + start;
  var periodEndWC = now + minimumUpdatePeriod;
  var periodDuration = periodEndWC - periodStartWC;
  return Math.ceil((periodDuration * timescale - time) / duration);
};
/**
 * Uses information provided by SegmentTemplate.SegmentTimeline to determine segment
 * timing and duration
 *
 * @param {Object} attributes
 *        Object containing all inherited attributes from parent elements with attribute
 *        names as keys
 * @param {Object[]} segmentTimeline
 *        List of objects representing the attributes of each S element contained within
 *
 * @return {{number: number, duration: number, time: number, timeline: number}[]}
 *         List of Objects with segment timing and duration info
 */


var parseByTimeline = function parseByTimeline(attributes, segmentTimeline) {
  var type = attributes.type,
      _attributes$minimumUp2 = attributes.minimumUpdatePeriod,
      minimumUpdatePeriod = _attributes$minimumUp2 === void 0 ? 0 : _attributes$minimumUp2,
      _attributes$media = attributes.media,
      media = _attributes$media === void 0 ? '' : _attributes$media,
      sourceDuration = attributes.sourceDuration,
      _attributes$timescale2 = attributes.timescale,
      timescale = _attributes$timescale2 === void 0 ? 1 : _attributes$timescale2,
      _attributes$startNumb = attributes.startNumber,
      startNumber = _attributes$startNumb === void 0 ? 1 : _attributes$startNumb,
      timeline = attributes.periodIndex;
  var segments = [];
  var time = -1;

  for (var sIndex = 0; sIndex < segmentTimeline.length; sIndex++) {
    var S = segmentTimeline[sIndex];
    var duration = S.d;
    var repeat = S.r || 0;
    var segmentTime = S.t || 0;

    if (time < 0) {
      // first segment
      time = segmentTime;
    }

    if (segmentTime && segmentTime > time) {
      // discontinuity
      // TODO: How to handle this type of discontinuity
      // timeline++ here would treat it like HLS discontuity and content would
      // get appended without gap
      // E.G.
      //  <S t="0" d="1" />
      //  <S d="1" />
      //  <S d="1" />
      //  <S t="5" d="1" />
      // would have $Time$ values of [0, 1, 2, 5]
      // should this be appened at time positions [0, 1, 2, 3],(#EXT-X-DISCONTINUITY)
      // or [0, 1, 2, gap, gap, 5]? (#EXT-X-GAP)
      // does the value of sourceDuration consider this when calculating arbitrary
      // negative @r repeat value?
      // E.G. Same elements as above with this added at the end
      //  <S d="1" r="-1" />
      //  with a sourceDuration of 10
      // Would the 2 gaps be included in the time duration calculations resulting in
      // 8 segments with $Time$ values of [0, 1, 2, 5, 6, 7, 8, 9] or 10 segments
      // with $Time$ values of [0, 1, 2, 5, 6, 7, 8, 9, 10, 11] ?
      time = segmentTime;
    }

    var count = void 0;

    if (repeat < 0) {
      var nextS = sIndex + 1;

      if (nextS === segmentTimeline.length) {
        // last segment
        if (type === 'dynamic' && minimumUpdatePeriod > 0 && media.indexOf('$Number$') > 0) {
          count = getLiveRValue(attributes, time, duration);
        } else {
          // TODO: This may be incorrect depending on conclusion of TODO above
          count = (sourceDuration * timescale - time) / duration;
        }
      } else {
        count = (segmentTimeline[nextS].t - time) / duration;
      }
    } else {
      count = repeat + 1;
    }

    var end = startNumber + segments.length + count;
    var number = startNumber + segments.length;

    while (number < end) {
      segments.push({
        number: number,
        duration: duration / timescale,
        time: time,
        timeline: timeline
      });
      time += duration;
      number++;
    }
  }

  return segments;
};

var identifierPattern = /\$([A-z]*)(?:(%0)([0-9]+)d)?\$/g;
/**
 * Replaces template identifiers with corresponding values. To be used as the callback
 * for String.prototype.replace
 *
 * @name replaceCallback
 * @function
 * @param {string} match
 *        Entire match of identifier
 * @param {string} identifier
 *        Name of matched identifier
 * @param {string} format
 *        Format tag string. Its presence indicates that padding is expected
 * @param {string} width
 *        Desired length of the replaced value. Values less than this width shall be left
 *        zero padded
 * @return {string}
 *         Replacement for the matched identifier
 */

/**
 * Returns a function to be used as a callback for String.prototype.replace to replace
 * template identifiers
 *
 * @param {Obect} values
 *        Object containing values that shall be used to replace known identifiers
 * @param {number} values.RepresentationID
 *        Value of the Representation@id attribute
 * @param {number} values.Number
 *        Number of the corresponding segment
 * @param {number} values.Bandwidth
 *        Value of the Representation@bandwidth attribute.
 * @param {number} values.Time
 *        Timestamp value of the corresponding segment
 * @return {replaceCallback}
 *         Callback to be used with String.prototype.replace to replace identifiers
 */

var identifierReplacement = function identifierReplacement(values) {
  return function (match, identifier, format, width) {
    if (match === '$$') {
      // escape sequence
      return '$';
    }

    if (typeof values[identifier] === 'undefined') {
      return match;
    }

    var value = '' + values[identifier];

    if (identifier === 'RepresentationID') {
      // Format tag shall not be present with RepresentationID
      return value;
    }

    if (!format) {
      width = 1;
    } else {
      width = parseInt(width, 10);
    }

    if (value.length >= width) {
      return value;
    }

    return "" + new Array(width - value.length + 1).join('0') + value;
  };
};
/**
 * Constructs a segment url from a template string
 *
 * @param {string} url
 *        Template string to construct url from
 * @param {Obect} values
 *        Object containing values that shall be used to replace known identifiers
 * @param {number} values.RepresentationID
 *        Value of the Representation@id attribute
 * @param {number} values.Number
 *        Number of the corresponding segment
 * @param {number} values.Bandwidth
 *        Value of the Representation@bandwidth attribute.
 * @param {number} values.Time
 *        Timestamp value of the corresponding segment
 * @return {string}
 *         Segment url with identifiers replaced
 */

var constructTemplateUrl = function constructTemplateUrl(url, values) {
  return url.replace(identifierPattern, identifierReplacement(values));
};
/**
 * Generates a list of objects containing timing and duration information about each
 * segment needed to generate segment uris and the complete segment object
 *
 * @param {Object} attributes
 *        Object containing all inherited attributes from parent elements with attribute
 *        names as keys
 * @param {Object[]|undefined} segmentTimeline
 *        List of objects representing the attributes of each S element contained within
 *        the SegmentTimeline element
 * @return {{number: number, duration: number, time: number, timeline: number}[]}
 *         List of Objects with segment timing and duration info
 */

var parseTemplateInfo = function parseTemplateInfo(attributes, segmentTimeline) {
  if (!attributes.duration && !segmentTimeline) {
    // if neither @duration or SegmentTimeline are present, then there shall be exactly
    // one media segment
    return [{
      number: attributes.startNumber || 1,
      duration: attributes.sourceDuration,
      time: 0,
      timeline: attributes.periodIndex
    }];
  }

  if (attributes.duration) {
    return parseByDuration(attributes);
  }

  return parseByTimeline(attributes, segmentTimeline);
};
/**
 * Generates a list of segments using information provided by the SegmentTemplate element
 *
 * @param {Object} attributes
 *        Object containing all inherited attributes from parent elements with attribute
 *        names as keys
 * @param {Object[]|undefined} segmentTimeline
 *        List of objects representing the attributes of each S element contained within
 *        the SegmentTimeline element
 * @return {Object[]}
 *         List of segment objects
 */

var segmentsFromTemplate = function segmentsFromTemplate(attributes, segmentTimeline) {
  var templateValues = {
    RepresentationID: attributes.id,
    Bandwidth: attributes.bandwidth || 0
  };
  var _attributes$initializ = attributes.initialization,
      initialization = _attributes$initializ === void 0 ? {
    sourceURL: '',
    range: ''
  } : _attributes$initializ;
  var mapSegment = urlTypeToSegment({
    baseUrl: attributes.baseUrl,
    source: constructTemplateUrl(initialization.sourceURL, templateValues),
    range: initialization.range
  });
  var segments = parseTemplateInfo(attributes, segmentTimeline);
  return segments.map(function (segment) {
    templateValues.Number = segment.number;
    templateValues.Time = segment.time;
    var uri = constructTemplateUrl(attributes.media || '', templateValues); // See DASH spec section 5.3.9.2.2
    // - if timescale isn't present on any level, default to 1.

    var timescale = attributes.timescale || 1; // - if presentationTimeOffset isn't present on any level, default to 0

    var presentationTimeOffset = attributes.presentationTimeOffset || 0;
    var presentationTime = // Even if the @t attribute is not specified for the segment, segment.time is
    // calculated in mpd-parser prior to this, so it's assumed to be available.
    attributes.periodStart + (segment.time - presentationTimeOffset) / timescale;
    var map = {
      uri: uri,
      timeline: segment.timeline,
      duration: segment.duration,
      resolvedUri: (0,_videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(attributes.baseUrl || '', uri),
      map: mapSegment,
      number: segment.number,
      presentationTime: presentationTime
    };
    return map;
  });
};

/**
 * Converts a <SegmentUrl> (of type URLType from the DASH spec 5.3.9.2 Table 14)
 * to an object that matches the output of a segment in videojs/mpd-parser
 *
 * @param {Object} attributes
 *   Object containing all inherited attributes from parent elements with attribute
 *   names as keys
 * @param {Object} segmentUrl
 *   <SegmentURL> node to translate into a segment object
 * @return {Object} translated segment object
 */

var SegmentURLToSegmentObject = function SegmentURLToSegmentObject(attributes, segmentUrl) {
  var baseUrl = attributes.baseUrl,
      _attributes$initializ = attributes.initialization,
      initialization = _attributes$initializ === void 0 ? {} : _attributes$initializ;
  var initSegment = urlTypeToSegment({
    baseUrl: baseUrl,
    source: initialization.sourceURL,
    range: initialization.range
  });
  var segment = urlTypeToSegment({
    baseUrl: baseUrl,
    source: segmentUrl.media,
    range: segmentUrl.mediaRange
  });
  segment.map = initSegment;
  return segment;
};
/**
 * Generates a list of segments using information provided by the SegmentList element
 * SegmentList (DASH SPEC Section 5.3.9.3.2) contains a set of <SegmentURL> nodes.  Each
 * node should be translated into segment.
 *
 * @param {Object} attributes
 *   Object containing all inherited attributes from parent elements with attribute
 *   names as keys
 * @param {Object[]|undefined} segmentTimeline
 *        List of objects representing the attributes of each S element contained within
 *        the SegmentTimeline element
 * @return {Object.<Array>} list of segments
 */


var segmentsFromList = function segmentsFromList(attributes, segmentTimeline) {
  var duration = attributes.duration,
      _attributes$segmentUr = attributes.segmentUrls,
      segmentUrls = _attributes$segmentUr === void 0 ? [] : _attributes$segmentUr,
      periodStart = attributes.periodStart; // Per spec (5.3.9.2.1) no way to determine segment duration OR
  // if both SegmentTimeline and @duration are defined, it is outside of spec.

  if (!duration && !segmentTimeline || duration && segmentTimeline) {
    throw new Error(errors.SEGMENT_TIME_UNSPECIFIED);
  }

  var segmentUrlMap = segmentUrls.map(function (segmentUrlObject) {
    return SegmentURLToSegmentObject(attributes, segmentUrlObject);
  });
  var segmentTimeInfo;

  if (duration) {
    segmentTimeInfo = parseByDuration(attributes);
  }

  if (segmentTimeline) {
    segmentTimeInfo = parseByTimeline(attributes, segmentTimeline);
  }

  var segments = segmentTimeInfo.map(function (segmentTime, index) {
    if (segmentUrlMap[index]) {
      var segment = segmentUrlMap[index]; // See DASH spec section 5.3.9.2.2
      // - if timescale isn't present on any level, default to 1.

      var timescale = attributes.timescale || 1; // - if presentationTimeOffset isn't present on any level, default to 0

      var presentationTimeOffset = attributes.presentationTimeOffset || 0;
      segment.timeline = segmentTime.timeline;
      segment.duration = segmentTime.duration;
      segment.number = segmentTime.number;
      segment.presentationTime = periodStart + (segmentTime.time - presentationTimeOffset) / timescale;
      return segment;
    } // Since we're mapping we should get rid of any blank segments (in case
    // the given SegmentTimeline is handling for more elements than we have
    // SegmentURLs for).

  }).filter(function (segment) {
    return segment;
  });
  return segments;
};

var generateSegments = function generateSegments(_ref) {
  var attributes = _ref.attributes,
      segmentInfo = _ref.segmentInfo;
  var segmentAttributes;
  var segmentsFn;

  if (segmentInfo.template) {
    segmentsFn = segmentsFromTemplate;
    segmentAttributes = merge(attributes, segmentInfo.template);
  } else if (segmentInfo.base) {
    segmentsFn = segmentsFromBase;
    segmentAttributes = merge(attributes, segmentInfo.base);
  } else if (segmentInfo.list) {
    segmentsFn = segmentsFromList;
    segmentAttributes = merge(attributes, segmentInfo.list);
  }

  var segmentsInfo = {
    attributes: attributes
  };

  if (!segmentsFn) {
    return segmentsInfo;
  }

  var segments = segmentsFn(segmentAttributes, segmentInfo.segmentTimeline); // The @duration attribute will be used to determin the playlist's targetDuration which
  // must be in seconds. Since we've generated the segment list, we no longer need
  // @duration to be in @timescale units, so we can convert it here.

  if (segmentAttributes.duration) {
    var _segmentAttributes = segmentAttributes,
        duration = _segmentAttributes.duration,
        _segmentAttributes$ti = _segmentAttributes.timescale,
        timescale = _segmentAttributes$ti === void 0 ? 1 : _segmentAttributes$ti;
    segmentAttributes.duration = duration / timescale;
  } else if (segments.length) {
    // if there is no @duration attribute, use the largest segment duration as
    // as target duration
    segmentAttributes.duration = segments.reduce(function (max, segment) {
      return Math.max(max, Math.ceil(segment.duration));
    }, 0);
  } else {
    segmentAttributes.duration = 0;
  }

  segmentsInfo.attributes = segmentAttributes;
  segmentsInfo.segments = segments; // This is a sidx box without actual segment information

  if (segmentInfo.base && segmentAttributes.indexRange) {
    segmentsInfo.sidx = segments[0];
    segmentsInfo.segments = [];
  }

  return segmentsInfo;
};
var toPlaylists = function toPlaylists(representations) {
  return representations.map(generateSegments);
};

var findChildren = function findChildren(element, name) {
  return from(element.childNodes).filter(function (_ref) {
    var tagName = _ref.tagName;
    return tagName === name;
  });
};
var getContent = function getContent(element) {
  return element.textContent.trim();
};

var parseDuration = function parseDuration(str) {
  var SECONDS_IN_YEAR = 365 * 24 * 60 * 60;
  var SECONDS_IN_MONTH = 30 * 24 * 60 * 60;
  var SECONDS_IN_DAY = 24 * 60 * 60;
  var SECONDS_IN_HOUR = 60 * 60;
  var SECONDS_IN_MIN = 60; // P10Y10M10DT10H10M10.1S

  var durationRegex = /P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)D)?(?:T(?:(\d*)H)?(?:(\d*)M)?(?:([\d.]*)S)?)?/;
  var match = durationRegex.exec(str);

  if (!match) {
    return 0;
  }

  var _match$slice = match.slice(1),
      year = _match$slice[0],
      month = _match$slice[1],
      day = _match$slice[2],
      hour = _match$slice[3],
      minute = _match$slice[4],
      second = _match$slice[5];

  return parseFloat(year || 0) * SECONDS_IN_YEAR + parseFloat(month || 0) * SECONDS_IN_MONTH + parseFloat(day || 0) * SECONDS_IN_DAY + parseFloat(hour || 0) * SECONDS_IN_HOUR + parseFloat(minute || 0) * SECONDS_IN_MIN + parseFloat(second || 0);
};
var parseDate = function parseDate(str) {
  // Date format without timezone according to ISO 8601
  // YYY-MM-DDThh:mm:ss.ssssss
  var dateRegex = /^\d+-\d+-\d+T\d+:\d+:\d+(\.\d+)?$/; // If the date string does not specifiy a timezone, we must specifiy UTC. This is
  // expressed by ending with 'Z'

  if (dateRegex.test(str)) {
    str += 'Z';
  }

  return Date.parse(str);
};

var parsers = {
  /**
   * Specifies the duration of the entire Media Presentation. Format is a duration string
   * as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  mediaPresentationDuration: function mediaPresentationDuration(value) {
    return parseDuration(value);
  },

  /**
   * Specifies the Segment availability start time for all Segments referred to in this
   * MPD. For a dynamic manifest, it specifies the anchor for the earliest availability
   * time. Format is a date string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The date as seconds from unix epoch
   */
  availabilityStartTime: function availabilityStartTime(value) {
    return parseDate(value) / 1000;
  },

  /**
   * Specifies the smallest period between potential changes to the MPD. Format is a
   * duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  minimumUpdatePeriod: function minimumUpdatePeriod(value) {
    return parseDuration(value);
  },

  /**
   * Specifies the suggested presentation delay. Format is a
   * duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  suggestedPresentationDelay: function suggestedPresentationDelay(value) {
    return parseDuration(value);
  },

  /**
   * specifices the type of mpd. Can be either "static" or "dynamic"
   *
   * @param {string} value
   *        value of attribute as a string
   *
   * @return {string}
   *         The type as a string
   */
  type: function type(value) {
    return value;
  },

  /**
   * Specifies the duration of the smallest time shifting buffer for any Representation
   * in the MPD. Format is a duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  timeShiftBufferDepth: function timeShiftBufferDepth(value) {
    return parseDuration(value);
  },

  /**
   * Specifies the PeriodStart time of the Period relative to the availabilityStarttime.
   * Format is a duration string as specified in ISO 8601
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The duration in seconds
   */
  start: function start(value) {
    return parseDuration(value);
  },

  /**
   * Specifies the width of the visual presentation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed width
   */
  width: function width(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the height of the visual presentation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed height
   */
  height: function height(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the bitrate of the representation
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed bandwidth
   */
  bandwidth: function bandwidth(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the number of the first Media Segment in this Representation in the Period
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed number
   */
  startNumber: function startNumber(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the timescale in units per seconds
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed timescale
   */
  timescale: function timescale(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the presentationTimeOffset.
   *
   * @param {string} value
   *        value of the attribute as a string
   *
   * @return {number}
   *         The parsed presentationTimeOffset
   */
  presentationTimeOffset: function presentationTimeOffset(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the constant approximate Segment duration
   * NOTE: The <Period> element also contains an @duration attribute. This duration
   *       specifies the duration of the Period. This attribute is currently not
   *       supported by the rest of the parser, however we still check for it to prevent
   *       errors.
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed duration
   */
  duration: function duration(value) {
    var parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      return parseDuration(value);
    }

    return parsedValue;
  },

  /**
   * Specifies the Segment duration, in units of the value of the @timescale.
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed duration
   */
  d: function d(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the MPD start time, in @timescale units, the first Segment in the series
   * starts relative to the beginning of the Period
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed time
   */
  t: function t(value) {
    return parseInt(value, 10);
  },

  /**
   * Specifies the repeat count of the number of following contiguous Segments with the
   * same duration expressed by the value of @d
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {number}
   *         The parsed number
   */
  r: function r(value) {
    return parseInt(value, 10);
  },

  /**
   * Default parser for all other attributes. Acts as a no-op and just returns the value
   * as a string
   *
   * @param {string} value
   *        value of attribute as a string
   * @return {string}
   *         Unparsed value
   */
  DEFAULT: function DEFAULT(value) {
    return value;
  }
};
/**
 * Gets all the attributes and values of the provided node, parses attributes with known
 * types, and returns an object with attribute names mapped to values.
 *
 * @param {Node} el
 *        The node to parse attributes from
 * @return {Object}
 *         Object with all attributes of el parsed
 */

var parseAttributes = function parseAttributes(el) {
  if (!(el && el.attributes)) {
    return {};
  }

  return from(el.attributes).reduce(function (a, e) {
    var parseFn = parsers[e.name] || parsers.DEFAULT;
    a[e.name] = parseFn(e.value);
    return a;
  }, {});
};

var keySystemsMap = {
  'urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b': 'org.w3.clearkey',
  'urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed': 'com.widevine.alpha',
  'urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95': 'com.microsoft.playready',
  'urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb': 'com.adobe.primetime'
};
/**
 * Builds a list of urls that is the product of the reference urls and BaseURL values
 *
 * @param {string[]} referenceUrls
 *        List of reference urls to resolve to
 * @param {Node[]} baseUrlElements
 *        List of BaseURL nodes from the mpd
 * @return {string[]}
 *         List of resolved urls
 */

var buildBaseUrls = function buildBaseUrls(referenceUrls, baseUrlElements) {
  if (!baseUrlElements.length) {
    return referenceUrls;
  }

  return flatten(referenceUrls.map(function (reference) {
    return baseUrlElements.map(function (baseUrlElement) {
      return (0,_videojs_vhs_utils_es_resolve_url__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(reference, getContent(baseUrlElement));
    });
  }));
};
/**
 * Contains all Segment information for its containing AdaptationSet
 *
 * @typedef {Object} SegmentInformation
 * @property {Object|undefined} template
 *           Contains the attributes for the SegmentTemplate node
 * @property {Object[]|undefined} segmentTimeline
 *           Contains a list of atrributes for each S node within the SegmentTimeline node
 * @property {Object|undefined} list
 *           Contains the attributes for the SegmentList node
 * @property {Object|undefined} base
 *           Contains the attributes for the SegmentBase node
 */

/**
 * Returns all available Segment information contained within the AdaptationSet node
 *
 * @param {Node} adaptationSet
 *        The AdaptationSet node to get Segment information from
 * @return {SegmentInformation}
 *         The Segment information contained within the provided AdaptationSet
 */

var getSegmentInformation = function getSegmentInformation(adaptationSet) {
  var segmentTemplate = findChildren(adaptationSet, 'SegmentTemplate')[0];
  var segmentList = findChildren(adaptationSet, 'SegmentList')[0];
  var segmentUrls = segmentList && findChildren(segmentList, 'SegmentURL').map(function (s) {
    return merge({
      tag: 'SegmentURL'
    }, parseAttributes(s));
  });
  var segmentBase = findChildren(adaptationSet, 'SegmentBase')[0];
  var segmentTimelineParentNode = segmentList || segmentTemplate;
  var segmentTimeline = segmentTimelineParentNode && findChildren(segmentTimelineParentNode, 'SegmentTimeline')[0];
  var segmentInitializationParentNode = segmentList || segmentBase || segmentTemplate;
  var segmentInitialization = segmentInitializationParentNode && findChildren(segmentInitializationParentNode, 'Initialization')[0]; // SegmentTemplate is handled slightly differently, since it can have both
  // @initialization and an <Initialization> node.  @initialization can be templated,
  // while the node can have a url and range specified.  If the <SegmentTemplate> has
  // both @initialization and an <Initialization> subelement we opt to override with
  // the node, as this interaction is not defined in the spec.

  var template = segmentTemplate && parseAttributes(segmentTemplate);

  if (template && segmentInitialization) {
    template.initialization = segmentInitialization && parseAttributes(segmentInitialization);
  } else if (template && template.initialization) {
    // If it is @initialization we convert it to an object since this is the format that
    // later functions will rely on for the initialization segment.  This is only valid
    // for <SegmentTemplate>
    template.initialization = {
      sourceURL: template.initialization
    };
  }

  var segmentInfo = {
    template: template,
    segmentTimeline: segmentTimeline && findChildren(segmentTimeline, 'S').map(function (s) {
      return parseAttributes(s);
    }),
    list: segmentList && merge(parseAttributes(segmentList), {
      segmentUrls: segmentUrls,
      initialization: parseAttributes(segmentInitialization)
    }),
    base: segmentBase && merge(parseAttributes(segmentBase), {
      initialization: parseAttributes(segmentInitialization)
    })
  };
  Object.keys(segmentInfo).forEach(function (key) {
    if (!segmentInfo[key]) {
      delete segmentInfo[key];
    }
  });
  return segmentInfo;
};
/**
 * Contains Segment information and attributes needed to construct a Playlist object
 * from a Representation
 *
 * @typedef {Object} RepresentationInformation
 * @property {SegmentInformation} segmentInfo
 *           Segment information for this Representation
 * @property {Object} attributes
 *           Inherited attributes for this Representation
 */

/**
 * Maps a Representation node to an object containing Segment information and attributes
 *
 * @name inheritBaseUrlsCallback
 * @function
 * @param {Node} representation
 *        Representation node from the mpd
 * @return {RepresentationInformation}
 *         Representation information needed to construct a Playlist object
 */

/**
 * Returns a callback for Array.prototype.map for mapping Representation nodes to
 * Segment information and attributes using inherited BaseURL nodes.
 *
 * @param {Object} adaptationSetAttributes
 *        Contains attributes inherited by the AdaptationSet
 * @param {string[]} adaptationSetBaseUrls
 *        Contains list of resolved base urls inherited by the AdaptationSet
 * @param {SegmentInformation} adaptationSetSegmentInfo
 *        Contains Segment information for the AdaptationSet
 * @return {inheritBaseUrlsCallback}
 *         Callback map function
 */

var inheritBaseUrls = function inheritBaseUrls(adaptationSetAttributes, adaptationSetBaseUrls, adaptationSetSegmentInfo) {
  return function (representation) {
    var repBaseUrlElements = findChildren(representation, 'BaseURL');
    var repBaseUrls = buildBaseUrls(adaptationSetBaseUrls, repBaseUrlElements);
    var attributes = merge(adaptationSetAttributes, parseAttributes(representation));
    var representationSegmentInfo = getSegmentInformation(representation);
    return repBaseUrls.map(function (baseUrl) {
      return {
        segmentInfo: merge(adaptationSetSegmentInfo, representationSegmentInfo),
        attributes: merge(attributes, {
          baseUrl: baseUrl
        })
      };
    });
  };
};
/**
 * Tranforms a series of content protection nodes to
 * an object containing pssh data by key system
 *
 * @param {Node[]} contentProtectionNodes
 *        Content protection nodes
 * @return {Object}
 *        Object containing pssh data by key system
 */

var generateKeySystemInformation = function generateKeySystemInformation(contentProtectionNodes) {
  return contentProtectionNodes.reduce(function (acc, node) {
    var attributes = parseAttributes(node);
    var keySystem = keySystemsMap[attributes.schemeIdUri];

    if (keySystem) {
      acc[keySystem] = {
        attributes: attributes
      };
      var psshNode = findChildren(node, 'cenc:pssh')[0];

      if (psshNode) {
        var pssh = getContent(psshNode);
        var psshBuffer = pssh && (0,_videojs_vhs_utils_es_decode_b64_to_uint8_array__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(pssh);
        acc[keySystem].pssh = psshBuffer;
      }
    }

    return acc;
  }, {});
}; // defined in ANSI_SCTE 214-1 2016


var parseCaptionServiceMetadata = function parseCaptionServiceMetadata(service) {
  // 608 captions
  if (service.schemeIdUri === 'urn:scte:dash:cc:cea-608:2015') {
    var values = typeof service.value !== 'string' ? [] : service.value.split(';');
    return values.map(function (value) {
      var channel;
      var language; // default language to value

      language = value;

      if (/^CC\d=/.test(value)) {
        var _value$split = value.split('=');

        channel = _value$split[0];
        language = _value$split[1];
      } else if (/^CC\d$/.test(value)) {
        channel = value;
      }

      return {
        channel: channel,
        language: language
      };
    });
  } else if (service.schemeIdUri === 'urn:scte:dash:cc:cea-708:2015') {
    var _values = typeof service.value !== 'string' ? [] : service.value.split(';');

    return _values.map(function (value) {
      var flags = {
        // service or channel number 1-63
        'channel': undefined,
        // language is a 3ALPHA per ISO 639.2/B
        // field is required
        'language': undefined,
        // BIT 1/0 or ?
        // default value is 1, meaning 16:9 aspect ratio, 0 is 4:3, ? is unknown
        'aspectRatio': 1,
        // BIT 1/0
        // easy reader flag indicated the text is tailed to the needs of beginning readers
        // default 0, or off
        'easyReader': 0,
        // BIT 1/0
        // If 3d metadata is present (CEA-708.1) then 1
        // default 0
        '3D': 0
      };

      if (/=/.test(value)) {
        var _value$split2 = value.split('='),
            channel = _value$split2[0],
            _value$split2$ = _value$split2[1],
            opts = _value$split2$ === void 0 ? '' : _value$split2$;

        flags.channel = channel;
        flags.language = value;
        opts.split(',').forEach(function (opt) {
          var _opt$split = opt.split(':'),
              name = _opt$split[0],
              val = _opt$split[1];

          if (name === 'lang') {
            flags.language = val; // er for easyReadery
          } else if (name === 'er') {
            flags.easyReader = Number(val); // war for wide aspect ratio
          } else if (name === 'war') {
            flags.aspectRatio = Number(val);
          } else if (name === '3D') {
            flags['3D'] = Number(val);
          }
        });
      } else {
        flags.language = value;
      }

      if (flags.channel) {
        flags.channel = 'SERVICE' + flags.channel;
      }

      return flags;
    });
  }
};
/**
 * Maps an AdaptationSet node to a list of Representation information objects
 *
 * @name toRepresentationsCallback
 * @function
 * @param {Node} adaptationSet
 *        AdaptationSet node from the mpd
 * @return {RepresentationInformation[]}
 *         List of objects containing Representaion information
 */

/**
 * Returns a callback for Array.prototype.map for mapping AdaptationSet nodes to a list of
 * Representation information objects
 *
 * @param {Object} periodAttributes
 *        Contains attributes inherited by the Period
 * @param {string[]} periodBaseUrls
 *        Contains list of resolved base urls inherited by the Period
 * @param {string[]} periodSegmentInfo
 *        Contains Segment Information at the period level
 * @return {toRepresentationsCallback}
 *         Callback map function
 */

var toRepresentations = function toRepresentations(periodAttributes, periodBaseUrls, periodSegmentInfo) {
  return function (adaptationSet) {
    var adaptationSetAttributes = parseAttributes(adaptationSet);
    var adaptationSetBaseUrls = buildBaseUrls(periodBaseUrls, findChildren(adaptationSet, 'BaseURL'));
    var role = findChildren(adaptationSet, 'Role')[0];
    var roleAttributes = {
      role: parseAttributes(role)
    };
    var attrs = merge(periodAttributes, adaptationSetAttributes, roleAttributes);
    var accessibility = findChildren(adaptationSet, 'Accessibility')[0];
    var captionServices = parseCaptionServiceMetadata(parseAttributes(accessibility));

    if (captionServices) {
      attrs = merge(attrs, {
        captionServices: captionServices
      });
    }

    var label = findChildren(adaptationSet, 'Label')[0];

    if (label && label.childNodes.length) {
      var labelVal = label.childNodes[0].nodeValue.trim();
      attrs = merge(attrs, {
        label: labelVal
      });
    }

    var contentProtection = generateKeySystemInformation(findChildren(adaptationSet, 'ContentProtection'));

    if (Object.keys(contentProtection).length) {
      attrs = merge(attrs, {
        contentProtection: contentProtection
      });
    }

    var segmentInfo = getSegmentInformation(adaptationSet);
    var representations = findChildren(adaptationSet, 'Representation');
    var adaptationSetSegmentInfo = merge(periodSegmentInfo, segmentInfo);
    return flatten(representations.map(inheritBaseUrls(attrs, adaptationSetBaseUrls, adaptationSetSegmentInfo)));
  };
};
/**
 * Contains all period information for mapping nodes onto adaptation sets.
 *
 * @typedef {Object} PeriodInformation
 * @property {Node} period.node
 *           Period node from the mpd
 * @property {Object} period.attributes
 *           Parsed period attributes from node plus any added
 */

/**
 * Maps a PeriodInformation object to a list of Representation information objects for all
 * AdaptationSet nodes contained within the Period.
 *
 * @name toAdaptationSetsCallback
 * @function
 * @param {PeriodInformation} period
 *        Period object containing necessary period information
 * @param {number} periodIndex
 *        Index of the Period within the mpd
 * @return {RepresentationInformation[]}
 *         List of objects containing Representaion information
 */

/**
 * Returns a callback for Array.prototype.map for mapping Period nodes to a list of
 * Representation information objects
 *
 * @param {Object} mpdAttributes
 *        Contains attributes inherited by the mpd
 * @param {string[]} mpdBaseUrls
 *        Contains list of resolved base urls inherited by the mpd
 * @return {toAdaptationSetsCallback}
 *         Callback map function
 */

var toAdaptationSets = function toAdaptationSets(mpdAttributes, mpdBaseUrls) {
  return function (period, index) {
    var periodBaseUrls = buildBaseUrls(mpdBaseUrls, findChildren(period.node, 'BaseURL'));
    var parsedPeriodId = parseInt(period.attributes.id, 10); // fallback to mapping index if Period@id is not a number

    var periodIndex = global_window__WEBPACK_IMPORTED_MODULE_1___default().isNaN(parsedPeriodId) ? index : parsedPeriodId;
    var periodAttributes = merge(mpdAttributes, {
      periodIndex: periodIndex,
      periodStart: period.attributes.start
    });

    if (typeof period.attributes.duration === 'number') {
      periodAttributes.periodDuration = period.attributes.duration;
    }

    var adaptationSets = findChildren(period.node, 'AdaptationSet');
    var periodSegmentInfo = getSegmentInformation(period.node);
    return flatten(adaptationSets.map(toRepresentations(periodAttributes, periodBaseUrls, periodSegmentInfo)));
  };
};
/**
 * Gets Period@start property for a given period.
 *
 * @param {Object} options
 *        Options object
 * @param {Object} options.attributes
 *        Period attributes
 * @param {Object} [options.priorPeriodAttributes]
 *        Prior period attributes (if prior period is available)
 * @param {string} options.mpdType
 *        The MPD@type these periods came from
 * @return {number|null}
 *         The period start, or null if it's an early available period or error
 */

var getPeriodStart = function getPeriodStart(_ref) {
  var attributes = _ref.attributes,
      priorPeriodAttributes = _ref.priorPeriodAttributes,
      mpdType = _ref.mpdType;

  // Summary of period start time calculation from DASH spec section 5.3.2.1
  //
  // A period's start is the first period's start + time elapsed after playing all
  // prior periods to this one. Periods continue one after the other in time (without
  // gaps) until the end of the presentation.
  //
  // The value of Period@start should be:
  // 1. if Period@start is present: value of Period@start
  // 2. if previous period exists and it has @duration: previous Period@start +
  //    previous Period@duration
  // 3. if this is first period and MPD@type is 'static': 0
  // 4. in all other cases, consider the period an "early available period" (note: not
  //    currently supported)
  // (1)
  if (typeof attributes.start === 'number') {
    return attributes.start;
  } // (2)


  if (priorPeriodAttributes && typeof priorPeriodAttributes.start === 'number' && typeof priorPeriodAttributes.duration === 'number') {
    return priorPeriodAttributes.start + priorPeriodAttributes.duration;
  } // (3)


  if (!priorPeriodAttributes && mpdType === 'static') {
    return 0;
  } // (4)
  // There is currently no logic for calculating the Period@start value if there is
  // no Period@start or prior Period@start and Period@duration available. This is not made
  // explicit by the DASH interop guidelines or the DASH spec, however, since there's
  // nothing about any other resolution strategies, it's implied. Thus, this case should
  // be considered an early available period, or error, and null should suffice for both
  // of those cases.


  return null;
};
/**
 * Traverses the mpd xml tree to generate a list of Representation information objects
 * that have inherited attributes from parent nodes
 *
 * @param {Node} mpd
 *        The root node of the mpd
 * @param {Object} options
 *        Available options for inheritAttributes
 * @param {string} options.manifestUri
 *        The uri source of the mpd
 * @param {number} options.NOW
 *        Current time per DASH IOP.  Default is current time in ms since epoch
 * @param {number} options.clientOffset
 *        Client time difference from NOW (in milliseconds)
 * @return {RepresentationInformation[]}
 *         List of objects containing Representation information
 */

var inheritAttributes = function inheritAttributes(mpd, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$manifestUri = _options.manifestUri,
      manifestUri = _options$manifestUri === void 0 ? '' : _options$manifestUri,
      _options$NOW = _options.NOW,
      NOW = _options$NOW === void 0 ? Date.now() : _options$NOW,
      _options$clientOffset = _options.clientOffset,
      clientOffset = _options$clientOffset === void 0 ? 0 : _options$clientOffset;
  var periodNodes = findChildren(mpd, 'Period');

  if (!periodNodes.length) {
    throw new Error(errors.INVALID_NUMBER_OF_PERIOD);
  }

  var locations = findChildren(mpd, 'Location');
  var mpdAttributes = parseAttributes(mpd);
  var mpdBaseUrls = buildBaseUrls([manifestUri], findChildren(mpd, 'BaseURL')); // See DASH spec section 5.3.1.2, Semantics of MPD element. Default type to 'static'.

  mpdAttributes.type = mpdAttributes.type || 'static';
  mpdAttributes.sourceDuration = mpdAttributes.mediaPresentationDuration || 0;
  mpdAttributes.NOW = NOW;
  mpdAttributes.clientOffset = clientOffset;

  if (locations.length) {
    mpdAttributes.locations = locations.map(getContent);
  }

  var periods = []; // Since toAdaptationSets acts on individual periods right now, the simplest approach to
  // adding properties that require looking at prior periods is to parse attributes and add
  // missing ones before toAdaptationSets is called. If more such properties are added, it
  // may be better to refactor toAdaptationSets.

  periodNodes.forEach(function (node, index) {
    var attributes = parseAttributes(node); // Use the last modified prior period, as it may contain added information necessary
    // for this period.

    var priorPeriod = periods[index - 1];
    attributes.start = getPeriodStart({
      attributes: attributes,
      priorPeriodAttributes: priorPeriod ? priorPeriod.attributes : null,
      mpdType: mpdAttributes.type
    });
    periods.push({
      node: node,
      attributes: attributes
    });
  });
  return {
    locations: mpdAttributes.locations,
    representationInfo: flatten(periods.map(toAdaptationSets(mpdAttributes, mpdBaseUrls)))
  };
};

var stringToMpdXml = function stringToMpdXml(manifestString) {
  if (manifestString === '') {
    throw new Error(errors.DASH_EMPTY_MANIFEST);
  }

  var parser = new _xmldom_xmldom__WEBPACK_IMPORTED_MODULE_3__.DOMParser();
  var xml;
  var mpd;

  try {
    xml = parser.parseFromString(manifestString, 'application/xml');
    mpd = xml && xml.documentElement.tagName === 'MPD' ? xml.documentElement : null;
  } catch (e) {// ie 11 throwsw on invalid xml
  }

  if (!mpd || mpd && mpd.getElementsByTagName('parsererror').length > 0) {
    throw new Error(errors.DASH_INVALID_XML);
  }

  return mpd;
};

/**
 * Parses the manifest for a UTCTiming node, returning the nodes attributes if found
 *
 * @param {string} mpd
 *        XML string of the MPD manifest
 * @return {Object|null}
 *         Attributes of UTCTiming node specified in the manifest. Null if none found
 */

var parseUTCTimingScheme = function parseUTCTimingScheme(mpd) {
  var UTCTimingNode = findChildren(mpd, 'UTCTiming')[0];

  if (!UTCTimingNode) {
    return null;
  }

  var attributes = parseAttributes(UTCTimingNode);

  switch (attributes.schemeIdUri) {
    case 'urn:mpeg:dash:utc:http-head:2014':
    case 'urn:mpeg:dash:utc:http-head:2012':
      attributes.method = 'HEAD';
      break;

    case 'urn:mpeg:dash:utc:http-xsdate:2014':
    case 'urn:mpeg:dash:utc:http-iso:2014':
    case 'urn:mpeg:dash:utc:http-xsdate:2012':
    case 'urn:mpeg:dash:utc:http-iso:2012':
      attributes.method = 'GET';
      break;

    case 'urn:mpeg:dash:utc:direct:2014':
    case 'urn:mpeg:dash:utc:direct:2012':
      attributes.method = 'DIRECT';
      attributes.value = Date.parse(attributes.value);
      break;

    case 'urn:mpeg:dash:utc:http-ntp:2014':
    case 'urn:mpeg:dash:utc:ntp:2014':
    case 'urn:mpeg:dash:utc:sntp:2014':
    default:
      throw new Error(errors.UNSUPPORTED_UTC_TIMING_SCHEME);
  }

  return attributes;
};

var VERSION = (/* unused pure expression or super */ null && (version));

var parse = function parse(manifestString, options) {
  if (options === void 0) {
    options = {};
  }

  var parsedManifestInfo = inheritAttributes(stringToMpdXml(manifestString), options);
  var playlists = toPlaylists(parsedManifestInfo.representationInfo);
  return toM3u8(playlists, parsedManifestInfo.locations, options.sidxMapping);
};
/**
 * Parses the manifest for a UTCTiming node, returning the nodes attributes if found
 *
 * @param {string} manifestString
 *        XML string of the MPD manifest
 * @return {Object|null}
 *         Attributes of UTCTiming node specified in the manifest. Null if none found
 */


var parseUTCTiming = function parseUTCTiming(manifestString) {
  return parseUTCTimingScheme(stringToMpdXml(manifestString));
};




/***/ }),

/***/ 4221:
/***/ (function(module) {

var MAX_UINT32 = Math.pow(2, 32);

var parseSidx = function(data) {
  var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
      result = {
        version: data[0],
        flags: new Uint8Array(data.subarray(1, 4)),
        references: [],
        referenceId: view.getUint32(4),
        timescale: view.getUint32(8)
      },
    i = 12;

  if (result.version === 0) {
    result.earliestPresentationTime = view.getUint32(i);
    result.firstOffset = view.getUint32(i + 4);
    i += 8;
  } else {
    // read 64 bits
    result.earliestPresentationTime = (view.getUint32(i) * MAX_UINT32) + view.getUint32(i + 4);
    result.firstOffset = (view.getUint32(i + 8) * MAX_UINT32) + view.getUint32(i + 12);
    i += 16;
  }

  i += 2; // reserved

  var referenceCount = view.getUint16(i);

  i += 2; // start of references

  for (; referenceCount > 0; i += 12, referenceCount--) {
    result.references.push({
      referenceType: (data[i] & 0x80) >>> 7,
      referencedSize: view.getUint32(i) & 0x7FFFFFFF,
      subsegmentDuration: view.getUint32(i + 4),
      startsWithSap: !!(data[i + 8] & 0x80),
      sapType: (data[i + 8] & 0x70) >>> 4,
      sapDeltaTime: view.getUint32(i + 8) & 0x0FFFFFFF
    });
  }

  return result;
};


module.exports = parseSidx;


/***/ }),

/***/ 1489:
/***/ (function(module) {

/**
 * mux.js
 *
 * Copyright (c) Brightcove
 * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
 */
var
  ONE_SECOND_IN_TS = 90000, // 90kHz clock
  secondsToVideoTs,
  secondsToAudioTs,
  videoTsToSeconds,
  audioTsToSeconds,
  audioTsToVideoTs,
  videoTsToAudioTs,
  metadataTsToSeconds;

secondsToVideoTs = function(seconds) {
  return seconds * ONE_SECOND_IN_TS;
};

secondsToAudioTs = function(seconds, sampleRate) {
  return seconds * sampleRate;
};

videoTsToSeconds = function(timestamp) {
  return timestamp / ONE_SECOND_IN_TS;
};

audioTsToSeconds = function(timestamp, sampleRate) {
  return timestamp / sampleRate;
};

audioTsToVideoTs = function(timestamp, sampleRate) {
  return secondsToVideoTs(audioTsToSeconds(timestamp, sampleRate));
};

videoTsToAudioTs = function(timestamp, sampleRate) {
  return secondsToAudioTs(videoTsToSeconds(timestamp), sampleRate);
};

/**
 * Adjust ID3 tag or caption timing information by the timeline pts values
 * (if keepOriginalTimestamps is false) and convert to seconds
 */
metadataTsToSeconds = function(timestamp, timelineStartPts, keepOriginalTimestamps) {
  return videoTsToSeconds(keepOriginalTimestamps ? timestamp : timestamp - timelineStartPts);
};

module.exports = {
  ONE_SECOND_IN_TS: ONE_SECOND_IN_TS,
  secondsToVideoTs: secondsToVideoTs,
  secondsToAudioTs: secondsToAudioTs,
  videoTsToSeconds: videoTsToSeconds,
  audioTsToSeconds: audioTsToSeconds,
  audioTsToVideoTs: audioTsToVideoTs,
  videoTsToAudioTs: videoTsToAudioTs,
  metadataTsToSeconds: metadataTsToSeconds
};


/***/ }),

/***/ 8581:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4816);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4816:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Home; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./styles/Home.module.css
var Home_module = __webpack_require__(214);
var Home_module_default = /*#__PURE__*/__webpack_require__.n(Home_module);
// EXTERNAL MODULE: ./node_modules/video.js/dist/video.es.js
var video_es = __webpack_require__(5215);
// EXTERNAL MODULE: ./node_modules/video.js/dist/video-js.css
var video_js = __webpack_require__(3512);
;// CONCATENATED MODULE: ./components/VideoJS.js




var VideoJS = function(props) {
    var videoRef = react.useRef(null);
    var playerRef = react.useRef(null);
    var options = props.options, onReady = props.onReady;
    react.useEffect(function() {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            var videoElement = videoRef.current;
            if (!videoElement) return;
            var player = playerRef.current = (0,video_es/* default */.Z)(videoElement, options, function() {
                console.log("player is ready");
                onReady && onReady(player);
            });
        } else {
        // you can update player here [update player through props]
        // const player = playerRef.current;
        // player.autoplay(options.autoplay);
        // player.src(options.sources);
        }
    }, [
        onReady,
        options,
        videoRef
    ]);
    // Dispose the Video.js player when the functional component unmounts
    react.useEffect(function() {
        return function() {
            var player = playerRef.current;
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [
        playerRef
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        "data-vjs-player": true,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("video", {
            ref: videoRef,
            className: "video-js vjs-big-play-centered"
        })
    }));
};
/* harmony default export */ var components_VideoJS = (VideoJS);

;// CONCATENATED MODULE: ./pages/index.js




function Home() {
    var playerRef = (0,react.useRef)(null);
    var videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
                type: 'application/x-mpegurl'
            }
        ]
    };
    var handlePlayerReady = function(player) {
        playerRef.current = player;
        // you can handle player events here
        player.on('waiting', function() {
            console.log('player is waiting');
        });
        player.on('dispose', function() {
            console.log('player will dispose');
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: (Home_module_default()).container,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("main", {
            className: (Home_module_default()).main,
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(components_VideoJS, {
                options: videoJsOptions,
                onReady: handlePlayerReady
            })
        })
    }));
};


/***/ }),

/***/ 214:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__bCOhY","main":"Home_main__nLjiQ","footer":"Home_footer____T7K","title":"Home_title__T09hD","description":"Home_description__41Owk","code":"Home_code__suPER","grid":"Home_grid__GxQ85","card":"Home_card___LpL1","logo":"Home_logo__27_tb"};

/***/ }),

/***/ 3512:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 5974:
/***/ (function(module) {

module.exports = SafeParseTuple

function SafeParseTuple(obj, reviver) {
    var json
    var error = null

    try {
        json = JSON.parse(obj, reviver)
    } catch (err) {
        error = err
    }

    return [error, json]
}


/***/ }),

/***/ 9945:
/***/ (function(module) {

// see https://tools.ietf.org/html/rfc1808

(function (root) {
  var URL_REGEX =
    /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/?#]*\/)*[^;?#]*)?(;[^?#]*)?(\?[^#]*)?(#[^]*)?$/;
  var FIRST_SEGMENT_REGEX = /^([^\/?#]*)([^]*)$/;
  var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
  var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g;

  var URLToolkit = {
    // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
    // E.g
    // With opts.alwaysNormalize = false (default, spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
    // With opts.alwaysNormalize = true (not spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
    buildAbsoluteURL: function (baseURL, relativeURL, opts) {
      opts = opts || {};
      // remove any remaining space and CRLF
      baseURL = baseURL.trim();
      relativeURL = relativeURL.trim();
      if (!relativeURL) {
        // 2a) If the embedded URL is entirely empty, it inherits the
        // entire base URL (i.e., is set equal to the base URL)
        // and we are done.
        if (!opts.alwaysNormalize) {
          return baseURL;
        }
        var basePartsForNormalise = URLToolkit.parseURL(baseURL);
        if (!basePartsForNormalise) {
          throw new Error('Error trying to parse base URL.');
        }
        basePartsForNormalise.path = URLToolkit.normalizePath(
          basePartsForNormalise.path
        );
        return URLToolkit.buildURLFromParts(basePartsForNormalise);
      }
      var relativeParts = URLToolkit.parseURL(relativeURL);
      if (!relativeParts) {
        throw new Error('Error trying to parse relative URL.');
      }
      if (relativeParts.scheme) {
        // 2b) If the embedded URL starts with a scheme name, it is
        // interpreted as an absolute URL and we are done.
        if (!opts.alwaysNormalize) {
          return relativeURL;
        }
        relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
        return URLToolkit.buildURLFromParts(relativeParts);
      }
      var baseParts = URLToolkit.parseURL(baseURL);
      if (!baseParts) {
        throw new Error('Error trying to parse base URL.');
      }
      if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
        // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
        // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
        var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
        baseParts.netLoc = pathParts[1];
        baseParts.path = pathParts[2];
      }
      if (baseParts.netLoc && !baseParts.path) {
        baseParts.path = '/';
      }
      var builtParts = {
        // 2c) Otherwise, the embedded URL inherits the scheme of
        // the base URL.
        scheme: baseParts.scheme,
        netLoc: relativeParts.netLoc,
        path: null,
        params: relativeParts.params,
        query: relativeParts.query,
        fragment: relativeParts.fragment,
      };
      if (!relativeParts.netLoc) {
        // 3) If the embedded URL's <net_loc> is non-empty, we skip to
        // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
        // (if any) of the base URL.
        builtParts.netLoc = baseParts.netLoc;
        // 4) If the embedded URL path is preceded by a slash "/", the
        // path is not relative and we skip to Step 7.
        if (relativeParts.path[0] !== '/') {
          if (!relativeParts.path) {
            // 5) If the embedded URL path is empty (and not preceded by a
            // slash), then the embedded URL inherits the base URL path
            builtParts.path = baseParts.path;
            // 5a) if the embedded URL's <params> is non-empty, we skip to
            // step 7; otherwise, it inherits the <params> of the base
            // URL (if any) and
            if (!relativeParts.params) {
              builtParts.params = baseParts.params;
              // 5b) if the embedded URL's <query> is non-empty, we skip to
              // step 7; otherwise, it inherits the <query> of the base
              // URL (if any) and we skip to step 7.
              if (!relativeParts.query) {
                builtParts.query = baseParts.query;
              }
            }
          } else {
            // 6) The last segment of the base URL's path (anything
            // following the rightmost slash "/", or the entire path if no
            // slash is present) is removed and the embedded URL's path is
            // appended in its place.
            var baseURLPath = baseParts.path;
            var newPath =
              baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) +
              relativeParts.path;
            builtParts.path = URLToolkit.normalizePath(newPath);
          }
        }
      }
      if (builtParts.path === null) {
        builtParts.path = opts.alwaysNormalize
          ? URLToolkit.normalizePath(relativeParts.path)
          : relativeParts.path;
      }
      return URLToolkit.buildURLFromParts(builtParts);
    },
    parseURL: function (url) {
      var parts = URL_REGEX.exec(url);
      if (!parts) {
        return null;
      }
      return {
        scheme: parts[1] || '',
        netLoc: parts[2] || '',
        path: parts[3] || '',
        params: parts[4] || '',
        query: parts[5] || '',
        fragment: parts[6] || '',
      };
    },
    normalizePath: function (path) {
      // The following operations are
      // then applied, in order, to the new path:
      // 6a) All occurrences of "./", where "." is a complete path
      // segment, are removed.
      // 6b) If the path ends with "." as a complete path segment,
      // that "." is removed.
      path = path.split('').reverse().join('').replace(SLASH_DOT_REGEX, '');
      // 6c) All occurrences of "<segment>/../", where <segment> is a
      // complete path segment not equal to "..", are removed.
      // Removal of these path segments is performed iteratively,
      // removing the leftmost matching pattern on each iteration,
      // until no matching pattern remains.
      // 6d) If the path ends with "<segment>/..", where <segment> is a
      // complete path segment not equal to "..", that
      // "<segment>/.." is removed.
      while (
        path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length
      ) {}
      return path.split('').reverse().join('');
    },
    buildURLFromParts: function (parts) {
      return (
        parts.scheme +
        parts.netLoc +
        parts.path +
        parts.params +
        parts.query +
        parts.fragment
      );
    },
  };

  if (true)
    module.exports = URLToolkit;
  else {}
})(this);


/***/ }),

/***/ 3407:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Default exports for Node. Export the extended versions of VTTCue and
// VTTRegion in Node since we likely want the capability to convert back and
// forth between JSON. If we don't then it's not that big of a deal since we're
// off browser.

var window = __webpack_require__(8908);

var vttjs = module.exports = {
  WebVTT: __webpack_require__(3706),
  VTTCue: __webpack_require__(2230),
  VTTRegion: __webpack_require__(3710)
};

window.vttjs = vttjs;
window.WebVTT = vttjs.WebVTT;

var cueShim = vttjs.VTTCue;
var regionShim = vttjs.VTTRegion;
var nativeVTTCue = window.VTTCue;
var nativeVTTRegion = window.VTTRegion;

vttjs.shim = function() {
  window.VTTCue = cueShim;
  window.VTTRegion = regionShim;
};

vttjs.restore = function() {
  window.VTTCue = nativeVTTCue;
  window.VTTRegion = nativeVTTRegion;
};

if (!window.VTTCue) {
  vttjs.shim();
}


/***/ }),

/***/ 3706:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
var document = __webpack_require__(9144);

var _objCreate = Object.create || (function() {
  function F() {}
  return function(o) {
    if (arguments.length !== 1) {
      throw new Error('Object.create shim only accepts one parameter.');
    }
    F.prototype = o;
    return new F();
  };
})();

// Creates a new ParserError object from an errorData object. The errorData
// object should have default code and message properties. The default message
// property can be overriden by passing in a message parameter.
// See ParsingError.Errors below for acceptable errors.
function ParsingError(errorData, message) {
  this.name = "ParsingError";
  this.code = errorData.code;
  this.message = message || errorData.message;
}
ParsingError.prototype = _objCreate(Error.prototype);
ParsingError.prototype.constructor = ParsingError;

// ParsingError metadata for acceptable ParsingErrors.
ParsingError.Errors = {
  BadSignature: {
    code: 0,
    message: "Malformed WebVTT signature."
  },
  BadTimeStamp: {
    code: 1,
    message: "Malformed time stamp."
  }
};

// Try to parse input as a time stamp.
function parseTimeStamp(input) {

  function computeSeconds(h, m, s, f) {
    return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
  }

  var m = input.match(/^(\d+):(\d{1,2})(:\d{1,2})?\.(\d{3})/);
  if (!m) {
    return null;
  }

  if (m[3]) {
    // Timestamp takes the form of [hours]:[minutes]:[seconds].[milliseconds]
    return computeSeconds(m[1], m[2], m[3].replace(":", ""), m[4]);
  } else if (m[1] > 59) {
    // Timestamp takes the form of [hours]:[minutes].[milliseconds]
    // First position is hours as it's over 59.
    return computeSeconds(m[1], m[2], 0,  m[4]);
  } else {
    // Timestamp takes the form of [minutes]:[seconds].[milliseconds]
    return computeSeconds(0, m[1], m[2], m[4]);
  }
}

// A settings object holds key/value pairs and will ignore anything but the first
// assignment to a specific key.
function Settings() {
  this.values = _objCreate(null);
}

Settings.prototype = {
  // Only accept the first assignment to any key.
  set: function(k, v) {
    if (!this.get(k) && v !== "") {
      this.values[k] = v;
    }
  },
  // Return the value for a key, or a default value.
  // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
  // a number of possible default values as properties where 'defaultKey' is
  // the key of the property that will be chosen; otherwise it's assumed to be
  // a single value.
  get: function(k, dflt, defaultKey) {
    if (defaultKey) {
      return this.has(k) ? this.values[k] : dflt[defaultKey];
    }
    return this.has(k) ? this.values[k] : dflt;
  },
  // Check whether we have a value for a key.
  has: function(k) {
    return k in this.values;
  },
  // Accept a setting if its one of the given alternatives.
  alt: function(k, v, a) {
    for (var n = 0; n < a.length; ++n) {
      if (v === a[n]) {
        this.set(k, v);
        break;
      }
    }
  },
  // Accept a setting if its a valid (signed) integer.
  integer: function(k, v) {
    if (/^-?\d+$/.test(v)) { // integer
      this.set(k, parseInt(v, 10));
    }
  },
  // Accept a setting if its a valid percentage.
  percent: function(k, v) {
    var m;
    if ((m = v.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
      v = parseFloat(v);
      if (v >= 0 && v <= 100) {
        this.set(k, v);
        return true;
      }
    }
    return false;
  }
};

// Helper function to parse input into groups separated by 'groupDelim', and
// interprete each group as a key/value pair separated by 'keyValueDelim'.
function parseOptions(input, callback, keyValueDelim, groupDelim) {
  var groups = groupDelim ? input.split(groupDelim) : [input];
  for (var i in groups) {
    if (typeof groups[i] !== "string") {
      continue;
    }
    var kv = groups[i].split(keyValueDelim);
    if (kv.length !== 2) {
      continue;
    }
    var k = kv[0];
    var v = kv[1];
    callback(k, v);
  }
}

function parseCue(input, cue, regionList) {
  // Remember the original input if we need to throw an error.
  var oInput = input;
  // 4.1 WebVTT timestamp
  function consumeTimeStamp() {
    var ts = parseTimeStamp(input);
    if (ts === null) {
      throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                            "Malformed timestamp: " + oInput);
    }
    // Remove time stamp from input.
    input = input.replace(/^[^\sa-zA-Z-]+/, "");
    return ts;
  }

  // 4.4.2 WebVTT cue settings
  function consumeCueSettings(input, cue) {
    var settings = new Settings();

    parseOptions(input, function (k, v) {
      switch (k) {
      case "region":
        // Find the last region we parsed with the same region id.
        for (var i = regionList.length - 1; i >= 0; i--) {
          if (regionList[i].id === v) {
            settings.set(k, regionList[i].region);
            break;
          }
        }
        break;
      case "vertical":
        settings.alt(k, v, ["rl", "lr"]);
        break;
      case "line":
        var vals = v.split(","),
            vals0 = vals[0];
        settings.integer(k, vals0);
        settings.percent(k, vals0) ? settings.set("snapToLines", false) : null;
        settings.alt(k, vals0, ["auto"]);
        if (vals.length === 2) {
          settings.alt("lineAlign", vals[1], ["start", "center", "end"]);
        }
        break;
      case "position":
        vals = v.split(",");
        settings.percent(k, vals[0]);
        if (vals.length === 2) {
          settings.alt("positionAlign", vals[1], ["start", "center", "end"]);
        }
        break;
      case "size":
        settings.percent(k, v);
        break;
      case "align":
        settings.alt(k, v, ["start", "center", "end", "left", "right"]);
        break;
      }
    }, /:/, /\s/);

    // Apply default values for any missing fields.
    cue.region = settings.get("region", null);
    cue.vertical = settings.get("vertical", "");
    try {
      cue.line = settings.get("line", "auto");
    } catch (e) {}
    cue.lineAlign = settings.get("lineAlign", "start");
    cue.snapToLines = settings.get("snapToLines", true);
    cue.size = settings.get("size", 100);
    // Safari still uses the old middle value and won't accept center
    try {
      cue.align = settings.get("align", "center");
    } catch (e) {
      cue.align = settings.get("align", "middle");
    }
    try {
      cue.position = settings.get("position", "auto");
    } catch (e) {
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
  }

  function skipWhitespace() {
    input = input.replace(/^\s+/, "");
  }

  // 4.1 WebVTT cue timings.
  skipWhitespace();
  cue.startTime = consumeTimeStamp();   // (1) collect cue start time
  skipWhitespace();
  if (input.substr(0, 3) !== "-->") {     // (3) next characters must match "-->"
    throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                           "Malformed time stamp (time stamps must be separated by '-->'): " +
                           oInput);
  }
  input = input.substr(3);
  skipWhitespace();
  cue.endTime = consumeTimeStamp();     // (5) collect cue end time

  // 4.1 WebVTT cue settings list.
  skipWhitespace();
  consumeCueSettings(input, cue);
}

// When evaluating this file as part of a Webpack bundle for server
// side rendering, `document` is an empty object.
var TEXTAREA_ELEMENT = document.createElement && document.createElement("textarea");

var TAG_NAME = {
  c: "span",
  i: "i",
  b: "b",
  u: "u",
  ruby: "ruby",
  rt: "rt",
  v: "span",
  lang: "span"
};

// 5.1 default text color
// 5.2 default text background color is equivalent to text color with bg_ prefix
var DEFAULT_COLOR_CLASS = {
  white: 'rgba(255,255,255,1)',
  lime: 'rgba(0,255,0,1)',
  cyan: 'rgba(0,255,255,1)',
  red: 'rgba(255,0,0,1)',
  yellow: 'rgba(255,255,0,1)',
  magenta: 'rgba(255,0,255,1)',
  blue: 'rgba(0,0,255,1)',
  black: 'rgba(0,0,0,1)'
};

var TAG_ANNOTATION = {
  v: "title",
  lang: "lang"
};

var NEEDS_PARENT = {
  rt: "ruby"
};

// Parse content into a document fragment.
function parseContent(window, input) {
  function nextToken() {
    // Check for end-of-string.
    if (!input) {
      return null;
    }

    // Consume 'n' characters from the input.
    function consume(result) {
      input = input.substr(result.length);
      return result;
    }

    var m = input.match(/^([^<]*)(<[^>]*>?)?/);
    // If there is some text before the next tag, return it, otherwise return
    // the tag.
    return consume(m[1] ? m[1] : m[2]);
  }

  function unescape(s) {
    TEXTAREA_ELEMENT.innerHTML = s;
    s = TEXTAREA_ELEMENT.textContent;
    TEXTAREA_ELEMENT.textContent = "";
    return s;
  }

  function shouldAdd(current, element) {
    return !NEEDS_PARENT[element.localName] ||
           NEEDS_PARENT[element.localName] === current.localName;
  }

  // Create an element for this tag.
  function createElement(type, annotation) {
    var tagName = TAG_NAME[type];
    if (!tagName) {
      return null;
    }
    var element = window.document.createElement(tagName);
    var name = TAG_ANNOTATION[type];
    if (name && annotation) {
      element[name] = annotation.trim();
    }
    return element;
  }

  var rootDiv = window.document.createElement("div"),
      current = rootDiv,
      t,
      tagStack = [];

  while ((t = nextToken()) !== null) {
    if (t[0] === '<') {
      if (t[1] === "/") {
        // If the closing tag matches, move back up to the parent node.
        if (tagStack.length &&
            tagStack[tagStack.length - 1] === t.substr(2).replace(">", "")) {
          tagStack.pop();
          current = current.parentNode;
        }
        // Otherwise just ignore the end tag.
        continue;
      }
      var ts = parseTimeStamp(t.substr(1, t.length - 2));
      var node;
      if (ts) {
        // Timestamps are lead nodes as well.
        node = window.document.createProcessingInstruction("timestamp", ts);
        current.appendChild(node);
        continue;
      }
      var m = t.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
      // If we can't parse the tag, skip to the next tag.
      if (!m) {
        continue;
      }
      // Try to construct an element, and ignore the tag if we couldn't.
      node = createElement(m[1], m[3]);
      if (!node) {
        continue;
      }
      // Determine if the tag should be added based on the context of where it
      // is placed in the cuetext.
      if (!shouldAdd(current, node)) {
        continue;
      }
      // Set the class list (as a list of classes, separated by space).
      if (m[2]) {
        var classes = m[2].split('.');

        classes.forEach(function(cl) {
          var bgColor = /^bg_/.test(cl);
          // slice out `bg_` if it's a background color
          var colorName = bgColor ? cl.slice(3) : cl;

          if (DEFAULT_COLOR_CLASS.hasOwnProperty(colorName)) {
            var propName = bgColor ? 'background-color' : 'color';
            var propValue = DEFAULT_COLOR_CLASS[colorName];

            node.style[propName] = propValue;
          }
        });

        node.className = classes.join(' ');
      }
      // Append the node to the current node, and enter the scope of the new
      // node.
      tagStack.push(m[1]);
      current.appendChild(node);
      current = node;
      continue;
    }

    // Text nodes are leaf nodes.
    current.appendChild(window.document.createTextNode(unescape(t)));
  }

  return rootDiv;
}

// This is a list of all the Unicode characters that have a strong
// right-to-left category. What this means is that these characters are
// written right-to-left for sure. It was generated by pulling all the strong
// right-to-left characters out of the Unicode data table. That table can
// found at: http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
var strongRTLRanges = [[0x5be, 0x5be], [0x5c0, 0x5c0], [0x5c3, 0x5c3], [0x5c6, 0x5c6],
 [0x5d0, 0x5ea], [0x5f0, 0x5f4], [0x608, 0x608], [0x60b, 0x60b], [0x60d, 0x60d],
 [0x61b, 0x61b], [0x61e, 0x64a], [0x66d, 0x66f], [0x671, 0x6d5], [0x6e5, 0x6e6],
 [0x6ee, 0x6ef], [0x6fa, 0x70d], [0x70f, 0x710], [0x712, 0x72f], [0x74d, 0x7a5],
 [0x7b1, 0x7b1], [0x7c0, 0x7ea], [0x7f4, 0x7f5], [0x7fa, 0x7fa], [0x800, 0x815],
 [0x81a, 0x81a], [0x824, 0x824], [0x828, 0x828], [0x830, 0x83e], [0x840, 0x858],
 [0x85e, 0x85e], [0x8a0, 0x8a0], [0x8a2, 0x8ac], [0x200f, 0x200f],
 [0xfb1d, 0xfb1d], [0xfb1f, 0xfb28], [0xfb2a, 0xfb36], [0xfb38, 0xfb3c],
 [0xfb3e, 0xfb3e], [0xfb40, 0xfb41], [0xfb43, 0xfb44], [0xfb46, 0xfbc1],
 [0xfbd3, 0xfd3d], [0xfd50, 0xfd8f], [0xfd92, 0xfdc7], [0xfdf0, 0xfdfc],
 [0xfe70, 0xfe74], [0xfe76, 0xfefc], [0x10800, 0x10805], [0x10808, 0x10808],
 [0x1080a, 0x10835], [0x10837, 0x10838], [0x1083c, 0x1083c], [0x1083f, 0x10855],
 [0x10857, 0x1085f], [0x10900, 0x1091b], [0x10920, 0x10939], [0x1093f, 0x1093f],
 [0x10980, 0x109b7], [0x109be, 0x109bf], [0x10a00, 0x10a00], [0x10a10, 0x10a13],
 [0x10a15, 0x10a17], [0x10a19, 0x10a33], [0x10a40, 0x10a47], [0x10a50, 0x10a58],
 [0x10a60, 0x10a7f], [0x10b00, 0x10b35], [0x10b40, 0x10b55], [0x10b58, 0x10b72],
 [0x10b78, 0x10b7f], [0x10c00, 0x10c48], [0x1ee00, 0x1ee03], [0x1ee05, 0x1ee1f],
 [0x1ee21, 0x1ee22], [0x1ee24, 0x1ee24], [0x1ee27, 0x1ee27], [0x1ee29, 0x1ee32],
 [0x1ee34, 0x1ee37], [0x1ee39, 0x1ee39], [0x1ee3b, 0x1ee3b], [0x1ee42, 0x1ee42],
 [0x1ee47, 0x1ee47], [0x1ee49, 0x1ee49], [0x1ee4b, 0x1ee4b], [0x1ee4d, 0x1ee4f],
 [0x1ee51, 0x1ee52], [0x1ee54, 0x1ee54], [0x1ee57, 0x1ee57], [0x1ee59, 0x1ee59],
 [0x1ee5b, 0x1ee5b], [0x1ee5d, 0x1ee5d], [0x1ee5f, 0x1ee5f], [0x1ee61, 0x1ee62],
 [0x1ee64, 0x1ee64], [0x1ee67, 0x1ee6a], [0x1ee6c, 0x1ee72], [0x1ee74, 0x1ee77],
 [0x1ee79, 0x1ee7c], [0x1ee7e, 0x1ee7e], [0x1ee80, 0x1ee89], [0x1ee8b, 0x1ee9b],
 [0x1eea1, 0x1eea3], [0x1eea5, 0x1eea9], [0x1eeab, 0x1eebb], [0x10fffd, 0x10fffd]];

function isStrongRTLChar(charCode) {
  for (var i = 0; i < strongRTLRanges.length; i++) {
    var currentRange = strongRTLRanges[i];
    if (charCode >= currentRange[0] && charCode <= currentRange[1]) {
      return true;
    }
  }

  return false;
}

function determineBidi(cueDiv) {
  var nodeStack = [],
      text = "",
      charCode;

  if (!cueDiv || !cueDiv.childNodes) {
    return "ltr";
  }

  function pushNodes(nodeStack, node) {
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      nodeStack.push(node.childNodes[i]);
    }
  }

  function nextTextNode(nodeStack) {
    if (!nodeStack || !nodeStack.length) {
      return null;
    }

    var node = nodeStack.pop(),
        text = node.textContent || node.innerText;
    if (text) {
      // TODO: This should match all unicode type B characters (paragraph
      // separator characters). See issue #115.
      var m = text.match(/^.*(\n|\r)/);
      if (m) {
        nodeStack.length = 0;
        return m[0];
      }
      return text;
    }
    if (node.tagName === "ruby") {
      return nextTextNode(nodeStack);
    }
    if (node.childNodes) {
      pushNodes(nodeStack, node);
      return nextTextNode(nodeStack);
    }
  }

  pushNodes(nodeStack, cueDiv);
  while ((text = nextTextNode(nodeStack))) {
    for (var i = 0; i < text.length; i++) {
      charCode = text.charCodeAt(i);
      if (isStrongRTLChar(charCode)) {
        return "rtl";
      }
    }
  }
  return "ltr";
}

function computeLinePos(cue) {
  if (typeof cue.line === "number" &&
      (cue.snapToLines || (cue.line >= 0 && cue.line <= 100))) {
    return cue.line;
  }
  if (!cue.track || !cue.track.textTrackList ||
      !cue.track.textTrackList.mediaElement) {
    return -1;
  }
  var track = cue.track,
      trackList = track.textTrackList,
      count = 0;
  for (var i = 0; i < trackList.length && trackList[i] !== track; i++) {
    if (trackList[i].mode === "showing") {
      count++;
    }
  }
  return ++count * -1;
}

function StyleBox() {
}

// Apply styles to a div. If there is no div passed then it defaults to the
// div on 'this'.
StyleBox.prototype.applyStyles = function(styles, div) {
  div = div || this.div;
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      div.style[prop] = styles[prop];
    }
  }
};

StyleBox.prototype.formatStyle = function(val, unit) {
  return val === 0 ? 0 : val + unit;
};

// Constructs the computed display state of the cue (a div). Places the div
// into the overlay which should be a block level element (usually a div).
function CueStyleBox(window, cue, styleOptions) {
  StyleBox.call(this);
  this.cue = cue;

  // Parse our cue's text into a DOM tree rooted at 'cueDiv'. This div will
  // have inline positioning and will function as the cue background box.
  this.cueDiv = parseContent(window, cue.text);
  var styles = {
    color: "rgba(255, 255, 255, 1)",
    backgroundColor:  "rgba(0, 0, 0, 0.8)",
    position: "relative",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "inline",
    writingMode: cue.vertical === "" ? "horizontal-tb"
                                     : cue.vertical === "lr" ? "vertical-lr"
                                                             : "vertical-rl",
    unicodeBidi: "plaintext"
  };

  this.applyStyles(styles, this.cueDiv);

  // Create an absolutely positioned div that will be used to position the cue
  // div. Note, all WebVTT cue-setting alignments are equivalent to the CSS
  // mirrors of them except middle instead of center on Safari.
  this.div = window.document.createElement("div");
  styles = {
    direction: determineBidi(this.cueDiv),
    writingMode: cue.vertical === "" ? "horizontal-tb"
                                     : cue.vertical === "lr" ? "vertical-lr"
                                                             : "vertical-rl",
    unicodeBidi: "plaintext",
    textAlign: cue.align === "middle" ? "center" : cue.align,
    font: styleOptions.font,
    whiteSpace: "pre-line",
    position: "absolute"
  };

  this.applyStyles(styles);
  this.div.appendChild(this.cueDiv);

  // Calculate the distance from the reference edge of the viewport to the text
  // position of the cue box. The reference edge will be resolved later when
  // the box orientation styles are applied.
  var textPos = 0;
  switch (cue.positionAlign) {
  case "start":
    textPos = cue.position;
    break;
  case "center":
    textPos = cue.position - (cue.size / 2);
    break;
  case "end":
    textPos = cue.position - cue.size;
    break;
  }

  // Horizontal box orientation; textPos is the distance from the left edge of the
  // area to the left edge of the box and cue.size is the distance extending to
  // the right from there.
  if (cue.vertical === "") {
    this.applyStyles({
      left:  this.formatStyle(textPos, "%"),
      width: this.formatStyle(cue.size, "%")
    });
  // Vertical box orientation; textPos is the distance from the top edge of the
  // area to the top edge of the box and cue.size is the height extending
  // downwards from there.
  } else {
    this.applyStyles({
      top: this.formatStyle(textPos, "%"),
      height: this.formatStyle(cue.size, "%")
    });
  }

  this.move = function(box) {
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
CueStyleBox.prototype = _objCreate(StyleBox.prototype);
CueStyleBox.prototype.constructor = CueStyleBox;

// Represents the co-ordinates of an Element in a way that we can easily
// compute things with such as if it overlaps or intersects with another Element.
// Can initialize it with either a StyleBox or another BoxPosition.
function BoxPosition(obj) {
  // Either a BoxPosition was passed in and we need to copy it, or a StyleBox
  // was passed in and we need to copy the results of 'getBoundingClientRect'
  // as the object returned is readonly. All co-ordinate values are in reference
  // to the viewport origin (top left).
  var lh, height, width, top;
  if (obj.div) {
    height = obj.div.offsetHeight;
    width = obj.div.offsetWidth;
    top = obj.div.offsetTop;

    var rects = (rects = obj.div.childNodes) && (rects = rects[0]) &&
                rects.getClientRects && rects.getClientRects();
    obj = obj.div.getBoundingClientRect();
    // In certain cases the outter div will be slightly larger then the sum of
    // the inner div's lines. This could be due to bold text, etc, on some platforms.
    // In this case we should get the average line height and use that. This will
    // result in the desired behaviour.
    lh = rects ? Math.max((rects[0] && rects[0].height) || 0, obj.height / rects.length)
               : 0;

  }
  this.left = obj.left;
  this.right = obj.right;
  this.top = obj.top || top;
  this.height = obj.height || height;
  this.bottom = obj.bottom || (top + (obj.height || height));
  this.width = obj.width || width;
  this.lineHeight = lh !== undefined ? lh : obj.lineHeight;
}

// Move the box along a particular axis. Optionally pass in an amount to move
// the box. If no amount is passed then the default is the line height of the
// box.
BoxPosition.prototype.move = function(axis, toMove) {
  toMove = toMove !== undefined ? toMove : this.lineHeight;
  switch (axis) {
  case "+x":
    this.left += toMove;
    this.right += toMove;
    break;
  case "-x":
    this.left -= toMove;
    this.right -= toMove;
    break;
  case "+y":
    this.top += toMove;
    this.bottom += toMove;
    break;
  case "-y":
    this.top -= toMove;
    this.bottom -= toMove;
    break;
  }
};

// Check if this box overlaps another box, b2.
BoxPosition.prototype.overlaps = function(b2) {
  return this.left < b2.right &&
         this.right > b2.left &&
         this.top < b2.bottom &&
         this.bottom > b2.top;
};

// Check if this box overlaps any other boxes in boxes.
BoxPosition.prototype.overlapsAny = function(boxes) {
  for (var i = 0; i < boxes.length; i++) {
    if (this.overlaps(boxes[i])) {
      return true;
    }
  }
  return false;
};

// Check if this box is within another box.
BoxPosition.prototype.within = function(container) {
  return this.top >= container.top &&
         this.bottom <= container.bottom &&
         this.left >= container.left &&
         this.right <= container.right;
};

// Check if this box is entirely within the container or it is overlapping
// on the edge opposite of the axis direction passed. For example, if "+x" is
// passed and the box is overlapping on the left edge of the container, then
// return true.
BoxPosition.prototype.overlapsOppositeAxis = function(container, axis) {
  switch (axis) {
  case "+x":
    return this.left < container.left;
  case "-x":
    return this.right > container.right;
  case "+y":
    return this.top < container.top;
  case "-y":
    return this.bottom > container.bottom;
  }
};

// Find the percentage of the area that this box is overlapping with another
// box.
BoxPosition.prototype.intersectPercentage = function(b2) {
  var x = Math.max(0, Math.min(this.right, b2.right) - Math.max(this.left, b2.left)),
      y = Math.max(0, Math.min(this.bottom, b2.bottom) - Math.max(this.top, b2.top)),
      intersectArea = x * y;
  return intersectArea / (this.height * this.width);
};

// Convert the positions from this box to CSS compatible positions using
// the reference container's positions. This has to be done because this
// box's positions are in reference to the viewport origin, whereas, CSS
// values are in referecne to their respective edges.
BoxPosition.prototype.toCSSCompatValues = function(reference) {
  return {
    top: this.top - reference.top,
    bottom: reference.bottom - this.bottom,
    left: this.left - reference.left,
    right: reference.right - this.right,
    height: this.height,
    width: this.width
  };
};

// Get an object that represents the box's position without anything extra.
// Can pass a StyleBox, HTMLElement, or another BoxPositon.
BoxPosition.getSimpleBoxPosition = function(obj) {
  var height = obj.div ? obj.div.offsetHeight : obj.tagName ? obj.offsetHeight : 0;
  var width = obj.div ? obj.div.offsetWidth : obj.tagName ? obj.offsetWidth : 0;
  var top = obj.div ? obj.div.offsetTop : obj.tagName ? obj.offsetTop : 0;

  obj = obj.div ? obj.div.getBoundingClientRect() :
                obj.tagName ? obj.getBoundingClientRect() : obj;
  var ret = {
    left: obj.left,
    right: obj.right,
    top: obj.top || top,
    height: obj.height || height,
    bottom: obj.bottom || (top + (obj.height || height)),
    width: obj.width || width
  };
  return ret;
};

// Move a StyleBox to its specified, or next best, position. The containerBox
// is the box that contains the StyleBox, such as a div. boxPositions are
// a list of other boxes that the styleBox can't overlap with.
function moveBoxToLinePosition(window, styleBox, containerBox, boxPositions) {

  // Find the best position for a cue box, b, on the video. The axis parameter
  // is a list of axis, the order of which, it will move the box along. For example:
  // Passing ["+x", "-x"] will move the box first along the x axis in the positive
  // direction. If it doesn't find a good position for it there it will then move
  // it along the x axis in the negative direction.
  function findBestPosition(b, axis) {
    var bestPosition,
        specifiedPosition = new BoxPosition(b),
        percentage = 1; // Highest possible so the first thing we get is better.

    for (var i = 0; i < axis.length; i++) {
      while (b.overlapsOppositeAxis(containerBox, axis[i]) ||
             (b.within(containerBox) && b.overlapsAny(boxPositions))) {
        b.move(axis[i]);
      }
      // We found a spot where we aren't overlapping anything. This is our
      // best position.
      if (b.within(containerBox)) {
        return b;
      }
      var p = b.intersectPercentage(containerBox);
      // If we're outside the container box less then we were on our last try
      // then remember this position as the best position.
      if (percentage > p) {
        bestPosition = new BoxPosition(b);
        percentage = p;
      }
      // Reset the box position to the specified position.
      b = new BoxPosition(specifiedPosition);
    }
    return bestPosition || specifiedPosition;
  }

  var boxPosition = new BoxPosition(styleBox),
      cue = styleBox.cue,
      linePos = computeLinePos(cue),
      axis = [];

  // If we have a line number to align the cue to.
  if (cue.snapToLines) {
    var size;
    switch (cue.vertical) {
    case "":
      axis = [ "+y", "-y" ];
      size = "height";
      break;
    case "rl":
      axis = [ "+x", "-x" ];
      size = "width";
      break;
    case "lr":
      axis = [ "-x", "+x" ];
      size = "width";
      break;
    }

    var step = boxPosition.lineHeight,
        position = step * Math.round(linePos),
        maxPosition = containerBox[size] + step,
        initialAxis = axis[0];

    // If the specified intial position is greater then the max position then
    // clamp the box to the amount of steps it would take for the box to
    // reach the max position.
    if (Math.abs(position) > maxPosition) {
      position = position < 0 ? -1 : 1;
      position *= Math.ceil(maxPosition / step) * step;
    }

    // If computed line position returns negative then line numbers are
    // relative to the bottom of the video instead of the top. Therefore, we
    // need to increase our initial position by the length or width of the
    // video, depending on the writing direction, and reverse our axis directions.
    if (linePos < 0) {
      position += cue.vertical === "" ? containerBox.height : containerBox.width;
      axis = axis.reverse();
    }

    // Move the box to the specified position. This may not be its best
    // position.
    boxPosition.move(initialAxis, position);

  } else {
    // If we have a percentage line value for the cue.
    var calculatedPercentage = (boxPosition.lineHeight / containerBox.height) * 100;

    switch (cue.lineAlign) {
    case "center":
      linePos -= (calculatedPercentage / 2);
      break;
    case "end":
      linePos -= calculatedPercentage;
      break;
    }

    // Apply initial line position to the cue box.
    switch (cue.vertical) {
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
      break;
    }

    axis = [ "+y", "-x", "+x", "-y" ];

    // Get the box position again after we've applied the specified positioning
    // to it.
    boxPosition = new BoxPosition(styleBox);
  }

  var bestPosition = findBestPosition(boxPosition, axis);
  styleBox.move(bestPosition.toCSSCompatValues(containerBox));
}

function WebVTT() {
  // Nothing
}

// Helper to allow strings to be decoded instead of the default binary utf8 data.
WebVTT.StringDecoder = function() {
  return {
    decode: function(data) {
      if (!data) {
        return "";
      }
      if (typeof data !== "string") {
        throw new Error("Error - expected string data.");
      }
      return decodeURIComponent(encodeURIComponent(data));
    }
  };
};

WebVTT.convertCueToDOMTree = function(window, cuetext) {
  if (!window || !cuetext) {
    return null;
  }
  return parseContent(window, cuetext);
};

var FONT_SIZE_PERCENT = 0.05;
var FONT_STYLE = "sans-serif";
var CUE_BACKGROUND_PADDING = "1.5%";

// Runs the processing model over the cues and regions passed to it.
// @param overlay A block level element (usually a div) that the computed cues
//                and regions will be placed into.
WebVTT.processCues = function(window, cues, overlay) {
  if (!window || !cues || !overlay) {
    return null;
  }

  // Remove all previous children.
  while (overlay.firstChild) {
    overlay.removeChild(overlay.firstChild);
  }

  var paddedOverlay = window.document.createElement("div");
  paddedOverlay.style.position = "absolute";
  paddedOverlay.style.left = "0";
  paddedOverlay.style.right = "0";
  paddedOverlay.style.top = "0";
  paddedOverlay.style.bottom = "0";
  paddedOverlay.style.margin = CUE_BACKGROUND_PADDING;
  overlay.appendChild(paddedOverlay);

  // Determine if we need to compute the display states of the cues. This could
  // be the case if a cue's state has been changed since the last computation or
  // if it has not been computed yet.
  function shouldCompute(cues) {
    for (var i = 0; i < cues.length; i++) {
      if (cues[i].hasBeenReset || !cues[i].displayState) {
        return true;
      }
    }
    return false;
  }

  // We don't need to recompute the cues' display states. Just reuse them.
  if (!shouldCompute(cues)) {
    for (var i = 0; i < cues.length; i++) {
      paddedOverlay.appendChild(cues[i].displayState);
    }
    return;
  }

  var boxPositions = [],
      containerBox = BoxPosition.getSimpleBoxPosition(paddedOverlay),
      fontSize = Math.round(containerBox.height * FONT_SIZE_PERCENT * 100) / 100;
  var styleOptions = {
    font: fontSize + "px " + FONT_STYLE
  };

  (function() {
    var styleBox, cue;

    for (var i = 0; i < cues.length; i++) {
      cue = cues[i];

      // Compute the intial position and styles of the cue div.
      styleBox = new CueStyleBox(window, cue, styleOptions);
      paddedOverlay.appendChild(styleBox.div);

      // Move the cue div to it's correct line position.
      moveBoxToLinePosition(window, styleBox, containerBox, boxPositions);

      // Remember the computed div so that we don't have to recompute it later
      // if we don't have too.
      cue.displayState = styleBox.div;

      boxPositions.push(BoxPosition.getSimpleBoxPosition(styleBox));
    }
  })();
};

WebVTT.Parser = function(window, vttjs, decoder) {
  if (!decoder) {
    decoder = vttjs;
    vttjs = {};
  }
  if (!vttjs) {
    vttjs = {};
  }

  this.window = window;
  this.vttjs = vttjs;
  this.state = "INITIAL";
  this.buffer = "";
  this.decoder = decoder || new TextDecoder("utf8");
  this.regionList = [];
};

WebVTT.Parser.prototype = {
  // If the error is a ParsingError then report it to the consumer if
  // possible. If it's not a ParsingError then throw it like normal.
  reportOrThrowError: function(e) {
    if (e instanceof ParsingError) {
      this.onparsingerror && this.onparsingerror(e);
    } else {
      throw e;
    }
  },
  parse: function (data) {
    var self = this;

    // If there is no data then we won't decode it, but will just try to parse
    // whatever is in buffer already. This may occur in circumstances, for
    // example when flush() is called.
    if (data) {
      // Try to decode the data that we received.
      self.buffer += self.decoder.decode(data, {stream: true});
    }

    function collectNextLine() {
      var buffer = self.buffer;
      var pos = 0;
      while (pos < buffer.length && buffer[pos] !== '\r' && buffer[pos] !== '\n') {
        ++pos;
      }
      var line = buffer.substr(0, pos);
      // Advance the buffer early in case we fail below.
      if (buffer[pos] === '\r') {
        ++pos;
      }
      if (buffer[pos] === '\n') {
        ++pos;
      }
      self.buffer = buffer.substr(pos);
      return line;
    }

    // 3.4 WebVTT region and WebVTT region settings syntax
    function parseRegion(input) {
      var settings = new Settings();

      parseOptions(input, function (k, v) {
        switch (k) {
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
          var xy = v.split(',');
          if (xy.length !== 2) {
            break;
          }
          // We have to make sure both x and y parse, so use a temporary
          // settings object here.
          var anchor = new Settings();
          anchor.percent("x", xy[0]);
          anchor.percent("y", xy[1]);
          if (!anchor.has("x") || !anchor.has("y")) {
            break;
          }
          settings.set(k + "X", anchor.get("x"));
          settings.set(k + "Y", anchor.get("y"));
          break;
        case "scroll":
          settings.alt(k, v, ["up"]);
          break;
        }
      }, /=/, /\s/);

      // Create the region, using default values for any values that were not
      // specified.
      if (settings.has("id")) {
        var region = new (self.vttjs.VTTRegion || self.window.VTTRegion)();
        region.width = settings.get("width", 100);
        region.lines = settings.get("lines", 3);
        region.regionAnchorX = settings.get("regionanchorX", 0);
        region.regionAnchorY = settings.get("regionanchorY", 100);
        region.viewportAnchorX = settings.get("viewportanchorX", 0);
        region.viewportAnchorY = settings.get("viewportanchorY", 100);
        region.scroll = settings.get("scroll", "");
        // Register the region.
        self.onregion && self.onregion(region);
        // Remember the VTTRegion for later in case we parse any VTTCues that
        // reference it.
        self.regionList.push({
          id: settings.get("id"),
          region: region
        });
      }
    }

    // draft-pantos-http-live-streaming-20
    // https://tools.ietf.org/html/draft-pantos-http-live-streaming-20#section-3.5
    // 3.5 WebVTT
    function parseTimestampMap(input) {
      var settings = new Settings();

      parseOptions(input, function(k, v) {
        switch(k) {
        case "MPEGT":
          settings.integer(k + 'S', v);
          break;
        case "LOCA":
          settings.set(k + 'L', parseTimeStamp(v));
          break;
        }
      }, /[^\d]:/, /,/);

      self.ontimestampmap && self.ontimestampmap({
        "MPEGTS": settings.get("MPEGTS"),
        "LOCAL": settings.get("LOCAL")
      });
    }

    // 3.2 WebVTT metadata header syntax
    function parseHeader(input) {
      if (input.match(/X-TIMESTAMP-MAP/)) {
        // This line contains HLS X-TIMESTAMP-MAP metadata
        parseOptions(input, function(k, v) {
          switch(k) {
          case "X-TIMESTAMP-MAP":
            parseTimestampMap(v);
            break;
          }
        }, /=/);
      } else {
        parseOptions(input, function (k, v) {
          switch (k) {
          case "Region":
            // 3.3 WebVTT region metadata header syntax
            parseRegion(v);
            break;
          }
        }, /:/);
      }

    }

    // 5.1 WebVTT file parsing.
    try {
      var line;
      if (self.state === "INITIAL") {
        // We can't start parsing until we have the first line.
        if (!/\r\n|\n/.test(self.buffer)) {
          return this;
        }

        line = collectNextLine();

        var m = line.match(/^WEBVTT([ \t].*)?$/);
        if (!m || !m[0]) {
          throw new ParsingError(ParsingError.Errors.BadSignature);
        }

        self.state = "HEADER";
      }

      var alreadyCollectedLine = false;
      while (self.buffer) {
        // We can't parse a line until we have the full line.
        if (!/\r\n|\n/.test(self.buffer)) {
          return this;
        }

        if (!alreadyCollectedLine) {
          line = collectNextLine();
        } else {
          alreadyCollectedLine = false;
        }

        switch (self.state) {
        case "HEADER":
          // 13-18 - Allow a header (metadata) under the WEBVTT line.
          if (/:/.test(line)) {
            parseHeader(line);
          } else if (!line) {
            // An empty line terminates the header and starts the body (cues).
            self.state = "ID";
          }
          continue;
        case "NOTE":
          // Ignore NOTE blocks.
          if (!line) {
            self.state = "ID";
          }
          continue;
        case "ID":
          // Check for the start of NOTE blocks.
          if (/^NOTE($|[ \t])/.test(line)) {
            self.state = "NOTE";
            break;
          }
          // 19-29 - Allow any number of line terminators, then initialize new cue values.
          if (!line) {
            continue;
          }
          self.cue = new (self.vttjs.VTTCue || self.window.VTTCue)(0, 0, "");
          // Safari still uses the old middle value and won't accept center
          try {
            self.cue.align = "center";
          } catch (e) {
            self.cue.align = "middle";
          }
          self.state = "CUE";
          // 30-39 - Check if self line contains an optional identifier or timing data.
          if (line.indexOf("-->") === -1) {
            self.cue.id = line;
            continue;
          }
          // Process line as start of a cue.
          /*falls through*/
        case "CUE":
          // 40 - Collect cue timings and settings.
          try {
            parseCue(line, self.cue, self.regionList);
          } catch (e) {
            self.reportOrThrowError(e);
            // In case of an error ignore rest of the cue.
            self.cue = null;
            self.state = "BADCUE";
            continue;
          }
          self.state = "CUETEXT";
          continue;
        case "CUETEXT":
          var hasSubstring = line.indexOf("-->") !== -1;
          // 34 - If we have an empty line then report the cue.
          // 35 - If we have the special substring '-->' then report the cue,
          // but do not collect the line as we need to process the current
          // one as a new cue.
          if (!line || hasSubstring && (alreadyCollectedLine = true)) {
            // We are done parsing self cue.
            self.oncue && self.oncue(self.cue);
            self.cue = null;
            self.state = "ID";
            continue;
          }
          if (self.cue.text) {
            self.cue.text += "\n";
          }
          self.cue.text += line.replace(/\u2028/g, '\n').replace(/u2029/g, '\n');
          continue;
        case "BADCUE": // BADCUE
          // 54-62 - Collect and discard the remaining cue.
          if (!line) {
            self.state = "ID";
          }
          continue;
        }
      }
    } catch (e) {
      self.reportOrThrowError(e);

      // If we are currently parsing a cue, report what we have.
      if (self.state === "CUETEXT" && self.cue && self.oncue) {
        self.oncue(self.cue);
      }
      self.cue = null;
      // Enter BADWEBVTT state if header was not parsed correctly otherwise
      // another exception occurred so enter BADCUE state.
      self.state = self.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
    }
    return this;
  },
  flush: function () {
    var self = this;
    try {
      // Finish decoding the stream.
      self.buffer += self.decoder.decode();
      // Synthesize the end of the current cue or region.
      if (self.cue || self.state === "HEADER") {
        self.buffer += "\n\n";
        self.parse();
      }
      // If we've flushed, parsed, and we're still on the INITIAL state then
      // that means we don't have enough of the stream to parse the first
      // line.
      if (self.state === "INITIAL") {
        throw new ParsingError(ParsingError.Errors.BadSignature);
      }
    } catch(e) {
      self.reportOrThrowError(e);
    }
    self.onflush && self.onflush();
    return this;
  }
};

module.exports = WebVTT;


/***/ }),

/***/ 2230:
/***/ (function(module) {

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var autoKeyword = "auto";
var directionSetting = {
  "": 1,
  "lr": 1,
  "rl": 1
};
var alignSetting = {
  "start": 1,
  "center": 1,
  "end": 1,
  "left": 1,
  "right": 1,
  "auto": 1,
  "line-left": 1,
  "line-right": 1
};

function findDirectionSetting(value) {
  if (typeof value !== "string") {
    return false;
  }
  var dir = directionSetting[value.toLowerCase()];
  return dir ? value.toLowerCase() : false;
}

function findAlignSetting(value) {
  if (typeof value !== "string") {
    return false;
  }
  var align = alignSetting[value.toLowerCase()];
  return align ? value.toLowerCase() : false;
}

function VTTCue(startTime, endTime, text) {
  /**
   * Shim implementation specific properties. These properties are not in
   * the spec.
   */

  // Lets us know when the VTTCue's data has changed in such a way that we need
  // to recompute its display state. This lets us compute its display state
  // lazily.
  this.hasBeenReset = false;

  /**
   * VTTCue and TextTrackCue properties
   * http://dev.w3.org/html5/webvtt/#vttcue-interface
   */

  var _id = "";
  var _pauseOnExit = false;
  var _startTime = startTime;
  var _endTime = endTime;
  var _text = text;
  var _region = null;
  var _vertical = "";
  var _snapToLines = true;
  var _line = "auto";
  var _lineAlign = "start";
  var _position = "auto";
  var _positionAlign = "auto";
  var _size = 100;
  var _align = "center";

  Object.defineProperties(this, {
    "id": {
      enumerable: true,
      get: function() {
        return _id;
      },
      set: function(value) {
        _id = "" + value;
      }
    },

    "pauseOnExit": {
      enumerable: true,
      get: function() {
        return _pauseOnExit;
      },
      set: function(value) {
        _pauseOnExit = !!value;
      }
    },

    "startTime": {
      enumerable: true,
      get: function() {
        return _startTime;
      },
      set: function(value) {
        if (typeof value !== "number") {
          throw new TypeError("Start time must be set to a number.");
        }
        _startTime = value;
        this.hasBeenReset = true;
      }
    },

    "endTime": {
      enumerable: true,
      get: function() {
        return _endTime;
      },
      set: function(value) {
        if (typeof value !== "number") {
          throw new TypeError("End time must be set to a number.");
        }
        _endTime = value;
        this.hasBeenReset = true;
      }
    },

    "text": {
      enumerable: true,
      get: function() {
        return _text;
      },
      set: function(value) {
        _text = "" + value;
        this.hasBeenReset = true;
      }
    },

    "region": {
      enumerable: true,
      get: function() {
        return _region;
      },
      set: function(value) {
        _region = value;
        this.hasBeenReset = true;
      }
    },

    "vertical": {
      enumerable: true,
      get: function() {
        return _vertical;
      },
      set: function(value) {
        var setting = findDirectionSetting(value);
        // Have to check for false because the setting an be an empty string.
        if (setting === false) {
          throw new SyntaxError("Vertical: an invalid or illegal direction string was specified.");
        }
        _vertical = setting;
        this.hasBeenReset = true;
      }
    },

    "snapToLines": {
      enumerable: true,
      get: function() {
        return _snapToLines;
      },
      set: function(value) {
        _snapToLines = !!value;
        this.hasBeenReset = true;
      }
    },

    "line": {
      enumerable: true,
      get: function() {
        return _line;
      },
      set: function(value) {
        if (typeof value !== "number" && value !== autoKeyword) {
          throw new SyntaxError("Line: an invalid number or illegal string was specified.");
        }
        _line = value;
        this.hasBeenReset = true;
      }
    },

    "lineAlign": {
      enumerable: true,
      get: function() {
        return _lineAlign;
      },
      set: function(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          console.warn("lineAlign: an invalid or illegal string was specified.");
        } else {
          _lineAlign = setting;
          this.hasBeenReset = true;
        }
      }
    },

    "position": {
      enumerable: true,
      get: function() {
        return _position;
      },
      set: function(value) {
        if (value < 0 || value > 100) {
          throw new Error("Position must be between 0 and 100.");
        }
        _position = value;
        this.hasBeenReset = true;
      }
    },

    "positionAlign": {
      enumerable: true,
      get: function() {
        return _positionAlign;
      },
      set: function(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          console.warn("positionAlign: an invalid or illegal string was specified.");
        } else {
          _positionAlign = setting;
          this.hasBeenReset = true;
        }
      }
    },

    "size": {
      enumerable: true,
      get: function() {
        return _size;
      },
      set: function(value) {
        if (value < 0 || value > 100) {
          throw new Error("Size must be between 0 and 100.");
        }
        _size = value;
        this.hasBeenReset = true;
      }
    },

    "align": {
      enumerable: true,
      get: function() {
        return _align;
      },
      set: function(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          throw new SyntaxError("align: an invalid or illegal alignment string was specified.");
        }
        _align = setting;
        this.hasBeenReset = true;
      }
    }
  });

  /**
   * Other <track> spec defined properties
   */

  // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
  this.displayState = undefined;
}

/**
 * VTTCue methods
 */

VTTCue.prototype.getCueAsHTML = function() {
  // Assume WebVTT.convertCueToDOMTree is on the global.
  return WebVTT.convertCueToDOMTree(window, this.text);
};

module.exports = VTTCue;


/***/ }),

/***/ 3710:
/***/ (function(module) {

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var scrollSetting = {
  "": true,
  "up": true
};

function findScrollSetting(value) {
  if (typeof value !== "string") {
    return false;
  }
  var scroll = scrollSetting[value.toLowerCase()];
  return scroll ? value.toLowerCase() : false;
}

function isValidPercentValue(value) {
  return typeof value === "number" && (value >= 0 && value <= 100);
}

// VTTRegion shim http://dev.w3.org/html5/webvtt/#vttregion-interface
function VTTRegion() {
  var _width = 100;
  var _lines = 3;
  var _regionAnchorX = 0;
  var _regionAnchorY = 100;
  var _viewportAnchorX = 0;
  var _viewportAnchorY = 100;
  var _scroll = "";

  Object.defineProperties(this, {
    "width": {
      enumerable: true,
      get: function() {
        return _width;
      },
      set: function(value) {
        if (!isValidPercentValue(value)) {
          throw new Error("Width must be between 0 and 100.");
        }
        _width = value;
      }
    },
    "lines": {
      enumerable: true,
      get: function() {
        return _lines;
      },
      set: function(value) {
        if (typeof value !== "number") {
          throw new TypeError("Lines must be set to a number.");
        }
        _lines = value;
      }
    },
    "regionAnchorY": {
      enumerable: true,
      get: function() {
        return _regionAnchorY;
      },
      set: function(value) {
        if (!isValidPercentValue(value)) {
          throw new Error("RegionAnchorX must be between 0 and 100.");
        }
        _regionAnchorY = value;
      }
    },
    "regionAnchorX": {
      enumerable: true,
      get: function() {
        return _regionAnchorX;
      },
      set: function(value) {
        if(!isValidPercentValue(value)) {
          throw new Error("RegionAnchorY must be between 0 and 100.");
        }
        _regionAnchorX = value;
      }
    },
    "viewportAnchorY": {
      enumerable: true,
      get: function() {
        return _viewportAnchorY;
      },
      set: function(value) {
        if (!isValidPercentValue(value)) {
          throw new Error("ViewportAnchorY must be between 0 and 100.");
        }
        _viewportAnchorY = value;
      }
    },
    "viewportAnchorX": {
      enumerable: true,
      get: function() {
        return _viewportAnchorX;
      },
      set: function(value) {
        if (!isValidPercentValue(value)) {
          throw new Error("ViewportAnchorX must be between 0 and 100.");
        }
        _viewportAnchorX = value;
      }
    },
    "scroll": {
      enumerable: true,
      get: function() {
        return _scroll;
      },
      set: function(value) {
        var setting = findScrollSetting(value);
        // Have to check for false as an empty string is a legal value.
        if (setting === false) {
          console.warn("Scroll: an invalid or illegal string was specified.");
        } else {
          _scroll = setting;
        }
      }
    }
  });
}

module.exports = VTTRegion;


/***/ }),

/***/ 4782:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 816:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(4782)
var ieee754 = __webpack_require__(8898)
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol.for === 'function')
    ? Symbol.for('nodejs.util.inspect.custom')
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()


/***/ }),

/***/ 8898:
/***/ (function(__unused_webpack_module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 7579:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 7326:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ 8852:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ _construct; }
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
var setPrototypeOf = __webpack_require__(9611);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/construct.js


function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) (0,setPrototypeOf/* default */.Z)(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

/***/ }),

/***/ 7462:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ 136:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9611);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  Object.defineProperty(subClass, "prototype", {
    value: Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    }),
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(subClass, superClass);
}

/***/ }),

/***/ 4578:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _inheritsLoose; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9611);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(subClass, superClass);
}

/***/ }),

/***/ 9611:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [544,774,888,179], function() { return __webpack_exec__(8581); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);