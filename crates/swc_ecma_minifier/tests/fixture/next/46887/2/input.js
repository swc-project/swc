
export var CSL = {};

CSL.setupXml = function (xmlObject) {
    var dataObj = {};
    var parser = null;
    if ("undefined" !== typeof xmlObject) {
        if ("string" === typeof xmlObject) {
            xmlObject = xmlObject.replace("^\uFEFF", "")
                .replace(/^\s+/, "");
            if (xmlObject.slice(0, 1) === "<") {
                // Assume serialized XML
                dataObj = CSL.parseXml(xmlObject);
            } else {
                // Assume serialized JSON
                dataObj = JSON.parse(xmlObject);
            }
            parser = new CSL.XmlJSON(dataObj);
        } else if ("undefined" !== typeof xmlObject.getAttribute) {
            // Assume DOM instance
            parser = new CSL.XmlDOM(xmlObject);
        } else if ("undefined" !== typeof xmlObject.toXMLString) {
            // Assume E4X object
            parser = new CSL.XmlE4X(xmlObject);
        } else {
            // Assume JS object
            parser = new CSL.XmlJSON(xmlObject);
        }
    } else {
        CSL.error("unable to parse XML input");
    }
    if (!parser) {
        CSL.error("citeproc-js error: unable to parse CSL style or locale object");
    }
    return parser;
};
