export function memo(getDeps, fn, opts) {
    let result, deps = [];
    return ()=>{
        opts.key && opts.debug && Date.now();
        const newDeps = getDeps(), depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index)=>deps[index] !== dep);
        return depsChanged && (deps = newDeps, opts.key && opts.debug && Date.now(), result = fn(...newDeps), opts?.onChange?.(result), opts.key && opts.debug && opts?.debug()), result;
    };
}
