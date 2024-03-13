d(()=>{
    var obj = {
        key: "some string"
    }, b = ()=>(a, obj.key);
    return ()=>b;
});
