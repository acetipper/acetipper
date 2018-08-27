export function axn_newTip() {
	return {
		type: 'axn_newTip'
	}
}

export function axn_setTxError(tx_error) {
	return {
		type: 'axn_setTxError',
		tx_error
	}
}

export function axn_hideTx(address) {
	return {
		type: 'axn_hideTx',
		address
	}
}

export function axn_setGiftedOn(address, date) {
	return {
		type: 'axn_setGiftedOn',
		address,
		date
	}
}

// default, compact
export function axn_setTxView(address, tx_view) {
	return {
		type: 'axn_setTxView',
		address,
		tx_view
	}
}

export function axn_setUsdBch(usd) {
	return {
		type: 'axn_setUsdBch',
		usd
	}
}

export function axn_setFunding(address, value, accepted) {
	return {
		type: 'axn_setFunding',
		address,
		value,
		accepted
	}
}

export function axn_pruneLastTip() {
	return {
		type: 'axn_pruneLastTip'
	}
}
