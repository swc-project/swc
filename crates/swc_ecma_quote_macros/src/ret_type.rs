use std::any::type_name;

use anyhow::{anyhow, bail, Context, Error};
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{AssignTarget, EsVersion};
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput};
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
                "Expr" => return parse(input_str, &mut |p| p.parse_expr().map(|v| *v)),
                "Pat" => return parse(input_str, &mut |p| p.parse_pat()),
                "Stmt" => return parse(input_str, &mut |p| p.parse_stmt_list_item(true)),
                "AssignTarget" => {
                    return parse(input_str, &mut |p| {
                        Ok(AssignTarget::try_from(p.parse_pat()?)
                            .expect("failed to parse AssignTarget"))
                    })
                }
                "ModuleItem" => return parse(input_str, &mut |p| p.parse_module_item()),
                _ => {}
            }
        }
    }

    bail!("Unknown quote type: {:?}", ty);
}

fn parse<T>(
    input_str: &str,
    op: &mut dyn FnMut(&mut Parser<Lexer>) -> PResult<T>,
) -> Result<BoxWrapper, Error>
where
    T: ToCode,
{
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon.into(), input_str.to_string());

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
        .map(|val| BoxWrapper(Box::new(val)))
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
