//@module: commonjs
//@target: ES3
// @filename: m1.ts
var R;
export default R = {
    "___": 30,
    "___hello": 21,
    "_hi": 40
};
// @filename: m2.ts
import R from "./m1";
var ___ = R.___, ___hello = R.___hello, _hi = R._hi;
