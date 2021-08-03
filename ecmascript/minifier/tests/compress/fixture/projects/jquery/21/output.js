jQuery.fn.load = function(url, params, callback) {
    if ("string" != typeof url && _load) return _load.apply(this, arguments);
    var selector, response, type, self = this, off = url.indexOf(" ");
    return off >= 0 && (selector = url.slice(off, url.length), url = url.slice(0, off)), jQuery.isFunction(params) ? (callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), self.length > 0 && jQuery.ajax({
        url: url,
        type: type,
        dataType: "html",
        data: params
    }).done(function(responseText) {
        response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
    }).complete(callback && function(jqXHR, status) {
        self.each(callback, response || [
            jqXHR.responseText,
            status,
            jqXHR
        ]);
    }), this;
};
