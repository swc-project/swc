use dragonbox_ecma::Buffer;
use swc_es_ast::{
    AstStore, Class, ClassId, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId, Function,
    FunctionId, Ident, JSXElement, JSXElementId, ModuleDecl, ModuleDeclId, Pat, PatId, Program,
    ProgramId, PropName, Stmt, StmtId, TsType, TsTypeId,
};

use crate::{
    precedence::{expr_precedence, Precedence},
    token_spacing, Config, Result, WriteJs,
};

mod class;
mod decl;
mod expr;
mod jsx;
mod module_decl;
mod pat;
mod stmt;
mod typescript;

/// Emits JavaScript/TypeScript text from `swc_es_ast` arenas.
pub struct Emitter<'a, W>
where
    W: WriteJs,
{
    pub cfg: Config,
    pub store: &'a AstStore,
    pub wr: W,
    last_char: Option<char>,
}

impl<'a, W> Emitter<'a, W>
where
    W: WriteJs,
{
    #[inline]
    pub fn new(cfg: Config, store: &'a AstStore, wr: W) -> Self {
        Self {
            cfg,
            store,
            wr,
            last_char: None,
        }
    }

    #[inline]
    pub fn emit_program(&mut self, program: ProgramId) -> Result {
        let body = self.program(program).body.clone();
        self.emit_stmt_list(&body)
    }

    #[inline]
    fn program(&self, id: ProgramId) -> &Program {
        self.store
            .program(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing ProgramId {}", id.as_raw()))
    }

    #[inline]
    fn stmt(&self, id: StmtId) -> &Stmt {
        self.store
            .stmt(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing StmtId {}", id.as_raw()))
    }

    #[inline]
    fn decl(&self, id: DeclId) -> &Decl {
        self.store
            .decl(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing DeclId {}", id.as_raw()))
    }

    #[inline]
    fn pat(&self, id: PatId) -> &Pat {
        self.store
            .pat(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing PatId {}", id.as_raw()))
    }

    #[inline]
    fn expr(&self, id: ExprId) -> &Expr {
        self.store
            .expr(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing ExprId {}", id.as_raw()))
    }

    #[inline]
    fn module_decl(&self, id: ModuleDeclId) -> &ModuleDecl {
        self.store
            .module_decl(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing ModuleDeclId {}", id.as_raw()))
    }

    #[inline]
    fn function(&self, id: FunctionId) -> &Function {
        self.store
            .function(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing FunctionId {}", id.as_raw()))
    }

    #[inline]
    fn class(&self, id: ClassId) -> &Class {
        self.store
            .class(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing ClassId {}", id.as_raw()))
    }

    #[inline]
    fn class_member(&self, id: ClassMemberId) -> &ClassMember {
        self.store
            .class_member(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing ClassMemberId {}", id.as_raw()))
    }

    #[inline]
    fn jsx_element(&self, id: JSXElementId) -> &JSXElement {
        self.store
            .jsx_element(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing JSXElementId {}", id.as_raw()))
    }

    #[inline]
    fn ts_type(&self, id: TsTypeId) -> &TsType {
        self.store
            .ts_type(id)
            .unwrap_or_else(|| panic!("swc_es_codegen: missing TsTypeId {}", id.as_raw()))
    }

    #[inline]
    fn write_raw(&mut self, text: &str) -> Result {
        if text.is_empty() {
            return Ok(());
        }

        self.wr.write_raw(text)?;
        self.last_char = text.chars().next_back();
        Ok(())
    }

    #[inline]
    fn write_token(&mut self, text: &str) -> Result {
        if self.cfg.minify && token_spacing::needs_space(self.last_char, text) {
            self.write_space_force()?;
        }

        self.write_raw(text)
    }

    #[inline]
    fn write_space_force(&mut self) -> Result {
        self.wr.write_space()?;
        self.last_char = Some(' ');
        Ok(())
    }

    #[inline]
    fn write_space_pretty(&mut self) -> Result {
        if !self.cfg.minify {
            self.write_space_force()?;
        }

        Ok(())
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        if !self.cfg.minify {
            self.wr.write_newline()?;
            self.last_char = Some('\n');
        }

        Ok(())
    }

    #[inline]
    fn indent(&mut self) {
        if !self.cfg.minify {
            self.wr.increase_indent();
        }
    }

    #[inline]
    fn dedent(&mut self) {
        if !self.cfg.minify {
            self.wr.decrease_indent();
        }
    }

    #[inline]
    fn punct(&mut self, text: &'static str) -> Result {
        self.write_token(text)
    }

    #[inline]
    fn keyword(&mut self, text: &'static str) -> Result {
        self.write_token(text)
    }

    #[inline]
    fn operator(&mut self, text: &'static str) -> Result {
        self.write_token(text)
    }

    #[inline]
    fn emit_ident(&mut self, ident: &Ident) -> Result {
        self.write_token(ident.sym.as_ref())
    }

    #[inline]
    fn emit_prop_name(&mut self, name: &PropName) -> Result {
        match name {
            PropName::Ident(ident) | PropName::Private(ident) => self.emit_ident(ident),
            PropName::Str(value) => self.emit_string_literal(value.value.as_ref()),
            PropName::Num(value) => self.emit_number_literal(value.value),
            PropName::Computed(expr) => {
                self.punct("[")?;
                self.emit_expr(*expr)?;
                self.punct("]")
            }
        }
    }

    #[inline]
    fn emit_number_literal(&mut self, value: f64) -> Result {
        if value == 0.0f64 && value.is_sign_negative() {
            return self.write_token("-0");
        }

        let mut buf = Buffer::new();
        self.write_token(buf.format(value))
    }

    #[inline]
    fn emit_string_literal(&mut self, value: &str) -> Result {
        self.punct("\"")?;
        self.write_raw(&escape_string_literal(value))?;
        self.punct("\"")
    }

    #[inline]
    fn emit_template_quasi(&mut self, value: &str) -> Result {
        self.write_raw(&escape_template_quasi(value))
    }

    #[inline]
    fn emit_expr_with_parens_if_needed(&mut self, expr: ExprId, parent: Precedence) -> Result {
        let precedence = expr_precedence(self.expr(expr));
        let needs_paren = precedence < parent;

        if needs_paren {
            self.punct("(")?;
        }

        self.emit_expr_inner(expr)?;

        if needs_paren {
            self.punct(")")?;
        }

        Ok(())
    }
}

#[inline]
fn escape_string_literal(value: &str) -> String {
    let mut out = String::with_capacity(value.len() + 2);

    for c in value.chars() {
        match c {
            '\\' => out.push_str("\\\\"),
            '"' => out.push_str("\\\""),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            '\u{08}' => out.push_str("\\b"),
            '\u{0C}' => out.push_str("\\f"),
            '\0' => out.push_str("\\0"),
            '\u{2028}' => out.push_str("\\u2028"),
            '\u{2029}' => out.push_str("\\u2029"),
            c if c < ' ' => {
                out.push_str("\\u");
                push_hex4(&mut out, c as u32);
            }
            c => out.push(c),
        }
    }

    out
}

#[inline]
fn escape_template_quasi(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    let mut chars = value.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            '\\' => out.push_str("\\\\"),
            '`' => out.push_str("\\`"),
            '$' => {
                if matches!(chars.peek(), Some('{')) {
                    out.push_str("\\$");
                } else {
                    out.push('$');
                }
            }
            '\u{2028}' => out.push_str("\\u2028"),
            '\u{2029}' => out.push_str("\\u2029"),
            c => out.push(c),
        }
    }

    out
}

#[inline]
fn push_hex4(buf: &mut String, code: u32) {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let n3 = ((code >> 12) & 0xf) as usize;
    let n2 = ((code >> 8) & 0xf) as usize;
    let n1 = ((code >> 4) & 0xf) as usize;
    let n0 = (code & 0xf) as usize;

    buf.push(HEX[n3] as char);
    buf.push(HEX[n2] as char);
    buf.push(HEX[n1] as char);
    buf.push(HEX[n0] as char);
}
