{
    let asyncId = (setTimeout(()=>{
        console.info(asyncId);
    }, 3000), 3);
}console.info("after");
