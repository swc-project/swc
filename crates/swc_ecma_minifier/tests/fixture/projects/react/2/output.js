ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
    currentExtraStackFrame = stack;
}, ReactDebugCurrentFrame.getCurrentStack = null, ReactDebugCurrentFrame.getStackAddendum = function() {
    var stack = ""; // Add an extra top frame while an element is being validated
    currentExtraStackFrame && (stack += currentExtraStackFrame);
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    return impl && (stack += impl() || ""), stack;
};
