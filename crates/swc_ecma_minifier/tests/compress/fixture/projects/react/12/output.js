function getSourceInfoErrorAddendumForProps(elementProps) {
    return null != elementProps ? function(source) {
        if (void 0 !== source) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, ''), lineNumber = source.lineNumber;
            return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
        }
        return '';
    }(elementProps.__source) : '';
}
