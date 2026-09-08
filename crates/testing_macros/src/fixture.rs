use std::{
    env,
    path::{Component, Path, PathBuf},
};

use anyhow::{Context, Error};
use glob::glob;
use once_cell::sync::Lazy;
use proc_macro2::{Span, TokenStream};
use quote::quote;
use regex::Regex;
use relative_path::RelativePath;
use syn::{
    parse::{Parse, ParseStream},
    parse2,
    punctuated::Punctuated,
    Ident, LitStr, Meta, Token,
};

pub struct Config {
    pattern: String,
    exclude_patterns: Vec<Regex>,
}

impl Parse for Config {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        fn update(c: &mut Config, meta: Meta) {
            if let Meta::List(list) = &meta {
                if list
                    .path
                    .get_ident()
                    .map(|i| *i == "exclude")
                    .unwrap_or(false)
                {
                    //
                    macro_rules! fail {
                        () => {{
                            fail!("invalid input to the attribute")
                        }};
                        ($inner:expr) => {{
                            panic!(
                                "{}\nnote: exclude() expects one or more comma-separated regular \
                                 expressions, like exclude(\".*\\\\.d\\\\.ts\") or \
                                 exclude(\".*\\\\.d\\\\.ts\", \".*\\\\.tsx\")",
                                $inner
                            )
                        }};
                    }

                    if list.tokens.is_empty() {
                        fail!("empty exclude()")
                    }

                    let input = parse2::<InputParen>(list.tokens.clone())
                        .expect("failed to parse token as `InputParen`");

                    for lit in input.input {
                        c.exclude_patterns
                            .push(Regex::new(&lit.value()).unwrap_or_else(|err| {
                                fail!(format!("failed to parse regex: {}\n{}", lit.value(), err))
                            }));
                    }

                    return;
                }
            }

            let expected = r#"#[fixture("fixture/**/*.ts", exclude("*\.d\.ts"))]"#;

            unimplemented!(
                "Expected something like {}\nGot wrong meta tag: {:?}",
                expected,
                meta,
            )
        }

        let pattern: LitStr = input.parse()?;
        let pattern = pattern.value();

        let mut config = Self {
            pattern,
            exclude_patterns: Vec::new(),
        };

        let comma: Option<Token![,]> = input.parse()?;
        if comma.is_some() {
            let meta: Meta = input.parse()?;
            update(&mut config, meta);
        }

        Ok(config)
    }
}

pub fn expand(callee: &Ident, attr: Config) -> Result<Vec<TokenStream>, Error> {
    let base_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect(
        "#[fixture] requires CARGO_MANIFEST_DIR because it's relative to cargo manifest directory",
    ));

    expand_from(callee, attr, &base_dir)
}

fn expand_from(callee: &Ident, attr: Config, base_dir: &Path) -> Result<Vec<TokenStream>, Error> {
    let resolved_path = RelativePath::new(&attr.pattern).to_path(base_dir);
    let pattern = resolved_path.to_string_lossy();

    let paths =
        glob(&pattern).with_context(|| format!("glob failed for whole path: `{pattern}`"))?;
    let mut test_fns = Vec::new();
    // Allow only alphanumeric and underscore characters for the test_name.
    static RE: Lazy<Regex> = Lazy::new(|| Regex::new(r"[^A-Za-z0-9_]").unwrap());

    'add: for path in paths {
        let path = path.with_context(|| "glob failed for file".to_string())?;
        let abs_path = path
            .canonicalize()
            .with_context(|| format!("failed to canonicalize {}", path.display()))?;

        let path_for_name = path.strip_prefix(base_dir).with_context(|| {
            format!(
                "Failed to strip prefix `{}` from `{}`",
                base_dir.display(),
                path.display()
            )
        })?;
        let path_str = path.to_string_lossy();
        // Skip excluded files
        for pattern in &attr.exclude_patterns {
            if pattern.is_match(&path_str) {
                continue 'add;
            }

            if cfg!(target_os = "windows") && pattern.is_match(&path_str.replace('\\', "/")) {
                continue 'add;
            }
        }

        let ignored = is_ignored_fixture(path_for_name);
        let test_name = format!(
            "{}_{}",
            callee,
            RE.replace_all(
                path_for_name
                    .to_string_lossy()
                    .replace(['\\', '/'], "__")
                    .as_str(),
                "_",
            )
        )
        .replace("___", "__");
        let test_ident = Ident::new(&test_name, Span::call_site());

        let ignored_attr = if ignored { quote!(#[ignore]) } else { quote!() };

        let path_str = abs_path.to_string_lossy();
        let f = quote!(
            #[test]
            #[inline(never)]
            #[doc(hidden)]
            #[allow(non_snake_case)]
            #ignored_attr
            fn #test_ident() {
                eprintln!("Input: {}", #path_str);

                #callee(::std::path::PathBuf::from(#path_str));
            }
        );

        test_fns.push(f);
    }

    if test_fns.is_empty() {
        panic!("No test found")
    }

    Ok(test_fns)
}

/// Returns whether a manifest-relative fixture path contains a hidden
/// component.
fn is_ignored_fixture(path: &Path) -> bool {
    path.components().any(|component| match component {
        Component::Normal(name) => name.to_string_lossy().starts_with('.'),
        _ => false,
    })
}

struct InputParen {
    input: Punctuated<LitStr, Token![,]>,
}

impl Parse for InputParen {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Ok(Self {
            input: input.call(Punctuated::parse_terminated)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use std::fs::{create_dir_all, write};

    use proc_macro2::Span;
    use tempfile::tempdir;

    use super::*;

    #[test]
    fn ignores_only_hidden_fixture_path_components() {
        let temp_dir = tempdir().unwrap();
        let manifest_dir = temp_dir
            .path()
            .join(".codex")
            .join("worktrees")
            .join("swc")
            .join("crates")
            .join("testing_macros");
        let fixture_dir = manifest_dir.join("tests").join("fixture");
        let ignored_fixture_dir = fixture_dir.join(".ignored");

        create_dir_all(&ignored_fixture_dir).unwrap();
        write(fixture_dir.join("normal.ts"), "").unwrap();
        write(ignored_fixture_dir.join("ignored.ts"), "").unwrap();

        let cases = expand_from(
            &Ident::new("fixture", Span::call_site()),
            Config {
                pattern: "tests/fixture/**/*.ts".into(),
                exclude_patterns: Vec::new(),
            },
            &manifest_dir,
        )
        .unwrap();

        let case_count = cases.len();
        let ignored_count = cases
            .into_iter()
            .map(|case| syn::parse2::<syn::ItemFn>(case).unwrap())
            .filter(|case| case.attrs.iter().any(|attr| attr.path().is_ident("ignore")))
            .count();

        assert_eq!(case_count, 2);
        assert_eq!(ignored_count, 1);
    }

    #[test]
    fn ignores_hidden_components_in_cross_crate_fixture_paths() {
        assert!(!is_ignored_fixture(Path::new(
            "../other-crate/tests/fixture/input.js"
        )));
        assert!(is_ignored_fixture(Path::new(
            "../other-crate/tests/fixture/.case/input.js"
        )));
    }
}
