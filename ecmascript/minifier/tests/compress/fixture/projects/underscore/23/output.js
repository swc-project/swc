_.once = function(func) {
    var memo, ran = !1;
    return function() {
        return ran || (ran = !0, memo = func.apply(this, arguments), func = null), memo;
    };
};
