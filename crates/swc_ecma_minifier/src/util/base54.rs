pub(crate) static BASE54_DEFAULT_CHARS: &[u8; 64] =
    b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

/// givin a number, return a base54 encoded string
/// `usize -> [a-zA-Z$_][a-zA-Z$_0-9]*`
pub(crate) fn encode(init: &mut usize, chars: &[u8; 64], skip_reserved: bool) -> String {
    if skip_reserved {
        while init.is_reserved()
            || init.is_reserved_in_strict_bind()
            || init.is_reserved_in_strict_mode(true)
        {
            *init += 1;
        }
    }

    let mut n = *init;

    *init += 1;

    let mut base = 54;

    while n >= base {
        n -= base;
        base <<= 6;
    }

    let mut ret = String::new();

    base /= 54;
    let mut c = chars[n / base] as char;
    ret.push(c);

    while base > 1 {
        n %= base;
        base >>= 6;
        c = chars[n / base] as char;

        ret.push(c);
    }

    ret
}

#[allow(unused)]
pub(crate) fn decode(s: &str) -> usize {
    let mut ret = 0;

    let mut base = 54;

    for _ in 0..(s.len() - 1) {
        ret += base;
        base <<= 6;
    }

    let mut x = 0;

    for c in s.as_bytes().iter() {
        x <<= 6;
        x += reverse_base54(c);
    }

    ret += x;

    ret
}

fn reverse_base54(c: &u8) -> usize {
    match &c {
        b'a'..=b'z' => (c - b'a').into(),
        b'A'..=b'Z' => (c - b'A' + 26).into(),
        b'$' => 52,
        b'_' => 53,
        b'0'..=b'9' => (c - b'0' + 54).into(),
        _ => panic!("invalid base54 char: {}", *c as char),
    }
}

trait Reserved {
    fn is_reserved(&self) -> bool;

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool;

    fn is_reserved_in_strict_bind(&self) -> bool;

    fn is_reserved_in_es3(&self) -> bool;
}

const RESERVED: [usize; 37] = [
    35630528,           // break
    750138,             // case
    48012861,           // catch
    50819656,           // class
    51659337,           // const
    13542199411386,     // continue
    17240182476487,     // debugger
    269439774857,       // default
    4211585658,         // delete
    260,                // do
    1319482,            // else
    1327810,            // enum
    5605184009,         // export
    358796246664,       // extends
    98312762,           // false
    411307876494,       // finally
    24903,              // for
    27148373455171,     // function
    571,                // if
    9715601929,         // import
    579,                // in
    163295746507125051, // instanceof
    57036,              // new
    3715201,            // null
    1089730735930,      // package
    19246133763,        // return
    321674951,          // super
    20618976829,        // switch
    5234632,            // this
    335053132,          // throw
    5276346,            // true
    82446,              // try
    21728047419,        // typeof
    89543,              // var
    5787577,            // void
    385347706,          // while
    6025853,            // with
];

const AWAIT: usize = 20148169;

const RESERVED_IN_STRICT_MODE: [usize; 9] = [
    163000531913818760, // implements
    2551548935630394,   // interface
    48841,              // let
    1089730735930,      // package
    1108087894650,      // private
    4539138248580793,   // protected
    17362329528,        // public
    20566548408,        // static
    419147897,          // yield
];

const RESERVED_IN_STRICT_BIND: [usize; 2] = [
    1359297,         // eval
    316465050567304, // arguments
];

const RESERVED_IN_ES3: [usize; 15] = [
    3858124205641,    // abstract
    142892051907,     // boolean
    586362,           // byte
    777671,           // char
    4381704314,       // double
    100416961,        // final
    101207497,        // float
    1856132,          // goto
    37129,            // int
    3166460,          // long
    14884008698,      // native
    318263817,        // short
    21443400520,      // throws
    5664069876691209, // transient
    97102619734138,   // volatile
];

// 17363901597402070713, // synchronized

impl Reserved for usize {
    fn is_reserved(&self) -> bool {
        RESERVED.contains(self)
    }

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool {
        if is_module && *self == AWAIT {
            return true;
        }

        RESERVED_IN_STRICT_MODE.contains(self)
    }

    fn is_reserved_in_strict_bind(&self) -> bool {
        RESERVED_IN_STRICT_BIND.contains(self)
    }

    fn is_reserved_in_es3(&self) -> bool {
        RESERVED_IN_ES3.contains(self)
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::IdentExt;
    use tracing::debug;

    use super::*;

    struct Tester {
        n: usize,
    }

    impl Tester {
        fn incr(&mut self, n: usize) {
            self.n += n;
        }

        fn gen(&mut self, expected: &str) {
            let generated = encode(&mut self.n, BASE54_DEFAULT_CHARS, true);
            assert_eq!(generated, expected);
        }
    }

    #[test]
    fn simple() {
        let mut t = Tester { n: 0 };

        t.gen("a");
        t.gen("b");
        t.incr(54 - 2);
        t.gen("aa");
    }

    #[test]
    fn generate_reserved() {
        [
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "enum",
            "export",
            "extends",
            "false",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "null",
            "package",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "true",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[test]
    fn generate_reserved_in_strict_mode() {
        let s = "await";
        debug!("{}, // {}", decode(s), s);

        [
            "implements",
            "interface",
            "let",
            "package",
            "private",
            "protected",
            "public",
            "static",
            "yield",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[test]
    fn generate_reserved_in_strict_bind() {
        ["eval", "arguments"].iter().for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[test]
    fn generate_reserved_in_es3() {
        [
            "abstract",
            "boolean",
            "byte",
            "char",
            "double",
            "final",
            "float",
            "goto",
            "int",
            "long",
            "native",
            "short",
            "synchronized",
            "throws",
            "transient",
            "volatile",
        ]
        .iter()
        .for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[test]
    fn is_reserved() {
        RESERVED.iter().for_each(|n| {
            let mut init = *n;
            let gen = encode(&mut init, BASE54_DEFAULT_CHARS, false);
            assert!(gen.is_reserved());
        })
    }

    #[test]
    fn is_reserved_in_strict_mode() {
        let mut init = AWAIT;

        let gen = encode(&mut init, BASE54_DEFAULT_CHARS, false);
        assert!(gen.is_reserved_in_strict_mode(true));

        RESERVED_IN_STRICT_MODE.iter().for_each(|n| {
            let mut init = *n;

            let gen = encode(&mut init, BASE54_DEFAULT_CHARS, false);
            assert!(gen.is_reserved_in_strict_mode(false));
        })
    }

    #[test]
    fn is_reserved_in_strict_bind() {
        RESERVED_IN_STRICT_BIND.iter().for_each(|n| {
            let mut init = *n;

            let gen = encode(&mut init, BASE54_DEFAULT_CHARS, false);
            assert!(gen.is_reserved_in_strict_bind());
        })
    }

    #[test]
    fn is_reserved_in_es3() {
        RESERVED_IN_ES3.iter().for_each(|n| {
            let mut init = *n;

            let gen = encode(&mut init, BASE54_DEFAULT_CHARS, false);
            assert!(gen.is_reserved_in_es3());
        })
    }

    #[test]
    fn perf_1() {
        let mut t = Tester { n: 0 };

        t.incr(54);
        t.gen("aa");
    }

    #[test]
    fn perf_2() {
        let mut t = Tester { n: 0 };

        t.incr(54 * 64 * 64 * 64 * 64 * 64 * 64 * 64);
        t.gen("_jjjjjjk")
    }
}
