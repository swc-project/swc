import a from "styled-jsx/style";
const b = ({ right: b = false , top: c = false , sidebar: d , sidebarWidth: e = 230 , hideOnMobile: f = false , breakpoint: g = 730 , children: h ,  })=>React.createElement("main", {
        className: a.dynamic([
            [
                "4507deac72c40d6c",
                [
                    b ? "row-reverse" : "row",
                    e,
                    g,
                    c ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, React.createElement(Sidebar, {
        width: e,
        right: b,
        hide: f,
        breakpoint: g
    }, d), React.createElement("div", {
        className: a.dynamic([
            [
                "4507deac72c40d6c",
                [
                    b ? "row-reverse" : "row",
                    e,
                    g,
                    c ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, h), React.createElement(a, {
        id: "4507deac72c40d6c",
        dynamic: [
            b ? "row-reverse" : "row",
            e,
            g,
            c ? "column" : "column-reverse", 
        ]
    }, `main.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-direction:${b ? "row-reverse" : "row"};-ms-flex-direction:${b ? "row-reverse" : "row"};flex-direction:${b ? "row-reverse" : "row"};-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin-bottom:var(--geist-gap-double)}div.__jsx-style-dynamic-selector{width:100%;max-width:-webkit-calc(100% - ${e}px - var(--geist-gap-double));max-width:-moz-calc(100% - ${e}px - var(--geist-gap-double));max-width:calc(100% - ${e}px - var(--geist-gap-double))}@media(max-width:${g}px){main.__jsx-style-dynamic-selector{-webkit-flex-direction:${c ? "column" : "column-reverse"};-ms-flex-direction:${c ? "column" : "column-reverse"};flex-direction:${c ? "column" : "column-reverse"}}div.__jsx-style-dynamic-selector{max-width:unset}}`));
b({});
