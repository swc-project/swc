import e from "styled-jsx/style";
const t = ({ right: t = false , top: c = false , sidebar: i , sidebarWidth: r = 230 , hideOnMobile: a = false , breakpoint: s = 730 , children: o ,  })=>React.createElement("main", {
        className: e.dynamic([
            [
                "4507deac72c40d6c",
                [
                    t ? "row-reverse" : "row",
                    r,
                    s,
                    c ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, React.createElement(Sidebar, {
        width: r,
        right: t,
        hide: a,
        breakpoint: s
    }, i), React.createElement("div", {
        className: e.dynamic([
            [
                "4507deac72c40d6c",
                [
                    t ? "row-reverse" : "row",
                    r,
                    s,
                    c ? "column" : "column-reverse", 
                ], 
            ], 
        ])
    }, o), React.createElement(e, {
        id: "4507deac72c40d6c",
        dynamic: [
            t ? "row-reverse" : "row",
            r,
            s,
            c ? "column" : "column-reverse", 
        ]
    }, `main.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-direction:${t ? "row-reverse" : "row"};-ms-flex-direction:${t ? "row-reverse" : "row"};flex-direction:${t ? "row-reverse" : "row"};-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin-bottom:var(--geist-gap-double)}div.__jsx-style-dynamic-selector{width:100%;max-width:-webkit-calc(100% - ${r}px - var(--geist-gap-double));max-width:-moz-calc(100% - ${r}px - var(--geist-gap-double));max-width:calc(100% - ${r}px - var(--geist-gap-double))}@media(max-width:${s}px){main.__jsx-style-dynamic-selector{-webkit-flex-direction:${c ? "column" : "column-reverse"};-ms-flex-direction:${c ? "column" : "column-reverse"};flex-direction:${c ? "column" : "column-reverse"}}div.__jsx-style-dynamic-selector{max-width:unset}}`));
t({});
