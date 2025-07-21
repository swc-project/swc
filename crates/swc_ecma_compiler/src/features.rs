use bitflags::bitflags;

bitflags! {
    #[derive(Debug, Clone, Copy)]
    pub struct Features: u64 {
        const STATIC_BLOCKS = 1 << 0;
        const OPTIONAL_CHAINING = 1 << 1;
        const PRIVATE_IN_OBJECT = 1 << 2;
        const LOGICAL_ASSIGNMENTS = 1 << 3;
        const NULLISH_COALESCING = 1 << 4;
        const EXPORT_NAMESPACE_FROM = 1 << 5;
    }
}
