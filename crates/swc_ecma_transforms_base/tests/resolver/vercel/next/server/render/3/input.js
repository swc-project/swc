function top() {
    let resolved = false;
    const doResolve = () => {
        if (!resolved) {
            resolved = true;
            resolve((res, next) => {
                const drainHandler = () => {
                    const prevCallbacks = underlyingStream.queuedCallbacks;
                    underlyingStream.queuedCallbacks = [];
                    prevCallbacks.forEach((callback) => callback());
                };
                res.on("drain", drainHandler);
                underlyingStream = {
                    resolve: (err) => {
                        underlyingStream = null;
                        res.removeListener("drain", drainHandler);
                        next(err);
                    },
                    writable: res,
                    queuedCallbacks: [],
                };
                startWriting();
            });
        }
    };
    const { abort, startWriting } = ReactDOMServer.pipeToNodeWritable(
        element,
        stream,
        {
            onError(error) {
                if (!resolved) {
                    resolved = true;
                    reject(error);
                }
                abort();
            },
            onCompleteShell() {
                if (!generateStaticHTML) {
                    doResolve();
                }
            },
            onCompleteAll() {
                doResolve();
            },
        }
    );
}
