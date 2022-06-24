export function testme(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];/^toto.+/.test(b.join(""))&&global.other(!0)}
