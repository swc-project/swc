export const obj = {
    parseXML: function(e) {
        var r, t;
        if (!e || typeof e !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                t = new DOMParser();
                r = t.parseFromString(e, "text/xml");
            } else {
                r = new ActiveXObject("Microsoft.XMLDOM");
                r.async = "false";
                r.loadXML(e);
            }
        } catch (n) {
            r = undefined;
        }
        if (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + e);
        }
        return r;
    }
};
