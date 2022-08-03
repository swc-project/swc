export const E = {
    test: function(t) {
        var e = t.config.doc, n = e ? e.documentElement : null;
        if (n && n.style) {
            return ("MozTransition" in n.style || "WebkitTransition" in n.style || "transition" in n.style);
        }
        return false;
    }
};
