//! Styled Components
//!
//! This plugin adds support for server-side rendering, minification of styles,
//! and a nicer debugging experience when using styled-components.
//!
//! > This plugin is port from the official Babel plugin for styled-components.
//!
//! ## Implementation Status
//!
//! > Note: Currently, this plugin only supports styled-components imported via
//! > import statements.
//! > The transformation will not be applied if you import it using
//! > `require("styled-components")`,
//! > in other words, it only supports `ESM` not `CJS`.
//!
//! ### Options:
//! **✅ Fully Supported:**
//! - `displayName`: Adds display names for debugging
//! - `fileName`: Controls filename prefixing in display names
//! - `ssr`: Adds unique component IDs for server-side rendering
//! - `transpileTemplateLiterals`: Converts template literals to function calls
//! - `minify`: Minifies CSS content in template literals
//! - `namespace`: Adds namespace prefixes to component IDs
//! - `meaninglessFileNames`: Controls which filenames are considered
//!   meaningless
//!
//! **⚠️ Partially Supported:**
//! - `pure`: Only supports call expressions, not tagged template expressions
//!   (bundler limitation)
//!
//! **❌ Not Yet Implemented:**
//! - `cssProp`: JSX css prop transformation
//! - `topLevelImportPaths`: Custom import path handling
//!
//! ## Example
//!
//! Input:
//! ```js
//! import styled from 'styled-components';
//!
//! const Button = styled.div`
//!   color: blue;
//!   padding: 10px;
//! `;
//! ```
//!
//! Output (with default options):
//! ```js
//! import styled from 'styled-components';
//!
//! const Button = styled.div.withConfig({
//!   displayName: "Button",
//!   componentId: "sc-1234567-0"
//! })(["color:blue;padding:10px;"]);
//! ```
//!
//! ## References
//!
//! - Babel plugin: <https://github.com/styled-components/babel-plugin-styled-components>
//! - Documentation: <https://styled-components.com/docs/tooling#babel-plugin>

use std::hash::{Hash, Hasher};

use rustc_hash::FxHasher;
use serde::Deserialize;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

