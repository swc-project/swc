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
        x += reverse_base54(*c);
    }

    ret += x;

    ret
}

fn reverse_base54(c: u8) -> usize {
    match &c {
        b'a'..=b'z' => (c - b'a').into(),
        b'A'..=b'Z' => (c - b'A' + 26).into(),
        b'$' => 52,
        b'_' => 53,
        b'0'..=b'9' => (c - b'0' + 54).into(),
        _ => panic!("invalid base54 char: {}", c as char),
    }
}

trait Reserved {
    fn is_reserved(&self) -> bool;

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool;

    fn is_reserved_in_strict_bind(&self) -> bool;

    fn is_reserved_in_es3(&self) -> bool;
}

const RESERVED: [usize; 24] = [
    260,        // do
    571,        // if
    579,        // in
    24903,      // for
    57036,      // new
    82446,      // try
    89543,      // var
    750138,     // case
    1319482,    // else
    1327810,    // enum
    3715201,    // null
    5234632,    // this
    5276346,    // true
    5787577,    // void
    6025853,    // with
    35630528,   // break
    48012861,   // catch
    50819656,   // class
    51659337,   // const
    98312762,   // false
    321674951,  // super
    335053132,  // throw
    385347706,  // while
    4211585658, // delete
];

// u32::MAX is 4294967295

// const RESERVED_U64: [usize; 13] = [
//     5605184009,         // export
//     9715601929,         // import
//     19246133763,        // return
//     20618976829,        // switch
//     21728047419,        // typeof
//     269439774857,       // default
//     358796246664,       // extends
//     411307876494,       // finally
//     1089730735930,      // package
//     13542199411386,     // continue
//     17240182476487,     // debugger
//     27148373455171,     // function
//     163295746507125051, // instanceof
// ];

const AWAIT: usize = 20148169;

const RESERVED_IN_STRICT_MODE: [usize; 2] = [
    48841,     // let
    419147897, // yield
];

// const RESERVED_IN_STRICT_MODE_U64: [usize; 7] = [
//     17362329528,        // public
//     20566548408,        // static
//     1089730735930,      // package
//     1108087894650,      // private
//     2551548935630394,   // interface
//     4539138248580793,   // protected
//     163000531913818760, // implements
// ];

const RESERVED_IN_STRICT_BIND: [usize; 1] = [
    1359297, // eval
];
// const ARGUMENTS: usize = 316465050567304;

const RESERVED_IN_ES3: [usize; 8] = [
    37129,     // int
    586362,    // byte
    777671,    // char
    1856132,   // goto
    3166460,   // long
    100416961, // final
    101207497, // float
    318263817, // short
];

// const RESERVED_IN_ES3_U64: [usize; 7] = [
//     4381704314,       // double
//     14884008698,      // native
//     21443400520,      // throws
//     142892051907,     // boolean
//     3858124205641,    // abstract
//     97102619734138,   // volatile
//     5664069876691209, // transient
// ];

// const SYNCHRONIZED: usize = 17363901597402070713;

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

    #[cfg(not(target_arch = "wasm32"))]
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

    #[cfg(not(target_arch = "wasm32"))]
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

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn generate_reserved_in_strict_bind() {
        ["eval", "arguments"].iter().for_each(|s| {
            debug!("{}, // {}", decode(s), s);
        })
    }

    #[cfg(not(target_arch = "wasm32"))]
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
    fn skip_reserved() {
        let mut init = RESERVED[0];
        let target = init + 2;
        let gen = encode(&mut init, BASE54_DEFAULT_CHARS, true);
        assert_eq!(gen, "dp");
        assert_eq!(init, target);
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
