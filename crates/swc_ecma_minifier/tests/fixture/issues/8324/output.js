function Deferred() {
    const deferred = this;
    deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
}
export async function bug() {
    const s = "next";
    if (!window[s]) {
        for(window[s] = new Deferred();;)if (window.current) await window.current.promise;
        else {
            window.current = window[s];
            try {
                return await window[s].promise;
            } finally{
                delete window.current;
            }
        }
    }
    return await window[s].promise;
}
