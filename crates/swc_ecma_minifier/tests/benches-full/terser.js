!function(global1, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? factory(exports, require('source-map')) : 'function' == typeof define && define.amd ? define([
        'exports',
        'source-map'
    ], factory) : factory((global1 = 'undefined' != typeof globalThis ? globalThis : global1 || self).Terser = {}, global1.sourceMap);
}(this, function(exports1, MOZ_SourceMap) {
    'use strict';
    let mangle_options;
    var def_is_string, def_find_defs, MOZ_SourceMap__default = MOZ_SourceMap && 'object' == typeof MOZ_SourceMap && 'default' in MOZ_SourceMap ? MOZ_SourceMap : {
        default: MOZ_SourceMap
    };
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function characters(str) {
        return str.split("");
    }
    function member(name, array) {
        return array.includes(name);
    }
    class DefaultsError extends Error {
        constructor(msg, defs){
            super(), this.name = "DefaultsError", this.message = msg, this.defs = defs;
        }
    }
    function defaults(args, defs, croak) {
        !0 === args ? args = {} : null != args && "object" == typeof args && (args = {
            ...args
        });
        const ret = args || {};
        if (croak) {
            for(const i in ret)if (HOP(ret, i) && !HOP(defs, i)) throw new DefaultsError("`" + i + "` is not a supported option", defs);
        }
        for(const i in defs)if (HOP(defs, i)) {
            if (args && HOP(args, i)) {
                if ("ecma" === i) {
                    let ecma = 0 | args[i];
                    ecma > 5 && ecma < 2015 && (ecma += 2009), ret[i] = ecma;
                } else ret[i] = args && HOP(args, i) ? args[i] : defs[i];
            } else ret[i] = defs[i];
        }
        return ret;
    }
    function noop() {}
    function return_false() {
        return !1;
    }
    function return_true() {
        return !0;
    }
    function return_this() {
        return this;
    }
    function return_null() {
        return null;
    }
    var MAP = function() {
        function MAP(a, f, backwards) {
            var i, ret = [], top = [];
            function doit() {
                var val = f(a[i], i), is_last = val instanceof Last;
                return is_last && (val = val.v), val instanceof AtTop ? (val = val.v) instanceof Splice ? top.push.apply(top, backwards ? val.v.slice().reverse() : val.v) : top.push(val) : val !== skip && (val instanceof Splice ? ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v) : ret.push(val)), is_last;
            }
            if (Array.isArray(a)) {
                if (backwards) {
                    for(i = a.length; --i >= 0 && !doit(););
                    ret.reverse(), top.reverse();
                } else for(i = 0; i < a.length && !doit(); ++i);
            } else for(i in a)if (HOP(a, i) && doit()) break;
            return top.concat(ret);
        }
        MAP.at_top = function(val) {
            return new AtTop(val);
        }, MAP.splice = function(val) {
            return new Splice(val);
        }, MAP.last = function(val) {
            return new Last(val);
        };
        var skip = MAP.skip = {};
        function AtTop(val) {
            this.v = val;
        }
        function Splice(val) {
            this.v = val;
        }
        function Last(val) {
            this.v = val;
        }
        return MAP;
    }();
    function make_node(ctor, orig, props) {
        return props || (props = {}), orig && (props.start || (props.start = orig.start), props.end || (props.end = orig.end)), new ctor(props);
    }
    function push_uniq(array, el) {
        array.includes(el) || array.push(el);
    }
    function string_template(text, props) {
        return text.replace(/{(.+?)}/g, function(str, p) {
            return props && props[p];
        });
    }
    function remove(array, el) {
        for(var i = array.length; --i >= 0;)array[i] === el && array.splice(i, 1);
    }
    function mergeSort(array, cmp) {
        return array.length < 2 ? array.slice() : function _ms(a) {
            if (a.length <= 1) return a;
            var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
            return function(a, b) {
                for(var r = [], ai = 0, bi = 0, i = 0; ai < a.length && bi < b.length;)0 >= cmp(a[ai], b[bi]) ? r[i++] = a[ai++] : r[i++] = b[bi++];
                return ai < a.length && r.push.apply(r, a.slice(ai)), bi < b.length && r.push.apply(r, b.slice(bi)), r;
            }(left = _ms(left), right = _ms(right));
        }(array);
    }
    function makePredicate(words) {
        return Array.isArray(words) || (words = words.split(" ")), new Set(words.sort());
    }
    function map_add(map, key, value) {
        map.has(key) ? map.get(key).push(value) : map.set(key, [
            value
        ]);
    }
    function HOP(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    function keep_name(keep_setting, name) {
        return !0 === keep_setting || keep_setting instanceof RegExp && keep_setting.test(name);
    }
    var lineTerminatorEscape = {
        "\0": "0",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    function regexp_source_fix(source) {
        // V8 does not escape line terminators in regexp patterns in node 12
        // We'll also remove literal \0
        return source.replace(/[\0\n\r\u2028\u2029]/g, function(match, offset) {
            return ("\\" == source[offset - 1] && ("\\" != source[offset - 2] || /(?:^|[^\\])(?:\\{2})*$/.test(source.slice(0, offset - 1))) ? "" : "\\") + lineTerminatorEscape[match];
        });
    }
    function has_annotation(node, annotation) {
        return node._annotations & annotation;
    }
    function set_annotation(node, annotation) {
        node._annotations |= annotation;
    }
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Parser based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ var LATEST_RAW = "", LATEST_TEMPLATE_END = !0, KEYWORDS = "break case catch class const continue debugger default delete do else export extends finally for function if in instanceof let new return switch throw try typeof var void while with", KEYWORDS_ATOM = "false null true", RESERVED_WORDS = "enum import super this " + KEYWORDS_ATOM + " " + KEYWORDS, ALL_RESERVED_WORDS = "implements interface package private protected public static " + RESERVED_WORDS, KEYWORDS_BEFORE_EXPRESSION = "return new delete throw else case yield await"; // Only used for numbers and template strings
    KEYWORDS = makePredicate(KEYWORDS), RESERVED_WORDS = makePredicate(RESERVED_WORDS), KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION), KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM), ALL_RESERVED_WORDS = makePredicate(ALL_RESERVED_WORDS);
    var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^")), RE_NUM_LITERAL = /[0-9a-f]/i, RE_HEX_NUMBER = /^0x[0-9a-f]+$/i, RE_OCT_NUMBER = /^0[0-7]+$/, RE_ES6_OCT_NUMBER = /^0o[0-7]+$/i, RE_BIN_NUMBER = /^0b[01]+$/i, RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i, RE_BIG_INT = /^(0[xob])?[0-9a-f]+n$/i, OPERATORS = makePredicate([
        "in",
        "instanceof",
        "typeof",
        "new",
        "void",
        "delete",
        "++",
        "--",
        "+",
        "-",
        "!",
        "~",
        "&",
        "|",
        "^",
        "*",
        "**",
        "/",
        "%",
        ">>",
        "<<",
        ">>>",
        "<",
        ">",
        "<=",
        ">=",
        "==",
        "===",
        "!=",
        "!==",
        "?",
        "=",
        "+=",
        "-=",
        "||=",
        "&&=",
        "??=",
        "/=",
        "*=",
        "**=",
        "%=",
        ">>=",
        "<<=",
        ">>>=",
        "|=",
        "^=",
        "&=",
        "&&",
        "??",
        "||"
    ]), WHITESPACE_CHARS = makePredicate(characters(" \u00a0\n\r\t\f\u000b\u200b\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF")), NEWLINE_CHARS = makePredicate(characters("\n\r\u2028\u2029")), PUNC_AFTER_EXPRESSION = makePredicate(characters(";]),:")), PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,;:")), PUNC_CHARS = makePredicate(characters("[]{}(),;:")), UNICODE_ID_Start = /[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/, UNICODE_ID_Continue = /(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])+/;
    function get_full_char(str, pos) {
        if (is_surrogate_pair_head(str.charCodeAt(pos))) {
            if (is_surrogate_pair_tail(str.charCodeAt(pos + 1))) return str.charAt(pos) + str.charAt(pos + 1);
        } else if (is_surrogate_pair_tail(str.charCodeAt(pos)) && is_surrogate_pair_head(str.charCodeAt(pos - 1))) return str.charAt(pos - 1) + str.charAt(pos);
        return str.charAt(pos);
    }
    function is_surrogate_pair_head(code) {
        return code >= 0xd800 && code <= 0xdbff;
    }
    function is_surrogate_pair_tail(code) {
        return code >= 0xdc00 && code <= 0xdfff;
    }
    function is_digit(code) {
        return code >= 48 && code <= 57;
    }
    function is_identifier_start(ch) {
        return UNICODE_ID_Start.test(ch);
    }
    function is_identifier_char(ch) {
        return UNICODE_ID_Continue.test(ch);
    }
    const BASIC_IDENT = /^[a-z_$][a-z0-9_$]*$/i;
    function is_basic_identifier_string(str) {
        return BASIC_IDENT.test(str);
    }
    function is_identifier_string(str, allow_surrogates) {
        if (BASIC_IDENT.test(str)) return !0;
        if (!allow_surrogates && /[\ud800-\udfff]/.test(str)) return !1;
        var match = UNICODE_ID_Start.exec(str);
        return !!match && 0 === match.index && (!(str = str.slice(match[0].length)) || !!(match = UNICODE_ID_Continue.exec(str)) && match[0].length === str.length);
    }
    function parse_js_number(num, allow_e = !0) {
        if (!allow_e && num.includes("e")) return NaN;
        if (RE_HEX_NUMBER.test(num)) return parseInt(num.substr(2), 16);
        if (RE_OCT_NUMBER.test(num)) return parseInt(num.substr(1), 8);
        if (RE_ES6_OCT_NUMBER.test(num)) return parseInt(num.substr(2), 8);
        if (RE_BIN_NUMBER.test(num)) return parseInt(num.substr(2), 2);
        if (RE_DEC_NUMBER.test(num)) return parseFloat(num);
        var val = parseFloat(num);
        if (val == num) return val;
    }
    class JS_Parse_Error extends Error {
        constructor(message, filename, line, col, pos){
            super(), this.name = "SyntaxError", this.message = message, this.filename = filename, this.line = line, this.col = col, this.pos = pos;
        }
    }
    function js_error(message, filename, line, col, pos) {
        throw new JS_Parse_Error(message, filename, line, col, pos);
    }
    function is_token(token, type, val) {
        return token.type == type && (null == val || token.value == val);
    }
    var EX_EOF = {}, UNARY_PREFIX = makePredicate([
        "typeof",
        "void",
        "delete",
        "--",
        "++",
        "!",
        "~",
        "-",
        "+"
    ]), UNARY_POSTFIX = makePredicate([
        "--",
        "++"
    ]), ASSIGNMENT = makePredicate([
        "=",
        "+=",
        "-=",
        "??=",
        "&&=",
        "||=",
        "/=",
        "*=",
        "**=",
        "%=",
        ">>=",
        "<<=",
        ">>>=",
        "|=",
        "^=",
        "&="
    ]), LOGICAL_ASSIGNMENT = makePredicate([
        "??=",
        "&&=",
        "||="
    ]), PRECEDENCE = function(a, ret) {
        for(var i = 0; i < a.length; ++i)for(var b = a[i], j = 0; j < b.length; ++j)ret[b[j]] = i + 1;
        return ret;
    }([
        [
            "||"
        ],
        [
            "??"
        ],
        [
            "&&"
        ],
        [
            "|"
        ],
        [
            "^"
        ],
        [
            "&"
        ],
        [
            "==",
            "===",
            "!=",
            "!=="
        ],
        [
            "<",
            ">",
            "<=",
            ">=",
            "in",
            "instanceof"
        ],
        [
            ">>",
            "<<",
            ">>>"
        ],
        [
            "+",
            "-"
        ],
        [
            "*",
            "/",
            "%"
        ],
        [
            "**"
        ]
    ], {}), ATOMIC_START_TOKEN = makePredicate([
        "atom",
        "num",
        "big_int",
        "string",
        "regexp",
        "name"
    ]);
    /* -----[ Parser ]----- */ function parse($TEXT, options) {
        // maps start tokens to count of comments found outside of their parens
        // Example: /* I count */ ( /* I don't */ foo() )
        // Useful because comments_before property of call with parens outside
        // contains both comments inside and outside these parens. Used to find the
        const outer_comments_before_counts = new WeakMap();
        options = defaults(options, {
            bare_returns: !1,
            ecma: null,
            expression: !1,
            filename: null,
            html5_comments: !0,
            module: !1,
            shebang: !0,
            strict: !1,
            toplevel: null
        }, !0);
        var S = {
            input: "string" == typeof $TEXT ? function($TEXT, filename, html5_comments, shebang) {
                var S = {
                    text: $TEXT,
                    filename: filename,
                    pos: 0,
                    tokpos: 0,
                    line: 1,
                    tokline: 0,
                    col: 0,
                    tokcol: 0,
                    newline_before: !1,
                    regex_allowed: !1,
                    brace_counter: 0,
                    template_braces: [],
                    comments_before: [],
                    directives: {},
                    directive_stack: []
                };
                function peek() {
                    return get_full_char(S.text, S.pos);
                }
                function next(signal_eof, in_string) {
                    var ch = get_full_char(S.text, S.pos++);
                    if (signal_eof && !ch) throw EX_EOF;
                    return NEWLINE_CHARS.has(ch) ? (S.newline_before = S.newline_before || !in_string, ++S.line, S.col = 0, "\r" == ch && "\n" == peek() && (// treat a \r\n sequence as a single \n
                    ++S.pos, ch = "\n")) : (ch.length > 1 && (++S.pos, ++S.col), ++S.col), ch;
                }
                function forward(i) {
                    for(; i--;)next();
                }
                function looking_at(str) {
                    return S.text.substr(S.pos, str.length) == str;
                }
                function find(what, signal_eof) {
                    var pos = S.text.indexOf(what, S.pos);
                    if (signal_eof && -1 == pos) throw EX_EOF;
                    return pos;
                }
                function start_token() {
                    S.tokline = S.line, S.tokcol = S.col, S.tokpos = S.pos;
                }
                var prev_was_dot = !1, previous_token = null;
                function token(type, value, is_comment) {
                    S.regex_allowed = "operator" == type && !UNARY_POSTFIX.has(value) || "keyword" == type && KEYWORDS_BEFORE_EXPRESSION.has(value) || "punc" == type && PUNC_BEFORE_EXPRESSION.has(value) || "arrow" == type, "punc" == type && ("." == value || "?." == value) ? prev_was_dot = !0 : is_comment || (prev_was_dot = !1);
                    const line = S.tokline, col = S.tokcol, pos = S.tokpos, nlb = S.newline_before;
                    let comments_before = [], comments_after = [];
                    is_comment || (comments_before = S.comments_before, comments_after = S.comments_before = []), S.newline_before = !1;
                    const tok = new AST_Token(type, value, line, col, pos, nlb, comments_before, comments_after, filename);
                    return is_comment || (previous_token = tok), tok;
                }
                function parse_error(err) {
                    js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
                }
                function read_num(prefix) {
                    var has_e = !1, after_e = !1, has_x = !1, has_dot = "." == prefix, is_big_int = !1, numeric_separator = !1, num = function(pred) {
                        for(var ch, ret = "", i = 0; (ch = peek()) && pred(ch, i++);)ret += next();
                        return ret;
                    }(function(ch, i) {
                        if (is_big_int) return !1;
                        switch(ch.charCodeAt(0)){
                            case 95:
                                return numeric_separator = !0;
                            case 98:
                            case 66:
                                return has_x = !0; // Can occur in hex sequence, don't return false yet
                            case 111:
                            case 79:
                            case 120:
                            case 88:
                                return !has_x && (has_x = !0);
                            case 101:
                            case 69:
                                return !!has_x || !has_e && (has_e = after_e = !0);
                            case 45:
                                return after_e || 0 == i && !prefix;
                            case 43:
                                return after_e;
                            case after_e = !1, 46:
                                return !has_dot && !has_x && !has_e && (has_dot = !0);
                        }
                        return "n" === ch ? (is_big_int = !0, !0) : RE_NUM_LITERAL.test(ch);
                    });
                    if (prefix && (num = prefix + num), LATEST_RAW = num, RE_OCT_NUMBER.test(num) && next_token.has_directive("use strict") && parse_error("Legacy octal literals are not allowed in strict mode"), numeric_separator && (num.endsWith("_") ? parse_error("Numeric separators are not allowed at the end of numeric literals") : num.includes("__") && parse_error("Only one underscore is allowed as numeric separator"), num = num.replace(/_/g, "")), num.endsWith("n")) {
                        const without_n = num.slice(0, -1), allow_e = RE_HEX_NUMBER.test(without_n), valid = parse_js_number(without_n, allow_e);
                        if (!has_dot && RE_BIG_INT.test(num) && !isNaN(valid)) return token("big_int", without_n);
                        parse_error("Invalid or unexpected token");
                    }
                    var valid = parse_js_number(num);
                    if (!isNaN(valid)) return token("num", valid);
                    parse_error("Invalid syntax: " + num);
                }
                function is_octal(ch) {
                    return ch >= "0" && ch <= "7";
                }
                function read_escaped_char(in_string, strict_hex, template_string) {
                    var ch, p, ch1 = next(!0, in_string);
                    switch(ch1.charCodeAt(0)){
                        case 110:
                            return "\n";
                        case 114:
                            return "\r";
                        case 116:
                            return "\t";
                        case 98:
                            return "\b";
                        case 118:
                            return "\u000b"; // \v
                        case 102:
                            return "\f";
                        case 120:
                            return String.fromCharCode(hex_bytes(2, strict_hex)); // \x
                        case 117:
                            if ("{" == peek()) {
                                for(next(!0), "}" === peek() && parse_error("Expecting hex-character between {}"); "0" == peek();)next(!0); // No significance
                                var code, result, length = find("}", !0) - S.pos;
                                return (length > 6 || (result = hex_bytes(length, strict_hex)) > 0x10FFFF) && parse_error("Unicode reference out of bounds"), next(!0), // Based on https://github.com/mathiasbynens/String.fromCodePoint/blob/master/fromcodepoint.js
                                (code = result) > 0xFFFF ? String.fromCharCode(((code -= 0x10000) >> 10) + 0xD800) + String.fromCharCode(code % 0x400 + 0xDC00) : String.fromCharCode(code);
                            }
                            return String.fromCharCode(hex_bytes(4, strict_hex));
                        case 10:
                            return ""; // newline
                        case 13:
                            if ("\n" == peek()) return next(!0, in_string), "";
                    }
                    return is_octal(ch1) ? (template_string && strict_hex && !("0" === ch1 && !is_octal(peek())) && parse_error("Octal escape sequences are not allowed in template strings"), ch = ch1, // Parse
                    ((p = peek()) >= "0" && p <= "7" && (ch += next(!0))[0] <= "3" && (p = peek()) >= "0" && p <= "7" && (ch += next(!0)), "0" === ch) ? "\0" : (ch.length > 0 && next_token.has_directive("use strict") && strict_hex && parse_error("Legacy octal escape sequences are not allowed in strict mode"), String.fromCharCode(parseInt(ch, 8)))) : ch1;
                }
                function hex_bytes(n, strict_hex) {
                    for(var num = 0; n > 0; --n){
                        if (!strict_hex && isNaN(parseInt(peek(), 16))) return parseInt(num, 16) || "";
                        var digit = next(!0);
                        isNaN(parseInt(digit, 16)) && parse_error("Invalid hex-character pattern in string"), num += digit;
                    }
                    return parseInt(num, 16);
                }
                var read_string = with_eof_error("Unterminated string constant", function() {
                    const start_pos = S.pos;
                    for(var quote = next(), ret = [];;){
                        var ch = next(!0, !0);
                        if ("\\" == ch) ch = read_escaped_char(!0, !0);
                        else if ("\r" == ch || "\n" == ch) parse_error("Unterminated string constant");
                        else if (ch == quote) break;
                        ret.push(ch);
                    }
                    var tok = token("string", ret.join(""));
                    return LATEST_RAW = S.text.slice(start_pos, S.pos), tok.quote = quote, tok;
                }), read_template_characters = with_eof_error("Unterminated template", function(begin) {
                    begin && S.template_braces.push(S.brace_counter);
                    var ch, tok, content = "", raw = "";
                    for(next(!0, !0); "`" != (ch = next(!0, !0));){
                        if ("\r" == ch) "\n" == peek() && ++S.pos, ch = "\n";
                        else if ("$" == ch && "{" == peek()) return next(!0, !0), S.brace_counter++, tok = token(begin ? "template_head" : "template_substitution", content), LATEST_RAW = raw, LATEST_TEMPLATE_END = !1, tok;
                        if (raw += ch, "\\" == ch) {
                            var tmp = S.pos;
                            ch = read_escaped_char(!0, !(previous_token && ("name" === previous_token.type || "punc" === previous_token.type && (")" === previous_token.value || "]" === previous_token.value))), !0), raw += S.text.substr(tmp, S.pos - tmp);
                        }
                        content += ch;
                    }
                    return S.template_braces.pop(), tok = token(begin ? "template_head" : "template_substitution", content), LATEST_RAW = raw, LATEST_TEMPLATE_END = !0, tok;
                });
                function skip_line_comment(type) {
                    var ret, regex_allowed = S.regex_allowed, i = function() {
                        for(var text = S.text, i = S.pos, n = S.text.length; i < n; ++i){
                            var ch = text[i];
                            if (NEWLINE_CHARS.has(ch)) return i;
                        }
                        return -1;
                    }();
                    return -1 == i ? (ret = S.text.substr(S.pos), S.pos = S.text.length) : (ret = S.text.substring(S.pos, i), S.pos = i), S.col = S.tokcol + (S.pos - S.tokpos), S.comments_before.push(token(type, ret, !0)), S.regex_allowed = regex_allowed, next_token;
                }
                var skip_multiline_comment = with_eof_error("Unterminated multiline comment", function() {
                    var regex_allowed = S.regex_allowed, i = find("*/", !0), text = S.text.substring(S.pos, i).replace(/\r\n|\r|\u2028|\u2029/g, "\n");
                    return(// update stream position
                    forward(function(str) {
                        for(var surrogates = 0, i = 0; i < str.length; i++)is_surrogate_pair_head(str.charCodeAt(i)) && is_surrogate_pair_tail(str.charCodeAt(i + 1)) && (surrogates++, i++);
                        return str.length - surrogates;
                    }(text) + 2), S.comments_before.push(token("comment2", text, !0)), S.newline_before = S.newline_before || text.includes("\n"), S.regex_allowed = regex_allowed, next_token);
                }), read_name = with_eof_error("Unterminated identifier name", function() {
                    var ch, name = [], escaped = !1, read_escaped_identifier_char = function() {
                        return escaped = !0, next(), "u" !== peek() && parse_error("Expecting UnicodeEscapeSequence -- uXXXX or u{XXXX}"), read_escaped_char(!1, !0);
                    };
                    // Read first character (ID_Start)
                    if ("\\" === (ch = peek())) is_identifier_start(ch = read_escaped_identifier_char()) || parse_error("First identifier char is an invalid identifier char");
                    else {
                        if (!is_identifier_start(ch)) return "";
                        next();
                    }
                    // Read ID_Continue
                    for(name.push(ch); null != (ch = peek());){
                        if ("\\" === (ch = peek())) is_identifier_char(ch = read_escaped_identifier_char()) || parse_error("Invalid escaped identifier char");
                        else {
                            if (!is_identifier_char(ch)) break;
                            next();
                        }
                        name.push(ch);
                    }
                    const name_str = name.join("");
                    return RESERVED_WORDS.has(name_str) && escaped && parse_error("Escaped characters are not allowed in keywords"), name_str;
                }), read_regexp = with_eof_error("Unterminated regular expression", function(source) {
                    for(var ch, prev_backslash = !1, in_class = !1; ch = next(!0);)if (NEWLINE_CHARS.has(ch)) parse_error("Unexpected line terminator");
                    else if (prev_backslash) source += "\\" + ch, prev_backslash = !1;
                    else if ("[" == ch) in_class = !0, source += ch;
                    else if ("]" == ch && in_class) in_class = !1, source += ch;
                    else if ("/" != ch || in_class) "\\" == ch ? prev_backslash = !0 : source += ch;
                    else break;
                    return token("regexp", "/" + source + "/" + read_name());
                });
                function read_operator(prefix) {
                    return token("operator", function grow(op) {
                        if (!peek()) return op;
                        var bigger = op + peek();
                        return OPERATORS.has(bigger) ? (next(), grow(bigger)) : op;
                    }(prefix || next()));
                }
                function with_eof_error(eof_error, cont) {
                    return function(x) {
                        try {
                            return cont(x);
                        } catch (ex) {
                            if (ex === EX_EOF) parse_error(eof_error);
                            else throw ex;
                        }
                    };
                }
                function next_token(force_regexp) {
                    if (null != force_regexp) return read_regexp(force_regexp);
                    for(shebang && 0 == S.pos && looking_at("#!") && (start_token(), forward(2), skip_line_comment("comment5"));;){
                        if (!function() {
                            for(; WHITESPACE_CHARS.has(peek());)next();
                        }(), start_token(), html5_comments) {
                            if (looking_at("<!--")) {
                                forward(4), skip_line_comment("comment3");
                                continue;
                            }
                            if (looking_at("-->") && S.newline_before) {
                                forward(3), skip_line_comment("comment4");
                                continue;
                            }
                        }
                        var ch = peek();
                        if (!ch) return token("eof");
                        var code = ch.charCodeAt(0);
                        switch(code){
                            case 34:
                            case 39:
                                return read_string();
                            case 46:
                                return (next(), is_digit(peek().charCodeAt(0))) ? read_num(".") : "." === peek() ? (next(), next(), token("expand", "...")) : token("punc", ".");
                            case 47:
                                var tok = function() {
                                    switch(next(), peek()){
                                        case "/":
                                            return next(), skip_line_comment("comment1");
                                        case "*":
                                            return next(), skip_multiline_comment();
                                    }
                                    return S.regex_allowed ? read_regexp("") : read_operator("/");
                                }();
                                if (tok === next_token) continue;
                                return tok;
                            case 61:
                                return (next(), ">" === peek()) ? (next(), token("arrow", "=>")) : read_operator("=");
                            case 63:
                                if (!// Used because parsing ?. involves a lookahead for a digit
                                function() {
                                    if (46 !== S.text.charCodeAt(S.pos + 1)) return !1;
                                    const cannot_be_digit = S.text.charCodeAt(S.pos + 2);
                                    return cannot_be_digit < 48 || cannot_be_digit > 57;
                                }()) break; // Handled below
                                return next(), next(), token("punc", "?.");
                            case 96:
                                return read_template_characters(!0);
                            case 123:
                                S.brace_counter++;
                                break;
                            case 125:
                                if (S.brace_counter--, S.template_braces.length > 0 && S.template_braces[S.template_braces.length - 1] === S.brace_counter) return read_template_characters(!1);
                        }
                        if (is_digit(code)) return read_num();
                        if (PUNC_CHARS.has(ch)) return token("punc", next());
                        if (OPERATOR_CHARS.has(ch)) return read_operator();
                        if (92 == code || is_identifier_start(ch)) return function() {
                            var word = read_name();
                            return prev_was_dot ? token("name", word) : KEYWORDS_ATOM.has(word) ? token("atom", word) : KEYWORDS.has(word) ? OPERATORS.has(word) ? token("operator", word) : token("keyword", word) : token("name", word);
                        }();
                        if (35 == code) return next(), token("privatename", read_name());
                        break;
                    }
                    parse_error("Unexpected character '" + ch + "'");
                }
                return next_token.next = next, next_token.peek = peek, next_token.context = function(nc) {
                    return nc && (S = nc), S;
                }, next_token.add_directive = function(directive) {
                    S.directive_stack[S.directive_stack.length - 1].push(directive), void 0 === S.directives[directive] ? S.directives[directive] = 1 : S.directives[directive]++;
                }, next_token.push_directives_stack = function() {
                    S.directive_stack.push([]);
                }, next_token.pop_directives_stack = function() {
                    for(var directives = S.directive_stack[S.directive_stack.length - 1], i = 0; i < directives.length; i++)S.directives[directives[i]]--;
                    S.directive_stack.pop();
                }, next_token.has_directive = function(directive) {
                    return S.directives[directive] > 0;
                }, next_token;
            }($TEXT, options.filename, options.html5_comments, options.shebang) : $TEXT,
            token: null,
            prev: null,
            peeked: null,
            in_function: 0,
            in_async: -1,
            in_generator: -1,
            in_directives: !0,
            in_loop: 0,
            labels: []
        };
        function is(type, value) {
            return is_token(S.token, type, value);
        }
        function peek() {
            return S.peeked || (S.peeked = S.input());
        }
        function next() {
            return S.prev = S.token, S.peeked || peek(), S.token = S.peeked, S.peeked = null, S.in_directives = S.in_directives && ("string" == S.token.type || is("punc", ";")), S.token;
        }
        function prev() {
            return S.prev;
        }
        function croak(msg, line, col, pos) {
            var ctx = S.input.context();
            js_error(msg, ctx.filename, null != line ? line : ctx.tokline, null != col ? col : ctx.tokcol, null != pos ? pos : ctx.tokpos);
        }
        function token_error(token, msg) {
            croak(msg, token.line, token.col);
        }
        function unexpected(token) {
            null == token && (token = S.token), token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
        }
        function expect_token(type, val) {
            if (is(type, val)) return next();
            token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "», expected " + type + " «" + val + "»");
        }
        function expect(punc) {
            return expect_token("punc", punc);
        }
        function has_newline_before(token) {
            return token.nlb || !token.comments_before.every((comment)=>!comment.nlb);
        }
        function can_insert_semicolon() {
            return !options.strict && (is("eof") || is("punc", "}") || has_newline_before(S.token));
        }
        function is_in_generator() {
            return S.in_generator === S.in_function;
        }
        function can_await() {
            return S.in_async === S.in_function || 0 === S.in_function && S.input.has_directive("use strict");
        }
        function semicolon(optional) {
            is("punc", ";") ? next() : optional || can_insert_semicolon() || unexpected();
        }
        function parenthesised() {
            expect("(");
            var exp = expression(!0);
            return expect(")"), exp;
        }
        function embed_tokens(parser) {
            return function(...args) {
                const start = S.token, expr = parser(...args);
                return expr.start = start, expr.end = prev(), expr;
            };
        }
        function handle_regexp() {
            (is("operator", "/") || is("operator", "/=")) && (S.peeked = null, S.token = S.input(S.token.value.substr(1)));
        }
        S.token = next();
        var statement = embed_tokens(function statement1(is_export_default, is_for_body, is_if_body) {
            switch(handle_regexp(), S.token.type){
                case "string":
                    if (S.in_directives) {
                        var token = peek();
                        !LATEST_RAW.includes("\\") && (is_token(token, "punc", ";") || is_token(token, "punc", "}") || has_newline_before(token) || is_token(token, "eof")) ? S.input.add_directive(S.token.value) : S.in_directives = !1;
                    }
                    var dir = S.in_directives, stat = simple_statement();
                    return dir && stat.body instanceof AST_String ? new AST_Directive(stat.body) : stat;
                case "template_head":
                case "num":
                case "big_int":
                case "regexp":
                case "operator":
                case "atom":
                    return simple_statement();
                case "name":
                    if ("async" == S.token.value && is_token(peek(), "keyword", "function")) return next(), next(), is_for_body && croak("functions are not allowed as the body of a loop"), function_(AST_Defun, !1, !0, is_export_default);
                    if ("import" == S.token.value && !is_token(peek(), "punc", "(") && !is_token(peek(), "punc", ".")) {
                        next();
                        var label, stat1, node = function() {
                            var imported_name, imported_names, start = prev();
                            is("name") && (imported_name = as_symbol(AST_SymbolImport)), is("punc", ",") && next(), ((imported_names = map_names(!0)) || imported_name) && expect_token("name", "from");
                            var mod_str = S.token;
                            "string" !== mod_str.type && unexpected(), next();
                            const assert_clause = maybe_import_assertion();
                            return new AST_Import({
                                start,
                                imported_name,
                                imported_names,
                                module_name: new AST_String({
                                    start: mod_str,
                                    value: mod_str.value,
                                    quote: mod_str.quote,
                                    end: mod_str
                                }),
                                assert_clause,
                                end: S.token
                            });
                        }();
                        return semicolon(), node;
                    }
                    return is_token(peek(), "punc", ":") ? ("await" === (label = as_symbol(AST_Label)).name && S.in_async === S.in_function && token_error(S.prev, "await cannot be used as label inside async function"), S.labels.some((l)=>l.name === label.name) && // ECMA-262, 12.12: An ECMAScript program is considered
                    // syntactically incorrect if it contains a
                    // LabelledStatement that is enclosed by a
                    // LabelledStatement with the same Identifier as label.
                    croak("Label " + label.name + " defined twice"), expect(":"), S.labels.push(label), stat1 = statement(), S.labels.pop(), stat1 instanceof AST_IterationStatement || // check for `continue` that refers to this label.
                    // those should be reported as syntax errors.
                    // https://github.com/mishoo/UglifyJS2/issues/287
                    label.references.forEach(function(ref) {
                        ref instanceof AST_Continue && (ref = ref.label.start, croak("Continue label `" + label.name + "` refers to non-IterationStatement.", ref.line, ref.col, ref.pos));
                    }), new AST_LabeledStatement({
                        body: stat1,
                        label: label
                    })) : simple_statement();
                case "punc":
                    switch(S.token.value){
                        case "{":
                            return new AST_BlockStatement({
                                start: S.token,
                                body: block_(),
                                end: prev()
                            });
                        case "[":
                        case "(":
                            return simple_statement();
                        case ";":
                            return S.in_directives = !1, next(), new AST_EmptyStatement();
                        default:
                            unexpected();
                    }
                case "keyword":
                    switch(S.token.value){
                        case "break":
                            return next(), break_cont(AST_Break);
                        case "continue":
                            return next(), break_cont(AST_Continue);
                        case "debugger":
                            return next(), semicolon(), new AST_Debugger();
                        case "do":
                            next();
                            var cond, body, belse, body1 = in_loop(statement1);
                            expect_token("keyword", "while");
                            var condition = parenthesised();
                            return semicolon(!0), new AST_Do({
                                body: body1,
                                condition: condition
                            });
                        case "while":
                            return next(), new AST_While({
                                condition: parenthesised(),
                                body: in_loop(function() {
                                    return statement1(!1, !0);
                                })
                            });
                        case "for":
                            return next(), function() {
                                var init, test, step, for_await_error = "`for await` invalid in this context", await_tok = S.token;
                                "name" == await_tok.type && "await" == await_tok.value ? (can_await() || token_error(await_tok, for_await_error), next()) : await_tok = !1, expect("(");
                                var init1 = null;
                                if (is("punc", ";")) await_tok && token_error(await_tok, for_await_error);
                                else {
                                    init1 = is("keyword", "var") ? (next(), var_(!0)) : is("keyword", "let") ? (next(), let_(!0)) : is("keyword", "const") ? (next(), const_(!0)) : expression(!0, !0);
                                    var init2, obj, init3, is_await, lhs, obj1, is_in = is("operator", "in"), is_of = is("name", "of");
                                    if (await_tok && !is_of && token_error(await_tok, for_await_error), is_in || is_of) return (init1 instanceof AST_Definitions ? init1.definitions.length > 1 && token_error(init1.start, "Only one variable declaration allowed in for..in loop") : is_assignable(init1) || (init1 = to_destructuring(init1)) instanceof AST_Destructuring || token_error(init1.start, "Invalid left-hand side in for..in loop"), next(), is_in) ? (init2 = init1, obj = expression(!0), expect(")"), new AST_ForIn({
                                        init: init2,
                                        object: obj,
                                        body: in_loop(function() {
                                            return statement(!1, !0);
                                        })
                                    })) : (init3 = init1, is_await = !!await_tok, lhs = init3 instanceof AST_Definitions ? init3.definitions[0].name : null, obj1 = expression(!0), expect(")"), new AST_ForOf({
                                        await: is_await,
                                        init: init3,
                                        name: lhs,
                                        object: obj1,
                                        body: in_loop(function() {
                                            return statement(!1, !0);
                                        })
                                    }));
                                }
                                return init = init1, expect(";"), test = is("punc", ";") ? null : expression(!0), expect(";"), step = is("punc", ")") ? null : expression(!0), expect(")"), new AST_For({
                                    init: init,
                                    condition: test,
                                    step: step,
                                    body: in_loop(function() {
                                        return statement(!1, !0);
                                    })
                                });
                            }();
                        case "class":
                            return next(), is_for_body && croak("classes are not allowed as the body of a loop"), is_if_body && croak("classes are not allowed as the body of an if"), class_(AST_DefClass, is_export_default);
                        case "function":
                            return next(), is_for_body && croak("functions are not allowed as the body of a loop"), function_(AST_Defun, !1, !1, is_export_default);
                        case "if":
                            return next(), cond = parenthesised(), body = statement(!1, !1, !0), belse = null, is("keyword", "else") && (next(), belse = statement(!1, !1, !0)), new AST_If({
                                condition: cond,
                                body: body,
                                alternative: belse
                            });
                        case "return":
                            0 != S.in_function || options.bare_returns || croak("'return' outside of function"), next();
                            var value = null;
                            return is("punc", ";") ? next() : can_insert_semicolon() || (value = expression(!0), semicolon()), new AST_Return({
                                value: value
                            });
                        case "switch":
                            return next(), new AST_Switch({
                                expression: parenthesised(),
                                body: in_loop(switch_body_)
                            });
                        case "throw":
                            next(), has_newline_before(S.token) && croak("Illegal newline after 'throw'");
                            var value = expression(!0);
                            return semicolon(), new AST_Throw({
                                value: value
                            });
                        case "try":
                            return next(), function() {
                                var body = block_(), bcatch = null, bfinally = null;
                                if (is("keyword", "catch")) {
                                    var start = S.token;
                                    if (next(), is("punc", "{")) var name = null;
                                    else {
                                        expect("(");
                                        var name = parameter(void 0, AST_SymbolCatch);
                                        expect(")");
                                    }
                                    bcatch = new AST_Catch({
                                        start: start,
                                        argname: name,
                                        body: block_(),
                                        end: prev()
                                    });
                                }
                                if (is("keyword", "finally")) {
                                    var start = S.token;
                                    next(), bfinally = new AST_Finally({
                                        start: start,
                                        body: block_(),
                                        end: prev()
                                    });
                                }
                                return bcatch || bfinally || croak("Missing catch/finally blocks"), new AST_Try({
                                    body: body,
                                    bcatch: bcatch,
                                    bfinally: bfinally
                                });
                            }();
                        case "var":
                            next();
                            var node = var_();
                            return semicolon(), node;
                        case "let":
                            next();
                            var node = let_();
                            return semicolon(), node;
                        case "const":
                            next();
                            var node = const_();
                            return semicolon(), node;
                        case "with":
                            return S.input.has_directive("use strict") && croak("Strict mode may not include a with statement"), next(), new AST_With({
                                expression: parenthesised(),
                                body: statement1()
                            });
                        case "export":
                            if (!is_token(peek(), "punc", "(")) {
                                next();
                                var node = function() {
                                    var is_default, exported_names, node, exported_value, exported_definition, start = S.token;
                                    if (is("keyword", "default")) is_default = !0, next();
                                    else if (exported_names = map_names(!1)) {
                                        if (!is("name", "from")) return new AST_Export({
                                            start: start,
                                            is_default: is_default,
                                            exported_names: exported_names,
                                            end: prev()
                                        });
                                        {
                                            next();
                                            var mod_str = S.token;
                                            "string" !== mod_str.type && unexpected(), next();
                                            const assert_clause = maybe_import_assertion();
                                            return new AST_Export({
                                                start: start,
                                                is_default: is_default,
                                                exported_names: exported_names,
                                                module_name: new AST_String({
                                                    start: mod_str,
                                                    value: mod_str.value,
                                                    quote: mod_str.quote,
                                                    end: mod_str
                                                }),
                                                end: prev(),
                                                assert_clause
                                            });
                                        }
                                    }
                                    return is("punc", "{") || is_default && (is("keyword", "class") || is("keyword", "function")) && is_token(peek(), "punc") ? (exported_value = expression(!1), semicolon()) : (node = statement(is_default)) instanceof AST_Definitions && is_default ? unexpected(node.start) : node instanceof AST_Definitions || node instanceof AST_Defun || node instanceof AST_DefClass ? exported_definition = node : node instanceof AST_ClassExpression || node instanceof AST_Function ? exported_value = node : node instanceof AST_SimpleStatement ? exported_value = node.body : unexpected(node.start), new AST_Export({
                                        start: start,
                                        is_default: is_default,
                                        exported_value: exported_value,
                                        exported_definition: exported_definition,
                                        end: prev(),
                                        assert_clause: null
                                    });
                                }();
                                return is("punc", ";") && semicolon(), node;
                            }
                    }
            }
            unexpected();
        });
        function simple_statement(tmp) {
            return new AST_SimpleStatement({
                body: (tmp = expression(!0), semicolon(), tmp)
            });
        }
        function break_cont(type) {
            var ldef, label = null;
            can_insert_semicolon() || (label = as_symbol(AST_LabelRef, !0)), null != label ? ((ldef = S.labels.find((l)=>l.name === label.name)) || croak("Undefined label " + label.name), label.thedef = ldef) : 0 == S.in_loop && croak(type.TYPE + " not inside a loop or switch"), semicolon();
            var stat = new type({
                label: label
            });
            return ldef && ldef.references.push(stat), stat;
        }
        var arrow_function = function(start, argnames, is_async) {
            has_newline_before(S.token) && croak("Unexpected newline before arrow (=>)"), expect_token("arrow", "=>");
            var body = _function_body(is("punc", "{"), !1, is_async), end = body instanceof Array && body.length ? body[body.length - 1].end : body instanceof Array ? start : body.end;
            return new AST_Arrow({
                start: start,
                end: end,
                async: is_async,
                argnames: argnames,
                body: body
            });
        }, function_ = function(ctor, is_generator_property, is_async, is_export_default) {
            var in_statement = ctor === AST_Defun, is_generator = is("operator", "*");
            is_generator && next();
            var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : AST_SymbolLambda) : null;
            in_statement && !name && (is_export_default ? ctor = AST_Function : unexpected()), !name || ctor === AST_Accessor || name instanceof AST_SymbolDeclaration || unexpected(prev());
            var args = [], body = _function_body(!0, is_generator || is_generator_property, is_async, name, args);
            return new ctor({
                start: args.start,
                end: body.end,
                is_generator: is_generator,
                async: is_async,
                name: name,
                argnames: args,
                body: body
            });
        };
        function track_used_binding_identifiers(is_parameter, strict) {
            var parameters = new Set(), duplicate = !1, default_assignment = !1, spread = !1, strict_mode = !!strict, tracker = {
                add_parameter: function(token) {
                    if (parameters.has(token.value)) !1 === duplicate && (duplicate = token), tracker.check_strict();
                    else if (parameters.add(token.value), is_parameter) switch(token.value){
                        case "arguments":
                        case "eval":
                        case "yield":
                            strict_mode && token_error(token, "Unexpected " + token.value + " identifier as parameter inside strict mode");
                            break;
                        default:
                            RESERVED_WORDS.has(token.value) && unexpected();
                    }
                },
                mark_default_assignment: function(token) {
                    !1 === default_assignment && (default_assignment = token);
                },
                mark_spread: function(token) {
                    !1 === spread && (spread = token);
                },
                mark_strict_mode: function() {
                    strict_mode = !0;
                },
                is_strict: function() {
                    return !1 !== default_assignment || !1 !== spread || strict_mode;
                },
                check_strict: function() {
                    tracker.is_strict() && !1 !== duplicate && token_error(duplicate, "Parameter " + duplicate.value + " was used already");
                }
            };
            return tracker;
        }
        function parameter(used_parameters, symbol_type) {
            var param, expand = !1;
            return void 0 === used_parameters && (used_parameters = track_used_binding_identifiers(!0, S.input.has_directive("use strict"))), is("expand", "...") && (expand = S.token, used_parameters.mark_spread(S.token), next()), param = binding_element(used_parameters, symbol_type), is("operator", "=") && !1 === expand && (used_parameters.mark_default_assignment(S.token), next(), param = new AST_DefaultAssign({
                start: param.start,
                left: param,
                operator: "=",
                right: expression(!1),
                end: S.token
            })), !1 !== expand && (is("punc", ")") || unexpected(), param = new AST_Expansion({
                start: expand,
                expression: param,
                end: expand
            })), used_parameters.check_strict(), param;
        }
        function binding_element(used_parameters, symbol_type) {
            var expand_token, elements = [], first = !0, is_expand = !1, first_token = S.token;
            if (void 0 === used_parameters && (used_parameters = track_used_binding_identifiers(!1, S.input.has_directive("use strict"))), symbol_type = void 0 === symbol_type ? AST_SymbolFunarg : symbol_type, is("punc", "[")) {
                for(next(); !is("punc", "]");){
                    if (first ? first = !1 : expect(","), is("expand", "...") && (is_expand = !0, expand_token = S.token, used_parameters.mark_spread(S.token), next()), is("punc")) switch(S.token.value){
                        case ",":
                            elements.push(new AST_Hole({
                                start: S.token,
                                end: S.token
                            }));
                            continue;
                        case "]":
                            break;
                        case "[":
                        case "{":
                            elements.push(binding_element(used_parameters, symbol_type));
                            break;
                        default:
                            unexpected();
                    }
                    else is("name") ? (used_parameters.add_parameter(S.token), elements.push(as_symbol(symbol_type))) : croak("Invalid function parameter");
                    is("operator", "=") && !1 === is_expand && (used_parameters.mark_default_assignment(S.token), next(), elements[elements.length - 1] = new AST_DefaultAssign({
                        start: elements[elements.length - 1].start,
                        left: elements[elements.length - 1],
                        operator: "=",
                        right: expression(!1),
                        end: S.token
                    })), is_expand && (is("punc", "]") || croak("Rest element must be last element"), elements[elements.length - 1] = new AST_Expansion({
                        start: expand_token,
                        expression: elements[elements.length - 1],
                        end: expand_token
                    }));
                }
                return expect("]"), used_parameters.check_strict(), new AST_Destructuring({
                    start: first_token,
                    names: elements,
                    is_array: !0,
                    end: prev()
                });
            }
            if (is("punc", "{")) {
                for(next(); !is("punc", "}");){
                    if (first ? first = !1 : expect(","), is("expand", "...") && (is_expand = !0, expand_token = S.token, used_parameters.mark_spread(S.token), next()), is("name") && (is_token(peek(), "punc") || is_token(peek(), "operator")) && [
                        ",",
                        "}",
                        "="
                    ].includes(peek().value)) {
                        used_parameters.add_parameter(S.token);
                        var start = prev(), value = as_symbol(symbol_type);
                        is_expand ? elements.push(new AST_Expansion({
                            start: expand_token,
                            expression: value,
                            end: value.end
                        })) : elements.push(new AST_ObjectKeyVal({
                            start: start,
                            key: value.name,
                            value: value,
                            end: value.end
                        }));
                    } else {
                        if (is("punc", "}")) continue; // Allow trailing hole
                        var property_token = S.token, property = as_property_name();
                        null === property ? unexpected(prev()) : "name" !== prev().type || is("punc", ":") ? (expect(":"), elements.push(new AST_ObjectKeyVal({
                            start: property_token,
                            quote: property_token.quote,
                            key: property,
                            value: binding_element(used_parameters, symbol_type),
                            end: prev()
                        }))) : elements.push(new AST_ObjectKeyVal({
                            start: prev(),
                            key: property,
                            value: new symbol_type({
                                start: prev(),
                                name: property,
                                end: prev()
                            }),
                            end: prev()
                        }));
                    }
                    is_expand ? is("punc", "}") || croak("Rest element must be last element") : is("operator", "=") && (used_parameters.mark_default_assignment(S.token), next(), elements[elements.length - 1].value = new AST_DefaultAssign({
                        start: elements[elements.length - 1].value.start,
                        left: elements[elements.length - 1].value,
                        operator: "=",
                        right: expression(!1),
                        end: S.token
                    }));
                }
                return expect("}"), used_parameters.check_strict(), new AST_Destructuring({
                    start: first_token,
                    names: elements,
                    is_array: !1,
                    end: prev()
                });
            }
            if (is("name")) return used_parameters.add_parameter(S.token), as_symbol(symbol_type);
            croak("Invalid function parameter");
        }
        function _function_body(block, generator, is_async, name, args) {
            var loop = S.in_loop, labels = S.labels, current_generator = S.in_generator, current_async = S.in_async;
            if (++S.in_function, generator && (S.in_generator = S.in_function), is_async && (S.in_async = S.in_function), args && function(params) {
                var used_parameters = track_used_binding_identifiers(!0, S.input.has_directive("use strict"));
                for(expect("("); !is("punc", ")");){
                    var param = parameter(used_parameters);
                    if (params.push(param), is("punc", ")") || expect(","), param instanceof AST_Expansion) break;
                }
                next();
            }(args), block && (S.in_directives = !0), S.in_loop = 0, S.labels = [], block) {
                S.input.push_directives_stack();
                var a = block_();
                name && _verify_symbol(name), args && args.forEach(_verify_symbol), S.input.pop_directives_stack();
            } else var a = [
                new AST_Return({
                    start: S.token,
                    value: expression(!1),
                    end: S.token
                })
            ];
            return --S.in_function, S.in_loop = loop, S.labels = labels, S.in_generator = current_generator, S.in_async = current_async, a;
        }
        function block_() {
            expect("{");
            for(var a = []; !is("punc", "}");)is("eof") && unexpected(), a.push(statement());
            return next(), a;
        }
        function switch_body_() {
            expect("{");
            for(var tmp, a = [], cur = null, branch = null; !is("punc", "}");)is("eof") && unexpected(), is("keyword", "case") ? (branch && (branch.end = prev()), cur = [], a.push(branch = new AST_Case({
                start: (tmp = S.token, next(), tmp),
                expression: expression(!0),
                body: cur
            })), expect(":")) : is("keyword", "default") ? (branch && (branch.end = prev()), cur = [], a.push(branch = new AST_Default({
                start: (tmp = S.token, next(), expect(":"), tmp),
                body: cur
            }))) : (cur || unexpected(), cur.push(statement()));
            return branch && (branch.end = prev()), next(), a;
        }
        function vardefs(no_in, kind) {
            for(var def, a = [];;){
                var sym_type = "var" === kind ? AST_SymbolVar : "const" === kind ? AST_SymbolConst : "let" === kind ? AST_SymbolLet : null;
                if (is("punc", "{") || is("punc", "[") ? def = new AST_VarDef({
                    start: S.token,
                    name: binding_element(void 0, sym_type),
                    value: is("operator", "=") ? (expect_token("operator", "="), expression(!1, no_in)) : null,
                    end: prev()
                }) : "import" == (def = new AST_VarDef({
                    start: S.token,
                    name: as_symbol(sym_type),
                    value: is("operator", "=") ? (next(), expression(!1, no_in)) : no_in || "const" !== kind ? null : croak("Missing initializer in const declaration"),
                    end: prev()
                })).name.name && croak("Unexpected token: import"), a.push(def), !is("punc", ",")) break;
                next();
            }
            return a;
        }
        var var_ = function(no_in) {
            return new AST_Var({
                start: prev(),
                definitions: vardefs(no_in, "var"),
                end: prev()
            });
        }, let_ = function(no_in) {
            return new AST_Let({
                start: prev(),
                definitions: vardefs(no_in, "let"),
                end: prev()
            });
        }, const_ = function(no_in) {
            return new AST_Const({
                start: prev(),
                definitions: vardefs(no_in, "const"),
                end: prev()
            });
        }, new_ = function(allow_calls) {
            var start = S.token;
            if (expect_token("operator", "new"), is("punc", ".")) return next(), expect_token("name", "target"), subscripts(new AST_NewTarget({
                start: start,
                end: prev()
            }), allow_calls);
            var args, newexp = expr_atom(!1);
            is("punc", "(") ? (next(), args = expr_list(")", !0)) : args = [];
            var call = new AST_New({
                start: start,
                expression: newexp,
                args: args,
                end: prev()
            });
            return annotate(call), subscripts(call, allow_calls);
        };
        function as_atom_node() {
            var ret, tok = S.token;
            switch(tok.type){
                case "name":
                    ret = _make_symbol(AST_SymbolRef);
                    break;
                case "num":
                    ret = new AST_Number({
                        start: tok,
                        end: tok,
                        value: tok.value,
                        raw: LATEST_RAW
                    });
                    break;
                case "big_int":
                    ret = new AST_BigInt({
                        start: tok,
                        end: tok,
                        value: tok.value
                    });
                    break;
                case "string":
                    ret = new AST_String({
                        start: tok,
                        end: tok,
                        value: tok.value,
                        quote: tok.quote
                    });
                    break;
                case "regexp":
                    const [_, source, flags] = tok.value.match(/^\/(.*)\/(\w*)$/);
                    ret = new AST_RegExp({
                        start: tok,
                        end: tok,
                        value: {
                            source,
                            flags
                        }
                    });
                    break;
                case "atom":
                    switch(tok.value){
                        case "false":
                            ret = new AST_False({
                                start: tok,
                                end: tok
                            });
                            break;
                        case "true":
                            ret = new AST_True({
                                start: tok,
                                end: tok
                            });
                            break;
                        case "null":
                            ret = new AST_Null({
                                start: tok,
                                end: tok
                            });
                    }
            }
            return next(), ret;
        }
        var expr_atom = function(allow_calls, allow_arrows) {
            if (is("operator", "new")) return new_(allow_calls);
            if (is("operator", "import")) {
                var start;
                return start = S.token, expect_token("operator", "import"), expect_token("punc", "."), expect_token("name", "meta"), subscripts(new AST_ImportMeta({
                    start: start,
                    end: prev()
                }), !1);
            }
            var peeked, start1 = S.token, async = is("name", "async") && "[" != (peeked = peek()).value && "arrow" != peeked.type && as_atom_node();
            if (is("punc")) {
                switch(S.token.value){
                    case "(":
                        if (async && !allow_calls) break;
                        var exprs = function(allow_arrows, maybe_sequence) {
                            var spread_token, invalid_sequence, trailing_comma, a = [];
                            for(expect("("); !is("punc", ")");)spread_token && unexpected(spread_token), is("expand", "...") ? (spread_token = S.token, maybe_sequence && (invalid_sequence = S.token), next(), a.push(new AST_Expansion({
                                start: prev(),
                                expression: expression(),
                                end: S.token
                            }))) : a.push(expression()), !is("punc", ")") && (expect(","), is("punc", ")") && (trailing_comma = prev(), maybe_sequence && (invalid_sequence = trailing_comma)));
                            return expect(")"), allow_arrows && is("arrow", "=>") ? spread_token && trailing_comma && unexpected(trailing_comma) : invalid_sequence && unexpected(invalid_sequence), a;
                        }(allow_arrows, !async);
                        if (allow_arrows && is("arrow", "=>")) return arrow_function(start1, exprs.map((e)=>(function to_fun_args(ex, default_seen_above) {
                                var insert_default = function(ex, default_value) {
                                    return default_value ? new AST_DefaultAssign({
                                        start: ex.start,
                                        left: ex,
                                        operator: "=",
                                        right: default_value,
                                        end: default_value.end
                                    }) : ex;
                                };
                                return ex instanceof AST_Object ? insert_default(new AST_Destructuring({
                                    start: ex.start,
                                    end: ex.end,
                                    is_array: !1,
                                    names: ex.properties.map((prop)=>to_fun_args(prop))
                                }), default_seen_above) : ex instanceof AST_ObjectKeyVal ? (ex.value = to_fun_args(ex.value), insert_default(ex, default_seen_above)) : ex instanceof AST_Hole ? ex : ex instanceof AST_Destructuring ? (ex.names = ex.names.map((name)=>to_fun_args(name)), insert_default(ex, default_seen_above)) : ex instanceof AST_SymbolRef ? insert_default(new AST_SymbolFunarg({
                                    name: ex.name,
                                    start: ex.start,
                                    end: ex.end
                                }), default_seen_above) : ex instanceof AST_Expansion ? (ex.expression = to_fun_args(ex.expression), insert_default(ex, default_seen_above)) : ex instanceof AST_Array ? insert_default(new AST_Destructuring({
                                    start: ex.start,
                                    end: ex.end,
                                    is_array: !0,
                                    names: ex.elements.map((elm)=>to_fun_args(elm))
                                }), default_seen_above) : ex instanceof AST_Assign ? insert_default(to_fun_args(ex.left, ex.right), default_seen_above) : ex instanceof AST_DefaultAssign ? (ex.left = to_fun_args(ex.left), ex) : void croak("Invalid function parameter", ex.start.line, ex.start.col);
                            })(e)), !!async);
                        var ex = async ? new AST_Call({
                            expression: async,
                            args: exprs
                        }) : 1 == exprs.length ? exprs[0] : new AST_Sequence({
                            expressions: exprs
                        });
                        if (ex.start) {
                            const outer_comments_before = start1.comments_before.length;
                            if (outer_comments_before_counts.set(start1, outer_comments_before), ex.start.comments_before.unshift(...start1.comments_before), start1.comments_before = ex.start.comments_before, 0 == outer_comments_before && start1.comments_before.length > 0) {
                                var comment = start1.comments_before[0];
                                comment.nlb || (comment.nlb = start1.nlb, start1.nlb = !1);
                            }
                            start1.comments_after = ex.start.comments_after;
                        }
                        ex.start = start1;
                        var end = prev();
                        return ex.end && (end.comments_before = ex.end.comments_before, ex.end.comments_after.push(...end.comments_after), end.comments_after = ex.end.comments_after), ex.end = end, ex instanceof AST_Call && annotate(ex), subscripts(ex, allow_calls);
                    case "[":
                        return subscripts(array_(), allow_calls);
                    case "{":
                        return subscripts(object_or_destructuring_(), allow_calls);
                }
                async || unexpected();
            }
            if (allow_arrows && is("name") && is_token(peek(), "arrow")) {
                var param = new AST_SymbolFunarg({
                    name: S.token.value,
                    start: start1,
                    end: start1
                });
                return next(), arrow_function(start1, [
                    param
                ], !!async);
            }
            if (is("keyword", "function")) {
                next();
                var func = function_(AST_Function, !1, !!async);
                return func.start = start1, func.end = prev(), subscripts(func, allow_calls);
            }
            if (async) return subscripts(async, allow_calls);
            if (is("keyword", "class")) {
                next();
                var cls = class_(AST_ClassExpression);
                return cls.start = start1, cls.end = prev(), subscripts(cls, allow_calls);
            }
            return is("template_head") ? subscripts(template_string(), allow_calls) : ATOMIC_START_TOKEN.has(S.token.type) ? subscripts(as_atom_node(), allow_calls) : void unexpected();
        };
        function template_string() {
            var segments = [], start = S.token;
            for(segments.push(new AST_TemplateSegment({
                start: S.token,
                raw: LATEST_RAW,
                value: S.token.value,
                end: S.token
            })); !LATEST_TEMPLATE_END;)next(), handle_regexp(), segments.push(expression(!0)), segments.push(new AST_TemplateSegment({
                start: S.token,
                raw: LATEST_RAW,
                value: S.token.value,
                end: S.token
            }));
            return next(), new AST_TemplateString({
                start: start,
                segments: segments,
                end: S.token
            });
        }
        function expr_list(closing, allow_trailing_comma, allow_empty) {
            for(var first = !0, a = []; !is("punc", closing) && (first ? first = !1 : expect(","), !(allow_trailing_comma && is("punc", closing)));)is("punc", ",") && allow_empty ? a.push(new AST_Hole({
                start: S.token,
                end: S.token
            })) : is("expand", "...") ? (next(), a.push(new AST_Expansion({
                start: prev(),
                expression: expression(),
                end: S.token
            }))) : a.push(expression(!1));
            return next(), a;
        }
        var array_ = embed_tokens(function() {
            return expect("["), new AST_Array({
                elements: expr_list("]", !options.strict, !0)
            });
        }), create_accessor = embed_tokens((is_generator, is_async)=>function_(AST_Accessor, is_generator, is_async)), object_or_destructuring_ = embed_tokens(function() {
            var start = S.token, first = !0, a = [];
            for(expect("{"); !is("punc", "}") && (first ? first = !1 : expect(","), !(!options.strict && is("punc", "}")));){
                if ("expand" == (start = S.token).type) {
                    next(), a.push(new AST_Expansion({
                        start: start,
                        expression: expression(!1),
                        end: prev()
                    }));
                    continue;
                }
                var value, name = as_property_name();
                // Check property and fetch value
                if (is("punc", ":")) null === name ? unexpected(prev()) : (next(), value = expression(!1));
                else {
                    var concise = concise_method_or_getset(name, start);
                    if (concise) {
                        a.push(concise);
                        continue;
                    }
                    value = new AST_SymbolRef({
                        start: prev(),
                        name: name,
                        end: prev()
                    });
                }
                is("operator", "=") && (next(), value = new AST_Assign({
                    start: start,
                    left: value,
                    operator: "=",
                    right: expression(!1),
                    logical: !1,
                    end: prev()
                })), // Create property
                a.push(new AST_ObjectKeyVal({
                    start: start,
                    quote: start.quote,
                    key: name instanceof AST_Node ? name : "" + name,
                    value: value,
                    end: prev()
                }));
            }
            return next(), new AST_Object({
                properties: a
            });
        });
        function class_(KindOfClass, is_export_default) {
            var start, method, class_name, extends_, a = [];
            for(S.input.push_directives_stack(), S.input.add_directive("use strict"), "name" == S.token.type && "extends" != S.token.value && (class_name = as_symbol(KindOfClass === AST_DefClass ? AST_SymbolDefClass : AST_SymbolClass)), KindOfClass !== AST_DefClass || class_name || (is_export_default ? KindOfClass = AST_ClassExpression : unexpected()), "extends" == S.token.value && (next(), extends_ = expression(!0)), expect("{"); is("punc", ";");)next();
             // Leading semicolons are okay in class bodies.
            for(; !is("punc", "}");)for(start = S.token, (method = concise_method_or_getset(as_property_name(), start, !0)) || unexpected(), a.push(method); is("punc", ";");)next();
            return S.input.pop_directives_stack(), next(), new KindOfClass({
                start: start,
                name: class_name,
                extends: extends_,
                properties: a,
                end: prev()
            });
        }
        function concise_method_or_getset(name, start, is_class) {
            const get_symbol_ast = (name, SymbolClass = AST_SymbolMethod)=>"string" == typeof name || "number" == typeof name ? new SymbolClass({
                    start,
                    name: "" + name,
                    end: prev()
                }) : (null === name && unexpected(), name), is_not_method_start = ()=>!is("punc", "(") && !is("punc", ",") && !is("punc", "}") && !is("punc", ";") && !is("operator", "=");
            var is_async = !1, is_static = !1, is_generator = !1, is_private = !1, accessor_type = null;
            is_class && "static" === name && is_not_method_start() && (is_static = !0, name = as_property_name()), "async" === name && is_not_method_start() && (is_async = !0, name = as_property_name()), "operator" === prev().type && "*" === prev().value && (is_generator = !0, name = as_property_name()), ("get" === name || "set" === name) && is_not_method_start() && (accessor_type = name, name = as_property_name()), "privatename" === prev().type && (is_private = !0);
            const property_token = prev();
            if (null != accessor_type) return is_private ? new ("get" === accessor_type ? AST_PrivateGetter : AST_PrivateSetter)({
                start,
                static: is_static,
                key: get_symbol_ast(name),
                value: create_accessor(),
                end: prev()
            }) : new ("get" === accessor_type ? AST_ObjectGetter : AST_ObjectSetter)({
                start,
                static: is_static,
                key: name = get_symbol_ast(name),
                quote: name instanceof AST_SymbolMethod ? property_token.quote : void 0,
                value: create_accessor(),
                end: prev()
            });
            if (is("punc", "(")) return new (is_private ? AST_PrivateMethod : AST_ConciseMethod)({
                start: start,
                static: is_static,
                is_generator: is_generator,
                async: is_async,
                key: name = get_symbol_ast(name),
                quote: name instanceof AST_SymbolMethod ? property_token.quote : void 0,
                value: create_accessor(is_generator, is_async),
                end: prev()
            });
            if (is_class) {
                const key = get_symbol_ast(name, AST_SymbolClassProperty), quote = key instanceof AST_SymbolClassProperty ? property_token.quote : void 0, AST_ClassPropertyVariant = is_private ? AST_ClassPrivateProperty : AST_ClassProperty;
                if (is("operator", "=")) return next(), new AST_ClassPropertyVariant({
                    start,
                    static: is_static,
                    quote,
                    key,
                    value: expression(!1),
                    end: prev()
                });
                if (is("name") || is("privatename") || is("operator", "*") || is("punc", ";") || is("punc", "}")) return new AST_ClassPropertyVariant({
                    start,
                    static: is_static,
                    quote,
                    key,
                    end: prev()
                });
            }
        }
        function maybe_import_assertion() {
            return is("name", "assert") && !has_newline_before(S.token) ? (next(), object_or_destructuring_()) : null;
        }
        function map_names(is_import) {
            var names, name, name1, foreign_name, foreign_type, type, start, end;
            if (is("punc", "{")) {
                for(next(), names = []; !is("punc", "}");)names.push(function(is_import) {
                    function make_symbol(type) {
                        return new type({
                            name: as_property_name(),
                            start: prev(),
                            end: prev()
                        });
                    }
                    var foreign_name, name, foreign_type = is_import ? AST_SymbolImportForeign : AST_SymbolExportForeign, type = is_import ? AST_SymbolImport : AST_SymbolExport, start = S.token;
                    return is_import ? foreign_name = make_symbol(foreign_type) : name = make_symbol(type), is("name", "as") ? (next(), is_import ? name = make_symbol(type) : foreign_name = make_symbol(foreign_type)) : is_import ? name = new type(foreign_name) : foreign_name = new foreign_type(name), new AST_NameMapping({
                        start: start,
                        foreign_name: foreign_name,
                        name: name,
                        end: prev()
                    });
                }(is_import)), is("punc", ",") && next();
                next();
            } else is("operator", "*") && (next(), is_import && is("name", "as") && (next(), name = as_symbol(is_import ? AST_SymbolImport : AST_SymbolExportForeign)), names = [
                (name1 = name, foreign_type = is_import ? AST_SymbolImportForeign : AST_SymbolExportForeign, type = is_import ? AST_SymbolImport : AST_SymbolExport, start = S.token, end = prev(), name1 = name1 || new type({
                    name: "*",
                    start: start,
                    end: end
                }), foreign_name = new foreign_type({
                    name: "*",
                    start: start,
                    end: end
                }), new AST_NameMapping({
                    start: start,
                    foreign_name: foreign_name,
                    name: name1,
                    end: end
                }))
            ]);
            return names;
        }
        function as_property_name() {
            var tmp = S.token;
            switch(tmp.type){
                case "punc":
                    if ("[" === tmp.value) {
                        next();
                        var ex = expression(!1);
                        return expect("]"), ex;
                    }
                    unexpected(tmp);
                case "operator":
                    if ("*" === tmp.value) return next(), null;
                    [
                        "delete",
                        "in",
                        "instanceof",
                        "new",
                        "typeof",
                        "void"
                    ].includes(tmp.value) || unexpected(tmp);
                /* falls through */ case "name":
                case "privatename":
                case "string":
                case "num":
                case "big_int":
                case "keyword":
                case "atom":
                    return next(), tmp.value;
                default:
                    unexpected(tmp);
            }
        }
        function as_name() {
            var tmp = S.token;
            return "name" != tmp.type && "privatename" != tmp.type && unexpected(), next(), tmp.value;
        }
        function _make_symbol(type) {
            var name = S.token.value;
            return new ("this" == name ? AST_This : "super" == name ? AST_Super : type)({
                name: String(name),
                start: S.token,
                end: S.token
            });
        }
        function _verify_symbol(sym) {
            var name = sym.name;
            is_in_generator() && "yield" == name && token_error(sym.start, "Yield cannot be used as identifier inside generators"), S.input.has_directive("use strict") && ("yield" == name && token_error(sym.start, "Unexpected yield identifier inside strict mode"), sym instanceof AST_SymbolDeclaration && ("arguments" == name || "eval" == name) && token_error(sym.start, "Unexpected " + name + " in strict mode"));
        }
        function as_symbol(type, noerror) {
            if (!is("name")) return noerror || croak("Name expected"), null;
            var sym = _make_symbol(type);
            return _verify_symbol(sym), next(), sym;
        }
        // Annotate AST_Call, AST_Lambda or AST_New with the special comments
        function annotate(node) {
            var start = node.start, comments = start.comments_before;
            const comments_outside_parens = outer_comments_before_counts.get(start);
            for(var i = null != comments_outside_parens ? comments_outside_parens : comments.length; --i >= 0;){
                var comment = comments[i];
                if (/[@#]__/.test(comment.value)) {
                    if (/[@#]__PURE__/.test(comment.value)) {
                        set_annotation(node, _PURE);
                        break;
                    }
                    if (/[@#]__INLINE__/.test(comment.value)) {
                        set_annotation(node, _INLINE);
                        break;
                    }
                    if (/[@#]__NOINLINE__/.test(comment.value)) {
                        set_annotation(node, _NOINLINE);
                        break;
                    }
                }
            }
        }
        var subscripts = function(expr, allow_calls, is_chain) {
            var start = expr.start;
            if (is("punc", ".")) return next(), subscripts(new (is("privatename") ? AST_DotHash : AST_Dot)({
                start: start,
                expression: expr,
                optional: !1,
                property: as_name(),
                end: prev()
            }), allow_calls, is_chain);
            if (is("punc", "[")) {
                next();
                var prop = expression(!0);
                return expect("]"), subscripts(new AST_Sub({
                    start: start,
                    expression: expr,
                    optional: !1,
                    property: prop,
                    end: prev()
                }), allow_calls, is_chain);
            }
            if (allow_calls && is("punc", "(")) {
                next();
                var call = new AST_Call({
                    start: start,
                    expression: expr,
                    optional: !1,
                    args: call_args(),
                    end: prev()
                });
                return annotate(call), subscripts(call, !0, is_chain);
            }
            if (is("punc", "?.")) {
                let chain_contents;
                if (next(), allow_calls && is("punc", "(")) {
                    next();
                    const call = new AST_Call({
                        start,
                        optional: !0,
                        expression: expr,
                        args: call_args(),
                        end: prev()
                    });
                    annotate(call), chain_contents = subscripts(call, !0, !0);
                } else if (is("name") || is("privatename")) chain_contents = subscripts(new (is("privatename") ? AST_DotHash : AST_Dot)({
                    start,
                    expression: expr,
                    optional: !0,
                    property: as_name(),
                    end: prev()
                }), allow_calls, !0);
                else if (is("punc", "[")) {
                    next();
                    const property = expression(!0);
                    expect("]"), chain_contents = subscripts(new AST_Sub({
                        start,
                        expression: expr,
                        optional: !0,
                        property,
                        end: prev()
                    }), allow_calls, !0);
                }
                return (chain_contents || unexpected(), chain_contents instanceof AST_Chain) ? chain_contents : new AST_Chain({
                    start,
                    expression: chain_contents,
                    end: prev()
                });
            }
            return is("template_head") ? (is_chain && // a?.b`c` is a syntax error
            unexpected(), subscripts(new AST_PrefixedTemplateString({
                start: start,
                prefix: expr,
                template_string: template_string(),
                end: prev()
            }), allow_calls)) : expr;
        };
        function call_args() {
            for(var args = []; !is("punc", ")");)is("expand", "...") ? (next(), args.push(new AST_Expansion({
                start: prev(),
                expression: expression(!1),
                end: prev()
            }))) : args.push(expression(!1)), is("punc", ")") || expect(",");
            return next(), args;
        }
        var maybe_unary = function(allow_calls, allow_arrows) {
            var start = S.token;
            if ("name" == start.type && "await" == start.value && can_await()) return next(), can_await() || croak("Unexpected await expression outside async function", S.prev.line, S.prev.col, S.prev.pos), new AST_Await({
                start: prev(),
                end: S.token,
                expression: maybe_unary(!0)
            });
            if (is("operator") && UNARY_PREFIX.has(start.value)) {
                next(), handle_regexp();
                var ex = make_unary(AST_UnaryPrefix, start, maybe_unary(allow_calls));
                return ex.start = start, ex.end = prev(), ex;
            }
            for(var val = expr_atom(allow_calls, allow_arrows); is("operator") && UNARY_POSTFIX.has(S.token.value) && !has_newline_before(S.token);)val instanceof AST_Arrow && unexpected(), (val = make_unary(AST_UnaryPostfix, S.token, val)).start = start, val.end = S.token, next();
            return val;
        };
        function make_unary(ctor, token, expr) {
            var op = token.value;
            switch(op){
                case "++":
                case "--":
                    is_assignable(expr) || croak("Invalid use of " + op + " operator", token.line, token.col, token.pos);
                    break;
                case "delete":
                    expr instanceof AST_SymbolRef && S.input.has_directive("use strict") && croak("Calling delete on expression not allowed in strict mode", expr.start.line, expr.start.col, expr.start.pos);
            }
            return new ctor({
                operator: op,
                expression: expr
            });
        }
        var expr_op = function(left, min_prec, no_in) {
            var op = is("operator") ? S.token.value : null;
            "in" == op && no_in && (op = null), "**" == op && left instanceof AST_UnaryPrefix && !is_token(left.start, "punc", "(") && "--" !== left.operator && "++" !== left.operator && unexpected(left.start);
            var prec = null != op ? PRECEDENCE[op] : null;
            if (null != prec && (prec > min_prec || "**" === op && min_prec === prec)) {
                next();
                var right = expr_op(maybe_unary(!0), prec, no_in);
                return expr_op(new AST_Binary({
                    start: left.start,
                    left: left,
                    operator: op,
                    right: right,
                    end: right.end
                }), min_prec, no_in);
            }
            return left;
        }, maybe_conditional = function(no_in) {
            var start = S.token, expr = expr_op(maybe_unary(!0, !0), 0, no_in);
            if (is("operator", "?")) {
                next();
                var yes = expression(!1);
                return expect(":"), new AST_Conditional({
                    start: start,
                    condition: expr,
                    consequent: yes,
                    alternative: expression(!1, no_in),
                    end: prev()
                });
            }
            return expr;
        };
        function is_assignable(expr) {
            return expr instanceof AST_PropAccess || expr instanceof AST_SymbolRef;
        }
        function to_destructuring(node) {
            if (node instanceof AST_Object) node = new AST_Destructuring({
                start: node.start,
                names: node.properties.map(to_destructuring),
                is_array: !1,
                end: node.end
            });
            else if (node instanceof AST_Array) {
                for(var names = [], i = 0; i < node.elements.length; i++)node.elements[i] instanceof AST_Expansion && (i + 1 !== node.elements.length && token_error(node.elements[i].start, "Spread must the be last element in destructuring array"), node.elements[i].expression = to_destructuring(node.elements[i].expression)), names.push(to_destructuring(node.elements[i]));
                node = new AST_Destructuring({
                    start: node.start,
                    names: names,
                    is_array: !0,
                    end: node.end
                });
            } else node instanceof AST_ObjectProperty ? node.value = to_destructuring(node.value) : node instanceof AST_Assign && (node = new AST_DefaultAssign({
                start: node.start,
                left: node.left,
                operator: "=",
                right: node.right,
                end: node.end
            }));
            return node;
        }
        // In ES6, AssignmentExpression can also be an ArrowFunction
        var maybe_assign = function(no_in) {
            handle_regexp();
            var start, star, has_expression, start1 = S.token;
            if ("name" == start1.type && "yield" == start1.value) {
                if (is_in_generator()) return next(), is_in_generator() || croak("Unexpected yield expression outside generator function", S.prev.line, S.prev.col, S.prev.pos), start = S.token, star = !1, has_expression = !0, can_insert_semicolon() || is("punc") && PUNC_AFTER_EXPRESSION.has(S.token.value) ? has_expression = !1 : is("operator", "*") && (star = !0, next()), new AST_Yield({
                    start: start,
                    is_star: star,
                    expression: has_expression ? expression() : null,
                    end: prev()
                });
                S.input.has_directive("use strict") && token_error(S.token, "Unexpected yield identifier inside strict mode");
            }
            var left = maybe_conditional(no_in), val = S.token.value;
            if (is("operator") && ASSIGNMENT.has(val)) {
                if (is_assignable(left) || (left = to_destructuring(left)) instanceof AST_Destructuring) return next(), new AST_Assign({
                    start: start1,
                    left: left,
                    operator: val,
                    right: maybe_assign(no_in),
                    logical: LOGICAL_ASSIGNMENT.has(val),
                    end: prev()
                });
                croak("Invalid assignment");
            }
            return left;
        }, expression = function(commas, no_in) {
            for(var start = S.token, exprs = []; exprs.push(maybe_assign(no_in)), commas && is("punc", ",");)next(), commas = !0;
            return 1 == exprs.length ? exprs[0] : new AST_Sequence({
                start: start,
                expressions: exprs,
                end: peek()
            });
        };
        function in_loop(cont) {
            ++S.in_loop;
            var ret = cont();
            return --S.in_loop, ret;
        }
        return options.expression ? expression(!0) : function() {
            var start = S.token, body = [];
            for(S.input.push_directives_stack(), options.module && S.input.add_directive("use strict"); !is("eof");)body.push(statement());
            S.input.pop_directives_stack();
            var end = prev(), toplevel = options.toplevel;
            return toplevel ? (toplevel.body = toplevel.body.concat(body), toplevel.end = end) : toplevel = new AST_Toplevel({
                start: start,
                body: body,
                end: end
            }), toplevel;
        }();
    }
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function DEFNODE(type, props, methods, base = AST_Node) {
        var self_props = props = props ? props.split(/\s+/) : [];
        base && base.PROPS && (props = props.concat(base.PROPS));
        for(var code = "return function AST_" + type + "(props){ if (props) { ", i = props.length; --i >= 0;)code += "this." + props[i] + " = props." + props[i] + ";";
        const proto = base && Object.create(base.prototype);
        (proto && proto.initialize || methods && methods.initialize) && (code += "this.initialize();");
        var ctor = Function(code += "}this.flags = 0;}")();
        if (proto && (ctor.prototype = proto, ctor.BASE = base), base && base.SUBCLASSES.push(ctor), ctor.prototype.CTOR = ctor, ctor.prototype.constructor = ctor, ctor.PROPS = props || null, ctor.SELF_PROPS = self_props, ctor.SUBCLASSES = [], type && (ctor.prototype.TYPE = ctor.TYPE = type), methods) for(i in methods)HOP(methods, i) && ("$" === i[0] ? ctor[i.substr(1)] = methods[i] : ctor.prototype[i] = methods[i]);
        return ctor.DEFMETHOD = function(name, method) {
            this.prototype[name] = method;
        }, ctor;
    }
    const has_tok_flag = (tok, flag)=>!!(tok.flags & flag), set_tok_flag = (tok, flag, truth)=>{
        truth ? tok.flags |= flag : tok.flags &= ~flag;
    };
    class AST_Token {
        constructor(type, value, line, col, pos, nlb, comments_before, comments_after, file){
            this.flags = nlb ? 1 : 0, this.type = type, this.value = value, this.line = line, this.col = col, this.pos = pos, this.comments_before = comments_before, this.comments_after = comments_after, this.file = file, Object.seal(this);
        }
        get nlb() {
            return has_tok_flag(this, 0b0001);
        }
        set nlb(new_nlb) {
            set_tok_flag(this, 0b0001, new_nlb);
        }
        get quote() {
            return has_tok_flag(this, 0b0100) ? has_tok_flag(this, 0b0010) ? "'" : '"' : "";
        }
        set quote(quote_type) {
            set_tok_flag(this, 0b0010, "'" === quote_type), set_tok_flag(this, 0b0100, !!quote_type);
        }
    }
    var AST_Node = DEFNODE("Node", "start end", {
        _clone: function(deep) {
            if (deep) {
                var self1 = this.clone();
                return self1.transform(new TreeTransformer(function(node) {
                    if (node !== self1) return node.clone(!0);
                }));
            }
            return new this.CTOR(this);
        },
        clone: function(deep) {
            return this._clone(deep);
        },
        $documentation: "Base class of all AST nodes",
        $propdoc: {
            start: "[AST_Token] The first token of this node",
            end: "[AST_Token] The last token of this node"
        },
        _walk: function(visitor) {
            return visitor._visit(this);
        },
        walk: function(visitor) {
            return this._walk(visitor); // not sure the indirection will be any help
        },
        _children_backwards: ()=>{}
    }, null), AST_Statement = DEFNODE("Statement", null, {
        $documentation: "Base class of all statements"
    }), AST_Debugger = DEFNODE("Debugger", null, {
        $documentation: "Represents a debugger statement"
    }, AST_Statement), AST_Directive = DEFNODE("Directive", "value quote", {
        $documentation: "Represents a directive, like \"use strict\";",
        $propdoc: {
            value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
            quote: "[string] the original quote character"
        }
    }, AST_Statement), AST_SimpleStatement = DEFNODE("SimpleStatement", "body", {
        $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
        $propdoc: {
            body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body);
        }
    }, AST_Statement);
    function walk_body(node, visitor) {
        const body = node.body;
        for(var i = 0, len = body.length; i < len; i++)body[i]._walk(visitor);
    }
    function clone_block_scope(deep) {
        var clone = this._clone(deep);
        return this.block_scope && (clone.block_scope = this.block_scope.clone()), clone;
    }
    var AST_Block = DEFNODE("Block", "body block_scope", {
        $documentation: "A body of statements (usually braced)",
        $propdoc: {
            body: "[AST_Statement*] an array of statements",
            block_scope: "[AST_Scope] the block scope"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                walk_body(this, visitor);
            });
        },
        _children_backwards (push) {
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
        },
        clone: clone_block_scope
    }, AST_Statement), AST_BlockStatement = DEFNODE("BlockStatement", null, {
        $documentation: "A block statement"
    }, AST_Block), AST_EmptyStatement = DEFNODE("EmptyStatement", null, {
        $documentation: "The empty statement (empty block or simply a semicolon)"
    }, AST_Statement), AST_StatementWithBody = DEFNODE("StatementWithBody", "body", {
        $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
        $propdoc: {
            body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
        }
    }, AST_Statement), AST_LabeledStatement = DEFNODE("LabeledStatement", "label", {
        $documentation: "Statement with a label",
        $propdoc: {
            label: "[AST_Label] a label definition"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.label._walk(visitor), this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body), push(this.label);
        },
        clone: function(deep) {
            var node = this._clone(deep);
            if (deep) {
                var label = node.label, def = this.label;
                node.walk(new TreeWalker(function(node) {
                    node instanceof AST_LoopControl && node.label && node.label.thedef === def && (node.label.thedef = label, label.references.push(node));
                }));
            }
            return node;
        }
    }, AST_StatementWithBody), AST_IterationStatement = DEFNODE("IterationStatement", "block_scope", {
        $documentation: "Internal class.  All loops inherit from it.",
        $propdoc: {
            block_scope: "[AST_Scope] the block scope for this iteration statement."
        },
        clone: clone_block_scope
    }, AST_StatementWithBody), AST_DWLoop = DEFNODE("DWLoop", "condition", {
        $documentation: "Base class for do/while statements",
        $propdoc: {
            condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
        }
    }, AST_IterationStatement), AST_Do = DEFNODE("Do", null, {
        $documentation: "A `do` statement",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.body._walk(visitor), this.condition._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.condition), push(this.body);
        }
    }, AST_DWLoop), AST_While = DEFNODE("While", null, {
        $documentation: "A `while` statement",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor), this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body), push(this.condition);
        }
    }, AST_DWLoop), AST_For = DEFNODE("For", "init condition step", {
        $documentation: "A `for` statement",
        $propdoc: {
            init: "[AST_Node?] the `for` initialization code, or null if empty",
            condition: "[AST_Node?] the `for` termination clause, or null if empty",
            step: "[AST_Node?] the `for` update clause, or null if empty"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.init && this.init._walk(visitor), this.condition && this.condition._walk(visitor), this.step && this.step._walk(visitor), this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body), this.step && push(this.step), this.condition && push(this.condition), this.init && push(this.init);
        }
    }, AST_IterationStatement), AST_ForIn = DEFNODE("ForIn", "init object", {
        $documentation: "A `for ... in` statement",
        $propdoc: {
            init: "[AST_Node] the `for/in` initialization code",
            object: "[AST_Node] the object that we're looping through"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.init._walk(visitor), this.object._walk(visitor), this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body), this.object && push(this.object), this.init && push(this.init);
        }
    }, AST_IterationStatement), AST_ForOf = DEFNODE("ForOf", "await", {
        $documentation: "A `for ... of` statement"
    }, AST_ForIn), AST_With = DEFNODE("With", "expression", {
        $documentation: "A `with` statement",
        $propdoc: {
            expression: "[AST_Node] the `with` expression"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor), this.body._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.body), push(this.expression);
        }
    }, AST_StatementWithBody), AST_Scope = DEFNODE("Scope", "variables functions uses_with uses_eval parent_scope enclosed cname", {
        $documentation: "Base class for all statements introducing a lexical scope",
        $propdoc: {
            variables: "[Map/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
            uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
            uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
            parent_scope: "[AST_Scope?/S] link to the parent scope",
            enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
            cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
        },
        get_defun_scope: function() {
            for(var self1 = this; self1.is_block_scope();)self1 = self1.parent_scope;
            return self1;
        },
        clone: function(deep, toplevel) {
            var node = this._clone(deep);
            return deep && this.variables && toplevel && !this._block_scope ? node.figure_out_scope({}, {
                toplevel: toplevel,
                parent_scope: this.parent_scope
            }) : (this.variables && (node.variables = new Map(this.variables)), this.enclosed && (node.enclosed = this.enclosed.slice()), this._block_scope && (node._block_scope = this._block_scope)), node;
        },
        pinned: function() {
            return this.uses_eval || this.uses_with;
        }
    }, AST_Block), AST_Toplevel = DEFNODE("Toplevel", "globals", {
        $documentation: "The toplevel scope",
        $propdoc: {
            globals: "[Map/S] a map of name -> SymbolDef for all undeclared names"
        },
        wrap_commonjs: function(name) {
            var body = this.body, wrapped_tl = "(function(exports){'$ORIG';})(typeof " + name + "=='undefined'?(" + name + "={}):" + name + ");";
            return (wrapped_tl = parse(wrapped_tl)).transform(new TreeTransformer(function(node) {
                if (node instanceof AST_Directive && "$ORIG" == node.value) return MAP.splice(body);
            }));
        },
        wrap_enclose: function(args_values) {
            "string" != typeof args_values && (args_values = "");
            var index = args_values.indexOf(":");
            index < 0 && (index = args_values.length);
            var body = this.body;
            return parse([
                "(function(",
                args_values.slice(0, index),
                '){"$ORIG"})(',
                args_values.slice(index + 1),
                ")"
            ].join("")).transform(new TreeTransformer(function(node) {
                if (node instanceof AST_Directive && "$ORIG" == node.value) return MAP.splice(body);
            }));
        }
    }, AST_Scope), AST_Expansion = DEFNODE("Expansion", "expression", {
        $documentation: "An expandible argument, such as ...rest, a splat, such as [1,2,...all], or an expansion in a variable declaration, such as var [first, ...rest] = list",
        $propdoc: {
            expression: "[AST_Node] the thing to be expanded"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression.walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }), AST_Lambda = DEFNODE("Lambda", "name argnames uses_arguments is_generator async", {
        $documentation: "Base class for functions",
        $propdoc: {
            name: "[AST_SymbolDeclaration?] the name of this function",
            argnames: "[AST_SymbolFunarg|AST_Destructuring|AST_Expansion|AST_DefaultAssign*] array of function arguments, destructurings, or expanding arguments",
            uses_arguments: "[boolean/S] tells whether this function accesses the arguments array",
            is_generator: "[boolean] is this a generator method",
            async: "[boolean] is this method async"
        },
        args_as_names: function() {
            for(var out = [], i = 0; i < this.argnames.length; i++)this.argnames[i] instanceof AST_Destructuring ? out.push(...this.argnames[i].all_symbols()) : out.push(this.argnames[i]);
            return out;
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.name && this.name._walk(visitor);
                for(var argnames = this.argnames, i = 0, len = argnames.length; i < len; i++)argnames[i]._walk(visitor);
                walk_body(this, visitor);
            });
        },
        _children_backwards (push) {
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
            for(i = this.argnames.length; i--;)push(this.argnames[i]);
            this.name && push(this.name);
        },
        is_braceless () {
            return this.body[0] instanceof AST_Return && this.body[0].value;
        },
        // Default args and expansion don't count, so .argnames.length doesn't cut it
        length_property () {
            let length = 0;
            for (const arg of this.argnames)(arg instanceof AST_SymbolFunarg || arg instanceof AST_Destructuring) && length++;
            return length;
        }
    }, AST_Scope), AST_Accessor = DEFNODE("Accessor", null, {
        $documentation: "A setter/getter function.  The `name` property is always null."
    }, AST_Lambda), AST_Function = DEFNODE("Function", null, {
        $documentation: "A function expression"
    }, AST_Lambda), AST_Arrow = DEFNODE("Arrow", null, {
        $documentation: "An ES6 Arrow function ((a) => b)"
    }, AST_Lambda), AST_Defun = DEFNODE("Defun", null, {
        $documentation: "A function definition"
    }, AST_Lambda), AST_Destructuring = DEFNODE("Destructuring", "names is_array", {
        $documentation: "A destructuring of several names. Used in destructuring assignment and with destructuring function argument names",
        $propdoc: {
            names: "[AST_Node*] Array of properties or elements",
            is_array: "[Boolean] Whether the destructuring represents an object or array"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.names.forEach(function(name) {
                    name._walk(visitor);
                });
            });
        },
        _children_backwards (push) {
            let i = this.names.length;
            for(; i--;)push(this.names[i]);
        },
        all_symbols: function() {
            var out = [];
            return this.walk(new TreeWalker(function(node) {
                node instanceof AST_Symbol && out.push(node);
            })), out;
        }
    }), AST_PrefixedTemplateString = DEFNODE("PrefixedTemplateString", "template_string prefix", {
        $documentation: "A templatestring with a prefix, such as String.raw`foobarbaz`",
        $propdoc: {
            template_string: "[AST_TemplateString] The template string",
            prefix: "[AST_Node] The prefix, which will get called."
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.prefix._walk(visitor), this.template_string._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.template_string), push(this.prefix);
        }
    }), AST_TemplateString = DEFNODE("TemplateString", "segments", {
        $documentation: "A template string literal",
        $propdoc: {
            segments: "[AST_Node*] One or more segments, starting with AST_TemplateSegment. AST_Node may follow AST_TemplateSegment, but each AST_Node must be followed by AST_TemplateSegment."
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.segments.forEach(function(seg) {
                    seg._walk(visitor);
                });
            });
        },
        _children_backwards (push) {
            let i = this.segments.length;
            for(; i--;)push(this.segments[i]);
        }
    }), AST_TemplateSegment = DEFNODE("TemplateSegment", "value raw", {
        $documentation: "A segment of a template string literal",
        $propdoc: {
            value: "Content of the segment",
            raw: "Raw source of the segment"
        }
    }), AST_Jump = DEFNODE("Jump", null, {
        $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
    }, AST_Statement), AST_Exit = DEFNODE("Exit", "value", {
        $documentation: "Base class for “exits” (`return` and `throw`)",
        $propdoc: {
            value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
        },
        _walk: function(visitor) {
            return visitor._visit(this, this.value && function() {
                this.value._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.value && push(this.value);
        }
    }, AST_Jump), AST_Return = DEFNODE("Return", null, {
        $documentation: "A `return` statement"
    }, AST_Exit), AST_Throw = DEFNODE("Throw", null, {
        $documentation: "A `throw` statement"
    }, AST_Exit), AST_LoopControl = DEFNODE("LoopControl", "label", {
        $documentation: "Base class for loop control statements (`break` and `continue`)",
        $propdoc: {
            label: "[AST_LabelRef?] the label, or null if none"
        },
        _walk: function(visitor) {
            return visitor._visit(this, this.label && function() {
                this.label._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.label && push(this.label);
        }
    }, AST_Jump), AST_Break = DEFNODE("Break", null, {
        $documentation: "A `break` statement"
    }, AST_LoopControl), AST_Continue = DEFNODE("Continue", null, {
        $documentation: "A `continue` statement"
    }, AST_LoopControl), AST_Await = DEFNODE("Await", "expression", {
        $documentation: "An `await` statement",
        $propdoc: {
            expression: "[AST_Node] the mandatory expression being awaited"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }), AST_Yield = DEFNODE("Yield", "expression is_star", {
        $documentation: "A `yield` statement",
        $propdoc: {
            expression: "[AST_Node?] the value returned or thrown by this statement; could be null (representing undefined) but only when is_star is set to false",
            is_star: "[Boolean] Whether this is a yield or yield* statement"
        },
        _walk: function(visitor) {
            return visitor._visit(this, this.expression && function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.expression && push(this.expression);
        }
    }), AST_If = DEFNODE("If", "condition alternative", {
        $documentation: "A `if` statement",
        $propdoc: {
            condition: "[AST_Node] the `if` condition",
            alternative: "[AST_Statement?] the `else` part, or null if not present"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor), this.body._walk(visitor), this.alternative && this.alternative._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.alternative && push(this.alternative), push(this.body), push(this.condition);
        }
    }, AST_StatementWithBody), AST_Switch = DEFNODE("Switch", "expression", {
        $documentation: "A `switch` statement",
        $propdoc: {
            expression: "[AST_Node] the `switch` “discriminant”"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor), walk_body(this, visitor);
            });
        },
        _children_backwards (push) {
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
            push(this.expression);
        }
    }, AST_Block), AST_SwitchBranch = DEFNODE("SwitchBranch", null, {
        $documentation: "Base class for `switch` branches"
    }, AST_Block), AST_Default = DEFNODE("Default", null, {
        $documentation: "A `default` switch branch"
    }, AST_SwitchBranch), AST_Case = DEFNODE("Case", "expression", {
        $documentation: "A `case` switch branch",
        $propdoc: {
            expression: "[AST_Node] the `case` expression"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor), walk_body(this, visitor);
            });
        },
        _children_backwards (push) {
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
            push(this.expression);
        }
    }, AST_SwitchBranch), AST_Try = DEFNODE("Try", "bcatch bfinally", {
        $documentation: "A `try` statement",
        $propdoc: {
            bcatch: "[AST_Catch?] the catch block, or null if not present",
            bfinally: "[AST_Finally?] the finally block, or null if not present"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                walk_body(this, visitor), this.bcatch && this.bcatch._walk(visitor), this.bfinally && this.bfinally._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.bfinally && push(this.bfinally), this.bcatch && push(this.bcatch);
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
        }
    }, AST_Block), AST_Catch = DEFNODE("Catch", "argname", {
        $documentation: "A `catch` node; only makes sense as part of a `try` statement",
        $propdoc: {
            argname: "[AST_SymbolCatch|AST_Destructuring|AST_Expansion|AST_DefaultAssign] symbol for the exception"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.argname && this.argname._walk(visitor), walk_body(this, visitor);
            });
        },
        _children_backwards (push) {
            let i = this.body.length;
            for(; i--;)push(this.body[i]);
            this.argname && push(this.argname);
        }
    }, AST_Block), AST_Finally = DEFNODE("Finally", null, {
        $documentation: "A `finally` node; only makes sense as part of a `try` statement"
    }, AST_Block), AST_Definitions = DEFNODE("Definitions", "definitions", {
        $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
        $propdoc: {
            definitions: "[AST_VarDef*] array of variable definitions"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                for(var definitions = this.definitions, i = 0, len = definitions.length; i < len; i++)definitions[i]._walk(visitor);
            });
        },
        _children_backwards (push) {
            let i = this.definitions.length;
            for(; i--;)push(this.definitions[i]);
        }
    }, AST_Statement), AST_Var = DEFNODE("Var", null, {
        $documentation: "A `var` statement"
    }, AST_Definitions), AST_Let = DEFNODE("Let", null, {
        $documentation: "A `let` statement"
    }, AST_Definitions), AST_Const = DEFNODE("Const", null, {
        $documentation: "A `const` statement"
    }, AST_Definitions), AST_VarDef = DEFNODE("VarDef", "name value", {
        $documentation: "A variable declaration; only appears in a AST_Definitions node",
        $propdoc: {
            name: "[AST_Destructuring|AST_SymbolConst|AST_SymbolLet|AST_SymbolVar] name of the variable",
            value: "[AST_Node?] initializer, or null of there's no initializer"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.name._walk(visitor), this.value && this.value._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.value && push(this.value), push(this.name);
        }
    }), AST_NameMapping = DEFNODE("NameMapping", "foreign_name name", {
        $documentation: "The part of the export/import statement that declare names from a module.",
        $propdoc: {
            foreign_name: "[AST_SymbolExportForeign|AST_SymbolImportForeign] The name being exported/imported (as specified in the module)",
            name: "[AST_SymbolExport|AST_SymbolImport] The name as it is visible to this module."
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.foreign_name._walk(visitor), this.name._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.name), push(this.foreign_name);
        }
    }), AST_Import = DEFNODE("Import", "imported_name imported_names module_name assert_clause", {
        $documentation: "An `import` statement",
        $propdoc: {
            imported_name: "[AST_SymbolImport] The name of the variable holding the module's default export.",
            imported_names: "[AST_NameMapping*] The names of non-default imported variables",
            module_name: "[AST_String] String literal describing where this module came from",
            assert_clause: "[AST_Object?] The import assertion"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.imported_name && this.imported_name._walk(visitor), this.imported_names && this.imported_names.forEach(function(name_import) {
                    name_import._walk(visitor);
                }), this.module_name._walk(visitor);
            });
        },
        _children_backwards (push) {
            if (push(this.module_name), this.imported_names) {
                let i = this.imported_names.length;
                for(; i--;)push(this.imported_names[i]);
            }
            this.imported_name && push(this.imported_name);
        }
    }), AST_ImportMeta = DEFNODE("ImportMeta", null, {
        $documentation: "A reference to import.meta"
    }), AST_Export = DEFNODE("Export", "exported_definition exported_value is_default exported_names module_name assert_clause", {
        $documentation: "An `export` statement",
        $propdoc: {
            exported_definition: "[AST_Defun|AST_Definitions|AST_DefClass?] An exported definition",
            exported_value: "[AST_Node?] An exported value",
            exported_names: "[AST_NameMapping*?] List of exported names",
            module_name: "[AST_String?] Name of the file to load exports from",
            is_default: "[Boolean] Whether this is the default exported value of this module",
            assert_clause: "[AST_Object?] The import assertion"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.exported_definition && this.exported_definition._walk(visitor), this.exported_value && this.exported_value._walk(visitor), this.exported_names && this.exported_names.forEach(function(name_export) {
                    name_export._walk(visitor);
                }), this.module_name && this.module_name._walk(visitor);
            });
        },
        _children_backwards (push) {
            if (this.module_name && push(this.module_name), this.exported_names) {
                let i = this.exported_names.length;
                for(; i--;)push(this.exported_names[i]);
            }
            this.exported_value && push(this.exported_value), this.exported_definition && push(this.exported_definition);
        }
    }, AST_Statement), AST_Call = DEFNODE("Call", "expression args optional _annotations", {
        $documentation: "A function call expression",
        $propdoc: {
            expression: "[AST_Node] expression to invoke as function",
            args: "[AST_Node*] array of arguments",
            optional: "[boolean] whether this is an optional call (IE ?.() )",
            _annotations: "[number] bitfield containing information about the call"
        },
        initialize () {
            null == this._annotations && (this._annotations = 0);
        },
        _walk (visitor) {
            return visitor._visit(this, function() {
                for(var args = this.args, i = 0, len = args.length; i < len; i++)args[i]._walk(visitor);
                this.expression._walk(visitor); // TODO why do we need to crawl this last?
            });
        },
        _children_backwards (push) {
            let i = this.args.length;
            for(; i--;)push(this.args[i]);
            push(this.expression);
        }
    }), AST_New = DEFNODE("New", null, {
        $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
    }, AST_Call), AST_Sequence = DEFNODE("Sequence", "expressions", {
        $documentation: "A sequence expression (comma-separated expressions)",
        $propdoc: {
            expressions: "[AST_Node*] array of expressions (at least two)"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expressions.forEach(function(node) {
                    node._walk(visitor);
                });
            });
        },
        _children_backwards (push) {
            let i = this.expressions.length;
            for(; i--;)push(this.expressions[i]);
        }
    }), AST_PropAccess = DEFNODE("PropAccess", "expression property optional", {
        $documentation: "Base class for property access expressions, i.e. `a.foo` or `a[\"foo\"]`",
        $propdoc: {
            expression: "[AST_Node] the “container” expression",
            property: "[AST_Node|string] the property to access.  For AST_Dot & AST_DotHash this is always a plain string, while for AST_Sub it's an arbitrary AST_Node",
            optional: "[boolean] whether this is an optional property access (IE ?.)"
        }
    }), AST_Dot = DEFNODE("Dot", "quote", {
        $documentation: "A dotted property access expression",
        $propdoc: {
            quote: "[string] the original quote character when transformed from AST_Sub"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }, AST_PropAccess), AST_DotHash = DEFNODE("DotHash", "", {
        $documentation: "A dotted property access to a private property",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }, AST_PropAccess), AST_Sub = DEFNODE("Sub", null, {
        $documentation: "Index-style property access, i.e. `a[\"foo\"]`",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor), this.property._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.property), push(this.expression);
        }
    }, AST_PropAccess), AST_Chain = DEFNODE("Chain", "expression", {
        $documentation: "A chain expression like a?.b?.(c)?.[d]",
        $propdoc: {
            expression: "[AST_Call|AST_Dot|AST_DotHash|AST_Sub] chain element."
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }), AST_Unary = DEFNODE("Unary", "operator expression", {
        $documentation: "Base class for unary expressions",
        $propdoc: {
            operator: "[string] the operator",
            expression: "[AST_Node] expression that this unary operator applies to"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.expression);
        }
    }), AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, {
        $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
    }, AST_Unary), AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, {
        $documentation: "Unary postfix expression, i.e. `i++`"
    }, AST_Unary), AST_Binary = DEFNODE("Binary", "operator left right", {
        $documentation: "Binary expression, i.e. `a + b`",
        $propdoc: {
            left: "[AST_Node] left-hand side expression",
            operator: "[string] the operator",
            right: "[AST_Node] right-hand side expression"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.left._walk(visitor), this.right._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.right), push(this.left);
        }
    }), AST_Conditional = DEFNODE("Conditional", "condition consequent alternative", {
        $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
        $propdoc: {
            condition: "[AST_Node]",
            consequent: "[AST_Node]",
            alternative: "[AST_Node]"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor), this.consequent._walk(visitor), this.alternative._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.alternative), push(this.consequent), push(this.condition);
        }
    }), AST_Assign = DEFNODE("Assign", "logical", {
        $documentation: "An assignment expression — `a = b + 5`",
        $propdoc: {
            logical: "Whether it's a logical assignment"
        }
    }, AST_Binary), AST_DefaultAssign = DEFNODE("DefaultAssign", null, {
        $documentation: "A default assignment expression like in `(a = 3) => a`"
    }, AST_Binary), AST_Array = DEFNODE("Array", "elements", {
        $documentation: "An array literal",
        $propdoc: {
            elements: "[AST_Node*] array of elements"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                for(var elements = this.elements, i = 0, len = elements.length; i < len; i++)elements[i]._walk(visitor);
            });
        },
        _children_backwards (push) {
            let i = this.elements.length;
            for(; i--;)push(this.elements[i]);
        }
    }), AST_Object = DEFNODE("Object", "properties", {
        $documentation: "An object literal",
        $propdoc: {
            properties: "[AST_ObjectProperty*] array of properties"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                for(var properties = this.properties, i = 0, len = properties.length; i < len; i++)properties[i]._walk(visitor);
            });
        },
        _children_backwards (push) {
            let i = this.properties.length;
            for(; i--;)push(this.properties[i]);
        }
    }), AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", {
        $documentation: "Base class for literal object properties",
        $propdoc: {
            key: "[string|AST_Node] property name. For ObjectKeyVal this is a string. For getters, setters and computed property this is an AST_Node.",
            value: "[AST_Node] property value.  For getters and setters this is an AST_Accessor."
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.key instanceof AST_Node && this.key._walk(visitor), this.value._walk(visitor);
            });
        },
        _children_backwards (push) {
            push(this.value), this.key instanceof AST_Node && push(this.key);
        }
    }), AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", "quote", {
        $documentation: "A key: value object property",
        $propdoc: {
            quote: "[string] the original quote character"
        },
        computed_key () {
            return this.key instanceof AST_Node;
        }
    }, AST_ObjectProperty), AST_PrivateSetter = DEFNODE("PrivateSetter", "static", {
        $propdoc: {
            static: "[boolean] whether this is a static private setter"
        },
        $documentation: "A private setter property",
        computed_key: ()=>!1
    }, AST_ObjectProperty), AST_PrivateGetter = DEFNODE("PrivateGetter", "static", {
        $propdoc: {
            static: "[boolean] whether this is a static private getter"
        },
        $documentation: "A private getter property",
        computed_key: ()=>!1
    }, AST_ObjectProperty), AST_ObjectSetter = DEFNODE("ObjectSetter", "quote static", {
        $propdoc: {
            quote: "[string|undefined] the original quote character, if any",
            static: "[boolean] whether this is a static setter (classes only)"
        },
        $documentation: "An object setter property",
        computed_key () {
            return !(this.key instanceof AST_SymbolMethod);
        }
    }, AST_ObjectProperty), AST_ObjectGetter = DEFNODE("ObjectGetter", "quote static", {
        $propdoc: {
            quote: "[string|undefined] the original quote character, if any",
            static: "[boolean] whether this is a static getter (classes only)"
        },
        $documentation: "An object getter property",
        computed_key () {
            return !(this.key instanceof AST_SymbolMethod);
        }
    }, AST_ObjectProperty), AST_ConciseMethod = DEFNODE("ConciseMethod", "quote static is_generator async", {
        $propdoc: {
            quote: "[string|undefined] the original quote character, if any",
            static: "[boolean] is this method static (classes only)",
            is_generator: "[boolean] is this a generator method",
            async: "[boolean] is this method async"
        },
        $documentation: "An ES6 concise method inside an object or class",
        computed_key () {
            return !(this.key instanceof AST_SymbolMethod);
        }
    }, AST_ObjectProperty), AST_PrivateMethod = DEFNODE("PrivateMethod", "", {
        $documentation: "A private class method inside a class"
    }, AST_ConciseMethod), AST_Class = DEFNODE("Class", "name extends properties", {
        $propdoc: {
            name: "[AST_SymbolClass|AST_SymbolDefClass?] optional class name.",
            extends: "[AST_Node]? optional parent class",
            properties: "[AST_ObjectProperty*] array of properties"
        },
        $documentation: "An ES6 class",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.name && this.name._walk(visitor), this.extends && this.extends._walk(visitor), this.properties.forEach((prop)=>prop._walk(visitor));
            });
        },
        _children_backwards (push) {
            let i = this.properties.length;
            for(; i--;)push(this.properties[i]);
            this.extends && push(this.extends), this.name && push(this.name);
        }
    }, AST_Scope /* TODO a class might have a scope but it's not a scope */ ), AST_ClassProperty = DEFNODE("ClassProperty", "static quote", {
        $documentation: "A class property",
        $propdoc: {
            static: "[boolean] whether this is a static key",
            quote: "[string] which quote is being used"
        },
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.key instanceof AST_Node && this.key._walk(visitor), this.value instanceof AST_Node && this.value._walk(visitor);
            });
        },
        _children_backwards (push) {
            this.value instanceof AST_Node && push(this.value), this.key instanceof AST_Node && push(this.key);
        },
        computed_key () {
            return !(this.key instanceof AST_SymbolClassProperty);
        }
    }, AST_ObjectProperty), AST_ClassPrivateProperty = DEFNODE("ClassPrivateProperty", "", {
        $documentation: "A class property for a private property"
    }, AST_ClassProperty), AST_DefClass = DEFNODE("DefClass", null, {
        $documentation: "A class definition"
    }, AST_Class), AST_ClassExpression = DEFNODE("ClassExpression", null, {
        $documentation: "A class expression."
    }, AST_Class), AST_Symbol = DEFNODE("Symbol", "scope name thedef", {
        $propdoc: {
            name: "[string] name of this symbol",
            scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
            thedef: "[SymbolDef/S] the definition of this symbol"
        },
        $documentation: "Base class for all symbols"
    }), AST_NewTarget = DEFNODE("NewTarget", null, {
        $documentation: "A reference to new.target"
    }), AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", {
        $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)"
    }, AST_Symbol), AST_SymbolVar = DEFNODE("SymbolVar", null, {
        $documentation: "Symbol defining a variable"
    }, AST_SymbolDeclaration), AST_SymbolBlockDeclaration = DEFNODE("SymbolBlockDeclaration", null, {
        $documentation: "Base class for block-scoped declaration symbols"
    }, AST_SymbolDeclaration), AST_SymbolConst = DEFNODE("SymbolConst", null, {
        $documentation: "A constant declaration"
    }, AST_SymbolBlockDeclaration), AST_SymbolLet = DEFNODE("SymbolLet", null, {
        $documentation: "A block-scoped `let` declaration"
    }, AST_SymbolBlockDeclaration), AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, {
        $documentation: "Symbol naming a function argument"
    }, AST_SymbolVar), AST_SymbolDefun = DEFNODE("SymbolDefun", null, {
        $documentation: "Symbol defining a function"
    }, AST_SymbolDeclaration), AST_SymbolMethod = DEFNODE("SymbolMethod", null, {
        $documentation: "Symbol in an object defining a method"
    }, AST_Symbol), AST_SymbolClassProperty = DEFNODE("SymbolClassProperty", null, {
        $documentation: "Symbol for a class property"
    }, AST_Symbol), AST_SymbolLambda = DEFNODE("SymbolLambda", null, {
        $documentation: "Symbol naming a function expression"
    }, AST_SymbolDeclaration), AST_SymbolDefClass = DEFNODE("SymbolDefClass", null, {
        $documentation: "Symbol naming a class's name in a class declaration. Lexically scoped to its containing scope, and accessible within the class."
    }, AST_SymbolBlockDeclaration), AST_SymbolClass = DEFNODE("SymbolClass", null, {
        $documentation: "Symbol naming a class's name. Lexically scoped to the class."
    }, AST_SymbolDeclaration), AST_SymbolCatch = DEFNODE("SymbolCatch", null, {
        $documentation: "Symbol naming the exception in catch"
    }, AST_SymbolBlockDeclaration), AST_SymbolImport = DEFNODE("SymbolImport", null, {
        $documentation: "Symbol referring to an imported name"
    }, AST_SymbolBlockDeclaration), AST_SymbolImportForeign = DEFNODE("SymbolImportForeign", null, {
        $documentation: "A symbol imported from a module, but it is defined in the other module, and its real name is irrelevant for this module's purposes"
    }, AST_Symbol), AST_Label = DEFNODE("Label", "references", {
        $documentation: "Symbol naming a label (declaration)",
        $propdoc: {
            references: "[AST_LoopControl*] a list of nodes referring to this label"
        },
        initialize: function() {
            this.references = [], this.thedef = this;
        }
    }, AST_Symbol), AST_SymbolRef = DEFNODE("SymbolRef", null, {
        $documentation: "Reference to some symbol (not definition/declaration)"
    }, AST_Symbol), AST_SymbolExport = DEFNODE("SymbolExport", null, {
        $documentation: "Symbol referring to a name to export"
    }, AST_SymbolRef), AST_SymbolExportForeign = DEFNODE("SymbolExportForeign", null, {
        $documentation: "A symbol exported from this module, but it is used in the other module, and its real name is irrelevant for this module's purposes"
    }, AST_Symbol), AST_LabelRef = DEFNODE("LabelRef", null, {
        $documentation: "Reference to a label symbol"
    }, AST_Symbol), AST_This = DEFNODE("This", null, {
        $documentation: "The `this` symbol"
    }, AST_Symbol), AST_Super = DEFNODE("Super", null, {
        $documentation: "The `super` symbol"
    }, AST_This), AST_Constant = DEFNODE("Constant", null, {
        $documentation: "Base class for all constants",
        getValue: function() {
            return this.value;
        }
    }), AST_String = DEFNODE("String", "value quote", {
        $documentation: "A string literal",
        $propdoc: {
            value: "[string] the contents of this string",
            quote: "[string] the original quote character"
        }
    }, AST_Constant), AST_Number = DEFNODE("Number", "value raw", {
        $documentation: "A number literal",
        $propdoc: {
            value: "[number] the numeric value",
            raw: "[string] numeric value as string"
        }
    }, AST_Constant), AST_BigInt = DEFNODE("BigInt", "value", {
        $documentation: "A big int literal",
        $propdoc: {
            value: "[string] big int value"
        }
    }, AST_Constant), AST_RegExp = DEFNODE("RegExp", "value", {
        $documentation: "A regexp literal",
        $propdoc: {
            value: "[RegExp] the actual regexp"
        }
    }, AST_Constant), AST_Atom = DEFNODE("Atom", null, {
        $documentation: "Base class for atoms"
    }, AST_Constant), AST_Null = DEFNODE("Null", null, {
        $documentation: "The `null` atom",
        value: null
    }, AST_Atom), AST_NaN = DEFNODE("NaN", null, {
        $documentation: "The impossible value",
        value: 0 / 0
    }, AST_Atom), AST_Undefined = DEFNODE("Undefined", null, {
        $documentation: "The `undefined` value",
        value: void 0
    }, AST_Atom), AST_Hole = DEFNODE("Hole", null, {
        $documentation: "A hole in an array",
        value: void 0
    }, AST_Atom), AST_Infinity = DEFNODE("Infinity", null, {
        $documentation: "The `Infinity` value",
        value: 1 / 0
    }, AST_Atom), AST_Boolean = DEFNODE("Boolean", null, {
        $documentation: "Base class for booleans"
    }, AST_Atom), AST_False = DEFNODE("False", null, {
        $documentation: "The `false` atom",
        value: !1
    }, AST_Boolean), AST_True = DEFNODE("True", null, {
        $documentation: "The `true` atom",
        value: !0
    }, AST_Boolean);
    /* -----[ Walk function ]---- */ /**
 * Walk nodes in depth-first search fashion.
 * Callback can return `walk_abort` symbol to stop iteration.
 * It can also return `true` to stop iteration just for child nodes.
 * Iteration can be stopped and continued by passing the `to_visit` argument,
 * which is given to the callback in the second argument.
 **/ function walk(node, cb, to_visit = [
        node
    ]) {
        const push = to_visit.push.bind(to_visit);
        for(; to_visit.length;){
            const node = to_visit.pop(), ret = cb(node, to_visit);
            if (ret) {
                if (ret === walk_abort) return !0;
                continue;
            }
            node._children_backwards(push);
        }
        return !1;
    }
    function walk_parent(node, cb, initial_stack) {
        let current;
        const to_visit = [
            node
        ], push = to_visit.push.bind(to_visit), stack = initial_stack ? initial_stack.slice() : [], parent_pop_indices = [], info = {
            parent: (n = 0)=>-1 === n ? current : initial_stack && n >= stack.length ? (n -= stack.length, initial_stack[initial_stack.length - (n + 1)]) : stack[stack.length - (1 + n)]
        };
        for(; to_visit.length;){
            for(current = to_visit.pop(); parent_pop_indices.length && to_visit.length == parent_pop_indices[parent_pop_indices.length - 1];)stack.pop(), parent_pop_indices.pop();
            const ret = cb(current, info);
            if (ret) {
                if (ret === walk_abort) return !0;
                continue;
            }
            const visit_length = to_visit.length;
            current._children_backwards(push), to_visit.length > visit_length && (stack.push(current), parent_pop_indices.push(visit_length - 1));
        }
        return !1;
    }
    const walk_abort = Symbol("abort walk");
    /* -----[ TreeWalker ]----- */ class TreeWalker {
        constructor(callback){
            this.visit = callback, this.stack = [], this.directives = Object.create(null);
        }
        _visit(node, descend) {
            this.push(node);
            var ret = this.visit(node, descend ? function() {
                descend.call(node);
            } : noop);
            return !ret && descend && descend.call(node), this.pop(), ret;
        }
        parent(n) {
            return this.stack[this.stack.length - 2 - (n || 0)];
        }
        push(node) {
            node instanceof AST_Lambda ? this.directives = Object.create(this.directives) : node instanceof AST_Directive && !this.directives[node.value] ? this.directives[node.value] = node : node instanceof AST_Class && (this.directives = Object.create(this.directives), this.directives["use strict"] || (this.directives["use strict"] = node)), this.stack.push(node);
        }
        pop() {
            var node = this.stack.pop();
            (node instanceof AST_Lambda || node instanceof AST_Class) && (this.directives = Object.getPrototypeOf(this.directives));
        }
        self() {
            return this.stack[this.stack.length - 1];
        }
        find_parent(type) {
            for(var stack = this.stack, i = stack.length; --i >= 0;){
                var x = stack[i];
                if (x instanceof type) return x;
            }
        }
        has_directive(type) {
            var dir = this.directives[type];
            if (dir) return dir;
            var node = this.stack[this.stack.length - 1];
            if (node instanceof AST_Scope && node.body) for(var i = 0; i < node.body.length; ++i){
                var st = node.body[i];
                if (!(st instanceof AST_Directive)) break;
                if (st.value == type) return st;
            }
        }
        loopcontrol_target(node) {
            var stack = this.stack;
            if (node.label) for(var i = stack.length; --i >= 0;){
                var x = stack[i];
                if (x instanceof AST_LabeledStatement && x.label.name == node.label.name) return x.body;
            }
            else for(var i = stack.length; --i >= 0;){
                var x = stack[i];
                if (x instanceof AST_IterationStatement || node instanceof AST_Break && x instanceof AST_Switch) return x;
            }
        }
    }
    // Tree transformer helpers.
    class TreeTransformer extends TreeWalker {
        constructor(before, after){
            super(), this.before = before, this.after = after;
        }
    }
    const _PURE = 0b00000001, _INLINE = 0b00000010, _NOINLINE = 0b00000100;
    var ast = /*#__PURE__*/ Object.freeze({
        __proto__: null,
        AST_Accessor: AST_Accessor,
        AST_Array: AST_Array,
        AST_Arrow: AST_Arrow,
        AST_Assign: AST_Assign,
        AST_Atom: AST_Atom,
        AST_Await: AST_Await,
        AST_BigInt: AST_BigInt,
        AST_Binary: AST_Binary,
        AST_Block: AST_Block,
        AST_BlockStatement: AST_BlockStatement,
        AST_Boolean: AST_Boolean,
        AST_Break: AST_Break,
        AST_Call: AST_Call,
        AST_Case: AST_Case,
        AST_Catch: AST_Catch,
        AST_Chain: AST_Chain,
        AST_Class: AST_Class,
        AST_ClassExpression: AST_ClassExpression,
        AST_ClassPrivateProperty: AST_ClassPrivateProperty,
        AST_ClassProperty: AST_ClassProperty,
        AST_ConciseMethod: AST_ConciseMethod,
        AST_Conditional: AST_Conditional,
        AST_Const: AST_Const,
        AST_Constant: AST_Constant,
        AST_Continue: AST_Continue,
        AST_Debugger: AST_Debugger,
        AST_Default: AST_Default,
        AST_DefaultAssign: AST_DefaultAssign,
        AST_DefClass: AST_DefClass,
        AST_Definitions: AST_Definitions,
        AST_Defun: AST_Defun,
        AST_Destructuring: AST_Destructuring,
        AST_Directive: AST_Directive,
        AST_Do: AST_Do,
        AST_Dot: AST_Dot,
        AST_DotHash: AST_DotHash,
        AST_DWLoop: AST_DWLoop,
        AST_EmptyStatement: AST_EmptyStatement,
        AST_Exit: AST_Exit,
        AST_Expansion: AST_Expansion,
        AST_Export: AST_Export,
        AST_False: AST_False,
        AST_Finally: AST_Finally,
        AST_For: AST_For,
        AST_ForIn: AST_ForIn,
        AST_ForOf: AST_ForOf,
        AST_Function: AST_Function,
        AST_Hole: AST_Hole,
        AST_If: AST_If,
        AST_Import: AST_Import,
        AST_ImportMeta: AST_ImportMeta,
        AST_Infinity: AST_Infinity,
        AST_IterationStatement: AST_IterationStatement,
        AST_Jump: AST_Jump,
        AST_Label: AST_Label,
        AST_LabeledStatement: AST_LabeledStatement,
        AST_LabelRef: AST_LabelRef,
        AST_Lambda: AST_Lambda,
        AST_Let: AST_Let,
        AST_LoopControl: AST_LoopControl,
        AST_NameMapping: AST_NameMapping,
        AST_NaN: AST_NaN,
        AST_New: AST_New,
        AST_NewTarget: AST_NewTarget,
        AST_Node: AST_Node,
        AST_Null: AST_Null,
        AST_Number: AST_Number,
        AST_Object: AST_Object,
        AST_ObjectGetter: AST_ObjectGetter,
        AST_ObjectKeyVal: AST_ObjectKeyVal,
        AST_ObjectProperty: AST_ObjectProperty,
        AST_ObjectSetter: AST_ObjectSetter,
        AST_PrefixedTemplateString: AST_PrefixedTemplateString,
        AST_PrivateGetter: AST_PrivateGetter,
        AST_PrivateMethod: AST_PrivateMethod,
        AST_PrivateSetter: AST_PrivateSetter,
        AST_PropAccess: AST_PropAccess,
        AST_RegExp: AST_RegExp,
        AST_Return: AST_Return,
        AST_Scope: AST_Scope,
        AST_Sequence: AST_Sequence,
        AST_SimpleStatement: AST_SimpleStatement,
        AST_Statement: AST_Statement,
        AST_StatementWithBody: AST_StatementWithBody,
        AST_String: AST_String,
        AST_Sub: AST_Sub,
        AST_Super: AST_Super,
        AST_Switch: AST_Switch,
        AST_SwitchBranch: AST_SwitchBranch,
        AST_Symbol: AST_Symbol,
        AST_SymbolBlockDeclaration: AST_SymbolBlockDeclaration,
        AST_SymbolCatch: AST_SymbolCatch,
        AST_SymbolClass: AST_SymbolClass,
        AST_SymbolClassProperty: AST_SymbolClassProperty,
        AST_SymbolConst: AST_SymbolConst,
        AST_SymbolDeclaration: AST_SymbolDeclaration,
        AST_SymbolDefClass: AST_SymbolDefClass,
        AST_SymbolDefun: AST_SymbolDefun,
        AST_SymbolExport: AST_SymbolExport,
        AST_SymbolExportForeign: AST_SymbolExportForeign,
        AST_SymbolFunarg: AST_SymbolFunarg,
        AST_SymbolImport: AST_SymbolImport,
        AST_SymbolImportForeign: AST_SymbolImportForeign,
        AST_SymbolLambda: AST_SymbolLambda,
        AST_SymbolLet: AST_SymbolLet,
        AST_SymbolMethod: AST_SymbolMethod,
        AST_SymbolRef: AST_SymbolRef,
        AST_SymbolVar: AST_SymbolVar,
        AST_TemplateSegment: AST_TemplateSegment,
        AST_TemplateString: AST_TemplateString,
        AST_This: AST_This,
        AST_Throw: AST_Throw,
        AST_Token: AST_Token,
        AST_Toplevel: AST_Toplevel,
        AST_True: AST_True,
        AST_Try: AST_Try,
        AST_Unary: AST_Unary,
        AST_UnaryPostfix: AST_UnaryPostfix,
        AST_UnaryPrefix: AST_UnaryPrefix,
        AST_Undefined: AST_Undefined,
        AST_Var: AST_Var,
        AST_VarDef: AST_VarDef,
        AST_While: AST_While,
        AST_With: AST_With,
        AST_Yield: AST_Yield,
        TreeTransformer: TreeTransformer,
        TreeWalker: TreeWalker,
        walk: walk,
        walk_abort: walk_abort,
        walk_body: walk_body,
        walk_parent: walk_parent,
        _INLINE: 0b00000010,
        _NOINLINE: 0b00000100,
        _PURE: 0b00000001
    });
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function def_transform(node, descend) {
        node.DEFMETHOD("transform", function(tw, in_list) {
            let transformed;
            if (tw.push(this), tw.before && (transformed = tw.before(this, descend, in_list)), void 0 === transformed && (transformed = this, descend(transformed, tw), tw.after)) {
                const after_ret = tw.after(transformed, in_list);
                void 0 !== after_ret && (transformed = after_ret);
            }
            return tw.pop(), transformed;
        });
    }
    function do_list(list, tw) {
        return MAP(list, function(node) {
            return node.transform(tw, !0);
        });
    }
    // return true if the node at the top of the stack (that means the
    // innermost node in the current output) is lexically the first in
    // a statement.
    function first_in_statement(stack) {
        let node = stack.parent(-1);
        for(let i = 0, p; p = stack.parent(i); i++){
            if (p instanceof AST_Statement && p.body === node) return !0;
            if ((!(p instanceof AST_Sequence) || p.expressions[0] !== node) && ("Call" !== p.TYPE || p.expression !== node) && (!(p instanceof AST_PrefixedTemplateString) || p.prefix !== node) && (!(p instanceof AST_Dot) || p.expression !== node) && (!(p instanceof AST_Sub) || p.expression !== node) && (!(p instanceof AST_Conditional) || p.condition !== node) && (!(p instanceof AST_Binary) || p.left !== node) && (!(p instanceof AST_UnaryPostfix) || p.expression !== node)) return !1;
            node = p;
        }
    }
    def_transform(AST_Node, noop), def_transform(AST_LabeledStatement, function(self1, tw) {
        self1.label = self1.label.transform(tw), self1.body = self1.body.transform(tw);
    }), def_transform(AST_SimpleStatement, function(self1, tw) {
        self1.body = self1.body.transform(tw);
    }), def_transform(AST_Block, function(self1, tw) {
        self1.body = do_list(self1.body, tw);
    }), def_transform(AST_Do, function(self1, tw) {
        self1.body = self1.body.transform(tw), self1.condition = self1.condition.transform(tw);
    }), def_transform(AST_While, function(self1, tw) {
        self1.condition = self1.condition.transform(tw), self1.body = self1.body.transform(tw);
    }), def_transform(AST_For, function(self1, tw) {
        self1.init && (self1.init = self1.init.transform(tw)), self1.condition && (self1.condition = self1.condition.transform(tw)), self1.step && (self1.step = self1.step.transform(tw)), self1.body = self1.body.transform(tw);
    }), def_transform(AST_ForIn, function(self1, tw) {
        self1.init = self1.init.transform(tw), self1.object = self1.object.transform(tw), self1.body = self1.body.transform(tw);
    }), def_transform(AST_With, function(self1, tw) {
        self1.expression = self1.expression.transform(tw), self1.body = self1.body.transform(tw);
    }), def_transform(AST_Exit, function(self1, tw) {
        self1.value && (self1.value = self1.value.transform(tw));
    }), def_transform(AST_LoopControl, function(self1, tw) {
        self1.label && (self1.label = self1.label.transform(tw));
    }), def_transform(AST_If, function(self1, tw) {
        self1.condition = self1.condition.transform(tw), self1.body = self1.body.transform(tw), self1.alternative && (self1.alternative = self1.alternative.transform(tw));
    }), def_transform(AST_Switch, function(self1, tw) {
        self1.expression = self1.expression.transform(tw), self1.body = do_list(self1.body, tw);
    }), def_transform(AST_Case, function(self1, tw) {
        self1.expression = self1.expression.transform(tw), self1.body = do_list(self1.body, tw);
    }), def_transform(AST_Try, function(self1, tw) {
        self1.body = do_list(self1.body, tw), self1.bcatch && (self1.bcatch = self1.bcatch.transform(tw)), self1.bfinally && (self1.bfinally = self1.bfinally.transform(tw));
    }), def_transform(AST_Catch, function(self1, tw) {
        self1.argname && (self1.argname = self1.argname.transform(tw)), self1.body = do_list(self1.body, tw);
    }), def_transform(AST_Definitions, function(self1, tw) {
        self1.definitions = do_list(self1.definitions, tw);
    }), def_transform(AST_VarDef, function(self1, tw) {
        self1.name = self1.name.transform(tw), self1.value && (self1.value = self1.value.transform(tw));
    }), def_transform(AST_Destructuring, function(self1, tw) {
        self1.names = do_list(self1.names, tw);
    }), def_transform(AST_Lambda, function(self1, tw) {
        self1.name && (self1.name = self1.name.transform(tw)), self1.argnames = do_list(self1.argnames, tw), self1.body instanceof AST_Node ? self1.body = self1.body.transform(tw) : self1.body = do_list(self1.body, tw);
    }), def_transform(AST_Call, function(self1, tw) {
        self1.expression = self1.expression.transform(tw), self1.args = do_list(self1.args, tw);
    }), def_transform(AST_Sequence, function(self1, tw) {
        const result = do_list(self1.expressions, tw);
        self1.expressions = result.length ? result : [
            new AST_Number({
                value: 0
            })
        ];
    }), def_transform(AST_PropAccess, function(self1, tw) {
        self1.expression = self1.expression.transform(tw);
    }), def_transform(AST_Sub, function(self1, tw) {
        self1.expression = self1.expression.transform(tw), self1.property = self1.property.transform(tw);
    }), def_transform(AST_Chain, function(self1, tw) {
        self1.expression = self1.expression.transform(tw);
    }), def_transform(AST_Yield, function(self1, tw) {
        self1.expression && (self1.expression = self1.expression.transform(tw));
    }), def_transform(AST_Await, function(self1, tw) {
        self1.expression = self1.expression.transform(tw);
    }), def_transform(AST_Unary, function(self1, tw) {
        self1.expression = self1.expression.transform(tw);
    }), def_transform(AST_Binary, function(self1, tw) {
        self1.left = self1.left.transform(tw), self1.right = self1.right.transform(tw);
    }), def_transform(AST_Conditional, function(self1, tw) {
        self1.condition = self1.condition.transform(tw), self1.consequent = self1.consequent.transform(tw), self1.alternative = self1.alternative.transform(tw);
    }), def_transform(AST_Array, function(self1, tw) {
        self1.elements = do_list(self1.elements, tw);
    }), def_transform(AST_Object, function(self1, tw) {
        self1.properties = do_list(self1.properties, tw);
    }), def_transform(AST_ObjectProperty, function(self1, tw) {
        self1.key instanceof AST_Node && (self1.key = self1.key.transform(tw)), self1.value && (self1.value = self1.value.transform(tw));
    }), def_transform(AST_Class, function(self1, tw) {
        self1.name && (self1.name = self1.name.transform(tw)), self1.extends && (self1.extends = self1.extends.transform(tw)), self1.properties = do_list(self1.properties, tw);
    }), def_transform(AST_Expansion, function(self1, tw) {
        self1.expression = self1.expression.transform(tw);
    }), def_transform(AST_NameMapping, function(self1, tw) {
        self1.foreign_name = self1.foreign_name.transform(tw), self1.name = self1.name.transform(tw);
    }), def_transform(AST_Import, function(self1, tw) {
        self1.imported_name && (self1.imported_name = self1.imported_name.transform(tw)), self1.imported_names && do_list(self1.imported_names, tw), self1.module_name = self1.module_name.transform(tw);
    }), def_transform(AST_Export, function(self1, tw) {
        self1.exported_definition && (self1.exported_definition = self1.exported_definition.transform(tw)), self1.exported_value && (self1.exported_value = self1.exported_value.transform(tw)), self1.exported_names && do_list(self1.exported_names, tw), self1.module_name && (self1.module_name = self1.module_name.transform(tw));
    }), def_transform(AST_TemplateString, function(self1, tw) {
        self1.segments = do_list(self1.segments, tw);
    }), def_transform(AST_PrefixedTemplateString, function(self1, tw) {
        self1.prefix = self1.prefix.transform(tw), self1.template_string = self1.template_string.transform(tw);
    }), /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function() {
        var normalize_directives = function(body) {
            for(var in_directive = !0, i = 0; i < body.length; i++)in_directive && body[i] instanceof AST_Statement && body[i].body instanceof AST_String ? body[i] = new AST_Directive({
                start: body[i].start,
                end: body[i].end,
                value: body[i].body.value
            }) : in_directive && !(body[i] instanceof AST_Statement && body[i].body instanceof AST_String) && (in_directive = !1);
            return body;
        };
        const assert_clause_from_moz = (assertions)=>assertions && assertions.length > 0 ? new AST_Object({
                start: my_start_token(assertions),
                end: my_end_token(assertions),
                properties: assertions.map((assertion_kv)=>new AST_ObjectKeyVal({
                        start: my_start_token(assertion_kv),
                        end: my_end_token(assertion_kv),
                        key: assertion_kv.key.name || assertion_kv.key.value,
                        value: from_moz(assertion_kv.value)
                    }))
            }) : null;
        var MOZ_TO_ME = {
            Program: function(M) {
                return new AST_Toplevel({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    body: normalize_directives(M.body.map(from_moz))
                });
            },
            ArrayPattern: function(M) {
                return new AST_Destructuring({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    names: M.elements.map(function(elm) {
                        return null === elm ? new AST_Hole() : from_moz(elm);
                    }),
                    is_array: !0
                });
            },
            ObjectPattern: function(M) {
                return new AST_Destructuring({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    names: M.properties.map(from_moz),
                    is_array: !1
                });
            },
            AssignmentPattern: function(M) {
                return new AST_DefaultAssign({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    left: from_moz(M.left),
                    operator: "=",
                    right: from_moz(M.right)
                });
            },
            SpreadElement: function(M) {
                return new AST_Expansion({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expression: from_moz(M.argument)
                });
            },
            RestElement: function(M) {
                return new AST_Expansion({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expression: from_moz(M.argument)
                });
            },
            TemplateElement: function(M) {
                return new AST_TemplateSegment({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    value: M.value.cooked,
                    raw: M.value.raw
                });
            },
            TemplateLiteral: function(M) {
                for(var segments = [], i = 0; i < M.quasis.length; i++)segments.push(from_moz(M.quasis[i])), M.expressions[i] && segments.push(from_moz(M.expressions[i]));
                return new AST_TemplateString({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    segments: segments
                });
            },
            TaggedTemplateExpression: function(M) {
                return new AST_PrefixedTemplateString({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    template_string: from_moz(M.quasi),
                    prefix: from_moz(M.tag)
                });
            },
            FunctionDeclaration: function(M) {
                return new AST_Defun({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    name: from_moz(M.id),
                    argnames: M.params.map(from_moz),
                    is_generator: M.generator,
                    async: M.async,
                    body: normalize_directives(from_moz(M.body).body)
                });
            },
            FunctionExpression: function(M) {
                return new AST_Function({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    name: from_moz(M.id),
                    argnames: M.params.map(from_moz),
                    is_generator: M.generator,
                    async: M.async,
                    body: normalize_directives(from_moz(M.body).body)
                });
            },
            ArrowFunctionExpression: function(M) {
                const body = "BlockStatement" === M.body.type ? from_moz(M.body).body : [
                    make_node(AST_Return, {}, {
                        value: from_moz(M.body)
                    })
                ];
                return new AST_Arrow({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    argnames: M.params.map(from_moz),
                    body,
                    async: M.async
                });
            },
            ExpressionStatement: function(M) {
                return new AST_SimpleStatement({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    body: from_moz(M.expression)
                });
            },
            TryStatement: function(M) {
                var handlers = M.handlers || [
                    M.handler
                ];
                if (handlers.length > 1 || M.guardedHandlers && M.guardedHandlers.length) throw Error("Multiple catch clauses are not supported.");
                return new AST_Try({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    body: from_moz(M.block).body,
                    bcatch: from_moz(handlers[0]),
                    bfinally: M.finalizer ? new AST_Finally(from_moz(M.finalizer)) : null
                });
            },
            Property: function(M) {
                var key = M.key, args = {
                    start: my_start_token(key || M.value),
                    end: my_end_token(M.value),
                    key: "Identifier" == key.type ? key.name : key.value,
                    value: from_moz(M.value)
                };
                return (M.computed && (args.key = from_moz(M.key)), M.method) ? (args.is_generator = M.value.generator, args.async = M.value.async, M.computed ? args.key = from_moz(M.key) : args.key = new AST_SymbolMethod({
                    name: args.key
                }), new AST_ConciseMethod(args)) : "init" == M.kind ? ("Identifier" != key.type && "Literal" != key.type && (args.key = from_moz(key)), new AST_ObjectKeyVal(args)) : (("string" == typeof args.key || "number" == typeof args.key) && (args.key = new AST_SymbolMethod({
                    name: args.key
                })), args.value = new AST_Accessor(args.value), "get" == M.kind) ? new AST_ObjectGetter(args) : "set" == M.kind ? new AST_ObjectSetter(args) : "method" == M.kind ? (args.async = M.value.async, args.is_generator = M.value.generator, args.quote = M.computed ? "\"" : null, new AST_ConciseMethod(args)) : void 0;
            },
            MethodDefinition: function(M) {
                var args = {
                    start: my_start_token(M),
                    end: my_end_token(M),
                    key: M.computed ? from_moz(M.key) : new AST_SymbolMethod({
                        name: M.key.name || M.key.value
                    }),
                    value: from_moz(M.value),
                    static: M.static
                };
                return "get" == M.kind ? new AST_ObjectGetter(args) : "set" == M.kind ? new AST_ObjectSetter(args) : (args.is_generator = M.value.generator, args.async = M.value.async, new AST_ConciseMethod(args));
            },
            FieldDefinition: function(M) {
                let key;
                if (M.computed) key = from_moz(M.key);
                else {
                    if ("Identifier" !== M.key.type) throw Error("Non-Identifier key in FieldDefinition");
                    key = from_moz(M.key);
                }
                return new AST_ClassProperty({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    key,
                    value: from_moz(M.value),
                    static: M.static
                });
            },
            PropertyDefinition: function(M) {
                let key;
                if (M.computed) key = from_moz(M.key);
                else {
                    if ("Identifier" !== M.key.type) throw Error("Non-Identifier key in PropertyDefinition");
                    key = from_moz(M.key);
                }
                return new AST_ClassProperty({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    key,
                    value: from_moz(M.value),
                    static: M.static
                });
            },
            ArrayExpression: function(M) {
                return new AST_Array({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    elements: M.elements.map(function(elem) {
                        return null === elem ? new AST_Hole() : from_moz(elem);
                    })
                });
            },
            ObjectExpression: function(M) {
                return new AST_Object({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    properties: M.properties.map(function(prop) {
                        return "SpreadElement" === prop.type || (prop.type = "Property"), from_moz(prop);
                    })
                });
            },
            SequenceExpression: function(M) {
                return new AST_Sequence({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expressions: M.expressions.map(from_moz)
                });
            },
            MemberExpression: function(M) {
                return new (M.computed ? AST_Sub : AST_Dot)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    property: M.computed ? from_moz(M.property) : M.property.name,
                    expression: from_moz(M.object),
                    optional: M.optional || !1
                });
            },
            ChainExpression: function(M) {
                return new AST_Chain({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expression: from_moz(M.expression)
                });
            },
            SwitchCase: function(M) {
                return new (M.test ? AST_Case : AST_Default)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expression: from_moz(M.test),
                    body: M.consequent.map(from_moz)
                });
            },
            VariableDeclaration: function(M) {
                return new ("const" === M.kind ? AST_Const : "let" === M.kind ? AST_Let : AST_Var)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    definitions: M.declarations.map(from_moz)
                });
            },
            ImportDeclaration: function(M) {
                var imported_name = null, imported_names = null;
                return M.specifiers.forEach(function(specifier) {
                    "ImportSpecifier" === specifier.type ? (imported_names || (imported_names = []), imported_names.push(new AST_NameMapping({
                        start: my_start_token(specifier),
                        end: my_end_token(specifier),
                        foreign_name: from_moz(specifier.imported),
                        name: from_moz(specifier.local)
                    }))) : "ImportDefaultSpecifier" === specifier.type ? imported_name = from_moz(specifier.local) : "ImportNamespaceSpecifier" === specifier.type && (imported_names || (imported_names = []), imported_names.push(new AST_NameMapping({
                        start: my_start_token(specifier),
                        end: my_end_token(specifier),
                        foreign_name: new AST_SymbolImportForeign({
                            name: "*"
                        }),
                        name: from_moz(specifier.local)
                    })));
                }), new AST_Import({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    imported_name: imported_name,
                    imported_names: imported_names,
                    module_name: from_moz(M.source),
                    assert_clause: assert_clause_from_moz(M.assertions)
                });
            },
            ExportAllDeclaration: function(M) {
                return new AST_Export({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    exported_names: [
                        new AST_NameMapping({
                            name: new AST_SymbolExportForeign({
                                name: "*"
                            }),
                            foreign_name: new AST_SymbolExportForeign({
                                name: "*"
                            })
                        })
                    ],
                    module_name: from_moz(M.source),
                    assert_clause: assert_clause_from_moz(M.assertions)
                });
            },
            ExportNamedDeclaration: function(M) {
                return new AST_Export({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    exported_definition: from_moz(M.declaration),
                    exported_names: M.specifiers && M.specifiers.length ? M.specifiers.map(function(specifier) {
                        return new AST_NameMapping({
                            foreign_name: from_moz(specifier.exported),
                            name: from_moz(specifier.local)
                        });
                    }) : null,
                    module_name: from_moz(M.source),
                    assert_clause: assert_clause_from_moz(M.assertions)
                });
            },
            ExportDefaultDeclaration: function(M) {
                return new AST_Export({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    exported_value: from_moz(M.declaration),
                    is_default: !0
                });
            },
            Literal: function(M) {
                var val = M.value, args = {
                    start: my_start_token(M),
                    end: my_end_token(M)
                }, rx = M.regex;
                if (rx && rx.pattern) return(// RegExpLiteral as per ESTree AST spec
                args.value = {
                    source: rx.pattern,
                    flags: rx.flags
                }, new AST_RegExp(args));
                if (rx) {
                    // support legacy RegExp
                    const rx_source = M.raw || val, match = rx_source.match(/^\/(.*)\/(\w*)$/);
                    if (!match) throw Error("Invalid regex source " + rx_source);
                    const [_, source, flags] = match;
                    return args.value = {
                        source,
                        flags
                    }, new AST_RegExp(args);
                }
                if (null === val) return new AST_Null(args);
                switch(typeof val){
                    case "string":
                        return args.value = val, new AST_String(args);
                    case "number":
                        return args.value = val, args.raw = M.raw || val.toString(), new AST_Number(args);
                    case "boolean":
                        return new (val ? AST_True : AST_False)(args);
                }
            },
            MetaProperty: function(M) {
                return "new" === M.meta.name && "target" === M.property.name ? new AST_NewTarget({
                    start: my_start_token(M),
                    end: my_end_token(M)
                }) : "import" === M.meta.name && "meta" === M.property.name ? new AST_ImportMeta({
                    start: my_start_token(M),
                    end: my_end_token(M)
                }) : void 0;
            },
            Identifier: function(M) {
                var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
                return new ("LabeledStatement" == p.type ? AST_Label : "VariableDeclarator" == p.type && p.id === M ? "const" == p.kind ? AST_SymbolConst : "let" == p.kind ? AST_SymbolLet : AST_SymbolVar : /Import.*Specifier/.test(p.type) ? p.local === M ? AST_SymbolImport : AST_SymbolImportForeign : "ExportSpecifier" == p.type ? p.local === M ? AST_SymbolExport : AST_SymbolExportForeign : "FunctionExpression" == p.type ? p.id === M ? AST_SymbolLambda : AST_SymbolFunarg : "FunctionDeclaration" == p.type ? p.id === M ? AST_SymbolDefun : AST_SymbolFunarg : "ArrowFunctionExpression" == p.type ? p.params.includes(M) ? AST_SymbolFunarg : AST_SymbolRef : "ClassExpression" == p.type ? p.id === M ? AST_SymbolClass : AST_SymbolRef : "Property" == p.type ? p.key === M && p.computed || p.value === M ? AST_SymbolRef : AST_SymbolMethod : "PropertyDefinition" == p.type || "FieldDefinition" === p.type ? p.key === M && p.computed || p.value === M ? AST_SymbolRef : AST_SymbolClassProperty : "ClassDeclaration" == p.type ? p.id === M ? AST_SymbolDefClass : AST_SymbolRef : "MethodDefinition" == p.type ? p.computed ? AST_SymbolRef : AST_SymbolMethod : "CatchClause" == p.type ? AST_SymbolCatch : "BreakStatement" == p.type || "ContinueStatement" == p.type ? AST_LabelRef : AST_SymbolRef)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    name: M.name
                });
            },
            BigIntLiteral: (M)=>new AST_BigInt({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    value: M.value
                })
        };
        MOZ_TO_ME.UpdateExpression = MOZ_TO_ME.UnaryExpression = function(M) {
            return new (("prefix" in M ? M.prefix : "UnaryExpression" == M.type) ? AST_UnaryPrefix : AST_UnaryPostfix)({
                start: my_start_token(M),
                end: my_end_token(M),
                operator: M.operator,
                expression: from_moz(M.argument)
            });
        }, MOZ_TO_ME.ClassDeclaration = MOZ_TO_ME.ClassExpression = function(M) {
            return new ("ClassDeclaration" === M.type ? AST_DefClass : AST_ClassExpression)({
                start: my_start_token(M),
                end: my_end_token(M),
                name: from_moz(M.id),
                extends: from_moz(M.superClass),
                properties: M.body.body.map(from_moz)
            });
        }, map("EmptyStatement", AST_EmptyStatement), map("BlockStatement", AST_BlockStatement, "body@body"), map("IfStatement", AST_If, "test>condition, consequent>body, alternate>alternative"), map("LabeledStatement", AST_LabeledStatement, "label>label, body>body"), map("BreakStatement", AST_Break, "label>label"), map("ContinueStatement", AST_Continue, "label>label"), map("WithStatement", AST_With, "object>expression, body>body"), map("SwitchStatement", AST_Switch, "discriminant>expression, cases@body"), map("ReturnStatement", AST_Return, "argument>value"), map("ThrowStatement", AST_Throw, "argument>value"), map("WhileStatement", AST_While, "test>condition, body>body"), map("DoWhileStatement", AST_Do, "test>condition, body>body"), map("ForStatement", AST_For, "init>init, test>condition, update>step, body>body"), map("ForInStatement", AST_ForIn, "left>init, right>object, body>body"), map("ForOfStatement", AST_ForOf, "left>init, right>object, body>body, await=await"), map("AwaitExpression", AST_Await, "argument>expression"), map("YieldExpression", AST_Yield, "argument>expression, delegate=is_star"), map("DebuggerStatement", AST_Debugger), map("VariableDeclarator", AST_VarDef, "id>name, init>value"), map("CatchClause", AST_Catch, "param>argname, body%body"), map("ThisExpression", AST_This), map("Super", AST_Super), map("BinaryExpression", AST_Binary, "operator=operator, left>left, right>right"), map("LogicalExpression", AST_Binary, "operator=operator, left>left, right>right"), map("AssignmentExpression", AST_Assign, "operator=operator, left>left, right>right"), map("ConditionalExpression", AST_Conditional, "test>condition, consequent>consequent, alternate>alternative"), map("NewExpression", AST_New, "callee>expression, arguments@args"), map("CallExpression", AST_Call, "callee>expression, optional=optional, arguments@args"), def_to_moz(AST_Toplevel, function(M) {
            return to_moz_scope("Program", M);
        }), def_to_moz(AST_Expansion, function(M) {
            return {
                type: to_moz_in_destructuring() ? "RestElement" : "SpreadElement",
                argument: to_moz(M.expression)
            };
        }), def_to_moz(AST_PrefixedTemplateString, function(M) {
            return {
                type: "TaggedTemplateExpression",
                tag: to_moz(M.prefix),
                quasi: to_moz(M.template_string)
            };
        }), def_to_moz(AST_TemplateString, function(M) {
            for(var quasis = [], expressions = [], i = 0; i < M.segments.length; i++)i % 2 != 0 ? expressions.push(to_moz(M.segments[i])) : quasis.push({
                type: "TemplateElement",
                value: {
                    raw: M.segments[i].raw,
                    cooked: M.segments[i].value
                },
                tail: i === M.segments.length - 1
            });
            return {
                type: "TemplateLiteral",
                quasis: quasis,
                expressions: expressions
            };
        }), def_to_moz(AST_Defun, function(M) {
            return {
                type: "FunctionDeclaration",
                id: to_moz(M.name),
                params: M.argnames.map(to_moz),
                generator: M.is_generator,
                async: M.async,
                body: to_moz_scope("BlockStatement", M)
            };
        }), def_to_moz(AST_Function, function(M, parent) {
            var is_generator = void 0 !== parent.is_generator ? parent.is_generator : M.is_generator;
            return {
                type: "FunctionExpression",
                id: to_moz(M.name),
                params: M.argnames.map(to_moz),
                generator: is_generator,
                async: M.async,
                body: to_moz_scope("BlockStatement", M)
            };
        }), def_to_moz(AST_Arrow, function(M) {
            var body = {
                type: "BlockStatement",
                body: M.body.map(to_moz)
            };
            return {
                type: "ArrowFunctionExpression",
                params: M.argnames.map(to_moz),
                async: M.async,
                body: body
            };
        }), def_to_moz(AST_Destructuring, function(M) {
            return M.is_array ? {
                type: "ArrayPattern",
                elements: M.names.map(to_moz)
            } : {
                type: "ObjectPattern",
                properties: M.names.map(to_moz)
            };
        }), def_to_moz(AST_Directive, function(M) {
            return {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: M.value,
                    raw: M.print_to_string()
                },
                directive: M.value
            };
        }), def_to_moz(AST_SimpleStatement, function(M) {
            return {
                type: "ExpressionStatement",
                expression: to_moz(M.body)
            };
        }), def_to_moz(AST_SwitchBranch, function(M) {
            return {
                type: "SwitchCase",
                test: to_moz(M.expression),
                consequent: M.body.map(to_moz)
            };
        }), def_to_moz(AST_Try, function(M) {
            return {
                type: "TryStatement",
                block: to_moz_block(M),
                handler: to_moz(M.bcatch),
                guardedHandlers: [],
                finalizer: to_moz(M.bfinally)
            };
        }), def_to_moz(AST_Catch, function(M) {
            return {
                type: "CatchClause",
                param: to_moz(M.argname),
                guard: null,
                body: to_moz_block(M)
            };
        }), def_to_moz(AST_Definitions, function(M) {
            return {
                type: "VariableDeclaration",
                kind: M instanceof AST_Const ? "const" : M instanceof AST_Let ? "let" : "var",
                declarations: M.definitions.map(to_moz)
            };
        });
        const assert_clause_to_moz = (assert_clause)=>{
            const assertions = [];
            if (assert_clause) for (const { key, value } of assert_clause.properties){
                const key_moz = is_basic_identifier_string(key) ? {
                    type: "Identifier",
                    name: key
                } : {
                    type: "Literal",
                    value: key,
                    raw: JSON.stringify(key)
                };
                assertions.push({
                    type: "ImportAttribute",
                    key: key_moz,
                    value: to_moz(value)
                });
            }
            return assertions;
        };
        /* -----[ tools ]----- */ function my_start_token(moznode) {
            var loc = moznode.loc, start = loc && loc.start, range = moznode.range;
            return new AST_Token("", "", start && start.line || 0, start && start.column || 0, range ? range[0] : moznode.start, !1, [], [], loc && loc.source);
        }
        function my_end_token(moznode) {
            var loc = moznode.loc, end = loc && loc.end, range = moznode.range;
            return new AST_Token("", "", end && end.line || 0, end && end.column || 0, range ? range[0] : moznode.end, !1, [], [], loc && loc.source);
        }
        function map(moztype, mytype, propmap) {
            var moz_to_me = "function From_Moz_" + moztype + "(M){\n";
            moz_to_me += "return new U2." + mytype.name + "({\nstart: my_start_token(M),\nend: my_end_token(M)";
            var me_to_moz = "function To_Moz_" + moztype + "(M){\n";
            me_to_moz += "return {\ntype: " + JSON.stringify(moztype), propmap && propmap.split(/\s*,\s*/).forEach(function(prop) {
                var m = /([a-z0-9$_]+)([=@>%])([a-z0-9$_]+)/i.exec(prop);
                if (!m) throw Error("Can't understand property map: " + prop);
                var moz = m[1], how = m[2], my = m[3];
                switch(moz_to_me += ",\n" + my + ": ", me_to_moz += ",\n" + moz + ": ", how){
                    case "@":
                        moz_to_me += "M." + moz + ".map(from_moz)", me_to_moz += "M." + my + ".map(to_moz)";
                        break;
                    case ">":
                        moz_to_me += "from_moz(M." + moz + ")", me_to_moz += "to_moz(M." + my + ")";
                        break;
                    case "=":
                        moz_to_me += "M." + moz, me_to_moz += "M." + my;
                        break;
                    case "%":
                        moz_to_me += "from_moz(M." + moz + ").body", me_to_moz += "to_moz_block(M)";
                        break;
                    default:
                        throw Error("Can't understand operator in propmap: " + prop);
                }
            }), moz_to_me += "\n})\n}", me_to_moz += "\n}\n}", moz_to_me = Function("U2", "my_start_token", "my_end_token", "from_moz", "return(" + moz_to_me + ")")(ast, my_start_token, my_end_token, from_moz), me_to_moz = Function("to_moz", "to_moz_block", "to_moz_scope", "return(" + me_to_moz + ")")(to_moz, to_moz_block, to_moz_scope), MOZ_TO_ME[moztype] = moz_to_me, def_to_moz(mytype, me_to_moz);
        }
        def_to_moz(AST_Export, function(M) {
            return M.exported_names ? "*" === M.exported_names[0].name.name ? {
                type: "ExportAllDeclaration",
                source: to_moz(M.module_name),
                assertions: assert_clause_to_moz(M.assert_clause)
            } : {
                type: "ExportNamedDeclaration",
                specifiers: M.exported_names.map(function(name_mapping) {
                    return {
                        type: "ExportSpecifier",
                        exported: to_moz(name_mapping.foreign_name),
                        local: to_moz(name_mapping.name)
                    };
                }),
                declaration: to_moz(M.exported_definition),
                source: to_moz(M.module_name),
                assertions: assert_clause_to_moz(M.assert_clause)
            } : {
                type: M.is_default ? "ExportDefaultDeclaration" : "ExportNamedDeclaration",
                declaration: to_moz(M.exported_value || M.exported_definition)
            };
        }), def_to_moz(AST_Import, function(M) {
            var specifiers = [];
            return M.imported_name && specifiers.push({
                type: "ImportDefaultSpecifier",
                local: to_moz(M.imported_name)
            }), M.imported_names && "*" === M.imported_names[0].foreign_name.name ? specifiers.push({
                type: "ImportNamespaceSpecifier",
                local: to_moz(M.imported_names[0].name)
            }) : M.imported_names && M.imported_names.forEach(function(name_mapping) {
                specifiers.push({
                    type: "ImportSpecifier",
                    local: to_moz(name_mapping.name),
                    imported: to_moz(name_mapping.foreign_name)
                });
            }), {
                type: "ImportDeclaration",
                specifiers: specifiers,
                source: to_moz(M.module_name),
                assertions: assert_clause_to_moz(M.assert_clause)
            };
        }), def_to_moz(AST_ImportMeta, function() {
            return {
                type: "MetaProperty",
                meta: {
                    type: "Identifier",
                    name: "import"
                },
                property: {
                    type: "Identifier",
                    name: "meta"
                }
            };
        }), def_to_moz(AST_Sequence, function(M) {
            return {
                type: "SequenceExpression",
                expressions: M.expressions.map(to_moz)
            };
        }), def_to_moz(AST_DotHash, function(M) {
            return {
                type: "MemberExpression",
                object: to_moz(M.expression),
                computed: !1,
                property: {
                    type: "PrivateIdentifier",
                    name: M.property
                },
                optional: M.optional
            };
        }), def_to_moz(AST_PropAccess, function(M) {
            var isComputed = M instanceof AST_Sub;
            return {
                type: "MemberExpression",
                object: to_moz(M.expression),
                computed: isComputed,
                property: isComputed ? to_moz(M.property) : {
                    type: "Identifier",
                    name: M.property
                },
                optional: M.optional
            };
        }), def_to_moz(AST_Chain, function(M) {
            return {
                type: "ChainExpression",
                expression: to_moz(M.expression)
            };
        }), def_to_moz(AST_Unary, function(M) {
            return {
                type: "++" == M.operator || "--" == M.operator ? "UpdateExpression" : "UnaryExpression",
                operator: M.operator,
                prefix: M instanceof AST_UnaryPrefix,
                argument: to_moz(M.expression)
            };
        }), def_to_moz(AST_Binary, function(M) {
            return "=" == M.operator && to_moz_in_destructuring() ? {
                type: "AssignmentPattern",
                left: to_moz(M.left),
                right: to_moz(M.right)
            } : {
                type: "&&" == M.operator || "||" == M.operator || "??" === M.operator ? "LogicalExpression" : "BinaryExpression",
                left: to_moz(M.left),
                operator: M.operator,
                right: to_moz(M.right)
            };
        }), def_to_moz(AST_Array, function(M) {
            return {
                type: "ArrayExpression",
                elements: M.elements.map(to_moz)
            };
        }), def_to_moz(AST_Object, function(M) {
            return {
                type: "ObjectExpression",
                properties: M.properties.map(to_moz)
            };
        }), def_to_moz(AST_ObjectProperty, function(M, parent) {
            var kind, key = M.key instanceof AST_Node ? to_moz(M.key) : {
                type: "Identifier",
                value: M.key
            };
            "number" == typeof M.key && (key = {
                type: "Literal",
                value: Number(M.key)
            }), "string" == typeof M.key && (key = {
                type: "Identifier",
                name: M.key
            });
            var string_or_num = "string" == typeof M.key || "number" == typeof M.key, computed = !string_or_num && (!(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef);
            return (M instanceof AST_ObjectKeyVal ? (kind = "init", computed = !string_or_num) : M instanceof AST_ObjectGetter ? kind = "get" : M instanceof AST_ObjectSetter && (kind = "set"), M instanceof AST_PrivateGetter || M instanceof AST_PrivateSetter) ? {
                type: "MethodDefinition",
                computed: !1,
                kind: M instanceof AST_PrivateGetter ? "get" : "set",
                static: M.static,
                key: {
                    type: "PrivateIdentifier",
                    name: M.key.name
                },
                value: to_moz(M.value)
            } : M instanceof AST_ClassPrivateProperty ? {
                type: "PropertyDefinition",
                key: {
                    type: "PrivateIdentifier",
                    name: M.key.name
                },
                value: to_moz(M.value),
                computed: !1,
                static: M.static
            } : M instanceof AST_ClassProperty ? {
                type: "PropertyDefinition",
                key,
                value: to_moz(M.value),
                computed,
                static: M.static
            } : parent instanceof AST_Class ? {
                type: "MethodDefinition",
                computed: computed,
                kind: kind,
                static: M.static,
                key: to_moz(M.key),
                value: to_moz(M.value)
            } : {
                type: "Property",
                computed: computed,
                kind: kind,
                key: key,
                value: to_moz(M.value)
            };
        }), def_to_moz(AST_ConciseMethod, function(M, parent) {
            if (parent instanceof AST_Object) return {
                type: "Property",
                computed: !(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef,
                kind: "init",
                method: !0,
                shorthand: !1,
                key: to_moz(M.key),
                value: to_moz(M.value)
            };
            const key = M instanceof AST_PrivateMethod ? {
                type: "PrivateIdentifier",
                name: M.key.name
            } : to_moz(M.key);
            return {
                type: "MethodDefinition",
                kind: "constructor" === M.key ? "constructor" : "method",
                key,
                value: to_moz(M.value),
                computed: !(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef,
                static: M.static
            };
        }), def_to_moz(AST_Class, function(M) {
            return {
                type: M instanceof AST_ClassExpression ? "ClassExpression" : "ClassDeclaration",
                superClass: to_moz(M.extends),
                id: M.name ? to_moz(M.name) : null,
                body: {
                    type: "ClassBody",
                    body: M.properties.map(to_moz)
                }
            };
        }), def_to_moz(AST_NewTarget, function() {
            return {
                type: "MetaProperty",
                meta: {
                    type: "Identifier",
                    name: "new"
                },
                property: {
                    type: "Identifier",
                    name: "target"
                }
            };
        }), def_to_moz(AST_Symbol, function(M, parent) {
            if (M instanceof AST_SymbolMethod && parent.quote) return {
                type: "Literal",
                value: M.name
            };
            var def = M.definition();
            return {
                type: "Identifier",
                name: def ? def.mangled_name || def.name : M.name
            };
        }), def_to_moz(AST_RegExp, function(M) {
            const pattern = M.value.source, flags = M.value.flags;
            return {
                type: "Literal",
                value: null,
                raw: M.print_to_string(),
                regex: {
                    pattern,
                    flags
                }
            };
        }), def_to_moz(AST_Constant, function(M) {
            return {
                type: "Literal",
                value: M.value,
                raw: M.raw || M.print_to_string()
            };
        }), def_to_moz(AST_Atom, function(M) {
            return {
                type: "Identifier",
                name: String(M.value)
            };
        }), def_to_moz(AST_BigInt, (M)=>({
                type: "BigIntLiteral",
                value: M.value
            })), AST_Boolean.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast), AST_Null.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast), AST_Hole.DEFMETHOD("to_mozilla_ast", function() {
            return null;
        }), AST_Block.DEFMETHOD("to_mozilla_ast", AST_BlockStatement.prototype.to_mozilla_ast), AST_Lambda.DEFMETHOD("to_mozilla_ast", AST_Function.prototype.to_mozilla_ast);
        var FROM_MOZ_STACK = null;
        function from_moz(node) {
            FROM_MOZ_STACK.push(node);
            var ret = null != node ? MOZ_TO_ME[node.type](node) : null;
            return FROM_MOZ_STACK.pop(), ret;
        }
        function def_to_moz(mytype, handler) {
            mytype.DEFMETHOD("to_mozilla_ast", function(parent) {
                var moznode, start, end;
                return moznode = handler(this, parent), start = this.start, end = this.end, start && end && (null != start.pos && null != end.endpos && (moznode.range = [
                    start.pos,
                    end.endpos
                ]), start.line && (moznode.loc = {
                    start: {
                        line: start.line,
                        column: start.col
                    },
                    end: end.endline ? {
                        line: end.endline,
                        column: end.endcol
                    } : null
                }, start.file && (moznode.loc.source = start.file))), moznode;
            });
        }
        AST_Node.from_mozilla_ast = function(node) {
            var save_stack = FROM_MOZ_STACK;
            FROM_MOZ_STACK = [];
            var ast = from_moz(node);
            return FROM_MOZ_STACK = save_stack, ast;
        };
        var TO_MOZ_STACK = null;
        function to_moz(node) {
            null === TO_MOZ_STACK && (TO_MOZ_STACK = []), TO_MOZ_STACK.push(node);
            var ast = null != node ? node.to_mozilla_ast(TO_MOZ_STACK[TO_MOZ_STACK.length - 2]) : null;
            return TO_MOZ_STACK.pop(), 0 === TO_MOZ_STACK.length && (TO_MOZ_STACK = null), ast;
        }
        function to_moz_in_destructuring() {
            for(var i = TO_MOZ_STACK.length; i--;)if (TO_MOZ_STACK[i] instanceof AST_Destructuring) return !0;
            return !1;
        }
        function to_moz_block(node) {
            return {
                type: "BlockStatement",
                body: node.body.map(to_moz)
            };
        }
        function to_moz_scope(type, node) {
            var body = node.body.map(to_moz);
            return node.body[0] instanceof AST_SimpleStatement && node.body[0].body instanceof AST_String && body.unshift(to_moz(new AST_EmptyStatement(node.body[0]))), {
                type: type,
                body: body
            };
        }
    }();
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ const EXPECT_DIRECTIVE = /^$|[;{][\s\n]*$/, r_annotation = /[@#]__(PURE|INLINE|NOINLINE)__/g;
    function is_some_comments(comment) {
        // multiline comment
        return ("comment2" === comment.type || "comment1" === comment.type) && /@preserve|@copyright|@lic|@cc_on|^\**!/i.test(comment.value);
    }
    class Rope {
        constructor(){
            this.committed = "", this.current = "";
        }
        append(str) {
            this.current += str;
        }
        insertAt(char, index) {
            const { committed, current } = this;
            index < committed.length ? this.committed = committed.slice(0, index) + char + committed.slice(index) : index === committed.length ? this.committed += char : (index -= committed.length, this.committed += current.slice(0, index) + char, this.current = current.slice(index));
        }
        charAt(index) {
            const { committed } = this;
            return index < committed.length ? committed[index] : this.current[index - committed.length];
        }
        curLength() {
            return this.current.length;
        }
        length() {
            return this.committed.length + this.current.length;
        }
        toString() {
            return this.committed + this.current;
        }
    }
    function OutputStream(options) {
        var readonly = !options;
        void 0 === (options = defaults(options, {
            ascii_only: !1,
            beautify: !1,
            braces: !1,
            comments: "some",
            ecma: 5,
            ie8: !1,
            indent_level: 4,
            indent_start: 0,
            inline_script: !0,
            keep_numbers: !1,
            keep_quoted_props: !1,
            max_line_len: !1,
            preamble: null,
            preserve_annotations: !1,
            quote_keys: !1,
            quote_style: 0,
            safari10: !1,
            semicolons: !0,
            shebang: !0,
            shorthand: void 0,
            source_map: null,
            webkit: !1,
            width: 80,
            wrap_iife: !1,
            wrap_func_args: !0
        }, !0)).shorthand && (options.shorthand = options.ecma > 5);
        // Convert comment option to RegExp if neccessary and set up comments filter
        var comment_filter = return_false; // Default case, throw all comments away
        if (options.comments) {
            let comments = options.comments;
            if ("string" == typeof options.comments && /^\/.*\/[a-zA-Z]*$/.test(options.comments)) {
                var regex_pos = options.comments.lastIndexOf("/");
                comments = new RegExp(options.comments.substr(1, regex_pos - 1), options.comments.substr(regex_pos + 1));
            }
            comment_filter = comments instanceof RegExp ? function(comment) {
                return "comment5" != comment.type && comments.test(comment.value);
            } : "function" == typeof comments ? function(comment) {
                return "comment5" != comment.type && comments(this, comment);
            } : "some" === comments ? is_some_comments : return_true;
        }
        var indentation = 0, current_col = 0, current_line = 1, current_pos = 0, OUTPUT = new Rope();
        let printed_comments = new Set();
        var to_utf8 = options.ascii_only ? function(str, identifier = !1, regexp = !1) {
            return !(options.ecma >= 2015) || options.safari10 || regexp || (str = str.replace(/[\ud800-\udbff][\udc00-\udfff]/g, function(ch) {
                return "\\u{" + (is_surrogate_pair_head(ch.charCodeAt(0)) ? 0x10000 + (ch.charCodeAt(0) - 0xd800 << 10) + ch.charCodeAt(1) - 0xdc00 : ch.charCodeAt(0)).toString(16) + "}";
            })), str.replace(/[\u0000-\u001f\u007f-\uffff]/g, function(ch) {
                var code = ch.charCodeAt(0).toString(16);
                if (code.length <= 2 && !identifier) {
                    for(; code.length < 2;)code = "0" + code;
                    return "\\x" + code;
                }
                for(; code.length < 4;)code = "0" + code;
                return "\\u" + code;
            });
        } : function(str) {
            return str.replace(/[\ud800-\udbff][\udc00-\udfff]|([\ud800-\udbff]|[\udc00-\udfff])/g, function(match, lone) {
                return lone ? "\\u" + lone.charCodeAt(0).toString(16) : match;
            });
        };
        function encode_string(str, quote) {
            var ret = function(str, quote) {
                var dq = 0, sq = 0;
                function quote_single() {
                    return "'" + str.replace(/\x27/g, "\\'") + "'";
                }
                function quote_double() {
                    return '"' + str.replace(/\x22/g, '\\"') + '"';
                }
                if (str = to_utf8(str = str.replace(/[\\\b\f\n\r\v\t\x22\x27\u2028\u2029\0\ufeff]/g, function(s, i) {
                    switch(s){
                        case '"':
                            return ++dq, '"';
                        case "'":
                            return ++sq, "'";
                        case "\\":
                            return "\\\\";
                        case "\n":
                            return "\\n";
                        case "\r":
                            return "\\r";
                        case "\t":
                            return "\\t";
                        case "\b":
                            return "\\b";
                        case "\f":
                            return "\\f";
                        case "\x0B":
                            return options.ie8 ? "\\x0B" : "\\v";
                        case "\u2028":
                            return "\\u2028";
                        case "\u2029":
                            return "\\u2029";
                        case "\ufeff":
                            return "\\ufeff";
                        case "\0":
                            return /[0-9]/.test(get_full_char(str, i + 1)) ? "\\x00" : "\\0";
                    }
                    return s;
                })), "`" === quote) return "`" + str.replace(/`/g, "\\`") + "`";
                switch(options.quote_style){
                    case 1:
                        return quote_single();
                    case 2:
                        return quote_double();
                    case 3:
                        return "'" == quote ? quote_single() : quote_double();
                    default:
                        return dq > sq ? quote_single() : quote_double();
                }
            }(str, quote);
            return options.inline_script && (ret = (ret = (ret = ret.replace(/<\x2f(script)([>\/\t\n\f\r ])/gi, "<\\/$1$2")).replace(/\x3c!--/g, "\\x3c!--")).replace(/--\x3e/g, "--\\x3e")), ret;
        }
        /* -----[ beautification/minification ]----- */ var mapping_token, mapping_name, has_parens = !1, might_need_space = !1, might_need_semicolon = !1, might_add_newline = 0, need_newline_indented = !1, need_space = !1, newline_insert = -1, last = "", mappings = options.source_map && [], do_add_mapping = mappings ? function() {
            mappings.forEach(function(mapping) {
                try {
                    let { name, token } = mapping;
                    "name" == token.type || "privatename" === token.type ? name = token.value : name instanceof AST_Symbol && (name = "string" === token.type ? token.value : name.name), options.source_map.add(mapping.token.file, mapping.line, mapping.col, mapping.token.line, mapping.token.col, is_basic_identifier_string(name) ? name : void 0);
                } catch (ex) {
                // Ignore bad mapping
                }
            }), mappings = [];
        } : noop, ensure_line_len = options.max_line_len ? function() {
            if (current_col > options.max_line_len && might_add_newline) {
                OUTPUT.insertAt("\n", might_add_newline);
                const curLength = OUTPUT.curLength();
                if (mappings) {
                    var delta = curLength - current_col;
                    mappings.forEach(function(mapping) {
                        mapping.line++, mapping.col += delta;
                    });
                }
                current_line++, current_pos++, current_col = curLength;
            }
            might_add_newline && (might_add_newline = 0, do_add_mapping());
        } : noop, requireSemicolonChars = makePredicate("( [ + * / - , . `");
        function print(str) {
            var ch = get_full_char(str = String(str), 0);
            need_newline_indented && ch && (need_newline_indented = !1, "\n" !== ch && (print("\n"), indent())), need_space && ch && (need_space = !1, /[\s;})]/.test(ch) || space()), newline_insert = -1;
            var prev = last.charAt(last.length - 1);
            !might_need_semicolon || (might_need_semicolon = !1, (":" !== prev || "}" !== ch) && (ch && ";}".includes(ch) || ";" === prev) || (options.semicolons || requireSemicolonChars.has(ch) ? (OUTPUT.append(";"), current_col++, current_pos++) : (ensure_line_len(), current_col > 0 && (OUTPUT.append("\n"), current_pos++, current_line++, current_col = 0), /^\s+$/.test(str) && // reset the semicolon flag, since we didn't print one
            // now and might still have to later
            (might_need_semicolon = !0)), options.beautify || (might_need_space = !1))), might_need_space && ((is_identifier_char(prev) && (is_identifier_char(ch) || "\\" == ch) || "/" == ch && ch == prev || ("+" == ch || "-" == ch) && ch == last) && (OUTPUT.append(" "), current_col++, current_pos++), might_need_space = !1), mapping_token && (mappings.push({
                token: mapping_token,
                name: mapping_name,
                line: current_line,
                col: current_col
            }), mapping_token = !1, might_add_newline || do_add_mapping()), OUTPUT.append(str), has_parens = "(" == str[str.length - 1], current_pos += str.length;
            var a = str.split(/\r?\n/), n = a.length - 1;
            current_line += n, current_col += a[0].length, n > 0 && (ensure_line_len(), current_col = a[n].length), last = str;
        }
        var space = options.beautify ? function() {
            print(" ");
        } : function() {
            might_need_space = !0;
        }, indent = options.beautify ? function(half) {
            if (options.beautify) {
                var back;
                print((back = half ? 0.5 : 0, " ".repeat(options.indent_start + indentation - back * options.indent_level)));
            }
        } : noop, with_indent = options.beautify ? function(col, cont) {
            !0 === col && (col = next_indent());
            var save_indentation = indentation;
            indentation = col;
            var ret = cont();
            return indentation = save_indentation, ret;
        } : function(col, cont) {
            return cont();
        }, newline = options.beautify ? function() {
            if (newline_insert < 0) return print("\n");
            "\n" != OUTPUT.charAt(newline_insert) && (OUTPUT.insertAt("\n", newline_insert), current_pos++, current_line++), newline_insert++;
        } : options.max_line_len ? function() {
            ensure_line_len(), might_add_newline = OUTPUT.length();
        } : noop, semicolon = options.beautify ? function() {
            print(";");
        } : function() {
            might_need_semicolon = !0;
        };
        function force_semicolon() {
            might_need_semicolon = !1, print(";");
        }
        function next_indent() {
            return indentation + options.indent_level;
        }
        function get() {
            return might_add_newline && ensure_line_len(), OUTPUT.toString();
        }
        function has_nlb() {
            const output = OUTPUT.toString();
            let n = output.length - 1;
            for(; n >= 0;){
                const code = output.charCodeAt(n);
                if (10 === code) break;
                if (32 !== code) return !1;
                n--;
            }
            return !0;
        }
        function filter_comment(comment) {
            return (options.preserve_annotations || (comment = comment.replace(r_annotation, " ")), /^\s*$/.test(comment)) ? "" : comment.replace(/(<\s*\/\s*)(script)/i, "<\\/$2");
        }
        var stack = [];
        return {
            get: get,
            toString: get,
            indent: indent,
            in_directive: !1,
            use_asm: null,
            active_scope: null,
            indentation: function() {
                return indentation;
            },
            current_width: function() {
                return current_col - indentation;
            },
            should_break: function() {
                return options.width && this.current_width() >= options.width;
            },
            has_parens: function() {
                return has_parens;
            },
            newline: newline,
            print: print,
            star: function() {
                print("*");
            },
            space: space,
            comma: function() {
                print(","), space();
            },
            colon: function() {
                print(":"), space();
            },
            last: function() {
                return last;
            },
            semicolon: semicolon,
            force_semicolon: force_semicolon,
            to_utf8: to_utf8,
            print_name: function(name) {
                print(to_utf8(name.toString(), !0));
            },
            print_string: function(str, quote, escape_directive) {
                var encoded = encode_string(str, quote);
                !0 !== escape_directive || encoded.includes("\\") || (EXPECT_DIRECTIVE.test(OUTPUT.toString()) || force_semicolon(), force_semicolon()), print(encoded);
            },
            print_template_string_chars: function(str) {
                var encoded = encode_string(str, "`").replace(/\${/g, "\\${");
                return print(encoded.substr(1, encoded.length - 2));
            },
            encode_string: encode_string,
            next_indent: next_indent,
            with_indent: with_indent,
            with_block: function(cont) {
                var ret;
                return print("{"), newline(), with_indent(next_indent(), function() {
                    ret = cont();
                }), indent(), print("}"), ret;
            },
            with_parens: function(cont) {
                print("(");
                //XXX: still nice to have that for argument lists
                //var ret = with_indent(current_col, cont);
                var ret = cont();
                return print(")"), ret;
            },
            with_square: function(cont) {
                print("[");
                //var ret = with_indent(current_col, cont);
                var ret = cont();
                return print("]"), ret;
            },
            add_mapping: mappings ? function(token, name) {
                mapping_token = token, mapping_name = name;
            } : noop,
            option: function(opt) {
                return options[opt];
            },
            printed_comments: printed_comments,
            prepend_comments: readonly ? noop : function(node) {
                var start = node.start;
                if (!start) return;
                var printed_comments = this.printed_comments;
                // There cannot be a newline between return and its value.
                const return_with_value = node instanceof AST_Exit && node.value;
                if (start.comments_before && printed_comments.has(start.comments_before)) {
                    if (!return_with_value) return;
                    start.comments_before = [];
                }
                var comments = start.comments_before;
                if (comments || (comments = start.comments_before = []), printed_comments.add(comments), return_with_value) {
                    var tw = new TreeWalker(function(node) {
                        var parent = tw.parent();
                        if (!(parent instanceof AST_Exit) && (!(parent instanceof AST_Binary) || parent.left !== node) && ("Call" != parent.TYPE || parent.expression !== node) && (!(parent instanceof AST_Conditional) || parent.condition !== node) && (!(parent instanceof AST_Dot) || parent.expression !== node) && (!(parent instanceof AST_Sequence) || parent.expressions[0] !== node) && (!(parent instanceof AST_Sub) || parent.expression !== node) && !(parent instanceof AST_UnaryPostfix)) return !0;
                        if (node.start) {
                            var text = node.start.comments_before;
                            text && !printed_comments.has(text) && (printed_comments.add(text), comments = comments.concat(text));
                        }
                    });
                    tw.push(node), node.value.walk(tw);
                }
                if (0 == current_pos) {
                    comments.length > 0 && options.shebang && "comment5" === comments[0].type && !printed_comments.has(comments[0]) && (print("#!" + comments.shift().value + "\n"), indent());
                    var preamble = options.preamble;
                    preamble && print(preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
                }
                if (0 != (comments = comments.filter(comment_filter, node).filter((c)=>!printed_comments.has(c))).length) {
                    var last_nlb = has_nlb();
                    comments.forEach(function(c, i) {
                        if (printed_comments.add(c), !last_nlb && (c.nlb ? (print("\n"), indent(), last_nlb = !0) : i > 0 && space()), /comment[134]/.test(c.type)) {
                            var value = filter_comment(c.value);
                            value && (print("//" + value + "\n"), indent()), last_nlb = !0;
                        } else if ("comment2" == c.type) {
                            var value = filter_comment(c.value);
                            value && print("/*" + value + "*/"), last_nlb = !1;
                        }
                    }), last_nlb || (start.nlb ? (print("\n"), indent()) : space());
                }
            },
            append_comments: readonly || comment_filter === return_false ? noop : function(node, tail) {
                var token = node.end;
                if (token) {
                    var printed_comments = this.printed_comments, comments = token[tail ? "comments_before" : "comments_after"];
                    if (!(!comments || printed_comments.has(comments)) && (node instanceof AST_Statement || comments.every((c)=>!/comment[134]/.test(c.type)))) {
                        printed_comments.add(comments);
                        var insert = OUTPUT.length();
                        comments.filter(comment_filter, node).forEach(function(c, i) {
                            if (!printed_comments.has(c)) {
                                if (printed_comments.add(c), need_space = !1, need_newline_indented ? (print("\n"), indent(), need_newline_indented = !1) : c.nlb && (i > 0 || !has_nlb()) ? (print("\n"), indent()) : (i > 0 || !tail) && space(), /comment[134]/.test(c.type)) {
                                    const value = filter_comment(c.value);
                                    value && print("//" + value), need_newline_indented = !0;
                                } else if ("comment2" == c.type) {
                                    const value = filter_comment(c.value);
                                    value && print("/*" + value + "*/"), need_space = !0;
                                }
                            }
                        }), OUTPUT.length() > insert && (newline_insert = insert);
                    }
                }
            },
            line: function() {
                return current_line;
            },
            col: function() {
                return current_col;
            },
            pos: function() {
                return current_pos;
            },
            push_node: function(node) {
                stack.push(node);
            },
            pop_node: function() {
                return stack.pop();
            },
            parent: function(n) {
                return stack[stack.length - 2 - (n || 0)];
            }
        };
    }
    !/* -----[ code generators ]----- */ function() {
        /* -----[ utils ]----- */ function DEFPRINT(nodetype, generator) {
            nodetype.DEFMETHOD("_codegen", generator);
        }
        /* -----[ PARENTHESES ]----- */ function PARENS(nodetype, func) {
            Array.isArray(nodetype) ? nodetype.forEach(function(nodetype) {
                PARENS(nodetype, func);
            }) : nodetype.DEFMETHOD("needs_parens", func);
        }
        /* -----[ statements ]----- */ function display_body(body, is_toplevel, output, allow_directives) {
            var last = body.length - 1;
            output.in_directive = allow_directives, body.forEach(function(stmt, i) {
                !0 !== output.in_directive || stmt instanceof AST_Directive || stmt instanceof AST_EmptyStatement || stmt instanceof AST_SimpleStatement && stmt.body instanceof AST_String || (output.in_directive = !1), stmt instanceof AST_EmptyStatement || (output.indent(), stmt.print(output), !(i == last && is_toplevel) && (output.newline(), is_toplevel && output.newline())), !0 === output.in_directive && stmt instanceof AST_SimpleStatement && stmt.body instanceof AST_String && (output.in_directive = !1);
            }), output.in_directive = !1;
        }
        function print_braced_empty(self1, output) {
            output.print("{"), output.with_indent(output.next_indent(), function() {
                output.append_comments(self1, !0);
            }), output.print("}");
        }
        function print_braced(self1, output, allow_directives) {
            self1.body.length > 0 ? output.with_block(function() {
                display_body(self1.body, !1, output, allow_directives);
            }) : print_braced_empty(self1, output);
        }
        function parenthesize_for_noin(node, output, noin) {
            var parens = !1;
            noin && (parens = walk(node, (node)=>// Don't go into scopes -- except arrow functions:
                // https://github.com/terser/terser/issues/1019#issuecomment-877642607
                node instanceof AST_Scope && !(node instanceof AST_Arrow) || (node instanceof AST_Binary && "in" == node.operator ? walk_abort : void 0))), node.print(output, parens);
        }
        function print_property_name(key, quote, output) {
            return output.option("quote_keys") ? output.print_string(key) : "" + +key == key && key >= 0 ? output.option("keep_numbers") ? output.print(key) : output.print(make_num(key)) : (ALL_RESERVED_WORDS.has(key) ? output.option("ie8") : 2015 > output.option("ecma") || output.option("safari10") ? !is_basic_identifier_string(key) : !is_identifier_string(key, !0)) || quote && output.option("keep_quoted_props") ? output.print_string(key, quote) : output.print_name(key);
        }
        AST_Node.DEFMETHOD("print", function(output, force_parens) {
            var self1 = this, generator = self1._codegen;
            function doit() {
                output.prepend_comments(self1), self1.add_source_map(output), generator(self1, output), output.append_comments(self1);
            }
            self1 instanceof AST_Scope ? output.active_scope = self1 : !output.use_asm && self1 instanceof AST_Directive && "use asm" == self1.value && (output.use_asm = output.active_scope), output.push_node(self1), force_parens || self1.needs_parens(output) ? output.with_parens(doit) : doit(), output.pop_node(), self1 === output.use_asm && (output.use_asm = null);
        }), AST_Node.DEFMETHOD("_print", AST_Node.prototype.print), AST_Node.DEFMETHOD("print_to_string", function(options) {
            var output = OutputStream(options);
            return this.print(output), output.get();
        }), PARENS(AST_Node, return_false), // a function expression needs parens around it when it's provably
        // the first token to appear in a statement.
        PARENS(AST_Function, function(output) {
            if (!output.has_parens() && first_in_statement(output)) return !0;
            if (output.option("webkit")) {
                var p = output.parent();
                if (p instanceof AST_PropAccess && p.expression === this) return !0;
            }
            if (output.option("wrap_iife")) {
                var p = output.parent();
                if (p instanceof AST_Call && p.expression === this) return !0;
            }
            if (output.option("wrap_func_args")) {
                var p = output.parent();
                if (p instanceof AST_Call && p.args.includes(this)) return !0;
            }
            return !1;
        }), PARENS(AST_Arrow, function(output) {
            var p = output.parent();
            return !!(output.option("wrap_func_args") && p instanceof AST_Call && p.args.includes(this)) || p instanceof AST_PropAccess && p.expression === this;
        }), // same goes for an object literal (as in AST_Function), because
        // otherwise {...} would be interpreted as a block of code.
        PARENS(AST_Object, function(output) {
            return !output.has_parens() && first_in_statement(output);
        }), PARENS(AST_ClassExpression, first_in_statement), PARENS(AST_Unary, function(output) {
            var p = output.parent();
            return p instanceof AST_PropAccess && p.expression === this || p instanceof AST_Call && p.expression === this || p instanceof AST_Binary && "**" === p.operator && this instanceof AST_UnaryPrefix && p.left === this && "++" !== this.operator && "--" !== this.operator;
        }), PARENS(AST_Await, function(output) {
            var p = output.parent();
            return p instanceof AST_PropAccess && p.expression === this || p instanceof AST_Call && p.expression === this || p instanceof AST_Binary && "**" === p.operator && p.left === this || output.option("safari10") && p instanceof AST_UnaryPrefix;
        }), PARENS(AST_Sequence, function(output) {
            var p = output.parent();
            return p instanceof AST_Call // (foo, bar)() or foo(1, (2, 3), 4)
             || p instanceof AST_Unary // !(foo, bar, baz)
             || p instanceof AST_Binary // 1 + (2, 3) + 4 ==> 8
             || p instanceof AST_VarDef // var a = (1, 2), b = a + a; ==> b == 4
             || p instanceof AST_PropAccess // (1, {foo:2}).foo or (1, {foo:2})["foo"] ==> 2
             || p instanceof AST_Array // [ 1, (2, 3), 4 ] ==> [ 1, 3, 4 ]
             || p instanceof AST_ObjectProperty // { foo: (1, 2) }.foo ==> 2
             || p instanceof AST_Conditional /* (false, true) ? (a = 10, b = 20) : (c = 30)
                                                               * ==> 20 (side effect, set a := 10 and b := 20) */  || p instanceof AST_Arrow // x => (x, x)
             || p instanceof AST_DefaultAssign // x => (x = (0, function(){}))
             || p instanceof AST_Expansion // [...(a, b)]
             || p instanceof AST_ForOf && this === p.object // for (e of (foo, bar)) {}
             || p instanceof AST_Yield // yield (foo, bar)
             || p instanceof AST_Export // export default (foo, bar)
            ;
        }), PARENS(AST_Binary, function(output) {
            var p = output.parent();
            // (foo && bar)()
            if (p instanceof AST_Call && p.expression === this || p instanceof AST_Unary || p instanceof AST_PropAccess && p.expression === this) return !0;
            // this deals with precedence: 3 * (2 + 1)
            if (p instanceof AST_Binary) {
                const po = p.operator, so = this.operator;
                if ("??" === so && ("||" === po || "&&" === po) || "??" === po && ("||" === so || "&&" === so)) return !0;
                const pp = PRECEDENCE[po], sp = PRECEDENCE[so];
                if (pp > sp || pp == sp && (this === p.right || "**" == po)) return !0;
            }
        }), PARENS(AST_Yield, function(output) {
            var p = output.parent();
            // (yield 1) + (yield 2)
            // a = yield 3
            if (p instanceof AST_Binary && "=" !== p.operator || p instanceof AST_Call && p.expression === this || p instanceof AST_Conditional && p.condition === this || p instanceof AST_Unary || p instanceof AST_PropAccess && p.expression === this) return !0;
        }), PARENS(AST_PropAccess, function(output) {
            var p = output.parent();
            if (p instanceof AST_New && p.expression === this) // i.e. new (foo.bar().baz)
            //
            // if there's one call into this subtree, then we need
            // parens around it too, otherwise the call will be
            // interpreted as passing the arguments to the upper New
            // expression.
            return walk(this, (node)=>node instanceof AST_Scope || (node instanceof AST_Call ? walk_abort : void 0));
        }), PARENS(AST_Call, function(output) {
            var p1, p = output.parent();
            return p instanceof AST_New && p.expression === this || p instanceof AST_Export && !!p.is_default && this.expression instanceof AST_Function || this.expression instanceof AST_Function && p instanceof AST_PropAccess && p.expression === this && (p1 = output.parent(1)) instanceof AST_Assign && p1.left === p;
        }), PARENS(AST_New, function(output) {
            var p = output.parent();
            if (0 === this.args.length && (p instanceof AST_PropAccess // (new Date).getTime(), (new Date)["getTime"]()
             || p instanceof AST_Call && p.expression === this)) return !0;
        }), PARENS(AST_Number, function(output) {
            var p = output.parent();
            if (p instanceof AST_PropAccess && p.expression === this) {
                var value = this.getValue();
                if (value < 0 || /^0/.test(make_num(value))) return !0;
            }
        }), PARENS(AST_BigInt, function(output) {
            var p = output.parent();
            if (p instanceof AST_PropAccess && p.expression === this && this.getValue().startsWith("-")) return !0;
        }), PARENS([
            AST_Assign,
            AST_Conditional
        ], function(output) {
            var p = output.parent();
            // !(a = false) → true
            if (p instanceof AST_Unary || p instanceof AST_Binary && !(p instanceof AST_Assign) || p instanceof AST_Call && p.expression === this || p instanceof AST_Conditional && p.condition === this || p instanceof AST_PropAccess && p.expression === this || this instanceof AST_Assign && this.left instanceof AST_Destructuring && !1 === this.left.is_array) return !0;
        }), /* -----[ PRINTERS ]----- */ DEFPRINT(AST_Directive, function(self1, output) {
            output.print_string(self1.value, self1.quote), output.semicolon();
        }), DEFPRINT(AST_Expansion, function(self1, output) {
            output.print("..."), self1.expression.print(output);
        }), DEFPRINT(AST_Destructuring, function(self1, output) {
            output.print(self1.is_array ? "[" : "{");
            var len = self1.names.length;
            self1.names.forEach(function(name, i) {
                i > 0 && output.comma(), name.print(output), i == len - 1 && name instanceof AST_Hole && output.comma();
            }), output.print(self1.is_array ? "]" : "}");
        }), DEFPRINT(AST_Debugger, function(self1, output) {
            output.print("debugger"), output.semicolon();
        }), AST_StatementWithBody.DEFMETHOD("_do_print_body", function(output) {
            force_statement(this.body, output);
        }), DEFPRINT(AST_Statement, function(self1, output) {
            self1.body.print(output), output.semicolon();
        }), DEFPRINT(AST_Toplevel, function(self1, output) {
            display_body(self1.body, !0, output, !0), output.print("");
        }), DEFPRINT(AST_LabeledStatement, function(self1, output) {
            self1.label.print(output), output.colon(), self1.body.print(output);
        }), DEFPRINT(AST_SimpleStatement, function(self1, output) {
            self1.body.print(output), output.semicolon();
        }), DEFPRINT(AST_BlockStatement, function(self1, output) {
            print_braced(self1, output);
        }), DEFPRINT(AST_EmptyStatement, function(self1, output) {
            output.semicolon();
        }), DEFPRINT(AST_Do, function(self1, output) {
            output.print("do"), output.space(), make_block(self1.body, output), output.space(), output.print("while"), output.space(), output.with_parens(function() {
                self1.condition.print(output);
            }), output.semicolon();
        }), DEFPRINT(AST_While, function(self1, output) {
            output.print("while"), output.space(), output.with_parens(function() {
                self1.condition.print(output);
            }), output.space(), self1._do_print_body(output);
        }), DEFPRINT(AST_For, function(self1, output) {
            output.print("for"), output.space(), output.with_parens(function() {
                self1.init ? (self1.init instanceof AST_Definitions ? self1.init.print(output) : parenthesize_for_noin(self1.init, output, !0), output.print(";"), output.space()) : output.print(";"), self1.condition ? (self1.condition.print(output), output.print(";"), output.space()) : output.print(";"), self1.step && self1.step.print(output);
            }), output.space(), self1._do_print_body(output);
        }), DEFPRINT(AST_ForIn, function(self1, output) {
            output.print("for"), self1.await && (output.space(), output.print("await")), output.space(), output.with_parens(function() {
                self1.init.print(output), output.space(), output.print(self1 instanceof AST_ForOf ? "of" : "in"), output.space(), self1.object.print(output);
            }), output.space(), self1._do_print_body(output);
        }), DEFPRINT(AST_With, function(self1, output) {
            output.print("with"), output.space(), output.with_parens(function() {
                self1.expression.print(output);
            }), output.space(), self1._do_print_body(output);
        }), /* -----[ functions ]----- */ AST_Lambda.DEFMETHOD("_do_print", function(output, nokeyword) {
            var self1 = this;
            !nokeyword && (self1.async && (output.print("async"), output.space()), output.print("function"), self1.is_generator && output.star(), self1.name && output.space()), self1.name instanceof AST_Symbol ? self1.name.print(output) : nokeyword && self1.name instanceof AST_Node && output.with_square(function() {
                self1.name.print(output); // Computed method name
            }), output.with_parens(function() {
                self1.argnames.forEach(function(arg, i) {
                    i && output.comma(), arg.print(output);
                });
            }), output.space(), print_braced(self1, output, !0);
        }), DEFPRINT(AST_Lambda, function(self1, output) {
            self1._do_print(output);
        }), DEFPRINT(AST_PrefixedTemplateString, function(self1, output) {
            var tag = self1.prefix, parenthesize_tag = tag instanceof AST_Lambda || tag instanceof AST_Binary || tag instanceof AST_Conditional || tag instanceof AST_Sequence || tag instanceof AST_Unary || tag instanceof AST_Dot && tag.expression instanceof AST_Object;
            parenthesize_tag && output.print("("), self1.prefix.print(output), parenthesize_tag && output.print(")"), self1.template_string.print(output);
        }), DEFPRINT(AST_TemplateString, function(self1, output) {
            var is_tagged = output.parent() instanceof AST_PrefixedTemplateString;
            output.print("`");
            for(var i = 0; i < self1.segments.length; i++)self1.segments[i] instanceof AST_TemplateSegment ? is_tagged ? output.print(self1.segments[i].raw) : output.print_template_string_chars(self1.segments[i].value) : (output.print("${"), self1.segments[i].print(output), output.print("}"));
            output.print("`");
        }), DEFPRINT(AST_TemplateSegment, function(self1, output) {
            output.print_template_string_chars(self1.value);
        }), AST_Arrow.DEFMETHOD("_do_print", function(output) {
            var self1 = this, parent = output.parent(), needs_parens = parent instanceof AST_Binary && !(parent instanceof AST_Assign) || parent instanceof AST_Unary || parent instanceof AST_Call && self1 === parent.expression;
            needs_parens && output.print("("), self1.async && (output.print("async"), output.space()), 1 === self1.argnames.length && self1.argnames[0] instanceof AST_Symbol ? self1.argnames[0].print(output) : output.with_parens(function() {
                self1.argnames.forEach(function(arg, i) {
                    i && output.comma(), arg.print(output);
                });
            }), output.space(), output.print("=>"), output.space();
            const first_statement = self1.body[0];
            if (1 === self1.body.length && first_statement instanceof AST_Return) {
                const returned = first_statement.value;
                returned ? // Returns whether the leftmost item in the expression is an object
                function left_is_object(node) {
                    return node instanceof AST_Object || (node instanceof AST_Sequence ? left_is_object(node.expressions[0]) : "Call" === node.TYPE ? left_is_object(node.expression) : node instanceof AST_PrefixedTemplateString ? left_is_object(node.prefix) : node instanceof AST_Dot || node instanceof AST_Sub ? left_is_object(node.expression) : node instanceof AST_Conditional ? left_is_object(node.condition) : node instanceof AST_Binary ? left_is_object(node.left) : node instanceof AST_UnaryPostfix && left_is_object(node.expression));
                }(returned) ? (output.print("("), returned.print(output), output.print(")")) : returned.print(output) : output.print("{}");
            } else print_braced(self1, output);
            needs_parens && output.print(")");
        }), /* -----[ exits ]----- */ AST_Exit.DEFMETHOD("_do_print", function(output, kind) {
            if (output.print(kind), this.value) {
                output.space();
                const comments = this.value.start.comments_before;
                comments && comments.length && !output.printed_comments.has(comments) ? (output.print("("), this.value.print(output), output.print(")")) : this.value.print(output);
            }
            output.semicolon();
        }), DEFPRINT(AST_Return, function(self1, output) {
            self1._do_print(output, "return");
        }), DEFPRINT(AST_Throw, function(self1, output) {
            self1._do_print(output, "throw");
        }), /* -----[ yield ]----- */ DEFPRINT(AST_Yield, function(self1, output) {
            var star = self1.is_star ? "*" : "";
            output.print("yield" + star), self1.expression && (output.space(), self1.expression.print(output));
        }), DEFPRINT(AST_Await, function(self1, output) {
            output.print("await"), output.space();
            var e = self1.expression, parens = !(e instanceof AST_Call || e instanceof AST_SymbolRef || e instanceof AST_PropAccess || e instanceof AST_Unary || e instanceof AST_Constant || e instanceof AST_Await || e instanceof AST_Object);
            parens && output.print("("), self1.expression.print(output), parens && output.print(")");
        }), /* -----[ loop control ]----- */ AST_LoopControl.DEFMETHOD("_do_print", function(output, kind) {
            output.print(kind), this.label && (output.space(), this.label.print(output)), output.semicolon();
        }), DEFPRINT(AST_Break, function(self1, output) {
            self1._do_print(output, "break");
        }), DEFPRINT(AST_Continue, function(self1, output) {
            self1._do_print(output, "continue");
        }), DEFPRINT(AST_If, function(self1, output) {
            output.print("if"), output.space(), output.with_parens(function() {
                self1.condition.print(output);
            }), output.space(), self1.alternative ? (/* -----[ if ]----- */ function(self1, output) {
                var b = self1.body;
                if (output.option("braces") || output.option("ie8") && b instanceof AST_Do) return make_block(b, output);
                // The squeezer replaces "block"-s that contain only a single
                // statement with the statement itself; technically, the AST
                // is correct, but this can create problems when we output an
                // IF having an ELSE clause where the THEN clause ends in an
                // IF *without* an ELSE block (then the outer ELSE would refer
                // to the inner IF).  This function checks for this case and
                // adds the block braces if needed.
                if (!b) return output.force_semicolon();
                for(;;)if (b instanceof AST_If) {
                    if (!b.alternative) {
                        make_block(self1.body, output);
                        return;
                    }
                    b = b.alternative;
                } else if (b instanceof AST_StatementWithBody) b = b.body;
                else break;
                force_statement(self1.body, output);
            }(self1, output), output.space(), output.print("else"), output.space(), self1.alternative instanceof AST_If ? self1.alternative.print(output) : force_statement(self1.alternative, output)) : self1._do_print_body(output);
        }), /* -----[ switch ]----- */ DEFPRINT(AST_Switch, function(self1, output) {
            output.print("switch"), output.space(), output.with_parens(function() {
                self1.expression.print(output);
            }), output.space();
            var last = self1.body.length - 1;
            last < 0 ? print_braced_empty(self1, output) : output.with_block(function() {
                self1.body.forEach(function(branch, i) {
                    output.indent(!0), branch.print(output), i < last && branch.body.length > 0 && output.newline();
                });
            });
        }), AST_SwitchBranch.DEFMETHOD("_do_print_body", function(output) {
            output.newline(), this.body.forEach(function(stmt) {
                output.indent(), stmt.print(output), output.newline();
            });
        }), DEFPRINT(AST_Default, function(self1, output) {
            output.print("default:"), self1._do_print_body(output);
        }), DEFPRINT(AST_Case, function(self1, output) {
            output.print("case"), output.space(), self1.expression.print(output), output.print(":"), self1._do_print_body(output);
        }), /* -----[ exceptions ]----- */ DEFPRINT(AST_Try, function(self1, output) {
            output.print("try"), output.space(), print_braced(self1, output), self1.bcatch && (output.space(), self1.bcatch.print(output)), self1.bfinally && (output.space(), self1.bfinally.print(output));
        }), DEFPRINT(AST_Catch, function(self1, output) {
            output.print("catch"), self1.argname && (output.space(), output.with_parens(function() {
                self1.argname.print(output);
            })), output.space(), print_braced(self1, output);
        }), DEFPRINT(AST_Finally, function(self1, output) {
            output.print("finally"), output.space(), print_braced(self1, output);
        }), /* -----[ var/const ]----- */ AST_Definitions.DEFMETHOD("_do_print", function(output, kind) {
            output.print(kind), output.space(), this.definitions.forEach(function(def, i) {
                i && output.comma(), def.print(output);
            });
            var p = output.parent();
            (!(p instanceof AST_For || p instanceof AST_ForIn) || p && p.init !== this) && output.semicolon();
        }), DEFPRINT(AST_Let, function(self1, output) {
            self1._do_print(output, "let");
        }), DEFPRINT(AST_Var, function(self1, output) {
            self1._do_print(output, "var");
        }), DEFPRINT(AST_Const, function(self1, output) {
            self1._do_print(output, "const");
        }), DEFPRINT(AST_Import, function(self1, output) {
            output.print("import"), output.space(), self1.imported_name && self1.imported_name.print(output), self1.imported_name && self1.imported_names && (output.print(","), output.space()), self1.imported_names && (1 === self1.imported_names.length && "*" === self1.imported_names[0].foreign_name.name ? self1.imported_names[0].print(output) : (output.print("{"), self1.imported_names.forEach(function(name_import, i) {
                output.space(), name_import.print(output), i < self1.imported_names.length - 1 && output.print(",");
            }), output.space(), output.print("}"))), (self1.imported_name || self1.imported_names) && (output.space(), output.print("from"), output.space()), self1.module_name.print(output), self1.assert_clause && (output.print("assert"), self1.assert_clause.print(output)), output.semicolon();
        }), DEFPRINT(AST_ImportMeta, function(self1, output) {
            output.print("import.meta");
        }), DEFPRINT(AST_NameMapping, function(self1, output) {
            var is_import = output.parent() instanceof AST_Import, definition = self1.name.definition();
            (definition && definition.mangled_name || self1.name.name) !== self1.foreign_name.name ? (is_import ? output.print(self1.foreign_name.name) : self1.name.print(output), output.space(), output.print("as"), output.space(), is_import ? self1.name.print(output) : output.print(self1.foreign_name.name)) : self1.name.print(output);
        }), DEFPRINT(AST_Export, function(self1, output) {
            if (output.print("export"), output.space(), self1.is_default && (output.print("default"), output.space()), self1.exported_names) 1 === self1.exported_names.length && "*" === self1.exported_names[0].name.name ? self1.exported_names[0].print(output) : (output.print("{"), self1.exported_names.forEach(function(name_export, i) {
                output.space(), name_export.print(output), i < self1.exported_names.length - 1 && output.print(",");
            }), output.space(), output.print("}"));
            else if (self1.exported_value) self1.exported_value.print(output);
            else if (self1.exported_definition && (self1.exported_definition.print(output), self1.exported_definition instanceof AST_Definitions)) return;
            self1.module_name && (output.space(), output.print("from"), output.space(), self1.module_name.print(output)), self1.assert_clause && (output.print("assert"), self1.assert_clause.print(output)), (self1.exported_value && !(self1.exported_value instanceof AST_Defun || self1.exported_value instanceof AST_Function || self1.exported_value instanceof AST_Class) || self1.module_name || self1.exported_names) && output.semicolon();
        }), DEFPRINT(AST_VarDef, function(self1, output) {
            if (self1.name.print(output), self1.value) {
                output.space(), output.print("="), output.space();
                var p = output.parent(1), noin = p instanceof AST_For || p instanceof AST_ForIn;
                parenthesize_for_noin(self1.value, output, noin);
            }
        }), /* -----[ other expressions ]----- */ DEFPRINT(AST_Call, function(self1, output) {
            self1.expression.print(output), self1 instanceof AST_New && 0 === self1.args.length || ((self1.expression instanceof AST_Call || self1.expression instanceof AST_Lambda) && output.add_mapping(self1.start), self1.optional && output.print("?."), output.with_parens(function() {
                self1.args.forEach(function(expr, i) {
                    i && output.comma(), expr.print(output);
                });
            }));
        }), DEFPRINT(AST_New, function(self1, output) {
            output.print("new"), output.space(), AST_Call.prototype._codegen(self1, output);
        }), AST_Sequence.DEFMETHOD("_do_print", function(output) {
            this.expressions.forEach(function(node, index) {
                index > 0 && (output.comma(), output.should_break() && (output.newline(), output.indent())), node.print(output);
            });
        }), DEFPRINT(AST_Sequence, function(self1, output) {
            self1._do_print(output);
        // var p = output.parent();
        // if (p instanceof AST_Statement) {
        //     output.with_indent(output.next_indent(), function(){
        //         self._do_print(output);
        //     });
        // } else {
        //     self._do_print(output);
        // }
        }), DEFPRINT(AST_Dot, function(self1, output) {
            var expr = self1.expression;
            expr.print(output);
            var prop = self1.property, print_computed = ALL_RESERVED_WORDS.has(prop) ? output.option("ie8") : !is_identifier_string(prop, output.option("ecma") >= 2015 || output.option("safari10"));
            self1.optional && output.print("?."), print_computed ? (output.print("["), output.add_mapping(self1.end), output.print_string(prop), output.print("]")) : (expr instanceof AST_Number && expr.getValue() >= 0 && !/[xa-f.)]/i.test(output.last()) && output.print("."), self1.optional || output.print("."), // the name after dot would be mapped about here.
            output.add_mapping(self1.end), output.print_name(prop));
        }), DEFPRINT(AST_DotHash, function(self1, output) {
            self1.expression.print(output);
            var prop = self1.property;
            self1.optional && output.print("?"), output.print(".#"), output.add_mapping(self1.end), output.print_name(prop);
        }), DEFPRINT(AST_Sub, function(self1, output) {
            self1.expression.print(output), self1.optional && output.print("?."), output.print("["), self1.property.print(output), output.print("]");
        }), DEFPRINT(AST_Chain, function(self1, output) {
            self1.expression.print(output);
        }), DEFPRINT(AST_UnaryPrefix, function(self1, output) {
            var op = self1.operator;
            output.print(op), (/^[a-z]/i.test(op) || /[+-]$/.test(op) && self1.expression instanceof AST_UnaryPrefix && /^[+-]/.test(self1.expression.operator)) && output.space(), self1.expression.print(output);
        }), DEFPRINT(AST_UnaryPostfix, function(self1, output) {
            self1.expression.print(output), output.print(self1.operator);
        }), DEFPRINT(AST_Binary, function(self1, output) {
            var op = self1.operator;
            self1.left.print(output), ">" /* ">>" ">>>" ">" ">=" */  == op[0] && self1.left instanceof AST_UnaryPostfix && "--" == self1.left.operator ? // space is mandatory to avoid outputting -->
            output.print(" ") : // the space is optional depending on "beautify"
            output.space(), output.print(op), ("<" == op || "<<" == op) && self1.right instanceof AST_UnaryPrefix && "!" == self1.right.operator && self1.right.expression instanceof AST_UnaryPrefix && "--" == self1.right.expression.operator ? // space is mandatory to avoid outputting <!--
            output.print(" ") : // the space is optional depending on "beautify"
            output.space(), self1.right.print(output);
        }), DEFPRINT(AST_Conditional, function(self1, output) {
            self1.condition.print(output), output.space(), output.print("?"), output.space(), self1.consequent.print(output), output.space(), output.colon(), self1.alternative.print(output);
        }), /* -----[ literals ]----- */ DEFPRINT(AST_Array, function(self1, output) {
            output.with_square(function() {
                var a = self1.elements, len = a.length;
                len > 0 && output.space(), a.forEach(function(exp, i) {
                    i && output.comma(), exp.print(output), i === len - 1 && exp instanceof AST_Hole && output.comma();
                }), len > 0 && output.space();
            });
        }), DEFPRINT(AST_Object, function(self1, output) {
            self1.properties.length > 0 ? output.with_block(function() {
                self1.properties.forEach(function(prop, i) {
                    i && (output.print(","), output.newline()), output.indent(), prop.print(output);
                }), output.newline();
            }) : print_braced_empty(self1, output);
        }), DEFPRINT(AST_Class, function(self1, output) {
            if (output.print("class"), output.space(), self1.name && (self1.name.print(output), output.space()), self1.extends) {
                var parens = !(self1.extends instanceof AST_SymbolRef) && !(self1.extends instanceof AST_PropAccess) && !(self1.extends instanceof AST_ClassExpression) && !(self1.extends instanceof AST_Function);
                output.print("extends"), parens ? output.print("(") : output.space(), self1.extends.print(output), parens ? output.print(")") : output.space();
            }
            self1.properties.length > 0 ? output.with_block(function() {
                self1.properties.forEach(function(prop, i) {
                    i && output.newline(), output.indent(), prop.print(output);
                }), output.newline();
            }) : output.print("{}");
        }), DEFPRINT(AST_NewTarget, function(self1, output) {
            output.print("new.target");
        }), DEFPRINT(AST_ObjectKeyVal, function(self1, output) {
            function get_name(self1) {
                var def = self1.definition();
                return def ? def.mangled_name || def.name : self1.name;
            }
            var allowShortHand = output.option("shorthand");
            allowShortHand && self1.value instanceof AST_Symbol && is_identifier_string(self1.key, output.option("ecma") >= 2015 || output.option("safari10")) && get_name(self1.value) === self1.key && !ALL_RESERVED_WORDS.has(self1.key) ? print_property_name(self1.key, self1.quote, output) : allowShortHand && self1.value instanceof AST_DefaultAssign && self1.value.left instanceof AST_Symbol && is_identifier_string(self1.key, output.option("ecma") >= 2015 || output.option("safari10")) && get_name(self1.value.left) === self1.key ? (print_property_name(self1.key, self1.quote, output), output.space(), output.print("="), output.space(), self1.value.right.print(output)) : (self1.key instanceof AST_Node ? output.with_square(function() {
                self1.key.print(output);
            }) : print_property_name(self1.key, self1.quote, output), output.colon(), self1.value.print(output));
        }), DEFPRINT(AST_ClassPrivateProperty, (self1, output)=>{
            self1.static && (output.print("static"), output.space()), output.print("#"), print_property_name(self1.key.name, self1.quote, output), self1.value && (output.print("="), self1.value.print(output)), output.semicolon();
        }), DEFPRINT(AST_ClassProperty, (self1, output)=>{
            self1.static && (output.print("static"), output.space()), self1.key instanceof AST_SymbolClassProperty ? print_property_name(self1.key.name, self1.quote, output) : (output.print("["), self1.key.print(output), output.print("]")), self1.value && (output.print("="), self1.value.print(output)), output.semicolon();
        }), AST_ObjectProperty.DEFMETHOD("_print_getter_setter", function(type, is_private, output) {
            var self1 = this;
            self1.static && (output.print("static"), output.space()), type && (output.print(type), output.space()), self1.key instanceof AST_SymbolMethod ? (is_private && output.print("#"), print_property_name(self1.key.name, self1.quote, output)) : output.with_square(function() {
                self1.key.print(output);
            }), self1.value._do_print(output, !0);
        }), DEFPRINT(AST_ObjectSetter, function(self1, output) {
            self1._print_getter_setter("set", !1, output);
        }), DEFPRINT(AST_ObjectGetter, function(self1, output) {
            self1._print_getter_setter("get", !1, output);
        }), DEFPRINT(AST_PrivateSetter, function(self1, output) {
            self1._print_getter_setter("set", !0, output);
        }), DEFPRINT(AST_PrivateGetter, function(self1, output) {
            self1._print_getter_setter("get", !0, output);
        }), DEFPRINT(AST_PrivateMethod, function(self1, output) {
            var type;
            self1.is_generator && self1.async ? type = "async*" : self1.is_generator ? type = "*" : self1.async && (type = "async"), self1._print_getter_setter(type, !0, output);
        }), DEFPRINT(AST_ConciseMethod, function(self1, output) {
            var type;
            self1.is_generator && self1.async ? type = "async*" : self1.is_generator ? type = "*" : self1.async && (type = "async"), self1._print_getter_setter(type, !1, output);
        }), AST_Symbol.DEFMETHOD("_do_print", function(output) {
            var def = this.definition();
            output.print_name(def ? def.mangled_name || def.name : this.name);
        }), DEFPRINT(AST_Symbol, function(self1, output) {
            self1._do_print(output);
        }), DEFPRINT(AST_Hole, noop), DEFPRINT(AST_This, function(self1, output) {
            output.print("this");
        }), DEFPRINT(AST_Super, function(self1, output) {
            output.print("super");
        }), DEFPRINT(AST_Constant, function(self1, output) {
            output.print(self1.getValue());
        }), DEFPRINT(AST_String, function(self1, output) {
            output.print_string(self1.getValue(), self1.quote, output.in_directive);
        }), DEFPRINT(AST_Number, function(self1, output) {
            (output.option("keep_numbers") || output.use_asm) && self1.raw ? output.print(self1.raw) : output.print(make_num(self1.getValue()));
        }), DEFPRINT(AST_BigInt, function(self1, output) {
            output.print(self1.getValue() + "n");
        });
        const r_slash_script = /(<\s*\/\s*script)/i, slash_script_replace = (_, $1)=>$1.replace("/", "\\/");
        function force_statement(stat, output) {
            output.option("braces") ? make_block(stat, output) : !stat || stat instanceof AST_EmptyStatement ? output.force_semicolon() : stat.print(output);
        }
        function make_num(num) {
            var match, len, digits, str = num.toString(10).replace(/^0\./, ".").replace("e+", "e"), candidates = [
                str
            ];
            return Math.floor(num) === num && (num < 0 ? candidates.push("-0x" + (-num).toString(16).toLowerCase()) : candidates.push("0x" + num.toString(16).toLowerCase())), (match = /^\.0+/.exec(str)) ? (len = match[0].length, digits = str.slice(len), candidates.push(digits + "e-" + (digits.length + len - 1))) : (match = /0+$/.exec(str)) ? (len = match[0].length, candidates.push(str.slice(0, -len) + "e" + len)) : (match = /^(\d)\.(\d+)e(-?\d+)$/.exec(str)) && candidates.push(match[1] + match[2] + "e" + (match[3] - match[2].length)), function(a) {
                for(var best = a[0], len = best.length, i = 1; i < a.length; ++i)a[i].length < len && (len = (best = a[i]).length);
                return best;
            }(candidates);
        }
        function make_block(stmt, output) {
            !stmt || stmt instanceof AST_EmptyStatement ? output.print("{}") : stmt instanceof AST_BlockStatement ? stmt.print(output) : output.with_block(function() {
                output.indent(), stmt.print(output), output.newline();
            });
        }
        /* -----[ source map generators ]----- */ function DEFMAP(nodetype, generator) {
            nodetype.forEach(function(nodetype) {
                nodetype.DEFMETHOD("add_source_map", generator);
            });
        }
        DEFPRINT(AST_RegExp, function(self1, output) {
            let { source, flags } = self1.getValue();
            source = regexp_source_fix(source), flags = flags ? function(flags) {
                const existing_flags = new Set(flags.split(""));
                let out = "";
                for (const flag of "gimuy")existing_flags.has(flag) && (out += flag, existing_flags.delete(flag));
                return existing_flags.size && // Flags Terser doesn't know about
                existing_flags.forEach((flag)=>{
                    out += flag;
                }), out;
            }(flags) : "", source = source.replace(r_slash_script, slash_script_replace), output.print(output.to_utf8(`/${source}/${flags}`, !1, !0));
            const parent = output.parent();
            parent instanceof AST_Binary && /^\w/.test(parent.operator) && parent.left === self1 && output.print(" ");
        }), DEFMAP([
            // We could easily add info for ALL nodes, but it seems to me that
            // would be quite wasteful, hence this noop in the base class.
            AST_Node,
            // since the label symbol will mark it
            AST_LabeledStatement,
            AST_Toplevel
        ], noop), // XXX: I'm not exactly sure if we need it for all of these nodes,
        // or if we should add even more.
        DEFMAP([
            AST_Array,
            AST_BlockStatement,
            AST_Catch,
            AST_Class,
            AST_Constant,
            AST_Debugger,
            AST_Definitions,
            AST_Directive,
            AST_Finally,
            AST_Jump,
            AST_Lambda,
            AST_New,
            AST_Object,
            AST_StatementWithBody,
            AST_Symbol,
            AST_Switch,
            AST_SwitchBranch,
            AST_TemplateString,
            AST_TemplateSegment,
            AST_Try
        ], function(output) {
            output.add_mapping(this.start);
        }), DEFMAP([
            AST_ObjectGetter,
            AST_ObjectSetter,
            AST_PrivateGetter,
            AST_PrivateSetter
        ], function(output) {
            output.add_mapping(this.key.end, this.key.name);
        }), DEFMAP([
            AST_ObjectProperty
        ], function(output) {
            output.add_mapping(this.start, this.key);
        });
    }();
    const shallow_cmp = (node1, node2)=>null === node1 && null === node2 || node1.TYPE === node2.TYPE && node1.shallow_cmp(node2), equivalent_to = (tree1, tree2)=>{
        if (!shallow_cmp(tree1, tree2)) return !1;
        const walk_1_state = [
            tree1
        ], walk_2_state = [
            tree2
        ], walk_1_push = walk_1_state.push.bind(walk_1_state), walk_2_push = walk_2_state.push.bind(walk_2_state);
        for(; walk_1_state.length && walk_2_state.length;){
            const node_1 = walk_1_state.pop(), node_2 = walk_2_state.pop();
            if (!shallow_cmp(node_1, node_2) || (node_1._children_backwards(walk_1_push), node_2._children_backwards(walk_2_push), walk_1_state.length !== walk_2_state.length)) return !1;
        }
        return 0 == walk_1_state.length && 0 == walk_2_state.length;
    }, mkshallow = (props)=>Function("other", "return " + Object.keys(props).map((key)=>{
            if ("eq" === props[key]) return `this.${key} === other.${key}`;
            if ("exist" === props[key]) return `(this.${key} == null ? other.${key} == null : this.${key} === other.${key})`;
            throw Error(`mkshallow: Unexpected instruction: ${props[key]}`);
        }).join(" && ")), pass_through = ()=>!0;
    AST_Node.prototype.shallow_cmp = function() {
        throw Error("did not find a shallow_cmp function for " + this.constructor.name);
    }, AST_Debugger.prototype.shallow_cmp = pass_through, AST_Directive.prototype.shallow_cmp = mkshallow({
        value: "eq"
    }), AST_SimpleStatement.prototype.shallow_cmp = pass_through, AST_Block.prototype.shallow_cmp = pass_through, AST_EmptyStatement.prototype.shallow_cmp = pass_through, AST_LabeledStatement.prototype.shallow_cmp = mkshallow({
        "label.name": "eq"
    }), AST_Do.prototype.shallow_cmp = pass_through, AST_While.prototype.shallow_cmp = pass_through, AST_For.prototype.shallow_cmp = mkshallow({
        init: "exist",
        condition: "exist",
        step: "exist"
    }), AST_ForIn.prototype.shallow_cmp = pass_through, AST_ForOf.prototype.shallow_cmp = pass_through, AST_With.prototype.shallow_cmp = pass_through, AST_Toplevel.prototype.shallow_cmp = pass_through, AST_Expansion.prototype.shallow_cmp = pass_through, AST_Lambda.prototype.shallow_cmp = mkshallow({
        is_generator: "eq",
        async: "eq"
    }), AST_Destructuring.prototype.shallow_cmp = mkshallow({
        is_array: "eq"
    }), AST_PrefixedTemplateString.prototype.shallow_cmp = pass_through, AST_TemplateString.prototype.shallow_cmp = pass_through, AST_TemplateSegment.prototype.shallow_cmp = mkshallow({
        value: "eq"
    }), AST_Jump.prototype.shallow_cmp = pass_through, AST_LoopControl.prototype.shallow_cmp = pass_through, AST_Await.prototype.shallow_cmp = pass_through, AST_Yield.prototype.shallow_cmp = mkshallow({
        is_star: "eq"
    }), AST_If.prototype.shallow_cmp = mkshallow({
        alternative: "exist"
    }), AST_Switch.prototype.shallow_cmp = pass_through, AST_SwitchBranch.prototype.shallow_cmp = pass_through, AST_Try.prototype.shallow_cmp = mkshallow({
        bcatch: "exist",
        bfinally: "exist"
    }), AST_Catch.prototype.shallow_cmp = mkshallow({
        argname: "exist"
    }), AST_Finally.prototype.shallow_cmp = pass_through, AST_Definitions.prototype.shallow_cmp = pass_through, AST_VarDef.prototype.shallow_cmp = mkshallow({
        value: "exist"
    }), AST_NameMapping.prototype.shallow_cmp = pass_through, AST_Import.prototype.shallow_cmp = mkshallow({
        imported_name: "exist",
        imported_names: "exist"
    }), AST_ImportMeta.prototype.shallow_cmp = pass_through, AST_Export.prototype.shallow_cmp = mkshallow({
        exported_definition: "exist",
        exported_value: "exist",
        exported_names: "exist",
        module_name: "eq",
        is_default: "eq"
    }), AST_Call.prototype.shallow_cmp = pass_through, AST_Sequence.prototype.shallow_cmp = pass_through, AST_PropAccess.prototype.shallow_cmp = pass_through, AST_Chain.prototype.shallow_cmp = pass_through, AST_Dot.prototype.shallow_cmp = mkshallow({
        property: "eq"
    }), AST_DotHash.prototype.shallow_cmp = mkshallow({
        property: "eq"
    }), AST_Unary.prototype.shallow_cmp = mkshallow({
        operator: "eq"
    }), AST_Binary.prototype.shallow_cmp = mkshallow({
        operator: "eq"
    }), AST_Conditional.prototype.shallow_cmp = pass_through, AST_Array.prototype.shallow_cmp = pass_through, AST_Object.prototype.shallow_cmp = pass_through, AST_ObjectProperty.prototype.shallow_cmp = pass_through, AST_ObjectKeyVal.prototype.shallow_cmp = mkshallow({
        key: "eq"
    }), AST_ObjectSetter.prototype.shallow_cmp = mkshallow({
        static: "eq"
    }), AST_ObjectGetter.prototype.shallow_cmp = mkshallow({
        static: "eq"
    }), AST_ConciseMethod.prototype.shallow_cmp = mkshallow({
        static: "eq",
        is_generator: "eq",
        async: "eq"
    }), AST_Class.prototype.shallow_cmp = mkshallow({
        name: "exist",
        extends: "exist"
    }), AST_ClassProperty.prototype.shallow_cmp = mkshallow({
        static: "eq"
    }), AST_Symbol.prototype.shallow_cmp = mkshallow({
        name: "eq"
    }), AST_NewTarget.prototype.shallow_cmp = pass_through, AST_This.prototype.shallow_cmp = pass_through, AST_Super.prototype.shallow_cmp = pass_through, AST_String.prototype.shallow_cmp = mkshallow({
        value: "eq"
    }), AST_Number.prototype.shallow_cmp = mkshallow({
        value: "eq"
    }), AST_BigInt.prototype.shallow_cmp = mkshallow({
        value: "eq"
    }), AST_RegExp.prototype.shallow_cmp = function(other) {
        return this.value.flags === other.value.flags && this.value.source === other.value.source;
    }, AST_Atom.prototype.shallow_cmp = pass_through;
    let function_defs = null, unmangleable_names = null;
    class SymbolDef {
        constructor(scope, orig, init){
            this.name = orig.name, this.orig = [
                orig
            ], this.init = init, this.eliminated = 0, this.assignments = 0, this.scope = scope, this.replaced = 0, this.global = !1, this.export = 0, this.mangled_name = null, this.undeclared = !1, this.id = SymbolDef.next_id++, this.chained = !1, this.direct_access = !1, this.escaped = 0, this.recursive_refs = 0, this.references = [], this.should_replace = void 0, this.single_use = !1, this.fixed = !1, Object.seal(this);
        }
        fixed_value() {
            return !this.fixed || this.fixed instanceof AST_Node ? this.fixed : this.fixed();
        }
        unmangleable(options) {
            return options || (options = {}), !!(function_defs && function_defs.has(this.id) && keep_name(options.keep_fnames, this.orig[0].name)) || this.global && !options.toplevel || 1 & this.export || this.undeclared || !options.eval && this.scope.pinned() || (this.orig[0] instanceof AST_SymbolLambda || this.orig[0] instanceof AST_SymbolDefun) && keep_name(options.keep_fnames, this.orig[0].name) || this.orig[0] instanceof AST_SymbolMethod || (this.orig[0] instanceof AST_SymbolClass || this.orig[0] instanceof AST_SymbolDefClass) && keep_name(options.keep_classnames, this.orig[0].name);
        }
        mangle(options) {
            const cache = options.cache && options.cache.props;
            if (this.global && cache && cache.has(this.name)) this.mangled_name = cache.get(this.name);
            else if (!this.mangled_name && !this.unmangleable(options)) {
                var s = this.scope, sym = this.orig[0];
                options.ie8 && sym instanceof AST_SymbolLambda && (s = s.parent_scope);
                const redefinition = redefined_catch_def(this);
                this.mangled_name = redefinition ? redefinition.mangled_name || redefinition.name : s.next_mangled(options, this), this.global && cache && cache.set(this.name, this.mangled_name);
            }
        }
    }
    function redefined_catch_def(def) {
        if (def.orig[0] instanceof AST_SymbolCatch && def.scope.is_block_scope()) return def.scope.get_defun_scope().variables.get(def.name);
    }
    function next_mangled(scope, options) {
        var ext = scope.enclosed, nth_identifier = options.nth_identifier;
        out: for(;;){
            var m = nth_identifier.get(++scope.cname);
            if (!(ALL_RESERVED_WORDS.has(m) || options.reserved.has(m)) && !(unmangleable_names && unmangleable_names.has(m))) {
                // we must ensure that the mangled name does not shadow a name
                // from some parent scope that is referenced in this or in
                // inner scopes.
                for(let i = ext.length; --i >= 0;){
                    const def = ext[i];
                    if (m == (def.mangled_name || def.unmangleable(options) && def.name)) continue out;
                }
                return m;
            } // skip over "do"
        }
    }
    SymbolDef.next_id = 1, AST_Scope.DEFMETHOD("figure_out_scope", function(options, { parent_scope = null, toplevel = this } = {}) {
        if (options = defaults(options, {
            cache: null,
            ie8: !1,
            safari10: !1
        }), !(toplevel instanceof AST_Toplevel)) throw Error("Invalid toplevel scope");
        // pass 1: setup scope chaining and handle definitions
        var scope = this.parent_scope = parent_scope, labels = new Map(), defun = null, in_destructuring = null, for_scopes = [], tw = new TreeWalker((node, descend)=>{
            if (node.is_block_scope()) {
                const save_scope = scope;
                node.block_scope = scope = new AST_Scope(node), scope._block_scope = !0;
                // AST_Try in the AST sadly *is* (not has) a body itself,
                // and its catch and finally branches are children of the AST_Try itself
                const parent_scope = node instanceof AST_Catch ? save_scope.parent_scope : save_scope;
                if (scope.init_scope_vars(parent_scope), scope.uses_with = save_scope.uses_with, scope.uses_eval = save_scope.uses_eval, options.safari10 && (node instanceof AST_For || node instanceof AST_ForIn) && for_scopes.push(scope), node instanceof AST_Switch) {
                    // XXX: HACK! Ensure the switch expression gets the correct scope (the parent scope) and the body gets the contained scope
                    // AST_Switch has a scope within the body, but it itself "is a block scope"
                    // This means the switched expression has to belong to the outer scope
                    // while the body inside belongs to the switch itself.
                    // This is pretty nasty and warrants an AST change similar to AST_Try (read above)
                    const the_block_scope = scope;
                    scope = save_scope, node.expression.walk(tw), scope = the_block_scope;
                    for(let i = 0; i < node.body.length; i++)node.body[i].walk(tw);
                } else descend();
                return scope = save_scope, !0;
            }
            if (node instanceof AST_Destructuring) {
                const save_destructuring = in_destructuring;
                return in_destructuring = node, descend(), in_destructuring = save_destructuring, !0;
            }
            if (node instanceof AST_Scope) {
                node.init_scope_vars(scope);
                var def, save_scope = scope, save_defun = defun, save_labels = labels;
                return defun = scope = node, labels = new Map(), descend(), scope = save_scope, defun = save_defun, labels = save_labels, !0; // don't descend again in TreeWalker
            }
            if (node instanceof AST_LabeledStatement) {
                var l = node.label;
                if (labels.has(l.name)) throw Error(string_template("Label {name} defined twice", l));
                return labels.set(l.name, l), descend(), labels.delete(l.name), !0; // no descend again
            }
            if (node instanceof AST_With) {
                for(var s = scope; s; s = s.parent_scope)s.uses_with = !0;
                return;
            }
            if (node instanceof AST_Symbol && (node.scope = scope), node instanceof AST_Label && (node.thedef = node, node.references = []), node instanceof AST_SymbolLambda) defun.def_function(node, "arguments" == node.name ? void 0 : defun);
            else if (node instanceof AST_SymbolDefun) {
                // Careful here, the scope where this should be defined is
                // the parent scope.  The reason is that we enter a new
                // scope when we encounter the AST_Defun node (which is
                // instanceof AST_Scope) but we get to the symbol a bit
                // later.
                const closest_scope = defun.parent_scope;
                // In strict mode, function definitions are block-scoped
                node.scope = tw.directives["use strict"] ? closest_scope : closest_scope.get_defun_scope(), mark_export(node.scope.def_function(node, defun), 1);
            } else if (node instanceof AST_SymbolClass) mark_export(defun.def_variable(node, defun), 1);
            else if (node instanceof AST_SymbolImport) scope.def_variable(node);
            else if (node instanceof AST_SymbolDefClass) // This deals with the name of the class being available
            // inside the class.
            mark_export((node.scope = defun.parent_scope).def_function(node, defun), 1);
            else if (node instanceof AST_SymbolVar || node instanceof AST_SymbolLet || node instanceof AST_SymbolConst || node instanceof AST_SymbolCatch) {
                if ((def = node instanceof AST_SymbolBlockDeclaration ? scope.def_variable(node, null) : defun.def_variable(node, "SymbolVar" == node.TYPE ? null : void 0)).orig.every((sym)=>sym === node || (node instanceof AST_SymbolBlockDeclaration ? sym instanceof AST_SymbolLambda : !(sym instanceof AST_SymbolLet || sym instanceof AST_SymbolConst))) || js_error(`"${node.name}" is redeclared`, node.start.file, node.start.line, node.start.col, node.start.pos), node instanceof AST_SymbolFunarg || mark_export(def, 2), defun !== scope) {
                    node.mark_enclosed();
                    var def = scope.find_variable(node);
                    node.thedef !== def && (node.thedef = def, node.reference());
                }
            } else if (node instanceof AST_LabelRef) {
                var sym = labels.get(node.name);
                if (!sym) throw Error(string_template("Undefined label {name} [{line},{col}]", {
                    name: node.name,
                    line: node.start.line,
                    col: node.start.col
                }));
                node.thedef = sym;
            }
            !(scope instanceof AST_Toplevel) && (node instanceof AST_Export || node instanceof AST_Import) && js_error(`"${node.TYPE}" statement may only appear at the top level`, node.start.file, node.start.line, node.start.col, node.start.pos);
        });
        function mark_export(def, level) {
            if (in_destructuring) {
                var i = 0;
                do level++;
                while (tw.parent(i++) !== in_destructuring)
            }
            var node = tw.parent(level);
            if (def.export = node instanceof AST_Export ? 1 : 0) {
                var exported = node.exported_definition;
                (exported instanceof AST_Defun || exported instanceof AST_DefClass) && node.is_default && (def.export = 2);
            }
        }
        this.walk(tw), this instanceof AST_Toplevel && (this.globals = new Map());
        var tw = new TreeWalker((node)=>{
            if (node instanceof AST_LoopControl && node.label) return node.label.thedef.references.push(node), !0;
            if (node instanceof AST_SymbolRef) {
                var def, sym, name = node.name;
                if ("eval" == name && tw.parent() instanceof AST_Call) for(var s = node.scope; s && !s.uses_eval; s = s.parent_scope)s.uses_eval = !0;
                return tw.parent() instanceof AST_NameMapping && tw.parent(1).module_name || !(sym = node.scope.find_variable(name)) ? (sym = toplevel.def_global(node), node instanceof AST_SymbolExport && (sym.export = 1)) : sym.scope instanceof AST_Lambda && "arguments" == name && (sym.scope.uses_arguments = !0), node.thedef = sym, node.reference(), !node.scope.is_block_scope() || sym.orig[0] instanceof AST_SymbolBlockDeclaration || (node.scope = node.scope.get_defun_scope()), !0;
            }
            if (node instanceof AST_SymbolCatch && (def = redefined_catch_def(node.definition()))) for(var s = node.scope; s && (push_uniq(s.enclosed, def), s !== def.scope);)s = s.parent_scope;
        });
        // pass 4: add symbol definitions to loop scopes
        // Safari/Webkit bug workaround - loop init let variable shadowing argument.
        // https://github.com/mishoo/UglifyJS2/issues/1753
        // https://bugs.webkit.org/show_bug.cgi?id=171041
        if (this.walk(tw), (options.ie8 || options.safari10) && walk(this, (node)=>{
            if (node instanceof AST_SymbolCatch) {
                var name = node.name, refs = node.thedef.references, scope = node.scope.get_defun_scope(), def = scope.find_variable(name) || toplevel.globals.get(name) || scope.def_variable(node);
                return refs.forEach(function(ref) {
                    ref.thedef = def, ref.reference();
                }), node.thedef = def, node.reference(), !0;
            }
        }), options.safari10) for (const scope of for_scopes)scope.parent_scope.variables.forEach(function(def) {
            push_uniq(scope.enclosed, def);
        });
    }), AST_Toplevel.DEFMETHOD("def_global", function(node) {
        var globals = this.globals, name = node.name;
        if (globals.has(name)) return globals.get(name);
        var g = new SymbolDef(this, node);
        return g.undeclared = !0, g.global = !0, globals.set(name, g), g;
    }), AST_Scope.DEFMETHOD("init_scope_vars", function(parent_scope) {
        this.variables = new Map(), this.uses_with = !1, this.uses_eval = !1, this.parent_scope = parent_scope, this.enclosed = [], this.cname = -1;
    }), AST_Scope.DEFMETHOD("conflicting_def", function(name) {
        return this.enclosed.find((def)=>def.name === name) || this.variables.has(name) || this.parent_scope && this.parent_scope.conflicting_def(name);
    }), AST_Scope.DEFMETHOD("conflicting_def_shallow", function(name) {
        return this.enclosed.find((def)=>def.name === name) || this.variables.has(name);
    }), AST_Scope.DEFMETHOD("add_child_scope", function(scope) {
        // `scope` is going to be moved into `this` right now.
        // Update the required scopes' information
        if (scope.parent_scope === this) return;
        scope.parent_scope = this;
        // TODO uses_with, uses_eval, etc
        const scope_ancestry = (()=>{
            const ancestry = [];
            let cur = this;
            do ancestry.push(cur);
            while (cur = cur.parent_scope)
            return ancestry.reverse(), ancestry;
        })(), new_scope_enclosed_set = new Set(scope.enclosed), to_enclose = [];
        for (const scope_topdown of scope_ancestry)for (const def of (to_enclose.forEach((e)=>push_uniq(scope_topdown.enclosed, e)), scope_topdown.variables.values()))new_scope_enclosed_set.has(def) && (push_uniq(to_enclose, def), push_uniq(scope_topdown.enclosed, def));
    }), // Creates a symbol during compression
    AST_Scope.DEFMETHOD("create_symbol", function(SymClass, { source, tentative_name, scope, conflict_scopes = [
        scope
    ], init = null } = {}) {
        let symbol_name;
        if (conflict_scopes = function(scopes) {
            const found_scopes = new Set();
            for (const scope of new Set(scopes))!function bubble_up(scope) {
                null == scope || found_scopes.has(scope) || (found_scopes.add(scope), bubble_up(scope.parent_scope));
            }(scope);
            return [
                ...found_scopes
            ];
        }(conflict_scopes), tentative_name) {
            // Implement hygiene (no new names are conflicting with existing names)
            tentative_name = symbol_name = tentative_name.replace(/(?:^[^a-z_$]|[^a-z0-9_$])/ig, "_");
            let i = 0;
            for(; conflict_scopes.find((s)=>s.conflicting_def_shallow(symbol_name));)symbol_name = tentative_name + "$" + i++;
        }
        if (!symbol_name) throw Error("No symbol name could be generated in create_symbol()");
        const symbol = make_node(SymClass, source, {
            name: symbol_name,
            scope
        });
        return this.def_variable(symbol, init || null), symbol.mark_enclosed(), symbol;
    }), AST_Node.DEFMETHOD("is_block_scope", return_false), AST_Class.DEFMETHOD("is_block_scope", return_false), AST_Lambda.DEFMETHOD("is_block_scope", return_false), AST_Toplevel.DEFMETHOD("is_block_scope", return_false), AST_SwitchBranch.DEFMETHOD("is_block_scope", return_false), AST_Block.DEFMETHOD("is_block_scope", return_true), AST_Scope.DEFMETHOD("is_block_scope", function() {
        return this._block_scope || !1;
    }), AST_IterationStatement.DEFMETHOD("is_block_scope", return_true), AST_Lambda.DEFMETHOD("init_scope_vars", function() {
        AST_Scope.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1, this.def_variable(new AST_SymbolFunarg({
            name: "arguments",
            start: this.start,
            end: this.end
        }));
    }), AST_Arrow.DEFMETHOD("init_scope_vars", function() {
        AST_Scope.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1;
    }), AST_Symbol.DEFMETHOD("mark_enclosed", function() {
        for(var def = this.definition(), s = this.scope; s && (push_uniq(s.enclosed, def), s !== def.scope);)s = s.parent_scope;
    }), AST_Symbol.DEFMETHOD("reference", function() {
        this.definition().references.push(this), this.mark_enclosed();
    }), AST_Scope.DEFMETHOD("find_variable", function(name) {
        return name instanceof AST_Symbol && (name = name.name), this.variables.get(name) || this.parent_scope && this.parent_scope.find_variable(name);
    }), AST_Scope.DEFMETHOD("def_function", function(symbol, init) {
        var def = this.def_variable(symbol, init);
        return (!def.init || def.init instanceof AST_Defun) && (def.init = init), def;
    }), AST_Scope.DEFMETHOD("def_variable", function(symbol, init) {
        var def = this.variables.get(symbol.name);
        return def ? (def.orig.push(symbol), def.init && (def.scope !== symbol.scope || def.init instanceof AST_Function) && (def.init = init)) : (def = new SymbolDef(this, symbol, init), this.variables.set(symbol.name, def), def.global = !this.parent_scope), symbol.thedef = def;
    }), AST_Scope.DEFMETHOD("next_mangled", function(options) {
        return next_mangled(this, options);
    }), AST_Toplevel.DEFMETHOD("next_mangled", function(options) {
        let name;
        const mangled_names = this.mangled_names;
        do name = next_mangled(this, options);
        while (mangled_names.has(name))
        return name;
    }), AST_Function.DEFMETHOD("next_mangled", function(options, def) {
        for(// #179, #326
        // in Safari strict mode, something like (function x(x){...}) is a syntax error;
        // a function expression's argument cannot shadow the function expression's name
        var tricky_def = def.orig[0] instanceof AST_SymbolFunarg && this.name && this.name.definition(), tricky_name = tricky_def ? tricky_def.mangled_name || tricky_def.name : null;;){
            var name = next_mangled(this, options);
            if (!tricky_name || tricky_name != name) return name;
        }
    }), AST_Symbol.DEFMETHOD("unmangleable", function(options) {
        var def = this.definition();
        return !def || def.unmangleable(options);
    }), // labels are always mangleable
    AST_Label.DEFMETHOD("unmangleable", return_false), AST_Symbol.DEFMETHOD("unreferenced", function() {
        return !this.definition().references.length && !this.scope.pinned();
    }), AST_Symbol.DEFMETHOD("definition", function() {
        return this.thedef;
    }), AST_Symbol.DEFMETHOD("global", function() {
        return this.thedef.global;
    }), AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options) {
        return (options = defaults(options, {
            eval: !1,
            nth_identifier: base54,
            ie8: !1,
            keep_classnames: !1,
            keep_fnames: !1,
            module: !1,
            reserved: [],
            toplevel: !1
        })).module && (options.toplevel = !0), Array.isArray(options.reserved) || options.reserved instanceof Set || (options.reserved = []), options.reserved = new Set(options.reserved), // Never mangle arguments
        options.reserved.add("arguments"), options;
    }), AST_Toplevel.DEFMETHOD("mangle_names", function(options) {
        var nth_identifier = (options = this._default_mangler_options(options)).nth_identifier, lname = -1, to_mangle = [];
        options.keep_fnames && (function_defs = new Set());
        const mangled_names = this.mangled_names = new Set();
        unmangleable_names = new Set(), options.cache && (this.globals.forEach(collect), options.cache.props && options.cache.props.forEach(function(mangled_name) {
            mangled_names.add(mangled_name);
        }));
        var tw = new TreeWalker(function(node, descend) {
            if (node instanceof AST_LabeledStatement) {
                // lname is incremented when we get to the AST_Label
                var save_nesting = lname;
                return descend(), lname = save_nesting, !0; // don't descend again in TreeWalker
            }
            if (node instanceof AST_Scope) {
                node.variables.forEach(collect);
                return;
            }
            if (node.is_block_scope()) {
                node.block_scope.variables.forEach(collect);
                return;
            }
            if (function_defs && node instanceof AST_VarDef && node.value instanceof AST_Lambda && !node.value.name && keep_name(options.keep_fnames, node.name.name)) {
                function_defs.add(node.name.definition().id);
                return;
            }
            if (node instanceof AST_Label) {
                let name;
                do name = nth_identifier.get(++lname);
                while (ALL_RESERVED_WORDS.has(name))
                return node.mangled_name = name, !0;
            }
            if (!(options.ie8 || options.safari10) && node instanceof AST_SymbolCatch) {
                to_mangle.push(node.definition());
                return;
            }
        });
        function collect(symbol) {
            1 & symbol.export ? unmangleable_names.add(symbol.name) : options.reserved.has(symbol.name) || to_mangle.push(symbol);
        }
        this.walk(tw), (options.keep_fnames || options.keep_classnames) && // Collect a set of short names which are unmangleable,
        // for use in avoiding collisions in next_mangled.
        to_mangle.forEach((def)=>{
            def.name.length < 6 && def.unmangleable(options) && unmangleable_names.add(def.name);
        }), to_mangle.forEach((def)=>{
            def.mangle(options);
        }), function_defs = null, unmangleable_names = null;
    }), AST_Toplevel.DEFMETHOD("find_colliding_names", function(options) {
        const cache = options.cache && options.cache.props, avoid = new Set();
        return options.reserved.forEach(to_avoid), this.globals.forEach(add_def), this.walk(new TreeWalker(function(node) {
            node instanceof AST_Scope && node.variables.forEach(add_def), node instanceof AST_SymbolCatch && add_def(node.definition());
        })), avoid;
        function to_avoid(name) {
            avoid.add(name);
        }
        function add_def(def) {
            var name = def.name;
            if (def.global && cache && cache.has(name)) name = cache.get(name);
            else if (!def.unmangleable(options)) return;
            to_avoid(name);
        }
    }), AST_Toplevel.DEFMETHOD("expand_names", function(options) {
        var nth_identifier = (options = this._default_mangler_options(options)).nth_identifier;
        nth_identifier.reset && nth_identifier.sort && (nth_identifier.reset(), nth_identifier.sort());
        var avoid = this.find_colliding_names(options), cname = 0;
        function rename(def) {
            if (def.global && options.cache || def.unmangleable(options) || options.reserved.has(def.name)) return;
            const redefinition = redefined_catch_def(def), name = def.name = redefinition ? redefinition.name : function() {
                var name;
                do name = nth_identifier.get(cname++);
                while (avoid.has(name) || ALL_RESERVED_WORDS.has(name))
                return name;
            }();
            def.orig.forEach(function(sym) {
                sym.name = name;
            }), def.references.forEach(function(sym) {
                sym.name = name;
            });
        }
        this.globals.forEach(rename), this.walk(new TreeWalker(function(node) {
            node instanceof AST_Scope && node.variables.forEach(rename), node instanceof AST_SymbolCatch && rename(node.definition());
        }));
    }), AST_Node.DEFMETHOD("tail_node", return_this), AST_Sequence.DEFMETHOD("tail_node", function() {
        return this.expressions[this.expressions.length - 1];
    }), AST_Toplevel.DEFMETHOD("compute_char_frequency", function(options) {
        var nth_identifier = (options = this._default_mangler_options(options)).nth_identifier;
        if (nth_identifier.reset && nth_identifier.consider && nth_identifier.sort) {
            nth_identifier.reset();
            try {
                AST_Node.prototype.print = function(stream, force_parens) {
                    this._print(stream, force_parens), this instanceof AST_Symbol && !this.unmangleable(options) ? nth_identifier.consider(this.name, -1) : options.properties && (this instanceof AST_DotHash ? nth_identifier.consider("#" + this.property, -1) : this instanceof AST_Dot ? nth_identifier.consider(this.property, -1) : this instanceof AST_Sub && function skip_string(node) {
                        node instanceof AST_String ? nth_identifier.consider(node.value, -1) : node instanceof AST_Conditional ? (skip_string(node.consequent), skip_string(node.alternative)) : node instanceof AST_Sequence && skip_string(node.tail_node());
                    }(this.property));
                }, nth_identifier.consider(this.print_to_string(), 1);
            } finally{
                AST_Node.prototype.print = AST_Node.prototype._print;
            }
            nth_identifier.sort();
        }
    });
    const base54 = (()=>{
        let chars, frequency;
        const leading = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_".split(""), digits = "0123456789".split("");
        function reset() {
            frequency = new Map(), leading.forEach(function(ch) {
                frequency.set(ch, 0);
            }), digits.forEach(function(ch) {
                frequency.set(ch, 0);
            });
        }
        function compare(a, b) {
            return frequency.get(b) - frequency.get(a);
        }
        function sort() {
            chars = mergeSort(leading, compare).concat(mergeSort(digits, compare));
        }
        return(// Ensure this is in a usable initial state.
        reset(), sort(), {
            get: function(num) {
                var ret = "", base = 54;
                num++;
                do ret += chars[--num % base], num = Math.floor(num / base), base = 64;
                while (num > 0)
                return ret;
            },
            consider: function(str, delta) {
                for(var i = str.length; --i >= 0;)frequency.set(str[i], frequency.get(str[i]) + delta);
            },
            reset,
            sort
        });
    })();
    AST_Node.prototype.size = function(compressor, stack) {
        mangle_options = compressor && compressor.mangle_options;
        let size = 0;
        return walk_parent(this, (node, info)=>{
            // Braceless arrow functions have fake "return" statements
            if (size += node._size(info), node instanceof AST_Arrow && node.is_braceless()) return size += node.body[0].value._size(info), !0;
        }, stack || compressor && compressor.stack), // just to save a bit of memory
        mangle_options = void 0, size;
    }, AST_Node.prototype._size = ()=>0, AST_Debugger.prototype._size = ()=>8, AST_Directive.prototype._size = function() {
        // TODO string encoding stuff
        return 2 + this.value.length;
    };
    const list_overhead = (array)=>array.length && array.length - 1;
    AST_Block.prototype._size = function() {
        return 2 + list_overhead(this.body);
    }, AST_Toplevel.prototype._size = function() {
        return list_overhead(this.body);
    }, AST_EmptyStatement.prototype._size = ()=>1, AST_LabeledStatement.prototype._size = ()=>2, AST_Do.prototype._size = ()=>9, AST_While.prototype._size = ()=>7, AST_For.prototype._size = ()=>8, AST_ForIn.prototype._size = ()=>8, // AST_ForOf inherits ^
    AST_With.prototype._size = ()=>6, AST_Expansion.prototype._size = ()=>3;
    const lambda_modifiers = (func)=>(func.is_generator ? 1 : 0) + (func.async ? 6 : 0);
    AST_Accessor.prototype._size = function() {
        return lambda_modifiers(this) + 4 + list_overhead(this.argnames) + list_overhead(this.body);
    }, AST_Function.prototype._size = function(info) {
        return 2 * !!first_in_statement(info) + lambda_modifiers(this) + 12 + list_overhead(this.argnames) + list_overhead(this.body);
    }, AST_Defun.prototype._size = function() {
        return lambda_modifiers(this) + 13 + list_overhead(this.argnames) + list_overhead(this.body);
    }, AST_Arrow.prototype._size = function() {
        let args_and_arrow = 2 + list_overhead(this.argnames);
        1 === this.argnames.length && this.argnames[0] instanceof AST_Symbol || (args_and_arrow += 2);
        const body_overhead = this.is_braceless() ? 0 : list_overhead(this.body) + 2;
        return lambda_modifiers(this) + args_and_arrow + body_overhead;
    }, AST_Destructuring.prototype._size = ()=>2, AST_TemplateString.prototype._size = function() {
        return 2 + 3 * Math.floor(this.segments.length / 2); /* "${}" */ 
    }, AST_TemplateSegment.prototype._size = function() {
        return this.value.length;
    }, AST_Return.prototype._size = function() {
        return this.value ? 7 : 6;
    }, AST_Throw.prototype._size = ()=>6, AST_Break.prototype._size = function() {
        return this.label ? 6 : 5;
    }, AST_Continue.prototype._size = function() {
        return this.label ? 9 : 8;
    }, AST_If.prototype._size = ()=>4, AST_Switch.prototype._size = function() {
        return 8 + list_overhead(this.body);
    }, AST_Case.prototype._size = function() {
        return 5 + list_overhead(this.body);
    }, AST_Default.prototype._size = function() {
        return 8 + list_overhead(this.body);
    }, AST_Try.prototype._size = function() {
        return 3 + list_overhead(this.body);
    }, AST_Catch.prototype._size = function() {
        let size = 7 + list_overhead(this.body);
        return this.argname && (size += 2), size;
    }, AST_Finally.prototype._size = function() {
        return 7 + list_overhead(this.body);
    };
    /*#__INLINE__*/ const def_size = (size, def)=>size + list_overhead(def.definitions);
    AST_Var.prototype._size = function() {
        return def_size(4, this);
    }, AST_Let.prototype._size = function() {
        return def_size(4, this);
    }, AST_Const.prototype._size = function() {
        return def_size(6, this);
    }, AST_VarDef.prototype._size = function() {
        return this.value ? 1 : 0;
    }, AST_NameMapping.prototype._size = function() {
        // foreign name isn't mangled
        return this.name ? 4 : 0;
    }, AST_Import.prototype._size = function() {
        // import
        let size = 6;
        return this.imported_name && (size += 1), (this.imported_name || this.imported_names) && (size += 5), this.imported_names && (size += 2 + list_overhead(this.imported_names)), size;
    }, AST_ImportMeta.prototype._size = ()=>11, AST_Export.prototype._size = function() {
        let size = 7 + (this.is_default ? 8 : 0);
        return this.exported_value && (size += this.exported_value._size()), this.exported_names && // Braces and commas
        (size += 2 + list_overhead(this.exported_names)), this.module_name && // "from "
        (size += 5), size;
    }, AST_Call.prototype._size = function() {
        return this.optional ? 4 + list_overhead(this.args) : 2 + list_overhead(this.args);
    }, AST_New.prototype._size = function() {
        return 6 + list_overhead(this.args);
    }, AST_Sequence.prototype._size = function() {
        return list_overhead(this.expressions);
    }, AST_Dot.prototype._size = function() {
        return this.optional ? this.property.length + 2 : this.property.length + 1;
    }, AST_DotHash.prototype._size = function() {
        return this.optional ? this.property.length + 3 : this.property.length + 2;
    }, AST_Sub.prototype._size = function() {
        return this.optional ? 4 : 2;
    }, AST_Unary.prototype._size = function() {
        return "typeof" === this.operator ? 7 : "void" === this.operator ? 5 : this.operator.length;
    }, AST_Binary.prototype._size = function(info) {
        if ("in" === this.operator) return 4;
        let size = this.operator.length;
        return ("+" === this.operator || "-" === this.operator) && this.right instanceof AST_Unary && this.right.operator === this.operator && // 1+ +a > needs space between the +
        (size += 1), this.needs_parens(info) && (size += 2), size;
    }, AST_Conditional.prototype._size = ()=>3, AST_Array.prototype._size = function() {
        return 2 + list_overhead(this.elements);
    }, AST_Object.prototype._size = function(info) {
        let base = 2;
        return first_in_statement(info) && (base += 2), base + list_overhead(this.properties);
    };
    /*#__INLINE__*/ const key_size = (key)=>"string" == typeof key ? key.length : 0;
    AST_ObjectKeyVal.prototype._size = function() {
        return key_size(this.key) + 1;
    };
    /*#__INLINE__*/ const static_size = (is_static)=>is_static ? 7 : 0;
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function merge_sequence(array, node) {
        return node instanceof AST_Sequence ? array.push(...node.expressions) : array.push(node), array;
    }
    function make_sequence(orig, expressions) {
        if (1 == expressions.length) return expressions[0];
        if (0 == expressions.length) throw Error("trying to create a sequence with length zero!");
        return make_node(AST_Sequence, orig, {
            expressions: expressions.reduce(merge_sequence, [])
        });
    }
    function make_node_from_constant(val, orig) {
        switch(typeof val){
            case "string":
                return make_node(AST_String, orig, {
                    value: val
                });
            case "number":
                if (isNaN(val)) return make_node(AST_NaN, orig);
                if (isFinite(val)) return 1 / val < 0 ? make_node(AST_UnaryPrefix, orig, {
                    operator: "-",
                    expression: make_node(AST_Number, orig, {
                        value: -val
                    })
                }) : make_node(AST_Number, orig, {
                    value: val
                });
                return val < 0 ? make_node(AST_UnaryPrefix, orig, {
                    operator: "-",
                    expression: make_node(AST_Infinity, orig)
                }) : make_node(AST_Infinity, orig);
            case "boolean":
                return make_node(val ? AST_True : AST_False, orig);
            case "undefined":
                return make_node(AST_Undefined, orig);
            default:
                if (null === val) return make_node(AST_Null, orig, {
                    value: null
                });
                if (val instanceof RegExp) return make_node(AST_RegExp, orig, {
                    value: {
                        source: regexp_source_fix(val.source),
                        flags: val.flags
                    }
                });
                throw Error(string_template("Can't handle constant of type: {type}", {
                    type: typeof val
                }));
        }
    }
    function best_of_expression(ast1, ast2) {
        return ast1.size() > ast2.size() ? ast2 : ast1;
    }
    /** Find which node is smaller, and return that */ function best_of(compressor, ast1, ast2) {
        return first_in_statement(compressor) ? best_of_expression(make_node(AST_SimpleStatement, ast1, {
            body: ast1
        }), make_node(AST_SimpleStatement, ast2, {
            body: ast2
        })).body : best_of_expression(ast1, ast2);
    }
    /** Simplify an object property's key, if possible */ function get_simple_key(key) {
        return key instanceof AST_Constant ? key.getValue() : key instanceof AST_UnaryPrefix && "void" == key.operator && key.expression instanceof AST_Constant ? void 0 : key;
    }
    function read_property(obj, key) {
        if (!((key = get_simple_key(key)) instanceof AST_Node)) {
            if (obj instanceof AST_Array) {
                var value, elements = obj.elements;
                if ("length" == key) return make_node_from_constant(elements.length, obj);
                "number" == typeof key && key in elements && (value = elements[key]);
            } else if (obj instanceof AST_Object) {
                key = "" + key;
                for(var props = obj.properties, i = props.length; --i >= 0;){
                    if (!(props[i] instanceof AST_ObjectKeyVal)) return;
                    value || props[i].key !== key || (value = props[i].value);
                }
            }
            return value instanceof AST_SymbolRef && value.fixed_value() || value;
        }
    }
    function has_break_or_continue(loop, parent) {
        var found = !1, tw = new TreeWalker(function(node) {
            return !!found || node instanceof AST_Scope || (node instanceof AST_LoopControl && tw.loopcontrol_target(node) === loop ? found = !0 : void 0);
        });
        return parent instanceof AST_LabeledStatement && tw.push(parent), tw.push(loop), loop.body.walk(tw), found;
    }
    // we shouldn't compress (1,func)(something) to
    // func(something) because that changes the meaning of
    // the func (becomes lexical instead of global).
    function maintain_this_binding(parent, orig, val) {
        if ((!(parent instanceof AST_UnaryPrefix) || "delete" != parent.operator) && (!(parent instanceof AST_Call) || parent.expression !== orig || !(val instanceof AST_PropAccess) && (!(val instanceof AST_SymbolRef) || "eval" != val.name))) return val;
        {
            const zero = make_node(AST_Number, orig, {
                value: 0
            });
            return make_sequence(orig, [
                zero,
                val
            ]);
        }
    }
    function is_func_expr(node) {
        return node instanceof AST_Arrow || node instanceof AST_Function;
    }
    function is_iife_call(node) {
        return(// Used to determine whether the node can benefit from negation.
        // Not the case with arrow functions (you need an extra set of parens).
        "Call" == node.TYPE && (node.expression instanceof AST_Function || is_iife_call(node.expression)));
    }
    AST_ObjectGetter.prototype._size = function() {
        return 5 + static_size(this.static) + key_size(this.key);
    }, AST_ObjectSetter.prototype._size = function() {
        return 5 + static_size(this.static) + key_size(this.key);
    }, AST_ConciseMethod.prototype._size = function() {
        return static_size(this.static) + key_size(this.key) + lambda_modifiers(this);
    }, AST_PrivateMethod.prototype._size = function() {
        return AST_ConciseMethod.prototype._size.call(this) + 1;
    }, AST_PrivateGetter.prototype._size = AST_PrivateSetter.prototype._size = function() {
        return AST_ConciseMethod.prototype._size.call(this) + 4;
    }, AST_Class.prototype._size = function() {
        return (this.name ? 8 : 7) + (this.extends ? 8 : 0);
    }, AST_ClassProperty.prototype._size = function() {
        return static_size(this.static) + ("string" == typeof this.key ? this.key.length + 2 : 0) + (this.value ? 1 : 0);
    }, AST_ClassPrivateProperty.prototype._size = function() {
        return AST_ClassProperty.prototype._size.call(this) + 1;
    }, AST_Symbol.prototype._size = function() {
        return !mangle_options || this.definition().unmangleable(mangle_options) ? this.name.length : 1;
    }, // TODO take propmangle into account
    AST_SymbolClassProperty.prototype._size = function() {
        return this.name.length;
    }, AST_SymbolRef.prototype._size = AST_SymbolDeclaration.prototype._size = function() {
        const { name, thedef } = this;
        return thedef && thedef.global ? name.length : "arguments" === name ? 9 : AST_Symbol.prototype._size.call(this);
    }, AST_NewTarget.prototype._size = ()=>10, AST_SymbolImportForeign.prototype._size = function() {
        return this.name.length;
    }, AST_SymbolExportForeign.prototype._size = function() {
        return this.name.length;
    }, AST_This.prototype._size = ()=>4, AST_Super.prototype._size = ()=>5, AST_String.prototype._size = function() {
        return this.value.length + 2;
    }, AST_Number.prototype._size = function() {
        const { value } = this;
        return 0 === value ? 1 : value > 0 && Math.floor(value) === value ? Math.floor(Math.log10(value) + 1) : value.toString().length;
    }, AST_BigInt.prototype._size = function() {
        return this.value.length;
    }, AST_RegExp.prototype._size = function() {
        return this.value.toString().length;
    }, AST_Null.prototype._size = ()=>4, AST_NaN.prototype._size = ()=>3, AST_Undefined.prototype._size = ()=>6, AST_Hole.prototype._size = ()=>0, AST_Infinity.prototype._size = ()=>8, AST_True.prototype._size = ()=>4, AST_False.prototype._size = ()=>5, AST_Await.prototype._size = ()=>6, AST_Yield.prototype._size = ()=>6;
    const identifier_atom = makePredicate("Infinity NaN undefined");
    function is_identifier_atom(node) {
        return node instanceof AST_Infinity || node instanceof AST_NaN || node instanceof AST_Undefined;
    }
    /** Check if this is a SymbolRef node which has one def of a certain AST type */ function is_ref_of(ref, type) {
        if (!(ref instanceof AST_SymbolRef)) return !1;
        for(var orig = ref.definition().orig, i = orig.length; --i >= 0;)if (orig[i] instanceof type) return !0;
    }
    // Can we turn { block contents... } into just the block contents ?
    // Not if one of these is inside.
    function can_be_evicted_from_block(node) {
        return !(node instanceof AST_DefClass || node instanceof AST_Defun || node instanceof AST_Let || node instanceof AST_Const || node instanceof AST_Export || node instanceof AST_Import);
    }
    function as_statement_array(thing) {
        if (null === thing) return [];
        if (thing instanceof AST_BlockStatement) return thing.body;
        if (thing instanceof AST_EmptyStatement) return [];
        if (thing instanceof AST_Statement) return [
            thing
        ];
        throw Error("Can't convert thing to statement array");
    }
    /** Check if a ref refers to the name of a function/class it's defined within */ function is_recursive_ref(compressor, def) {
        for(var node, i = 0; node = compressor.parent(i); i++)if (node instanceof AST_Lambda || node instanceof AST_Class) {
            var name = node.name;
            if (name && name.definition() === def) return !0;
        }
        return !1;
    }
    const has_flag = (node, flag)=>node.flags & flag, set_flag = (node, flag)=>{
        node.flags |= flag;
    }, clear_flag = (node, flag)=>{
        node.flags &= ~flag;
    };
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ // Lists of native methods, useful for `unsafe` option which assumes they exist.
    // Note: Lots of methods and functions are missing here, in case they aren't pure
    // or not available in all JS environments.
    function make_nested_lookup(obj) {
        const out = new Map();
        for (var key of Object.keys(obj))out.set(key, makePredicate(obj[key]));
        return (global_name, fname)=>{
            const inner_map = out.get(global_name);
            return null != inner_map && inner_map.has(fname);
        };
    }
    // Objects which are safe to access without throwing or causing a side effect.
    // Usually we'd check the `unsafe` option first but these are way too common for that
    const pure_prop_access_globals = new Set([
        "Number",
        "String",
        "Array",
        "Object",
        "Function",
        "Promise"
    ]), object_methods = [
        "constructor",
        "toString",
        "valueOf"
    ], is_pure_native_method = make_nested_lookup({
        Array: [
            "indexOf",
            "join",
            "lastIndexOf",
            "slice",
            ...object_methods
        ],
        Boolean: object_methods,
        Function: object_methods,
        Number: [
            "toExponential",
            "toFixed",
            "toPrecision",
            ...object_methods
        ],
        Object: object_methods,
        RegExp: [
            "test",
            ...object_methods
        ],
        String: [
            "charAt",
            "charCodeAt",
            "concat",
            "indexOf",
            "italics",
            "lastIndexOf",
            "match",
            "replace",
            "search",
            "slice",
            "split",
            "substr",
            "substring",
            "toLowerCase",
            "toUpperCase",
            "trim",
            ...object_methods
        ]
    }), is_pure_native_fn = make_nested_lookup({
        Array: [
            "isArray"
        ],
        Math: [
            "abs",
            "acos",
            "asin",
            "atan",
            "ceil",
            "cos",
            "exp",
            "floor",
            "log",
            "round",
            "sin",
            "sqrt",
            "tan",
            "atan2",
            "pow",
            "max",
            "min"
        ],
        Number: [
            "isFinite",
            "isNaN"
        ],
        Object: [
            "create",
            "getOwnPropertyDescriptor",
            "getOwnPropertyNames",
            "getPrototypeOf",
            "isExtensible",
            "isFrozen",
            "isSealed",
            "hasOwn",
            "keys"
        ],
        String: [
            "fromCharCode"
        ]
    }), is_pure_native_value = make_nested_lookup({
        Math: [
            "E",
            "LN10",
            "LN2",
            "LOG2E",
            "LOG10E",
            "PI",
            "SQRT1_2",
            "SQRT2"
        ],
        Number: [
            "MAX_VALUE",
            "MIN_VALUE",
            "NaN",
            "NEGATIVE_INFINITY",
            "POSITIVE_INFINITY"
        ]
    }), is_undeclared_ref = (node)=>node instanceof AST_SymbolRef && node.definition().undeclared, lazy_op = makePredicate("&& || ??"), unary_side_effects = makePredicate("delete ++ --");
    function is_undefined(node, compressor) {
        return has_flag(node, 0b00001000) || node instanceof AST_Undefined || node instanceof AST_UnaryPrefix && "void" == node.operator && !node.expression.has_side_effects(compressor);
    }
    // Is the node explicitly null or undefined.
    function is_null_or_undefined(node, compressor) {
        let fixed;
        return node instanceof AST_Null || is_undefined(node, compressor) || node instanceof AST_SymbolRef && (fixed = node.definition().fixed) instanceof AST_Node && is_nullish(fixed, compressor);
    }
    // Find out if this expression is optionally chained from a base-point that we
    // can statically analyze as null or undefined.
    function is_nullish_shortcircuited(node, compressor) {
        return node instanceof AST_PropAccess || node instanceof AST_Call ? node.optional && is_null_or_undefined(node.expression, compressor) || is_nullish_shortcircuited(node.expression, compressor) : node instanceof AST_Chain && is_nullish_shortcircuited(node.expression, compressor);
    }
    // Find out if something is == null, or can short circuit into nullish.
    // Used to optimize ?. and ??
    function is_nullish(node, compressor) {
        return !!is_null_or_undefined(node, compressor) || is_nullish_shortcircuited(node, compressor);
    }
    function is_lhs(node, parent) {
        return parent instanceof AST_Unary && unary_side_effects.has(parent.operator) ? parent.expression : parent instanceof AST_Assign && parent.left === node ? node : void 0;
    }
    !// methods to determine whether an expression has a boolean result type
    function(def_is_boolean) {
        const unary_bool = makePredicate("! delete"), binary_bool = makePredicate("in instanceof == != === !== < <= >= >");
        def_is_boolean(AST_Node, return_false), def_is_boolean(AST_UnaryPrefix, function() {
            return unary_bool.has(this.operator);
        }), def_is_boolean(AST_Binary, function() {
            return binary_bool.has(this.operator) || lazy_op.has(this.operator) && this.left.is_boolean() && this.right.is_boolean();
        }), def_is_boolean(AST_Conditional, function() {
            return this.consequent.is_boolean() && this.alternative.is_boolean();
        }), def_is_boolean(AST_Assign, function() {
            return "=" == this.operator && this.right.is_boolean();
        }), def_is_boolean(AST_Sequence, function() {
            return this.tail_node().is_boolean();
        }), def_is_boolean(AST_True, return_true), def_is_boolean(AST_False, return_true);
    }(function(node, func) {
        node.DEFMETHOD("is_boolean", func);
    }), // methods to determine if an expression has a numeric result type
    function(def_is_number) {
        def_is_number(AST_Node, return_false), def_is_number(AST_Number, return_true);
        const unary = makePredicate("+ - ~ ++ --");
        def_is_number(AST_Unary, function() {
            return unary.has(this.operator);
        });
        const numeric_ops = makePredicate("- * / % & | ^ << >> >>>");
        def_is_number(AST_Binary, function(compressor) {
            return numeric_ops.has(this.operator) || "+" == this.operator && this.left.is_number(compressor) && this.right.is_number(compressor);
        }), def_is_number(AST_Assign, function(compressor) {
            return numeric_ops.has(this.operator.slice(0, -1)) || "=" == this.operator && this.right.is_number(compressor);
        }), def_is_number(AST_Sequence, function(compressor) {
            return this.tail_node().is_number(compressor);
        }), def_is_number(AST_Conditional, function(compressor) {
            return this.consequent.is_number(compressor) && this.alternative.is_number(compressor);
        });
    }(function(node, func) {
        node.DEFMETHOD("is_number", func);
    }), (def_is_string = function(node, func) {
        node.DEFMETHOD("is_string", func);
    })(AST_Node, return_false), def_is_string(AST_String, return_true), def_is_string(AST_TemplateString, return_true), def_is_string(AST_UnaryPrefix, function() {
        return "typeof" == this.operator;
    }), def_is_string(AST_Binary, function(compressor) {
        return "+" == this.operator && (this.left.is_string(compressor) || this.right.is_string(compressor));
    }), def_is_string(AST_Assign, function(compressor) {
        return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(compressor);
    }), def_is_string(AST_Sequence, function(compressor) {
        return this.tail_node().is_string(compressor);
    }), def_is_string(AST_Conditional, function(compressor) {
        return this.consequent.is_string(compressor) && this.alternative.is_string(compressor);
    }), // Determine if expression might cause side effects
    // If there's a possibility that a node may change something when it's executed, this returns true
    function(def_has_side_effects) {
        function any(list, compressor) {
            for(var i = list.length; --i >= 0;)if (list[i].has_side_effects(compressor)) return !0;
            return !1;
        }
        def_has_side_effects(AST_Node, return_true), def_has_side_effects(AST_EmptyStatement, return_false), def_has_side_effects(AST_Constant, return_false), def_has_side_effects(AST_This, return_false), def_has_side_effects(AST_Block, function(compressor) {
            return any(this.body, compressor);
        }), def_has_side_effects(AST_Call, function(compressor) {
            return !!(!this.is_callee_pure(compressor) && (!this.expression.is_call_pure(compressor) || this.expression.has_side_effects(compressor))) || any(this.args, compressor);
        }), def_has_side_effects(AST_Switch, function(compressor) {
            return this.expression.has_side_effects(compressor) || any(this.body, compressor);
        }), def_has_side_effects(AST_Case, function(compressor) {
            return this.expression.has_side_effects(compressor) || any(this.body, compressor);
        }), def_has_side_effects(AST_Try, function(compressor) {
            return any(this.body, compressor) || this.bcatch && this.bcatch.has_side_effects(compressor) || this.bfinally && this.bfinally.has_side_effects(compressor);
        }), def_has_side_effects(AST_If, function(compressor) {
            return this.condition.has_side_effects(compressor) || this.body && this.body.has_side_effects(compressor) || this.alternative && this.alternative.has_side_effects(compressor);
        }), def_has_side_effects(AST_LabeledStatement, function(compressor) {
            return this.body.has_side_effects(compressor);
        }), def_has_side_effects(AST_SimpleStatement, function(compressor) {
            return this.body.has_side_effects(compressor);
        }), def_has_side_effects(AST_Lambda, return_false), def_has_side_effects(AST_Class, function(compressor) {
            return !!(this.extends && this.extends.has_side_effects(compressor)) || any(this.properties, compressor);
        }), def_has_side_effects(AST_Binary, function(compressor) {
            return this.left.has_side_effects(compressor) || this.right.has_side_effects(compressor);
        }), def_has_side_effects(AST_Assign, return_true), def_has_side_effects(AST_Conditional, function(compressor) {
            return this.condition.has_side_effects(compressor) || this.consequent.has_side_effects(compressor) || this.alternative.has_side_effects(compressor);
        }), def_has_side_effects(AST_Unary, function(compressor) {
            return unary_side_effects.has(this.operator) || this.expression.has_side_effects(compressor);
        }), def_has_side_effects(AST_SymbolRef, function(compressor) {
            return !this.is_declared(compressor) && !pure_prop_access_globals.has(this.name);
        }), def_has_side_effects(AST_SymbolClassProperty, return_false), def_has_side_effects(AST_SymbolDeclaration, return_false), def_has_side_effects(AST_Object, function(compressor) {
            return any(this.properties, compressor);
        }), def_has_side_effects(AST_ObjectProperty, function(compressor) {
            return this.computed_key() && this.key.has_side_effects(compressor) || this.value && this.value.has_side_effects(compressor);
        }), def_has_side_effects(AST_ClassProperty, function(compressor) {
            return this.computed_key() && this.key.has_side_effects(compressor) || this.static && this.value && this.value.has_side_effects(compressor);
        }), def_has_side_effects(AST_ConciseMethod, function(compressor) {
            return this.computed_key() && this.key.has_side_effects(compressor);
        }), def_has_side_effects(AST_ObjectGetter, function(compressor) {
            return this.computed_key() && this.key.has_side_effects(compressor);
        }), def_has_side_effects(AST_ObjectSetter, function(compressor) {
            return this.computed_key() && this.key.has_side_effects(compressor);
        }), def_has_side_effects(AST_Array, function(compressor) {
            return any(this.elements, compressor);
        }), def_has_side_effects(AST_Dot, function(compressor) {
            return !is_nullish(this, compressor) && (!this.optional && this.expression.may_throw_on_access(compressor) || this.expression.has_side_effects(compressor));
        }), def_has_side_effects(AST_Sub, function(compressor) {
            return !is_nullish(this, compressor) && (!this.optional && this.expression.may_throw_on_access(compressor) || this.expression.has_side_effects(compressor) || this.property.has_side_effects(compressor));
        }), def_has_side_effects(AST_Chain, function(compressor) {
            return this.expression.has_side_effects(compressor);
        }), def_has_side_effects(AST_Sequence, function(compressor) {
            return any(this.expressions, compressor);
        }), def_has_side_effects(AST_Definitions, function(compressor) {
            return any(this.definitions, compressor);
        }), def_has_side_effects(AST_VarDef, function() {
            return this.value;
        }), def_has_side_effects(AST_TemplateSegment, return_false), def_has_side_effects(AST_TemplateString, function(compressor) {
            return any(this.segments, compressor);
        });
    }(function(node, func) {
        node.DEFMETHOD("has_side_effects", func);
    }), // determine if expression may throw
    function(def_may_throw) {
        function any(list, compressor) {
            for(var i = list.length; --i >= 0;)if (list[i].may_throw(compressor)) return !0;
            return !1;
        }
        def_may_throw(AST_Node, return_true), def_may_throw(AST_Constant, return_false), def_may_throw(AST_EmptyStatement, return_false), def_may_throw(AST_Lambda, return_false), def_may_throw(AST_SymbolDeclaration, return_false), def_may_throw(AST_This, return_false), def_may_throw(AST_Class, function(compressor) {
            return !!(this.extends && this.extends.may_throw(compressor)) || any(this.properties, compressor);
        }), def_may_throw(AST_Array, function(compressor) {
            return any(this.elements, compressor);
        }), def_may_throw(AST_Assign, function(compressor) {
            return !!this.right.may_throw(compressor) || (!!compressor.has_directive("use strict") || "=" != this.operator || !(this.left instanceof AST_SymbolRef)) && this.left.may_throw(compressor);
        }), def_may_throw(AST_Binary, function(compressor) {
            return this.left.may_throw(compressor) || this.right.may_throw(compressor);
        }), def_may_throw(AST_Block, function(compressor) {
            return any(this.body, compressor);
        }), def_may_throw(AST_Call, function(compressor) {
            return !is_nullish(this, compressor) && (!!any(this.args, compressor) || !this.is_callee_pure(compressor) && (!!this.expression.may_throw(compressor) || !(this.expression instanceof AST_Lambda) || any(this.expression.body, compressor)));
        }), def_may_throw(AST_Case, function(compressor) {
            return this.expression.may_throw(compressor) || any(this.body, compressor);
        }), def_may_throw(AST_Conditional, function(compressor) {
            return this.condition.may_throw(compressor) || this.consequent.may_throw(compressor) || this.alternative.may_throw(compressor);
        }), def_may_throw(AST_Definitions, function(compressor) {
            return any(this.definitions, compressor);
        }), def_may_throw(AST_If, function(compressor) {
            return this.condition.may_throw(compressor) || this.body && this.body.may_throw(compressor) || this.alternative && this.alternative.may_throw(compressor);
        }), def_may_throw(AST_LabeledStatement, function(compressor) {
            return this.body.may_throw(compressor);
        }), def_may_throw(AST_Object, function(compressor) {
            return any(this.properties, compressor);
        }), def_may_throw(AST_ObjectProperty, function(compressor) {
            // TODO key may throw too
            return !!this.value && this.value.may_throw(compressor);
        }), def_may_throw(AST_ClassProperty, function(compressor) {
            return this.computed_key() && this.key.may_throw(compressor) || this.static && this.value && this.value.may_throw(compressor);
        }), def_may_throw(AST_ConciseMethod, function(compressor) {
            return this.computed_key() && this.key.may_throw(compressor);
        }), def_may_throw(AST_ObjectGetter, function(compressor) {
            return this.computed_key() && this.key.may_throw(compressor);
        }), def_may_throw(AST_ObjectSetter, function(compressor) {
            return this.computed_key() && this.key.may_throw(compressor);
        }), def_may_throw(AST_Return, function(compressor) {
            return this.value && this.value.may_throw(compressor);
        }), def_may_throw(AST_Sequence, function(compressor) {
            return any(this.expressions, compressor);
        }), def_may_throw(AST_SimpleStatement, function(compressor) {
            return this.body.may_throw(compressor);
        }), def_may_throw(AST_Dot, function(compressor) {
            return !is_nullish(this, compressor) && (!this.optional && this.expression.may_throw_on_access(compressor) || this.expression.may_throw(compressor));
        }), def_may_throw(AST_Sub, function(compressor) {
            return !is_nullish(this, compressor) && (!this.optional && this.expression.may_throw_on_access(compressor) || this.expression.may_throw(compressor) || this.property.may_throw(compressor));
        }), def_may_throw(AST_Chain, function(compressor) {
            return this.expression.may_throw(compressor);
        }), def_may_throw(AST_Switch, function(compressor) {
            return this.expression.may_throw(compressor) || any(this.body, compressor);
        }), def_may_throw(AST_SymbolRef, function(compressor) {
            return !this.is_declared(compressor) && !pure_prop_access_globals.has(this.name);
        }), def_may_throw(AST_SymbolClassProperty, return_false), def_may_throw(AST_Try, function(compressor) {
            return this.bcatch ? this.bcatch.may_throw(compressor) : any(this.body, compressor) || this.bfinally && this.bfinally.may_throw(compressor);
        }), def_may_throw(AST_Unary, function(compressor) {
            return ("typeof" != this.operator || !(this.expression instanceof AST_SymbolRef)) && this.expression.may_throw(compressor);
        }), def_may_throw(AST_VarDef, function(compressor) {
            return !!this.value && this.value.may_throw(compressor);
        });
    }(function(node, func) {
        node.DEFMETHOD("may_throw", func);
    }), // determine if expression is constant
    function(def_is_constant_expression) {
        function all_refs_local(scope) {
            let result = !0;
            return walk(this, (node)=>{
                if (node instanceof AST_SymbolRef) {
                    if (has_flag(this, 0b00010000)) return result = !1, walk_abort;
                    var def = node.definition();
                    if (member(def, this.enclosed) && !this.variables.has(def.name)) {
                        if (scope) {
                            var scope_def = scope.find_variable(node);
                            if (def.undeclared ? !scope_def : scope_def === def) return result = "f", !0;
                        }
                        return result = !1, walk_abort;
                    }
                    return !0;
                }
                if (node instanceof AST_This && this instanceof AST_Arrow) return(// TODO check arguments too!
                result = !1, walk_abort);
            }), result;
        }
        def_is_constant_expression(AST_Node, return_false), def_is_constant_expression(AST_Constant, return_true), def_is_constant_expression(AST_Class, function(scope) {
            if (this.extends && !this.extends.is_constant_expression(scope)) return !1;
            for (const prop of this.properties)if (prop.computed_key() && !prop.key.is_constant_expression(scope) || prop.static && prop.value && !prop.value.is_constant_expression(scope)) return !1;
            return all_refs_local.call(this, scope);
        }), def_is_constant_expression(AST_Lambda, all_refs_local), def_is_constant_expression(AST_Unary, function() {
            return this.expression.is_constant_expression();
        }), def_is_constant_expression(AST_Binary, function() {
            return this.left.is_constant_expression() && this.right.is_constant_expression();
        }), def_is_constant_expression(AST_Array, function() {
            return this.elements.every((l)=>l.is_constant_expression());
        }), def_is_constant_expression(AST_Object, function() {
            return this.properties.every((l)=>l.is_constant_expression());
        }), def_is_constant_expression(AST_ObjectProperty, function() {
            return !!(!(this.key instanceof AST_Node) && this.value && this.value.is_constant_expression());
        });
    }(function(node, func) {
        node.DEFMETHOD("is_constant_expression", func);
    }), // may_throw_on_access()
    // returns true if this node may be null, undefined or contain `AST_Accessor`
    function(def_may_throw_on_access) {
        function is_strict(compressor) {
            return /strict/.test(compressor.option("pure_getters"));
        }
        AST_Node.DEFMETHOD("may_throw_on_access", function(compressor) {
            return !compressor.option("pure_getters") || this._dot_throw(compressor);
        }), def_may_throw_on_access(AST_Node, is_strict), def_may_throw_on_access(AST_Null, return_true), def_may_throw_on_access(AST_Undefined, return_true), def_may_throw_on_access(AST_Constant, return_false), def_may_throw_on_access(AST_Array, return_false), def_may_throw_on_access(AST_Object, function(compressor) {
            if (!is_strict(compressor)) return !1;
            for(var i = this.properties.length; --i >= 0;)if (this.properties[i]._dot_throw(compressor)) return !0;
            return !1;
        }), // Do not be as strict with classes as we are with objects.
        // Hopefully the community is not going to abuse static getters and setters.
        // https://github.com/terser/terser/issues/724#issuecomment-643655656
        def_may_throw_on_access(AST_Class, return_false), def_may_throw_on_access(AST_ObjectProperty, return_false), def_may_throw_on_access(AST_ObjectGetter, return_true), def_may_throw_on_access(AST_Expansion, function(compressor) {
            return this.expression._dot_throw(compressor);
        }), def_may_throw_on_access(AST_Function, return_false), def_may_throw_on_access(AST_Arrow, return_false), def_may_throw_on_access(AST_UnaryPostfix, return_false), def_may_throw_on_access(AST_UnaryPrefix, function() {
            return "void" == this.operator;
        }), def_may_throw_on_access(AST_Binary, function(compressor) {
            return ("&&" == this.operator || "||" == this.operator || "??" == this.operator) && (this.left._dot_throw(compressor) || this.right._dot_throw(compressor));
        }), def_may_throw_on_access(AST_Assign, function(compressor) {
            return !!this.logical || "=" == this.operator && this.right._dot_throw(compressor);
        }), def_may_throw_on_access(AST_Conditional, function(compressor) {
            return this.consequent._dot_throw(compressor) || this.alternative._dot_throw(compressor);
        }), def_may_throw_on_access(AST_Dot, function(compressor) {
            return !!is_strict(compressor) && ("prototype" != this.property || !(this.expression instanceof AST_Function || this.expression instanceof AST_Class));
        }), def_may_throw_on_access(AST_Chain, function(compressor) {
            return this.expression._dot_throw(compressor);
        }), def_may_throw_on_access(AST_Sequence, function(compressor) {
            return this.tail_node()._dot_throw(compressor);
        }), def_may_throw_on_access(AST_SymbolRef, function(compressor) {
            if ("arguments" === this.name) return !1;
            if (has_flag(this, 0b00001000)) return !0;
            if (!is_strict(compressor) || is_undeclared_ref(this) && this.is_declared(compressor) || this.is_immutable()) return !1;
            var fixed = this.fixed_value();
            return !fixed || fixed._dot_throw(compressor);
        });
    }(function(node, func) {
        node.DEFMETHOD("_dot_throw", func);
    }), def_find_defs = function(node, func) {
        node.DEFMETHOD("_find_defs", func);
    }, AST_Toplevel.DEFMETHOD("resolve_defines", function(compressor) {
        return compressor.option("global_defs") ? (this.figure_out_scope({
            ie8: compressor.option("ie8")
        }), this.transform(new TreeTransformer(function(node) {
            var def = node._find_defs(compressor, "");
            if (def) {
                for(var parent, level = 0, child = node; (parent = this.parent(level++)) && parent instanceof AST_PropAccess && parent.expression === child;)child = parent;
                if (is_lhs(child, parent)) return;
                return def;
            }
        }))) : this;
    }), def_find_defs(AST_Node, noop), def_find_defs(AST_Chain, function(compressor, suffix) {
        return this.expression._find_defs(compressor, suffix);
    }), def_find_defs(AST_Dot, function(compressor, suffix) {
        return this.expression._find_defs(compressor, "." + this.property + suffix);
    }), def_find_defs(AST_SymbolDeclaration, function() {
        if (!this.global()) return;
    }), def_find_defs(AST_SymbolRef, function(compressor, suffix) {
        if (this.global()) {
            var defines = compressor.option("global_defs"), name = this.name + suffix;
            if (HOP(defines, name)) return function to_node(value, orig) {
                if (value instanceof AST_Node) return value instanceof AST_Constant || // Value may be a function, an array including functions and even a complex assign / block expression,
                // so it should never be shared in different places.
                // Otherwise wrong information may be used in the compression phase
                (value = value.clone(!0)), make_node(value.CTOR, orig, value);
                if (Array.isArray(value)) return make_node(AST_Array, orig, {
                    elements: value.map(function(value) {
                        return to_node(value, orig);
                    })
                });
                if (value && "object" == typeof value) {
                    var props = [];
                    for(var key in value)HOP(value, key) && props.push(make_node(AST_ObjectKeyVal, orig, {
                        key: key,
                        value: to_node(value[key], orig)
                    }));
                    return make_node(AST_Object, orig, {
                        properties: props
                    });
                }
                return make_node_from_constant(value, orig);
            }(defines[name], this);
        }
    }), // method to negate an expression
    function(def_negate) {
        function basic_negation(exp) {
            return make_node(AST_UnaryPrefix, exp, {
                operator: "!",
                expression: exp
            });
        }
        function best(orig, alt, first_in_statement) {
            var negated = basic_negation(orig);
            if (first_in_statement) {
                var stat = make_node(AST_SimpleStatement, alt, {
                    body: alt
                });
                return best_of_expression(negated, stat) === stat ? alt : negated;
            }
            return best_of_expression(negated, alt);
        }
        def_negate(AST_Node, function() {
            return basic_negation(this);
        }), def_negate(AST_Statement, function() {
            throw Error("Cannot negate a statement");
        }), def_negate(AST_Function, function() {
            return basic_negation(this);
        }), def_negate(AST_Arrow, function() {
            return basic_negation(this);
        }), def_negate(AST_UnaryPrefix, function() {
            return "!" == this.operator ? this.expression : basic_negation(this);
        }), def_negate(AST_Sequence, function(compressor) {
            var expressions = this.expressions.slice();
            return expressions.push(expressions.pop().negate(compressor)), make_sequence(this, expressions);
        }), def_negate(AST_Conditional, function(compressor, first_in_statement) {
            var self1 = this.clone();
            return self1.consequent = self1.consequent.negate(compressor), self1.alternative = self1.alternative.negate(compressor), best(this, self1, first_in_statement);
        }), def_negate(AST_Binary, function(compressor, first_in_statement) {
            var self1 = this.clone(), op = this.operator;
            if (compressor.option("unsafe_comps")) switch(op){
                case "<=":
                    return self1.operator = ">", self1;
                case "<":
                    return self1.operator = ">=", self1;
                case ">=":
                    return self1.operator = "<", self1;
                case ">":
                    return self1.operator = "<=", self1;
            }
            switch(op){
                case "==":
                    return self1.operator = "!=", self1;
                case "!=":
                    return self1.operator = "==", self1;
                case "===":
                    return self1.operator = "!==", self1;
                case "!==":
                    return self1.operator = "===", self1;
                case "&&":
                    return self1.operator = "||", self1.left = self1.left.negate(compressor, first_in_statement), self1.right = self1.right.negate(compressor), best(this, self1, first_in_statement);
                case "||":
                    return self1.operator = "&&", self1.left = self1.left.negate(compressor, first_in_statement), self1.right = self1.right.negate(compressor), best(this, self1, first_in_statement);
            }
            return basic_negation(this);
        });
    }(function(node, func) {
        node.DEFMETHOD("negate", function(compressor, first_in_statement) {
            return func.call(this, compressor, first_in_statement);
        });
    });
    // Is the callee of this function pure?
    var global_pure_fns = makePredicate("Boolean decodeURI decodeURIComponent Date encodeURI encodeURIComponent Error escape EvalError isFinite isNaN Number Object parseFloat parseInt RangeError ReferenceError String SyntaxError TypeError unescape URIError");
    AST_Call.DEFMETHOD("is_callee_pure", function(compressor) {
        if (compressor.option("unsafe")) {
            var expr = this.expression, first_arg = this.args && this.args[0] && this.args[0].evaluate(compressor);
            if (expr.expression && "hasOwnProperty" === expr.expression.name && (null == first_arg || first_arg.thedef && first_arg.thedef.undeclared)) return !1;
            if (is_undeclared_ref(expr) && global_pure_fns.has(expr.name) || expr instanceof AST_Dot && is_undeclared_ref(expr.expression) && is_pure_native_fn(expr.expression.name, expr.property)) return !0;
        }
        return !!has_annotation(this, _PURE) || !compressor.pure_funcs(this);
    }), // If I call this, is it a pure function?
    AST_Node.DEFMETHOD("is_call_pure", return_false), AST_Dot.DEFMETHOD("is_call_pure", function(compressor) {
        let native_obj;
        if (!compressor.option("unsafe")) return;
        const expr = this.expression;
        return expr instanceof AST_Array ? native_obj = "Array" : expr.is_boolean() ? native_obj = "Boolean" : expr.is_number(compressor) ? native_obj = "Number" : expr instanceof AST_RegExp ? native_obj = "RegExp" : expr.is_string(compressor) ? native_obj = "String" : this.may_throw_on_access(compressor) || (native_obj = "Object"), null != native_obj && is_pure_native_method(native_obj, this.property);
    });
    // tell me if a statement aborts
    const aborts = (thing)=>thing && thing.aborts();
    function is_modified(compressor, tw, node, value, level, immutable) {
        var parent = tw.parent(level), lhs = is_lhs(node, parent);
        if (lhs) return lhs;
        if (!immutable && parent instanceof AST_Call && parent.expression === node && !(value instanceof AST_Arrow) && !(value instanceof AST_Class) && !parent.is_callee_pure(compressor) && (!(value instanceof AST_Function) || !(parent instanceof AST_New) && value.contains_this())) return !0;
        if (parent instanceof AST_Array) return is_modified(compressor, tw, parent, parent, level + 1);
        if (parent instanceof AST_ObjectKeyVal && node === parent.value) {
            var obj = tw.parent(level + 1);
            return is_modified(compressor, tw, obj, obj, level + 2);
        }
        if (parent instanceof AST_PropAccess && parent.expression === node) {
            var prop = read_property(value, parent.property);
            return !immutable && is_modified(compressor, tw, parent, prop, level + 1);
        }
    }
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ // methods to evaluate a constant expression
    function def_eval(node, func) {
        node.DEFMETHOD("_eval", func);
    }
    !function(def_aborts) {
        function block_aborts() {
            for(var i = 0; i < this.body.length; i++)if (aborts(this.body[i])) return this.body[i];
            return null;
        }
        def_aborts(AST_Statement, return_null), def_aborts(AST_Jump, return_this), def_aborts(AST_Import, function() {
            return null;
        }), def_aborts(AST_BlockStatement, block_aborts), def_aborts(AST_SwitchBranch, block_aborts), def_aborts(AST_If, function() {
            return this.alternative && aborts(this.body) && aborts(this.alternative) && this;
        });
    }(function(node, func) {
        node.DEFMETHOD("aborts", func);
    });
    // Used to propagate a nullish short-circuit signal upwards through the chain.
    const nullish = Symbol("This AST_Chain is nullish");
    // If the node has been successfully reduced to a constant,
    // then its value is returned; otherwise the element itself
    // is returned.
    // They can be distinguished as constant value is never a
    // descendant of AST_Node.
    AST_Node.DEFMETHOD("evaluate", function(compressor) {
        if (!compressor.option("evaluate")) return this;
        var val = this._eval(compressor, 1);
        return !val || val instanceof RegExp ? val : "function" == typeof val || "object" == typeof val || val == nullish ? this : val;
    });
    var unaryPrefix = makePredicate("! ~ - + void");
    AST_Node.DEFMETHOD("is_constant", function() {
        return(// Accomodate when compress option evaluate=false
        // as well as the common constant expressions !0 and -1
        this instanceof AST_Constant ? !(this instanceof AST_RegExp) : this instanceof AST_UnaryPrefix && this.expression instanceof AST_Constant && unaryPrefix.has(this.operator));
    }), def_eval(AST_Statement, function() {
        throw Error(string_template("Cannot evaluate a statement [{file}:{line},{col}]", this.start));
    }), def_eval(AST_Lambda, return_this), def_eval(AST_Class, return_this), def_eval(AST_Node, return_this), def_eval(AST_Constant, function() {
        return this.getValue();
    }), def_eval(AST_BigInt, return_this), def_eval(AST_RegExp, function(compressor) {
        let evaluated = compressor.evaluated_regexps.get(this);
        if (void 0 === evaluated) {
            try {
                evaluated = (0, eval)(this.print_to_string());
            } catch (e) {
                evaluated = null;
            }
            compressor.evaluated_regexps.set(this, evaluated);
        }
        return evaluated || this;
    }), def_eval(AST_TemplateString, function() {
        return 1 !== this.segments.length ? this : this.segments[0].value;
    }), def_eval(AST_Function, function(compressor) {
        if (compressor.option("unsafe")) {
            var fn = function() {};
            return fn.node = this, fn.toString = ()=>this.print_to_string(), fn;
        }
        return this;
    }), def_eval(AST_Array, function(compressor, depth) {
        if (compressor.option("unsafe")) {
            for(var elements = [], i = 0, len = this.elements.length; i < len; i++){
                var element = this.elements[i], value = element._eval(compressor, depth);
                if (element === value) return this;
                elements.push(value);
            }
            return elements;
        }
        return this;
    }), def_eval(AST_Object, function(compressor, depth) {
        if (compressor.option("unsafe")) {
            for(var val = {}, i = 0, len = this.properties.length; i < len; i++){
                var prop = this.properties[i];
                if (prop instanceof AST_Expansion) return this;
                var key = prop.key;
                if (key instanceof AST_Symbol) key = key.name;
                else if (key instanceof AST_Node && (key = key._eval(compressor, depth)) === prop.key) return this;
                if ("function" == typeof Object.prototype[key] || !(prop.value instanceof AST_Function) && (val[key] = prop.value._eval(compressor, depth), val[key] === prop.value)) return this;
            }
            return val;
        }
        return this;
    });
    var non_converting_unary = makePredicate("! typeof void");
    def_eval(AST_UnaryPrefix, function(compressor, depth) {
        var e = this.expression;
        // Function would be evaluated to an array and so typeof would
        // incorrectly return 'object'. Hence making is a special case.
        if (compressor.option("typeofs") && "typeof" == this.operator && (e instanceof AST_Lambda || e instanceof AST_SymbolRef && e.fixed_value() instanceof AST_Lambda)) return "function";
        if (!non_converting_unary.has(this.operator) && depth++, (e = e._eval(compressor, depth)) === this.expression) return this;
        switch(this.operator){
            case "!":
                return !e;
            case "typeof":
                // typeof <RegExp> returns "object" or "function" on different platforms
                // so cannot evaluate reliably
                if (e instanceof RegExp) break;
                return typeof e;
            case "void":
                return;
            case "~":
                return ~e;
            case "-":
                return -e;
            case "+":
                return +e;
        }
        return this;
    });
    var non_converting_binary = makePredicate("&& || ?? === !==");
    const identity_comparison = makePredicate("== != === !=="), has_identity = (value)=>"object" == typeof value || "function" == typeof value || "symbol" == typeof value;
    def_eval(AST_Binary, function(compressor, depth) {
        !non_converting_binary.has(this.operator) && depth++;
        var result, left = this.left._eval(compressor, depth);
        if (left === this.left) return this;
        var right = this.right._eval(compressor, depth);
        if (right === this.right || null != left && null != right && identity_comparison.has(this.operator) && has_identity(left) && has_identity(right) && typeof left == typeof right) return this;
        switch(this.operator){
            case "&&":
                result = left && right;
                break;
            case "||":
                result = left || right;
                break;
            case "??":
                result = null != left ? left : right;
                break;
            case "|":
                result = left | right;
                break;
            case "&":
                result = left & right;
                break;
            case "^":
                result = left ^ right;
                break;
            case "+":
                result = left + right;
                break;
            case "*":
                result = left * right;
                break;
            case "**":
                result = Math.pow(left, right);
                break;
            case "/":
                result = left / right;
                break;
            case "%":
                result = left % right;
                break;
            case "-":
                result = left - right;
                break;
            case "<<":
                result = left << right;
                break;
            case ">>":
                result = left >> right;
                break;
            case ">>>":
                result = left >>> right;
                break;
            case "==":
                result = left == right;
                break;
            case "===":
                result = left === right;
                break;
            case "!=":
                result = left != right;
                break;
            case "!==":
                result = left !== right;
                break;
            case "<":
                result = left < right;
                break;
            case "<=":
                result = left <= right;
                break;
            case ">":
                result = left > right;
                break;
            case ">=":
                result = left >= right;
                break;
            default:
                return this;
        }
        return isNaN(result) && compressor.find_parent(AST_With) ? this : result;
    }), def_eval(AST_Conditional, function(compressor, depth) {
        var condition = this.condition._eval(compressor, depth);
        if (condition === this.condition) return this;
        var node = condition ? this.consequent : this.alternative, value = node._eval(compressor, depth);
        return value === node ? this : value;
    });
    // Set of AST_SymbolRef which are currently being evaluated.
    // Avoids infinite recursion of ._eval()
    const reentrant_ref_eval = new Set();
    def_eval(AST_SymbolRef, function(compressor, depth) {
        if (reentrant_ref_eval.has(this)) return this;
        var fixed = this.fixed_value();
        if (!fixed) return this;
        reentrant_ref_eval.add(this);
        const value = fixed._eval(compressor, depth);
        if (reentrant_ref_eval.delete(this), value === fixed) return this;
        if (value && "object" == typeof value) {
            var escaped = this.definition().escaped;
            if (escaped && depth > escaped) return this;
        }
        return value;
    });
    const global_objs = {
        Array,
        Math,
        Number,
        Object,
        String
    }, regexp_flags = new Set([
        "dotAll",
        "global",
        "ignoreCase",
        "multiline",
        "sticky",
        "unicode"
    ]);
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ // AST_Node#drop_side_effect_free() gets called when we don't care about the value,
    // only about side effects. We'll be defining this method for each node type in this module
    //
    // Examples:
    // foo++ -> foo++
    // 1 + func() -> func()
    // 10 -> (nothing)
    // knownPureFunc(foo++) -> foo++
    function def_drop_side_effect_free(node, func) {
        node.DEFMETHOD("drop_side_effect_free", func);
    }
    // Drop side-effect-free elements from an array of expressions.
    // Returns an array of expressions with side-effects or null
    // if all elements were dropped. Note: original array may be
    // returned if nothing changed.
    function trim(nodes, compressor, first_in_statement) {
        var len = nodes.length;
        if (!len) return null;
        for(var ret = [], changed = !1, i = 0; i < len; i++){
            var node = nodes[i].drop_side_effect_free(compressor, first_in_statement);
            changed |= node !== nodes[i], node && (ret.push(node), first_in_statement = !1);
        }
        return changed ? ret.length ? ret : null : nodes;
    }
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ // Define the method AST_Node#reduce_vars, which goes through the AST in
    // execution order to perform basic flow analysis
    function def_reduce_vars(node, func) {
        node.DEFMETHOD("reduce_vars", func);
    }
    function reset_def(compressor, def) {
        def.assignments = 0, def.chained = !1, def.direct_access = !1, def.escaped = 0, def.recursive_refs = 0, def.references = [], def.single_use = void 0, def.scope.pinned() ? def.fixed = !1 : def.orig[0] instanceof AST_SymbolConst || !compressor.exposed(def) ? def.fixed = def.init : def.fixed = !1;
    }
    function reset_variables(tw, compressor, node) {
        node.variables.forEach(function(def) {
            reset_def(compressor, def), null === def.fixed ? (tw.defs_to_safe_ids.set(def.id, tw.safe_ids), mark(tw, def, !0)) : def.fixed && (tw.loop_ids.set(def.id, tw.in_loop), mark(tw, def, !0));
        });
    }
    function reset_block_variables(compressor, node) {
        node.block_scope && node.block_scope.variables.forEach((def)=>{
            reset_def(compressor, def);
        });
    }
    function push(tw) {
        tw.safe_ids = Object.create(tw.safe_ids);
    }
    function pop(tw) {
        tw.safe_ids = Object.getPrototypeOf(tw.safe_ids);
    }
    function mark(tw, def, safe) {
        tw.safe_ids[def.id] = safe;
    }
    function safe_to_read(tw, def) {
        if ("m" == def.single_use) return !1;
        if (tw.safe_ids[def.id]) {
            if (null == def.fixed) {
                var orig = def.orig[0];
                if (orig instanceof AST_SymbolFunarg || "arguments" == orig.name) return !1;
                def.fixed = make_node(AST_Undefined, orig);
            }
            return !0;
        }
        return def.fixed instanceof AST_Defun;
    }
    function safe_to_assign(tw, def, scope, value) {
        let def_safe_ids;
        return void 0 === def.fixed || (null === def.fixed && (def_safe_ids = tw.defs_to_safe_ids.get(def.id)) ? (def_safe_ids[def.id] = !1, tw.defs_to_safe_ids.delete(def.id), !0) : !!(HOP(tw.safe_ids, def.id) && safe_to_read(tw, def)) && !1 !== def.fixed && (null == def.fixed || !!value && !(def.references.length > def.assignments)) && (def.fixed instanceof AST_Defun ? value instanceof AST_Node && def.fixed.parent_scope === scope : def.orig.every((sym)=>!(sym instanceof AST_SymbolConst || sym instanceof AST_SymbolDefun || sym instanceof AST_SymbolLambda))));
    }
    // A definition "escapes" when its value can leave the point of use.
    // Example: `a = b || c`
    // In this example, "b" and "c" are escaping, because they're going into "a"
    //
    // def.escaped is != 0 when it escapes.
    //
    // When greater than 1, it means that N chained properties will be read off
    // of that def before an escape occurs. This is useful for evaluating
    // property accesses, where you need to know when to stop.
    function mark_escaped(tw, d, scope, node, value, level = 0, depth = 1) {
        var parent = tw.parent(level);
        if (!(value && (value.is_constant() || value instanceof AST_ClassExpression))) {
            if (parent instanceof AST_Assign && ("=" === parent.operator || parent.logical) && node === parent.right || parent instanceof AST_Call && (node !== parent.expression || parent instanceof AST_New) || parent instanceof AST_Exit && node === parent.value && node.scope !== d.scope || parent instanceof AST_VarDef && node === parent.value || parent instanceof AST_Yield && node === parent.value && node.scope !== d.scope) {
                depth > 1 && !(value && value.is_constant_expression(scope)) && (depth = 1), (!d.escaped || d.escaped > depth) && (d.escaped = depth);
                return;
            }
            if (parent instanceof AST_Array || parent instanceof AST_Await || parent instanceof AST_Binary && lazy_op.has(parent.operator) || parent instanceof AST_Conditional && node !== parent.condition || parent instanceof AST_Expansion || parent instanceof AST_Sequence && node === parent.tail_node()) mark_escaped(tw, d, scope, parent, parent, level + 1, depth);
            else if (parent instanceof AST_ObjectKeyVal && node === parent.value) {
                var obj = tw.parent(level + 1);
                mark_escaped(tw, d, scope, obj, obj, level + 2, depth);
            } else if (parent instanceof AST_PropAccess && node === parent.expression && (value = read_property(value, parent.property), mark_escaped(tw, d, scope, parent, value, level + 1, depth + 1), value)) return;
            level > 0 || parent instanceof AST_Sequence && node !== parent.tail_node() || parent instanceof AST_SimpleStatement || (d.direct_access = !0);
        }
    }
    def_eval(AST_PropAccess, function(compressor, depth) {
        const obj = this.expression._eval(compressor, depth);
        if (obj === nullish || this.optional && null == obj) return nullish;
        if (compressor.option("unsafe")) {
            var key = this.property;
            if (key instanceof AST_Node && (key = key._eval(compressor, depth)) === this.property) return this;
            var exp = this.expression;
            if (is_undeclared_ref(exp)) {
                var val, aa, first_arg = "hasOwnProperty" === exp.name && "call" === key && (aa = compressor.parent() && compressor.parent().args) && aa && aa[0] && aa[0].evaluate(compressor);
                if (null == (first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg) || first_arg.thedef && first_arg.thedef.undeclared) return this.clone();
                if (!is_pure_native_value(exp.name, key)) return this;
                val = global_objs[exp.name];
            } else {
                if ((val = exp._eval(compressor, depth + 1)) instanceof RegExp) {
                    if ("source" == key) return regexp_source_fix(val.source);
                    if ("flags" == key || regexp_flags.has(key)) return val[key];
                }
                if (!val || val === exp || !HOP(val, key)) return this;
                if ("function" == typeof val) switch(key){
                    case "name":
                        return val.node.name ? val.node.name.name : "";
                    case "length":
                        return val.node.length_property();
                    default:
                        return this;
                }
            }
            return val[key];
        }
        return this;
    }), def_eval(AST_Chain, function(compressor, depth) {
        const evaluated = this.expression._eval(compressor, depth);
        return evaluated === nullish ? void 0 : evaluated === this.expression ? this : evaluated;
    }), def_eval(AST_Call, function(compressor, depth) {
        var exp = this.expression;
        const callee = exp._eval(compressor, depth);
        if (callee === nullish || this.optional && null == callee) return nullish;
        if (compressor.option("unsafe") && exp instanceof AST_PropAccess) {
            var val, key = exp.property;
            if (key instanceof AST_Node && (key = key._eval(compressor, depth)) === exp.property) return this;
            var e = exp.expression;
            if (is_undeclared_ref(e)) {
                var first_arg = "hasOwnProperty" === e.name && "call" === key && this.args[0] && this.args[0].evaluate(compressor);
                if (null == (first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg) || first_arg.thedef && first_arg.thedef.undeclared) return this.clone();
                if (!is_pure_native_fn(e.name, key)) return this;
                val = global_objs[e.name];
            } else if ((val = e._eval(compressor, depth + 1)) === e || !val || !is_pure_native_method(val.constructor.name, key)) return this;
            for(var args = [], i = 0, len = this.args.length; i < len; i++){
                var arg = this.args[i], value = arg._eval(compressor, depth);
                if (arg === value || arg instanceof AST_Lambda) return this;
                args.push(value);
            }
            try {
                return val[key].apply(val, args);
            } catch (ex) {
            // We don't really care
            }
        }
        return this;
    }), // Also a subclass of AST_Call
    def_eval(AST_New, return_this), def_drop_side_effect_free(AST_Node, return_this), def_drop_side_effect_free(AST_Constant, return_null), def_drop_side_effect_free(AST_This, return_null), def_drop_side_effect_free(AST_Call, function(compressor, first_in_statement) {
        if (is_nullish_shortcircuited(this, compressor)) return this.expression.drop_side_effect_free(compressor, first_in_statement);
        if (!this.is_callee_pure(compressor)) {
            if (this.expression.is_call_pure(compressor)) {
                var exprs = this.args.slice();
                return exprs.unshift(this.expression.expression), (exprs = trim(exprs, compressor, first_in_statement)) && make_sequence(this, exprs);
            }
            if (is_func_expr(this.expression) && (!this.expression.name || !this.expression.name.definition().references.length)) {
                var node = this.clone();
                return node.expression.process_expression(!1, compressor), node;
            }
            return this;
        }
        var args = trim(this.args, compressor, first_in_statement);
        return args && make_sequence(this, args);
    }), def_drop_side_effect_free(AST_Accessor, return_null), def_drop_side_effect_free(AST_Function, return_null), def_drop_side_effect_free(AST_Arrow, return_null), def_drop_side_effect_free(AST_Class, function(compressor) {
        const with_effects = [], trimmed_extends = this.extends && this.extends.drop_side_effect_free(compressor);
        for (const prop of (trimmed_extends && with_effects.push(trimmed_extends), this.properties)){
            const trimmed_prop = prop.drop_side_effect_free(compressor);
            trimmed_prop && with_effects.push(trimmed_prop);
        }
        return with_effects.length ? make_sequence(this, with_effects) : null;
    }), def_drop_side_effect_free(AST_Binary, function(compressor, first_in_statement) {
        var right = this.right.drop_side_effect_free(compressor);
        if (!right) return this.left.drop_side_effect_free(compressor, first_in_statement);
        if (lazy_op.has(this.operator)) {
            if (right === this.right) return this;
            var node = this.clone();
            return node.right = right, node;
        }
        var left = this.left.drop_side_effect_free(compressor, first_in_statement);
        return left ? make_sequence(this, [
            left,
            right
        ]) : this.right.drop_side_effect_free(compressor, first_in_statement);
    }), def_drop_side_effect_free(AST_Assign, function(compressor) {
        if (this.logical) return this;
        var left = this.left;
        if (left.has_side_effects(compressor) || compressor.has_directive("use strict") && left instanceof AST_PropAccess && left.expression.is_constant()) return this;
        for(set_flag(this, 0b00100000); left instanceof AST_PropAccess;)left = left.expression;
        return left.is_constant_expression(compressor.find_parent(AST_Scope)) ? this.right.drop_side_effect_free(compressor) : this;
    }), def_drop_side_effect_free(AST_Conditional, function(compressor) {
        var consequent = this.consequent.drop_side_effect_free(compressor), alternative = this.alternative.drop_side_effect_free(compressor);
        if (consequent === this.consequent && alternative === this.alternative) return this;
        if (!consequent) return alternative ? make_node(AST_Binary, this, {
            operator: "||",
            left: this.condition,
            right: alternative
        }) : this.condition.drop_side_effect_free(compressor);
        if (!alternative) return make_node(AST_Binary, this, {
            operator: "&&",
            left: this.condition,
            right: consequent
        });
        var node = this.clone();
        return node.consequent = consequent, node.alternative = alternative, node;
    }), def_drop_side_effect_free(AST_Unary, function(compressor, first_in_statement) {
        if (unary_side_effects.has(this.operator)) return this.expression.has_side_effects(compressor) ? clear_flag(this, 0b00100000) : set_flag(this, 0b00100000), this;
        if ("typeof" == this.operator && this.expression instanceof AST_SymbolRef) return null;
        var expression = this.expression.drop_side_effect_free(compressor, first_in_statement);
        return first_in_statement && expression && is_iife_call(expression) ? expression === this.expression && "!" == this.operator ? this : expression.negate(compressor, first_in_statement) : expression;
    }), def_drop_side_effect_free(AST_SymbolRef, function(compressor) {
        return this.is_declared(compressor) || pure_prop_access_globals.has(this.name) ? null : this;
    }), def_drop_side_effect_free(AST_Object, function(compressor, first_in_statement) {
        var values = trim(this.properties, compressor, first_in_statement);
        return values && make_sequence(this, values);
    }), def_drop_side_effect_free(AST_ObjectProperty, function(compressor, first_in_statement) {
        const key = this instanceof AST_ObjectKeyVal && this.key instanceof AST_Node && this.key.drop_side_effect_free(compressor, first_in_statement), value = this.value && this.value.drop_side_effect_free(compressor, first_in_statement);
        return key && value ? make_sequence(this, [
            key,
            value
        ]) : key || value;
    }), def_drop_side_effect_free(AST_ClassProperty, function(compressor) {
        const key = this.computed_key() && this.key.drop_side_effect_free(compressor), value = this.static && this.value && this.value.drop_side_effect_free(compressor);
        return key && value ? make_sequence(this, [
            key,
            value
        ]) : key || value || null;
    }), def_drop_side_effect_free(AST_ConciseMethod, function() {
        return this.computed_key() ? this.key : null;
    }), def_drop_side_effect_free(AST_ObjectGetter, function() {
        return this.computed_key() ? this.key : null;
    }), def_drop_side_effect_free(AST_ObjectSetter, function() {
        return this.computed_key() ? this.key : null;
    }), def_drop_side_effect_free(AST_Array, function(compressor, first_in_statement) {
        var values = trim(this.elements, compressor, first_in_statement);
        return values && make_sequence(this, values);
    }), def_drop_side_effect_free(AST_Dot, function(compressor, first_in_statement) {
        return is_nullish_shortcircuited(this, compressor) ? this.expression.drop_side_effect_free(compressor, first_in_statement) : this.expression.may_throw_on_access(compressor) ? this : this.expression.drop_side_effect_free(compressor, first_in_statement);
    }), def_drop_side_effect_free(AST_Sub, function(compressor, first_in_statement) {
        if (is_nullish_shortcircuited(this, compressor)) return this.expression.drop_side_effect_free(compressor, first_in_statement);
        if (this.expression.may_throw_on_access(compressor)) return this;
        var expression = this.expression.drop_side_effect_free(compressor, first_in_statement);
        if (!expression) return this.property.drop_side_effect_free(compressor, first_in_statement);
        var property = this.property.drop_side_effect_free(compressor);
        return property ? make_sequence(this, [
            expression,
            property
        ]) : expression;
    }), def_drop_side_effect_free(AST_Chain, function(compressor, first_in_statement) {
        return this.expression.drop_side_effect_free(compressor, first_in_statement);
    }), def_drop_side_effect_free(AST_Sequence, function(compressor) {
        var last = this.tail_node(), expr = last.drop_side_effect_free(compressor);
        if (expr === last) return this;
        var expressions = this.expressions.slice(0, -1);
        return (expr && expressions.push(expr), expressions.length) ? make_sequence(this, expressions) : make_node(AST_Number, this, {
            value: 0
        });
    }), def_drop_side_effect_free(AST_Expansion, function(compressor, first_in_statement) {
        return this.expression.drop_side_effect_free(compressor, first_in_statement);
    }), def_drop_side_effect_free(AST_TemplateSegment, return_null), def_drop_side_effect_free(AST_TemplateString, function(compressor) {
        var values = trim(this.segments, compressor, first_in_statement);
        return values && make_sequence(this, values);
    }), def_reduce_vars(AST_Node, noop);
    const suppress = (node)=>walk(node, (node)=>{
            if (node instanceof AST_Symbol) {
                var d = node.definition();
                d && (node instanceof AST_SymbolRef && d.references.push(node), d.fixed = !1);
            }
        });
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function loop_body(x) {
        return x instanceof AST_IterationStatement && x.body instanceof AST_BlockStatement ? x.body : x;
    }
    // Remove code which we know is unreachable.
    function trim_unreachable_code(compressor, stat, target) {
        walk(stat, (node)=>node instanceof AST_Var ? (node.remove_initializers(), target.push(node), !0) : node instanceof AST_Defun && (node === stat || !compressor.has_directive("use strict")) ? (target.push(node === stat ? node : make_node(AST_Var, node, {
                definitions: [
                    make_node(AST_VarDef, node, {
                        name: make_node(AST_SymbolVar, node.name, node.name),
                        value: null
                    })
                ]
            })), !0) : node instanceof AST_Export || node instanceof AST_Import ? (target.push(node), !0) : node instanceof AST_Scope || void 0);
    }
    // Tighten a bunch of statements together, and perform statement-level optimization.
    function tighten_body(statements, compressor) {
        var scope = compressor.find_parent(AST_Scope).get_defun_scope();
        !function() {
            var node = compressor.self(), level = 0;
            do if (node instanceof AST_Catch || node instanceof AST_Finally) level++;
            else if (node instanceof AST_IterationStatement) in_loop = !0;
            else if (node instanceof AST_Scope) {
                scope = node;
                break;
            } else node instanceof AST_Try && (in_try = !0);
            while (node = compressor.parent(level++))
        }();
        var in_loop, in_try, CHANGED, max_iter = 10;
        do CHANGED = !1, function eliminate_spurious_blocks(statements) {
            for(var seen_dirs = [], i = 0; i < statements.length;){
                var stat = statements[i];
                stat instanceof AST_BlockStatement && stat.body.every(can_be_evicted_from_block) ? (CHANGED = !0, eliminate_spurious_blocks(stat.body), statements.splice(i, 1, ...stat.body), i += stat.body.length) : stat instanceof AST_EmptyStatement ? (CHANGED = !0, statements.splice(i, 1)) : stat instanceof AST_Directive ? 0 > seen_dirs.indexOf(stat.value) ? (i++, seen_dirs.push(stat.value)) : (CHANGED = !0, statements.splice(i, 1)) : i++;
            }
        }(statements), compressor.option("dead_code") && function(statements, compressor) {
            for(var has_quit, self1 = compressor.self(), i = 0, n = 0, len = statements.length; i < len; i++){
                var stat = statements[i];
                if (stat instanceof AST_LoopControl) {
                    var lct = compressor.loopcontrol_target(stat);
                    stat instanceof AST_Break && !(lct instanceof AST_IterationStatement) && loop_body(lct) === self1 || stat instanceof AST_Continue && loop_body(lct) === self1 ? stat.label && remove(stat.label.thedef.references, stat) : statements[n++] = stat;
                } else statements[n++] = stat;
                if (aborts(stat)) {
                    has_quit = statements.slice(i + 1);
                    break;
                }
            }
            statements.length = n, CHANGED = n != len, has_quit && has_quit.forEach(function(stat) {
                trim_unreachable_code(compressor, stat, statements);
            });
        }(statements, compressor), compressor.option("if_return") && function(statements, compressor) {
            for(var self1 = compressor.self(), multiple_if_returns = function(statements) {
                for(var n = 0, i = statements.length; --i >= 0;){
                    var stat = statements[i];
                    if (stat instanceof AST_If && stat.body instanceof AST_Return && ++n > 1) return !0;
                }
                return !1;
            }(statements), in_lambda = self1 instanceof AST_Lambda, i = statements.length; --i >= 0;){
                var stat = statements[i], j = next_index(i), next = statements[j];
                if (in_lambda && !next && stat instanceof AST_Return) {
                    if (!stat.value) {
                        CHANGED = !0, statements.splice(i, 1);
                        continue;
                    }
                    if (stat.value instanceof AST_UnaryPrefix && "void" == stat.value.operator) {
                        CHANGED = !0, statements[i] = make_node(AST_SimpleStatement, stat, {
                            body: stat.value.expression
                        });
                        continue;
                    }
                }
                if (stat instanceof AST_If) {
                    var ab = aborts(stat.body);
                    if (can_merge_flow(ab)) {
                        ab.label && remove(ab.label.thedef.references, ab), CHANGED = !0, (stat = stat.clone()).condition = stat.condition.negate(compressor);
                        var body = as_statement_array_with_return(stat.body, ab);
                        stat.body = make_node(AST_BlockStatement, stat, {
                            body: as_statement_array(stat.alternative).concat(extract_functions())
                        }), stat.alternative = make_node(AST_BlockStatement, stat, {
                            body: body
                        }), statements[i] = stat.transform(compressor);
                        continue;
                    }
                    var ab = aborts(stat.alternative);
                    if (can_merge_flow(ab)) {
                        ab.label && remove(ab.label.thedef.references, ab), CHANGED = !0, (stat = stat.clone()).body = make_node(AST_BlockStatement, stat.body, {
                            body: as_statement_array(stat.body).concat(extract_functions())
                        });
                        var body = as_statement_array_with_return(stat.alternative, ab);
                        stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
                            body: body
                        }), statements[i] = stat.transform(compressor);
                        continue;
                    }
                }
                if (stat instanceof AST_If && stat.body instanceof AST_Return) {
                    var value = stat.body.value;
                    //---
                    // pretty silly case, but:
                    // if (foo()) return; return; ==> foo(); return;
                    if (!value && !stat.alternative && (in_lambda && !next || next instanceof AST_Return && !next.value)) {
                        CHANGED = !0, statements[i] = make_node(AST_SimpleStatement, stat.condition, {
                            body: stat.condition
                        });
                        continue;
                    }
                    //---
                    // if (foo()) return x; return y; ==> return foo() ? x : y;
                    if (value && !stat.alternative && next instanceof AST_Return && next.value) {
                        CHANGED = !0, (stat = stat.clone()).alternative = next, statements[i] = stat.transform(compressor), statements.splice(j, 1);
                        continue;
                    }
                    //---
                    // if (foo()) return x; [ return ; ] ==> return foo() ? x : undefined;
                    if (value && !stat.alternative && (!next && in_lambda && multiple_if_returns || next instanceof AST_Return)) {
                        CHANGED = !0, (stat = stat.clone()).alternative = next || make_node(AST_Return, stat, {
                            value: null
                        }), statements[i] = stat.transform(compressor), next && statements.splice(j, 1);
                        continue;
                    }
                    //---
                    // if (a) return b; if (c) return d; e; ==> return a ? b : c ? d : void e;
                    //
                    // if sequences is not enabled, this can lead to an endless loop (issue #866).
                    // however, with sequences on this helps producing slightly better output for
                    // the example code.
                    var prev = statements[function(i) {
                        for(var j = i; --j >= 0;){
                            var stat = statements[j];
                            if (!(stat instanceof AST_Var && declarations_only(stat))) break;
                        }
                        return j;
                    }(i)];
                    if (compressor.option("sequences") && in_lambda && !stat.alternative && prev instanceof AST_If && prev.body instanceof AST_Return && next_index(j) == statements.length && next instanceof AST_SimpleStatement) {
                        CHANGED = !0, (stat = stat.clone()).alternative = make_node(AST_BlockStatement, next, {
                            body: [
                                next,
                                make_node(AST_Return, next, {
                                    value: null
                                })
                            ]
                        }), statements[i] = stat.transform(compressor), statements.splice(j, 1);
                        continue;
                    }
                }
            }
            function can_merge_flow(ab) {
                if (!ab) return !1;
                for(var value, j = i + 1, len = statements.length; j < len; j++){
                    var stat = statements[j];
                    if (stat instanceof AST_Const || stat instanceof AST_Let) return !1;
                }
                var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab) : null;
                return ab instanceof AST_Return && in_lambda && (!(value = ab.value) || value instanceof AST_UnaryPrefix && "void" == value.operator) || ab instanceof AST_Continue && self1 === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self1 === lct;
            }
            function extract_functions() {
                var tail = statements.slice(i + 1);
                return statements.length = i + 1, tail.filter(function(stat) {
                    return !(stat instanceof AST_Defun) || (statements.push(stat), !1);
                });
            }
            function as_statement_array_with_return(node, ab) {
                var body = as_statement_array(node).slice(0, -1);
                return ab.value && body.push(make_node(AST_SimpleStatement, ab.value, {
                    body: ab.value.expression
                })), body;
            }
            function next_index(i) {
                for(var j = i + 1, len = statements.length; j < len; j++){
                    var stat = statements[j];
                    if (!(stat instanceof AST_Var && declarations_only(stat))) break;
                }
                return j;
            }
        }(statements, compressor), compressor.sequences_limit > 0 && (function(statements, compressor) {
            if (!(statements.length < 2)) {
                for(var seq = [], n = 0, i = 0, len = statements.length; i < len; i++){
                    var stat = statements[i];
                    if (stat instanceof AST_SimpleStatement) {
                        seq.length >= compressor.sequences_limit && push_seq();
                        var body = stat.body;
                        seq.length > 0 && (body = body.drop_side_effect_free(compressor)), body && merge_sequence(seq, body);
                    } else stat instanceof AST_Definitions && declarations_only(stat) || stat instanceof AST_Defun || push_seq(), statements[n++] = stat;
                }
                push_seq(), statements.length = n, n != len && (CHANGED = !0);
            }
            function push_seq() {
                if (seq.length) {
                    var body = make_sequence(seq[0], seq);
                    statements[n++] = make_node(AST_SimpleStatement, body, {
                        body: body
                    }), seq = [];
                }
            }
        }(statements, compressor), function(statements, compressor) {
            function cons_seq(right) {
                n--, CHANGED = !0;
                var left = prev.body;
                return make_sequence(left, [
                    left,
                    right
                ]).transform(compressor);
            }
            for(var prev, n = 0, i = 0; i < statements.length; i++){
                var stat = statements[i];
                if (!prev || (stat instanceof AST_Exit ? stat.value = cons_seq(stat.value || make_node(AST_Undefined, stat).transform(compressor)) : stat instanceof AST_For ? stat.init instanceof AST_Definitions || walk(prev.body, (node)=>node instanceof AST_Scope || (node instanceof AST_Binary && "in" === node.operator ? walk_abort : void 0)) || (stat.init ? stat.init = cons_seq(stat.init) : (stat.init = prev.body, n--, CHANGED = !0)) : stat instanceof AST_ForIn ? stat.init instanceof AST_Const || stat.init instanceof AST_Let || (stat.object = cons_seq(stat.object)) : stat instanceof AST_If ? stat.condition = cons_seq(stat.condition) : stat instanceof AST_Switch ? stat.expression = cons_seq(stat.expression) : stat instanceof AST_With && (stat.expression = cons_seq(stat.expression))), compressor.option("conditionals") && stat instanceof AST_If) {
                    var decls = [], body = to_simple_statement(stat.body, decls), alt = to_simple_statement(stat.alternative, decls);
                    if (!1 !== body && !1 !== alt && decls.length > 0) {
                        var len = decls.length;
                        decls.push(make_node(AST_If, stat, {
                            condition: stat.condition,
                            body: body || make_node(AST_EmptyStatement, stat.body),
                            alternative: alt
                        })), decls.unshift(n, 1), [].splice.apply(statements, decls), i += len, n += len + 1, prev = null, CHANGED = !0;
                        continue;
                    }
                }
                statements[n++] = stat, prev = stat instanceof AST_SimpleStatement ? stat : null;
            }
            statements.length = n;
        }(statements, compressor)), compressor.option("join_vars") && function(statements) {
            for(var defs, i = 0, j = -1, len = statements.length; i < len; i++){
                var stat = statements[i], prev = statements[j];
                if (stat instanceof AST_Definitions) prev && prev.TYPE == stat.TYPE ? (prev.definitions = prev.definitions.concat(stat.definitions), CHANGED = !0) : defs && defs.TYPE == stat.TYPE && declarations_only(stat) ? (defs.definitions = defs.definitions.concat(stat.definitions), CHANGED = !0) : (statements[++j] = stat, defs = stat);
                else if (stat instanceof AST_Exit) stat.value = extract_object_assignments(stat.value);
                else if (stat instanceof AST_For) {
                    var exprs = join_object_assignments(prev, stat.init);
                    exprs ? (CHANGED = !0, stat.init = exprs.length ? make_sequence(stat.init, exprs) : null, statements[++j] = stat) : prev instanceof AST_Var && (!stat.init || stat.init.TYPE == prev.TYPE) ? (stat.init && (prev.definitions = prev.definitions.concat(stat.init.definitions)), stat.init = prev, statements[j] = stat, CHANGED = !0) : defs && stat.init && defs.TYPE == stat.init.TYPE && declarations_only(stat.init) ? (defs.definitions = defs.definitions.concat(stat.init.definitions), stat.init = null, statements[++j] = stat, CHANGED = !0) : statements[++j] = stat;
                } else if (stat instanceof AST_ForIn) stat.object = extract_object_assignments(stat.object);
                else if (stat instanceof AST_If) stat.condition = extract_object_assignments(stat.condition);
                else if (stat instanceof AST_SimpleStatement) {
                    var exprs = join_object_assignments(prev, stat.body);
                    if (exprs) {
                        if (CHANGED = !0, !exprs.length) continue;
                        stat.body = make_sequence(stat.body, exprs);
                    }
                    statements[++j] = stat;
                } else stat instanceof AST_Switch ? stat.expression = extract_object_assignments(stat.expression) : stat instanceof AST_With ? stat.expression = extract_object_assignments(stat.expression) : statements[++j] = stat;
            }
            function extract_object_assignments(value) {
                statements[++j] = stat;
                var exprs = join_object_assignments(prev, value);
                return exprs ? (CHANGED = !0, exprs.length) ? make_sequence(value, exprs) : value instanceof AST_Sequence ? value.tail_node().left : value.left : value;
            }
            statements.length = j + 1;
        }(statements), compressor.option("collapse_vars") && // Search from right to left for assignment-like expressions:
        // - `var a = x;`
        // - `a = x;`
        // - `++a`
        // For each candidate, scan from left to right for first usage, then try
        // to fold assignment into the site for compression.
        // Will not attempt to collapse assignments into or past code blocks
        // which are not sequentially executed, e.g. loops and conditionals.
        function(statements, compressor) {
            if (!scope.pinned()) for(var args, candidates = [], stat_index = statements.length, scanner = new TreeTransformer(function(node) {
                if (abort) return node;
                // Skip nodes before `candidate` as quickly as possible
                if (!hit) return node !== hit_stack[hit_index] ? node : ++hit_index < hit_stack.length ? handle_custom_scan_order(node) : (hit = !0, (stop_after = function find_stop(node, level, write_only) {
                    var parent = scanner.parent(level);
                    return parent instanceof AST_Assign ? !write_only || parent.logical || parent.left instanceof AST_PropAccess || lvalues.has(parent.left.name) ? node : find_stop(parent, level + 1, write_only) : parent instanceof AST_Binary ? write_only && (!lazy_op.has(parent.operator) || parent.left === node) ? find_stop(parent, level + 1, write_only) : node : parent instanceof AST_Call || parent instanceof AST_Case ? node : parent instanceof AST_Conditional ? write_only && parent.condition === node ? find_stop(parent, level + 1, write_only) : node : parent instanceof AST_Definitions ? find_stop(parent, level + 1, !0) : parent instanceof AST_Exit ? write_only ? find_stop(parent, level + 1, write_only) : node : parent instanceof AST_If ? write_only && parent.condition === node ? find_stop(parent, level + 1, write_only) : node : parent instanceof AST_IterationStatement ? node : parent instanceof AST_Sequence ? find_stop(parent, level + 1, parent.tail_node() !== node) : parent instanceof AST_SimpleStatement ? find_stop(parent, level + 1, !0) : parent instanceof AST_Switch || parent instanceof AST_VarDef ? node : null;
                }(node, 0)) === node && (abort = !0), node);
                // Stop immediately if these node types are encountered
                var sym, parent = scanner.parent();
                if (node instanceof AST_Assign && (node.logical || "=" != node.operator && lhs.equivalent_to(node.left)) || node instanceof AST_Await || node instanceof AST_Call && lhs instanceof AST_PropAccess && lhs.equivalent_to(node.expression) || node instanceof AST_Debugger || node instanceof AST_Destructuring || node instanceof AST_Expansion && node.expression instanceof AST_Symbol && (node.expression instanceof AST_This || node.expression.definition().references.length > 1) || node instanceof AST_IterationStatement && !(node instanceof AST_For) || node instanceof AST_LoopControl || node instanceof AST_Try || node instanceof AST_With || node instanceof AST_Yield || node instanceof AST_Export || node instanceof AST_Class || parent instanceof AST_For && node !== parent.init || !replace_all && node instanceof AST_SymbolRef && !node.is_declared(compressor) && !pure_prop_access_globals.has(node) || node instanceof AST_SymbolRef && parent instanceof AST_Call && has_annotation(parent, _NOINLINE)) return abort = !0, node;
                // Replace variable with assignment when found
                if (!stop_if_hit && (!lhs_local || !replace_all) && (parent instanceof AST_Binary && lazy_op.has(parent.operator) && parent.left !== node || parent instanceof AST_Conditional && parent.condition !== node || parent instanceof AST_If && parent.condition !== node) && (stop_if_hit = parent), can_replace && !(node instanceof AST_SymbolDeclaration) && lhs.equivalent_to(node) && !function(newScope, lvalues) {
                    for (const { def } of lvalues.values()){
                        let current = newScope;
                        for(; current && current !== def.scope;){
                            let nested_def = current.variables.get(def.name);
                            if (nested_def && nested_def !== def) return !0;
                            current = current.parent_scope;
                        }
                    }
                    return !1;
                }(node.scope, lvalues)) {
                    if (stop_if_hit) return abort = !0, node;
                    if (is_lhs(node, parent)) return value_def && replaced++, node;
                    if (replaced++, value_def && candidate instanceof AST_VarDef) return node;
                    if (CHANGED = abort = !0, candidate instanceof AST_UnaryPostfix) return make_node(AST_UnaryPrefix, candidate, candidate);
                    if (candidate instanceof AST_VarDef) {
                        var def = candidate.name.definition(), value = candidate.value;
                        return def.references.length - def.replaced != 1 || compressor.exposed(def) ? make_node(AST_Assign, candidate, {
                            operator: "=",
                            logical: !1,
                            left: make_node(AST_SymbolRef, candidate.name, candidate.name),
                            right: value
                        }) : (def.replaced++, funarg && is_identifier_atom(value)) ? value.transform(compressor) : maintain_this_binding(parent, node, value);
                    }
                    return clear_flag(candidate, 0b00100000), candidate;
                }
                return (node instanceof AST_Call || node instanceof AST_Exit && (side_effects || lhs instanceof AST_PropAccess || may_modify(lhs)) || node instanceof AST_PropAccess && (side_effects || node.expression.may_throw_on_access(compressor)) || node instanceof AST_SymbolRef && (lvalues.has(node.name) && lvalues.get(node.name).modified || side_effects && may_modify(node)) || node instanceof AST_VarDef && node.value && (lvalues.has(node.name.name) || side_effects && may_modify(node.name)) || (sym = is_lhs(node.left, node)) && (sym instanceof AST_PropAccess || lvalues.has(sym.name)) || may_throw && (in_try ? node.has_side_effects(compressor) : function side_effects_external(node, lhs) {
                    if (node instanceof AST_Assign) return side_effects_external(node.left, !0);
                    if (node instanceof AST_Unary) return side_effects_external(node.expression, !0);
                    if (node instanceof AST_VarDef) return node.value && side_effects_external(node.value);
                    if (lhs) {
                        if (node instanceof AST_Dot || node instanceof AST_Sub) return side_effects_external(node.expression, !0);
                        if (node instanceof AST_SymbolRef) return node.definition().scope !== scope;
                    }
                    return !1;
                }(node))) && (stop_after = node, node instanceof AST_Scope && (abort = !0)), handle_custom_scan_order(node);
            }, function(node) {
                abort || (stop_after === node && (abort = !0), stop_if_hit !== node || (stop_if_hit = null));
            }), multi_replacer = new TreeTransformer(function(node) {
                if (abort) return node;
                // Skip nodes before `candidate` as quickly as possible
                if (!hit) {
                    if (node !== hit_stack[hit_index]) return node;
                    if (++hit_index < hit_stack.length) return;
                    return hit = !0, node;
                }
                return(// Replace variable when found
                node instanceof AST_SymbolRef && node.name == def.name ? (--replaced || (abort = !0), is_lhs(node, multi_replacer.parent())) ? node : (def.replaced++, value_def.replaced--, candidate.value) : node instanceof AST_Default || node instanceof AST_Scope ? node : void 0);
            }); --stat_index >= 0;){
                0 == stat_index && compressor.option("unused") && function() {
                    var iife, fn = compressor.self();
                    if (is_func_expr(fn) && !fn.name && !fn.uses_arguments && !fn.pinned() && (iife = compressor.parent()) instanceof AST_Call && iife.expression === fn && iife.args.every((arg)=>!(arg instanceof AST_Expansion))) {
                        var fn_strict = compressor.has_directive("use strict");
                        fn_strict && !member(fn_strict, fn.body) && (fn_strict = !1);
                        var len = fn.argnames.length;
                        args = iife.args.slice(len);
                        for(var names = new Set(), i = len; --i >= 0;){
                            var sym = fn.argnames[i], arg = iife.args[i];
                            // The following two line fix is a duplicate of the fix at
                            // https://github.com/terser/terser/commit/011d3eb08cefe6922c7d1bdfa113fc4aeaca1b75
                            // This might mean that these two pieces of code (one here in collapse_vars and another in reduce_vars
                            // Might be doing the exact same thing.
                            const def = sym.definition && sym.definition();
                            if ((!def || !(def.orig.length > 1)) && (args.unshift(make_node(AST_VarDef, sym, {
                                name: sym,
                                value: arg
                            })), !names.has(sym.name))) {
                                if (names.add(sym.name), sym instanceof AST_Expansion) {
                                    var elements = iife.args.slice(i);
                                    elements.every((arg)=>!has_overlapping_symbol(fn, arg, fn_strict)) && candidates.unshift([
                                        make_node(AST_VarDef, sym, {
                                            name: sym.expression,
                                            value: make_node(AST_Array, iife, {
                                                elements: elements
                                            })
                                        })
                                    ]);
                                } else arg ? (arg instanceof AST_Lambda && arg.pinned() || has_overlapping_symbol(fn, arg, fn_strict)) && (arg = null) : arg = make_node(AST_Undefined, sym).transform(compressor), arg && candidates.unshift([
                                    make_node(AST_VarDef, sym, {
                                        name: sym,
                                        value: arg
                                    })
                                ]);
                            }
                        }
                    }
                }();
                // Find collapsible assignments
                var hit_stack = [];
                for(function extract_candidates(expr) {
                    if (hit_stack.push(expr), expr instanceof AST_Assign) expr.left.has_side_effects(compressor) || expr.right instanceof AST_Chain || candidates.push(hit_stack.slice()), extract_candidates(expr.right);
                    else if (expr instanceof AST_Binary) extract_candidates(expr.left), extract_candidates(expr.right);
                    else if (expr instanceof AST_Call && !has_annotation(expr, _NOINLINE)) extract_candidates(expr.expression), expr.args.forEach(extract_candidates);
                    else if (expr instanceof AST_Case) extract_candidates(expr.expression);
                    else if (expr instanceof AST_Conditional) extract_candidates(expr.condition), extract_candidates(expr.consequent), extract_candidates(expr.alternative);
                    else if (expr instanceof AST_Definitions) {
                        var len = expr.definitions.length, i = len - 200;
                        for(i < 0 && (i = 0); i < len; i++)extract_candidates(expr.definitions[i]);
                    } else expr instanceof AST_DWLoop ? (extract_candidates(expr.condition), expr.body instanceof AST_Block || extract_candidates(expr.body)) : expr instanceof AST_Exit ? expr.value && extract_candidates(expr.value) : expr instanceof AST_For ? (expr.init && extract_candidates(expr.init), expr.condition && extract_candidates(expr.condition), expr.step && extract_candidates(expr.step), expr.body instanceof AST_Block || extract_candidates(expr.body)) : expr instanceof AST_ForIn ? (extract_candidates(expr.object), expr.body instanceof AST_Block || extract_candidates(expr.body)) : expr instanceof AST_If ? (extract_candidates(expr.condition), expr.body instanceof AST_Block || extract_candidates(expr.body), !expr.alternative || expr.alternative instanceof AST_Block || extract_candidates(expr.alternative)) : expr instanceof AST_Sequence ? expr.expressions.forEach(extract_candidates) : expr instanceof AST_SimpleStatement ? extract_candidates(expr.body) : expr instanceof AST_Switch ? (extract_candidates(expr.expression), expr.body.forEach(extract_candidates)) : expr instanceof AST_Unary ? ("++" == expr.operator || "--" == expr.operator) && candidates.push(hit_stack.slice()) : expr instanceof AST_VarDef && expr.value && !(expr.value instanceof AST_Chain) && (candidates.push(hit_stack.slice()), extract_candidates(expr.value));
                    hit_stack.pop();
                }(statements[stat_index]); candidates.length > 0;){
                    hit_stack = candidates.pop();
                    var hit_index = 0, candidate = hit_stack[hit_stack.length - 1], value_def = null, stop_after = null, stop_if_hit = null, lhs = function(expr) {
                        if (expr instanceof AST_Assign && expr.logical) return !1;
                        if (expr instanceof AST_VarDef && expr.name instanceof AST_SymbolDeclaration) {
                            var def = expr.name.definition();
                            if (!member(expr.name, def.orig)) return;
                            var referenced = def.references.length - def.replaced;
                            if (!referenced) return;
                            if (def.orig.length - def.eliminated > 1 && !(expr.name instanceof AST_SymbolFunarg) || (referenced > 1 ? function(var_def) {
                                var value = var_def.value;
                                if (value instanceof AST_SymbolRef && "arguments" != value.name) {
                                    var def = value.definition();
                                    if (!def.undeclared) return value_def = def;
                                }
                            }(expr) : !compressor.exposed(def))) return make_node(AST_SymbolRef, expr.name, expr.name);
                        } else {
                            const lhs = expr instanceof AST_Assign ? expr.left : expr.expression;
                            return !is_ref_of(lhs, AST_SymbolConst) && !is_ref_of(lhs, AST_SymbolLet) && lhs;
                        }
                    }(candidate);
                    if (!(!lhs || function is_lhs_read_only(lhs) {
                        if (lhs instanceof AST_This) return !0;
                        if (lhs instanceof AST_SymbolRef) return lhs.definition().orig[0] instanceof AST_SymbolLambda;
                        if (lhs instanceof AST_PropAccess) {
                            if ((lhs = lhs.expression) instanceof AST_SymbolRef) {
                                if (lhs.is_immutable()) return !1;
                                lhs = lhs.fixed_value();
                            }
                            return !lhs || !(lhs instanceof AST_RegExp) && (lhs instanceof AST_Constant || is_lhs_read_only(lhs));
                        }
                        return !1;
                    }(lhs) || lhs.has_side_effects(compressor))) {
                        // Locate symbols which may execute code outside of scanning range
                        var expr, lvalues = function(expr) {
                            var lvalues = new Map();
                            if (expr instanceof AST_Unary) return lvalues;
                            var tw = new TreeWalker(function(node) {
                                for(var sym = node; sym instanceof AST_PropAccess;)sym = sym.expression;
                                if (sym instanceof AST_SymbolRef) {
                                    const prev = lvalues.get(sym.name);
                                    prev && prev.modified || lvalues.set(sym.name, {
                                        def: sym.definition(),
                                        modified: is_modified(compressor, tw, node, node, 0)
                                    });
                                }
                            });
                            return get_rvalue(expr).walk(tw), lvalues;
                        }(candidate), lhs_local = function(lhs) {
                            for(; lhs instanceof AST_PropAccess;)lhs = lhs.expression;
                            return lhs instanceof AST_SymbolRef && lhs.definition().scope === scope && !(in_loop && (lvalues.has(lhs.name) || candidate instanceof AST_Unary || candidate instanceof AST_Assign && !candidate.logical && "=" != candidate.operator));
                        }(lhs);
                        lhs instanceof AST_SymbolRef && lvalues.set(lhs.name, {
                            def: lhs.definition(),
                            modified: !1
                        });
                        var side_effects = (expr = candidate) instanceof AST_Unary ? unary_side_effects.has(expr.operator) : get_rvalue(expr).has_side_effects(compressor), replace_all = function() {
                            if (side_effects) return !1;
                            if (value_def) return !0;
                            if (lhs instanceof AST_SymbolRef) {
                                var def = lhs.definition();
                                if (def.references.length - def.replaced == (candidate instanceof AST_VarDef ? 1 : 2)) return !0;
                            }
                            return !1;
                        }(), may_throw = candidate.may_throw(compressor), funarg = candidate.name instanceof AST_SymbolFunarg, hit = funarg, abort = !1, replaced = 0, can_replace = !args || !hit;
                        if (!can_replace) {
                            for(var j = compressor.self().argnames.lastIndexOf(candidate.name) + 1; !abort && j < args.length; j++)args[j].transform(scanner);
                            can_replace = !0;
                        }
                        for(var i = stat_index; !abort && i < statements.length; i++)statements[i].transform(scanner);
                        if (value_def) {
                            var def = candidate.name.definition();
                            if (abort && def.references.length - def.replaced > replaced) replaced = !1;
                            else {
                                abort = !1, hit_index = 0, hit = funarg;
                                for(var i = stat_index; !abort && i < statements.length; i++)statements[i].transform(multi_replacer);
                                value_def.single_use = !1;
                            }
                        }
                        replaced && !function(expr) {
                            if (expr.name instanceof AST_SymbolFunarg) {
                                var iife = compressor.parent(), argnames = compressor.self().argnames, index = argnames.indexOf(expr.name);
                                if (index < 0) iife.args.length = Math.min(iife.args.length, argnames.length - 1);
                                else {
                                    var args = iife.args;
                                    args[index] && (args[index] = make_node(AST_Number, args[index], {
                                        value: 0
                                    }));
                                }
                                return !0;
                            }
                            var found = !1;
                            return statements[stat_index].transform(new TreeTransformer(function(node, descend, in_list) {
                                return found ? node : node === expr || node.body === expr ? (found = !0, node instanceof AST_VarDef) ? (node.value = node.name instanceof AST_SymbolConst ? make_node(AST_Undefined, node.value) // `const` always needs value.
                                 : null, node) : in_list ? MAP.skip : null : void 0;
                            }, function(node) {
                                if (node instanceof AST_Sequence) switch(node.expressions.length){
                                    case 0:
                                        return null;
                                    case 1:
                                        return node.expressions[0];
                                }
                            }));
                        }(candidate) && statements.splice(stat_index, 1);
                    }
                }
            }
            function handle_custom_scan_order(node) {
                // Skip (non-executed) functions
                if (node instanceof AST_Scope) return node;
                // Scan case expressions first in a switch statement
                if (node instanceof AST_Switch) {
                    node.expression = node.expression.transform(scanner);
                    for(var i = 0, len = node.body.length; !abort && i < len; i++){
                        var branch = node.body[i];
                        if (branch instanceof AST_Case) {
                            if (!hit) {
                                if (branch !== hit_stack[hit_index]) continue;
                                hit_index++;
                            }
                            if (branch.expression = branch.expression.transform(scanner), !replace_all) break;
                        }
                    }
                    return abort = !0, node;
                }
            }
            function has_overlapping_symbol(fn, arg, fn_strict) {
                var found = !1, scan_this = !(fn instanceof AST_Arrow);
                return arg.walk(new TreeWalker(function(node, descend) {
                    if (found) return !0;
                    if (node instanceof AST_SymbolRef && (fn.variables.has(node.name) || function(def, scope) {
                        if (def.global) return !1;
                        let cur_scope = def.scope;
                        for(; cur_scope && cur_scope !== scope;){
                            if (cur_scope.variables.has(def.name)) return !0;
                            cur_scope = cur_scope.parent_scope;
                        }
                        return !1;
                    }(node.definition(), fn))) {
                        var s = node.definition().scope;
                        if (s !== scope) {
                            for(; s = s.parent_scope;)if (s === scope) return !0;
                        }
                        return found = !0;
                    }
                    if ((fn_strict || scan_this) && node instanceof AST_This) return found = !0;
                    if (node instanceof AST_Scope && !(node instanceof AST_Arrow)) {
                        var prev = scan_this;
                        return scan_this = !1, descend(), scan_this = prev, !0;
                    }
                })), found;
            }
            function get_rvalue(expr) {
                return expr instanceof AST_Assign ? expr.right : expr.value;
            }
            function may_modify(sym) {
                if (!sym.definition) return !0; // AST_Destructuring
                var def = sym.definition();
                return (1 != def.orig.length || !(def.orig[0] instanceof AST_SymbolDefun)) && (def.scope.get_defun_scope() !== scope || !def.references.every((ref)=>{
                    var s = ref.scope.get_defun_scope();
                    return "Scope" == s.TYPE && (s = s.parent_scope), s === scope;
                }));
            }
        }(statements, compressor);
        while (CHANGED && max_iter-- > 0)
        function declarations_only(node) {
            return node.definitions.every((var_def)=>!var_def.value);
        }
        function to_simple_statement(block, decls) {
            if (!(block instanceof AST_BlockStatement)) return block;
            for(var stat = null, i = 0, len = block.body.length; i < len; i++){
                var line = block.body[i];
                if (line instanceof AST_Var && declarations_only(line)) decls.push(line);
                else {
                    if (stat) return !1;
                    stat = line;
                }
            }
            return stat;
        }
        function join_object_assignments(defn, body) {
            if (defn instanceof AST_Definitions) {
                var exprs, def = defn.definitions[defn.definitions.length - 1];
                if (def.value instanceof AST_Object && (body instanceof AST_Assign && !body.logical ? exprs = [
                    body
                ] : body instanceof AST_Sequence && (exprs = body.expressions.slice()), exprs)) {
                    var trimmed = !1;
                    do {
                        var node = exprs[0];
                        if (!(node instanceof AST_Assign) || "=" != node.operator || !(node.left instanceof AST_PropAccess)) break;
                        var sym = node.left.expression;
                        if (!(sym instanceof AST_SymbolRef) || def.name.name != sym.name || !node.right.is_constant_expression(scope)) break;
                        var prop = node.left.property;
                        if (prop instanceof AST_Node && (prop = prop.evaluate(compressor)), prop instanceof AST_Node) break;
                        prop = "" + prop;
                        var diff = 2015 > compressor.option("ecma") && compressor.has_directive("use strict") ? function(node) {
                            return node.key != prop && node.key && node.key.name != prop;
                        } : function(node) {
                            return node.key && node.key.name != prop;
                        };
                        if (!def.value.properties.every(diff)) break;
                        var p = def.value.properties.filter(function(p) {
                            return p.key === prop;
                        })[0];
                        p ? p.value = new AST_Sequence({
                            start: p.start,
                            expressions: [
                                p.value.clone(),
                                node.right.clone()
                            ],
                            end: p.end
                        }) : def.value.properties.push(make_node(AST_ObjectKeyVal, node, {
                            key: prop,
                            value: node.right
                        })), exprs.shift(), trimmed = !0;
                    }while (exprs.length)
                    return trimmed && exprs;
                }
            }
        }
    }
    def_reduce_vars(AST_Accessor, function(tw, descend, compressor) {
        return push(tw), reset_variables(tw, compressor, this), descend(), pop(tw), !0;
    }), def_reduce_vars(AST_Assign, function(tw, descend, compressor) {
        var node = this;
        if (node.left instanceof AST_Destructuring) {
            suppress(node.left);
            return;
        }
        const finish_walk = ()=>{
            if (node.logical) return node.left.walk(tw), push(tw), node.right.walk(tw), pop(tw), !0;
        };
        var sym = node.left;
        if (!(sym instanceof AST_SymbolRef)) return finish_walk();
        var def = sym.definition(), safe = safe_to_assign(tw, def, sym.scope, node.right);
        if (def.assignments++, !safe) return finish_walk();
        var fixed = def.fixed;
        if (!fixed && "=" != node.operator && !node.logical) return finish_walk();
        var eq = "=" == node.operator, value = eq ? node.right : node;
        return is_modified(compressor, tw, node, value, 0) ? finish_walk() : ((def.references.push(sym), node.logical || (eq || (def.chained = !0), def.fixed = eq ? function() {
            return node.right;
        } : function() {
            return make_node(AST_Binary, node, {
                operator: node.operator.slice(0, -1),
                left: fixed instanceof AST_Node ? fixed : fixed(),
                right: node.right
            });
        }), node.logical) ? (mark(tw, def, !1), push(tw), node.right.walk(tw), pop(tw)) : (mark(tw, def, !1), node.right.walk(tw), mark(tw, def, !0), mark_escaped(tw, def, sym.scope, node, value, 0, 1)), !0);
    }), def_reduce_vars(AST_Binary, function(tw) {
        if (lazy_op.has(this.operator)) return this.left.walk(tw), push(tw), this.right.walk(tw), pop(tw), !0;
    }), def_reduce_vars(AST_Block, function(tw, descend, compressor) {
        reset_block_variables(compressor, this);
    }), def_reduce_vars(AST_Case, function(tw) {
        return push(tw), this.expression.walk(tw), pop(tw), push(tw), walk_body(this, tw), pop(tw), !0;
    }), def_reduce_vars(AST_Class, function(tw, descend) {
        return clear_flag(this, 0b00010000), push(tw), descend(), pop(tw), !0;
    }), def_reduce_vars(AST_Conditional, function(tw) {
        return this.condition.walk(tw), push(tw), this.consequent.walk(tw), pop(tw), push(tw), this.alternative.walk(tw), pop(tw), !0;
    }), def_reduce_vars(AST_Chain, function(tw, descend) {
        // Chains' conditions apply left-to-right, cumulatively.
        // If we walk normally we don't go in that order because we would pop before pushing again
        // Solution: AST_PropAccess and AST_Call push when they are optional, and never pop.
        // Then we pop everything when they are done being walked.
        const safe_ids = tw.safe_ids;
        return descend(), // Unroll back to start
        tw.safe_ids = safe_ids, !0;
    }), def_reduce_vars(AST_Call, function(tw) {
        for (const arg of (this.expression.walk(tw), this.optional && // Never pop -- it's popped at AST_Chain above
        push(tw), this.args))arg.walk(tw);
        return !0;
    }), def_reduce_vars(AST_PropAccess, function(tw) {
        if (this.optional) return this.expression.walk(tw), // Never pop -- it's popped at AST_Chain above
        push(tw), this.property instanceof AST_Node && this.property.walk(tw), !0;
    }), def_reduce_vars(AST_Default, function(tw, descend) {
        return push(tw), descend(), pop(tw), !0;
    }), def_reduce_vars(AST_Lambda, function(tw, descend, compressor) {
        var iife;
        if (clear_flag(this, 0b00010000), push(tw), reset_variables(tw, compressor, this), this.uses_arguments) {
            descend(), pop(tw);
            return;
        }
        return !this.name && (iife = tw.parent()) instanceof AST_Call && iife.expression === this && !iife.args.some((arg)=>arg instanceof AST_Expansion) && this.argnames.every((arg_name)=>arg_name instanceof AST_Symbol) && // Virtually turn IIFE parameters into variable definitions:
        //   (function(a,b) {...})(c,d) => (function() {var a=c,b=d; ...})()
        // So existing transformation rules can work on them.
        this.argnames.forEach((arg, i)=>{
            if (arg.definition) {
                var d = arg.definition();
                // Avoid setting fixed when there's more than one origin for a variable value
                d.orig.length > 1 || (void 0 === d.fixed && (!this.uses_arguments || tw.has_directive("use strict")) ? (d.fixed = function() {
                    return iife.args[i] || make_node(AST_Undefined, iife);
                }, tw.loop_ids.set(d.id, tw.in_loop), mark(tw, d, !0)) : d.fixed = !1);
            }
        }), descend(), pop(tw), !0;
    }), def_reduce_vars(AST_Do, function(tw, descend, compressor) {
        reset_block_variables(compressor, this);
        const saved_loop = tw.in_loop;
        return tw.in_loop = this, push(tw), this.body.walk(tw), has_break_or_continue(this) && (pop(tw), push(tw)), this.condition.walk(tw), pop(tw), tw.in_loop = saved_loop, !0;
    }), def_reduce_vars(AST_For, function(tw, descend, compressor) {
        reset_block_variables(compressor, this), this.init && this.init.walk(tw);
        const saved_loop = tw.in_loop;
        return tw.in_loop = this, push(tw), this.condition && this.condition.walk(tw), this.body.walk(tw), this.step && (has_break_or_continue(this) && (pop(tw), push(tw)), this.step.walk(tw)), pop(tw), tw.in_loop = saved_loop, !0;
    }), def_reduce_vars(AST_ForIn, function(tw, descend, compressor) {
        reset_block_variables(compressor, this), suppress(this.init), this.object.walk(tw);
        const saved_loop = tw.in_loop;
        return tw.in_loop = this, push(tw), this.body.walk(tw), pop(tw), tw.in_loop = saved_loop, !0;
    }), def_reduce_vars(AST_If, function(tw) {
        return this.condition.walk(tw), push(tw), this.body.walk(tw), pop(tw), this.alternative && (push(tw), this.alternative.walk(tw), pop(tw)), !0;
    }), def_reduce_vars(AST_LabeledStatement, function(tw) {
        return push(tw), this.body.walk(tw), pop(tw), !0;
    }), def_reduce_vars(AST_SymbolCatch, function() {
        this.definition().fixed = !1;
    }), def_reduce_vars(AST_SymbolRef, function(tw, descend, compressor) {
        var value, fixed_value, d = this.definition();
        (d.references.push(this), 1 == d.references.length && !d.fixed && d.orig[0] instanceof AST_SymbolDefun && tw.loop_ids.set(d.id, tw.in_loop), void 0 !== d.fixed && safe_to_read(tw, d)) ? d.fixed && ((fixed_value = this.fixed_value()) instanceof AST_Lambda && is_recursive_ref(tw, d) ? d.recursive_refs++ : fixed_value && !compressor.exposed(d) && compressor.option("unused") && !d.scope.pinned() && d.references.length - d.recursive_refs == 1 && tw.loop_ids.get(d.id) === tw.in_loop ? d.single_use = fixed_value instanceof AST_Lambda && !fixed_value.pinned() || fixed_value instanceof AST_Class || d.scope === this.scope && fixed_value.is_constant_expression() : d.single_use = !1, is_modified(compressor, tw, this, fixed_value, 0, !!(value = fixed_value) && (value.is_constant() || value instanceof AST_Lambda || value instanceof AST_This)) && (d.single_use ? d.single_use = "m" : d.fixed = !1)) : d.fixed = !1, mark_escaped(tw, d, this.scope, this, fixed_value, 0, 1);
    }), def_reduce_vars(AST_Toplevel, function(tw, descend, compressor) {
        this.globals.forEach(function(def) {
            reset_def(compressor, def);
        }), reset_variables(tw, compressor, this);
    }), def_reduce_vars(AST_Try, function(tw, descend, compressor) {
        return reset_block_variables(compressor, this), push(tw), walk_body(this, tw), pop(tw), this.bcatch && (push(tw), this.bcatch.walk(tw), pop(tw)), this.bfinally && this.bfinally.walk(tw), !0;
    }), def_reduce_vars(AST_Unary, function(tw) {
        var node = this;
        if ("++" === node.operator || "--" === node.operator) {
            var exp = node.expression;
            if (exp instanceof AST_SymbolRef) {
                var def = exp.definition(), safe = safe_to_assign(tw, def, exp.scope, !0);
                if (def.assignments++, safe) {
                    var fixed = def.fixed;
                    if (fixed) return def.references.push(exp), def.chained = !0, def.fixed = function() {
                        return make_node(AST_Binary, node, {
                            operator: node.operator.slice(0, -1),
                            left: make_node(AST_UnaryPrefix, node, {
                                operator: "+",
                                expression: fixed instanceof AST_Node ? fixed : fixed()
                            }),
                            right: make_node(AST_Number, node, {
                                value: 1
                            })
                        });
                    }, mark(tw, def, !0), !0;
                }
            }
        }
    }), def_reduce_vars(AST_VarDef, function(tw, descend) {
        var node = this;
        if (node.name instanceof AST_Destructuring) {
            suppress(node.name);
            return;
        }
        var d = node.name.definition();
        if (node.value) {
            if (safe_to_assign(tw, d, node.name.scope, node.value)) return d.fixed = function() {
                return node.value;
            }, tw.loop_ids.set(d.id, tw.in_loop), mark(tw, d, !1), descend(), mark(tw, d, !0), !0;
            d.fixed = !1;
        }
    }), def_reduce_vars(AST_While, function(tw, descend, compressor) {
        reset_block_variables(compressor, this);
        const saved_loop = tw.in_loop;
        return tw.in_loop = this, push(tw), descend(), pop(tw), tw.in_loop = saved_loop, !0;
    });
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ class Compressor extends TreeWalker {
        constructor(options, { false_by_default = !1, mangle_options = !1 }){
            super(), void 0 === options.defaults || options.defaults || (false_by_default = !0), this.options = defaults(options, {
                arguments: !1,
                arrows: !false_by_default,
                booleans: !false_by_default,
                booleans_as_integers: !1,
                collapse_vars: !false_by_default,
                comparisons: !false_by_default,
                computed_props: !false_by_default,
                conditionals: !false_by_default,
                dead_code: !false_by_default,
                defaults: !0,
                directives: !false_by_default,
                drop_console: !1,
                drop_debugger: !false_by_default,
                ecma: 5,
                evaluate: !false_by_default,
                expression: !1,
                global_defs: !1,
                hoist_funs: !1,
                hoist_props: !false_by_default,
                hoist_vars: !1,
                ie8: !1,
                if_return: !false_by_default,
                inline: !false_by_default,
                join_vars: !false_by_default,
                keep_classnames: !1,
                keep_fargs: !0,
                keep_fnames: !1,
                keep_infinity: !1,
                loops: !false_by_default,
                module: !1,
                negate_iife: !false_by_default,
                passes: 1,
                properties: !false_by_default,
                pure_getters: !false_by_default && "strict",
                pure_funcs: null,
                reduce_funcs: !false_by_default,
                reduce_vars: !false_by_default,
                sequences: !false_by_default,
                side_effects: !false_by_default,
                switches: !false_by_default,
                top_retain: null,
                toplevel: !!(options && options.top_retain),
                typeofs: !false_by_default,
                unsafe: !1,
                unsafe_arrows: !1,
                unsafe_comps: !1,
                unsafe_Function: !1,
                unsafe_math: !1,
                unsafe_symbols: !1,
                unsafe_methods: !1,
                unsafe_proto: !1,
                unsafe_regexp: !1,
                unsafe_undefined: !1,
                unused: !false_by_default,
                warnings: !1 // legacy
            }, !0);
            var global_defs = this.options.global_defs;
            if ("object" == typeof global_defs) for(var key in global_defs)"@" === key[0] && HOP(global_defs, key) && (global_defs[key.slice(1)] = parse(global_defs[key], {
                expression: !0
            }));
            !0 === this.options.inline && (this.options.inline = 3);
            var pure_funcs = this.options.pure_funcs;
            "function" == typeof pure_funcs ? this.pure_funcs = pure_funcs : this.pure_funcs = pure_funcs ? function(node) {
                return !pure_funcs.includes(node.expression.print_to_string());
            } : return_true;
            var top_retain = this.options.top_retain;
            top_retain instanceof RegExp ? this.top_retain = function(def) {
                return top_retain.test(def.name);
            } : "function" == typeof top_retain ? this.top_retain = top_retain : top_retain && ("string" == typeof top_retain && (top_retain = top_retain.split(/,/)), this.top_retain = function(def) {
                return top_retain.includes(def.name);
            }), this.options.module && (this.directives["use strict"] = !0, this.options.toplevel = !0);
            var toplevel = this.options.toplevel;
            this.toplevel = "string" == typeof toplevel ? {
                funcs: /funcs/.test(toplevel),
                vars: /vars/.test(toplevel)
            } : {
                funcs: toplevel,
                vars: toplevel
            };
            var sequences = this.options.sequences;
            this.sequences_limit = 1 == sequences ? 800 : 0 | sequences, this.evaluated_regexps = new Map(), this._toplevel = void 0, this.mangle_options = mangle_options;
        }
        option(key) {
            return this.options[key];
        }
        exposed(def) {
            if (def.export) return !0;
            if (def.global) {
                for(var i = 0, len = def.orig.length; i < len; i++)if (!this.toplevel[def.orig[i] instanceof AST_SymbolDefun ? "funcs" : "vars"]) return !0;
            }
            return !1;
        }
        in_boolean_context() {
            if (!this.option("booleans")) return !1;
            for(var p, self1 = this.self(), i = 0; p = this.parent(i); i++){
                if (p instanceof AST_SimpleStatement || p instanceof AST_Conditional && p.condition === self1 || p instanceof AST_DWLoop && p.condition === self1 || p instanceof AST_For && p.condition === self1 || p instanceof AST_If && p.condition === self1 || p instanceof AST_UnaryPrefix && "!" == p.operator && p.expression === self1) return !0;
                if ((!(p instanceof AST_Binary) || "&&" != p.operator && "||" != p.operator && "??" != p.operator) && !(p instanceof AST_Conditional) && p.tail_node() !== self1) return !1;
                self1 = p;
            }
        }
        get_toplevel() {
            return this._toplevel;
        }
        compress(toplevel) {
            toplevel = toplevel.resolve_defines(this), this._toplevel = toplevel, this.option("expression") && this._toplevel.process_expression(!0);
            for(var passes = +this.options.passes || 1, min_count = 1 / 0, stopping = !1, nth_identifier = this.mangle_options && this.mangle_options.nth_identifier || base54, mangle = {
                ie8: this.option("ie8"),
                nth_identifier: nth_identifier
            }, pass = 0; pass < passes; pass++)if (this._toplevel.figure_out_scope(mangle), 0 === pass && this.option("drop_console") && // must be run before reduce_vars and compress pass
            (this._toplevel = this._toplevel.drop_console()), (pass > 0 || this.option("reduce_vars")) && this._toplevel.reset_opt_flags(this), this._toplevel = this._toplevel.transform(this), passes > 1) {
                let count = 0;
                if (walk(this._toplevel, ()=>{
                    count++;
                }), count < min_count) min_count = count, stopping = !1;
                else if (stopping) break;
                else stopping = !0;
            }
            return this.option("expression") && this._toplevel.process_expression(!1), toplevel = this._toplevel, this._toplevel = void 0, toplevel;
        }
        before(node, descend) {
            if (has_flag(node, 0b0000000100000000)) return node;
            var was_scope = !1;
            node instanceof AST_Scope && (node = (node = node.hoist_properties(this)).hoist_declarations(this), was_scope = !0), // Before https://github.com/mishoo/UglifyJS2/pull/1602 AST_Node.optimize()
            // would call AST_Node.transform() if a different instance of AST_Node is
            // produced after def_optimize().
            // This corrupts TreeWalker.stack, which cause AST look-ups to malfunction.
            // Migrate and defer all children's AST_Node.transform() to below, which
            // will now happen after this parent AST_Node has been properly substituted
            // thus gives a consistent AST snapshot.
            descend(node, this), // Existing code relies on how AST_Node.optimize() worked, and omitting the
            // following replacement call would result in degraded efficiency of both
            // output and performance.
            descend(node, this);
            var opt = node.optimize(this);
            return was_scope && opt instanceof AST_Scope && (opt.drop_unused(this), descend(opt, this)), opt === node && set_flag(opt, 0b0000000100000000), opt;
        }
    }
    function def_optimize(node, optimizer) {
        node.DEFMETHOD("optimize", function(compressor) {
            if (has_flag(this, 0b0000001000000000) || compressor.has_directive("use asm")) return this;
            var opt = optimizer(this, compressor);
            return set_flag(opt, 0b0000001000000000), opt;
        });
    }
    function find_scope(tw) {
        for(let i = 0;; i++){
            const p = tw.parent(i);
            if (p instanceof AST_Toplevel || p instanceof AST_Lambda) return p;
            if (p.block_scope) return p.block_scope;
        }
    }
    function find_variable(compressor, name) {
        for(var scope, i = 0; (scope = compressor.parent(i++)) && !(scope instanceof AST_Scope);)if (scope instanceof AST_Catch && scope.argname) {
            scope = scope.argname.definition().scope;
            break;
        }
        return scope.find_variable(name);
    }
    function is_empty(thing) {
        return null === thing || thing instanceof AST_EmptyStatement || thing instanceof AST_BlockStatement && 0 == thing.body.length;
    }
    def_optimize(AST_Node, function(self1) {
        return self1;
    }), AST_Toplevel.DEFMETHOD("drop_console", function() {
        return this.transform(new TreeTransformer(function(self1) {
            if ("Call" == self1.TYPE) {
                var exp = self1.expression;
                if (exp instanceof AST_PropAccess) {
                    for(var name = exp.expression; name.expression;)name = name.expression;
                    if (is_undeclared_ref(name) && "console" == name.name) return make_node(AST_Undefined, self1);
                }
            }
        }));
    }), AST_Node.DEFMETHOD("equivalent_to", function(node) {
        return equivalent_to(this, node);
    }), AST_Scope.DEFMETHOD("process_expression", function(insert, compressor) {
        var self1 = this, tt = new TreeTransformer(function(node) {
            if (insert && node instanceof AST_SimpleStatement) return make_node(AST_Return, node, {
                value: node.body
            });
            if (!insert && node instanceof AST_Return) {
                if (compressor) {
                    var value = node.value && node.value.drop_side_effect_free(compressor, !0);
                    return value ? make_node(AST_SimpleStatement, node, {
                        body: value
                    }) : make_node(AST_EmptyStatement, node);
                }
                return make_node(AST_SimpleStatement, node, {
                    body: node.value || make_node(AST_UnaryPrefix, node, {
                        operator: "void",
                        expression: make_node(AST_Number, node, {
                            value: 0
                        })
                    })
                });
            }
            if (node instanceof AST_Class || node instanceof AST_Lambda && node !== self1) return node;
            if (node instanceof AST_Block) {
                var index = node.body.length - 1;
                index >= 0 && (node.body[index] = node.body[index].transform(tt));
            } else node instanceof AST_If ? (node.body = node.body.transform(tt), node.alternative && (node.alternative = node.alternative.transform(tt))) : node instanceof AST_With && (node.body = node.body.transform(tt));
            return node;
        });
        self1.transform(tt);
    }), AST_Toplevel.DEFMETHOD("reset_opt_flags", function(compressor) {
        const self1 = this, reduce_vars = compressor.option("reduce_vars"), preparation = new TreeWalker(function(node, descend) {
            if (clear_flag(node, 1792), reduce_vars) return compressor.top_retain && node instanceof AST_Defun // Only functions are retained
             && preparation.parent() === self1 && set_flag(node, 0b0000010000000000), node.reduce_vars(preparation, descend, compressor);
        });
        // Stack of look-up tables to keep track of whether a `SymbolDef` has been
        // properly assigned before use:
        // - `push()` & `pop()` when visiting conditional branches
        preparation.safe_ids = Object.create(null), preparation.in_loop = null, preparation.loop_ids = new Map(), preparation.defs_to_safe_ids = new Map(), self1.walk(preparation);
    }), AST_Symbol.DEFMETHOD("fixed_value", function() {
        var fixed = this.thedef.fixed;
        return !fixed || fixed instanceof AST_Node ? fixed : fixed();
    }), AST_SymbolRef.DEFMETHOD("is_immutable", function() {
        var orig = this.definition().orig;
        return 1 == orig.length && orig[0] instanceof AST_SymbolLambda;
    });
    var global_names = makePredicate("Array Boolean clearInterval clearTimeout console Date decodeURI decodeURIComponent encodeURI encodeURIComponent Error escape eval EvalError Function isFinite isNaN JSON Math Number parseFloat parseInt RangeError ReferenceError RegExp Object setInterval setTimeout String SyntaxError TypeError unescape URIError");
    AST_SymbolRef.DEFMETHOD("is_declared", function(compressor) {
        return !this.definition().undeclared || compressor.option("unsafe") && global_names.has(this.name);
    });
    /* -----[ optimizers ]----- */ var directives = new Set([
        "use asm",
        "use strict"
    ]);
    function opt_AST_Lambda(self1, compressor) {
        return tighten_body(self1.body, compressor), compressor.option("side_effects") && 1 == self1.body.length && self1.body[0] === compressor.has_directive("use strict") && (self1.body.length = 0), self1;
    }
    def_optimize(AST_Directive, function(self1, compressor) {
        return compressor.option("directives") && (!directives.has(self1.value) || compressor.has_directive(self1.value) !== self1) ? make_node(AST_EmptyStatement, self1) : self1;
    }), def_optimize(AST_Debugger, function(self1, compressor) {
        return compressor.option("drop_debugger") ? make_node(AST_EmptyStatement, self1) : self1;
    }), def_optimize(AST_LabeledStatement, function(self1, compressor) {
        return self1.body instanceof AST_Break && compressor.loopcontrol_target(self1.body) === self1.body ? make_node(AST_EmptyStatement, self1) : 0 == self1.label.references.length ? self1.body : self1;
    }), def_optimize(AST_Block, function(self1, compressor) {
        return tighten_body(self1.body, compressor), self1;
    }), def_optimize(AST_BlockStatement, function(self1, compressor) {
        switch(tighten_body(self1.body, compressor), self1.body.length){
            case 1:
                var node;
                if (!compressor.has_directive("use strict") && compressor.parent() instanceof AST_If && !((node = self1.body[0]) instanceof AST_Const || node instanceof AST_Let || node instanceof AST_Class) || can_be_evicted_from_block(self1.body[0])) return self1.body[0];
                break;
            case 0:
                return make_node(AST_EmptyStatement, self1);
        }
        return self1;
    }), def_optimize(AST_Lambda, opt_AST_Lambda);
    const r_keep_assign = /keep_assign/;
    // TODO this only works with AST_Defun, shouldn't it work for other ways of defining functions?
    function retain_top_func(fn, compressor) {
        return compressor.top_retain && fn instanceof AST_Defun && has_flag(fn, 0b0000010000000000) && fn.name && compressor.top_retain(fn.name);
    }
    AST_Scope.DEFMETHOD("drop_unused", function(compressor) {
        if (!compressor.option("unused") || compressor.has_directive("use asm")) return;
        var self1 = this;
        if (self1.pinned()) return;
        var drop_funcs = !(self1 instanceof AST_Toplevel) || compressor.toplevel.funcs, drop_vars = !(self1 instanceof AST_Toplevel) || compressor.toplevel.vars;
        const assign_as_unused = r_keep_assign.test(compressor.option("unused")) ? return_false : function(node) {
            return node instanceof AST_Assign && !node.logical && (has_flag(node, 0b00100000) || "=" == node.operator) ? node.left : node instanceof AST_Unary && has_flag(node, 0b00100000) ? node.expression : void 0;
        };
        var in_use_ids = new Map(), fixed_ids = new Map();
        self1 instanceof AST_Toplevel && compressor.top_retain && self1.variables.forEach(function(def) {
            compressor.top_retain(def) && !in_use_ids.has(def.id) && in_use_ids.set(def.id, def);
        });
        var var_defs_by_id = new Map(), initializations = new Map(), scope = this, tw = new TreeWalker(function(node, descend) {
            if (node instanceof AST_Lambda && node.uses_arguments && !tw.has_directive("use strict") && node.argnames.forEach(function(argname) {
                if (argname instanceof AST_SymbolDeclaration) {
                    var def = argname.definition();
                    in_use_ids.has(def.id) || in_use_ids.set(def.id, def);
                }
            }), node !== self1) {
                if (node instanceof AST_Defun || node instanceof AST_DefClass) {
                    var node_def = node.name.definition();
                    if ((tw.parent() instanceof AST_Export || !drop_funcs && scope === self1) && node_def.global && !in_use_ids.has(node_def.id) && in_use_ids.set(node_def.id, node_def), node instanceof AST_DefClass) for (const prop of (node.extends && (node.extends.has_side_effects(compressor) || node.extends.may_throw(compressor)) && node.extends.walk(tw), node.properties))(prop.has_side_effects(compressor) || prop.may_throw(compressor)) && prop.walk(tw);
                    return map_add(initializations, node_def.id, node), !0; // don't go in nested scopes
                }
                if (node instanceof AST_SymbolFunarg && scope === self1 && map_add(var_defs_by_id, node.definition().id, node), node instanceof AST_Definitions && scope === self1) {
                    const in_export = tw.parent() instanceof AST_Export;
                    return node.definitions.forEach(function(def) {
                        if (def.name instanceof AST_SymbolVar && map_add(var_defs_by_id, def.name.definition().id, def), (in_export || !drop_vars) && walk(def.name, (node)=>{
                            if (node instanceof AST_SymbolDeclaration) {
                                const def = node.definition();
                                (in_export || def.global) && !in_use_ids.has(def.id) && in_use_ids.set(def.id, def);
                            }
                        }), def.value) {
                            if (def.name instanceof AST_Destructuring) def.walk(tw);
                            else {
                                var node_def = def.name.definition();
                                map_add(initializations, node_def.id, def.value), node_def.chained || def.name.fixed_value() !== def.value || fixed_ids.set(node_def.id, def);
                            }
                            def.value.has_side_effects(compressor) && def.value.walk(tw);
                        }
                    }), !0;
                }
                return scan_ref_scoped(node, descend);
            }
        });
        self1.walk(tw), // pass 2: for every used symbol we need to walk its
        // initialization code to figure out if it uses other
        // symbols (that may not be in_use).
        tw = new TreeWalker(scan_ref_scoped), in_use_ids.forEach(function(def) {
            var init = initializations.get(def.id);
            init && init.forEach(function(init) {
                init.walk(tw);
            });
        });
        // pass 3: we should drop declarations not in_use
        var tt = new TreeTransformer(function(node, descend, in_list) {
            var def, block, parent = tt.parent();
            if (drop_vars) {
                const sym = assign_as_unused(node);
                if (sym instanceof AST_SymbolRef) {
                    var def = sym.definition(), in_use = in_use_ids.has(def.id);
                    if (node instanceof AST_Assign) {
                        if (!in_use || fixed_ids.has(def.id) && fixed_ids.get(def.id) !== node) return maintain_this_binding(parent, node, node.right.transform(tt));
                    } else if (!in_use) return in_list ? MAP.skip : make_node(AST_Number, node, {
                        value: 0
                    });
                }
            }
            if (scope === self1) {
                if (node.name && (node instanceof AST_ClassExpression && !keep_name(compressor.option("keep_classnames"), (def = node.name.definition()).name) || node instanceof AST_Function && !keep_name(compressor.option("keep_fnames"), (def = node.name.definition()).name)) && (!in_use_ids.has(def.id) || def.orig.length > 1) && (node.name = null), node instanceof AST_Lambda && !(node instanceof AST_Accessor)) for(var trim = !compressor.option("keep_fargs"), a = node.argnames, i = a.length; --i >= 0;){
                    var sym = a[i];
                    sym instanceof AST_Expansion && (sym = sym.expression), sym instanceof AST_DefaultAssign && (sym = sym.left), sym instanceof AST_Destructuring || in_use_ids.has(sym.definition().id) ? trim = !1 : (set_flag(sym, 0b00000001), trim && a.pop());
                }
                if ((node instanceof AST_Defun || node instanceof AST_DefClass) && node !== self1) {
                    const def = node.name.definition();
                    if (!(def.global && !drop_funcs || in_use_ids.has(def.id))) {
                        if (def.eliminated++, node instanceof AST_DefClass) {
                            // Classes might have extends with side effects
                            const side_effects = node.drop_side_effect_free(compressor);
                            if (side_effects) return make_node(AST_SimpleStatement, node, {
                                body: side_effects
                            });
                        }
                        return in_list ? MAP.skip : make_node(AST_EmptyStatement, node);
                    }
                }
                if (node instanceof AST_Definitions && !(parent instanceof AST_ForIn && parent.init === node)) {
                    var drop_block = !(parent instanceof AST_Toplevel) && !(node instanceof AST_Var), body = [], head = [], tail = [], side_effects = [];
                    switch(node.definitions.forEach(function(def) {
                        def.value && (def.value = def.value.transform(tt));
                        var is_destructure = def.name instanceof AST_Destructuring, sym = is_destructure ? new SymbolDef(null, {
                            name: "<destructure>"
                        }) : def.name.definition();
                        if (drop_block && sym.global) return tail.push(def);
                        if (!(drop_vars || drop_block) || is_destructure && (def.name.names.length || def.name.is_array || !0 != compressor.option("pure_getters")) || in_use_ids.has(sym.id)) {
                            if (def.value && fixed_ids.has(sym.id) && fixed_ids.get(sym.id) !== def && (def.value = def.value.drop_side_effect_free(compressor)), def.name instanceof AST_SymbolVar) {
                                var var_defs = var_defs_by_id.get(sym.id);
                                if (var_defs.length > 1 && (!def.value || sym.orig.indexOf(def.name) > sym.eliminated)) {
                                    if (def.value) {
                                        var ref = make_node(AST_SymbolRef, def.name, def.name);
                                        sym.references.push(ref);
                                        var assign = make_node(AST_Assign, def, {
                                            operator: "=",
                                            logical: !1,
                                            left: ref,
                                            right: def.value
                                        });
                                        fixed_ids.get(sym.id) === def && fixed_ids.set(sym.id, assign), side_effects.push(assign.transform(tt));
                                    }
                                    remove(var_defs, def), sym.eliminated++;
                                    return;
                                }
                            }
                            def.value ? (side_effects.length > 0 && (tail.length > 0 ? (side_effects.push(def.value), def.value = make_sequence(def.value, side_effects)) : body.push(make_node(AST_SimpleStatement, node, {
                                body: make_sequence(node, side_effects)
                            })), side_effects = []), tail.push(def)) : head.push(def);
                        } else if (sym.orig[0] instanceof AST_SymbolCatch) {
                            var value = def.value && def.value.drop_side_effect_free(compressor);
                            value && side_effects.push(value), def.value = null, head.push(def);
                        } else {
                            var value = def.value && def.value.drop_side_effect_free(compressor);
                            value && side_effects.push(value), sym.eliminated++;
                        }
                    }), (head.length > 0 || tail.length > 0) && (node.definitions = head.concat(tail), body.push(node)), side_effects.length > 0 && body.push(make_node(AST_SimpleStatement, node, {
                        body: make_sequence(node, side_effects)
                    })), body.length){
                        case 0:
                            return in_list ? MAP.skip : make_node(AST_EmptyStatement, node);
                        case 1:
                            return body[0];
                        default:
                            return in_list ? MAP.splice(body) : make_node(AST_BlockStatement, node, {
                                body: body
                            });
                    }
                }
                // certain combination of unused name + side effect leads to:
                //    https://github.com/mishoo/UglifyJS2/issues/44
                //    https://github.com/mishoo/UglifyJS2/issues/1830
                //    https://github.com/mishoo/UglifyJS2/issues/1838
                // that's an invalid AST.
                // We fix it at this stage by moving the `var` outside the `for`.
                if (node instanceof AST_For) return descend(node, this), node.init instanceof AST_BlockStatement && (block = node.init, node.init = block.body.pop(), block.body.push(node)), node.init instanceof AST_SimpleStatement ? node.init = node.init.body : is_empty(node.init) && (node.init = null), block ? in_list ? MAP.splice(block.body) : block : node;
                if (node instanceof AST_LabeledStatement && node.body instanceof AST_For) {
                    if (descend(node, this), node.body instanceof AST_BlockStatement) {
                        var block = node.body;
                        return node.body = block.body.pop(), block.body.push(node), in_list ? MAP.splice(block.body) : block;
                    }
                    return node;
                }
                if (node instanceof AST_BlockStatement) return (descend(node, this), in_list && node.body.every(can_be_evicted_from_block)) ? MAP.splice(node.body) : node;
                if (node instanceof AST_Scope) {
                    const save_scope = scope;
                    return scope = node, descend(node, this), scope = save_scope, node;
                }
            }
        });
        function scan_ref_scoped(node, descend) {
            var node_def;
            const sym = assign_as_unused(node);
            if (sym instanceof AST_SymbolRef && !is_ref_of(node.left, AST_SymbolBlockDeclaration) && self1.variables.get(sym.name) === (node_def = sym.definition())) return node instanceof AST_Assign && (node.right.walk(tw), node_def.chained || node.left.fixed_value() !== node.right || fixed_ids.set(node_def.id, node)), !0;
            if (node instanceof AST_SymbolRef) {
                if (node_def = node.definition(), !in_use_ids.has(node_def.id) && (in_use_ids.set(node_def.id, node_def), node_def.orig[0] instanceof AST_SymbolCatch)) {
                    const redef = node_def.scope.is_block_scope() && node_def.scope.get_defun_scope().variables.get(node_def.name);
                    redef && in_use_ids.set(redef.id, redef);
                }
                return !0;
            }
            if (node instanceof AST_Scope) {
                var save_scope = scope;
                return scope = node, descend(), scope = save_scope, !0;
            }
        }
        self1.transform(tt);
    }), AST_Scope.DEFMETHOD("hoist_declarations", function(compressor) {
        var self1 = this;
        if (compressor.has_directive("use asm") || !Array.isArray(self1.body)) return self1;
        var hoist_funs = compressor.option("hoist_funs"), hoist_vars = compressor.option("hoist_vars");
        if (hoist_funs || hoist_vars) {
            var dirs = [], hoisted = [], vars = new Map(), vars_found = 0, var_decl = 0;
            // let's count var_decl first, we seem to waste a lot of
            // space if we hoist `var` when there's only one.
            walk(self1, (node)=>node instanceof AST_Scope && node !== self1 || (node instanceof AST_Var ? (++var_decl, !0) : void 0)), hoist_vars = hoist_vars && var_decl > 1;
            var tt = new TreeTransformer(function(node) {
                if (node !== self1) {
                    if (node instanceof AST_Directive) return dirs.push(node), make_node(AST_EmptyStatement, node);
                    if (hoist_funs && node instanceof AST_Defun && !(tt.parent() instanceof AST_Export) && tt.parent() === self1) return hoisted.push(node), make_node(AST_EmptyStatement, node);
                    if (hoist_vars && node instanceof AST_Var && !node.definitions.some((def)=>def.name instanceof AST_Destructuring)) {
                        node.definitions.forEach(function(def) {
                            vars.set(def.name.name, def), ++vars_found;
                        });
                        var seq = node.to_assignments(compressor), p = tt.parent();
                        if (p instanceof AST_ForIn && p.init === node) {
                            if (null == seq) {
                                var def = node.definitions[0].name;
                                return make_node(AST_SymbolRef, def, def);
                            }
                            return seq;
                        }
                        return p instanceof AST_For && p.init === node ? seq : seq ? make_node(AST_SimpleStatement, node, {
                            body: seq
                        }) : make_node(AST_EmptyStatement, node);
                    }
                    if (node instanceof AST_Scope) return node; // to avoid descending in nested scopes
                }
            });
            if (self1 = self1.transform(tt), vars_found > 0) {
                // collect only vars which don't show up in self's arguments list
                var defs = [];
                const is_lambda = self1 instanceof AST_Lambda, args_as_names = is_lambda ? self1.args_as_names() : null;
                if (vars.forEach((def, name)=>{
                    is_lambda && args_as_names.some((x)=>x.name === def.name.name) ? vars.delete(name) : ((def = def.clone()).value = null, defs.push(def), vars.set(name, def));
                }), defs.length > 0) {
                    // try to merge in assignments
                    for(; 0 < self1.body.length;){
                        if (self1.body[0] instanceof AST_SimpleStatement) {
                            var sym, assign, expr = self1.body[0].body;
                            if (expr instanceof AST_Assign && "=" == expr.operator && (sym = expr.left) instanceof AST_Symbol && vars.has(sym.name)) {
                                var def = vars.get(sym.name);
                                if (def.value) break;
                                def.value = expr.right, remove(defs, def), defs.push(def), self1.body.splice(0, 1);
                                continue;
                            }
                            if (expr instanceof AST_Sequence && (assign = expr.expressions[0]) instanceof AST_Assign && "=" == assign.operator && (sym = assign.left) instanceof AST_Symbol && vars.has(sym.name)) {
                                var def = vars.get(sym.name);
                                if (def.value) break;
                                def.value = assign.right, remove(defs, def), defs.push(def), self1.body[0].body = make_sequence(expr, expr.expressions.slice(1));
                                continue;
                            }
                        }
                        if (self1.body[0] instanceof AST_EmptyStatement) {
                            self1.body.splice(0, 1);
                            continue;
                        }
                        if (self1.body[0] instanceof AST_BlockStatement) {
                            self1.body.splice(0, 1, ...self1.body[0].body);
                            continue;
                        }
                        break;
                    }
                    defs = make_node(AST_Var, self1, {
                        definitions: defs
                    }), hoisted.push(defs);
                }
            }
            self1.body = dirs.concat(hoisted, self1.body);
        }
        return self1;
    }), AST_Scope.DEFMETHOD("hoist_properties", function(compressor) {
        var self1 = this;
        if (!compressor.option("hoist_props") || compressor.has_directive("use asm")) return self1;
        var top_retain = self1 instanceof AST_Toplevel && compressor.top_retain || return_false, defs_by_id = new Map(), hoister = new TreeTransformer(function(node, descend) {
            if (node instanceof AST_Definitions && hoister.parent() instanceof AST_Export) return node;
            if (node instanceof AST_VarDef) {
                let def, value;
                const sym = node.name;
                if (sym.scope === self1 && 1 != (def = sym.definition()).escaped && !def.assignments && !def.direct_access && !def.single_use && !compressor.exposed(def) && !top_retain(def) && (value = sym.fixed_value()) === node.value && value instanceof AST_Object && !value.properties.some((prop)=>prop instanceof AST_Expansion || prop.computed_key())) {
                    descend(node, this);
                    const defs = new Map(), assignments = [];
                    return value.properties.forEach(({ key, value })=>{
                        const scope = find_scope(hoister), symbol = self1.create_symbol(sym.CTOR, {
                            source: sym,
                            scope,
                            conflict_scopes: new Set([
                                scope,
                                ...sym.definition().references.map((ref)=>ref.scope)
                            ]),
                            tentative_name: sym.name + "_" + key
                        });
                        defs.set(String(key), symbol.definition()), assignments.push(make_node(AST_VarDef, node, {
                            name: symbol,
                            value
                        }));
                    }), defs_by_id.set(def.id, defs), MAP.splice(assignments);
                }
            } else if (node instanceof AST_PropAccess && node.expression instanceof AST_SymbolRef) {
                const defs = defs_by_id.get(node.expression.definition().id);
                if (defs) {
                    const def = defs.get(String(get_simple_key(node.property))), sym = make_node(AST_SymbolRef, node, {
                        name: def.name,
                        scope: node.expression.scope,
                        thedef: def
                    });
                    return sym.reference({}), sym;
                }
            }
        });
        return self1.transform(hoister);
    }), def_optimize(AST_SimpleStatement, function(self1, compressor) {
        if (compressor.option("side_effects")) {
            var body = self1.body, node = body.drop_side_effect_free(compressor, !0);
            if (!node) return make_node(AST_EmptyStatement, self1);
            if (node !== body) return make_node(AST_SimpleStatement, self1, {
                body: node
            });
        }
        return self1;
    }), def_optimize(AST_While, function(self1, compressor) {
        return compressor.option("loops") ? make_node(AST_For, self1, self1).optimize(compressor) : self1;
    }), def_optimize(AST_Do, function(self1, compressor) {
        if (!compressor.option("loops")) return self1;
        var cond = self1.condition.tail_node().evaluate(compressor);
        if (!(cond instanceof AST_Node)) {
            if (cond) return make_node(AST_For, self1, {
                body: make_node(AST_BlockStatement, self1.body, {
                    body: [
                        self1.body,
                        make_node(AST_SimpleStatement, self1.condition, {
                            body: self1.condition
                        })
                    ]
                })
            }).optimize(compressor);
            if (!has_break_or_continue(self1, compressor.parent())) return make_node(AST_BlockStatement, self1.body, {
                body: [
                    self1.body,
                    make_node(AST_SimpleStatement, self1.condition, {
                        body: self1.condition
                    })
                ]
            }).optimize(compressor);
        }
        return self1;
    }), def_optimize(AST_For, function(self1, compressor) {
        if (!compressor.option("loops")) return self1;
        if (compressor.option("side_effects") && self1.init && (self1.init = self1.init.drop_side_effect_free(compressor)), self1.condition) {
            var cond = self1.condition.evaluate(compressor);
            if (!(cond instanceof AST_Node)) {
                if (cond) self1.condition = null;
                else if (!compressor.option("dead_code")) {
                    var orig = self1.condition;
                    self1.condition = make_node_from_constant(cond, self1.condition), self1.condition = best_of_expression(self1.condition.transform(compressor), orig);
                }
            }
            if (compressor.option("dead_code") && (cond instanceof AST_Node && (cond = self1.condition.tail_node().evaluate(compressor)), !cond)) {
                var body = [];
                return trim_unreachable_code(compressor, self1.body, body), self1.init instanceof AST_Statement ? body.push(self1.init) : self1.init && body.push(make_node(AST_SimpleStatement, self1.init, {
                    body: self1.init
                })), body.push(make_node(AST_SimpleStatement, self1.condition, {
                    body: self1.condition
                })), make_node(AST_BlockStatement, self1, {
                    body: body
                }).optimize(compressor);
            }
        }
        return function if_break_in_loop(self1, compressor) {
            var first = self1.body instanceof AST_BlockStatement ? self1.body.body[0] : self1.body;
            if (compressor.option("dead_code") && is_break(first)) {
                var body = [];
                return self1.init instanceof AST_Statement ? body.push(self1.init) : self1.init && body.push(make_node(AST_SimpleStatement, self1.init, {
                    body: self1.init
                })), self1.condition && body.push(make_node(AST_SimpleStatement, self1.condition, {
                    body: self1.condition
                })), trim_unreachable_code(compressor, self1.body, body), make_node(AST_BlockStatement, self1, {
                    body: body
                });
            }
            return first instanceof AST_If && (is_break(first.body) ? (self1.condition ? self1.condition = make_node(AST_Binary, self1.condition, {
                left: self1.condition,
                operator: "&&",
                right: first.condition.negate(compressor)
            }) : self1.condition = first.condition.negate(compressor), drop_it(first.alternative)) : is_break(first.alternative) && (self1.condition ? self1.condition = make_node(AST_Binary, self1.condition, {
                left: self1.condition,
                operator: "&&",
                right: first.condition
            }) : self1.condition = first.condition, drop_it(first.body))), self1;
            function is_break(node) {
                return node instanceof AST_Break && compressor.loopcontrol_target(node) === compressor.self();
            }
            function drop_it(rest) {
                rest = as_statement_array(rest), self1.body instanceof AST_BlockStatement ? (self1.body = self1.body.clone(), self1.body.body = rest.concat(self1.body.body.slice(1)), self1.body = self1.body.transform(compressor)) : self1.body = make_node(AST_BlockStatement, self1.body, {
                    body: rest
                }).transform(compressor), self1 = if_break_in_loop(self1, compressor);
            }
        }(self1, compressor);
    }), def_optimize(AST_If, function(self1, compressor) {
        if (is_empty(self1.alternative) && (self1.alternative = null), !compressor.option("conditionals")) return self1;
        // if condition can be statically determined, drop
        // one of the blocks.  note, statically determined implies
        // “has no side effects”; also it doesn't work for cases like
        // `x && true`, though it probably should.
        var cond = self1.condition.evaluate(compressor);
        if (!compressor.option("dead_code") && !(cond instanceof AST_Node)) {
            var orig = self1.condition;
            self1.condition = make_node_from_constant(cond, orig), self1.condition = best_of_expression(self1.condition.transform(compressor), orig);
        }
        if (compressor.option("dead_code")) {
            if (cond instanceof AST_Node && (cond = self1.condition.tail_node().evaluate(compressor)), cond) {
                if (!(cond instanceof AST_Node)) {
                    var body = [];
                    return body.push(make_node(AST_SimpleStatement, self1.condition, {
                        body: self1.condition
                    })), body.push(self1.body), self1.alternative && trim_unreachable_code(compressor, self1.alternative, body), make_node(AST_BlockStatement, self1, {
                        body: body
                    }).optimize(compressor);
                }
            } else {
                var body = [];
                return trim_unreachable_code(compressor, self1.body, body), body.push(make_node(AST_SimpleStatement, self1.condition, {
                    body: self1.condition
                })), self1.alternative && body.push(self1.alternative), make_node(AST_BlockStatement, self1, {
                    body: body
                }).optimize(compressor);
            }
        }
        var negated = self1.condition.negate(compressor), self_condition_length = self1.condition.size(), negated_length = negated.size(), negated_is_best = negated_length < self_condition_length;
        if (self1.alternative && negated_is_best) {
            negated_is_best = !1, // no need to swap values of self_condition_length and negated_length
            // here because they are only used in an equality comparison later on.
            self1.condition = negated;
            var tmp = self1.body;
            self1.body = self1.alternative || make_node(AST_EmptyStatement, self1), self1.alternative = tmp;
        }
        if (is_empty(self1.body) && is_empty(self1.alternative)) return make_node(AST_SimpleStatement, self1.condition, {
            body: self1.condition.clone()
        }).optimize(compressor);
        if (self1.body instanceof AST_SimpleStatement && self1.alternative instanceof AST_SimpleStatement) return make_node(AST_SimpleStatement, self1, {
            body: make_node(AST_Conditional, self1, {
                condition: self1.condition,
                consequent: self1.body.body,
                alternative: self1.alternative.body
            })
        }).optimize(compressor);
        if (is_empty(self1.alternative) && self1.body instanceof AST_SimpleStatement) return (self_condition_length === negated_length && !negated_is_best && self1.condition instanceof AST_Binary && "||" == self1.condition.operator && // although the code length of self.condition and negated are the same,
        // negated does not require additional surrounding parentheses.
        // see https://github.com/mishoo/UglifyJS2/issues/979
        (negated_is_best = !0), negated_is_best) ? make_node(AST_SimpleStatement, self1, {
            body: make_node(AST_Binary, self1, {
                operator: "||",
                left: negated,
                right: self1.body.body
            })
        }).optimize(compressor) : make_node(AST_SimpleStatement, self1, {
            body: make_node(AST_Binary, self1, {
                operator: "&&",
                left: self1.condition,
                right: self1.body.body
            })
        }).optimize(compressor);
        if (self1.body instanceof AST_EmptyStatement && self1.alternative instanceof AST_SimpleStatement) return make_node(AST_SimpleStatement, self1, {
            body: make_node(AST_Binary, self1, {
                operator: "||",
                left: self1.condition,
                right: self1.alternative.body
            })
        }).optimize(compressor);
        if (self1.body instanceof AST_Exit && self1.alternative instanceof AST_Exit && self1.body.TYPE == self1.alternative.TYPE) return make_node(self1.body.CTOR, self1, {
            value: make_node(AST_Conditional, self1, {
                condition: self1.condition,
                consequent: self1.body.value || make_node(AST_Undefined, self1.body),
                alternative: self1.alternative.value || make_node(AST_Undefined, self1.alternative)
            }).transform(compressor)
        }).optimize(compressor);
        if (self1.body instanceof AST_If && !self1.body.alternative && !self1.alternative && (self1 = make_node(AST_If, self1, {
            condition: make_node(AST_Binary, self1.condition, {
                operator: "&&",
                left: self1.condition,
                right: self1.body.condition
            }),
            body: self1.body.body,
            alternative: null
        })), aborts(self1.body) && self1.alternative) {
            var alt = self1.alternative;
            return self1.alternative = null, make_node(AST_BlockStatement, self1, {
                body: [
                    self1,
                    alt
                ]
            }).optimize(compressor);
        }
        if (aborts(self1.alternative)) {
            var body = self1.body;
            return self1.body = self1.alternative, self1.condition = negated_is_best ? negated : self1.condition.negate(compressor), self1.alternative = null, make_node(AST_BlockStatement, self1, {
                body: [
                    self1,
                    body
                ]
            }).optimize(compressor);
        }
        return self1;
    }), def_optimize(AST_Switch, function(self1, compressor) {
        if (!compressor.option("switches")) return self1;
        var branch, default_branch, exact_match, value = self1.expression.evaluate(compressor);
        if (!(value instanceof AST_Node)) {
            var orig = self1.expression;
            self1.expression = make_node_from_constant(value, orig), self1.expression = best_of_expression(self1.expression.transform(compressor), orig);
        }
        if (!compressor.option("dead_code")) return self1;
        value instanceof AST_Node && (value = self1.expression.tail_node().evaluate(compressor));
        for(var decl = [], body = [], i = 0, len = self1.body.length; i < len && !exact_match; i++){
            if ((branch = self1.body[i]) instanceof AST_Default) default_branch ? eliminate_branch(branch, body[body.length - 1]) : default_branch = branch;
            else if (!(value instanceof AST_Node)) {
                var exp = branch.expression.evaluate(compressor);
                if (!(exp instanceof AST_Node) && exp !== value) {
                    eliminate_branch(branch, body[body.length - 1]);
                    continue;
                }
                if (exp instanceof AST_Node && (exp = branch.expression.tail_node().evaluate(compressor)), exp === value && (exact_match = branch, default_branch)) {
                    var default_index = body.indexOf(default_branch);
                    body.splice(default_index, 1), eliminate_branch(default_branch, body[default_index - 1]), default_branch = null;
                }
            }
            body.push(branch);
        }
        for(; i < len;)eliminate_branch(self1.body[i++], body[body.length - 1]);
        self1.body = body;
        let default_or_exact = default_branch || exact_match;
        // group equivalent branches so they will be located next to each other,
        // that way the next micro-optimization will merge them.
        // ** bail micro-optimization if not a simple switch case with breaks
        if (default_branch = null, exact_match = null, body.every((branch, i)=>(branch === default_or_exact || branch.expression instanceof AST_Constant) && (0 === branch.body.length || aborts(branch) || body.length - 1 === i))) for(let i = 0; i < body.length; i++){
            const branch = body[i];
            for(let j = i + 1; j < body.length; j++){
                const next = body[j];
                if (0 === next.body.length) continue;
                const last_branch = j === body.length - 1, equivalentBranch = branches_equivalent(next, branch, !1);
                if (equivalentBranch || last_branch && branches_equivalent(next, branch, !0)) {
                    !equivalentBranch && last_branch && next.body.push(make_node(AST_Break));
                    // let's find previous siblings with inert fallthrough...
                    let x = j - 1, fallthroughDepth = 0;
                    for(; x > i;)if (is_inert_body(body[x--])) fallthroughDepth++;
                    else break;
                    const plucked = body.splice(j - fallthroughDepth, 1 + fallthroughDepth);
                    body.splice(i + 1, 0, ...plucked), i += plucked.length;
                }
            }
        }
        // merge equivalent branches in a row
        for(let i = 0; i < body.length; i++){
            let branch = body[i];
            if (0 !== branch.body.length && aborts(branch)) for(let j = i + 1; j < body.length; i++, j++){
                let next = body[j];
                if (0 !== next.body.length) {
                    if (branches_equivalent(next, branch, !1) || j === body.length - 1 && branches_equivalent(next, branch, !0)) {
                        branch.body = [], branch = next;
                        continue;
                    }
                    break;
                }
            }
        }
        // Prune any empty branches at the end of the switch statement.
        {
            let i = body.length - 1;
            for(; i >= 0; i--){
                let bbody = body[i].body;
                if (is_break(bbody[bbody.length - 1], compressor) && bbody.pop(), !is_inert_body(body[i])) break;
            }
            if (// i now points to the index of a branch that contains a body. By incrementing, it's
            // pointing to the first branch that's empty.
            i++, !default_or_exact || body.indexOf(default_or_exact) >= i) // The default behavior is to do nothing. We can take advantage of that to
            // remove all case expressions that are side-effect free that also do
            // nothing, since they'll default to doing nothing. But we can't remove any
            // case expressions before one that would side-effect, since they may cause
            // the side-effect to be skipped.
            for(let j = body.length - 1; j >= i; j--){
                let branch = body[j];
                if (branch === default_or_exact) default_or_exact = null, body.pop();
                else if (branch.expression.has_side_effects(compressor)) break;
                else body.pop();
            }
        }
        // Prune side-effect free branches that fall into default.
        DEFAULT: if (default_or_exact) {
            let default_index = body.indexOf(default_or_exact), default_body_index = default_index;
            for(; default_body_index < body.length - 1 && is_inert_body(body[default_body_index]); default_body_index++);
            if (default_body_index < body.length - 1) break DEFAULT;
            let side_effect_index = body.length - 1;
            for(; side_effect_index >= 0; side_effect_index--){
                let branch = body[side_effect_index];
                if (branch !== default_or_exact && branch.expression.has_side_effects(compressor)) break;
            }
            // If the default behavior comes after any side-effect case expressions,
            // then we can fold all side-effect free cases into the default branch.
            // If the side-effect case is after the default, then any side-effect
            // free cases could prevent the side-effect from occurring.
            if (default_body_index > side_effect_index) {
                let prev_body_index = default_index - 1;
                for(; prev_body_index >= 0 && is_inert_body(body[prev_body_index]); prev_body_index--);
                let before = Math.max(side_effect_index, prev_body_index) + 1, after = default_index;
                side_effect_index > default_index ? (// If the default falls into the same body as a side-effect
                // case, then we need preserve that case and only prune the
                // cases after it.
                after = side_effect_index, body[side_effect_index].body = body[default_body_index].body) : // The default will be the last branch.
                default_or_exact.body = body[default_body_index].body, // Prune everything after the default (or last side-effect case)
                // until the next case with a body.
                body.splice(after + 1, default_body_index - after), // Prune everything before the default that falls into it.
                body.splice(before, default_index - before);
            }
        }
        // See if we can remove the switch entirely if all cases (the default) fall into the same case body.
        DEFAULT: if (default_or_exact) {
            let caseBody, i = body.findIndex((branch)=>!is_inert_body(branch));
            // `i` is equal to one of the following:
            // - `-1`, there is no body in the switch statement.
            // - `body.length - 1`, all cases fall into the same body.
            // - anything else, there are multiple bodies in the switch.
            if (i === body.length - 1) {
                // All cases fall into the case body.
                let branch = body[i];
                if (has_nested_break(self1)) break DEFAULT;
                // This is the last case body, and we've already pruned any breaks, so it's
                // safe to hoist.
                caseBody = make_node(AST_BlockStatement, branch, {
                    body: branch.body
                }), branch.body = [];
            } else if (-1 !== i) break DEFAULT;
            // If no cases cause a side-effect, we can eliminate the switch entirely.
            if (!body.find((branch)=>branch !== default_or_exact && branch.expression.has_side_effects(compressor))) return make_node(AST_BlockStatement, self1, {
                body: decl.concat(statement(self1.expression), default_or_exact.expression ? statement(default_or_exact.expression) : [], caseBody || [])
            }).optimize(compressor);
            // If we're this far, either there was no body or all cases fell into the same body.
            // If there was no body, then we don't need a default branch (because the default is
            // do nothing). If there was a body, we'll extract it to after the switch, so the
            // switch's new default is to do nothing and we can still prune it.
            const default_index = body.indexOf(default_or_exact);
            if (body.splice(default_index, 1), default_or_exact = null, caseBody) // Recurse into switch statement one more time so that we can append the case body
            // outside of the switch. This recursion will only happen once since we've pruned
            // the default case.
            return make_node(AST_BlockStatement, self1, {
                body: decl.concat(self1, caseBody)
            }).optimize(compressor);
        // If we fall here, there is a default branch somewhere, there are no case bodies,
        // and there's a side-effect somewhere. Just let the below paths take care of it.
        }
        if (body.length > 0 && (body[0].body = decl.concat(body[0].body)), 0 == body.length) return make_node(AST_BlockStatement, self1, {
            body: decl.concat(statement(self1.expression))
        }).optimize(compressor);
        if (1 == body.length && !has_nested_break(self1)) {
            // This is the last case body, and we've already pruned any breaks, so it's
            // safe to hoist.
            let branch = body[0];
            return make_node(AST_If, self1, {
                condition: make_node(AST_Binary, self1, {
                    operator: "===",
                    left: self1.expression,
                    right: branch.expression
                }),
                body: make_node(AST_BlockStatement, branch, {
                    body: branch.body
                }),
                alternative: null
            }).optimize(compressor);
        }
        if (2 === body.length && default_or_exact && !has_nested_break(self1)) {
            let branch = body[0] === default_or_exact ? body[1] : body[0], exact_exp = default_or_exact.expression && statement(default_or_exact.expression);
            if (aborts(body[0])) {
                // Only the first branch body could have a break (at the last statement)
                let first = body[0];
                return is_break(first.body[first.body.length - 1], compressor) && first.body.pop(), make_node(AST_If, self1, {
                    condition: make_node(AST_Binary, self1, {
                        operator: "===",
                        left: self1.expression,
                        right: branch.expression
                    }),
                    body: make_node(AST_BlockStatement, branch, {
                        body: branch.body
                    }),
                    alternative: make_node(AST_BlockStatement, default_or_exact, {
                        body: [].concat(exact_exp || [], default_or_exact.body)
                    })
                }).optimize(compressor);
            }
            let operator = "===", consequent = make_node(AST_BlockStatement, branch, {
                body: branch.body
            }), always = make_node(AST_BlockStatement, default_or_exact, {
                body: [].concat(exact_exp || [], default_or_exact.body)
            });
            if (body[0] === default_or_exact) {
                operator = "!==";
                let tmp = always;
                always = consequent, consequent = tmp;
            }
            return make_node(AST_BlockStatement, self1, {
                body: [
                    make_node(AST_If, self1, {
                        condition: make_node(AST_Binary, self1, {
                            operator: operator,
                            left: self1.expression,
                            right: branch.expression
                        }),
                        body: consequent,
                        alternative: null
                    })
                ].concat(always)
            }).optimize(compressor);
        }
        return self1;
        function eliminate_branch(branch, prev) {
            prev && !aborts(prev) ? prev.body = prev.body.concat(branch.body) : trim_unreachable_code(compressor, branch, decl);
        }
        function branches_equivalent(branch, prev, insertBreak) {
            let bbody = branch.body, pbody = prev.body;
            if (insertBreak && (bbody = bbody.concat(make_node(AST_Break))), bbody.length !== pbody.length) return !1;
            let bblock = make_node(AST_BlockStatement, branch, {
                body: bbody
            }), pblock = make_node(AST_BlockStatement, prev, {
                body: pbody
            });
            return bblock.equivalent_to(pblock);
        }
        function statement(expression) {
            return make_node(AST_SimpleStatement, expression, {
                body: expression
            });
        }
        function has_nested_break(root) {
            let has_break = !1, tw = new TreeWalker((node)=>{
                if (has_break || node instanceof AST_Lambda || node instanceof AST_SimpleStatement) return !0;
                if (!is_break(node, tw)) return;
                let parent = tw.parent();
                parent instanceof AST_SwitchBranch && parent.body[parent.body.length - 1] === node || (has_break = !0);
            });
            return root.walk(tw), has_break;
        }
        function is_break(node, stack) {
            return node instanceof AST_Break && stack.loopcontrol_target(node) === self1;
        }
        function is_inert_body(branch) {
            return !aborts(branch) && !make_node(AST_BlockStatement, branch, {
                body: branch.body
            }).has_side_effects(compressor);
        }
    }), def_optimize(AST_Try, function(self1, compressor) {
        if (tighten_body(self1.body, compressor), self1.bcatch && self1.bfinally && self1.bfinally.body.every(is_empty) && (self1.bfinally = null), compressor.option("dead_code") && self1.body.every(is_empty)) {
            var body = [];
            return self1.bcatch && trim_unreachable_code(compressor, self1.bcatch, body), self1.bfinally && body.push(...self1.bfinally.body), make_node(AST_BlockStatement, self1, {
                body: body
            }).optimize(compressor);
        }
        return self1;
    }), AST_Definitions.DEFMETHOD("remove_initializers", function() {
        var decls = [];
        this.definitions.forEach(function(def) {
            def.name instanceof AST_SymbolDeclaration ? (def.value = null, decls.push(def)) : walk(def.name, (node)=>{
                node instanceof AST_SymbolDeclaration && decls.push(make_node(AST_VarDef, def, {
                    name: node,
                    value: null
                }));
            });
        }), this.definitions = decls;
    }), AST_Definitions.DEFMETHOD("to_assignments", function(compressor) {
        var reduce_vars = compressor.option("reduce_vars"), assignments = [];
        for (const def of this.definitions){
            if (def.value) {
                var name = make_node(AST_SymbolRef, def.name, def.name);
                assignments.push(make_node(AST_Assign, def, {
                    operator: "=",
                    logical: !1,
                    left: name,
                    right: def.value
                })), reduce_vars && (name.definition().fixed = !1);
            } else if (def.value) {
                // Because it's a destructuring, do not turn into an assignment.
                var varDef = make_node(AST_VarDef, def, {
                    name: def.name,
                    value: def.value
                }), var_ = make_node(AST_Var, def, {
                    definitions: [
                        varDef
                    ]
                });
                assignments.push(var_);
            }
            const thedef = def.name.definition();
            thedef.eliminated++, thedef.replaced--;
        }
        return 0 == assignments.length ? null : make_sequence(this, assignments);
    }), def_optimize(AST_Definitions, function(self1) {
        return 0 == self1.definitions.length ? make_node(AST_EmptyStatement, self1) : self1;
    }), def_optimize(AST_VarDef, function(self1, compressor) {
        return self1.name instanceof AST_SymbolLet && null != self1.value && is_undefined(self1.value, compressor) && (self1.value = null), self1;
    }), def_optimize(AST_Import, function(self1) {
        return self1;
    }), def_optimize(AST_Call, function(self1, compressor) {
        var exp = self1.expression, fn = exp;
        inline_array_like_spread(self1.args);
        var simple_args = self1.args.every((arg)=>!(arg instanceof AST_Expansion));
        if (compressor.option("reduce_vars") && fn instanceof AST_SymbolRef && !has_annotation(self1, _NOINLINE)) {
            const fixed = fn.fixed_value();
            retain_top_func(fixed, compressor) || (fn = fixed);
        }
        var is_func = fn instanceof AST_Lambda;
        if (is_func && fn.pinned()) return self1;
        if (compressor.option("unused") && simple_args && is_func && !fn.uses_arguments) {
            for(var pos = 0, last = 0, i = 0, len = self1.args.length; i < len; i++){
                if (fn.argnames[i] instanceof AST_Expansion) {
                    if (has_flag(fn.argnames[i].expression, 0b00000001)) for(; i < len;){
                        var node = self1.args[i++].drop_side_effect_free(compressor);
                        node && (self1.args[pos++] = node);
                    }
                    else for(; i < len;)self1.args[pos++] = self1.args[i++];
                    last = pos;
                    break;
                }
                var trim = i >= fn.argnames.length;
                if (trim || has_flag(fn.argnames[i], 0b00000001)) {
                    var node = self1.args[i].drop_side_effect_free(compressor);
                    if (node) self1.args[pos++] = node;
                    else if (!trim) {
                        self1.args[pos++] = make_node(AST_Number, self1.args[i], {
                            value: 0
                        });
                        continue;
                    }
                } else self1.args[pos++] = self1.args[i];
                last = pos;
            }
            self1.args.length = last;
        }
        if (compressor.option("unsafe")) {
            if (exp instanceof AST_Dot && "Array" === exp.start.value && "from" === exp.property && 1 === self1.args.length) {
                const [argument] = self1.args;
                if (argument instanceof AST_Array) return make_node(AST_Array, argument, {
                    elements: argument.elements
                }).optimize(compressor);
            }
            if (is_undeclared_ref(exp)) switch(exp.name){
                case "Array":
                    if (1 != self1.args.length) return make_node(AST_Array, self1, {
                        elements: self1.args
                    }).optimize(compressor);
                    if (self1.args[0] instanceof AST_Number && self1.args[0].value <= 11) {
                        const elements = [];
                        for(let i = 0; i < self1.args[0].value; i++)elements.push(new AST_Hole);
                        return new AST_Array({
                            elements
                        });
                    }
                    break;
                case "Object":
                    if (0 == self1.args.length) return make_node(AST_Object, self1, {
                        properties: []
                    });
                    break;
                case "String":
                    if (0 == self1.args.length) return make_node(AST_String, self1, {
                        value: ""
                    });
                    if (self1.args.length <= 1) return make_node(AST_Binary, self1, {
                        left: self1.args[0],
                        operator: "+",
                        right: make_node(AST_String, self1, {
                            value: ""
                        })
                    }).optimize(compressor);
                    break;
                case "Number":
                    if (0 == self1.args.length) return make_node(AST_Number, self1, {
                        value: 0
                    });
                    if (1 == self1.args.length && compressor.option("unsafe_math")) return make_node(AST_UnaryPrefix, self1, {
                        expression: self1.args[0],
                        operator: "+"
                    }).optimize(compressor);
                    break;
                case "Symbol":
                    1 == self1.args.length && self1.args[0] instanceof AST_String && compressor.option("unsafe_symbols") && (self1.args.length = 0);
                    break;
                case "Boolean":
                    if (0 == self1.args.length) return make_node(AST_False, self1);
                    if (1 == self1.args.length) return make_node(AST_UnaryPrefix, self1, {
                        expression: make_node(AST_UnaryPrefix, self1, {
                            expression: self1.args[0],
                            operator: "!"
                        }),
                        operator: "!"
                    }).optimize(compressor);
                    break;
                case "RegExp":
                    var params = [];
                    if (self1.args.length >= 1 && self1.args.length <= 2 && self1.args.every((arg)=>{
                        var value = arg.evaluate(compressor);
                        return params.push(value), arg !== value;
                    })) {
                        let [source, flags] = params;
                        const rx = make_node(AST_RegExp, self1, {
                            value: {
                                source: source = regexp_source_fix(new RegExp(source).source),
                                flags
                            }
                        });
                        if (rx._eval(compressor) !== rx) return rx;
                    }
            }
            else if (exp instanceof AST_Dot) switch(exp.property){
                case "toString":
                    if (0 == self1.args.length && !exp.expression.may_throw_on_access(compressor)) return make_node(AST_Binary, self1, {
                        left: make_node(AST_String, self1, {
                            value: ""
                        }),
                        operator: "+",
                        right: exp.expression
                    }).optimize(compressor);
                    break;
                case "join":
                    if (exp.expression instanceof AST_Array) {
                        EXIT: if (!(self1.args.length > 0) || (separator = self1.args[0].evaluate(compressor)) !== self1.args[0]) {
                            for(var separator, first, elements = [], consts = [], i = 0, len = exp.expression.elements.length; i < len; i++){
                                var el = exp.expression.elements[i];
                                if (el instanceof AST_Expansion) break EXIT;
                                var value = el.evaluate(compressor);
                                value !== el ? consts.push(value) : (consts.length > 0 && (elements.push(make_node(AST_String, self1, {
                                    value: consts.join(separator)
                                })), consts.length = 0), elements.push(el));
                            }
                            if (consts.length > 0 && elements.push(make_node(AST_String, self1, {
                                value: consts.join(separator)
                            })), 0 == elements.length) return make_node(AST_String, self1, {
                                value: ""
                            });
                            if (1 == elements.length) {
                                if (elements[0].is_string(compressor)) return elements[0];
                                return make_node(AST_Binary, elements[0], {
                                    operator: "+",
                                    left: make_node(AST_String, self1, {
                                        value: ""
                                    }),
                                    right: elements[0]
                                });
                            }
                            if ("" == separator) return first = elements[0].is_string(compressor) || elements[1].is_string(compressor) ? elements.shift() : make_node(AST_String, self1, {
                                value: ""
                            }), elements.reduce(function(prev, el) {
                                return make_node(AST_Binary, el, {
                                    operator: "+",
                                    left: prev,
                                    right: el
                                });
                            }, first).optimize(compressor);
                            // need this awkward cloning to not affect original element
                            // best_of will decide which one to get through.
                            var node = self1.clone();
                            return node.expression = node.expression.clone(), node.expression.expression = node.expression.expression.clone(), node.expression.expression.elements = elements, best_of(compressor, self1, node);
                        }
                    }
                    break;
                case "charAt":
                    if (exp.expression.is_string(compressor)) {
                        var arg = self1.args[0], index = arg ? arg.evaluate(compressor) : 0;
                        if (index !== arg) return make_node(AST_Sub, exp, {
                            expression: exp.expression,
                            property: make_node_from_constant(0 | index, arg || exp)
                        }).optimize(compressor);
                    }
                    break;
                case "apply":
                    if (2 == self1.args.length && self1.args[1] instanceof AST_Array) {
                        var args = self1.args[1].elements.slice();
                        return args.unshift(self1.args[0]), make_node(AST_Call, self1, {
                            expression: make_node(AST_Dot, exp, {
                                expression: exp.expression,
                                optional: !1,
                                property: "call"
                            }),
                            args: args
                        }).optimize(compressor);
                    }
                    break;
                case "call":
                    var func = exp.expression;
                    if (func instanceof AST_SymbolRef && (func = func.fixed_value()), func instanceof AST_Lambda && !func.contains_this()) return (self1.args.length ? make_sequence(this, [
                        self1.args[0],
                        make_node(AST_Call, self1, {
                            expression: exp.expression,
                            args: self1.args.slice(1)
                        })
                    ]) : make_node(AST_Call, self1, {
                        expression: exp.expression,
                        args: []
                    })).optimize(compressor);
            }
        }
        if (compressor.option("unsafe_Function") && is_undeclared_ref(exp) && "Function" == exp.name) {
            // new Function() => function(){}
            if (0 == self1.args.length) return make_node(AST_Function, self1, {
                argnames: [],
                body: []
            }).optimize(compressor);
            var nth_identifier = compressor.mangle_options && compressor.mangle_options.nth_identifier || base54;
            if (self1.args.every((x)=>x instanceof AST_String)) // quite a corner-case, but we can handle it:
            //   https://github.com/mishoo/UglifyJS2/issues/203
            // if the code argument is a constant, then we can minify it.
            try {
                var fun, code = "n(function(" + self1.args.slice(0, -1).map(function(arg) {
                    return arg.value;
                }).join(",") + "){" + self1.args[self1.args.length - 1].value + "})", ast = parse(code), mangle = {
                    ie8: compressor.option("ie8"),
                    nth_identifier: nth_identifier
                };
                ast.figure_out_scope(mangle);
                var comp = new Compressor(compressor.options, {
                    mangle_options: compressor.mangle_options
                });
                (ast = ast.transform(comp)).figure_out_scope(mangle), ast.compute_char_frequency(mangle), ast.mangle_names(mangle), walk(ast, (node)=>{
                    if (is_func_expr(node)) return fun = node, walk_abort;
                });
                var code = OutputStream();
                return AST_BlockStatement.prototype._codegen.call(fun, fun, code), self1.args = [
                    make_node(AST_String, self1, {
                        value: fun.argnames.map(function(arg) {
                            return arg.print_to_string();
                        }).join(",")
                    }),
                    make_node(AST_String, self1.args[self1.args.length - 1], {
                        value: code.get().replace(/^{|}$/g, "")
                    })
                ], self1;
            } catch (ex) {
                if (!(ex instanceof JS_Parse_Error)) throw ex;
            // Otherwise, it crashes at runtime. Or maybe it's nonstandard syntax.
            }
        }
        var stat = is_func && fn.body[0], is_regular_func = is_func && !fn.is_generator && !fn.async, can_inline = is_regular_func && compressor.option("inline") && !self1.is_callee_pure(compressor);
        if (can_inline && stat instanceof AST_Return) {
            let returned = stat.value;
            if (!returned || returned.is_constant_expression()) {
                returned = returned ? returned.clone(!0) : make_node(AST_Undefined, self1);
                const args = self1.args.concat(returned);
                return make_sequence(self1, args).optimize(compressor);
            }
            // optimize identity function
            if (1 === fn.argnames.length && fn.argnames[0] instanceof AST_SymbolFunarg && self1.args.length < 2 && returned instanceof AST_SymbolRef && returned.name === fn.argnames[0].name) {
                let parent;
                const replacement = (self1.args[0] || make_node(AST_Undefined)).optimize(compressor);
                return replacement instanceof AST_PropAccess && (parent = compressor.parent()) instanceof AST_Call && parent.expression === self1 ? make_sequence(self1, [
                    make_node(AST_Number, self1, {
                        value: 0
                    }),
                    replacement
                ]) : replacement;
            }
        }
        if (can_inline) {
            let def, returned_value, nearest_scope;
            var scope, in_loop, level = -1;
            if (simple_args && !fn.uses_arguments && !(compressor.parent() instanceof AST_Class) && !(fn.name && fn instanceof AST_Function) && (returned_value = function(stat) {
                var body = fn.body, len = body.length;
                if (3 > compressor.option("inline")) return 1 == len && return_value(stat);
                stat = null;
                for(var i = 0; i < len; i++){
                    var line = body[i];
                    if (line instanceof AST_Var) {
                        if (stat && !line.definitions.every((var_def)=>!var_def.value)) return !1;
                    } else {
                        if (stat) return !1;
                        line instanceof AST_EmptyStatement || (stat = line);
                    }
                }
                return return_value(stat);
            }(stat)) && (exp === fn || has_annotation(self1, _INLINE) || compressor.option("unused") && 1 == (def = exp.definition()).references.length && !is_recursive_ref(compressor, def) && fn.is_constant_expression(exp.scope)) && !has_annotation(self1, _PURE | _NOINLINE) && !fn.contains_this() && function() {
                var block_scoped = new Set();
                do if ((scope = compressor.parent(++level)).is_block_scope() && scope.block_scope && // TODO this is sometimes undefined during compression.
                // But it should always have a value!
                scope.block_scope.variables.forEach(function(variable) {
                    block_scoped.add(variable.name);
                }), scope instanceof AST_Catch) // TODO can we delete? AST_Catch is a block scope.
                scope.argname && block_scoped.add(scope.argname.name);
                else if (scope instanceof AST_IterationStatement) in_loop = [];
                else if (scope instanceof AST_SymbolRef && scope.fixed_value() instanceof AST_Scope) return !1;
                while (!(scope instanceof AST_Scope))
                var safe_to_inject = !(scope instanceof AST_Toplevel) || compressor.toplevel.vars, inline = compressor.option("inline");
                return !!function(block_scoped, safe_to_inject) {
                    for(var len = fn.body.length, i = 0; i < len; i++){
                        var stat = fn.body[i];
                        if (stat instanceof AST_Var) {
                            if (!safe_to_inject) return !1;
                            for(var j = stat.definitions.length; --j >= 0;){
                                var name = stat.definitions[j].name;
                                if (name instanceof AST_Destructuring || block_scoped.has(name.name) || identifier_atom.has(name.name) || scope.conflicting_def(name.name)) return !1;
                                in_loop && in_loop.push(name.definition());
                            }
                        }
                    }
                    return !0;
                }(block_scoped, inline >= 3 && safe_to_inject) && !!function(block_scoped, safe_to_inject) {
                    for(var i = 0, len = fn.argnames.length; i < len; i++){
                        var arg = fn.argnames[i];
                        if (arg instanceof AST_DefaultAssign) {
                            if (has_flag(arg.left, 0b00000001)) continue;
                            return !1;
                        }
                        if (arg instanceof AST_Destructuring) return !1;
                        if (arg instanceof AST_Expansion) {
                            if (has_flag(arg.expression, 0b00000001)) continue;
                            return !1;
                        }
                        if (!has_flag(arg, 0b00000001)) {
                            if (!safe_to_inject || block_scoped.has(arg.name) || identifier_atom.has(arg.name) || scope.conflicting_def(arg.name)) return !1;
                            in_loop && in_loop.push(arg.definition());
                        }
                    }
                    return !0;
                }(block_scoped, inline >= 2 && safe_to_inject) && (!in_loop || 0 == in_loop.length || !is_reachable(fn, in_loop));
            }() && (nearest_scope = find_scope(compressor)) && !scope_encloses_variables_in_this_scope(nearest_scope, fn) && !function() {
                // Due to the fact function parameters have their own scope
                // which can't use `var something` in the function body within,
                // we simply don't inline into DefaultAssign.
                let p, i = 0;
                for(; p = compressor.parent(i++);){
                    if (p instanceof AST_DefaultAssign) return !0;
                    if (p instanceof AST_Block) break;
                }
                return !1;
            }() && !(scope instanceof AST_Class)) return set_flag(fn, 0b0000000100000000), nearest_scope.add_child_scope(fn), make_sequence(self1, function(returned_value) {
                var decls = [], expressions = [];
                if (function(decls, expressions) {
                    for(var len = fn.argnames.length, i = self1.args.length; --i >= len;)expressions.push(self1.args[i]);
                    for(i = len; --i >= 0;){
                        var name = fn.argnames[i], value = self1.args[i];
                        if (has_flag(name, 0b00000001) || !name.name || scope.conflicting_def(name.name)) value && expressions.push(value);
                        else {
                            var symbol = make_node(AST_SymbolVar, name, name);
                            name.definition().orig.push(symbol), !value && in_loop && (value = make_node(AST_Undefined, self1)), append_var(decls, expressions, symbol, value);
                        }
                    }
                    decls.reverse(), expressions.reverse();
                }(decls, expressions), function(decls, expressions) {
                    for(var pos = expressions.length, i = 0, lines = fn.body.length; i < lines; i++){
                        var stat = fn.body[i];
                        if (stat instanceof AST_Var) for(var j = 0, defs = stat.definitions.length; j < defs; j++){
                            var var_def = stat.definitions[j], name = var_def.name;
                            if (append_var(decls, expressions, name, var_def.value), in_loop && fn.argnames.every((argname)=>argname.name != name.name)) {
                                var def = fn.variables.get(name.name), sym = make_node(AST_SymbolRef, name, name);
                                def.references.push(sym), expressions.splice(pos++, 0, make_node(AST_Assign, var_def, {
                                    operator: "=",
                                    logical: !1,
                                    left: sym,
                                    right: make_node(AST_Undefined, name)
                                }));
                            }
                        }
                    }
                }(decls, expressions), expressions.push(returned_value), decls.length) {
                    const i = scope.body.indexOf(compressor.parent(level - 1)) + 1;
                    scope.body.splice(i, 0, make_node(AST_Var, fn, {
                        definitions: decls
                    }));
                }
                return expressions.map((exp)=>exp.clone(!0));
            }(returned_value)).optimize(compressor);
        }
        if (can_inline && has_annotation(self1, _INLINE)) return set_flag(fn, 0b0000000100000000), (fn = (fn = make_node(fn.CTOR === AST_Defun ? AST_Function : fn.CTOR, fn, fn)).clone(!0)).figure_out_scope({}, {
            parent_scope: find_scope(compressor),
            toplevel: compressor.get_toplevel()
        }), make_node(AST_Call, self1, {
            expression: fn,
            args: self1.args
        }).optimize(compressor);
        if (is_regular_func && compressor.option("side_effects") && fn.body.every(is_empty)) {
            var args = self1.args.concat(make_node(AST_Undefined, self1));
            return make_sequence(self1, args).optimize(compressor);
        }
        if (compressor.option("negate_iife") && compressor.parent() instanceof AST_SimpleStatement && is_iife_call(self1)) return self1.negate(compressor, !0);
        var ev = self1.evaluate(compressor);
        if (ev !== self1) return ev = make_node_from_constant(ev, self1).optimize(compressor), best_of(compressor, ev, self1);
        return self1;
        function return_value(stat) {
            return stat ? stat instanceof AST_Return ? stat.value ? stat.value.clone(!0) : make_node(AST_Undefined, self1) : stat instanceof AST_SimpleStatement ? make_node(AST_UnaryPrefix, stat, {
                operator: "void",
                expression: stat.body.clone(!0)
            }) : void 0 : make_node(AST_Undefined, self1);
        }
        function append_var(decls, expressions, name, value) {
            var def = name.definition();
            scope.variables.has(name.name) || (scope.variables.set(name.name, def), scope.enclosed.push(def), decls.push(make_node(AST_VarDef, name, {
                name: name,
                value: null
            })));
            var sym = make_node(AST_SymbolRef, name, name);
            def.references.push(sym), value && expressions.push(make_node(AST_Assign, self1, {
                operator: "=",
                logical: !1,
                left: sym,
                right: value.clone()
            }));
        }
    }), def_optimize(AST_New, function(self1, compressor) {
        return compressor.option("unsafe") && is_undeclared_ref(self1.expression) && [
            "Object",
            "RegExp",
            "Function",
            "Error",
            "Array"
        ].includes(self1.expression.name) ? make_node(AST_Call, self1, self1).transform(compressor) : self1;
    }), def_optimize(AST_Sequence, function(self1, compressor) {
        if (!compressor.option("side_effects")) return self1;
        var first, last, expressions = [];
        first = first_in_statement(compressor), last = self1.expressions.length - 1, self1.expressions.forEach(function(expr, index) {
            index < last && (expr = expr.drop_side_effect_free(compressor, first)), expr && (merge_sequence(expressions, expr), first = !1);
        });
        var end = expressions.length - 1;
        return (function() {
            for(; end > 0 && is_undefined(expressions[end], compressor);)end--;
            end < expressions.length - 1 && (expressions[end] = make_node(AST_UnaryPrefix, self1, {
                operator: "void",
                expression: expressions[end]
            }), expressions.length = end + 1);
        }(), 0 == end) ? (self1 = maintain_this_binding(compressor.parent(), compressor.self(), expressions[0])) instanceof AST_Sequence || (self1 = self1.optimize(compressor)) : self1.expressions = expressions, self1;
    }), AST_Unary.DEFMETHOD("lift_sequences", function(compressor) {
        if (compressor.option("sequences") && this.expression instanceof AST_Sequence) {
            var x = this.expression.expressions.slice(), e = this.clone();
            return e.expression = x.pop(), x.push(e), make_sequence(this, x).optimize(compressor);
        }
        return this;
    }), def_optimize(AST_UnaryPostfix, function(self1, compressor) {
        return self1.lift_sequences(compressor);
    }), def_optimize(AST_UnaryPrefix, function(self1, compressor) {
        var e = self1.expression;
        if ("delete" == self1.operator && !(e instanceof AST_SymbolRef || e instanceof AST_PropAccess || e instanceof AST_Chain || is_identifier_atom(e))) return make_sequence(self1, [
            e,
            make_node(AST_True, self1)
        ]).optimize(compressor);
        var seq = self1.lift_sequences(compressor);
        if (seq !== self1) return seq;
        if (compressor.option("side_effects") && "void" == self1.operator) return (e = e.drop_side_effect_free(compressor)) ? (self1.expression = e, self1) : make_node(AST_Undefined, self1).optimize(compressor);
        if (compressor.in_boolean_context()) switch(self1.operator){
            case "!":
                if (e instanceof AST_UnaryPrefix && "!" == e.operator) // !!foo ==> foo, if we're in boolean context
                return e.expression;
                e instanceof AST_Binary && (self1 = best_of(compressor, self1, e.negate(compressor, first_in_statement(compressor))));
                break;
            case "typeof":
                // typeof always returns a non-empty string, thus it's
                // always true in booleans
                // And we don't need to check if it's undeclared, because in typeof, that's OK
                return (e instanceof AST_SymbolRef ? make_node(AST_True, self1) : make_sequence(self1, [
                    e,
                    make_node(AST_True, self1)
                ])).optimize(compressor);
        }
        if ("-" == self1.operator && e instanceof AST_Infinity && (e = e.transform(compressor)), e instanceof AST_Binary && ("+" == self1.operator || "-" == self1.operator) && ("*" == e.operator || "/" == e.operator || "%" == e.operator)) return make_node(AST_Binary, self1, {
            operator: e.operator,
            left: make_node(AST_UnaryPrefix, e.left, {
                operator: self1.operator,
                expression: e.left
            }),
            right: e.right
        });
        // avoids infinite recursion of numerals
        if ("-" != self1.operator || !(e instanceof AST_Number || e instanceof AST_Infinity || e instanceof AST_BigInt)) {
            var ev = self1.evaluate(compressor);
            if (ev !== self1) return ev = make_node_from_constant(ev, self1).optimize(compressor), best_of(compressor, ev, self1);
        }
        return self1;
    }), AST_Binary.DEFMETHOD("lift_sequences", function(compressor) {
        if (compressor.option("sequences")) {
            if (this.left instanceof AST_Sequence) {
                var x = this.left.expressions.slice(), e = this.clone();
                return e.left = x.pop(), x.push(e), make_sequence(this, x).optimize(compressor);
            }
            if (this.right instanceof AST_Sequence && !this.left.has_side_effects(compressor)) {
                for(var assign = "=" == this.operator && this.left instanceof AST_SymbolRef, x = this.right.expressions, last = x.length - 1, i = 0; i < last && !(!assign && x[i].has_side_effects(compressor)); i++);
                if (i == last) {
                    x = x.slice();
                    var e = this.clone();
                    return e.right = x.pop(), x.push(e), make_sequence(this, x).optimize(compressor);
                }
                if (i > 0) {
                    var e = this.clone();
                    return e.right = make_sequence(this.right, x.slice(i)), (x = x.slice(0, i)).push(e), make_sequence(this, x).optimize(compressor);
                }
            }
        }
        return this;
    });
    var commutativeOperators = makePredicate("== === != !== * & | ^");
    function scope_encloses_variables_in_this_scope(scope, pulled_scope) {
        for (const enclosed of pulled_scope.enclosed){
            if (pulled_scope.variables.has(enclosed.name)) continue;
            const looked_up = scope.find_variable(enclosed.name);
            if (looked_up) {
                if (looked_up === enclosed) continue;
                return !0;
            }
        }
        return !1;
    }
    function is_atomic(lhs, self1) {
        return lhs instanceof AST_SymbolRef || lhs.TYPE === self1.TYPE;
    }
    function is_reachable(self1, defs) {
        const find_ref = (node)=>{
            if (node instanceof AST_SymbolRef && member(node.definition(), defs)) return walk_abort;
        };
        return walk_parent(self1, (node, info)=>{
            if (node instanceof AST_Scope && node !== self1) {
                var parent = info.parent();
                return parent instanceof AST_Call && parent.expression === node && !(node.async || node.is_generator) ? void 0 : !walk(node, find_ref) || walk_abort;
            }
        });
    }
    def_optimize(AST_Binary, function(self1, compressor) {
        function reversible() {
            return self1.left.is_constant() || self1.right.is_constant() || !self1.left.has_side_effects(compressor) && !self1.right.has_side_effects(compressor);
        }
        function reverse(op) {
            if (reversible()) {
                op && (self1.operator = op);
                var tmp = self1.left;
                self1.left = self1.right, self1.right = tmp;
            }
        }
        if (commutativeOperators.has(self1.operator) && self1.right.is_constant() && !self1.left.is_constant() && !(self1.left instanceof AST_Binary && PRECEDENCE[self1.left.operator] >= PRECEDENCE[self1.operator]) && reverse(), self1 = self1.lift_sequences(compressor), compressor.option("comparisons")) switch(self1.operator){
            case "===":
            case "!==":
                var is_strict_comparison = !0;
                (self1.left.is_string(compressor) && self1.right.is_string(compressor) || self1.left.is_number(compressor) && self1.right.is_number(compressor) || self1.left.is_boolean() && self1.right.is_boolean() || self1.left.equivalent_to(self1.right)) && (self1.operator = self1.operator.substr(0, 2));
            // XXX: intentionally falling down to the next case
            case "==":
            case "!=":
                // void 0 == x => null == x
                if (!is_strict_comparison && is_undefined(self1.left, compressor)) self1.left = make_node(AST_Null, self1.left);
                else if (compressor.option("typeofs") && self1.left instanceof AST_String && "undefined" == self1.left.value && self1.right instanceof AST_UnaryPrefix && "typeof" == self1.right.operator) {
                    var node, expr = self1.right.expression;
                    (expr instanceof AST_SymbolRef ? expr.is_declared(compressor) : !(expr instanceof AST_PropAccess && compressor.option("ie8"))) && (self1.right = expr, self1.left = make_node(AST_Undefined, self1.left).optimize(compressor), 2 == self1.operator.length && (self1.operator += "="));
                } else if (self1.left instanceof AST_SymbolRef && self1.right instanceof AST_SymbolRef && self1.left.definition() === self1.right.definition() && ((node = self1.left.fixed_value()) instanceof AST_Array || node instanceof AST_Lambda || node instanceof AST_Object || node instanceof AST_Class)) return make_node("=" == self1.operator[0] ? AST_True : AST_False, self1);
                break;
            case "&&":
            case "||":
                var lhs = self1.left;
                if (lhs.operator == self1.operator && (lhs = lhs.right), lhs instanceof AST_Binary && lhs.operator == ("&&" == self1.operator ? "!==" : "===") && self1.right instanceof AST_Binary && lhs.operator == self1.right.operator && (is_undefined(lhs.left, compressor) && self1.right.left instanceof AST_Null || lhs.left instanceof AST_Null && is_undefined(self1.right.left, compressor)) && !lhs.right.has_side_effects(compressor) && lhs.right.equivalent_to(self1.right.right)) {
                    var combined = make_node(AST_Binary, self1, {
                        operator: lhs.operator.slice(0, -1),
                        left: make_node(AST_Null, self1),
                        right: lhs.right
                    });
                    return lhs !== self1.left && (combined = make_node(AST_Binary, self1, {
                        operator: self1.operator,
                        left: self1.left.left,
                        right: combined
                    })), combined;
                }
        }
        if ("+" == self1.operator && compressor.in_boolean_context()) {
            var ll = self1.left.evaluate(compressor), rr = self1.right.evaluate(compressor);
            if (ll && "string" == typeof ll) return make_sequence(self1, [
                self1.right,
                make_node(AST_True, self1)
            ]).optimize(compressor);
            if (rr && "string" == typeof rr) return make_sequence(self1, [
                self1.left,
                make_node(AST_True, self1)
            ]).optimize(compressor);
        }
        if (compressor.option("comparisons") && self1.is_boolean()) {
            if (!(compressor.parent() instanceof AST_Binary) || compressor.parent() instanceof AST_Assign) {
                var negated = make_node(AST_UnaryPrefix, self1, {
                    operator: "!",
                    expression: self1.negate(compressor, first_in_statement(compressor))
                });
                self1 = best_of(compressor, self1, negated);
            }
            if (compressor.option("unsafe_comps")) switch(self1.operator){
                case "<":
                    reverse(">");
                    break;
                case "<=":
                    reverse(">=");
            }
        }
        if ("+" == self1.operator) {
            if (self1.right instanceof AST_String && "" == self1.right.getValue() && self1.left.is_string(compressor)) return self1.left;
            if (self1.left instanceof AST_String && "" == self1.left.getValue() && self1.right.is_string(compressor)) return self1.right;
            if (self1.left instanceof AST_Binary && "+" == self1.left.operator && self1.left.left instanceof AST_String && "" == self1.left.left.getValue() && self1.right.is_string(compressor)) return self1.left = self1.left.right, self1;
        }
        if (compressor.option("evaluate")) {
            switch(self1.operator){
                case "&&":
                    var ll = !!has_flag(self1.left, 0b00000010) || !has_flag(self1.left, 0b00000100) && self1.left.evaluate(compressor);
                    if (!ll) return maintain_this_binding(compressor.parent(), compressor.self(), self1.left).optimize(compressor);
                    if (!(ll instanceof AST_Node)) return make_sequence(self1, [
                        self1.left,
                        self1.right
                    ]).optimize(compressor);
                    var rr = self1.right.evaluate(compressor);
                    if (rr) {
                        if (!(rr instanceof AST_Node)) {
                            var parent = compressor.parent();
                            if ("&&" == parent.operator && parent.left === compressor.self() || compressor.in_boolean_context()) return self1.left.optimize(compressor);
                        }
                    } else {
                        if (compressor.in_boolean_context()) return make_sequence(self1, [
                            self1.left,
                            make_node(AST_False, self1)
                        ]).optimize(compressor);
                        set_flag(self1, 0b00000100);
                    }
                    // x || false && y ---> x ? y : false
                    if ("||" == self1.left.operator) {
                        var lr = self1.left.right.evaluate(compressor);
                        if (!lr) return make_node(AST_Conditional, self1, {
                            condition: self1.left.left,
                            consequent: self1.right,
                            alternative: self1.left.right
                        }).optimize(compressor);
                    }
                    break;
                case "||":
                    var ll = !!has_flag(self1.left, 0b00000010) || !has_flag(self1.left, 0b00000100) && self1.left.evaluate(compressor);
                    if (!ll) return make_sequence(self1, [
                        self1.left,
                        self1.right
                    ]).optimize(compressor);
                    if (!(ll instanceof AST_Node)) return maintain_this_binding(compressor.parent(), compressor.self(), self1.left).optimize(compressor);
                    var rr = self1.right.evaluate(compressor);
                    if (rr) {
                        if (!(rr instanceof AST_Node)) {
                            if (compressor.in_boolean_context()) return make_sequence(self1, [
                                self1.left,
                                make_node(AST_True, self1)
                            ]).optimize(compressor);
                            set_flag(self1, 0b00000010);
                        }
                    } else {
                        var parent = compressor.parent();
                        if ("||" == parent.operator && parent.left === compressor.self() || compressor.in_boolean_context()) return self1.left.optimize(compressor);
                    }
                    if ("&&" == self1.left.operator) {
                        var lr = self1.left.right.evaluate(compressor);
                        if (lr && !(lr instanceof AST_Node)) return make_node(AST_Conditional, self1, {
                            condition: self1.left.left,
                            consequent: self1.left.right,
                            alternative: self1.right
                        }).optimize(compressor);
                    }
                    break;
                case "??":
                    if (is_nullish(self1.left, compressor)) return self1.right;
                    var ll = self1.left.evaluate(compressor);
                    if (!(ll instanceof AST_Node)) // if we know the value for sure we can simply compute right away.
                    return null == ll ? self1.right : self1.left;
                    if (compressor.in_boolean_context()) {
                        const rr = self1.right.evaluate(compressor);
                        if (!(rr instanceof AST_Node) && !rr) return self1.left;
                    }
            }
            var associative = !0;
            switch(self1.operator){
                case "+":
                    // (x + "foo") + "bar" => x + "foobar"
                    if (self1.right instanceof AST_Constant && self1.left instanceof AST_Binary && "+" == self1.left.operator && self1.left.is_string(compressor)) {
                        var binary = make_node(AST_Binary, self1, {
                            operator: "+",
                            left: self1.left.right,
                            right: self1.right
                        }), r = binary.optimize(compressor);
                        binary !== r && (self1 = make_node(AST_Binary, self1, {
                            operator: "+",
                            left: self1.left.left,
                            right: r
                        }));
                    }
                    // (x + "foo") + ("bar" + y) => (x + "foobar") + y
                    if (self1.left instanceof AST_Binary && "+" == self1.left.operator && self1.left.is_string(compressor) && self1.right instanceof AST_Binary && "+" == self1.right.operator && self1.right.is_string(compressor)) {
                        var binary = make_node(AST_Binary, self1, {
                            operator: "+",
                            left: self1.left.right,
                            right: self1.right.left
                        }), m = binary.optimize(compressor);
                        binary !== m && (self1 = make_node(AST_Binary, self1, {
                            operator: "+",
                            left: make_node(AST_Binary, self1.left, {
                                operator: "+",
                                left: self1.left.left,
                                right: m
                            }),
                            right: self1.right.right
                        }));
                    }
                    // a + -b => a - b
                    if (self1.right instanceof AST_UnaryPrefix && "-" == self1.right.operator && self1.left.is_number(compressor)) {
                        self1 = make_node(AST_Binary, self1, {
                            operator: "-",
                            left: self1.left,
                            right: self1.right.expression
                        });
                        break;
                    }
                    // -a + b => b - a
                    if (self1.left instanceof AST_UnaryPrefix && "-" == self1.left.operator && reversible() && self1.right.is_number(compressor)) {
                        self1 = make_node(AST_Binary, self1, {
                            operator: "-",
                            left: self1.right,
                            right: self1.left.expression
                        });
                        break;
                    }
                    // `foo${bar}baz` + 1 => `foo${bar}baz1`
                    if (self1.left instanceof AST_TemplateString) {
                        var l = self1.left, r = self1.right.evaluate(compressor);
                        if (r != self1.right) return l.segments[l.segments.length - 1].value += String(r), l;
                    }
                    // 1 + `foo${bar}baz` => `1foo${bar}baz`
                    if (self1.right instanceof AST_TemplateString) {
                        var r = self1.right, l = self1.left.evaluate(compressor);
                        if (l != self1.left) return r.segments[0].value = String(l) + r.segments[0].value, r;
                    }
                    // `1${bar}2` + `foo${bar}baz` => `1${bar}2foo${bar}baz`
                    if (self1.left instanceof AST_TemplateString && self1.right instanceof AST_TemplateString) {
                        var l = self1.left, segments = l.segments, r = self1.right;
                        segments[segments.length - 1].value += r.segments[0].value;
                        for(var i = 1; i < r.segments.length; i++)segments.push(r.segments[i]);
                        return l;
                    }
                case "*":
                    associative = compressor.option("unsafe_math");
                case "&":
                case "|":
                case "^":
                    // a + +b => +b + a
                    if (self1.left.is_number(compressor) && self1.right.is_number(compressor) && reversible() && !(self1.left instanceof AST_Binary && self1.left.operator != self1.operator && PRECEDENCE[self1.left.operator] >= PRECEDENCE[self1.operator])) {
                        var reversed = make_node(AST_Binary, self1, {
                            operator: self1.operator,
                            left: self1.right,
                            right: self1.left
                        });
                        self1 = self1.right instanceof AST_Constant && !(self1.left instanceof AST_Constant) ? best_of(compressor, reversed, self1) : best_of(compressor, self1, reversed);
                    }
                    associative && self1.is_number(compressor) && (self1.right instanceof AST_Binary && self1.right.operator == self1.operator && (self1 = make_node(AST_Binary, self1, {
                        operator: self1.operator,
                        left: make_node(AST_Binary, self1.left, {
                            operator: self1.operator,
                            left: self1.left,
                            right: self1.right.left,
                            start: self1.left.start,
                            end: self1.right.left.end
                        }),
                        right: self1.right.right
                    })), self1.right instanceof AST_Constant && self1.left instanceof AST_Binary && self1.left.operator == self1.operator && (self1.left.left instanceof AST_Constant ? self1 = make_node(AST_Binary, self1, {
                        operator: self1.operator,
                        left: make_node(AST_Binary, self1.left, {
                            operator: self1.operator,
                            left: self1.left.left,
                            right: self1.right,
                            start: self1.left.left.start,
                            end: self1.right.end
                        }),
                        right: self1.left.right
                    }) : self1.left.right instanceof AST_Constant && (self1 = make_node(AST_Binary, self1, {
                        operator: self1.operator,
                        left: make_node(AST_Binary, self1.left, {
                            operator: self1.operator,
                            left: self1.left.right,
                            right: self1.right,
                            start: self1.left.right.start,
                            end: self1.right.end
                        }),
                        right: self1.left.left
                    }))), self1.left instanceof AST_Binary && self1.left.operator == self1.operator && self1.left.right instanceof AST_Constant && self1.right instanceof AST_Binary && self1.right.operator == self1.operator && self1.right.left instanceof AST_Constant && (self1 = make_node(AST_Binary, self1, {
                        operator: self1.operator,
                        left: make_node(AST_Binary, self1.left, {
                            operator: self1.operator,
                            left: make_node(AST_Binary, self1.left.left, {
                                operator: self1.operator,
                                left: self1.left.right,
                                right: self1.right.left,
                                start: self1.left.right.start,
                                end: self1.right.left.end
                            }),
                            right: self1.left.left
                        }),
                        right: self1.right.right
                    })));
            }
        }
        // x && (y && z)  ==>  x && y && z
        // x || (y || z)  ==>  x || y || z
        // x + ("y" + z)  ==>  x + "y" + z
        // "x" + (y + "z")==>  "x" + y + "z"
        if (self1.right instanceof AST_Binary && self1.right.operator == self1.operator && (lazy_op.has(self1.operator) || "+" == self1.operator && (self1.right.left.is_string(compressor) || self1.left.is_string(compressor) && self1.right.right.is_string(compressor)))) return self1.left = make_node(AST_Binary, self1.left, {
            operator: self1.operator,
            left: self1.left.transform(compressor),
            right: self1.right.left.transform(compressor)
        }), self1.right = self1.right.right.transform(compressor), self1.transform(compressor);
        var ev = self1.evaluate(compressor);
        return ev !== self1 ? (ev = make_node_from_constant(ev, self1).optimize(compressor), best_of(compressor, ev, self1)) : self1;
    }), def_optimize(AST_SymbolExport, function(self1) {
        return self1;
    }), def_optimize(AST_SymbolRef, function(self1, compressor) {
        if (!compressor.option("ie8") && is_undeclared_ref(self1) && !compressor.find_parent(AST_With)) switch(self1.name){
            case "undefined":
                return make_node(AST_Undefined, self1).optimize(compressor);
            case "NaN":
                return make_node(AST_NaN, self1).optimize(compressor);
            case "Infinity":
                return make_node(AST_Infinity, self1).optimize(compressor);
        }
        const parent = compressor.parent();
        if (compressor.option("reduce_vars") && is_lhs(self1, parent) !== self1) {
            const def = self1.definition(), nearest_scope = find_scope(compressor);
            if (compressor.top_retain && def.global && compressor.top_retain(def)) return def.fixed = !1, def.single_use = !1, self1;
            let fixed = self1.fixed_value(), single_use = def.single_use && !(parent instanceof AST_Call && parent.is_callee_pure(compressor) || has_annotation(parent, _NOINLINE)) && !(parent instanceof AST_Export && fixed instanceof AST_Lambda && fixed.name);
            if (single_use && fixed instanceof AST_Node && (single_use = !fixed.has_side_effects(compressor) && !fixed.may_throw(compressor)), single_use && (fixed instanceof AST_Lambda || fixed instanceof AST_Class)) {
                if (retain_top_func(fixed, compressor)) single_use = !1;
                else if (def.scope !== self1.scope && (1 == def.escaped || has_flag(fixed, 0b00010000) || function(compressor) {
                    for(var node, level = 0; (node = compressor.parent(level++)) && !(node instanceof AST_Statement);)if (node instanceof AST_Array || node instanceof AST_ObjectKeyVal || node instanceof AST_Object) return !0;
                    return !1;
                }(compressor) || !compressor.option("reduce_funcs"))) single_use = !1;
                else if (is_recursive_ref(compressor, def)) single_use = !1;
                else if ((def.scope !== self1.scope || def.orig[0] instanceof AST_SymbolFunarg) && "f" == (single_use = fixed.is_constant_expression(self1.scope))) {
                    var scope = self1.scope;
                    do (scope instanceof AST_Defun || is_func_expr(scope)) && set_flag(scope, 0b00010000);
                    while (scope = scope.parent_scope)
                }
            }
            if (single_use && fixed instanceof AST_Lambda && (single_use = def.scope === self1.scope && !scope_encloses_variables_in_this_scope(nearest_scope, fixed) || parent instanceof AST_Call && parent.expression === self1 && !scope_encloses_variables_in_this_scope(nearest_scope, fixed) && !(fixed.name && fixed.name.definition().recursive_refs > 0)), single_use && fixed) {
                if (fixed instanceof AST_DefClass && (set_flag(fixed, 0b0000000100000000), fixed = make_node(AST_ClassExpression, fixed, fixed)), fixed instanceof AST_Defun && (set_flag(fixed, 0b0000000100000000), fixed = make_node(AST_Function, fixed, fixed)), def.recursive_refs > 0 && fixed.name instanceof AST_SymbolDefun) {
                    const defun_def = fixed.name.definition();
                    let lambda_def = fixed.variables.get(fixed.name.name), name = lambda_def && lambda_def.orig[0];
                    name instanceof AST_SymbolLambda || ((name = make_node(AST_SymbolLambda, fixed.name, fixed.name)).scope = fixed, fixed.name = name, lambda_def = fixed.def_function(name)), walk(fixed, (node)=>{
                        node instanceof AST_SymbolRef && node.definition() === defun_def && (node.thedef = lambda_def, lambda_def.references.push(node));
                    });
                }
                return (fixed instanceof AST_Lambda || fixed instanceof AST_Class) && fixed.parent_scope !== nearest_scope && (fixed = fixed.clone(!0, compressor.get_toplevel()), nearest_scope.add_child_scope(fixed)), fixed.optimize(compressor);
            }
            // multiple uses
            if (fixed) {
                let replace;
                if (fixed instanceof AST_This) !(def.orig[0] instanceof AST_SymbolFunarg) && def.references.every((ref)=>def.scope === ref.scope) && (replace = fixed);
                else {
                    var ev = fixed.evaluate(compressor);
                    ev !== fixed && (compressor.option("unsafe_regexp") || !(ev instanceof RegExp)) && (replace = make_node_from_constant(ev, fixed));
                }
                if (replace) {
                    const name_length = self1.size(compressor), replace_size = replace.size(compressor);
                    let overhead = 0;
                    if (compressor.option("unused") && !compressor.exposed(def) && (overhead = (name_length + 2 + replace_size) / (def.references.length - def.assignments)), replace_size <= name_length + overhead) return replace;
                }
            }
        }
        return self1;
    }), def_optimize(AST_Undefined, function(self1, compressor) {
        if (compressor.option("unsafe_undefined")) {
            var undef = find_variable(compressor, "undefined");
            if (undef) {
                var ref = make_node(AST_SymbolRef, self1, {
                    name: "undefined",
                    scope: undef.scope,
                    thedef: undef
                });
                return set_flag(ref, 0b00001000), ref;
            }
        }
        var lhs = is_lhs(compressor.self(), compressor.parent());
        return lhs && is_atomic(lhs, self1) ? self1 : make_node(AST_UnaryPrefix, self1, {
            operator: "void",
            expression: make_node(AST_Number, self1, {
                value: 0
            })
        });
    }), def_optimize(AST_Infinity, function(self1, compressor) {
        var lhs = is_lhs(compressor.self(), compressor.parent());
        return lhs && is_atomic(lhs, self1) || compressor.option("keep_infinity") && !(lhs && !is_atomic(lhs, self1)) && !find_variable(compressor, "Infinity") ? self1 : make_node(AST_Binary, self1, {
            operator: "/",
            left: make_node(AST_Number, self1, {
                value: 1
            }),
            right: make_node(AST_Number, self1, {
                value: 0
            })
        });
    }), def_optimize(AST_NaN, function(self1, compressor) {
        var lhs = is_lhs(compressor.self(), compressor.parent());
        return lhs && !is_atomic(lhs, self1) || find_variable(compressor, "NaN") ? make_node(AST_Binary, self1, {
            operator: "/",
            left: make_node(AST_Number, self1, {
                value: 0
            }),
            right: make_node(AST_Number, self1, {
                value: 0
            })
        }) : self1;
    });
    const ASSIGN_OPS = makePredicate("+ - / * % >> << >>> | ^ &"), ASSIGN_OPS_COMMUTATIVE = makePredicate("* | ^ &");
    function safe_to_flatten(value, compressor) {
        return value instanceof AST_SymbolRef && (value = value.fixed_value()), !!value && (!((value instanceof AST_Lambda || value instanceof AST_Class) && value instanceof AST_Lambda && value.contains_this()) || compressor.parent() instanceof AST_New);
    }
    function literals_in_boolean_context(self1, compressor) {
        return compressor.in_boolean_context() ? best_of(compressor, self1, make_sequence(self1, [
            self1,
            make_node(AST_True, self1)
        ]).optimize(compressor)) : self1;
    }
    function inline_array_like_spread(elements) {
        for(var i = 0; i < elements.length; i++){
            var el = elements[i];
            if (el instanceof AST_Expansion) {
                var expr = el.expression;
                expr instanceof AST_Array && !expr.elements.some((elm)=>elm instanceof AST_Hole) && (elements.splice(i, 1, ...expr.elements), // Step back one, as the element at i is now new.
                i--);
            // In array-like spread, spreading a non-iterable value is TypeError.
            // We therefore can’t optimize anything else, unlike with object spread.
            }
        }
    }
    // ["p"]:1 ---> p:1
    // [42]:1 ---> 42:1
    function lift_key(self1, compressor) {
        if (!compressor.option("computed_props") || !(self1.key instanceof AST_Constant)) return self1;
        // allow certain acceptable props as not all AST_Constants are true constants
        if (self1.key instanceof AST_String || self1.key instanceof AST_Number) {
            if ("__proto__" === self1.key.value || "constructor" == self1.key.value && compressor.parent() instanceof AST_Class) return self1;
            self1 instanceof AST_ObjectKeyVal ? (self1.quote = self1.key.quote, self1.key = self1.key.value) : self1 instanceof AST_ClassProperty ? (self1.quote = self1.key.quote, self1.key = make_node(AST_SymbolClassProperty, self1.key, {
                name: self1.key.value
            })) : (self1.quote = self1.key.quote, self1.key = make_node(AST_SymbolMethod, self1.key, {
                name: self1.key.value
            }));
        }
        return self1;
    }
    /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ // a small wrapper around fitzgen's source-map library
    async function SourceMap(options) {
        options = defaults(options, {
            file: null,
            root: null,
            orig: null,
            orig_line_diff: 0,
            dest_line_diff: 0
        });
        var orig_map, generator = new MOZ_SourceMap__default.default.SourceMapGenerator({
            file: options.file,
            sourceRoot: options.root
        });
        return options.orig && (orig_map = await new MOZ_SourceMap__default.default.SourceMapConsumer(options.orig)).sources.forEach(function(source) {
            var sourceContent = orig_map.sourceContentFor(source, !0);
            sourceContent && generator.setSourceContent(source, sourceContent);
        }), {
            add: function(source, gen_line, gen_col, orig_line, orig_col, name) {
                if (orig_map) {
                    var info = orig_map.originalPositionFor({
                        line: orig_line,
                        column: orig_col
                    });
                    if (null === info.source) return;
                    source = info.source, orig_line = info.line, orig_col = info.column, name = info.name || name;
                }
                generator.addMapping({
                    generated: {
                        line: gen_line + options.dest_line_diff,
                        column: gen_col
                    },
                    original: {
                        line: orig_line + options.orig_line_diff,
                        column: orig_col
                    },
                    source: source,
                    name: name
                });
            },
            get: function() {
                return generator;
            },
            toString: function() {
                return generator.toString();
            },
            destroy: function() {
                orig_map && orig_map.destroy && orig_map.destroy();
            }
        };
    }
    def_optimize(AST_Assign, function(self1, compressor) {
        if (self1.logical) return self1.lift_sequences(compressor);
        if (compressor.option("dead_code") && self1.left instanceof AST_SymbolRef && (def = self1.left.definition()).scope === compressor.find_parent(AST_Lambda)) {
            var def, node, level = 0, parent = self1;
            do if (node = parent, (parent = compressor.parent(level++)) instanceof AST_Exit) {
                if (function(level, node) {
                    var parent, right = self1.right;
                    self1.right = make_node(AST_Null, right);
                    var may_throw = node.may_throw(compressor);
                    self1.right = right;
                    for(var scope = self1.left.definition().scope; (parent = compressor.parent(level++)) !== scope;)if (parent instanceof AST_Try && (parent.bfinally || may_throw && parent.bcatch)) return !0;
                }(level, parent) || is_reachable(def.scope, [
                    def
                ])) break;
                if ("=" == self1.operator) return self1.right;
                return def.fixed = !1, make_node(AST_Binary, self1, {
                    operator: self1.operator.slice(0, -1),
                    left: self1.left,
                    right: self1.right
                }).optimize(compressor);
            }
            while (parent instanceof AST_Binary && parent.right === node || parent instanceof AST_Sequence && parent.tail_node() === node)
        }
        return "=" == (self1 = self1.lift_sequences(compressor)).operator && self1.left instanceof AST_SymbolRef && self1.right instanceof AST_Binary && (self1.right.left instanceof AST_SymbolRef && self1.right.left.name == self1.left.name && ASSIGN_OPS.has(self1.right.operator) ? (// x = x - 2  --->  x -= 2
        self1.operator = self1.right.operator + "=", self1.right = self1.right.right) : self1.right.right instanceof AST_SymbolRef && self1.right.right.name == self1.left.name && ASSIGN_OPS_COMMUTATIVE.has(self1.right.operator) && !self1.right.left.has_side_effects(compressor) && (// x = 2 & x  --->  x &= 2
        self1.operator = self1.right.operator + "=", self1.right = self1.right.left)), self1;
    }), def_optimize(AST_DefaultAssign, function(self1, compressor) {
        if (!compressor.option("evaluate")) return self1;
        var evaluateRight = self1.right.evaluate(compressor);
        return void 0 === evaluateRight ? self1 = self1.left : evaluateRight !== self1.right && (evaluateRight = make_node_from_constant(evaluateRight, self1.right), self1.right = best_of_expression(evaluateRight, self1.right)), self1;
    }), def_optimize(AST_Conditional, function(self1, compressor) {
        if (!compressor.option("conditionals")) return self1;
        // This looks like lift_sequences(), should probably be under "sequences"
        if (self1.condition instanceof AST_Sequence) {
            var arg_index, expressions = self1.condition.expressions.slice();
            return self1.condition = expressions.pop(), expressions.push(self1), make_sequence(self1, expressions);
        }
        var cond = self1.condition.evaluate(compressor);
        if (cond !== self1.condition) return cond ? maintain_this_binding(compressor.parent(), compressor.self(), self1.consequent) : maintain_this_binding(compressor.parent(), compressor.self(), self1.alternative);
        var negated = cond.negate(compressor, first_in_statement(compressor));
        best_of(compressor, cond, negated) === negated && (self1 = make_node(AST_Conditional, self1, {
            condition: negated,
            consequent: self1.alternative,
            alternative: self1.consequent
        }));
        var condition = self1.condition, consequent = self1.consequent, alternative = self1.alternative;
        // x?x:y --> x||y
        if (condition instanceof AST_SymbolRef && consequent instanceof AST_SymbolRef && condition.definition() === consequent.definition()) return make_node(AST_Binary, self1, {
            operator: "||",
            left: condition,
            right: alternative
        });
        // if (foo) exp = something; else exp = something_else;
        //                   |
        //                   v
        // exp = foo ? something : something_else;
        if (consequent instanceof AST_Assign && alternative instanceof AST_Assign && consequent.operator === alternative.operator && consequent.logical === alternative.logical && consequent.left.equivalent_to(alternative.left) && (!self1.condition.has_side_effects(compressor) || "=" == consequent.operator && !consequent.left.has_side_effects(compressor))) return make_node(AST_Assign, self1, {
            operator: consequent.operator,
            left: consequent.left,
            logical: consequent.logical,
            right: make_node(AST_Conditional, self1, {
                condition: self1.condition,
                consequent: consequent.right,
                alternative: alternative.right
            })
        });
        if (consequent instanceof AST_Call && alternative.TYPE === consequent.TYPE && consequent.args.length > 0 && consequent.args.length == alternative.args.length && consequent.expression.equivalent_to(alternative.expression) && !self1.condition.has_side_effects(compressor) && !consequent.expression.has_side_effects(compressor) && "number" == typeof (arg_index = function() {
            for(var a = consequent.args, b = alternative.args, i = 0, len = a.length; i < len; i++){
                if (a[i] instanceof AST_Expansion) return;
                if (!a[i].equivalent_to(b[i])) {
                    if (b[i] instanceof AST_Expansion) return;
                    for(var j = i + 1; j < len; j++)if (a[j] instanceof AST_Expansion || !a[j].equivalent_to(b[j])) return;
                    return i;
                }
            }
        }())) {
            var node = consequent.clone();
            return node.args[arg_index] = make_node(AST_Conditional, self1, {
                condition: self1.condition,
                consequent: consequent.args[arg_index],
                alternative: alternative.args[arg_index]
            }), node;
        }
        // a ? b : c ? b : d --> (a || c) ? b : d
        if (alternative instanceof AST_Conditional && consequent.equivalent_to(alternative.consequent)) return make_node(AST_Conditional, self1, {
            condition: make_node(AST_Binary, self1, {
                operator: "||",
                left: condition,
                right: alternative.condition
            }),
            consequent: consequent,
            alternative: alternative.alternative
        }).optimize(compressor);
        // a == null ? b : a -> a ?? b
        if (compressor.option("ecma") >= 2020 && function(check, check_subject, compressor) {
            let nullish_side;
            if (check_subject.may_throw(compressor)) return !1;
            // foo == null
            if (check instanceof AST_Binary && "==" === check.operator && ((nullish_side = is_nullish(check.left, compressor) && check.left) || (nullish_side = is_nullish(check.right, compressor) && check.right)) && (nullish_side === check.left ? check.right : check.left).equivalent_to(check_subject)) return !0;
            // foo === null || foo === undefined
            if (check instanceof AST_Binary && "||" === check.operator) {
                let null_cmp, undefined_cmp;
                const find_comparison = (cmp)=>{
                    let defined_side;
                    if (!(cmp instanceof AST_Binary && ("===" === cmp.operator || "==" === cmp.operator))) return !1;
                    let found = 0;
                    return cmp.left instanceof AST_Null && (found++, null_cmp = cmp, defined_side = cmp.right), cmp.right instanceof AST_Null && (found++, null_cmp = cmp, defined_side = cmp.left), is_undefined(cmp.left, compressor) && (found++, undefined_cmp = cmp, defined_side = cmp.right), is_undefined(cmp.right, compressor) && (found++, undefined_cmp = cmp, defined_side = cmp.left), !!(1 === found && defined_side.equivalent_to(check_subject));
                };
                if (!find_comparison(check.left) || !find_comparison(check.right)) return !1;
                if (null_cmp && undefined_cmp && null_cmp !== undefined_cmp) return !0;
            }
            return !1;
        }(condition, alternative, compressor)) return make_node(AST_Binary, self1, {
            operator: "??",
            left: alternative,
            right: consequent
        }).optimize(compressor);
        // a ? b : (c, b) --> (a || c), b
        if (alternative instanceof AST_Sequence && consequent.equivalent_to(alternative.expressions[alternative.expressions.length - 1])) return make_sequence(self1, [
            make_node(AST_Binary, self1, {
                operator: "||",
                left: condition,
                right: make_sequence(self1, alternative.expressions.slice(0, -1))
            }),
            consequent
        ]).optimize(compressor);
        // a ? b : (c && b) --> (a || c) && b
        if (alternative instanceof AST_Binary && "&&" == alternative.operator && consequent.equivalent_to(alternative.right)) return make_node(AST_Binary, self1, {
            operator: "&&",
            left: make_node(AST_Binary, self1, {
                operator: "||",
                left: condition,
                right: alternative.left
            }),
            right: consequent
        }).optimize(compressor);
        // x?y?z:a:a --> x&&y?z:a
        if (consequent instanceof AST_Conditional && consequent.alternative.equivalent_to(alternative)) return make_node(AST_Conditional, self1, {
            condition: make_node(AST_Binary, self1, {
                left: self1.condition,
                operator: "&&",
                right: consequent.condition
            }),
            consequent: consequent.consequent,
            alternative: alternative
        });
        // x ? y : y --> x, y
        if (consequent.equivalent_to(alternative)) return make_sequence(self1, [
            self1.condition,
            consequent
        ]).optimize(compressor);
        // x ? y || z : z --> x && y || z
        if (consequent instanceof AST_Binary && "||" == consequent.operator && consequent.right.equivalent_to(alternative)) return make_node(AST_Binary, self1, {
            operator: "||",
            left: make_node(AST_Binary, self1, {
                operator: "&&",
                left: self1.condition,
                right: consequent.left
            }),
            right: alternative
        }).optimize(compressor);
        const in_bool = compressor.in_boolean_context();
        if (is_true(self1.consequent)) return is_false(self1.alternative) ? booleanize(self1.condition) : make_node(AST_Binary, self1, {
            operator: "||",
            left: booleanize(self1.condition),
            right: self1.alternative
        });
        if (is_false(self1.consequent)) return is_true(self1.alternative) ? booleanize(self1.condition.negate(compressor)) : make_node(AST_Binary, self1, {
            operator: "&&",
            left: booleanize(self1.condition.negate(compressor)),
            right: self1.alternative
        });
        if (is_true(self1.alternative)) // c ? x : true ---> !c || x
        return make_node(AST_Binary, self1, {
            operator: "||",
            left: booleanize(self1.condition.negate(compressor)),
            right: self1.consequent
        });
        if (is_false(self1.alternative)) // c ? x : false ---> !!c && x
        return make_node(AST_Binary, self1, {
            operator: "&&",
            left: booleanize(self1.condition),
            right: self1.consequent
        });
        return self1;
        function booleanize(node) {
            return node.is_boolean() ? node : make_node(AST_UnaryPrefix, node, {
                operator: "!",
                expression: node.negate(compressor)
            });
        }
        // AST_True or !0
        function is_true(node) {
            return node instanceof AST_True || in_bool && node instanceof AST_Constant && node.getValue() || node instanceof AST_UnaryPrefix && "!" == node.operator && node.expression instanceof AST_Constant && !node.expression.getValue();
        }
        // AST_False or !1
        function is_false(node) {
            return node instanceof AST_False || in_bool && node instanceof AST_Constant && !node.getValue() || node instanceof AST_UnaryPrefix && "!" == node.operator && node.expression instanceof AST_Constant && node.expression.getValue();
        }
    }), def_optimize(AST_Boolean, function(self1, compressor) {
        if (compressor.in_boolean_context()) return make_node(AST_Number, self1, {
            value: +self1.value
        });
        var p = compressor.parent();
        return compressor.option("booleans_as_integers") ? (p instanceof AST_Binary && ("===" == p.operator || "!==" == p.operator) && (p.operator = p.operator.replace(/=$/, "")), make_node(AST_Number, self1, {
            value: +self1.value
        })) : compressor.option("booleans") ? p instanceof AST_Binary && ("==" == p.operator || "!=" == p.operator) ? make_node(AST_Number, self1, {
            value: +self1.value
        }) : make_node(AST_UnaryPrefix, self1, {
            operator: "!",
            expression: make_node(AST_Number, self1, {
                value: 1 - self1.value
            })
        }) : self1;
    }), AST_PropAccess.DEFMETHOD("flatten_object", function(key, compressor) {
        if (compressor.option("properties") && "__proto__" !== key) {
            var arrows = compressor.option("unsafe_arrows") && compressor.option("ecma") >= 2015, expr = this.expression;
            if (expr instanceof AST_Object) for(var props = expr.properties, i = props.length; --i >= 0;){
                var prop = props[i];
                if ("" + (prop instanceof AST_ConciseMethod ? prop.key.name : prop.key) == key) {
                    if (!props.every((p)=>(p instanceof AST_ObjectKeyVal || arrows && p instanceof AST_ConciseMethod && !p.is_generator) && !p.computed_key()) || !safe_to_flatten(prop.value, compressor)) return;
                    return make_node(AST_Sub, this, {
                        expression: make_node(AST_Array, expr, {
                            elements: props.map(function(prop) {
                                var v = prop.value;
                                v instanceof AST_Accessor && (v = make_node(AST_Function, v, v));
                                var k = prop.key;
                                return k instanceof AST_Node && !(k instanceof AST_SymbolMethod) ? make_sequence(prop, [
                                    k,
                                    v
                                ]) : v;
                            })
                        }),
                        property: make_node(AST_Number, this, {
                            value: i
                        })
                    });
                }
            }
        }
    }), def_optimize(AST_Sub, function(self1, compressor) {
        var fn, expr = self1.expression, prop = self1.property;
        if (compressor.option("properties")) {
            var key = prop.evaluate(compressor);
            if (key !== prop) {
                if ("string" == typeof key) {
                    if ("undefined" == key) key = void 0;
                    else {
                        var value = parseFloat(key);
                        value.toString() == key && (key = value);
                    }
                }
                prop = self1.property = best_of_expression(prop, make_node_from_constant(key, prop).transform(compressor));
                var property = "" + key;
                if (is_basic_identifier_string(property) && property.length <= prop.size() + 1) return make_node(AST_Dot, self1, {
                    expression: expr,
                    optional: self1.optional,
                    property: property,
                    quote: prop.quote
                }).optimize(compressor);
            }
        }
        OPT_ARGUMENTS: if (compressor.option("arguments") && expr instanceof AST_SymbolRef && "arguments" == expr.name && 1 == expr.definition().orig.length && (fn = expr.scope) instanceof AST_Lambda && fn.uses_arguments && !(fn instanceof AST_Arrow) && prop instanceof AST_Number) {
            for(var index = prop.getValue(), params = new Set(), argnames = fn.argnames, n = 0; n < argnames.length; n++){
                if (!(argnames[n] instanceof AST_SymbolFunarg)) break OPT_ARGUMENTS; // destructuring parameter - bail
                var param = argnames[n].name;
                if (params.has(param)) break OPT_ARGUMENTS; // duplicate parameter - bail
                params.add(param);
            }
            var argname = fn.argnames[index];
            if (argname && compressor.has_directive("use strict")) {
                var def = argname.definition();
                (!compressor.option("reduce_vars") || def.assignments || def.orig.length > 1) && (argname = null);
            } else if (!argname && !compressor.option("keep_fargs") && index < fn.argnames.length + 5) for(; index >= fn.argnames.length;)argname = fn.create_symbol(AST_SymbolFunarg, {
                source: fn,
                scope: fn,
                tentative_name: "argument_" + fn.argnames.length
            }), fn.argnames.push(argname);
            if (argname) {
                var sym = make_node(AST_SymbolRef, self1, argname);
                return sym.reference({}), clear_flag(argname, 0b00000001), sym;
            }
        }
        if (is_lhs(self1, compressor.parent())) return self1;
        if (key !== prop) {
            var sub = self1.flatten_object(property, compressor);
            sub && (expr = self1.expression = sub.expression, prop = self1.property = sub.property);
        }
        if (compressor.option("properties") && compressor.option("side_effects") && prop instanceof AST_Number && expr instanceof AST_Array) {
            var index = prop.getValue(), elements = expr.elements, retValue = elements[index];
            FLATTEN: if (safe_to_flatten(retValue, compressor)) {
                for(var flatten = !0, values = [], i = elements.length; --i > index;){
                    var value = elements[i].drop_side_effect_free(compressor);
                    value && (values.unshift(value), flatten && value.has_side_effects(compressor) && (flatten = !1));
                }
                if (retValue instanceof AST_Expansion) break FLATTEN;
                for(retValue = retValue instanceof AST_Hole ? make_node(AST_Undefined, retValue) : retValue, flatten || values.unshift(retValue); --i >= 0;){
                    var value = elements[i];
                    if (value instanceof AST_Expansion) break FLATTEN;
                    (value = value.drop_side_effect_free(compressor)) ? values.unshift(value) : index--;
                }
                if (flatten) return values.push(retValue), make_sequence(self1, values).optimize(compressor);
                return make_node(AST_Sub, self1, {
                    expression: make_node(AST_Array, expr, {
                        elements: values
                    }),
                    property: make_node(AST_Number, prop, {
                        value: index
                    })
                });
            }
        }
        var ev = self1.evaluate(compressor);
        return ev !== self1 ? (ev = make_node_from_constant(ev, self1).optimize(compressor), best_of(compressor, ev, self1)) : self1;
    }), def_optimize(AST_Chain, function(self1, compressor) {
        if (is_nullish(self1.expression, compressor)) {
            let parent = compressor.parent();
            return(// It's valid to delete a nullish optional chain, but if we optimized
            // this to `delete undefined` then it would appear to be a syntax error
            // when we try to optimize the delete. Thankfully, `delete 0` is fine.
            parent instanceof AST_UnaryPrefix && "delete" === parent.operator ? make_node_from_constant(0, self1) : make_node(AST_Undefined, self1));
        }
        return self1;
    }), AST_Lambda.DEFMETHOD("contains_this", function() {
        return walk(this, (node)=>node instanceof AST_This ? walk_abort : node !== this && node instanceof AST_Scope && !(node instanceof AST_Arrow) || void 0);
    }), def_optimize(AST_Dot, function(self1, compressor) {
        const parent = compressor.parent();
        if (is_lhs(self1, parent)) return self1;
        if (compressor.option("unsafe_proto") && self1.expression instanceof AST_Dot && "prototype" == self1.expression.property) {
            var exp = self1.expression.expression;
            if (is_undeclared_ref(exp)) switch(exp.name){
                case "Array":
                    self1.expression = make_node(AST_Array, self1.expression, {
                        elements: []
                    });
                    break;
                case "Function":
                    self1.expression = make_node(AST_Function, self1.expression, {
                        argnames: [],
                        body: []
                    });
                    break;
                case "Number":
                    self1.expression = make_node(AST_Number, self1.expression, {
                        value: 0
                    });
                    break;
                case "Object":
                    self1.expression = make_node(AST_Object, self1.expression, {
                        properties: []
                    });
                    break;
                case "RegExp":
                    self1.expression = make_node(AST_RegExp, self1.expression, {
                        value: {
                            source: "t",
                            flags: ""
                        }
                    });
                    break;
                case "String":
                    self1.expression = make_node(AST_String, self1.expression, {
                        value: ""
                    });
            }
        }
        if (!(parent instanceof AST_Call) || !has_annotation(parent, _NOINLINE)) {
            const sub = self1.flatten_object(self1.property, compressor);
            if (sub) return sub.optimize(compressor);
        }
        let ev = self1.evaluate(compressor);
        return ev !== self1 ? (ev = make_node_from_constant(ev, self1).optimize(compressor), best_of(compressor, ev, self1)) : self1;
    }), def_optimize(AST_Array, function(self1, compressor) {
        var optimized = literals_in_boolean_context(self1, compressor);
        return optimized !== self1 ? optimized : (inline_array_like_spread(self1.elements), self1);
    }), def_optimize(AST_Object, function(self1, compressor) {
        var optimized = literals_in_boolean_context(self1, compressor);
        return optimized !== self1 ? optimized : (function(props, compressor) {
            for(var i = 0; i < props.length; i++){
                var prop = props[i];
                if (prop instanceof AST_Expansion) {
                    const expr = prop.expression;
                    expr instanceof AST_Object && expr.properties.every((prop)=>prop instanceof AST_ObjectKeyVal) ? (props.splice(i, 1, ...expr.properties), // Step back one, as the property at i is now new.
                    i--) : expr instanceof AST_Constant && !(expr instanceof AST_String) ? (// Unlike array-like spread, in object spread, spreading a
                    // non-iterable value silently does nothing; it is thus safe
                    // to remove. AST_String is the only iterable AST_Constant.
                    props.splice(i, 1), i--) : is_nullish(expr, compressor) && (// Likewise, null and undefined can be silently removed.
                    props.splice(i, 1), i--);
                }
            }
        }(self1.properties, compressor), self1);
    }), def_optimize(AST_RegExp, literals_in_boolean_context), def_optimize(AST_Return, function(self1, compressor) {
        return self1.value && is_undefined(self1.value, compressor) && (self1.value = null), self1;
    }), def_optimize(AST_Arrow, opt_AST_Lambda), def_optimize(AST_Function, function(self1, compressor) {
        return (self1 = opt_AST_Lambda(self1, compressor), !(compressor.option("unsafe_arrows") && compressor.option("ecma") >= 2015) || self1.name || self1.is_generator || self1.uses_arguments || self1.pinned() || walk(self1, (node)=>{
            if (node instanceof AST_This) return walk_abort;
        })) ? self1 : make_node(AST_Arrow, self1, self1).optimize(compressor);
    }), def_optimize(AST_Class, function(self1) {
        // HACK to avoid compress failure.
        // AST_Class is not really an AST_Scope/AST_Block as it lacks a body.
        return self1;
    }), def_optimize(AST_Yield, function(self1, compressor) {
        return self1.expression && !self1.is_star && is_undefined(self1.expression, compressor) && (self1.expression = null), self1;
    }), def_optimize(AST_TemplateString, function(self1, compressor) {
        if (!compressor.option("evaluate") || compressor.parent() instanceof AST_PrefixedTemplateString) return self1;
        for(var segments = [], i = 0; i < self1.segments.length; i++){
            var segment = self1.segments[i];
            if (segment instanceof AST_Node) {
                var result = segment.evaluate(compressor);
                // Evaluate to constant value
                // Constant value shorter than ${segment}
                if (result !== segment && (result + "").length <= segment.size() + 3) {
                    // There should always be a previous and next segment if segment is a node
                    segments[segments.length - 1].value = segments[segments.length - 1].value + result + self1.segments[++i].value;
                    continue;
                }
                // `before ${`innerBefore ${any} innerAfter`} after` => `before innerBefore ${any} innerAfter after`
                // TODO:
                // `before ${'test' + foo} after` => `before innerBefore ${any} innerAfter after`
                // `before ${foo + 'test} after` => `before innerBefore ${any} innerAfter after`
                if (segment instanceof AST_TemplateString) {
                    var inners = segment.segments;
                    segments[segments.length - 1].value += inners[0].value;
                    for(var j = 1; j < inners.length; j++)segment = inners[j], segments.push(segment);
                    continue;
                }
            }
            segments.push(segment);
        }
        // `foo` => "foo"
        if (self1.segments = segments, 1 == segments.length) return make_node(AST_String, self1, segments[0]);
        if (3 === segments.length && segments[1] instanceof AST_Node && (segments[1].is_string(compressor) || segments[1].is_number(compressor) || is_nullish(segments[1], compressor) || compressor.option("unsafe"))) {
            // `foo${bar}` => "foo" + bar
            if ("" === segments[2].value) return make_node(AST_Binary, self1, {
                operator: "+",
                left: make_node(AST_String, self1, {
                    value: segments[0].value
                }),
                right: segments[1]
            });
            // `${bar}baz` => bar + "baz"
            if ("" === segments[0].value) return make_node(AST_Binary, self1, {
                operator: "+",
                left: segments[1],
                right: make_node(AST_String, self1, {
                    value: segments[2].value
                })
            });
        }
        return self1;
    }), def_optimize(AST_PrefixedTemplateString, function(self1) {
        return self1;
    }), def_optimize(AST_ObjectProperty, lift_key), def_optimize(AST_ConciseMethod, function(self1, compressor) {
        // p(){return x;} ---> p:()=>x
        if (lift_key(self1, compressor), compressor.option("arrows") && compressor.parent() instanceof AST_Object && !self1.is_generator && !self1.value.uses_arguments && !self1.value.pinned() && 1 == self1.value.body.length && self1.value.body[0] instanceof AST_Return && self1.value.body[0].value && !self1.value.contains_this()) {
            var arrow = make_node(AST_Arrow, self1.value, self1.value);
            return arrow.async = self1.async, arrow.is_generator = self1.is_generator, make_node(AST_ObjectKeyVal, self1, {
                key: self1.key instanceof AST_SymbolMethod ? self1.key.name : self1.key,
                value: arrow,
                quote: self1.quote
            });
        }
        return self1;
    }), def_optimize(AST_ObjectKeyVal, function(self1, compressor) {
        lift_key(self1, compressor);
        // p:function(){} ---> p(){}
        // p:function*(){} ---> *p(){}
        // p:async function(){} ---> async p(){}
        // p:()=>{} ---> p(){}
        // p:async()=>{} ---> async p(){}
        var unsafe_methods = compressor.option("unsafe_methods");
        if (unsafe_methods && compressor.option("ecma") >= 2015 && (!(unsafe_methods instanceof RegExp) || unsafe_methods.test(self1.key + ""))) {
            var key = self1.key, value = self1.value;
            if ((value instanceof AST_Arrow && Array.isArray(value.body) && !value.contains_this() || value instanceof AST_Function) && !value.name) return make_node(AST_ConciseMethod, self1, {
                async: value.async,
                is_generator: value.is_generator,
                key: key instanceof AST_Node ? key : make_node(AST_SymbolMethod, self1, {
                    name: key
                }),
                value: make_node(AST_Accessor, value, value),
                quote: self1.quote
            });
        }
        return self1;
    }), def_optimize(AST_Destructuring, function(self1, compressor) {
        if (!0 == compressor.option("pure_getters") && compressor.option("unused") && !self1.is_array && Array.isArray(self1.names) && !function(compressor) {
            for(var ancestors = [
                /^VarDef$/,
                /^(Const|Let|Var)$/,
                /^Export$/
            ], a = 0, p = 0, len = ancestors.length; a < len; p++){
                var parent = compressor.parent(p);
                if (!parent) return !1;
                if (0 !== a || "Destructuring" != parent.TYPE) {
                    if (!ancestors[a].test(parent.TYPE)) return !1;
                    a++;
                }
            }
            return !0;
        }(compressor) && !(self1.names[self1.names.length - 1] instanceof AST_Expansion)) {
            for(var keep = [], i = 0; i < self1.names.length; i++){
                var def, elem = self1.names[i];
                elem instanceof AST_ObjectKeyVal && "string" == typeof elem.key && elem.value instanceof AST_SymbolDeclaration && !((def = elem.value.definition()).references.length || def.global && (!compressor.toplevel.vars || compressor.top_retain && compressor.top_retain(def))) || keep.push(elem);
            }
            keep.length != self1.names.length && (self1.names = keep);
        }
        return self1;
    });
    var domprops = [
        "$&",
        "$'",
        "$*",
        "$+",
        "$1",
        "$2",
        "$3",
        "$4",
        "$5",
        "$6",
        "$7",
        "$8",
        "$9",
        "$_",
        "$`",
        "$input",
        "-moz-animation",
        "-moz-animation-delay",
        "-moz-animation-direction",
        "-moz-animation-duration",
        "-moz-animation-fill-mode",
        "-moz-animation-iteration-count",
        "-moz-animation-name",
        "-moz-animation-play-state",
        "-moz-animation-timing-function",
        "-moz-appearance",
        "-moz-backface-visibility",
        "-moz-border-end",
        "-moz-border-end-color",
        "-moz-border-end-style",
        "-moz-border-end-width",
        "-moz-border-image",
        "-moz-border-start",
        "-moz-border-start-color",
        "-moz-border-start-style",
        "-moz-border-start-width",
        "-moz-box-align",
        "-moz-box-direction",
        "-moz-box-flex",
        "-moz-box-ordinal-group",
        "-moz-box-orient",
        "-moz-box-pack",
        "-moz-box-sizing",
        "-moz-float-edge",
        "-moz-font-feature-settings",
        "-moz-font-language-override",
        "-moz-force-broken-image-icon",
        "-moz-hyphens",
        "-moz-image-region",
        "-moz-margin-end",
        "-moz-margin-start",
        "-moz-orient",
        "-moz-osx-font-smoothing",
        "-moz-outline-radius",
        "-moz-outline-radius-bottomleft",
        "-moz-outline-radius-bottomright",
        "-moz-outline-radius-topleft",
        "-moz-outline-radius-topright",
        "-moz-padding-end",
        "-moz-padding-start",
        "-moz-perspective",
        "-moz-perspective-origin",
        "-moz-tab-size",
        "-moz-text-size-adjust",
        "-moz-transform",
        "-moz-transform-origin",
        "-moz-transform-style",
        "-moz-transition",
        "-moz-transition-delay",
        "-moz-transition-duration",
        "-moz-transition-property",
        "-moz-transition-timing-function",
        "-moz-user-focus",
        "-moz-user-input",
        "-moz-user-modify",
        "-moz-user-select",
        "-moz-window-dragging",
        "-webkit-align-content",
        "-webkit-align-items",
        "-webkit-align-self",
        "-webkit-animation",
        "-webkit-animation-delay",
        "-webkit-animation-direction",
        "-webkit-animation-duration",
        "-webkit-animation-fill-mode",
        "-webkit-animation-iteration-count",
        "-webkit-animation-name",
        "-webkit-animation-play-state",
        "-webkit-animation-timing-function",
        "-webkit-appearance",
        "-webkit-backface-visibility",
        "-webkit-background-clip",
        "-webkit-background-origin",
        "-webkit-background-size",
        "-webkit-border-bottom-left-radius",
        "-webkit-border-bottom-right-radius",
        "-webkit-border-image",
        "-webkit-border-radius",
        "-webkit-border-top-left-radius",
        "-webkit-border-top-right-radius",
        "-webkit-box-align",
        "-webkit-box-direction",
        "-webkit-box-flex",
        "-webkit-box-ordinal-group",
        "-webkit-box-orient",
        "-webkit-box-pack",
        "-webkit-box-shadow",
        "-webkit-box-sizing",
        "-webkit-filter",
        "-webkit-flex",
        "-webkit-flex-basis",
        "-webkit-flex-direction",
        "-webkit-flex-flow",
        "-webkit-flex-grow",
        "-webkit-flex-shrink",
        "-webkit-flex-wrap",
        "-webkit-justify-content",
        "-webkit-line-clamp",
        "-webkit-mask",
        "-webkit-mask-clip",
        "-webkit-mask-composite",
        "-webkit-mask-image",
        "-webkit-mask-origin",
        "-webkit-mask-position",
        "-webkit-mask-position-x",
        "-webkit-mask-position-y",
        "-webkit-mask-repeat",
        "-webkit-mask-size",
        "-webkit-order",
        "-webkit-perspective",
        "-webkit-perspective-origin",
        "-webkit-text-fill-color",
        "-webkit-text-size-adjust",
        "-webkit-text-stroke",
        "-webkit-text-stroke-color",
        "-webkit-text-stroke-width",
        "-webkit-transform",
        "-webkit-transform-origin",
        "-webkit-transform-style",
        "-webkit-transition",
        "-webkit-transition-delay",
        "-webkit-transition-duration",
        "-webkit-transition-property",
        "-webkit-transition-timing-function",
        "-webkit-user-select",
        "0",
        "1",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "2",
        "20",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "@@iterator",
        "ABORT_ERR",
        "ACTIVE",
        "ACTIVE_ATTRIBUTES",
        "ACTIVE_TEXTURE",
        "ACTIVE_UNIFORMS",
        "ACTIVE_UNIFORM_BLOCKS",
        "ADDITION",
        "ALIASED_LINE_WIDTH_RANGE",
        "ALIASED_POINT_SIZE_RANGE",
        "ALLOW_KEYBOARD_INPUT",
        "ALLPASS",
        "ALPHA",
        "ALPHA_BITS",
        "ALREADY_SIGNALED",
        "ALT_MASK",
        "ALWAYS",
        "ANY_SAMPLES_PASSED",
        "ANY_SAMPLES_PASSED_CONSERVATIVE",
        "ANY_TYPE",
        "ANY_UNORDERED_NODE_TYPE",
        "ARRAY_BUFFER",
        "ARRAY_BUFFER_BINDING",
        "ATTACHED_SHADERS",
        "ATTRIBUTE_NODE",
        "AT_TARGET",
        "AbortController",
        "AbortSignal",
        "AbsoluteOrientationSensor",
        "AbstractRange",
        "Accelerometer",
        "AddSearchProvider",
        "AggregateError",
        "AnalyserNode",
        "Animation",
        "AnimationEffect",
        "AnimationEvent",
        "AnimationPlaybackEvent",
        "AnimationTimeline",
        "AnonXMLHttpRequest",
        "Any",
        "ApplicationCache",
        "ApplicationCacheErrorEvent",
        "Array",
        "ArrayBuffer",
        "ArrayType",
        "Atomics",
        "Attr",
        "Audio",
        "AudioBuffer",
        "AudioBufferSourceNode",
        "AudioContext",
        "AudioDestinationNode",
        "AudioListener",
        "AudioNode",
        "AudioParam",
        "AudioParamMap",
        "AudioProcessingEvent",
        "AudioScheduledSourceNode",
        "AudioStreamTrack",
        "AudioWorklet",
        "AudioWorkletNode",
        "AuthenticatorAssertionResponse",
        "AuthenticatorAttestationResponse",
        "AuthenticatorResponse",
        "AutocompleteErrorEvent",
        "BACK",
        "BAD_BOUNDARYPOINTS_ERR",
        "BAD_REQUEST",
        "BANDPASS",
        "BLEND",
        "BLEND_COLOR",
        "BLEND_DST_ALPHA",
        "BLEND_DST_RGB",
        "BLEND_EQUATION",
        "BLEND_EQUATION_ALPHA",
        "BLEND_EQUATION_RGB",
        "BLEND_SRC_ALPHA",
        "BLEND_SRC_RGB",
        "BLUE_BITS",
        "BLUR",
        "BOOL",
        "BOOLEAN_TYPE",
        "BOOL_VEC2",
        "BOOL_VEC3",
        "BOOL_VEC4",
        "BOTH",
        "BROWSER_DEFAULT_WEBGL",
        "BUBBLING_PHASE",
        "BUFFER_SIZE",
        "BUFFER_USAGE",
        "BYTE",
        "BYTES_PER_ELEMENT",
        "BackgroundFetchManager",
        "BackgroundFetchRecord",
        "BackgroundFetchRegistration",
        "BarProp",
        "BarcodeDetector",
        "BaseAudioContext",
        "BaseHref",
        "BatteryManager",
        "BeforeInstallPromptEvent",
        "BeforeLoadEvent",
        "BeforeUnloadEvent",
        "BigInt",
        "BigInt64Array",
        "BigUint64Array",
        "BiquadFilterNode",
        "Blob",
        "BlobEvent",
        "Bluetooth",
        "BluetoothCharacteristicProperties",
        "BluetoothDevice",
        "BluetoothRemoteGATTCharacteristic",
        "BluetoothRemoteGATTDescriptor",
        "BluetoothRemoteGATTServer",
        "BluetoothRemoteGATTService",
        "BluetoothUUID",
        "Boolean",
        "BroadcastChannel",
        "ByteLengthQueuingStrategy",
        "CAPTURING_PHASE",
        "CCW",
        "CDATASection",
        "CDATA_SECTION_NODE",
        "CHANGE",
        "CHARSET_RULE",
        "CHECKING",
        "CLAMP_TO_EDGE",
        "CLICK",
        "CLOSED",
        "CLOSING",
        "COLOR",
        "COLOR_ATTACHMENT0",
        "COLOR_ATTACHMENT1",
        "COLOR_ATTACHMENT10",
        "COLOR_ATTACHMENT11",
        "COLOR_ATTACHMENT12",
        "COLOR_ATTACHMENT13",
        "COLOR_ATTACHMENT14",
        "COLOR_ATTACHMENT15",
        "COLOR_ATTACHMENT2",
        "COLOR_ATTACHMENT3",
        "COLOR_ATTACHMENT4",
        "COLOR_ATTACHMENT5",
        "COLOR_ATTACHMENT6",
        "COLOR_ATTACHMENT7",
        "COLOR_ATTACHMENT8",
        "COLOR_ATTACHMENT9",
        "COLOR_BUFFER_BIT",
        "COLOR_CLEAR_VALUE",
        "COLOR_WRITEMASK",
        "COMMENT_NODE",
        "COMPARE_REF_TO_TEXTURE",
        "COMPILE_STATUS",
        "COMPRESSED_RGBA_S3TC_DXT1_EXT",
        "COMPRESSED_RGBA_S3TC_DXT3_EXT",
        "COMPRESSED_RGBA_S3TC_DXT5_EXT",
        "COMPRESSED_RGB_S3TC_DXT1_EXT",
        "COMPRESSED_TEXTURE_FORMATS",
        "CONDITION_SATISFIED",
        "CONFIGURATION_UNSUPPORTED",
        "CONNECTING",
        "CONSTANT_ALPHA",
        "CONSTANT_COLOR",
        "CONSTRAINT_ERR",
        "CONTEXT_LOST_WEBGL",
        "CONTROL_MASK",
        "COPY_READ_BUFFER",
        "COPY_READ_BUFFER_BINDING",
        "COPY_WRITE_BUFFER",
        "COPY_WRITE_BUFFER_BINDING",
        "COUNTER_STYLE_RULE",
        "CSS",
        "CSS2Properties",
        "CSSAnimation",
        "CSSCharsetRule",
        "CSSConditionRule",
        "CSSCounterStyleRule",
        "CSSFontFaceRule",
        "CSSFontFeatureValuesRule",
        "CSSGroupingRule",
        "CSSImageValue",
        "CSSImportRule",
        "CSSKeyframeRule",
        "CSSKeyframesRule",
        "CSSKeywordValue",
        "CSSMathInvert",
        "CSSMathMax",
        "CSSMathMin",
        "CSSMathNegate",
        "CSSMathProduct",
        "CSSMathSum",
        "CSSMathValue",
        "CSSMatrixComponent",
        "CSSMediaRule",
        "CSSMozDocumentRule",
        "CSSNameSpaceRule",
        "CSSNamespaceRule",
        "CSSNumericArray",
        "CSSNumericValue",
        "CSSPageRule",
        "CSSPerspective",
        "CSSPositionValue",
        "CSSPrimitiveValue",
        "CSSRotate",
        "CSSRule",
        "CSSRuleList",
        "CSSScale",
        "CSSSkew",
        "CSSSkewX",
        "CSSSkewY",
        "CSSStyleDeclaration",
        "CSSStyleRule",
        "CSSStyleSheet",
        "CSSStyleValue",
        "CSSSupportsRule",
        "CSSTransformComponent",
        "CSSTransformValue",
        "CSSTransition",
        "CSSTranslate",
        "CSSUnitValue",
        "CSSUnknownRule",
        "CSSUnparsedValue",
        "CSSValue",
        "CSSValueList",
        "CSSVariableReferenceValue",
        "CSSVariablesDeclaration",
        "CSSVariablesRule",
        "CSSViewportRule",
        "CSS_ATTR",
        "CSS_CM",
        "CSS_COUNTER",
        "CSS_CUSTOM",
        "CSS_DEG",
        "CSS_DIMENSION",
        "CSS_EMS",
        "CSS_EXS",
        "CSS_FILTER_BLUR",
        "CSS_FILTER_BRIGHTNESS",
        "CSS_FILTER_CONTRAST",
        "CSS_FILTER_CUSTOM",
        "CSS_FILTER_DROP_SHADOW",
        "CSS_FILTER_GRAYSCALE",
        "CSS_FILTER_HUE_ROTATE",
        "CSS_FILTER_INVERT",
        "CSS_FILTER_OPACITY",
        "CSS_FILTER_REFERENCE",
        "CSS_FILTER_SATURATE",
        "CSS_FILTER_SEPIA",
        "CSS_GRAD",
        "CSS_HZ",
        "CSS_IDENT",
        "CSS_IN",
        "CSS_INHERIT",
        "CSS_KHZ",
        "CSS_MATRIX",
        "CSS_MATRIX3D",
        "CSS_MM",
        "CSS_MS",
        "CSS_NUMBER",
        "CSS_PC",
        "CSS_PERCENTAGE",
        "CSS_PERSPECTIVE",
        "CSS_PRIMITIVE_VALUE",
        "CSS_PT",
        "CSS_PX",
        "CSS_RAD",
        "CSS_RECT",
        "CSS_RGBCOLOR",
        "CSS_ROTATE",
        "CSS_ROTATE3D",
        "CSS_ROTATEX",
        "CSS_ROTATEY",
        "CSS_ROTATEZ",
        "CSS_S",
        "CSS_SCALE",
        "CSS_SCALE3D",
        "CSS_SCALEX",
        "CSS_SCALEY",
        "CSS_SCALEZ",
        "CSS_SKEW",
        "CSS_SKEWX",
        "CSS_SKEWY",
        "CSS_STRING",
        "CSS_TRANSLATE",
        "CSS_TRANSLATE3D",
        "CSS_TRANSLATEX",
        "CSS_TRANSLATEY",
        "CSS_TRANSLATEZ",
        "CSS_UNKNOWN",
        "CSS_URI",
        "CSS_VALUE_LIST",
        "CSS_VH",
        "CSS_VMAX",
        "CSS_VMIN",
        "CSS_VW",
        "CULL_FACE",
        "CULL_FACE_MODE",
        "CURRENT_PROGRAM",
        "CURRENT_QUERY",
        "CURRENT_VERTEX_ATTRIB",
        "CUSTOM",
        "CW",
        "Cache",
        "CacheStorage",
        "CanvasCaptureMediaStream",
        "CanvasCaptureMediaStreamTrack",
        "CanvasGradient",
        "CanvasPattern",
        "CanvasRenderingContext2D",
        "CaretPosition",
        "ChannelMergerNode",
        "ChannelSplitterNode",
        "CharacterData",
        "ClientRect",
        "ClientRectList",
        "Clipboard",
        "ClipboardEvent",
        "ClipboardItem",
        "CloseEvent",
        "Collator",
        "CommandEvent",
        "Comment",
        "CompileError",
        "CompositionEvent",
        "CompressionStream",
        "Console",
        "ConstantSourceNode",
        "Controllers",
        "ConvolverNode",
        "CountQueuingStrategy",
        "Counter",
        "Credential",
        "CredentialsContainer",
        "Crypto",
        "CryptoKey",
        "CustomElementRegistry",
        "CustomEvent",
        "DATABASE_ERR",
        "DATA_CLONE_ERR",
        "DATA_ERR",
        "DBLCLICK",
        "DECR",
        "DECR_WRAP",
        "DELETE_STATUS",
        "DEPTH",
        "DEPTH24_STENCIL8",
        "DEPTH32F_STENCIL8",
        "DEPTH_ATTACHMENT",
        "DEPTH_BITS",
        "DEPTH_BUFFER_BIT",
        "DEPTH_CLEAR_VALUE",
        "DEPTH_COMPONENT",
        "DEPTH_COMPONENT16",
        "DEPTH_COMPONENT24",
        "DEPTH_COMPONENT32F",
        "DEPTH_FUNC",
        "DEPTH_RANGE",
        "DEPTH_STENCIL",
        "DEPTH_STENCIL_ATTACHMENT",
        "DEPTH_TEST",
        "DEPTH_WRITEMASK",
        "DEVICE_INELIGIBLE",
        "DIRECTION_DOWN",
        "DIRECTION_LEFT",
        "DIRECTION_RIGHT",
        "DIRECTION_UP",
        "DISABLED",
        "DISPATCH_REQUEST_ERR",
        "DITHER",
        "DOCUMENT_FRAGMENT_NODE",
        "DOCUMENT_NODE",
        "DOCUMENT_POSITION_CONTAINED_BY",
        "DOCUMENT_POSITION_CONTAINS",
        "DOCUMENT_POSITION_DISCONNECTED",
        "DOCUMENT_POSITION_FOLLOWING",
        "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",
        "DOCUMENT_POSITION_PRECEDING",
        "DOCUMENT_TYPE_NODE",
        "DOMCursor",
        "DOMError",
        "DOMException",
        "DOMImplementation",
        "DOMImplementationLS",
        "DOMMatrix",
        "DOMMatrixReadOnly",
        "DOMParser",
        "DOMPoint",
        "DOMPointReadOnly",
        "DOMQuad",
        "DOMRect",
        "DOMRectList",
        "DOMRectReadOnly",
        "DOMRequest",
        "DOMSTRING_SIZE_ERR",
        "DOMSettableTokenList",
        "DOMStringList",
        "DOMStringMap",
        "DOMTokenList",
        "DOMTransactionEvent",
        "DOM_DELTA_LINE",
        "DOM_DELTA_PAGE",
        "DOM_DELTA_PIXEL",
        "DOM_INPUT_METHOD_DROP",
        "DOM_INPUT_METHOD_HANDWRITING",
        "DOM_INPUT_METHOD_IME",
        "DOM_INPUT_METHOD_KEYBOARD",
        "DOM_INPUT_METHOD_MULTIMODAL",
        "DOM_INPUT_METHOD_OPTION",
        "DOM_INPUT_METHOD_PASTE",
        "DOM_INPUT_METHOD_SCRIPT",
        "DOM_INPUT_METHOD_UNKNOWN",
        "DOM_INPUT_METHOD_VOICE",
        "DOM_KEY_LOCATION_JOYSTICK",
        "DOM_KEY_LOCATION_LEFT",
        "DOM_KEY_LOCATION_MOBILE",
        "DOM_KEY_LOCATION_NUMPAD",
        "DOM_KEY_LOCATION_RIGHT",
        "DOM_KEY_LOCATION_STANDARD",
        "DOM_VK_0",
        "DOM_VK_1",
        "DOM_VK_2",
        "DOM_VK_3",
        "DOM_VK_4",
        "DOM_VK_5",
        "DOM_VK_6",
        "DOM_VK_7",
        "DOM_VK_8",
        "DOM_VK_9",
        "DOM_VK_A",
        "DOM_VK_ACCEPT",
        "DOM_VK_ADD",
        "DOM_VK_ALT",
        "DOM_VK_ALTGR",
        "DOM_VK_AMPERSAND",
        "DOM_VK_ASTERISK",
        "DOM_VK_AT",
        "DOM_VK_ATTN",
        "DOM_VK_B",
        "DOM_VK_BACKSPACE",
        "DOM_VK_BACK_QUOTE",
        "DOM_VK_BACK_SLASH",
        "DOM_VK_BACK_SPACE",
        "DOM_VK_C",
        "DOM_VK_CANCEL",
        "DOM_VK_CAPS_LOCK",
        "DOM_VK_CIRCUMFLEX",
        "DOM_VK_CLEAR",
        "DOM_VK_CLOSE_BRACKET",
        "DOM_VK_CLOSE_CURLY_BRACKET",
        "DOM_VK_CLOSE_PAREN",
        "DOM_VK_COLON",
        "DOM_VK_COMMA",
        "DOM_VK_CONTEXT_MENU",
        "DOM_VK_CONTROL",
        "DOM_VK_CONVERT",
        "DOM_VK_CRSEL",
        "DOM_VK_CTRL",
        "DOM_VK_D",
        "DOM_VK_DECIMAL",
        "DOM_VK_DELETE",
        "DOM_VK_DIVIDE",
        "DOM_VK_DOLLAR",
        "DOM_VK_DOUBLE_QUOTE",
        "DOM_VK_DOWN",
        "DOM_VK_E",
        "DOM_VK_EISU",
        "DOM_VK_END",
        "DOM_VK_ENTER",
        "DOM_VK_EQUALS",
        "DOM_VK_EREOF",
        "DOM_VK_ESCAPE",
        "DOM_VK_EXCLAMATION",
        "DOM_VK_EXECUTE",
        "DOM_VK_EXSEL",
        "DOM_VK_F",
        "DOM_VK_F1",
        "DOM_VK_F10",
        "DOM_VK_F11",
        "DOM_VK_F12",
        "DOM_VK_F13",
        "DOM_VK_F14",
        "DOM_VK_F15",
        "DOM_VK_F16",
        "DOM_VK_F17",
        "DOM_VK_F18",
        "DOM_VK_F19",
        "DOM_VK_F2",
        "DOM_VK_F20",
        "DOM_VK_F21",
        "DOM_VK_F22",
        "DOM_VK_F23",
        "DOM_VK_F24",
        "DOM_VK_F25",
        "DOM_VK_F26",
        "DOM_VK_F27",
        "DOM_VK_F28",
        "DOM_VK_F29",
        "DOM_VK_F3",
        "DOM_VK_F30",
        "DOM_VK_F31",
        "DOM_VK_F32",
        "DOM_VK_F33",
        "DOM_VK_F34",
        "DOM_VK_F35",
        "DOM_VK_F36",
        "DOM_VK_F4",
        "DOM_VK_F5",
        "DOM_VK_F6",
        "DOM_VK_F7",
        "DOM_VK_F8",
        "DOM_VK_F9",
        "DOM_VK_FINAL",
        "DOM_VK_FRONT",
        "DOM_VK_G",
        "DOM_VK_GREATER_THAN",
        "DOM_VK_H",
        "DOM_VK_HANGUL",
        "DOM_VK_HANJA",
        "DOM_VK_HASH",
        "DOM_VK_HELP",
        "DOM_VK_HK_TOGGLE",
        "DOM_VK_HOME",
        "DOM_VK_HYPHEN_MINUS",
        "DOM_VK_I",
        "DOM_VK_INSERT",
        "DOM_VK_J",
        "DOM_VK_JUNJA",
        "DOM_VK_K",
        "DOM_VK_KANA",
        "DOM_VK_KANJI",
        "DOM_VK_L",
        "DOM_VK_LEFT",
        "DOM_VK_LEFT_TAB",
        "DOM_VK_LESS_THAN",
        "DOM_VK_M",
        "DOM_VK_META",
        "DOM_VK_MODECHANGE",
        "DOM_VK_MULTIPLY",
        "DOM_VK_N",
        "DOM_VK_NONCONVERT",
        "DOM_VK_NUMPAD0",
        "DOM_VK_NUMPAD1",
        "DOM_VK_NUMPAD2",
        "DOM_VK_NUMPAD3",
        "DOM_VK_NUMPAD4",
        "DOM_VK_NUMPAD5",
        "DOM_VK_NUMPAD6",
        "DOM_VK_NUMPAD7",
        "DOM_VK_NUMPAD8",
        "DOM_VK_NUMPAD9",
        "DOM_VK_NUM_LOCK",
        "DOM_VK_O",
        "DOM_VK_OEM_1",
        "DOM_VK_OEM_102",
        "DOM_VK_OEM_2",
        "DOM_VK_OEM_3",
        "DOM_VK_OEM_4",
        "DOM_VK_OEM_5",
        "DOM_VK_OEM_6",
        "DOM_VK_OEM_7",
        "DOM_VK_OEM_8",
        "DOM_VK_OEM_COMMA",
        "DOM_VK_OEM_MINUS",
        "DOM_VK_OEM_PERIOD",
        "DOM_VK_OEM_PLUS",
        "DOM_VK_OPEN_BRACKET",
        "DOM_VK_OPEN_CURLY_BRACKET",
        "DOM_VK_OPEN_PAREN",
        "DOM_VK_P",
        "DOM_VK_PA1",
        "DOM_VK_PAGEDOWN",
        "DOM_VK_PAGEUP",
        "DOM_VK_PAGE_DOWN",
        "DOM_VK_PAGE_UP",
        "DOM_VK_PAUSE",
        "DOM_VK_PERCENT",
        "DOM_VK_PERIOD",
        "DOM_VK_PIPE",
        "DOM_VK_PLAY",
        "DOM_VK_PLUS",
        "DOM_VK_PRINT",
        "DOM_VK_PRINTSCREEN",
        "DOM_VK_PROCESSKEY",
        "DOM_VK_PROPERITES",
        "DOM_VK_Q",
        "DOM_VK_QUESTION_MARK",
        "DOM_VK_QUOTE",
        "DOM_VK_R",
        "DOM_VK_REDO",
        "DOM_VK_RETURN",
        "DOM_VK_RIGHT",
        "DOM_VK_S",
        "DOM_VK_SCROLL_LOCK",
        "DOM_VK_SELECT",
        "DOM_VK_SEMICOLON",
        "DOM_VK_SEPARATOR",
        "DOM_VK_SHIFT",
        "DOM_VK_SLASH",
        "DOM_VK_SLEEP",
        "DOM_VK_SPACE",
        "DOM_VK_SUBTRACT",
        "DOM_VK_T",
        "DOM_VK_TAB",
        "DOM_VK_TILDE",
        "DOM_VK_U",
        "DOM_VK_UNDERSCORE",
        "DOM_VK_UNDO",
        "DOM_VK_UNICODE",
        "DOM_VK_UP",
        "DOM_VK_V",
        "DOM_VK_VOLUME_DOWN",
        "DOM_VK_VOLUME_MUTE",
        "DOM_VK_VOLUME_UP",
        "DOM_VK_W",
        "DOM_VK_WIN",
        "DOM_VK_WINDOW",
        "DOM_VK_WIN_ICO_00",
        "DOM_VK_WIN_ICO_CLEAR",
        "DOM_VK_WIN_ICO_HELP",
        "DOM_VK_WIN_OEM_ATTN",
        "DOM_VK_WIN_OEM_AUTO",
        "DOM_VK_WIN_OEM_BACKTAB",
        "DOM_VK_WIN_OEM_CLEAR",
        "DOM_VK_WIN_OEM_COPY",
        "DOM_VK_WIN_OEM_CUSEL",
        "DOM_VK_WIN_OEM_ENLW",
        "DOM_VK_WIN_OEM_FINISH",
        "DOM_VK_WIN_OEM_FJ_JISHO",
        "DOM_VK_WIN_OEM_FJ_LOYA",
        "DOM_VK_WIN_OEM_FJ_MASSHOU",
        "DOM_VK_WIN_OEM_FJ_ROYA",
        "DOM_VK_WIN_OEM_FJ_TOUROKU",
        "DOM_VK_WIN_OEM_JUMP",
        "DOM_VK_WIN_OEM_PA1",
        "DOM_VK_WIN_OEM_PA2",
        "DOM_VK_WIN_OEM_PA3",
        "DOM_VK_WIN_OEM_RESET",
        "DOM_VK_WIN_OEM_WSCTRL",
        "DOM_VK_X",
        "DOM_VK_XF86XK_ADD_FAVORITE",
        "DOM_VK_XF86XK_APPLICATION_LEFT",
        "DOM_VK_XF86XK_APPLICATION_RIGHT",
        "DOM_VK_XF86XK_AUDIO_CYCLE_TRACK",
        "DOM_VK_XF86XK_AUDIO_FORWARD",
        "DOM_VK_XF86XK_AUDIO_LOWER_VOLUME",
        "DOM_VK_XF86XK_AUDIO_MEDIA",
        "DOM_VK_XF86XK_AUDIO_MUTE",
        "DOM_VK_XF86XK_AUDIO_NEXT",
        "DOM_VK_XF86XK_AUDIO_PAUSE",
        "DOM_VK_XF86XK_AUDIO_PLAY",
        "DOM_VK_XF86XK_AUDIO_PREV",
        "DOM_VK_XF86XK_AUDIO_RAISE_VOLUME",
        "DOM_VK_XF86XK_AUDIO_RANDOM_PLAY",
        "DOM_VK_XF86XK_AUDIO_RECORD",
        "DOM_VK_XF86XK_AUDIO_REPEAT",
        "DOM_VK_XF86XK_AUDIO_REWIND",
        "DOM_VK_XF86XK_AUDIO_STOP",
        "DOM_VK_XF86XK_AWAY",
        "DOM_VK_XF86XK_BACK",
        "DOM_VK_XF86XK_BACK_FORWARD",
        "DOM_VK_XF86XK_BATTERY",
        "DOM_VK_XF86XK_BLUE",
        "DOM_VK_XF86XK_BLUETOOTH",
        "DOM_VK_XF86XK_BOOK",
        "DOM_VK_XF86XK_BRIGHTNESS_ADJUST",
        "DOM_VK_XF86XK_CALCULATOR",
        "DOM_VK_XF86XK_CALENDAR",
        "DOM_VK_XF86XK_CD",
        "DOM_VK_XF86XK_CLOSE",
        "DOM_VK_XF86XK_COMMUNITY",
        "DOM_VK_XF86XK_CONTRAST_ADJUST",
        "DOM_VK_XF86XK_COPY",
        "DOM_VK_XF86XK_CUT",
        "DOM_VK_XF86XK_CYCLE_ANGLE",
        "DOM_VK_XF86XK_DISPLAY",
        "DOM_VK_XF86XK_DOCUMENTS",
        "DOM_VK_XF86XK_DOS",
        "DOM_VK_XF86XK_EJECT",
        "DOM_VK_XF86XK_EXCEL",
        "DOM_VK_XF86XK_EXPLORER",
        "DOM_VK_XF86XK_FAVORITES",
        "DOM_VK_XF86XK_FINANCE",
        "DOM_VK_XF86XK_FORWARD",
        "DOM_VK_XF86XK_FRAME_BACK",
        "DOM_VK_XF86XK_FRAME_FORWARD",
        "DOM_VK_XF86XK_GAME",
        "DOM_VK_XF86XK_GO",
        "DOM_VK_XF86XK_GREEN",
        "DOM_VK_XF86XK_HIBERNATE",
        "DOM_VK_XF86XK_HISTORY",
        "DOM_VK_XF86XK_HOME_PAGE",
        "DOM_VK_XF86XK_HOT_LINKS",
        "DOM_VK_XF86XK_I_TOUCH",
        "DOM_VK_XF86XK_KBD_BRIGHTNESS_DOWN",
        "DOM_VK_XF86XK_KBD_BRIGHTNESS_UP",
        "DOM_VK_XF86XK_KBD_LIGHT_ON_OFF",
        "DOM_VK_XF86XK_LAUNCH0",
        "DOM_VK_XF86XK_LAUNCH1",
        "DOM_VK_XF86XK_LAUNCH2",
        "DOM_VK_XF86XK_LAUNCH3",
        "DOM_VK_XF86XK_LAUNCH4",
        "DOM_VK_XF86XK_LAUNCH5",
        "DOM_VK_XF86XK_LAUNCH6",
        "DOM_VK_XF86XK_LAUNCH7",
        "DOM_VK_XF86XK_LAUNCH8",
        "DOM_VK_XF86XK_LAUNCH9",
        "DOM_VK_XF86XK_LAUNCH_A",
        "DOM_VK_XF86XK_LAUNCH_B",
        "DOM_VK_XF86XK_LAUNCH_C",
        "DOM_VK_XF86XK_LAUNCH_D",
        "DOM_VK_XF86XK_LAUNCH_E",
        "DOM_VK_XF86XK_LAUNCH_F",
        "DOM_VK_XF86XK_LIGHT_BULB",
        "DOM_VK_XF86XK_LOG_OFF",
        "DOM_VK_XF86XK_MAIL",
        "DOM_VK_XF86XK_MAIL_FORWARD",
        "DOM_VK_XF86XK_MARKET",
        "DOM_VK_XF86XK_MEETING",
        "DOM_VK_XF86XK_MEMO",
        "DOM_VK_XF86XK_MENU_KB",
        "DOM_VK_XF86XK_MENU_PB",
        "DOM_VK_XF86XK_MESSENGER",
        "DOM_VK_XF86XK_MON_BRIGHTNESS_DOWN",
        "DOM_VK_XF86XK_MON_BRIGHTNESS_UP",
        "DOM_VK_XF86XK_MUSIC",
        "DOM_VK_XF86XK_MY_COMPUTER",
        "DOM_VK_XF86XK_MY_SITES",
        "DOM_VK_XF86XK_NEW",
        "DOM_VK_XF86XK_NEWS",
        "DOM_VK_XF86XK_OFFICE_HOME",
        "DOM_VK_XF86XK_OPEN",
        "DOM_VK_XF86XK_OPEN_URL",
        "DOM_VK_XF86XK_OPTION",
        "DOM_VK_XF86XK_PASTE",
        "DOM_VK_XF86XK_PHONE",
        "DOM_VK_XF86XK_PICTURES",
        "DOM_VK_XF86XK_POWER_DOWN",
        "DOM_VK_XF86XK_POWER_OFF",
        "DOM_VK_XF86XK_RED",
        "DOM_VK_XF86XK_REFRESH",
        "DOM_VK_XF86XK_RELOAD",
        "DOM_VK_XF86XK_REPLY",
        "DOM_VK_XF86XK_ROCKER_DOWN",
        "DOM_VK_XF86XK_ROCKER_ENTER",
        "DOM_VK_XF86XK_ROCKER_UP",
        "DOM_VK_XF86XK_ROTATE_WINDOWS",
        "DOM_VK_XF86XK_ROTATION_KB",
        "DOM_VK_XF86XK_ROTATION_PB",
        "DOM_VK_XF86XK_SAVE",
        "DOM_VK_XF86XK_SCREEN_SAVER",
        "DOM_VK_XF86XK_SCROLL_CLICK",
        "DOM_VK_XF86XK_SCROLL_DOWN",
        "DOM_VK_XF86XK_SCROLL_UP",
        "DOM_VK_XF86XK_SEARCH",
        "DOM_VK_XF86XK_SEND",
        "DOM_VK_XF86XK_SHOP",
        "DOM_VK_XF86XK_SPELL",
        "DOM_VK_XF86XK_SPLIT_SCREEN",
        "DOM_VK_XF86XK_STANDBY",
        "DOM_VK_XF86XK_START",
        "DOM_VK_XF86XK_STOP",
        "DOM_VK_XF86XK_SUBTITLE",
        "DOM_VK_XF86XK_SUPPORT",
        "DOM_VK_XF86XK_SUSPEND",
        "DOM_VK_XF86XK_TASK_PANE",
        "DOM_VK_XF86XK_TERMINAL",
        "DOM_VK_XF86XK_TIME",
        "DOM_VK_XF86XK_TOOLS",
        "DOM_VK_XF86XK_TOP_MENU",
        "DOM_VK_XF86XK_TO_DO_LIST",
        "DOM_VK_XF86XK_TRAVEL",
        "DOM_VK_XF86XK_USER1KB",
        "DOM_VK_XF86XK_USER2KB",
        "DOM_VK_XF86XK_USER_PB",
        "DOM_VK_XF86XK_UWB",
        "DOM_VK_XF86XK_VENDOR_HOME",
        "DOM_VK_XF86XK_VIDEO",
        "DOM_VK_XF86XK_VIEW",
        "DOM_VK_XF86XK_WAKE_UP",
        "DOM_VK_XF86XK_WEB_CAM",
        "DOM_VK_XF86XK_WHEEL_BUTTON",
        "DOM_VK_XF86XK_WLAN",
        "DOM_VK_XF86XK_WORD",
        "DOM_VK_XF86XK_WWW",
        "DOM_VK_XF86XK_XFER",
        "DOM_VK_XF86XK_YELLOW",
        "DOM_VK_XF86XK_ZOOM_IN",
        "DOM_VK_XF86XK_ZOOM_OUT",
        "DOM_VK_Y",
        "DOM_VK_Z",
        "DOM_VK_ZOOM",
        "DONE",
        "DONT_CARE",
        "DOWNLOADING",
        "DRAGDROP",
        "DRAW_BUFFER0",
        "DRAW_BUFFER1",
        "DRAW_BUFFER10",
        "DRAW_BUFFER11",
        "DRAW_BUFFER12",
        "DRAW_BUFFER13",
        "DRAW_BUFFER14",
        "DRAW_BUFFER15",
        "DRAW_BUFFER2",
        "DRAW_BUFFER3",
        "DRAW_BUFFER4",
        "DRAW_BUFFER5",
        "DRAW_BUFFER6",
        "DRAW_BUFFER7",
        "DRAW_BUFFER8",
        "DRAW_BUFFER9",
        "DRAW_FRAMEBUFFER",
        "DRAW_FRAMEBUFFER_BINDING",
        "DST_ALPHA",
        "DST_COLOR",
        "DYNAMIC_COPY",
        "DYNAMIC_DRAW",
        "DYNAMIC_READ",
        "DataChannel",
        "DataTransfer",
        "DataTransferItem",
        "DataTransferItemList",
        "DataView",
        "Date",
        "DateTimeFormat",
        "DecompressionStream",
        "DelayNode",
        "DeprecationReportBody",
        "DesktopNotification",
        "DesktopNotificationCenter",
        "DeviceLightEvent",
        "DeviceMotionEvent",
        "DeviceMotionEventAcceleration",
        "DeviceMotionEventRotationRate",
        "DeviceOrientationEvent",
        "DeviceProximityEvent",
        "DeviceStorage",
        "DeviceStorageChangeEvent",
        "Directory",
        "DisplayNames",
        "Document",
        "DocumentFragment",
        "DocumentTimeline",
        "DocumentType",
        "DragEvent",
        "DynamicsCompressorNode",
        "E",
        "ELEMENT_ARRAY_BUFFER",
        "ELEMENT_ARRAY_BUFFER_BINDING",
        "ELEMENT_NODE",
        "EMPTY",
        "ENCODING_ERR",
        "ENDED",
        "END_TO_END",
        "END_TO_START",
        "ENTITY_NODE",
        "ENTITY_REFERENCE_NODE",
        "EPSILON",
        "EQUAL",
        "EQUALPOWER",
        "ERROR",
        "EXPONENTIAL_DISTANCE",
        "Element",
        "ElementInternals",
        "ElementQuery",
        "EnterPictureInPictureEvent",
        "Entity",
        "EntityReference",
        "Error",
        "ErrorEvent",
        "EvalError",
        "Event",
        "EventException",
        "EventSource",
        "EventTarget",
        "External",
        "FASTEST",
        "FIDOSDK",
        "FILTER_ACCEPT",
        "FILTER_INTERRUPT",
        "FILTER_REJECT",
        "FILTER_SKIP",
        "FINISHED_STATE",
        "FIRST_ORDERED_NODE_TYPE",
        "FLOAT",
        "FLOAT_32_UNSIGNED_INT_24_8_REV",
        "FLOAT_MAT2",
        "FLOAT_MAT2x3",
        "FLOAT_MAT2x4",
        "FLOAT_MAT3",
        "FLOAT_MAT3x2",
        "FLOAT_MAT3x4",
        "FLOAT_MAT4",
        "FLOAT_MAT4x2",
        "FLOAT_MAT4x3",
        "FLOAT_VEC2",
        "FLOAT_VEC3",
        "FLOAT_VEC4",
        "FOCUS",
        "FONT_FACE_RULE",
        "FONT_FEATURE_VALUES_RULE",
        "FRAGMENT_SHADER",
        "FRAGMENT_SHADER_DERIVATIVE_HINT",
        "FRAGMENT_SHADER_DERIVATIVE_HINT_OES",
        "FRAMEBUFFER",
        "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",
        "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",
        "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",
        "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",
        "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",
        "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",
        "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
        "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
        "FRAMEBUFFER_ATTACHMENT_RED_SIZE",
        "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",
        "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
        "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",
        "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
        "FRAMEBUFFER_BINDING",
        "FRAMEBUFFER_COMPLETE",
        "FRAMEBUFFER_DEFAULT",
        "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
        "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
        "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
        "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE",
        "FRAMEBUFFER_UNSUPPORTED",
        "FRONT",
        "FRONT_AND_BACK",
        "FRONT_FACE",
        "FUNC_ADD",
        "FUNC_REVERSE_SUBTRACT",
        "FUNC_SUBTRACT",
        "FeaturePolicy",
        "FeaturePolicyViolationReportBody",
        "FederatedCredential",
        "Feed",
        "FeedEntry",
        "File",
        "FileError",
        "FileList",
        "FileReader",
        "FileSystem",
        "FileSystemDirectoryEntry",
        "FileSystemDirectoryReader",
        "FileSystemEntry",
        "FileSystemFileEntry",
        "FinalizationRegistry",
        "FindInPage",
        "Float32Array",
        "Float64Array",
        "FocusEvent",
        "FontFace",
        "FontFaceSet",
        "FontFaceSetLoadEvent",
        "FormData",
        "FormDataEvent",
        "FragmentDirective",
        "Function",
        "GENERATE_MIPMAP_HINT",
        "GEQUAL",
        "GREATER",
        "GREEN_BITS",
        "GainNode",
        "Gamepad",
        "GamepadAxisMoveEvent",
        "GamepadButton",
        "GamepadButtonEvent",
        "GamepadEvent",
        "GamepadHapticActuator",
        "GamepadPose",
        "Geolocation",
        "GeolocationCoordinates",
        "GeolocationPosition",
        "GeolocationPositionError",
        "GestureEvent",
        "Global",
        "Gyroscope",
        "HALF_FLOAT",
        "HAVE_CURRENT_DATA",
        "HAVE_ENOUGH_DATA",
        "HAVE_FUTURE_DATA",
        "HAVE_METADATA",
        "HAVE_NOTHING",
        "HEADERS_RECEIVED",
        "HIDDEN",
        "HIERARCHY_REQUEST_ERR",
        "HIGHPASS",
        "HIGHSHELF",
        "HIGH_FLOAT",
        "HIGH_INT",
        "HORIZONTAL",
        "HORIZONTAL_AXIS",
        "HRTF",
        "HTMLAllCollection",
        "HTMLAnchorElement",
        "HTMLAppletElement",
        "HTMLAreaElement",
        "HTMLAudioElement",
        "HTMLBRElement",
        "HTMLBaseElement",
        "HTMLBaseFontElement",
        "HTMLBlockquoteElement",
        "HTMLBodyElement",
        "HTMLButtonElement",
        "HTMLCanvasElement",
        "HTMLCollection",
        "HTMLCommandElement",
        "HTMLContentElement",
        "HTMLDListElement",
        "HTMLDataElement",
        "HTMLDataListElement",
        "HTMLDetailsElement",
        "HTMLDialogElement",
        "HTMLDirectoryElement",
        "HTMLDivElement",
        "HTMLDocument",
        "HTMLElement",
        "HTMLEmbedElement",
        "HTMLFieldSetElement",
        "HTMLFontElement",
        "HTMLFormControlsCollection",
        "HTMLFormElement",
        "HTMLFrameElement",
        "HTMLFrameSetElement",
        "HTMLHRElement",
        "HTMLHeadElement",
        "HTMLHeadingElement",
        "HTMLHtmlElement",
        "HTMLIFrameElement",
        "HTMLImageElement",
        "HTMLInputElement",
        "HTMLIsIndexElement",
        "HTMLKeygenElement",
        "HTMLLIElement",
        "HTMLLabelElement",
        "HTMLLegendElement",
        "HTMLLinkElement",
        "HTMLMapElement",
        "HTMLMarqueeElement",
        "HTMLMediaElement",
        "HTMLMenuElement",
        "HTMLMenuItemElement",
        "HTMLMetaElement",
        "HTMLMeterElement",
        "HTMLModElement",
        "HTMLOListElement",
        "HTMLObjectElement",
        "HTMLOptGroupElement",
        "HTMLOptionElement",
        "HTMLOptionsCollection",
        "HTMLOutputElement",
        "HTMLParagraphElement",
        "HTMLParamElement",
        "HTMLPictureElement",
        "HTMLPreElement",
        "HTMLProgressElement",
        "HTMLPropertiesCollection",
        "HTMLQuoteElement",
        "HTMLScriptElement",
        "HTMLSelectElement",
        "HTMLShadowElement",
        "HTMLSlotElement",
        "HTMLSourceElement",
        "HTMLSpanElement",
        "HTMLStyleElement",
        "HTMLTableCaptionElement",
        "HTMLTableCellElement",
        "HTMLTableColElement",
        "HTMLTableElement",
        "HTMLTableRowElement",
        "HTMLTableSectionElement",
        "HTMLTemplateElement",
        "HTMLTextAreaElement",
        "HTMLTimeElement",
        "HTMLTitleElement",
        "HTMLTrackElement",
        "HTMLUListElement",
        "HTMLUnknownElement",
        "HTMLVideoElement",
        "HashChangeEvent",
        "Headers",
        "History",
        "Hz",
        "ICE_CHECKING",
        "ICE_CLOSED",
        "ICE_COMPLETED",
        "ICE_CONNECTED",
        "ICE_FAILED",
        "ICE_GATHERING",
        "ICE_WAITING",
        "IDBCursor",
        "IDBCursorWithValue",
        "IDBDatabase",
        "IDBDatabaseException",
        "IDBFactory",
        "IDBFileHandle",
        "IDBFileRequest",
        "IDBIndex",
        "IDBKeyRange",
        "IDBMutableFile",
        "IDBObjectStore",
        "IDBOpenDBRequest",
        "IDBRequest",
        "IDBTransaction",
        "IDBVersionChangeEvent",
        "IDLE",
        "IIRFilterNode",
        "IMPLEMENTATION_COLOR_READ_FORMAT",
        "IMPLEMENTATION_COLOR_READ_TYPE",
        "IMPORT_RULE",
        "INCR",
        "INCR_WRAP",
        "INDEX_SIZE_ERR",
        "INT",
        "INTERLEAVED_ATTRIBS",
        "INT_2_10_10_10_REV",
        "INT_SAMPLER_2D",
        "INT_SAMPLER_2D_ARRAY",
        "INT_SAMPLER_3D",
        "INT_SAMPLER_CUBE",
        "INT_VEC2",
        "INT_VEC3",
        "INT_VEC4",
        "INUSE_ATTRIBUTE_ERR",
        "INVALID_ACCESS_ERR",
        "INVALID_CHARACTER_ERR",
        "INVALID_ENUM",
        "INVALID_EXPRESSION_ERR",
        "INVALID_FRAMEBUFFER_OPERATION",
        "INVALID_INDEX",
        "INVALID_MODIFICATION_ERR",
        "INVALID_NODE_TYPE_ERR",
        "INVALID_OPERATION",
        "INVALID_STATE_ERR",
        "INVALID_VALUE",
        "INVERSE_DISTANCE",
        "INVERT",
        "IceCandidate",
        "IdleDeadline",
        "Image",
        "ImageBitmap",
        "ImageBitmapRenderingContext",
        "ImageCapture",
        "ImageData",
        "Infinity",
        "InputDeviceCapabilities",
        "InputDeviceInfo",
        "InputEvent",
        "InputMethodContext",
        "InstallTrigger",
        "InstallTriggerImpl",
        "Instance",
        "Int16Array",
        "Int32Array",
        "Int8Array",
        "Intent",
        "InternalError",
        "IntersectionObserver",
        "IntersectionObserverEntry",
        "Intl",
        "IsSearchProviderInstalled",
        "Iterator",
        "JSON",
        "KEEP",
        "KEYDOWN",
        "KEYFRAMES_RULE",
        "KEYFRAME_RULE",
        "KEYPRESS",
        "KEYUP",
        "KeyEvent",
        "Keyboard",
        "KeyboardEvent",
        "KeyboardLayoutMap",
        "KeyframeEffect",
        "LENGTHADJUST_SPACING",
        "LENGTHADJUST_SPACINGANDGLYPHS",
        "LENGTHADJUST_UNKNOWN",
        "LEQUAL",
        "LESS",
        "LINEAR",
        "LINEAR_DISTANCE",
        "LINEAR_MIPMAP_LINEAR",
        "LINEAR_MIPMAP_NEAREST",
        "LINES",
        "LINE_LOOP",
        "LINE_STRIP",
        "LINE_WIDTH",
        "LINK_STATUS",
        "LIVE",
        "LN10",
        "LN2",
        "LOADED",
        "LOADING",
        "LOG10E",
        "LOG2E",
        "LOWPASS",
        "LOWSHELF",
        "LOW_FLOAT",
        "LOW_INT",
        "LSException",
        "LSParserFilter",
        "LUMINANCE",
        "LUMINANCE_ALPHA",
        "LargestContentfulPaint",
        "LayoutShift",
        "LayoutShiftAttribution",
        "LinearAccelerationSensor",
        "LinkError",
        "ListFormat",
        "LocalMediaStream",
        "Locale",
        "Location",
        "Lock",
        "LockManager",
        "MAX",
        "MAX_3D_TEXTURE_SIZE",
        "MAX_ARRAY_TEXTURE_LAYERS",
        "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
        "MAX_COLOR_ATTACHMENTS",
        "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
        "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
        "MAX_COMBINED_UNIFORM_BLOCKS",
        "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
        "MAX_CUBE_MAP_TEXTURE_SIZE",
        "MAX_DRAW_BUFFERS",
        "MAX_ELEMENTS_INDICES",
        "MAX_ELEMENTS_VERTICES",
        "MAX_ELEMENT_INDEX",
        "MAX_FRAGMENT_INPUT_COMPONENTS",
        "MAX_FRAGMENT_UNIFORM_BLOCKS",
        "MAX_FRAGMENT_UNIFORM_COMPONENTS",
        "MAX_FRAGMENT_UNIFORM_VECTORS",
        "MAX_PROGRAM_TEXEL_OFFSET",
        "MAX_RENDERBUFFER_SIZE",
        "MAX_SAFE_INTEGER",
        "MAX_SAMPLES",
        "MAX_SERVER_WAIT_TIMEOUT",
        "MAX_TEXTURE_IMAGE_UNITS",
        "MAX_TEXTURE_LOD_BIAS",
        "MAX_TEXTURE_MAX_ANISOTROPY_EXT",
        "MAX_TEXTURE_SIZE",
        "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
        "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
        "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
        "MAX_UNIFORM_BLOCK_SIZE",
        "MAX_UNIFORM_BUFFER_BINDINGS",
        "MAX_VALUE",
        "MAX_VARYING_COMPONENTS",
        "MAX_VARYING_VECTORS",
        "MAX_VERTEX_ATTRIBS",
        "MAX_VERTEX_OUTPUT_COMPONENTS",
        "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
        "MAX_VERTEX_UNIFORM_BLOCKS",
        "MAX_VERTEX_UNIFORM_COMPONENTS",
        "MAX_VERTEX_UNIFORM_VECTORS",
        "MAX_VIEWPORT_DIMS",
        "MEDIA_ERR_ABORTED",
        "MEDIA_ERR_DECODE",
        "MEDIA_ERR_ENCRYPTED",
        "MEDIA_ERR_NETWORK",
        "MEDIA_ERR_SRC_NOT_SUPPORTED",
        "MEDIA_KEYERR_CLIENT",
        "MEDIA_KEYERR_DOMAIN",
        "MEDIA_KEYERR_HARDWARECHANGE",
        "MEDIA_KEYERR_OUTPUT",
        "MEDIA_KEYERR_SERVICE",
        "MEDIA_KEYERR_UNKNOWN",
        "MEDIA_RULE",
        "MEDIUM_FLOAT",
        "MEDIUM_INT",
        "META_MASK",
        "MIDIAccess",
        "MIDIConnectionEvent",
        "MIDIInput",
        "MIDIInputMap",
        "MIDIMessageEvent",
        "MIDIOutput",
        "MIDIOutputMap",
        "MIDIPort",
        "MIN",
        "MIN_PROGRAM_TEXEL_OFFSET",
        "MIN_SAFE_INTEGER",
        "MIN_VALUE",
        "MIRRORED_REPEAT",
        "MODE_ASYNCHRONOUS",
        "MODE_SYNCHRONOUS",
        "MODIFICATION",
        "MOUSEDOWN",
        "MOUSEDRAG",
        "MOUSEMOVE",
        "MOUSEOUT",
        "MOUSEOVER",
        "MOUSEUP",
        "MOZ_KEYFRAMES_RULE",
        "MOZ_KEYFRAME_RULE",
        "MOZ_SOURCE_CURSOR",
        "MOZ_SOURCE_ERASER",
        "MOZ_SOURCE_KEYBOARD",
        "MOZ_SOURCE_MOUSE",
        "MOZ_SOURCE_PEN",
        "MOZ_SOURCE_TOUCH",
        "MOZ_SOURCE_UNKNOWN",
        "MSGESTURE_FLAG_BEGIN",
        "MSGESTURE_FLAG_CANCEL",
        "MSGESTURE_FLAG_END",
        "MSGESTURE_FLAG_INERTIA",
        "MSGESTURE_FLAG_NONE",
        "MSPOINTER_TYPE_MOUSE",
        "MSPOINTER_TYPE_PEN",
        "MSPOINTER_TYPE_TOUCH",
        "MS_ASYNC_CALLBACK_STATUS_ASSIGN_DELEGATE",
        "MS_ASYNC_CALLBACK_STATUS_CANCEL",
        "MS_ASYNC_CALLBACK_STATUS_CHOOSEANY",
        "MS_ASYNC_CALLBACK_STATUS_ERROR",
        "MS_ASYNC_CALLBACK_STATUS_JOIN",
        "MS_ASYNC_OP_STATUS_CANCELED",
        "MS_ASYNC_OP_STATUS_ERROR",
        "MS_ASYNC_OP_STATUS_SUCCESS",
        "MS_MANIPULATION_STATE_ACTIVE",
        "MS_MANIPULATION_STATE_CANCELLED",
        "MS_MANIPULATION_STATE_COMMITTED",
        "MS_MANIPULATION_STATE_DRAGGING",
        "MS_MANIPULATION_STATE_INERTIA",
        "MS_MANIPULATION_STATE_PRESELECT",
        "MS_MANIPULATION_STATE_SELECTING",
        "MS_MANIPULATION_STATE_STOPPED",
        "MS_MEDIA_ERR_ENCRYPTED",
        "MS_MEDIA_KEYERR_CLIENT",
        "MS_MEDIA_KEYERR_DOMAIN",
        "MS_MEDIA_KEYERR_HARDWARECHANGE",
        "MS_MEDIA_KEYERR_OUTPUT",
        "MS_MEDIA_KEYERR_SERVICE",
        "MS_MEDIA_KEYERR_UNKNOWN",
        "Map",
        "Math",
        "MathMLElement",
        "MediaCapabilities",
        "MediaCapabilitiesInfo",
        "MediaController",
        "MediaDeviceInfo",
        "MediaDevices",
        "MediaElementAudioSourceNode",
        "MediaEncryptedEvent",
        "MediaError",
        "MediaKeyError",
        "MediaKeyEvent",
        "MediaKeyMessageEvent",
        "MediaKeyNeededEvent",
        "MediaKeySession",
        "MediaKeyStatusMap",
        "MediaKeySystemAccess",
        "MediaKeys",
        "MediaList",
        "MediaMetadata",
        "MediaQueryList",
        "MediaQueryListEvent",
        "MediaRecorder",
        "MediaRecorderErrorEvent",
        "MediaSession",
        "MediaSettingsRange",
        "MediaSource",
        "MediaStream",
        "MediaStreamAudioDestinationNode",
        "MediaStreamAudioSourceNode",
        "MediaStreamEvent",
        "MediaStreamTrack",
        "MediaStreamTrackAudioSourceNode",
        "MediaStreamTrackEvent",
        "Memory",
        "MessageChannel",
        "MessageEvent",
        "MessagePort",
        "Methods",
        "MimeType",
        "MimeTypeArray",
        "Module",
        "MouseEvent",
        "MouseScrollEvent",
        "MozAnimation",
        "MozAnimationDelay",
        "MozAnimationDirection",
        "MozAnimationDuration",
        "MozAnimationFillMode",
        "MozAnimationIterationCount",
        "MozAnimationName",
        "MozAnimationPlayState",
        "MozAnimationTimingFunction",
        "MozAppearance",
        "MozBackfaceVisibility",
        "MozBinding",
        "MozBorderBottomColors",
        "MozBorderEnd",
        "MozBorderEndColor",
        "MozBorderEndStyle",
        "MozBorderEndWidth",
        "MozBorderImage",
        "MozBorderLeftColors",
        "MozBorderRightColors",
        "MozBorderStart",
        "MozBorderStartColor",
        "MozBorderStartStyle",
        "MozBorderStartWidth",
        "MozBorderTopColors",
        "MozBoxAlign",
        "MozBoxDirection",
        "MozBoxFlex",
        "MozBoxOrdinalGroup",
        "MozBoxOrient",
        "MozBoxPack",
        "MozBoxSizing",
        "MozCSSKeyframeRule",
        "MozCSSKeyframesRule",
        "MozColumnCount",
        "MozColumnFill",
        "MozColumnGap",
        "MozColumnRule",
        "MozColumnRuleColor",
        "MozColumnRuleStyle",
        "MozColumnRuleWidth",
        "MozColumnWidth",
        "MozColumns",
        "MozContactChangeEvent",
        "MozFloatEdge",
        "MozFontFeatureSettings",
        "MozFontLanguageOverride",
        "MozForceBrokenImageIcon",
        "MozHyphens",
        "MozImageRegion",
        "MozMarginEnd",
        "MozMarginStart",
        "MozMmsEvent",
        "MozMmsMessage",
        "MozMobileMessageThread",
        "MozOSXFontSmoothing",
        "MozOrient",
        "MozOsxFontSmoothing",
        "MozOutlineRadius",
        "MozOutlineRadiusBottomleft",
        "MozOutlineRadiusBottomright",
        "MozOutlineRadiusTopleft",
        "MozOutlineRadiusTopright",
        "MozPaddingEnd",
        "MozPaddingStart",
        "MozPerspective",
        "MozPerspectiveOrigin",
        "MozPowerManager",
        "MozSettingsEvent",
        "MozSmsEvent",
        "MozSmsMessage",
        "MozStackSizing",
        "MozTabSize",
        "MozTextAlignLast",
        "MozTextDecorationColor",
        "MozTextDecorationLine",
        "MozTextDecorationStyle",
        "MozTextSizeAdjust",
        "MozTransform",
        "MozTransformOrigin",
        "MozTransformStyle",
        "MozTransition",
        "MozTransitionDelay",
        "MozTransitionDuration",
        "MozTransitionProperty",
        "MozTransitionTimingFunction",
        "MozUserFocus",
        "MozUserInput",
        "MozUserModify",
        "MozUserSelect",
        "MozWindowDragging",
        "MozWindowShadow",
        "MutationEvent",
        "MutationObserver",
        "MutationRecord",
        "NAMESPACE_ERR",
        "NAMESPACE_RULE",
        "NEAREST",
        "NEAREST_MIPMAP_LINEAR",
        "NEAREST_MIPMAP_NEAREST",
        "NEGATIVE_INFINITY",
        "NETWORK_EMPTY",
        "NETWORK_ERR",
        "NETWORK_IDLE",
        "NETWORK_LOADED",
        "NETWORK_LOADING",
        "NETWORK_NO_SOURCE",
        "NEVER",
        "NEW",
        "NEXT",
        "NEXT_NO_DUPLICATE",
        "NICEST",
        "NODE_AFTER",
        "NODE_BEFORE",
        "NODE_BEFORE_AND_AFTER",
        "NODE_INSIDE",
        "NONE",
        "NON_TRANSIENT_ERR",
        "NOTATION_NODE",
        "NOTCH",
        "NOTEQUAL",
        "NOT_ALLOWED_ERR",
        "NOT_FOUND_ERR",
        "NOT_READABLE_ERR",
        "NOT_SUPPORTED_ERR",
        "NO_DATA_ALLOWED_ERR",
        "NO_ERR",
        "NO_ERROR",
        "NO_MODIFICATION_ALLOWED_ERR",
        "NUMBER_TYPE",
        "NUM_COMPRESSED_TEXTURE_FORMATS",
        "NaN",
        "NamedNodeMap",
        "NavigationPreloadManager",
        "Navigator",
        "NearbyLinks",
        "NetworkInformation",
        "Node",
        "NodeFilter",
        "NodeIterator",
        "NodeList",
        "Notation",
        "Notification",
        "NotifyPaintEvent",
        "Number",
        "NumberFormat",
        "OBJECT_TYPE",
        "OBSOLETE",
        "OK",
        "ONE",
        "ONE_MINUS_CONSTANT_ALPHA",
        "ONE_MINUS_CONSTANT_COLOR",
        "ONE_MINUS_DST_ALPHA",
        "ONE_MINUS_DST_COLOR",
        "ONE_MINUS_SRC_ALPHA",
        "ONE_MINUS_SRC_COLOR",
        "OPEN",
        "OPENED",
        "OPENING",
        "ORDERED_NODE_ITERATOR_TYPE",
        "ORDERED_NODE_SNAPSHOT_TYPE",
        "OTHER_ERROR",
        "OUT_OF_MEMORY",
        "Object",
        "OfflineAudioCompletionEvent",
        "OfflineAudioContext",
        "OfflineResourceList",
        "OffscreenCanvas",
        "OffscreenCanvasRenderingContext2D",
        "Option",
        "OrientationSensor",
        "OscillatorNode",
        "OverconstrainedError",
        "OverflowEvent",
        "PACK_ALIGNMENT",
        "PACK_ROW_LENGTH",
        "PACK_SKIP_PIXELS",
        "PACK_SKIP_ROWS",
        "PAGE_RULE",
        "PARSE_ERR",
        "PATHSEG_ARC_ABS",
        "PATHSEG_ARC_REL",
        "PATHSEG_CLOSEPATH",
        "PATHSEG_CURVETO_CUBIC_ABS",
        "PATHSEG_CURVETO_CUBIC_REL",
        "PATHSEG_CURVETO_CUBIC_SMOOTH_ABS",
        "PATHSEG_CURVETO_CUBIC_SMOOTH_REL",
        "PATHSEG_CURVETO_QUADRATIC_ABS",
        "PATHSEG_CURVETO_QUADRATIC_REL",
        "PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS",
        "PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL",
        "PATHSEG_LINETO_ABS",
        "PATHSEG_LINETO_HORIZONTAL_ABS",
        "PATHSEG_LINETO_HORIZONTAL_REL",
        "PATHSEG_LINETO_REL",
        "PATHSEG_LINETO_VERTICAL_ABS",
        "PATHSEG_LINETO_VERTICAL_REL",
        "PATHSEG_MOVETO_ABS",
        "PATHSEG_MOVETO_REL",
        "PATHSEG_UNKNOWN",
        "PATH_EXISTS_ERR",
        "PEAKING",
        "PERMISSION_DENIED",
        "PERSISTENT",
        "PI",
        "PIXEL_PACK_BUFFER",
        "PIXEL_PACK_BUFFER_BINDING",
        "PIXEL_UNPACK_BUFFER",
        "PIXEL_UNPACK_BUFFER_BINDING",
        "PLAYING_STATE",
        "POINTS",
        "POLYGON_OFFSET_FACTOR",
        "POLYGON_OFFSET_FILL",
        "POLYGON_OFFSET_UNITS",
        "POSITION_UNAVAILABLE",
        "POSITIVE_INFINITY",
        "PREV",
        "PREV_NO_DUPLICATE",
        "PROCESSING_INSTRUCTION_NODE",
        "PageChangeEvent",
        "PageTransitionEvent",
        "PaintRequest",
        "PaintRequestList",
        "PannerNode",
        "PasswordCredential",
        "Path2D",
        "PaymentAddress",
        "PaymentInstruments",
        "PaymentManager",
        "PaymentMethodChangeEvent",
        "PaymentRequest",
        "PaymentRequestUpdateEvent",
        "PaymentResponse",
        "Performance",
        "PerformanceElementTiming",
        "PerformanceEntry",
        "PerformanceEventTiming",
        "PerformanceLongTaskTiming",
        "PerformanceMark",
        "PerformanceMeasure",
        "PerformanceNavigation",
        "PerformanceNavigationTiming",
        "PerformanceObserver",
        "PerformanceObserverEntryList",
        "PerformancePaintTiming",
        "PerformanceResourceTiming",
        "PerformanceServerTiming",
        "PerformanceTiming",
        "PeriodicSyncManager",
        "PeriodicWave",
        "PermissionStatus",
        "Permissions",
        "PhotoCapabilities",
        "PictureInPictureWindow",
        "Plugin",
        "PluginArray",
        "PluralRules",
        "PointerEvent",
        "PopStateEvent",
        "PopupBlockedEvent",
        "Presentation",
        "PresentationAvailability",
        "PresentationConnection",
        "PresentationConnectionAvailableEvent",
        "PresentationConnectionCloseEvent",
        "PresentationConnectionList",
        "PresentationReceiver",
        "PresentationRequest",
        "ProcessingInstruction",
        "ProgressEvent",
        "Promise",
        "PromiseRejectionEvent",
        "PropertyNodeList",
        "Proxy",
        "PublicKeyCredential",
        "PushManager",
        "PushSubscription",
        "PushSubscriptionOptions",
        "Q",
        "QUERY_RESULT",
        "QUERY_RESULT_AVAILABLE",
        "QUOTA_ERR",
        "QUOTA_EXCEEDED_ERR",
        "QueryInterface",
        "R11F_G11F_B10F",
        "R16F",
        "R16I",
        "R16UI",
        "R32F",
        "R32I",
        "R32UI",
        "R8",
        "R8I",
        "R8UI",
        "R8_SNORM",
        "RASTERIZER_DISCARD",
        "READ_BUFFER",
        "READ_FRAMEBUFFER",
        "READ_FRAMEBUFFER_BINDING",
        "READ_ONLY",
        "READ_ONLY_ERR",
        "READ_WRITE",
        "RED",
        "RED_BITS",
        "RED_INTEGER",
        "REMOVAL",
        "RENDERBUFFER",
        "RENDERBUFFER_ALPHA_SIZE",
        "RENDERBUFFER_BINDING",
        "RENDERBUFFER_BLUE_SIZE",
        "RENDERBUFFER_DEPTH_SIZE",
        "RENDERBUFFER_GREEN_SIZE",
        "RENDERBUFFER_HEIGHT",
        "RENDERBUFFER_INTERNAL_FORMAT",
        "RENDERBUFFER_RED_SIZE",
        "RENDERBUFFER_SAMPLES",
        "RENDERBUFFER_STENCIL_SIZE",
        "RENDERBUFFER_WIDTH",
        "RENDERER",
        "RENDERING_INTENT_ABSOLUTE_COLORIMETRIC",
        "RENDERING_INTENT_AUTO",
        "RENDERING_INTENT_PERCEPTUAL",
        "RENDERING_INTENT_RELATIVE_COLORIMETRIC",
        "RENDERING_INTENT_SATURATION",
        "RENDERING_INTENT_UNKNOWN",
        "REPEAT",
        "REPLACE",
        "RG",
        "RG16F",
        "RG16I",
        "RG16UI",
        "RG32F",
        "RG32I",
        "RG32UI",
        "RG8",
        "RG8I",
        "RG8UI",
        "RG8_SNORM",
        "RGB",
        "RGB10_A2",
        "RGB10_A2UI",
        "RGB16F",
        "RGB16I",
        "RGB16UI",
        "RGB32F",
        "RGB32I",
        "RGB32UI",
        "RGB565",
        "RGB5_A1",
        "RGB8",
        "RGB8I",
        "RGB8UI",
        "RGB8_SNORM",
        "RGB9_E5",
        "RGBA",
        "RGBA16F",
        "RGBA16I",
        "RGBA16UI",
        "RGBA32F",
        "RGBA32I",
        "RGBA32UI",
        "RGBA4",
        "RGBA8",
        "RGBA8I",
        "RGBA8UI",
        "RGBA8_SNORM",
        "RGBA_INTEGER",
        "RGBColor",
        "RGB_INTEGER",
        "RG_INTEGER",
        "ROTATION_CLOCKWISE",
        "ROTATION_COUNTERCLOCKWISE",
        "RTCCertificate",
        "RTCDTMFSender",
        "RTCDTMFToneChangeEvent",
        "RTCDataChannel",
        "RTCDataChannelEvent",
        "RTCDtlsTransport",
        "RTCError",
        "RTCErrorEvent",
        "RTCIceCandidate",
        "RTCIceTransport",
        "RTCPeerConnection",
        "RTCPeerConnectionIceErrorEvent",
        "RTCPeerConnectionIceEvent",
        "RTCRtpReceiver",
        "RTCRtpSender",
        "RTCRtpTransceiver",
        "RTCSctpTransport",
        "RTCSessionDescription",
        "RTCStatsReport",
        "RTCTrackEvent",
        "RadioNodeList",
        "Range",
        "RangeError",
        "RangeException",
        "ReadableStream",
        "ReadableStreamDefaultReader",
        "RecordErrorEvent",
        "Rect",
        "ReferenceError",
        "Reflect",
        "RegExp",
        "RelativeOrientationSensor",
        "RelativeTimeFormat",
        "RemotePlayback",
        "Report",
        "ReportBody",
        "ReportingObserver",
        "Request",
        "ResizeObserver",
        "ResizeObserverEntry",
        "ResizeObserverSize",
        "Response",
        "RuntimeError",
        "SAMPLER_2D",
        "SAMPLER_2D_ARRAY",
        "SAMPLER_2D_ARRAY_SHADOW",
        "SAMPLER_2D_SHADOW",
        "SAMPLER_3D",
        "SAMPLER_BINDING",
        "SAMPLER_CUBE",
        "SAMPLER_CUBE_SHADOW",
        "SAMPLES",
        "SAMPLE_ALPHA_TO_COVERAGE",
        "SAMPLE_BUFFERS",
        "SAMPLE_COVERAGE",
        "SAMPLE_COVERAGE_INVERT",
        "SAMPLE_COVERAGE_VALUE",
        "SAWTOOTH",
        "SCHEDULED_STATE",
        "SCISSOR_BOX",
        "SCISSOR_TEST",
        "SCROLL_PAGE_DOWN",
        "SCROLL_PAGE_UP",
        "SDP_ANSWER",
        "SDP_OFFER",
        "SDP_PRANSWER",
        "SECURITY_ERR",
        "SELECT",
        "SEPARATE_ATTRIBS",
        "SERIALIZE_ERR",
        "SEVERITY_ERROR",
        "SEVERITY_FATAL_ERROR",
        "SEVERITY_WARNING",
        "SHADER_COMPILER",
        "SHADER_TYPE",
        "SHADING_LANGUAGE_VERSION",
        "SHIFT_MASK",
        "SHORT",
        "SHOWING",
        "SHOW_ALL",
        "SHOW_ATTRIBUTE",
        "SHOW_CDATA_SECTION",
        "SHOW_COMMENT",
        "SHOW_DOCUMENT",
        "SHOW_DOCUMENT_FRAGMENT",
        "SHOW_DOCUMENT_TYPE",
        "SHOW_ELEMENT",
        "SHOW_ENTITY",
        "SHOW_ENTITY_REFERENCE",
        "SHOW_NOTATION",
        "SHOW_PROCESSING_INSTRUCTION",
        "SHOW_TEXT",
        "SIGNALED",
        "SIGNED_NORMALIZED",
        "SINE",
        "SOUNDFIELD",
        "SQLException",
        "SQRT1_2",
        "SQRT2",
        "SQUARE",
        "SRC_ALPHA",
        "SRC_ALPHA_SATURATE",
        "SRC_COLOR",
        "SRGB",
        "SRGB8",
        "SRGB8_ALPHA8",
        "START_TO_END",
        "START_TO_START",
        "STATIC_COPY",
        "STATIC_DRAW",
        "STATIC_READ",
        "STENCIL",
        "STENCIL_ATTACHMENT",
        "STENCIL_BACK_FAIL",
        "STENCIL_BACK_FUNC",
        "STENCIL_BACK_PASS_DEPTH_FAIL",
        "STENCIL_BACK_PASS_DEPTH_PASS",
        "STENCIL_BACK_REF",
        "STENCIL_BACK_VALUE_MASK",
        "STENCIL_BACK_WRITEMASK",
        "STENCIL_BITS",
        "STENCIL_BUFFER_BIT",
        "STENCIL_CLEAR_VALUE",
        "STENCIL_FAIL",
        "STENCIL_FUNC",
        "STENCIL_INDEX",
        "STENCIL_INDEX8",
        "STENCIL_PASS_DEPTH_FAIL",
        "STENCIL_PASS_DEPTH_PASS",
        "STENCIL_REF",
        "STENCIL_TEST",
        "STENCIL_VALUE_MASK",
        "STENCIL_WRITEMASK",
        "STREAM_COPY",
        "STREAM_DRAW",
        "STREAM_READ",
        "STRING_TYPE",
        "STYLE_RULE",
        "SUBPIXEL_BITS",
        "SUPPORTS_RULE",
        "SVGAElement",
        "SVGAltGlyphDefElement",
        "SVGAltGlyphElement",
        "SVGAltGlyphItemElement",
        "SVGAngle",
        "SVGAnimateColorElement",
        "SVGAnimateElement",
        "SVGAnimateMotionElement",
        "SVGAnimateTransformElement",
        "SVGAnimatedAngle",
        "SVGAnimatedBoolean",
        "SVGAnimatedEnumeration",
        "SVGAnimatedInteger",
        "SVGAnimatedLength",
        "SVGAnimatedLengthList",
        "SVGAnimatedNumber",
        "SVGAnimatedNumberList",
        "SVGAnimatedPreserveAspectRatio",
        "SVGAnimatedRect",
        "SVGAnimatedString",
        "SVGAnimatedTransformList",
        "SVGAnimationElement",
        "SVGCircleElement",
        "SVGClipPathElement",
        "SVGColor",
        "SVGComponentTransferFunctionElement",
        "SVGCursorElement",
        "SVGDefsElement",
        "SVGDescElement",
        "SVGDiscardElement",
        "SVGDocument",
        "SVGElement",
        "SVGElementInstance",
        "SVGElementInstanceList",
        "SVGEllipseElement",
        "SVGException",
        "SVGFEBlendElement",
        "SVGFEColorMatrixElement",
        "SVGFEComponentTransferElement",
        "SVGFECompositeElement",
        "SVGFEConvolveMatrixElement",
        "SVGFEDiffuseLightingElement",
        "SVGFEDisplacementMapElement",
        "SVGFEDistantLightElement",
        "SVGFEDropShadowElement",
        "SVGFEFloodElement",
        "SVGFEFuncAElement",
        "SVGFEFuncBElement",
        "SVGFEFuncGElement",
        "SVGFEFuncRElement",
        "SVGFEGaussianBlurElement",
        "SVGFEImageElement",
        "SVGFEMergeElement",
        "SVGFEMergeNodeElement",
        "SVGFEMorphologyElement",
        "SVGFEOffsetElement",
        "SVGFEPointLightElement",
        "SVGFESpecularLightingElement",
        "SVGFESpotLightElement",
        "SVGFETileElement",
        "SVGFETurbulenceElement",
        "SVGFilterElement",
        "SVGFontElement",
        "SVGFontFaceElement",
        "SVGFontFaceFormatElement",
        "SVGFontFaceNameElement",
        "SVGFontFaceSrcElement",
        "SVGFontFaceUriElement",
        "SVGForeignObjectElement",
        "SVGGElement",
        "SVGGeometryElement",
        "SVGGlyphElement",
        "SVGGlyphRefElement",
        "SVGGradientElement",
        "SVGGraphicsElement",
        "SVGHKernElement",
        "SVGImageElement",
        "SVGLength",
        "SVGLengthList",
        "SVGLineElement",
        "SVGLinearGradientElement",
        "SVGMPathElement",
        "SVGMarkerElement",
        "SVGMaskElement",
        "SVGMatrix",
        "SVGMetadataElement",
        "SVGMissingGlyphElement",
        "SVGNumber",
        "SVGNumberList",
        "SVGPaint",
        "SVGPathElement",
        "SVGPathSeg",
        "SVGPathSegArcAbs",
        "SVGPathSegArcRel",
        "SVGPathSegClosePath",
        "SVGPathSegCurvetoCubicAbs",
        "SVGPathSegCurvetoCubicRel",
        "SVGPathSegCurvetoCubicSmoothAbs",
        "SVGPathSegCurvetoCubicSmoothRel",
        "SVGPathSegCurvetoQuadraticAbs",
        "SVGPathSegCurvetoQuadraticRel",
        "SVGPathSegCurvetoQuadraticSmoothAbs",
        "SVGPathSegCurvetoQuadraticSmoothRel",
        "SVGPathSegLinetoAbs",
        "SVGPathSegLinetoHorizontalAbs",
        "SVGPathSegLinetoHorizontalRel",
        "SVGPathSegLinetoRel",
        "SVGPathSegLinetoVerticalAbs",
        "SVGPathSegLinetoVerticalRel",
        "SVGPathSegList",
        "SVGPathSegMovetoAbs",
        "SVGPathSegMovetoRel",
        "SVGPatternElement",
        "SVGPoint",
        "SVGPointList",
        "SVGPolygonElement",
        "SVGPolylineElement",
        "SVGPreserveAspectRatio",
        "SVGRadialGradientElement",
        "SVGRect",
        "SVGRectElement",
        "SVGRenderingIntent",
        "SVGSVGElement",
        "SVGScriptElement",
        "SVGSetElement",
        "SVGStopElement",
        "SVGStringList",
        "SVGStyleElement",
        "SVGSwitchElement",
        "SVGSymbolElement",
        "SVGTRefElement",
        "SVGTSpanElement",
        "SVGTextContentElement",
        "SVGTextElement",
        "SVGTextPathElement",
        "SVGTextPositioningElement",
        "SVGTitleElement",
        "SVGTransform",
        "SVGTransformList",
        "SVGUnitTypes",
        "SVGUseElement",
        "SVGVKernElement",
        "SVGViewElement",
        "SVGViewSpec",
        "SVGZoomAndPan",
        "SVGZoomEvent",
        "SVG_ANGLETYPE_DEG",
        "SVG_ANGLETYPE_GRAD",
        "SVG_ANGLETYPE_RAD",
        "SVG_ANGLETYPE_UNKNOWN",
        "SVG_ANGLETYPE_UNSPECIFIED",
        "SVG_CHANNEL_A",
        "SVG_CHANNEL_B",
        "SVG_CHANNEL_G",
        "SVG_CHANNEL_R",
        "SVG_CHANNEL_UNKNOWN",
        "SVG_COLORTYPE_CURRENTCOLOR",
        "SVG_COLORTYPE_RGBCOLOR",
        "SVG_COLORTYPE_RGBCOLOR_ICCCOLOR",
        "SVG_COLORTYPE_UNKNOWN",
        "SVG_EDGEMODE_DUPLICATE",
        "SVG_EDGEMODE_NONE",
        "SVG_EDGEMODE_UNKNOWN",
        "SVG_EDGEMODE_WRAP",
        "SVG_FEBLEND_MODE_COLOR",
        "SVG_FEBLEND_MODE_COLOR_BURN",
        "SVG_FEBLEND_MODE_COLOR_DODGE",
        "SVG_FEBLEND_MODE_DARKEN",
        "SVG_FEBLEND_MODE_DIFFERENCE",
        "SVG_FEBLEND_MODE_EXCLUSION",
        "SVG_FEBLEND_MODE_HARD_LIGHT",
        "SVG_FEBLEND_MODE_HUE",
        "SVG_FEBLEND_MODE_LIGHTEN",
        "SVG_FEBLEND_MODE_LUMINOSITY",
        "SVG_FEBLEND_MODE_MULTIPLY",
        "SVG_FEBLEND_MODE_NORMAL",
        "SVG_FEBLEND_MODE_OVERLAY",
        "SVG_FEBLEND_MODE_SATURATION",
        "SVG_FEBLEND_MODE_SCREEN",
        "SVG_FEBLEND_MODE_SOFT_LIGHT",
        "SVG_FEBLEND_MODE_UNKNOWN",
        "SVG_FECOLORMATRIX_TYPE_HUEROTATE",
        "SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA",
        "SVG_FECOLORMATRIX_TYPE_MATRIX",
        "SVG_FECOLORMATRIX_TYPE_SATURATE",
        "SVG_FECOLORMATRIX_TYPE_UNKNOWN",
        "SVG_FECOMPONENTTRANSFER_TYPE_DISCRETE",
        "SVG_FECOMPONENTTRANSFER_TYPE_GAMMA",
        "SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY",
        "SVG_FECOMPONENTTRANSFER_TYPE_LINEAR",
        "SVG_FECOMPONENTTRANSFER_TYPE_TABLE",
        "SVG_FECOMPONENTTRANSFER_TYPE_UNKNOWN",
        "SVG_FECOMPOSITE_OPERATOR_ARITHMETIC",
        "SVG_FECOMPOSITE_OPERATOR_ATOP",
        "SVG_FECOMPOSITE_OPERATOR_IN",
        "SVG_FECOMPOSITE_OPERATOR_OUT",
        "SVG_FECOMPOSITE_OPERATOR_OVER",
        "SVG_FECOMPOSITE_OPERATOR_UNKNOWN",
        "SVG_FECOMPOSITE_OPERATOR_XOR",
        "SVG_INVALID_VALUE_ERR",
        "SVG_LENGTHTYPE_CM",
        "SVG_LENGTHTYPE_EMS",
        "SVG_LENGTHTYPE_EXS",
        "SVG_LENGTHTYPE_IN",
        "SVG_LENGTHTYPE_MM",
        "SVG_LENGTHTYPE_NUMBER",
        "SVG_LENGTHTYPE_PC",
        "SVG_LENGTHTYPE_PERCENTAGE",
        "SVG_LENGTHTYPE_PT",
        "SVG_LENGTHTYPE_PX",
        "SVG_LENGTHTYPE_UNKNOWN",
        "SVG_MARKERUNITS_STROKEWIDTH",
        "SVG_MARKERUNITS_UNKNOWN",
        "SVG_MARKERUNITS_USERSPACEONUSE",
        "SVG_MARKER_ORIENT_ANGLE",
        "SVG_MARKER_ORIENT_AUTO",
        "SVG_MARKER_ORIENT_UNKNOWN",
        "SVG_MASKTYPE_ALPHA",
        "SVG_MASKTYPE_LUMINANCE",
        "SVG_MATRIX_NOT_INVERTABLE",
        "SVG_MEETORSLICE_MEET",
        "SVG_MEETORSLICE_SLICE",
        "SVG_MEETORSLICE_UNKNOWN",
        "SVG_MORPHOLOGY_OPERATOR_DILATE",
        "SVG_MORPHOLOGY_OPERATOR_ERODE",
        "SVG_MORPHOLOGY_OPERATOR_UNKNOWN",
        "SVG_PAINTTYPE_CURRENTCOLOR",
        "SVG_PAINTTYPE_NONE",
        "SVG_PAINTTYPE_RGBCOLOR",
        "SVG_PAINTTYPE_RGBCOLOR_ICCCOLOR",
        "SVG_PAINTTYPE_UNKNOWN",
        "SVG_PAINTTYPE_URI",
        "SVG_PAINTTYPE_URI_CURRENTCOLOR",
        "SVG_PAINTTYPE_URI_NONE",
        "SVG_PAINTTYPE_URI_RGBCOLOR",
        "SVG_PAINTTYPE_URI_RGBCOLOR_ICCCOLOR",
        "SVG_PRESERVEASPECTRATIO_NONE",
        "SVG_PRESERVEASPECTRATIO_UNKNOWN",
        "SVG_PRESERVEASPECTRATIO_XMAXYMAX",
        "SVG_PRESERVEASPECTRATIO_XMAXYMID",
        "SVG_PRESERVEASPECTRATIO_XMAXYMIN",
        "SVG_PRESERVEASPECTRATIO_XMIDYMAX",
        "SVG_PRESERVEASPECTRATIO_XMIDYMID",
        "SVG_PRESERVEASPECTRATIO_XMIDYMIN",
        "SVG_PRESERVEASPECTRATIO_XMINYMAX",
        "SVG_PRESERVEASPECTRATIO_XMINYMID",
        "SVG_PRESERVEASPECTRATIO_XMINYMIN",
        "SVG_SPREADMETHOD_PAD",
        "SVG_SPREADMETHOD_REFLECT",
        "SVG_SPREADMETHOD_REPEAT",
        "SVG_SPREADMETHOD_UNKNOWN",
        "SVG_STITCHTYPE_NOSTITCH",
        "SVG_STITCHTYPE_STITCH",
        "SVG_STITCHTYPE_UNKNOWN",
        "SVG_TRANSFORM_MATRIX",
        "SVG_TRANSFORM_ROTATE",
        "SVG_TRANSFORM_SCALE",
        "SVG_TRANSFORM_SKEWX",
        "SVG_TRANSFORM_SKEWY",
        "SVG_TRANSFORM_TRANSLATE",
        "SVG_TRANSFORM_UNKNOWN",
        "SVG_TURBULENCE_TYPE_FRACTALNOISE",
        "SVG_TURBULENCE_TYPE_TURBULENCE",
        "SVG_TURBULENCE_TYPE_UNKNOWN",
        "SVG_UNIT_TYPE_OBJECTBOUNDINGBOX",
        "SVG_UNIT_TYPE_UNKNOWN",
        "SVG_UNIT_TYPE_USERSPACEONUSE",
        "SVG_WRONG_TYPE_ERR",
        "SVG_ZOOMANDPAN_DISABLE",
        "SVG_ZOOMANDPAN_MAGNIFY",
        "SVG_ZOOMANDPAN_UNKNOWN",
        "SYNC_CONDITION",
        "SYNC_FENCE",
        "SYNC_FLAGS",
        "SYNC_FLUSH_COMMANDS_BIT",
        "SYNC_GPU_COMMANDS_COMPLETE",
        "SYNC_STATUS",
        "SYNTAX_ERR",
        "SavedPages",
        "Screen",
        "ScreenOrientation",
        "Script",
        "ScriptProcessorNode",
        "ScrollAreaEvent",
        "SecurityPolicyViolationEvent",
        "Selection",
        "Sensor",
        "SensorErrorEvent",
        "ServiceWorker",
        "ServiceWorkerContainer",
        "ServiceWorkerRegistration",
        "SessionDescription",
        "Set",
        "ShadowRoot",
        "SharedArrayBuffer",
        "SharedWorker",
        "SimpleGestureEvent",
        "SourceBuffer",
        "SourceBufferList",
        "SpeechSynthesis",
        "SpeechSynthesisErrorEvent",
        "SpeechSynthesisEvent",
        "SpeechSynthesisUtterance",
        "SpeechSynthesisVoice",
        "StaticRange",
        "StereoPannerNode",
        "StopIteration",
        "Storage",
        "StorageEvent",
        "StorageManager",
        "String",
        "StructType",
        "StylePropertyMap",
        "StylePropertyMapReadOnly",
        "StyleSheet",
        "StyleSheetList",
        "SubmitEvent",
        "SubtleCrypto",
        "Symbol",
        "SyncManager",
        "SyntaxError",
        "TEMPORARY",
        "TEXTPATH_METHODTYPE_ALIGN",
        "TEXTPATH_METHODTYPE_STRETCH",
        "TEXTPATH_METHODTYPE_UNKNOWN",
        "TEXTPATH_SPACINGTYPE_AUTO",
        "TEXTPATH_SPACINGTYPE_EXACT",
        "TEXTPATH_SPACINGTYPE_UNKNOWN",
        "TEXTURE",
        "TEXTURE0",
        "TEXTURE1",
        "TEXTURE10",
        "TEXTURE11",
        "TEXTURE12",
        "TEXTURE13",
        "TEXTURE14",
        "TEXTURE15",
        "TEXTURE16",
        "TEXTURE17",
        "TEXTURE18",
        "TEXTURE19",
        "TEXTURE2",
        "TEXTURE20",
        "TEXTURE21",
        "TEXTURE22",
        "TEXTURE23",
        "TEXTURE24",
        "TEXTURE25",
        "TEXTURE26",
        "TEXTURE27",
        "TEXTURE28",
        "TEXTURE29",
        "TEXTURE3",
        "TEXTURE30",
        "TEXTURE31",
        "TEXTURE4",
        "TEXTURE5",
        "TEXTURE6",
        "TEXTURE7",
        "TEXTURE8",
        "TEXTURE9",
        "TEXTURE_2D",
        "TEXTURE_2D_ARRAY",
        "TEXTURE_3D",
        "TEXTURE_BASE_LEVEL",
        "TEXTURE_BINDING_2D",
        "TEXTURE_BINDING_2D_ARRAY",
        "TEXTURE_BINDING_3D",
        "TEXTURE_BINDING_CUBE_MAP",
        "TEXTURE_COMPARE_FUNC",
        "TEXTURE_COMPARE_MODE",
        "TEXTURE_CUBE_MAP",
        "TEXTURE_CUBE_MAP_NEGATIVE_X",
        "TEXTURE_CUBE_MAP_NEGATIVE_Y",
        "TEXTURE_CUBE_MAP_NEGATIVE_Z",
        "TEXTURE_CUBE_MAP_POSITIVE_X",
        "TEXTURE_CUBE_MAP_POSITIVE_Y",
        "TEXTURE_CUBE_MAP_POSITIVE_Z",
        "TEXTURE_IMMUTABLE_FORMAT",
        "TEXTURE_IMMUTABLE_LEVELS",
        "TEXTURE_MAG_FILTER",
        "TEXTURE_MAX_ANISOTROPY_EXT",
        "TEXTURE_MAX_LEVEL",
        "TEXTURE_MAX_LOD",
        "TEXTURE_MIN_FILTER",
        "TEXTURE_MIN_LOD",
        "TEXTURE_WRAP_R",
        "TEXTURE_WRAP_S",
        "TEXTURE_WRAP_T",
        "TEXT_NODE",
        "TIMEOUT",
        "TIMEOUT_ERR",
        "TIMEOUT_EXPIRED",
        "TIMEOUT_IGNORED",
        "TOO_LARGE_ERR",
        "TRANSACTION_INACTIVE_ERR",
        "TRANSFORM_FEEDBACK",
        "TRANSFORM_FEEDBACK_ACTIVE",
        "TRANSFORM_FEEDBACK_BINDING",
        "TRANSFORM_FEEDBACK_BUFFER",
        "TRANSFORM_FEEDBACK_BUFFER_BINDING",
        "TRANSFORM_FEEDBACK_BUFFER_MODE",
        "TRANSFORM_FEEDBACK_BUFFER_SIZE",
        "TRANSFORM_FEEDBACK_BUFFER_START",
        "TRANSFORM_FEEDBACK_PAUSED",
        "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",
        "TRANSFORM_FEEDBACK_VARYINGS",
        "TRIANGLE",
        "TRIANGLES",
        "TRIANGLE_FAN",
        "TRIANGLE_STRIP",
        "TYPE_BACK_FORWARD",
        "TYPE_ERR",
        "TYPE_MISMATCH_ERR",
        "TYPE_NAVIGATE",
        "TYPE_RELOAD",
        "TYPE_RESERVED",
        "Table",
        "TaskAttributionTiming",
        "Text",
        "TextDecoder",
        "TextDecoderStream",
        "TextEncoder",
        "TextEncoderStream",
        "TextEvent",
        "TextMetrics",
        "TextTrack",
        "TextTrackCue",
        "TextTrackCueList",
        "TextTrackList",
        "TimeEvent",
        "TimeRanges",
        "Touch",
        "TouchEvent",
        "TouchList",
        "TrackEvent",
        "TransformStream",
        "TransitionEvent",
        "TreeWalker",
        "TrustedHTML",
        "TrustedScript",
        "TrustedScriptURL",
        "TrustedTypePolicy",
        "TrustedTypePolicyFactory",
        "TypeError",
        "TypedObject",
        "U2F",
        "UIEvent",
        "UNCACHED",
        "UNIFORM_ARRAY_STRIDE",
        "UNIFORM_BLOCK_ACTIVE_UNIFORMS",
        "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",
        "UNIFORM_BLOCK_BINDING",
        "UNIFORM_BLOCK_DATA_SIZE",
        "UNIFORM_BLOCK_INDEX",
        "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",
        "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",
        "UNIFORM_BUFFER",
        "UNIFORM_BUFFER_BINDING",
        "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
        "UNIFORM_BUFFER_SIZE",
        "UNIFORM_BUFFER_START",
        "UNIFORM_IS_ROW_MAJOR",
        "UNIFORM_MATRIX_STRIDE",
        "UNIFORM_OFFSET",
        "UNIFORM_SIZE",
        "UNIFORM_TYPE",
        "UNKNOWN_ERR",
        "UNKNOWN_RULE",
        "UNMASKED_RENDERER_WEBGL",
        "UNMASKED_VENDOR_WEBGL",
        "UNORDERED_NODE_ITERATOR_TYPE",
        "UNORDERED_NODE_SNAPSHOT_TYPE",
        "UNPACK_ALIGNMENT",
        "UNPACK_COLORSPACE_CONVERSION_WEBGL",
        "UNPACK_FLIP_Y_WEBGL",
        "UNPACK_IMAGE_HEIGHT",
        "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
        "UNPACK_ROW_LENGTH",
        "UNPACK_SKIP_IMAGES",
        "UNPACK_SKIP_PIXELS",
        "UNPACK_SKIP_ROWS",
        "UNSCHEDULED_STATE",
        "UNSENT",
        "UNSIGNALED",
        "UNSIGNED_BYTE",
        "UNSIGNED_INT",
        "UNSIGNED_INT_10F_11F_11F_REV",
        "UNSIGNED_INT_24_8",
        "UNSIGNED_INT_2_10_10_10_REV",
        "UNSIGNED_INT_5_9_9_9_REV",
        "UNSIGNED_INT_SAMPLER_2D",
        "UNSIGNED_INT_SAMPLER_2D_ARRAY",
        "UNSIGNED_INT_SAMPLER_3D",
        "UNSIGNED_INT_SAMPLER_CUBE",
        "UNSIGNED_INT_VEC2",
        "UNSIGNED_INT_VEC3",
        "UNSIGNED_INT_VEC4",
        "UNSIGNED_NORMALIZED",
        "UNSIGNED_SHORT",
        "UNSIGNED_SHORT_4_4_4_4",
        "UNSIGNED_SHORT_5_5_5_1",
        "UNSIGNED_SHORT_5_6_5",
        "UNSPECIFIED_EVENT_TYPE_ERR",
        "UPDATEREADY",
        "URIError",
        "URL",
        "URLSearchParams",
        "URLUnencoded",
        "URL_MISMATCH_ERR",
        "USB",
        "USBAlternateInterface",
        "USBConfiguration",
        "USBConnectionEvent",
        "USBDevice",
        "USBEndpoint",
        "USBInTransferResult",
        "USBInterface",
        "USBIsochronousInTransferPacket",
        "USBIsochronousInTransferResult",
        "USBIsochronousOutTransferPacket",
        "USBIsochronousOutTransferResult",
        "USBOutTransferResult",
        "UTC",
        "Uint16Array",
        "Uint32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "UserActivation",
        "UserMessageHandler",
        "UserMessageHandlersNamespace",
        "UserProximityEvent",
        "VALIDATE_STATUS",
        "VALIDATION_ERR",
        "VARIABLES_RULE",
        "VENDOR",
        "VERSION",
        "VERSION_CHANGE",
        "VERSION_ERR",
        "VERTEX_ARRAY_BINDING",
        "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
        "VERTEX_ATTRIB_ARRAY_DIVISOR",
        "VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE",
        "VERTEX_ATTRIB_ARRAY_ENABLED",
        "VERTEX_ATTRIB_ARRAY_INTEGER",
        "VERTEX_ATTRIB_ARRAY_NORMALIZED",
        "VERTEX_ATTRIB_ARRAY_POINTER",
        "VERTEX_ATTRIB_ARRAY_SIZE",
        "VERTEX_ATTRIB_ARRAY_STRIDE",
        "VERTEX_ATTRIB_ARRAY_TYPE",
        "VERTEX_SHADER",
        "VERTICAL",
        "VERTICAL_AXIS",
        "VER_ERR",
        "VIEWPORT",
        "VIEWPORT_RULE",
        "VRDisplay",
        "VRDisplayCapabilities",
        "VRDisplayEvent",
        "VREyeParameters",
        "VRFieldOfView",
        "VRFrameData",
        "VRPose",
        "VRStageParameters",
        "VTTCue",
        "VTTRegion",
        "ValidityState",
        "VideoPlaybackQuality",
        "VideoStreamTrack",
        "VisualViewport",
        "WAIT_FAILED",
        "WEBKIT_FILTER_RULE",
        "WEBKIT_KEYFRAMES_RULE",
        "WEBKIT_KEYFRAME_RULE",
        "WEBKIT_REGION_RULE",
        "WRONG_DOCUMENT_ERR",
        "WakeLock",
        "WakeLockSentinel",
        "WasmAnyRef",
        "WaveShaperNode",
        "WeakMap",
        "WeakRef",
        "WeakSet",
        "WebAssembly",
        "WebGL2RenderingContext",
        "WebGLActiveInfo",
        "WebGLBuffer",
        "WebGLContextEvent",
        "WebGLFramebuffer",
        "WebGLProgram",
        "WebGLQuery",
        "WebGLRenderbuffer",
        "WebGLRenderingContext",
        "WebGLSampler",
        "WebGLShader",
        "WebGLShaderPrecisionFormat",
        "WebGLSync",
        "WebGLTexture",
        "WebGLTransformFeedback",
        "WebGLUniformLocation",
        "WebGLVertexArray",
        "WebGLVertexArrayObject",
        "WebKitAnimationEvent",
        "WebKitBlobBuilder",
        "WebKitCSSFilterRule",
        "WebKitCSSFilterValue",
        "WebKitCSSKeyframeRule",
        "WebKitCSSKeyframesRule",
        "WebKitCSSMatrix",
        "WebKitCSSRegionRule",
        "WebKitCSSTransformValue",
        "WebKitDataCue",
        "WebKitGamepad",
        "WebKitMediaKeyError",
        "WebKitMediaKeyMessageEvent",
        "WebKitMediaKeySession",
        "WebKitMediaKeys",
        "WebKitMediaSource",
        "WebKitMutationObserver",
        "WebKitNamespace",
        "WebKitPlaybackTargetAvailabilityEvent",
        "WebKitPoint",
        "WebKitShadowRoot",
        "WebKitSourceBuffer",
        "WebKitSourceBufferList",
        "WebKitTransitionEvent",
        "WebSocket",
        "WebkitAlignContent",
        "WebkitAlignItems",
        "WebkitAlignSelf",
        "WebkitAnimation",
        "WebkitAnimationDelay",
        "WebkitAnimationDirection",
        "WebkitAnimationDuration",
        "WebkitAnimationFillMode",
        "WebkitAnimationIterationCount",
        "WebkitAnimationName",
        "WebkitAnimationPlayState",
        "WebkitAnimationTimingFunction",
        "WebkitAppearance",
        "WebkitBackfaceVisibility",
        "WebkitBackgroundClip",
        "WebkitBackgroundOrigin",
        "WebkitBackgroundSize",
        "WebkitBorderBottomLeftRadius",
        "WebkitBorderBottomRightRadius",
        "WebkitBorderImage",
        "WebkitBorderRadius",
        "WebkitBorderTopLeftRadius",
        "WebkitBorderTopRightRadius",
        "WebkitBoxAlign",
        "WebkitBoxDirection",
        "WebkitBoxFlex",
        "WebkitBoxOrdinalGroup",
        "WebkitBoxOrient",
        "WebkitBoxPack",
        "WebkitBoxShadow",
        "WebkitBoxSizing",
        "WebkitFilter",
        "WebkitFlex",
        "WebkitFlexBasis",
        "WebkitFlexDirection",
        "WebkitFlexFlow",
        "WebkitFlexGrow",
        "WebkitFlexShrink",
        "WebkitFlexWrap",
        "WebkitJustifyContent",
        "WebkitLineClamp",
        "WebkitMask",
        "WebkitMaskClip",
        "WebkitMaskComposite",
        "WebkitMaskImage",
        "WebkitMaskOrigin",
        "WebkitMaskPosition",
        "WebkitMaskPositionX",
        "WebkitMaskPositionY",
        "WebkitMaskRepeat",
        "WebkitMaskSize",
        "WebkitOrder",
        "WebkitPerspective",
        "WebkitPerspectiveOrigin",
        "WebkitTextFillColor",
        "WebkitTextSizeAdjust",
        "WebkitTextStroke",
        "WebkitTextStrokeColor",
        "WebkitTextStrokeWidth",
        "WebkitTransform",
        "WebkitTransformOrigin",
        "WebkitTransformStyle",
        "WebkitTransition",
        "WebkitTransitionDelay",
        "WebkitTransitionDuration",
        "WebkitTransitionProperty",
        "WebkitTransitionTimingFunction",
        "WebkitUserSelect",
        "WheelEvent",
        "Window",
        "Worker",
        "Worklet",
        "WritableStream",
        "WritableStreamDefaultWriter",
        "XMLDocument",
        "XMLHttpRequest",
        "XMLHttpRequestEventTarget",
        "XMLHttpRequestException",
        "XMLHttpRequestProgressEvent",
        "XMLHttpRequestUpload",
        "XMLSerializer",
        "XMLStylesheetProcessingInstruction",
        "XPathEvaluator",
        "XPathException",
        "XPathExpression",
        "XPathNSResolver",
        "XPathResult",
        "XRBoundedReferenceSpace",
        "XRDOMOverlayState",
        "XRFrame",
        "XRHitTestResult",
        "XRHitTestSource",
        "XRInputSource",
        "XRInputSourceArray",
        "XRInputSourceEvent",
        "XRInputSourcesChangeEvent",
        "XRLayer",
        "XRPose",
        "XRRay",
        "XRReferenceSpace",
        "XRReferenceSpaceEvent",
        "XRRenderState",
        "XRRigidTransform",
        "XRSession",
        "XRSessionEvent",
        "XRSpace",
        "XRSystem",
        "XRTransientInputHitTestResult",
        "XRTransientInputHitTestSource",
        "XRView",
        "XRViewerPose",
        "XRViewport",
        "XRWebGLLayer",
        "XSLTProcessor",
        "ZERO",
        "_XD0M_",
        "_YD0M_",
        "__defineGetter__",
        "__defineSetter__",
        "__lookupGetter__",
        "__lookupSetter__",
        "__opera",
        "__proto__",
        "_browserjsran",
        "a",
        "aLink",
        "abbr",
        "abort",
        "aborted",
        "abs",
        "absolute",
        "acceleration",
        "accelerationIncludingGravity",
        "accelerator",
        "accept",
        "acceptCharset",
        "acceptNode",
        "accessKey",
        "accessKeyLabel",
        "accuracy",
        "acos",
        "acosh",
        "action",
        "actionURL",
        "actions",
        "activated",
        "active",
        "activeCues",
        "activeElement",
        "activeSourceBuffers",
        "activeSourceCount",
        "activeTexture",
        "activeVRDisplays",
        "actualBoundingBoxAscent",
        "actualBoundingBoxDescent",
        "actualBoundingBoxLeft",
        "actualBoundingBoxRight",
        "add",
        "addAll",
        "addBehavior",
        "addCandidate",
        "addColorStop",
        "addCue",
        "addElement",
        "addEventListener",
        "addFilter",
        "addFromString",
        "addFromUri",
        "addIceCandidate",
        "addImport",
        "addListener",
        "addModule",
        "addNamed",
        "addPageRule",
        "addPath",
        "addPointer",
        "addRange",
        "addRegion",
        "addRule",
        "addSearchEngine",
        "addSourceBuffer",
        "addStream",
        "addTextTrack",
        "addTrack",
        "addTransceiver",
        "addWakeLockListener",
        "added",
        "addedNodes",
        "additionalName",
        "additiveSymbols",
        "addons",
        "address",
        "addressLine",
        "adoptNode",
        "adoptedStyleSheets",
        "adr",
        "advance",
        "after",
        "album",
        "alert",
        "algorithm",
        "align",
        "align-content",
        "align-items",
        "align-self",
        "alignContent",
        "alignItems",
        "alignSelf",
        "alignmentBaseline",
        "alinkColor",
        "all",
        "allSettled",
        "allow",
        "allowFullscreen",
        "allowPaymentRequest",
        "allowedDirections",
        "allowedFeatures",
        "allowedToPlay",
        "allowsFeature",
        "alpha",
        "alt",
        "altGraphKey",
        "altHtml",
        "altKey",
        "altLeft",
        "alternate",
        "alternateSetting",
        "alternates",
        "altitude",
        "altitudeAccuracy",
        "amplitude",
        "ancestorOrigins",
        "anchor",
        "anchorNode",
        "anchorOffset",
        "anchors",
        "and",
        "angle",
        "angularAcceleration",
        "angularVelocity",
        "animVal",
        "animate",
        "animatedInstanceRoot",
        "animatedNormalizedPathSegList",
        "animatedPathSegList",
        "animatedPoints",
        "animation",
        "animation-delay",
        "animation-direction",
        "animation-duration",
        "animation-fill-mode",
        "animation-iteration-count",
        "animation-name",
        "animation-play-state",
        "animation-timing-function",
        "animationDelay",
        "animationDirection",
        "animationDuration",
        "animationFillMode",
        "animationIterationCount",
        "animationName",
        "animationPlayState",
        "animationStartTime",
        "animationTimingFunction",
        "animationsPaused",
        "anniversary",
        "antialias",
        "anticipatedRemoval",
        "any",
        "app",
        "appCodeName",
        "appMinorVersion",
        "appName",
        "appNotifications",
        "appVersion",
        "appearance",
        "append",
        "appendBuffer",
        "appendChild",
        "appendData",
        "appendItem",
        "appendMedium",
        "appendNamed",
        "appendRule",
        "appendStream",
        "appendWindowEnd",
        "appendWindowStart",
        "applets",
        "applicationCache",
        "applicationServerKey",
        "apply",
        "applyConstraints",
        "applyElement",
        "arc",
        "arcTo",
        "archive",
        "areas",
        "arguments",
        "ariaAtomic",
        "ariaAutoComplete",
        "ariaBusy",
        "ariaChecked",
        "ariaColCount",
        "ariaColIndex",
        "ariaColSpan",
        "ariaCurrent",
        "ariaDescription",
        "ariaDisabled",
        "ariaExpanded",
        "ariaHasPopup",
        "ariaHidden",
        "ariaKeyShortcuts",
        "ariaLabel",
        "ariaLevel",
        "ariaLive",
        "ariaModal",
        "ariaMultiLine",
        "ariaMultiSelectable",
        "ariaOrientation",
        "ariaPlaceholder",
        "ariaPosInSet",
        "ariaPressed",
        "ariaReadOnly",
        "ariaRelevant",
        "ariaRequired",
        "ariaRoleDescription",
        "ariaRowCount",
        "ariaRowIndex",
        "ariaRowSpan",
        "ariaSelected",
        "ariaSetSize",
        "ariaSort",
        "ariaValueMax",
        "ariaValueMin",
        "ariaValueNow",
        "ariaValueText",
        "arrayBuffer",
        "artist",
        "artwork",
        "as",
        "asIntN",
        "asUintN",
        "asin",
        "asinh",
        "assert",
        "assign",
        "assignedElements",
        "assignedNodes",
        "assignedSlot",
        "async",
        "asyncIterator",
        "atEnd",
        "atan",
        "atan2",
        "atanh",
        "atob",
        "attachEvent",
        "attachInternals",
        "attachShader",
        "attachShadow",
        "attachments",
        "attack",
        "attestationObject",
        "attrChange",
        "attrName",
        "attributeFilter",
        "attributeName",
        "attributeNamespace",
        "attributeOldValue",
        "attributeStyleMap",
        "attributes",
        "attribution",
        "audioBitsPerSecond",
        "audioTracks",
        "audioWorklet",
        "authenticatedSignedWrites",
        "authenticatorData",
        "autoIncrement",
        "autobuffer",
        "autocapitalize",
        "autocomplete",
        "autocorrect",
        "autofocus",
        "automationRate",
        "autoplay",
        "availHeight",
        "availLeft",
        "availTop",
        "availWidth",
        "availability",
        "available",
        "aversion",
        "ax",
        "axes",
        "axis",
        "ay",
        "azimuth",
        "b",
        "back",
        "backface-visibility",
        "backfaceVisibility",
        "background",
        "background-attachment",
        "background-blend-mode",
        "background-clip",
        "background-color",
        "background-image",
        "background-origin",
        "background-position",
        "background-position-x",
        "background-position-y",
        "background-repeat",
        "background-size",
        "backgroundAttachment",
        "backgroundBlendMode",
        "backgroundClip",
        "backgroundColor",
        "backgroundFetch",
        "backgroundImage",
        "backgroundOrigin",
        "backgroundPosition",
        "backgroundPositionX",
        "backgroundPositionY",
        "backgroundRepeat",
        "backgroundSize",
        "badInput",
        "badge",
        "balance",
        "baseFrequencyX",
        "baseFrequencyY",
        "baseLatency",
        "baseLayer",
        "baseNode",
        "baseOffset",
        "baseURI",
        "baseVal",
        "baselineShift",
        "battery",
        "bday",
        "before",
        "beginElement",
        "beginElementAt",
        "beginPath",
        "beginQuery",
        "beginTransformFeedback",
        "behavior",
        "behaviorCookie",
        "behaviorPart",
        "behaviorUrns",
        "beta",
        "bezierCurveTo",
        "bgColor",
        "bgProperties",
        "bias",
        "big",
        "bigint64",
        "biguint64",
        "binaryType",
        "bind",
        "bindAttribLocation",
        "bindBuffer",
        "bindBufferBase",
        "bindBufferRange",
        "bindFramebuffer",
        "bindRenderbuffer",
        "bindSampler",
        "bindTexture",
        "bindTransformFeedback",
        "bindVertexArray",
        "blendColor",
        "blendEquation",
        "blendEquationSeparate",
        "blendFunc",
        "blendFuncSeparate",
        "blink",
        "blitFramebuffer",
        "blob",
        "block-size",
        "blockDirection",
        "blockSize",
        "blockedURI",
        "blue",
        "bluetooth",
        "blur",
        "body",
        "bodyUsed",
        "bold",
        "bookmarks",
        "booleanValue",
        "border",
        "border-block",
        "border-block-color",
        "border-block-end",
        "border-block-end-color",
        "border-block-end-style",
        "border-block-end-width",
        "border-block-start",
        "border-block-start-color",
        "border-block-start-style",
        "border-block-start-width",
        "border-block-style",
        "border-block-width",
        "border-bottom",
        "border-bottom-color",
        "border-bottom-left-radius",
        "border-bottom-right-radius",
        "border-bottom-style",
        "border-bottom-width",
        "border-collapse",
        "border-color",
        "border-end-end-radius",
        "border-end-start-radius",
        "border-image",
        "border-image-outset",
        "border-image-repeat",
        "border-image-slice",
        "border-image-source",
        "border-image-width",
        "border-inline",
        "border-inline-color",
        "border-inline-end",
        "border-inline-end-color",
        "border-inline-end-style",
        "border-inline-end-width",
        "border-inline-start",
        "border-inline-start-color",
        "border-inline-start-style",
        "border-inline-start-width",
        "border-inline-style",
        "border-inline-width",
        "border-left",
        "border-left-color",
        "border-left-style",
        "border-left-width",
        "border-radius",
        "border-right",
        "border-right-color",
        "border-right-style",
        "border-right-width",
        "border-spacing",
        "border-start-end-radius",
        "border-start-start-radius",
        "border-style",
        "border-top",
        "border-top-color",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-top-style",
        "border-top-width",
        "border-width",
        "borderBlock",
        "borderBlockColor",
        "borderBlockEnd",
        "borderBlockEndColor",
        "borderBlockEndStyle",
        "borderBlockEndWidth",
        "borderBlockStart",
        "borderBlockStartColor",
        "borderBlockStartStyle",
        "borderBlockStartWidth",
        "borderBlockStyle",
        "borderBlockWidth",
        "borderBottom",
        "borderBottomColor",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        "borderBottomStyle",
        "borderBottomWidth",
        "borderBoxSize",
        "borderCollapse",
        "borderColor",
        "borderColorDark",
        "borderColorLight",
        "borderEndEndRadius",
        "borderEndStartRadius",
        "borderImage",
        "borderImageOutset",
        "borderImageRepeat",
        "borderImageSlice",
        "borderImageSource",
        "borderImageWidth",
        "borderInline",
        "borderInlineColor",
        "borderInlineEnd",
        "borderInlineEndColor",
        "borderInlineEndStyle",
        "borderInlineEndWidth",
        "borderInlineStart",
        "borderInlineStartColor",
        "borderInlineStartStyle",
        "borderInlineStartWidth",
        "borderInlineStyle",
        "borderInlineWidth",
        "borderLeft",
        "borderLeftColor",
        "borderLeftStyle",
        "borderLeftWidth",
        "borderRadius",
        "borderRight",
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth",
        "borderSpacing",
        "borderStartEndRadius",
        "borderStartStartRadius",
        "borderStyle",
        "borderTop",
        "borderTopColor",
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderTopStyle",
        "borderTopWidth",
        "borderWidth",
        "bottom",
        "bottomMargin",
        "bound",
        "boundElements",
        "boundingClientRect",
        "boundingHeight",
        "boundingLeft",
        "boundingTop",
        "boundingWidth",
        "bounds",
        "boundsGeometry",
        "box-decoration-break",
        "box-shadow",
        "box-sizing",
        "boxDecorationBreak",
        "boxShadow",
        "boxSizing",
        "break-after",
        "break-before",
        "break-inside",
        "breakAfter",
        "breakBefore",
        "breakInside",
        "broadcast",
        "browserLanguage",
        "btoa",
        "bubbles",
        "buffer",
        "bufferData",
        "bufferDepth",
        "bufferSize",
        "bufferSubData",
        "buffered",
        "bufferedAmount",
        "bufferedAmountLowThreshold",
        "buildID",
        "buildNumber",
        "button",
        "buttonID",
        "buttons",
        "byteLength",
        "byteOffset",
        "bytesWritten",
        "c",
        "cache",
        "caches",
        "call",
        "caller",
        "canBeFormatted",
        "canBeMounted",
        "canBeShared",
        "canHaveChildren",
        "canHaveHTML",
        "canInsertDTMF",
        "canMakePayment",
        "canPlayType",
        "canPresent",
        "canTrickleIceCandidates",
        "cancel",
        "cancelAndHoldAtTime",
        "cancelAnimationFrame",
        "cancelBubble",
        "cancelIdleCallback",
        "cancelScheduledValues",
        "cancelVideoFrameCallback",
        "cancelWatchAvailability",
        "cancelable",
        "candidate",
        "canonicalUUID",
        "canvas",
        "capabilities",
        "caption",
        "caption-side",
        "captionSide",
        "capture",
        "captureEvents",
        "captureStackTrace",
        "captureStream",
        "caret-color",
        "caretBidiLevel",
        "caretColor",
        "caretPositionFromPoint",
        "caretRangeFromPoint",
        "cast",
        "catch",
        "category",
        "cbrt",
        "cd",
        "ceil",
        "cellIndex",
        "cellPadding",
        "cellSpacing",
        "cells",
        "ch",
        "chOff",
        "chain",
        "challenge",
        "changeType",
        "changedTouches",
        "channel",
        "channelCount",
        "channelCountMode",
        "channelInterpretation",
        "char",
        "charAt",
        "charCode",
        "charCodeAt",
        "charIndex",
        "charLength",
        "characterData",
        "characterDataOldValue",
        "characterSet",
        "characteristic",
        "charging",
        "chargingTime",
        "charset",
        "check",
        "checkEnclosure",
        "checkFramebufferStatus",
        "checkIntersection",
        "checkValidity",
        "checked",
        "childElementCount",
        "childList",
        "childNodes",
        "children",
        "chrome",
        "ciphertext",
        "cite",
        "city",
        "claimInterface",
        "claimed",
        "classList",
        "className",
        "classid",
        "clear",
        "clearAppBadge",
        "clearAttributes",
        "clearBufferfi",
        "clearBufferfv",
        "clearBufferiv",
        "clearBufferuiv",
        "clearColor",
        "clearData",
        "clearDepth",
        "clearHalt",
        "clearImmediate",
        "clearInterval",
        "clearLiveSeekableRange",
        "clearMarks",
        "clearMaxGCPauseAccumulator",
        "clearMeasures",
        "clearParameters",
        "clearRect",
        "clearResourceTimings",
        "clearShadow",
        "clearStencil",
        "clearTimeout",
        "clearWatch",
        "click",
        "clickCount",
        "clientDataJSON",
        "clientHeight",
        "clientInformation",
        "clientLeft",
        "clientRect",
        "clientRects",
        "clientTop",
        "clientWaitSync",
        "clientWidth",
        "clientX",
        "clientY",
        "clip",
        "clip-path",
        "clip-rule",
        "clipBottom",
        "clipLeft",
        "clipPath",
        "clipPathUnits",
        "clipRight",
        "clipRule",
        "clipTop",
        "clipboard",
        "clipboardData",
        "clone",
        "cloneContents",
        "cloneNode",
        "cloneRange",
        "close",
        "closePath",
        "closed",
        "closest",
        "clz",
        "clz32",
        "cm",
        "cmp",
        "code",
        "codeBase",
        "codePointAt",
        "codeType",
        "colSpan",
        "collapse",
        "collapseToEnd",
        "collapseToStart",
        "collapsed",
        "collect",
        "colno",
        "color",
        "color-adjust",
        "color-interpolation",
        "color-interpolation-filters",
        "colorAdjust",
        "colorDepth",
        "colorInterpolation",
        "colorInterpolationFilters",
        "colorMask",
        "colorType",
        "cols",
        "column-count",
        "column-fill",
        "column-gap",
        "column-rule",
        "column-rule-color",
        "column-rule-style",
        "column-rule-width",
        "column-span",
        "column-width",
        "columnCount",
        "columnFill",
        "columnGap",
        "columnNumber",
        "columnRule",
        "columnRuleColor",
        "columnRuleStyle",
        "columnRuleWidth",
        "columnSpan",
        "columnWidth",
        "columns",
        "command",
        "commit",
        "commitPreferences",
        "commitStyles",
        "commonAncestorContainer",
        "compact",
        "compareBoundaryPoints",
        "compareDocumentPosition",
        "compareEndPoints",
        "compareExchange",
        "compareNode",
        "comparePoint",
        "compatMode",
        "compatible",
        "compile",
        "compileShader",
        "compileStreaming",
        "complete",
        "component",
        "componentFromPoint",
        "composed",
        "composedPath",
        "composite",
        "compositionEndOffset",
        "compositionStartOffset",
        "compressedTexImage2D",
        "compressedTexImage3D",
        "compressedTexSubImage2D",
        "compressedTexSubImage3D",
        "computedStyleMap",
        "concat",
        "conditionText",
        "coneInnerAngle",
        "coneOuterAngle",
        "coneOuterGain",
        "configuration",
        "configurationName",
        "configurationValue",
        "configurations",
        "confirm",
        "confirmComposition",
        "confirmSiteSpecificTrackingException",
        "confirmWebWideTrackingException",
        "connect",
        "connectEnd",
        "connectShark",
        "connectStart",
        "connected",
        "connection",
        "connectionList",
        "connectionSpeed",
        "connectionState",
        "connections",
        "console",
        "consolidate",
        "constraint",
        "constrictionActive",
        "construct",
        "constructor",
        "contactID",
        "contain",
        "containerId",
        "containerName",
        "containerSrc",
        "containerType",
        "contains",
        "containsNode",
        "content",
        "contentBoxSize",
        "contentDocument",
        "contentEditable",
        "contentHint",
        "contentOverflow",
        "contentRect",
        "contentScriptType",
        "contentStyleType",
        "contentType",
        "contentWindow",
        "context",
        "contextMenu",
        "contextmenu",
        "continue",
        "continuePrimaryKey",
        "continuous",
        "control",
        "controlTransferIn",
        "controlTransferOut",
        "controller",
        "controls",
        "controlsList",
        "convertPointFromNode",
        "convertQuadFromNode",
        "convertRectFromNode",
        "convertToBlob",
        "convertToSpecifiedUnits",
        "cookie",
        "cookieEnabled",
        "coords",
        "copyBufferSubData",
        "copyFromChannel",
        "copyTexImage2D",
        "copyTexSubImage2D",
        "copyTexSubImage3D",
        "copyToChannel",
        "copyWithin",
        "correspondingElement",
        "correspondingUseElement",
        "corruptedVideoFrames",
        "cos",
        "cosh",
        "count",
        "countReset",
        "counter-increment",
        "counter-reset",
        "counter-set",
        "counterIncrement",
        "counterReset",
        "counterSet",
        "country",
        "cpuClass",
        "cpuSleepAllowed",
        "create",
        "createAnalyser",
        "createAnswer",
        "createAttribute",
        "createAttributeNS",
        "createBiquadFilter",
        "createBuffer",
        "createBufferSource",
        "createCDATASection",
        "createCSSStyleSheet",
        "createCaption",
        "createChannelMerger",
        "createChannelSplitter",
        "createComment",
        "createConstantSource",
        "createContextualFragment",
        "createControlRange",
        "createConvolver",
        "createDTMFSender",
        "createDataChannel",
        "createDelay",
        "createDelayNode",
        "createDocument",
        "createDocumentFragment",
        "createDocumentType",
        "createDynamicsCompressor",
        "createElement",
        "createElementNS",
        "createEntityReference",
        "createEvent",
        "createEventObject",
        "createExpression",
        "createFramebuffer",
        "createFunction",
        "createGain",
        "createGainNode",
        "createHTML",
        "createHTMLDocument",
        "createIIRFilter",
        "createImageBitmap",
        "createImageData",
        "createIndex",
        "createJavaScriptNode",
        "createLinearGradient",
        "createMediaElementSource",
        "createMediaKeys",
        "createMediaStreamDestination",
        "createMediaStreamSource",
        "createMediaStreamTrackSource",
        "createMutableFile",
        "createNSResolver",
        "createNodeIterator",
        "createNotification",
        "createObjectStore",
        "createObjectURL",
        "createOffer",
        "createOscillator",
        "createPanner",
        "createPattern",
        "createPeriodicWave",
        "createPolicy",
        "createPopup",
        "createProcessingInstruction",
        "createProgram",
        "createQuery",
        "createRadialGradient",
        "createRange",
        "createRangeCollection",
        "createReader",
        "createRenderbuffer",
        "createSVGAngle",
        "createSVGLength",
        "createSVGMatrix",
        "createSVGNumber",
        "createSVGPathSegArcAbs",
        "createSVGPathSegArcRel",
        "createSVGPathSegClosePath",
        "createSVGPathSegCurvetoCubicAbs",
        "createSVGPathSegCurvetoCubicRel",
        "createSVGPathSegCurvetoCubicSmoothAbs",
        "createSVGPathSegCurvetoCubicSmoothRel",
        "createSVGPathSegCurvetoQuadraticAbs",
        "createSVGPathSegCurvetoQuadraticRel",
        "createSVGPathSegCurvetoQuadraticSmoothAbs",
        "createSVGPathSegCurvetoQuadraticSmoothRel",
        "createSVGPathSegLinetoAbs",
        "createSVGPathSegLinetoHorizontalAbs",
        "createSVGPathSegLinetoHorizontalRel",
        "createSVGPathSegLinetoRel",
        "createSVGPathSegLinetoVerticalAbs",
        "createSVGPathSegLinetoVerticalRel",
        "createSVGPathSegMovetoAbs",
        "createSVGPathSegMovetoRel",
        "createSVGPoint",
        "createSVGRect",
        "createSVGTransform",
        "createSVGTransformFromMatrix",
        "createSampler",
        "createScript",
        "createScriptProcessor",
        "createScriptURL",
        "createSession",
        "createShader",
        "createShadowRoot",
        "createStereoPanner",
        "createStyleSheet",
        "createTBody",
        "createTFoot",
        "createTHead",
        "createTextNode",
        "createTextRange",
        "createTexture",
        "createTouch",
        "createTouchList",
        "createTransformFeedback",
        "createTreeWalker",
        "createVertexArray",
        "createWaveShaper",
        "creationTime",
        "credentials",
        "crossOrigin",
        "crossOriginIsolated",
        "crypto",
        "csi",
        "csp",
        "cssFloat",
        "cssRules",
        "cssText",
        "cssValueType",
        "ctrlKey",
        "ctrlLeft",
        "cues",
        "cullFace",
        "currentDirection",
        "currentLocalDescription",
        "currentNode",
        "currentPage",
        "currentRect",
        "currentRemoteDescription",
        "currentScale",
        "currentScript",
        "currentSrc",
        "currentState",
        "currentStyle",
        "currentTarget",
        "currentTime",
        "currentTranslate",
        "currentView",
        "cursor",
        "curve",
        "customElements",
        "customError",
        "cx",
        "cy",
        "d",
        "data",
        "dataFld",
        "dataFormatAs",
        "dataLoss",
        "dataLossMessage",
        "dataPageSize",
        "dataSrc",
        "dataTransfer",
        "database",
        "databases",
        "dataset",
        "dateTime",
        "db",
        "debug",
        "debuggerEnabled",
        "declare",
        "decode",
        "decodeAudioData",
        "decodeURI",
        "decodeURIComponent",
        "decodedBodySize",
        "decoding",
        "decodingInfo",
        "decrypt",
        "default",
        "defaultCharset",
        "defaultChecked",
        "defaultMuted",
        "defaultPlaybackRate",
        "defaultPolicy",
        "defaultPrevented",
        "defaultRequest",
        "defaultSelected",
        "defaultStatus",
        "defaultURL",
        "defaultValue",
        "defaultView",
        "defaultstatus",
        "defer",
        "define",
        "defineMagicFunction",
        "defineMagicVariable",
        "defineProperties",
        "defineProperty",
        "deg",
        "delay",
        "delayTime",
        "delegatesFocus",
        "delete",
        "deleteBuffer",
        "deleteCaption",
        "deleteCell",
        "deleteContents",
        "deleteData",
        "deleteDatabase",
        "deleteFramebuffer",
        "deleteFromDocument",
        "deleteIndex",
        "deleteMedium",
        "deleteObjectStore",
        "deleteProgram",
        "deleteProperty",
        "deleteQuery",
        "deleteRenderbuffer",
        "deleteRow",
        "deleteRule",
        "deleteSampler",
        "deleteShader",
        "deleteSync",
        "deleteTFoot",
        "deleteTHead",
        "deleteTexture",
        "deleteTransformFeedback",
        "deleteVertexArray",
        "deliverChangeRecords",
        "delivery",
        "deliveryInfo",
        "deliveryStatus",
        "deliveryTimestamp",
        "delta",
        "deltaMode",
        "deltaX",
        "deltaY",
        "deltaZ",
        "dependentLocality",
        "depthFar",
        "depthFunc",
        "depthMask",
        "depthNear",
        "depthRange",
        "deref",
        "deriveBits",
        "deriveKey",
        "description",
        "deselectAll",
        "designMode",
        "desiredSize",
        "destination",
        "destinationURL",
        "detach",
        "detachEvent",
        "detachShader",
        "detail",
        "details",
        "detect",
        "detune",
        "device",
        "deviceClass",
        "deviceId",
        "deviceMemory",
        "devicePixelContentBoxSize",
        "devicePixelRatio",
        "deviceProtocol",
        "deviceSubclass",
        "deviceVersionMajor",
        "deviceVersionMinor",
        "deviceVersionSubminor",
        "deviceXDPI",
        "deviceYDPI",
        "didTimeout",
        "diffuseConstant",
        "digest",
        "dimensions",
        "dir",
        "dirName",
        "direction",
        "dirxml",
        "disable",
        "disablePictureInPicture",
        "disableRemotePlayback",
        "disableVertexAttribArray",
        "disabled",
        "dischargingTime",
        "disconnect",
        "disconnectShark",
        "dispatchEvent",
        "display",
        "displayId",
        "displayName",
        "disposition",
        "distanceModel",
        "div",
        "divisor",
        "djsapi",
        "djsproxy",
        "doImport",
        "doNotTrack",
        "doScroll",
        "doctype",
        "document",
        "documentElement",
        "documentMode",
        "documentURI",
        "dolphin",
        "dolphinGameCenter",
        "dolphininfo",
        "dolphinmeta",
        "domComplete",
        "domContentLoadedEventEnd",
        "domContentLoadedEventStart",
        "domInteractive",
        "domLoading",
        "domOverlayState",
        "domain",
        "domainLookupEnd",
        "domainLookupStart",
        "dominant-baseline",
        "dominantBaseline",
        "done",
        "dopplerFactor",
        "dotAll",
        "downDegrees",
        "downlink",
        "download",
        "downloadTotal",
        "downloaded",
        "dpcm",
        "dpi",
        "dppx",
        "dragDrop",
        "draggable",
        "drawArrays",
        "drawArraysInstanced",
        "drawArraysInstancedANGLE",
        "drawBuffers",
        "drawCustomFocusRing",
        "drawElements",
        "drawElementsInstanced",
        "drawElementsInstancedANGLE",
        "drawFocusIfNeeded",
        "drawImage",
        "drawImageFromRect",
        "drawRangeElements",
        "drawSystemFocusRing",
        "drawingBufferHeight",
        "drawingBufferWidth",
        "dropEffect",
        "droppedVideoFrames",
        "dropzone",
        "dtmf",
        "dump",
        "dumpProfile",
        "duplicate",
        "durability",
        "duration",
        "dvname",
        "dvnum",
        "dx",
        "dy",
        "dynsrc",
        "e",
        "edgeMode",
        "effect",
        "effectAllowed",
        "effectiveDirective",
        "effectiveType",
        "elapsedTime",
        "element",
        "elementFromPoint",
        "elementTiming",
        "elements",
        "elementsFromPoint",
        "elevation",
        "ellipse",
        "em",
        "email",
        "embeds",
        "emma",
        "empty",
        "empty-cells",
        "emptyCells",
        "emptyHTML",
        "emptyScript",
        "emulatedPosition",
        "enable",
        "enableBackground",
        "enableDelegations",
        "enableStyleSheetsForSet",
        "enableVertexAttribArray",
        "enabled",
        "enabledPlugin",
        "encode",
        "encodeInto",
        "encodeURI",
        "encodeURIComponent",
        "encodedBodySize",
        "encoding",
        "encodingInfo",
        "encrypt",
        "enctype",
        "end",
        "endContainer",
        "endElement",
        "endElementAt",
        "endOfStream",
        "endOffset",
        "endQuery",
        "endTime",
        "endTransformFeedback",
        "ended",
        "endpoint",
        "endpointNumber",
        "endpoints",
        "endsWith",
        "enterKeyHint",
        "entities",
        "entries",
        "entryType",
        "enumerate",
        "enumerateDevices",
        "enumerateEditable",
        "environmentBlendMode",
        "equals",
        "error",
        "errorCode",
        "errorDetail",
        "errorText",
        "escape",
        "estimate",
        "eval",
        "evaluate",
        "event",
        "eventPhase",
        "every",
        "ex",
        "exception",
        "exchange",
        "exec",
        "execCommand",
        "execCommandShowHelp",
        "execScript",
        "exitFullscreen",
        "exitPictureInPicture",
        "exitPointerLock",
        "exitPresent",
        "exp",
        "expand",
        "expandEntityReferences",
        "expando",
        "expansion",
        "expiration",
        "expirationTime",
        "expires",
        "expiryDate",
        "explicitOriginalTarget",
        "expm1",
        "exponent",
        "exponentialRampToValueAtTime",
        "exportKey",
        "exports",
        "extend",
        "extensions",
        "extentNode",
        "extentOffset",
        "external",
        "externalResourcesRequired",
        "extractContents",
        "extractable",
        "eye",
        "f",
        "face",
        "factoryReset",
        "failureReason",
        "fallback",
        "family",
        "familyName",
        "farthestViewportElement",
        "fastSeek",
        "fatal",
        "featureId",
        "featurePolicy",
        "featureSettings",
        "features",
        "fenceSync",
        "fetch",
        "fetchStart",
        "fftSize",
        "fgColor",
        "fieldOfView",
        "file",
        "fileCreatedDate",
        "fileHandle",
        "fileModifiedDate",
        "fileName",
        "fileSize",
        "fileUpdatedDate",
        "filename",
        "files",
        "filesystem",
        "fill",
        "fill-opacity",
        "fill-rule",
        "fillLightMode",
        "fillOpacity",
        "fillRect",
        "fillRule",
        "fillStyle",
        "fillText",
        "filter",
        "filterResX",
        "filterResY",
        "filterUnits",
        "filters",
        "finally",
        "find",
        "findIndex",
        "findRule",
        "findText",
        "finish",
        "finished",
        "fireEvent",
        "firesTouchEvents",
        "firstChild",
        "firstElementChild",
        "firstPage",
        "fixed",
        "flags",
        "flat",
        "flatMap",
        "flex",
        "flex-basis",
        "flex-direction",
        "flex-flow",
        "flex-grow",
        "flex-shrink",
        "flex-wrap",
        "flexBasis",
        "flexDirection",
        "flexFlow",
        "flexGrow",
        "flexShrink",
        "flexWrap",
        "flipX",
        "flipY",
        "float",
        "float32",
        "float64",
        "flood-color",
        "flood-opacity",
        "floodColor",
        "floodOpacity",
        "floor",
        "flush",
        "focus",
        "focusNode",
        "focusOffset",
        "font",
        "font-family",
        "font-feature-settings",
        "font-kerning",
        "font-language-override",
        "font-optical-sizing",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-synthesis",
        "font-variant",
        "font-variant-alternates",
        "font-variant-caps",
        "font-variant-east-asian",
        "font-variant-ligatures",
        "font-variant-numeric",
        "font-variant-position",
        "font-variation-settings",
        "font-weight",
        "fontFamily",
        "fontFeatureSettings",
        "fontKerning",
        "fontLanguageOverride",
        "fontOpticalSizing",
        "fontSize",
        "fontSizeAdjust",
        "fontSmoothingEnabled",
        "fontStretch",
        "fontStyle",
        "fontSynthesis",
        "fontVariant",
        "fontVariantAlternates",
        "fontVariantCaps",
        "fontVariantEastAsian",
        "fontVariantLigatures",
        "fontVariantNumeric",
        "fontVariantPosition",
        "fontVariationSettings",
        "fontWeight",
        "fontcolor",
        "fontfaces",
        "fonts",
        "fontsize",
        "for",
        "forEach",
        "force",
        "forceRedraw",
        "form",
        "formAction",
        "formData",
        "formEnctype",
        "formMethod",
        "formNoValidate",
        "formTarget",
        "format",
        "formatToParts",
        "forms",
        "forward",
        "forwardX",
        "forwardY",
        "forwardZ",
        "foundation",
        "fr",
        "fragmentDirective",
        "frame",
        "frameBorder",
        "frameElement",
        "frameSpacing",
        "framebuffer",
        "framebufferHeight",
        "framebufferRenderbuffer",
        "framebufferTexture2D",
        "framebufferTextureLayer",
        "framebufferWidth",
        "frames",
        "freeSpace",
        "freeze",
        "frequency",
        "frequencyBinCount",
        "from",
        "fromCharCode",
        "fromCodePoint",
        "fromElement",
        "fromEntries",
        "fromFloat32Array",
        "fromFloat64Array",
        "fromMatrix",
        "fromPoint",
        "fromQuad",
        "fromRect",
        "frontFace",
        "fround",
        "fullPath",
        "fullScreen",
        "fullscreen",
        "fullscreenElement",
        "fullscreenEnabled",
        "fx",
        "fy",
        "gain",
        "gamepad",
        "gamma",
        "gap",
        "gatheringState",
        "gatt",
        "genderIdentity",
        "generateCertificate",
        "generateKey",
        "generateMipmap",
        "generateRequest",
        "geolocation",
        "gestureObject",
        "get",
        "getActiveAttrib",
        "getActiveUniform",
        "getActiveUniformBlockName",
        "getActiveUniformBlockParameter",
        "getActiveUniforms",
        "getAdjacentText",
        "getAll",
        "getAllKeys",
        "getAllResponseHeaders",
        "getAllowlistForFeature",
        "getAnimations",
        "getAsFile",
        "getAsString",
        "getAttachedShaders",
        "getAttribLocation",
        "getAttribute",
        "getAttributeNS",
        "getAttributeNames",
        "getAttributeNode",
        "getAttributeNodeNS",
        "getAttributeType",
        "getAudioTracks",
        "getAvailability",
        "getBBox",
        "getBattery",
        "getBigInt64",
        "getBigUint64",
        "getBlob",
        "getBookmark",
        "getBoundingClientRect",
        "getBounds",
        "getBoxQuads",
        "getBufferParameter",
        "getBufferSubData",
        "getByteFrequencyData",
        "getByteTimeDomainData",
        "getCSSCanvasContext",
        "getCTM",
        "getCandidateWindowClientRect",
        "getCanonicalLocales",
        "getCapabilities",
        "getChannelData",
        "getCharNumAtPosition",
        "getCharacteristic",
        "getCharacteristics",
        "getClientExtensionResults",
        "getClientRect",
        "getClientRects",
        "getCoalescedEvents",
        "getCompositionAlternatives",
        "getComputedStyle",
        "getComputedTextLength",
        "getComputedTiming",
        "getConfiguration",
        "getConstraints",
        "getContext",
        "getContextAttributes",
        "getContributingSources",
        "getCounterValue",
        "getCueAsHTML",
        "getCueById",
        "getCurrentPosition",
        "getCurrentTime",
        "getData",
        "getDatabaseNames",
        "getDate",
        "getDay",
        "getDefaultComputedStyle",
        "getDescriptor",
        "getDescriptors",
        "getDestinationInsertionPoints",
        "getDevices",
        "getDirectory",
        "getDisplayMedia",
        "getDistributedNodes",
        "getEditable",
        "getElementById",
        "getElementsByClassName",
        "getElementsByName",
        "getElementsByTagName",
        "getElementsByTagNameNS",
        "getEnclosureList",
        "getEndPositionOfChar",
        "getEntries",
        "getEntriesByName",
        "getEntriesByType",
        "getError",
        "getExtension",
        "getExtentOfChar",
        "getEyeParameters",
        "getFeature",
        "getFile",
        "getFiles",
        "getFilesAndDirectories",
        "getFingerprints",
        "getFloat32",
        "getFloat64",
        "getFloatFrequencyData",
        "getFloatTimeDomainData",
        "getFloatValue",
        "getFragDataLocation",
        "getFrameData",
        "getFramebufferAttachmentParameter",
        "getFrequencyResponse",
        "getFullYear",
        "getGamepads",
        "getHitTestResults",
        "getHitTestResultsForTransientInput",
        "getHours",
        "getIdentityAssertion",
        "getIds",
        "getImageData",
        "getIndexedParameter",
        "getInstalledRelatedApps",
        "getInt16",
        "getInt32",
        "getInt8",
        "getInternalformatParameter",
        "getIntersectionList",
        "getItem",
        "getItems",
        "getKey",
        "getKeyframes",
        "getLayers",
        "getLayoutMap",
        "getLineDash",
        "getLocalCandidates",
        "getLocalParameters",
        "getLocalStreams",
        "getMarks",
        "getMatchedCSSRules",
        "getMaxGCPauseSinceClear",
        "getMeasures",
        "getMetadata",
        "getMilliseconds",
        "getMinutes",
        "getModifierState",
        "getMonth",
        "getNamedItem",
        "getNamedItemNS",
        "getNativeFramebufferScaleFactor",
        "getNotifications",
        "getNotifier",
        "getNumberOfChars",
        "getOffsetReferenceSpace",
        "getOutputTimestamp",
        "getOverrideHistoryNavigationMode",
        "getOverrideStyle",
        "getOwnPropertyDescriptor",
        "getOwnPropertyDescriptors",
        "getOwnPropertyNames",
        "getOwnPropertySymbols",
        "getParameter",
        "getParameters",
        "getParent",
        "getPathSegAtLength",
        "getPhotoCapabilities",
        "getPhotoSettings",
        "getPointAtLength",
        "getPose",
        "getPredictedEvents",
        "getPreference",
        "getPreferenceDefault",
        "getPresentationAttribute",
        "getPreventDefault",
        "getPrimaryService",
        "getPrimaryServices",
        "getProgramInfoLog",
        "getProgramParameter",
        "getPropertyCSSValue",
        "getPropertyPriority",
        "getPropertyShorthand",
        "getPropertyType",
        "getPropertyValue",
        "getPrototypeOf",
        "getQuery",
        "getQueryParameter",
        "getRGBColorValue",
        "getRandomValues",
        "getRangeAt",
        "getReader",
        "getReceivers",
        "getRectValue",
        "getRegistration",
        "getRegistrations",
        "getRemoteCandidates",
        "getRemoteCertificates",
        "getRemoteParameters",
        "getRemoteStreams",
        "getRenderbufferParameter",
        "getResponseHeader",
        "getRoot",
        "getRootNode",
        "getRotationOfChar",
        "getSVGDocument",
        "getSamplerParameter",
        "getScreenCTM",
        "getSeconds",
        "getSelectedCandidatePair",
        "getSelection",
        "getSenders",
        "getService",
        "getSettings",
        "getShaderInfoLog",
        "getShaderParameter",
        "getShaderPrecisionFormat",
        "getShaderSource",
        "getSimpleDuration",
        "getSiteIcons",
        "getSources",
        "getSpeculativeParserUrls",
        "getStartPositionOfChar",
        "getStartTime",
        "getState",
        "getStats",
        "getStatusForPolicy",
        "getStorageUpdates",
        "getStreamById",
        "getStringValue",
        "getSubStringLength",
        "getSubscription",
        "getSupportedConstraints",
        "getSupportedExtensions",
        "getSupportedFormats",
        "getSyncParameter",
        "getSynchronizationSources",
        "getTags",
        "getTargetRanges",
        "getTexParameter",
        "getTime",
        "getTimezoneOffset",
        "getTiming",
        "getTotalLength",
        "getTrackById",
        "getTracks",
        "getTransceivers",
        "getTransform",
        "getTransformFeedbackVarying",
        "getTransformToElement",
        "getTransports",
        "getType",
        "getTypeMapping",
        "getUTCDate",
        "getUTCDay",
        "getUTCFullYear",
        "getUTCHours",
        "getUTCMilliseconds",
        "getUTCMinutes",
        "getUTCMonth",
        "getUTCSeconds",
        "getUint16",
        "getUint32",
        "getUint8",
        "getUniform",
        "getUniformBlockIndex",
        "getUniformIndices",
        "getUniformLocation",
        "getUserMedia",
        "getVRDisplays",
        "getValues",
        "getVarDate",
        "getVariableValue",
        "getVertexAttrib",
        "getVertexAttribOffset",
        "getVideoPlaybackQuality",
        "getVideoTracks",
        "getViewerPose",
        "getViewport",
        "getVoices",
        "getWakeLockState",
        "getWriter",
        "getYear",
        "givenName",
        "global",
        "globalAlpha",
        "globalCompositeOperation",
        "globalThis",
        "glyphOrientationHorizontal",
        "glyphOrientationVertical",
        "glyphRef",
        "go",
        "grabFrame",
        "grad",
        "gradientTransform",
        "gradientUnits",
        "grammars",
        "green",
        "grid",
        "grid-area",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-auto-rows",
        "grid-column",
        "grid-column-end",
        "grid-column-gap",
        "grid-column-start",
        "grid-gap",
        "grid-row",
        "grid-row-end",
        "grid-row-gap",
        "grid-row-start",
        "grid-template",
        "grid-template-areas",
        "grid-template-columns",
        "grid-template-rows",
        "gridArea",
        "gridAutoColumns",
        "gridAutoFlow",
        "gridAutoRows",
        "gridColumn",
        "gridColumnEnd",
        "gridColumnGap",
        "gridColumnStart",
        "gridGap",
        "gridRow",
        "gridRowEnd",
        "gridRowGap",
        "gridRowStart",
        "gridTemplate",
        "gridTemplateAreas",
        "gridTemplateColumns",
        "gridTemplateRows",
        "gripSpace",
        "group",
        "groupCollapsed",
        "groupEnd",
        "groupId",
        "hadRecentInput",
        "hand",
        "handedness",
        "hapticActuators",
        "hardwareConcurrency",
        "has",
        "hasAttribute",
        "hasAttributeNS",
        "hasAttributes",
        "hasBeenActive",
        "hasChildNodes",
        "hasComposition",
        "hasEnrolledInstrument",
        "hasExtension",
        "hasExternalDisplay",
        "hasFeature",
        "hasFocus",
        "hasInstance",
        "hasLayout",
        "hasOrientation",
        "hasOwnProperty",
        "hasPointerCapture",
        "hasPosition",
        "hasReading",
        "hasStorageAccess",
        "hash",
        "head",
        "headers",
        "heading",
        "height",
        "hidden",
        "hide",
        "hideFocus",
        "high",
        "highWaterMark",
        "hint",
        "history",
        "honorificPrefix",
        "honorificSuffix",
        "horizontalOverflow",
        "host",
        "hostCandidate",
        "hostname",
        "href",
        "hrefTranslate",
        "hreflang",
        "hspace",
        "html5TagCheckInerface",
        "htmlFor",
        "htmlText",
        "httpEquiv",
        "httpRequestStatusCode",
        "hwTimestamp",
        "hyphens",
        "hypot",
        "iccId",
        "iceConnectionState",
        "iceGatheringState",
        "iceTransport",
        "icon",
        "iconURL",
        "id",
        "identifier",
        "identity",
        "idpLoginUrl",
        "ignoreBOM",
        "ignoreCase",
        "ignoreDepthValues",
        "image-orientation",
        "image-rendering",
        "imageHeight",
        "imageOrientation",
        "imageRendering",
        "imageSizes",
        "imageSmoothingEnabled",
        "imageSmoothingQuality",
        "imageSrcset",
        "imageWidth",
        "images",
        "ime-mode",
        "imeMode",
        "implementation",
        "importKey",
        "importNode",
        "importStylesheet",
        "imports",
        "impp",
        "imul",
        "in",
        "in1",
        "in2",
        "inBandMetadataTrackDispatchType",
        "inRange",
        "includes",
        "incremental",
        "indeterminate",
        "index",
        "indexNames",
        "indexOf",
        "indexedDB",
        "indicate",
        "inertiaDestinationX",
        "inertiaDestinationY",
        "info",
        "init",
        "initAnimationEvent",
        "initBeforeLoadEvent",
        "initClipboardEvent",
        "initCloseEvent",
        "initCommandEvent",
        "initCompositionEvent",
        "initCustomEvent",
        "initData",
        "initDataType",
        "initDeviceMotionEvent",
        "initDeviceOrientationEvent",
        "initDragEvent",
        "initErrorEvent",
        "initEvent",
        "initFocusEvent",
        "initGestureEvent",
        "initHashChangeEvent",
        "initKeyEvent",
        "initKeyboardEvent",
        "initMSManipulationEvent",
        "initMessageEvent",
        "initMouseEvent",
        "initMouseScrollEvent",
        "initMouseWheelEvent",
        "initMutationEvent",
        "initNSMouseEvent",
        "initOverflowEvent",
        "initPageEvent",
        "initPageTransitionEvent",
        "initPointerEvent",
        "initPopStateEvent",
        "initProgressEvent",
        "initScrollAreaEvent",
        "initSimpleGestureEvent",
        "initStorageEvent",
        "initTextEvent",
        "initTimeEvent",
        "initTouchEvent",
        "initTransitionEvent",
        "initUIEvent",
        "initWebKitAnimationEvent",
        "initWebKitTransitionEvent",
        "initWebKitWheelEvent",
        "initWheelEvent",
        "initialTime",
        "initialize",
        "initiatorType",
        "inline-size",
        "inlineSize",
        "inlineVerticalFieldOfView",
        "inner",
        "innerHTML",
        "innerHeight",
        "innerText",
        "innerWidth",
        "input",
        "inputBuffer",
        "inputEncoding",
        "inputMethod",
        "inputMode",
        "inputSource",
        "inputSources",
        "inputType",
        "inputs",
        "insertAdjacentElement",
        "insertAdjacentHTML",
        "insertAdjacentText",
        "insertBefore",
        "insertCell",
        "insertDTMF",
        "insertData",
        "insertItemBefore",
        "insertNode",
        "insertRow",
        "insertRule",
        "inset",
        "inset-block",
        "inset-block-end",
        "inset-block-start",
        "inset-inline",
        "inset-inline-end",
        "inset-inline-start",
        "insetBlock",
        "insetBlockEnd",
        "insetBlockStart",
        "insetInline",
        "insetInlineEnd",
        "insetInlineStart",
        "installing",
        "instanceRoot",
        "instantiate",
        "instantiateStreaming",
        "instruments",
        "int16",
        "int32",
        "int8",
        "integrity",
        "interactionMode",
        "intercept",
        "interfaceClass",
        "interfaceName",
        "interfaceNumber",
        "interfaceProtocol",
        "interfaceSubclass",
        "interfaces",
        "interimResults",
        "internalSubset",
        "interpretation",
        "intersectionRatio",
        "intersectionRect",
        "intersectsNode",
        "interval",
        "invalidIteratorState",
        "invalidateFramebuffer",
        "invalidateSubFramebuffer",
        "inverse",
        "invertSelf",
        "is",
        "is2D",
        "isActive",
        "isAlternate",
        "isArray",
        "isBingCurrentSearchDefault",
        "isBuffer",
        "isCandidateWindowVisible",
        "isChar",
        "isCollapsed",
        "isComposing",
        "isConcatSpreadable",
        "isConnected",
        "isContentEditable",
        "isContentHandlerRegistered",
        "isContextLost",
        "isDefaultNamespace",
        "isDirectory",
        "isDisabled",
        "isEnabled",
        "isEqual",
        "isEqualNode",
        "isExtensible",
        "isExternalCTAP2SecurityKeySupported",
        "isFile",
        "isFinite",
        "isFramebuffer",
        "isFrozen",
        "isGenerator",
        "isHTML",
        "isHistoryNavigation",
        "isId",
        "isIdentity",
        "isInjected",
        "isInteger",
        "isIntersecting",
        "isLockFree",
        "isMap",
        "isMultiLine",
        "isNaN",
        "isOpen",
        "isPointInFill",
        "isPointInPath",
        "isPointInRange",
        "isPointInStroke",
        "isPrefAlternate",
        "isPresenting",
        "isPrimary",
        "isProgram",
        "isPropertyImplicit",
        "isProtocolHandlerRegistered",
        "isPrototypeOf",
        "isQuery",
        "isRenderbuffer",
        "isSafeInteger",
        "isSameNode",
        "isSampler",
        "isScript",
        "isScriptURL",
        "isSealed",
        "isSecureContext",
        "isSessionSupported",
        "isShader",
        "isSupported",
        "isSync",
        "isTextEdit",
        "isTexture",
        "isTransformFeedback",
        "isTrusted",
        "isTypeSupported",
        "isUserVerifyingPlatformAuthenticatorAvailable",
        "isVertexArray",
        "isView",
        "isVisible",
        "isochronousTransferIn",
        "isochronousTransferOut",
        "isolation",
        "italics",
        "item",
        "itemId",
        "itemProp",
        "itemRef",
        "itemScope",
        "itemType",
        "itemValue",
        "items",
        "iterateNext",
        "iterationComposite",
        "iterator",
        "javaEnabled",
        "jobTitle",
        "join",
        "json",
        "justify-content",
        "justify-items",
        "justify-self",
        "justifyContent",
        "justifyItems",
        "justifySelf",
        "k1",
        "k2",
        "k3",
        "k4",
        "kHz",
        "keepalive",
        "kernelMatrix",
        "kernelUnitLengthX",
        "kernelUnitLengthY",
        "kerning",
        "key",
        "keyCode",
        "keyFor",
        "keyIdentifier",
        "keyLightEnabled",
        "keyLocation",
        "keyPath",
        "keyStatuses",
        "keySystem",
        "keyText",
        "keyUsage",
        "keyboard",
        "keys",
        "keytype",
        "kind",
        "knee",
        "label",
        "labels",
        "lang",
        "language",
        "languages",
        "largeArcFlag",
        "lastChild",
        "lastElementChild",
        "lastEventId",
        "lastIndex",
        "lastIndexOf",
        "lastInputTime",
        "lastMatch",
        "lastMessageSubject",
        "lastMessageType",
        "lastModified",
        "lastModifiedDate",
        "lastPage",
        "lastParen",
        "lastState",
        "lastStyleSheetSet",
        "latitude",
        "layerX",
        "layerY",
        "layoutFlow",
        "layoutGrid",
        "layoutGridChar",
        "layoutGridLine",
        "layoutGridMode",
        "layoutGridType",
        "lbound",
        "left",
        "leftContext",
        "leftDegrees",
        "leftMargin",
        "leftProjectionMatrix",
        "leftViewMatrix",
        "length",
        "lengthAdjust",
        "lengthComputable",
        "letter-spacing",
        "letterSpacing",
        "level",
        "lighting-color",
        "lightingColor",
        "limitingConeAngle",
        "line",
        "line-break",
        "line-height",
        "lineAlign",
        "lineBreak",
        "lineCap",
        "lineDashOffset",
        "lineHeight",
        "lineJoin",
        "lineNumber",
        "lineTo",
        "lineWidth",
        "linearAcceleration",
        "linearRampToValueAtTime",
        "linearVelocity",
        "lineno",
        "lines",
        "link",
        "linkColor",
        "linkProgram",
        "links",
        "list",
        "list-style",
        "list-style-image",
        "list-style-position",
        "list-style-type",
        "listStyle",
        "listStyleImage",
        "listStylePosition",
        "listStyleType",
        "listener",
        "load",
        "loadEventEnd",
        "loadEventStart",
        "loadTime",
        "loadTimes",
        "loaded",
        "loading",
        "localDescription",
        "localName",
        "localService",
        "localStorage",
        "locale",
        "localeCompare",
        "location",
        "locationbar",
        "lock",
        "locked",
        "lockedFile",
        "locks",
        "log",
        "log10",
        "log1p",
        "log2",
        "logicalXDPI",
        "logicalYDPI",
        "longDesc",
        "longitude",
        "lookupNamespaceURI",
        "lookupPrefix",
        "loop",
        "loopEnd",
        "loopStart",
        "looping",
        "low",
        "lower",
        "lowerBound",
        "lowerOpen",
        "lowsrc",
        "m11",
        "m12",
        "m13",
        "m14",
        "m21",
        "m22",
        "m23",
        "m24",
        "m31",
        "m32",
        "m33",
        "m34",
        "m41",
        "m42",
        "m43",
        "m44",
        "makeXRCompatible",
        "manifest",
        "manufacturer",
        "manufacturerName",
        "map",
        "mapping",
        "margin",
        "margin-block",
        "margin-block-end",
        "margin-block-start",
        "margin-bottom",
        "margin-inline",
        "margin-inline-end",
        "margin-inline-start",
        "margin-left",
        "margin-right",
        "margin-top",
        "marginBlock",
        "marginBlockEnd",
        "marginBlockStart",
        "marginBottom",
        "marginHeight",
        "marginInline",
        "marginInlineEnd",
        "marginInlineStart",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginWidth",
        "mark",
        "marker",
        "marker-end",
        "marker-mid",
        "marker-offset",
        "marker-start",
        "markerEnd",
        "markerHeight",
        "markerMid",
        "markerOffset",
        "markerStart",
        "markerUnits",
        "markerWidth",
        "marks",
        "mask",
        "mask-clip",
        "mask-composite",
        "mask-image",
        "mask-mode",
        "mask-origin",
        "mask-position",
        "mask-position-x",
        "mask-position-y",
        "mask-repeat",
        "mask-size",
        "mask-type",
        "maskClip",
        "maskComposite",
        "maskContentUnits",
        "maskImage",
        "maskMode",
        "maskOrigin",
        "maskPosition",
        "maskPositionX",
        "maskPositionY",
        "maskRepeat",
        "maskSize",
        "maskType",
        "maskUnits",
        "match",
        "matchAll",
        "matchMedia",
        "matchMedium",
        "matches",
        "matrix",
        "matrixTransform",
        "max",
        "max-block-size",
        "max-height",
        "max-inline-size",
        "max-width",
        "maxActions",
        "maxAlternatives",
        "maxBlockSize",
        "maxChannelCount",
        "maxChannels",
        "maxConnectionsPerServer",
        "maxDecibels",
        "maxDistance",
        "maxHeight",
        "maxInlineSize",
        "maxLayers",
        "maxLength",
        "maxMessageSize",
        "maxPacketLifeTime",
        "maxRetransmits",
        "maxTouchPoints",
        "maxValue",
        "maxWidth",
        "measure",
        "measureText",
        "media",
        "mediaCapabilities",
        "mediaDevices",
        "mediaElement",
        "mediaGroup",
        "mediaKeys",
        "mediaSession",
        "mediaStream",
        "mediaText",
        "meetOrSlice",
        "memory",
        "menubar",
        "mergeAttributes",
        "message",
        "messageClass",
        "messageHandlers",
        "messageType",
        "metaKey",
        "metadata",
        "method",
        "methodDetails",
        "methodName",
        "mid",
        "mimeType",
        "mimeTypes",
        "min",
        "min-block-size",
        "min-height",
        "min-inline-size",
        "min-width",
        "minBlockSize",
        "minDecibels",
        "minHeight",
        "minInlineSize",
        "minLength",
        "minValue",
        "minWidth",
        "miterLimit",
        "mix-blend-mode",
        "mixBlendMode",
        "mm",
        "mode",
        "modify",
        "mount",
        "move",
        "moveBy",
        "moveEnd",
        "moveFirst",
        "moveFocusDown",
        "moveFocusLeft",
        "moveFocusRight",
        "moveFocusUp",
        "moveNext",
        "moveRow",
        "moveStart",
        "moveTo",
        "moveToBookmark",
        "moveToElementText",
        "moveToPoint",
        "movementX",
        "movementY",
        "mozAdd",
        "mozAnimationStartTime",
        "mozAnon",
        "mozApps",
        "mozAudioCaptured",
        "mozAudioChannelType",
        "mozAutoplayEnabled",
        "mozCancelAnimationFrame",
        "mozCancelFullScreen",
        "mozCancelRequestAnimationFrame",
        "mozCaptureStream",
        "mozCaptureStreamUntilEnded",
        "mozClearDataAt",
        "mozContact",
        "mozContacts",
        "mozCreateFileHandle",
        "mozCurrentTransform",
        "mozCurrentTransformInverse",
        "mozCursor",
        "mozDash",
        "mozDashOffset",
        "mozDecodedFrames",
        "mozExitPointerLock",
        "mozFillRule",
        "mozFragmentEnd",
        "mozFrameDelay",
        "mozFullScreen",
        "mozFullScreenElement",
        "mozFullScreenEnabled",
        "mozGetAll",
        "mozGetAllKeys",
        "mozGetAsFile",
        "mozGetDataAt",
        "mozGetMetadata",
        "mozGetUserMedia",
        "mozHasAudio",
        "mozHasItem",
        "mozHidden",
        "mozImageSmoothingEnabled",
        "mozIndexedDB",
        "mozInnerScreenX",
        "mozInnerScreenY",
        "mozInputSource",
        "mozIsTextField",
        "mozItem",
        "mozItemCount",
        "mozItems",
        "mozLength",
        "mozLockOrientation",
        "mozMatchesSelector",
        "mozMovementX",
        "mozMovementY",
        "mozOpaque",
        "mozOrientation",
        "mozPaintCount",
        "mozPaintedFrames",
        "mozParsedFrames",
        "mozPay",
        "mozPointerLockElement",
        "mozPresentedFrames",
        "mozPreservesPitch",
        "mozPressure",
        "mozPrintCallback",
        "mozRTCIceCandidate",
        "mozRTCPeerConnection",
        "mozRTCSessionDescription",
        "mozRemove",
        "mozRequestAnimationFrame",
        "mozRequestFullScreen",
        "mozRequestPointerLock",
        "mozSetDataAt",
        "mozSetImageElement",
        "mozSourceNode",
        "mozSrcObject",
        "mozSystem",
        "mozTCPSocket",
        "mozTextStyle",
        "mozTypesAt",
        "mozUnlockOrientation",
        "mozUserCancelled",
        "mozVisibilityState",
        "ms",
        "msAnimation",
        "msAnimationDelay",
        "msAnimationDirection",
        "msAnimationDuration",
        "msAnimationFillMode",
        "msAnimationIterationCount",
        "msAnimationName",
        "msAnimationPlayState",
        "msAnimationStartTime",
        "msAnimationTimingFunction",
        "msBackfaceVisibility",
        "msBlockProgression",
        "msCSSOMElementFloatMetrics",
        "msCaching",
        "msCachingEnabled",
        "msCancelRequestAnimationFrame",
        "msCapsLockWarningOff",
        "msClearImmediate",
        "msClose",
        "msContentZoomChaining",
        "msContentZoomFactor",
        "msContentZoomLimit",
        "msContentZoomLimitMax",
        "msContentZoomLimitMin",
        "msContentZoomSnap",
        "msContentZoomSnapPoints",
        "msContentZoomSnapType",
        "msContentZooming",
        "msConvertURL",
        "msCrypto",
        "msDoNotTrack",
        "msElementsFromPoint",
        "msElementsFromRect",
        "msExitFullscreen",
        "msExtendedCode",
        "msFillRule",
        "msFirstPaint",
        "msFlex",
        "msFlexAlign",
        "msFlexDirection",
        "msFlexFlow",
        "msFlexItemAlign",
        "msFlexLinePack",
        "msFlexNegative",
        "msFlexOrder",
        "msFlexPack",
        "msFlexPositive",
        "msFlexPreferredSize",
        "msFlexWrap",
        "msFlowFrom",
        "msFlowInto",
        "msFontFeatureSettings",
        "msFullscreenElement",
        "msFullscreenEnabled",
        "msGetInputContext",
        "msGetRegionContent",
        "msGetUntransformedBounds",
        "msGraphicsTrustStatus",
        "msGridColumn",
        "msGridColumnAlign",
        "msGridColumnSpan",
        "msGridColumns",
        "msGridRow",
        "msGridRowAlign",
        "msGridRowSpan",
        "msGridRows",
        "msHidden",
        "msHighContrastAdjust",
        "msHyphenateLimitChars",
        "msHyphenateLimitLines",
        "msHyphenateLimitZone",
        "msHyphens",
        "msImageSmoothingEnabled",
        "msImeAlign",
        "msIndexedDB",
        "msInterpolationMode",
        "msIsStaticHTML",
        "msKeySystem",
        "msKeys",
        "msLaunchUri",
        "msLockOrientation",
        "msManipulationViewsEnabled",
        "msMatchMedia",
        "msMatchesSelector",
        "msMaxTouchPoints",
        "msOrientation",
        "msOverflowStyle",
        "msPerspective",
        "msPerspectiveOrigin",
        "msPlayToDisabled",
        "msPlayToPreferredSourceUri",
        "msPlayToPrimary",
        "msPointerEnabled",
        "msRegionOverflow",
        "msReleasePointerCapture",
        "msRequestAnimationFrame",
        "msRequestFullscreen",
        "msSaveBlob",
        "msSaveOrOpenBlob",
        "msScrollChaining",
        "msScrollLimit",
        "msScrollLimitXMax",
        "msScrollLimitXMin",
        "msScrollLimitYMax",
        "msScrollLimitYMin",
        "msScrollRails",
        "msScrollSnapPointsX",
        "msScrollSnapPointsY",
        "msScrollSnapType",
        "msScrollSnapX",
        "msScrollSnapY",
        "msScrollTranslation",
        "msSetImmediate",
        "msSetMediaKeys",
        "msSetPointerCapture",
        "msTextCombineHorizontal",
        "msTextSizeAdjust",
        "msToBlob",
        "msTouchAction",
        "msTouchSelect",
        "msTraceAsyncCallbackCompleted",
        "msTraceAsyncCallbackStarting",
        "msTraceAsyncOperationCompleted",
        "msTraceAsyncOperationStarting",
        "msTransform",
        "msTransformOrigin",
        "msTransformStyle",
        "msTransition",
        "msTransitionDelay",
        "msTransitionDuration",
        "msTransitionProperty",
        "msTransitionTimingFunction",
        "msUnlockOrientation",
        "msUpdateAsyncCallbackRelation",
        "msUserSelect",
        "msVisibilityState",
        "msWrapFlow",
        "msWrapMargin",
        "msWrapThrough",
        "msWriteProfilerMark",
        "msZoom",
        "msZoomTo",
        "mt",
        "mul",
        "multiEntry",
        "multiSelectionObj",
        "multiline",
        "multiple",
        "multiply",
        "multiplySelf",
        "mutableFile",
        "muted",
        "n",
        "name",
        "nameProp",
        "namedItem",
        "namedRecordset",
        "names",
        "namespaceURI",
        "namespaces",
        "naturalHeight",
        "naturalWidth",
        "navigate",
        "navigation",
        "navigationMode",
        "navigationPreload",
        "navigationStart",
        "navigator",
        "near",
        "nearestViewportElement",
        "negative",
        "negotiated",
        "netscape",
        "networkState",
        "newScale",
        "newTranslate",
        "newURL",
        "newValue",
        "newValueSpecifiedUnits",
        "newVersion",
        "newhome",
        "next",
        "nextElementSibling",
        "nextHopProtocol",
        "nextNode",
        "nextPage",
        "nextSibling",
        "nickname",
        "noHref",
        "noModule",
        "noResize",
        "noShade",
        "noValidate",
        "noWrap",
        "node",
        "nodeName",
        "nodeType",
        "nodeValue",
        "nonce",
        "normalize",
        "normalizedPathSegList",
        "notationName",
        "notations",
        "note",
        "noteGrainOn",
        "noteOff",
        "noteOn",
        "notify",
        "now",
        "numOctaves",
        "number",
        "numberOfChannels",
        "numberOfInputs",
        "numberOfItems",
        "numberOfOutputs",
        "numberValue",
        "oMatchesSelector",
        "object",
        "object-fit",
        "object-position",
        "objectFit",
        "objectPosition",
        "objectStore",
        "objectStoreNames",
        "objectType",
        "observe",
        "of",
        "offscreenBuffering",
        "offset",
        "offset-anchor",
        "offset-distance",
        "offset-path",
        "offset-rotate",
        "offsetAnchor",
        "offsetDistance",
        "offsetHeight",
        "offsetLeft",
        "offsetNode",
        "offsetParent",
        "offsetPath",
        "offsetRotate",
        "offsetTop",
        "offsetWidth",
        "offsetX",
        "offsetY",
        "ok",
        "oldURL",
        "oldValue",
        "oldVersion",
        "olderShadowRoot",
        "onLine",
        "onabort",
        "onabsolutedeviceorientation",
        "onactivate",
        "onactive",
        "onaddsourcebuffer",
        "onaddstream",
        "onaddtrack",
        "onafterprint",
        "onafterscriptexecute",
        "onafterupdate",
        "onanimationcancel",
        "onanimationend",
        "onanimationiteration",
        "onanimationstart",
        "onappinstalled",
        "onaudioend",
        "onaudioprocess",
        "onaudiostart",
        "onautocomplete",
        "onautocompleteerror",
        "onauxclick",
        "onbeforeactivate",
        "onbeforecopy",
        "onbeforecut",
        "onbeforedeactivate",
        "onbeforeeditfocus",
        "onbeforeinstallprompt",
        "onbeforepaste",
        "onbeforeprint",
        "onbeforescriptexecute",
        "onbeforeunload",
        "onbeforeupdate",
        "onbeforexrselect",
        "onbegin",
        "onblocked",
        "onblur",
        "onbounce",
        "onboundary",
        "onbufferedamountlow",
        "oncached",
        "oncancel",
        "oncandidatewindowhide",
        "oncandidatewindowshow",
        "oncandidatewindowupdate",
        "oncanplay",
        "oncanplaythrough",
        "once",
        "oncellchange",
        "onchange",
        "oncharacteristicvaluechanged",
        "onchargingchange",
        "onchargingtimechange",
        "onchecking",
        "onclick",
        "onclose",
        "onclosing",
        "oncompassneedscalibration",
        "oncomplete",
        "onconnect",
        "onconnecting",
        "onconnectionavailable",
        "onconnectionstatechange",
        "oncontextmenu",
        "oncontrollerchange",
        "oncontrolselect",
        "oncopy",
        "oncuechange",
        "oncut",
        "ondataavailable",
        "ondatachannel",
        "ondatasetchanged",
        "ondatasetcomplete",
        "ondblclick",
        "ondeactivate",
        "ondevicechange",
        "ondevicelight",
        "ondevicemotion",
        "ondeviceorientation",
        "ondeviceorientationabsolute",
        "ondeviceproximity",
        "ondischargingtimechange",
        "ondisconnect",
        "ondisplay",
        "ondownloading",
        "ondrag",
        "ondragend",
        "ondragenter",
        "ondragexit",
        "ondragleave",
        "ondragover",
        "ondragstart",
        "ondrop",
        "ondurationchange",
        "onemptied",
        "onencrypted",
        "onend",
        "onended",
        "onenter",
        "onenterpictureinpicture",
        "onerror",
        "onerrorupdate",
        "onexit",
        "onfilterchange",
        "onfinish",
        "onfocus",
        "onfocusin",
        "onfocusout",
        "onformdata",
        "onfreeze",
        "onfullscreenchange",
        "onfullscreenerror",
        "ongatheringstatechange",
        "ongattserverdisconnected",
        "ongesturechange",
        "ongestureend",
        "ongesturestart",
        "ongotpointercapture",
        "onhashchange",
        "onhelp",
        "onicecandidate",
        "onicecandidateerror",
        "oniceconnectionstatechange",
        "onicegatheringstatechange",
        "oninactive",
        "oninput",
        "oninputsourceschange",
        "oninvalid",
        "onkeydown",
        "onkeypress",
        "onkeystatuseschange",
        "onkeyup",
        "onlanguagechange",
        "onlayoutcomplete",
        "onleavepictureinpicture",
        "onlevelchange",
        "onload",
        "onloadeddata",
        "onloadedmetadata",
        "onloadend",
        "onloading",
        "onloadingdone",
        "onloadingerror",
        "onloadstart",
        "onlosecapture",
        "onlostpointercapture",
        "only",
        "onmark",
        "onmessage",
        "onmessageerror",
        "onmidimessage",
        "onmousedown",
        "onmouseenter",
        "onmouseleave",
        "onmousemove",
        "onmouseout",
        "onmouseover",
        "onmouseup",
        "onmousewheel",
        "onmove",
        "onmoveend",
        "onmovestart",
        "onmozfullscreenchange",
        "onmozfullscreenerror",
        "onmozorientationchange",
        "onmozpointerlockchange",
        "onmozpointerlockerror",
        "onmscontentzoom",
        "onmsfullscreenchange",
        "onmsfullscreenerror",
        "onmsgesturechange",
        "onmsgesturedoubletap",
        "onmsgestureend",
        "onmsgesturehold",
        "onmsgesturestart",
        "onmsgesturetap",
        "onmsgotpointercapture",
        "onmsinertiastart",
        "onmslostpointercapture",
        "onmsmanipulationstatechanged",
        "onmsneedkey",
        "onmsorientationchange",
        "onmspointercancel",
        "onmspointerdown",
        "onmspointerenter",
        "onmspointerhover",
        "onmspointerleave",
        "onmspointermove",
        "onmspointerout",
        "onmspointerover",
        "onmspointerup",
        "onmssitemodejumplistitemremoved",
        "onmsthumbnailclick",
        "onmute",
        "onnegotiationneeded",
        "onnomatch",
        "onnoupdate",
        "onobsolete",
        "onoffline",
        "ononline",
        "onopen",
        "onorientationchange",
        "onpagechange",
        "onpagehide",
        "onpageshow",
        "onpaste",
        "onpause",
        "onpayerdetailchange",
        "onpaymentmethodchange",
        "onplay",
        "onplaying",
        "onpluginstreamstart",
        "onpointercancel",
        "onpointerdown",
        "onpointerenter",
        "onpointerleave",
        "onpointerlockchange",
        "onpointerlockerror",
        "onpointermove",
        "onpointerout",
        "onpointerover",
        "onpointerrawupdate",
        "onpointerup",
        "onpopstate",
        "onprocessorerror",
        "onprogress",
        "onpropertychange",
        "onratechange",
        "onreading",
        "onreadystatechange",
        "onrejectionhandled",
        "onrelease",
        "onremove",
        "onremovesourcebuffer",
        "onremovestream",
        "onremovetrack",
        "onrepeat",
        "onreset",
        "onresize",
        "onresizeend",
        "onresizestart",
        "onresourcetimingbufferfull",
        "onresult",
        "onresume",
        "onrowenter",
        "onrowexit",
        "onrowsdelete",
        "onrowsinserted",
        "onscroll",
        "onsearch",
        "onsecuritypolicyviolation",
        "onseeked",
        "onseeking",
        "onselect",
        "onselectedcandidatepairchange",
        "onselectend",
        "onselectionchange",
        "onselectstart",
        "onshippingaddresschange",
        "onshippingoptionchange",
        "onshow",
        "onsignalingstatechange",
        "onsoundend",
        "onsoundstart",
        "onsourceclose",
        "onsourceclosed",
        "onsourceended",
        "onsourceopen",
        "onspeechend",
        "onspeechstart",
        "onsqueeze",
        "onsqueezeend",
        "onsqueezestart",
        "onstalled",
        "onstart",
        "onstatechange",
        "onstop",
        "onstorage",
        "onstoragecommit",
        "onsubmit",
        "onsuccess",
        "onsuspend",
        "onterminate",
        "ontextinput",
        "ontimeout",
        "ontimeupdate",
        "ontoggle",
        "ontonechange",
        "ontouchcancel",
        "ontouchend",
        "ontouchmove",
        "ontouchstart",
        "ontrack",
        "ontransitioncancel",
        "ontransitionend",
        "ontransitionrun",
        "ontransitionstart",
        "onunhandledrejection",
        "onunload",
        "onunmute",
        "onupdate",
        "onupdateend",
        "onupdatefound",
        "onupdateready",
        "onupdatestart",
        "onupgradeneeded",
        "onuserproximity",
        "onversionchange",
        "onvisibilitychange",
        "onvoiceschanged",
        "onvolumechange",
        "onvrdisplayactivate",
        "onvrdisplayconnect",
        "onvrdisplaydeactivate",
        "onvrdisplaydisconnect",
        "onvrdisplaypresentchange",
        "onwaiting",
        "onwaitingforkey",
        "onwarning",
        "onwebkitanimationend",
        "onwebkitanimationiteration",
        "onwebkitanimationstart",
        "onwebkitcurrentplaybacktargetiswirelesschanged",
        "onwebkitfullscreenchange",
        "onwebkitfullscreenerror",
        "onwebkitkeyadded",
        "onwebkitkeyerror",
        "onwebkitkeymessage",
        "onwebkitneedkey",
        "onwebkitorientationchange",
        "onwebkitplaybacktargetavailabilitychanged",
        "onwebkitpointerlockchange",
        "onwebkitpointerlockerror",
        "onwebkitresourcetimingbufferfull",
        "onwebkittransitionend",
        "onwheel",
        "onzoom",
        "opacity",
        "open",
        "openCursor",
        "openDatabase",
        "openKeyCursor",
        "opened",
        "opener",
        "opera",
        "operationType",
        "operator",
        "opr",
        "optimum",
        "options",
        "or",
        "order",
        "orderX",
        "orderY",
        "ordered",
        "org",
        "organization",
        "orient",
        "orientAngle",
        "orientType",
        "orientation",
        "orientationX",
        "orientationY",
        "orientationZ",
        "origin",
        "originalPolicy",
        "originalTarget",
        "orphans",
        "oscpu",
        "outerHTML",
        "outerHeight",
        "outerText",
        "outerWidth",
        "outline",
        "outline-color",
        "outline-offset",
        "outline-style",
        "outline-width",
        "outlineColor",
        "outlineOffset",
        "outlineStyle",
        "outlineWidth",
        "outputBuffer",
        "outputLatency",
        "outputs",
        "overflow",
        "overflow-anchor",
        "overflow-block",
        "overflow-inline",
        "overflow-wrap",
        "overflow-x",
        "overflow-y",
        "overflowAnchor",
        "overflowBlock",
        "overflowInline",
        "overflowWrap",
        "overflowX",
        "overflowY",
        "overrideMimeType",
        "oversample",
        "overscroll-behavior",
        "overscroll-behavior-block",
        "overscroll-behavior-inline",
        "overscroll-behavior-x",
        "overscroll-behavior-y",
        "overscrollBehavior",
        "overscrollBehaviorBlock",
        "overscrollBehaviorInline",
        "overscrollBehaviorX",
        "overscrollBehaviorY",
        "ownKeys",
        "ownerDocument",
        "ownerElement",
        "ownerNode",
        "ownerRule",
        "ownerSVGElement",
        "owningElement",
        "p1",
        "p2",
        "p3",
        "p4",
        "packetSize",
        "packets",
        "pad",
        "padEnd",
        "padStart",
        "padding",
        "padding-block",
        "padding-block-end",
        "padding-block-start",
        "padding-bottom",
        "padding-inline",
        "padding-inline-end",
        "padding-inline-start",
        "padding-left",
        "padding-right",
        "padding-top",
        "paddingBlock",
        "paddingBlockEnd",
        "paddingBlockStart",
        "paddingBottom",
        "paddingInline",
        "paddingInlineEnd",
        "paddingInlineStart",
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "page",
        "page-break-after",
        "page-break-before",
        "page-break-inside",
        "pageBreakAfter",
        "pageBreakBefore",
        "pageBreakInside",
        "pageCount",
        "pageLeft",
        "pageTop",
        "pageX",
        "pageXOffset",
        "pageY",
        "pageYOffset",
        "pages",
        "paint-order",
        "paintOrder",
        "paintRequests",
        "paintType",
        "paintWorklet",
        "palette",
        "pan",
        "panningModel",
        "parameters",
        "parent",
        "parentElement",
        "parentNode",
        "parentRule",
        "parentStyleSheet",
        "parentTextEdit",
        "parentWindow",
        "parse",
        "parseAll",
        "parseFloat",
        "parseFromString",
        "parseInt",
        "part",
        "participants",
        "passive",
        "password",
        "pasteHTML",
        "path",
        "pathLength",
        "pathSegList",
        "pathSegType",
        "pathSegTypeAsLetter",
        "pathname",
        "pattern",
        "patternContentUnits",
        "patternMismatch",
        "patternTransform",
        "patternUnits",
        "pause",
        "pauseAnimations",
        "pauseOnExit",
        "pauseProfilers",
        "pauseTransformFeedback",
        "paused",
        "payerEmail",
        "payerName",
        "payerPhone",
        "paymentManager",
        "pc",
        "peerIdentity",
        "pending",
        "pendingLocalDescription",
        "pendingRemoteDescription",
        "percent",
        "performance",
        "periodicSync",
        "permission",
        "permissionState",
        "permissions",
        "persist",
        "persisted",
        "personalbar",
        "perspective",
        "perspective-origin",
        "perspectiveOrigin",
        "phone",
        "phoneticFamilyName",
        "phoneticGivenName",
        "photo",
        "pictureInPictureElement",
        "pictureInPictureEnabled",
        "pictureInPictureWindow",
        "ping",
        "pipeThrough",
        "pipeTo",
        "pitch",
        "pixelBottom",
        "pixelDepth",
        "pixelHeight",
        "pixelLeft",
        "pixelRight",
        "pixelStorei",
        "pixelTop",
        "pixelUnitToMillimeterX",
        "pixelUnitToMillimeterY",
        "pixelWidth",
        "place-content",
        "place-items",
        "place-self",
        "placeContent",
        "placeItems",
        "placeSelf",
        "placeholder",
        "platform",
        "platforms",
        "play",
        "playEffect",
        "playState",
        "playbackRate",
        "playbackState",
        "playbackTime",
        "played",
        "playoutDelayHint",
        "playsInline",
        "plugins",
        "pluginspage",
        "pname",
        "pointer-events",
        "pointerBeforeReferenceNode",
        "pointerEnabled",
        "pointerEvents",
        "pointerId",
        "pointerLockElement",
        "pointerType",
        "points",
        "pointsAtX",
        "pointsAtY",
        "pointsAtZ",
        "polygonOffset",
        "pop",
        "populateMatrix",
        "popupWindowFeatures",
        "popupWindowName",
        "popupWindowURI",
        "port",
        "port1",
        "port2",
        "ports",
        "posBottom",
        "posHeight",
        "posLeft",
        "posRight",
        "posTop",
        "posWidth",
        "pose",
        "position",
        "positionAlign",
        "positionX",
        "positionY",
        "positionZ",
        "postError",
        "postMessage",
        "postalCode",
        "poster",
        "pow",
        "powerEfficient",
        "powerOff",
        "preMultiplySelf",
        "precision",
        "preferredStyleSheetSet",
        "preferredStylesheetSet",
        "prefix",
        "preload",
        "prepend",
        "presentation",
        "preserveAlpha",
        "preserveAspectRatio",
        "preserveAspectRatioString",
        "pressed",
        "pressure",
        "prevValue",
        "preventDefault",
        "preventExtensions",
        "preventSilentAccess",
        "previousElementSibling",
        "previousNode",
        "previousPage",
        "previousRect",
        "previousScale",
        "previousSibling",
        "previousTranslate",
        "primaryKey",
        "primitiveType",
        "primitiveUnits",
        "principals",
        "print",
        "priority",
        "privateKey",
        "probablySupportsContext",
        "process",
        "processIceMessage",
        "processingEnd",
        "processingStart",
        "product",
        "productId",
        "productName",
        "productSub",
        "profile",
        "profileEnd",
        "profiles",
        "projectionMatrix",
        "promise",
        "prompt",
        "properties",
        "propertyIsEnumerable",
        "propertyName",
        "protocol",
        "protocolLong",
        "prototype",
        "provider",
        "pseudoClass",
        "pseudoElement",
        "pt",
        "publicId",
        "publicKey",
        "published",
        "pulse",
        "push",
        "pushManager",
        "pushNotification",
        "pushState",
        "put",
        "putImageData",
        "px",
        "quadraticCurveTo",
        "qualifier",
        "quaternion",
        "query",
        "queryCommandEnabled",
        "queryCommandIndeterm",
        "queryCommandState",
        "queryCommandSupported",
        "queryCommandText",
        "queryCommandValue",
        "querySelector",
        "querySelectorAll",
        "queueMicrotask",
        "quote",
        "quotes",
        "r",
        "r1",
        "r2",
        "race",
        "rad",
        "radiogroup",
        "radiusX",
        "radiusY",
        "random",
        "range",
        "rangeCount",
        "rangeMax",
        "rangeMin",
        "rangeOffset",
        "rangeOverflow",
        "rangeParent",
        "rangeUnderflow",
        "rate",
        "ratio",
        "raw",
        "rawId",
        "read",
        "readAsArrayBuffer",
        "readAsBinaryString",
        "readAsBlob",
        "readAsDataURL",
        "readAsText",
        "readBuffer",
        "readEntries",
        "readOnly",
        "readPixels",
        "readReportRequested",
        "readText",
        "readValue",
        "readable",
        "ready",
        "readyState",
        "reason",
        "reboot",
        "receivedAlert",
        "receiver",
        "receivers",
        "recipient",
        "reconnect",
        "recordNumber",
        "recordsAvailable",
        "recordset",
        "rect",
        "red",
        "redEyeReduction",
        "redirect",
        "redirectCount",
        "redirectEnd",
        "redirectStart",
        "redirected",
        "reduce",
        "reduceRight",
        "reduction",
        "refDistance",
        "refX",
        "refY",
        "referenceNode",
        "referenceSpace",
        "referrer",
        "referrerPolicy",
        "refresh",
        "region",
        "regionAnchorX",
        "regionAnchorY",
        "regionId",
        "regions",
        "register",
        "registerContentHandler",
        "registerElement",
        "registerProperty",
        "registerProtocolHandler",
        "reject",
        "rel",
        "relList",
        "relatedAddress",
        "relatedNode",
        "relatedPort",
        "relatedTarget",
        "release",
        "releaseCapture",
        "releaseEvents",
        "releaseInterface",
        "releaseLock",
        "releasePointerCapture",
        "releaseShaderCompiler",
        "reliable",
        "reliableWrite",
        "reload",
        "rem",
        "remainingSpace",
        "remote",
        "remoteDescription",
        "remove",
        "removeAllRanges",
        "removeAttribute",
        "removeAttributeNS",
        "removeAttributeNode",
        "removeBehavior",
        "removeChild",
        "removeCue",
        "removeEventListener",
        "removeFilter",
        "removeImport",
        "removeItem",
        "removeListener",
        "removeNamedItem",
        "removeNamedItemNS",
        "removeNode",
        "removeParameter",
        "removeProperty",
        "removeRange",
        "removeRegion",
        "removeRule",
        "removeSiteSpecificTrackingException",
        "removeSourceBuffer",
        "removeStream",
        "removeTrack",
        "removeVariable",
        "removeWakeLockListener",
        "removeWebWideTrackingException",
        "removed",
        "removedNodes",
        "renderHeight",
        "renderState",
        "renderTime",
        "renderWidth",
        "renderbufferStorage",
        "renderbufferStorageMultisample",
        "renderedBuffer",
        "renderingMode",
        "renotify",
        "repeat",
        "replace",
        "replaceAdjacentText",
        "replaceAll",
        "replaceChild",
        "replaceChildren",
        "replaceData",
        "replaceId",
        "replaceItem",
        "replaceNode",
        "replaceState",
        "replaceSync",
        "replaceTrack",
        "replaceWholeText",
        "replaceWith",
        "reportValidity",
        "request",
        "requestAnimationFrame",
        "requestAutocomplete",
        "requestData",
        "requestDevice",
        "requestFrame",
        "requestFullscreen",
        "requestHitTestSource",
        "requestHitTestSourceForTransientInput",
        "requestId",
        "requestIdleCallback",
        "requestMIDIAccess",
        "requestMediaKeySystemAccess",
        "requestPermission",
        "requestPictureInPicture",
        "requestPointerLock",
        "requestPresent",
        "requestReferenceSpace",
        "requestSession",
        "requestStart",
        "requestStorageAccess",
        "requestSubmit",
        "requestVideoFrameCallback",
        "requestingWindow",
        "requireInteraction",
        "required",
        "requiredExtensions",
        "requiredFeatures",
        "reset",
        "resetPose",
        "resetTransform",
        "resize",
        "resizeBy",
        "resizeTo",
        "resolve",
        "response",
        "responseBody",
        "responseEnd",
        "responseReady",
        "responseStart",
        "responseText",
        "responseType",
        "responseURL",
        "responseXML",
        "restartIce",
        "restore",
        "result",
        "resultIndex",
        "resultType",
        "results",
        "resume",
        "resumeProfilers",
        "resumeTransformFeedback",
        "retry",
        "returnValue",
        "rev",
        "reverse",
        "reversed",
        "revocable",
        "revokeObjectURL",
        "rgbColor",
        "right",
        "rightContext",
        "rightDegrees",
        "rightMargin",
        "rightProjectionMatrix",
        "rightViewMatrix",
        "role",
        "rolloffFactor",
        "root",
        "rootBounds",
        "rootElement",
        "rootMargin",
        "rotate",
        "rotateAxisAngle",
        "rotateAxisAngleSelf",
        "rotateFromVector",
        "rotateFromVectorSelf",
        "rotateSelf",
        "rotation",
        "rotationAngle",
        "rotationRate",
        "round",
        "row-gap",
        "rowGap",
        "rowIndex",
        "rowSpan",
        "rows",
        "rtcpTransport",
        "rtt",
        "ruby-align",
        "ruby-position",
        "rubyAlign",
        "rubyOverhang",
        "rubyPosition",
        "rules",
        "runtime",
        "runtimeStyle",
        "rx",
        "ry",
        "s",
        "safari",
        "sample",
        "sampleCoverage",
        "sampleRate",
        "samplerParameterf",
        "samplerParameteri",
        "sandbox",
        "save",
        "saveData",
        "scale",
        "scale3d",
        "scale3dSelf",
        "scaleNonUniform",
        "scaleNonUniformSelf",
        "scaleSelf",
        "scheme",
        "scissor",
        "scope",
        "scopeName",
        "scoped",
        "screen",
        "screenBrightness",
        "screenEnabled",
        "screenLeft",
        "screenPixelToMillimeterX",
        "screenPixelToMillimeterY",
        "screenTop",
        "screenX",
        "screenY",
        "scriptURL",
        "scripts",
        "scroll",
        "scroll-behavior",
        "scroll-margin",
        "scroll-margin-block",
        "scroll-margin-block-end",
        "scroll-margin-block-start",
        "scroll-margin-bottom",
        "scroll-margin-inline",
        "scroll-margin-inline-end",
        "scroll-margin-inline-start",
        "scroll-margin-left",
        "scroll-margin-right",
        "scroll-margin-top",
        "scroll-padding",
        "scroll-padding-block",
        "scroll-padding-block-end",
        "scroll-padding-block-start",
        "scroll-padding-bottom",
        "scroll-padding-inline",
        "scroll-padding-inline-end",
        "scroll-padding-inline-start",
        "scroll-padding-left",
        "scroll-padding-right",
        "scroll-padding-top",
        "scroll-snap-align",
        "scroll-snap-type",
        "scrollAmount",
        "scrollBehavior",
        "scrollBy",
        "scrollByLines",
        "scrollByPages",
        "scrollDelay",
        "scrollHeight",
        "scrollIntoView",
        "scrollIntoViewIfNeeded",
        "scrollLeft",
        "scrollLeftMax",
        "scrollMargin",
        "scrollMarginBlock",
        "scrollMarginBlockEnd",
        "scrollMarginBlockStart",
        "scrollMarginBottom",
        "scrollMarginInline",
        "scrollMarginInlineEnd",
        "scrollMarginInlineStart",
        "scrollMarginLeft",
        "scrollMarginRight",
        "scrollMarginTop",
        "scrollMaxX",
        "scrollMaxY",
        "scrollPadding",
        "scrollPaddingBlock",
        "scrollPaddingBlockEnd",
        "scrollPaddingBlockStart",
        "scrollPaddingBottom",
        "scrollPaddingInline",
        "scrollPaddingInlineEnd",
        "scrollPaddingInlineStart",
        "scrollPaddingLeft",
        "scrollPaddingRight",
        "scrollPaddingTop",
        "scrollRestoration",
        "scrollSnapAlign",
        "scrollSnapType",
        "scrollTo",
        "scrollTop",
        "scrollTopMax",
        "scrollWidth",
        "scrollX",
        "scrollY",
        "scrollbar-color",
        "scrollbar-width",
        "scrollbar3dLightColor",
        "scrollbarArrowColor",
        "scrollbarBaseColor",
        "scrollbarColor",
        "scrollbarDarkShadowColor",
        "scrollbarFaceColor",
        "scrollbarHighlightColor",
        "scrollbarShadowColor",
        "scrollbarTrackColor",
        "scrollbarWidth",
        "scrollbars",
        "scrolling",
        "scrollingElement",
        "sctp",
        "sctpCauseCode",
        "sdp",
        "sdpLineNumber",
        "sdpMLineIndex",
        "sdpMid",
        "seal",
        "search",
        "searchBox",
        "searchBoxJavaBridge_",
        "searchParams",
        "sectionRowIndex",
        "secureConnectionStart",
        "security",
        "seed",
        "seekToNextFrame",
        "seekable",
        "seeking",
        "select",
        "selectAllChildren",
        "selectAlternateInterface",
        "selectConfiguration",
        "selectNode",
        "selectNodeContents",
        "selectNodes",
        "selectSingleNode",
        "selectSubString",
        "selected",
        "selectedIndex",
        "selectedOptions",
        "selectedStyleSheetSet",
        "selectedStylesheetSet",
        "selection",
        "selectionDirection",
        "selectionEnd",
        "selectionStart",
        "selector",
        "selectorText",
        "self",
        "send",
        "sendAsBinary",
        "sendBeacon",
        "sender",
        "sentAlert",
        "sentTimestamp",
        "separator",
        "serialNumber",
        "serializeToString",
        "serverTiming",
        "service",
        "serviceWorker",
        "session",
        "sessionId",
        "sessionStorage",
        "set",
        "setActionHandler",
        "setActive",
        "setAlpha",
        "setAppBadge",
        "setAttribute",
        "setAttributeNS",
        "setAttributeNode",
        "setAttributeNodeNS",
        "setBaseAndExtent",
        "setBigInt64",
        "setBigUint64",
        "setBingCurrentSearchDefault",
        "setCapture",
        "setCodecPreferences",
        "setColor",
        "setCompositeOperation",
        "setConfiguration",
        "setCurrentTime",
        "setCustomValidity",
        "setData",
        "setDate",
        "setDragImage",
        "setEnd",
        "setEndAfter",
        "setEndBefore",
        "setEndPoint",
        "setFillColor",
        "setFilterRes",
        "setFloat32",
        "setFloat64",
        "setFloatValue",
        "setFormValue",
        "setFullYear",
        "setHeaderValue",
        "setHours",
        "setIdentityProvider",
        "setImmediate",
        "setInt16",
        "setInt32",
        "setInt8",
        "setInterval",
        "setItem",
        "setKeyframes",
        "setLineCap",
        "setLineDash",
        "setLineJoin",
        "setLineWidth",
        "setLiveSeekableRange",
        "setLocalDescription",
        "setMatrix",
        "setMatrixValue",
        "setMediaKeys",
        "setMilliseconds",
        "setMinutes",
        "setMiterLimit",
        "setMonth",
        "setNamedItem",
        "setNamedItemNS",
        "setNonUserCodeExceptions",
        "setOrientToAngle",
        "setOrientToAuto",
        "setOrientation",
        "setOverrideHistoryNavigationMode",
        "setPaint",
        "setParameter",
        "setParameters",
        "setPeriodicWave",
        "setPointerCapture",
        "setPosition",
        "setPositionState",
        "setPreference",
        "setProperty",
        "setPrototypeOf",
        "setRGBColor",
        "setRGBColorICCColor",
        "setRadius",
        "setRangeText",
        "setRemoteDescription",
        "setRequestHeader",
        "setResizable",
        "setResourceTimingBufferSize",
        "setRotate",
        "setScale",
        "setSeconds",
        "setSelectionRange",
        "setServerCertificate",
        "setShadow",
        "setSinkId",
        "setSkewX",
        "setSkewY",
        "setStart",
        "setStartAfter",
        "setStartBefore",
        "setStdDeviation",
        "setStreams",
        "setStringValue",
        "setStrokeColor",
        "setSuggestResult",
        "setTargetAtTime",
        "setTargetValueAtTime",
        "setTime",
        "setTimeout",
        "setTransform",
        "setTranslate",
        "setUTCDate",
        "setUTCFullYear",
        "setUTCHours",
        "setUTCMilliseconds",
        "setUTCMinutes",
        "setUTCMonth",
        "setUTCSeconds",
        "setUint16",
        "setUint32",
        "setUint8",
        "setUri",
        "setValidity",
        "setValueAtTime",
        "setValueCurveAtTime",
        "setVariable",
        "setVelocity",
        "setVersion",
        "setYear",
        "settingName",
        "settingValue",
        "sex",
        "shaderSource",
        "shadowBlur",
        "shadowColor",
        "shadowOffsetX",
        "shadowOffsetY",
        "shadowRoot",
        "shape",
        "shape-image-threshold",
        "shape-margin",
        "shape-outside",
        "shape-rendering",
        "shapeImageThreshold",
        "shapeMargin",
        "shapeOutside",
        "shapeRendering",
        "sheet",
        "shift",
        "shiftKey",
        "shiftLeft",
        "shippingAddress",
        "shippingOption",
        "shippingType",
        "show",
        "showHelp",
        "showModal",
        "showModalDialog",
        "showModelessDialog",
        "showNotification",
        "sidebar",
        "sign",
        "signal",
        "signalingState",
        "signature",
        "silent",
        "sin",
        "singleNodeValue",
        "sinh",
        "sinkId",
        "sittingToStandingTransform",
        "size",
        "sizeToContent",
        "sizeX",
        "sizeZ",
        "sizes",
        "skewX",
        "skewXSelf",
        "skewY",
        "skewYSelf",
        "slice",
        "slope",
        "slot",
        "small",
        "smil",
        "smooth",
        "smoothingTimeConstant",
        "snapToLines",
        "snapshotItem",
        "snapshotLength",
        "some",
        "sort",
        "sortingCode",
        "source",
        "sourceBuffer",
        "sourceBuffers",
        "sourceCapabilities",
        "sourceFile",
        "sourceIndex",
        "sources",
        "spacing",
        "span",
        "speak",
        "speakAs",
        "speaking",
        "species",
        "specified",
        "specularConstant",
        "specularExponent",
        "speechSynthesis",
        "speed",
        "speedOfSound",
        "spellcheck",
        "splice",
        "split",
        "splitText",
        "spreadMethod",
        "sqrt",
        "src",
        "srcElement",
        "srcFilter",
        "srcObject",
        "srcUrn",
        "srcdoc",
        "srclang",
        "srcset",
        "stack",
        "stackTraceLimit",
        "stacktrace",
        "stageParameters",
        "standalone",
        "standby",
        "start",
        "startContainer",
        "startIce",
        "startMessages",
        "startNotifications",
        "startOffset",
        "startProfiling",
        "startRendering",
        "startShark",
        "startTime",
        "startsWith",
        "state",
        "status",
        "statusCode",
        "statusMessage",
        "statusText",
        "statusbar",
        "stdDeviationX",
        "stdDeviationY",
        "stencilFunc",
        "stencilFuncSeparate",
        "stencilMask",
        "stencilMaskSeparate",
        "stencilOp",
        "stencilOpSeparate",
        "step",
        "stepDown",
        "stepMismatch",
        "stepUp",
        "sticky",
        "stitchTiles",
        "stop",
        "stop-color",
        "stop-opacity",
        "stopColor",
        "stopImmediatePropagation",
        "stopNotifications",
        "stopOpacity",
        "stopProfiling",
        "stopPropagation",
        "stopShark",
        "stopped",
        "storage",
        "storageArea",
        "storageName",
        "storageStatus",
        "store",
        "storeSiteSpecificTrackingException",
        "storeWebWideTrackingException",
        "stpVersion",
        "stream",
        "streams",
        "stretch",
        "strike",
        "string",
        "stringValue",
        "stringify",
        "stroke",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "strokeDasharray",
        "strokeDashoffset",
        "strokeLinecap",
        "strokeLinejoin",
        "strokeMiterlimit",
        "strokeOpacity",
        "strokeRect",
        "strokeStyle",
        "strokeText",
        "strokeWidth",
        "style",
        "styleFloat",
        "styleMap",
        "styleMedia",
        "styleSheet",
        "styleSheetSets",
        "styleSheets",
        "sub",
        "subarray",
        "subject",
        "submit",
        "submitFrame",
        "submitter",
        "subscribe",
        "substr",
        "substring",
        "substringData",
        "subtle",
        "subtree",
        "suffix",
        "suffixes",
        "summary",
        "sup",
        "supported",
        "supportedContentEncodings",
        "supportedEntryTypes",
        "supports",
        "supportsSession",
        "surfaceScale",
        "surroundContents",
        "suspend",
        "suspendRedraw",
        "swapCache",
        "swapNode",
        "sweepFlag",
        "symbols",
        "sync",
        "sysexEnabled",
        "system",
        "systemCode",
        "systemId",
        "systemLanguage",
        "systemXDPI",
        "systemYDPI",
        "tBodies",
        "tFoot",
        "tHead",
        "tabIndex",
        "table",
        "table-layout",
        "tableLayout",
        "tableValues",
        "tag",
        "tagName",
        "tagUrn",
        "tags",
        "taintEnabled",
        "takePhoto",
        "takeRecords",
        "tan",
        "tangentialPressure",
        "tanh",
        "target",
        "targetElement",
        "targetRayMode",
        "targetRaySpace",
        "targetTouches",
        "targetX",
        "targetY",
        "tcpType",
        "tee",
        "tel",
        "terminate",
        "test",
        "texImage2D",
        "texImage3D",
        "texParameterf",
        "texParameteri",
        "texStorage2D",
        "texStorage3D",
        "texSubImage2D",
        "texSubImage3D",
        "text",
        "text-align",
        "text-align-last",
        "text-anchor",
        "text-combine-upright",
        "text-decoration",
        "text-decoration-color",
        "text-decoration-line",
        "text-decoration-skip-ink",
        "text-decoration-style",
        "text-decoration-thickness",
        "text-emphasis",
        "text-emphasis-color",
        "text-emphasis-position",
        "text-emphasis-style",
        "text-indent",
        "text-justify",
        "text-orientation",
        "text-overflow",
        "text-rendering",
        "text-shadow",
        "text-transform",
        "text-underline-offset",
        "text-underline-position",
        "textAlign",
        "textAlignLast",
        "textAnchor",
        "textAutospace",
        "textBaseline",
        "textCombineUpright",
        "textContent",
        "textDecoration",
        "textDecorationBlink",
        "textDecorationColor",
        "textDecorationLine",
        "textDecorationLineThrough",
        "textDecorationNone",
        "textDecorationOverline",
        "textDecorationSkipInk",
        "textDecorationStyle",
        "textDecorationThickness",
        "textDecorationUnderline",
        "textEmphasis",
        "textEmphasisColor",
        "textEmphasisPosition",
        "textEmphasisStyle",
        "textIndent",
        "textJustify",
        "textJustifyTrim",
        "textKashida",
        "textKashidaSpace",
        "textLength",
        "textOrientation",
        "textOverflow",
        "textRendering",
        "textShadow",
        "textTracks",
        "textTransform",
        "textUnderlineOffset",
        "textUnderlinePosition",
        "then",
        "threadId",
        "threshold",
        "thresholds",
        "tiltX",
        "tiltY",
        "time",
        "timeEnd",
        "timeLog",
        "timeOrigin",
        "timeRemaining",
        "timeStamp",
        "timecode",
        "timeline",
        "timelineTime",
        "timeout",
        "timestamp",
        "timestampOffset",
        "timing",
        "title",
        "to",
        "toArray",
        "toBlob",
        "toDataURL",
        "toDateString",
        "toElement",
        "toExponential",
        "toFixed",
        "toFloat32Array",
        "toFloat64Array",
        "toGMTString",
        "toISOString",
        "toJSON",
        "toLocaleDateString",
        "toLocaleFormat",
        "toLocaleLowerCase",
        "toLocaleString",
        "toLocaleTimeString",
        "toLocaleUpperCase",
        "toLowerCase",
        "toMatrix",
        "toMethod",
        "toPrecision",
        "toPrimitive",
        "toSdp",
        "toSource",
        "toStaticHTML",
        "toString",
        "toStringTag",
        "toSum",
        "toTimeString",
        "toUTCString",
        "toUpperCase",
        "toggle",
        "toggleAttribute",
        "toggleLongPressEnabled",
        "tone",
        "toneBuffer",
        "tooLong",
        "tooShort",
        "toolbar",
        "top",
        "topMargin",
        "total",
        "totalFrameDelay",
        "totalVideoFrames",
        "touch-action",
        "touchAction",
        "touched",
        "touches",
        "trace",
        "track",
        "trackVisibility",
        "transaction",
        "transactions",
        "transceiver",
        "transferControlToOffscreen",
        "transferFromImageBitmap",
        "transferImageBitmap",
        "transferIn",
        "transferOut",
        "transferSize",
        "transferToImageBitmap",
        "transform",
        "transform-box",
        "transform-origin",
        "transform-style",
        "transformBox",
        "transformFeedbackVaryings",
        "transformOrigin",
        "transformPoint",
        "transformString",
        "transformStyle",
        "transformToDocument",
        "transformToFragment",
        "transition",
        "transition-delay",
        "transition-duration",
        "transition-property",
        "transition-timing-function",
        "transitionDelay",
        "transitionDuration",
        "transitionProperty",
        "transitionTimingFunction",
        "translate",
        "translateSelf",
        "translationX",
        "translationY",
        "transport",
        "trim",
        "trimEnd",
        "trimLeft",
        "trimRight",
        "trimStart",
        "trueSpeed",
        "trunc",
        "truncate",
        "trustedTypes",
        "turn",
        "twist",
        "type",
        "typeDetail",
        "typeMismatch",
        "typeMustMatch",
        "types",
        "u2f",
        "ubound",
        "uint16",
        "uint32",
        "uint8",
        "uint8Clamped",
        "undefined",
        "unescape",
        "uneval",
        "unicode",
        "unicode-bidi",
        "unicodeBidi",
        "unicodeRange",
        "uniform1f",
        "uniform1fv",
        "uniform1i",
        "uniform1iv",
        "uniform1ui",
        "uniform1uiv",
        "uniform2f",
        "uniform2fv",
        "uniform2i",
        "uniform2iv",
        "uniform2ui",
        "uniform2uiv",
        "uniform3f",
        "uniform3fv",
        "uniform3i",
        "uniform3iv",
        "uniform3ui",
        "uniform3uiv",
        "uniform4f",
        "uniform4fv",
        "uniform4i",
        "uniform4iv",
        "uniform4ui",
        "uniform4uiv",
        "uniformBlockBinding",
        "uniformMatrix2fv",
        "uniformMatrix2x3fv",
        "uniformMatrix2x4fv",
        "uniformMatrix3fv",
        "uniformMatrix3x2fv",
        "uniformMatrix3x4fv",
        "uniformMatrix4fv",
        "uniformMatrix4x2fv",
        "uniformMatrix4x3fv",
        "unique",
        "uniqueID",
        "uniqueNumber",
        "unit",
        "unitType",
        "units",
        "unloadEventEnd",
        "unloadEventStart",
        "unlock",
        "unmount",
        "unobserve",
        "unpause",
        "unpauseAnimations",
        "unreadCount",
        "unregister",
        "unregisterContentHandler",
        "unregisterProtocolHandler",
        "unscopables",
        "unselectable",
        "unshift",
        "unsubscribe",
        "unsuspendRedraw",
        "unsuspendRedrawAll",
        "unwatch",
        "unwrapKey",
        "upDegrees",
        "upX",
        "upY",
        "upZ",
        "update",
        "updateCommands",
        "updateIce",
        "updateInterval",
        "updatePlaybackRate",
        "updateRenderState",
        "updateSettings",
        "updateTiming",
        "updateViaCache",
        "updateWith",
        "updated",
        "updating",
        "upgrade",
        "upload",
        "uploadTotal",
        "uploaded",
        "upper",
        "upperBound",
        "upperOpen",
        "uri",
        "url",
        "urn",
        "urns",
        "usages",
        "usb",
        "usbVersionMajor",
        "usbVersionMinor",
        "usbVersionSubminor",
        "useCurrentView",
        "useMap",
        "useProgram",
        "usedSpace",
        "user-select",
        "userActivation",
        "userAgent",
        "userChoice",
        "userHandle",
        "userHint",
        "userLanguage",
        "userSelect",
        "userVisibleOnly",
        "username",
        "usernameFragment",
        "utterance",
        "uuid",
        "v8BreakIterator",
        "vAlign",
        "vLink",
        "valid",
        "validate",
        "validateProgram",
        "validationMessage",
        "validity",
        "value",
        "valueAsDate",
        "valueAsNumber",
        "valueAsString",
        "valueInSpecifiedUnits",
        "valueMissing",
        "valueOf",
        "valueText",
        "valueType",
        "values",
        "variable",
        "variant",
        "variationSettings",
        "vector-effect",
        "vectorEffect",
        "velocityAngular",
        "velocityExpansion",
        "velocityX",
        "velocityY",
        "vendor",
        "vendorId",
        "vendorSub",
        "verify",
        "version",
        "vertexAttrib1f",
        "vertexAttrib1fv",
        "vertexAttrib2f",
        "vertexAttrib2fv",
        "vertexAttrib3f",
        "vertexAttrib3fv",
        "vertexAttrib4f",
        "vertexAttrib4fv",
        "vertexAttribDivisor",
        "vertexAttribDivisorANGLE",
        "vertexAttribI4i",
        "vertexAttribI4iv",
        "vertexAttribI4ui",
        "vertexAttribI4uiv",
        "vertexAttribIPointer",
        "vertexAttribPointer",
        "vertical",
        "vertical-align",
        "verticalAlign",
        "verticalOverflow",
        "vh",
        "vibrate",
        "vibrationActuator",
        "videoBitsPerSecond",
        "videoHeight",
        "videoTracks",
        "videoWidth",
        "view",
        "viewBox",
        "viewBoxString",
        "viewTarget",
        "viewTargetString",
        "viewport",
        "viewportAnchorX",
        "viewportAnchorY",
        "viewportElement",
        "views",
        "violatedDirective",
        "visibility",
        "visibilityState",
        "visible",
        "visualViewport",
        "vlinkColor",
        "vmax",
        "vmin",
        "voice",
        "voiceURI",
        "volume",
        "vrml",
        "vspace",
        "vw",
        "w",
        "wait",
        "waitSync",
        "waiting",
        "wake",
        "wakeLock",
        "wand",
        "warn",
        "wasClean",
        "wasDiscarded",
        "watch",
        "watchAvailability",
        "watchPosition",
        "webdriver",
        "webkitAddKey",
        "webkitAlignContent",
        "webkitAlignItems",
        "webkitAlignSelf",
        "webkitAnimation",
        "webkitAnimationDelay",
        "webkitAnimationDirection",
        "webkitAnimationDuration",
        "webkitAnimationFillMode",
        "webkitAnimationIterationCount",
        "webkitAnimationName",
        "webkitAnimationPlayState",
        "webkitAnimationTimingFunction",
        "webkitAppearance",
        "webkitAudioContext",
        "webkitAudioDecodedByteCount",
        "webkitAudioPannerNode",
        "webkitBackfaceVisibility",
        "webkitBackground",
        "webkitBackgroundAttachment",
        "webkitBackgroundClip",
        "webkitBackgroundColor",
        "webkitBackgroundImage",
        "webkitBackgroundOrigin",
        "webkitBackgroundPosition",
        "webkitBackgroundPositionX",
        "webkitBackgroundPositionY",
        "webkitBackgroundRepeat",
        "webkitBackgroundSize",
        "webkitBackingStorePixelRatio",
        "webkitBorderBottomLeftRadius",
        "webkitBorderBottomRightRadius",
        "webkitBorderImage",
        "webkitBorderImageOutset",
        "webkitBorderImageRepeat",
        "webkitBorderImageSlice",
        "webkitBorderImageSource",
        "webkitBorderImageWidth",
        "webkitBorderRadius",
        "webkitBorderTopLeftRadius",
        "webkitBorderTopRightRadius",
        "webkitBoxAlign",
        "webkitBoxDirection",
        "webkitBoxFlex",
        "webkitBoxOrdinalGroup",
        "webkitBoxOrient",
        "webkitBoxPack",
        "webkitBoxShadow",
        "webkitBoxSizing",
        "webkitCancelAnimationFrame",
        "webkitCancelFullScreen",
        "webkitCancelKeyRequest",
        "webkitCancelRequestAnimationFrame",
        "webkitClearResourceTimings",
        "webkitClosedCaptionsVisible",
        "webkitConvertPointFromNodeToPage",
        "webkitConvertPointFromPageToNode",
        "webkitCreateShadowRoot",
        "webkitCurrentFullScreenElement",
        "webkitCurrentPlaybackTargetIsWireless",
        "webkitDecodedFrameCount",
        "webkitDirectionInvertedFromDevice",
        "webkitDisplayingFullscreen",
        "webkitDroppedFrameCount",
        "webkitEnterFullScreen",
        "webkitEnterFullscreen",
        "webkitEntries",
        "webkitExitFullScreen",
        "webkitExitFullscreen",
        "webkitExitPointerLock",
        "webkitFilter",
        "webkitFlex",
        "webkitFlexBasis",
        "webkitFlexDirection",
        "webkitFlexFlow",
        "webkitFlexGrow",
        "webkitFlexShrink",
        "webkitFlexWrap",
        "webkitFullScreenKeyboardInputAllowed",
        "webkitFullscreenElement",
        "webkitFullscreenEnabled",
        "webkitGenerateKeyRequest",
        "webkitGetAsEntry",
        "webkitGetDatabaseNames",
        "webkitGetEntries",
        "webkitGetEntriesByName",
        "webkitGetEntriesByType",
        "webkitGetFlowByName",
        "webkitGetGamepads",
        "webkitGetImageDataHD",
        "webkitGetNamedFlows",
        "webkitGetRegionFlowRanges",
        "webkitGetUserMedia",
        "webkitHasClosedCaptions",
        "webkitHidden",
        "webkitIDBCursor",
        "webkitIDBDatabase",
        "webkitIDBDatabaseError",
        "webkitIDBDatabaseException",
        "webkitIDBFactory",
        "webkitIDBIndex",
        "webkitIDBKeyRange",
        "webkitIDBObjectStore",
        "webkitIDBRequest",
        "webkitIDBTransaction",
        "webkitImageSmoothingEnabled",
        "webkitIndexedDB",
        "webkitInitMessageEvent",
        "webkitIsFullScreen",
        "webkitJustifyContent",
        "webkitKeys",
        "webkitLineClamp",
        "webkitLineDashOffset",
        "webkitLockOrientation",
        "webkitMask",
        "webkitMaskClip",
        "webkitMaskComposite",
        "webkitMaskImage",
        "webkitMaskOrigin",
        "webkitMaskPosition",
        "webkitMaskPositionX",
        "webkitMaskPositionY",
        "webkitMaskRepeat",
        "webkitMaskSize",
        "webkitMatchesSelector",
        "webkitMediaStream",
        "webkitNotifications",
        "webkitOfflineAudioContext",
        "webkitOrder",
        "webkitOrientation",
        "webkitPeerConnection00",
        "webkitPersistentStorage",
        "webkitPerspective",
        "webkitPerspectiveOrigin",
        "webkitPointerLockElement",
        "webkitPostMessage",
        "webkitPreservesPitch",
        "webkitPutImageDataHD",
        "webkitRTCPeerConnection",
        "webkitRegionOverset",
        "webkitRelativePath",
        "webkitRequestAnimationFrame",
        "webkitRequestFileSystem",
        "webkitRequestFullScreen",
        "webkitRequestFullscreen",
        "webkitRequestPointerLock",
        "webkitResolveLocalFileSystemURL",
        "webkitSetMediaKeys",
        "webkitSetResourceTimingBufferSize",
        "webkitShadowRoot",
        "webkitShowPlaybackTargetPicker",
        "webkitSlice",
        "webkitSpeechGrammar",
        "webkitSpeechGrammarList",
        "webkitSpeechRecognition",
        "webkitSpeechRecognitionError",
        "webkitSpeechRecognitionEvent",
        "webkitStorageInfo",
        "webkitSupportsFullscreen",
        "webkitTemporaryStorage",
        "webkitTextFillColor",
        "webkitTextSizeAdjust",
        "webkitTextStroke",
        "webkitTextStrokeColor",
        "webkitTextStrokeWidth",
        "webkitTransform",
        "webkitTransformOrigin",
        "webkitTransformStyle",
        "webkitTransition",
        "webkitTransitionDelay",
        "webkitTransitionDuration",
        "webkitTransitionProperty",
        "webkitTransitionTimingFunction",
        "webkitURL",
        "webkitUnlockOrientation",
        "webkitUserSelect",
        "webkitVideoDecodedByteCount",
        "webkitVisibilityState",
        "webkitWirelessVideoPlaybackDisabled",
        "webkitdirectory",
        "webkitdropzone",
        "webstore",
        "weight",
        "whatToShow",
        "wheelDelta",
        "wheelDeltaX",
        "wheelDeltaY",
        "whenDefined",
        "which",
        "white-space",
        "whiteSpace",
        "wholeText",
        "widows",
        "width",
        "will-change",
        "willChange",
        "willValidate",
        "window",
        "withCredentials",
        "word-break",
        "word-spacing",
        "word-wrap",
        "wordBreak",
        "wordSpacing",
        "wordWrap",
        "workerStart",
        "wrap",
        "wrapKey",
        "writable",
        "writableAuxiliaries",
        "write",
        "writeText",
        "writeValue",
        "writeWithoutResponse",
        "writeln",
        "writing-mode",
        "writingMode",
        "x",
        "x1",
        "x2",
        "xChannelSelector",
        "xmlEncoding",
        "xmlStandalone",
        "xmlVersion",
        "xmlbase",
        "xmllang",
        "xmlspace",
        "xor",
        "xr",
        "y",
        "y1",
        "y2",
        "yChannelSelector",
        "yandex",
        "z",
        "z-index",
        "zIndex",
        "zoom",
        "zoomAndPan",
        "zoomRectScreen"
    ];
    function addStrings(node, add) {
        node.walk(new TreeWalker(function(node) {
            return node instanceof AST_Sequence ? addStrings(node.tail_node(), add) : node instanceof AST_String ? add(node.value) : node instanceof AST_Conditional && (addStrings(node.consequent, add), addStrings(node.alternative, add)), !0;
        }));
    }
    var to_ascii = "undefined" == typeof atob ? function(b64) {
        return Buffer.from(b64, "base64").toString();
    } : atob, to_base64 = "undefined" == typeof btoa ? function(str) {
        return Buffer.from(str).toString("base64");
    } : btoa;
    function set_shorthand(name, options, keys) {
        options[name] && keys.forEach(function(key) {
            !options[key] || ("object" != typeof options[key] && (options[key] = {}), name in options[key] || (options[key][name] = options[name]));
        });
    }
    function init_cache(cache) {
        !cache || ("props" in cache ? cache.props instanceof Map || (cache.props = function(obj) {
            var map = new Map();
            for(var key in obj)HOP(obj, key) && "$" === key.charAt(0) && map.set(key.substr(1), obj[key]);
            return map;
        }(cache.props)) : cache.props = new Map());
    }
    function cache_to_json(cache) {
        var map, obj;
        return {
            props: (map = cache.props, obj = Object.create(null), map.forEach(function(value, key) {
                obj["$" + key] = value;
            }), obj)
        };
    }
    async function minify(files, options, _fs_module) {
        _fs_module && "object" == typeof process && process.env && "string" == typeof process.env.TERSER_DEBUG_DIR && function(files, options, fs, debug_folder) {
            if (!(fs && fs.writeFileSync && fs.mkdirSync)) return;
            try {
                fs.mkdirSync(debug_folder);
            } catch (e) {
                if ("EEXIST" !== e.code) throw e;
            }
            const log_path = `${debug_folder}/terser-debug-${9999999 * Math.random() | 0}.log`, options_str = JSON.stringify(options = options || {}, (_key, thing)=>"function" == typeof thing ? "[Function " + thing.toString() + "]" : thing instanceof RegExp ? "[RegExp " + thing.toString() + "]" : thing, 4), files_str = (file)=>"object" == typeof file && options.parse && options.parse.spidermonkey ? JSON.stringify(file, null, 2) : "object" == typeof file ? Object.keys(file).map((key)=>key + ": " + files_str(file[key])).join("\n\n") : "string" == typeof file ? "```\n" + file + "\n```" : file;
            fs.writeFileSync(log_path, "Options: \n" + options_str + "\n\nInput files:\n\n" + files_str(files) + "\n");
        }(files, options, _fs_module, process.env.TERSER_DEBUG_DIR);
        var quoted_props, toplevel, timings = (options = defaults(options, {
            compress: {},
            ecma: void 0,
            enclose: !1,
            ie8: !1,
            keep_classnames: void 0,
            keep_fnames: !1,
            mangle: {},
            module: !1,
            nameCache: null,
            output: null,
            format: null,
            parse: {},
            rename: void 0,
            safari10: !1,
            sourceMap: !1,
            spidermonkey: !1,
            timings: !1,
            toplevel: !1,
            warnings: !1,
            wrap: !1
        }, !0)).timings && {
            start: Date.now()
        };
        if (void 0 === options.keep_classnames && (options.keep_classnames = options.keep_fnames), void 0 === options.rename && (options.rename = options.compress && options.mangle), options.output && options.format) throw Error("Please only specify either output or format option, preferrably format.");
        if (options.format = options.format || options.output || {}, set_shorthand("ecma", options, [
            "parse",
            "compress",
            "format"
        ]), set_shorthand("ie8", options, [
            "compress",
            "mangle",
            "format"
        ]), set_shorthand("keep_classnames", options, [
            "compress",
            "mangle"
        ]), set_shorthand("keep_fnames", options, [
            "compress",
            "mangle"
        ]), set_shorthand("module", options, [
            "parse",
            "compress",
            "mangle"
        ]), set_shorthand("safari10", options, [
            "mangle",
            "format"
        ]), set_shorthand("toplevel", options, [
            "compress",
            "mangle"
        ]), set_shorthand("warnings", options, [
            "compress"
        ]), options.mangle && (options.mangle = defaults(options.mangle, {
            cache: options.nameCache && (options.nameCache.vars || {}),
            eval: !1,
            ie8: !1,
            keep_classnames: !1,
            keep_fnames: !1,
            module: !1,
            nth_identifier: base54,
            properties: !1,
            reserved: [],
            safari10: !1,
            toplevel: !1
        }, !0), !options.mangle.properties || ("object" != typeof options.mangle.properties && (options.mangle.properties = {}), options.mangle.properties.keep_quoted && (Array.isArray(quoted_props = options.mangle.properties.reserved) || (quoted_props = []), options.mangle.properties.reserved = quoted_props), !options.nameCache || "cache" in options.mangle.properties || (options.mangle.properties.cache = options.nameCache.props || {})), init_cache(options.mangle.cache), init_cache(options.mangle.properties.cache)), options.sourceMap && (options.sourceMap = defaults(options.sourceMap, {
            asObject: !1,
            content: null,
            filename: null,
            includeSources: !1,
            root: null,
            url: null
        }, !0)), timings && (timings.parse = Date.now()), files instanceof AST_Toplevel) toplevel = files;
        else {
            if (("string" == typeof files || options.parse.spidermonkey && !Array.isArray(files)) && (files = [
                files
            ]), options.parse = options.parse || {}, options.parse.toplevel = null, options.parse.spidermonkey) options.parse.toplevel = AST_Node.from_mozilla_ast(Object.keys(files).reduce(function(toplevel, name) {
                return toplevel ? (toplevel.body = toplevel.body.concat(files[name].body), toplevel) : files[name];
            }, null));
            else for(var name in delete options.parse.spidermonkey, files)if (HOP(files, name) && (options.parse.filename = name, options.parse.toplevel = parse(files[name], options.parse), options.sourceMap && "inline" == options.sourceMap.content)) {
                if (Object.keys(files).length > 1) throw Error("inline source map only works with singular input");
                options.sourceMap.content = function(code) {
                    var match = /(?:^|[^.])\/\/# sourceMappingURL=data:application\/json(;[\w=-]*)?;base64,([+/0-9A-Za-z]*=*)\s*$/.exec(code);
                    return match ? to_ascii(match[2]) : (console.warn("inline source map not found"), null);
                }(files[name]);
            }
            toplevel = options.parse.toplevel;
        }
        quoted_props && "strict" !== options.mangle.properties.keep_quoted && function(ast, reserved) {
            function add(name) {
                push_uniq(reserved, name);
            }
            ast.walk(new TreeWalker(function(node) {
                node instanceof AST_ObjectKeyVal && node.quote ? add(node.key) : node instanceof AST_ObjectProperty && node.quote ? add(node.key.name) : node instanceof AST_Sub && addStrings(node.property, add);
            }));
        }(toplevel, quoted_props), options.wrap && (toplevel = toplevel.wrap_commonjs(options.wrap)), options.enclose && (toplevel = toplevel.wrap_enclose(options.enclose)), timings && (timings.rename = Date.now()), timings && (timings.compress = Date.now()), options.compress && (toplevel = new Compressor(options.compress, {
            mangle_options: options.mangle
        }).compress(toplevel)), timings && (timings.scope = Date.now()), options.mangle && toplevel.figure_out_scope(options.mangle), timings && (timings.mangle = Date.now()), options.mangle && (toplevel.compute_char_frequency(options.mangle), toplevel.mangle_names(options.mangle), toplevel = function(ast, options) {
            var cprivate = -1, private_cache = new Map(), nth_identifier = options.nth_identifier || base54;
            return ast = ast.transform(new TreeTransformer(function(node) {
                node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter ? node.key.name = mangle_private(node.key.name) : node instanceof AST_DotHash && (node.property = mangle_private(node.property));
            }));
            function mangle_private(name) {
                let mangled = private_cache.get(name);
                return mangled || (mangled = nth_identifier.get(++cprivate), private_cache.set(name, mangled)), mangled;
            }
        }(toplevel, options.mangle)), timings && (timings.properties = Date.now()), options.mangle && options.mangle.properties && (toplevel = function(ast, options) {
            var cache, debug_name_suffix, nth_identifier = (options = defaults(options, {
                builtins: !1,
                cache: null,
                debug: !1,
                keep_quoted: !1,
                nth_identifier: base54,
                only_cache: !1,
                regex: null,
                reserved: null,
                undeclared: !1
            }, !0)).nth_identifier, reserved_option = options.reserved;
            Array.isArray(reserved_option) || (reserved_option = [
                reserved_option
            ]);
            var reserved = new Set(reserved_option);
            options.builtins || /***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/ function(reserved) {
                domprops.forEach(add);
                var objects = {}, global_ref = "object" == typeof global ? global : self;
                function add(name) {
                    reserved.add(name);
                }
                [
                    "Symbol",
                    "Map",
                    "Promise",
                    "Proxy",
                    "Reflect",
                    "Set",
                    "WeakMap",
                    "WeakSet"
                ].forEach(function(new_global) {
                    objects[new_global] = global_ref[new_global] || Function();
                }), [
                    "null",
                    "true",
                    "false",
                    "NaN",
                    "Infinity",
                    "-Infinity",
                    "undefined"
                ].forEach(add), [
                    Object,
                    Array,
                    Function,
                    Number,
                    String,
                    Boolean,
                    Error,
                    Math,
                    Date,
                    RegExp,
                    objects.Symbol,
                    ArrayBuffer,
                    DataView,
                    decodeURI,
                    decodeURIComponent,
                    encodeURI,
                    encodeURIComponent,
                    eval,
                    EvalError,
                    Float32Array,
                    Float64Array,
                    Int8Array,
                    Int16Array,
                    Int32Array,
                    isFinite,
                    isNaN,
                    JSON,
                    objects.Map,
                    parseFloat,
                    parseInt,
                    objects.Promise,
                    objects.Proxy,
                    RangeError,
                    ReferenceError,
                    objects.Reflect,
                    objects.Set,
                    SyntaxError,
                    TypeError,
                    Uint8Array,
                    Uint8ClampedArray,
                    Uint16Array,
                    Uint32Array,
                    URIError,
                    objects.WeakMap,
                    objects.WeakSet
                ].forEach(function(ctor) {
                    Object.getOwnPropertyNames(ctor).map(add), ctor.prototype && Object.getOwnPropertyNames(ctor.prototype).map(add);
                });
            }(reserved);
            var cname = -1;
            cache = options.cache ? options.cache.props : new Map();
            var regex = options.regex && new RegExp(options.regex), debug = !1 !== options.debug;
            debug && (debug_name_suffix = !0 === options.debug ? "" : options.debug);
            var names_to_mangle = new Set(), unmangleable = new Set();
            // Track each already-mangled name to prevent nth_identifier from generating
            // the same name.
            cache.forEach((mangled_name)=>unmangleable.add(mangled_name));
            var keep_quoted = !!options.keep_quoted;
            // step 2: transform the tree, renaming properties
            return(// step 1: find candidates to mangle
            ast.walk(new TreeWalker(function(node) {
                if (node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_DotHash) ;
                else if (node instanceof AST_ObjectKeyVal) "string" != typeof node.key || keep_quoted && node.quote || add(node.key);
                else if (node instanceof AST_ObjectProperty) // setter or getter, since KeyVal is handled above
                keep_quoted && node.quote || add(node.key.name);
                else if (node instanceof AST_Dot) {
                    var declared = !!options.undeclared;
                    if (!declared) {
                        for(var root = node; root.expression;)root = root.expression;
                        declared = !(root.thedef && root.thedef.undeclared);
                    }
                    !declared || keep_quoted && node.quote || add(node.property);
                } else node instanceof AST_Sub ? keep_quoted || addStrings(node.property, add) : node instanceof AST_Call && "Object.defineProperty" == node.expression.print_to_string() ? addStrings(node.args[1], add) : node instanceof AST_Binary && "in" === node.operator && addStrings(node.left, add);
            })), ast.transform(new TreeTransformer(function(node) {
                node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_DotHash || (node instanceof AST_ObjectKeyVal ? "string" != typeof node.key || keep_quoted && node.quote || (node.key = mangle(node.key)) : node instanceof AST_ObjectProperty ? keep_quoted && node.quote || (node.key.name = mangle(node.key.name)) : node instanceof AST_Dot ? keep_quoted && node.quote || (node.property = mangle(node.property)) : !keep_quoted && node instanceof AST_Sub ? node.property = mangleStrings(node.property) : node instanceof AST_Call && "Object.defineProperty" == node.expression.print_to_string() ? node.args[1] = mangleStrings(node.args[1]) : node instanceof AST_Binary && "in" === node.operator && (node.left = mangleStrings(node.left)));
            })));
            // only function declarations after this line
            function can_mangle(name) {
                return !(unmangleable.has(name) || reserved.has(name)) && (options.only_cache ? cache.has(name) : !/^-?[0-9]+(\.[0-9]+)?(e[+-][0-9]+)?$/.test(name));
            }
            function should_mangle(name) {
                return !(regex && !regex.test(name) || reserved.has(name)) && (cache.has(name) || names_to_mangle.has(name));
            }
            function add(name) {
                can_mangle(name) && names_to_mangle.add(name), should_mangle(name) || unmangleable.add(name);
            }
            function mangle(name) {
                if (!should_mangle(name)) return name;
                var mangled = cache.get(name);
                if (!mangled) {
                    if (debug) {
                        // debug mode: use a prefix and suffix to preserve readability, e.g. o.foo -> o._$foo$NNN_.
                        var debug_mangled = "_$" + name + "$" + debug_name_suffix + "_";
                        can_mangle(debug_mangled) && (mangled = debug_mangled);
                    }
                    // either debug mode is off, or it is on and we could not use the mangled name
                    if (!mangled) do mangled = nth_identifier.get(++cname);
                    while (!can_mangle(mangled))
                    cache.set(name, mangled);
                }
                return mangled;
            }
            function mangleStrings(node) {
                return node.transform(new TreeTransformer(function(node) {
                    if (node instanceof AST_Sequence) {
                        var last = node.expressions.length - 1;
                        node.expressions[last] = mangleStrings(node.expressions[last]);
                    } else node instanceof AST_String ? node.value = mangle(node.value) : node instanceof AST_Conditional && (node.consequent = mangleStrings(node.consequent), node.alternative = mangleStrings(node.alternative));
                    return node;
                }));
            }
        }(toplevel, options.mangle.properties)), timings && (timings.format = Date.now());
        var result = {};
        if (options.format.ast && (result.ast = toplevel), options.format.spidermonkey && (result.ast = toplevel.to_mozilla_ast()), !HOP(options.format, "code") || options.format.code) {
            if (options.sourceMap && (options.format.source_map = await SourceMap({
                file: options.sourceMap.filename,
                orig: options.sourceMap.content,
                root: options.sourceMap.root
            }), options.sourceMap.includeSources)) {
                if (files instanceof AST_Toplevel) throw Error("original source content unavailable");
                for(var name in files)HOP(files, name) && options.format.source_map.get().setSourceContent(name, files[name]);
            }
            delete options.format.ast, delete options.format.code, delete options.format.spidermonkey;
            var stream = OutputStream(options.format);
            if (toplevel.print(stream), result.code = stream.get(), options.sourceMap) {
                if (options.sourceMap.asObject ? result.map = options.format.source_map.get().toJSON() : result.map = options.format.source_map.toString(), "inline" == options.sourceMap.url) {
                    var sourceMap = "object" == typeof result.map ? JSON.stringify(result.map) : result.map;
                    result.code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + to_base64(sourceMap);
                } else options.sourceMap.url && (result.code += "\n//# sourceMappingURL=" + options.sourceMap.url);
            }
        }
        return options.nameCache && options.mangle && (options.mangle.cache && (options.nameCache.vars = cache_to_json(options.mangle.cache)), options.mangle.properties && options.mangle.properties.cache && (options.nameCache.props = cache_to_json(options.mangle.properties.cache))), options.format && options.format.source_map && options.format.source_map.destroy(), timings && (timings.end = Date.now(), result.timings = {
            parse: 1e-3 * (timings.rename - timings.parse),
            rename: 1e-3 * (timings.compress - timings.rename),
            compress: 1e-3 * (timings.scope - timings.compress),
            scope: 1e-3 * (timings.mangle - timings.scope),
            mangle: 1e-3 * (timings.properties - timings.mangle),
            properties: 1e-3 * (timings.format - timings.properties),
            format: 1e-3 * (timings.end - timings.format),
            total: 1e-3 * (timings.end - timings.start)
        }), result;
    }
    async function run_cli({ program, packageJson, fs, path }) {
        let filesList;
        const skip_keys = new Set([
            "cname",
            "parent_scope",
            "scope",
            "uses_eval",
            "uses_with"
        ]);
        var base, files = {}, options = {
            compress: !1,
            mangle: !1
        };
        const default_options = await _default_options();
        if (program.version(packageJson.name + " " + packageJson.version), program.parseArgv = program.parse, program.parse = void 0, process.argv.includes("ast") ? program.helpInformation = function() {
            var out = OutputStream({
                beautify: !0
            });
            return function doitem(ctor) {
                out.print("AST_" + ctor.TYPE);
                const props = ctor.SELF_PROPS.filter((prop)=>!/^\$/.test(prop));
                props.length > 0 && (out.space(), out.with_parens(function() {
                    props.forEach(function(prop, i) {
                        i && out.space(), out.print(prop);
                    });
                })), ctor.documentation && (out.space(), out.print_string(ctor.documentation)), ctor.SUBCLASSES.length > 0 && (out.space(), out.with_block(function() {
                    ctor.SUBCLASSES.forEach(function(ctor) {
                        out.indent(), doitem(ctor), out.newline();
                    });
                }));
            }(AST_Node), out + "\n";
        } : process.argv.includes("options") && (program.helpInformation = function() {
            var text = [];
            for(var option in default_options)text.push("--" + ("sourceMap" === option ? "source-map" : option) + " options:"), text.push(format_object(default_options[option])), text.push("");
            return text.join("\n");
        }), program.option("-p, --parse <options>", "Specify parser options.", parse_js()), program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js()), program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js()), program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js()), program.option("-f, --format [options]", "Format options.", parse_js()), program.option("-b, --beautify [options]", "Alias for --format.", parse_js()), program.option("-o, --output <file>", "Output file (default STDOUT)."), program.option("--comments [filter]", "Preserve copyright comments in the output."), program.option("--config-file <file>", "Read minify() options from JSON file."), program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define")), program.option("--ecma <version>", "Specify ECMAScript release: 5, 2015, 2016 or 2017..."), program.option("-e, --enclose [arg[,...][:value[,...]]]", "Embed output in a big function with configurable arguments and values."), program.option("--ie8", "Support non-standard Internet Explorer 8."), program.option("--keep-classnames", "Do not mangle/drop class names."), program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name."), program.option("--module", "Input is an ES6 module"), program.option("--name-cache <file>", "File to hold mangled name mappings."), program.option("--rename", "Force symbol expansion."), program.option("--no-rename", "Disable symbol expansion."), program.option("--safari10", "Support non-standard Safari 10."), program.option("--source-map [options]", "Enable source map/specify source map options.", parse_js()), program.option("--timings", "Display operations run time on STDERR."), program.option("--toplevel", "Compress and/or mangle variables in toplevel scope."), program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally."), program.arguments("[files...]").parseArgv(process.argv), program.configFile && (options = JSON.parse(read_file(program.configFile))), !program.output && program.sourceMap && "inline" != program.sourceMap.url && fatal("ERROR: cannot write source map to STDOUT"), [
            "compress",
            "enclose",
            "ie8",
            "mangle",
            "module",
            "safari10",
            "sourceMap",
            "toplevel",
            "wrap"
        ].forEach(function(name) {
            name in program && (options[name] = program[name]);
        }), "ecma" in program) {
            program.ecma != (0 | program.ecma) && fatal("ERROR: ecma must be an integer");
            const ecma = 0 | program.ecma;
            ecma > 5 && ecma < 2015 ? options.ecma = ecma + 2009 : options.ecma = ecma;
        }
        if (program.format || program.beautify) {
            const chosenOption = program.format || program.beautify;
            options.format = "object" == typeof chosenOption ? chosenOption : {};
        }
        if (program.comments && ("object" != typeof options.format && (options.format = {}), options.format.comments = "string" == typeof program.comments ? "false" != program.comments && program.comments : "some"), program.define) for(var expr in "object" != typeof options.compress && (options.compress = {}), "object" != typeof options.compress.global_defs && (options.compress.global_defs = {}), program.define)options.compress.global_defs[expr] = program.define[expr];
        program.keepClassnames && (options.keep_classnames = !0), program.keepFnames && (options.keep_fnames = !0), program.mangleProps && (program.mangleProps.domprops ? delete program.mangleProps.domprops : ("object" != typeof program.mangleProps && (program.mangleProps = {}), Array.isArray(program.mangleProps.reserved) || (program.mangleProps.reserved = [])), "object" != typeof options.mangle && (options.mangle = {}), options.mangle.properties = program.mangleProps), program.nameCache && (options.nameCache = JSON.parse(read_file(program.nameCache, "{}"))), "ast" == program.output && (options.format = {
            ast: !0,
            code: !1
        }), program.parse && (program.parse.acorn || program.parse.spidermonkey ? program.sourceMap && "inline" == program.sourceMap.content && fatal("ERROR: inline source map only works with built-in parser") : options.parse = program.parse), ~program.rawArgs.indexOf("--rename") ? options.rename = !0 : program.rename || (options.rename = !1);
        let convert_path = (name)=>name;
        function convert_ast(fn) {
            return AST_Node.from_mozilla_ast(Object.keys(files).reduce(fn, null));
        }
        async function run_cli() {
            let result;
            var content = program.sourceMap && program.sourceMap.content;
            content && "inline" !== content && (options.sourceMap.content = read_file(content, content)), program.timings && (options.timings = !0);
            try {
                program.parse && (program.parse.acorn ? files = convert_ast(function(toplevel, name) {
                    return require("acorn").parse(files[name], {
                        ecmaVersion: 2018,
                        locations: !0,
                        program: toplevel,
                        sourceFile: name,
                        sourceType: options.module || program.parse.module ? "module" : "script"
                    });
                }) : program.parse.spidermonkey && (files = convert_ast(function(toplevel, name) {
                    var obj = JSON.parse(files[name]);
                    return toplevel ? (toplevel.body = toplevel.body.concat(obj.body), toplevel) : obj;
                })));
            } catch (ex) {
                fatal(ex);
            }
            try {
                result = await minify(files, options, fs);
            } catch (ex) {
                if ("SyntaxError" == ex.name) {
                    print_error("Parse error at " + ex.filename + ":" + ex.line + "," + ex.col);
                    var col = ex.col, lines = files[ex.filename].split(/\r?\n/), line = lines[ex.line - 1];
                    line || col || (col = (line = lines[ex.line - 2]).length), line && (col > 70 && (line = line.slice(col - 70), col = 70), print_error(line.slice(0, 80)), print_error(line.slice(0, col).replace(/\S/g, " ") + "^"));
                }
                ex.defs && (print_error("Supported options:"), print_error(format_object(ex.defs))), fatal(ex);
                return;
            }
            if ("ast" == program.output) options.compress || options.mangle || result.ast.figure_out_scope({}), console.log(JSON.stringify(result.ast, function(key, value) {
                if (value) switch(key){
                    case "thedef":
                        return symdef(value);
                    case "enclosed":
                        return value.length ? value.map(symdef) : void 0;
                    case "variables":
                    case "globals":
                        var callback, result;
                        return value.size ? (callback = symdef, result = [], value.forEach(function(def) {
                            result.push(callback(def));
                        }), result) : void 0;
                }
                if (!skip_keys.has(key) && !(value instanceof AST_Token) && !(value instanceof Map)) {
                    if (value instanceof AST_Node) {
                        var result1 = {
                            _class: "AST_" + value.TYPE
                        };
                        return value.block_scope && (result1.variables = value.block_scope.variables, result1.enclosed = value.block_scope.enclosed), value.CTOR.PROPS.forEach(function(prop) {
                            result1[prop] = value[prop];
                        }), result1;
                    }
                    return value;
                }
            }, 2));
            else if ("spidermonkey" == program.output) try {
                const minified = await minify(result.code, {
                    compress: !1,
                    mangle: !1,
                    format: {
                        ast: !0,
                        code: !1
                    }
                }, fs);
                console.log(JSON.stringify(minified.ast.to_mozilla_ast(), null, 2));
            } catch (ex) {
                fatal(ex);
                return;
            }
            else program.output ? (fs.writeFileSync(program.output, result.code), options.sourceMap && "inline" !== options.sourceMap.url && result.map && fs.writeFileSync(program.output + ".map", result.map)) : console.log(result.code);
            if (program.nameCache && fs.writeFileSync(program.nameCache, JSON.stringify(options.nameCache)), result.timings) for(var phase in result.timings)print_error("- " + phase + ": " + result.timings[phase].toFixed(3) + "s");
        }
        function fatal(message) {
            message instanceof Error && (message = message.stack.replace(/^\S*?Error:/, "ERROR:")), print_error(message), process.exit(1);
        }
        function read_file(path, default_value) {
            try {
                return fs.readFileSync(path, "utf8");
            } catch (ex) {
                if (("ENOENT" == ex.code || "ENAMETOOLONG" == ex.code) && null != default_value) return default_value;
                fatal(ex);
            }
        }
        function parse_js(flag) {
            return function(value, options) {
                options = options || {};
                try {
                    walk(parse(value, {
                        expression: !0
                    }), (node)=>{
                        if (node instanceof AST_Assign) {
                            var name = node.left.print_to_string(), value = node.right;
                            return flag ? options[name] = value : value instanceof AST_Array ? options[name] = value.elements.map(to_string) : value instanceof AST_RegExp ? (value = value.value, options[name] = new RegExp(value.source, value.flags)) : options[name] = to_string(value), !0;
                        }
                        if (node instanceof AST_Symbol || node instanceof AST_PropAccess) {
                            var name = node.print_to_string();
                            return options[name] = !0, !0;
                        }
                        if (!(node instanceof AST_Sequence)) throw node;
                        function to_string(value) {
                            return value instanceof AST_Constant ? value.getValue() : value.print_to_string({
                                quote_keys: !0
                            });
                        }
                    });
                } catch (ex) {
                    flag ? fatal("Error parsing arguments for '" + flag + "': " + value) : options[value] = null;
                }
                return options;
            };
        }
        function symdef(def) {
            var ret = 1e6 + def.id + " " + def.name;
            return def.mangled_name && (ret += " " + def.mangled_name), ret;
        }
        function format_object(obj) {
            var lines = [], padding = "";
            return Object.keys(obj).map(function(name) {
                return padding.length < name.length && (padding = Array(name.length + 1).join(" ")), [
                    name,
                    JSON.stringify(obj[name])
                ];
            }).forEach(function(tokens) {
                lines.push("  " + tokens[0] + padding.slice(tokens[0].length - 2) + tokens[1]);
            }), lines.join("\n");
        }
        function print_error(msg) {
            process.stderr.write(msg), process.stderr.write("\n");
        }
        "object" == typeof program.sourceMap && "base" in program.sourceMap && (base = program.sourceMap.base, delete options.sourceMap.base, convert_path = function(name) {
            return path.relative(base, name);
        }), options.files && options.files.length ? (filesList = options.files, delete options.files) : program.args.length && (filesList = program.args), filesList ? // A file glob function that only supports "*" and "?" wildcards in the basename.
        // Example: "foo/bar/*baz??.*.js"
        // Argument `glob` may be a string or an array of strings.
        // Returns an array of strings. Garbage in, garbage out.
        (function simple_glob(glob) {
            if (Array.isArray(glob)) return [].concat.apply([], glob.map(simple_glob));
            if (glob && glob.match(/[*?]/)) {
                var dir = path.dirname(glob);
                try {
                    var entries = fs.readdirSync(dir);
                } catch (ex) {}
                if (entries) {
                    var rx = RegExp("^" + path.basename(glob).replace(/[.+^$[\]\\(){}]/g, "\\$&").replace(/\*/g, "[^/\\\\]*").replace(/\?/g, "[^/\\\\]") + "$", "win32" === process.platform ? "i" : ""), results = entries.filter(function(name) {
                        return rx.test(name);
                    }).map(function(name) {
                        return path.join(dir, name);
                    });
                    if (results.length) return results;
                }
            }
            return [
                glob
            ];
        })(filesList).forEach(function(name) {
            files[convert_path(name)] = read_file(name);
        }) : await new Promise((resolve)=>{
            var chunks = [];
            process.stdin.setEncoding("utf8"), process.stdin.on("data", function(chunk) {
                chunks.push(chunk);
            }).on("end", function() {
                files = [
                    chunks.join("")
                ], resolve();
            }), process.stdin.resume();
        }), await run_cli();
    }
    async function _default_options() {
        const defs = {};
        return Object.keys(infer_options({
            0: 0
        })).forEach((component)=>{
            const options = infer_options({
                [component]: {
                    0: 0
                }
            });
            options && (defs[component] = options);
        }), defs;
    }
    async function infer_options(options) {
        try {
            await minify("", options);
        } catch (error) {
            return error.defs;
        }
    }
    exports1._default_options = _default_options, exports1._run_cli = run_cli, exports1.minify = minify;
});
