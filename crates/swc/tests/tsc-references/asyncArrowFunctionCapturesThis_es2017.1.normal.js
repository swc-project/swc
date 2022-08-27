//// [asyncArrowFunctionCapturesThis_es2017.ts]
class C {
    method() {
        var fn = async ()=>await this;
    }
}
