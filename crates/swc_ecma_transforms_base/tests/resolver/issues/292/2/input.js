__assign =
    Object.assign ||
    function __assign1(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];

            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
    };

__assign.apply(this, arguments);
