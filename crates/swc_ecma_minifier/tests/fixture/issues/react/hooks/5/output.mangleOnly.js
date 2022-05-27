const a = "const1";
const b = "const2";
function c() {
    const [c, d] = useState(undefined);
    useEffect(()=>{
        if (GLOBALS.get(a) && GLOBALS.get(b)) {
            d(true);
        } else {
            d(false);
        }
    }, []);
    return c;
}
function d() {
    const [a, b] = useState({});
    useEffect(()=>{
        b(JSON.parse(GLOBALS.get(CONST1) || "{}"));
    }, []);
    return a;
}
export function HeaderCTA() {
    const b = d();
    const a = c();
    if (a === undefined) {
        return null;
    }
    if (a) {
        return use(b.field);
    }
    return pure();
}
