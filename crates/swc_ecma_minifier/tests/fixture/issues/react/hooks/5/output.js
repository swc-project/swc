export function HeaderCTA() {
    const varB = function() {
        const [a1, a1_set] = useState({});
        return useEffect(()=>{
            a1_set(JSON.parse(GLOBALS.get(CONST1) || "{}"));
        }, []), a1;
    }(), varA = function() {
        const [v1, v1_set] = useState(void 0);
        return useEffect(()=>{
            GLOBALS.get("const1") && GLOBALS.get("const2") ? v1_set(!0) : v1_set(!1);
        }, []), v1;
    }();
    return(// Loading...
    void 0 === varA ? null : varA ? use(varB.field) : pure());
}
