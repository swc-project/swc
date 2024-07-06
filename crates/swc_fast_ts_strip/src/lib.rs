use std::{cell::RefCell, rc::Rc};

use anyhow::Error;
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span, Spanned,
};
use swc_ecma_ast::{
    ArrowExpr, BindingIdent, Class, ClassMethod, ClassProp, Decorator, EsVersion, ExportAll,
    ExportDecl, ExportSpecifier, FnDecl, Ident, ImportDecl, ImportSpecifier, MethodKind,
    NamedExport, Param, Pat, Program, TsAsExpr, TsConstAssertion, TsEnumDecl, TsInstantiation,
    TsInterfaceDecl, TsModuleDecl, TsModuleName, TsNamespaceDecl, TsNonNullExpr, TsParamPropParam,
    TsSatisfiesExpr, TsTypeAliasDecl, TsTypeAnn, TsTypeAssertion, TsTypeParamDecl,
    TsTypeParamInstantiation, VarDecl,
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, StringInput, Syntax, TsSyntax};
use swc_ecma_visit::{Visit, VisitWith};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default)]
    pub module: Option<bool>,
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default = "default_ts_syntax")]
    pub parser: TsSyntax,
}

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

pub fn operate(
    cm: &Lrc<SourceMap>,
    handler: &Handler,
    input: String,
    options: Options,
) -> Result<String, Error> {
    let filename = options
        .filename
        .map_or(FileName::Anon, |f| FileName::Real(f.into()));

    let fm = cm.new_source_file(filename, input);

    let syntax = Syntax::Typescript(options.parser);
    let target = EsVersion::latest();

    let comments = SingleThreadedComments::default();

    let lexer = Capturing::new(Lexer::new(
        syntax,
        target,
        StringInput::from(&*fm),
        Some(&comments),
    ));
    let tokens = lexer.tokens().clone();

    let mut parser = Parser::new_from(lexer);

    let program = match options.module {
        Some(true) => parser.parse_module().map(Program::Module),
        Some(false) => parser.parse_script().map(Program::Script),
        None => parser.parse_program(),
    };
    let errors = parser.take_errors();

    let program = match program {
        Ok(program) => program,
        Err(err) => {
            err.into_diagnostic(handler).emit();

            for e in errors {
                e.into_diagnostic(handler).emit();
            }

            return Err(anyhow::anyhow!("failed to parse"));
        }
    };

    if !errors.is_empty() {
        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        return Err(anyhow::anyhow!("failed to parse"));
    }

    drop(parser);
    let mut tokens = RefCell::into_inner(Rc::try_unwrap(tokens).unwrap());

    tokens.sort_by_key(|t| t.span);

    // Strip typescript types
    let mut ts_strip = TsStrip::new(cm.clone(), fm.src.clone());
    program.visit_with(&mut ts_strip);

    let mut replacements = ts_strip.replacements;
    let removals = ts_strip.removals;

    for pos in ts_strip.remove_token_after {
        let index = tokens.binary_search_by_key(&pos, |t| t.span.lo);
        let index = match index {
            Ok(index) => index,
            Err(index) => index,
        };

        let token = &tokens[index];

        replacements.push((token.span.lo, token.span.hi));
    }

    if replacements.is_empty() && removals.is_empty() {
        return Ok(fm.src.to_string());
    }

    let mut code = fm.src.to_string().into_bytes();

    for r in replacements {
        code[(r.0 .0 - 1) as usize..(r.1 .0 - 1) as usize].fill(b' ');
    }

    // Assert that removal does not overlap with each other

    for removal in removals.iter() {
        for r in &removals {
            if removal == r {
                continue;
            }

            assert!(
                r.0 < removal.0 || r.1 < removal.0 || r.0 > removal.1 || r.1 > removal.1,
                "removal {:?} overlaps with replacement {:?}",
                removal,
                r
            );
        }
    }

    for removal in removals.iter().copied().rev() {
        code.drain((removal.0 .0 - 1) as usize..(removal.1 .0 - 1) as usize);
    }

    String::from_utf8(code).map_err(|_| anyhow::anyhow!("failed to convert to utf-8"))
}

struct TsStrip {
    cm: Lrc<SourceMap>,
    src: Lrc<String>,

    /// Replaced with whitespace
    replacements: Vec<(BytePos, BytePos)>,

    /// Applied after replacements. Used for arrow functions.
    removals: Vec<(BytePos, BytePos)>,

    remove_token_after: Vec<BytePos>,
}

impl TsStrip {
    fn new(cm: Lrc<SourceMap>, src: Lrc<String>) -> Self {
        TsStrip {
            cm,
            src,
            replacements: Default::default(),
            removals: Default::default(),
            remove_token_after: Default::default(),
        }
    }
}

impl TsStrip {
    fn add_replacement(&mut self, span: Span) {
        self.replacements.push((span.lo, span.hi));
    }

    fn add_removal(&mut self, span: Span) {
        self.removals.push((span.lo, span.hi));
    }
}

