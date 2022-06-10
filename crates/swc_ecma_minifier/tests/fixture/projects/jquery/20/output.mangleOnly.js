export const obj = {
    setRequestHeader: function(a, c) {
        var b = a.toLowerCase();
        if (!state) {
            a = requestHeadersNames[b] = requestHeadersNames[b] || a;
            requestHeaders[a] = c;
        }
        return this;
    }
};
