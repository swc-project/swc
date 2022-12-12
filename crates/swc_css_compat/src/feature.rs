use bitflags::bitflags;

bitflags! {
    pub struct Features: u64 {
        const NESTING = 0b00000001;
    }
}
