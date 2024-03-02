const a = (a)=>{
    var _s = $RefreshSig$();
    const useE = useEffect;
    return _s(function useFoo() {
        _s();
        useE(()=>console.log(a), []);
        return useState(123);
    }, "useE{}\nuseState{(123)}", false, function() {
        return [
            useE
        ];
    });
};
