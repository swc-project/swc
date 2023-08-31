use rustc_hash::FxHashMap;

pub(crate) type ObjectMap<T> = FxHashMap<&'static str, T>;
pub(crate) type ObjectMap2<V> = ObjectMap<ObjectMap<V>>;

pub(crate) fn descriptor(
    pure: Option<&'static str>,
    global: &'static [&'static str],
    name: Option<&'static str>,
    exclude: &'static [&'static str],
) -> CoreJSPolyfillDescriptor {
    let name = name.unwrap_or_else(|| global[0]);

    CoreJSPolyfillDescriptor {
        pure,
        global,
        name,
        exclude,
    }
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct CoreJSPolyfillDescriptor {
    pub pure: Option<&'static str>,
    pub global: &'static [&'static str],
    pub name: &'static str,
    pub exclude: &'static [&'static str],
}

macro_rules! val {
    (& $v:expr) => {
        &$v
    };
    ($v:expr) => {
        &$v
    };
}

macro_rules! expand_array_like {
    ($name:ident) => {{
        $name
    }};
    ($lit:literal) => {{
        [$lit]
    }};

    // An array with a single item
    ([$first:tt]) => {{
        expand_array_like!($first)
    }};

    ([$($tt:tt)*]) => {{
        expand_array_like!(@ARRAY, All(&[]), Wip(), Rest($($tt)*))
    }};

    // Eat string literal as much as we can, and create a single array literal from them.
    (@ARRAY, All($all:expr), Wip($($s:literal)*), Rest($first:literal, $($rest:tt)*)) => {{
        expand_array_like!(@ARRAY, All($all), Wip($($s)* $first), Rest($($rest)*))
    }};

    (@ARRAY, All($all:expr), Wip($($s:literal)*), Rest($first:literal)) => {{
        expand_array_like!(@ARRAY, All($all), Wip($($s)* $first), Rest())
    }};

    // We need to stop eating string literals.
    (@ARRAY, All($all:expr), Wip($($s:literal)*), Rest($first:ident, $($rest:tt)*)) => {{
        static PREV: &[&str]= &[$($s),*];

        dynamic_concat($all, dynamic_concat(PREV, $first))
    }};

    (@ARRAY, All($all:expr), Wip($($s:literal)*), Rest($first:ident)) => {{
        static PREV: &[&str]= &[$($s),*];

        dynamic_concat($all, dynamic_concat(PREV, $first))
    }};


    // Done
    (@ARRAY, All($all:expr), Wip($($s:literal)*), Rest()) => {{
        static CUR_LIT: &[&str]= &[$($s),*];

        dynamic_concat($all, CUR_LIT)
    }};
}

/// Calls [`descriptor`].
macro_rules! define_descriptor {

    (
        $pure:literal,
        [$($global:tt)*]
    ) => {{
        define_descriptor!(@Done, Some($pure), &expand_array_like!([$($global)*]), None, &[])
    }};

    (
        null,
        [$($global:tt)*]
    ) => {{
        define_descriptor!(@Done, None, &expand_array_like!([$($global)*]), None, &[])
    }};


    (
        null,
        $global:ident
    ) => {{
        define_descriptor!(@Done, None, &expand_array_like!($global), None, &[])
    }};

    (
        $pure:literal,
        $global:ident
    ) => {{
        define_descriptor!(@Done, Some($pure), &expand_array_like!($global), None, &[])
    }};

    (
        $pure:literal,
        $global:ident,
        $first:tt
    ) => {{
        define_descriptor!(@Done, Some($pure), &expand_array_like!($($global)*), Some($first), &[])
    }};


    (
        $pure:literal,
        [$($global:tt)*],
        $first:literal
    ) => {{
        define_descriptor!(@Done, Some($pure), &expand_array_like!([$($global)*]), Some($first), &[])
    }};

    (
        $pure:literal,
        [$($global:tt)*],
        None,
        $exclude:tt
    ) => {{
        define_descriptor!(@Done, Some($pure), &expand_array_like!([$($global)*]), None, &$exclude)
    }};

    // @Indirect: No need to distinguish `$pure`.
    (
        @Done,
        $pure:expr,
        $global:expr,
        $name:expr,
        $exclude:expr
    ) => {{
        $crate::util::descriptor($pure, $global, $name, $exclude)
    }};
}

macro_rules! lazy_map {
    ($($tt:tt)*) => {{
        Lazy::new(|| map!($($tt)*))
    }};
}

