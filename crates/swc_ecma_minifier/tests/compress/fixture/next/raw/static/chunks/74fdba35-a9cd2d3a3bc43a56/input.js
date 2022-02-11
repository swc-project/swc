"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[708],{

/***/ 6855:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ fontkit; }
/* harmony export */ });
/* harmony import */ var restructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7887);
/* harmony import */ var restructure__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(restructure__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7855);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(3229);
/* harmony import */ var _babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5068);
/* harmony import */ var restructure_src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2022);
/* harmony import */ var restructure_src_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(restructure_src_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var deep_equal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(251);
/* harmony import */ var deep_equal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(deep_equal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8537);
/* harmony import */ var unicode_trie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7055);
/* harmony import */ var unicode_trie__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(unicode_trie__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7757);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var clone__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6313);
/* harmony import */ var clone__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(clone__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var tiny_inflate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(311);
/* harmony import */ var tiny_inflate__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(tiny_inflate__WEBPACK_IMPORTED_MODULE_7__);
/* provided dependency */ var Buffer = __webpack_require__(1876)["Buffer"];













var fontkit = {};
fontkit.logErrors = false;
var formats = [];

fontkit.registerFormat = function (format) {
  formats.push(format);
};

fontkit.openSync = function (filename, postscriptName) {
  {
    throw new Error('fontkit.openSync unavailable for browser build');
  }
};

fontkit.open = function (filename, postscriptName, callback) {
  {
    throw new Error('fontkit.open unavailable for browser build');
  }
};

fontkit.create = function (buffer, postscriptName) {
  for (var i = 0; i < formats.length; i++) {
    var format = formats[i];

    if (format.probe(buffer)) {
      var font = new format(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(buffer));

      if (postscriptName) {
        return font.getFont(postscriptName);
      }

      return font;
    }
  }

  throw new Error('Unknown font format');
};

fontkit.defaultLanguage = 'en';

fontkit.setDefaultLanguage = function (lang) {
  if (lang === void 0) {
    lang = 'en';
  }

  fontkit.defaultLanguage = lang;
};

/**
 * This decorator caches the results of a getter or method such that
 * the results are lazily computed once, and then cached.
 * @private
 */
function cache(target, key, descriptor) {
  if (descriptor.get) {
    var get = descriptor.get;

    descriptor.get = function () {
      var value = get.call(this);
      Object.defineProperty(this, key, {
        value: value
      });
      return value;
    };
  } else if (typeof descriptor.value === 'function') {
    var fn = descriptor.value;
    return {
      get: function get() {
        var cache = new Map();

        function memoized() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var key = args.length > 0 ? args[0] : 'value';

          if (cache.has(key)) {
            return cache.get(key);
          }

          var result = fn.apply(this, args);
          cache.set(key, result);
          return result;
        }
        Object.defineProperty(this, key, {
          value: memoized
        });
        return memoized;
      }
    };
  }
}

var SubHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  firstCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  entryCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  idDelta: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  idRangeOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var CmapGroup = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  startCharCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  endCharCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  glyphID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var UnicodeValueRange = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  startUnicodeValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24),
  additionalCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var UVSMapping = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  unicodeValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24),
  glyphID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var DefaultUVS = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(UnicodeValueRange, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32));
var NonDefaultUVS = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(UVSMapping, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32));
var VarSelectorRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  varSelector: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24),
  defaultUVS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), DefaultUVS, {
    type: 'parent'
  }),
  nonDefaultUVS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), NonDefaultUVS, {
    type: 'parent'
  })
});
var CmapSubtable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  0: {
    // Byte encoding
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Total table length in bytes (set to 262 for format 0)
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Language code for this encoding subtable, or zero if language-independent
    codeMap: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 256)
  },
  2: {
    // High-byte mapping (CJK)
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    subHeaderKeys: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 256),
    subHeaderCount: function subHeaderCount(t) {
      return Math.max.apply(Math, t.subHeaderKeys);
    },
    subHeaders: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(SubHeader, 'subHeaderCount'),
    glyphIndexArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'subHeaderCount')
  },
  4: {
    // Segment mapping to delta values
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Total table length in bytes
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Language code
    segCountX2: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    segCount: function segCount(t) {
      return t.segCountX2 >> 1;
    },
    searchRange: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    entrySelector: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    rangeShift: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    endCode: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'segCount'),
    reservedPad: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    // This value should be zero
    startCode: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'segCount'),
    idDelta: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 'segCount'),
    idRangeOffset: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'segCount'),
    glyphIndexArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
      return (t.length - t._currentOffset) / 2;
    })
  },
  6: {
    // Trimmed table
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    firstCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    entryCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyphIndices: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'entryCount')
  },
  8: {
    // mixed 16-bit and 32-bit coverage
    reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    is32: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 8192),
    nGroups: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    groups: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(CmapGroup, 'nGroups')
  },
  10: {
    // Trimmed Array
    reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    firstCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    entryCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    glyphIndices: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numChars')
  },
  12: {
    // Segmented coverage
    reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    nGroups: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    groups: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(CmapGroup, 'nGroups')
  },
  13: {
    // Many-to-one range mappings (same as 12 except for group.startGlyphID)
    reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    language: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    nGroups: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    groups: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(CmapGroup, 'nGroups')
  },
  14: {
    // Unicode Variation Sequences
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    numRecords: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    varSelectors: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(VarSelectorRecord, 'numRecords')
  }
});
var CmapEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  platformID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Platform identifier
  encodingID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Platform-specific encoding identifier
  table: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), CmapSubtable, {
    type: 'parent',
    lazy: true
  })
}); // character to glyph mapping

var cmap = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  numSubtables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  tables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(CmapEntry, 'numSubtables')
});

var head = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int32),
  // 0x00010000 (version 1.0)
  revision: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int32),
  // set by font manufacturer
  checkSumAdjustment: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  magicNumber: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  // set to 0x5F0F3CF5
  flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  unitsPerEm: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // range from 64 to 16384
  created: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int32), 2),
  modified: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int32), 2),
  xMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // for all glyph bounding boxes
  yMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // for all glyph bounding boxes
  xMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // for all glyph bounding boxes
  yMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // for all glyph bounding boxes
  macStyle: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ['bold', 'italic', 'underline', 'outline', 'shadow', 'condensed', 'extended']),
  lowestRecPPEM: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // smallest readable size in pixels
  fontDirectionHint: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  indexToLocFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // 0 for short offsets, 1 for long
  glyphDataFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16) // 0 for current format

});

var hhea = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int32),
  ascent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Distance from baseline of highest ascender
  descent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Distance from baseline of lowest descender
  lineGap: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Typographic line gap
  advanceWidthMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum advance width value in 'hmtx' table
  minLeftSideBearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Maximum advance width value in 'hmtx' table
  minRightSideBearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Minimum right sidebearing value
  xMaxExtent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  caretSlopeRise: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Used to calculate the slope of the cursor (rise/run); 1 for vertical
  caretSlopeRun: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // 0 for vertical
  caretOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Set to 0 for non-slanted fonts
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 4),
  metricDataFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // 0 for current format
  numberOfMetrics: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // Number of advance widths in 'hmtx' table

});

var HmtxEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  advance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  bearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
});
var hmtx = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  metrics: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(HmtxEntry, function (t) {
    return t.parent.hhea.numberOfMetrics;
  }),
  bearings: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), function (t) {
    return t.parent.maxp.numGlyphs - t.parent.hhea.numberOfMetrics;
  })
});

var maxp = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int32),
  numGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // The number of glyphs in the font
  maxPoints: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum points in a non-composite glyph
  maxContours: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum contours in a non-composite glyph
  maxComponentPoints: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum points in a composite glyph
  maxComponentContours: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum contours in a composite glyph
  maxZones: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // 1 if instructions do not use the twilight zone, 2 otherwise
  maxTwilightPoints: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum points used in Z0
  maxStorage: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of Storage Area locations
  maxFunctionDefs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of FDEFs
  maxInstructionDefs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of IDEFs
  maxStackElements: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum stack depth
  maxSizeOfInstructions: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum byte count for glyph instructions
  maxComponentElements: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Maximum number of components referenced at “top level” for any composite glyph
  maxComponentDepth: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // Maximum levels of recursion; 1 for simple components

});

/**
 * Gets an encoding name from platform, encoding, and language ids.
 * Returned encoding names can be used in iconv-lite to decode text.
 */
function getEncoding(platformID, encodingID, languageID) {
  if (languageID === void 0) {
    languageID = 0;
  }

  if (platformID === 1 && MAC_LANGUAGE_ENCODINGS[languageID]) {
    return MAC_LANGUAGE_ENCODINGS[languageID];
  }

  return ENCODINGS[platformID][encodingID];
} // Map of platform ids to encoding ids.

var ENCODINGS = [// unicode
['utf16be', 'utf16be', 'utf16be', 'utf16be', 'utf16be', 'utf16be'], // macintosh
// Mappings available at http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/
// 0	Roman                 17	Malayalam
// 1	Japanese	            18	Sinhalese
// 2	Traditional Chinese	  19	Burmese
// 3	Korean	              20	Khmer
// 4	Arabic	              21	Thai
// 5	Hebrew	              22	Laotian
// 6	Greek	                23	Georgian
// 7	Russian	              24	Armenian
// 8	RSymbol	              25	Simplified Chinese
// 9	Devanagari	          26	Tibetan
// 10	Gurmukhi	            27	Mongolian
// 11	Gujarati	            28	Geez
// 12	Oriya	                29	Slavic
// 13	Bengali	              30	Vietnamese
// 14	Tamil	                31	Sindhi
// 15	Telugu	              32	(Uninterpreted)
// 16	Kannada
['macroman', 'shift-jis', 'big5', 'euc-kr', 'iso-8859-6', 'iso-8859-8', 'macgreek', 'maccyrillic', 'symbol', 'Devanagari', 'Gurmukhi', 'Gujarati', 'Oriya', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Sinhalese', 'Burmese', 'Khmer', 'macthai', 'Laotian', 'Georgian', 'Armenian', 'gb-2312-80', 'Tibetan', 'Mongolian', 'Geez', 'maccenteuro', 'Vietnamese', 'Sindhi'], // ISO (deprecated)
['ascii'], // windows
// Docs here: http://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx
['symbol', 'utf16be', 'shift-jis', 'gb18030', 'big5', 'wansung', 'johab', null, null, null, 'utf16be']]; // Overrides for Mac scripts by language id.
// See http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt

var MAC_LANGUAGE_ENCODINGS = {
  15: 'maciceland',
  17: 'macturkish',
  18: 'maccroatian',
  24: 'maccenteuro',
  25: 'maccenteuro',
  26: 'maccenteuro',
  27: 'maccenteuro',
  28: 'maccenteuro',
  30: 'maciceland',
  37: 'macromania',
  38: 'maccenteuro',
  39: 'maccenteuro',
  40: 'maccenteuro',
  143: 'macinuit',
  // Unsupported by iconv-lite
  146: 'macgaelic' // Unsupported by iconv-lite

}; // Map of platform ids to BCP-47 language codes.

var LANGUAGES = [// unicode
[], {
  // macintosh
  0: 'en',
  30: 'fo',
  60: 'ks',
  90: 'rw',
  1: 'fr',
  31: 'fa',
  61: 'ku',
  91: 'rn',
  2: 'de',
  32: 'ru',
  62: 'sd',
  92: 'ny',
  3: 'it',
  33: 'zh',
  63: 'bo',
  93: 'mg',
  4: 'nl',
  34: 'nl-BE',
  64: 'ne',
  94: 'eo',
  5: 'sv',
  35: 'ga',
  65: 'sa',
  128: 'cy',
  6: 'es',
  36: 'sq',
  66: 'mr',
  129: 'eu',
  7: 'da',
  37: 'ro',
  67: 'bn',
  130: 'ca',
  8: 'pt',
  38: 'cz',
  68: 'as',
  131: 'la',
  9: 'no',
  39: 'sk',
  69: 'gu',
  132: 'qu',
  10: 'he',
  40: 'si',
  70: 'pa',
  133: 'gn',
  11: 'ja',
  41: 'yi',
  71: 'or',
  134: 'ay',
  12: 'ar',
  42: 'sr',
  72: 'ml',
  135: 'tt',
  13: 'fi',
  43: 'mk',
  73: 'kn',
  136: 'ug',
  14: 'el',
  44: 'bg',
  74: 'ta',
  137: 'dz',
  15: 'is',
  45: 'uk',
  75: 'te',
  138: 'jv',
  16: 'mt',
  46: 'be',
  76: 'si',
  139: 'su',
  17: 'tr',
  47: 'uz',
  77: 'my',
  140: 'gl',
  18: 'hr',
  48: 'kk',
  78: 'km',
  141: 'af',
  19: 'zh-Hant',
  49: 'az-Cyrl',
  79: 'lo',
  142: 'br',
  20: 'ur',
  50: 'az-Arab',
  80: 'vi',
  143: 'iu',
  21: 'hi',
  51: 'hy',
  81: 'id',
  144: 'gd',
  22: 'th',
  52: 'ka',
  82: 'tl',
  145: 'gv',
  23: 'ko',
  53: 'mo',
  83: 'ms',
  146: 'ga',
  24: 'lt',
  54: 'ky',
  84: 'ms-Arab',
  147: 'to',
  25: 'pl',
  55: 'tg',
  85: 'am',
  148: 'el-polyton',
  26: 'hu',
  56: 'tk',
  86: 'ti',
  149: 'kl',
  27: 'es',
  57: 'mn-CN',
  87: 'om',
  150: 'az',
  28: 'lv',
  58: 'mn',
  88: 'so',
  151: 'nn',
  29: 'se',
  59: 'ps',
  89: 'sw'
}, // ISO (deprecated)
[], {
  // windows                                        
  0x0436: 'af',
  0x4009: 'en-IN',
  0x0487: 'rw',
  0x0432: 'tn',
  0x041C: 'sq',
  0x1809: 'en-IE',
  0x0441: 'sw',
  0x045B: 'si',
  0x0484: 'gsw',
  0x2009: 'en-JM',
  0x0457: 'kok',
  0x041B: 'sk',
  0x045E: 'am',
  0x4409: 'en-MY',
  0x0412: 'ko',
  0x0424: 'sl',
  0x1401: 'ar-DZ',
  0x1409: 'en-NZ',
  0x0440: 'ky',
  0x2C0A: 'es-AR',
  0x3C01: 'ar-BH',
  0x3409: 'en-PH',
  0x0454: 'lo',
  0x400A: 'es-BO',
  0x0C01: 'ar',
  0x4809: 'en-SG',
  0x0426: 'lv',
  0x340A: 'es-CL',
  0x0801: 'ar-IQ',
  0x1C09: 'en-ZA',
  0x0427: 'lt',
  0x240A: 'es-CO',
  0x2C01: 'ar-JO',
  0x2C09: 'en-TT',
  0x082E: 'dsb',
  0x140A: 'es-CR',
  0x3401: 'ar-KW',
  0x0809: 'en-GB',
  0x046E: 'lb',
  0x1C0A: 'es-DO',
  0x3001: 'ar-LB',
  0x0409: 'en',
  0x042F: 'mk',
  0x300A: 'es-EC',
  0x1001: 'ar-LY',
  0x3009: 'en-ZW',
  0x083E: 'ms-BN',
  0x440A: 'es-SV',
  0x1801: 'ary',
  0x0425: 'et',
  0x043E: 'ms',
  0x100A: 'es-GT',
  0x2001: 'ar-OM',
  0x0438: 'fo',
  0x044C: 'ml',
  0x480A: 'es-HN',
  0x4001: 'ar-QA',
  0x0464: 'fil',
  0x043A: 'mt',
  0x080A: 'es-MX',
  0x0401: 'ar-SA',
  0x040B: 'fi',
  0x0481: 'mi',
  0x4C0A: 'es-NI',
  0x2801: 'ar-SY',
  0x080C: 'fr-BE',
  0x047A: 'arn',
  0x180A: 'es-PA',
  0x1C01: 'aeb',
  0x0C0C: 'fr-CA',
  0x044E: 'mr',
  0x3C0A: 'es-PY',
  0x3801: 'ar-AE',
  0x040C: 'fr',
  0x047C: 'moh',
  0x280A: 'es-PE',
  0x2401: 'ar-YE',
  0x140C: 'fr-LU',
  0x0450: 'mn',
  0x500A: 'es-PR',
  0x042B: 'hy',
  0x180C: 'fr-MC',
  0x0850: 'mn-CN',
  0x0C0A: 'es',
  0x044D: 'as',
  0x100C: 'fr-CH',
  0x0461: 'ne',
  0x040A: 'es',
  0x082C: 'az-Cyrl',
  0x0462: 'fy',
  0x0414: 'nb',
  0x540A: 'es-US',
  0x042C: 'az',
  0x0456: 'gl',
  0x0814: 'nn',
  0x380A: 'es-UY',
  0x046D: 'ba',
  0x0437: 'ka',
  0x0482: 'oc',
  0x200A: 'es-VE',
  0x042D: 'eu',
  0x0C07: 'de-AT',
  0x0448: 'or',
  0x081D: 'sv-FI',
  0x0423: 'be',
  0x0407: 'de',
  0x0463: 'ps',
  0x041D: 'sv',
  0x0845: 'bn',
  0x1407: 'de-LI',
  0x0415: 'pl',
  0x045A: 'syr',
  0x0445: 'bn-IN',
  0x1007: 'de-LU',
  0x0416: 'pt',
  0x0428: 'tg',
  0x201A: 'bs-Cyrl',
  0x0807: 'de-CH',
  0x0816: 'pt-PT',
  0x085F: 'tzm',
  0x141A: 'bs',
  0x0408: 'el',
  0x0446: 'pa',
  0x0449: 'ta',
  0x047E: 'br',
  0x046F: 'kl',
  0x046B: 'qu-BO',
  0x0444: 'tt',
  0x0402: 'bg',
  0x0447: 'gu',
  0x086B: 'qu-EC',
  0x044A: 'te',
  0x0403: 'ca',
  0x0468: 'ha',
  0x0C6B: 'qu',
  0x041E: 'th',
  0x0C04: 'zh-HK',
  0x040D: 'he',
  0x0418: 'ro',
  0x0451: 'bo',
  0x1404: 'zh-MO',
  0x0439: 'hi',
  0x0417: 'rm',
  0x041F: 'tr',
  0x0804: 'zh',
  0x040E: 'hu',
  0x0419: 'ru',
  0x0442: 'tk',
  0x1004: 'zh-SG',
  0x040F: 'is',
  0x243B: 'smn',
  0x0480: 'ug',
  0x0404: 'zh-TW',
  0x0470: 'ig',
  0x103B: 'smj-NO',
  0x0422: 'uk',
  0x0483: 'co',
  0x0421: 'id',
  0x143B: 'smj',
  0x042E: 'hsb',
  0x041A: 'hr',
  0x045D: 'iu',
  0x0C3B: 'se-FI',
  0x0420: 'ur',
  0x101A: 'hr-BA',
  0x085D: 'iu-Latn',
  0x043B: 'se',
  0x0843: 'uz-Cyrl',
  0x0405: 'cs',
  0x083C: 'ga',
  0x083B: 'se-SE',
  0x0443: 'uz',
  0x0406: 'da',
  0x0434: 'xh',
  0x203B: 'sms',
  0x042A: 'vi',
  0x048C: 'prs',
  0x0435: 'zu',
  0x183B: 'sma-NO',
  0x0452: 'cy',
  0x0465: 'dv',
  0x0410: 'it',
  0x1C3B: 'sms',
  0x0488: 'wo',
  0x0813: 'nl-BE',
  0x0810: 'it-CH',
  0x044F: 'sa',
  0x0485: 'sah',
  0x0413: 'nl',
  0x0411: 'ja',
  0x1C1A: 'sr-Cyrl-BA',
  0x0478: 'ii',
  0x0C09: 'en-AU',
  0x044B: 'kn',
  0x0C1A: 'sr',
  0x046A: 'yo',
  0x2809: 'en-BZ',
  0x043F: 'kk',
  0x181A: 'sr-Latn-BA',
  0x1009: 'en-CA',
  0x0453: 'km',
  0x081A: 'sr-Latn',
  0x2409: 'en-029',
  0x0486: 'quc',
  0x046C: 'nso'
}];

var NameRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  platformID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  encodingID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  languageID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nameID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  string: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)('length', function (t) {
    return getEncoding(t.platformID, t.encodingID, t.languageID);
  }), {
    type: 'parent',
    relativeTo: 'parent.stringOffset',
    allowNull: false
  })
});
var LangTagRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)('length', 'utf16be'), {
    type: 'parent',
    relativeTo: 'stringOffset'
  })
});
var NameTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  0: {
    count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    stringOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    records: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(NameRecord, 'count')
  },
  1: {
    count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    stringOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    records: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(NameRecord, 'count'),
    langTagCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    langTags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LangTagRecord, 'langTagCount')
  }
});
var NAMES = ['copyright', 'fontFamily', 'fontSubfamily', 'uniqueSubfamily', 'fullName', 'version', 'postscriptName', // Note: A font may have only one PostScript name and that name must be ASCII.
'trademark', 'manufacturer', 'designer', 'description', 'vendorURL', 'designerURL', 'license', 'licenseURL', null, // reserved
'preferredFamily', 'preferredSubfamily', 'compatibleFull', 'sampleText', 'postscriptCIDFontName', 'wwsFamilyName', 'wwsSubfamilyName'];

NameTable.process = function (stream) {
  var records = {};

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.records), _step; !(_step = _iterator()).done;) {
    var record = _step.value;
    // find out what language this is for
    var language = LANGUAGES[record.platformID][record.languageID];

    if (language == null && this.langTags != null && record.languageID >= 0x8000) {
      language = this.langTags[record.languageID - 0x8000].tag;
    }

    if (language == null) {
      language = record.platformID + '-' + record.languageID;
    } // if the nameID is >= 256, it is a font feature record (AAT)


    var key = record.nameID >= 256 ? 'fontFeatures' : NAMES[record.nameID] || record.nameID;

    if (records[key] == null) {
      records[key] = {};
    }

    var obj = records[key];

    if (record.nameID >= 256) {
      obj = obj[record.nameID] || (obj[record.nameID] = {});
    }

    if (typeof record.string === 'string' || typeof obj[language] !== 'string') {
      obj[language] = record.string;
    }
  }

  this.records = records;
};

NameTable.preEncode = function () {
  if (Array.isArray(this.records)) return;
  this.version = 0;
  var records = [];

  for (var key in this.records) {
    var val = this.records[key];
    if (key === 'fontFeatures') continue;
    records.push({
      platformID: 3,
      encodingID: 1,
      languageID: 0x409,
      nameID: NAMES.indexOf(key),
      length: Buffer.byteLength(val.en, 'utf16le'),
      string: val.en
    });

    if (key === 'postscriptName') {
      records.push({
        platformID: 1,
        encodingID: 0,
        languageID: 0,
        nameID: NAMES.indexOf(key),
        length: val.en.length,
        string: val.en
      });
    }
  }

  this.records = records;
  this.count = records.length;
  this.stringOffset = NameTable.size(this, null, false);
};

var OS2 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  header: {
    xAvgCharWidth: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // average weighted advance width of lower case letters and space
    usWeightClass: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // visual weight of stroke in glyphs
    usWidthClass: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // relative change from the normal aspect ratio (width to height ratio)
    fsType: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), [// Indicates font embedding licensing rights
    null, 'noEmbedding', 'viewOnly', 'editable', null, null, null, null, 'noSubsetting', 'bitmapOnly']),
    ySubscriptXSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended horizontal size in pixels for subscripts
    ySubscriptYSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended vertical size in pixels for subscripts
    ySubscriptXOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended horizontal offset for subscripts
    ySubscriptYOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended vertical offset form the baseline for subscripts
    ySuperscriptXSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended horizontal size in pixels for superscripts
    ySuperscriptYSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended vertical size in pixels for superscripts
    ySuperscriptXOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended horizontal offset for superscripts
    ySuperscriptYOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // recommended vertical offset from the baseline for superscripts
    yStrikeoutSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // width of the strikeout stroke
    yStrikeoutPosition: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // position of the strikeout stroke relative to the baseline
    sFamilyClass: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // classification of font-family design
    panose: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 10),
    // describe the visual characteristics of a given typeface
    ulCharRange: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 4),
    vendorID: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
    // four character identifier for the font vendor
    fsSelection: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), [// bit field containing information about the font
    'italic', 'underscore', 'negative', 'outlined', 'strikeout', 'bold', 'regular', 'useTypoMetrics', 'wws', 'oblique']),
    usFirstCharIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // The minimum Unicode index in this font
    usLastCharIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // The maximum Unicode index in this font

  },
  // The Apple version of this table ends here, but the Microsoft one continues on...
  0: {},
  1: {
    typoAscender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoDescender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoLineGap: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    winAscent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    winDescent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    codePageRange: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 2)
  },
  2: {
    // these should be common with version 1 somehow
    typoAscender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoDescender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoLineGap: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    winAscent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    winDescent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    codePageRange: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 2),
    xHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    capHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    defaultChar: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    breakChar: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    maxContent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  5: {
    typoAscender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoDescender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    typoLineGap: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    winAscent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    winDescent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    codePageRange: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 2),
    xHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    capHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    defaultChar: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    breakChar: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    maxContent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    usLowerOpticalPointSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    usUpperOpticalPointSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  }
});
var versions = OS2.versions;
versions[3] = versions[4] = versions[2];

var post = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32), {
  header: {
    // these fields exist at the top of all versions
    italicAngle: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    // Italic angle in counter-clockwise degrees from the vertical.
    underlinePosition: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // Suggested distance of the top of the underline from the baseline
    underlineThickness: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // Suggested values for the underline thickness
    isFixedPitch: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    // Whether the font is monospaced
    minMemType42: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    // Minimum memory usage when a TrueType font is downloaded as a Type 42 font
    maxMemType42: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    // Maximum memory usage when a TrueType font is downloaded as a Type 42 font
    minMemType1: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    // Minimum memory usage when a TrueType font is downloaded as a Type 1 font
    maxMemType1: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32) // Maximum memory usage when a TrueType font is downloaded as a Type 1 font

  },
  1: {},
  // version 1 has no additional fields
  2: {
    numberOfGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyphNameIndex: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numberOfGlyphs'),
    names: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)))
  },
  2.5: {
    numberOfGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 'numberOfGlyphs')
  },
  3: {},
  // version 3 has no additional fields
  4: {
    map: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), function (t) {
      return t.parent.maxp.numGlyphs;
    })
  }
});

var cvt = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  controlValues: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16))
});

// These instructions are known as the font program. The main use of this table
// is for the definition of functions that are used in many different glyph programs.

var fpgm = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  instructions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8))
});

var loca = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('head.indexToLocFormat', {
  0: {
    offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))
  },
  1: {
    offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32))
  }
});

loca.process = function () {
  if (this.version === 0) {
    for (var i = 0; i < this.offsets.length; i++) {
      this.offsets[i] <<= 1;
    }
  }
};

loca.preEncode = function () {
  if (this.version === 0) {
    for (var i = 0; i < this.offsets.length; i++) {
      this.offsets[i] >>>= 1;
    }
  }
};

var prep = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  controlValueProgram: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8))
});

var glyf = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)());

var CFFIndex = /*#__PURE__*/function () {
  function CFFIndex(type) {
    this.type = type;
  }

  var _proto = CFFIndex.prototype;

  _proto.getCFFVersion = function getCFFVersion(ctx) {
    while (ctx && !ctx.hdrSize) {
      ctx = ctx.parent;
    }

    return ctx ? ctx.version : -1;
  };

  _proto.decode = function decode(stream, parent) {
    var version = this.getCFFVersion(parent);
    var count = version >= 2 ? stream.readUInt32BE() : stream.readUInt16BE();

    if (count === 0) {
      return [];
    }

    var offSize = stream.readUInt8();
    var offsetType;

    if (offSize === 1) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8);
    } else if (offSize === 2) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16);
    } else if (offSize === 3) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24);
    } else if (offSize === 4) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32);
    } else {
      throw new Error("Bad offset size in CFFIndex: " + offSize + " " + stream.pos);
    }

    var ret = [];
    var startPos = stream.pos + (count + 1) * offSize - 1;
    var start = offsetType.decode(stream);

    for (var i = 0; i < count; i++) {
      var end = offsetType.decode(stream);

      if (this.type != null) {
        var pos = stream.pos;
        stream.pos = startPos + start;
        parent.length = end - start;
        ret.push(this.type.decode(stream, parent));
        stream.pos = pos;
      } else {
        ret.push({
          offset: startPos + start,
          length: end - start
        });
      }

      start = end;
    }

    stream.pos = startPos + start;
    return ret;
  };

  _proto.size = function size(arr, parent) {
    var size = 2;

    if (arr.length === 0) {
      return size;
    }

    var type = this.type || new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)(); // find maximum offset to detminine offset type

    var offset = 1;

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      offset += type.size(item, parent);
    }

    var offsetType;

    if (offset <= 0xff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8);
    } else if (offset <= 0xffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16);
    } else if (offset <= 0xffffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24);
    } else if (offset <= 0xffffffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32);
    } else {
      throw new Error("Bad offset in CFFIndex");
    }

    size += 1 + offsetType.size() * (arr.length + 1);
    size += offset - 1;
    return size;
  };

  _proto.encode = function encode(stream, arr, parent) {
    stream.writeUInt16BE(arr.length);

    if (arr.length === 0) {
      return;
    }

    var type = this.type || new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)(); // find maximum offset to detminine offset type

    var sizes = [];
    var offset = 1;

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(arr), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      var s = type.size(item, parent);
      sizes.push(s);
      offset += s;
    }

    var offsetType;

    if (offset <= 0xff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8);
    } else if (offset <= 0xffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16);
    } else if (offset <= 0xffffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24);
    } else if (offset <= 0xffffffff) {
      offsetType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32);
    } else {
      throw new Error("Bad offset in CFFIndex");
    } // write offset size


    stream.writeUInt8(offsetType.size()); // write elements

    offset = 1;
    offsetType.encode(stream, offset);

    for (var _i = 0, _sizes = sizes; _i < _sizes.length; _i++) {
      var size = _sizes[_i];
      offset += size;
      offsetType.encode(stream, offset);
    }

    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(arr), _step2; !(_step2 = _iterator2()).done;) {
      var _item = _step2.value;
      type.encode(stream, _item, parent);
    }

    return;
  };

  return CFFIndex;
}();

var FLOAT_EOF = 0xf;
var FLOAT_LOOKUP = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
var FLOAT_ENCODE_LOOKUP = {
  '.': 10,
  'E': 11,
  'E-': 12,
  '-': 14
};

var CFFOperand = /*#__PURE__*/function () {
  function CFFOperand() {}

  CFFOperand.decode = function decode(stream, value) {
    if (32 <= value && value <= 246) {
      return value - 139;
    }

    if (247 <= value && value <= 250) {
      return (value - 247) * 256 + stream.readUInt8() + 108;
    }

    if (251 <= value && value <= 254) {
      return -(value - 251) * 256 - stream.readUInt8() - 108;
    }

    if (value === 28) {
      return stream.readInt16BE();
    }

    if (value === 29) {
      return stream.readInt32BE();
    }

    if (value === 30) {
      var str = '';

      while (true) {
        var b = stream.readUInt8();
        var n1 = b >> 4;

        if (n1 === FLOAT_EOF) {
          break;
        }

        str += FLOAT_LOOKUP[n1];
        var n2 = b & 15;

        if (n2 === FLOAT_EOF) {
          break;
        }

        str += FLOAT_LOOKUP[n2];
      }

      return parseFloat(str);
    }

    return null;
  };

  CFFOperand.size = function size(value) {
    // if the value needs to be forced to the largest size (32 bit)
    // e.g. for unknown pointers, set to 32768
    if (value.forceLarge) {
      value = 32768;
    }

    if ((value | 0) !== value) {
      // floating point
      var str = '' + value;
      return 1 + Math.ceil((str.length + 1) / 2);
    } else if (-107 <= value && value <= 107) {
      return 1;
    } else if (108 <= value && value <= 1131 || -1131 <= value && value <= -108) {
      return 2;
    } else if (-32768 <= value && value <= 32767) {
      return 3;
    } else {
      return 5;
    }
  };

  CFFOperand.encode = function encode(stream, value) {
    // if the value needs to be forced to the largest size (32 bit)
    // e.g. for unknown pointers, save the old value and set to 32768
    var val = Number(value);

    if (value.forceLarge) {
      stream.writeUInt8(29);
      return stream.writeInt32BE(val);
    } else if ((val | 0) !== val) {
      // floating point
      stream.writeUInt8(30);
      var str = '' + val;

      for (var i = 0; i < str.length; i += 2) {
        var c1 = str[i];
        var n1 = FLOAT_ENCODE_LOOKUP[c1] || +c1;

        if (i === str.length - 1) {
          var n2 = FLOAT_EOF;
        } else {
          var c2 = str[i + 1];
          var n2 = FLOAT_ENCODE_LOOKUP[c2] || +c2;
        }

        stream.writeUInt8(n1 << 4 | n2 & 15);
      }

      if (n2 !== FLOAT_EOF) {
        return stream.writeUInt8(FLOAT_EOF << 4);
      }
    } else if (-107 <= val && val <= 107) {
      return stream.writeUInt8(val + 139);
    } else if (108 <= val && val <= 1131) {
      val -= 108;
      stream.writeUInt8((val >> 8) + 247);
      return stream.writeUInt8(val & 0xff);
    } else if (-1131 <= val && val <= -108) {
      val = -val - 108;
      stream.writeUInt8((val >> 8) + 251);
      return stream.writeUInt8(val & 0xff);
    } else if (-32768 <= val && val <= 32767) {
      stream.writeUInt8(28);
      return stream.writeInt16BE(val);
    } else {
      stream.writeUInt8(29);
      return stream.writeInt32BE(val);
    }
  };

  return CFFOperand;
}();

var CFFDict = /*#__PURE__*/function () {
  function CFFDict(ops) {
    if (ops === void 0) {
      ops = [];
    }

    this.ops = ops;
    this.fields = {};

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(ops), _step; !(_step = _iterator()).done;) {
      var field = _step.value;
      var key = Array.isArray(field[0]) ? field[0][0] << 8 | field[0][1] : field[0];
      this.fields[key] = field;
    }
  }

  var _proto = CFFDict.prototype;

  _proto.decodeOperands = function decodeOperands(type, stream, ret, operands) {
    var _this = this;

    if (Array.isArray(type)) {
      return operands.map(function (op, i) {
        return _this.decodeOperands(type[i], stream, ret, [op]);
      });
    } else if (type.decode != null) {
      return type.decode(stream, ret, operands);
    } else {
      switch (type) {
        case 'number':
        case 'offset':
        case 'sid':
          return operands[0];

        case 'boolean':
          return !!operands[0];

        default:
          return operands;
      }
    }
  };

  _proto.encodeOperands = function encodeOperands(type, stream, ctx, operands) {
    var _this2 = this;

    if (Array.isArray(type)) {
      return operands.map(function (op, i) {
        return _this2.encodeOperands(type[i], stream, ctx, op)[0];
      });
    } else if (type.encode != null) {
      return type.encode(stream, operands, ctx);
    } else if (typeof operands === 'number') {
      return [operands];
    } else if (typeof operands === 'boolean') {
      return [+operands];
    } else if (Array.isArray(operands)) {
      return operands;
    } else {
      return [operands];
    }
  };

  _proto.decode = function decode(stream, parent) {
    var end = stream.pos + parent.length;
    var ret = {};
    var operands = []; // define hidden properties

    Object.defineProperties(ret, {
      parent: {
        value: parent
      },
      _startOffset: {
        value: stream.pos
      }
    }); // fill in defaults

    for (var key in this.fields) {
      var field = this.fields[key];
      ret[field[1]] = field[3];
    }

    while (stream.pos < end) {
      var b = stream.readUInt8();

      if (b < 28) {
        if (b === 12) {
          b = b << 8 | stream.readUInt8();
        }

        var _field = this.fields[b];

        if (!_field) {
          throw new Error("Unknown operator " + b);
        }

        var val = this.decodeOperands(_field[2], stream, ret, operands);

        if (val != null) {
          if (val instanceof restructure_src_utils__WEBPACK_IMPORTED_MODULE_1__.PropertyDescriptor) {
            Object.defineProperty(ret, _field[1], val);
          } else {
            ret[_field[1]] = val;
          }
        }

        operands = [];
      } else {
        operands.push(CFFOperand.decode(stream, b));
      }
    }

    return ret;
  };

  _proto.size = function size(dict, parent, includePointers) {
    if (includePointers === void 0) {
      includePointers = true;
    }

    var ctx = {
      parent: parent,
      val: dict,
      pointerSize: 0,
      startOffset: parent.startOffset || 0
    };
    var len = 0;

    for (var k in this.fields) {
      var field = this.fields[k];
      var val = dict[field[1]];

      if (val == null || deep_equal__WEBPACK_IMPORTED_MODULE_2___default()(val, field[3])) {
        continue;
      }

      var operands = this.encodeOperands(field[2], null, ctx, val);

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(operands), _step2; !(_step2 = _iterator2()).done;) {
        var op = _step2.value;
        len += CFFOperand.size(op);
      }

      var key = Array.isArray(field[0]) ? field[0] : [field[0]];
      len += key.length;
    }

    if (includePointers) {
      len += ctx.pointerSize;
    }

    return len;
  };

  _proto.encode = function encode(stream, dict, parent) {
    var ctx = {
      pointers: [],
      startOffset: stream.pos,
      parent: parent,
      val: dict,
      pointerSize: 0
    };
    ctx.pointerOffset = stream.pos + this.size(dict, ctx, false);

    for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.ops), _step3; !(_step3 = _iterator3()).done;) {
      var field = _step3.value;
      var val = dict[field[1]];

      if (val == null || deep_equal__WEBPACK_IMPORTED_MODULE_2___default()(val, field[3])) {
        continue;
      }

      var operands = this.encodeOperands(field[2], stream, ctx, val);

      for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(operands), _step4; !(_step4 = _iterator4()).done;) {
        var op = _step4.value;
        CFFOperand.encode(stream, op);
      }

      var key = Array.isArray(field[0]) ? field[0] : [field[0]];

      for (var _iterator5 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(key), _step5; !(_step5 = _iterator5()).done;) {
        var _op = _step5.value;
        stream.writeUInt8(_op);
      }
    }

    var i = 0;

    while (i < ctx.pointers.length) {
      var ptr = ctx.pointers[i++];
      ptr.type.encode(stream, ptr.val, ptr.parent);
    }

    return;
  };

  return CFFDict;
}();

var CFFPointer = /*#__PURE__*/function (_r$Pointer) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(CFFPointer, _r$Pointer);

  function CFFPointer(type, options) {
    if (options === void 0) {
      options = {};
    }

    if (options.type == null) {
      options.type = 'global';
    }

    return _r$Pointer.call(this, null, type, options) || this;
  }

  var _proto = CFFPointer.prototype;

  _proto.decode = function decode(stream, parent, operands) {
    this.offsetType = {
      decode: function decode() {
        return operands[0];
      }
    };
    return _r$Pointer.prototype.decode.call(this, stream, parent, operands);
  };

  _proto.encode = function encode(stream, value, ctx) {
    if (!stream) {
      // compute the size (so ctx.pointerSize is correct)
      this.offsetType = {
        size: function size() {
          return 0;
        }
      };
      this.size(value, ctx);
      return [new Ptr(0)];
    }

    var ptr = null;
    this.offsetType = {
      encode: function encode(stream, val) {
        return ptr = val;
      }
    };

    _r$Pointer.prototype.encode.call(this, stream, value, ctx);

    return [new Ptr(ptr)];
  };

  return CFFPointer;
}((restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer));

var Ptr = /*#__PURE__*/function () {
  function Ptr(val) {
    this.val = val;
    this.forceLarge = true;
  }

  var _proto2 = Ptr.prototype;

  _proto2.valueOf = function valueOf() {
    return this.val;
  };

  return Ptr;
}();

var CFFBlendOp = /*#__PURE__*/function () {
  function CFFBlendOp() {}

  CFFBlendOp.decode = function decode(stream, parent, operands) {
    var numBlends = operands.pop(); // TODO: actually blend. For now just consume the deltas
    // since we don't use any of the values anyway.

    while (operands.length > numBlends) {
      operands.pop();
    }
  };

  return CFFBlendOp;
}();

var CFFPrivateDict = new CFFDict([// key       name                    type                                          default
[6, 'BlueValues', 'delta', null], [7, 'OtherBlues', 'delta', null], [8, 'FamilyBlues', 'delta', null], [9, 'FamilyOtherBlues', 'delta', null], [[12, 9], 'BlueScale', 'number', 0.039625], [[12, 10], 'BlueShift', 'number', 7], [[12, 11], 'BlueFuzz', 'number', 1], [10, 'StdHW', 'number', null], [11, 'StdVW', 'number', null], [[12, 12], 'StemSnapH', 'delta', null], [[12, 13], 'StemSnapV', 'delta', null], [[12, 14], 'ForceBold', 'boolean', false], [[12, 17], 'LanguageGroup', 'number', 0], [[12, 18], 'ExpansionFactor', 'number', 0.06], [[12, 19], 'initialRandomSeed', 'number', 0], [20, 'defaultWidthX', 'number', 0], [21, 'nominalWidthX', 'number', 0], [22, 'vsindex', 'number', 0], [23, 'blend', CFFBlendOp, null], [19, 'Subrs', new CFFPointer(new CFFIndex(), {
  type: 'local'
}), null]]);

// Automatically generated from Appendix A of the CFF specification; do
// not edit. Length should be 391.
var standardStrings = [".notdef", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "endash", "dagger", "daggerdbl", "periodcentered", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", "questiondown", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "emdash", "AE", "ordfeminine", "Lslash", "Oslash", "OE", "ordmasculine", "ae", "dotlessi", "lslash", "oslash", "oe", "germandbls", "onesuperior", "logicalnot", "mu", "trademark", "Eth", "onehalf", "plusminus", "Thorn", "onequarter", "divide", "brokenbar", "degree", "thorn", "threequarters", "twosuperior", "registered", "minus", "eth", "multiply", "threesuperior", "copyright", "Aacute", "Acircumflex", "Adieresis", "Agrave", "Aring", "Atilde", "Ccedilla", "Eacute", "Ecircumflex", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Ntilde", "Oacute", "Ocircumflex", "Odieresis", "Ograve", "Otilde", "Scaron", "Uacute", "Ucircumflex", "Udieresis", "Ugrave", "Yacute", "Ydieresis", "Zcaron", "aacute", "acircumflex", "adieresis", "agrave", "aring", "atilde", "ccedilla", "eacute", "ecircumflex", "edieresis", "egrave", "iacute", "icircumflex", "idieresis", "igrave", "ntilde", "oacute", "ocircumflex", "odieresis", "ograve", "otilde", "scaron", "uacute", "ucircumflex", "udieresis", "ugrave", "yacute", "ydieresis", "zcaron", "exclamsmall", "Hungarumlautsmall", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "twodotenleader", "onedotenleader", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "isuperior", "lsuperior", "msuperior", "nsuperior", "osuperior", "rsuperior", "ssuperior", "tsuperior", "ff", "ffi", "ffl", "parenleftinferior", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "exclamdownsmall", "centoldstyle", "Lslashsmall", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall", "Dotaccentsmall", "Macronsmall", "figuredash", "hypheninferior", "Ogoneksmall", "Ringsmall", "Cedillasmall", "questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "zerosuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall", "001.000", "001.001", "001.002", "001.003", "Black", "Bold", "Book", "Light", "Medium", "Regular", "Roman", "Semibold"];

var StandardEncoding = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger', 'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron', 'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '', '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '', 'lslash', 'oslash', 'oe', 'germandbls'];
var ExpertEncoding = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior', 'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior', '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters', 'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '', '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

var ISOAdobeCharset = ['.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', 'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu', 'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn', 'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright', 'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex', 'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave', 'yacute', 'ydieresis', 'zcaron'];
var ExpertCharset = ['.notdef', 'space', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior', 'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall', 'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', 'onequarter', 'onehalf', 'threequarters', 'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];
var ExpertSubsetCharset = ['.notdef', 'space', 'dollaroldstyle', 'dollarsuperior', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior', 'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior', 'hyphensuperior', 'colonmonetary', 'onefitted', 'rupiah', 'centoldstyle', 'figuredash', 'hypheninferior', 'onequarter', 'onehalf', 'threequarters', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior'];

// Scripts and Languages #
//########################

var LangSysTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  reqFeatureIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  featureCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  featureIndexes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'featureCount')
});
var LangSysRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  langSys: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LangSysTable, {
    type: 'parent'
  })
});
var Script = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  defaultLangSys: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LangSysTable),
  count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  langSysRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LangSysRecord, 'count')
});
var ScriptRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  script: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Script, {
    type: 'parent'
  })
});
var ScriptList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ScriptRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)); //#######################
// Features and Lookups #
//#######################

var Feature = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  featureParams: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // pointer
  lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupListIndexes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'lookupCount')
});
var FeatureRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  feature: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Feature, {
    type: 'parent'
  })
});
var FeatureList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatureRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var LookupFlags = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  markAttachmentType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  flags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), ['rightToLeft', 'ignoreBaseGlyphs', 'ignoreLigatures', 'ignoreMarks', 'useMarkFilteringSet'])
});
function LookupList(SubTable) {
  var Lookup = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    lookupType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    flags: LookupFlags,
    subTableCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    subTables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), SubTable), 'subTableCount'),
    markFilteringSet: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Optional)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
      return t.flags.flags.useMarkFilteringSet;
    })
  });
  return new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Lookup), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
} //#################
// Coverage Table #
//#################

var RangeRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  start: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  end: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  startCoverageIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var Coverage = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyphs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'glyphCount')
  },
  2: {
    rangeCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    rangeRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(RangeRecord, 'rangeCount')
  }
}); //#########################
// Class Definition Table #
//#########################

var ClassRangeRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  start: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  end: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  class: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var ClassDef = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Class array
    startGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    classValueArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'glyphCount')
  },
  2: {
    // Class ranges
    classRangeCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    classRangeRecord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ClassRangeRecord, 'classRangeCount')
  }
}); //###############
// Device Table #
//###############

var Device = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  a: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // startSize for hinting Device, outerIndex for VariationIndex
  b: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // endSize for Device, innerIndex for VariationIndex
  deltaFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
}); //#############################################
// Contextual Substitution/Positioning Tables #
//#############################################

var LookupRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  sequenceIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupListIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var Rule = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  input: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.glyphCount - 1;
  }),
  lookupRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupRecord, 'lookupCount')
});
var RuleSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Rule), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var ClassRule = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  classes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.glyphCount - 1;
  }),
  lookupRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupRecord, 'lookupCount')
});
var ClassSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassRule), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var Context = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Simple context
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    ruleSetCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    ruleSets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), RuleSet), 'ruleSetCount')
  },
  2: {
    // Class-based context
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    classDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
    classSetCnt: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    classSet: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassSet), 'classSetCnt')
  },
  3: {
    glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverages: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'glyphCount'),
    lookupRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupRecord, 'lookupCount')
  }
}); //######################################################
// Chaining Contextual Substitution/Positioning Tables #
//######################################################

var ChainRule = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  backtrackGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  backtrack: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'backtrackGlyphCount'),
  inputGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  input: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.inputGlyphCount - 1;
  }),
  lookaheadGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookahead: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'lookaheadGlyphCount'),
  lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupRecord, 'lookupCount')
});
var ChainRuleSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ChainRule), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var ChainingContext = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Simple context glyph substitution
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    chainCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    chainRuleSets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ChainRuleSet), 'chainCount')
  },
  2: {
    // Class-based chaining context
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    backtrackClassDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
    inputClassDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
    lookaheadClassDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
    chainCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    chainClassSet: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ChainRuleSet), 'chainCount')
  },
  3: {
    // Coverage-based chaining context
    backtrackGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    backtrackCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'backtrackGlyphCount'),
    inputGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    inputCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'inputGlyphCount'),
    lookaheadGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookaheadCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'lookaheadGlyphCount'),
    lookupCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookupRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupRecord, 'lookupCount')
  }
});

var _;
/*******************
 * Variation Store *
 *******************/

var F2DOT14 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Fixed)(16, 'BE', 14);
var RegionAxisCoordinates = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  startCoord: F2DOT14,
  peakCoord: F2DOT14,
  endCoord: F2DOT14
});
var VariationRegionList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  axisCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  regionCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  variationRegions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(RegionAxisCoordinates, 'axisCount'), 'regionCount')
});
var DeltaSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  shortDeltas: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), function (t) {
    return t.parent.shortDeltaCount;
  }),
  regionDeltas: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int8), function (t) {
    return t.parent.regionIndexCount - t.parent.shortDeltaCount;
  }),
  deltas: function deltas(t) {
    return t.shortDeltas.concat(t.regionDeltas);
  }
});
var ItemVariationData = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  itemCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  shortDeltaCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  regionIndexCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  regionIndexes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'regionIndexCount'),
  deltaSets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(DeltaSet, 'itemCount')
});
var ItemVariationStore = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  variationRegionList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), VariationRegionList),
  variationDataCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  itemVariationData: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ItemVariationData), 'variationDataCount')
});
/**********************
 * Feature Variations *
 **********************/

var ConditionTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: (_ = {
    axisIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  }, _["axisIndex"] = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), _.filterRangeMinValue = F2DOT14, _.filterRangeMaxValue = F2DOT14, _)
});
var ConditionSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  conditionCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  conditionTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ConditionTable), 'conditionCount')
});
var FeatureTableSubstitutionRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  featureIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  alternateFeatureTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), Feature, {
    type: 'parent'
  })
});
var FeatureTableSubstitution = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  substitutionCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  substitutions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatureTableSubstitutionRecord, 'substitutionCount')
});
var FeatureVariationRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  conditionSet: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ConditionSet, {
    type: 'parent'
  }),
  featureTableSubstitution: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), FeatureTableSubstitution, {
    type: 'parent'
  })
});
var FeatureVariations = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  majorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  minorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  featureVariationRecordCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  featureVariationRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatureVariationRecord, 'featureVariationRecordCount')
});

// otherwise delegates to the provided type.

var PredefinedOp = /*#__PURE__*/function () {
  function PredefinedOp(predefinedOps, type) {
    this.predefinedOps = predefinedOps;
    this.type = type;
  }

  var _proto = PredefinedOp.prototype;

  _proto.decode = function decode(stream, parent, operands) {
    if (this.predefinedOps[operands[0]]) {
      return this.predefinedOps[operands[0]];
    }

    return this.type.decode(stream, parent, operands);
  };

  _proto.size = function size(value, ctx) {
    return this.type.size(value, ctx);
  };

  _proto.encode = function encode(stream, value, ctx) {
    var index = this.predefinedOps.indexOf(value);

    if (index !== -1) {
      return index;
    }

    return this.type.encode(stream, value, ctx);
  };

  return PredefinedOp;
}();

var CFFEncodingVersion = /*#__PURE__*/function (_r$Number) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(CFFEncodingVersion, _r$Number);

  function CFFEncodingVersion() {
    return _r$Number.call(this, 'UInt8') || this;
  }

  var _proto2 = CFFEncodingVersion.prototype;

  _proto2.decode = function decode(stream) {
    return restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8.decode(stream) & 0x7f;
  };

  return CFFEncodingVersion;
}((restructure__WEBPACK_IMPORTED_MODULE_0___default().Number));

var Range1 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  first: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nLeft: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var Range2 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  first: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nLeft: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var CFFCustomEncoding = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)(new CFFEncodingVersion(), {
  0: {
    nCodes: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    codes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 'nCodes')
  },
  1: {
    nRanges: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    ranges: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Range1, 'nRanges')
  } // TODO: supplement?

});
var CFFEncoding = new PredefinedOp([StandardEncoding, ExpertEncoding], new CFFPointer(CFFCustomEncoding, {
  lazy: true
})); // Decodes an array of ranges until the total
// length is equal to the provided length.

var RangeArray = /*#__PURE__*/function (_r$Array) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(RangeArray, _r$Array);

  function RangeArray() {
    return _r$Array.apply(this, arguments) || this;
  }

  var _proto3 = RangeArray.prototype;

  _proto3.decode = function decode(stream, parent) {
    var length = (0,restructure_src_utils__WEBPACK_IMPORTED_MODULE_1__.resolveLength)(this.length, stream, parent);
    var count = 0;
    var res = [];

    while (count < length) {
      var range = this.type.decode(stream, parent);
      range.offset = count;
      count += range.nLeft + 1;
      res.push(range);
    }

    return res;
  };

  return RangeArray;
}((restructure__WEBPACK_IMPORTED_MODULE_0___default().Array));

var CFFCustomCharset = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), {
  0: {
    glyphs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
      return t.parent.CharStrings.length - 1;
    })
  },
  1: {
    ranges: new RangeArray(Range1, function (t) {
      return t.parent.CharStrings.length - 1;
    })
  },
  2: {
    ranges: new RangeArray(Range2, function (t) {
      return t.parent.CharStrings.length - 1;
    })
  }
});
var CFFCharset = new PredefinedOp([ISOAdobeCharset, ExpertCharset, ExpertSubsetCharset], new CFFPointer(CFFCustomCharset, {
  lazy: true
}));
var FDRange3 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  first: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  fd: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var FDRange4 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  first: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  fd: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var FDSelect = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), {
  0: {
    fds: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
      return t.parent.CharStrings.length;
    })
  },
  3: {
    nRanges: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    ranges: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FDRange3, 'nRanges'),
    sentinel: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  4: {
    nRanges: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    ranges: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FDRange4, 'nRanges'),
    sentinel: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
  }
});
var ptr = new CFFPointer(CFFPrivateDict);

var CFFPrivateOp = /*#__PURE__*/function () {
  function CFFPrivateOp() {}

  var _proto4 = CFFPrivateOp.prototype;

  _proto4.decode = function decode(stream, parent, operands) {
    parent.length = operands[0];
    return ptr.decode(stream, parent, [operands[1]]);
  };

  _proto4.size = function size(dict, ctx) {
    return [CFFPrivateDict.size(dict, ctx, false), ptr.size(dict, ctx)[0]];
  };

  _proto4.encode = function encode(stream, dict, ctx) {
    return [CFFPrivateDict.size(dict, ctx, false), ptr.encode(stream, dict, ctx)[0]];
  };

  return CFFPrivateOp;
}();

var FontDict = new CFFDict([// key       name                   type(s)                                 default
[18, 'Private', new CFFPrivateOp(), null], [[12, 38], 'FontName', 'sid', null], [[12, 7], 'FontMatrix', 'array', [0.001, 0, 0, 0.001, 0, 0]], [[12, 5], 'PaintType', 'number', 0]]);
var CFFTopDict = new CFFDict([// key       name                   type(s)                                 default
[[12, 30], 'ROS', ['sid', 'sid', 'number'], null], [0, 'version', 'sid', null], [1, 'Notice', 'sid', null], [[12, 0], 'Copyright', 'sid', null], [2, 'FullName', 'sid', null], [3, 'FamilyName', 'sid', null], [4, 'Weight', 'sid', null], [[12, 1], 'isFixedPitch', 'boolean', false], [[12, 2], 'ItalicAngle', 'number', 0], [[12, 3], 'UnderlinePosition', 'number', -100], [[12, 4], 'UnderlineThickness', 'number', 50], [[12, 5], 'PaintType', 'number', 0], [[12, 6], 'CharstringType', 'number', 2], [[12, 7], 'FontMatrix', 'array', [0.001, 0, 0, 0.001, 0, 0]], [13, 'UniqueID', 'number', null], [5, 'FontBBox', 'array', [0, 0, 0, 0]], [[12, 8], 'StrokeWidth', 'number', 0], [14, 'XUID', 'array', null], [15, 'charset', CFFCharset, ISOAdobeCharset], [16, 'Encoding', CFFEncoding, StandardEncoding], [17, 'CharStrings', new CFFPointer(new CFFIndex()), null], [18, 'Private', new CFFPrivateOp(), null], [[12, 20], 'SyntheticBase', 'number', null], [[12, 21], 'PostScript', 'sid', null], [[12, 22], 'BaseFontName', 'sid', null], [[12, 23], 'BaseFontBlend', 'delta', null], // CID font specific
[[12, 31], 'CIDFontVersion', 'number', 0], [[12, 32], 'CIDFontRevision', 'number', 0], [[12, 33], 'CIDFontType', 'number', 0], [[12, 34], 'CIDCount', 'number', 8720], [[12, 35], 'UIDBase', 'number', null], [[12, 37], 'FDSelect', new CFFPointer(FDSelect), null], [[12, 36], 'FDArray', new CFFPointer(new CFFIndex(FontDict)), null], [[12, 38], 'FontName', 'sid', null]]);
var VariationStore = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  itemVariationStore: ItemVariationStore
});
var CFF2TopDict = new CFFDict([[[12, 7], 'FontMatrix', 'array', [0.001, 0, 0, 0.001, 0, 0]], [17, 'CharStrings', new CFFPointer(new CFFIndex()), null], [[12, 37], 'FDSelect', new CFFPointer(FDSelect), null], [[12, 36], 'FDArray', new CFFPointer(new CFFIndex(FontDict)), null], [24, 'vstore', new CFFPointer(VariationStore), null], [25, 'maxstack', 'number', 193]]);
var CFFTop = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed16), {
  1: {
    hdrSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    offSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    nameIndex: new CFFIndex(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)('length')),
    topDictIndex: new CFFIndex(CFFTopDict),
    stringIndex: new CFFIndex(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)('length')),
    globalSubrIndex: new CFFIndex()
  },
  2: {
    hdrSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    topDict: CFF2TopDict,
    globalSubrIndex: new CFFIndex()
  }
});

var CFFFont = /*#__PURE__*/function () {
  function CFFFont(stream) {
    this.stream = stream;
    this.decode();
  }

  CFFFont.decode = function decode(stream) {
    return new CFFFont(stream);
  };

  var _proto = CFFFont.prototype;

  _proto.decode = function decode() {
    this.stream.pos;
    var top = CFFTop.decode(this.stream);

    for (var key in top) {
      var val = top[key];
      this[key] = val;
    }

    if (this.version < 2) {
      if (this.topDictIndex.length !== 1) {
        throw new Error("Only a single font is allowed in CFF");
      }

      this.topDict = this.topDictIndex[0];
    }

    this.isCIDFont = this.topDict.ROS != null;
    return this;
  };

  _proto.string = function string(sid) {
    if (this.version >= 2) {
      return null;
    }

    if (sid < standardStrings.length) {
      return standardStrings[sid];
    }

    return this.stringIndex[sid - standardStrings.length];
  };

  _proto.getCharString = function getCharString(glyph) {
    this.stream.pos = this.topDict.CharStrings[glyph].offset;
    return this.stream.readBuffer(this.topDict.CharStrings[glyph].length);
  };

  _proto.getGlyphName = function getGlyphName(gid) {
    // CFF2 glyph names are in the post table.
    if (this.version >= 2) {
      return null;
    } // CID-keyed fonts don't have glyph names


    if (this.isCIDFont) {
      return null;
    }

    var charset = this.topDict.charset;

    if (Array.isArray(charset)) {
      return charset[gid];
    }

    if (gid === 0) {
      return '.notdef';
    }

    gid -= 1;

    switch (charset.version) {
      case 0:
        return this.string(charset.glyphs[gid]);

      case 1:
      case 2:
        for (var i = 0; i < charset.ranges.length; i++) {
          var range = charset.ranges[i];

          if (range.offset <= gid && gid <= range.offset + range.nLeft) {
            return this.string(range.first + (gid - range.offset));
          }
        }

        break;
    }

    return null;
  };

  _proto.fdForGlyph = function fdForGlyph(gid) {
    if (!this.topDict.FDSelect) {
      return null;
    }

    switch (this.topDict.FDSelect.version) {
      case 0:
        return this.topDict.FDSelect.fds[gid];

      case 3:
      case 4:
        var ranges = this.topDict.FDSelect.ranges;
        var low = 0;
        var high = ranges.length - 1;

        while (low <= high) {
          var mid = low + high >> 1;

          if (gid < ranges[mid].first) {
            high = mid - 1;
          } else if (mid < high && gid >= ranges[mid + 1].first) {
            low = mid + 1;
          } else {
            return ranges[mid].fd;
          }
        }

      default:
        throw new Error("Unknown FDSelect version: " + this.topDict.FDSelect.version);
    }
  };

  _proto.privateDictForGlyph = function privateDictForGlyph(gid) {
    if (this.topDict.FDSelect) {
      var fd = this.fdForGlyph(gid);

      if (this.topDict.FDArray[fd]) {
        return this.topDict.FDArray[fd].Private;
      }

      return null;
    }

    if (this.version < 2) {
      return this.topDict.Private;
    }

    return this.topDict.FDArray[0].Private;
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(CFFFont, [{
    key: "postscriptName",
    get: function get() {
      if (this.version < 2) {
        return this.nameIndex[0];
      }

      return null;
    }
  }, {
    key: "fullName",
    get: function get() {
      return this.string(this.topDict.FullName);
    }
  }, {
    key: "familyName",
    get: function get() {
      return this.string(this.topDict.FamilyName);
    }
  }]);

  return CFFFont;
}();

var VerticalOrigin = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyphIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  vertOriginY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
});
var VORG = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  majorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  minorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  defaultVertOriginY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  numVertOriginYMetrics: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  metrics: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(VerticalOrigin, 'numVertOriginYMetrics')
});

var BigMetrics = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  height: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  width: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  horiBearingX: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  horiBearingY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  horiAdvance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  vertBearingX: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  vertBearingY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  vertAdvance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var SmallMetrics = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  height: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  width: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  bearingX: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  bearingY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  advance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var EBDTComponent = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  xOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  yOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8)
});

var ByteAligned = function ByteAligned() {};

var BitAligned = function BitAligned() {};

new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('version', {
  1: {
    metrics: SmallMetrics,
    data: ByteAligned
  },
  2: {
    metrics: SmallMetrics,
    data: BitAligned
  },
  // format 3 is deprecated
  // format 4 is not supported by Microsoft
  5: {
    data: BitAligned
  },
  6: {
    metrics: BigMetrics,
    data: ByteAligned
  },
  7: {
    metrics: BigMetrics,
    data: BitAligned
  },
  8: {
    metrics: SmallMetrics,
    pad: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)),
    numComponents: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    components: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(EBDTComponent, 'numComponents')
  },
  9: {
    metrics: BigMetrics,
    pad: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)),
    numComponents: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    components: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(EBDTComponent, 'numComponents')
  },
  17: {
    metrics: SmallMetrics,
    dataLen: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    data: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)('dataLen')
  },
  18: {
    metrics: BigMetrics,
    dataLen: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    data: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)('dataLen')
  },
  19: {
    dataLen: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    data: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)('dataLen')
  }
});

var SBitLineMetrics = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  ascender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  descender: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  widthMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  caretSlopeNumerator: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  caretSlopeDenominator: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  caretOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  minOriginSB: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  minAdvanceSB: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  maxBeforeBL: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  minAfterBL: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int8),
  pad: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int8), 2)
});
var CodeOffsetPair = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyphCode: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  offset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var IndexSubtable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  header: {
    imageFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    imageDataOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
  },
  1: {
    offsetArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), function (t) {
      return t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1;
    })
  },
  2: {
    imageSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    bigMetrics: BigMetrics
  },
  3: {
    offsetArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
      return t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1;
    })
  },
  4: {
    numGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    glyphArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(CodeOffsetPair, function (t) {
      return t.numGlyphs + 1;
    })
  },
  5: {
    imageSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    bigMetrics: BigMetrics,
    numGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    glyphCodeArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numGlyphs')
  }
});
var IndexSubtableArray = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  firstGlyphIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lastGlyphIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  subtable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), IndexSubtable)
});
var BitmapSizeTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  indexSubTableArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(IndexSubtableArray, 1), {
    type: 'parent'
  }),
  indexTablesSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  numberOfIndexSubTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  colorRef: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  hori: SBitLineMetrics,
  vert: SBitLineMetrics,
  startGlyphIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  endGlyphIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  ppemX: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  ppemY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  bitDepth: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  flags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), ['horizontal', 'vertical'])
});
var EBLC = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  // 0x00020000
  numSizes: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  sizes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(BitmapSizeTable, 'numSizes')
});

var ImageTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  ppem: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  resolution: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  imageOffsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'void'), function (t) {
    return t.parent.parent.maxp.numGlyphs + 1;
  })
}); // This is the Apple sbix table, used by the "Apple Color Emoji" font.
// It includes several image tables with images for each bitmap glyph
// of several different sizes.

var sbix = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  flags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ['renderOutlines']),
  numImgTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  imageTables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ImageTable), 'numImgTables')
});

var LayerRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  gid: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Glyph ID of layer glyph (must be in z-order from bottom to top).
  paletteIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // Index value to use in the appropriate palette. This value must

}); // be less than numPaletteEntries in the CPAL table, except for
// the special case noted below. Each palette entry is 16 bits.
// A palette index of 0xFFFF is a special case indicating that
// the text foreground color should be used.

var BaseGlyphRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  gid: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Glyph ID of reference glyph. This glyph is for reference only
  // and is not rendered for color.
  firstLayerIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Index (from beginning of the Layer Records) to the layer record.
  // There will be numLayers consecutive entries for this base glyph.
  numLayers: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var COLR = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  numBaseGlyphRecords: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  baseGlyphRecord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(BaseGlyphRecord, 'numBaseGlyphRecords')),
  layerRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LayerRecord, 'numLayerRecords'), {
    lazy: true
  }),
  numLayerRecords: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});

var ColorRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  blue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  green: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  red: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  alpha: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8)
});
var CPAL = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  header: {
    numPaletteEntries: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    numPalettes: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    numColorRecords: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    colorRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ColorRecord, 'numColorRecords')),
    colorRecordIndices: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numPalettes')
  },
  0: {},
  1: {
    offsetPaletteTypeArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'numPalettes')),
    offsetPaletteLabelArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numPalettes')),
    offsetPaletteEntryLabelArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numPaletteEntries'))
  }
});

var BaseCoord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Design units only
    coordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16) // X or Y value, in design units

  },
  2: {
    // Design units plus contour point
    coordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // X or Y value, in design units
    referenceGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // GlyphID of control glyph
    baseCoordPoint: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // Index of contour point on the referenceGlyph

  },
  3: {
    // Design units plus Device table
    coordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    // X or Y value, in design units
    deviceTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device) // Device table for X or Y value

  }
});
var BaseValues = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  defaultIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Index of default baseline for this script-same index in the BaseTagList
  baseCoordCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  baseCoords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseCoord), 'baseCoordCount')
});
var FeatMinMaxRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  // 4-byte feature identification tag-must match FeatureTag in FeatureList
  minCoord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseCoord, {
    type: 'parent'
  }),
  // May be NULL
  maxCoord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseCoord, {
    type: 'parent'
  }) // May be NULL

});
var MinMax = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  minCoord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseCoord),
  // May be NULL
  maxCoord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseCoord),
  // May be NULL
  featMinMaxCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // May be 0
  featMinMaxRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatMinMaxRecord, 'featMinMaxCount') // In alphabetical order

});
var BaseLangSysRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  // 4-byte language system identification tag
  minMax: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MinMax, {
    type: 'parent'
  })
});
var BaseScript = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  baseValues: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseValues),
  // May be NULL
  defaultMinMax: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MinMax),
  // May be NULL
  baseLangSysCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // May be 0
  baseLangSysRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(BaseLangSysRecord, 'baseLangSysCount') // in alphabetical order by BaseLangSysTag

});
var BaseScriptRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  // 4-byte script identification tag
  script: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseScript, {
    type: 'parent'
  })
});
var BaseScriptList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(BaseScriptRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)); // Array of 4-byte baseline identification tags-must be in alphabetical order

var BaseTagList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var Axis$1 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  baseTagList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseTagList),
  // May be NULL
  baseScriptList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseScriptList)
});
var BASE = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), {
  header: {
    horizAxis: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Axis$1),
    // May be NULL
    vertAxis: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Axis$1) // May be NULL

  },
  0x00010000: {},
  0x00010001: {
    itemVariationStore: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ItemVariationStore)
  }
});

var AttachPoint = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var AttachList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
  glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  attachPoints: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), AttachPoint), 'glyphCount')
});
var CaretValue = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Design units only
    coordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
  },
  2: {
    // Contour point
    caretValuePoint: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  3: {
    // Design units plus Device table
    coordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    deviceTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device)
  }
});
var LigGlyph = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), CaretValue), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var LigCaretList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
  ligGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  ligGlyphs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LigGlyph), 'ligGlyphCount')
});
var MarkGlyphSetsDef = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  markSetTableFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  markSetCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), Coverage), 'markSetCount')
});
var GDEF = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), {
  header: {
    glyphClassDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
    attachList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), AttachList),
    ligCaretList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LigCaretList),
    markAttachClassDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef)
  },
  0x00010000: {},
  0x00010002: {
    markGlyphSetsDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MarkGlyphSetsDef)
  },
  0x00010003: {
    markGlyphSetsDef: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MarkGlyphSetsDef),
    itemVariationStore: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ItemVariationStore)
  }
});

var ValueFormat = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ['xPlacement', 'yPlacement', 'xAdvance', 'yAdvance', 'xPlaDevice', 'yPlaDevice', 'xAdvDevice', 'yAdvDevice']);
var types = {
  xPlacement: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yPlacement: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  xAdvance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yAdvance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  xPlaDevice: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device, {
    type: 'global',
    relativeTo: 'rel'
  }),
  yPlaDevice: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device, {
    type: 'global',
    relativeTo: 'rel'
  }),
  xAdvDevice: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device, {
    type: 'global',
    relativeTo: 'rel'
  }),
  yAdvDevice: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device, {
    type: 'global',
    relativeTo: 'rel'
  })
};

var ValueRecord = /*#__PURE__*/function () {
  function ValueRecord(key) {
    if (key === void 0) {
      key = 'valueFormat';
    }

    this.key = key;
  }

  var _proto = ValueRecord.prototype;

  _proto.buildStruct = function buildStruct(parent) {
    var struct = parent;

    while (!struct[this.key] && struct.parent) {
      struct = struct.parent;
    }

    if (!struct[this.key]) return;
    var fields = {};

    fields.rel = function () {
      return struct._startOffset;
    };

    var format = struct[this.key];

    for (var key in format) {
      if (format[key]) {
        fields[key] = types[key];
      }
    }

    return new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)(fields);
  };

  _proto.size = function size(val, ctx) {
    return this.buildStruct(ctx).size(val, ctx);
  };

  _proto.decode = function decode(stream, parent) {
    var res = this.buildStruct(parent).decode(stream, parent);
    delete res.rel;
    return res;
  };

  return ValueRecord;
}();

var PairValueRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  secondGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  value1: new ValueRecord('valueFormat1'),
  value2: new ValueRecord('valueFormat2')
});
var PairSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(PairValueRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var Class2Record = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  value1: new ValueRecord('valueFormat1'),
  value2: new ValueRecord('valueFormat2')
});
var Anchor = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  1: {
    // Design units only
    xCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    yCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
  },
  2: {
    // Design units plus contour point
    xCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    yCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    anchorPoint: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  3: {
    // Design units plus Device tables
    xCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    yCoordinate: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
    xDeviceTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device),
    yDeviceTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Device)
  }
});
var EntryExitRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  entryAnchor: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Anchor, {
    type: 'parent'
  }),
  exitAnchor: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Anchor, {
    type: 'parent'
  })
});
var MarkRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  class: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  markAnchor: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Anchor, {
    type: 'parent'
  })
});
var MarkArray = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(MarkRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var BaseRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Anchor), function (t) {
  return t.parent.classCount;
});
var BaseArray = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(BaseRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var ComponentRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Anchor), function (t) {
  return t.parent.parent.classCount;
});
var LigatureAttach = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ComponentRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var LigatureArray = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LigatureAttach), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var GPOSLookup = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('lookupType', {
  1: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
    // Single Adjustment
    1: {
      // Single positioning value
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      valueFormat: ValueFormat,
      value: new ValueRecord()
    },
    2: {
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      valueFormat: ValueFormat,
      valueCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      values: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new ValueRecord(), 'valueCount')
    }
  }),
  2: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
    // Pair Adjustment Positioning
    1: {
      // Adjustments for glyph pairs
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      valueFormat1: ValueFormat,
      valueFormat2: ValueFormat,
      pairSetCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      pairSets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), PairSet), 'pairSetCount')
    },
    2: {
      // Class pair adjustment
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      valueFormat1: ValueFormat,
      valueFormat2: ValueFormat,
      classDef1: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
      classDef2: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassDef),
      class1Count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      class2Count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      classRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(Class2Record, 'class2Count'), 'class1Count')
    }
  }),
  3: {
    // Cursive Attachment Positioning
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    entryExitCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    entryExitRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(EntryExitRecord, 'entryExitCount')
  },
  4: {
    // MarkToBase Attachment Positioning
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    markCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    baseCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    classCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    markArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MarkArray),
    baseArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseArray)
  },
  5: {
    // MarkToLigature Attachment Positioning
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    markCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    ligatureCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    classCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    markArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MarkArray),
    ligatureArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LigatureArray)
  },
  6: {
    // MarkToMark Attachment Positioning
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    mark1Coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    mark2Coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    classCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    mark1Array: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), MarkArray),
    mark2Array: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), BaseArray)
  },
  7: Context,
  // Contextual positioning
  8: ChainingContext,
  // Chaining contextual positioning
  9: {
    // Extension Positioning
    posFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookupType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // cannot also be 9
    extension: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), undefined)
  }
}); // Fix circular reference

GPOSLookup.versions[9].extension.type = GPOSLookup;
var GPOS = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), {
  header: {
    scriptList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ScriptList),
    featureList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), FeatureList),
    lookupList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new LookupList(GPOSLookup))
  },
  0x00010000: {},
  0x00010001: {
    featureVariations: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), FeatureVariations)
  }
}); // export GPOSLookup for JSTF table

var Sequence = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var AlternateSet = Sequence;
var Ligature = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  glyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  compCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  components: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.compCount - 1;
  })
});
var LigatureSet = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Ligature), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var GSUBLookup = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('lookupType', {
  1: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
    // Single Substitution
    1: {
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      deltaGlyphID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
    },
    2: {
      coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
      glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      substitute: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'glyphCount')
    }
  }),
  2: {
    // Multiple Substitution
    substFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    sequences: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Sequence), 'count')
  },
  3: {
    // Alternate Substitution
    substFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    alternateSet: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), AlternateSet), 'count')
  },
  4: {
    // Ligature Substitution
    substFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    ligatureSets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), LigatureSet), 'count')
  },
  5: Context,
  // Contextual Substitution
  6: ChainingContext,
  // Chaining Contextual Substitution
  7: {
    // Extension Substitution
    substFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookupType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // cannot also be 7
    extension: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), undefined)
  },
  8: {
    // Reverse Chaining Contextual Single Substitution
    substFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage),
    backtrackCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'backtrackGlyphCount'),
    lookaheadGlyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    lookaheadCoverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Coverage), 'lookaheadGlyphCount'),
    glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    substitutes: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'glyphCount')
  }
}); // Fix circular reference

GSUBLookup.versions[7].extension.type = GSUBLookup;
var GSUB = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), {
  header: {
    scriptList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ScriptList),
    featureList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), FeatureList),
    lookupList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new LookupList(GSUBLookup))
  },
  0x00010000: {},
  0x00010001: {
    featureVariations: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), FeatureVariations)
  }
});

var JstfGSUBModList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var JstfPriority = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  shrinkageEnableGSUB: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  shrinkageDisableGSUB: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  shrinkageEnableGPOS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  shrinkageDisableGPOS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  shrinkageJstfMax: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new LookupList(GPOSLookup)),
  extensionEnableGSUB: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  extensionDisableGSUB: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  extensionEnableGPOS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  extensionDisableGPOS: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfGSUBModList),
  extensionJstfMax: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new LookupList(GPOSLookup))
});
var JstfLangSys = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfPriority), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16));
var JstfLangSysRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  jstfLangSys: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfLangSys)
});
var JstfScript = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  extenderGlyphs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))),
  // array of glyphs to extend line length
  defaultLangSys: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfLangSys),
  langSysCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  langSysRecords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(JstfLangSysRecord, 'langSysCount')
});
var JstfScriptRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  script: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JstfScript, {
    type: 'parent'
  })
});
var JSTF = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  // should be 0x00010000
  scriptCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  scriptList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(JstfScriptRecord, 'scriptCount')
});

var VariableSizeNumber = /*#__PURE__*/function () {
  function VariableSizeNumber(size) {
    this._size = size;
  }

  var _proto = VariableSizeNumber.prototype;

  _proto.decode = function decode(stream, parent) {
    switch (this.size(0, parent)) {
      case 1:
        return stream.readUInt8();

      case 2:
        return stream.readUInt16BE();

      case 3:
        return stream.readUInt24BE();

      case 4:
        return stream.readUInt32BE();
    }
  };

  _proto.size = function size(val, parent) {
    return (0,restructure_src_utils__WEBPACK_IMPORTED_MODULE_1__.resolveLength)(this._size, null, parent);
  };

  return VariableSizeNumber;
}();

var MapDataEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  entry: new VariableSizeNumber(function (t) {
    return ((t.parent.entryFormat & 0x0030) >> 4) + 1;
  }),
  outerIndex: function outerIndex(t) {
    return t.entry >> (t.parent.entryFormat & 0x000F) + 1;
  },
  innerIndex: function innerIndex(t) {
    return t.entry & (1 << (t.parent.entryFormat & 0x000F) + 1) - 1;
  }
});
var DeltaSetIndexMap = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  entryFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  mapCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  mapData: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(MapDataEntry, 'mapCount')
});
var HVAR = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  majorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  minorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  itemVariationStore: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), ItemVariationStore),
  advanceWidthMapping: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), DeltaSetIndexMap),
  LSBMapping: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), DeltaSetIndexMap),
  RSBMapping: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), DeltaSetIndexMap)
});

var Signature = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  offset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var SignatureBlock = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 2),
  cbSignature: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  // Length (in bytes) of the PKCS#7 packet in pbSignature
  signature: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)('cbSignature')
});
var DSIG = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  ulVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  // Version number of the DSIG table (0x00000001)
  usNumSigs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of signatures in the table
  usFlag: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Permission flags
  signatures: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Signature, 'usNumSigs'),
  signatureBlocks: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(SignatureBlock, 'usNumSigs')
});

var GaspRange = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  rangeMaxPPEM: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Upper limit of range, in ppem
  rangeGaspBehavior: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), [// Flags describing desired rasterizer behavior
  'grayscale', 'gridfit', 'symmetricSmoothing', 'symmetricGridfit' // only in version 1, for ClearType
  ])
});
var gasp = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // set to 0
  numRanges: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  gaspRanges: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(GaspRange, 'numRanges') // Sorted by ppem

});

var DeviceRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  pixelSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  maximumWidth: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  widths: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
    return t.parent.parent.maxp.numGlyphs;
  })
}); // The Horizontal Device Metrics table stores integer advance widths scaled to particular pixel sizes

var hdmx = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  numRecords: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  sizeDeviceRecord: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int32),
  records: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(DeviceRecord, 'numRecords')
});

var KernPair = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  left: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  right: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  value: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
});
var ClassTable$1 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  firstGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'nGlyphs'),
  max: function max(t) {
    return t.offsets.length && Math.max.apply(Math, t.offsets);
  }
});
var Kern2Array = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  off: function off(t) {
    return t._startOffset - t.parent.parent._startOffset;
  },
  len: function len(t) {
    return ((t.parent.leftTable.max - t.off) / t.parent.rowWidth + 1) * (t.parent.rowWidth / 2);
  },
  values: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 'len')
});
var KernSubtable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('format', {
  0: {
    nPairs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    searchRange: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    entrySelector: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    rangeShift: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    pairs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(KernPair, 'nPairs')
  },
  2: {
    rowWidth: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    leftTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassTable$1, {
      type: 'parent'
    }),
    rightTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassTable$1, {
      type: 'parent'
    }),
    array: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), Kern2Array, {
      type: 'parent'
    })
  },
  3: {
    glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    kernValueCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    leftClassCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    rightClassCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    kernValue: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 'kernValueCount'),
    leftClass: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 'glyphCount'),
    rightClass: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 'glyphCount'),
    kernIndex: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
      return t.leftClassCount * t.rightClassCount;
    })
  }
});
var KernTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('version', {
  0: {
    // Microsoft uses this format
    subVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Microsoft has an extra sub-table version number
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // Length of the subtable, in bytes
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    // Format of subtable
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), ['horizontal', // 1 if table has horizontal data, 0 if vertical
    'minimum', // If set to 1, the table has minimum values. If set to 0, the table has kerning values.
    'crossStream', // If set to 1, kerning is perpendicular to the flow of the text
    'override' // If set to 1 the value in this table replaces the accumulated value
    ]),
    subtable: KernSubtable,
    padding: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
      return t.length - t._currentOffset;
    })
  },
  1: {
    // Apple uses this format
    length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    coverage: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), [null, null, null, null, null, 'variation', // Set if table has variation kerning values
    'crossStream', // Set if table has cross-stream kerning values
    'vertical' // Set if table has vertical kerning values
    ]),
    format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
    tupleIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    subtable: KernSubtable,
    padding: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
      return t.length - t._currentOffset;
    })
  }
});
var kern = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
  0: {
    // Microsoft Version
    nTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    tables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(KernTable, 'nTables')
  },
  1: {
    // Apple Version
    reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
    // the other half of the version number
    nTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    tables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(KernTable, 'nTables')
  }
});

// Records the ppem for each glyph at which the scaling becomes linear again,
// despite instructions effecting the advance width

var LTSH = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  numGlyphs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  yPels: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 'numGlyphs')
});

// NOTE: The PCLT table is strongly discouraged for OpenType fonts with TrueType outlines

var PCLT = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  fontNumber: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  pitch: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  xHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  style: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  typeFamily: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  capHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  symbolSet: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  typeface: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(16),
  characterComplement: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(8),
  fileName: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(6),
  strokeWeight: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(1),
  widthType: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(1),
  serifStyle: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8))
});

// sizes. This is needed in order to match font metrics on Windows.

var Ratio = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  bCharSet: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  // Character set
  xRatio: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  // Value to use for x-Ratio
  yStartRatio: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  // Starting y-Ratio value
  yEndRatio: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8) // Ending y-Ratio value

});
var vTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  yPelHeight: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // yPelHeight to which values apply
  yMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Maximum value (in pels) for this yPelHeight
  yMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16) // Minimum value (in pels) for this yPelHeight

});
var VdmxGroup = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  recs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of height records in this group
  startsz: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  // Starting yPelHeight
  endsz: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  // Ending yPelHeight
  entries: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(vTable, 'recs') // The VDMX records

});
var VDMX = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Version number (0 or 1)
  numRecs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of VDMX groups present
  numRatios: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Number of aspect ratio groupings
  ratioRanges: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Ratio, 'numRatios'),
  // Ratio ranges
  offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numRatios'),
  // Offset to the VDMX group for this ratio range
  groups: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(VdmxGroup, 'numRecs') // The actual VDMX groupings

});

var vhea = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // Version number of the Vertical Header Table
  ascent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The vertical typographic ascender for this font
  descent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The vertical typographic descender for this font
  lineGap: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The vertical typographic line gap for this font
  advanceHeightMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The maximum advance height measurement found in the font
  minTopSideBearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The minimum top side bearing measurement found in the font
  minBottomSideBearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // The minimum bottom side bearing measurement found in the font
  yMaxExtent: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  caretSlopeRise: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Caret slope (rise/run)
  caretSlopeRun: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  caretOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Set value equal to 0 for nonslanted fonts
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 4),
  metricDataFormat: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // Set to 0
  numberOfMetrics: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16) // Number of advance heights in the Vertical Metrics table

});

var VmtxEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  advance: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  // The advance height of the glyph
  bearing: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16) // The top sidebearing of the glyph

}); // Vertical Metrics Table

var vmtx = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  metrics: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)(VmtxEntry, function (t) {
    return t.parent.vhea.numberOfMetrics;
  }),
  bearings: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().LazyArray)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), function (t) {
    return t.parent.maxp.numGlyphs - t.parent.vhea.numberOfMetrics;
  })
});

var shortFrac$1 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Fixed)(16, 'BE', 14);
var Correspondence = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  fromCoord: shortFrac$1,
  toCoord: shortFrac$1
});
var Segment = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  pairCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  correspondence: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Correspondence, 'pairCount')
});
var avar = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  axisCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  segment: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Segment, 'axisCount')
});

var UnboundedArrayAccessor = /*#__PURE__*/function () {
  function UnboundedArrayAccessor(type, stream, parent) {
    this.type = type;
    this.stream = stream;
    this.parent = parent;
    this.base = this.stream.pos;
    this._items = [];
  }

  var _proto = UnboundedArrayAccessor.prototype;

  _proto.getItem = function getItem(index) {
    if (this._items[index] == null) {
      var pos = this.stream.pos;
      this.stream.pos = this.base + this.type.size(null, this.parent) * index;
      this._items[index] = this.type.decode(this.stream, this.parent);
      this.stream.pos = pos;
    }

    return this._items[index];
  };

  _proto.inspect = function inspect() {
    return "[UnboundedArray " + this.type.constructor.name + "]";
  };

  return UnboundedArrayAccessor;
}();

var UnboundedArray = /*#__PURE__*/function (_r$Array) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(UnboundedArray, _r$Array);

  function UnboundedArray(type) {
    return _r$Array.call(this, type, 0) || this;
  }

  var _proto2 = UnboundedArray.prototype;

  _proto2.decode = function decode(stream, parent) {
    return new UnboundedArrayAccessor(this.type, stream, parent);
  };

  return UnboundedArray;
}((restructure__WEBPACK_IMPORTED_MODULE_0___default().Array));
var LookupTable = function LookupTable(ValueType) {
  if (ValueType === void 0) {
    ValueType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16);
  }

  // Helper class that makes internal structures invisible to pointers
  var Shadow = /*#__PURE__*/function () {
    function Shadow(type) {
      this.type = type;
    }

    var _proto3 = Shadow.prototype;

    _proto3.decode = function decode(stream, ctx) {
      ctx = ctx.parent.parent;
      return this.type.decode(stream, ctx);
    };

    _proto3.size = function size(val, ctx) {
      ctx = ctx.parent.parent;
      return this.type.size(val, ctx);
    };

    _proto3.encode = function encode(stream, val, ctx) {
      ctx = ctx.parent.parent;
      return this.type.encode(stream, val, ctx);
    };

    return Shadow;
  }();

  ValueType = new Shadow(ValueType);
  var BinarySearchHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    unitSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    nUnits: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    searchRange: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    entrySelector: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    rangeShift: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  });
  var LookupSegmentSingle = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    lastGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    firstGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    value: ValueType
  });
  var LookupSegmentArray = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    lastGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    firstGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    values: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ValueType, function (t) {
      return t.lastGlyph - t.firstGlyph + 1;
    }), {
      type: 'parent'
    })
  });
  var LookupSingle = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    glyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    value: ValueType
  });
  return new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), {
    0: {
      values: new UnboundedArray(ValueType) // length == number of glyphs maybe?

    },
    2: {
      binarySearchHeader: BinarySearchHeader,
      segments: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupSegmentSingle, function (t) {
        return t.binarySearchHeader.nUnits;
      })
    },
    4: {
      binarySearchHeader: BinarySearchHeader,
      segments: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupSegmentArray, function (t) {
        return t.binarySearchHeader.nUnits;
      })
    },
    6: {
      binarySearchHeader: BinarySearchHeader,
      segments: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(LookupSingle, function (t) {
        return t.binarySearchHeader.nUnits;
      })
    },
    8: {
      firstGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      count: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
      values: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(ValueType, 'count')
    }
  });
};
function StateTable(entryData, lookupType) {
  if (entryData === void 0) {
    entryData = {};
  }

  if (lookupType === void 0) {
    lookupType = (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16);
  }

  var entry = Object.assign({
    newState: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  }, entryData);
  var Entry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)(entry);
  var StateArray = new UnboundedArray(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.nClasses;
  }));
  var StateHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    nClasses: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    classTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new LookupTable(lookupType)),
    stateArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), StateArray),
    entryTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new UnboundedArray(Entry))
  });
  return StateHeader;
} // This is the old version of the StateTable structure

function StateTable1(entryData, lookupType) {
  if (entryData === void 0) {
    entryData = {};
  }

  var ClassLookupTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    version: function version() {
      return 8;
    },
    // simulate LookupTable
    firstGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    values: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))
  });
  var entry = Object.assign({
    newStateOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    // convert offset to stateArray index
    newState: function newState(t) {
      return (t.newStateOffset - (t.parent.stateArray.base - t.parent._startOffset)) / t.parent.nClasses;
    },
    flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  }, entryData);
  var Entry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)(entry);
  var StateArray = new UnboundedArray(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
    return t.nClasses;
  }));
  var StateHeader1 = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
    nClasses: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    classTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassLookupTable),
    stateArray: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), StateArray),
    entryTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new UnboundedArray(Entry))
  });
  return StateHeader1;
}

var BslnSubtable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('format', {
  0: {
    // Distance-based, no mapping
    deltas: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 32)
  },
  1: {
    // Distance-based, with mapping
    deltas: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().int16), 32),
    mappingData: new LookupTable((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))
  },
  2: {
    // Control point-based, no mapping
    standardGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    controlPoints: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 32)
  },
  3: {
    // Control point-based, with mapping
    standardGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    controlPoints: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 32),
    mappingData: new LookupTable((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))
  }
});
var bsln = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  defaultBaseline: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  subtable: BslnSubtable
});

var Setting = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  setting: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nameIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  name: function name(t) {
    return t.parent.parent.parent.name.records.fontFeatures[t.nameIndex];
  }
});
var FeatureName = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  feature: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nSettings: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  settingTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Setting, 'nSettings'), {
    type: 'parent'
  }),
  featureFlags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Bitfield)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), [null, null, null, null, null, null, 'hasDefault', 'exclusive']),
  defaultSetting: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  nameIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  name: function name(t) {
    return t.parent.parent.name.records.fontFeatures[t.nameIndex];
  }
});
var feat = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  featureNameCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  reserved1: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  reserved2: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)),
  featureNames: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatureName, 'featureNameCount')
});

var Axis = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  axisTag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  minValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  defaultValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  maxValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nameID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  name: function name(t) {
    return t.parent.parent.name.records.fontFeatures[t.nameID];
  }
});
var Instance = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  nameID: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  name: function name(t) {
    return t.parent.parent.name.records.fontFeatures[t.nameID];
  },
  flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  coord: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32), function (t) {
    return t.parent.axisCount;
  }),
  postscriptNameID: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Optional)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), function (t) {
    return t.parent.instanceSize - t._currentOffset > 0;
  })
});
var fvar = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  offsetToData: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  countSizePairs: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  axisCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  axisSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  instanceCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  instanceSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  axis: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Axis, 'axisCount'),
  instance: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Instance, 'instanceCount')
});

var shortFrac = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Fixed)(16, 'BE', 14);

var Offset = /*#__PURE__*/function () {
  function Offset() {}

  Offset.decode = function decode(stream, parent) {
    // In short format, offsets are multiplied by 2.
    // This doesn't seem to be documented by Apple, but it
    // is implemented this way in Freetype.
    return parent.flags ? stream.readUInt32BE() : stream.readUInt16BE() * 2;
  };

  return Offset;
}();

var gvar = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  axisCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  globalCoordCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  globalCoords: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(shortFrac, 'axisCount'), 'globalCoordCount')),
  glyphCount: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  offsetToData: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)(Offset, 'void', {
    relativeTo: 'offsetToData',
    allowNull: false
  }), function (t) {
    return t.glyphCount + 1;
  })
});

var ClassTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  coverage: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  subFeatureFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  stateTable: new StateTable1()
});
var WidthDeltaRecord = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  justClass: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  beforeGrowLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  beforeShrinkLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  afterGrowLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  afterShrinkLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  growFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  shrinkFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
});
var WidthDeltaCluster = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(WidthDeltaRecord, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32));
var ActionData = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('actionType', {
  0: {
    // Decomposition action
    lowerLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    upperLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    order: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyphs: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))
  },
  1: {
    // Unconditional add glyph action
    addGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  2: {
    // Conditional add glyph action
    substThreshold: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    addGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    substGlyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  },
  3: {},
  // Stretch glyph action (no data, not supported by CoreText)
  4: {
    // Ductile glyph action (not supported by CoreText)
    variationAxis: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    minimumLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    noStretchValue: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
    maximumLimit: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32)
  },
  5: {
    // Repeated add glyph action
    flags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
    glyph: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
  }
});
var Action = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  actionClass: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  actionType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  actionLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  actionData: ActionData,
  padding: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
    return t.actionLength - t._currentOffset;
  })
});
var PostcompensationAction = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Action, (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32));
var PostCompensationTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  lookupTable: new LookupTable(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), PostcompensationAction))
});
var JustificationTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  classTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), ClassTable, {
    type: 'parent'
  }),
  wdcOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  postCompensationTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), PostCompensationTable, {
    type: 'parent'
  }),
  widthDeltaClusters: new LookupTable(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), WidthDeltaCluster, {
    type: 'parent',
    relativeTo: 'wdcOffset'
  }))
});
var just = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  horizontal: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JustificationTable),
  vertical: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), JustificationTable)
});

var LigatureData = {
  action: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
};
var ContextualData = {
  markIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  currentIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
};
var InsertionData = {
  currentInsertIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  markedInsertIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)
};
var SubstitutionTable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  items: new UnboundedArray(new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new LookupTable()))
});
var SubtableData = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)('type', {
  0: {
    // Indic Rearrangement Subtable
    stateTable: new StateTable()
  },
  1: {
    // Contextual Glyph Substitution Subtable
    stateTable: new StateTable(ContextualData),
    substitutionTable: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), SubstitutionTable)
  },
  2: {
    // Ligature subtable
    stateTable: new StateTable(LigatureData),
    ligatureActions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new UnboundedArray((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32))),
    components: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new UnboundedArray((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16))),
    ligatureList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new UnboundedArray((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)))
  },
  4: {
    // Non-contextual Glyph Substitution Subtable
    lookupTable: new LookupTable()
  },
  5: {
    // Glyph Insertion Subtable
    stateTable: new StateTable(InsertionData),
    insertionActions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), new UnboundedArray((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)))
  }
});
var Subtable = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  coverage: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24),
  type: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  subFeatureFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  table: SubtableData,
  padding: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), function (t) {
    return t.length - t._currentOffset;
  })
});
var FeatureEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  featureType: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  featureSetting: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  enableFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  disableFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var MorxChain = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  defaultFlags: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  chainLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  nFeatureEntries: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  nSubtables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  features: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(FeatureEntry, 'nFeatureEntries'),
  subtables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Subtable, 'nSubtables')
});
var morx = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  unused: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  nChains: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  chains: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(MorxChain, 'nChains')
});

var OpticalBounds = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  left: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  top: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  right: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  bottom: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
});
var opbd = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  version: (restructure__WEBPACK_IMPORTED_MODULE_0___default().fixed32),
  format: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  lookupTable: new LookupTable(OpticalBounds)
});

var tables = {};
tables.cmap = cmap;
tables.head = head;
tables.hhea = hhea;
tables.hmtx = hmtx;
tables.maxp = maxp;
tables.name = NameTable;
tables['OS/2'] = OS2;
tables.post = post; // TrueType Outlines
tables.fpgm = fpgm;
tables.loca = loca;
tables.prep = prep;
tables['cvt '] = cvt;
tables.glyf = glyf; // PostScript Outlines
tables['CFF '] = CFFFont;
tables['CFF2'] = CFFFont;
tables.VORG = VORG; // Bitmap Glyphs
tables.EBLC = EBLC;
tables.CBLC = tables.EBLC;
tables.sbix = sbix;
tables.COLR = COLR;
tables.CPAL = CPAL; // Advanced OpenType Tables
tables.BASE = BASE;
tables.GDEF = GDEF;
tables.GPOS = GPOS;
tables.GSUB = GSUB;
tables.JSTF = JSTF; // OpenType variations tables
tables.HVAR = HVAR; // Other OpenType Tables
tables.DSIG = DSIG;
tables.gasp = gasp;
tables.hdmx = hdmx;
tables.kern = kern;
tables.LTSH = LTSH;
tables.PCLT = PCLT;
tables.VDMX = VDMX;
tables.vhea = vhea;
tables.vmtx = vmtx; // Apple Advanced Typography Tables
tables.avar = avar;
tables.bsln = bsln;
tables.feat = feat;
tables.fvar = fvar;
tables.gvar = gvar;
tables.just = just;
tables.morx = morx;
tables.opbd = opbd;

var TableEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  checkSum: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  offset: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'void', {
    type: 'global'
  }),
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var Directory = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  numTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  searchRange: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  entrySelector: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  rangeShift: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  tables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(TableEntry, 'numTables')
});

Directory.process = function () {
  var tables = {};

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.tables), _step; !(_step = _iterator()).done;) {
    var table = _step.value;
    tables[table.tag] = table;
  }

  this.tables = tables;
};

Directory.preEncode = function (stream) {
  var tables$1 = [];

  for (var tag in this.tables) {
    var table = this.tables[tag];

    if (table) {
      tables$1.push({
        tag: tag,
        checkSum: 0,
        offset: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VoidPointer)(tables[tag], table),
        length: tables[tag].size(table)
      });
    }
  }

  this.tag = 'true';
  this.numTables = tables$1.length;
  this.tables = tables$1;
  var maxExponentFor2 = Math.floor(Math.log(this.numTables) / Math.LN2);
  var maxPowerOf2 = Math.pow(2, maxExponentFor2);
  this.searchRange = maxPowerOf2 * 16;
  this.entrySelector = Math.log(maxPowerOf2) / Math.LN2;
  this.rangeShift = this.numTables * 16 - this.searchRange;
};

function binarySearch(arr, cmp) {
  var min = 0;
  var max = arr.length - 1;

  while (min <= max) {
    var mid = min + max >> 1;
    var res = cmp(arr[mid]);

    if (res < 0) {
      max = mid - 1;
    } else if (res > 0) {
      min = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
}
function range(index, end) {
  var range = [];

  while (index < end) {
    range.push(index++);
  }

  return range;
}

var _class$4;

try {
  var iconv = __webpack_require__(6983);
} catch (err) {}

var CmapProcessor = (_class$4 = /*#__PURE__*/function () {
  function CmapProcessor(cmapTable) {
    // Attempt to find a Unicode cmap first
    this.encoding = null;
    this.cmap = this.findSubtable(cmapTable, [// 32-bit subtables
    [3, 10], [0, 6], [0, 4], // 16-bit subtables
    [3, 1], [0, 3], [0, 2], [0, 1], [0, 0]]); // If not unicode cmap was found, and iconv-lite is installed,
    // take the first table with a supported encoding.

    if (!this.cmap && iconv) {
      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(cmapTable.tables), _step; !(_step = _iterator()).done;) {
        var cmap = _step.value;
        var encoding = getEncoding(cmap.platformID, cmap.encodingID, cmap.table.language - 1);

        if (iconv.encodingExists(encoding)) {
          this.cmap = cmap.table;
          this.encoding = encoding;
        }
      }
    }

    if (!this.cmap) {
      throw new Error("Could not find a supported cmap table");
    }

    this.uvs = this.findSubtable(cmapTable, [[0, 5]]);

    if (this.uvs && this.uvs.version !== 14) {
      this.uvs = null;
    }
  }

  var _proto = CmapProcessor.prototype;

  _proto.findSubtable = function findSubtable(cmapTable, pairs) {
    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(pairs), _step2; !(_step2 = _iterator2()).done;) {
      var _step2$value = _step2.value,
          platformID = _step2$value[0],
          encodingID = _step2$value[1];

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(cmapTable.tables), _step3; !(_step3 = _iterator3()).done;) {
        var cmap = _step3.value;

        if (cmap.platformID === platformID && cmap.encodingID === encodingID) {
          return cmap.table;
        }
      }
    }

    return null;
  };

  _proto.lookup = function lookup(codepoint, variationSelector) {
    // If there is no Unicode cmap in this font, we need to re-encode
    // the codepoint in the encoding that the cmap supports.
    if (this.encoding) {
      var buf = iconv.encode(String.fromCodePoint(codepoint), this.encoding);
      codepoint = 0;

      for (var i = 0; i < buf.length; i++) {
        codepoint = codepoint << 8 | buf[i];
      } // Otherwise, try to get a Unicode variation selector for this codepoint if one is provided.

    } else if (variationSelector) {
      var gid = this.getVariationSelector(codepoint, variationSelector);

      if (gid) {
        return gid;
      }
    }

    var cmap = this.cmap;

    switch (cmap.version) {
      case 0:
        return cmap.codeMap.get(codepoint) || 0;

      case 4:
        {
          var min = 0;
          var max = cmap.segCount - 1;

          while (min <= max) {
            var mid = min + max >> 1;

            if (codepoint < cmap.startCode.get(mid)) {
              max = mid - 1;
            } else if (codepoint > cmap.endCode.get(mid)) {
              min = mid + 1;
            } else {
              var rangeOffset = cmap.idRangeOffset.get(mid);

              var _gid = void 0;

              if (rangeOffset === 0) {
                _gid = codepoint + cmap.idDelta.get(mid);
              } else {
                var index = rangeOffset / 2 + (codepoint - cmap.startCode.get(mid)) - (cmap.segCount - mid);
                _gid = cmap.glyphIndexArray.get(index) || 0;

                if (_gid !== 0) {
                  _gid += cmap.idDelta.get(mid);
                }
              }

              return _gid & 0xffff;
            }
          }

          return 0;
        }

      case 8:
        throw new Error('TODO: cmap format 8');

      case 6:
      case 10:
        return cmap.glyphIndices.get(codepoint - cmap.firstCode) || 0;

      case 12:
      case 13:
        {
          var _min = 0;

          var _max = cmap.nGroups - 1;

          while (_min <= _max) {
            var _mid = _min + _max >> 1;

            var group = cmap.groups.get(_mid);

            if (codepoint < group.startCharCode) {
              _max = _mid - 1;
            } else if (codepoint > group.endCharCode) {
              _min = _mid + 1;
            } else {
              if (cmap.version === 12) {
                return group.glyphID + (codepoint - group.startCharCode);
              } else {
                return group.glyphID;
              }
            }
          }

          return 0;
        }

      case 14:
        throw new Error('TODO: cmap format 14');

      default:
        throw new Error("Unknown cmap format " + cmap.version);
    }
  };

  _proto.getVariationSelector = function getVariationSelector(codepoint, variationSelector) {
    if (!this.uvs) {
      return 0;
    }

    var selectors = this.uvs.varSelectors.toArray();
    var i = binarySearch(selectors, function (x) {
      return variationSelector - x.varSelector;
    });
    var sel = selectors[i];

    if (i !== -1 && sel.defaultUVS) {
      i = binarySearch(sel.defaultUVS, function (x) {
        return codepoint < x.startUnicodeValue ? -1 : codepoint > x.startUnicodeValue + x.additionalCount ? +1 : 0;
      });
    }

    if (i !== -1 && sel.nonDefaultUVS) {
      i = binarySearch(sel.nonDefaultUVS, function (x) {
        return codepoint - x.unicodeValue;
      });

      if (i !== -1) {
        return sel.nonDefaultUVS[i].glyphID;
      }
    }

    return 0;
  };

  _proto.getCharacterSet = function getCharacterSet() {
    var cmap = this.cmap;

    switch (cmap.version) {
      case 0:
        return range(0, cmap.codeMap.length);

      case 4:
        {
          var res = [];
          var endCodes = cmap.endCode.toArray();

          for (var i = 0; i < endCodes.length; i++) {
            var tail = endCodes[i] + 1;
            var start = cmap.startCode.get(i);
            res.push.apply(res, range(start, tail));
          }

          return res;
        }

      case 8:
        throw new Error('TODO: cmap format 8');

      case 6:
      case 10:
        return range(cmap.firstCode, cmap.firstCode + cmap.glyphIndices.length);

      case 12:
      case 13:
        {
          var _res = [];

          for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(cmap.groups.toArray()), _step4; !(_step4 = _iterator4()).done;) {
            var group = _step4.value;

            _res.push.apply(_res, range(group.startCharCode, group.endCharCode + 1));
          }

          return _res;
        }

      case 14:
        throw new Error('TODO: cmap format 14');

      default:
        throw new Error("Unknown cmap format " + cmap.version);
    }
  };

  _proto.codePointsForGlyph = function codePointsForGlyph(gid) {
    var cmap = this.cmap;

    switch (cmap.version) {
      case 0:
        {
          var res = [];

          for (var i = 0; i < 256; i++) {
            if (cmap.codeMap.get(i) === gid) {
              res.push(i);
            }
          }

          return res;
        }

      case 4:
        {
          var _res2 = [];

          for (var _i = 0; _i < cmap.segCount; _i++) {
            var end = cmap.endCode.get(_i);
            var start = cmap.startCode.get(_i);
            var rangeOffset = cmap.idRangeOffset.get(_i);
            var delta = cmap.idDelta.get(_i);

            for (var c = start; c <= end; c++) {
              var g = 0;

              if (rangeOffset === 0) {
                g = c + delta;
              } else {
                var index = rangeOffset / 2 + (c - start) - (cmap.segCount - _i);
                g = cmap.glyphIndexArray.get(index) || 0;

                if (g !== 0) {
                  g += delta;
                }
              }

              if (g === gid) {
                _res2.push(c);
              }
            }
          }

          return _res2;
        }

      case 12:
        {
          var _res3 = [];

          for (var _iterator5 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(cmap.groups.toArray()), _step5; !(_step5 = _iterator5()).done;) {
            var group = _step5.value;

            if (gid >= group.glyphID && gid <= group.glyphID + (group.endCharCode - group.startCharCode)) {
              _res3.push(group.startCharCode + (gid - group.glyphID));
            }
          }

          return _res3;
        }

      case 13:
        {
          var _res4 = [];

          for (var _iterator6 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(cmap.groups.toArray()), _step6; !(_step6 = _iterator6()).done;) {
            var _group = _step6.value;

            if (gid === _group.glyphID) {
              _res4.push.apply(_res4, range(_group.startCharCode, _group.endCharCode + 1));
            }
          }

          return _res4;
        }

      default:
        throw new Error("Unknown cmap format " + cmap.version);
    }
  };

  return CmapProcessor;
}(), ((0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$4.prototype, "getCharacterSet", [cache], Object.getOwnPropertyDescriptor(_class$4.prototype, "getCharacterSet"), _class$4.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$4.prototype, "codePointsForGlyph", [cache], Object.getOwnPropertyDescriptor(_class$4.prototype, "codePointsForGlyph"), _class$4.prototype)), _class$4);

var KernProcessor = /*#__PURE__*/function () {
  function KernProcessor(font) {
    this.kern = font.kern;
  }

  var _proto = KernProcessor.prototype;

  _proto.process = function process(glyphs, positions) {
    for (var glyphIndex = 0; glyphIndex < glyphs.length - 1; glyphIndex++) {
      var left = glyphs[glyphIndex].id;
      var right = glyphs[glyphIndex + 1].id;
      positions[glyphIndex].xAdvance += this.getKerning(left, right);
    }
  };

  _proto.getKerning = function getKerning(left, right) {
    var res = 0;

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.kern.tables), _step; !(_step = _iterator()).done;) {
      var table = _step.value;

      if (table.coverage.crossStream) {
        continue;
      }

      switch (table.version) {
        case 0:
          if (!table.coverage.horizontal) {
            continue;
          }

          break;

        case 1:
          if (table.coverage.vertical || table.coverage.variation) {
            continue;
          }

          break;

        default:
          throw new Error("Unsupported kerning table version " + table.version);
      }

      var val = 0;
      var s = table.subtable;

      switch (table.format) {
        case 0:
          var pairIdx = binarySearch(s.pairs, function (pair) {
            return left - pair.left || right - pair.right;
          });

          if (pairIdx >= 0) {
            val = s.pairs[pairIdx].value;
          }

          break;

        case 2:
          var leftOffset = 0,
              rightOffset = 0;

          if (left >= s.leftTable.firstGlyph && left < s.leftTable.firstGlyph + s.leftTable.nGlyphs) {
            leftOffset = s.leftTable.offsets[left - s.leftTable.firstGlyph];
          } else {
            leftOffset = s.array.off;
          }

          if (right >= s.rightTable.firstGlyph && right < s.rightTable.firstGlyph + s.rightTable.nGlyphs) {
            rightOffset = s.rightTable.offsets[right - s.rightTable.firstGlyph];
          }

          var index = (leftOffset + rightOffset - s.array.off) / 2;
          val = s.array.values.get(index);
          break;

        case 3:
          if (left >= s.glyphCount || right >= s.glyphCount) {
            return 0;
          }

          val = s.kernValue[s.kernIndex[s.leftClass[left] * s.rightClassCount + s.rightClass[right]]];
          break;

        default:
          throw new Error("Unsupported kerning sub-table format " + table.format);
      } // Microsoft supports the override flag, which resets the result
      // Otherwise, the sum of the results from all subtables is returned


      if (table.coverage.override) {
        res = val;
      } else {
        res += val;
      }
    }

    return res;
  };

  return KernProcessor;
}();

/**
 * This class is used when GPOS does not define 'mark' or 'mkmk' features
 * for positioning marks relative to base glyphs. It uses the unicode
 * combining class property to position marks.
 *
 * Based on code from Harfbuzz, thanks!
 * https://github.com/behdad/harfbuzz/blob/master/src/hb-ot-shape-fallback.cc
 */

var UnicodeLayoutEngine = /*#__PURE__*/function () {
  function UnicodeLayoutEngine(font) {
    this.font = font;
  }

  var _proto = UnicodeLayoutEngine.prototype;

  _proto.positionGlyphs = function positionGlyphs(glyphs, positions) {
    // find each base + mark cluster, and position the marks relative to the base
    var clusterStart = 0;
    var clusterEnd = 0;

    for (var index = 0; index < glyphs.length; index++) {
      var glyph = glyphs[index];

      if (glyph.isMark) {
        // TODO: handle ligatures
        clusterEnd = index;
      } else {
        if (clusterStart !== clusterEnd) {
          this.positionCluster(glyphs, positions, clusterStart, clusterEnd);
        }

        clusterStart = clusterEnd = index;
      }
    }

    if (clusterStart !== clusterEnd) {
      this.positionCluster(glyphs, positions, clusterStart, clusterEnd);
    }

    return positions;
  };

  _proto.positionCluster = function positionCluster(glyphs, positions, clusterStart, clusterEnd) {
    var base = glyphs[clusterStart];
    var baseBox = base.cbox.copy(); // adjust bounding box for ligature glyphs

    if (base.codePoints.length > 1) {
      // LTR. TODO: RTL support.
      baseBox.minX += (base.codePoints.length - 1) * baseBox.width / base.codePoints.length;
    }

    var xOffset = -positions[clusterStart].xAdvance;
    var yOffset = 0;
    var yGap = this.font.unitsPerEm / 16; // position each of the mark glyphs relative to the base glyph

    for (var index = clusterStart + 1; index <= clusterEnd; index++) {
      var mark = glyphs[index];
      var markBox = mark.cbox;
      var position = positions[index];
      var combiningClass = this.getCombiningClass(mark.codePoints[0]);

      if (combiningClass !== 'Not_Reordered') {
        position.xOffset = position.yOffset = 0; // x positioning

        switch (combiningClass) {
          case 'Double_Above':
          case 'Double_Below':
            // LTR. TODO: RTL support.
            position.xOffset += baseBox.minX - markBox.width / 2 - markBox.minX;
            break;

          case 'Attached_Below_Left':
          case 'Below_Left':
          case 'Above_Left':
            // left align
            position.xOffset += baseBox.minX - markBox.minX;
            break;

          case 'Attached_Above_Right':
          case 'Below_Right':
          case 'Above_Right':
            // right align
            position.xOffset += baseBox.maxX - markBox.width - markBox.minX;
            break;

          default:
            // Attached_Below, Attached_Above, Below, Above, other
            // center align
            position.xOffset += baseBox.minX + (baseBox.width - markBox.width) / 2 - markBox.minX;
        } // y positioning


        switch (combiningClass) {
          case 'Double_Below':
          case 'Below_Left':
          case 'Below':
          case 'Below_Right':
          case 'Attached_Below_Left':
          case 'Attached_Below':
            // add a small gap between the glyphs if they are not attached
            if (combiningClass === 'Attached_Below_Left' || combiningClass === 'Attached_Below') {
              baseBox.minY += yGap;
            }

            position.yOffset = -baseBox.minY - markBox.maxY;
            baseBox.minY += markBox.height;
            break;

          case 'Double_Above':
          case 'Above_Left':
          case 'Above':
          case 'Above_Right':
          case 'Attached_Above':
          case 'Attached_Above_Right':
            // add a small gap between the glyphs if they are not attached
            if (combiningClass === 'Attached_Above' || combiningClass === 'Attached_Above_Right') {
              baseBox.maxY += yGap;
            }

            position.yOffset = baseBox.maxY - markBox.minY;
            baseBox.maxY += markBox.height;
            break;
        }

        position.xAdvance = position.yAdvance = 0;
        position.xOffset += xOffset;
        position.yOffset += yOffset;
      } else {
        xOffset -= position.xAdvance;
        yOffset -= position.yAdvance;
      }
    }

    return;
  };

  _proto.getCombiningClass = function getCombiningClass(codePoint) {
    var combiningClass = _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].getCombiningClass(codePoint); // Thai / Lao need some per-character work

    if ((codePoint & ~0xff) === 0x0e00) {
      if (combiningClass === 'Not_Reordered') {
        switch (codePoint) {
          case 0x0e31:
          case 0x0e34:
          case 0x0e35:
          case 0x0e36:
          case 0x0e37:
          case 0x0e47:
          case 0x0e4c:
          case 0x0e3d:
          case 0x0e4e:
            return 'Above_Right';

          case 0x0eb1:
          case 0x0eb4:
          case 0x0eb5:
          case 0x0eb6:
          case 0x0eb7:
          case 0x0ebb:
          case 0x0ecc:
          case 0x0ecd:
            return 'Above';

          case 0x0ebc:
            return 'Below';
        }
      } else if (codePoint === 0x0e3a) {
        // virama
        return 'Below_Right';
      }
    }

    switch (combiningClass) {
      // Hebrew
      case 'CCC10': // sheva

      case 'CCC11': // hataf segol

      case 'CCC12': // hataf patah

      case 'CCC13': // hataf qamats

      case 'CCC14': // hiriq

      case 'CCC15': // tsere

      case 'CCC16': // segol

      case 'CCC17': // patah

      case 'CCC18': // qamats

      case 'CCC20': // qubuts

      case 'CCC22':
        // meteg
        return 'Below';

      case 'CCC23':
        // rafe
        return 'Attached_Above';

      case 'CCC24':
        // shin dot
        return 'Above_Right';

      case 'CCC25': // sin dot

      case 'CCC19':
        // holam
        return 'Above_Left';

      case 'CCC26':
        // point varika
        return 'Above';

      case 'CCC21':
        // dagesh
        break;
      // Arabic and Syriac

      case 'CCC27': // fathatan

      case 'CCC28': // dammatan

      case 'CCC30': // fatha

      case 'CCC31': // damma

      case 'CCC33': // shadda

      case 'CCC34': // sukun

      case 'CCC35': // superscript alef

      case 'CCC36':
        // superscript alaph
        return 'Above';

      case 'CCC29': // kasratan

      case 'CCC32':
        // kasra
        return 'Below';
      // Thai

      case 'CCC103':
        // sara u / sara uu
        return 'Below_Right';

      case 'CCC107':
        // mai
        return 'Above_Right';
      // Lao

      case 'CCC118':
        // sign u / sign uu
        return 'Below';

      case 'CCC122':
        // mai
        return 'Above';
      // Tibetan

      case 'CCC129': // sign aa

      case 'CCC132':
        // sign u
        return 'Below';

      case 'CCC130':
        // sign i
        return 'Above';
    }

    return combiningClass;
  };

  return UnicodeLayoutEngine;
}();

/**
 * Represents a glyph bounding box
 */
var BBox = /*#__PURE__*/function () {
  function BBox(minX, minY, maxX, maxY) {
    if (minX === void 0) {
      minX = Infinity;
    }

    if (minY === void 0) {
      minY = Infinity;
    }

    if (maxX === void 0) {
      maxX = -Infinity;
    }

    if (maxY === void 0) {
      maxY = -Infinity;
    }

    /**
     * The minimum X position in the bounding box
     * @type {number}
     */
    this.minX = minX;
    /**
     * The minimum Y position in the bounding box
     * @type {number}
     */

    this.minY = minY;
    /**
     * The maxmimum X position in the bounding box
     * @type {number}
     */

    this.maxX = maxX;
    /**
     * The maxmimum Y position in the bounding box
     * @type {number}
     */

    this.maxY = maxY;
  }
  /**
   * The width of the bounding box
   * @type {number}
   */


  var _proto = BBox.prototype;

  _proto.addPoint = function addPoint(x, y) {
    if (Math.abs(x) !== Infinity) {
      if (x < this.minX) {
        this.minX = x;
      }

      if (x > this.maxX) {
        this.maxX = x;
      }
    }

    if (Math.abs(y) !== Infinity) {
      if (y < this.minY) {
        this.minY = y;
      }

      if (y > this.maxY) {
        this.maxY = y;
      }
    }
  };

  _proto.copy = function copy() {
    return new BBox(this.minX, this.minY, this.maxX, this.maxY);
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(BBox, [{
    key: "width",
    get: function get() {
      return this.maxX - this.minX;
    }
    /**
     * The height of the bounding box
     * @type {number}
     */

  }, {
    key: "height",
    get: function get() {
      return this.maxY - this.minY;
    }
  }]);

  return BBox;
}();

// Data from http://www.microsoft.com/typography/otspec/scripttags.htm
// and http://www.unicode.org/Public/UNIDATA/PropertyValueAliases.txt.

var UNICODE_SCRIPTS = {
  Caucasian_Albanian: 'aghb',
  Arabic: 'arab',
  Imperial_Aramaic: 'armi',
  Armenian: 'armn',
  Avestan: 'avst',
  Balinese: 'bali',
  Bamum: 'bamu',
  Bassa_Vah: 'bass',
  Batak: 'batk',
  Bengali: ['bng2', 'beng'],
  Bopomofo: 'bopo',
  Brahmi: 'brah',
  Braille: 'brai',
  Buginese: 'bugi',
  Buhid: 'buhd',
  Chakma: 'cakm',
  Canadian_Aboriginal: 'cans',
  Carian: 'cari',
  Cham: 'cham',
  Cherokee: 'cher',
  Coptic: 'copt',
  Cypriot: 'cprt',
  Cyrillic: 'cyrl',
  Devanagari: ['dev2', 'deva'],
  Deseret: 'dsrt',
  Duployan: 'dupl',
  Egyptian_Hieroglyphs: 'egyp',
  Elbasan: 'elba',
  Ethiopic: 'ethi',
  Georgian: 'geor',
  Glagolitic: 'glag',
  Gothic: 'goth',
  Grantha: 'gran',
  Greek: 'grek',
  Gujarati: ['gjr2', 'gujr'],
  Gurmukhi: ['gur2', 'guru'],
  Hangul: 'hang',
  Han: 'hani',
  Hanunoo: 'hano',
  Hebrew: 'hebr',
  Hiragana: 'hira',
  Pahawh_Hmong: 'hmng',
  Katakana_Or_Hiragana: 'hrkt',
  Old_Italic: 'ital',
  Javanese: 'java',
  Kayah_Li: 'kali',
  Katakana: 'kana',
  Kharoshthi: 'khar',
  Khmer: 'khmr',
  Khojki: 'khoj',
  Kannada: ['knd2', 'knda'],
  Kaithi: 'kthi',
  Tai_Tham: 'lana',
  Lao: 'lao ',
  Latin: 'latn',
  Lepcha: 'lepc',
  Limbu: 'limb',
  Linear_A: 'lina',
  Linear_B: 'linb',
  Lisu: 'lisu',
  Lycian: 'lyci',
  Lydian: 'lydi',
  Mahajani: 'mahj',
  Mandaic: 'mand',
  Manichaean: 'mani',
  Mende_Kikakui: 'mend',
  Meroitic_Cursive: 'merc',
  Meroitic_Hieroglyphs: 'mero',
  Malayalam: ['mlm2', 'mlym'],
  Modi: 'modi',
  Mongolian: 'mong',
  Mro: 'mroo',
  Meetei_Mayek: 'mtei',
  Myanmar: ['mym2', 'mymr'],
  Old_North_Arabian: 'narb',
  Nabataean: 'nbat',
  Nko: 'nko ',
  Ogham: 'ogam',
  Ol_Chiki: 'olck',
  Old_Turkic: 'orkh',
  Oriya: ['ory2', 'orya'],
  Osmanya: 'osma',
  Palmyrene: 'palm',
  Pau_Cin_Hau: 'pauc',
  Old_Permic: 'perm',
  Phags_Pa: 'phag',
  Inscriptional_Pahlavi: 'phli',
  Psalter_Pahlavi: 'phlp',
  Phoenician: 'phnx',
  Miao: 'plrd',
  Inscriptional_Parthian: 'prti',
  Rejang: 'rjng',
  Runic: 'runr',
  Samaritan: 'samr',
  Old_South_Arabian: 'sarb',
  Saurashtra: 'saur',
  Shavian: 'shaw',
  Sharada: 'shrd',
  Siddham: 'sidd',
  Khudawadi: 'sind',
  Sinhala: 'sinh',
  Sora_Sompeng: 'sora',
  Sundanese: 'sund',
  Syloti_Nagri: 'sylo',
  Syriac: 'syrc',
  Tagbanwa: 'tagb',
  Takri: 'takr',
  Tai_Le: 'tale',
  New_Tai_Lue: 'talu',
  Tamil: ['tml2', 'taml'],
  Tai_Viet: 'tavt',
  Telugu: ['tel2', 'telu'],
  Tifinagh: 'tfng',
  Tagalog: 'tglg',
  Thaana: 'thaa',
  Thai: 'thai',
  Tibetan: 'tibt',
  Tirhuta: 'tirh',
  Ugaritic: 'ugar',
  Vai: 'vai ',
  Warang_Citi: 'wara',
  Old_Persian: 'xpeo',
  Cuneiform: 'xsux',
  Yi: 'yi  ',
  Inherited: 'zinh',
  Common: 'zyyy',
  Unknown: 'zzzz'
};
var OPENTYPE_SCRIPTS = {};

for (var script in UNICODE_SCRIPTS) {
  var tag = UNICODE_SCRIPTS[script];

  if (Array.isArray(tag)) {
    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(tag), _step; !(_step = _iterator()).done;) {
      var t = _step.value;
      OPENTYPE_SCRIPTS[t] = script;
    }
  } else {
    OPENTYPE_SCRIPTS[tag] = script;
  }
}
function fromOpenType(tag) {
  return OPENTYPE_SCRIPTS[tag];
}
function forString(string) {
  var len = string.length;
  var idx = 0;

  while (idx < len) {
    var code = string.charCodeAt(idx++); // Check if this is a high surrogate

    if (0xd800 <= code && code <= 0xdbff && idx < len) {
      var next = string.charCodeAt(idx); // Check if this is a low surrogate

      if (0xdc00 <= next && next <= 0xdfff) {
        idx++;
        code = ((code & 0x3FF) << 10) + (next & 0x3FF) + 0x10000;
      }
    }

    var _script = _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].getScript(code);

    if (_script !== 'Common' && _script !== 'Inherited' && _script !== 'Unknown') {
      return UNICODE_SCRIPTS[_script];
    }
  }

  return UNICODE_SCRIPTS.Unknown;
}
function forCodePoints(codePoints) {
  for (var i = 0; i < codePoints.length; i++) {
    var codePoint = codePoints[i];

    var _script2 = _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].getScript(codePoint);

    if (_script2 !== 'Common' && _script2 !== 'Inherited' && _script2 !== 'Unknown') {
      return UNICODE_SCRIPTS[_script2];
    }
  }

  return UNICODE_SCRIPTS.Unknown;
} // The scripts in this map are written from right to left

var RTL = {
  arab: true,
  // Arabic
  hebr: true,
  // Hebrew
  syrc: true,
  // Syriac
  thaa: true,
  // Thaana
  cprt: true,
  // Cypriot Syllabary
  khar: true,
  // Kharosthi
  phnx: true,
  // Phoenician
  'nko ': true,
  // N'Ko
  lydi: true,
  // Lydian
  avst: true,
  // Avestan
  armi: true,
  // Imperial Aramaic
  phli: true,
  // Inscriptional Pahlavi
  prti: true,
  // Inscriptional Parthian
  sarb: true,
  // Old South Arabian
  orkh: true,
  // Old Turkic, Orkhon Runic
  samr: true,
  // Samaritan
  mand: true,
  // Mandaic, Mandaean
  merc: true,
  // Meroitic Cursive
  mero: true,
  // Meroitic Hieroglyphs
  // Unicode 7.0 (not listed on http://www.microsoft.com/typography/otspec/scripttags.htm)
  mani: true,
  // Manichaean
  mend: true,
  // Mende Kikakui
  nbat: true,
  // Nabataean
  narb: true,
  // Old North Arabian
  palm: true,
  // Palmyrene
  phlp: true // Psalter Pahlavi

};
function direction(script) {
  if (RTL[script]) {
    return 'rtl';
  }

  return 'ltr';
}

/**
 * Represents a run of Glyph and GlyphPosition objects.
 * Returned by the font layout method.
 */

var GlyphRun = /*#__PURE__*/function () {
  function GlyphRun(glyphs, features, script, language, direction$1) {
    /**
     * An array of Glyph objects in the run
     * @type {Glyph[]}
     */
    this.glyphs = glyphs;
    /**
     * An array of GlyphPosition objects for each glyph in the run
     * @type {GlyphPosition[]}
     */

    this.positions = null;
    /**
     * The script that was requested for shaping. This was either passed in or detected automatically.
     * @type {string}
     */

    this.script = script;
    /**
     * The language requested for shaping, as passed in. If `null`, the default language for the
     * script was used.
     * @type {string}
     */

    this.language = language || null;
    /**
     * The direction requested for shaping, as passed in (either ltr or rtl).
     * If `null`, the default direction of the script is used.
     * @type {string}
     */

    this.direction = direction$1 || direction(script);
    /**
     * The features requested during shaping. This is a combination of user
     * specified features and features chosen by the shaper.
     * @type {object}
     */

    this.features = {}; // Convert features to an object

    if (Array.isArray(features)) {
      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(features), _step; !(_step = _iterator()).done;) {
        var tag = _step.value;
        this.features[tag] = true;
      }
    } else if (typeof features === 'object') {
      this.features = features;
    }
  }
  /**
   * The total advance width of the run.
   * @type {number}
   */


  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(GlyphRun, [{
    key: "advanceWidth",
    get: function get() {
      var width = 0;

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.positions), _step2; !(_step2 = _iterator2()).done;) {
        var position = _step2.value;
        width += position.xAdvance;
      }

      return width;
    }
    /**
     * The total advance height of the run.
     * @type {number}
     */

  }, {
    key: "advanceHeight",
    get: function get() {
      var height = 0;

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.positions), _step3; !(_step3 = _iterator3()).done;) {
        var position = _step3.value;
        height += position.yAdvance;
      }

      return height;
    }
    /**
     * The bounding box containing all glyphs in the run.
     * @type {BBox}
     */

  }, {
    key: "bbox",
    get: function get() {
      var bbox = new BBox();
      var x = 0;
      var y = 0;

      for (var index = 0; index < this.glyphs.length; index++) {
        var glyph = this.glyphs[index];
        var p = this.positions[index];
        var b = glyph.bbox;
        bbox.addPoint(b.minX + x + p.xOffset, b.minY + y + p.yOffset);
        bbox.addPoint(b.maxX + x + p.xOffset, b.maxY + y + p.yOffset);
        x += p.xAdvance;
        y += p.yAdvance;
      }

      return bbox;
    }
  }]);

  return GlyphRun;
}();

/**
 * Represents positioning information for a glyph in a GlyphRun.
 */
var GlyphPosition = function GlyphPosition(xAdvance, yAdvance, xOffset, yOffset) {
  if (xAdvance === void 0) {
    xAdvance = 0;
  }

  if (yAdvance === void 0) {
    yAdvance = 0;
  }

  if (xOffset === void 0) {
    xOffset = 0;
  }

  if (yOffset === void 0) {
    yOffset = 0;
  }

  /**
   * The amount to move the virtual pen in the X direction after rendering this glyph.
   * @type {number}
   */
  this.xAdvance = xAdvance;
  /**
   * The amount to move the virtual pen in the Y direction after rendering this glyph.
   * @type {number}
   */

  this.yAdvance = yAdvance;
  /**
   * The offset from the pen position in the X direction at which to render this glyph.
   * @type {number}
   */

  this.xOffset = xOffset;
  /**
   * The offset from the pen position in the Y direction at which to render this glyph.
   * @type {number}
   */

  this.yOffset = yOffset;
};

// see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM09/AppendixF.html
// and /System/Library/Frameworks/CoreText.framework/Versions/A/Headers/SFNTLayoutTypes.h on a Mac
var features = {
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
    // logos: 6
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
  // upperAndLowerCase: 0          # deprecated
  // allCaps: 1                    # deprecated
  // allLowerCase: 2               # deprecated
  // smallCaps: 3                  # deprecated
  // initialCaps: 4                # deprecated
  // initialCapsAndSmallCaps: 5    # deprecated
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
    // lineInitialSwashes: 4
    // lineFinalSwashes: 6
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
    // hyphensToEmDash: 0
    // hyphenToEnDash: 2
    slashedZero: 4
  },
  // formInterrobang: 6
  // smartQuotes: 8
  // periodsToEllipsis: 10
  mathematicalExtras: {
    code: 15,
    exclusive: false,
    // hyphenToMinus: 0
    // asteristoMultiply: 2
    // slashToDivide: 4
    // inequalityLigatures: 6
    // exponents: 8
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
  // user defined options
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
  // hanjaToHangul: 1
  // hiraganaToKatakana: 2
  // katakanaToHiragana: 3
  // kanaToRomanization: 4
  // romanizationToHiragana: 5
  // romanizationToKatakana: 6
  // hanjaToHangulAltOne: 7
  // hanjaToHangulAltTwo: 8
  // hanjaToHangulAltThree: 9
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
    // noRubyKana: 0     # deprecated - use rubyKanaOff instead
    // rubyKana: 1     # deprecated - use rubyKanaOn instead
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
    // noCJKItalicRoman: 0     # deprecated - use CJKItalicRomanOff instead
    // CJKItalicRoman: 1     # deprecated - use CJKItalicRomanOn instead
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
    // indices into ltag table
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

var feature = function feature(name, selector) {
  return [features[name].code, features[name][selector]];
};

var OTMapping = {
  rlig: feature('ligatures', 'requiredLigatures'),
  clig: feature('ligatures', 'contextualLigatures'),
  dlig: feature('ligatures', 'rareLigatures'),
  hlig: feature('ligatures', 'historicalLigatures'),
  liga: feature('ligatures', 'commonLigatures'),
  hist: feature('ligatures', 'historicalLigatures'),
  // ??
  smcp: feature('lowerCase', 'lowerCaseSmallCaps'),
  pcap: feature('lowerCase', 'lowerCasePetiteCaps'),
  frac: feature('fractions', 'diagonalFractions'),
  dnom: feature('fractions', 'diagonalFractions'),
  // ??
  numr: feature('fractions', 'diagonalFractions'),
  // ??
  afrc: feature('fractions', 'verticalFractions'),
  // aalt
  // abvf, abvm, abvs, akhn, blwf, blwm, blws, cfar, cjct, cpsp, falt, isol, jalt, ljmo, mset?
  // ltra, ltrm, nukt, pref, pres, pstf, psts, rand, rkrf, rphf, rtla, rtlm, size, tjmo, tnum?
  // unic, vatu, vhal, vjmo, vpal, vrt2
  // dist -> trak table?
  // kern, vkrn -> kern table
  // lfbd + opbd + rtbd -> opbd table?
  // mark, mkmk -> acnt table?
  // locl -> languageTag + ltag table
  case: feature('caseSensitiveLayout', 'caseSensitiveLayout'),
  // also caseSensitiveSpacing
  ccmp: feature('unicodeDecomposition', 'canonicalComposition'),
  // compatibilityComposition?
  cpct: feature('CJKVerticalRomanPlacement', 'CJKVerticalRomanCentered'),
  // guess..., probably not given below
  valt: feature('CJKVerticalRomanPlacement', 'CJKVerticalRomanCentered'),
  swsh: feature('contextualAlternates', 'swashAlternates'),
  cswh: feature('contextualAlternates', 'contextualSwashAlternates'),
  curs: feature('cursiveConnection', 'cursive'),
  // ??
  c2pc: feature('upperCase', 'upperCasePetiteCaps'),
  c2sc: feature('upperCase', 'upperCaseSmallCaps'),
  init: feature('smartSwash', 'wordInitialSwashes'),
  // ??
  fin2: feature('smartSwash', 'wordFinalSwashes'),
  // ??
  medi: feature('smartSwash', 'nonFinalSwashes'),
  // ??
  med2: feature('smartSwash', 'nonFinalSwashes'),
  // ??
  fin3: feature('smartSwash', 'wordFinalSwashes'),
  // ??
  fina: feature('smartSwash', 'wordFinalSwashes'),
  // ??
  pkna: feature('kanaSpacing', 'proportionalKana'),
  half: feature('textSpacing', 'halfWidthText'),
  // also HalfWidthCJKRoman, HalfWidthIdeographs?
  halt: feature('textSpacing', 'altHalfWidthText'),
  hkna: feature('alternateKana', 'alternateHorizKana'),
  vkna: feature('alternateKana', 'alternateVertKana'),
  // hngl: feature 'transliteration', 'hanjaToHangulSelector' # deprecated
  ital: feature('italicCJKRoman', 'CJKItalicRoman'),
  lnum: feature('numberCase', 'upperCaseNumbers'),
  onum: feature('numberCase', 'lowerCaseNumbers'),
  mgrk: feature('mathematicalExtras', 'mathematicalGreek'),
  // nalt: not enough info. what type of annotation?
  // ornm: ditto, which ornament style?
  calt: feature('contextualAlternates', 'contextualAlternates'),
  // or more?
  vrt2: feature('verticalSubstitution', 'substituteVerticalForms'),
  // oh... below?
  vert: feature('verticalSubstitution', 'substituteVerticalForms'),
  tnum: feature('numberSpacing', 'monospacedNumbers'),
  pnum: feature('numberSpacing', 'proportionalNumbers'),
  sups: feature('verticalPosition', 'superiors'),
  subs: feature('verticalPosition', 'inferiors'),
  ordn: feature('verticalPosition', 'ordinals'),
  pwid: feature('textSpacing', 'proportionalText'),
  hwid: feature('textSpacing', 'halfWidthText'),
  qwid: feature('textSpacing', 'quarterWidthText'),
  // also QuarterWidthNumbers?
  twid: feature('textSpacing', 'thirdWidthText'),
  // also ThirdWidthNumbers?
  fwid: feature('textSpacing', 'proportionalText'),
  //??
  palt: feature('textSpacing', 'altProportionalText'),
  trad: feature('characterShape', 'traditionalCharacters'),
  smpl: feature('characterShape', 'simplifiedCharacters'),
  jp78: feature('characterShape', 'JIS1978Characters'),
  jp83: feature('characterShape', 'JIS1983Characters'),
  jp90: feature('characterShape', 'JIS1990Characters'),
  jp04: feature('characterShape', 'JIS2004Characters'),
  expt: feature('characterShape', 'expertCharacters'),
  hojo: feature('characterShape', 'hojoCharacters'),
  nlck: feature('characterShape', 'NLCCharacters'),
  tnam: feature('characterShape', 'traditionalNamesCharacters'),
  ruby: feature('rubyKana', 'rubyKana'),
  titl: feature('styleOptions', 'titlingCaps'),
  zero: feature('typographicExtras', 'slashedZero'),
  ss01: feature('stylisticAlternatives', 'stylisticAltOne'),
  ss02: feature('stylisticAlternatives', 'stylisticAltTwo'),
  ss03: feature('stylisticAlternatives', 'stylisticAltThree'),
  ss04: feature('stylisticAlternatives', 'stylisticAltFour'),
  ss05: feature('stylisticAlternatives', 'stylisticAltFive'),
  ss06: feature('stylisticAlternatives', 'stylisticAltSix'),
  ss07: feature('stylisticAlternatives', 'stylisticAltSeven'),
  ss08: feature('stylisticAlternatives', 'stylisticAltEight'),
  ss09: feature('stylisticAlternatives', 'stylisticAltNine'),
  ss10: feature('stylisticAlternatives', 'stylisticAltTen'),
  ss11: feature('stylisticAlternatives', 'stylisticAltEleven'),
  ss12: feature('stylisticAlternatives', 'stylisticAltTwelve'),
  ss13: feature('stylisticAlternatives', 'stylisticAltThirteen'),
  ss14: feature('stylisticAlternatives', 'stylisticAltFourteen'),
  ss15: feature('stylisticAlternatives', 'stylisticAltFifteen'),
  ss16: feature('stylisticAlternatives', 'stylisticAltSixteen'),
  ss17: feature('stylisticAlternatives', 'stylisticAltSeventeen'),
  ss18: feature('stylisticAlternatives', 'stylisticAltEighteen'),
  ss19: feature('stylisticAlternatives', 'stylisticAltNineteen'),
  ss20: feature('stylisticAlternatives', 'stylisticAltTwenty')
}; // salt: feature 'stylisticAlternatives', 'stylisticAltOne' # hmm, which one to choose
// Add cv01-cv99 features

for (var i = 1; i <= 99; i++) {
  OTMapping["cv" + ("00" + i).slice(-2)] = [features.characterAlternatives.code, i];
} // create inverse mapping


var AATMapping = {};

for (var ot in OTMapping) {
  var aat = OTMapping[ot];

  if (AATMapping[aat[0]] == null) {
    AATMapping[aat[0]] = {};
  }

  AATMapping[aat[0]][aat[1]] = ot;
} // Maps an array of OpenType features to AAT features
// in the form of {featureType:{featureSetting:true}}


function mapOTToAAT(features) {
  var res = {};

  for (var k in features) {
    var r = void 0;

    if (r = OTMapping[k]) {
      if (res[r[0]] == null) {
        res[r[0]] = {};
      }

      res[r[0]][r[1]] = features[k];
    }
  }

  return res;
} // Maps strings in a [featureType, featureSetting]
// to their equivalent number codes

function mapFeatureStrings(f) {
  var type = f[0],
      setting = f[1];

  if (isNaN(type)) {
    var typeCode = features[type] && features[type].code;
  } else {
    var typeCode = type;
  }

  if (isNaN(setting)) {
    var settingCode = features[type] && features[type][setting];
  } else {
    var settingCode = setting;
  }

  return [typeCode, settingCode];
} // Maps AAT features to an array of OpenType features
// Supports both arrays in the form of [[featureType, featureSetting]]
// and objects in the form of {featureType:{featureSetting:true}}
// featureTypes and featureSettings can be either strings or number codes


function mapAATToOT(features) {
  var res = {};

  if (Array.isArray(features)) {
    for (var k = 0; k < features.length; k++) {
      var r = void 0;
      var f = mapFeatureStrings(features[k]);

      if (r = AATMapping[f[0]] && AATMapping[f[0]][f[1]]) {
        res[r] = true;
      }
    }
  } else if (typeof features === 'object') {
    for (var type in features) {
      var _feature = features[type];

      for (var setting in _feature) {
        var _r = void 0;

        var _f = mapFeatureStrings([type, setting]);

        if (_feature[setting] && (_r = AATMapping[_f[0]] && AATMapping[_f[0]][_f[1]])) {
          res[_r] = true;
        }
      }
    }
  }

  return Object.keys(res);
}

var _class$3;
var AATLookupTable = (_class$3 = /*#__PURE__*/function () {
  function AATLookupTable(table) {
    this.table = table;
  }

  var _proto = AATLookupTable.prototype;

  _proto.lookup = function lookup(glyph) {
    switch (this.table.version) {
      case 0:
        // simple array format
        return this.table.values.getItem(glyph);

      case 2: // segment format

      case 4:
        {
          var min = 0;
          var max = this.table.binarySearchHeader.nUnits - 1;

          while (min <= max) {
            var mid = min + max >> 1;
            var seg = this.table.segments[mid]; // special end of search value

            if (seg.firstGlyph === 0xffff) {
              return null;
            }

            if (glyph < seg.firstGlyph) {
              max = mid - 1;
            } else if (glyph > seg.lastGlyph) {
              min = mid + 1;
            } else {
              if (this.table.version === 2) {
                return seg.value;
              } else {
                return seg.values[glyph - seg.firstGlyph];
              }
            }
          }

          return null;
        }

      case 6:
        {
          // lookup single
          var _min = 0;

          var _max = this.table.binarySearchHeader.nUnits - 1;

          while (_min <= _max) {
            var mid = _min + _max >> 1;
            var seg = this.table.segments[mid]; // special end of search value

            if (seg.glyph === 0xffff) {
              return null;
            }

            if (glyph < seg.glyph) {
              _max = mid - 1;
            } else if (glyph > seg.glyph) {
              _min = mid + 1;
            } else {
              return seg.value;
            }
          }

          return null;
        }

      case 8:
        // lookup trimmed
        return this.table.values[glyph - this.table.firstGlyph];

      default:
        throw new Error("Unknown lookup table format: " + this.table.version);
    }
  };

  _proto.glyphsForValue = function glyphsForValue(classValue) {
    var res = [];

    switch (this.table.version) {
      case 2: // segment format

      case 4:
        {
          for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.table.segments), _step; !(_step = _iterator()).done;) {
            var segment = _step.value;

            if (this.table.version === 2 && segment.value === classValue) {
              res.push.apply(res, range(segment.firstGlyph, segment.lastGlyph + 1));
            } else {
              for (var index = 0; index < segment.values.length; index++) {
                if (segment.values[index] === classValue) {
                  res.push(segment.firstGlyph + index);
                }
              }
            }
          }

          break;
        }

      case 6:
        {
          // lookup single
          for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.table.segments), _step2; !(_step2 = _iterator2()).done;) {
            var _segment = _step2.value;

            if (_segment.value === classValue) {
              res.push(_segment.glyph);
            }
          }

          break;
        }

      case 8:
        {
          // lookup trimmed
          for (var i = 0; i < this.table.values.length; i++) {
            if (this.table.values[i] === classValue) {
              res.push(this.table.firstGlyph + i);
            }
          }

          break;
        }

      default:
        throw new Error("Unknown lookup table format: " + this.table.version);
    }

    return res;
  };

  return AATLookupTable;
}(), ((0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$3.prototype, "glyphsForValue", [cache], Object.getOwnPropertyDescriptor(_class$3.prototype, "glyphsForValue"), _class$3.prototype)), _class$3);

var START_OF_TEXT_STATE = 0;
var END_OF_TEXT_CLASS = 0;
var OUT_OF_BOUNDS_CLASS = 1;
var DELETED_GLYPH_CLASS = 2;
var DONT_ADVANCE = 0x4000;

var AATStateMachine = /*#__PURE__*/function () {
  function AATStateMachine(stateTable) {
    this.stateTable = stateTable;
    this.lookupTable = new AATLookupTable(stateTable.classTable);
  }

  var _proto = AATStateMachine.prototype;

  _proto.process = function process(glyphs, reverse, processEntry) {
    var currentState = START_OF_TEXT_STATE; // START_OF_LINE_STATE is used for kashida glyph insertions sometimes I think?

    var index = reverse ? glyphs.length - 1 : 0;
    var dir = reverse ? -1 : 1;

    while (dir === 1 && index <= glyphs.length || dir === -1 && index >= -1) {
      var glyph = null;
      var classCode = OUT_OF_BOUNDS_CLASS;
      var shouldAdvance = true;

      if (index === glyphs.length || index === -1) {
        classCode = END_OF_TEXT_CLASS;
      } else {
        glyph = glyphs[index];

        if (glyph.id === 0xffff) {
          // deleted glyph
          classCode = DELETED_GLYPH_CLASS;
        } else {
          classCode = this.lookupTable.lookup(glyph.id);

          if (classCode == null) {
            classCode = OUT_OF_BOUNDS_CLASS;
          }
        }
      }

      var row = this.stateTable.stateArray.getItem(currentState);
      var entryIndex = row[classCode];
      var entry = this.stateTable.entryTable.getItem(entryIndex);

      if (classCode !== END_OF_TEXT_CLASS && classCode !== DELETED_GLYPH_CLASS) {
        processEntry(glyph, entry, index);
        shouldAdvance = !(entry.flags & DONT_ADVANCE);
      }

      currentState = entry.newState;

      if (shouldAdvance) {
        index += dir;
      }
    }

    return glyphs;
  }
  /**
   * Performs a depth-first traversal of the glyph strings
   * represented by the state machine.
   */
  ;

  _proto.traverse = function traverse(opts, state, visited) {
    if (state === void 0) {
      state = 0;
    }

    if (visited === void 0) {
      visited = new Set();
    }

    if (visited.has(state)) {
      return;
    }

    visited.add(state);
    var _this$stateTable = this.stateTable,
        nClasses = _this$stateTable.nClasses,
        stateArray = _this$stateTable.stateArray,
        entryTable = _this$stateTable.entryTable;
    var row = stateArray.getItem(state); // Skip predefined classes

    for (var classCode = 4; classCode < nClasses; classCode++) {
      var entryIndex = row[classCode];
      var entry = entryTable.getItem(entryIndex); // Try all glyphs in the class

      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.lookupTable.glyphsForValue(classCode)), _step; !(_step = _iterator()).done;) {
        var glyph = _step.value;

        if (opts.enter) {
          opts.enter(glyph, entry);
        }

        if (entry.newState !== 0) {
          this.traverse(opts, entry.newState, visited);
        }

        if (opts.exit) {
          opts.exit(glyph, entry);
        }
      }
    }
  };

  return AATStateMachine;
}();

var _class$2;

var MARK_FIRST = 0x8000;
var MARK_LAST = 0x2000;
var VERB = 0x000F; // contextual substitution and glyph insertion flag

var SET_MARK = 0x8000; // ligature entry flags

var SET_COMPONENT = 0x8000;
var PERFORM_ACTION = 0x2000; // ligature action masks

var LAST_MASK = 0x80000000;
var STORE_MASK = 0x40000000;
var OFFSET_MASK = 0x3FFFFFFF;
var REVERSE_DIRECTION = 0x400000;
var CURRENT_INSERT_BEFORE = 0x0800;
var MARKED_INSERT_BEFORE = 0x0400;
var CURRENT_INSERT_COUNT = 0x03E0;
var MARKED_INSERT_COUNT = 0x001F;
var AATMorxProcessor = (_class$2 = /*#__PURE__*/function () {
  function AATMorxProcessor(font) {
    this.processIndicRearragement = this.processIndicRearragement.bind(this);
    this.processContextualSubstitution = this.processContextualSubstitution.bind(this);
    this.processLigature = this.processLigature.bind(this);
    this.processNoncontextualSubstitutions = this.processNoncontextualSubstitutions.bind(this);
    this.processGlyphInsertion = this.processGlyphInsertion.bind(this);
    this.font = font;
    this.morx = font.morx;
    this.inputCache = null;
  } // Processes an array of glyphs and applies the specified features
  // Features should be in the form of {featureType:{featureSetting:boolean}}


  var _proto = AATMorxProcessor.prototype;

  _proto.process = function process(glyphs, features) {
    if (features === void 0) {
      features = {};
    }

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.morx.chains), _step; !(_step = _iterator()).done;) {
      var chain = _step.value;
      var flags = chain.defaultFlags; // enable/disable the requested features

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(chain.features), _step2; !(_step2 = _iterator2()).done;) {
        var feature = _step2.value;
        var f = void 0;

        if (f = features[feature.featureType]) {
          if (f[feature.featureSetting]) {
            flags &= feature.disableFlags;
            flags |= feature.enableFlags;
          } else if (f[feature.featureSetting] === false) {
            flags |= ~feature.disableFlags;
            flags &= ~feature.enableFlags;
          }
        }
      }

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(chain.subtables), _step3; !(_step3 = _iterator3()).done;) {
        var subtable = _step3.value;

        if (subtable.subFeatureFlags & flags) {
          this.processSubtable(subtable, glyphs);
        }
      }
    } // remove deleted glyphs


    var index = glyphs.length - 1;

    while (index >= 0) {
      if (glyphs[index].id === 0xffff) {
        glyphs.splice(index, 1);
      }

      index--;
    }

    return glyphs;
  };

  _proto.processSubtable = function processSubtable(subtable, glyphs) {
    this.subtable = subtable;
    this.glyphs = glyphs;

    if (this.subtable.type === 4) {
      this.processNoncontextualSubstitutions(this.subtable, this.glyphs);
      return;
    }

    this.ligatureStack = [];
    this.markedGlyph = null;
    this.firstGlyph = null;
    this.lastGlyph = null;
    this.markedIndex = null;
    var stateMachine = this.getStateMachine(subtable);
    var process = this.getProcessor();
    var reverse = !!(this.subtable.coverage & REVERSE_DIRECTION);
    return stateMachine.process(this.glyphs, reverse, process);
  };

  _proto.getStateMachine = function getStateMachine(subtable) {
    return new AATStateMachine(subtable.table.stateTable);
  };

  _proto.getProcessor = function getProcessor() {
    switch (this.subtable.type) {
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
        throw new Error("Invalid morx subtable type: " + this.subtable.type);
    }
  };

  _proto.processIndicRearragement = function processIndicRearragement(glyph, entry, index) {
    if (entry.flags & MARK_FIRST) {
      this.firstGlyph = index;
    }

    if (entry.flags & MARK_LAST) {
      this.lastGlyph = index;
    }

    reorderGlyphs(this.glyphs, entry.flags & VERB, this.firstGlyph, this.lastGlyph);
  };

  _proto.processContextualSubstitution = function processContextualSubstitution(glyph, entry, index) {
    var subsitutions = this.subtable.table.substitutionTable.items;

    if (entry.markIndex !== 0xffff) {
      var lookup = subsitutions.getItem(entry.markIndex);
      var lookupTable = new AATLookupTable(lookup);
      glyph = this.glyphs[this.markedGlyph];
      var gid = lookupTable.lookup(glyph.id);

      if (gid) {
        this.glyphs[this.markedGlyph] = this.font.getGlyph(gid, glyph.codePoints);
      }
    }

    if (entry.currentIndex !== 0xffff) {
      var _lookup = subsitutions.getItem(entry.currentIndex);

      var _lookupTable = new AATLookupTable(_lookup);

      glyph = this.glyphs[index];

      var gid = _lookupTable.lookup(glyph.id);

      if (gid) {
        this.glyphs[index] = this.font.getGlyph(gid, glyph.codePoints);
      }
    }

    if (entry.flags & SET_MARK) {
      this.markedGlyph = index;
    }
  };

  _proto.processLigature = function processLigature(glyph, entry, index) {
    if (entry.flags & SET_COMPONENT) {
      this.ligatureStack.push(index);
    }

    if (entry.flags & PERFORM_ACTION) {
      var _this$ligatureStack;

      var actions = this.subtable.table.ligatureActions;
      var components = this.subtable.table.components;
      var ligatureList = this.subtable.table.ligatureList;
      var actionIndex = entry.action;
      var last = false;
      var ligatureIndex = 0;
      var codePoints = [];
      var ligatureGlyphs = [];

      while (!last) {
        var _codePoints;

        var componentGlyph = this.ligatureStack.pop();

        (_codePoints = codePoints).unshift.apply(_codePoints, this.glyphs[componentGlyph].codePoints);

        var action = actions.getItem(actionIndex++);
        last = !!(action & LAST_MASK);
        var store = !!(action & STORE_MASK);
        var offset = (action & OFFSET_MASK) << 2 >> 2; // sign extend 30 to 32 bits

        offset += this.glyphs[componentGlyph].id;
        var component = components.getItem(offset);
        ligatureIndex += component;

        if (last || store) {
          var ligatureEntry = ligatureList.getItem(ligatureIndex);
          this.glyphs[componentGlyph] = this.font.getGlyph(ligatureEntry, codePoints);
          ligatureGlyphs.push(componentGlyph);
          ligatureIndex = 0;
          codePoints = [];
        } else {
          this.glyphs[componentGlyph] = this.font.getGlyph(0xffff);
        }
      } // Put ligature glyph indexes back on the stack


      (_this$ligatureStack = this.ligatureStack).push.apply(_this$ligatureStack, ligatureGlyphs);
    }
  };

  _proto.processNoncontextualSubstitutions = function processNoncontextualSubstitutions(subtable, glyphs, index) {
    var lookupTable = new AATLookupTable(subtable.table.lookupTable);

    for (index = 0; index < glyphs.length; index++) {
      var glyph = glyphs[index];

      if (glyph.id !== 0xffff) {
        var gid = lookupTable.lookup(glyph.id);

        if (gid) {
          // 0 means do nothing
          glyphs[index] = this.font.getGlyph(gid, glyph.codePoints);
        }
      }
    }
  };

  _proto._insertGlyphs = function _insertGlyphs(glyphIndex, insertionActionIndex, count, isBefore) {
    var _this$glyphs;

    var insertions = [];

    while (count--) {
      var gid = this.subtable.table.insertionActions.getItem(insertionActionIndex++);
      insertions.push(this.font.getGlyph(gid));
    }

    if (!isBefore) {
      glyphIndex++;
    }

    (_this$glyphs = this.glyphs).splice.apply(_this$glyphs, [glyphIndex, 0].concat(insertions));
  };

  _proto.processGlyphInsertion = function processGlyphInsertion(glyph, entry, index) {
    if (entry.flags & SET_MARK) {
      this.markedIndex = index;
    }

    if (entry.markedInsertIndex !== 0xffff) {
      var count = (entry.flags & MARKED_INSERT_COUNT) >>> 5;
      var isBefore = !!(entry.flags & MARKED_INSERT_BEFORE);

      this._insertGlyphs(this.markedIndex, entry.markedInsertIndex, count, isBefore);
    }

    if (entry.currentInsertIndex !== 0xffff) {
      var _count = (entry.flags & CURRENT_INSERT_COUNT) >>> 5;

      var _isBefore = !!(entry.flags & CURRENT_INSERT_BEFORE);

      this._insertGlyphs(index, entry.currentInsertIndex, _count, _isBefore);
    }
  };

  _proto.getSupportedFeatures = function getSupportedFeatures() {
    var features = [];

    for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.morx.chains), _step4; !(_step4 = _iterator4()).done;) {
      var chain = _step4.value;

      for (var _iterator5 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(chain.features), _step5; !(_step5 = _iterator5()).done;) {
        var feature = _step5.value;
        features.push([feature.featureType, feature.featureSetting]);
      }
    }

    return features;
  };

  _proto.generateInputs = function generateInputs(gid) {
    if (!this.inputCache) {
      this.generateInputCache();
    }

    return this.inputCache[gid] || [];
  };

  _proto.generateInputCache = function generateInputCache() {
    this.inputCache = {};

    for (var _iterator6 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.morx.chains), _step6; !(_step6 = _iterator6()).done;) {
      var chain = _step6.value;
      var flags = chain.defaultFlags;

      for (var _iterator7 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(chain.subtables), _step7; !(_step7 = _iterator7()).done;) {
        var subtable = _step7.value;

        if (subtable.subFeatureFlags & flags) {
          this.generateInputsForSubtable(subtable);
        }
      }
    }
  };

  _proto.generateInputsForSubtable = function generateInputsForSubtable(subtable) {
    var _this = this;

    // Currently, only supporting ligature subtables.
    if (subtable.type !== 2) {
      return;
    }

    var reverse = !!(subtable.coverage & REVERSE_DIRECTION);

    if (reverse) {
      throw new Error('Reverse subtable, not supported.');
    }

    this.subtable = subtable;
    this.ligatureStack = [];
    var stateMachine = this.getStateMachine(subtable);
    var process = this.getProcessor();
    var input = [];
    var stack = [];
    this.glyphs = [];
    stateMachine.traverse({
      enter: function enter(glyph, entry) {
        var glyphs = _this.glyphs;
        stack.push({
          glyphs: glyphs.slice(),
          ligatureStack: _this.ligatureStack.slice()
        }); // Add glyph to input and glyphs to process.

        var g = _this.font.getGlyph(glyph);

        input.push(g);
        glyphs.push(input[input.length - 1]); // Process ligature substitution

        process(glyphs[glyphs.length - 1], entry, glyphs.length - 1); // Add input to result if only one matching (non-deleted) glyph remains.

        var count = 0;
        var found = 0;

        for (var i = 0; i < glyphs.length && count <= 1; i++) {
          if (glyphs[i].id !== 0xffff) {
            count++;
            found = glyphs[i].id;
          }
        }

        if (count === 1) {
          var result = input.map(function (g) {
            return g.id;
          });
          var _cache = _this.inputCache[found];

          if (_cache) {
            _cache.push(result);
          } else {
            _this.inputCache[found] = [result];
          }
        }
      },
      exit: function exit() {
        var _stack$pop = stack.pop();

        _this.glyphs = _stack$pop.glyphs;
        _this.ligatureStack = _stack$pop.ligatureStack;
        input.pop();
      }
    });
  };

  return AATMorxProcessor;
}(), ((0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$2.prototype, "getStateMachine", [cache], Object.getOwnPropertyDescriptor(_class$2.prototype, "getStateMachine"), _class$2.prototype)), _class$2);
// reverse the glyphs inside those ranges if specified
// ranges are in [offset, length] format

function swap(glyphs, rangeA, rangeB, reverseA, reverseB) {
  if (reverseA === void 0) {
    reverseA = false;
  }

  if (reverseB === void 0) {
    reverseB = false;
  }

  var end = glyphs.splice(rangeB[0] - (rangeB[1] - 1), rangeB[1]);

  if (reverseB) {
    end.reverse();
  }

  var start = glyphs.splice.apply(glyphs, [rangeA[0], rangeA[1]].concat(end));

  if (reverseA) {
    start.reverse();
  }

  glyphs.splice.apply(glyphs, [rangeB[0] - (rangeA[1] - 1), 0].concat(start));
  return glyphs;
}

function reorderGlyphs(glyphs, verb, firstGlyph, lastGlyph) {

  switch (verb) {
    case 0:
      // no change
      return glyphs;

    case 1:
      // Ax => xA
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 0]);

    case 2:
      // xD => Dx
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 1]);

    case 3:
      // AxD => DxA
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 1]);

    case 4:
      // ABx => xAB
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 0]);

    case 5:
      // ABx => xBA
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 0], true, false);

    case 6:
      // xCD => CDx
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 2]);

    case 7:
      // xCD => DCx
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 2], false, true);

    case 8:
      // AxCD => CDxA
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 2]);

    case 9:
      // AxCD => DCxA
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 2], false, true);

    case 10:
      // ABxD => DxAB
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 1]);

    case 11:
      // ABxD => DxBA
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 1], true, false);

    case 12:
      // ABxCD => CDxAB
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2]);

    case 13:
      // ABxCD => CDxBA
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], true, false);

    case 14:
      // ABxCD => DCxAB
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], false, true);

    case 15:
      // ABxCD => DCxBA
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], true, true);

    default:
      throw new Error("Unknown verb: " + verb);
  }
}

var AATLayoutEngine = /*#__PURE__*/function () {
  function AATLayoutEngine(font) {
    this.font = font;
    this.morxProcessor = new AATMorxProcessor(font);
    this.fallbackPosition = false;
  }

  var _proto = AATLayoutEngine.prototype;

  _proto.substitute = function substitute(glyphRun) {
    // AAT expects the glyphs to be in visual order prior to morx processing,
    // so reverse the glyphs if the script is right-to-left.
    if (glyphRun.direction === 'rtl') {
      glyphRun.glyphs.reverse();
    }

    this.morxProcessor.process(glyphRun.glyphs, mapOTToAAT(glyphRun.features));
  };

  _proto.getAvailableFeatures = function getAvailableFeatures(script, language) {
    return mapAATToOT(this.morxProcessor.getSupportedFeatures());
  };

  _proto.stringsForGlyph = function stringsForGlyph(gid) {
    var glyphStrings = this.morxProcessor.generateInputs(gid);
    var result = new Set();

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphStrings), _step; !(_step = _iterator()).done;) {
      var glyphs = _step.value;

      this._addStrings(glyphs, 0, result, '');
    }

    return result;
  };

  _proto._addStrings = function _addStrings(glyphs, index, strings, string) {
    var codePoints = this.font._cmapProcessor.codePointsForGlyph(glyphs[index]);

    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(codePoints), _step2; !(_step2 = _iterator2()).done;) {
      var codePoint = _step2.value;
      var s = string + String.fromCodePoint(codePoint);

      if (index < glyphs.length - 1) {
        this._addStrings(glyphs, index + 1, strings, s);
      } else {
        strings.add(s);
      }
    }
  };

  return AATLayoutEngine;
}();

/**
 * ShapingPlans are used by the OpenType shapers to store which
 * features should by applied, and in what order to apply them.
 * The features are applied in groups called stages. A feature
 * can be applied globally to all glyphs, or locally to only
 * specific glyphs.
 *
 * @private
 */

var ShapingPlan = /*#__PURE__*/function () {
  function ShapingPlan(font, script, direction) {
    this.font = font;
    this.script = script;
    this.direction = direction;
    this.stages = [];
    this.globalFeatures = {};
    this.allFeatures = {};
  }
  /**
   * Adds the given features to the last stage.
   * Ignores features that have already been applied.
   */


  var _proto = ShapingPlan.prototype;

  _proto._addFeatures = function _addFeatures(features, global) {
    var stageIndex = this.stages.length - 1;
    var stage = this.stages[stageIndex];

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(features), _step; !(_step = _iterator()).done;) {
      var feature = _step.value;

      if (this.allFeatures[feature] == null) {
        stage.push(feature);
        this.allFeatures[feature] = stageIndex;

        if (global) {
          this.globalFeatures[feature] = true;
        }
      }
    }
  }
  /**
   * Add features to the last stage
   */
  ;

  _proto.add = function add(arg, global) {
    if (global === void 0) {
      global = true;
    }

    if (this.stages.length === 0) {
      this.stages.push([]);
    }

    if (typeof arg === 'string') {
      arg = [arg];
    }

    if (Array.isArray(arg)) {
      this._addFeatures(arg, global);
    } else if (typeof arg === 'object') {
      this._addFeatures(arg.global || [], true);

      this._addFeatures(arg.local || [], false);
    } else {
      throw new Error("Unsupported argument to ShapingPlan#add");
    }
  }
  /**
   * Add a new stage
   */
  ;

  _proto.addStage = function addStage(arg, global) {
    if (typeof arg === 'function') {
      this.stages.push(arg, []);
    } else {
      this.stages.push([]);
      this.add(arg, global);
    }
  };

  _proto.setFeatureOverrides = function setFeatureOverrides(features) {
    if (Array.isArray(features)) {
      this.add(features);
    } else if (typeof features === 'object') {
      for (var tag in features) {
        if (features[tag]) {
          this.add(tag);
        } else if (this.allFeatures[tag] != null) {
          var stage = this.stages[this.allFeatures[tag]];
          stage.splice(stage.indexOf(tag), 1);
          delete this.allFeatures[tag];
          delete this.globalFeatures[tag];
        }
      }
    }
  }
  /**
   * Assigns the global features to the given glyphs
   */
  ;

  _proto.assignGlobalFeatures = function assignGlobalFeatures(glyphs) {
    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphs), _step2; !(_step2 = _iterator2()).done;) {
      var glyph = _step2.value;

      for (var feature in this.globalFeatures) {
        glyph.features[feature] = true;
      }
    }
  }
  /**
   * Executes the planned stages using the given OTProcessor
   */
  ;

  _proto.process = function process(processor, glyphs, positions) {
    for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.stages), _step3; !(_step3 = _iterator3()).done;) {
      var stage = _step3.value;

      if (typeof stage === 'function') {
        if (!positions) {
          stage(this.font, glyphs, this);
        }
      } else if (stage.length > 0) {
        processor.applyFeatures(stage, glyphs, positions);
      }
    }
  };

  return ShapingPlan;
}();

// Updated: 417af0c79c5664271a07a783574ec7fac7ebad0c
var VARIATION_FEATURES = ['rvrn'];
var COMMON_FEATURES = ['ccmp', 'locl', 'rlig', 'mark', 'mkmk'];
var FRACTIONAL_FEATURES = ['frac', 'numr', 'dnom'];
var HORIZONTAL_FEATURES = ['calt', 'clig', 'liga', 'rclt', 'curs', 'kern'];
var DIRECTIONAL_FEATURES = {
  ltr: ['ltra', 'ltrm'],
  rtl: ['rtla', 'rtlm']
};

var DefaultShaper = /*#__PURE__*/function () {
  function DefaultShaper() {}

  DefaultShaper.plan = function plan(_plan, glyphs, features) {
    // Plan the features we want to apply
    this.planPreprocessing(_plan);
    this.planFeatures(_plan);
    this.planPostprocessing(_plan, features); // Assign the global features to all the glyphs

    _plan.assignGlobalFeatures(glyphs); // Assign local features to glyphs


    this.assignFeatures(_plan, glyphs);
  };

  DefaultShaper.planPreprocessing = function planPreprocessing(plan) {
    plan.add({
      global: [].concat(VARIATION_FEATURES, DIRECTIONAL_FEATURES[plan.direction]),
      local: FRACTIONAL_FEATURES
    });
  };

  DefaultShaper.planFeatures = function planFeatures(plan) {// Do nothing by default. Let subclasses override this.
  };

  DefaultShaper.planPostprocessing = function planPostprocessing(plan, userFeatures) {
    plan.add([].concat(COMMON_FEATURES, HORIZONTAL_FEATURES));
    plan.setFeatureOverrides(userFeatures);
  };

  DefaultShaper.assignFeatures = function assignFeatures(plan, glyphs) {
    // Enable contextual fractions
    for (var i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];

      if (glyph.codePoints[0] === 0x2044) {
        // fraction slash
        var start = i;
        var end = i + 1; // Apply numerator

        while (start > 0 && _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].isDigit(glyphs[start - 1].codePoints[0])) {
          glyphs[start - 1].features.numr = true;
          glyphs[start - 1].features.frac = true;
          start--;
        } // Apply denominator


        while (end < glyphs.length && _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].isDigit(glyphs[end].codePoints[0])) {
          glyphs[end].features.dnom = true;
          glyphs[end].features.frac = true;
          end++;
        } // Apply fraction slash


        glyph.features.frac = true;
        i = end - 1;
      }
    }
  };

  return DefaultShaper;
}();

DefaultShaper.zeroMarkWidths = 'AFTER_GPOS';

var type$2 = "Buffer";
var data$2 = [
	0,
	1,
	240,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	56,
	0,
	1,
	253,
	1,
	2,
	254,
	237,
	154,
	45,
	76,
	196,
	48,
	20,
	199,
	187,
	237,
	190,
	56,
	64,
	129,
	192,
	224,
	144,
	72,
	4,
	2,
	121,
	151,
	16,
	18,
	12,
	9,
	134,
	132,
	115,
	40,
	4,
	138,
	160,
	80,
	224,
	80,
	36,
	8,
	78,
	34,
	145,
	72,
	12,
	138,
	32,
	73,
	72,
	8,
	18,
	137,
	68,
	18,
	12,
	201,
	253,
	47,
	215,
	146,
	151,
	166,
	221,
	117,
	215,
	110,
	131,
	219,
	123,
	201,
	47,
	237,
	173,
	235,
	235,
	123,
	237,
	235,
	219,
	186,
	92,
	55,
	22,
	98,
	27,
	236,
	130,
	125,
	208,
	149,
	191,
	255,
	75,
	121,
	12,
	78,
	193,
	25,
	184,
	0,
	151,
	160,
	15,
	110,
	192,
	45,
	184,
	3,
	247,
	224,
	1,
	60,
	145,
	126,
	207,
	224,
	77,
	254,
	30,
	242,
	14,
	62,
	100,
	253,
	83,
	150,
	95,
	164,
	157,
	153,
	78,
	126,
	192,
	181,
	164,
	158,
	8,
	49,
	15,
	22,
	146,
	242,
	237,
	42,
	138,
	37,
	248,
	186,
	44,
	253,
	93,
	169,
	144,
	223,
	12,
	195,
	48,
	12,
	195,
	48,
	12,
	195,
	48,
	12,
	195,
	84,
	143,
	225,
	247,
	159,
	85,
	254,
	254,
	193,
	48,
	12,
	195,
	48,
	12,
	195,
	48,
	185,
	114,
	53,
	51,
	98,
	49,
	39,
	94,
	193,
	92,
	91,
	136,
	14,
	56,
	7,
	143,
	224,
	187,
	61,
	106,
	91,
	159,
	21,
	98,
	83,
	8,
	209,
	107,
	9,
	209,
	111,
	141,
	234,
	69,
	240,
	210,
	202,
	111,
	62,
	215,
	112,
	134,
	217,
	48,
	156,
	99,
	58,
	184,
	182,
	149,
	225,
	124,
	179,
	131,
	123,
	247,
	60,
	207,
	67,
	61,
	244,
	63,
	176,
	232,
	56,
	196,
	245,
	163,
	138,
	156,
	183,
	212,
	255,
	11,
	78,
	166,
	212,
	223,
	78,
	28,
	253,
	194,
	194,
	82,
	101,
	137,
	44,
	208,
	118,
	83,
	61,
	148,
	212,
	164,
	222,
	68,
	163,
	102,
	40,
	117,
	76,
	125,
	178,
	66,
	251,
	253,
	37,
	161,
	54,
	81,
	31,
	245,
	185,
	114,
	241,
	47,
	4,
	147,
	204,
	109,
	17,
	36,
	90,
	221,
	197,
	15,
	83,
	92,
	169,
	118,
	65,
	74,
	155,
	132,
	216,
	7,
	116,
	60,
	23,
	161,
	62,
	211,
	107,
	62,
	210,
	4,
	117,
	131,
	254,
	134,
	36,
	109,
	253,
	93,
	99,
	34,
	33,
	58,
	245,
	126,
	13,
	79,
	251,
	149,
	100,
	141,
	207,
	80,
	113,
	61,
	110,
	110,
	76,
	237,
	227,
	198,
	117,
	149,
	178,
	247,
	157,
	111,
	236,
	217,
	250,
	143,
	203,
	245,
	89,
	98,
	143,
	222,
	107,
	122,
	182,
	217,
	236,
	138,
	12,
	122,
	84,
	222,
	213,
	115,
	69,
	104,
	153,
	36,
	134,
	169,
	109,
	166,
	24,
	211,
	245,
	154,
	230,
	79,
	151,
	178,
	223,
	140,
	213,
	26,
	40,
	209,
	109,
	12,
	101,
	95,
	217,
	251,
	196,
	244,
	238,
	213,
	148,
	20,
	185,
	143,
	125,
	247,
	115,
	154,
	127,
	121,
	234,
	14,
	169,
	203,
	53,
	71,
	248,
	72,
	168,
	53,
	139,
	39,
	180,
	211,
	150,
	75,
	34,
	173,
	84,
	245,
	72,
	142,
	229,
	242,
	78,
	24,
	167,
	232,
	55,
	141,
	167,
	198,
	114,
	181,
	53,
	68,
	206,
	165,
	246,
	216,
	124,
	209,
	115,
	169,
	158,
	83,
	125,
	237,
	176,
	205,
	99,
	136,
	184,
	179,
	173,
	65,
	209,
	40,
	191,
	138,
	150,
	180,
	184,
	115,
	37,
	235,
	58,
	132,
	142,
	81,
	95,
	9,
	153,
	191,
	76,
	207,
	10,
	155,
	52,
	3,
	142,
	107,
	147,
	1
];
var trieData$2 = {
	type: type$2,
	data: data$2
};

var trie$2 = new (unicode_trie__WEBPACK_IMPORTED_MODULE_4___default())(new Uint8Array(trieData$2.data));
var FEATURES = ['isol', 'fina', 'fin2', 'fin3', 'medi', 'med2', 'init'];
var ShapingClasses = {
  Non_Joining: 0,
  Left_Joining: 1,
  Right_Joining: 2,
  Dual_Joining: 3,
  Join_Causing: 3,
  ALAPH: 4,
  'DALATH RISH': 5,
  Transparent: 6
};
var ISOL = 'isol';
var FINA = 'fina';
var FIN2 = 'fin2';
var FIN3 = 'fin3';
var MEDI = 'medi';
var MED2 = 'med2';
var INIT = 'init';
var NONE = null; // Each entry is [prevAction, curAction, nextState]

var STATE_TABLE$1 = [//   Non_Joining,        Left_Joining,       Right_Joining,     Dual_Joining,           ALAPH,            DALATH RISH
// State 0: prev was U,  not willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 6]], // State 1: prev was R or ISOL/ALAPH,  not willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN2, 5], [NONE, ISOL, 6]], // State 2: prev was D/L in ISOL form,  willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [INIT, FINA, 1], [INIT, FINA, 3], [INIT, FINA, 4], [INIT, FINA, 6]], // State 3: prev was D in FINA form,  willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [MEDI, FINA, 1], [MEDI, FINA, 3], [MEDI, FINA, 4], [MEDI, FINA, 6]], // State 4: prev was FINA ALAPH,  not willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [MED2, ISOL, 1], [MED2, ISOL, 2], [MED2, FIN2, 5], [MED2, ISOL, 6]], // State 5: prev was FIN2/FIN3 ALAPH,  not willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [ISOL, ISOL, 1], [ISOL, ISOL, 2], [ISOL, FIN2, 5], [ISOL, ISOL, 6]], // State 6: prev was DALATH/RISH,  not willing to join.
[[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN3, 5], [NONE, ISOL, 6]]];
/**
 * This is a shaper for Arabic, and other cursive scripts.
 * It uses data from ArabicShaping.txt in the Unicode database,
 * compiled to a UnicodeTrie by generate-data.coffee.
 *
 * The shaping state machine was ported from Harfbuzz.
 * https://github.com/behdad/harfbuzz/blob/master/src/hb-ot-shape-complex-arabic.cc
 */

var ArabicShaper = /*#__PURE__*/function (_DefaultShaper) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(ArabicShaper, _DefaultShaper);

  function ArabicShaper() {
    return _DefaultShaper.apply(this, arguments) || this;
  }

  ArabicShaper.planFeatures = function planFeatures(plan) {
    plan.add(['ccmp', 'locl']);

    for (var i = 0; i < FEATURES.length; i++) {
      var feature = FEATURES[i];
      plan.addStage(feature, false);
    }

    plan.addStage('mset');
  };

  ArabicShaper.assignFeatures = function assignFeatures(plan, glyphs) {
    _DefaultShaper.assignFeatures.call(this, plan, glyphs);

    var prev = -1;
    var state = 0;
    var actions = []; // Apply the state machine to map glyphs to features

    for (var i = 0; i < glyphs.length; i++) {
      var curAction = void 0,
          prevAction = void 0;
      var glyph = glyphs[i];
      var type = getShapingClass(glyph.codePoints[0]);

      if (type === ShapingClasses.Transparent) {
        actions[i] = NONE;
        continue;
      }

      var _STATE_TABLE$state$ty = STATE_TABLE$1[state][type];
      prevAction = _STATE_TABLE$state$ty[0];
      curAction = _STATE_TABLE$state$ty[1];
      state = _STATE_TABLE$state$ty[2];

      if (prevAction !== NONE && prev !== -1) {
        actions[prev] = prevAction;
      }

      actions[i] = curAction;
      prev = i;
    } // Apply the chosen features to their respective glyphs


    for (var index = 0; index < glyphs.length; index++) {
      var feature = void 0;
      var glyph = glyphs[index];

      if (feature = actions[index]) {
        glyph.features[feature] = true;
      }
    }
  };

  return ArabicShaper;
}(DefaultShaper);

function getShapingClass(codePoint) {
  var res = trie$2.get(codePoint);

  if (res) {
    return res - 1;
  }

  var category = _react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].getCategory(codePoint);

  if (category === 'Mn' || category === 'Me' || category === 'Cf') {
    return ShapingClasses.Transparent;
  }

  return ShapingClasses.Non_Joining;
}

var GlyphIterator = /*#__PURE__*/function () {
  function GlyphIterator(glyphs, options) {
    this.glyphs = glyphs;
    this.reset(options);
  }

  var _proto = GlyphIterator.prototype;

  _proto.reset = function reset(options, index) {
    if (options === void 0) {
      options = {};
    }

    if (index === void 0) {
      index = 0;
    }

    this.options = options;
    this.flags = options.flags || {};
    this.markAttachmentType = options.markAttachmentType || 0;
    this.index = index;
  };

  _proto.shouldIgnore = function shouldIgnore(glyph) {
    return this.flags.ignoreMarks && glyph.isMark || this.flags.ignoreBaseGlyphs && glyph.isBase || this.flags.ignoreLigatures && glyph.isLigature || this.markAttachmentType && glyph.isMark && glyph.markAttachmentType !== this.markAttachmentType;
  };

  _proto.move = function move(dir) {
    this.index += dir;

    while (0 <= this.index && this.index < this.glyphs.length && this.shouldIgnore(this.glyphs[this.index])) {
      this.index += dir;
    }

    if (0 > this.index || this.index >= this.glyphs.length) {
      return null;
    }

    return this.glyphs[this.index];
  };

  _proto.next = function next() {
    return this.move(+1);
  };

  _proto.prev = function prev() {
    return this.move(-1);
  };

  _proto.peek = function peek(count) {
    if (count === void 0) {
      count = 1;
    }

    var idx = this.index;
    var res = this.increment(count);
    this.index = idx;
    return res;
  };

  _proto.peekIndex = function peekIndex(count) {
    if (count === void 0) {
      count = 1;
    }

    var idx = this.index;
    this.increment(count);
    var res = this.index;
    this.index = idx;
    return res;
  };

  _proto.increment = function increment(count) {
    if (count === void 0) {
      count = 1;
    }

    var dir = count < 0 ? -1 : 1;
    count = Math.abs(count);

    while (count--) {
      this.move(dir);
    }

    return this.glyphs[this.index];
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(GlyphIterator, [{
    key: "cur",
    get: function get() {
      return this.glyphs[this.index] || null;
    }
  }]);

  return GlyphIterator;
}();

var DEFAULT_SCRIPTS = ['DFLT', 'dflt', 'latn'];

var OTProcessor = /*#__PURE__*/function () {
  function OTProcessor(font, table) {
    this.font = font;
    this.table = table;
    this.script = null;
    this.scriptTag = null;
    this.language = null;
    this.languageTag = null;
    this.features = {};
    this.lookups = {}; // Setup variation substitutions

    this.variationsIndex = font._variationProcessor ? this.findVariationsIndex(font._variationProcessor.normalizedCoords) : -1; // initialize to default script + language

    this.selectScript(); // current context (set by applyFeatures)

    this.glyphs = [];
    this.positions = []; // only used by GPOS

    this.ligatureID = 1;
    this.currentFeature = null;
  }

  var _proto = OTProcessor.prototype;

  _proto.findScript = function findScript(script) {
    if (this.table.scriptList == null) {
      return null;
    }

    if (!Array.isArray(script)) {
      script = [script];
    }

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(script), _step; !(_step = _iterator()).done;) {
      var s = _step.value;

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.table.scriptList), _step2; !(_step2 = _iterator2()).done;) {
        var entry = _step2.value;

        if (entry.tag === s) {
          return entry;
        }
      }
    }

    return null;
  };

  _proto.selectScript = function selectScript(script, language, direction$1) {
    var changed = false;
    var entry;

    if (!this.script || script !== this.scriptTag) {
      entry = this.findScript(script);

      if (!entry) {
        entry = this.findScript(DEFAULT_SCRIPTS);
      }

      if (!entry) {
        return this.scriptTag;
      }

      this.scriptTag = entry.tag;
      this.script = entry.script;
      this.language = null;
      this.languageTag = null;
      changed = true;
    }

    if (!direction$1 || direction$1 !== this.direction) {
      this.direction = direction$1 || direction(script);
    }

    if (language && language.length < 4) {
      language += ' '.repeat(4 - language.length);
    }

    if (!language || language !== this.languageTag) {
      this.language = null;

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.script.langSysRecords), _step3; !(_step3 = _iterator3()).done;) {
        var lang = _step3.value;

        if (lang.tag === language) {
          this.language = lang.langSys;
          this.languageTag = lang.tag;
          break;
        }
      }

      if (!this.language) {
        this.language = this.script.defaultLangSys;
        this.languageTag = null;
      }

      changed = true;
    } // Build a feature lookup table


    if (changed) {
      this.features = {};

      if (this.language) {
        for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.language.featureIndexes), _step4; !(_step4 = _iterator4()).done;) {
          var featureIndex = _step4.value;
          var record = this.table.featureList[featureIndex];
          var substituteFeature = this.substituteFeatureForVariations(featureIndex);
          this.features[record.tag] = substituteFeature || record.feature;
        }
      }
    }

    return this.scriptTag;
  };

  _proto.lookupsForFeatures = function lookupsForFeatures(userFeatures, exclude) {
    if (userFeatures === void 0) {
      userFeatures = [];
    }

    var lookups = [];

    for (var _iterator5 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(userFeatures), _step5; !(_step5 = _iterator5()).done;) {
      var tag = _step5.value;
      var feature = this.features[tag];

      if (!feature) {
        continue;
      }

      for (var _iterator6 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(feature.lookupListIndexes), _step6; !(_step6 = _iterator6()).done;) {
        var lookupIndex = _step6.value;

        if (exclude && exclude.indexOf(lookupIndex) !== -1) {
          continue;
        }

        lookups.push({
          feature: tag,
          index: lookupIndex,
          lookup: this.table.lookupList.get(lookupIndex)
        });
      }
    }

    lookups.sort(function (a, b) {
      return a.index - b.index;
    });
    return lookups;
  };

  _proto.substituteFeatureForVariations = function substituteFeatureForVariations(featureIndex) {
    if (this.variationsIndex === -1) {
      return null;
    }

    var record = this.table.featureVariations.featureVariationRecords[this.variationsIndex];
    var substitutions = record.featureTableSubstitution.substitutions;

    for (var _iterator7 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(substitutions), _step7; !(_step7 = _iterator7()).done;) {
      var substitution = _step7.value;

      if (substitution.featureIndex === featureIndex) {
        return substitution.alternateFeatureTable;
      }
    }

    return null;
  };

  _proto.findVariationsIndex = function findVariationsIndex(coords) {
    var variations = this.table.featureVariations;

    if (!variations) {
      return -1;
    }

    var records = variations.featureVariationRecords;

    for (var i = 0; i < records.length; i++) {
      var conditions = records[i].conditionSet.conditionTable;

      if (this.variationConditionsMatch(conditions, coords)) {
        return i;
      }
    }

    return -1;
  };

  _proto.variationConditionsMatch = function variationConditionsMatch(conditions, coords) {
    return conditions.every(function (condition) {
      var coord = condition.axisIndex < coords.length ? coords[condition.axisIndex] : 0;
      return condition.filterRangeMinValue <= coord && coord <= condition.filterRangeMaxValue;
    });
  };

  _proto.applyFeatures = function applyFeatures(userFeatures, glyphs, advances) {
    var lookups = this.lookupsForFeatures(userFeatures);
    this.applyLookups(lookups, glyphs, advances);
  };

  _proto.applyLookups = function applyLookups(lookups, glyphs, positions) {
    this.glyphs = glyphs;
    this.positions = positions;
    this.glyphIterator = new GlyphIterator(glyphs);

    for (var _iterator8 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(lookups), _step8; !(_step8 = _iterator8()).done;) {
      var _step8$value = _step8.value,
          feature = _step8$value.feature,
          lookup = _step8$value.lookup;
      this.currentFeature = feature;
      this.glyphIterator.reset(lookup.flags);

      while (this.glyphIterator.index < glyphs.length) {
        if (!(feature in this.glyphIterator.cur.features)) {
          this.glyphIterator.next();
          continue;
        }

        for (var _iterator9 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(lookup.subTables), _step9; !(_step9 = _iterator9()).done;) {
          var table = _step9.value;
          var res = this.applyLookup(lookup.lookupType, table);

          if (res) {
            break;
          }
        }

        this.glyphIterator.next();
      }
    }
  };

  _proto.applyLookup = function applyLookup(lookup, table) {
    throw new Error("applyLookup must be implemented by subclasses");
  };

  _proto.applyLookupList = function applyLookupList(lookupRecords) {
    var options = this.glyphIterator.options;
    var glyphIndex = this.glyphIterator.index;

    for (var _iterator10 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(lookupRecords), _step10; !(_step10 = _iterator10()).done;) {
      var lookupRecord = _step10.value;
      // Reset flags and find glyph index for this lookup record
      this.glyphIterator.reset(options, glyphIndex);
      this.glyphIterator.increment(lookupRecord.sequenceIndex); // Get the lookup and setup flags for subtables

      var lookup = this.table.lookupList.get(lookupRecord.lookupListIndex);
      this.glyphIterator.reset(lookup.flags, this.glyphIterator.index); // Apply lookup subtables until one matches

      for (var _iterator11 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(lookup.subTables), _step11; !(_step11 = _iterator11()).done;) {
        var table = _step11.value;

        if (this.applyLookup(lookup.lookupType, table)) {
          break;
        }
      }
    }

    this.glyphIterator.reset(options, glyphIndex);
    return true;
  };

  _proto.coverageIndex = function coverageIndex(coverage, glyph) {
    if (glyph == null) {
      glyph = this.glyphIterator.cur.id;
    }

    switch (coverage.version) {
      case 1:
        return coverage.glyphs.indexOf(glyph);

      case 2:
        for (var _iterator12 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(coverage.rangeRecords), _step12; !(_step12 = _iterator12()).done;) {
          var range = _step12.value;

          if (range.start <= glyph && glyph <= range.end) {
            return range.startCoverageIndex + glyph - range.start;
          }
        }

        break;
    }

    return -1;
  };

  _proto.match = function match(sequenceIndex, sequence, fn, matched) {
    var pos = this.glyphIterator.index;
    var glyph = this.glyphIterator.increment(sequenceIndex);
    var idx = 0;

    while (idx < sequence.length && glyph && fn(sequence[idx], glyph)) {
      if (matched) {
        matched.push(this.glyphIterator.index);
      }

      idx++;
      glyph = this.glyphIterator.next();
    }

    this.glyphIterator.index = pos;

    if (idx < sequence.length) {
      return false;
    }

    return matched || true;
  };

  _proto.sequenceMatches = function sequenceMatches(sequenceIndex, sequence) {
    return this.match(sequenceIndex, sequence, function (component, glyph) {
      return component === glyph.id;
    });
  };

  _proto.sequenceMatchIndices = function sequenceMatchIndices(sequenceIndex, sequence) {
    var _this = this;

    return this.match(sequenceIndex, sequence, function (component, glyph) {
      // If the current feature doesn't apply to this glyph,
      if (!(_this.currentFeature in glyph.features)) {
        return false;
      }

      return component === glyph.id;
    }, []);
  };

  _proto.coverageSequenceMatches = function coverageSequenceMatches(sequenceIndex, sequence) {
    var _this2 = this;

    return this.match(sequenceIndex, sequence, function (coverage, glyph) {
      return _this2.coverageIndex(coverage, glyph.id) >= 0;
    });
  };

  _proto.getClassID = function getClassID(glyph, classDef) {
    switch (classDef.version) {
      case 1:
        // Class array
        var i = glyph - classDef.startGlyph;

        if (i >= 0 && i < classDef.classValueArray.length) {
          return classDef.classValueArray[i];
        }

        break;

      case 2:
        for (var _iterator13 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(classDef.classRangeRecord), _step13; !(_step13 = _iterator13()).done;) {
          var range = _step13.value;

          if (range.start <= glyph && glyph <= range.end) {
            return range.class;
          }
        }

        break;
    }

    return 0;
  };

  _proto.classSequenceMatches = function classSequenceMatches(sequenceIndex, sequence, classDef) {
    var _this3 = this;

    return this.match(sequenceIndex, sequence, function (classID, glyph) {
      return classID === _this3.getClassID(glyph.id, classDef);
    });
  };

  _proto.applyContext = function applyContext(table) {
    var index;

    switch (table.version) {
      case 1:
        index = this.coverageIndex(table.coverage);

        if (index === -1) {
          return false;
        }

        var set = table.ruleSets[index];

        for (var _iterator14 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(set), _step14; !(_step14 = _iterator14()).done;) {
          var rule = _step14.value;

          if (this.sequenceMatches(1, rule.input)) {
            return this.applyLookupList(rule.lookupRecords);
          }
        }

        break;

      case 2:
        if (this.coverageIndex(table.coverage) === -1) {
          return false;
        }

        index = this.getClassID(this.glyphIterator.cur.id, table.classDef);

        if (index === -1) {
          return false;
        }

        set = table.classSet[index];

        for (var _iterator15 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(set), _step15; !(_step15 = _iterator15()).done;) {
          var _rule = _step15.value;

          if (this.classSequenceMatches(1, _rule.classes, table.classDef)) {
            return this.applyLookupList(_rule.lookupRecords);
          }
        }

        break;

      case 3:
        if (this.coverageSequenceMatches(0, table.coverages)) {
          return this.applyLookupList(table.lookupRecords);
        }

        break;
    }

    return false;
  };

  _proto.applyChainingContext = function applyChainingContext(table) {
    var index;

    switch (table.version) {
      case 1:
        index = this.coverageIndex(table.coverage);

        if (index === -1) {
          return false;
        }

        var set = table.chainRuleSets[index];

        for (var _iterator16 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(set), _step16; !(_step16 = _iterator16()).done;) {
          var rule = _step16.value;

          if (this.sequenceMatches(-rule.backtrack.length, rule.backtrack) && this.sequenceMatches(1, rule.input) && this.sequenceMatches(1 + rule.input.length, rule.lookahead)) {
            return this.applyLookupList(rule.lookupRecords);
          }
        }

        break;

      case 2:
        if (this.coverageIndex(table.coverage) === -1) {
          return false;
        }

        index = this.getClassID(this.glyphIterator.cur.id, table.inputClassDef);
        var rules = table.chainClassSet[index];

        if (!rules) {
          return false;
        }

        for (var _iterator17 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(rules), _step17; !(_step17 = _iterator17()).done;) {
          var _rule2 = _step17.value;

          if (this.classSequenceMatches(-_rule2.backtrack.length, _rule2.backtrack, table.backtrackClassDef) && this.classSequenceMatches(1, _rule2.input, table.inputClassDef) && this.classSequenceMatches(1 + _rule2.input.length, _rule2.lookahead, table.lookaheadClassDef)) {
            return this.applyLookupList(_rule2.lookupRecords);
          }
        }

        break;

      case 3:
        if (this.coverageSequenceMatches(-table.backtrackGlyphCount, table.backtrackCoverage) && this.coverageSequenceMatches(0, table.inputCoverage) && this.coverageSequenceMatches(table.inputGlyphCount, table.lookaheadCoverage)) {
          return this.applyLookupList(table.lookupRecords);
        }

        break;
    }

    return false;
  };

  return OTProcessor;
}();

var GlyphInfo = /*#__PURE__*/function () {
  function GlyphInfo(font, id, codePoints, features) {
    if (codePoints === void 0) {
      codePoints = [];
    }

    this._font = font;
    this.codePoints = codePoints;
    this.id = id;
    this.features = {};

    if (Array.isArray(features)) {
      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        this.features[feature] = true;
      }
    } else if (typeof features === 'object') {
      Object.assign(this.features, features);
    }

    this.ligatureID = null;
    this.ligatureComponent = null;
    this.isLigated = false;
    this.cursiveAttachment = null;
    this.markAttachment = null;
    this.shaperInfo = null;
    this.substituted = false;
    this.isMultiplied = false;
  }

  var _proto = GlyphInfo.prototype;

  _proto.copy = function copy() {
    return new GlyphInfo(this._font, this.id, this.codePoints, this.features);
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(GlyphInfo, [{
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(id) {
      this._id = id;
      this.substituted = true;
      var GDEF = this._font.GDEF;

      if (GDEF && GDEF.glyphClassDef) {
        // TODO: clean this up
        var classID = OTProcessor.prototype.getClassID(id, GDEF.glyphClassDef);
        this.isBase = classID === 1;
        this.isLigature = classID === 2;
        this.isMark = classID === 3;
        this.markAttachmentType = GDEF.markAttachClassDef ? OTProcessor.prototype.getClassID(id, GDEF.markAttachClassDef) : 0;
      } else {
        this.isMark = this.codePoints.length > 0 && this.codePoints.every(_react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].isMark);
        this.isBase = !this.isMark;
        this.isLigature = this.codePoints.length > 1;
        this.markAttachmentType = 0;
      }
    }
  }]);

  return GlyphInfo;
}();

/**
 * This is a shaper for the Hangul script, used by the Korean language.
 * It does the following:
 *   - decompose if unsupported by the font:
 *     <LV>   -> <L,V>
 *     <LVT>  -> <L,V,T>
 *     <LV,T> -> <L,V,T>
 *
 *   - compose if supported by the font:
 *     <L,V>   -> <LV>
 *     <L,V,T> -> <LVT>
 *     <LV,T>  -> <LVT>
 *
 *   - reorder tone marks (S is any valid syllable):
 *     <S, M> -> <M, S>
 *
 *   - apply ljmo, vjmo, and tjmo OpenType features to decomposed Jamo sequences.
 *
 * This logic is based on the following documents:
 *   - http://www.microsoft.com/typography/OpenTypeDev/hangul/intro.htm
 *   - http://ktug.org/~nomos/harfbuzz-hangul/hangulshaper.pdf
 */

var HangulShaper = /*#__PURE__*/function (_DefaultShaper) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(HangulShaper, _DefaultShaper);

  function HangulShaper() {
    return _DefaultShaper.apply(this, arguments) || this;
  }

  HangulShaper.planFeatures = function planFeatures(plan) {
    plan.add(['ljmo', 'vjmo', 'tjmo'], false);
  };

  HangulShaper.assignFeatures = function assignFeatures(plan, glyphs) {
    var state = 0;
    var i = 0;

    while (i < glyphs.length) {
      var action = void 0;
      var glyph = glyphs[i];
      var code = glyph.codePoints[0];
      var type = getType(code);
      var _STATE_TABLE$state$ty = STATE_TABLE[state][type];
      action = _STATE_TABLE$state$ty[0];
      state = _STATE_TABLE$state$ty[1];

      switch (action) {
        case DECOMPOSE:
          // Decompose the composed syllable if it is not supported by the font.
          if (!plan.font.hasGlyphForCodePoint(code)) {
            i = decompose(glyphs, i, plan.font);
          }

          break;

        case COMPOSE:
          // Found a decomposed syllable. Try to compose if supported by the font.
          i = compose(glyphs, i, plan.font);
          break;

        case TONE_MARK:
          // Got a valid syllable, followed by a tone mark. Move the tone mark to the beginning of the syllable.
          reorderToneMark(glyphs, i, plan.font);
          break;

        case INVALID:
          // Tone mark has no valid syllable to attach to, so insert a dotted circle
          i = insertDottedCircle(glyphs, i, plan.font);
          break;
      }

      i++;
    }
  };

  return HangulShaper;
}(DefaultShaper);

HangulShaper.zeroMarkWidths = 'NONE';
var HANGUL_BASE = 0xac00;
var HANGUL_END = 0xd7a4;
var HANGUL_COUNT = HANGUL_END - HANGUL_BASE + 1;
var L_BASE = 0x1100; // lead

var V_BASE = 0x1161; // vowel

var T_BASE = 0x11a7; // trail

var L_COUNT = 19;
var V_COUNT = 21;
var T_COUNT = 28;
var L_END = L_BASE + L_COUNT - 1;
var V_END = V_BASE + V_COUNT - 1;
var T_END = T_BASE + T_COUNT - 1;
var DOTTED_CIRCLE = 0x25cc;

var isL = function isL(code) {
  return 0x1100 <= code && code <= 0x115f || 0xa960 <= code && code <= 0xa97c;
};

var isV = function isV(code) {
  return 0x1160 <= code && code <= 0x11a7 || 0xd7b0 <= code && code <= 0xd7c6;
};

var isT = function isT(code) {
  return 0x11a8 <= code && code <= 0x11ff || 0xd7cb <= code && code <= 0xd7fb;
};

var isTone = function isTone(code) {
  return 0x302e <= code && code <= 0x302f;
};

var isLVT = function isLVT(code) {
  return HANGUL_BASE <= code && code <= HANGUL_END;
};

var isLV = function isLV(code) {
  return code - HANGUL_BASE < HANGUL_COUNT && (code - HANGUL_BASE) % T_COUNT === 0;
};

var isCombiningL = function isCombiningL(code) {
  return L_BASE <= code && code <= L_END;
};

var isCombiningV = function isCombiningV(code) {
  return V_BASE <= code && code <= V_END;
};

var isCombiningT = function isCombiningT(code) {
  return 1 <= code && code <= T_END;
}; // Character categories


var X = 0; // Other character

var L = 1; // Leading consonant

var V = 2; // Medial vowel

var T = 3; // Trailing consonant

var LV = 4; // Composed <LV> syllable

var LVT = 5; // Composed <LVT> syllable

var M = 6; // Tone mark
// This function classifies a character using the above categories.

function getType(code) {
  if (isL(code)) {
    return L;
  }

  if (isV(code)) {
    return V;
  }

  if (isT(code)) {
    return T;
  }

  if (isLV(code)) {
    return LV;
  }

  if (isLVT(code)) {
    return LVT;
  }

  if (isTone(code)) {
    return M;
  }

  return X;
} // State machine actions


var NO_ACTION = 0;
var DECOMPOSE = 1;
var COMPOSE = 2;
var TONE_MARK = 4;
var INVALID = 5; // Build a state machine that accepts valid syllables, and applies actions along the way.
// The logic this is implementing is documented at the top of the file.

var STATE_TABLE = [//       X                 L                 V                T                  LV                LVT               M
// State 0: start state
[[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [INVALID, 0]], // State 1: <L>
[[NO_ACTION, 0], [NO_ACTION, 1], [COMPOSE, 2], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [INVALID, 0]], // State 2: <L,V> or <LV>
[[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [COMPOSE, 3], [DECOMPOSE, 2], [DECOMPOSE, 3], [TONE_MARK, 0]], // State 3: <L,V,T> or <LVT>
[[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [TONE_MARK, 0]]];

function getGlyph(font, code, features) {
  return new GlyphInfo(font, font.glyphForCodePoint(code).id, [code], features);
}

function decompose(glyphs, i, font) {
  var glyph = glyphs[i];
  var code = glyph.codePoints[0];
  var s = code - HANGUL_BASE;
  var t = T_BASE + s % T_COUNT;
  s = s / T_COUNT | 0;
  var l = L_BASE + s / V_COUNT | 0;
  var v = V_BASE + s % V_COUNT; // Don't decompose if all of the components are not available

  if (!font.hasGlyphForCodePoint(l) || !font.hasGlyphForCodePoint(v) || t !== T_BASE && !font.hasGlyphForCodePoint(t)) {
    return i;
  } // Replace the current glyph with decomposed L, V, and T glyphs,
  // and apply the proper OpenType features to each component.


  var ljmo = getGlyph(font, l, glyph.features);
  ljmo.features.ljmo = true;
  var vjmo = getGlyph(font, v, glyph.features);
  vjmo.features.vjmo = true;
  var insert = [ljmo, vjmo];

  if (t > T_BASE) {
    var tjmo = getGlyph(font, t, glyph.features);
    tjmo.features.tjmo = true;
    insert.push(tjmo);
  }

  glyphs.splice.apply(glyphs, [i, 1].concat(insert));
  return i + insert.length - 1;
}

function compose(glyphs, i, font) {
  var glyph = glyphs[i];
  var code = glyphs[i].codePoints[0];
  var type = getType(code);
  var prev = glyphs[i - 1].codePoints[0];
  var prevType = getType(prev); // Figure out what type of syllable we're dealing with

  var lv, ljmo, vjmo, tjmo;

  if (prevType === LV && type === T) {
    // <LV,T>
    lv = prev;
    tjmo = glyph;
  } else {
    if (type === V) {
      // <L,V>
      ljmo = glyphs[i - 1];
      vjmo = glyph;
    } else {
      // <L,V,T>
      ljmo = glyphs[i - 2];
      vjmo = glyphs[i - 1];
      tjmo = glyph;
    }

    var l = ljmo.codePoints[0];
    var v = vjmo.codePoints[0]; // Make sure L and V are combining characters

    if (isCombiningL(l) && isCombiningV(v)) {
      lv = HANGUL_BASE + ((l - L_BASE) * V_COUNT + (v - V_BASE)) * T_COUNT;
    }
  }

  var t = tjmo && tjmo.codePoints[0] || T_BASE;

  if (lv != null && (t === T_BASE || isCombiningT(t))) {
    var s = lv + (t - T_BASE); // Replace with a composed glyph if supported by the font,
    // otherwise apply the proper OpenType features to each component.

    if (font.hasGlyphForCodePoint(s)) {
      var del = prevType === V ? 3 : 2;
      glyphs.splice(i - del + 1, del, getGlyph(font, s, glyph.features));
      return i - del + 1;
    }
  } // Didn't compose (either a non-combining component or unsupported by font).


  if (ljmo) {
    ljmo.features.ljmo = true;
  }

  if (vjmo) {
    vjmo.features.vjmo = true;
  }

  if (tjmo) {
    tjmo.features.tjmo = true;
  }

  if (prevType === LV) {
    // Sequence was originally <L,V>, which got combined earlier.
    // Either the T was non-combining, or the LVT glyph wasn't supported.
    // Decompose the glyph again and apply OT features.
    decompose(glyphs, i - 1, font);
    return i + 1;
  }

  return i;
}

function getLength(code) {
  switch (getType(code)) {
    case LV:
    case LVT:
      return 1;

    case V:
      return 2;

    case T:
      return 3;
  }
}

function reorderToneMark(glyphs, i, font) {
  var glyph = glyphs[i];
  var code = glyphs[i].codePoints[0]; // Move tone mark to the beginning of the previous syllable, unless it is zero width

  if (font.glyphForCodePoint(code).advanceWidth === 0) {
    return;
  }

  var prev = glyphs[i - 1].codePoints[0];
  var len = getLength(prev);
  glyphs.splice(i, 1);
  return glyphs.splice(i - len, 0, glyph);
}

function insertDottedCircle(glyphs, i, font) {
  var glyph = glyphs[i];
  var code = glyphs[i].codePoints[0];

  if (font.hasGlyphForCodePoint(DOTTED_CIRCLE)) {
    var dottedCircle = getGlyph(font, DOTTED_CIRCLE, glyph.features); // If the tone mark is zero width, insert the dotted circle before, otherwise after

    var idx = font.glyphForCodePoint(code).advanceWidth === 0 ? i : i + 1;
    glyphs.splice(idx, 0, dottedCircle);
    i++;
  }

  return i;
}

var INITIAL_STATE = 1;
var FAIL_STATE = 0;
/**
 * A StateMachine represents a deterministic finite automaton.
 * It can perform matches over a sequence of values, similar to a regular expression.
 */

var StateMachine = /*#__PURE__*/function () {
  function StateMachine(dfa) {
    this.stateTable = dfa.stateTable;
    this.accepting = dfa.accepting;
    this.tags = dfa.tags;
  }
  /**
   * Returns an iterable object that yields pattern matches over the input sequence.
   * Matches are of the form [startIndex, endIndex, tags].
   */


  var _proto = StateMachine.prototype;

  _proto.match = function match(str) {
    var _ref;

    var self = this;
    return _ref = {}, _ref[Symbol.iterator] = /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee() {
      var state, startRun, lastAccepting, lastState, p, c;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              state = INITIAL_STATE;
              startRun = null;
              lastAccepting = null;
              lastState = null;
              p = 0;

            case 5:
              if (!(p < str.length)) {
                _context.next = 21;
                break;
              }

              c = str[p];
              lastState = state;
              state = self.stateTable[state][c];

              if (!(state === FAIL_STATE)) {
                _context.next = 15;
                break;
              }

              if (!(startRun != null && lastAccepting != null && lastAccepting >= startRun)) {
                _context.next = 13;
                break;
              }

              _context.next = 13;
              return [startRun, lastAccepting, self.tags[lastState]];

            case 13:
              // reset the state as if we started over from the initial state
              state = self.stateTable[INITIAL_STATE][c];
              startRun = null;

            case 15:
              // start a run if not in the failure state
              if (state !== FAIL_STATE && startRun == null) {
                startRun = p;
              } // if accepting, mark the potential match end


              if (self.accepting[state]) {
                lastAccepting = p;
              } // reset the state to the initial state if we get into the failure state


              if (state === FAIL_STATE) {
                state = INITIAL_STATE;
              }

            case 18:
              p++;
              _context.next = 5;
              break;

            case 21:
              if (!(startRun != null && lastAccepting != null && lastAccepting >= startRun)) {
                _context.next = 24;
                break;
              }

              _context.next = 24;
              return [startRun, lastAccepting, self.tags[state]];

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }), _ref;
  }
  /**
   * For each match over the input sequence, action functions matching
   * the tag definitions in the input pattern are called with the startIndex,
   * endIndex, and sub-match sequence.
   */
  ;

  _proto.apply = function apply(str, actions) {
    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.match(str)), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          start = _step$value[0],
          end = _step$value[1],
          tags = _step$value[2];

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(tags), _step2; !(_step2 = _iterator2()).done;) {
        var tag = _step2.value;

        if (typeof actions[tag] === 'function') {
          actions[tag](start, end, str.slice(start, end + 1));
        }
      }
    }
  };

  return StateMachine;
}();

var dfa = StateMachine;

var stateTable$1 = [
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		0,
		10,
		11,
		11,
		12,
		13,
		14,
		15,
		16,
		17
	],
	[
		0,
		0,
		0,
		18,
		19,
		20,
		21,
		22,
		23,
		0,
		24,
		0,
		0,
		25,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		28,
		29,
		30,
		31,
		32,
		33,
		0,
		34,
		0,
		0,
		35,
		36,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		38,
		5,
		7,
		7,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		13,
		0,
		0,
		16,
		0
	],
	[
		0,
		39,
		0,
		0,
		0,
		40,
		41,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		39,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		43,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		12,
		43,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		43,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		43,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		45,
		46,
		47,
		48,
		49,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		50,
		0,
		0,
		51,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		52,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		53,
		54,
		55,
		56,
		57,
		58,
		0,
		59,
		0,
		0,
		60,
		61,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		4,
		5,
		7,
		7,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		13,
		0,
		0,
		16,
		0
	],
	[
		0,
		63,
		64,
		0,
		0,
		40,
		41,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		63,
		0,
		0
	],
	[
		0,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		0,
		10,
		11,
		11,
		12,
		13,
		0,
		2,
		16,
		0
	],
	[
		0,
		0,
		0,
		18,
		65,
		20,
		21,
		22,
		23,
		0,
		24,
		0,
		0,
		25,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		69,
		0,
		70,
		70,
		0,
		71,
		0,
		72,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		73,
		19,
		74,
		74,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		75,
		0,
		0,
		0,
		76,
		77,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		75,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		79,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		25,
		79,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		18,
		19,
		20,
		74,
		22,
		23,
		0,
		24,
		0,
		0,
		25,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		81,
		82,
		83,
		84,
		85,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		86,
		0,
		0,
		87,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		88,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		18,
		19,
		74,
		74,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		89,
		90,
		0,
		0,
		76,
		77,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		89,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		94,
		29,
		95,
		31,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		36,
		0,
		0,
		37,
		0
	],
	[
		0,
		96,
		0,
		0,
		0,
		97,
		98,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		96,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		100,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		35,
		100,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		100,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		100,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		102,
		103,
		104,
		105,
		106,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		107,
		0,
		0,
		108,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		109,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		28,
		29,
		95,
		31,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		36,
		0,
		0,
		37,
		0
	],
	[
		0,
		110,
		111,
		0,
		0,
		97,
		98,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		110,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		5,
		7,
		7,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		13,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		115,
		116,
		117,
		118,
		8,
		9,
		0,
		10,
		0,
		0,
		119,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		39,
		0,
		122,
		0,
		123,
		123,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		39,
		0,
		0
	],
	[
		0,
		124,
		64,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		124,
		0,
		0
	],
	[
		0,
		39,
		0,
		0,
		0,
		121,
		125,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		39,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		126,
		126,
		8,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		46,
		47,
		48,
		49,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		47,
		47,
		49,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		127,
		127,
		49,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		128,
		127,
		127,
		49,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		129,
		130,
		131,
		132,
		133,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		50,
		0,
		0,
		0,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		134,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		135,
		54,
		56,
		56,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		61,
		0,
		0,
		62,
		0
	],
	[
		0,
		136,
		0,
		0,
		0,
		137,
		138,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		136,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		140,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		60,
		140,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		140,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		140,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		142,
		143,
		144,
		145,
		146,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		147,
		0,
		0,
		148,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		149,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		53,
		54,
		56,
		56,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		61,
		0,
		0,
		62,
		0
	],
	[
		0,
		150,
		151,
		0,
		0,
		137,
		138,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		150,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		155,
		116,
		156,
		157,
		8,
		9,
		0,
		10,
		0,
		0,
		158,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		75,
		3,
		4,
		5,
		159,
		160,
		8,
		161,
		0,
		162,
		0,
		11,
		12,
		163,
		0,
		75,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		40,
		164,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		165,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		165,
		0,
		0,
		0,
		0
	],
	[
		0,
		124,
		64,
		0,
		0,
		40,
		164,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		124,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		70,
		70,
		0,
		71,
		0,
		72,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		71,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		166,
		0,
		0,
		167,
		0,
		72,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		168,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		19,
		74,
		74,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		26,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		79,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		79,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		169,
		170,
		171,
		172,
		22,
		23,
		0,
		24,
		0,
		0,
		173,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		75,
		0,
		176,
		0,
		177,
		177,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		75,
		0,
		0
	],
	[
		0,
		178,
		90,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		178,
		0,
		0
	],
	[
		0,
		75,
		0,
		0,
		0,
		175,
		179,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		75,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		180,
		180,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		82,
		83,
		84,
		85,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		83,
		83,
		85,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		181,
		181,
		85,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		182,
		181,
		181,
		85,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		183,
		184,
		185,
		186,
		187,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		86,
		0,
		0,
		0,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		188,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		189,
		170,
		190,
		191,
		22,
		23,
		0,
		24,
		0,
		0,
		192,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		76,
		193,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		194,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		194,
		0,
		0,
		0,
		0
	],
	[
		0,
		178,
		90,
		0,
		0,
		76,
		193,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		178,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		29,
		95,
		31,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		36,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		100,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		100,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		195,
		196,
		197,
		198,
		32,
		33,
		0,
		34,
		0,
		0,
		199,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		96,
		0,
		202,
		0,
		203,
		203,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		96,
		0,
		0
	],
	[
		0,
		204,
		111,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		204,
		0,
		0
	],
	[
		0,
		96,
		0,
		0,
		0,
		201,
		205,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		96,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		206,
		206,
		32,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		103,
		104,
		105,
		106,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		104,
		104,
		106,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		207,
		207,
		106,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		208,
		207,
		207,
		106,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		209,
		210,
		211,
		212,
		213,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		107,
		0,
		0,
		0,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		214,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		215,
		196,
		216,
		217,
		32,
		33,
		0,
		34,
		0,
		0,
		218,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		97,
		219,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		220,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		220,
		0,
		0,
		0,
		0
	],
	[
		0,
		204,
		111,
		0,
		0,
		97,
		219,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		204,
		0,
		0
	],
	[
		0,
		0,
		0,
		221,
		116,
		222,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		223,
		0,
		0,
		0,
		40,
		224,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		223,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		119,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		115,
		116,
		117,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		119,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		115,
		116,
		222,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		226,
		64,
		0,
		0,
		40,
		224,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		226,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		39,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		39,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		227,
		0,
		228,
		229,
		0,
		9,
		0,
		10,
		0,
		0,
		230,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		39,
		0,
		122,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		39,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		8,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		231,
		231,
		49,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		232,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		130,
		131,
		132,
		133,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		131,
		131,
		133,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		233,
		233,
		133,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		234,
		233,
		233,
		133,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		235,
		236,
		237,
		238,
		239,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		54,
		56,
		56,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		61,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		240,
		241,
		242,
		243,
		57,
		58,
		0,
		59,
		0,
		0,
		244,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		136,
		0,
		247,
		0,
		248,
		248,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		136,
		0,
		0
	],
	[
		0,
		249,
		151,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		249,
		0,
		0
	],
	[
		0,
		136,
		0,
		0,
		0,
		246,
		250,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		136,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		251,
		251,
		57,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		143,
		144,
		145,
		146,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		144,
		144,
		146,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		252,
		252,
		146,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		253,
		252,
		252,
		146,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		254,
		255,
		256,
		257,
		258,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		147,
		0,
		0,
		0,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		259,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		260,
		241,
		261,
		262,
		57,
		58,
		0,
		59,
		0,
		0,
		263,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		137,
		264,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		265,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		265,
		0,
		0,
		0,
		0
	],
	[
		0,
		249,
		151,
		0,
		0,
		137,
		264,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		249,
		0,
		0
	],
	[
		0,
		0,
		0,
		221,
		116,
		222,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		158,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		155,
		116,
		156,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		158,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		155,
		116,
		222,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		43,
		266,
		266,
		8,
		161,
		0,
		24,
		0,
		0,
		12,
		267,
		0,
		0,
		0,
		0
	],
	[
		0,
		75,
		0,
		176,
		43,
		268,
		268,
		269,
		161,
		0,
		24,
		0,
		0,
		0,
		267,
		0,
		75,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		270,
		0,
		0,
		271,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		272,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		273,
		274,
		0,
		0,
		40,
		41,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		273,
		0,
		0
	],
	[
		0,
		0,
		0,
		40,
		0,
		123,
		123,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		121,
		275,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		72,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		166,
		0,
		0,
		0,
		0,
		72,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		276,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		277,
		170,
		278,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		279,
		0,
		0,
		0,
		76,
		280,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		279,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		281,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		173,
		281,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		169,
		170,
		171,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		173,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		169,
		170,
		278,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		282,
		90,
		0,
		0,
		76,
		280,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		282,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		75,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		75,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		283,
		0,
		284,
		285,
		0,
		23,
		0,
		24,
		0,
		0,
		286,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		75,
		0,
		176,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		75,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		287,
		287,
		85,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		288,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		184,
		185,
		186,
		187,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		185,
		185,
		187,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		289,
		289,
		187,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		290,
		289,
		289,
		187,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		291,
		292,
		293,
		294,
		295,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		277,
		170,
		278,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		281,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		192,
		281,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		189,
		170,
		190,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		192,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		189,
		170,
		278,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		76,
		0,
		177,
		177,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		175,
		296,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		297,
		196,
		298,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		299,
		0,
		0,
		0,
		97,
		300,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		299,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		301,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		199,
		301,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		195,
		196,
		197,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		199,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		195,
		196,
		298,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		302,
		111,
		0,
		0,
		97,
		300,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		302,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		96,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		96,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		303,
		0,
		304,
		305,
		0,
		33,
		0,
		34,
		0,
		0,
		306,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		96,
		0,
		202,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		96,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		32,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		307,
		307,
		106,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		308,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		210,
		211,
		212,
		213,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		211,
		211,
		213,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		309,
		309,
		213,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		310,
		309,
		309,
		213,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		311,
		312,
		313,
		314,
		315,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		297,
		196,
		298,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		301,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		218,
		301,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		215,
		196,
		216,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		218,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		215,
		196,
		298,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		97,
		0,
		203,
		203,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		201,
		316,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		116,
		222,
		222,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		317,
		318,
		319,
		320,
		8,
		9,
		0,
		10,
		0,
		0,
		321,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		223,
		0,
		323,
		0,
		123,
		123,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		223,
		0,
		0
	],
	[
		0,
		223,
		0,
		0,
		0,
		121,
		324,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		223,
		0,
		0
	],
	[
		0,
		0,
		0,
		325,
		318,
		326,
		327,
		8,
		9,
		0,
		10,
		0,
		0,
		328,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		64,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		9,
		0,
		0,
		0,
		0,
		230,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		227,
		0,
		228,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		230,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		227,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		49,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		46,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		329,
		329,
		133,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		330,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		236,
		237,
		238,
		239,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		237,
		237,
		239,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		331,
		331,
		239,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		332,
		331,
		331,
		239,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		333,
		40,
		121,
		334,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		335,
		241,
		336,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		337,
		0,
		0,
		0,
		137,
		338,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		337,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		339,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		244,
		339,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		240,
		241,
		242,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		244,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		240,
		241,
		336,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		340,
		151,
		0,
		0,
		137,
		338,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		340,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		136,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		136,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		341,
		0,
		342,
		343,
		0,
		58,
		0,
		59,
		0,
		0,
		344,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		136,
		0,
		247,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		136,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		57,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		345,
		345,
		146,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		346,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		255,
		256,
		257,
		258,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		256,
		256,
		258,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		347,
		347,
		258,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		348,
		347,
		347,
		258,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		349,
		350,
		351,
		352,
		353,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		335,
		241,
		336,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		339,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		263,
		339,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		260,
		241,
		261,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		263,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		260,
		241,
		336,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		137,
		0,
		248,
		248,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		246,
		354,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		126,
		126,
		8,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		355,
		90,
		0,
		0,
		121,
		125,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		355,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		356,
		356,
		269,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		357,
		358,
		359,
		360,
		361,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		270,
		0,
		0,
		0,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		363,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		364,
		116,
		365,
		366,
		8,
		161,
		0,
		162,
		0,
		0,
		367,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		368,
		368,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		40,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		170,
		278,
		278,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		174,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		281,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		281,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		369,
		370,
		371,
		372,
		22,
		23,
		0,
		24,
		0,
		0,
		373,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		279,
		0,
		375,
		0,
		177,
		177,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		279,
		0,
		0
	],
	[
		0,
		279,
		0,
		0,
		0,
		175,
		376,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		279,
		0,
		0
	],
	[
		0,
		0,
		0,
		377,
		370,
		378,
		379,
		22,
		23,
		0,
		24,
		0,
		0,
		380,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		90,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		286,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		283,
		0,
		284,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		286,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		283,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		85,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		82,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		381,
		381,
		187,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		382,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		292,
		293,
		294,
		295,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		293,
		293,
		295,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		383,
		383,
		295,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		384,
		383,
		383,
		295,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		385,
		76,
		175,
		386,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		76,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		196,
		298,
		298,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		200,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		301,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		301,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		387,
		388,
		389,
		390,
		32,
		33,
		0,
		34,
		0,
		0,
		391,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		299,
		0,
		393,
		0,
		203,
		203,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		299,
		0,
		0
	],
	[
		0,
		299,
		0,
		0,
		0,
		201,
		394,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		299,
		0,
		0
	],
	[
		0,
		0,
		0,
		395,
		388,
		396,
		397,
		32,
		33,
		0,
		34,
		0,
		0,
		398,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		111,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		33,
		0,
		0,
		0,
		0,
		306,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		303,
		0,
		304,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		306,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		303,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		106,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		103,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		399,
		399,
		213,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		400,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		312,
		313,
		314,
		315,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		313,
		313,
		315,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		401,
		401,
		315,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		402,
		401,
		401,
		315,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		403,
		97,
		201,
		404,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		97,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		405,
		318,
		406,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		407,
		0,
		0,
		0,
		40,
		408,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		407,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		409,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		321,
		409,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		317,
		318,
		319,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		321,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		317,
		318,
		406,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		410,
		64,
		0,
		0,
		40,
		408,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		410,
		0,
		0
	],
	[
		0,
		223,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		223,
		0,
		0
	],
	[
		0,
		223,
		0,
		323,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		223,
		0,
		0
	],
	[
		0,
		0,
		0,
		405,
		318,
		406,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		409,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		328,
		409,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		325,
		318,
		326,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		328,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		325,
		318,
		406,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		133,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		130,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		411,
		411,
		239,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		412,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		40,
		121,
		334,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		413,
		0,
		0,
		0,
		9,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		241,
		336,
		336,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		245,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		339,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		339,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		414,
		415,
		416,
		417,
		57,
		58,
		0,
		59,
		0,
		0,
		418,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		337,
		0,
		420,
		0,
		248,
		248,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		337,
		0,
		0
	],
	[
		0,
		337,
		0,
		0,
		0,
		246,
		421,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		337,
		0,
		0
	],
	[
		0,
		0,
		0,
		422,
		415,
		423,
		424,
		57,
		58,
		0,
		59,
		0,
		0,
		425,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		151,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		58,
		0,
		0,
		0,
		0,
		344,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		341,
		0,
		342,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		344,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		341,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		146,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		143,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		426,
		426,
		258,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		427,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		350,
		351,
		352,
		353,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		351,
		351,
		353,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		428,
		428,
		353,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		429,
		428,
		428,
		353,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		430,
		137,
		246,
		431,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		137,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		432,
		116,
		433,
		434,
		8,
		161,
		0,
		162,
		0,
		0,
		435,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		180,
		180,
		269,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		358,
		359,
		360,
		361,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		359,
		359,
		361,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		436,
		436,
		361,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		437,
		436,
		436,
		361,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		438,
		439,
		440,
		441,
		442,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		443,
		274,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		443,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		444,
		116,
		445,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		161,
		0,
		0,
		0,
		0,
		367,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		364,
		116,
		365,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		367,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		364,
		116,
		445,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		446,
		370,
		447,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		448,
		0,
		0,
		0,
		76,
		449,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		448,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		450,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		373,
		450,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		369,
		370,
		371,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		373,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		369,
		370,
		447,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		451,
		90,
		0,
		0,
		76,
		449,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		451,
		0,
		0
	],
	[
		0,
		279,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		279,
		0,
		0
	],
	[
		0,
		279,
		0,
		375,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		279,
		0,
		0
	],
	[
		0,
		0,
		0,
		446,
		370,
		447,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		450,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		380,
		450,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		377,
		370,
		378,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		380,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		377,
		370,
		447,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		187,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		184,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		452,
		452,
		295,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		453,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		76,
		175,
		386,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		454,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		455,
		388,
		456,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		457,
		0,
		0,
		0,
		97,
		458,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		457,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		459,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		391,
		459,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		387,
		388,
		389,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		391,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		387,
		388,
		456,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		460,
		111,
		0,
		0,
		97,
		458,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		460,
		0,
		0
	],
	[
		0,
		299,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		299,
		0,
		0
	],
	[
		0,
		299,
		0,
		393,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		299,
		0,
		0
	],
	[
		0,
		0,
		0,
		455,
		388,
		456,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		459,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		398,
		459,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		395,
		388,
		396,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		398,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		395,
		388,
		456,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		213,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		210,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		461,
		461,
		315,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		462,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		97,
		201,
		404,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		463,
		0,
		0,
		0,
		33,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		318,
		406,
		406,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		322,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		409,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		409,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		464,
		465,
		466,
		467,
		8,
		9,
		0,
		10,
		0,
		0,
		468,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		407,
		0,
		470,
		0,
		123,
		123,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		407,
		0,
		0
	],
	[
		0,
		407,
		0,
		0,
		0,
		121,
		471,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		407,
		0,
		0
	],
	[
		0,
		0,
		0,
		472,
		465,
		473,
		474,
		8,
		9,
		0,
		10,
		0,
		0,
		475,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		239,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		236,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		476,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		477,
		415,
		478,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		479,
		0,
		0,
		0,
		137,
		480,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		479,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		481,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		418,
		481,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		414,
		415,
		416,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		418,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		414,
		415,
		478,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		482,
		151,
		0,
		0,
		137,
		480,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		482,
		0,
		0
	],
	[
		0,
		337,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		337,
		0,
		0
	],
	[
		0,
		337,
		0,
		420,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		337,
		0,
		0
	],
	[
		0,
		0,
		0,
		477,
		415,
		478,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		481,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		425,
		481,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		422,
		415,
		423,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		425,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		422,
		415,
		478,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		258,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		255,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		483,
		483,
		353,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		484,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		137,
		246,
		431,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		485,
		0,
		0,
		0,
		58,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		444,
		116,
		445,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		161,
		0,
		0,
		0,
		0,
		435,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		432,
		116,
		433,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		435,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		432,
		116,
		445,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		486,
		486,
		361,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		487,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		439,
		440,
		441,
		442,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		440,
		440,
		442,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		488,
		488,
		442,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		489,
		488,
		488,
		442,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		490,
		491,
		492,
		493,
		494,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		495,
		0,
		496,
		497,
		0,
		161,
		0,
		162,
		0,
		0,
		498,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		116,
		445,
		445,
		8,
		161,
		0,
		162,
		0,
		0,
		0,
		120,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		225,
		44,
		44,
		8,
		161,
		0,
		0,
		0,
		0,
		0,
		225,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		370,
		447,
		447,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		374,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		450,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		450,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		499,
		500,
		501,
		502,
		22,
		23,
		0,
		24,
		0,
		0,
		503,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		448,
		0,
		505,
		0,
		177,
		177,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		448,
		0,
		0
	],
	[
		0,
		448,
		0,
		0,
		0,
		175,
		506,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		448,
		0,
		0
	],
	[
		0,
		0,
		0,
		507,
		500,
		508,
		509,
		22,
		23,
		0,
		24,
		0,
		0,
		510,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		295,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		292,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		511,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		388,
		456,
		456,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		392,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		459,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		459,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		512,
		513,
		514,
		515,
		32,
		33,
		0,
		34,
		0,
		0,
		516,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		457,
		0,
		518,
		0,
		203,
		203,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		457,
		0,
		0
	],
	[
		0,
		457,
		0,
		0,
		0,
		201,
		519,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		457,
		0,
		0
	],
	[
		0,
		0,
		0,
		520,
		513,
		521,
		522,
		32,
		33,
		0,
		34,
		0,
		0,
		523,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		315,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		312,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		524,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		525,
		465,
		526,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		527,
		0,
		0,
		0,
		40,
		528,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		527,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		529,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		468,
		529,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		464,
		465,
		466,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		468,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		464,
		465,
		526,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		530,
		64,
		0,
		0,
		40,
		528,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		530,
		0,
		0
	],
	[
		0,
		407,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		407,
		0,
		0
	],
	[
		0,
		407,
		0,
		470,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		407,
		0,
		0
	],
	[
		0,
		0,
		0,
		525,
		465,
		526,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		529,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		475,
		529,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		472,
		465,
		473,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		475,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		472,
		465,
		526,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		40,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		415,
		478,
		478,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		419,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		481,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		481,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		531,
		532,
		533,
		534,
		57,
		58,
		0,
		59,
		0,
		0,
		535,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		479,
		0,
		537,
		0,
		248,
		248,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		479,
		0,
		0
	],
	[
		0,
		479,
		0,
		0,
		0,
		246,
		538,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		479,
		0,
		0
	],
	[
		0,
		0,
		0,
		539,
		532,
		540,
		541,
		57,
		58,
		0,
		59,
		0,
		0,
		542,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		353,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		350,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		543,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		361,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		358,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		544,
		544,
		442,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		545,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		491,
		492,
		493,
		494,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		492,
		492,
		494,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		546,
		546,
		494,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		547,
		546,
		546,
		494,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		548,
		549,
		368,
		550,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		274,
		0,
		368,
		368,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		161,
		0,
		0,
		0,
		0,
		498,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		495,
		0,
		496,
		368,
		0,
		161,
		0,
		162,
		0,
		0,
		498,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		495,
		0,
		368,
		368,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		551,
		500,
		552,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		553,
		0,
		0,
		0,
		76,
		554,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		553,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		555,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		503,
		555,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		499,
		500,
		501,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		503,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		499,
		500,
		552,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		556,
		90,
		0,
		0,
		76,
		554,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		556,
		0,
		0
	],
	[
		0,
		448,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		448,
		0,
		0
	],
	[
		0,
		448,
		0,
		505,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		448,
		0,
		0
	],
	[
		0,
		0,
		0,
		551,
		500,
		552,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		555,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		510,
		555,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		507,
		500,
		508,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		510,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		507,
		500,
		552,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		76,
		0,
		0
	],
	[
		0,
		0,
		0,
		557,
		513,
		558,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		559,
		0,
		0,
		0,
		97,
		560,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		559,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		561,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		516,
		561,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		512,
		513,
		514,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		516,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		512,
		513,
		558,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		562,
		111,
		0,
		0,
		97,
		560,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		562,
		0,
		0
	],
	[
		0,
		457,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		457,
		0,
		0
	],
	[
		0,
		457,
		0,
		518,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		457,
		0,
		0
	],
	[
		0,
		0,
		0,
		557,
		513,
		558,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		561,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		523,
		561,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		520,
		513,
		521,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		523,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		520,
		513,
		558,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		97,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		465,
		526,
		526,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		469,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		529,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		0,
		529,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		563,
		66,
		564,
		565,
		8,
		9,
		0,
		10,
		0,
		0,
		566,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		527,
		0,
		567,
		0,
		123,
		123,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		527,
		0,
		0
	],
	[
		0,
		527,
		0,
		0,
		0,
		121,
		568,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		527,
		0,
		0
	],
	[
		0,
		0,
		0,
		569,
		66,
		570,
		571,
		8,
		9,
		0,
		10,
		0,
		0,
		572,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		573,
		532,
		574,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		575,
		0,
		0,
		0,
		137,
		576,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		575,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		577,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		535,
		577,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		531,
		532,
		533,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		535,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		531,
		532,
		574,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		578,
		151,
		0,
		0,
		137,
		576,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		578,
		0,
		0
	],
	[
		0,
		479,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		479,
		0,
		0
	],
	[
		0,
		479,
		0,
		537,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		479,
		0,
		0
	],
	[
		0,
		0,
		0,
		573,
		532,
		574,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		577,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		542,
		577,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		539,
		532,
		540,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		542,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		539,
		532,
		574,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		137,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		442,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		439,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		579,
		579,
		494,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		580,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		549,
		368,
		550,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		368,
		368,
		0,
		161,
		0,
		162,
		0,
		0,
		0,
		362,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		581,
		0,
		0,
		0,
		161,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		500,
		552,
		552,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		504,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		555,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		0,
		555,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		582,
		91,
		583,
		584,
		22,
		23,
		0,
		24,
		0,
		0,
		585,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		553,
		0,
		586,
		0,
		177,
		177,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		553,
		0,
		0
	],
	[
		0,
		553,
		0,
		0,
		0,
		175,
		587,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		553,
		0,
		0
	],
	[
		0,
		0,
		0,
		588,
		91,
		589,
		590,
		22,
		23,
		0,
		24,
		0,
		0,
		591,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		513,
		558,
		558,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		517,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		561,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		0,
		561,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		592,
		112,
		593,
		594,
		32,
		33,
		0,
		34,
		0,
		0,
		595,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		559,
		0,
		596,
		0,
		203,
		203,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		559,
		0,
		0
	],
	[
		0,
		559,
		0,
		0,
		0,
		201,
		597,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		559,
		0,
		0
	],
	[
		0,
		0,
		0,
		598,
		112,
		599,
		600,
		32,
		33,
		0,
		34,
		0,
		0,
		601,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		602,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		165,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		566,
		165,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		563,
		66,
		564,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		566,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		563,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		527,
		0,
		0,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		527,
		0,
		0
	],
	[
		0,
		527,
		0,
		567,
		0,
		121,
		121,
		0,
		9,
		0,
		10,
		0,
		0,
		0,
		42,
		0,
		527,
		0,
		0
	],
	[
		0,
		0,
		0,
		602,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		165,
		44,
		44,
		8,
		9,
		0,
		0,
		0,
		0,
		572,
		165,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		569,
		66,
		570,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		572,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		569,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		0,
		532,
		574,
		574,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		536,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		577,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		0,
		577,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		603,
		152,
		604,
		605,
		57,
		58,
		0,
		59,
		0,
		0,
		606,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		575,
		0,
		607,
		0,
		248,
		248,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		575,
		0,
		0
	],
	[
		0,
		575,
		0,
		0,
		0,
		246,
		608,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		575,
		0,
		0
	],
	[
		0,
		0,
		0,
		609,
		152,
		610,
		611,
		57,
		58,
		0,
		59,
		0,
		0,
		612,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		494,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		491,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		613,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		614,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		194,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		585,
		194,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		582,
		91,
		583,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		585,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		582,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		553,
		0,
		0,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		553,
		0,
		0
	],
	[
		0,
		553,
		0,
		586,
		0,
		175,
		175,
		0,
		23,
		0,
		24,
		0,
		0,
		0,
		78,
		0,
		553,
		0,
		0
	],
	[
		0,
		0,
		0,
		614,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		194,
		80,
		80,
		22,
		23,
		0,
		0,
		0,
		0,
		591,
		194,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		588,
		91,
		589,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		591,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		588,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		615,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		220,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		595,
		220,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		592,
		112,
		593,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		595,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		592,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		559,
		0,
		0,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		559,
		0,
		0
	],
	[
		0,
		559,
		0,
		596,
		0,
		201,
		201,
		0,
		33,
		0,
		34,
		0,
		0,
		0,
		99,
		0,
		559,
		0,
		0
	],
	[
		0,
		0,
		0,
		615,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		220,
		101,
		101,
		32,
		33,
		0,
		0,
		0,
		0,
		601,
		220,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		598,
		112,
		599,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		601,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		598,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		66,
		67,
		67,
		8,
		9,
		0,
		10,
		0,
		0,
		0,
		68,
		0,
		0,
		16,
		0
	],
	[
		0,
		0,
		0,
		616,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		265,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		606,
		265,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		603,
		152,
		604,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		606,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		603,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		575,
		0,
		0,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		575,
		0,
		0
	],
	[
		0,
		575,
		0,
		607,
		0,
		246,
		246,
		0,
		58,
		0,
		59,
		0,
		0,
		0,
		139,
		0,
		575,
		0,
		0
	],
	[
		0,
		0,
		0,
		616,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		265,
		141,
		141,
		57,
		58,
		0,
		0,
		0,
		0,
		612,
		265,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		609,
		152,
		610,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		612,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		609,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		62,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		549,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		91,
		92,
		92,
		22,
		23,
		0,
		24,
		0,
		0,
		0,
		93,
		0,
		0,
		27,
		0
	],
	[
		0,
		0,
		0,
		0,
		112,
		113,
		113,
		32,
		33,
		0,
		34,
		0,
		0,
		0,
		114,
		0,
		0,
		37,
		0
	],
	[
		0,
		0,
		0,
		0,
		152,
		153,
		153,
		57,
		58,
		0,
		59,
		0,
		0,
		0,
		154,
		0,
		0,
		62,
		0
	]
];
var accepting$1 = [
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	false,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	false,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	false,
	false,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	false,
	true,
	true,
	true
];
var tags$1 = [
	[
	],
	[
		"broken_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"symbol_cluster"
	],
	[
	],
	[
		"symbol_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
		"consonant_syllable",
		"broken_cluster"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
	],
	[
		"vowel_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"broken_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"standalone_cluster"
	],
	[
		"standalone_cluster"
	],
	[
	],
	[
		"consonant_syllable"
	],
	[
		"vowel_syllable"
	],
	[
		"standalone_cluster"
	]
];
var indicMachine = {
	stateTable: stateTable$1,
	accepting: accepting$1,
	tags: tags$1
};

var categories$1 = [
	"O",
	"IND",
	"S",
	"GB",
	"B",
	"FM",
	"CGJ",
	"VMAbv",
	"VMPst",
	"VAbv",
	"VPst",
	"CMBlw",
	"VPre",
	"VBlw",
	"H",
	"VMBlw",
	"CMAbv",
	"MBlw",
	"CS",
	"R",
	"SUB",
	"MPst",
	"MPre",
	"FAbv",
	"FPst",
	"FBlw",
	"null",
	"SMAbv",
	"SMBlw",
	"VMPre",
	"ZWNJ",
	"ZWJ",
	"WJ",
	"M",
	"VS",
	"N",
	"HN",
	"MAbv"
];
var decompositions$2 = {
	"2507": [
		2503,
		2494
	],
	"2508": [
		2503,
		2519
	],
	"2888": [
		2887,
		2902
	],
	"2891": [
		2887,
		2878
	],
	"2892": [
		2887,
		2903
	],
	"3018": [
		3014,
		3006
	],
	"3019": [
		3015,
		3006
	],
	"3020": [
		3014,
		3031
	],
	"3144": [
		3142,
		3158
	],
	"3264": [
		3263,
		3285
	],
	"3271": [
		3270,
		3285
	],
	"3272": [
		3270,
		3286
	],
	"3274": [
		3270,
		3266
	],
	"3275": [
		3270,
		3266,
		3285
	],
	"3402": [
		3398,
		3390
	],
	"3403": [
		3399,
		3390
	],
	"3404": [
		3398,
		3415
	],
	"3546": [
		3545,
		3530
	],
	"3548": [
		3545,
		3535
	],
	"3549": [
		3545,
		3535,
		3530
	],
	"3550": [
		3545,
		3551
	],
	"3635": [
		3661,
		3634
	],
	"3763": [
		3789,
		3762
	],
	"3955": [
		3953,
		3954
	],
	"3957": [
		3953,
		3956
	],
	"3958": [
		4018,
		3968
	],
	"3959": [
		4018,
		3953,
		3968
	],
	"3960": [
		4019,
		3968
	],
	"3961": [
		4019,
		3953,
		3968
	],
	"3969": [
		3953,
		3968
	],
	"6971": [
		6970,
		6965
	],
	"6973": [
		6972,
		6965
	],
	"6976": [
		6974,
		6965
	],
	"6977": [
		6975,
		6965
	],
	"6979": [
		6978,
		6965
	],
	"69934": [
		69937,
		69927
	],
	"69935": [
		69938,
		69927
	],
	"70475": [
		70471,
		70462
	],
	"70476": [
		70471,
		70487
	],
	"70843": [
		70841,
		70842
	],
	"70844": [
		70841,
		70832
	],
	"70846": [
		70841,
		70845
	],
	"71098": [
		71096,
		71087
	],
	"71099": [
		71097,
		71087
	]
};
var stateTable = [
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		2,
		2,
		3,
		4,
		4,
		5,
		0,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		0,
		17,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		2,
		0,
		0,
		24,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		26,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		27,
		28,
		0,
		0,
		0,
		0,
		0,
		27,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		39,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		0,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		0,
		0,
		12,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		0,
		9,
		0,
		0,
		0,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		0,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		0,
		11,
		12,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		0,
		9,
		0,
		0,
		12,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		18,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		0,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		0,
		11,
		12,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		11,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		4,
		4,
		5,
		0,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		48,
		11,
		12,
		13,
		14,
		48,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		49,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		0,
		11,
		12,
		0,
		14,
		0,
		16,
		0,
		0,
		0,
		11,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		21,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		21,
		22,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		14,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		50,
		0,
		51,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		0,
		11,
		12,
		0,
		14,
		0,
		16,
		0,
		0,
		0,
		11,
		0,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		27,
		28,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		28,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		0,
		0,
		0,
		0,
		0,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		0,
		31,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		0,
		0,
		36,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		0,
		33,
		0,
		0,
		0,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		0,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		0,
		35,
		36,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		0,
		33,
		0,
		0,
		36,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		41,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		0,
		31,
		0,
		0,
		0,
		0,
		0,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		0,
		35,
		36,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		35,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		52,
		35,
		36,
		37,
		38,
		52,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		53,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		0,
		35,
		36,
		0,
		38,
		0,
		40,
		0,
		0,
		0,
		35,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		44,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		44,
		45,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		0,
		0,
		0,
		0,
		0,
		0,
		38,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		0,
		35,
		36,
		0,
		38,
		0,
		40,
		0,
		0,
		0,
		35,
		0,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		48,
		11,
		12,
		13,
		14,
		0,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		5,
		0,
		6,
		7,
		8,
		9,
		48,
		11,
		12,
		13,
		14,
		48,
		16,
		0,
		0,
		18,
		11,
		19,
		20,
		21,
		22,
		0,
		0,
		0,
		23,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		25
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		51,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		54,
		0,
		0
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		52,
		35,
		36,
		37,
		38,
		0,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		29,
		0,
		30,
		31,
		32,
		33,
		52,
		35,
		36,
		37,
		38,
		52,
		40,
		0,
		0,
		41,
		35,
		42,
		43,
		44,
		45,
		0,
		0,
		0,
		46,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		47
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		50,
		0,
		51,
		0
	]
];
var accepting = [
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true
];
var tags = [
	[
	],
	[
		"broken_cluster"
	],
	[
		"independent_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"numeral_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"independent_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"symbol_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"virama_terminated_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"broken_cluster"
	],
	[
		"numeral_cluster"
	],
	[
		"number_joiner_terminated_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"standard_cluster"
	],
	[
		"numeral_cluster"
	]
];
var useData = {
	categories: categories$1,
	decompositions: decompositions$2,
	stateTable: stateTable,
	accepting: accepting,
	tags: tags
};

// Updated: 417af0c79c5664271a07a783574ec7fac7ebad0c
// Cateories used in the OpenType spec:
// https://www.microsoft.com/typography/otfntdev/devanot/shaping.aspx
var CATEGORIES = {
  X: 1 << 0,
  C: 1 << 1,
  V: 1 << 2,
  N: 1 << 3,
  H: 1 << 4,
  ZWNJ: 1 << 5,
  ZWJ: 1 << 6,
  M: 1 << 7,
  SM: 1 << 8,
  VD: 1 << 9,
  A: 1 << 10,
  Placeholder: 1 << 11,
  Dotted_Circle: 1 << 12,
  RS: 1 << 13,
  // Register Shifter, used in Khmer OT spec.
  Coeng: 1 << 14,
  // Khmer-style Virama.
  Repha: 1 << 15,
  // Atomically-encoded logical or visual repha.
  Ra: 1 << 16,
  CM: 1 << 17,
  // Consonant-Medial.
  Symbol: 1 << 18 // Avagraha, etc that take marks (SM,A,VD).

}; // Visual positions in a syllable from left to right.

var POSITIONS = {
  Start: 1 << 0,
  Ra_To_Become_Reph: 1 << 1,
  Pre_M: 1 << 2,
  Pre_C: 1 << 3,
  Base_C: 1 << 4,
  After_Main: 1 << 5,
  Above_C: 1 << 6,
  Before_Sub: 1 << 7,
  Below_C: 1 << 8,
  After_Sub: 1 << 9,
  Before_Post: 1 << 10,
  Post_C: 1 << 11,
  After_Post: 1 << 12,
  Final_C: 1 << 13,
  SMVD: 1 << 14,
  End: 1 << 15
};
var CONSONANT_FLAGS = CATEGORIES.C | CATEGORIES.Ra | CATEGORIES.CM | CATEGORIES.V | CATEGORIES.Placeholder | CATEGORIES.Dotted_Circle;
var JOINER_FLAGS = CATEGORIES.ZWJ | CATEGORIES.ZWNJ;
var HALANT_OR_COENG_FLAGS = CATEGORIES.H | CATEGORIES.Coeng;
var INDIC_CONFIGS = {
  Default: {
    hasOldSpec: false,
    virama: 0,
    basePos: 'Last',
    rephPos: POSITIONS.Before_Post,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Devanagari: {
    hasOldSpec: true,
    virama: 0x094D,
    basePos: 'Last',
    rephPos: POSITIONS.Before_Post,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Bengali: {
    hasOldSpec: true,
    virama: 0x09CD,
    basePos: 'Last',
    rephPos: POSITIONS.After_Sub,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Gurmukhi: {
    hasOldSpec: true,
    virama: 0x0A4D,
    basePos: 'Last',
    rephPos: POSITIONS.Before_Sub,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Gujarati: {
    hasOldSpec: true,
    virama: 0x0ACD,
    basePos: 'Last',
    rephPos: POSITIONS.Before_Post,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Oriya: {
    hasOldSpec: true,
    virama: 0x0B4D,
    basePos: 'Last',
    rephPos: POSITIONS.After_Main,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Tamil: {
    hasOldSpec: true,
    virama: 0x0BCD,
    basePos: 'Last',
    rephPos: POSITIONS.After_Post,
    rephMode: 'Implicit',
    blwfMode: 'Pre_And_Post'
  },
  Telugu: {
    hasOldSpec: true,
    virama: 0x0C4D,
    basePos: 'Last',
    rephPos: POSITIONS.After_Post,
    rephMode: 'Explicit',
    blwfMode: 'Post_Only'
  },
  Kannada: {
    hasOldSpec: true,
    virama: 0x0CCD,
    basePos: 'Last',
    rephPos: POSITIONS.After_Post,
    rephMode: 'Implicit',
    blwfMode: 'Post_Only'
  },
  Malayalam: {
    hasOldSpec: true,
    virama: 0x0D4D,
    basePos: 'Last',
    rephPos: POSITIONS.After_Main,
    rephMode: 'Log_Repha',
    blwfMode: 'Pre_And_Post'
  },
  // Handled by UniversalShaper
  // Sinhala: {
  //   hasOldSpec: false,
  //   virama: 0x0DCA,
  //   basePos: 'Last_Sinhala',
  //   rephPos: POSITIONS.After_Main,
  //   rephMode: 'Explicit',
  //   blwfMode: 'Pre_And_Post'
  // },
  Khmer: {
    hasOldSpec: false,
    virama: 0x17D2,
    basePos: 'First',
    rephPos: POSITIONS.Ra_To_Become_Reph,
    rephMode: 'Vis_Repha',
    blwfMode: 'Pre_And_Post'
  }
}; // Additional decompositions that aren't in Unicode

var INDIC_DECOMPOSITIONS = {
  // Khmer
  0x17BE: [0x17C1, 0x17BE],
  0x17BF: [0x17C1, 0x17BF],
  0x17C0: [0x17C1, 0x17C0],
  0x17C4: [0x17C1, 0x17C4],
  0x17C5: [0x17C1, 0x17C5]
};

var type$1 = "Buffer";
var data$1 = [
	0,
	17,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	216,
	96,
	1,
	102,
	15,
	153,
	240,
	237,
	157,
	123,
	140,
	92,
	85,
	29,
	199,
	239,
	238,
	206,
	206,
	204,
	238,
	204,
	238,
	116,
	11,
	68,
	8,
	98,
	81,
	32,
	196,
	80,
	109,
	64,
	34,
	182,
	20,
	22,
	144,
	96,
	10,
	137,
	88,
	77,
	164,
	85,
	81,
	68,
	9,
	136,
	65,
	80,
	131,
	144,
	54,
	8,
	8,
	106,
	45,
	32,
	15,
	65,
	76,
	44,
	252,
	33,
	229,
	47,
	138,
	254,
	193,
	67,
	99,
	193,
	180,
	18,
	17,
	44,
	16,
	80,
	33,
	96,
	20,
	176,
	168,
	53,
	4,
	172,
	81,
	2,
	162,
	32,
	126,
	207,
	220,
	115,
	230,
	158,
	57,
	115,
	222,
	143,
	123,
	103,
	101,
	126,
	201,
	39,
	247,
	113,
	206,
	61,
	231,
	119,
	126,
	191,
	243,
	190,
	119,
	103,
	151,
	212,
	178,
	236,
	96,
	176,
	12,
	28,
	1,
	78,
	6,
	167,
	128,
	79,
	128,
	207,
	130,
	119,
	131,
	247,
	70,
	56,
	158,
	14,
	206,
	6,
	95,
	2,
	235,
	28,
	158,
	91,
	15,
	46,
	3,
	27,
	192,
	53,
	224,
	187,
	224,
	102,
	176,
	25,
	108,
	1,
	119,
	130,
	123,
	52,
	207,
	95,
	0,
	46,
	6,
	63,
	7,
	191,
	2,
	247,
	131,
	71,
	192,
	19,
	224,
	105,
	176,
	4,
	252,
	5,
	252,
	13,
	188,
	12,
	230,
	193,
	127,
	65,
	125,
	50,
	15,
	155,
	197,
	113,
	79,
	240,
	86,
	112,
	32,
	88,
	10,
	14,
	3,
	43,
	192,
	113,
	224,
	68,
	240,
	33,
	176,
	6,
	156,
	6,
	206,
	2,
	95,
	0,
	95,
	1,
	95,
	5,
	223,
	0,
	87,
	130,
	235,
	193,
	38,
	176,
	25,
	108,
	1,
	119,
	130,
	173,
	224,
	62,
	240,
	32,
	120,
	12,
	60,
	5,
	254,
	8,
	118,
	129,
	221,
	224,
	21,
	240,
	6,
	152,
	172,
	103,
	217,
	12,
	216,
	11,
	236,
	7,
	14,
	4,
	75,
	193,
	225,
	96,
	37,
	56,
	22,
	172,
	170,
	231,
	186,
	175,
	198,
	113,
	13,
	56,
	141,
	94,
	159,
	133,
	227,
	121,
	224,
	66,
	112,
	17,
	184,
	28,
	92,
	1,
	190,
	67,
	195,
	191,
	143,
	227,
	45,
	224,
	54,
	112,
	7,
	216,
	90,
	207,
	203,
	125,
	31,
	61,
	218,
	242,
	32,
	141,
	255,
	24,
	142,
	191,
	4,
	79,
	209,
	235,
	199,
	233,
	241,
	58,
	240,
	12,
	206,
	31,
	226,
	158,
	217,
	229,
	152,
	135,
	13,
	207,
	112,
	105,
	238,
	198,
	249,
	43,
	224,
	13,
	208,
	104,
	100,
	89,
	7,
	188,
	5,
	44,
	1,
	7,
	131,
	101,
	224,
	136,
	70,
	127,
	124,
	114,
	156,
	167,
	247,
	30,
	6,
	31,
	192,
	249,
	201,
	224,
	20,
	240,
	169,
	70,
	110,
	175,
	51,
	113,
	60,
	151,
	198,
	185,
	128,
	222,
	187,
	24,
	199,
	111,
	130,
	171,
	27,
	121,
	125,
	154,
	167,
	220,
	136,
	235,
	77,
	96,
	51,
	184,
	13,
	220,
	1,
	182,
	210,
	103,
	238,
	163,
	199,
	29,
	56,
	254,
	134,
	166,
	247,
	84,
	131,
	218,
	10,
	199,
	63,
	55,
	244,
	101,
	125,
	209,
	16,
	206,
	219,
	248,
	37,
	196,
	221,
	65,
	239,
	221,
	13,
	94,
	195,
	117,
	173,
	153,
	101,
	237,
	102,
	17,
	119,
	15,
	156,
	239,
	75,
	175,
	79,
	2,
	7,
	52,
	7,
	211,
	59,
	68,
	114,
	47,
	148,
	195,
	154,
	121,
	219,
	115,
	121,
	102,
	69,
	2,
	61,
	82,
	115,
	52,
	116,
	62,
	94,
	162,
	247,
	243,
	224,
	90,
	73,
	252,
	19,
	105,
	92,
	214,
	22,
	87,
	227,
	122,
	45,
	248,
	52,
	133,
	143,
	123,
	36,
	173,
	111,
	159,
	227,
	238,
	175,
	208,
	232,
	66,
	234,
	246,
	23,
	185,
	184,
	223,
	166,
	199,
	13,
	66,
	188,
	11,
	155,
	121,
	255,
	203,
	235,
	186,
	142,
	62,
	247,
	181,
	166,
	92,
	111,
	134,
	46,
	108,
	196,
	136,
	17,
	126,
	60,
	60,
	4,
	58,
	140,
	24,
	49,
	98,
	196,
	136,
	17,
	35,
	70,
	140,
	88,
	120,
	28,
	57,
	4,
	58,
	136,
	60,
	71,
	215,
	186,
	223,
	114,
	88,
	223,
	175,
	84,
	220,
	95,
	174,
	121,
	230,
	90,
	164,
	127,
	61,
	216,
	4,
	54,
	131,
	45,
	224,
	78,
	112,
	15,
	216,
	14,
	30,
	0,
	143,
	130,
	39,
	193,
	179,
	96,
	87,
	51,
	223,
	91,
	218,
	141,
	227,
	63,
	193,
	127,
	192,
	196,
	84,
	150,
	181,
	192,
	28,
	216,
	7,
	188,
	125,
	42,
	223,
	207,
	121,
	39,
	142,
	135,
	130,
	229,
	224,
	88,
	112,
	6,
	45,
	203,
	102,
	46,
	255,
	85,
	184,
	191,
	122,
	170,
	122,
	123,
	143,
	24,
	49,
	98,
	196,
	155,
	9,
	178,
	111,
	185,
	22,
	125,
	239,
	251,
	106,
	197,
	62,
	125,
	85,
	84,
	109,
	139,
	17,
	35,
	70,
	196,
	225,
	4,
	110,
	206,
	74,
	222,
	115,
	206,
	131,
	211,
	208,
	207,
	156,
	5,
	206,
	19,
	230,
	122,
	23,
	58,
	206,
	253,
	78,
	162,
	199,
	121,
	154,
	199,
	81,
	224,
	146,
	169,
	226,
	125,
	234,
	6,
	156,
	95,
	45,
	164,
	121,
	195,
	84,
	241,
	94,
	135,
	135,
	188,
	151,
	185,
	9,
	97,
	183,
	14,
	193,
	252,
	243,
	181,
	69,
	57,
	43,
	231,
	96,
	35,
	240,
	147,
	69,
	102,
	54,
	32,
	222,
	3,
	138,
	184,
	47,
	224,
	254,
	254,
	139,
	179,
	108,
	13,
	184,
	6,
	60,
	186,
	184,
	63,
	252,
	247,
	8,
	111,
	238,
	145,
	101,
	123,
	131,
	53,
	224,
	146,
	233,
	44,
	219,
	6,
	178,
	86,
	150,
	29,
	3,
	46,
	33,
	71,
	114,
	143,
	30,
	119,
	210,
	35,
	207,
	59,
	218,
	89,
	246,
	189,
	177,
	156,
	211,
	113,
	254,
	131,
	246,
	96,
	156,
	157,
	184,
	55,
	62,
	83,
	92,
	31,
	135,
	243,
	75,
	193,
	118,
	48,
	54,
	139,
	117,
	1,
	184,
	116,
	182,
	72,
	39,
	22,
	219,
	105,
	154,
	175,
	226,
	184,
	188,
	147,
	159,
	31,
	223,
	233,
	143,
	179,
	174,
	147,
	235,
	244,
	211,
	206,
	160,
	222,
	35,
	70,
	140,
	24,
	49,
	162,
	28,
	254,
	93,
	113,
	31,
	28,
	123,
	252,
	113,
	97,
	197,
	162,
	234,
	243,
	159,
	175,
	189,
	185,
	185,
	28,
	220,
	142,
	121,
	224,
	93,
	83,
	131,
	235,
	81,
	242,
	157,
	207,
	189,
	184,
	191,
	141,
	155,
	39,
	222,
	143,
	243,
	71,
	166,
	242,
	249,
	232,
	14,
	73,
	122,
	236,
	251,
	187,
	39,
	232,
	250,
	154,
	156,
	63,
	61,
	149,
	127,
	83,
	71,
	210,
	219,
	73,
	211,
	122,
	94,
	146,
	223,
	18,
	154,
	230,
	63,
	16,
	246,
	50,
	247,
	60,
	219,
	55,
	125,
	125,
	202,
	111,
	253,
	76,
	190,
	153,
	34,
	223,
	76,
	28,
	37,
	209,
	119,
	18,
	109,
	160,
	9,
	22,
	77,
	23,
	115,
	227,
	189,
	167,
	243,
	176,
	253,
	113,
	60,
	24,
	44,
	155,
	238,
	207,
	239,
	136,
	233,
	98,
	30,
	62,
	143,
	243,
	19,
	192,
	7,
	167,
	139,
	252,
	88,
	188,
	143,
	210,
	123,
	159,
	156,
	206,
	191,
	251,
	58,
	3,
	199,
	207,
	131,
	47,
	79,
	15,
	234,
	191,
	126,
	186,
	184,
	94,
	70,
	211,
	190,
	140,
	62,
	191,
	113,
	218,
	236,
	199,
	121,
	170,
	187,
	204,
	62,
	196,
	126,
	15,
	73,
	194,
	136,
	93,
	174,
	67,
	218,
	55,
	130,
	155,
	193,
	45,
	224,
	54,
	240,
	35,
	240,
	99,
	112,
	47,
	248,
	5,
	120,
	8,
	252,
	22,
	252,
	14,
	236,
	4,
	187,
	192,
	110,
	240,
	10,
	120,
	3,
	212,
	90,
	69,
	154,
	109,
	156,
	239,
	9,
	246,
	5,
	7,
	128,
	67,
	192,
	161,
	96,
	57,
	56,
	182,
	53,
	168,
	195,
	189,
	208,
	97,
	21,
	238,
	175,
	166,
	97,
	107,
	113,
	60,
	21,
	156,
	33,
	137,
	203,
	226,
	159,
	131,
	176,
	243,
	91,
	197,
	245,
	69,
	56,
	255,
	58,
	184,
	10,
	252,
	12,
	215,
	55,
	224,
	120,
	19,
	13,
	191,
	21,
	199,
	219,
	21,
	105,
	17,
	72,
	252,
	187,
	90,
	131,
	54,
	35,
	156,
	42,
	169,
	111,
	221,
	60,
	17,
	127,
	59,
	120,
	16,
	60,
	6,
	30,
	7,
	127,
	104,
	229,
	123,
	255,
	127,
	194,
	241,
	133,
	86,
	254,
	252,
	238,
	186,
	217,
	103,
	47,
	33,
	238,
	171,
	96,
	12,
	235,
	133,
	58,
	104,
	129,
	185,
	118,
	17,
	190,
	15,
	206,
	247,
	3,
	7,
	129,
	119,
	129,
	247,
	180,
	139,
	178,
	153,
	56,
	178,
	173,
	14,
	35,
	250,
	189,
	191,
	93,
	254,
	122,
	79,
	172,
	135,
	124,
	216,
	73,
	26,
	125,
	142,
	182,
	40,
	175,
	15,
	101,
	151,
	95,
	198,
	71,
	52,
	126,
	42,
	139,
	88,
	101,
	33,
	223,
	242,
	86,
	149,
	63,
	105,
	111,
	164,
	15,
	252,
	56,
	103,
	79,
	50,
	78,
	125,
	134,
	171,
	87,
	103,
	226,
	252,
	156,
	118,
	241,
	189,
	108,
	42,
	59,
	174,
	107,
	202,
	239,
	159,
	79,
	117,
	89,
	207,
	233,
	120,
	116,
	68,
	251,
	47,
	68,
	116,
	239,
	105,
	99,
	176,
	204,
	179,
	78,
	150,
	137,
	169,
	12,
	108,
	108,
	191,
	12,
	245,
	102,
	163,
	99,
	191,
	61,
	12,
	239,
	57,
	92,
	202,
	127,
	13,
	202,
	119,
	67,
	59,
	93,
	159,
	239,
	106,
	127,
	246,
	189,
	237,
	149,
	138,
	240,
	245,
	220,
	220,
	111,
	147,
	164,
	47,
	231,
	191,
	195,
	39,
	115,
	46,
	217,
	188,
	128,
	133,
	223,
	77,
	143,
	228,
	239,
	154,
	54,
	35,
	173,
	45,
	212,
	215,
	119,
	224,
	248,
	67,
	176,
	213,
	193,
	247,
	47,
	90,
	252,
	125,
	205,
	49,
	9,
	254,
	142,
	98,
	27,
	116,
	124,
	96,
	8,
	198,
	52,
	91,
	30,
	133,
	174,
	79,
	26,
	230,
	74,
	207,
	182,
	251,
	199,
	21,
	219,
	58,
	181,
	204,
	114,
	238,
	94,
	37,
	42,
	63,
	254,
	181,
	221,
	31,
	254,
	247,
	18,
	124,
	250,
	47,
	90,
	191,
	95,
	231,
	242,
	34,
	239,
	48,
	100,
	107,
	77,
	6,
	105,
	35,
	147,
	51,
	89,
	54,
	3,
	246,
	2,
	251,
	129,
	131,
	102,
	242,
	176,
	165,
	51,
	118,
	229,
	231,
	255,
	174,
	137,
	180,
	215,
	141,
	224,
	240,
	153,
	188,
	237,
	63,
	199,
	181,
	35,
	118,
	126,
	21,
	157,
	131,
	175,
	68,
	156,
	227,
	103,
	242,
	62,
	246,
	196,
	25,
	121,
	251,
	87,
	217,
	55,
	53,
	68,
	247,
	15,
	207,
	244,
	223,
	227,
	251,
	34,
	210,
	15,
	173,
	228,
	202,
	190,
	145,
	246,
	99,
	100,
	189,
	248,
	49,
	206,
	110,
	151,
	115,
	207,
	156,
	78,
	211,
	59,
	27,
	199,
	43,
	106,
	131,
	105,
	159,
	139,
	251,
	231,
	91,
	216,
	124,
	152,
	168,
	202,
	63,
	169,
	89,
	219,
	252,
	255,
	46,
	31,
	207,
	235,
	154,
	113,
	113,
	71,
	73,
	58,
	12,
	43,
	191,
	174,
	56,
	255,
	71,
	20,
	251,
	40,
	101,
	18,
	90,
	6,
	221,
	248,
	179,
	16,
	184,
	72,
	24,
	7,
	92,
	236,
	147,
	106,
	173,
	188,
	144,
	252,
	191,
	144,
	33,
	117,
	247,
	109,
	181,
	177,
	46,
	157,
	44,
	91,
	112,
	144,
	253,
	101,
	254,
	220,
	134,
	170,
	117,
	30,
	86,
	222,
	236,
	82,
	181,
	253,
	163,
	213,
	77,
	250,
	123,
	22,
	11,
	66,
	215,
	33,
	134,
	137,
	41,
	220,
	20,
	175,
	195,
	133,
	155,
	226,
	249,
	234,
	89,
	181,
	173,
	22,
	90,
	57,
	108,
	124,
	54,
	76,
	200,
	244,
	93,
	72,
	250,
	235,
	202,
	164,
	146,
	42,
	117,
	241,
	213,
	185,
	42,
	253,
	135,
	189,
	78,
	84,
	105,
	147,
	178,
	235,
	142,
	173,
	84,
	173,
	247,
	66,
	245,
	127,
	140,
	180,
	170,
	176,
	63,
	175,
	183,
	107,
	254,
	41,
	36,
	85,
	25,
	23,
	74,
	89,
	102,
	155,
	253,
	212,
	198,
	35,
	48,
	22,
	145,
	69,
	118,
	241,
	166,
	26,
	57,
	205,
	9,
	148,
	99,
	113,
	126,
	62,
	222,
	40,
	238,
	187,
	208,
	172,
	21,
	207,
	118,
	109,
	52,
	77,
	161,
	54,
	226,
	227,
	26,
	117,
	163,
	54,
	153,
	226,
	210,
	35,
	184,
	174,
	211,
	189,
	109,
	221,
	234,
	247,
	111,
	166,
	75,
	139,
	194,
	68,
	117,
	237,
	234,
	195,
	238,
	179,
	26,
	255,
	178,
	112,
	94,
	100,
	105,
	16,
	97,
	254,
	109,
	83,
	255,
	182,
	37,
	254,
	99,
	50,
	78,
	227,
	48,
	105,
	211,
	248,
	196,
	191,
	98,
	126,
	50,
	105,
	55,
	6,
	239,
	13,
	148,
	73,
	240,
	111,
	47,
	158,
	165,
	127,
	89,
	253,
	118,
	105,
	175,
	228,
	200,
	231,
	101,
	235,
	223,
	129,
	178,
	148,
	236,
	95,
	49,
	174,
	120,
	78,
	132,
	248,
	151,
	217,
	158,
	249,
	151,
	33,
	243,
	79,
	91,
	225,
	95,
	94,
	72,
	219,
	213,
	137,
	170,
	60,
	218,
	103,
	44,
	253,
	219,
	235,
	87,
	199,
	10,
	63,
	215,
	230,
	220,
	198,
	0,
	215,
	246,
	203,
	124,
	170,
	188,
	46,
	201,
	191,
	182,
	237,
	87,
	132,
	213,
	109,
	214,
	166,
	152,
	143,
	101,
	254,
	13,
	29,
	75,
	153,
	77,
	196,
	186,
	228,
	218,
	63,
	107,
	243,
	24,
	227,
	198,
	16,
	80,
	159,
	40,
	32,
	210,
	88,
	32,
	253,
	179,
	171,
	127,
	39,
	45,
	250,
	231,
	73,
	139,
	246,
	43,
	147,
	73,
	69,
	159,
	16,
	187,
	127,
	238,
	100,
	69,
	187,
	13,
	153,
	199,
	177,
	126,
	187,
	155,
	183,
	69,
	255,
	172,
	107,
	203,
	170,
	177,
	146,
	157,
	139,
	247,
	100,
	241,
	196,
	123,
	202,
	251,
	150,
	243,
	47,
	81,
	248,
	182,
	44,
	235,
	191,
	217,
	216,
	60,
	46,
	180,
	109,
	66,
	221,
	178,
	125,
	203,
	252,
	175,
	146,
	20,
	239,
	69,
	100,
	34,
	206,
	167,
	109,
	230,
	212,
	93,
	253,
	12,
	254,
	142,
	217,
	158,
	93,
	253,
	73,
	218,
	51,
	249,
	125,
	104,
	17,
	190,
	77,
	241,
	247,
	197,
	235,
	186,
	161,
	61,
	243,
	207,
	233,
	234,
	20,
	111,
	23,
	254,
	25,
	23,
	255,
	234,
	196,
	103,
	189,
	164,
	157,
	155,
	15,
	129,
	127,
	85,
	113,
	153,
	176,
	254,
	218,
	198,
	191,
	252,
	53,
	59,
	183,
	241,
	175,
	216,
	247,
	202,
	164,
	167,
	107,
	4,
	255,
	118,
	58,
	57,
	62,
	34,
	250,
	151,
	215,
	169,
	44,
	255,
	106,
	177,
	108,
	191,
	4,
	102,
	119,
	54,
	30,
	171,
	32,
	98,
	234,
	143,
	187,
	54,
	85,
	248,
	141,
	209,
	110,
	232,
	219,
	14,
	111,
	147,
	208,
	249,
	150,
	9,
	83,
	191,
	230,
	58,
	159,
	182,
	157,
	115,
	203,
	236,
	18,
	3,
	171,
	52,
	37,
	107,
	105,
	219,
	62,
	94,
	214,
	134,
	85,
	251,
	35,
	44,
	140,
	29,
	217,
	94,
	137,
	108,
	191,
	69,
	37,
	174,
	253,
	53,
	191,
	127,
	226,
	42,
	177,
	125,
	225,
	11,
	91,
	183,
	219,
	34,
	10,
	121,
	158,
	111,
	167,
	227,
	141,
	254,
	125,
	42,
	114,
	228,
	215,
	22,
	132,
	110,
	251,
	111,
	22,
	113,
	98,
	172,
	107,
	196,
	58,
	169,
	178,
	113,
	10,
	219,
	155,
	242,
	12,
	177,
	119,
	119,
	63,
	111,
	46,
	135,
	137,
	204,
	222,
	204,
	23,
	68,
	68,
	123,
	215,
	179,
	162,
	95,
	201,
	28,
	236,
	173,
	170,
	171,
	41,
	246,
	167,
	121,
	154,
	20,
	101,
	63,
	106,
	187,
	143,
	229,
	80,
	175,
	248,
	250,
	218,
	161,
	54,
	20,
	243,
	37,
	38,
	153,
	176,
	240,
	113,
	138,
	58,
	166,
	235,
	39,
	51,
	143,
	58,
	197,
	218,
	32,
	107,
	135,
	100,
	60,
	38,
	245,
	164,
	174,
	210,
	125,
	206,
	158,
	110,
	249,
	29,
	226,
	167,
	128,
	181,
	7,
	29,
	252,
	222,
	183,
	108,
	29,
	229,
	83,
	119,
	101,
	82,
	117,
	31,
	223,
	197,
	114,
	190,
	160,
	170,
	43,
	178,
	113,
	148,
	212,
	157,
	238,
	92,
	157,
	172,
	57,
	102,
	251,
	251,
	170,
	30,
	36,
	111,
	151,
	125,
	13,
	174,
	159,
	231,
	247,
	58,
	100,
	101,
	24,
	232,
	39,
	117,
	117,
	118,
	44,
	143,
	211,
	154,
	200,
	97,
	113,
	216,
	179,
	236,
	62,
	15,
	159,
	150,
	49,
	47,
	27,
	230,
	6,
	109,
	41,
	203,
	151,
	208,
	164,
	249,
	119,
	245,
	176,
	180,
	31,
	123,
	86,
	124,
	175,
	99,
	170,
	227,
	50,
	233,
	8,
	231,
	161,
	200,
	210,
	177,
	73,
	63,
	11,
	124,
	62,
	52,
	255,
	212,
	229,
	243,
	73,
	183,
	12,
	120,
	73,
	157,
	135,
	111,
	120,
	170,
	242,
	138,
	226,
	179,
	110,
	238,
	62,
	39,
	220,
	179,
	89,
	131,
	196,
	202,
	95,
	6,
	159,
	191,
	77,
	185,
	83,
	229,
	239,
	42,
	49,
	236,
	79,
	196,
	59,
	255,
	178,
	198,
	104,
	155,
	125,
	148,
	8,
	123,
	2,
	204,
	247,
	186,
	253,
	23,
	17,
	126,
	173,
	209,
	219,
	131,
	161,
	99,
	127,
	247,
	124,
	38,
	135,
	221,
	151,
	165,
	65,
	230,
	8,
	166,
	253,
	24,
	2,
	219,
	27,
	234,
	217,
	63,
	112,
	31,
	53,
	180,
	15,
	40,
	171,
	255,
	142,
	145,
	127,
	108,
	253,
	9,
	93,
	251,
	150,
	213,
	6,
	36,
	237,
	216,
	101,
	141,
	204,
	175,
	147,
	153,
	176,
	251,
	221,
	247,
	30,
	154,
	53,
	131,
	110,
	143,
	67,
	102,
	79,
	235,
	53,
	102,
	76,
	155,
	120,
	236,
	253,
	185,
	142,
	119,
	3,
	246,
	243,
	240,
	25,
	47,
	170,
	245,
	4,
	191,
	87,
	164,
	90,
	99,
	200,
	252,
	43,
	194,
	230,
	189,
	74,
	253,
	29,
	246,
	2,
	164,
	126,
	78,
	88,
	191,
	101,
	101,
	143,
	146,
	191,
	170,
	94,
	176,
	112,
	137,
	29,
	187,
	107,
	127,
	217,
	58,
	122,
	214,
	111,
	127,
	65,
	181,
	47,
	72,
	218,
	225,
	192,
	30,
	213,
	68,
	255,
	179,
	124,
	221,
	9,
	237,
	255,
	67,
	159,
	231,
	223,
	189,
	176,
	49,
	207,
	123,
	252,
	77,
	80,
	135,
	68,
	219,
	153,
	252,
	33,
	222,
	111,
	213,
	244,
	233,
	251,
	218,
	211,
	103,
	172,
	33,
	117,
	176,
	153,
	21,
	123,
	81,
	50,
	92,
	199,
	65,
	107,
	191,
	165,
	28,
	203,
	36,
	227,
	140,
	204,
	23,
	164,
	173,
	245,
	237,
	157,
	140,
	217,
	219,
	155,
	204,
	155,
	164,
	121,
	42,
	250,
	6,
	219,
	122,
	99,
	26,
	31,
	69,
	25,
	152,
	63,
	40,
	108,
	161,
	171,
	147,
	186,
	254,
	158,
	223,
	183,
	108,
	78,
	232,
	243,
	118,
	25,
	167,
	251,
	234,
	56,
	167,
	111,
	232,
	252,
	201,
	52,
	222,
	166,
	76,
	155,
	8,
	255,
	157,
	87,
	71,
	184,
	182,
	102,
	177,
	128,
	228,
	30,
	179,
	23,
	9,
	227,
	207,
	25,
	170,
	62,
	54,
	134,
	125,
	109,
	237,
	100,
	218,
	243,
	213,
	233,
	99,
	171,
	111,
	102,
	56,
	234,
	158,
	9,
	241,
	127,
	138,
	180,
	109,
	243,
	179,
	205,
	195,
	75,
	151,
	73,
	80,
	47,
	174,
	99,
	140,
	53,
	62,
	122,
	244,
	202,
	109,
	177,
	134,
	149,
	210,
	200,
	156,
	255,
	6,
	216,
	215,
	119,
	188,
	132,
	250,
	219,
	244,
	173,
	178,
	73,
	66,
	116,
	143,
	161,
	191,
	46,
	237,
	20,
	226,
	170,
	83,
	173,
	29,
	183,
	140,
	202,
	122,
	155,
	152,
	84,
	249,
	132,
	218,
	88,
	39,
	161,
	245,
	162,
	44,
	155,
	250,
	234,
	80,
	117,
	120,
	108,
	91,
	248,
	218,
	72,
	39,
	101,
	215,
	199,
	212,
	245,
	35,
	212,
	62,
	195,
	84,
	127,
	93,
	242,
	72,
	81,
	55,
	92,
	197,
	70,
	95,
	254,
	253,
	53,
	191,
	254,
	172,
	75,
	214,
	225,
	252,
	223,
	233,
	164,
	220,
	127,
	146,
	189,
	27,
	82,
	217,
	48,
	212,
	247,
	73,
	215,
	217,
	58,
	76,
	235,
	253,
	113,
	205,
	154,
	89,
	182,
	134,
	29,
	43,
	190,
	183,
	118,
	169,
	115,
	209,
	254,
	174,
	53,
	225,
	94,
	133,
	203,
	62,
	31,
	249,
	219,
	24,
	254,
	251,
	50,
	149,
	244,
	234,
	127,
	232,
	126,
	156,
	207,
	250,
	213,
	102,
	77,
	75,
	209,
	181,
	91,
	151,
	253,
	200,
	210,
	235,
	179,
	132,
	230,
	68,
	65,
	175,
	28,
	137,
	251,
	15,
	221,
	62,
	142,
	235,
	251,
	215,
	14,
	215,
	94,
	180,
	123,
	120,
	42,
	187,
	68,
	182,
	185,
	110,
	207,
	140,
	223,
	203,
	234,
	123,
	63,
	81,
	243,
	31,
	215,
	66,
	218,
	139,
	206,
	223,
	172,
	159,
	183,
	42,
	119,
	64,
	125,
	207,
	50,
	77,
	253,
	76,
	221,
	62,
	44,
	234,
	169,
	184,
	255,
	40,
	123,
	255,
	97,
	146,
	144,
	111,
	20,
	51,
	15,
	255,
	14,
	244,
	75,
	129,
	182,
	25,
	72,
	67,
	177,
	175,
	66,
	194,
	90,
	244,
	93,
	141,
	248,
	125,
	92,
	108,
	223,
	168,
	222,
	13,
	138,
	247,
	217,
	119,
	186,
	236,
	152,
	90,
	116,
	243,
	57,
	155,
	178,
	202,
	202,
	36,
	75,
	147,
	125,
	83,
	25,
	162,
	151,
	105,
	110,
	236,
	18,
	174,
	19,
	111,
	223,
	243,
	118,
	179,
	237,
	15,
	12,
	109,
	202,
	52,
	30,
	145,
	50,
	177,
	111,
	36,
	123,
	250,
	7,
	206,
	71,
	92,
	230,
	192,
	161,
	107,
	29,
	223,
	57,
	183,
	139,
	238,
	174,
	101,
	140,
	173,
	191,
	238,
	126,
	166,
	136,
	91,
	166,
	142,
	190,
	182,
	150,
	73,
	21,
	249,
	134,
	150,
	183,
	12,
	127,
	135,
	60,
	111,
	83,
	222,
	216,
	229,
	8,
	177,
	165,
	201,
	174,
	41,
	194,
	77,
	246,
	177,
	181,
	147,
	173,
	248,
	214,
	39,
	83,
	120,
	72,
	125,
	9,
	77,
	219,
	70,
	127,
	215,
	231,
	109,
	236,
	150,
	170,
	46,
	198,
	200,
	207,
	39,
	13,
	89,
	153,
	171,
	148,
	216,
	54,
	13,
	205,
	191,
	44,
	157,
	83,
	249,
	62,
	150,
	174,
	182,
	18,
	154,
	94,
	10,
	187,
	184,
	164,
	239,
	34,
	49,
	218,
	138,
	73,
	15,
	157,
	111,
	83,
	213,
	31,
	85,
	25,
	171,
	168,
	191,
	46,
	254,
	137,
	89,
	143,
	67,
	242,
	8,
	181,
	121,
	138,
	188,
	92,
	116,
	170,
	34,
	255,
	170,
	202,
	111,
	202,
	147,
	172,
	123,
	39,
	133,
	111,
	99,
	201,
	145,
	255,
	157,
	42,
	94,
	88,
	60,
	241,
	119,
	222,
	250,
	246,
	228,
	52,
	215,
	169,
	96,
	82,
	231,
	246,
	164,
	7,
	202,
	62,
	27,
	182,
	22,
	151,
	217,
	47,
	102,
	27,
	246,
	201,
	203,
	54,
	95,
	223,
	52,
	135,
	169,
	93,
	165,
	44,
	143,
	139,
	205,
	92,
	37,
	212,
	103,
	190,
	105,
	199,
	202,
	35,
	52,
	255,
	20,
	62,
	240,
	45,
	107,
	104,
	58,
	125,
	191,
	133,
	213,
	201,
	25,
	186,
	119,
	172,
	134,
	253,
	111,
	25,
	117,
	195,
	123,
	36,
	81,
	172,
	223,
	219,
	4,
	244,
	181,
	38,
	233,
	126,
	151,
	238,
	243,
	91,
	206,
	145,
	237,
	107,
	250,
	221,
	101,
	242,
	14,
	155,
	127,
	71,
	26,
	218,
	70,
	59,
	194,
	249,
	48,
	183,
	59,
	173,
	127,
	74,
	168,
	255,
	166,
	182,
	160,
	243,
	29,
	251,
	219,
	36,
	34,
	190,
	127,
	151,
	194,
	231,
	107,
	35,
	101,
	246,
	19,
	98,
	157,
	180,
	145,
	40,
	191,
	157,
	158,
	208,
	191,
	174,
	191,
	129,
	78,
	222,
	159,
	235,
	190,
	203,
	32,
	176,
	191,
	5,
	225,
	223,
	243,
	244,
	252,
	229,
	89,
	47,
	120,
	155,
	199,
	234,
	75,
	125,
	250,
	212,
	88,
	190,
	234,
	166,
	149,
	96,
	124,
	34,
	245,
	140,
	248,
	136,
	125,
	159,
	161,
	178,
	35,
	251,
	142,
	92,
	167,
	63,
	211,
	81,
	166,
	171,
	175,
	254,
	62,
	207,
	235,
	218,
	90,
	213,
	109,
	200,
	5,
	246,
	119,
	82,
	198,
	241,
	111,
	66,
	221,
	255,
	133,
	214,
	105,
	223,
	223,
	175,
	228,
	227,
	13,
	216,
	62,
	178,
	239,
	249,
	112,
	85,
	92,
	34,
	108,
	221,
	202,
	254,
	159,
	131,
	10,
	38,
	226,
	239,
	253,
	243,
	125,
	26,
	19,
	93,
	93,
	83,
	249,
	164,
	147,
	13,
	246,
	241,
	98,
	222,
	186,
	111,
	223,
	250,
	252,
	99,
	8,
	55,
	73,
	138,
	122,
	235,
	51,
	78,
	176,
	239,
	16,
	25,
	204,
	79,
	166,
	121,
	145,
	75,
	253,
	102,
	190,
	98,
	99,
	142,
	237,
	239,
	237,
	166,
	236,
	35,
	108,
	108,
	165,
	10,
	239,
	179,
	87,
	77,
	110,
	51,
	163,
	255,
	3,
	251,
	135,
	84,
	101,
	103,
	34,
	134,
	203,
	202,
	28,
	115,
	141,
	60,
	80,
	191,
	4,
	159,
	139,
	250,
	197,
	240,
	191,
	43,
	124,
	249,
	217,
	124,
	201,
	119,
	173,
	147,
	242,
	251,
	153,
	24,
	107,
	49,
	163,
	254,
	142,
	227,
	169,
	237,
	152,
	218,
	170,
	21,
	191,
	227,
	166,
	205,
	191,
	132,
	117,
	120,
	172,
	242,
	135,
	210,
	203,
	211,
	226,
	155,
	45,
	83,
	187,
	118,
	181,
	159,
	110,
	253,
	151,
	106,
	108,
	146,
	245,
	51,
	3,
	250,
	59,
	206,
	133,
	202,
	222,
	35,
	97,
	162,
	43,
	27,
	63,
	102,
	140,
	75,
	124,
	148,
	82,
	248,
	62,
	213,
	68,
	234,
	250,
	45,
	27,
	99,
	250,
	126,
	151,
	95,
	252,
	102,
	81,
	177,
	238,
	236,
	221,
	183,
	248,
	6,
	212,
	165,
	252,
	50,
	27,
	40,
	199,
	45,
	199,
	239,
	153,
	251,
	202,
	58,
	43,
	172,
	253,
	20,
	243,
	176,
	42,
	196,
	102,
	94,
	38,
	141,
	151,
	176,
	190,
	232,
	214,
	17,
	166,
	57,
	91,
	168,
	109,
	99,
	239,
	103,
	248,
	246,
	171,
	46,
	99,
	134,
	235,
	119,
	246,
	166,
	111,
	134,
	85,
	115,
	196,
	208,
	250,
	196,
	135,
	247,
	206,
	75,
	172,
	71,
	188,
	136,
	245,
	137,
	157,
	243,
	235,
	37,
	22,
	214,
	109,
	191,
	157,
	194,
	126,
	49,
	234,
	143,
	171,
	253,
	164,
	182,
	75,
	188,
	55,
	169,
	107,
	127,
	252,
	185,
	216,
	207,
	105,
	237,
	19,
	75,
	199,
	214,
	224,
	220,
	200,
	166,
	173,
	199,
	90,
	199,
	248,
	72,
	140,
	60,
	67,
	117,
	73,
	145,
	191,
	139,
	62,
	190,
	246,
	141,
	53,
	70,
	134,
	250,
	59,
	180,
	62,
	196,
	182,
	117,
	140,
	122,
	27,
	43,
	173,
	84,
	250,
	149,
	149,
	190,
	141,
	132,
	166,
	229,
	170,
	207,
	48,
	250,
	62,
	134,
	190,
	166,
	248,
	101,
	139,
	76,
	39,
	241,
	154,
	191,
	239,
	99,
	51,
	155,
	103,
	125,
	210,
	142,
	85,
	55,
	92,
	125,
	100,
	171,
	179,
	109,
	56,
	47,
	169,
	108,
	20,
	34,
	41,
	252,
	21,
	42,
	101,
	212,
	37,
	215,
	188,
	84,
	113,
	83,
	72,
	168,
	205,
	83,
	216,
	36,
	52,
	109,
	23,
	123,
	133,
	166,
	25,
	250,
	92,
	12,
	137,
	81,
	71,
	67,
	237,
	40,
	211,
	39,
	203,
	250,
	159,
	215,
	213,
	109,
	83,
	155,
	144,
	165,
	169,
	211,
	77,
	101,
	115,
	213,
	81,
	150,
	167,
	78,
	127,
	155,
	244,
	100,
	207,
	155,
	202,
	103,
	91,
	126,
	157,
	77,
	124,
	109,
	27,
	171,
	110,
	216,
	228,
	147,
	50,
	127,
	23,
	137,
	145,
	78,
	168,
	254,
	41,
	202,
	31,
	195,
	182,
	101,
	248,
	34,
	117,
	190,
	161,
	254,
	13,
	213,
	39,
	180,
	28,
	85,
	181,
	139,
	208,
	252,
	109,
	234,
	185,
	107,
	62,
	166,
	184,
	41,
	244,
	54,
	229,
	173,
	179,
	151,
	143,
	196,
	240,
	103,
	76,
	255,
	135,
	202,
	255,
	0
];
var trieData$1 = {
	type: type$1,
	data: data$1
};

var decompositions$1 = useData.decompositions;
var trie$1 = new (unicode_trie__WEBPACK_IMPORTED_MODULE_4___default())(new Uint8Array(trieData$1.data));
var stateMachine$1 = new dfa(indicMachine);
/**
 * The IndicShaper supports indic scripts e.g. Devanagari, Kannada, etc.
 * Based on code from Harfbuzz: https://github.com/behdad/harfbuzz/blob/master/src/hb-ot-shape-complex-indic.cc
 */

var IndicShaper = /*#__PURE__*/function (_DefaultShaper) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(IndicShaper, _DefaultShaper);

  function IndicShaper() {
    return _DefaultShaper.apply(this, arguments) || this;
  }

  IndicShaper.planFeatures = function planFeatures(plan) {
    plan.addStage(setupSyllables$1);
    plan.addStage(['locl', 'ccmp']);
    plan.addStage(initialReordering);
    plan.addStage('nukt');
    plan.addStage('akhn');
    plan.addStage('rphf', false);
    plan.addStage('rkrf');
    plan.addStage('pref', false);
    plan.addStage('blwf', false);
    plan.addStage('abvf', false);
    plan.addStage('half', false);
    plan.addStage('pstf', false);
    plan.addStage('vatu');
    plan.addStage('cjct');
    plan.addStage('cfar', false);
    plan.addStage(finalReordering);
    plan.addStage({
      local: ['init'],
      global: ['pres', 'abvs', 'blws', 'psts', 'haln', 'dist', 'abvm', 'blwm', 'calt', 'clig']
    }); // Setup the indic config for the selected script

    plan.unicodeScript = fromOpenType(plan.script);
    plan.indicConfig = INDIC_CONFIGS[plan.unicodeScript] || INDIC_CONFIGS.Default;
    plan.isOldSpec = plan.indicConfig.hasOldSpec && plan.script[plan.script.length - 1] !== '2'; // TODO: turn off kern (Khmer) and liga features.
  };

  IndicShaper.assignFeatures = function assignFeatures(plan, glyphs) {
    var _loop = function _loop(i) {
      var codepoint = glyphs[i].codePoints[0];
      var d = INDIC_DECOMPOSITIONS[codepoint] || decompositions$1[codepoint];

      if (d) {
        var decomposed = d.map(function (c) {
          var g = plan.font.glyphForCodePoint(c);
          return new GlyphInfo(plan.font, g.id, [c], glyphs[i].features);
        });
        glyphs.splice.apply(glyphs, [i, 1].concat(decomposed));
      }
    };

    // Decompose split matras
    // TODO: do this in a more general unicode normalizer
    for (var i = glyphs.length - 1; i >= 0; i--) {
      _loop(i);
    }
  };

  return IndicShaper;
}(DefaultShaper);

IndicShaper.zeroMarkWidths = 'NONE';

function indicCategory(glyph) {
  return trie$1.get(glyph.codePoints[0]) >> 8;
}

function indicPosition(glyph) {
  return 1 << (trie$1.get(glyph.codePoints[0]) & 0xff);
}

var IndicInfo = function IndicInfo(category, position, syllableType, syllable) {
  this.category = category;
  this.position = position;
  this.syllableType = syllableType;
  this.syllable = syllable;
};

function setupSyllables$1(font, glyphs) {
  var syllable = 0;
  var last = 0;

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(stateMachine$1.match(glyphs.map(indicCategory))), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        start = _step$value[0],
        end = _step$value[1],
        tags = _step$value[2];

    if (start > last) {
      ++syllable;

      for (var _i = last; _i < start; _i++) {
        glyphs[_i].shaperInfo = new IndicInfo(CATEGORIES.X, POSITIONS.End, 'non_indic_cluster', syllable);
      }
    }

    ++syllable; // Create shaper info

    for (var _i2 = start; _i2 <= end; _i2++) {
      glyphs[_i2].shaperInfo = new IndicInfo(1 << indicCategory(glyphs[_i2]), indicPosition(glyphs[_i2]), tags[0], syllable);
    }

    last = end + 1;
  }

  if (last < glyphs.length) {
    ++syllable;

    for (var i = last; i < glyphs.length; i++) {
      glyphs[i].shaperInfo = new IndicInfo(CATEGORIES.X, POSITIONS.End, 'non_indic_cluster', syllable);
    }
  }
}

function isConsonant(glyph) {
  return glyph.shaperInfo.category & CONSONANT_FLAGS;
}

function isJoiner(glyph) {
  return glyph.shaperInfo.category & JOINER_FLAGS;
}

function isHalantOrCoeng(glyph) {
  return glyph.shaperInfo.category & HALANT_OR_COENG_FLAGS;
}

function wouldSubstitute(glyphs, feature) {
  for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphs), _step2; !(_step2 = _iterator2()).done;) {
    var _glyph$features;

    var glyph = _step2.value;
    glyph.features = (_glyph$features = {}, _glyph$features[feature] = true, _glyph$features);
  }

  var GSUB = glyphs[0]._font._layoutEngine.engine.GSUBProcessor;
  GSUB.applyFeatures([feature], glyphs);
  return glyphs.length === 1;
}

function consonantPosition(font, consonant, virama) {
  var glyphs = [virama, consonant, virama];

  if (wouldSubstitute(glyphs.slice(0, 2), 'blwf') || wouldSubstitute(glyphs.slice(1, 3), 'blwf')) {
    return POSITIONS.Below_C;
  } else if (wouldSubstitute(glyphs.slice(0, 2), 'pstf') || wouldSubstitute(glyphs.slice(1, 3), 'pstf')) {
    return POSITIONS.Post_C;
  } else if (wouldSubstitute(glyphs.slice(0, 2), 'pref') || wouldSubstitute(glyphs.slice(1, 3), 'pref')) {
    return POSITIONS.Post_C;
  }

  return POSITIONS.Base_C;
}

function initialReordering(font, glyphs, plan) {
  var indicConfig = plan.indicConfig;
  var features = font._layoutEngine.engine.GSUBProcessor.features;
  var dottedCircle = font.glyphForCodePoint(0x25cc).id;
  var virama = font.glyphForCodePoint(indicConfig.virama).id;

  if (virama) {
    var info = new GlyphInfo(font, virama, [indicConfig.virama]);

    for (var i = 0; i < glyphs.length; i++) {
      if (glyphs[i].shaperInfo.position === POSITIONS.Base_C) {
        glyphs[i].shaperInfo.position = consonantPosition(font, glyphs[i].copy(), info);
      }
    }
  }

  for (var start = 0, end = nextSyllable$1(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable$1(glyphs, start)) {
    var _glyphs$start$shaperI = glyphs[start].shaperInfo;
        _glyphs$start$shaperI.category;
        var syllableType = _glyphs$start$shaperI.syllableType;

    if (syllableType === 'symbol_cluster' || syllableType === 'non_indic_cluster') {
      continue;
    }

    if (syllableType === 'broken_cluster' && dottedCircle) {
      var g = new GlyphInfo(font, dottedCircle, [0x25cc]);
      g.shaperInfo = new IndicInfo(1 << indicCategory(g), indicPosition(g), glyphs[start].shaperInfo.syllableType, glyphs[start].shaperInfo.syllable); // Insert after possible Repha.

      var _i3 = start;

      while (_i3 < end && glyphs[_i3].shaperInfo.category === CATEGORIES.Repha) {
        _i3++;
      }

      glyphs.splice(_i3++, 0, g);
      end++;
    } // 1. Find base consonant:
    //
    // The shaping engine finds the base consonant of the syllable, using the
    // following algorithm: starting from the end of the syllable, move backwards
    // until a consonant is found that does not have a below-base or post-base
    // form (post-base forms have to follow below-base forms), or that is not a
    // pre-base reordering Ra, or arrive at the first consonant. The consonant
    // stopped at will be the base.


    var base = end;
    var limit = start;
    var hasReph = false; // If the syllable starts with Ra + Halant (in a script that has Reph)
    // and has more than one consonant, Ra is excluded from candidates for
    // base consonants.

    if (indicConfig.rephPos !== POSITIONS.Ra_To_Become_Reph && features.rphf && start + 3 <= end && (indicConfig.rephMode === 'Implicit' && !isJoiner(glyphs[start + 2]) || indicConfig.rephMode === 'Explicit' && glyphs[start + 2].shaperInfo.category === CATEGORIES.ZWJ)) {
      // See if it matches the 'rphf' feature.
      var _g = [glyphs[start].copy(), glyphs[start + 1].copy(), glyphs[start + 2].copy()];

      if (wouldSubstitute(_g.slice(0, 2), 'rphf') || indicConfig.rephMode === 'Explicit' && wouldSubstitute(_g, 'rphf')) {
        limit += 2;

        while (limit < end && isJoiner(glyphs[limit])) {
          limit++;
        }

        base = start;
        hasReph = true;
      }
    } else if (indicConfig.rephMode === 'Log_Repha' && glyphs[start].shaperInfo.category === CATEGORIES.Repha) {
      limit++;

      while (limit < end && isJoiner(glyphs[limit])) {
        limit++;
      }

      base = start;
      hasReph = true;
    }

    switch (indicConfig.basePos) {
      case 'Last':
        {
          // starting from the end of the syllable, move backwards
          var _i4 = end;
          var seenBelow = false;

          do {
            var _info = glyphs[--_i4].shaperInfo; // until a consonant is found

            if (isConsonant(glyphs[_i4])) {
              // that does not have a below-base or post-base form
              // (post-base forms have to follow below-base forms),
              if (_info.position !== POSITIONS.Below_C && (_info.position !== POSITIONS.Post_C || seenBelow)) {
                base = _i4;
                break;
              } // or that is not a pre-base reordering Ra,
              //
              // IMPLEMENTATION NOTES:
              //
              // Our pre-base reordering Ra's are marked POS_POST_C, so will be skipped
              // by the logic above already.
              //
              // or arrive at the first consonant. The consonant stopped at will
              // be the base.


              if (_info.position === POSITIONS.Below_C) {
                seenBelow = true;
              }

              base = _i4;
            } else if (start < _i4 && _info.category === CATEGORIES.ZWJ && glyphs[_i4 - 1].shaperInfo.category === CATEGORIES.H) {
              // A ZWJ after a Halant stops the base search, and requests an explicit
              // half form.
              // A ZWJ before a Halant, requests a subjoined form instead, and hence
              // search continues.  This is particularly important for Bengali
              // sequence Ra,H,Ya that should form Ya-Phalaa by subjoining Ya.
              break;
            }
          } while (_i4 > limit);

          break;
        }

      case 'First':
        {
          // The first consonant is always the base.
          base = start; // Mark all subsequent consonants as below.

          for (var _i5 = base + 1; _i5 < end; _i5++) {
            if (isConsonant(glyphs[_i5])) {
              glyphs[_i5].shaperInfo.position = POSITIONS.Below_C;
            }
          }
        }
    } // If the syllable starts with Ra + Halant (in a script that has Reph)
    // and has more than one consonant, Ra is excluded from candidates for
    // base consonants.
    //
    //  Only do this for unforced Reph. (ie. not for Ra,H,ZWJ)


    if (hasReph && base === start && limit - base <= 2) {
      hasReph = false;
    } // 2. Decompose and reorder Matras:
    //
    // Each matra and any syllable modifier sign in the cluster are moved to the
    // appropriate position relative to the consonant(s) in the cluster. The
    // shaping engine decomposes two- or three-part matras into their constituent
    // parts before any repositioning. Matra characters are classified by which
    // consonant in a conjunct they have affinity for and are reordered to the
    // following positions:
    //
    //   o Before first half form in the syllable
    //   o After subjoined consonants
    //   o After post-form consonant
    //   o After main consonant (for above marks)
    //
    // IMPLEMENTATION NOTES:
    //
    // The normalize() routine has already decomposed matras for us, so we don't
    // need to worry about that.
    // 3.  Reorder marks to canonical order:
    //
    // Adjacent nukta and halant or nukta and vedic sign are always repositioned
    // if necessary, so that the nukta is first.
    //
    // IMPLEMENTATION NOTES:
    //
    // We don't need to do this: the normalize() routine already did this for us.
    // Reorder characters


    for (var _i6 = start; _i6 < base; _i6++) {
      var _info2 = glyphs[_i6].shaperInfo;
      _info2.position = Math.min(POSITIONS.Pre_C, _info2.position);
    }

    if (base < end) {
      glyphs[base].shaperInfo.position = POSITIONS.Base_C;
    } // Mark final consonants.  A final consonant is one appearing after a matra,
    // like in Khmer.


    for (var _i7 = base + 1; _i7 < end; _i7++) {
      if (glyphs[_i7].shaperInfo.category === CATEGORIES.M) {
        for (var j = _i7 + 1; j < end; j++) {
          if (isConsonant(glyphs[j])) {
            glyphs[j].shaperInfo.position = POSITIONS.Final_C;
            break;
          }
        }

        break;
      }
    } // Handle beginning Ra


    if (hasReph) {
      glyphs[start].shaperInfo.position = POSITIONS.Ra_To_Become_Reph;
    } // For old-style Indic script tags, move the first post-base Halant after
    // last consonant.
    //
    // Reports suggest that in some scripts Uniscribe does this only if there
    // is *not* a Halant after last consonant already (eg. Kannada), while it
    // does it unconditionally in other scripts (eg. Malayalam).  We don't
    // currently know about other scripts, so we single out Malayalam for now.
    //
    // Kannada test case:
    // U+0C9A,U+0CCD,U+0C9A,U+0CCD
    // With some versions of Lohit Kannada.
    // https://bugs.freedesktop.org/show_bug.cgi?id=59118
    //
    // Malayalam test case:
    // U+0D38,U+0D4D,U+0D31,U+0D4D,U+0D31,U+0D4D
    // With lohit-ttf-20121122/Lohit-Malayalam.ttf


    if (plan.isOldSpec) {
      var disallowDoubleHalants = plan.unicodeScript !== 'Malayalam';

      for (var _i8 = base + 1; _i8 < end; _i8++) {
        if (glyphs[_i8].shaperInfo.category === CATEGORIES.H) {
          var _j = void 0;

          for (_j = end - 1; _j > _i8; _j--) {
            if (isConsonant(glyphs[_j]) || disallowDoubleHalants && glyphs[_j].shaperInfo.category === CATEGORIES.H) {
              break;
            }
          }

          if (glyphs[_j].shaperInfo.category !== CATEGORIES.H && _j > _i8) {
            // Move Halant to after last consonant.
            var t = glyphs[_i8];
            glyphs.splice.apply(glyphs, [_i8, 0].concat(glyphs.splice(_i8 + 1, _j - _i8)));
            glyphs[_j] = t;
          }

          break;
        }
      }
    } // Attach misc marks to previous char to move with them.


    var lastPos = POSITIONS.Start;

    for (var _i9 = start; _i9 < end; _i9++) {
      var _info3 = glyphs[_i9].shaperInfo;

      if (_info3.category & (JOINER_FLAGS | CATEGORIES.N | CATEGORIES.RS | CATEGORIES.CM | HALANT_OR_COENG_FLAGS & _info3.category)) {
        _info3.position = lastPos;

        if (_info3.category === CATEGORIES.H && _info3.position === POSITIONS.Pre_M) {
          // Uniscribe doesn't move the Halant with Left Matra.
          // TEST: U+092B,U+093F,U+094DE
          // We follow.  This is important for the Sinhala
          // U+0DDA split matra since it decomposes to U+0DD9,U+0DCA
          // where U+0DD9 is a left matra and U+0DCA is the virama.
          // We don't want to move the virama with the left matra.
          // TEST: U+0D9A,U+0DDA
          for (var _j2 = _i9; _j2 > start; _j2--) {
            if (glyphs[_j2 - 1].shaperInfo.position !== POSITIONS.Pre_M) {
              _info3.position = glyphs[_j2 - 1].shaperInfo.position;
              break;
            }
          }
        }
      } else if (_info3.position !== POSITIONS.SMVD) {
        lastPos = _info3.position;
      }
    } // For post-base consonants let them own anything before them
    // since the last consonant or matra.


    var last = base;

    for (var _i10 = base + 1; _i10 < end; _i10++) {
      if (isConsonant(glyphs[_i10])) {
        for (var _j3 = last + 1; _j3 < _i10; _j3++) {
          if (glyphs[_j3].shaperInfo.position < POSITIONS.SMVD) {
            glyphs[_j3].shaperInfo.position = glyphs[_i10].shaperInfo.position;
          }
        }

        last = _i10;
      } else if (glyphs[_i10].shaperInfo.category === CATEGORIES.M) {
        last = _i10;
      }
    }

    var arr = glyphs.slice(start, end);
    arr.sort(function (a, b) {
      return a.shaperInfo.position - b.shaperInfo.position;
    });
    glyphs.splice.apply(glyphs, [start, arr.length].concat(arr)); // Find base again

    for (var _i11 = start; _i11 < end; _i11++) {
      if (glyphs[_i11].shaperInfo.position === POSITIONS.Base_C) {
        base = _i11;
        break;
      }
    } // Setup features now
    // Reph


    for (var _i12 = start; _i12 < end && glyphs[_i12].shaperInfo.position === POSITIONS.Ra_To_Become_Reph; _i12++) {
      glyphs[_i12].features.rphf = true;
    } // Pre-base


    var blwf = !plan.isOldSpec && indicConfig.blwfMode === 'Pre_And_Post';

    for (var _i13 = start; _i13 < base; _i13++) {
      glyphs[_i13].features.half = true;

      if (blwf) {
        glyphs[_i13].features.blwf = true;
      }
    } // Post-base


    for (var _i14 = base + 1; _i14 < end; _i14++) {
      glyphs[_i14].features.abvf = true;
      glyphs[_i14].features.pstf = true;
      glyphs[_i14].features.blwf = true;
    }

    if (plan.isOldSpec && plan.unicodeScript === 'Devanagari') {
      // Old-spec eye-lash Ra needs special handling.  From the
      // spec:
      //
      // "The feature 'below-base form' is applied to consonants
      // having below-base forms and following the base consonant.
      // The exception is vattu, which may appear below half forms
      // as well as below the base glyph. The feature 'below-base
      // form' will be applied to all such occurrences of Ra as well."
      //
      // Test case: U+0924,U+094D,U+0930,U+094d,U+0915
      // with Sanskrit 2003 font.
      //
      // However, note that Ra,Halant,ZWJ is the correct way to
      // request eyelash form of Ra, so we wouldbn't inhibit it
      // in that sequence.
      //
      // Test case: U+0924,U+094D,U+0930,U+094d,U+200D,U+0915
      for (var _i15 = start; _i15 + 1 < base; _i15++) {
        if (glyphs[_i15].shaperInfo.category === CATEGORIES.Ra && glyphs[_i15 + 1].shaperInfo.category === CATEGORIES.H && (_i15 + 1 === base || glyphs[_i15 + 2].shaperInfo.category === CATEGORIES.ZWJ)) {
          glyphs[_i15].features.blwf = true;
          glyphs[_i15 + 1].features.blwf = true;
        }
      }
    }

    var prefLen = 2;

    if (features.pref && base + prefLen < end) {
      // Find a Halant,Ra sequence and mark it for pre-base reordering processing.
      for (var _i16 = base + 1; _i16 + prefLen - 1 < end; _i16++) {
        var _g2 = [glyphs[_i16].copy(), glyphs[_i16 + 1].copy()];

        if (wouldSubstitute(_g2, 'pref')) {
          for (var _j4 = 0; _j4 < prefLen; _j4++) {
            glyphs[_i16++].features.pref = true;
          } // Mark the subsequent stuff with 'cfar'.  Used in Khmer.
          // Read the feature spec.
          // This allows distinguishing the following cases with MS Khmer fonts:
          // U+1784,U+17D2,U+179A,U+17D2,U+1782
          // U+1784,U+17D2,U+1782,U+17D2,U+179A


          if (features.cfar) {
            for (; _i16 < end; _i16++) {
              glyphs[_i16].features.cfar = true;
            }
          }

          break;
        }
      }
    } // Apply ZWJ/ZWNJ effects


    for (var _i17 = start + 1; _i17 < end; _i17++) {
      if (isJoiner(glyphs[_i17])) {
        var nonJoiner = glyphs[_i17].shaperInfo.category === CATEGORIES.ZWNJ;
        var _j5 = _i17;

        do {
          _j5--; // ZWJ/ZWNJ should disable CJCT.  They do that by simply
          // being there, since we don't skip them for the CJCT
          // feature (ie. F_MANUAL_ZWJ)
          // A ZWNJ disables HALF.

          if (nonJoiner) {
            delete glyphs[_j5].features.half;
          }
        } while (_j5 > start && !isConsonant(glyphs[_j5]));
      }
    }
  }
}

function finalReordering(font, glyphs, plan) {
  var indicConfig = plan.indicConfig;
  var features = font._layoutEngine.engine.GSUBProcessor.features;

  for (var start = 0, end = nextSyllable$1(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable$1(glyphs, start)) {
    // 4. Final reordering:
    //
    // After the localized forms and basic shaping forms GSUB features have been
    // applied (see below), the shaping engine performs some final glyph
    // reordering before applying all the remaining font features to the entire
    // cluster.
    var tryPref = !!features.pref; // Find base again

    var base = start;

    for (; base < end; base++) {
      if (glyphs[base].shaperInfo.position >= POSITIONS.Base_C) {
        if (tryPref && base + 1 < end) {
          for (var i = base + 1; i < end; i++) {
            if (glyphs[i].features.pref) {
              if (!(glyphs[i].substituted && glyphs[i].isLigated && !glyphs[i].isMultiplied)) {
                // Ok, this was a 'pref' candidate but didn't form any.
                // Base is around here...
                base = i;

                while (base < end && isHalantOrCoeng(glyphs[base])) {
                  base++;
                }

                glyphs[base].shaperInfo.position = POSITIONS.BASE_C;
                tryPref = false;
              }

              break;
            }
          }
        } // For Malayalam, skip over unformed below- (but NOT post-) forms.


        if (plan.unicodeScript === 'Malayalam') {
          for (var _i18 = base + 1; _i18 < end; _i18++) {
            while (_i18 < end && isJoiner(glyphs[_i18])) {
              _i18++;
            }

            if (_i18 === end || !isHalantOrCoeng(glyphs[_i18])) {
              break;
            }

            _i18++; // Skip halant.

            while (_i18 < end && isJoiner(glyphs[_i18])) {
              _i18++;
            }

            if (_i18 < end && isConsonant(glyphs[_i18]) && glyphs[_i18].shaperInfo.position === POSITIONS.Below_C) {
              base = _i18;
              glyphs[base].shaperInfo.position = POSITIONS.Base_C;
            }
          }
        }

        if (start < base && glyphs[base].shaperInfo.position > POSITIONS.Base_C) {
          base--;
        }

        break;
      }
    }

    if (base === end && start < base && glyphs[base - 1].shaperInfo.category === CATEGORIES.ZWJ) {
      base--;
    }

    if (base < end) {
      while (start < base && glyphs[base].shaperInfo.category & (CATEGORIES.N | HALANT_OR_COENG_FLAGS)) {
        base--;
      }
    } // o Reorder matras:
    //
    // If a pre-base matra character had been reordered before applying basic
    // features, the glyph can be moved closer to the main consonant based on
    // whether half-forms had been formed. Actual position for the matra is
    // defined as “after last standalone halant glyph, after initial matra
    // position and before the main consonant”. If ZWJ or ZWNJ follow this
    // halant, position is moved after it.
    //


    if (start + 1 < end && start < base) {
      // Otherwise there can't be any pre-base matra characters.
      // If we lost track of base, alas, position before last thingy.
      var newPos = base === end ? base - 2 : base - 1; // Malayalam / Tamil do not have "half" forms or explicit virama forms.
      // The glyphs formed by 'half' are Chillus or ligated explicit viramas.
      // We want to position matra after them.

      if (plan.unicodeScript !== 'Malayalam' && plan.unicodeScript !== 'Tamil') {
        while (newPos > start && !(glyphs[newPos].shaperInfo.category & (CATEGORIES.M | HALANT_OR_COENG_FLAGS))) {
          newPos--;
        } // If we found no Halant we are done.
        // Otherwise only proceed if the Halant does
        // not belong to the Matra itself!


        if (isHalantOrCoeng(glyphs[newPos]) && glyphs[newPos].shaperInfo.position !== POSITIONS.Pre_M) {
          // If ZWJ or ZWNJ follow this halant, position is moved after it.
          if (newPos + 1 < end && isJoiner(glyphs[newPos + 1])) {
            newPos++;
          }
        } else {
          newPos = start; // No move.
        }
      }

      if (start < newPos && glyphs[newPos].shaperInfo.position !== POSITIONS.Pre_M) {
        // Now go see if there's actually any matras...
        for (var _i19 = newPos; _i19 > start; _i19--) {
          if (glyphs[_i19 - 1].shaperInfo.position === POSITIONS.Pre_M) {
            var oldPos = _i19 - 1;

            if (oldPos < base && base <= newPos) {
              // Shouldn't actually happen.
              base--;
            }

            var tmp = glyphs[oldPos];
            glyphs.splice.apply(glyphs, [oldPos, 0].concat(glyphs.splice(oldPos + 1, newPos - oldPos)));
            glyphs[newPos] = tmp;
            newPos--;
          }
        }
      }
    } // o Reorder reph:
    //
    // Reph’s original position is always at the beginning of the syllable,
    // (i.e. it is not reordered at the character reordering stage). However,
    // it will be reordered according to the basic-forms shaping results.
    // Possible positions for reph, depending on the script, are; after main,
    // before post-base consonant forms, and after post-base consonant forms.
    // Two cases:
    //
    // - If repha is encoded as a sequence of characters (Ra,H or Ra,H,ZWJ), then
    //   we should only move it if the sequence ligated to the repha form.
    //
    // - If repha is encoded separately and in the logical position, we should only
    //   move it if it did NOT ligate.  If it ligated, it's probably the font trying
    //   to make it work without the reordering.


    if (start + 1 < end && glyphs[start].shaperInfo.position === POSITIONS.Ra_To_Become_Reph && glyphs[start].shaperInfo.category === CATEGORIES.Repha !== (glyphs[start].isLigated && !glyphs[start].isMultiplied)) {
      var newRephPos = void 0;
      var rephPos = indicConfig.rephPos;
      var found = false; // 1. If reph should be positioned after post-base consonant forms,
      //    proceed to step 5.

      if (rephPos !== POSITIONS.After_Post) {
        //  2. If the reph repositioning class is not after post-base: target
        //     position is after the first explicit halant glyph between the
        //     first post-reph consonant and last main consonant. If ZWJ or ZWNJ
        //     are following this halant, position is moved after it. If such
        //     position is found, this is the target position. Otherwise,
        //     proceed to the next step.
        //
        //     Note: in old-implementation fonts, where classifications were
        //     fixed in shaping engine, there was no case where reph position
        //     will be found on this step.
        newRephPos = start + 1;

        while (newRephPos < base && !isHalantOrCoeng(glyphs[newRephPos])) {
          newRephPos++;
        }

        if (newRephPos < base && isHalantOrCoeng(glyphs[newRephPos])) {
          // ->If ZWJ or ZWNJ are following this halant, position is moved after it.
          if (newRephPos + 1 < base && isJoiner(glyphs[newRephPos + 1])) {
            newRephPos++;
          }

          found = true;
        } // 3. If reph should be repositioned after the main consonant: find the
        //    first consonant not ligated with main, or find the first
        //    consonant that is not a potential pre-base reordering Ra.


        if (!found && rephPos === POSITIONS.After_Main) {
          newRephPos = base;

          while (newRephPos + 1 < end && glyphs[newRephPos + 1].shaperInfo.position <= POSITIONS.After_Main) {
            newRephPos++;
          }

          found = newRephPos < end;
        } // 4. If reph should be positioned before post-base consonant, find
        //    first post-base classified consonant not ligated with main. If no
        //    consonant is found, the target position should be before the
        //    first matra, syllable modifier sign or vedic sign.
        //
        // This is our take on what step 4 is trying to say (and failing, BADLY).


        if (!found && rephPos === POSITIONS.After_Sub) {
          newRephPos = base;

          while (newRephPos + 1 < end && !(glyphs[newRephPos + 1].shaperInfo.position & (POSITIONS.Post_C | POSITIONS.After_Post | POSITIONS.SMVD))) {
            newRephPos++;
          }

          found = newRephPos < end;
        }
      } //  5. If no consonant is found in steps 3 or 4, move reph to a position
      //     immediately before the first post-base matra, syllable modifier
      //     sign or vedic sign that has a reordering class after the intended
      //     reph position. For example, if the reordering position for reph
      //     is post-main, it will skip above-base matras that also have a
      //     post-main position.


      if (!found) {
        // Copied from step 2.
        newRephPos = start + 1;

        while (newRephPos < base && !isHalantOrCoeng(glyphs[newRephPos])) {
          newRephPos++;
        }

        if (newRephPos < base && isHalantOrCoeng(glyphs[newRephPos])) {
          // ->If ZWJ or ZWNJ are following this halant, position is moved after it.
          if (newRephPos + 1 < base && isJoiner(glyphs[newRephPos + 1])) {
            newRephPos++;
          }

          found = true;
        }
      } // 6. Otherwise, reorder reph to the end of the syllable.


      if (!found) {
        newRephPos = end - 1;

        while (newRephPos > start && glyphs[newRephPos].shaperInfo.position === POSITIONS.SMVD) {
          newRephPos--;
        } // If the Reph is to be ending up after a Matra,Halant sequence,
        // position it before that Halant so it can interact with the Matra.
        // However, if it's a plain Consonant,Halant we shouldn't do that.
        // Uniscribe doesn't do this.
        // TEST: U+0930,U+094D,U+0915,U+094B,U+094D


        if (isHalantOrCoeng(glyphs[newRephPos])) {
          for (var _i20 = base + 1; _i20 < newRephPos; _i20++) {
            if (glyphs[_i20].shaperInfo.category === CATEGORIES.M) {
              newRephPos--;
            }
          }
        }
      }

      var reph = glyphs[start];
      glyphs.splice.apply(glyphs, [start, 0].concat(glyphs.splice(start + 1, newRephPos - start)));
      glyphs[newRephPos] = reph;

      if (start < base && base <= newRephPos) {
        base--;
      }
    } // o Reorder pre-base reordering consonants:
    //
    // If a pre-base reordering consonant is found, reorder it according to
    // the following rules:


    if (tryPref && base + 1 < end) {
      for (var _i21 = base + 1; _i21 < end; _i21++) {
        if (glyphs[_i21].features.pref) {
          // 1. Only reorder a glyph produced by substitution during application
          //    of the <pref> feature. (Note that a font may shape a Ra consonant with
          //    the feature generally but block it in certain contexts.)
          // Note: We just check that something got substituted.  We don't check that
          // the <pref> feature actually did it...
          //
          // Reorder pref only if it ligated.
          if (glyphs[_i21].isLigated && !glyphs[_i21].isMultiplied) {
            // 2. Try to find a target position the same way as for pre-base matra.
            //    If it is found, reorder pre-base consonant glyph.
            //
            // 3. If position is not found, reorder immediately before main
            //    consonant.
            var _newPos = base; // Malayalam / Tamil do not have "half" forms or explicit virama forms.
            // The glyphs formed by 'half' are Chillus or ligated explicit viramas.
            // We want to position matra after them.

            if (plan.unicodeScript !== 'Malayalam' && plan.unicodeScript !== 'Tamil') {
              while (_newPos > start && !(glyphs[_newPos - 1].shaperInfo.category & (CATEGORIES.M | HALANT_OR_COENG_FLAGS))) {
                _newPos--;
              } // In Khmer coeng model, a H,Ra can go *after* matras.  If it goes after a
              // split matra, it should be reordered to *before* the left part of such matra.


              if (_newPos > start && glyphs[_newPos - 1].shaperInfo.category === CATEGORIES.M) {
                var _oldPos2 = _i21;

                for (var j = base + 1; j < _oldPos2; j++) {
                  if (glyphs[j].shaperInfo.category === CATEGORIES.M) {
                    _newPos--;
                    break;
                  }
                }
              }
            }

            if (_newPos > start && isHalantOrCoeng(glyphs[_newPos - 1])) {
              // -> If ZWJ or ZWNJ follow this halant, position is moved after it.
              if (_newPos < end && isJoiner(glyphs[_newPos])) {
                _newPos++;
              }
            }

            var _oldPos = _i21;
            var _tmp = glyphs[_oldPos];
            glyphs.splice.apply(glyphs, [_newPos + 1, 0].concat(glyphs.splice(_newPos, _oldPos - _newPos)));
            glyphs[_newPos] = _tmp;

            if (_newPos <= base && base < _oldPos) {
              base++;
            }
          }

          break;
        }
      }
    } // Apply 'init' to the Left Matra if it's a word start.


    if (glyphs[start].shaperInfo.position === POSITIONS.Pre_M && (!start || !/Cf|Mn/.test(_react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].getCategory(glyphs[start - 1].codePoints[0])))) {
      glyphs[start].features.init = true;
    }
  }
}

function nextSyllable$1(glyphs, start) {
  if (start >= glyphs.length) return start;
  var syllable = glyphs[start].shaperInfo.syllable;

  while (++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable) {
  }

  return start;
}

var type = "Buffer";
var data = [
	0,
	2,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	186,
	16,
	1,
	5,
	14,
	250,
	241,
	237,
	156,
	123,
	140,
	95,
	69,
	21,
	199,
	103,
	119,
	187,
	251,
	123,
	109,
	119,
	187,
	22,
	90,
	160,
	188,
	31,
	166,
	165,
	8,
	69,
	154,
	24,
	164,
	49,
	16,
	32,
	209,
	148,
	38,
	106,
	67,
	20,
	249,
	195,
	214,
	7,
	54,
	98,
	176,
	65,
	141,
	141,
	74,
	104,
	136,
	134,
	2,
	18,
	9,
	134,
	80,
	99,
	132,
	26,
	163,
	149,
	52,
	245,
	25,
	80,
	99,
	64,
	249,
	3,
	72,
	5,
	77,
	138,
	68,
	65,
	5,
	21,
	35,
	1,
	81,
	132,
	72,
	72,
	197,
	196,
	248,
	29,
	239,
	156,
	252,
	206,
	206,
	158,
	121,
	222,
	215,
	22,
	126,
	39,
	249,
	100,
	238,
	99,
	158,
	231,
	204,
	204,
	157,
	153,
	59,
	247,
	174,
	154,
	80,
	234,
	20,
	176,
	22,
	156,
	3,
	46,
	4,
	27,
	193,
	102,
	112,
	185,
	185,
	118,
	94,
	5,
	238,
	22,
	176,
	13,
	108,
	7,
	59,
	60,
	254,
	118,
	130,
	93,
	194,
	245,
	27,
	193,
	173,
	96,
	55,
	216,
	3,
	190,
	13,
	190,
	7,
	238,
	1,
	247,
	25,
	30,
	100,
	254,
	127,
	1,
	30,
	5,
	191,
	3,
	79,
	11,
	241,
	61,
	5,
	158,
	1,
	171,
	192,
	11,
	38,
	111,
	171,
	204,
	253,
	85,
	140,
	87,
	192,
	33,
	160,
	150,
	40,
	213,
	5,
	203,
	192,
	10,
	112,
	60,
	120,
	35,
	56,
	19,
	172,
	7,
	27,
	192,
	69,
	224,
	18,
	240,
	110,
	240,
	62,
	240,
	1,
	240,
	81,
	176,
	29,
	236,
	0,
	59,
	193,
	46,
	112,
	11,
	216,
	13,
	238,
	4,
	123,
	193,
	126,
	112,
	55,
	184,
	23,
	60,
	0,
	30,
	6,
	191,
	6,
	191,
	7,
	127,
	1,
	207,
	130,
	23,
	193,
	33,
	160,
	38,
	149,
	234,
	128,
	89,
	176,
	18,
	156,
	0,
	78,
	5,
	103,
	76,
	22,
	121,
	95,
	15,
	247,
	60,
	112,
	161,
	57,
	223,
	8,
	119,
	51,
	184,
	28,
	108,
	1,
	219,
	192,
	199,
	193,
	167,
	205,
	253,
	107,
	225,
	126,
	1,
	220,
	12,
	110,
	3,
	95,
	155,
	28,
	150,
	253,
	155,
	147,
	243,
	117,
	81,
	150,
	253,
	136,
	239,
	251,
	21,
	199,
	201,
	249,
	177,
	21,
	247,
	125,
	56,
	127,
	16,
	252,
	10,
	252,
	6,
	60,
	53,
	89,
	148,
	247,
	25,
	240,
	2,
	120,
	5,
	252,
	55,
	144,
	159,
	169,
	41,
	165,
	102,
	192,
	10,
	176,
	106,
	170,
	8,
	127,
	10,
	220,
	53,
	224,
	108,
	112,
	174,
	185,
	118,
	1,
	220,
	119,
	128,
	119,
	129,
	203,
	166,
	10,
	221,
	106,
	182,
	226,
	248,
	67,
	224,
	99,
	224,
	147,
	224,
	115,
	224,
	243,
	38,
	204,
	77,
	198,
	253,
	50,
	220,
	175,
	130,
	27,
	88,
	186,
	223,
	192,
	249,
	190,
	41,
	127,
	222,
	126,
	16,
	184,
	31,
	195,
	79,
	16,
	199,
	253,
	224,
	0,
	56,
	8,
	158,
	48,
	229,
	210,
	247,
	158,
	132,
	251,
	87,
	240,
	15,
	240,
	178,
	185,
	246,
	42,
	220,
	241,
	14,
	234,
	32,
	88,
	218,
	9,
	199,
	127,
	36,
	252,
	28,
	215,
	41,
	226,
	60,
	17,
	238,
	106,
	112,
	22,
	88,
	15,
	214,
	153,
	180,
	54,
	224,
	248,
	12,
	19,
	215,
	219,
	140,
	95,
	205,
	197,
	236,
	152,
	179,
	9,
	215,
	47,
	5,
	151,
	89,
	247,
	183,
	58,
	252,
	19,
	31,
	49,
	105,
	159,
	205,
	244,
	230,
	243,
	207,
	253,
	229,
	162,
	227,
	248,
	48,
	210,
	188,
	10,
	92,
	13,
	118,
	116,
	226,
	227,
	223,
	105,
	233,
	247,
	76,
	193,
	207,
	46,
	248,
	185,
	5,
	236,
	238,
	20,
	245,
	109,
	15,
	139,
	127,
	169,
	71,
	31,
	123,
	113,
	111,
	63,
	184,
	27,
	220,
	235,
	176,
	163,
	212,
	254,
	31,
	232,
	12,
	203,
	245,
	8,
	142,
	31,
	3,
	127,
	0,
	79,
	155,
	180,
	244,
	241,
	223,
	204,
	241,
	99,
	1,
	123,
	84,
	161,
	223,
	17,
	35,
	94,
	143,
	140,
	218,
	207,
	136,
	17,
	35,
	70,
	140,
	24,
	49,
	98,
	196,
	136,
	215,
	2,
	235,
	58,
	195,
	53,
	129,
	27,
	34,
	252,
	255,
	147,
	205,
	93,
	255,
	101,
	205,
	99,
	191,
	24,
	17,
	254,
	63,
	8,
	51,
	209,
	45,
	214,
	97,
	6,
	112,
	151,
	131,
	21,
	224,
	56,
	112,
	154,
	185,
	254,
	38,
	184,
	235,
	187,
	133,
	255,
	13,
	112,
	207,
	7,
	111,
	7,
	239,
	52,
	247,
	223,
	11,
	119,
	11,
	216,
	102,
	206,
	183,
	195,
	221,
	1,
	118,
	118,
	221,
	233,
	106,
	127,
	187,
	60,
	247,
	71,
	140,
	24,
	49,
	98,
	68,
	189,
	156,
	211,
	50,
	109,
	151,
	127,
	196,
	136,
	17,
	245,
	80,
	119,
	251,
	254,
	18,
	198,
	143,
	183,
	119,
	139,
	247,
	66,
	119,
	192,
	253,
	150,
	48,
	158,
	252,
	78,
	183,
	120,
	183,
	175,
	143,
	239,
	177,
	238,
	223,
	183,
	8,
	198,
	159,
	127,
	159,
	46,
	152,
	94,
	170,
	212,
	37,
	224,
	145,
	233,
	48,
	59,
	225,
	239,
	231,
	150,
	95,
	53,
	51,
	60,
	94,
	141,
	227,
	45,
	96,
	15,
	120,
	28,
	28,
	50,
	247,
	86,
	207,
	98,
	140,
	62,
	59,
	244,
	183,
	3,
	199,
	123,
	160,
	131,
	63,
	129,
	19,
	123,
	8,
	3,
	246,
	244,
	138,
	177,
	252,
	29,
	83,
	133,
	251,
	176,
	57,
	231,
	12,
	250,
	240,
	55,
	54,
	100,
	99,
	127,
	161,
	159,
	155,
	112,
	109,
	31,
	187,
	254,
	60,
	142,
	215,
	14,
	148,
	186,
	18,
	236,
	3,
	207,
	131,
	181,
	211,
	237,
	63,
	127,
	218,
	38,
	212,
	94,
	30,
	132,
	238,
	14,
	152,
	122,
	122,
	16,
	238,
	227,
	198,
	94,
	122,
	158,
	248,
	108,
	55,
	253,
	121,
	186,
	223,
	184,
	103,
	70,
	250,
	231,
	188,
	152,
	145,
	158,
	212,
	39,
	72,
	225,
	95,
	70,
	220,
	175,
	118,
	231,
	251,
	163,
	252,
	238,
	247,
	164,
	55,
	142,
	250,
	217,
	3,
	115,
	189,
	97,
	217,
	180,
	191,
	163,
	112,
	126,
	108,
	175,
	56,
	63,
	185,
	55,
	244,
	127,
	122,
	111,
	126,
	62,
	98,
	251,
	171,
	88,
	91,
	186,
	202,
	247,
	230,
	158,
	124,
	239,
	173,
	184,
	190,
	1,
	92,
	4,
	54,
	130,
	205,
	224,
	61,
	224,
	73,
	115,
	255,
	253,
	56,
	190,
	2,
	92,
	5,
	174,
	54,
	247,
	63,
	3,
	174,
	3,
	55,
	130,
	91,
	193,
	237,
	44,
	238,
	59,
	113,
	188,
	23,
	236,
	3,
	63,
	4,
	63,
	5,
	247,
	131,
	3,
	224,
	160,
	144,
	7,
	61,
	15,
	127,
	2,
	215,
	255,
	108,
	238,
	233,
	253,
	52,
	207,
	225,
	248,
	37,
	193,
	47,
	249,
	255,
	55,
	238,
	141,
	245,
	135,
	231,
	61,
	28,
	207,
	129,
	163,
	251,
	197,
	249,
	73,
	253,
	98,
	111,
	137,
	190,
	191,
	6,
	199,
	103,
	247,
	221,
	58,
	211,
	254,
	207,
	237,
	203,
	58,
	115,
	233,
	253,
	2,
	248,
	191,
	24,
	108,
	2,
	151,
	130,
	203,
	192,
	86,
	147,
	246,
	182,
	126,
	209,
	102,
	98,
	237,
	182,
	29,
	254,
	63,
	5,
	174,
	1,
	215,
	129,
	235,
	193,
	205,
	44,
	63,
	183,
	225,
	248,
	43,
	224,
	235,
	224,
	46,
	240,
	93,
	86,
	182,
	16,
	63,
	242,
	148,
	251,
	81,
	228,
	241,
	103,
	253,
	118,
	158,
	57,
	46,
	93,
	63,
	20,
	200,
	207,
	98,
	234,
	43,
	171,
	212,
	65,
	27,
	233,
	255,
	178,
	63,
	63,
	222,
	131,
	70,
	247,
	191,
	133,
	251,
	199,
	126,
	185,
	124,
	198,
	150,
	227,
	105,
	79,
	187,
	179,
	211,
	191,
	171,
	226,
	242,
	47,
	198,
	250,
	85,
	133,
	253,
	203,
	212,
	147,
	182,
	203,
	151,
	90,
	254,
	231,
	250,
	205,
	230,
	219,
	183,
	143,
	106,
	175,
	89,
	55,
	127,
	169,
	95,
	184,
	135,
	224,
	42,
	140,
	49,
	167,
	6,
	197,
	249,
	244,
	96,
	232,
	247,
	136,
	129,
	92,
	54,
	186,
	191,
	166,
	35,
	151,
	171,
	238,
	250,
	31,
	34,
	180,
	151,
	44,
	102,
	175,
	217,
	202,
	65,
	225,
	30,
	15,
	247,
	180,
	193,
	225,
	81,
	239,
	108,
	253,
	135,
	238,
	159,
	46,
	216,
	55,
	20,
	239,
	67,
	194,
	216,
	118,
	177,
	17,
	219,
	239,
	220,
	208,
	96,
	94,
	206,
	26,
	204,
	191,
	118,
	77,
	70,
	254,
	207,
	153,
	136,
	171,
	135,
	186,
	14,
	191,
	133,
	181,
	99,
	189,
	191,
	115,
	3,
	206,
	207,
	31,
	20,
	237,
	127,
	29,
	219,
	111,
	121,
	177,
	241,
	55,
	48,
	249,
	219,
	4,
	247,
	210,
	65,
	177,
	239,
	246,
	114,
	184,
	31,
	20,
	234,
	136,
	175,
	237,
	172,
	142,
	216,
	203,
	153,
	139,
	206,
	251,
	149,
	131,
	249,
	215,
	248,
	222,
	213,
	231,
	80,
	55,
	175,
	232,
	12,
	203,
	254,
	9,
	227,
	126,
	22,
	238,
	93,
	157,
	97,
	254,
	79,
	101,
	97,
	174,
	53,
	126,
	174,
	135,
	123,
	179,
	16,
	247,
	173,
	184,
	182,
	59,
	177,
	157,
	180,
	205,
	49,
	19,
	99,
	106,
	49,
	200,
	24,
	99,
	220,
	58,
	231,
	126,
	200,
	157,
	96,
	247,
	151,
	68,
	98,
	199,
	167,
	28,
	215,
	234,
	150,
	197,
	161,
	241,
	145,
	144,
	80,
	93,
	26,
	23,
	32,
	91,
	141,
	11,
	225,
	198,
	45,
	119,
	210,
	64,
	18,
	83,
	183,
	234,
	174,
	11,
	19,
	53,
	199,
	95,
	181,
	76,
	181,
	157,
	129,
	18,
	18,
	99,
	203,
	215,
	83,
	219,
	151,
	218,
	204,
	235,
	73,
	198,
	28,
	44,
	6,
	177,
	243,
	193,
	251,
	188,
	195,
	93,
	164,
	49,
	131,
	125,
	124,
	184,
	72,
	110,
	157,
	145,
	198,
	82,
	57,
	246,
	181,
	245,
	119,
	56,
	233,
	176,
	169,
	118,
	23,
	27,
	119,
	138,
	238,
	171,
	110,
	135,
	220,
	246,
	174,
	126,
	41,
	196,
	107,
	93,
	92,
	243,
	14,
	126,
	191,
	10,
	187,
	228,
	234,
	159,
	242,
	212,
	97,
	96,
	26,
	27,
	61,
	255,
	169,
	154,
	30,
	48,
	75,
	130,
	255,
	63,
	215,
	199,
	211,
	198,
	93,
	106,
	209,
	179,
	232,
	91,
	204,
	176,
	176,
	84,
	198,
	89,
	166,
	179,
	30,
	139,
	43,
	54,
	127,
	228,
	63,
	103,
	158,
	168,
	74,
	232,
	101,
	130,
	217,
	166,
	27,
	25,
	151,
	178,
	252,
	217,
	231,
	169,
	132,
	194,
	42,
	53,
	63,
	29,
	201,
	63,
	73,
	140,
	125,
	73,
	166,
	13,
	246,
	185,
	182,
	111,
	76,
	31,
	210,
	23,
	174,
	185,
	202,
	100,
	167,
	157,
	170,
	163,
	80,
	123,
	166,
	251,
	84,
	39,
	248,
	220,
	142,
	183,
	63,
	95,
	218,
	190,
	178,
	228,
	228,
	57,
	213,
	190,
	161,
	99,
	45,
	3,
	227,
	74,
	246,
	181,
	133,
	218,
	175,
	125,
	62,
	99,
	249,
	155,
	85,
	126,
	137,
	169,
	143,
	161,
	48,
	46,
	180,
	93,
	150,
	169,
	162,
	29,
	210,
	252,
	119,
	78,
	165,
	61,
	195,
	98,
	237,
	235,
	179,
	73,
	74,
	158,
	171,
	178,
	111,
	110,
	251,
	37,
	155,
	242,
	62,
	90,
	169,
	249,
	253,
	115,
	85,
	82,
	182,
	253,
	210,
	88,
	54,
	148,
	6,
	127,
	78,
	46,
	99,
	40,
	117,
	248,
	244,
	207,
	169,
	246,
	165,
	103,
	107,
	78,
	255,
	28,
	18,
	187,
	237,
	219,
	58,
	176,
	243,
	153,
	107,
	223,
	113,
	53,
	191,
	124,
	185,
	162,
	109,
	28,
	122,
	150,
	75,
	229,
	112,
	233,
	92,
	242,
	171,
	4,
	255,
	46,
	127,
	174,
	116,
	164,
	235,
	177,
	117,
	136,
	11,
	181,
	85,
	62,
	190,
	226,
	50,
	173,
	230,
	219,
	159,
	159,
	199,
	182,
	111,
	233,
	249,
	236,
	146,
	156,
	114,
	72,
	107,
	176,
	161,
	181,
	9,
	222,
	150,
	187,
	230,
	60,
	181,
	253,
	165,
	228,
	55,
	167,
	61,
	167,
	234,
	65,
	159,
	251,
	198,
	203,
	74,
	45,
	236,
	171,
	249,
	121,
	200,
	158,
	52,
	158,
	150,
	244,
	96,
	75,
	217,
	246,
	236,
	147,
	208,
	51,
	153,
	250,
	2,
	110,
	227,
	152,
	177,
	188,
	84,
	174,
	166,
	236,
	235,
	242,
	75,
	98,
	247,
	215,
	117,
	216,
	87,
	106,
	255,
	182,
	216,
	121,
	45,
	99,
	223,
	55,
	24,
	114,
	132,
	143,
	181,
	82,
	158,
	199,
	85,
	183,
	191,
	28,
	200,
	30,
	100,
	79,
	27,
	174,
	211,
	80,
	255,
	187,
	92,
	201,
	125,
	28,
	159,
	255,
	199,
	216,
	180,
	206,
	246,
	74,
	98,
	175,
	149,
	72,
	235,
	38,
	41,
	246,
	204,
	201,
	91,
	213,
	182,
	140,
	141,
	83,
	169,
	249,
	121,
	137,
	205,
	175,
	212,
	102,
	121,
	93,
	161,
	186,
	68,
	54,
	91,
	202,
	252,
	76,
	59,
	240,
	213,
	135,
	84,
	157,
	82,
	62,
	114,
	214,
	250,
	218,
	104,
	123,
	62,
	219,
	244,
	216,
	53,
	123,
	237,
	73,
	26,
	23,
	147,
	140,
	43,
	127,
	220,
	58,
	124,
	71,
	45,
	156,
	91,
	116,
	204,
	189,
	178,
	251,
	17,
	108,
	125,
	42,
	203,
	205,
	173,
	179,
	57,
	58,
	140,
	137,
	155,
	252,
	196,
	234,
	91,
	159,
	207,
	177,
	176,
	190,
	114,
	145,
	216,
	250,
	86,
	204,
	77,
	41,
	191,
	203,
	191,
	22,
	251,
	157,
	127,
	46,
	227,
	204,
	181,
	199,
	172,
	174,
	49,
	109,
	213,
	246,
	211,
	113,
	78,
	90,
	46,
	205,
	123,
	37,
	137,
	181,
	113,
	157,
	216,
	194,
	215,
	140,
	93,
	107,
	200,
	54,
	52,
	134,
	224,
	231,
	29,
	53,
	92,
	3,
	246,
	149,
	247,
	136,
	4,
	84,
	162,
	255,
	58,
	208,
	18,
	154,
	43,
	77,
	122,
	238,
	241,
	240,
	174,
	122,
	44,
	181,
	9,
	73,
	234,
	174,
	27,
	41,
	72,
	207,
	82,
	205,
	180,
	146,
	235,
	139,
	94,
	167,
	212,
	117,
	102,
	198,
	92,
	59,
	18,
	172,
	80,
	69,
	31,
	53,
	151,
	152,
	182,
	189,
	47,
	141,
	142,
	67,
	121,
	117,
	189,
	215,
	152,
	83,
	243,
	243,
	209,
	87,
	195,
	49,
	149,
	29,
	71,
	87,
	128,
	199,
	101,
	151,
	61,
	71,
	183,
	115,
	106,
	56,
	22,
	161,
	120,
	164,
	116,
	187,
	70,
	175,
	75,
	132,
	124,
	248,
	160,
	176,
	100,
	191,
	54,
	246,
	35,
	72,
	117,
	188,
	237,
	119,
	163,
	161,
	118,
	94,
	133,
	158,
	248,
	94,
	183,
	42,
	165,
	14,
	29,
	229,
	62,
	95,
	236,
	107,
	188,
	127,
	168,
	59,
	125,
	9,
	158,
	126,
	138,
	142,
	170,
	78,
	63,
	85,
	170,
	208,
	191,
	106,
	56,
	253,
	80,
	222,
	180,
	240,
	231,
	134,
	52,
	118,
	117,
	205,
	193,
	8,
	26,
	127,
	244,
	213,
	112,
	236,
	161,
	159,
	193,
	43,
	85,
	49,
	254,
	154,
	100,
	208,
	26,
	142,
	62,
	182,
	219,
	136,
	253,
	28,
	38,
	91,
	165,
	150,
	191,
	46,
	241,
	245,
	129,
	77,
	244,
	139,
	250,
	185,
	90,
	117,
	29,
	72,
	209,
	41,
	175,
	27,
	246,
	120,
	131,
	176,
	199,
	106,
	92,
	142,
	50,
	204,
	178,
	99,
	155,
	163,
	77,
	60,
	147,
	66,
	120,
	187,
	175,
	79,
	221,
	223,
	80,
	117,
	187,
	41,
	91,
	247,
	114,
	211,
	205,
	13,
	111,
	195,
	215,
	169,
	202,
	230,
	143,
	75,
	236,
	115,
	187,
	110,
	234,
	172,
	3,
	212,
	14,
	104,
	45,
	138,
	247,
	83,
	117,
	214,
	75,
	26,
	163,
	235,
	246,
	181,
	210,
	112,
	140,
	146,
	231,
	73,
	51,
	44,
	111,
	174,
	246,
	202,
	231,
	152,
	212,
	174,
	165,
	62,
	94,
	90,
	255,
	33,
	168,
	189,
	242,
	54,
	59,
	153,
	80,
	38,
	151,
	148,
	13,
	31,
	26,
	183,
	214,
	61,
	166,
	229,
	58,
	210,
	118,
	106,
	122,
	207,
	154,
	126,
	246,
	74,
	115,
	66,
	123,
	93,
	65,
	178,
	53,
	61,
	167,
	235,
	232,
	143,
	66,
	235,
	72,
	49,
	172,
	2,
	199,
	26,
	215,
	69,
	234,
	220,
	161,
	45,
	59,
	113,
	120,
	27,
	150,
	250,
	24,
	106,
	203,
	51,
	204,
	95,
	221,
	245,
	198,
	94,
	171,
	39,
	151,
	250,
	159,
	152,
	119,
	110,
	90,
	108,
	91,
	187,
	202,
	110,
	247,
	65,
	124,
	189,
	96,
	165,
	135,
	227,
	12,
	186,
	239,
	161,
	189,
	93,
	174,
	180,
	83,
	250,
	103,
	46,
	49,
	253,
	78,
	172,
	148,
	157,
	91,
	243,
	254,
	69,
	251,
	159,
	117,
	64,
	126,
	164,
	235,
	93,
	79,
	56,
	105,
	47,
	155,
	116,
	141,
	242,
	171,
	227,
	163,
	247,
	161,
	180,
	31,
	65,
	211,
	198,
	183,
	88,
	210,
	248,
	49,
	36,
	199,
	131,
	19,
	216,
	249,
	132,
	131,
	88,
	251,
	216,
	235,
	97,
	169,
	246,
	77,
	89,
	127,
	137,
	185,
	158,
	26,
	183,
	253,
	172,
	76,
	9,
	167,
	229,
	196,
	136,
	50,
	166,
	72,
	142,
	77,
	41,
	156,
	61,
	62,
	105,
	66,
	58,
	97,
	47,
	94,
	145,
	214,
	172,
	165,
	107,
	41,
	241,
	197,
	132,
	11,
	173,
	157,
	75,
	174,
	148,
	78,
	74,
	190,
	202,
	150,
	163,
	202,
	245,
	210,
	148,
	252,
	248,
	198,
	20,
	33,
	155,
	249,
	236,
	235,
	10,
	87,
	5,
	82,
	57,
	235,
	72,
	199,
	55,
	214,
	138,
	145,
	212,
	248,
	234,
	202,
	111,
	89,
	63,
	117,
	234,
	179,
	141,
	116,
	115,
	108,
	25,
	35,
	109,
	151,
	161,
	233,
	242,
	134,
	164,
	77,
	91,
	164,
	164,
	95,
	103,
	221,
	77,
	201,
	199,
	68,
	205,
	121,
	246,
	233,
	221,
	30,
	35,
	150,
	213,
	95,
	21,
	250,
	111,
	66,
	66,
	105,
	53,
	161,
	255,
	166,
	236,
	156,
	163,
	239,
	170,
	109,
	147,
	243,
	238,
	193,
	53,
	47,
	112,
	197,
	25,
	90,
	47,
	115,
	133,
	207,
	45,
	67,
	206,
	220,
	66,
	242,
	175,
	50,
	226,
	74,
	153,
	143,
	133,
	164,
	201,
	126,
	167,
	137,
	250,
	222,
	180,
	62,
	36,
	225,
	246,
	201,
	205,
	91,
	110,
	185,
	234,
	234,
	67,
	67,
	229,
	173,
	202,
	14,
	174,
	120,
	154,
	174,
	7,
	177,
	210,
	84,
	251,
	41,
	91,
	214,
	182,
	242,
	80,
	214,
	38,
	139,
	161,
	111,
	168,
	178,
	191,
	181,
	227,
	77,
	245,
	75,
	235,
	184,
	246,
	190,
	48,
	233,
	189,
	71,
	204,
	183,
	85,
	101,
	224,
	107,
	220,
	180,
	198,
	158,
	171,
	251,
	216,
	112,
	85,
	151,
	33,
	245,
	121,
	42,
	237,
	215,
	107,
	18,
	189,
	231,
	81,
	250,
	118,
	197,
	133,
	174,
	23,
	49,
	107,
	122,
	84,
	254,
	156,
	247,
	11,
	92,
	92,
	239,
	91,
	83,
	113,
	165,
	227,
	26,
	59,
	73,
	109,
	130,
	35,
	237,
	65,
	230,
	239,
	12,
	82,
	203,
	31,
	131,
	253,
	222,
	210,
	126,
	151,
	201,
	223,
	3,
	233,
	125,
	36,
	41,
	223,
	107,
	82,
	217,
	219,
	124,
	87,
	107,
	67,
	239,
	224,
	92,
	123,
	122,
	233,
	61,
	173,
	222,
	11,
	160,
	235,
	241,
	73,
	106,
	248,
	175,
	137,
	220,
	113,
	111,
	110,
	125,
	245,
	217,
	155,
	246,
	69,
	212,
	173,
	175,
	216,
	52,
	164,
	253,
	15,
	252,
	29,
	56,
	93,
	179,
	247,
	67,
	199,
	8,
	79,
	103,
	101,
	68,
	94,
	168,
	174,
	74,
	225,
	99,
	244,
	111,
	219,
	177,
	106,
	29,
	242,
	245,
	12,
	254,
	60,
	209,
	247,
	232,
	253,
	94,
	149,
	237,
	164,
	199,
	92,
	178,
	131,
	109,
	55,
	87,
	56,
	234,
	231,
	200,
	109,
	82,
	114,
	244,
	175,
	235,
	26,
	175,
	123,
	125,
	37,
	63,
	55,
	105,
	143,
	126,
	140,
	240,
	248,
	165,
	111,
	226,
	249,
	190,
	189,
	49,
	19,
	119,
	93,
	223,
	73,
	214,
	33,
	246,
	120,
	230,
	228,
	146,
	196,
	174,
	49,
	248,
	36,
	102,
	77,
	66,
	186,
	23,
	242,
	235,
	74,
	199,
	231,
	143,
	230,
	142,
	117,
	140,
	175,
	165,
	124,
	140,
	43,
	191,
	206,
	164,
	117,
	163,
	148,
	52,
	236,
	107,
	74,
	201,
	186,
	110,
	74,
	236,
	250,
	103,
	143,
	177,
	125,
	115,
	237,
	42,
	210,
	171,
	107,
	238,
	148,
	35,
	139,
	101,
	253,
	160,
	204,
	28,
	86,
	178,
	95,
	153,
	185,
	112,
	83,
	101,
	118,
	73,
	93,
	235,
	18,
	77,
	216,
	184,
	238,
	58,
	93,
	119,
	252,
	49,
	250,
	208,
	207,
	78,
	251,
	27,
	108,
	223,
	183,
	32,
	228,
	143,
	246,
	106,
	133,
	198,
	107,
	246,
	121,
	93,
	144,
	232,
	57,
	202,
	64,
	45,
	220,
	107,
	167,
	37,
	180,
	119,
	52,
	102,
	44,
	81,
	245,
	154,
	125,
	221,
	237,
	179,
	206,
	119,
	11,
	135,
	75,
	30,
	154,
	78,
	51,
	165,
	156,
	124,
	206,
	66,
	251,
	20,
	155,
	104,
	47,
	246,
	28,
	198,
	181,
	31,
	219,
	245,
	189,
	119,
	104,
	94,
	111,
	203,
	41,
	37,
	105,
	98,
	30,
	112,
	170,
	106,
	255,
	95,
	174,
	210,
	127,
	1,
	237,
	61,
	207,
	90,
	247,
	186,
	127,
	147,
	198,
	237,
	210,
	26,
	91,
	91,
	72,
	245,
	74,
	250,
	246,
	155,
	238,
	209,
	119,
	223,
	42,
	33,
	13,
	105,
	189,
	33,
	118,
	239,
	119,
	74,
	58,
	49,
	216,
	54,
	105,
	58,
	125,
	223,
	63,
	37,
	125,
	237,
	88,
	135,
	93,
	110,
	80,
	106,
	161,
	78,
	105,
	239,
	58,
	217,
	42,
	119,
	125,
	78,
	154,
	99,
	86,
	173,
	3,
	74,
	43,
	86,
	170,
	76,
	51,
	215,
	102,
	246,
	123,
	22,
	251,
	191,
	8,
	218,
	70,
	244,
	191,
	76,
	87,
	127,
	75,
	239,
	0,
	98,
	242,
	40,
	249,
	43,
	171,
	139,
	148,
	240,
	190,
	246,
	81,
	117,
	93,
	72,
	65,
	235,
	208,
	215,
	255,
	18,
	3,
	229,
	30,
	31,
	151,
	173,
	163,
	185,
	255,
	95,
	83,
	158,
	243,
	170,
	109,
	105,
	167,
	229,
	242,
	67,
	227,
	112,
	94,
	207,
	237,
	111,
	119,
	120,
	63,
	93,
	230,
	127,
	168,
	74,
	249,
	251,
	124,
	87,
	187,
	35,
	241,
	189,
	171,
	82,
	1,
	127,
	41,
	82,
	71,
	189,
	77,
	233,
	247,
	237,
	247,
	134,
	84,
	215,
	200,
	78,
	92,
	164,
	126,
	38,
	165,
	14,
	241,
	254,
	62,
	229,
	219,
	203,
	178,
	101,
	165,
	49,
	6,
	255,
	86,
	139,
	254,
	9,
	64,
	229,
	165,
	49,
	148,
	157,
	215,
	144,
	148,
	109,
	223,
	117,
	149,
	157,
	68,
	250,
	15,
	130,
	93,
	230,
	152,
	57,
	108,
	46,
	118,
	158,
	203,
	254,
	23,
	222,
	213,
	110,
	83,
	234,
	58,
	47,
	127,
	207,
	202,
	111,
	170,
	148,
	181,
	127,
	142,
	78,
	171,
	148,
	20,
	93,
	243,
	127,
	120,
	133,
	158,
	137,
	118,
	123,
	170,
	34,
	253,
	178,
	144,
	232,
	119,
	165,
	250,
	189,
	233,
	105,
	42,
	252,
	79,
	42,
	187,
	108,
	101,
	243,
	207,
	237,
	56,
	158,
	17,
	222,
	215,
	230,
	165,
	177,
	162,
	221,
	206,
	83,
	243,
	159,
	91,
	206,
	170,
	251,
	49,
	187,
	13,
	211,
	120,
	136,
	230,
	43,
	84,
	54,
	62,
	94,
	104,
	66,
	150,
	168,
	133,
	255,
	40,
	144,
	144,
	254,
	33,
	86,
	53,
	147,
	38,
	29,
	123,
	60,
	162,
	245,
	164,
	231,
	114,
	115,
	22,
	174,
	111,
	62,
	233,
	122,
	204,
	56,
	203,
	87,
	126,
	169,
	95,
	182,
	243,
	188,
	220,
	193,
	209,
	137,
	80,
	57,
	151,
	169,
	133,
	107,
	81,
	75,
	148,
	251,
	121,
	228,
	170,
	243,
	77,
	244,
	71,
	190,
	255,
	30,
	240,
	181,
	119,
	187,
	77,
	243,
	118,
	109,
	247,
	41,
	109,
	172,
	55,
	112,
	73,
	29,
	23,
	198,
	198,
	93,
	230,
	95,
	140,
	190,
	251,
	212,
	215,
	243,
	61,
	141,
	41,
	227,
	248,
	216,
	122,
	20,
	242,
	91,
	6,
	87,
	127,
	195,
	165,
	199,
	92,
	126,
	76,
	101,
	229,
	235,
	57,
	244,
	191,
	235,
	152,
	61,
	69,
	57,
	117,
	36,
	38,
	188,
	114,
	28,
	215,
	217,
	22,
	125,
	255,
	121,
	87,
	74,
	30,
	63,
	86,
	165,
	159,
	16,
	19,
	106,
	225,
	191,
	54,
	98,
	218,
	122,
	155,
	239,
	80,
	171,
	24,
	171,
	214,
	53,
	254,
	173,
	243,
	221,
	79,
	91,
	239,
	177,
	104,
	76,
	233,
	179,
	219,
	152,
	227,
	122,
	19,
	82,
	231,
	60,
	38,
	86,
	236,
	189,
	42,
	169,
	123,
	48,
	154,
	218,
	159,
	208,
	196,
	30,
	149,
	152,
	248,
	155,
	42,
	243,
	98,
	220,
	239,
	33,
	137,
	148,
	70,
	91,
	237,
	169,
	170,
	114,
	199,
	232,
	51,
	69,
	247,
	116,
	92,
	247,
	218,
	133,
	84,
	142,
	170,
	227,
	40,
	27,
	231,
	98,
	108,
	23,
	101,
	227,
	168,
	178,
	125,
	214,
	213,
	214,
	171,
	212,
	91,
	217,
	188,
	248,
	164,
	238,
	116,
	203,
	228,
	205,
	151,
	191,
	166,
	164,
	201,
	250,
	149,
	147,
	126,
	85,
	249,
	207,
	13,
	95,
	85,
	250,
	49,
	233,
	148,
	213,
	115,
	200,
	111,
	29,
	249,
	78,
	73,
	191,
	142,
	184,
	109,
	73,
	177,
	157,
	36,
	185,
	245,
	192,
	37,
	255,
	3
];
var trieData = {
	type: type,
	data: data
};

var categories = useData.categories,
    decompositions = useData.decompositions;
var trie = new (unicode_trie__WEBPACK_IMPORTED_MODULE_4___default())(new Uint8Array(trieData.data));
var stateMachine = new dfa(useData);
/**
 * This shaper is an implementation of the Universal Shaping Engine, which
 * uses Unicode data to shape a number of scripts without a dedicated shaping engine.
 * See https://www.microsoft.com/typography/OpenTypeDev/USE/intro.htm.
 */

var UniversalShaper = /*#__PURE__*/function (_DefaultShaper) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(UniversalShaper, _DefaultShaper);

  function UniversalShaper() {
    return _DefaultShaper.apply(this, arguments) || this;
  }

  UniversalShaper.planFeatures = function planFeatures(plan) {
    plan.addStage(setupSyllables); // Default glyph pre-processing group

    plan.addStage(['locl', 'ccmp', 'nukt', 'akhn']); // Reordering group

    plan.addStage(clearSubstitutionFlags);
    plan.addStage(['rphf'], false);
    plan.addStage(recordRphf);
    plan.addStage(clearSubstitutionFlags);
    plan.addStage(['pref']);
    plan.addStage(recordPref); // Orthographic unit shaping group

    plan.addStage(['rkrf', 'abvf', 'blwf', 'half', 'pstf', 'vatu', 'cjct']);
    plan.addStage(reorder); // Topographical features
    // Scripts that need this are handled by the Arabic shaper, not implemented here for now.
    // plan.addStage(['isol', 'init', 'medi', 'fina', 'med2', 'fin2', 'fin3'], false);
    // Standard topographic presentation and positional feature application

    plan.addStage(['abvs', 'blws', 'pres', 'psts', 'dist', 'abvm', 'blwm']);
  };

  UniversalShaper.assignFeatures = function assignFeatures(plan, glyphs) {
    var _loop = function _loop(i) {
      var codepoint = glyphs[i].codePoints[0];

      if (decompositions[codepoint]) {
        var decomposed = decompositions[codepoint].map(function (c) {
          var g = plan.font.glyphForCodePoint(c);
          return new GlyphInfo(plan.font, g.id, [c], glyphs[i].features);
        });
        glyphs.splice.apply(glyphs, [i, 1].concat(decomposed));
      }
    };

    // Decompose split vowels
    // TODO: do this in a more general unicode normalizer
    for (var i = glyphs.length - 1; i >= 0; i--) {
      _loop(i);
    }
  };

  return UniversalShaper;
}(DefaultShaper);

UniversalShaper.zeroMarkWidths = 'BEFORE_GPOS';

function useCategory(glyph) {
  return trie.get(glyph.codePoints[0]);
}

var USEInfo = function USEInfo(category, syllableType, syllable) {
  this.category = category;
  this.syllableType = syllableType;
  this.syllable = syllable;
};

function setupSyllables(font, glyphs) {
  var syllable = 0;

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(stateMachine.match(glyphs.map(useCategory))), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        start = _step$value[0],
        end = _step$value[1],
        tags = _step$value[2];
    ++syllable; // Create shaper info

    for (var i = start; i <= end; i++) {
      glyphs[i].shaperInfo = new USEInfo(categories[useCategory(glyphs[i])], tags[0], syllable);
    } // Assign rphf feature


    var limit = glyphs[start].shaperInfo.category === 'R' ? 1 : Math.min(3, end - start);

    for (var _i = start; _i < start + limit; _i++) {
      glyphs[_i].features.rphf = true;
    }
  }
}

function clearSubstitutionFlags(font, glyphs) {
  for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphs), _step2; !(_step2 = _iterator2()).done;) {
    var glyph = _step2.value;
    glyph.substituted = false;
  }
}

function recordRphf(font, glyphs) {
  for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphs), _step3; !(_step3 = _iterator3()).done;) {
    var glyph = _step3.value;

    if (glyph.substituted && glyph.features.rphf) {
      // Mark a substituted repha.
      glyph.shaperInfo.category = 'R';
    }
  }
}

function recordPref(font, glyphs) {
  for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyphs), _step4; !(_step4 = _iterator4()).done;) {
    var glyph = _step4.value;

    if (glyph.substituted) {
      // Mark a substituted pref as VPre, as they behave the same way.
      glyph.shaperInfo.category = 'VPre';
    }
  }
}

function reorder(font, glyphs) {
  var dottedCircle = font.glyphForCodePoint(0x25cc).id;

  for (var start = 0, end = nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable(glyphs, start)) {
    var i = void 0,
        j = void 0;
    var info = glyphs[start].shaperInfo;
    var type = info.syllableType; // Only a few syllable types need reordering.

    if (type !== 'virama_terminated_cluster' && type !== 'standard_cluster' && type !== 'broken_cluster') {
      continue;
    } // Insert a dotted circle glyph in broken clusters.


    if (type === 'broken_cluster' && dottedCircle) {
      var g = new GlyphInfo(font, dottedCircle, [0x25cc]);
      g.shaperInfo = info; // Insert after possible Repha.

      for (i = start; i < end && glyphs[i].shaperInfo.category === 'R'; i++) {
      }

      glyphs.splice(++i, 0, g);
      end++;
    } // Move things forward.


    if (info.category === 'R' && end - start > 1) {
      // Got a repha. Reorder it to after first base, before first halant.
      for (i = start + 1; i < end; i++) {
        info = glyphs[i].shaperInfo;

        if (isBase(info) || isHalant(glyphs[i])) {
          // If we hit a halant, move before it; otherwise it's a base: move to it's
          // place, and shift things in between backward.
          if (isHalant(glyphs[i])) {
            i--;
          }

          glyphs.splice.apply(glyphs, [start, 0].concat(glyphs.splice(start + 1, i - start), [glyphs[i]]));
          break;
        }
      }
    } // Move things back.


    for (i = start, j = end; i < end; i++) {
      info = glyphs[i].shaperInfo;

      if (isBase(info) || isHalant(glyphs[i])) {
        // If we hit a halant, move after it; otherwise it's a base: move to it's
        // place, and shift things in between backward.
        j = isHalant(glyphs[i]) ? i + 1 : i;
      } else if ((info.category === 'VPre' || info.category === 'VMPre') && j < i) {
        glyphs.splice.apply(glyphs, [j, 1, glyphs[i]].concat(glyphs.splice(j, i - j)));
      }
    }
  }
}

function nextSyllable(glyphs, start) {
  if (start >= glyphs.length) return start;
  var syllable = glyphs[start].shaperInfo.syllable;

  while (++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable) {
  }

  return start;
}

function isHalant(glyph) {
  return glyph.shaperInfo.category === 'H' && !glyph.isLigated;
}

function isBase(info) {
  return info.category === 'B' || info.category === 'GB';
}

var SHAPERS = {
  arab: ArabicShaper,
  // Arabic
  mong: ArabicShaper,
  // Mongolian
  syrc: ArabicShaper,
  // Syriac
  'nko ': ArabicShaper,
  // N'Ko
  phag: ArabicShaper,
  // Phags Pa
  mand: ArabicShaper,
  // Mandaic
  mani: ArabicShaper,
  // Manichaean
  phlp: ArabicShaper,
  // Psalter Pahlavi
  hang: HangulShaper,
  // Hangul
  bng2: IndicShaper,
  // Bengali
  beng: IndicShaper,
  // Bengali
  dev2: IndicShaper,
  // Devanagari
  deva: IndicShaper,
  // Devanagari
  gjr2: IndicShaper,
  // Gujarati
  gujr: IndicShaper,
  // Gujarati
  guru: IndicShaper,
  // Gurmukhi
  gur2: IndicShaper,
  // Gurmukhi
  knda: IndicShaper,
  // Kannada
  knd2: IndicShaper,
  // Kannada
  mlm2: IndicShaper,
  // Malayalam
  mlym: IndicShaper,
  // Malayalam
  ory2: IndicShaper,
  // Oriya
  orya: IndicShaper,
  // Oriya
  taml: IndicShaper,
  // Tamil
  tml2: IndicShaper,
  // Tamil
  telu: IndicShaper,
  // Telugu
  tel2: IndicShaper,
  // Telugu
  khmr: IndicShaper,
  // Khmer
  bali: UniversalShaper,
  // Balinese
  batk: UniversalShaper,
  // Batak
  brah: UniversalShaper,
  // Brahmi
  bugi: UniversalShaper,
  // Buginese
  buhd: UniversalShaper,
  // Buhid
  cakm: UniversalShaper,
  // Chakma
  cham: UniversalShaper,
  // Cham
  dupl: UniversalShaper,
  // Duployan
  egyp: UniversalShaper,
  // Egyptian Hieroglyphs
  gran: UniversalShaper,
  // Grantha
  hano: UniversalShaper,
  // Hanunoo
  java: UniversalShaper,
  // Javanese
  kthi: UniversalShaper,
  // Kaithi
  kali: UniversalShaper,
  // Kayah Li
  khar: UniversalShaper,
  // Kharoshthi
  khoj: UniversalShaper,
  // Khojki
  sind: UniversalShaper,
  // Khudawadi
  lepc: UniversalShaper,
  // Lepcha
  limb: UniversalShaper,
  // Limbu
  mahj: UniversalShaper,
  // Mahajani
  // mand: UniversalShaper, // Mandaic
  // mani: UniversalShaper, // Manichaean
  mtei: UniversalShaper,
  // Meitei Mayek
  modi: UniversalShaper,
  // Modi
  // mong: UniversalShaper, // Mongolian
  // 'nko ': UniversalShaper, // N’Ko
  hmng: UniversalShaper,
  // Pahawh Hmong
  // phag: UniversalShaper, // Phags-pa
  // phlp: UniversalShaper, // Psalter Pahlavi
  rjng: UniversalShaper,
  // Rejang
  saur: UniversalShaper,
  // Saurashtra
  shrd: UniversalShaper,
  // Sharada
  sidd: UniversalShaper,
  // Siddham
  sinh: UniversalShaper,
  // Sinhala
  sund: UniversalShaper,
  // Sundanese
  sylo: UniversalShaper,
  // Syloti Nagri
  tglg: UniversalShaper,
  // Tagalog
  tagb: UniversalShaper,
  // Tagbanwa
  tale: UniversalShaper,
  // Tai Le
  lana: UniversalShaper,
  // Tai Tham
  tavt: UniversalShaper,
  // Tai Viet
  takr: UniversalShaper,
  // Takri
  tibt: UniversalShaper,
  // Tibetan
  tfng: UniversalShaper,
  // Tifinagh
  tirh: UniversalShaper,
  // Tirhuta
  latn: DefaultShaper,
  // Latin
  DFLT: DefaultShaper // Default

};
function choose(script) {
  if (!Array.isArray(script)) {
    script = [script];
  }

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(script), _step; !(_step = _iterator()).done;) {
    var s = _step.value;
    var shaper = SHAPERS[s];

    if (shaper) {
      return shaper;
    }
  }

  return DefaultShaper;
}

var GSUBProcessor = /*#__PURE__*/function (_OTProcessor) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(GSUBProcessor, _OTProcessor);

  function GSUBProcessor() {
    return _OTProcessor.apply(this, arguments) || this;
  }

  var _proto = GSUBProcessor.prototype;

  _proto.applyLookup = function applyLookup(lookupType, table) {
    var _this = this;

    switch (lookupType) {
      case 1:
        {
          // Single Substitution
          var index = this.coverageIndex(table.coverage);

          if (index === -1) {
            return false;
          }

          var glyph = this.glyphIterator.cur;

          switch (table.version) {
            case 1:
              glyph.id = glyph.id + table.deltaGlyphID & 0xffff;
              break;

            case 2:
              glyph.id = table.substitute.get(index);
              break;
          }

          return true;
        }

      case 2:
        {
          // Multiple Substitution
          var _index = this.coverageIndex(table.coverage);

          if (_index !== -1) {
            var _this$glyphs;

            var sequence = table.sequences.get(_index);

            if (sequence.length === 0) {
              // If the sequence length is zero, delete the glyph.
              // The OpenType spec disallows this, but seems like Harfbuzz and Uniscribe allow it.
              this.glyphs.splice(this.glyphIterator.index, 1);
              return true;
            }

            this.glyphIterator.cur.id = sequence[0];
            this.glyphIterator.cur.ligatureComponent = 0;
            var features = this.glyphIterator.cur.features;
            var curGlyph = this.glyphIterator.cur;
            var replacement = sequence.slice(1).map(function (gid, i) {
              var glyph = new GlyphInfo(_this.font, gid, undefined, features);
              glyph.shaperInfo = curGlyph.shaperInfo;
              glyph.isLigated = curGlyph.isLigated;
              glyph.ligatureComponent = i + 1;
              glyph.substituted = true;
              glyph.isMultiplied = true;
              return glyph;
            });

            (_this$glyphs = this.glyphs).splice.apply(_this$glyphs, [this.glyphIterator.index + 1, 0].concat(replacement));

            return true;
          }

          return false;
        }

      case 3:
        {
          // Alternate Substitution
          var _index2 = this.coverageIndex(table.coverage);

          if (_index2 !== -1) {
            var USER_INDEX = 0; // TODO

            this.glyphIterator.cur.id = table.alternateSet.get(_index2)[USER_INDEX];
            return true;
          }

          return false;
        }

      case 4:
        {
          // Ligature Substitution
          var _index3 = this.coverageIndex(table.coverage);

          if (_index3 === -1) {
            return false;
          }

          for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(table.ligatureSets.get(_index3)), _step; !(_step = _iterator()).done;) {
            var ligature = _step.value;
            var matched = this.sequenceMatchIndices(1, ligature.components);

            if (!matched) {
              continue;
            }

            var _curGlyph = this.glyphIterator.cur; // Concatenate all of the characters the new ligature will represent

            var characters = _curGlyph.codePoints.slice();

            for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(matched), _step2; !(_step2 = _iterator2()).done;) {
              var _index4 = _step2.value;
              characters.push.apply(characters, this.glyphs[_index4].codePoints);
            } // Create the replacement ligature glyph


            var ligatureGlyph = new GlyphInfo(this.font, ligature.glyph, characters, _curGlyph.features);
            ligatureGlyph.shaperInfo = _curGlyph.shaperInfo;
            ligatureGlyph.isLigated = true;
            ligatureGlyph.substituted = true; // From Harfbuzz:
            // - If it *is* a mark ligature, we don't allocate a new ligature id, and leave
            //   the ligature to keep its old ligature id.  This will allow it to attach to
            //   a base ligature in GPOS.  Eg. if the sequence is: LAM,LAM,SHADDA,FATHA,HEH,
            //   and LAM,LAM,HEH for a ligature, they will leave SHADDA and FATHA with a
            //   ligature id and component value of 2.  Then if SHADDA,FATHA form a ligature
            //   later, we don't want them to lose their ligature id/component, otherwise
            //   GPOS will fail to correctly position the mark ligature on top of the
            //   LAM,LAM,HEH ligature. See https://bugzilla.gnome.org/show_bug.cgi?id=676343
            //
            // - If a ligature is formed of components that some of which are also ligatures
            //   themselves, and those ligature components had marks attached to *their*
            //   components, we have to attach the marks to the new ligature component
            //   positions!  Now *that*'s tricky!  And these marks may be following the
            //   last component of the whole sequence, so we should loop forward looking
            //   for them and update them.
            //
            //   Eg. the sequence is LAM,LAM,SHADDA,FATHA,HEH, and the font first forms a
            //   'calt' ligature of LAM,HEH, leaving the SHADDA and FATHA with a ligature
            //   id and component == 1.  Now, during 'liga', the LAM and the LAM-HEH ligature
            //   form a LAM-LAM-HEH ligature.  We need to reassign the SHADDA and FATHA to
            //   the new ligature with a component value of 2.
            //
            //   This in fact happened to a font...  See https://bugzilla.gnome.org/show_bug.cgi?id=437633

            var isMarkLigature = _curGlyph.isMark;

            for (var i = 0; i < matched.length && isMarkLigature; i++) {
              isMarkLigature = this.glyphs[matched[i]].isMark;
            }

            ligatureGlyph.ligatureID = isMarkLigature ? null : this.ligatureID++;
            var lastLigID = _curGlyph.ligatureID;
            var lastNumComps = _curGlyph.codePoints.length;
            var curComps = lastNumComps;
            var idx = this.glyphIterator.index + 1; // Set ligatureID and ligatureComponent on glyphs that were skipped in the matched sequence.
            // This allows GPOS to attach marks to the correct ligature components.

            for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(matched), _step3; !(_step3 = _iterator3()).done;) {
              var matchIndex = _step3.value;

              // Don't assign new ligature components for mark ligatures (see above)
              if (isMarkLigature) {
                idx = matchIndex;
              } else {
                while (idx < matchIndex) {
                  var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[idx].ligatureComponent || 1, lastNumComps);
                  this.glyphs[idx].ligatureID = ligatureGlyph.ligatureID;
                  this.glyphs[idx].ligatureComponent = ligatureComponent;
                  idx++;
                }
              }

              lastLigID = this.glyphs[idx].ligatureID;
              lastNumComps = this.glyphs[idx].codePoints.length;
              curComps += lastNumComps;
              idx++; // skip base glyph
            } // Adjust ligature components for any marks following


            if (lastLigID && !isMarkLigature) {
              for (var _i = idx; _i < this.glyphs.length; _i++) {
                if (this.glyphs[_i].ligatureID === lastLigID) {
                  var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[_i].ligatureComponent || 1, lastNumComps);
                  this.glyphs[_i].ligatureComponent = ligatureComponent;
                } else {
                  break;
                }
              }
            } // Delete the matched glyphs, and replace the current glyph with the ligature glyph


            for (var _i2 = matched.length - 1; _i2 >= 0; _i2--) {
              this.glyphs.splice(matched[_i2], 1);
            }

            this.glyphs[this.glyphIterator.index] = ligatureGlyph;
            return true;
          }

          return false;
        }

      case 5:
        // Contextual Substitution
        return this.applyContext(table);

      case 6:
        // Chaining Contextual Substitution
        return this.applyChainingContext(table);

      case 7:
        // Extension Substitution
        return this.applyLookup(table.lookupType, table.extension);

      default:
        throw new Error("GSUB lookupType " + lookupType + " is not supported");
    }
  };

  return GSUBProcessor;
}(OTProcessor);

var GPOSProcessor = /*#__PURE__*/function (_OTProcessor) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(GPOSProcessor, _OTProcessor);

  function GPOSProcessor() {
    return _OTProcessor.apply(this, arguments) || this;
  }

  var _proto = GPOSProcessor.prototype;

  _proto.applyPositionValue = function applyPositionValue(sequenceIndex, value) {
    var position = this.positions[this.glyphIterator.peekIndex(sequenceIndex)];

    if (value.xAdvance != null) {
      position.xAdvance += value.xAdvance;
    }

    if (value.yAdvance != null) {
      position.yAdvance += value.yAdvance;
    }

    if (value.xPlacement != null) {
      position.xOffset += value.xPlacement;
    }

    if (value.yPlacement != null) {
      position.yOffset += value.yPlacement;
    } // Adjustments for font variations


    var variationProcessor = this.font._variationProcessor;
    var variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;

    if (variationProcessor && variationStore) {
      if (value.xPlaDevice) {
        position.xOffset += variationProcessor.getDelta(variationStore, value.xPlaDevice.a, value.xPlaDevice.b);
      }

      if (value.yPlaDevice) {
        position.yOffset += variationProcessor.getDelta(variationStore, value.yPlaDevice.a, value.yPlaDevice.b);
      }

      if (value.xAdvDevice) {
        position.xAdvance += variationProcessor.getDelta(variationStore, value.xAdvDevice.a, value.xAdvDevice.b);
      }

      if (value.yAdvDevice) {
        position.yAdvance += variationProcessor.getDelta(variationStore, value.yAdvDevice.a, value.yAdvDevice.b);
      }
    } // TODO: device tables

  };

  _proto.applyLookup = function applyLookup(lookupType, table) {
    switch (lookupType) {
      case 1:
        {
          // Single positioning value
          var index = this.coverageIndex(table.coverage);

          if (index === -1) {
            return false;
          }

          switch (table.version) {
            case 1:
              this.applyPositionValue(0, table.value);
              break;

            case 2:
              this.applyPositionValue(0, table.values.get(index));
              break;
          }

          return true;
        }

      case 2:
        {
          // Pair Adjustment Positioning
          var nextGlyph = this.glyphIterator.peek();

          if (!nextGlyph) {
            return false;
          }

          var _index = this.coverageIndex(table.coverage);

          if (_index === -1) {
            return false;
          }

          switch (table.version) {
            case 1:
              // Adjustments for glyph pairs
              var set = table.pairSets.get(_index);

              for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(set), _step; !(_step = _iterator()).done;) {
                var _pair = _step.value;

                if (_pair.secondGlyph === nextGlyph.id) {
                  this.applyPositionValue(0, _pair.value1);
                  this.applyPositionValue(1, _pair.value2);
                  return true;
                }
              }

              return false;

            case 2:
              // Class pair adjustment
              var class1 = this.getClassID(this.glyphIterator.cur.id, table.classDef1);
              var class2 = this.getClassID(nextGlyph.id, table.classDef2);

              if (class1 === -1 || class2 === -1) {
                return false;
              }

              var pair = table.classRecords.get(class1).get(class2);
              this.applyPositionValue(0, pair.value1);
              this.applyPositionValue(1, pair.value2);
              return true;
          }
        }

      case 3:
        {
          // Cursive Attachment Positioning
          var nextIndex = this.glyphIterator.peekIndex();
          var _nextGlyph = this.glyphs[nextIndex];

          if (!_nextGlyph) {
            return false;
          }

          var curRecord = table.entryExitRecords[this.coverageIndex(table.coverage)];

          if (!curRecord || !curRecord.exitAnchor) {
            return false;
          }

          var nextRecord = table.entryExitRecords[this.coverageIndex(table.coverage, _nextGlyph.id)];

          if (!nextRecord || !nextRecord.entryAnchor) {
            return false;
          }

          var entry = this.getAnchor(nextRecord.entryAnchor);
          var exit = this.getAnchor(curRecord.exitAnchor);
          var cur = this.positions[this.glyphIterator.index];
          var next = this.positions[nextIndex];

          switch (this.direction) {
            case 'ltr':
              cur.xAdvance = exit.x + cur.xOffset;
              var d = entry.x + next.xOffset;
              next.xAdvance -= d;
              next.xOffset -= d;
              break;

            case 'rtl':
              d = exit.x + cur.xOffset;
              cur.xAdvance -= d;
              cur.xOffset -= d;
              next.xAdvance = entry.x + next.xOffset;
              break;
          }

          if (this.glyphIterator.flags.rightToLeft) {
            this.glyphIterator.cur.cursiveAttachment = nextIndex;
            cur.yOffset = entry.y - exit.y;
          } else {
            _nextGlyph.cursiveAttachment = this.glyphIterator.index;
            cur.yOffset = exit.y - entry.y;
          }

          return true;
        }

      case 4:
        {
          // Mark to base positioning
          var markIndex = this.coverageIndex(table.markCoverage);

          if (markIndex === -1) {
            return false;
          } // search backward for a base glyph


          var baseGlyphIndex = this.glyphIterator.index;

          while (--baseGlyphIndex >= 0 && (this.glyphs[baseGlyphIndex].isMark || this.glyphs[baseGlyphIndex].ligatureComponent > 0)) {
          }

          if (baseGlyphIndex < 0) {
            return false;
          }

          var baseIndex = this.coverageIndex(table.baseCoverage, this.glyphs[baseGlyphIndex].id);

          if (baseIndex === -1) {
            return false;
          }

          var markRecord = table.markArray[markIndex];
          var baseAnchor = table.baseArray[baseIndex][markRecord.class];
          this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex);
          return true;
        }

      case 5:
        {
          // Mark to ligature positioning
          var _markIndex = this.coverageIndex(table.markCoverage);

          if (_markIndex === -1) {
            return false;
          } // search backward for a base glyph


          var _baseGlyphIndex = this.glyphIterator.index;

          while (--_baseGlyphIndex >= 0 && this.glyphs[_baseGlyphIndex].isMark) {
          }

          if (_baseGlyphIndex < 0) {
            return false;
          }

          var ligIndex = this.coverageIndex(table.ligatureCoverage, this.glyphs[_baseGlyphIndex].id);

          if (ligIndex === -1) {
            return false;
          }

          var ligAttach = table.ligatureArray[ligIndex];
          var markGlyph = this.glyphIterator.cur;
          var ligGlyph = this.glyphs[_baseGlyphIndex];
          var compIndex = ligGlyph.ligatureID && ligGlyph.ligatureID === markGlyph.ligatureID && markGlyph.ligatureComponent > 0 ? Math.min(markGlyph.ligatureComponent, ligGlyph.codePoints.length) - 1 : ligGlyph.codePoints.length - 1;
          var _markRecord = table.markArray[_markIndex];
          var _baseAnchor = ligAttach[compIndex][_markRecord.class];
          this.applyAnchor(_markRecord, _baseAnchor, _baseGlyphIndex);
          return true;
        }

      case 6:
        {
          // Mark to mark positioning
          var mark1Index = this.coverageIndex(table.mark1Coverage);

          if (mark1Index === -1) {
            return false;
          } // get the previous mark to attach to


          var prevIndex = this.glyphIterator.peekIndex(-1);
          var prev = this.glyphs[prevIndex];

          if (!prev || !prev.isMark) {
            return false;
          }

          var _cur = this.glyphIterator.cur; // The following logic was borrowed from Harfbuzz

          var good = false;

          if (_cur.ligatureID === prev.ligatureID) {
            if (!_cur.ligatureID) {
              // Marks belonging to the same base
              good = true;
            } else if (_cur.ligatureComponent === prev.ligatureComponent) {
              // Marks belonging to the same ligature component
              good = true;
            }
          } else {
            // If ligature ids don't match, it may be the case that one of the marks
            // itself is a ligature, in which case match.
            if (_cur.ligatureID && !_cur.ligatureComponent || prev.ligatureID && !prev.ligatureComponent) {
              good = true;
            }
          }

          if (!good) {
            return false;
          }

          var mark2Index = this.coverageIndex(table.mark2Coverage, prev.id);

          if (mark2Index === -1) {
            return false;
          }

          var _markRecord2 = table.mark1Array[mark1Index];
          var _baseAnchor2 = table.mark2Array[mark2Index][_markRecord2.class];
          this.applyAnchor(_markRecord2, _baseAnchor2, prevIndex);
          return true;
        }

      case 7:
        // Contextual positioning
        return this.applyContext(table);

      case 8:
        // Chaining contextual positioning
        return this.applyChainingContext(table);

      case 9:
        // Extension positioning
        return this.applyLookup(table.lookupType, table.extension);

      default:
        throw new Error("Unsupported GPOS table: " + lookupType);
    }
  };

  _proto.applyAnchor = function applyAnchor(markRecord, baseAnchor, baseGlyphIndex) {
    var baseCoords = this.getAnchor(baseAnchor);
    var markCoords = this.getAnchor(markRecord.markAnchor);
    this.positions[baseGlyphIndex];
    var markPos = this.positions[this.glyphIterator.index];
    markPos.xOffset = baseCoords.x - markCoords.x;
    markPos.yOffset = baseCoords.y - markCoords.y;
    this.glyphIterator.cur.markAttachment = baseGlyphIndex;
  };

  _proto.getAnchor = function getAnchor(anchor) {
    // TODO: contour point, device tables
    var x = anchor.xCoordinate;
    var y = anchor.yCoordinate; // Adjustments for font variations

    var variationProcessor = this.font._variationProcessor;
    var variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;

    if (variationProcessor && variationStore) {
      if (anchor.xDeviceTable) {
        x += variationProcessor.getDelta(variationStore, anchor.xDeviceTable.a, anchor.xDeviceTable.b);
      }

      if (anchor.yDeviceTable) {
        y += variationProcessor.getDelta(variationStore, anchor.yDeviceTable.a, anchor.yDeviceTable.b);
      }
    }

    return {
      x: x,
      y: y
    };
  };

  _proto.applyFeatures = function applyFeatures(userFeatures, glyphs, advances) {
    _OTProcessor.prototype.applyFeatures.call(this, userFeatures, glyphs, advances);

    for (var i = 0; i < this.glyphs.length; i++) {
      this.fixCursiveAttachment(i);
    }

    this.fixMarkAttachment();
  };

  _proto.fixCursiveAttachment = function fixCursiveAttachment(i) {
    var glyph = this.glyphs[i];

    if (glyph.cursiveAttachment != null) {
      var j = glyph.cursiveAttachment;
      glyph.cursiveAttachment = null;
      this.fixCursiveAttachment(j);
      this.positions[i].yOffset += this.positions[j].yOffset;
    }
  };

  _proto.fixMarkAttachment = function fixMarkAttachment() {
    for (var i = 0; i < this.glyphs.length; i++) {
      var glyph = this.glyphs[i];

      if (glyph.markAttachment != null) {
        var j = glyph.markAttachment;
        this.positions[i].xOffset += this.positions[j].xOffset;
        this.positions[i].yOffset += this.positions[j].yOffset;

        if (this.direction === 'ltr') {
          for (var k = j; k < i; k++) {
            this.positions[i].xOffset -= this.positions[k].xAdvance;
            this.positions[i].yOffset -= this.positions[k].yAdvance;
          }
        } else {
          for (var _k = j + 1; _k < i + 1; _k++) {
            this.positions[i].xOffset += this.positions[_k].xAdvance;
            this.positions[i].yOffset += this.positions[_k].yAdvance;
          }
        }
      }
    }
  };

  return GPOSProcessor;
}(OTProcessor);

var OTLayoutEngine = /*#__PURE__*/function () {
  function OTLayoutEngine(font) {
    this.font = font;
    this.glyphInfos = null;
    this.plan = null;
    this.GSUBProcessor = null;
    this.GPOSProcessor = null;
    this.fallbackPosition = true;

    if (font.GSUB) {
      this.GSUBProcessor = new GSUBProcessor(font, font.GSUB);
    }

    if (font.GPOS) {
      this.GPOSProcessor = new GPOSProcessor(font, font.GPOS);
    }
  }

  var _proto = OTLayoutEngine.prototype;

  _proto.setup = function setup(glyphRun) {
    var _this = this;

    // Map glyphs to GlyphInfo objects so data can be passed between
    // GSUB and GPOS without mutating the real (shared) Glyph objects.
    this.glyphInfos = glyphRun.glyphs.map(function (glyph) {
      return new GlyphInfo(_this.font, glyph.id, [].concat(glyph.codePoints));
    }); // Select a script based on what is available in GSUB/GPOS.

    var script = null;

    if (this.GPOSProcessor) {
      script = this.GPOSProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
    }

    if (this.GSUBProcessor) {
      script = this.GSUBProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
    } // Choose a shaper based on the script, and setup a shaping plan.
    // This determines which features to apply to which glyphs.


    this.shaper = choose(script);
    this.plan = new ShapingPlan(this.font, script, glyphRun.direction);
    this.shaper.plan(this.plan, this.glyphInfos, glyphRun.features); // Assign chosen features to output glyph run

    for (var key in this.plan.allFeatures) {
      glyphRun.features[key] = true;
    }
  };

  _proto.substitute = function substitute(glyphRun) {
    var _this2 = this;

    if (this.GSUBProcessor) {
      this.plan.process(this.GSUBProcessor, this.glyphInfos); // Map glyph infos back to normal Glyph objects

      glyphRun.glyphs = this.glyphInfos.map(function (glyphInfo) {
        return _this2.font.getGlyph(glyphInfo.id, glyphInfo.codePoints);
      });
    }
  };

  _proto.position = function position(glyphRun) {
    if (this.shaper.zeroMarkWidths === 'BEFORE_GPOS') {
      this.zeroMarkAdvances(glyphRun.positions);
    }

    if (this.GPOSProcessor) {
      this.plan.process(this.GPOSProcessor, this.glyphInfos, glyphRun.positions);
    }

    if (this.shaper.zeroMarkWidths === 'AFTER_GPOS') {
      this.zeroMarkAdvances(glyphRun.positions);
    } // Reverse the glyphs and positions if the script is right-to-left


    if (glyphRun.direction === 'rtl') {
      glyphRun.glyphs.reverse();
      glyphRun.positions.reverse();
    }

    return this.GPOSProcessor && this.GPOSProcessor.features;
  };

  _proto.zeroMarkAdvances = function zeroMarkAdvances(positions) {
    for (var i = 0; i < this.glyphInfos.length; i++) {
      if (this.glyphInfos[i].isMark) {
        positions[i].xAdvance = 0;
        positions[i].yAdvance = 0;
      }
    }
  };

  _proto.cleanup = function cleanup() {
    this.glyphInfos = null;
    this.plan = null;
    this.shaper = null;
  };

  _proto.getAvailableFeatures = function getAvailableFeatures(script, language) {
    var features = [];

    if (this.GSUBProcessor) {
      this.GSUBProcessor.selectScript(script, language);
      features.push.apply(features, Object.keys(this.GSUBProcessor.features));
    }

    if (this.GPOSProcessor) {
      this.GPOSProcessor.selectScript(script, language);
      features.push.apply(features, Object.keys(this.GPOSProcessor.features));
    }

    return features;
  };

  return OTLayoutEngine;
}();

var LayoutEngine = /*#__PURE__*/function () {
  function LayoutEngine(font) {
    this.font = font;
    this.unicodeLayoutEngine = null;
    this.kernProcessor = null; // Choose an advanced layout engine. We try the AAT morx table first since more
    // scripts are currently supported because the shaping logic is built into the font.

    if (this.font.morx) {
      this.engine = new AATLayoutEngine(this.font);
    } else if (this.font.GSUB || this.font.GPOS) {
      this.engine = new OTLayoutEngine(this.font);
    }
  }

  var _proto = LayoutEngine.prototype;

  _proto.layout = function layout(string, features, script, language, direction) {
    // Make the features parameter optional
    if (typeof features === 'string') {
      direction = language;
      language = script;
      script = features;
      features = [];
    } // Map string to glyphs if needed


    if (typeof string === 'string') {
      // Attempt to detect the script from the string if not provided.
      if (script == null) {
        script = forString(string);
      }

      var glyphs = this.font.glyphsForString(string);
    } else {
      // Attempt to detect the script from the glyph code points if not provided.
      if (script == null) {
        var codePoints = [];

        for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(string), _step; !(_step = _iterator()).done;) {
          var glyph = _step.value;
          codePoints.push.apply(codePoints, glyph.codePoints);
        }

        script = forCodePoints(codePoints);
      }

      var glyphs = string;
    }

    var glyphRun = new GlyphRun(glyphs, features, script, language, direction); // Return early if there are no glyphs

    if (glyphs.length === 0) {
      glyphRun.positions = [];
      return glyphRun;
    } // Setup the advanced layout engine


    if (this.engine && this.engine.setup) {
      this.engine.setup(glyphRun);
    } // Substitute and position the glyphs


    this.substitute(glyphRun);
    this.position(glyphRun);
    this.hideDefaultIgnorables(glyphRun.glyphs, glyphRun.positions); // Let the layout engine clean up any state it might have

    if (this.engine && this.engine.cleanup) {
      this.engine.cleanup();
    }

    return glyphRun;
  };

  _proto.substitute = function substitute(glyphRun) {
    // Call the advanced layout engine to make substitutions
    if (this.engine && this.engine.substitute) {
      this.engine.substitute(glyphRun);
    }
  };

  _proto.position = function position(glyphRun) {
    // Get initial glyph positions
    glyphRun.positions = glyphRun.glyphs.map(function (glyph) {
      return new GlyphPosition(glyph.advanceWidth);
    });
    var positioned = null; // Call the advanced layout engine. Returns the features applied.

    if (this.engine && this.engine.position) {
      positioned = this.engine.position(glyphRun);
    } // if there is no GPOS table, use unicode properties to position marks.


    if (!positioned && (!this.engine || this.engine.fallbackPosition)) {
      if (!this.unicodeLayoutEngine) {
        this.unicodeLayoutEngine = new UnicodeLayoutEngine(this.font);
      }

      this.unicodeLayoutEngine.positionGlyphs(glyphRun.glyphs, glyphRun.positions);
    } // if kerning is not supported by GPOS, do kerning with the TrueType/AAT kern table


    if ((!positioned || !positioned.kern) && glyphRun.features.kern !== false && this.font.kern) {
      if (!this.kernProcessor) {
        this.kernProcessor = new KernProcessor(this.font);
      }

      this.kernProcessor.process(glyphRun.glyphs, glyphRun.positions);
      glyphRun.features.kern = true;
    }
  };

  _proto.hideDefaultIgnorables = function hideDefaultIgnorables(glyphs, positions) {
    var space = this.font.glyphForCodePoint(0x20);

    for (var i = 0; i < glyphs.length; i++) {
      if (this.isDefaultIgnorable(glyphs[i].codePoints[0])) {
        glyphs[i] = space;
        positions[i].xAdvance = 0;
        positions[i].yAdvance = 0;
      }
    }
  };

  _proto.isDefaultIgnorable = function isDefaultIgnorable(ch) {
    // From DerivedCoreProperties.txt in the Unicode database,
    // minus U+115F, U+1160, U+3164 and U+FFA0, which is what
    // Harfbuzz and Uniscribe do.
    var plane = ch >> 16;

    if (plane === 0) {
      // BMP
      switch (ch >> 8) {
        case 0x00:
          return ch === 0x00AD;

        case 0x03:
          return ch === 0x034F;

        case 0x06:
          return ch === 0x061C;

        case 0x17:
          return 0x17B4 <= ch && ch <= 0x17B5;

        case 0x18:
          return 0x180B <= ch && ch <= 0x180E;

        case 0x20:
          return 0x200B <= ch && ch <= 0x200F || 0x202A <= ch && ch <= 0x202E || 0x2060 <= ch && ch <= 0x206F;

        case 0xFE:
          return 0xFE00 <= ch && ch <= 0xFE0F || ch === 0xFEFF;

        case 0xFF:
          return 0xFFF0 <= ch && ch <= 0xFFF8;

        default:
          return false;
      }
    } else {
      // Other planes
      switch (plane) {
        case 0x01:
          return 0x1BCA0 <= ch && ch <= 0x1BCA3 || 0x1D173 <= ch && ch <= 0x1D17A;

        case 0x0E:
          return 0xE0000 <= ch && ch <= 0xE0FFF;

        default:
          return false;
      }
    }
  };

  _proto.getAvailableFeatures = function getAvailableFeatures(script, language) {
    var features = [];

    if (this.engine) {
      features.push.apply(features, this.engine.getAvailableFeatures(script, language));
    }

    if (this.font.kern && features.indexOf('kern') === -1) {
      features.push('kern');
    }

    return features;
  };

  _proto.stringsForGlyph = function stringsForGlyph(gid) {
    var result = new Set();

    var codePoints = this.font._cmapProcessor.codePointsForGlyph(gid);

    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(codePoints), _step2; !(_step2 = _iterator2()).done;) {
      var codePoint = _step2.value;
      result.add(String.fromCodePoint(codePoint));
    }

    if (this.engine && this.engine.stringsForGlyph) {
      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.engine.stringsForGlyph(gid)), _step3; !(_step3 = _iterator3()).done;) {
        var string = _step3.value;
        result.add(string);
      }
    }

    return Array.from(result);
  };

  return LayoutEngine;
}();

var SVG_COMMANDS = {
  moveTo: 'M',
  lineTo: 'L',
  quadraticCurveTo: 'Q',
  bezierCurveTo: 'C',
  closePath: 'Z'
};
/**
 * Path objects are returned by glyphs and represent the actual
 * vector outlines for each glyph in the font. Paths can be converted
 * to SVG path data strings, or to functions that can be applied to
 * render the path to a graphics context.
 */

var Path = /*#__PURE__*/function () {
  function Path() {
    this.commands = [];
    this._bbox = null;
    this._cbox = null;
  }
  /**
   * Compiles the path to a JavaScript function that can be applied with
   * a graphics context in order to render the path.
   * @return {string}
   */


  var _proto = Path.prototype;

  _proto.toFunction = function toFunction() {
    var _this = this;

    return function (ctx) {
      _this.commands.forEach(function (c) {
        return ctx[c.command].apply(ctx, c.args);
      });
    };
  }
  /**
   * Converts the path to an SVG path data string
   * @return {string}
   */
  ;

  _proto.toSVG = function toSVG() {
    var cmds = this.commands.map(function (c) {
      var args = c.args.map(function (arg) {
        return Math.round(arg * 100) / 100;
      });
      return "" + SVG_COMMANDS[c.command] + args.join(' ');
    });
    return cmds.join('');
  }
  /**
   * Gets the "control box" of a path.
   * This is like the bounding box, but it includes all points including
   * control points of bezier segments and is much faster to compute than
   * the real bounding box.
   * @type {BBox}
   */
  ;

  /**
   * Applies a mapping function to each point in the path.
   * @param {function} fn
   * @return {Path}
   */
  _proto.mapPoints = function mapPoints(fn) {
    var path = new Path();

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.commands), _step; !(_step = _iterator()).done;) {
      var c = _step.value;
      var args = [];

      for (var i = 0; i < c.args.length; i += 2) {
        var _fn = fn(c.args[i], c.args[i + 1]),
            x = _fn[0],
            y = _fn[1];

        args.push(x, y);
      }

      path[c.command].apply(path, args);
    }

    return path;
  }
  /**
   * Transforms the path by the given matrix.
   */
  ;

  _proto.transform = function transform(m0, m1, m2, m3, m4, m5) {
    return this.mapPoints(function (x, y) {
      x = m0 * x + m2 * y + m4;
      y = m1 * x + m3 * y + m5;
      return [x, y];
    });
  }
  /**
   * Translates the path by the given offset.
   */
  ;

  _proto.translate = function translate(x, y) {
    return this.transform(1, 0, 0, 1, x, y);
  }
  /**
   * Rotates the path by the given angle (in radians).
   */
  ;

  _proto.rotate = function rotate(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return this.transform(cos, sin, -sin, cos, 0, 0);
  }
  /**
   * Scales the path.
   */
  ;

  _proto.scale = function scale(scaleX, scaleY) {
    if (scaleY === void 0) {
      scaleY = scaleX;
    }

    return this.transform(scaleX, 0, 0, scaleY, 0, 0);
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(Path, [{
    key: "cbox",
    get: function get() {
      if (!this._cbox) {
        var cbox = new BBox();

        for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.commands), _step2; !(_step2 = _iterator2()).done;) {
          var command = _step2.value;

          for (var i = 0; i < command.args.length; i += 2) {
            cbox.addPoint(command.args[i], command.args[i + 1]);
          }
        }

        this._cbox = Object.freeze(cbox);
      }

      return this._cbox;
    }
    /**
     * Gets the exact bounding box of the path by evaluating curve segments.
     * Slower to compute than the control box, but more accurate.
     * @type {BBox}
     */

  }, {
    key: "bbox",
    get: function get() {
      if (this._bbox) {
        return this._bbox;
      }

      var bbox = new BBox();
      var cx = 0,
          cy = 0;

      var f = function f(t) {
        return Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i];
      };

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.commands), _step3; !(_step3 = _iterator3()).done;) {
        var c = _step3.value;

        switch (c.command) {
          case 'moveTo':
          case 'lineTo':
            var _c$args = c.args,
                x = _c$args[0],
                y = _c$args[1];
            bbox.addPoint(x, y);
            cx = x;
            cy = y;
            break;

          case 'quadraticCurveTo':
          case 'bezierCurveTo':
            if (c.command === 'quadraticCurveTo') {
              // http://fontforge.org/bezier.html
              var _c$args2 = c.args,
                  qp1x = _c$args2[0],
                  qp1y = _c$args2[1],
                  p3x = _c$args2[2],
                  p3y = _c$args2[3];
              var cp1x = cx + 2 / 3 * (qp1x - cx); // CP1 = QP0 + 2/3 * (QP1-QP0)

              var cp1y = cy + 2 / 3 * (qp1y - cy);
              var cp2x = p3x + 2 / 3 * (qp1x - p3x); // CP2 = QP2 + 2/3 * (QP1-QP2)

              var cp2y = p3y + 2 / 3 * (qp1y - p3y);
            } else {
              var _c$args3 = c.args,
                  cp1x = _c$args3[0],
                  cp1y = _c$args3[1],
                  cp2x = _c$args3[2],
                  cp2y = _c$args3[3],
                  p3x = _c$args3[4],
                  p3y = _c$args3[5];
            } // http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html


            bbox.addPoint(p3x, p3y);
            var p0 = [cx, cy];
            var p1 = [cp1x, cp1y];
            var p2 = [cp2x, cp2y];
            var p3 = [p3x, p3y];

            for (var i = 0; i <= 1; i++) {
              var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
              var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
              c = 3 * p1[i] - 3 * p0[i];

              if (a === 0) {
                if (b === 0) {
                  continue;
                }

                var t = -c / b;

                if (0 < t && t < 1) {
                  if (i === 0) {
                    bbox.addPoint(f(t), bbox.maxY);
                  } else if (i === 1) {
                    bbox.addPoint(bbox.maxX, f(t));
                  }
                }

                continue;
              }

              var b2ac = Math.pow(b, 2) - 4 * c * a;

              if (b2ac < 0) {
                continue;
              }

              var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);

              if (0 < t1 && t1 < 1) {
                if (i === 0) {
                  bbox.addPoint(f(t1), bbox.maxY);
                } else if (i === 1) {
                  bbox.addPoint(bbox.maxX, f(t1));
                }
              }

              var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);

              if (0 < t2 && t2 < 1) {
                if (i === 0) {
                  bbox.addPoint(f(t2), bbox.maxY);
                } else if (i === 1) {
                  bbox.addPoint(bbox.maxX, f(t2));
                }
              }
            }

            cx = p3x;
            cy = p3y;
            break;
        }
      }

      return this._bbox = Object.freeze(bbox);
    }
  }]);

  return Path;
}();

var _loop = function _loop() {
  var command = _arr[_i];

  Path.prototype[command] = function () {
    this._bbox = this._cbox = null;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.commands.push({
      command: command,
      args: args
    });
    return this;
  };
};

for (var _i = 0, _arr = ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'closePath']; _i < _arr.length; _i++) {
  _loop();
}

var StandardNames = ['.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave', 'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis', 'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis', 'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section', 'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal', 'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation', 'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown', 'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright', 'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft', 'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction', 'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase', 'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex', 'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth', 'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior', 'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla', 'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

var _class$1;
/**
 * Glyph objects represent a glyph in the font. They have various properties for accessing metrics and
 * the actual vector path the glyph represents, and methods for rendering the glyph to a graphics context.
 *
 * You do not create glyph objects directly. They are created by various methods on the font object.
 * There are several subclasses of the base Glyph class internally that may be returned depending
 * on the font format, but they all inherit from this class.
 */

var Glyph = (_class$1 = /*#__PURE__*/function () {
  function Glyph(id, codePoints, font) {
    /**
     * The glyph id in the font
     * @type {number}
     */
    this.id = id;
    /**
     * An array of unicode code points that are represented by this glyph.
     * There can be multiple code points in the case of ligatures and other glyphs
     * that represent multiple visual characters.
     * @type {number[]}
     */

    this.codePoints = codePoints;
    this._font = font; // TODO: get this info from GDEF if available

    this.isMark = this.codePoints.length > 0 && this.codePoints.every(_react_pdf_unicode_properties__WEBPACK_IMPORTED_MODULE_3__["default"].isMark);
    this.isLigature = this.codePoints.length > 1;
  }

  var _proto = Glyph.prototype;

  _proto._getPath = function _getPath() {
    return new Path();
  };

  _proto._getCBox = function _getCBox() {
    return this.path.cbox;
  };

  _proto._getBBox = function _getBBox() {
    return this.path.bbox;
  };

  _proto._getTableMetrics = function _getTableMetrics(table) {
    if (this.id < table.metrics.length) {
      return table.metrics.get(this.id);
    }

    var metric = table.metrics.get(table.metrics.length - 1);
    var res = {
      advance: metric ? metric.advance : 0,
      bearing: table.bearings.get(this.id - table.metrics.length) || 0
    };
    return res;
  };

  _proto._getMetrics = function _getMetrics(cbox) {
    if (this._metrics) {
      return this._metrics;
    }

    var _this$_getTableMetric = this._getTableMetrics(this._font.hmtx),
        advanceWidth = _this$_getTableMetric.advance,
        leftBearing = _this$_getTableMetric.bearing; // For vertical metrics, use vmtx if available, or fall back to global data from OS/2 or hhea


    if (this._font.vmtx) {
      var _this$_getTableMetric2 = this._getTableMetrics(this._font.vmtx),
          advanceHeight = _this$_getTableMetric2.advance,
          topBearing = _this$_getTableMetric2.bearing;
    } else {
      var os2;

      if (typeof cbox === 'undefined' || cbox === null) {
        cbox = this.cbox;
      }

      if ((os2 = this._font['OS/2']) && os2.version > 0) {
        var advanceHeight = Math.abs(os2.typoAscender - os2.typoDescender);
        var topBearing = os2.typoAscender - cbox.maxY;
      } else {
        var hhea = this._font.hhea;
        var advanceHeight = Math.abs(hhea.ascent - hhea.descent);
        var topBearing = hhea.ascent - cbox.maxY;
      }
    }

    if (this._font._variationProcessor && this._font.HVAR) {
      advanceWidth += this._font._variationProcessor.getAdvanceAdjustment(this.id, this._font.HVAR);
    }

    return this._metrics = {
      advanceWidth: advanceWidth,
      advanceHeight: advanceHeight,
      leftBearing: leftBearing,
      topBearing: topBearing
    };
  }
  /**
   * The glyph’s control box.
   * This is often the same as the bounding box, but is faster to compute.
   * Because of the way bezier curves are defined, some of the control points
   * can be outside of the bounding box. Where `bbox` takes this into account,
   * `cbox` does not. Thus, cbox is less accurate, but faster to compute.
   * See [here](http://www.freetype.org/freetype2/docs/glyphs/glyphs-6.html#section-2)
   * for a more detailed description.
   *
   * @type {BBox}
   */
  ;

  /**
   * Returns a path scaled to the given font size.
   * @param {number} size
   * @return {Path}
   */
  _proto.getScaledPath = function getScaledPath(size) {
    var scale = 1 / this._font.unitsPerEm * size;
    return this.path.scale(scale);
  }
  /**
   * The glyph's advance width.
   * @type {number}
   */
  ;

  _proto._getName = function _getName() {
    var post = this._font.post;

    if (!post) {
      return null;
    }

    switch (post.version) {
      case 1:
        return StandardNames[this.id];

      case 2:
        var id = post.glyphNameIndex[this.id];

        if (id < StandardNames.length) {
          return StandardNames[id];
        }

        return post.names[id - StandardNames.length];

      case 2.5:
        return StandardNames[this.id + post.offsets[this.id]];

      case 4:
        return String.fromCharCode(post.map[this.id]);
    }
  }
  /**
   * The glyph's name
   * @type {string}
   */
  ;

  /**
   * Renders the glyph to the given graphics context, at the specified font size.
   * @param {CanvasRenderingContext2d} ctx
   * @param {number} size
   */
  _proto.render = function render(ctx, size) {
    ctx.save();
    var scale = 1 / this._font.head.unitsPerEm * size;
    ctx.scale(scale, scale);
    var fn = this.path.toFunction();
    fn(ctx);
    ctx.fill();
    ctx.restore();
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(Glyph, [{
    key: "cbox",
    get: function get() {
      return this._getCBox();
    }
    /**
     * The glyph’s bounding box, i.e. the rectangle that encloses the
     * glyph outline as tightly as possible.
     * @type {BBox}
     */

  }, {
    key: "bbox",
    get: function get() {
      return this._getBBox();
    }
    /**
     * A vector Path object representing the glyph outline.
     * @type {Path}
     */

  }, {
    key: "path",
    get: function get() {
      // Cache the path so we only decode it once
      // Decoding is actually performed by subclasses
      return this._getPath();
    }
  }, {
    key: "advanceWidth",
    get: function get() {
      return this._getMetrics().advanceWidth;
    }
    /**
     * The glyph's advance height.
     * @type {number}
     */

  }, {
    key: "advanceHeight",
    get: function get() {
      return this._getMetrics().advanceHeight;
    }
  }, {
    key: "ligatureCaretPositions",
    get: function get() {}
  }, {
    key: "name",
    get: function get() {
      return this._getName();
    }
  }]);

  return Glyph;
}(), ((0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "cbox", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "cbox"), _class$1.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "bbox", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "bbox"), _class$1.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "path", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "path"), _class$1.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "advanceWidth", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "advanceWidth"), _class$1.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "advanceHeight", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "advanceHeight"), _class$1.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class$1.prototype, "name", [cache], Object.getOwnPropertyDescriptor(_class$1.prototype, "name"), _class$1.prototype)), _class$1);

var GlyfHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  numberOfContours: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // if negative, this is a composite glyph
  xMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  xMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16)
}); // Flags for simple glyphs

var ON_CURVE$1 = 1 << 0;
var X_SHORT_VECTOR$1 = 1 << 1;
var Y_SHORT_VECTOR$1 = 1 << 2;
var REPEAT$1 = 1 << 3;
var SAME_X$1 = 1 << 4;
var SAME_Y$1 = 1 << 5; // Flags for composite glyphs

var ARG_1_AND_2_ARE_WORDS = 1 << 0;
var WE_HAVE_A_SCALE = 1 << 3;
var MORE_COMPONENTS = 1 << 5;
var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
var WE_HAVE_INSTRUCTIONS = 1 << 8;

var Point$1 = /*#__PURE__*/function () {
  function Point(onCurve, endContour, x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.onCurve = onCurve;
    this.endContour = endContour;
    this.x = x;
    this.y = y;
  }

  var _proto = Point.prototype;

  _proto.copy = function copy() {
    return new Point(this.onCurve, this.endContour, this.x, this.y);
  };

  return Point;
}(); // Represents a component in a composite glyph

var Component = function Component(glyphID, dx, dy) {
  this.glyphID = glyphID;
  this.dx = dx;
  this.dy = dy;
  this.pos = 0;
  this.scaleX = this.scaleY = 1;
  this.scale01 = this.scale10 = 0;
};
/**
 * Represents a TrueType glyph.
 */


var TTFGlyph = /*#__PURE__*/function (_Glyph) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(TTFGlyph, _Glyph);

  function TTFGlyph() {
    return _Glyph.apply(this, arguments) || this;
  }

  var _proto2 = TTFGlyph.prototype;

  // Parses just the glyph header and returns the bounding box
  _proto2._getCBox = function _getCBox(internal) {
    // We need to decode the glyph if variation processing is requested,
    // so it's easier just to recompute the path's cbox after decoding.
    if (this._font._variationProcessor && !internal) {
      return this.path.cbox;
    }

    var stream = this._font._getTableStream('glyf');

    stream.pos += this._font.loca.offsets[this.id];
    var glyph = GlyfHeader.decode(stream);
    var cbox = new BBox(glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax);
    return Object.freeze(cbox);
  } // Parses a single glyph coordinate
  ;

  _proto2._parseGlyphCoord = function _parseGlyphCoord(stream, prev, short, same) {
    if (short) {
      var val = stream.readUInt8();

      if (!same) {
        val = -val;
      }

      val += prev;
    } else {
      if (same) {
        var val = prev;
      } else {
        var val = prev + stream.readInt16BE();
      }
    }

    return val;
  } // Decodes the glyph data into points for simple glyphs,
  // or components for composite glyphs
  ;

  _proto2._decode = function _decode() {
    var glyfPos = this._font.loca.offsets[this.id];
    var nextPos = this._font.loca.offsets[this.id + 1]; // Nothing to do if there is no data for this glyph

    if (glyfPos === nextPos) {
      return null;
    }

    var stream = this._font._getTableStream('glyf');

    stream.pos += glyfPos;
    var startPos = stream.pos;
    var glyph = GlyfHeader.decode(stream);

    if (glyph.numberOfContours > 0) {
      this._decodeSimple(glyph, stream);
    } else if (glyph.numberOfContours < 0) {
      this._decodeComposite(glyph, stream, startPos);
    }

    return glyph;
  };

  _proto2._decodeSimple = function _decodeSimple(glyph, stream) {
    // this is a simple glyph
    glyph.points = [];
    var endPtsOfContours = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), glyph.numberOfContours).decode(stream);
    glyph.instructions = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)).decode(stream);
    var flags = [];
    var numCoords = endPtsOfContours[endPtsOfContours.length - 1] + 1;

    while (flags.length < numCoords) {
      var flag = stream.readUInt8();
      flags.push(flag); // check for repeat flag

      if (flag & REPEAT$1) {
        var count = stream.readUInt8();

        for (var j = 0; j < count; j++) {
          flags.push(flag);
        }
      }
    }

    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      var point = new Point$1(!!(flag & ON_CURVE$1), endPtsOfContours.indexOf(i) >= 0, 0, 0);
      glyph.points.push(point);
    }

    var px = 0;

    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      glyph.points[i].x = px = this._parseGlyphCoord(stream, px, flag & X_SHORT_VECTOR$1, flag & SAME_X$1);
    }

    var py = 0;

    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      glyph.points[i].y = py = this._parseGlyphCoord(stream, py, flag & Y_SHORT_VECTOR$1, flag & SAME_Y$1);
    }

    if (this._font._variationProcessor) {
      var points = glyph.points.slice();
      points.push.apply(points, this._getPhantomPoints(glyph));

      this._font._variationProcessor.transformPoints(this.id, points);

      glyph.phantomPoints = points.slice(-4);
    }

    return;
  };

  _proto2._decodeComposite = function _decodeComposite(glyph, stream, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    // this is a composite glyph
    glyph.components = [];
    var haveInstructions = false;
    var flags = MORE_COMPONENTS;

    while (flags & MORE_COMPONENTS) {
      flags = stream.readUInt16BE();
      var gPos = stream.pos - offset;
      var glyphID = stream.readUInt16BE();

      if (!haveInstructions) {
        haveInstructions = (flags & WE_HAVE_INSTRUCTIONS) !== 0;
      }

      if (flags & ARG_1_AND_2_ARE_WORDS) {
        var dx = stream.readInt16BE();
        var dy = stream.readInt16BE();
      } else {
        var dx = stream.readInt8();
        var dy = stream.readInt8();
      }

      var component = new Component(glyphID, dx, dy);
      component.pos = gPos;

      if (flags & WE_HAVE_A_SCALE) {
        // fixed number with 14 bits of fraction
        component.scaleX = component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
      } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
        component.scaleX = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
        component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
      } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
        component.scaleX = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
        component.scale01 = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
        component.scale10 = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
        component.scaleY = (stream.readUInt8() << 24 | stream.readUInt8() << 16) / 1073741824;
      }

      glyph.components.push(component);
    }

    if (this._font._variationProcessor) {
      var points = [];

      for (var j = 0; j < glyph.components.length; j++) {
        var component = glyph.components[j];
        points.push(new Point$1(true, true, component.dx, component.dy));
      }

      points.push.apply(points, this._getPhantomPoints(glyph));

      this._font._variationProcessor.transformPoints(this.id, points);

      glyph.phantomPoints = points.splice(-4, 4);

      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        glyph.components[i].dx = point.x;
        glyph.components[i].dy = point.y;
      }
    }

    return haveInstructions;
  };

  _proto2._getPhantomPoints = function _getPhantomPoints(glyph) {
    var cbox = this._getCBox(true);

    if (this._metrics == null) {
      this._metrics = Glyph.prototype._getMetrics.call(this, cbox);
    }

    var _this$_metrics = this._metrics,
        advanceWidth = _this$_metrics.advanceWidth,
        advanceHeight = _this$_metrics.advanceHeight,
        leftBearing = _this$_metrics.leftBearing,
        topBearing = _this$_metrics.topBearing;
    return [new Point$1(false, true, glyph.xMin - leftBearing, 0), new Point$1(false, true, glyph.xMin - leftBearing + advanceWidth, 0), new Point$1(false, true, 0, glyph.yMax + topBearing), new Point$1(false, true, 0, glyph.yMax + topBearing + advanceHeight)];
  } // Decodes font data, resolves composite glyphs, and returns an array of contours
  ;

  _proto2._getContours = function _getContours() {
    var glyph = this._decode();

    if (!glyph) {
      return [];
    }

    var points = [];

    if (glyph.numberOfContours < 0) {
      // resolve composite glyphs
      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyph.components), _step; !(_step = _iterator()).done;) {
        var component = _step.value;

        var _contours = this._font.getGlyph(component.glyphID)._getContours();

        for (var i = 0; i < _contours.length; i++) {
          var contour = _contours[i];

          for (var j = 0; j < contour.length; j++) {
            var _point = contour[j];
            var x = _point.x * component.scaleX + _point.y * component.scale01 + component.dx;
            var y = _point.y * component.scaleY + _point.x * component.scale10 + component.dy;
            points.push(new Point$1(_point.onCurve, _point.endContour, x, y));
          }
        }
      }
    } else {
      points = glyph.points || [];
    } // Recompute and cache metrics if we performed variation processing, and don't have an HVAR table


    if (glyph.phantomPoints && !this._font.directory.tables.HVAR) {
      this._metrics.advanceWidth = glyph.phantomPoints[1].x - glyph.phantomPoints[0].x;
      this._metrics.advanceHeight = glyph.phantomPoints[3].y - glyph.phantomPoints[2].y;
      this._metrics.leftBearing = glyph.xMin - glyph.phantomPoints[0].x;
      this._metrics.topBearing = glyph.phantomPoints[2].y - glyph.yMax;
    }

    var contours = [];
    var cur = [];

    for (var k = 0; k < points.length; k++) {
      var point = points[k];
      cur.push(point);

      if (point.endContour) {
        contours.push(cur);
        cur = [];
      }
    }

    return contours;
  };

  _proto2._getMetrics = function _getMetrics() {
    if (this._metrics) {
      return this._metrics;
    }

    var cbox = this._getCBox(true);

    _Glyph.prototype._getMetrics.call(this, cbox);

    if (this._font._variationProcessor && !this._font.HVAR) {
      // No HVAR table, decode the glyph. This triggers recomputation of metrics.
      this.path;
    }

    return this._metrics;
  } // Converts contours to a Path object that can be rendered
  ;

  _proto2._getPath = function _getPath() {
    var contours = this._getContours();

    var path = new Path();

    for (var i = 0; i < contours.length; i++) {
      var contour = contours[i];
      var firstPt = contour[0];
      var lastPt = contour[contour.length - 1];
      var start = 0;

      if (firstPt.onCurve) {
        // The first point will be consumed by the moveTo command, so skip in the loop
        var curvePt = null;
        start = 1;
      } else {
        if (lastPt.onCurve) {
          // Start at the last point if the first point is off curve and the last point is on curve
          firstPt = lastPt;
        } else {
          // Start at the middle if both the first and last points are off curve
          firstPt = new Point$1(false, false, (firstPt.x + lastPt.x) / 2, (firstPt.y + lastPt.y) / 2);
        }

        var curvePt = firstPt;
      }

      path.moveTo(firstPt.x, firstPt.y);

      for (var j = start; j < contour.length; j++) {
        var pt = contour[j];
        var prevPt = j === 0 ? firstPt : contour[j - 1];

        if (prevPt.onCurve && pt.onCurve) {
          path.lineTo(pt.x, pt.y);
        } else if (prevPt.onCurve && !pt.onCurve) {
          var curvePt = pt;
        } else if (!prevPt.onCurve && !pt.onCurve) {
          var midX = (prevPt.x + pt.x) / 2;
          var midY = (prevPt.y + pt.y) / 2;
          path.quadraticCurveTo(prevPt.x, prevPt.y, midX, midY);
          var curvePt = pt;
        } else if (!prevPt.onCurve && pt.onCurve) {
          path.quadraticCurveTo(curvePt.x, curvePt.y, pt.x, pt.y);
          var curvePt = null;
        } else {
          throw new Error("Unknown TTF path state");
        }
      } // Connect the first and last points


      if (curvePt) {
        path.quadraticCurveTo(curvePt.x, curvePt.y, firstPt.x, firstPt.y);
      }

      path.closePath();
    }

    return path;
  };

  return TTFGlyph;
}(Glyph);

/**
 * Represents an OpenType PostScript glyph, in the Compact Font Format.
 */

var CFFGlyph = /*#__PURE__*/function (_Glyph) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(CFFGlyph, _Glyph);

  function CFFGlyph() {
    return _Glyph.apply(this, arguments) || this;
  }

  var _proto = CFFGlyph.prototype;

  _proto._getName = function _getName() {
    if (this._font.CFF2) {
      return _Glyph.prototype._getName.call(this);
    }

    return this._font['CFF '].getGlyphName(this.id);
  };

  _proto.bias = function bias(s) {
    if (s.length < 1240) {
      return 107;
    } else if (s.length < 33900) {
      return 1131;
    } else {
      return 32768;
    }
  };

  _proto._getPath = function _getPath() {
    var cff = this._font.CFF2 || this._font['CFF '];
    var stream = cff.stream;
    var str = cff.topDict.CharStrings[this.id];
    var end = str.offset + str.length;
    stream.pos = str.offset;
    var path = new Path();
    var stack = [];
    var trans = [];
    var width = null;
    var nStems = 0;
    var x = 0,
        y = 0;
    var usedGsubrs;
    var usedSubrs;
    var open = false;
    this._usedGsubrs = usedGsubrs = {};
    this._usedSubrs = usedSubrs = {};
    var gsubrs = cff.globalSubrIndex || [];
    var gsubrsBias = this.bias(gsubrs);
    var privateDict = cff.privateDictForGlyph(this.id) || {};
    var subrs = privateDict.Subrs || [];
    var subrsBias = this.bias(subrs);
    var vstore = cff.topDict.vstore && cff.topDict.vstore.itemVariationStore;
    var vsindex = privateDict.vsindex;
    var variationProcessor = this._font._variationProcessor;

    function checkWidth() {
      if (width == null) {
        width = stack.shift() + privateDict.nominalWidthX;
      }
    }

    function parseStems() {
      if (stack.length % 2 !== 0) {
        checkWidth();
      }

      nStems += stack.length >> 1;
      return stack.length = 0;
    }

    function moveTo(x, y) {
      if (open) {
        path.closePath();
      }

      path.moveTo(x, y);
      open = true;
    }

    var parse = function parse() {
      while (stream.pos < end) {
        var op = stream.readUInt8();

        if (op < 32) {
          switch (op) {
            case 1: // hstem

            case 3: // vstem

            case 18: // hstemhm

            case 23:
              // vstemhm
              parseStems();
              break;

            case 4:
              // vmoveto
              if (stack.length > 1) {
                checkWidth();
              }

              y += stack.shift();
              moveTo(x, y);
              break;

            case 5:
              // rlineto
              while (stack.length >= 2) {
                x += stack.shift();
                y += stack.shift();
                path.lineTo(x, y);
              }

              break;

            case 6: // hlineto

            case 7:
              // vlineto
              var phase = op === 6;

              while (stack.length >= 1) {
                if (phase) {
                  x += stack.shift();
                } else {
                  y += stack.shift();
                }

                path.lineTo(x, y);
                phase = !phase;
              }

              break;

            case 8:
              // rrcurveto
              while (stack.length > 0) {
                var c1x = x + stack.shift();
                var c1y = y + stack.shift();
                var c2x = c1x + stack.shift();
                var c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
              }

              break;

            case 10:
              // callsubr
              var index = stack.pop() + subrsBias;
              var subr = subrs[index];

              if (subr) {
                usedSubrs[index] = true;
                var p = stream.pos;
                var e = end;
                stream.pos = subr.offset;
                end = subr.offset + subr.length;
                parse();
                stream.pos = p;
                end = e;
              }

              break;

            case 11:
              // return
              if (cff.version >= 2) {
                break;
              }

              return;

            case 14:
              // endchar
              if (cff.version >= 2) {
                break;
              }

              if (stack.length > 0) {
                checkWidth();
              }

              if (open) {
                path.closePath();
                open = false;
              }

              break;

            case 15:
              {
                // vsindex
                if (cff.version < 2) {
                  throw new Error('vsindex operator not supported in CFF v1');
                }

                vsindex = stack.pop();
                break;
              }

            case 16:
              {
                // blend
                if (cff.version < 2) {
                  throw new Error('blend operator not supported in CFF v1');
                }

                if (!variationProcessor) {
                  throw new Error('blend operator in non-variation font');
                }

                var blendVector = variationProcessor.getBlendVector(vstore, vsindex);
                var numBlends = stack.pop();
                var numOperands = numBlends * blendVector.length;
                var delta = stack.length - numOperands;
                var base = delta - numBlends;

                for (var i = 0; i < numBlends; i++) {
                  var sum = stack[base + i];

                  for (var j = 0; j < blendVector.length; j++) {
                    sum += blendVector[j] * stack[delta++];
                  }

                  stack[base + i] = sum;
                }

                while (numOperands--) {
                  stack.pop();
                }

                break;
              }

            case 19: // hintmask

            case 20:
              // cntrmask
              parseStems();
              stream.pos += nStems + 7 >> 3;
              break;

            case 21:
              // rmoveto
              if (stack.length > 2) {
                checkWidth();
              }

              x += stack.shift();
              y += stack.shift();
              moveTo(x, y);
              break;

            case 22:
              // hmoveto
              if (stack.length > 1) {
                checkWidth();
              }

              x += stack.shift();
              moveTo(x, y);
              break;

            case 24:
              // rcurveline
              while (stack.length >= 8) {
                var c1x = x + stack.shift();
                var c1y = y + stack.shift();
                var c2x = c1x + stack.shift();
                var c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
              }

              x += stack.shift();
              y += stack.shift();
              path.lineTo(x, y);
              break;

            case 25:
              // rlinecurve
              while (stack.length >= 8) {
                x += stack.shift();
                y += stack.shift();
                path.lineTo(x, y);
              }

              var c1x = x + stack.shift();
              var c1y = y + stack.shift();
              var c2x = c1x + stack.shift();
              var c2y = c1y + stack.shift();
              x = c2x + stack.shift();
              y = c2y + stack.shift();
              path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
              break;

            case 26:
              // vvcurveto
              if (stack.length % 2) {
                x += stack.shift();
              }

              while (stack.length >= 4) {
                c1x = x;
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x;
                y = c2y + stack.shift();
                path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
              }

              break;

            case 27:
              // hhcurveto
              if (stack.length % 2) {
                y += stack.shift();
              }

              while (stack.length >= 4) {
                c1x = x + stack.shift();
                c1y = y;
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y;
                path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
              }

              break;

            case 28:
              // shortint
              stack.push(stream.readInt16BE());
              break;

            case 29:
              // callgsubr
              index = stack.pop() + gsubrsBias;
              subr = gsubrs[index];

              if (subr) {
                usedGsubrs[index] = true;
                var p = stream.pos;
                var e = end;
                stream.pos = subr.offset;
                end = subr.offset + subr.length;
                parse();
                stream.pos = p;
                end = e;
              }

              break;

            case 30: // vhcurveto

            case 31:
              {
                // hvcurveto
                var _phase = op === 31;

                while (stack.length >= 4) {
                  if (_phase) {
                    c1x = x + stack.shift();
                    c1y = y;
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    y = c2y + stack.shift();
                    x = c2x + (stack.length === 1 ? stack.shift() : 0);
                  } else {
                    c1x = x;
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + (stack.length === 1 ? stack.shift() : 0);
                  }

                  path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
                  _phase = !_phase;
                }

                break;
              }

            case 12:
              op = stream.readUInt8();

              switch (op) {
                case 3:
                  // and
                  var a = stack.pop();
                  var b = stack.pop();
                  stack.push(a && b ? 1 : 0);
                  break;

                case 4:
                  // or
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a || b ? 1 : 0);
                  break;

                case 5:
                  // not
                  a = stack.pop();
                  stack.push(a ? 0 : 1);
                  break;

                case 9:
                  // abs
                  a = stack.pop();
                  stack.push(Math.abs(a));
                  break;

                case 10:
                  // add
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a + b);
                  break;

                case 11:
                  // sub
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a - b);
                  break;

                case 12:
                  // div
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a / b);
                  break;

                case 14:
                  // neg
                  a = stack.pop();
                  stack.push(-a);
                  break;

                case 15:
                  // eq
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a === b ? 1 : 0);
                  break;

                case 18:
                  // drop
                  stack.pop();
                  break;

                case 20:
                  // put
                  var val = stack.pop();
                  var idx = stack.pop();
                  trans[idx] = val;
                  break;

                case 21:
                  // get
                  idx = stack.pop();
                  stack.push(trans[idx] || 0);
                  break;

                case 22:
                  // ifelse
                  var s1 = stack.pop();
                  var s2 = stack.pop();
                  var v1 = stack.pop();
                  var v2 = stack.pop();
                  stack.push(v1 <= v2 ? s1 : s2);
                  break;

                case 23:
                  // random
                  stack.push(Math.random());
                  break;

                case 24:
                  // mul
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(a * b);
                  break;

                case 26:
                  // sqrt
                  a = stack.pop();
                  stack.push(Math.sqrt(a));
                  break;

                case 27:
                  // dup
                  a = stack.pop();
                  stack.push(a, a);
                  break;

                case 28:
                  // exch
                  a = stack.pop();
                  b = stack.pop();
                  stack.push(b, a);
                  break;

                case 29:
                  // index
                  idx = stack.pop();

                  if (idx < 0) {
                    idx = 0;
                  } else if (idx > stack.length - 1) {
                    idx = stack.length - 1;
                  }

                  stack.push(stack[idx]);
                  break;

                case 30:
                  // roll
                  var n = stack.pop();

                  var _j = stack.pop();

                  if (_j >= 0) {
                    while (_j > 0) {
                      var t = stack[n - 1];

                      for (var _i = n - 2; _i >= 0; _i--) {
                        stack[_i + 1] = stack[_i];
                      }

                      stack[0] = t;
                      _j--;
                    }
                  } else {
                    while (_j < 0) {
                      var t = stack[0];

                      for (var _i2 = 0; _i2 <= n; _i2++) {
                        stack[_i2] = stack[_i2 + 1];
                      }

                      stack[n - 1] = t;
                      _j++;
                    }
                  }

                  break;

                case 34:
                  // hflex
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  var c3x = c2x + stack.shift();
                  var c3y = c2y;
                  var c4x = c3x + stack.shift();
                  var c4y = c3y;
                  var c5x = c4x + stack.shift();
                  var c5y = c4y;
                  var c6x = c5x + stack.shift();
                  var c6y = c5y;
                  x = c6x;
                  y = c6y;
                  path.bezierCurveTo(c1x, c1y, c2x, c2y, c3x, c3y);
                  path.bezierCurveTo(c4x, c4y, c5x, c5y, c6x, c6y);
                  break;

                case 35:
                  // flex
                  var pts = [];

                  for (var _i3 = 0; _i3 <= 5; _i3++) {
                    x += stack.shift();
                    y += stack.shift();
                    pts.push(x, y);
                  }

                  path.bezierCurveTo.apply(path, pts.slice(0, 6));
                  path.bezierCurveTo.apply(path, pts.slice(6));
                  stack.shift(); // fd

                  break;

                case 36:
                  // hflex1
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  c3x = c2x + stack.shift();
                  c3y = c2y;
                  c4x = c3x + stack.shift();
                  c4y = c3y;
                  c5x = c4x + stack.shift();
                  c5y = c4y + stack.shift();
                  c6x = c5x + stack.shift();
                  c6y = c5y;
                  x = c6x;
                  y = c6y;
                  path.bezierCurveTo(c1x, c1y, c2x, c2y, c3x, c3y);
                  path.bezierCurveTo(c4x, c4y, c5x, c5y, c6x, c6y);
                  break;

                case 37:
                  // flex1
                  var startx = x;
                  var starty = y;
                  pts = [];

                  for (var _i4 = 0; _i4 <= 4; _i4++) {
                    x += stack.shift();
                    y += stack.shift();
                    pts.push(x, y);
                  }

                  if (Math.abs(x - startx) > Math.abs(y - starty)) {
                    // horizontal
                    x += stack.shift();
                    y = starty;
                  } else {
                    x = startx;
                    y += stack.shift();
                  }

                  pts.push(x, y);
                  path.bezierCurveTo.apply(path, pts.slice(0, 6));
                  path.bezierCurveTo.apply(path, pts.slice(6));
                  break;

                default:
                  throw new Error("Unknown op: 12 " + op);
              }

              break;

            default:
              throw new Error("Unknown op: " + op);
          }
        } else if (op < 247) {
          stack.push(op - 139);
        } else if (op < 251) {
          var b1 = stream.readUInt8();
          stack.push((op - 247) * 256 + b1 + 108);
        } else if (op < 255) {
          var b1 = stream.readUInt8();
          stack.push(-(op - 251) * 256 - b1 - 108);
        } else {
          stack.push(stream.readInt32BE() / 65536);
        }
      }
    };

    parse();

    if (open) {
      path.closePath();
    }

    return path;
  };

  return CFFGlyph;
}(Glyph);

var SBIXImage = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  originX: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  originY: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  type: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  data: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)(function (t) {
    return t.parent.buflen - t._currentOffset;
  })
});
/**
 * Represents a color (e.g. emoji) glyph in Apple's SBIX format.
 */

var SBIXGlyph = /*#__PURE__*/function (_TTFGlyph) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(SBIXGlyph, _TTFGlyph);

  function SBIXGlyph() {
    return _TTFGlyph.apply(this, arguments) || this;
  }

  var _proto = SBIXGlyph.prototype;

  /**
   * Returns an object representing a glyph image at the given point size.
   * The object has a data property with a Buffer containing the actual image data,
   * along with the image type, and origin.
   *
   * @param {number} size
   * @return {object}
   */
  _proto.getImageForSize = function getImageForSize(size) {
    for (var i = 0; i < this._font.sbix.imageTables.length; i++) {
      var table = this._font.sbix.imageTables[i];

      if (table.ppem >= size) {
        break;
      }
    }

    var offsets = table.imageOffsets;
    var start = offsets[this.id];
    var end = offsets[this.id + 1];

    if (start === end) {
      return null;
    }

    this._font.stream.pos = start;
    return SBIXImage.decode(this._font.stream, {
      buflen: end - start
    });
  };

  _proto.render = function render(ctx, size) {
    var img = this.getImageForSize(size);

    if (img != null) {
      var scale = size / this._font.unitsPerEm;
      ctx.image(img.data, {
        height: size,
        x: img.originX,
        y: (this.bbox.minY - img.originY) * scale
      });
    }

    if (this._font.sbix.flags.renderOutlines) {
      _TTFGlyph.prototype.render.call(this, ctx, size);
    }
  };

  return SBIXGlyph;
}(TTFGlyph);

var COLRLayer = function COLRLayer(glyph, color) {
  this.glyph = glyph;
  this.color = color;
};
/**
 * Represents a color (e.g. emoji) glyph in Microsoft's COLR format.
 * Each glyph in this format contain a list of colored layers, each
 * of which  is another vector glyph.
 */


var COLRGlyph = /*#__PURE__*/function (_Glyph) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(COLRGlyph, _Glyph);

  function COLRGlyph() {
    return _Glyph.apply(this, arguments) || this;
  }

  var _proto = COLRGlyph.prototype;

  _proto._getBBox = function _getBBox() {
    var bbox = new BBox();

    for (var i = 0; i < this.layers.length; i++) {
      var layer = this.layers[i];
      var b = layer.glyph.bbox;
      bbox.addPoint(b.minX, b.minY);
      bbox.addPoint(b.maxX, b.maxY);
    }

    return bbox;
  }
  /**
   * Returns an array of objects containing the glyph and color for
   * each layer in the composite color glyph.
   * @type {object[]}
   */
  ;

  _proto.render = function render(ctx, size) {
    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.layers), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          glyph = _step$value.glyph,
          color = _step$value.color;
      ctx.fillColor([color.red, color.green, color.blue], color.alpha / 255 * 100);
      glyph.render(ctx, size);
    }

    return;
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(COLRGlyph, [{
    key: "layers",
    get: function get() {
      var cpal = this._font.CPAL;
      var colr = this._font.COLR;
      var low = 0;
      var high = colr.baseGlyphRecord.length - 1;

      while (low <= high) {
        var mid = low + high >> 1;
        var rec = colr.baseGlyphRecord[mid];

        if (this.id < rec.gid) {
          high = mid - 1;
        } else if (this.id > rec.gid) {
          low = mid + 1;
        } else {
          var baseLayer = rec;
          break;
        }
      } // if base glyph not found in COLR table,
      // default to normal glyph from glyf or CFF


      if (baseLayer == null) {
        var g = this._font._getBaseGlyph(this.id);

        var color = {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 255
        };
        return [new COLRLayer(g, color)];
      } // otherwise, return an array of all the layers


      var layers = [];

      for (var i = baseLayer.firstLayerIndex; i < baseLayer.firstLayerIndex + baseLayer.numLayers; i++) {
        var rec = colr.layerRecords[i];
        var color = cpal.colorRecords[rec.paletteIndex];

        var g = this._font._getBaseGlyph(rec.gid);

        layers.push(new COLRLayer(g, color));
      }

      return layers;
    }
  }]);

  return COLRGlyph;
}(Glyph);

var TUPLES_SHARE_POINT_NUMBERS = 0x8000;
var TUPLE_COUNT_MASK = 0x0fff;
var EMBEDDED_TUPLE_COORD = 0x8000;
var INTERMEDIATE_TUPLE = 0x4000;
var PRIVATE_POINT_NUMBERS = 0x2000;
var TUPLE_INDEX_MASK = 0x0fff;
var POINTS_ARE_WORDS = 0x80;
var POINT_RUN_COUNT_MASK = 0x7f;
var DELTAS_ARE_ZERO = 0x80;
var DELTAS_ARE_WORDS = 0x40;
var DELTA_RUN_COUNT_MASK = 0x3f;
/**
 * This class is transforms TrueType glyphs according to the data from
 * the Apple Advanced Typography variation tables (fvar, gvar, and avar).
 * These tables allow infinite adjustments to glyph weight, width, slant,
 * and optical size without the designer needing to specify every exact style.
 *
 * Apple's documentation for these tables is not great, so thanks to the
 * Freetype project for figuring much of this out.
 *
 * @private
 */

var GlyphVariationProcessor = /*#__PURE__*/function () {
  function GlyphVariationProcessor(font, coords) {
    this.font = font;
    this.normalizedCoords = this.normalizeCoords(coords);
    this.blendVectors = new Map();
  }

  var _proto = GlyphVariationProcessor.prototype;

  _proto.normalizeCoords = function normalizeCoords(coords) {
    // the default mapping is linear along each axis, in two segments:
    // from the minValue to defaultValue, and from defaultValue to maxValue.
    var normalized = [];

    for (var i = 0; i < this.font.fvar.axis.length; i++) {
      var axis = this.font.fvar.axis[i];

      if (coords[i] < axis.defaultValue) {
        normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.defaultValue - axis.minValue + Number.EPSILON));
      } else {
        normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.maxValue - axis.defaultValue + Number.EPSILON));
      }
    } // if there is an avar table, the normalized value is calculated
    // by interpolating between the two nearest mapped values.


    if (this.font.avar) {
      for (var i = 0; i < this.font.avar.segment.length; i++) {
        var segment = this.font.avar.segment[i];

        for (var j = 0; j < segment.correspondence.length; j++) {
          var pair = segment.correspondence[j];

          if (j >= 1 && normalized[i] < pair.fromCoord) {
            var prev = segment.correspondence[j - 1];
            normalized[i] = ((normalized[i] - prev.fromCoord) * (pair.toCoord - prev.toCoord) + Number.EPSILON) / (pair.fromCoord - prev.fromCoord + Number.EPSILON) + prev.toCoord;
            break;
          }
        }
      }
    }

    return normalized;
  };

  _proto.transformPoints = function transformPoints(gid, glyphPoints) {
    if (!this.font.fvar || !this.font.gvar) {
      return;
    }

    var gvar = this.font.gvar;

    if (gid >= gvar.glyphCount) {
      return;
    }

    var offset = gvar.offsets[gid];

    if (offset === gvar.offsets[gid + 1]) {
      return;
    } // Read the gvar data for this glyph


    var stream = this.font.stream;
    stream.pos = offset;

    if (stream.pos >= stream.length) {
      return;
    }

    var tupleCount = stream.readUInt16BE();
    var offsetToData = offset + stream.readUInt16BE();

    if (tupleCount & TUPLES_SHARE_POINT_NUMBERS) {
      var here = stream.pos;
      stream.pos = offsetToData;
      var sharedPoints = this.decodePoints();
      offsetToData = stream.pos;
      stream.pos = here;
    }

    var origPoints = glyphPoints.map(function (pt) {
      return pt.copy();
    });
    tupleCount &= TUPLE_COUNT_MASK;

    for (var i = 0; i < tupleCount; i++) {
      var tupleDataSize = stream.readUInt16BE();
      var tupleIndex = stream.readUInt16BE();

      if (tupleIndex & EMBEDDED_TUPLE_COORD) {
        var tupleCoords = [];

        for (var a = 0; a < gvar.axisCount; a++) {
          tupleCoords.push(stream.readInt16BE() / 16384);
        }
      } else {
        if ((tupleIndex & TUPLE_INDEX_MASK) >= gvar.globalCoordCount) {
          throw new Error('Invalid gvar table');
        }

        var tupleCoords = gvar.globalCoords[tupleIndex & TUPLE_INDEX_MASK];
      }

      if (tupleIndex & INTERMEDIATE_TUPLE) {
        var startCoords = [];

        for (var _a = 0; _a < gvar.axisCount; _a++) {
          startCoords.push(stream.readInt16BE() / 16384);
        }

        var endCoords = [];

        for (var _a2 = 0; _a2 < gvar.axisCount; _a2++) {
          endCoords.push(stream.readInt16BE() / 16384);
        }
      } // Get the factor at which to apply this tuple


      var factor = this.tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords);

      if (factor === 0) {
        offsetToData += tupleDataSize;
        continue;
      }

      var here = stream.pos;
      stream.pos = offsetToData;

      if (tupleIndex & PRIVATE_POINT_NUMBERS) {
        var points = this.decodePoints();
      } else {
        var points = sharedPoints;
      } // points.length = 0 means there are deltas for all points


      var nPoints = points.length === 0 ? glyphPoints.length : points.length;
      var xDeltas = this.decodeDeltas(nPoints);
      var yDeltas = this.decodeDeltas(nPoints);

      if (points.length === 0) {
        // all points
        for (var _i = 0; _i < glyphPoints.length; _i++) {
          var point = glyphPoints[_i];
          point.x += Math.round(xDeltas[_i] * factor);
          point.y += Math.round(yDeltas[_i] * factor);
        }
      } else {
        var outPoints = origPoints.map(function (pt) {
          return pt.copy();
        });
        var hasDelta = glyphPoints.map(function () {
          return false;
        });

        for (var _i2 = 0; _i2 < points.length; _i2++) {
          var idx = points[_i2];

          if (idx < glyphPoints.length) {
            var _point = outPoints[idx];
            hasDelta[idx] = true;
            _point.x += Math.round(xDeltas[_i2] * factor);
            _point.y += Math.round(yDeltas[_i2] * factor);
          }
        }

        this.interpolateMissingDeltas(outPoints, origPoints, hasDelta);

        for (var _i3 = 0; _i3 < glyphPoints.length; _i3++) {
          var deltaX = outPoints[_i3].x - origPoints[_i3].x;
          var deltaY = outPoints[_i3].y - origPoints[_i3].y;
          glyphPoints[_i3].x += deltaX;
          glyphPoints[_i3].y += deltaY;
        }
      }

      offsetToData += tupleDataSize;
      stream.pos = here;
    }
  };

  _proto.decodePoints = function decodePoints() {
    var stream = this.font.stream;
    var count = stream.readUInt8();

    if (count & POINTS_ARE_WORDS) {
      count = (count & POINT_RUN_COUNT_MASK) << 8 | stream.readUInt8();
    }

    var points = new Uint16Array(count);
    var i = 0;
    var point = 0;

    while (i < count) {
      var run = stream.readUInt8();
      var runCount = (run & POINT_RUN_COUNT_MASK) + 1;
      var fn = run & POINTS_ARE_WORDS ? stream.readUInt16 : stream.readUInt8;

      for (var j = 0; j < runCount && i < count; j++) {
        point += fn.call(stream);
        points[i++] = point;
      }
    }

    return points;
  };

  _proto.decodeDeltas = function decodeDeltas(count) {
    var stream = this.font.stream;
    var i = 0;
    var deltas = new Int16Array(count);

    while (i < count) {
      var run = stream.readUInt8();
      var runCount = (run & DELTA_RUN_COUNT_MASK) + 1;

      if (run & DELTAS_ARE_ZERO) {
        i += runCount;
      } else {
        var fn = run & DELTAS_ARE_WORDS ? stream.readInt16BE : stream.readInt8;

        for (var j = 0; j < runCount && i < count; j++) {
          deltas[i++] = fn.call(stream);
        }
      }
    }

    return deltas;
  };

  _proto.tupleFactor = function tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords) {
    var normalized = this.normalizedCoords;
    var gvar = this.font.gvar;
    var factor = 1;

    for (var i = 0; i < gvar.axisCount; i++) {
      if (tupleCoords[i] === 0) {
        continue;
      }

      if (normalized[i] === 0) {
        return 0;
      }

      if ((tupleIndex & INTERMEDIATE_TUPLE) === 0) {
        if (normalized[i] < Math.min(0, tupleCoords[i]) || normalized[i] > Math.max(0, tupleCoords[i])) {
          return 0;
        }

        factor = (factor * normalized[i] + Number.EPSILON) / (tupleCoords[i] + Number.EPSILON);
      } else {
        if (normalized[i] < startCoords[i] || normalized[i] > endCoords[i]) {
          return 0;
        } else if (normalized[i] < tupleCoords[i]) {
          factor = factor * (normalized[i] - startCoords[i] + Number.EPSILON) / (tupleCoords[i] - startCoords[i] + Number.EPSILON);
        } else {
          factor = factor * (endCoords[i] - normalized[i] + Number.EPSILON) / (endCoords[i] - tupleCoords[i] + Number.EPSILON);
        }
      }
    }

    return factor;
  } // Interpolates points without delta values.
  // Needed for the Ø and Q glyphs in Skia.
  // Algorithm from Freetype.
  ;

  _proto.interpolateMissingDeltas = function interpolateMissingDeltas(points, inPoints, hasDelta) {
    if (points.length === 0) {
      return;
    }

    var point = 0;

    while (point < points.length) {
      var firstPoint = point; // find the end point of the contour

      var endPoint = point;
      var pt = points[endPoint];

      while (!pt.endContour) {
        pt = points[++endPoint];
      } // find the first point that has a delta


      while (point <= endPoint && !hasDelta[point]) {
        point++;
      }

      if (point > endPoint) {
        continue;
      }

      var firstDelta = point;
      var curDelta = point;
      point++;

      while (point <= endPoint) {
        // find the next point with a delta, and interpolate intermediate points
        if (hasDelta[point]) {
          this.deltaInterpolate(curDelta + 1, point - 1, curDelta, point, inPoints, points);
          curDelta = point;
        }

        point++;
      } // shift contour if we only have a single delta


      if (curDelta === firstDelta) {
        this.deltaShift(firstPoint, endPoint, curDelta, inPoints, points);
      } else {
        // otherwise, handle the remaining points at the end and beginning of the contour
        this.deltaInterpolate(curDelta + 1, endPoint, curDelta, firstDelta, inPoints, points);

        if (firstDelta > 0) {
          this.deltaInterpolate(firstPoint, firstDelta - 1, curDelta, firstDelta, inPoints, points);
        }
      }

      point = endPoint + 1;
    }
  };

  _proto.deltaInterpolate = function deltaInterpolate(p1, p2, ref1, ref2, inPoints, outPoints) {
    if (p1 > p2) {
      return;
    }

    var iterable = ['x', 'y'];

    for (var i = 0; i < iterable.length; i++) {
      var k = iterable[i];

      if (inPoints[ref1][k] > inPoints[ref2][k]) {
        var p = ref1;
        ref1 = ref2;
        ref2 = p;
      }

      var in1 = inPoints[ref1][k];
      var in2 = inPoints[ref2][k];
      var out1 = outPoints[ref1][k];
      var out2 = outPoints[ref2][k]; // If the reference points have the same coordinate but different
      // delta, inferred delta is zero.  Otherwise interpolate.

      if (in1 !== in2 || out1 === out2) {
        var scale = in1 === in2 ? 0 : (out2 - out1) / (in2 - in1);

        for (var _p = p1; _p <= p2; _p++) {
          var out = inPoints[_p][k];

          if (out <= in1) {
            out += out1 - in1;
          } else if (out >= in2) {
            out += out2 - in2;
          } else {
            out = out1 + (out - in1) * scale;
          }

          outPoints[_p][k] = out;
        }
      }
    }
  };

  _proto.deltaShift = function deltaShift(p1, p2, ref, inPoints, outPoints) {
    var deltaX = outPoints[ref].x - inPoints[ref].x;
    var deltaY = outPoints[ref].y - inPoints[ref].y;

    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    for (var p = p1; p <= p2; p++) {
      if (p !== ref) {
        outPoints[p].x += deltaX;
        outPoints[p].y += deltaY;
      }
    }
  };

  _proto.getAdvanceAdjustment = function getAdvanceAdjustment(gid, table) {
    var outerIndex, innerIndex;

    if (table.advanceWidthMapping) {
      var idx = gid;

      if (idx >= table.advanceWidthMapping.mapCount) {
        idx = table.advanceWidthMapping.mapCount - 1;
      }

      table.advanceWidthMapping.entryFormat;
      var _table$advanceWidthMa = table.advanceWidthMapping.mapData[idx];
      outerIndex = _table$advanceWidthMa.outerIndex;
      innerIndex = _table$advanceWidthMa.innerIndex;
    } else {
      outerIndex = 0;
      innerIndex = gid;
    }

    return this.getDelta(table.itemVariationStore, outerIndex, innerIndex);
  } // See pseudo code from `Font Variations Overview'
  // in the OpenType specification.
  ;

  _proto.getDelta = function getDelta(itemStore, outerIndex, innerIndex) {
    if (outerIndex >= itemStore.itemVariationData.length) {
      return 0;
    }

    var varData = itemStore.itemVariationData[outerIndex];

    if (innerIndex >= varData.deltaSets.length) {
      return 0;
    }

    var deltaSet = varData.deltaSets[innerIndex];
    var blendVector = this.getBlendVector(itemStore, outerIndex);
    var netAdjustment = 0;

    for (var master = 0; master < varData.regionIndexCount; master++) {
      netAdjustment += deltaSet.deltas[master] * blendVector[master];
    }

    return netAdjustment;
  };

  _proto.getBlendVector = function getBlendVector(itemStore, outerIndex) {
    var varData = itemStore.itemVariationData[outerIndex];

    if (this.blendVectors.has(varData)) {
      return this.blendVectors.get(varData);
    }

    var normalizedCoords = this.normalizedCoords;
    var blendVector = []; // outer loop steps through master designs to be blended

    for (var master = 0; master < varData.regionIndexCount; master++) {
      var scalar = 1;
      var regionIndex = varData.regionIndexes[master];
      var axes = itemStore.variationRegionList.variationRegions[regionIndex]; // inner loop steps through axes in this region

      for (var j = 0; j < axes.length; j++) {
        var axis = axes[j];
        var axisScalar = void 0; // compute the scalar contribution of this axis
        // ignore invalid ranges

        if (axis.startCoord > axis.peakCoord || axis.peakCoord > axis.endCoord) {
          axisScalar = 1;
        } else if (axis.startCoord < 0 && axis.endCoord > 0 && axis.peakCoord !== 0) {
          axisScalar = 1; // peak of 0 means ignore this axis
        } else if (axis.peakCoord === 0) {
          axisScalar = 1; // ignore this region if coords are out of range
        } else if (normalizedCoords[j] < axis.startCoord || normalizedCoords[j] > axis.endCoord) {
          axisScalar = 0; // calculate a proportional factor
        } else {
          if (normalizedCoords[j] === axis.peakCoord) {
            axisScalar = 1;
          } else if (normalizedCoords[j] < axis.peakCoord) {
            axisScalar = (normalizedCoords[j] - axis.startCoord + Number.EPSILON) / (axis.peakCoord - axis.startCoord + Number.EPSILON);
          } else {
            axisScalar = (axis.endCoord - normalizedCoords[j] + Number.EPSILON) / (axis.endCoord - axis.peakCoord + Number.EPSILON);
          }
        } // take product of all the axis scalars


        scalar *= axisScalar;
      }

      blendVector[master] = scalar;
    }

    this.blendVectors.set(varData, blendVector);
    return blendVector;
  };

  return GlyphVariationProcessor;
}();

var resolved = Promise.resolve();

var Subset = /*#__PURE__*/function () {
  function Subset(font) {
    this.font = font;
    this.glyphs = [];
    this.mapping = {}; // always include the missing glyph

    this.includeGlyph(0);
  }

  var _proto = Subset.prototype;

  _proto.includeGlyph = function includeGlyph(glyph) {
    if (typeof glyph === 'object') {
      glyph = glyph.id;
    }

    if (this.mapping[glyph] == null) {
      this.glyphs.push(glyph);
      this.mapping[glyph] = this.glyphs.length - 1;
    }

    return this.mapping[glyph];
  };

  _proto.encodeStream = function encodeStream() {
    var _this = this;

    var s = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().EncodeStream)();
    resolved.then(function () {
      _this.encode(s);

      return s.end();
    });
    return s;
  };

  return Subset;
}();

var ON_CURVE = 1 << 0;
var X_SHORT_VECTOR = 1 << 1;
var Y_SHORT_VECTOR = 1 << 2;
var REPEAT = 1 << 3;
var SAME_X = 1 << 4;
var SAME_Y = 1 << 5;

var Point = /*#__PURE__*/function () {
  function Point() {}

  Point.size = function size(val) {
    return val >= 0 && val <= 255 ? 1 : 2;
  };

  Point.encode = function encode(stream, value) {
    if (value >= 0 && value <= 255) {
      stream.writeUInt8(value);
    } else {
      stream.writeInt16BE(value);
    }
  };

  return Point;
}();

var Glyf = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  numberOfContours: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  // if negative, this is a composite glyph
  xMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yMin: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  xMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  yMax: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  endPtsOfContours: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'numberOfContours'),
  instructions: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  flags: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 0),
  xPoints: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Point, 0),
  yPoints: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Point, 0)
});
/**
 * Encodes TrueType glyph outlines
 */

var TTFGlyphEncoder = /*#__PURE__*/function () {
  function TTFGlyphEncoder() {}

  var _proto = TTFGlyphEncoder.prototype;

  _proto.encodeSimple = function encodeSimple(path, instructions) {
    if (instructions === void 0) {
      instructions = [];
    }

    var endPtsOfContours = [];
    var xPoints = [];
    var yPoints = [];
    var flags = [];
    var same = 0;
    var lastX = 0,
        lastY = 0,
        lastFlag = 0;
    var pointCount = 0;

    for (var i = 0; i < path.commands.length; i++) {
      var c = path.commands[i];

      for (var j = 0; j < c.args.length; j += 2) {
        var x = c.args[j];
        var y = c.args[j + 1];
        var flag = 0; // If the ending point of a quadratic curve is the midpoint
        // between the control point and the control point of the next
        // quadratic curve, we can omit the ending point.

        if (c.command === 'quadraticCurveTo' && j === 2) {
          var next = path.commands[i + 1];

          if (next && next.command === 'quadraticCurveTo') {
            var midX = (lastX + next.args[0]) / 2;
            var midY = (lastY + next.args[1]) / 2;

            if (x === midX && y === midY) {
              continue;
            }
          }
        } // All points except control points are on curve.


        if (!(c.command === 'quadraticCurveTo' && j === 0)) {
          flag |= ON_CURVE;
        }

        flag = this._encodePoint(x, lastX, xPoints, flag, X_SHORT_VECTOR, SAME_X);
        flag = this._encodePoint(y, lastY, yPoints, flag, Y_SHORT_VECTOR, SAME_Y);

        if (flag === lastFlag && same < 255) {
          flags[flags.length - 1] |= REPEAT;
          same++;
        } else {
          if (same > 0) {
            flags.push(same);
            same = 0;
          }

          flags.push(flag);
          lastFlag = flag;
        }

        lastX = x;
        lastY = y;
        pointCount++;
      }

      if (c.command === 'closePath') {
        endPtsOfContours.push(pointCount - 1);
      }
    } // Close the path if the last command didn't already


    if (path.commands.length > 1 && path.commands[path.commands.length - 1].command !== 'closePath') {
      endPtsOfContours.push(pointCount - 1);
    }

    var bbox = path.bbox;
    var glyf = {
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
    };
    var size = Glyf.size(glyf);
    var tail = 4 - size % 4;
    var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().EncodeStream)(size + tail);
    Glyf.encode(stream, glyf); // Align to 4-byte length

    if (tail !== 0) {
      stream.fill(0, tail);
    }

    return stream.buffer;
  };

  _proto._encodePoint = function _encodePoint(value, last, points, flag, shortFlag, sameFlag) {
    var diff = value - last;

    if (value === last) {
      flag |= sameFlag;
    } else {
      if (-255 <= diff && diff <= 255) {
        flag |= shortFlag;

        if (diff < 0) {
          diff = -diff;
        } else {
          flag |= sameFlag;
        }
      }

      points.push(diff);
    }

    return flag;
  };

  return TTFGlyphEncoder;
}();

var TTFSubset = /*#__PURE__*/function (_Subset) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(TTFSubset, _Subset);

  function TTFSubset(font) {
    var _this;

    _this = _Subset.call(this, font) || this;
    _this.glyphEncoder = new TTFGlyphEncoder();
    return _this;
  }

  var _proto = TTFSubset.prototype;

  _proto._addGlyph = function _addGlyph(gid) {
    var glyph = this.font.getGlyph(gid);

    var glyf = glyph._decode(); // get the offset to the glyph from the loca table


    var curOffset = this.font.loca.offsets[gid];
    var nextOffset = this.font.loca.offsets[gid + 1];

    var stream = this.font._getTableStream('glyf');

    stream.pos += curOffset;
    var buffer = stream.readBuffer(nextOffset - curOffset); // if it is a compound glyph, include its components

    if (glyf && glyf.numberOfContours < 0) {
      buffer = Buffer.from(buffer);

      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(glyf.components), _step; !(_step = _iterator()).done;) {
        var component = _step.value;
        gid = this.includeGlyph(component.glyphID);
        buffer.writeUInt16BE(gid, component.pos);
      }
    } else if (glyf && this.font._variationProcessor) {
      // If this is a TrueType variation glyph, re-encode the path
      buffer = this.glyphEncoder.encodeSimple(glyph.path, glyf.instructions);
    }

    this.glyf.push(buffer);
    this.loca.offsets.push(this.offset);
    this.hmtx.metrics.push({
      advance: glyph.advanceWidth,
      bearing: glyph._getMetrics().leftBearing
    });
    this.offset += buffer.length;
    return this.glyf.length - 1;
  };

  _proto.encode = function encode(stream) {
    // tables required by PDF spec:
    //   head, hhea, loca, maxp, cvt , prep, glyf, hmtx, fpgm
    //
    // additional tables required for standalone fonts:
    //   name, cmap, OS/2, post
    this.glyf = [];
    this.offset = 0;
    this.loca = {
      offsets: [],
      version: this.font.loca.version
    };
    this.hmtx = {
      metrics: [],
      bearings: []
    }; // include all the glyphs
    // not using a for loop because we need to support adding more
    // glyphs to the array as we go, and CoffeeScript caches the length.

    var i = 0;

    while (i < this.glyphs.length) {
      this._addGlyph(this.glyphs[i++]);
    }

    var maxp = clone__WEBPACK_IMPORTED_MODULE_6___default()(this.font.maxp);
    maxp.numGlyphs = this.glyf.length;
    this.loca.offsets.push(this.offset);
    var head = clone__WEBPACK_IMPORTED_MODULE_6___default()(this.font.head);
    head.indexToLocFormat = this.loca.version;
    var hhea = clone__WEBPACK_IMPORTED_MODULE_6___default()(this.font.hhea);
    hhea.numberOfMetrics = this.hmtx.metrics.length; // map = []
    // for index in [0...256]
    //     if index < @numGlyphs
    //         map[index] = index
    //     else
    //         map[index] = 0
    //
    // cmapTable =
    //     version: 0
    //     length: 262
    //     language: 0
    //     codeMap: map
    //
    // cmap =
    //     version: 0
    //     numSubtables: 1
    //     tables: [
    //         platformID: 1
    //         encodingID: 0
    //         table: cmapTable
    //     ]
    // TODO: subset prep, cvt, fpgm?

    Directory.encode(stream, {
      tables: {
        head: head,
        hhea: hhea,
        loca: this.loca,
        maxp: maxp,
        'cvt ': this.font['cvt '],
        prep: this.font.prep,
        glyf: this.glyf,
        hmtx: this.hmtx,
        fpgm: this.font.fpgm // name: clone @font.name
        // 'OS/2': clone @font['OS/2']
        // post: clone @font.post
        // cmap: cmap

      }
    });
  };

  return TTFSubset;
}(Subset);

var CFFSubset = /*#__PURE__*/function (_Subset) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(CFFSubset, _Subset);

  function CFFSubset(font) {
    var _this;

    _this = _Subset.call(this, font) || this;
    _this.cff = _this.font['CFF '];

    if (!_this.cff) {
      throw new Error('Not a CFF Font');
    }

    return _this;
  }

  var _proto = CFFSubset.prototype;

  _proto.subsetCharstrings = function subsetCharstrings() {
    this.charstrings = [];
    var gsubrs = {};

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.glyphs), _step; !(_step = _iterator()).done;) {
      var gid = _step.value;
      this.charstrings.push(this.cff.getCharString(gid));
      var glyph = this.font.getGlyph(gid);
      glyph.path; // this causes the glyph to be parsed

      for (var subr in glyph._usedGsubrs) {
        gsubrs[subr] = true;
      }
    }

    this.gsubrs = this.subsetSubrs(this.cff.globalSubrIndex, gsubrs);
  };

  _proto.subsetSubrs = function subsetSubrs(subrs, used) {
    var res = [];

    for (var i = 0; i < subrs.length; i++) {
      var subr = subrs[i];

      if (used[i]) {
        this.cff.stream.pos = subr.offset;
        res.push(this.cff.stream.readBuffer(subr.length));
      } else {
        res.push(Buffer.from([11])); // return
      }
    }

    return res;
  };

  _proto.subsetFontdict = function subsetFontdict(topDict) {
    topDict.FDArray = [];
    topDict.FDSelect = {
      version: 0,
      fds: []
    };
    var used_fds = {};
    var used_subrs = [];

    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.glyphs), _step2; !(_step2 = _iterator2()).done;) {
      var gid = _step2.value;
      var fd = this.cff.fdForGlyph(gid);

      if (fd == null) {
        continue;
      }

      if (!used_fds[fd]) {
        topDict.FDArray.push(Object.assign({}, this.cff.topDict.FDArray[fd]));
        used_subrs.push({});
      }

      used_fds[fd] = true;
      topDict.FDSelect.fds.push(topDict.FDArray.length - 1);
      var glyph = this.font.getGlyph(gid);
      glyph.path; // this causes the glyph to be parsed

      for (var subr in glyph._usedSubrs) {
        used_subrs[used_subrs.length - 1][subr] = true;
      }
    }

    for (var i = 0; i < topDict.FDArray.length; i++) {
      var dict = topDict.FDArray[i];
      delete dict.FontName;

      if (dict.Private && dict.Private.Subrs) {
        dict.Private = Object.assign({}, dict.Private);
        dict.Private.Subrs = this.subsetSubrs(dict.Private.Subrs, used_subrs[i]);
      }
    }

    return;
  };

  _proto.createCIDFontdict = function createCIDFontdict(topDict) {
    var used_subrs = {};

    for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.glyphs), _step3; !(_step3 = _iterator3()).done;) {
      var gid = _step3.value;
      var glyph = this.font.getGlyph(gid);
      glyph.path; // this causes the glyph to be parsed

      for (var subr in glyph._usedSubrs) {
        used_subrs[subr] = true;
      }
    }

    var privateDict = Object.assign({}, this.cff.topDict.Private);

    if (this.cff.topDict.Private && this.cff.topDict.Private.Subrs) {
      privateDict.Subrs = this.subsetSubrs(this.cff.topDict.Private.Subrs, used_subrs);
    }

    topDict.FDArray = [{
      Private: privateDict
    }];
    return topDict.FDSelect = {
      version: 3,
      nRanges: 1,
      ranges: [{
        first: 0,
        fd: 0
      }],
      sentinel: this.charstrings.length
    };
  };

  _proto.addString = function addString(string) {
    if (!string) {
      return null;
    }

    if (!this.strings) {
      this.strings = [];
    }

    this.strings.push(string);
    return standardStrings.length + this.strings.length - 1;
  };

  _proto.encode = function encode(stream) {
    this.subsetCharstrings();
    var charset = {
      version: this.charstrings.length > 255 ? 2 : 1,
      ranges: [{
        first: 1,
        nLeft: this.charstrings.length - 2
      }]
    };
    var topDict = Object.assign({}, this.cff.topDict);
    topDict.Private = null;
    topDict.charset = charset;
    topDict.Encoding = null;
    topDict.CharStrings = this.charstrings;

    for (var _i = 0, _arr = ['version', 'Notice', 'Copyright', 'FullName', 'FamilyName', 'Weight', 'PostScript', 'BaseFontName', 'FontName']; _i < _arr.length; _i++) {
      var key = _arr[_i];
      topDict[key] = this.addString(this.cff.string(topDict[key]));
    }

    topDict.ROS = [this.addString('Adobe'), this.addString('Identity'), 0];
    topDict.CIDCount = this.charstrings.length;

    if (this.cff.isCIDFont) {
      this.subsetFontdict(topDict);
    } else {
      this.createCIDFontdict(topDict);
    }

    var top = {
      version: 1,
      hdrSize: this.cff.hdrSize,
      offSize: 4,
      header: this.cff.header,
      nameIndex: [this.cff.postscriptName],
      topDictIndex: [topDict],
      stringIndex: this.strings,
      globalSubrIndex: this.gsubrs
    };
    CFFTop.encode(stream, top);
  };

  return CFFSubset;
}(Subset);

var _class;
/**
 * This is the base class for all SFNT-based font formats in fontkit.
 * It supports TrueType, and PostScript glyphs, and several color glyph formats.
 */

var TTFFont = (_class = /*#__PURE__*/function () {
  TTFFont.probe = function probe(buffer) {
    var format = buffer.toString('ascii', 0, 4);
    return format === 'true' || format === 'OTTO' || format === String.fromCharCode(0, 1, 0, 0);
  };

  function TTFFont(stream, variationCoords) {
    if (variationCoords === void 0) {
      variationCoords = null;
    }

    this.defaultLanguage = null;
    this.stream = stream;
    this.variationCoords = variationCoords;
    this._directoryPos = this.stream.pos;
    this._tables = {};
    this._glyphs = {};

    this._decodeDirectory(); // define properties for each table to lazily parse


    for (var tag in this.directory.tables) {
      var table = this.directory.tables[tag];

      if (tables[tag] && table.length > 0) {
        Object.defineProperty(this, tag, {
          get: this._getTable.bind(this, table)
        });
      }
    }
  }

  var _proto = TTFFont.prototype;

  _proto.setDefaultLanguage = function setDefaultLanguage(lang) {
    if (lang === void 0) {
      lang = null;
    }

    this.defaultLanguage = lang;
  };

  _proto._getTable = function _getTable(table) {
    if (!(table.tag in this._tables)) {
      try {
        this._tables[table.tag] = this._decodeTable(table);
      } catch (e) {
        if (fontkit.logErrors) {
          console.error("Error decoding table " + table.tag);
          console.error(e.stack);
        }
      }
    }

    return this._tables[table.tag];
  };

  _proto._getTableStream = function _getTableStream(tag) {
    var table = this.directory.tables[tag];

    if (table) {
      this.stream.pos = table.offset;
      return this.stream;
    }

    return null;
  };

  _proto._decodeDirectory = function _decodeDirectory() {
    return this.directory = Directory.decode(this.stream, {
      _startOffset: 0
    });
  };

  _proto._decodeTable = function _decodeTable(table) {
    var pos = this.stream.pos;

    var stream = this._getTableStream(table.tag);

    var result = tables[table.tag].decode(stream, this, table.length);
    this.stream.pos = pos;
    return result;
  }
  /**
   * Gets a string from the font's `name` table
   * `lang` is a BCP-47 language code.
   * @return {string}
   */
  ;

  _proto.getName = function getName(key, lang) {
    if (lang === void 0) {
      lang = this.defaultLanguage || fontkit.defaultLanguage;
    }

    var record = this.name && this.name.records[key];

    if (record) {
      // Attempt to retrieve the entry, depending on which translation is available:
      return record[lang] || record[this.defaultLanguage] || record[fontkit.defaultLanguage] || record['en'] || record[Object.keys(record)[0]] // Seriously, ANY language would be fine
      || null;
    }

    return null;
  }
  /**
   * The unique PostScript name for this font, e.g. "Helvetica-Bold"
   * @type {string}
   */
  ;

  /**
   * Returns whether there is glyph in the font for the given unicode code point.
   *
   * @param {number} codePoint
   * @return {boolean}
   */
  _proto.hasGlyphForCodePoint = function hasGlyphForCodePoint(codePoint) {
    return !!this._cmapProcessor.lookup(codePoint);
  }
  /**
   * Maps a single unicode code point to a Glyph object.
   * Does not perform any advanced substitutions (there is no context to do so).
   *
   * @param {number} codePoint
   * @return {Glyph}
   */
  ;

  _proto.glyphForCodePoint = function glyphForCodePoint(codePoint) {
    return this.getGlyph(this._cmapProcessor.lookup(codePoint), [codePoint]);
  }
  /**
   * Returns an array of Glyph objects for the given string.
   * This is only a one-to-one mapping from characters to glyphs.
   * For most uses, you should use font.layout (described below), which
   * provides a much more advanced mapping supporting AAT and OpenType shaping.
   *
   * @param {string} string
   * @return {Glyph[]}
   */
  ;

  _proto.glyphsForString = function glyphsForString(string) {
    var glyphs = [];
    var len = string.length;
    var idx = 0;
    var last = -1;
    var state = -1;

    while (idx <= len) {
      var code = 0;
      var nextState = 0;

      if (idx < len) {
        // Decode the next codepoint from UTF 16
        code = string.charCodeAt(idx++);

        if (0xd800 <= code && code <= 0xdbff && idx < len) {
          var next = string.charCodeAt(idx);

          if (0xdc00 <= next && next <= 0xdfff) {
            idx++;
            code = ((code & 0x3ff) << 10) + (next & 0x3ff) + 0x10000;
          }
        } // Compute the next state: 1 if the next codepoint is a variation selector, 0 otherwise.


        nextState = 0xfe00 <= code && code <= 0xfe0f || 0xe0100 <= code && code <= 0xe01ef ? 1 : 0;
      } else {
        idx++;
      }

      if (state === 0 && nextState === 1) {
        // Variation selector following normal codepoint.
        glyphs.push(this.getGlyph(this._cmapProcessor.lookup(last, code), [last, code]));
      } else if (state === 0 && nextState === 0) {
        // Normal codepoint following normal codepoint.
        glyphs.push(this.glyphForCodePoint(last));
      }

      last = code;
      state = nextState;
    }

    return glyphs;
  };

  /**
   * Returns a GlyphRun object, which includes an array of Glyphs and GlyphPositions for the given string.
   *
   * @param {string} string
   * @param {string[]} [userFeatures]
   * @param {string} [script]
   * @param {string} [language]
   * @param {string} [direction]
   * @return {GlyphRun}
   */
  _proto.layout = function layout(string, userFeatures, script, language, direction) {
    return this._layoutEngine.layout(string, userFeatures, script, language, direction);
  }
  /**
   * Returns an array of strings that map to the given glyph id.
   * @param {number} gid - glyph id
   */
  ;

  _proto.stringsForGlyph = function stringsForGlyph(gid) {
    return this._layoutEngine.stringsForGlyph(gid);
  }
  /**
   * An array of all [OpenType feature tags](https://www.microsoft.com/typography/otspec/featuretags.htm)
   * (or mapped AAT tags) supported by the font.
   * The features parameter is an array of OpenType feature tags to be applied in addition to the default set.
   * If this is an AAT font, the OpenType feature tags are mapped to AAT features.
   *
   * @type {string[]}
   */
  ;

  _proto.getAvailableFeatures = function getAvailableFeatures(script, language) {
    return this._layoutEngine.getAvailableFeatures(script, language);
  };

  _proto._getBaseGlyph = function _getBaseGlyph(glyph, characters) {
    if (characters === void 0) {
      characters = [];
    }

    if (!this._glyphs[glyph]) {
      if (this.directory.tables.glyf) {
        this._glyphs[glyph] = new TTFGlyph(glyph, characters, this);
      } else if (this.directory.tables['CFF '] || this.directory.tables.CFF2) {
        this._glyphs[glyph] = new CFFGlyph(glyph, characters, this);
      }
    }

    return this._glyphs[glyph] || null;
  }
  /**
   * Returns a glyph object for the given glyph id.
   * You can pass the array of code points this glyph represents for
   * your use later, and it will be stored in the glyph object.
   *
   * @param {number} glyph
   * @param {number[]} characters
   * @return {Glyph}
   */
  ;

  _proto.getGlyph = function getGlyph(glyph, characters) {
    if (characters === void 0) {
      characters = [];
    }

    if (!this._glyphs[glyph]) {
      if (this.directory.tables.sbix) {
        this._glyphs[glyph] = new SBIXGlyph(glyph, characters, this);
      } else if (this.directory.tables.COLR && this.directory.tables.CPAL) {
        this._glyphs[glyph] = new COLRGlyph(glyph, characters, this);
      } else {
        this._getBaseGlyph(glyph, characters);
      }
    }

    return this._glyphs[glyph] || null;
  }
  /**
   * Returns a Subset for this font.
   * @return {Subset}
   */
  ;

  _proto.createSubset = function createSubset() {
    if (this.directory.tables['CFF ']) {
      return new CFFSubset(this);
    }

    return new TTFSubset(this);
  }
  /**
   * Returns an object describing the available variation axes
   * that this font supports. Keys are setting tags, and values
   * contain the axis name, range, and default value.
   *
   * @type {object}
   */
  ;

  /**
   * Returns a new font with the given variation settings applied.
   * Settings can either be an instance name, or an object containing
   * variation tags as specified by the `variationAxes` property.
   *
   * @param {object} settings
   * @return {TTFFont}
   */
  _proto.getVariation = function getVariation(settings) {
    if (!(this.directory.tables.fvar && (this.directory.tables.gvar && this.directory.tables.glyf || this.directory.tables.CFF2))) {
      throw new Error('Variations require a font with the fvar, gvar and glyf, or CFF2 tables.');
    }

    if (typeof settings === 'string') {
      settings = this.namedVariations[settings];
    }

    if (typeof settings !== 'object') {
      throw new Error('Variation settings must be either a variation name or settings object.');
    } // normalize the coordinates


    var coords = this.fvar.axis.map(function (axis, i) {
      var axisTag = axis.axisTag.trim();

      if (axisTag in settings) {
        return Math.max(axis.minValue, Math.min(axis.maxValue, settings[axisTag]));
      } else {
        return axis.defaultValue;
      }
    });
    var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(this.stream.buffer);
    stream.pos = this._directoryPos;
    var font = new TTFFont(stream, coords);
    font._tables = this._tables;
    return font;
  };

  // Standardized format plugin API
  _proto.getFont = function getFont(name) {
    return this.getVariation(name);
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(TTFFont, [{
    key: "postscriptName",
    get: function get() {
      return this.getName('postscriptName');
    }
    /**
     * The font's full name, e.g. "Helvetica Bold"
     * @type {string}
     */

  }, {
    key: "fullName",
    get: function get() {
      return this.getName('fullName');
    }
    /**
     * The font's family name, e.g. "Helvetica"
     * @type {string}
     */

  }, {
    key: "familyName",
    get: function get() {
      return this.getName('fontFamily');
    }
    /**
     * The font's sub-family, e.g. "Bold".
     * @type {string}
     */

  }, {
    key: "subfamilyName",
    get: function get() {
      return this.getName('fontSubfamily');
    }
    /**
     * The font's copyright information
     * @type {string}
     */

  }, {
    key: "copyright",
    get: function get() {
      return this.getName('copyright');
    }
    /**
     * The font's version number
     * @type {string}
     */

  }, {
    key: "version",
    get: function get() {
      return this.getName('version');
    }
    /**
     * The font’s [ascender](https://en.wikipedia.org/wiki/Ascender_(typography))
     * @type {number}
     */

  }, {
    key: "ascent",
    get: function get() {
      return this.hhea.ascent;
    }
    /**
     * The font’s [descender](https://en.wikipedia.org/wiki/Descender)
     * @type {number}
     */

  }, {
    key: "descent",
    get: function get() {
      return this.hhea.descent;
    }
    /**
     * The amount of space that should be included between lines
     * @type {number}
     */

  }, {
    key: "lineGap",
    get: function get() {
      return this.hhea.lineGap;
    }
    /**
     * The offset from the normal underline position that should be used
     * @type {number}
     */

  }, {
    key: "underlinePosition",
    get: function get() {
      return this.post.underlinePosition;
    }
    /**
     * The weight of the underline that should be used
     * @type {number}
     */

  }, {
    key: "underlineThickness",
    get: function get() {
      return this.post.underlineThickness;
    }
    /**
     * If this is an italic font, the angle the cursor should be drawn at to match the font design
     * @type {number}
     */

  }, {
    key: "italicAngle",
    get: function get() {
      return this.post.italicAngle;
    }
    /**
     * The height of capital letters above the baseline.
     * See [here](https://en.wikipedia.org/wiki/Cap_height) for more details.
     * @type {number}
     */

  }, {
    key: "capHeight",
    get: function get() {
      var os2 = this['OS/2'];
      return os2 ? os2.capHeight : this.ascent;
    }
    /**
     * The height of lower case letters in the font.
     * See [here](https://en.wikipedia.org/wiki/X-height) for more details.
     * @type {number}
     */

  }, {
    key: "xHeight",
    get: function get() {
      var os2 = this['OS/2'];
      return os2 ? os2.xHeight : 0;
    }
    /**
     * The number of glyphs in the font.
     * @type {number}
     */

  }, {
    key: "numGlyphs",
    get: function get() {
      return this.maxp.numGlyphs;
    }
    /**
     * The size of the font’s internal coordinate grid
     * @type {number}
     */

  }, {
    key: "unitsPerEm",
    get: function get() {
      return this.head.unitsPerEm;
    }
    /**
     * The font’s bounding box, i.e. the box that encloses all glyphs in the font.
     * @type {BBox}
     */

  }, {
    key: "bbox",
    get: function get() {
      return Object.freeze(new BBox(this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax));
    }
  }, {
    key: "_cmapProcessor",
    get: function get() {
      return new CmapProcessor(this.cmap);
    }
    /**
     * An array of all of the unicode code points supported by the font.
     * @type {number[]}
     */

  }, {
    key: "characterSet",
    get: function get() {
      return this._cmapProcessor.getCharacterSet();
    }
  }, {
    key: "_layoutEngine",
    get: function get() {
      return new LayoutEngine(this);
    }
  }, {
    key: "availableFeatures",
    get: function get() {
      return this._layoutEngine.getAvailableFeatures();
    }
  }, {
    key: "variationAxes",
    get: function get() {
      var res = {};

      if (!this.fvar) {
        return res;
      }

      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.fvar.axis), _step; !(_step = _iterator()).done;) {
        var axis = _step.value;
        res[axis.axisTag.trim()] = {
          name: axis.name.en,
          min: axis.minValue,
          default: axis.defaultValue,
          max: axis.maxValue
        };
      }

      return res;
    }
    /**
     * Returns an object describing the named variation instances
     * that the font designer has specified. Keys are variation names
     * and values are the variation settings for this instance.
     *
     * @type {object}
     */

  }, {
    key: "namedVariations",
    get: function get() {
      var res = {};

      if (!this.fvar) {
        return res;
      }

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.fvar.instance), _step2; !(_step2 = _iterator2()).done;) {
        var instance = _step2.value;
        var settings = {};

        for (var i = 0; i < this.fvar.axis.length; i++) {
          var axis = this.fvar.axis[i];
          settings[axis.axisTag.trim()] = instance.coord[i];
        }

        res[instance.name.en] = settings;
      }

      return res;
    }
  }, {
    key: "_variationProcessor",
    get: function get() {
      if (!this.fvar) {
        return null;
      }

      var variationCoords = this.variationCoords; // Ignore if no variation coords and not CFF2

      if (!variationCoords && !this.CFF2) {
        return null;
      }

      if (!variationCoords) {
        variationCoords = this.fvar.axis.map(function (axis) {
          return axis.defaultValue;
        });
      }

      return new GlyphVariationProcessor(this, variationCoords);
    }
  }]);

  return TTFFont;
}(), ((0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "bbox", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "bbox"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "_cmapProcessor", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "_cmapProcessor"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "characterSet", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "characterSet"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "_layoutEngine", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "_layoutEngine"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "variationAxes", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "variationAxes"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "namedVariations", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "namedVariations"), _class.prototype), (0,_babel_runtime_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(_class.prototype, "_variationProcessor", [cache], Object.getOwnPropertyDescriptor(_class.prototype, "_variationProcessor"), _class.prototype)), _class);

var WOFFDirectoryEntry = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  offset: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'void', {
    type: 'global'
  }),
  compLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  origChecksum: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var WOFFDirectory = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  tag: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  // should be 'wOFF'
  flavor: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  numTables: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16)),
  totalSfntSize: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  majorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  minorVersion: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  metaOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  metaLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  metaOrigLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  privOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  privLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  tables: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(WOFFDirectoryEntry, 'numTables')
});

WOFFDirectory.process = function () {
  var tables = {};

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.tables), _step; !(_step = _iterator()).done;) {
    var table = _step.value;
    tables[table.tag] = table;
  }

  this.tables = tables;
};

var WOFFFont = /*#__PURE__*/function (_TTFFont) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(WOFFFont, _TTFFont);

  function WOFFFont() {
    return _TTFFont.apply(this, arguments) || this;
  }

  WOFFFont.probe = function probe(buffer) {
    return buffer.toString('ascii', 0, 4) === 'wOFF';
  };

  var _proto = WOFFFont.prototype;

  _proto._decodeDirectory = function _decodeDirectory() {
    this.directory = WOFFDirectory.decode(this.stream, {
      _startOffset: 0
    });
  };

  _proto._getTableStream = function _getTableStream(tag) {
    var table = this.directory.tables[tag];

    if (table) {
      this.stream.pos = table.offset;

      if (table.compLength < table.length) {
        this.stream.pos += 2; // skip deflate header

        var outBuffer = Buffer.alloc(table.length);
        var buf = tiny_inflate__WEBPACK_IMPORTED_MODULE_7___default()(this.stream.readBuffer(table.compLength - 2), outBuffer);
        return new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(buf);
      } else {
        return this.stream;
      }
    }

    return null;
  };

  return WOFFFont;
}(TTFFont);

var TTCHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().VersionedStruct)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), {
  0x00010000: {
    numFonts: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'numFonts')
  },
  0x00020000: {
    numFonts: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    offsets: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), 'numFonts'),
    dsigTag: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    dsigLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
    dsigOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
  }
});

var TrueTypeCollection = /*#__PURE__*/function () {
  TrueTypeCollection.probe = function probe(buffer) {
    return buffer.toString('ascii', 0, 4) === 'ttcf';
  };

  function TrueTypeCollection(stream) {
    this.stream = stream;

    if (stream.readString(4) !== 'ttcf') {
      throw new Error('Not a TrueType collection');
    }

    this.header = TTCHeader.decode(stream);
  }

  var _proto = TrueTypeCollection.prototype;

  _proto.getFont = function getFont(name) {
    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.header.offsets), _step; !(_step = _iterator()).done;) {
      var offset = _step.value;
      var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(this.stream.buffer);
      stream.pos = offset;
      var font = new TTFFont(stream);

      if (font.postscriptName === name) {
        return font;
      }
    }

    return null;
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(TrueTypeCollection, [{
    key: "fonts",
    get: function get() {
      var fonts = [];

      for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.header.offsets), _step2; !(_step2 = _iterator2()).done;) {
        var offset = _step2.value;
        var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(this.stream.buffer);
        stream.pos = offset;
        fonts.push(new TTFFont(stream));
      }

      return fonts;
    }
  }]);

  return TrueTypeCollection;
}();

var DFontName = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8));
new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  len: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  buf: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Buffer)('len')
});
var Ref = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  id: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  nameOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().int16),
  attr: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8),
  dataOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint24),
  handle: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});
var Type = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  name: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().String)(4),
  maxTypeIndex: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  refList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Ref, function (t) {
    return t.maxTypeIndex + 1;
  }), {
    type: 'parent'
  })
});
var TypeList = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  length: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16),
  types: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Array)(Type, function (t) {
    return t.length + 1;
  })
});
var DFontMap = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  reserved: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Reserved)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint8), 24),
  typeList: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), TypeList),
  nameListOffset: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint16), 'void')
});
var DFontHeader = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Struct)({
  dataOffset: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  map: new (restructure__WEBPACK_IMPORTED_MODULE_0___default().Pointer)((restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32), DFontMap),
  dataLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32),
  mapLength: (restructure__WEBPACK_IMPORTED_MODULE_0___default().uint32)
});

var DFont = /*#__PURE__*/function () {
  DFont.probe = function probe(buffer) {
    var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(buffer);

    try {
      var header = DFontHeader.decode(stream);
    } catch (e) {
      return false;
    }

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(header.map.typeList.types), _step; !(_step = _iterator()).done;) {
      var type = _step.value;

      if (type.name === 'sfnt') {
        return true;
      }
    }

    return false;
  };

  function DFont(stream) {
    this.stream = stream;
    this.header = DFontHeader.decode(this.stream);

    for (var _iterator2 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.header.map.typeList.types), _step2; !(_step2 = _iterator2()).done;) {
      var type = _step2.value;

      for (var _iterator3 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(type.refList), _step3; !(_step3 = _iterator3()).done;) {
        var ref = _step3.value;

        if (ref.nameOffset >= 0) {
          this.stream.pos = ref.nameOffset + this.header.map.nameListOffset;
          ref.name = DFontName.decode(this.stream);
        } else {
          ref.name = null;
        }
      }

      if (type.name === 'sfnt') {
        this.sfnt = type;
      }
    }
  }

  var _proto = DFont.prototype;

  _proto.getFont = function getFont(name) {
    if (!this.sfnt) {
      return null;
    }

    for (var _iterator4 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.sfnt.refList), _step4; !(_step4 = _iterator4()).done;) {
      var ref = _step4.value;
      var pos = this.header.dataOffset + ref.dataOffset + 4;
      var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(this.stream.buffer.slice(pos));
      var font = new TTFFont(stream);

      if (font.postscriptName === name) {
        return font;
      }
    }

    return null;
  };

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(DFont, [{
    key: "fonts",
    get: function get() {
      var fonts = [];

      for (var _iterator5 = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(this.sfnt.refList), _step5; !(_step5 = _iterator5()).done;) {
        var ref = _step5.value;
        var pos = this.header.dataOffset + ref.dataOffset + 4;
        var stream = new (restructure__WEBPACK_IMPORTED_MODULE_0___default().DecodeStream)(this.stream.buffer.slice(pos));
        fonts.push(new TTFFont(stream));
      }

      return fonts;
    }
  }]);

  return DFont;
}();

fontkit.registerFormat(TTFFont);
fontkit.registerFormat(WOFFFont);
fontkit.registerFormat(TrueTypeCollection);
fontkit.registerFormat(DFont);




/***/ })

}]);