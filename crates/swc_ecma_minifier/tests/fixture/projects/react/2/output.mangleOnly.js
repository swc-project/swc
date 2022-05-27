(function() {
    {
        ReactDebugCurrentFrame.setExtraStackFrame = function(a) {
            {
                currentExtraStackFrame = a;
            }
        };
        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFrame.getStackAddendum = function() {
            var a = "";
            if (currentExtraStackFrame) {
                a += currentExtraStackFrame;
            }
            var b = ReactDebugCurrentFrame.getCurrentStack;
            if (b) {
                a += b() || "";
            }
            return a;
        };
    }
})();
