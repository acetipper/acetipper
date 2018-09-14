import React, { Component } from 'react';
import BCH from './bch';
import {Alert, Button} from 'react-bootstrap/lib';

class ImportSeedList extends Component { 

	constructor(props) {
	
		super(props);

		this.state = {
			seed: '',
			disabled: true
		};
	} 

	onImport(e) {
		e.stopPropagation();

		var len = this.state.seed.split(' ').length;

		if (len !== 24) {
			alert('Invalid seed list - not 24 words - ' + this.state.seed);
			return;
		}

		localStorage.setItem('seed', this.state.seed);
		BCH.initialize();

		alert('Updated seed list.  Please restart application for changes to take effect.');
	}

	onBlur(e) {
		this.setState({seed: e.target.value});
	}

	onChange(e) {
		var value = e.target.value.trim();

		if (!value) return;

		var list = value.split(' ');

		var disabled = (list.length !== 24);

		this.setState({...this.state, disabled, seed: value});
	}

	render() {

		var len = this.state.seed.split(' ').length;

		if (this.state.seed.length === 0) len = 0;

		var msg = 'button will be enabled when a 24-word seed list has been entered (' + len + ' words currently)';

		if (!this.state.disabled) msg = '';

		return (
			<div>
				<h2>Import Seed List</h2>

				<Alert bsStyle="danger" style={{marginTop:'40px'}}>

          			<h3>Make sure you have backed-up existing seed list!</h3>

          			<p style={{marginBottom:'20px', fontStyle:'bold', fontSize:'1.3em'}}>
            			* This operation cannot be undone.  <br/>
            			* If you did not backup existing seed list, you will lose access to any funds at those addresses.
          			</p>

          			<p>Enter 24-Word Seed List to Import</p>

	          		<textarea onBlur={this.onBlur.bind(this)} onChange={this.onChange.bind(this)} style={{border:'1px solid black', width:'450px', height:'150px', color:'black', fontFamily:'courier'}}/> 

          			<p style={{marginTop:'20px'}}>
            			<Button disabled={this.state.disabled} bsStyle="danger" onClick={this.onImport.bind(this)}>Import Seed List</Button>
            			<br/>
            			<br/>
            			{msg}
          			</p>

        		</Alert>

			</div>
		);	
	}
}

export default ImportSeedList;
