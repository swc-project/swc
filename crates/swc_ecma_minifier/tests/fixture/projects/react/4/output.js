function printWarning(level, format, args) {
    var stack = ReactSharedInternals.ReactDebugCurrentFrame.getStackAddendum();
    "" !== stack && (format += "%s", args = args.concat([
        stack
    ]));
    var argsWithFormat = args.map(function(item) {
        return "" + item;
    }); // Careful: RN currently depends on this prefix
    argsWithFormat.unshift("Warning: " + format), // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging
    Function.prototype.apply.call(console[level], console, argsWithFormat);
}
