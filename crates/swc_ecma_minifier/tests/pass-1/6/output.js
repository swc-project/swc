export const loadScript = (options)=>{
    const { id, onLoad = ()=>null, ...rest } = options;
    return new Promise((resolve)=>{
        let scriptEl = document.getElementById(id);
        const isMounted = !!scriptEl;
        if (!scriptEl && (scriptEl = document.createElement("script"), Object.keys(rest).forEach((key)=>scriptEl[key] = rest[key]), scriptEl.id = id, scriptEl.async = !0, scriptEl.type = "text/javascript"), rest.src && scriptEl.addEventListener("load", ()=>(onLoad(), resolve())), !isMounted && // when enabling swcMinify, this section won't be executed
        document.getElementsByTagName("head")[0].appendChild(scriptEl), !rest.src) return onLoad(), resolve();
    });
};
