use swc_atoms::Atom;
use swc_es_ast::{
    AstStore, Class, ClassId, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId, Function,
    FunctionId, JSXElement, JSXElementId, ModuleDecl, ModuleDeclId, Pat, PatId, Program, ProgramId,
    Stmt, StmtId, TsType, TsTypeId,
};

use crate::{
    writer::{is_ascii_ident_name, Writer},
    CodegenConfig, CodegenError, NodeKind, OutputFormat,
};

mod decl;
mod expr;
mod jsx;
mod module_decl;
mod pat;
mod stmt;
mod typescript;

pub(crate) struct Emitter<'a> {
    store: &'a AstStore,
    cfg: CodegenConfig,
    out: Writer,
}

type EmitResult = Result<(), CodegenError>;

impl<'a> Emitter<'a> {
    #[inline]
    pub fn new(store: &'a AstStore, cfg: CodegenConfig) -> Self {
        Self {
            store,
            cfg,
            out: Writer::new(),
        }
    }

    pub fn emit_program(mut self, program_id: ProgramId) -> Result<String, CodegenError> {
        match self.cfg.format {
            OutputFormat::Canonical => {
                self.emit_program_node(program_id)?;
                self.out.into_string()
            }
        }
    }

    fn emit_program_node(&mut self, id: ProgramId) -> EmitResult {
        let store = self.store;
        let body = {
            let program = Self::get_program(store, id)?;
            program.body.clone()
        };

        for stmt_id in body {
            self.emit_stmt(stmt_id)?;
        }
        Ok(())
    }

    #[inline]
    fn get_program(store: &AstStore, id: ProgramId) -> Result<&Program, CodegenError> {
        store
            .program(id)
            .ok_or_else(|| Self::missing(NodeKind::Program, id.as_raw()))
    }

    #[inline]
    fn get_stmt(store: &AstStore, id: StmtId) -> Result<&Stmt, CodegenError> {
        store
            .stmt(id)
            .ok_or_else(|| Self::missing(NodeKind::Stmt, id.as_raw()))
    }

    #[inline]
    fn get_decl(store: &AstStore, id: DeclId) -> Result<&Decl, CodegenError> {
        store
            .decl(id)
            .ok_or_else(|| Self::missing(NodeKind::Decl, id.as_raw()))
    }

    #[inline]
    fn get_pat(store: &AstStore, id: PatId) -> Result<&Pat, CodegenError> {
        store
            .pat(id)
            .ok_or_else(|| Self::missing(NodeKind::Pat, id.as_raw()))
    }

    #[inline]
    fn get_expr(store: &AstStore, id: ExprId) -> Result<&Expr, CodegenError> {
        store
            .expr(id)
            .ok_or_else(|| Self::missing(NodeKind::Expr, id.as_raw()))
    }

    #[inline]
    fn get_module_decl(store: &AstStore, id: ModuleDeclId) -> Result<&ModuleDecl, CodegenError> {
        store
            .module_decl(id)
            .ok_or_else(|| Self::missing(NodeKind::ModuleDecl, id.as_raw()))
    }

    #[inline]
    fn get_class(store: &AstStore, id: ClassId) -> Result<&Class, CodegenError> {
        store
            .class(id)
            .ok_or_else(|| Self::missing(NodeKind::Class, id.as_raw()))
    }

    #[inline]
    fn get_class_member(store: &AstStore, id: ClassMemberId) -> Result<&ClassMember, CodegenError> {
        store
            .class_member(id)
            .ok_or_else(|| Self::missing(NodeKind::ClassMember, id.as_raw()))
    }

    #[inline]
    fn get_function(store: &AstStore, id: FunctionId) -> Result<&Function, CodegenError> {
        store
            .function(id)
            .ok_or_else(|| Self::missing(NodeKind::Function, id.as_raw()))
    }

    #[inline]
    fn get_jsx_element(store: &AstStore, id: JSXElementId) -> Result<&JSXElement, CodegenError> {
        store
            .jsx_element(id)
            .ok_or_else(|| Self::missing(NodeKind::JSXElement, id.as_raw()))
    }

    #[inline]
    fn get_ts_type(store: &AstStore, id: TsTypeId) -> Result<&TsType, CodegenError> {
        store
            .ts_type(id)
            .ok_or_else(|| Self::missing(NodeKind::TsType, id.as_raw()))
    }

    #[cold]
    fn missing(kind: NodeKind, raw_id: u64) -> CodegenError {
        CodegenError::MissingNode { kind, raw_id }
    }

    #[cold]
    fn invalid_ast(context: &'static str) -> CodegenError {
        CodegenError::invalid_ast(context)
    }

    #[inline]
    fn write_ident_sym(&mut self, sym: &Atom) {
        self.out.push_str(sym.as_ref());
    }

    #[inline]
    fn write_private_ident_sym(&mut self, sym: &Atom) {
        let text = sym.as_ref();
        if text.starts_with('#') {
            self.out.push_str(text);
            return;
        }

        self.out.push_byte(b'#');
        self.out.push_str(text);
    }

    #[inline]
    fn write_module_name(&mut self, sym: &Atom) {
        let text = sym.as_ref();
        if is_ascii_ident_name(text) {
            self.out.push_str(text);
        } else {
            self.out.write_js_string(text);
        }
    }
}
