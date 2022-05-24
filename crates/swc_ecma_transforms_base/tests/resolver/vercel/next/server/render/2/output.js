function renderToStream__1(element__2, generateStaticHTML__2) {
    return new Promise((resolve__4, reject__4)=>{
        let underlyingStream__4 = null;
        const stream__4 = new Writable({
            highWaterMark: 0,
            write (chunk__5, encoding__5, callback__5) {
                if (!underlyingStream__4) {
                    throw new Error("invariant: write called without an underlying stream. This is a bug in Next.js");
                }
                if (!underlyingStream__4.writable.write(chunk__5, encoding__5)) {
                    underlyingStream__4.queuedCallbacks.push(()=>callback__5());
                } else {
                    callback__5();
                }
            }
        });
        stream__4.once("finish", ()=>{
            if (!underlyingStream__4) {
                throw new Error("invariant: finish called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__4.resolve();
        });
        stream__4.once("error", (err__6)=>{
            if (!underlyingStream__4) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__4.resolve(err__6);
        });
        Object.defineProperty(stream__4, "flush", {
            value: ()=>{
                if (!underlyingStream__4) {
                    throw new Error("invariant: flush called without an underlying stream. This is a bug in Next.js");
                }
                if (typeof underlyingStream__4.writable.flush === "function") {
                    underlyingStream__4.writable.flush();
                }
            },
            enumerable: true
        });
        let resolved__4 = false;
        const doResolve__4 = ()=>{
            if (!resolved__4) {
                resolved__4 = true;
                resolve__4((res__7, next__7)=>{
                    const drainHandler__7 = ()=>{
                        const prevCallbacks__8 = underlyingStream__4.queuedCallbacks;
                        underlyingStream__4.queuedCallbacks = [];
                        prevCallbacks__8.forEach((callback__9)=>callback__9());
                    };
                    res__7.on("drain", drainHandler__7);
                    underlyingStream__4 = {
                        resolve: (err__10)=>{
                            underlyingStream__4 = null;
                            res__7.removeListener("drain", drainHandler__7);
                            next__7(err__10);
                        },
                        writable: res__7,
                        queuedCallbacks: []
                    };
                    startWriting__4();
                });
            }
        };
        const { abort__4 , startWriting__4  } = ReactDOMServer.pipeToNodeWritable(element__2, stream__4, {
            onError (error__11) {
                if (!resolved__4) {
                    resolved__4 = true;
                    reject__4(error__11);
                }
                abort__4();
            },
            onCompleteShell () {
                if (!generateStaticHTML__2) {
                    doResolve__4();
                }
            },
            onCompleteAll () {
                doResolve__4();
            }
        });
    });
}
