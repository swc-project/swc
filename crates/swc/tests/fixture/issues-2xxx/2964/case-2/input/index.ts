//top comment
export const noop = () => {};
/* istanbul ignore next */
export const badIstanbul = (test: Record<string, unknown>) => {
    const { value, ...pixelParams } = test;
    console.log("fail");
};

/* istanbul ignore next: UI-5137 */
export const downloadDocument = (): void => {
    console.log("fail");
};
