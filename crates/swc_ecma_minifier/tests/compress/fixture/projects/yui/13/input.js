export const E = {
    _getTransaction: function (urls, options) {
        var requests = [],
            i, len, req, url;

        if (!Lang.isArray(urls)) {
            urls = [urls];
        }

        options = Y.merge(this.options, options);

        // Clone the attributes object so we don't end up modifying it by ref.
        options.attributes = Y.merge(this.options.attributes,
            options.attributes);

        for (i = 0, len = urls.length; i < len; ++i) {
            url = urls[i];
            req = { attributes: {} };

            // If `url` is a string, we create a URL object for it, then mix in
            // global options and request-specific options. If it's an object
            // with a "url" property, we assume it's a request object containing
            // URL-specific options.
            if (typeof url === 'string') {
                req.url = url;
            } else if (url.url) {
                // URL-specific options override both global defaults and
                // request-specific options.
                Y.mix(req, url, false, null, 0, true);
                url = url.url; // Make url a string so we can use it later.
            } else {
                continue;
            }

            Y.mix(req, options, false, null, 0, true);

            // If we didn't get an explicit type for this URL either in the
            // request options or the URL-specific options, try to determine
            // one from the file extension.
            if (!req.type) {
                if (this.REGEX_CSS.test(url)) {
                    req.type = 'css';
                } else {
                    if (!this.REGEX_JS.test(url)) {
                    }

                    req.type = 'js';
                }
            }

            // Mix in type-specific default options, but don't overwrite any
            // options that have already been set.
            Y.mix(req, req.type === 'js' ? this.jsOptions : this.cssOptions,
                false, null, 0, true);

            // Give the node an id attribute if it doesn't already have one.
            req.attributes.id || (req.attributes.id = Y.guid());

            // Backcompat for <3.5.0 behavior.
            if (req.win) {
                req.doc = req.win.document;
            } else {
                req.win = req.doc.defaultView || req.doc.parentWindow;
            }

            if (req.charset) {
                req.attributes.charset = req.charset;
            }

            requests.push(req);
        }

        return new Transaction(requests, options);
    },

}