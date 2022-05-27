export const obj = {
    parseXML: function(b) {
        var a, c;
        if (!b || typeof b !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                c = new DOMParser();
                a = c.parseFromString(b, "text/xml");
            } else {
                a = new ActiveXObject("Microsoft.XMLDOM");
                a.async = "false";
                a.loadXML(b);
            }
        } catch (d) {
            a = undefined;
        }
        if (!a || !a.documentElement || a.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + b);
        }
        return a;
    }
};
