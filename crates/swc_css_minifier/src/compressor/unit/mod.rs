use phf::phf_map;

// We need to use several declarations (instead of one giant nested map)
// because of a current limitation of phf (https://github.com/rust-phf/rust-phf/issues/183)
type RatioMap = phf::Map<&'static str, f64>;

// For length ratio, see https://www.w3.org/TR/css-values-4/#absolute-lengths
static CM: RatioMap = phf_map! {
    "cm" => 1.0,
    "mm" => 0.1,
    "q" => 0.025,
    "in" => 2.54,
    "pc" => 2.54 / 6.0,
    "pt" => 2.54 / 72.0,
    "px" => 2.54 / 96.0,
};

static MM: RatioMap = phf_map! {
    "cm" => 10.0,
    "mm" => 1.0,
    "q" => 0.25,
    "in" => 25.4,
    "pc" => 25.4 / 6.0,
    "pt" => 25.4 / 72.0,
    "px" => 25.4 / 96.0,
};

static Q: RatioMap = phf_map! {
    "cm" => 40.0,
    "mm" => 4.0,
    "q" => 1.0,
    "in" => 101.6,
    "pc" => 101.6 / 6.0,
    "pt" => 101.6 / 72.0,
    "px" => 101.6 / 96.0,
};

static IN: RatioMap = phf_map! {
    "cm" => 1.0 / 2.54,
    "mm" => 1.0 / 25.4,
    "q" => 1.0 / 101.6,
    "in" => 1.0,
    "pc" => 1.0 / 6.0,
    "pt" => 1.0 / 72.0,
    "px" => 1.0 / 96.0,
};

static PC: RatioMap = phf_map! {
    "cm" => 6.0 / 2.54,
    "mm" => 6.0 / 25.4,
    "q" => 6.0 / 101.6,
    "in" => 6.0,
    "pc" => 1.0,
    "pt" => 6.0 / 72.0,
    "px" => 0.0625,
};

static PT: RatioMap = phf_map! {
    "cm" => 72.0 / 2.54,
    "mm" => 72.0 / 25.4,
    "q" => 72.0 / 101.6,
    "in" => 72.0,
    "pc" => 12.0,
    "pt" => 1.0,
    "px" => 0.75,
};

static PX: RatioMap = phf_map! {
    "cm" => 96.0 / 2.54,
    "mm" => 96.0 / 25.4,
    "q" => 96.0 / 101.6,
    "in" => 96.0,
    "pc" => 96.0 / 6.0,
    "pt" => 96.0 / 72.0,
    "px" => 1.0,
};

static ABSOLUTE_LENGTH_RATIO: phf::Map<&'static str, &'static RatioMap> = phf_map! {
    "cm" => &CM,
    "mm" => &MM,
    "q" => &Q,
    "in" => &IN,
    "pc" => &PC,
    "pt" => &PT,
    "px" => &PX,
};

// Duration ratio, see https://www.w3.org/TR/css-values-4/#time
static MS: RatioMap = phf_map! {
    "ms" => 1.0,
    "s" => 1000.0,
};

static S: RatioMap = phf_map! {
    "ms" => 0.001,
    "s" => 1.0,
};

static DURATION_RATIO: phf::Map<&'static str, &'static RatioMap> = phf_map! {
    "ms" => &MS,
    "s" => &S,
};

// Frequency ratio, see https://www.w3.org/TR/css-values-4/#frequency
static HZ: RatioMap = phf_map! {
    "hz" => 1.0,
    "khz" => 1000.0,
};

static KHZ: RatioMap = phf_map! {
    "hz" => 0.001,
    "khz" => 1.0,
};

static FREQUENCY_RATIO: phf::Map<&'static str, &'static RatioMap> = phf_map! {
    "hz" => &HZ,
    "khz" => &KHZ,
};

// Resolution ratio, see https://www.w3.org/TR/css-values-4/#resolution
// "x" is an alias for "dppx"
static DPI: RatioMap = phf_map! {
    "dpi" => 1.0,
    "dpcm" => 1.0 / 2.54,
    "dppx" => 1.0 / 96.0,
    "x" => 1.0 / 96.0,
};

static DPCM: RatioMap = phf_map! {
    "dpi" => 2.54,
    "dpcm" => 1.0,
    "dppx" => 2.54 / 96.0,
    "x" => 2.54 / 96.0,
};

static DPPX: RatioMap = phf_map! {
    "dpi" => 96.0,
    "dpcm" => 96.0 / 2.54,
    "dppx" => 1.0,
    "x" => 1.0,
};

static RESOLUTION_RATIO: phf::Map<&'static str, &'static RatioMap> = phf_map! {
    "dpi" => &DPI,
    "dpcm" => &DPCM,
    "dppw" => &DPPX,
    "x" => &DPPX,
};

fn get_ratio<'a>(
    ratio_maps: &'a phf::Map<&'static str, &'static RatioMap>,
    unit1: &'a str,
    unit2: &'a str,
) -> Option<&'a f64> {
    if unit1 == unit2 {
        Some(&1.0)
    } else {
        ratio_maps
            .get(unit1)
            .and_then(|ratio_map| ratio_map.get(unit2))
    }
}

pub fn get_duration_ratio<'a>(unit1: &'a str, unit2: &'a str) -> Option<&'a f64> {
    get_ratio(&DURATION_RATIO, unit1, unit2)
}

pub fn get_frequency_ratio<'a>(unit1: &'a str, unit2: &'a str) -> Option<&'a f64> {
    get_ratio(&FREQUENCY_RATIO, unit1, unit2)
}

pub fn get_absolute_length_ratio<'a>(unit1: &'a str, unit2: &'a str) -> Option<&'a f64> {
    get_ratio(&ABSOLUTE_LENGTH_RATIO, unit1, unit2)
}

pub fn get_resolution_ratio<'a>(unit1: &'a str, unit2: &'a str) -> Option<&'a f64> {
    get_ratio(&RESOLUTION_RATIO, unit1, unit2)
}

pub fn is_absolute_length(unit: &str) -> bool {
    ABSOLUTE_LENGTH_RATIO.contains_key(unit)
}
