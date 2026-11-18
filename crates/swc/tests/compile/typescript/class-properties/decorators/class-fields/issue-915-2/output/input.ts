Deno.test("[ws] WebSocket should act as asyncIterator", async ()=>{
    let Frames = /*#__PURE__*/ function(Frames) {
        Frames[Frames["ping"] = 0] = "ping";
        Frames[Frames["hello"] = 1] = "hello";
        Frames[Frames["close"] = 2] = "close";
        Frames[Frames["end"] = 3] = "end";
        return Frames;
    }({});
});
