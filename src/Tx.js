import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Spinner from 'react-spinkit';
import TxValue from './TxValue';
import Certificate from './Certificate';
import {axn_setGiftedOn, axn_setTxView, axn_setTxError, axn_pruneLastTip, axn_setFunding, axn_newTip} from './actions';
import {store} from './store';
import BCH from './bch';
import Modal from 'react-bootstrap/lib/Modal';
import ReactToPrint from "react-to-print";
import Alert from 'react-bootstrap/lib/Alert';
import Currency from 'react-currency-formatter';
import {Util} from './Util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';

var ace_debug = false;

class Tx extends Component { 

	constructor(props) {
	
		super(props);

		this.state = {
			show_qr: true,
			listening: true,
			start_trying_ms: 0,
			show_printer: false
		};
	} 

	onHideIt() {
		
		var tx = this.props.tx;

		store.dispatch( axn_setTxView(tx.address, 'compact') );
	}

	onToggleQrCode() {

		this.setState({show_qr: !this.state.show_qr});
	}

	enoughTrying() {

		if (this.state.start_trying_ms === 0) {
			this.setState({start_trying_ms: +new Date()});
			return false;
		}

		var now = +new Date();

		if (now - this.state.start_trying_ms > (store.getState().listening_timeout_secs * 1000) ) {

			return true;
		}

		return false;
	}

	checkFunding() {

		var tx = this.props.tx;
		var _this = this;
		var retry_secs = store.getState().retry_secs;

					if (ace_debug) {
						store.dispatch(axn_setFunding(tx.address, 0.34534545));				
						 this.setState( {
						 	listening: false,
						 	show_qr: false
						 });

						return;
					}

		BCH.BITBOX.Address.details(tx.address).then(

			result => {

				/// debug
				console.log(result);

				var balance = parseFloat(result.balance) + parseFloat(result.unconfirmedBalance) + parseFloat(result.totalSent);
				var appearances = parseInt(result.txApperances, 10) + parseInt(result.unconfirmedTxApperances, 10);
				var total_sent_sat = parseInt(result.totalSentSat, 10);

				// This address does not appear in blockchain.
				// It has not even been funded yet.
				if (appearances === 0 ) {

					if (_this.enoughTrying.bind(_this)()) {
						store.dispatch(axn_setTxError('The transaction was not funded in time. No problem! Create New Tip and try again.'));
						store.dispatch(axn_pruneLastTip());	
						console.log('had enough');			
						return;
					}

					console.log('trying');					
					setTimeout( _this.checkFunding.bind(_this), retry_secs * 1000 );

					return;
				}

				if (balance === 0) {
					// appearances are not 0, so it must be accepted
					store.dispatch(axn_setFunding(tx.address, balance, true));				
					store.dispatch(axn_newTip());				

					_this.setState( {
						listening: false,
						show_qr: false
					});			

					return;
				}

				// It has been funded, but not accepted
				if (appearances === 1 ) {

					store.dispatch(axn_setFunding(tx.address, balance, false));		
					store.dispatch(axn_newTip());				

					_this.setState( {
						listening: false,
						show_qr: false
					});

					return;
				}

				// we have 2 or more transactions
				// this could be because we double funded or because they took the tip

				if (total_sent_sat === 0) {

					// has not been accepted yet

					store.dispatch(axn_setFunding(tx.address, balance, false));				
					store.dispatch(axn_newTip());				

					_this.setState( {
						listening: false,
						show_qr: false
					});

					return;
				}

				// It has been accepted

				store.dispatch(axn_setFunding(tx.address, balance, true));				
				store.dispatch(axn_newTip());				

				_this.setState( {
					listening: false,
					show_qr: false
				});			
			}, 

			err => {
				console.log('error: ' + err);
			}
		);
	}

	onShowPrinter() {

		this.setState({show_printer: true});
	}

	get_take_by_date() {
		var tx = this.props.tx;
		var key = 'ace-tipper-take-by-date:' + tx.address;

		var c = localStorage.getItem(key);

		if (c) return c;

		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		
		c = new Date(year + 1, month, day)

		return c;
	}

	get_gifted_on_date() {

		var tx = this.props.tx;
		var key = 'ace-tipper-gifted-on-date:' + tx.address;

		var c = localStorage.getItem(key);

		if (c) return c;

		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		
		c = new Date(year, month, day)

		return c;
	}

	vModal(tx) {
		var value_bch = tx.value;
		var value_usd = store.getState().USD_BCH * tx.value;

		let take_by_date = this.get_take_by_date();

		let v_cert = (
			<Certificate 	ref={el => (this.componentRef = el)} 
							wif={tx.wif}  
							value_usd={value_usd} 
							value_bch={value_bch} 
							take_by_date={take_by_date} />
		);

		return (

			<Modal show={this.state.show_printer} bsSize="large">
				<Modal.Header>

					<ButtonToolbar className="pull-right">
					<ButtonGroup >
							<ReactToPrint 
								trigger={() => <Button bsStyle="success">Print</Button> }
								content={() => this.componentRef}
							/>
					</ButtonGroup>
					<ButtonGroup>
							<Button bsStyle="default" 
									onClick={() => this.setState({ show_printer: false })}>
					          Close
					        </Button>
					</ButtonGroup>
					</ButtonToolbar>


				</Modal.Header>

				<Modal.Body>

					{v_cert}

					<Alert bsStyle="info">
						Bitcoin Cash amount = {value_bch} / USD amount = <Currency quantity={value_usd} currency="USD" />
					</Alert>

				</Modal.Body>
			</Modal>
		);
	}

