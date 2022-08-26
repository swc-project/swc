export const E = {
    test: function(e) {
        var t = e.config.doc, n = !e.config.defaultGraphicEngine || e.config.defaultGraphicEngine != "canvas", a = t && t.createElement("canvas"), c = t && t.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        return c && (n || !a);
    }
};
