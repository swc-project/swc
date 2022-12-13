use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::{
    Dimension, Ident, MediaFeature, MediaFeatureName, MediaFeaturePlain, MediaFeatureRange,
    MediaFeatureRangeComparison, MediaFeatureValue,
};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_media_feature(&mut self, n: &mut MediaFeature) {
        match n {
            MediaFeature::Range(MediaFeatureRange {
                span,
                left: box left,
                comparison,
                right: box right,
                ..
            }) => {
                if let MediaFeatureValue::Ident(name) = &left {
                    let name = match comparison {
                        MediaFeatureRangeComparison::Eq => {
                            Some(MediaFeatureName::Ident(name.clone()))
                        }
                        _ => self.get_left_media_feature_name(name),
                    };

                    if let Some(name) = name {
                        let original_value = right.clone();

                        let value = match comparison {
                            MediaFeatureRangeComparison::Lt => self.get_lt_value(original_value),
                            MediaFeatureRangeComparison::Gt => self.get_gt_value(original_value),
                            _ => Some(original_value),
                        };

                        if let Some(value) = value {
                            *n = MediaFeature::Plain(MediaFeaturePlain {
                                span: *span,
                                name,
                                value: Box::new(value),
                            });
                        }
                    }
                } else if let MediaFeatureValue::Ident(name) = &right {
                    let name = match comparison {
                        MediaFeatureRangeComparison::Eq => {
                            Some(MediaFeatureName::Ident(name.clone()))
                        }
                        _ => self.get_right_media_feature_name(name),
                    };

                    if let Some(name) = name {
                        let original_value = left.clone();

                        let value = match comparison {
                            MediaFeatureRangeComparison::Lt => self.get_gt_value(original_value),
                            MediaFeatureRangeComparison::Gt => self.get_lt_value(original_value),
                            _ => Some(original_value),
                        };

                        if let Some(value) = value {
                            *n = MediaFeature::Plain(MediaFeaturePlain {
                                span: *span,
                                name,
                                value: Box::new(value),
                            });
                        }
                    }
                }
            }
            _ => {}
        }
    }

    fn get_left_media_feature_name(&self, name: &Ident) -> Option<MediaFeatureName> {
        let value = match name.value {
            js_word!("width") => js_word!("min-width"),
            js_word!("height") => js_word!("min-height"),
            js_word!("device-width") => js_word!("min-device-width"),
            js_word!("device-height") => js_word!("min-device-height"),
            js_word!("aspect-ratio") => js_word!("min-aspect-ratio"),
            js_word!("device-aspect-ratio") => js_word!("min-device-aspect-ratio"),
            js_word!("color") => js_word!("min-color"),
            js_word!("color-index") => js_word!("min-color-index"),
            js_word!("monochrome") => js_word!("min-monochrome"),
            js_word!("resolution") => js_word!("min-resolution"),
            _ => return None,
        };

        Some(MediaFeatureName::Ident(Ident {
            span: DUMMY_SP,
            value,
            raw: None,
        }))
    }

    fn get_right_media_feature_name(&self, name: &Ident) -> Option<MediaFeatureName> {
        let value = match name.value {
            js_word!("width") => js_word!("max-width"),
            js_word!("height") => js_word!("max-height"),
            js_word!("device-width") => js_word!("max-device-width"),
            js_word!("device-height") => js_word!("max-device-height"),
            js_word!("aspect-ratio") => js_word!("max-aspect-ratio"),
            js_word!("device-aspect-ratio") => js_word!("max-device-aspect-ratio"),
            js_word!("color") => js_word!("max-color"),
            js_word!("color-index") => js_word!("max-color-index"),
            js_word!("monochrome") => js_word!("max-monochrome"),
            js_word!("resolution") => js_word!("max-resolution"),
            _ => return None,
        };

        Some(MediaFeatureName::Ident(Ident {
            span: DUMMY_SP,
            value,
            raw: None,
        }))
    }

    fn get_lt_value(&self, mut value: MediaFeatureValue) -> Option<MediaFeatureValue> {
        match &mut value {
            MediaFeatureValue::Number(number) => {
                number.value -= 0.001;
                number.raw = None;

                Some(value)
            }
            MediaFeatureValue::Dimension(dimension) => {
                match dimension {
                    Dimension::Length(length) => {
                        length.value.value -= 0.001;
                        length.value.raw = None;
                    }
                    _ => {
                        return None;
                    }
                }

                Some(value)
            }
            _ => None,
        }
    }

    fn get_gt_value(&self, mut value: MediaFeatureValue) -> Option<MediaFeatureValue> {
        match &mut value {
            MediaFeatureValue::Number(number) => {
                number.value += 0.001;
                number.raw = None;

                Some(value)
            }
            MediaFeatureValue::Dimension(dimension) => {
                match dimension {
                    Dimension::Length(length) => {
                        length.value.value += 0.001;
                        length.value.raw = None;
                    }
                    _ => {
                        return None;
                    }
                }

                Some(value)
            }
            _ => None,
        }
    }
}
