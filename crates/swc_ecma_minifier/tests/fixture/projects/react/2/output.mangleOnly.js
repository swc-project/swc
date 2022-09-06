(function() {
    {
        ReactDebugCurrentFrame.setExtraStackFrame = function(r) {
            {
                currentExtraStackFrame = r;
            }
        };
        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFrame.getStackAddendum = function() {
            var r = "";
            if (currentExtraStackFrame) {
                r += currentExtraStackFrame;
            }
            var t = ReactDebugCurrentFrame.getCurrentStack;
            if (t) {
                r += t() || "";
            }
            return r;
        };
    }
})();
