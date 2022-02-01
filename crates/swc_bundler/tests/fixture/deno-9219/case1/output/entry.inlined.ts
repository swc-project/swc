class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
function get(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    const v = get(obj, key);
    assert(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    let o = obj;
    keys.slice(0, -1).forEach((key)=>{
        o = get(o, key) ?? {};
    });
    const key1 = keys[keys.length - 1];
    return key1 in o;
}
function parse(args1, { "--": doubleDash = false , alias: alias4 = {} , boolean: __boolean = false , default: defaults = {} , stopEarly =false , string =[] , unknown =(i)=>i
  } = {}) {
    const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false
    };
    if (__boolean !== undefined) {
        if (typeof __boolean === "boolean") {
            flags.allBools = !!__boolean;
        } else {
            const booleanArgs = typeof __boolean === "string" ? [
                __boolean
            ] : __boolean;
            for (const key4 of booleanArgs.filter(Boolean)){
                flags.bools[key4] = true;
            }
        }
    }
    const aliases = {};
    if (alias4 !== undefined) {
        for(const key5 in alias4){
            const val1 = getForce(alias4, key5);
            if (typeof val1 === "string") {
                aliases[key5] = [
                    val1
                ];
            } else {
                aliases[key5] = val1;
            }
            for (const alias1 of getForce(aliases, key5)){
                aliases[alias1] = [
                    key5
                ].concat(aliases[key5].filter((y)=>alias1 !== y
                ));
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key6 of stringArgs.filter(Boolean)){
            flags.strings[key6] = true;
            const alias5 = get(aliases, key6);
            if (alias5) {
                for (const al of alias5){
                    flags.strings[al] = true;
                }
            }
        }
    }
    const argv = {
        _: []
    };
    function argDefined(key, arg) {
        return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
    }
    function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function(key) {
            if (get(o, key) === undefined) {
                o[key] = {};
            }
            o = get(o, key);
        });
        const key7 = keys[keys.length - 1];
        if (get(o, key7) === undefined || get(flags.bools, key7) || typeof get(o, key7) === "boolean") {
            o[key7] = value;
        } else if (Array.isArray(get(o, key7))) {
            o[key7].push(value);
        } else {
            o[key7] = [
                get(o, key7),
                value
            ];
        }
    }
    function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg, key, val) === false) return;
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
            for (const x of alias){
                setKey(argv, x.split("."), value);
            }
        }
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x)=>typeof get(flags.bools, x) === "boolean"
        );
    }
    for (const key3 of Object.keys(flags.bools)){
        setArg(key3, defaults[key3] === undefined ? false : defaults[key3]);
    }
    let notFlags = [];
    if (args1.includes("--")) {
        notFlags = args1.slice(args1.indexOf("--") + 1);
        args1 = args1.slice(0, args1.indexOf("--"));
    }
    for(let i = 0; i < args1.length; i++){
        const arg = args1[i];
        if (/^--.+=/.test(arg)) {
            const m1 = arg.match(/^--([^=]+)=(.*)$/s);
            assert(m1 != null);
            const [, key8, value] = m1;
            if (flags.bools[key8]) {
                const booleanValue = value !== "false";
                setArg(key8, booleanValue, arg);
            } else {
                setArg(key8, value, arg);
            }
        } else if (/^--no-.+/.test(arg)) {
            const m3 = arg.match(/^--no-(.+)/);
            assert(m3 != null);
            setArg(m3[1], false, arg);
        } else if (/^--.+/.test(arg)) {
            const m = arg.match(/^--(.+)/);
            assert(m != null);
            const [, key10] = m;
            const next1 = args1[i + 1];
            if (next1 !== undefined && !/^-/.test(next1) && !get(flags.bools, key10) && !flags.allBools && (get(aliases, key10) ? !aliasIsBoolean(key10) : true)) {
                setArg(key10, next1, arg);
                i++;
            } else if (/^(true|false)$/.test(next1)) {
                setArg(key10, next1 === "true", arg);
                i++;
            } else {
                setArg(key10, get(flags.strings, key10) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j = 0; j < letters.length; j++){
                const next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            const [key12] = arg.slice(-1);
            if (!broken && key12 !== "-") {
                if (args1[i + 1] && !/^(-|--)[^-]/.test(args1[i + 1]) && !get(flags.bools, key12) && (get(aliases, key12) ? !aliasIsBoolean(key12) : true)) {
                    setArg(key12, args1[i + 1], arg);
                    i++;
                } else if (args1[i + 1] && /^(true|false)$/.test(args1[i + 1])) {
                    setArg(key12, args1[i + 1] === "true", arg);
                    i++;
                } else {
                    setArg(key12, get(flags.strings, key12) ? "" : true, arg);
                }
            }
        } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv._.push(...args1.slice(i + 1));
                break;
            }
        }
    }
    for (const key2 of Object.keys(defaults)){
        if (!hasKey(argv, key2.split("."))) {
            setKey(argv, key2.split("."), defaults[key2]);
            if (aliases[key2]) {
                for (const x of aliases[key2]){
                    setKey(argv, x.split("."), defaults[key2]);
                }
            }
        }
    }
    if (doubleDash) {
        argv["--"] = [];
        for (const key13 of notFlags){
            argv["--"].push(key13);
        }
    } else {
        for (const key of notFlags){
            argv._.push(key);
        }
    }
    return argv;
}
const args = parse(Deno.args, {
    boolean: [
        "help",
        "verbose", 
    ],
    alias: {
        help: "h",
        verbose: "v"
    },
    default: {
        verbose: false
    }
});
console.dir(args);
