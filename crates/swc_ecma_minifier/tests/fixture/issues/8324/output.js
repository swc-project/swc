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
                return await window[s].promise // This line compressed to 'break'. I guess compressor intended jump to 23 line which is looks like same code.
                ;
            } finally{
                delete window.current // Above 'break' makes unintended delete
                ;
            }
        }
    }
    return await window[s].promise;
}
