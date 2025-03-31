use swc_ecma_ast::*;
use swc_ecma_codegen_macros::{emitter, node_impl};

use super::Result;
use crate::r::WrieJs;

#[node_impl]
impl MacroNode for ParamOrTsParamProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ParamOrTsParamProp::Param(n) => emit!(n),
            ParamOrTsParamProp::TsParamProp(n) => emit!(n),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{input::SourceFileInput, Mark, DUMMY_SP};
    use swc_ecma_ast::*;

    use super::*;
    use crate::{
        config::{transform_word_to_lower_camel_case, Config},
        text_writer::{JsWriter, WriteJs},
        *,
    };

    fn qualified_type() {
        let out = buf_from_type(TsType::TsTypeRef(TsTypeRef {
            span: DUMMY_SP,
            type_name: TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                span: DUMMY_SP,
                left: TsEntityName::Ident(quote_ident!("lib")),
                right: quote_ident!("K"),
            })),
            type_params: None,
        }));

        assert_eq!(out, "lib.K");
    }

    fn type_arg() {
        let out = buf_from_type(TsType::TsTypeRef(TsTypeRef {
            span: DUMMY_SP,
            type_name: TsEntityName::Ident(quote_ident!("Array")),
            type_params: Some(Box::new(TsTypeParamInstantiation {
                span: DUMMY_SP,
                params: vec![TsType::TsKeywordType(TsKeywordType {
                    span: DUMMY_SP,
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                })],
            })),
        }));

        assert_eq!(out, "Array<number>");
    }

    fn no_type_arg() {
        let out = buf_from_type(TsType::TsTypeRef(TsTypeRef {
            span: DUMMY_SP,
            type_name: TsEntityName::Ident(quote_ident!("Array")),
            type_params: None,
        }));

        assert_eq!(out, "Array");
    }

    fn buf_from_type(t: TsType) -> String {
        let c = Config {
            minify: false,
            transform_word_to_lower_camel_case: false,
        };
        let mut buf = vec![];
        let handlers = Box::<NullSourceMapperExt>::default();

        {
            let mut wr = JsWriter::new(c, &mut buf, None, Some(&handlers));
            let mut emitter = Emitter {
                cfg: c,
                comments: None,
                wr: &mut wr,
                handlers: &handlers,
            };

            emitter.emit_ts_type(&t).unwrap();
        }

        String::from_utf8_lossy(&buf).to_string()
    }
}
