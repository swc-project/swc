export const obj = {
    when: function(subordinate) {
        var progressValues, progressContexts, resolveContexts, i1 = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = 1 === remaining ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
            return function(value) {
                contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
            };
        };
        if (length > 1) for(progressValues = Array(length), progressContexts = Array(length), resolveContexts = Array(length); i1 < length; i1++)resolveValues[i1] && jQuery.isFunction(resolveValues[i1].promise) ? resolveValues[i1].promise().done(updateFunc(i1, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i1, progressContexts, progressValues)) : --remaining;
        return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
};
