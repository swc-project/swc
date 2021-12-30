use std::any::type_name;

use crate::ast::{BoxWrapper, ToCode};
use anyhow::{anyhow, bail, Context, Error};
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput};
use syn::{GenericArgument, Ident, PathArguments, Type};

pub(crate) fn parse_input_type(input_str: &str, ty: &Type) -> Result<Box<dyn ToCode>, Error> {
    if let Some(ty) = extract_generic("Box", ty) {
        let node = parse_input_type(input_str, ty).context("failed to parse `T` in Box<T>")?;
        return Ok(Box::new(BoxWrapper {
            inner: Box::new(node),
        }));
    }

    if let Some(ty) = extract_generic("Option", ty) {
        if input_str.is_empty() {
            return Ok(Box::new(None::<swc_ecma_ast::Expr>));
        }

        let node = parse_input_type(input_str, ty).context("failed to parse `T` in Option<T>")?;
        return Ok(Box::new(Some(node)) as _);
    }

    match ty {
        Type::Path(p) => match p.path.get_ident() {
            Some(ident) => match &*ident.to_string() {
                "Expr" => return parse(input_str, &mut |p| p.parse_expr()),
                "Pat" => return parse(input_str, &mut |p| p.parse_pat()),
                "Stmt" => return parse(input_str, &mut |p| p.parse_stmt(true)),
                "ModuleItem" => return parse(input_str, &mut |p| p.parse_module_item()),
                _ => {}
            },
            None => {}
        },

        _ => {}
    }

    bail!("Unknown quote type: {:?}", ty);
}

fn parse<T>(
    input_str: &str,
    op: &mut dyn FnMut(&mut Parser<Lexer<StringInput>>) -> PResult<T>,
) -> Result<Box<dyn ToCode>, Error>
where
    T: ToCode,
{
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon, input_str.to_string());

    let lexer = Lexer::new(
        Default::default(),
        EsVersion::Es2020,
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    op(&mut parser)
        .map_err(|err| anyhow!("{:?}", err))
        .with_context(|| format!("failed to parse input as `{}`", type_name::<T>()))
        .map(|val| Box::new(val) as Box<dyn ToCode>)
}

fn extract_generic<'a>(name: &str, ty: &'a Type) -> Option<&'a Type> {
    match ty {
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == name {
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
        }
        _ => {}
    }

    None
}

fn as_ident(ty: &Type) -> Option<&Ident> {
    match ty {
        Type::Path(p) => p.path.get_ident(),
        _ => None,
    }
}
