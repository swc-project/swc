#[macro_use]
extern crate napi_derive;

mod util;

use std::{backtrace::Backtrace, borrow::Cow, env, panic::set_hook};

use anyhow::{bail, Context};
use lightningcss::{
    printer::PrinterOptions,
    stylesheet::{ParserFlags, StyleSheet},
    targets::Targets,
};
use napi::{bindgen_prelude::*, Task};
use serde::{Deserialize, Serialize};
use swc_atoms::js_word;
use swc_cached::regex::CachedRegex;
use swc_common::{sync::Lrc, FileName, FilePathMapping, SourceMap, DUMMY_SP};
use swc_html::{
    ast::{DocumentMode, Namespace},
    codegen::{
        writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
        CodeGenerator, CodegenConfig, Emit,
    },
    parser::{parse_file_as_document, parse_file_as_document_fragment},
};
use swc_html_ast::{Document, DocumentFragment};
use swc_html_minifier::{
    minify_document_fragment_with_custom_css_minifier, minify_document_with_custom_css_minifier,
    option::{
        CollapseWhitespaces, MinifierType, MinifyCssOption, MinifyJsOption, MinifyJsonOption,
        RemoveRedundantAttributes,
    },
    CssMinificationMode, MinifyCss,
};
use swc_nodejs_common::{deserialize_json, get_deserialized, MapErr};

use crate::util::try_with;

#[napi::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::force_capture();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }
}

#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct Diagnostic {
    pub level: String,
    pub message: String,
    pub span: serde_json::Value,
}

#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub errors: Option<Vec<Diagnostic>>,
}

struct MinifyTask {
    code: String,
    options: String,
    is_fragment: bool,
}

#[napi_derive::napi(object)]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Attribute {
    #[serde(default)]
    pub namespace: Option<String>,
    #[serde(default)]
    pub prefix: Option<String>,
    pub name: String,
    #[serde(default)]
    pub value: Option<String>,
}

