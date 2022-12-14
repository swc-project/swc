#[inline]
pub(crate) fn clamp_unit_f32(val: f64) -> u8 {
    (val * 255.).round().max(0.).min(255.) as u8
}

#[inline]
pub(crate) fn round_alpha(alpha: f64) -> f64 {
    let mut rounded_alpha = (alpha * 100.).round() / 100.;

    if clamp_unit_f32(rounded_alpha) != clamp_unit_f32(alpha) {
        rounded_alpha = (alpha * 1000.).round() / 1000.;
    }

    rounded_alpha
}
