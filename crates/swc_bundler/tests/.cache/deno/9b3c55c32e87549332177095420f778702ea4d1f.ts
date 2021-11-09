// Loaded from https://deno.land/x/deno_image@v0.0.3/mime-type.ts


/**
 * Return mime type of a file
 * @param headerString - header of file
 * List here:
 * https://en.wikipedia.org/wiki/List_of_file_signatures
 * https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 */
export function mimeType(imgFile: Uint8Array) {
  // Get mime type
  const arr = imgFile.subarray(0, 4);
  let header = "";
  for (let i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }

  let type = "unknown";
  switch (header) {
    case "89504e47":
      type = "image/png";
      break;
    case "47494638":
      type = "image/gif";
      break;
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
      type = "image/jpeg";
      break;
    default:
      type = "unknown";
      break;
  }
  return type;
}