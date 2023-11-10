/* @refresh reset */ var _s = $RefreshSig$();
import { useState } from 'react';
function Counter() {
    _s();
    const [count, setCount] = useState(0);
    return <button type="button" onClick={()=>setCount((c)=>c + 1)}>{count}</button>;
}
_s(Counter, "useState{[count, setCount](0)}", true);
_c = Counter;
var _c;
$RefreshReg$(_c, "Counter");
