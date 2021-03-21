import { MultipartReader } from "https://deno.land/std@0.88.0/mime/multipart.ts";
import { StringReader } from "https://deno.land/std@0.88.0/io/readers.ts";

// carriage returns added for running on POSIX, not needed if on windows
const content = `--------------------------366796e1c748a2fb\r
Content-Disposition: form-data; name="payload"\r
Content-Type: text/plain\r
\r
CONTENT\r
--------------------------366796e1c748a2fb--`

const boundary = "------------------------366796e1c748a2fb";

console.log(content);

const stringReader = new StringReader(content);

const multipartReader = new MultipartReader(stringReader, boundary);
const formData = await multipartReader.readForm()
for (const entry of formData.entries()) {
    console.log("entry", entry);
}
console.log("formdata", formData);