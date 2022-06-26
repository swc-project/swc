export const obj = {
    setRequestHeader: function(a, b) {
        var c = a.toLowerCase();
        if (!state) {
            a = requestHeadersNames[c] = requestHeadersNames[c] || a;
            requestHeaders[a] = b;
        }
        return this;
    }
};
