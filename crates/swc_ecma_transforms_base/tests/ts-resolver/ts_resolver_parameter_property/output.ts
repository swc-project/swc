class PartWriter__1 {
    constructor(private writer__3: Deno.Writer, readonly boundary__3: string, public headers__3: Headers, isFirstBoundary__3: boolean){
        let buf__3 = "";
        if (isFirstBoundary__3) {
            buf__3 += `--${boundary__3}\r\n`;
        } else {
            buf__3 += `\r\n--${boundary__3}\r\n`;
        }
        for (const [key__4, value__4] of headers__3.entries()){
            buf__3 += `${key__4}: ${value__4}\r\n`;
        }
        buf__3 += `\r\n`;
        this.partHeader = buf__3;
    }
}
