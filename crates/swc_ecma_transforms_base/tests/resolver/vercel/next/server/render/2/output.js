function renderToStream__2(element__3, generateStaticHTML__3) {
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
        stream__4.once("error", (err__12)=>{
            if (!underlyingStream__4) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__4.resolve(err__12);
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
                resolve__4((res__19, next__19)=>{
                    const drainHandler__19 = ()=>{
                        const prevCallbacks__20 = underlyingStream__4.queuedCallbacks;
                        underlyingStream__4.queuedCallbacks = [];
                        prevCallbacks__20.forEach((callback__21)=>callback__21());
                    };
                    res__19.on("drain", drainHandler__19);
                    underlyingStream__4 = {
                        resolve: (err__22)=>{
                            underlyingStream__4 = null;
                            res__19.removeListener("drain", drainHandler__19);
                            next__19(err__22);
                        },
                        writable: res__19,
                        queuedCallbacks: []
                    };
                    startWriting__4();
                });
            }
        };
        const { abort__4, startWriting__4 } = ReactDOMServer.pipeToNodeWritable(element__3, stream__4, {
            onError (error__23) {
                if (!resolved__4) {
                    resolved__4 = true;
                    reject__4(error__23);
                }
                abort__4();
            },
            onCompleteShell () {
                if (!generateStaticHTML__3) {
                    doResolve__4();
                }
            },
            onCompleteAll () {
                doResolve__4();
            }
        });
    });
}
