use swc_es_ast::{
    TsKeywordType, TsLitType, TsModuleName, TsType, TsTypeId, TsTypeMember, TsTypeMemberKind,
    TsTypeOperatorOp,
};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(crate) fn emit_ts_type(&mut self, ty: TsTypeId) -> Result {
        match self.ts_type(ty).clone() {
            TsType::Keyword(ty) => self.keyword(ts_keyword_text(ty)),
            TsType::TypeRef(ty) => {
                self.emit_ident(&ty.name)?;
                if !ty.type_args.is_empty() {
                    self.punct("<")?;
                    for (index, arg) in ty.type_args.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.punct(">")?;
                }
                Ok(())
            }
            TsType::Lit(lit) => match lit {
                TsLitType::Str(str_lit) => self.emit_string_literal(str_lit.value.as_ref()),
                TsLitType::Num(num_lit) => self.emit_number_literal(num_lit.value),
                TsLitType::Bool(bool_lit) => {
                    if bool_lit.value {
                        self.keyword("true")
                    } else {
                        self.keyword("false")
                    }
                }
            },
            TsType::Array(ty) => {
                let needs_paren = matches!(
                    self.ts_type(ty.elem_type),
                    TsType::Union(_)
                        | TsType::Intersection(_)
                        | TsType::Fn(_)
                        | TsType::Conditional(_)
                        | TsType::Mapped(_)
                );

                if needs_paren {
                    self.punct("(")?;
                }
                self.emit_ts_type(ty.elem_type)?;
                if needs_paren {
                    self.punct(")")?;
                }
                self.punct("[]")
            }
            TsType::Tuple(ty) => {
                self.punct("[")?;
                for (index, item) in ty.elem_types.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_ts_type(*item)?;
                }
                self.punct("]")
            }
            TsType::Union(ty) => {
                for (index, item) in ty.types.iter().enumerate() {
                    if index != 0 {
                        self.write_space_pretty()?;
                        self.punct("|")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_ts_type(*item)?;
                }
                Ok(())
            }
            TsType::Intersection(ty) => {
                for (index, item) in ty.types.iter().enumerate() {
                    if index != 0 {
                        self.write_space_pretty()?;
                        self.punct("&")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_ts_type(*item)?;
                }
                Ok(())
            }
            TsType::Parenthesized(ty) => {
                self.punct("(")?;
                self.emit_ts_type(ty.ty)?;
                self.punct(")")
            }
            TsType::TypeLit(ty) => self.emit_ts_type_members(&ty.members),
            TsType::Fn(ty) => {
                self.emit_ts_fn_params(&ty.params)?;
                self.write_space_pretty()?;
                self.punct("=>")?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.return_type)
            }
            TsType::Conditional(ty) => {
                self.emit_ts_type(ty.check_type)?;
                self.write_space_pretty()?;
                self.keyword("extends")?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.extends_type)?;
                self.write_space_pretty()?;
                self.punct("?")?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.true_type)?;
                self.write_space_pretty()?;
                self.punct(":")?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.false_type)
            }
            TsType::IndexedAccess(ty) => {
                self.emit_ts_type(ty.obj_type)?;
                self.punct("[")?;
                self.emit_ts_type(ty.index_type)?;
                self.punct("]")
            }
            TsType::TypeOperator(ty) => {
                self.keyword(ts_type_operator_text(ty.op))?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.ty)
            }
            TsType::Infer(ty) => {
                self.keyword("infer")?;
                self.write_space_pretty()?;
                self.emit_ident(&ty.type_param)
            }
            TsType::Import(ty) => {
                self.keyword("import")?;
                self.punct("(")?;
                self.emit_string_literal(ty.arg.value.as_ref())?;
                self.punct(")")?;
                if let Some(qualifier) = ty.qualifier {
                    self.punct(".")?;
                    self.emit_ident(&qualifier)?;
                }
                if !ty.type_args.is_empty() {
                    self.punct("<")?;
                    for (index, arg) in ty.type_args.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.punct(">")?;
                }
                Ok(())
            }
            TsType::TypeQuery(ty) => {
                self.keyword("typeof")?;
                self.write_space_pretty()?;
                self.emit_ident(&ty.expr_name)?;
                if !ty.type_args.is_empty() {
                    self.punct("<")?;
                    for (index, arg) in ty.type_args.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ts_type(*arg)?;
                    }
                    self.punct(">")?;
                }
                Ok(())
            }
            TsType::Mapped(ty) => {
                self.punct("{")?;
                if let Some(readonly) = ty.readonly {
                    if readonly {
                        self.keyword("readonly")?;
                        self.write_space_pretty()?;
                    } else {
                        self.punct("-readonly")?;
                        self.write_space_pretty()?;
                    }
                }
                self.punct("[")?;
                self.emit_ident(&ty.type_param)?;
                self.write_space_pretty()?;
                self.keyword("in")?;
                self.write_space_pretty()?;
                self.emit_ts_type(ty.constraint)?;
                self.punct("]")?;
                if let Some(optional) = ty.optional {
                    if optional {
                        self.punct("?")?;
                    } else {
                        self.punct("-?")?;
                    }
                }
                if let Some(value) = ty.ty {
                    self.punct(":")?;
                    self.write_space_pretty()?;
                    self.emit_ts_type(value)?;
                }
                self.punct("}")
            }
        }
    }

    pub(super) fn emit_ts_fn_params(&mut self, params: &[swc_es_ast::TsFnParam]) -> Result {
        self.punct("(")?;
        for (index, param) in params.iter().enumerate() {
            if index != 0 {
                self.punct(",")?;
                self.write_space_pretty()?;
            }
            if param.is_rest {
                self.punct("...")?;
            }
            if let Some(name) = &param.name {
                self.emit_ident(name)?;
                if param.optional {
                    self.punct("?")?;
                }
            }
            if let Some(ty) = param.ty {
                if param.name.is_some() {
                    self.punct(":")?;
                    self.write_space_pretty()?;
                }
                self.emit_ts_type(ty)?;
            }
        }
        self.punct(")")
    }

    pub(super) fn emit_ts_type_members(&mut self, members: &[TsTypeMember]) -> Result {
        self.punct("{")?;
        if !members.is_empty() {
            self.indent();
            self.write_line()?;
        }

        for (index, member) in members.iter().enumerate() {
            if index != 0 {
                self.write_line()?;
            }

            match member.kind {
                TsTypeMemberKind::Property => {
                    if member.readonly {
                        self.keyword("readonly")?;
                        self.write_space_force()?;
                    }
                    if let Some(name) = &member.name {
                        self.emit_prop_name(name)?;
                    }
                    if member.optional {
                        self.punct("?")?;
                    }
                    if let Some(ty) = member.ty {
                        self.punct(":")?;
                        self.write_space_pretty()?;
                        self.emit_ts_type(ty)?;
                    }
                    self.punct(";")?;
                }
                TsTypeMemberKind::Method => {
                    if member.readonly {
                        self.keyword("readonly")?;
                        self.write_space_force()?;
                    }
                    if let Some(name) = &member.name {
                        self.emit_prop_name(name)?;
                    }
                    if member.optional {
                        self.punct("?")?;
                    }
                    self.emit_ts_fn_params(&member.params)?;
                    if let Some(ty) = member.ty {
                        self.punct(":")?;
                        self.write_space_pretty()?;
                        self.emit_ts_type(ty)?;
                    }
                    self.punct(";")?;
                }
                TsTypeMemberKind::Call => {
                    self.emit_ts_fn_params(&member.params)?;
                    if let Some(ty) = member.ty {
                        self.punct(":")?;
                        self.write_space_pretty()?;
                        self.emit_ts_type(ty)?;
                    }
                    self.punct(";")?;
                }
                TsTypeMemberKind::Construct => {
                    self.keyword("new")?;
                    self.write_space_pretty()?;
                    self.emit_ts_fn_params(&member.params)?;
                    if let Some(ty) = member.ty {
                        self.punct(":")?;
                        self.write_space_pretty()?;
                        self.emit_ts_type(ty)?;
                    }
                    self.punct(";")?;
                }
                TsTypeMemberKind::Index => {
                    self.punct("[")?;
                    if let Some(first) = member.params.first() {
                        if let Some(name) = &first.name {
                            self.emit_ident(name)?;
                        }
                        if let Some(ty) = first.ty {
                            self.punct(":")?;
                            self.write_space_pretty()?;
                            self.emit_ts_type(ty)?;
                        }
                    }
                    self.punct("]")?;
                    if let Some(ty) = member.ty {
                        self.punct(":")?;
                        self.write_space_pretty()?;
                        self.emit_ts_type(ty)?;
                    }
                    self.punct(";")?;
                }
            }
        }

        if !members.is_empty() {
            self.dedent();
            self.write_line()?;
        }

        self.punct("}")
    }

    pub(super) fn emit_ts_module_name(&mut self, name: &TsModuleName) -> Result {
        match name {
            TsModuleName::Ident(ident) => self.emit_ident(ident),
            TsModuleName::Str(value) => self.emit_string_literal(value.value.as_ref()),
        }
    }
}

#[inline]
fn ts_keyword_text(ty: TsKeywordType) -> &'static str {
    match ty {
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
    }
}

#[inline]
fn ts_type_operator_text(op: TsTypeOperatorOp) -> &'static str {
    match op {
        TsTypeOperatorOp::KeyOf => "keyof",
        TsTypeOperatorOp::ReadOnly => "readonly",
        TsTypeOperatorOp::Unique => "unique",
    }
}
