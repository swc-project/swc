function r(r) {
    function e(r) {
        if (r !== undefined) {
            var e = r.fileName.replace(/^.*[\\\/]/, "");
            var n = r.lineNumber;
            return ("\n\nCheck your code at " + e + ":" + n + ".");
        }
        return "";
    }
    if (r !== null && r !== undefined) {
        return e(r.__source);
    }
    return "";
}
