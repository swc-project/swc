const selectServer = () => {
    selectServers();
};
function selectServers() {
    function retrySelection() {
        var descriptionChangedHandler = () => {
            selectServers();
        };
        leak(descriptionChangedHandler);
    }
    retrySelection();
}
leak(() => Topology);
console.log("PASS");
