import "core-js/modules/es.regexp.constructor.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.regexp.to-string.js";
var a = _wrap_reg_exp(RegExp("(\\d{4})-(\\d{2})-(\\d{2})", "u"), {
    year: 1,
    month: 2,
    day: 3
});
var b = RegExp(".", "s");
var c = RegExp(".", "imsuy");
console.log(a.unicode);
console.log(b.dotAll);
console.log(c.sticky);
console.log(c.ignoreCase);
