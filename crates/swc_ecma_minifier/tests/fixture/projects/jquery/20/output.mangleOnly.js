export const obj = {
    setRequestHeader: function(e, t) {
        var o = e.toLowerCase();
        if (!state) {
            e = requestHeadersNames[o] = requestHeadersNames[o] || e;
            requestHeaders[e] = t;
        }
        return this;
    }
};
