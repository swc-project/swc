pub mod ast;
mod diagnostics;
mod options;
mod parser;
mod surrogate_pair;

pub use crate::{
    options::Options,
    parser::{ConstructorParser, LiteralParser},
};

#[cfg(test)]
mod test {

    use crate::{LiteralParser, Options};

    type Case<'a> = (
        &'a str,
        /* expected display, None means expect the same as original */ Option<&'a str>,
    );

    static CASES: &[Case] = &[
        ("/ab/", None),
        ("/ab/u", None),
        ("/abc/i", None),
        ("/abc/iu", None),
        ("/a*?/i", None),
        ("/a*?/iu", None),
        ("/emo👈🏻ji/", None),
        ("/emo👈🏻ji/u", None),
        ("/ab|c/i", None),
        ("/ab|c/iu", None),
        ("/a|b+|c/i", None),
        ("/a|b+|c/iu", None),
        ("/(?=a)|(?<=b)|(?!c)|(?<!d)/i", None),
        ("/(?=a)|(?<=b)|(?!c)|(?<!d)/iu", None),
        (r"/(cg)(?<n>cg)(?:g)/", None),
        (r"/(cg)(?<n>cg)(?:g)/u", None),
        (r"/^(?=ab)\b(?!cd)(?<=ef)\B(?<!gh)$/", None),
        (r"/^(?=ab)\b(?!cd)(?<=ef)\B(?<!gh)$/u", None),
        (r"/^(?<!ab)$/", None),
        (r"/^(?<!ab)$/u", None),
        (r"/[abc]/", None),
        (r"/[abc]/u", None),
        (r"/[a&&b]/v", None),
        (r"/[a--b]/v", None),
        (r"/[^a--b--c]/v", None),
        (r"/[a[b[c[d[e[f[g[h[i[j[k[l]]]]]]]]]]]]/v", None),
        (r"/[\q{abc|d|e|}]/v", None),
        (r"/\p{Basic_Emoji}/v", None),
        (r"/[|\]]/", None),
        (r"/[|\]]/u", None),
        (r"/c\]/", None),
        (r"/c\]/u", None),
        ("/a{0}|b{1,2}|c{3,}/i", None),
        ("/a{0}|b{1,2}|c{3,}/iu", None),
        (r"/Em🥹j/", None),
        (r"/Em🥹j/u", None),
        (r"/\n\cM\0\x41\./", None),
        (r"/\n\cM\0\x41\./u", None),
        (r"/\n\cM\0\x41\u1234\./", None),
        (r"/\n\cM\0\x41\u1234\./u", None),
        (r"/[\bb]/", None),
        (r"/[\bb]/u", None),
        (r"/\d+/g", None),
        (r"/\d+/gu", None),
        (r"/\D/g", None),
        (r"/\D/gu", None),
        (r"/\w/g", None),
        (r"/\w/gu", None),
        (r"/\w+/g", None),
        (r"/\w+/gu", None),
        (r"/\s/g", None),
        (r"/\s/gu", None),
        (r"/\s+/g", None),
        (r"/\s+/gu", None),
        (r"/\t\n\v\f\r/", None),
        (r"/\t\n\v\f\r/u", None),
        (r"/\p{L}/u", None),
        (r"/\d/g", None),
        ("/abcd/igv", Some("/abcd/igv")),
        (r"/\d/ug", Some(r"/\d/ug")),
        (r"/\cY/", None),
        // we capitalize hex unicodes.
        (
            r"/\n\cM\0\x41\u{1f600}\./u",
            Some(r"/\n\cM\0\x41\u{1F600}\./u"),
        ),
        (r"/\u02c1/u", Some(r"/\u02C1/u")),
        (r"/c]/", None),
        // Octal tests from: <https://github.com/tc39/test262/blob/d62fa93c8f9ce5e687c0bbaa5d2b59670ab2ff60/test/annexB/language/literals/regexp/legacy-octal-escape.js>
        (r"/\1/", None),
        (r"/\2/", None),
        (r"/\3/", None),
        (r"/\4/", None),
        (r"/\5/", None),
        (r"/\6/", None),
        (r"/\7/", None),
        (r"/\00/", None),
        (r"/\07/", None),
        (r"/\30/", None),
        (r"/\37/", None),
        (r"/\40/", None),
        (r"/\47/", None),
        (r"/\70/", None),
        (r"/\77/", None),
        (r"/\000/", None),
        (r"/\007/", None),
        (r"/\070/", None),
        (r"/\300/", None),
        (r"/\307/", None),
        (r"/\370/", None),
        (r"/\377/", None),
        (r"/\0111/", None),
        (r"/\0022/", None),
        (r"/\0003/", None),
        (r"/(.)\1/", None),
        // Identity escape from: <https://github.com/tc39/test262/blob/d62fa93c8f9ce5e687c0bbaa5d2b59670ab2ff60/test/annexB/language/literals/regexp/identity-escape.js>
        (r"/\C/", None),
        (r"/O\PQ/", None),
        (r"/\8/", None),
        (r"/7\89/", None),
        (r"/\9/", None),
        (r"/8\90/", None),
        (r"/(.)(.)(.)(.)(.)(.)(.)(.)\8\8/", None),
        // Class escape from: <https://github.com/tc39/test262/blob/d62fa93c8f9ce5e687c0bbaa5d2b59670ab2ff60/test/annexB/language/literals/regexp/class-escape.js>
        (r"/\c0/", None),
        (r"/[\c0]/", None),
        (r"/\c1/", None),
        (r"/[\c10]+/", None),
        (r"/\c8/", None),
        (r"/[\c8]/", None),
        (r"/[\c80]+/", None),
        (r"/\c_/", None),
        // Capitalize hex unicodes --
        (r"/^|\udf06/gu", Some(r"/^|\uDF06/gu")),
        (r"/\udf06/", Some(r"/\uDF06/")),
        (r"/\udf06/u", Some(r"/\uDF06/u")),
        (r"/^|\udf06/g", Some(r"/^|\uDF06/g")),
        // --
        (r"/[\-]/", None),
        (r"/[\-]/u", None),
        (r"/[\-]/v", None),
        (r"/([\-a-z]{0,31})/iu", None),
        // ES2025 ---
        (r"/(?i:.)/", None),
        (r"/(?-s:.)/", None),
        (r"/(?im-s:.)/u", None),
        (r"/(?m-is:.)/v", None),
        (r"/(?smi:.)/v", Some(r"/(?ims:.)/v")),
    ];

    #[test]
    fn test_display() {
        for (input, output) in CASES {
            let (left_slash, right_slash) = (input.find('/').unwrap(), input.rfind('/').unwrap());

            let pattern = &input[left_slash + 1..right_slash];
            let flags = &input[right_slash + 1..];

            let actual = LiteralParser::new(pattern, Some(flags), Options::default())
                .parse()
                .unwrap();

            let expect = output.unwrap_or(input);
            assert_eq!(expect, format!("/{actual}/{flags}")); // This uses `Display` impls
        }
    }
}
