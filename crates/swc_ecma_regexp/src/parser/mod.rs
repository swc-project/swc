mod flags_parser;
mod parser_impl;
mod pattern_parser;
mod reader;
mod span_factory;

pub use parser_impl::{ConstructorParser, LiteralParser};

#[cfg(test)]
mod test {

    use crate::{ConstructorParser, LiteralParser, Options};

    #[test]
    fn should_pass() {
        for (pattern_text, flags_text) in &[
            ("", ""),
            ("a", ""),
            ("a+", ""),
            ("a*", ""),
            ("a?", ""),
            ("^$^$^$", ""),
            ("(?=a){1}", ""),
            ("(?!a){1}", ""),
            ("a{1}", ""),
            ("a{1", ""),
            ("a|{", ""),
            ("a{", ""),
            ("a{,", ""),
            ("a{1,", ""),
            ("a{1,}", ""),
            ("a{1,2}", ""),
            ("x{9007199254740991}", ""),
            ("x{9007199254740991,9007199254740991}", ""),
            ("a|b", ""),
            ("a|b|c", ""),
            ("a|b+?|c", ""),
            ("a+b*?c{1}d{2,}e{3,4}?", ""),
            (r"^(?=ab)\b(?!cd)(?<=ef)\B(?<!gh)$", ""),
            ("a.b..", ""),
            (r"\d\D\s\S\w\W", ""),
            (r"\x", ""),
            (
                r"\p{Emoji_Presentation}\P{Script_Extensions=Latin}\p{Sc}|\p{Basic_Emoji}",
                "",
            ),
            (
                r"\p{Emoji_Presentation}\P{Script_Extensions=Latin}\p{Sc}|\p{P}",
                "u",
            ),
            (r"^\p{General_Category=cntrl}+$", "u"),
            (r"\p{Basic_Emoji}", "v"),
            (r"\n\cM\0\x41\u1f60\.\/", ""),
            (r"\c0", ""),
            (r"\0", ""),
            (r"\0", "u"),
            (r"\u", ""),
            (r"\u{", ""),
            (r"\u{}", ""),
            (r"\u{0}", ""),
            (r"\u{1f600}", ""),
            (r"\u{1f600}", "u"),
            ("(?:abc)", ""),
            (r"(?<\u{1d49c}>.)\x1f", ""),
            ("a]", ""),
            ("a}", ""),
            ("]", ""),
            ("[]", ""),
            ("[a]", ""),
            ("[ab]", ""),
            ("[a-b]", ""),
            ("[-]", ""),
            ("[a-]", ""),
            ("[-a]", ""),
            ("[-a-]", ""),
            (r"[a\-b]", ""),
            (r"[-a-b]", ""),
            (r"[a-b-]", ""),
            (r"[a\-b-]", ""),
            (r"[\[\]\-]", ""),
            ("[a-z0-9]", ""),
            ("[a-a]", ""),
            (r"[\d-\D]", ""),
            (r"^([\ud801[\udc28-\udc4f])$", ""),
            (r"[a-c]]", ""),
            (
                r"[ϗϙϛϝϟϡϣϥϧϩϫϭϯ-ϳϵϸϻ-ϼа-џѡѣѥѧѩѫѭѯѱѳѵѷѹѻѽѿҁҋҍҏґғҕҗҙқҝҟҡңҥҧҩҫҭүұҳҵҷҹһҽҿӂӄӆӈӊӌӎ-ӏӑӓӕӗәӛӝӟӡӣӥӧөӫӭӯӱӳӵӷӹӻӽӿԁԃԅԇԉԋԍԏԑԓԕԗԙԛԝԟԡԣա-ևᴀ-ᴫᵢ-ᵷᵹ-ᶚḁḃḅḇḉḋḍḏḑḓḕḗḙḛḝḟḡḣḥḧḩḫḭḯḱḳḵḷḹḻḽḿṁṃṅṇṉṋṍṏṑṓṕṗṙṛṝṟṡṣṥṧṩṫṭṯṱṳṵṷṹṻṽṿẁẃẅẇẉẋẍẏẑẓẕ-ẝẟạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỻỽỿ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ]",
                "",
            ),
            (r"[a-z0-9[.\\]]", "v"),
            (r"[a&&b&&c]", "v"),
            (r"[a--b--c]", "v"),
            (r"[[a-z]--b--c]", "v"),
            (r"[[[[[[[[[[[[[[[[[[[[[[[[a]]]]]]]]]]]]]]]]]]]]]]]]", "v"),
            (r"[\q{}\q{a}\q{bc}\q{d|e|f}\q{|||}]", "v"),
            (r"(?<foo>A)\k<foo>", ""),
            (r"(?<!a>)\k<a>", ""),
            (r"\k", ""),
            (r"\k<4>", ""),
            (r"\k<a>", ""),
            (r"(?<a>)\k<a>", ""),
            (r"(?<a>)\k<a>", "u"),
            (r"\1", ""),
            (r"\1()", ""),
            (r"\1()", "u"),
            (r"(?<n1>..)(?<n2>..)", ""),
            // ES2025 ---
            // Duplicate named capturing groups
            (r"(?<n1>..)|(?<n1>..)", ""),
            (r"(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})", ""),
            (r"(?:(?<a>x)|(?<a>y))\k<a>", ""),
            (r"(?<x>a)|(?<x>b)", ""),
            (r"(?:(?<x>a)|(?<y>a)(?<x>b))(?:(?<z>c)|(?<z>d))", ""),
            (r"(?:(?<x>a)|(?<x>b))\\k<x>", ""),
            (r"(?:(?:(?<x>a)|(?<x>b)|c)\\k<x>){2}", ""),
            (r"(?:(?:(?<x>a)|(?<x>b))\\k<x>){2}", ""),
            (r"(?:(?:(?<x>a)\\k<x>|(?<x>b)\\k<x>)|(?:))\\k<x>", ""),
            (r"(?:(?:(?<x>a\\k<x>)|(?<x>b\\k<x>))|(?:))\\k<x>", ""),
            // Modifiers
            (r"(?:.)", ""),
            (r"(?s:.)", ""),
            (r"(?ism:.)", ""),
            (r"(?-s:.)", ""),
            (r"(?-smi:.)", ""),
            (r"(?s-im:.)", ""),
            (r"(?si-m:.)", ""),
            (r"(?im-s:.)", "v"),
            (r"(?ims-:.)", ""),
        ] {
            let res =
                LiteralParser::new(pattern_text, Some(flags_text), Options::default()).parse();
            if let Err(err) = res {
                panic!("Failed to parse /{pattern_text}/{flags_text}\n💥 {err}");
            }
        }
    }

