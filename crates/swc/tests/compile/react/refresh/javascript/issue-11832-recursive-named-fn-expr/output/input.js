var _s = $RefreshSig$();
const useFoo = function useInner(cond) {
    _s();
    const [count, setCount] = useState(0);
    if (cond) {
        useInner(false);
        useFoo(false);
    }
    return count;
};
_s(useFoo, "useState{[count, setCount](0)}");
