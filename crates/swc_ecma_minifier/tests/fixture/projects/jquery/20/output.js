export const obj = {
    setRequestHeader: function(name, value) {
        var lname = name.toLowerCase();
        return state || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
    }
};
