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

    t(
        "align-content:flex-end;",
        "`-webkit-align-content:flex-end;`, `-ms-flex-line-pack:flex-end;`, \
         `align-content:flex-end;`",
    );

    t(
        "align-items:value;",
        "`-webkit-align-items:value;`, `-webkit-box-align:value;`, `-ms-flex-align:value;`, \
         `align-items:value;`",
    );

    t(
        "justify-content:flex-end;",
        "`-webkit-box-pack:end;`, `-ms-flex-pack:end;`, `-webkit-justify-content:flex-end;`, \
         `justify-content:flex-end;`",
    );

    t(
        "justify-content:flex-start;",
        "`-webkit-box-pack:start;`, `-ms-flex-pack:start;`, \
         `-webkit-justify-content:flex-start;`, `justify-content:flex-start;`",
    );

    t(
        "justify-content:justify;",
        "`-webkit-box-pack:justify;`, `-ms-flex-pack:justify;`, \
         `-webkit-justify-content:justify;`, `justify-content:justify;`",
    );

    t(
        "justify-content:space-between;",
        "`-webkit-box-pack:justify;`, `-webkit-justify-content:space-between;`, \
         `justify-content:space-between;`",
    );

    t("justify-items:center;", "`justify-items:center;`");

    t(
        "order:flex;",
        "`-webkit-order:flex;`, `-ms-flex-order:flex;`, `order:flex;`",
    );

    t(
        "flex-direction:column;",
        "`-webkit-flex-direction:column;`, `-ms-flex-direction:column;`, `flex-direction:column;`",
    );
}

#[test]
fn transform() {
    t(
        "transform:rotate(30deg);",
        "`-webkit-transform:rotate(30deg);`, `-moz-transform:rotate(30deg);`, \
         `-ms-transform:rotate(30deg);`, `transform:rotate(30deg);`",
    );
}

#[test]
fn cursor() {
    t("cursor:none;", "`cursor:none;`");

    t("cursor:grab;", "`cursor:-webkit-grab;`, `cursor:grab;`");

    t(
        "cursor:image-set(url(foo.jpg) 2x), pointer;",
        "`cursor:-webkit-image-set(url(foo.jpg) 2x), pointer;`, `cursor:image-set(url(foo.jpg) \
         2x), pointer;`",
    );

    t(
        "cursor:image-set(url(foo.jpg) 2x), grab;",
        "`cursor:-webkit-image-set(url(foo.jpg) 2x), -webkit-grab;`, \
         `cursor:image-set(url(foo.jpg) 2x), grab;`",
    );
}

/// Test
fn t(src: &str, expected: &str) {}
