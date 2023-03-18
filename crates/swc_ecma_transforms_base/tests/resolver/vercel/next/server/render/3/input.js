function top() {
    let resolved = false;
    const doResolve = () => {
        let aaa = 3;
        if (!resolved) {
            resolved = true;
            let bbb = 4;
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
