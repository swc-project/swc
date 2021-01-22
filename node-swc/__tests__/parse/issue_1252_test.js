const swc = require("../../../");

it("should work", () => {
    const m = swc.transformSync(`
    export const then = <R>(callback: (...args: TupleReturns<Ws>) => R) => {
        let returns: R
        let called: boolean
    }
    `, {
        jsc: {
            parser: {
                syntax: 'typescript',
                tsx: true,
            }
        }
    });

    expect(m.type).toBe(`Module`);
    expect(m.body).toHaveLength(1);
});
