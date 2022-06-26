function a() {}
function b() {
    var b = this.$$lastCommittedViewValue;
    var c = b;
    return a(c) ? c : null;
}
