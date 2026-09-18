function sideEffect() {
    console.log("effect");
}
function condition() {
    return false;
}
function run() {
    sideEffect();
    for(; condition(););
}
