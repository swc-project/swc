import { ModA } from 'mod';
import { Variable } from 'constant';

export const Export: typeof ModA<typeof Variable> = 0;
