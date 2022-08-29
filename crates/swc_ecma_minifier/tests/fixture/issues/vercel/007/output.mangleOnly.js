import e from "styled-jsx/style";
const i = ({ right: i = false , top: t = false , sidebar: r , sidebarWidth: c = 230 , hideOnMobile: s = false , breakpoint: o = 730 , children: a ,  })=>React.createElement("main", {
        className: e.dynamic([
            [
                "4507deac72c40d6c",
                [
                    i ? "row-reverse" : "row",
                    c,
                    o,
                    t ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, React.createElement(Sidebar, {
        width: c,
        right: i,
        hide: s,
        breakpoint: o
    }, r), React.createElement("div", {
        className: e.dynamic([
            [
                "4507deac72c40d6c",
                [
                    i ? "row-reverse" : "row",
                    c,
                    o,
                    t ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, a), React.createElement(e, {
        id: "4507deac72c40d6c",
        dynamic: [
            i ? "row-reverse" : "row",
            c,
            o,
            t ? "column" : "column-reverse", 
        ]
    }, `main.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-direction:${i ? "row-reverse" : "row"};-ms-flex-direction:${i ? "row-reverse" : "row"};flex-direction:${i ? "row-reverse" : "row"};-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin-bottom:var(--geist-gap-double)}div.__jsx-style-dynamic-selector{width:100%;max-width:-webkit-calc(100% - ${c}px - var(--geist-gap-double));max-width:-moz-calc(100% - ${c}px - var(--geist-gap-double));max-width:calc(100% - ${c}px - var(--geist-gap-double))}@media(max-width:${o}px){main.__jsx-style-dynamic-selector{-webkit-flex-direction:${t ? "column" : "column-reverse"};-ms-flex-direction:${t ? "column" : "column-reverse"};flex-direction:${t ? "column" : "column-reverse"}}div.__jsx-style-dynamic-selector{max-width:unset}}`));
i({});
