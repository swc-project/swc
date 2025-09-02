export function createSelectorHook(e){return(o,r)=>useSelector(useMemo(()=>{var t;let u;return o&&r?(u=proxyMemoize(e=>o(...e),void 0),t=(...e)=>u(e),o=>t(e(o))):void 0},r)||(o?r=>o(e(r)):e))}
