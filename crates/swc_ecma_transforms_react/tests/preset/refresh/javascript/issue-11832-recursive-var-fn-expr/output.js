var _s = $RefreshSig$();
const useFoo = function(cond) {
    _s();
    const [count, setCount] = useState(0);
    if (cond) {
        useFoo(false);
    }
    return count;
};
_s(useFoo, "useState{[count, setCount](0)}");
