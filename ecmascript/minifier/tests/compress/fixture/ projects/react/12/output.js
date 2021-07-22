function getSourceInfoErrorAddendumForProps(elementProps) {
    return null != elementProps && void 0 !== (source = elementProps.__source) ? '\n\nCheck your code at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + '.' : '';
    var source;
}
