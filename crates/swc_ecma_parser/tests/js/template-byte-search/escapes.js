/* prettier-ignore */
`abcdefghijklmnopqrstuvwxyz12345\`escaped`;
`abcdefghijklmnopqrstuvwxyz12345\${literal}`;
`abcdefghijklmnopqrstuvwxyz12345\\\n\u{1f600}\uD800`;
`abcdefghijklmnopqrstuvwxyz12345\
continued${value}tail`;
tag`abcdefghijklmnopqrstuvwxyz12345\xZ${value}abcdefghijklmnopqrstuvwxyz12345\uZ`;
tag`abcdefghijklmnopqrstuvwxyz12345\8\9`;
