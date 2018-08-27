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

util.hideTx = function(address) {

	var key = 'ace-tipper-hidden-address:' + address;

	localStorage.setItem(key, 'true');
};

util.getDisplay = function(tx) {

	var key = 'ace-tipper-hidden-address:' + tx.address;

	if (localStorage.getItem(key)) return 'none';

	return 'default';
};

export const Util = util;