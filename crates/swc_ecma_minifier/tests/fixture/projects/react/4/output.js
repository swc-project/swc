function printWarning(level, format, args) {
    var stack = ReactSharedInternals.ReactDebugCurrentFrame.getStackAddendum();
    '' !== stack && (format += '%s', args = args.concat([
        stack
    ]));
    var argsWithFormat = args.map(function(item) {
        return '' + item;
    });
    argsWithFormat.unshift('Warning: ' + format), Function.prototype.apply.call(console[level], console, argsWithFormat);
}
