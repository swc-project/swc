//! Test cases adapted verbatim from the rsass issue tracker
//! https://github.com/kaj/rsass/issues?q=is%3Aissue

#[macro_use]
mod grass_macros;

test!(
    /// https://github.com/kaj/rsass/issues/41
    issue_41,
    "@function str-replace($string, $search, $replace: \"\") {
      $index: str-index($string, $search);
    
      @if $index {
        @return str-slice($string, 1, $index - 1)+$replace+str-replace(str-slice($string, $index + \
     str-length($search)), $search, $replace);
      }
    
      @return $index;
    }
    
    $x: str-replace(url(\"a#b#c\"), \"#\", \":\");
    
    a {
      color: $x;
    }",
    "a {\n  color: url(\"a:b:;\n}\n"
);
