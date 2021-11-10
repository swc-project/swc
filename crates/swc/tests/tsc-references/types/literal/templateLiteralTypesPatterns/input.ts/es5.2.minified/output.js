function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function download(hostSpec) {
}
download("http://example.com/protocol"), download("example.com/noprotocol"), download("gopher://example.com/protocol"), bools("true"), bools("false"), bools("other"), nullishes("null"), nullishes("undefined"), nullishes("0"), nullishes("false"), nullishes("NaN"), nullishes(""), nullishes("other"), numbers("1"), numbers("-1"), numbers("0"), numbers("0b1"), numbers("0x1"), numbers("0o1"), numbers("1e21"), numbers("1E21"), numbers("1e-21"), numbers("1E-21"), numbers("1.1"), numbers("-1.1"), numbers("-1.1e-10"), numbers("-1.1E-10"), numbers("1.1e-10"), numbers("?"), numbers("NaN"), numbers("Infinity"), numbers("+Infinity"), numbers("-Infinity"), numbers("1_000"), numbers("a10"), numbers("10a"), numbers("- 1"), numbers("-/**/1"), bigints("1"), bigints("-1"), bigints("0"), bigints("0b1"), bigints("0x1"), bigints("0o1"), bigints("1e21"), bigints("1E21"), bigints("1e-21"), bigints("1E-21"), bigints("1.0"), bigints("1.1"), bigints("-1.1"), bigints("-1.1e-10"), bigints("-1.1E-10"), bigints("1.1e-10"), bigints("?"), bigints("NaN"), bigints("Infinity"), bigints("+Infinity"), bigints("-Infinity"), bigints("1_000"), bigints("- 1"), bigints("-/**/1"), bigints("a10n"), bigints("10an"), bigints("1n"), bigints("-1n"), bigints("0n"), bigints("0b1n"), bigints("0x1n"), bigints("0o1n"), bigints("1e21n"), bigints("1E21n"), bigints("1e-21n"), bigints("1E-21n"), bigints("1.1n"), bigints("-1.1n"), bigints("-1.1e-10n"), bigints("-1.1E-10n"), bigints("1.1e-10n"), anyish = "bno", str = anyish = str = num = str, anyish = num, num = anyish, anyish = "aok";
export var AA = function() {
    "use strict";
    _classCallCheck(this, AA);
};
export var BB = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function BB() {
        _classCallCheck(this, BB);
    }
    return Constructor = BB, protoProps = [
        {
            key: "update",
            value: function(id) {
                this.get(id);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), BB;
}();
