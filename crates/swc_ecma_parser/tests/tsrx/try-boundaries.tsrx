"use server";

const _TsrxSuspense = "source collision";
const _TsrxErrorBoundary = "source collision";

function Boundary() @{
    @try {
        const value = read();
        <Content value={value} />
    } @pending {
        const label = "loading";
        <Loading label={label} />
    } @catch ({ message }: Error, reset: () => void) {
        const title = message.toUpperCase();
        <Failure title={title} reset={reset} />
    } @finally {
        cleanup();
    }
}

function FinallyOnly() @{
    @try { <Content /> } @finally { cleanup(); }
}
