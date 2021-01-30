#[derive(Debug, Default, Clone, Copy)]
pub(super) struct Ctx {
    in_pat_of_var_decl: bool,
    in_pat_of_param: bool,
}

pub(super) struct WithCtx {
    orig_ctx: Ctx,
}
