use super::data::BUILTINS;
use crate::Versions;
use swc_atoms::JsWord;

pub(crate) struct UsageVisitor {
    is_any_target: bool,
    target: Versions,
    pub required: Vec<JsWord>,
}

impl UsageVisitor {
    pub fn new(target: Versions) -> Self {
        //        let mut v = Self { required: vec![] };
        //
        //
        //        let is_web_target = target
        //            .iter()
        //            .any(|(name, version)| name != "node" &&
        // version.is_some());
        //
        //        println!(
        //            "is_any_target={:?}\nis_web_target={:?}",
        //            is_any_target, is_web_target
        //        );
        //
        //        // Web default
        //        if is_any_target || is_web_target {
        //            v.add(&["web.timers", "web.immediate",
        // "web.dom.iterable"]);        }
        //        v

        Self {
            is_any_target: target.is_any_target(),
            target,
            required: vec![],
        }
    }

    /// Add imports
    fn add(&mut self, features: &[&str]) {
        for f in features {
            if !self.is_any_target {}

            let v = format!("core-js/modules/{}", f);

            if self.required.iter().all(|import| *import != *v) {
                self.required.push(v.into())
            }
        }
    }
}
