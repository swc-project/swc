ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
    currentExtraStackFrame = stack;
}, ReactDebugCurrentFrame.getCurrentStack = null, ReactDebugCurrentFrame.getStackAddendum = function() {
    var stack = "";
    currentExtraStackFrame && (stack += currentExtraStackFrame);
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    return impl && (stack += impl() || ""), stack;
};
