import b from "styled-jsx/style";
const a = ({ right: a = false , top: d = false , sidebar: f , sidebarWidth: c = 230 , hideOnMobile: g = false , breakpoint: e = 730 , children: h ,  })=>React.createElement("main", {
        className: b.dynamic([
            [
                "4507deac72c40d6c",
                [
                    a ? "row-reverse" : "row",
                    c,
                    e,
                    d ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, React.createElement(Sidebar, {
        width: c,
        right: a,
        hide: g,
        breakpoint: e
    }, f), React.createElement("div", {
        className: b.dynamic([
            [
                "4507deac72c40d6c",
                [
                    a ? "row-reverse" : "row",
                    c,
                    e,
                    d ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, h), React.createElement(b, {
        id: "4507deac72c40d6c",
        dynamic: [
            a ? "row-reverse" : "row",
            c,
            e,
            d ? "column" : "column-reverse", 
        ]
    }, `main.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-direction:${a ? "row-reverse" : "row"};-ms-flex-direction:${a ? "row-reverse" : "row"};flex-direction:${a ? "row-reverse" : "row"};-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin-bottom:var(--geist-gap-double)}div.__jsx-style-dynamic-selector{width:100%;max-width:-webkit-calc(100% - ${c}px - var(--geist-gap-double));max-width:-moz-calc(100% - ${c}px - var(--geist-gap-double));max-width:calc(100% - ${c}px - var(--geist-gap-double))}@media(max-width:${e}px){main.__jsx-style-dynamic-selector{-webkit-flex-direction:${d ? "column" : "column-reverse"};-ms-flex-direction:${d ? "column" : "column-reverse"};flex-direction:${d ? "column" : "column-reverse"}}div.__jsx-style-dynamic-selector{max-width:unset}}`));
a({});
