use bitflags::bitflags;

bitflags! {
    pub struct Features: u64 {
        const NESTING = 1 << 0;
        const CUSTOM_MEDIA = 1 << 1;
        const MEDIA_QUERY_RANGES = 1 << 2;
        const COLOR_HEX_ALPHA = 1 << 3;
        const COLOR_ALPHA_PARAMETER = 1 << 4;
        const COLOR_SPACE_SEPARATED_PARAMETERS = 1 << 5;
        const COLOR_LEGACY_RGB_AND_HSL = 1 << 6;
        const SELECTOR_NOT = 1 << 7;
    }
}
