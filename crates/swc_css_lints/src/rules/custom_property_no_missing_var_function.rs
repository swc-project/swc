use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn custom_property_no_missing_var_function(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(
        ctx.reaction(),
        CustomPropertyNoMissingVarFunction {
            ctx,
            ..Default::default()
        },
    )
}

#[derive(Debug, Default)]
struct CustomPropertyNoMissingVarFunction {
    ctx: LintRuleContext<()>,

    in_declaration: Vec<bool>,
    in_declaration_value: Vec<bool>,
    in_var_function: Vec<bool>,
}

impl Visit for CustomPropertyNoMissingVarFunction {
    fn visit_declaration(&mut self, declaration: &Declaration) {
        self.in_declaration.push(true);
        declaration.visit_children_with(self);
        self.in_declaration.pop();
    }

    fn visit_component_value(&mut self, component_value: &ComponentValue) {
        self.in_declaration_value
            .push(self.in_declaration.last().copied().unwrap_or_default());
        component_value.visit_children_with(self);
        self.in_declaration_value.pop();
    }

    fn visit_function(&mut self, function: &Function) {
        self.in_var_function
            .push(function.name.value.eq_str_ignore_ascii_case("var"));
        function.visit_children_with(self);
        self.in_var_function.pop();
    }

    fn visit_dashed_ident(&mut self, dashed_ident: &DashedIdent) {
        if let (Some(true), Some(false) | None) = (
            self.in_declaration_value.last(),
            self.in_var_function.last(),
        ) {
            self.ctx.report(
                dashed_ident,
                format!(
                    "Unexpected missing var function for '--{}'.",
                    dashed_ident.value
                ),
            );
        }

        dashed_ident.visit_children_with(self);
    }
}
