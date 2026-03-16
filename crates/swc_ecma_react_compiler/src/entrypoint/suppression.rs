use swc_common::{comments::Comment, Span};

use crate::error::{CompilerError, CompilerErrorDetail, ErrorCategory, ErrorSeverity};

const DEFAULT_ESLINT_SUPPRESSIONS: &[&str] =
    &["react-hooks/exhaustive-deps", "react-hooks/rules-of-hooks"];
const NEXT_LINE_SUPPRESSION_MAX_GAP_BYTES: u32 = 256;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SuppressionSource {
    Eslint,
    Flow,
}

#[derive(Debug, Clone)]
pub struct SuppressionRange {
    pub disable_comment: Comment,
    pub enable_comment: Option<Comment>,
    pub source: SuppressionSource,
}

pub fn is_next_line_suppression(range: &SuppressionRange) -> bool {
    if range.source != SuppressionSource::Eslint {
        return false;
    }

    if !range
        .disable_comment
        .text
        .contains("eslint-disable-next-line")
    {
        return false;
    }

    match range.enable_comment.as_ref() {
        Some(enable) => enable.span == range.disable_comment.span,
        None => false,
    }
}

pub fn default_eslint_suppression_rules() -> Vec<String> {
    DEFAULT_ESLINT_SUPPRESSIONS
        .iter()
        .map(|value| (*value).to_string())
        .collect()
}

pub fn find_program_suppressions(
    comments: &[Comment],
    eslint_suppression_rules: Option<&[String]>,
    flow_suppressions: bool,
) -> Vec<SuppressionRange> {
    let rules: Vec<&str> = if let Some(rules) = eslint_suppression_rules {
        rules.iter().map(String::as_str).collect()
    } else {
        DEFAULT_ESLINT_SUPPRESSIONS.to_vec()
    };

    let mut ranges = Vec::new();
    let mut open_eslint_disable: Option<Comment> = None;

    for comment in comments {
        let text = comment.text.as_ref();

        let has_rule = !rules.is_empty() && rules.iter().any(|rule| text.contains(rule));
        let is_disable_next_line = text.contains("eslint-disable-next-line") && has_rule;
        if is_disable_next_line {
            ranges.push(SuppressionRange {
                disable_comment: comment.clone(),
                enable_comment: Some(comment.clone()),
                source: SuppressionSource::Eslint,
            });
            continue;
        }

        let is_flow = flow_suppressions
            && text.contains("react-rule")
            && (text.contains("$FlowFixMe")
                || text.contains("$FlowExpectedError")
                || text.contains("$FlowIssue"));
        if is_flow {
            ranges.push(SuppressionRange {
                disable_comment: comment.clone(),
                enable_comment: Some(comment.clone()),
                source: SuppressionSource::Flow,
            });
            continue;
        }

        let is_disable = text.contains("eslint-disable")
            && !text.contains("eslint-disable-next-line")
            && has_rule;
        if is_disable {
            open_eslint_disable = Some(comment.clone());
        }

        let is_enable = text.contains("eslint-enable") && has_rule;
        if is_enable {
            if let Some(disable_comment) = open_eslint_disable.take() {
                ranges.push(SuppressionRange {
                    disable_comment,
                    enable_comment: Some(comment.clone()),
                    source: SuppressionSource::Eslint,
                });
            }
        }
    }

    if let Some(disable_comment) = open_eslint_disable {
        ranges.push(SuppressionRange {
            disable_comment,
            enable_comment: None,
            source: SuppressionSource::Eslint,
        });
    }

    ranges
}

pub fn filter_suppressions_that_affect_range(
    suppression_ranges: &[SuppressionRange],
    span: Span,
) -> Vec<SuppressionRange> {
    let mut suppressions_in_scope = Vec::new();

    for suppression_range in suppression_ranges {
        let disable_span = suppression_range.disable_comment.span;
        let enable_span = suppression_range
            .enable_comment
            .as_ref()
            .map(|comment| comment.span);

        let is_within_function = disable_span.lo > span.lo
            && match enable_span {
                Some(enable) => enable.hi < span.hi,
                None => true,
            };

        let wraps_function = disable_span.lo < span.lo
            && match enable_span {
                Some(enable) => enable.hi > span.hi,
                None => true,
            };

        let is_next_line_suppression = is_next_line_suppression(suppression_range)
            && disable_span.hi <= span.lo
            && span.lo.0.saturating_sub(disable_span.hi.0) <= NEXT_LINE_SUPPRESSION_MAX_GAP_BYTES;

        if is_within_function || wraps_function || is_next_line_suppression {
            suppressions_in_scope.push(suppression_range.clone());
        }
    }

    suppressions_in_scope
}

