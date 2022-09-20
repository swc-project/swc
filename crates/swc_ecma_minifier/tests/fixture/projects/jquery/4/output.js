export const obj = {
    parseXML: function(data) {
        var xml;
        if (!data || "string" != typeof data) return null;
        try {
            if (window.DOMParser) xml = new DOMParser().parseFromString(data, "text/xml");
            else {
                (xml = new ActiveXObject("Microsoft.XMLDOM")).async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = void 0;
        }
        return xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), xml;
    }
};
