function renderToStream(element, generateStaticHTML) {
    return new Promise((resolve, reject) => {
        let underlyingStream = null;
        const stream = new Writable({
            highWaterMark: 0,
            write(chunk, encoding, callback) {
                if (!underlyingStream) {
                    throw new Error(
                        "invariant: write called without an underlying stream. This is a bug in Next.js"
                    );
                }
                if (!underlyingStream.writable.write(chunk, encoding)) {
                    underlyingStream.queuedCallbacks.push(() => callback());
                } else {
                    callback();
                }
            },
        });
        stream.once("finish", () => {
            if (!underlyingStream) {
                throw new Error(
                    "invariant: finish called without an underlying stream. This is a bug in Next.js"
                );
            }
            underlyingStream.resolve();
        });
        stream.once("error", (err) => {
            if (!underlyingStream) {
                throw new Error(
                    "invariant: error called without an underlying stream. This is a bug in Next.js"
                );
            }
            underlyingStream.resolve(err);
        });
        Object.defineProperty(stream, "flush", {
            value: () => {
                if (!underlyingStream) {
                    throw new Error(
                        "invariant: flush called without an underlying stream. This is a bug in Next.js"
                    );
                }
                if (typeof underlyingStream.writable.flush === "function") {
                    underlyingStream.writable.flush();
                }
            },
            enumerable: true,
        });
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
    });
}
