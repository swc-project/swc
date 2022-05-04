(function () {
    {
        ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
            {
                currentExtraStackFrame = stack;
            }
        }; // Stack implementation injected by the current renderer.

        ReactDebugCurrentFrame.getCurrentStack = null;

        ReactDebugCurrentFrame.getStackAddendum = function () {
            var stack = ""; // Add an extra top frame while an element is being validated

            if (currentExtraStackFrame) {
                stack += currentExtraStackFrame;
            } // Delegate to the injected renderer-specific implementation

            var impl = ReactDebugCurrentFrame.getCurrentStack;

            if (impl) {
                stack += impl() || "";
            }

            return stack;
        };
    }
})();
