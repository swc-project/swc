export const E = {
    test: function(a) {
        var b = a.config.doc, c = b ? b.documentElement : null;
        if (c && c.style) {
            return ("MozTransition" in c.style || "WebkitTransition" in c.style || "transition" in c.style);
        }
        return false;
    }
};
