function top__1() {
    let resolved__2 = false;
    const doResolve__2 = ()=>{
        let aaa__3 = 3;
        if (!resolved__2) {
            resolved__2 = true;
            let bbb__4 = 4;
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
                startWriting__2();
            });
        }
    };
    const { abort__2 , startWriting__2  } = ReactDOMServer.pipeToNodeWritable(element, stream, {
        onError (error__10) {
            if (!resolved__2) {
                resolved__2 = true;
                reject(error__10);
            }
            abort__2();
        },
        onCompleteShell () {
            if (!generateStaticHTML) {
                doResolve__2();
            }
        },
        onCompleteAll () {
            doResolve__2();
        }
    });
}
