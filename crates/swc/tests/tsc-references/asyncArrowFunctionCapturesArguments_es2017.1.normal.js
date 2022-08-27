//// [asyncArrowFunctionCapturesArguments_es2017.ts]
class C {
    method() {
        function other() {}
        var fn = async ()=>await other.apply(this, arguments);
    }
}
