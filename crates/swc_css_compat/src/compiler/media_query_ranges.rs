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
                left,
                comparison,
                right,
                ..
            }) => {
                if let MediaFeatureValue::Ident(name) = &**left {
                    let name = match comparison {
                        MediaFeatureRangeComparison::Lt | MediaFeatureRangeComparison::Le => {
                            self.get_right_media_feature_name(name)
                        }
                        MediaFeatureRangeComparison::Eq => {
                            Some(MediaFeatureName::Ident(name.clone()))
                        }
                        _ => self.get_left_media_feature_name(name),
                    }?;

                    let original_value = (**right).clone();
                    let value = match comparison {
                        MediaFeatureRangeComparison::Lt => self.get_lt_value(original_value),
                        MediaFeatureRangeComparison::Gt => self.get_gt_value(original_value),
                        _ => Some(original_value),
                    }?;

                    return Some((
                        MediaFeature::Plain(MediaFeaturePlain {
                            span: *span,
                            name,
                            value: Box::new(value),
                        }),
                        None,
                    ));
                } else if let MediaFeatureValue::Ident(name) = &**right {
                    let name = match comparison {
                        MediaFeatureRangeComparison::Lt | MediaFeatureRangeComparison::Le => {
                            self.get_left_media_feature_name(name)
                        }
                        MediaFeatureRangeComparison::Eq => {
                            Some(MediaFeatureName::Ident(name.clone()))
                        }
                        _ => self.get_right_media_feature_name(name),
                    }?;

                    let original_value = (**left).clone();
                    let value = match comparison {
                        MediaFeatureRangeComparison::Lt => self.get_gt_value(original_value),
                        MediaFeatureRangeComparison::Gt => self.get_lt_value(original_value),
                        _ => Some(original_value),
                    }?;

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
            MediaFeature::RangeInterval(MediaFeatureRangeInterval {
                span,
                left,
                left_comparison,
                name: MediaFeatureName::Ident(name),
                right,
                right_comparison,
                ..
            }) => {
                let left_name = match left_comparison {
                    MediaFeatureRangeComparison::Gt | MediaFeatureRangeComparison::Ge => {
                        self.get_right_media_feature_name(name)
                    }
                    _ => self.get_left_media_feature_name(name),
                }?;

                let left_value = match left_comparison {
                    MediaFeatureRangeComparison::Lt => self.get_gt_value((**left).clone()),
                    MediaFeatureRangeComparison::Gt => self.get_lt_value((**left).clone()),
                    _ => Some((**left).clone()),
                }?;

                let left = MediaFeature::Plain(MediaFeaturePlain {
                    span: *span,
                    name: left_name,
                    value: Box::new(left_value),
                });

                let right_name = match right_comparison {
                    MediaFeatureRangeComparison::Gt | MediaFeatureRangeComparison::Ge => {
                        self.get_left_media_feature_name(name)
                    }
                    _ => self.get_right_media_feature_name(name),
                }?;

                let right_value = match right_comparison {
                    MediaFeatureRangeComparison::Lt => self.get_lt_value((**right).clone()),
                    MediaFeatureRangeComparison::Gt => self.get_gt_value((**right).clone()),
                    _ => Some((**right).clone()),
                }?;

                let right = MediaFeature::Plain(MediaFeaturePlain {
                    span: *span,
                    name: right_name,
                    value: Box::new(right_value),
                });

                return Some((left, Some(right)));
            }
            _ => {}
        }

        None
    }

    fn get_left_media_feature_name(&self, name: &Ident) -> Option<MediaFeatureName> {
        let value = match &*name.value {
            "width" => "min-width",
            "height" => "min-height",
            "device-width" => "min-device-width",
            "device-height" => "min-device-height",
            "aspect-ratio" => "min-aspect-ratio",
            "device-aspect-ratio" => "min-device-aspect-ratio",
            "color" => "min-color",
            "color-index" => "min-color-index",
            "monochrome" => "min-monochrome",
            "resolution" => "min-resolution",
            _ => return None,
        };

        Some(MediaFeatureName::Ident(Ident {
            span: DUMMY_SP,
            value: value.into(),
            raw: None,
        }))
    }

    fn get_right_media_feature_name(&self, name: &Ident) -> Option<MediaFeatureName> {
        let value = match &*name.value {
            "width" => "max-width",
            "height" => "max-height",
            "device-width" => "max-device-width",
            "device-height" => "max-device-height",
            "aspect-ratio" => "max-aspect-ratio",
            "device-aspect-ratio" => "max-device-aspect-ratio",
            "color" => "max-color",
            "color-index" => "max-color-index",
            "monochrome" => "max-monochrome",
            "resolution" => "max-resolution",
            _ => return None,
        };

        Some(MediaFeatureName::Ident(Ident {
            span: DUMMY_SP,
            value: value.into(),
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
