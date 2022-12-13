use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::{
    Dimension, Ident, MediaFeature, MediaFeatureName, MediaFeaturePlain, MediaFeatureRange,
    MediaFeatureRangeComparison, MediaFeatureRangeInterval, MediaFeatureValue,
};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn get_legacy_media_feature(
        &mut self,
        n: &mut MediaFeature,
    ) -> Option<(MediaFeature, Option<MediaFeature>)> {
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
                        MediaFeatureRangeComparison::Lt | MediaFeatureRangeComparison::Le => {
                            self.get_right_media_feature_name(name)
                        }
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
                            return Some((
                                MediaFeature::Plain(MediaFeaturePlain {
                                    span: *span,
                                    name,
                                    value: Box::new(value),
                                }),
                                None,
                            ));
                        }
                    }
                } else if let MediaFeatureValue::Ident(name) = &right {
                    let name = match comparison {
                        MediaFeatureRangeComparison::Lt | MediaFeatureRangeComparison::Le => {
                            self.get_left_media_feature_name(name)
                        }
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
                            return Some((
                                MediaFeature::Plain(MediaFeaturePlain {
                                    span: *span,
                                    name,
                                    value: Box::new(value),
                                }),
                                None,
                            ));
                        }
                    }
                }
            }
            MediaFeature::RangeInterval(MediaFeatureRangeInterval {
                span,
                left: box left,
                left_comparison,
                name: MediaFeatureName::Ident(name),
                right: box right,
                right_comparison,
                ..
            }) => {
                let first_name = match left_comparison {
                    MediaFeatureRangeComparison::Gt | MediaFeatureRangeComparison::Ge => {
                        self.get_right_media_feature_name(name)
                    }
                    _ => self.get_left_media_feature_name(name),
                };

                if let Some(first_name) = first_name {
                    let value = match left_comparison {
                        MediaFeatureRangeComparison::Lt => self.get_gt_value(left.clone()),
                        MediaFeatureRangeComparison::Gt => self.get_lt_value(right.clone()),
                        _ => Some(left.clone()),
                    };

                    if let Some(value) = value {
                        let left = MediaFeature::Plain(MediaFeaturePlain {
                            span: *span,
                            name: first_name,
                            value: Box::new(value),
                        });

                        let second_name = match right_comparison {
                            MediaFeatureRangeComparison::Gt | MediaFeatureRangeComparison::Ge => {
                                self.get_left_media_feature_name(name)
                            }
                            _ => self.get_right_media_feature_name(name),
                        };

                        if let Some(second_name) = second_name {
                            let value = match left_comparison {
                                MediaFeatureRangeComparison::Lt => self.get_lt_value(right.clone()),
                                MediaFeatureRangeComparison::Gt => self.get_gt_value(right.clone()),
                                _ => Some(right.clone()),
                            };

                            if let Some(value) = value {
                                let right = MediaFeature::Plain(MediaFeaturePlain {
                                    span: *span,
                                    name: second_name,
                                    value: Box::new(value),
                                });

                                return Some((left, Some(right)));
                            }
                        }
                    }
                }
            }
            _ => {}
        }

        None
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
                number.value -= 1.0;
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
            MediaFeatureValue::Ratio(ration) => {
                ration.left.value -= 0.001;
                ration.left.raw = None;

                Some(value)
            }
            _ => None,
        }
    }

    fn get_gt_value(&self, mut value: MediaFeatureValue) -> Option<MediaFeatureValue> {
        match &mut value {
            MediaFeatureValue::Number(number) => {
                number.value += 1.0;
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
            MediaFeatureValue::Ratio(ration) => {
                ration.left.value += 0.001;
                ration.left.raw = None;

                Some(value)
            }
            _ => None,
        }
    }
}
