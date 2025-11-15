use serde::Deserialize;

use crate::{
    DecoratorOptions, TypeScriptOptions, es2015::ArrowFunctionsOptions,
    es2018::ObjectRestSpreadOptions, es2022::ClassPropertiesOptions, jsx::JsxOptions,
    plugins::StyledComponentsOptions,
};

use super::PluginPresetEntries;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
pub struct SyntaxTypeScriptOptions {
    #[serde(default)]
    pub dts: bool,
}

#[derive(Debug, Default, Clone, Deserialize)]
pub struct SyntaxDecoratorOptions {
    #[serde(default)]
    pub version: String,
}

#[derive(Debug, Default, Clone, Deserialize)]
#[serde(try_from = "PluginPresetEntries")]
pub struct BabelPlugins {
    pub errors: Vec<String>,
    pub unsupported: Vec<String>,
    // syntax
    pub syntax_typescript: Option<SyntaxTypeScriptOptions>,
    pub syntax_jsx: bool,
    // decorators
    pub syntax_decorators: Option<SyntaxDecoratorOptions>,
    pub proposal_decorators: Option<SyntaxDecoratorOptions>,
    // ts
    pub typescript: Option<TypeScriptOptions>,
    // jsx
    pub react_jsx: Option<JsxOptions>,
    pub react_jsx_dev: Option<JsxOptions>,
    pub react_jsx_self: bool,
    pub react_jsx_source: bool,
    pub react_display_name: bool,
    // modules
    pub modules_commonjs: bool,
    // regexp
    pub sticky_flag: bool,
    pub unicode_flag: bool,
    pub dot_all_flag: bool,
    pub look_behind_assertions: bool,
    pub named_capture_groups: bool,
    pub unicode_property_escapes: bool,
    pub match_indices: bool,
    /// Enables plugin to transform the RegExp literal has `v` flag
    pub set_notation: bool,
    // ES2015
    pub arrow_function: Option<ArrowFunctionsOptions>,
    // ES2016
    pub exponentiation_operator: bool,
    // ES2017
    pub async_to_generator: bool,
    // ES2018
    pub object_rest_spread: Option<ObjectRestSpreadOptions>,
    pub async_generator_functions: bool,
    // ES2019
    pub optional_catch_binding: bool,
    // ES2020
    pub export_namespace_from: bool,
    pub optional_chaining: bool,
    pub nullish_coalescing_operator: bool,
    // ES2021
    pub logical_assignment_operators: bool,
    // ES2022
    pub class_static_block: bool,
    pub class_properties: Option<ClassPropertiesOptions>,
    // ES2026
    pub explicit_resource_management: bool,
    // Decorator
    pub legacy_decorator: Option<DecoratorOptions>,
    // Built-in plugins
    pub styled_components: Option<StyledComponentsOptions>,
}

impl TryFrom<PluginPresetEntries> for BabelPlugins {
    type Error = String;

    fn try_from(entries: PluginPresetEntries) -> Result<Self, Self::Error> {
        let mut p = Self::default();
        for entry in entries.0 {
            match entry.name() {
                "typescript" | "syntax-typescript" => {
                    p.syntax_typescript = Some(entry.value::<SyntaxTypeScriptOptions>()?);
                }
                "jsx" | "syntax-jsx" => p.syntax_jsx = true,
                "syntax-decorators" => {
                    p.syntax_decorators = Some(entry.value::<SyntaxDecoratorOptions>()?);
                }
                "proposal-decorators" => {
                    p.proposal_decorators = Some(entry.value::<SyntaxDecoratorOptions>()?);
                }
                "transform-typescript" => {
                    p.typescript =
                        entry.value::<TypeScriptOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                "transform-react-jsx" => {
                    #[derive(Deserialize, Default)]
                    struct Pure {
                        pure: bool,
                    }

                    let pure = entry.clone().value::<Pure>().map(|p| p.pure).unwrap_or(false);
                    p.react_jsx = entry
                        .value::<JsxOptions>()
                        .map_err(|err| p.errors.push(err))
                        .map(|mut options| {
                            // `pure` only defaults to `true` in `preset-react`
                            options.pure = pure;
                            options
                        })
                        .ok();
                }
                "transform-react-jsx-development" => {
                    p.react_jsx_dev =
                        entry.value::<JsxOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                "transform-react-display-name" => p.react_display_name = true,
                "transform-react-jsx-self" => p.react_jsx_self = true,
                "transform-react-jsx-source" => p.react_jsx_source = true,
                "transform-modules-commonjs" => p.modules_commonjs = true,
                "transform-sticky-regex" => p.sticky_flag = true,
                "transform-unicode-regex" => p.unicode_flag = true,
                "transform-dotall-regex" => p.dot_all_flag = true,
                "esbuild-regexp-lookbehind-assertions" => p.look_behind_assertions = true,
                "transform-named-capturing-groups-regex" => p.named_capture_groups = true,
                "transform-unicode-property-regex" => p.unicode_property_escapes = true,
                "esbuild-regexp-match-indices" => p.match_indices = true,
                "transform-unicode-sets-regex" => p.set_notation = true,
                "transform-arrow-functions" => {
                    p.arrow_function = entry
                        .value::<ArrowFunctionsOptions>()
                        .map_err(|err| p.errors.push(err))
                        .ok();
                }
                "transform-exponentiation-operator" => p.exponentiation_operator = true,
                "transform-async-to-generator" => p.async_to_generator = true,
                "transform-object-rest-spread" => {
                    p.object_rest_spread = entry
                        .value::<ObjectRestSpreadOptions>()
                        .map_err(|err| p.errors.push(err))
                        .ok();
                }
                "transform-async-generator-functions" => p.async_generator_functions = true,
                "transform-optional-catch-binding" => p.optional_catch_binding = true,
                "transform-export-namespace-from" => p.export_namespace_from = true,
                "transform-optional-chaining" => p.optional_chaining = true,
                "transform-nullish-coalescing-operator" => p.nullish_coalescing_operator = true,
                "transform-logical-assignment-operators" => p.logical_assignment_operators = true,
                "transform-class-static-block" => p.class_static_block = true,
                "transform-class-properties" => {
                    p.class_properties = entry
                        .value::<ClassPropertiesOptions>()
                        .map_err(|err| p.errors.push(err))
                        .ok();
                }
                // This is not a Babel plugin, we pretend it exists for running legacy decorator by Babel options
                "transform-legacy-decorator" => {
                    p.legacy_decorator =
                        entry.value::<DecoratorOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                "transform-explicit-resource-management" => p.explicit_resource_management = true,
                "styled-components" => {
                    p.styled_components = entry
                        .value::<StyledComponentsOptions>()
                        .map_err(|err| p.errors.push(err))
                        .ok();
                }
                s => p.unsupported.push(s.to_string()),
            }
        }
        Ok(p)
    }
}
