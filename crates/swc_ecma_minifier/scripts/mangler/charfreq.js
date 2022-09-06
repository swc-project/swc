const terser = require("terser");
const fs = require("fs");

const src = fs.readFileSync(process.argv[2], "utf8");

const base54 = (() => {
    const leading =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_".split("");
    const digits = "0123456789".split("");
    let chars;
    let frequency;
    function reset() {
        frequency = new Map();
        leading.forEach(function (ch) {
            frequency.set(ch, 0);
        });
        digits.forEach(function (ch) {
            frequency.set(ch, 0);
        });
    }
    function consider(str, delta) {
        console.log(`considering ${str} with delta ${delta}`);
        for (var i = str.length; --i >= 0; ) {
            frequency.set(str[i], frequency.get(str[i]) + delta);
        }
    }
    function compare(a, b) {
        return frequency.get(b) - frequency.get(a);
    }
    function sort() {
        chars = mergeSort(leading, compare).concat(mergeSort(digits, compare));
    }
    // Ensure this is in a usable initial state.
    reset();
    sort();
    function base54(num) {
        var ret = "",
            base = 54;
        num++;
        do {
            num--;
            ret += chars[num % base];
            num = Math.floor(num / base);
            base = 64;
        } while (num > 0);
        return ret;
    }

    return {
        get: base54,
        consider,
        reset,
        sort() {
            sort();
            console.log(chars.join(""));
        },
    };
})();

terser.minify(src, {
    compress: false,
    mangle: {
        toplevel: true,
        nth_identifier: base54,
    },
});

function mergeSort(array, cmp) {
    if (array.length < 2) return array.slice();
    function merge(a, b) {
        var r = [],
            ai = 0,
            bi = 0,
            i = 0;
        while (ai < a.length && bi < b.length) {
            cmp(a[ai], b[bi]) <= 0 ? (r[i++] = a[ai++]) : (r[i++] = b[bi++]);
        }
        if (ai < a.length) r.push.apply(r, a.slice(ai));
        if (bi < b.length) r.push.apply(r, b.slice(bi));
        return r;
    }
    function _ms(a) {
        if (a.length <= 1) return a;
        var m = Math.floor(a.length / 2),
            left = a.slice(0, m),
            right = a.slice(m);
        left = _ms(left);
        right = _ms(right);
        return merge(left, right);
    }
    return _ms(array);
}
