use std::sync::OnceLock;

use crate::Syntax;

/// Internal parser core selection used to stage the fast-core rollout.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum ParserCore {
    Fast,
    Legacy,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum DispatchOverride {
    Fast,
    Legacy,
}

static ENV_OVERRIDE: OnceLock<Option<DispatchOverride>> = OnceLock::new();

#[cfg(test)]
std::thread_local! {
    static TEST_OVERRIDE: std::cell::Cell<Option<DispatchOverride>> = const { std::cell::Cell::new(None) };
}

#[inline]
pub(crate) fn parser_core_for(syntax: Syntax) -> ParserCore {
    if syntax.flow() {
        return ParserCore::Legacy;
    }

    match test_override().or_else(env_override) {
        Some(DispatchOverride::Legacy) => ParserCore::Legacy,
        Some(DispatchOverride::Fast) | None => ParserCore::Fast,
    }
}

#[inline]
fn env_override() -> Option<DispatchOverride> {
    *ENV_OVERRIDE.get_or_init(|| {
        std::env::var("SWC_ECMA_PARSER_CORE")
            .ok()
            .as_deref()
            .and_then(parse_dispatch_override)
    })
}

#[inline]
fn parse_dispatch_override(value: &str) -> Option<DispatchOverride> {
    if value.eq_ignore_ascii_case("legacy") {
        Some(DispatchOverride::Legacy)
    } else if value.eq_ignore_ascii_case("fast") || value.eq_ignore_ascii_case("auto") {
        Some(DispatchOverride::Fast)
    } else {
        None
    }
}

#[inline]
fn test_override() -> Option<DispatchOverride> {
    #[cfg(test)]
    {
        TEST_OVERRIDE.get()
    }

    #[cfg(not(test))]
    {
        None
    }
}

#[cfg(test)]
pub(crate) fn with_parser_core_override_for_test<T>(
    override_mode: ParserCore,
    op: impl FnOnce() -> T,
) -> T {
    let override_mode = Some(match override_mode {
        ParserCore::Fast => DispatchOverride::Fast,
        ParserCore::Legacy => DispatchOverride::Legacy,
    });

    TEST_OVERRIDE.with(|cell| {
        let previous = cell.replace(override_mode);
        let result = op();
        cell.set(previous);
        result
    })
}

#[cfg(test)]
mod tests {
    use super::{
        parse_dispatch_override, parser_core_for, with_parser_core_override_for_test, ParserCore,
    };
    use crate::{EsSyntax, Syntax};

    #[cfg(feature = "flow")]
    #[test]
    fn flow_always_uses_legacy_core() {
        use crate::FlowSyntax;

        let syntax = Syntax::Flow(FlowSyntax::default());

        assert_eq!(parser_core_for(syntax), ParserCore::Legacy);

        with_parser_core_override_for_test(ParserCore::Fast, || {
            assert_eq!(parser_core_for(syntax), ParserCore::Legacy);
        });
    }

    #[test]
    fn non_flow_defaults_to_fast_core() {
        assert_eq!(
            parser_core_for(Syntax::Es(EsSyntax::default())),
            ParserCore::Fast
        );
    }

    #[test]
    fn test_override_can_force_legacy_core() {
        with_parser_core_override_for_test(ParserCore::Legacy, || {
            assert_eq!(
                parser_core_for(Syntax::Es(EsSyntax::default())),
                ParserCore::Legacy
            );
        });
    }

    #[test]
    fn parses_dispatch_override_values() {
        assert_eq!(
            parse_dispatch_override("legacy"),
            Some(super::DispatchOverride::Legacy)
        );
        assert_eq!(
            parse_dispatch_override("fast"),
            Some(super::DispatchOverride::Fast)
        );
        assert_eq!(
            parse_dispatch_override("auto"),
            Some(super::DispatchOverride::Fast)
        );
        assert_eq!(
            parse_dispatch_override("FAST"),
            Some(super::DispatchOverride::Fast)
        );
        assert_eq!(parse_dispatch_override("invalid"), None);
    }
}
