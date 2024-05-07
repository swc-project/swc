describe("multiline comments", ()=>{
    it("test1", ()=>{
        expect(false).toBe(true);
    });
    it("test2", ()=>{
        /**/ expect(false).toBe(true);
    });
    it("test3", ()=>{
        /*
         *
         */ expect(false).toBe(true);
    });
    it("test4", ()=>{
        expect(false).toBe(true);
    });
});
