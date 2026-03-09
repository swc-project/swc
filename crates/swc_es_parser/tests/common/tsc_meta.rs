use std::borrow::Cow;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TscUnit {
    pub name: String,
    pub source: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TscMetadata {
    pub always_strict: bool,
    pub module_values: Vec<String>,
    pub jsx_values: Vec<String>,
    pub units: Vec<TscUnit>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnitSyntaxKind {
    Typescript,
    Ecmascript,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnitParseMode {
    Program,
    Module,
    Script,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnitParsePlan {
    pub syntax_kind: UnitSyntaxKind,
    pub parse_mode: UnitParseMode,
    pub dts: bool,
    pub tsx: bool,
    pub jsx: bool,
    pub disallow_ambiguous_jsx_like: bool,
    pub allow_return_outside_function: bool,
}

pub fn parse_tsc_metadata(default_unit_name: &str, source: &str) -> TscMetadata {
    let mut always_strict = false;
    let mut module_values = Vec::new();
    let mut jsx_values = Vec::new();

    let mut units = Vec::new();
    let mut current_name = default_unit_name.to_string();
    let mut current_source = String::new();
    let mut saw_explicit_filename = false;

    let push_current = |units: &mut Vec<TscUnit>, name: &str, src: &mut String| {
        if src.is_empty() {
            return;
        }
        units.push(TscUnit {
            name: name.to_string(),
            source: std::mem::take(src),
        });
    };

    for line in source.lines() {
        if let Some((key, value)) = parse_metadata_line(line) {
            match key.as_str() {
                "filename" => {
                    if saw_explicit_filename {
                        push_current(&mut units, &current_name, &mut current_source);
                    } else {
                        if !current_source.is_empty() {
                            push_current(&mut units, &current_name, &mut current_source);
                        }
                        saw_explicit_filename = true;
                    }
                    current_name = value;
                }
                "module" => {
                    module_values = split_csv_values(&value);
                }
                "jsx" => {
                    jsx_values = split_csv_values(&value);
                }
                "alwaysstrict" => {
                    always_strict = parse_bool_value(&value);
                }
                _ => {}
            }
            continue;
        }

        if !current_source.is_empty() {
            current_source.push('\n');
        }
        current_source.push_str(line);
    }

    if !current_source.is_empty() || !saw_explicit_filename {
        push_current(&mut units, &current_name, &mut current_source);
    }

    TscMetadata {
        always_strict,
        module_values,
        jsx_values,
        units,
    }
}

pub fn strict_wrapped_source<'a>(meta: &TscMetadata, source: &'a str) -> Cow<'a, str> {
    if meta.always_strict {
        Cow::Owned(format!("'use strict';\n{source}"))
    } else {
        Cow::Borrowed(source)
    }
}

pub fn unit_parse_plan(unit_name: &str, meta: &TscMetadata) -> Option<UnitParsePlan> {
    let normalized_name = unit_name.to_ascii_lowercase();

    let dts = normalized_name.ends_with(".d.ts")
        || normalized_name.ends_with(".d.mts")
        || normalized_name.ends_with(".d.cts");

    let extension = normalized_name.rsplit('.').next().unwrap_or("");
    let module_mode_from_meta = parse_mode_from_module_values(&meta.module_values);
    let jsx_from_meta = !meta.jsx_values.is_empty();

    match extension {
        "ts" | "tsx" | "mts" | "cts" => {
            let parse_mode = if extension == "mts" {
                UnitParseMode::Module
            } else if extension == "cts" {
                UnitParseMode::Program
            } else {
                module_mode_from_meta.unwrap_or(UnitParseMode::Program)
            };

            Some(UnitParsePlan {
                syntax_kind: UnitSyntaxKind::Typescript,
                parse_mode,
                dts,
                tsx: extension == "tsx",
                jsx: extension == "tsx" || jsx_from_meta,
                disallow_ambiguous_jsx_like: matches!(extension, "mts" | "cts"),
                allow_return_outside_function: false,
            })
        }
        "js" | "jsx" | "mjs" | "cjs" => {
            let parse_mode = match extension {
                "mjs" => UnitParseMode::Module,
                "cjs" => UnitParseMode::Script,
                _ => module_mode_from_meta.unwrap_or(UnitParseMode::Program),
            };

            Some(UnitParsePlan {
                syntax_kind: UnitSyntaxKind::Ecmascript,
                parse_mode,
                dts: false,
                tsx: false,
                jsx: extension == "jsx" || jsx_from_meta,
                disallow_ambiguous_jsx_like: false,
                allow_return_outside_function: extension == "cjs",
            })
        }
        _ => None,
    }
}

fn parse_metadata_line(line: &str) -> Option<(String, String)> {
    let trimmed = line.trim_start();
    let after_slashes = trimmed.strip_prefix("//")?;
    let after_slashes = after_slashes.trim_start();
    let after_at = after_slashes.strip_prefix('@')?;
    let (key, value) = after_at.split_once(':')?;
    let key = key.trim();
    if key.is_empty() {
        return None;
    }
    Some((key.to_ascii_lowercase(), value.trim().to_string()))
}

fn split_csv_values(value: &str) -> Vec<String> {
    value
        .split(',')
        .map(|part| part.trim().to_ascii_lowercase())
        .filter(|part| !part.is_empty())
        .collect()
}

fn parse_bool_value(value: &str) -> bool {
    value.trim().eq_ignore_ascii_case("true")
}

fn parse_mode_from_module_values(values: &[String]) -> Option<UnitParseMode> {
    let has_module = values.iter().any(|value| {
        matches!(
            value.as_str(),
            "es2015" | "es6" | "es2020" | "es2022" | "esnext" | "node16" | "nodenext" | "preserve"
        )
    });
    let has_script_like = values
        .iter()
        .any(|value| matches!(value.as_str(), "commonjs" | "amd" | "system" | "umd"));

    if has_module {
        Some(UnitParseMode::Module)
    } else if has_script_like {
        Some(UnitParseMode::Program)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::{
        parse_tsc_metadata, strict_wrapped_source, unit_parse_plan, UnitParseMode, UnitSyntaxKind,
    };

    #[test]
    fn splits_units_with_case_insensitive_filename_markers() {
        let source = "\
// @Filename: a.ts
export const a = 1;
// @fileName: b.tsx
export const b = <div />;
";
        let meta = parse_tsc_metadata("entry.ts", source);
        assert_eq!(meta.units.len(), 2);
        assert_eq!(meta.units[0].name, "a.ts");
        assert_eq!(meta.units[1].name, "b.tsx");
    }

    #[test]
    fn preserves_implicit_first_unit_before_first_filename() {
        let source = "\
export const first = 1;
// @filename: second.ts
export const second = 2;
";
        let meta = parse_tsc_metadata("entry.ts", source);
        assert_eq!(meta.units.len(), 2);
        assert_eq!(meta.units[0].name, "entry.ts");
        assert_eq!(meta.units[1].name, "second.ts");
    }

    #[test]
    fn wraps_source_when_always_strict_is_enabled() {
        let source = "\
// @alwaysStrict: true
const value = 1;
";
        let meta = parse_tsc_metadata("entry.ts", source);
        let wrapped = strict_wrapped_source(&meta, "const value = 1;");
        assert_eq!(wrapped, "'use strict';\nconst value = 1;");
    }

    #[test]
    fn computes_unit_parse_plan_from_extension_and_metadata() {
        let source = "\
// @module: esnext
// @jsx: preserve
";
        let meta = parse_tsc_metadata("entry.ts", source);
        let ts_plan = unit_parse_plan("a.d.mts", &meta).unwrap();
        assert_eq!(ts_plan.syntax_kind, UnitSyntaxKind::Typescript);
        assert_eq!(ts_plan.parse_mode, UnitParseMode::Module);
        assert!(ts_plan.dts);
        assert!(ts_plan.disallow_ambiguous_jsx_like);

        let js_plan = unit_parse_plan("comp.jsx", &meta).unwrap();
        assert_eq!(js_plan.syntax_kind, UnitSyntaxKind::Ecmascript);
        assert_eq!(js_plan.parse_mode, UnitParseMode::Module);
        assert!(js_plan.jsx);
    }

    #[test]
    fn skips_non_source_units() {
        let meta = parse_tsc_metadata("entry.ts", "// @module: commonjs");
        assert!(unit_parse_plan("data.json", &meta).is_none());
    }
}
