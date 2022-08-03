function r(r) {
    function n(r) {
        if (r !== undefined) {
            var n = r.fileName.replace(/^.*[\\\/]/, "");
            var e = r.lineNumber;
            return ("\n\nCheck your code at " + n + ":" + e + ".");
        }
        return "";
    }
    if (r !== null && r !== undefined) {
        return n(r.__source);
    }
    return "";
}
