


const CONST_1 = 'const1';
const CONST_2 = 'const2';

function useHook1() {
    const [v1, v1_set] = useState(undefined);

    useEffect(() => {
        if (
            GLOBALS.get(CONST_1) &&
            GLOBALS.get(CONST_2)
        ) {
            v1_set(true);
        } else {
            v1_set(false);
        }
    }, []);

    return v1;
}


function useHook2() {
    const [a1, a1_set] = useState({});
    useEffect(() => {
        a1_set(
            JSON.parse(GLOBALS.get(CONST1) || '{}') ,
        );
    }, []);
    return a1;
}



export function HeaderCTA() {
    const varB = useHook2();
    const varA = useHook1();

    // Loading...
    if (varA === undefined) {
        return null;
    }

    if (varA) {
        return (
            use(varB.field)
        );
    }

    return (
        pure()
    );
}
