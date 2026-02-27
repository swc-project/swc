bitflags::bitflags! {
    /// Parser context flags.
    #[derive(Debug, Clone, Copy, Default)]
    pub struct Context: u32 {
        const MODULE = 1 << 0;
        const STRICT = 1 << 1;
        const IN_FUNCTION = 1 << 2;
        const IN_LOOP = 1 << 3;
        const CAN_BE_MODULE = 1 << 4;
        const IN_ASYNC = 1 << 5;
        const IN_GENERATOR = 1 << 6;
        const IN_TYPE = 1 << 7;
        const TOP_LEVEL = 1 << 8;
    }
}
