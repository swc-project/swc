await (()=>{
    console.log("non-IIFE");
}), await void console.log("IIFE");
