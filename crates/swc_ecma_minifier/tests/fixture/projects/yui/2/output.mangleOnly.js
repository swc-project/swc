export const E = {
    test: function(c) {
        var b = c.config.doc, a = b ? b.documentElement : null;
        if (a && a.style) {
            return ("MozTransition" in a.style || "WebkitTransition" in a.style || "transition" in a.style);
        }
        return false;
    }
};
