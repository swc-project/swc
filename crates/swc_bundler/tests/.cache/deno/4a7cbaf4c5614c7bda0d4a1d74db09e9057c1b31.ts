// Loaded from https://deno.land/x/abc@v1.2.4/_mime.ts


const charsetUTF8 = "charset=UTF-8";

export const ApplicationGZip = "application/gzip",
  ApplicationJSON = "application/json",
  ApplicationJSONCharsetUTF8 = ApplicationJSON + "; " + charsetUTF8,
  ApplicationJavaScript = "application/javascript",
  ApplicationJavaScriptCharsetUTF8 = ApplicationJavaScript + "; " +
    charsetUTF8,
  ApplicationXML = "application/xml",
  ApplicationXMLCharsetUTF8 = ApplicationXML + "; " + charsetUTF8,
  TextMarkdown = "text/markdown",
  TextMarkdownCharsetUTF8 = TextMarkdown + "; " + charsetUTF8,
  TextXML = "text/xml",
  TextXMLCharsetUTF8 = TextXML + "; " + charsetUTF8,
  ApplicationForm = "application/x-www-form-urlencoded",
  ApplicationProtobuf = "application/protobuf",
  ApplicationMsgpack = "application/msgpack",
  TextHTML = "text/html",
  TextHTMLCharsetUTF8 = TextHTML + "; " + charsetUTF8,
  TextPlain = "text/plain",
  TextPlainCharsetUTF8 = TextPlain + "; " + charsetUTF8,
  MultipartForm = "multipart/form-data",
  OctetStream = "application/octet-stream",
  ImageSVG = "image/svg+xml",
  ApplicationWASM = "application/wasm";

export const DB: Record<string, string | undefined> = {
  ".md": TextMarkdownCharsetUTF8,
  ".html": TextHTMLCharsetUTF8,
  ".htm": TextHTMLCharsetUTF8,
  ".json": ApplicationJSON,
  ".map": ApplicationJSON,
  ".txt": TextPlainCharsetUTF8,
  ".ts": ApplicationJavaScriptCharsetUTF8,
  ".tsx": ApplicationJavaScriptCharsetUTF8,
  ".js": ApplicationJavaScriptCharsetUTF8,
  ".jsx": ApplicationJavaScriptCharsetUTF8,
  ".gz": ApplicationGZip,
  ".svg": ImageSVG,
  ".wasm": ApplicationWASM,
};
