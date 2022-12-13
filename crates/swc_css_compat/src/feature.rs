use bitflags::bitflags;

bitflags! {
    pub struct Features: u64 {
        const NESTING = 1 << 0;
        const CUSTOM_MEDIA = 1 << 1;
    }
}
