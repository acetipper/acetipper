import BCH from '../bch';

export default (in_state, action) => {

	if (action.type === 'axn_newTip') {
		return axn_newTip(in_state);
	}

	if (action.type === 'axn_setTxError') {
		return axn_setTxError(in_state, action.tx_error);
	}

	if (action.type === 'axn_setGiftedOn') {
		return axn_setGiftedOn(in_state, action.address, action.date);
	}

	if (action.type === 'axn_setTxView') {
		return axn_setTxView(in_state, action.address, action.tx_view);
	}

	if (action.type === 'axn_setFunding') {
		return axn_setFunding(in_state, action.address, action.value, action.accepted);
	}

	if (action.type === 'axn_pruneLastTip') {

		return axn_pruneLastTip(in_state);
	}

	if (action.type === 'axn_setUsdBch') {

		return axn_setUsdBch(in_state, action.usd);
	}

	return in_state;
}

function axn_setFunding(state, address, value, accepted) {
	
	var tips = state.tips.map( (tip,i) => { 
		return { ...tip } 
	} );

	for (var i = 0; i < tips.length; i++) {
		var tip = tips[i];

		if (tip.address !== address) continue;

		tip.value = value;
		tip.accepted = accepted;

		break;
	}

	var ret = {
		...state,
		tips
	}

	return ret
}

function axn_newTip(state) {
	
	var tips = state.tips;

	var addressAndWif = BCH.getAddressAndWif(tips.length);
	var tip = {
		value: 0, 
		address: addressAndWif.address, 
		wif: addressAndWif.wif, 
		index: tips.length,
		accepted: false
	};

	tips.push(tip);

	return {
		...state,
		tips
	}
}

function axn_pruneLastTip(state) {
	
	state.tips.pop();

	return {
		...state
	}
}

function axn_setTxError(state, error) {
	
	return {
		...state,
		tx_error: error
	}
}

function axn_setGiftedOn(state, address, date) {

	var key = 'ace-tipper-gifted:' + address;
	localStorage.setItem(key, 'true');	

	var gifted = state.gifted;

	gifted[address] = true;
	
	return {
		...state,
		gifted
	};
}

function axn_setTxView(state, address, view) {

	var key = 'ace-tipper-tx-view:' + address;

	localStorage.setItem(key, view);	

	var tx_view = state.tx_view;

	tx_view[address] = view;

	return {
		...state,
		tx_view
	}
}

function axn_setUsdBch(state, usd) {
	
	return {
		...state,
		USD_BCH: usd
	}
}