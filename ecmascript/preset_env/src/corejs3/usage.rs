use super::data::BUILTINS;
use crate::Versions;

pub(crate) struct UsageVisitor<'a> {
    is_any_target: bool,
    target: &'a Versions,
    pub required: Vec<JsWord>,
}

impl<'a> UsageVisitor<'a> {
    pub fn new(target: &'a Versions) -> Self {
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
            if !self.is_any_target {
                if let Some(v) = BUILTINS.get(&**f) {
                    // Skip
                    if v.iter().zip(self.target.iter()).all(|((_, fv), (_, tv))| {
                        // fv: feature's version
                        // tv: target's version

                        // We are not targeting the platform. So ignore it.
                        if tv.is_none() {
                            return true;
                        }

                        // Not supported by browser (even on latest version)
                        if fv.is_none() {
                            return false;
                        }

                        *fv <= *tv
                    }) {
                        continue;
                    }
                }
            }

            let v = format!("core-js/modules/{}", f);

            if self.required.iter().all(|import| *import != *v) {
                self.required.push(v.into())
            }
        }
    }
}
