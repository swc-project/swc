/** @jsx h */
/** @jsxFrag Fragment */

import { h, jsx, Fragment} from 'https://deno.land/x/sift@0.4.3/mod.ts';

export const pageLayout = ()=>jsx(
		<>
			< !doctype html >
			<html lang='en-US' charSet='UTF-8'>
				<Head/>
				<Body/>
			</html>,
		</>
	);