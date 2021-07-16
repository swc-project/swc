export const obj = {
    setRequestHeader: function(name, value) {
        var lname = name.toLowerCase();
        return state || (requestHeaders[name = requestHeadersNames[lname] = requestHeadersNames[lname] || name] = value), this;
    }
};
