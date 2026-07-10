//! Stable failure fingerprints and concise tracked summaries.

use sha2::{Digest, Sha256};

const SUMMARY_CHAR_LIMIT: usize = 240;
const CONTEXT_MARKERS: [&str; 2] = ["\nstack:\n", "\nconsole:"];

/// Produces a stable fingerprint from a complete diagnostic.
///
/// Deterministic semantic evidence, including before/after pipeline output,
/// participates byte-for-byte. Node stack traces and captured console output
/// are retained in artifacts but excluded because they are contextual and can
/// contain machine-specific paths or engine formatting.
pub fn fingerprint(diagnostic: &str) -> String {
    let normalized = stable_part(diagnostic);
    let mut hasher = Sha256::new();
    hasher.update(normalized.as_bytes());
    format!("{:x}", hasher.finalize())
}

/// Returns a single-line summary suitable for a reviewed Git baseline.
pub fn summary(diagnostic: &str) -> String {
    let first_line = diagnostic.lines().next().unwrap_or(diagnostic).trim();
    let mut chars = first_line.chars();
    let mut summary = chars.by_ref().take(SUMMARY_CHAR_LIMIT).collect::<String>();
    if chars.next().is_some() {
        summary.push('…');
    }
    if summary.is_empty() {
        "no diagnostic details".into()
    } else {
        summary
    }
}

fn stable_part(diagnostic: &str) -> &str {
    let end = CONTEXT_MARKERS
        .into_iter()
        .filter_map(|marker| diagnostic.find(marker))
        .min()
        .unwrap_or(diagnostic.len());
    &diagnostic[..end]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn preserves_deterministic_positions_lengths_values_and_named_errors() {
        assert_ne!(
            fingerprint("Error { error: (12..18, TS2406) }"),
            fingerprint("Error { error: (120..180, TS2406) }")
        );
        assert_ne!(
            fingerprint("Error { error: (12..18, TS2406) }"),
            fingerprint("Error { error: (12..18, TS2407) }")
        );
        assert_ne!(
            fingerprint("first output is 10 bytes, second output is 20 bytes"),
            fingerprint("first output is 11 bytes, second output is 21 bytes")
        );
        assert_ne!(
            fingerprint("RegExp.$1 assertion failed"),
            fingerprint("RegExp.$2 assertion failed")
        );
    }

    #[test]
    fn includes_before_after_payloads_in_identity() {
        assert_ne!(
            fingerprint("code generation is not idempotent\nfirst:\nconst a = 1;"),
            fingerprint("code generation is not idempotent\nfirst:\nconst b = 2;")
        );
        assert_ne!(
            fingerprint("source map changed\nbefore: one"),
            fingerprint("source map changed\nbefore: two")
        );
    }

    #[test]
    fn excludes_only_contextual_stack_and_console_details() {
        assert_eq!(
            fingerprint("TypeError: failed\nstack:\n/path/a.js:1:2\nconsole:\n[log] one"),
            fingerprint("TypeError: failed\nstack:\n/path/b.js:9:8\nconsole:\n[log] two")
        );
        assert_eq!(
            fingerprint("TypeError: failed\nconsole:\n[log] one"),
            fingerprint("TypeError: failed\nconsole:\n[log] two")
        );
    }

    #[test]
    fn creates_a_short_unicode_safe_summary() {
        let diagnostic = format!("{}\nfull detail", "😀".repeat(SUMMARY_CHAR_LIMIT + 1));
        let summary = summary(&diagnostic);
        assert_eq!(summary.chars().count(), SUMMARY_CHAR_LIMIT + 1);
        assert!(summary.ends_with('…'));
    }
}
