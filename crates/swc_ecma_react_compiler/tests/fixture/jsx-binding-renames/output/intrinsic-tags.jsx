import { c as _c } from "react/compiler-runtime";
import { useReactTable } from "@tanstack/react-table";
import { useEffect } from "react";
function Toolbar() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <button/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
export function Page({ items }) {
    useEffect(()=>{
        const table = "shadow";
        console.log(table);
    }, []);
    const titles = items.map((section)=>section.title);
    const sections = items.map((section_0)=><section key={section_0.id}>{section_0.title}<section_0.Component><section_0.Component.Nested/></section_0.Component></section>);
    const names = items.map((Component)=>Component.name);
    const components = items.map((Component_0)=><Component_0/>);
    const table_0 = useReactTable({});
    return <table><Toolbar table={table_0}/>{titles.join(",")}{sections}{names.join(",")}{components}</table>;
}
