export const obj = {
    setRequestHeader: function(e, s) {
        var t = e.toLowerCase();
        if (!state) {
            e = requestHeadersNames[t] = requestHeadersNames[t] || e;
            requestHeaders[e] = s;
        }
        return this;
    }
};
