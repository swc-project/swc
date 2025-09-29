import { useState } from 'react';
import './index.css';
export const AppPage = ()=>{
    const [active, setActive] = useState(false);
    const case1 = async ()=>{
        // error case
        const module = await import(/* webpackChunkName: "a/en" */ "./message/en.json");
        return module;
    };
    const case2 = async ()=>{
        const locale = 'zh';
        const module = await import(/* webpackChunkName: "b/zh" */ "./message/".concat(locale, ".json"));
        return module;
    };
    const case3 = async ()=>{
        const module = await import(/* webpackChunkName: "c/cn" */ './message/cn.json');
        return module;
    };
    const case4 = async ()=>{
        const module = await import(/* webpackChunkName: "d/ja" */ "./message/ja.json");
        return module;
    };
    return;
};
