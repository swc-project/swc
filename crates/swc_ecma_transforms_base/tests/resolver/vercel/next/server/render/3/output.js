function top__1() {
    let resolved__2 = false;
    const doResolve__2 = ()=>{
        if (!resolved__2) {
            resolved__2 = true;
            resolve((res__4, next__4)=>{
                const drainHandler__4 = ()=>{
                    const prevCallbacks__5 = underlyingStream.queuedCallbacks;
                    underlyingStream.queuedCallbacks = [];
                    prevCallbacks__5.forEach((callback__6)=>callback__6()
                    );
                };
                res__4.on("drain", drainHandler__4);
                underlyingStream = {
                    resolve: (err__7)=>{
                        underlyingStream = null;
                        res__4.removeListener("drain", drainHandler__4);
                        next__4(err__7);
                    },
                    writable: res__4,
                    queuedCallbacks: []
                };
                startWriting__2();
            });
        }
    };
    const { abort__2 , startWriting__2  } = ReactDOMServer.pipeToNodeWritable(element, stream, {
        onError (error__8) {
            if (!resolved__2) {
                resolved__2 = true;
                reject(error__8);
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
