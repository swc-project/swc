class Foo {
    [1] = 2;
    ["3"] = 4;
    [`5`] = 6;
    [`lit${"lit"}`] = "lit";
    [`tpl${`tpl`}`] = `tpl`;
    [`lit${1 + 1}`] = `lit`;
    [`complex${"123".length()}`] = `complex`;
}
