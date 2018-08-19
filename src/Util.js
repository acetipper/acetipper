import {store} from './store';

var util = {};

util.formatDate = function(date) {

	date = new Date(date);

	var str = (1 + date.getMonth()) + 
			'/' + date.getDate() + 
			'/' + date.getFullYear();

	return str;	
};

util.getTxView = function(address) {

	var key = 'ace-tipper-tx-view:' + address;

	var view = localStorage.getItem(key);

	if (view) return view;

	view = store.getState().tx_view[address];

	return view || 'default';
};

util.isGifted = function(address) {

	var key = 'ace-tipper-gifted:' + address;

	var gifted = localStorage.getItem(key);

	if (gifted === 'true') return true;
	if (gifted === 'false') return false;

	gifted = store.getState().gifted[address];

	return gifted === 'true' || false;
};

export const Util = util;