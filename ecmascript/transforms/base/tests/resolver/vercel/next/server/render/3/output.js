function top() {
    let resolved__2 = false;
    const doResolve__2 = ()=>{
        if (!resolved__2) {
            resolved__2 = true;
            resolve((res__3, next__3)=>{
                const drainHandler__3 = ()=>{
                    const prevCallbacks__4 = underlyingStream.queuedCallbacks;
                    underlyingStream.queuedCallbacks = [];
                    prevCallbacks__4.forEach((callback__5)=>callback__5()
                    );
                };
                res__3.on("drain", drainHandler__3);
                underlyingStream = {
                    resolve: (err__6)=>{
                        underlyingStream = null;
                        res__3.removeListener("drain", drainHandler__3);
                        next__3(err__6);
                    },
                    writable: res__3,
                    queuedCallbacks: []
                };
                startWriting__2();
            });
        }
    };
    const { abort__2 , startWriting__2  } = ReactDOMServer.pipeToNodeWritable(element, stream, {
        onError (error__7) {
            if (!resolved__2) {
                resolved__2 = true;
                reject(error__7);
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