macro_rules! map {
    (
        Map {
            $($rest:tt)+
        }
    ) => {{
        map!(@Key, Map {}, Rest {$($rest)*})
    }};

    (
        @Key,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $ni:ident : $($rest:tt)+
        }
    ) => {{
        map!(
            @Value,
            Map {
                $(
                    $i : $e,
                )*
            },
            Rest {
                $($rest)*
            },
            Wip {
                $ni
            }
        )
    }};

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            [$($v:tt)*], $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(@Key, Map {
            $(
                $i : $e,
            )*
            $ni : val!(&[$($v)*]),
        }, Rest {$($rest)*})
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            &[$($v:tt)*], $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(@Key, Map {
            $(
                $i : $e,
            )*
            $ni : val!(&[$($v)*]),
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:literal, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(@Key, Map {
            $(
                $i : $e,
            )*
            $ni : &[$v],
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:literal $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(@Key, Map {
            $(
                $i : $e,
            )*
            $ni : &[$v],
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            &$v:ident, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(@Key, Map {
            $(
                $i : $e,
            )*
            $ni : $v,
        },
        Rest {
            $($rest)*
        })
    };


    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            Map { $($m:tt)* }, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(
            @Key,
            Map {
                $(
                    $i : $e,
                )*
                $ni : map!(Map { $($m)* }),
            },
            Rest {
                $($rest)*
            }
        )
    };


    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:ident, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(
            @Key,
            Map {
                $(
                    $i : $e,
                )*
                $ni : $v,
            },
            Rest {
                $($rest)*
            }
        )
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            *$v:ident, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(
            @Key,
            Map {
                $(
                    $i : $e,
                )*
                $ni : (*$v).clone(),
            },
            Rest {
                $($rest)*
            }
        )
    };


    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            define($($args:tt)*), $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(
            @Key,
            Map {
                $(
                    $i : $e,
                )*
                $ni : define_descriptor!($($args)*),
            },
            Rest {
                $($rest)*
            }
        )
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $callee:ident($($args:tt)*), $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        map!(
            @Key,
            Map {
                $(
                    $i : $e,
                )*
                $ni : $callee($($args)*),
            },
            Rest {
                $($rest)*
            }
        )
    };


    // Done
    (
        @Key,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {}
    ) => {{
        let mut map = ObjectMap::default();

        $(
            map.insert(stringify!($i), $e);
        )*

        map
    }};
}

macro_rules! data_map {
    (
        Map {
            $($rest:tt)+
        }
    ) => {
        data_map!(@Ident, Map {}, Rest {$($rest)*})
    };

    (
        @Ident,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $ni:ident : $($rest:tt)+
        }
    ) => {
        data_map!(@Value, Map {
            $(
                $i : $e,
            )*
        },
        Rest {
            $($rest)*
        },
        Wip {
            $ni
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            [$($v:tt)*], $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : val!(&[$($v)*]),
        }, Rest {$($rest)*})
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            &[$($v:tt)*], $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : val!(&[$($v)*]),
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:literal, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : &[$v],
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:literal $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : &[$v],
        },
        Rest {
            $($rest)*
        })
    };

    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            &$v:ident, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : $v,
        },
        Rest {
            $($rest)*
        })
    };


    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            Map { $($m:tt)* }, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : data_map!(Map { $($m)* }),
        },
        Rest {
            $($rest)*
        })
    };


    (
        @Value,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {
            $v:ident, $($rest:tt)*
        },
        Wip {
            $ni:ident
        }
    ) => {
        data_map!(@Ident, Map {
            $(
                $i : $e,
            )*
            $ni : $v,
        },
        Rest {
            $($rest)*
        })
    };

    // Done
    (
        @Ident,
        Map {
            $($i:ident : $e:expr,)*
        },
        Rest {}
    ) => {
        &[
            $(
                (stringify!($i), $e)
            ),*
        ]
    };
}

pub(crate) type DataMap<T> = &'static [(&'static str, T)];
pub(crate) type FeatureMap = DataMap<&'static [&'static str]>;

pub(crate) trait DataMapExt<T> {
    fn as_ref(&self) -> DataMap<T>;

    fn get_data(&self, s: &str) -> Option<&'static T> {
        for (k, v) in self.as_ref() {
            if *k == s {
                return Some(v);
            }
        }

        None
    }
}

impl<T> DataMapExt<T> for DataMap<T> {
    fn as_ref(&self) -> &'static [(&'static str, T)] {
        self
    }
}
