use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

mod captures;
pub(super) mod mutation;
mod scope;

const SCRATCH: &str = "_loop_init_";

pub(super) fn initializer_scopes(program: &mut Program) -> Initializers {
    let mut pass = InitializerScopes::default();
    program.visit_mut_with(&mut pass);
    pass.initializers
}

#[derive(Default)]
pub(super) struct Initializers {
    pub bindings: FxHashSet<Id>,
    pub loops: FxHashMap<SyntaxContext, Ident>,
}

#[derive(Default)]
struct InitializerScopes {
    symbols: Symbols,
    initializers: Initializers,
    next_scratch: usize,
}

#[derive(Default)]
struct Symbols {
    identifiers: FxHashSet<Atom>,
}

impl Symbols {
    fn reserve_text(&mut self, text: &[u8]) {
        let decoded;
        let text = if text.windows(2).any(|part| part == b"\\u") {
            decoded = decode_ascii_unicode_escapes(text);
            decoded.as_slice()
        } else {
            text
        };
        for (index, part) in text.windows(SCRATCH.len()).enumerate() {
            if part == SCRATCH.as_bytes() {
                let suffix = index + SCRATCH.len();
                let digits = text[suffix..]
                    .iter()
                    .take_while(|byte| byte.is_ascii_digit())
                    .count();
                if digits != 0 && text.get(suffix + digits) == Some(&b'_') {
                    let name = std::str::from_utf8(&text[index..suffix + digits + 1])
                        .expect("scratch identifiers are ASCII");
                    self.identifiers.insert(name.into());
                }
            }
        }
    }
}

// Only ASCII characters can contribute to the generated scratch spellings.
// Decode their Unicode identifier escapes, leaving unrelated JavaScript escapes
// intact. This reserves literal eval names without interpreting eval programs.
fn decode_ascii_unicode_escapes(text: &[u8]) -> Vec<u8> {
    let mut decoded = Vec::with_capacity(text.len());
    let mut index = 0;
    while index < text.len() {
        if let Some((byte, length)) = ascii_unicode_escape(&text[index..]) {
            decoded.push(byte);
            index += length;
        } else {
            decoded.push(text[index]);
            index += 1;
        }
    }
    decoded
}

fn ascii_unicode_escape(text: &[u8]) -> Option<(u8, usize)> {
    let text = text.strip_prefix(b"\\u")?;
    let (digits, length) = if let Some(text) = text.strip_prefix(b"{") {
        let end = text.iter().position(|byte| !byte.is_ascii_hexdigit())?;
        if text[end] != b'}' {
            return None;
        }
        (&text[..end], end + 4)
    } else {
        (text.get(..4)?, 6)
    };
    if digits.is_empty() {
        return None;
    }
    let mut value = 0u8;
    for &byte in digits {
        let digit = match byte {
            b'0'..=b'9' => byte - b'0',
            b'a'..=b'f' => byte - b'a' + 10,
            b'A'..=b'F' => byte - b'A' + 10,
            _ => return None,
        };
        value = value.checked_mul(16)?.checked_add(digit)?;
    }
    value.is_ascii().then_some((value, length))
}

impl Visit for Symbols {
    noop_visit_type!();

    fn visit_ident(&mut self, ident: &Ident) {
        self.identifiers.insert(ident.sym.clone());
    }

    fn visit_ident_name(&mut self, ident: &IdentName) {
        // Generator lowering hoists yielding catch bindings into variables.
        // Reserve property names too, so an enclosing `with` object cannot
        // intercept those variables through a statically named property.
        // Dynamically constructed properties can still intercept generated
        // variables after that lowering; static reservation cannot prevent it.
        self.identifiers.insert(ident.sym.clone());
    }

    fn visit_str(&mut self, value: &Str) {
        // Eval source can mention identifiers that have no parsed Ident node.
        // Reserve those spellings without reparsing strings or retaining them.
        // Dynamically constructed eval names can still observe generated bindings,
        // as with other compiler helpers; literal reservation cannot prevent that.
        self.reserve_text(value.value.as_bytes());
    }

    fn visit_tpl_element(&mut self, value: &TplElement) {
        self.reserve_text(value.raw.as_bytes());
        if let Some(cooked) = &value.cooked {
            self.reserve_text(cooked.as_bytes());
        }
    }
}

impl InitializerScopes {
    fn scratch(&mut self) -> Ident {
        loop {
            let name = Atom::from(format!("{SCRATCH}{}_", self.next_scratch).as_str());
            self.next_scratch += 1;
            // Hygiene appends numbers when renaming. An unused spelling ending in
            // an underscore cannot collide with one of those generated names.
            if self.symbols.identifiers.insert(name.clone()) {
                return private_ident!(name);
            }
        }
    }
}

impl VisitMut for InitializerScopes {
    noop_visit_mut_type!();

    fn visit_mut_program(&mut self, program: &mut Program) {
        program.visit_with(&mut self.symbols);
        program.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        let Some(node) = labeled_for(stmt) else {
            stmt.visit_mut_children_with(self);
            return;
        };

        // Rewrite nested loops first, but keep this loop's complete label
        // chain together so `continue label` still targets the actual loop.
        node.visit_mut_children_with(self);
        let Some(VarDeclOrExpr::VarDecl(decl)) = &mut node.init else {
            return;
        };
        // Unlike `let`, `const` does not create per-iteration bindings.
        if decl.kind != VarDeclKind::Let {
            return;
        }
        let bindings = super::find_lexical_vars(decl);
        if bindings.is_empty() {
            return;
        }
        let usage = captures::analyze(decl, &bindings);
        if !usage.captured {
            return;
        }

        let scratch = self.scratch();
        let mut stmts = Vec::new();
        if usage.has_yield {
            // Generator lowering hoists catch bindings when their handlers yield.
            // Declare iteration IDs first so hygiene keeps their source names for
            // direct eval and inferred names in the loop body after that hoisting.
            stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: bindings
                        .iter()
                        .map(|id| VarDeclarator {
                            span: DUMMY_SP,
                            name: Ident::new(id.0.clone(), DUMMY_SP, id.1).into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                    ..Default::default()
                }
                .into(),
            );
        }
        let (copies, initialization) = scope::separate(
            decl.take(),
            bindings,
            &scratch,
            &mut self.initializers.bindings,
        );
        *decl = copies;
        decl.ctxt = scratch.ctxt;
        self.initializers
            .loops
            .insert(scratch.ctxt, scratch.clone());
        stmts.push(initialization);
        stmts.push(stmt.take());
        *stmt = scope::catch(scratch, stmts);
    }
}

fn labeled_for(stmt: &mut Stmt) -> Option<&mut ForStmt> {
    match stmt {
        Stmt::For(node) => Some(node),
        Stmt::Labeled(node) => labeled_for(&mut node.body),
        _ => None,
    }
}
