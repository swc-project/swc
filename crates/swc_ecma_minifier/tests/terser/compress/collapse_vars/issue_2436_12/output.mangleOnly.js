function a() {}
function b() {
    var c = this.$$lastCommittedViewValue;
    var b = c;
    return a(b) ? b : null;
}
