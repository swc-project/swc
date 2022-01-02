export const exported = {
    toQueryString: function(object, base) {
        var queryString = [];
        return Object.each(object, function(value, key) {
            switch(base && (key = base + "[" + key + "]"), typeOf(value)){
                case "object":
                    result = Object.toQueryString(value, key);
                    break;
                case "array":
                    var result, qs = {};
                    value.each(function(val, i) {
                        qs[i] = val;
                    }), result = Object.toQueryString(qs, key);
                    break;
                default:
                    result = key + "=" + encodeURIComponent(value);
            }
            null != value && queryString.push(result);
        }), queryString.join("&");
    }
};
