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
                    }) if calc_sum_expressions.len() == 1 => {
                        match &calc_sum_expressions[0] {
                            CalcProductOrOperator::Product(CalcProduct {
                                expressions: calc_product_expressions,
                                ..
                            }) if calc_product_expressions.len() == 1 => {
                                match &calc_product_expressions[0] {
                                    CalcValueOrOperator::Value(CalcValue::Sum(_)) => {
                                        // Do nothing, we cannot transform a
                                        // CalcSum into a ComponentValue
                                    }
                                    CalcValueOrOperator::Value(CalcValue::Constant(_)) => {
                                        // https://www.w3.org/TR/css-values-4/#calc-constants
                                        // "These keywords are only usable
                                        // within a calculation"
                                        // "If used outside of a calculation,
                                        // they’re treated like any other
                                        // keyword"
                                    }
                                    CalcValueOrOperator::Value(calc_value) => {
                                        match transform_calc_value_into_component_value(calc_value)
                                        {
                                            ComponentValue::Function(function) => {
                                                *n = SizeFeatureValue::Function(function);
                                            }
                                            ComponentValue::Dimension(dimension) => {
                                                *n = SizeFeatureValue::Dimension(dimension);
                                            }
                                            ComponentValue::Number(number) => {
                                                *n = SizeFeatureValue::Number(number);
                                            }
                                            _ => {}
                                        }
                                    }
                                    _ => {}
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