#[napi_derive::napi(object)]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Element {
    pub tag_name: String,
    pub namespace: String,
    pub attributes: Vec<Attribute>,
    pub is_self_closing: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MinifyOptions {
    #[serde(default)]
    filename: Option<String>,

    // Parser options
    #[serde(default)]
    iframe_srcdoc: bool,
    #[serde(default)]
    scripting_enabled: bool,
    /// Used only for Document Fragment
    /// Default: NoQuirks
    #[serde(default)]
    mode: Option<DocumentMode>,
    /// Used only for Document Fragment
    /// Default: `template` in HTML namespace
    #[serde(default)]
    context_element: Option<Element>,
    /// Used only for Document Fragment
    /// Default: None
    #[serde(default)]
    form_element: Option<Element>,

    // Minification options
    #[serde(default)]
    force_set_html5_doctype: bool,
    #[serde(default = "default_collapse_whitespaces")]
    collapse_whitespaces: CollapseWhitespaces,
    // Remove safe empty elements with metadata content, i.e. the `script` and `style` element
    // without content and attributes, `meta` and `link` elements without attributes and etc
    #[serde(default = "true_by_default")]
    remove_empty_metadata_elements: bool,
    #[serde(default = "true_by_default")]
    remove_comments: bool,
    #[serde(default = "default_preserve_comments")]
    preserve_comments: Option<Vec<CachedRegex>>,
    #[serde(default = "true_by_default")]
    minify_conditional_comments: bool,
    #[serde(default = "true_by_default")]
    remove_empty_attributes: bool,
    #[serde(default)]
    remove_redundant_attributes: RemoveRedundantAttributes,
    #[serde(default = "true_by_default")]
    collapse_boolean_attributes: bool,
    #[serde(default = "true_by_default")]
    normalize_attributes: bool,
    #[serde(default = "minify_json_by_default")]
    minify_json: MinifyJsonOption,
    #[serde(default = "minify_js_by_default")]
    minify_js: MinifyJsOption,
    #[serde(default = "minify_css_by_default")]
    minify_css: MinifyCssOption<CssMinfierOptions>,
    #[serde(default)]
    minify_additional_scripts_content: Option<Vec<(CachedRegex, MinifierType)>>,
    #[serde(default)]
    minify_additional_attributes: Option<Vec<(CachedRegex, MinifierType)>>,
    #[serde(default = "true_by_default")]
    sort_space_separated_attribute_values: bool,
    #[serde(default)]
    sort_attributes: bool,
    #[serde(default = "true_by_default")]
    merge_metadata_elements: bool,

    // Codegen options
    #[serde(default)]
    tag_omission: Option<bool>,
    #[serde(default)]
    self_closing_void_elements: Option<bool>,
    #[serde(default)]
    quotes: Option<bool>,
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

const fn minify_css_by_default() -> MinifyCssOption<CssMinfierOptions> {
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

const fn default_collapse_whitespaces() -> CollapseWhitespaces {
    CollapseWhitespaces::OnlyMetadata
}

#[napi]
impl Task for MinifyTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let opts = deserialize_json(&self.options)
            .context("failed to deserialize minifier options")
            .convert_err()?;

        minify_inner(&self.code, opts, self.is_fragment).convert_err()
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

enum DocumentOrDocumentFragment {
    Document(Document),
    DocumentFragment(DocumentFragment),
}

fn create_namespace(namespace: &str) -> anyhow::Result<Namespace> {
    match &*namespace.to_lowercase() {
        "http://www.w3.org/1999/xhtml" => Ok(Namespace::HTML),
        "http://www.w3.org/1998/math/mathml" => Ok(Namespace::MATHML),
        "http://www.w3.org/2000/svg" => Ok(Namespace::SVG),
        "http://www.w3.org/1999/xlink" => Ok(Namespace::XLINK),
        "http://www.w3.org/xml/1998/namespace" => Ok(Namespace::XML),
        "http://www.w3.org/2000/xmlns/" => Ok(Namespace::XMLNS),
        _ => {
            bail!("failed to parse namespace of context element")
        }
    }
}

fn create_element(context_element: Element) -> anyhow::Result<swc_html_ast::Element> {
    let mut attributes = Vec::with_capacity(context_element.attributes.len());

    for attribute in context_element.attributes.into_iter() {
        let namespace = match attribute.namespace {
            Some(namespace) => Some(create_namespace(&namespace)?),
            _ => None,
        };

        attributes.push(swc_html_ast::Attribute {
            span: DUMMY_SP,
            namespace,
            prefix: attribute.prefix.map(|value| value.into()),
            name: attribute.name.into(),
            raw_name: None,
            value: attribute.value.map(|value| value.into()),
            raw_value: None,
        })
    }

    Ok(swc_html_ast::Element {
        span: DUMMY_SP,
        tag_name: context_element.tag_name.into(),
        namespace: create_namespace(&context_element.namespace)?,
        attributes,
        children: vec![],
        content: None,
        is_self_closing: context_element.is_self_closing,
    })
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "lib")]
pub enum CssMinfierOptions {
    #[serde(rename = "lightningcss")]
    LightningCss(LightningCssOptions),
    #[serde(rename = "swc")]
    Swc(swc_html_minifier::option::CssOptions),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LightningCssOptions {}

struct CssMinifier;

impl MinifyCss for CssMinifier {
    type Options = CssMinfierOptions;

    fn minify_css(
        &self,
        options: &MinifyCssOption<Self::Options>,
        data: String,
        mode: swc_html_minifier::CssMinificationMode,
    ) -> Option<String> {
        let opts = match options {
            MinifyCssOption::Bool(v) => {
                if *v {
                    Cow::Owned(CssMinfierOptions::LightningCss(LightningCssOptions {}))
                } else {
                    return None;
                }
            }
            MinifyCssOption::Options(opts) => Cow::Borrowed(opts),
        };

        match &*opts {
            CssMinfierOptions::LightningCss(_) => {
                let mut ss = StyleSheet::parse(
                    &data,
                    lightningcss::stylesheet::ParserOptions {
                        flags: lightningcss::stylesheet::ParserFlags::all(),
                        ..Default::default()
                    },
                )
                .ok()?;

                let targets = Targets::default();

                ss.minify(lightningcss::stylesheet::MinifyOptions {
                    targets,
                    ..Default::default()
                })
                .ok()?;

                let to_css_result = ss
                    .to_css(PrinterOptions {
                        minify: true,
                        targets,
                        ..Default::default()
                    })
                    .ok()?;

                Some(to_css_result.code)
            }

            CssMinfierOptions::Swc(options) => {
                let mut options = options.clone();
                let mut errors: Vec<_> = Vec::new();

                let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
                let fm = cm.new_source_file(FileName::Anon.into(), data);

                let mut stylesheet = match mode {
                    CssMinificationMode::Stylesheet => {
                        match swc_css_parser::parse_file(&fm, None, options.parser, &mut errors) {
                            Ok(stylesheet) => stylesheet,
                            _ => return None,
                        }
                    }
                    CssMinificationMode::ListOfDeclarations => {
                        match swc_css_parser::parse_file::<Vec<swc_css_ast::DeclarationOrAtRule>>(
                            &fm,
                            None,
                            options.parser,
                            &mut errors,
                        ) {
                            Ok(list_of_declarations) => {
                                let declaration_list: Vec<swc_css_ast::ComponentValue> =
                                    list_of_declarations
                                        .into_iter()
                                        .map(|node| node.into())
                                        .collect();

                                swc_css_ast::Stylesheet {
                                    span: Default::default(),
                                    rules: vec![swc_css_ast::Rule::QualifiedRule(
                                        swc_css_ast::QualifiedRule {
                                            span: Default::default(),
                                            prelude:
                                                swc_css_ast::QualifiedRulePrelude::SelectorList(
                                                    swc_css_ast::SelectorList {
                                                        span: Default::default(),
                                                        children: Vec::new(),
                                                    },
                                                ),
                                            block: swc_css_ast::SimpleBlock {
                                                span: Default::default(),
                                                name: swc_css_ast::TokenAndSpan {
                                                    span: DUMMY_SP,
                                                    token: swc_css_ast::Token::LBrace,
                                                },
                                                value: declaration_list,
                                            },
                                        }
                                        .into(),
                                    )],
                                }
                            }
                            _ => return None,
                        }
                    }
                    CssMinificationMode::MediaQueryList => {
                        match swc_css_parser::parse_file::<swc_css_ast::MediaQueryList>(
                            &fm,
                            None,
                            options.parser,
                            &mut errors,
                        ) {
                            Ok(media_query_list) => swc_css_ast::Stylesheet {
                                span: Default::default(),
                                rules: vec![swc_css_ast::Rule::AtRule(
                                    swc_css_ast::AtRule {
                                        span: Default::default(),
                                        name: swc_css_ast::AtRuleName::Ident(swc_css_ast::Ident {
                                            span: Default::default(),
                                            value: "media".into(),
                                            raw: None,
                                        }),
                                        prelude: Some(
                                            swc_css_ast::AtRulePrelude::MediaPrelude(
                                                media_query_list,
                                            )
                                            .into(),
                                        ),
                                        block: Some(swc_css_ast::SimpleBlock {
                                            span: Default::default(),
                                            name: swc_css_ast::TokenAndSpan {
                                                span: DUMMY_SP,
                                                token: swc_css_ast::Token::LBrace,
                                            },
                                            // TODO make the `compress_empty` option for CSS
                                            // minifier and
                                            // remove it
                                            value: vec![swc_css_ast::ComponentValue::Str(
                                                Box::new(swc_css_ast::Str {
                                                    span: Default::default(),
                                                    value: "placeholder".into(),
                                                    raw: None,
                                                }),
                                            )],
                                        }),
                                    }
                                    .into(),
                                )],
                            },
                            _ => return None,
                        }
                    }
                };

                // Avoid compress potential invalid CSS
                if !errors.is_empty() {
                    return None;
                }

                swc_css_minifier::minify(&mut stylesheet, options.minifier);

                let mut minified = String::new();
                let wr = swc_css_codegen::writer::basic::BasicCssWriter::new(
                    &mut minified,
                    None,
                    swc_css_codegen::writer::basic::BasicCssWriterConfig::default(),
                );

                options.codegen.minify = true;

                let mut gen = swc_css_codegen::CodeGenerator::new(wr, options.codegen);

                match mode {
                    CssMinificationMode::Stylesheet => {
                        swc_css_codegen::Emit::emit(&mut gen, &stylesheet).unwrap();
                    }
                    CssMinificationMode::ListOfDeclarations => {
                        let swc_css_ast::Stylesheet { rules, .. } = &stylesheet;

                        // Because CSS is grammar free, protect for fails
                        let Some(swc_css_ast::Rule::QualifiedRule(qualified_rule)) = rules.first()
                        else {
                            return None;
                        };

                        let swc_css_ast::QualifiedRule { block, .. } = &**qualified_rule;

                        swc_css_codegen::Emit::emit(&mut gen, &block).unwrap();

                        minified = minified[1..minified.len() - 1].to_string();
                    }
                    CssMinificationMode::MediaQueryList => {
                        let swc_css_ast::Stylesheet { rules, .. } = &stylesheet;

                        // Because CSS is grammar free, protect for fails
                        let Some(swc_css_ast::Rule::AtRule(at_rule)) = rules.first() else {
                            return None;
                        };

                        let swc_css_ast::AtRule { prelude, .. } = &**at_rule;

                        swc_css_codegen::Emit::emit(&mut gen, &prelude).unwrap();

                        minified = minified.trim().to_string();
                    }
                }

                Some(minified)
            }
        }
    }
}

fn minify_inner(
    code: &str,
    opts: MinifyOptions,
    is_fragment: bool,
) -> anyhow::Result<TransformOutput> {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        try_with(|cm, handler| {
            let filename = match opts.filename {
                Some(v) => FileName::Real(v.into()),
                None => FileName::Anon,
            };

            let fm = cm.new_source_file(filename.into(), code.into());

            let scripting_enabled = opts.scripting_enabled;
            let mut errors = vec![];

            let (mut document_or_document_fragment, context_element) = if is_fragment {
                let context_element = match opts.context_element {
                    Some(context_element) => create_element(context_element)?,
                    _ => swc_html_ast::Element {
                        span: DUMMY_SP,
                        tag_name: js_word!("template"),
                        namespace: Namespace::HTML,
                        attributes: vec![],
                        children: vec![],
                        content: None,
                        is_self_closing: false,
                    },
                };
                let mode = match opts.mode {
                    Some(mode) => mode,
                    _ => DocumentMode::NoQuirks,
                };
                let form_element = match opts.form_element {
                    Some(form_element) => Some(create_element(form_element)?),
                    _ => None,
                };
                let document_fragment = parse_file_as_document_fragment(
                    &fm,
                    &context_element,
                    mode,
                    form_element.as_ref(),
                    swc_html::parser::parser::ParserConfig {
                        scripting_enabled,
                        iframe_srcdoc: opts.iframe_srcdoc,
                        ..Default::default()
                    },
                    &mut errors,
                );

                let document_fragment = match document_fragment {
                    Ok(v) => v,
                    Err(err) => {
                        err.to_diagnostics(handler).emit();

                        for err in errors {
                            err.to_diagnostics(handler).emit();
                        }

                        bail!("failed to parse input as document fragment")
                    }
                };

                (
                    DocumentOrDocumentFragment::DocumentFragment(document_fragment),
                    Some(context_element),
                )
            } else {
                let document = parse_file_as_document(
                    &fm,
                    swc_html::parser::parser::ParserConfig {
                        scripting_enabled,
                        iframe_srcdoc: opts.iframe_srcdoc,
                        ..Default::default()
                    },
                    &mut errors,
                );

                let document = match document {
                    Ok(v) => v,
                    Err(err) => {
                        err.to_diagnostics(handler).emit();

                        for err in errors {
                            err.to_diagnostics(handler).emit();
                        }

                        bail!("failed to parse input as document")
                    }
                };

                (DocumentOrDocumentFragment::Document(document), None)
            };

            let mut returned_errors = None;

            if !errors.is_empty() {
                returned_errors = Some(Vec::with_capacity(errors.len()));

                for err in errors {
                    let mut buf = vec![];

                    err.to_diagnostics(handler).buffer(&mut buf);

                    for i in buf {
                        returned_errors.as_mut().unwrap().push(Diagnostic {
                            level: i.level.to_string(),
                            message: i.message(),
                            span: serde_json::to_value(&i.span)?,
                        });
                    }
                }
            }

            let options = swc_html_minifier::option::MinifyOptions {
                force_set_html5_doctype: opts.force_set_html5_doctype,
                collapse_whitespaces: opts.collapse_whitespaces,
                remove_empty_metadata_elements: opts.remove_empty_metadata_elements,
                remove_comments: opts.remove_comments,
                preserve_comments: opts.preserve_comments,
                minify_conditional_comments: opts.minify_conditional_comments,
                remove_empty_attributes: opts.remove_empty_attributes,
                remove_redundant_attributes: opts.remove_redundant_attributes,
                collapse_boolean_attributes: opts.collapse_boolean_attributes,
                normalize_attributes: opts.normalize_attributes,
                minify_json: opts.minify_json,
                minify_js: opts.minify_js,
                minify_css: opts.minify_css,
                minify_additional_scripts_content: opts.minify_additional_scripts_content,
                minify_additional_attributes: opts.minify_additional_attributes,
                sort_space_separated_attribute_values: opts.sort_space_separated_attribute_values,
                sort_attributes: opts.sort_attributes,
                merge_metadata_elements: opts.merge_metadata_elements,
            };

            match document_or_document_fragment {
                DocumentOrDocumentFragment::Document(ref mut document) => {
                    minify_document_with_custom_css_minifier(document, &options, &CssMinifier);
                }
                DocumentOrDocumentFragment::DocumentFragment(ref mut document_fragment) => {
                    minify_document_fragment_with_custom_css_minifier(
                        document_fragment,
                        context_element.as_ref().unwrap(),
                        &options,
                        &CssMinifier,
                    );
                }
            }

            let code = {
                let mut buf = String::new();

                {
                    let mut wr = BasicHtmlWriter::new(
                        &mut buf,
                        None,
                        BasicHtmlWriterConfig {
                            ..Default::default()
                        },
                    );
                    let mut gen = CodeGenerator::new(
                        &mut wr,
                        CodegenConfig {
                            minify: true,
                            scripting_enabled,
                            context_element: context_element.as_ref(),
                            tag_omission: opts.tag_omission,
                            self_closing_void_elements: opts.self_closing_void_elements,
                            quotes: opts.quotes,
                        },
                    );

                    match document_or_document_fragment {
                        DocumentOrDocumentFragment::Document(document) => {
                            gen.emit(&document).context("failed to emit")?;
                        }
                        DocumentOrDocumentFragment::DocumentFragment(document_fragment) => {
                            gen.emit(&document_fragment).context("failed to emit")?;
                        }
                    }
                }

                buf
            };

            Ok(TransformOutput {
                code,
                errors: returned_errors,
            })
        })
    })
}

