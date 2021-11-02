export const E = {
    test: function(Y) {
        var DOCUMENT = Y.config.doc, useSVG = !Y.config.defaultGraphicEngine || "canvas" != Y.config.defaultGraphicEngine, canvas = DOCUMENT && DOCUMENT.createElement("canvas"), svg = DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        return svg && (useSVG || !canvas);
    }
};
