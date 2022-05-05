_.throttle = function(func, wait, options) {
    var context, args, result, timeout = null, previous = 0;
    options || (options = {});
    var later = function() {
        previous = !1 === options.leading ? 0 : new Date(), timeout = null, result = func.apply(context, args);
    };
    return function() {
        var now = new Date();
        previous || !1 !== options.leading || (previous = now);
        var remaining = wait - (now - previous);
        return context = this, args = arguments, remaining <= 0 ? (clearTimeout(timeout), timeout = null, previous = now, result = func.apply(context, args)) : timeout || !1 === options.trailing || (timeout = setTimeout(later, remaining)), result;
    };
};