	vButtonGroupMarkAsGifted() {
		var tx = this.props.tx;

		if (!this.state.listening && this.state.show_qr) {
			return;
		}

		if (tx.accepted) {
			return;
		}

		if (this.state.listening) {
			return;
		}

		var key = 'ace-tipper-gifted-on-date:' + tx.address;
		var giftedOnDate = localStorage.getItem(key);

		if (giftedOnDate) {
			return (
				<ButtonGroup bsSize="xsmall">
					<Button disabled>
						was gifted {Util.formatDate(giftedOnDate)}
					</Button>
				</ButtonGroup>
			);
		}

		return (
			<ButtonGroup bsSize="xsmall">
				<Button onClick={this.onMarkAsGifted.bind(this)}>
					mark as gifted
				</Button>
			</ButtonGroup>
		);
	}

	componentDidMount() {

		this.checkFunding.bind(this)();
	}

	onMarkAsGifted() {

		var tx = this.props.tx;

		var key = 'ace-tipper-take-by-date:' + tx.address;
		localStorage.setItem(key, this.get_take_by_date());

		store.dispatch( axn_setGiftedOn(tx.address, this.get_gifted_on_date()) );
	}

	render() {

		var tx = this.props.tx;

		var show_listening = this.state.listening
		var show_button_details_as_hide = !this.state.listening && this.state.show_qr;
		var show_button_details = !this.state.listening && !this.state.show_qr;
		var show_block_explorer = this.state.listening || this.state.show_qr;
		var show_award = tx.accepted;
		var tx_is_default_view = this.props.tx_view === 'default';
		var tx_is_compact_view = this.props.tx_view === 'compact';

		/// debug
		// tx.accepted = true;
		// show_award = true;
		//show_listening = true;
		//this.state.show_qr=true;

		let qr_code;

		if (this.state.show_qr) {

			qr_code = <QRCode value={tx.address} />
		}

		let v_listening;

		if (show_listening) {

			v_listening = (

				<div className="Spinner-Column">
					<div style={{'position':'relative', 'left':'60px', 'top':'40px'}}>
						<Spinner name="timer" color="red"/>
					</div>

					<p className="send-bch">Send Some Bitcoin Cash</p>
				</div>
			);
		}

		let v_button_show_details = null;
		let v_button_print = null;

		if (show_button_details_as_hide) {
			v_button_show_details = (
				<Button onClick={this.onToggleQrCode.bind(this)}>
			      hide details
			    </Button>
			);
		}

		if (show_button_details) {
			v_button_show_details = (
				<Button onClick={this.onToggleQrCode.bind(this)}>
			      show details
			    </Button>
			);

			v_button_print = (
				<Button onClick={this.onShowPrinter.bind(this)}>
			      print for gifting
			    </Button>
			);
		}

		var v_button_group_mark_as_gifted = this.vButtonGroupMarkAsGifted();

		let v_block_explorer = null;

		if (show_block_explorer) {
			v_block_explorer = <div style={{marginBottom:'10px'}}><a href={'https://explorer.bitcoin.com/bch/address/' + tx.address} target="_blank">{tx.address}</a></div>;
		}

		let v_modal = this.vModal(tx);

		var v_award;

		if (show_award && tx_is_default_view) {

			v_award = (
				<div className="Column" style={{verticalAlign:'top', paddingTop:'5px', paddingLeft:'75px', paddingRight: '20px'}}>
					<div style={{paddingLeft:'15px'}}>
				 		<FontAwesomeIcon icon={faAward} size="7x"  style={{color:'#f6b500'}}/>
				 	</div>

					<div style={{marginTop:'4px', fontSize:'1.1em', fontWeight:'bold', opacity:'0.8'}}>
						Tip Accepted!
					</div>

					<Button onClick={this.onHideIt.bind(this)} bsStyle="warning" bsSize="xsmall" style={{width:'110px'}}>
						compact view
					</Button>

				</div>
			);
		}

		var v_button_toolbar;

		if (tx_is_default_view) {

			v_button_toolbar = (
				<ButtonToolbar>
					<ButtonGroup bsSize="xsmall">
						{v_button_show_details}
					</ButtonGroup>

					<ButtonGroup bsSize="xsmall">
						{v_button_print}
					</ButtonGroup>

					{v_button_group_mark_as_gifted}

				</ButtonToolbar>
			);
		}

		var paddingBottom = 15;

		if (tx_is_compact_view) {
			paddingBottom = 0;
		}

		return (

			<div style={{position:'relative', display: this.props.display}}>

				<div style={{	borderBottom:"0px solid #bbb", 
								paddingTop:"1px", 
								paddingLeft:"25px", 
								paddingBottom: paddingBottom + "px", 
								marginBottom:"15px", 
								marginTop:"15px", 
								background:'#f6f8fa'}}>

					<div className="Row">
			
						<div className="Column">

							<TxValue tx={tx} show_memo={!show_listening} tx_view={this.props.tx_view} />

							{qr_code}

							<div />

						</div>

						{v_listening}

					</div>

					{v_block_explorer}				

					{v_button_toolbar}

					{v_modal}

				</div>

				<div style={{position:'absolute', left:'200px', top:'0px'}}>
					{v_award}
				</div>

			</div>
		);	
	}
}

export default Tx;
