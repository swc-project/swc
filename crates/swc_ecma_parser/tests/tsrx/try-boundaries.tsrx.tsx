"use server";
import { Suspense as _TsrxSuspense1 } from "react";
import { TsrxErrorBoundary as _TsrxErrorBoundary2 } from "@tsrx/react/error-boundary";
const _TsrxSuspense = "escaped source collision";
const _TsrxErrorBoundary = "source collision";
function Boundary() {
    return (()=>{
        const _TsrxContent = ()=>{
            try {
                const value = read();
                return <Content value={value}/>;
            } finally{
                cleanup();
            }
        };
        return <_TsrxErrorBoundary2 fallback={({ message }: Error, reset: () => void)=>{
            const title = message.toUpperCase();
            return <Failure title={title} reset={reset}/>;
        }}><_TsrxSuspense1 fallback={(()=>{
            const label = "loading";
            return <Loading label={label}/>;
        })()}><_TsrxContent/></_TsrxSuspense1></_TsrxErrorBoundary2>;
    })();
}
function FinallyOnly() {
    return (()=>{
        const _TsrxContent3 = ()=>{
            try {
                return <Content/>;
            } finally{
                cleanup();
            }
        };
        return <_TsrxContent3/>;
    })();
}
