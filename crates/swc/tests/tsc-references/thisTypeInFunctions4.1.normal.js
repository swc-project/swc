//// [thisTypeInFunctions4.ts]
function problemFunction() {
    var _this = this;
    //check type
    if (!isCorrect(this)) return;
    callsCallback(function(name) {
        _this.name = name; //should not error
    });
}
