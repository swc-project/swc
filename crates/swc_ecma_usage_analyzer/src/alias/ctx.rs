use bitflags::bitflags;

bitflags! {
    #[derive(Debug, Default, Clone, Copy)]
    pub struct Ctx: u8 {
        const TrackExprIdent = 1 << 0;
        const IsCallee = 1 << 1;
        const IsPatDecl = 1 << 2;
    }
}