#[derive(Debug, Clone, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct StyledComponentsOptions {
    /// Enhances the attached CSS class name on each component with richer
    /// output to help identify your components in the DOM without React
    /// DevTools. It also allows you to see the component's `displayName` in
    /// React DevTools.
    ///
    /// When enabled, components show up as `<button class="Button-asdf123
    /// asdf123" />` instead of just `<button class="asdf123" />`, and
    /// display meaningful names like `MyButton` instead of `styled.button`
    /// in React DevTools.
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub display_name: bool,

    /// Controls whether the `displayName` of a component will be prefixed with
    /// the filename to make the component name as unique as possible.
    ///
    /// When `true`, the filename is used to prefix component names. When
    /// `false`, only the component name is used for the `displayName`. This
    /// can be useful for testing with enzyme where you want to search
    /// components by displayName.
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub file_name: bool,

    /// Adds a unique identifier to every styled component to avoid checksum
    /// mismatches due to different class generation on the client and
    /// server during server-side rendering.
    ///
    /// Without this option, React will complain with an HTML attribute mismatch
    /// warning during rehydration when using server-side rendering.
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub ssr: bool,

    /// Transpiles styled-components tagged template literals to a smaller
    /// representation than what Babel normally creates, helping to reduce
    /// bundle size.
    ///
    /// Converts `` styled.div`width: 100%;` `` to `styled.div(['width:
    /// 100%;'])`, which is more compact than the standard Babel template
    /// literal transformation.
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub transpile_template_literals: bool,

    /// Minifies CSS content by removing all whitespace and comments from your
    /// CSS, keeping valuable bytes out of your bundles.
    ///
    /// This optimization helps reduce the final bundle size by eliminating
    /// unnecessary whitespace and comments in CSS template literals.
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub minify: bool,

    /// Enables transformation of JSX `css` prop when using styled-components.
    ///
    /// When enabled, JSX elements with a `css` prop are transformed to work
    /// with styled-components' css prop functionality.
    ///
    /// **Note: This feature is not yet implemented.**
    ///
    /// Default: `true`
    #[serde(default = "default_as_true")]
    pub css_prop: bool,

    /// Enables "pure annotation" to aid dead code elimination by bundlers.
    ///
    /// Adds `/*#__PURE__*/` comments to styled component calls, helping
    /// minifiers perform better tree-shaking by indicating that these calls
    /// have no side effects. This is particularly useful because styled
    /// components are normally assumed to have side effects and can't be
    /// properly eliminated by minifiers.
    ///
    /// **Note: Currently only supports call expressions. Tagged template
    /// expressions are not yet supported due to bundler limitations. See:**
    /// <https://github.com/rollup/rollup/issues/4035>
    ///
    /// Default: `false`
    #[serde(default)]
    pub pure: bool,

    /// Adds a namespace prefix to component identifiers to ensure class names
    /// are unique.
    ///
    /// This is particularly useful when working with micro-frontends where
    /// class name collisions can occur. The namespace will be prepended to
    /// generated component IDs.
    ///
    /// Example: With `namespace: "my-app"`, generates `componentId:
    /// "my-app__sc-3rfj0a-1"`
    ///
    /// Default: `None`
    #[serde(default)]
    pub namespace: Option<String>,

    /// List of file names that are considered meaningless for component naming
    /// purposes.
    ///
    /// When the `fileName` option is enabled and a component is in a file with
    /// a name from this list, the directory name will be used instead of
    /// the file name for the component's display name. This is useful for
    /// patterns like `Button/index.jsx` where "index" is not descriptive.
    ///
    /// Example: With "index" in the list, `Button/index.jsx` will generate a
    /// display name of "Button" instead of "index".
    ///
    /// Default: `["index"]`
    #[serde(default = "default_for_meaningless_file_names")]
    pub meaningless_file_names: Vec<String>,

    /// Import paths to be considered as styled-components imports at the top
    /// level.
    ///
    /// This option allows specifying additional import paths that should be
    /// treated as styled-components imports, enabling the plugin to work
    /// with custom builds or aliased imports of styled-components.
    ///
    /// **Note: This feature is not yet implemented.**
    ///
    /// Default: `[]`
    #[serde(default)]
    pub top_level_import_paths: Vec<String>,
}

const fn default_as_true() -> bool {
    true
}

fn default_for_meaningless_file_names() -> Vec<String> {
    vec![String::from("index")]
}

impl Default for StyledComponentsOptions {
    /// Creates the default configuration for styled-components transformation.
    ///
    /// Most options are enabled by default to match the behavior of the
    /// official Babel plugin. Note that some options like `cssProp` and
    /// `topLevelImportPaths` are set but not yet implemented.
    ///
    /// The `pure` option is disabled by default to avoid potential issues with
    /// tree-shaking in some bundlers.
    fn default() -> Self {
        Self {
            display_name: true,
            file_name: true,
            ssr: true,
            transpile_template_literals: true,
            pure: false,
            minify: true,
            namespace: None,
            css_prop: true,
            meaningless_file_names: default_for_meaningless_file_names(),
            top_level_import_paths: vec![],
        }
    }
}

/// Helper functions.
///
/// Used as index into `StyledComponentsBinding::helpers` array.
#[derive(Copy, Clone)]
#[repr(u8)]
enum StyledComponentsHelper {
    CreateGlobalStyle = 0,
    Css = 1,
    Keyframes = 2,
    UseTheme = 3,
    WithTheme = 4,
    InjectGlobal = 5,
}

impl StyledComponentsHelper {
    /// Convert string to [`StyledComponentsHelper`].
    fn from_str(name: &str) -> Option<Self> {
        if name == "injectGlobal" {
            Some(Self::InjectGlobal)
        } else {
            Self::pure_from_str(name)
        }
    }

