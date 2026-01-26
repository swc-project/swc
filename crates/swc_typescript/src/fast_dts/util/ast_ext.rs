use std::borrow::Cow;

use swc_atoms::Atom;
use swc_common::Mark;
use swc_ecma_ast::{
    BindingIdent, ComputedPropName, Expr, Ident, Lit, MemberProp, ObjectPatProp, Pat, Prop,
    PropName, TsTypeAnn,
};

pub trait ExprExit {
    fn get_root_ident(&self) -> Option<&Ident>;
    fn get_global_symbol_prop(&self, unresolved_mark: Mark) -> Option<&MemberProp>;
}

impl ExprExit for Expr {
    fn get_root_ident(&self) -> Option<&Ident> {
        match self {
            Expr::Member(member_expr) => member_expr.obj.get_root_ident(),
            Expr::Ident(ident) => Some(ident),
            Expr::OptChain(opt_chain_expr) => opt_chain_expr
                .base
                .as_member()
                .and_then(|member_expr| member_expr.obj.get_root_ident()),
            _ => None,
        }
    }

    fn get_global_symbol_prop(&self, unresolved_mark: Mark) -> Option<&MemberProp> {
        let (obj, prop) = (match self {
            Expr::Member(member) => Some((&member.obj, &member.prop)),
            Expr::OptChain(opt_chain) => opt_chain
                .base
                .as_member()
                .map(|member| (&member.obj, &member.prop)),
            _ => None,
        })?;

        // https://github.com/microsoft/TypeScript/blob/cbac1ddfc73ca3b9d8741c1b51b74663a0f24695/src/compiler/transformers/declarations.ts#L1011
        if let Some(ident) = obj.as_ident() {
            // Exactly `Symbol.something` and `Symbol` either does not resolve
            // or definitely resolves to the global Symbol
            return if ident.sym.as_str() == "Symbol" && ident.ctxt.has_mark(unresolved_mark) {
                Some(prop)
            } else {
                None
            };
        }

        if let Some(member_expr) = obj.as_member() {
            // Exactly `globalThis.Symbol.something` and `globalThis` resolves
            // to the global `globalThis`
            if let Some(ident) = member_expr.obj.as_ident() {
                if ident.sym.as_str() == "globalThis"
                    && ident.ctxt.has_mark(unresolved_mark)
                    && member_expr.prop.is_ident_with("Symbol")
                {
                    return Some(prop);
                }
            }
        }

        None
    }
}

pub trait PatExt {
    fn get_type_ann(&self) -> &Option<Box<TsTypeAnn>>;
    fn set_type_ann(&mut self, type_anno: Option<Box<TsTypeAnn>>);
    fn bound_names<F: FnMut(&BindingIdent)>(&self, f: &mut F);
}

