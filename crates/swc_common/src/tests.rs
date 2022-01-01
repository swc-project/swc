use super::*;
use crate::sync::Lrc;

#[test]
fn issue_2853() {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, "const a = \"\u{0000}a\"".into());

    assert_eq!(source_file.src, Lrc::new("const a = \"\u{0000}a\"".into()));
}
