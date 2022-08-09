export const E = {
    test: function(e) {
        var n = e.config.doc, t = !e.config.defaultGraphicEngine || e.config.defaultGraphicEngine != "canvas", i = n && n.createElement("canvas"), a = n && n.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        return a && (t || !i);
    }
};
