function memoizeWithArgs(fnWithArgs, options) {
    const fn = proxyMemoize((args) => fnWithArgs(...args), options);
    return (...args) => fn(args);
}

function makeSelector(selector, selectorTransformer) {
    return (state) => selectorTransformer(selector(state));
}

export function createSelectorHook(selector) {
    const useSelectorHook = (selectorTransformer, deps) => {
        const memoSelector = useMemo(
            () =>
                selectorTransformer && deps
                    ? makeSelector(
                          selector,
                          memoizeWithArgs(selectorTransformer)
                      )
                    : undefined,
            deps
        );
        const finalSelector = memoSelector
            ? memoSelector
            : selectorTransformer
            ? makeSelector(selector, selectorTransformer)
            : selector;
        return useSelector(finalSelector);
    };
    return useSelectorHook;
}
