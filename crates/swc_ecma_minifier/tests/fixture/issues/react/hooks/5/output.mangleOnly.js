const e = "const1";
const t = "const2";
function n() {
    const [n, u] = useState(undefined);
    useEffect(()=>{
        if (GLOBALS.get(e) && GLOBALS.get(t)) {
            u(true);
        } else {
            u(false);
        }
    }, []);
    return n;
}
function u() {
    const [e, t] = useState({});
    useEffect(()=>{
        t(JSON.parse(GLOBALS.get(CONST1) || "{}"));
    }, []);
    return e;
}
export function HeaderCTA() {
    const e = u();
    const t = n();
    if (t === undefined) {
        return null;
    }
    if (t) {
        return use(e.field);
    }
    return pure();
}
