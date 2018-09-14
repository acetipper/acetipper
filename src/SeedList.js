import React, { Component } from 'react';
import Label from 'react-bootstrap/lib/Label';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import {Paper, Typography} from '@material-ui/core';

class SeedList extends Component { 

	constructor(props) {
	
		super(props);

		this.state = {
			mneumonic: localStorage.getItem('seed')
		};
	} 

	render() {

		let words = this.state.mneumonic.split(' ');

		let vWords = words.map((word, i) => {
			return (
				<ListGroupItem key={i}><Label>#{i+1}</Label> {word}</ListGroupItem>
			);
		});

		return (
			<div>
				<h2>Seed List - Backup this up!</h2>

				<Paper elevation={15} style={{marginTop:'20px', marginBottom:'30px'}}>
			        <Typography style={{padding:"11px", color:"#0f0", background:"black", fontSize:'1.2em', fontFamily:'courier'}}>
			          {this.state.mneumonic}
			        </Typography>
      			</Paper>

				<ListGroup>
					{vWords}
				</ListGroup>
			</div>
		);	
	}
}

export default SeedList;
