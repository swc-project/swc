use crate::{
    config::LintConfig,
    error::ConfigError,
    rule::LintRule,
    rules::{
        at_rule_no_unknown::at_rule_no_unknown, block_no_empty::block_no_empty,
        color_hex_alpha::color_hex_alpha, color_hex_length::color_hex_length,
        color_no_invalid_hex::color_no_invalid_hex,
        custom_property_no_missing_var_function::custom_property_no_missing_var_function,
        declaration_no_important::declaration_no_important,
        font_family_no_duplicate_names::font_family_no_duplicate_names,
        keyframe_declaration_no_important::keyframe_declaration_no_important,
        no_duplicate_at_import_rules::no_duplicate_at_import_rules,
        no_empty_source::no_empty_source,
        no_invalid_position_at_import_rule::no_invalid_position_at_import_rule,
        selector_max_class::selector_max_class, selector_max_combinators::selector_max_combinators,
        unit_no_unknown::unit_no_unknown,
    },
};

pub mod at_rule_no_unknown;
pub mod block_no_empty;
pub mod color_hex_alpha;
pub mod color_hex_length;
pub mod color_no_invalid_hex;
pub mod custom_property_no_missing_var_function;
pub mod declaration_no_important;
pub mod font_family_no_duplicate_names;
pub mod keyframe_declaration_no_important;
pub mod no_duplicate_at_import_rules;
pub mod no_empty_source;
pub mod no_invalid_position_at_import_rule;
pub mod selector_max_class;
pub mod selector_max_combinators;
pub mod unit_no_unknown;

pub struct LintParams<'a> {
    pub lint_config: &'a LintConfig,
}

pub fn get_rules(
    LintParams { lint_config }: &LintParams,
) -> Result<Vec<Box<dyn LintRule>>, ConfigError> {
    let rules_config = &lint_config.rules;

    let rules = vec![
        block_no_empty((&rules_config.block_no_empty).into()),
        at_rule_no_unknown((&rules_config.at_rule_no_unknown).into())?,
        no_empty_source((&rules_config.no_empty_source).into()),
        declaration_no_important((&rules_config.declaration_no_important).into()),
        keyframe_declaration_no_important((&rules_config.keyframe_declaration_no_important).into()),
        no_invalid_position_at_import_rule(
            (&rules_config.no_invalid_position_at_import_rule).into(),
        )?,
        selector_max_class((&rules_config.selector_max_class).into()),
        color_hex_length((&rules_config.color_hex_length).into()),
        color_no_invalid_hex((&rules_config.color_no_invalid_hex).into()),
        unit_no_unknown((&rules_config.unit_no_unknown).into())?,
        selector_max_combinators((&rules_config.selector_max_combinators).into()),
        font_family_no_duplicate_names((&rules_config.font_family_no_duplicate_names).into())?,
        color_hex_alpha((&rules_config.color_hex_alpha).into()),
        no_duplicate_at_import_rules((&rules_config.no_duplicate_at_import_rules).into()),
        custom_property_no_missing_var_function(
            (&rules_config.custom_property_no_missing_var_function).into(),
        ),
    ];

    Ok(rules)
}
