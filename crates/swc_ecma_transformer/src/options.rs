//! Configuration options for the transformer.

use bitflags::bitflags;

bitflags! {
    /// Options to control which transform passes are enabled.
    ///
    /// This allows fine-grained control over which transformations are applied
    /// to the AST. Each flag represents a specific transform pass or category
    /// of transforms.
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
    pub struct TransformOptions: u32 {
        /// Enable all transforms.
        const ALL = u32::MAX;

        /// Enable ES2015 transforms.
        const ES2015 = 1 << 0;

        /// Enable ES2016 transforms.
        const ES2016 = 1 << 1;

        /// Enable ES2017 transforms.
        const ES2017 = 1 << 2;

        /// Enable ES2018 transforms.
        const ES2018 = 1 << 3;

        /// Enable ES2019 transforms.
        const ES2019 = 1 << 4;

        /// Enable ES2020 transforms.
        const ES2020 = 1 << 5;

        /// Enable ES2021 transforms.
        const ES2021 = 1 << 6;

        /// Enable ES2022 transforms.
        const ES2022 = 1 << 7;

        /// Enable TypeScript transforms.
        const TYPESCRIPT = 1 << 8;

        /// Enable JSX/React transforms.
        const REACT = 1 << 9;

        /// Enable optimization transforms.
        const OPTIMIZATION = 1 << 10;
    }
}

impl Default for TransformOptions {
    /// Returns the default transform options.
    ///
    /// By default, no transforms are enabled. Users should explicitly
    /// enable the transforms they need.
    fn default() -> Self {
        Self::empty()
    }
}

impl TransformOptions {
    /// Creates a new `TransformOptions` with no transforms enabled.
    pub fn new() -> Self {
        Self::empty()
    }

    /// Checks if ES2015 transforms are enabled.
    pub fn es2015(&self) -> bool {
        self.contains(Self::ES2015)
    }

    /// Checks if ES2016 transforms are enabled.
    pub fn es2016(&self) -> bool {
        self.contains(Self::ES2016)
    }

    /// Checks if ES2017 transforms are enabled.
    pub fn es2017(&self) -> bool {
        self.contains(Self::ES2017)
    }

    /// Checks if ES2018 transforms are enabled.
    pub fn es2018(&self) -> bool {
        self.contains(Self::ES2018)
    }

    /// Checks if ES2019 transforms are enabled.
    pub fn es2019(&self) -> bool {
        self.contains(Self::ES2019)
    }

    /// Checks if ES2020 transforms are enabled.
    pub fn es2020(&self) -> bool {
        self.contains(Self::ES2020)
    }

    /// Checks if ES2021 transforms are enabled.
    pub fn es2021(&self) -> bool {
        self.contains(Self::ES2021)
    }

    /// Checks if ES2022 transforms are enabled.
    pub fn es2022(&self) -> bool {
        self.contains(Self::ES2022)
    }

    /// Checks if TypeScript transforms are enabled.
    pub fn typescript(&self) -> bool {
        self.contains(Self::TYPESCRIPT)
    }

    /// Checks if React transforms are enabled.
    pub fn react(&self) -> bool {
        self.contains(Self::REACT)
    }

    /// Checks if optimization transforms are enabled.
    pub fn optimization(&self) -> bool {
        self.contains(Self::OPTIMIZATION)
    }
}
