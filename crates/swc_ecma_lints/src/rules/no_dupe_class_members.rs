use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, errors::HANDLER, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Hash, PartialEq, Eq)]
enum MemberType {
    ES6Private,
    StaticES6Private,
    Getter,
    Setter,
    StaticOther,
    Other,
}

type Member = (MemberType, JsWord);

pub fn no_dupe_class_members(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoDupeClassMembers::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoDupeClassMembers {
    expected_reaction: LintRuleReaction,
    class_methods: AHashSet<Member>,
}

impl NoDupeClassMembers {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            class_methods: Default::default(),
        }
    }

    fn emit_report(&self, span: Span, member_name: &str) {
        let message = format!("Duplicate name '{}'", member_name);

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
        });
    }

    fn get_method_type(kind: &MethodKind, is_static: bool) -> MemberType {
        match kind {
            MethodKind::Getter => MemberType::Getter,
            MethodKind::Setter => MemberType::Setter,
            _ => {
                if is_static {
                    MemberType::StaticOther
                } else {
                    MemberType::Other
                }
            }
        }
    }

    fn extract_prop_name(prop_name: &PropName) -> Option<JsWord> {
        match prop_name {
            PropName::Ident(ident) => Some(ident.sym.clone()),
            PropName::Str(lit_str) => Some(lit_str.value.clone()),
            PropName::Num(num) => Some(JsWord::new(num.value.to_string())),
            PropName::Computed(computed_prop_name) => match computed_prop_name.expr.as_ref() {
                Expr::Lit(Lit::Str(lit_str)) => Some(lit_str.value.clone()),
                Expr::Lit(Lit::Num(num)) => Some(JsWord::new(num.value.to_string())),
                Expr::Lit(Lit::Null(_)) => Some(JsWord::new("null")),
                Expr::Tpl(tpl) => {
                    if tpl.exprs.is_empty() && tpl.quasis.len() == 1 {
                        Some(tpl.quasis[0].raw.clone())
                    } else {
                        None
                    }
                }
                _ => None,
            },
            _ => None,
        }
    }

    fn extract_name(class_member: &ClassMember) -> Option<Member> {
        match class_member {
            ClassMember::Method(method) => {
                if method.function.body.is_some() {
                    Self::extract_prop_name(&method.key)
                        .map(|name| (Self::get_method_type(&method.kind, method.is_static), name))
                } else {
                    None
                }
            }
            ClassMember::ClassProp(class_prop) => {
                Self::extract_prop_name(&class_prop.key).map(|name| {
                    let member_type = if class_prop.is_static {
                        MemberType::StaticOther
                    } else {
                        MemberType::Other
                    };

                    (member_type, name)
                })
            }
            ClassMember::PrivateMethod(private_method) => {
                let member_type = if private_method.is_static {
                    MemberType::StaticES6Private
                } else {
                    MemberType::ES6Private
                };

                Some((member_type, private_method.key.id.sym.clone()))
            }
            ClassMember::PrivateProp(private_prop) => {
                let member_type = if private_prop.is_static {
                    MemberType::StaticES6Private
                } else {
                    MemberType::ES6Private
                };

                Some((member_type, private_prop.key.id.sym.clone()))
            }
            _ => None,
        }
    }

    fn check(&self, span: Span, member: &Member) {
        let duplicates = match &member.0 {
            MemberType::Other => {
                self.class_methods.contains(member)
                    || self
                        .class_methods
                        .contains(&(MemberType::Getter, member.1.clone()))
                    || self
                        .class_methods
                        .contains(&(MemberType::Setter, member.1.clone()))
            }
            MemberType::Getter | MemberType::Setter => {
                self.class_methods.contains(member)
                    || self
                        .class_methods
                        .contains(&(MemberType::Other, member.1.clone()))
            }
            _ => self.class_methods.contains(member),
        };

        if duplicates {
            self.emit_report(span, member.1.as_str());
        }
    }
}

impl Visit for NoDupeClassMembers {
    noop_visit_type!();

    fn visit_class(&mut self, class: &Class) {
        let prev_class_methods = std::mem::take(&mut self.class_methods);

        class.visit_children_with(self);

        self.class_methods = prev_class_methods;
    }

    fn visit_class_member(&mut self, class_member: &ClassMember) {
        if let Some(member) = Self::extract_name(class_member) {
            self.check(class_member.span(), &member);

            self.class_methods.insert(member);
        }

        class_member.visit_children_with(self);
    }
}
