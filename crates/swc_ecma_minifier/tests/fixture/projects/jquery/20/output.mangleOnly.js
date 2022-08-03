export const obj = {
    setRequestHeader: function(e, t) {
        var r = e.toLowerCase();
        if (!state) {
            e = requestHeadersNames[r] = requestHeadersNames[r] || e;
            requestHeaders[e] = t;
        }
        return this;
    }
};
