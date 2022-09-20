export const E = {
    _getTransaction: function(urls, options) {
        var i, len, req, url, requests = [];
        Lang.isArray(urls) || (urls = [
            urls
        ]);
        (options = Y.merge(this.options, options)).attributes = Y.merge(this.options.attributes, options.attributes);
        for(i = 0, len = urls.length; i < len; ++i){
            url = urls[i];
            req = {
                attributes: {}
            };
            if ("string" == typeof url) req.url = url;
            else {
                if (!url.url) continue;
                Y.mix(req, url, !1, null, 0, !0);
                url = url.url;
            }
            Y.mix(req, options, !1, null, 0, !0);
            if (!req.type) {
                if (this.REGEX_CSS.test(url)) req.type = "css";
                else {
                    this.REGEX_JS.test(url);
                    req.type = "js";
                }
            }
            Y.mix(req, "js" === req.type ? this.jsOptions : this.cssOptions, !1, null, 0, !0);
            req.attributes.id || (req.attributes.id = Y.guid());
            req.win ? req.doc = req.win.document : req.win = req.doc.defaultView || req.doc.parentWindow;
            req.charset && (req.attributes.charset = req.charset);
            requests.push(req);
        }
        return new Transaction(requests, options);
    }
};
