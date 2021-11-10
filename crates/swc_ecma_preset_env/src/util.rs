macro_rules! val {
    (& $v:expr) => {
        &$v
    };
    ($v:expr) => {
        &$v
    };
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
