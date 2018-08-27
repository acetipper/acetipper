import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tx from './Tx';
import {axn_newTip, axn_setTxError} from './actions';
import {store} from './store';
import {Util} from './Util';

var ace_debug = false;

class TxList extends Component { 

	onNewTip() {
		store.dispatch(axn_setTxError(''));
		store.dispatch(axn_newTip());
	}

	_showNewTipButton() {

		var tips = store.getState().tips;

		for (var i=0; i < tips.length; i++) {
			if (tips[i].value === 0 && !tips[i].accepted) {
				return false;
			}
		}

		return true;
	}

	_vNewTip() {

		if (this._showNewTipButton()) {

			return (
				<Button bsStyle="primary" bsSize="large" onClick={this.onNewTip.bind(this)}>
			    	Create New Tip!
			    </Button>
			);
		}

		var popover = (
		  <Popover title="Action Disabled" id="disabled-new-tip-button">
		    <strong>Creating New Tips</strong> is disabled while listening for new transactions.
		  </Popover>
		);

		return (

			<OverlayTrigger placement="right" trigger={['hover','focus']} overlay={popover}>
			
				<Button  bsStyle="primary" bsSize="large" style={{opacity:0.5}}>
			    	Create New Tip!
			    </Button>

		    </OverlayTrigger>
		);
	}

	render() {

		var tips = store.getState().tips;

		var v_tips = tips.map((tx, i) => {

			if (ace_debug && i > 0) return (<div key={tx.address} />);

			var tx_view = Util.getTxView(tx.address);

			return (
				<Tx key={tx.address} tx={tx} tx_view={tx_view} display={Util.getDisplay(tx)} />
			);
		});

		v_tips.reverse();

		var v_new_tip = this._vNewTip();

		var v_error;

		if (store.getState().tx_error) {
			v_error = (
				<Alert bsStyle="warning" style={{marginTop:'20px'}}>
				{store.getState().tx_error}
				</Alert>
			);
		}

		return (
			<div>
				<h1>Transactions</h1>

				{v_new_tip}
				{v_error}
				{v_tips}				

			</div>
		);	
	}
}

export default TxList;
