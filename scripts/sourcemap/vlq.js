(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? factory(exports)
        : typeof define === "function" && define.amd
        ? define(["exports"], factory)
        : ((global =
              typeof globalThis !== "undefined" ? globalThis : global || self),
          factory((global.vlq = {})));
})(this, function (exports) {
    "use strict";

    /** @type {Record<string, number>} */
    let char_to_integer = {};

    /** @type {Record<number, string>} */
    let integer_to_char = {};

    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        .split("")
        .forEach(function (char, i) {
            char_to_integer[char] = i;
            integer_to_char[i] = char;
        });

    /** @param {string} string */
    function decode(string) {
        /** @type {number[]} */
        let result = [];

        let shift = 0;
        let value = 0;

        for (let i = 0; i < string.length; i += 1) {
            let integer = char_to_integer[string[i]];

            if (integer === undefined) {
                throw new Error("Invalid character (" + string[i] + ")");
            }

            const has_continuation_bit = integer & 32;

            integer &= 31;
            value += integer << shift;

            if (has_continuation_bit) {
                shift += 5;
            } else {
                const should_negate = value & 1;
                value >>>= 1;

                if (should_negate) {
                    result.push(value === 0 ? -0x80000000 : -value);
                } else {
                    result.push(value);
                }

                // reset
                value = shift = 0;
            }
        }

        return result;
    }

    /** @param {number | number[]} value */
    function encode(value) {
        if (typeof value === "number") {
            return encode_integer(value);
        }

        let result = "";
        for (let i = 0; i < value.length; i += 1) {
            result += encode_integer(value[i]);
        }

        return result;
    }

    /** @param {number} num */
    function encode_integer(num) {
        let result = "";

        if (num < 0) {
            num = (-num << 1) | 1;
        } else {
            num <<= 1;
        }

        do {
            let clamped = num & 31;
            num >>>= 5;

            if (num > 0) {
                clamped |= 32;
            }

            result += integer_to_char[clamped];
        } while (num > 0);

        return result;
    }

    exports.decode = decode;
    exports.encode = encode;

    Object.defineProperty(exports, "__esModule", { value: true });
});
