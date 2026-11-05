class StaticBlocks {
    static{
        const block = (()=>{
            return null;
        })();
        const branch = (()=>{
            switch(0){
                default:
                    {}
            }
            return null;
        })();
        const loop = (()=>{
            const _TsrxResults = [];
            let _TsrxEntered1 = false;
            for (const item of [
                1,
                2
            ]){
                _TsrxEntered1 = true;
            }
            return _TsrxResults;
        })();
        function synchronous() {
            return (()=>{
                return null;
            })();
        }
        const arrow = ()=>(()=>{
                return null;
            })();
        async function asynchronous() {
            return await (async ()=>{
                return null;
            })();
        }
        const asyncArrow = async ()=>await (async ()=>{
                return null;
            })();
        function* generator() {
            return yield* function*() {
                return null;
            }();
        }
        async function* asyncGenerator() {
            return yield* async function*() {
                return null;
            }();
        }
    }
}
async function enclosingAsync() {
    class Inner {
        static{
            const value = (()=>{
                return null;
            })();
        }
    }
}
function* enclosingGenerator() {
    class Inner {
        static{
            const value = (()=>{
                return null;
            })();
        }
    }
}
async function* enclosingAsyncGenerator() {
    class Inner {
        static{
            const value = (()=>{
                return null;
            })();
        }
    }
}
