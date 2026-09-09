const urlToString = URL.toString;
[URL, URL.toString = 0].join("");
URL.toString = urlToString;

const urlSearchParamsToString = URLSearchParams.toString;
[URLSearchParams, URLSearchParams.toString = 0].join("");
URLSearchParams.toString = urlSearchParamsToString;

const textDecoderToString = TextDecoder.toString;
[TextDecoder, TextDecoder.toString = 0].join("");
TextDecoder.toString = textDecoderToString;

const textEncoderToString = TextEncoder.toString;
[TextEncoder, TextEncoder.toString = 0].join("");
TextEncoder.toString = textEncoderToString;

const domExceptionToString = DOMException.toString;
[DOMException, DOMException.toString = 0].join("");
DOMException.toString = domExceptionToString;
