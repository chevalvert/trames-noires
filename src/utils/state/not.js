import { derived } from '.'
export default signal => derived(signal, value => !value)
