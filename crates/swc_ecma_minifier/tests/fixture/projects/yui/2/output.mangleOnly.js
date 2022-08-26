export const E = {
    test: function(n) {
        var t = n.config.doc, e = t ? t.documentElement : null;
        if (e && e.style) {
            return ("MozTransition" in e.style || "WebkitTransition" in e.style || "transition" in e.style);
        }
        return false;
    }
};
