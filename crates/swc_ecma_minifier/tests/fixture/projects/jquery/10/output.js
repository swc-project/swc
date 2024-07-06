export const obj = {
    when: function(subordinate /* , ..., subordinateN */ ) {
        var progressValues, progressContexts, resolveContexts, i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, // the count of uncompleted subordinates
        remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
        deferred = 1 === remaining ? subordinate : jQuery.Deferred(), // Update function for both resolve and progress values
        updateFunc = function(i, contexts, values) {
            return function(value) {
                contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
            };
        };
        // add listeners to Deferred subordinates; treat others as resolved
        if (length > 1) for(progressValues = Array(length), progressContexts = Array(length), resolveContexts = Array(length); i < length; i++)resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
        return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
};
