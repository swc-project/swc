function getSourceInfoErrorAddendumForProps(elementProps) {
    function getSourceInfoErrorAddendum(source) {
        if (source !== undefined) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return (
                "\n\nCheck your code at " + fileName + ":" + lineNumber + "."
            );
        }

        return "";
    }

    if (elementProps !== null && elementProps !== undefined) {
        return getSourceInfoErrorAddendum(elementProps.__source);
    }

    return "";
}
