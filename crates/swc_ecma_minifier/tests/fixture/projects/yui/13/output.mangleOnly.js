export const E = {
    _getTransaction: function(a, b) {
        var c = [], d, e, f, g;
        if (!Lang.isArray(a)) {
            a = [
                a
            ];
        }
        b = Y.merge(this.options, b);
        b.attributes = Y.merge(this.options.attributes, b.attributes);
        for(d = 0, e = a.length; d < e; ++d){
            g = a[d];
            f = {
                attributes: {}
            };
            if (typeof g === "string") {
                f.url = g;
            } else if (g.url) {
                Y.mix(f, g, false, null, 0, true);
                g = g.url;
            } else {
                continue;
            }
            Y.mix(f, b, false, null, 0, true);
            if (!f.type) {
                if (this.REGEX_CSS.test(g)) {
                    f.type = "css";
                } else {
                    if (!this.REGEX_JS.test(g)) {}
                    f.type = "js";
                }
            }
            Y.mix(f, f.type === "js" ? this.jsOptions : this.cssOptions, false, null, 0, true);
            f.attributes.id || (f.attributes.id = Y.guid());
            if (f.win) {
                f.doc = f.win.document;
            } else {
                f.win = f.doc.defaultView || f.doc.parentWindow;
            }
            if (f.charset) {
                f.attributes.charset = f.charset;
            }
            c.push(f);
        }
        return new Transaction(c, b);
    }
};