pub fn suppressions_to_compiler_error(suppression_ranges: &[SuppressionRange]) -> CompilerError {
    let mut err = CompilerError::new();

    for suppression in suppression_ranges {
        let (reason, suggestion) = match suppression.source {
            SuppressionSource::Eslint => (
                "React Compiler skipped optimizing this function because one or more React ESLint \
                 rules were disabled",
                "Remove the ESLint suppression and address the React error",
            ),
            SuppressionSource::Flow => (
                "React Compiler skipped optimizing this function because one or more React rule \
                 violations were reported by Flow",
                "Remove the Flow suppression and address the React error",
            ),
        };

        let mut detail = CompilerErrorDetail::error(ErrorCategory::Suppression, reason);
        detail.severity = ErrorSeverity::Error;
        detail.description = Some(format!(
            "Found suppression `{}`",
            suppression.disable_comment.text.trim()
        ));
        detail.loc = Some(suppression.disable_comment.span);
        detail.suggestions = Some(vec![suggestion.to_string()]);
        err.push(detail);
    }

    err
}

#[cfg(test)]
mod tests {
    use swc_common::{
        comments::{Comment, CommentKind},
        BytePos, DUMMY_SP,
    };

    use super::*;

    fn comment(start: u32, end: u32, text: &str) -> Comment {
        Comment {
            kind: CommentKind::Line,
            span: Span::new(BytePos(start), BytePos(end)),
            text: text.into(),
        }
    }

    #[test]
    fn detects_disable_next_line() {
        let comments = vec![comment(
            10,
            30,
            " eslint-disable-next-line react-hooks/rules-of-hooks ",
        )];

        let ranges = find_program_suppressions(&comments, None, true);
        assert_eq!(ranges.len(), 1);
        assert_eq!(ranges[0].source, SuppressionSource::Eslint);
        assert!(ranges[0].enable_comment.is_some());
    }

    #[test]
    fn filters_suppressions_in_function_range() {
        let comments = vec![comment(
            10,
            30,
            " eslint-disable-next-line react-hooks/rules-of-hooks ",
        )];
        let ranges = find_program_suppressions(&comments, None, true);
        let hits =
            filter_suppressions_that_affect_range(&ranges, Span::new(BytePos(5), BytePos(100)));
        assert_eq!(hits.len(), 1);

        let misses =
            filter_suppressions_that_affect_range(&ranges, Span::new(BytePos(400), BytePos(600)));
        assert_eq!(misses.len(), 0);
    }

    #[test]
    fn next_line_suppression_affects_following_function() {
        let comments = vec![comment(
            10,
            30,
            " eslint-disable-next-line react-hooks/rules-of-hooks ",
        )];
        let ranges = find_program_suppressions(&comments, None, true);
        let hits =
            filter_suppressions_that_affect_range(&ranges, Span::new(BytePos(35), BytePos(200)));
        assert_eq!(hits.len(), 1);
        assert_eq!(hits[0].source, SuppressionSource::Eslint);
    }

    #[test]
    fn builds_compiler_error_from_suppressions() {
        let range = SuppressionRange {
            disable_comment: comment(
                10,
                20,
                " eslint-disable-next-line react-hooks/rules-of-hooks ",
            ),
            enable_comment: None,
            source: SuppressionSource::Eslint,
        };
        let err = suppressions_to_compiler_error(&[range]);
        assert!(err.has_any_errors());
        assert_eq!(err.details.len(), 1);
        assert_eq!(err.details[0].category, ErrorCategory::Suppression);
        assert_ne!(DUMMY_SP, err.details[0].loc.expect("loc should be set"));
    }
}
