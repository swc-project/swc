export const E = {
    test: function(a) {
        var b = a.config.doc, c = !a.config.defaultGraphicEngine || a.config.defaultGraphicEngine != "canvas", d = b && b.createElement("canvas"), e = b && b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        return e && (c || !d);
    }
};
