export const E = {
    _getTransaction: function(urls, options) {
        var i, len, req, url, requests = [];
        for(Lang.isArray(urls) || (urls = [
            urls
        ]), // Clone the attributes object so we don't end up modifying it by ref.
        (options = Y.merge(this.options, options)).attributes = Y.merge(this.options.attributes, options.attributes), i = 0, len = urls.length; i < len; ++i){
            // If `url` is a string, we create a URL object for it, then mix in
            // global options and request-specific options. If it's an object
            // with a "url" property, we assume it's a request object containing
            // URL-specific options.
            if (url = urls[i], req = {
                attributes: {}
            }, "string" == typeof url) req.url = url;
            else {
                if (!url.url) continue;
                // URL-specific options override both global defaults and
                // request-specific options.
                Y.mix(req, url, !1, null, 0, !0), url = url.url;
            }
            Y.mix(req, options, !1, null, 0, !0), req.type || (this.REGEX_CSS.test(url) ? req.type = "css" : (this.REGEX_JS.test(url), req.type = "js")), // Mix in type-specific default options, but don't overwrite any
            // options that have already been set.
            Y.mix(req, "js" === req.type ? this.jsOptions : this.cssOptions, !1, null, 0, !0), // Give the node an id attribute if it doesn't already have one.
            req.attributes.id || (req.attributes.id = Y.guid()), req.win ? req.doc = req.win.document : req.win = req.doc.defaultView || req.doc.parentWindow, req.charset && (req.attributes.charset = req.charset), requests.push(req);
        }
        return new Transaction(requests, options);
    }
};
