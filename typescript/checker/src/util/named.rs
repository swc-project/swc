use swc_atoms::JsWord;

pub trait Named {
    fn is(&self, name: &JsWord) -> bool;
}
