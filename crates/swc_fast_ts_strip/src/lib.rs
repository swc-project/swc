use anyhow::Error;
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span, Spanned,
};
use swc_ecma_ast::{
    BindingIdent, Decorator, EsVersion, Ident, ImportDecl, ImportSpecifier, Param, Pat, Program,
    TsAsExpr, TsConstAssertion, TsEnumDecl, TsInstantiation, TsModuleDecl, TsModuleName,
    TsNamespaceDecl, TsNonNullExpr, TsParamPropParam, TsSatisfiesExpr, TsTypeAliasDecl, TsTypeAnn,
};
use swc_ecma_parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax, TsSyntax,
};
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
    let mut errors = vec![];

    let program = match options.module {
        Some(true) => parse_file_as_module(&fm, syntax, target, Some(&comments), &mut errors)
            .map(Program::Module),
        Some(false) => parse_file_as_script(&fm, syntax, target, Some(&comments), &mut errors)
            .map(Program::Script),
        None => parse_file_as_program(&fm, syntax, target, Some(&comments), &mut errors),
    };

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

    // Strip typescript types
    let mut ts_strip = TsStrip::new(fm.src.clone());
    program.visit_with(&mut ts_strip);

    let replacements = ts_strip.replacements;

    if replacements.is_empty() {
        return Ok(fm.src.to_string());
    }

    let mut code = fm.src.to_string().into_bytes();

    for r in replacements {
        code[(r.0 .0 - 1) as usize..(r.1 .0 - 1) as usize].fill(b' ');
    }

    String::from_utf8(code).map_err(|_| anyhow::anyhow!("failed to convert to utf-8"))
}

struct TsStrip {
    src: Lrc<String>,
    replacements: Vec<(BytePos, BytePos)>,
}

impl TsStrip {
    fn new(src: Lrc<String>) -> Self {
        TsStrip {
            src,
            replacements: Default::default(),
        }
    }
}

impl TsStrip {
    fn add_replacement(&mut self, span: Span) {
        self.replacements.push((span.lo, span.hi));
    }
}

impl Visit for TsStrip {
    fn visit_decorator(&mut self, n: &Decorator) {
        HANDLER.with(|handler| {
            handler.span_err(n.span, "Decorators are not supported");
        });
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

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        n.visit_children_with(self);

        if n.optional {
            self.add_replacement(span(n.id.span.hi, n.id.span.hi + BytePos(1)));
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
