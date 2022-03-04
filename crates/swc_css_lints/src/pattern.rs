use regex::Regex;

#[derive(Debug)]
pub(crate) enum NamePattern {
    Str(String),
    Regex(Regex),
}

impl NamePattern {
    pub(crate) fn is_match<S>(&self, name: S) -> bool
    where
        S: AsRef<str>,
    {
        let name = name.as_ref();
        match self {
            Self::Str(s) => s == name,
            Self::Regex(regex) => regex.is_match(name),
        }
    }
}

impl TryFrom<String> for NamePattern {
    type Error = regex::Error;

    fn try_from(pattern: String) -> Result<Self, Self::Error> {
        if let Some(pattern) = pattern
            .strip_prefix('/')
            .and_then(|pattern| pattern.strip_suffix('/'))
        {
            Regex::new(pattern).map(Self::Regex)
        } else {
            Ok(Self::Str(pattern))
        }
    }
}

impl Default for NamePattern {
    fn default() -> Self {
        Self::Str(String::new())
    }
}
