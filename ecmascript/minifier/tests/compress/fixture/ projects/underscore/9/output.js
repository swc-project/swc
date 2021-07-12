_.once = function(func) {
    var ran = !1, memo;
    return function() {
        return ran || (ran = !0, memo = func.apply(this, arguments), func = null), memo;
    };
};
