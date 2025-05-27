#![expect(clippy::print_stdout)]

use swc_ecma_regexp::{LiteralParser, Options};

fn main() {
    for (pattern_text, flags_text) in [
        (r"ab", ""),
        (r"abc", "i"),
        (r"abcd", "igv"),
        (r"emo👈🏻ji", "u"),
        (r"ab|c", "i"),
        (r"a|b+|c", "i"),
        (r"a{0}|b{1,2}|c{3,}", "i"),
        (r"(?=a)|(?<=b)|(?!c)|(?<!d)", "i"),
        (r"\n\cM\0\x41\.", ""),
        (r"\n\cM\0\x41\u1234\.", "u"),
        (r"\n\cM\0\x41\u{1f600}\.", "u"),
        (r"a\k<f>x\1c", "u"),
        (r"(cg)(?<n>cg)(?:g)", ""),
        (r"{3}", ""), // Error
        (r"Em🥹j", ""),
        (r"^(?=ab)\b(?!cd)(?<=ef)\B(?<!gh)$", ""),
        (r"^(?<!ab)$", ""),
        (r"a)", ""), // Error
        (r"c]", ""),
        (r"[abc]", ""),
        (r"[|\]]", ""),
        (r"[a&&b]", "v"),
        (r"[a--b]", "v"),
        (r"[a&&&]", "v"), // Error
        (r"[a---]", "v"), // Error
        (r"[^a--b--c]", "v"),
        (r"[a[b[c[d[e[f[g[h[i[j[k[l]]]]]]]]]]]]", "v"),
        (r"[\q{abc|d|e|}]", "v"),
        (r"\p{Basic_Emoji}", "v"),
        (r"\p{Basic_Emoji}", "u"), // Error
        (r"[[^\q{}]]", "v"),       // Error
        (r"(?<a>)(?<a>)", ""),     // Error
        (r"(?noname)", "v"),       // Error
        (r"[\bb]", ""),
        (r"a{2,1}", "v"), // Error
    ] {
        let parser = LiteralParser::new(
            pattern_text,
            Some(flags_text),
            // +1 for added `/` in error reports
            Options {
                pattern_span_offset: 1,
                ..Options::default()
            },
        );
        let ret = parser.parse();

        let literal = format!("/{pattern_text}/{flags_text}");
        println!("Parse: {literal}");
        match ret {
            Ok(pattern) => {
                println!("✨ {pattern:#?}");
            }
            Err(error) => {
                // [TODO]: Use swc error handling
                // let error = error.with_source_code(literal);
                println!("💥 {error:?}");
            }
        }
        println!();
    }
}
