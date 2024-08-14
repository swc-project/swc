use serde::{de::DeserializeOwned, Deserialize, Serialize};
use swc_cached::regex::CachedRegex;
#[cfg(feature = "default-css-minifier")]
use swc_css_codegen::CodegenConfig as CssCodegenOptions;
#[cfg(feature = "default-css-minifier")]
use swc_css_minifier::options::MinifyOptions as CssMinifyOptions;
#[cfg(feature = "default-css-minifier")]
use swc_css_parser::parser::ParserConfig as CssParserOptions;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::Config as JsCodegenOptions;
use swc_ecma_minifier::option::MinifyOptions as JsMinifyOptions;
use swc_ecma_parser::Syntax;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
#[serde(deny_unknown_fields)]
pub enum MinifierType {
    JsModule,
    JsScript,
    Json,
    Css,
    Html,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(deny_unknown_fields)]
#[serde(rename_all = "kebab-case")]
pub enum CollapseWhitespaces {
    /// Keep whitespaces
    None,
    /// Remove all whitespaces
    All,
    /// Remove and collapse whitespaces based on the `display` CSS property
    Smart,
    /// Collapse multiple whitespace into one whitespace, remove
    /// all whitespace in the `head` element and trim whitespaces for the `body`
    /// element
    Conservative,
    /// Collapse multiple whitespace into one whitespace, remove
    /// all whitespace in the `head` element, trim whitespaces for the `body`
    /// element and remove spaces between `metadata` elements (i.e.
    /// `script`/`style`/etc, for elements that have `display: none`)
    AdvancedConservative,
    /// Remove all whitespace in the `head` element, trim whitespaces for the
    /// `body` element, remove spaces between `metadata` elements (i.e.
    /// `script`/`style`/etc, for elements that have `display: none`)
    #[default]
    OnlyMetadata,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(deny_unknown_fields)]
#[serde(rename_all = "kebab-case")]
pub enum RemoveRedundantAttributes {
    /// Do not remove redundant attributes
    None,
    /// Remove all redundant attributes
    All,
    /// Remove deprecated and svg redundant (they used for styling) and `xmlns`
    /// attributes (for example the `type` attribute for the `style` tag and
    /// `xmlns` for svg)
    #[default]
    Smart,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum MinifyJsonOption {
    Bool(bool),
    Options(Box<JsonOptions>),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct JsonOptions {
    pub pretty: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum MinifyJsOption {
    Bool(bool),
    Options(Box<JsOptions>),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct JsOptions {
    #[serde(default)]
    pub parser: JsParserOptions,
    #[serde(default)]
    pub minifier: JsMinifyOptions,
    #[serde(default)]
    pub codegen: JsCodegenOptions,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct JsParserOptions {
    #[serde(default)]
    pub comments: bool,
    #[serde(flatten)]
    pub syntax: Syntax,
    #[serde(default)]
    pub target: EsVersion,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum MinifyCssOption<CO> {
    Bool(bool),
    Options(CO),
}

#[cfg(feature = "default-css-minifier")]
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct CssOptions {
    #[serde(default)]
    pub parser: CssParserOptions,
    #[serde(default)]
    pub minifier: CssMinifyOptions,
    #[serde(default)]
    pub codegen: CssCodegenOptions,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions<CO> {
    #[serde(default)]
    pub force_set_html5_doctype: bool,
    #[serde(default)]
    pub collapse_whitespaces: CollapseWhitespaces,
    // Remove safe empty elements with metadata content, i.e. the `script` and `style` element
    // without content and attributes, `meta` and `link` elements without attributes and etc
    #[serde(default = "true_by_default")]
    pub remove_empty_metadata_elements: bool,
    #[serde(default = "true_by_default")]
    pub remove_comments: bool,
    #[serde(default = "default_preserve_comments")]
    pub preserve_comments: Option<Vec<CachedRegex>>,
    #[serde(default = "true_by_default")]
    pub minify_conditional_comments: bool,
    /// Prevent to remove empty attributes, by default we only remove attributes
    /// that are safe to remove (for example - empty a `style` attribute),
    /// but in edge cases it can be unsafe because some libraries can
    /// interact with DOM like with strings (i.e. don't use DOM API) and in this
    /// case strings will be different, which can break the work of
    /// libraries
    #[serde(default = "true_by_default")]
    pub remove_empty_attributes: bool,
    #[serde(default)]
    pub remove_redundant_attributes: RemoveRedundantAttributes,
    #[serde(default = "true_by_default")]
    pub collapse_boolean_attributes: bool,
    /// Merge the same metadata elements into one (for example, consecutive
    /// `style` elements will be merged into one `style` element)
    #[serde(default = "true_by_default")]
    pub merge_metadata_elements: bool,
    /// Remove extra whitespace in space and comma separated attribute values
    /// (where it is safe) and remove `javascript:` prefix for event handler
    /// attributes
    #[serde(default = "true_by_default")]
    pub normalize_attributes: bool,
    #[serde(default = "minify_json_by_default")]
    pub minify_json: MinifyJsonOption,
    #[serde(default = "minify_js_by_default")]
    pub minify_js: MinifyJsOption,
    #[serde(default = "minify_css_by_default")]
    pub minify_css: MinifyCssOption<CO>,
    // Allow to compress value of custom script elements,
    // i.e. `<script type="text/html"><div><!-- text --> <div data-foo="bar> Text </div></script>`
    //
    // The first item is tag_name
    // The second is attribute name
    // The third is type of minifier
    #[serde(default)]
    pub minify_additional_scripts_content: Option<Vec<(CachedRegex, MinifierType)>>,
    /// Allow to compress value of custom attributes,
    /// i.e. `<div data-js="myFunction(100 * 2, 'foo' + 'bar')"></div>`
    ///
    /// The first item is tag_name
    /// The second is attribute name
    /// The third is type of minifier
    pub minify_additional_attributes: Option<Vec<(CachedRegex, MinifierType)>>,
    /// Sorting the values of `class`, `rel`, etc. of attributes
    #[serde(default = "true_by_default")]
    pub sort_space_separated_attribute_values: bool,
    #[serde(default)]
    pub sort_attributes: bool,
}

/// Implement default using serde.
impl<CO: DeserializeOwned> Default for MinifyOptions<CO> {
    fn default() -> Self {
        serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
    }
}

const fn true_by_default() -> bool {
    true
}

const fn minify_json_by_default() -> MinifyJsonOption {
    MinifyJsonOption::Bool(true)
}

const fn minify_js_by_default() -> MinifyJsOption {
    MinifyJsOption::Bool(true)
}

const fn minify_css_by_default<CO>() -> MinifyCssOption<CO> {
    MinifyCssOption::Bool(true)
}

fn default_preserve_comments() -> Option<Vec<CachedRegex>> {
    Some(vec![
        // License comments
        CachedRegex::new("@preserve").unwrap(),
        CachedRegex::new("@copyright").unwrap(),
        CachedRegex::new("@lic").unwrap(),
        CachedRegex::new("@cc_on").unwrap(),
        // Allow to keep custom comments
        CachedRegex::new("^!").unwrap(),
        // Server-side comments
        CachedRegex::new("^\\s*#").unwrap(),
        // Conditional IE comments
        CachedRegex::new("^\\[if\\s[^\\]+]").unwrap(),
        CachedRegex::new("\\[endif]").unwrap(),
    ])
}
