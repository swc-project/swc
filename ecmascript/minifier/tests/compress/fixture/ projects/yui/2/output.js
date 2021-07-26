export const E = {
    test: function(Y) {
        var doc = Y.config.doc, node = doc ? doc.documentElement : null;
        return !!node && !!node.style && ('MozTransition' in node.style || 'WebkitTransition' in node.style || 'transition' in node.style);
    }
};
