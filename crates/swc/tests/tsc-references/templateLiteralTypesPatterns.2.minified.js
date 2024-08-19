//// [templateLiteralTypesPatterns.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
bools("true"), bools("false"), bools("other"), nullishes("null"), nullishes("undefined"), nullishes("0"), nullishes("false"), nullishes("NaN"), nullishes(""), nullishes("other"), numbers("1"), numbers("-1"), numbers("0"), numbers("0b1"), numbers("0x1"), numbers("0o1"), numbers("1e21"), numbers("1E21"), numbers("1e-21"), numbers("1E-21"), numbers("1.1"), numbers("-1.1"), numbers("-1.1e-10"), numbers("-1.1E-10"), numbers("1.1e-10"), numbers("?"), numbers("NaN"), numbers("Infinity"), numbers("+Infinity"), numbers("-Infinity"), numbers("1_000"), numbers("a10"), numbers("10a"), numbers("- 1"), numbers("-/**/1"), bigints("1"), bigints("-1"), bigints("0"), bigints("0b1"), bigints("0x1"), bigints("0o1"), bigints("1e21"), bigints("1E21"), bigints("1e-21"), bigints("1E-21"), bigints("1.0"), bigints("1.1"), bigints("-1.1"), bigints("-1.1e-10"), bigints("-1.1E-10"), bigints("1.1e-10"), bigints("?"), bigints("NaN"), bigints("Infinity"), bigints("+Infinity"), bigints("-Infinity"), bigints("1_000"), bigints("- 1"), bigints("-/**/1"), bigints("a10n"), bigints("10an"), bigints("1n"), bigints("-1n"), bigints("0n"), bigints("0b1n"), bigints("0x1n"), bigints("0o1n"), bigints("1e21n"), bigints("1E21n"), bigints("1e-21n"), bigints("1E-21n"), bigints("1.1n"), bigints("-1.1n"), bigints("-1.1e-10n"), bigints("-1.1E-10n"), bigints("1.1e-10n"), anyish = "bno", str = anyish = str = num = str, num = anyish = num, anyish = "aok";
export var AA = function AA() {
    _class_call_check(this, AA);
};
export var BB = /*#__PURE__*/ function() {
    function BB() {
        _class_call_check(this, BB);
    }
    return BB.prototype.update = function(id) {
        this.get(id);
    }, BB;
}();
