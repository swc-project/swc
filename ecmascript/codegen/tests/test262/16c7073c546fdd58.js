// prevent optimization because of this.constructor.arguments access
new function() {
    var a = 1;
    this.arguments;
};
