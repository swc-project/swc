// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/schema/compiler.js


/* eslint max-len: 0 */

// Redshift Table Builder & Compiler
// -------

import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import SchemaCompiler_PG from '../../postgres/schema/compiler.js';

function SchemaCompiler_Redshift() {
  SchemaCompiler_PG.apply(this, arguments);
}
inherits(SchemaCompiler_Redshift, SchemaCompiler_PG);

export default SchemaCompiler_Redshift;
