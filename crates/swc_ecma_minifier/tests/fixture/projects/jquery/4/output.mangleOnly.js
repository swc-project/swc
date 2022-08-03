export const obj = {
    parseXML: function(e) {
        var r, n;
        if (!e || typeof e !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                n = new DOMParser();
                r = n.parseFromString(e, "text/xml");
            } else {
                r = new ActiveXObject("Microsoft.XMLDOM");
                r.async = "false";
                r.loadXML(e);
            }
        } catch (t) {
            r = undefined;
        }
        if (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + e);
        }
        return r;
    }
};
