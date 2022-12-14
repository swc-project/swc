use bitflags::bitflags;

bitflags! {
    pub struct Features: u64 {
        const NONE = 0;
        const NESTING = 1 << 0;
        const CUSTOM_MEDIA = 1 << 1;
        const MEDIA_QUERY_RANGES = 1 << 2;
        const COLOR_HEX_ALPHA = 1 << 3;
        const LAB_FUNCTION = 1 << 4;
    }
}