impl Visit for TsStrip {
    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        if let Some(ret) = &n.return_type {
            let mut sp = self.cm.span_extend_to_prev_char(ret.span, ')');

            let pos = self.src[(sp.hi.0 as usize - 1)..].find("=>").unwrap();

            sp.hi.0 += pos as u32;

            self.add_removal(sp);
        }

        n.type_params.visit_with(self);
        n.params.visit_with(self);
        n.body.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        n.visit_children_with(self);

        if n.optional {
            self.remove_token_after
                .push(n.id.span.lo + BytePos(n.id.sym.len() as u32));
        }
    }

    fn visit_class(&mut self, n: &Class) {
        n.visit_children_with(self);

        let lo = match &n.super_class {
            Some(v) => v.span().hi,
            None => n.span.lo,
        };
        let hi = skip_until(self.src.as_bytes(), lo.0, b'{');
        self.add_replacement(span(lo, BytePos(hi)));
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        if n.function.body.is_none() {
            self.add_replacement(n.span);
            return;
        }

        let hi = match n.kind {
            MethodKind::Method => {
                if n.is_static {
                    self.cm
                        .span_extend_to_next_str(span(n.span.lo, n.span.lo), "static", false)
                        .hi
                } else {
                    n.key.span().lo
                }
            }
            MethodKind::Getter => {
                self.cm
                    .span_extend_to_next_str(span(n.span.lo, n.span.lo), "get", false)
                    .hi
            }
            MethodKind::Setter => {
                self.cm
                    .span_extend_to_next_str(span(n.span.lo, n.span.lo), "set", false)
                    .hi
            }
        };

        self.add_replacement(span(n.span.lo, hi));

        n.visit_children_with(self);
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        let hi = if n.is_static {
            self.cm
                .span_extend_to_next_str(span(n.span.lo, n.span.lo), "static", false)
                .hi
        } else {
            n.key.span().lo
        };

        self.add_replacement(span(n.span.lo, hi));

        n.visit_children_with(self);
    }

    fn visit_decorator(&mut self, n: &Decorator) {
        HANDLER.with(|handler| {
            handler.span_err(n.span, "Decorators are not supported");
        });
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        match n.decl {
            swc_ecma_ast::Decl::TsInterface(_)
            | swc_ecma_ast::Decl::TsTypeAlias(_)
            | swc_ecma_ast::Decl::TsEnum(_)
            | swc_ecma_ast::Decl::TsModule(_) => {
                self.add_replacement(n.span);
            }

            _ => {
                n.visit_children_with(self);
            }
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        if n.function.body.is_none() {
            self.add_replacement(n.function.span);
            return;
        }
        n.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_import_specifiers(&mut self, n: &[ImportSpecifier]) {
        for (i, import) in n.iter().enumerate() {
            let ImportSpecifier::Named(import) = import else {
                continue;
            };

            if import.is_type_only {
                let mut span = import.span;
                span.hi.0 = n.get(i + 1).map(|x| x.span_lo().0).unwrap_or_else(|| {
                    let bytes = self.src.as_bytes();
                    skip_until(bytes, span.hi.0, b'}')
                });
                self.add_replacement(span);
            }
        }
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        for export in n.specifiers.iter() {
            if let ExportSpecifier::Named(e) = export {
                if e.is_type_only {
                    let sp = self.cm.span_extend_to_next_char(e.span, ',');
                    self.add_replacement(span(sp.lo, sp.hi + BytePos(1)));
                }
            }
        }
    }

    fn visit_params(&mut self, n: &[Param]) {
        if let Some(p) = n.first().filter(|param| {
            matches!(
                &param.pat,
                Pat::Ident(BindingIdent {
                    id: Ident { sym, .. },
                    ..
                }) if &**sym == "this"
            )
        }) {
            let mut span = p.span;

            if n.len() == 1 {
                let bytes = self.src.as_bytes();
                span.hi.0 = skip_until(bytes, span.hi.0, b')');
            } else {
                span.hi = n[1].span.lo;
                n[1..].visit_children_with(self);
            }

            self.add_replacement(span);

            return;
        }

        n.visit_children_with(self);
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        if e.declare {
            self.add_replacement(e.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                e.span,
                "TypeScript enum is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_instantiation(&mut self, n: &TsInstantiation) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        if n.declare || matches!(n.id, TsModuleName::Str(..)) {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript namespace declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript module declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        self.add_replacement(span(n.span.hi - BytePos(1), n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript parameter property is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        self.add_replacement(span(n.span.lo, n.expr.span().lo));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.add_replacement(span(n.span.lo, n.span.hi));
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }
}

fn span(lo: BytePos, hi: BytePos) -> Span {
    Span::new(lo, hi, Default::default())
}

fn skip_until(bytes: &[u8], mut pos: u32, stop: u8) -> u32 {
    while bytes[(pos - 1) as usize] != stop {
        pos += 1;
    }

    pos
}
