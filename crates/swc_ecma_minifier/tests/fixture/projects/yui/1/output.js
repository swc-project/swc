export const E = {
    test: function(Y) {
        var DOCUMENT = Y.config.doc, useSVG = !Y.config.defaultGraphicEngine || "canvas" != Y.config.defaultGraphicEngine, canvas = DOCUMENT && DOCUMENT.createElement("canvas");
        return DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (useSVG || !canvas);
    }
};