    #[test]
    fn should_fail() {
        for (pattern_text, flags_text) in &[
            ("a)", ""),
            (r"a\", ""),
            ("a]", "u"),
            ("a}", "u"),
            ("a|+", ""),
            ("a|{", "u"),
            ("a{", "u"),
            ("a{1", "u"),
            ("a{1,", "u"),
            ("a{,", "u"),
            ("x{9007199254740992}", ""),
            ("x{9007199254740991,9007199254740992}", ""),
            ("x{99999999999999999999999999999999999999999999999999}", ""),
            (r"\99999999999999999999999999999999999999999999999999", ""),
            (r"\u{FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF}", "u"),
            ("(?=a", ""),
            ("(?<!a", ""),
            (r"\c0", "u"),
            (r"\xa", "u"),
            (r"a\u", "u"),
            (r"\p{Emoji_Presentation", "u"),
            (r"\p{Script=", "u"),
            (r"\ka", "u"),
            (r"\k", "u"),
            (r"\k<", "u"),
            (r"\k<>", "u"),
            (r"\k<4>", "u"),
            (r"\k<a", "u"),
            (r"\1", "u"),
            (r"\k<a>", "u"),
            ("a(?:", ""),
            ("(", ""),
            (")", "v"),
            ("(a", ""),
            ("(?<a>", ""),
            ("(?<", ""),
            (r"(?<a\>.)", ""),
            (r"(?<a\>.)", "u"),
            (r"(?<\>.)", ""),
            (r"(?<\>.)", "u"),
            ("(?)", ""),
            ("(?=a){1}", "u"),
            ("(?!a){1}", "u"),
            (r"[\d-\D]", "u"),
            ("[", ""),
            ("[", "v"),
            ("[[", "v"),
            ("[[]", "v"),
            ("[z-a]", ""),
            (r"[a-c]]", "u"),
            (
                r"^([a-zªµºß-öø-ÿāăąćĉċčďđēĕėęěĝğġģĥħĩīĭįıĳĵķ-ĸĺļľŀłńņň-ŉŋōŏőœŕŗřśŝşšţťŧũūŭůűųŵŷźżž-ƀƃƅƈƌ-ƍƒƕƙ-ƛƞơƣƥƨƪ-ƫƭưƴƶƹ-ƺƽ-ƿǆǉǌǎǐǒǔǖǘǚǜ-ǝǟǡǣǥǧǩǫǭǯ-ǰǳǵǹǻǽǿȁȃȅȇȉȋȍȏȑȓȕȗșțȝȟȡȣȥȧȩȫȭȯȱȳ-ȹȼȿ-ɀɂɇɉɋɍɏ-ʓʕ-ʯͱͳͷͻ-ͽΐά-ώϐ-ϑϕ-ϗϙϛϝϟϡϣϥϧϩϫϭϯ-ϳϵϸϻ-ϼа-џѡѣѥѧѩѫѭѯѱѳѵѷѹѻѽѿҁҋҍҏґғҕҗҙқҝҟҡңҥҧҩҫҭүұҳҵҷҹһҽҿӂӄӆӈӊӌӎ-ӏӑӓӕӗәӛӝӟӡӣӥӧөӫӭӯӱӳӵӷӹӻӽӿԁԃԅԇԉԋԍԏԑԓԕԗԙԛԝԟԡԣա-ևᴀ-ᴫᵢ-ᵷᵹ-ᶚḁḃḅḇḉḋḍḏḑḓḕḗḙḛḝḟḡḣḥḧḩḫḭḯḱḳḵḷḹḻḽḿṁṃṅṇṉṋṍṏṑṓṕṗṙṛṝṟṡṣṥṧṩṫṭṯṱṳṵṷṹṻṽṿẁẃẅẇẉẋẍẏẑẓẕ-ẝẟạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỻỽỿ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ-ώᾀ-ᾇᾐ-ᾗᾠ-ᾧᾰ-ᾴᾶ-ᾷιῂ-ῄῆ-ῇῐ-ΐῖ-ῗῠ-ῧῲ-ῴῶ-ῷⁱⁿℊℎ-ℏℓℯℴℹℼ-ℽⅆ-ⅉⅎↄⰰ-ⱞⱡⱥ-ⱦⱨⱪⱬⱱⱳ-ⱴⱶ-ⱼⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⲳⲵⲷⲹⲻⲽⲿⳁⳃⳅⳇⳉⳋⳍⳏⳑⳓⳕⳗⳙⳛⳝⳟⳡⳣ-ⳤⴀ-ⴥꙁꙃꙅꙇꙉꙋꙍꙏꙑꙓꙕꙗꙙꙛꙝꙟꙣꙥꙧꙩꙫꙭꚁꚃꚅꚇꚉꚋꚍꚏꚑꚓꚕꚗꜣꜥꜧꜩꜫꜭꜯ-ꜱꜳꜵꜷꜹꜻꜽꜿꝁꝃꝅꝇꝉꝋꝍꝏꝑꝓꝕꝗꝙꝛꝝꝟꝡꝣꝥꝧꝩꝫꝭꝯꝱ-ꝸꝺꝼꝿꞁꞃꞅꞇꞌﬀ-ﬆﬓ-ﬗａ-ｚ]|\ud801[\udc28-\udc4f]|\ud835[\udc1a-\udc33\udc4e-\udc54\udc56-\udc67\udc82-\udc9b\udcb6-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udccf\udcea-\udd03\udd1e-\udd37\udd52-\udd6b\udd86-\udd9f\uddba-\uddd3\uddee-\ude07\ude22-\ude3b\ude56-\ude6f\ude8a-\udea5\udec2-\udeda\udedc-\udee1\udefc-\udf14\udf16-\udf1b\udf36-\udf4e\udf50-\udf55\udf70-\udf88\udf8a-\udf8f\udfaa-\udfc2\udfc4-\udfc9\udfcb])$",
                "",
            ),
            (r"[[\d-\D]]", "v"),
            (r"[a&&b--c]", "v"),
            (r"[a--b&&c]", "v"),
            (r"[\q{]", "v"),
            (r"[\q{\a}]", "v"),
            // ES2025 ---
            // Duplicate named capturing groups
            (r"(?<n>.)(?<n>.)", ""),
            (r"(?<n>.(?<n>..))", "u"),
            ("(?<n>)|(?<n>)(?<n>)", ""),
            ("(((((((?<n>.)))))))(?<n>)", ""),
            ("(?:(?<x>a)|(?<x>b))(?<x>c)", ""),
            ("(?<x>a)(?:(?<x>b)|(?<x>c))", ""),
            ("(?:(?:(?<x>a)|(?<x>b)))(?<x>c)", ""),
            ("(?:(?:(?<x>a)|(?<x>b))|(?:))(?<x>c)", ""),
            // Modifiers
            (r"(?a:.)", ""),
            (r"(?-S:.)", ""),
            (r"(?-:.)", ""),
            (r"(?iM:.)", ""),
            (r"(?imms:.)", ""),
            (r"(?-sI:.)", ""),
            (r"(?ii-s:.)", ""),
            (r"(?i-msm:.)", ""),
            (r"(?i", ""),
            (r"(?i-", ""),
            (r"(?i-s", ""),
        ] {
            assert!(
                LiteralParser::new(pattern_text, Some(flags_text), Options::default())
                    .parse()
                    .is_err(),
                "/{pattern_text}/{flags_text} should fail to parse, but passed!"
            );
        }
    }

    #[test]
    fn should_fail_early_errors() {
        for (pattern_text, flags_text, is_err) in &[
            // No tests for 4,294,967,295 left parens
            (r"(?<n>..)(?<n>..)", "", true),
            (r"a{2,1}", "", true),
            (r"(?<a>)\k<n>", "", true),
            (r"()\2", "u", true),
            (r"[a-\d]", "u", true),
            (r"[\d-z]", "u", true),
            (r"[\d-\d]", "u", true),
            (r"[z-a]", "", true),
            (r"\u{110000}", "u", true),
            (r"(?<\uD800\uDBFF>)", "", true),
            (r"\u{0}\u{110000}", "u", true),
            (r"(?<a\uD800\uDBFF>)", "", true),
            (r"\p{Foo=Bar}", "u", true),
            (r"\p{Foo}", "u", true),
            (r"\p{Basic_Emoji}", "u", true),
            (r"\P{Basic_Emoji}", "v", true),
            (r"[^\p{Basic_Emoji}]", "v", true),
            (r"[[^\p{Basic_Emoji}]]", "v", true),
            (r"[^\q{}]", "v", true),
            (r"[[^\q{}]]", "v", true),
            (r"[[^\q{ng}]]", "v", true),
            (r"[[^\q{a|}]]", "v", true),
            (r"[[^\q{ng}\q{o|k}]]", "v", true),
            (r"[[^\q{o|k}\q{ng}\q{o|k}]]", "v", true),
            (r"[[^\q{o|k}\q{o|k}\q{ng}]]", "v", true),
            (r"[[^\q{}&&\q{ng}]]", "v", true),
            (r"[[^\q{ng}&&\q{o|k}]]", "v", false),
            (r"[[^\q{ng}&&\q{o|k}&&\q{ng}]]", "v", false),
            (r"[[^\q{ng}--\q{o|k}]]", "v", true),
            (r"[[^\q{o|k}--\q{ng}]]", "v", false),
            (r"[[z-a]]", "v", true),
            (r"[[[[[^[[[[\q{ng}]]]]]]]]]", "v", true),
            (r"[^[[[[[[[[[[[[[[[[\q{ng}]]]]]]]]]]]]]]]]]", "v", true),
            // ES2025 ---
            // Duplicated named capture groups
            ("(?:(?<x>a)|(?<x>b))(?<x>c)", "", true),
            ("(?:(?<x>a)|(?<x>b))(?<X>c)", "", false),
            ("(?<x>a)(?:(?<x>b)|(?<x>c))", "", true),
            ("(?<x>a)|(?:(?<x>b)|(?<x>c))", "", false),
            // Modifiers
            (r"(?ii:.)", "", true),
            (r"(?-ss:.)", "", true),
            (r"(?im-im:.)", "", true),
        ] {
            assert_eq!(
                LiteralParser::new(pattern_text, Some(flags_text), Options::default())
                    .parse()
                    .is_err(),
                *is_err,
                "/{pattern_text}/{flags_text} should fail with early error, but passed!"
            );
        }
    }

    #[test]
    fn should_handle_empty() {
        let pattern1 = LiteralParser::new("", None, Options::default())
            .parse()
            .unwrap();
        let pattern2 = ConstructorParser::new("''", None, Options::default())
            .parse()
            .unwrap();

        assert_eq!(pattern1.body.body[0].body.len(), 1);
        assert_eq!(pattern2.body.body[0].body.len(), 1);
    }

    #[test]
    fn should_handle_unicode() {
        let source_text = "このEmoji🥹の数が変わる";

        for (flags_text, expected) in [(None, 15), (Some("u"), 14), (Some("v"), 14)] {
            let pattern = LiteralParser::new(source_text, flags_text, Options::default())
                .parse()
                .unwrap();
            assert_eq!(pattern.body.body[0].body.len(), expected);
        }
    }

    #[test]
    fn span_offset() {
        let pattern_text = "Adjust span but should have no side effect for parsing";
        let ret1 = LiteralParser::new(
            pattern_text,
            None,
            Options {
                pattern_span_offset: 0,
                flags_span_offset: 0,
            },
        )
        .parse()
        .unwrap();
        let ret2 = LiteralParser::new(
            pattern_text,
            None,
            Options {
                pattern_span_offset: 123,
                flags_span_offset: 456,
            },
        )
        .parse()
        .unwrap();

        assert_ne!(ret1.span, ret2.span);
        assert_eq!(ret1.to_string(), ret2.to_string());
    }

    #[test]
    fn string_literal() {
        let source_text = r"RegExp('Invalid! -> \u{1234568} <-')";
        let err = ConstructorParser::new(
            &source_text[7..35],
            None,
            Options {
                pattern_span_offset: 7,
                ..Options::default()
            },
        )
        .parse();
        assert!(err.is_err());
        // println!("{:?}", err.unwrap_err().with_source_code(source_text));

        let ret1 = LiteralParser::new(r"\d{4}-\d{2}-\d{2}", Some("vi"), Options::default())
            .parse()
            .unwrap();
        let ret2 =
            ConstructorParser::new(r"'\\d{4}-\\d{2}-\\d{2}'", Some("'vi'"), Options::default())
                .parse()
                .unwrap();
        assert_eq!(ret1.to_string(), ret2.to_string());
    }
}
