//! Verifies that the parser interns the raw text of literals in the lexer's
//! local atom store, not in the thread-local global atom store.
//!
//! The global store keeps an entry alive after the AST is dropped, until the
//! embedder runs a global atom store GC. A long-lived process that parses many
//! distinct literals then retains their raw text. See
//! <https://github.com/swc-project/swc/issues/12839>.

use swc_atoms::Atom;
use swc_common::{BytePos, Span};
use swc_ecma_ast::{BigInt, JSXText, Module, Number, Str, TplElement};
use swc_ecma_parser::{input::Tokens, EsSyntax, Lexer, Parser, StringInput, Syntax};
use swc_ecma_visit::{Visit, VisitWith};

/// Each literal except the property values is longer than the inline atom
/// limit, so its raw atom has a heap allocation that a pointer comparison can
/// identify.
const SRC: &str = r#"
const str = "raw-string-literal-0123456789";
const num = 123456789.123456789;
const big = 123456789012345678901234567890n;
const tpl = `raw-template-head-0123456789${str}raw-template-tail-0123456789`;
const tpl2 = `raw-template-no-substitution-0123456789`;
const obj = { 9876543210.0123456: 1, 98765432109876543210n: 2, "raw-prop-key-0123456789": 3 };
const el = <div>raw-jsx-text-0123456789</div>;
"#;

/// The longest text that an atom stores inline on 64-bit targets.
const INLINE_ATOM_MAX_LEN: usize = 7;

/// Collects the raw atoms of all literals in a module.
#[derive(Default)]
struct RawCollector {
    raws: Vec<Atom>,
}

impl Visit for RawCollector {
    fn visit_str(&mut self, n: &Str) {
        self.raws.extend(n.raw.clone());
    }

    fn visit_number(&mut self, n: &Number) {
        self.raws.extend(n.raw.clone());
    }

    fn visit_big_int(&mut self, n: &BigInt) {
        self.raws.extend(n.raw.clone());
    }

    fn visit_tpl_element(&mut self, n: &TplElement) {
        self.raws.push(n.raw.clone());
    }

    fn visit_jsx_text(&mut self, n: &JSXText) {
        self.raws.push(n.raw.clone());
    }
}

fn lexer(src: &str) -> Lexer<'_> {
    let input = StringInput::new(src, BytePos(1), BytePos(src.len() as u32 + 1));
    Lexer::new(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        input,
        None,
    )
}

fn parse<I: Tokens>(tokens: I) -> Module {
    let mut parser = Parser::new_from(tokens);
    let module = parser.parse_module().expect("failed to parse the module");
    assert!(parser.take_errors().is_empty());
    module
}

/// Asserts that no raw atom of `module` shares its allocation with the
/// global atom of the same text.
fn assert_raws_are_not_global(module: &Module) {
    let mut collector = RawCollector::default();
    module.visit_with(&mut collector);

    // Short atoms are stored inline and have no allocation to compare.
    let raws: Vec<_> = collector
        .raws
        .iter()
        .filter(|raw| raw.len() > INLINE_ATOM_MAX_LEN)
        .collect();

    // 2 strings, 2 numbers, 2 BigInts, 3 template elements, and 1 JSX text.
    assert_eq!(raws.len(), 10, "raws: {raws:?}");

    for raw in raws {
        let global = Atom::new(raw.as_str());
        assert_eq!(raw, &global);
        assert_ne!(
            raw.as_str().as_ptr(),
            global.as_str().as_ptr(),
            "raw text {raw:?} is interned in the global atom store"
        );
    }
}

#[test]
fn lexer_interns_raw_text_locally() {
    let module = parse(lexer(SRC));
    assert_raws_are_not_global(&module);
}

#[cfg(feature = "unstable")]
#[test]
fn capturing_interns_raw_text_locally() {
    use swc_ecma_parser::unstable::Capturing;

    let module = parse(Capturing::new(lexer(SRC)));
    assert_raws_are_not_global(&module);
}

#[test]
fn lexer_read_atom_returns_source_text() {
    let lexer = lexer(SRC);
    let start = SRC.find("raw-string").unwrap() as u32 + 1;
    let span = Span::new(BytePos(start), BytePos(start + 10));
    assert_eq!(&*lexer.read_atom(span), "raw-string");
}
