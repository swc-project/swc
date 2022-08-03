const t = "const1";
const n = "const2";
function e() {
    const [e, r] = useState(undefined);
    useEffect(()=>{
        if (GLOBALS.get(t) && GLOBALS.get(n)) {
            r(true);
        } else {
            r(false);
        }
    }, []);
    return e;
}
function r() {
    const [t, n] = useState({});
    useEffect(()=>{
        n(JSON.parse(GLOBALS.get(CONST1) || "{}"));
    }, []);
    return t;
}
export function HeaderCTA() {
    const t = r();
    const n = e();
    if (n === undefined) {
        return null;
    }
    if (n) {
        return use(t.field);
    }
    return pure();
}
