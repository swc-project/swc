var themeConfig = {
    compHome: [
        {
            compKey: "TaskPage"
        },
        {
            compKey: "DDDDD"
        }
    ]
}
const ret = themeConfig?.compHome.find((item) => {
    return item.compKey === "TaskPage";
});
console.log("ret====", ret)