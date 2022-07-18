use preset_env_base::Versions;
use swc_css_visit::VisitMut;

pub use self::prefixer::prefixer;

mod prefixer;

/// Prefixer for CSS.
///
///
/// You can get `versions` from [`preset_env_base::query::targets_to_versions`].
pub fn preset_env(versions: Versions) -> impl VisitMut {}
