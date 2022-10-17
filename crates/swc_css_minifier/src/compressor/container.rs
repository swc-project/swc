use swc_css_ast::*;

use super::Compressor;
use crate::compressor::math::{is_calc_function_name, transform_calc_value_into_component_value};

impl Compressor {
    pub(super) fn compress_calc_sum_in_size_feature_value(&mut self, n: &mut SizeFeatureValue) {
        match n {
            SizeFeatureValue::Function(Function { name, value, .. })
                if is_calc_function_name(name) && value.len() == 1 =>
            {
                match &value[0] {
                    ComponentValue::CalcSum(CalcSum {
                        expressions: calc_sum_expressions,
                        ..
                    }) if calc_sum_expressions.len() == 1 => match &calc_sum_expressions[0] {
                        CalcProductOrOperator::Product(CalcProduct {
                            expressions: calc_product_expressions,
                            ..
                        }) if calc_product_expressions.len() == 1 => {
                            if let CalcValueOrOperator::Value(calc_value) =
                                &calc_product_expressions[0]
                            {
                                match transform_calc_value_into_component_value(calc_value) {
                                    Some(ComponentValue::Function(function)) => {
                                        *n = SizeFeatureValue::Function(function);
                                    }
                                    Some(ComponentValue::Dimension(dimension)) => {
                                        *n = SizeFeatureValue::Dimension(dimension);
                                    }
                                    Some(ComponentValue::Number(number)) => {
                                        *n = SizeFeatureValue::Number(number);
                                    }
                                    _ => {}
                                }
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
            _ => {}
        }
    }

    pub(super) fn compress_size_feature_value_length(&mut self, n: &mut SizeFeatureValue) {
        if let SizeFeatureValue::Dimension(dimension) = n {
            if let Some(number) = self.length_to_zero(dimension) {
                *n = SizeFeatureValue::Number(number)
            }
        }
    }
}
