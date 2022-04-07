pub fn span_dummy_with_cmt_proxy() -> u32 {
    // Instead of trying to serialize whole span, send bytepos only
    swc_common::Span::dummy_with_cmt().lo.0
}
