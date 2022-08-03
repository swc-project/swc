(function() {
    {
        ReactDebugCurrentFrame.setExtraStackFrame = function(t) {
            {
                currentExtraStackFrame = t;
            }
        };
        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFrame.getStackAddendum = function() {
            var t = "";
            if (currentExtraStackFrame) {
                t += currentExtraStackFrame;
            }
            var n = ReactDebugCurrentFrame.getCurrentStack;
            if (n) {
                t += n() || "";
            }
            return t;
        };
    }
})();