    /// Convert string to [`StyledComponentsHelper`], excluding `injectGlobal`.
    fn pure_from_str(name: &str) -> Option<Self> {
        match name {
            "createGlobalStyle" => Some(Self::CreateGlobalStyle),
            "css" => Some(Self::Css),
            "keyframes" => Some(Self::Keyframes),
            "useTheme" => Some(Self::UseTheme),
            "withTheme" => Some(Self::WithTheme),
            _ => None,
        }
    }
}

/// Tracks binding IDs for styled-components imports to identify which variables
/// are bound to styled-components functionality.
///
/// Note: In SWC, we use string-based tracking instead of SymbolId since the
/// visitor pattern is simpler. This is a placeholder structure for the
/// transformation.
#[derive(Default)]
struct StyledComponentsBinding {
    /// `import * as styled from 'styled-components'`
    namespace: Option<String>,
    /// `import styled from 'styled-components'` or `import { default as styled
    /// } from 'styled-components'`
    styled: Option<String>,
    /// Named imports like `import { createGlobalStyle, css, keyframes } from
    /// 'styled-components'`
    helpers: [Option<String>; 6],
}

impl StyledComponentsBinding {
    fn helper_name(&self, helper: StyledComponentsHelper) -> Option<&str> {
        self.helpers[helper as usize].as_deref()
    }

    fn set_helper_name(&mut self, helper: StyledComponentsHelper, name: String) {
        self.helpers[helper as usize] = Some(name);
    }
}

/// Main struct for styled-components transformation.
///
/// This plugin handles various transformations for styled-components including:
/// - Adding display names for debugging
/// - Generating unique component IDs for SSR
/// - Transpiling template literals to function calls
/// - Minifying CSS content
pub struct StyledComponents<'a> {
    pub options: StyledComponentsOptions,
    pub ctx: &'a TransformCtx,

    // State
    /// Tracks which variables are bound to styled-components imports
    styled_bindings: StyledComponentsBinding,
    /// Counter for generating unique component IDs
    component_count: usize,
    /// Hash of the current file for component ID generation
    component_id_prefix: Option<String>,
    /// Filename or directory name is used for `displayName`
    block_name: Option<Atom>,
}

impl<'a> StyledComponents<'a> {
    /// Creates a new styled-components transformer with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration for the transformation
    /// * `ctx` - Transform context for accessing utilities and error reporting
    pub fn new(options: StyledComponentsOptions, ctx: &'a TransformCtx) -> Self {
        Self {
            options,
            ctx,
            styled_bindings: StyledComponentsBinding::default(),
            component_id_prefix: None,
            component_count: 0,
            block_name: None,
        }
    }

    /// Generates a unique file hash based on the source path or source code.
    fn get_file_hash(&self) -> String {
        fn base36_encode(mut num: u64) -> String {
            const BASE36_BYTES: &[u8; 36] = b"abcdefghijklmnopqrstuvwxyz0123456789";
            const HASH_LEN: usize = 6;

            num %= 36_u64.pow(HASH_LEN as u32);

            let mut result = String::new();
            while num != 0 {
                result.push(BASE36_BYTES[(num % 36) as usize] as char);
                num /= 36;
            }
            result
        }

        let mut hasher = FxHasher::default();
        if self.ctx.source_path.is_absolute() {
            self.ctx.source_path.hash(&mut hasher);
        } else {
            // Hash the filename if path is not absolute
            self.ctx.filename.hash(&mut hasher);
        }

        base36_encode(hasher.finish())
    }

