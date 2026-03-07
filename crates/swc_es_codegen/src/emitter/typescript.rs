use swc_es_ast::{TsKeywordType, TsType, TsTypeMemberKind, TsTypeOperatorOp};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_ts_type(&mut self, id: swc_es_ast::TsTypeId) -> EmitResult {
        self.emit_ts_type_inner(id, false)
    }

    fn emit_ts_type_inner(&mut self, id: swc_es_ast::TsTypeId, in_array_elem: bool) -> EmitResult {
        let store = self.store;
        let ty = Self::get_ts_type(store, id)?;

        match ty {
            TsType::Keyword(keyword) => {
                self.out.push_str(match keyword {
                    TsKeywordType::Any => "any",
                    TsKeywordType::Unknown => "unknown",
                    TsKeywordType::Never => "never",
                    TsKeywordType::Void => "void",
                    TsKeywordType::String => "string",
                    TsKeywordType::Number => "number",
                    TsKeywordType::Boolean => "boolean",
                    TsKeywordType::Symbol => "symbol",
                    TsKeywordType::Object => "object",
                    TsKeywordType::BigInt => "bigint",
                    TsKeywordType::Undefined => "undefined",
                    TsKeywordType::Intrinsic => "intrinsic",
                });
                Ok(())
            }
            TsType::TypeRef(type_ref) => {
                self.write_ident_sym(&type_ref.name.sym);
                if !type_ref.type_args.is_empty() {
                    self.out.push_byte(b'<');
                    for (idx, arg) in type_ref.type_args.iter().enumerate() {
                        if idx != 0 {
                            self.out.push_byte(b',');
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.out.push_byte(b'>');
                }
                Ok(())
            }
            TsType::Lit(lit) => {
                match lit {
                    swc_es_ast::TsLitType::Str(v) => self.out.write_js_string(v.value.as_ref()),
                    swc_es_ast::TsLitType::Num(v) => self.out.write_number(v.value),
                    swc_es_ast::TsLitType::Bool(v) => {
                        if v.value {
                            self.out.push_str("true");
                        } else {
                            self.out.push_str("false");
                        }
                    }
                }
                Ok(())
            }
            TsType::Array(array) => {
                let inner = Self::get_ts_type(store, array.elem_type)?;
                let needs_paren = matches!(
                    inner,
                    TsType::Union(_)
                        | TsType::Intersection(_)
                        | TsType::Conditional(_)
                        | TsType::Fn(_)
                        | TsType::Mapped(_)
                );
                if needs_paren {
                    self.out.push_byte(b'(');
                }
                self.emit_ts_type_inner(array.elem_type, true)?;
                if needs_paren {
                    self.out.push_byte(b')');
                }
                self.out.push_str("[]");
                Ok(())
            }
            TsType::Tuple(tuple) => {
                self.out.push_byte(b'[');
                for (idx, elem) in tuple.elem_types.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_ts_type(*elem)?;
                }
                self.out.push_byte(b']');
                Ok(())
            }
            TsType::Union(union) => {
                if in_array_elem {
                    self.out.push_byte(b'(');
                }
                for (idx, item) in union.types.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b'|');
                    }
                    self.emit_ts_type(*item)?;
                }
                if in_array_elem {
                    self.out.push_byte(b')');
                }
                Ok(())
            }
            TsType::Intersection(intersection) => {
                if in_array_elem {
                    self.out.push_byte(b'(');
                }
                for (idx, item) in intersection.types.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b'&');
                    }
                    self.emit_ts_type(*item)?;
                }
                if in_array_elem {
                    self.out.push_byte(b')');
                }
                Ok(())
            }
            TsType::Parenthesized(parenthesized) => {
                self.out.push_byte(b'(');
                self.emit_ts_type(parenthesized.ty)?;
                self.out.push_byte(b')');
                Ok(())
            }
            TsType::TypeLit(type_lit) => {
                self.out.push_byte(b'{');
                for member in &type_lit.members {
                    self.emit_ts_type_member(member)?;
                }
                self.out.push_byte(b'}');
                Ok(())
            }
            TsType::Fn(fn_type) => {
                self.out.push_byte(b'(');
                for (idx, param) in fn_type.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_ts_fn_param(param)?;
                }
                self.out.push_str(")=>");
                self.emit_ts_type(fn_type.return_type)
            }
            TsType::Conditional(conditional) => {
                self.emit_ts_type(conditional.check_type)?;
                self.out.push_str(" extends ");
                self.emit_ts_type(conditional.extends_type)?;
                self.out.push_byte(b'?');
                self.emit_ts_type(conditional.true_type)?;
                self.out.push_byte(b':');
                self.emit_ts_type(conditional.false_type)
            }
            TsType::IndexedAccess(indexed) => {
                self.emit_ts_type(indexed.obj_type)?;
                self.out.push_byte(b'[');
                self.emit_ts_type(indexed.index_type)?;
                self.out.push_byte(b']');
                Ok(())
            }
            TsType::TypeOperator(operator) => {
                self.out.push_str(match operator.op {
                    TsTypeOperatorOp::KeyOf => "keyof ",
                    TsTypeOperatorOp::ReadOnly => "readonly ",
                    TsTypeOperatorOp::Unique => "unique ",
                });
                self.emit_ts_type(operator.ty)
            }
            TsType::Infer(infer) => {
                self.out.push_str("infer ");
                self.write_ident_sym(&infer.type_param.sym);
                Ok(())
            }
            TsType::Import(import) => {
                self.out.push_str("import(");
                self.out.write_js_string(import.arg.value.as_ref());
                self.out.push_byte(b')');
                if let Some(qualifier) = &import.qualifier {
                    self.out.push_byte(b'.');
                    self.write_ident_sym(&qualifier.sym);
                }
                if !import.type_args.is_empty() {
                    self.out.push_byte(b'<');
                    for (idx, arg) in import.type_args.iter().enumerate() {
                        if idx != 0 {
                            self.out.push_byte(b',');
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.out.push_byte(b'>');
                }
                Ok(())
            }
            TsType::TypeQuery(query) => {
                self.out.push_str("typeof ");
                self.write_ident_sym(&query.expr_name.sym);
                if !query.type_args.is_empty() {
                    self.out.push_byte(b'<');
                    for (idx, arg) in query.type_args.iter().enumerate() {
                        if idx != 0 {
                            self.out.push_byte(b',');
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.out.push_byte(b'>');
                }
                Ok(())
            }
            TsType::Mapped(mapped) => {
                self.out.push_byte(b'{');
                if let Some(readonly) = mapped.readonly {
                    if readonly {
                        self.out.push_str("+readonly ");
                    } else {
                        self.out.push_str("-readonly ");
                    }
                }
                self.out.push_byte(b'[');
                self.write_ident_sym(&mapped.type_param.sym);
                self.out.push_str(" in ");
                self.emit_ts_type(mapped.constraint)?;
                self.out.push_byte(b']');
                if let Some(optional) = mapped.optional {
                    if optional {
                        self.out.push_str("+?");
                    } else {
                        self.out.push_str("-?");
                    }
                }
                if let Some(ty) = mapped.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b'}');
                Ok(())
            }
        }
    }

    pub(super) fn emit_ts_type_member(&mut self, member: &swc_es_ast::TsTypeMember) -> EmitResult {
        match member.kind {
            TsTypeMemberKind::Property => {
                if member.readonly {
                    self.out.push_str("readonly ");
                }
                if let Some(name) = &member.name {
                    self.emit_prop_name(name)?;
                }
                if member.optional {
                    self.out.push_byte(b'?');
                }
                if let Some(ty) = member.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b';');
            }
            TsTypeMemberKind::Method => {
                if member.readonly {
                    self.out.push_str("readonly ");
                }
                if let Some(name) = &member.name {
                    self.emit_prop_name(name)?;
                }
                if member.optional {
                    self.out.push_byte(b'?');
                }
                self.out.push_byte(b'(');
                for (idx, param) in member.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_ts_fn_param(param)?;
                }
                self.out.push_byte(b')');
                if let Some(ty) = member.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b';');
            }
            TsTypeMemberKind::Call => {
                self.out.push_byte(b'(');
                for (idx, param) in member.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_ts_fn_param(param)?;
                }
                self.out.push_byte(b')');
                if let Some(ty) = member.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b';');
            }
            TsTypeMemberKind::Construct => {
                self.out.push_str("new(");
                for (idx, param) in member.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_ts_fn_param(param)?;
                }
                self.out.push_byte(b')');
                if let Some(ty) = member.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b';');
            }
            TsTypeMemberKind::Index => {
                if member.readonly {
                    self.out.push_str("readonly ");
                }
                self.out.push_byte(b'[');
                if let Some(param) = member.params.first() {
                    if param.is_rest {
                        self.out.push_str("...");
                    }
                    if let Some(name) = &param.name {
                        self.write_ident_sym(&name.sym);
                    } else {
                        self.out.push_byte(b'_');
                    }
                    if param.optional {
                        self.out.push_byte(b'?');
                    }
                    if let Some(ty) = param.ty {
                        self.out.push_byte(b':');
                        self.emit_ts_type(ty)?;
                    }
                }
                self.out.push_byte(b']');
                if let Some(ty) = member.ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
                self.out.push_byte(b';');
            }
        }

        Ok(())
    }

    fn emit_ts_fn_param(&mut self, param: &swc_es_ast::TsFnParam) -> EmitResult {
        if param.is_rest {
            self.out.push_str("...");
        }

        match (&param.name, param.ty) {
            (Some(name), ty) => {
                self.write_ident_sym(&name.sym);
                if param.optional {
                    self.out.push_byte(b'?');
                }
                if let Some(ty) = ty {
                    self.out.push_byte(b':');
                    self.emit_ts_type(ty)?;
                }
            }
            (None, Some(ty)) => self.emit_ts_type(ty)?,
            (None, None) => self.out.push_byte(b'_'),
        }

        Ok(())
    }
}
