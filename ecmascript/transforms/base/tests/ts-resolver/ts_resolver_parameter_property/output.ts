class PartWriter {
    constructor(private writer__2: Deno.Writer, readonly boundary__2: string, public headers__2: Headers, isFirstBoundary__2: boolean){
        let buf__2 = "";
        if (isFirstBoundary__2) {
            buf__2 += `--${boundary__2}\r\n`;
        } else {
            buf__2 += `\r\n--${boundary__2}\r\n`;
        }
        for (const [key__3, value__3] of headers__2.entries()){
            buf__2 += `${key__3}: ${value__3}\r\n`;
        }
        buf__2 += `\r\n`;
        this.partHeader = buf__2;
    }
}
