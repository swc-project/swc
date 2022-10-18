function getSourceInfoErrorAddendumForProps(elementProps) {
    if (null != elementProps) {
        var source;
        return void 0 !== (source = elementProps.__source) ? "\n\nCheck your code at " + source.fileName.replace(/^.*[\\\/]/, "") + ":" + source.lineNumber + "." : "";
    }
    return "";
}
