#[test]
fn flex_box() {
    t("display:block;", "display:block;");
    t(
        "display:flex!important;",
        "`display:-webkit-box!important;`, `display:-webkit-flex!important;`, \
         `display:-ms-flexbox!important;`, `display:flex!important;`",
    );
    t(
        "display:inline-flex;",
        "`display:-webkit-inline-box;`, `display:-webkit-inline-flex;`, \
         `display:-ms-inline-flexbox;`, `display:inline-flex;`",
    );

    t(
        "flex:inherit;",
        "`-webkit-flex:inherit;`, `-ms-flex:inherit;`, `flex:inherit;`",
    );

    t(
        "flex-grow:none;",
        "`-webkit-box-flex:none;`, `-webkit-flex-grow:none;`, `-ms-flex-positive:none;`, \
         `flex-grow:none;`",
    );

    t(
        "flex-shrink:none;",
        "`-webkit-flex-shrink:none;`, `-ms-flex-negative:none;`, `flex-shrink:none;`",
    );

    t(
        "flex-basis:none;",
        "`-webkit-flex-basis:none;`, `-ms-flex-preferred-size:none;`, `flex-basis:none;`",
    );

    t(
        "align-self:value;",
        "`-webkit-align-self:value;`, `-ms-flex-item-align:value;`, `align-self:value;`",
    );

    t(
        "align-self:flex-start;",
        "`-webkit-align-self:flex-start;`, `-ms-flex-item-align:flex-start;`, \
         `align-self:flex-start;`",
    );

    t(
        "align-self:flex-end;",
        "`-webkit-align-self:flex-end;`, `-ms-flex-item-align:flex-end;`, `align-self:flex-end;`",
    );

    t(
        "align-content:value;",
        "`-webkit-align-content:value;`, `-ms-flex-line-pack:value;`, `align-content:value;`",
    );

    t(
        "align-content:flex-start;",
        "`-webkit-align-content:flex-start;`, `-ms-flex-line-pack:flex-start;`, \
         `align-content:flex-start;`",
    );

    t("", "");
}

/// Test
fn t(src: &str, expected: &str) {}
