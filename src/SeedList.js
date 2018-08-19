import React, { Component } from 'react';
import Label from 'react-bootstrap/lib/Label';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import BCH from './bch';

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
				<h2>Seed List</h2>

				<ListGroup>
					{vWords}
				</ListGroup>
			</div>
		);	
	}
}

export default SeedList;