    /// `<namespace__>sc-<file_hash>-<component_count>`
    fn get_component_id(&mut self) -> Atom {
        // Cache `<namespace__>sc-<file_hash>-` part as it's the same each time
        let prefix = if let Some(prefix) = self.component_id_prefix.as_deref() {
            prefix
        } else {
            let mut prefix = if let Some(namespace) = &self.options.namespace {
                format!("{}__", namespace)
            } else {
                String::new()
            };

            prefix.push_str(&format!("sc-{}-", self.get_file_hash()));

            self.component_id_prefix = Some(prefix);
            self.component_id_prefix.as_deref().unwrap()
        };

        // Add component count to end
        let component_id = format!("{}{}", prefix, self.component_count);
        self.component_count += 1;
        component_id.into()
    }

    /// Returns the block name based on the file stem or parent directory name.
    fn get_block_name(&mut self) -> Option<Atom> {
        if !self.options.file_name {
            return None;
        }

        let file_stem = self
            .ctx
            .source_path
            .file_stem()
            .and_then(|stem| stem.to_str())?;

        Some(
            self.block_name
                .get_or_insert_with(|| {
                    // Should be a name, but if the file stem is in the meaningless file names list,
                    // we will use the parent directory name instead.
                    let block_name = if self
                        .options
                        .meaningless_file_names
                        .iter()
                        .any(|name| name == file_stem)
                    {
                        self.ctx
                            .source_path
                            .parent()
                            .and_then(|parent| parent.file_name())
                            .and_then(|name| name.to_str())
                            .unwrap_or(file_stem)
                    } else {
                        file_stem
                    };

                    block_name.into()
                })
                .clone(),
        )
    }

    /// Collects import bindings which imports from `styled-components`
    fn collect_styled_bindings(&mut self, program: &Program) {
        let module_items = match program {
            Program::Module(module) => &module.body,
            Program::Script(_) => return, // No imports in scripts
        };

        for item in module_items {
            let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item else {
                continue;
            };

            if !is_valid_styled_component_source(&import.src.value) {
                continue;
            }

            for specifier in &import.specifiers {
                match specifier {
                    ImportSpecifier::Named(named) => {
                        let local_name = named.local.sym.to_string();
                        let imported_name = match &named.imported {
                            Some(ModuleExportName::Ident(ident)) => ident.sym.to_string(),
                            Some(ModuleExportName::Str(s)) => {
                                s.value.to_string_lossy().into_owned()
                            }
                            None => local_name.clone(),
                        };

                        match imported_name.as_str() {
                            "default" => {
                                self.styled_bindings.styled = Some(local_name);
                            }
                            name => {
                                if let Some(helper) = StyledComponentsHelper::from_str(name) {
                                    self.styled_bindings.set_helper_name(helper, local_name);
                                }
                            }
                        }
                    }
                    ImportSpecifier::Default(default) => {
                        self.styled_bindings.styled = Some(default.local.sym.to_string());
                    }
                    ImportSpecifier::Namespace(namespace) => {
                        self.styled_bindings.namespace = Some(namespace.local.sym.to_string());
                    }
                }
            }
        }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for StyledComponents<'a> {
    fn enter_program(&mut self, program: &mut Program, _ctx: &mut TraverseCtx<'a>) {
        self.collect_styled_bindings(program);
    }

    fn enter_var_declarator(
        &mut self,
        _declarator: &mut VarDeclarator,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // TODO: Implement pure annotation handling
        // This will handle adding /*#__PURE__*/ comments to call expressions
    }

    #[inline]
    fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx<'a>) {
        // TODO: Implement tagged template expression transformation
        // This will handle:
        // 1. Minifying CSS in template literals
        // 2. Transpiling template literals to function calls
        // 3. Adding displayName and componentId via withConfig
    }

    fn enter_call_expr(&mut self, _call: &mut CallExpr, _ctx: &mut TraverseCtx<'a>) {
        // TODO: Implement call expression transformation
        // This will add displayName and componentId to styled() calls
    }
}

/// Checks if a source string is a valid styled-components import source.
fn is_valid_styled_component_source(source: &str) -> bool {
    matches!(
        source,
        "styled-components"
            | "styled-components/no-tags"
            | "styled-components/native"
            | "styled-components/primitives"
    )
}
