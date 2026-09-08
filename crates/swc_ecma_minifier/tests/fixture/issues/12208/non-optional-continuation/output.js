for (const access of [
    ()=>null.y,
    ()=>(null)()
])try {
    access();
} catch (error) {
    console.log(error.name);
}
