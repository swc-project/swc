use swc_ecma_transforms::pass::Pass;
use swc_common::Mark;

/// This *colors* type. This is [swc_ecma_transforms::resolver] for types declared in [crate::ty].
pub fn colorizer() ->impl Pass+'static{
 Colorizer{parent:None,mark:Mark::root()}
}

#[derive(Debug)]
struct Colorizer<'a> {
    parent:Option<&'a Colorizer<'a>>,
    mark:Mark
}