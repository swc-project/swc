export const obj = {
    parseXML: function(data) {
        var xml;
        if (!data || "string" != typeof data) return null;
        try {
            window.DOMParser ? xml = new DOMParser().parseFromString(data, "text/xml") : (// IE
            (xml = new ActiveXObject("Microsoft.XMLDOM")).async = "false", xml.loadXML(data));
        } catch (e) {
            xml = void 0;
        }
        return xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), xml;
    }
};
