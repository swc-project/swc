use anyhow::{anyhow, bail, Context, Error};
use swc_ecma_ast::{AssignTarget, Expr, Pat, Program, Stmt};
use swc_ecma_parser::{Parser, SourceType};
use syn::{GenericArgument, PathArguments, Type};

use crate::{ast::ToCode, ctxt::Ctx};

/// Storage for `dyn ToCode`.The first `Box`, which is required to store `dyn
/// ToCode`, is ignored.
pub struct BoxWrapper(Box<dyn ToCode>);

impl ToCode for BoxWrapper {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        (*self.0).to_code(cx)
    }
}

pub(crate) fn parse_input_type(input_str: &str, ty: &Type) -> Result<BoxWrapper, Error> {
    if let Some(ty) = extract_generic("Box", ty) {
        let node = parse_input_type(input_str, ty).context("failed to parse `T` in Box<T>")?;
        return Ok(BoxWrapper(Box::new(Box::new(node))));
    }

    if let Some(ty) = extract_generic("Option", ty) {
        if input_str.is_empty() {
            return Ok(BoxWrapper(Box::new(None::<swc_ecma_ast::Expr>)));
        }

        let node = parse_input_type(input_str, ty).context("failed to parse `T` in Option<T>")?;
        return Ok(BoxWrapper(Box::new(Some(node))));
    }

    if let Type::Path(p) = ty {
        if let Some(ident) = p.path.get_ident() {
            match &*ident.to_string() {
                "Expr" => return parse_expression(input_str),
                "Pat" => return parse_pattern(input_str),
                "Stmt" => {
                    let Program::Script(mut script) = parse_program(input_str, SourceType::script())?
                    else {
                        unreachable!("script source type must produce a script")
                    };
                    let statement = script
                        .body
                        .pop()
                        .ok_or_else(|| anyhow!("input is not a statement"))?;
                    return Ok(BoxWrapper(Box::new(statement)));
                }
                "AssignTarget" => {
                    let pattern = parse_pattern_node(input_str)?;
                    let target = AssignTarget::try_from(pattern)
                        .expect("failed to parse AssignTarget");
                    return Ok(BoxWrapper(Box::new(target)));
                }
                "ModuleItem" => {
                    let Program::Module(mut module) =
                        parse_program(input_str, SourceType::module())?
                    else {
                        unreachable!("module source type must produce a module")
                    };
                    let item = module
                        .body
                        .pop()
                        .ok_or_else(|| anyhow!("input is not a module item"))?;
                    return Ok(BoxWrapper(Box::new(item)));
                }
                _ => {}
            }
        }
    }

    bail!("Unknown quote type: {ty:?}");
}

fn parse_program(input: &str, source_type: SourceType) -> Result<Program, Error> {
    let result = Parser::new(input, source_type).parse();
    if let Some(error) = result.diagnostics.first() {
        return Err(anyhow!("{error:?}"));
    }
    Ok(result.program)
}

fn parse_expression(input: &str) -> Result<BoxWrapper, Error> {
    let wrapped = format!("({input})");
    let Program::Script(mut script) = parse_program(&wrapped, SourceType::script())? else {
        unreachable!("script source type must produce a script")
    };
    let Some(Stmt::Expr(statement)) = script.body.pop() else {
        bail!("input is not an expression")
    };
    let Expr::Paren(parenthesized) = *statement.expr else {
        unreachable!("wrapped quote expression must remain parenthesized")
    };
    Ok(BoxWrapper(Box::new(*parenthesized.expr)))
}

fn parse_pattern(input: &str) -> Result<BoxWrapper, Error> {
    Ok(BoxWrapper(Box::new(parse_pattern_node(input)?)))
}

fn parse_pattern_node(input: &str) -> Result<Pat, Error> {
    let wrapped = format!("({input}) => {{}}");
    let Program::Script(mut script) = parse_program(&wrapped, SourceType::script())? else {
        unreachable!("script source type must produce a script")
    };
    let Some(Stmt::Expr(statement)) = script.body.pop() else {
        bail!("input is not a pattern")
    };
    let Expr::Arrow(mut arrow) = *statement.expr else {
        bail!("input is not a pattern")
    };
    if arrow.params.len() != 1 {
        bail!("input is not a single pattern")
    }
    Ok(arrow.params.pop().unwrap())
}

fn extract_generic<'a>(name: &str, ty: &'a Type) -> Option<&'a Type> {
    if let Type::Path(p) = ty {
        let last = p.path.segments.last().unwrap();

        if !last.arguments.is_empty() && last.ident == name {
            match &last.arguments {
                PathArguments::AngleBracketed(tps) => {
                    let arg = tps.args.first().unwrap();

                    match arg {
                        GenericArgument::Type(arg) => return Some(arg),
                        _ => unimplemented!("generic parameter other than type"),
                    }
                }
                _ => unimplemented!("Box() -> T or Box without a type parameter"),
            }
        }
    }

    None
}