impl PatExt for Pat {
    fn get_type_ann(&self) -> &Option<Box<TsTypeAnn>> {
        let pat = match self {
            Pat::Assign(assign_pat) => &assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => &binding_ident.type_ann,
            Pat::Array(array_pat) => &array_pat.type_ann,
            Pat::Rest(rest_pat) => &rest_pat.type_ann,
            Pat::Object(object_pat) => &object_pat.type_ann,
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => &None,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn set_type_ann(&mut self, type_anno: Option<Box<TsTypeAnn>>) {
        let pat = match self {
            Pat::Assign(assign_pat) => &mut assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => binding_ident.type_ann = type_anno,
            Pat::Array(array_pat) => array_pat.type_ann = type_anno,
            Pat::Rest(rest_pat) => rest_pat.type_ann = type_anno,
            Pat::Object(object_pat) => object_pat.type_ann = type_anno,
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn bound_names<F: FnMut(&BindingIdent)>(&self, f: &mut F) {
        match self {
            Pat::Ident(binding_ident) => f(binding_ident),
            Pat::Array(array_pat) => {
                for pat in array_pat.elems.iter().flatten() {
                    pat.bound_names(f);
                }
            }
            Pat::Rest(rest_pat) => rest_pat.arg.bound_names(f),
            Pat::Object(object_pat) => {
                for pat in &object_pat.props {
                    match pat {
                        ObjectPatProp::KeyValue(key_value_pat_prop) => {
                            key_value_pat_prop.value.bound_names(f)
                        }
                        ObjectPatProp::Assign(assign_pat_prop) => f(&assign_pat_prop.key),
                        ObjectPatProp::Rest(rest_pat) => rest_pat.arg.bound_names(f),
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
            }
            Pat::Assign(assign_pat) => assign_pat.left.bound_names(f),
            Pat::Invalid(_) | Pat::Expr(_) => todo!(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

pub trait PropNameExit {
    fn static_name(&self) -> Option<Cow<str>>;
    fn static_prop(&self, unresolved_mark: Mark) -> Option<StaticProp>;
}

impl PropNameExit for PropName {
    fn static_name(&self) -> Option<Cow<str>> {
        match self {
            PropName::Ident(ident_name) => Some(Cow::Borrowed(ident_name.sym.as_str())),
            PropName::Str(string) => Some(Cow::Borrowed(string.value.as_str()?)),
            PropName::Num(number) => Some(Cow::Owned(number.value.to_string())),
            PropName::BigInt(big_int) => Some(Cow::Owned(big_int.value.to_string())),
            PropName::Computed(computed_prop_name) => computed_prop_name.static_name(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn static_prop(&self, unresolved_mark: Mark) -> Option<StaticProp> {
        match self {
            PropName::Computed(c) => c.static_prop(unresolved_mark),
            prop => prop.static_name().map(Into::into).map(StaticProp::Name),
        }
    }
}

impl PropNameExit for ComputedPropName {
    fn static_name(&self) -> Option<Cow<str>> {
        match self.expr.as_ref() {
            Expr::Lit(lit) => match lit {
                Lit::Str(string) => Some(Cow::Borrowed(string.value.as_str()?)),
                Lit::Bool(b) => Some(Cow::Owned(b.value.to_string())),
                Lit::Null(_) => Some(Cow::Borrowed("null")),
                Lit::Num(number) => Some(Cow::Owned(number.value.to_string())),
                Lit::BigInt(big_int) => Some(Cow::Owned(big_int.value.to_string())),
                Lit::Regex(regex) => Some(Cow::Owned(regex.exp.to_string())),
                Lit::JSXText(_) => None,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            Expr::Tpl(tpl) if tpl.exprs.is_empty() => tpl
                .quasis
                .first()
                .and_then(|e| e.cooked.as_ref())
                .and_then(|atom| atom.as_str().map(Cow::Borrowed)),
            _ => None,
        }
    }

    fn static_prop(&self, unresolved_mark: Mark) -> Option<StaticProp> {
        match self.expr.as_ref() {
            Expr::Member(..) | Expr::OptChain(..) => self
                .expr
                .get_global_symbol_prop(unresolved_mark)
                .and_then(|prop| match prop {
                    MemberProp::Ident(ident_name) => {
                        Some(StaticProp::Symbol(ident_name.sym.clone()))
                    }
                    MemberProp::Computed(c) => {
                        c.static_name().map(Into::into).map(StaticProp::Symbol)
                    }
                    MemberProp::PrivateName(..) => None,
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }),
            _ => self.static_name().map(Into::into).map(StaticProp::Name),
        }
    }
}

impl PropNameExit for Prop {
    fn static_name(&self) -> Option<Cow<str>> {
        match self {
            Self::Shorthand(ident_name) => Some(Cow::Borrowed(ident_name.sym.as_str())),
            Self::KeyValue(key_value_prop) => key_value_prop.key.static_name(),
            Self::Assign(..) => None,
            Self::Getter(getter_prop) => getter_prop.key.static_name(),
            Self::Setter(setter_prop) => setter_prop.key.static_name(),
            Self::Method(method_prop) => method_prop.key.static_name(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn static_prop(&self, unresolved_mark: Mark) -> Option<StaticProp> {
        match self {
            Self::Shorthand(ident_name) => Some(StaticProp::Name(ident_name.sym.clone())),
            Self::KeyValue(key_value_prop) => key_value_prop.key.static_prop(unresolved_mark),
            Self::Assign(..) => None,
            Self::Getter(getter_prop) => getter_prop.key.static_prop(unresolved_mark),
            Self::Setter(setter_prop) => setter_prop.key.static_prop(unresolved_mark),
            Self::Method(method_prop) => method_prop.key.static_prop(unresolved_mark),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

pub trait MemberPropExt {
    fn static_name(&self) -> Option<&Atom>;
}

impl MemberPropExt for MemberProp {
    fn static_name(&self) -> Option<&Atom> {
        match self {
            MemberProp::Ident(ident_name) => Some(&ident_name.sym),
            MemberProp::Computed(computed_prop_name) => match computed_prop_name.expr.as_ref() {
                Expr::Lit(Lit::Str(s)) => s.value.as_atom(),
                Expr::Tpl(tpl) if tpl.quasis.len() == 1 && tpl.exprs.is_empty() => {
                    Some(&tpl.quasis[0].raw)
                }
                _ => None,
            },
            MemberProp::PrivateName(_) => None,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

#[derive(Eq, Hash, PartialEq, Clone)]
pub(crate) enum StaticProp {
    Name(Atom),
    Symbol(Atom),
}
