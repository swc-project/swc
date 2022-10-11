use swc_atoms::{js_word, JsWord};

pub fn get_duration_ratio(unit1: JsWord, unit2: JsWord) -> Option<f64> {
    // Duration ratio, see https://www.w3.org/TR/css-values-4/#time

    if unit1 == unit2 {
        return Some(1.0);
    }

    match unit1 {
        js_word!("ms") => match unit2 {
            js_word!("s") => Some(1000.0),
            _ => None,
        },
        js_word!("s") => match unit2 {
            js_word!("ms") => Some(0.001),
            _ => None,
        },
        _ => None,
    }
}

pub fn get_frequency_ratio(unit1: JsWord, unit2: JsWord) -> Option<f64> {
    // Frequency ratio, see https://www.w3.org/TR/css-values-4/#frequency

    if unit1 == unit2 {
        return Some(1.0);
    }

    match unit1 {
        js_word!("hz") => match unit2 {
            js_word!("khz") => Some(1000.0),
            _ => None,
        },
        js_word!("khz") => match unit2 {
            js_word!("hz") => Some(0.001),
            _ => None,
        },
        _ => None,
    }
}

pub fn get_absolute_length_ratio(unit1: JsWord, unit2: JsWord) -> Option<f64> {
    // For length ratio, see https://www.w3.org/TR/css-values-4/#absolute-lengths

    if unit1 == unit2 {
        return Some(1.0);
    }

    match unit1 {
        js_word!("cm") => match unit2 {
            js_word!("mm") => Some(0.1),
            js_word!("q") => Some(0.025),
            js_word!("in") => Some(2.54),
            _ => None,
        },
        js_word!("mm") => match unit2 {
            js_word!("cm") => Some(10.0),
            js_word!("q") => Some(0.25),
            js_word!("in") => Some(25.4),
            _ => None,
        },
        js_word!("q") => match unit2 {
            js_word!("cm") => Some(40.0),
            js_word!("mm") => Some(4.0),
            js_word!("in") => Some(101.6),
            _ => None,
        },
        js_word!("pc") => match unit2 {
            js_word!("in") => Some(6.0),
            js_word!("px") => Some(0.0625),
            _ => None,
        },
        js_word!("pt") => match unit2 {
            js_word!("in") => Some(72.0),
            js_word!("pc") => Some(12.0),
            js_word!("px") => Some(0.75),
            _ => None,
        },
        js_word!("px") => match unit2 {
            js_word!("in") => Some(96.0),
            js_word!("pc") => Some(16.0),
            _ => None,
        },
        _ => None,
    }
}

pub fn get_resolution_ratio(unit1: JsWord, unit2: JsWord) -> Option<f64> {
    // Resolution ratio, see https://www.w3.org/TR/css-values-4/#resolution
    // "x" is an alias for "dppx"

    if unit1 == unit2 {
        return Some(1.0);
    }

    match unit1 {
        js_word!("dpcm") => match unit2 {
            js_word!("dpi") => Some(2.54),
            _ => None,
        },
        js_word!("dppx") | js_word!("x") => match unit2 {
            js_word!("dppx") | js_word!("x") => Some(1.0),
            js_word!("dpi") => Some(96.0),
            _ => None,
        },
        _ => None,
    }
}

pub fn is_absolute_length(unit: JsWord) -> bool {
    match unit {
        js_word!("cm")
        | js_word!("mm")
        | js_word!("q")
        | js_word!("in")
        | js_word!("pc")
        | js_word!("pt")
        | js_word!("px") => true,
        _ => false,
    }
}
