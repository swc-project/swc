import {K} from 'foo'
import {T} from 'bar'

export interface I {
	prop: {[key in K]: T}
}
