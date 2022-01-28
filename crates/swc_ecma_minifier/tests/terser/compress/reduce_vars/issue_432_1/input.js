const selectServer = () => {
    selectServers();
};
function selectServers() {
    const retrySelection = () => {
        var descriptionChangedHandler = () => {
            selectServers();
        };
    };
    retrySelection();
}
leak(() => Topology);
console.log("PASS");
