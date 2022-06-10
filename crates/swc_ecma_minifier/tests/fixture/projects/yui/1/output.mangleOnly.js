export const E = {
    test: function(b) {
        var a = b.config.doc, c = !b.config.defaultGraphicEngine || b.config.defaultGraphicEngine != "canvas", d = a && a.createElement("canvas"), e = a && a.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        return e && (c || !d);
    }
};
