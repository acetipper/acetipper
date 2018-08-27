import {createStore} from 'redux';
import reducer from '../reducers';

const intitial_state = {
	tips:[],
	USD_BCH: 1,
	listening_timeout_secs: 15,
	retry_secs: 16,
	tx_error: '',
	tx_view: {},
	gifted: {}
};

export const store = createStore(reducer, intitial_state);
