function memo(fn, opts) {
    let result;
    return ()=>(result = fn(...newDeps), opts?.onChange?.(result), result);
}
export { memo };
