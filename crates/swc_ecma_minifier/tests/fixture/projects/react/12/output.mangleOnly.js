function e(e) {
    function n(e) {
        if (e !== undefined) {
            var n = e.fileName.replace(/^.*[\\\/]/, "");
            var r = e.lineNumber;
            return ("\n\nCheck your code at " + n + ":" + r + ".");
        }
        return "";
    }
    if (e !== null && e !== undefined) {
        return n(e.__source);
    }
    return "";
}
