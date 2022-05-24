import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// ok
var a = "/bin";
// not ok
var b = "no slash";
function download(hostSpec) {}
// ok, has protocol
download("http://example.com/protocol");
// issues error - no protocol
download("example.com/noprotocol");
// issues error, incorrect protocol
download("gopher://example.com/protocol");
var q = true;
// ok
bools("true");
bools("false");
// not ok
bools("other");
// ok
nullishes("null");
nullishes("undefined");
// not ok
nullishes("0");
nullishes("false");
nullishes("NaN");
nullishes("");
nullishes("other");
// the following should work
numbers("1");
numbers("-1");
numbers("0");
numbers("0b1");
numbers("0x1");
numbers("0o1");
numbers("1e21");
numbers("1E21");
numbers("1e-21");
numbers("1E-21");
numbers("1.1");
numbers("-1.1");
numbers("-1.1e-10");
numbers("-1.1E-10");
numbers("1.1e-10");
// the following should be errors since they're not numbers
numbers("?");
numbers("NaN");
numbers("Infinity");
numbers("+Infinity");
numbers("-Infinity");
numbers("1_000");
// the following should be errors since they don't match the pattern
numbers("a10");
numbers("10a");
// whitespace and comments aren't part of numbers
numbers("- 1");
numbers("-/**/1");
// the following should work
bigints("1");
bigints("-1");
bigints("0");
bigints("0b1");
bigints("0x1");
bigints("0o1");
// bigints do not allow scientific notation in their parsing/scanning, so these are all errors
bigints("1e21");
bigints("1E21");
bigints("1e-21");
bigints("1E-21");
// these are all errors because they're not big_int_s
bigints("1.0");
bigints("1.1");
bigints("-1.1");
bigints("-1.1e-10");
bigints("-1.1E-10");
bigints("1.1e-10");
// the following should be errors since they're not numbers
bigints("?");
bigints("NaN");
bigints("Infinity");
bigints("+Infinity");
bigints("-Infinity");
bigints("1_000");
// whitespace and comments aren't part of numbers
bigints("- 1");
bigints("-/**/1");
// the following should be errors since they don't match the pattern
bigints("a10n");
bigints("10an");
// the following should all be errors because the `BigInt` constructor (and thus bigint parsing) doesn't take the trailing `n` used in literals
bigints("1n");
bigints("-1n");
bigints("0n");
bigints("0b1n");
bigints("0x1n");
bigints("0o1n");
bigints("1e21n");
bigints("1E21n");
bigints("1e-21n");
bigints("1E-21n");
bigints("1.1n");
bigints("-1.1n");
bigints("-1.1e-10n");
bigints("-1.1E-10n");
bigints("1.1e-10n");
// not ok
num = str;
anyish = "bno";
// ok
str = num;
anyish = str;
str = anyish;
anyish = num;
num = anyish;
anyish = "aok";
var shouldWork1 = null;
var shouldWork2 = null;
var exampleBad = "anything"; // fails
var exampleGood = "1 2"; // ok
// Repro from #41161
var aa;
var aa;
// Remove string literals from unions with matching template literals
var t1; // `foo${string}` | '1foo'
var t2; // `foo${string}` | '1foo' | 'xfoo'
var t3; // `foo${string}` | xfoo' | `${number}foo`
var bb;
var bb;
function ff1(x) {
    var s1 = x && 42; // number
    var s2 = x || 42; // `${string}-${string}`
}
export var AA = function AA() {
    "use strict";
    _class_call_check(this, AA);
};
export var BB = /*#__PURE__*/ function() {
    "use strict";
    function BB() {
        _class_call_check(this, BB);
    }
    var _proto = BB.prototype;
    _proto.update = function update(id) {
        this.get(id);
    };
    return BB;
}();
