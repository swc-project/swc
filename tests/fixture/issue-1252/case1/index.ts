export const then = <R>(callback: (...args: TupleReturns<Ws>) => R) => {
    let returns: R
    let called: boolean
}