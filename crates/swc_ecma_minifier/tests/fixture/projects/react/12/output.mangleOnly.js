function a(a) {
    function b(a) {
        if (a !== undefined) {
            var b = a.fileName.replace(/^.*[\\\/]/, "");
            var c = a.lineNumber;
            return ("\n\nCheck your code at " + b + ":" + c + ".");
        }
        return "";
    }
    if (a !== null && a !== undefined) {
        return b(a.__source);
    }
    return "";
}
