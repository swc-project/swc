export const E = {
    _getTransaction: function(t, e) {
        var i = [], s, r, n, u;
        if (!Lang.isArray(t)) {
            t = [
                t
            ];
        }
        e = Y.merge(this.options, e);
        e.attributes = Y.merge(this.options.attributes, e.attributes);
        for(s = 0, r = t.length; s < r; ++s){
            u = t[s];
            n = {
                attributes: {}
            };
            if (typeof u === "string") {
                n.url = u;
            } else if (u.url) {
                Y.mix(n, u, false, null, 0, true);
                u = u.url;
            } else {
                continue;
            }
            Y.mix(n, e, false, null, 0, true);
            if (!n.type) {
                if (this.REGEX_CSS.test(u)) {
                    n.type = "css";
                } else {
                    if (!this.REGEX_JS.test(u)) {}
                    n.type = "js";
                }
            }
            Y.mix(n, n.type === "js" ? this.jsOptions : this.cssOptions, false, null, 0, true);
            n.attributes.id || (n.attributes.id = Y.guid());
            if (n.win) {
                n.doc = n.win.document;
            } else {
                n.win = n.doc.defaultView || n.doc.parentWindow;
            }
            if (n.charset) {
                n.attributes.charset = n.charset;
            }
            i.push(n);
        }
        return new Transaction(i, e);
    }
};
