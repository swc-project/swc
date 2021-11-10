function renderToStream(element__2, generateStaticHTML__2) {
    return new Promise((resolve__3, reject__3)=>{
        let underlyingStream__3 = null;
        const stream__3 = new Writable({
            highWaterMark: 0,
            write (chunk__4, encoding__4, callback__4) {
                if (!underlyingStream__3) {
                    throw new Error("invariant: write called without an underlying stream. This is a bug in Next.js");
                }
                if (!underlyingStream__3.writable.write(chunk__4, encoding__4)) {
                    underlyingStream__3.queuedCallbacks.push(()=>callback__4()
                    );
                } else {
                    callback__4();
                }
            }
        });
        stream__3.once("finish", ()=>{
            if (!underlyingStream__3) {
                throw new Error("invariant: finish called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__3.resolve();
        });
        stream__3.once("error", (err__5)=>{
            if (!underlyingStream__3) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__3.resolve(err__5);
        });
        Object.defineProperty(stream__3, "flush", {
            value: ()=>{
                if (!underlyingStream__3) {
                    throw new Error("invariant: flush called without an underlying stream. This is a bug in Next.js");
                }
                if (typeof underlyingStream__3.writable.flush === "function") {
                    underlyingStream__3.writable.flush();
                }
            },
            enumerable: true
        });
        let resolved__3 = false;
        const doResolve__3 = ()=>{
            if (!resolved__3) {
                resolved__3 = true;
                resolve__3((res__6, next__6)=>{
                    const drainHandler__6 = ()=>{
                        const prevCallbacks__7 = underlyingStream__3.queuedCallbacks;
                        underlyingStream__3.queuedCallbacks = [];
                        prevCallbacks__7.forEach((callback__8)=>callback__8()
                        );
                    };
                    res__6.on("drain", drainHandler__6);
                    underlyingStream__3 = {
                        resolve: (err__9)=>{
                            underlyingStream__3 = null;
                            res__6.removeListener("drain", drainHandler__6);
                            next__6(err__9);
                        },
                        writable: res__6,
                        queuedCallbacks: []
                    };
                    startWriting__3();
                });
            }
        };
        const { abort__3 , startWriting__3  } = ReactDOMServer.pipeToNodeWritable(element__2, stream__3, {
            onError (error__10) {
                if (!resolved__3) {
                    resolved__3 = true;
                    reject__3(error__10);
                }
                abort__3();
            },
            onCompleteShell () {
                if (!generateStaticHTML__2) {
                    doResolve__3();
                }
            },
            onCompleteAll () {
                doResolve__3();
            }
        });
    });
}
