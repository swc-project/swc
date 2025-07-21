use bitflags::bitflags;

bitflags! {
    #[derive(Debug, Clone, Copy)]
    pub struct Features: u64 {
        const STATIC_BLOCKS = 1 << 0;
        const OPTIONAL_CHAINING = 1 << 1;
        const PRIVATE_IN_OBJECT = 1 << 2;
    }
}
