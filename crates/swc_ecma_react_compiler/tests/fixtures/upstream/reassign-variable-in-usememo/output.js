import { c as _c } from "react/compiler-runtime";
export function useItemLanguage(items) {
  const $ = _c(2);
  let language;
  if ($[0] !== items) {
    language = null;
    items.forEach((item) => {
      if (item.language != null) {
        language = item.language;
      }
    });
    $[0] = items;
    $[1] = language;
  } else {
    language = $[1];
  }
  return language;
}
