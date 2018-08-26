import {createStore} from 'redux';
import reducer from '../reducers';

const intitial_state = {
	tips:[],
	USD_BCH: 1,
	listening_timeout_secs: 10,
	retry_secs: 11,
	tx_error: '',
	tx_view: {},
	gifted: {}
};

export const store = createStore(reducer, intitial_state);
