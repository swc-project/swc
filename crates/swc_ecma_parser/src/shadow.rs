use std::sync::OnceLock;

use crate::{dispatch::ParserCore, Syntax};

/// Optional shadow parser core selection used to diff fast and legacy paths.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum ShadowParserCore {
    Alternate,
    Fast,
    Legacy,
}

static ENV_OVERRIDE: OnceLock<Option<ShadowParserCore>> = OnceLock::new();

#[cfg(test)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum TestOverride {
    Disabled,
    Enabled(ShadowParserCore),
}

#[cfg(test)]
std::thread_local! {
    static TEST_OVERRIDE: std::cell::Cell<Option<TestOverride>> = const { std::cell::Cell::new(None) };
    static TEST_RUN_COUNT: std::cell::Cell<usize> = const { std::cell::Cell::new(0) };
}

#[inline]
pub(crate) fn shadow_core_for(primary: ParserCore, syntax: Syntax) -> Option<ParserCore> {
    if syntax.flow() {
        return None;
    }

    #[cfg(test)]
    let override_mode = match test_override() {
        Some(TestOverride::Disabled) => return None,
        Some(TestOverride::Enabled(mode)) => Some(mode),
        None => env_override(),
    };

    #[cfg(not(test))]
    let override_mode = env_override();

    let override_mode = override_mode?;

    let shadow = match override_mode {
        ShadowParserCore::Alternate => alternate(primary),
        ShadowParserCore::Fast => ParserCore::Fast,
        ShadowParserCore::Legacy => ParserCore::Legacy,
    };

    (shadow != primary).then_some(shadow)
}

#[inline]
fn alternate(primary: ParserCore) -> ParserCore {
    match primary {
        ParserCore::Fast => ParserCore::Legacy,
        ParserCore::Legacy => ParserCore::Fast,
    }
}

#[inline]
fn env_override() -> Option<ShadowParserCore> {
    *ENV_OVERRIDE.get_or_init(|| {
        std::env::var("SWC_ECMA_PARSER_SHADOW")
            .ok()
            .as_deref()
            .and_then(parse_shadow_core)
    })
}

#[inline]
fn parse_shadow_core(value: &str) -> Option<ShadowParserCore> {
    if value.eq_ignore_ascii_case("legacy") {
        Some(ShadowParserCore::Legacy)
    } else if value.eq_ignore_ascii_case("fast") {
        Some(ShadowParserCore::Fast)
    } else if value.eq_ignore_ascii_case("alternate")
        || value.eq_ignore_ascii_case("1")
        || value.eq_ignore_ascii_case("true")
        || value.eq_ignore_ascii_case("yes")
        || value.eq_ignore_ascii_case("on")
    {
        Some(ShadowParserCore::Alternate)
    } else {
        None
    }
}

#[cfg(test)]
#[inline]
fn test_override() -> Option<TestOverride> {
    TEST_OVERRIDE.get()
}

#[cfg(test)]
pub(crate) fn with_shadow_core_override_for_test<T>(
    override_mode: Option<ShadowParserCore>,
    op: impl FnOnce() -> T,
) -> T {
    let override_mode = Some(match override_mode {
        Some(mode) => TestOverride::Enabled(mode),
        None => TestOverride::Disabled,
    });

    TEST_OVERRIDE.with(|cell| {
        let previous = cell.replace(override_mode);
        let result = op();
        cell.set(previous);
        result
    })
}

#[inline]
pub(crate) fn note_shadow_run() {
    #[cfg(test)]
    TEST_RUN_COUNT.with(|count| count.set(count.get() + 1));
}

#[cfg(test)]
pub(crate) fn take_shadow_run_count_for_test() -> usize {
    TEST_RUN_COUNT.with(|count| count.replace(0))
}

#[cfg(test)]
mod tests {
    use swc_common::{comments::Comments, FileName, SourceMap};
    use swc_ecma_ast::EsVersion;

    use super::{parse_shadow_core, shadow_core_for, with_shadow_core_override_for_test};
    use crate::{dispatch::ParserCore, parse_file_as_module, EsSyntax, Syntax};

    #[test]
    fn parses_shadow_override_values() {
        assert_eq!(
            parse_shadow_core("alternate"),
            Some(super::ShadowParserCore::Alternate)
        );
        assert_eq!(
            parse_shadow_core("true"),
            Some(super::ShadowParserCore::Alternate)
        );
        assert_eq!(
            parse_shadow_core("fast"),
            Some(super::ShadowParserCore::Fast)
        );
        assert_eq!(
            parse_shadow_core("legacy"),
            Some(super::ShadowParserCore::Legacy)
        );
        assert_eq!(parse_shadow_core("off"), None);
    }

    #[test]
    fn alternate_shadow_core_flips_primary_core() {
        with_shadow_core_override_for_test(Some(super::ShadowParserCore::Alternate), || {
            assert_eq!(
                shadow_core_for(ParserCore::Fast, Syntax::Es(EsSyntax::default())),
                Some(ParserCore::Legacy)
            );
            assert_eq!(
                shadow_core_for(ParserCore::Legacy, Syntax::Es(EsSyntax::default())),
                Some(ParserCore::Fast)
            );
        });
    }

    #[test]
    fn explicit_shadow_core_skips_same_core() {
        with_shadow_core_override_for_test(Some(super::ShadowParserCore::Fast), || {
            assert_eq!(
                shadow_core_for(ParserCore::Fast, Syntax::Es(EsSyntax::default())),
                None
            );
            assert_eq!(
                shadow_core_for(ParserCore::Legacy, Syntax::Es(EsSyntax::default())),
                Some(ParserCore::Fast)
            );
        });
    }

    #[test]
    fn parse_file_entrypoint_can_run_shadow_core() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Anon.into(),
            "export const answer = 42;\n".to_string(),
        );
        let mut errors = Vec::new();

        super::take_shadow_run_count_for_test();
        with_shadow_core_override_for_test(Some(super::ShadowParserCore::Alternate), || {
            let module = parse_file_as_module(
                &fm,
                Syntax::Es(EsSyntax::default()),
                EsVersion::Es2022,
                None::<&dyn Comments>,
                &mut errors,
            )
            .expect("module should parse");

            assert_eq!(module.body.len(), 1);
        });

        assert!(errors.is_empty());
        assert_eq!(super::take_shadow_run_count_for_test(), 1);
    }
}
