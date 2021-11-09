var tmp = "computedname", tmp1 = "computedname1", tmp2 = "computedname2", tmp3 = "computedname3", tmp4 = "computedname4", tmp5 = "computedname";
// @target:es6
class C {
    get name() {
        return this._name;
    }
    static get name2() {
        return "BYE";
    }
    static get [tmp]() {
        return "";
    }
    get [tmp1]() {
        return "";
    }
    get [tmp2]() {
        return "";
    }
    set [tmp3](x) {
    }
    set [tmp4](y) {
    }
    set foo(a) {
    }
    static set bar(b) {
    }
    static set [tmp5](b1) {
    }
}
