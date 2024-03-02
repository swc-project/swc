use swc_common::Spanned;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_transform_function(&self, component_value: &mut ComponentValue) {
        match component_value {
            ComponentValue::Function(function)
                if function.name == "translate" && function.value.len() == 3 =>
            {
                match (function.value.first(), function.value.get(2)) {
                    (Some(first), Some(ComponentValue::Integer(second))) if second.value == 0 => {
                        function.value = vec![first.clone()];
                    }
                    (Some(ComponentValue::Integer(first)), Some(second)) if first.value == 0 => {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "translatey".into(),
                            raw: None,
                        });
                        function.value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "translate3d" && function.value.len() == 5 =>
            {
                match (
                    function.value.first(),
                    function.value.get(2),
                    function.value.get(4),
                ) {
                    (
                        Some(ComponentValue::Integer(first)),
                        Some(ComponentValue::Integer(second)),
                        Some(third),
                    ) if first.value == 0 && second.value == 0 => {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "translatez".into(),
                            raw: None,
                        });
                        function.value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "scale" && function.value.len() == 3 =>
            {
                match (function.value.first(), function.value.get(2)) {
                    (
                        Some(first @ ComponentValue::Integer(first_number)),
                        Some(ComponentValue::Integer(second_number)),
                    ) if first_number.value == second_number.value => {
                        function.value = vec![first.clone()];
                    }
                    (Some(first), Some(ComponentValue::Integer(second_number)))
                        if second_number.value == 1 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "scalex".into(),
                            raw: None,
                        });
                        function.value = vec![first.clone()];
                    }
                    (Some(ComponentValue::Integer(first_number)), Some(second))
                        if first_number.value == 1 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "scaley".into(),
                            raw: None,
                        });
                        function.value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "scale3d" && function.value.len() == 5 =>
            {
                match (
                    function.value.first(),
                    function.value.get(2),
                    function.value.get(4),
                ) {
                    (
                        Some(first),
                        Some(ComponentValue::Integer(second_number)),
                        Some(ComponentValue::Integer(third_number)),
                    ) if second_number.value == 1 && third_number.value == 1 => {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "scalex".into(),
                            raw: None,
                        });
                        function.value = vec![first.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(first_number)),
                        Some(second),
                        Some(ComponentValue::Integer(third_number)),
                    ) if first_number.value == 1 && third_number.value == 1 => {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "scaley".into(),
                            raw: None,
                        });
                        function.value = vec![second.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(first_number)),
                        Some(ComponentValue::Integer(second_number)),
                        Some(third),
                    ) if first_number.value == 1 && second_number.value == 1 => {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "scalez".into(),
                            raw: None,
                        });
                        function.value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "matrix3d" && function.value.len() == 31 =>
            {
                match (
                    function.value.first(),
                    function.value.get(1),
                    function.value.get(2),
                    function.value.get(3),
                    function.value.get(4),
                    function.value.get(6),
                    function.value.get(8),
                    function.value.get(9),
                    function.value.get(10),
                    function.value.get(11),
                    function.value.get(12),
                    function.value.get(14),
                    function.value.get(16),
                    function.value.get(18),
                    function.value.get(20),
                    function.value.get(22),
                    function.value.get(24),
                    function.value.get(25),
                    function.value.get(26),
                    function.value.get(28),
                    function.value.get(30),
                ) {
                    (
                        Some(first),
                        Some(first_comma),
                        Some(second),
                        Some(second_comma),
                        Some(ComponentValue::Integer(third_number)),
                        Some(ComponentValue::Integer(fourth_number)),
                        Some(fifth),
                        Some(fifth_comma),
                        Some(sixth),
                        Some(sixth_comma),
                        Some(ComponentValue::Integer(seventh_number)),
                        Some(ComponentValue::Integer(eighth_number)),
                        Some(ComponentValue::Integer(ninth_number)),
                        Some(ComponentValue::Integer(tenth_number)),
                        Some(ComponentValue::Integer(eleventh_number)),
                        Some(ComponentValue::Integer(twelfth_number)),
                        Some(thirteenth),
                        Some(thirteenth_comma),
                        Some(fourteenth),
                        Some(ComponentValue::Integer(fifteenth_number)),
                        Some(ComponentValue::Integer(sixteenth_number)),
                    ) if third_number.value == 0
                        && fourth_number.value == 0
                        && seventh_number.value == 0
                        && eighth_number.value == 0
                        && ninth_number.value == 0
                        && tenth_number.value == 0
                        && eleventh_number.value == 1
                        && twelfth_number.value == 0
                        && fifteenth_number.value == 0
                        && sixteenth_number.value == 1 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "matrix".into(),
                            raw: None,
                        });
                        function.value = vec![
                            first.clone(),
                            first_comma.clone(),
                            second.clone(),
                            second_comma.clone(),
                            fifth.clone(),
                            fifth_comma.clone(),
                            sixth.clone(),
                            sixth_comma.clone(),
                            thirteenth.clone(),
                            thirteenth_comma.clone(),
                            fourteenth.clone(),
                        ];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "rotate3d" && function.value.len() == 7 =>
            {
                match (
                    function.value.first(),
                    function.value.get(2),
                    function.value.get(4),
                    function.value.get(6),
                ) {
                    (
                        Some(ComponentValue::Integer(first_number)),
                        Some(ComponentValue::Integer(second_number)),
                        Some(ComponentValue::Integer(third_number)),
                        Some(fourth_value),
                    ) if first_number.value == 1
                        && second_number.value == 0
                        && third_number.value == 0 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "rotatex".into(),
                            raw: None,
                        });
                        function.value = vec![fourth_value.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(first_number)),
                        Some(ComponentValue::Integer(second_number)),
                        Some(ComponentValue::Integer(third_number)),
                        Some(fourth_value),
                    ) if first_number.value == 0
                        && second_number.value == 1
                        && third_number.value == 0 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "rotatey".into(),
                            raw: None,
                        });
                        function.value = vec![fourth_value.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(first_number)),
                        Some(ComponentValue::Integer(second_number)),
                        Some(ComponentValue::Integer(third_number)),
                        Some(fourth_value),
                    ) if first_number.value == 0
                        && second_number.value == 0
                        && third_number.value == 1 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "rotate".into(),
                            raw: None,
                        });
                        function.value = vec![fourth_value.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(function)
                if function.name == "rotatez" && function.value.len() == 1 =>
            {
                function.name = FunctionName::Ident(Ident {
                    span: function.name.span(),
                    value: "rotate".into(),
                    raw: None,
                });
            }

            ComponentValue::Function(function)
                if function.name == "skew" && function.value.len() == 3 =>
            {
                match (function.value.first(), function.value.get(2)) {
                    (Some(first), Some(ComponentValue::Integer(second_number)))
                        if second_number.value == 0 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "skewx".into(),
                            raw: None,
                        });
                        function.value = vec![first.clone()];
                    }

                    (Some(ComponentValue::Integer(first_number)), Some(second))
                        if first_number.value == 0 =>
                    {
                        function.name = FunctionName::Ident(Ident {
                            span: function.name.span(),
                            value: "skewy".into(),
                            raw: None,
                        });
                        function.value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
