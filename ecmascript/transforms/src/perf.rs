use swc_ecma_visit::Visit;

pub trait Check: Visit + Default {
    fn should_handle(&self) -> bool;
}
