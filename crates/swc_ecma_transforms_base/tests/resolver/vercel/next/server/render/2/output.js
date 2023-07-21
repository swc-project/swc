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
        stream__4.once("error", (err__11)=>{
            if (!underlyingStream__4) {
                throw new Error("invariant: error called without an underlying stream. This is a bug in Next.js");
            }
            underlyingStream__4.resolve(err__11);
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
                resolve__4((res__18, next__18)=>{
                    const drainHandler__18 = ()=>{
                        const prevCallbacks__19 = underlyingStream__4.queuedCallbacks;
                        underlyingStream__4.queuedCallbacks = [];
                        prevCallbacks__19.forEach((callback__20)=>callback__20());
                    };
                    res__18.on("drain", drainHandler__18);
                    underlyingStream__4 = {
                        resolve: (err__21)=>{
                            underlyingStream__4 = null;
                            res__18.removeListener("drain", drainHandler__18);
                            next__18(err__21);
                        },
                        writable: res__18,
                        queuedCallbacks: []
                    };
                    startWriting__4();
                });
            }
        };
        const { abort__4, startWriting__4 } = ReactDOMServer.pipeToNodeWritable(element__3, stream__4, {
            onError (error__22) {
                if (!resolved__4) {
                    resolved__4 = true;
                    reject__4(error__22);
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
