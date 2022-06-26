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
    const a = d();
    const b = c();
    if (b === undefined) {
        return null;
    }
    if (b) {
        return use(a.field);
    }
    return pure();
}
