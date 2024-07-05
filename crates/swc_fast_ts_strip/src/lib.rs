use anyhow::Error;
use serde::Deserialize;
use swc_core::{
    common::{
        comments::SingleThreadedComments,
        errors::{Handler, HANDLER},
        sync::Lrc,
        BytePos, FileName, SourceMap, Span, Spanned,
    },
    ecma::{
        ast::{
            Decorator, EsVersion, Program, TsAsExpr, TsEnumDecl, TsModuleDecl, TsNamespaceDecl,
            TsNonNullExpr, TsParamPropParam, TsSatisfiesExpr, TsTypeAliasDecl, TsTypeAnn,
        },
        parser::{
            parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax, TsSyntax,
        },
        visit::{Visit, VisitWith},
    },
};

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

    let mut replacements = vec![];
    // Strip typescript types
    program.visit_with(&mut TsStrip {
        replacements: &mut replacements,
    });

    if replacements.is_empty() {
        return Ok(fm.src.to_string());
    }

    let mut code = String::with_capacity(fm.src.len());
    let mut index = 0;

    for r in replacements {
        code.push_str(&fm.src[index..(r.0 .0 - 1) as usize]);
        index = (r.1 .0 - 1) as usize;
    }

    code.push_str(&fm.src[index..]);

    Ok(code)
}

struct TsStrip<'a> {
    replacements: &'a mut Vec<(BytePos, BytePos)>,
}

impl TsStrip<'_> {
    fn add_replacement(&mut self, span: Span) {
        self.replacements.push((span.lo, span.hi));
    }
}

impl Visit for TsStrip<'_> {
    fn visit_decorator(&mut self, n: &Decorator) {
        HANDLER.with(|handler| {
            handler.span_err(n.span, "Decorators are not supported");
        });
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

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        if n.declare {
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

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript parameter property is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.add_replacement(n.span);
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        self.add_replacement(span(n.span.hi - BytePos(1), n.span.hi));

        n.expr.visit_children_with(self);
    }
}

fn span(lo: BytePos, hi: BytePos) -> Span {
    Span::new(lo, hi, Default::default())
}
