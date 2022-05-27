export const E = {
    _getTransaction: function(d, c) {
        var f = [], e, g, a, b;
        if (!Lang.isArray(d)) {
            d = [
                d
            ];
        }
        c = Y.merge(this.options, c);
        c.attributes = Y.merge(this.options.attributes, c.attributes);
        for(e = 0, g = d.length; e < g; ++e){
            b = d[e];
            a = {
                attributes: {}
            };
            if (typeof b === "string") {
                a.url = b;
            } else if (b.url) {
                Y.mix(a, b, false, null, 0, true);
                b = b.url;
            } else {
                continue;
            }
            Y.mix(a, c, false, null, 0, true);
            if (!a.type) {
                if (this.REGEX_CSS.test(b)) {
                    a.type = "css";
                } else {
                    if (!this.REGEX_JS.test(b)) {}
                    a.type = "js";
                }
            }
            Y.mix(a, a.type === "js" ? this.jsOptions : this.cssOptions, false, null, 0, true);
            a.attributes.id || (a.attributes.id = Y.guid());
            if (a.win) {
                a.doc = a.win.document;
            } else {
                a.win = a.doc.defaultView || a.doc.parentWindow;
            }
            if (a.charset) {
                a.attributes.charset = a.charset;
            }
            f.push(a);
        }
        return new Transaction(f, c);
    }
};
