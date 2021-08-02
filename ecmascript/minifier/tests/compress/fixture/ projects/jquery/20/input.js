export const obj = {
    setRequestHeader: function (name, value) {
        var lname = name.toLowerCase();
        if (!state) {
            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
            requestHeaders[name] = value;
        }
        return this;
    },
}