fn to_string(code: Either<Buffer, String>) -> String {
    match code {
        Either::A(code) => String::from_utf8_lossy(code.as_ref()).to_string(),
        Either::B(code) => code,
    }
}

#[allow(unused)]
#[napi]
fn minify(
    code: Either<Buffer, String>,
    opts: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<MinifyTask> {
    let code = to_string(code);
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();

    let task = MinifyTask {
        code,
        options,
        is_fragment: false,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[allow(unused)]
#[napi]
fn minify_fragment(
    code: Either<Buffer, String>,
    opts: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<MinifyTask> {
    let code = to_string(code);
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();

    let task = MinifyTask {
        code,
        options,
        is_fragment: true,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[allow(unused)]
#[napi]
pub fn minify_sync(code: Either<Buffer, String>, opts: Buffer) -> napi::Result<TransformOutput> {
    let code = to_string(code);
    let options = get_deserialized(opts)?;

    minify_inner(&code, options, false).convert_err()
}

#[allow(unused)]
#[napi]
pub fn minify_fragment_sync(
    code: Either<Buffer, String>,
    opts: Buffer,
) -> napi::Result<TransformOutput> {
    let code = to_string(code);
    let options = get_deserialized(opts)?;

    minify_inner(&code, options, true).convert_err()
}
