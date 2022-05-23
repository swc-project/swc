export const exported = {
    toQueryString: function (object, base) {
        var queryString = [];

        Object.each(object, function (value, key) {
            if (base) key = base + "[" + key + "]";
            var result;
            switch (typeOf(value)) {
                case "object":
                    result = Object.toQueryString(value, key);
                    break;
                case "array":
                    var qs = {};
                    value.each(function (val, i) {
                        qs[i] = val;
                    });
                    result = Object.toQueryString(qs, key);
                    break;
                default:
                    result = key + "=" + encodeURIComponent(value);
            }
            if (value != null) queryString.push(result);
        });

        return queryString.join("&");
    },
};
