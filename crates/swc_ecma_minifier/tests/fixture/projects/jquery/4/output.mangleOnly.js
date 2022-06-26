export const obj = {
    parseXML: function(a) {
        var b, c;
        if (!a || typeof a !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                c = new DOMParser();
                b = c.parseFromString(a, "text/xml");
            } else {
                b = new ActiveXObject("Microsoft.XMLDOM");
                b.async = "false";
                b.loadXML(a);
            }
        } catch (d) {
            b = undefined;
        }
        if (!b || !b.documentElement || b.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + a);
        }
        return b;
    }
};
