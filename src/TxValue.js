import React, { Component } from 'react';
import Currency from 'react-currency-formatter';
import Label from 'react-bootstrap/lib/Label';
import {store} from './store';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/lib/Button';
import {axn_hideTx, axn_setTxView} from './actions';

class TxValue extends Component { 

	constructor(props) {
	
		super(props);

		var tx = this.props.tx;		

		var memo = localStorage.getItem('ace-tipper:' + tx.address) || '';		

		this.state = {
			memo
		};

		this.onMemoChange = this.onMemoChange.bind(this);
	}

	onMemoChange(e) {

		var memo = e.target.value;

 		this.setState({ memo });

		var tx = this.props.tx;		

		localStorage.setItem('ace-tipper:' + tx.address, memo);		
	}

	memo() {

		return (

			<div style={{marginBottom:'10px', border:'0px solid red'}}>

		        <TextField
		          	value={this.state.memo}
		          	onChange={this.onMemoChange}
		          	label="Memo"
		          	style={{width:'150px'}}
		        />

		    </div>
		);
	}

	onUnHideIt() {

		var tx = this.props.tx;

		store.dispatch( axn_setTxView(tx.address, 'default') );
	}

	onHideTx() {

		var tx = this.props.tx;

		store.dispatch( axn_hideTx(tx.address) );
	}

	hasBeenGifted() {
		var tx = this.props.tx;
		var key = 'ace-tipper-gifted-on-date:' + tx.address;
		
		return !!localStorage.getItem(key);
	}

	render() {

		var tx = this.props.tx;

		var v_memo;

		var tx_is_default_view = (this.props.tx_view === 'default');
		var tx_is_compact_view = (this.props.tx_view === 'compact');

		if (this.props.show_memo && tx_is_default_view) {
			v_memo = this.memo.bind(this)();
		}

		var background, color;
		var style = 'info';
		var beenGifted = this.hasBeenGifted();
		var labelPostfix = ' - needs gifting ';

		if (tx.value === 0) {
			labelPostfix = ' - needs funding ';
		}

		if (beenGifted) {
			style = 'success';
			labelPostfix = ' - been gifted ';
		}

		if (tx.accepted) {
			background = '#f6b500';
			color = 'black';
			labelPostfix = ' - accepted ';
		}

		color = 'black';
		
		var v_award;

		if (tx_is_compact_view) {

			v_award = (
				<div className="Column-Top" style={{fontSize:'0.8em', paddingTop:'5px', paddingLeft: '9px'}}>
					<FontAwesomeIcon icon={faAward} size="2x"  style={{color:'#f6b500'}}/>
					<Button bsStyle="warning"  bsSize="xsmall" style={{marginLeft:'25px', position:'relative', top:'-5px'}}
							onClick={() => this.onUnHideIt.bind(this)() }>
			          detail view
			        </Button>

					<Button bsStyle="warning"  bsSize="xsmall" style={{marginLeft:'15px', position:'relative', top:'-5px'}}
							onClick={() => this.onHideTx.bind(this)() }>
			          hide forever
			        </Button>

				</div>
			);
		}

		return (
			<div>
				<div className="Row" style={{border:'0px solid red'}}>

					<div className="Column-Top" style={{fontSize:'1.5em', paddingTop:'5px'}}>
						<Label bsStyle={style} style={{fontSize:'1.0em', color, background}}>
							#{tx.index + 1}{labelPostfix}
							 {/*(<Currency quantity={store.getState().USD_BCH * tx.value} currency="USD" />)*/}
						</Label> 
					</div>

					<div className="Column-Top" style={{fontWeight:'bold', opacity:'0.9', fontSize:'1.5em', paddingLeft: '7px'}}>
						<Currency quantity={store.getState().USD_BCH * tx.value} currency="USD" />
					</div> 

					{v_award}	

				</div>

				{v_memo}

			</div>
		);
	}
};

export default TxValue;