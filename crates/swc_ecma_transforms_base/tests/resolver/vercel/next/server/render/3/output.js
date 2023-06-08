function top__2() {
    let resolved__3 = false;
    const doResolve__3 = ()=>{
        let aaa__4 = 3;
        if (!resolved__3) {
            resolved__3 = true;
            let bbb__5 = 4;
            resolve((res__6, next__6)=>{
                const drainHandler__6 = ()=>{
                    const prevCallbacks__7 = underlyingStream.queuedCallbacks;
                    underlyingStream.queuedCallbacks = [];
                    prevCallbacks__7.forEach((callback__8)=>callback__8());
                };
                res__6.on("drain", drainHandler__6);
                underlyingStream = {
                    resolve: (err__9)=>{
                        underlyingStream = null;
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
    const { abort__3, startWriting__3 } = ReactDOMServer.pipeToNodeWritable(element, stream, {
        onError (error__10) {
            if (!resolved__3) {
                resolved__3 = true;
                reject(error__10);
            }
            abort__3();
        },
        onCompleteShell () {
            if (!generateStaticHTML) {
                doResolve__3();
            }
        },
        onCompleteAll () {
            doResolve__3();
        }
    });
}
